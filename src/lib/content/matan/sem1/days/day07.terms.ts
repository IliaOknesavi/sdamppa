import type { Glossary } from '$lib/types';

// Термины, вводимые в день 7. Термины, канонически определённые в других
// днях, здесь намеренно НЕ переобъявляются, а только связываются через [[...]]:
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
		body: String.raw`**Метрика** — функция $\rho:M\times M\to\mathbb R$, удовлетворяющая трём аксиомам: неотрицательность вместе с $\rho(x,y)=0\iff x=y$; симметрия; [[neravenstvo-treugolnika|неравенство треугольника]]; кванторы во всех трёх идут по всем участвующим переменным. У неё три равноправных имени: **метрика**, **функция расстояния**, **функция длины**. Список аксиом избыточен: неотрицательность следует из двух остальных. Пара $(M,\rho)$ — [[metricheskoe-prostranstvo|метрическое пространство]].`,
		related: ['metricheskoe-prostranstvo', 'neravenstvo-treugolnika', 'metriki-rho', 'shar']
	},

	'metricheskoe-prostranstvo': {
		id: 'metricheskoe-prostranstvo',
		term: 'Метрическое пространство',
		short: String.raw`Пара $(M,\rho)$: множество и метрика на нём.`,
		formula: String.raw`(M,\rho),\qquad \rho:M\times M\to\mathbb R`,
		body: String.raw`**Метрическое пространство** — пара $(M,\rho)$, где $M$ — произвольное множество, а $\rho$ — [[metrika|метрика]] на нём. Оно занимает средний этаж цепочки «топологическое $\to$ метрическое $\to$ нормированное»: сверху метрика порождает [[inducirovannaya-topologiya|топологию]], снизу сама порождается нормой формулой $\rho(x,y)=\|x-y\|$. Структура богаче топологической — разные метрики могут задавать одну топологию, и обратного восстановления нет.`,
		related: ['metrika', 'inducirovannaya-topologiya', 'shar', 'metriki-rho']
	},

	'neravenstvo-treugolnika': {
		id: 'neravenstvo-treugolnika',
		term: 'Неравенство треугольника',
		short: String.raw`Объезд через третью точку не бывает короче прямого пути.`,
		formula: String.raw`\rho(x,y)+\rho(y,z)\geqslant\rho(x,z)`,
		body: String.raw`Третья аксиома [[metrika|метрики]]: $\rho(x,y)+\rho(y,z)\geqslant\rho(x,z)$ для всех $x,y,z$. Словами — «сумма двух сторон не меньше третьей». Для [[p-metrika|$p$-метрики]] неравенство верно лишь при $k\geqslant 1$ — это неравенство Минковского; при $k<1$ оно ломается уже на тройке $(0,0)$, $(1,0)$, $(1,1)$.`,
		related: ['metrika', 'p-metrika', 'inducirovannaya-topologiya', 'shar']
	},

	shar: {
		id: 'shar',
		term: 'Открытый шар',
		short: String.raw`$B_{x_0}(r)$ — точки строго ближе $r$ к центру.`,
		formula: String.raw`B_{x_0}(r)=\{x\in M:\ \rho(x_0,x)<r\}`,
		body: String.raw`**Открытый шар** в [[metricheskoe-prostranstvo|метрическом пространстве]] — множество точек, удалённых от центра меньше чем на $r$. На прямой это интервал: $B_{52}(4{,}5)=(47{,}5;56{,}5)$. Форма шара целиком задаётся метрикой: круг у $\rho_2$, квадрат у [[chebyshevskaya-metrika|$\rho_\infty$]], ромб у [[manhettenskaya-metrika|$\rho_1$]].`,
		related: ['zamknutyy-shar', 'metricheskoe-prostranstvo', 'inducirovannaya-topologiya', 'metriki-rho']
	},

	'zamknutyy-shar': {
		id: 'zamknutyy-shar',
		term: 'Замкнутый шар',
		short: String.raw`$\overline{B_{x_0}}(r)$ — то же, но с нестрогим неравенством.`,
		formula: String.raw`\overline{B_{x_0}}(r)=\{x\in M:\ \rho(x_0,x)\leqslant r\}`,
		body: String.raw`**Замкнутый шар** отличается от [[shar|открытого]] знаком: расстояние до центра не больше $r$. В $\mathbb R$ это отрезок $[x_0-r;\,x_0+r]$ против интервала у открытого. Не путать его с [[zamykanie|замыканием]] открытого шара — это вообще говоря разные множества: в [[diskretnaya-metrika|дискретной метрике]] $B_x(1)=\{x\}$ и замыкание одноточечного множества — оно же, а $\overline{B_x}(1)=M$.`,
		related: ['shar', 'zamykanie', 'diskretnaya-metrika', 'metricheskoe-prostranstvo']
	},

	'p-metrika': {
		id: 'p-metrika',
		term: 'p-метрика ρₖ',
		short: String.raw`Корень степени $k$ из суммы $k$-х степеней модулей; нужно $k\geqslant1$.`,
		formula: String.raw`\rho_k(x,y)=\Bigl(\sum_{i=1}^{n}|x_i-y_i|^{k}\Bigr)^{1/k},\qquad k\geqslant 1`,
		body: String.raw`**$p$-метрика** — общая формула, из которой при $k=1$ получается [[manhettenskaya-metrika|манхэттенская]], при $k=2$ евклидова, а в пределе $k\to\infty$ — [[chebyshevskaya-metrika|чебышёвская]] метрика. Ни модули под степенью, ни условие $k\geqslant1$ отбрасывать нельзя: без модулей при нечётном показателе подкоренное выражение бывает отрицательным (для $x=(1,0)$, $y=(0,0)$ и $k=3$ получается $\rho^3=-1$), а при $0<k<1$ рушится [[neravenstvo-treugolnika|неравенство треугольника]]. При чётном показателе запись без модулей случайно спасается: чётная степень сама играет роль модуля.`,
		related: ['metriki-rho', 'manhettenskaya-metrika', 'chebyshevskaya-metrika', 'neravenstvo-treugolnika']
	},

	'manhettenskaya-metrika': {
		id: 'manhettenskaya-metrika',
		term: 'Манхэттенская метрика ρ₁',
		short: String.raw`Сумма модулей покоординатных разностей — «путь такси по кварталам».`,
		formula: String.raw`\rho_1(x,y)=\sum_{i=1}^{n}|x_i-y_i|`,
		body: String.raw`**Манхэттенская метрика** $\rho_1$ — сумма модулей разностей координат, случай $k=1$ [[p-metrika|$p$-метрики]]. Название от сетки улиц: по диагонали квартала не проехать. [[shar|Шар]] в ней — квадрат, поставленный на угол: $|x|+|y|<r$ даёт ромб с диагоналями $2r$ и площадью $2r^2$; по цепочке $\rho_\infty\leqslant\rho_2\leqslant\rho_1$ это самый маленький шар среди шаров семейства одного радиуса.`,
		related: ['metriki-rho', 'p-metrika', 'chebyshevskaya-metrika', 'shar']
	},

	'chebyshevskaya-metrika': {
		id: 'chebyshevskaya-metrika',
		term: 'Чебышёвская метрика ρ∞',
		short: String.raw`Максимум модулей покоординатных разностей — «ход короля».`,
		formula: String.raw`\rho_\infty(x,y)=\max_{1\leqslant i\leqslant n}|x_i-y_i|`,
		body: String.raw`**Чебышёвская метрика** $\rho_\infty$ — максимум модулей разностей координат. Это предел [[p-metrika|$\rho_k$]] при $k\to\infty$: из $m\leqslant\rho_k\leqslant m\,n^{1/k}$ и $n^{1/k}\to1$. [[shar|Шар]] в ней — куб, на плоскости квадрат со стороной $2r$; на шахматной доске $\rho_\infty$ — ровно число ходов короля.`,
		related: ['metriki-rho', 'p-metrika', 'manhettenskaya-metrika', 'shar']
	},

	'diskretnaya-metrika': {
		id: 'diskretnaya-metrika',
		term: 'Дискретная метрика',
		short: String.raw`$\rho=0$ на совпадающих точках и $\rho=1$ на всех остальных.`,
		formula: String.raw`\rho(x,y)=\begin{cases}0,& x=y\\ 1,& x\ne y\end{cases}`,
		body: String.raw`**Дискретная метрика** различает только «то же место или другое»: $\rho(x,y)=0$ при $x=y$ и $\rho(x,y)=1$ при $x\ne y$. [[shar|Шары]] здесь всего двух видов — $B_x(r)=\{x\}$ при $r\leqslant1$ и $B_x(r)=M$ при $r>1$, поэтому [[inducirovannaya-topologiya|индуцированная топология]] оказывается дискретной: открыто вообще всё, $\tau_\rho=2^M$.`,
		related: ['metrika', 'shar', 'inducirovannaya-topologiya', 'zvezdnaya-metrika']
	},

	'zvezdnaya-metrika': {
		id: 'zvezdnaya-metrika',
		term: 'Звёздная метрика (французская железная дорога)',
		short: String.raw`Расстояние 1 до выделенного центра и 2 между любыми не-центрами.`,
		formula: String.raw`\rho(x_0,x)=1\ (x\ne x_0),\qquad \rho(x,y)=2\ (x\ne y,\ x,y\ne x_0)`,
		body: String.raw`**Звёздная метрика**: фиксируется центр $x_0$, до него расстояние 1, между любыми двумя не-центрами — 2. Равенство $1+1=2$ означает, что путь через центр стоит ровно столько же, сколько прямой, — в [[neravenstvo-treugolnika|неравенстве треугольника]] достигается равенство; отсюда имя «французская железная дорога» (пересадка в Париже). С геометрией такая [[metrika|метрика]] не связана: на $\mathbb R^2$ точки $(1,0)$ и $(1{,}000001,0)$ удалены на 2 — дальше, чем каждая от центра. Есть и непрерывный вариант: вместо констант 1 и 2 берут настоящие расстояния до $x_0$, $\rho(x,y)=\rho_2(x,x_0)+\rho_2(x_0,y)$ при $x\ne y$.`,
		related: ['metrika', 'diskretnaya-metrika', 'neravenstvo-treugolnika', 'metricheskoe-prostranstvo']
	},

	'inducirovannaya-topologiya': {
		id: 'inducirovannaya-topologiya',
		term: 'Индуцированная метрикой топология',
		short: String.raw`Открыто то, что вместе с каждой точкой содержит шар вокруг неё.`,
		formula: String.raw`\tau_\rho=\{U\subset M:\ \forall x\in U\ \exists r>0\ \ B_x(r)\subset U\}`,
		body: String.raw`**Индуцированная метрикой топология** $\tau_\rho$: множество открыто, если у каждой его точки есть запас — [[shar|шар]], целиком лежащий внутри. Сами шары при этом открыты, а всякое открытое множество — их объединение. Стрелка идёт только в одну сторону: разные метрики могут дать одну и ту же $\tau_\rho$ (скажем, $\rho$ и $\rho/(1+\rho)$), поэтому метрику по топологии не восстановить. В $\mathbb R$ шар — интервал, и наоборот, поэтому $\tau_\rho$ совпадает со [[topologiya-r|стандартной топологией на $\mathbb R$]].`,
		related: ['shar', 'topologiya', 'topologiya-r', 'metricheskoe-prostranstvo']
	},

};
