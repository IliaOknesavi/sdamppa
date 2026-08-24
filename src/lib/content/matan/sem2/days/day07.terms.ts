import type { Glossary } from '$lib/types';

// Термины дня 7 (скалярные поля, частные производные, градиент).
export const day07Terms: Glossary = {
	nabla: {
		id: 'nabla',
		term: 'Оператор набла',
		short: String.raw`$\vec\nabla$ — оператор, дающий вектор частных производных.`,
		formula: String.raw`\vec\nabla=\Bigl(\frac{\partial}{\partial x_1},\ \dots,\ \frac{\partial}{\partial x_n}\Bigr)`,
		body: String.raw`Символ $\vec\nabla$ обозначает один оператор вместо $n$ операторов $\partial/\partial x_i$: на входе [[skalyarnoe-pole|скалярное поле]], на выходе — его [[gradient|градиент]].`,
		related: ['gradient', 'chastnaya-proizvodnaya']
	},

	'fop-fnp': {
		id: 'fop-fnp',
		term: 'ФОП и ФНП',
		short: String.raw`Функция одной переменной и функция нескольких переменных.`,
		formula: String.raw`\frac{df}{dx}\quad\text{против}\quad\frac{\partial f(x_1,\dots,x_n)}{\partial x}`,
		body: String.raw`Сокращения: **ФОП** — [[funkciya|функция]] одной переменной, **ФНП** — функция нескольких переменных. Различие видно прямо в нотации: у первой пишут $\frac{df}{dx}$, у второй — $\frac{\partial f}{\partial x}$.`,
		related: ['funkciya', 'skalyarnoe-pole', 'chastnaya-proizvodnaya']
	},

	kovektor: {
		id: 'kovektor',
		term: 'Ковектор',
		short: String.raw`Линейная функция на векторах; при смене базиса пересчитывается обратно.`,
		formula: String.raw`\omega(\vec h)=\sum_i\omega_i h^i,\qquad \tilde\omega=\omega A,\quad \tilde{\vec x}=A^{-1}\vec x`,
		body: String.raw`**Ковектор** — [[lineynost|линейная]] функция на векторах. От вектора отличается законом пересчёта: при смене базиса координаты вектора и ковектора преобразуются противоположными матрицами, поэтому значение $\omega(\vec h)$ от базиса не зависит.`,
		related: ['lineynost', 'bazis-i-koordinaty', 'matrica-perehoda']
	},

	'matrica-perehoda': {
		id: 'matrica-perehoda',
		term: 'Матрица перехода',
		short: String.raw`Выражает старые координаты точки через новые: $\vec x=A\tilde{\vec x}$.`,
		formula: String.raw`\vec x=A\tilde{\vec x},\qquad A=\bigl(\tilde{\vec e}_1\ \dots\ \tilde{\vec e}_n\bigr)`,
		body: String.raw`Столбцы **матрицы перехода** $A$ — координаты новых базисных векторов, записанные в старом [[bazis-i-koordinaty|базисе]]. Поэтому $A$ переводит новые координаты точки в старые, $\vec x=A\tilde{\vec x}$, а не наоборот.`,
		related: ['bazis-i-koordinaty', 'matrica', 'soglasovannost-po-bazisu']
	},

	'kasatelnaya-ploskost': {
		id: 'kasatelnaya-ploskost',
		term: 'Касательная плоскость',
		short: String.raw`Гиперплоскость направлений, вдоль которых поле не меняется.`,
		formula: String.raw`T_{\vec x_0}=\lbrace\vec l:\ \langle\vec\nabla f(\vec x_0)\mid\vec l\,\rangle=0\rbrace`,
		body: String.raw`**Касательная плоскость** к [[poverhnost-urovnya|поверхности уровня]] в точке — множество направлений с нулевой [[proizvodnaya-po-napravleniyu|производной по направлению]]. Это гиперплоскость размерности $n-1$, для которой [[gradient|градиент]] служит нормалью; существует она лишь при $\vec\nabla f\ne\bar0$.`,
		related: ['poverhnost-urovnya', 'gradient', 'proizvodnaya-po-napravleniyu']
	},

	'soglasovannost-po-bazisu': {
		id: 'soglasovannost-po-bazisu',
		term: 'Согласованность по базису',
		short: String.raw`Значение поля в точке от базиса не зависит, а формула — зависит.`,
		formula: String.raw`\tilde f(\tilde{\vec x})=f\bigl(A\tilde{\vec x}\bigr)`,
		body: String.raw`Требование к [[skalyarnoe-pole|скалярному полю]]: при смене базиса его формула обязана пересчитываться по закону $\tilde f=f\circ A$ через [[matrica-perehoda|матрицу перехода]], чтобы значение в самой точке осталось прежним.`,
		related: ['skalyarnoe-pole', 'matrica-perehoda', 'bazis-i-koordinaty']
	},

	'liniya-urovnya': {
		id: 'liniya-urovnya',
		term: 'Линия уровня',
		short: String.raw`Множество точек, где поле двух переменных принимает одно значение.`,
		formula: String.raw`\{(x,y):\ f(x,y)=c\}`,
		body: String.raw`**Линия уровня** — [[mnozhestvo|множество]] точек, в которых [[skalyarnoe-pole|поле]] двух переменных равно одному и тому же числу $c$: горизонталь на карте высот, изотерма на карте погоды.`,
		related: ['poverhnost-urovnya', 'skalyarnoe-pole']
	},

	'poverhnost-urovnya': {
		id: 'poverhnost-urovnya',
		term: 'Поверхность уровня',
		short: String.raw`То же для поля трёх и более переменных: множество, где $f=c$.`,
		formula: String.raw`\{\vec x\in\mathbb R^n:\ f(\vec x)=c\}`,
		body: String.raw`**Поверхность уровня** — то же, что [[liniya-urovnya|линия уровня]], но для поля трёх и более переменных: множество решений уравнения $f(\vec x)=c$.`,
		related: ['liniya-urovnya', 'skalyarnoe-pole']
	},

	'napravlenie-naibystreyshego-rosta': {
		id: 'napravlenie-naibystreyshego-rosta',
		term: 'Направление наибыстрейшего роста',
		short: String.raw`Единичный вектор вдоль градиента; скорость роста равна $\|\vec\nabla f\|$.`,
		formula: String.raw`\vec l_{\max}=\frac{\vec\nabla f}{\|\vec\nabla f\|},\qquad f'_{\vec l_{\max}}=\|\vec\nabla f\|`,
		body: String.raw`Среди всех единичных направлений [[proizvodnaya-po-napravleniyu|производная по направлению]] максимальна вдоль [[gradient|градиента]] и равна его норме, минимальна — вдоль $-\vec\nabla f$. В [[stacionarnaya-tochka|стационарной точке]] выделенного направления нет.`,
		related: ['gradient', 'proizvodnaya-po-napravleniyu', 'neravenstvo-koshi-bunyakovskogo']
	},

	'proizvodnaya-po-napravleniyu': {
		id: 'proizvodnaya-po-napravleniyu',
		term: 'Производная по направлению',
		short: String.raw`Скорость изменения поля вдоль единичного вектора $\vec l$.`,
		formula: String.raw`f'_{\vec l}(\vec x)=\lim_{t\to0}\frac{f(\vec x+t\vec l)-f(\vec x)}{t}`,
		body: String.raw`Предел отношения приращения [[skalyarnoe-pole|поля]] к параметру при движении из точки вдоль единичного вектора $\vec l$. При $\vec l=\vec e_i$ превращается в [[chastnaya-proizvodnaya|частную производную]].`,
		related: ['skalyarnoe-pole', 'chastnaya-proizvodnaya', 'gradient']
	},

	'neravenstvo-koshi-bunyakovskogo': {
		id: 'neravenstvo-koshi-bunyakovskogo',
		term: 'Неравенство Коши–Буняковского',
		short: String.raw`Модуль скалярного произведения не больше произведения норм.`,
		formula: String.raw`\bigl|\langle\vec a\mid\vec b\rangle\bigr|\le\|\vec a\|\cdot\|\vec b\|`,
		body: String.raw`Для любых векторов $|\langle\vec a\mid\vec b\rangle|\le\|\vec a\|\cdot\|\vec b\|$ в [[braket|bra-ket]]-записи. Равенство достигается **только** при коллинеарности $\vec a$ и $\vec b$.`,
		related: ['braket', 'lineynoe-prostranstvo']
	},

	'differenciruemost-fnp': {
		id: 'differenciruemost-fnp',
		term: 'Дифференцируемость поля',
		short: String.raw`Приращение допускает линейное приближение с остатком $\bar o(\|\vec h\|)$.`,
		formula: String.raw`f(\vec x_0+\vec h)-f(\vec x_0)=\langle\vec a\mid\vec h\,\rangle+\bar o(\|\vec h\|)`,
		body: String.raw`[[skalyarnoe-pole|Поле]] **дифференцируемо** в точке, если его приращение представимо [[lineynost|линейной]] функцией от $\vec h$ с остатком $\bar o(\|\vec h\|)$. Существования всех [[chastnaya-proizvodnaya|частных производных]] для этого мало — они не гарантируют даже непрерывности.`,
		related: ['chastnaya-proizvodnaya', 'lineynost', 'asimptoticheskie-klassy']
	}
};
