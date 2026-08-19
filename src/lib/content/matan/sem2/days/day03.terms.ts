import type { Glossary } from '$lib/types';

// Термины дня 3: обратимость на сужении, производная обратной функции,
// производные высших порядков и дифференциалы.
// Карточки, заведённые в более ранних днях фазы (proizvodnaya, cepnoe-pravilo,
// notaciya-leybnica, operator-differencirovaniya,
// geometricheskiy-smysl-proizvodnoy), продублированы здесь намеренно:
// день должен резолвиться независимо, без чтения соседних файлов.
// Термины общего глоссария (end-r, skalyarnoe-pole, braket,
// klassy-differenciruemosti, vykolotaya-okrestnost, blacksquare, ...)
// не дублируются — на них только ссылки [[...]].
export const day03Terms: Glossary = {
	'obratnaya-funkciya': {
		id: 'obratnaya-funkciya',
		term: 'Обратная функция f⁻',
		short: String.raw`Отображение, отменяющее $f$ на сужении $\hat D$; записывается $f^-$.`,
		formula: String.raw`f^-\bigl(f(\hat d)\bigr)=\hat d,\qquad f\bigl(f^-(\hat e)\bigr)=\hat e`,
		body: String.raw`**Обратная функция** к $f$ на сужении $\hat D$ — такое $g$, что $g(f(\hat d))=\hat d$ для всех $\hat d\in\hat D$ и $f(g(\hat e))=\hat e$ для всех $\hat e\in\hat E=f(\hat D)$. Обозначается **$f^-$**: минус в верхнем индексе и есть знак обращения (так же пишут $4^-$ вместо $4^{-1}$).

Тот же символ работает и как прообраз: $f^-(U)=\{x\mid f(x)\in U\}$. Путать их не следует — прообраз определён для любой $f$, в том числе необратимой, и берётся от множества, а обратная функция требует обратимости и берётся от точки. Существование $f^-$ гарантирует [[obratimost-na-podmnozhestve|обратимость на подмножестве]], достаточное условие — [[strogaya-monotonnost|строгая монотонность]]. Её [[proizvodnaya|производная]] считается без явной формулы для $f^-$ — см. [[proizvodnaya-obratnoy-funkcii|теорему дня]].`,
		related: ['obratimost-na-podmnozhestve', 'proizvodnaya-obratnoy-funkcii', 'strogaya-monotonnost']
	},

	'obratimost-na-podmnozhestve': {
		id: 'obratimost-na-podmnozhestve',
		term: 'Обратимость на подмножестве',
		short: String.raw`Обращать функцию разрешено на сужении $\hat D$ с образом $\hat E=f(\hat D)$.`,
		formula: String.raw`\hat D\subset D,\quad \hat E=f(\hat D),\quad \exists g:\ g\circ f=\mathrm{id}_{\hat D},\ f\circ g=\mathrm{id}_{\hat E}`,
		body: String.raw`Постановка: дано $f:D\to E$, берётся $\hat D\subset D$, кладётся $\hat E=f(\hat D)$, и требуется существование $g$ с двумя тождествами — $f(g(\hat e))=\hat e$ и $g(f(\hat d))=\hat d$.

Смысл конструкции — не требовать биективности от всей $f$. У $f(x)=x^2$ обратной на $\mathbb R$ нет, но на $\hat D=[0;+\infty)$ есть. Именно на паре $(\hat D,\hat E)$ живёт [[obratnaya-funkciya|$f^-$]], и там же проверяется условие $f'(x_0)\ne0$ из [[proizvodnaya-obratnoy-funkcii|теоремы о производной обратной]].`,
		related: ['obratnaya-funkciya', 'strogaya-monotonnost', 'proizvodnaya-obratnoy-funkcii']
	},

	'proizvodnaya-obratnoy-funkcii': {
		id: 'proizvodnaya-obratnoy-funkcii',
		term: 'Производная обратной функции',
		short: String.raw`$(f^-)'(y_0)=1/f'(x_0)$ при $y_0=f(x_0)$ и $f'(x_0)\ne0$.`,
		formula: String.raw`(f^-)'(y_0)=\frac{1}{f'(x_0)},\qquad y_0=f(x_0)`,
		body: String.raw`**Теорема.** Если $\hat D$ — промежуток, $f$ строго монотонна и непрерывна на $\hat D$, дифференцируема в $x_0$ и $f'(x_0)\ne0$, то [[obratnaya-funkciya|$f^-$]] дифференцируема в $y_0=f(x_0)$ и $(f^-)'(y_0)=1/f'(x_0)$.

Два вывода. Первый — через перевёрнутое разностное отношение $\frac{\Delta x}{\Delta y}$; он даёт и само существование $(f^-)'(y_0)$, поэтому служит доказательством. Второй — дифференцирование тождества $f^-(f(x))=x$ по [[cepnoe-pravilo|цепному правилу]], что даёт $\frac{dg}{df}\cdot\frac{df}{dx}=1$; он короче, но дифференцируемость $f^-$ в нём предполагается заранее. Геометрия: отражение относительно биссектрисы меняет катеты местами, поэтому [[geometricheskiy-smysl-proizvodnoy|тангенс наклона]] переходит в обратную величину. Вторая производная: $(f^-)''=-f''/(f')^3$.`,
		related: ['obratnaya-funkciya', 'cepnoe-pravilo', 'geometricheskiy-smysl-proizvodnoy', 'obratimost-na-podmnozhestve']
	},

	'strogaya-monotonnost': {
		id: 'strogaya-monotonnost',
		term: 'Строгая монотонность',
		short: String.raw`$x_1<x_2\Rightarrow f(x_1)<f(x_2)$ — рабочее условие обратимости.`,
		formula: String.raw`x_1<x_2\ \Longrightarrow\ f(x_1)<f(x_2)\quad(\text{возрастание})`,
		body: String.raw`**Строгая монотонность** на $\hat D$ означает, что разным аргументам отвечают разные значения с сохранением порядка. Это достаточное условие [[obratimost-na-podmnozhestve|обратимости на подмножестве]]: инъективность следует из неё, сюръективность — из выбора $\hat E=f(\hat D)$.

Проверяется обычно знаком [[proizvodnaya|производной]]: $f'>0$ на промежутке даёт строгое возрастание. В доказательстве [[proizvodnaya-obratnoy-funkcii|теоремы о производной обратной]] она работает дважды — обеспечивает $\Delta y\ne0$ при $\Delta x\ne0$ и непрерывность [[obratnaya-funkciya|$f^-$]].`,
		related: ['obratimost-na-podmnozhestve', 'obratnaya-funkciya', 'proizvodnaya']
	},

	'cepnoe-pravilo': {
		id: 'cepnoe-pravilo',
		term: 'Цепное правило (производная суперпозиции)',
		short: String.raw`$(f(g(x)))'=f'(g(x))\cdot g'(x)$ — производная внешней на производную внутренней.`,
		formula: String.raw`\bigl(f(g(x))\bigr)'_x=f'_t\bigl(g(x)\bigr)\cdot g'(x)`,
		body: String.raw`**Производная суперпозиции**: для $f,g\in\operatorname{End}(\mathbb R)$ верно $\bigl(f(g(x))\bigr)'=f'(g(x))\cdot g'(x)$. Доказывается разбиением разностного отношения на два множителя: $\frac{\Delta f}{\Delta x}=\frac{\Delta f}{\Delta g}\cdot\frac{\Delta g}{\Delta x}$ с переходом к пределу в каждом.

В [[notaciya-leybnica|нотации Лейбница]] выглядит как сокращение дробей. Через него проходят оба вывода «из тождества»: [[proizvodnaya-obratnoy-funkcii|производная обратной]] (тождество $f^-(f(x))=x$) и производная неявной функции (тождество $F(\vec x,z)=0$).`,
		related: ['proizvodnaya', 'proizvodnaya-obratnoy-funkcii', 'notaciya-leybnica']
	},

	proizvodnaya: {
		id: 'proizvodnaya',
		term: 'Производная',
		short: String.raw`Предел разностного отношения при $\Delta x\to0$.`,
		formula: String.raw`f'(x)=\lim_{\Delta x\to0}\frac{f(x+\Delta x)-f(x)}{\Delta x}`,
		body: String.raw`**Производная** функции $f\in\operatorname{End}(\mathbb R)$ в точке — предел разностного отношения $\frac{\Delta f}{\Delta x}$ при $\Delta x\to0$.

Для полинома $P=\sum_k a_kx^k$ ту же операцию задаёт чисто алгебраическое правило $d_xP=\sum_k k\,a_kx^{k-1}$, в котором предел не участвует вовсе; на полиномах оба определения дают один и тот же результат. К понятию ведут три равноправных входа: предел $\frac{\Delta f}{\Delta x}$, [[geometricheskiy-smysl-proizvodnoy|геометрия касательной]] и правило Лейбница как алгебраическая аксиома. Повторное применение даёт [[proizvodnaya-vysshego-poryadka|производные высших порядков]].`,
		related: ['geometricheskiy-smysl-proizvodnoy', 'proizvodnaya-vysshego-poryadka', 'notaciya-leybnica', 'end-r']
	},

	'geometricheskiy-smysl-proizvodnoy': {
		id: 'geometricheskiy-smysl-proizvodnoy',
		term: 'Геометрический смысл производной',
		short: String.raw`$f'(x_0)=\operatorname{tg}\alpha$ — тангенс угла наклона касательной.`,
		formula: String.raw`f'(x_0)=\operatorname{tg}\alpha=\frac{dy}{dx}`,
		body: String.raw`**Геометрический смысл**: $f'(x_0)$ равно тангенсу угла $\alpha$ между касательной к графику в точке $x_0$ и осью абсцисс. В характеристическом треугольнике это отношение вертикального катета $dy$ к горизонтальному $dx$.

Отсюда мгновенно читается [[proizvodnaya-obratnoy-funkcii|производная обратной]]: отражение относительно биссектрисы $y=x$ меняет катеты местами, поэтому $\operatorname{tg}\alpha$ переходит в $\operatorname{ctg}\alpha=1/\operatorname{tg}\alpha$, а горизонтальная касательная ($f'=0$) становится вертикальной — производной нет. Характерный пример: у $e^x$ тангенс наклона равен самому значению функции.`,
		related: ['proizvodnaya', 'proizvodnaya-obratnoy-funkcii', 'differencial']
	},

	'notaciya-leybnica': {
		id: 'notaciya-leybnica',
		term: 'Нотации Ньютона, Лейбница, Лагранжа',
		short: String.raw`$\dot y$, $\frac{dy}{dx}$ и $y'$ — три записи одной производной.`,
		formula: String.raw`\dot y\;=\;\frac{dy}{dx}\;=\;y'`,
		body: String.raw`Одна и та же [[proizvodnaya|производная]] записывается тремя способами: $\dot y$ (Ньютон), $\frac{dy}{dx}$ (Лейбниц), $y'$ (Лагранж); переводить между ними нужно свободно. Используются также $f'_x$ и $g'_f$ — «производная по указанной переменной».

Нотация Лейбница не дробь, а определение [[differencial|дифференциала]] $df=f'(x)\,dx$. Зато выкладки в ней выглядят как сокращение дробей: $\frac{dg}{df}\cdot\frac{df}{dx}=\frac{dg}{dx}$ — это [[cepnoe-pravilo|цепное правило]], а при $g\circ f=\mathrm{id}$ то же сокращение даёт формулу производной обратной.`,
		related: ['proizvodnaya', 'differencial', 'cepnoe-pravilo', 'operator-differencirovaniya']
	},

	'proizvodnaya-vysshego-poryadka': {
		id: 'proizvodnaya-vysshego-poryadka',
		term: 'Производная высшего порядка',
		short: String.raw`$f^{(r)}=(f^{(r-1)})'$ — оператор дифференцирования, применённый $r$ раз.`,
		formula: String.raw`f^{(r)}=\bigl(f^{(r-1)}\bigr)',\qquad f^{(0)}=f`,
		body: String.raw`**Производная порядка $r$** определяется по индукции: $f''=(f')'$, $f'''=(f'')'$ и так далее. Операторно это читается как степень: $r$-я производная — $r$-я степень [[operator-differencirovaniya|оператора дифференцирования]], $\frac{d^r}{dx^r}=\bigl(\frac{d}{dx}\bigr)^r$.

По числу существующих порядков функции раскладываются по классам: $f\in\mathcal D^r(X)$, если $f$ дифференцируема $r$ раз на $X$, причём $\mathcal D^0(X)=C(X)$; [[klassy-differenciruemosti|$C^r(X)$]] — более узкий класс, где $r$-я производная ещё и непрерывна ($x^2\sin\frac1x$ лежит в $\mathcal D^1$, но не в $C^1$). Лестница вложена убывающе, $\mathcal D^0\supset\mathcal D^1\supset\dots\supset\mathcal D^{\aleph_0}$, где $\mathcal D^{\aleph_0}=C^{\infty}$ — бесконечно гладкие функции. Соответствующий дифференциал — $d^rf=f^{(r)}(x)\,dx^r$.`,
		related: ['operator-differencirovaniya', 'differencial-vtorogo-poryadka', 'proizvodnaya', 'klassy-differenciruemosti']
	},

	'operator-differencirovaniya': {
		id: 'operator-differencirovaniya',
		term: 'Оператор дифференцирования d/dx',
		short: String.raw`$\frac{d}{dx}$ — линейный оператор; $\frac{d^2}{dx^2}$ — его квадрат.`,
		formula: String.raw`\frac{d}{dx}\in\operatorname{End}(\mathcal P_4),\qquad \frac{d^2}{dx^2}=\Bigl(\frac{d}{dx}\Bigr)^{2}`,
		body: String.raw`Дифференцирование — **линейный оператор** на [[end-r|$\operatorname{End}(\mathbb R)$]], а не процедура: $\frac{d}{dx}$ линеен и удовлетворяет тождеству Лейбница, а композиция с самим собой даёт $\frac{d^2}{dx^2}$. Элементом $\operatorname{End}(\mathbb R)$ он при этом не является — там живут функции $\mathbb R\to\mathbb R$, а оператор переводит одну такую функцию в другую, поэтому корректная запись $\frac{d}{dx}\in\operatorname{End}(\mathcal P_4)$ на многочленах степени $\le4$.

На полиномах оператор выписывается **матрицей**: в базисе $1,x,x^2,x^3,x^4$ это сдвиг с коэффициентами $1,2,3,4$, а вторая производная — квадрат этой матрицы. Отсюда естественный взгляд на [[proizvodnaya-vysshego-poryadka|производные высших порядков]] и на правило $d^rf=f^{(r)}\,dx^r$ для [[differencial|дифференциалов]]: сколько раз применён оператор, такова и степень у $dx$.`,
		related: ['end-r', 'proizvodnaya-vysshego-poryadka', 'differencial', 'notaciya-leybnica']
	},

	differencial: {
		id: 'differencial',
		term: 'Дифференциал',
		short: String.raw`$df=f'(x)\,dx$ — главная линейная часть приращения.`,
		formula: String.raw`df=f'(x)\,dx,\qquad \Delta f=f'(x)\,\Delta x+\bar o(\Delta x)`,
		body: String.raw`**Дифференциал** функции — линейная функция приращения $dx\mapsto f'(x)\,dx$, приближающая $\Delta f$ с точностью до $\bar o(\Delta x)$. Например, $d(x^3+x^2)=(3x^2+2x)\,dx$. Именно так расшифровывается [[notaciya-leybnica|нотация Лейбница]]: $\frac{df}{dx}$ не дробь, а $df$, делённое на $dx$ по определению.

Для [[skalyarnoe-pole|скалярного поля]] дифференциал — скалярное произведение [[braket|$\langle\nabla f\mid\vec{dx}\rangle$]], то есть $df=\frac{\partial f}{\partial x}dx+\frac{\partial f}{\partial y}dy$. Смешанного члена $dx\,dy$ в нём **нет**: $df$ линеен по вектору приращения, а $dx\,dy$ квадратично. Член появляется только в [[differencial-vtorogo-poryadka|$d^2f$]].`,
		related: ['differencial-vtorogo-poryadka', 'notaciya-leybnica', 'skalyarnoe-pole', 'proizvodnaya']
	},

	'differencial-vtorogo-poryadka': {
		id: 'differencial-vtorogo-poryadka',
		term: 'Дифференциал второго порядка',
		short: String.raw`$d^2f=f''(x)\,dx^2$; для поля — квадратичная форма со смешанным членом.`,
		formula: String.raw`d^2f=f''(x)\,dx^2,\qquad d^2f(x,y)=f''_{xx}dx^2+2f''_{xy}\,dx\,dy+f''_{yy}dy^2`,
		body: String.raw`**Второй дифференциал** — результат повторного применения $d$: $d^2f=d(df)=d(f'(x)\,dx)=f''(x)\,dx^2$, где $dx$ при дифференцировании считается константой, а $dx^2$ означает $(dx)^2$, не $d(x^2)$.

Для [[skalyarnoe-pole|скалярного поля]] $d^2f$ — **квадратичная форма** от $(dx,dy)$, и здесь смешанный член уже есть; коэффициент $2$ появляется потому, что слагаемых со смешанной производной два, а равны они по теореме Клеро–Шварца. Матрица этой формы — матрица Гессе, отсюда идёт достаточное условие экстремума. Коэффициент при $dx\,dy$ — смешанная вторая производная $\frac{\partial^2f}{\partial x\,\partial y}$, а не произведение первых: для $f(x,y)=xy$ смешанная равна $1$, тогда как $\frac{\partial f}{\partial x}\frac{\partial f}{\partial y}=xy$.`,
		related: ['differencial', 'proizvodnaya-vysshego-poryadka', 'skalyarnoe-pole', 'operator-differencirovaniya']
	}
};
