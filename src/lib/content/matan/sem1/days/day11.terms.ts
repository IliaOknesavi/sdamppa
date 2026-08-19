import type { Glossary } from '$lib/types';

// Термины дня 11. День должен резолвиться независимо, поэтому среды,
// нужные определению предела (метрика, норма, шар, окрестность,
// топологическое пространство), определены здесь в том объёме, в каком
// они работают в определении предела. Переиспользуются по ссылкам и НЕ
// переобъявляются: n-nol-n-odin, vykolotaya-okrestnost, metriki-rho,
// asimptoticheskie-klassy, skhodyashchayasya-v-sebe,
// chastichnaya-posledovatelnost, blacksquare.
export const day11Terms: Glossary = {
	posledovatelnost: {
		id: 'posledovatelnost',
		term: 'Последовательность',
		short: String.raw`Отображение $f:\mathbb N_1\to M$, а не «набор чисел с номерами».`,
		formula: String.raw`f:\ \mathbb N_1\to M`,
		body: String.raw`**Последовательность** — это **отображение** $f:\mathbb N_1\to M$, где [[n-nol-n-odin|$\mathbb N_1$]] — натуральные без нуля. Определение через функцию, а не через «перечень членов», принципиально: у последовательности есть область определения, образ и композиция, и к ней применимо всё, что доказано про отображения.

Запись $x_n$ — сокращение для $f(n)$. Примеры: $f(n)=\frac1n$ и $f(n)=\sqrt n$. Если кодомен $M$ — [[metricheskoe-prostranstvo|метрическое пространство]], такое отображение называют [[obobshchennaya-posledovatelnost|обобщённой последовательностью]].`,
		related: ['n-nol-n-odin', 'obobshchennaya-posledovatelnost', 'predel-posledovatelnosti']
	},

	'obobshchennaya-posledovatelnost': {
		id: 'obobshchennaya-posledovatelnost',
		term: 'Обобщённая последовательность',
		short: String.raw`Последовательность со значениями в метрическом пространстве.`,
		formula: String.raw`f:\ \mathbb N_1\to M,\quad (M,\rho)`,
		body: String.raw`**Обобщённой последовательностью** называют отображение $f:\mathbb N_1\to M$, где $M$ — [[metricheskoe-prostranstvo|метрическое пространство]] вместо $\mathbb R$. Область определения остаётся прежней, «обобщается» только кодомен: именно для таких $f$ формулируются теорема о единственности предела в метрическом пространстве и метрический аналог теоремы о двух городовых.

Не путать с **сетью** — отображением направленного множества $(D,\preceq)$ в пространство. Индексное множество сети произвольно: например, окрестности точки $x$, упорядоченные по обратному включению, направлены, но не занумерованы натуральными числами. Из-за этого сети описывают сходимость в топологиях, где последовательностей недостаточно, тогда как здесь индексом всегда служит $n\in\mathbb N_1$.`,
		related: ['posledovatelnost', 'metricheskoe-prostranstvo', 'predel-posledovatelnosti']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`Пять записей: через ρ, норму, шар, окрестность и модуль.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1:\ \forall n>N\ \ \rho(f(n),A)<\varepsilon`,
		body: String.raw`$\lim\limits_{n\to\infty}f(n)=A$ записывается пятью формами, сверху вниз от общей среды к частной: через [[metrika|метрику]] $\rho(f(n),A)<\varepsilon$; через [[norma|норму]] $\lVert f(n)-A\rVert<\varepsilon$; через [[shar|открытый шар]] $f(n)\in B_A(\varepsilon)$; через [[vykolotaya-okrestnost|выколотую окрестность]] $f(n)\in\mathring U_A$ (метрика не нужна); и последней — вещественную запись $|f(n)-A|<\varepsilon$.

Первые три и пятая задают в $\mathbb R$ один класс сходящихся последовательностей, четвёртая строго сильнее: она отсекает те $f$, у которых $f(n)=A$ бесконечно часто. Доказательство предела считается законченным, когда выписана явная функция [[n-ot-epsilon|$N(\varepsilon)$]].`,
		related: ['posledovatelnost', 'shar', 'vykolotaya-okrestnost', 'n-ot-epsilon']
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

	'n-ot-epsilon': {
		id: 'n-ot-epsilon',
		term: 'N(ε) — номер как функция от эпсилон',
		short: String.raw`Номер, полученный разворачиванием неравенства $|f(n)-A|<\varepsilon$ относительно $n$.`,
		formula: String.raw`N(\varepsilon)=\left\lceil\frac1\varepsilon\right\rceil\quad\text{для } f(n)=\tfrac1n`,
		body: String.raw`$N$ — не «какое-то число», а **функция** от $\varepsilon$, которую получают, развернув неравенство $|f(n)-A|<\varepsilon$ относительно $n$. Для $f(n)=\frac1n$ выходит $N(\varepsilon)=\lceil1/\varepsilon\rceil$, для суммы — $N_{x+y}=\max\bigl(N_x(\varepsilon/2),N_y(\varepsilon/2)\bigr)$.

Эпсилоны именуются по объекту ($\varepsilon_x,\varepsilon_y,\varepsilon_{x+y}$) и трактуются как ресурс, который распределяют между слагаемыми. Фраза «значит, предел существует» доказательством не является: без явного $N$ условие $\forall n>N$ проверить не на чем.`,
		related: ['predel-posledovatelnosti', 'otricanie-predela', 'skhodyashchayasya-posledovatelnost']
	},

	metrika: {
		id: 'metrika',
		term: 'Метрика ρ',
		short: String.raw`Функция расстояния: неотрицательность, симметрия, неравенство треугольника.`,
		formula: String.raw`\rho(x,z)\le\rho(x,y)+\rho(y,z)`,
		body: String.raw`**Метрика** на множестве $M$ — функция $\rho:M\times M\to\mathbb R$ со свойствами: $\rho(x,y)\ge0$, причём $\rho(x,y)=0\iff x=y$; $\rho(x,y)=\rho(y,x)$; неравенство треугольника $\rho(x,z)\le\rho(x,y)+\rho(y,z)$.

В определении предела используется только неотрицательность (чтобы снять модуль в $|\rho-0|$) и, позже, неравенство треугольника — оно несёт всю арифметику пределов и лемму о непересечении шаров. На одном множестве метрик много: [[metriki-rho|семейство $\rho_1,\rho_2,\rho_k,\rho_\infty$]] задаёт на $\mathbb R^k$ разные расстояния, и предел формулируется относительно выбранного.`,
		related: ['metricheskoe-prostranstvo', 'metriki-rho', 'shar']
	},

	'metricheskoe-prostranstvo': {
		id: 'metricheskoe-prostranstvo',
		term: 'Метрическое пространство',
		short: String.raw`Пара $(M,\rho)$: множество с заданной на нём метрикой.`,
		formula: String.raw`(M,\rho)`,
		body: String.raw`**Метрическое пространство** — пара $(M,\rho)$, где $\rho$ — [[metrika|метрика]] на $M$. Это среда, в которой предел последовательности формулируется в первой (самой общей из «расстояниевых») форме: $\rho(f(n),A)<\varepsilon$.

Иерархия сред: топологическое $\supset$ метрическое $\supset$ нормированное $\supset\mathbb R$. Поэтому $\mathbb R$ — частный случай ($\rho(x,y)=|x-y|$), а не отправная точка, и последовательность со значениями в $M$ называется [[obobshchennaya-posledovatelnost|обобщённой]].`,
		related: ['metrika', 'topologicheskoe-prostranstvo', 'norma', 'shar']
	},

	norma: {
		id: 'norma',
		term: 'Норма ‖·‖',
		short: String.raw`Длина вектора; порождает метрику $\rho(x,y)=\lVert x-y\rVert$.`,
		formula: String.raw`\rho(x,y)=\lVert x-y\rVert`,
		body: String.raw`**Норма** $\lVert\cdot\rVert$ — «длина» элемента: однородность $\lVert\lambda x\rVert=|\lambda|\,\lVert x\rVert$, неравенство треугольника и равенство нулю только на нуле. Всякая норма порождает [[metrika|метрику]] $\rho(x,y)=\lVert x-y\rVert$, поэтому вторая запись предела — частный случай первой, а в $\mathbb R$ норма это модуль, что даёт пятую.

Обратный переход не всегда возможен: запись $\lVert f(n)-A\rVert$ требует, чтобы в $M$ была определена разность элементов, то есть чтобы $M$ было линейным пространством. Метрическая запись $\rho(f(n),A)$ такого не требует и работает, например, на сфере или на множестве слов с расстоянием Хэмминга.`,
		related: ['metrika', 'metricheskoe-prostranstvo', 'predel-posledovatelnosti']
	},

	shar: {
		id: 'shar',
		term: 'Открытый шар B_A(ε)',
		short: String.raw`Все точки на расстоянии меньше $\varepsilon$ от центра.`,
		formula: String.raw`B_A(\varepsilon)=\{x\in M:\ \rho(x,A)<\varepsilon\}`,
		body: String.raw`**Открытый шар** радиуса $\varepsilon$ с центром $A$ — множество $B_A(\varepsilon)=\{x\in M:\ \rho(x,A)<\varepsilon\}$. Запись $f(n)\in B_A(\varepsilon)$ и неравенство $\rho(f(n),A)<\varepsilon$ — одно и то же, поэтому формы 1 и 3 определения предела совпадают дословно.

Обозначения $B_A(\varepsilon)$, $B_\varepsilon(A)$ и $B_{d_a}(a)$ означают одно и то же: центр и радиус читаются по смыслу букв. Замкнутый шар пишется $\overline B_r(x)$ — он нужен в метрической теореме о двух городовых. Вид шара зависит от [[metriki-rho|выбранной метрики]]: в $\rho_\infty$ это куб.`,
		related: ['metrika', 'okrestnost', 'predel-posledovatelnosti', 'metriki-rho']
	},

	okrestnost: {
		id: 'okrestnost',
		term: 'Окрестность точки',
		short: String.raw`Любое открытое множество, содержащее точку.`,
		formula: String.raw`U_x\in\tau,\quad x\in U_x`,
		body: String.raw`**Окрестность** $U_x$ точки $x$ — любой элемент топологии $\tau$, содержащий $x$. В [[metricheskoe-prostranstvo|метрическом пространстве]] всякий [[shar|открытый шар]] $B_x(\varepsilon)$ является окрестностью, и этого хватает, чтобы перевести определение предела с языка $\varepsilon$ на язык окрестностей.

Из окрестности получается [[vykolotaya-okrestnost|выколотая окрестность]] $\mathring U_x=U_x\setminus\{x\}$, через которую определяются предел функции в точке и предельная точка множества. Для предела **последовательности** выкалывание меняет смысл определения — см. разбор стационарной последовательности.`,
		related: ['vykolotaya-okrestnost', 'shar', 'topologicheskoe-prostranstvo']
	},

	'topologicheskoe-prostranstvo': {
		id: 'topologicheskoe-prostranstvo',
		term: 'Топологическое пространство',
		short: String.raw`Пара $(T,\tau)$: множество и система его открытых подмножеств.`,
		formula: String.raw`(T,\tau),\qquad \varnothing,\,T\in\tau`,
		body: String.raw`**Топологическое пространство** — пара $(T,\tau)$, где $\tau\subset2^T$ содержит $\varnothing$ и $T$, замкнуто относительно произвольных объединений и **конечных** пересечений. Элементы $\tau$ — открытые множества.

Это самая общая из сред, в которых определяется предел: расстояний в ней нет, поэтому условие формулируется исключительно через [[okrestnost|окрестности]] — форма 4. Метрика порождает топологию (базу дают шары), и потому [[metricheskoe-prostranstvo|метрическое пространство]] — частный случай топологического, а $\mathbb R$ — частный случай метрического.`,
		related: ['okrestnost', 'metricheskoe-prostranstvo', 'vykolotaya-okrestnost']
	}
};
