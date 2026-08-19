import type { Glossary } from '$lib/types';

// Термины дня 7 (скалярные поля, частные производные, градиент). Карточки,
// которыми день пользуется, но которые принадлежат общему глоссарию, здесь НЕ
// переобъявляются и подхватываются по [[...]]:
//   skalyarnoe-pole, braket, end-r, klassy-differenciruemosti, blacksquare.
// Термины, введённые здесь, намеренно дублируются в поздних днях (градиент,
// частная производная) — каждый день должен резолвиться независимо.
export const day07Terms: Glossary = {
	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная поля по одной координате при замороженных остальных.`,
		formula: String.raw`\frac{\partial f}{\partial x_i}(\vec x)=\lim_{\Delta x_i\to0}\frac{f(\dots,x_i+\Delta x_i,\dots)-f(\vec x)}{\Delta x_i}`,
		body: String.raw`**Частная производная** [[skalyarnoe-pole|скалярного поля]] по координате $x_i$ — обычная производная функции одной переменной $\varphi(t)=f(x_1,\dots,t,\dots,x_n)$, полученной замораживанием остальных координат. Отсюда значок $\partial$ вместо $d$: он напоминает, что другие переменные есть, но сейчас считаются константами ([[fop-fnp|ФНП против ФОП]]).

Эквивалентная векторная запись — предел вдоль базисного орта, $\lim_{t\to0}\frac{f(\vec x+t\vec e_i)-f(\vec x)}{t}$, то есть частный случай [[proizvodnaya-po-napravleniyu|производной по направлению]] при $\vec l=\vec e_i$. Результат — снова поле, поэтому дифференцировать можно дальше.`,
		related: ['skalyarnoe-pole', 'gradient', 'proizvodnaya-po-napravleniyu', 'fop-fnp']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных скалярного поля.`,
		formula: String.raw`\vec\nabla f=\Bigl(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\Bigr)`,
		body: String.raw`**Градиент** — вектор, составленный из всех [[chastnaya-proizvodnaya|частных производных]] поля; пишут его со стрелкой, $\vec\nabla f$. Через него в [[braket|bra-ket]]-нотации записывается производная по направлению: $f'_{\vec l}=\langle\vec\nabla f\mid\vec l\,\rangle$.

Вся геометрия темы упакована в две фразы: градиент задаёт [[napravlenie-naibystreyshego-rosta|направление наибыстрейшего роста]] со скоростью $\|\vec\nabla f\|$ и перпендикулярен множествам уровня. Условие $\vec\nabla f=\bar0$ — необходимое условие экстремума поля.`,
		related: ['chastnaya-proizvodnaya', 'skalyarnoe-pole', 'braket', 'napravlenie-naibystreyshego-rosta']
	},

	nabla: {
		id: 'nabla',
		term: 'Оператор набла',
		short: String.raw`Оператор, превращающий скалярное поле в вектор его производных.`,
		formula: String.raw`\vec\nabla=\Bigl(\frac{\partial}{\partial x_1},\ \dots,\ \frac{\partial}{\partial x_n}\Bigr)`,
		body: String.raw`**Набла** $\vec\nabla$ — один оператор вместо $n$ операторов $\partial/\partial x_i$: на входе [[skalyarnoe-pole|скалярное поле]], на выходе вектор в каждой точке. Та же идея, что и с оператором дифференцирования на [[end-r|$\operatorname{End}(\mathbb R)$]] (день 1): вместо таблицы правил один объект, применимый к чему угодно.

Применённый к полю, он даёт [[gradient|градиент]]; в записи дифференциала — $df=\langle\vec\nabla f\mid\vec{dx}\rangle$, где $\vec{dx}=(dx_1,\dots,dx_n)$.`,
		related: ['gradient', 'chastnaya-proizvodnaya', 'skalyarnoe-pole']
	},

	'fop-fnp': {
		id: 'fop-fnp',
		term: 'ФОП и ФНП',
		short: String.raw`Функция одной переменной и функция нескольких переменных.`,
		body: String.raw`**ФОП** — функция одной переменной, **ФНП** — функция нескольких переменных. Различие видно прямо в нотации: у ФОП пишут $\frac{df}{dx}$, у ФНП — $\frac{\partial f(x_1\dots x_n)}{\partial x}$.

ФНП со значениями в $\mathbb R$ — это и есть [[skalyarnoe-pole|скалярное поле]]; ФОП вида $\mathbb R\to\mathbb R$ — элемент $\operatorname{End}(\mathbb R)$. [[chastnaya-proizvodnaya|Частная производная]] переводит ФНП обратно в задачу про ФОП: заморозили всё лишнее — и считаем как в дне 1.`,
		related: ['skalyarnoe-pole', 'chastnaya-proizvodnaya', 'end-r']
	},

	kovektor: {
		id: 'kovektor',
		term: 'Ковектор',
		short: String.raw`Линейная функция на векторах; при смене базиса пересчитывается обратно.`,
		formula: String.raw`\omega(\vec h)=\sum_i\omega_i h^i,\qquad \tilde\omega=\omega A,\quad \tilde{\vec x}=A^{-1}\vec x`,
		body: String.raw`**Ковектор** — линейная функция на векторах. От вектора его отличает закон пересчёта: при смене базиса координаты вектора и координаты ковектора преобразуются противоположными матрицами, поэтому значение $\omega(\vec h)$ от базиса не зависит.

[[gradient|Градиент]] — именно ковектор: он собран из [[chastnaya-proizvodnaya|частных производных]], а не из координат точки, и на роль вектора попадает только по [[soglasovannost-po-bazisu|соглашению о базисе]]. Отождествление законно в ортонормированном базисе, где обе матрицы совпадают, — и всюду дальше базис такой.`,
		related: ['gradient', 'chastnaya-proizvodnaya', 'soglasovannost-po-bazisu']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Выражает старые координаты точки через новые: $\vec x=A\tilde{\vec x}$.`,
		formula: String.raw`\vec x=A\tilde{\vec x},\qquad A=\bigl(\tilde{\vec e}_1\ \tilde{\vec e}_2\ \dots\ \tilde{\vec e}_n\bigr)`,
		body: String.raw`Столбцы **матрицы перехода** $A$ — координаты новых базисных векторов, записанные в старом базисе. Поэтому $A$ переводит новые координаты точки в старые, $\vec x=A\tilde{\vec x}$, а не наоборот — на этом чаще всего и ошибаются.

Через неё формулируется [[soglasovannost-po-bazisu|согласованность по базису]]: [[skalyarnoe-pole|скалярное поле]] обязано пересчитываться по закону $\tilde f=f\circ A$. Для поворота на $45^\circ$ это и превращает $x^2+2y^2$ в $\tfrac32(\tilde x^2+\tilde y^2)+\tilde x\tilde y$ — другая формула, то же поле.`,
		related: ['soglasovannost-po-bazisu', 'skalyarnoe-pole', 'fop-fnp']
	},

	'kasatelnaya-ploskost': {
		id: 'kasatelnaya-ploskost',
		term: 'Касательная плоскость',
		short: String.raw`Гиперплоскость нулевых направлений: $\langle\vec\nabla f\mid\vec l\,\rangle=0$.`,
		formula: String.raw`T_{\vec x_0}=\lbrace\vec l:\ \langle\vec\nabla f(\vec x_0)\mid\vec l\,\rangle=0\rbrace`,
		body: String.raw`**Касательная плоскость** к [[poverhnost-urovnya|поверхности уровня]] в точке — множество направлений, вдоль которых [[proizvodnaya-po-napravleniyu|производная по направлению]] равна нулю. Это гиперплоскость размерности $n-1$, ортогональная [[gradient|градиенту]]; сам $\vec\nabla f$ служит для неё вектором нормали.

Существование её требует $\vec\nabla f\ne\bar 0$. В [[stacionarnaya-tochka|стационарной точке]] нулевыми оказываются сразу все направления, и плоскости нет вовсе — как у конуса $x^2+y^2=z^2$ в вершине.`,
		related: ['poverhnost-urovnya', 'gradient', 'proizvodnaya-po-napravleniyu', 'stacionarnaya-tochka']
	},

	'soglasovannost-po-bazisu': {
		id: 'soglasovannost-po-bazisu',
		term: 'Согласованность по базису',
		short: String.raw`Значение поля в точке от базиса не зависит, а формула — зависит.`,
		formula: String.raw`\tilde f(\tilde{\vec x})=f\bigl(A\tilde{\vec x}\bigr)`,
		body: String.raw`Отображение $L(\mathbb R)\to\mathbb R$ становится [[skalyarnoe-pole|скалярным полем]] только вместе с согласованностью при смене базиса. Координаты точки зависят от базиса, поэтому формула обязана пересчитываться по закону $\tilde f=f\circ A$, где $A$ — матрица перехода, чтобы значение в точке осталось прежним.

Пример: $x^2+2y^2$ в базисе, повёрнутом на $45^\circ$, превращается в $\tfrac32\tilde x^2+\tfrac32\tilde y^2+\tilde x\tilde y$ — другая формула, то же поле.`,
		related: ['skalyarnoe-pole', 'fop-fnp', 'gradient']
	},

	'liniya-urovnya': {
		id: 'liniya-urovnya',
		term: 'Линия уровня',
		short: String.raw`Множество точек поля двух переменных с одним значением.`,
		formula: String.raw`\{(x,y):\ f(x,y)=c\}`,
		body: String.raw`**Линия уровня** — множество точек, где поле двух переменных принимает одно и то же значение $c$: горизонталь на карте высот, изотерма на карте погоды, изолиния функции потерь на картинках оптимизации.

Вдоль линии уровня производная по направлению равна нулю, поэтому [[gradient|градиент]] ей перпендикулярен — доказывается дифференцированием тождества $f(\vec\gamma(t))=c$. Многомерный аналог — [[poverhnost-urovnya|поверхность уровня]].`,
		related: ['poverhnost-urovnya', 'gradient', 'napravlenie-naibystreyshego-rosta']
	},

	'poverhnost-urovnya': {
		id: 'poverhnost-urovnya',
		term: 'Поверхность уровня',
		short: String.raw`То же для поля трёх переменных: множество, где $f=c$.`,
		formula: String.raw`\{\vec x\in\mathbb R^n:\ f(\vec x)=c\}`,
		body: String.raw`**Поверхность уровня** — то же, что [[liniya-urovnya|линия уровня]], но для поля трёх (и более) переменных: множество $f(\vec x)=c$. [[gradient|Градиент]] ортогонален всей касательной плоскости к ней, поэтому $\vec\nabla f$ служит вектором нормали.

Пример: у $g=x^2+y^2-z^2$ уровень $g=1$ — однополостный гиперболоид, а уровень $g=0$ — конус $x^2+y^2=z^2$. В вершине конуса $\vec\nabla g=\bar0$ и касательной плоскости нет: это [[stacionarnaya-tochka|стационарная точка]], где геометрия градиента вырождается.`,
		related: ['liniya-urovnya', 'gradient', 'stacionarnaya-tochka']
	},

	'napravlenie-naibystreyshego-rosta': {
		id: 'napravlenie-naibystreyshego-rosta',
		term: 'Направление наибыстрейшего роста',
		short: String.raw`Единичный вектор вдоль градиента: быстрее поле не растёт никуда.`,
		formula: String.raw`\vec l_{\max}=\frac{\vec\nabla f}{\|\vec\nabla f\|},\qquad f'_{\vec l_{\max}}=\|\vec\nabla f\|`,
		body: String.raw`Среди всех единичных направлений [[proizvodnaya-po-napravleniyu|производная по направлению]] максимальна вдоль [[gradient|градиента]] и равна $\|\vec\nabla f\|$; минимальна она вдоль $-\vec\nabla f$. Доказательство — одно применение [[neravenstvo-koshi-bunyakovskogo|неравенства Коши–Буняковского]] вместе с условием равенства в нём.

Требование $\vec\nabla f\ne\bar0$ существенно: в стационарной точке все направления равноправны и выделенного нет. На этом факте стоит градиентный спуск — шаг делают против градиента.`,
		related: ['gradient', 'proizvodnaya-po-napravleniyu', 'neravenstvo-koshi-bunyakovskogo', 'liniya-urovnya']
	},

	'proizvodnaya-po-napravleniyu': {
		id: 'proizvodnaya-po-napravleniyu',
		term: 'Производная по направлению',
		short: String.raw`Скорость изменения поля вдоль единичного направления.`,
		formula: String.raw`f'_{\vec l}(\vec x)=\langle\vec\nabla f(\vec x)\mid\vec l\,\rangle`,
		body: String.raw`**Производная по направлению** $f'_{\vec l}$ — скорость изменения поля при движении из точки вдоль единичного вектора $\vec l$: $\lim_{t\to0}\frac{f(\vec x+t\vec l)-f(\vec x)}{t}$. Через [[gradient|градиент]] она записывается в [[braket|bra-ket]]-форме $f'_{\vec l}=\langle\vec\nabla f\mid\vec l\,\rangle$; доказательство — день 9.

При $\vec l=\vec e_i$ она превращается в [[chastnaya-proizvodnaya|частную производную]], поэтому частные — это $n$ значений одной и той же функции направления.`,
		related: ['gradient', 'chastnaya-proizvodnaya', 'braket', 'napravlenie-naibystreyshego-rosta']
	},

	'neravenstvo-koshi-bunyakovskogo': {
		id: 'neravenstvo-koshi-bunyakovskogo',
		term: 'Неравенство Коши–Буняковского',
		short: String.raw`Модуль скалярного произведения не больше произведения норм.`,
		formula: String.raw`\bigl|\langle\vec a\mid\vec b\rangle\bigr|\le\|\vec a\|\cdot\|\vec b\|`,
		body: String.raw`Оценка $|\langle\vec a\mid\vec b\rangle|\le\|\vec a\|\cdot\|\vec b\|$ в [[braket|bra-ket]]-записи; равенство достигается **только** при коллинеарности $\vec a$ и $\vec b$. Эквивалентная форма — $\langle\vec a\mid\vec b\rangle=\|\vec a\|\,\|\vec b\|\cos\alpha$, где $\cos\alpha\in[-1,1]$.

Именно условие равенства даёт всю теорему о [[napravlenie-naibystreyshego-rosta|наибыстрейшем росте]]: максимум проекции [[gradient|градиента]] достигается ровно на одном направлении.`,
		related: ['braket', 'gradient', 'napravlenie-naibystreyshego-rosta']
	},

	'differenciruemost-fnp': {
		id: 'differenciruemost-fnp',
		term: 'Дифференцируемость ФНП',
		short: String.raw`Существование линейного приближения приращения, а не частных производных.`,
		formula: String.raw`f(\vec x_0+\vec h)-f(\vec x_0)=\langle\vec a\mid\vec h\,\rangle+\bar o(\|\vec h\|)`,
		body: String.raw`Поле **дифференцируемо** в точке, если его приращение допускает линейное приближение с остатком $\bar o(\|\vec h\|)$; полное имя такого приближения — производная Фреше (день 8). Существование всех [[chastnaya-proizvodnaya|частных производных]] — условие строго слабее: оно даёт $n$ чисел, которые в лучшем случае служат координатами приближения, и не гарантирует даже непрерывности.

Различающий пример — $f=\frac{xy}{x^2+y^2}$, $f(0,0)=0$: обе частные производные в нуле есть, а непрерывности нет. Полная лестница «Фреше — Гато — все направления — частные» вместе с разбором этого примера — день 9; про шкалу гладкости — [[klassy-differenciruemosti|классы гладкости]].`,
		related: ['chastnaya-proizvodnaya', 'skalyarnoe-pole', 'klassy-differenciruemosti']
	},

	'stacionarnaya-tochka': {
		id: 'stacionarnaya-tochka',
		term: 'Стационарная точка',
		short: String.raw`Точка, где градиент нулевой: необходимое условие экстремума.`,
		formula: String.raw`\vec\nabla f(\vec x_0)=\bar 0`,
		body: String.raw`Точка, в которой [[gradient|градиент]] обращается в нуль. Условие $\vec\nabla f=\bar0$ — необходимое условие экстремума скалярного поля, многомерный двойник теоремы Ферма (день 4); достаточным оно не является, как и в одномерном случае.

В такой точке вырождается вся геометрия градиента: [[napravlenie-naibystreyshego-rosta|выделенного направления роста]] нет, а [[poverhnost-urovnya|поверхность уровня]] может не иметь касательной плоскости — как конус $x^2+y^2=z^2$ в вершине. Знак приращения решает уже второй порядок.`,
		related: ['gradient', 'poverhnost-urovnya', 'napravlenie-naibystreyshego-rosta']
	}
};
