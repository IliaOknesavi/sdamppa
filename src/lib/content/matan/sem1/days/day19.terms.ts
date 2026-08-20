import type { Glossary } from '$lib/types';

// Термины дня 19: монотонность и теорема Вейерштрасса. Карточки supremum,
// infimum, ogranichennost-sverhu, predel-posledovatelnosti,
// aksioma-vlozhennyh-otrezkov и n-ot-epsilon продублированы из дней 5, 15 и 16
// намеренно: день должен резолвиться независимо от того, открыты ли предыдущие.
// Карточка podposledovatelnost заведена здесь, потому что термин впервые
// работает именно на этом дне (принцип выбора в разборе имён Вейерштрасса).
// Общие термины (n-nol-n-odin, blacksquare, chastichnaya-posledovatelnost,
// skhodyashchayasya-v-sebe, priznak-i-svoystvo, vykolotaya-okrestnost, …)
// здесь НЕ объявляются — на них ссылаемся [[...]].
export const day19Terms: Glossary = {
	'monotonnaya-posledovatelnost': {
		id: 'monotonnaya-posledovatelnost',
		term: 'Монотонная последовательность',
		short: String.raw`Любой из четырёх классов; условие пишется сразу для пары индексов $i>j$.`,
		formula: String.raw`\forall i>j:\ x_i>x_j\ \ \big|\ \ x_i<x_j\ \ \big|\ \ x_i\ge x_j\ \ \big|\ \ x_i\le x_j`,
		body: String.raw`Монотонность задаётся **парой индексов**: условие выписано сразу для всех $i>j$, а не для соседей $x_{n+1}$ и $x_n$. Записи эквивалентны — переход делается индукцией по разности $i-j$, — но индексная форма уже содержит транзитивность и без цепочек даёт $x_n\ge x_N$ при $n>N$, что и нужно в [[teorema-veyershtrassa|теореме Вейерштрасса]].

Монотонность — понятие **порядковое**: метрика порядка не задаёт, поэтому в произвольном метрическом пространстве её не сформулировать. Четыре класса — [[strogaya-monotonnost|строгие]] и нестрогие ([[neubyvayushchaya-posledovatelnost|неубывающая]], [[nevozrastayushchaya-posledovatelnost|невозрастающая]]).`,
		related: ['neubyvayushchaya-posledovatelnost', 'nevozrastayushchaya-posledovatelnost', 'strogaya-monotonnost', 'teorema-veyershtrassa']
	},

	'neubyvayushchaya-posledovatelnost': {
		id: 'neubyvayushchaya-posledovatelnost',
		term: 'Неубывающая последовательность',
		short: String.raw`$\forall i>j:\ x_i\ge x_j$ — рабочий класс теоремы Вейерштрасса.`,
		formula: String.raw`\forall i>j:\ x_i\ge x_j`,
		body: String.raw`Нестрогий [[monotonnaya-posledovatelnost|класс монотонности]]: каждый следующий член не меньше любого предыдущего. Именно для него формулируется [[teorema-veyershtrassa|теорема Вейерштрасса]], и требовать полной ограниченности не нужно — снизу такая последовательность ограничена сама собой ($x_n\ge x_1$), достаточно [[ogranichennost-sverhu|ограниченности сверху]].

Предел неубывающей ограниченной равен её [[supremum|супремуму]]. Типичные представители: частичные суммы ряда с неотрицательными членами и $\bigl(1+\frac1n\bigr)^n$.`,
		related: ['monotonnaya-posledovatelnost', 'teorema-veyershtrassa', 'supremum', 'ogranichennost-sverhu']
	},

	'nevozrastayushchaya-posledovatelnost': {
		id: 'nevozrastayushchaya-posledovatelnost',
		term: 'Невозрастающая последовательность',
		short: String.raw`$\forall i>j:\ x_i\le x_j$; предел равен инфимуму.`,
		formula: String.raw`\forall i>j:\ x_i\le x_j`,
		body: String.raw`Зеркальный к [[neubyvayushchaya-posledovatelnost|неубывающей]] класс. Ограниченная снизу невозрастающая последовательность сходится, и её предел равен [[infimum|инфимуму]]: $\lim x_n=\inf x_n$, $N(\varepsilon)=\min\{n:\ x_n<s+\varepsilon\}$.

Отдельного доказательства случай не требует: замена $x_n\mapsto-x_n$ переводит невозрастающую в неубывающую, а инфимум — в супремум со знаком минус. В таком виде класс работает в правых концах системы вложенных отрезков ([[aksioma-vlozhennyh-otrezkov|аксиома Кантора]]).`,
		related: ['monotonnaya-posledovatelnost', 'neubyvayushchaya-posledovatelnost', 'infimum', 'aksioma-vlozhennyh-otrezkov']
	},

	'strogaya-monotonnost': {
		id: 'strogaya-monotonnost',
		term: 'Строгая монотонность',
		short: String.raw`Возрастающая ($x_i>x_j$) и убывающая ($x_i<x_j$) — со строгим знаком.`,
		formula: String.raw`\forall i>j:\ x_i>x_j\quad\text{(возрастающая)},\qquad \forall i>j:\ x_i<x_j\quad\text{(убывающая)}`,
		body: String.raw`Возрастание или убывание со строгим знаком: $x_i>x_j$ либо $x_i<x_j$ при $i>j$. Строгие классы вложены в нестрогие, и зазор непустой: постоянная последовательность не убывает и не возрастает.`,
		related: ['posledovatelnost', 'monotonnost-i-proizvodnaya']
	},

	'teorema-veyershtrassa': {
		id: 'teorema-veyershtrassa',
		term: 'Теорема Вейерштрасса о монотонной ограниченной',
		short: String.raw`Монотонная ограниченная последовательность сходится; предел равен sup (или inf).`,
		formula: String.raw`x_n\ \text{неубывает и ограничена сверху}\ \Rightarrow\ \exists\lim_{n\to\infty}x_n=\sup_n x_n`,
		body: String.raw`Монотонная ограниченная [[posledovatelnost|последовательность]] сходится, причём её предел равен [[supremum|супремуму]] (для неубывающей) или инфимуму (для невозрастающей). Ценность утверждения — существование предела без его вычисления.`,
		related: ['posledovatelnost', 'supremum', 'predel-posledovatelnosti']
	},

	'sushchestvovanie-predela': {
		id: 'sushchestvovanie-predela',
		term: 'Существование предела без вычисления',
		short: String.raw`Теорема отвечает «предел есть», не называя его значения.`,
		formula: String.raw`\exists\lim_{n\to\infty} x_n\quad\text{без указания}\ A`,
		body: String.raw`Обычная схема: угадать $A$, подставить в определение, выписать [[n-ot-epsilon|$N(\varepsilon)$]]. [[teorema-veyershtrassa|Теорема Вейерштрасса]] переворачивает порядок: две проверки — монотонность и ограниченность — дают существование, а значение остаётся неизвестным (оно равно [[supremum|супремуму]], который сам может быть не вычислен).

Так и появляются новые числа: $e=\lim\bigl(1+\frac1n\bigr)^n$ существует, потому что последовательность возрастает и меньше $3$; сумма $\sum\frac1{k^2}$ существует, потому что частичные суммы растут и меньше $2$, а равенство $\frac{\pi^2}6$ доказано полутора веками позже.`,
		related: ['teorema-veyershtrassa', 'supremum', 'n-ot-epsilon', 'polnota-r']
	},

	podposledovatelnost: {
		id: 'podposledovatelnost',
		term: 'Подпоследовательность',
		short: String.raw`Выборка членов по строго возрастающим номерам $n_1<n_2<\dots$`,
		formula: String.raw`n_1<n_2<\dots,\qquad k\mapsto x_{n_k},\qquad n_k\ge k`,
		body: String.raw`Выборка членов [[posledovatelnost|последовательности]] по строго возрастающим номерам. Из строгого возрастания следует $n_k\ge k$: номера уходят в бесконечность. Если последовательность сходится, всякая её подпоследовательность сходится к тому же пределу.`,
		related: ['posledovatelnost', 'predel-posledovatelnosti']
	},

	'epsilon-forma-supremuma': {
		id: 'epsilon-forma-supremuma',
		term: 'ε-форма супремума',
		short: String.raw`$\forall\varepsilon>0\ \exists N:\ x_N>S-\varepsilon$ — рабочая форма условия 2.`,
		formula: String.raw`\forall\varepsilon>0\ \ \exists N\in\mathbb N_1:\ \ x_N>S-\varepsilon`,
		body: String.raw`Условие минимальности [[supremum|супремума]], переписанное через порог: если бы при некотором $\varepsilon>0$ ни один член не превзошёл $S-\varepsilon$, то $S-\varepsilon$ была бы верхней гранью, меньшей $S$. Равносильная запись — $\forall\hat S<S\ \exists n:\ x_n>\hat S$; достаточно положить $\hat S=S-\varepsilon$.

Именно этот шаг поставляет [[n-ot-epsilon|номер по порогу]] и потому является единственным содержательным местом доказательства [[teorema-veyershtrassa|теоремы Вейерштрасса]]. Зеркальная форма для [[infimum|инфимума]]: $\exists N:\ x_N<s+\varepsilon$.`,
		related: ['supremum', 'infimum', 'teorema-veyershtrassa', 'n-ot-epsilon']
	},

};
