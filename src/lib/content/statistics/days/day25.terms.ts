import type { Glossary } from '$lib/types';

// Термины дня 25 (ch17): стационарное и предельное распределения, эргодичность
// и регулярность (сильная эргодичность), эргодическая теорема, время первого
// возвращения e_ii=1/ω_i и фундаментальная матрица регулярной цепи Z с матрицей
// времён первого попадания E. Self-contained: повторяет базовый словарь цепей,
// чтобы день читался независимо. Перекрёстные ссылки через [[id]] и `related`.
// Термин zakon-bolshih-chisel берётся из базового графа (дни 05/11), не дублируется.
export const day25Terms: Glossary = {
	'markovskaya-cep': {
		id: 'markovskaya-cep',
		term: 'Марковская цепь',
		short: String.raw`Процесс $(X_t)$ на состояниях $\{u_1,\dots,u_n\}$ без последействия.`,
		formula: String.raw`P(X_{t+1}=u_j\mid X_0,\dots,X_t=u_i)=p_{ij}`,
		body: String.raw`**Марковская цепь** — последовательность состояний $X_0,X_1,\dots$ из конечного множества $\{u_1,\dots,u_n\}$ с **марковским свойством** (отсутствие последействия): будущее зависит от прошлого только через настоящее, $$P(X_{t+1}=u_j\mid X_0,\dots,X_t=u_i)=p_{ij}.$$ Однородная цепь задаётся начальным вектором $p^{(0)}$ и [[matrica-perehoda|матрицей перехода]] $P$; распределение на шаге $t$ есть $p^{(t)}=p^{(0)}P^{t}$.`,
		related: ['matrica-perehoda', 'stacionarnoe-raspredelenie', 'ergodichnost']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Стохастическая матрица $P=(p_{ij})$ вероятностей перехода за шаг.`,
		formula: String.raw`p_{ij}\ge0,\quad \textstyle\sum_j p_{ij}=1`,
		body: String.raw`**Матрица перехода** $P=(p_{ij})$ однородной [[markovskaya-cep|цепи]] содержит вероятности $p_{ij}=P(\text{из }u_i\text{ в }u_j\text{ за шаг})$. Она **стохастическая**: $p_{ij}\ge0$ и сумма каждой строки равна $1$ (отсюда $P\mathbf 1=\mathbf 1$ и собственное значение $\lambda=1$). Вероятности за $t$ шагов — элементы $P^{t}$.`,
		related: ['markovskaya-cep', 'predelnaya-matrica', 'sobstvennyy-vektor']
	},

	'stacionarnoe-raspredelenie': {
		id: 'stacionarnoe-raspredelenie',
		term: 'Стационарное распределение',
		short: String.raw`Вероятностный вектор $\omega$ с $\omega P=\omega$ — не меняется во времени.`,
		formula: String.raw`\omega P=\omega,\quad \textstyle\sum_i\omega_i=1`,
		body: String.raw`**Стационарное** (инвариантное) **распределение** — вероятностный вектор-строка $\omega$ ($\omega_i\ge0$, $\sum_i\omega_i=1$), удовлетворяющий уравнению стационарности $$\omega P=\omega.$$ Запущенная из $\omega$ цепь сохраняет это распределение навсегда: $p^{(t)}=\omega P^{t}=\omega$. Покоординатно $\sum_i\omega_i p_{ij}=\omega_j$ — баланс притока вероятности. Находят $\omega$ из $n-1$ уравнения системы $\omega P=\omega$ плюс нормировка; для [[ergodichnost|эргодической]] цепи решение существует и единственно.`,
		related: ['markovskaya-cep', 'ergodichnost', 'vremya-vozvrashcheniya', 'predelnaya-matrica']
	},

	'predelnaya-matrica': {
		id: 'predelnaya-matrica',
		term: 'Предельная матрица',
		short: String.raw`$W=\lim_{t\to\infty}P^{t}$; для регулярной цепи все строки равны $\omega$.`,
		formula: String.raw`W=\lim_{t\to\infty}P^{t}`,
		body: String.raw`**Предельная матрица** — поэлементный предел $W=\lim_{t\to\infty}P^{t}$, если он существует; $w_{ij}$ — предельная вероятность оказаться в $u_j$ при старте из $u_i$. Для [[regulyarnaya-cep|регулярной]] цепи $W$ стохастическая, $WP=PW=W$, и **все её строки одинаковы** и равны [[stacionarnoe-raspredelenie|стационарному вектору]] $\omega$. Совпадение строк выражает «забывание начального состояния»: при больших $t$ распределение не зависит от старта.`,
		related: ['regulyarnaya-cep', 'stacionarnoe-raspredelenie', 'matrica-perehoda']
	},

	neprivodimost: {
		id: 'neprivodimost',
		term: 'Неприводимость',
		short: String.raw`Любые два состояния сообщаются — из любого можно попасть в любое.`,
		body: String.raw`Состояние $u_j$ **достижимо** из $u_i$, если $p_{ij}^{(t)}>0$ при некотором $t\ge0$; состояния **сообщаются**, если достижимы друг из друга. Цепь **неприводима** (неразложима), если любые два состояния сообщаются, то есть все состояния образуют один класс. Неприводимость конечной цепи равносильна её [[ergodichnost|эргодичности]] — существованию единственного [[stacionarnoe-raspredelenie|стационарного распределения]].`,
		related: ['ergodichnost', 'aperiodichnost', 'regulyarnaya-cep']
	},

	aperiodichnost: {
		id: 'aperiodichnost',
		term: 'Апериодичность',
		short: String.raw`Период состояния $d_i=\gcd\{t:\ p_{ii}^{(t)}>0\}$ равен $1$.`,
		formula: String.raw`d_i=\gcd\{\,t\ge1:\ p_{ii}^{(t)}>0\,\}=1`,
		body: String.raw`**Период** состояния $u_i$ — наибольший общий делитель длин возможных возвращений: $d_i=\gcd\{t\ge1:\ p_{ii}^{(t)}>0\}$. При $d_i=1$ состояние **апериодично** (достаточно петли $p_{ii}>0$). В [[neprivodimost|неприводимой]] цепи период одинаков у всех состояний. Апериодичность необходима для существования предела $P^{t}\to W$: периодичность ($d>1$) разрушает сходимость самих вероятностей. Неприводимая апериодическая цепь — [[regulyarnaya-cep|регулярная]].`,
		related: ['neprivodimost', 'regulyarnaya-cep', 'predelnaya-matrica']
	},

	ergodichnost: {
		id: 'ergodichnost',
		term: 'Эргодичность',
		short: String.raw`Единственное $\omega$, к которому сходятся средние по времени доли пребывания.`,
		body: String.raw`Конечная [[markovskaya-cep|цепь]] **эргодична**, если у неё существует единственное [[stacionarnoe-raspredelenie|стационарное распределение]] $\omega$, к которому сходятся **средние по времени** доли пребывания в состояниях при любом старте. Для конечной цепи это равносильно [[neprivodimost|неприводимости]]. Эргодичность гарантирует сходимость усреднений по времени (как в [[ergodicheskaya-teorema|эргодической теореме]]), но **не** обязательно сходимость самих вероятностей $p_{ij}^{(t)}$ — периодичность ей не мешает (пример: $\begin{pmatrix}0&1\\1&0\end{pmatrix}$ эргодична, но периодична).`,
		related: ['neprivodimost', 'regulyarnaya-cep', 'ergodicheskaya-teorema', 'stacionarnoe-raspredelenie']
	},

	'regulyarnaya-cep': {
		id: 'regulyarnaya-cep',
		term: 'Регулярная (сильно эргодическая) цепь',
		short: String.raw`Неприводима и апериодична; существует предел $P^{t}\to W$.`,
		body: String.raw`Цепь **регулярна** (сильно эргодична), если она [[neprivodimost|неприводима]] и [[aperiodichnost|апериодична]]. Эквивалентно: найдётся $t_0$, при котором **все** элементы $P^{t_0}$ строго положительны (рабочий признак; если уже $P$ без нулей — берём $t_0=1$). Для регулярной цепи существует [[predelnaya-matrica|предельная матрица]] $P^{t}\to W$ с одинаковыми строками $\omega$, и $p^{(t)}\to\omega$ из любого начала — сходятся не только средние по времени, но и сами $t$-шаговые вероятности.`,
		related: ['neprivodimost', 'aperiodichnost', 'predelnaya-matrica', 'fundamentalnaya-matrica-z']
	},

	'ergodicheskaya-teorema': {
		id: 'ergodicheskaya-teorema',
		term: 'Эргодическая теорема',
		short: String.raw`В эргодической цепи доля времени в $u_i$ сходится к $\omega_i$.`,
		formula: String.raw`\tfrac1t\sum_{s=1}^{t}\mathbf 1\{X_s=u_i\}\to\omega_i`,
		body: String.raw`**Эргодическая теорема.** Для конечной [[neprivodimost|неприводимой]] цепи: (1) [[stacionarnoe-raspredelenie|стационарное]] $\omega$ единственно, все $\omega_i>0$; (2) доля времени в состоянии $u_i$ сходится (почти наверное) к $\omega_i$: $\frac1t\sum_{s=1}^{t}\mathbf 1\{X_s=u_i\}\to\omega_i$; (3) если цепь ещё и [[aperiodichnost|апериодична]] ([[regulyarnaya-cep|регулярна]]), то $p_{ij}^{(t)}\to\omega_j$. Содержательно: **усреднение по времени** (одна длинная траектория) даёт то же, что **усреднение по ансамблю** $\omega$. Это основа MCMC.`,
		related: ['ergodichnost', 'stacionarnoe-raspredelenie', 'vremya-vozvrashcheniya', 'regulyarnaya-cep']
	},

	'vremya-vozvrashcheniya': {
		id: 'vremya-vozvrashcheniya',
		term: 'Среднее время первого возвращения',
		short: String.raw`Ожидаемое число шагов до возврата в $u_i$: $e_{ii}=1/\omega_i$.`,
		formula: String.raw`e_{ii}=\dfrac{1}{\omega_i}`,
		body: String.raw`**Среднее время первого возвращения** $e_{ii}$ — математическое ожидание числа шагов, за которое цепь, вышедшая из $u_i$, впервые снова попадёт в $u_i$. Для [[ergodichnost|эргодической]] цепи оно обратно [[stacionarnoe-raspredelenie|стационарной вероятности]]: $$e_{ii}=\frac1{\omega_i}.$$ Чем реже посещается состояние (меньше $\omega_i$), тем дольше до него ждать. Времена первого **попадания** $e_{ij}$ ($i\ne j$) собирают в матрицу $E$, вычисляемую через [[fundamentalnaya-matrica-z|фундаментальную матрицу]].`,
		related: ['stacionarnoe-raspredelenie', 'ergodicheskaya-teorema', 'fundamentalnaya-matrica-z']
	},

	'fundamentalnaya-matrica-z': {
		id: 'fundamentalnaya-matrica-z',
		term: 'Фундаментальная матрица регулярной цепи',
		short: String.raw`$Z=(I-(P-W))^{-1}$ — накапливает избыток $p_{ij}^{(s)}$ над $\omega_j$.`,
		formula: String.raw`Z=\bigl(I-(P-W)\bigr)^{-1}=I+\sum_{s\ge1}(P^{s}-W)`,
		body: String.raw`**Фундаментальная матрица** [[regulyarnaya-cep|регулярной]] цепи $$Z=\bigl(I-(P-W)\bigr)^{-1}=I+\sum_{s=1}^{\infty}(P^{s}-W),$$ где $W$ — [[predelnaya-matrica|предельная матрица]]. Ряд сходится, так как $P^{s}-W\to0$ геометрически; $Z$ кодирует переходный режим — накопленный избыток вероятностей $p_{ij}^{(s)}$ над предельными $\omega_j$. Через неё считают матрицу средних времён первого попадания $E=(I-Z+\overline J\,Z_{dg})\,D$, где $\overline J$ — матрица из единиц, $Z_{dg}$ — диагональ $Z$, $D=\operatorname{diag}(1/\omega_j)$. Не путать с матрицей $N=(I-Q)^{-1}$ поглощающих цепей.`,
		related: ['regulyarnaya-cep', 'predelnaya-matrica', 'vremya-vozvrashcheniya']
	},

	'sobstvennyy-vektor': {
		id: 'sobstvennyy-vektor',
		term: 'Собственный вектор',
		short: String.raw`Ненулевой $v$ с $Av=\lambda v$: матрица лишь растягивает его.`,
		formula: String.raw`Av=\lambda v,\quad v\ne0`,
		body: String.raw`**Собственный вектор** матрицы $A$ — ненулевой вектор $v$, который под действием $A$ лишь масштабируется: $Av=\lambda v$, где число $\lambda$ — **собственное значение**. У [[matrica-perehoda|стохастической матрицы]] $P$ всегда есть собственное значение $\lambda=1$ (столбец единиц: $P\mathbf 1=\mathbf 1$). Тот же спектр у $P^{\mathsf T}$, поэтому уравнение [[stacionarnoe-raspredelenie|$\omega P=\omega$]] — это поиск левого собственного вектора $P$ для $\lambda=1$, нормированного к вероятностному.`,
		related: ['matrica-perehoda', 'stacionarnoe-raspredelenie']
	}
};
