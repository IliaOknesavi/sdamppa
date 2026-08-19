import type { Glossary } from '$lib/types';

// Термины дня 14. День должен резолвиться независимо, поэтому термины
// прошлых дней, на которые он ссылается, продублированы здесь:
// predel-posledovatelnosti, obobshchennaya-posledovatelnost,
// metricheskoe-prostranstvo, normirovannoe-prostranstvo, shar,
// neravenstvo-treugolnika, n-ot-epsilon, beskonechno-malaya.
// НЕ дублируются термины канонического глоссария (он склеивается
// последним и перекрывает одноимённые): n-nol-n-odin, dopolnenie, zamykanie,
// vykolotaya-okrestnost, metriki-rho, asimptoticheskie-klassy,
// skhodyashchayasya-v-sebe, blacksquare и прочие из glossary.ts.
export const day14Terms: Glossary = {
	'szhataya-posledovatelnost': {
		id: 'szhataya-posledovatelnost',
		term: 'Сжатая последовательность',
		short: String.raw`$y_n$ зажата между $x_n$ и $z_n$: $x_n\le y_n\le z_n$ при всех $n$.`,
		formula: String.raw`\forall n\in\mathbb N_1:\ x_n\le y_n\le z_n`,
		body: String.raw`Последовательность $y_n$ называется **сжатой** между $x_n$ и $z_n$, если $\forall n\in\mathbb N_1:\ x_n\le y_n\le z_n$, то есть $y_n\in[x_n;z_n]$.

О сходимости самой $y_n$ ничего не предполагается — она может быть сколь угодно рваной. Определение опирается на **порядок** $\le$, которого в [[metricheskoe-prostranstvo|метрическом пространстве]] нет; там сжатость переписывают через [[zamknutyy-shar|замкнутый шар]]: $\rho(f_n,y_n)\le t_n$.`,
		related: ['teorema-o-dvuh-gorodovyh', 'zamknutyy-shar', 'metricheskoe-prostranstvo']
	},

	'teorema-o-dvuh-gorodovyh': {
		id: 'teorema-o-dvuh-gorodovyh',
		term: 'Теорема о двух городовых',
		short: String.raw`Сжатая между двумя сходящимися к $A$ сама сходится к $A$.`,
		formula: String.raw`x_n\le y_n\le z_n,\ \lim x_n=\lim z_n=A\ \Rightarrow\ \lim y_n=A`,
		body: String.raw`Она же **теорема о сжатой последовательности**. Если $\forall n:\ x_n\le y_n\le z_n$ и $\lim x_n=\lim z_n=A$, то $\lim y_n=A$, причём номер берётся без деления $\varepsilon$: $$N_y(\varepsilon_y)=\max\bigl(N_x(\varepsilon_y),N_z(\varepsilon_y)\bigr).$$

Доказательство — разбор двух случаев по знаку $y_n-A$: при $y_n>A$ работает правое неравенство, при $y_n\le A$ — левое. Метрический аналог — [[teorema-o-beskonechnosti-gorodovyh|теорема о бесконечности городовых]].`,
		related: ['szhataya-posledovatelnost', 'teorema-o-beskonechnosti-gorodovyh', 'n-ot-epsilon']
	},

	'teorema-o-beskonechnosti-gorodovyh': {
		id: 'teorema-o-beskonechnosti-gorodovyh',
		term: 'Теорема о бесконечности городовых',
		short: String.raw`Сходится центр, стягивается радиус — сходится и точка в шаре.`,
		formula: String.raw`\lim f_n=f,\ \lim t_n=0,\ y_n\in\overline B_{t_n}(f_n)\ \Rightarrow\ \lim y_n=f`,
		body: String.raw`Теорема о сжатой последовательности в произвольном [[metricheskoe-prostranstvo|метрическом пространстве]]: если $\lim f_n=f$, $\lim t_n=0$ и $\forall n:\ \rho(f_n,y_n)\le t_n$, то $\lim y_n=f$. Отношение «между» в формулировке не участвует — его место занимают [[styagivayushchiesya-shary|стягивающиеся шары]].

Доказывается вставкой промежуточной точки по [[neravenstvo-treugolnika|неравенству треугольника]]: $\rho(f,y_n)\le\rho(f,f_n)+\rho(f_n,y_n)$, слагаемых два, поэтому $\varepsilon$ делится пополам: $$N_y(\varepsilon_y)=\max\Bigl(N_f\bigl(\tfrac{\varepsilon_y}{2}\bigr),N_t\bigl(\tfrac{\varepsilon_y}{2}\bigr)\Bigr).$$`,
		related: ['styagivayushchiesya-shary', 'zamknutyy-shar', 'neravenstvo-treugolnika', 'teorema-o-dvuh-gorodovyh']
	},

	'zamknutyy-shar': {
		id: 'zamknutyy-shar',
		term: 'Замкнутый шар',
		short: String.raw`$\overline B_r(x_0)=\{x:\rho(x,x_0)\le r\}$ — шар вместе со сферой.`,
		formula: String.raw`\overline B_r(x_0)=\{x\in M:\ \rho(x,x_0)\le r\}`,
		body: String.raw`**Замкнутый шар** отличается от [[shar|открытого]] одним знаком: граничная сфера включена, $\rho(x,x_0)\le r$ вместо $<r$. В $\mathbb R$ замкнутый шар — это отрезок $[x_0-r;x_0+r]$, а в $\mathbb R^2$ с $\rho_\infty$ — квадрат.

Черта сверху над шаром означает «замкнутый», тогда как над произвольным множеством $A$ запись $\overline A$ означает [[dopolnenie|дополнение]] $M\setminus A$ (замыкание пишется $\mathrm{cl}\,A$). Пример на различие: для $A=B_1(0)\subset\mathbb R$ дополнение $\overline A=(-\infty;-1]\cup[1;+\infty)$, а $\mathrm{cl}\,A=[-1;1]=\overline B_1(0)$.`,
		related: ['shar', 'metricheskoe-prostranstvo', 'styagivayushchiesya-shary', 'dopolnenie']
	},

	'styagivayushchiesya-shary': {
		id: 'styagivayushchiesya-shary',
		term: 'Стягивающиеся шары',
		short: String.raw`Шары $\overline B_{t_n}(f_n)$, у которых центр сходится, а радиус $t_n\to0$.`,
		formula: String.raw`\lim_{n\to\infty}f_n=f,\qquad \lim_{n\to\infty}t_n=0`,
		body: String.raw`Пара последовательностей — центров $f_n$ и радиусов $t_n\ge0$ — задаёт **стягивающиеся шары**, если $\lim f_n=f$ и $\lim t_n=0$, то есть радиус является [[beskonechno-malaya|бесконечно малой]].

Это метрическая замена «зажатости»: точку $y_n$ держит не пара соседей, а вся сфера радиуса $t_n$ вокруг $f_n$. Из $y_n\in\overline B_{t_n}(f_n)$ и стягивания следует $\lim y_n=f$ ([[teorema-o-beskonechnosti-gorodovyh|теорема о бесконечности городовых]]).`,
		related: ['zamknutyy-shar', 'teorema-o-beskonechnosti-gorodovyh', 'beskonechno-malaya']
	},

	shar: {
		id: 'shar',
		term: 'Открытый шар',
		short: String.raw`$B_r(x_0)=\{x:\rho(x,x_0)<r\}$ — база топологии, порождённой метрикой.`,
		formula: String.raw`B_r(x_0)=\{x\in M:\ \rho(x,x_0)<r\}`,
		body: String.raw`**Открытый шар** радиуса $r$ с центром $x_0$ — множество точек, удалённых от $x_0$ строго меньше чем на $r$. При $r=0$ он пуст, в отличие от [[zamknutyy-shar|замкнутого]]: $\overline B_0(x_0)=\{x_0\}$.

Через шары записывается [[predel-posledovatelnosti|предел]]: $f(n)\in B_\varepsilon(A)$. Форма шара зависит от метрики: в $\rho_2$ это круг, в [[metriki-rho|$\rho_\infty$]] — квадрат, в $\rho_1$ — ромб.`,
		related: ['zamknutyy-shar', 'metricheskoe-prostranstvo', 'predel-posledovatelnosti', 'metriki-rho']
	},

	'metricheskoe-prostranstvo': {
		id: 'metricheskoe-prostranstvo',
		term: 'Метрическое пространство',
		short: String.raw`Множество $M$ с функцией расстояния $\rho$; порядка на нём нет.`,
		formula: String.raw`\rho(x,y)\ge0,\quad \rho(x,y)=0\iff x=y,\quad \rho(x,y)=\rho(y,x)`,
		body: String.raw`Пара $(M,\rho)$, где $\rho:M\times M\to[0;+\infty)$ удовлетворяет неотрицательности с невырожденностью, симметричности и [[neravenstvo-treugolnika|неравенству треугольника]].

Ключевое для дня 14: метрика даёт **расстояние, но не порядок**. Поэтому фраза «$y$ лежит между $x$ и $z$» здесь не определена, и сжатость приходится переписывать через [[zamknutyy-shar|замкнутый шар]] со сходящимся центром и стягивающимся радиусом.`,
		related: ['neravenstvo-treugolnika', 'shar', 'normirovannoe-prostranstvo', 'metriki-rho']
	},

	'normirovannoe-prostranstvo': {
		id: 'normirovannoe-prostranstvo',
		term: 'Нормированное пространство',
		short: String.raw`Линейное пространство с нормой; метрика — $\rho(a,b)=\lVert a-b\rVert$.`,
		formula: String.raw`\rho(a,b)=\lVert a-b\rVert,\qquad \lVert a+b\rVert\le\lVert a\rVert+\lVert b\rVert`,
		body: String.raw`Пространство с нормой $\lVert\cdot\rVert$: неотрицательность с невырожденностью, однородность $\lVert\lambda a\rVert=|\lambda|\,\lVert a\rVert$ и неравенство треугольника. Всякое нормированное пространство — [[metricheskoe-prostranstvo|метрическое]] с $\rho(a,b)=\lVert a-b\rVert$; обратное неверно, метрика может не согласовываться ни с какой линейной структурой.

Линейная структура возвращает то, чего нет в метрике: выпуклые комбинации, а с ними — отрезок $[x;z]$ и осмысленное «между».`,
		related: ['metricheskoe-prostranstvo', 'neravenstvo-treugolnika', 'predel-posledovatelnosti']
	},

	'neravenstvo-treugolnika': {
		id: 'neravenstvo-treugolnika',
		term: 'Неравенство треугольника',
		short: String.raw`$\rho(x,z)\le\rho(x,y)+\rho(y,z)$ — крюк через промежуточную точку не короче.`,
		formula: String.raw`\rho(x,z)\le\rho(x,y)+\rho(y,z)`,
		body: String.raw`Третья аксиома метрики. Рабочий приём: чтобы оценить расстояние между двумя точками, вставляют **промежуточную** и оценивают два куска по отдельности.

Именно так доказывается [[teorema-o-beskonechnosti-gorodovyh|теорема о бесконечности городовых]] (промежуточная точка — центр $f_n$) и арифметика пределов. Слагаемых получается два, поэтому $\varepsilon$ делят пополам — отсюда $\varepsilon/2$ в [[n-ot-epsilon|формуле номера]]. В $\mathbb R$ это привычное $|a+b|\le|a|+|b|$.`,
		related: ['metricheskoe-prostranstvo', 'teorema-o-beskonechnosti-gorodovyh', 'n-ot-epsilon']
	},

	'n-ot-epsilon': {
		id: 'n-ot-epsilon',
		term: 'Номер N(ε) как функция',
		short: String.raw`Доказательство кончается формулой для $N$, а не словами «предел есть».`,
		formula: String.raw`N_{x+y}(\varepsilon)=\max\bigl(N_x(\tfrac\varepsilon2),\,N_y(\tfrac\varepsilon2)\bigr)`,
		body: String.raw`$N$ трактуется как **функция от $\varepsilon$**, а сам $\varepsilon$ — как ресурс, который распределяют между слагаемыми оценки. Эпсилоны и номера индексируются по объекту: $\varepsilon_x,N_x$, $\varepsilon_y,N_y$.

Маркер для самопроверки: $\max$ без деления $\varepsilon$ означает, что работала транзитивность порядка ([[teorema-o-dvuh-gorodovyh|два городовых]]); $\varepsilon/2$ — что работало [[neravenstvo-treugolnika|неравенство треугольника]] и слагаемых было два.`,
		related: ['predel-posledovatelnosti', 'teorema-o-dvuh-gorodovyh', 'neravenstvo-treugolnika']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`$\forall\varepsilon>0\ \exists N\ \forall n>N:\ \rho(f(n),A)<\varepsilon$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1\ \forall n>N:\ \rho(f(n),A)<\varepsilon`,
		body: String.raw`Определение записывается в пяти эквивалентных формах — через метрику $\rho$, через норму, через [[shar|открытый шар]] ($f(n)\in B_\varepsilon(A)$), через [[vykolotaya-okrestnost|выколотую окрестность]] и школьной записью с модулем, которая является вещественным частным случаем первой.

Доказательство сходимости считается законченным только с явной формулой [[n-ot-epsilon|$N(\varepsilon)$]]: «значит, предел существует» не принимается.`,
		related: ['shar', 'n-ot-epsilon', 'obobshchennaya-posledovatelnost', 'vykolotaya-okrestnost']
	},

	'obobshchennaya-posledovatelnost': {
		id: 'obobshchennaya-posledovatelnost',
		term: 'Обобщённая последовательность',
		short: String.raw`Отображение $f:\mathbb N_1\to M$ в метрическое пространство, а не сеть (net).`,
		formula: String.raw`f:\mathbb N_1\to M,\qquad (M,\rho)`,
		body: String.raw`**Обобщённой последовательностью** называется отображение $f:\mathbb N_1\to M$, где $M$ — [[metricheskoe-prostranstvo|метрическое пространство]] вместо $\mathbb R$. Область определения остаётся прежней ([[n-nol-n-odin|натуральные без нуля]]), обобщается только область значений. Предел в $M$ обозначается строчной буквой ($\lim x_n=a$), вещественный — заглавной ($=A$).

Термин **сеть** (net) обозначает другую конструкцию: отображение произвольного направленного множества. Различающий пример: система окрестностей точки, упорядоченная по обратному включению, — направленное множество, но не $\mathbb N_1$, и определённая на нём сеть обобщённой последовательностью не является.`,
		related: ['metricheskoe-prostranstvo', 'predel-posledovatelnosti', 'n-nol-n-odin']
	},

	'beskonechno-malaya': {
		id: 'beskonechno-malaya',
		term: 'Бесконечно малая последовательность',
		short: String.raw`Последовательность с нулевым пределом; эталон — $1/n^4$.`,
		formula: String.raw`\forall\varepsilon_f>0\ \exists N_f\ \forall n>N_f:\ |f_n|<\varepsilon_f`,
		body: String.raw`**Бесконечно малая (б.м.)** — последовательность, предел которой равен нулю. Рабочая запись: $|f_n|<\varepsilon_f$ при $n>N_f(\varepsilon_f)$; эталонный пример — $f_n=1/n^4$.

В теореме дня 14 радиус $t_n$ — именно б.м., причём неотрицательная, поэтому модуль снимается: $|t_n-0|=t_n$. Свойства б.м. и связанные с ними [[asimptoticheskie-klassy|асимптотические классы]] разбираются в днях 15–17.`,
		related: ['predel-posledovatelnosti', 'styagivayushchiesya-shary', 'asimptoticheskie-klassy']
	}
};
