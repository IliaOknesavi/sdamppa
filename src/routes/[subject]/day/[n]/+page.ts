import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { subject } = await parent();
	const n = Number(params.n);
	const day = subject.days.find((d) => d.n === n);
	if (!day) error(404, 'День не найден');
	return { day };
};
