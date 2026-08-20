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

	'styagivayushchiesya-shary': {
		id: 'styagivayushchiesya-shary',
		term: 'Стягивающиеся шары',
		short: String.raw`Шары $\overline B_{t_n}(f_n)$, у которых центр сходится, а радиус $t_n\to0$.`,
		formula: String.raw`\lim_{n\to\infty}f_n=f,\qquad \lim_{n\to\infty}t_n=0`,
		body: String.raw`Пара последовательностей — центров $f_n$ и радиусов $t_n\ge0$ — задаёт **стягивающиеся шары**, если $\lim f_n=f$ и $\lim t_n=0$, то есть радиус является [[beskonechno-malaya|бесконечно малой]].

Это метрическая замена «зажатости»: точку $y_n$ держит не пара соседей, а вся сфера радиуса $t_n$ вокруг $f_n$. Из $y_n\in\overline B_{t_n}(f_n)$ и стягивания следует $\lim y_n=f$ ([[teorema-o-beskonechnosti-gorodovyh|теорема о бесконечности городовых]]).`,
		related: ['zamknutyy-shar', 'teorema-o-beskonechnosti-gorodovyh', 'beskonechno-malaya']
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
