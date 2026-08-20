import type { Glossary } from '$lib/types';
import { glossary as baseGlossary } from './glossary';
import { day01Terms } from './days/day01.terms';
import { day02Terms } from './days/day02.terms';
import { day03Terms } from './days/day03.terms';
import { day04Terms } from './days/day04.terms';
import { day05Terms } from './days/day05.terms';
import { day06Terms } from './days/day06.terms';
import { day07Terms } from './days/day07.terms';
import { day08Terms } from './days/day08.terms';
import { day09Terms } from './days/day09.terms';
import { day10Terms } from './days/day10.terms';
import { day11Terms } from './days/day11.terms';
import { day12Terms } from './days/day12.terms';
import { day13Terms } from './days/day13.terms';
import { day14Terms } from './days/day14.terms';
import { day15Terms } from './days/day15.terms';
import { day16Terms } from './days/day16.terms';
import { day17Terms } from './days/day17.terms';
import { day18Terms } from './days/day18.terms';
import { day19Terms } from './days/day19.terms';
import { day20Terms } from './days/day20.terms';
import { day21Terms } from './days/day21.terms';
import { day22Terms } from './days/day22.terms';
import { day23Terms } from './days/day23.terms';
import { day24Terms } from './days/day24.terms';
import { day25Terms } from './days/day25.terms';
import { day26Terms } from './days/day26.terms';
import { day27Terms } from './days/day27.terms';
import { day28Terms } from './days/day28.terms';
import { day29Terms } from './days/day29.terms';
import { day30Terms } from './days/day30.terms';

// Все термины семестра одним объектом — без импорта курса, чтобы соседний
// семестр мог подмешать их к себе без циклической зависимости.
// Дни склеиваются в обратном порядке: при повторном объявлении побеждает
// день, где термин вводится впервые; канонический глоссарий нотации идёт
// последним и перекрывает всё.
export const sem2Terms: Glossary = {
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
