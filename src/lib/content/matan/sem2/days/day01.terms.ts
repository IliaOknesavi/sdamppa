import type { Glossary } from '$lib/types';

// Термины дня 1: производная функции одной переменной — алгебраический вход
// (формальная производная полинома) и аналитический (предел разностного
// отношения). Сквозная нотация — end-r, skalyarnoe-pole,
// klassy-differenciruemosti, vykolotaya-okrestnost, lvtnp, braket,
// blacksquare — определена в общем глоссарии и здесь намеренно не
// дублируется: на неё только ссылки [[...]]. Всё остальное, на что ссылается
// день, объявлено ниже, чтобы день резолвился независимо от соседних файлов.
export const day01Terms: Glossary = {
	proizvodnaya: {
		id: 'proizvodnaya',
		term: 'Производная',
		short: String.raw`Предел разностного отношения при Δx → 0.`,
		formula: String.raw`f'(x)=\lim_{\Delta x\to0}\frac{f(x+\Delta x)-f(x)}{\Delta x}`,
		body: String.raw`**Производная** функции в точке — предел [[raznostnoe-otnoshenie|разностного отношения]] при $\Delta x\to0$. Тот же объект задаётся и чисто алгебраически: на полиномах это [[formalnaya-proizvodnaya-polinoma|формальная производная]], определённая без всякого предела, и на мономах оба определения совпадают.

Определение просится в общность: для $f:H\to\mathbb R$ на нормированном $H$ напрашивается $\lim_{\|\Delta x\|\to0}\frac{f(x+\Delta x)-f(x)}{\|\Delta x\|}$, где $\mathbb R$ идёт частным случаем. Но норма в знаменателе теряет знак приращения: уже для $f(x)=x$ отношение равно $\pm1$ и предела не имеет, так что такой записи удовлетворяли бы только функции с нулевой производной. Направление восстанавливает производная Фреше (дни 7–8).`,
		related: ['raznostnoe-otnoshenie', 'differenciruemost', 'formalnaya-proizvodnaya-polinoma', 'end-r']
	},

	'raznostnoe-otnoshenie': {
		id: 'raznostnoe-otnoshenie',
		term: 'Разностное отношение',
		short: String.raw`Δf/Δx — угловой коэффициент секущей.`,
		formula: String.raw`\frac{\Delta f}{\Delta x}=\frac{f(x+\Delta x)-f(x)}{\Delta x}`,
		body: String.raw`**Разностное отношение** — дробь $\frac{f(x+\Delta x)-f(x)}{\Delta x}$, приращение функции на приращение аргумента. Геометрически это угловой коэффициент секущей через точки $(x,f(x))$ и $(x+\Delta x,f(x+\Delta x))$; в пределе секущая переходит в [[kasatelnaya|касательную]], а отношение — в [[proizvodnaya|производную]].

Знаменатель запрещает $\Delta x=0$, поэтому предел берётся по выколотой окрестности нуля. Тот же предел можно смотреть и «с другого конца»: подстановка $\nabla x=1/\Delta x$ переводит $\Delta x\to0$ в $\nabla x\to\infty$, где работают [[asimptoticheskie-klassy|асимптотические классы]] $O,\ \bar o,\ \Theta$ (день 2).`,
		related: ['proizvodnaya', 'kasatelnaya', 'odnostoronnyaya-proizvodnaya', 'asimptoticheskie-klassy']
	},

	'formalnaya-proizvodnaya-polinoma': {
		id: 'formalnaya-proizvodnaya-polinoma',
		term: 'Формальная производная полинома',
		short: String.raw`d_x P — операция над коэффициентами, без всякого предела.`,
		formula: String.raw`d_x P=\sum_{k=1}^{n}k\,a_k\,x^{k-1}`,
		body: String.raw`**Формальная производная** полинома $P=\sum a_kx^k$ определяется чисто алгебраически: $a_k\mapsto k\,a_k$ со сдвигом степени вниз. Ни предела, ни непрерывности в определении нет, поэтому формула работает над любым коммутативным кольцом коэффициентов.

Из неё выводятся два свойства: линейность и [[pravilo-leybnica|тождество Лейбница]]; их достаточно, чтобы понижать [[kratnost-kornya|кратность корня]] и выписать матрицу [[operator-differencirovaniya|оператора]]. На мономах результат совпадает с аналитическим $(x^n)'=nx^{n-1}$, значит по линейности — и на всех полиномах.`,
		related: ['proizvodnaya', 'pravilo-leybnica', 'kratnost-kornya', 'operator-differencirovaniya']
	},

	'pravilo-leybnica': {
		id: 'pravilo-leybnica',
		term: 'Правило (тождество) Лейбница',
		short: String.raw`d(fg) = (df)·g + f·(dg) — тождество, задающее дифференцирование алгебры.`,
		formula: String.raw`d_x(f\cdot g)=(d_x f)\,g+f\,(d_x g)`,
		body: String.raw`**Правило Лейбница** — тождество $d_x(fg)=(d_xf)g+f(d_xg)$. Его можно взять за исходное свойство и получить третий вход в понятие производной, наряду с пределом $\Delta f/\Delta x$ и геометрией секущей: чтобы записать тождество, нужна только структура алгебры на множестве функций — ни предела, ни метрики.

Дифференцированием алгебры называют любое линейное $D$ с этим тождеством. На $\mathbb R[x]$ такое $D$ восстанавливается однозначно с точностью до множителя: $D=D(x)\cdot d_x$, поэтому одной аксиомы мало — нужна ещё нормировка $D(x)=1$, иначе под определение попадёт и $x\frac{d}{dx}$. Из предела разностного отношения то же тождество получается как теорема (день 2).`,
		related: ['formalnaya-proizvodnaya-polinoma', 'operator-differencirovaniya', 'proizvodnaya', 'kratnost-kornya']
	},

	'kratnost-kornya': {
		id: 'kratnost-kornya',
		term: 'Кратность корня полинома',
		short: String.raw`Степень t множителя (x − c); дифференцирование понижает её на единицу.`,
		formula: String.raw`P=(x-c)^t\,Q,\qquad Q(c)\neq0`,
		body: String.raw`Корень $c$ полинома $P$ имеет **кратность** $t$, если $P=(x-c)^tQ$ и $Q(c)\neq0$. Основа — критерий корня: $P(c)=0\iff P=(x-c)Q$, доказываемый делением с остатком (остаток есть константа, подстановка $x=c$ обнуляет её).

Главный факт: [[formalnaya-proizvodnaya-polinoma|формальная производная]] понижает кратность ровно на единицу. По [[pravilo-leybnica|Лейбницу]] $d_xP=(x-c)^{t-1}\big(tQ+(x-c)d_xQ\big)$, и скобка в точке $c$ равна $tQ(c)\neq0$. Отсюда кратный корень доживает до $d_x^{\,t-1}P$ и исчезает у $d_x^{\,t}P$.`,
		related: ['formalnaya-proizvodnaya-polinoma', 'pravilo-leybnica', 'operator-differencirovaniya']
	},

	differenciruemost: {
		id: 'differenciruemost',
		term: 'Дифференцируемость в точке',
		short: String.raw`Конечный предел разностного отношения существует; односторонние равны.`,
		formula: String.raw`\exists\,f'(x_0)\in\mathbb R\iff f'_-(x_0)=f'_+(x_0)\in\mathbb R`,
		body: String.raw`Функция **дифференцируема** в точке, если предел [[raznostnoe-otnoshenie|разностного отношения]] в ней существует и конечен. Равносильная проверка: обе [[odnostoronnyaya-proizvodnaya|односторонние производные]] существуют, конечны и равны.

Дифференцируемость влечёт непрерывность, так как $\Delta f=\frac{\Delta f}{\Delta x}\cdot\Delta x\to f'(x)\cdot0=0$. Обратное неверно: $|x+2|$ непрерывна в $-2$, но имеет там излом, а $\sqrt{x+1}$ в точке $-1$ — вертикальную касательную. Многократная дифференцируемость даёт цепочку [[klassy-differenciruemosti|классов гладкости]] $\mathcal D^0,\mathcal D^1,\dots,\mathcal D^{\aleph_0}$.`,
		related: ['proizvodnaya', 'odnostoronnyaya-proizvodnaya', 'klassy-differenciruemosti', 'raznostnoe-otnoshenie']
	},

	'odnostoronnyaya-proizvodnaya': {
		id: 'odnostoronnyaya-proizvodnaya',
		term: 'Односторонняя производная',
		short: String.raw`Предел разностного отношения при Δx → +0 или Δx → −0.`,
		formula: String.raw`f'_{\pm}(x_0)=\lim_{\Delta x\to\pm0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}`,
		body: String.raw`**Односторонние производные** $f'_+$ и $f'_-$ — пределы [[raznostnoe-otnoshenie|разностного отношения]] по правой и левой полуокрестности. [[proizvodnaya|Производная]] существует тогда и только тогда, когда обе конечны и равны между собой.

Пример: для $f(x)=|x+2|$ односторонние пределы самой функции в точке $-2$ равны нулю (функция непрерывна), а $f'_+(-2)=1$ и $f'_-(-2)=-1$ — производной нет. Второй типовой сценарий потери производной: односторонний предел бесконечен, как у $\sqrt{x+1}$ в точке $-1$, где [[kasatelnaya|касательная]] вертикальна.`,
		related: ['proizvodnaya', 'differenciruemost', 'raznostnoe-otnoshenie', 'kasatelnaya']
	},

	kasatelnaya: {
		id: 'kasatelnaya',
		term: 'Касательная и геометрический смысл производной',
		short: String.raw`Предельное положение секущей; f′(x₀) = tg α.`,
		formula: String.raw`y=f(x_0)+f'(x_0)(x-x_0)`,
		body: String.raw`**Касательная** в точке $x_0$ — предельное положение секущей при $\Delta x\to0$. Так как угловой коэффициент секущей равен [[raznostnoe-otnoshenie|разностному отношению]], угловой коэффициент касательной равен [[proizvodnaya|производной]]: $f'(x_0)=\operatorname{tg}\alpha$, а сама прямая задаётся уравнением $y=f(x_0)+f'(x_0)(x-x_0)$.

В этом и состоит геометрический смысл производной. Характерный пример — экспонента: $\operatorname{tg}\alpha_x=f(x)$, то есть наклон касательной в каждой точке равен самому значению функции. Касательная может существовать и без производной — вертикальная, у которой углового коэффициента нет: так устроена $\sqrt{x+1}$ в точке $-1$.`,
		related: ['raznostnoe-otnoshenie', 'proizvodnaya', 'tablichnye-proizvodnye', 'odnostoronnyaya-proizvodnaya']
	},

	'notaciya-nyutona': {
		id: 'notaciya-nyutona',
		term: 'Нотация Ньютона',
		short: String.raw`Точка сверху: ẏ, ÿ — производная по времени.`,
		formula: String.raw`\dot y,\qquad \ddot y`,
		body: String.raw`**Нотация Ньютона** обозначает производную точкой над функцией: $\dot y$, $\ddot y$. Пришла из механики, поэтому аргумент подразумевается единственный и это время; для производных выше второго порядка практически не используется.

Одна из трёх записей одного и того же объекта. Перевод в остальные две прямой: $\dot y=\frac{dy}{dt}=y'_t$, где [[notaciya-leybnica|$dy/dx$]] явно называет переменную, а [[notaciya-lagranzha|$y'$]] короче всех.`,
		related: ['notaciya-leybnica', 'notaciya-lagranzha', 'proizvodnaya']
	},

	'notaciya-leybnica': {
		id: 'notaciya-leybnica',
		term: 'Нотация Лейбница',
		short: String.raw`Дробь dy/dx; отсюда дифференциал и оператор d/dx.`,
		formula: String.raw`f'\equiv\frac{df}{dx},\qquad d(x^3+x^2)=(3x^2+2x)\,dx`,
		body: String.raw`**Нотация Лейбница** записывает производную дробью $\frac{dy}{dx}$, вторую — как $\frac{d^2y}{dx^2}$. Это единственная из трёх нотаций, где явно видно, по какой переменной дифференцируем, поэтому она обязательна для нескольких переменных: $\frac{df}{dx}$ — производная функции одной переменной, $\frac{\partial f}{\partial x}$ — частная производная.

Из неё же вырастает дифференциал ($d(x^3+x^2)=(3x^2+2x)dx$) и, если снять аргумент, [[operator-differencirovaniya|оператор дифференцирования]] $\frac{d}{dx}$, композиция которого с собой даёт $\frac{d^2}{dx^2}$. Перевод в другие записи: $\frac{dy}{dx}=y'=\dot y$ (последнее — если аргумент время).`,
		related: ['notaciya-nyutona', 'notaciya-lagranzha', 'operator-differencirovaniya', 'proizvodnaya']
	},

	'notaciya-lagranzha': {
		id: 'notaciya-lagranzha',
		term: 'Нотация Лагранжа',
		short: String.raw`Штрих: y′, y″, y⁽ⁿ⁾; с индексом переменной — f′_x, g′_f.`,
		formula: String.raw`y',\quad y'',\quad y^{(n)},\qquad f'_x,\ g'_f`,
		body: String.raw`**Нотация Лагранжа** — штрих: $y'$, $y''$, далее $y^{(n)}$. Самая компактная и потому рабочая в вычислениях; оператор в ней записывается пустыми скобками со штрихом $()'$.

Недостаток — не видно переменной, поэтому к штриху добавляют индекс: $f'_x$ (производная $f$ по $x$), $g'_f$ (производная $g$ по $f$ в теореме об обратной функции), $f(t)'_t$ в цепном правиле. Перевод: $y'=\frac{dy}{dx}=\dot y$; вместе с [[notaciya-nyutona|Ньютоном]] и [[notaciya-leybnica|Лейбницем]] это три равноправные записи одной операции.`,
		related: ['notaciya-nyutona', 'notaciya-leybnica', 'proizvodnaya']
	},

	'operator-differencirovaniya': {
		id: 'operator-differencirovaniya',
		term: 'Оператор дифференцирования d/dx',
		short: String.raw`Линейный оператор на многочленах; d²/dx² — его квадрат.`,
		formula: String.raw`\frac{d}{dx}x^k=k\,x^{k-1},\qquad \frac{d^2}{dx^2}=\left(\frac{d}{dx}\right)^{2}`,
		body: String.raw`**Оператор дифференцирования** $()'\equiv\frac{d}{dx}$ — линейное отображение пространства функций в себя; вторая производная получается композицией, то есть квадратом оператора. На многочленах степени $\le4$ в базисе $1,x,x^2,x^3,x^4$ он задаётся матрицей с числами $1,2,3,4$ на наддиагонали. Матрица нильпотентна, спектр — только нуль: собственных векторов с $\lambda\ne0$ среди многочленов нет, а $(e^x)'=e^x$ задаёт ровно такой — значит экспонента не полином.

Оператор действует на функциях, а не на числах: [[end-r|$\operatorname{End}(\mathbb R)$]] — это функции $\mathbb R\to\mathbb R$, тогда как $\frac{d}{dx}$ переводит одну такую функцию в другую. Корректная запись — $\frac{d}{dx}\in\operatorname{End}(\mathcal P_4)$ на многочленах степени $\le4$.`,
		related: ['notaciya-leybnica', 'formalnaya-proizvodnaya-polinoma', 'end-r', 'pravilo-leybnica']
	},

	'tablichnye-proizvodnye': {
		id: 'tablichnye-proizvodnye',
		term: 'Табличные производные',
		short: String.raw`Список базовых производных; каждая выводится по определению.`,
		formula: String.raw`(x^n)'=nx^{n-1},\quad(\sin x)'=\cos x,\quad(e^x)'=e^x,\quad(a^x)'=\ln a\cdot a^x`,
		body: String.raw`**Табличные производные** — базовый список $(x^n)'=nx^{n-1}$, $(\sin x)'=\cos x$, $(e^x)'=e^x$, $(a^x)'=\ln a\cdot a^x$. Каждая добывается из определения сведением к одному из двух эталонных пределов, $\frac{\sin t}{t}\to1$ и $\frac{e^t-1}{t}\to1$: для степени работает бином Ньютона, для синуса — свёртка разности в произведение, для корня — домножение на сопряжённое.

Равенство аналитической $(x^n)'=nx^{n-1}$ и [[formalnaya-proizvodnaya-polinoma|формальной производной]] монома — не случайность, а точка стыковки алгебраического и аналитического входов. Отдельно отмечается [[kasatelnaya|геометрический смысл]] экспоненты: $(e^x)'=e^x$ означает $\operatorname{tg}\alpha_x=f(x)$.`,
		related: ['proizvodnaya', 'formalnaya-proizvodnaya-polinoma', 'formula-eylera', 'kasatelnaya']
	},

	bilineynost: {
		id: 'bilineynost',
		term: 'Билинейность',
		short: String.raw`Линейность по каждому из двух аргументов при фиксированном другом.`,
		formula: String.raw`B(\lambda P_1+\mu P_2,\,Q)=\lambda B(P_1,Q)+\mu B(P_2,Q)`,
		body: String.raw`Отображение двух аргументов **билинейно**, если оно линейно по каждому из них при фиксированном другом. Умножение полиномов билинейно по паре $(P,Q)$, и вместе с линейностью [[operator-differencirovaniya|оператора $d_x$]] это делает билинейными обе части [[pravilo-leybnica|тождества Лейбница]].

Отсюда рабочий приём: две билинейные формы, совпавшие на всех парах базисных векторов, совпадают всюду. Поэтому тождество достаточно проверить на мономах $x^m,x^n$ — и доказательство для [[formalnaya-proizvodnaya-polinoma|формальной производной]] сводится к одной строке вместо перебора всех пар полиномов.`,
		related: ['pravilo-leybnica', 'formalnaya-proizvodnaya-polinoma', 'operator-differencirovaniya']
	},

	distributivnost: {
		id: 'distributivnost',
		term: 'Дистрибутивность и коммутативность',
		short: String.raw`Законы кольца: $a(b+c)=ab+ac$ и $ab=ba$.`,
		formula: String.raw`a(b+c)=ab+ac,\qquad ab=ba`,
		body: String.raw`**Дистрибутивность** связывает умножение со сложением: $a(b+c)=ab+ac$. **Коммутативность** говорит, что порядок сомножителей не важен: $ab=ba$. Это аксиомы [[kommutativnoe-kolco|кольца]], а не свойства чисел, поэтому они выполняются и там, где чисел нет.

На них держится доказательство линейности [[formalnaya-proizvodnaya-polinoma|формальной производной]]: раскрытие $k(a_k+b_k)=k\,a_k+k\,b_k$ — это дистрибутивность, а перестановка множителей в проверке [[pravilo-leybnica|тождества Лейбница]] на мономах — коммутативность.`,
		related: ['kommutativnoe-kolco', 'formalnaya-proizvodnaya-polinoma', 'pravilo-leybnica']
	},

	'kommutativnoe-kolco': {
		id: 'kommutativnoe-kolco',
		term: 'Коммутативное кольцо',
		short: String.raw`Множество со сложением и коммутативным умножением.`,
		formula: String.raw`(K,+,\cdot):\quad a+b=b+a,\ \ ab=ba,\ \ a(b+c)=ab+ac`,
		body: String.raw`**Кольцо** — множество, где определены сложение (с нулём и противоположным элементом) и умножение, связанные [[distributivnost|дистрибутивностью]]. Кольцо **коммутативно**, если $ab=ba$. Примеры: $\mathbb Z$, $\mathbb Q$, $\mathbb R$, $\mathbb C$ и многочлены над любым из них.

Зачем это здесь: определение [[formalnaya-proizvodnaya-polinoma|формальной производной]] $a_k\mapsto k\,a_k$ не упоминает ни предела, ни порядка, поэтому дословно работает над любым коммутативным кольцом коэффициентов. Оговорка «$t\ne0$ в кольце коэффициентов» в разборе [[kratnost-kornya|кратности корня]] — ровно про это: над $\mathbb R$ она выполнена автоматически, над кольцом вычетов — нет.`,
		related: ['distributivnost', 'formalnaya-proizvodnaya-polinoma', 'kratnost-kornya']
	},

	nilpotentnost: {
		id: 'nilpotentnost',
		term: 'Нильпотентный оператор',
		short: String.raw`Некоторая степень оператора равна нулевому оператору.`,
		formula: String.raw`A^m=0\quad\text{при некотором }m\in\mathbb N_1`,
		body: String.raw`Оператор **нильпотентен**, если какая-то его степень — нулевой оператор: $A^m=0$. Спектр такого оператора состоит из одного нуля: [[sobstvennyy-vektor|собственных значений]] $\lambda\ne0$ у него быть не может, иначе $A^m\vec x=\lambda^m\vec x\ne\bar 0$.

Пример дня: [[operator-differencirovaniya|$d/dx$]] на многочленах степени $\le4$ нильпотентен с $m=5$ — пятикратное дифференцирование убивает любой такой многочлен, и матрица $5\times5$ в пятой степени равна нулю. Отсюда и вывод: экспонента, у которой $(e^x)'=e^x$, полиномом быть не может.`,
		related: ['operator-differencirovaniya', 'sobstvennyy-vektor', 'formalnaya-proizvodnaya-polinoma']
	},

	'sobstvennyy-vektor': {
		id: 'sobstvennyy-vektor',
		term: 'Собственный вектор, собственное значение, спектр',
		short: String.raw`$A\vec x=\lambda\vec x$ — вектор, который оператор только растягивает.`,
		formula: String.raw`A\vec x=\lambda\vec x,\qquad \vec x\ne\bar 0`,
		body: String.raw`**Собственный вектор** оператора $A$ — ненулевой вектор, который $A$ переводит в кратный ему: $A\vec x=\lambda\vec x$. Число $\lambda$ называют **собственным значением**, а множество всех собственных значений — **спектром**.

Для [[operator-differencirovaniya|оператора $d/dx$]] это читается буквально: $(e^x)'=e^x$ означает, что экспонента — собственный вектор с $\lambda=1$, а $(e^{ix})'=i\,e^{ix}$ ([[formula-eylera|формула Эйлера]]) — с $\lambda=i$. На многочленах степени $\le4$ спектр состоит из одного нуля, потому что матрица оператора [[nilpotentnost|нильпотентна]].`,
		related: ['operator-differencirovaniya', 'nilpotentnost', 'formula-eylera']
	},

	'algebra-funkciy': {
		id: 'algebra-funkciy',
		term: 'Алгебра функций и дифференцирование алгебры',
		short: String.raw`Линейное пространство, в котором есть ещё и умножение элементов.`,
		formula: String.raw`\lambda f+\mu g\in A,\qquad f\cdot g\in A`,
		body: String.raw`**Алгебра** — линейное пространство, замкнутое ещё и относительно умножения своих элементов. Функции $\mathbb R\to\mathbb R$ ([[end-r|$\operatorname{End}(\mathbb R)$]]) и многочлены $\mathbb R[x]$ — алгебры: их можно складывать, умножать на число и перемножать между собой.

Это ровно та структура, которой хватает для третьего входа в производную: **дифференцированием алгебры** называют линейный оператор $D$ с [[pravilo-leybnica|тождеством Лейбница]] $D(fg)=(Df)g+f(Dg)$. От аргумента при этом не требуется ни предела, ни метрики — только умножение внутри алгебры.`,
		related: ['pravilo-leybnica', 'end-r', 'operator-differencirovaniya']
	},

	'zamechatelnye-predely': {
		id: 'zamechatelnye-predely',
		term: 'Замечательные (эталонные) пределы',
		short: String.raw`$\sin t/t\to1$ и $(e^t-1)/t\to1$ — из них собрана вся таблица.`,
		formula: String.raw`\lim_{t\to0}\frac{\sin t}{t}=1,\qquad \lim_{t\to0}\frac{e^t-1}{t}=1`,
		body: String.raw`Два предела, к которым сводятся все выводы [[tablichnye-proizvodnye|табличных производных]]: $\frac{\sin t}{t}\to1$ (первый замечательный) и $\frac{e^t-1}{t}\to1$ (второй, записанный через экспоненту). Рядом с ними работает $\frac{\ln(1+u)}{u}\to1$ — тот же второй, прочитанный после замены.

Приём всегда один: из [[raznostnoe-otnoshenie|разностного отношения]] выносят множитель, не зависящий от $\Delta x$, а остаток подгоняют под эталон домножением знаменателя. Отсюда $(\sin x)'=\cos x$, $(e^x)'=e^x$, $(a^x)'=\ln a\cdot a^x$.`,
		related: ['tablichnye-proizvodnye', 'raznostnoe-otnoshenie', 'proizvodnaya']
	},

	'mashinnyy-epsilon': {
		id: 'mashinnyy-epsilon',
		term: 'Машинный эпсилон',
		short: String.raw`Относительная точность арифметики double: $\approx2{,}2\cdot10^{-16}$.`,
		formula: String.raw`\varepsilon_{\text{маш}}\approx2{,}2\cdot10^{-16},\qquad h_{\text{опт}}\approx\sqrt{\varepsilon_{\text{маш}}}`,
		body: String.raw`**Машинный эпсилон** $\varepsilon_{\text{маш}}$ — наименьшее число, которое ещё отличимо от нуля при сложении с единицей; для двойной точности это $\approx2{,}2\cdot10^{-16}$. Вычитание близких чисел теряет значащие цифры именно на этом уровне.

Отсюда оптимальный шаг численного дифференцирования: у односторонней разности погрешность метода порядка $h$, а шум округления порядка $\varepsilon_{\text{маш}}/h$, и минимум суммы даёт $h\approx\sqrt{\varepsilon_{\text{маш}}}\approx10^{-8}$; у центральной схемы — $h\approx\varepsilon_{\text{маш}}^{1/3}\approx10^{-5}$. Правило «возьму $h$ поменьше, будет точнее» поэтому ложно.`,
		related: ['raznostnoe-otnoshenie', 'proizvodnaya', 'odnostoronnyaya-proizvodnaya']
	},

	'formula-eylera': {
		id: 'formula-eylera',
		term: 'Формула Эйлера',
		short: String.raw`e^{ix} = cos x + i sin x; дифференцирование = поворот на 90°.`,
		formula: String.raw`e^{ix}=\cos x+i\sin x,\qquad \big(e^{ix}\big)'=i\,e^{ix}`,
		body: String.raw`**Формула Эйлера** $e^{ix}=\cos x+i\sin x$ (и её частный случай $e^{i\pi}+1=0$) позволяет продифференцировать комплексную экспоненту покомпонентно: получается $-\sin x+i\cos x$, что совпадает с $i\,e^{ix}$. Значит $\big(e^{ix}\big)'=i\,e^{ix}$.

Так как умножение на $i$ — поворот на $90^\circ$, производная вектора $e^{i\varphi}$ перпендикулярна ему самому (движение по окружности вдоль [[kasatelnaya|касательной]]), а вторая производная равна $\big(re^{i\varphi}\big)''=-re^{i\varphi}$ — поворот на $180^\circ$, ускорение в центр. Отсюда же $y''=-y$ для синуса и косинуса. Экспонента остаётся собственным вектором [[operator-differencirovaniya|оператора $d/dx$]], только с мнимым собственным значением.`,
		related: ['tablichnye-proizvodnye', 'proizvodnaya', 'operator-differencirovaniya', 'kasatelnaya']
	}
};
