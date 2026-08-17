import type { Glossary } from '$lib/types';

// Термины, вводимые в день 6 (КЛК1 §7, конспект «Топология, метрические
// пространства», стр. 1–3). Термины канонического глоссария курса здесь
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
		body: String.raw`**Топология** на множестве $S$ — набор его подмножеств $\tau\subset 2^S$ ([[bulean|булеан]], а не само $S$), удовлетворяющий четырём аксиомам: $\varnothing\in\tau$; $S\in\tau$; объединение по **произвольному** множеству индексов остаётся в $\tau$; пересечение **конечного** набора остаётся в $\tau$.

Асимметрия объединения и пересечения — единственная тонкость определения: $\bigcap_n(-1/n;1/n)=\{0\}$ показывает, что бесконечное пересечение [[otkrytoe-mnozhestvo|открытых]] множеств открытым быть не обязано.`,
		related: ['topologicheskoe-prostranstvo', 'otkrytoe-mnozhestvo', 'bulean', 'diskretnaya-topologiya']
	},

	'topologicheskoe-prostranstvo': {
		id: 'topologicheskoe-prostranstvo',
		term: 'Топологическое пространство',
		short: String.raw`Пара $(S,\tau)$: носитель и топология на нём.`,
		formula: String.raw`(S,\tau),\qquad \tau\subset 2^{S}`,
		body: String.raw`**Топологическое пространство** — пара $(S,\tau)$, где $S$ — произвольное множество, а $\tau$ — [[topologiya|топология]] на нём.

В этом курсе оно первично: анализ строится в порядке «топологическое $\to$ метрическое $\to$ нормированное пространство», а $\mathbb R$ подаётся как частный случай. В топологическом разделе конспекта слова «$\varepsilon$», «предел», «последовательность» не встречаются вовсе — всё дальнейшее (окрестность, [[zamykanie|замыкание]], предел) формулируется через $\tau$.`,
		related: ['topologiya', 'otkrytoe-mnozhestvo', 'topologiya-r']
	},

	bulean: {
		id: 'bulean',
		term: 'Булеан 2^S',
		short: String.raw`Множество всех подмножеств $S$; при $\#S=n$ в нём $2^n$ элементов.`,
		formula: String.raw`2^{S}=\{A:\ A\subset S\}`,
		body: String.raw`**Булеан** $2^S$ — множество всех подмножеств $S$. ⚠️ Запись читается «множество всех подмножеств», а не «два в степени», хотя мощность и равна $2^{\#S}$.

[[topologiya|Топология]] живёт **внутри** булеана: $\tau\subset 2^S$. Отсюда первый крестик преподавателя — набор $A=\{\spadesuit\}$ топологией быть не может, потому что это подмножество самого $S$, а не набор подмножеств. Максимально возможная топология совпадает со всем булеаном — это [[diskretnaya-topologiya|дискретная]].`,
		related: ['topologiya', 'diskretnaya-topologiya', 'topologicheskoe-prostranstvo']
	},

	'otkrytoe-mnozhestvo': {
		id: 'otkrytoe-mnozhestvo',
		term: 'Открытое множество',
		short: String.raw`Открыто = лежит в $\tau$; никакой дополнительной проверки нет.`,
		formula: String.raw`x\ \text{открыто в }S\iff x\in\tau`,
		body: String.raw`**Открытое множество** в топологическом пространстве $(S,\tau)$ — это в точности **элемент топологии**: $x$ открыто тогда и только тогда, когда $x\in\tau$.

Никаких «внутренних точек» и «шаров» в определении нет: открытость не проверяется, а назначается выбором $\tau$. Одно и то же множество бывает открытым в одной топологии и неоткрытым в другой — например, $\{1\}$ открыто в [[diskretnaya-topologiya|дискретной]] топологии и не открыто в [[trivialnaya-topologiya|тривиальной]].`,
		related: ['topologiya', 'zamknutoe-mnozhestvo', 'komponenta-svyaznosti']
	},

	'zamknutoe-mnozhestvo': {
		id: 'zamknutoe-mnozhestvo',
		term: 'Замкнутое множество',
		short: String.raw`Замкнуто, если открыто дополнение: $\overline x_S\in\tau$.`,
		formula: String.raw`x\ \text{замкнуто}\iff \overline{x}_S\in\tau`,
		body: String.raw`**Замкнутое множество** определяется через [[dopolnenie|дополнение]]: $x$ замкнуто, если $\overline x_S$ [[otkrytoe-mnozhestvo|открыто]], то есть $\overline x_S\in\tau$. Черта сверху — дополнение до $S$, **не** замыкание.

Открытость и замкнутость — независимые свойства, а не отрицания друг друга: множество бывает открытым и не замкнутым, замкнутым и не открытым, ни тем ни другим, а бывает и тем и другим сразу — тогда это [[komponenta-svyaznosti|компонента связности]] в терминологии курса.`,
		related: ['otkrytoe-mnozhestvo', 'dopolnenie', 'komponenta-svyaznosti', 'de-morgan']
	},

	'trivialnaya-topologiya': {
		id: 'trivialnaya-topologiya',
		term: 'Тривиальная (минимальная) топология',
		short: String.raw`$D=\{\varnothing,S\}$ — самая бедная топология на любом $S$.`,
		formula: String.raw`D=\{\varnothing,\ S\}`,
		body: String.raw`**Тривиальная**, она же **минимальная**, топология $D=\{\varnothing,S\}$ содержит ровно то, что требуют первые две аксиомы, и ничего сверх. Аксиомы объединения и пересечения выполняются в ней автоматически.

Она минимальна буквально: всякая [[topologiya|топология]] на $S$ содержит $D$ и содержится в [[diskretnaya-topologiya|дискретной]], то есть $D\subset\tau\subset 2^S$. Различить здесь можно только «ничего» и «всё», а [[komponenta-svyaznosti|компонент связности]] ровно две — $\varnothing$ и $S$.`,
		related: ['topologiya', 'diskretnaya-topologiya', 'svyaznoe-dvoetochie']
	},

	'diskretnaya-topologiya': {
		id: 'diskretnaya-topologiya',
		term: 'Дискретная (максимальная) топология',
		short: String.raw`$E=2^S$ — открыто вообще всё, включая одноточечные множества.`,
		formula: String.raw`E=2^{S}`,
		body: String.raw`**Дискретная**, она же **максимальная**, топология — весь [[bulean|булеан]]: $E=2^S$. Аксиомы 3 и 4 выполняются в ней даром, потому что результат любой операции над подмножествами снова лежит в булеане.

В ней открыто и одновременно [[zamknutoe-mnozhestvo|замкнуто]] каждое подмножество, поэтому [[komponenta-svyaznosti|компонент связности]] по определению курса ровно $2^{\#S}$: на трёх точках восемь — тогда как компонент связности в стандартном смысле три. Это главный контрпример темы.`,
		related: ['topologiya', 'trivialnaya-topologiya', 'bulean', 'komponenta-svyaznosti']
	},

	'svyaznoe-dvoetochie': {
		id: 'svyaznoe-dvoetochie',
		term: 'Связное двоеточие',
		short: String.raw`$F=\{\varnothing,\{\spadesuit\},S\}$ — оно же пространство Серпинского.`,
		formula: String.raw`F=\{\varnothing,\ \{\spadesuit\},\ S\}`,
		body: String.raw`**Связное двоеточие** — топология $F=\{\varnothing,\{\spadesuit\},S\}$ на двухточечном $S=\{\spadesuit,\clubsuit\}$: строго между [[trivialnaya-topologiya|тривиальной]] и [[diskretnaya-topologiya|дискретной]]. Точки различимы несимметрично: $\spadesuit$ отделяется открытым множеством, $\clubsuit$ — нет.

[[komponenta-svyaznosti|Компонент связности]] здесь только две ($\varnothing$ и $S$), то есть пространство [[svyaznost|связно]] — отсюда название. ⚠️ В конспекте написано «связанное двоеточие»; общепринятые имена — связное двоеточие и пространство Серпинского.`,
		related: ['trivialnaya-topologiya', 'diskretnaya-topologiya', 'svyaznost']
	},

	'de-morgan': {
		id: 'de-morgan',
		term: 'Правило де Моргана',
		short: String.raw`Дополнение объединения равно пересечению дополнений.`,
		formula: String.raw`\overline{\bigcup_{i\in I}x_i}=\bigcap_{i\in I}\overline{x_i}`,
		body: String.raw`**Правило де Моргана** переводит объединения в пересечения через [[dopolnenie|дополнение]]. В конспекте оно выделено красным — единственный красный фрагмент — именно как рабочий инструмент перехода «[[otkrytoe-mnozhestvo|открытое]] $\leftrightarrow$ [[zamknutoe-mnozhestvo|замкнутое]]»: раз объединение открытых открыто, то пересечение замкнутых замкнуто.

Иллюстрации оттуда же: $\mathbb R\setminus[x;y]=(-\infty;x)\cup(y;+\infty)$, а дополнение объединения двух отрезков — три интервала. Доказательства в конспекте нет.`,
		related: ['dopolnenie', 'zamknutoe-mnozhestvo', 'otkrytoe-mnozhestvo']
	},

	svyaznost: {
		id: 'svyaznost',
		term: 'Связность',
		short: String.raw`Пространство связно, если не режется на два непустых открытых куска.`,
		formula: String.raw`S=A\cup B,\ A\cap B=\varnothing,\ A,B\in\tau\setminus\{\varnothing\}\ \Rightarrow\ \text{несвязно}`,
		body: String.raw`Пространство **связно**, если его нельзя представить как объединение двух непустых непересекающихся [[otkrytoe-mnozhestvo|открытых]] множеств. Эквивалентная формулировка на языке курса: [[komponenta-svyaznosti|компонент связности]] ровно две, то есть открыто-замкнуты только $\varnothing$ и $S$.

В стандартной терминологии **компонента связности** — максимальное связное подмножество; именно это понятие курс подменил на clopen. Развёрнуто связность и её линейный вариант ([[lso|ЛСО, ОСО, ОЛСО]]) появятся в конце семестра.`,
		related: ['komponenta-svyaznosti', 'lso', 'otkrytoe-mnozhestvo', 'svyaznoe-dvoetochie']
	},

	'topologiya-r': {
		id: 'topologiya-r',
		term: 'Стандартная топология на ℝ',
		short: String.raw`Открыты $\varnothing$, $\mathbb R$, все интервалы, лучи и их объединения.`,
		formula: String.raw`(x;y),\ (-\infty;x),\ (x;+\infty)\in\tau`,
		body: String.raw`Конспект задаёт [[topologiya|топологию]] на $\mathbb R$ списком из шести пунктов: $\varnothing$, $\mathbb R$, все интервалы $(x;y)$, лучи $(-\infty;x)$ и $(x;+\infty)$, объединения и пересечения.

⚠️ Пункт про пересечение записан там по произвольному множеству индексов — потеряна конечность, и контрпример $\bigcap_n(-1/n;1/n)=\{0\}$ ломает такую запись. Базу топологии курс не вводит, поэтому это скорее описание, чем определение: не сказано, что $\tau$ — минимальное такое семейство. [[komponenta-svyaznosti|Открыто-замкнуты]] здесь только $\varnothing$ и $\mathbb R$.`,
		related: ['topologiya', 'otkrytoe-mnozhestvo', 'komponenta-svyaznosti', 'topologicheskoe-prostranstvo']
	}
};
