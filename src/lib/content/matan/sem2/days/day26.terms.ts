import type { Glossary } from '$lib/types';

// Термины дня 26 (признаки сравнения; интегралы и ряды вместе).
export const day26Terms: Glossary = {
	'mazhoranta-i-minoranta': {
		id: 'mazhoranta-i-minoranta',
		term: 'Мажоранта и миноранта',
		short: String.raw`Оценка сверху и оценка снизу, с которыми сравнивают функцию.`,
		formula: String.raw`0\le f\le g:\ g\ \text{— мажоранта};\qquad 0\le h\le f:\ h\ \text{— миноранта}`,
		body: String.raw`**Мажоранта** — функция, накрывающая данную сверху, **миноранта** — подпирающая снизу. Постоянный множитель мажоранту не портит: если $g$ мажорирует $f$, то и $Cg$ при $C\ge1$.`,
		related: ['priznak-sravneniya-integralov', 'etalonnyy-integral']
	},

	'svoystva-integrala': {
		id: 'svoystva-integrala',
		term: 'Аддитивность и монотонность интеграла',
		short: String.raw`Склейка по отрезку и сохранение неравенства между функциями.`,
		formula: String.raw`\int_a^c=\int_a^b+\int_b^c;\qquad f\le g\ \Rightarrow\ \int_a^b f\le\int_a^b g`,
		body: String.raw`Пара свойств интеграла Римана: [[additivnost-integrala|аддитивность]] по промежутку и [[monotonnost-integrala|монотонность]] по подынтегральной функции. Из первой следует, что конечный кусок на сходимость несобственного интеграла не влияет.`,
		related: ['additivnost-integrala', 'monotonnost-integrala', 'shodimost-integrala']
	},

	'priznak-sravneniya-integralov': {
		id: 'priznak-sravneniya-integralov',
		term: 'Признак сравнения',
		short: String.raw`Сходится мажоранта — сходится и меньшее; расходится миноранта — и большее.`,
		formula: String.raw`0\le f\le g:\quad \int g\ \text{сх.}\Rightarrow\int f\ \text{сх.};\quad \int f\ \text{расх.}\Rightarrow\int g\ \text{расх.}`,
		body: String.raw`Если $0\le f\le g$, то из [[shodimost-integrala|сходимости]] интеграла от [[mazhoranta-i-minoranta|мажоранты]] следует сходимость интеграла от $f$, а из расходимости интеграла от $f$ — расходимость от $g$. Неотрицательность существенна.`,
		related: ['mazhoranta-i-minoranta', 'shodimost-integrala', 'etalonnyy-integral']
	},

	'kriteriy-koshi-dlya-integrala': {
		id: 'kriteriy-koshi-dlya-integrala',
		term: 'Критерий Коши для интеграла',
		short: String.raw`Хвостовые куски малы: $\bigl|\int_{A_1}^{A_2}f\bigr|<\varepsilon$.`,
		formula: String.raw`\int_a^{\infty}f\ \text{сх.}\iff\forall\varepsilon>0\ \exists M\ \forall A_2>A_1>M:\ \Bigl|\int_{A_1}^{A_2}f\Bigr|<\varepsilon`,
		body: String.raw`Несобственный интеграл [[shodimost-integrala|сходится]] тогда и только тогда, когда интегралы по достаточно далёким кускам сколь угодно малы. В отличие от [[priznak-sravneniya-integralov|сравнения]], знак функции здесь не важен.`,
		related: ['shodimost-integrala', 'skhodyashchayasya-v-sebe', 'polnota-r']
	},

	'teorema-rimana-o-perestanovke': {
		id: 'teorema-rimana-o-perestanovke',
		term: 'Теорема Римана о перестановке',
		short: String.raw`Перестановкой членов условно сходящегося ряда получают любую сумму.`,
		formula: String.raw`\sum a_n\ \text{сх. условно}\ \Rightarrow\ \forall S\ \exists\sigma:\ \sum a_{\sigma(n)}=S`,
		body: String.raw`У [[uslovnaya-shodimost|условно сходящегося]] ряда перестановкой членов можно получить любую наперёд заданную сумму, а также расходимость. У [[absolyutnaya-shodimost|абсолютно сходящегося]] сумма от порядка не зависит.`,
		related: ['uslovnaya-shodimost', 'absolyutnaya-shodimost']
	},

	'integralnyy-kriteriy-koshi': {
		id: 'integralnyy-kriteriy-koshi',
		term: 'Интегральный критерий Коши',
		short: String.raw`Для убывающей $f\ge0$ ряд $\sum f(n)$ и $\int_1^\infty f$ сходятся вместе.`,
		formula: String.raw`f\ge0\ \text{не возрастает}:\quad \int_1^{\infty}f(x)\,dx\ \text{сх.}\iff\sum_{n=1}^{\infty}f(n)\ \text{сх.}`,
		body: String.raw`Если функция неотрицательна и не возрастает на $[1;+\infty)$, то [[shodimost-integrala|сходимость]] несобственного интеграла от неё равносильна сходимости ряда из её значений в целых точках. Оба условия на $f$ существенны.`,
		related: ['shodimost-integrala', 'monotonnost-i-proizvodnaya', 'chastichnaya-summa']
	},

	'integral-dirihle': {
		id: 'integral-dirihle',
		term: 'Интеграл Дирихле',
		short: String.raw`$\int_1^\infty \frac{\sin x}{x}\,dx$ — образец условной сходимости.`,
		formula: String.raw`\int_1^{\infty}\frac{\sin x}{x}\,dx\ \text{— сх.},\qquad \int_1^{\infty}\frac{|\sin x|}{x}\,dx\ \text{— расх.}`,
		body: String.raw`Интеграл, который [[shodimost-integrala|сходится]], тогда как интеграл от модуля подынтегральной функции расходится. Показывает, что [[uslovnaya-shodimost|условная сходимость]] действительно бывает.`,
		related: ['uslovnaya-shodimost', 'absolyutnaya-shodimost']
	},

	'neobhodimoe-uslovie-shodimosti': {
		id: 'neobhodimoe-uslovie-shodimosti',
		term: 'Необходимое условие сходимости ряда',
		short: String.raw`У сходящегося ряда члены стремятся к нулю.`,
		formula: String.raw`\sum_{n=1}^{\infty}f_n\ \text{сх.}\ \Rightarrow\ \lim_{n\to\infty}f_n=0`,
		body: String.raw`Если ряд сходится, его члены стремятся к нулю. Это [[priznak-i-svoystvo|свойство]], а не признак: обратное неверно, и работает условие только на расходимость.`,
		related: ['priznak-i-svoystvo', 'chastichnaya-summa', 'predel-posledovatelnosti']
	}
};
