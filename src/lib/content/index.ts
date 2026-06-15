// =====================================================================
//  Catalog: Direction → Subject → Course{semester, year}.
//  To add a direction/subject: import it and add here. Engine is agnostic.
// =====================================================================
import type { Direction, Subject } from '$lib/types';
import { getCourse } from '$lib/types';
import { statistics } from './statistics';
import { matan } from './matan';

export const directions: Direction[] = [
	{
		id: 'aii',
		name: 'Инженерия искусственного интеллекта',
		short: 'ИИИ',
		blurb: 'Направление подготовки. Предметы делятся по семестрам, версии — по годам программы.',
		accent: '#0000ff',
		subjects: [statistics, matan]
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
