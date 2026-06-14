import type { Glossary } from '$lib/types';

// New terms introduced on day 27 (ch18): continuous-time Markov processes —
// Poisson-driven transitions, Kolmogorov equations and final (stationary)
// probabilities. Extends the base graph from glossary.ts; cross-linked via
// [[id]] inside bodies and `related`.
export const day27Terms: Glossary = {
	'markovskiy-process': {
		id: 'markovskiy-process',
		term: 'Марковский процесс',
		short: String.raw`Случайный процесс без последействия: будущее зависит только от настоящего.`,
		body: String.raw`**Марковский процесс** — случайный процесс, для которого распределение будущего зависит лишь от текущего состояния, но не от всей предыстории (свойство отсутствия последействия). Время может быть дискретным ([[markovskaya-cep|цепь Маркова]]) или непрерывным ([[markovskiy-process-nepreryvnyy|процесс с непрерывным временем]]).`,
		related: ['markovskaya-cep', 'markovskiy-process-nepreryvnyy', 'matrica-perehoda']
	},

	'markovskiy-process-nepreryvnyy': {
		id: 'markovskiy-process-nepreryvnyy',
		term: 'Процесс с непрерывным временем',
		short: String.raw`Марковский процесс, переходы которого вызываются пуассоновскими потоками.`,
		body: String.raw`**Марковский процесс с непрерывным временем** и дискретным множеством состояний $E_1,\dots,E_n$ — это [[markovskiy-process|процесс]], в котором переход $E_i\to E_j$ совершается в момент очередного события [[puassonovskiy-potok|пуассоновского потока]] [[intensivnost-perehoda|интенсивности]] $\lambda_{ij}$. Вероятность перехода за малое $\Delta t$ равна $\lambda_{ij}\Delta t+o(\Delta t)$.

Эволюция вероятностей состояний $P_i(t)$ описывается [[uravneniya-kolmogorova|уравнениями Колмогорова]], а долгосрочный режим — [[finalnye-veroyatnosti|финальными вероятностями]].`,
		related: ['puassonovskiy-potok', 'intensivnost-perehoda', 'uravneniya-kolmogorova', 'finalnye-veroyatnosti']
	},

	'puassonovskiy-potok': {
		id: 'puassonovskiy-potok',
		term: 'Пуассоновский поток событий',
		short: String.raw`Поток случайных событий с постоянной интенсивностью и без последействия.`,
		body: String.raw`**Пуассоновский поток** интенсивности $\lambda$ — последовательность случайных моментов событий, в которой число событий на интервале длины $T$ распределено по закону Пуассона со средним $\lambda T$, события на непересекающихся интервалах независимы, а вероятность одного события за малое $\Delta t$ равна $\lambda\Delta t+o(\Delta t)$.

Время между соседними событиями [[pokazatelnoe-raspredelenie|показательное]] со средним $1/\lambda$. Сумма независимых пуассоновских потоков снова пуассоновский поток (с суммарной интенсивностью) — именно это даёт «поток выхода» из состояния.`,
		related: ['intensivnost-perehoda', 'pokazatelnoe-raspredelenie', 'markovskiy-process-nepreryvnyy']
	},

	'intensivnost-perehoda': {
		id: 'intensivnost-perehoda',
		term: 'Интенсивность перехода',
		short: String.raw`Параметр $\lambda_{ij}$: вероятность перехода $E_i\to E_j$ за $\Delta t$ равна $\lambda_{ij}\Delta t$.`,
		formula: String.raw`P(E_i\to E_j\text{ за }\Delta t)=\lambda_{ij}\,\Delta t+o(\Delta t)`,
		body: String.raw`**Интенсивность перехода** $\lambda_{ij}$ — плотность [[puassonovskiy-potok|пуассоновского потока]], переводящего систему из $E_i$ в $E_j$: за малое время $\Delta t$ переход происходит с вероятностью $\lambda_{ij}\Delta t+o(\Delta t)$. Это непрерывный аналог вероятности перехода $p_{ij}$ в [[matrica-perehoda|матрице перехода]].

Суммарная интенсивность выхода из $E_i$ равна $\Lambda_i=\sum_{j\neq i}\lambda_{ij}$, а среднее [[pokazatelnoe-raspredelenie|время пребывания]] в $E_i$ — $1/\Lambda_i$.`,
		related: ['puassonovskiy-potok', 'matrica-perehoda', 'pokazatelnoe-raspredelenie']
	},

	'pokazatelnoe-raspredelenie': {
		id: 'pokazatelnoe-raspredelenie',
		term: 'Показательное распределение',
		short: String.raw`Распределение времени до события пуассоновского потока: $\mathrm{Exp}(\lambda)$.`,
		formula: String.raw`f(t)=\lambda e^{-\lambda t},\ t\ge0,\quad Mt=1/\lambda`,
		body: String.raw`**Показательное** распределение $\mathrm{Exp}(\lambda)$ описывает время ожидания первого события [[puassonovskiy-potok|пуассоновского потока]]: плотность $f(t)=\lambda e^{-\lambda t}$ при $t\ge0$, среднее $1/\lambda$.

Его ключевое свойство — **отсутствие памяти**: $P(T>s+t\mid T>s)=P(T>t)$. Поэтому время пребывания в состоянии не зависит от того, как давно система в нём находится — это и обеспечивает марковость процесса с непрерывным временем.`,
		related: ['puassonovskiy-potok', 'intensivnost-perehoda']
	},

	'uravneniya-kolmogorova': {
		id: 'uravneniya-kolmogorova',
		term: 'Уравнения Колмогорова',
		short: String.raw`Система ОДУ для вероятностей состояний: $P_i'=$ приток $-$ отток.`,
		formula: String.raw`P_i'(t)=\sum_{j\neq i}\lambda_{ji}P_j(t)-P_i(t)\sum_{j\neq i}\lambda_{ij}`,
		body: String.raw`**Уравнения Колмогорова** — система дифференциальных уравнений для вероятностей состояний $P_i(t)$ [[markovskiy-process-nepreryvnyy|процесса с непрерывным временем]]:
$$P_i'(t)=\sum_{j\neq i}\lambda_{ji}P_j(t)-P_i(t)\sum_{j\neq i}\lambda_{ij}.$$
Правая часть — «приток вероятности в $E_i$ минус отток из $E_i$». Систему выписывают прямо по [[graf-sostoyaniy|графу состояний]]; одно из уравнений зависимо и заменяется [[uslovie-normirovki|условием нормировки]]. Стационарное решение даёт [[finalnye-veroyatnosti|финальные вероятности]].`,
		related: ['intensivnost-perehoda', 'graf-sostoyaniy', 'uslovie-normirovki', 'finalnye-veroyatnosti', 'uravneniya-balansa']
	},

	'graf-sostoyaniy': {
		id: 'graf-sostoyaniy',
		term: 'Граф состояний',
		short: String.raw`Состояния — вершины, переходы с интенсивностями — направленные дуги.`,
		body: String.raw`**Граф состояний** — наглядное представление [[markovskiy-process-nepreryvnyy|процесса]]: вершины — состояния $E_i$, направленные дуги — возможные переходы, подписанные [[intensivnost-perehoda|интенсивностями]] $\lambda_{ij}$. По графу [[uravneniya-kolmogorova|уравнения Колмогорова]] выписываются механически: для $P_i'$ прибавляем $\lambda_{ji}P_j$ за каждую входящую дугу и вычитаем $\lambda_{ij}P_i$ за каждую исходящую.`,
		related: ['uravneniya-kolmogorova', 'intensivnost-perehoda']
	},

	'uslovie-normirovki': {
		id: 'uslovie-normirovki',
		term: 'Условие нормировки',
		short: String.raw`$\sum_i P_i(t)=1$ — заменяет одно зависимое уравнение системы.`,
		formula: String.raw`\sum_{i=1}^{n}P_i(t)=1`,
		body: String.raw`**Условие нормировки** $\sum_i P_i(t)=1$ выражает то, что в любой момент система находится ровно в одном из состояний. Сумма всех [[uravneniya-kolmogorova|уравнений Колмогорова]] тождественно равна нулю, поэтому одно уравнение зависимо; его выбрасывают и добавляют нормировку, чтобы выделить единственное решение.`,
		related: ['uravneniya-kolmogorova', 'finalnye-veroyatnosti']
	},

	'finalnye-veroyatnosti': {
		id: 'finalnye-veroyatnosti',
		term: 'Финальные вероятности',
		short: String.raw`Предел $P_i=\lim_{t\to\infty}P_i(t)$ — доля времени в состоянии $E_i$.`,
		formula: String.raw`P_i=\lim_{t\to\infty}P_i(t)`,
		body: String.raw`**Финальные** (стационарные, предельные) вероятности $P_i=\lim_{t\to\infty}P_i(t)$ существуют при постоянных [[intensivnost-perehoda|интенсивностях]] и описывают долгосрочный режим: $P_i$ — доля времени, проводимого в $E_i$, независимо от старта.

В стационаре все производные нулевые, поэтому [[uravneniya-kolmogorova|уравнения Колмогорова]] превращаются в линейную систему — [[uravneniya-balansa|уравнения баланса]] плюс [[uslovie-normirovki|нормировка]]. Это непрерывный аналог [[stacionarnoe-raspredelenie|стационарного распределения]] цепи с дискретным временем.`,
		related: ['uravneniya-balansa', 'uslovie-normirovki', 'stacionarnoe-raspredelenie', 'uravneniya-kolmogorova']
	},

	'uravneniya-balansa': {
		id: 'uravneniya-balansa',
		term: 'Уравнения баланса',
		short: String.raw`Стационарное условие «приток = отток» для каждого состояния.`,
		formula: String.raw`\sum_{j\neq i}\lambda_{ji}P_j=P_i\sum_{j\neq i}\lambda_{ij}`,
		body: String.raw`**Уравнения баланса** — стационарная форма [[uravneniya-kolmogorova|уравнений Колмогорова]] ($P_i'=0$): для каждого состояния поток вероятности, втекающий в $E_i$, равен вытекающему,
$$\sum_{j\neq i}\lambda_{ji}P_j=P_i\sum_{j\neq i}\lambda_{ij}.$$
Это закон сохранения «жидкости вероятности» на [[graf-sostoyaniy|графе состояний]]. Вместе с [[uslovie-normirovki|нормировкой]] они однозначно определяют [[finalnye-veroyatnosti|финальные вероятности]].`,
		related: ['uravneniya-kolmogorova', 'finalnye-veroyatnosti', 'graf-sostoyaniy', 'intensivnost-perehoda']
	},

	'markovskaya-cep': {
		id: 'markovskaya-cep',
		term: 'Цепь Маркова',
		short: String.raw`Марковский процесс с дискретным временем; динамику задаёт матрица перехода.`,
		body: String.raw`**Цепь Маркова** — [[markovskiy-process|марковский процесс]] с дискретным временем $t=0,1,2,\dots$: за один такт система переходит из $E_i$ в $E_j$ с вероятностью $p_{ij}$, собранной в [[matrica-perehoda|матрицу перехода]]. Долгосрочный режим описывается [[stacionarnoe-raspredelenie|стационарным распределением]] — дискретным аналогом [[finalnye-veroyatnosti|финальных вероятностей]].`,
		related: ['markovskiy-process', 'matrica-perehoda', 'stacionarnoe-raspredelenie']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Матрица $P=(p_{ij})$ вероятностей перехода за один шаг; строки стохастичны.`,
		formula: String.raw`P=(p_{ij}),\quad \sum_j p_{ij}=1`,
		body: String.raw`**Матрица перехода** $P=(p_{ij})$ [[markovskaya-cep|цепи Маркова]] хранит вероятности $p_{ij}=P(E_i\to E_j)$ за один шаг. Каждая строка стохастична: $p_{ij}\ge0$ и $\sum_j p_{ij}=1$. В непрерывном времени её роль играют [[intensivnost-perehoda|интенсивности]] $\lambda_{ij}$.`,
		related: ['markovskaya-cep', 'intensivnost-perehoda']
	},

	'stacionarnoe-raspredelenie': {
		id: 'stacionarnoe-raspredelenie',
		term: 'Стационарное распределение',
		short: String.raw`Вектор $\omega$ с $\omega P=\omega$, $\sum_i\omega_i=1$ — предельный режим цепи.`,
		formula: String.raw`\omega P=\omega,\quad \sum_i\omega_i=1`,
		body: String.raw`**Стационарное распределение** [[markovskaya-cep|цепи Маркова]] — вероятностный вектор $\omega$, неподвижный относительно [[matrica-perehoda|матрицы перехода]]: $\omega P=\omega$ при $\sum_i\omega_i=1$. К нему сходится распределение состояний независимо от старта. Это дискретный аналог [[finalnye-veroyatnosti|финальных вероятностей]] процесса с непрерывным временем.`,
		related: ['markovskaya-cep', 'matrica-perehoda', 'finalnye-veroyatnosti']
	}
};
