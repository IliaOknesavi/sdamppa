import type { Subject, Day, Glossary } from '$lib/types';
import { phases } from './phases';
import { glossary as baseGlossary } from './glossary';
import { codeGlossary } from './codeGlossary';
import { codeGlossaryGen } from './codeGlossary.generated';

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

const days: Day[] = [
	day01, day02, day03, day04, day05, day06, day07, day08, day09, day10,
	day11, day12, day13, day14, day15, day16, day17, day18, day19, day20
].sort((a, b) => a.n - b.n);

// Базовый глоссарий канонический → перекрывает совпадающие id из дней.
const glossary: Glossary = {
	...day01Terms,
	...day02Terms,
	...day03Terms,
	...day04Terms,
	...day05Terms,
	...day06Terms,
	...day07Terms,
	...day08Terms,
	...day09Terms,
	...day10Terms,
	...day11Terms,
	...day12Terms,
	...day13Terms,
	...day14Terms,
	...day15Terms,
	...day16Terms,
	...day17Terms,
	...day18Terms,
	...day19Terms,
	...day20Terms,
	...codeGlossaryGen,
	...codeGlossary,
	...baseGlossary
};

export const pytorch: Subject = {
	id: 'pytorch',
	name: 'PyTorch',
	short: 'PyTorch',
	blurb: String.raw`Исчерпывающий курс по PyTorch: от тензора и autograd до CNN, трансформеров и продакшна. Живые numpy-демо в браузере + настоящий torch в один клик в Colab.`,
	accent: '#ee4c2c',
	glyph: '∇',
	courses: [{ semester: 1, year: 2026, status: 'ready', phases, days, glossary }]
};
