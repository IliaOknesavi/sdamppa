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

	'obobshchennaya-posledovatelnost': {
		id: 'obobshchennaya-posledovatelnost',
		term: 'Обобщённая последовательность',
		short: String.raw`Последовательность со значениями в метрическом пространстве: $f:\mathbb N_1\to M$.`,
		formula: String.raw`f:\ \mathbb N_1\to M,\qquad (M,\rho)\ \text{— метрическое пространство}`,
		body: String.raw`**Обобщённая последовательность** — отображение $f:\mathbb N_1\to M$ в [[metricheskoe-prostranstvo|метрическое пространство]]: обобщается **кодомен**, а область определения остаётся [[n-nol-n-odin|$\mathbb N_1$]]. Предел определяется дословно как в $\mathbb R$, с заменой модуля на метрику: $\rho(x_n,a)<\varepsilon$, то есть $x_n\in B_\varepsilon(a)$.

Обобщение с другого конца — по индексу — даёт [[set-net|сеть]] $\varphi:\Lambda\to T$ над направленным множеством. Это другой объект: единственность предела сети равносильна [[hausdorfovo-prostranstvo|хаусдорфовости]] пространства, тогда как для $f:\mathbb N_1\to M$ её обеспечивает сама метрика.`,
		related: ['posledovatelnost', 'set-net', 'metricheskoe-prostranstvo', 'predel-posledovatelnosti']
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

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`С некоторого номера все члены ближе ε к точке; пять эквивалентных записей.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N(\varepsilon)\in\mathbb N_1\ \forall n>N:\ \rho(x_n,A)<\varepsilon`,
		body: String.raw`Определение записывается в пяти эквивалентных формах: через метрику $\rho$, через норму, через открытый [[shar|шар]] $B_\varepsilon(A)$, через [[vykolotaya-okrestnost|выколотую окрестность]] $\mathring U_A$ и последней — школьной записью $|x_n-A|<\varepsilon$ как частным вещественным случаем. Определение утверждает только «$A$ является пределом»; то, что такая точка одна, — отдельная теорема о [[edinstvennost-predela|единственности]]. Доказательство сходимости считается законченным, когда выписан [[n-ot-epsilon|$N(\varepsilon)$]].`,
		related: ['posledovatelnost', 'shar', 'edinstvennost-predela', 'n-ot-epsilon']
	},

	posledovatelnost: {
		id: 'posledovatelnost',
		term: 'Последовательность',
		short: String.raw`Отображение $f:\mathbb N_1\to\mathbb R$ — функция, а не «набор чисел».`,
		formula: String.raw`f:\ \mathbb N_1\to\mathbb R,\qquad x_n:=f(n)`,
		body: String.raw`Последовательность — это **отображение** из [[n-nol-n-odin|$\mathbb N_1$]] в $\mathbb R$, а запись $x_n$ — сокращение для $f(n)$. Такой взгляд сразу даёт две линии обобщения: заменив кодомен на метрическое пространство, получаем [[obobshchennaya-posledovatelnost|обобщённую последовательность]] $f:\mathbb N_1\to M$; заменив область определения на направленное множество — [[set-net|сеть]]. Первая линия ведёт к пределам в метрических пространствах, вторая — к сходимости в общей топологии.`,
		related: ['n-nol-n-odin', 'obobshchennaya-posledovatelnost', 'predel-posledovatelnosti']
	},

	'metricheskoe-prostranstvo': {
		id: 'metricheskoe-prostranstvo',
		term: 'Метрическое пространство',
		short: String.raw`Множество с расстоянием: тождество, симметрия, неравенство треугольника.`,
		formula: String.raw`\rho(x,y)=0\iff x=y;\quad \rho(x,y)=\rho(y,x);\quad \rho(x,z)\le\rho(x,y)+\rho(y,z)`,
		body: String.raw`Пара $(M,\rho)$, где $\rho:M\times M\to\mathbb R_{\ge0}$ подчинена трём аксиомам: тождества, симметрии и [[neravenstvo-treugolnika|треугольника]]. В доказательстве единственности предела работают ровно две из них: тождество даёт $\rho(a,b)>0$ при $a\ne b$, треугольник — [[lemma-o-neperesechenii-sharov|непересечение шаров]]. На одном множестве метрик много ([[metriki-rho|$\rho_1,\rho_2,\rho_k,\rho_\infty$]], дискретная), и слово «предел» всегда относится к выбранной: сменив $\rho$, можно сменить и ответ.`,
		related: ['neravenstvo-treugolnika', 'shar', 'metriki-rho', 'lemma-o-neperesechenii-sharov']
	},

	shar: {
		id: 'shar',
		term: 'Открытый шар',
		short: String.raw`Точки на расстоянии строго меньше радиуса: $B_r(x_0)$.`,
		formula: String.raw`B_r(x_0)=\lbrace x\in M:\ \rho(x,x_0)<r\rbrace`,
		body: String.raw`Множество точек, удалённых от центра **строго** меньше чем на $r$. Строгость здесь не косметика: именно она позволяет [[lemma-o-neperesechenii-sharov|лемме о непересечении шаров]] работать с нестрогим условием $d_a+d_b\le\rho(a,b)$ — касающиеся шары общей точки не имеют. Через шары даётся одно из пяти определений [[predel-posledovatelnosti|предела]]. В дискретной метрике $B_r(x)=\lbrace x\rbrace$ при $r\le1$ и $B_r(x)=M$ при $r>1$.`,
		related: ['metricheskoe-prostranstvo', 'lemma-o-neperesechenii-sharov', 'predel-posledovatelnosti']
	},

	'neravenstvo-treugolnika': {
		id: 'neravenstvo-treugolnika',
		term: 'Неравенство треугольника',
		short: String.raw`Через третью точку короче не станет: $\rho(x,z)\le\rho(x,y)+\rho(y,z)$.`,
		formula: String.raw`\rho(x,z)\le\rho(x,y)+\rho(y,z)`,
		body: String.raw`Третья аксиома [[metricheskoe-prostranstvo|метрики]] и единственная, связывающая **три** точки, — потому весь аппарат пределов в метрическом пространстве держится на ней. Вещественный аналог — $|a+b|\le|a|+|b|$. Приём применения всегда один: вставить между двумя интересующими точками член последовательности — так получаются и оценка $|A-B|<2\varepsilon$, и [[lemma-o-neperesechenii-sharov|лемма о шарах]].`,
		related: ['metricheskoe-prostranstvo', 'lemma-o-neperesechenii-sharov', 'shar']
	},

	'n-ot-epsilon': {
		id: 'n-ot-epsilon',
		term: 'Номер N(ε) как функция',
		short: String.raw`Доказательство сходимости кончается формулой для $N$, а не словами.`,
		formula: String.raw`N(\varepsilon)=\max\bigl(N_a(\tfrac\varepsilon2),\ N_b(\tfrac\varepsilon2)\bigr)`,
		body: String.raw`$N$ трактуется как **функция** от $\varepsilon$ и индексируется по объекту ($N_x,N_y,N_a,N_b$), а сам $\varepsilon$ — как ресурс, который распределяют между условиями. Доказательство закончено только тогда, когда выписана явная формула: фраза «значит, предел существует» её не заменяет. В теореме о [[edinstvennost-predela|единственности]] в метрическом пространстве итог таков: $N(\varepsilon)=\max\bigl(N_a(\frac d2),N_b(\frac d2)\bigr)$, где $d=\rho(a,b)$.`,
		related: ['predel-posledovatelnosti', 'edinstvennost-predela']
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
