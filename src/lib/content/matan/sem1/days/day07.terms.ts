import type { Glossary } from '$lib/types';

// Термины, вводимые в день 7 (КЛК1 §9, конспект «Топология, метрические
// пространства», стр. 3–6). Термины канонического глоссария курса здесь
// намеренно НЕ переобъявляются, а только связываются через [[...]]:
//   metriki-rho, zamykanie, vykolotaya-okrestnost, dopolnenie,
//   komponenta-svyaznosti, skhodyashchayasya-v-sebe.
// Три карточки дня 6 (topologiya, otkrytoe-mnozhestvo, topologiya-r)
// продублированы здесь под углом этого дня, чтобы день резолвился
// независимо от соседних.
export const day07Terms: Glossary = {
	metrika: {
		id: 'metrika',
		term: 'Метрика',
		short: String.raw`Функция расстояния $\rho:M\times M\to\mathbb R$ с тремя аксиомами.`,
		formula: String.raw`\rho(x,y)\geqslant 0,\quad \rho(x,y)=0\iff x=y,\quad \rho(x,y)=\rho(y,x),\quad \rho(x,y)+\rho(y,z)\geqslant\rho(x,z)`,
		body: String.raw`**Метрика** — функция $\rho:M\times M\to\mathbb R$, удовлетворяющая трём аксиомам: неотрицательность вместе с $\rho(x,y)=0\iff x=y$; симметрия; [[neravenstvo-treugolnika|неравенство треугольника]]. Преподаватель называет её тремя словами вперемешку: **метрика**, **функция расстояния**, **функция длины**.

Аксиомы избыточны: неотрицательность следует из двух остальных, ведь $2\rho(x,y)=\rho(x,y)+\rho(y,x)\geqslant\rho(x,x)=0$. ⚠️ В конспекте первая аксиома записана с квантором только по $x$ — описка, переменных две. Пара $(M,\rho)$ — [[metricheskoe-prostranstvo|метрическое пространство]].`,
		related: ['metricheskoe-prostranstvo', 'neravenstvo-treugolnika', 'metriki-rho', 'shar']
	},

	'metricheskoe-prostranstvo': {
		id: 'metricheskoe-prostranstvo',
		term: 'Метрическое пространство',
		short: String.raw`Пара $(M,\rho)$: множество и метрика на нём.`,
		formula: String.raw`(M,\rho),\qquad \rho:M\times M\to\mathbb R`,
		body: String.raw`**Метрическое пространство** — пара $(M,\rho)$, где $M$ — произвольное множество, а $\rho$ — [[metrika|метрика]] на нём. В конспекте встречается и запись $(S,\rho)$.

В курсе оно занимает средний этаж цепочки «топологическое $\to$ метрическое $\to$ нормированное»: сверху метрика порождает [[inducirovannaya-topologiya|топологию]], снизу сама порождается нормой формулой $\rho(x,y)=\|x-y\|$. Структура богаче топологической: разные метрики могут задавать одну топологию, поэтому обратного восстановления нет.`,
		related: ['metrika', 'inducirovannaya-topologiya', 'shar', 'metriki-rho']
	},

	'neravenstvo-treugolnika': {
		id: 'neravenstvo-treugolnika',
		term: 'Неравенство треугольника',
		short: String.raw`Объезд через третью точку не бывает короче прямого пути.`,
		formula: String.raw`\rho(x,y)+\rho(y,z)\geqslant\rho(x,z)`,
		body: String.raw`Третья аксиома [[metrika|метрики]]: $\rho(x,y)+\rho(y,z)\geqslant\rho(x,z)$ для всех $x,y,z$. В конспекте записана именно в такой форме — «сумма двух сторон не меньше третьей».

Это рабочая лошадь всей теории: на ней держится лемма о сдвиге радиуса (шар вокруг любой своей точки содержит шар), а значит и вся [[inducirovannaya-topologiya|индуцированная топология]]. Для [[p-metrika|$p$-метрики]] она верна лишь при $k\geqslant 1$ — это неравенство Минковского; при $k<1$ ломается на тройке $(0,0)$, $(1,0)$, $(1,1)$.`,
		related: ['metrika', 'p-metrika', 'inducirovannaya-topologiya', 'shar']
	},

	shar: {
		id: 'shar',
		term: 'Открытый шар',
		short: String.raw`$B_{x_0}(r)$ — точки строго ближе $r$ к центру.`,
		formula: String.raw`B_{x_0}(r)=\{x\in M:\ \rho(x_0,x)<r\}`,
		body: String.raw`**Открытый шар** в [[metricheskoe-prostranstvo|метрическом пространстве]] — множество точек, удалённых от центра меньше чем на $r$. На прямой это интервал: $B_{52}(4{,}5)=(47{,}5;56{,}5)$ — пример конспекта.

⚠️ Обозначение плавает: на стр. 5 центр внизу ($B_{x_0}(r)$), на стр. 8 — радиус внизу ($B_r(x_0)$). Форма шара задаётся метрикой: круг у $\rho_2$, квадрат у [[chebyshevskaya-metrika|$\rho_\infty$]], ромб у [[manhettenskaya-metrika|$\rho_1$]]. Шары порождают [[inducirovannaya-topologiya|индуцированную топологию]].`,
		related: ['zamknutyy-shar', 'metricheskoe-prostranstvo', 'inducirovannaya-topologiya', 'metriki-rho']
	},

	'zamknutyy-shar': {
		id: 'zamknutyy-shar',
		term: 'Замкнутый шар',
		short: String.raw`$\overline{B_{x_0}}(r)$ — то же, но с нестрогим неравенством.`,
		formula: String.raw`\overline{B_{x_0}}(r)=\{x\in M:\ \rho(x_0,x)\leqslant r\}`,
		body: String.raw`**Замкнутый шар** отличается от [[shar|открытого]] знаком: расстояние до центра не больше $r$. В $\mathbb R$ это отрезок $[x_0-r;\,x_0+r]$ против интервала у открытого.

⚠️ Замкнутый шар и [[zamykanie|замыкание]] открытого шара — вообще говоря разные множества. В [[diskretnaya-metrika|дискретной метрике]] $B_x(1)=\{x\}$, замыкание одноточечного множества — оно же, а $\overline{B_x}(1)=M$: разница между «точкой» и «всем пространством».`,
		related: ['shar', 'zamykanie', 'diskretnaya-metrika', 'metricheskoe-prostranstvo']
	},

	'p-metrika': {
		id: 'p-metrika',
		term: 'p-метрика ρₖ',
		short: String.raw`Корень степени $k$ из суммы $k$-х степеней модулей; нужно $k\geqslant1$.`,
		formula: String.raw`\rho_k(x,y)=\Bigl(\sum_{i=1}^{n}|x_i-y_i|^{k}\Bigr)^{1/k},\qquad k\geqslant 1`,
		body: String.raw`**$p$-метрика** — общая формула, из которой при $k=1$ получается [[manhettenskaya-metrika|манхэттенская]], при $k=2$ евклидова, а в пределе $k\to\infty$ — [[chebyshevskaya-metrika|чебышёвская]] метрика.

⚠️ В конспекте (стр. 4) записана как $\rho^{t}=\sqrt[t]{(x_2-x_1)^t+(y_2-y_1)^t}$ — без модулей и без условия $t\geqslant1$. При нечётном $t$ подкоренное бывает отрицательным ($\rho^3=-1$), при $0<t<1$ рушится [[neravenstvo-treugolnika|неравенство треугольника]]. В ДЗ1.5 встречается $k=4$ — там чётность показателя случайно спасает запись.`,
		related: ['metriki-rho', 'manhettenskaya-metrika', 'chebyshevskaya-metrika', 'neravenstvo-treugolnika']
	},

	'manhettenskaya-metrika': {
		id: 'manhettenskaya-metrika',
		term: 'Манхэттенская метрика ρ₁',
		short: String.raw`Сумма модулей покоординатных разностей — «путь такси по кварталам».`,
		formula: String.raw`\rho_1(x,y)=\sum_{i=1}^{n}|x_i-y_i|`,
		body: String.raw`**Манхэттенская метрика** $\rho_1$ — сумма модулей разностей координат, случай $k=1$ [[p-metrika|$p$-метрики]]. Название от сетки улиц: по диагонали квартала не проехать.

[[shar|Шар]] в ней — квадрат, поставленный на угол: $|x|+|y|<r$ даёт ромб с диагоналями $2r$ и площадью $2r^2$. Из $\rho_\infty\leqslant\rho_2\leqslant\rho_1$ следует, что этот ромб — самый маленький шар среди шаров семейства одного радиуса, но [[inducirovannaya-topologiya|топологию]] на $\mathbb R^n$ все они задают одну.`,
		related: ['metriki-rho', 'p-metrika', 'chebyshevskaya-metrika', 'shar']
	},

	'chebyshevskaya-metrika': {
		id: 'chebyshevskaya-metrika',
		term: 'Чебышёвская метрика ρ∞',
		short: String.raw`Максимум модулей покоординатных разностей — «ход короля».`,
		formula: String.raw`\rho_\infty(x,y)=\max_{1\leqslant i\leqslant n}|x_i-y_i|`,
		body: String.raw`**Чебышёвская метрика** $\rho_\infty$ — максимум модулей разностей координат; в конспекте пишется $\rho^\infty$. Это предел [[p-metrika|$\rho_k$]] при $k\to\infty$: из $m\leqslant\rho_k\leqslant m\,n^{1/k}$ и $n^{1/k}\to1$.

[[shar|Шар]] в ней — куб (на плоскости квадрат со стороной $2r$), поэтому именно в $\rho_\infty$ удобно доказывать компактность в $\mathbb R^n$: покрытие кубами делится пополам без остатка. На шахматной доске это ровно число ходов короля.`,
		related: ['metriki-rho', 'p-metrika', 'manhettenskaya-metrika', 'shar']
	},

	'diskretnaya-metrika': {
		id: 'diskretnaya-metrika',
		term: 'Дискретная метрика',
		short: String.raw`$\rho=0$ на совпадающих точках и $\rho=1$ на всех остальных.`,
		formula: String.raw`\rho(x,y)=\begin{cases}0,& x=y\\ 1,& x\ne y\end{cases}`,
		body: String.raw`**Дискретная метрика** различает только «то же место или другое». [[neravenstvo-treugolnika|Неравенство треугольника]] проверяется разбором: если $\rho(x,z)=1$, то $y$ отличается хотя бы от одного конца, и слева стоит не меньше единицы.

[[shar|Шары]] здесь всего двух видов: $B_x(r)=\{x\}$ при $r\leqslant1$ и $B_x(r)=M$ при $r>1$. Отсюда [[inducirovannaya-topologiya|индуцированная топология]] — дискретная, то есть открыто вообще всё: $\tau_\rho=2^M$. Обратное восстановление невозможно.`,
		related: ['metrika', 'shar', 'inducirovannaya-topologiya', 'zvezdnaya-metrika']
	},

	'zvezdnaya-metrika': {
		id: 'zvezdnaya-metrika',
		term: 'Звёздная метрика (французская железная дорога)',
		short: String.raw`Расстояние 1 до выделенного центра и 2 между любыми не-центрами.`,
		formula: String.raw`\rho(x_0,x)=1\ (x\ne x_0),\qquad \rho(x,y)=2\ (x\ne y,\ x,y\ne x_0)`,
		body: String.raw`**Звёздная метрика** (пример 4 конспекта): фиксируется центр $x_0$, до него расстояние 1, между любыми двумя не-центрами — 2. Равенство $1+1=2$ означает, что путь через центр стоит ровно столько же, сколько прямой — отсюда имя «французская железная дорога» (пересадка в Париже).

Главный урок: [[metrika|метрика]] не обязана быть связана с геометрией. На $\mathbb R^2$ точки $(1,0)$ и $(1{,}000001,0)$ удалены на 2 — дальше, чем каждая от центра. В стандартной записи вместо констант берут настоящие расстояния до $x_0$; в конспекте дан дискретный вариант.`,
		related: ['metrika', 'diskretnaya-metrika', 'neravenstvo-treugolnika', 'metricheskoe-prostranstvo']
	},

	'inducirovannaya-topologiya': {
		id: 'inducirovannaya-topologiya',
		term: 'Индуцированная метрикой топология',
		short: String.raw`Открыто то, что вместе с каждой точкой содержит шар вокруг неё.`,
		formula: String.raw`\tau_\rho=\{U\subset M:\ \forall x\in U\ \exists r>0\ \ B_x(r)\subset U\}`,
		body: String.raw`**Индуцированная метрикой топология** $\tau_\rho$: множество открыто, если у каждой его точки есть запас — [[shar|шар]], целиком лежащий внутри. Шары при этом сами открыты (лемма о сдвиге радиуса: $B_y(r-\rho(x,y))\subset B_x(r)$), а всякое открытое множество — их объединение.

⚠️ В конспекте эта связь **не установлена**: шары определены, но то, что они порождают [[topologiya|топологию]], не доказано. Между тем КЛК1 §9 требует её и в общем случае, и в $\mathbb R$ — обоими пунктами жирным. В $\mathbb R$ шар — интервал, и наоборот, поэтому $\tau_\rho$ совпадает со [[topologiya-r|стандартной топологией на $\mathbb R$]].`,
		related: ['shar', 'topologiya', 'topologiya-r', 'metricheskoe-prostranstvo']
	},

	topologiya: {
		id: 'topologiya',
		term: 'Топология',
		short: String.raw`Набор подмножеств $\tau\subset 2^S$ с четырьмя аксиомами.`,
		formula: String.raw`\varnothing\in\tau,\quad S\in\tau,\quad \bigcup_{i\in I}x_i\in\tau,\quad \bigcap_{i=1}^{r}x_i\in\tau`,
		body: String.raw`**Топология** на $S$ — набор его подмножеств $\tau$ с четырьмя аксиомами: $\varnothing\in\tau$; $S\in\tau$; объединение по **произвольному** множеству индексов остаётся в $\tau$; пересечение **конечного** набора остаётся в $\tau$ (день 6).

Асимметрия объединения и пересечения всплывает и здесь: в доказательстве того, что шары порождают [[inducirovannaya-topologiya|топологию]], конечность нужна ровно один раз — чтобы взять $\min(r_1,\dots,r_n)>0$. У бесконечного набора радиусов нижняя грань может быть нулём.`,
		related: ['otkrytoe-mnozhestvo', 'inducirovannaya-topologiya', 'topologiya-r', 'komponenta-svyaznosti']
	},

	'otkrytoe-mnozhestvo': {
		id: 'otkrytoe-mnozhestvo',
		term: 'Открытое множество',
		short: String.raw`Открыто = лежит в $\tau$; в метрике — «у каждой точки есть шар внутри».`,
		formula: String.raw`x\ \text{открыто}\iff x\in\tau`,
		body: String.raw`**Открытое множество** в $(S,\tau)$ — это в точности элемент [[topologiya|топологии]]: открытость не проверяется, а назначается выбором $\tau$ (день 6).

В [[metricheskoe-prostranstvo|метрическом пространстве]] выбор канонический, и появляется рабочий критерий: $U$ открыто тогда и только тогда, когда каждая его точка входит в $U$ вместе с некоторым [[shar|шаром]]. Именно так школьное «интервал открыт, отрезок нет» получает доказательство, а не остаётся картинкой.`,
		related: ['topologiya', 'inducirovannaya-topologiya', 'shar', 'dopolnenie']
	},

	'topologiya-r': {
		id: 'topologiya-r',
		term: 'Стандартная топология на ℝ',
		short: String.raw`Открыты $\varnothing$, $\mathbb R$, интервалы, лучи и их объединения.`,
		formula: String.raw`(x;y)=B_{(x+y)/2}\Bigl(\tfrac{y-x}{2}\Bigr)`,
		body: String.raw`Конспект задаёт [[topologiya|топологию]] на $\mathbb R$ списком: $\varnothing$, $\mathbb R$, интервалы $(x;y)$, лучи, объединения и пересечения (день 8).

День 7 показывает, откуда этот список берётся: для $\rho(x,y)=|x-y|$ [[shar|шар]] — это интервал $B_{x_0}(r)=(x_0-r;x_0+r)$, а всякий интервал — шар с центром в середине. Поэтому [[inducirovannaya-topologiya|индуцированная метрикой топология]] совпадает со стандартной, а лучи получаются объединением интервалов. ⚠️ В самом списке потеряна конечность пересечения — контрпример $\bigcap_n(-1/n;1/n)=\{0\}$.`,
		related: ['topologiya', 'inducirovannaya-topologiya', 'shar', 'otkrytoe-mnozhestvo']
	}
};
