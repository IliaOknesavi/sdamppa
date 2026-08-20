import type { Course, Day, Glossary } from '$lib/types';
import { phases } from './phases';
import { core } from '../../core/glossary';
import { sem2Terms } from './allTerms';
import { sem1Terms } from '../sem1/allTerms';

import { day01 } from './days/day01';
import { day02 } from './days/day02';
import { day03 } from './days/day03';
import { day04 } from './days/day04';
import { day05 } from './days/day05';
import { day06 } from './days/day06';
import { day07 } from './days/day07';
import { day08 } from './days/day08';
import { day09 } from './days/day09';
import { day10 } from './days/day10';
import { day11 } from './days/day11';
import { day12 } from './days/day12';
import { day13 } from './days/day13';
import { day14 } from './days/day14';
import { day15 } from './days/day15';
import { day16 } from './days/day16';
import { day17 } from './days/day17';
import { day18 } from './days/day18';
import { day19 } from './days/day19';
import { day20 } from './days/day20';
import { day21 } from './days/day21';
import { day22 } from './days/day22';
import { day23 } from './days/day23';
import { day24 } from './days/day24';
import { day25 } from './days/day25';
import { day26 } from './days/day26';
import { day27 } from './days/day27';
import { day28 } from './days/day28';
import { day29 } from './days/day29';
import { day30 } from './days/day30';

// Подсказки резолвятся сквозь весь сайт: общий базовый слой, затем
// соседний семестр, и только сверху — термины своего семестра. Термин
// объявляется ровно один раз и виден отовсюду, а не запирается в курсе.
const glossary = { ...core, ...sem1Terms, ...sem2Terms };

// Канонический глоссарий нотации общий для обоих семестров, поэтому часть его
// related-ссылок ведёт на термины, которых в ЭТОМ курсе нет. Подрезаем их при
// сборке, чтобы в карточках не появлялись чипы, ведущие в никуда.
function pruneRelated(g: Glossary): Glossary {
	const out: Glossary = {};
	for (const [id, t] of Object.entries(g)) {
		out[id] = t.related ? { ...t, related: t.related.filter((r) => r in g) } : t;
	}
	return out;
}

const days: Day[] = [
	day01, day02, day03, day04, day05, day06, day07, day08, day09, day10,
	day11, day12, day13, day14, day15, day16, day17, day18, day19, day20,
	day21, day22, day23, day24, day25, day26, day27, day28, day29, day30
].sort((a, b) => a.n - b.n);

export const sem2: Course = { semester: 2, year: 2026, status: 'ready', phases, days, glossary: pruneRelated(glossary) };
