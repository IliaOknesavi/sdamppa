import type { Day } from '$lib/types';

export const day07: Day = {
	n: 7,
	phaseId: 'tv',
	title: 'Непрерывные СВ и распределения. Функции случайного аргумента',
	chapterRef: 'ch07',
	est: String.raw`1–2 ч`,
	goal: String.raw`Перейти от рядов распределения к [[plotnost|плотности]] $f(x)$: научиться по ней находить [[funkciya-raspredeleniya|функцию распределения]] $F(x)$, вероятности и числовые характеристики, освоить три ключевых закона ([[ravnomernoe-raspredelenie|равномерный]], [[pokazatelnoe-raspredelenie|показательный]], [[normalnoe-raspredelenie|нормальный]]) и понять, как преобразуется случайная величина под действием функции $Y=g(X)$.`,
	sections: [
		{
			kind: 'definition',
			heading: 'Функция распределения и плотность',
			body: String.raw`Универсальная характеристика любой случайной величины — [[funkciya-raspredeleniya|функция распределения]] $$F(x)=P(X<x),\qquad x\in\mathbb R.$$ Она не убывает, $F(-\infty)=0$, $F(+\infty)=1$, и $P(a\le X<b)=F(b)-F(a)$.

Величина $X$ называется **(абсолютно) непрерывной**, если её $F(x)$ непрерывна и почти всюду дифференцируема. Производная $$f(x)=F'(x)$$ — это [[plotnost|плотность распределения]]. Эквивалентно $$F(x)=\int_{-\infty}^{x} f(t)\,dt.$$

Ключевые свойства плотности: $f(x)\ge 0$; условие нормировки $\int_{-\infty}^{+\infty} f(x)\,dx=1$; вероятность как площадь $$P(\alpha\le X\le\beta)=\int_{\alpha}^{\beta} f(x)\,dx.$$

Для непрерывной величины $P(X=x_0)=0$, поэтому строгие и нестрогие неравенства под знаком вероятности равноправны. Это, кстати, тот самый случай, когда [[nevozmozhnoe|вероятность нуль]] не означает невозможности (любое конкретное $x_0$ имеет $P=0$, но какое-то значение всё же выпадает).`
		},
		{
			kind: 'intuition',
			heading: 'Почему плотность — это «вероятность на единицу длины»',
			body: String.raw`Плотность часто путают с вероятностью, но $f(x_0)$ — **не** вероятность значения $x_0$ (она равна нулю). Смысл $f$ виден из определения производной. Так как $F(x+\Delta x)-F(x)=P(x<X\le x+\Delta x)$, то $$f(x)=\lim_{\Delta x\to 0}\frac{P(x<X\le x+\Delta x)}{\Delta x}.$$ То есть $f(x)$ — это *плотность* вероятности: сколько вероятностной «массы» приходится на единицу длины около точки $x$. Поэтому $f$ может быть больше единицы (например, у узкого распределения), а вот площадь под ней всегда ровно $1$.

Аналогия из физики: $f(x)$ — это линейная плотность массы стержня, а $F(x)$ — масса, накопленная слева от точки $x$. Вероятность попасть в отрезок — это масса куска стержня, то есть интеграл плотности.`
		},
		{
			kind: 'definition',
			heading: 'Числовые характеристики непрерывной величины',
			body: String.raw`Все характеристики переносятся с дискретного случая заменой суммы по значениям на интеграл с весом $f(x)\,dx$:
$$MX=\int_{-\infty}^{+\infty} x\,f(x)\,dx,\qquad DX=\int_{-\infty}^{+\infty}(x-MX)^2 f(x)\,dx.$$
Удобная для счёта форма дисперсии — через [[matozhidanie|момент второго порядка]]: $$DX=M(X^2)-(MX)^2=\int_{-\infty}^{+\infty} x^2 f(x)\,dx-(MX)^2.$$
Среднеквадратическое отклонение $\sigma_X=\sqrt{DX}$.

[[moda-mediana|Мода]] $\mathrm{Mo}\,X$ — точка максимума плотности; [[moda-mediana|медиана]] $\mathrm{Med}\,X$ — решение $F(x)=\tfrac12$. Если плотность симметрична относительно $x=c$, то $MX=\mathrm{Mo}\,X=\mathrm{Med}\,X=c$.

[[kvantil|Квантиль]] уровня $p$ — это $x_p$ такое, что $F(x_p)=p$; медиана — частный случай $x_{0{,}5}$. Квантили понадобятся в части 2 курса для доверительных интервалов.`
		},
		{
			kind: 'derivation',
			heading: 'Вывод характеристик показательного распределения',
			body: String.raw`Покажем, откуда берутся формулы $MX=1/\lambda$ и $DX=1/\lambda^2$ для [[pokazatelnoe-raspredelenie|показательного закона]] $f(x)=\lambda e^{-\lambda x}$, $x\ge 0$.

**Нормировка.** $$\int_0^{+\infty}\lambda e^{-\lambda x}\,dx=-e^{-\lambda x}\Big|_0^{+\infty}=-(0-1)=1.\;\checkmark$$

**Математическое ожидание** интегрируем по частям ($u=x$, $dv=\lambda e^{-\lambda x}dx$, $v=-e^{-\lambda x}$): $$MX=\int_0^{+\infty}x\,\lambda e^{-\lambda x}\,dx=\underbrace{-x e^{-\lambda x}\Big|_0^{+\infty}}_{=\,0}+\int_0^{+\infty} e^{-\lambda x}\,dx=\frac1\lambda.$$

**Второй момент** аналогично ($u=x^2$): $$M(X^2)=\int_0^{+\infty}x^2\lambda e^{-\lambda x}\,dx=\underbrace{-x^2 e^{-\lambda x}\Big|_0^{+\infty}}_{=\,0}+\int_0^{+\infty}2x\,e^{-\lambda x}\,dx=\frac{2}{\lambda}\cdot\frac1\lambda=\frac{2}{\lambda^2},$$ где последний интеграл — это $\tfrac{2}{\lambda}\,MX$. Отсюда $$DX=M(X^2)-(MX)^2=\frac{2}{\lambda^2}-\frac{1}{\lambda^2}=\frac{1}{\lambda^2}.\qquad\blacksquare$$

Заодно из $F(x)=1-e^{-\lambda x}$ медиана решается мгновенно: $1-e^{-\lambda x}=\tfrac12\Rightarrow\mathrm{Med}\,X=\dfrac{\ln 2}{\lambda}<MX$ — распределение скошено вправо.`
		},
		{
			kind: 'theorem',
			heading: 'Три закона: равномерный, показательный, нормальный',
			body: String.raw`**Равномерный** [[ravnomernoe-raspredelenie|$R(a,b)$]]: плотность постоянна на $[a,b]$. Из нормировки $c\,(b-a)=1$ сразу $f(x)=\dfrac{1}{b-a}$, и $$MX=\frac{a+b}{2},\qquad DX=\frac{(b-a)^2}{12}.$$ Это непрерывный аналог схемы равновозможных исходов.

**Показательный** [[pokazatelnoe-raspredelenie|$\mathrm{Exp}(\lambda)$]]: $f(x)=\lambda e^{-\lambda x}$, $x\ge 0$; $MX=1/\lambda$, $DX=1/\lambda^2$ (вывод выше). Модель времени ожидания/наработки на отказ.

**Нормальный** [[normalnoe-raspredelenie|$\mathcal N(a,\sigma^2)$]]: $$f(x)=\frac{1}{\sigma\sqrt{2\pi}}\exp\!\Big(-\frac{(x-a)^2}{2\sigma^2}\Big),\qquad MX=a,\;DX=\sigma^2.$$ Кривая Гаусса симметрична относительно $x=a$, имеет максимум в $a$ и точки перегиба в $a\pm\sigma$. Вероятности считают через [[funkciya-laplasa|функцию Лапласа]]: $P(\alpha\le X\le\beta)=\Phi\!\big(\tfrac{\beta-a}{\sigma}\big)-\Phi\!\big(\tfrac{\alpha-a}{\sigma}\big)$.

**Правило трёх сигм:** $P(|X-a|\le 3\sigma)=2\Phi(3)=0{,}9973$ — почти достоверно. Реже формулируют как $2\sigma\approx 0{,}9545$ и $1\sigma\approx 0{,}6827$.`
		},
		{
			kind: 'derivation',
			heading: 'Функция случайного аргумента Y = g(X)',
			body: String.raw`Пусть $Y=g(X)$. Тогда $Y$ — снова случайная величина, и нужно найти её закон.

**Дискретный случай.** Значениям $x_k$ с вероятностями $p_k$ отвечают $y_k=g(x_k)$. Если разным $x_k$ соответствует одно и то же $y$, их вероятности **складываются**.

**Главный приём — ожидание без поиска закона $Y$** (закон неосознанного статистика, LOTUS): $$M\big(g(X)\big)=\sum_k g(x_k)\,p_k\quad(\text{дискретно}),\qquad M\big(g(X)\big)=\int_{-\infty}^{+\infty} g(x)\,f(x)\,dx\quad(\text{непрерывно}).$$ Не нужно строить ряд $Y$ — достаточно усреднить $g(x)$ по распределению $X$.

**Пример.** $X\sim\mathrm{Bin}(3,\tfrac12)$, $Y=4X-X^2$. Ряд $X$: $P(0,1,2,3)=\tfrac18,\tfrac38,\tfrac38,\tfrac18$. Значения $g$: $g(0)=0$, $g(1)=3$, $g(2)=4$, $g(3)=3$. Так как $g(1)=g(3)=3$, $$P(Y=3)=P(X=1)+P(X=3)=\tfrac38+\tfrac18=\tfrac12.$$ Через LOTUS: $MY=4\,MX-M(X^2)$, где $MX=np=\tfrac32$, $M(X^2)=DX+(MX)^2=\tfrac34+\tfrac94=3$, значит $MY=4\cdot\tfrac32-3=3$. Прямой подсчёт по ряду $Y$ даёт то же: $0\cdot\tfrac18+3\cdot\tfrac12+4\cdot\tfrac38=3$.`
		},
		{
			kind: 'connection',
			heading: 'Зачем это в анализе данных',
			body: String.raw`Непрерывные распределения — рабочий язык всей второй части курса и ML. [[normalnoe-raspredelenie|Нормальный закон]] возникает как предел сумм (ЦПТ, день 10) и лежит в основе доверительных интервалов и проверки гипотез. [[kvantil|Квантили]] $x_p$ — это то, что считает любая функция типа **ppf** в библиотеках: критические значения $t$-, $\chi^2$-, $F$-распределений берутся именно как квантили.

[[pokazatelnoe-raspredelenie|Показательный закон]] моделирует время между событиями (надёжность, очереди, время отклика сервиса). А **функция случайного аргумента** $Y=g(X)$ — это любое преобразование признака: логарифмирование тяжёлых хвостов, стандартизация $Z=(X-a)/\sigma$, замена переменных при сэмплировании. Метод обратной функции (см. код) — стандартный способ генерировать случайные числа из нужного распределения, на нём держатся симуляции и аугментация данных.`
		},
		{
			kind: 'note',
			heading: 'Частые ошибки',
			body: String.raw`- **Плотность ≠ вероятность.** $f(x_0)$ может быть больше $1$; вероятность даёт только интеграл.
- **Забыть нормировку.** Любая плотность обязана давать $\int f=1$ — это первая проверка в задаче.
- **Путать $a$ и $\sigma^2$.** В $\mathcal N(a,\sigma^2)$ второй параметр — *дисперсия*, а не СКО; в формулу плотности и стандартизацию идёт $\sigma$.
- **Терять складывание вероятностей** в $Y=g(X)$, когда $g$ не инъективна (как $g(1)=g(3)$ в примере выше).`
		}
	],
	code: {
		title: 'Метод обратной функции и проверка LOTUS',
		language: 'python',
		code: `import random, math, statistics

random.seed(7)
N = 200_000

# --- Показательное распределение методом обратной функции ---
# Если U ~ R(0,1), то X = -ln(U)/lam имеет распределение Exp(lam).
# Проверяем теорию: MX = 1/lam, DX = 1/lam^2.
lam = 0.4
sample = [-math.log(random.random()) / lam for _ in range(N)]
print(round(statistics.mean(sample), 2))       # 2.5  (= 1/lam)
print(round(statistics.pvariance(sample), 2))  # 6.28 (~ 1/lam^2 = 6.25)

# P(2 < X < 5) = e^{-0.8} - e^{-2}
emp = sum(1 for x in sample if 2 < x < 5) / N
print(round(emp, 3), round(math.exp(-0.8) - math.exp(-2), 3))  # 0.315 0.314

# --- Функция случайного аргумента: Y = 4X - X^2, X ~ Bin(3, 1/2) ---
bin3 = lambda: sum(random.random() < 0.5 for _ in range(3))
ys = [4 * x - x * x for x in (bin3() for _ in range(N))]
print(round(statistics.mean(ys), 2))           # 3.0  (= MY)`,
		explanation: String.raw`Первый блок — это **метод обратной функции** для [[pokazatelnoe-raspredelenie|показательного закона]]: если $U\sim R(0,1)$, то $X=-\tfrac{1}{\lambda}\ln U\sim\mathrm{Exp}(\lambda)$ (потому что $F^{-1}(u)=-\tfrac{1}{\lambda}\ln(1-u)$, а $1-U$ тоже равномерно). Эмпирические $MX$ и $DX$ совпали с теоретическими $1/\lambda=2{,}5$ и $1/\lambda^2=6{,}25$, а доля попаданий в $(2,5)$ — с $e^{-0{,}8}-e^{-2}\approx 0{,}314$. Второй блок численно подтверждает [[funkciya-sluchaynogo-argumenta|LOTUS]]: среднее от $g(X)=4X-X^2$ дало $\approx 3$ без построения закона $Y$.

**В проде** ровно так устроены генераторы случайных чисел: **np.random** / **scipy.stats** для многих распределений применяют inverse-CDF sampling, а квантильную функцию $F^{-1}$ вызывают как **ppf**. Преобразование $Y=g(X)$ — это feature engineering (лог-трансформ, стандартизация) и change-of-variables в вероятностных моделях и нормализующих потоках.`
	},
	tasks: [
		{
			id: 's-d7-t1',
			difficulty: 'base',
			prompt: String.raw`Плотность задана как $f(x)=-\dfrac{x}{2}$ при $x\in[-2,0]$ и $f(x)=0$ иначе. Найдите [[funkciya-raspredeleniya|функцию распределения]] $F(x)$ и проверьте нормировку.`,
			hint: String.raw`$F(x)=\int_{-2}^{x} f(t)\,dt$ на участке $[-2,0]$; нормировка — это $F(0)=1$.`,
			solution: String.raw`При $-2\le x\le 0$ $$F(x)=\int_{-2}^{x}\Big(-\frac t2\Big)\,dt=-\frac{t^2}{4}\Big|_{-2}^{x}=-\frac{x^2}{4}+1=1-\frac{x^2}{4}.$$ Значит $$F(x)=\begin{cases}0,&x<-2,\\[2pt]1-\dfrac{x^2}{4},&-2\le x\le 0,\\[4pt]1,&x>0.\end{cases}$$ Нормировка: $F(0)=1-0=1$. $\checkmark$`,
			answer: String.raw`$F(x)=1-\dfrac{x^2}{4}$ на $[-2,0]$; $F(0)=1$.`,
			xp: 12
		},
		{
			id: 's-d7-t2',
			difficulty: 'base',
			prompt: String.raw`Для плотности из задачи 1 найдите $MX$, $DX$, [[moda-mediana|моду и медиану]].`,
			hint: String.raw`$MX=\int_{-2}^0 x f(x)\,dx$, $M(X^2)=\int_{-2}^0 x^2 f(x)\,dx$, $DX=M(X^2)-(MX)^2$. Мода — точка максимума $f$, медиана — из $F=\tfrac12$.`,
			solution: String.raw`$$MX=\int_{-2}^{0}x\Big(-\frac x2\Big)dx=-\frac{x^3}{6}\Big|_{-2}^{0}=-\frac{8}{6}=-\frac43.$$ $$M(X^2)=\int_{-2}^{0}x^2\Big(-\frac x2\Big)dx=-\frac{x^4}{8}\Big|_{-2}^{0}=2,\quad DX=2-\frac{16}{9}=\frac29,\quad\sigma_X=\frac{\sqrt2}{3}.$$ Плотность $-x/2$ максимальна на левом конце, $\mathrm{Mo}\,X=-2$. Медиана: $1-\dfrac{x^2}{4}=\dfrac12\Rightarrow x^2=2\Rightarrow\mathrm{Med}\,X=-\sqrt2$.`,
			answer: String.raw`$MX=-\tfrac43$, $DX=\tfrac29$, $\mathrm{Mo}\,X=-2$, $\mathrm{Med}\,X=-\sqrt2$.`,
			xp: 12
		},
		{
			id: 's-d7-t3',
			difficulty: 'base',
			prompt: String.raw`$X\sim\mathcal N(a,\sigma^2)$ с $a=10$, $\sigma=2$. Найдите $P(8\le X\le 14)$. Дано: $\Phi(1)=0{,}3413$, $\Phi(2)=0{,}4772$ ([[funkciya-laplasa|функция Лапласа]]).`,
			hint: String.raw`$P(\alpha\le X\le\beta)=\Phi\!\big(\tfrac{\beta-a}{\sigma}\big)-\Phi\!\big(\tfrac{\alpha-a}{\sigma}\big)$, и $\Phi$ нечётна.`,
			solution: String.raw`$$P(8\le X\le 14)=\Phi\!\Big(\frac{14-10}{2}\Big)-\Phi\!\Big(\frac{8-10}{2}\Big)=\Phi(2)-\Phi(-1)=\Phi(2)+\Phi(1).$$ Подставляя, $$P=0{,}4772+0{,}3413=0{,}8185.$$`,
			answer: String.raw`$P(8\le X\le 14)\approx 0{,}8185$.`,
			xp: 12
		},
		{
			id: 's-d7-t4',
			difficulty: 'base',
			prompt: String.raw`Длительность разговора $X\sim\mathrm{Exp}(\lambda)$ c $f(x)=0{,}4\,e^{-0{,}4x}$. Найдите $MX$, $\mathrm{Med}\,X$ и $P(2<X<5)$.`,
			hint: String.raw`$MX=1/\lambda$; медиана из $1-e^{-\lambda x}=\tfrac12$; вероятность — через $F(x)=1-e^{-\lambda x}$.`,
			solution: String.raw`Здесь $\lambda=0{,}4$, поэтому $MX=\dfrac{1}{0{,}4}=2{,}5$ и $\mathrm{Med}\,X=\dfrac{\ln 2}{0{,}4}\approx 1{,}73$. Далее $$P(2<X<5)=F(5)-F(2)=e^{-0{,}4\cdot2}-e^{-0{,}4\cdot5}=e^{-0{,}8}-e^{-2}\approx 0{,}314.$$`,
			answer: String.raw`$MX=2{,}5$, $\mathrm{Med}\,X\approx 1{,}73$, $P(2<X<5)\approx 0{,}314$.`,
			xp: 12
		},
		{
			id: 's-d7-t5',
			difficulty: 'star',
			prompt: String.raw`Независимые $X\sim R(0,a)$ и $Y\sim R(0,b)$. Найдите дисперсию произведения $Z=XY$ и вычислите её при $a=2$, $b=4$.`,
			hint: String.raw`Используйте независимость: $M(XY)=MX\,MY$ и $M(X^2Y^2)=M(X^2)M(Y^2)$. Для $R(0,a)$: $MX=\tfrac a2$, $M(X^2)=\tfrac{a^2}{3}$.`,
			solution: String.raw`Для [[ravnomernoe-raspredelenie|равномерной]] на $[0,a]$: $MX=\dfrac a2$, $M(X^2)=\displaystyle\int_0^a x^2\cdot\frac1a\,dx=\dfrac{a^2}{3}$; аналогично $MY=\dfrac b2$, $M(Y^2)=\dfrac{b^2}{3}$. В силу независимости $$MZ=MX\,MY=\frac{ab}{4},\qquad M(Z^2)=M(X^2)M(Y^2)=\frac{a^2b^2}{9}.$$ Тогда $$DZ=M(Z^2)-(MZ)^2=\frac{a^2b^2}{9}-\frac{a^2b^2}{16}=a^2b^2\Big(\frac19-\frac1{16}\Big)=\frac{7\,a^2b^2}{144}.$$ При $a=2$, $b=4$: $DZ=\dfrac{7\cdot4\cdot16}{144}=\dfrac{448}{144}=\dfrac{28}{9}\approx 3{,}11$.`,
			answer: String.raw`$DZ=\dfrac{7\,a^2b^2}{144}$; при $a=2,b=4$ — $\dfrac{28}{9}\approx 3{,}11$.`,
			xp: 25
		}
	],
	mastery: [
		'Различаю плотность f(x) и вероятность: вероятность — только интеграл (площадь) от f',
		'По плотности нахожу F(x), проверяю нормировку и считаю MX, DX, моду, медиану',
		'Знаю плотности и характеристики R(a,b), Exp(λ), 𝒩(a,σ²) и вывожу MX, DX для показательного',
		'Считаю P(α≤X≤β) для нормального через функцию Лапласа и применяю правило трёх сигм',
		'Нахожу закон и MY для Y=g(X), в том числе через LOTUS, не строя ряд Y'
	]
};
