import type { Glossary } from '$lib/types';

// Термины дня 8: производная Фреше, полунорма, локально выпуклое линейное
// топологическое пространство. Здесь же вводится сквозная карточка kompakt —
// на неё ссылаются и другие дни курса.
// День должен резолвиться независимо, поэтому опорные понятия соседних
// дней — производная Гато, производная по направлению, градиент,
// нормированное пространство — продублированы здесь.
// НЕ дублируются термины канонического глоссария (sem2/glossary.ts и
// sem1/glossary.ts): braket, lvtnp, klassy-differenciruemosti,
// rang-razbieniya, lsk, nepravilnaya-mera-nol, n-nol-n-odin, dopolnenie,
// zamykanie, vykolotaya-okrestnost, komponenta-svyaznosti, metriki-rho,
// end-r, skalyarnoe-pole, lso, asimptoticheskie-klassy,
// skhodyashchayasya-v-sebe, chastichnaya-posledovatelnost,
// priznak-i-svoystvo, blacksquare — на них ссылаемся через [[...]].
export const day08Terms: Glossary = {
	'proizvodnaya-freshe': {
		id: 'proizvodnaya-freshe',
		term: 'Производная Фреше',
		short: String.raw`Линейный ограниченный оператор, приближающий приращение с точностью ō.`,
		formula: String.raw`f(x_0+h)-f(x_0)=Ah+\alpha(h),\qquad \frac{\|\alpha(h)\|}{\|h\|}\to0,\qquad f'(x_0)=A`,
		body: String.raw`Сильная производная отображения нормированных пространств $f:H_1\to H_2$: [[ogranichennyy-operator|ограниченный]] [[lineynyy-operator|линейный оператор]] $A$, приближающий приращение с остатком порядка $\bar o(\|h\|)$. Оператор единственный, поэтому запись $f'(x_0)$ корректна. Производной называют именно оператор, а не предел: запись $\lim\frac{\Delta f+A(\Delta h)}{\|\Delta h\|}$ с добавкой $A\in\bar o$ верна при любой ō-малой $A$ и потому не выделяет никакого объекта.`,
		related: ['differenciruemost-po-freshe', 'lineynyy-operator', 'ogranichennyy-operator', 'proizvodnaya-gato']
	},

	'differenciruemost-po-freshe': {
		id: 'differenciruemost-po-freshe',
		term: 'Дифференцируемость по Фреше',
		short: String.raw`Существование линейного приближения приращения, равномерного по направлениям.`,
		formula: String.raw`\exists A:\quad \lim_{\|h\|\to0}\frac{\|f(x_0+h)-f(x_0)-Ah\|}{\|h\|}=0`,
		body: String.raw`Свойство точки, а не функции целиком: $f$ дифференцируема по Фреше в $x_0$, если существует [[proizvodnaya-freshe|производная Фреше]] в этой точке. Влечёт непрерывность в $x_0$ и существование [[proizvodnaya-gato|производной Гато]] по всем направлениям; обратное неверно. Ключевое слово — **равномерность**: остаток обязан быть мал сразу для всех $h$ с $\|h\|<\delta$, тогда как Гато проверяет каждый луч отдельно.`,
		related: ['proizvodnaya-freshe', 'proizvodnaya-gato', 'ogranichennyy-operator']
	},

	'lineynyy-operator': {
		id: 'lineynyy-operator',
		term: 'Линейный оператор',
		short: String.raw`Отображение, сохраняющее сумму и умножение на скаляр.`,
		formula: String.raw`A(h_1+h_2)=Ah_1+Ah_2,\qquad A(\lambda h)=\lambda\,Ah`,
		body: String.raw`Отображение $A:H_1\to H_2$ линейных пространств, перестановочное со сложением и умножением на скаляр. Именно линейность возвращает то, что теряет норма приращения: $A$ помнит, что делать с каждым направлением. Знакомый пример — оператор дифференцирования $\frac{d}{dx}$ на многочленах: его аргументы суть элементы [[end-r|$\mathrm{End}(\mathbb R)$]], а в базисе мономов он задаётся матрицей. В конечномерном случае линейный оператор задаётся матрицей; для [[proizvodnaya-freshe|производной Фреше]] такой матрицей служит матрица Якоби.`,
		related: ['ogranichennyy-operator', 'proizvodnaya-freshe', 'norma-operatora', 'end-r']
	},

	'ogranichennyy-operator': {
		id: 'ogranichennyy-operator',
		term: 'Ограниченный оператор',
		short: String.raw`Линейный оператор с конечной нормой; для линейных это то же, что непрерывный.`,
		formula: String.raw`\|A\|=\sup_{\|h\|\le1}\|Ah\|<\infty\ \iff\ A\in C(H_1)`,
		body: String.raw`[[lineynyy-operator|Линейный оператор]] называется ограниченным, если конечна его [[norma-operatora|норма]]. Для линейных отображений ограниченность равносильна непрерывности (и даже непрерывности в одной точке) — это и есть причина, по которой её включают в определение [[proizvodnaya-freshe|производной Фреше]]: без неё оценка $\|Ah\|\le\|A\|\,\|h\|$ недоступна и непрерывность $f$ не выводится. При $\dim H_1<\infty$ всякий линейный оператор ограничен, так что условие содержательно лишь в бесконечномерном случае.`,
		related: ['lineynyy-operator', 'norma-operatora', 'proizvodnaya-freshe', 'normirovannoe-prostranstvo']
	},

	'norma-operatora': {
		id: 'norma-operatora',
		term: 'Норма оператора',
		short: String.raw`Наибольший коэффициент растяжения единичного шара.`,
		formula: String.raw`\|A\|=\sup_{\|h\|\le1}\|Ah\|=\sup_{h\ne0}\frac{\|Ah\|}{\|h\|}`,
		body: String.raw`Точная верхняя грань растяжения, которое оператор даёт на единичном шаре; отсюда рабочее неравенство $\|Ah\|\le\|A\|\cdot\|h\|$. Именно эта величина попадает в явную $\delta(\varepsilon)=\min(\delta_1,\varepsilon/(\|A\|+1))$ в доказательстве непрерывности дифференцируемого по Фреше отображения. Связь с секцией про поворот прямая: дробь $\|Ah\|/\|h\|$ — та самая «наивная производная», и норма оператора берёт по ней супремум вместо несуществующего предела.`,
		related: ['ogranichennyy-operator', 'lineynyy-operator', 'proizvodnaya-freshe']
	},

	'normirovannoe-prostranstvo': {
		id: 'normirovannoe-prostranstvo',
		term: 'Нормированное пространство',
		short: String.raw`Линейное пространство с нормой; метрика получается как ρ(x,y) = ‖x − y‖.`,
		formula: String.raw`\|x\|=0\iff x=0,\qquad \|\lambda x\|=|\lambda|\|x\|,\qquad \|x+y\|\le\|x\|+\|y\|`,
		body: String.raw`Пространство $H$, на котором задана норма; порождает [[metriki-rho|метрику]] $\rho(x,y)=\|x-y\|$, поэтому все топологические понятия переносятся сюда автоматически. Обратный переход не всегда возможен: метрика, порождённая нормой, инвариантна относительно сдвига и однородна, $\rho(\lambda x,\lambda y)=|\lambda|\rho(x,y)$, а дискретная метрика на $\mathbb R$ ни одному из этих условий не удовлетворяет и потому нормой не задаётся. Ослабление первой аксиомы (невырожденности) даёт [[polunorma|полунорму]], и именно этот шаг выводит к [[lvtnp|локально выпуклым пространствам]].`,
		related: ['polunorma', 'metriki-rho', 'ogranichennyy-operator', 'lvtnp']
	},

	'polunorma': {
		id: 'polunorma',
		term: 'Полунорма',
		short: String.raw`Норма без невырожденности: может обращаться в нуль не только на нуле.`,
		formula: String.raw`p(\lambda x)=|\lambda|p(x),\qquad p(x+y)\le p(x)+p(y)`,
		body: String.raw`Однородная и подчинённая неравенству треугольника функция $p:L\to\mathbb R$, от которой **не** требуют $p(x)=0\Rightarrow x=0$: полунорма имеет право обращаться в нуль не только на нуле. Неотрицательность не постулируют, а выводят: $0=p(x+(-x))\le p(x)+p(-x)=2p(x)$. [[yadro|Ядро]] $\ker p$ — линейное подпространство (для [[normirovannoe-prostranstvo|нормы]] тривиальное). Пример: $p(x)=|x_1|$ в $\mathbb R^2$ зануляется на оси $Ox_2$; на $C(\mathbb R)$ полунорма $p_K(f)=\sup_K|f|$ — на функциях, нулевых на [[kompakt|компакте]] $K$.`,
		related: ['semeystvo-polunorm', 'normirovannoe-prostranstvo', 'lvtnp', 'yadro']
	},

	'semeystvo-polunorm': {
		id: 'semeystvo-polunorm',
		term: 'Семейство полунорм',
		short: String.raw`Набор p₁ … p_n, разделяющий точки: сумма положительна вне нуля.`,
		formula: String.raw`\forall \vec x\ne0:\quad \sum_{i=1}^{n}p_i(x)>0`,
		body: String.raw`Набор [[polunorma|полунорм]], которым задают топологию: базу окрестностей нуля образуют конечные пересечения $\lbrace x: p_i(x)<\varepsilon\rbrace$. Условие $\sum_i p_i(x)>0$ при $x\ne0$ равносильно тому, что хотя бы одна $p_i$ не зануляется на $x$, — это **разделение точек**, возвращающее отделимость. Конечное разделяющее семейство даёт норму $q=\max_i p_i$ с той же топологией, то есть ничего нового; содержательные примеры [[lvtnp|ЛВТНП]] требуют счётного семейства.`,
		related: ['polunorma', 'lvtnp', 'vypukloe-mnozhestvo', 'normirovannoe-prostranstvo']
	},

	'vypukloe-mnozhestvo': {
		id: 'vypukloe-mnozhestvo',
		term: 'Выпуклое множество',
		short: String.raw`Содержит отрезок между любыми двумя своими точками.`,
		formula: String.raw`\forall \vec x,\vec y\in M\ \forall t\in[0,1]:\ \ \vec x+t(\vec y-\vec x)\in M`,
		body: String.raw`Множество, вместе с двумя точками содержащее соединяющий их отрезок [[parametrizatsiya-otrezka|$l(t)=\vec x+t(\vec y-\vec x)$]] при $t\in[0,1]$. Отрезок здесь заменить прямой нельзя: множества, содержащие вместе с каждыми двумя точками всю проходящую через них прямую (все $t\in\mathbb R$), — это пустое множество и [[affinnoe-prostranstvo|аффинные подпространства]], а среди ограниченных таких лишь пустое и одноточечное. Шар [[polunorma|полунормы]] выпуклый — отсюда и слово «локально выпуклое» в [[lvtnp|ЛВТНП]].`,
		related: ['polunorma', 'lvtnp', 'parametrizatsiya-otrezka', 'semeystvo-polunorm']
	},

	odnorodnost: {
		id: 'odnorodnost',
		term: 'Однородность',
		short: String.raw`Растяжение аргумента выносится множителем: $F(t\vec h)=t^kF(\vec h)$.`,
		formula: String.raw`p(\lambda x)=|\lambda|\,p(x),\qquad d^{k}f(t\,\vec{dx})=t^{k}\,d^{k}f(\vec{dx})`,
		body: String.raw`Функция **однородна степени $k$**, если растяжение аргумента выносится множителем: $F(t\vec h)=t^kF(\vec h)$. Норма и [[polunorma|полунорма]] однородны первой степени (с модулем $|\lambda|$), первый дифференциал — тоже, второй — второй степени.

Именно однородность обесценивает дробь $\|A\Delta x\|/\|\Delta x\|$: масштаб сокращается, и под знаком предела остаётся зависимость только от направления — то, что видно на [[norma-operatora|норме оператора]]. Она же половина линейности: у [[proizvodnaya-gato|производной Гато]] однородность есть всегда, а аддитивности может не быть.`,
		related: ['polunorma', 'norma-operatora', 'proizvodnaya-gato', 'lineynyy-operator']
	},

	kompakt: {
		id: 'kompakt',
		term: 'Компакт',
		short: String.raw`Из любого открытого покрытия извлекается конечное подпокрытие.`,
		formula: String.raw`D\subset\bigcup_\alpha U_\alpha\ \Rightarrow\ \exists\,\alpha_1\dots\alpha_m:\ D\subset\bigcup_{i=1}^{m}U_{\alpha_i}`,
		body: String.raw`Множество **компактно**, если из любого его открытого покрытия выбирается конечное подпокрытие; в $\mathbb R^n$ это равносильно замкнутости и ограниченности, а отрезок — стандартный пример ([[lsk|ЛСК]]).

Компактность нужна там, где локальное свойство надо сделать равномерным: на компакте непрерывная функция ограничена, достигает своих границ и равномерно непрерывна. Отсюда и разница размерностей: единичная сфера в $\mathbb R^n$ компактна, поэтому супремум в определении [[norma-operatora|нормы оператора]] достигается, а в $\ell^2$ она уже не компактна, и супремум может остаться недостижимым.`,
		related: ['lsk', 'lso', 'norma-operatora', 'ogranichennyy-operator']
	},

	yadro: {
		id: 'yadro',
		term: 'Ядро ker p',
		short: String.raw`Где полунорма зануляется; всегда линейное подпространство.`,
		formula: String.raw`\ker p=\lbrace x\in L:\ p(x)=0\rbrace`,
		body: String.raw`**Ядро** [[polunorma|полунормы]] — множество векторов, на которых она обращается в нуль. Оно всегда линейное подпространство: [[odnorodnost|однородность]] даёт замкнутость относительно умножения на скаляр, неравенство треугольника — относительно сложения.

Для [[normirovannoe-prostranstvo|нормы]] ядро тривиально, $\ker=\lbrace 0\rbrace$, — это и есть невырожденность; для полунормы оно какое угодно: у $p(x)=|x_1|$ в $\mathbb R^2$ ядром служит вся ось $Ox_2$. Именно ядро отбирает у отдельной полунормы [[otdelimost|отделимость]].`,
		related: ['polunorma', 'normirovannoe-prostranstvo', 'otdelimost', 'semeystvo-polunorm']
	},

	otdelimost: {
		id: 'otdelimost',
		term: 'Отделимость',
		short: String.raw`Разные точки различимы непересекающимися окрестностями.`,
		formula: String.raw`x\ne y\ \Rightarrow\ \exists\,U_x,U_y:\ U_x\cap U_y=\varnothing`,
		body: String.raw`Топология **отделима**, если любые две различные точки лежат в непересекающихся окрестностях. Без отделимости точки, которые топология не различает, ведут себя как одна: предел перестаёт быть единственным.

Одна [[polunorma|полунорма]] топологию задаёт, но неотделимую: всё её [[yadro|ядро]] неотличимо от нуля. Возвращает отделимость [[semeystvo-polunorm|семейство полунорм]] условием $\sum_i p_i(x)>0$ при $x\ne0$ — то самое разделение точек.`,
		related: ['polunorma', 'semeystvo-polunorm', 'yadro', 'lvtnp']
	},

	'baza-okrestnostey': {
		id: 'baza-okrestnostey',
		term: 'База окрестностей',
		short: String.raw`Набор окрестностей, внутрь каждой из которых влезает элемент набора.`,
		formula: String.raw`\forall U_x\ \exists B\in\mathcal B_x:\ B\subset U_x`,
		body: String.raw`**База окрестностей** точки — такой набор её окрестностей, что внутри любой окрестности лежит хотя бы одна из набора. База задаёт топологию целиком: все прочие окрестности из неё собираются, поэтому топологию удобно определять именно базой.

В [[lvtnp|локально выпуклом пространстве]] базу окрестностей нуля образуют конечные пересечения шаров $\lbrace x:\ p_i(x)<\varepsilon\rbrace$ по [[semeystvo-polunorm|семейству полунорм]]. Все они [[vypukloe-mnozhestvo|выпуклы]] — отсюда и слово «локально выпуклое» в названии.`,
		related: ['lvtnp', 'semeystvo-polunorm', 'vypukloe-mnozhestvo', 'polunorma']
	},

	'lineynaya-forma': {
		id: 'lineynaya-forma',
		term: 'Линейная форма (функционал)',
		short: String.raw`Линейный оператор со значениями в ℝ: вектор на входе, число на выходе.`,
		formula: String.raw`\ell(\vec h)=\langle\vec a\mid\vec h\rangle,\qquad \ell(\lambda\vec h_1+\mu\vec h_2)=\lambda\ell(\vec h_1)+\mu\ell(\vec h_2)`,
		body: String.raw`**Линейная форма** (линейный функционал) — [[lineynyy-operator|линейный оператор]] со значениями в $\mathbb R$. В $\mathbb R^n$ всякая такая форма есть скалярное произведение с одним фиксированным вектором: $\ell(\vec h)=\langle\vec a\mid\vec h\rangle$ в [[braket|bra-ket]]-записи, и вектор $\vec a$ восстанавливается по форме однозначно.

Отсюда роль градиента: [[proizvodnaya-freshe|производная Фреше]] скалярного поля — линейная форма, а $\nabla f$ — представляющий её вектор. Первый дифференциал — та же форма, применённая к вектору приращений.`,
		related: ['lineynyy-operator', 'proizvodnaya-freshe', 'gradient', 'braket']
	},

	'proizvodnaya-gato': {
		id: 'proizvodnaya-gato',
		term: 'Производная Гато',
		short: String.raw`Слабая производная: предел вдоль фиксированного направления.`,
		formula: String.raw`dF(\vec x,\vec h)=\frac{d}{dt}F(\vec x+t\vec h)\Big|_{t=0}=\lim_{t\to0}\frac{F(\vec x+t\vec h)-F(\vec x)}{t}`,
		body: String.raw`Производная вдоль направления $\vec h$: приращение берут только по лучу, поэтому делить приходится на скаляр $t$, а не на вектор. Определяется корректно уже в [[lvtnp|локально выпуклом пространстве]] — нормы не требуется. Из [[differenciruemost-po-freshe|дифференцируемости по Фреше]] следует существование Гато с $dF(x_0,h)=f'(x_0)h$; обратное неверно: у $f=\frac{x^3}{x^2+y^2}$ производная Гато в нуле есть по всем направлениям, но не линейна.`,
		related: ['proizvodnaya-freshe', 'proizvodnaya-po-napravleniyu', 'lvtnp', 'differenciruemost-po-freshe']
	},

	'proizvodnaya-po-napravleniyu': {
		id: 'proizvodnaya-po-napravleniyu',
		term: 'Производная по направлению',
		short: String.raw`Скорость роста поля вдоль вектора; свёртка градиента с направлением.`,
		formula: String.raw`f'_{\vec l}(x)=\langle\vec\nabla f\mid\vec l\,\rangle`,
		body: String.raw`Производная [[skalyarnoe-pole|скалярного поля]] вдоль вектора $\vec l$ — частный случай [[proizvodnaya-gato|производной Гато]] для отображений со значениями в $\mathbb R$. Записывается через [[gradient|градиент]] в [[braket|bra-ket-форме]]. Частная производная получается при $\vec l=\vec e_i$. Формула $f'_{\vec l}=\langle\nabla f\mid\vec l\rangle$ верна для дифференцируемых по Фреше полей, и направление в ней нормируют: при замене $\vec l$ на $\lambda\vec l$ правая часть умножается на $\lambda$, так что без условия $\|\vec l\|=1$ величина «скорости роста» определена лишь с точностью до множителя.`,
		related: ['proizvodnaya-gato', 'gradient', 'skalyarnoe-pole', 'braket']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных; представитель производной Фреше поля.`,
		formula: String.raw`\vec\nabla f=\Bigl(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\Bigr)`,
		body: String.raw`Для [[skalyarnoe-pole|скалярного поля]] [[proizvodnaya-freshe|производная Фреше]] — линейный функционал, а градиент — представляющий его вектор: $f'(x_0)h=\langle\nabla f(x_0)\mid h\rangle$. Через него записывается [[proizvodnaya-po-napravleniyu|производная по направлению]], а необходимое условие экстремума принимает вид $\nabla f=\bar0$. Порядок здесь такой: сначала оператор, затем его координатная запись, — частные производные получаются из производной Фреше, а не наоборот.`,
		related: ['proizvodnaya-freshe', 'proizvodnaya-po-napravleniyu', 'skalyarnoe-pole', 'braket']
	}
};
