import type { Glossary } from '$lib/types';

// =====================================================================
//  Термины дня 19: первообразная и неопределённый интеграл.
//  Карточки соседних дней, на которые день ссылается (определённый
//  интеграл — дни 17–18, теорема Лагранжа — день 5, полунорма — день 8,
//  Ньютон–Лейбниц — день 20), продублированы намеренно: день должен
//  резолвиться независимо от соседей. Канонический глоссарий (ЛСК,
//  ранг разбиения, End(R), метрики, компонента связности, ЛВТНП,
//  скалярное поле, классы дифференцируемости) склеивается последним
//  и перекрывает дубли.
// =====================================================================

export const day19Terms: Glossary = {
	'yadro-operatora': {
		id: 'yadro-operatora',
		term: 'Ядро линейного оператора',
		short: String.raw`Прообраз нуля: $\ker A=\{x:\ Ax=0\}$.`,
		formula: String.raw`\ker\tfrac{d}{dx}=\{h:\ h'\equiv0\}`,
		body: String.raw`Ядро линейного оператора — множество элементов, которые он переводит в нуль; это линейное подпространство. [[polnyy-proobraz|Полный прообраз]] любой точки есть [[smezhnyy-klass|смежный класс]] по ядру, поэтому множество [[pervoobraznaya|первообразных]] устроено как «одна $F$ плюс ядро». Чему равно ядро $\frac{d}{dx}$ — вопрос не бухгалтерский: на [[promezhutok|промежутке]] это константы (теорема Лагранжа), на несвязной области — локально постоянные функции.`,
		related: ['pervoobraznaya', 'promezhutok', 'lokalno-postoyannaya-funkciya', 'faktor-prostranstvo']
	},

	'polnyy-proobraz': {
		id: 'polnyy-proobraz',
		term: 'Полный прообраз f⁻(A)',
		short: String.raw`Все элементы, попадающие в $A$; знак $^-$ не требует обратимости.`,
		formula: String.raw`f^{-}(A)=\{x:\ f(x)\in A\}`,
		body: String.raw`Полный прообраз множества $A$ — все точки, чей образ лежит в $A$. Верхний индекс «$-$» отличает эту операцию от обратной функции: прообраз определён у любого отображения, обратимость не нужна. Первообразные $f$ — это $\left(\frac{d}{dx}\right)^{-}(\{f\})$, прообраз одноточечного множества, то есть [[smezhnyy-klass|смежный класс]] по [[yadro-operatora|ядру]]; [[neopredelennyy-integral|неопределённый интеграл]] — имя этого прообраза.`,
		related: ['yadro-operatora', 'neopredelennyy-integral', 'pervoobraznaya']
	},

	'smezhnyy-klass': {
		id: 'smezhnyy-klass',
		term: 'Смежный класс',
		short: String.raw`Сдвиг подпространства: $x_0+L$, где $L$ — ядро оператора.`,
		formula: String.raw`A^{-}(\{y\})=x_0+\ker A,\qquad Ax_0=y`,
		body: String.raw`Если $Ax_0=y$, то все решения уравнения $Ax=y$ — это $x_0+\ker A$: одно частное решение плюс всё [[yadro-operatora|ядро]]. Классы не пересекаются и заполняют пространство — из них и составлено [[faktor-prostranstvo|фактор-пространство]]. Для $A=\frac{d}{dx}$ это в точности «$F+C$»: [[pervoobraznaya|первообразная]] — представитель класса, а не отдельная функция, поэтому два ответа, отличающиеся на константу, считаются одним.`,
		related: ['yadro-operatora', 'faktor-prostranstvo', 'pervoobraznaya', 'proizvolnaya-postoyannaya']
	},

	'aksiomy-metriki': {
		id: 'aksiomy-metriki',
		term: 'Аксиомы метрики',
		short: String.raw`Различимость, симметрия, неравенство треугольника.`,
		formula: String.raw`\rho(x,y)=0\iff x=y;\quad \rho(x,y)=\rho(y,x);\quad \rho(x,z)\le\rho(x,y)+\rho(y,z)`,
		body: String.raw`Метрика обязана удовлетворять трём требованиям, и в теме первообразных ломается первое — различимость: $\rho(x^2+4;\,x^2)=\|4\|_C=0$ при различных функциях. То, у чего уцелели симметрия и неравенство треугольника, называется [[psevdometrika|псевдометрикой]]; настоящей метрикой оно становится после перехода к [[faktor-prostranstvo|фактор-пространству]], где точками служат классы. Метрик на одном множестве много: [[metriki-rho|семейство $\rho_1,\rho_2,\rho_\infty$]].`,
		related: ['psevdometrika', 'faktor-prostranstvo', 'metriki-rho', 'polunorma']
	},

	'aksiomy-normy': {
		id: 'aksiomy-normy',
		term: 'Аксиомы нормы',
		short: String.raw`Однородность, неравенство треугольника, невырожденность.`,
		formula: String.raw`\|\alpha h\|=|\alpha|\,\|h\|;\quad \|h_1+h_2\|\le\|h_1\|+\|h_2\|;\quad \|h\|=0\Rightarrow h=0`,
		body: String.raw`Три требования к норме. Однородность — множитель выносится по модулю; неравенство треугольника — длина суммы не больше суммы длин; невырожденность — нуль достигается только на нуле. У $\|h\|_C=\sup_J|h'|$ первые два выполнены (производная линейна, супремум суммы не больше суммы супремумов), а третье нет: $\|C\|_C=0$ на любой константе. Отказ ровно от невырожденности даёт [[polunorma|полунорму]], а с ней [[psevdometrika|псевдометрику]] и [[faktor-prostranstvo|фактор-пространство]].`,
		related: ['polunorma', 'psevdometrika', 'faktor-prostranstvo']
	},

	pervoobraznaya: {
		id: 'pervoobraznaya',
		term: 'Первообразная',
		short: String.raw`$F$ — первообразная $f$ на промежутке, если $F'=f$ в каждой его точке.`,
		formula: String.raw`F'(x)=f(x),\qquad x\in J`,
		body: String.raw`Для непрерывной $f\in C^0[a,b]$: функция $F$ есть первообразная $f$, если $F'=f$. Существование в определение не входит — оно описывает только устройство множества первообразных; что у непрерывной функции первообразная есть всегда, доказывает [[teorema-barrou|теорема Барроу]] (день 20).

Слово «[[promezhutok|промежуток]]» здесь рабочее: на несвязной области две первообразные могут отличаться на [[lokalno-postoyannaya-funkciya|локально постоянную]] функцию, а не на число. Алгебраически первообразные — [[polnyy-proobraz|полный прообраз]] $\left(\frac{d}{dx}\right)^{-}(\{f\})$, то есть смежный класс по ядру дифференцирования.`,
		related: ['neopredelennyy-integral', 'promezhutok', 'teorema-lagranzha', 'tablica-pervoobraznyh']
	},

	'neopredelennyy-integral': {
		id: 'neopredelennyy-integral',
		term: 'Неопределённый интеграл',
		short: String.raw`Класс всех первообразных данной функции: $\int f\,dx=F+C$.`,
		formula: String.raw`\int f(x)\,dx=F(x)+C`,
		body: String.raw`Обозначение вводится равенством $F(x)+C=\int f(x)\,dx$, и справа от знака равенства стоит **множество**: класс [[faktor-prostranstvo|фактор-пространства]] по константам, а [[proizvolnaya-postoyannaya|произвольная постоянная]] нумерует его элементы.

Отсюда практика: знак «$=$» между неопределёнными интегралами — равенство классов, поэтому $\sin^2x+C$ и $-\tfrac12\cos2x+C$ — один ответ, а запись без $+C$ — один представитель вместо класса. Не путать с [[opredelennyy-integral|определённым интегралом]]: у того значение — число, а не класс функций.`,
		related: ['pervoobraznaya', 'proizvolnaya-postoyannaya', 'faktor-prostranstvo', 'opredelennyy-integral']
	},

	'proizvolnaya-postoyannaya': {
		id: 'proizvolnaya-postoyannaya',
		term: 'Произвольная постоянная C',
		short: String.raw`Номер представителя внутри класса первообразных, а не «хвост» ответа.`,
		formula: String.raw`\frac{d}{dx}\bigl(F+C\bigr)=f\qquad\forall C\in\mathbb R`,
		body: String.raw`Постоянная $C$ появляется потому, что ядро дифференцирования на [[promezhutok|промежутке]] состоит ровно из констант: прибавление любого числа к [[pervoobraznaya|первообразной]] снова даёт первообразную. Она нумерует представителей одного класса, а не уточняет ответ.

Дифференцирование стирает уровень функции, и восстановить его по $f$ нельзя в принципе — нужно одно дополнительное условие (в ОДУ это начальное условие $y(x_0)=y_0$). В разностях $F(b)-F(a)$ постоянная сокращается, поэтому определённый интеграл корректно определён на классе.`,
		related: ['neopredelennyy-integral', 'pervoobraznaya', 'faktor-prostranstvo', 'promezhutok']
	},

	'faktor-prostranstvo': {
		id: 'faktor-prostranstvo',
		term: 'Фактор-пространство первообразных',
		short: String.raw`Функции, отождествлённые по модулю констант: $V/\ker\|\cdot\|_C$.`,
		formula: String.raw`\|h\|_C=\sup_J|h'|,\qquad \|C\|_C=0`,
		body: String.raw`Величина $\|h\|_C=\sup_J|h'|$ не различает функции, отличающиеся на константу: $\rho(x^2+4;\,x^2)=\|(x^2+4)-x^2\|_C=0$. Это [[polunorma|полунорма]], порождающая [[psevdometrika|псевдометрику]]; фактор по её ядру превращает псевдометрику в настоящую метрику, а класс $[F]$ — это в точности $F+C$, то есть [[neopredelennyy-integral|неопределённый интеграл]].

Полунорма не отменяет [[teorema-lagranzha|теорему Лагранжа]]: та нужна, чтобы ядро оказалось именно константами, а не чем-то большим.`,
		related: ['polunorma', 'psevdometrika', 'neopredelennyy-integral', 'teorema-lagranzha']
	},

	'tablica-pervoobraznyh': {
		id: 'tablica-pervoobraznyh',
		term: 'Таблица первообразных',
		short: String.raw`Таблица производных, прочитанная справа налево, плюс делитель $k$.`,
		formula: String.raw`\int f(kx+b)\,dx=\frac{F(kx+b)}{k}+C,\qquad k\ne0`,
		body: String.raw`Строки таблицы не запоминают, а выводят. Из $(x^{p+1})'=(p+1)x^p$ получается $\int x^p\,dx=\frac{x^{p+1}}{p+1}+C$ при $p\ne-1$; случай $p=-1$ идёт отдельной строкой $\int\frac{dx}{x}=\ln|x|+C$ — на каждом из [[promezhutok|промежутков]] $(-\infty;0)$ и $(0;+\infty)$ со своей постоянной.

Правило с линейной внутренностью следует из цепного правила и закрывает примеры вида $\int\sin2x\,dx$, $\int\cos3x\,dx$, $\int e^{3x}dx$. Проверка любой строки — дифференцирование, а не память: это и называется «интегрировать по определению».`,
		related: ['pervoobraznaya', 'neopredelennyy-integral', 'promezhutok']
	},

	promezhutok: {
		id: 'promezhutok',
		term: 'Промежуток',
		short: String.raw`Связное подмножество $\mathbb R$: интервал, отрезок, полуинтервал или луч.`,
		formula: String.raw`x_1,x_2\in J,\ x_1<t<x_2\ \Rightarrow\ t\in J`,
		body: String.raw`Промежуток — связное подмножество прямой: вместе с любыми двумя точками содержит весь отрезок между ними. Отрезок $[a;b]$ — [[lsk|ЛСК]], линейно связный компакт.

В определении [[pervoobraznaya|первообразной]] промежуток обязателен: именно связность позволяет применить [[teorema-lagranzha|теорему Лагранжа]] к $H=F-G$ на отрезке $[x_1;x_2]\subset J$ и получить $H=\mathrm{const}$. На несвязной области вместо констант возникают [[lokalno-postoyannaya-funkciya|локально постоянные]] функции — по своей постоянной на каждый кусок.`,
		related: ['pervoobraznaya', 'teorema-lagranzha', 'lokalno-postoyannaya-funkciya', 'lsk']
	},

	polunorma: {
		id: 'polunorma',
		term: 'Полунорма',
		short: String.raw`Норма без невырожденности: бывает $\|h\|=0$ при $h\ne0$.`,
		formula: String.raw`\|\alpha h\|=|\alpha|\,\|h\|,\qquad \|h_1+h_2\|\le\|h_1\|+\|h_2\|`,
		body: String.raw`Полунорма удовлетворяет однородности и неравенству треугольника, но допускает нулевое значение не только на нуле. В [[lvtnp|ЛВТНП]] (день 8) топология задаётся целым семейством полунорм $p_1,\dots,p_n$.

В теме интегралов работает полунорма $\|h\|_C=\sup_J|h'|$: у любой константы она нулевая, то есть $\|C\|_C=0$. Фактор по ядру полунормы — уже нормированное [[faktor-prostranstvo|пространство]].`,
		related: ['lvtnp', 'faktor-prostranstvo', 'psevdometrika']
	},

	psevdometrika: {
		id: 'psevdometrika',
		term: 'Псевдометрика',
		short: String.raw`Метрика без различимости: $\rho(x,y)=0$ бывает и при $x\ne y$.`,
		formula: String.raw`\rho(x^2+4;\,x^2)=0`,
		body: String.raw`Функция $\rho$, для которой выполнены симметрия и неравенство треугольника, но не аксиома «$\rho(x,y)=0\Rightarrow x=y$» из списка [[metriki-rho|аксиом метрики]].

Равенство $\rho(x^2+4;\,x^2)=0$ показывает, что перед нами именно псевдометрика: две различные функции стоят на нулевом расстоянии. Настоящей метрикой она становится после перехода к [[faktor-prostranstvo|фактор-пространству]] — точками там служат классы, и нулевое расстояние означает совпадение классов. Порождается такая $\rho$ любой [[polunorma|полунормой]] по формуле $\rho(h_1,h_2)=\|h_1-h_2\|$.`,
		related: ['metriki-rho', 'polunorma', 'faktor-prostranstvo']
	},

	'lokalno-postoyannaya-funkciya': {
		id: 'lokalno-postoyannaya-funkciya',
		term: 'Локально постоянная функция',
		short: String.raw`Постоянна около каждой точки: $h'\equiv0$, но $h$ не обязана быть числом.`,
		formula: String.raw`h'\equiv0\ \text{на}\ D\iff h\ \text{локально постоянна}`,
		body: String.raw`Функция, постоянная в некоторой окрестности каждой точки области. На [[promezhutok|промежутке]] локально постоянная функция — просто константа, и поэтому «$+C$» работает.

На несвязном $D=(-\infty;0)\cup(0;+\infty)$ таких функций больше: у $\operatorname{sgn}x$ производная равна нулю в каждой точке $D$, но константой она не является. Поэтому $-\frac1x$ и $-\frac1x+\operatorname{sgn}x$ — две [[pervoobraznaya|первообразные]] одной функции $1/x^2$, отличающиеся не на число. Ядро дифференцирования на $D$ двумерно: по постоянной на каждую [[komponenta-svyaznosti|компоненту связности]].`,
		related: ['promezhutok', 'pervoobraznaya', 'komponenta-svyaznosti']
	},

	'teorema-lagranzha': {
		id: 'teorema-lagranzha',
		term: 'Теорема Лагранжа',
		short: String.raw`$f(b)-f(a)=f'(c)(b-a)$: наклон хорды достигается касательной.`,
		formula: String.raw`f(b)-f(a)=f'(c)(b-a),\qquad c\in(a,b)`,
		body: String.raw`Теорема о конечных приращениях (день 5). В теме первообразных она применяется в форме для класса $C^1([a;b])$; для вывода хватило бы и меньшего — непрерывности на отрезке и дифференцируемости внутри.

Это единственный работающий здесь инструмент: применённая к $H=F-G$ с $H'\equiv0$, она даёт $H(x_2)-H(x_1)=0$ на любом отрезке, лежащем внутри [[promezhutok|промежутка]], откуда $H=\mathrm{const}$. Смена языка на нормы и [[faktor-prostranstvo|фактор-пространства]] от неё не избавляет — меняется лишь то, в каком месте рассуждения она применяется.`,
		related: ['promezhutok', 'pervoobraznaya', 'faktor-prostranstvo']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Предел интегральных сумм при ранге разбиения, стремящемся к нулю.`,
		formula: String.raw`\int_a^b f(x)\,dx=\lim_{\lambda_R\to0}\sum_i f(\xi_i)\,\lambda_i`,
		body: String.raw`Интеграл Римана строится независимо от дифференцирования — как предел интегральных сумм $I(f,\lambda,\vec\xi)$ при [[rang-razbieniya|ранге разбиения]] $\lambda_R\to0$ на отрезке-[[lsk|ЛСК]] (дни 17–18).

Его значение — число, тогда как [[neopredelennyy-integral|неопределённый интеграл]] — класс функций; общего у них только знак $\int$. Связывает их [[teorema-nyutona-leybnica|формула Ньютона–Лейбница]] (день 20) — и именно потому, что объекты определены порознь, она содержательная теорема, а не переформулировка определения.`,
		related: ['neopredelennyy-integral', 'rang-razbieniya', 'lsk', 'teorema-nyutona-leybnica']
	},

	'teorema-nyutona-leybnica': {
		id: 'teorema-nyutona-leybnica',
		term: 'Теорема Ньютона–Лейбница',
		short: String.raw`$F(x)=\int_a^x f\,dt$ — первообразная, и $\int_a^b f=F(b)-F(a)$.`,
		formula: String.raw`\int_a^b f(t)\,dt=F(b)-F(a)`,
		body: String.raw`Формула дня 20: $\int_a^b f=F(b)-F(a)$ для **любой** [[pervoobraznaya|первообразной]] $F$. Существование первообразной у непрерывной $f$ она не доказывает — это отдельное утверждение с отдельным именем, [[teorema-barrou|теорема Барроу]] ($\Phi'=f$ для $\Phi(x)=\int_a^x f$); два имени за двумя разными фактами держатся весь курс.

Формула корректна именно потому, что разность $F(b)-F(a)$ не зависит от выбора представителя класса: [[proizvolnaya-postoyannaya|произвольная постоянная]] сокращается. Так [[opredelennyy-integral|определённый интеграл]] оказывается функционалом на классе, а не на функции.`,
		related: ['pervoobraznaya', 'opredelennyy-integral', 'proizvolnaya-postoyannaya', 'teorema-barrou']
	}
};
