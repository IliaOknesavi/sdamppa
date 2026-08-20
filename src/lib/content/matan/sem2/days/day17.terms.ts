import type { Glossary } from '$lib/types';

// Термины дня 17 (разбиение, интегральные суммы, суммы Дарбу).
export const day17Terms: Glossary = {
	funkcional: {
		id: 'funkcional',
		term: 'Функционал',
		short: String.raw`Отображение, у которого аргумент — функция, а значение — число.`,
		formula: String.raw`I:\ f\ \mapsto\ I(f)\in\mathbb R`,
		body: String.raw`[[otobrazhenie|Отображение]], аргументом которого служит функция (или набор, содержащий функцию), а значением — число. Определённый интеграл и [[integralnaya-summa|интегральная сумма]] — примеры функционалов.`,
		related: ['otobrazhenie', 'funkciya', 'integralnaya-summa']
	},

	'plotnoe-mnozhestvo': {
		id: 'plotnoe-mnozhestvo',
		term: 'Плотное множество',
		short: String.raw`Его точки есть в любом интервале: $\operatorname{cl}A=\mathbb R$.`,
		formula: String.raw`\operatorname{cl}\mathbb Q=\mathbb R,\qquad \operatorname{cl}(\mathbb R\setminus\mathbb Q)=\mathbb R`,
		body: String.raw`Множество плотно в $\mathbb R$, если его [[zamykanie|замыкание]] — вся прямая, то есть в любом невырожденном интервале найдётся его точка. Плотны и рациональные числа, и иррациональные.`,
		related: ['zamykanie', 'veshchestvennye-chisla', 'promezhutok']
	},

	razbienie: {
		id: 'razbienie',
		term: 'Разбиение отрезка',
		short: String.raw`Конечный набор точек от $a$ до $b$; отрезков на один меньше, чем точек.`,
		formula: String.raw`a=x_1\le\ldots\le x_n=b,\qquad \lambda_i=x_{i+1}-x_i`,
		body: String.raw`Конечный упорядоченный набор точек отрезка с закреплёнными концами. Длины получившихся кусков обозначают $\lambda_i$; в сумме они дают $b-a$, а самая большая из них называется [[rang-razbieniya|рангом]].`,
		related: ['rang-razbieniya', 'promezhutok', 'izmelchenie-razbieniya']
	},

	'integralnaya-summa': {
		id: 'integralnaya-summa',
		term: 'Интегральная сумма',
		short: String.raw`$\sum f(\xi_i)\lambda_i$ — сумма по кускам разбиения.`,
		formula: String.raw`I(f,\lambda,\vec\xi)=\sum_{i=1}^{n-1}f(\xi_i)\,\lambda_i`,
		body: String.raw`Сумма произведений значения функции в [[otmechennaya-tochka|отмеченной точке]] куска на длину этого куска. Зависит сразу от трёх аргументов: функции, [[razbienie|разбиения]] и набора отмеченных точек.`,
		related: ['razbienie', 'otmechennaya-tochka', 'summy-darbu']
	},

	'summy-darbu': {
		id: 'summy-darbu',
		term: 'Суммы Дарбу',
		short: String.raw`Интегральные суммы с крайним выбором точек: по $\sup$ и по $\inf$.`,
		formula: String.raw`L(f,\lambda)\ \le\ I(f,\lambda,\vec\xi)\ \le\ U(f,\lambda)`,
		body: String.raw`Пара [[verhnyaya-summa-darbu|верхней]] и [[nizhnyaya-summa-darbu|нижней]] сумм, где вместо значения в [[otmechennaya-tochka|отмеченной точке]] берётся [[supremum|супремум]] или инфимум функции на куске. Они ограничивают все [[integralnaya-summa|интегральные суммы]] данного разбиения и являются точными границами.`,
		related: ['verhnyaya-summa-darbu', 'nizhnyaya-summa-darbu', 'integralnaya-summa', 'supremum']
	},

	'verhnyaya-summa-darbu': {
		id: 'verhnyaya-summa-darbu',
		term: 'Верхняя сумма Дарбу',
		short: String.raw`Площадь описанной лестницы: высота ступеньки равна $\sup f$.`,
		formula: String.raw`U(f,\lambda)=\sum_{i=1}^{n-1}\lambda_i\sup_{\xi\in[x_i;x_{i+1}]}f(\xi)`,
		body: String.raw`Сумма, в которой на каждом куске [[razbienie|разбиения]] берётся [[supremum|супремум]] функции. Требует ограниченности $f$, иначе супремум бесконечен.`,
		related: ['nizhnyaya-summa-darbu', 'supremum', 'razbienie']
	},

	'nizhnyaya-summa-darbu': {
		id: 'nizhnyaya-summa-darbu',
		term: 'Нижняя сумма Дарбу',
		short: String.raw`Площадь вписанной лестницы: высота ступеньки равна $\inf f$.`,
		formula: String.raw`L(f,\lambda)=\sum_{i=1}^{n-1}\lambda_i\inf_{\xi\in[x_i;x_{i+1}]}f(\xi)`,
		body: String.raw`Сумма, в которой на каждом куске [[razbienie|разбиения]] берётся инфимум функции — точная нижняя грань её значений на этом куске.`,
		related: ['verhnyaya-summa-darbu', 'supremum', 'razbienie']
	},

	'izmelchenie-razbieniya': {
		id: 'izmelchenie-razbieniya',
		term: 'Измельчение разбиения',
		short: String.raw`Разбиение, полученное добавлением точек: $\lambda\subset\lambda'$.`,
		formula: String.raw`\lambda\subset\lambda'\ \Longrightarrow\ \lambda_R'\le\lambda_R`,
		body: String.raw`Разбиение измельчает данное, если содержит все его точки и, возможно, новые. Это отношение частичного порядка: два [[razbienie|разбиения]] одного [[rang-razbieniya|ранга]] могут быть несравнимы.`,
		related: ['razbienie', 'rang-razbieniya', 'podmnozhestvo']
	},

	'lemma-darbu': {
		id: 'lemma-darbu',
		term: 'Лемма Дарбу',
		short: String.raw`При измельчении $U$ не растёт, $L$ не убывает.`,
		formula: String.raw`\lambda\subset\lambda'\ \Rightarrow\ L(f,\lambda)\le L(f,\lambda')\le U(f,\lambda')\le U(f,\lambda)`,
		body: String.raw`При [[izmelchenie-razbieniya|измельчении]] [[razbienie|разбиения]] верхняя [[summy-darbu|сумма Дарбу]] не увеличивается, а нижняя не уменьшается. Требуется ограниченность функции.`,
		related: ['summy-darbu', 'izmelchenie-razbieniya']
	},

	'verhniy-integral': {
		id: 'verhniy-integral',
		term: 'Верхний интеграл',
		short: String.raw`Точная нижняя грань верхних сумм по всем разбиениям.`,
		formula: String.raw`\overline{\int_a^b} f\,dx=\inf_{\lambda}U(f,\lambda)=\lim_{\lambda_R\to0}U(f,\lambda)`,
		body: String.raw`Инфимум [[verhnyaya-summa-darbu|верхних сумм Дарбу]] по всем [[razbienie|разбиениям]]; он же их предел при стремлении [[rang-razbieniya|ранга]] к нулю. Существует у любой ограниченной функции. Черта в обозначении — часть символа, а не дополнение множества.`,
		related: ['verhnyaya-summa-darbu', 'nizhniy-integral', 'supremum']
	},

	'nizhniy-integral': {
		id: 'nizhniy-integral',
		term: 'Нижний интеграл',
		short: String.raw`Точная верхняя грань нижних сумм по всем разбиениям.`,
		formula: String.raw`\underline{\int_a^b} f\,dx=\sup_{\lambda}L(f,\lambda)=\lim_{\lambda_R\to0}L(f,\lambda)`,
		body: String.raw`[[supremum|Супремум]] [[nizhnyaya-summa-darbu|нижних сумм Дарбу]] по всем [[razbienie|разбиениям]]. Для любой ограниченной функции он существует и не превосходит [[verhniy-integral|верхнего интеграла]].`,
		related: ['nizhnyaya-summa-darbu', 'verhniy-integral', 'supremum']
	},

};
