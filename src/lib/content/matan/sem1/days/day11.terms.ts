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
		body: String.raw`**Обобщённой последовательностью** называют отображение $f:\mathbb N_1\to M$, где $M$ — [[metricheskoe-prostranstvo|метрическое пространство]] вместо $\mathbb R$. Область определения остаётся прежней, «обобщается» только кодомен: именно для таких $f$ формулируются теорема о единственности предела в метрическом пространстве и метрический аналог теоремы о двух городовых.

Не путать с **сетью** — отображением направленного множества $(D,\preceq)$ в пространство. Индексное множество сети произвольно: например, окрестности точки $x$, упорядоченные по обратному включению, направлены, но не занумерованы натуральными числами. Из-за этого сети описывают сходимость в топологиях, где последовательностей недостаточно, тогда как здесь индексом всегда служит $n\in\mathbb N_1$.`,
		related: ['posledovatelnost', 'metricheskoe-prostranstvo', 'predel-posledovatelnosti']
	},

	'skhodyashchayasya-posledovatelnost': {
		id: 'skhodyashchayasya-posledovatelnost',
		term: 'Сходящаяся последовательность',
		short: String.raw`Существует хотя бы одно $A$, являющееся её пределом.`,
		formula: String.raw`\exists A\in M:\ \lim_{n\to\infty}f(n)=A`,
		body: String.raw`Последовательность **сходится**, если $\exists A\in M:\ \lim\limits_{n\to\infty}f(n)=A$; иначе она **расходится**. Сходимость — это утверждение о существовании предела, а не свойство конкретного кандидата $A$, поэтому доказательство расходимости требует [[otricanie-predela|отрицания]] сразу для всех $A$.

Не путать со «[[skhodyashchayasya-v-sebe|сходящейся в себе]]» (фундаментальной): там условие формулируется без предельной точки, только через сближение членов между собой.`,
		related: ['predel-posledovatelnosti', 'otricanie-predela', 'skhodyashchayasya-v-sebe']
	},

	'stacionarnaya-posledovatelnost': {
		id: 'stacionarnaya-posledovatelnost',
		term: 'Стационарная последовательность',
		short: String.raw`Все члены равны: $f(n)\equiv c$.`,
		formula: String.raw`\forall n,m\in\mathbb N_1:\ f(n)=f(m)`,
		body: String.raw`**Стационарной** называется [[posledovatelnost|последовательность]], все члены которой равны: $f(n)\equiv c$. В $\varepsilon$-записи она сходится к $c$ с номером $N(\varepsilon)=1$.

Ровно на ней расходятся записи предела через модуль и через [[vykolotaya-okrestnost|выколотую окрестность]]: точка $c$ из $\mathring U_c$ удалена, поэтому $f(n)\in\mathring U_c$ не выполняется ни при каком $n$, и формально по этой записи стационарная последовательность не сходится. Различие двух записей сосредоточено целиком на членах, равных $c$: если $f(n)=c$ лишь конечное число раз, записи дают один и тот же класс сходящихся.`,
		related: ['predel-posledovatelnosti', 'vykolotaya-okrestnost', 'skhodyashchayasya-posledovatelnost']
	},

	'otricanie-predela': {
		id: 'otricanie-predela',
		term: 'Отрицание предела',
		short: String.raw`Есть $\varepsilon$, мимо которого промахивается сколь угодно далёкий член.`,
		formula: String.raw`\exists\varepsilon>0\ \forall N\in\mathbb N_1\ \exists n>N:\ |f(n)-A|\ge\varepsilon`,
		body: String.raw`Отрицание строится механически: $\forall\to\exists$, $\exists\to\forall$, $<\ \to\ \ge$. Утверждение «$A$ не является пределом» выглядит так: $$\exists\varepsilon>0\ \ \forall N\in\mathbb N_1\ \ \exists n>N:\ |f(n)-A|\ge\varepsilon.$$

Чтобы доказать расходимость [[posledovatelnost|последовательности]], этого мало — нужен внешний квантор $\forall A$. Конструктивная форма опровержения: предъявить номер-свидетель как функцию $n(A,N)$ — зеркальный аналог [[n-ot-epsilon|$N(\varepsilon)$]]. Пример: для $f(n)=n$ годится $\varepsilon=\frac12$ и $n(A,N)=\max\bigl(N+1,\lceil A+\frac12\rceil\bigr)$.`,
		related: ['predel-posledovatelnosti', 'skhodyashchayasya-posledovatelnost', 'n-ot-epsilon']
	},

};
