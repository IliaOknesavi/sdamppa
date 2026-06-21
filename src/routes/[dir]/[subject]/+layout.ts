import { error } from '@sveltejs/kit';
import { loadSubject } from '$lib/content/registry';
import type { LayoutLoad } from './$types';

// Грузим ТОЛЬКО это тело предмета (ленивый чанк), предварительно проверив по
// мете, что предмет принадлежит направлению. Барель с остальными предметами
// сюда не тянется.
export const load: LayoutLoad = async ({ params, parent }) => {
	const { direction } = await parent();
	if (!direction.subjects.some((s) => s.id === params.subject)) error(404, 'Предмет не найден');
	const subject = await loadSubject(params.subject);
	if (!subject) error(404, 'Предмет не найден');
	return { subject };
};
