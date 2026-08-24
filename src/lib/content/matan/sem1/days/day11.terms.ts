import type { Glossary } from '$lib/types';

// Термины дня 11. День должен резолвиться независимо, поэтому среды,
// нужные определению предела (метрика, норма, шар, окрестность,
// топологическое пространство), определены здесь в том объёме, в каком
// они работают в определении предела. Переиспользуются по ссылкам и НЕ
// переобъявляются: n-nol-n-odin, vykolotaya-okrestnost, metriki-rho,
// asimptoticheskie-klassy, skhodyashchayasya-v-sebe,
// chastichnaya-posledovatelnost, blacksquare.
export const day11Terms: Glossary = {
	'obobshchennaya-posledovatelnost': {
		id: 'obobshchennaya-posledovatelnost',
		term: 'Обобщённая последовательность',
		short: String.raw`Последовательность со значениями в метрическом пространстве.`,
		formula: String.raw`f:\ \mathbb N_1\to M,\quad (M,\rho)`,
		body: String.raw`**Обобщённой последовательностью** называют отображение $f:\mathbb N_1\to M$, где $M$ — [[metricheskoe-prostranstvo|метрическое пространство]] вместо $\mathbb R$: у обычной [[posledovatelnost|последовательности]] обобщается только кодомен, область определения остаётся прежней. Не путать с **сетью** — отображением направленного множества $(D,\preceq)$ в пространство: у сети произвольно индексное множество, а здесь индексом всегда служит $n\in\mathbb N_1$.`,
		related: ['posledovatelnost', 'metricheskoe-prostranstvo', 'predel-posledovatelnosti']
	},

	'skhodyashchayasya-posledovatelnost': {
		id: 'skhodyashchayasya-posledovatelnost',
		term: 'Сходящаяся последовательность',
		short: String.raw`Существует хотя бы одно $A$, являющееся её пределом.`,
		formula: String.raw`\exists A\in M:\ \lim_{n\to\infty}f(n)=A`,
		body: String.raw`Последовательность **сходится**, если $\exists A\in M:\ \lim\limits_{n\to\infty}f(n)=A$; иначе она **расходится**. Сходимость — утверждение о существовании [[predel-posledovatelnosti|предела]], а не свойство конкретного кандидата $A$. Не путать со «[[skhodyashchayasya-v-sebe|сходящейся в себе]]» (фундаментальной): там условие формулируется без предельной точки, только через сближение членов между собой.`,
		related: ['predel-posledovatelnosti', 'otricanie-predela', 'skhodyashchayasya-v-sebe']
	},

	'stacionarnaya-posledovatelnost': {
		id: 'stacionarnaya-posledovatelnost',
		term: 'Стационарная последовательность',
		short: String.raw`Все члены равны: $f(n)\equiv c$.`,
		formula: String.raw`\forall n,m\in\mathbb N_1:\ f(n)=f(m)`,
		body: String.raw`**Стационарной** называется [[posledovatelnost|последовательность]], все члены которой равны: $f(n)\equiv c$; в $\varepsilon$-записи она сходится к $c$ с номером $N(\varepsilon)=1$. Ровно на ней расходятся записи предела через модуль и через [[vykolotaya-okrestnost|выколотую окрестность]]: точка $c$ из $\mathring U_c$ удалена, поэтому $f(n)\in\mathring U_c$ не выполняется ни при каком $n$, и формально по этой записи стационарная последовательность не сходится.`,
		related: ['predel-posledovatelnosti', 'vykolotaya-okrestnost', 'skhodyashchayasya-posledovatelnost']
	},

	'otricanie-predela': {
		id: 'otricanie-predela',
		term: 'Отрицание предела',
		short: String.raw`Есть $\varepsilon$, мимо которого промахивается сколь угодно далёкий член.`,
		formula: String.raw`\exists\varepsilon>0\ \forall N\in\mathbb N_1\ \exists n>N:\ |f(n)-A|\ge\varepsilon`,
		body: String.raw`Отрицание строится механически: $\forall\to\exists$, $\exists\to\forall$, $<\ \to\ \ge$. Утверждение «$A$ не является [[predel-posledovatelnosti|пределом]] [[posledovatelnost|последовательности]] $f$» — отрицание для одного $A$, а не расходимость, для которой нужен ещё внешний квантор $\forall A$: $$\exists\varepsilon>0\ \ \forall N\in\mathbb N_1\ \ \exists n>N:\ |f(n)-A|\ge\varepsilon.$$`,
		related: ['predel-posledovatelnosti', 'skhodyashchayasya-posledovatelnost', 'n-ot-epsilon']
	},

};
