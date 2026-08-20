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
		body: String.raw`**Единственность предела** — отдельная теорема, а не часть определения: [[predel-posledovatelnosti|определение предела]] формально допускает, что условию удовлетворяют две точки сразу, и запрет на это приходится доказывать. Доказательств два: в $\mathbb R$ — [[ot-protivnogo|от противного]] с $\varepsilon=\frac{|A-B|}{3}$, и в [[metricheskoe-prostranstvo|метрическом пространстве]] — через [[lemma-o-neperesechenii-sharov|лемму о непересечении шаров]] при $\varepsilon=\frac{\rho(a,b)}{2}$. Только после неё запись $\lim x_n$ законна как имя одного объекта.`,
		related: ['predel-posledovatelnosti', 'lemma-o-neperesechenii-sharov', 'ot-protivnogo', 'hausdorfovo-prostranstvo']
	},

	'lemma-o-neperesechenii-sharov': {
		id: 'lemma-o-neperesechenii-sharov',
		term: 'Лемма о непересечении шаров',
		short: String.raw`Сумма радиусов не превосходит расстояния между центрами ⟹ шары не пересекаются.`,
		formula: String.raw`d_a+d_b\le\rho(a,b)\ \Longrightarrow\ B_{d_a}(a)\cap B_{d_b}(b)=\varnothing`,
		body: String.raw`Вспомогательное утверждение, заменяющее арифметику при доказательстве [[edinstvennost-predela|единственности предела]] в [[metricheskoe-prostranstvo|метрическом пространстве]]. В форме критерия $B_{d_a}(a)\cap B_{d_b}(b)=\varnothing\iff d_a+d_b\le\rho(a,b)$ стороны неравноправны. Сторона ($\Leftarrow$) — прямое следствие [[neravenstvo-treugolnika|неравенства треугольника]] и верна всегда; сторона ($\Rightarrow$) требует точки на наперёд заданном расстоянии между центрами (в $\mathbb R^n$ — точки отрезка) и в дискретной метрике ломается: при $\rho(a,b)=1$ и $d_a=d_b=0{,}9$ сумма радиусов больше расстояния, а шары $\lbrace a\rbrace$ и $\lbrace b\rbrace$ всё равно не пересекаются. Теореме о единственности нужна только сторона ($\Leftarrow$), поэтому она работает в любом метрическом пространстве.`,
		related: ['shar', 'neravenstvo-treugolnika', 'edinstvennost-predela', 'metricheskoe-prostranstvo']
	},

	'set-net': {
		id: 'set-net',
		term: 'Сеть (net)',
		short: String.raw`Отображение направленного множества в пространство — сеть Мура–Смита.`,
		formula: String.raw`\varphi:\ \Lambda\to T,\qquad (\Lambda,\preccurlyeq)\ \text{— направленное множество}`,
		body: String.raw`**Сеть** (net, сходимость Мура–Смита) — обобщение последовательности, у которого индексы пробегают [[napravlennoe-mnozhestvo|направленное множество]], а не $\mathbb N_1$. Нужна там, где последовательностей не хватает: в пространствах без счётной базы окрестностей [[zamykanie|замыкание]] уже не описывается их пределами, а непрерывность — сохранением этих пределов. Для сетей разрыв закрывается: точка лежит в $\mathrm{cl}\,A$ тогда и только тогда, когда к ней сходится сеть из $A$; индексным множеством служат окрестности точки, упорядоченные по обратному включению.

Единственность предела сети равносильна [[hausdorfovo-prostranstvo|хаусдорфовости]]. От [[obobshchennaya-posledovatelnost|обобщённой последовательности]] $f:\mathbb N_1\to M$ сеть отличается тем, что обобщается индекс, а не кодомен.`,
		related: ['napravlennoe-mnozhestvo', 'obobshchennaya-posledovatelnost', 'hausdorfovo-prostranstvo']
	},

	'napravlennoe-mnozhestvo': {
		id: 'napravlennoe-mnozhestvo',
		term: 'Направленное множество',
		short: String.raw`Предпорядок, в котором у любых двух элементов есть общий последователь.`,
		formula: String.raw`\forall\lambda,\mu\in\Lambda\ \exists\nu\in\Lambda:\ \lambda\preccurlyeq\nu\ \wedge\ \mu\preccurlyeq\nu`,
		body: String.raw`Множество $\Lambda$ с рефлексивным и транзитивным отношением $\preccurlyeq$, в котором для любых двух элементов найдётся следующий за обоими. Это ровно то свойство, которое позволяет говорить «начиная с некоторого места»: в $\mathbb N_1$ его роль играет $\max(m,n)$ — тот же приём, что $N=\max(N_a,N_b)$ в доказательстве [[edinstvennost-predela|единственности предела]]. Служит индексным множеством [[set-net|сети]]; типичный пример — все окрестности точки, упорядоченные по обратному включению.`,
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
		body: String.raw`Аксиома отделимости, стоящая за [[edinstvennost-predela|единственностью предела]]: в хаусдорфовом пространстве последовательность не может сходиться к двум точкам, а в антидискретной топологии $\tau=\lbrace\varnothing,T\rbrace$ сходится к каждой. Для [[set-net|сетей]] это равносильность, для последовательностей — достаточность. [[lemma-o-neperesechenii-sharov|Лемма о непересечении шаров]] есть в точности доказательство хаусдорфовости метрического пространства: разделяющие окрестности — шары радиуса $\rho(a,b)/2$.`,
		related: ['edinstvennost-predela', 'lemma-o-neperesechenii-sharov', 'set-net']
	}
};
