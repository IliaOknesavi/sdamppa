import type { Glossary } from '$lib/types';

// New terms introduced on day 23 (ch16): recurrence of Markov chains — the
// first authored day of the "markov" phase, so it seeds the chain vocabulary
// (chain, transition matrix, Chapman–Kolmogorov, communicating classes) plus
// the day's core: recurrence, the recurrence criterion and Pólya's theorem.
// Extends the base graph from glossary.ts; cross-linked via [[id]] and `related`.
export const day23Terms: Glossary = {
	'cep-markova': {
		id: 'cep-markova',
		term: 'Цепь Маркова',
		short: String.raw`Случайный процесс, где будущее зависит от прошлого только через настоящее.`,
		formula: String.raw`P(X_{t+1}=u_j\mid X_t=u_i)=p_{ij}`,
		body: String.raw`**Цепь Маркова** — последовательность состояний $X_0,X_1,X_2,\dots$ из множества $S=\{u_1,u_2,\dots\}$ с **марковским свойством**: $$P(X_{t+1}=u_j\mid X_0,\dots,X_t=u_i)=P(X_{t+1}=u_j\mid X_t=u_i)=p_{ij}.$$ Будущее зависит от прошлого только через настоящее. Динамика однородной цепи полностью задаётся [[matrica-perehoda|матрицей перехода]] $P=(p_{ij})$.`,
		related: ['matrica-perehoda', 'uravnenie-km', 'vozvratnost', 'soobshchayushchiesya']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Стохастическая матрица $P=(p_{ij})$ вероятностей перехода за один шаг.`,
		formula: String.raw`p_{ij}\ge0,\quad \textstyle\sum_j p_{ij}=1`,
		body: String.raw`**Матрица перехода** $P=(p_{ij})$ [[cep-markova|цепи Маркова]] содержит вероятности $p_{ij}=P(X_{t+1}=u_j\mid X_t=u_i)$. Она **стохастическая**: все элементы неотрицательны, а сумма по каждой строке равна $1$. Вероятности перехода за $t$ шагов $p_{ij}^{(t)}$ — это элементы степени $P^t$ ([[uravnenie-km|уравнение Колмогорова–Чепмена]]).`,
		related: ['cep-markova', 'uravnenie-km', 'statsionarnoe-raspredelenie']
	},

	'uravnenie-km': {
		id: 'uravnenie-km',
		term: 'Уравнение Колмогорова–Чепмена',
		short: String.raw`$p_{ij}^{(t+s)}=\sum_k p_{ik}^{(t)}p_{kj}^{(s)}$, то есть $P^{(t+s)}=P^tP^s$.`,
		formula: String.raw`p_{ij}^{(t+s)}=\sum_k p_{ik}^{(t)}\,p_{kj}^{(s)}`,
		body: String.raw`**Уравнение Колмогорова–Чепмена** связывает вероятности перехода за разное число шагов: $$p_{ij}^{(t+s)}=\sum_{k} p_{ik}^{(t)}\,p_{kj}^{(s)},\qquad P^{(t+s)}=P^t\,P^s.$$ Чтобы попасть из $u_i$ в $u_j$ за $t+s$ шагов, надо за $t$ шагов оказаться в каком-то промежуточном $u_k$, а оттуда за $s$ шагов дойти до $u_j$. Следствие: $p_{ij}^{(t)}$ — элементы $t$-й степени [[matrica-perehoda|матрицы перехода]] $P^t$.`,
		related: ['matrica-perehoda', 'cep-markova', 'kriteriy-vozvratnosti']
	},

	soobshchayushchiesya: {
		id: 'soobshchayushchiesya',
		term: 'Сообщающиеся состояния',
		short: String.raw`Достижимы друг из друга; разбивают состояния на классы.`,
		formula: String.raw`u_i\leftrightarrow u_j`,
		body: String.raw`Состояние $u_j$ **достижимо** из $u_i$ ($u_i\to u_j$), если $p_{ij}^{(t)}>0$ при некотором $t\ge0$. Состояния **сообщаются** ($u_i\leftrightarrow u_j$), если достижимы друг из друга. Отношение $\leftrightarrow$ — отношение эквивалентности, оно разбивает $S$ на непересекающиеся **классы сообщающихся состояний**. Многие свойства ([[vozvratnost|возвратность]], период) постоянны внутри класса — это [[svoystvo-klassa|свойства класса]].`,
		related: ['cep-markova', 'nepricodimaya', 'svoystvo-klassa']
	},

	nepricodimaya: {
		id: 'nepricodimaya',
		term: 'Неприводимая цепь',
		short: String.raw`Все состояния сообщаются — один класс на всю цепь.`,
		body: String.raw`Цепь **неприводима** (неразложима), если любые два состояния [[soobshchayushchiesya|сообщаются]]: $u_i\leftrightarrow u_j$ для всех $i,j$. Тогда вся цепь — один класс, и [[svoystvo-klassa|свойства класса]] (возвратность, период) одинаковы для всех состояний. Поэтому у неприводимой цепи возвратность исследуется по одному любому состоянию. Конечная неприводимая цепь всегда [[vozvratnost|возвратна]].`,
		related: ['soobshchayushchiesya', 'vozvratnost', 'statsionarnoe-raspredelenie']
	},

	'svoystvo-klassa': {
		id: 'svoystvo-klassa',
		term: 'Свойство класса',
		short: String.raw`Характеристика, постоянная внутри класса сообщающихся состояний.`,
		body: String.raw`**Свойством класса** называют характеристику состояния, которая одинакова у всех [[soobshchayushchiesya|сообщающихся]] между собой состояний. Таковы [[vozvratnost|возвратность/невозвратность]], период, тип «нулевое/ненулевое». Практическая польза: чтобы определить свойство для целого класса (или всей [[nepricodimaya|неприводимой цепи]]), достаточно проверить его у одного представителя.`,
		related: ['soobshchayushchiesya', 'nepricodimaya', 'vozvratnost']
	},

	'moment-ostanovki': {
		id: 'moment-ostanovki',
		term: 'Момент остановки',
		short: String.raw`Случайный момент $\tau$, наступление которого видно «без заглядывания в будущее».`,
		formula: String.raw`\{\tau=t\}\ \text{зависит лишь от}\ X_0,\dots,X_t`,
		body: String.raw`**Момент остановки** — случайная величина $\tau$ со значениями в $\{0,1,2,\dots\}\cup\{\infty\}$, для которой событие $\{\tau=t\}$ определяется только наблюдениями $X_0,\dots,X_t$ (не нужно знать будущее). Пример — момент первого возвращения $\tau_i=\min\{t\ge1:X_t=u_i\}$. На таких моментах работает [[silnoe-markovskoe|сильное марковское свойство]], что и позволяет анализировать [[vozvratnost|возвратность]].`,
		related: ['silnoe-markovskoe', 'vozvratnost']
	},

	'silnoe-markovskoe': {
		id: 'silnoe-markovskoe',
		term: 'Сильное марковское свойство',
		short: String.raw`Цепь «начинается заново» не только в фиксированные, но и в моменты остановки.`,
		body: String.raw`**Сильное марковское свойство:** если $\tau$ — [[moment-ostanovki|момент остановки]] и $\tau<\infty$, $X_\tau=u_i$, то процесс $X_\tau,X_{\tau+1},\dots$ — снова [[cep-markova|цепь Маркова]] с той же [[matrica-perehoda|матрицей перехода]], стартующая из $u_i$ и не зависящая от прошлого. Содержательно: попав в $u_i$, цепь «забывает» прошлое и начинается заново. Именно поэтому возвращения в $u_i$ независимы, а их число геометрически распределено — основа [[kriteriy-vozvratnosti|критерия возвратности]].`,
		related: ['moment-ostanovki', 'vozvratnost', 'kriteriy-vozvratnosti']
	},

	vozvratnost: {
		id: 'vozvratnost',
		term: 'Возвратность',
		short: String.raw`Возвратно ($f_{ii}=1$) — возвращается всегда; невозвратно ($f_{ii}<1$) — может уйти навсегда.`,
		formula: String.raw`f_{ii}=P(\tau_i<\infty\mid X_0=u_i)`,
		body: String.raw`Пусть $f_{ii}$ — вероятность когда-либо вернуться в $u_i$, выйдя из него. Состояние **возвратно** (рекуррентно), если $f_{ii}=1$, и **невозвратно** (транзиентно), если $f_{ii}<1$. У возвратного состояния цепь возвращается бесконечно часто; у невозвратного число возвращений конечно (геометрично, среднее число посещений $\frac1{1-f_{ii}}$). Возвратность — [[svoystvo-klassa|свойство класса]] и проверяется [[kriteriy-vozvratnosti|критерием]] $\sum_t p_{ii}^{(t)}=\infty$.`,
		related: ['kriteriy-vozvratnosti', 'polozhitelnaya-vozvratnost', 'silnoe-markovskoe', 'svoystvo-klassa']
	},

	'kriteriy-vozvratnosti': {
		id: 'kriteriy-vozvratnosti',
		term: 'Критерий возвратности',
		short: String.raw`$u_i$ возвратно $\iff$ ряд $\sum_t p_{ii}^{(t)}$ расходится.`,
		formula: String.raw`\sum_{t=1}^{\infty} p_{ii}^{(t)}=\infty`,
		body: String.raw`**Критерий возвратности:** состояние $u_i$ [[vozvratnost|возвратно]] тогда и только тогда, когда ряд из вероятностей нахождения в нём расходится: $$\sum_{t=1}^{\infty} p_{ii}^{(t)}=\infty,$$ и невозвратно, когда ряд сходится. Доказывается через ожидаемое число посещений: $1+\sum_t p_{ii}^{(t)}=\frac1{1-f_{ii}}$. Поскольку $p_{ii}^{(t)}$ — диагональ степеней [[matrica-perehoda|матрицы перехода]], критерий сводит возвратность к анализу асимптотики ряда (см. [[teorema-poya|теорему Пойа]]).`,
		related: ['vozvratnost', 'teorema-poya', 'uravnenie-km', 'silnoe-markovskoe']
	},

	'polozhitelnaya-vozvratnost': {
		id: 'polozhitelnaya-vozvratnost',
		term: 'Положительная возвратность',
		short: String.raw`Возвратность с конечным средним временем возвращения $\mu_i<\infty$.`,
		formula: String.raw`\mu_i=M(\tau_i\mid X_0=u_i)<\infty`,
		body: String.raw`Возвратное состояние **положительно возвратно** (ненулевое), если среднее время возвращения $\mu_i=M(\tau_i\mid X_0=u_i)$ конечно, и **нуль-возвратно**, если $\mu_i=\infty$. Нуль-возвратность возможна лишь при счётном числе состояний; в конечной цепи всякое [[vozvratnost|возвратное]] состояние положительно возвратно. Для положительно возвратного апериодического состояния существует [[statsionarnoe-raspredelenie|стационарное распределение]] и $\mu_i=1/\omega_i$.`,
		related: ['vozvratnost', 'statsionarnoe-raspredelenie']
	},

	'sluchaynoe-bluzhdanie': {
		id: 'sluchaynoe-bluzhdanie',
		term: 'Случайное блуждание',
		short: String.raw`Частица на решётке $\mathbb Z^d$ равновероятно шагает к одному из соседей.`,
		formula: String.raw`P(\text{шаг к соседу})=\tfrac{1}{2d}`,
		body: String.raw`**Простое симметричное случайное блуждание** на $\mathbb Z^d$ — [[cep-markova|цепь Маркова]], в которой частица на каждом шаге равновероятно перемещается в один из $2d$ соседних узлов (вдоль каждой из $d$ осей в обе стороны с вероятностью $\tfrac1{2d}$). Это [[nepricodimaya|неприводимая]] цепь; её [[vozvratnost|возвратность]] зависит от размерности — см. [[teorema-poya|теорему Пойа]].`,
		related: ['teorema-poya', 'cep-markova', 'kriteriy-vozvratnosti']
	},

	'teorema-poya': {
		id: 'teorema-poya',
		term: 'Теорема Пойа',
		short: String.raw`Блуждание на $\mathbb Z^d$ возвратно при $d\le2$ и невозвратно при $d\ge3$.`,
		formula: String.raw`p_{00}^{(2t)}\sim C_d\,t^{-d/2}`,
		body: String.raw`**Теорема Пойа:** простое симметричное [[sluchaynoe-bluzhdanie|случайное блуждание]] на $\mathbb Z^d$ возвратно при $d=1,2$ и невозвратно при $d\ge3$. Доказывается [[kriteriy-vozvratnosti|критерием возвратности]]: $p_{00}^{(2t)}\sim C_d\,t^{-d/2}$, а ряд $\sum_t t^{-d/2}$ расходится при $d\le2$ и сходится при $d\ge3$. Народная форма (Какутани): «пьяница вернётся домой, а пьяная птица — нет».`,
		related: ['kriteriy-vozvratnosti', 'sluchaynoe-bluzhdanie', 'vozvratnost']
	},

	'statsionarnoe-raspredelenie': {
		id: 'statsionarnoe-raspredelenie',
		term: 'Стационарное распределение',
		short: String.raw`Вектор $\omega$ с $\omega P=\omega$, $\sum_i\omega_i=1$ — неизменный во времени.`,
		formula: String.raw`\omega P=\omega,\quad \textstyle\sum_i\omega_i=1`,
		body: String.raw`**Стационарное распределение** [[cep-markova|цепи]] — вероятностный вектор $\omega$, который не меняется под действием [[matrica-perehoda|матрицы перехода]]: $\omega P=\omega$ и $\sum_i\omega_i=1$. Если цепь стартует из $\omega$, распределение остаётся $\omega$ на всех шагах. Для [[nepricodimaya|неприводимой]] [[polozhitelnaya-vozvratnost|положительно возвратной]] апериодической цепи $\omega$ единственно, $P^t$ сходится к матрице со строками $\omega$, а среднее время возвращения $\mu_i=1/\omega_i$. На этом стоит MCMC.`,
		related: ['matrica-perehoda', 'polozhitelnaya-vozvratnost', 'nepricodimaya']
	},

	'lineynost-ozhidaniya': {
		id: 'lineynost-ozhidaniya',
		term: 'Линейность математического ожидания',
		short: String.raw`$M(aX+bY+c)=a\,MX+b\,MY+c$ — без предположения о независимости.`,
		formula: String.raw`M(aX+bY+c)=a\,MX+b\,MY+c`,
		body: String.raw`Оператор математического ожидания **линеен**: для постоянных $a,b,c$ $$M(aX+bY+c)=a\,MX+b\,MY+c.$$ Главное — $M(X+Y)=MX+MY$ верно **без** предположения о независимости. В выводе [[kriteriy-vozvratnosti|критерия возвратности]] именно линейность позволяет посчитать ожидаемое число посещений как сумму вероятностей: $M\sum_t\mathbf 1\{X_t=u_i\}=\sum_t p_{ii}^{(t)}$.`,
		related: ['kriteriy-vozvratnosti']
	}
};
