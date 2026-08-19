import type { Glossary } from '$lib/types';

// Термины дня 12 (арифметика пределов). Термины, введённые в предыдущих днях,
// сознательно продублированы здесь (predel-posledovatelnosti, n-ot-epsilon,
// neravenstvo-treugolnika) — день должен резолвиться независимо.
// НЕ дублируются термины общего глоссария, на них только ссылки:
// n-nol-n-odin, vykolotaya-okrestnost, metriki-rho, asimptoticheskie-klassy,
// end-r, blacksquare и остальные из sem1/glossary.ts.
export const day12Terms: Glossary = {
	'arifmetika-predelov': {
		id: 'arifmetika-predelov',
		term: 'Арифметика пределов',
		short: String.raw`Сумма, разность, умножение на константу, произведение, частное.`,
		formula: String.raw`\lim(x_n\pm y_n)=A\pm B,\quad \lim x_ny_n=AB,\quad \lim\frac{x_n}{y_n}=\frac AB\ (B\ne0)`,
		body: String.raw`**Арифметика пределов** — блок свойств, позволяющих считать предел составного выражения по пределам частей. Пунктов пять: [[predel-summy|сумма и разность]], [[umnozhenie-na-konstantu|умножение на константу]] при $C\ne0$, [[predel-proizvedeniya|произведение]] и [[predel-chastnogo|частное]] при $B\ne0$; каждый доказывается отдельно, до явной формулы для номера.

Раскладывать предел законно **только при существовании обоих пределов**; обратное неверно — сумма может сходиться при расходящихся слагаемых.`,
		related: ['predel-summy', 'predel-proizvedeniya', 'predel-chastnogo', 'n-ot-epsilon']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`Для любого ε найдётся номер, после которого все члены ближе ε к A.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1\ \forall n>N:\ |x_n-A|<\varepsilon`,
		body: String.raw`Рабочая (вещественная) форма определения: для любого $\varepsilon>0$ существует номер $N\in$ [[n-nol-n-odin|$\mathbb N_1$]], начиная с которого $|x_n-A|<\varepsilon$. Ей эквивалентны формулировки через метрику $\rho$, через норму, через открытый шар $B_A(\varepsilon)$ и через [[vykolotaya-okrestnost|выколотую окрестность]] $\mathring U_A$ — от общего к частному.

Все доказательства арифметики пределов — это переписывание кванторов этого определения. Подробно — день 11.`,
		related: ['n-ot-epsilon', 'vykolotaya-okrestnost', 'n-nol-n-odin', 'arifmetika-predelov']
	},

	'n-ot-epsilon': {
		id: 'n-ot-epsilon',
		term: 'Номер как функция от эпсилона',
		short: String.raw`$N$ — не константа, а функция $N(\varepsilon)$; ею и кончается вывод.`,
		formula: String.raw`N_x(\varepsilon)=\lceil 1/\varepsilon\rceil\quad\text{для } x_n=1/n`,
		body: String.raw`Номер трактуется как **функция от точности**, $N_x(\varepsilon)$, и его можно вычислять в любой точке — в частности, подставлять $\varepsilon/2$, $\varepsilon/|C|$, $\varepsilon/(2C)$.

Отсюда и критерий законченности: пока явная зависимость $N$ от $\varepsilon$ не выписана, условие $\forall n>N$ проверить не на чем, и утверждение остаётся необоснованным. Фраза «значит, предел существует» такой зависимости не даёт и вывода не заменяет.`,
		related: ['indeksaciya-epsilonov', 'raspredelenie-epsilon', 'predel-posledovatelnosti']
	},

	'indeksaciya-epsilonov': {
		id: 'indeksaciya-epsilonov',
		term: 'Эпсилон с индексом по объекту',
		short: String.raw`У каждой последовательности свой ε и свой N: ε_x, ε_y, ε_{x+y}.`,
		formula: String.raw`\varepsilon_x,\ \varepsilon_y,\ \varepsilon_{x+y};\qquad N_x,\ N_y,\ N_{x+y}`,
		body: String.raw`Дисциплина обозначений: эпсилоны и номера **именуются по объекту** — $\varepsilon_x,N_x$ для $x_n$, $\varepsilon_y,N_y$ для $y_n$, $\varepsilon_{x+y},N_{x+y}$ для результата. Там, где к одному определению обращаются дважды за разным, различают и подставляемые эпсилоны: в доказательстве [[predel-chastnogo|частного]] значение $\varepsilon_y=|B|/2$ работает на отделённость знаменателя от нуля, а $\varepsilon_y=\frac{\varepsilon|B|^2}{4(|A|+1)}$ — на итоговую оценку, и путать их номера под знаком максимума нельзя.

Смысл не косметический: индекс снимает главную ошибку — «чей это $N$», когда одна буква обслуживает три разных определения и становится непонятно, какое неравенство гарантировано.`,
		related: ['n-ot-epsilon', 'raspredelenie-epsilon', 'arifmetika-predelov']
	},

	'raspredelenie-epsilon': {
		id: 'raspredelenie-epsilon',
		term: 'Распределение эпсилона',
		short: String.raw`Целевой ε делят между источниками ошибки: ε/2 + ε/2, ε/k, θε + (1−θ)ε.`,
		formula: String.raw`\varepsilon_x=\varepsilon_y=\frac{\varepsilon_{x+y}}{2}\ \Rightarrow\ N_{x+y}=\max\bigl(N_x(\tfrac{\varepsilon}{2}),N_y(\tfrac{\varepsilon}{2})\bigr)`,
		body: String.raw`Именованный приём: целевая точность — ресурс, который делят между источниками ошибки так, чтобы сумма долей не превысила целевого значения. Для двух слагаемых берут $\varepsilon/2$, для $k$ — $\varepsilon/k$, при разных коэффициентах усиления доли делают неравными ($\varepsilon/(2C)$ в [[predel-proizvedeniya|произведении]]).

Право на подстановку даёт произвольность $\varepsilon_x$ в чужом определении, а разбивает ошибку на слагаемые [[neravenstvo-treugolnika|неравенство треугольника]].`,
		related: ['neravenstvo-treugolnika', 'predel-summy', 'n-ot-epsilon', 'indeksaciya-epsilonov']
	},

	'predel-summy': {
		id: 'predel-summy',
		term: 'Предел суммы и разности',
		short: String.raw`lim(x_n ± y_n) = A ± B с номером max(N_x(ε/2), N_y(ε/2)).`,
		formula: String.raw`N_{x\pm y}(\varepsilon)=\max\Bigl(N_x\bigl(\tfrac{\varepsilon}{2}\bigr),\ N_y\bigl(\tfrac{\varepsilon}{2}\bigr)\Bigr)`,
		body: String.raw`Если $\lim x_n=A$ и $\lim y_n=B$, то $\lim(x_n\pm y_n)=A\pm B$. Доказательство: [[neravenstvo-treugolnika|неравенство треугольника]] даёт $|(x_n\pm y_n)-(A\pm B)|\le|x_n-A|+|y_n-B|$, затем [[raspredelenie-epsilon|распределение эпсилона]] пополам.

Максимум в формуле нужен потому, что каждое из двух определений работает лишь со своего номера: общий номер — это момент, когда выполнены оба неравенства сразу.`,
		related: ['raspredelenie-epsilon', 'neravenstvo-treugolnika', 'arifmetika-predelov', 'n-ot-epsilon']
	},

	'umnozhenie-na-konstantu': {
		id: 'umnozhenie-na-konstantu',
		term: 'Предел произведения на константу',
		short: String.raw`lim C·x_n = C·A при C ≠ 0, номер N_x(ε/|C|).`,
		formula: String.raw`\lim_{n\to\infty}Cx_n=CA,\qquad N_{cx}(\varepsilon_{cx})=N_x\Bigl(\frac{\varepsilon_{cx}}{|C|}\Bigr)`,
		body: String.raw`Из $|Cx_n-CA|=|C|\,|x_n-A|$ следует, что достаточно потребовать $|x_n-A|<\varepsilon_{cx}/|C|$ — отсюда и номер.

Условие $C\ne0$ ограничивает **приём, а не факт**: при $C=0$ последовательность $Cx_n$ тождественно нулевая и её предел равен $0=C\cdot A$, но деление на $|C|$ в выводе невозможно, поэтому случай разбирается отдельно. То же ограничение $\lambda\ne0$ всплывает в свойствах [[asimptoticheskie-klassy|асимптотических классов]].`,
		related: ['arifmetika-predelov', 'n-ot-epsilon', 'asimptoticheskie-klassy']
	},

	'predel-proizvedeniya': {
		id: 'predel-proizvedeniya',
		term: 'Предел произведения',
		short: String.raw`lim x_n·y_n = A·B; в выводе нужна мажоранта для |x_n|.`,
		formula: String.raw`N_{xy}(\varepsilon)=\max\Bigl(N_x(1),\ N_x\bigl(\tfrac{\varepsilon}{2C}\bigr),\ N_y\bigl(\tfrac{\varepsilon}{2C}\bigr)\Bigr),\quad C=\max(|B|,|A|+1)`,
		body: String.raw`Доказательство идёт через промежуточный член: $x_ny_n-AB=x_n(y_n-B)+B(x_n-A)$, откуда $|x_ny_n-AB|\le|x_n|\,|y_n-B|+|B|\,|x_n-A|$.

Переменный множитель $|x_n|$ заменяется [[mazhoranta|мажорантой]] $C$, после чего работает обычное [[raspredelenie-epsilon|распределение эпсилона]] с долями $\varepsilon/(2C)$. Именно здесь неявно используется [[ogranichennaya-posledovatelnost|ограниченность сходящейся последовательности]] — точнее, её хвостовая часть, доступная прямо из определения предела.`,
		related: ['mazhoranta', 'raspredelenie-epsilon', 'ogranichennaya-posledovatelnost', 'arifmetika-predelov']
	},

	'predel-chastnogo': {
		id: 'predel-chastnogo',
		term: 'Предел частного',
		short: String.raw`lim x_n/y_n = A/B при B ≠ 0; первый шаг — отделённость от нуля.`,
		formula: String.raw`\lim_{n\to\infty}\frac{x_n}{y_n}=\frac AB\quad (B\ne0)`,
		body: String.raw`При $B\ne0$ частное сходится к $A/B$. Вывод состоит из двух шагов: сначала [[otdelennost-ot-nulya|отделённость знаменателя от нуля]] (подстановка $\varepsilon_y=|B|/2$), затем оценка $\bigl|\frac{x_n}{y_n}-\frac AB\bigr|\le\frac{|B||x_n-A|+|A||y_n-B|}{|y_n||B|}$ и [[raspredelenie-epsilon|распределение эпсилона]] неравными долями.

Частный случай $A=0$ читается сразу: бесконечно малая, делённая на последовательность с ненулевым пределом, остаётся бесконечно малой.`,
		related: ['otdelennost-ot-nulya', 'raspredelenie-epsilon', 'arifmetika-predelov']
	},

	mazhoranta: {
		id: 'mazhoranta',
		term: 'Мажоранта',
		short: String.raw`Число C, ограничивающее сверху все нужные модули сразу.`,
		formula: String.raw`C=\max\bigl(|B|,\ |A|+1\bigr)\ \ge 1>0`,
		body: String.raw`**Мажоранта** — постоянная, которой сверху накрывают переменные величины, чтобы в оценке остались только контролируемые множители. В [[predel-proizvedeniya|произведении]] мажорируются $|x_n|$ и $|B|$ одним числом $C$.

Оценка $|x_n|<|A|+1$ добывается подстановкой $\varepsilon_x=1$ в определение предела и верна на хвосте $n>N_x(1)$; цена приёма — лишний член $N_x(1)$ под максимумом. При произвольном $\varepsilon_x$ годится и более тонкое $C=\max\bigl(|B|,|A+\varepsilon_x|,|A-\varepsilon_x|\bigr)$: модули обязательны, без них при отрицательных $A$ или $B$ число перестаёт мажорировать.`,
		related: ['predel-proizvedeniya', 'ogranichennaya-posledovatelnost', 'neravenstvo-treugolnika']
	},

	'ogranichennaya-posledovatelnost': {
		id: 'ogranichennaya-posledovatelnost',
		term: 'Ограниченная последовательность',
		short: String.raw`Ограничена сверху и снизу: ∃A ∀n x_n ≤ A и ∃B ∀n x_n ≥ B.`,
		formula: String.raw`\exists A\ \forall n:\ x_n\le A;\qquad \exists B\ \forall n:\ x_n\ge B`,
		body: String.raw`Ограниченность задаётся парой условий — сверху и снизу. Сходящаяся последовательность ограничена ($\exists\sup x_n$, $\exists\inf x_n$); эта теорема доказывается в дне 15, хотя доказательство [[predel-proizvedeniya|произведения]] уже ею неявно пользуется.

Петля закрывается: в произведении нужна лишь хвостовая оценка $|x_n|<|A|+1$ прямо из определения предела, и она не опирается на арифметику. В формуле $A$ — верхняя граница, $B$ — нижняя; это другие $A$ и $B$, нежели пределы в теоремах арифметики.`,
		related: ['mazhoranta', 'predel-proizvedeniya', 'predel-posledovatelnosti']
	},

	'neravenstvo-treugolnika': {
		id: 'neravenstvo-treugolnika',
		term: 'Неравенство треугольника',
		short: String.raw`|a+b| ≤ |a|+|b|; в метрике — ρ(x,z) ≤ ρ(x,y)+ρ(y,z).`,
		formula: String.raw`|a+b|\le|a|+|b|,\qquad \rho(x,z)\le\rho(x,y)+\rho(y,z)`,
		body: String.raw`Инструмент, который разбивает ошибку составного выражения на слагаемые — без него [[raspredelenie-epsilon|распределять эпсилон]] было бы не между чем. Та же запись справа налево: $|a|+|b|\ge|a+b|$.

Модульная версия — частный случай аксиомы [[metriki-rho|метрики]]; в нормированном пространстве ту же роль играет аксиома нормы $\lVert a+b\rVert\le\lVert a\rVert+\lVert b\rVert$. Полезен и «обратный» вид: $|x|\ge|A|-|x-A|$.`,
		related: ['raspredelenie-epsilon', 'predel-summy', 'metriki-rho', 'otdelennost-ot-nulya']
	},

	'otdelennost-ot-nulya': {
		id: 'otdelennost-ot-nulya',
		term: 'Отделённость знаменателя от нуля',
		short: String.raw`При B ≠ 0 с некоторого номера |y_n| > |B|/2.`,
		formula: String.raw`n>N_y\Bigl(\tfrac{|B|}{2}\Bigr)\ \Longrightarrow\ |y_n|>\frac{|B|}{2}>0`,
		body: String.raw`Подстановка $\varepsilon_y=|B|/2$ в определение предела $y_n$ даёт $|y_n|\ge|B|-|y_n-B|>|B|/2$ — знаменатель не только не обращается в нуль, но и ограничен снизу постоянной.

Без этого шага [[predel-chastnogo|предел частного]] не доказать: в оценке дроби знаменатель стоит внизу, и сколь угодно малое $|y_n|$ разгоняет правую часть как угодно. Тот же приём отделённости используется в свойстве «бесконечно большая на сходящуюся с ненулевым пределом».`,
		related: ['predel-chastnogo', 'neravenstvo-treugolnika', 'n-ot-epsilon']
	}
};
