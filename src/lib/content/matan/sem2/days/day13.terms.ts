import type { Glossary } from '$lib/types';

// Термины дня 13 (квадратичные формы и критерий Сильвестра).
export const day13Terms: Glossary = {
	'kvadratichnaya-forma': {
		id: 'kvadratichnaya-forma',
		term: 'Квадратичная форма',
		short: String.raw`Однородный многочлен второй степени $Q(\vec h)=\langle\vec h\mid A\vec h\rangle$.`,
		formula: String.raw`Q(\vec h)=\langle\vec h\mid A\vec h\rangle=\sum_{i,j=1}^{n}a_{ij}h_ih_j,\qquad a_{ij}=a_{ji}`,
		body: String.raw`Однородный многочлен второй степени от координат вектора, записанный через [[simmetrichnaya-matrica|симметричную матрицу]] в [[braket|скобке]]. Соответствие «форма — матрица» взаимно однозначно: коэффициент при $h_ih_j$ делится поровну между $a_{ij}$ и $a_{ji}$.`,
		related: ['simmetrichnaya-matrica', 'braket', 'znakoopredelennost']
	},

	'odnorodnost-formy': {
		id: 'odnorodnost-formy',
		term: 'Однородность второй степени',
		short: String.raw`$Q(t\vec h)=t^2Q(\vec h)$.`,
		formula: String.raw`Q(t\vec h)=t^2Q(\vec h)\qquad\forall t\in\mathbb R`,
		body: String.raw`Каждое слагаемое [[kvadratichnaya-forma|квадратичной формы]] содержит ровно два множителя из $\vec h$, поэтому растяжение аргумента умножает значение на $t^2$. В частности, $Q(\vec 0)=0$ у любой формы.`,
		related: ['kvadratichnaya-forma', 'odnorodnost']
	},

	znakoopredelennost: {
		id: 'znakoopredelennost',
		term: 'Знакоопределённость формы',
		short: String.raw`Четыре класса: определённая, полуопределённая, неопределённая.`,
		formula: String.raw`Q>0\ \forall\vec h\ne\vec 0;\quad Q<0;\quad Q\ge0\ \text{с нулём};\quad Q(\vec h_+)>0>Q(\vec h_-)`,
		body: String.raw`[[kvadratichnaya-forma|Форма]] бывает положительно определённой ($Q>0$ при $\vec h\ne\vec0$), отрицательно определённой, полуопределённой (одного знака, но обнуляется на ненулевом векторе) и неопределённой (принимает оба знака). Оговорка $\vec h\ne\vec0$ обязательна.`,
		related: ['kvadratichnaya-forma', 'polozhitelno-opredelennaya', 'odnorodnost-formy']
	},

	'polozhitelno-opredelennaya': {
		id: 'polozhitelno-opredelennaya',
		term: 'Положительно определённая форма',
		short: String.raw`$Q(\vec h)>0$ при всех $\vec h\ne\vec 0$.`,
		formula: String.raw`\forall\vec h\ne\vec 0:\ \langle\vec h\mid A\vec h\rangle>0`,
		body: String.raw`[[kvadratichnaya-forma|Форма]], строго положительная на всех ненулевых векторах. По [[odnorodnost-formy|однородности]] достаточно проверить это на единичной сфере, где непрерывная форма достигает положительного минимума.`,
		related: ['znakoopredelennost', 'kriteriy-silvestra', 'kvadratichnaya-forma']
	},

	'uglovoy-minor': {
		id: 'uglovoy-minor',
		term: 'Угловой минор',
		short: String.raw`Определитель левого верхнего блока $k\times k$.`,
		formula: String.raw`\Delta_k=\det\bigl(a_{ij}\bigr)_{i,j=1}^{k},\qquad \Delta_0=1`,
		body: String.raw`[[opredelitel|Определитель]] левого верхнего блока порядка $k$ данной матрицы. Старший угловой минор $\Delta_n$ совпадает с определителем всей матрицы.`,
		related: ['opredelitel', 'matrica', 'kriteriy-silvestra']
	},

	'kriteriy-silvestra': {
		id: 'kriteriy-silvestra',
		term: 'Критерий Сильвестра',
		short: String.raw`Знакоопределённость читается по знакам угловых миноров.`,
		formula: String.raw`Q>0\iff\Delta_k>0\ \forall k;\qquad Q<0\iff(-1)^k\Delta_k>0\ \forall k`,
		body: String.raw`[[kvadratichnaya-forma|Форма]] положительно определена тогда и только тогда, когда все [[uglovoy-minor|угловые миноры]] положительны; отрицательно определена — когда их знаки чередуются, начиная с $\Delta_1<0$. При нарушении обоих условий форма может быть как неопределённой, так и полуопределённой.`,
		related: ['uglovoy-minor', 'znakoopredelennost', 'polozhitelno-opredelennaya']
	},

	'dopolnenie-shura': {
		id: 'dopolnenie-shura',
		term: 'Дополнение Шура',
		short: String.raw`Форма от $n-1$ переменных, остающаяся после выделения первого квадрата.`,
		formula: String.raw`a'_{ij}=a_{ij}-\frac{a_{1i}a_{1j}}{a_{11}}`,
		body: String.raw`Матрица [[kvadratichnaya-forma|формы]] от оставшихся $n-1$ переменных после выделения полного квадрата по первой. Её [[uglovoy-minor|угловые миноры]] связаны с исходными равенством $\Delta_{k+1}=a_{11}\Delta'_k$.`,
		related: ['kvadratichnaya-forma', 'uglovoy-minor']
	},

	kongruenciya: {
		id: 'kongruenciya',
		term: 'Конгруэнтность матриц',
		short: String.raw`$A=S^{T}DS$ — замена переменных в квадратичной форме.`,
		formula: String.raw`\vec\xi=S\vec h\ \Rightarrow\ A=S^{T}DS`,
		body: String.raw`Связь матриц одной [[kvadratichnaya-forma|формы]] в разных базисах: работает транспонирование, а не обращение, — этим конгруэнтность отличается от подобия. При $\det S=1$ определитель матрицы формы не меняется.`,
		related: ['kvadratichnaya-forma', 'matrica-perehoda', 'simmetrichnaya-matrica']
	},

	'indeks-formy': {
		id: 'indeks-formy',
		term: 'Индекс формы',
		short: String.raw`Число отрицательных квадратов в каноническом виде.`,
		formula: String.raw`Q=\sum_{k=1}^{p}\xi_k^2-\sum_{k=p+1}^{p+q}\xi_k^2,\qquad \text{индекс}=q`,
		body: String.raw`При приведении [[kvadratichnaya-forma|формы]] к сумме квадратов число плюсов $p$ и число минусов $q$ не зависят от выбранной замены — это закон инерции; $q$ и называют индексом формы.`,
		related: ['kvadratichnaya-forma', 'znakoopredelennost', 'kongruenciya']
	},

	'dostatochnoe-uslovie-ekstremuma': {
		id: 'dostatochnoe-uslovie-ekstremuma',
		term: 'Достаточное условие экстремума',
		short: String.raw`В стационарной точке тип определяется знакоопределённостью гессиана.`,
		formula: String.raw`\nabla f(\vec x_0)=\vec 0,\ \ Q(\vec h)=\langle\vec h\mid H\vec h\rangle>0\ \Rightarrow\ \vec x_0\ -\ \text{строгий минимум}`,
		body: String.raw`Пусть $f\in C^2$ и $\nabla f(\vec x_0)=\vec 0$. Если [[kvadratichnaya-forma|форма]] [[matrica-gesse|матрицы Гессе]] в этой точке положительно определена — там строгий минимум, отрицательно определена — строгий максимум, неопределённа — [[sedlovaya-tochka|седло]].`,
		related: ['matrica-gesse', 'znakoopredelennost', 'stacionarnaya-tochka', 'sedlovaya-tochka']
	},

	'sedlovaya-tochka': {
		id: 'sedlovaya-tochka',
		term: 'Седловая точка',
		short: String.raw`Стационарная точка, где форма гессиана принимает оба знака.`,
		formula: String.raw`\nabla f(\vec x_0)=\vec 0,\quad \exists\,\vec e_+,\vec e_-:\ Q(\vec e_+)>0>Q(\vec e_-)`,
		body: String.raw`[[stacionarnaya-tochka|Стационарная точка]] с неопределённой [[kvadratichnaya-forma|формой]] гессиана: вдоль одних направлений функция растёт, вдоль других убывает, поэтому экстремумом такая точка не является. Образец — $x^2-y^2$ в нуле.`,
		related: ['stacionarnaya-tochka', 'znakoopredelennost', 'dostatochnoe-uslovie-ekstremuma']
	},

	'vyrozhdennyy-sluchay': {
		id: 'vyrozhdennyy-sluchay',
		term: 'Вырожденный случай',
		short: String.raw`Форма полуопределена — второй порядок ответа не даёт.`,
		formula: String.raw`Q\ge0\ \text{и}\ \exists\,\vec h_*\ne\vec 0:\ Q(\vec h_*)=0`,
		body: String.raw`Ситуация, когда [[kvadratichnaya-forma|форма]] гессиана полуопределена: вдоль некоторого направления она обнуляется, и знак приращения решает член более высокого порядка. У $x^4+y^4$ и $x^4-y^4$ гессиан в нуле один и тот же, а точки разные.`,
		related: ['znakoopredelennost', 'dostatochnoe-uslovie-ekstremuma', 'gessian']
	}
};
