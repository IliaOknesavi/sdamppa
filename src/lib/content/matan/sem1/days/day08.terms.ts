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
		body: String.raw`**Окрестность точки** $x$ — любое [[mnozhestvo|множество]] $U\in\tau$, содержащее эту точку. Размера у неё нет: расстояние в топологическом пространстве не определено, поэтому «маленькая окрестность» — фраза без смысла.`,
		related: ['mnozhestvo', 'vykolotaya-okrestnost', 'vnutrennyaya-tochka']
	},

	'vnutrennyaya-tochka': {
		id: 'vnutrennyaya-tochka',
		term: 'Внутренняя точка',
		short: String.raw`Нашлась окрестность, целиком лежащая в $A$.`,
		formula: String.raw`x\in\mathrm{In}\,A\iff\exists U_x:\ U_x\subset A`,
		body: String.raw`Точка множества, у которой найдётся [[okrestnost|окрестность]], целиком лежащая в этом множестве. Квантор здесь существования: достаточно одного свидетеля.`,
		related: ['okrestnost', 'podmnozhestvo']
	},

	'granichnaya-tochka': {
		id: 'granichnaya-tochka',
		term: 'Граничная точка',
		short: String.raw`Каждая окрестность цепляет и $A$, и дополнение $\overline A$.`,
		formula: String.raw`x\in\partial A\iff\forall U_x:\ U_x\cap A\ne\varnothing\ \wedge\ U_x\cap\overline A\ne\varnothing`,
		body: String.raw`Точка $x$ **граничная** для $A$, если **каждая** её [[okrestnost|окрестность]] пересекает и $A$, и [[dopolnenie|дополнение]] $\overline A$; квантор всеобщности — главное отличие от двух других классов. Равносильно: быть граничной — значит не быть ни [[vnutrennyaya-tochka|внутренней]], ни [[vneshnyaya-tochka|внешней]], определение получается двойным отрицанием двух кванторов существования. Принадлежать $A$ граничная точка не обязана: у множества $(0;1)\cup(1;2)$ точка $1$ граничная, хотя в самом множестве её нет.`,
		related: ['okrestnost', 'granica-mnozhestva', 'vnutrennyaya-tochka', 'vneshnyaya-tochka']
	},

	'vneshnyaya-tochka': {
		id: 'vneshnyaya-tochka',
		term: 'Внешняя точка',
		short: String.raw`Нашлась окрестность, целиком лежащая в дополнении $\overline A$.`,
		formula: String.raw`x\in\mathrm{Ext}\,A\iff\exists U_x:\ U_x\subset\overline A`,
		body: String.raw`Точка $x$ **внешняя** для $A$, если существует [[okrestnost|окрестность]] $U_x$, целиком лежащая в [[dopolnenie|дополнении]] $\overline A$. Это в точности [[vnutrennyaya-tochka|внутренняя точка]] дополнения, поэтому $\mathrm{Ext}\,A=\mathrm{In}\,\overline A$, и самому $A$ внешняя точка никогда не принадлежит. Вместе с внутренними и [[granichnaya-tochka|граничными]] внешние точки исчерпывают носитель: $S=\mathrm{In}\,A\sqcup\partial A\sqcup\mathrm{Ext}\,A$.`,
		related: ['vneshnost', 'vnutrennyaya-tochka', 'granichnaya-tochka', 'dopolnenie']
	},

	'granica-mnozhestva': {
		id: 'granica-mnozhestva',
		term: 'Граница множества ∂A',
		short: String.raw`Множество всех граничных точек; $\partial A=\partial\overline A$.`,
		formula: String.raw`\partial A=S\setminus(\mathrm{In}\,A\cup\mathrm{Ext}\,A),\qquad \partial A=\partial\overline A`,
		body: String.raw`**Граница** $\partial A$ — множество всех [[granichnaya-tochka|граничных точек]] $A$, то есть остаток носителя после удаления [[vnutrennost|внутренности]] и [[vneshnost|внешности]]. Определение симметрично относительно замены $A\leftrightarrow\overline A$, поэтому $\partial A=\partial\overline A$: у множества и его [[dopolnenie|дополнения]] граница общая — берегов два, разрез один. В $\mathbb R$: $\partial(a;b)=\partial[a;b]=\{a,b\}$.`,
		related: ['granichnaya-tochka', 'zamykanie', 'vnutrennost', 'vneshnost']
	},

	vnutrennost: {
		id: 'vnutrennost',
		term: 'Внутренность In A',
		short: String.raw`$\mathrm{In}\,A=A\setminus\partial A$ — «$A$ без границы»; всегда открыта.`,
		formula: String.raw`\mathrm{In}\,A=A\setminus\partial A`,
		body: String.raw`**Внутренность** $\mathrm{In}\,A$ — множество всех [[vnutrennyaya-tochka|внутренних точек]] $A$; обозначение — $\mathrm{In}$. Равносильная запись вычитанием: $\mathrm{In}\,A=A\setminus\partial A$, то есть «$A$ без [[granica-mnozhestva|границы]]». Внутренность всегда [[otkrytoe-mnozhestvo|открыта]] и является наибольшим открытым подмножеством $A$; если отталкиваться от этого свойства как от определения, граница выводится потом как $\partial A=\mathrm{cl}\,A\setminus\mathrm{In}\,A$.`,
		related: ['vnutrennyaya-tochka', 'granica-mnozhestva', 'zamykanie', 'otkrytoe-mnozhestvo']
	},

	vneshnost: {
		id: 'vneshnost',
		term: 'Внешность Ext A',
		short: String.raw`$\mathrm{Ext}\,A=\mathrm{In}\,\overline A$ — дополнение замыкания.`,
		formula: String.raw`\mathrm{Ext}\,A=\mathrm{In}\,\overline A=\overline{\mathrm{cl}\,A}`,
		body: String.raw`**Внешность** $\mathrm{Ext}\,A$ — множество всех [[vneshnyaya-tochka|внешних точек]], то есть внутренность [[dopolnenie|дополнения]]: $\mathrm{Ext}\,A=\mathrm{In}\,\overline A$. По трихотомии $S=\mathrm{In}\,A\sqcup\partial A\sqcup\mathrm{Ext}\,A$ внешность есть в точности дополнение [[zamykanie|замыкания]]: $\mathrm{Ext}\,A=\overline{\mathrm{cl}\,A}$.`,
		related: ['vneshnyaya-tochka', 'zamykanie', 'vnutrennost', 'dopolnenie']
	},

	idempotentnost: {
		id: 'idempotentnost',
		term: 'Идемпотентность замыкания',
		short: String.raw`Повторно замыкать бесполезно: $\mathrm{cl}\,\mathrm{cl}\,A=\mathrm{cl}\,A$.`,
		formula: String.raw`\mathrm{cl}\,\mathrm{cl}\,A=\mathrm{cl}\,A`,
		body: String.raw`Операция **идемпотентна**, если повторное применение ничего не меняет. Для [[zamykanie|замыкания]] это свойство $\mathrm{cl}\,\mathrm{cl}\,A=\mathrm{cl}\,A$: границу добавляют один раз. Тем же свойством обладает и [[vnutrennost|внутренность]]: $\mathrm{In}\,\mathrm{In}\,A=\mathrm{In}\,A$.`,
		related: ['zamykanie', 'vneshnost', 'zamknutoe-mnozhestvo', 'vnutrennost']
	},

	interval: {
		id: 'interval',
		term: 'Интервал (a; b)',
		short: String.raw`Открытый промежуток без концов; в $\mathbb R$ это открытый шар.`,
		formula: String.raw`(a;b)=\{x\in\mathbb R:\ a<x<b\}=B_{x_0}(r),\quad x_0=\tfrac{a+b}2,\ r=\tfrac{b-a}2`,
		body: String.raw`**Интервал** $(a;b)$ — промежуток без концов; в [[topologiya-r|топологии на $\mathbb R$]] интервалы [[otkrytoe-mnozhestvo|открыты]], что согласовано с границей $\partial(a;b)=\{a,b\}$, не пересекающейся с самим интервалом. В метрике $\rho(x,y)=|y-x|$ ([[metriki-rho|метрики $\rho$]]) интервал — это ровно **открытый шар**: $B_{x_0}(r)=\{x:\ |x_0-x|<r\}=(x_0-r;x_0+r)$, например $B_{52}$ радиуса $4{,}5$ — это $(47{,}5;\ 56{,}5)$. Парный ему замкнутый объект — [[otrezok|отрезок]].`,
		related: ['otrezok', 'topologiya-r', 'otkrytoe-mnozhestvo', 'metriki-rho']
	},

	otrezok: {
		id: 'otrezok',
		term: 'Отрезок [a; b]',
		short: String.raw`Замкнутый промежуток с концами; в $\mathbb R$ это замкнутый шар.`,
		formula: String.raw`[a;b]=\{x\in\mathbb R:\ a\le x\le b\}=\overline{B_{x_0}}(r)`,
		body: String.raw`**Отрезок** $[a;b]$ — промежуток вместе с концами. Он [[zamknutoe-mnozhestvo|замкнут]]: $\partial[a;b]=\{a,b\}\subset[a;b]$, а по-другому — его [[dopolnenie|дополнение]] $(-\infty;a)\cup(b;+\infty)$ открыто как объединение двух лучей. В метрике $|y-x|$ отрезок — **замкнутый шар** $\overline{B_{x_0}}(r)=[x_0-r;x_0+r]$, парный [[interval|интервалу]]: $(x;y)\leftrightarrow[x;y]$, $(-\infty;x)\leftrightarrow(-\infty;x]$, $(y;+\infty)\leftrightarrow[y;+\infty)$. Полуинтервал $[a;b)$ не попадает ни в один класс.`,
		related: ['interval', 'zamknutoe-mnozhestvo', 'granica-mnozhestva', 'metriki-rho']
	},

};
