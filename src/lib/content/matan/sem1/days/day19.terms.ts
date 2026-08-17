import type { Glossary } from '$lib/types';

// Термины дня 19 (КЛК1 §13 / КЛК2 §2, конспект «Пределы», стр. 34–35):
// монотонность и теорема Вейерштрасса. Карточки supremum, infimum,
// ogranichennost-sverhu, predel-posledovatelnosti, aksioma-vlozhennyh-otrezkov
// и n-ot-epsilon продублированы из дней 5, 15 и 16 намеренно: день должен
// резолвиться независимо от того, открыты ли предыдущие.
// Термины канонического глоссария курса (n-nol-n-odin, blacksquare,
// chastichnaya-posledovatelnost, skhodyashchayasya-v-sebe, priznak-i-svoystvo,
// vykolotaya-okrestnost, …) здесь НЕ объявляются — на них ссылаемся [[...]].
export const day19Terms: Glossary = {
	'monotonnaya-posledovatelnost': {
		id: 'monotonnaya-posledovatelnost',
		term: 'Монотонная последовательность',
		short: String.raw`Любой из четырёх классов; условие пишется сразу для пары индексов $i>j$.`,
		formula: String.raw`\forall i>j:\ x_i>x_j\ \ \big|\ \ x_i<x_j\ \ \big|\ \ x_i\ge x_j\ \ \big|\ \ x_i\le x_j`,
		body: String.raw`Курс задаёт монотонность **парой индексов**: условие выписано сразу для всех $i>j$, а не для соседей $x_{n+1}$ и $x_n$ (стр. 34). Записи эквивалентны — переход делается индукцией по разности $i-j$, — но индексная форма уже содержит транзитивность и без цепочек даёт $x_n\ge x_N$ при $n>N$, что и нужно в [[teorema-veyershtrassa|теореме Вейерштрасса]].

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
		body: String.raw`Строгие классы вложены в нестрогие: возрастающая заведомо [[neubyvayushchaya-posledovatelnost|неубывающая]], убывающая — [[nevozrastayushchaya-posledovatelnost|невозрастающая]]. Обратное неверно, и зазор непустой: стационарная $x_n\equiv5$ и не убывает, и не возрастает.

В [[teorema-veyershtrassa|теореме Вейерштрасса]] строгость не нужна и даже мешает: у последовательности с постоянным хвостом супремум достигается, а именно этот случай выпадает, если принять всерьёз описку конспекта $x_n<S$ вместо $x_n\le S$.`,
		related: ['monotonnaya-posledovatelnost', 'neubyvayushchaya-posledovatelnost', 'teorema-veyershtrassa', 'supremum']
	},

	'teorema-veyershtrassa': {
		id: 'teorema-veyershtrassa',
		term: 'Теорема Вейерштрасса о монотонной ограниченной',
		short: String.raw`Монотонная ограниченная последовательность сходится; предел равен sup (или inf).`,
		formula: String.raw`x_n\ \text{неубывает и ограничена сверху}\ \Rightarrow\ \exists\lim_{n\to\infty}x_n=\sup_n x_n`,
		body: String.raw`Доказательство целиком: берём $S=\sup x_n$, по [[epsilon-forma-supremuma|$\varepsilon$-форме]] находим $N$ с $x_N>S-\varepsilon$, монотонность растягивает неравенство на весь хвост — $S-\varepsilon<x_N\le x_n\le S$, то есть $|x_n-S|<\varepsilon$; [[n-ot-epsilon|номер]] $N(\varepsilon)=\min\{n:\ x_n>S-\varepsilon\}$. ⚠️ В конспекте (стр. 35) выписаны только три свойства супремума, финального выбора $N$ нет.

Ценность — [[sushchestvovanie-predela|существование без вычисления]]. Утверждение равносильно [[polnota-r|полноте $\mathbb R$]]. ⚠️ «Теоремой Вейерштрасса» в литературе чаще зовут Больцано–Вейерштрасса или теорему о непрерывной функции на компакте.`,
		related: ['neubyvayushchaya-posledovatelnost', 'epsilon-forma-supremuma', 'sushchestvovanie-predela', 'polnota-r']
	},

	'sushchestvovanie-predela': {
		id: 'sushchestvovanie-predela',
		term: 'Существование предела без вычисления',
		short: String.raw`Теорема отвечает «предел есть», не называя его значения.`,
		formula: String.raw`\exists\lim_{n\to\infty}x_n\quad\text{без указания}\ A`,
		body: String.raw`Обычная схема курса: угадать $A$, подставить в определение, выписать [[n-ot-epsilon|$N(\varepsilon)$]]. [[teorema-veyershtrassa|Теорема Вейерштрасса]] переворачивает порядок: две проверки — монотонность и ограниченность — дают существование, а значение остаётся неизвестным (оно равно [[supremum|супремуму]], который сам может быть не вычислен).

Так и появляются новые числа: $e=\lim\bigl(1+\frac1n\bigr)^n$ существует, потому что последовательность возрастает и меньше $3$; сумма $\sum\frac1{k^2}$ существует, потому что частичные суммы растут и меньше $2$, а равенство $\frac{\pi^2}6$ доказано полутора веками позже.`,
		related: ['teorema-veyershtrassa', 'supremum', 'n-ot-epsilon', 'polnota-r']
	},

	supremum: {
		id: 'supremum',
		term: 'Супремум (точная верхняя грань)',
		short: String.raw`Наименьшая из верхних граней; проверяется двумя условиями.`,
		formula: String.raw`1)\ \forall n:\ x_n\le S;\qquad 2)\ \forall y:\ (\forall n:\ x_n\le y)\Rightarrow S\le y`,
		body: String.raw`**Супремум** — наименьшая верхняя грань; курс определяет его сразу для последовательности $x_n\subset\mathbb R$ через два условия (день 15). Рабочая запись второго — [[epsilon-forma-supremuma|$\varepsilon$-форма]].

