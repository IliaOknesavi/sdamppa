import type { Glossary } from '$lib/types';

// Термины дня 22 (ch16): период состояния, моменты остановки, сильное
// марковское свойство и связанные понятия классификации цепей Маркова.
export const day22Terms: Glossary = {
	'cep-markova': {
		id: 'cep-markova',
		term: 'Цепь Маркова',
		short: String.raw`Случайный процесс $(X_t)$, где будущее зависит от прошлого только через настоящее.`,
		body: String.raw`**Цепь Маркова** — последовательность случайных величин $X_0,X_1,X_2,\dots$ со значениями в множестве состояний $S=\{u_1,u_2,\dots\}$, обладающая [[markovskoe-svoystvo|марковским свойством]]: будущее зависит от прошлого лишь через текущее состояние. Однородная цепь задаётся [[matrica-perehoda|матрицей перехода]] $P$.`,
		related: ['markovskoe-svoystvo', 'matrica-perehoda', 'silnoe-markovskoe-svoystvo']
	},

	'markovskoe-svoystvo': {
		id: 'markovskoe-svoystvo',
		term: 'Марковское свойство',
		short: String.raw`Будущее зависит от прошлого только через настоящее.`,
		formula: String.raw`P(X_{t+1}=u_j\mid X_0,\dots,X_t=u_i)=p_{ij}`,
		body: String.raw`**Марковское свойство** (отсутствие последействия): условное распределение следующего состояния зависит только от текущего, а не от всей предыстории: $$P(X_{t+1}=u_j\mid X_0,\dots,X_t=u_i)=P(X_{t+1}=u_j\mid X_t=u_i)=p_{ij}.$$ Оно сформулировано для **фиксированного** момента $t$; обобщение на случайные моменты — [[silnoe-markovskoe-svoystvo|сильное марковское свойство]].`,
		related: ['cep-markova', 'silnoe-markovskoe-svoystvo', 'matrica-perehoda']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Стохастическая матрица $P$ с элементами $p_{ij}=P(u_i\to u_j$ за шаг$)$.`,
		formula: String.raw`p_{ij}\ge0,\quad \textstyle\sum_j p_{ij}=1`,
		body: String.raw`**Матрица перехода** $P$ однородной [[cep-markova|цепи]] состоит из вероятностей перехода за один шаг $p_{ij}=P(\text{из }u_i\text{ в }u_j)$. Она **стохастическая**: $p_{ij}\ge0$ и сумма каждой строки равна $1$. Вероятности за $t$ шагов суть элементы $P^t$ и связаны [[uravnenie-chepmena|уравнением Колмогорова–Чепмена]].`,
		related: ['cep-markova', 'uravnenie-chepmena']
	},

	'uravnenie-chepmena': {
		id: 'uravnenie-chepmena',
		term: 'Уравнение Колмогорова–Чепмена',
		short: String.raw`Связь вероятностей перехода за разное число шагов: $P^{(t+s)}=P^{(t)}P^{(s)}$.`,
		formula: String.raw`p_{ij}^{(t+s)}=\sum_k p_{ik}^{(t)}\,p_{kj}^{(s)}`,
		body: String.raw`**Уравнение Колмогорова–Чепмена** склеивает переходы за $t$ и $s$ шагов через все промежуточные состояния: $$p_{ij}^{(t+s)}=\sum_k p_{ik}^{(t)}\,p_{kj}^{(s)},\qquad P^{(t+s)}=P^{(t)}P^{(s)}.$$ Отбросив все слагаемые кроме одного, получают полезное неравенство $p_{ij}^{(t+s)}\ge p_{ik}^{(t)}p_{kj}^{(s)}$ — оно показывает, что путь через конкретное состояние имеет положительную вероятность, если положительны его части.`,
		related: ['matrica-perehoda', 'period-sostoyaniya']
	},

	'period-sostoyaniya': {
		id: 'period-sostoyaniya',
		term: 'Период состояния',
		short: String.raw`НОД чисел шагов, за которые возможно возвращение в состояние.`,
		formula: String.raw`d(u_i)=\gcd\{\,t\ge1: p_{ii}^{(t)}>0\,\}`,
		body: String.raw`**Период** состояния $u_i$ — наибольший общий делитель всех длин возможных возвращений: $$d(u_i)=\gcd\{\,t\ge1: p_{ii}^{(t)}>0\,\}.$$ Возвращение возможно только за число шагов, кратное $d(u_i)$. При $d(u_i)=1$ состояние [[aperiodichnost|апериодично]] (это гарантирует, например, петля $p_{ii}>0$); при $d(u_i)>1$ — периодично. Период постоянен внутри [[klass-soobscheniya|класса сообщения]].`,
		related: ['aperiodichnost', 'klass-soobscheniya', 'soobschayuschiesya-sostoyaniya']
	},

	aperiodichnost: {
		id: 'aperiodichnost',
		term: 'Апериодичность',
		short: String.raw`Период состояния (или цепи) равен $1$.`,
		body: String.raw`Состояние **апериодично**, если его [[period-sostoyaniya|период]] равен $1$. Достаточный признак — наличие петли $p_{ii}>0$. Неприводимая цепь апериодична, если апериодично любое её состояние (период — [[soobschayuschiesya-sostoyaniya|свойство класса]]). Апериодичность необходима для существования предела $P^t\to W$: апериодическая возвратная цепь называется [[regulyarnaya-cep|регулярной]].`,
		related: ['period-sostoyaniya', 'regulyarnaya-cep', 'neprivodimaya-cep']
	},

	'soobschayuschiesya-sostoyaniya': {
		id: 'soobschayuschiesya-sostoyaniya',
		term: 'Сообщающиеся состояния',
		short: String.raw`Состояния, достижимые друг из друга: $u_i\leftrightarrow u_j$.`,
		formula: String.raw`u_i\leftrightarrow u_j`,
		body: String.raw`Состояния $u_i$ и $u_j$ **сообщаются** ($u_i\leftrightarrow u_j$), если каждое достижимо из другого: существуют $t,s$ с $p_{ij}^{(t)}>0$ и $p_{ji}^{(s)}>0$. Сообщение — отношение эквивалентности (рефлексивно, симметрично, транзитивно), разбивающее состояния на [[klass-soobscheniya|классы]].`,
		related: ['klass-soobscheniya', 'neprivodimaya-cep', 'period-sostoyaniya']
	},

	'klass-soobscheniya': {
		id: 'klass-soobscheniya',
		term: 'Класс сообщения',
		short: String.raw`Максимальное множество попарно сообщающихся состояний.`,
		body: String.raw`**Класс сообщения** — класс эквивалентности по отношению $\leftrightarrow$: максимальный набор состояний, попарно [[soobschayuschiesya-sostoyaniya|сообщающихся]]. Множество состояний разбивается классами на непересекающиеся части. Многие характеристики ([[period-sostoyaniya|период]], возвратность) постоянны внутри класса, поэтому говорят о свойствах класса в целом.`,
		related: ['soobschayuschiesya-sostoyaniya', 'neprivodimaya-cep', 'period-sostoyaniya']
	},

	'neprivodimaya-cep': {
		id: 'neprivodimaya-cep',
		term: 'Неприводимая цепь',
		short: String.raw`Все состояния образуют один класс сообщения.`,
		body: String.raw`Цепь Маркова **неприводима** (неразложима), если любые два её состояния [[soobschayuschiesya-sostoyaniya|сообщаются]], то есть весь набор состояний — один [[klass-soobscheniya|класс]]. В неприводимой цепи все состояния имеют один [[period-sostoyaniya|период]] и одинаковый тип возвратности. Неприводимая апериодическая цепь — [[regulyarnaya-cep|регулярная]].`,
		related: ['soobschayuschiesya-sostoyaniya', 'klass-soobscheniya', 'regulyarnaya-cep']
	},

	'regulyarnaya-cep': {
		id: 'regulyarnaya-cep',
		term: 'Регулярная цепь',
		short: String.raw`Неприводимая апериодическая возвратная цепь; существует предел $P^t\to W$.`,
		body: String.raw`**Регулярная** цепь — это [[neprivodimaya-cep|неприводимая]] [[aperiodichnost|апериодическая]] (и возвратная) цепь. Для неё существует предел $P^t\to W$, где $W$ — стохастическая матрица с одинаковыми строками, равными стационарному вектору $\omega$ ($\omega P=\omega$, $\sum_i\omega_i=1$). Для периодических цепей такого предела нет.`,
		related: ['neprivodimaya-cep', 'aperiodichnost', 'period-sostoyaniya']
	},

	'moment-ostanovki': {
		id: 'moment-ostanovki',
		term: 'Момент остановки',
		short: String.raw`Случайный момент $\tau$, наступление которого решается без знания будущего.`,
		formula: String.raw`\{\tau=t\}\ \text{зависит от}\ X_0,\dots,X_t`,
		body: String.raw`**Момент остановки** $\tau$ относительно цепи $(X_t)$ — случайная величина со значениями в $\{0,1,2,\dots\}\cup\{\infty\}$, для которой событие $\{\tau=t\}$ определяется только наблюдениями $X_0,\dots,X_t$ (без заглядывания в будущее). Пример — момент первого попадания $\tau_j=\min\{t\ge1: X_t=u_j\}$. «Последний визит» моментом остановки **не** является. На таких моментах работает [[silnoe-markovskoe-svoystvo|сильное марковское свойство]].`,
		related: ['silnoe-markovskoe-svoystvo', 'cep-markova', 'kriteriy-vozvratnosti']
	},

	'silnoe-markovskoe-svoystvo': {
		id: 'silnoe-markovskoe-svoystvo',
		term: 'Сильное марковское свойство',
		short: String.raw`В любой момент остановки цепь начинается заново и забывает прошлое.`,
		body: String.raw`**Сильное марковское свойство** распространяет [[markovskoe-svoystvo|марковское свойство]] на случайные [[moment-ostanovki|моменты остановки]]. Если $\tau$ — момент остановки, то при условии $\{\tau<\infty,\ X_\tau=u_i\}$ процесс $X_\tau,X_{\tau+1},\dots$ снова является [[cep-markova|цепью Маркова]] с той же матрицей $P$, стартующей из $u_i$, и не зависит от прошлого $X_0,\dots,X_\tau$. Это позволяет разбивать траекторию на независимые одинаковые «экскурсии».`,
		related: ['markovskoe-svoystvo', 'moment-ostanovki', 'kriteriy-vozvratnosti']
	},

	'kriteriy-vozvratnosti': {
		id: 'kriteriy-vozvratnosti',
		term: 'Критерий возвратности',
		short: String.raw`Состояние возвратно $\Leftrightarrow$ ряд $\sum_t p_{ii}^{(t)}$ расходится.`,
		formula: String.raw`u_i\ \text{возвратно}\iff \sum_{t=1}^{\infty} p_{ii}^{(t)}=\infty`,
		body: String.raw`**Критерий возвратности**: состояние $u_i$ возвратно ($f_{ii}=1$) тогда и только тогда, когда ряд $\sum_{t=1}^{\infty} p_{ii}^{(t)}$ расходится; невозвратно ($f_{ii}<1$) — когда сходится. Доказывается через [[silnoe-markovskoe-svoystvo|сильное марковское свойство]]: среднее число посещений равно $\sum_t p_{ii}^{(t)}$ и одновременно $\tfrac{1}{1-f_{ii}}$ по [[geometricheskoe-raspredelenie|геометрии]] числа возвращений.`,
		related: ['silnoe-markovskoe-svoystvo', 'geometricheskoe-raspredelenie', 'teorema-poyya']
	},

	'geometricheskoe-raspredelenie': {
		id: 'geometricheskoe-raspredelenie',
		term: 'Геометрическое распределение',
		short: String.raw`Число успехов/испытаний до первой неудачи в серии Бернулли.`,
		formula: String.raw`P(N=k)=p^{k}(1-p)`,
		body: String.raw`**Геометрическое распределение** описывает число успехов $N$ в серии независимых испытаний с вероятностью успеха $p$ до первой неудачи: $P(N\ge k)=p^{k}$, $P(N=k)=p^{k}(1-p)$, а среднее $\tfrac{p}{1-p}$. В теории цепей число возвращений в состояние геометрично с «успехом» $f_{ii}$ — это даёт среднее число посещений $\tfrac{1}{1-f_{ii}}$ и лежит в основе [[kriteriy-vozvratnosti|критерия возвратности]].`,
		related: ['kriteriy-vozvratnosti', 'silnoe-markovskoe-svoystvo']
	},

	'sluchaynoe-bluzhdanie': {
		id: 'sluchaynoe-bluzhdanie',
		term: 'Случайное блуждание',
		short: String.raw`Цепь на решётке $\mathbb{Z}^d$: равновероятный шаг к одному из соседей.`,
		body: String.raw`Простое симметричное **случайное блуждание** на $\mathbb{Z}^d$ — [[cep-markova|цепь Маркова]], где частица на каждом шаге равновероятно ($\tfrac{1}{2d}$) переходит в один из $2d$ соседних узлов. Это неприводимая цепь; её возвратность исследуется [[kriteriy-vozvratnosti|критерием]] через ряд $\sum_t p_{00}^{(2t)}$ и приводит к [[teorema-poyya|теореме Пойа]].`,
		related: ['teorema-poyya', 'kriteriy-vozvratnosti', 'cep-markova']
	},

	'teorema-poyya': {
		id: 'teorema-poyya',
		term: 'Теорема Пойа',
		short: String.raw`Симметричное блуждание на $\mathbb{Z}^d$ возвратно при $d=1,2$ и невозвратно при $d\ge3$.`,
		body: String.raw`**Теорема Пойа**: простое симметричное [[sluchaynoe-bluzhdanie|случайное блуждание]] на $\mathbb{Z}^d$ возвратно при $d=1$ и $d=2$ и невозвратно при $d\ge3$. Доказывается [[kriteriy-vozvratnosti|критерием возвратности]]: $p_{00}^{(2t)}\sim C_d\,t^{-d/2}$, и ряд $\sum_t t^{-d/2}$ расходится при $d\le2$, сходится при $d\ge3$. Образно (Какутани): «пьяница вернётся домой, а пьяная птица — нет».`,
		related: ['sluchaynoe-bluzhdanie', 'kriteriy-vozvratnosti']
	}
};
