import { error } from '@sveltejs/kit';
import { getCourse } from '$lib/types';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, parent, url }) => {
	const { subject } = await parent();
	const semester = Number(params.sem);
	const explicitYear = url.searchParams.get('year');
	const course = getCourse(subject, semester, explicitYear ? Number(explicitYear) : undefined);
	if (!course) error(404, 'Курс не найден');

	const basePath = `/${params.dir}/${params.subject}/${params.sem}`;
	const yearQ = explicitYear ? `?year=${explicitYear}` : '';
	const courseKey = `${params.dir}:${params.subject}:${semester}:${course.year}`;

	return { course, semester, year: course.year, basePath, yearQ, courseKey };
};
