import type { Glossary } from '$lib/types';

// Термины дня 18 (критерий интегрируемости и множество меры нуль).
export const day18Terms: Glossary = {
	'baza-melkosti': {
		id: 'baza-melkosti',
		term: 'База мелкости',
		short: String.raw`Предел берётся по семейству всех разбиений с рангом меньше $\delta$.`,
		formula: String.raw`\lim_{\lambda_R\to0}G(\lambda)=A\iff\forall\varepsilon>0\ \exists\delta>0\ \forall\lambda\ (\lambda_R<\delta):\ |G(\lambda)-A|<\varepsilon`,
		body: String.raw`[[razbienie|Разбиения]] не занумерованы, поэтому предел по ним определяют не как предел последовательности, а по базе: её элементы — множества разбиений с [[rang-razbieniya|рангом]] меньше $\delta$, они непусты и вложены друг в друга.`,
		related: ['razbienie', 'rang-razbieniya', 'baza-okrestnostey']
	},

	'klass-r': {
		id: 'klass-r',
		term: 'Класс $\\mathcal R[a;b]$',
		short: String.raw`Множество функций, интегрируемых по Риману на отрезке.`,
		formula: String.raw`\mathcal R[a;b]=\bigl\{f:\ \exists\lim_{\lambda_R\to0}I(f,\lambda,\vec\xi)\bigr\}`,
		body: String.raw`Обозначение для функций, у которых [[opredelennyy-integral|определённый интеграл]] существует: предел [[integralnaya-summa|интегральных сумм]] есть и не зависит ни от разбиения, ни от отмеченных точек.`,
		related: ['opredelennyy-integral', 'integralnaya-summa', 'kriteriy-integriruemosti']
	},

	'kriteriy-integriruemosti': {
		id: 'kriteriy-integriruemosti',
		term: 'Критерий интегрируемости Дарбу',
		short: String.raw`Ограниченная $f$ интегрируема ⟺ найдётся разбиение с $U-L<\varepsilon$.`,
		formula: String.raw`f\in\mathcal R[a;b]\iff\forall\varepsilon>0\ \exists\lambda:\ \sum_i h_i\lambda_i<\varepsilon`,
		body: String.raw`Ограниченная функция интегрируема тогда и только тогда, когда для любого $\varepsilon>0$ найдётся хотя бы одно [[razbienie|разбиение]], на котором [[summy-darbu|суммы Дарбу]] отличаются меньше чем на $\varepsilon$.`,
		related: ['summy-darbu', 'klass-r', 'razbienie']
	},

	'verhniy-nizhniy-integral': {
		id: 'verhniy-nizhniy-integral',
		term: 'Верхний и нижний интегралы',
		short: String.raw`Пара чисел, совпадение которых равносильно интегрируемости.`,
		formula: String.raw`\underline{\int_a^b}f\ \le\ \overline{\int_a^b}f`,
		body: String.raw`Общее название для [[verhniy-integral|верхнего]] и [[nizhniy-integral|нижнего]] интегралов. Неравенство между ними выполнено всегда, а равенство равносильно интегрируемости функции.`,
		related: ['verhniy-integral', 'nizhniy-integral', 'kriteriy-integriruemosti']
	},

	'mera-nol': {
		id: 'mera-nol',
		term: 'Множество меры нуль',
		short: String.raw`Накрывается счётным набором интервалов суммарной длины меньше любого $\varepsilon$.`,
		formula: String.raw`\mu(S)=0\iff\forall\varepsilon>0\ \exists\{I_k\}:\ S\subset\bigcup_k I_k,\ \sum_k|I_k|<\varepsilon`,
		body: String.raw`Множество, для которого при любом $\varepsilon>0$ найдётся [[pokrytie-intervalami|покрытие интервалами]] суммарной длины меньше $\varepsilon$. Всякое счётное множество таково; отрезок положительной длины — нет.`,
		related: ['pokrytie-intervalami', 'schetnoe-mnozhestvo']
	},

	'pokrytie-intervalami': {
		id: 'pokrytie-intervalami',
		term: 'Покрытие интервалами',
		short: String.raw`Не более чем счётное семейство интервалов, накрывающее множество.`,
		formula: String.raw`S\subset\bigcup_{k\in\mathbb N_1}I_k`,
		body: String.raw`Счётный набор интервалов, объединение которых содержит данное множество. Счётность существенна: по несчётному набору одноточечных промежутков нулевой длины накрывается что угодно.`,
		related: ['mera-nol', 'schetnoe-mnozhestvo', 'promezhutok']
	},

	'kriteriy-lebega': {
		id: 'kriteriy-lebega',
		term: 'Критерий Лебега',
		short: String.raw`Интегрируемость по Риману ⟺ ограниченность плюс мера нуль у разрывов.`,
		formula: String.raw`f\in\mathcal R[a;b]\iff f\ \text{ограничена и}\ \mu(\mathrm{Disc}\,f)=0`,
		body: String.raw`Функция интегрируема по Риману на отрезке тогда и только тогда, когда она ограничена и множество её [[tochka-razryva|точек разрыва]] имеет [[mera-nol|меру нуль]].`,
		related: ['mera-nol', 'tochka-razryva', 'klass-r']
	},

	'funkciya-dirihle': {
		id: 'funkciya-dirihle',
		term: 'Функция Дирихле',
		short: String.raw`Индикатор рациональных чисел: разрывна всюду.`,
		formula: String.raw`D(x)=\begin{cases}1,&x\in\mathbb Q,\\ 0,&x\notin\mathbb Q\end{cases}`,
		body: String.raw`Функция, равная единице в рациональных точках и нулю в остальных. На любом невырожденном промежутке её $\sup$ равен $1$, а $\inf$ — нулю, поэтому она разрывна в каждой точке и по [[kriteriy-lebega|критерию Лебега]] не интегрируема.`,
		related: ['kriteriy-lebega', 'funkciya-rimana', 'tochka-razryva']
	},

	'funkciya-rimana': {
		id: 'funkciya-rimana',
		term: 'Функция Римана',
		short: String.raw`$1/q$ в несократимой дроби $p/q$, ноль в иррациональных точках.`,
		formula: String.raw`R(x)=\begin{cases}1/q,&x=p/q\ \text{несократимо},\\ 0,&x\notin\mathbb Q\end{cases}`,
		body: String.raw`Функция, непрерывная в каждой иррациональной точке и разрывная в каждой рациональной. Множество её [[tochka-razryva|разрывов]] счётно, поэтому имеет [[mera-nol|меру нуль]], и функция интегрируема с нулевым интегралом.`,
		related: ['kriteriy-lebega', 'funkciya-dirihle', 'mera-nol']
	},

	'tochka-razryva': {
		id: 'tochka-razryva',
		term: 'Точка разрыва',
		short: String.raw`Точка, в которой нарушена непрерывность.`,
		formula: String.raw`\eta(x_0)=\lim_{\delta\to+0}\ \sup_{x,x'\in B_{x_0}(\delta)}|f(x)-f(x')|>0`,
		body: String.raw`Точка, где [[nepreryvnost|непрерывность]] не выполнена; количественно её измеряет колебание $\eta(x_0)$ — предел [[kolebanie-funkcii|колебаний]] по стягивающимся окрестностям. Разрывы делят на устранимые, первого и второго рода.`,
		related: ['nepreryvnost', 'kolebanie-funkcii', 'predel-funkcii']
	}
};
