import type { Glossary } from '$lib/types';

// Термины дня 12 (формула Тейлора: одномерная и через мультииндекс).
// Термины предыдущих дней фазы, на которые день опирается, сознательно
// продублированы здесь (gradient, matrica-gesse, teorema-rollya) —
// день должен резолвиться независимо.
// НЕ дублируются термины канонического глоссария курса, на них только ссылки:
// braket, klassy-differenciruemosti, end-r, skalyarnoe-pole, n-nol-n-odin,
// asimptoticheskie-klassy, blacksquare и остальные из sem1/glossary.ts
// и sem2/glossary.ts.
export const day12Terms: Glossary = {
	'formula-teylora': {
		id: 'formula-teylora',
		term: 'Формула Тейлора',
		short: String.raw`Функция = частичная сумма по производным в точке + остаток.`,
		formula: String.raw`f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n(x)`,
		body: String.raw`**Формула Тейлора** в [[end-r|$\operatorname{End}(\mathbb R)$]] представляет функцию суммой многочлена и [[ostatochnyy-chlen|остатка]]. Частичная сумма $T_n(x;a)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k$ — единственный многочлен степени $\le n$, у которого в точке $a$ совпадают с $f$ все производные до $n$-й включительно.

Сама по себе формула тавтологична: $R_n$ определён как разность. Содержание появляется, когда для $R_n$ выписана явная формула — в курсе это [[forma-lagranzha|форма Лагранжа]], получаемая $\varphi$-трюком через [[teorema-rollya|теорему Ролля]]. Случай $a=0$ — [[ryad-maklorena|формула Маклорена]].`,
		related: ['ostatochnyy-chlen', 'forma-lagranzha', 'ryad-maklorena', 'formula-teylora-pole']
	},

	'ostatochnyy-chlen': {
		id: 'ostatochnyy-chlen',
		term: 'Остаточный член',
		short: String.raw`Разность между функцией и её частичной суммой Тейлора.`,
		formula: String.raw`R_n(x)=f(x)-\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k`,
		body: String.raw`**Остаточный член** $R_n(x)$ — то, что многочлен Тейлора не поймал. Записывают его двумя основными способами: [[forma-peano|форма Пеано]] $R_n\in\bar o((x-a)^n)$ говорит лишь о скорости убывания при $x\to a$, а [[forma-lagranzha|форма Лагранжа]] даёт явное выражение через производную порядка $n+1$ в промежуточной точке — и потому позволяет численно оценить ошибку.

Есть и промежуточные варианты (форма Коши, общая форма Шлёмильха–Роша); все они получаются одним и тем же $\varphi$-трюком с разным выбором множителя $(x-t)^p$. Промежуточная точка $\xi$ в разных формах разная.`,
		related: ['formula-teylora', 'forma-lagranzha', 'forma-peano']
	},

	'forma-lagranzha': {
		id: 'forma-lagranzha',
		term: 'Остаток в форме Лагранжа',
		short: String.raw`$R_n=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}$ с промежуточной точкой $\xi$.`,
		formula: String.raw`R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1},\qquad \xi\in(a;x)`,
		body: String.raw`**Форма Лагранжа** — количественная запись [[ostatochnyy-chlen|остатка]]: существует точка $\xi$ строго между $a$ и $x$, для которой остаток равен $\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}$. Требует $f\in C^{n+1}$ на всём отрезке, зато заменой $f^{(n+1)}(\xi)$ на максимум $M$ даёт рабочую оценку $|R_n|\le M\frac{|x-a|^{n+1}}{(n+1)!}$.

Курс использует только эту форму: в конспекте выводится ровно $Q=\frac{f^{(n+1)}(\xi)}{(n+1)!}$ через [[teorema-rollya|теорему Ролля]]. В многомерном случае ([[formula-teylora-pole|Тейлор в полях]]) роль $\xi$ играет параметр $\theta\in[0,1]$.`,
		related: ['ostatochnyy-chlen', 'forma-peano', 'teorema-rollya', 'formula-teylora']
	},

	'forma-peano': {
		id: 'forma-peano',
		term: 'Остаток в форме Пеано',
		short: String.raw`$R_n\in\bar o((x-a)^n)$ при $x\to a$ — локальное утверждение.`,
		formula: String.raw`R_n(x)\in\bar o\bigl((x-a)^n\bigr)\big|_{x\to a}`,
		body: String.raw`**Форма Пеано** утверждает только асимптотику: остаток лежит в классе $\bar o((x-a)^n)$ при $x\to a$ (см. [[asimptoticheskie-klassy|асимптотические классы]]). Запись самая слабая по требованиям — достаточно существования $f^{(n)}$ в одной точке $a$ — и самая бедная: о величине ошибки она не говорит ничего.

⚠️ В конспекте курса форма Пеано не выписана: преподаватель сразу ведёт к [[forma-lagranzha|лагранжевой]]. В учебниках (Зорич, Фихтенгольц) обе формы даются наравне, и «формула Тейлора» без уточнения там чаще означает именно пеановскую — при вычислении пределов работают только с ней.`,
		related: ['ostatochnyy-chlen', 'forma-lagranzha', 'asimptoticheskie-klassy']
	},

	'ryad-maklorena': {
		id: 'ryad-maklorena',
		term: 'Формула (ряд) Маклорена',
		short: String.raw`Формула Тейлора в частном случае $a=0$.`,
		formula: String.raw`f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(0)}{k!}x^k+R_n(x)`,
		body: String.raw`**Формула Маклорена** — это [[formula-teylora|формула Тейлора]] с центром $a=0$. Отдельное имя она получила потому, что все табличные разложения ($e^x$, $\sin x$, $\cos x$, $\ln(1+x)$, $(1+x)^{\mu}$) выписывают именно в нуле, а произвольную точку получают сдвигом.

Если остаток стремится к нулю при $n\to\infty$, конечная сумма превращается в ряд Маклорена. Именно так библиотеки численной математики вычисляют элементарные функции: берут столько членов, чтобы оценка [[forma-lagranzha|лагранжева остатка]] не превысила машинной точности.`,
		related: ['formula-teylora', 'forma-lagranzha', 'ostatochnyy-chlen']
	},

	'teorema-rollya': {
		id: 'teorema-rollya',
		term: 'Теорема Ролля',
		short: String.raw`Равные значения на концах ⟹ где-то внутри производная нулевая.`,
		formula: String.raw`f\in C^1([a,b]),\ f(a)=f(b)\ \Rightarrow\ \exists c\in(a;b):\ f'(c)=0`,
		body: String.raw`**Теорема Ролля.** Если $f(a)=f(b)$, то найдётся внутренняя точка $c$ с $f'(c)=0$. В курсе теорема формулируется для класса $C^1([a,b])$ (см. [[klassy-differenciruemosti|классы гладкости]]) и даётся без доказательства, рисунком; в учебниках достаточно непрерывности на $[a,b]$ и дифференцируемости на $(a;b)$ — требование курса заметно сильнее.

Для [[formula-teylora|формулы Тейлора]] это рабочий инструмент: вспомогательная функция $\varphi$ строится так, чтобы обнулиться на обоих концах, и Ролль выдаёт промежуточную точку $\xi$ из [[forma-lagranzha|формы Лагранжа]].`,
		related: ['formula-teylora', 'forma-lagranzha', 'klassy-differenciruemosti']
	},

	simpleks: {
		id: 'simpleks',
		term: 'Симплекс',
		short: String.raw`Точка, отрезок, треугольник, тетраэдр — по одному на размерность.`,
		formula: String.raw`S(t)=\vec x+t(\vec y-\vec x),\quad t\in[0,1]\ \ (\text{1-симплекс})`,
		body: String.raw`**Симплекс** — минимальный выпуклый объект своей размерности: выпуклая оболочка $k+1$ точки в общем положении. Цепочка из конспекта: точка, отрезок, треугольник, тетраэдр.

В курсе симплексы — не отступление, а мост к многомерному Тейлору. Промежуточная точка $\vec a+\theta\vec h$ при $\theta\in[0,1]$ — точка 1-симплекса (отрезка) в [[baricentricheskie-koordinaty|барицентрических координатах]]; а число слагаемых суммы $\sum_{|\alpha|\le k}$ равно числу целых узлов $k$-симплекса — $\binom{n+k}{k}$. Живут симплексы в [[affinnoe-prostranstvo|аффинном пространстве]].`,
		related: ['baricentricheskie-koordinaty', 'affinnoe-prostranstvo', 'multiindeks']
	},

	'affinnoe-prostranstvo': {
		id: 'affinnoe-prostranstvo',
		term: 'Аффинное пространство',
		short: String.raw`Линейное многообразие: точки без выделенного нуля.`,
		formula: String.raw`\Pi=\vec x_0+L,\qquad L\ \text{— линейное подпространство}`,
		body: String.raw`**Аффинное пространство** преподаватель определяет одной фразой: линейное многообразие, то есть сдвиг линейного подпространства $\Pi=\vec x_0+L$. Содержательно: нуль не выделен, складывать две точки нельзя, а вычитать — можно, и разность точек уже вектор.

Это естественная среда для [[simpleks|симплексов]] и [[baricentricheskie-koordinaty|барицентрических координат]]: выпуклая комбинация с суммой весов $1$ — единственная линейная операция над точками, не зависящая от выбора начала отсчёта.`,
		related: ['simpleks', 'baricentricheskie-koordinaty']
	},

	'baricentricheskie-koordinaty': {
		id: 'baricentricheskie-koordinaty',
		term: 'Барицентрические координаты',
		short: String.raw`Веса вершин симплекса: неотрицательные, в сумме единица.`,
		formula: String.raw`\alpha\vec x+\beta\vec y+\gamma\vec z,\qquad \alpha,\beta,\gamma\ge0,\ \ \alpha+\beta+\gamma=1`,
		body: String.raw`**Барицентрические координаты** задают точку [[simpleks|симплекса]] не координатами в базисе, а весами вершин — как положение центра тяжести. Условия $\alpha_i\ge0$ и $\sum\alpha_i=1$ выделяют ровно выпуклую оболочку вершин; в конспекте такая комбинация названа выпуклой.

В формуле Тейлора для полей это язык, на котором записана промежуточная точка: $\vec a+\theta\vec h$ имеет координаты $(1-\theta,\ \theta)$ на отрезке $[\vec a,\ \vec a+\vec h]$. Отсюда и условие $\theta\in[0,1]$ в [[formula-teylora-pole|многомерном остатке]].`,
		related: ['simpleks', 'affinnoe-prostranstvo', 'formula-teylora-pole']
	},

	multiindeks: {
		id: 'multiindeks',
		term: 'Мультииндекс',
		short: String.raw`Вектор показателей $\alpha$; задаёт $D^\alpha f$ и $\vec h^{\,\alpha}$ разом.`,
		formula: String.raw`|\alpha|=\sum_i\alpha^i,\quad \alpha!=\alpha^1!\ldots\alpha^n!,\quad \vec h^{\,\alpha}=h_1^{\alpha^1}\ldots h_n^{\alpha^n}`,
		body: String.raw`**Мультииндекс** $\alpha=(\alpha^1,\dots,\alpha^n)$ с $\alpha^i\in$ [[n-nol-n-odin|$\mathbb N_0$]] — запись «сколько раз дифференцировать по каждой переменной». Оператор $D^\alpha f=\frac{\partial^{|\alpha|}f}{(\partial x_1)^{\alpha^1}\ldots(\partial x_n)^{\alpha^n}}$ корректен по теореме Клеро–Шварца: порядок дифференцирований не важен. Запись $\sum_{|\alpha|\le k}$ сворачивает вложенные суммы в одну; слагаемых $\binom{n+k}{k}$ — столько же целых узлов у $k$-[[simpleks|симплекса]].

⚠️ В конспекте $D^\alpha f$ и $\vec h^{\,\alpha}$ записаны списками компонент, будто векторы, а в $\vec h^{\,\alpha}$ последняя компонента напечатана как $\alpha_n^{\alpha^n}$ вместо $h_n^{\alpha^n}$.`,
		related: ['simpleks', 'formula-teylora-pole', 'n-nol-n-odin']
	},

	'formula-teylora-pole': {
		id: 'formula-teylora-pole',
		term: 'Формула Тейлора в скалярных полях',
		short: String.raw`Сумма по мультииндексам; остаток с параметром $\theta\in[0,1]$.`,
		formula: String.raw`f(\vec a+\vec h)=\sum_{|\alpha|\le k}\frac{D^\alpha f(\vec a)}{\alpha!}\vec h^{\,\alpha}+\sum_{|\beta|=k+1}\frac{D^\beta f(\vec a+\theta\vec h)}{\beta!}\vec h^{\,\beta}`,
		body: String.raw`Разложение [[skalyarnoe-pole|скалярного поля]] в точке $\vec a$ по [[multiindeks|мультииндексам]]; остаток берётся в промежуточной точке $\vec a+\theta\vec h$, $\theta\in[0,1]$ — аналог $\xi$ из [[forma-lagranzha|формы Лагранжа]]. Доказывается сведением к одномерному случаю: $g(t)=f(\vec a+t\vec h)$ на отрезке $[0,1]$.

Курс выписывает первые члены в [[braket|bra-ket]]-форме $f(\vec a)+\langle\nabla f\mid\vec x-\vec a\rangle+\frac{1}{2!}(\vec x-\vec a)^T H(\vec x-\vec a)$, где $H$ — [[matrica-gesse|матрица Гессе]]. ⚠️ В конспекте в знаменателях стоит $|\alpha|!$; правильный множитель — $\alpha!$, иначе теряется удвоение смешанных членов.`,
		related: ['multiindeks', 'forma-lagranzha', 'matrica-gesse', 'gradient']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных скалярного поля.`,
		formula: String.raw`\nabla f=\Bigl(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\Bigr)`,
		body: String.raw`**Градиент** [[skalyarnoe-pole|скалярного поля]] — вектор его частных производных. Через него записывается производная по направлению: $f'_{\vec l}=\langle\nabla f\mid\vec l\rangle$ в [[braket|bra-ket]]-нотации курса.

В [[formula-teylora-pole|формуле Тейлора]] градиент — линейный член разложения: $\langle\nabla f(\vec a)\mid\vec x-\vec a\rangle$ задаёт касательную плоскость. Необходимое условие экстремума звучит как $\nabla f(\vec x)=\bar 0$ — именно оно обнуляет линейный член и передаёт слово [[matrica-gesse|гессиану]].`,
		related: ['skalyarnoe-pole', 'braket', 'matrica-gesse', 'formula-teylora-pole']
	},

	'matrica-gesse': {
		id: 'matrica-gesse',
		term: 'Матрица Гессе',
		short: String.raw`Матрица вторых частных производных; её определитель — гессиан.`,
		formula: String.raw`H_{ij}=\frac{\partial^2 f}{\partial x_i\,\partial x_j}`,
		body: String.raw`**Матрица Гессе** составлена из вторых частных производных поля; её определитель называют гессианом. По теореме Клеро–Шварца она симметрична, поэтому задаёт квадратичную форму.

В [[formula-teylora-pole|формуле Тейлора]] гессиан — второй член: $\frac{1}{2!}\langle\vec h\mid H\vec h\rangle$. В критической точке ($\nabla f=\bar 0$) он становится главным, и знак приращения решает знакоопределённость формы — её читает критерий Сильвестра по угловым минорам. ⚠️ В конспекте первый диагональный элемент записан как $f''_{x_1x_2}$ вместо $f''_{x_1x_1}$ — описка.`,
		related: ['gradient', 'formula-teylora-pole', 'braket']
	}
};
