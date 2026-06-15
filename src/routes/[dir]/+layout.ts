import { getDirection } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	const direction = getDirection(params.dir);
	if (!direction) error(404, 'Направление не найдено');
	return { direction };
};
