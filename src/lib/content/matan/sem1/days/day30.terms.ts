import type { Glossary } from '$lib/types';

// Термины дня 30. День собирает материал дней 18–28, поэтому опорные понятия
// (база топологии, компакт, предел функции, непрерывность) определены здесь
// заново и резолвятся независимо. Не дублируются термины общего глоссария,
// на которые ссылки идут напрямую: n-nol-n-odin, zamykanie, dopolnenie,
// vykolotaya-okrestnost, metriki-rho, end-r, skalyarnoe-pole, lso,
// komponenta-svyaznosti, asimptoticheskie-klassy, skhodyashchayasya-v-sebe,
// chastichnaya-posledovatelnost, priznak-i-svoystvo, blacksquare.
export const day30Terms: Glossary = {
	'pryamaya-zorgenfreya': {
		id: 'pryamaya-zorgenfreya',
		term: 'Прямая Зоргенфрея',
		short: String.raw`$\mathbb R$ с базой из полуинтервалов $[a;b)$: сепарабельна, счётной базы нет.`,
		formula: String.raw`\mathcal B=\bigl\{[a;b):\ a<b\bigr\}`,
		body: String.raw`**Прямая Зоргенфрея** — множество $\mathbb R$ с топологией, базу которой образуют полуинтервалы $[a;b)$. Она тоньше стандартной: всякий интервал $(a;b)$ есть объединение полуинтервалов, а сам $[a;b)$ в стандартной топологии не открыт. Каждый базисный полуинтервал открыто-замкнут, так как его дополнение $(-\infty;a)\cup[b;+\infty)$ снова объединение полуинтервалов.

Пространство [[separabelnost|сепарабельно]]: любой $[a;b)$ содержит рациональную точку, значит $\mathbb Q$ [[plotnoe-podmnozhestvo|плотно]]. Счётной [[baza-topologii|базы]] при этом нет: для каждого $x$ найдётся элемент базы $C_x$ с $x\in C_x\subset[x;x+1)$, откуда $\inf C_x=x$, и соответствие $x\mapsto C_x$ инъективно — всякая база имеет мощность не меньше континуума. Это и есть пример, показывающий, что эквивалентность сепарабельности и счётной базы держится на метрике.`,
		related: ['separabelnost', 'baza-topologii', 'plotnoe-podmnozhestvo']
	},

	'topologiya-luchey': {
		id: 'topologiya-luchey',
		term: 'Топология лучей',
		short: String.raw`$\tau$ из пустого множества, всей прямой и лучей $(a;+\infty)$.`,
		formula: String.raw`\tau=\{\varnothing,\mathbb R\}\cup\{(a;+\infty):a\in\mathbb R\}`,
		body: String.raw`**Топология лучей** на $\mathbb R$ состоит из $\varnothing$, всей прямой и открытых лучей вправо. Аксиомы проверяются мгновенно: пересечение двух лучей — луч с большим началом, объединение семейства лучей — луч с началом $\inf a_i$ или вся прямая.

В ней любые два непустых открытых множества пересекаются, то есть точки не разделяются окрестностями. Из-за этого рушится обычное доказательство «[[kompakt|компакт]] замкнут»: множество $[0;+\infty)$ компактно (любой элемент покрытия, накрывающий точку $0$, накрывает и всё множество), но не замкнуто — его дополнение $(-\infty;0)$ лучом не является — и не ограничено. Замкнутость и ограниченность компактов доказываются в топологии, индуцированной [[metriki-rho|метрикой]], где такое разделение есть.`,
		related: ['kompakt', 'metriki-rho', 'baza-topologii']
	},

	'baza-topologii': {
		id: 'baza-topologii',
		term: 'База топологии',
		short: String.raw`Семейство, объединениями которого получается любое открытое множество.`,
		formula: String.raw`\forall U\in\tau\quad U=\bigcup_{i\in I}B_i,\qquad B_i\in\mathcal B`,
		body: String.raw`**База топологии** — набор открытых множеств, объединениями которых выражается всякое открытое множество. Локальный вариант — база окрестностей точки: семейство, из которого выбирается элемент внутри любой окрестности данной точки.

Счётная база всегда влечёт [[separabelnost|сепарабельность]]: достаточно выбрать по точке из каждого непустого элемента базы, и полученное счётное множество окажется [[plotnoe-podmnozhestvo|плотным]]. Обратный переход строит базу из шаров $B_{a_i}(1/m)$ с центрами в счётном плотном множестве и работает только в метрическом пространстве — там, где есть неравенство треугольника.`,
		related: ['separabelnost', 'plotnoe-podmnozhestvo', 'kompakt']
	},

	separabelnost: {
		id: 'separabelnost',
		term: 'Сепарабельность',
		short: String.raw`Есть счётное всюду плотное подмножество.`,
		formula: String.raw`\exists A\subset X:\ \#A=\aleph_0,\ \operatorname{cl}A=X`,
		body: String.raw`Пространство **сепарабельно**, если в нём найдётся счётное [[plotnoe-podmnozhestvo|плотное подмножество]]; образцовый пример — $\mathbb Q$ в $\mathbb R$.

Эквивалентность «счётная [[baza-topologii|база]] $\iff$ сепарабельность» верна в метрическом пространстве с индуцированной топологией. В произвольном топологическом остаётся только импликация слева направо: [[pryamaya-zorgenfreya|прямая Зоргенфрея]] сепарабельна, а любая её база имеет мощность континуума. Направление «база $\Rightarrow$ сепарабельность» метрики не требует вовсе и потому доказывается в общей среде.`,
		related: ['baza-topologii', 'plotnoe-podmnozhestvo', 'pryamaya-zorgenfreya', 'zamykanie']
	},

	'plotnoe-podmnozhestvo': {
		id: 'plotnoe-podmnozhestvo',
		term: 'Плотное подмножество',
		short: String.raw`Критерий: $A$ плотно в $B$ тогда и только тогда, когда $B\subset\mathrm{cl}\,A$.`,
		formula: String.raw`A\ \text{плотно в}\ B\iff B\subset\operatorname{cl}A`,
		body: String.raw`$A$ **плотно** в $B$, если [[zamykanie|замыкание]] $A$ накрывает $B$. Рабочая переформулировка: всякое непустое открытое множество пересекается с $A$; именно в таком виде критерий применяется в доказательстве «счётная [[baza-topologii|база]] $\Rightarrow$ [[separabelnost|сепарабельность]]».

В $\mathbb R$ плотны и $\mathbb Q$, и иррациональные числа, а замыкание каждого из них равно всей прямой — плотных подмножеств у пространства может быть много, и непересекающихся тоже.`,
		related: ['zamykanie', 'separabelnost', 'baza-topologii']
	},

	'verkhniy-nizhniy-predel': {
		id: 'verkhniy-nizhniy-predel',
		term: 'Верхний и нижний предел, колебание',
		short: String.raw`Пределы супремумов и инфимумов; их разность — колебание $\eta$.`,
		formula: String.raw`\overline{\lim_{x\to x_0}}f=\lim_{\delta\to0}\ \sup_{\mathring B_{x_0}(\delta)}f,\qquad \eta=\overline{\lim}f-\underline{\lim}f`,
		body: String.raw`**Верхний и нижний пределы** функции — пределы супремума и инфимума по стягивающейся [[vykolotaya-okrestnost|выколотой окрестности]], а их разность называется **колебанием** $\eta$ в точке. Критерий: [[predel-funkcii|предел]] существует тогда и только тогда, когда $\overline\lim=\underline\lim$, то есть $\eta=0$.

Для последовательностей те же объекты строятся через огибающие $S_i=\sup_{k\geqslant i}x_k$ и $i_n=\inf_{k\geqslant n}x_k$: обе монотонны, поэтому пределы у них есть всегда. Огибающая не меняется при переходе к [[chastichnaya-posledovatelnost|хвосту]] — отбрасывание конечного числа членов не влияет ни на $\overline\lim$, ни на $\underline\lim$.`,
		related: ['chastichnaya-posledovatelnost', 'predel-funkcii', 'vykolotaya-okrestnost']
	},

	kompakt: {
		id: 'kompakt',
		term: 'Компакт',
		short: String.raw`Из любого открытого покрытия выбирается конечное подпокрытие.`,
		formula: String.raw`\forall\{U_i\}:\ K\subset\bigcup_{i\in I}U_i\ \ \exists i_1,\dots,i_r:\ K\subset\bigcup_{j=1}^{r}U_{i_j}`,
		body: String.raw`**Компакт** определяется по Борелю–Лебегу — через конечное подпокрытие, а не через сходящиеся подпоследовательности. В $\mathbb R^n$ компактность равносильна замкнутости и ограниченности, и доказывается это удобнее всего в [[metriki-rho|метрике $\rho_\infty$]], где шары — кубы.

Вне метрической топологии эквивалентность рушится: в [[topologiya-luchey|топологии лучей]] на $\mathbb R$ множество $[0;+\infty)$ компактно, но не замкнуто и не ограничено. Значит замкнутость и ограниченность — не содержание компактности, а следствие того, что точки разделяются непересекающимися шарами.`,
		related: ['metriki-rho', 'obraz-kompakta', 'topologiya-luchey']
	},

	'priznaki-sravneniya': {
		id: 'priznaki-sravneniya',
		term: 'Три признака сравнения',
		short: String.raw`Поэлементный, асимптотический и д'Аламбера.`,
		formula: String.raw`a_n\leqslant b_n;\qquad \lim\frac{a_n}{b_n}=c\in(0;\infty);\qquad \lim\frac{a_{n+1}}{a_n}=q<1`,
		body: String.raw`Три признака сходимости рядов с положительными членами. **Поэлементный** сравнивает члены почленно с эталоном, **асимптотический** — через предел отношения, то есть на языке [[asimptoticheskie-klassy|классов $\Theta$]], **д'Аламбера** — через предел отношения соседних членов: при $q<1$ ряд сходится, при $q>1$ расходится.

Случай $q=1$ ответа не даёт: $\sum1/n$ расходится, $\sum1/n^2$ сходится, а отношение соседних членов в обоих случаях стремится к единице. Все три — именно [[priznak-i-svoystvo|признаки]], достаточные условия: из сходимости ряда обратно не следует ничего.`,
		related: ['priznak-i-svoystvo', 'asimptoticheskie-klassy']
	},

	'predel-funkcii': {
		id: 'predel-funkcii',
		term: 'Предел функции',
		short: String.raw`Гейне и Коши, каждый — в нескольких средах; точка всегда выколота.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0:\ \forall x\in\mathring B_{x_0}(\delta)\quad f(x)\in B_A(\varepsilon)`,
		body: String.raw`**Предел функции** определяется двумя способами: по Гейне (через все допустимые последовательности) и по Коши ($\varepsilon$-$\delta$), причём каждое определение выписывается сразу в $\mathbb R$, $\mathbb R^n$, метрическом и топологическом пространстве.

Аргумент всегда берётся из [[vykolotaya-okrestnost|выколотой окрестности]]: значение $f(x_0)$ на предел не влияет, а совпадение предела со значением — это уже [[nepreryvnost|непрерывность]]. Критерий существования формулируется через [[verkhniy-nizhniy-predel|верхний и нижний пределы]], а в метрическом пространстве значений — через диаметр образа выколотого шара.`,
		related: ['vykolotaya-okrestnost', 'nepreryvnost', 'verkhniy-nizhniy-predel', 'szhataya-funkciya']
	},

	'szhataya-funkciya': {
		id: 'szhataya-funkciya',
		term: 'Теорема о сжатой функции',
		short: String.raw`Два городовых для функций; обобщение — в метрических пространствах.`,
		formula: String.raw`f\leqslant h\leqslant g\ \text{на}\ B_r(x_0),\ \ \lim f=\lim g=A\ \Rightarrow\ \lim h=A`,
		body: String.raw`В $\mathbb R$ теорема формулируется для $f,g,h\in$ [[end-r|$\operatorname{End}(\mathbb R)$]]: если $f\leqslant h\leqslant g$ на шаре вокруг точки и крайние имеют общий [[predel-funkcii|предел]], то и средняя имеет тот же.

**Обобщённая версия** живёт в [[metriki-rho|метрических]] пространствах: порядка на множестве значений там нет, поэтому зажатость записывается шарами. Пусть $h,f_n,f:(M_1,\rho_1)\to(M_2,\rho_2)$, числа $\delta_n\to0$ и $\varepsilon_n\to0$ таковы, что $\rho_2\bigl(h(x_1),f_n(x_2)\bigr)<\varepsilon_n$ при всех $x_1,x_2\in\mathring B_{x_0}(\delta_n)$, сходимость $f_n\to f$ **равномерна** в некоторой выколотой окрестности $x_0$, и $\lim_{x\to x_0}f=A$. Тогда $\lim_{x\to x_0}h=A$. Равномерность выбросить нельзя: при $\delta_n=\varepsilon_n=1/n$, $h\equiv5$ и $f_n$, равной $5$ на $B_0(1/n)$ и нулю вне его, поточечный предел $f$ равен нулю всюду, кроме самой точки, значит $\lim_{x\to0}f=0$, а $\lim_{x\to0}h=5$. Доказательство обеих версий — неравенство треугольника, в обобщённой с тремя слагаемыми: $\rho_2\bigl(h(x),A\bigr)\leqslant\rho_2\bigl(h(x),f_n(x)\bigr)+\rho_2\bigl(f_n(x),f(x)\bigr)+\rho_2\bigl(f(x),A\bigr)$, и каждое загоняется под $\varepsilon/3$.`,
		related: ['end-r', 'predel-funkcii', 'metriki-rho']
	},

	'predel-kompozicii': {
		id: 'predel-kompozicii',
		term: 'Предел композиции',
		short: String.raw`Нужна непрерывность внешней функции — иначе есть контрпример.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=y_0,\ \ g\ \text{непрерывна в}\ y_0\ \Rightarrow\ \lim_{x\to x_0}g\bigl(f(x)\bigr)=g(y_0)`,
		body: String.raw`Теорема о **пределе композиции** без дополнительного условия ложна, и контрпример стоит помнить наизусть: $f\equiv0$, а $g(y)=1$ при $y\ne0$ и $g(0)=0$. Тогда $\lim_{x\to0}f=0$ и $\lim_{y\to0}g=1$, но $g(f(x))\equiv0$, то есть композиция стремится к нулю.

Причина — [[vykolotaya-okrestnost|выколотость]]: внешний предел ничего не говорит о значении в самой точке, а внутренняя функция попадает ровно в неё. Спасает либо [[nepreryvnost|непрерывность]] $g$ в $y_0$, либо требование, чтобы $f$ не принимала значение $y_0$ вблизи $x_0$.`,
		related: ['predel-funkcii', 'nepreryvnost', 'vykolotaya-okrestnost']
	},

	nepreryvnost: {
		id: 'nepreryvnost',
		term: 'Непрерывность',
		short: String.raw`Главная версия — топологическая: прообраз открытого открыт.`,
		formula: String.raw`f^-(U)\in\tau_1\quad\text{для всякого }U\in\tau_2`,
		body: String.raw`**Непрерывность** записывается в трёх видах, и $\varepsilon$-$\delta$ — самый частный. Первый: перестановочность операций, $\lim f(x)=f(\lim x)$. Второй: метрический, через [[metriki-rho|$\rho_1$ и $\rho_2$]]. Третий, самый общий: топологический — прообраз $f^-(U)$ всякого открытого множества открыт (прообраз обозначается $f^-$).

Второй и третий эквивалентны в топологии, индуцированной метрикой, и доказательство эквивалентности сводится к включению $B_x(\delta)\subset f^-\bigl(B_{f(x)}(\varepsilon)\bigr)$ (задача 4). На непрерывности держатся [[lso|связность]] и [[obraz-kompakta|теорема об образе компакта]].`,
		related: ['predel-funkcii', 'metriki-rho', 'obraz-kompakta', 'lso']
	},

	'obraz-kompakta': {
		id: 'obraz-kompakta',
		term: 'Теорема об образе компакта',
		short: String.raw`Непрерывная на компактной связной области берёт все промежуточные значения.`,
		formula: String.raw`D\ \text{компакт}\wedge\text{СО},\ E=f(D)\ \Rightarrow\ \forall y\in[\min E;\max E]\ \exists x\in D:\ f(x)=y`,
		body: String.raw`Если $f:T\to\mathbb R$ [[nepreryvnost|непрерывна]], а область $D$ — [[kompakt|компакт]] и связная область, то образ $E=f(D)$ содержит весь отрезок от $\min E$ до $\max E$.

Формулировка объединяет теоремы Больцано–Коши и Вейерштрасса в одну и записана сразу в топологическом пространстве, а не для отрезка $[a;b]$. Слова $\min$ и $\max$ (а не $\inf$ и $\sup$) законны именно из-за компактности: непрерывный образ компакта компактен, значит замкнут и ограничен в $\mathbb R$, а потому содержит свои грани.`,
		related: ['kompakt', 'nepreryvnost', 'lso']
	},

	'ravnomernaya-nepreryvnost': {
		id: 'ravnomernaya-nepreryvnost',
		term: 'Равномерная непрерывность',
		short: String.raw`Одно $\delta$ на всё множество, выбранное до точки.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall x,x'\in D:\ \rho_1(x,x')<\delta\Rightarrow\rho_2\bigl(f(x),f(x')\bigr)<\varepsilon`,
		body: String.raw`**Равномерная непрерывность** отличается от обычной [[nepreryvnost|непрерывности]] только порядком кванторов: $\delta$ выбирается до точки и годится сразу для всех.

Пример потери равномерности — $1/x$ на $(0;1)$: годное $\delta(\varepsilon,x_0)=\min\{x_0/2,\ \varepsilon x_0^2/2\}$ стягивается к нулю при $x_0\to0$, и общего $\delta$ не остаётся. На $[a;1]$ при $a>0$ годится $\delta(\varepsilon)=a^2\varepsilon$ — одно на всё множество. Теорема Кантора: непрерывная на [[kompakt|компакте]] функция равномерно непрерывна; компактность и есть то, что запрещает $\delta$ уходить в ноль.`,
		related: ['nepreryvnost', 'kompakt', 'predel-funkcii']
	}
};
