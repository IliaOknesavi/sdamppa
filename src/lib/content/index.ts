// =====================================================================
//  Catalog: Direction → Subject → Course{semester, year}.
//  To add a direction/subject: import it and add here. Engine is agnostic.
// =====================================================================
import type { Direction, Subject, Glossary, GlossaryTerm } from '$lib/types';
import { getCourse } from '$lib/types';
import { statistics } from './statistics';
import { algorithms } from './algorithms';
import { chma } from './chma';
import { matan } from './matan';
import { pytorch } from './pytorch';

export const directions: Direction[] = [
	{
		id: 'aii',
		name: 'Инженерия искусственного интеллекта',
		short: 'ИИИ',
		blurb: 'Направление подготовки. Предметы делятся по семестрам, версии — по годам программы.',
		accent: '#0000ff',
		subjects: [statistics, algorithms, chma, matan]
	},
	{
		id: 'dl',
		name: 'DL-фреймворки',
		short: 'DL',
		blurb: 'Открытый стек глубокого обучения по той же системе. Первый предмет — PyTorch.',
		accent: '#ee4c2c',
		extra: true,
		subjects: [pytorch]
	}
];

export function getDirection(id: string): Direction | undefined {
	return directions.find((d) => d.id === id);
}

export function findSubject(
	dirId: string,
	subjId: string
): { direction: Direction; subject: Subject } | undefined {
	const direction = getDirection(dirId);
	const subject = direction?.subjects.find((s) => s.id === subjId);
	if (!direction || !subject) return undefined;
	return { direction, subject };
}

export function resolveCourse(dirId: string, subjId: string, semester: number, year?: number) {
	const found = findSubject(dirId, subjId);
	if (!found) return undefined;
	const course = getCourse(found.subject, semester, year);
	if (!course) return undefined;
	return { direction: found.direction, subject: found.subject, course };
}

/** Термин глоссария с указанием, откуда он (для страницы-указателя). */
export interface IndexedTerm {
	term: GlossaryTerm;
	subjectName: string;
	subjectShort: string;
	subjectId: string;
	directionId: string;
}

/**
 * Сводный указатель ВСЕХ терминов по направлениям→предметам→курсам.
 * Возвращает объединённый Glossary (для движка подсказок: вложенные [[id]]
 * резолвятся) и отсортированный по-русски список с источником (для отображения).
 * Дубли по id берутся из первого встреченного курса.
 */
export function glossaryIndex(): { glossary: Glossary; terms: IndexedTerm[] } {
	const glossary: Glossary = {};
	const terms: IndexedTerm[] = [];
	for (const d of directions) {
		for (const s of d.subjects) {
			for (const c of s.courses) {
				for (const id in c.glossary) {
					if (glossary[id]) continue;
					const term = c.glossary[id];
					glossary[id] = term;
					terms.push({
						term,
						subjectName: s.name,
						subjectShort: s.short,
						subjectId: s.id,
						directionId: d.id
					});
				}
			}
		}
	}
	terms.sort((a, b) => a.term.term.localeCompare(b.term.term, 'ru'));
	return { glossary, terms };
}
