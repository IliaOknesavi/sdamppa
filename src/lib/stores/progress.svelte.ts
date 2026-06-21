// =====================================================================
//  Gamification + progress — per-course, persisted via a PersistAdapter.
//  XP from tasks/days/studied terms, daily streaks, and a rank ladder.
//
//  Шаг 0 (готовность к опц. серверу позже):
//   · версия схемы + миграции — изменение формата не обнуляет прогресс молча;
//   · весь I/O за интерфейсом PersistAdapter — бэкенд (Supabase) подключится
//     без переписывания стора, просто другой адаптер;
//   · стрик развязан от начисления XP — раньше любое +XP (даже +1 за наведение
//     на термин) накручивало стрик; теперь стрик бампают только осознанные
//     действия (завершение дня/задачи/чекпоинта);
//   · перенос прогресса при смене года в ключе курса (раньше осиротевал);
//   · экспорт/импорт/сброс — ручной перенос между устройствами до сервера.
// =====================================================================

import { browser } from '$app/environment';

const SCHEMA_VERSION = 2; // v2: убрано неиспользуемое поле checkpoints
const PREFIX = 'codex:progress:';

export interface SubjectProgress {
	v: number; // версия схемы
	updatedAt: number; // epoch ms — ключ last-write-wins для будущего синка
	days: Record<number, boolean>; // completed days
	tasks: Record<string, boolean>; // completed task ids
	terms: Record<string, boolean>; // studied (pinned) terms
	xp: number;
	streak: number;
	lastDay: string | null; // ISO date (YYYY-MM-DD) of last activity
}

const empty = (): SubjectProgress => ({
	v: SCHEMA_VERSION,
	updatedAt: 0,
	days: {},
	tasks: {},
	terms: {},
	xp: 0,
	streak: 0,
	lastDay: null
});

// Привести сохранённый блоб к текущей схеме по БЕЛОМУ СПИСКУ полей: берём только
// известные поля с валидацией типов, легаси-ключи (напр. checkpoints из v1)
// отбрасываются. Достижения не теряются, мусор не тащится.
function migrate(raw: unknown): SubjectProgress {
	const o = (raw && typeof raw === 'object' ? raw : {}) as Partial<SubjectProgress> &
		Record<string, unknown>;
	const e = empty();
	return {
		v: SCHEMA_VERSION,
		updatedAt: typeof o.updatedAt === 'number' ? o.updatedAt : e.updatedAt,
		days: o.days && typeof o.days === 'object' ? o.days : e.days,
		tasks: o.tasks && typeof o.tasks === 'object' ? o.tasks : e.tasks,
		terms: o.terms && typeof o.terms === 'object' ? o.terms : e.terms,
		xp: typeof o.xp === 'number' ? o.xp : e.xp,
		streak: typeof o.streak === 'number' ? o.streak : e.streak,
		lastDay: typeof o.lastDay === 'string' ? o.lastDay : e.lastDay
	};
}

// --- слой персистентности: заменяемый (localStorage сейчас, сервер потом) ---
export interface PersistAdapter {
	load(key: string): SubjectProgress | null;
	save(key: string, data: SubjectProgress): void;
	remove(key: string): void;
	keys(): string[]; // все ключи прогресса (для экспорта/миграции года)
}

class LocalAdapter implements PersistAdapter {
	load(key: string): SubjectProgress | null {
		if (!browser) return null;
		try {
			const raw = localStorage.getItem(key);
			return raw ? migrate(JSON.parse(raw)) : null;
		} catch {
			return null;
		}
	}
	save(key: string, data: SubjectProgress) {
		if (browser) localStorage.setItem(key, JSON.stringify(data));
	}
	remove(key: string) {
		if (browser) localStorage.removeItem(key);
	}
	keys(): string[] {
		if (!browser) return [];
		return Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
	}
}

class Progress {
	subject = $state<string>(''); // courseKey: dir:subject:sem:year
	data = $state<SubjectProgress>(empty());
	adapter: PersistAdapter = new LocalAdapter();

