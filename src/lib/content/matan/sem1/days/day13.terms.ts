import type { Glossary } from '$lib/types';

// Термины дня 13 (единственность предела). День должен резолвиться независимо,
// поэтому опорные понятия — последовательность, предел, метрическое
// пространство, шар, неравенство треугольника, N(ε) — продублированы здесь,
// даже если вводились раньше. НЕ дублируются термины канонического глоссария
// (glossary.ts): n-nol-n-odin, dopolnenie, zamykanie, vykolotaya-okrestnost,
// komponenta-svyaznosti, metriki-rho, end-r, skalyarnoe-pole, lso,
// asimptoticheskie-klassy, skhodyashchayasya-v-sebe, chastichnaya-posledovatelnost,
// priznak-i-svoystvo — на них ссылаемся через [[...]].
export const day13Terms: Glossary = {
	'edinstvennost-predela': {
		id: 'edinstvennost-predela',
		term: 'Единственность предела',
		short: String.raw`Двух разных пределов у одной последовательности не бывает — но это теорема.`,
		formula: String.raw`\lim_{n\to\infty}x_n=A\ \wedge\ \lim_{n\to\infty}x_n=B\ \Rightarrow\ A=B`,
		body: String.raw`**Единственность предела** — отдельная теорема, а не часть определения: [[predel-posledovatelnosti|определение предела]] формально допускает, что условию удовлетворяют две точки сразу, и запрет на это приходится доказывать. Доказывается [[ot-protivnogo|от противного]]: в $\mathbb R$ через $\varepsilon=\frac{|A-B|}{3}$, в [[metricheskoe-prostranstvo|метрическом пространстве]] — через [[lemma-o-neperesechenii-sharov|лемму о непересечении шаров]].`,
		related: ['predel-posledovatelnosti', 'lemma-o-neperesechenii-sharov', 'ot-protivnogo', 'hausdorfovo-prostranstvo']
	},

	'lemma-o-neperesechenii-sharov': {
		id: 'lemma-o-neperesechenii-sharov',
		term: 'Лемма о непересечении шаров',
		short: String.raw`Сумма радиусов не превосходит расстояния между центрами ⟹ шары не пересекаются.`,
		formula: String.raw`d_a+d_b\le\rho(a,b)\ \Longrightarrow\ B_{d_a}(a)\cap B_{d_b}(b)=\varnothing`,
		body: String.raw`Если $d_a+d_b\le\rho(a,b)$, то [[shar|шары]] $B_{d_a}(a)$ и $B_{d_b}(b)$ не пересекаются: это прямое следствие [[neravenstvo-treugolnika|неравенства треугольника]], верное в любом [[metricheskoe-prostranstvo|метрическом пространстве]]. В форме критерия $B_{d_a}(a)\cap B_{d_b}(b)=\varnothing\iff d_a+d_b\le\rho(a,b)$ стороны неравноправны: обратная требует точки на наперёд заданном расстоянии между центрами (в $\mathbb R^n$ — точки отрезка) и в дискретной метрике ломается — при $\rho(a,b)=1$ и $d_a=d_b=0{,}9$ сумма радиусов больше расстояния, а шары $\lbrace a\rbrace$ и $\lbrace b\rbrace$ всё равно не пересекаются.`,
		related: ['shar', 'neravenstvo-treugolnika', 'edinstvennost-predela', 'metricheskoe-prostranstvo']
	},

	'set-net': {
		id: 'set-net',
		term: 'Сеть (net)',
		short: String.raw`Отображение направленного множества в пространство — сеть Мура–Смита.`,
		formula: String.raw`\varphi:\ \Lambda\to T,\qquad (\Lambda,\preccurlyeq)\ \text{— направленное множество}`,
		body: String.raw`**Сеть** (net, сходимость Мура–Смита) — обобщение последовательности, у которого индексы пробегают [[napravlennoe-mnozhestvo|направленное множество]], а не $\mathbb N_1$; типичное индексное множество — окрестности точки, упорядоченные по обратному включению. От [[obobshchennaya-posledovatelnost|обобщённой последовательности]] $f:\mathbb N_1\to M$ сеть отличается тем, что обобщается индекс, а не кодомен.`,
		related: ['napravlennoe-mnozhestvo', 'obobshchennaya-posledovatelnost', 'hausdorfovo-prostranstvo']
	},

	'napravlennoe-mnozhestvo': {
		id: 'napravlennoe-mnozhestvo',
		term: 'Направленное множество',
		short: String.raw`Предпорядок, в котором у любых двух элементов есть общий последователь.`,
		formula: String.raw`\forall\lambda,\mu\in\Lambda\ \exists\nu\in\Lambda:\ \lambda\preccurlyeq\nu\ \wedge\ \mu\preccurlyeq\nu`,
		body: String.raw`Множество $\Lambda$ с рефлексивным и транзитивным отношением $\preccurlyeq$, в котором для любых двух элементов найдётся следующий за обоими. Это ровно то свойство, которое позволяет говорить «начиная с некоторого места»: в [[n-nol-n-odin|$\mathbb N_1$]] его роль играет $\max(m,n)$. Служит индексным множеством [[set-net|сети]]; типичный пример — все окрестности точки, упорядоченные по обратному включению.`,
		related: ['set-net', 'n-nol-n-odin']
	},

	'ot-protivnogo': {
		id: 'ot-protivnogo',
		term: 'Доказательство от противного',
		short: String.raw`Присоединяем отрицание вывода к посылкам и приходим к противоречию.`,
		formula: String.raw`\bigl(A\wedge\lnot B\to\bot\bigr)\ \Rightarrow\ (A\to B)`,
		body: String.raw`Приём, на котором стоят обе теоремы [[edinstvennost-predela|единственности]]: предполагаем $A\ne B$, извлекаем из этого положительное число ($|A-B|$ или $\rho(a,b)$) и делаем его источником $\varepsilon$. Отрицание вывода даёт **рабочий объект**: без строгого неравенства $A\ne B$ нечего было бы делить на три и не из чего строить радиус. Приём называется до выкладки, а сама выкладка закрывается знаком $\blacksquare$.`,
		related: ['edinstvennost-predela', 'n-ot-epsilon']
	},

	'hausdorfovo-prostranstvo': {
		id: 'hausdorfovo-prostranstvo',
		term: 'Хаусдорфово пространство (T₂)',
		short: String.raw`Любые две точки разделяются непересекающимися окрестностями.`,
		formula: String.raw`\forall a\ne b\ \ \exists U_a,U_b\in\tau:\ U_a\cap U_b=\varnothing`,
		body: String.raw`Аксиома отделимости $T_2$: любые две различные точки разделяются непересекающимися окрестностями. Именно она стоит за [[edinstvennost-predela|единственностью предела]]: в хаусдорфовом пространстве последовательность не может сходиться к двум точкам, а в антидискретной топологии $\tau=\lbrace\varnothing,T\rbrace$ сходится к каждой. Для [[set-net|сетей]] это равносильность, для последовательностей — достаточность.`,
		related: ['edinstvennost-predela', 'lemma-o-neperesechenii-sharov', 'set-net']
	}
};
