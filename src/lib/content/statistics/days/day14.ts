import type { Day } from '$lib/types';

export const day14: Day = {
	n: 14,
	phaseId: 'matstat',
	title: 'Метод моментов, ММП, бутстреп',
	chapterRef: 'ch11',
	est: String.raw`1–2 ч`,
	goal: String.raw`Научиться по выборке строить [[tochechnaya-ocenka|точечную оценку]] неизвестного параметра двумя способами — [[metod-momentov|методом моментов]] и [[metod-pravdopodobiya|максимального правдоподобия]] — и оценивать точность самой оценки [[butstrep|бутстрепом]], когда формулы для $D(\widehat\theta)$ нет.`,
	sections: [
		{
			kind: 'definition',
			heading: 'Точечная оценка и её свойства',
			body: String.raw`Пусть закон распределения известен **с точностью до параметра** $\theta$ (например, величина пуассоновская, но $\lambda$ неизвестно). [[tochechnaya-ocenka|Точечная оценка]] — это функция выборки $$\widehat\theta_n=\widehat\theta_n(x_1,\dots,x_n),$$ значение которой берут за приближение $\theta$.

Сама оценка — это **случайная величина**: при разных выборках объёма $n$ получаются разные $\widehat\theta_n$. Поэтому качество оценки описывают через её [[matematicheskoe-ozhidanie|среднее]] и [[dispersiya|дисперсию]]. Три классических требования:

1. [[sostoyatelnost|Состоятельность]]: $\widehat\theta_n\xrightarrow{P}\theta$, то есть $P(\lvert\widehat\theta_n-\theta\rvert<\varepsilon)\to1$ при $n\to\infty$. Минимальное разумное требование: чем больше данных, тем точнее.
2. [[nesmeshchennost|Несмещённость]]: $M(\widehat\theta_n)=\theta$ — нет систематической ошибки. Разность $b(\widehat\theta_n)=M(\widehat\theta_n)-\theta$ называют [[smeshchenie|смещением]].
3. [[effektivnost-ocenki|Эффективность]]: среди несмещённых оценок выбираем ту, у которой [[dispersiya|дисперсия]] наименьшая.`
		},
		{
			kind: 'theorem',
			heading: 'Среднеквадратичная ошибка: смещение и дисперсия',
			body: String.raw`Эффективность как сравнение по дисперсии корректна лишь для **несмещённых** оценок: у смещённой малый разброс может маскировать большую систематическую ошибку. Единую меру даёт [[srednekvadratichnaya-oshibka|среднеквадратичная ошибка]] $$MSE(\widehat\theta)=M(\widehat\theta-\theta)^2.$$

Её ключевое разложение: $$MSE(\widehat\theta)=D(\widehat\theta)+\bigl(b(\widehat\theta)\bigr)^2,\qquad b(\widehat\theta)=M(\widehat\theta)-\theta.$$ То есть полная ошибка складывается из **разброса** и **квадрата смещения**. Для несмещённой оценки $b=0$ и $MSE=D(\widehat\theta)$ — вот почему в классе несмещённых оценок сравнение по $MSE$ равносильно сравнению по дисперсии.`
		},
		{
			kind: 'derivation',
			heading: 'Вывод разложения MSE = дисперсия + смещение²',
			body: String.raw`Обозначим $m=M(\widehat\theta)$. Прибавим и вычтем $m$ под квадратом и раскроем по [[lineynost-ozhidaniya|линейности]] $M$:
$$MSE(\widehat\theta)=M\bigl((\widehat\theta-m)+(m-\theta)\bigr)^2=M(\widehat\theta-m)^2+2(m-\theta)\,M(\widehat\theta-m)+(m-\theta)^2.$$
Средний член обнуляется, так как $M(\widehat\theta-m)=M(\widehat\theta)-m=0$ (а множитель $m-\theta$ — постоянная). Остаётся
$$MSE(\widehat\theta)=\underbrace{M(\widehat\theta-m)^2}_{D(\widehat\theta)}+\underbrace{(m-\theta)^2}_{b^2(\widehat\theta)}.\qquad\blacksquare$$

**Идея для запоминания:** это тот же приём «прибавь-вычти среднее», что и при выводе вычислительной формулы дисперсии. Здесь центрируем не на $\theta$, а на $m=M(\widehat\theta)$ — и перекрёстный член гибнет.

Этот же фокус объясняет, почему [[ispravlennaya-dispersiya|исправленную дисперсию]] делят на $n-1$: выборочная $\sigma_B^2$ — смещённая оценка ($M\sigma_B^2=\frac{n-1}{n}DX$, систематически занижает), а домножение на $\frac{n}{n-1}$ убирает смещение.`
		},
		{
			kind: 'definition',
			heading: 'Метод моментов',
			body: String.raw`[[metod-momentov|Метод моментов]] — простейший общий способ построить оценку. Идея: приравнять **теоретические** [[momenty|моменты]] (выраженные через $\theta$) к **выборочным** и решить уравнение относительно $\theta$.

Начальный момент порядка $k$ есть $\alpha_k=MX^k$, его выборочный аналог $\widehat\alpha_k=\frac1n\sum_i x_i^k$. Для одного параметра достаточно первых моментов: $$\alpha_1=\widehat\alpha_1\quad\Longleftrightarrow\quad MX=\bar X.$$ Если параметров несколько, добавляют уравнения $\alpha_2=\widehat\alpha_2$ и т.д., пока число уравнений не сравняется с числом параметров.

**Пример (Пуассон).** У закона Пуассона $MX=\lambda$, значит $\alpha_1=\lambda$. Уравнение $\alpha_1=\widehat\alpha_1$ даёт $\widehat\lambda=\bar X$. Но у Пуассона ещё и $DX=\lambda$, поэтому годится и $\widehat\lambda=\sigma_B^2$ — **две разные оценки** одного параметра. Это характерная черта метода: оценка не единственна и, как правило, не самая [[effektivnost-ocenki|эффективная]].`
		},
		{
			kind: 'definition',
			heading: 'Метод максимального правдоподобия',
			body: String.raw`[[metod-pravdopodobiya|Метод максимального правдоподобия]] (ММП) исходит из принципа: берём то значение $\theta$, при котором **наблюдавшаяся выборка наиболее вероятна**.

[[funkciya-pravdopodobiya|Функция правдоподобия]] — совместная плотность (или вероятность) выборки как функция параметра: $$L(x,\theta)=\prod_{i=1}^{n}f(x_i,\theta).$$ Оценка $\widehat\theta$ — точка максимума $L$. Так как логарифм монотонен, удобнее максимизировать [[logarifmicheskaya-funkciya-pravdopodobiya|логарифм]] (произведение превращается в сумму): $$\ell(x,\theta)=\ln L=\sum_{i=1}^n\ln f(x_i,\theta).$$ Решают [[uravnenie-pravdopodobiya|уравнение правдоподобия]] $\partial\ell/\partial\theta=0$, проверяя $\ell''<0$ (это максимум, а не минимум).`
		},
		{
			kind: 'derivation',
			heading: 'Вывод ММП-оценки для Бернулли',
			body: String.raw`Пусть каждое наблюдение $x_i\in\{0,1\}$ по закону Бернулли $p(x)=\theta^{x}(1-\theta)^{1-x}$ с неизвестной вероятностью успеха $\theta$. Функция правдоподобия:
$$L(x,\theta)=\prod_{i=1}^{n}\theta^{x_i}(1-\theta)^{1-x_i}=\theta^{\sum_i x_i}(1-\theta)^{\,n-\sum_i x_i}.$$
Логарифмируем (произведение $\to$ сумма):
$$\ell(x,\theta)=\Bigl(\sum_i x_i\Bigr)\ln\theta+\Bigl(n-\sum_i x_i\Bigr)\ln(1-\theta).$$
[[uravnenie-pravdopodobiya|Уравнение правдоподобия]]:
$$\frac{\partial\ell}{\partial\theta}=\frac{\sum_i x_i}{\theta}-\frac{n-\sum_i x_i}{1-\theta}=0.$$
Перекрёстно умножаем: $(1-\theta)\sum_i x_i=\theta\,(n-\sum_i x_i)$, раскрываем — слагаемые с $\theta\sum_i x_i$ сокращаются, остаётся $\sum_i x_i=n\theta$. Отсюда
$$\widehat\theta=\frac{\sum_i x_i}{n}=\bar X.\qquad\blacksquare$$

То есть ММП-оценка вероятности успеха — это **выборочная доля единиц**. Аналогичный вывод для Пуассона ($\ell=\sum_i x_i\ln\lambda-n\lambda-\text{const}$, $\partial\ell/\partial\lambda=\frac{\sum_i x_i}{\lambda}-n=0$) даёт $\widehat\lambda=\bar X$ — ту же оценку, что и [[metod-momentov|метод моментов]]. Совпадение не случайно: для многих экспоненциальных семейств оба метода ведут к выборочному среднему.`
		},
		{
			kind: 'definition',
			heading: 'Бутстреп: оценка точности оценки',
			body: String.raw`Построив $\widehat\theta_n$, спросим: насколько она точна, то есть какова $D(\widehat\theta_n)$? Для среднего ответ известен — $D(\bar X)=\sigma^2/n$. Но для [[mediana|медианы]], коэффициента корреляции и прочих сложных оценок явной формулы может **не быть**. Тут спасает [[butstrep|бутстреп]] (Б. Эфрон).

[[butstrep-vyborka|Бутстреп-выборка]] $x_1^*,\dots,x_n^*$ — это выборка того же объёма $n$, полученная извлечением из исходной **с возвращением** (каждый элемент с вероятностью $1/n$). Одни значения попадут несколько раз, другие — ни разу. Это равносильно выборке из [[empiricheskaya-funkciya-raspredeleniya|эмпирической функции распределения]]: неизвестное теоретическое распределение заменяем его выборочным аналогом.

**Алгоритм.** (1) генерируем $B$ бутстреп-выборок (берут $B\approx1000$); (2) на каждой по той же формуле считаем $\widehat\theta^*_b$; (3) разброс значений $\widehat\theta^*_1,\dots,\widehat\theta^*_B$ и есть мера точности. [[butstrep-ocenka-dispersii|Бутстреп-оценка дисперсии]]: $$\widehat D_{\text{boot}}=\frac{1}{B-1}\sum_{b=1}^{B}\bigl(\widehat\theta^*_b-\overline{\widehat\theta^*}\bigr)^2,$$ а $\sqrt{\widehat D_{\text{boot}}}$ — бутстреп-оценка [[standartnaya-oshibka|стандартной ошибки]].`
		},
		{
			kind: 'intuition',
			heading: 'Почему бутстреп вообще работает',
			body: String.raw`Идеально было бы оценить разброс $\widehat\theta_n$ так: набрать заново много новых выборок объёма $n$ из истинного распределения $F$, на каждой пересчитать оценку и посмотреть на разброс. Но $F$ нам недоступно, и второй выборки нет.

[[butstrep|Бутстреп]] делает дерзкую подмену: раз $F$ неизвестно, возьмём вместо него [[empiricheskaya-funkciya-raspredeleniya|эмпирическое распределение]] $\widehat F$ — то, что «живёт» прямо в нашей выборке (каждое наблюдение с весом $1/n$). Выборка из $\widehat F$ — это и есть извлечение **с возвращением**. При больших $n$ закон больших чисел гарантирует $\widehat F\approx F$, поэтому и разброс оценок на бутстреп-выборках $\approx$ настоящему разбросу $\widehat\theta_n$.

**Ключевая мысль:** бутстреп не создаёт новой информации из воздуха — он лишь честно использует ту изменчивость, что уже заложена в данных, превращая *один* набор наблюдений в распределение оценок без единой формулы.`
		},
		{
			kind: 'connection',
			heading: 'Где это в ML и продакшене',
			body: String.raw`Сегодняшние идеи — несущая конструкция машинного обучения. **Максимизация правдоподобия** — это обучение почти любой вероятностной модели: минимизация cross-entropy при классификации есть в точности максимизация $\ell(\theta)$ для категориального распределения, а MSE-лосс в регрессии — это ММП при гауссовском шуме. Градиентный спуск решает то самое [[uravnenie-pravdopodobiya|уравнение правдоподобия]] $\partial\ell/\partial\theta=0$ численно.

**Разложение [[srednekvadratichnaya-oshibka|MSE]] на смещение и дисперсию** — это знаменитый bias-variance tradeoff: недообученная модель смещена, переобученная имеет большую дисперсию, а регуляризация осознанно добавляет смещение ради снижения разброса.

**Бутстреп** в проде — это доверительные интервалы для метрик без предположений о распределении (медиана времени отклика, конверсия, ROC-AUC), а его прямой потомок — **бэггинг** и случайный лес: каждое дерево учится на своей бутстреп-выборке, и усреднение гасит дисперсию ровно по формуле $D(\bar X)=\sigma^2/n$.`
		}
	],
	code: {
		title: 'Оценка λ Пуассона (ММ = ММП) и её точность бутстрепом',
		language: 'python',
		code: `import random, math, statistics

# --- Генерация выборки из Пуассона; истинное lambda=3 нам "неизвестно" ---
def poisson(lam, rnd):
    """Один пуассоновский отсчёт (алгоритм Кнута)."""
    L, k, p = math.exp(-lam), 0, 1.0
    while True:
        k += 1
        p *= rnd.random()
        if p <= L:
            return k - 1

rnd = random.Random(42)
data = [poisson(3.0, rnd) for _ in range(2000)]

# --- Точечная оценка: и метод моментов, и ММП дают lambda_hat = X̄ ---
lam_hat = statistics.mean(data)
print(f"lambda_hat = X̄ = {lam_hat:.3f}")          # ≈ 2.988

# --- Бутстреп: оцениваем стандартную ошибку самой оценки lambda_hat ---
def bootstrap_se(sample, stat, B=2000, seed=0):
    rnd = random.Random(seed)
    n = len(sample)
    # каждая псевдовыборка — извлечение n элементов С ВОЗВРАЩЕНИЕМ
    vals = [stat([rnd.choice(sample) for _ in range(n)]) for _ in range(B)]
    return statistics.stdev(vals)                  # sqrt бутстреп-дисперсии

se_boot = bootstrap_se(data, statistics.mean, B=2000)
print(f"SE_boot(lambda_hat) ≈ {se_boot:.4f}")      # ≈ 0.0387

# --- Сверка с аналитикой: SE(X̄)=sqrt(D/n), у Пуассона D=lambda ---
se_formula = math.sqrt(lam_hat / len(data))
print(f"SE_формула ≈ {se_formula:.4f}")            # ≈ 0.0387 — совпало!`,
		explanation: String.raw`Сначала строим [[tochechnaya-ocenka|точечную оценку]] $\widehat\lambda=\bar X\approx2{,}988$ — и [[metod-momentov|метод моментов]], и [[metod-pravdopodobiya|ММП]] для Пуассона дают одну формулу, выборочное среднее. Затем [[butstrep|бутстреп]] оценивает её [[standartnaya-oshibka|стандартную ошибку]] чисто вычислительно: 2000 псевдовыборок с возвращением, на каждой пересчитываем оценку, берём СКО результатов. Получаем $\approx0{,}0387$ — и это совпадает с аналитической $\sqrt{\lambda/n}$ до четвёртого знака, хотя бутстреп **не знал** формулы.

**В проде** так строят доверительные оценки для метрик, у которых формулы нет или предположения нарушены: медиана латентности, конверсия с поправкой, AUC модели. Тот же приём извлечения с возвращением лежит в основе бэггинга и случайного леса — каждое дерево обучается на своей бутстреп-выборке, а усреднение по ансамблю гасит дисперсию предсказания.`
	},
	tasks: [
		{
			id: 's-d14-t1',
			difficulty: 'base',
			prompt: String.raw`Наблюдения подчинены закону Пуассона с неизвестным $\lambda$. По выборке $x=(1,3,2,4,3,2,1,4)$ найдите оценку $\widehat\lambda$ [[metod-momentov|методом моментов]].`,
			hint: String.raw`У Пуассона $MX=\lambda$, значит уравнение метода моментов — это $\lambda=\widehat\alpha_1=\bar X$.`,
			solution: String.raw`Для Пуассона $\alpha_1=MX=\lambda$. Уравнение метода моментов $\alpha_1=\widehat\alpha_1$ даёт $\widehat\lambda=\bar X$. Считаем выборочное среднее: $$\bar X=\frac{1+3+2+4+3+2+1+4}{8}=\frac{20}{8}=2{,}5.$$ Значит $\widehat\lambda=2{,}5$.`,
			answer: String.raw`$\widehat\lambda=\bar X=2{,}5$.`,
			xp: 12
		},
		{
			id: 's-d14-t2',
			difficulty: 'base',
			prompt: String.raw`Проведено $n=10$ испытаний Бернулли, успех наступил $7$ раз. Найдите [[metod-pravdopodobiya|ММП]]-оценку вероятности успеха $\theta$.`,
			hint: String.raw`Для Бернулли уже выведено $\widehat\theta=\bar X=\frac{1}{n}\sum_i x_i$ — это доля единиц.`,
			solution: String.raw`Из вывода для Бернулли ММП-оценка — выборочная доля единиц: $$\widehat\theta=\frac{\sum_i x_i}{n}=\frac{7}{10}=0{,}7.$$ Это то значение $\theta$, при котором наблюдавшийся результат «7 успехов из 10» наиболее правдоподобен.`,
			answer: String.raw`$\widehat\theta=0{,}7$.`,
			xp: 12
		},
		{
			id: 's-d14-t3',
			difficulty: 'base',
			prompt: String.raw`По выборке $x=(2,4,4,6)$ оценивают среднее $\widehat\theta=\bar X$. Даны четыре [[butstrep-vyborka|бутстреп-выборки]] и их средние: $(4,2,6,4)\to4{,}0$; $(2,2,4,6)\to3{,}5$; $(4,4,6,6)\to5{,}0$; $(2,4,4,4)\to3{,}5$. Найдите [[butstrep-ocenka-dispersii|бутстреп-оценку дисперсии]] и стандартную ошибку.`,
			hint: String.raw`Сначала среднее бутстреп-значений $\overline{\widehat\theta^*}$, потом $\widehat D_{\text{boot}}=\frac{1}{B-1}\sum_b(\widehat\theta^*_b-\overline{\widehat\theta^*})^2$ с $B=4$.`,
			solution: String.raw`Среднее бутстреп-значений: $$\overline{\widehat\theta^*}=\frac{4{,}0+3{,}5+5{,}0+3{,}5}{4}=4{,}0.$$ Отклонения: $0;\ -0{,}5;\ 1{,}0;\ -0{,}5$, их квадраты $0;\ 0{,}25;\ 1{,}0;\ 0{,}25$, сумма $1{,}5$. Тогда $$\widehat D_{\text{boot}}=\frac{1}{4-1}\cdot1{,}5=0{,}5,\qquad \sqrt{\widehat D_{\text{boot}}}=\sqrt{0{,}5}\approx0{,}71.$$ (На практике $B\approx1000$; здесь $B=4$ взято для иллюстрации схемы.)`,
			answer: String.raw`$\widehat D_{\text{boot}}=0{,}5$, $\text{SE}\approx0{,}71$.`,
			xp: 12
		},
		{
			id: 's-d14-t4',
			difficulty: 'star',
			prompt: String.raw`Покажите, что выборочная дисперсия $\sigma_B^2=\frac1n\sum_i(x_i-\bar X)^2$ — [[smeshchenie|смещённая]] оценка дисперсии: $M(\sigma_B^2)=\frac{n-1}{n}DX$. Какой множитель делает её [[nesmeshchennost|несмещённой]]?`,
			hint: String.raw`Используйте $\sigma_B^2=\frac1n\sum_i x_i^2-\bar X^2$, затем $M\bar X^2=D\bar X+(M\bar X)^2=\frac{DX}{n}+(MX)^2$ для независимых наблюдений.`,
			solution: String.raw`Раскроем квадрат: $\sigma_B^2=\frac1n\sum_i x_i^2-\bar X^2$. Берём математическое ожидание. Первое слагаемое: $M\bigl(\frac1n\sum_i x_i^2\bigr)=M(X^2)$. Второе: по формуле $M\bar X^2=D\bar X+(M\bar X)^2$, где для [[nezavisimost-velichin|независимых]] наблюдений $D\bar X=\frac{DX}{n}$, а $M\bar X=MX$, получаем $$M\bar X^2=\frac{DX}{n}+(MX)^2.$$ Подставляем: $$M(\sigma_B^2)=M(X^2)-\frac{DX}{n}-(MX)^2=\underbrace{\bigl(M(X^2)-(MX)^2\bigr)}_{DX}-\frac{DX}{n}=DX-\frac{DX}{n}=\frac{n-1}{n}DX.$$ Значит $\sigma_B^2$ систематически **занижает** $DX$. Чтобы убрать смещение, домножим на $\frac{n}{n-1}$ — получим [[ispravlennaya-dispersiya|исправленную дисперсию]] $$S^2=\frac{n}{n-1}\sigma_B^2=\frac{1}{n-1}\sum_i(x_i-\bar X)^2,$$ для которой $M(S^2)=\frac{n}{n-1}\cdot\frac{n-1}{n}DX=DX$. $\;\blacksquare$`,
			answer: String.raw`$M(\sigma_B^2)=\frac{n-1}{n}DX$; множитель $\frac{n}{n-1}$ даёт несмещённую $S^2$.`,
			xp: 25
		},
		{
			id: 's-d14-t5',
			difficulty: 'base',
			prompt: String.raw`Сравните оценку $\widehat\theta_1$ со смещением $b=2$ и дисперсией $D=1$ с несмещённой $\widehat\theta_2$, у которой $D=9$. Какая точнее по [[srednekvadratichnaya-oshibka|среднеквадратичной ошибке]]?`,
			hint: String.raw`$MSE=D+b^2$. У несмещённой $b=0$.`,
			solution: String.raw`По разложению $MSE=D+b^2$: $$MSE_1=1+2^2=5,\qquad MSE_2=9+0^2=9.$$ Хотя $\widehat\theta_1$ смещена, её $MSE=5$ меньше, чем $MSE=9$ у несмещённой $\widehat\theta_2$. То есть **смещённая оценка может быть точнее** — это и есть суть bias-variance tradeoff: небольшое смещение оправдано, если оно резко снижает дисперсию.`,
			answer: String.raw`$MSE_1=5<MSE_2=9$ — точнее смещённая $\widehat\theta_1$.`,
			xp: 12
		}
	],
	mastery: [
		'Различаю состоятельность, несмещённость и эффективность оценки и понимаю, зачем каждое свойство',
		'Вывожу разложение MSE = D + b² и объясняю, почему смещённая оценка бывает точнее',
		'Строю оценку методом моментов: приравниваю теоретические моменты к выборочным',
		'Выписываю функцию правдоподобия, логарифмирую и решаю уравнение правдоподобия (Бернулли, Пуассон)',
		'Объясняю схему бутстрепа (извлечение с возвращением) и считаю бутстреп-оценку стандартной ошибки'
	]
};
