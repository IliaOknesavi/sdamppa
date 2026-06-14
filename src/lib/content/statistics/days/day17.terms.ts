import type { Glossary } from '$lib/types';

// Термины дня 17 (ch13): критерий согласия Пирсона χ² и точный критерий Фишера.
export const day17Terms: Glossary = {
	'kriteriy-soglasiya': {
		id: 'kriteriy-soglasiya',
		term: 'Критерий согласия',
		short: String.raw`Проверяет, согласуются ли данные с целым гипотетическим распределением.`,
		body: String.raw`**Критерий согласия** проверяет [[statisticheskaya-gipoteza|гипотезу]] не о параметре, а о *виде всего распределения* генеральной совокупности (например, «$X$ нормальна» или «поток пуассоновский»). Сравнивают [[empiricheskie-chastoty|эмпирические]] и [[teoreticheskie-chastoty|теоретические частоты]] по интервалам группировки. Важнейший представитель — [[kriteriy-pirsona|критерий Пирсона $\chi^2$]].

Важно: критерий способен лишь **отвергнуть** гипотезу о распределении, но не доказать её — при непопадании в критическую область говорят «данные не противоречат $H_0$».`,
		related: ['kriteriy-pirsona', 'empiricheskie-chastoty', 'teoreticheskie-chastoty', 'statisticheskaya-gipoteza']
	},

	'empiricheskie-chastoty': {
		id: 'empiricheskie-chastoty',
		term: 'Эмпирические частоты',
		short: String.raw`Наблюдённые числа попаданий $n_i$ в интервалы группировки.`,
		body: String.raw`**Эмпирические (наблюдённые) частоты** $n_i$ — сколько элементов выборки реально попало в $i$-й интервал (группу). Их сумма равна объёму выборки: $\sum_i n_i=n$. В [[kriteriy-pirsona|критерии Пирсона]] сравниваются с [[teoreticheskie-chastoty|теоретическими частотами]].`,
		related: ['teoreticheskie-chastoty', 'kriteriy-pirsona']
	},

	'teoreticheskie-chastoty': {
		id: 'teoreticheskie-chastoty',
		term: 'Теоретические частоты',
		short: String.raw`Ожидаемые частоты $n_i'=n\,p_i$ при верной гипотезе.`,
		formula: String.raw`n_i'=n\,p_i`,
		body: String.raw`**Теоретические (ожидаемые) частоты** $n_i'=n\,p_i$ — сколько наблюдений *должно* попасть в $i$-й интервал, если верна проверяемая [[statisticheskaya-gipoteza|гипотеза]]; здесь $p_i$ — вероятность интервала по гипотетическому распределению, $n$ — объём выборки. В [[kriteriy-pirsona|критерии Пирсона]] требуется $n_i'\ge5$, иначе интервал объединяют с соседним.`,
		related: ['empiricheskie-chastoty', 'kriteriy-pirsona', 'klassicheskaya-veroyatnost']
	},

	'tochnyy-kriteriy-fishera': {
		id: 'tochnyy-kriteriy-fishera',
		term: 'Точный критерий Фишера',
		short: String.raw`Точная проверка независимости в таблице 2×2 через гипергеометрическое распределение.`,
		body: String.raw`**Точный критерий Фишера** проверяет независимость двух бинарных признаков в [[tablica-sopryazhennosti|таблице сопряжённости]] $2\times2$. При фиксированных маргиналах и верной $H_0$ вероятность таблицы [[gipergeometricheskoe-raspredelenie|гипергеометрическая]]: $$P=\frac{C_{a+b}^{a}\,C_{c+d}^{c}}{C_N^{a+c}}.$$

[[p-znachenie|$p$-значение]] — сумма $P$ по всем таблицам, не менее экстремальным, чем наблюдённая. В отличие от [[kriteriy-pirsona|Пирсона]], даёт **точную** вероятность, поэтому уместен на **малых выборках**. Не путать с $F$-критерием Фишера–Снедекора для дисперсий.`,
		related: ['tablica-sopryazhennosti', 'gipergeometricheskoe-raspredelenie', 'p-znachenie', 'kriteriy-pirsona']
	},

	'tablica-sopryazhennosti': {
		id: 'tablica-sopryazhennosti',
		term: 'Таблица сопряжённости',
		short: String.raw`Таблица частот совместных значений двух категориальных признаков.`,
		body: String.raw`**Таблица сопряжённости** сводит совместные частоты двух категориальных признаков. Для двух бинарных признаков это таблица $2\times2$ с клетками $a,b,c,d$ и итогами по строкам и столбцам (**маргиналами**); $N=a+b+c+d$.

По ней проверяют **независимость** признаков — точным [[tochnyy-kriteriy-fishera|критерием Фишера]] (малые выборки) или асимптотическим [[kriteriy-pirsona|критерием $\chi^2$]] (большие). Прямой аналог — A/B-тест «вариант × конверсия».`,
		related: ['tochnyy-kriteriy-fishera', 'kriteriy-pirsona', 'gipergeometricheskoe-raspredelenie']
	}
};
