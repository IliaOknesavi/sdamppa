import { redirect } from '@sveltejs/kit';
import { semestersOf } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { subject } = await parent();
	const sems = semestersOf(subject);
	// один семестр → промежуточный «каталог из одной плитки» лишний: ведём сразу в курс
	if (sems.length === 1) redirect(307, `/${params.dir}/${subject.id}/${sems[0]}`);
	return {};
};
