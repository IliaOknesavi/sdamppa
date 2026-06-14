import type { Glossary } from '$lib/types';

// New terms introduced on day 21 (ch16): classification of Markov-chain states —
// reachability, communication, classes, essential/closed/ergodic sets,
// irreducibility. First Markov-phase terms; later days extend this graph.
export const day21Terms: Glossary = {
	'markovskaya-cep': {
		id: 'markovskaya-cep',
		term: 'Цепь Маркова',
		short: String.raw`Случайный процесс, у которого будущее зависит от прошлого только через настоящее.`,
		formula: String.raw`P(X_{t+1}=u_j\mid X_t=u_i,\dots)=p_{ij}`,
		body: String.raw`**Цепь Маркова** — последовательность состояний $X_0,X_1,X_2,\dots$ из множества $S=\{u_1,u_2,\dots\}$ с **марковским свойством**: будущее зависит от прошлого только через текущее состояние, $$P(X_{t+1}=u_j\mid X_0,\dots,X_t=u_i)=P(X_{t+1}=u_j\mid X_t=u_i)=p_{ij}.$$ Цепь называют **однородной**, если переходные вероятности $p_{ij}$ не зависят от времени $t$. Они образуют [[matrica-perehoda|матрицу перехода]] $P$.`,
		related: ['matrica-perehoda', 'kolmogorov-chepmen', 'soobschayuschiesya']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Стохастическая матрица $P=(p_{ij})$ вероятностей перехода за один шаг.`,
		formula: String.raw`p_{ij}\ge0,\quad \sum_j p_{ij}=1`,
		body: String.raw`**Матрица перехода** $P=(p_{ij})$ [[markovskaya-cep|цепи Маркова]] собирает вероятности $p_{ij}=P(\text{из }u_i\text{ за шаг в }u_j)$. Она **стохастическая**: все элементы неотрицательны, а сумма по каждой строке равна $1$ (из любого состояния куда-то перейдём наверняка). Вероятности перехода за $t$ шагов — элементы $p_{ij}^{(t)}$ степени $P^t$.`,
		related: ['markovskaya-cep', 'kolmogorov-chepmen', 'pogloschayuschee-sostoyanie']
	},

	'kolmogorov-chepmen': {
		id: 'kolmogorov-chepmen',
		term: 'Уравнение Колмогорова–Чепмена',
		short: String.raw`$p_{ij}^{(t+s)}=\sum_k p_{ik}^{(t)}p_{kj}^{(s)}$ — переход за $t+s$ шагов через промежуточное состояние.`,
		formula: String.raw`p_{ij}^{(t+s)}=\sum_k p_{ik}^{(t)}\,p_{kj}^{(s)}`,
		body: String.raw`**Уравнение Колмогорова–Чепмена** связывает переходы за разное число шагов: $$p_{ij}^{(t+s)}=\sum_k p_{ik}^{(t)}\,p_{kj}^{(s)},\qquad P^{(t+s)}=P^t P^s.$$ Содержательно: чтобы попасть из $u_i$ в $u_j$ за $t+s$ шагов, надо за $t$ шагов оказаться в каком-то промежуточном $u_k$, а оттуда за $s$ шагов дойти до $u_j$ — и просуммировать по всем $u_k$. Это рабочий инструмент для [[dostizhimost|достижимости]]: отбросив все слагаемые кроме одного, получаем оценку снизу $p_{ij}^{(t+s)}\ge p_{ik}^{(t)}p_{kj}^{(s)}$.`,
		related: ['matrica-perehoda', 'dostizhimost', 'markovskaya-cep']
	},

	dostizhimost: {
		id: 'dostizhimost',
		term: 'Достижимость',
		short: String.raw`$u_i\to u_j$, если за какое-то число шагов $p_{ij}^{(t)}>0$.`,
		formula: String.raw`u_i\to u_j \iff \exists\, t\ge0:\ p_{ij}^{(t)}>0`,
		body: String.raw`Состояние $u_j$ **достижимо** из $u_i$ (пишут $u_i\to u_j$), если существует число шагов $t\ge0$ с $p_{ij}^{(t)}>0$ — то есть из $u_i$ можно с положительной вероятностью добраться до $u_j$. По соглашению $p_{ii}^{(0)}=1$, поэтому каждое состояние достижимо из себя.

Достижимость **транзитивна**: $u_i\to u_j$ и $u_j\to u_k$ влекут $u_i\to u_k$ (доказывается «склейкой путей» через [[kolmogorov-chepmen|Колмогорова–Чепмена]]). На ней строится [[soobschayuschiesya|сообщение]] состояний.`,
		related: ['soobschayuschiesya', 'kolmogorov-chepmen', 'suschestvennoe-sostoyanie']
	},

	soobschayuschiesya: {
		id: 'soobschayuschiesya',
		term: 'Сообщающиеся состояния',
		short: String.raw`$u_i\leftrightarrow u_j$: достижимы друг из друга.`,
		formula: String.raw`u_i\leftrightarrow u_j \iff u_i\to u_j \ \text{и}\ u_j\to u_i`,
		body: String.raw`Состояния $u_i$ и $u_j$ **сообщаются** ($u_i\leftrightarrow u_j$), если [[dostizhimost|достижимы]] друг из друга: $u_i\to u_j$ **и** $u_j\to u_i$.

Отношение $\leftrightarrow$ — **отношение эквивалентности**: рефлексивно ($p_{ii}^{(0)}=1$), симметрично (по определению) и транзитивно (через [[kolmogorov-chepmen|Колмогорова–Чепмена]]). Поэтому оно разбивает множество состояний на [[klass-soobschenia|классы сообщающихся состояний]].`,
		related: ['dostizhimost', 'klass-soobschenia', 'neprivodimaya-cep']
	},

	'klass-soobschenia': {
		id: 'klass-soobschenia',
		term: 'Класс сообщающихся состояний',
		short: String.raw`Максимальное множество попарно сообщающихся состояний.`,
		body: String.raw`**Класс сообщающихся состояний** — класс эквивалентности по отношению [[soobschayuschiesya|$\leftrightarrow$]]: максимальное множество состояний, попарно сообщающихся друг с другом. Классы **не пересекаются** и в объединении дают всё $S$.

Многие свойства состояния **постоянны внутри класса** — [[suschestvennoe-sostoyanie|существенность]], возвратность, период. Поэтому достаточно классифицировать по одному представителю, и весь класс наследует тип. Если класс один — цепь [[neprivodimaya-cep|неприводима]].`,
		related: ['soobschayuschiesya', 'suschestvennoe-sostoyanie', 'neprivodimaya-cep']
	},

	'suschestvennoe-sostoyanie': {
		id: 'suschestvennoe-sostoyanie',
		term: 'Существенное состояние',
		short: String.raw`Всё, что из него достижимо, возвращается обратно.`,
		body: String.raw`Состояние $u_i$ **существенно**, если из любого достижимого из него состояния можно вернуться: для всякого $u_j$ с $u_i\to u_j$ выполнено и $u_j\to u_i$. Если же есть «выход без возврата» ($u_i\to u_j$, но $u_j\not\to u_i$) — состояние **несущественно**.

Существенность постоянна внутри [[klass-soobschenia|класса]], поэтому классы делятся на существенные и несущественные. Из несущественного состояния процесс рано или поздно уходит навсегда; существенные классы совпадают с [[ergodicheskoe-mnozhestvo|эргодическими множествами]] и определяют долгосрочное поведение цепи. В конечной цепи существенные состояния возвратны, несущественные — невозвратны.`,
		related: ['dostizhimost', 'zamknutoe-mnozhestvo', 'ergodicheskoe-mnozhestvo']
	},

	'zamknutoe-mnozhestvo': {
		id: 'zamknutoe-mnozhestvo',
		term: 'Замкнутое множество',
		short: String.raw`Множество, из которого нельзя выйти: $p_{ij}=0$ при $u_i\in C$, $u_j\notin C$.`,
		formula: String.raw`\forall u_i\in C,\ u_j\notin C:\ p_{ij}=0`,
		body: String.raw`Множество состояний $C\subseteq S$ **замкнуто**, если из него нельзя выйти за один шаг (а значит, и ни за сколько): $p_{ij}=0$ для всех $u_i\in C$ и $u_j\notin C$. Попав в замкнутое множество, цепь остаётся в нём навсегда.

Минимальное замкнутое множество (никакое его собственное подмножество не замкнуто) называют [[ergodicheskoe-mnozhestvo|эргодическим]]. Всё множество $S$ всегда замкнуто; интересны нетривиальные замкнутые подмножества — они соответствуют [[suschestvennoe-sostoyanie|существенным]] классам.`,
		related: ['ergodicheskoe-mnozhestvo', 'suschestvennoe-sostoyanie', 'pogloschayuschee-sostoyanie']
	},

	'ergodicheskoe-mnozhestvo': {
		id: 'ergodicheskoe-mnozhestvo',
		term: 'Эргодическое множество',
		short: String.raw`Минимальное замкнутое множество; совпадает с существенным классом.`,
		body: String.raw`**Эргодическое множество** — это [[zamknutoe-mnozhestvo|замкнутое]] множество, не содержащее собственных замкнутых подмножеств (минимальное замкнутое). Оно совпадает с [[suschestvennoe-sostoyanie|существенным]] [[klass-soobschenia|классом]] сообщающихся состояний: внутри можно свободно ходить из любой точки в любую, а наружу выхода нет.

[[pogloschayuschee-sostoyanie|Поглощающее состояние]] — простейшее одноэлементное эргодическое множество. Именно в эргодических множествах цепь «оседает» в долгой перспективе; на неприводимой эргодической цепи существует единственное [[statsionarnoe-raspredelenie|стационарное распределение]].`,
		related: ['zamknutoe-mnozhestvo', 'suschestvennoe-sostoyanie', 'pogloschayuschee-sostoyanie', 'statsionarnoe-raspredelenie']
	},

	'pogloschayuschee-sostoyanie': {
		id: 'pogloschayuschee-sostoyanie',
		term: 'Поглощающее состояние',
		short: String.raw`Состояние с $p_{ii}=1$: войдя, остаёшься навсегда.`,
		formula: String.raw`p_{ii}=1`,
		body: String.raw`Состояние $u_i$ **поглощающее**, если $p_{ii}=1$: попав в него, цепь остаётся там навсегда (вся вероятность перехода замкнута на себя). Поглощающее состояние образует одноэлементное [[ergodicheskoe-mnozhestvo|эргодическое множество]] $\{u_i\}$ и, очевидно, [[suschestvennoe-sostoyanie|существенно]].

Цепь называют **поглощающей**, если есть хотя бы одно поглощающее состояние и из любого непоглощающего достижимо какое-то поглощающее. Тогда [[matrica-perehoda|матрица перехода]] приводится к канонической блочной форме.`,
		related: ['ergodicheskoe-mnozhestvo', 'suschestvennoe-sostoyanie', 'matrica-perehoda']
	},

	'neprivodimaya-cep': {
		id: 'neprivodimaya-cep',
		term: 'Неприводимая цепь',
		short: String.raw`Все состояния сообщаются — один класс.`,
		body: String.raw`[[markovskaya-cep|Цепь Маркова]] **неприводима** (неразложима), если все её состояния образуют **один** [[klass-soobschenia|класс]]: любые два состояния [[soobschayuschiesya|сообщаются]] ($u_i\leftrightarrow u_j$ для всех $i,j$). Иначе цепь **приводима**.

В неприводимой цепи все состояния имеют один тип — либо все возвратны, либо все невозвратны; у всех один период. Конечная неприводимая цепь всегда возвратна, а если ещё и апериодична — регулярна, и для неё существует предел $P^t\to W$ с единственным [[statsionarnoe-raspredelenie|стационарным распределением]].`,
		related: ['soobschayuschiesya', 'klass-soobschenia', 'statsionarnoe-raspredelenie']
	},

	'statsionarnoe-raspredelenie': {
		id: 'statsionarnoe-raspredelenie',
		term: 'Стационарное распределение',
		short: String.raw`Вектор $\omega$ с $\omega P=\omega$ и $\sum_i\omega_i=1$ — неподвижная точка цепи.`,
		formula: String.raw`\omega P=\omega,\quad \sum_i\omega_i=1`,
		body: String.raw`**Стационарное распределение** — вероятностный вектор-строка $\omega$, не меняющийся под действием [[matrica-perehoda|матрицы перехода]]: $$\omega P=\omega,\qquad \omega_i\ge0,\ \sum_i\omega_i=1.$$ Если цепь стартует из $\omega$, то распределение состояний остаётся $\omega$ на всех шагах — это «равновесие» цепи.

Для [[neprivodimaya-cep|неприводимой]] апериодической (регулярной) конечной цепи стационарное распределение **единственно** и является пределом: $P^t\to W$, где у $W$ все строки равны $\omega$. Среднее время возвращения в $u_i$ связано с ним как $\mu_i=1/\omega_i$.`,
		related: ['matrica-perehoda', 'neprivodimaya-cep', 'ergodicheskoe-mnozhestvo']
	}
};
