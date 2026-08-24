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
		body: String.raw`Набор свойств, позволяющих считать [[predel-posledovatelnosti|предел]] составного выражения по пределам частей: сумма, разность, умножение на константу, произведение и частное при ненулевом пределе знаменателя. Раскладывать предел законно только при существовании обоих пределов.`,
		related: ['predel-posledovatelnosti', 'predel-funkcii']
	},

	'indeksaciya-epsilonov': {
		id: 'indeksaciya-epsilonov',
		term: 'Эпсилон с индексом по объекту',
		short: String.raw`У каждой последовательности свой ε и свой N: ε_x, ε_y, ε_{x+y}.`,
		formula: String.raw`\varepsilon_x,\ \varepsilon_y,\ \varepsilon_{x+y};\qquad N_x,\ N_y,\ N_{x+y}`,
		body: String.raw`Дисциплина обозначений в теоремах [[arifmetika-predelov|арифметики пределов]]: эпсилоны и [[n-ot-epsilon|номера]] **именуются по объекту** — $\varepsilon_x,N_x$ для $x_n$, $\varepsilon_y,N_y$ для $y_n$, $\varepsilon_{x+y},N_{x+y}$ для результата. Там, где к одному определению обращаются дважды за разным, различают и подставляемые эпсилоны, чтобы не путать их номера под знаком максимума.`,
		related: ['n-ot-epsilon', 'raspredelenie-epsilon', 'arifmetika-predelov']
	},

	'raspredelenie-epsilon': {
		id: 'raspredelenie-epsilon',
		term: 'Распределение эпсилона',
		short: String.raw`Целевой ε делят между источниками ошибки: ε/2 + ε/2, ε/k, θε + (1−θ)ε.`,
		formula: String.raw`\varepsilon_x=\varepsilon_y=\frac{\varepsilon_{x+y}}{2}\ \Rightarrow\ N_{x+y}=\max\bigl(N_x(\tfrac{\varepsilon}{2}),N_y(\tfrac{\varepsilon}{2})\bigr)`,
		body: String.raw`Именованный приём: целевая точность — ресурс, который делят между источниками ошибки так, чтобы сумма долей не превысила целевого значения. Для двух слагаемых берут $\varepsilon/2$, для $k$ — $\varepsilon/k$, при разных коэффициентах усиления доли делают неравными ($\varepsilon/(2C)$ в [[predel-proizvedeniya|произведении]]). Право на подстановку даёт произвольность $\varepsilon_x$ в чужом определении, а разбивает ошибку на слагаемые [[neravenstvo-treugolnika|неравенство треугольника]].`,
		related: ['neravenstvo-treugolnika', 'predel-summy', 'n-ot-epsilon', 'indeksaciya-epsilonov']
	},

	'predel-summy': {
		id: 'predel-summy',
		term: 'Предел суммы и разности',
		short: String.raw`lim(x_n ± y_n) = A ± B с номером max(N_x(ε/2), N_y(ε/2)).`,
		formula: String.raw`N_{x\pm y}(\varepsilon)=\max\Bigl(N_x\bigl(\tfrac{\varepsilon}{2}\bigr),\ N_y\bigl(\tfrac{\varepsilon}{2}\bigr)\Bigr)`,
		body: String.raw`Теорема [[arifmetika-predelov|арифметики пределов]]: если $\lim x_n=A$ и $\lim y_n=B$, то $\lim(x_n\pm y_n)=A\pm B$ с номером $N_{x\pm y}(\varepsilon)=\max\bigl(N_x(\tfrac{\varepsilon}{2}),N_y(\tfrac{\varepsilon}{2})\bigr)$ — [[raspredelenie-epsilon|распределение эпсилона]] пополам, а максимум потому, что каждое из двух определений работает лишь со своего номера.`,
		related: ['raspredelenie-epsilon', 'neravenstvo-treugolnika', 'arifmetika-predelov', 'n-ot-epsilon']
	},

	'umnozhenie-na-konstantu': {
		id: 'umnozhenie-na-konstantu',
		term: 'Предел произведения на константу',
		short: String.raw`lim C·x_n = C·A при C ≠ 0, номер N_x(ε/|C|).`,
		formula: String.raw`\lim_{n\to\infty}Cx_n=CA,\qquad N_{cx}(\varepsilon_{cx})=N_x\Bigl(\frac{\varepsilon_{cx}}{|C|}\Bigr)`,
		body: String.raw`Свойство [[arifmetika-predelov|арифметики пределов]]: $\lim Cx_n=CA$ с [[n-ot-epsilon|номером]] $N_{cx}(\varepsilon_{cx})=N_x\bigl(\varepsilon_{cx}/|C|\bigr)$. Условие $C\ne0$ ограничивает **приём, а не факт**: при $C=0$ последовательность $Cx_n$ тождественно нулевая и её предел равен $0=C\cdot A$, но деление на $|C|$ в выводе невозможно, поэтому случай разбирается отдельно.`,
		related: ['arifmetika-predelov', 'n-ot-epsilon', 'asimptoticheskie-klassy']
	},

	'predel-proizvedeniya': {
		id: 'predel-proizvedeniya',
		term: 'Предел произведения',
		short: String.raw`lim x_n·y_n = A·B; в выводе нужна мажоранта для |x_n|.`,
		formula: String.raw`N_{xy}(\varepsilon)=\max\Bigl(N_x(1),\ N_x\bigl(\tfrac{\varepsilon}{2C}\bigr),\ N_y\bigl(\tfrac{\varepsilon}{2C}\bigr)\Bigr),\quad C=\max(|B|,|A|+1)`,
		body: String.raw`Если $\lim x_n=A$ и $\lim y_n=B$, то $\lim x_ny_n=AB$. Переменный множитель $|x_n|$ в оценке заменяется [[mazhoranta|мажорантой]] $C=\max(|B|,|A|+1)$, после чего работает обычное [[raspredelenie-epsilon|распределение эпсилона]] с долями $\varepsilon/(2C)$.`,
		related: ['mazhoranta', 'raspredelenie-epsilon', 'ogranichennaya-posledovatelnost', 'arifmetika-predelov']
	},

	'predel-chastnogo': {
		id: 'predel-chastnogo',
		term: 'Предел частного',
		short: String.raw`lim x_n/y_n = A/B при B ≠ 0; первый шаг — отделённость от нуля.`,
		formula: String.raw`\lim_{n\to\infty}\frac{x_n}{y_n}=\frac AB\quad (B\ne0)`,
		body: String.raw`При $B\ne0$ частное сходится к $A/B$; вывод опирается на [[otdelennost-ot-nulya|отделённость знаменателя от нуля]] и [[raspredelenie-epsilon|распределение эпсилона]] неравными долями. Частный случай $A=0$ читается сразу: бесконечно малая, делённая на последовательность с ненулевым пределом, остаётся бесконечно малой.`,
		related: ['otdelennost-ot-nulya', 'raspredelenie-epsilon', 'arifmetika-predelov']
	},

	mazhoranta: {
		id: 'mazhoranta',
		term: 'Мажоранта',
		short: String.raw`Число C, ограничивающее сверху все нужные модули сразу.`,
		formula: String.raw`C=\max\bigl(|B|,\ |A|+1\bigr)\ \ge 1>0`,
		body: String.raw`**Мажоранта** — постоянная, которой сверху накрывают переменные величины, чтобы в оценке остались только контролируемые множители. В [[predel-proizvedeniya|произведении]] мажорируются $|x_n|$ и $|B|$ одним числом $C=\max\bigl(|B|,|A|+1\bigr)$; модули в нём обязательны — без них при отрицательных $A$ или $B$ число перестаёт мажорировать.`,
		related: ['predel-proizvedeniya', 'ogranichennaya-posledovatelnost', 'neravenstvo-treugolnika']
	},

	'ogranichennaya-posledovatelnost': {
		id: 'ogranichennaya-posledovatelnost',
		term: 'Ограниченная последовательность',
		short: String.raw`Ограничена сверху и снизу: ∃A ∀n x_n ≤ A и ∃B ∀n x_n ≥ B.`,
		formula: String.raw`\exists A\ \forall n:\ x_n\le A;\qquad \exists B\ \forall n:\ x_n\ge B`,
		body: String.raw`Ограниченность задаётся парой условий — сверху ($\exists A\ \forall n:\ x_n\le A$) и снизу ($\exists B\ \forall n:\ x_n\ge B$), то есть у множества значений есть и $\sup$, и $\inf$. В формуле $A$ — верхняя граница, $B$ — нижняя; это другие $A$ и $B$, нежели [[predel-posledovatelnosti|пределы]] в теоремах арифметики.`,
		related: ['mazhoranta', 'predel-proizvedeniya', 'predel-posledovatelnosti']
	},

	'otdelennost-ot-nulya': {
		id: 'otdelennost-ot-nulya',
		term: 'Отделённость знаменателя от нуля',
		short: String.raw`При B ≠ 0 с некоторого номера |y_n| > |B|/2.`,
		formula: String.raw`n>N_y\Bigl(\tfrac{|B|}{2}\Bigr)\ \Longrightarrow\ |y_n|>\frac{|B|}{2}>0`,
		body: String.raw`Подстановка $\varepsilon_y=|B|/2$ в определение предела $y_n$ даёт $|y_n|\ge|B|-|y_n-B|>|B|/2$ начиная с [[n-ot-epsilon|номера]] $N_y\bigl(\tfrac{|B|}{2}\bigr)$: знаменатель [[predel-chastnogo|частного]] не только не обращается в нуль, но и ограничен снизу постоянной.`,
		related: ['predel-chastnogo', 'neravenstvo-treugolnika', 'n-ot-epsilon']
	}
};
