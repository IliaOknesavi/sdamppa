import type { Subject, Day, Glossary } from '$lib/types';

// =====================================================================
//  МАТАН — proof of the Direction → Subject → Course{semester, year} model.
//  Branches by semester (1 / 2 / 3). Currently scaffolds (status: 'soon');
//  fill phases/days the same way as the statistics course.
// =====================================================================

const draft = (n: number, phaseId: string, title: string, chapterRef: string, goal: string): Day => ({
	n,
	phaseId,
	title,
	chapterRef,
	est: '1–2 ч',
	goal,
	sections: [],
	tasks: [],
	mastery: [],
	draft: true
});

const glossary: Glossary = {
	predel: {
		id: 'predel',
		term: 'Предел',
		short: String.raw`Значение, к которому стремится функция или последовательность.`,
		formula: String.raw`\lim_{x\to a} f(x) = L`,
		body: String.raw`**Предел** $\lim_{x\to a}f(x)=L$: для любого $\varepsilon>0$ найдётся $\delta>0$, такое что из $0<|x-a|<\delta$ следует $|f(x)-L|<\varepsilon$. Базовое понятие всего анализа.`
	}
};

export const matan: Subject = {
	id: 'matan',
	name: 'Математический анализ',
	short: 'Матан',
	blurb: String.raw`Пределы, производные, интегралы и ряды — по той же системе, с разбивкой по семестрам.`,
	accent: '#7f00ff',
	glyph: '∫',
	courses: [
		{
			semester: 1,
			year: 2026,
			status: 'soon',
			phases: [
				{ id: 'limits', title: 'Пределы и непрерывность', subtitle: 'Основы анализа', hue: 265 },
				{ id: 'diff', title: 'Дифференциальное исчисление', subtitle: 'Производные', hue: 290 }
			],
			days: [
				draft(1, 'limits', 'Предел последовательности и функции', 'm-ch01', 'Определение предела по Коши и Гейне, свойства, замечательные пределы.'),
				draft(2, 'limits', 'Непрерывность функции', 'm-ch02', 'Непрерывность, точки разрыва, свойства непрерывных функций.'),
				draft(3, 'diff', 'Производная и дифференциал', 'm-ch03', 'Определение производной, правила дифференцирования, геометрический смысл.')
			],
			glossary
		},
		{
			semester: 2,
			year: 2026,
			status: 'soon',
			phases: [
				{ id: 'integ', title: 'Интегральное исчисление', subtitle: 'Интегралы', hue: 310 },
				{ id: 'series', title: 'Ряды', subtitle: 'Сходимость и разложения', hue: 340 }
			],
			days: [
				draft(1, 'integ', 'Неопределённый и определённый интеграл', 'm-ch04', 'Первообразная, формула Ньютона–Лейбница, методы интегрирования.'),
				draft(2, 'series', 'Числовые и степенные ряды', 'm-ch05', 'Признаки сходимости, ряды Тейлора и Маклорена.')
			],
			glossary
		},
		{
			semester: 3,
			year: 2026,
			status: 'soon',
			phases: [],
			days: [],
			glossary
		}
	]
};
