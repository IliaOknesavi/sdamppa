import type { Day } from '$lib/types';
import { examGraphs } from './examGraphs';
import { examPaths } from './examPaths';
import { examMstDsu } from './examMstDsu';
import { examTrees } from './examTrees';
import { examSegFlow } from './examSegFlow';
import { examHeaps } from './examHeaps';
import { examApplied } from './examApplied';
import { examParallel } from './examParallel';

// Финал курса — экзаменационные билеты: 32 билета, сгруппированы по темам.
// Каждый билет: номер, дословный вопрос, развёрнутый ответ и отдельная
// ссылка «Подробная теория →» на день курса с полным разбором.
export const examDays: Day[] = [
	examGraphs,
	examPaths,
	examMstDsu,
	examTrees,
	examSegFlow,
	examHeaps,
	examApplied,
	examParallel
];
