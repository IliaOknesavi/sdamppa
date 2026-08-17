import type { Glossary } from '$lib/types';

// Термины дня 13 (квадратичные формы, критерий Сильвестра, достаточное условие
// экстремума). Понятия из канонического глоссария второго семестра
// (sem2/glossary.ts) здесь НЕ дублируются и подключаются ссылками [[...]]:
//   braket, klassy-differenciruemosti.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Карточки gradient, stacionarnaya-tochka, teorema-ferma, matrica-gesse,
// gessian и formula-teylora-pole намеренно продублированы из дней 4, 9, 11 и
// 12, чтобы день резолвился независимо.
export const day13Terms: Glossary = {
	'kvadratichnaya-forma': {
		id: 'kvadratichnaya-forma',
		term: 'Квадратичная форма',
		short: String.raw`Однородный многочлен 2-й степени $Q(\vec h)=\langle\vec h\mid A\vec h\rangle$ с симметричной $A$.`,
		formula: String.raw`Q(\vec h)=\langle\vec h\mid A\vec h\rangle=\sum_{i,j=1}^{n}a_{ij}h_ih_j,\qquad a_{ij}=a_{ji}`,
		body: String.raw`**Квадратичная форма** на $\mathbb R^n$ — однородный многочлен второй степени, записанный через симметричную матрицу в [[braket|bra-ket-форме]]. Соответствие «форма $\leftrightarrow$ матрица» в конспекте выписано явно: $Ax^2+2Bxy+Cy^2$ отвечает матрице с элементами $A,B;B,C$. Двойка перед смешанным членом делится пополам между $a_{12}$ и $a_{21}$ — иначе матрица не будет симметричной.

Однородность $Q(t\vec h)=t^2Q(\vec h)$ позволяет проверять [[znakoopredelennost|знак формы]] только на единичной сфере. Наш рабочий случай — форма [[matrica-gesse|матрицы Гессе]]: второй дифференциал скалярного поля есть в точности $Q(\vec h)$.`,
		related: ['znakoopredelennost', 'matrica-gesse', 'kriteriy-silvestra', 'braket']
	},

	znakoopredelennost: {
		id: 'znakoopredelennost',
		term: 'Знакоопределённость формы',
		short: String.raw`Четыре класса: определённая ($\pm$), полуопределённая, неопределённая.`,
		formula: String.raw`Q>0\ \forall\vec h\ne\vec 0;\quad Q<0;\quad Q\ge0\ \text{с нулём};\quad Q(\vec h_+)>0>Q(\vec h_-)`,
		body: String.raw`Классов ровно четыре: [[polozhitelno-opredelennaya|положительно определённая]] ($Q>0$ при $\vec h\ne\vec 0$), отрицательно определённая, полуопределённая ($Q\ge0$, но ноль достигается на ненулевом векторе) и неопределённая (принимает оба знака).

Оговорка $\vec h\ne\vec 0$ обязательна: $Q(\vec 0)=0$ у любой формы по однородности. Если $\det A=0$, то $A\vec h_*=\vec 0$ для некоторого $\vec h_*\ne\vec 0$, и строго определённой форма быть не может — отсюда [[vyrozhdennyy-sluchay|вырожденный случай]]. Обратное неверно: неопределённая форма бывает и при $\det A\ne0$, как $h_1^2-h_2^2$.`,
		related: ['kvadratichnaya-forma', 'polozhitelno-opredelennaya', 'sedlovaya-tochka', 'vyrozhdennyy-sluchay']
	},

	'polozhitelno-opredelennaya': {
		id: 'polozhitelno-opredelennaya',
		term: 'Положительно определённая форма',
		short: String.raw`$Q(\vec h)>0$ при всех $\vec h\ne\vec 0$; равносильно $\Delta_1,\dots,\Delta_n>0$.`,
		formula: String.raw`\forall\vec h\ne\vec 0:\ \langle\vec h\mid A\vec h\rangle>0\iff\Delta_1>0,\ \dots,\ \Delta_n>0`,
		body: String.raw`Форма положительно определена, если она строго положительна на всех ненулевых векторах. По [[kriteriy-silvestra|критерию Сильвестра]] это равносильно положительности всех [[uglovoy-minor|угловых миноров]].

Рабочее следствие, на котором держится [[dostatochnoe-uslovie-ekstremuma|достаточное условие экстремума]]: на компактной единичной сфере непрерывная $Q$ достигает минимума, поэтому $m=\min_{\|\vec e\|=1}Q(\vec e)>0$ и $Q(\vec h)\ge m\|\vec h\|^2$ — форма отделена от нуля, а не просто положительна. Отрицательная определённость — то же самое для $-Q$.`,
		related: ['znakoopredelennost', 'kriteriy-silvestra', 'dostatochnoe-uslovie-ekstremuma', 'uglovoy-minor']
	},

	'uglovoy-minor': {
		id: 'uglovoy-minor',
		term: 'Угловой минор Δ_k',
		short: String.raw`Определитель левого верхнего блока $k\times k$; $\Delta_0=1$, $\Delta_n$ — гессиан.`,
		formula: String.raw`\Delta_k=\det\bigl(a_{ij}\bigr)_{i,j=1}^{k},\qquad \Delta_0=1`,
		body: String.raw`**Угловой (ведущий главный) минор** порядка $k$ — определитель левого верхнего блока $k\times k$. В конспекте они выделены синим прямо на матрице формы. Последовательность $\Delta_1,\dots,\Delta_n$ и есть вход [[kriteriy-silvestra|критерия Сильвестра]]; старший минор $\Delta_n=\det A$ — это [[gessian|гессиан]], если $A=H$.

Смысл миноров виден из канонического вида (формула Якоби): последовательное выделение полных квадратов даёт $Q=\sum_k\frac{\Delta_k}{\Delta_{k-1}}\xi_k^2$, то есть отношения соседних миноров — это ведущие коэффициенты разложения. При $n=2$ получаем знакомое $\Delta_1=A$, $\Delta_2=AC-B^2$.`,
		related: ['kriteriy-silvestra', 'kvadratichnaya-forma', 'gessian', 'polozhitelno-opredelennaya']
	},

	'kriteriy-silvestra': {
		id: 'kriteriy-silvestra',
		term: 'Критерий Сильвестра',
		short: String.raw`Все миноры $>0$ — минимум; чередование $-,+,-$ — максимум; иначе «??».`,
		formula: String.raw`Q>0\iff\Delta_k>0\ \forall k;\qquad Q<0\iff(-1)^k\Delta_k>0\ \forall k`,
		body: String.raw`Критерий переводит [[znakoopredelennost|знакоопределённость]] в проверку знаков [[uglovoy-minor|угловых миноров]]. Доказывается индукцией через выделение полного квадрата: дополнение Шура даёт $\Delta'_k=\Delta_{k+1}/\Delta_1$, а конгруэнция $A=S^TDS$ с $\det S=1$ возвращает миноры как произведения ведущих коэффициентов. В конспекте (стр. 32) доказательства нет — только таблица знаков.

⚠️ Запись преподавателя «$+\,-\,+\,-\to$ т. макс» согласуется с классическим $\Delta_1<0,\Delta_2>0,\dots$, если считать, что список начинается с $\Delta_0=1$. Третья строка — «что угодно остальное $\to$ ?? неоднозначно» — это [[vyrozhdennyy-sluchay|вырожденный случай]].`,
		related: ['uglovoy-minor', 'znakoopredelennost', 'dostatochnoe-uslovie-ekstremuma', 'vyrozhdennyy-sluchay']
	},

	'dostatochnoe-uslovie-ekstremuma': {
		id: 'dostatochnoe-uslovie-ekstremuma',
		term: 'Достаточное условие экстремума',
		short: String.raw`При $\nabla f=\vec 0$ тип точки определяет знакоопределённость гессиана.`,
		formula: String.raw`\nabla f(\vec x_0)=\vec 0,\ Q(\vec h)=\langle\vec h\mid H\vec h\rangle>0\ \Rightarrow\ \vec x_0\ -\ \text{строгий минимум}`,
		body: String.raw`Пусть $f\in C^2$ и $\nabla f(\vec x_0)=\vec 0$ (необходимое условие — [[teorema-ferma|теорема Ферма]]). Тогда положительная определённость $H(\vec x_0)$ даёт строгий минимум, отрицательная — строгий максимум, неопределённость — [[sedlovaya-tochka|седловую точку]].

Доказательство — [[formula-teylora-pole|формула Тейлора]] второго порядка плюс два приёма: минимум $m$ формы по компактной единичной сфере отделяет её от нуля, а выбор $\varepsilon=m/4$ давит остаток $\bar o(\|\vec h\|^2)$. Радиус окрестности выписывается явно: $\delta=\delta_r(m/4)$. Обратное неверно — необходима лишь полуопределённость.`,
		related: ['kriteriy-silvestra', 'teorema-ferma', 'formula-teylora-pole', 'sedlovaya-tochka']
	},

	'sedlovaya-tochka': {
		id: 'sedlovaya-tochka',
		term: 'Седловая точка',
		short: String.raw`Стационарная точка, не являющаяся экстремумом: форма принимает оба знака.`,
		formula: String.raw`\nabla f(\vec x_0)=\vec 0,\quad \exists\,\vec e_+,\vec e_-:\ Q(\vec e_+)>0>Q(\vec e_-)`,
		body: String.raw`**Седловая точка** — [[stacionarnaya-tochka|стационарная точка]], в которой квадратичная форма гессиана неопределённая: вдоль одних направлений функция растёт, вдоль других убывает, поэтому в любой окрестности есть значения по обе стороны от $f(\vec x_0)$.

Образец — $f=x^2-y^2$ в нуле; в задачах дня такова точка $(0,0,0)$ у $e^{x^2}+8zy$ с минорами $2,0,-128$. Если $\det H\ne0$, а форма не определена ни положительно, ни отрицательно, точка гарантированно седловая — «??» [[kriteriy-silvestra|критерия]] к этому случаю не относится.`,
		related: ['stacionarnaya-tochka', 'znakoopredelennost', 'dostatochnoe-uslovie-ekstremuma', 'kriteriy-silvestra']
	},

	'vyrozhdennyy-sluchay': {
		id: 'vyrozhdennyy-sluchay',
		term: 'Вырожденный случай (det H = 0)',
		short: String.raw`Гессиан вырожден — критерий Сильвестра не отвечает: «?? неоднозначно».`,
		formula: String.raw`\det H(\vec x_0)=0\ \Rightarrow\ \text{второй порядок не решает}`,
		body: String.raw`Когда [[gessian|гессиан]] равен нулю, форма полуопределена: вдоль какого-то направления квадратичный член обнуляется, и знак приращения решают члены четвёртого порядка, которых в формуле Тейлора второго порядка нет.

Канонический пример конспекта в развёрнутом виде: у $x^4+y^4$ и $x^4-y^4$ **одна и та же** нулевая матрица Гессе в начале координат, но у первой там строгий минимум, а у второй — седло. Одинаковый вход, разный ответ: критерий, читающий только $H$, различить их не может. Именно эту границу преподаватель помечает «что угодно остальное $\to$ ?? неоднозначно».`,
		related: ['kriteriy-silvestra', 'gessian', 'znakoopredelennost', 'dostatochnoe-uslovie-ekstremuma']
	},

	'matrica-gesse': {
		id: 'matrica-gesse',
		term: 'Матрица Гессе',
		short: String.raw`Матрица вторых частных производных; симметрична по Клеро–Шварцу.`,
		formula: String.raw`H(f)=\left(\frac{\partial^2 f}{\partial x_i\,\partial x_j}\right)_{i,j=1}^{n}`,
		body: String.raw`**Матрица Гессе** скалярного поля собирает все вторые частные производные. Её симметричность — не предположение, а следствие теоремы Клеро–Шварца для $f\in C^2$; без неё [[kriteriy-silvestra|критерий Сильвестра]] неприменим, поскольку сформулирован для симметричных матриц.

Второй дифференциал есть [[kvadratichnaya-forma|квадратичная форма]] этой матрицы: $d^2f=\langle\vec h\mid H\vec h\rangle$. ⚠️ В конспекте первый диагональный элемент записан как $f''_{x_1x_2}$ вместо $f''_{x_1x_1}$ — описка, которая смещает всю диагональ, а с ней и все [[uglovoy-minor|угловые миноры]].`,
		related: ['gessian', 'kvadratichnaya-forma', 'formula-teylora-pole', 'uglovoy-minor']
	},

	gessian: {
		id: 'gessian',
		term: 'Гессиан',
		short: String.raw`Определитель матрицы Гессе; он же старший угловой минор $\Delta_n$.`,
		formula: String.raw`\det H(f)=\Delta_n`,
		body: String.raw`**Гессиан** — определитель [[matrica-gesse|матрицы Гессе]] (в курсе это отдельная семантическая единица, наравне с самой матрицей). В списке [[uglovoy-minor|угловых миноров]] он стоит последним: $\Delta_n=\det H$.

Его роль — маркер применимости: при $\det H\ne0$ точка либо экстремум, либо гарантированно седло, а при $\det H=0$ наступает [[vyrozhdennyy-sluchay|вырожденный случай]] и второй порядок ничего не решает. Тот же мотив невырожденности повторится в теореме о неявной функции ($F'_z\ne0$) и в матрице Якоби.`,
		related: ['matrica-gesse', 'uglovoy-minor', 'vyrozhdennyy-sluchay', 'kriteriy-silvestra']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных скалярного поля.`,
		formula: String.raw`\nabla f=\left(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\right)`,
		body: String.raw`**Градиент** скалярного поля — вектор его частных производных; через него производная по направлению записывается как $f'_{\vec l}=\langle\vec\nabla f\mid\vec l\rangle$ ([[braket|bra-ket]]).

Сегодня он входит в необходимое условие: [[stacionarnaya-tochka|стационарная точка]] — это решение векторного уравнения $\nabla f=\vec 0$, то есть **все** компоненты обнулены одновременно. Типичная ошибка в задачах ДЗ к КР1 № 1 — удовлетвориться одной обнулившейся частной производной: если хотя бы одна компонента постоянна и ненулевая (как $-1$ у $x^2+y^3-z+8$), стационарных точек нет вовсе.`,
		related: ['stacionarnaya-tochka', 'teorema-ferma', 'matrica-gesse', 'braket']
	},

	'stacionarnaya-tochka': {
		id: 'stacionarnaya-tochka',
		term: 'Стационарная (критическая) точка',
		short: String.raw`Точка, где градиент обнуляется: $\nabla f(\vec x_0)=\vec 0$.`,
		formula: String.raw`\nabla f(\vec x_0)=\vec 0`,
		body: String.raw`**Стационарная точка** — точка внутренней области, в которой [[gradient|градиент]] равен нулевому вектору. По [[teorema-ferma|теореме Ферма]] всякий локальный экстремум дифференцируемой функции стационарен, но не наоборот: $f=x^3$ в нуле стационарна и экстремумом не является.

Поэтому исследование на экстремум состоит из двух шагов: сначала решают $\nabla f=\vec 0$ (необходимое условие, отсеивает почти всё), затем в каждой найденной точке смотрят [[znakoopredelennost|знакоопределённость]] гессиана (достаточное условие). Если стационарных точек нет, дальше идти незачем.`,
		related: ['gradient', 'teorema-ferma', 'sedlovaya-tochka', 'dostatochnoe-uslovie-ekstremuma']
	},

	'teorema-ferma': {
		id: 'teorema-ferma',
		term: 'Теорема Ферма',
		short: String.raw`Необходимое условие экстремума: в точке л. э. производная (градиент) равна нулю.`,
		formula: String.raw`\vec x_0\ -\ \text{лок. экстремум},\ f\ \text{дифференцируема}\ \Rightarrow\ \nabla f(\vec x_0)=\vec 0`,
		body: String.raw`Теорема Ферма даёт **необходимое** условие экстремума: если $f$ дифференцируема в точке и в некоторой её окрестности, а $\vec x_0$ — локальный экстремум, то $f'(x_0)=0$ (день 4) и, в многомерном двойнике для скалярных полей, $\nabla f(\vec x_0)=\vec 0$.

Существенна открытость области: точка должна входить в неё вместе с окрестностью. Обратное утверждение неверно, и преподаватель выписывает контрпример сразу после доказательства: $f=x^3$, $f'(0)=0$, экстремума нет. Закрывает этот пробел [[dostatochnoe-uslovie-ekstremuma|достаточное условие]] через гессиан.`,
		related: ['stacionarnaya-tochka', 'gradient', 'dostatochnoe-uslovie-ekstremuma', 'klassy-differenciruemosti']
	},

	'formula-teylora-pole': {
		id: 'formula-teylora-pole',
		term: 'Формула Тейлора для скалярного поля',
		short: String.raw`Разложение до 2-го порядка: градиент в скобке плюс форма гессиана.`,
		formula: String.raw`f(\vec x_0+\vec h)=f(\vec x_0)+\langle\nabla f(\vec x_0)\mid\vec h\rangle+\tfrac12\langle\vec h\mid H\vec h\rangle+\bar o\bigl(\|\vec h\|^2\bigr)`,
		body: String.raw`Формула Тейлора для скалярного поля записывается в [[braket|bra-ket-форме]] (день 12): линейный член — скобка с [[gradient|градиентом]], квадратичный — [[kvadratichnaya-forma|форма]] [[matrica-gesse|матрицы Гессе]] с коэффициентом $\tfrac1{2!}$.

Это рабочий инструмент дня: в стационарной точке линейный член исчезает, и приращение сводится к $\tfrac12Q(\vec h)+\bar o(\|\vec h\|^2)$ — знак приращения при малых $\vec h$ решает форма. В общей записи через мультииндексы члены суммируются по $|\alpha|\le k$, но для теории экстремума достаточно двух порядков.`,
		related: ['matrica-gesse', 'kvadratichnaya-forma', 'gradient', 'dostatochnoe-uslovie-ekstremuma']
	}
};
