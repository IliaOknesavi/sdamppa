import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, parent }) => {
	const { direction } = await parent();
	const subject = direction.subjects.find((s) => s.id === params.subject);
	if (!subject) error(404, 'Предмет не найден');
	return { subject };
};
