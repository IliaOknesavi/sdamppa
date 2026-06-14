import type { Day } from '$lib/types';

export const day13: Day = {
	n: 13,
	phaseId: 'matstat',
	title: 'Точечное оценивание. Свойства оценок',
	chapterRef: 'ch11',
	est: String.raw`1–2 ч`,
	goal: String.raw`Научиться по выборке строить одно число — [[tochechnaya-ocenka|точечную оценку]] неизвестного параметра $\theta$ — и понимать, какая оценка хорошая: разобрать [[sostoyatelnost|состоятельность]], [[nesmeshchennost|несмещённость]] и [[effektivnost|эффективность]], свести их в единую меру [[mse|MSE]] и вывести, почему [[ispravlennaya-dispersiya|исправленная дисперсия]] делится на $n-1$.`,
	sections: [
		{
			kind: 'definition',
			heading: 'Что такое точечная оценка',
			body: String.raw`В части 1 курса распределение было известно полностью. Теперь типичная ситуация статистики: закон распределения известен **с точностью до параметра** $\theta$ — например, мы знаем, что величина пуассоновская, но само $\lambda$ неизвестно. Задача — по [[vyborka|выборке]] $x_1,\dots,x_n$ указать приближённое значение $\theta$.

[[tochechnaya-ocenka|Точечная оценка]] — это функция выборки

$$\widehat\theta_n=\widehat\theta_n(x_1,\dots,x_n),$$

значение которой принимают за приближённое значение $\theta$. «Точечная» — потому что результат одно число (точка), в отличие от доверительного интервала (день 15).

Ключевой сдвиг мышления: наблюдения $X_1,\dots,X_n$ случайны, значит и $\widehat\theta_n$ — **[[sluchaynaya-velichina|случайная величина]]**. На разных выборках одного объёма $n$ она даёт разные значения. Поэтому об оценке судят не по одному прогону, а по её *распределению*: где её [[matematicheskoe-ozhidanie|центр]] и каков [[dispersiya|разброс]].`
		},
		{
			kind: 'definition',
			heading: 'Три свойства хорошей оценки',
			body: String.raw`Хорошая оценка должна группироваться около истинного $\theta$ и с ростом $n$ всё точнее его воспроизводить. Это формализуют три свойства.

**[[sostoyatelnost|Состоятельность]].** Оценка $\widehat\theta_n$ состоятельна, если она [[shodimost-po-veroyatnosti|сходится по вероятности]] к $\theta$: для любого $\varepsilon>0$

$$\lim_{n\to\infty} P\bigl(\lvert\widehat\theta_n-\theta\rvert<\varepsilon\bigr)=1.$$

Это про поведение при $n\to\infty$: чем больше данных, тем выше шанс оказаться сколь угодно близко к истине. Минимальное разумное требование — несостоятельную оценку использовать бессмысленно.

**[[nesmeshchennost|Несмещённость]].** Оценка несмещённая, если её среднее равно параметру:

$$M\bigl(\widehat\theta_n\bigr)=\theta.$$

Это про отсутствие *систематической* ошибки: «в среднем» по всем мыслимым выборкам оценка попадает точно в $\theta$, не завышая и не занижая. Разность [[smeshchenie|$b(\widehat\theta_n)=M(\widehat\theta_n)-\theta$]] называют **смещением**; если $M(\widehat\theta_n)\to\theta$ лишь при $n\to\infty$, оценку зовут *асимптотически несмещённой*.

**[[effektivnost|Эффективность]].** Среди несмещённых оценок эффективна та, у которой наименьшая [[dispersiya|дисперсия]]: $\sigma^2_{\widehat\theta_n}\to\min$. Из двух несмещённых лучше та, чьи значения теснее жмутся к $\theta$.`
		},
		{
			kind: 'note',
			heading: 'Почему эффективность сравнивают только у несмещённых',
			body: String.raw`Сравнение по одной лишь [[dispersiya|дисперсии]] корректно **только** для несмещённых оценок. У смещённой оценки малая дисперсия может соседствовать с большой систематической ошибкой: представьте «оценку» $\widehat\theta\equiv 0$ — её дисперсия нулевая, но толку ноль.

Поэтому нужна мера, учитывающая и разброс, и смещение разом. Ею служит [[mse|средняя квадратическая ошибка]] $\mathrm{MSE}$ (следующая секция). Она и расставляет всё по местам.`
		},
		{
			kind: 'theorem',
			heading: 'MSE: разложение на дисперсию и смещение',
			body: String.raw`**[[mse|Средняя квадратическая ошибка]]** оценки — среднее квадрата её отклонения от истинного параметра:

$$\mathrm{MSE}(\widehat\theta)=M\bigl(\widehat\theta-\theta\bigr)^2.$$

Главный факт о ней — разложение **«дисперсия плюс квадрат смещения»**:

$$\mathrm{MSE}(\widehat\theta)=D(\widehat\theta)+\bigl(b(\widehat\theta)\bigr)^2,\qquad b(\widehat\theta)=M(\widehat\theta)-\theta.$$

Это и есть единая мера качества: одно число штрафует и за разброс, и за систематический сдвиг. Для **несмещённой** оценки $b=0$, и тогда $\mathrm{MSE}=D(\widehat\theta)$ — вот почему в классе несмещённых сравнение по MSE совпадает с требованием [[effektivnost|эффективности]].`
		},
		{
			kind: 'derivation',
			heading: 'Вывод разложения MSE',
			body: String.raw`Обозначим $m=M(\widehat\theta)$. Под квадратом прибавим и вычтем $m$ (приём центрирования) и раскроем по [[lineynost-ozhidaniya|линейности]] $M$:

$$\mathrm{MSE}(\widehat\theta)=M\bigl(\widehat\theta-\theta\bigr)^2=M\bigl((\widehat\theta-m)+(m-\theta)\bigr)^2$$

$$=M(\widehat\theta-m)^2+2(m-\theta)\,M(\widehat\theta-m)+(m-\theta)^2.$$

Средний член зануляется, потому что $M(\widehat\theta-m)=M(\widehat\theta)-m=0$ (отклонение от собственного среднего в среднем равно нулю), а $(m-\theta)$ — постоянная. Остаётся

$$\mathrm{MSE}(\widehat\theta)=\underbrace{M(\widehat\theta-m)^2}_{D(\widehat\theta)}+\underbrace{(m-\theta)^2}_{b(\widehat\theta)^2}.\qquad\blacksquare$$

**Идея для запоминания:** это тот же приём, что и в выводе $DX=M(X^2)-(MX)^2$ (день 5) — центрируем вокруг среднего, и кросс-член исчезает. Здесь «промах» оценки распадается на *случайный* (дисперсия) и *систематический* (смещение).`
		},
		{
			kind: 'derivation',
			heading: 'Выборочное среднее: несмещённость и состоятельность',
			body: String.raw`Оценим $a=MX$ [[vyborochnoe-srednee|выборочным средним]] $\widehat a=\overline X=\frac1n\sum_{i=1}^n X_i$. Наблюдения $X_i$ независимы и одинаково распределены: $MX_i=a$, $DX_i=\sigma^2$.

**Несмещённость.** По [[lineynost-ozhidaniya|линейности]] математического ожидания

$$M(\overline X)=M\Bigl(\tfrac1n\textstyle\sum_i X_i\Bigr)=\tfrac1n\sum_i MX_i=\tfrac1n\cdot na=a.$$

Значит $\overline X$ — [[nesmeshchennost|несмещённая]] оценка $a$ при любом $n$.

**Состоятельность.** Найдём дисперсию (тут уже нужна [[nezavisimost-velichin|независимость]] — у суммы независимых дисперсии складываются):

$$D(\overline X)=D\Bigl(\tfrac1n\textstyle\sum_i X_i\Bigr)=\tfrac1{n^2}\sum_i DX_i=\tfrac{n\sigma^2}{n^2}=\frac{\sigma^2}{n}\xrightarrow[n\to\infty]{}0.$$

Подставим в [[neravenstvo-chebysheva|неравенство Чебышёва]]:

$$P\bigl(\lvert\overline X-a\rvert<\varepsilon\bigr)\ge 1-\frac{D(\overline X)}{\varepsilon^2}=1-\frac{\sigma^2}{n\varepsilon^2}\xrightarrow[n\to\infty]{}1.$$

Это и есть определение [[sostoyatelnost|состоятельности]] — по сути [[zakon-bolshih-chisel|закон больших чисел]] для $\overline X$. $\;\blacksquare$`
		},
		{
			kind: 'derivation',
			heading: 'Почему делят на n−1: смещённость σ²_B',
			body: String.raw`Проверим, годится ли [[vyborochnaya-dispersiya|выборочная дисперсия]] $\sigma_B^2=\frac1n\sum_i(X_i-\overline X)^2$ как оценка $DX$. Считаем $M(\sigma_B^2)$. Раскрытие квадрата даёт удобный вид

$$M(\sigma_B^2)=M\Bigl(\tfrac1n\textstyle\sum_i X_i^2\Bigr)-M(\overline X)^2=M(X^2)-M(\overline X)^2.$$

Первое слагаемое равно $M(X^2)$. Для второго пользуемся [[nezavisimost-velichin|независимостью]] ($M(X_iX_j)=MX_i\,MX_j$ при $i\ne j$):

$$M(\overline X)^2=\tfrac1{n^2}M\Bigl(\textstyle\sum_i X_i\Bigr)^2=\tfrac1{n^2}\Bigl(\sum_i MX_i^2+\sum_{i\ne j}MX_i\,MX_j\Bigr)=\frac{M(X^2)}{n}+\frac{n-1}{n}(MX)^2.$$

Подставляем:

$$M(\sigma_B^2)=M(X^2)-\frac{M(X^2)}{n}-\frac{n-1}{n}(MX)^2=\frac{n-1}{n}\bigl(M(X^2)-(MX)^2\bigr)=\frac{n-1}{n}\,DX.$$

Итог: $M(\sigma_B^2)=\frac{n-1}{n}DX=DX-\frac{DX}{n}<DX$. Выборочная дисперсия **систематически занижает** $DX$ — она [[smeshchenie|смещённая]] (хотя асимптотически несмещённая: при $n\to\infty$ смещение тает).

**Лечение.** Домножив на $\frac{n}{n-1}$, получаем [[ispravlennaya-dispersiya|исправленную дисперсию]]

$$S^2=\frac{n}{n-1}\sigma_B^2=\frac{1}{n-1}\sum_{i=1}^n(X_i-\overline X)^2,\qquad M(S^2)=\frac{n}{n-1}\cdot\frac{n-1}{n}DX=DX.$$

Она [[nesmeshchennost|несмещённая]] — именно поэтому при малых $n$ берут $S^2$, а не $\sigma_B^2$. $\;\blacksquare$`
		},
		{
			kind: 'intuition',
			heading: 'Откуда «минус один»: потеря степени свободы',
			body: String.raw`Почему центрирование вокруг $\overline X$ занижает разброс? Потому что $\overline X$ — **сама подогнана под данные**. Среди всех чисел $a$ сумма $\sum_i(X_i-a)^2$ минимальна именно при $a=\overline X$. Значит отклонения от выборочного среднего в среднем *меньше*, чем отклонения от истинного $MX$, — и деление на $n$ даёт заниженную оценку.

Множитель $\frac{n}{n-1}$ компенсирует ровно эту фору. Формальный язык: оценив $\overline X$, мы «потратили» одну [[stepeni-svobody|степень свободы]], и независимых отклонений осталось $n-1$, а не $n$. При большом $n$ разница $\frac{n}{n-1}\approx 1$ несущественна — оттого смещение и исчезает асимптотически. Это первый звонок общего правила: *каждый оценённый по выборке параметр съедает одну степень свободы* (пригодится в $\chi^2$ и регрессии).`
		},
		{
			kind: 'connection',
			heading: 'Мост: куда это ведёт',
			body: String.raw`Сегодня мы задали **критерии качества** оценки. Дальше курс отвечает на два вопроса.

- *Как оценки строить?* День 14 — два общих рецепта: [[metod-momentov|метод моментов]] (приравнять теоретические моменты выборочным) и [[metod-pravdopodobiya|метод максимального правдоподобия]]. Оба для пуассоновского и бернуллиевского законов дают знакомое $\widehat\theta=\overline X$ — то самое выборочное среднее, чью несмещённость и состоятельность мы только что доказали.
- *Насколько оценка точна?* Разброс оценки измеряет $D(\widehat\theta_n)$. Для $\overline X$ мы выписали его явно ($\sigma^2/n$), но для медианы или коэффициента корреляции формулы может не быть — тогда спасает [[butstrep|бутстреп]] (день 14/15): многократно пересэмплируем выборку с возвращением и смотрим на разброс оценки. А на разбросе строят [[doveritelnyy-interval|доверительные интервалы]] (день 15) — переход от «точки» к «интервалу».`
		}
	],
	code: {
		title: 'Несмещённость S² и состоятельность X̄ методом Монте-Карло',
		language: 'python',
		code: `import random, statistics

# Истинная совокупность: равномерная на {1..6} (как бросок кубика)
POP = [1, 2, 3, 4, 5, 6]
true_mean = statistics.mean(POP)           # MX = 3.5
true_var  = statistics.pvariance(POP)      # DX = 35/12 ≈ 2.9167

def draw(n):
    "Выборка объёма n из совокупности (с возвращением)."
    return [random.choice(POP) for _ in range(n)]

random.seed(0)
n, trials = 5, 200_000                      # малое n: смещение sigma_B^2 заметно

means, var_B, var_S = [], [], []
for _ in range(trials):
    s = draw(n)
    m = statistics.mean(s)
    ss = sum((x - m) ** 2 for x in s)
    means.append(m)
    var_B.append(ss / n)                     # выборочная дисперсия  (делим на n)
    var_S.append(ss / (n - 1))               # исправленная S^2     (делим на n-1)

print(f"DX истинная           = {true_var:.4f}")
print(f"M(sigma_B^2) ~ {statistics.mean(var_B):.4f}  (ожидаем (n-1)/n*DX = {(n-1)/n*true_var:.4f})")
print(f"M(S^2)       ~ {statistics.mean(var_S):.4f}  (ожидаем DX        = {true_var:.4f})")

# Состоятельность X̄: разброс среднего падает как sigma^2/n
for nn in (5, 50, 500):
    spread = statistics.pvariance([statistics.mean(draw(nn)) for _ in range(20_000)])
    print(f"n={nn:>3}: D(X̄) ~ {spread:.4f}   (теория sigma^2/n = {true_var/nn:.4f})")`,
		explanation: String.raw`Монте-Карло показывает оба факта вживую. Среднее [[vyborochnaya-dispersiya|$\sigma_B^2$]] по 200 000 выборок выходит $\approx 2{,}333$ — это в точности $\frac{n-1}{n}DX=\frac45\cdot 2{,}9167$, видимое **смещение вниз**. А среднее [[ispravlennaya-dispersiya|$S^2$]] садится на истинные $\approx 2{,}9167$ — деление на $n-1$ убирает смещение. Вторая часть демонстрирует [[sostoyatelnost|состоятельность]] [[vyborochnoe-srednee|$\overline X$]]: разброс $D(\overline X)$ падает как $\sigma^2/n$ — при $n=500$ он в сто раз меньше, чем при $n=5$.

**В проде** это причина, по которой статистические библиотеки (numpy с **ddof=1**, pandas **.var()**, Excel **ДИСП.В**) по умолчанию делят на $n-1$: вы почти всегда работаете с выборкой, а не с генеральной совокупностью. А зависимость $D(\overline X)=\sigma^2/n$ — основа планирования размера выборки: чтобы вдвое сузить разброс метрики в A/B-тесте, данных нужно вчетверо больше.`
	},
	tasks: [
		{
			id: 's-d13-t1',
			difficulty: 'base',
			prompt: String.raw`По выборке $x=(2,\ 4,\ 4,\ 6)$ объёма $n=4$ найдите оценку среднего $\overline X$, выборочную дисперсию $\sigma_B^2$ и исправленную дисперсию $S^2$.`,
			hint: String.raw`$\overline X=\frac1n\sum x_i$. Затем $\sigma_B^2=\frac1n\sum(x_i-\overline X)^2$, а [[ispravlennaya-dispersiya|$S^2$]] — та же сумма квадратов, но делённая на $n-1$.`,
			solution: String.raw`Среднее:

$$\overline X=\frac{2+4+4+6}{4}=4.$$

Сумма квадратов отклонений:

$$\sum_i(x_i-\overline X)^2=(2-4)^2+(4-4)^2+(4-4)^2+(6-4)^2=4+0+0+4=8.$$

Отсюда

$$\sigma_B^2=\frac{8}{4}=2,\qquad S^2=\frac{8}{4-1}=\frac83\approx 2{,}67.$$

Видно, что $S^2>\sigma_B^2$: исправление поднимает заниженную оценку.`,
			answer: String.raw`$\overline X=4$, $\sigma_B^2=2$, $S^2=8/3\approx 2{,}67$.`,
			xp: 12
		},
		{
			id: 's-d13-t2',
			difficulty: 'base',
			prompt: String.raw`Оценка $\widehat\theta$ имеет $M(\widehat\theta)=\theta+2$ и $D(\widehat\theta)=9$. Найдите смещение $b(\widehat\theta)$ и среднюю квадратическую ошибку $\mathrm{MSE}(\widehat\theta)$.`,
			hint: String.raw`[[smeshchenie|Смещение]] $b=M(\widehat\theta)-\theta$. Затем примените разложение [[mse|$\mathrm{MSE}=D+b^2$]].`,
			solution: String.raw`Смещение:

$$b(\widehat\theta)=M(\widehat\theta)-\theta=(\theta+2)-\theta=2.$$

По разложению средней квадратической ошибки

$$\mathrm{MSE}(\widehat\theta)=D(\widehat\theta)+b^2=9+2^2=13.$$

Заметьте: будь оценка несмещённой, MSE был бы равен только дисперсии $9$; систематический сдвиг добавил ещё $4$.`,
			answer: String.raw`$b=2$, $\mathrm{MSE}=13$.`,
			xp: 12
		},
		{
			id: 's-d13-t3',
			difficulty: 'base',
			prompt: String.raw`Наблюдения $X_1,\dots,X_n$ независимы, $MX_i=a$, $DX_i=\sigma^2$. Докажите, что $\overline X$ — [[nesmeshchennost|несмещённая]] оценка $a$, и найдите $D(\overline X)$.`,
			hint: String.raw`Для среднего используйте [[lineynost-ozhidaniya|линейность]] $M$; для дисперсии — независимость (дисперсии суммы складываются) и вынос постоянной $\frac1{n^2}$.`,
			solution: String.raw`**Несмещённость.** По линейности

$$M(\overline X)=\frac1n\sum_{i=1}^n MX_i=\frac1n\cdot na=a,$$

то есть $M(\overline X)=a$ при любом $n$.

**Дисперсия.** Так как $X_i$ [[nezavisimost-velichin|независимы]],

$$D(\overline X)=\frac1{n^2}\sum_{i=1}^n DX_i=\frac{n\sigma^2}{n^2}=\frac{\sigma^2}{n}.$$

С ростом $n$ дисперсия оценки падает к нулю — это и есть зерно [[sostoyatelnost|состоятельности]].`,
			answer: String.raw`$M(\overline X)=a$ (несмещённость), $D(\overline X)=\sigma^2/n$.`,
			xp: 12
		},
		{
			id: 's-d13-t4',
			difficulty: 'star',
			prompt: String.raw`Докажите, что [[vyborochnaya-dispersiya|выборочная дисперсия]] $\sigma_B^2=\frac1n\sum_i(X_i-\overline X)^2$ смещена: $M(\sigma_B^2)=\frac{n-1}{n}DX$. Выведите отсюда несмещённый множитель и объясните, почему смещение исчезает при $n\to\infty$.`,
			hint: String.raw`Сведите к $M(\sigma_B^2)=M(X^2)-M(\overline X)^2$. Для $M(\overline X)^2$ раскройте $\bigl(\sum_i X_i\bigr)^2$ и используйте $M(X_iX_j)=MX_i\,MX_j$ при $i\ne j$.`,
			solution: String.raw`Раскрытие квадрата даёт

$$M(\sigma_B^2)=M\Bigl(\tfrac1n\sum_i X_i^2\Bigr)-M(\overline X)^2=M(X^2)-M(\overline X)^2.$$

Распишем $M(\overline X)^2$, разделив диагональные и недиагональные члены (для $i\ne j$ по [[nezavisimost-velichin|независимости]] $M(X_iX_j)=(MX)^2$):

$$M(\overline X)^2=\frac1{n^2}\Bigl(\sum_i MX_i^2+\sum_{i\ne j}MX_i MX_j\Bigr)=\frac{M(X^2)}{n}+\frac{n(n-1)}{n^2}(MX)^2=\frac{M(X^2)}{n}+\frac{n-1}{n}(MX)^2.$$

Подставляя,

$$M(\sigma_B^2)=M(X^2)-\frac{M(X^2)}{n}-\frac{n-1}{n}(MX)^2=\frac{n-1}{n}\bigl(M(X^2)-(MX)^2\bigr)=\frac{n-1}{n}DX.$$

Так как $M(\sigma_B^2)=\frac{n-1}{n}DX<DX$, оценка занижает дисперсию. Чтобы исправить, домножим на $\frac{n}{n-1}$: для [[ispravlennaya-dispersiya|$S^2=\frac{n}{n-1}\sigma_B^2$]] получаем $M(S^2)=DX$ — несмещённость. При $n\to\infty$ множитель $\frac{n-1}{n}\to 1$, поэтому смещение $-\frac{DX}{n}\to 0$: $\sigma_B^2$ асимптотически несмещённая. $\;\blacksquare$`,
			answer: String.raw`$M(\sigma_B^2)=\frac{n-1}{n}DX$; несмещённый множитель $\frac{n}{n-1}$ даёт $S^2$; смещение $-DX/n\to0$.`,
			xp: 25
		}
	],
	mastery: [
		'Объясняю, почему оценка θ̂ₙ — случайная величина, и сужу о ней по M(θ̂ₙ) и D(θ̂ₙ)',
		'Формулирую состоятельность, несмещённость, эффективность и понимаю, чем они различаются',
		'Вывожу разложение MSE = D(θ̂) + b(θ̂)² и применяю его к смещённым оценкам',
		'Доказываю несмещённость и состоятельность X̄ (через линейность M и D(X̄)=σ²/n + Чебышёв)',
		'Вывожу M(σ_B²)=((n−1)/n)·DX и объясняю исправление на n−1 через потерю степени свободы'
	]
};
