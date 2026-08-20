import type { Glossary } from '$lib/types';

// Термины дня 24 (замена переменных в ℝⁿ и якобиан).
export const day24Terms: Glossary = {
	'zamena-peremennyh-rn': {
		id: 'zamena-peremennyh-rn',
		term: 'Замена переменных в кратном интеграле',
		short: String.raw`Меняется область, а множителем входит модуль якобиана.`,
		formula: String.raw`\iint_D f(x,y)\,dx\,dy=\iint_{D'}f\bigl(F(u,v)\bigr)\,|J|\,du\,dv`,
		body: String.raw`Если $F:D'\to D$ — [[biektivnost-otobrazheniya|биекция]] класса $C^1$ с [[nevyrozhdennost-yakobiana|невырожденным якобианом]], а $f$ непрерывна, то интеграл по старой области равен интегралу по новой с множителем $|J|$.`,
		related: ['yakobian', 'biektivnost-otobrazheniya', 'nevyrozhdennost-yakobiana']
	},

	'koefficient-iskazheniya-ploshchadi': {
		id: 'koefficient-iskazheniya-ploshchadi',
		term: 'Коэффициент искажения площади',
		short: String.raw`Во столько раз отображение растягивает площадь малой клетки.`,
		formula: String.raw`\Delta S=|J|\cdot\Delta u\,\Delta v+\bar o(\Delta u\,\Delta v)`,
		body: String.raw`Множитель $|J|$, с которым площадь малой клетки переходит в площадь её образа. Образ клетки с точностью до $\bar o$ — параллелограмм на столбцах [[matrica-yakobi|матрицы Якоби]], а его площадь равна модулю [[opredelitel|определителя]].`,
		related: ['yakobian', 'matrica-yakobi', 'opredelitel']
	},

	'polyarnye-koordinaty': {
		id: 'polyarnye-koordinaty',
		term: 'Полярные координаты',
		short: String.raw`$x=r\cos\varphi$, $y=r\sin\varphi$; элемент площади $r\,dr\,d\varphi$.`,
		formula: String.raw`J=\det\begin{pmatrix}\cos\varphi&-r\sin\varphi\\ \sin\varphi&r\cos\varphi\end{pmatrix}=r`,
		body: String.raw`Координаты точки плоскости: расстояние до начала и угол поворота. [[yakobian|Якобиан]] перехода равен $r$, поэтому $dx\,dy=r\,dr\,d\varphi$; в начале координат замена вырождается.`,
		related: ['yakobian', 'zamena-peremennyh-rn', 'cilindricheskie-koordinaty']
	},

	'cilindricheskie-koordinaty': {
		id: 'cilindricheskie-koordinaty',
		term: 'Цилиндрические координаты',
		short: String.raw`Полярные в плоскости $xOy$ плюс нетронутая высота $z$.`,
		formula: String.raw`x=r\cos\varphi,\ y=r\sin\varphi,\ z=z;\qquad dV=r\,dr\,d\varphi\,dz`,
		body: String.raw`Координаты в пространстве: [[polyarnye-koordinaty|полярные]] в горизонтальной плоскости и обычная высота. Матрица Якоби блочная, поэтому [[yakobian|якобиан]] тот же, $J=r$.`,
		related: ['polyarnye-koordinaty', 'sfericheskie-koordinaty', 'yakobian']
	},

	'sfericheskie-koordinaty': {
		id: 'sfericheskie-koordinaty',
		term: 'Сферические координаты',
		short: String.raw`Радиус и два угла; элемент объёма $r^2\sin\theta\,dr\,d\theta\,d\varphi$.`,
		formula: String.raw`x=r\sin\theta\cos\varphi,\ y=r\sin\theta\sin\varphi,\ z=r\cos\theta;\qquad J=r^2\sin\theta`,
		body: String.raw`Координаты точки пространства: расстояние до начала, угол от оси $Oz$ и угол поворота вокруг неё. [[yakobian|Якобиан]] равен $r^2\sin\theta$; при другом соглашении об отсчёте угла $\theta$ он принимает вид $r^2\cos\theta$.`,
		related: ['polyarnye-koordinaty', 'cilindricheskie-koordinaty', 'yakobian']
	},

	'integral-eylera-puassona': {
		id: 'integral-eylera-puassona',
		term: 'Интеграл Эйлера–Пуассона',
		short: String.raw`$\int_{-\infty}^{+\infty}e^{-x^2}dx=\sqrt\pi$.`,
		formula: String.raw`\int_{-\infty}^{+\infty}e^{-x^2}dx=\sqrt\pi`,
		body: String.raw`Интеграл от гауссовой функции по всей прямой. [[pervoobraznaya|Первообразной]] в [[elementarnaya-funkciya|элементарных функциях]] подынтегральная функция не имеет, но значение интеграла вычисляется через его квадрат на плоскости.`,
		related: ['elementarnaya-funkciya', 'polyarnye-koordinaty', 'ischerpanie-oblasti']
	},

	'biektivnost-otobrazheniya': {
		id: 'biektivnost-otobrazheniya',
		term: 'Биективность замены',
		short: String.raw`Каждая точка старой области получена ровно из одной новой.`,
		formula: String.raw`\forall\,\vec x\in D\ \ \exists!\,\vec u\in D':\ F(\vec u)=\vec x`,
		body: String.raw`Требование [[inektivnost-syuryektivnost|биективности]] к отображению замены. Инъективность нужна, чтобы образы клеток не налегали друг на друга, сюръективность — чтобы они покрыли всю область.`,
		related: ['inektivnost-syuryektivnost', 'zamena-peremennyh-rn']
	},

	'nevyrozhdennost-yakobiana': {
		id: 'nevyrozhdennost-yakobiana',
		term: 'Невырожденность якобиана',
		short: String.raw`$J\ne0$ во всех точках новой области.`,
		formula: String.raw`J(\vec u)\ne0\ \ \forall\,\vec u\in D'`,
		body: String.raw`Условие $\det J\ne0$, при котором линейное приближение отображения не схлопывает клетку в множество меньшей размерности. Без него теряется локальная обратимость и не определён [[yakobian-obratnogo|обратный якобиан]].`,
		related: ['yakobian', 'opredelitel', 'yakobian-obratnogo']
	},

	'cepnoe-pravilo-otobrazheniy': {
		id: 'cepnoe-pravilo-otobrazheniy',
		term: 'Цепное правило для отображений',
		short: String.raw`Матрица Якоби композиции равна произведению матриц Якоби.`,
		formula: String.raw`J_{F\circ G}(\vec x)=J_F\bigl(G(\vec x)\bigr)\cdot J_G(\vec x)`,
		body: String.raw`Многомерная версия [[cepnoe-pravilo|цепного правила]]: [[matrica-yakobi|матрица Якоби]] [[kompoziciya|композиции]] равна произведению матриц сомножителей, взятых в соответственных точках. Порядок сомножителей менять нельзя.`,
		related: ['cepnoe-pravilo', 'matrica-yakobi', 'kompoziciya']
	},

	'multiplikativnost-opredelitelya': {
		id: 'multiplikativnost-opredelitelya',
		term: 'Мультипликативность определителя',
		short: String.raw`$\det(AB)=\det A\cdot\det B$.`,
		formula: String.raw`\det(AB)=\det A\cdot\det B,\qquad \det(A^{-1})=\frac1{\det A}`,
		body: String.raw`[[opredelitel|Определитель]] произведения [[matrica|матриц]] равен произведению определителей. Отсюда же определитель обратной матрицы — обратная величина.`,
		related: ['opredelitel', 'matrica']
	},

	'ischerpanie-oblasti': {
		id: 'ischerpanie-oblasti',
		term: 'Исчерпание области',
		short: String.raw`Растущая цепь ограниченных областей с объединением, равным всей области.`,
		formula: String.raw`D_1\subset D_2\subset\dots,\ \ \bigcup_n D_n=D,\qquad \int_D f=\lim_{n}\int_{D_n} f`,
		body: String.raw`Способ определить интеграл по неограниченной области: берут возрастающую последовательность ограниченных областей и переходят к пределу. Ответ обязан не зависеть от выбора цепи; при $f\ge0$ так и есть.`,
		related: ['kratnyy-integral', 'predel-posledovatelnosti']
	},

	'yakobian-obratnogo': {
		id: 'yakobian-obratnogo',
		term: 'Якобиан обратного отображения',
		short: String.raw`Обратная величина: $|J(F^-)|=1/|J(F)|$.`,
		formula: String.raw`\left|\frac{\partial(x,y)}{\partial(\xi,\zeta)}\right|=\frac{1}{\left|\dfrac{\partial(\xi,\zeta)}{\partial(x,y)}\right|}`,
		body: String.raw`[[yakobian|Якобиан]] обратного отображения равен обратной величине якобиана прямого. Следует из [[cepnoe-pravilo-otobrazheniy|цепного правила]] для $F\circ F^-=\mathrm{id}$ и [[multiplikativnost-opredelitelya|мультипликативности определителя]].`,
		related: ['yakobian', 'cepnoe-pravilo-otobrazheniy', 'multiplikativnost-opredelitelya']
	},

	'simvol-kronekera': {
		id: 'simvol-kronekera',
		term: 'Символ Кронекера',
		short: String.raw`$\delta^i_k$ — единица при $i=k$ и нуль иначе.`,
		formula: String.raw`\delta^i_k=\begin{cases}1,&i=k\\ 0,&i\ne k\end{cases}`,
		body: String.raw`Обозначение элементов единичной [[matrica|матрицы]]. Равенство $\partial x^i/\partial x^k=\delta^i_k$ выражает то, что [[yakobian|якобиан]] тождественного отображения равен единице.`,
		related: ['matrica', 'yakobian']
	}
};
