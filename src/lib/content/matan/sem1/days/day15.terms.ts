import type { Glossary } from '$lib/types';

// Термины дня 15 (ch15): порядок, точные грани, ограниченность. Часть карточек —
// намеренные дубли из прошлых дней (последовательность и предел — день 11,
// аксиомы Архимеда и о вложенных отрезках — день 5): день должен резолвиться
// независимо. Термины канонического глоссария (n-nol-n-odin, blacksquare,
// asimptoticheskie-klassy, chastichnaya-posledovatelnost, …) здесь НЕ
// объявляются — на них ссылаемся через [[...]].
export const day15Terms: Glossary = {
	'naibolshiy-element': {
		id: 'naibolshiy-element',
		term: 'Наибольший элемент (max X)',
		short: String.raw`Множество элементов, больше которых в $X$ ничего нет.`,
		formula: String.raw`\max X=\{\xi\in X\mid \nexists x\in X:\ \xi<x\}`,
		body: String.raw`Наибольший элемент определяется **через отрицание существования** и как **множество**: $\max X=\{\xi\in X\mid\nexists x\in X:\ \xi<x\}$; привычная форма «$b\ge x$ для всех $x\in X$» даётся второй. Выигрыш записи: $\max X$ бывает пустым ($\max(0;1)=\varnothing$), и это законное значение, а не оговорка; в $\mathbb R$ непустой $\max X$ одноэлементен, в частичном порядке несравнимых максимумов бывает много. Наибольший элемент всегда является [[supremum|супремумом]], обратное неверно — см. [[nedostizhimyy-supremum|недостижимый супремум]].`,
		related: ['naimenshiy-element', 'supremum', 'nedostizhimyy-supremum', 'verhnyaya-gran']
	},

	'naimenshiy-element': {
		id: 'naimenshiy-element',
		term: 'Наименьший элемент (min X)',
		short: String.raw`Множество элементов, меньше которых в $X$ ничего нет.`,
		formula: String.raw`\min X=\{\mu\in X\mid \nexists x\in X:\ \mu>x\}`,
		body: String.raw`Зеркальное к [[naibolshiy-element|максимуму]] определение: $\min X=\{\mu\in X\mid\nexists x\in X:\ \mu>x\}$, привычная форма — $\forall x\in X:\ b\le x$. Как и максимум, это множество: у $(0;1)$ наименьшего элемента нет, $\min(0;1)=\varnothing$. Непустой $\min X$ всегда является [[infimum|инфимумом]].`,
		related: ['naibolshiy-element', 'infimum', 'verhnyaya-gran']
	},

	'verhnyaya-gran': {
		id: 'verhnyaya-gran',
		term: 'Верхняя и нижняя грань',
		short: String.raw`Элемент объемлющего множества, не меньший (не больший) всех элементов $Y$.`,
		formula: String.raw`Y\subset X,\ x\in X:\quad \forall y\in Y:\ x\ge y`,
		body: String.raw`Пусть $Y\subset X$. Элемент $x\in X$ — **верхняя грань** $Y$, если $\forall y\in Y:\ x\ge y$, и **нижняя грань**, если $\forall y\in Y:\ x\le y$. Два отличия от [[naibolshiy-element|наибольшего элемента]]: грань берётся из объемлющего $X$ и **не обязана лежать в $Y$**; грань не единственна — множество верхних граней либо пусто, либо целый луч (для $(0;1)$ это $[1;+\infty)$). Наименьшая из верхних граней называется точной верхней гранью, или [[supremum|супремумом]], наибольшая из нижних — [[infimum|инфимумом]].`,
		related: ['supremum', 'infimum', 'naibolshiy-element', 'ogranichennost-sverhu']
	},

	infimum: {
		id: 'infimum',
		term: 'Инфимум (точная нижняя грань)',
		short: String.raw`Наибольшая из нижних граней; два условия зеркальны супремуму.`,
		formula: String.raw`1)\ \forall n:\ x_n\ge s;\qquad 2)\ \forall y:\ (\forall n:\ x_n\ge y)\Rightarrow s\ge y`,
		body: String.raw`**Инфимум** — наибольшая нижняя [[verhnyaya-gran|грань]]: 1) $s$ — нижняя грань последовательности; 2) любая другая нижняя грань не превосходит $s$. $\varepsilon$-форма второго условия: $\forall\varepsilon>0\ \exists n:\ x_n<s+\varepsilon$. Как и [[supremum|супремум]], инфимум может не достигаться: у $\frac1n$ инфимум равен нулю, но $\min\{\frac1n\}=\varnothing$; существование обеспечивается [[ogranichennost-snizu|ограниченностью снизу]] плюс полнотой $\mathbb R$.`,
		related: ['supremum', 'verhnyaya-gran', 'ogranichennost-snizu', 'naimenshiy-element']
	},

	'ogranichennost-sverhu': {
		id: 'ogranichennost-sverhu',
		term: 'Ограниченность сверху',
		short: String.raw`Существует число, которое не меньше всех членов последовательности.`,
		formula: String.raw`\exists A\ \forall n:\ f_n\le A`,
		body: String.raw`Последовательность **ограничена сверху**, если $\exists A\ \forall n:\ f_n\le A$, то есть у множества её значений есть [[verhnyaya-gran|верхняя грань]]. Это равносильно существованию [[supremum|супремума]] — но обратный переход опирается на полноту $\mathbb R$. Пример неограниченной сверху последовательности: $f_n=n$; предположение $\exists\sup f_n$ противоречит [[aksioma-arhimeda|аксиоме Архимеда]].`,
		related: ['ogranichennost-snizu', 'ogranichennaya-posledovatelnost', 'supremum', 'aksioma-arhimeda']
	},

	'ogranichennost-snizu': {
		id: 'ogranichennost-snizu',
		term: 'Ограниченность снизу',
		short: String.raw`Существует число, которое не больше всех членов последовательности.`,
		formula: String.raw`\exists B\ \forall n:\ f_n\ge B`,
		body: String.raw`Последовательность **ограничена снизу**, если $\exists B\ \forall n:\ f_n\ge B$, то есть у множества её значений есть нижняя [[verhnyaya-gran|грань]]. Равносильно существованию [[infimum|инфимума]] — с той же оговоркой про полноту $\mathbb R$. Отрицание получается перестановкой кванторов: последовательность не ограничена снизу, если $\forall B\ \exists n:\ f_n<B$.`,
		related: ['ogranichennost-sverhu', 'ogranichennaya-posledovatelnost', 'infimum']
	},

	'nedostizhimyy-supremum': {
		id: 'nedostizhimyy-supremum',
		term: 'Недостижимый супремум',
		short: String.raw`Точная грань есть, а наибольшего элемента нет: $\sup\sin n=1$.`,
		formula: String.raw`\sup_{n\in\mathbb N_1}\sin n=1,\qquad \max\{\sin n\}=\varnothing`,
		body: String.raw`[[supremum|Супремум]] не обязан быть членом последовательности — в этом и состоит разница между $\max$ и $\sup$ (а также между $\min$ и $\inf$). Эталонный пример — $\sin n$ на натуральных: равенство $\sin n=1$ означало бы $2n=\pi(4k+1)$, что невозможно (слева целое, справа иррациональное), поэтому [[naibolshiy-element|наибольшего элемента]] нет, $\max\{\sin n\}=\varnothing$; при этом для любого $A<1$ найдётся $n$ с $\sin n>A$ — по [[plotnost-drobnyh-chastey|плотности дробных частей]], — то есть условие 2') выполнено и $\sup=1$.`,
		related: ['supremum', 'naibolshiy-element', 'plotnost-drobnyh-chastey']
	},

	'plotnost-drobnyh-chastey': {
		id: 'plotnost-drobnyh-chastey',
		term: 'Плотность дробных частей',
		short: String.raw`При иррациональном $a$ числа $\{ka+b\}$ подходят к нулю сколь угодно близко.`,
		formula: String.raw`a\in\mathbb I:\quad \forall\varepsilon>0\ \exists k:\ \{ka+b\}<\varepsilon`,
		body: String.raw`Если $a$ иррационально, то дробные части $\{ka+b\}=(ka+b)-\lfloor ka+b\rfloor$ подходят к нулю сколь угодно близко (плотность орбиты иррационального поворота окружности). Порядок кванторов существенен: требуется $\forall\varepsilon>0\ \exists k$, а не $\exists k\ \forall\varepsilon>0$ — один номер $k$ не обслужит все $\varepsilon$ сразу. Отсюда [[nedostizhimyy-supremum|недостижимый супремум]] у $\sin n$: [[supremum|супремум]] равен единице, а наибольшего элемента нет.`,
		related: ['nedostizhimyy-supremum', 'supremum']
	},

	'aksioma-vlozhennyh-otrezkov': {
		id: 'aksioma-vlozhennyh-otrezkov',
		term: 'Аксиома о вложенных отрезках',
		short: String.raw`Пересечение вложенных отрезков непусто — так задана полнота $\mathbb R$.`,
		formula: String.raw`[a_{k+1};b_{k+1}]\subset[a_k;b_k]\ \Rightarrow\ \bigcap_{k}[a_k;b_k]\ne\varnothing`,
		body: String.raw`Аксиома Кантора из аксиоматики $\mathbb R$ ([день 5](/aii/matan/1/day/5)): всякая система вложенных отрезков имеет непустое пересечение. Именно она играет роль **аксиомы полноты**: принцип верхней грани — существование [[supremum|супремума]] у [[ogranichennost-sverhu|ограниченной сверху]] последовательности — из неё выводится, а не постулируется отдельно.`,
		related: ['supremum', 'aksioma-arhimeda', 'ogranichennost-sverhu']
	},

};
