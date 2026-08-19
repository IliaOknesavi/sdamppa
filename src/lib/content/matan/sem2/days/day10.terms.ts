import type { Glossary } from '$lib/types';

// Термины дня 10: дифференциал в End(ℝ) и для скалярных полей — первого и
// высших порядков.
// День не пользуется таблицей вторых производных как объектом и не опирается
// на равенство смешанных: и то и другое вводится в дне 11, куда ведут отсылки.
// Часть карточек намеренно ДУБЛИРУЕТ термины соседних дней (gradient,
// chastnaya-proizvodnaya, smeshannaya-proizvodnaya), чтобы день резолвился
// независимо.
// Сквозная нотация (end-r, skalyarnoe-pole, braket, blacksquare и др.)
// живёт в каноническом глоссарии и здесь не переобъявляется.
export const day10Terms: Glossary = {
	differencial: {
		id: 'differencial',
		term: 'Дифференциал',
		short: String.raw`Линейная часть приращения: $df=f'(x)\,dx$, где $dx$ — свободная переменная.`,
		formula: String.raw`df=f'(x)\,dx`,
		body: String.raw`**Дифференциал** функции — линейная часть её приращения. В [[end-r|$\operatorname{End}(\mathbb R)$]] он получается прямо из лейбницевой записи $f'\equiv\frac{df}{dx}$: $df=f'(x)\,dx$; например, $d(x^3+x^2)=(3x^2+2x)dx$.

Величина $dx$ — не «бесконечно малое», а **свободная переменная**, так что $df(x;dx)$ зависит от двух аргументов и линейна по второму. Согласованность обозначения проверяется на $y=x$: там $dy=dx$. Из $\Delta f=f'(x)\Delta x+\bar o(\Delta x)$ видно, что $df$ забирает линейное слагаемое, а $\bar o$ отбрасывается.`,
		related: ['pervyy-differencial', 'vtoroy-differencial', 'invariantnost-formy', 'end-r']
	},

	'pervyy-differencial': {
		id: 'pervyy-differencial',
		term: 'Первый дифференциал скалярного поля',
		short: String.raw`Линейная форма $df=\langle\nabla f\mid\vec{dx}\rangle$ по вектору приращений.`,
		formula: String.raw`df=\sum_{i=1}^{n}\frac{\partial f}{\partial x_i}\,dx_i=\langle\nabla f\mid\vec{dx}\rangle`,
		body: String.raw`Для [[skalyarnoe-pole|скалярного поля]] первый дифференциал складывается из вкладов всех [[chastnaya-proizvodnaya|частных производных]]: $df=\sum_i\frac{\partial f}{\partial x_i}dx_i$. Коэффициенты — компоненты [[gradient|градиента]], приращения собраны в [[vektor-differencialov|вектор дифференциалов]], и в [[braket|bra-ket]]-записи всё сворачивается в одну скобку.

Это **линейная форма** от $\vec{dx}$: при замене $\vec{dx}\mapsto t\,\vec{dx}$ она умножается на $t$. Отсюда сразу следует, что [[smeshannyy-chlen|члена $dx\,dy$]] в ней быть не может.`,
		related: ['differencial', 'gradient', 'vektor-differencialov', 'smeshannyy-chlen']
	},

	'vtoroy-differencial': {
		id: 'vtoroy-differencial',
		term: 'Второй дифференциал',
		short: String.raw`$d^2f=d(df)$ при замороженном $\vec{dx}$ — однородная форма степени 2.`,
		formula: String.raw`d^2f=\sum_{i=1}^{n}\sum_{j=1}^{n}\frac{\partial^2f}{\partial x_i\,\partial x_j}\,dx_i\,dx_j`,
		body: String.raw`**Второй дифференциал** — результат повторного применения оператора $d$ при замороженных приращениях: $d^2f=d(df)$. Для поля двух переменных

$$d^2f=f''_{xx}dx^2+\bigl(f''_{xy}+f''_{yx}\bigr)dx\,dy+f''_{yy}dy^2,$$

и оба [[smeshannaya-proizvodnaya|смешанных]] слагаемых входят порознь: свернуть их в один коэффициент $2f''_{xy}$ разрешает отдельная теорема дня 11. В матричном виде $d^2f$ читается как квадратичная форма таблицы вторых производных — это тоже день 11. В отличие от первого, форма второго дифференциала **не** [[invariantnost-formy|инвариантна]] при замене переменных.`,
		related: ['pervyy-differencial', 'differencialy-vysshih-poryadkov', 'vektor-differencialov', 'smeshannaya-proizvodnaya']
	},

	'vektor-differencialov': {
		id: 'vektor-differencialov',
		term: 'Вектор дифференциалов dx⃗',
		short: String.raw`Набор приращений координат $\vec{dx}=(dx,\,dy)$ как один вектор.`,
		formula: String.raw`\vec{dx}=(dx,\ dy),\qquad df=\langle\nabla f\mid\vec{dx}\rangle`,
		body: String.raw`Приращения всех координат собираются в один вектор $\vec{dx}=(dx,\,dy)$, и тогда [[pervyy-differencial|первый дифференциал]] записывается скобкой $df=\langle\nabla f\mid\vec{dx}\rangle$, а [[vtoroy-differencial|второй]] — квадратичной формой $(\vec{dx})^{T}H\,\vec{dx}$.

Практическая польза записи — проверка ответа на однородность: дифференциал порядка $k$ обязан умножаться на $t^k$ при замене $\vec{dx}\mapsto t\,\vec{dx}$. Именно этот тест ловит лишний $dx\,dy$ в первом дифференциале.`,
		related: ['pervyy-differencial', 'vtoroy-differencial', 'gradient']
	},

	'smeshannyy-chlen': {
		id: 'smeshannyy-chlen',
		term: 'Смешанный член dx·dy',
		short: String.raw`В первом дифференциале его нет; появляется во втором с коэффициентом $2$.`,
		formula: String.raw`df=f'_x\,dx+f'_y\,dy,\qquad d^2f\ni 2f''_{xy}\,dx\,dy`,
		body: String.raw`В [[pervyy-differencial|первом дифференциале]] смешанного члена нет: в записи $df(x,y)=\ldots dx+\ldots dy+\ldots dx\,dy$ третье слагаемое лишнее.

Причина — [[odnorodnost|однородность]]: $df$ линеен по [[vektor-differencialov|вектору дифференциалов]], а $dx\,dy$ квадратичен. Произведение приращений возникает только во [[vtoroy-differencial|втором дифференциале]], и приходит оно суммой двух вкладов — от пути $x\to y$ и от пути $y\to x$. Равны ли эти вклады, решается в дне 11.`,
		related: ['pervyy-differencial', 'vtoroy-differencial', 'smeshannaya-proizvodnaya']
	},

	'invariantnost-formy': {
		id: 'invariantnost-formy',
		term: 'Инвариантность формы дифференциала',
		short: String.raw`$dy=f'(u)\,du$ верно при любом происхождении $u$; для $d^2y$ — уже нет.`,
		formula: String.raw`dy=f'(u)\,du,\qquad d^2y=f''(u)\,du^2+f'(u)\,d^2u`,
		body: String.raw`Форма **первого** дифференциала инвариантна: запись $dy=f'(u)\,du$ верна независимо от того, свободная ли переменная $u$ или $u=\varphi(x)$. Доказательство — цепное правило плюс определение $du=\varphi'(x)dx$. Отсюда «безымянная» таблица $d(\sin u)=\cos u\,du$, применимая без оговорок.

Для **второго** дифференциала инвариантность теряется: дифференцируя произведение, получаем $d^2y=f''(u)du^2+f'(u)\,d^2u$, где $d^2u=\varphi''(x)dx^2$. Добавка исчезает при всех $f$ только при $\varphi''\equiv0$ — то есть лишь для аффинных замен $u=ax+b$.`,
		related: ['differencial', 'pervyy-differencial', 'vtoroy-differencial']
	},

	'differencialy-vysshih-poryadkov': {
		id: 'differencialy-vysshih-poryadkov',
		term: 'Дифференциалы высших порядков',
		short: String.raw`$d^kf$ — однородная форма степени $k$ от вектора $\vec{dx}$.`,
		formula: String.raw`d^{k}f=\sum_{i_1=1}^{n}\dots\sum_{i_k=1}^{n}\frac{\partial^{k}f}{\partial x_{i_1}\dots\partial x_{i_k}}\,dx_{i_1}\cdots dx_{i_k}`,
		body: String.raw`Дифференциал порядка $k$ определяется рекурсивно, $d^kf=d\bigl(d^{k-1}f\bigr)$ при замороженном [[vektor-differencialov|векторе дифференциалов]], и является [[odnorodnost|однородной формой степени $k$]]: при замене $\vec{dx}\mapsto t\,\vec{dx}$ умножается на $t^k$.

Для $k=1$ это [[pervyy-differencial|линейная форма]] с [[gradient|градиентом]], для $k=2$ — [[vtoroy-differencial|квадратичная]]. Начиная с $k=3$ таблицы коэффициентов уже не хватает — нужен объект с $k$ индексами, — и дальше работают мультииндексы (день 12): $d^kf$ и есть очередной член формулы Тейлора.`,
		related: ['vtoroy-differencial', 'differencial', 'odnorodnost', 'vektor-differencialov']
	},

	'logarifmicheskoe-differencirovanie': {
		id: 'logarifmicheskoe-differencirovanie',
		term: 'Логарифмическое дифференцирование',
		short: String.raw`Для $u(x)^{v(x)}$: логарифмируем и дифференцируем тождество.`,
		formula: String.raw`(\ln f)'=\frac{f'}{f}\ \Longrightarrow\ f'=f\cdot(\ln f)'`,
		body: String.raw`Приём для степенно-показательных выражений $u(x)^{v(x)}$, где ни формула для степени, ни формула для показательной по отдельности не работают. Берут $\ln f=v\ln u$, дифференцируют тождество и возвращаются: $f'=f\cdot A$, где $A=(\ln f)'$.

Для [[vtoroy-differencial|второго дифференциала]] удобна вытекающая отсюда формула $f''=f'A+fA'=f\bigl(A^2+A'\bigr)$, после чего $d^2f=f''\,dx^2$. Именно так берутся вторые дифференциалы выражений от $\sin(x)^{e^x}$ до $(\ln x)^{x^2}$.`,
		related: ['differencial', 'vtoroy-differencial']
	},

	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная по одной координате при остальных фиксированных.`,
		formula: String.raw`\frac{\partial f}{\partial x_i}=\lim_{\Delta x_i\to0}\frac{f(\dots,x_i+\Delta x_i,\dots)-f(\vec x)}{\Delta x_i}`,
		body: String.raw`**Частная производная** [[skalyarnoe-pole|скалярного поля]] по $x_i$ — обычная производная по этой переменной при остальных замороженных. Обозначение отделяет её от одномерного случая: $\frac{df}{dx}$ для функции одной переменной (ФОП) и $\frac{\partial f}{\partial x}$ для функции нескольких переменных (ФНП).

Частные производные — коэффициенты [[pervyy-differencial|первого дифференциала]] и компоненты [[gradient|градиента]]. Повторное дифференцирование даёт [[smeshannaya-proizvodnaya|смешанные производные]] и коэффициенты [[vtoroy-differencial|второго дифференциала]].`,
		related: ['gradient', 'pervyy-differencial', 'smeshannaya-proizvodnaya']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных; в скобке с $\vec{dx}$ даёт первый дифференциал.`,
		formula: String.raw`\nabla f=\Bigl(\frac{\partial f}{\partial x_1},\ \dots,\ \frac{\partial f}{\partial x_n}\Bigr)`,
		body: String.raw`**Градиент** — вектор, составленный из всех [[chastnaya-proizvodnaya|частных производных]] поля. Через него записываются и производная по направлению $f'_{\vec l}=\langle\nabla f\mid\vec l\rangle$, и [[pervyy-differencial|первый дифференциал]] $df=\langle\nabla f\mid\vec{dx}\rangle$ — это один и тот же объект при разном втором аргументе [[braket|скобки]].

В формуле Тейлора для поля градиент отвечает за линейный член, а вторые производные — за квадратичный (день 12).`,
		related: ['chastnaya-proizvodnaya', 'pervyy-differencial', 'braket']
	},

	'smeshannaya-proizvodnaya': {
		id: 'smeshannaya-proizvodnaya',
		term: 'Смешанная производная',
		short: String.raw`$f''_{xy}=(f'_x)'_y$ — дифференцирование по разным переменным подряд.`,
		formula: String.raw`f''_{xy}=(f'_x)'_y=\frac{\partial}{\partial y}\Bigl(\frac{\partial f}{\partial x}\Bigr)`,
		body: String.raw`**Смешанные производные** получаются дифференцированием по разным переменным. Индексы в записи $f''_{xy}$ читаются слева направо, в порядке дифференцирования, а в лейбницевой форме порядок операторов переворачивается — это первый источник ошибок в теме.

Равенство $f''_{xy}=f''_{yx}$ не даётся даром: это отдельная теорема со своими гипотезами, и доказывается она в дне 11 вместе с контрпримером, где равенство ломается. Пока оно не доказано, во [[vtoroy-differencial|втором дифференциале]] коэффициент при $dx\,dy$ приходится писать суммой $f''_{xy}+f''_{yx}$.`,
		related: ['chastnaya-proizvodnaya', 'smeshannyy-chlen', 'vtoroy-differencial']
	}
};
