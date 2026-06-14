import type { Glossary } from '$lib/types';

// New terms introduced on Day 4 (ch04): random variables, distribution series,
// the distribution function and its supporting notions. Cross-links to base
// (ch01) terms by id; the engine merges these into the subject glossary.
export const day04Terms: Glossary = {
	'sluchaynaya-velichina': {
		id: 'sluchaynaya-velichina',
		term: 'Случайная величина',
		short: String.raw`Числовая функция элементарного исхода $\xi=\xi(\omega)$.`,
		formula: String.raw`\xi:\ \Omega \to \mathbb R`,
		body: String.raw`**Случайная величина** $\xi$ — это [[izmerimost|измеримая]] числовая функция [[elementarnyy-ishod|элементарного исхода]]: каждому $\omega\in\Omega$ она сопоставляет число $\xi(\omega)$. Значение заранее неизвестно и определяется реализовавшимся исходом.

По множеству значений бывает [[diskretnaya-sv|дискретной]] (значения нумеруются) или непрерывной (день 7).`,
		related: ['diskretnaya-sv', 'funkciya-raspredeleniya', 'izmerimost', 'elementarnyy-ishod']
	},

	'diskretnaya-sv': {
		id: 'diskretnaya-sv',
		term: 'Дискретная случайная величина',
		short: String.raw`СВ с конечным или счётным множеством значений $x_1,x_2,\dots$`,
		body: String.raw`[[sluchaynaya-velichina|Случайная величина]] **дискретна**, если множество её значений конечно или счётно, то есть их можно занумеровать $x_1,x_2,\dots$ Полностью описывается своим [[ryad-raspredeleniya|рядом распределения]], а её [[funkciya-raspredeleniya|функция распределения]] — ступенчатая.`,
		related: ['sluchaynaya-velichina', 'ryad-raspredeleniya', 'funkciya-raspredeleniya']
	},

	'ryad-raspredeleniya': {
		id: 'ryad-raspredeleniya',
		term: 'Ряд распределения',
		short: String.raw`Таблица значений $x_k$ и их вероятностей $p_k=P(\xi=x_k)$.`,
		formula: String.raw`p_k = P(\xi = x_k),\quad \sum_k p_k = 1`,
		body: String.raw`**Ряд (закон) распределения** [[diskretnaya-sv|дискретной СВ]] — соответствие $(x_k;\ p_k)$, где $p_k=P(\xi=x_k)$, обычно в виде таблицы. Вероятности подчинены [[usloviya-normirovki|условиям нормировки]] $p_k\ge0$, $\sum_k p_k=1$. Графически — [[mnogougolnik-raspredeleniya|многоугольник распределения]]; по ряду строится [[funkciya-raspredeleniya|функция распределения]].`,
		related: ['usloviya-normirovki', 'mnogougolnik-raspredeleniya', 'funkciya-raspredeleniya', 'diskretnaya-sv']
	},

	'usloviya-normirovki': {
		id: 'usloviya-normirovki',
		term: 'Условие нормировки',
		short: String.raw`Вероятности ряда неотрицательны и в сумме дают $1$.`,
		formula: String.raw`p_k \ge 0,\qquad \sum_k p_k = 1`,
		body: String.raw`Для [[ryad-raspredeleniya|ряда распределения]]: $p_k\ge0$ и $\sum_k p_k=1$. Сумма равна единице потому, что события $\{\xi=x_k\}$ попарно [[nesovmestnye|несовместны]] и образуют [[polnaya-gruppa|полную группу]], а по [[schetnaya-additivnost|аксиоме аддитивности]] $\sum_k P(\xi=x_k)=P(\Omega)=1$.`,
		related: ['ryad-raspredeleniya', 'polnaya-gruppa', 'aksiomy-kolmogorova']
	},

	'mnogougolnik-raspredeleniya': {
		id: 'mnogougolnik-raspredeleniya',
		term: 'Многоугольник распределения',
		short: String.raw`Ломаная, соединяющая точки $(x_k,\ p_k)$.`,
		body: String.raw`**Многоугольник (полигон) распределения** — ломаная через точки $(x_k,\ p_k)$ [[ryad-raspredeleniya|ряда распределения]] на плоскости. Наглядно показывает форму распределения (например, «колоколообразный» вид [[binomialnoe-raspredelenie|биномиального]] с максимумом вблизи $np$).`,
		related: ['ryad-raspredeleniya', 'binomialnoe-raspredelenie']
	},

	'funkciya-raspredeleniya': {
		id: 'funkciya-raspredeleniya',
		term: 'Функция распределения',
		short: String.raw`$F_\xi(x)=P(\xi<x)$ — вероятность значений левее $x$.`,
		formula: String.raw`F_\xi(x) = P(\xi < x)`,
		body: String.raw`**Функция распределения** $F_\xi(x)=P(\xi<x)$ — универсальная характеристика любой [[sluchaynaya-velichina|СВ]], равная вероятности того, что $\xi$ окажется строго левее $x$. Обладает рядом [[svoystva-funkcii-raspredeleniya|свойств]] (границы $[0,1]$, монотонность, пределы $0$ и $1$, непрерывность слева). Для [[diskretnaya-sv|дискретной СВ]] ступенчата: $F_\xi(x)=\sum_{x_k<x}p_k$, со скачком $p_k$ в каждой точке $x_k$.

Альтернативное определение $P(\xi\le x)$ даёт непрерывность справа.`,
		related: ['svoystva-funkcii-raspredeleniya', 'sluchaynaya-velichina', 'ryad-raspredeleniya', 'diskretnaya-sv']
	},

	'svoystva-funkcii-raspredeleniya': {
		id: 'svoystva-funkcii-raspredeleniya',
		term: 'Свойства функции распределения',
		short: String.raw`Границы, монотонность, пределы $0$ и $1$, непрерывность слева.`,
		body: String.raw`Для [[funkciya-raspredeleniya|$F_\xi(x)=P(\xi<x)$]]:

1. $0\le F_\xi(x)\le 1$;
2. не убывает: $x_1\le x_2\Rightarrow F_\xi(x_1)\le F_\xi(x_2)$;
3. $P(x_1\le\xi<x_2)=F_\xi(x_2)-F_\xi(x_1)$;
4. $\lim_{x\to-\infty}F_\xi=0$, $\lim_{x\to+\infty}F_\xi=1$;
5. непрерывна слева;
6. $P(\xi\ge x)=1-F_\xi(x)$.

Свойства 1–3 — из конечной аддитивности; 4 и 5 — из [[aksioma-nepreryvnosti|аксиомы непрерывности]].`,
		related: ['funkciya-raspredeleniya', 'aksioma-nepreryvnosti', 'teorema-slozheniya']
	},

	'izmerimost': {
		id: 'izmerimost',
		term: 'Измеримость',
		short: String.raw`Условие $\{\omega:\xi(\omega)<x\}\in\mathcal F$ для любого $x$.`,
		formula: String.raw`\{\omega:\ \xi(\omega) < x\} \in \mathcal F`,
		body: String.raw`Чтобы у [[sluchaynaya-velichina|СВ]] существовала [[funkciya-raspredeleniya|функция распределения]], нужна **измеримость**: для каждого $x$ множество $\{\omega:\xi(\omega)<x\}$ должно быть [[sobytie|событием]], то есть принадлежать [[sigma-algebra|$\sigma$-алгебре]] $\mathcal F$ — иначе вероятности $P(\xi<x)$ просто нет. Для конечного или счётного $\Omega$ выполняется автоматически.`,
		related: ['sluchaynaya-velichina', 'sigma-algebra', 'sobytie', 'funkciya-raspredeleniya']
	},

	'aksioma-nepreryvnosti': {
		id: 'aksioma-nepreryvnosti',
		term: 'Аксиома непрерывности',
		short: String.raw`Для $A_1\supset A_2\supset\dots$ с $\bigcap A_n=\varnothing$ имеем $P(A_n)\to0$.`,
		formula: String.raw`A_n \downarrow \varnothing \ \Rightarrow\ P(A_n) \to 0`,
		body: String.raw`**Аксиома непрерывности**: для убывающей вложенной последовательности [[sobytie|событий]] $A_1\supset A_2\supset\dots$ с пустым пересечением $\bigcap_n A_n=\varnothing$ выполняется $P(A_n)\to0$. Эквивалентна (вместе с конечной аддитивностью) счётной [[schetnaya-additivnost|аддитивности Колмогорова]] и нужна для доказательства предельных [[svoystva-funkcii-raspredeleniya|свойств $F$]] и непрерывности слева.`,
		related: ['aksiomy-kolmogorova', 'svoystva-funkcii-raspredeleniya', 'sobytie']
	},

	'geometricheskoe-raspredelenie': {
		id: 'geometricheskoe-raspredelenie',
		term: 'Геометрическое распределение',
		short: String.raw`Номер первого успеха: $p_k=q^{k-1}p$, $k=1,2,\dots$`,
		formula: String.raw`p_k = q^{\,k-1} p,\quad q = 1 - p`,
		body: String.raw`Число $\xi=k$ независимых испытаний до первого успеха (вероятность успеха $p$, неуспеха $q=1-p$): $$p_k=q^{\,k-1}p,\qquad k=1,2,\dots$$ [[usloviya-normirovki|Нормировка]] проверяется суммой геометрической прогрессии: $\sum_k q^{k-1}p=\dfrac{p}{1-q}=1$. Пример [[diskretnaya-sv|дискретной СВ]] со счётным числом значений.`,
		related: ['ryad-raspredeleniya', 'usloviya-normirovki', 'diskretnaya-sv']
	},

	'binomialnoe-raspredelenie': {
		id: 'binomialnoe-raspredelenie',
		term: 'Биномиальное распределение',
		short: String.raw`Число успехов в $n$ испытаниях: $P_n(k)=C_n^k p^k q^{n-k}$.`,
		formula: String.raw`P_n(k) = C_n^{k}\,p^{k} q^{\,n-k}`,
		body: String.raw`Число успехов в $n$ независимых испытаниях с вероятностью успеха $p$ ($q=1-p$): $$P_n(k)=C_n^{k}p^{k}q^{\,n-k},\qquad k=0,1,\dots,n.$$ [[usloviya-normirovki|Нормировка]] — бином Ньютона: $\sum_{k=0}^{n}C_n^k p^k q^{n-k}=(p+q)^n=1$. Подробно — день 6.`,
		related: ['ryad-raspredeleniya', 'usloviya-normirovki', 'mnogougolnik-raspredeleniya']
	},

	'raspredelenie-puassona': {
		id: 'raspredelenie-puassona',
		term: 'Распределение Пуассона',
		short: String.raw`$p(k)=\dfrac{\lambda^k}{k!}e^{-\lambda}$, $k=0,1,2,\dots$`,
		formula: String.raw`p(k) = \frac{\lambda^{k}}{k!}\,e^{-\lambda}`,
		body: String.raw`Распределение числа редких событий с параметром $\lambda>0$: $$p(k)=\frac{\lambda^{k}}{k!}e^{-\lambda},\qquad k=0,1,2,\dots$$ [[usloviya-normirovki|Нормировка]] — через ряд экспоненты: $\sum_{k=0}^{\infty}\frac{\lambda^k}{k!}e^{-\lambda}=e^{-\lambda}e^{\lambda}=1$. Подробно — день 6.`,
		related: ['ryad-raspredeleniya', 'usloviya-normirovki', 'diskretnaya-sv']
	}
};
