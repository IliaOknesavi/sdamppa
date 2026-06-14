import type { Glossary } from '$lib/types';

// New terms introduced on day 5 (ch05): numerical characteristics of a random
// variable + Markov/Chebyshev inequalities. Extends the base graph from
// glossary.ts; cross-linked via [[id]] inside bodies and `related`.
export const day05Terms: Glossary = {
	'chislovye-harakteristiki': {
		id: 'chislovye-harakteristiki',
		term: 'Числовые характеристики',
		short: String.raw`Несколько чисел, описывающих центр, разброс и форму распределения.`,
		body: String.raw`**Числовые характеристики** — это компактное описание [[sluchaynaya-velichina|случайной величины]] несколькими числами вместо всего распределения:

- **центр:** [[matematicheskoe-ozhidanie|математическое ожидание]], [[moda|мода]], [[mediana|медиана]];
- **разброс:** [[dispersiya|дисперсия]] и [[sko|СКО]];
- **форма:** [[koefficient-asimmetrii|асимметрия]] и [[ekscess|эксцесс]] через [[momenty|моменты]].`,
		related: ['matematicheskoe-ozhidanie', 'dispersiya', 'momenty', 'sluchaynaya-velichina']
	},

	'matematicheskoe-ozhidanie': {
		id: 'matematicheskoe-ozhidanie',
		term: 'Математическое ожидание',
		short: String.raw`Среднее значение, взвешенное по вероятностям: $MX=\sum_i x_i p_i$.`,
		formula: String.raw`MX=\sum_{i} x_i\,p_i`,
		body: String.raw`**Математическое ожидание** дискретной [[sluchaynaya-velichina|случайной величины]] — сумма произведений значений на их вероятности: $$MX=\sum_{i} x_i\,p_i.$$ Это «центр тяжести» распределения на числовой оси. Оператор $M$ [[lineynost-ozhidaniya|линеен]]: $M(aX+bY+c)=a\,MX+b\,MY+c$.

Для счётного числа значений требует абсолютной сходимости ряда $\sum_i x_i p_i$.`,
		related: ['lineynost-ozhidaniya', 'dispersiya', 'moda', 'mediana', 'chislovye-harakteristiki']
	},

	'lineynost-ozhidaniya': {
		id: 'lineynost-ozhidaniya',
		term: 'Линейность математического ожидания',
		short: String.raw`$M(aX+bY+c)=a\,MX+b\,MY+c$ — без предположения о независимости.`,
		formula: String.raw`M(aX+bY+c)=a\,MX+b\,MY+c`,
		body: String.raw`Оператор [[matematicheskoe-ozhidanie|математического ожидания]] **линеен**: для постоянных $a,b,c$ $$M(aX+bY+c)=a\,MX+b\,MY+c.$$ Складывается из трёх свойств: $MC=C$, $M(CX)=C\,MX$ и $M(X+Y)=MX+MY$. Последнее верно **без** предположения о независимости — это и делает линейность таким мощным инструментом.`,
		related: ['matematicheskoe-ozhidanie', 'nezavisimost-velichin']
	},

	'nezavisimost-velichin': {
		id: 'nezavisimost-velichin',
		term: 'Независимость случайных величин',
		short: String.raw`Совместные вероятности факторизуются: $p_{ij}=p_i\,p_j$.`,
		formula: String.raw`P(X=x_i,\ Y=y_j)=p_i\,p_j`,
		body: String.raw`Дискретные [[sluchaynaya-velichina|случайные величины]] $X$ и $Y$ **независимы**, если совместные вероятности распадаются в произведение: $$P(X=x_i,\ Y=y_j)=P(X=x_i)\,P(Y=y_j).$$ Тогда $M(XY)=MX\cdot MY$ и [[dispersiya|дисперсия]] суммы складывается: $D(X+Y)=DX+DY$.`,
		related: ['matematicheskoe-ozhidanie', 'dispersiya']
	},

	dispersiya: {
		id: 'dispersiya',
		term: 'Дисперсия',
		short: String.raw`Средний квадрат отклонения от центра: $DX=M(X-MX)^2$.`,
		formula: String.raw`DX=M(X-MX)^2`,
		body: String.raw`**Дисперсия** — мера разброса значений [[sluchaynaya-velichina|случайной величины]] вокруг [[matematicheskoe-ozhidanie|математического ожидания]]: $$DX=M(X-MX)^2\ \ge 0.$$ Удобная для расчётов **вычислительная формула:** $$DX=M(X^2)-(MX)^2.$$ Измеряется в квадрате единиц величины; чтобы вернуться к исходным единицам, берут [[sko|СКО]] $\sigma=\sqrt{DX}$.`,
		related: ['sko', 'matematicheskoe-ozhidanie', 'momenty', 'neravenstvo-chebysheva']
	},

	sko: {
		id: 'sko',
		term: 'Среднеквадратическое отклонение',
		short: String.raw`Корень из дисперсии: $\sigma=\sqrt{DX}$, в единицах самой величины.`,
		formula: String.raw`\sigma_x=\sqrt{DX}`,
		body: String.raw`**Среднеквадратическое отклонение** (СКО) $\sigma_x=\sqrt{DX}$ — неотрицательный корень из [[dispersiya|дисперсии]]. В отличие от дисперсии, измеряется в тех же единицах, что и сама [[sluchaynaya-velichina|величина]], поэтому удобно для интерпретации «типичного» масштаба отклонений. Как параметр распределения дисперсию обозначают $\sigma^2$.`,
		related: ['dispersiya', 'neravenstvo-chebysheva']
	},

	moda: {
		id: 'moda',
		term: 'Мода',
		short: String.raw`Значение с наибольшей вероятностью.`,
		formula: String.raw`\mathrm{Mo}\,X=\arg\max_i p_i`,
		body: String.raw`**Мода** $\mathrm{Mo}\,X$ — значение [[sluchaynaya-velichina|случайной величины]] с наибольшей вероятностью. Если максимум достигается на нескольких значениях, распределение **полимодально**; иначе — унимодально. В отличие от [[matematicheskoe-ozhidanie|среднего]], мода всегда совпадает с одним из реально принимаемых значений.`,
		related: ['mediana', 'matematicheskoe-ozhidanie']
	},

	mediana: {
		id: 'mediana',
		term: 'Медиана',
		short: String.raw`Число $m$, делящее распределение пополам: $P(X<m)=P(X\ge m)=\tfrac12$.`,
		formula: String.raw`P(X<m)=P(X\ge m)=\tfrac12`,
		body: String.raw`**Медиана** $\mathrm{Med}\,X$ делит распределение пополам. Её ключевое свойство: она **минимизирует среднее абсолютное отклонение** $M\lvert X-a\rvert$ (тогда как [[matematicheskoe-ozhidanie|среднее]] минимизирует средний квадрат $M(X-a)^2$). Поэтому медиана **робастна** — почти не реагирует на редкие выбросы, и в анализе данных её часто предпочитают среднему.`,
		related: ['moda', 'matematicheskoe-ozhidanie']
	},

	momenty: {
		id: 'momenty',
		term: 'Моменты',
		short: String.raw`Начальные $\alpha_k=MX^k$ и центральные $\mu_k=M(X-MX)^k$.`,
		formula: String.raw`\alpha_k=MX^k,\quad \mu_k=M(X-MX)^k`,
		body: String.raw`**Моменты** обобщают [[matematicheskoe-ozhidanie|среднее]] и [[dispersiya|дисперсию]]:

- **начальный момент** порядка $k$: $\alpha_k=MX^k=\sum_i x_i^k p_i$;
- **центральный момент** порядка $k$: $\mu_k=M(X-MX)^k$.

Частные случаи: $\alpha_1=MX$, $\mu_2=DX$, $\mu_1=0$. Связь: $DX=\alpha_2-\alpha_1^2$. Из $\mu_3,\mu_4$ строят [[koefficient-asimmetrii|асимметрию]] и [[ekscess|эксцесс]].`,
		related: ['matematicheskoe-ozhidanie', 'dispersiya', 'koefficient-asimmetrii', 'ekscess']
	},

	'koefficient-asimmetrii': {
		id: 'koefficient-asimmetrii',
		term: 'Коэффициент асимметрии',
		short: String.raw`$\mathrm{As}=\mu_3/\sigma^3$ — скошенность распределения.`,
		formula: String.raw`\mathrm{As}=\frac{\mu_3}{\sigma^3}`,
		body: String.raw`**Коэффициент асимметрии** $\mathrm{As}=\dfrac{\mu_3}{\sigma^3}$ — безразмерная мера скошенности, нормированная на куб [[sko|СКО]]. Для симметричных распределений $\mu_3=0$, значит $\mathrm{As}=0$. При $\mathrm{As}>0$ «длинный хвост» направлен вправо, при $\mathrm{As}<0$ — влево. Строится из третьего центрального [[momenty|момента]].`,
		related: ['momenty', 'ekscess', 'sko']
	},

	ekscess: {
		id: 'ekscess',
		term: 'Эксцесс',
		short: String.raw`$\mathrm{Es}=\mu_4/\sigma^4-3$ — островершинность и тяжесть хвостов.`,
		formula: String.raw`\mathrm{Es}=\frac{\mu_4}{\sigma^4}-3`,
		body: String.raw`**Эксцесс** $\mathrm{Es}=\dfrac{\mu_4}{\sigma^4}-3$ характеризует «островершинность» и тяжесть хвостов по сравнению с нормальным распределением. Вычитаемое $3$ подобрано так, чтобы у нормального распределения $\mathrm{Es}=0$. При $\mathrm{Es}>0$ — острый пик и тяжёлые хвосты, при $\mathrm{Es}<0$ — пологое. Строится из четвёртого центрального [[momenty|момента]].`,
		related: ['momenty', 'koefficient-asimmetrii', 'sko']
	},

	'neravenstvo-markova': {
		id: 'neravenstvo-markova',
		term: 'Неравенство Маркова',
		short: String.raw`Для $X\ge0$ и $A>0$: $P(X>A)\le MX/A$.`,
		formula: String.raw`P(X>A)\le\frac{MX}{A}`,
		body: String.raw`**Неравенство Маркова:** если [[sluchaynaya-velichina|величина]] $X$ принимает только неотрицательные значения, то для любого $A>0$ $$P(X>A)\le\frac{MX}{A}.$$ Грубая, но универсальная оценка хвоста: вероятность большого отклонения ограничена через одно лишь [[matematicheskoe-ozhidanie|среднее]]. Из него выводится [[neravenstvo-chebysheva|неравенство Чебышёва]].`,
		related: ['matematicheskoe-ozhidanie', 'neravenstvo-chebysheva']
	},

	'neravenstvo-chebysheva': {
		id: 'neravenstvo-chebysheva',
		term: 'Неравенство Чебышёва',
		short: String.raw`$P(\lvert X-MX\rvert\ge\varepsilon)\le DX/\varepsilon^2$ — для любого распределения.`,
		formula: String.raw`P(\lvert X-MX\rvert\ge\varepsilon)\le\frac{DX}{\varepsilon^2}`,
		body: String.raw`**Неравенство Чебышёва:** для любой [[sluchaynaya-velichina|величины]] с конечной [[dispersiya|дисперсией]] и любого $\varepsilon>0$ $$P\bigl(\lvert X-MX\rvert\ge\varepsilon\bigr)\le\frac{DX}{\varepsilon^2}.$$ В терминах [[sko|СКО]] ($\varepsilon=k\sigma$): $P(\lvert X-MX\rvert\ge k\sigma)\le 1/k^2$. Чем меньше дисперсия, тем теснее значения у центра. Лежит в основе [[zakon-bolshih-chisel|закона больших чисел]].`,
		related: ['neravenstvo-markova', 'dispersiya', 'sko', 'zakon-bolshih-chisel']
	},

	'zakon-bolshih-chisel': {
		id: 'zakon-bolshih-chisel',
		term: 'Закон больших чисел',
		short: String.raw`Среднее по выборке сходится к $MX$ при росте $n$.`,
		formula: String.raw`\bar X_n \xrightarrow{P} MX`,
		body: String.raw`**Закон больших чисел** (в форме Чебышёва): среднее $\bar X_n=\frac1n\sum_{i=1}^n X_i$ независимых одинаково распределённых величин при $n\to\infty$ сходится по вероятности к [[matematicheskoe-ozhidanie|математическому ожиданию]] $MX$. Доказывается прямо из [[neravenstvo-chebysheva|неравенства Чебышёва]], так как $D(\bar X_n)=DX/n\to0$. Это обоснование того, почему частоты и выборочные средние оценивают истинные параметры.`,
		related: ['neravenstvo-chebysheva', 'matematicheskoe-ozhidanie', 'dispersiya']
	}
};
