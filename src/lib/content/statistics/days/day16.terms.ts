import type { Glossary } from '$lib/types';

// Термины дня 16 (ch13): проверка гипотез, ошибки I и II рода.
export const day16Terms: Glossary = {
	'statisticheskaya-gipoteza': {
		id: 'statisticheskaya-gipoteza',
		term: 'Статистическая гипотеза',
		short: String.raw`Предположение о параметре или виде распределения, проверяемое по выборке.`,
		body: String.raw`**Статистическая гипотеза** — всякое предположение о [[generalnaya-sovokupnost|генеральной совокупности]] $X$, которое проверяют по [[vyborka|выборке]] $x_1,\dots,x_n$.

Гипотеза **параметрическая**, если фиксирует значение параметра распределения известного вида ($\lambda=\lambda_0$ для Пуассона). Гипотеза **непараметрическая**, если касается всего распределения целиком («$X$ распределена нормально»).`,
		related: ['nulevaya-gipoteza', 'alternativnaya-gipoteza', 'statisticheskiy-kriteriy']
	},

	'nulevaya-gipoteza': {
		id: 'nulevaya-gipoteza',
		term: 'Нулевая гипотеза',
		short: String.raw`Проверяемая гипотеза $H_0$ («ничего особенного нет»).`,
		formula: String.raw`H_0:\ \theta=\theta_0`,
		body: String.raw`**Нулевая** (основная) [[statisticheskaya-gipoteza|гипотеза]] $H_0$ — та, которую выдвигают на проверку. Обычно это «консервативное» утверждение об отсутствии эффекта ($\lambda=\lambda_0$, доля брака равна норме, признаки независимы).

Решение всегда несимметрично: мы либо **отвергаем** $H_0$, либо говорим «нет оснований отвергнуть». Доказать $H_0$ нельзя — её только не удаётся опровергнуть.`,
		related: ['alternativnaya-gipoteza', 'oshibka-pervogo-roda', 'p-znachenie']
	},

	'alternativnaya-gipoteza': {
		id: 'alternativnaya-gipoteza',
		term: 'Альтернативная гипотеза',
		short: String.raw`Конкурирующая с $H_0$ гипотеза $H_1$.`,
		formula: String.raw`H_1:\ \theta\neq\theta_0`,
		body: String.raw`**Альтернативная** гипотеза $H_1$ конкурирует с [[nulevaya-gipoteza|$H_0$]] и исключает её. Вид $H_1$ задаёт сторону [[kriticheskaya-oblast|критической области]]:

- $H_1:\ \theta\neq\theta_0$ — двусторонняя;
- $H_1:\ \theta>\theta_0$ — правосторонняя;
- $H_1:\ \theta<\theta_0$ — левосторонняя.

Именно «в сторону $H_1$» измеряют экстремальность результата при вычислении [[p-znachenie|p-значения]].`,
		related: ['nulevaya-gipoteza', 'kriticheskaya-oblast', 'moshchnost-kriteriya']
	},

	'statisticheskiy-kriteriy': {
		id: 'statisticheskiy-kriteriy',
		term: 'Статистический критерий',
		short: String.raw`Правило решения о $H_0$ через статистику $T$ с известным при $H_0$ распределением.`,
		body: String.raw`**Статистика критерия** $T=T(x_1,\dots,x_n)$ — случайная величина, которая (1) вычисляется по выборке, (2) измеряет расхождение данных с [[nulevaya-gipoteza|$H_0$]] и (3) при верной $H_0$ имеет **известное** (затабулированное) распределение.

**Статистический критерий** — правило: по наблюдённому $T_{\text{набл}}$ решить, отвергать $H_0$ или нет. Реализуется через [[kriticheskaya-oblast|критическую область]] или эквивалентно через [[p-znachenie|p-значение]].`,
		related: ['kriticheskaya-oblast', 'p-znachenie', 'statisticheskaya-gipoteza']
	},

	'kriticheskaya-oblast': {
		id: 'kriticheskaya-oblast',
		term: 'Критическая область',
		short: String.raw`Множество значений $T$, при попадании в которое $H_0$ отвергается.`,
		body: String.raw`Все возможные значения [[statisticheskiy-kriteriy|статистики]] $T$ делят на два класса: **область принятия** (где $H_0$ не отвергается) и **критическую область** (где отвергается). Граничные значения — **критические точки** $x_{\text{кр}}$.

Расположение задаётся [[alternativnaya-gipoteza|альтернативой]]:

- **правосторонняя** $(x_{\text{кр}};+\infty)$: $P(T>x_{\text{кр}})=\alpha$;
- **левосторонняя** $(-\infty;x_{\text{кр}})$: $P(T<x_{\text{кр}})=\alpha$;
- **двусторонняя**: $P(T<x_{\text{кр,лев}})=P(T>x_{\text{кр,пр}})=\alpha/2$.`,
		related: ['statisticheskiy-kriteriy', 'uroven-znachimosti', 'alternativnaya-gipoteza']
	},

	'oshibka-pervogo-roda': {
		id: 'oshibka-pervogo-roda',
		term: 'Ошибка I рода',
		short: String.raw`Отвергнуть верную $H_0$; её вероятность — $\alpha$.`,
		formula: String.raw`\alpha=P(\text{отвергнуть }H_0\mid H_0\text{ верна})`,
		body: String.raw`**Ошибка первого рода** — отвергнуть [[nulevaya-gipoteza|$H_0$]], когда она на самом деле верна (ложная тревога). Её вероятность обозначают $\alpha$ и называют [[uroven-znachimosti|уровнем значимости]].

Это «более опасная» ошибка: задавая малое $\alpha$, мы напрямую контролируем риск ложного отвержения. Парная к ней — [[oshibka-vtorogo-roda|ошибка II рода]].`,
		related: ['oshibka-vtorogo-roda', 'uroven-znachimosti', 'moshchnost-kriteriya']
	},

	'oshibka-vtorogo-roda': {
		id: 'oshibka-vtorogo-roda',
		term: 'Ошибка II рода',
		short: String.raw`Не отвергнуть ложную $H_0$; её вероятность — $\beta$.`,
		formula: String.raw`\beta=P(\text{не отвергнуть }H_0\mid H_1\text{ верна})`,
		body: String.raw`**Ошибка второго рода** — не отвергнуть [[nulevaya-gipoteza|$H_0$]], когда верна [[alternativnaya-gipoteza|$H_1$]] (пропуск реального эффекта). Её вероятность — $\beta$, а $1-\beta$ есть [[moshchnost-kriteriya|мощность критерия]].

При фиксированном $n$ уменьшение [[oshibka-pervogo-roda|$\alpha$]] обычно увеличивает $\beta$ — это фундаментальный компромисс. Снизить обе ошибки сразу можно лишь ростом объёма выборки.`,
		related: ['oshibka-pervogo-roda', 'moshchnost-kriteriya', 'alternativnaya-gipoteza']
	},

	'uroven-znachimosti': {
		id: 'uroven-znachimosti',
		term: 'Уровень значимости',
		short: String.raw`Заданная заранее вероятность ошибки I рода $\alpha$.`,
		formula: String.raw`\alpha\in\{0{,}05;\ 0{,}01;\ 0{,}005\}`,
		body: String.raw`**Уровень значимости** $\alpha$ — допустимая вероятность [[oshibka-pervogo-roda|ошибки I рода]], которую назначают **до** эксперимента (типично $0{,}05$, $0{,}01$).

Смысл: при $\alpha=0{,}05$, проверяя верную [[nulevaya-gipoteza|$H_0$]] на каждой из $100$ выборок, мы в среднем $5$ раз ошибочно её отвергнем. Через $\alpha$ строят [[kriticheskaya-oblast|критические точки]] и сравнивают с ним [[p-znachenie|p-значение]].`,
		related: ['oshibka-pervogo-roda', 'kriticheskaya-oblast', 'p-znachenie']
	},

	'moshchnost-kriteriya': {
		id: 'moshchnost-kriteriya',
		term: 'Мощность критерия',
		short: String.raw`Вероятность правильно отвергнуть ложную $H_0$: $1-\beta$.`,
		formula: String.raw`1-\beta=P(\text{отвергнуть }H_0\mid H_1)`,
		body: String.raw`**Мощность** $1-\beta$ — вероятность отвергнуть [[nulevaya-gipoteza|$H_0$]], когда верна [[alternativnaya-gipoteza|$H_1$]], то есть вероятность **не** совершить [[oshibka-vtorogo-roda|ошибку II рода]].

Мощность растёт с объёмом выборки $n$, с удалением истинного параметра от $\theta_0$ (сильный эффект легче заметить) и при увеличении [[uroven-znachimosti|$\alpha$]]. Планируя эксперимент, выбирают $n$ так, чтобы при интересном эффекте мощность была достаточной (обычно $\ge 0{,}8$).`,
		related: ['oshibka-vtorogo-roda', 'oshibka-pervogo-roda', 'uroven-znachimosti']
	},

	'p-znachenie': {
		id: 'p-znachenie',
		term: 'p-значение',
		short: String.raw`Вероятность при $H_0$ получить результат не менее экстремальный, чем наблюдённый.`,
		formula: String.raw`p=P(T\geqslant T_{\text{набл}}\mid H_0)`,
		body: String.raw`**p-значение** — вероятность (вычисленная **в предположении верной** [[nulevaya-gipoteza|$H_0$]]) получить значение [[statisticheskiy-kriteriy|статистики]], не менее экстремальное (в сторону [[alternativnaya-gipoteza|$H_1$]]), чем наблюдённое $T_{\text{набл}}$.

Правило: $p<\alpha\Rightarrow$ отвергаем $H_0$; $p\geqslant\alpha\Rightarrow$ нет оснований отвергнуть. Оно **эквивалентно** правилу [[kriticheskaya-oblast|критической области]], но дополнительно показывает, *насколько сильно* данные противоречат $H_0$: чем меньше $p$, тем сильнее свидетельство против неё. Это **не** вероятность того, что $H_0$ верна.`,
		related: ['uroven-znachimosti', 'kriticheskaya-oblast', 'nulevaya-gipoteza']
	},

	'kriteriy-pirsona': {
		id: 'kriteriy-pirsona',
		term: 'Критерий согласия Пирсона χ²',
		short: String.raw`Сравнивает эмпирические и теоретические частоты: $\chi^2=\sum (n_i-n_i')^2/n_i'$.`,
		formula: String.raw`\chi^2=\sum_{i=1}^{k}\frac{(n_i-n_i')^2}{n_i'}`,
		body: String.raw`**Критерий Пирсона** проверяет согласие данных с гипотетическим распределением. Статистика $$\chi^2=\sum_{i=1}^{k}\frac{(n_i-n_i')^2}{n_i'},$$ где $n_i$ — эмпирические, $n_i'=n p_i$ — теоретические частоты. При верной [[nulevaya-gipoteza|$H_0$]] и $n\to\infty$ она имеет распределение $\chi^2$ с $\nu=k-r-1$ степенями свободы ($r$ — число оценённых по выборке параметров).

Критическая область правосторонняя: $H_0$ отвергают при $\chi^2_{\text{набл}}>\chi^2_{\text{кр}}$. Условия: $n_i\ge 5$ (иначе группы объединяют), критерий **асимптотический**.`,
		related: ['statisticheskiy-kriteriy', 'kriticheskaya-oblast', 'kriteriy-fishera']
	},

	'kriteriy-fishera': {
		id: 'kriteriy-fishera',
		term: 'Точный критерий Фишера',
		short: String.raw`Точная проверка независимости в таблице $2\times2$ через гипергеометрику.`,
		formula: String.raw`P=\dfrac{C_{a+b}^{a}\,C_{c+d}^{c}}{C_{N}^{a+c}}`,
		body: String.raw`**Точный критерий Фишера** проверяет независимость двух бинарных признаков в таблице сопряжённости $2\times2$. При фиксированных маргинальных суммах и верной [[nulevaya-gipoteza|$H_0$]] вероятность конкретной таблицы подчиняется **гипергеометрическому** распределению $$P=\frac{C_{a+b}^{a}\,C_{c+d}^{c}}{C_{N}^{a+c}}.$$

[[p-znachenie|p-значение]] — сумма вероятностей всех таблиц (с теми же суммами), не менее экстремальных, чем наблюдённая. В отличие от [[kriteriy-pirsona|$\chi^2$]] даёт **точную** вероятность и потому уместен при малых выборках. Не путать с $F$-критерием Фишера—Снедекора для сравнения дисперсий.`,
		related: ['kriteriy-pirsona', 'p-znachenie', 'statisticheskiy-kriteriy']
	}
};
