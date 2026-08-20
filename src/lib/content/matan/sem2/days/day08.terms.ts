import type { Glossary } from '$lib/types';

// Термины дня 8 (производная Фреше, полунормы, локальная выпуклость).
export const day08Terms: Glossary = {
	'proizvodnaya-freshe': {
		id: 'proizvodnaya-freshe',
		term: 'Производная Фреше',
		short: String.raw`Ограниченный линейный оператор, приближающий приращение с точностью $\bar o(\|h\|)$.`,
		formula: String.raw`f(x_0+h)-f(x_0)=Ah+\alpha(h),\qquad \frac{\|\alpha(h)\|}{\|h\|}\to0,\qquad f'(x_0)=A`,
		body: String.raw`**Производной Фреше** отображения $f:H_1\to H_2$ в точке называют [[ogranichennyy-operator|ограниченный]] [[lineynyy-operator|линейный оператор]] $A$, для которого приращение равно $Ah$ с остатком $\bar o(\|h\|)$. Такой оператор единственен — поэтому запись $f'(x_0)$ корректна.`,
		related: ['lineynyy-operator', 'ogranichennyy-operator', 'differenciruemost-po-freshe']
	},

	'differenciruemost-po-freshe': {
		id: 'differenciruemost-po-freshe',
		term: 'Дифференцируемость по Фреше',
		short: String.raw`Линейное приближение существует и равномерно по направлениям.`,
		formula: String.raw`\exists A:\quad \lim_{\|h\|\to0}\frac{\|f(x_0+h)-f(x_0)-Ah\|}{\|h\|}=0`,
		body: String.raw`Отображение дифференцируемо по Фреше в точке, если в ней существует [[proizvodnaya-freshe|производная Фреше]]. Существенна **равномерность**: остаток обязан быть мал сразу для всех $h$ с $\|h\|<\delta$, а не по каждому направлению отдельно.`,
		related: ['proizvodnaya-freshe', 'proizvodnaya-gato']
	},

	'lineynyy-operator': {
		id: 'lineynyy-operator',
		term: 'Линейный оператор',
		short: String.raw`Отображение линейных пространств, сохраняющее сумму и умножение на скаляр.`,
		formula: String.raw`A(h_1+h_2)=Ah_1+Ah_2,\qquad A(\lambda h)=\lambda\,Ah`,
		body: String.raw`[[lineynost|Линейное]] отображение $A:H_1\to H_2$ [[lineynoe-prostranstvo|линейных пространств]]. В конечномерном случае задаётся [[matrica|матрицей]] в выбранном базисе.`,
		related: ['lineynost', 'lineynoe-prostranstvo', 'matrica']
	},

	'ogranichennyy-operator': {
		id: 'ogranichennyy-operator',
		term: 'Ограниченный оператор',
		short: String.raw`Линейный оператор с конечной нормой; для линейных это то же, что непрерывный.`,
		formula: String.raw`\|A\|=\sup_{\|h\|\le1}\|Ah\|<\infty`,
		body: String.raw`[[lineynyy-operator|Линейный оператор]] **ограничен**, если конечна его [[norma-operatora|норма]]. Для линейных отображений ограниченность равносильна непрерывности; в конечномерном пространстве ограничены все, так что условие содержательно лишь в бесконечномерном случае.`,
		related: ['lineynyy-operator', 'norma-operatora', 'normirovannoe-prostranstvo']
	},

	'norma-operatora': {
		id: 'norma-operatora',
		term: 'Норма оператора',
		short: String.raw`Наибольший коэффициент растяжения единичного шара.`,
		formula: String.raw`\|A\|=\sup_{\|h\|\le1}\|Ah\|=\sup_{h\ne0}\frac{\|Ah\|}{\|h\|}`,
		body: String.raw`[[supremum|Точная верхняя грань]] растяжения, которое [[lineynyy-operator|оператор]] даёт на единичном шаре. Отсюда рабочее неравенство $\|Ah\|\le\|A\|\cdot\|h\|$.`,
		related: ['lineynyy-operator', 'supremum', 'ogranichennyy-operator']
	},

	'semeystvo-polunorm': {
		id: 'semeystvo-polunorm',
		term: 'Семейство полунорм',
		short: String.raw`Набор полунорм, разделяющий точки: вне нуля хотя бы одна положительна.`,
		formula: String.raw`\forall \vec x\ne0:\quad \sum_{i}p_i(x)>0`,
		body: String.raw`Набор [[polunorma|полунорм]], которым задают топологию: [[baza-okrestnostey|базу окрестностей]] нуля образуют конечные пересечения множеств $\{x: p_i(x)<\varepsilon\}$. Условие $\sum_i p_i(x)>0$ при $x\ne0$ означает, что семейство **разделяет точки**.`,
		related: ['polunorma', 'baza-okrestnostey', 'otdelimost']
	},

	'vypukloe-mnozhestvo': {
		id: 'vypukloe-mnozhestvo',
		term: 'Выпуклое множество',
		short: String.raw`Содержит отрезок между любыми двумя своими точками.`,
		formula: String.raw`\forall \vec x,\vec y\in M\ \forall t\in[0,1]:\ \ \vec x+t(\vec y-\vec x)\in M`,
		body: String.raw`Множество, которое вместе с любыми двумя точками содержит и соединяющий их [[parametrizatsiya-otrezka|отрезок]]. Заменить отрезок на всю прямую нельзя: таких ограниченных множеств, кроме пустого и одноточечного, не бывает.`,
		related: ['parametrizatsiya-otrezka', 'lineynoe-prostranstvo']
	},

	odnorodnost: {
		id: 'odnorodnost',
		term: 'Однородность',
		short: String.raw`Растяжение аргумента выносится множителем: $F(t\vec h)=t^kF(\vec h)$.`,
		formula: String.raw`F(t\,\vec h)=t^{k}F(\vec h)`,
		body: String.raw`Функция **однородна степени $k$**, если растяжение аргумента выносится за знак функции множителем $t^k$. Норма и [[polunorma|полунорма]] однородны первой степени (с модулем $|\lambda|$), квадратичная форма — второй.`,
		related: ['polunorma', 'lineynost']
	},

	yadro: {
		id: 'yadro',
		term: 'Ядро полунормы',
		short: String.raw`Множество векторов, на которых полунорма равна нулю.`,
		formula: String.raw`\ker p=\lbrace x\in L:\ p(x)=0\rbrace`,
		body: String.raw`**Ядро** [[polunorma|полунормы]] — множество векторов, обнуляемых ею. Оно всегда линейное подпространство: [[odnorodnost|однородность]] даёт замкнутость относительно умножения на скаляр, неравенство треугольника — относительно сложения.`,
		related: ['polunorma', 'odnorodnost', 'lineynoe-prostranstvo']
	},

	otdelimost: {
		id: 'otdelimost',
		term: 'Отделимость',
		short: String.raw`Разные точки лежат в непересекающихся окрестностях.`,
		formula: String.raw`x\ne y\ \Rightarrow\ \exists\,U_x,U_y:\ U_x\cap U_y=\varnothing`,
		body: String.raw`Топология **отделима**, если любые две различные точки можно накрыть непересекающимися [[okrestnost|окрестностями]]. Без отделимости неразличимые точки ведут себя как одна и предел перестаёт быть единственным.`,
		related: ['okrestnost', 'semeystvo-polunorm']
	},

	'baza-okrestnostey': {
		id: 'baza-okrestnostey',
		term: 'База окрестностей',
		short: String.raw`Набор окрестностей, элемент которого влезает внутрь любой окрестности точки.`,
		formula: String.raw`\forall U_x\ \exists B\in\mathcal B_x:\ B\subset U_x`,
		body: String.raw`**База окрестностей** точки — такой набор её [[okrestnost|окрестностей]], что внутри всякой окрестности лежит хотя бы один элемент набора. База задаёт топологию целиком, поэтому топологию обычно и определяют базой.`,
		related: ['okrestnost', 'semeystvo-polunorm']
	},

	'lineynaya-forma': {
		id: 'lineynaya-forma',
		term: 'Линейная форма',
		short: String.raw`Линейный оператор со значениями в $\mathbb R$: вектор на входе, число на выходе.`,
		formula: String.raw`\ell(\lambda\vec h_1+\mu\vec h_2)=\lambda\ell(\vec h_1)+\mu\ell(\vec h_2)`,
		body: String.raw`**Линейная форма** (функционал) — [[lineynyy-operator|линейный оператор]] со значениями в $\mathbb R$. В $\mathbb R^n$ всякая такая форма есть скалярное произведение с одним фиксированным вектором: $\ell(\vec h)=\langle\vec a\mid\vec h\rangle$, и вектор $\vec a$ по форме восстанавливается однозначно.`,
		related: ['lineynyy-operator', 'braket', 'kovektor']
	}
};
