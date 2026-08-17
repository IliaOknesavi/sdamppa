import type { Glossary } from '$lib/types';

// Термины дня 17 (разбиение, интегральные суммы, суммы Дарбу). Понятия сквозной
// нотации курса живут в каноническом глоссарии (sem2/glossary.ts) и здесь НЕ
// дублируются — они подключаются перекрёстными ссылками [[...]]:
//   lsk, rang-razbieniya, nepravilnaya-mera-nol, priznak-i-svoystvo,
//   blacksquare. Канонический глоссарий склеивается последним и перекрывает
//   совпадения, поэтому одноимённые карточки заводить нельзя.
// Карточка kriteriy-integriruemosti намеренно продублирована из дня 18, чтобы
// день резолвился независимо.
export const day17Terms: Glossary = {
	razbienie: {
		id: 'razbienie',
		term: 'Разбиение отрезка',
		short: String.raw`Конечный набор точек от $a$ до $b$; отрезков на один меньше, чем точек.`,
		formula: String.raw`a\le x_1\le\ldots\le x_n\le b,\quad x_1=a,\ x_n=b,\quad \lambda_i=x_{i+1}-x_i`,
		body: String.raw`**Разбиение** — конечный упорядоченный набор точек $x_1\ldots x_n$ отрезка-[[lsk|ЛСК]] $[a,b]$ с закреплёнными концами $x_1=a$, $x_n=b$. Длины кусков обозначаются $\lambda_i=x_{i+1}-x_i$ и в сумме дают $b-a$.

⚠️ Индекс бежит до $n-1$: точек $n$, а отрезков между ними $n-1$ — в конспекте это не описка, а сознательная запись, проникающая во все интегральные суммы. Мера мелкости разбиения — [[rang-razbieniya|ранг $\lambda_R$]]; вложение наборов точек даёт [[izmelchenie-razbieniya|измельчение]].`,
		related: ['rang-razbieniya', 'lsk', 'integralnaya-summa', 'izmelchenie-razbieniya']
	},

	'otmechennaya-tochka': {
		id: 'otmechennaya-tochka',
		term: 'Отмеченная точка ξᵢ',
		short: String.raw`Произвольная точка внутри куска разбиения; их набор обозначается $\vec\xi$.`,
		formula: String.raw`\xi_i\in[x_i;\,x_{i+1}],\qquad \vec\xi=(\xi_1,\ldots,\xi_{n-1})`,
		body: String.raw`Точка $\xi_i$, выбранная в $i$-м куске [[razbienie|разбиения]]; в значении $f(\xi_i)$ и берётся высота прямоугольника. Набор всех выбранных точек обозначается вектором $\vec\xi$ и входит третьим аргументом в [[integralnaya-summa|интегральную сумму]].

Частные выборы: левые концы $\xi_i=x_i$ (с них конспект и начинает), правые $\xi_i=x_{i+1}$, средние. Предельные значения по $\xi$ дают [[summy-darbu|суммы Дарбу]]: $\sup_{\vec\xi}I=U$, $\inf_{\vec\xi}I=L$. Определение интеграла требует независимости предела от $\vec\xi$ — отсюда квантор $\forall\vec\xi$ в формулировке.`,
		related: ['integralnaya-summa', 'razbienie', 'summy-darbu', 'opredelennyy-integral']
	},

	'integralnaya-summa': {
		id: 'integralnaya-summa',
		term: 'Интегральная сумма I(f, λ, ξ⃗)',
		short: String.raw`Функционал от тройки «функция, разбиение, набор отмеченных точек».`,
		formula: String.raw`I(f,\lambda,\vec\xi)=\sum_{i=1}^{n-1}f(\xi_i)\,\lambda_i`,
		body: String.raw`Курс подаёт интегральную сумму не как «сумму Римана», а как объект с явной сигнатурой $I(f,\lambda,\vec\xi)$: её значение зависит от функции, от [[razbienie|разбиения]] и от набора [[otmechennaya-tochka|отмеченных точек]] одновременно. В конспекте она сначала записана по левым концам как «$n$-е приближение интеграла» $\left(\int_a^b f\,dx\right)_n$.

При любом $\vec\xi$ сумма зажата вилкой $L\le I\le U$. [[opredelennyy-integral|Определённый интеграл]] — это её предел при $\lambda_R\to0$, одинаковый для всех $\lambda$ и всех $\vec\xi$; в $\mathbb R^2$ (день 23) та же тройка работает дословно.`,
		related: ['otmechennaya-tochka', 'razbienie', 'summy-darbu', 'opredelennyy-integral']
	},

	'summy-darbu': {
		id: 'summy-darbu',
		term: 'Суммы Дарбу',
		short: String.raw`Интегральные суммы с крайним выбором точек: по $\sup$ и по $\inf$.`,
		formula: String.raw`L(f,\lambda)\ \le\ I(f,\lambda,\vec\xi)\ \le\ U(f,\lambda)`,
		body: String.raw`Семантическая единица 20 курса: пара [[verhnyaya-summa-darbu|$U(f,\lambda)$]] и [[nizhnyaya-summa-darbu|$L(f,\lambda)$]], в которых вместо произвольной [[otmechennaya-tochka|отмеченной точки]] берётся супремум и инфимум $f$ на куске. Они ограничивают все [[integralnaya-summa|интегральные суммы]] сразу и являются точными границами.

⚠️ У преподавателя обе определены как пределы при $\lambda_R\to0$, а в учебниках — как суммы при фиксированном $\lambda$, из которых потом берут $\inf_\lambda U$ и $\sup_\lambda L$. Разность $U-L=\sum h_i\lambda_i$ собирается из [[kolebanie-funkcii|колебаний]] и служит мерой недоопределённости интеграла.`,
		related: ['verhnyaya-summa-darbu', 'nizhnyaya-summa-darbu', 'lemma-darbu', 'kolebanie-funkcii']
	},

	'verhnyaya-summa-darbu': {
		id: 'verhnyaya-summa-darbu',
		term: 'Верхняя сумма Дарбу U(f, λ)',
		short: String.raw`Площадь описанной лестницы: на каждом куске высота равна $\sup f$.`,
		formula: String.raw`U(f,\lambda)=\sum_{i=1}^{n-1}\lambda_i\sup_{\xi\in[x_i;x_{i+1}]}f(\xi)`,
		body: String.raw`Наибольшее из значений, которые может принять [[integralnaya-summa|интегральная сумма]] при данном [[razbienie|разбиении]]: на каждом куске берётся супремум $f$. Геометрически — площадь ступенчатой фигуры, описанной вокруг графика.

Требуется ограниченность $f$, иначе супремум бесконечен; в курсе это обеспечено работой с $f\in C^0$ на компакте. По [[lemma-darbu|лемме Дарбу]] $U$ не растёт при измельчении, поэтому её предел при $\lambda_R\to0$ совпадает с [[verhniy-integral|верхним интегралом]] $\inf_\lambda U$.`,
		related: ['nizhnyaya-summa-darbu', 'verhniy-integral', 'lemma-darbu', 'summy-darbu']
	},

	'nizhnyaya-summa-darbu': {
		id: 'nizhnyaya-summa-darbu',
		term: 'Нижняя сумма Дарбу L(f, λ)',
		short: String.raw`Площадь вписанной лестницы: на каждом куске высота равна $\inf f$.`,
		formula: String.raw`L(f,\lambda)=\sum_{i=1}^{n-1}\lambda_i\inf_{\xi\in[x_i;x_{i+1}]}f(\xi)`,
		body: String.raw`Наименьшее из возможных значений [[integralnaya-summa|интегральной суммы]] при данном [[razbienie|разбиении]]: высота ступеньки равна инфимуму $f$ на куске. Геометрически — площадь фигуры, вписанной под график.

По [[lemma-darbu|лемме Дарбу]] $L$ не убывает при [[izmelchenie-razbieniya|измельчении]] и снизу подпирает любую [[verhnyaya-summa-darbu|верхнюю сумму]] — даже построенную по совершенно другому разбиению. Её предел при $\lambda_R\to0$ есть [[nizhniy-integral|нижний интеграл]] $\sup_\lambda L$.`,
		related: ['verhnyaya-summa-darbu', 'nizhniy-integral', 'lemma-darbu', 'summy-darbu']
	},

	'izmelchenie-razbieniya': {
		id: 'izmelchenie-razbieniya',
		term: 'Измельчение разбиения',
		short: String.raw`Разбиение, полученное добавлением точек: $\lambda\subset\lambda'$.`,
		formula: String.raw`\lambda\subset\lambda'\ \Longrightarrow\ \lambda_R'\le\lambda_R`,
		body: String.raw`Разбиение $\lambda'$ **измельчает** $\lambda$, если содержит все его точки и, возможно, новые. Отношение частичного порядка: два [[razbienie|разбиения]] одного [[rang-razbieniya|ранга]] могут быть несравнимы.

Именно по этому отношению монотонны [[summy-darbu|суммы Дарбу]] ([[lemma-darbu|лемма Дарбу]]), а не по величине ранга: у $\{0;\tfrac12;1\}$ и $\{0;\tfrac14;\tfrac34;1\}$ ранг одинаков, а верхние суммы для $f=x$ разные ($0{,}75$ и $0{,}6875$). Общее измельчение $\lambda_1\cup\lambda_2$ — стандартный приём сравнения двух произвольных разбиений.`,
		related: ['lemma-darbu', 'razbienie', 'rang-razbieniya', 'summy-darbu']
	},

	'lemma-darbu': {
		id: 'lemma-darbu',
		term: 'Лемма Дарбу',
		short: String.raw`При измельчении $U$ не растёт, $L$ не убывает; вилка только сжимается.`,
		formula: String.raw`\lambda\subset\lambda'\ \Rightarrow\ L(f,\lambda)\le L(f,\lambda')\le U(f,\lambda')\le U(f,\lambda)`,
		body: String.raw`Утверждение о монотонности [[summy-darbu|сумм Дарбу]] при [[izmelchenie-razbieniya|измельчении]]. Доказательство сводится к добавлению одной точки: супремум по части отрезка не больше супремума по всему отрезку, инфимум — не меньше; дальше индукция по числу добавленных точек. Нужна ограниченность $f$ — иначе грани бесконечны.

⚠️ Курс лемму **обходит**, определяя $U$ и $L$ сразу пределами при $\lambda_R\to0$. Без неё не обоснованы ни существование этих пределов, ни неравенство $\sup_\lambda L\le\inf_\lambda U$, из которого растут [[verhniy-integral|верхний]] и нижний интегралы.`,
		related: ['izmelchenie-razbieniya', 'summy-darbu', 'verhniy-integral', 'kolebanie-funkcii']
	},

	'kolebanie-funkcii': {
		id: 'kolebanie-funkcii',
		term: 'Колебание функции на отрезке hᵢ',
		short: String.raw`Разность граней на куске разбиения; из них складывается зазор $U-L$.`,
		formula: String.raw`h_i=\sup_{[x_i;x_{i+1}]}f-\inf_{[x_i;x_{i+1}]}f,\qquad U-L=\sum_{i=1}^{n-1}h_i\lambda_i`,
		body: String.raw`Величина $h_i\ge0$ измеряет, насколько $f$ «скачет» на $i$-м куске [[razbienie|разбиения]]. В конспекте она появляется в доказательстве критерия: разность [[summy-darbu|сумм Дарбу]] равна $\sum h_i\lambda_i$ — сумме площадей полосок неопределённости.

Для липшицевой $f$ с константой $M$ верно $h_i\le M\lambda_i$, откуда $U-L\le M(b-a)\lambda_R\to0$. Для функции Дирихле $h_i=1$ при любом [[rang-razbieniya|ранге]], и зазор не сжимается — интеграла нет. Одноимённая величина в точке ($\eta$) вводилась в первом семестре вместе с верхним и нижним пределом.`,
		related: ['summy-darbu', 'kriteriy-integriruemosti', 'lemma-darbu', 'rang-razbieniya']
	},

	'verhniy-integral': {
		id: 'verhniy-integral',
		term: 'Верхний интеграл',
		short: String.raw`Предел верхних сумм; в учебниках — их точная нижняя грань по разбиениям.`,
		formula: String.raw`\overline{\int_a^b} f\,dx=\lim_{\lambda_R\to0}U(f,\lambda)=\inf_{\lambda}U(f,\lambda)`,
		body: String.raw`Обозначается чертой **над** знаком интеграла. ⚠️ Черта здесь — часть символа, а не дополнение множества (в остальном курсе $\overline X$ значит дополнение, замыкание пишется $\mathrm{cl}\,X$).

У преподавателя определён как предел [[verhnyaya-summa-darbu|верхних сумм]] при $\lambda_R\to0$, в литературе — как $\inf_\lambda U$; совпадение этих величин и есть теорема Дарбу, опирающаяся на [[lemma-darbu|лемму]]. Существует для любой ограниченной $f$ и всегда не меньше [[nizhniy-integral|нижнего интеграла]].`,
		related: ['nizhniy-integral', 'verhnyaya-summa-darbu', 'opredelennyy-integral', 'lemma-darbu']
	},

	'nizhniy-integral': {
		id: 'nizhniy-integral',
		term: 'Нижний интеграл',
		short: String.raw`Предел нижних сумм; в учебниках — их точная верхняя грань по разбиениям.`,
		formula: String.raw`\underline{\int_a^b} f\,dx=\lim_{\lambda_R\to0}L(f,\lambda)=\sup_{\lambda}L(f,\lambda)`,
		body: String.raw`Обозначается чертой **под** знаком интеграла и строится по [[nizhnyaya-summa-darbu|нижним суммам]] так же, как [[verhniy-integral|верхний]] — по верхним. Существует для любой ограниченной $f$: множество нижних сумм ограничено сверху любой верхней суммой.

Неравенство $\underline I\le\overline I$ выполнено всегда; строгое $\underline I<\overline I$ означает неинтегрируемость (функция Дирихле: $0<1$). Равенство даёт [[opredelennyy-integral|определённый интеграл]] и составляет [[kriteriy-integriruemosti|критерий интегрируемости]].`,
		related: ['verhniy-integral', 'nizhnyaya-summa-darbu', 'opredelennyy-integral', 'kriteriy-integriruemosti']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Общее значение верхнего и нижнего интегралов; оно же предел сумм.`,
		formula: String.raw`\int_a^b f(x)\,dx=\overline{\int_a^b} f\,dx=\underline{\int_a^b} f\,dx=\lim_{\lambda_R\to0}I(f,\lambda,\vec\xi)`,
		body: String.raw`Семантическая единица 17. Определяется как общее значение [[verhniy-integral|верхнего]] и [[nizhniy-integral|нижнего]] интегралов; тогда же оно оказывается пределом [[integralnaya-summa|интегральных сумм]] при $\lambda_R\to0$ независимо от выбора [[otmechennaya-tochka|отмеченных точек]] — каждая сумма зажата между $L$ и $U$.

Термин «определённый» появляется в конспекте поздно (стр. 8–9), уже после первообразной: сначала строится интеграл Римана, и только потом — техника его вычисления через $F(b)-F(a)$.`,
		related: ['verhniy-integral', 'nizhniy-integral', 'integralnaya-summa', 'kriteriy-integriruemosti']
	},

	'kriteriy-integriruemosti': {
		id: 'kriteriy-integriruemosti',
		term: 'Критерий интегрируемости',
		short: String.raw`Совпадение сумм Дарбу равносильно существованию предела при любом $\vec\xi$.`,
		formula: String.raw`\forall\lambda:\ U(f,\lambda)=L(f,\lambda)\iff\forall\lambda,\ \forall\vec\xi\ \ \exists\,I(f,\lambda,\vec\xi)`,
		body: String.raw`Теорема со стр. 4 конспекта (подробно — день 18). Прямая импликация разворачивается через $\lim\sum h_i\lambda_i=0$ и зажатие $L\le I\le U$; обратная — выбором [[otmechennaya-tochka|отмеченных точек]], реализующих $\sup$ и $\inf$.

⚠️ Формулировка курса нестандартна: классический критерий Дарбу звучит как «$\forall\varepsilon>0$ существует разбиение с $U-L<\varepsilon$». Ответ на вопрос, насколько разрывной может быть интегрируемая функция, даёт [[nepravilnaya-mera-nol|множество меры нуль]]: разрывы допустимы, если их мера равна нулю.`,
		related: ['summy-darbu', 'kolebanie-funkcii', 'opredelennyy-integral', 'nepravilnaya-mera-nol']
	}
};
