import type { Glossary } from '$lib/types';

// Термины дня 10 (дифференциалы первого и высших порядков).
export const day10Terms: Glossary = {
	'pervyy-differencial': {
		id: 'pervyy-differencial',
		term: 'Первый дифференциал скалярного поля',
		short: String.raw`Линейная форма $df=\langle\nabla f\mid\vec{dx}\rangle$.`,
		formula: String.raw`df=\sum_{i=1}^{n}\frac{\partial f}{\partial x_i}\,dx_i=\langle\nabla f\mid\vec{dx}\rangle`,
		body: String.raw`Для [[skalyarnoe-pole|скалярного поля]] первый дифференциал складывается из вкладов всех [[chastnaya-proizvodnaya|частных производных]]. Это [[lineynaya-forma|линейная форма]] от [[vektor-differencialov|вектора приращений]], коэффициентами которой служат компоненты [[gradient|градиента]].`,
		related: ['differencial', 'gradient', 'lineynaya-forma', 'vektor-differencialov']
	},

	'vtoroy-differencial': {
		id: 'vtoroy-differencial',
		term: 'Второй дифференциал скалярного поля',
		short: String.raw`Квадратичная форма от вектора приращений.`,
		formula: String.raw`d^2f=\sum_{i=1}^{n}\sum_{j=1}^{n}\frac{\partial^2f}{\partial x_i\,\partial x_j}\,dx_i\,dx_j`,
		body: String.raw`Результат повторного применения $d$ при замороженном [[vektor-differencialov|векторе приращений]]: $d^2f=d(df)$. По $\vec{dx}$ это [[odnorodnost|однородная]] форма степени два, коэффициентами которой служат [[smeshannaya-proizvodnaya|вторые частные производные]].`,
		related: ['pervyy-differencial', 'smeshannaya-proizvodnaya', 'odnorodnost']
	},

	'vektor-differencialov': {
		id: 'vektor-differencialov',
		term: 'Вектор дифференциалов',
		short: String.raw`Приращения всех координат, собранные в один вектор $\vec{dx}$.`,
		formula: String.raw`\vec{dx}=(dx_1,\ \dots,\ dx_n)`,
		body: String.raw`Набор приращений координат, записанный как один вектор. Он служит аргументом [[pervyy-differencial|первого]] и [[vtoroy-differencial|второго]] дифференциалов, что и позволяет записывать их скобкой и квадратичной формой.`,
		related: ['pervyy-differencial', 'vtoroy-differencial', 'braket']
	},

	'smeshannyy-chlen': {
		id: 'smeshannyy-chlen',
		term: 'Смешанный член $dx\\,dy$',
		short: String.raw`В первом дифференциале его нет, во втором он есть.`,
		formula: String.raw`df=f'_x\,dx+f'_y\,dy,\qquad d^2f\ni 2f''_{xy}\,dx\,dy`,
		body: String.raw`Слагаемое с произведением приращений разных координат. В [[pervyy-differencial|первом дифференциале]] его быть не может — тот [[lineynost|линеен]] по $\vec{dx}$, а произведение квадратично; во [[vtoroy-differencial|втором]] оно появляется.`,
		related: ['pervyy-differencial', 'vtoroy-differencial', 'odnorodnost']
	},

	'invariantnost-formy': {
		id: 'invariantnost-formy',
		term: 'Инвариантность формы дифференциала',
		short: String.raw`$dy=f'(u)\,du$ верно и для зависимой переменной $u$; для $d^2y$ — уже нет.`,
		formula: String.raw`dy=f'(u)\,du,\qquad d^2y=f''(u)\,du^2+f'(u)\,d^2u`,
		body: String.raw`Форма первого [[differencial|дифференциала]] не меняется при замене переменной: запись $dy=f'(u)\,du$ верна и тогда, когда $u$ сама зависит от $x$. У второго дифференциала это свойство теряется — появляется добавка $f'(u)\,d^2u$.`,
		related: ['differencial', 'vtoroy-differencial', 'cepnoe-pravilo']
	},

	'differencialy-vysshih-poryadkov': {
		id: 'differencialy-vysshih-poryadkov',
		term: 'Дифференциалы высших порядков',
		short: String.raw`$d^kf$ — однородная форма степени $k$ от вектора $\vec{dx}$.`,
		formula: String.raw`d^{k}f=\sum_{i_1}\dots\sum_{i_k}\frac{\partial^{k}f}{\partial x_{i_1}\dots\partial x_{i_k}}\,dx_{i_1}\cdots dx_{i_k}`,
		body: String.raw`Дифференциал порядка $k$ определяется рекурсивно, $d^kf=d\bigl(d^{k-1}f\bigr)$ при замороженном [[vektor-differencialov|векторе приращений]], и по этому вектору [[odnorodnost|однороден]] степени $k$.`,
		related: ['vtoroy-differencial', 'odnorodnost', 'vektor-differencialov']
	}
};
