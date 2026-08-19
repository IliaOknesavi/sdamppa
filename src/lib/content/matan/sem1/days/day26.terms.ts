import type { Glossary } from '$lib/types';

// Термины дня 26 (предел функции: Гейне, Коши, топология лучей на N1).
// День должен резолвиться независимо, поэтому опорные понятия топологии и
// метрики продублированы здесь, а не взяты из соседних дней. НЕ дублируются
// только термины канонического глоссария (glossary.ts), на которые ссылки
// идут напрямую: n-nol-n-odin, vykolotaya-okrestnost, metriki-rho,
// asimptoticheskie-klassy, skhodyashchayasya-v-sebe, lso, blacksquare и др.
export const day26Terms: Glossary = {
	'predel-funkcii': {
		id: 'predel-funkcii',
		term: 'Предел функции',
		short: String.raw`Значение $A$, к которому жмётся $f(x)$ при $x\to x_0$; сама точка выколота.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=A`,
		body: String.raw`**Предел функции** в точке $x_0$ — значение $A$, к которому стремятся значения $f$ при приближении аргумента к $x_0$. Есть два равносильных определения: [[opredelenie-geyne|по Гейне]] — через последовательности, и [[opredelenie-koshi|по Коши]] — через $\varepsilon$-$\delta$ и окрестности, сразу в четырёх средах. Оба игнорируют саму точку $x_0$: аргумент берётся из [[vykolotaya-okrestnost|выколотой окрестности]], поэтому значение $f(x_0)$ может быть каким угодно или вовсе не существовать.`,
		related: ['opredelenie-geyne', 'opredelenie-koshi', 'vykolotaya-okrestnost', 'beskonechnyy-predel']
	},

	'opredelenie-geyne': {
		id: 'opredelenie-geyne',
		term: 'Определение по Гейне',
		short: String.raw`Предел через последовательности: годятся все $\{x_n\}\to x_0$ с $x_n\ne x_0$.`,
		formula: String.raw`\forall\{x_n\}:\ x_n\to x_0,\ x_n\ne x_0\ \Rightarrow\ \lim_{n\to\infty}f(x_n)=A`,
		body: String.raw`**Определение по Гейне** сводит [[predel-funkcii|предел функции]] к [[predel-posledovatelnosti|пределу последовательности]]: $\lim f(x)=A$, если для **всякой** последовательности $x_n\to x_0$ с $x_n\ne x_0$ и $\{x_n\}\subset\mathring U_{x_0}$ выполнено $f_n=f(x_n)\to A$. Квантор «для всякой» делает его удобным инструментом опровержения: достаточно двух последовательностей с разными ответами.`,
		related: ['predel-funkcii', 'opredelenie-koshi', 'predel-posledovatelnosti', 'vykolotaya-okrestnost']
	},

	'opredelenie-koshi': {
		id: 'opredelenie-koshi',
		term: 'Определение по Коши',
		short: String.raw`$\varepsilon$-$\delta$ сразу в четырёх видах: шары, метрика, норма, окрестности.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0:\ \forall x\in\mathring B_{x_0}(\delta)\quad f(x)\in B_A(\varepsilon)`,
		body: String.raw`**Определение по Коши** записывается сразу на четырёх уровнях: через [[shar|шары]], через метрику $\rho$, через норму $\|\cdot\|$ и через [[okrestnost|окрестности]] — последняя версия работает без всякого расстояния. Шар аргумента при этом выколот, а окрестность значения обычная. Обе оговорки существенны: с невыколотым шаром аргумента условие даёт $f(x_0)=A$, то есть непрерывность, а с выколотой окрестностью значения предела лишается постоянная $f\equiv A$.`,
		related: ['predel-funkcii', 'opredelenie-geyne', 'shar', 'okrestnost']
	},

	okrestnost: {
		id: 'okrestnost',
		term: 'Окрестность точки',
		short: String.raw`$U_x$ — любой элемент топологии $\tau$, содержащий точку $x$.`,
		formula: String.raw`U_x\in\tau,\qquad x\in U_x`,
		body: String.raw`**Окрестностью** точки $x$ в [[topologicheskoe-prostranstvo|топологическом пространстве]] называют любое открытое множество, содержащее $x$. Удалив саму точку, получают [[vykolotaya-okrestnost|выколотую окрестность]] $\mathring U_x$ — именно на ней строятся предельная точка и оба определения предела. В метрическом пространстве роль окрестностей играют [[shar|шары]] $B_x(r)$.`,
		related: ['topologicheskoe-prostranstvo', 'vykolotaya-okrestnost', 'shar', 'baza-topologii']
	},

	shar: {
		id: 'shar',
		term: 'Открытый шар',
		short: String.raw`$B_{x_0}(r)$ — все точки на расстоянии меньше $r$ от центра.`,
		formula: String.raw`B_{x_0}(r)=\{x\in M:\ \rho(x,x_0)<r\}`,
		body: String.raw`**Открытый шар** радиуса $r$ с центром $x_0$ — множество точек [[metricheskoe-prostranstvo|метрического пространства]], удалённых от центра меньше чем на $r$; запись $B_{x_0}(r)$ читается «центр $x_0$, радиус $r$». Шары порождают топологию, поэтому язык шаров — промежуточная ступень между $\varepsilon$-$\delta$ и [[okrestnost|окрестностями]]. Форма шара зависит от метрики: в [[metriki-rho|$\rho_\infty$]] это куб, в $\rho_1$ — ромб.`,
		related: ['metricheskoe-prostranstvo', 'metriki-rho', 'okrestnost', 'opredelenie-koshi']
	},

	'metricheskoe-prostranstvo': {
		id: 'metricheskoe-prostranstvo',
		term: 'Метрическое пространство',
		short: String.raw`Множество $M$ с функцией расстояния $\rho$, удовлетворяющей трём аксиомам.`,
		formula: String.raw`\rho(x,y)=0\iff x=y,\quad \rho(x,y)=\rho(y,x),\quad \rho(x,z)\leqslant\rho(x,y)+\rho(y,z)`,
		body: String.raw`**Метрическое пространство** $(M,\rho)$ — множество с расстоянием: невырожденность, симметричность и неравенство треугольника. Через [[shar|шары]] метрика порождает топологию, поэтому всякое метрическое пространство автоматически [[topologicheskoe-prostranstvo|топологическое]]. На одном множестве метрик бывает много: [[metriki-rho|семейство $\rho_1,\rho_2,\rho_k,\rho_\infty$]] задаёт на $\mathbb R^n$ разные по форме шары, но одну и ту же топологию. Определения предела формулируются в $\rho$, а не в модуле, и потому переносятся на любую из этих метрик без изменений.`,
		related: ['metriki-rho', 'shar', 'topologicheskoe-prostranstvo', 'normirovannoe-prostranstvo']
	},

	'normirovannoe-prostranstvo': {
		id: 'normirovannoe-prostranstvo',
		term: 'Нормированное пространство',
		short: String.raw`Пространство с нормой $\|\cdot\|$; расстояние берётся как $\|x-y\|$.`,
		formula: String.raw`\rho(x,y)=\|x-y\|`,
		body: String.raw`**Нормированное пространство** — пространство с длиной вектора $\|\cdot\|$, задающей метрику $\rho(x,y)=\|x-y\|$. В определении [[opredelenie-koshi|по Коши]] это третья строка лестницы: $0<\|x-x_0\|<\delta\Rightarrow\|f(x)-A\|<\varepsilon$; чтобы её написать, нужна операция вычитания, которой в общем [[metricheskoe-prostranstvo|метрическом пространстве]] нет. Обратный переход возможен не всегда: метрика $\rho(x,y)=\min\{1,|x-y|\}$ на $\mathbb R$ никакой нормой не порождается, потому что норма однородна ($\|\lambda x\|=|\lambda|\,\|x\|$), а расстояния в этой метрике ограничены единицей.`,
		related: ['metricheskoe-prostranstvo', 'shar', 'opredelenie-koshi']
	},

	'topologicheskoe-prostranstvo': {
		id: 'topologicheskoe-prostranstvo',
		term: 'Топологическое пространство',
		short: String.raw`Множество $S$ с системой открытых множеств $\tau$.`,
		formula: String.raw`\varnothing,S\in\tau;\quad \bigcap_{i=1}^{r}x_i\in\tau;\quad \bigcup_{i\in I}x_i\in\tau`,
		body: String.raw`**Топологическое пространство** $(S,\tau)$ — множество с выделенным семейством открытых множеств: $\varnothing$ и $S$ открыты, **конечное** пересечение открытых открыто, произвольное объединение открыто. Это самая бедная среда, в которой ещё формулируется предел — через [[okrestnost|окрестности]], без расстояния. Конечность в аксиоме пересечения существенна: в $\mathbb R$ со стандартной топологией $\bigcap_{n\in\mathbb N_1}\bigl(-\frac1n;\frac1n\bigr)=\{0\}$ уже не открыто.`,
		related: ['okrestnost', 'baza-topologii', 'topologiya-na-n1', 'metricheskoe-prostranstvo']
	},

	'baza-topologii': {
		id: 'baza-topologii',
		term: 'База топологии',
		short: String.raw`Семейство, объединениями которого получаются все открытые множества.`,
		body: String.raw`**База топологии** — набор открытых множеств, объединениями которых выражается любое открытое множество. Локальный вариант — база окрестностей точки: семейство, у которого внутри любой [[okrestnost|окрестности]] этой точки найдётся хотя бы один элемент. В [[topologiya-na-n1|топологии лучей]] базой окрестностей «бесконечности» служат лучи $U_n$; в [[metricheskoe-prostranstvo|метрическом пространстве]] — [[shar|шары]] убывающего радиуса.`,
		related: ['topologicheskoe-prostranstvo', 'topologiya-na-n1', 'okrestnost', 'shar']
	},

	'topologiya-na-n1': {
		id: 'topologiya-na-n1',
		term: 'Топология лучей на ℕ₁',
		short: String.raw`Открыты только лучи $[n;+\infty)\cap\mathbb N_1$ и пустое множество.`,
		formula: String.raw`\tau=\{\varnothing\}\cup\{U_n=[n;+\infty)\cap\mathbb N_1\}`,
		body: String.raw`**Топология лучей** на [[n-nol-n-odin|$\mathbb N_1$]] объявляет открытыми лучи $U_n=[n;+\infty)\cap\mathbb N_1$: их конечное пересечение — луч с $\max$, объединение — луч с $\min$. Лучи образуют [[baza-topologii|базу окрестностей]] присоединённого символа $\infty$, и тогда [[predel-posledovatelnosti|предел последовательности]] становится частным случаем [[predel-funkcii|предела функции]] $\mathbb N_1\to M$. Технически всё держится на словаре «выколотая окрестность $\leftrightarrow$ номер $N$»: хвост $[N;+\infty)$ и есть выколотая окрестность бесконечности.`,
		related: ['n-nol-n-odin', 'predel-posledovatelnosti', 'baza-topologii', 'predel-funkcii']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`Почти все члены в шаре $B_A(\varepsilon)$; итог — формула $N(\varepsilon)$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N(\varepsilon)\ \forall n>N\ :\ \rho(x_n,A)<\varepsilon`,
		body: String.raw`Последовательность — это функция $f:\mathbb N_1\to M$, а её **предел** требует, чтобы почти все члены попадали в [[shar|шар]] $B_A(\varepsilon)$. Доказательство доводится до явной формулы $N(\varepsilon)$, а не до слов «предел существует». В [[topologiya-na-n1|топологии лучей]] то же условие читается как [[predel-funkcii|предел функции]] в точке $\infty$: хвост $[N;+\infty)$ и есть выколотая окрестность бесконечности.`,
		related: ['n-nol-n-odin', 'topologiya-na-n1', 'predel-funkcii', 'skhodyashchayasya-v-sebe']
	},

	'beskonechnyy-predel': {
		id: 'beskonechnyy-predel',
		term: 'Бесконечный предел',
		short: String.raw`$\lim f=\infty$, если по любой $\{x_n\}\to x_0$ значения $f_n$ неограниченны.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=\infty\iff \forall\{x_n\}\to x_0,\ x_n\ne x_0:\ \{f_n\}\ \text{неогр.}`,
		body: String.raw`**Бесконечный предел** определён по [[opredelenie-geyne|Гейне]] через [[neogranichennost|неограниченность]] последовательности значений, а не через $|f(x)|>E$. Выигрыш — общность: определение живёт в пространстве без модуля и без порядка. Расплата — потеря знака: $+\infty$ и $-\infty$ не различаются, из-за чего случай $F+G=\infty$ в арифметике [[undefined-neopredelennost|бесконечностей]] требует оговорки о согласованности знаков.`,
		related: ['neogranichennost', 'opredelenie-geyne', 'undefined-neopredelennost', 'predel-funkcii']
	},

	neogranichennost: {
		id: 'neogranichennost',
		term: 'Неограниченность последовательности',
		short: String.raw`Почти все члены выходят из любого шара (или любой окрестности $U_t\ne T$).`,
		formula: String.raw`\forall\varepsilon>0\ \forall m\in M\ \exists N\ \forall n>N:\ \rho(x_n,m)>\varepsilon`,
		body: String.raw`**Неограниченность** дана в двух версиях. Метрическая: для любой точки $m$ почти все члены лежат вне [[shar|шара]] $B_m(\varepsilon)$. Топологическая: $\forall t\in T\ \forall U_t\ne T\ \exists N\ \forall n>N:\ x_n\notin U_t$, причём оговорка $U_t\ne T$ обязательна — иначе условие $x_n\notin T$ невыполнимо. Через неё определяется [[beskonechnyy-predel|бесконечный предел]] и в метрическом, и в [[topologicheskoe-prostranstvo|топологическом пространстве]].`,
		related: ['beskonechnyy-predel', 'metricheskoe-prostranstvo', 'topologicheskoe-prostranstvo', 'shar']
	},

	'undefined-neopredelennost': {
		id: 'undefined-neopredelennost',
		term: 'Неопределённость',
		short: String.raw`$\infty/\infty$ и $\infty-\infty$: символ ответа не задаёт.`,
		formula: String.raw`\lim\frac{F}{G}\ \text{и}\ \lim(F-G)\ \text{не определены}`,
		body: String.raw`В арифметике бесконечно больших определены случаи $\lim f/F=0$ для бесконечно малой $f$, $\lim F/f=\infty$ — для бесконечно малой $f$, не обращающейся в нуль вблизи $x_0$, — и $\lim(F+G)=\infty$, а $\lim F/G$ и $\lim(F-G)$ не определены. Обоснование — контрпримерная пара: $F=1/x^2$ и $G_\lambda=\lambda/x^2$ при $x\to0$ дают в отношении любое значение $1/\lambda$. Случай $F+G$ верен лишь при согласованных знаках: раз [[beskonechnyy-predel|бесконечный предел]] задан через [[neogranichennost|неограниченность]], пара $1/x^2$ и $-1/x^2$ его ломает.`,
		related: ['beskonechnyy-predel', 'neogranichennost', 'asimptoticheskie-klassy']
	}
};
