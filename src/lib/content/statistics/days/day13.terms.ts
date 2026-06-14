import type { Glossary } from '$lib/types';

// New terms introduced on day 13 (ch11): properties of estimators that day 12
// only previewed. Terms already owned canonically by other days are reused via
// [[...]] cross-links and intentionally NOT redefined here:
//   day 12  — tochechnaya-ocenka, nesmeshchennost, sostoyatelnost, vyborka,
//             vyborochnoe-srednee, vyborochnaya-dispersiya,
//             ispravlennaya-dispersiya, metod-momentov;
//   day 5   — matematicheskoe-ozhidanie, dispersiya, lineynost-ozhidaniya,
//             neravenstvo-chebysheva, zakon-bolshih-chisel,
//             sluchaynaya-velichina, nezavisimost-velichin.
export const day13Terms: Glossary = {
	effektivnost: {
		id: 'effektivnost',
		term: 'Эффективность оценки',
		short: String.raw`Среди несмещённых оценок — та, у которой наименьшая дисперсия.`,
		formula: String.raw`\sigma^2_{\widehat\theta_n}\to\min`,
		body: String.raw`Несмещённая оценка **эффективна** (в заданном классе несмещённых), если её [[dispersiya|дисперсия]] минимальна: $\sigma^2_{\widehat\theta_n}\to\min$.

Из двух [[nesmeshchennost|несмещённых]] оценок лучше та, чьи значения теснее сгруппированы вокруг $\theta$. Сравнение по одной дисперсии корректно **только** для несмещённых оценок: у [[smeshchenie|смещённой]] малая дисперсия может соседствовать с большой систематической ошибкой — тогда сравнивают по [[mse|MSE]].`,
		related: ['tochechnaya-ocenka', 'nesmeshchennost', 'dispersiya', 'mse']
	},

	smeshchenie: {
		id: 'smeshchenie',
		term: 'Смещение оценки',
		short: String.raw`Систематическая ошибка $b(\widehat\theta)=M(\widehat\theta)-\theta$.`,
		formula: String.raw`b(\widehat\theta)=M(\widehat\theta)-\theta`,
		body: String.raw`**Смещение** оценки — разность между её средним и истинным параметром: $$b(\widehat\theta)=M(\widehat\theta)-\theta.$$

Для [[nesmeshchennost|несмещённой]] оценки $b=0$. Смещение входит в [[mse|среднюю квадратическую ошибку]] квадратом: $\mathrm{MSE}=D(\widehat\theta)+b^2$. Пример: у [[vyborochnaya-dispersiya|выборочной дисперсии]] $b(\sigma_B^2)=-DX/n<0$ — она систематически занижает дисперсию.`,
		related: ['nesmeshchennost', 'mse', 'vyborochnaya-dispersiya']
	},

	mse: {
		id: 'mse',
		term: 'Средняя квадратическая ошибка (MSE)',
		short: String.raw`$\mathrm{MSE}(\widehat\theta)=M(\widehat\theta-\theta)^2=D(\widehat\theta)+b^2$.`,
		formula: String.raw`\mathrm{MSE}(\widehat\theta)=D(\widehat\theta)+\bigl(b(\widehat\theta)\bigr)^2`,
		body: String.raw`**Средняя квадратическая ошибка** оценки — среднее квадрата отклонения от параметра:

$$\mathrm{MSE}(\widehat\theta)=M\bigl(\widehat\theta-\theta\bigr)^2.$$

Ключевое разложение — **«дисперсия плюс квадрат смещения»**:

$$\mathrm{MSE}(\widehat\theta)=D(\widehat\theta)+\bigl(b(\widehat\theta)\bigr)^2.$$

Это единая мера качества: штрафует и за [[dispersiya|разброс]], и за [[smeshchenie|систематический сдвиг]]. Для [[nesmeshchennost|несмещённой]] оценки $\mathrm{MSE}=D(\widehat\theta)$, поэтому сравнение по MSE совпадает с [[effektivnost|эффективностью]].`,
		related: ['smeshchenie', 'dispersiya', 'nesmeshchennost', 'effektivnost']
	},

	'shodimost-po-veroyatnosti': {
		id: 'shodimost-po-veroyatnosti',
		term: 'Сходимость по вероятности',
		short: String.raw`$X_n\xrightarrow{P}X$: $P(|X_n-X|<\varepsilon)\to1$ для любого $\varepsilon>0$.`,
		formula: String.raw`\forall\varepsilon>0:\ P(|X_n-X|\ge\varepsilon)\to0`,
		body: String.raw`Последовательность $X_n$ **сходится по вероятности** к $X$ (пишут $X_n\xrightarrow{P}X$), если для любого $\varepsilon>0$ $$P\bigl(|X_n-X|\ge\varepsilon\bigr)\xrightarrow[n\to\infty]{}0.$$

Это режим сходимости, в котором формулируется [[sostoyatelnost|состоятельность]] оценок и [[zakon-bolshih-chisel|закон больших чисел]]: «промахи больше $\varepsilon$ становятся всё менее вероятными».`,
		related: ['sostoyatelnost', 'zakon-bolshih-chisel']
	},

	'stepeni-svobody': {
		id: 'stepeni-svobody',
		term: 'Степени свободы',
		short: String.raw`Число независимых отклонений после оценки параметров; для $S^2$ это $n-1$.`,
		body: String.raw`**Степени свободы** — число независимых величин, оставшихся после наложенных на данные ограничений. Каждый оценённый по выборке параметр «съедает» одну степень свободы.

В [[ispravlennaya-dispersiya|исправленной дисперсии]] $S^2$ отклонения $(X_i-\overline X)$ связаны одним тождеством $\sum_i(X_i-\overline X)=0$ (так как $\overline X$ оценена по тем же данным). Поэтому независимых отклонений $n-1$, и сумма квадратов делится на $n-1$. Это правило повторяется в $\chi^2$-критериях и регрессии.`,
		related: ['ispravlennaya-dispersiya', 'vyborochnaya-dispersiya']
	},

	'metod-pravdopodobiya': {
		id: 'metod-pravdopodobiya',
		term: 'Метод максимального правдоподобия',
		short: String.raw`Оценка — значение $\theta$, максимизирующее правдоподобие наблюдённой выборки.`,
		formula: String.raw`L(x,\theta)=\prod_i f(x_i,\theta)\to\max`,
		body: String.raw`**Метод максимального правдоподобия** берёт за оценку то значение $\theta$, при котором наблюдавшаяся [[vyborka|выборка]] наиболее правдоподобна. Максимизируют функцию правдоподобия $L(x,\theta)=\prod_i f(x_i,\theta)$ — обычно через её логарифм и уравнение $\partial\ell/\partial\theta=0$.

Точнее [[metod-momentov|метода моментов]], но трудоёмче. Подробно — день 14.`,
		related: ['tochechnaya-ocenka', 'metod-momentov']
	},

	butstrep: {
		id: 'butstrep',
		term: 'Бутстреп',
		short: String.raw`Оценка разброса оценки через пересэмплирование выборки с возвращением.`,
		body: String.raw`**Бутстреп** (Б. Эфрон) — вычислительный метод оценки разброса [[tochechnaya-ocenka|оценки]], когда аналитической формулы для $D(\widehat\theta_n)$ нет. Из исходной [[vyborka|выборки]] многократно ($B\approx1000$) извлекают псевдовыборки того же объёма **с возвращением**, для каждой считают оценку $\widehat\theta^*_b$, а разброс этих значений и служит оценкой точности.

Универсален: работает для медианы, коэффициента корреляции и любой оценки. Подробно — день 14.`,
		related: ['tochechnaya-ocenka', 'doveritelnyy-interval']
	},

	'doveritelnyy-interval': {
		id: 'doveritelnyy-interval',
		term: 'Доверительный интервал',
		short: String.raw`Интервал, накрывающий параметр $\theta$ с заданной вероятностью.`,
		body: String.raw`**Доверительный интервал** — интервал $(\,\underline\theta,\ \overline\theta\,)$, построенный по [[vyborka|выборке]] так, чтобы он накрывал истинный параметр $\theta$ с заданной вероятностью (например, $0{,}95$).

В отличие от [[tochechnaya-ocenka|точечной оценки]], даёт не одно число, а диапазон — с явной мерой надёжности. Подробно — день 15.`,
		related: ['tochechnaya-ocenka', 'butstrep']
	}
};
