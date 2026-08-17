import type { Glossary } from '$lib/types';

// Термины дня 6 (правило Лопиталя и теорема Штольца).
// День должен резолвиться независимо, поэтому опорные понятия соседних дней
// (производная, теоремы Ролля и Коши, предельный переход по Гейне) продублированы
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
		body: String.raw`**Правило Лопиталя** раскрывает [[neopredelennost-nol-na-nol|неопределённость $\frac00$]] и $\frac\infty\infty$ через производные. Полная формулировка требует четырёх условий на [[vykolotaya-okrestnost|выколотой окрестности]] $\mathring U_{x_0}$: дифференцируемость $f,g$ на всей $\mathring U_{x_0}$, $g'\ne0$ на ней, нулевые пределы обеих функций (или $|g|\to\infty$) и **существование** $\lim\frac{f'}{g'}$. ⚠️ В конспекте выписано лишь $\exists f'(x_0),g'(x_0)$ — производные в точке, чего не хватает для доказательства через [[teorema-koshi|теорему Коши]], и нет условия $g'\ne0$.`,
		related: ['teorema-shtolca', 'teorema-koshi', 'neopredelennost-nol-na-nol', 'zaciklivanie-lopitalya']
	},

	'teorema-shtolca': {
		id: 'teorema-shtolca',
		term: 'Теорема Штольца',
		short: String.raw`Дискретный Лопиталь: отношение членов — через отношение разностей.`,
		formula: String.raw`\lim_{n\to\infty}\frac{x_n}{y_n}=\lim_{n\to\infty}\frac{x_{n+1}-x_n}{y_{n+1}-y_n}`,
		body: String.raw`**Теорема Штольца** — дискретный аналог [[pravilo-lopitalya|правила Лопиталя]]: разность соседних членов играет роль производной. Условия: $\{y_n\}$ строго возрастает начиная с некоторого номера, $y_n\to+\infty$, и предел разностного отношения существует. ⚠️ В конспекте теорема дана голой формулой без единого условия — в таком виде она ложна (пример: $x_n=n$, $y_n=1+\frac1n$ даёт $+\infty$ слева и $-\infty$ справа). Импликация односторонняя, это [[priznak-i-svoystvo|признак]], а не критерий.`,
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
		body: String.raw`**Неопределённость $\frac\infty\infty$** — одно из трёх выражений, помеченных undefined в арифметике [[rasshirennaya-pryamaya|расширенной прямой]]. Ответ так же не определяется пределами сомножителей, как и у [[neopredelennost-nol-na-nol|$\frac00$]]. ⚠️ В конспекте этот случай в формулировке [[pravilo-lopitalya|правила Лопиталя]] отсутствует, хотя разобранный там же пример $\frac{\sqrt{x^2+1}}{x}$ — именно $\frac\infty\infty$. В полной версии достаточно требовать $|g|\to\infty$ и не требовать от числителя ничего.`,
		related: ['neopredelennost-nol-na-nol', 'pravilo-lopitalya', 'rasshirennaya-pryamaya']
	},

	'zaciklivanie-lopitalya': {
		id: 'zaciklivanie-lopitalya',
		term: 'Зацикливание правила Лопиталя',
		short: String.raw`Отношение производных возвращает исходную дробь — правило не помогает.`,
		formula: String.raw`\frac{\sqrt{x^2+1}}{x}\ \longrightarrow\ \frac{x}{\sqrt{x^2+1}}\ \longrightarrow\ \frac{\sqrt{x^2+1}}{x}`,
		body: String.raw`**Зацикливание** — ситуация, когда переход от пары $(f,g)$ к паре $(f',g')$ оказывается симметрией самой задачи и правило возвращает исходное выражение. Пример-предостережение конспекта: у $\frac{\sqrt{x^2+1}}{x}$ отношение производных равно обратной дроби, второе применение возвращает первую — цикл длины два. Правило при этом нигде не ошибается, просто не приближает к ответу; берут его вынесением главного члена. ⚠️ В выкладке конспекта вдобавок потерян множитель $2x$ цепного правила, но вывод верен: [[pravilo-lopitalya|правило]] не помогает, а предел равен $1$ (при $x\to+\infty$).`,
		related: ['pravilo-lopitalya', 'neopredelennost-beskonechnost', 'rasshirennaya-pryamaya']
	},

	'predelnyy-perekhod-po-geyne': {
		id: 'predelnyy-perekhod-po-geyne',
		term: 'Предельный переход по Гейне',
		short: String.raw`Предел функции — через произвольную $x_n\to x_0$ с $x_n\ne x_0$.`,
		formula: String.raw`\forall\{x_n\}:\ x_n\to x_0,\ x_n\ne x_0\ \Rightarrow\ f(x_n)\to\theta`,
		body: String.raw`**Переход по Гейне** сводит утверждение о пределе функции к утверждению о пределе последовательности: берём произвольную $x_n\to x_0$ из [[vykolotaya-okrestnost|выколотой окрестности]] и работаем с числами. Именно так преподаватель доказывает [[pravilo-lopitalya|правило Лопиталя]]: точка $c=c(x_n)$ из [[teorema-koshi|теоремы Коши]] зажата между $x_0$ и $x_n$, поэтому $c_n\to x_0$ и $c_n\ne x_0$, а значит $\frac{f'(c_n)}{g'(c_n)}\to\theta$. ⚠️ В конспекте цепочка обрывается на ε-N-записи, сам возврат к $\lim\frac{f'}{g'}$ не выписан.`,
		related: ['pravilo-lopitalya', 'teorema-koshi', 'vykolotaya-okrestnost']
	},

	'teorema-koshi': {
		id: 'teorema-koshi',
		term: 'Теорема Коши о конечных приращениях',
		short: String.raw`Отношение приращений двух функций равно отношению производных в точке $c$.`,
		formula: String.raw`\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)},\qquad c\in(a;b)`,
		body: String.raw`**Теорема Коши** — единственная из четвёрки Ферма–Ролль–Лагранж–Коши, доказанная в курсе полностью (через вспомогательную функцию $h$). Она и есть механизм [[pravilo-lopitalya|правила Лопиталя]]: отношение приращений мгновенно превращается в отношение производных в промежуточной точке. Нужно $g'\ne0$ на $(a;b)$ — иначе знаменатель слева может обнулиться (это следствие [[teorema-rollya|теоремы Ролля]]). ⚠️ Курс формулирует её для класса $C^1([a;b])$, что сильнее классического «непрерывна на отрезке, дифференцируема внутри» ([[klassy-differenciruemosti|классы гладкости]]).`,
		related: ['teorema-rollya', 'pravilo-lopitalya', 'klassy-differenciruemosti', 'predelnyy-perekhod-po-geyne']
	},

	'teorema-rollya': {
		id: 'teorema-rollya',
		term: 'Теорема Ролля',
		short: String.raw`Между двумя равными значениями есть точка с нулевой производной.`,
		formula: String.raw`f\in C^1([a;b]),\ f(a)=f(b)\ \Rightarrow\ \exists c\in(a;b):\ f'(c)=0`,
		body: String.raw`**Теорема Ролля** в курсе дана без доказательства, рисунком, и сразу для класса $C^1([a;b])$ ([[klassy-differenciruemosti|классы гладкости]]). В доказательстве [[pravilo-lopitalya|правила Лопиталя]] она работает контрапозицией: из $g'\ne0$ на всей выколотой окрестности следует $g(x)\ne g(x_0)$, то есть знаменатель $g(x)-g(x_0)$ в [[teorema-koshi|теореме Коши]] не обращается в ноль. Без условия $g'\ne0$ — которого в конспекте нет — этот шаг рушится.`,
		related: ['teorema-koshi', 'pravilo-lopitalya', 'klassy-differenciruemosti']
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
		body: String.raw`**Расширенная прямая** $\overline{\mathbb R}=\mathbb R^{*}$ вводится в курсе списком: арифметика с бесконечностями выписана по строкам, и ровно три выражения помечены **undefined** — $\infty-\infty$, $0\cdot\infty$, $\infty/\infty$. Два из них дают неопределённости дня: [[neopredelennost-nol-na-nol|$\frac00$]] и [[neopredelennost-beskonechnost|$\frac\infty\infty$]]. Важная мелочь: $+\infty$ и $-\infty$ — **разные** точки, поэтому запись «$x\to\infty$» без знака неполна (у $\frac{\sqrt{x^2+1}}{x}$ ответы $1$ и $-1$).`,
		related: ['neopredelennost-nol-na-nol', 'neopredelennost-beskonechnost', 'beskonechno-bolshaya-posledovatelnost']
	},

	'proizvodnaya': {
		id: 'proizvodnaya',
		term: 'Производная',
		short: String.raw`Предел разностного отношения; в курсе идёт после формальной $d_xP$.`,
		formula: String.raw`f'(x_0)=\lim_{\Delta x\to0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}`,
		body: String.raw`**Производная** функции из [[end-r|$\operatorname{End}(\mathbb R)$]] — предел разностного отношения. В курсе она вводится алгебраически (формальная производная полинома $d_xP$ и правило Лейбница) и только потом аналитически, через предел. Для дня 6 важны два следствия: отношение $\frac{f'}{g'}$ определено лишь там, где $g'\ne0$, а сама производная — это мгновенная скорость, отношением которых [[pravilo-lopitalya|правило Лопиталя]] и заменяет отношение приращений.`,
		related: ['pravilo-lopitalya', 'klassy-differenciruemosti', 'end-r']
	},

	'beskonechno-bolshaya-posledovatelnost': {
		id: 'beskonechno-bolshaya-posledovatelnost',
		term: 'Бесконечно большая последовательность',
		short: String.raw`В курсе — неограниченная, без требования уйти именно в $+\infty$.`,
		formula: String.raw`\forall\varepsilon>0\ \forall m\ \exists N\ \forall n>N:\ |x_n-m|>\varepsilon`,
		body: String.raw`⚠️ **Бесконечно большая** определена в курсе через **неограниченность**, а не через $\lim=\infty$: знака у неё нет, и $x_n=(-1)^n n$ тоже бесконечно большая. Для [[teorema-shtolca|теоремы Штольца]] такого условия мало — там нужен монотонный уход именно в $+\infty$, иначе веса в усреднении меняют знак. Отсюда же третий класс последовательностей — «никакие» (ни бесконечно малые, ни бесконечно большие), и осторожность при чтении $\infty$ в [[rasshirennaya-pryamaya|расширенной прямой]].`,
		related: ['teorema-shtolca', 'rasshirennaya-pryamaya', 'asimptoticheskie-klassy']
	}
};
