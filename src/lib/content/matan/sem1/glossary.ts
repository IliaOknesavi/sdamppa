import type { Glossary } from '$lib/types';

// =====================================================================
//  Сквозные термины и обозначения. Склеивается ПОСЛЕДНИМ, поэтому
//  перекрывает одноимённые карточки из dayNN.terms.ts.
// =====================================================================

export const glossary: Glossary = {
	'n-nol-n-odin': {
		id: 'n-nol-n-odin',
		term: 'ℕ₀ и ℕ₁',
		short: String.raw`Натуральные с нулём и без нуля — разные множества.`,
		formula: String.raw`0\in\mathbb N_0,\qquad 0\notin\mathbb N_1`,
		body: String.raw`Два обозначения, снимающие двусмысленность символа $\mathbb N$: $\mathbb N_0=\{0,1,2,\dots\}$ включает ноль, $\mathbb N_1=\{1,2,3,\dots\}$ — нет. Различие рабочее: [[posledovatelnost|последовательности]] и номера $N$ в определениях предела берутся из $\mathbb N_1$.`,
		related: ['naturalnye-chisla', 'posledovatelnost']
	},

	dopolnenie: {
		id: 'dopolnenie',
		term: 'Дополнение множества',
		short: String.raw`$\overline X$ — множество элементов, не лежащих в $X$.`,
		formula: String.raw`\overline{X} = \{e\in S : e\notin X\}`,
		body: String.raw`**Дополнение** множества $X$ до объемлющего $S$ — это все элементы $S$, не принадлежащие $X$. Обозначается чертой сверху: $\overline X$, при необходимости с указанием объемлющего множества — $\overline x_S$.

Черта зарезервирована именно за дополнением, поэтому [[zamykanie|замыкание]] обозначается $\mathrm{cl}\,A$. Пара связана правилом де Моргана: $\overline{A\cup B}=\overline A\cap\overline B$ и $\overline{A\cap B}=\overline A\cup\overline B$ — через него открытость переводится в замкнутость и обратно.`,
		related: ['zamykanie', 'zamknutoe-mnozhestvo', 'de-morgan']
	},

	zamykanie: {
		id: 'zamykanie',
		term: 'Замыкание cl A',
		short: String.raw`$\mathrm{cl}\,A = A\cup\partial A$ — множество вместе с границей.`,
		formula: String.raw`\operatorname{cl} A = A\cup\partial A`,
		body: String.raw`Множество вместе с его границей: $\operatorname{cl}A=A\cup\partial A$. Операция идемпотентна, а множество замкнуто ровно тогда, когда совпадает со своим замыканием.`,
		related: ['mnozhestvo', 'okrestnost', 'vnutrennyaya-tochka']
	},

	'vykolotaya-okrestnost': {
		id: 'vykolotaya-okrestnost',
		term: 'Выколотая окрестность',
		short: String.raw`$\mathring U_x = U\setminus\{x\}$ — окрестность без самой точки.`,
		formula: String.raw`\mathring U_x = U_x\setminus\{x\}`,
		body: String.raw`[[okrestnost|Окрестность]] точки, из которой удалена сама точка. Через неё формулируются определения, где значение в точке не должно влиять на результат: [[predel-funkcii|предел функции]], предельная точка.`,
		related: ['okrestnost', 'predel-funkcii']
	},

	'komponenta-svyaznosti': {
		id: 'komponenta-svyaznosti',
		term: 'Компонента связности',
		short: String.raw`Множество, одновременно открытое и замкнутое.`,
		body: String.raw`Множество, одновременно открытое и замкнутое. Такими всегда являются пустое множество и всё пространство; дополнение открыто-замкнутого множества снова открыто-замкнуто.`,
		related: ['zamykanie', 'lso', 'dopolnenie']
	},

	'metriki-rho': {
		id: 'metriki-rho',
		term: 'Семейство метрик ρ₁, ρ₂, ρₖ, ρ∞',
		short: String.raw`Манхэттенская, евклидова, $p$-метрика и чебышёвская.`,
		formula: String.raw`\rho_k(x,y)=\Bigl(\sum_i |x_i-y_i|^k\Bigr)^{1/k},\quad \rho_\infty=\max_i|x_i-y_i|`,
		body: String.raw`Набор метрик на $\mathbb R^n$: $\rho_1$ складывает модули покоординатных разностей, $\rho_2$ — евклидова, $\rho_k$ — общий степенной случай, $\rho_\infty$ берёт максимум модулей. Форма шара от метрики зависит, топология в $\mathbb R^n$ — нет.`,
		related: ['aksiomy-metriki', 'aksiomy-normy']
	},

	'end-r': {
		id: 'end-r',
		term: 'End(ℝ)',
		short: String.raw`Множество функций $\mathbb R\to\mathbb R$.`,
		formula: String.raw`\operatorname{End}(\mathbb R)=\{f:\mathbb R\to\mathbb R\}`,
		body: String.raw`Обозначение множества функций $\mathbb R\to\mathbb R$. Оно подчёркивает алгебраическую структуру: такие функции можно [[poelementnye-operacii|складывать и умножать]], составлять [[kompoziciya|композицию]], а дифференцирование действует на них как [[lineynyy-operator|линейный оператор]].`,
		related: ['funkciya', 'poelementnye-operacii', 'algebra-funkciy']
	},

	'skalyarnoe-pole': {
		id: 'skalyarnoe-pole',
		term: 'Скалярное поле',
		short: String.raw`Функция $\mathbb R^n\to\mathbb R$.`,
		formula: String.raw`f:\mathbb R^n\to\mathbb R`,
		body: String.raw`[[funkciya|Функция]] $f:\mathbb R^n\to\mathbb R$, сопоставляющая точке пространства число. От произвольного отображения в $\mathbb R$ отличается требованием [[soglasovannost-po-bazisu|независимости значения от выбора базиса]].`,
		related: ['funkciya', 'soglasovannost-po-bazisu']
	},

	lso: {
		id: 'lso',
		term: 'ЛСО, СО, ОСО, ОЛСО',
		short: String.raw`Линейно связная, связная, открытая связная, открытая линейно связная область.`,
		body: String.raw`Четыре сокращения: **СО** — связная область, не распадающаяся на два непустых открыто-замкнутых куска; **ЛСО** — линейно связная, в которой любые две точки соединяет путь; **ОСО** и **ОЛСО** — те же свойства вместе с открытостью.`,
		related: ['komponenta-svyaznosti', 'zamykanie']
	},

	'asimptoticheskie-klassy': {
		id: 'asimptoticheskie-klassy',
		term: 'Асимптотические классы O, o, Θ, ω, Ω',
		short: String.raw`Пять классов сравнения скоростей роста через предел отношения.`,
		formula: String.raw`f_n\in\Theta(g_n)\iff \lim\frac{f_n}{g_n}=c\in(0;\infty)`,
		body: String.raw`Пять классов сравнения скоростей роста, определяемых пределом отношения $f_n/g_n$: конечный предел даёт $O$, нулевой — $\bar o$, конечный ненулевой — $\Theta$, бесконечный — $\omega$, отделённый от нуля — $\Omega$.`,
		related: ['predel-posledovatelnosti']
	},

	'skhodyashchayasya-v-sebe': {
		id: 'skhodyashchayasya-v-sebe',
		term: 'Сходящаяся в себе (фундаментальная)',
		short: String.raw`Члены сближаются между собой, без указания предела.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\ \forall n>N\ \forall p\in\mathbb N_1:\ \rho(x_n,x_{n+p})<\varepsilon`,
		body: String.raw`Последовательность, члены которой неограниченно сближаются друг с другом. Предел в определении не упоминается, поэтому проверить свойство можно, не зная ответа; из сходимости оно следует всегда, обратное — только в [[polnota|полных]] пространствах.`,
		related: ['posledovatelnost', 'polnota', 'aksiomy-metriki']
	},

	'chastichnaya-posledovatelnost': {
		id: 'chastichnaya-posledovatelnost',
		term: 'Частичная последовательность',
		short: String.raw`Хвост $x_k,x_{k+1},\dots$ — последовательность без первых членов.`,
		body: String.raw`**Частичная последовательность** — хвост исходной: те же члены начиная с номера $k$. Её предел называют частичным пределом.

Отбрасывание конечного числа членов не влияет ни на существование предела, ни на его значение: условие «начиная с некоторого номера» переживает сдвиг нумерации. Именно поэтому свойства последовательности формулируют «в хвосте», а первые сколько угодно членов можно испортить безнаказанно.

Не путать с [[podposledovatelnost|подпоследовательностью]] $x_{n_k}$, где номера $n_1<n_2<\dots$ выбираются произвольно: у неё пределов может быть много, тогда как у хвостов он один.`,
		related: ['verkhniy-predel', 'predel-posledovatelnosti', 'bolcano-veyershtrass']
	},

	'priznak-i-svoystvo': {
		id: 'priznak-i-svoystvo',
		term: 'Признак и свойство',
		short: String.raw`Признак — достаточное условие, свойство — необходимое.`,
		body: String.raw`В импликации $A\Rightarrow B$ посылка достаточна, а заключение необходимо. Утверждение, из которого сходимость следует, называют **признаком**; утверждение, вытекающее из сходимости, — **свойством**. Условие, необходимое и достаточное сразу, называют критерием.`,
		related: ['kontrapoziciya']
	},

	'n-ot-epsilon': {
		id: 'n-ot-epsilon',
		term: 'Номер как функция от эпсилон',
		short: String.raw`$N=N(\varepsilon)$ — граница, начиная с которой выполнено неравенство.`,
		formula: String.raw`N(\varepsilon)=\Bigl\lceil \tfrac1\varepsilon\Bigr\rceil`,
		body: String.raw`В определении предела номер $N$ стоит под квантором существования после $\varepsilon$, то есть зависит от $\varepsilon$. Эта зависимость и есть содержание утверждения о сходимости: чем меньше допуск, тем дальше приходится уходить по номерам.

Доказательство сходимости заканчивается явной формулой для $N(\varepsilon)$ — например, $N(\varepsilon)=\lceil 1/\varepsilon\rceil$ для $x_n=1/n$. Формула не только доказывает существование предела, но и отвечает на вопрос «сколько членов взять, чтобы попасть в допуск», а это ровно то, что нужно при численном счёте.

Когда пределов несколько, номера индексируют по объекту: $N_x$, $N_y$, $N_{x+y}$. Итоговый номер собирается из них максимумом.`,
		related: ['predel-posledovatelnosti', 'skhodyashchayasya-v-sebe']
	}
};
