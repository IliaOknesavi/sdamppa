import type { Glossary } from '$lib/types';

// Термины дня 14 (матрица Якоби, якобиан, теорема о неявной функции).
export const day14Terms: Glossary = {
	'matrica-yakobi': {
		id: 'matrica-yakobi',
		term: 'Матрица Якоби',
		short: String.raw`Таблица всех $\partial F_i/\partial x_j$: строка — функция, столбец — переменная.`,
		formula: String.raw`J_F(\vec x)=\left(\frac{\partial F_i}{\partial x_j}\right),\quad i=1,\dots,m,\ \ j=1,\dots,n`,
		body: String.raw`Для отображения $F:\mathbb R^n\to\mathbb R^m$ — [[matrica|матрица]] размера $m\times n$ из всех [[chastnaya-proizvodnaya|частных производных]] координатных функций. Это матрица оператора [[proizvodnaya-freshe|Фреше]] в стандартном базисе; при $m=1$ она вырождается в строку [[gradient|градиента]].`,
		related: ['matrica', 'chastnaya-proizvodnaya', 'proizvodnaya-freshe']
	},

	yakobian: {
		id: 'yakobian',
		term: 'Якобиан',
		short: String.raw`Определитель квадратной матрицы Якоби — число, а не матрица.`,
		formula: String.raw`\det J_F=\frac{\partial(F_1,\dots,F_n)}{\partial(x_1,\dots,x_n)}`,
		body: String.raw`[[opredelitel|Определитель]] [[matrica-yakobi|матрицы Якоби]] при $n=m$. Условие $\det J_F\ne0$ равносильно обратимости оператора производной в этой точке.`,
		related: ['matrica-yakobi', 'opredelitel', 'koefficient-rastyazheniya-obema']
	},

	'koefficient-rastyazheniya-obema': {
		id: 'koefficient-rastyazheniya-obema',
		term: 'Коэффициент растяжения объёма',
		short: String.raw`$|\det J|$ — во столько раз отображение меняет объём малой клетки.`,
		formula: String.raw`\lim_{t\to0}\frac{\operatorname{vol}F(Q_t)}{\operatorname{vol}Q_t}=\bigl|\det J_F(\vec x_0)\bigr|`,
		body: String.raw`Геометрический смысл [[yakobian|якобиана]]: предел отношения объёма образа малой клетки к её собственному объёму. Для полярной замены он равен $r$.`,
		related: ['yakobian', 'opredelitel']
	},

	'neyavnaya-funkciya': {
		id: 'neyavnaya-funkciya',
		term: 'Неявная функция',
		short: String.raw`Функция, заданная уравнением $F(\vec x,z)=0$, а не формулой.`,
		formula: String.raw`F(\vec x,\varphi(\vec x))\equiv0,\qquad \varphi(\vec x_0)=z_0`,
		body: String.raw`Функция $z=\varphi(\vec x)$, подстановка которой обращает уравнение в тождество на целой [[okrestnost|окрестности]] точки. Явной формулы для неё может не существовать в принципе.`,
		related: ['teorema-o-neyavnoy-funkcii', 'okrestnost', 'differencirovanie-tozhdestva']
	},

	'teorema-o-neyavnoy-funkcii': {
		id: 'teorema-o-neyavnoy-funkcii',
		term: 'Теорема о неявной функции',
		short: String.raw`При $F'_z\ne0$ уравнение локально задаёт единственную гладкую $\varphi$.`,
		formula: String.raw`F\in C^1,\ F(\vec x_0,z_0)=0,\ F'_z(\vec x_0,z_0)\ne0\ \Rightarrow\ \exists!\,\varphi\in C^1:\ F(\vec x,\varphi(\vec x))\equiv0`,
		body: String.raw`Если $F$ класса $C^1$, точка удовлетворяет уравнению и $F'_z$ в ней отлична от нуля, то в некоторой [[okrestnost|окрестности]] существует единственная [[neyavnaya-funkciya|неявная функция]] $\varphi$ класса $C^1$ с $\varphi(\vec x_0)=z_0$.`,
		related: ['neyavnaya-funkciya', 'lokalnaya-razreshimost', 'okrestnost']
	},

	'teorema-ob-obratnom-otobrazhenii': {
		id: 'teorema-ob-obratnom-otobrazhenii',
		term: 'Теорема об обратном отображении',
		short: String.raw`При $\det J_F\ne0$ отображение локально биективно, и $J_{F^{-1}}=J_F^{-1}$.`,
		formula: String.raw`\det J_F(\vec x_0)\ne0\ \Rightarrow\ F:U_0\to V_0\ \text{биективно},\quad J_{F^{-1}}=\bigl(J_F\bigr)^{-1}`,
		body: String.raw`Пусть $F:\mathbb R^n\to\mathbb R^n$ класса $C^1$ и [[yakobian|якобиан]] в точке отличен от нуля. Тогда у точки есть окрестность, на которой $F$ [[inektivnost-syuryektivnost|биективно]], обратное отображение тоже класса $C^1$, а его [[matrica-yakobi|матрица Якоби]] — обратная к $J_F$.`,
		related: ['yakobian', 'matrica-yakobi', 'inektivnost-syuryektivnost']
	},

	'sohranenie-znaka': {
		id: 'sohranenie-znaka',
		term: 'Сохранение знака непрерывной функции',
		short: String.raw`Если $f(\vec a)>0$ и $f$ непрерывна, то $f>0$ в целой окрестности.`,
		formula: String.raw`f\in C(U),\ f(\vec a)=c>0\ \Rightarrow\ \exists\delta>0:\ f>\tfrac c2\ \text{на}\ B_\delta(\vec a)`,
		body: String.raw`Следствие [[nepreryvnost|непрерывности]] при $\varepsilon=c/2$: значение не может упасть до нуля мгновенно, поэтому строгое неравенство в точке выполняется и в целом шаре вокруг неё.`,
		related: ['nepreryvnost', 'okrestnost']
	},

	'osobaya-tochka-krivoy': {
		id: 'osobaya-tochka-krivoy',
		term: 'Особая точка кривой',
		short: String.raw`Точка кривой $F=0$, в которой весь градиент обращается в нуль.`,
		formula: String.raw`F(\vec x_0)=0,\qquad \nabla F(\vec x_0)=\vec 0`,
		body: String.raw`Точка кривой, заданной уравнением, где [[gradient|градиент]] нулевой и [[teorema-o-neyavnoy-funkcii|теорема о неявной функции]] неприменима. Типичные портреты — узел (кривая пересекает себя) и остриё.`,
		related: ['gradient', 'teorema-o-neyavnoy-funkcii', 'neyavnaya-funkciya']
	},

	'lokalnaya-razreshimost': {
		id: 'lokalnaya-razreshimost',
		term: 'Локальная разрешимость',
		short: String.raw`Разрешить уравнение можно лишь в окрестности точки.`,
		formula: String.raw`x_1^2+\dots+x_n^2+z^2-5=0\ \Rightarrow\ z=\pm\sqrt{5-x_1^2-\dots-x_n^2}`,
		body: String.raw`Свойство уравнения задавать [[neyavnaya-funkciya|неявную функцию]] только вблизи конкретной точки. Сфера, например, даёт две ветви $z$, поэтому запись $z=\varphi(\vec x)$ осмысленна лишь вместе с точкой, к которой она привязана.`,
		related: ['neyavnaya-funkciya', 'teorema-o-neyavnoy-funkcii', 'okrestnost']
	},

	'differencirovanie-tozhdestva': {
		id: 'differencirovanie-tozhdestva',
		term: 'Дифференцирование тождества',
		short: String.raw`Подставить неявную функцию в уравнение и продифференцировать обе части.`,
		formula: String.raw`F'_{x_i}+F'_z\cdot z'_{x_i}=0\ \Rightarrow\ z'_{x_i}=-\frac{F'_{x_i}}{F'_z}`,
		body: String.raw`Приём: равенство, выполненное на целой окрестности, дифференцируют почленно по [[cepnoe-pravilo|цепному правилу]]. Так из уравнения получают производную [[neyavnaya-funkciya|неявной функции]], не имея её формулы.`,
		related: ['cepnoe-pravilo', 'neyavnaya-funkciya', 'teorema-o-neyavnoy-funkcii']
	},

	'teorema-o-promezhutochnom-znachenii': {
		id: 'teorema-o-promezhutochnom-znachenii',
		term: 'Теорема о промежуточном значении',
		short: String.raw`Непрерывная на отрезке функция, меняющая знак, имеет корень.`,
		formula: String.raw`f\in C([a;b]),\ f(a)<0<f(b)\ \Rightarrow\ \exists c\in(a;b):\ f(c)=0`,
		body: String.raw`Теорема Больцано–Коши: [[nepreryvnost|непрерывная]] на отрезке функция принимает все значения между $f(a)$ и $f(b)$. Она предъявляет корень, не выписывая его формулой.`,
		related: ['nepreryvnost', 'promezhutok']
	},

	'zamena-peremennyh': {
		id: 'zamena-peremennyh',
		term: 'Замена переменных в кратном интеграле',
		short: String.raw`Под интегралом появляется множитель $|\det J|$.`,
		formula: String.raw`\int_D f\,dV=\int_{D'}f\bigl(F(\vec u)\bigr)\,\bigl|\det J_F(\vec u)\bigr|\,dV'`,
		body: String.raw`При переходе к новым координатам подынтегральное выражение домножается на [[koefficient-rastyazheniya-obema|коэффициент растяжения объёма]]. Под [[yakobian|якобианом]] стоит отображение $F$, переводящее **новые** переменные в старые.`,
		related: ['yakobian', 'koefficient-rastyazheniya-obema', 'kratnyy-integral']
	}
};
