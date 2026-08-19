import type { Glossary } from '$lib/types';

// Термины дня 11 (Клеро–Шварц, матрица Гессе, гессиан). День должен
// резолвиться независимо, поэтому карточки, введённые раньше и нужные
// здесь по существу (частная производная, теорема Лагранжа, второй
// дифференциал), продублированы, а не только процитированы. Из общего
// глоссария берутся без переобъявления:
//   braket, skalyarnoe-pole, klassy-differenciruemosti, end-r, blacksquare.
// Карточка kriteriy-silvestra — опережающая ссылка на день 13.
export const day11Terms: Glossary = {
	'smeshannaya-proizvodnaya': {
		id: 'smeshannaya-proizvodnaya',
		term: 'Смешанная частная производная',
		short: String.raw`Дифференцируем по одной переменной, затем по другой: $f''_{xy}=(f'_x)'_y$.`,
		formula: String.raw`f''_{xy}=\frac{\partial}{\partial y}\Bigl(\frac{\partial f}{\partial x}\Bigr)`,
		body: String.raw`**Смешанная** вторая производная — та, где два дифференцирования идут по **разным** переменным: $f''_{xy}=(f'_x)'_y$ и $f''_{yx}=(f'_y)'_x$.

Индексы читаются слева направо, в порядке дифференцирования; в лейбницевой записи порядок обратный ($f''_{xy}=\frac{\partial^2 f}{\partial y\,\partial x}$) — оператор, применяемый первым, стоит справа. По [[teorema-klero|Клеро]] непрерывные смешанные совпадают, но только непрерывные: [[kontrprimer-smeshannyh|контрпример]] даёт $-1$ против $+1$.`,
		related: ['chastnaya-proizvodnaya', 'teorema-klero', 'matrica-gesse', 'kontrprimer-smeshannyh']
	},

	'teorema-klero': {
		id: 'teorema-klero',
		term: 'Теорема Клеро (Шварца)',
		short: String.raw`Непрерывные смешанные производные равны: $f''_{xy}=f''_{yx}$.`,
		formula: String.raw`\frac{\partial}{\partial x}\frac{\partial}{\partial y}=\frac{\partial}{\partial y}\frac{\partial}{\partial x}\quad (f\in C^2)`,
		body: String.raw`Гипотезы: $D\subset\mathbb R^2$ — компакт, все четыре вторые производные непрерывны на $D$. Заключение: $f''_{xy}=f''_{yx}$ в каждой точке $D$. Операторный итог: на $C^2$ частные дифференцирования коммутируют.

Доказывается через [[dvoynoe-prirashchenie|двойное приращение]], прочитанное двумя способами, с двукратным [[teorema-lagranzha|Лагранжем]]; непрерывность нужна лишь на финальном предельном переходе. Ни $f''_{xx}$, ни $f''_{yy}$ в доказательство не входят, а от компактности используется только прямоугольная окрестность точки, так что гипотезы допускают ослабление ([[teorema-shvarca|Шварц, Юнг]]).`,
		related: ['smeshannaya-proizvodnaya', 'dvoynoe-prirashchenie', 'kontrprimer-smeshannyh', 'teorema-shvarca']
	},

	'teorema-shvarca': {
		id: 'teorema-shvarca',
		term: 'Теорема Шварца (и версия Юнга)',
		short: String.raw`Те же равенства при слабых условиях: непрерывна только смешанная.`,
		body: String.raw`Равенство смешанных производных выживает при гипотезах слабее, чем непрерывность всех четырёх вторых. **Шварц**: если в окрестности точки существуют $f'_x,f'_y,f''_{xy}$, а $f''_{xy}$ непрерывна в самой точке, то $f''_{yx}$ там существует и равна $f''_{xy}$. **Юнг**: достаточно дифференцируемости обеих первых частных производных в точке, о вторых не требуется ничего.

Обе версии обходят [[kontrprimer-smeshannyh|контрпример]] стороной: там $f''_{xy}$ разрывна в нуле, а первые частные производные в нуле недифференцируемы — иначе версия Юнга уже давала бы $f''_{xy}(0,0)=f''_{yx}(0,0)$.`,
		related: ['teorema-klero', 'smeshannaya-proizvodnaya']
	},

	'dvoynoe-prirashchenie': {
		id: 'dvoynoe-prirashchenie',
		term: 'Двойное приращение Δ(h,k)',
		short: String.raw`Симметричный «крест» из четырёх значений $f$ — рабочий объект теоремы Клеро.`,
		formula: String.raw`\Delta(h,k)=f(x_0+h,y_0+k)-f(x_0+h,y_0)-f(x_0,y_0+k)+f(x_0,y_0)`,
		body: String.raw`**Двойное приращение** — разность разностей: приращение по $y$, взятое в двух точках по $x$ (или наоборот — выйдет то же самое). Как алгебраическая сумма четырёх чисел оно вообще не помнит порядка дифференцирования.

Из этой симметрии и добывается [[teorema-klero|теорема Клеро]]: два прочтения дают $\Delta=hk\,f''_{xy}(\xi,\eta)=hk\,f''_{yx}(\tilde\xi,\tilde\eta)$, где промежуточные точки поставляет [[teorema-lagranzha|Лагранж]]. Отношение $\Delta/(hk)$ — общий предшественник обеих смешанных.`,
		related: ['teorema-klero', 'teorema-lagranzha', 'kontrprimer-smeshannyh']
	},

	'kontrprimer-smeshannyh': {
		id: 'kontrprimer-smeshannyh',
		term: 'Контрпример к равенству смешанных',
		short: String.raw`$f''_{xy}(0,0)=-1$, $f''_{yx}(0,0)=1$ — без непрерывности теорема неверна.`,
		formula: String.raw`f(x,y)=\frac{xy(x^2-y^2)}{x^2+y^2},\qquad f(0,0)=0`,
		body: String.raw`Пример, показывающий, что гипотеза непрерывности в [[teorema-klero|теореме Клеро]] не декоративна. На осях функция тождественно равна нулю, поэтому $f'_x(0,y)=-y$ и $f'_y(x,0)=x$, откуда $f''_{xy}(0,0)=-1$, а $f''_{yx}(0,0)=+1$: обе [[smeshannaya-proizvodnaya|смешанные]] существуют и различаются.

Механизм виден на [[dvoynoe-prirashchenie|двойном приращении]]: $\Delta/(hk)=\frac{h^2-k^2}{h^2+k^2}$ даёт $+1$ вдоль $k=0$, $-1$ вдоль $h=0$, $0$ вдоль $k=h$ — двойного предела нет.`,
		related: ['teorema-klero', 'smeshannaya-proizvodnaya', 'dvoynoe-prirashchenie']
	},

	'matrica-gesse': {
		id: 'matrica-gesse',
		term: 'Матрица Гессе H(f)',
		short: String.raw`Матрица всех вторых частных производных; по Клеро симметрична.`,
		formula: String.raw`H(f)=\bigl(f''_{x_ix_j}\bigr)_{i,j=1}^{n}`,
		body: String.raw`**Матрица Гессе** составлена из всех вторых частных производных поля: на месте $(i,j)$ стоит $f''_{x_ix_j}$. При $i=j$ оба индекса совпадают, поэтому диагональ занимают чистые производные $f''_{x_ix_i}=\frac{\partial^2 f}{\partial x_i^2}$, а смешанные располагаются строго вне диагонали.

По [[teorema-klero|теореме Клеро]] для $f\in C^2$ она [[simmetrichnaya-matrica|симметрична]], и только поэтому [[vtoroy-differencial|второй дифференциал]] корректно пишется как квадратичная форма $(\vec{dx})^{T}H\,\vec{dx}$: несимметричная матрица своей формой не определяется — она задаёт ту же форму, что и её симметризация.`,
		related: ['gessian', 'simmetrichnaya-matrica', 'vtoroy-differencial', 'teorema-klero']
	},

	'gessian': {
		id: 'gessian',
		term: 'Гессиан',
		short: String.raw`Определитель матрицы Гессе — одно число, а не сама матрица.`,
		formula: String.raw`\det H(f)=f''_{xx}f''_{yy}-\bigl(f''_{xy}\bigr)^2`,
		body: String.raw`**Гессиан** — определитель [[matrica-gesse|матрицы Гессе]]. Для поля двух переменных $\det H=f''_{xx}f''_{yy}-(f''_{xy})^2$ — запись, в которой уже использована симметричность. Матрица и гессиан различаются типом: $H(f)$ имеет порядок $n$, гессиан есть скаляр, и совпадают они только при $n=1$.

При $n=2$ знак гессиана в стационарной точке отделяет экстремум ($>0$) от седла ($<0$); случай $\det H=0$ [[kriteriy-silvestra|критерий Сильвестра]] оставляет открытым.`,
		related: ['matrica-gesse', 'kriteriy-silvestra', 'simmetrichnaya-matrica']
	},

	'kommutirovanie-operatorov': {
		id: 'kommutirovanie-operatorov',
		term: 'Коммутирование операторов',
		short: String.raw`$AB=BA$; для композиции отображений это исключение, а не правило.`,
		formula: String.raw`\frac{\partial}{\partial x}\frac{\partial}{\partial y}=\frac{\partial}{\partial y}\frac{\partial}{\partial x}\quad\text{на }C^2`,
		body: String.raw`Два оператора **коммутируют**, если их композиция не зависит от порядка: $AB=BA$. Для отображений это редкость — поворот и отражение плоскости, например, не коммутируют, и общего правила нет.

[[teorema-klero|Теорема Клеро–Шварца]] утверждает ровно коммутирование частных дифференцирований, но не на всех функциях, а на классе $C^2$ (см. [[klassy-differenciruemosti|классы гладкости]]). [[kontrprimer-smeshannyh|Контрпример]] показывает, что вне этого класса операторы $\partial_x$ и $\partial_y$ порядок помнят: $-1$ против $+1$.`,
		related: ['teorema-klero', 'smeshannaya-proizvodnaya', 'kontrprimer-smeshannyh']
	},

	'sobstvennye-chisla': {
		id: 'sobstvennye-chisla',
		term: 'Собственные числа',
		short: String.raw`$\lambda$ с $A\vec v=\lambda\vec v$; у симметричной матрицы все вещественны.`,
		formula: String.raw`A\vec v=\lambda\vec v,\qquad \vec v\ne\bar 0`,
		body: String.raw`Число $\lambda$ называется **собственным** для оператора $A$, если он лишь растягивает некоторый ненулевой вектор: $A\vec v=\lambda\vec v$.

У [[simmetrichnaya-matrica|симметричной матрицы]] все собственные числа вещественны, а собственные векторы образуют ортогональный базис. Для [[matrica-gesse|матрицы Гессе]] отсюда прямой смысл: в этом базисе [[kvadratichnaya-forma|квадратичная форма]] $d^2f$ распадается в сумму $\sum_i\lambda_ih_i^2$, и знаки $\lambda_i$ решают вопрос об экстремуме — то же, что читает [[kriteriy-silvestra|критерий Сильвестра]] по минорам.`,
		related: ['simmetrichnaya-matrica', 'matrica-gesse', 'kvadratichnaya-forma', 'gessian']
	},

	'simmetrichnaya-matrica': {
		id: 'simmetrichnaya-matrica',
		term: 'Симметричная матрица',
		short: String.raw`$A^{T}=A$; для гессиана это ровно содержание теоремы Клеро.`,
		formula: String.raw`A^{T}=A\iff a_{ij}=a_{ji}`,
		body: String.raw`Матрица **симметрична**, если совпадает со своей транспонированной. Для [[matrica-gesse|матрицы Гессе]] это и есть [[teorema-klero|теорема Клеро]]: вне диагонали стоят смешанные производные, их равенство означает $H^{T}=H$.

Что это даёт: тождество переноса матрицы через [[braket|bra-ket]]-скобку $\langle a\mid Hb\rangle=\langle H^{T}a\mid b\rangle$ превращается в $\langle a\mid Hb\rangle=\langle Ha\mid b\rangle$; [[sobstvennye-chisla|собственные числа]] вещественны, а квадратичная форма восстанавливает свою матрицу однозначно.`,
		related: ['matrica-gesse', 'braket', 'kvadratichnaya-forma', 'kriteriy-silvestra']
	},

	'kvadratichnaya-forma': {
		id: 'kvadratichnaya-forma',
		term: 'Квадратичная форма',
		short: String.raw`Однородный многочлен 2-й степени; симметричной матрицей задаётся однозначно.`,
		formula: String.raw`Q(\vec h)=\vec h^{\,T}A\,\vec h=\sum_{i,j}a_{ij}h_ih_j`,
		body: String.raw`**Квадратичная форма** — однородный многочлен второй степени от координат, записываемый через матрицу как $\vec h^{\,T}A\vec h$. Она возникает и как $Ax^2+2Bxy+Cy^2$ с матрицей $\begin{pmatrix}A&B\\B&C\end{pmatrix}$, и как [[vtoroy-differencial|второй дифференциал]].

Соответствие «форма $\leftrightarrow$ матрица» взаимно однозначно только на [[simmetrichnaya-matrica|симметричных]] матрицах: несимметричная $A$ задаёт ту же форму, что $\tfrac12(A+A^{T})$. [[teorema-klero|Клеро]] гарантирует, что симметризовать гессиан не нужно.`,
		related: ['simmetrichnaya-matrica', 'matrica-gesse', 'vtoroy-differencial', 'kriteriy-silvestra']
	},

	'vtoroy-differencial': {
		id: 'vtoroy-differencial',
		term: 'Второй дифференциал d²f',
		short: String.raw`Квадратичная форма гессиана на векторе дифференциалов.`,
		formula: String.raw`d^2f=(\vec{dx})^{T}H(f)\,\vec{dx}=\sum_{i,j}f''_{x_ix_j}\,dx_i\,dx_j`,
		body: String.raw`**Второй дифференциал** — результат повторного применения $d$: $d^2f=d(df)$. Первый дифференциал линеен по приращениям и смешанного члена не содержит вовсе: $df=f'_x\,dx+f'_y\,dy$. Во втором такой член появляется: слагаемые $f''_{xy}\,dx\,dy$ и $f''_{yx}\,dy\,dx$ сливаются в один $2f''_{xy}\,dx\,dy$, и удвоение законно именно по [[teorema-klero|Клеро]].

В матричной форме это [[kvadratichnaya-forma|квадратичная форма]] [[matrica-gesse|гессиана]]: $d^2f=(\vec{dx})^{T}H(f)\,\vec{dx}$, где на векторе $\vec{dx}$ стоят дифференциалы координат.`,
		related: ['matrica-gesse', 'kvadratichnaya-forma', 'teorema-klero']
	},

	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная поля по одной координате при замороженных остальных.`,
		formula: String.raw`\frac{\partial f}{\partial x_i}=\lim_{\Delta x_i\to0}\frac{f(\dots,x_i+\Delta x_i,\dots)-f(\vec x)}{\Delta x_i}`,
		body: String.raw`**Частная производная** [[skalyarnoe-pole|скалярного поля]] по координате $x_i$ — обычная производная по $x_i$ при остальных координатах, зафиксированных как константы. Круглая $\partial$ в записи $\frac{\partial f}{\partial x_i}$ отличает её от $\frac{df}{dx}$ и напоминает, что переменных несколько, а заморожены все, кроме одной.

Результат — снова скалярное поле, поэтому дифференцировать можно дальше: так возникают [[smeshannaya-proizvodnaya|смешанные]] производные, а из всех вторых собирается [[matrica-gesse|матрица Гессе]].`,
		related: ['skalyarnoe-pole', 'smeshannaya-proizvodnaya', 'matrica-gesse']
	},

	'teorema-lagranzha': {
		id: 'teorema-lagranzha',
		term: 'Теорема Лагранжа о конечных приращениях',
		short: String.raw`$f(b)-f(a)=f'(c)(b-a)$ для некоторой промежуточной точки $c$.`,
		formula: String.raw`f(b)-f(a)=f'(c)\,(b-a),\qquad c\in(a,b)`,
		body: String.raw`Приращение функции на отрезке равно производной в промежуточной точке, умноженной на длину отрезка; формулируется для $f\in C^1([a,b])$ — см. [[klassy-differenciruemosti|классы гладкости]]. Геометрически: внутри отрезка найдётся точка, где касательная параллельна хорде, соединяющей концы графика.

В доказательстве [[teorema-klero|Клеро]] применяется **дважды**: превращает разность значений в значение производной в неизвестной точке внутри прямоугольника приращений.`,
		related: ['klassy-differenciruemosti', 'dvoynoe-prirashchenie', 'teorema-klero']
	},

	'kriteriy-silvestra': {
		id: 'kriteriy-silvestra',
		term: 'Критерий Сильвестра',
		short: String.raw`Знакоопределённость по угловым минорам: все «+» — минимум, «+−+−» — максимум.`,
		formula: String.raw`\Delta_1>0,\ \Delta_2>0,\ \dots,\ \Delta_n>0\ \Rightarrow\ H>0`,
		body: String.raw`**Критерий Сильвестра** определяет знакоопределённость [[kvadratichnaya-forma|квадратичной формы]] по знакам угловых миноров её матрицы: все плюсы — минимум, чередование $+,-,+,-$ — максимум.

Сформулирован **только для симметричных** матриц, поэтому применять его к [[matrica-gesse|гессиану]] позволяет [[teorema-klero|Клеро]]. Остальные комбинации знаков он не разбирает: при нулевом угловом миноре ответа нет вовсе, а полуопределённые случаи требуют всех главных миноров, а не только угловых. Подробно — день 13.`,
		related: ['matrica-gesse', 'gessian', 'simmetrichnaya-matrica', 'kvadratichnaya-forma']
	}
};
