import type { Glossary } from '$lib/types';

// Термины дня 28 (непрерывность, связность, образ компакта).
// День должен резолвиться независимо, поэтому опорные понятия топологии,
// метрики и компактности продублированы здесь, а не взяты из соседних дней.
// НЕ дублируются термины канонического глоссария (glossary.ts), на которые
// ссылки идут напрямую: lso, metriki-rho, vykolotaya-okrestnost, zamykanie,
// komponenta-svyaznosti, skalyarnoe-pole, end-r, blacksquare и др.
export const day28Terms: Glossary = {
	'nepreryvnost-v-tochke': {
		id: 'nepreryvnost-v-tochke',
		term: 'Непрерывность в точке',
		short: String.raw`Значение в точке совпало с пределом: $\lim f(x)=f(x_0)$.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=f\Bigl(\lim_{x\to x_0}x\Bigr)=f(x_0)`,
		body: String.raw`**Непрерывность** в точке — это перестановочность: операции «взять предел» и «применить $f$» меняются местами. Отличие от существования предела ровно одно: предел берётся по [[vykolotaya-okrestnost|выколотой окрестности]] и про $f(x_0)$ ничего не знает, а непрерывность требует совпадения значения с пределом. Метрический вариант с $\rho_1,\rho_2$ и [[topologicheskaya-nepreryvnost|топологический]] через [[proobraz|прообраз]] выражают то же свойство во всё более бедной обстановке: второму хватает расстояния, третьему — одних открытых множеств.`,
		related: ['topologicheskaya-nepreryvnost', 'proobraz', 'vykolotaya-okrestnost', 'ravnomernaya-nepreryvnost']
	},

	'topologicheskaya-nepreryvnost': {
		id: 'topologicheskaya-nepreryvnost',
		term: 'Топологическая непрерывность',
		short: String.raw`Прообраз любого открытого множества открыт.`,
		formula: String.raw`\forall U_y,\ y\in E:\quad f^-(U_y)\in\tau_1`,
		body: String.raw`$f:T_1\to T_2$ непрерывна на $D$ при $E=\operatorname{Im}_D f$, если **[[proobraz|прообраз]] открытого открыт**. В записи нет ни $\varepsilon$, ни $\delta$, ни расстояния — только две топологии, поэтому непрерывность оказывается свойством пары топологий, а не поточечным поведением. Отсюда в одну строку следуют [[nepreryvnost-kompozicii|непрерывность композиции]] и теорема об [[obraz-kompakta|образе компакта]]. В [[metricheskoe-prostranstvo|метрическом пространстве]] с индуцированной топологией это равносильно $\varepsilon$-$\delta$.`,
		related: ['proobraz', 'nepreryvnost-v-tochke', 'otkrytoe-mnozhestvo', 'nepreryvnost-kompozicii']
	},

	proobraz: {
		id: 'proobraz',
		term: 'Прообраз f⁻(A)',
		short: String.raw`Все точки, чьи значения попали в $A$; пишется $f^-$, не $f^{-1}$.`,
		formula: String.raw`f^-(A)=\{x:\ f(x)\in A\}`,
		body: String.raw`**Прообраз** множества $A$ — множество всех аргументов, значения которых лежат в $A$. Обозначение — $f^-(A)$, без единицы в показателе (та же логика, что $f^-$ вместо $f^{-1}$ для обратного отображения). Прообраз определён у любого отображения, даже необратимого, и в отличие от образа перестановочен со всеми теоретико-множественными операциями — именно поэтому через него и записывается [[topologicheskaya-nepreryvnost|непрерывность]]. Образ открытого открытым быть не обязан: $x^2$ переводит $(-1;1)$ в $[0;1)$.`,
		related: ['topologicheskaya-nepreryvnost', 'otkrytoe-mnozhestvo', 'nepreryvnost-kompozicii']
	},

	'nepreryvnost-kompozicii': {
		id: 'nepreryvnost-kompozicii',
		term: 'Непрерывность композиции',
		short: String.raw`Прообраз композиции — композиция прообразов, справа налево.`,
		formula: String.raw`(g\circ f)^-(W)=f^-\bigl(g^-(W)\bigr)`,
		body: String.raw`Тождество $(g\circ f)^-(W)=f^-(g^-(W))$ верно для любых отображений, и из него **непрерывность композиции** следует в строку: при $W\in\tau_3$ внутренний [[proobraz|прообраз]] лежит в $\tau_2$, внешний — в $\tau_1$. В $\varepsilon$-$\delta$ языке нужна прогонка допуска через две функции: $\delta(\varepsilon)=\delta_f(\eta_g(\varepsilon))$. Это главный довод за [[topologicheskaya-nepreryvnost|топологическое определение]]: арифметике непрерывных нужно уметь складывать значения, а композиция живёт в любом [[topologicheskoe-prostranstvo|топологическом пространстве]].`,
		related: ['proobraz', 'topologicheskaya-nepreryvnost', 'topologicheskoe-prostranstvo', 'end-r']
	},

	'svyaznaya-oblast': {
		id: 'svyaznaya-oblast',
		term: 'Связная область (СО)',
		short: String.raw`Не распадается на два непустых непересекающихся открытых куска.`,
		formula: String.raw`\nexists\ P,Q\ne\varnothing\ \text{откр. в } D:\ P\cap Q=\varnothing,\ P\cup Q=D`,
		body: String.raw`**Связная область** определяется отрицанием: её нельзя разрезать на два непустых непересекающихся куска, открытых в индуцированной на $D$ топологии. Обе оговорки несущие. Без непустоты годилась бы пара $\varnothing$ и $D$, и связных множеств не осталось бы вовсе. Открытость понимается относительно $D$, а не объемлющего пространства: у $D=[0;1]\cup[2;3]$ куски $[0;1]$ и $[2;3]$ открыты в $D$ и разрезают его, хотя в $\mathbb R$ не открыт ни один из них. Без обеих оговорок теорема об [[obraz-kompakta|образе компакта]] ложна. Не путать с [[komponenta-svyaznosti|компонентой связности]] — открыто-замкнутым множеством: в дискретной топологии на трёхэлементном множестве открыто-замкнуты все восемь подмножеств, а связны только одноточечные и пустое.`,
		related: ['lineyno-svyaznaya-oblast', 'lso', 'komponenta-svyaznosti', 'obraz-kompakta']
	},

	'lineyno-svyaznaya-oblast': {
		id: 'lineyno-svyaznaya-oblast',
		term: 'Линейно связная область (ЛСО)',
		short: String.raw`Любые две точки соединимы путём, лежащим внутри $D$.`,
		formula: String.raw`\forall x,y\in D\ \exists\ \text{непр. }\gamma:[0;1]\to D:\ \gamma(0)=x,\ \gamma(1)=y`,
		body: String.raw`**Линейно связная область** — множество, любые две точки которого соединимы [[put|путём]] внутри него. Определение конструктивно: чтобы его проверить, достаточно предъявить путь. Всегда верно, что ЛСО влечёт [[svyaznaya-oblast|СО]] — доказывается протаскиванием разреза назад по пути на связный отрезок $[0;1]$. Обратное, то есть эквивалентность ОЛСО $\Leftrightarrow$ ОСО, верно там, где малые шары сами ЛСО: в нормированном или локально линейно связном пространстве. В произвольном [[metricheskoe-prostranstvo|метрическом]] она ломается — замкнутая синусоида тополога связна, но точку $(0;0)$ ни с одной точкой правее путём не соединить.`,
		related: ['put', 'svyaznaya-oblast', 'lso', 'metricheskoe-prostranstvo']
	},

	put: {
		id: 'put',
		term: 'Путь',
		short: String.raw`Непрерывное $\gamma:[0;1]\to D$, соединяющее две точки.`,
		formula: String.raw`\gamma:[0;1]\to D\ \text{непрерывно},\quad \gamma(0)=x,\ \gamma(1)=y`,
		body: String.raw`**Путь** — [[nepreryvnost-v-tochke|непрерывное]] отображение отрезка в множество, соединяющее две его точки; через него определяется [[lineyno-svyaznaya-oblast|линейная связность]]. Рядом стоит объект на размерность выше: **гомотопия** $H:[0;1]\times[0;1]\to D$ деформирует один путь в другой, заметая целое семейство. Путь одномерен, гомотопия двумерна, и на них держатся разные понятия: линейная связность («любые две точки соединимы путём») и односвязность («любые два пути с общими концами гомотопны»). Проколотая плоскость $\mathbb R^2\setminus\{0\}$ линейно связна, но не односвязна.`,
		related: ['lineyno-svyaznaya-oblast', 'svyaznaya-oblast', 'lso', 'nepreryvnost-v-tochke']
	},

	'ravnomernaya-nepreryvnost': {
		id: 'ravnomernaya-nepreryvnost',
		term: 'Равномерная непрерывность',
		short: String.raw`Одно $\delta(\varepsilon)$ на всё множество: точка ушла под квантор $\forall$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall x,x'\in D:\ \rho_1(x,x')<\delta\Rightarrow\rho_2\bigl(f(x),f(x')\bigr)<\varepsilon`,
		body: String.raw`От обычной [[nepreryvnost|непрерывности]] отличается порядком кванторов: $\delta$ выбирается по одному $\varepsilon$ сразу для всех точек множества, а не для каждой точки своё. Топологического аналога у понятия нет — сравнивать близость в разных точках позволяет только метрика.`,
		related: ['nepreryvnost', 'metriki-rho', 'modul-nepreryvnosti']
	},

	'obraz-kompakta': {
		id: 'obraz-kompakta',
		term: 'Теорема об образе компакта',
		short: String.raw`Образ компактной связной области — отрезок $[m;M]$ целиком.`,
		formula: String.raw`f(D)=[m;M],\qquad m=\min f(D),\ \ M=\max f(D)`,
		body: String.raw`Если $f:T\to\mathbb R$ непрерывна, а $D$ — [[kompakt|компакт]] и [[svyaznaya-oblast|связная область]], то $f(D)=[m;M]$, то есть достигаются все промежуточные значения. Это **Вейерштрасс и Больцано–Коши в одной формулировке**: компактность даёт замкнутость образа и законность $\min$ и $\max$ вместо $\inf$ и $\sup$, связность — отсутствие дыр. Оба условия неулучшаемы: на $(0;1)$ нет $\max$, на $[0;1]\cup[2;3]$ в образе дыра.`,
		related: ['kompakt', 'svyaznaya-oblast', 'topologicheskaya-nepreryvnost', 'teorema-kantora']
	},

};
