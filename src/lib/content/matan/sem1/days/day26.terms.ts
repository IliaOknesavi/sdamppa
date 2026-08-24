import type { Glossary } from '$lib/types';

// Термины дня 26 (предел функции: Гейне, Коши, топология лучей на N1).
// День должен резолвиться независимо, поэтому опорные понятия топологии и
// метрики продублированы здесь, а не взяты из соседних дней. НЕ дублируются
// только термины канонического глоссария (glossary.ts), на которые ссылки
// идут напрямую: n-nol-n-odin, vykolotaya-okrestnost, metriki-rho,
// asimptoticheskie-klassy, skhodyashchayasya-v-sebe, lso, blacksquare и др.
export const day26Terms: Glossary = {
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

	'topologiya-na-n1': {
		id: 'topologiya-na-n1',
		term: 'Топология лучей на ℕ₁',
		short: String.raw`Открыты только лучи $[n;+\infty)\cap\mathbb N_1$ и пустое множество.`,
		formula: String.raw`\tau=\{\varnothing\}\cup\{U_n=[n;+\infty)\cap\mathbb N_1\}`,
		body: String.raw`**Топология лучей** на [[n-nol-n-odin|$\mathbb N_1$]] объявляет открытыми лучи $U_n=[n;+\infty)\cap\mathbb N_1$: их конечное пересечение — луч с $\max$, объединение — луч с $\min$. Лучи образуют [[baza-topologii|базу окрестностей]] присоединённого символа $\infty$: хвост $[N;+\infty)$ и есть выколотая окрестность бесконечности.`,
		related: ['n-nol-n-odin', 'predel-posledovatelnosti', 'baza-topologii', 'predel-funkcii']
	},

	'beskonechnyy-predel': {
		id: 'beskonechnyy-predel',
		term: 'Бесконечный предел',
		short: String.raw`$\lim f=\infty$, если по любой $\{x_n\}\to x_0$ значения $f_n$ неограниченны.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=\infty\iff \forall\{x_n\}\to x_0,\ x_n\ne x_0:\ \{f_n\}\ \text{неогр.}`,
		body: String.raw`**Бесконечный предел** определён по [[opredelenie-geyne|Гейне]] через [[neogranichennost|неограниченность]] последовательности значений, а не через $|f(x)|>E$. Выигрыш — общность: определение живёт в пространстве без модуля и без порядка. Расплата — потеря знака: $+\infty$ и $-\infty$ не различаются.`,
		related: ['neogranichennost', 'opredelenie-geyne', 'undefined-neopredelennost', 'predel-funkcii']
	},

	neogranichennost: {
		id: 'neogranichennost',
		term: 'Неограниченность последовательности',
		short: String.raw`Почти все члены выходят из любого шара и больше в него не возвращаются.`,
		formula: String.raw`\forall\varepsilon>0\ \forall m\in M\ \exists N\ \forall n>N:\ \rho(x_n,m)>\varepsilon`,
		body: String.raw`**Неограниченность** — метрическое понятие: для любой точки $m$ почти все члены лежат вне [[shar|шара]] $B_m(\varepsilon)$. В [[topologicheskoe-prostranstvo|топологическом пространстве]] аналога нет: топология её не различает.`,
		related: ['beskonechnyy-predel', 'metricheskoe-prostranstvo', 'topologicheskoe-prostranstvo', 'shar']
	},

	'undefined-neopredelennost': {
		id: 'undefined-neopredelennost',
		term: 'Неопределённость',
		short: String.raw`$\infty/\infty$ и $\infty-\infty$: символ ответа не задаёт.`,
		formula: String.raw`\lim\frac{F}{G}\ \text{и}\ \lim(F-G)\ \text{не определены}`,
		body: String.raw`В арифметике [[beskonechnyy-predel|бесконечно больших]] определены случаи $\lim f/F=0$ для бесконечно малой $f$, $\lim F/f=\infty$ — для бесконечно малой $f$, не обращающейся в нуль вблизи $x_0$, — и $\lim(F+G)=\infty$, но лишь при согласованных знаках, поскольку определение через [[neogranichennost|неограниченность]] знака не хранит. **Не определены** $\lim F/G$ и $\lim(F-G)$: пара $F=1/x^2$ и $G_\lambda=\lambda/x^2$ при $x\to0$ даёт в отношении любое значение $1/\lambda$.`,
		related: ['beskonechnyy-predel', 'neogranichennost', 'asimptoticheskie-klassy']
	}
};
