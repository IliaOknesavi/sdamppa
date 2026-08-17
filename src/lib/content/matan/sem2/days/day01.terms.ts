import type { Glossary } from '$lib/types';

// Термины дня 1 (семантические единицы 1–4, конспект «Производные», стр. 1–7).
// День открывает второй семестр, поэтому все понятия темы вводятся здесь
// впервые. Термины канонического глоссария курса — end-r, skalyarnoe-pole,
// klassy-differenciruemosti, vykolotaya-okrestnost, lvtnp, braket, blacksquare
// и прочая сквозная нотация — намеренно НЕ дублируются: на них только
// ссылки [[...]]. Всё остальное, на что ссылается день, объявлено ниже,
// чтобы день резолвился независимо от соседних файлов.
export const day01Terms: Glossary = {
	proizvodnaya: {
		id: 'proizvodnaya',
		term: 'Производная',
		short: String.raw`Предел разностного отношения при Δx → 0.`,
		formula: String.raw`f'(x)=\lim_{\Delta x\to0}\frac{f(x+\Delta x)-f(x)}{\Delta x}`,
		body: String.raw`**Производная** функции в точке — предел [[raznostnoe-otnoshenie|разностного отношения]] при $\Delta x\to0$. В конспекте это определение идёт под отдельным подзаголовком «Определение в матане» и появляется **после** алгебраической [[formalnaya-proizvodnaya-polinoma|формальной производной полинома]] — порядок, обратный классическому.

Как всегда в курсе, определение сразу поднимается в общность: для $f:H\to\mathbb R$ на нормированном $H$ пишется $\lim_{\|\Delta x\|\to0}\frac{f(x+\Delta x)-f(x)}{\|\Delta x\|}$, а $\mathbb R$ идёт частным случаем. ⚠️ Норма в знаменателе теряет знак приращения: уже для $f(x)=x$ отношение равно $\pm1$ и предела не имеет. Направление восстанавливает производная Фреше (дни 7–8).`,
		related: ['raznostnoe-otnoshenie', 'differenciruemost', 'formalnaya-proizvodnaya-polinoma', 'end-r']
	},

	'raznostnoe-otnoshenie': {
		id: 'raznostnoe-otnoshenie',
		term: 'Разностное отношение',
		short: String.raw`Δf/Δx — угловой коэффициент секущей.`,
		formula: String.raw`\frac{\Delta f}{\Delta x}=\frac{f(x+\Delta x)-f(x)}{\Delta x}`,
		body: String.raw`**Разностное отношение** — дробь $\frac{f(x+\Delta x)-f(x)}{\Delta x}$, приращение функции на приращение аргумента. Геометрически это угловой коэффициент секущей через точки $(x,f(x))$ и $(x+\Delta x,f(x+\Delta x))$; в пределе секущая переходит в [[kasatelnaya|касательную]], а отношение — в [[proizvodnaya|производную]].

Знаменатель запрещает $\Delta x=0$, поэтому предел берётся по выколотой окрестности нуля. В конспекте (стр. 5) встречается вспомогательный приём — замена $\nabla x=1/\Delta x$, сводящая предел в нуле к пределу на бесконечности с последующим выделением $\bar o$.`,
		related: ['proizvodnaya', 'kasatelnaya', 'odnostoronnyaya-proizvodnaya', 'asimptoticheskie-klassy']
	},

	'formalnaya-proizvodnaya-polinoma': {
		id: 'formalnaya-proizvodnaya-polinoma',
		term: 'Формальная производная полинома',
		short: String.raw`d_x P — операция над коэффициентами, вводится до всякого предела.`,
		formula: String.raw`d_x P=\sum_{k=1}^{n}k\,a_k\,x^{k-1}`,
		body: String.raw`**Формальная производная** полинома $P=\sum a_kx^k$ определяется чисто алгебраически: $a_k\mapsto k\,a_k$ со сдвигом степени вниз. Ни предела, ни непрерывности в определении нет, поэтому формула работает над любым коммутативным кольцом коэффициентов.

Именно с неё курс начинает тему — предел разностного отношения появляется страницей позже. Доказываются два свойства: линейность и [[pravilo-leybnica|тождество Лейбница]]; их достаточно, чтобы понижать [[kratnost-kornya|кратность корня]] и выписать матрицу [[operator-differencirovaniya|оператора]]. На мономах результат совпадает с аналитическим $(x^n)'=nx^{n-1}$, значит по линейности — и на всех полиномах. ⚠️ В конспекте индекс у коэффициента опущен: написано $k\,a\,x^{k-1}$.`,
		related: ['proizvodnaya', 'pravilo-leybnica', 'kratnost-kornya', 'operator-differencirovaniya']
	},

	'pravilo-leybnica': {
		id: 'pravilo-leybnica',
		term: 'Правило (тождество) Лейбница',
		short: String.raw`d(fg) = (df)·g + f·(dg) — в курсе это аксиома, а не теорема.`,
		formula: String.raw`d_x(f\cdot g)=(d_x f)\,g+f\,(d_x g)`,
		body: String.raw`**Правило Лейбница** — тождество $d_x(fg)=(d_xf)g+f(d_xg)$. Курс подаёт его как **третий равноправный вход** в понятие производной (наряду с пределом $\Delta f/\Delta x$ и геометрией) с пометкой «не накладывает ограничения на аргументы»: чтобы его записать, нужна только структура алгебры на множестве функций — ни предела, ни метрики.

Дифференцированием алгебры называют любое линейное $D$ с этим тождеством. На $\mathbb R[x]$ такое $D$ восстанавливается однозначно с точностью до множителя: $D=D(x)\cdot d_x$ — то есть аксиома Лейбница задаёт [[formalnaya-proizvodnaya-polinoma|производную]] лишь до нормировки $D(x)=1$. ⚠️ В учебниках (Фихтенгольц, Зорич) это теорема о производной произведения, доказываемая из предела.`,
		related: ['formalnaya-proizvodnaya-polinoma', 'operator-differencirovaniya', 'proizvodnaya', 'kratnost-kornya']
	},

	'kratnost-kornya': {
		id: 'kratnost-kornya',
		term: 'Кратность корня полинома',
		short: String.raw`Степень t множителя (x − c); дифференцирование понижает её на единицу.`,
		formula: String.raw`P=(x-c)^t\,Q,\qquad Q(c)\neq0`,
		body: String.raw`Корень $c$ полинома $P$ имеет **кратность** $t$, если $P=(x-c)^tQ$ и $Q(c)\neq0$. Основа — критерий корня: $P(c)=0\iff P=(x-c)Q$, доказываемый делением с остатком (остаток есть константа, подстановка $x=c$ обнуляет её).

Главный факт: [[formalnaya-proizvodnaya-polinoma|формальная производная]] понижает кратность ровно на единицу. По [[pravilo-leybnica|Лейбницу]] $d_xP=(x-c)^{t-1}\big(tQ+(x-c)d_xQ\big)$, и скобка в точке $c$ равна $tQ(c)\neq0$. ⚠️ В конспекте (стр. 2) корень записан цифрой «4» — это произвольное фиксированное число, а не константа формулы.`,
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

Разбор конспекта (стр. 4): для $f(x)=|x+2|$ односторонние пределы самой функции в точке $-2$ равны нулю (функция непрерывна), а $f'_+(-2)=1$ и $f'_-(-2)=-1$ — производной нет. Второй типовой сценарий потери производной: односторонний предел бесконечен, как у $\sqrt{x+1}$ в точке $-1$, где [[kasatelnaya|касательная]] вертикальна.`,
		related: ['proizvodnaya', 'differenciruemost', 'raznostnoe-otnoshenie', 'kasatelnaya']
	},

	kasatelnaya: {
		id: 'kasatelnaya',
		term: 'Касательная и геометрический смысл производной',
		short: String.raw`Предельное положение секущей; f′(x₀) = tg α.`,
		formula: String.raw`y=f(x_0)+f'(x_0)(x-x_0)`,
		body: String.raw`**Касательная** в точке $x_0$ — предельное положение секущей при $\Delta x\to0$. Так как угловой коэффициент секущей равен [[raznostnoe-otnoshenie|разностному отношению]], угловой коэффициент касательной равен [[proizvodnaya|производной]]: $f'(x_0)=\operatorname{tg}\alpha$, а сама прямая задаётся уравнением $y=f(x_0)+f'(x_0)(x-x_0)$.

Это семантическая единица 3 официального списка — «геометрический смысл производной одной переменной», её спрашивают отдельно от определения. Характерный пример курса: у экспоненты $\operatorname{tg}\alpha_x=f(x)$, то есть наклон касательной в каждой точке равен самому значению функции. Касательная может существовать и без производной — вертикальная, у которой углового коэффициента нет.`,
		related: ['raznostnoe-otnoshenie', 'proizvodnaya', 'tablichnye-proizvodnye', 'odnostoronnyaya-proizvodnaya']
	},

	'notaciya-nyutona': {
		id: 'notaciya-nyutona',
		term: 'Нотация Ньютона',
		short: String.raw`Точка сверху: ẏ, ÿ — производная по времени.`,
		formula: String.raw`\dot y,\qquad \ddot y`,
		body: String.raw`**Нотация Ньютона** обозначает производную точкой над функцией: $\dot y$, $\ddot y$. Пришла из механики, поэтому аргумент подразумевается единственный и это время; для производных выше второго порядка практически не используется.

Одна из трёх нотаций, вынесенных в отдельную семантическую единицу (№2) официального списка: спрашивают не определение, а **умение переводить** между $\dot y$, [[notaciya-leybnica|$dy/dx$]] и [[notaciya-lagranzha|$y'$]]. Соответствие прямое: $\dot y=\frac{dy}{dt}=y'_t$.`,
		related: ['notaciya-leybnica', 'notaciya-lagranzha', 'proizvodnaya']
	},

	'notaciya-leybnica': {
		id: 'notaciya-leybnica',
		term: 'Нотация Лейбница',
		short: String.raw`Дробь dy/dx; отсюда дифференциал и оператор d/dx.`,
		formula: String.raw`f'\equiv\frac{df}{dx},\qquad d(x^3+x^2)=(3x^2+2x)\,dx`,
		body: String.raw`**Нотация Лейбница** записывает производную дробью $\frac{dy}{dx}$, вторую — как $\frac{d^2y}{dx^2}$. Это единственная из трёх нотаций, где явно видно, по какой переменной дифференцируем, поэтому она обязательна для нескольких переменных: $\frac{df}{dx}$ — ФОП, $\frac{\partial f}{\partial x}$ — ФНП.

Из неё же вырастает дифференциал ($d(x^3+x^2)=(3x^2+2x)dx$) и, если снять аргумент, [[operator-differencirovaniya|оператор дифференцирования]] $\frac{d}{dx}$, композиция которого с собой даёт $\frac{d^2}{dx^2}$. Перевод в другие записи: $\frac{dy}{dx}=y'=\dot y$ (последнее — если аргумент время).`,
		related: ['notaciya-nyutona', 'notaciya-lagranzha', 'operator-differencirovaniya', 'proizvodnaya']
	},

	'notaciya-lagranzha': {
		id: 'notaciya-lagranzha',
		term: 'Нотация Лагранжа',
		short: String.raw`Штрих: y′, y″, y⁽ⁿ⁾; в курсе с индексом переменной.`,
		formula: String.raw`y',\quad y'',\quad y^{(n)},\qquad f'_x,\ g'_f`,
		body: String.raw`**Нотация Лагранжа** — штрих: $y'$, $y''$, далее $y^{(n)}$. Самая компактная и потому рабочая в вычислениях; в курсе оператор часто пишется как пустые скобки со штрихом $()'$.

Недостаток — не видно переменной, поэтому преподаватель добавляет индекс: $f'_x$ (производная $f$ по $x$), $g'_f$ (производная $g$ по $f$ в теореме об обратной функции), $f(t)'_t$ в цепном правиле. Перевод: $y'=\frac{dy}{dx}=\dot y$. Вместе с [[notaciya-nyutona|Ньютоном]] и [[notaciya-leybnica|Лейбницем]] образует семантическую единицу 2.`,
		related: ['notaciya-nyutona', 'notaciya-leybnica', 'proizvodnaya']
	},

	'operator-differencirovaniya': {
		id: 'operator-differencirovaniya',
		term: 'Оператор дифференцирования d/dx',
		short: String.raw`Линейный оператор на многочленах; d²/dx² — его квадрат.`,
		formula: String.raw`\frac{d}{dx}x^k=k\,x^{k-1},\qquad \frac{d^2}{dx^2}=\left(\frac{d}{dx}\right)^{2}`,
		body: String.raw`**Оператор дифференцирования** $()'\equiv\frac{d}{dx}$ — линейное отображение пространства функций в себя; вторая производная получается композицией, то есть квадратом оператора. На многочленах степени $\le4$ в базисе $1,x,x^2,x^3,x^4$ он задаётся матрицей с числами $1,2,3,4$ на наддиагонали. Матрица нильпотентна, спектр — только нуль: собственных векторов с $\lambda\ne0$ среди многочленов нет, а $(e^x)'=e^x$ задаёт ровно такой — значит экспонента не полином.

⚠️ Запись конспекта $\frac{d}{dx}\in\operatorname{End}(\mathbb R)$ неточна: [[end-r|$\operatorname{End}(\mathbb R)$]] в курсе — функции $\mathbb R\to\mathbb R$, а оператор действует на них; корректно $\frac{d}{dx}\in\operatorname{End}(\mathcal P_4)$.`,
		related: ['notaciya-leybnica', 'formalnaya-proizvodnaya-polinoma', 'end-r', 'pravilo-leybnica']
	},

	'tablichnye-proizvodnye': {
		id: 'tablichnye-proizvodnye',
		term: 'Табличные производные',
		short: String.raw`Список базовых производных; выводятся по определению, а не заучиваются.`,
		formula: String.raw`(x^n)'=nx^{n-1},\quad(\sin x)'=\cos x,\quad(e^x)'=e^x,\quad(a^x)'=\ln a\cdot a^x`,
		body: String.raw`**Табличные производные** — семантическая единица 4 официального списка. В курсе их не выдают готовым списком: каждая добывается из определения сведением к одному из двух эталонных пределов первого семестра, $\frac{\sin t}{t}\to1$ и $\frac{e^t-1}{t}\to1$. Для степени работает бином Ньютона, для синуса — свёртка разности в произведение, для корня — домножение на сопряжённое.

Равенство аналитической $(x^n)'=nx^{n-1}$ и [[formalnaya-proizvodnaya-polinoma|формальной производной]] монома — не случайность, а точка стыковки алгебраического и аналитического входов. Отдельно отмечается [[kasatelnaya|геометрический смысл]] экспоненты: $(e^x)'=e^x$ означает $\operatorname{tg}\alpha_x=f(x)$.`,
		related: ['proizvodnaya', 'formalnaya-proizvodnaya-polinoma', 'formula-eylera', 'kasatelnaya']
	},

	'formula-eylera': {
		id: 'formula-eylera',
		term: 'Формула Эйлера',
		short: String.raw`e^{ix} = cos x + i sin x; дифференцирование = поворот на 90°.`,
		formula: String.raw`e^{ix}=\cos x+i\sin x,\qquad \big(e^{ix}\big)'=i\,e^{ix}`,
		body: String.raw`**Формула Эйлера** $e^{ix}=\cos x+i\sin x$ (и её частный случай $e^{i\pi}+1=0$) используется в конспекте как рабочий пример с первой страницы — редкость для вещественного матанализа. Дифференцирование покомпонентно даёт $-\sin x+i\cos x$, что совпадает с $i\,e^{ix}$.

Так как умножение на $i$ — поворот на $90^\circ$, производная вектора $e^{i\varphi}$ перпендикулярна ему самому (движение по окружности вдоль [[kasatelnaya|касательной]]), а вторая производная равна $\big(re^{i\varphi}\big)''=-re^{i\varphi}$ — поворот на $180^\circ$, ускорение в центр. Отсюда же $y''=-y$ для синуса и косинуса. Экспонента остаётся собственным вектором [[operator-differencirovaniya|оператора $d/dx$]], только с мнимым собственным значением.`,
		related: ['tablichnye-proizvodnye', 'proizvodnaya', 'operator-differencirovaniya', 'kasatelnaya']
	}
};
