import type { Subject, Day } from '$lib/types';

// =====================================================================
//  МАТАН — proof of extensibility. Same `Subject` contract as statistics;
//  the engine needs zero changes. Currently a scaffold (status: 'soon');
//  fill `glossary` and author days the same way as statistics.
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

export const matan: Subject = {
	id: 'matan',
	name: 'Математический анализ',
	short: 'Матан',
	blurb: String.raw`Пределы, производные, интегралы и ряды — следующий предмет, по той же системе.`,
	accent: '#7e8cd6',
	glyph: '∫',
	status: 'soon',
	phases: [
		{ id: 'limits', title: 'Пределы и непрерывность', subtitle: 'Основы анализа', hue: 210 },
		{ id: 'diff', title: 'Дифференциальное исчисление', subtitle: 'Производные', hue: 260 },
		{ id: 'integ', title: 'Интегральное исчисление', subtitle: 'Интегралы', hue: 300 },
		{ id: 'series', title: 'Ряды', subtitle: 'Сходимость и разложения', hue: 340 }
	],
	days: [
		draft(1, 'limits', 'Предел последовательности и функции', 'm-ch01', 'Определение предела по Коши и Гейне, свойства, замечательные пределы.'),
		draft(2, 'limits', 'Непрерывность функции', 'm-ch02', 'Непрерывность, точки разрыва, свойства непрерывных функций.'),
		draft(3, 'diff', 'Производная и дифференциал', 'm-ch03', 'Определение производной, правила дифференцирования, геометрический смысл.'),
		draft(4, 'integ', 'Неопределённый и определённый интеграл', 'm-ch04', 'Первообразная, формула Ньютона–Лейбница, методы интегрирования.'),
		draft(5, 'series', 'Числовые и степенные ряды', 'm-ch05', 'Признаки сходимости, ряды Тейлора и Маклорена.')
	],
	glossary: {
		predel: {
			id: 'predel',
			term: 'Предел',
			short: String.raw`Значение, к которому стремится функция/последовательность.`,
			formula: String.raw`\lim_{x\to a} f(x) = L`,
			body: String.raw`**Предел** $\lim_{x\to a}f(x)=L$: для любого $\varepsilon>0$ найдётся $\delta>0$, что из $0<|x-a|<\delta$ следует $|f(x)-L|<\varepsilon$. Это базовое понятие всего анализа.`
		}
	}
};
