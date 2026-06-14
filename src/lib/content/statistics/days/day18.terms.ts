import type { Glossary } from '$lib/types';

// Термины дня 18 «Метод Монте-Карло» (ch14). Подключаются к общему графу
// глоссария. Базовые термины (sluchaynaya-velichina, funkciya-raspredeleniya,
// ravnomernoe-raspredelenie, matematicheskoe-ozhidanie, dispersiya,
// zakon-bolshih-chisel) определены в более ранних днях — здесь не дублируются,
// только ссылки на них.
export const day18Terms: Glossary = {
	'metod-monte-karlo': {
		id: 'metod-monte-karlo',
		term: 'Метод Монте-Карло',
		short: String.raw`Приближённое решение задач через многократное моделирование случайности.`,
		formula: String.raw`P(A)\approx \frac{m}{N}`,
		body: String.raw`**Метод Монте-Карло** (метод статистических испытаний) — приём приближённого решения задач, при котором искомая величина представляется как [[chislovaya-harakteristika|числовая характеристика]] некоторой [[sluchaynaya-velichina|случайной величины]] и оценивается по результатам большого числа $N$ независимых [[razygryvanie|розыгрышей]].

Для вероятности события: $P(A)\approx m/N$, где $m$ — число испытаний, в которых $A$ произошло. Обоснование — [[zakon-bolshih-chisel|закон больших чисел]].`,
		related: ['razygryvanie', 'zakon-bolshih-chisel', 'statisticheskaya-veroyatnost', 'sluchaynaya-velichina']
	},

	razygryvanie: {
		id: 'razygryvanie',
		term: 'Разыгрывание случайной величины',
		short: String.raw`Получение значения СВ из датчика $R(0,1)$.`,
		body: String.raw`**Разыграть** [[sluchaynaya-velichina|случайную величину]] $X$ — значит по одному (или нескольким) обращениям к датчику [[ravnomernoe-raspredelenie|$R(0,1)$]] выдать значение, распределённое в точности как $X$.

Это технический фундамент [[metod-monte-karlo|метода Монте-Карло]]: чтобы моделировать опыт, машина должна уметь «бросать кость» нужного закона. Универсальный приём — [[metod-obratnoy-funkcii|метод обратной функции]].`,
		related: ['ravnomernoe-raspredelenie', 'metod-obratnoy-funkcii', 'metod-monte-karlo']
	},

	'psevdosluchaynye-chisla': {
		id: 'psevdosluchaynye-chisla',
		term: 'Псевдослучайные числа',
		short: String.raw`Детерминированная последовательность, неотличимая от выборки $R(0,1)$.`,
		body: String.raw`На компьютере получают не истинно случайные, а **псевдослучайные** числа: детерминированный алгоритм-генератор выдаёт последовательность $r_1,r_2,\dots$, статистически неотличимую от выборки независимых значений [[ravnomernoe-raspredelenie|$R(0,1)$]].

В Python такой датчик — **random.random()**. Фиксированный *seed* делает розыгрыш воспроизводимым — важно для отладки [[metod-monte-karlo|Монте-Карло]]-экспериментов.`,
		related: ['ravnomernoe-raspredelenie', 'metod-monte-karlo']
	},

	'metod-obratnoy-funkcii': {
		id: 'metod-obratnoy-funkcii',
		term: 'Метод обратной функции',
		short: String.raw`Разыгрывание по правилу $x=F^{-1}(r)$.`,
		formula: String.raw`x = F^{-1}(r),\quad r=R(0,1)`,
		body: String.raw`Универсальный приём [[razygryvanie|разыгрывания]]: берут $r=R(0,1)$ и обращают [[funkciya-raspredeleniya|функцию распределения]], $x=F^{-1}(r)$.

- **Непрерывный случай:** решают уравнение $F(x)=r$ (например, для показательного $x=-\tfrac1\lambda\ln(1-r)$).
- **Дискретный случай:** $F$ ступенчатая, «обращение» — выбор той ступеньки, на уровень которой попало $r$, то есть номер $k$ с $F_{k-1}\le r<F_k$.

Корректность опирается на то, что для $R(0,1)$ вероятность попасть в промежуток равна его длине.`,
		related: ['ravnomernoe-raspredelenie', 'funkciya-raspredeleniya', 'razygryvanie']
	},

	'ispytanie-bernulli': {
		id: 'ispytanie-bernulli',
		term: 'Испытание Бернулли',
		short: String.raw`Опыт с двумя исходами: успех ($p$) или неудача ($1-p$).`,
		formula: String.raw`r<p\Rightarrow A;\quad r\ge p\Rightarrow \bar A`,
		body: String.raw`**Испытание Бернулли** — опыт с двумя исходами: «успех» $A$ с вероятностью $p$ и «неудача» [[protivopolozhnoe|$\bar A$]] с вероятностью $1-p$. Они образуют простейшую [[polnaya-gruppa|полную группу]].

Разыгрывание — одно неравенство: если $r<p$, наступил $A$; иначе $\bar A$. Это кирпичик для моделирования биномиального и геометрического законов.`,
		related: ['polnaya-gruppa', 'protivopolozhnoe', 'razygryvanie']
	},

	'chislovaya-harakteristika': {
		id: 'chislovaya-harakteristika',
		term: 'Числовая характеристика',
		short: String.raw`Число, сворачивающее СВ: $M(X)$, $D(X)$, вероятность.`,
		body: String.raw`**Числовая характеристика** — одно число, описывающее [[sluchaynaya-velichina|случайную величину]]: [[matematicheskoe-ozhidanie|математическое ожидание]] $M(X)$, [[dispersiya|дисперсия]] $D(X)$, вероятность события $P(A)$.

[[metod-monte-karlo|Метод Монте-Карло]] устроен так: искомую величину представляют как числовую характеристику подходящей СВ, а затем оценивают её по выборке розыгрышей.`,
		related: ['matematicheskoe-ozhidanie', 'metod-monte-karlo', 'sluchaynaya-velichina']
	}
};
