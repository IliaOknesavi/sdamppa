import type { Glossary } from '$lib/types';

// Новые термины дня 14 (ch11): точечное оценивание, метод моментов, ММП,
// бутстреп. Ссылаются на базовые термины дней 1 и 5 по их id.
export const day14Terms: Glossary = {
	'tochechnaya-ocenka': {
		id: 'tochechnaya-ocenka',
		term: 'Точечная оценка',
		short: String.raw`Функция выборки $\widehat\theta_n(x_1,\dots,x_n)$, приближающая параметр $\theta$.`,
		formula: String.raw`\widehat\theta_n=\widehat\theta_n(x_1,\dots,x_n)`,
		body: String.raw`**Точечная оценка** параметра $\theta$ — функция выборки $\widehat\theta_n(x_1,\dots,x_n)$, значение которой берут за приближение $\theta$. Поскольку она зависит от случайных наблюдений, сама является [[sluchaynaya-velichina|случайной величиной]], и её качество описывают через [[sostoyatelnost|состоятельность]], [[nesmeshchennost|несмещённость]] и [[effektivnost-ocenki|эффективность]].

Строят оценки [[metod-momentov|методом моментов]] или [[metod-pravdopodobiya|максимального правдоподобия]].`,
		related: ['sostoyatelnost', 'nesmeshchennost', 'effektivnost-ocenki', 'metod-momentov', 'metod-pravdopodobiya']
	},

	sostoyatelnost: {
		id: 'sostoyatelnost',
		term: 'Состоятельность оценки',
		short: String.raw`$\widehat\theta_n\xrightarrow{P}\theta$: с ростом $n$ оценка сходится к параметру.`,
		formula: String.raw`P(\lvert\widehat\theta_n-\theta\rvert<\varepsilon)\to1`,
		body: String.raw`Оценка [[tochechnaya-ocenka|$\widehat\theta_n$]] **состоятельна**, если она сходится по вероятности к $\theta$: для любого $\varepsilon>0$ $$P(\lvert\widehat\theta_n-\theta\rvert<\varepsilon)\xrightarrow[n\to\infty]{}1.$$ Чем больше данных, тем точнее оценка. Это минимальное разумное требование: несостоятельную оценку использовать бессмысленно. Доказывается обычно через [[neravenstvo-chebysheva|неравенство Чебышёва]].`,
		related: ['tochechnaya-ocenka', 'nesmeshchennost', 'neravenstvo-chebysheva']
	},

	nesmeshchennost: {
		id: 'nesmeshchennost',
		term: 'Несмещённость оценки',
		short: String.raw`$M(\widehat\theta_n)=\theta$ — нет систематической ошибки.`,
		formula: String.raw`M(\widehat\theta_n)=\theta`,
		body: String.raw`Оценка [[tochechnaya-ocenka|$\widehat\theta_n$]] **несмещённая**, если её [[matematicheskoe-ozhidanie|математическое ожидание]] равно параметру: $M(\widehat\theta_n)=\theta$. «В среднем» по всем выборкам оценка попадает в $\theta$, не завышая и не занижая. Если равенства нет, разность $b=M(\widehat\theta_n)-\theta$ называют [[smeshchenie|смещением]].

Пример: $\bar X$ — несмещённая оценка $MX$, а выборочная дисперсия $\sigma_B^2$ — смещённая (нужна [[ispravlennaya-dispersiya|исправленная]] $S^2$).`,
		related: ['tochechnaya-ocenka', 'smeshchenie', 'ispravlennaya-dispersiya']
	},

	smeshchenie: {
		id: 'smeshchenie',
		term: 'Смещение оценки',
		short: String.raw`$b(\widehat\theta)=M(\widehat\theta)-\theta$ — систематическая ошибка.`,
		formula: String.raw`b(\widehat\theta)=M(\widehat\theta)-\theta`,
		body: String.raw`**Смещение** оценки — разность между её средним и истинным параметром: $b(\widehat\theta)=M(\widehat\theta)-\theta$. Для [[nesmeshchennost|несмещённой]] оценки $b=0$. Если $b\to0$ при $n\to\infty$, оценку называют **асимптотически несмещённой**.

Смещение входит в [[srednekvadratichnaya-oshibka|MSE]] квадратом: $MSE=D(\widehat\theta)+b^2$.`,
		related: ['nesmeshchennost', 'srednekvadratichnaya-oshibka']
	},

	'effektivnost-ocenki': {
		id: 'effektivnost-ocenki',
		term: 'Эффективность оценки',
		short: String.raw`Несмещённая оценка с наименьшей дисперсией.`,
		formula: String.raw`D(\widehat\theta_n)\to\min`,
		body: String.raw`Среди [[nesmeshchennost|несмещённых]] оценок **эффективна** та, у которой наименьшая [[dispersiya|дисперсия]]: её значения теснее сгруппированы вокруг $\theta$. Сравнение по дисперсии корректно только в классе несмещённых оценок — иначе нужна [[srednekvadratichnaya-oshibka|среднеквадратичная ошибка]], учитывающая и [[smeshchenie|смещение]].`,
		related: ['nesmeshchennost', 'dispersiya', 'srednekvadratichnaya-oshibka']
	},

	'srednekvadratichnaya-oshibka': {
		id: 'srednekvadratichnaya-oshibka',
		term: 'Среднеквадратичная ошибка (MSE)',
		short: String.raw`$MSE=M(\widehat\theta-\theta)^2=D(\widehat\theta)+b^2$.`,
		formula: String.raw`MSE(\widehat\theta)=D(\widehat\theta)+b^2(\widehat\theta)`,
		body: String.raw`**Среднеквадратичная ошибка** (mean squared error) — средний квадрат отклонения оценки от параметра: $MSE(\widehat\theta)=M(\widehat\theta-\theta)^2$. Раскладывается на два слагаемых: $$MSE(\widehat\theta)=\underbrace{D(\widehat\theta)}_{\text{разброс}}+\underbrace{b^2(\widehat\theta)}_{\text{смещение}^2}.$$ Единая мера точности, учитывающая и [[dispersiya|дисперсию]], и [[smeshchenie|смещение]]. Для несмещённой оценки $MSE=D(\widehat\theta)$. В ML это bias-variance tradeoff.`,
		related: ['dispersiya', 'smeshchenie', 'effektivnost-ocenki']
	},

	'ispravlennaya-dispersiya': {
		id: 'ispravlennaya-dispersiya',
		term: 'Исправленная дисперсия',
		short: String.raw`$S^2=\frac{1}{n-1}\sum_i(x_i-\bar X)^2$ — несмещённая оценка $DX$.`,
		formula: String.raw`S^2=\frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar X)^2`,
		body: String.raw`Выборочная дисперсия $\sigma_B^2=\frac1n\sum_i(x_i-\bar X)^2$ систематически занижает $DX$: $M(\sigma_B^2)=\frac{n-1}{n}DX$ — она [[smeshchenie|смещённая]]. Домножив на $\frac{n}{n-1}$, получают **исправленную дисперсию** $$S^2=\frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar X)^2,$$ для которой $M(S^2)=DX$ — [[nesmeshchennost|несмещённая]] оценка. При малых $n$ используют именно $S^2$.`,
		related: ['dispersiya', 'nesmeshchennost', 'smeshchenie']
	},

	'metod-momentov': {
		id: 'metod-momentov',
		term: 'Метод моментов',
		short: String.raw`Приравнять теоретические моменты к выборочным и решить относительно $\theta$.`,
		formula: String.raw`\alpha_k=\widehat\alpha_k,\quad \widehat\alpha_k=\frac1n\sum_i x_i^k`,
		body: String.raw`**Метод моментов** строит оценку, приравнивая теоретические [[momenty|моменты]] $\alpha_k=MX^k$ (выраженные через $\theta$) к выборочным $\widehat\alpha_k=\frac1n\sum_i x_i^k$. Для одного параметра достаточно первого: $MX=\bar X$.

Прост и обычно даёт [[sostoyatelnost|состоятельные]] оценки, но они не единственны (зависят от выбора моментов) и, как правило, не [[effektivnost-ocenki|эффективны]]. Для Пуассона: $\widehat\lambda=\bar X$.`,
		related: ['momenty', 'metod-pravdopodobiya', 'tochechnaya-ocenka', 'sostoyatelnost']
	},

	'metod-pravdopodobiya': {
		id: 'metod-pravdopodobiya',
		term: 'Метод максимального правдоподобия',
		short: String.raw`Берём $\theta$, при котором наблюдённая выборка наиболее правдоподобна.`,
		formula: String.raw`\widehat\theta=\arg\max_\theta L(x,\theta)`,
		body: String.raw`**Метод максимального правдоподобия** (ММП) выбирает то $\theta$, при котором наблюдавшаяся выборка наиболее вероятна, то есть максимизирует [[funkciya-pravdopodobiya|функцию правдоподобия]] $L(x,\theta)$. Практически переходят к [[logarifmicheskaya-funkciya-pravdopodobiya|логарифму]] и решают [[uravnenie-pravdopodobiya|уравнение правдоподобия]] $\partial\ell/\partial\theta=0$.

Точнее [[metod-momentov|метода моментов]], но трудоёмче. В ML это обучение моделей: cross-entropy и MSE-лоссы — частные случаи ММП.`,
		related: ['funkciya-pravdopodobiya', 'logarifmicheskaya-funkciya-pravdopodobiya', 'uravnenie-pravdopodobiya', 'metod-momentov']
	},

	'funkciya-pravdopodobiya': {
		id: 'funkciya-pravdopodobiya',
		term: 'Функция правдоподобия',
		short: String.raw`$L(x,\theta)=\prod_i f(x_i,\theta)$ как функция параметра.`,
		formula: String.raw`L(x,\theta)=\prod_{i=1}^{n}f(x_i,\theta)`,
		body: String.raw`**Функция правдоподобия** — совместная плотность (или вероятность) выборки, рассматриваемая как функция параметра $\theta$ при фиксированных наблюдениях: $$L(x,\theta)=\prod_{i=1}^{n}f(x_i,\theta).$$ Для независимых наблюдений это произведение. [[metod-pravdopodobiya|Оценка ММП]] — точка её максимума; искать её удобнее через [[logarifmicheskaya-funkciya-pravdopodobiya|логарифм]].`,
		related: ['metod-pravdopodobiya', 'logarifmicheskaya-funkciya-pravdopodobiya', 'nezavisimost-velichin']
	},

	'logarifmicheskaya-funkciya-pravdopodobiya': {
		id: 'logarifmicheskaya-funkciya-pravdopodobiya',
		term: 'Логарифмическая функция правдоподобия',
		short: String.raw`$\ell=\ln L=\sum_i\ln f(x_i,\theta)$ — сумма вместо произведения.`,
		formula: String.raw`\ell(x,\theta)=\sum_{i=1}^{n}\ln f(x_i,\theta)`,
		body: String.raw`Логарифм [[funkciya-pravdopodobiya|функции правдоподобия]]: $\ell=\ln L=\sum_i\ln f(x_i,\theta)$. Так как $\ln$ монотонен, точка максимума $\ell$ совпадает с точкой максимума $L$, но с **суммой** работать проще, чем с произведением. Максимум ищут из [[uravnenie-pravdopodobiya|уравнения правдоподобия]] $\partial\ell/\partial\theta=0$.`,
		related: ['funkciya-pravdopodobiya', 'uravnenie-pravdopodobiya', 'metod-pravdopodobiya']
	},

	'uravnenie-pravdopodobiya': {
		id: 'uravnenie-pravdopodobiya',
		term: 'Уравнение правдоподобия',
		short: String.raw`$\partial\ell/\partial\theta=0$ — условие максимума правдоподобия.`,
		formula: String.raw`\frac{\partial\ell}{\partial\theta}=0`,
		body: String.raw`**Уравнение правдоподобия** — необходимое условие максимума [[logarifmicheskaya-funkciya-pravdopodobiya|лог-правдоподобия]]: $\partial\ell/\partial\theta=0$. Его корень и есть [[metod-pravdopodobiya|ММП-оценка]] $\widehat\theta$; чтобы убедиться, что это максимум, проверяют $\ell''<0$. В машинном обучении это уравнение решают численно — градиентным спуском.`,
		related: ['logarifmicheskaya-funkciya-pravdopodobiya', 'metod-pravdopodobiya']
	},

	butstrep: {
		id: 'butstrep',
		term: 'Бутстреп',
		short: String.raw`Оценка разброса оценки через многократную перевыборку с возвращением.`,
		body: String.raw`**Бутстреп** (Б. Эфрон) — вычислительный метод оценки точности оценки [[tochechnaya-ocenka|$\widehat\theta_n$]], когда аналитической формулы для $D(\widehat\theta_n)$ нет (медиана, корреляция и т.д.). Идея: раз истинное распределение неизвестно, «размножаем» имеющуюся выборку, многократно извлекая [[butstrep-vyborka|бутстреп-выборки]] и пересчитывая оценку.

Разброс полученных значений даёт [[butstrep-ocenka-dispersii|бутстреп-оценку дисперсии]]. Прямой потомок бутстрепа в ML — бэггинг и случайный лес.`,
		related: ['butstrep-vyborka', 'butstrep-ocenka-dispersii', 'empiricheskaya-funkciya-raspredeleniya', 'tochechnaya-ocenka']
	},

	'butstrep-vyborka': {
		id: 'butstrep-vyborka',
		term: 'Бутстреп-выборка',
		short: String.raw`Выборка объёма $n$ из исходной с возвращением (вероятность $1/n$).`,
		formula: String.raw`x_1^{*},\dots,x_n^{*}`,
		body: String.raw`**Бутстреп-выборка** $x_1^*,\dots,x_n^*$ — выборка того же объёма $n$, полученная случайным извлечением из исходной **с возвращением** (каждый элемент с вероятностью $1/n$). Одни значения попадут несколько раз, другие — ни разу. Это равносильно выборке из [[empiricheskaya-funkciya-raspredeleniya|эмпирической функции распределения]].`,
		related: ['butstrep', 'empiricheskaya-funkciya-raspredeleniya', 'butstrep-ocenka-dispersii']
	},

	'butstrep-ocenka-dispersii': {
		id: 'butstrep-ocenka-dispersii',
		term: 'Бутстреп-оценка дисперсии',
		short: String.raw`Выборочная дисперсия бутстреп-значений $\widehat\theta^{*}_b$.`,
		formula: String.raw`\widehat D_{\text{boot}}=\frac{1}{B-1}\sum_{b=1}^{B}(\widehat\theta^{*}_b-\overline{\widehat\theta^{*}})^2`,
		body: String.raw`По $B$ [[butstrep-vyborka|бутстреп-выборкам]] считают значения оценки $\widehat\theta^*_1,\dots,\widehat\theta^*_B$. Их выборочная [[dispersiya|дисперсия]] $$\widehat D_{\text{boot}}=\frac{1}{B-1}\sum_{b=1}^{B}(\widehat\theta^*_b-\overline{\widehat\theta^*})^2$$ и есть **бутстреп-оценка дисперсии** исходной оценки, а $\sqrt{\widehat D_{\text{boot}}}$ — бутстреп-оценка [[standartnaya-oshibka|стандартной ошибки]]. Берут $B\approx1000$.`,
		related: ['butstrep', 'butstrep-vyborka', 'standartnaya-oshibka', 'dispersiya']
	},

	'standartnaya-oshibka': {
		id: 'standartnaya-oshibka',
		term: 'Стандартная ошибка',
		short: String.raw`СКО оценки: $\text{SE}(\widehat\theta)=\sqrt{D(\widehat\theta)}$.`,
		formula: String.raw`\text{SE}(\widehat\theta)=\sqrt{D(\widehat\theta)}`,
		body: String.raw`**Стандартная ошибка** оценки — корень из её [[dispersiya|дисперсии]]: $\text{SE}(\widehat\theta)=\sqrt{D(\widehat\theta)}$. Показывает типичный разброс оценки от выборки к выборке. Для среднего $\text{SE}(\bar X)=\sigma/\sqrt n$. Когда формулы нет, её получают [[butstrep|бутстрепом]].`,
		related: ['dispersiya', 'butstrep', 'butstrep-ocenka-dispersii']
	},

	'empiricheskaya-funkciya-raspredeleniya': {
		id: 'empiricheskaya-funkciya-raspredeleniya',
		term: 'Эмпирическая функция распределения',
		short: String.raw`Доля наблюдений, не превосходящих $x$.`,
		formula: String.raw`\widehat F_n(x)=\frac1n\#\{i:\ x_i\le x\}`,
		body: String.raw`**Эмпирическая функция распределения** $\widehat F_n(x)$ — доля наблюдений выборки, не превосходящих $x$: $$\widehat F_n(x)=\frac1n\#\{i:\ x_i\le x\}.$$ Это выборочный аналог истинной функции распределения; при больших $n$ $\widehat F_n\approx F$. [[butstrep|Бутстреп]] заменяет неизвестное $F$ на $\widehat F_n$, а [[butstrep-vyborka|бутстреп-выборка]] — это выборка из $\widehat F_n$.`,
		related: ['butstrep', 'butstrep-vyborka']
	}
};
