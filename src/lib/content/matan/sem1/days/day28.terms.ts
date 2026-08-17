import type { Glossary } from '$lib/types';

// Термины дня 28 (непрерывность, связность, образ компакта).
// День должен резолвиться независимо, поэтому опорные понятия топологии,
// метрики и компактности продублированы здесь, а не взяты из соседних дней.
// НЕ дублируются только термины канонического глоссария курса (glossary.ts),
// на которые ссылки идут напрямую: lso, metriki-rho, vykolotaya-okrestnost,
// zamykanie, komponenta-svyaznosti, skalyarnoe-pole, end-r, blacksquare и др.
export const day28Terms: Glossary = {
	'nepreryvnost-v-tochke': {
		id: 'nepreryvnost-v-tochke',
		term: 'Непрерывность в точке',
		short: String.raw`Значение в точке совпало с пределом: $\lim f(x)=f(x_0)$.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=f\Bigl(\lim_{x\to x_0}x\Bigr)=f(x_0)`,
		body: String.raw`Курс даёт **непрерывность** первым делом как **перестановочность**: операции «взять предел» и «применить $f$» меняются местами. Отличие от существования предела ровно одно: предел берётся по [[vykolotaya-okrestnost|выколотой окрестности]] и про $f(x_0)$ ничего не знает, а непрерывность требует совпадения значения с пределом. Метрический вариант с $\rho_1,\rho_2$ и [[topologicheskaya-nepreryvnost|топологический]] через [[proobraz|прообраз]] идут следом, по возрастанию общности.`,
		related: ['topologicheskaya-nepreryvnost', 'proobraz', 'vykolotaya-okrestnost', 'ravnomernaya-nepreryvnost']
	},

	'topologicheskaya-nepreryvnost': {
		id: 'topologicheskaya-nepreryvnost',
		term: 'Топологическая непрерывность',
		short: String.raw`Прообраз любого открытого множества открыт.`,
		formula: String.raw`\forall U_y,\ y\in E:\quad f^-(U_y)\in\tau_1`,
		body: String.raw`Главное определение курса: $f:T_1\to T_2$ непрерывна на $D$ при $E=\operatorname{Im}_D f$, если **[[proobraz|прообраз]] открытого открыт**. В записи нет ни $\varepsilon$, ни $\delta$, ни расстояния — только две топологии, поэтому непрерывность оказывается свойством пары топологий, а не поточечным поведением. Отсюда в одну строку следуют [[nepreryvnost-kompozicii|непрерывность композиции]] и теорема об [[obraz-kompakta|образе компакта]]. В [[metricheskoe-prostranstvo|метрическом пространстве]] с индуцированной топологией это равносильно $\varepsilon$-$\delta$ (КЛК2 §11).`,
		related: ['proobraz', 'nepreryvnost-v-tochke', 'otkrytoe-mnozhestvo', 'nepreryvnost-kompozicii']
	},

	proobraz: {
		id: 'proobraz',
		term: 'Прообраз f⁻(A)',
		short: String.raw`Все точки, чьи значения попали в $A$; в курсе пишется $f^-$, не $f^{-1}$.`,
		formula: String.raw`f^-(A)=\{x:\ f(x)\in A\}`,
		body: String.raw`**Прообраз** множества $A$ — множество всех аргументов, значения которых лежат в $A$. Обозначение курса — $f^-(A)$, без единицы в показателе (та же логика, что $f^-$ вместо $f^{-1}$ для обратного отображения). Прообраз определён у любого отображения, даже необратимого, и в отличие от образа перестановочен со всеми теоретико-множественными операциями — именно поэтому через него и записывается [[topologicheskaya-nepreryvnost|непрерывность]]. Образ открытого открытым быть не обязан: $x^2$ переводит $(-1;1)$ в $[0;1)$.`,
		related: ['topologicheskaya-nepreryvnost', 'otkrytoe-mnozhestvo', 'nepreryvnost-kompozicii']
	},

	'nepreryvnost-kompozicii': {
		id: 'nepreryvnost-kompozicii',
		term: 'Непрерывность композиции',
		short: String.raw`Прообраз композиции — композиция прообразов, справа налево.`,
		formula: String.raw`(g\circ f)^-(W)=f^-\bigl(g^-(W)\bigr)`,
		body: String.raw`Тождество $(g\circ f)^-(W)=f^-(g^-(W))$ верно для любых отображений, и из него **непрерывность композиции** следует в строку: при $W\in\tau_3$ внутренний [[proobraz|прообраз]] лежит в $\tau_2$, внешний — в $\tau_1$. В $\varepsilon$-$\delta$ языке нужна прогонка допуска через две функции: $\delta(\varepsilon)=\delta_f(\eta_g(\varepsilon))$. Это главный довод за [[topologicheskaya-nepreryvnost|топологическое определение]]: арифметике нужно уметь складывать значения, а композиция живёт в любом [[topologicheskoe-prostranstvo|топологическом пространстве]].`,
		related: ['proobraz', 'topologicheskaya-nepreryvnost', 'topologicheskoe-prostranstvo', 'end-r']
	},

	'svyaznaya-oblast': {
		id: 'svyaznaya-oblast',
		term: 'Связная область (СО)',
		short: String.raw`Не распадается на два непустых непересекающихся открытых куска.`,
		formula: String.raw`\nexists\ P,Q\ne\varnothing\ \text{откр. в } D:\ P\cap Q=\varnothing,\ P\cup Q=D`,
		body: String.raw`**Связная область** определяется отрицанием: её нельзя разрезать. ⚠️ Запись конспекта $\nexists\,x,y\in\tau:\ x\cap y=\varnothing,\ x\cup y=D$ требует двух правок. Пропущена **непустота** (иначе годится пара $\varnothing$ и $D$), а открытость должна пониматься **в индуцированной на $D$ топологии**: иначе условие $x\cup y=D$ невыполнимо для неоткрытого $D$ и любой [[kompakt|компакт]] оказался бы связным. Без обеих правок теорема об [[obraz-kompakta|образе компакта]] ложна. Не путать с [[komponenta-svyaznosti|компонентой связности]] курса.`,
		related: ['lineyno-svyaznaya-oblast', 'lso', 'komponenta-svyaznosti', 'obraz-kompakta']
	},

	'lineyno-svyaznaya-oblast': {
		id: 'lineyno-svyaznaya-oblast',
		term: 'Линейно связная область (ЛСО)',
		short: String.raw`Любые две точки соединимы путём, лежащим внутри $D$.`,
		formula: String.raw`\forall x,y\in D\ \exists\ \text{непр. }\gamma:[0;1]\to D:\ \gamma(0)=x,\ \gamma(1)=y`,
		body: String.raw`**Линейно связная область** (в конспекте — «линейно связанная») — множество, любые две точки которого соединимы [[put|путём]] внутри него. Определение конструктивно: чтобы его проверить, достаточно предъявить путь. Всегда верно ЛСО $\Rightarrow$ [[svyaznaya-oblast|СО]] (доказывается протаскиванием разреза назад по пути на связный отрезок $[0;1]$). ⚠️ Обратное — эквивалентность ОЛСО $\Leftrightarrow$ ОСО — заявлено в КЛК2 для метрического пространства, но верно лишь там, где малые шары сами ЛСО: в нормированном или локально линейно связном.`,
		related: ['put', 'svyaznaya-oblast', 'lso', 'metricheskoe-prostranstvo']
	},

	put: {
		id: 'put',
		term: 'Путь',
		short: String.raw`Непрерывное $\gamma:[0;1]\to D$; в конспекте ошибочно назван гомотопией.`,
		formula: String.raw`\gamma:[0;1]\to D\ \text{непрерывно},\quad \gamma(0)=x,\ \gamma(1)=y`,
		body: String.raw`**Путь** — [[nepreryvnost-v-tochke|непрерывное]] отображение отрезка в множество, соединяющее две его точки; через него определяется [[lineyno-svyaznaya-oblast|линейная связность]]. ⚠️ В конспекте (стр. 10–11) такое $\gamma$ подписано словом **«гомотопия»** — это ошибка. Гомотопия $H:[0;1]\times[0;1]\to D$ деформирует один путь в другой, заметая целое семейство: путь одномерен, гомотопия двумерна. Из-за подмены слов ломается определение односвязности («любые два пути с общими концами гомотопны») и всё, что на ней стоит.`,
		related: ['lineyno-svyaznaya-oblast', 'svyaznaya-oblast', 'lso', 'nepreryvnost-v-tochke']
	},

	'ravnomernaya-nepreryvnost': {
		id: 'ravnomernaya-nepreryvnost',
		term: 'Равномерная непрерывность',
		short: String.raw`Одно $\delta(\varepsilon)$ на всё множество: точка ушла под квантор $\forall$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall x,x'\in D:\ \rho_1(x,x')<\delta\Rightarrow\rho_2\bigl(f(x),f(x')\bigr)<\varepsilon`,
		body: String.raw`**Равномерная непрерывность** отличается от обычной только порядком кванторов: в [[nepreryvnost-v-tochke|непрерывности]] $\delta=\delta(\varepsilon,x_0)$ зависит от точки, здесь точка стоит правее $\exists\delta$ и $\delta=\delta(\varepsilon)$ одно на всё $D$. ⚠️ Понятие значится в КЛК2 §13, но в конспектах отсутствует — единственный содержательный пробел первого семестра (читать Виноградова гл. 2 §4). Топологического аналога нет: сравнить близость в разных точках можно только [[metriki-rho|расстоянием]]. Пример потери — $1/x$ на $(0;1)$.`,
		related: ['teorema-kantora', 'nepreryvnost-v-tochke', 'kompakt', 'metriki-rho']
	},

	'teorema-kantora': {
		id: 'teorema-kantora',
		term: 'Теорема Кантора',
		short: String.raw`Непрерывная на компакте функция равномерно непрерывна на нём.`,
		formula: String.raw`D\ \text{— компакт},\ f\in C(D)\ \Rightarrow\ f\ \text{равномерно непрерывна на } D`,
		body: String.raw`**Теорема Кантора** превращает локальное свойство в глобальное: на [[kompakt|компакте]] поточечная непрерывность автоматически становится [[ravnomernaya-nepreryvnost|равномерной]]. Компактность существенна — $1/x$ непрерывна на $(0;1)$, но равномерности нет, потому что $\delta(\varepsilon,x_0)$ стягивается к нулю у края; на $[a;1]$ годится общее $\delta(\varepsilon)=a^2\varepsilon$. ⚠️ В конспектах теорема отсутствует вместе с самим определением. Это третья теорема того же куста, что и [[obraz-kompakta|теорема об образе компакта]].`,
		related: ['ravnomernaya-nepreryvnost', 'kompakt', 'obraz-kompakta']
	},

	'obraz-kompakta': {
		id: 'obraz-kompakta',
		term: 'Теорема об образе компакта',
		short: String.raw`Образ компактной связной области — отрезок $[m;M]$ целиком.`,
		formula: String.raw`f(D)=[m;M],\qquad m=\min f(D),\ \ M=\max f(D)`,
		body: String.raw`«Локальная теорема 2» курса: если $f:T\to\mathbb R$ непрерывна, а $D$ — [[kompakt|компакт]] и [[svyaznaya-oblast|связная область]], то $f(D)=[m;M]$, то есть достигаются все промежуточные значения. Это **Вейерштрасс и Больцано–Коши в одной формулировке**: компактность даёт замкнутость образа и законность $\min$ и $\max$ вместо $\inf$ и $\sup$, связность — отсутствие дыр. ⚠️ В конспекте оставлена без доказательства. Оба условия неулучшаемы: на $(0;1)$ нет $\max$, на $[0;1]\cup[2;3]$ в образе дыра.`,
		related: ['kompakt', 'svyaznaya-oblast', 'topologicheskaya-nepreryvnost', 'teorema-kantora']
	},

	kompakt: {
		id: 'kompakt',
		term: 'Компакт',
		short: String.raw`Из любого открытого покрытия выделяется конечное подпокрытие.`,
		formula: String.raw`\forall\{U_\alpha\}\subset\tau:\ \bigcup_\alpha U_\alpha\supset X\ \Rightarrow\ \exists\ \text{конечный}\ K:\ \bigcup_{k\in K}U_k\supset X`,
		body: String.raw`**Компакт** — множество, в котором любое покрытие [[otkrytoe-mnozhestvo|открытыми]] множествами содержит конечное подпокрытие. В курсе это первичное определение, данное сразу в [[topologicheskoe-prostranstvo|топологическом пространстве]]; «замкнуто и ограничено» появляется позже как теорема Гейне–Бореля про $\mathbb R^n$. Именно через покрытия доказывается, что образ компакта — [[obraz-kompakta|компакт]]: прообразы элементов покрытия открыты, конечное подпокрытие переносится вперёд.`,
		related: ['otkrytoe-mnozhestvo', 'obraz-kompakta', 'teorema-kantora', 'zamykanie']
	},

	'otkrytoe-mnozhestvo': {
		id: 'otkrytoe-mnozhestvo',
		term: 'Открытое множество',
		short: String.raw`Элемент топологии $\tau$; в метрике — содержит шар вокруг каждой точки.`,
		formula: String.raw`U\in\tau\iff \forall x\in U\ \exists r>0:\ B_x(r)\subset U\quad(\text{в метрике})`,
		body: String.raw`**Открытое множество** — элемент топологии $\tau$ по определению. В [[metricheskoe-prostranstvo|метрическом пространстве]] с индуцированной топологией это равносильно «вокруг каждой точки помещается шар», и именно эта равносильность переводит $\varepsilon$-$\delta$ определение в [[topologicheskaya-nepreryvnost|топологическое]]. Открытость всегда относительна объемлющего множества: $[0;1)$ не открыт в $\mathbb R$, но открыт в $[0;1]$ — без этой оговорки определение [[svyaznaya-oblast|связной области]] становится ложным.`,
		related: ['topologicheskoe-prostranstvo', 'metricheskoe-prostranstvo', 'topologicheskaya-nepreryvnost', 'svyaznaya-oblast']
	},

	'topologicheskoe-prostranstvo': {
		id: 'topologicheskoe-prostranstvo',
		term: 'Топологическое пространство',
		short: String.raw`Множество $S$ с системой открытых множеств $\tau$.`,
		formula: String.raw`\varnothing,S\in\tau;\quad \bigcap_{i=1}^{r}x_i\in\tau;\quad \bigcup_{i\in I}x_i\in\tau`,
		body: String.raw`**Топологическое пространство** $(S,\tau)$ — множество с выделенным семейством [[otkrytoe-mnozhestvo|открытых]] множеств: $\varnothing$ и $S$ открыты, **конечное** пересечение открытых открыто, произвольное объединение открыто. Это самая бедная среда, в которой ещё формулируются [[topologicheskaya-nepreryvnost|непрерывность]], [[kompakt|компактность]] и [[svyaznaya-oblast|связность]] — без расстояния и без порядка. ⚠️ В конспекте аксиома пересечения на одной странице конечная, на другой — по произвольному $I$; верна только конечная версия.`,
		related: ['otkrytoe-mnozhestvo', 'metricheskoe-prostranstvo', 'topologicheskaya-nepreryvnost', 'kompakt']
	},

	'metricheskoe-prostranstvo': {
		id: 'metricheskoe-prostranstvo',
		term: 'Метрическое пространство',
		short: String.raw`Множество $M$ с расстоянием $\rho$; топология порождается шарами.`,
		formula: String.raw`\rho(x,y)\geqslant0,\quad \rho(x,y)=\rho(y,x),\quad \rho(x,z)\leqslant\rho(x,y)+\rho(y,z)`,
		body: String.raw`**Метрическое пространство** $(M,\rho)$ — множество с расстоянием. Шары порождают топологию, поэтому всякое метрическое пространство автоматически [[topologicheskoe-prostranstvo|топологическое]], и в нём определения курса удваиваются: непрерывность через $\rho_1,\rho_2$ и [[topologicheskaya-nepreryvnost|через прообраз]] равносильны (КЛК2 §11). Курс работает с [[metriki-rho|семейством $\rho_1,\rho_2,\rho_k,\rho_\infty$]]. ⚠️ Эквивалентность ОЛСО $\Leftrightarrow$ ОСО в такой общности неверна — нужна норма или локальная линейная связность.`,
		related: ['metriki-rho', 'topologicheskoe-prostranstvo', 'otkrytoe-mnozhestvo', 'lineyno-svyaznaya-oblast']
	}
};
