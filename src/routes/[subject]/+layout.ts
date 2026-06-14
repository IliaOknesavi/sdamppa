import { getSubject } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	const subject = getSubject(params.subject);
	if (!subject) error(404, 'Предмет не найден');
	return { subject };
};
