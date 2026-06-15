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

/**
 * A specific offering of a subject: one (global) semester in one program year.
 * The day-by-day content lives here, so the same subject can branch by semester
 * and be versioned by year (program changes over time).
 */
export interface Course {
	semester: number; // global semester number: 1, 2, 3, …
	year: number; // program version, e.g. 2026
	status: 'ready' | 'soon';
	phases: Phase[];
	days: Day[]; // ordered by n
	glossary: Glossary;
}

export interface Subject {
	id: string; // 'statistics'
	name: string; // full title
	short: string; // 'СтатАД'
	blurb: string; // codex markup, short pitch
	accent: string; // hex → drives --accent
	glyph: string; // single glyph for the wax-seal motif
	courses: Course[]; // offerings across semesters / years
}

export interface Direction {
	id: string; // 'aii'
	name: string; // 'Инженерия искусственного интеллекта'
	short: string; // 'ИИИ'
	blurb?: string;
	accent?: string; // brand colour for the direction (e.g. ИИИ electric blue)
	subjects: Subject[];
}

/** Helpers shared by content modules and UI. */
export function phaseOf(course: Course, day: Day): Phase | undefined {
	return course.phases.find((p) => p.id === day.phaseId);
}
export function authoredDays(course: Course): number {
	return course.days.filter((d) => !d.draft).length;
}
export function subjectReady(subject: Subject): boolean {
	return subject.courses.some((c) => c.status === 'ready');
}
/** Distinct semesters a subject offers, ascending. */
export function semestersOf(subject: Subject): number[] {
	return [...new Set(subject.courses.map((c) => c.semester))].sort((a, b) => a - b);
}
/** Years available for a (subject, semester), newest first. */
export function yearsOf(subject: Subject, semester: number): number[] {
	return subject.courses
		.filter((c) => c.semester === semester)
		.map((c) => c.year)
		.sort((a, b) => b - a);
}
/** Resolve a course by semester (+ optional year; defaults to latest year). */
export function getCourse(subject: Subject, semester: number, year?: number): Course | undefined {
	const matches = subject.courses.filter((c) => c.semester === semester);
	if (!matches.length) return undefined;
	if (year != null) return matches.find((c) => c.year === year);
	return matches.sort((a, b) => b.year - a.year)[0];
}
