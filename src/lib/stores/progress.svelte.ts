// =====================================================================
//  Gamification + progress — per-subject, persisted to localStorage.
//  XP from tasks/days/terms/checkpoints, daily streaks, and a rank ladder.
// =====================================================================

import { browser } from '$app/environment';

export interface SubjectProgress {
	days: Record<number, boolean>; // completed days
	tasks: Record<string, boolean>; // completed task ids
	terms: Record<string, boolean>; // studied (pinned) terms
	xp: number;
	streak: number;
	lastDay: string | null; // ISO date (YYYY-MM-DD) of last activity
	checkpoints: Record<string, number>; // checkpoint id → score %
}

const empty = (): SubjectProgress => ({
	days: {},
	tasks: {},
	terms: {},
	xp: 0,
	streak: 0,
	lastDay: null,
	checkpoints: {}
});

class Progress {
	subject = $state<string>('');
	data = $state<SubjectProgress>(empty());

	load(subject: string) {
		this.subject = subject;
		if (!browser) {
			this.data = empty();
			return;
		}
		try {
			const raw = localStorage.getItem(this.#key());
			this.data = raw ? { ...empty(), ...JSON.parse(raw) } : empty();
		} catch {
			this.data = empty();
		}
	}

	#key() {
		return `codex:progress:${this.subject}`;
	}
	#save() {
		if (browser) localStorage.setItem(this.#key(), JSON.stringify(this.data));
	}

	#today() {
		return new Date().toISOString().slice(0, 10);
	}
	#bumpStreak() {
		const today = this.#today();
		if (this.data.lastDay === today) return;
		const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
		this.data.streak = this.data.lastDay === yesterday ? this.data.streak + 1 : 1;
		this.data.lastDay = today;
	}

	addXP(n: number) {
		this.data.xp = Math.max(0, this.data.xp + n);
		this.#bumpStreak();
		this.#save();
	}
	/** Subtract XP without touching the streak — used when un-completing. */
	removeXP(n: number) {
		this.data.xp = Math.max(0, this.data.xp - n);
		this.#save();
	}

	toggleTask(id: string, xp = 12) {
		const was = !!this.data.tasks[id];
		this.data.tasks[id] = !was;
		if (!was) this.addXP(xp);
		else this.removeXP(xp);
	}
	completeDay(n: number, xp = 40) {
		if (this.data.days[n]) return;
		this.data.days[n] = true;
		this.addXP(xp);
	}
	uncompleteDay(n: number, xp = 40) {
		if (!this.data.days[n]) return;
		delete this.data.days[n];
		this.removeXP(xp);
	}
	touchTerm(id: string) {
		if (!this.data.terms[id]) {
			this.data.terms[id] = true;
			this.addXP(1);
		}
	}
	setCheckpoint(id: string, pct: number) {
		this.data.checkpoints[id] = pct;
		this.addXP(Math.round(pct / 2));
	}

	isDayDone(n: number) {
		return !!this.data.days[n];
	}
	isTaskDone(id: string) {
		return !!this.data.tasks[id];
	}
	doneCount() {
		return Object.values(this.data.days).filter(Boolean).length;
	}
	taskCount() {
		return Object.values(this.data.tasks).filter(Boolean).length;
	}
	termCount() {
		return Object.values(this.data.terms).filter(Boolean).length;
	}

	reset() {
		this.data = empty();
		this.#save();
	}
}

export const progress = new Progress();

// XP → rank ladder (codex theme)
export const RANKS = [
	{ at: 0, name: 'Послушник' },
	{ at: 60, name: 'Адепт' },
	{ at: 180, name: 'Бакалавр' },
	{ at: 380, name: 'Магистр' },
	{ at: 650, name: 'Доктор наук' },
	{ at: 1000, name: 'Архивариус' }
];

export function rankFor(xp: number) {
	let rank = RANKS[0];
	let next: (typeof RANKS)[number] | null = RANKS[1] ?? null;
	for (let i = 0; i < RANKS.length; i++) {
		if (xp >= RANKS[i].at) {
			rank = RANKS[i];
			next = RANKS[i + 1] ?? null;
		}
	}
	const floor = rank.at;
	const ceil = next ? next.at : rank.at;
	const pct = next ? Math.round(((xp - floor) / (ceil - floor)) * 100) : 100;
	return { rank, next, pct };
}
