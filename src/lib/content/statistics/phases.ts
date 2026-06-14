import type { Phase } from '$lib/types';

export const phases: Phase[] = [
	{
		id: 'tv',
		title: 'Теория вероятностей',
		subtitle: 'Фундамент · коллоквиум (дни 1–9)',
		hue: 38
	},
	{
		id: 'matstat',
		title: 'Математическая статистика',
		subtitle: 'Экзамен, часть 1 (дни 10–19)',
		hue: 150
	},
	{
		id: 'markov',
		title: 'Цепи Маркова',
		subtitle: 'Экзамен, часть 2 (дни 20–27)',
		hue: 205
	},
	{
		id: 'final',
		title: 'Финал и мок-экзамены',
		subtitle: 'Повторение · контроль (дни 28–30)',
		hue: 0
	}
];
