import type { Glossary } from '$lib/types';

// New terms introduced on day 12 (ch10): sample numerical characteristics.
// First authored day of the matstat phase, so foundational sampling terms
// (выборка, генеральная совокупность, точечная оценка) live here. Reuses the
// random-variable graph from day05.terms.ts (matematicheskoe-ozhidanie,
// dispersiya, momenty, ...) via [[id]] links.
export const day12Terms: Glossary = {
	'generalnaya-sovokupnost': {
		id: 'generalnaya-sovokupnost',
		term: 'Генеральная совокупность',
		short: String.raw`Все мыслимые наблюдения изучаемого признака; её закон неизвестен.`,
		body: String.raw`**Генеральная совокупность** — множество всех мыслимых значений изучаемого признака (часто бесконечное или недоступное целиком). Её распределение и [[chislovye-harakteristiki|числовые характеристики]] ($MX$, $DX$, …) **неизвестны** — именно их и оценивают по [[vyborka|выборке]]. В части 1 курса распределение считалось известным; в статистике всё наоборот.`,
		related: ['vyborka', 'tochechnaya-ocenka', 'chislovye-harakteristiki']
	},

	vyborka: {
		id: 'vyborka',
		term: 'Выборка',
		short: String.raw`Конечный набор наблюдений $x_1,\dots,x_n$ из генеральной совокупности.`,
		formula: String.raw`x_1,x_2,\dots,x_n,\qquad n=\text{объём}`,
		body: String.raw`**Выборка** $x_1,\dots,x_n$ — конечный набор наблюдений, извлечённых из [[generalnaya-sovokupnost|генеральной совокупности]]; $n$ — её **объём**. По выборке вычисляют выборочные характеристики ([[vyborochnoe-srednee|среднее]], [[vyborochnaya-dispersiya|дисперсию]], моменты), которые служат [[tochechnaya-ocenka|оценками]] неизвестных характеристик совокупности. Если наблюдения мыслить как независимые одинаково распределённые [[sluchaynaya-velichina|случайные величины]], выборочные характеристики сами становятся случайными — отсюда понятия несмещённости и состоятельности.`,
		related: ['generalnaya-sovokupnost', 'vyborochnoe-srednee', 'tochechnaya-ocenka']
	},

	'vyborochnoe-srednee': {
		id: 'vyborochnoe-srednee',
		term: 'Выборочное среднее',
		short: String.raw`Среднее арифметическое выборки: $\bar X_B=\frac1n\sum_i x_i$.`,
		formula: String.raw`\bar X_B=\frac1n\sum_{i=1}^{n} x_i`,
		body: String.raw`**Выборочное среднее** — среднее арифметическое наблюдений [[vyborka|выборки]]: $$\bar X_B=\frac1n\sum_{i=1}^{n} x_i$$ (для сгруппированных данных $\bar X_B=\frac1n\sum_i x_i n_i$). Это [[tochechnaya-ocenka|точечная оценка]] [[matematicheskoe-ozhidanie|математического ожидания]] $MX$. Как случайная величина оно [[nesmeshchennost|несмещённо]] ($M\bar X_B=a$) и [[sostoyatelnost|состоятельно]], причём $D(\bar X_B)=\sigma^2/n$. Совпадает с начальным выборочным [[nachalnyy-vyborochnyy-moment|моментом]] первого порядка: $\bar X_B=\widehat\alpha_1$.`,
		related: ['vyborka', 'matematicheskoe-ozhidanie', 'nesmeshchennost', 'sostoyatelnost', 'nachalnyy-vyborochnyy-moment']
	},

	'nachalnyy-vyborochnyy-moment': {
		id: 'nachalnyy-vyborochnyy-moment',
		term: 'Начальный выборочный момент',
		short: String.raw`Среднее $k$-х степеней наблюдений: $\widehat\alpha_k=\frac1n\sum_i x_i^k$.`,
		formula: String.raw`\widehat\alpha_k=\frac1n\sum_{i=1}^{n} x_i^{\,k}`,
		body: String.raw`**Начальный выборочный момент** порядка $k$ — среднее $k$-х степеней наблюдений: $$\widehat\alpha_k=\frac1n\sum_{i=1}^{n} x_i^{\,k}.$$ Оценивает теоретический начальный [[momenty|момент]] $\alpha_k=MX^k$. Частный случай $\widehat\alpha_1=\bar X_B$ — [[vyborochnoe-srednee|выборочное среднее]]. Равенство $\alpha_k=\widehat\alpha_k$ лежит в основе [[metod-momentov|метода моментов]].`,
		related: ['vyborochnoe-srednee', 'momenty', 'centralnyy-vyborochnyy-moment', 'metod-momentov']
	},

	'centralnyy-vyborochnyy-moment': {
		id: 'centralnyy-vyborochnyy-moment',
		term: 'Центральный выборочный момент',
		short: String.raw`Среднее $k$-х степеней отклонений от $\bar X_B$: $\widehat\mu_k=\frac1n\sum_i(x_i-\bar X_B)^k$.`,
		formula: String.raw`\widehat\mu_k=\frac1n\sum_{i=1}^{n}(x_i-\bar X_B)^{k}`,
		body: String.raw`**Центральный выборочный момент** порядка $k$ берётся от отклонений наблюдений от [[vyborochnoe-srednee|выборочного среднего]]: $$\widehat\mu_k=\frac1n\sum_{i=1}^{n}(x_i-\bar X_B)^{k}.$$ Оценивает теоретический центральный [[momenty|момент]] $\mu_k=M(X-MX)^k$. Всегда $\widehat\mu_1=0$ (сумма отклонений от среднего равна нулю), а $\widehat\mu_2=\sigma_B^2$ — [[vyborochnaya-dispersiya|выборочная дисперсия]]. Связь с начальными: $\widehat\mu_2=\widehat\alpha_2-\widehat\alpha_1^{\,2}$.`,
		related: ['nachalnyy-vyborochnyy-moment', 'vyborochnaya-dispersiya', 'momenty']
	},

	'vyborochnaya-dispersiya': {
		id: 'vyborochnaya-dispersiya',
		term: 'Выборочная дисперсия',
		short: String.raw`Разброс вокруг $\bar X_B$ с делителем $n$: $\sigma_B^2=\frac1n\sum_i(x_i-\bar X_B)^2$. Смещена.`,
		formula: String.raw`\sigma_B^2=\frac1n\sum_{i=1}^{n}(x_i-\bar X_B)^2`,
		body: String.raw`**Выборочная дисперсия** — центральный выборочный [[centralnyy-vyborochnyy-moment|момент]] второго порядка, мера разброса наблюдений вокруг [[vyborochnoe-srednee|выборочного среднего]]: $$\sigma_B^2=\frac1n\sum_{i=1}^{n}(x_i-\bar X_B)^2=\widehat\alpha_2-\bar X_B^{\,2}.$$ Оценивает [[dispersiya|дисперсию]] $DX=\sigma^2$, но с делителем $n$ она **[[nesmeshchennost|смещена]]**: $M(\sigma_B^2)=\frac{n-1}{n}\sigma^2<\sigma^2$. Чтобы убрать смещение, берут [[ispravlennaya-dispersiya|исправленную дисперсию]] $S^2$.`,
		related: ['ispravlennaya-dispersiya', 'dispersiya', 'centralnyy-vyborochnyy-moment', 'nesmeshchennost']
	},

	'ispravlennaya-dispersiya': {
		id: 'ispravlennaya-dispersiya',
		term: 'Исправленная дисперсия',
		short: String.raw`Несмещённая оценка дисперсии с делителем $n-1$: $S^2=\frac1{n-1}\sum_i(x_i-\bar X_B)^2$.`,
		formula: String.raw`S^2=\frac1{n-1}\sum_{i=1}^{n}(x_i-\bar X_B)^2`,
		body: String.raw`**Исправленная (несмещённая) выборочная дисперсия** — та же сумма квадратов отклонений, но с делителем $n-1$: $$S^2=\frac1{n-1}\sum_{i=1}^{n}(x_i-\bar X_B)^2=\frac{n}{n-1}\,\sigma_B^2.$$ Делитель $n-1$ компенсирует «потерю степени свободы» из-за того, что отклонения считаются от оценки $\bar X_B$, а не от истинного центра; благодаря этому $S^2$ [[nesmeshchennost|несмещённа]]: $M(S^2)=\sigma^2$. При больших $n$ почти совпадает с [[vyborochnaya-dispersiya|$\sigma_B^2$]] ($\frac{n}{n-1}\to1$).`,
		related: ['vyborochnaya-dispersiya', 'dispersiya', 'nesmeshchennost']
	},

	'vyborochnaya-moda-mediana': {
		id: 'vyborochnaya-moda-mediana',
		term: 'Выборочные мода и медиана',
		short: String.raw`Мода — самое частое значение; медиана делит упорядоченный ряд пополам.`,
		formula: String.raw`\mathrm{Med}\,X=x_0+h\cdot\frac{n/2-n_{me-1}}{n_{me}}`,
		body: String.raw`**Выборочная мода** $\mathrm{Mo}\,X$ — наиболее частое значение выборки. **Выборочная медиана** $\mathrm{Med}\,X$ делит упорядоченный вариационный ряд пополам: при нечётном $n$ — средний элемент, при чётном — полусумма двух средних. Для интервального ряда применяют интерполяционную формулу $$\mathrm{Med}\,X=x_0+h\cdot\frac{n/2-n_{me-1}}{n_{me}},$$ где $x_0,h$ — нижняя граница и ширина медианного интервала, $n_{me-1}$ — накопленная частота до него, $n_{me}$ — его частота. Это выборочные аналоги теоретических [[moda|моды]] и [[mediana|медианы]].`,
		related: ['moda', 'mediana', 'vyborochnoe-srednee']
	},

	'tochechnaya-ocenka': {
		id: 'tochechnaya-ocenka',
		term: 'Точечная оценка',
		short: String.raw`Одно число, приближающее неизвестную характеристику по выборке.`,
		formula: String.raw`\hat\theta=\hat\theta(x_1,\dots,x_n)\approx\theta`,
		body: String.raw`**Точечная оценка** $\hat\theta$ — функция [[vyborka|выборки]], дающая одно число в качестве приближения неизвестного параметра $\theta$ [[generalnaya-sovokupnost|генеральной совокупности]]. Примеры: [[vyborochnoe-srednee|$\bar X_B$]] оценивает $MX$, [[ispravlennaya-dispersiya|$S^2$]] оценивает $DX$. Качество оценки описывают свойства [[nesmeshchennost|несмещённости]], [[sostoyatelnost|состоятельности]] и эффективности (подробно — день 13).`,
		related: ['vyborka', 'nesmeshchennost', 'sostoyatelnost', 'vyborochnoe-srednee']
	},

	nesmeshchennost: {
		id: 'nesmeshchennost',
		term: 'Несмещённость',
		short: String.raw`Оценка в среднем равна параметру: $M\hat\theta=\theta$ (нет систематической ошибки).`,
		formula: String.raw`M\hat\theta=\theta`,
		body: String.raw`Оценка $\hat\theta$ **несмещённа**, если её математическое ожидание равно оцениваемому параметру при любом объёме выборки: $$M\hat\theta=\theta.$$ Это означает отсутствие **систематической** ошибки — оценка не «промахивается в среднем» в одну сторону. Так, [[vyborochnoe-srednee|$\bar X_B$]] несмещённа ($M\bar X_B=a$), [[ispravlennaya-dispersiya|$S^2$]] несмещённа ($MS^2=\sigma^2$), а [[vyborochnaya-dispersiya|$\sigma_B^2$]] **смещена** ($M\sigma_B^2=\frac{n-1}{n}\sigma^2$). Несмещённость не гарантирует близости к $\theta$ на одной выборке — для этого нужна [[sostoyatelnost|состоятельность]].`,
		related: ['tochechnaya-ocenka', 'sostoyatelnost', 'ispravlennaya-dispersiya']
	},

	sostoyatelnost: {
		id: 'sostoyatelnost',
		term: 'Состоятельность',
		short: String.raw`Оценка концентрируется у параметра с ростом n: $\hat\theta\xrightarrow{P}\theta$.`,
		formula: String.raw`\hat\theta_n \xrightarrow{P}\theta`,
		body: String.raw`Оценка **состоятельна**, если при росте объёма выборки она сходится по вероятности к оцениваемому параметру: $$\hat\theta_n\xrightarrow{P}\theta\quad(n\to\infty).$$ Достаточное условие: несмещённость (или асимптотическая несмещённость) **плюс** убывание дисперсии $D\hat\theta_n\to0$ — тогда [[neravenstvo-chebysheva|неравенство Чебышёва]] даёт сходимость. Для [[vyborochnoe-srednee|$\bar X_B$]] это так, ведь $D(\bar X_B)=\sigma^2/n\to0$ — частный случай [[zakon-bolshih-chisel|закона больших чисел]]. В отличие от [[nesmeshchennost|несмещённости]], состоятельность — свойство **асимптотическое**.`,
		related: ['tochechnaya-ocenka', 'nesmeshchennost', 'neravenstvo-chebysheva', 'zakon-bolshih-chisel']
	},

	'metod-momentov': {
		id: 'metod-momentov',
		term: 'Метод моментов',
		short: String.raw`Оценка параметра из равенства теоретических и выборочных моментов.`,
		formula: String.raw`\alpha_k(\theta)=\widehat\alpha_k\ \Rightarrow\ \hat\theta`,
		body: String.raw`**Метод моментов** оценивает параметры распределения, приравнивая теоретические [[momenty|моменты]] (выраженные через параметры) к [[nachalnyy-vyborochnyy-moment|выборочным]]: $\alpha_k(\theta)=\widehat\alpha_k$. Для одного параметра достаточно первого момента. *Пример:* у распределения Пуассона $MX=\lambda$, поэтому $\lambda=\alpha_1=\widehat\alpha_1=\bar X_B$, откуда $\hat\lambda=\bar X_B$. Метод прост и даёт [[sostoyatelnost|состоятельные]] оценки; подробно — день 14.`,
		related: ['nachalnyy-vyborochnyy-moment', 'momenty', 'tochechnaya-ocenka', 'sostoyatelnost']
	}
};
