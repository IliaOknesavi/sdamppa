import type { Glossary } from '$lib/types';

// Новые термины дня 10 (ch09, первая половина): предмет статистики, выборочный
// метод и эмпирическая ФР с её несмещённостью/состоятельностью. Базовые
// «выборочные» термины (генеральная совокупность, выборка, простая выборка,
// эмпирическая ФР, Гливенко и т.п.) намеренно используют те же id, что и
// день 11, чтобы ссылки [[...]] резолвились единообразно в общем глоссарии.
export const day10Terms: Glossary = {
	'matematicheskaya-statistika': {
		id: 'matematicheskaya-statistika',
		term: 'Математическая статистика',
		short: String.raw`Выводы о неизвестном распределении по данным.`,
		body: String.raw`**Математическая статистика** — раздел математики о сборе, обработке и интерпретации данных и о построении выводов про неизвестные вероятностные закономерности по наблюдениям. Если в теории вероятностей распределение задано и мы считаем вероятности, то здесь распределение известно лишь частично или вовсе неизвестно, а в руках только конечная [[vyborka|выборка]]. Главные задачи: компактное представление данных, [[nesmeshchennost|оценивание]] параметров, проверка гипотез, изучение связей.`,
		related: ['vyborka', 'generalnaya-sovokupnost', 'empiricheskaya-fr']
	},

	'generalnaya-sovokupnost': {
		id: 'generalnaya-sovokupnost',
		term: 'Генеральная совокупность',
		short: String.raw`Всё множество объектов с неизвестной $F(x)$.`,
		body: String.raw`**Генеральная совокупность** (г.с.) — всё множество объектов, относительно которых нужен вывод. Измеряемый признак считают [[sluchaynaya-velichina|случайной величиной]] $X$ с (обычно неизвестной) функцией распределения $F(x)$. Полностью изучить г.с. на практике нельзя, поэтому судят о ней по [[vyborka|выборке]].`,
		formula: String.raw`X\sim F(x)`,
		related: ['vyborka', 'reprezentativnost', 'empiricheskaya-fr']
	},

	vyborka: {
		id: 'vyborka',
		term: 'Выборка',
		short: String.raw`$n$ наблюдений $x_1,\dots,x_n$ из генеральной совокупности.`,
		formula: String.raw`x_1, x_2, \dots, x_n`,
		body: String.raw`**Выборка** объёма $n$ — $n$ объектов, отобранных из [[generalnaya-sovokupnost|генеральной совокупности]]; их измерения $x_1,\dots,x_n$ называют **наблюдениями**. До эксперимента наблюдения — случайные величины $X_1,\dots,X_n$, после — конкретные числа. Чтобы по выборке судить о целом, она должна быть [[reprezentativnost|репрезентативной]]. Вся статистика работает именно с выборкой, а не с г.с.`,
		related: ['generalnaya-sovokupnost', 'reprezentativnost', 'prostaya-vyborka']
	},

	reprezentativnost: {
		id: 'reprezentativnost',
		term: 'Репрезентативность',
		short: String.raw`Выборка верно отражает свойства г.с.`,
		body: String.raw`**Репрезентативность** — свойство [[vyborka|выборки]] достаточно полно отражать [[generalnaya-sovokupnost|генеральную совокупность]]. Обеспечивается достаточным **объёмом** выборки и правильной **организацией** отбора (случайный, механический, серийный, стратифицированный). Без неё выводы смещены — независимо от того, насколько аккуратна последующая математика.`,
		related: ['vyborka', 'prostaya-vyborka', 'generalnaya-sovokupnost']
	},

	'prostaya-vyborka': {
		id: 'prostaya-vyborka',
		term: 'Простая (повторная случайная) выборка',
		short: String.raw`Независимые одинаково распределённые $X_1,\dots,X_n$.`,
		body: String.raw`**Простая** (повторная случайная) выборка — отбор, при котором объекты берутся независимо, и каждое наблюдение имеет то же распределение, что и вся [[generalnaya-sovokupnost|г.с.]] То есть $X_1,\dots,X_n$ — [[nezavisimost-velichin|независимые]] одинаково распределённые величины с общей $F(x)$. Это ключевое предположение: именно независимость даёт биномиальность $n_x$ и [[sostoyatelnost|состоятельность]] [[empiricheskaya-fr|эмпирической ФР]].`,
		related: ['vyborka', 'reprezentativnost', 'empiricheskaya-fr', 'nezavisimost-velichin']
	},

	'empiricheskaya-fr': {
		id: 'empiricheskaya-fr',
		term: 'Эмпирическая функция распределения',
		short: String.raw`$\hat F_n(x)$ — доля наблюдений, меньших $x$.`,
		formula: String.raw`\hat F_n(x) = \frac{n_x}{n}`,
		body: String.raw`**Эмпирическая (выборочная) ФР** $\hat F_n(x)=n_x/n$ — доля наблюдений [[vyborka|выборки]], строго меньших $x$ (где $n_x=\#\{i:X_i<x\}$). Это ступенчатая функция: ноль левее минимума, единица правее максимума, со скачками $1/n$ в точках выборки. Она обладает всеми свойствами обычной [[funkciya-raspredeleniya|ФР]]. Главное: $\hat F_n$ — [[nesmeshchennost|несмещённая]] и [[sostoyatelnost|состоятельная]] оценка неизвестной $F$, а по [[teorema-glivenko|теореме Гливенко]] сходится к ней равномерно.`,
		related: ['funkciya-raspredeleniya', 'nesmeshchennost', 'sostoyatelnost', 'teorema-glivenko']
	},

	nesmeshchennost: {
		id: 'nesmeshchennost',
		term: 'Несмещённость оценки',
		short: String.raw`В среднем оценка попадает в истину: $M\hat\theta=\theta$.`,
		formula: String.raw`M\hat\theta = \theta`,
		body: String.raw`Оценка $\hat\theta$ параметра $\theta$ **несмещённая**, если $M\hat\theta=\theta$ при любом $n$ — систематической ошибки нет, в среднем по всем мыслимым выборках оценка попадает в цель. Для [[empiricheskaya-fr|эмпирической ФР]] это $M\hat F_n(x)=F(x)$ в каждой точке, что следует из $M(n_x)=nF(x)$ (биномиальность $n_x$).`,
		related: ['empiricheskaya-fr', 'sostoyatelnost', 'matematicheskoe-ozhidanie']
	},

	sostoyatelnost: {
		id: 'sostoyatelnost',
		term: 'Состоятельность оценки',
		short: String.raw`С ростом $n$ оценка сходится к истине.`,
		formula: String.raw`P(|\hat\theta_n - \theta| > \varepsilon) \to 0`,
		body: String.raw`Оценка $\hat\theta_n$ **состоятельна**, если она сходится по вероятности к $\theta$: для любого $\varepsilon>0$ $\;P(|\hat\theta_n-\theta|>\varepsilon)\to0$ при $n\to\infty$. Достаточное условие — [[nesmeshchennost|несмещённость]] плюс $D\hat\theta_n\to0$ (тогда работает [[neravenstvo-chebysheva|неравенство Чебышёва]]). Для [[empiricheskaya-fr|эмпирической ФР]] $D\hat F_n(x)=F(x)(1-F(x))/n\to0$, значит $\hat F_n(x)$ состоятельна в каждой точке.`,
		related: ['nesmeshchennost', 'neravenstvo-chebysheva', 'zakon-bolshih-chisel']
	},

	'teorema-glivenko': {
		id: 'teorema-glivenko',
		term: 'Теорема Гливенко',
		short: String.raw`$\sup_x|\hat F_n - F| \to 0$ — основная теорема статистики.`,
		formula: String.raw`\sup_{x}|\hat F_n(x) - F(x)| \xrightarrow[n\to\infty]{} 0`,
		body: String.raw`**Теорема Гливенко** (основная теорема статистики): для [[prostaya-vyborka|простой выборки]] [[empiricheskaya-fr|эмпирическая ФР]] сходится к теоретической **равномерно** по всей оси почти наверное: $$\sup_x|\hat F_n(x)-F(x)|\to0.$$ Это сильнее поточечной [[sostoyatelnost|состоятельности]]: вся ступенчатая $\hat F_n$ ложится в узкую полоску вокруг $F$. Поэтому теорема обосновывает сам выборочный метод. Опирается на поточечный [[zakon-bolshih-chisel|закон больших чисел]] и монотонность $F$.`,
		related: ['empiricheskaya-fr', 'prostaya-vyborka', 'zakon-bolshih-chisel', 'sostoyatelnost']
	}
};
