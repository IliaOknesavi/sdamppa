import type { Glossary } from '$lib/types';

// Терминология чекпоинта 2. Здесь определяются только те понятия экзамена ч.1,
// у которых пока нет канонического владельца среди подключённых дней (дни 10,
// 11, 15 ещё в черновиках). Понятия, которыми канонически владеют подключённые
// дни, переиспользуются через [[...]] и намеренно НЕ переопределяются здесь:
//   день 12 — vyborka, generalnaya-sovokupnost, tochechnaya-ocenka,
//             nesmeshchennost, sostoyatelnost, vyborochnoe-srednee,
//             vyborochnaya-dispersiya, ispravlennaya-dispersiya,
//             nachalnyy-vyborochnyy-moment, centralnyy-vyborochnyy-moment,
//             vyborochnaya-moda-mediana, metod-momentov;
//   день 13 — smeshchenie, doveritelnyy-interval, metod-pravdopodobiya;
//   день 14 — funkciya-pravdopodobiya, empiricheskaya-funkciya-raspredeleniya,
//             butstrep-vyborka, butstrep-ocenka-dispersii;
//   день 16 — statisticheskiy-kriteriy, nulevaya-gipoteza,
//             alternativnaya-gipoteza, kriticheskaya-oblast, uroven-znachimosti,
//             p-znachenie, oshibka-pervogo-roda, oshibka-vtorogo-roda,
//             moshchnost-kriteriya.
export const day19Terms: Glossary = {
	'matematicheskaya-statistika': {
		id: 'matematicheskaya-statistika',
		term: 'Математическая статистика',
		short: String.raw`Раздел, восстанавливающий неизвестное распределение по выборке данных.`,
		body: String.raw`**Математическая статистика** решает обратную к теории вероятностей задачу: если там распределение $P$ известно и мы считаем вероятности событий, то здесь $P$ (или его параметры) **неизвестно**, и его восстанавливают по [[vyborka|выборке]] наблюдений.

Три типовые задачи: описание данных ([[empiricheskaya-funkciya-raspredeleniya|эмпирическая ФР]], [[gistogramma|гистограмма]], выборочные моменты), [[tochechnaya-ocenka|точечное]] и интервальное оценивание параметров и проверка [[statisticheskiy-kriteriy|статистических гипотез]]. Опора всего аппарата — устойчивость частот: при больших $n$ выборочные характеристики сходятся к теоретическим.`,
		related: ['vyborka', 'generalnaya-sovokupnost', 'tochechnaya-ocenka', 'statisticheskiy-kriteriy']
	},

	'variacionnyy-ryad': {
		id: 'variacionnyy-ryad',
		term: 'Вариационный ряд',
		short: String.raw`Выборка, упорядоченная по возрастанию: $X_{(1)}\le\dots\le X_{(n)}$.`,
		formula: String.raw`X_{(1)}\le X_{(2)}\le\dots\le X_{(n)}`,
		body: String.raw`**Вариационный ряд** — это [[vyborka|выборка]], переставленная по неубыванию: $$X_{(1)}\le X_{(2)}\le\dots\le X_{(n)}.$$ Его элементы называют [[poryadkovye-statistiki|порядковыми статистиками]]: $X_{(1)}=\min$, $X_{(n)}=\max$.

Из вариационного ряда сразу читаются [[vyborochnyy-kvantil|выборочные квантили]], [[vyborochnaya-moda-mediana|медиана]] и размах, а ступеньки [[empiricheskaya-funkciya-raspredeleniya|эмпирической ФР]] строятся именно по нему.`,
		related: ['poryadkovye-statistiki', 'vyborochnyy-kvantil', 'vyborochnaya-moda-mediana', 'vyborka']
	},

	'poryadkovye-statistiki': {
		id: 'poryadkovye-statistiki',
		term: 'Порядковые статистики',
		short: String.raw`Элементы выборки, расставленные по возрастанию; $X_{(k)}$ — $k$-й по порядку.`,
		formula: String.raw`X_{(k)}\ \text{—}\ k\text{-й элемент вариационного ряда}`,
		body: String.raw`**Порядковые статистики** — это значения [[vyborka|выборки]], упорядоченные по возрастанию и образующие [[variacionnyy-ryad|вариационный ряд]]. $X_{(1)}$ — минимум, $X_{(n)}$ — максимум, $X_{(k)}$ — $k$-й по величине.

Через них определяются все ранговые характеристики: [[vyborochnyy-kvantil|выборочные квантили]], [[vyborochnaya-moda-mediana|медиана]], квартили и межквартильный размах. В отличие от моментов, они устойчивы к выбросам.`,
		related: ['variacionnyy-ryad', 'vyborochnyy-kvantil', 'vyborochnaya-moda-mediana']
	},

	'vyborochnyy-kvantil': {
		id: 'vyborochnyy-kvantil',
		term: 'Выборочная квантиль',
		short: String.raw`Значение, ниже которого лежит доля $p$ упорядоченных наблюдений.`,
		formula: String.raw`\hat q_p \approx X_{(\lceil np\rceil)}`,
		body: String.raw`**Выборочная квантиль** уровня $p\in(0,1)$ — значение, делящее [[variacionnyy-ryad|вариационный ряд]] так, что слева от него оказывается доля примерно $p$ наблюдений. Простейшее правило: $\hat q_p\approx X_{(\lceil np\rceil)}$, то есть берётся соответствующая [[poryadkovye-statistiki|порядковая статистика]].

Частные случаи: $p=0{,}5$ даёт [[vyborochnaya-moda-mediana|медиану]], $p=0{,}25$ и $p=0{,}75$ — нижний и верхний квартили. Квантили устойчивы к выбросам и используются в боксплотах.`,
		related: ['variacionnyy-ryad', 'poryadkovye-statistiki', 'vyborochnaya-moda-mediana']
	},

	gistogramma: {
		id: 'gistogramma',
		term: 'Гистограмма',
		short: String.raw`Столбчатая оценка плотности: высоты столбцов — частоты по интервалам.`,
		body: String.raw`**Гистограмма** — способ визуализации [[vyborka|выборки]] непрерывного признака: область значений разбивают на интервалы (бины), а над каждым строят столбец, высота которого пропорциональна доле попавших туда наблюдений. При делении высоты на ширину бина гистограмма становится оценкой **плотности**.

По форме гистограммы видны симметрия, число мод и тяжесть хвостов распределения. Дискретный аналог — полигон частот; кумулятивный — график [[empiricheskaya-funkciya-raspredeleniya|эмпирической ФР]].`,
		related: ['empiricheskaya-funkciya-raspredeleniya', 'vyborka']
	}
};
