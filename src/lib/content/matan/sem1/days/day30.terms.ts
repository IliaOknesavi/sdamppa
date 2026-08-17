import type { Glossary } from '$lib/types';

// Термины дня 30 (репетиция КЛК2: сборка тринадцати пунктов и карта пробелов).
// День-сборка обязан резолвиться независимо, поэтому опорные понятия
// (база топологии, компакт, предел функции, непрерывность) продублированы
// здесь, а не взяты из дней 20–28. НЕ дублируются только термины канонического
// глоссария курса (glossary.ts), на которые ссылки идут напрямую:
// n-nol-n-odin, zamykanie, dopolnenie, vykolotaya-okrestnost, metriki-rho,
// end-r, skalyarnoe-pole, lso, komponenta-svyaznosti, asimptoticheskie-klassy,
// skhodyashchayasya-v-sebe, chastichnaya-posledovatelnost, priznak-i-svoystvo,
// blacksquare.
export const day30Terms: Glossary = {
	'ekzamenacionnyy-minimum': {
		id: 'ekzamenacionnyy-minimum',
		term: 'Экзаменационный минимум КЛК2',
		short: String.raw`Тринадцать пунктов списка — всё, что спрашивают на втором коллоквиуме.`,
		body: String.raw`**Экзаменационный минимум** второго коллоквиума — тринадцать пунктов официального списка тем, от [[baza-topologii|базы топологии]] до [[obraz-kompakta|теоремы об образе компакта]]. Разметка списка — часть программы: жирным помечено то, что спрашивается **с доказательством**, обычным шрифтом — то, где хватит определения и примера. Первые три пункта зачёркнуты в списке КЛК1 и перенесены сюда, остальные в первый коллоквиум не входили вовсе. Типовой вопрос почти в каждом пункте один и тот же: «сформулируйте то же самое в метрическом (топологическом) пространстве».`,
		related: ['probel-konspekta', 'baza-topologii', 'predel-funkcii', 'blacksquare']
	},

	'probel-konspekta': {
		id: 'probel-konspekta',
		term: 'Пробел конспекта',
		short: String.raw`Тема в списке есть, а записи нет — или запись неверна.`,
		body: String.raw`**Пробелом конспекта** здесь названо место, где тема входит в [[ekzamenacionnyy-minimum|экзаменационный минимум]], а расшифровка её не содержит или содержит в испорченном виде. Перед КЛК2 таких мест пять: [[ravnomernaya-nepreryvnost|равномерная непрерывность]] и теорема Кантора (Виноградов, гл. 2 §4, с. 82); отсутствие аксиомы подстановки в списке ZF (Александров, гл. 1); диагональный метод Кантора вместо громоздкой цепочки $y_i$; [[komponenta-svyaznosti|компонента связности]] в стандартном смысле; корректная формулировка связи [[separabelnost|сепарабельности]] и счётной базы. Отвечать надо в терминологии курса, а исправленную версию держать наготове.`,
		related: ['ekzamenacionnyy-minimum', 'ravnomernaya-nepreryvnost', 'komponenta-svyaznosti', 'separabelnost']
	},

	'baza-topologii': {
		id: 'baza-topologii',
		term: 'База топологии',
		short: String.raw`Семейство, объединениями которого получается любое открытое множество.`,
		formula: String.raw`\forall U\in\tau\quad U=\bigcup_{i\in I}B_i,\qquad B_i\in\mathcal B`,
		body: String.raw`**База топологии** (в конспекте «б.т.») — набор открытых множеств, объединениями которых выражается всякое открытое множество. Локальный вариант — база окрестностей точки. Счётная база всегда влечёт [[separabelnost|сепарабельность]]: достаточно выбрать по точке из каждого непустого элемента базы, и полученное счётное множество окажется [[plotnoe-podmnozhestvo|плотным]]. Обратный переход строит базу из шаров $B_{a_i}(1/m)$ и работает только в метрическом пространстве — там, где есть неравенство треугольника.`,
		related: ['separabelnost', 'plotnoe-podmnozhestvo', 'kompakt']
	},

	separabelnost: {
		id: 'separabelnost',
		term: 'Сепарабельность',
		short: String.raw`Есть счётное всюду плотное подмножество.`,
		formula: String.raw`\exists A\subset X:\ \#A=\aleph_0,\ \operatorname{cl}A=X`,
		body: String.raw`Пространство **сепарабельно**, если в нём найдётся счётное [[plotnoe-podmnozhestvo|плотное подмножество]]; образцовый пример — $\mathbb Q$ в $\mathbb R$. ⚠️ В курсе эквивалентность «счётная [[baza-topologii|база]] $\iff$ сепарабельность» заявлена для произвольного топологического пространства, а верна только в метрическом с индуцированной топологией. Контрпример — прямая Зоргенфрея: она сепарабельна, но любая её база имеет мощность континуума. Преподаватель сам просит доказывать лишь лёгкое направление — то, где метрика не нужна.`,
		related: ['baza-topologii', 'plotnoe-podmnozhestvo', 'probel-konspekta', 'zamykanie']
	},

	'plotnoe-podmnozhestvo': {
		id: 'plotnoe-podmnozhestvo',
		term: 'Плотное подмножество',
		short: String.raw`Критерий: $A$ плотно в $B$ тогда и только тогда, когда $B\subset\mathrm{cl}\,A$.`,
		formula: String.raw`A\ \text{плотно в}\ B\iff B\subset\operatorname{cl}A`,
		body: String.raw`$A$ **плотно** в $B$, если [[zamykanie|замыкание]] $A$ накрывает $B$ — это и есть критерий плотного подмножества из КЛК1. Рабочая переформулировка: всякое непустое открытое множество пересекается с $A$; именно в таком виде критерий применяется в доказательстве «счётная [[baza-topologii|база]] $\Rightarrow$ [[separabelnost|сепарабельность]]». В $\mathbb R$ плотны $\mathbb Q$ и иррациональные, а замыкание каждого из них равно всей прямой.`,
		related: ['zamykanie', 'separabelnost', 'baza-topologii']
	},

	'verkhniy-nizhniy-predel': {
		id: 'verkhniy-nizhniy-predel',
		term: 'Верхний и нижний предел, колебание',
		short: String.raw`Пределы супремумов и инфимумов; их разность — колебание $\eta$.`,
		formula: String.raw`\overline{\lim_{x\to x_0}}f=\lim_{\delta\to0}\ \sup_{\mathring B_{x_0}(\delta)}f,\qquad \eta=\overline{\lim}f-\underline{\lim}f`,
		body: String.raw`**Верхний и нижний пределы** функции — пределы супремума и инфимума по стягивающейся [[vykolotaya-okrestnost|выколотой окрестности]], а их разность называется **колебанием** $\eta$ в точке. Критерий курса: [[predel-funkcii|предел]] существует тогда и только тогда, когда $\overline\lim=\underline\lim$, то есть $\eta=0$. ⚠️ Доказательство критерия в конспекте не доведено до конца. Для последовательностей те же объекты строятся через огибающие $S_i=\sup_{k\geqslant i}x_k$; рядом лежит терминологическая ловушка [[chastichnaya-posledovatelnost|«частичной последовательности»]].`,
		related: ['chastichnaya-posledovatelnost', 'predel-funkcii', 'vykolotaya-okrestnost']
	},

	kompakt: {
		id: 'kompakt',
		term: 'Компакт',
		short: String.raw`Из любого открытого покрытия выбирается конечное подпокрытие.`,
		formula: String.raw`\forall\{U_i\}:\ K\subset\bigcup_{i\in I}U_i\ \ \exists i_1,\dots,i_r:\ K\subset\bigcup_{j=1}^{r}U_{i_j}`,
		body: String.raw`**Компакт** определяется по Борелю–Лебегу — через конечное подпокрытие, а не через сходящиеся подпоследовательности. В $\mathbb R^n$ компактность равносильна замкнутости и ограниченности, и доказывается это удобнее всего в [[metriki-rho|метрике $\rho_\infty$]], где шары — кубы. Вне метрической топологии эквивалентность рушится: в топологии лучей на $\mathbb R$ множество $[0;+\infty)$ компактно, но не замкнуто и не ограничено — именно такой пример и требует список КЛК2.`,
		related: ['metriki-rho', 'obraz-kompakta', 'skhodyashchayasya-v-sebe']
	},

	'priznaki-sravneniya': {
		id: 'priznaki-sravneniya',
		term: 'Три признака сравнения',
		short: String.raw`Поэлементный, асимптотический и д'Аламбера.`,
		formula: String.raw`a_n\leqslant b_n;\qquad \lim\frac{a_n}{b_n}=c\in(0;\infty);\qquad \lim\frac{a_{n+1}}{a_n}=q<1`,
		body: String.raw`Три признака сходимости положительных рядов, которые спрашивают на КЛК2. **Поэлементный** сравнивает члены почленно, **асимптотический** — через предел отношения, то есть на языке [[asimptoticheskie-klassy|классов $\Theta$]], **д'Аламбера** — через предел отношения соседних членов. Все три — именно [[priznak-i-svoystvo|признаки]], достаточные условия. ⚠️ В конспекте признак д'Аламбера доказан через **обратное** отношение $a_n/a_{n+1}$, из-за чего в доказательстве сходимости отвечает $c>1$, а в формулировке — привычное $q<1$.`,
		related: ['priznak-i-svoystvo', 'asimptoticheskie-klassy', 'ekzamenacionnyy-minimum']
	},

	'predel-funkcii': {
		id: 'predel-funkcii',
		term: 'Предел функции',
		short: String.raw`Гейне и Коши, каждый — в нескольких средах; точка всегда выколота.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0:\ \forall x\in\mathring B_{x_0}(\delta)\quad f(x)\in B_A(\varepsilon)`,
		body: String.raw`**Предел функции** определяется в курсе дважды: по Гейне (через все допустимые последовательности) и по Коши ($\varepsilon$-$\delta$), причём каждое определение выписывается сразу в $\mathbb R$, $\mathbb R^n$, метрическом и топологическом пространстве. Аргумент всегда берётся из [[vykolotaya-okrestnost|выколотой окрестности]]: значение $f(x_0)$ на предел не влияет, а совпадение предела со значением — это уже [[nepreryvnost|непрерывность]]. Критерий существования формулируется через [[verkhniy-nizhniy-predel|верхний и нижний пределы]].`,
		related: ['vykolotaya-okrestnost', 'nepreryvnost', 'verkhniy-nizhniy-predel', 'szhataya-funkciya']
	},

	'szhataya-funkciya': {
		id: 'szhataya-funkciya',
		term: 'Теорема о сжатой функции',
		short: String.raw`Два городовых для функций; обобщение — в метрических пространствах.`,
		formula: String.raw`f\leqslant h\leqslant g\ \text{на}\ B_r(x_0),\ \ \lim f=\lim g=A\ \Rightarrow\ \lim h=A`,
		body: String.raw`В $\mathbb R$ теорема формулируется для $f,g,h\in$ [[end-r|$\operatorname{End}(\mathbb R)$]]: если $f\leqslant h\leqslant g$ на шаре вокруг точки и крайние имеют общий [[predel-funkcii|предел]], то и средняя имеет тот же. **Обобщённая версия** живёт уже в [[metriki-rho|метрических]] пространствах: там нет порядка, поэтому «зажатость» записывается шарами — $g(x_1)$ лежит в шаре радиуса $\varepsilon_n$ вокруг $f_n(x_2)$ при $\delta_n\to0$ и поточечной сходимости $f_n\to f$. Доказательство обеих — неравенство треугольника.`,
		related: ['end-r', 'predel-funkcii', 'metriki-rho']
	},

	'predel-kompozicii': {
		id: 'predel-kompozicii',
		term: 'Предел композиции',
		short: String.raw`Нужна непрерывность внешней функции — иначе есть контрпример.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=y_0,\ \ g\ \text{непрерывна в}\ y_0\ \Rightarrow\ \lim_{x\to x_0}g\bigl(f(x)\bigr)=g(y_0)`,
		body: String.raw`Теорема о **пределе композиции** без дополнительного условия ложна, и контрпример стоит помнить наизусть: $f\equiv0$, а $g(y)=1$ при $y\ne0$ и $g(0)=0$. Тогда $\lim_{x\to0}f=0$ и $\lim_{y\to0}g=1$, но $g(f(x))\equiv0$, то есть композиция стремится к нулю. Причина — [[vykolotaya-okrestnost|выколотость]]: внешний предел ничего не говорит о значении в самой точке. Спасает либо [[nepreryvnost|непрерывность]] $g$ в $y_0$, либо требование, чтобы $f$ не принимала значение $y_0$ вблизи $x_0$.`,
		related: ['predel-funkcii', 'nepreryvnost', 'vykolotaya-okrestnost']
	},

	nepreryvnost: {
		id: 'nepreryvnost',
		term: 'Непрерывность',
		short: String.raw`Главная версия — топологическая: прообраз открытого открыт.`,
		formula: String.raw`f^-(U)\in\tau_1\quad\text{для всякого }U\in\tau_2`,
		body: String.raw`**Непрерывность** подаётся в трёх видах, и $\varepsilon$-$\delta$ — самый частный. Первый: перестановочность операций, $\lim f(x)=f(\lim x)$. Второй: метрический, через [[metriki-rho|$\rho_1$ и $\rho_2$]]. Третий, главный: топологический — прообраз $f^-(U)$ всякого открытого множества открыт (обозначение $f^-$ вместо $f^{-1}$ — нотация курса). Пункт 11 КЛК2 требует доказать **эквивалентность** второго и третьего в топологии, индуцированной метрикой; на непрерывности держатся [[lso|связность]] и [[obraz-kompakta|теорема об образе компакта]].`,
		related: ['predel-funkcii', 'metriki-rho', 'obraz-kompakta', 'lso']
	},

	'obraz-kompakta': {
		id: 'obraz-kompakta',
		term: 'Теорема об образе компакта',
		short: String.raw`Непрерывная на компактной связной области берёт все промежуточные значения.`,
		formula: String.raw`D\ \text{компакт}\wedge\text{СО},\ E=f(D)\ \Rightarrow\ \forall y\in[\min E;\max E]\ \exists x\in D:\ f(x)=y`,
		body: String.raw`«Локальная теорема 2» курса: если $f:T\to\mathbb R$ [[nepreryvnost|непрерывна]], а область $D$ — [[kompakt|компакт]] и связная область, то образ $E=f(D)$ содержит весь отрезок от $\min E$ до $\max E$. Формулировка объединяет теоремы Больцано–Коши и Вейерштрасса в одну и записана сразу в топологическом пространстве, а не для отрезка $[a;b]$. Слова $\min$ и $\max$ (а не $\inf$ и $\sup$) законны именно из-за компактности. ⚠️ Доказательства в конспекте нет — конспект обрывается на формулировке.`,
		related: ['kompakt', 'nepreryvnost', 'lso']
	},

	'ravnomernaya-nepreryvnost': {
		id: 'ravnomernaya-nepreryvnost',
		term: 'Равномерная непрерывность',
		short: String.raw`Одно $\delta$ на всё множество; в конспекте определения нет.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall x,x'\in D:\ \rho_1(x,x')<\delta\Rightarrow\rho_2\bigl(f(x),f(x')\bigr)<\varepsilon`,
		body: String.raw`**Равномерная непрерывность** отличается от обычной [[nepreryvnost|непрерывности]] только порядком кванторов: $\delta$ выбирается **до** точки и годится сразу для всех. Разница видна на $f(x)=1/x$ на интервале $(0;1)$ — непрерывна, но не равномерно. Теорема Кантора: непрерывная на [[kompakt|компакте]] функция равномерно непрерывна. ⚠️ Термин стоит в пункте 13 списка КЛК2, но в конспекте отсутствует целиком — это [[probel-konspekta|пробел]], который закрывают по Виноградову (гл. 2 §4, с. 82).`,
		related: ['nepreryvnost', 'kompakt', 'probel-konspekta']
	}
};
