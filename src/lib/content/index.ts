// =====================================================================
//  Subject registry. To add a subject: import its module and add it here.
//  Nothing else in the app needs to change (engine is subject-agnostic).
// =====================================================================
import type { Subject } from '$lib/types';
import { statistics } from './statistics';
import { matan } from './matan';

export const subjects: Subject[] = [statistics, matan];

export function getSubject(id: string): Subject | undefined {
	return subjects.find((s) => s.id === id);
}
