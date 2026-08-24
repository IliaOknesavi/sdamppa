import type { Glossary } from '$lib/types';

// Термины, вводимые в день 6 (ch06). Термины канонического глоссария здесь
// намеренно НЕ переобъявляются, а только связываются через [[...]]:
//   dopolnenie, zamykanie, komponenta-svyaznosti, vykolotaya-okrestnost,
//   metriki-rho, lso, blacksquare.
// Термины, введённые в этот день и нужные дальше (открытое/замкнутое
// множество, де Морган, связность), объявлены здесь целиком, чтобы день
// резолвился независимо от соседних.
export const day06Terms: Glossary = {
	topologiya: {
		id: 'topologiya',
		term: 'Топология',
		short: String.raw`Набор подмножеств $\tau\subset 2^S$ с четырьмя аксиомами.`,
		formula: String.raw`\varnothing\in\tau,\quad S\in\tau,\quad \bigcup_{i\in I}x_i\in\tau,\quad \bigcap_{i=1}^{r}x_i\in\tau`,
		body: String.raw`**Топология** на множестве $S$ — набор его подмножеств $\tau\subset 2^S$ ([[bulean|булеан]], а не само $S$), удовлетворяющий четырём аксиомам: $\varnothing\in\tau$; $S\in\tau$; объединение по **произвольному** множеству индексов остаётся в $\tau$; пересечение **конечного** набора остаётся в $\tau$. Асимметрия объединения и пересечения существенна: $\bigcap_n(-1/n;1/n)=\{0\}$ показывает, что бесконечное пересечение [[otkrytoe-mnozhestvo|открытых]] множеств открытым быть не обязано.`,
		related: ['topologicheskoe-prostranstvo', 'otkrytoe-mnozhestvo', 'bulean', 'diskretnaya-topologiya']
	},

	'topologicheskoe-prostranstvo': {
		id: 'topologicheskoe-prostranstvo',
		term: 'Топологическое пространство',
		short: String.raw`Пара $(S,\tau)$: носитель и топология на нём.`,
		formula: String.raw`(S,\tau),\qquad \tau\subset 2^{S}`,
		body: String.raw`**Топологическое пространство** — пара $(S,\tau)$, где $S$ — произвольное множество, а $\tau$ — [[topologiya|топология]] на нём. Это самая бедная структура, в которой уже осмысленны окрестность, [[zamykanie|замыкание]] и предел: все они формулируются через $\tau$, без расстояния и без $\varepsilon$.`,
		related: ['topologiya', 'otkrytoe-mnozhestvo', 'topologiya-r']
	},

	'otkrytoe-mnozhestvo': {
		id: 'otkrytoe-mnozhestvo',
		term: 'Открытое множество',
		short: String.raw`Открыто = лежит в $\tau$; никакой дополнительной проверки нет.`,
		formula: String.raw`x\ \text{открыто в }S\iff x\in\tau`,
		body: String.raw`**Открытое множество** в топологическом пространстве $(S,\tau)$ — это в точности **элемент топологии**: $x$ открыто тогда и только тогда, когда $x\in\tau$. Никаких «внутренних точек» и «шаров» в определении нет: открытость не проверяется, а назначается выбором [[topologiya|топологии]]. Поэтому одно и то же множество бывает открытым в одной топологии и неоткрытым в другой — $\{1\}$ открыто в [[diskretnaya-topologiya|дискретной]] и не открыто в [[trivialnaya-topologiya|тривиальной]].`,
		related: ['topologiya', 'zamknutoe-mnozhestvo', 'komponenta-svyaznosti']
	},

	'zamknutoe-mnozhestvo': {
		id: 'zamknutoe-mnozhestvo',
		term: 'Замкнутое множество',
		short: String.raw`Замкнуто, если открыто дополнение: $\overline x_S\in\tau$.`,
		formula: String.raw`x\ \text{замкнуто}\iff \overline{x}_S\in\tau`,
		body: String.raw`**Замкнутое множество** определяется через [[dopolnenie|дополнение]]: $x$ замкнуто, если $\overline x_S$ [[otkrytoe-mnozhestvo|открыто]], то есть $\overline x_S\in\tau$. Черта сверху — дополнение до $S$, **не** замыкание. Открытость и замкнутость — независимые свойства, а не отрицания друг друга: множество бывает открытым и не замкнутым, замкнутым и не открытым, ни тем ни другим, а бывает и тем и другим сразу — тогда это открыто-замкнутое множество, оно же [[komponenta-svyaznosti|компонента связности]].`,
		related: ['otkrytoe-mnozhestvo', 'dopolnenie', 'komponenta-svyaznosti', 'de-morgan']
	},

	'trivialnaya-topologiya': {
		id: 'trivialnaya-topologiya',
		term: 'Тривиальная (минимальная) топология',
		short: String.raw`$D=\{\varnothing,S\}$ — самая бедная топология на любом $S$.`,
		formula: String.raw`D=\{\varnothing,\ S\}`,
		body: String.raw`**Тривиальная**, она же **минимальная**, топология $D=\{\varnothing,S\}$ содержит ровно то, что требуют первые две аксиомы, и ничего сверх; аксиомы объединения и пересечения выполняются в ней автоматически. Минимальна она буквально: всякая [[topologiya|топология]] на $S$ содержит $D$ и содержится в [[diskretnaya-topologiya|дискретной]], то есть $D\subset\tau\subset 2^S$.`,
		related: ['topologiya', 'diskretnaya-topologiya', 'svyaznoe-dvoetochie']
	},

	'diskretnaya-topologiya': {
		id: 'diskretnaya-topologiya',
		term: 'Дискретная (максимальная) топология',
		short: String.raw`$E=2^S$ — открыто вообще всё, включая одноточечные множества.`,
		formula: String.raw`E=2^{S}`,
		body: String.raw`**Дискретная**, она же **максимальная**, топология — весь [[bulean|булеан]]: $E=2^S$. Аксиомы 3 и 4 выполняются в ней даром, потому что результат любой операции над подмножествами снова лежит в булеане. Открыто и одновременно [[zamknutoe-mnozhestvo|замкнуто]] в ней каждое подмножество, поэтому [[komponenta-svyaznosti|компонент связности]] ровно $2^{\#S}$: на трёх точках восемь.`,
		related: ['topologiya', 'trivialnaya-topologiya', 'bulean', 'komponenta-svyaznosti']
	},

	'svyaznoe-dvoetochie': {
		id: 'svyaznoe-dvoetochie',
		term: 'Связное двоеточие',
		short: String.raw`$F=\{\varnothing,\{\spadesuit\},S\}$ — оно же пространство Серпинского.`,
		formula: String.raw`F=\{\varnothing,\ \{\spadesuit\},\ S\}`,
		body: String.raw`**Связное двоеточие** — топология $F=\{\varnothing,\{\spadesuit\},S\}$ на двухточечном $S=\{\spadesuit,\clubsuit\}$: строго между [[trivialnaya-topologiya|тривиальной]] и [[diskretnaya-topologiya|дискретной]]. Точки различимы несимметрично: $\spadesuit$ отделяется открытым множеством, $\clubsuit$ — нет. [[komponenta-svyaznosti|Компонент связности]] здесь только две ($\varnothing$ и $S$), то есть пространство [[svyaznost|связно]] — отсюда название; второе имя этого пространства — **пространство Серпинского**.`,
		related: ['trivialnaya-topologiya', 'diskretnaya-topologiya', 'svyaznost']
	},

	'de-morgan': {
		id: 'de-morgan',
		term: 'Правило де Моргана',
		short: String.raw`Дополнение объединения равно пересечению дополнений.`,
		formula: String.raw`\overline{\bigcup_{i\in I}x_i}=\bigcap_{i\in I}\overline{x_i}`,
		body: String.raw`**Правило де Моргана** переводит объединения в пересечения через [[dopolnenie|дополнение]]: $\overline{\bigcup_{i\in I}x_i}=\bigcap_{i\in I}\overline{x_i}$.`,
		related: ['dopolnenie', 'zamknutoe-mnozhestvo', 'otkrytoe-mnozhestvo']
	},

	svyaznost: {
		id: 'svyaznost',
		term: 'Связность',
		short: String.raw`Пространство связно, если не режется на два непустых открытых куска.`,
		formula: String.raw`S=A\cup B,\ A\cap B=\varnothing,\ A,B\in\tau\setminus\{\varnothing\}\ \Rightarrow\ \text{несвязно}`,
		body: String.raw`Пространство **связно**, если его нельзя представить как объединение двух непустых непересекающихся [[otkrytoe-mnozhestvo|открытых]] множеств. Эквивалентная формулировка: открыто-замкнуты только $\varnothing$ и $S$, то есть [[komponenta-svyaznosti|компонент связности]] ровно две. **Максимальное связное подмножество** — связное подмножество, не содержащееся ни в каком большем связном; это не то же самое, что открыто-замкнутое множество: в [[diskretnaya-topologiya|дискретном]] пространстве из трёх точек максимальных связных подмножеств три, а открыто-замкнутых восемь.`,
		related: ['komponenta-svyaznosti', 'lso', 'otkrytoe-mnozhestvo', 'svyaznoe-dvoetochie']
	},

	'topologiya-r': {
		id: 'topologiya-r',
		term: 'Стандартная топология на ℝ',
		short: String.raw`Открыты $\varnothing$, $\mathbb R$, все интервалы, лучи и их объединения.`,
		formula: String.raw`(x;y),\ (-\infty;x),\ (x;+\infty)\in\tau`,
		body: String.raw`[[topologiya|Топология]] на $\mathbb R$ задаётся списком: открыты $\varnothing$, вся прямая, все интервалы $(x;y)$, лучи $(-\infty;x)$ и $(x;+\infty)$, а также произвольные объединения и конечные пересечения перечисленного. Точнее, $\tau$ — наименьшее семейство, содержащее все интервалы и замкнутое относительно этих двух операций; интервалы образуют его базу — всякое [[otkrytoe-mnozhestvo|открытое]] множество есть объединение интервалов, лучи в том числе: $(-\infty;x)=\bigcup_{n\in\mathbb N_1}(x-n;x)$.`,
		related: ['topologiya', 'otkrytoe-mnozhestvo', 'komponenta-svyaznosti', 'topologicheskoe-prostranstvo']
	},
	'topologiya-podprostranstva': {
		id: 'topologiya-podprostranstva',
		term: 'Топология подпространства',
		short: String.raw`Открытые в $D$ — это следы открытых в $S$: $U\cap D$.`,
		formula: String.raw`\tau_D=\{\,U\cap D\ :\ U\in\tau\,\}`,
		body: String.raw`На подмножестве $D\subset S$ **топология подпространства** объявляет открытыми пересечения $U\cap D$ по всем $U\in\tau$. Аксиомы [[topologiya|топологии]] наследуются, потому что пересечение с $D$ переставимо с объединением и с конечным пересечением. Не путать с [[inducirovannaya-topologiya|топологией, индуцированной метрикой]]: та строится из расстояния, эта — из объемлющей топологии.`,
		related: ['topologiya', 'podmnozhestvo', 'otkrytoe-mnozhestvo']
	},

};
