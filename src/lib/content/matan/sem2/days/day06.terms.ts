import type { Glossary } from '$lib/types';

// Термины дня 6 (правило Лопиталя и теорема Штольца).
// День должен резолвиться независимо, поэтому опорные понятия соседних дней
// (производная, теоремы Ролля и Коши, подпоследовательность) продублированы
// здесь, а не взяты из них. НЕ дублируются термины канонического глоссария
// (sem2/glossary.ts и sem1/glossary.ts), на которые ссылки идут напрямую:
// end-r, vykolotaya-okrestnost, asimptoticheskie-klassy, klassy-differenciruemosti,
// priznak-i-svoystvo, skalyarnoe-pole, braket, n-nol-n-odin, blacksquare.
export const day06Terms: Glossary = {
	'pravilo-lopitalya': {
		id: 'pravilo-lopitalya',
		term: 'Правило Лопиталя',
		short: String.raw`Предел отношения равен пределу отношения производных — при четырёх условиях.`,
		formula: String.raw`\lim_{x\to x_0}\frac{f(x)}{g(x)}=\lim_{x\to x_0}\frac{f'(x)}{g'(x)}=\theta`,
		body: String.raw`**Правило Лопиталя** раскрывает [[neopredelennost-nol-na-nol|неопределённость $\frac00$]] и $\frac\infty\infty$ через производные. Полная формулировка требует четырёх условий на [[vykolotaya-okrestnost|выколотой окрестности]] $\mathring U_{x_0}$: дифференцируемость $f,g$ на всей $\mathring U_{x_0}$, $g'\ne0$ на ней, нулевые пределы обеих функций (или $|g|\to\infty$) и **существование** $\lim\frac{f'}{g'}$. Производных в самой точке $x_0$ для этого мало: доказательство идёт через [[teorema-koshi-o-srednem|теорему Коши]] на отрезке $[x_0;x]$, где дифференцируемость нужна во всех внутренних точках.`,
		related: ['teorema-shtolca', 'teorema-koshi-o-srednem', 'neopredelennost-nol-na-nol', 'zaciklivanie-lopitalya']
	},

	'teorema-shtolca': {
		id: 'teorema-shtolca',
		term: 'Теорема Штольца',
		short: String.raw`Дискретный Лопиталь: отношение членов — через отношение разностей.`,
		formula: String.raw`\lim_{n\to\infty}\frac{x_n}{y_n}=\lim_{n\to\infty}\frac{x_{n+1}-x_n}{y_{n+1}-y_n}`,
		body: String.raw`**Теорема Штольца** — дискретный аналог [[pravilo-lopitalya|правила Лопиталя]]: разность соседних членов играет роль производной. Условия: $\{y_n\}$ строго возрастает начиная с некоторого номера, $y_n\to+\infty$, и предел разностного отношения существует. Без условий на $\{y_n\}$ равенство ложно: при $x_n=n$, $y_n=1+\frac1n$ слева $\frac{n^2}{n+1}\to+\infty$, справа $-n(n+1)\to-\infty$. Импликация односторонняя, это [[priznak-i-svoystvo|признак]], а не критерий.`,
		related: ['pravilo-lopitalya', 'srednie-chezaro', 'beskonechno-bolshaya-posledovatelnost', 'priznak-i-svoystvo']
	},

	'neopredelennost-nol-na-nol': {
		id: 'neopredelennost-nol-na-nol',
		term: 'Неопределённость ноль на ноль',
		short: String.raw`Предел отношения двух бесконечно малых; пределами $f$ и $g$ он не определён.`,
		formula: String.raw`\lim_{x\to x_0}f=\lim_{x\to x_0}g=0,\qquad \lim_{x\to x_0}\frac{f}{g}=\ ?`,
		body: String.raw`**Неопределённость $\frac00$** — предел отношения, у которого числитель и знаменатель стремятся к нулю. Арифметика пределов здесь неприменима по существу: в правиле частного стоит $B\ne0$, и ответ действительно не определяется пределами $f$ и $g$ ($\frac xx\to1$, $\frac{x^2}x\to0$, $\frac{x}{x^3}\to\infty$, $\frac{x\sin(1/x)}{x}$ предела не имеет). Раскрыть её — значит измерить **скорость** обеих функций, то есть найти класс $f$ относительно $g$ в терминах [[asimptoticheskie-klassy|асимптотических классов]]; инструмент для этого — [[pravilo-lopitalya|правило Лопиталя]].`,
		related: ['neopredelennost-beskonechnost', 'pravilo-lopitalya', 'asimptoticheskie-klassy']
	},

	'neopredelennost-beskonechnost': {
		id: 'neopredelennost-beskonechnost',
		term: 'Неопределённость бесконечность на бесконечность',
		short: String.raw`Отношение двух бесконечно больших; правилу достаточно $|g|\to\infty$.`,
		formula: String.raw`\lim_{x\to x_0}|f|=\lim_{x\to x_0}|g|=+\infty,\qquad \lim_{x\to x_0}\frac{f}{g}=\ ?`,
		body: String.raw`**Неопределённость $\frac\infty\infty$** — одно из трёх выражений, помеченных undefined в арифметике [[rasshirennaya-pryamaya|расширенной прямой]]. Ответ так же не определяется пределами сомножителей, как и у [[neopredelennost-nol-na-nol|$\frac00$]]. Для [[pravilo-lopitalya|правила Лопиталя]] достаточно требовать $|g|\to\infty$, не требуя от числителя ничего, кроме дифференцируемости: в доказательстве уход в бесконечность нужен только знаменателю — он гасит слагаемые $\frac{f(y)}{g(x)}$ и $\frac{g(y)}{g(x)}$ с фиксированной точкой $y$.`,
		related: ['neopredelennost-nol-na-nol', 'pravilo-lopitalya', 'rasshirennaya-pryamaya']
	},

	'zaciklivanie-lopitalya': {
		id: 'zaciklivanie-lopitalya',
		term: 'Зацикливание правила Лопиталя',
		short: String.raw`Отношение производных возвращает исходную дробь — правило не помогает.`,
		formula: String.raw`\frac{\sqrt{x^2+1}}{x}\ \longrightarrow\ \frac{x}{\sqrt{x^2+1}}\ \longrightarrow\ \frac{\sqrt{x^2+1}}{x}`,
		body: String.raw`**Зацикливание** — ситуация, когда переход от пары $(f,g)$ к паре $(f',g')$ оказывается симметрией самой задачи и правило возвращает исходное выражение. Образец: у $\frac{\sqrt{x^2+1}}{x}$ отношение производных равно обратной дроби, второе применение возвращает первую — цикл длины два. Переворот дроби не спасает: для пары $\bigl(\frac1x,\ (x^2+1)^{-1/2}\bigr)$ отношение производных равно кубу исходной дроби. Правило при этом нигде не ошибается, просто не приближает к ответу; предел берут вынесением главного члена — он равен $1$ при $x\to+\infty$ и $-1$ при $x\to-\infty$.`,
		related: ['pravilo-lopitalya', 'neopredelennost-beskonechnost', 'rasshirennaya-pryamaya']
	},

	'predelnyy-perekhod-po-geyne': {
		id: 'predelnyy-perekhod-po-geyne',
		term: 'Предельный переход по Гейне',
		short: String.raw`Предел функции — через произвольную $x_n\to x_0$ с $x_n\ne x_0$.`,
		formula: String.raw`\forall\{x_n\}:\ x_n\to x_0,\ x_n\ne x_0\ \Rightarrow\ f(x_n)\to\theta`,
		body: String.raw`**Переход по Гейне** сводит утверждение о пределе функции к утверждению о пределе последовательности: берём произвольную $x_n\to x_0$ из [[vykolotaya-okrestnost|выколотой окрестности]] и работаем с числами. Так доказывается [[pravilo-lopitalya|правило Лопиталя]]: точка $c=c(x_n)$ из [[teorema-koshi-o-srednem|теоремы Коши]] зажата между $x_0$ и $x_n$, поэтому $c_n\to x_0$ и $c_n\ne x_0$, а значит $\frac{f'(c_n)}{g'(c_n)}\to\theta$. Произвольность $\{x_n\}$ и переводит эту ε-N-оценку обратно в предел функции.`,
		related: ['pravilo-lopitalya', 'teorema-koshi-o-srednem', 'vykolotaya-okrestnost']
	},

	'teorema-koshi-o-srednem': {
		id: 'teorema-koshi-o-srednem',
		term: 'Теорема Коши о конечных приращениях',
		short: String.raw`Отношение приращений двух функций равно отношению производных в точке $c$.`,
		formula: String.raw`\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)},\qquad c\in(a;b)`,
		body: String.raw`**Теорема Коши** доказывается через вспомогательную функцию $h$ и служит механизмом [[pravilo-lopitalya|правила Лопиталя]]: отношение приращений мгновенно превращается в отношение производных в промежуточной точке. Нужно $g'\ne0$ на $(a;b)$ — иначе знаменатель слева может обнулиться (это следствие [[teorema-rollya|теоремы Ролля]]). Разбор посылок и доказательство — день 5.`,
		related: ['teorema-rollya', 'pravilo-lopitalya', 'klassy-differenciruemosti', 'predelnyy-perekhod-po-geyne']
	},

	'teorema-rollya': {
		id: 'teorema-rollya',
		term: 'Теорема Ролля',
		short: String.raw`Между двумя равными значениями есть точка с нулевой производной.`,
		formula: String.raw`f\in C^1([a;b]),\ f(a)=f(b)\ \Rightarrow\ \exists c\in(a;b):\ f'(c)=0`,
		body: String.raw`**Теорема Ролля**: если $f\in C^1([a;b])$ ([[klassy-differenciruemosti|классы гладкости]]) и $f(a)=f(b)$, то внутри отрезка найдётся точка с $f'(c)=0$. В доказательстве [[pravilo-lopitalya|правила Лопиталя]] она работает контрапозицией: из $g'\ne0$ на всей выколотой окрестности следует $g(x)\ne g(x_0)$, то есть знаменатель $g(x)-g(x_0)$ в [[teorema-koshi-o-srednem|теореме Коши]] не обращается в ноль. Без условия $g'\ne0$ этот шаг рушится.`,
		related: ['teorema-koshi-o-srednem', 'pravilo-lopitalya', 'klassy-differenciruemosti']
	},

	'srednie-chezaro': {
		id: 'srednie-chezaro',
		term: 'Средние Чезаро',
		short: String.raw`Среднее арифметическое сходящейся последовательности идёт к тому же пределу.`,
		formula: String.raw`a_n\to a\ \Rightarrow\ \frac{a_1+a_2+\dots+a_n}{n}\to a`,
		body: String.raw`**Средние Чезаро** — прямое следствие [[teorema-shtolca|теоремы Штольца]] при $x_n=a_1+\dots+a_n$, $y_n=n$: разностное отношение равно $a_{n+1}$, и всё доказательство укладывается в строку. Обратное неверно: у $a_n=(-1)^n$ средние стремятся к нулю, а сама последовательность расходится — усреднение сглаживает рывки. Это тот же односторонний характер импликации, что и у [[pravilo-lopitalya|правила Лопиталя]]: перед нами [[priznak-i-svoystvo|признак]], а не критерий.`,
		related: ['teorema-shtolca', 'pravilo-lopitalya', 'priznak-i-svoystvo']
	},

	'rasshirennaya-pryamaya': {
		id: 'rasshirennaya-pryamaya',
		term: 'Расширенная прямая',
		short: String.raw`$\mathbb R\cup\{\pm\infty\}$; три выражения помечены undefined.`,
		formula: String.raw`\overline{\mathbb R}=\mathbb R^{*}=\mathbb R\cup\{-\infty;+\infty\}`,
		body: String.raw`**Расширенная прямая** $\overline{\mathbb R}=\mathbb R^{*}$ задаётся списком: арифметика с бесконечностями выписана по строкам, и ровно три выражения помечены **undefined** — $\infty-\infty$, $0\cdot\infty$, $\infty/\infty$. Два последних записываются как предел отношения: $\infty/\infty$ — это [[neopredelennost-beskonechnost|$\frac\infty\infty$]], а $0\cdot\infty$ переносом множителя в знаменатель превращается в [[neopredelennost-nol-na-nol|$\frac00$]]. Точки $+\infty$ и $-\infty$ **различны**, поэтому запись «$x\to\infty$» без знака неполна: у $\frac{\sqrt{x^2+1}}{x}$ ответы $1$ и $-1$.`,
		related: ['neopredelennost-nol-na-nol', 'neopredelennost-beskonechnost', 'beskonechno-bolshaya-posledovatelnost']
	},

	'proizvodnaya': {
		id: 'proizvodnaya',
		term: 'Производная',
		short: String.raw`Предел разностного отношения; её алгебраический прообраз — формальная $d_xP$.`,
		formula: String.raw`f'(x_0)=\lim_{\Delta x\to0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}`,
		body: String.raw`**Производная** функции из [[end-r|$\operatorname{End}(\mathbb R)$]] — предел разностного отношения. У неё есть алгебраический прообраз: формальная производная полинома $d_xP$, задаваемая линейностью и правилом Лейбница без всяких пределов; на полиномах оба определения совпадают. Отсюда два следствия для [[pravilo-lopitalya|правила Лопиталя]]: отношение $\frac{f'}{g'}$ определено лишь там, где $g'\ne0$, а сама производная — мгновенная скорость, отношением которых правило и заменяет отношение приращений.`,
		related: ['pravilo-lopitalya', 'klassy-differenciruemosti', 'end-r']
	},

	podposledovatelnost: {
		id: 'podposledovatelnost',
		term: 'Подпоследовательность',
		short: String.raw`Выборка членов по строго возрастающим номерам $n_1<n_2<\dots$`,
		formula: String.raw`n_1<n_2<\dots,\qquad k\mapsto x_{n_k},\qquad n_k\ge k`,
		body: String.raw`**Подпоследовательность** $x_{n_k}$ — композиция последовательности со строго возрастающим отображением $k\mapsto n_k$; из строгого возрастания следует $n_k\ge k$, то есть номера уходят в бесконечность. Предел наследуется: если $x_n\to x$, то и $x_{n_k}\to x$.

Контрапозиция даёт признак расходимости — две подпоследовательности с разными пределами убивают предел; так доказывается, что у $1+\cos x$ предела нет ([[predelnyy-perekhod-po-geyne|переход по Гейне]]). Не путать с [[chastichnaya-posledovatelnost|частичной последовательностью]] — хвостом $x_k,x_{k+1},\dots$: у [[beskonechno-bolshaya-posledovatelnost|бесконечно большой]] $(-1)^n n$ хвосты не сходятся, а подпоследовательности уходят в разные бесконечности.`,
		related: ['chastichnaya-posledovatelnost', 'beskonechno-bolshaya-posledovatelnost', 'predelnyy-perekhod-po-geyne']
	},

	'beskonechno-bolshaya-posledovatelnost': {
		id: 'beskonechno-bolshaya-posledovatelnost',
		term: 'Бесконечно большая последовательность',
		short: String.raw`$|x_n|\to+\infty$; уходить именно в $+\infty$ она не обязана.`,
		formula: String.raw`\forall\varepsilon>0\ \forall m\ \exists N\ \forall n>N:\ |x_n-m|>\varepsilon`,
		body: String.raw`**Бесконечно большой** называется последовательность с $|x_n|\to+\infty$: она в конце концов покидает любую окрестность любой точки прямой. Знака у неё нет и предела может не быть вовсе: $x_n=(-1)^n n$ бесконечно большая, но её подпоследовательности уходят в разные бесконечности. Неограниченности для этого мало: $0,2,0,4,0,6,\dots$ неограниченна, но бесконечно большой не является — бесконечно много её членов сидят в нуле. Для [[teorema-shtolca|теоремы Штольца]] мало и самой бесконечно большой: там нужен монотонный уход именно в $+\infty$, иначе веса в усреднении меняют знак. Отсюда же третий класс последовательностей — «никакие» (ни бесконечно малые, ни бесконечно большие), и осторожность при чтении $\infty$ в [[rasshirennaya-pryamaya|расширенной прямой]].`,
		related: ['teorema-shtolca', 'rasshirennaya-pryamaya', 'asimptoticheskie-klassy']
	}
};
