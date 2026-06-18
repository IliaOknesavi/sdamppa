import type { Day, Section } from '$lib/types';
import { examGraphs } from './examGraphs';
import { examPaths } from './examPaths';
import { examMstDsu } from './examMstDsu';
import { examTrees } from './examTrees';
import { examSegFlow } from './examSegFlow';
import { examHeaps } from './examHeaps';
import { examApplied } from './examApplied';
import { examParallel } from './examParallel';

// Финал курса — все 32 экзаменационных билета на ОДНОЙ странице.
// Каждый билет — сворачиваемый аккордеон: в шапке номер и сам вопрос,
// внутри (свёрнуто по умолчанию) — развёрнутый ответ и ссылка на день
// с полной теорией. Сначала попробуй ответить сам, потом раскрой и сверься.
//
// Билеты берём из 8 тематических модулей; вопрос вытаскиваем в шапку, а
// тело (ответ + ссылка) прячем под спойлер.

const clusters = [
	examGraphs,
	examPaths,
	examMstDsu,
	examTrees,
	examSegFlow,
	examHeaps,
	examApplied,
	examParallel
];

let n = 0;
const tickets: Section[] = clusters
	.flatMap((d) => d.sections)
	.map((s) => {
		n += 1;
		const m = s.body.match(/^\s*\*\*Вопрос\.\*\*\s*([\s\S]*?)\n\s*\n([\s\S]*)$/);
		const question = m
			? m[1].replace(/\s+/g, ' ').trim()
			: (s.heading ?? '').replace(/^Билет\s*\d+\s*[·.]\s*/, '');
		const rest = m ? m[2].trim() : s.body;
		return {
			heading: `Билет ${n}. ${question}`,
			body: rest,
			collapsible: true
		};
	});

export const examDays: Day[] = [
	{
		n: 0,
		phaseId: 'exam',
		kind: 'theory',
		unitLabel: 'Экзамен',
		title: 'Экзаменационные билеты: 32 вопроса с ответами',
		chapterRef: 'самопроверка перед допсессией',
		est: 'экзамен',
		goal: String.raw`Все 32 экзаменационных билета на одной странице. Нажми на вопрос — раскроется развёрнутый ответ и ссылка на день с полной теорией. Ответы свёрнуты по умолчанию: сначала попробуй ответить сам, потом сверься.`,
		sections: tickets,
		tasks: [],
		mastery: [
			'Отвечаю своими словами на любой из 32 билетов',
			'Знаю определение, асимптотику и пример по каждому вопросу',
			'Открываю «Подробную теорию» по темам, где сомневаюсь'
		]
	}
];
