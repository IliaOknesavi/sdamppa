import type { Glossary } from '$lib/types';

// Термины дня 7 (ch07): непрерывные случайные величины, плотность, основные
// непрерывные распределения и функции случайного аргумента. Расширяют общий
// glossary; ссылаются на базовые термины дня 1 (например, nevozmozhnoe).
export const day07Terms: Glossary = {
	'funkciya-raspredeleniya': {
		id: 'funkciya-raspredeleniya',
		term: 'Функция распределения',
		short: String.raw`$F(x)=P(X<x)$ — накопленная вероятность слева от $x$.`,
		formula: String.raw`F(x)=P(X<x)`,
		body: String.raw`**Функция распределения** $F(x)=P(X<x)$ задаёт вероятность того, что величина окажется левее точки $x$. Универсальна для дискретных и непрерывных величин. Свойства: $0\le F\le 1$, не убывает, $F(-\infty)=0$, $F(+\infty)=1$, и $$P(a\le X<b)=F(b)-F(a).$$ Для непрерывной $X$ её производная — [[plotnost|плотность]] $f(x)=F'(x)$.`,
		related: ['plotnost', 'kvantil', 'moda-mediana']
	},

	plotnost: {
		id: 'plotnost',
		term: 'Плотность распределения',
		short: String.raw`$f(x)=F'(x)$ — «вероятность на единицу длины».`,
		formula: String.raw`f(x)=F'(x),\quad \int_{-\infty}^{+\infty} f(x)\,dx=1`,
		body: String.raw`**Плотность** $f(x)=F'(x)$ описывает непрерывную случайную величину. Свойства: $f(x)\ge 0$, нормировка $\int_{-\infty}^{+\infty} f\,dx=1$, и вероятность как площадь $$P(\alpha\le X\le\beta)=\int_{\alpha}^{\beta} f(x)\,dx.$$ Это **не** вероятность точки ($P(X=x_0)=0$, см. [[nevozmozhnoe|невозможное событие]]), а плотность вероятности; $f$ может быть больше $1$, но площадь под ней всегда равна $1$.`,
		related: ['funkciya-raspredeleniya', 'matozhidanie', 'nevozmozhnoe']
	},

	matozhidanie: {
		id: 'matozhidanie',
		term: 'Мат. ожидание и дисперсия (непрерывный случай)',
		short: String.raw`$MX=\int x f\,dx$, $DX=M(X^2)-(MX)^2$.`,
		formula: String.raw`MX=\int_{-\infty}^{+\infty} x f(x)\,dx`,
		body: String.raw`Для непрерывной величины с [[plotnost|плотностью]] $f$: $$MX=\int_{-\infty}^{+\infty} x f(x)\,dx,\qquad DX=\int_{-\infty}^{+\infty}(x-MX)^2 f(x)\,dx.$$ Удобная форма дисперсии — через второй момент: $DX=M(X^2)-(MX)^2$, а $\sigma_X=\sqrt{DX}$. Сумма по значениям из дискретного случая заменена интегралом с весом $f(x)\,dx$.`,
		related: ['plotnost', 'moda-mediana', 'funkciya-sluchaynogo-argumenta']
	},

	'moda-mediana': {
		id: 'moda-mediana',
		term: 'Мода и медиана',
		short: String.raw`Мода — максимум плотности; медиана — решение $F(x)=\tfrac12$.`,
		body: String.raw`**Мода** $\mathrm{Mo}\,X$ — значение, в котором [[plotnost|плотность]] $f(x)$ достигает максимума. **Медиана** $\mathrm{Med}\,X$ — значение, делящее распределение пополам: $F(\mathrm{Med}\,X)=\tfrac12$, то есть частный случай [[kvantil|квантили]] $x_{0{,}5}$. При симметричной плотности относительно $x=c$ совпадают: $MX=\mathrm{Mo}\,X=\mathrm{Med}\,X=c$.`,
		related: ['kvantil', 'matozhidanie', 'funkciya-raspredeleniya']
	},

	kvantil: {
		id: 'kvantil',
		term: 'Квантиль',
		short: String.raw`$x_p$ такое, что $F(x_p)=p$; обратная функция $F^{-1}$.`,
		formula: String.raw`F(x_p)=p,\quad x_p=F^{-1}(p)`,
		body: String.raw`**Квантиль** уровня $p$ — число $x_p$, для которого [[funkciya-raspredeleniya|функция распределения]] равна $p$: $F(x_p)=p$, то есть $x_p=F^{-1}(p)$. [[moda-mediana|Медиана]] — это $x_{0{,}5}$. Квантили — основа критических значений и доверительных интервалов в части 2 курса; в библиотеках это функция **ppf**.`,
		related: ['funkciya-raspredeleniya', 'moda-mediana', 'normalnoe-raspredelenie']
	},

	'ravnomernoe-raspredelenie': {
		id: 'ravnomernoe-raspredelenie',
		term: 'Равномерное распределение R(a,b)',
		short: String.raw`Постоянная плотность на $[a,b]$; $MX=\tfrac{a+b}{2}$, $DX=\tfrac{(b-a)^2}{12}$.`,
		formula: String.raw`f(x)=\frac{1}{b-a},\ a\le x\le b`,
		body: String.raw`Величина $X\sim R(a,b)$ имеет постоянную [[plotnost|плотность]] на отрезке: из нормировки $c(b-a)=1$ получаем $f(x)=\dfrac{1}{b-a}$ на $[a,b]$ и $0$ вне. Тогда $$MX=\frac{a+b}{2},\qquad DX=\frac{(b-a)^2}{12}.$$ Непрерывный аналог схемы равновозможных исходов; модель «полного незнания» на отрезке.`,
		related: ['plotnost', 'pokazatelnoe-raspredelenie', 'normalnoe-raspredelenie']
	},

	'pokazatelnoe-raspredelenie': {
		id: 'pokazatelnoe-raspredelenie',
		term: 'Показательное распределение Exp(λ)',
		short: String.raw`$f(x)=\lambda e^{-\lambda x}$, $x\ge 0$; $MX=1/\lambda$, $DX=1/\lambda^2$.`,
		formula: String.raw`f(x)=\lambda e^{-\lambda x},\ x\ge 0`,
		body: String.raw`Величина $X\sim\mathrm{Exp}(\lambda)$ имеет [[plotnost|плотность]] $f(x)=\lambda e^{-\lambda x}$ при $x\ge 0$. Функция распределения $F(x)=1-e^{-\lambda x}$, а $$MX=\frac1\lambda,\qquad DX=\frac1{\lambda^2},\qquad \mathrm{Med}\,X=\frac{\ln 2}{\lambda}.$$ Модель времени до события (наработка на отказ, интервалы в очередях); обладает свойством отсутствия памяти.`,
		related: ['plotnost', 'ravnomernoe-raspredelenie', 'matozhidanie']
	},

	'normalnoe-raspredelenie': {
		id: 'normalnoe-raspredelenie',
		term: 'Нормальное распределение 𝒩(a,σ²)',
		short: String.raw`Кривая Гаусса; $MX=a$, $DX=\sigma^2$.`,
		formula: String.raw`f(x)=\frac{1}{\sigma\sqrt{2\pi}}\,e^{-(x-a)^2/(2\sigma^2)}`,
		body: String.raw`$X\sim\mathcal N(a,\sigma^2)$ имеет [[plotnost|плотность]] $$f(x)=\frac{1}{\sigma\sqrt{2\pi}}\exp\!\Big(-\frac{(x-a)^2}{2\sigma^2}\Big),$$ симметричную относительно $x=a$, с $MX=a$, $DX=\sigma^2$ и точками перегиба в $a\pm\sigma$. Вероятности считают через [[funkciya-laplasa|функцию Лапласа]]. **Главная роль** — предельная: суммы многих независимых слагаемых стремятся к нормальному закону (ЦПТ), отсюда правило трёх сигм $P(|X-a|\le 3\sigma)=0{,}9973$.`,
		related: ['funkciya-laplasa', 'kvantil', 'ravnomernoe-raspredelenie']
	},

	'funkciya-laplasa': {
		id: 'funkciya-laplasa',
		term: 'Функция Лапласа',
		short: String.raw`$\Phi(x)=\frac{1}{\sqrt{2\pi}}\int_0^x e^{-z^2/2}\,dz$, нечётна.`,
		formula: String.raw`\Phi(x)=\frac{1}{\sqrt{2\pi}}\int_0^x e^{-z^2/2}\,dz`,
		body: String.raw`**Функция Лапласа** $\Phi(x)=\frac{1}{\sqrt{2\pi}}\int_0^x e^{-z^2/2}\,dz$ — стандартный интеграл вероятностей. Нечётна ($\Phi(-x)=-\Phi(x)$), $\Phi(0)=0$, $\Phi(+\infty)=\tfrac12$. Через неё считают вероятности для [[normalnoe-raspredelenie|нормального закона]]: $$P(\alpha\le X\le\beta)=\Phi\!\Big(\frac{\beta-a}{\sigma}\Big)-\Phi\!\Big(\frac{\alpha-a}{\sigma}\Big).$$ Значения берут из таблиц; внимание к соглашению (бывает вариант с интегралом от $-\infty$).`,
		related: ['normalnoe-raspredelenie', 'kvantil']
	},

	'funkciya-sluchaynogo-argumenta': {
		id: 'funkciya-sluchaynogo-argumenta',
		term: 'Функция случайного аргумента',
		short: String.raw`$Y=g(X)$ — новая СВ; $M(g(X))=\int g(x) f(x)\,dx$ (LOTUS).`,
		formula: String.raw`M\big(g(X)\big)=\int_{-\infty}^{+\infty} g(x) f(x)\,dx`,
		body: String.raw`Если $Y=g(X)$, то $Y$ — снова случайная величина. В дискретном случае значениям $x_k$ отвечают $y_k=g(x_k)$, причём вероятности совпавших значений складываются. **Ожидание считают без поиска закона $Y$** (LOTUS): $$M\big(g(X)\big)=\sum_k g(x_k)p_k\ \ \text{или}\ \ \int_{-\infty}^{+\infty} g(x) f(x)\,dx.$$ Это основа замены переменных, стандартизации и генерации случайных чисел методом обратной функции.`,
		related: ['matozhidanie', 'plotnost']
	}
};
