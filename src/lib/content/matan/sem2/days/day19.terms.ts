import type { Glossary } from '$lib/types';

// Термины дня 19 (первообразная и неопределённый интеграл).
export const day19Terms: Glossary = {
	'yadro-operatora': {
		id: 'yadro-operatora',
		term: 'Ядро линейного оператора',
		short: String.raw`Прообраз нуля: $\ker A=\{x:\ Ax=0\}$.`,
		formula: String.raw`\ker A=\{x:\ Ax=\bar 0\}`,
		body: String.raw`Множество элементов, которые [[lineynyy-operator|оператор]] переводит в нуль. Это всегда линейное подпространство: линейность сохраняет и сумму, и умножение на число.`,
		related: ['lineynyy-operator', 'polnyy-proobraz', 'lineynoe-prostranstvo']
	},

	'polnyy-proobraz': {
		id: 'polnyy-proobraz',
		term: 'Полный прообраз',
		short: String.raw`Все элементы, попадающие в данное множество; обратимость не нужна.`,
		formula: String.raw`f^{-}(A)=\{x:\ f(x)\in A\}`,
		body: String.raw`[[obraz-mnozhestva|Прообраз]] множества при отображении: все точки, чей образ лежит в нём. Верхний индекс «$-$» отличает эту операцию от [[obratnaya-funkciya|обратной функции]] — прообраз определён у любого отображения.`,
		related: ['obraz-mnozhestva', 'obratnaya-funkciya', 'yadro-operatora']
	},

	'smezhnyy-klass': {
		id: 'smezhnyy-klass',
		term: 'Смежный класс',
		short: String.raw`Сдвиг подпространства: $x_0+L$.`,
		formula: String.raw`A^{-}(\{y\})=x_0+\ker A,\qquad Ax_0=y`,
		body: String.raw`Множество решений уравнения $Ax=y$: одно частное решение плюс всё [[yadro-operatora|ядро]] оператора. Такие классы не пересекаются и заполняют всё пространство.`,
		related: ['yadro-operatora', 'polnyy-proobraz', 'faktor-prostranstvo']
	},

	'aksiomy-metriki': {
		id: 'aksiomy-metriki',
		term: 'Аксиомы метрики',
		short: String.raw`Различимость, симметрия, неравенство треугольника.`,
		formula: String.raw`\rho(x,y)=0\iff x=y;\quad \rho(x,y)=\rho(y,x);\quad \rho(x,z)\le\rho(x,y)+\rho(y,z)`,
		body: String.raw`Три требования к функции расстояния: нулю она равна только на совпадающих точках, симметрична и удовлетворяет неравенству треугольника. Отказ от первого даёт [[psevdometrika|псевдометрику]].`,
		related: ['metriki-rho', 'psevdometrika', 'modul-chisla']
	},

	'aksiomy-normy': {
		id: 'aksiomy-normy',
		term: 'Аксиомы нормы',
		short: String.raw`Однородность, неравенство треугольника, невырожденность.`,
		formula: String.raw`\|\alpha h\|=|\alpha|\,\|h\|;\quad \|h_1+h_2\|\le\|h_1\|+\|h_2\|;\quad \|h\|=0\Rightarrow h=0`,
		body: String.raw`Три требования к норме на [[lineynoe-prostranstvo|линейном пространстве]]: [[odnorodnost|однородность]] с модулем множителя, неравенство треугольника и обращение в нуль только на нулевом элементе. Отказ от последнего даёт [[polunorma|полунорму]].`,
		related: ['lineynoe-prostranstvo', 'odnorodnost', 'polunorma']
	},

	pervoobraznaya: {
		id: 'pervoobraznaya',
		term: 'Первообразная',
		short: String.raw`$F$ — первообразная $f$ на промежутке, если $F'=f$ в каждой его точке.`,
		formula: String.raw`F'(x)=f(x),\qquad x\in J`,
		body: String.raw`Функция, [[proizvodnaya|производная]] которой во всех точках [[promezhutok|промежутка]] равна данной функции. Существование в определение не входит: оно описывает лишь, что значит быть первообразной.`,
		related: ['proizvodnaya', 'promezhutok', 'neopredelennyy-integral']
	},

	'neopredelennyy-integral': {
		id: 'neopredelennyy-integral',
		term: 'Неопределённый интеграл',
		short: String.raw`Множество всех первообразных данной функции: $\int f\,dx=F+C$.`,
		formula: String.raw`\int f(x)\,dx=F(x)+C`,
		body: String.raw`Обозначение для **множества** всех [[pervoobraznaya|первообразных]] функции на [[promezhutok|промежутке]]. Знак равенства между неопределёнными интегралами — равенство множеств, а не отдельных функций.`,
		related: ['pervoobraznaya', 'proizvolnaya-postoyannaya', 'opredelennyy-integral']
	},

	'proizvolnaya-postoyannaya': {
		id: 'proizvolnaya-postoyannaya',
		term: 'Произвольная постоянная',
		short: String.raw`Номер представителя внутри класса первообразных.`,
		formula: String.raw`\frac{d}{dx}\bigl(F+C\bigr)=f\qquad\forall C\in\mathbb R`,
		body: String.raw`Постоянная $C$ в записи [[neopredelennyy-integral|неопределённого интеграла]]. Она появляется потому, что на [[promezhutok|промежутке]] прибавление любого числа к [[pervoobraznaya|первообразной]] снова даёт первообразную.`,
		related: ['neopredelennyy-integral', 'pervoobraznaya', 'lokalno-postoyannaya-funkciya']
	},

	'faktor-prostranstvo': {
		id: 'faktor-prostranstvo',
		term: 'Фактор-пространство',
		short: String.raw`Пространство, точками которого служат смежные классы.`,
		formula: String.raw`V/L=\{\,x+L:\ x\in V\,\}`,
		body: String.raw`Множество [[smezhnyy-klass|смежных классов]] по подпространству, само являющееся [[lineynoe-prostranstvo|линейным пространством]]. Переход к нему превращает [[psevdometrika|псевдометрику]] в настоящую метрику: неразличимые элементы склеиваются в одну точку.`,
		related: ['smezhnyy-klass', 'lineynoe-prostranstvo', 'psevdometrika']
	},

	'tablica-pervoobraznyh': {
		id: 'tablica-pervoobraznyh',
		term: 'Таблица первообразных',
		short: String.raw`Таблица производных, прочитанная справа налево.`,
		formula: String.raw`\int f(kx+b)\,dx=\frac{F(kx+b)}{k}+C,\qquad k\ne0`,
		body: String.raw`Список [[pervoobraznaya|первообразных]] элементарных функций, получаемый обращением [[tablichnye-proizvodnye|таблицы производных]]. Любая строка проверяется дифференцированием.`,
		related: ['pervoobraznaya', 'tablichnye-proizvodnye', 'neopredelennyy-integral']
	},

	psevdometrika: {
		id: 'psevdometrika',
		term: 'Псевдометрика',
		short: String.raw`Метрика без различимости: $\rho(x,y)=0$ бывает и при $x\ne y$.`,
		formula: String.raw`\rho(x,y)=0\ \text{при}\ x\ne y`,
		body: String.raw`Функция расстояния, для которой выполнены симметрия и неравенство треугольника, но не первая из [[aksiomy-metriki|аксиом метрики]]: разные точки могут стоять на нулевом расстоянии.`,
		related: ['aksiomy-metriki', 'polunorma', 'faktor-prostranstvo']
	},

	'lokalno-postoyannaya-funkciya': {
		id: 'lokalno-postoyannaya-funkciya',
		term: 'Локально постоянная функция',
		short: String.raw`Постоянна около каждой точки, но не обязана быть одним числом.`,
		formula: String.raw`h'\equiv0\ \text{на}\ D\iff h\ \text{локально постоянна}`,
		body: String.raw`Функция, постоянная в некоторой [[okrestnost|окрестности]] каждой точки области. На [[promezhutok|промежутке]] это просто константа, а на несвязной области — нет: у $\operatorname{sgn}x$ производная всюду нулевая, а константой она не является.`,
		related: ['promezhutok', 'okrestnost', 'komponenta-svyaznosti']
	}
};
