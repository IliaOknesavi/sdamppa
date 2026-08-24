import type { Glossary } from '$lib/types';

// Термины дня 11 (теорема Клеро–Шварца и матрица Гессе).
export const day11Terms: Glossary = {
	'smeshannaya-proizvodnaya': {
		id: 'smeshannaya-proizvodnaya',
		term: 'Смешанная частная производная',
		short: String.raw`Два дифференцирования по разным переменным: $f''_{xy}=(f'_x)'_y$.`,
		formula: String.raw`f''_{xy}=\frac{\partial}{\partial y}\Bigl(\frac{\partial f}{\partial x}\Bigr)`,
		body: String.raw`Вторая [[chastnaya-proizvodnaya|частная производная]], у которой два дифференцирования идут по разным переменным. Индексы в записи $f''_{xy}$ читаются слева направо, в порядке дифференцирования; в лейбницевой записи порядок обратный.`,
		related: ['chastnaya-proizvodnaya', 'teorema-klero', 'matrica-gesse']
	},

	'teorema-klero': {
		id: 'teorema-klero',
		term: 'Теорема Клеро–Шварца',
		short: String.raw`Непрерывные смешанные производные равны: $f''_{xy}=f''_{yx}$.`,
		formula: String.raw`f\in C^2(D)\ \Rightarrow\ f''_{xy}=f''_{yx}\ \text{на}\ D`,
		body: String.raw`Если все вторые частные производные [[skalyarnoe-pole|поля]] существуют и непрерывны на области, то [[smeshannaya-proizvodnaya|смешанные производные]] равны: результат не зависит от порядка дифференцирования. Без непрерывности утверждение ложно.`,
		related: ['smeshannaya-proizvodnaya', 'kontrprimer-smeshannyh', 'klassy-differenciruemosti']
	},

	'teorema-shvarca': {
		id: 'teorema-shvarca',
		term: 'Теорема Шварца',
		short: String.raw`То же равенство при более слабом условии: непрерывна только смешанная.`,
		formula: String.raw`\exists f'_x,f'_y,f''_{xy}\ \text{в}\ U,\ f''_{xy}\in C(x_0)\ \Rightarrow\ f''_{yx}(x_0)=f''_{xy}(x_0)`,
		body: String.raw`Усиление [[teorema-klero|теоремы Клеро]]: достаточно, чтобы в окрестности точки существовали $f'_x$, $f'_y$ и $f''_{xy}$, а последняя была непрерывна в самой точке; тогда $f''_{yx}$ в этой точке существует и совпадает с $f''_{xy}$.`,
		related: ['teorema-klero', 'smeshannaya-proizvodnaya']
	},

	'dvoynoe-prirashchenie': {
		id: 'dvoynoe-prirashchenie',
		term: 'Двойное приращение',
		short: String.raw`Разность разностей: сумма четырёх значений $f$ по углам прямоугольника.`,
		formula: String.raw`\Delta(h,k)=f(x_0+h,y_0+k)-f(x_0+h,y_0)-f(x_0,y_0+k)+f(x_0,y_0)`,
		body: String.raw`Алгебраическая сумма значений [[funkciya|функции]] в четырёх углах прямоугольника со сторонами $h$ и $k$. Читается и как приращение по $y$ от приращения по $x$, и наоборот — порядка эта сумма не помнит.`,
		related: ['smeshannaya-proizvodnaya', 'teorema-klero']
	},

	'kontrprimer-smeshannyh': {
		id: 'kontrprimer-smeshannyh',
		term: 'Контрпример к равенству смешанных',
		short: String.raw`$f''_{xy}(0,0)=-1$, а $f''_{yx}(0,0)=+1$.`,
		formula: String.raw`f(x,y)=\frac{xy(x^2-y^2)}{x^2+y^2},\qquad f(0,0)=0`,
		body: String.raw`Функция, у которой обе [[smeshannaya-proizvodnaya|смешанные производные]] в нуле существуют и различаются: $f''_{xy}(0,0)=-1$, $f''_{yx}(0,0)=+1$. Показывает, что условие непрерывности в [[teorema-klero|теореме Клеро]] отбросить нельзя.`,
		related: ['teorema-klero', 'smeshannaya-proizvodnaya']
	},

	'matrica-gesse': {
		id: 'matrica-gesse',
		term: 'Матрица Гессе',
		short: String.raw`Матрица всех вторых частных производных поля.`,
		formula: String.raw`H(f)=\bigl(f''_{x_ix_j}\bigr)_{i,j=1}^{n}`,
		body: String.raw`Квадратная [[matrica|матрица]], на месте $(i,j)$ которой стоит $f''_{x_ix_j}$: на диагонали чистые вторые производные, вне её — [[smeshannaya-proizvodnaya|смешанные]]. Для полей класса $C^2$ [[simmetrichnaya-matrica|симметрична]] по [[teorema-klero|теореме Клеро]].`,
		related: ['matrica', 'smeshannaya-proizvodnaya', 'simmetrichnaya-matrica', 'gessian']
	},

	gessian: {
		id: 'gessian',
		term: 'Гессиан',
		short: String.raw`Определитель матрицы Гессе — число, а не матрица.`,
		formula: String.raw`\det H(f)=f''_{xx}f''_{yy}-\bigl(f''_{xy}\bigr)^2`,
		body: String.raw`**Гессиан** — [[opredelitel|определитель]] [[matrica-gesse|матрицы Гессе]]. Матрица имеет порядок $n$, гессиан — скаляр; путать их нельзя.`,
		related: ['matrica-gesse', 'opredelitel']
	},

	'kommutirovanie-operatorov': {
		id: 'kommutirovanie-operatorov',
		term: 'Коммутирование операторов',
		short: String.raw`$AB=BA$; для композиции отображений это исключение, а не правило.`,
		formula: String.raw`AB=BA`,
		body: String.raw`Два оператора **коммутируют**, если их [[kompoziciya|композиция]] не зависит от порядка. Для отображений это редкость: поворот и отражение плоскости, например, не коммутируют.`,
		related: ['kompoziciya', 'lineynyy-operator', 'teorema-klero']
	},

	'sobstvennye-chisla': {
		id: 'sobstvennye-chisla',
		term: 'Собственные числа матрицы',
		short: String.raw`Корни характеристического уравнения $\det(A-\lambda E)=0$.`,
		formula: String.raw`A\vec v=\lambda\vec v,\qquad \vec v\ne\bar 0`,
		body: String.raw`Числа $\lambda$, при которых у уравнения $A\vec v=\lambda\vec v$ есть ненулевое решение, то есть [[sobstvennyy-vektor|собственные значения]] матрицы. У [[simmetrichnaya-matrica|симметричной матрицы]] все они вещественны.`,
		related: ['sobstvennyy-vektor', 'simmetrichnaya-matrica', 'opredelitel']
	},

	'simmetrichnaya-matrica': {
		id: 'simmetrichnaya-matrica',
		term: 'Симметричная матрица',
		short: String.raw`$A^{T}=A$, то есть $a_{ij}=a_{ji}$.`,
		formula: String.raw`A^{T}=A\iff a_{ij}=a_{ji}`,
		body: String.raw`[[matrica|Матрица]], совпадающая со своей транспонированной. Внутри [[braket|скобки]] такую матрицу можно перебрасывать с одной стороны на другую: $\langle a\mid Ab\rangle=\langle Aa\mid b\rangle$.`,
		related: ['matrica', 'braket', 'sobstvennye-chisla']
	}
};
