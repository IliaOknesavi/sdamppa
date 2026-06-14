import type { Glossary } from '$lib/types';

// Термины дня 20 (ch15): цепи Маркова, матрица перехода, Колмогоров–Чепмен.
export const day20Terms: Glossary = {
	'cep-markova': {
		id: 'cep-markova',
		term: 'Цепь Маркова',
		short: String.raw`Случайный процесс с дискретным временем, у которого будущее зависит от прошлого лишь через настоящее.`,
		body: String.raw`**Цепь Маркова** — последовательность случайных состояний $X_0,X_1,X_2,\dots$ со значениями в конечном множестве $S=\{u_1,\dots,u_n\}$, обладающая [[markovskoe-svoystvo|марковским свойством]]: вероятность следующего перехода зависит только от текущего [[sostoyanie-cepi|состояния]], а не от всей предыстории.

Задаётся [[matrica-perehoda|матрицей перехода]] и [[nachalnoe-raspredelenie|начальным распределением]]. Простейшая и самая употребительная модель случайного процесса.`,
		related: ['markovskoe-svoystvo', 'matrica-perehoda', 'sostoyanie-cepi', 'odnorodnaya-cep']
	},

	'markovskoe-svoystvo': {
		id: 'markovskoe-svoystvo',
		term: 'Марковское свойство',
		short: String.raw`Отсутствие последействия: будущее зависит от прошлого только через настоящее состояние.`,
		formula: String.raw`P(X_{t+1}=u_j\mid X_t,\dots,X_0)=P(X_{t+1}=u_j\mid X_t)`,
		body: String.raw`**Марковское свойство** (отсутствие последействия): для прогноза будущего достаточно знать текущее состояние, путь к нему несуществен. $$P\bigl(X_{t+1}=u_j\mid X_t=u_i,\dots,X_0\bigr)=P\bigl(X_{t+1}=u_j\mid X_t=u_i\bigr).$$ Именно оно позволяет описать [[cep-markova|цепь]] одной [[matrica-perehoda|матрицей перехода]].`,
		related: ['cep-markova', 'matrica-perehoda']
	},

	'sostoyanie-cepi': {
		id: 'sostoyanie-cepi',
		term: 'Состояние цепи',
		short: String.raw`Одно из конечного числа положений $u_i$, в которых система может находиться.`,
		body: String.raw`**Состояние** $u_i$ — одно из конечного множества $S=\{u_1,\dots,u_n\}$ положений системы. В каждый дискретный момент [[cep-markova|цепь]] занимает ровно одно состояние и на следующем шаге случайно переходит в другое (или то же). Особый тип — [[pogloshchayushchee-sostoyanie|поглощающее]] состояние.`,
		related: ['cep-markova', 'pogloshchayushchee-sostoyanie', 'veroyatnost-perehoda']
	},

	'veroyatnost-perehoda': {
		id: 'veroyatnost-perehoda',
		term: 'Вероятность перехода',
		short: String.raw`$p_{ij}=P(X_{t+1}=u_j\mid X_t=u_i)$ — шанс перейти из $u_i$ в $u_j$ за шаг.`,
		formula: String.raw`p_{ij}=P(X_{t+1}=u_j\mid X_t=u_i)`,
		body: String.raw`**Вероятность перехода** из $u_i$ в $u_j$ за один шаг — условная вероятность $p_{ij}=P(X_{t+1}=u_j\mid X_t=u_i)$. Из них составлена [[matrica-perehoda|матрица перехода]]. Вероятность перехода за $t$ шагов $p^{(t)}_{ij}=(P^{t})_{ij}$ — элемент $t$-й степени матрицы.`,
		related: ['matrica-perehoda', 'sostoyanie-cepi', 'uravnenie-kolmogorova-chepmena']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Квадратная матрица $P=(p_{ij})$ переходных вероятностей цепи.`,
		formula: String.raw`P=(p_{ij}),\quad p_{ij}=P(u_i\to u_j)`,
		body: String.raw`**Матрица перехода** $P=(p_{ij})$ — квадратная матрица порядка $n$, где $p_{ij}$ — [[veroyatnost-perehoda|вероятность перехода]] $u_i\to u_j$ за один шаг ($i$-я строка, $j$-й столбец). Всегда [[stohasticheskaya-matrica|стохастична]]. Её степени дают эволюцию: $p^{(t)}=p^{(0)}P^{t}$ и $p^{(t)}_{ij}=(P^{t})_{ij}$.`,
		related: ['stohasticheskaya-matrica', 'veroyatnost-perehoda', 'cep-markova', 'uravnenie-kolmogorova-chepmena']
	},

	'stohasticheskaya-matrica': {
		id: 'stohasticheskaya-matrica',
		term: 'Стохастическая матрица',
		short: String.raw`Неотрицательная квадратная матрица, сумма каждой строки которой равна $1$.`,
		formula: String.raw`p_{ij}\ge0,\qquad \sum_{j} p_{ij}=1`,
		body: String.raw`Квадратная матрица $P=(p_{ij})$ называется **стохастической**, если $p_{ij}\ge0$ и сумма элементов каждой строки равна $1$. [[matrica-perehoda|Матрица перехода]] любой [[cep-markova|цепи Маркова]] стохастична (из $u_i$ система обязательно куда-то перейдёт); и наоборот, всякая стохастическая матрица задаёт цепь. Сумма по столбцу не ограничена.`,
		related: ['matrica-perehoda', 'cep-markova']
	},

	'odnorodnaya-cep': {
		id: 'odnorodnaya-cep',
		term: 'Однородная цепь',
		short: String.raw`Переходные вероятности не зависят от момента времени.`,
		body: String.raw`Цепь Маркова **однородна**, если её [[veroyatnost-perehoda|переходные вероятности]] $p_{ij}$ одни и те же на каждом шаге, не завися от $t$. Тогда [[matrica-perehoda|матрица перехода]] $P$ постоянна, и распределение в момент $t$ равно $p^{(t)}=p^{(0)}P^{t}$. Содержательно: «правила игры» со временем не меняются.`,
		related: ['cep-markova', 'matrica-perehoda', 'nachalnoe-raspredelenie']
	},

	'nachalnoe-raspredelenie': {
		id: 'nachalnoe-raspredelenie',
		term: 'Начальное распределение',
		short: String.raw`Вектор-строка $p^{(0)}$ вероятностей состояний в момент $t=0$.`,
		formula: String.raw`p^{(0)}=(p^{(0)}_1,\dots,p^{(0)}_n),\ \ \sum_i p^{(0)}_i=1`,
		body: String.raw`**Начальное распределение** $p^{(0)}=(p^{(0)}_1,\dots,p^{(0)}_n)$, где $p^{(0)}_i=P(X_0=u_i)$ — вероятность стартовать из $u_i$. При точном старте вырождено: $p^{(0)}=(1,0,\dots,0)$. Вместе с [[matrica-perehoda|матрицей перехода]] полностью задаёт [[cep-markova|цепь]]: $p^{(t)}=p^{(0)}P^{t}$.`,
		related: ['cep-markova', 'matrica-perehoda', 'odnorodnaya-cep', 'stacionarnoe-raspredelenie']
	},

	'uravnenie-kolmogorova-chepmena': {
		id: 'uravnenie-kolmogorova-chepmena',
		term: 'Уравнение Колмогорова–Чепмена',
		short: String.raw`$p^{(t+s)}_{ij}=\sum_k p^{(t)}_{ik}p^{(s)}_{kj}$, или $P^{t+s}=P^{t}P^{s}$.`,
		formula: String.raw`p^{(t+s)}_{ij}=\sum_{k} p^{(t)}_{ik}\,p^{(s)}_{kj}`,
		body: String.raw`**Уравнение Колмогорова–Чепмена** связывает переходы за разное число шагов: $$p^{(t+s)}_{ij}=\sum_{k=1}^{n} p^{(t)}_{ik}\,p^{(s)}_{kj},$$ в матричной форме $P^{t+s}=P^{t}P^{s}$. Доказывается [[formula-polnoy-veroyatnosti|формулой полной вероятности]] по промежуточному (перевалочному) состоянию $u_k$ в момент $t$.`,
		related: ['matrica-perehoda', 'veroyatnost-perehoda', 'formula-polnoy-veroyatnosti']
	},

	'formula-polnoy-veroyatnosti': {
		id: 'formula-polnoy-veroyatnosti',
		term: 'Формула полной вероятности',
		short: String.raw`$P(B)=\sum_i P(H_i)P(B\mid H_i)$ по полной группе гипотез.`,
		formula: String.raw`P(B)=\sum_{i} P(H_i)\,P(B\mid H_i)`,
		body: String.raw`**Формула полной вероятности**: если гипотезы $H_1,\dots,H_n$ образуют [[polnaya-gruppa|полную группу]], то для любого события $B$ $$P(B)=\sum_{i} P(H_i)\,P(B\mid H_i).$$ Разбивая событие по всем взаимоисключающим «причинам», суммируем вклады. На ней держится вывод $p^{(t)}=p^{(0)}P^{t}$ и [[uravnenie-kolmogorova-chepmena|уравнение Колмогорова–Чепмена]].`,
		related: ['polnaya-gruppa', 'uravnenie-kolmogorova-chepmena']
	},

	'graf-cepi': {
		id: 'graf-cepi',
		term: 'Граф цепи',
		short: String.raw`Ориентированный граф: вершины — состояния, рёбра — переходы с весами $p_{ij}$.`,
		body: String.raw`**Граф переходов** изображает [[cep-markova|цепь]]: вершины — [[sostoyanie-cepi|состояния]] $u_1,\dots,u_n$, ребро $u_i\to u_j$ с пометкой $p_{ij}$ рисуют при $p_{ij}>0$, петля $u_i\to u_i$ — возможность остаться. Сумма весов рёбер, выходящих из вершины, равна $1$ — графический образ [[stohasticheskaya-matrica|стохастичности]].`,
		related: ['cep-markova', 'sostoyanie-cepi', 'pogloshchayushchee-sostoyanie', 'stohasticheskaya-matrica']
	},

	'pogloshchayushchee-sostoyanie': {
		id: 'pogloshchayushchee-sostoyanie',
		term: 'Поглощающее состояние',
		short: String.raw`Состояние с $p_{ii}=1$: попав в него, система остаётся навсегда.`,
		formula: String.raw`p_{ii}=1`,
		body: String.raw`Состояние $u_i$ **поглощающее**, если $p_{ii}=1$: попав в него, [[cep-markova|цепь]] уже не выходит (на [[graf-cepi|графе]] из вершины только петля веса $1$). Например, у «рулетки» с матрицей $$P=\begin{pmatrix}1&0\\ \tfrac16&\tfrac56\end{pmatrix}$$ состояние $u_1$ поглощающее, и система постепенно затягивается в него.`,
		related: ['sostoyanie-cepi', 'cep-markova', 'graf-cepi']
	},

	'stacionarnoe-raspredelenie': {
		id: 'stacionarnoe-raspredelenie',
		term: 'Стационарное распределение',
		short: String.raw`Неподвижное распределение цепи: $\pi=\pi P$.`,
		formula: String.raw`\pi = \pi P,\qquad \sum_i \pi_i=1`,
		body: String.raw`**Стационарное распределение** $\pi$ — вектор вероятностей, не меняющийся под действием [[matrica-perehoda|матрицы перехода]]: $\pi=\pi P$. Для регулярной (эргодической) [[cep-markova|цепи]] распределение $p^{(t)}=p^{(0)}P^{t}$ сходится к $\pi$ из любого [[nachalnoe-raspredelenie|старта]] — система «забывает» начало. Это основа PageRank и сходимости MCMC.`,
		related: ['matrica-perehoda', 'cep-markova', 'nachalnoe-raspredelenie']
	}
};
