import type { Glossary } from '$lib/types';

// Термины дня 30. День собирает материал дней 18–28, поэтому опорные понятия
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
		body: String.raw`**Топология лучей** на $\mathbb R$ состоит из $\varnothing$, всей прямой и открытых лучей вправо. Аксиомы проверяются мгновенно: пересечение двух лучей — луч с большим началом, объединение семейства лучей — луч с началом $\inf a_i$ или вся прямая.

В ней любые два непустых открытых множества пересекаются, то есть точки не разделяются окрестностями. Из-за этого рушится обычное доказательство «[[kompakt|компакт]] замкнут»: множество $[0;+\infty)$ компактно (любой элемент покрытия, накрывающий точку $0$, накрывает и всё множество), но не замкнуто — его дополнение $(-\infty;0)$ лучом не является — и не ограничено. Замкнутость и ограниченность компактов доказываются в топологии, индуцированной [[metriki-rho|метрикой]], где такое разделение есть.`,
		related: ['kompakt', 'metriki-rho', 'baza-topologii']
	},

	'verkhniy-nizhniy-predel': {
		id: 'verkhniy-nizhniy-predel',
		term: 'Верхний и нижний предел, колебание',
		short: String.raw`Пределы супремумов и инфимумов; их разность — колебание $\eta$.`,
		formula: String.raw`\overline{\lim_{x\to x_0}}f=\lim_{\delta\to0}\ \sup_{\mathring B_{x_0}(\delta)}f,\qquad \eta=\overline{\lim}f-\underline{\lim}f`,
		body: String.raw`**Верхний и нижний пределы** функции — пределы супремума и инфимума по стягивающейся [[vykolotaya-okrestnost|выколотой окрестности]], а их разность называется **колебанием** $\eta$ в точке. Критерий: [[predel-funkcii|предел]] существует тогда и только тогда, когда $\overline\lim=\underline\lim$, то есть $\eta=0$.

Для последовательностей те же объекты строятся через огибающие $S_i=\sup_{k\geqslant i}x_k$ и $i_n=\inf_{k\geqslant n}x_k$: обе монотонны, поэтому пределы у них есть всегда. Огибающая не меняется при переходе к [[chastichnaya-posledovatelnost|хвосту]] — отбрасывание конечного числа членов не влияет ни на $\overline\lim$, ни на $\underline\lim$.`,
		related: ['chastichnaya-posledovatelnost', 'predel-funkcii', 'vykolotaya-okrestnost']
	},

	'priznaki-sravneniya': {
		id: 'priznaki-sravneniya',
		term: 'Три признака сравнения',
		short: String.raw`Поэлементный, асимптотический и д'Аламбера.`,
		formula: String.raw`a_n\leqslant b_n;\qquad \lim\frac{a_n}{b_n}=c\in(0;\infty);\qquad \lim\frac{a_{n+1}}{a_n}=q<1`,
		body: String.raw`Три признака сходимости рядов с положительными членами. **Поэлементный** сравнивает члены почленно с эталоном, **асимптотический** — через предел отношения, то есть на языке [[asimptoticheskie-klassy|классов $\Theta$]], **д'Аламбера** — через предел отношения соседних членов: при $q<1$ ряд сходится, при $q>1$ расходится.

Случай $q=1$ ответа не даёт: $\sum1/n$ расходится, $\sum1/n^2$ сходится, а отношение соседних членов в обоих случаях стремится к единице. Все три — именно [[priznak-i-svoystvo|признаки]], достаточные условия: из сходимости ряда обратно не следует ничего.`,
		related: ['priznak-i-svoystvo', 'asimptoticheskie-klassy']
	},

	'szhataya-funkciya': {
		id: 'szhataya-funkciya',
		term: 'Теорема о сжатой функции',
		short: String.raw`Два городовых для функций; обобщение — в метрических пространствах.`,
		formula: String.raw`f\leqslant h\leqslant g\ \text{на}\ B_r(x_0),\ \ \lim f=\lim g=A\ \Rightarrow\ \lim h=A`,
		body: String.raw`В $\mathbb R$ теорема формулируется для $f,g,h\in$ [[end-r|$\operatorname{End}(\mathbb R)$]]: если $f\leqslant h\leqslant g$ на шаре вокруг точки и крайние имеют общий [[predel-funkcii|предел]], то и средняя имеет тот же.

**Обобщённая версия** живёт в [[metriki-rho|метрических]] пространствах: порядка на множестве значений там нет, поэтому зажатость записывается шарами. Пусть $h,f_n,f:(M_1,\rho_1)\to(M_2,\rho_2)$, числа $\delta_n\to0$ и $\varepsilon_n\to0$ таковы, что $\rho_2\bigl(h(x_1),f_n(x_2)\bigr)<\varepsilon_n$ при всех $x_1,x_2\in\mathring B_{x_0}(\delta_n)$, сходимость $f_n\to f$ **равномерна** в некоторой выколотой окрестности $x_0$, и $\lim_{x\to x_0}f=A$. Тогда $\lim_{x\to x_0}h=A$. Равномерность выбросить нельзя: при $\delta_n=\varepsilon_n=1/n$, $h\equiv5$ и $f_n$, равной $5$ на $B_0(1/n)$ и нулю вне его, поточечный предел $f$ равен нулю всюду, кроме самой точки, значит $\lim_{x\to0}f=0$, а $\lim_{x\to0}h=5$. Доказательство обеих версий — неравенство треугольника, в обобщённой с тремя слагаемыми: $\rho_2\bigl(h(x),A\bigr)\leqslant\rho_2\bigl(h(x),f_n(x)\bigr)+\rho_2\bigl(f_n(x),f(x)\bigr)+\rho_2\bigl(f(x),A\bigr)$, и каждое загоняется под $\varepsilon/3$.`,
		related: ['end-r', 'predel-funkcii', 'metriki-rho']
	},

};
