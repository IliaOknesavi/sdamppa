import type { Glossary } from '$lib/types';

// Термины дня 30. День собирает материал [дней 18–28](/aii/matan/1/day/18), поэтому опорные понятия
// (база топологии, компакт, предел функции, непрерывность) определены здесь
// заново и резолвятся независимо. Не дублируются термины общего глоссария,
// на которые ссылки идут напрямую: n-nol-n-odin, zamykanie, dopolnenie,
// vykolotaya-okrestnost, metriki-rho, end-r, skalyarnoe-pole, lso,
// komponenta-svyaznosti, asimptoticheskie-klassy, skhodyashchayasya-v-sebe,
// chastichnaya-posledovatelnost, priznak-i-svoystvo, blacksquare.
export const day30Terms: Glossary = {
	'topologiya-luchey': {
		id: 'topologiya-luchey',
		term: 'Топология лучей',
		short: String.raw`$\tau$ из пустого множества, всей прямой и лучей $(a;+\infty)$.`,
		formula: String.raw`\tau=\{\varnothing,\mathbb R\}\cup\{(a;+\infty):a\in\mathbb R\}`,
		body: String.raw`**Топология лучей** на $\mathbb R$ состоит из $\varnothing$, всей прямой и открытых лучей вправо: пересечение двух лучей — луч с большим началом, объединение семейства лучей — луч с началом $\inf a_i$ или вся прямая. Любые два непустых открытых множества здесь пересекаются, то есть точки не разделяются окрестностями, и связка «[[kompakt|компакт]] замкнут и ограничен» ломается: $[0;+\infty)$ компактно, но не замкнуто и не ограничено. Замкнутость и ограниченность компактов доказываются в топологии, индуцированной [[metriki-rho|метрикой]].`,
		related: ['kompakt', 'metriki-rho', 'baza-topologii']
	},

	'verkhniy-nizhniy-predel': {
		id: 'verkhniy-nizhniy-predel',
		term: 'Верхний и нижний предел, колебание',
		short: String.raw`Пределы супремумов и инфимумов; их разность — колебание $\eta$.`,
		formula: String.raw`\overline{\lim_{x\to x_0}}f=\lim_{\delta\to0}\ \sup_{\mathring B_{x_0}(\delta)}f,\qquad \eta=\overline{\lim}f-\underline{\lim}f`,
		body: String.raw`**Верхний и нижний пределы** функции — пределы супремума и инфимума по стягивающейся [[vykolotaya-okrestnost|выколотой окрестности]], а их разность называется **колебанием** $\eta$ в точке. Критерий: [[predel-funkcii|предел]] существует тогда и только тогда, когда $\overline\lim=\underline\lim$, то есть $\eta=0$. Для последовательностей те же объекты строятся через огибающие $S_i=\sup_{k\geqslant i}x_k$ и $i_n=\inf_{k\geqslant n}x_k$: обе монотонны, поэтому пределы у них есть всегда.`,
		related: ['chastichnaya-posledovatelnost', 'predel-funkcii', 'vykolotaya-okrestnost']
	},

	'priznaki-sravneniya': {
		id: 'priznaki-sravneniya',
		term: 'Три признака сравнения',
		short: String.raw`Поэлементный, асимптотический и д'Аламбера.`,
		formula: String.raw`a_n\leqslant b_n;\qquad \lim\frac{a_n}{b_n}=c\in(0;\infty);\qquad \lim\frac{a_{n+1}}{a_n}=q<1`,
		body: String.raw`Три [[priznak-i-svoystvo|признака]] сходимости рядов с положительными членами: **поэлементный** сравнивает члены почленно с эталоном, **асимптотический** — через предел отношения, то есть на языке [[asimptoticheskie-klassy|классов $\Theta$]], **д'Аламбера** — через предел отношения соседних членов, при $q<1$ ряд сходится, при $q>1$ расходится. Случай $q=1$ ответа не даёт: $\sum1/n$ расходится, $\sum1/n^2$ сходится, а отношение соседних членов в обоих случаях стремится к единице.`,
		related: ['priznak-i-svoystvo', 'asimptoticheskie-klassy']
	},

	'szhataya-funkciya': {
		id: 'szhataya-funkciya',
		term: 'Теорема о сжатой функции',
		short: String.raw`Два городовых для функций; обобщение — в метрических пространствах.`,
		formula: String.raw`f\leqslant h\leqslant g\ \text{на}\ B_r(x_0),\ \ \lim f=\lim g=A\ \Rightarrow\ \lim h=A`,
		body: String.raw`В $\mathbb R$ теорема формулируется для $f,g,h\in$ [[end-r|$\operatorname{End}(\mathbb R)$]]: если $f\leqslant h\leqslant g$ на шаре вокруг точки и крайние имеют общий [[predel-funkcii|предел]], то и средняя имеет тот же. **Обобщённая версия** живёт в [[metriki-rho|метрических]] пространствах, где порядка на множестве значений нет и зажатость записывается шарами: пусть $h,f_n,f:(M_1,\rho_1)\to(M_2,\rho_2)$, числа $\delta_n\to0$ и $\varepsilon_n\to0$ таковы, что $\rho_2\bigl(h(x_1),f_n(x_2)\bigr)<\varepsilon_n$ при всех $x_1,x_2\in\mathring B_{x_0}(\delta_n)$, сходимость $f_n\to f$ **равномерна** в некоторой выколотой окрестности $x_0$, и $\lim_{x\to x_0}f=A$; тогда $\lim_{x\to x_0}h=A$.`,
		related: ['end-r', 'predel-funkcii', 'metriki-rho']
	},

};
