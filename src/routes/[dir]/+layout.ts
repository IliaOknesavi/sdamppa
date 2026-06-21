import { directionMeta } from '$lib/content/meta';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Лёгкая мета направления — БЕЗ тел предметов. Тело грузится лениво по
// subjectId в [subject]/+layout.ts (registry), а не весь барель $lib/content.
export const load: LayoutLoad = ({ params }) => {
	const direction = directionMeta(params.dir);
	if (!direction) error(404, 'Направление не найдено');
	return { direction };
};
