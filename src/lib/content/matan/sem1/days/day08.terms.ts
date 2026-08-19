import type { Glossary } from '$lib/types';

// Термины дня 8. Термины канонического глоссария здесь намеренно НЕ
// переобъявляются, а только связываются через [[...]]:
//   dopolnenie, zamykanie, vykolotaya-okrestnost, komponenta-svyaznosti,
//   metriki-rho, n-nol-n-odin, lso.
// Карточки otkrytoe-mnozhestvo, zamknutoe-mnozhestvo, de-morgan и
// topologiya-r введены в день 6 и продублированы здесь в редакции через
// границу, чтобы день резолвился независимо от соседних.
export const day08Terms: Glossary = {
	okrestnost: {
		id: 'okrestnost',
		term: 'Окрестность точки',
		short: String.raw`Любой элемент топологии, содержащий $x$; размера у неё нет.`,
		formula: String.raw`U\in\tau,\ U\ni x\ \Longrightarrow\ U=U_x`,
		body: String.raw`**Окрестность точки $x$** в пространстве $(S,\tau)$ — любой элемент топологии, содержащий $x$.

Размера у окрестности нет: расстояние в топологическом пространстве не определено, и «маленькая окрестность» — фраза без смысла. Вся техника — в кванторе перед $U_x$: $\exists U_x$ у [[vnutrennyaya-tochka|внутренней]] и [[vneshnyaya-tochka|внешней точки]], $\forall U_x$ у [[granichnaya-tochka|граничной]]. Одна окрестность есть всегда — сам носитель $S$; вариант без самой точки — [[vykolotaya-okrestnost|выколотая окрестность]] $\mathring U_x=U\setminus\{x\}$.`,
		related: ['vykolotaya-okrestnost', 'vnutrennyaya-tochka', 'granichnaya-tochka', 'otkrytoe-mnozhestvo']
	},

	'vnutrennyaya-tochka': {
		id: 'vnutrennyaya-tochka',
		term: 'Внутренняя точка',
		short: String.raw`Нашлась окрестность, целиком лежащая в $A$.`,
		formula: String.raw`x\in\mathrm{In}\,A\iff\exists U_x:\ U_x\subset A`,
		body: String.raw`Точка $x$ **внутренняя** для $A$, если существует хотя бы одна [[okrestnost|окрестность]] $U_x$, целиком лежащая в $A$. Квантор здесь — существования: достаточно одного свидетеля.

Внутренняя точка всегда принадлежит $A$: она лежит в своей окрестности, а та внутри $A$. Множество всех внутренних точек — [[vnutrennost|внутренность]] $\mathrm{In}\,A$, и оно всегда [[otkrytoe-mnozhestvo|открыто]]: свидетель $U_x\subset A$ годится сразу для каждой своей точки. Геометрический образ для области на плоскости: точка, вокруг которой найдётся окружность, целиком помещающаяся внутри области.`,
		related: ['okrestnost', 'vnutrennost', 'granichnaya-tochka', 'vneshnyaya-tochka']
	},

	'granichnaya-tochka': {
		id: 'granichnaya-tochka',
		term: 'Граничная точка',
		short: String.raw`Каждая окрестность цепляет и $A$, и дополнение $\overline A$.`,
		formula: String.raw`x\in\partial A\iff\forall U_x:\ U_x\cap A\ne\varnothing\ \wedge\ U_x\cap\overline A\ne\varnothing`,
		body: String.raw`Точка $x$ **граничная** для $A$, если **каждая** её [[okrestnost|окрестность]] пересекает и $A$, и [[dopolnenie|дополнение]] $\overline A$. Квантор всеобщности — главное отличие от двух других классов.

Граничная точка не обязана принадлежать $A$: у множества $(0;1)\cup(1;2)$ точка $1$ граничная, хотя в множестве её нет. Быть граничной — значит не быть ни [[vnutrennyaya-tochka|внутренней]], ни [[vneshnyaya-tochka|внешней]]: определение получается двойным отрицанием двух кванторов существования. Геометрический образ: точка на краю области, окружность вокруг которой разрезана краем пополам.`,
		related: ['okrestnost', 'granica-mnozhestva', 'vnutrennyaya-tochka', 'vneshnyaya-tochka']
	},

	'vneshnyaya-tochka': {
		id: 'vneshnyaya-tochka',
		term: 'Внешняя точка',
		short: String.raw`Нашлась окрестность, целиком лежащая в дополнении $\overline A$.`,
		formula: String.raw`x\in\mathrm{Ext}\,A\iff\exists U_x:\ U_x\subset\overline A`,
		body: String.raw`Точка $x$ **внешняя** для $A$, если существует [[okrestnost|окрестность]] $U_x$, целиком лежащая в [[dopolnenie|дополнении]] $\overline A$. Это в точности [[vnutrennyaya-tochka|внутренняя точка]] дополнения, поэтому $\mathrm{Ext}\,A=\mathrm{In}\,\overline A$.

Внешняя точка никогда не принадлежит $A$. Вместе с внутренними и [[granichnaya-tochka|граничными]] внешние точки исчерпывают носитель: $S=\mathrm{In}\,A\sqcup\partial A\sqcup\mathrm{Ext}\,A$, причём классы попарно не пересекаются — для этого достаточно того, что точка лежит в каждой своей окрестности.`,
		related: ['vneshnost', 'vnutrennyaya-tochka', 'granichnaya-tochka', 'dopolnenie']
	},

	'granica-mnozhestva': {
		id: 'granica-mnozhestva',
		term: 'Граница множества ∂A',
		short: String.raw`Множество всех граничных точек; $\partial A=\partial\overline A$.`,
		formula: String.raw`\partial A=S\setminus(\mathrm{In}\,A\cup\mathrm{Ext}\,A),\qquad \partial A=\partial\overline A`,
		body: String.raw`**Граница** $\partial A$ — множество всех [[granichnaya-tochka|граничных точек]] $A$, то есть остаток носителя после удаления [[vnutrennost|внутренности]] и [[vneshnost|внешности]].

Определение симметрично относительно замены $A\leftrightarrow\overline A$, поэтому $\partial A=\partial\overline A$: у множества и его [[dopolnenie|дополнения]] граница общая — берегов два, разрез один. Через границу определяются [[zamykanie|замыкание]] $\mathrm{cl}\,A=A\cup\partial A$ и критерий: $A$ [[otkrytoe-mnozhestvo|открыто]] $\iff\partial A\cap A=\varnothing$, [[zamknutoe-mnozhestvo|замкнуто]] $\iff\partial A\subset A$. В $\mathbb R$: $\partial(a;b)=\partial[a;b]=\{a,b\}$.`,
		related: ['granichnaya-tochka', 'zamykanie', 'vnutrennost', 'vneshnost']
	},

	vnutrennost: {
		id: 'vnutrennost',
		term: 'Внутренность In A',
		short: String.raw`$\mathrm{In}\,A=A\setminus\partial A$ — «$A$ без границы»; всегда открыта.`,
		formula: String.raw`\mathrm{In}\,A=A\setminus\partial A`,
		body: String.raw`**Внутренность** $\mathrm{In}\,A$ — множество всех [[vnutrennyaya-tochka|внутренних точек]] $A$. Равносильная запись вычитанием: $\mathrm{In}\,A=A\setminus\partial A$, то есть «$A$ без границы». Обозначение — $\mathrm{In}$.

Формулы согласованы: точка из $A$ внешней быть не может, поэтому вычитание [[granica-mnozhestva|границы]] оставляет ровно внутренние точки. Внутренность всегда [[otkrytoe-mnozhestvo|открыта]] и является наибольшим открытым подмножеством $A$; если отталкиваться от этого свойства как от определения, граница выводится потом как $\partial A=\mathrm{cl}\,A\setminus\mathrm{In}\,A$.`,
		related: ['vnutrennyaya-tochka', 'granica-mnozhestva', 'zamykanie', 'otkrytoe-mnozhestvo']
	},

	vneshnost: {
		id: 'vneshnost',
		term: 'Внешность Ext A',
		short: String.raw`$\mathrm{Ext}\,A=\mathrm{In}\,\overline A$ — дополнение замыкания.`,
		formula: String.raw`\mathrm{Ext}\,A=\mathrm{In}\,\overline A=\overline{\mathrm{cl}\,A}`,
		body: String.raw`**Внешность** $\mathrm{Ext}\,A$ — множество всех [[vneshnyaya-tochka|внешних точек]], то есть внутренность [[dopolnenie|дополнения]]: $\mathrm{Ext}\,A=\mathrm{In}\,\overline A$.

По трихотомии $S=\mathrm{In}\,A\sqcup\partial A\sqcup\mathrm{Ext}\,A$ внешность есть дополнение [[zamykanie|замыкания]]: $\mathrm{Ext}\,A=\overline{\mathrm{cl}\,A}$. Отсюда короткое доказательство замкнутости замыкания: $\mathrm{Ext}\,A$ [[otkrytoe-mnozhestvo|открыта]] (свидетель $U_x\subset\overline A$ годится для каждой своей точки), значит $\mathrm{cl}\,A$ [[zamknutoe-mnozhestvo|замкнуто]], а с этим и [[idempotentnost|идемпотентность]].`,
		related: ['vneshnyaya-tochka', 'zamykanie', 'vnutrennost', 'dopolnenie']
	},

	idempotentnost: {
		id: 'idempotentnost',
		term: 'Идемпотентность замыкания',
		short: String.raw`Повторно замыкать бесполезно: $\mathrm{cl}\,\mathrm{cl}\,A=\mathrm{cl}\,A$.`,
		formula: String.raw`\mathrm{cl}\,\mathrm{cl}\,A=\mathrm{cl}\,A`,
		body: String.raw`Операция **идемпотентна**, если повторное применение ничего не меняет. Для [[zamykanie|замыкания]] это свойство $\mathrm{cl}\,\mathrm{cl}\,A=\mathrm{cl}\,A$: границу добавляют один раз.

Вывод короткий: [[vneshnost|внешность]] $\mathrm{Ext}\,A$ открыта, поэтому $\mathrm{cl}\,A=\overline{\mathrm{Ext}\,A}$ [[zamknutoe-mnozhestvo|замкнуто]], а для замкнутого множества критерий даёт $\partial(\mathrm{cl}\,A)\subset\mathrm{cl}\,A$ — добавлять нечего. Тем же свойством обладает и [[vnutrennost|внутренность]]: $\mathrm{In}\,\mathrm{In}\,A=\mathrm{In}\,A$.`,
		related: ['zamykanie', 'vneshnost', 'zamknutoe-mnozhestvo', 'vnutrennost']
	},

	interval: {
		id: 'interval',
		term: 'Интервал (a; b)',
		short: String.raw`Открытый промежуток без концов; в $\mathbb R$ это открытый шар.`,
		formula: String.raw`(a;b)=\{x\in\mathbb R:\ a<x<b\}=B_{x_0}(r),\quad x_0=\tfrac{a+b}2,\ r=\tfrac{b-a}2`,
		body: String.raw`**Интервал** $(a;b)$ — промежуток без концов. В [[topologiya-r|топологии на $\mathbb R$]] интервалы открыты, и по критерию это согласовано: $\partial(a;b)=\{a,b\}$ не пересекается с самим интервалом.

В метрике $\rho(x,y)=|y-x|$ ([[metriki-rho|метрики $\rho$]]) интервал — это ровно **открытый шар**: $B_{x_0}(r)=\{x:\ |x_0-x|<r\}=(x_0-r;x_0+r)$. Например, $B_{52}$ радиуса $4{,}5$ — это $(47{,}5;\ 56{,}5)$. Парный ему замкнутый объект — [[otrezok|отрезок]].`,
		related: ['otrezok', 'topologiya-r', 'otkrytoe-mnozhestvo', 'metriki-rho']
	},

	otrezok: {
		id: 'otrezok',
		term: 'Отрезок [a; b]',
		short: String.raw`Замкнутый промежуток с концами; в $\mathbb R$ это замкнутый шар.`,
		formula: String.raw`[a;b]=\{x\in\mathbb R:\ a\le x\le b\}=\overline{B_{x_0}}(r)`,
		body: String.raw`**Отрезок** $[a;b]$ — промежуток вместе с концами. Он [[zamknutoe-mnozhestvo|замкнут]]: $\partial[a;b]=\{a,b\}\subset[a;b]$, а по-другому — его [[dopolnenie|дополнение]] $(-\infty;a)\cup(b;+\infty)$ открыто как объединение двух лучей.

В метрике $|y-x|$ отрезок — **замкнутый шар** $\overline{B_{x_0}}(r)=[x_0-r;x_0+r]$; на рисунке его обводят сплошной окружностью, а [[interval|интервал]] — пунктирной. Соответствие открытых промежутков замкнутым: $(x;y)\leftrightarrow[x;y]$, $(-\infty;x)\leftrightarrow(-\infty;x]$, $(y;+\infty)\leftrightarrow[y;+\infty)$. Полуинтервал $[a;b)$ не попадает ни в один класс.`,
		related: ['interval', 'zamknutoe-mnozhestvo', 'granica-mnozhestva', 'metriki-rho']
	},

	'otkrytoe-mnozhestvo': {
		id: 'otkrytoe-mnozhestvo',
		term: 'Открытое множество',
		short: String.raw`Открыто = лежит в $\tau$ = не содержит ни одной своей граничной точки.`,
		formula: String.raw`U\in\tau\iff\partial U\cap U=\varnothing`,
		body: String.raw`**Открытое множество** в $(S,\tau)$ — элемент топологии: $U$ открыто $\iff U\in\tau$ (день 6). Через границу это назначение получает внутреннюю характеристику: $U$ открыто тогда и только тогда, когда $\partial U\cap U=\varnothing$, то есть все точки $U$ для него [[vnutrennyaya-tochka|внутренние]].

Обратный переход опирается на лемму о склейке: если каждая точка $U$ внутренняя, то $U=\bigcup_{x\in U}U_x$ — объединение элементов $\tau$, а оно лежит в $\tau$ по третьей аксиоме. Всегда открыты [[vnutrennost|внутренность]] и [[vneshnost|внешность]] любого множества.`,
		related: ['zamknutoe-mnozhestvo', 'granica-mnozhestva', 'okrestnost', 'vnutrennost']
	},

	'zamknutoe-mnozhestvo': {
		id: 'zamknutoe-mnozhestvo',
		term: 'Замкнутое множество',
		short: String.raw`Замкнуто = открыто дополнение = граница целиком своя.`,
		formula: String.raw`\overline U\in\tau\iff\partial U\subset U`,
		body: String.raw`**Замкнутое множество** определяется через [[dopolnenie|дополнение]]: $U$ замкнуто, если $\overline U$ [[otkrytoe-mnozhestvo|открыто]]. Характеристика через границу: $U$ замкнуто $\iff\partial U\subset U$. Выводится из критерия открытости и симметрии $\partial\overline U=\partial U$.

Открытость и замкнутость — не отрицания друг друга: полуинтервал $[a;b)$ не открыт и не замкнут, а множество с пустой границей открыто и замкнуто сразу — такие множества называются [[komponenta-svyaznosti|компонентами связности]]. По [[de-morgan|де Моргану]] пересечение произвольного семейства замкнутых замкнуто, а объединение — только конечного.`,
		related: ['otkrytoe-mnozhestvo', 'granica-mnozhestva', 'de-morgan', 'zamykanie']
	},

	'de-morgan': {
		id: 'de-morgan',
		term: 'Правило де Моргана',
		short: String.raw`Дополнение объединения равно пересечению дополнений.`,
		formula: String.raw`\overline{\bigcup_{i\in I}x_i}=\bigcap_{i\in I}\overline{x_i}`,
		body: String.raw`**Правило де Моргана** переводит объединения в пересечения через [[dopolnenie|дополнение]]. Это рабочий инструмент перехода «[[otkrytoe-mnozhestvo|открытое]] $\leftrightarrow$ [[zamknutoe-mnozhestvo|замкнутое]]».

Перевод аксиом: произвольное объединение открытых открыто $\Rightarrow$ произвольное пересечение замкнутых замкнуто; конечное пересечение открытых открыто $\Rightarrow$ конечное объединение замкнутых замкнуто. Первый перевод и нужен, чтобы «наименьшее замкнутое надмножество» совпало с [[zamykanie|замыканием]]. Примеры в $\mathbb R$: $\overline{[x;y]}=(-\infty;x)\cup(y;+\infty)$, а дополнение двух отрезков — интервал между ними и два луча по краям.`,
		related: ['dopolnenie', 'zamknutoe-mnozhestvo', 'otkrytoe-mnozhestvo', 'zamykanie']
	},

	'topologiya-r': {
		id: 'topologiya-r',
		term: 'Стандартная топология на ℝ',
		short: String.raw`Открыты $\varnothing$, $\mathbb R$, все интервалы, лучи и их объединения.`,
		formula: String.raw`(x;y),\ (-\infty;x),\ (x;+\infty)\in\tau`,
		body: String.raw`Топология на $\mathbb R$ описывается перечислением: $\varnothing$; $\mathbb R$; все [[interval|интервалы]] $(x;y)$; лучи $(-\infty;x)$ и $(x;+\infty)$; произвольные объединения; конечные пересечения.

Конечность в последнем пункте существенна: $\bigcap_n(-1/n;1/n)=\{0\}$ (день 6), а одноточечное множество открытым не является — по произвольному множеству индексов результат из $\tau$ выпадает. Метрика $|y-x|$ превращает открытый шар в [[interval|интервал]], а замкнутый — в [[otrezok|отрезок]]; [[komponenta-svyaznosti|открыто-замкнуты]] здесь только $\varnothing$ и $\mathbb R$.`,
		related: ['interval', 'otrezok', 'otkrytoe-mnozhestvo', 'komponenta-svyaznosti']
	}
};
