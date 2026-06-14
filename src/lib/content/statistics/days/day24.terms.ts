import type { Glossary } from '$lib/types';

// Новые термины дня 24 (возвратность блужданий по решёткам). Базовые
// lineynost-ozhidaniya и geometricheskoe-raspredelenie уже определены в
// ранних днях и переиспользуются по id.
export const day24Terms: Glossary = {
	vozvratnost: {
		id: 'vozvratnost',
		term: 'Возвратность состояния',
		short: String.raw`Состояние возвратно, если $f_{ii}=1$ — цепь вернётся в него наверняка.`,
		formula: String.raw`f_{ii}=P(\tau_i<\infty\mid X_0=u_i)`,
		body: String.raw`Состояние $u_i$ [[cep-markova|цепи Маркова]] **возвратно** (рекуррентно), если вероятность когда-либо вернуться в него $f_{ii}=1$, и **невозвратно** (транзиентно), если $f_{ii}<1$.

При возвратности цепь посещает $u_i$ бесконечно часто; при невозвратности — конечное число раз (в среднем $1/(1-f_{ii})$). Свойство постоянно внутри [[soobshchayushchiesya-sostoyaniya|класса сообщения]]. Проверяется [[kriteriy-vozvratnosti|критерием возвратности]].`,
		related: ['kriteriy-vozvratnosti', 'moment-pervogo-vozvrashcheniya', 'cep-markova', 'srednee-vremya-vozvrashcheniya']
	},

	'kriteriy-vozvratnosti': {
		id: 'kriteriy-vozvratnosti',
		term: 'Критерий возвратности',
		short: String.raw`$u_i$ возвратно $\iff$ ряд $\sum_t p_{ii}^{(t)}$ расходится.`,
		formula: String.raw`\sum_{t\ge1} p_{ii}^{(t)}=\infty \iff \text{возвратно}`,
		body: String.raw`Состояние $u_i$ [[vozvratnost|возвратно]] тогда и только тогда, когда расходится ряд из вероятностей возвращения за $t$ шагов $\sum_{t\ge1} p_{ii}^{(t)}=\infty$; и невозвратно, когда ряд сходится.

Доказательство связывает сумму со средним числом посещений: $\sum_{t\ge0} p_{ii}^{(t)}=MN$, а число посещений [[geometricheskoe-raspredelenie|геометрически]] распределено с параметром $f_{ii}$. Критерий чисто аналитический — сводит возвратность к сходимости числового ряда.`,
		related: ['vozvratnost', 'sluchaynoe-bluzhdanie', 'teorema-poyya', 'formula-stirlinga']
	},

	'cep-markova': {
		id: 'cep-markova',
		term: 'Цепь Маркова',
		short: String.raw`Случайный процесс, где будущее зависит от прошлого только через настоящее.`,
		formula: String.raw`P(X_{t+1}=u_j\mid X_t=u_i,\dots)=p_{ij}`,
		body: String.raw`**Цепь Маркова** — последовательность случайных состояний $X_0,X_1,\dots$ с **марковским свойством**: распределение следующего состояния зависит лишь от текущего, а не от всей предыстории. Однородная цепь задаётся [[matrica-perehoda|матрицей перехода]] $P=(p_{ij})$.

Вероятности за $t$ шагов — элементы $P^t$, они подчинены уравнению Колмогорова–Чепмена $p_{ij}^{(t+s)}=\sum_k p_{ik}^{(t)}p_{kj}^{(s)}$.`,
		related: ['matrica-perehoda', 'soobshchayushchiesya-sostoyaniya', 'vozvratnost', 'silnoe-markovskoe-svoystvo']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Стохастическая матрица $P=(p_{ij})$ вероятностей перехода за один шаг.`,
		formula: String.raw`p_{ij}\ge0,\quad \sum_j p_{ij}=1`,
		body: String.raw`**Матрица перехода** $P$ однородной [[cep-markova|цепи Маркова]] состоит из вероятностей $p_{ij}=P(X_{t+1}=u_j\mid X_t=u_i)$. Она **стохастическая**: элементы неотрицательны, а сумма по каждой строке равна $1$.

Вероятности перехода за $t$ шагов — элементы степени $P^t$.`,
		related: ['cep-markova']
	},

	'soobshchayushchiesya-sostoyaniya': {
		id: 'soobshchayushchiesya-sostoyaniya',
		term: 'Сообщающиеся состояния',
		short: String.raw`$u_i\leftrightarrow u_j$: достижимы друг из друга за конечное число шагов.`,
		formula: String.raw`u_i\to u_j\ \text{и}\ u_j\to u_i`,
		body: String.raw`Состояние $u_j$ **достижимо** из $u_i$ ($u_i\to u_j$), если $p_{ij}^{(t)}>0$ при некотором $t\ge0$. Состояния **сообщаются** ($u_i\leftrightarrow u_j$), если достижимы взаимно.

Это отношение эквивалентности; оно разбивает состояния на **классы**. Многие свойства ([[vozvratnost|возвратность]], период) постоянны внутри класса.`,
		related: ['neprivodimaya-cep', 'cep-markova', 'vozvratnost']
	},

	'neprivodimaya-cep': {
		id: 'neprivodimaya-cep',
		term: 'Неприводимая цепь',
		short: String.raw`Все состояния образуют один класс — любые два сообщаются.`,
		body: String.raw`[[cep-markova|Цепь Маркова]] **неприводима** (неразложима), если все состояния [[soobshchayushchiesya-sostoyaniya|сообщаются]] друг с другом, то есть образуют единственный класс. Иначе цепь приводима.

В неприводимой цепи [[vozvratnost|возвратность]] едина для всех состояний; конечная неприводимая цепь всегда возвратна.`,
		related: ['soobshchayushchiesya-sostoyaniya', 'cep-markova', 'vozvratnost']
	},

	'silnoe-markovskoe-svoystvo': {
		id: 'silnoe-markovskoe-svoystvo',
		term: 'Сильное марковское свойство',
		short: String.raw`Цепь «забывает прошлое» не только в фиксированный момент, но и в момент остановки.`,
		body: String.raw`**Сильное марковское свойство**: если $\tau$ — [[moment-ostanovki|момент остановки]] и $\tau<\infty$, то при условии $X_\tau=u_i$ дальнейший процесс $X_\tau,X_{\tau+1},\dots$ — снова [[cep-markova|цепь Маркова]] с той же матрицей $P$, стартующая из $u_i$ и не зависящая от прошлого.

Это позволяет трактовать траекторию как серию независимых одинаковых «экскурсий» из состояния и обратно — ключ к выводу [[kriteriy-vozvratnosti|критерия возвратности]].`,
		related: ['moment-ostanovki', 'cep-markova', 'vozvratnost']
	},

	'moment-ostanovki': {
		id: 'moment-ostanovki',
		term: 'Момент остановки',
		short: String.raw`Случайный момент $\tau$, определяемый только прошлым и настоящим.`,
		formula: String.raw`\{\tau=t\}\ \text{зависит лишь от}\ X_0,\dots,X_t`,
		body: String.raw`Случайная величина $\tau\in\{0,1,2,\dots\}\cup\{\infty\}$ — **момент остановки**, если для каждого $t$ событие $\{\tau=t\}$ определяется только наблюдениями $X_0,\dots,X_t$ (чтобы понять, наступил ли момент, не нужно знать будущее).

Пример — [[moment-pervogo-vozvrashcheniya|момент первого возвращения]]. На таких моментах работает [[silnoe-markovskoe-svoystvo|сильное марковское свойство]].`,
		related: ['silnoe-markovskoe-svoystvo', 'moment-pervogo-vozvrashcheniya']
	},

	'moment-pervogo-vozvrashcheniya': {
		id: 'moment-pervogo-vozvrashcheniya',
		term: 'Момент первого возвращения',
		short: String.raw`$\tau_i=\min\{t\ge1: X_t=u_i\}$ — первый шаг возврата в $u_i$.`,
		formula: String.raw`\tau_i=\min\{t\ge1: X_t=u_i\}`,
		body: String.raw`**Момент первого возвращения** в состояние $u_i$ — это $\tau_i=\min\{t\ge1: X_t=u_i\}$. Через него определяется вероятность возврата $f_{ii}=P(\tau_i<\infty\mid X_0=u_i)$ и [[srednee-vremya-vozvrashcheniya|среднее время возвращения]] $\mu_i=M(\tau_i\mid X_0=u_i)$.

Это [[moment-ostanovki|момент остановки]]: событие $\{\tau_i=t\}$ зависит лишь от $X_1,\dots,X_t$.`,
		related: ['vozvratnost', 'srednee-vremya-vozvrashcheniya', 'moment-ostanovki']
	},

	'srednee-vremya-vozvrashcheniya': {
		id: 'srednee-vremya-vozvrashcheniya',
		term: 'Среднее время возвращения',
		short: String.raw`$\mu_i=M\tau_i$; конечно — положительная возвратность, бесконечно — нулевая.`,
		formula: String.raw`\mu_i=M(\tau_i\mid X_0=u_i)`,
		body: String.raw`Для [[vozvratnost|возвратного]] состояния $\mu_i=M(\tau_i\mid X_0=u_i)$ — среднее время до первого возвращения. Если $\mu_i<\infty$, состояние **положительно возвратно** (ненулевое); если $\mu_i=\infty$ — **нуль-возвратно**.

Нулевая возвратность возможна лишь при счётном числе состояний (как блуждание на $\mathbb Z^2$). Для эргодической цепи $\mu_i=1/\omega_i$, где $\omega$ — стационарное распределение.`,
		related: ['vozvratnost', 'moment-pervogo-vozvrashcheniya', 'sluchaynoe-bluzhdanie']
	},

	'sluchaynoe-bluzhdanie': {
		id: 'sluchaynoe-bluzhdanie',
		term: 'Случайное блуждание',
		short: String.raw`Частица на $\mathbb Z^d$ равновероятно прыгает в один из $2d$ соседей.`,
		formula: String.raw`P(\text{шаг по оси})=\tfrac1{2d}`,
		body: String.raw`Простое симметричное **случайное блуждание** на решётке $\mathbb Z^d$ — [[cep-markova|цепь Маркова]], где из каждого узла частица равновероятно (с вероятностью $\tfrac1{2d}$) перемещается в один из $2d$ соседних узлов вдоль осей.

Это [[neprivodimaya-cep|неприводимая]] цепь; её [[vozvratnost|возвратность]] описывает [[teorema-poyya|теорема Пойа]].`,
		related: ['teorema-poyya', 'kriteriy-vozvratnosti', 'cep-markova', 'markovskaya-cep-monte-karlo']
	},

	'teorema-poyya': {
		id: 'teorema-poyya',
		term: 'Теорема Пойа',
		short: String.raw`Блуждание на $\mathbb Z^d$ возвратно при $d=1,2$ и невозвратно при $d\ge3$.`,
		formula: String.raw`p_{\mathbf 0\mathbf 0}^{(2t)}\sim C_d\,t^{-d/2}`,
		body: String.raw`**Теорема Пойа**: простое симметричное [[sluchaynoe-bluzhdanie|случайное блуждание]] на $\mathbb Z^d$ возвратно при $d=1$ и $d=2$ и невозвратно при $d\ge3$.

Доказательство — [[kriteriy-vozvratnosti|критерий возвратности]] для $\sum_t p_{\mathbf 0\mathbf 0}^{(2t)}$ с асимптотикой $p_{\mathbf 0\mathbf 0}^{(2t)}\sim C_d t^{-d/2}$: [[obobshchyonnyy-garmonicheskiy-ryad|ряд]] $\sum t^{-d/2}$ расходится при $d\le2$ и сходится при $d\ge3$. Образ Какутани: «пьяница вернётся домой, а пьяная птица — нет».`,
		related: ['sluchaynoe-bluzhdanie', 'kriteriy-vozvratnosti', 'obobshchyonnyy-garmonicheskiy-ryad', 'formula-stirlinga']
	},

	'formula-stirlinga': {
		id: 'formula-stirlinga',
		term: 'Формула Стирлинга',
		short: String.raw`$n!\sim\sqrt{2\pi n}\,(n/e)^n$ — асимптотика факториала.`,
		formula: String.raw`n!\sim\sqrt{2\pi n}\,(n/e)^n`,
		body: String.raw`**Формула Стирлинга** даёт асимптотику факториала при больших $n$: $n!\sim\sqrt{2\pi n}\,(n/e)^n$.

Из неё получают асимптотику центрального биномиального коэффициента $C_{2t}^{\,t}2^{-2t}\sim 1/\sqrt{\pi t}$, на которой держится оценка $p_{\mathbf 0\mathbf 0}^{(2t)}$ в [[teorema-poyya|теореме Пойа]].`,
		related: ['teorema-poyya', 'kriteriy-vozvratnosti']
	},

	'obobshchyonnyy-garmonicheskiy-ryad': {
		id: 'obobshchyonnyy-garmonicheskiy-ryad',
		term: 'Обобщённый гармонический ряд',
		short: String.raw`Ряд $\sum t^{-p}$ сходится при $p>1$ и расходится при $p\le1$.`,
		formula: String.raw`\sum_{t\ge1} t^{-p}<\infty \iff p>1`,
		body: String.raw`**Обобщённый гармонический ряд** (ряд Дирихле) $\sum_{t\ge1} t^{-p}$ сходится тогда и только тогда, когда $p>1$; при $p\le1$ (в частности гармонический $p=1$) расходится.

Именно он решает [[teorema-poyya|теорему Пойа]]: показатель $p=d/2$ переходит границу $1$ ровно между $d=2$ (расходится) и $d=3$ (сходится).`,
		related: ['teorema-poyya', 'kriteriy-vozvratnosti']
	},

	'markovskaya-cep-monte-karlo': {
		id: 'markovskaya-cep-monte-karlo',
		term: 'MCMC',
		short: String.raw`Сэмплирование через марковскую цепь со стационарным целевым распределением.`,
		body: String.raw`**MCMC** (Markov Chain Monte Carlo) — методы сэмплирования (Metropolis–Hastings, Gibbs), строящие [[cep-markova|цепь Маркова]], стационарное распределение которой совпадает с целевым (например, апостериорным).

[[vozvratnost|Возвратность]] и неприводимость гарантируют, что сэмплер бесконечно часто посещает все области и выборка состоятельна — прямое применение теории этого дня.`,
		related: ['cep-markova', 'sluchaynoe-bluzhdanie', 'vozvratnost', 'importance-sampling']
	},

	'fundamentalnaya-matrica': {
		id: 'fundamentalnaya-matrica',
		term: 'Фундаментальная матрица',
		short: String.raw`$N=(I-Q)^{-1}=\sum_s Q^s$ — средние числа посещений в поглощающей цепи.`,
		formula: String.raw`N=(I-Q)^{-1}=\sum_{s=0}^{\infty}Q^s`,
		body: String.raw`Для поглощающей [[cep-markova|цепи Маркова]] с блоком переходов между невозвратными состояниями $Q$ существует **фундаментальная матрица** $N=(I-Q)^{-1}=\sum_{s\ge0}Q^s$.

Элемент $(i,j)$ матрицы $N$ — среднее число посещений невозвратного состояния $u_j$ при старте из $u_i$, а сумма $i$-й строки — среднее время до поглощения. Это матричный аналог формулы $\sum_t p_{ii}^{(t)}=MN$ из [[kriteriy-vozvratnosti|критерия возвратности]].`,
		related: ['cep-markova', 'kriteriy-vozvratnosti', 'srednee-vremya-vozvrashcheniya']
	},

	'importance-sampling': {
		id: 'importance-sampling',
		term: 'Importance sampling',
		short: String.raw`Оценка интеграла сэмплированием из вспомогательного распределения с перевзвешиванием.`,
		formula: String.raw`M_p[f]=M_q\!\left[f\,\tfrac{p}{q}\right]`,
		body: String.raw`**Importance sampling** — приём Монте-Карло: вместо сэмплирования из «трудного» распределения $p$ берут выборку из удобного $q$ и компенсируют весами $p/q$. Полезно, когда наивное блуждание плохо покрывает важные области (в т.ч. в высоких размерностях, где случайный поиск [[vozvratnost|невозвратен]]).

Дополняет [[markovskaya-cep-monte-karlo|MCMC]] как направленный способ концентрировать выборку.`,
		related: ['markovskaya-cep-monte-karlo', 'sluchaynoe-bluzhdanie']
	}
};
