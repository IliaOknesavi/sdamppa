import type { Glossary } from '$lib/types';

// Термины дня 15 (условный экстремум, множители Лагранжа). Понятия сквозной
// нотации живут в каноническом глоссарии (sem2/glossary.ts) и здесь НЕ
// дублируются — они подключаются перекрёстными ссылками [[...]]:
//   braket, skalyarnoe-pole, klassy-differenciruemosti, priznak-i-svoystvo,
//   blacksquare. Канонический глоссарий склеивается последним и перекрывает
//   совпадения, поэтому одноимённые карточки заводить нельзя.
// Карточки gradient, matrica-yakobi, teorema-ferma и teorema-neyavnoy-funkcii
// намеренно продублированы из дней 9–14 и 16, чтобы день резолвился независимо.
export const day15Terms: Glossary = {
	'uslovnyy-ekstremum': {
		id: 'uslovnyy-ekstremum',
		term: 'Условный экстремум',
		short: String.raw`Экстремум $f$ на допустимом множестве: сравниваем только с допустимыми соседями.`,
		formula: String.raw`\exists U_{\vec x^{*}}:\ \forall \vec x\in U_{\vec x^{*}}\cap\mathcal D:\ f(\vec x)\ge f(\vec x^{\,*})`,
		body: String.raw`Точка $\vec x^{\,*}\in\mathcal D$ — **локальный условный минимум**, если в некоторой окрестности она не хуже всех точек [[dopustimoe-mnozhestvo|допустимого множества]]; для максимума неравенство разворачивается. Всё содержание — в пересечении $U_{\vec x^{*}}\cap\mathcal D$: точка может проигрывать соседям «сбоку» от поверхности и всё равно быть условным экстремумом.

Необходимое условие такой точки — [[lineynaya-obolochka-gradientov|разложение градиента]] цели по градиентам [[svyaz|связей]]; достаточным оно не является.`,
		related: ['dopustimoe-mnozhestvo', 'svyaz', 'lineynaya-obolochka-gradientov', 'funkciya-lagranzha']
	},

	svyaz: {
		id: 'svyaz',
		term: 'Связь (ограничение-равенство)',
		short: String.raw`Функция $g_i$, обнуление которой требуется от всех допустимых точек.`,
		formula: String.raw`g_1,\dots,g_m:\ \mathbb R^n\to\mathbb R,\qquad g_i(\vec x)=0,\qquad m\le n`,
		body: String.raw`**Связями** называются функции $g_1,\dots,g_m:\mathbb R^n\to\mathbb R$, задающие условия $g_i(\vec x)=0$ на допустимые точки. Ограничение $m\le n$ существенно: каждая независимая связь съедает одну степень свободы, и у [[dopustimoe-mnozhestvo|допустимого множества]] остаётся размерность $n-m$; при $m=n$ оно вырождается в набор изолированных точек.

Геометрически связь-равенство понижает размерность (кривая в $\mathbb R^2$, поверхность в $\mathbb R^3$), а [[ogranichenie-neravenstvo|связь-неравенство]] — нет. Градиент $\nabla g_i$ перпендикулярен поверхности $g_i=0$; из этого и растёт весь метод.`,
		related: ['dopustimoe-mnozhestvo', 'ogranichenie-neravenstvo', 'uslovie-regulyarnosti', 'gradient']
	},

	'dopustimoe-mnozhestvo': {
		id: 'dopustimoe-mnozhestvo',
		term: 'Допустимое множество 𝒟',
		short: String.raw`Множество точек, где выполнены все связи; на нём и ищется экстремум.`,
		formula: String.raw`\mathcal D=\{\vec x\in\mathbb R^n:\ g_i(\vec x)=0,\ i=1\ldots m\}`,
		body: String.raw`Множество, на котором разрешено оптимизировать: $\mathcal D=\{\vec x:\ g_i(\vec x)=0\}$. При выполненном [[uslovie-regulyarnosti|условии регулярности]] это гладкая поверхность размерности $n-m$ с [[kasatelnoe-prostranstvo|касательным пространством]] той же размерности в каждой точке.

Ровно из-за $\mathcal D$ задача перестаёт быть задачей на [[teorema-ferma|Ферма]]: обнулять весь градиент больше не нужно, достаточно погасить его составляющую вдоль $\mathcal D$. Если [[svyaz|связи]] заданы неравенствами, $\mathcal D$ — область полной размерности с краем, а не поверхность.`,
		related: ['svyaz', 'uslovnyy-ekstremum', 'kasatelnoe-prostranstvo', 'ogranichenie-neravenstvo']
	},

	'lineynaya-obolochka-gradientov': {
		id: 'lineynaya-obolochka-gradientov',
		term: 'Линейная оболочка градиентов связей',
		short: String.raw`Нормаль к $\mathcal D$: в ней обязан лежать $\nabla f$ в точке экстремума.`,
		formula: String.raw`\nabla f(\vec x^{\,*})=\sum_{i=1}^{m}\lambda_i^{*}\,\nabla g_i(\vec x^{\,*})`,
		body: String.raw`Главное утверждение дня в геометрической форме: в точке [[uslovnyy-ekstremum|условного экстремума]] градиент цели принадлежит линейной оболочке $\operatorname{span}\{\nabla g_i(\vec x^{\,*})\}$ — нормальному пространству к [[dopustimoe-mnozhestvo|допустимому множеству]], ортогональному дополнению [[kasatelnoe-prostranstvo|касательного пространства]].

Смысл: у $\nabla f$ не остаётся касательной составляющей, иначе шаг по $\mathcal D$ в её сторону увеличил бы $f$. Коэффициенты разложения — [[mnozhitel-lagranzha|множители Лагранжа]]. При $m=0$ оболочка пуста и условие превращается в $\nabla f=\vec 0$.`,
		related: ['mnozhitel-lagranzha', 'kasatelnoe-prostranstvo', 'uslovnyy-ekstremum', 'gradient']
	},

	'mnozhitel-lagranzha': {
		id: 'mnozhitel-lagranzha',
		term: 'Множитель Лагранжа λᵢ*',
		short: String.raw`Коэффициент разложения $\nabla f$ по градиентам связей; при регулярности один.`,
		formula: String.raw`\lambda_1^{*},\dots,\lambda_m^{*}:\quad \nabla f(\vec x^{\,*})-\sum_{i=1}^{m}\lambda_i^{*}\nabla g_i(\vec x^{\,*})=\vec 0`,
		body: String.raw`**Множители** $\lambda_i^{*}$ — коэффициенты, с которыми градиент цели раскладывается по градиентам [[svyaz|связей]]. При выполненном [[uslovie-regulyarnosti|условии регулярности]] базис линейно независим, поэтому набор $\lambda^{*}$ определён однозначно.

Нулевой множитель содержателен: связь в этой точке «не тянет», экстремум был бы тем же и без неё. Знак множителя зависит от выбранной конвенции: при [[funkciya-lagranzha|$\mathcal L=f-\sum\lambda_i g_i$]] и при $\mathcal L=f+\sum\mu_i g_i$ наборы связаны как $\mu_i=-\lambda_i$, а точки экстремума совпадают. Вне матана $\lambda_i$ — теневая цена ограничения или коэффициент регуляризации.`,
		related: ['funkciya-lagranzha', 'lineynaya-obolochka-gradientov', 'uslovie-regulyarnosti', 'svyaz']
	},

	'funkciya-lagranzha': {
		id: 'funkciya-lagranzha',
		term: 'Функция Лагранжа 𝓛',
		short: String.raw`Упаковка условия в стационарность: $\mathcal L=f-\sum\lambda_i g_i$.`,
		formula: String.raw`\mathcal L(\vec x,\vec\lambda)=f(\vec x)-\sum_{i=1}^{m}\lambda_i\,g_i(\vec x)`,
		body: String.raw`Функция $n+m$ переменных, в стационарность которой упаковано всё необходимое условие: $\partial\mathcal L/\partial x_j=0$ даёт [[lineynaya-obolochka-gradientov|разложение градиента]], а $\partial\mathcal L/\partial\lambda_i=-g_i=0$ возвращает сами [[svyaz|связи]]. Итого $\nabla\mathcal L=\vec 0$ — квадратная система из $n+m$ уравнений.

Знак перед суммой — конвенция: запись $\mathcal L=f+\sum\mu_i g_i$ переходит в приведённую заменой $\mu_i=-\lambda_i$, множества решений совпадают. Для [[ogranichenie-neravenstvo|ограничений-неравенств]] конвенция перестаёт быть свободной: там на множители накладывается требование неотрицательности, отбрасывающее часть стационарных точек.`,
		related: ['mnozhitel-lagranzha', 'lineynaya-obolochka-gradientov', 'uslovnyy-ekstremum', 'ogranichenie-neravenstvo']
	},

	'uslovie-regulyarnosti': {
		id: 'uslovie-regulyarnosti',
		term: 'Условие регулярности',
		short: String.raw`Линейная независимость градиентов $\nabla g_i(\vec x^{\,*})$ в точке.`,
		formula: String.raw`\operatorname{rank}\left(\frac{\partial g_i}{\partial x_j}\right)=m\quad\Longleftrightarrow\quad \det\left(\frac{\partial g_i}{\partial y_j}\right)_{i,j=1}^{m}\ne0`,
		body: String.raw`Гипотеза, без которой метод Лагранжа неверен: градиенты связей в точке линейно независимы, то есть ранг [[matrica-yakobi|матрицы Якоби]] равен $m$; равносильно — найдутся $m$ «зависимых» переменных с невырожденным якобианом (посылка [[teorema-neyavnoy-funkcii|теоремы о неявной функции]]).

Контрпример к пропуску: $f=x\to\min$ при $g=x^3-y^2=0$. Минимум есть в $(0,0)$, но $\nabla g(0,0)=\vec 0$, и система Лагранжа несовместна — метод не находит точку вовсе.`,
		related: ['matrica-yakobi', 'teorema-neyavnoy-funkcii', 'mnozhitel-lagranzha', 'kasatelnoe-prostranstvo']
	},

	'ogranichenie-neravenstvo': {
		id: 'ogranichenie-neravenstvo',
		term: 'Ограничение-неравенство',
		short: String.raw`Условие $g_i\ge0$: вырезает область с краем, а не поверхность.`,
		formula: String.raw`g_1(x,y)\ge0,\ g_2(x,y)=x\ge0,\ g_3(x,y)=y\ge0`,
		body: String.raw`Запись «$g_1\ge0$, $g_2\ge0$» разворачивается в набор функций ($g_2=x$, $g_3=y$) и геометрически даёт **область**, а не поверхность: размерность не понижается, появляется край.

Экстремум может лежать внутри (тогда работает $\nabla f=\vec 0$) или на краю, где часть ограничений активна и ведёт себя как [[svyaz|связь]]-равенство. Систематический разбор — **условия Куна–Таккера**, где [[mnozhitel-lagranzha|множители]] получают обязательный знак.`,
		related: ['svyaz', 'dopustimoe-mnozhestvo', 'mnozhitel-lagranzha', 'funkciya-lagranzha']
	},

	'kasatelnoe-prostranstvo': {
		id: 'kasatelnoe-prostranstvo',
		term: 'Касательное пространство к 𝒟',
		short: String.raw`Ядро матрицы Якоби связей: направления, вдоль которых связи не меняются.`,
		formula: String.raw`T=\{\vec h\in\mathbb R^n:\ \langle\nabla g_i(\vec x^{\,*})\mid\vec h\rangle=0,\ i=1\ldots m\}`,
		body: String.raw`Множество допустимых направлений движения из точки: $\vec h\in T$, если все связи в первом порядке не меняются, то есть $\vec h$ ортогонален каждому $\nabla g_i$ в [[braket|bra-ket-записи]]. При [[uslovie-regulyarnosti|регулярности]] $\dim T=n-m$.

Рабочий инструмент доказательства: вдоль каждого $\vec h\in T$ через точку проходит путь по [[dopustimoe-mnozhestvo|$\mathcal D$]], след $f$ на нём даёт одномерную задачу, и [[teorema-ferma|Ферма]] обнуляет $\langle\nabla f\mid\vec h\rangle$. Отсюда $\nabla f\perp T$, а $T^{\perp}$ — [[lineynaya-obolochka-gradientov|оболочка градиентов связей]].`,
		related: ['lineynaya-obolochka-gradientov', 'dopustimoe-mnozhestvo', 'teorema-ferma', 'uslovie-regulyarnosti']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент ∇f',
		short: String.raw`Вектор частных производных; направление наискорейшего роста поля.`,
		formula: String.raw`\nabla f=\left(\frac{\partial f}{\partial x_1},\dots,\frac{\partial f}{\partial x_n}\right),\qquad f'_{\vec l}=\langle\nabla f\mid\vec l\,\rangle`,
		body: String.raw`**Градиент** [[skalyarnoe-pole|скалярного поля]] — вектор его частных производных; производная по направлению выражается через него скалярным произведением в [[braket|bra-ket-записи]], откуда и читается «направление наискорейшего роста».

Ключевое для сегодняшнего дня свойство: $\nabla g$ перпендикулярен поверхности уровня $g=\mathrm{const}$. Поэтому градиенты [[svyaz|связей]] натягивают нормальное пространство к [[dopustimoe-mnozhestvo|допустимому множеству]], а условие Лагранжа читается как «$\nabla f$ смотрит строго поперёк $\mathcal D$».`,
		related: ['skalyarnoe-pole', 'braket', 'lineynaya-obolochka-gradientov', 'matrica-yakobi']
	},

	'matrica-yakobi': {
		id: 'matrica-yakobi',
		term: 'Матрица Якоби связей',
		short: String.raw`Матрица $(\partial g_i/\partial x_j)$; её ранг и есть условие регулярности.`,
		formula: String.raw`J=\left(\frac{\partial g_i}{\partial x_j}\right)_{i=1\ldots m,\ j=1\ldots n},\qquad \operatorname{rank}J=m`,
		body: String.raw`Матрица частных производных набора [[svyaz|связей]]; её строки — градиенты $\nabla g_i$, а определитель квадратного блока называется якобианом. Расщепление переменных $\vec x=(y,z)$ на $m$ «зависимых» и $n-m$ свободных задаётся выбором квадратного блока в $J$.

Через неё формулируются оба требования метода: [[uslovie-regulyarnosti|регулярность]] ($\operatorname{rank}J=m$) и невырожденность блока $\partial g_i/\partial y_j$ в [[teorema-neyavnoy-funkcii|теореме о неявной функции]]. Ядро $J$ — [[kasatelnoe-prostranstvo|касательное пространство]] к $\mathcal D$.`,
		related: ['uslovie-regulyarnosti', 'kasatelnoe-prostranstvo', 'teorema-neyavnoy-funkcii', 'gradient']
	},

	'teorema-neyavnoy-funkcii': {
		id: 'teorema-neyavnoy-funkcii',
		term: 'Теорема о неявной функции',
		short: String.raw`Связи локально разрешаются как $y=\varphi(z)$ с $\varphi\in C^k$.`,
		formula: String.raw`\exists!\,\varphi:U(z^{*})\to V(y^{*}),\ \varphi\in C^{k},\ \varphi(z^{*})=y^{*},\ g_i(\varphi(z),z)=0`,
		body: String.raw`Инструмент, которым обосновывается метод Лагранжа: при $g_i\in C^k$ и невырожденном блоке [[matrica-yakobi|матрицы Якоби]] по «зависимым» переменным система $g_i(y,z)=0$ локально разрешается единственной гладкой $y=\varphi(z)$; для одного уравнения теорема доказана в дне 14.

Именно она даёт гладкий путь по [[dopustimoe-mnozhestvo|$\mathcal D$]] в любом [[kasatelnoe-prostranstvo|касательном]] направлении — единственный недоказанный шаг сегодняшнего вывода. Она же даёт редукцию условной задачи к безусловной для $F(z)=f(\varphi(z),z)$; разбор — день 16.`,
		related: ['matrica-yakobi', 'uslovie-regulyarnosti', 'kasatelnoe-prostranstvo', 'dopustimoe-mnozhestvo']
	},

	'teorema-ferma': {
		id: 'teorema-ferma',
		term: 'Теорема Ферма',
		short: String.raw`Во внутреннем экстремуме производная (градиент) обращается в нуль.`,
		formula: String.raw`u'(0)=0;\qquad \nabla f(\vec x^{\,*})=\vec 0\ \text{для скалярного поля}`,
		body: String.raw`Необходимое условие внутреннего экстремума: производная в точке экстремума равна нулю. Формулируется и в $\operatorname{End}(\mathbb R)$, и для [[skalyarnoe-pole|скалярных полей]]; обратное неверно — контрпример $f=x^3$.

Сегодня она мотор доказательства: след $u(t)=f(\gamma(t))$ вдоль пути по [[dopustimoe-mnozhestvo|$\mathcal D$]] имеет в нуле обычный экстремум, значит $u'(0)=\langle\nabla f\mid\vec h\rangle=0$. Условие Лагранжа обобщает Ферма: при $m=0$ оно в неё и превращается.`,
		related: ['skalyarnoe-pole', 'kasatelnoe-prostranstvo', 'uslovnyy-ekstremum', 'gradient']
	}
};
