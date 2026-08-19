import type { Course, Day, Glossary } from '$lib/types';
import { phases } from './phases';
import { glossary as baseGlossary } from './glossary';

import { day01 } from './days/day01';
import { day01Terms } from './days/day01.terms';
import { day02 } from './days/day02';
import { day02Terms } from './days/day02.terms';
import { day03 } from './days/day03';
import { day03Terms } from './days/day03.terms';
import { day04 } from './days/day04';
import { day04Terms } from './days/day04.terms';
import { day05 } from './days/day05';
import { day05Terms } from './days/day05.terms';
import { day06 } from './days/day06';
import { day06Terms } from './days/day06.terms';
import { day07 } from './days/day07';
import { day07Terms } from './days/day07.terms';
import { day08 } from './days/day08';
import { day08Terms } from './days/day08.terms';
import { day09 } from './days/day09';
import { day09Terms } from './days/day09.terms';
import { day10 } from './days/day10';
import { day10Terms } from './days/day10.terms';
import { day11 } from './days/day11';
import { day11Terms } from './days/day11.terms';
import { day12 } from './days/day12';
import { day12Terms } from './days/day12.terms';
import { day13 } from './days/day13';
import { day13Terms } from './days/day13.terms';
import { day14 } from './days/day14';
import { day14Terms } from './days/day14.terms';
import { day15 } from './days/day15';
import { day15Terms } from './days/day15.terms';
import { day16 } from './days/day16';
import { day16Terms } from './days/day16.terms';
import { day17 } from './days/day17';
import { day17Terms } from './days/day17.terms';
import { day18 } from './days/day18';
import { day18Terms } from './days/day18.terms';
import { day19 } from './days/day19';
import { day19Terms } from './days/day19.terms';
import { day20 } from './days/day20';
import { day20Terms } from './days/day20.terms';
import { day21 } from './days/day21';
import { day21Terms } from './days/day21.terms';
import { day22 } from './days/day22';
import { day22Terms } from './days/day22.terms';
import { day23 } from './days/day23';
import { day23Terms } from './days/day23.terms';
import { day24 } from './days/day24';
import { day24Terms } from './days/day24.terms';
import { day25 } from './days/day25';
import { day25Terms } from './days/day25.terms';
import { day26 } from './days/day26';
import { day26Terms } from './days/day26.terms';
import { day27 } from './days/day27';
import { day27Terms } from './days/day27.terms';
import { day28 } from './days/day28';
import { day28Terms } from './days/day28.terms';
import { day29 } from './days/day29';
import { day29Terms } from './days/day29.terms';
import { day30 } from './days/day30';
import { day30Terms } from './days/day30.terms';

// Дни склеиваются в обратном порядке: при повторном объявлении термина
// побеждает день, где он вводится впервые. Базовый глоссарий идёт последним
// и перекрывает всё.
const glossary = {
	...day30Terms,
	...day29Terms,
	...day28Terms,
	...day27Terms,
	...day26Terms,
	...day25Terms,
	...day24Terms,
	...day23Terms,
	...day22Terms,
	...day21Terms,
	...day20Terms,
	...day19Terms,
	...day18Terms,
	...day17Terms,
	...day16Terms,
	...day15Terms,
	...day14Terms,
	...day13Terms,
	...day12Terms,
	...day11Terms,
	...day10Terms,
	...day09Terms,
	...day08Terms,
	...day07Terms,
	...day06Terms,
	...day05Terms,
	...day04Terms,
	...day03Terms,
	...day02Terms,
...day01Terms,
	...baseGlossary
};

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

export const sem1: Course = { semester: 1, year: 2026, status: 'ready', phases, days, glossary: pruneRelated(glossary) };
