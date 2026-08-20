import type { Glossary } from '$lib/types';

// Термины дня 1: производная функции одной переменной — алгебраический вход
// (формальная производная полинома) и аналитический (предел разностного
// отношения). Термин объявляется один раз на весь сайт: общие основания
// лежат в core/glossary.ts, сквозная нотация — в каноническом глоссарии
// семестра, термины соседних дней и первого семестра доступны по ссылке
// [[...]] и здесь не переобъявляются.
export const day01Terms: Glossary = {
	'raznostnoe-otnoshenie': {
		id: 'raznostnoe-otnoshenie',
		term: 'Разностное отношение',
		short: String.raw`$\Delta f/\Delta x$ — приращение функции на приращение аргумента.`,
		formula: String.raw`\frac{\Delta f}{\Delta x}=\frac{f(x+\Delta x)-f(x)}{\Delta x}`,
		body: String.raw`**Разностное отношение** — дробь $\frac{f(x+\Delta x)-f(x)}{\Delta x}$: приращение [[funkciya|функции]], делённое на приращение аргумента. Это угловой коэффициент секущей через точки $(x,f(x))$ и $(x+\Delta x,f(x+\Delta x))$.`,
		related: ['proizvodnaya', 'kasatelnaya']
	},

	'formalnaya-proizvodnaya-polinoma': {
		id: 'formalnaya-proizvodnaya-polinoma',
		term: 'Формальная производная полинома',
		short: String.raw`$d_xP$ — операция над коэффициентами, без всякого предела.`,
		formula: String.raw`d_x P=\sum_{k=1}^{n}k\,a_k\,x^{k-1}`,
		body: String.raw`**Формальная производная** полинома $P=\sum a_kx^k$ определяется правилом $a_k\mapsto k\,a_k$ со сдвигом степени вниз. Ни предела, ни непрерывности в определении нет, поэтому она осмысленна над любым [[kommutativnoe-kolco|коммутативным кольцом]] коэффициентов.`,
		related: ['kommutativnoe-kolco', 'proizvodnaya']
	},

	'kratnost-kornya': {
		id: 'kratnost-kornya',
		term: 'Кратность корня полинома',
		short: String.raw`Степень $t$ множителя $(x-c)$ в разложении полинома.`,
		formula: String.raw`P=(x-c)^t\,Q,\qquad Q(c)\neq0`,
		body: String.raw`Корень $c$ полинома $P$ имеет **кратность** $t$, если $P=(x-c)^tQ$ и $Q(c)\neq0$, то есть множитель $(x-c)$ выделяется ровно $t$ раз. При $t=1$ корень называют простым.`,
		related: ['formalnaya-proizvodnaya-polinoma', 'kommutativnoe-kolco']
	},

	differenciruemost: {
		id: 'differenciruemost',
		term: 'Дифференцируемость в точке',
		short: String.raw`Предел разностного отношения существует и конечен.`,
		formula: String.raw`\exists\,f'(x_0)\in\mathbb R\iff f'_-(x_0)=f'_+(x_0)\in\mathbb R`,
		body: String.raw`Функция **дифференцируема** в точке, если [[proizvodnaya|производная]] в ней существует и конечна. Равносильно: обе [[odnostoronnyaya-proizvodnaya|односторонние производные]] существуют, конечны и равны между собой.`,
		related: ['proizvodnaya', 'odnostoronnyaya-proizvodnaya', 'klassy-differenciruemosti']
	},

	'odnostoronnyaya-proizvodnaya': {
		id: 'odnostoronnyaya-proizvodnaya',
		term: 'Односторонняя производная',
		short: String.raw`Предел разностного отношения при $\Delta x\to+0$ или $\Delta x\to-0$.`,
		formula: String.raw`f'_{\pm}(x_0)=\lim_{\Delta x\to\pm0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}`,
		body: String.raw`$f'_+$ и $f'_-$ — пределы [[raznostnoe-otnoshenie|разностного отношения]] по правой и левой полуокрестности точки. Каждая из них может существовать сама по себе: у $|x|$ в нуле $f'_+=1$, $f'_-=-1$.`,
		related: ['proizvodnaya', 'differenciruemost']
	},

	kasatelnaya: {
		id: 'kasatelnaya',
		term: 'Касательная',
		short: String.raw`Предельное положение секущей; её наклон равен $f'(x_0)$.`,
		formula: String.raw`y=f(x_0)+f'(x_0)(x-x_0)`,
		body: String.raw`**Касательная** к графику в точке $x_0$ — предельное положение секущей при $\Delta x\to0$. Её угловой коэффициент равен [[proizvodnaya|производной]], откуда уравнение $y=f(x_0)+f'(x_0)(x-x_0)$. Вертикальная касательная существует и там, где производной нет.`,
		related: ['raznostnoe-otnoshenie', 'proizvodnaya']
	},

	'notaciya-nyutona': {
		id: 'notaciya-nyutona',
		term: 'Нотация Ньютона',
		short: String.raw`Точка сверху: $\dot y$, $\ddot y$ — производная по времени.`,
		formula: String.raw`\dot y,\qquad \ddot y`,
		body: String.raw`Производная обозначается точкой над функцией: $\dot y$, $\ddot y$. Запись пришла из механики, поэтому аргумент подразумевается единственный и это время; выше второго порядка практически не используется.`,
		related: ['notaciya-leybnica', 'notaciya-lagranzha']
	},

	'notaciya-leybnica': {
		id: 'notaciya-leybnica',
		term: 'Нотация Лейбница',
		short: String.raw`Дробь $dy/dx$; переменная дифференцирования видна явно.`,
		formula: String.raw`\frac{dy}{dx},\qquad \frac{d^2y}{dx^2}`,
		body: String.raw`Производная записывается дробью $\frac{dy}{dx}$, вторая — как $\frac{d^2y}{dx^2}$. Единственная из трёх нотаций, где явно назван аргумент дифференцирования, поэтому она обязательна там, где переменных несколько.`,
		related: ['notaciya-nyutona', 'notaciya-lagranzha', 'operator-differencirovaniya']
	},

	'notaciya-lagranzha': {
		id: 'notaciya-lagranzha',
		term: 'Нотация Лагранжа',
		short: String.raw`Штрих: $y'$, $y''$, $y^{(n)}$; с индексом — $f'_x$.`,
		formula: String.raw`y',\quad y'',\quad y^{(n)},\qquad f'_x`,
		body: String.raw`Производная обозначается штрихом: $y'$, $y''$, далее $y^{(n)}$. Самая компактная запись; переменная в ней не видна, поэтому при необходимости её дописывают индексом — $f'_x$.`,
		related: ['notaciya-nyutona', 'notaciya-leybnica']
	},

	'operator-differencirovaniya': {
		id: 'operator-differencirovaniya',
		term: 'Оператор дифференцирования',
		short: String.raw`$\frac{d}{dx}$ как линейное отображение пространства функций в себя.`,
		formula: String.raw`\frac{d}{dx}:\ f\mapsto f',\qquad \frac{d^2}{dx^2}=\left(\frac{d}{dx}\right)^{2}`,
		body: String.raw`$\frac{d}{dx}$ рассматривают как [[lineynost|линейное]] отображение, переводящее функцию в её [[proizvodnaya|производную]]; вторая производная — [[kompoziciya|композиция]] такого отображения с собой. Аргумент оператора — функция, а не число.`,
		related: ['lineynost', 'proizvodnaya', 'algebra-funkciy']
	},

	'tablichnye-proizvodnye': {
		id: 'tablichnye-proizvodnye',
		term: 'Табличные производные',
		short: String.raw`Список базовых производных, выводимых прямо из определения.`,
		formula: String.raw`(x^n)'=nx^{n-1},\quad(\sin x)'=\cos x,\quad(e^x)'=e^x,\quad(a^x)'=\ln a\cdot a^x`,
		body: String.raw`Базовый список: $(x^n)'=nx^{n-1}$, $(\sin x)'=\cos x$, $(e^x)'=e^x$, $(a^x)'=\ln a\cdot a^x$. Каждая строка добывается из определения [[proizvodnaya|производной]] сведением к одному из [[zamechatelnye-predely|замечательных пределов]].`,
		related: ['proizvodnaya', 'zamechatelnye-predely']
	},

	bilineynost: {
		id: 'bilineynost',
		term: 'Билинейность',
		short: String.raw`Линейность по каждому из двух аргументов при фиксированном другом.`,
		formula: String.raw`B(\lambda x_1+\mu x_2,\,y)=\lambda B(x_1,y)+\mu B(x_2,y)`,
		body: String.raw`Отображение двух аргументов **билинейно**, если при фиксированном втором аргументе оно [[lineynost|линейно]] по первому, и наоборот. Пример — умножение: $(\lambda f_1+\mu f_2)g=\lambda f_1g+\mu f_2g$.`,
		related: ['lineynost', 'distributivnost']
	},

	distributivnost: {
		id: 'distributivnost',
		term: 'Дистрибутивность и коммутативность',
		short: String.raw`$a(b+c)=ab+ac$ и $ab=ba$.`,
		formula: String.raw`a(b+c)=ab+ac,\qquad ab=ba`,
		body: String.raw`**Дистрибутивность** связывает умножение со сложением: $a(b+c)=ab+ac$. **Коммутативность** говорит, что порядок сомножителей не важен: $ab=ba$. Это аксиомы [[kommutativnoe-kolco|кольца]], а не свойства чисел, поэтому выполняются и там, где чисел нет.`,
		related: ['kommutativnoe-kolco', 'pole']
	},

	'kommutativnoe-kolco': {
		id: 'kommutativnoe-kolco',
		term: 'Коммутативное кольцо',
		short: String.raw`Множество со сложением и коммутативным умножением.`,
		formula: String.raw`(K,+,\cdot):\quad a+b=b+a,\ \ ab=ba,\ \ a(b+c)=ab+ac`,
		body: String.raw`**Кольцо** — [[mnozhestvo|множество]] со сложением (с нулём и противоположным элементом) и умножением, связанными [[distributivnost|дистрибутивностью]]. Кольцо **коммутативно**, если $ab=ba$. От [[pole|поля]] отличается тем, что обратный по умножению не требуется.`,
		related: ['distributivnost', 'pole', 'mnozhestvo']
	},

	nilpotentnost: {
		id: 'nilpotentnost',
		term: 'Нильпотентный оператор',
		short: String.raw`Некоторая степень оператора равна нулевому оператору.`,
		formula: String.raw`A^m=0\quad\text{при некотором }m\in\mathbb N_1`,
		body: String.raw`Оператор **нильпотентен**, если какая-то его степень — нулевой оператор: $A^m=0$. Отличных от нуля [[sobstvennyy-vektor|собственных значений]] у него быть не может: из $A\vec x=\lambda\vec x$ следует $A^m\vec x=\lambda^m\vec x$.`,
		related: ['sobstvennyy-vektor', 'lineynost']
	},

	'sobstvennyy-vektor': {
		id: 'sobstvennyy-vektor',
		term: 'Собственный вектор и собственное значение',
		short: String.raw`$A\vec x=\lambda\vec x$ — вектор, который оператор только растягивает.`,
		formula: String.raw`A\vec x=\lambda\vec x,\qquad \vec x\ne\bar 0`,
		body: String.raw`**Собственный вектор** [[lineynost|линейного]] оператора $A$ — ненулевой вектор, переходящий в кратный себе: $A\vec x=\lambda\vec x$. Число $\lambda$ называют **собственным значением**, а всё множество собственных значений — **спектром** оператора.`,
		related: ['lineynost', 'nilpotentnost', 'matrica']
	},

	'algebra-funkciy': {
		id: 'algebra-funkciy',
		term: 'Алгебра',
		short: String.raw`Линейное пространство, в котором элементы можно ещё и перемножать.`,
		formula: String.raw`\lambda f+\mu g\in A,\qquad f\cdot g\in A`,
		body: String.raw`**Алгебра** — [[lineynoe-prostranstvo|линейное пространство]], замкнутое ещё и относительно умножения своих элементов. Функции $\mathbb R\to\mathbb R$ и многочлены $\mathbb R[x]$ образуют алгебру относительно [[poelementnye-operacii|поточечных операций]].`,
		related: ['lineynoe-prostranstvo', 'poelementnye-operacii', 'end-r']
	},

	'zamechatelnye-predely': {
		id: 'zamechatelnye-predely',
		term: 'Замечательные пределы',
		short: String.raw`$\dfrac{\sin t}{t}\to1$ и $\dfrac{e^t-1}{t}\to1$ при $t\to0$.`,
		formula: String.raw`\lim_{t\to0}\frac{\sin t}{t}=1,\qquad \lim_{t\to0}\frac{e^t-1}{t}=1`,
		body: String.raw`Два эталонных [[predel-funkcii|предела]]: первый замечательный $\frac{\sin t}{t}\to1$ и второй в экспоненциальной форме $\frac{e^t-1}{t}\to1$. Оба раскрывают неопределённость $\frac00$, к которой сводятся остальные выкладки с элементарными функциями.`,
		related: ['predel-funkcii', 'tablichnye-proizvodnye']
	},

	'mashinnyy-epsilon': {
		id: 'mashinnyy-epsilon',
		term: 'Машинный эпсилон',
		short: String.raw`Относительная точность арифметики: $\approx2{,}2\cdot10^{-16}$ для double.`,
		formula: String.raw`\varepsilon_{\text{маш}}=\min\{\varepsilon>0:\ 1+\varepsilon\ne1\}`,
		body: String.raw`**Машинный эпсилон** — наименьшее число, которое при сложении с единицей ещё меняет результат; для двойной точности это $\approx2{,}2\cdot10^{-16}$. Он задаёт уровень, ниже которого вычитание близких чисел теряет значащие цифры.`,
		related: ['raznostnoe-otnoshenie', 'veshchestvennye-chisla']
	},

	'formula-eylera': {
		id: 'formula-eylera',
		term: 'Формула Эйлера',
		short: String.raw`$e^{ix}=\cos x+i\sin x$.`,
		formula: String.raw`e^{ix}=\cos x+i\sin x`,
		body: String.raw`**Формула Эйлера** связывает комплексную экспоненту с тригонометрией: $e^{ix}=\cos x+i\sin x$. При $x=\pi$ она даёт $e^{i\pi}+1=0$; умножение на $i$ в ней отвечает повороту на $90^\circ$.`,
		related: ['tablichnye-proizvodnye', 'sobstvennyy-vektor']
	}
};