Само существование $\sup$ у [[ogranichennost-sverhu|ограниченной сверху]] последовательности — не тривиальность, а [[polnota-r|полнота $\mathbb R$]]: в $\mathbb Q$ ограниченное множество наименьшей рациональной верхней грани иметь не обязано. Супремум может не достигаться ($\sup\{-\frac1n\}=0$, а $\max$ пуст) — и именно он оказывается пределом монотонной последовательности.`,
		related: ['epsilon-forma-supremuma', 'infimum', 'ogranichennost-sverhu', 'teorema-veyershtrassa']
	},

	'epsilon-forma-supremuma': {
		id: 'epsilon-forma-supremuma',
		term: 'ε-форма супремума',
		short: String.raw`$\forall\varepsilon>0\ \exists N:\ x_N>S-\varepsilon$ — рабочая форма условия 2.`,
		formula: String.raw`\forall\varepsilon>0\ \ \exists N\in\mathbb N_1:\ \ x_N>S-\varepsilon`,
		body: String.raw`Условие минимальности [[supremum|супремума]], переписанное через порог: если бы при некотором $\varepsilon>0$ ни один член не превзошёл $S-\varepsilon$, то $S-\varepsilon$ была бы верхней гранью, меньшей $S$. В конспекте это третье свойство супремума ($\forall\hat S<S\ \exists n:\ x_n>\hat S$), достаточно положить $\hat S=S-\varepsilon$.

Именно этот шаг поставляет [[n-ot-epsilon|номер по порогу]] и потому является единственным содержательным местом доказательства [[teorema-veyershtrassa|теоремы Вейерштрасса]]. Зеркальная форма для [[infimum|инфимума]]: $\exists N:\ x_N<s+\varepsilon$.`,
		related: ['supremum', 'infimum', 'teorema-veyershtrassa', 'n-ot-epsilon']
	},

	infimum: {
		id: 'infimum',
		term: 'Инфимум (точная нижняя грань)',
		short: String.raw`Наибольшая из нижних граней; условия зеркальны супремуму.`,
		formula: String.raw`1)\ \forall n:\ x_n\ge s;\qquad 2)\ \forall y:\ (\forall n:\ x_n\ge y)\Rightarrow s\ge y`,
		body: String.raw`**Инфимум** — наибольшая нижняя грань последовательности (день 15). $\varepsilon$-форма второго условия: $\forall\varepsilon>0\ \exists N:\ x_N<s+\varepsilon$ — именно она даёт номер в доказательстве для [[nevozrastayushchaya-posledovatelnost|невозрастающей]] последовательности.

Как и [[supremum|супремум]], инфимум может не достигаться: $\inf\{-\frac1n\}=-1$ достигается, а $\inf\{\frac1n\}=0$ — нет. Предел невозрастающей ограниченной снизу последовательности равен именно инфимуму.`,
		related: ['supremum', 'epsilon-forma-supremuma', 'nevozrastayushchaya-posledovatelnost', 'teorema-veyershtrassa']
	},

	'ogranichennost-sverhu': {
		id: 'ogranichennost-sverhu',
		term: 'Ограниченность сверху',
		short: String.raw`$\exists A\ \forall n:\ x_n\le A$ — второе условие теоремы дня.`,
		formula: String.raw`\exists A\ \forall n:\ x_n\le A\qquad(\text{снизу}:\ \exists B\ \forall n:\ x_n\ge B)`,
		body: String.raw`Ограниченность сверху и снизу определяются раздельно (стр. 17, день 15). Для [[neubyvayushchaya-posledovatelnost|неубывающей]] последовательности достаточно верхней границы: снизу её держит собственный первый член, поэтому в [[teorema-veyershtrassa|теореме Вейерштрасса]] проверять надо ровно одно неравенство.

