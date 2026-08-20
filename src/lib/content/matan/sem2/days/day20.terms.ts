import type { Glossary } from '$lib/types';

// Термины дня 20 (теорема Барроу и формула Ньютона–Лейбница).
export const day20Terms: Glossary = {
	'formula-stoksa': {
		id: 'formula-stoksa',
		term: 'Формула Стокса',
		short: String.raw`Интеграл от $d\omega$ по области равен интегралу от $\omega$ по её границе.`,
		formula: String.raw`\int_D d\omega=\int_{\partial D}\omega`,
		body: String.raw`Общая форма связи «интеграл по области — интеграл по границе»: слева стоит производный объект, справа сам объект на краю. [[teorema-nyutona-leybnica|Формула Ньютона–Лейбница]] — её одномерный случай.`,
		related: ['teorema-nyutona-leybnica', 'opredelennyy-integral']
	},

	'integral-s-peremennym-verhnim-predelom': {
		id: 'integral-s-peremennym-verhnim-predelom',
		term: 'Интеграл с переменным верхним пределом',
		short: String.raw`$\Phi(x)=\int_a^x f(t)\,dt$ — накопленный интеграл до точки $x$.`,
		formula: String.raw`\Phi(x)=\int_a^x f(t)\,dt,\qquad \Phi(a)=0`,
		body: String.raw`Функция, получающаяся из [[opredelennyy-integral|определённого интеграла]], если отпустить верхний предел. Переменная интегрирования при этом немая: записывать её той же буквой, что и предел, нельзя.`,
		related: ['opredelennyy-integral', 'teorema-barrou', 'funkciya']
	},

	'teorema-barrou': {
		id: 'teorema-barrou',
		term: 'Теорема Барроу',
		short: String.raw`Для непрерывной $f$ производная накопленного интеграла равна $f$.`,
		formula: String.raw`\Bigl(\int_a^x f(t)\,dt\Bigr)'_x=f(x)`,
		body: String.raw`Если $f$ непрерывна на отрезке, то [[integral-s-peremennym-verhnim-predelom|интеграл с переменным верхним пределом]] дифференцируем и его производная равна $f$. Отсюда следует, что у всякой непрерывной функции [[pervoobraznaya|первообразная]] существует.`,
		related: ['integral-s-peremennym-verhnim-predelom', 'pervoobraznaya', 'nepreryvnost']
	},

	'teorema-nyutona-leybnica': {
		id: 'teorema-nyutona-leybnica',
		term: 'Формула Ньютона–Лейбница',
		short: String.raw`$\int_a^b f=F(b)-F(a)$ для любой первообразной $F$.`,
		formula: String.raw`\int_a^b f(x)\,dx=F(b)-F(a)=F\Big|_a^b`,
		body: String.raw`Для непрерывной на отрезке функции [[opredelennyy-integral|определённый интеграл]] равен разности значений **любой** её [[pervoobraznaya|первообразной]] на концах. Произвольность $F$ существенна: при вычитании [[proizvolnaya-postoyannaya|постоянная]] сокращается.`,
		related: ['pervoobraznaya', 'opredelennyy-integral', 'teorema-barrou']
	},

	'additivnost-integrala': {
		id: 'additivnost-integrala',
		term: 'Аддитивность интеграла по отрезку',
		short: String.raw`$\int_a^b+\int_b^c=\int_a^c$.`,
		formula: String.raw`\int_a^b f+\int_b^c f=\int_a^c f`,
		body: String.raw`Интеграл по объединению смежных отрезков равен сумме интегралов. Вместе с соглашениями $\int_a^a=0$ и $\int_a^b=-\int_b^a$ равенство верно при любом взаимном расположении трёх точек.`,
		related: ['opredelennyy-integral', 'lineynost-integrala']
	},

	'lineynost-integrala': {
		id: 'lineynost-integrala',
		term: 'Линейность интеграла',
		short: String.raw`$\int(\alpha f+\beta g)=\alpha\int f+\beta\int g$.`,
		formula: String.raw`\int_a^b(\alpha f+\beta g)\,dx=\alpha\int_a^b f\,dx+\beta\int_a^b g\,dx`,
		body: String.raw`[[opredelennyy-integral|Определённый интеграл]] — [[lineynost|линейный]] [[funkcional|функционал]] на интегрируемых функциях: выносит числовые множители и распадается на сумму. Требует интегрируемости обеих функций.`,
		related: ['lineynost', 'funkcional', 'opredelennyy-integral']
	},

	'monotonnost-integrala': {
		id: 'monotonnost-integrala',
		term: 'Монотонность интеграла',
		short: String.raw`Неравенство между функциями сохраняется после интегрирования.`,
		formula: String.raw`f\le g\ \Rightarrow\ \int_a^b f\,dx\le\int_a^b g\,dx`,
		body: String.raw`Если на отрезке $f\le g$ и обе функции интегрируемы, то и их интегралы связаны тем же неравенством. Требуется $a<b$: при перевёрнутых пределах знак меняется.`,
		related: ['opredelennyy-integral', 'ocenka-modulya-integrala']
	},

	'ocenka-modulya-integrala': {
		id: 'ocenka-modulya-integrala',
		term: 'Оценка модуля интеграла',
		short: String.raw`Модуль интеграла не больше интеграла модуля.`,
		formula: String.raw`\left|\int_a^b f\,dx\right|\le\int_a^b|f|\,dx\le\sup|f|\cdot(b-a)`,
		body: String.raw`Следствие [[monotonnost-integrala|монотонности]], применённой к неравенству $-|f|\le f\le|f|$. Непрерывный аналог неравенства треугольника для конечных сумм.`,
		related: ['monotonnost-integrala', 'modul-chisla']
	},

	'teorema-o-srednem-integral': {
		id: 'teorema-o-srednem-integral',
		term: 'Теорема о среднем для интеграла',
		short: String.raw`Непрерывная $f$ принимает своё среднее по отрезку в некоторой точке.`,
		formula: String.raw`\int_a^b f(t)\,dt=f(\xi)\,(b-a),\qquad \xi\in[a,b]`,
		body: String.raw`Для непрерывной на отрезке функции найдётся точка $\xi$, в которой $\int_a^b f=f(\xi)(b-a)$. Непрерывность существенна: у $\operatorname{sign}$ на $[-1;1]$ среднее равно нулю, а значения нуль не принимают.`,
		related: ['nepreryvnost', 'teorema-o-promezhutochnom-znachenii', 'monotonnost-integrala']
	},

	'lemma-o-nulevoy-proizvodnoy': {
		id: 'lemma-o-nulevoy-proizvodnoy',
		term: 'Лемма о нулевой производной',
		short: String.raw`$D'\equiv0$ на промежутке влечёт $D\equiv\mathrm{const}$.`,
		formula: String.raw`D'(x)=0\ \text{на}\ [a,b]\ \Rightarrow\ D(x)=D(a)\ \ \forall x`,
		body: String.raw`Функция с тождественно нулевой [[proizvodnaya|производной]] на [[promezhutok|промежутке]] постоянна. Связность существенна: на объединении двух отрезков постоянные могут различаться — тогда это лишь [[lokalno-postoyannaya-funkciya|локально постоянная]] функция.`,
		related: ['teorema-lagranzha', 'promezhutok', 'lokalno-postoyannaya-funkciya']
	}
};
