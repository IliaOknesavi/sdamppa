import type { Glossary } from '$lib/types';

// Термины дня 14 (матрица Якоби, якобиан, неявная функция). Понятия из
// канонического глоссария нотации курса (sem2/glossary.ts + sem1/glossary.ts)
// здесь НЕ дублируются и подключаются перекрёстными ссылками [[...]]:
//   end-r, skalyarnoe-pole, klassy-differenciruemosti, braket, lso,
//   n-nol-n-odin, asimptoticheskie-klassy, priznak-i-svoystvo, blacksquare.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Карточки proizvodnaya-freshe, chastnaya-proizvodnaya, gradient,
// cepnoe-pravilo, matrica-gesse, teorema-o-promezhutochnom-znachenii и
// zamena-peremennyh намеренно продублированы из соседних дней, чтобы день
// резолвился независимо.
export const day14Terms: Glossary = {
	'matrica-yakobi': {
		id: 'matrica-yakobi',
		term: 'Матрица Якоби',
		short: String.raw`Таблица всех $\partial F_i/\partial x_j$; матрица производной Фреше в базисе.`,
		formula: String.raw`J_F(\vec x)=\left(\frac{\partial F_i}{\partial x_j}\right),\quad i=1,\dots,m,\ \ j=1,\dots,n`,
		body: String.raw`Семантическая единица 22. Для $F:\mathbb R^n\to\mathbb R^m$ матрица Якоби размера $m\times n$ собирает все [[chastnaya-proizvodnaya|частные производные]] координатных функций: строка — номер функции, столбец — номер переменной. Это в точности матрица оператора [[proizvodnaya-freshe|Фреше]] в стандартном базисе, потому что её столбцы — образы базисных векторов: $A\vec e_j=\partial F/\partial x_j$. При $m=1$ вырождается в [[gradient|градиент]]-строку, при $n=m=1$ — в обычную производную.`,
		related: ['yakobian', 'proizvodnaya-freshe', 'gradient', 'matrica-gesse']
	},

	yakobian: {
		id: 'yakobian',
		term: 'Якобиан',
		short: String.raw`Определитель матрицы Якоби при $n=m$; модуль — растяжение объёма.`,
		formula: String.raw`\det J_F=\frac{\partial(F_1,\dots,F_n)}{\partial(x_1,\dots,x_n)}`,
		body: String.raw`Семантическая единица 23 — **число**, а не матрица: определитель квадратной [[matrica-yakobi|матрицы Якоби]]. Та же пара, что «[[matrica-gesse|матрица Гессе]] — гессиан». Условие $\det J_F\ne0$ равносильно обратимости оператора, то есть локальной обратимости отображения; для полярной замены $\det J_F=r$, и обратимость теряется только в нуле. В теме кратных интегралов преподаватель пишет якобиан тензорно: $j^i_k=\partial\xi^i/\partial\xi^k$, тождественной замене отвечает $\delta^i_k$.`,
		related: ['matrica-yakobi', 'koefficient-rastyazheniya-obema', 'zamena-peremennyh', 'matrica-gesse']
	},

	'koefficient-rastyazheniya-obema': {
		id: 'koefficient-rastyazheniya-obema',
		term: 'Коэффициент растяжения объёма',
		short: String.raw`$|\det J|$ — во столько раз отображение меняет объём малой клетки.`,
		formula: String.raw`\lim_{t\to0}\frac{\operatorname{vol}F(Q_t)}{\operatorname{vol}Q_t}=|\det J_F(\vec x_0)|`,
		body: String.raw`Геометрический смысл [[yakobian|якобиана]]. Линейный оператор переводит единичный куб в параллелепипед объёма $|\det A|$; дифференцируемое отображение вблизи точки совпадает со своей линейной частью с точностью до $\bar o$, поэтому объём малой клетки умножается на $|\det J_F|$. Проверка на полярных координатах: клетка $[r;r+h]\times[\varphi;\varphi+h]$ переходит в сектор площади $(r+\tfrac h2)h^2$, отношение стремится к $r$. Именно этот множитель встанет под интеграл при [[zamena-peremennyh|замене переменных]].`,
		related: ['yakobian', 'zamena-peremennyh', 'proizvodnaya-freshe']
	},

	'neyavnaya-funkciya': {
		id: 'neyavnaya-funkciya',
		term: 'Неявная функция',
		short: String.raw`Функция $\varphi$, заданная уравнением $F(\vec x,z)=0$, а не формулой.`,
		formula: String.raw`F(\vec x,\varphi(\vec x))\equiv0,\qquad \varphi(\vec x_0)=z_0`,
		body: String.raw`Функция $z=\varphi(\vec x)$ называется **неявной**, если она задана не выражением, а уравнением: подстановка обращает его в тождество на целой окрестности точки. Явной формулы может не быть в принципе ($\sin(x+y)-x=0$, $\ln(x^2+y^2)-xy=0$), но производная всё равно считается — [[differencirovanie-tozhdestva|дифференцированием тождества]]. Существование и единственность $\varphi$ — содержание [[teorema-o-neyavnoy-funkcii|теоремы]], и они всегда [[lokalnaya-razreshimost|локальны]].`,
		related: ['teorema-o-neyavnoy-funkcii', 'differencirovanie-tozhdestva', 'lokalnaya-razreshimost']
	},

	'teorema-o-neyavnoy-funkcii': {
		id: 'teorema-o-neyavnoy-funkcii',
		term: 'Теорема о неявной функции',
		short: String.raw`При $F'_z\ne0$ уравнение локально задаёт единственную гладкую $\varphi$.`,
		formula: String.raw`F\in C^1,\ F(\vec x_0,z_0)=0,\ F'_z(\vec x_0,z_0)\ne0\ \Rightarrow\ \exists!\,\varphi\in C^1:\ F(\vec x,\varphi(\vec x))\equiv0`,
		body: String.raw`Теорема 15 списка. Доказательство: непрерывность $F'_z$ даёт окрестность, где производная сохраняет знак, значит по $z$ функция строго монотонна; разные знаки на концах плюс [[teorema-o-promezhutochnom-znachenii|промежуточное значение]] дают корень, монотонность — его единственность. ⚠️ В конспекте существование $\varphi$ **не доказывается**: выписаны только условия, и сразу выводится формула производной. Полное доказательство и вариант для системы (с невырожденным [[yakobian|якобианом]]) — у Зорича, Приложение 5.`,
		related: ['neyavnaya-funkciya', 'teorema-o-promezhutochnom-znachenii', 'lokalnaya-razreshimost', 'yakobian']
	},

	'lokalnaya-razreshimost': {
		id: 'lokalnaya-razreshimost',
		term: 'Локальная разрешимость',
		short: String.raw`Разрешить уравнение можно лишь в окрестности точки: у сферы две ветви $z$.`,
		formula: String.raw`x_1^2+\dots+x_n^2+z^2-5=0\ \Rightarrow\ z=\pm\sqrt{5-x_1^2-\dots-x_n^2}`,
		body: String.raw`Пример конспекта (стр. 32): сфера задаёт **две** ветви $z$, поэтому глобально функции $z(\vec x)$ нет — запись $z=\varphi(\vec x)$ осмысленна только вместе с точкой $(\vec x_0,z_0)$, к которой она привязана. Условие $F'_z=2z\ne0$ выделяет ровно те точки, где ветвь одна; на экваторе $z=0$ ветви склеиваются, и никакая, сколь угодно малая окрестность не помогает. Отсюда же требование $F(\vec x_0,z_0)=0$ во втором условии [[teorema-o-neyavnoy-funkcii|теоремы]].`,
		related: ['teorema-o-neyavnoy-funkcii', 'neyavnaya-funkciya', 'gradient']
	},

	'differencirovanie-tozhdestva': {
		id: 'differencirovanie-tozhdestva',
		term: 'Дифференцирование тождества',
		short: String.raw`Приём: подставить $\varphi$ в уравнение и продифференцировать тождество.`,
		formula: String.raw`\bigl(F(\vec x,\varphi(\vec x))\bigr)'_{x_i}=F'_{x_i}+F'_z\cdot z'_{x_i}=0\ \Rightarrow\ z'_{x_i}=-\frac{F'_{x_i}}{F'_z}`,
		body: String.raw`Сквозной приём курса: если равенство выполнено на целой окрестности, его можно дифференцировать почленно. Так получена производная обратной функции ($g(f(x))=x$ даёт $g'_f=1/f'_x$) и так же выводится производная [[neyavnaya-funkciya|неявной функции]] — [[cepnoe-pravilo|цепным правилом]] по $x_i$, с учётом $\partial x_j/\partial x_i=\delta^j_i$. ⚠️ В конспекте (стр. 33) в промежуточных строках перепутаны «$\cdot$» и «$+$», а справа стоит $F'_{x_i}$ вместо $z'_{x_i}$; итоговая формула при этом верна.`,
		related: ['neyavnaya-funkciya', 'cepnoe-pravilo', 'teorema-o-neyavnoy-funkcii']
	},

	'proizvodnaya-freshe': {
		id: 'proizvodnaya-freshe',
		term: 'Производная Фреше',
		short: String.raw`У преподавателя — предел с паразитной добавкой $A\in\bar o$, а не оператор.`,
		formula: String.raw`f'(x_0)=\lim_{\|\Delta h\|\to0}\frac{f(x_0+\Delta h)-f(x_0)+A(\Delta h)}{\|\Delta h\|},\qquad A(\Delta h)\in\bar o(\Delta h)`,
		body: String.raw`Сильная (в отличие от Гато) производная отображения нормированных пространств; день 8. ⚠️ Расхождение с литературой: у преподавателя производная — это **предел**, а $A\in\bar o$ — паразитная добавка; в учебниках производной называют сам линейный оператор $A$ из разложения $f(x_0+h)-f(x_0)=Ah+o(\|h\|)$. Именно матрица этого оператора в стандартном базисе и есть [[matrica-yakobi|матрица Якоби]], а её определитель — [[yakobian|якобиан]].`,
		related: ['matrica-yakobi', 'yakobian', 'chastnaya-proizvodnaya', 'gradient']
	},

	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная по одной переменной при остальных фиксированных.`,
		formula: String.raw`\frac{\partial f}{\partial x_i}=\lim_{t\to0}\frac{f(\vec x+t\vec e_i)-f(\vec x)}{t}`,
		body: String.raw`Производная функции нескольких переменных (ФНП) по одной координате: остальные считаются постоянными, и задача сводится к одномерной. В конспекте дифференцируемость ФНП определена именно так — «$f$ дифференцируема, если существуют все $\partial f/\partial x_i$» (что слабее настоящей дифференцируемости по [[proizvodnaya-freshe|Фреше]]). Из частных производных собираются [[gradient|градиент]], [[matrica-yakobi|матрица Якоби]] и [[matrica-gesse|матрица Гессе]].`,
		related: ['gradient', 'matrica-yakobi', 'proizvodnaya-freshe', 'matrica-gesse']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор всех частных производных скалярного поля.`,
		formula: String.raw`\nabla f=\left(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\right)`,
		body: String.raw`Вектор [[chastnaya-proizvodnaya|частных производных]] [[skalyarnoe-pole|скалярного поля]]; через него выражается производная по направлению $f'_{\vec l}=\langle\vec\nabla f\mid\vec l\rangle$. Градиент перпендикулярен поверхности уровня, поэтому условие $F'_z\ne0$ в [[teorema-o-neyavnoy-funkcii|теореме о неявной функции]] читается геометрически: у градиента есть вертикальная составляющая, то есть поверхность уровня не стоит вертикально. Как матрица — это [[matrica-yakobi|матрица Якоби]] при $m=1$.`,
		related: ['chastnaya-proizvodnaya', 'matrica-yakobi', 'teorema-o-neyavnoy-funkcii']
	},

	'cepnoe-pravilo': {
		id: 'cepnoe-pravilo',
		term: 'Цепное правило',
		short: String.raw`Производная суперпозиции — произведение внешней и внутренней.`,
		formula: String.raw`\bigl(f(g(x))\bigr)'=f'_t\bigl(g(x)\bigr)\cdot g'(x)`,
		body: String.raw`Правило дифференцирования суперпозиции; в конспекте доказано через разложение $\frac{\Delta f}{\Delta x}=\frac{\Delta f}{\Delta g}\cdot\frac{\Delta g}{\Delta x}$. Для функции нескольких переменных суммирование идёт по всем путям влияния: $\frac{dF}{dx_i}=\sum_j\frac{\partial F}{\partial u_j}\cdot\frac{\partial u_j}{\partial x_i}$ — знак «$+$» появляется только между разными переменными, а внутри слагаемого всегда произведение. Ровно на этом и построено [[differencirovanie-tozhdestva|дифференцирование тождества]].`,
		related: ['differencirovanie-tozhdestva', 'chastnaya-proizvodnaya', 'neyavnaya-funkciya']
	},

	'matrica-gesse': {
		id: 'matrica-gesse',
		term: 'Матрица Гессе',
		short: String.raw`Матрица вторых производных; её определитель — гессиан.`,
		formula: String.raw`H(f)=\left(\frac{\partial^2 f}{\partial x_i\,\partial x_j}\right),\qquad \operatorname{hess}f=\det H(f)`,
		body: String.raw`Матрица вторых [[chastnaya-proizvodnaya|частных производных]] [[skalyarnoe-pole|скалярного поля]]; симметрична по теореме Клеро–Шварца. Формально это [[matrica-yakobi|матрица Якоби]] отображения $\nabla f$, то есть $H(f)=J_{\nabla f}$ — вот почему обе единицы стоят рядом в списке. На ней строится достаточное условие экстремума через критерий Сильвестра (день 13). ⚠️ В конспекте первый диагональный элемент записан как $f''_{x_1x_2}$ вместо $f''_{x_1x_1}$.`,
		related: ['matrica-yakobi', 'gradient', 'chastnaya-proizvodnaya', 'yakobian']
	},

	'teorema-o-promezhutochnom-znachenii': {
		id: 'teorema-o-promezhutochnom-znachenii',
		term: 'Теорема о промежуточном значении',
		short: String.raw`Непрерывная на отрезке функция, меняющая знак, имеет корень.`,
		formula: String.raw`f\in C([a;b]),\ f(a)<0<f(b)\ \Rightarrow\ \exists c\in(a;b):\ f(c)=0`,
		body: String.raw`Теорема Больцано–Коши, в курсе сформулированная для непрерывного образа связного множества (в конспекте — «локальная теорема о промежуточном значении на компактной [[lso|ОЛСО]]», оставленная без доказательства). Это единственный инструмент, который **предъявляет** корень, не выписывая его. Поэтому именно она несёт существование в доказательстве [[teorema-o-neyavnoy-funkcii|теоремы о неявной функции]], а строгая монотонность добавляет единственность.`,
		related: ['teorema-o-neyavnoy-funkcii', 'lso', 'neyavnaya-funkciya']
	},

	'zamena-peremennyh': {
		id: 'zamena-peremennyh',
		term: 'Замена переменных в ℝⁿ',
		short: String.raw`Кратный интеграл при замене получает множитель $|\det J|$.`,
		formula: String.raw`\int_D f\,dV=\int_{D'}f\bigl(F(\vec u)\bigr)\,\bigl|\det J_F(\vec u)\bigr|\,dV'`,
		body: String.raw`Теорема 21 списка (день 24): при переходе к новым координатам под интегралом появляется [[koefficient-rastyazheniya-obema|коэффициент растяжения объёма]] $|\det J_F|$ — для полярных координат это множитель $r$. ⚠️ В конспекте формула записана «наоборот»: справа стоят дифференциалы новых переменных, а определитель составлен из производных новых по старым. Сам [[yakobian|якобиан]] вводится там в тензорной нотации $j^i_k=\partial\xi^i/\partial\xi^k$.`,
		related: ['yakobian', 'koefficient-rastyazheniya-obema', 'matrica-yakobi']
	}
};