	load(courseKey: string) {
		this.subject = courseKey;
		if (!browser) {
			this.data = empty();
			return;
		}
		let data = this.adapter.load(this.#key());
		// Перенос при смене года: если под текущим годом пусто, но есть прогресс
		// того же dir:subject:sem за другой год — забираем самый свежий, чтобы
		// обновление программы (смена year в контенте) не обнуляло пользователя.
		if (!data) {
			const sibling = this.#findSiblingYear(courseKey);
			if (sibling) {
				data = this.adapter.load(sibling);
				if (data) this.adapter.save(this.#key(), data); // закрепляем под новым ключом
			}
		}
		this.data = data ?? empty();
	}

	// ключ того же курса с другим годом (совпадают dir:subject:sem)
	#findSiblingYear(courseKey: string): string | null {
		const parts = courseKey.split(':');
		if (parts.length < 4) return null;
		const prefix = PREFIX + parts.slice(0, 3).join(':') + ':';
		const found = this.adapter
			.keys()
			.filter((k) => k.startsWith(prefix) && k !== this.#key());
		return found.length ? found.sort().reverse()[0] : null; // самый свежий год
	}

	#key() {
		return PREFIX + this.subject;
	}
	#save() {
		if (browser) this.data.updatedAt = Date.now();
		this.adapter.save(this.#key(), this.data);
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
	#addXpRaw(n: number) {
		this.data.xp = Math.max(0, this.data.xp + n);
	}

	/** Чистое начисление XP — БЕЗ влияния на стрик. */
	addXP(n: number) {
		this.#addXpRaw(n);
		this.#save();
	}
	/** Списать XP без касания стрика — при отмене выполнения. */
	removeXP(n: number) {
		this.#addXpRaw(-n);
		this.#save();
	}

	toggleTask(id: string, xp = 12) {
		const was = !!this.data.tasks[id];
		this.data.tasks[id] = !was;
		if (!was) {
			this.#addXpRaw(xp);
			this.#bumpStreak(); // выполнение задачи — осознанная активность
		} else {
			this.#addXpRaw(-xp);
		}
		this.#save();
	}
	completeDay(n: number, xp = 40) {
		if (this.data.days[n]) return;
		this.data.days[n] = true;
		this.#addXpRaw(xp);
		this.#bumpStreak();
		this.#save();
	}
	uncompleteDay(n: number, xp = 40) {
		if (!this.data.days[n]) return;
		delete this.data.days[n];
		this.removeXP(xp);
	}
	touchTerm(id: string) {
		if (!this.data.terms[id]) {
			this.data.terms[id] = true;
			this.addXP(1); // пассивное изучение термина — XP без стрика
		}
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
		this.adapter.remove(this.#key());
		this.data = empty();
		this.#save();
	}

	// --- перенос всего прогресса между устройствами (до серверного синка) ---
	exportAll(): string {
		const all: Record<string, SubjectProgress> = {};
		for (const k of this.adapter.keys()) {
			const d = this.adapter.load(k);
			if (d) all[k] = d;
		}
		return JSON.stringify({ kind: 'codex-progress', v: SCHEMA_VERSION, data: all }, null, 2);
	}
	importAll(json: string): { ok: boolean; count: number; error?: string } {
		try {
			const parsed = JSON.parse(json);
			const all = (parsed && parsed.data) || parsed;
			if (!all || typeof all !== 'object') return { ok: false, count: 0, error: 'неверный формат' };
			let count = 0;
			for (const [k, v] of Object.entries(all)) {
				if (!k.startsWith(PREFIX)) continue;
				this.adapter.save(k, migrate(v));
				count++;
			}
			if (this.subject) this.load(this.subject); // перечитать текущий курс
			return { ok: true, count };
		} catch (e) {
			return { ok: false, count: 0, error: e instanceof Error ? e.message : String(e) };
		}
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