Ограниченность сверху равносильна существованию [[supremum|супремума]] — но обратный переход опирается на [[polnota-r|полноту $\mathbb R$]]. Отрицание ограниченности участвует в определении бесконечно большой последовательности (день 16).`,
		related: ['neubyvayushchaya-posledovatelnost', 'supremum', 'teorema-veyershtrassa', 'polnota-r']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`$\forall\varepsilon>0\ \exists N\ \forall n>N:\ |x_n-A|<\varepsilon$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1\ \forall n>N:\ |x_n-A|<\varepsilon`,
		body: String.raw`Курс даёт определение сразу в пяти эквивалентных формах — через метрику $\rho$, норму, открытый шар, [[vykolotaya-okrestnost|выколотую окрестность]] и лишь последней рабочую запись с модулем (день 11). Все они не требуют порядка и потому живут в любом метрическом пространстве, в отличие от [[monotonnaya-posledovatelnost|монотонности]].

Требование к оформлению: [[blacksquare|доказательство закончено]] только тогда, когда выписана явная формула [[n-ot-epsilon|$N(\varepsilon)$]]. В теореме дня она берётся из [[epsilon-forma-supremuma|$\varepsilon$-формы супремума]].`,
		related: ['n-ot-epsilon', 'monotonnaya-posledovatelnost', 'teorema-veyershtrassa', 'epsilon-forma-supremuma']
	},

	'n-ot-epsilon': {
		id: 'n-ot-epsilon',
		term: 'N(ε) — номер как функция порога',
		short: String.raw`Итог доказательства — формула для номера, а не фраза «предел есть».`,
		formula: String.raw`N(\varepsilon)=\min\{\,n\in\mathbb N_1:\ x_n>S-\varepsilon\,\}`,
		body: String.raw`Сквозной приём курса: $N$ трактуется как **функция** от $\varepsilon$, а сам $\varepsilon$ — как ресурс. В теореме дня номер не вычисляется, а **выбирается**: [[epsilon-forma-supremuma|$\varepsilon$-форма]] гарантирует непустоту множества $\{n:\ x_n>S-\varepsilon\}$, а наименьший элемент у непустого подмножества [[n-nol-n-odin|$\mathbb N_1$]] есть всегда.

Отсюда важная оговорка: формула существует, но ничего не говорит о скорости — $N(\varepsilon)$ определён супремумом и может расти как угодно. Для $-\frac1n$ он равен $\lceil\frac1\varepsilon\rceil$, для $-\frac{\ln n}{n}$ явную оценку приходится добывать отдельно.`,
		related: ['epsilon-forma-supremuma', 'predel-posledovatelnosti', 'teorema-veyershtrassa', 'sushchestvovanie-predela']
	},

	'aksioma-vlozhennyh-otrezkov': {
		id: 'aksioma-vlozhennyh-otrezkov',
		term: 'Аксиома о вложенных отрезках',
		short: String.raw`Пересечение вложенных отрезков непусто — так в курсе задана полнота $\mathbb R$.`,
		formula: String.raw`[a_{k+1};b_{k+1}]\subset[a_k;b_k]\ \Rightarrow\ \bigcap_k[a_k;b_k]\ne\varnothing`,
		body: String.raw`Аксиома Кантора из аксиоматики $\mathbb R$ (день 5). Из неё половинным делением строится [[supremum|супремум]], на котором стоит [[teorema-veyershtrassa|теорема Вейерштрасса]]; обратно, из теоремы аксиома выводится в четыре строки — концы $a_k$ [[neubyvayushchaya-posledovatelnost|не убывают]], $b_k$ [[nevozrastayushchaya-posledovatelnost|не возрастают]], оба предела существуют и $a\le b$.

Круг замыкается, поэтому обе формулировки — одно и то же свойство, [[polnota-r|полнота $\mathbb R$]]. Для стягивания отрезков в точку нужна ещё аксиома Архимеда.`,
		related: ['polnota-r', 'teorema-veyershtrassa', 'supremum', 'nevozrastayushchaya-posledovatelnost']
	},

	'polnota-r': {
		id: 'polnota-r',
		term: 'Полнота ℝ',
		short: String.raw`Кантор, существование sup и Вейерштрасс — три записи одного свойства.`,
		formula: String.raw`\text{вложенные отрезки}\Rightarrow\exists\sup\Rightarrow\text{Вейерштрасс}\Rightarrow\text{вложенные отрезки}`,
		body: String.raw`Свойство, отличающее $\mathbb R$ от $\mathbb Q$. В курсе оно постулируется [[aksioma-vlozhennyh-otrezkov|аксиомой о вложенных отрезках]], из неё получается существование [[supremum|супремума]], а из супремума — [[teorema-veyershtrassa|теорема Вейерштрасса]], замыкающая круг обратно.

В $\mathbb Q$ ломаются все три сразу: десятичные обрезания $\sqrt2$ монотонны и ограничены, но предела в $\mathbb Q$ у них нет. ⚠️ Не путать с полнотой метрического пространства (день 21) — та формулируется через [[skhodyashchayasya-v-sebe|сходимость в себе]], обходится без порядка и потому применима всюду.`,
		related: ['aksioma-vlozhennyh-otrezkov', 'teorema-veyershtrassa', 'supremum', 'sushchestvovanie-predela']
	}
};
