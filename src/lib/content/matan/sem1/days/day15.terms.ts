import type { Glossary } from '$lib/types';

// Термины дня 15 (КЛК1 §12, конспект «Пределы», стр. 14–17): порядок, точные
// грани, ограниченность. Часть карточек — намеренные дубли из прошлых дней
// (последовательность и предел — день 11, аксиомы Архимеда и о вложенных
// отрезках — день 5): день должен резолвиться независимо.
// Термины канонического глоссария курса (n-nol-n-odin, blacksquare,
// asimptoticheskie-klassy, chastichnaya-posledovatelnost, …) здесь НЕ
// объявляются — на них ссылаемся через [[...]].
export const day15Terms: Glossary = {
	posledovatelnost: {
		id: 'posledovatelnost',
		term: 'Последовательность',
		short: String.raw`Функция $f:\mathbb N_1\to\mathbb R$, а не «набор чисел».`,
		formula: String.raw`f:\ \mathbb N_1\to\mathbb R`,
		body: String.raw`В курсе последовательность — это **функция** с областью определения [[n-nol-n-odin|$\mathbb N_1$]], а не набор и не список: $f:\mathbb N_1\to\mathbb R$. Если значения берутся в метрическом пространстве $M$, преподаватель называет $f:\mathbb N_1\to M$ «обобщённой последовательностью» (⚠️ в общей топологии так называют сеть — другое понятие).

Запись $f_n$ и $x_n$ используется наравне с $f(n)$. Для последовательности определяются [[predel-posledovatelnosti|предел]] и [[ogranichennaya-posledovatelnost|ограниченность]].`,
		related: ['n-nol-n-odin', 'predel-posledovatelnosti', 'ogranichennaya-posledovatelnost']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`$\forall\varepsilon>0\ \exists N\ \forall n>N:\ |f_n-A|<\varepsilon$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1\ \forall n>N:\ |f_n-A|<\varepsilon`,
		body: String.raw`Курс даёт определение сразу в пяти эквивалентных формах — через метрику $\rho$, через норму, через открытый шар $B_A(\varepsilon)$, через [[vykolotaya-okrestnost|выколотую окрестность]] $\mathring U_A$ и лишь последней «рабочую» вещественную запись с модулем.

Ключевое соглашение: $N$ трактуется как **функция от $\varepsilon$**, и [[blacksquare|доказательство считается законченным]] только тогда, когда выписана явная формула $N(\varepsilon)$. Из существования предела следует [[ogranichennaya-posledovatelnost|ограниченность]] — это теорема дня 15.`,
		related: ['posledovatelnost', 'vykolotaya-okrestnost', 'blacksquare', 'ogranichennaya-posledovatelnost']
	},

	'naibolshiy-element': {
		id: 'naibolshiy-element',
		term: 'Наибольший элемент (max X)',
		short: String.raw`Множество элементов, больше которых в $X$ ничего нет.`,
		formula: String.raw`\max X=\{\xi\in X\mid \nexists x\in X:\ \xi<x\}`,
		body: String.raw`Курс определяет наибольший элемент **через отрицание существования** и как **множество**: $\max X=\{\xi\in X\mid\nexists x\in X:\ \xi<x\}$; привычная форма «$b\ge x$ для всех $x\in X$» даётся второй. В КЛК1 §12 так и записано: «множество максимумов».

Выигрыш записи: $\max X$ бывает пустым ($\max(0;1)=\varnothing$), и это законное значение, а не оговорка. В $\mathbb R$ непустой $\max X$ одноэлементен, в частичном порядке несравнимых максимумов бывает много. Наибольший элемент всегда является [[supremum|супремумом]], обратное неверно — см. [[nedostizhimyy-supremum|недостижимый супремум]].`,
		related: ['naimenshiy-element', 'supremum', 'nedostizhimyy-supremum', 'verhnyaya-gran']
	},

	'naimenshiy-element': {
		id: 'naimenshiy-element',
		term: 'Наименьший элемент (min X)',
		short: String.raw`Множество элементов, меньше которых в $X$ ничего нет.`,
		formula: String.raw`\min X=\{\mu\in X\mid \nexists x\in X:\ \mu>x\}`,
		body: String.raw`Зеркальное к [[naibolshiy-element|максимуму]] определение: $\min X=\{\mu\in X\mid\nexists x\in X:\ \mu>x\}$, привычная форма — $\forall x\in X:\ b\le x$.

Как и максимум, это множество: у $(0;1)$ наименьшего элемента нет, $\min(0;1)=\varnothing$. Непустой $\min X$ автоматически даёт [[infimum|инфимум]]: любая нижняя грань не превосходит наименьшего элемента, значит он и есть наибольшая из нижних граней.`,
		related: ['naibolshiy-element', 'infimum', 'verhnyaya-gran']
	},

	'verhnyaya-gran': {
		id: 'verhnyaya-gran',
		term: 'Верхняя и нижняя грань',
		short: String.raw`Элемент объемлющего множества, не меньший (не больший) всех элементов $Y$.`,
		formula: String.raw`Y\subset X,\ x\in X:\quad \forall y\in Y:\ x\ge y`,
		body: String.raw`Пусть $Y\subset X$. Элемент $x\in X$ — **верхняя грань** $Y$, если $\forall y\in Y:\ x\ge y$, и **нижняя грань**, если $\forall y\in Y:\ x\le y$.

Два отличия от [[naibolshiy-element|наибольшего элемента]]: грань берётся из объемлющего $X$ и **не обязана лежать в $Y$**; грань не единственна — множество верхних граней либо пусто, либо целый луч (для $(0;1)$ это $[1;+\infty)$). Наименьшая из верхних граней называется точной верхней гранью, или [[supremum|супремумом]], наибольшая из нижних — [[infimum|инфимумом]].`,
		related: ['supremum', 'infimum', 'naibolshiy-element', 'ogranichennost-sverhu']
	},

	supremum: {
		id: 'supremum',
		term: 'Супремум (точная верхняя грань)',
		short: String.raw`Наименьшая из верхних граней; проверяется двумя условиями.`,
		formula: String.raw`1)\ \forall n:\ x_n\le S;\qquad 2)\ \forall y:\ (\forall n:\ x_n\le y)\Rightarrow S\le y`,
		body: String.raw`**Супремум** — наименьшая [[verhnyaya-gran|верхняя грань]]. Курс определяет его сразу для последовательности $x_n\subset\mathbb R$ через два условия: 1) $S$ — верхняя грань; 2) любая другая верхняя грань не меньше $S$.

Рабочая форма второго условия — **$\varepsilon$-форма**: $\forall\varepsilon>0\ \exists n:\ x_n>S-\varepsilon$. Существование супремума у [[ogranichennost-sverhu|ограниченной сверху]] последовательности — не тривиальность, а полнота $\mathbb R$, которую в курсе несёт [[aksioma-vlozhennyh-otrezkov|аксиома о вложенных отрезках]].`,
		related: ['verhnyaya-gran', 'infimum', 'nedostizhimyy-supremum', 'aksioma-vlozhennyh-otrezkov']
	},

	infimum: {
		id: 'infimum',
		term: 'Инфимум (точная нижняя грань)',
		short: String.raw`Наибольшая из нижних граней; два условия зеркальны супремуму.`,
		formula: String.raw`1)\ \forall n:\ x_n\ge s;\qquad 2)\ \forall y:\ (\forall n:\ x_n\ge y)\Rightarrow s\ge y`,
		body: String.raw`**Инфимум** — наибольшая нижняя [[verhnyaya-gran|грань]]: 1) $s$ — нижняя грань последовательности; 2) любая другая нижняя грань не превосходит $s$. $\varepsilon$-форма второго условия: $\forall\varepsilon>0\ \exists n:\ x_n<s+\varepsilon$.

Как и [[supremum|супремум]], инфимум может не достигаться: у $-\frac1n$ инфимум равен нулю, но $\min\{-\frac1n\}=\varnothing$. Существование обеспечивается [[ogranichennost-snizu|ограниченностью снизу]] плюс полнотой $\mathbb R$.`,
		related: ['supremum', 'verhnyaya-gran', 'ogranichennost-snizu', 'naimenshiy-element']
	},

	'ogranichennost-sverhu': {
		id: 'ogranichennost-sverhu',
		term: 'Ограниченность сверху',
		short: String.raw`Существует число, которое не меньше всех членов последовательности.`,
		formula: String.raw`\exists A\ \forall n:\ f_n\le A`,
		body: String.raw`Последовательность **ограничена сверху**, если $\exists A\ \forall n:\ f_n\le A$, то есть у множества её значений есть [[verhnyaya-gran|верхняя грань]] (стр. 17).

Это равносильно существованию [[supremum|супремума]] — но обратный переход опирается на полноту $\mathbb R$. Пример неограниченной сверху последовательности: $f_n=n$; предположение $\exists\sup f_n$ противоречит [[aksioma-arhimeda|аксиоме Архимеда]]. Отрицание ограниченности сверху участвует в определении бесконечно большой последовательности (день 16).`,
		related: ['ogranichennost-snizu', 'ogranichennaya-posledovatelnost', 'supremum', 'aksioma-arhimeda']
	},

	'ogranichennost-snizu': {
		id: 'ogranichennost-snizu',
		term: 'Ограниченность снизу',
		short: String.raw`Существует число, которое не больше всех членов последовательности.`,
		formula: String.raw`\exists B\ \forall n:\ f_n\ge B`,
		body: String.raw`Последовательность **ограничена снизу**, если $\exists B\ \forall n:\ f_n\ge B$, то есть у множества её значений есть нижняя [[verhnyaya-gran|грань]] (стр. 17). Равносильно существованию [[infimum|инфимума]] — с той же оговоркой про полноту $\mathbb R$.

⚠️ В конспекте это определение записано с плавающим индексом ($\forall b:\ f_b\ge B$) — буква индекса роли не играет, но на письме лучше держать единое $n$, иначе на коллоквиуме придётся объяснять, что за $b$.`,
		related: ['ogranichennost-sverhu', 'ogranichennaya-posledovatelnost', 'infimum']
	},

	'ogranichennaya-posledovatelnost': {
		id: 'ogranichennaya-posledovatelnost',
		term: 'Ограниченная последовательность',
		short: String.raw`Ограничена и сверху, и снизу; равносильно $|f_n|\le C$ при всех $n$.`,
		formula: String.raw`\exists C>0\ \forall n:\ |f_n|\le C`,
		body: String.raw`Последовательность **ограничена**, если она ограничена [[ogranichennost-sverhu|сверху]] и [[ogranichennost-snizu|снизу]] одновременно. Равносильная запись: $\exists C>0\ \forall n:\ |f_n|\le C$ (достаточно взять $C=\max(|A|,|B|)$).

Главная теорема дня: всякая [[predel-posledovatelnosti|сходящаяся]] последовательность ограничена. Доказательство берёт $\varepsilon=1$, загоняет хвост в полосу $(A-1;A+1)$ и добивает конечный префикс: $C=\max(|f_1|,\dots,|f_{N_0}|,\ |A|+1)$, где $N_0=N(1)$. Обратное неверно: $(-1)^n$ ограничена и не сходится.`,
		related: ['ogranichennost-sverhu', 'ogranichennost-snizu', 'predel-posledovatelnosti', 'supremum']
	},

	'nedostizhimyy-supremum': {
		id: 'nedostizhimyy-supremum',
		term: 'Недостижимый супремум',
		short: String.raw`Точная грань есть, а наибольшего элемента нет: $\sup\sin n=1$.`,
		formula: String.raw`\sup_{n\in\mathbb N_1}\sin n=1,\qquad \max\{\sin n\}=\varnothing`,
		body: String.raw`[[supremum|Супремум]] не обязан быть членом последовательности. Эталонный пример курса — $\sin n$ на натуральных: равенство $\sin n=1$ означало бы $2n=\pi(4k+1)$, что невозможно (слева целое, справа иррациональное), поэтому $\max\{\sin n\}=\varnothing$. При этом для любого $A<1$ найдётся $n$ с $\sin n>A$ — по [[plotnost-drobnyh-chastey|плотности дробных частей]], — то есть условие 2') выполнено и $\sup=1$.

Разница «достигается / не достигается» — это разница между $\max$ и $\sup$ (и между $\min$ и $\inf$ в задачах оптимизации).`,
		related: ['supremum', 'naibolshiy-element', 'plotnost-drobnyh-chastey']
	},

	'plotnost-drobnyh-chastey': {
		id: 'plotnost-drobnyh-chastey',
		term: 'Плотность дробных частей',
		short: String.raw`При иррациональном $a$ числа $\{ka+b\}$ подходят к нулю сколь угодно близко.`,
		formula: String.raw`a\in\mathbb I:\quad \forall\varepsilon>0\ \exists k:\ \{ka+b\}<\varepsilon`,
		body: String.raw`Факт со стр. 17 конспекта: если $a$ иррационально, то дробные части $\{ka+b\}=(ka+b)-\lfloor ka+b\rfloor$ подходят к нулю сколь угодно близко (плотность орбиты иррационального поворота окружности).

Он и даёт [[nedostizhimyy-supremum|недостижимый супремум]] у $\sin n$: при $a=\frac1{2\pi}$, $b=-\frac14$ попадание дробной части в окрестность нуля означает попадание $n$ в окрестность $\frac\pi2+2\pi m$, то есть выполнение [[supremum|условия 2']]. ⚠️ В конспекте кванторы записаны как $\exists k\ \forall\varepsilon>0$ — нужно $\forall\varepsilon>0\ \exists k$.`,
		related: ['nedostizhimyy-supremum', 'supremum']
	},

	'aksioma-vlozhennyh-otrezkov': {
		id: 'aksioma-vlozhennyh-otrezkov',
		term: 'Аксиома о вложенных отрезках',
		short: String.raw`Пересечение вложенных отрезков непусто — так в курсе задана полнота $\mathbb R$.`,
		formula: String.raw`[a_{k+1};b_{k+1}]\subset[a_k;b_k]\ \Rightarrow\ \bigcap_{k}[a_k;b_k]\ne\varnothing`,
		body: String.raw`Аксиома Кантора из аксиоматики $\mathbb R$ (КЛК1 §6, день 5): всякая система вложенных отрезков имеет непустое пересечение. Именно она играет в курсе роль **аксиомы полноты** — отдельного «принципа верхней грани» не формулируется.

Из неё половинным делением восстанавливается существование [[supremum|супремума]] у [[ogranichennost-sverhu|ограниченной сверху]] последовательности: оставляем ту половину отрезка, у которой правый конец — верхняя грань, а левый нет; длины $\frac{b_0-a_0}{2^k}$ по [[aksioma-arhimeda|Архимеду]] стремятся к нулю.`,
		related: ['supremum', 'aksioma-arhimeda', 'ogranichennost-sverhu']
	},

	'aksioma-arhimeda': {
		id: 'aksioma-arhimeda',
		term: 'Аксиома Архимеда',
		short: String.raw`Для любого вещественного $x$ найдётся натуральное $n>x$.`,
		formula: String.raw`\forall x\in\mathbb R\ \exists n\in\mathbb N_1:\ n>x`,
		body: String.raw`Аксиома из списка аксиом $\mathbb R$ (КЛК1 §6, день 5): натуральные [[n-nol-n-odin|$\mathbb N_1$]] не ограничены сверху, то есть $\forall x\in\mathbb R\ \exists n\in\mathbb N_1:\ n>x$.

Рабочие следствия дня 15: у $f_n=n$ [[supremum|супремума]] нет (иначе $\forall n:\ n\le S$), и длины половинок $\frac{b_0-a_0}{2^k}$ становятся меньше любого $\varepsilon$ — без этого [[aksioma-vlozhennyh-otrezkov|вложенные отрезки]] могли бы стягиваться не к точке.`,
		related: ['aksioma-vlozhennyh-otrezkov', 'ogranichennost-sverhu', 'n-nol-n-odin']
	}
};
