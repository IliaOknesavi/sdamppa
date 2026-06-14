// =====================================================================
//  КОДЕКС — subject-agnostic content schema.
//
//  A "subject" (statistics, matan, ...) is a pluggable content module that
//  conforms to `Subject`. The engine (tooltips, gamification, calendar,
//  navigation) never imports a specific subject — only this contract. To add
//  a subject: create lib/content/<id>/ and register it in lib/content/index.ts.
//
//  Body text uses compact "codex markup" (see lib/markup.ts):
//    **bold**  *italic*  `code`
//    $inline math$    $$display math$$
//    [[term-id]]  or  [[term-id|visible label]]   → hoverable tooltip term
//    - bullet     /     1. ordered
//    (blank line separates paragraphs)
// =====================================================================

export interface GlossaryTerm {
	id: string;
	/** Canonical display name. */
	term: string;
	/** Optional one-line gloss shown under the title. */
	short?: string;
	/** Codex markup; may reference other [[terms]] → nested tooltip graph. */
	body: string;
	/** Optional KaTeX shown prominently in the card. */
	formula?: string;
	tags?: string[];
	/** Related term ids — shown as chips you can pin. */
	related?: string[];
}
export type Glossary = Record<string, GlossaryTerm>;

export type SectionKind =
	| 'definition'
	| 'theorem'
	| 'derivation'
	| 'intuition'
	| 'connection'
	| 'note'
	| 'plain';

export interface Section {
	kind?: SectionKind;
	heading?: string;
	body: string; // codex markup
}

export type Difficulty = 'base' | 'star';

export interface Task {
	id: string;
	difficulty: Difficulty;
	prompt: string; // codex markup
	hint?: string; // codex markup
	solution: string; // codex markup
	answer?: string; // short final answer (plain/markup inline)
	xp?: number;
}

export interface CodeBlock {
	title: string;
	language: 'python' | 'text';
	code: string;
	/** "В коде / в проде" — codex markup explaining the applied angle. */
	explanation?: string;
}

export interface Checkpoint {
	id: string;
	title: string;
	intro: string; // codex markup
	questions: string[]; // codex markup, self-answer prompts
	passNote?: string;
}

export interface Day {
	n: number; // 1-based position in the curriculum
	phaseId: string;
	title: string;
	chapterRef?: string; // e.g. 'ch01'
	est?: string; // estimated time, e.g. "1–2 ч"
	goal: string; // codex markup, 1–2 sentences
	sections: Section[];
	code?: CodeBlock;
	tasks: Task[];
	mastery: string[]; // self-check criteria
	checkpoint?: Checkpoint;
	/** Authored vs not-yet-filled. Drafts render a "в разработке" placeholder. */
	draft?: boolean;
}

export interface Phase {
	id: string;
	title: string;
	subtitle?: string;
	/** Hue 0..360 for a subtle per-phase tint over the subject accent. */
	hue: number;
}

export interface Subject {
	id: string; // 'statistics'
	name: string; // full title
	short: string; // 'СтатАД'
	blurb: string; // codex markup, short pitch
	accent: string; // hex → drives --accent
	glyph: string; // single glyph for the wax-seal motif
	status: 'ready' | 'soon';
	phases: Phase[];
	days: Day[]; // ordered by n
	glossary: Glossary;
}

/** Helpers shared by content modules and UI. */
export function phaseOf(subject: Subject, day: Day): Phase | undefined {
	return subject.phases.find((p) => p.id === day.phaseId);
}
export function authoredDays(subject: Subject): number {
	return subject.days.filter((d) => !d.draft).length;
}
