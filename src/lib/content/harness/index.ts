import type { Subject } from '$lib/types';
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

const days = [day01, day02, day03, day04, day05, day06, day07, day08, day09, day10, day11, day12, day13, day14, day15, day16, day17, day18, day19, day20, day21, day22, day23, day24, day25, day26].sort((a, b) => a.n - b.n);

export const harness: Subject = {
	id: 'harness',
	name: 'Инженерия агентных харнессов',
	short: 'Харнессы',
	blurb: String.raw`Перевод MIT-гайда Nexu: как из языковой модели собрать агента — агентный цикл, инструменты, суб-агенты и оркестрация, контекст, песочницы и эвалы. С реальным кодом.`,
	accent: '#22a39f',
	glyph: '⚙',
	source: { label: 'Оригинал: nexu-io/harness-engineering-guide · MIT © Nexu', url: 'https://github.com/nexu-io/harness-engineering-guide' },
	courses: [
		{
			semester: 1,
			year: 2026,
			status: 'ready',
			phases: [
				{ id: 'start', title: 'С чего начать', subtitle: 'что такое харнесс, первый харнесс', hue: 175 },
				{ id: 'core', title: 'Базовые понятия', subtitle: 'цикл, инструменты, память, ограничители', hue: 200 },
				{ id: 'practice', title: 'Практика', subtitle: 'контекст, песочница, суб-агенты, оркестрация, эвалы', hue: 150 },
				{ id: 'ref', title: 'Справочник', subtitle: 'сравнение реализаций, глоссарий', hue: 40 },
				{ id: 'showcase', title: 'Истории', subtitle: 'разборы из практики', hue: 320 }
			],
			days,
			glossary: {}
		}
	]
};
