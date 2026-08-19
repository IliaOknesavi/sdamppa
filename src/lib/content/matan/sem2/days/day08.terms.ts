import type { Glossary } from '$lib/types';

// Термины дня 8: производная Фреше, полунорма, локально выпуклое линейное
// топологическое пространство.
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
		body: String.raw`Однородная и подчинённая неравенству треугольника функция $p:L\to\mathbb R$, от которой **не** требуют $p(x)=0\Rightarrow x=0$: полунорма имеет право обращаться в нуль не только на нуле. Неотрицательность не постулируют, а выводят: $0=p(x+(-x))\le p(x)+p(-x)=2p(x)$. Ядро $\ker p$ — линейное подпространство (для [[normirovannoe-prostranstvo|нормы]] тривиальное). Пример: $p(x)=|x_1|$ в $\mathbb R^2$ зануляется на оси $Ox_2$; на $C(\mathbb R)$ полунорма $p_K(f)=\sup_K|f|$ — на функциях, нулевых на компакте $K$.`,
		related: ['semeystvo-polunorm', 'normirovannoe-prostranstvo', 'lvtnp', 'vypukloe-mnozhestvo']
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
		body: String.raw`Множество, вместе с двумя точками содержащее соединяющий их отрезок [[parametrizaciya-otrezka|$l(t)=\vec x+t(\vec y-\vec x)$]] при $t\in[0,1]$. Отрезок здесь заменить прямой нельзя: множества, содержащие вместе с каждыми двумя точками всю проходящую через них прямую (все $t\in\mathbb R$), — это пустое множество и аффинные подпространства, а среди ограниченных таких лишь пустое и одноточечное. Шар [[polunorma|полунормы]] выпуклый — отсюда и слово «локально выпуклое» в [[lvtnp|ЛВТНП]].`,
		related: ['polunorma', 'lvtnp', 'parametrizaciya-otrezka', 'semeystvo-polunorm']
	},

	'parametrizaciya-otrezka': {
		id: 'parametrizaciya-otrezka',
		term: 'Параметризация отрезка',
		short: String.raw`S(t) = x + t(y − x): отрезок как образ [0,1].`,
		formula: String.raw`S(t)=\vec x+t(\vec y-\vec x),\qquad S(0)=\vec x,\ S(1)=\vec y,\ \ S([0,1])=\overline{xy}`,
		body: String.raw`Приём сведения многомерного объекта к одномерному подстановкой $t\mapsto S(t)$. Через него определяется [[vypukloe-mnozhestvo|выпуклость]], через него же доказывается теорема Лагранжа для полей — функция $\varphi(t)=f(S(t))$ уже скалярная, элемент [[end-r|$\mathrm{End}(\mathbb R)$]]. Та же параметризация с коэффициентами $\alpha+\beta+\gamma=1$ даёт барицентрическую (выпуклую) комбинацию и мост к симплексам.`,
		related: ['vypukloe-mnozhestvo', 'proizvodnaya-gato', 'end-r']
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
