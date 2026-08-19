import type { Glossary } from '$lib/types';

// =====================================================================
//  День 22 — простейшие дроби и избавление от иррациональности.
//  Термины, введённые в предыдущих днях интегрального блока
//  (первообразная, неопределённый интеграл), продублированы здесь
//  намеренно: день должен резолвиться независимо от порядка сборки.
//  Канонический глоссарий склеивается последним и перекрывает совпадения.
// =====================================================================

export const day22Terms: Glossary = {
	'neprivodimyy-mnogochlen': {
		id: 'neprivodimyy-mnogochlen',
		term: 'Неприводимый над ℝ многочлен',
		short: String.raw`Не разлагается дальше: линейный или трёхчлен с $D<0$.`,
		formula: String.raw`x-a\quad\text{или}\quad x^2+px+q,\ D=p^2-4q<0`,
		body: String.raw`Над $\mathbb R$ неприводимы ровно многочлены первой степени и квадратные трёхчлены с отрицательным дискриминантом: невещественные корни идут [[sopryazhennye-korni|сопряжёнными парами]], и пара $(x-z)(x-\bar z)$ склеивается в вещественный трёхчлен. Отсюда и берётся ровно четыре типа [[prosteyshaya-drob|простейших дробей]] — два «линейных» и два «квадратичных», а кратность даёт вторую координату. Проверка $D<0$ не формальность: при $D\ge0$ дробь не простейшая, и единственности разложения для неё нет.`,
		related: ['prosteyshaya-drob', 'sopryazhennye-korni', 'pravilnaya-drob']
	},

	'sopryazhennye-korni': {
		id: 'sopryazhennye-korni',
		term: 'Комплексно-сопряжённые корни',
		short: String.raw`У вещественного многочлена невещественные корни идут парами $z$ и $\bar z$.`,
		formula: String.raw`P(z)=0\Rightarrow P(\bar z)=0,\qquad (x-z)(x-\bar z)=x^2+px+q`,
		body: String.raw`Если у многочлена с вещественными коэффициентами есть невещественный корень $z$, то $\bar z$ — тоже корень той же кратности, а произведение соответствующих множителей вещественно. Отсюда [[neprivodimyy-mnogochlen|неприводимый трёхчлен]] с $D<0$. На том же факте держится [[metod-podstanovki-korney|подстановка комплексного корня]]: равенство $Mz+N=0$ при $z\notin\mathbb R$ распадается на два вещественных, поэтому одна подстановка выдаёт сразу оба коэффициента [[prosteyshaya-drob|простейшей дроби]].`,
		related: ['neprivodimyy-mnogochlen', 'metod-podstanovki-korney', 'prosteyshaya-drob']
	},

	'prostranstvo-mnogochlenov': {
		id: 'prostranstvo-mnogochlenov',
		term: 'Пространство многочленов ℝ_<n[x]',
		short: String.raw`Многочлены степени меньше $n$; его размерность равна $n$.`,
		formula: String.raw`\mathbb R_{<n}[x]=\{c_0+c_1x+\dots+c_{n-1}x^{n-1}\},\qquad \dim\mathbb R_{<n}[x]=n`,
		body: String.raw`Многочлены степени строго меньше $n$ образуют линейное пространство размерности $n$ с базисом $1,x,\dots,x^{n-1}$. Именно туда попадает числитель [[pravilnaya-drob|правильной дроби]] и туда же бьёт отображение «набор коэффициентов $\to$ числитель после приведения к общему знаменателю». Совпадение размерностей превращает подсчёт в доказательство: хватает [[inektivnost-syuryektivnost|инъективности]], а существование [[prosteyshaya-drob|разложения]] следует само.`,
		related: ['pravilnaya-drob', 'prosteyshaya-drob', 'inektivnost-syuryektivnost']
	},

	'racionalnaya-parametrizaciya': {
		id: 'racionalnaya-parametrizaciya',
		term: 'Рациональная параметризация кривой',
		short: String.raw`Точки кривой выражаются рациональными функциями одного параметра.`,
		formula: String.raw`y^2=ax^2+bx+c:\qquad x=x(t),\ y=y(t)\ \text{— рациональные}`,
		body: String.raw`Кривая допускает рациональную параметризацию, если её точки пробегаются дробями от одного параметра. Приём один: провести прямую через фиксированную точку кривой и взять вторую точку пересечения. Три [[podstanovka-eylera|подстановки Эйлера]] — три способа выбрать эту точку у коники $y^2=ax^2+bx+c$, а [[universalnaya-podstanovka|$t=\operatorname{tg}\frac x2$]] — параметризация окружности. Рационализация возможна ровно для [[rod-krivoy|кривых рода нуль]].`,
		related: ['podstanovka-eylera', 'universalnaya-podstanovka', 'rod-krivoy', 'ellipticheskiy-integral']
	},

	'rod-krivoy': {
		id: 'rod-krivoy',
		term: 'Род кривой',
		short: String.raw`Род нуль — параметризуется рационально, род один — уже нет.`,
		formula: String.raw`y^2=P(x):\quad \deg P\le2\Rightarrow\text{род }0;\qquad \deg P\in\{3,4\}\Rightarrow\text{род }1`,
		body: String.raw`Род — инвариант алгебраической кривой, отвечающий за то, можно ли пробежать её точки рациональными формулами. У коники род нуль, поэтому [[racionalnaya-parametrizaciya|рациональная параметризация]] есть. У $y^2=P(x)$ с кубическим $P$ и различными корнями род равен единице: параметризации нет ни в каком виде, никакая замена не сводит интеграл к рациональному, и получается [[ellipticheskiy-integral|эллиптический интеграл]], не выражающийся в [[elementarnaya-funkciya|элементарных функциях]].`,
		related: ['racionalnaya-parametrizaciya', 'ellipticheskiy-integral', 'elementarnaya-funkciya']
	},

	'teorema-liuvillya': {
		id: 'teorema-liuvillya',
		term: 'Теорема Лиувилля об элементарных первообразных',
		short: String.raw`Точный критерий того, когда первообразная элементарна.`,
		formula: String.raw`\int e^{-x^2}dx,\quad \int\frac{dx}{\ln x},\quad \int\frac{dx}{\sqrt{P_3(x)}}\ \notin\ \text{элементарные}`,
		body: String.raw`Теорема описывает, какой вид обязана иметь [[pervoobraznaya|первообразная]], если она элементарна: элементарная функция плюс линейная комбинация логарифмов от элементарных. Проверка этого условия и доказывает неэлементарность $\int e^{-x^2}dx$ и [[ellipticheskiy-integral|эллиптических интегралов]] — то есть отвечает не «как взять интеграл», а «берётся ли он в [[elementarnaya-funkciya|элементарных функциях]] вообще». Машинная форма ответа — алгоритм Риша.`,
		related: ['elementarnaya-funkciya', 'ellipticheskiy-integral', 'pervoobraznaya']
	},

	polyus: {
		id: 'polyus',
		term: 'Полюс рациональной дроби',
		short: String.raw`Корень знаменателя, не сократившийся с числителем.`,
		formula: String.raw`Q(a)=0,\ P(a)\ne0\ \Rightarrow\ a\ \text{— полюс кратности }k`,
		body: String.raw`Полюс — точка, где дробь уходит в бесконечность: корень знаменателя, уцелевший после сокращения. Полюсу кратности $k$ отвечает группа слагаемых $\frac{A_1}{x-a},\dots,\frac{A_k}{(x-a)^k}$ в разложении на [[prosteyshaya-drob|простейшие дроби]]. Если корень сократился, полюса нет, и единственность разложения выражает это нулевым коэффициентом. По полюсам читается асимптотика [[pravilnaya-drob|дроби]] на бесконечности, а [[metod-podstanovki-korney|подстановка корня]] даёт старший коэффициент одной строкой.`,
		related: ['prosteyshaya-drob', 'pravilnaya-drob', 'metod-podstanovki-korney']
	},

	'pravilnaya-drob': {
		id: 'pravilnaya-drob',
		term: 'Правильная дробь',
		short: String.raw`Рациональная дробь со степенью числителя меньше степени знаменателя.`,
		formula: String.raw`\frac{P}{Q},\ \deg P<\deg Q;\qquad \frac{P}{Q}=S(x)+\frac{R_0(x)}{Q(x)}`,
		body: String.raw`Дробь $\frac PQ$ **правильная**, если $\deg P<\deg Q$. Неправильную сначала делят с остатком: $P=QS+R_0$, и целая часть $S$ интегрируется почленно. Правильность — не удобство, а условие теоремы о разложении на [[prosteyshaya-drob|простейшие дроби]]: число неизвестных коэффициентов равно $\deg Q$ по разложению знаменателя само по себе, а правильность нужна, чтобы числитель попал в то же пространство многочленов степени меньше $\deg Q$. Забытое деление уголком даёт несовместную систему: справа после приведения к знаменателю $Q$ стоит многочлен степени меньше $\deg Q$, а слева — числитель степени $\deg P\geqslant\deg Q$.`,
		related: ['prosteyshaya-drob', 'metod-neopredelennyh-koefficientov', 'neopredelennyy-integral']
	},

	'prosteyshaya-drob': {
		id: 'prosteyshaya-drob',
		term: 'Простейшая дробь',
		short: String.raw`Один из четырёх кирпичей, на которые распадается любая правильная дробь.`,
		formula: String.raw`\frac{A}{x-a},\quad \frac{A}{(x-a)^k},\quad \frac{Mx+N}{x^2+px+q},\quad \frac{Mx+N}{(x^2+px+q)^k},\ \ p^2-4q<0`,
		body: String.raw`Четыре типа: два «линейных» и два «квадратичных», причём у трёхчлена обязательно $D=p^2-4q<0$ — при неотрицательном дискриминанте он раскладывается и дробь не простейшая. Типов ровно четыре, потому что над $\mathbb R$ многочлен распадается на линейные множители и неприводимые квадратичные (комплексные корни идут сопряжёнными парами), а кратность даёт вторую координату. Каждый тип интегрируется явно: степень, логарифм, арктангенс.`,
		related: ['pravilnaya-drob', 'vydelenie-polnogo-kvadrata', 'rekurrentnaya-formula', 'elementarnaya-funkciya']
	},

	'metod-neopredelennyh-koefficientov': {
		id: 'metod-neopredelennyh-koefficientov',
		term: 'Метод неопределённых коэффициентов',
		short: String.raw`Приравнивание коэффициентов при одинаковых степенях после общего знаменателя.`,
		formula: String.raw`P(x)=\sum_{i,\nu}A_{i\nu}\frac{Q(x)}{(x-a_i)^{\nu}}+\dots\ \Longrightarrow\ \text{СЛАУ порядка }\deg Q`,
		body: String.raw`Обе части разложения приводят к общему знаменателю, числители приравнивают как многочлены и получают линейную систему на коэффициенты. Работает всегда и не требует знания корней численно, но стоит системы порядка $\deg Q$. Быстрее — гибрид с [[metod-podstanovki-korney|подстановкой корней]]: корнями снимают всё, что снимается даром, остаток добивают системой. Единственность решения гарантирована теоремой о разложении на [[prosteyshaya-drob|простейшие дроби]].`,
		related: ['metod-podstanovki-korney', 'prosteyshaya-drob', 'pravilnaya-drob']
	},

	'metod-podstanovki-korney': {
		id: 'metod-podstanovki-korney',
		term: 'Метод подстановки корней',
		short: String.raw`Подстановка корня знаменателя гасит все слагаемые, кроме одного.`,
		formula: String.raw`x=a_i\ \Rightarrow\ A_{ik_i}=\left.\frac{P(x)(x-a_i)^{k_i}}{Q(x)}\right|_{x=a_i}`,
		body: String.raw`В тождестве числителей подставляют корень знаменателя — и все слагаемые, кроме одного, обнуляются. Для простого вещественного корня коэффициент выписывается одной строкой. Приём распространяется и на квадратичные множители: подстановка комплексного корня $x=z$ трёхчлена даёт сразу два вещественных уравнения (на вещественную и мнимую части). При кратных корнях требуется ещё дифференцирование тождества — там дешевле [[metod-neopredelennyh-koefficientov|неопределённые коэффициенты]].`,
		related: ['metod-neopredelennyh-koefficientov', 'prosteyshaya-drob']
	},

	'vydelenie-polnogo-kvadrata': {
		id: 'vydelenie-polnogo-kvadrata',
		term: 'Выделение полного квадрата',
		short: String.raw`Сдвиг $t=x+p/2$, после которого трёхчлен становится $t^2+a^2$.`,
		formula: String.raw`x^2+px+q=\left(x+\frac p2\right)^2+a^2,\qquad a^2=q-\frac{p^2}{4}>0\iff D<0`,
		body: String.raw`Сдвиг переменной, превращающий трёхчлен с отрицательным дискриминантом в сумму квадратов. После него интеграл от [[prosteyshaya-drob|простейшей дроби]] третьего типа распадается надвое: кусок с производной знаменателя даёт логарифм, остаток — арктангенс. Тот же сдвиг сводит четвёртый тип к $I_k=\int\frac{dt}{(t^2+a^2)^k}$ и запускает [[rekurrentnaya-formula|рекуррентную формулу]]. Условие $a^2>0$ — это ровно проверка $D<0$.`,
		related: ['prosteyshaya-drob', 'rekurrentnaya-formula', 'trigonometricheskaya-podstanovka']
	},

	'rekurrentnaya-formula': {
		id: 'rekurrentnaya-formula',
		term: 'Рекуррентная формула для I_k',
		short: String.raw`Спуск по степени: интеграл типа IV сводится к арктангенсу за k−1 шагов.`,
		formula: String.raw`I_{k+1}=\frac{t}{2ka^2(t^2+a^2)^k}+\frac{2k-1}{2ka^2}I_k,\qquad I_1=\frac1a\operatorname{arctg}\frac ta`,
		body: String.raw`Формула понижает степень знаменателя в $I_k=\int\frac{dt}{(t^2+a^2)^k}$ на единицу; проверяется прямым дифференцированием правой части. Вместе с [[vydelenie-polnogo-kvadrata|выделением полного квадрата]] она закрывает четвёртый тип [[prosteyshaya-drob|простейших дробей]] — последний, для которого ответ не выписывается сразу. Именно она делает утверждение «любая рациональная функция интегрируется в [[elementarnaya-funkciya|элементарных функциях]]» полным, а не почти полным.`,
		related: ['prosteyshaya-drob', 'vydelenie-polnogo-kvadrata', 'elementarnaya-funkciya']
	},

	'podstanovka-eylera': {
		id: 'podstanovka-eylera',
		term: 'Подстановка Эйлера',
		short: String.raw`Три замены, делающие $R(x,\sqrt{ax^2+bx+c})$ рациональной по новой переменной.`,
		formula: String.raw`a>0:\ \sqrt{ax^2+bx+c}=t\pm x\sqrt a;\quad c>0:\ =xt\pm\sqrt c;\quad \exists x_1:\ =t(x-x_1)`,
		body: String.raw`Три случая вместе покрывают все невырожденные трёхчлены. Механизм один: после возведения в квадрат член с $x^2$ сокращается, уравнение становится линейным по $x$, и $x$, $dx$, сам корень выражаются рациональными функциями $t$ — дальше работает разложение на [[prosteyshaya-drob|простейшие дроби]]. Геометрически это три способа рационально параметризовать конику $y^2=ax^2+bx+c$; для кубики под корнем механизм не запускается ([[ellipticheskiy-integral|эллиптический интеграл]]).`,
		related: ['trigonometricheskaya-podstanovka', 'prosteyshaya-drob', 'ellipticheskiy-integral']
	},

	'trigonometricheskaya-podstanovka': {
		id: 'trigonometricheskaya-podstanovka',
		term: 'Тригонометрическая подстановка',
		short: String.raw`Три замены под три вида корня: sin, tg и 1/cos.`,
		formula: String.raw`\sqrt{a^2-x^2}:\ x=a\sin t;\quad \sqrt{a^2+x^2}:\ x=a\operatorname{tg}t;\quad \sqrt{x^2-a^2}:\ x=\frac{a}{\cos t}`,
		body: String.raw`Каждая замена снимает корень тождеством: $1-\sin^2t=\cos^2t$, $1+\operatorname{tg}^2t=\frac1{\cos^2t}$, $\frac1{\cos^2t}-1=\operatorname{tg}^2t$. Применяется после [[vydelenie-polnogo-kvadrata|выделения полного квадрата]], приводящего трёхчлен к чистому виду. Результат — тригонометрический интеграл, который рационализуется [[universalnaya-podstanovka|универсальной подстановкой]]. Даёт тот же ответ, что и [[podstanovka-eylera|подстановка Эйлера]]: параметризация у коники по существу одна.`,
		related: ['podstanovka-eylera', 'vydelenie-polnogo-kvadrata', 'universalnaya-podstanovka']
	},

	'drobno-lineynaya-podstanovka': {
		id: 'drobno-lineynaya-podstanovka',
		term: 'Дробно-линейная подстановка',
		short: String.raw`Замена $t^n=(ax+b)/(cx+d)$ убирает корень степени $n$.`,
		formula: String.raw`t^{\,n}=\frac{ax+b}{cx+d}\ \Longrightarrow\ x=\frac{d\,t^{\,n}-b}{a-c\,t^{\,n}}`,
		body: String.raw`Для $\int R\left(x,\sqrt[n]{\frac{ax+b}{cx+d}}\right)dx$ новая переменная сама и есть корень, а $x$ выражается через неё рациональной функцией — значит рационален и $dx$. Частный случай $c=0$, $d=1$ — обычный корень $\sqrt[n]{ax+b}$: так берётся $\int\frac{x^3dx}{\sqrt{1-x}}$ заменой $t=\sqrt{1-x}$, после которой под интегралом остаётся многочлен. Разные корни из одного дробно-линейного выражения снимаются общей заменой с $n=\text{НОК}$ показателей.`,
		related: ['podstanovka-eylera', 'prosteyshaya-drob', 'elementarnaya-funkciya']
	},

	'universalnaya-podstanovka': {
		id: 'universalnaya-podstanovka',
		term: 'Универсальная подстановка t = tg(x/2)',
		short: String.raw`Рационализует любой интеграл от рациональной функции синуса и косинуса.`,
		formula: String.raw`\sin x=\frac{2t}{1+t^2},\qquad \cos x=\frac{1-t^2}{1+t^2},\qquad dx=\frac{2\,dt}{1+t^2}`,
		body: String.raw`Замена $t=\operatorname{tg}\frac x2$ — рациональная параметризация окружности, поэтому она превращает $\int R(\sin x,\cos x)dx$ в интеграл от рациональной функции и сводит задачу к [[prosteyshaya-drob|простейшим дробям]]. Работает всегда, но раздувает степень знаменателя, поэтому сначала проверяют три частных случая: нечётность по синусу даёт $t=\cos x$, нечётность по косинусу — $t=\sin x$, чётность по обоим — $t=\operatorname{tg}x$ с $dx=\frac{dt}{1+t^2}$.`,
		related: ['trigonometricheskaya-podstanovka', 'prosteyshaya-drob', 'elementarnaya-funkciya']
	},

	'elementarnaya-funkciya': {
		id: 'elementarnaya-funkciya',
		term: 'Элементарная функция',
		short: String.raw`Конечная композиция степенных, exp, ln, тригонометрических и обратных к ним.`,
		body: String.raw`Функции из констант и $x$, получаемые конечным числом арифметических операций и композиций со степенной, показательной, логарифмической, тригонометрическими и обратными к ним функциями. Класс замкнут относительно дифференцирования, но **не** относительно интегрирования: любая рациональная функция в нём интегрируется, а $\int e^{-x^2}dx$ и [[ellipticheskiy-integral|эллиптические интегралы]] — уже нет. Граница описывается теоремой Лиувилля.`,
		related: ['ellipticheskiy-integral', 'prosteyshaya-drob', 'neopredelennyy-integral']
	},

	'ellipticheskiy-integral': {
		id: 'ellipticheskiy-integral',
		term: 'Эллиптический интеграл',
		short: String.raw`Интеграл от $R(x,\sqrt{P})$ с кубическим или биквадратным $P$; не элементарен.`,
		formula: String.raw`\int\frac{R(x)\,dx}{\sqrt{P(x)}},\qquad \deg P\in\{3,4\},\ \text{корни различны}`,
		body: String.raw`Интеграл $\int\frac{\sqrt{3-x}}{\sqrt{x^2-1}}dx$ приводится к $\int\frac{(3-x)dx}{\sqrt{(3-x)(x^2-1)}}$, где под корнем стоит кубический многочлен с тремя различными корнями. Кривая $y^2=P(x)$ тогда не допускает рациональной параметризации, [[podstanovka-eylera|подстановки Эйлера]] не запускаются, и по теореме Лиувилля результат не выражается в [[elementarnaya-funkciya|элементарных функциях]]. Такой интеграл возникает в задаче о маятнике с большой амплитудой.`,
		related: ['elementarnaya-funkciya', 'podstanovka-eylera', 'drobno-lineynaya-podstanovka']
	},

	'neopredelennyy-integral': {
		id: 'neopredelennyy-integral',
		term: 'Неопределённый интеграл',
		short: String.raw`Множество первообразных: $F(x)+C=\int f(x)\,dx$.`,
		formula: String.raw`\int f(x)\,dx=F(x)+C,\qquad F'(x)=f(x)`,
		body: String.raw`Определённый интеграл $\int_a^b f\,dx$ — число, построенное по разбиению, его [[rang-razbieniya|рангу]] и суммам Дарбу. Неопределённый интеграл $\int f\,dx=F+C$ — целый класс функций, отличающихся константой, где $F$ — любая [[pervoobraznaya|первообразная]] для $f$. Вся техника дня (разложение на дроби, подстановки) относится именно к неопределённому интегралу: пределы подставляются в самом конце.`,
		related: ['pervoobraznaya', 'rang-razbieniya', 'lsk']
	},

	'pervoobraznaya': {
		id: 'pervoobraznaya',
		term: 'Первообразная',
		short: String.raw`$F$ с $F'=f$; определена с точностью до константы.`,
		formula: String.raw`F'(x)=f(x),\qquad f\in C^0[a,b]`,
		body: String.raw`Функция $F$ называется первообразной для $f$, если $F'=f$. Произвол «$+C$» описывается полунормой $\lVert h\rVert_C=\sup|h'|$: на константах она нулевая, поэтому $\rho(x^2+4;\,x^2)=0$ — это уже не метрика, а псевдометрика, и пространство первообразных есть фактор по её ядру, то есть по константам. Практическое следствие для сегодняшней техники: первообразная строится отдельно на каждом интервале области определения, поэтому у $\int\frac{dx}{x^2-1}$ на трёх интервалах константы независимы.`,
		related: ['neopredelennyy-integral', 'end-r', 'elementarnaya-funkciya']
	}
};
