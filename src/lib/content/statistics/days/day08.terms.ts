import type { Glossary } from '$lib/types';

// Новые термины дня 8 (ch08): системы СВ, ковариация и корреляция.
// Расширяют базовый глоссарий; ссылаются на него по id (sobytie, nesovmestnye,
// polnaya-gruppa и т.д.) и друг на друга.
export const day08Terms: Glossary = {
	'sluchaynyy-vektor': {
		id: 'sluchaynyy-vektor',
		term: 'Случайный вектор',
		short: String.raw`Упорядоченный набор СВ на одном $\Omega$: $(\xi_1,\dots,\xi_n)$.`,
		formula: String.raw`(\xi_1,\dots,\xi_n)`,
		body: String.raw`**Случайный вектор** (система случайных величин) — упорядоченный набор $(\xi_1(\omega),\dots,\xi_n(\omega))$, заданный на **одном** [[prostranstvo-ishodov|пространстве исходов]] $\Omega$. Каждому исходу сопоставляется сразу несколько чисел (рост и вес, цена и спрос).

Основной случай — двумерный вектор $(\xi,\eta)$; его поведение полностью описывает [[sovmestnoe-raspredelenie|совместное распределение]].`,
		related: ['sovmestnoe-raspredelenie', 'marginalnoe-raspredelenie']
	},

	'sovmestnoe-raspredelenie': {
		id: 'sovmestnoe-raspredelenie',
		term: 'Совместное распределение',
		short: String.raw`Вероятности $p_{ij}=P\{\xi=x_i;\ \eta=y_j\}$ всех пар значений.`,
		formula: String.raw`p_{ij}=P\{\xi=x_i;\ \eta=y_j\}`,
		body: String.raw`**Совместный закон** дискретного [[sluchaynyy-vektor|вектора]] $(\xi,\eta)$ — набор вероятностей $$p_{ij}=P\{\xi=x_i;\ \eta=y_j\}.$$ События $\{\xi=x_i;\ \eta=y_j\}$ попарно [[nesovmestnye|несовместны]] и образуют [[polnaya-gruppa|полную группу]], поэтому $p_{ij}\ge0$ и $\sum_{i,j}p_{ij}=1$.

Записывается таблицей с двумя входами. Несёт **полную** информацию о системе: из него выводятся и [[marginalnoe-raspredelenie|маргиналы]], и зависимость.`,
		related: ['sluchaynyy-vektor', 'marginalnoe-raspredelenie', 'nezavisimost-sv']
	},

	'marginalnoe-raspredelenie': {
		id: 'marginalnoe-raspredelenie',
		term: 'Маргинальное распределение',
		short: String.raw`Распределение одной компоненты: $p_i=\sum_j p_{ij}$.`,
		formula: String.raw`p_i=\sum_j p_{ij},\quad p_j=\sum_i p_{ij}`,
		body: String.raw`**Маргинальный** (краевой) закон компоненты получается суммированием [[sovmestnoe-raspredelenie|совместных вероятностей]] по «лишней» переменной: $$p_i=\sum_j p_{ij}=P\{\xi=x_i\},\qquad p_j=\sum_i p_{ij}=P\{\eta=y_j\}.$$ В таблице это суммы по строкам и столбцам (отсюда «краевой»).

**Важно:** по двум маргиналам совместное распределение, вообще говоря, не восстанавливается — они не содержат информации о связи компонент.`,
		related: ['sovmestnoe-raspredelenie', 'nezavisimost-sv']
	},

	'nezavisimost-sv': {
		id: 'nezavisimost-sv',
		term: 'Независимость СВ',
		short: String.raw`$p_{ij}=p_i\,p_j$ для всех пар значений.`,
		formula: String.raw`p_{ij}=p_i\,p_j`,
		body: String.raw`Дискретные $\xi$ и $\eta$ **независимы**, если каждая [[sovmestnoe-raspredelenie|совместная вероятность]] равна произведению [[marginalnoe-raspredelenie|маргинальных]]: $$p_{ij}=p_i\,p_j\quad\forall\,x_i,y_j.$$ Практический критерий: если хоть в одной клетке $p_{ij}\neq p_i\,p_j$ — величины зависимы.

Из независимости следует $M(XY)=MX\,MY$ и $\operatorname{cov}(X,Y)=0$. Обратное **неверно**: нулевая [[kovariaciya|ковариация]] независимости не гарантирует.`,
		related: ['sovmestnoe-raspredelenie', 'marginalnoe-raspredelenie', 'kovariaciya']
	},

	'matozhidanie-proizvedeniya': {
		id: 'matozhidanie-proizvedeniya',
		term: 'Мат. ожидание произведения',
		short: String.raw`$M(XY)=\sum_{i,j} x_i y_j\,p_{ij}$; для независимых $=MX\cdot MY$.`,
		formula: String.raw`M(XY)=\sum_{i,j} x_i\,y_j\,p_{ij}`,
		body: String.raw`**Математическое ожидание произведения** компонент: $$M(XY)=\sum_i\sum_j x_i\,y_j\,p_{ij}.$$ Для [[nezavisimost-sv|независимых]] величин $M(XY)=MX\cdot MY$. Именно отклонение $M(XY)$ от $MX\,MY$ служит мерой связи и даёт рабочую формулу [[kovariaciya|ковариации]].`,
		related: ['kovariaciya', 'nezavisimost-sv']
	},

	kovariaciya: {
		id: 'kovariaciya',
		term: 'Ковариация',
		short: String.raw`$\operatorname{cov}(X,Y)=M((X-MX)(Y-MY))=M(XY)-MX\,MY$.`,
		formula: String.raw`\operatorname{cov}(X,Y)=M(XY)-MX\cdot MY`,
		body: String.raw`**Ковариация** — мат. ожидание произведения отклонений от средних: $$\operatorname{cov}(X,Y)=M\big((X-MX)(Y-MY)\big)=M(XY)-MX\cdot MY.$$ Знак показывает направление линейной связи (плюс — прямая, минус — обратная). Свойства: симметрична, $\operatorname{cov}(X,X)=DX$, $\operatorname{cov}(CX,Y)=C\operatorname{cov}(X,Y)$, аддитивна.

Для [[nezavisimost-sv|независимых]] $\operatorname{cov}=0$ (обратное неверно). Зависит от масштаба, поэтому тесноту связи измеряют [[koefficient-korrelyacii|коэффициентом корреляции]].`,
		related: ['matozhidanie-proizvedeniya', 'koefficient-korrelyacii', 'kovariacionnaya-matrica', 'nekorrelirovannye']
	},

	'koefficient-korrelyacii': {
		id: 'koefficient-korrelyacii',
		term: 'Коэффициент корреляции',
		short: String.raw`$r_{xy}=\dfrac{\operatorname{cov}(X,Y)}{\sigma_x\sigma_y}$, $-1\le r\le1$.`,
		formula: String.raw`r_{xy}=\frac{\operatorname{cov}(X,Y)}{\sigma_x\,\sigma_y}`,
		body: String.raw`**Коэффициент корреляции** — [[kovariaciya|ковариация]] [[normirovannaya-velichina|нормированных величин]], то есть нормированная на масштаб ковариация: $$r_{xy}=\frac{\operatorname{cov}(X,Y)}{\sigma_x\,\sigma_y}.$$ Безразмерен и не зависит от единиц измерения. Свойства:

- $-1\le r_{xy}\le1$ (из неравенства Коши–Буняковского);
- $|r_{xy}|=1$ $\Leftrightarrow$ точная линейная связь $Y=AX+B$;
- $r_{xy}=0$ — нет **линейной** связи ([[nekorrelirovannye|некоррелированы]]), но зависимость может быть нелинейной.`,
		related: ['kovariaciya', 'normirovannaya-velichina', 'nekorrelirovannye', 'korrelyacionnaya-matrica']
	},

	'normirovannaya-velichina': {
		id: 'normirovannaya-velichina',
		term: 'Нормированная величина',
		short: String.raw`$U=\dfrac{X-MX}{\sigma_x}$: центрирована и стандартизована.`,
		formula: String.raw`U=\frac{X-MX}{\sigma_x}`,
		body: String.raw`**Нормированная** (центрированная и стандартизованная) величина $$U=\frac{X-MX}{\sigma_x}.$$ У неё $M(U)=0$ и $D(U)=1$: вычитание среднего убирает сдвиг, деление на $\sigma_x$ — масштаб. Ковариация нормированных величин и есть [[koefficient-korrelyacii|коэффициент корреляции]].`,
		related: ['koefficient-korrelyacii', 'kovariaciya']
	},

	nekorrelirovannye: {
		id: 'nekorrelirovannye',
		term: 'Некоррелированные величины',
		short: String.raw`$\operatorname{cov}(X,Y)=0$ (нет линейной связи).`,
		body: String.raw`$X$ и $Y$ **некоррелированы**, если $\operatorname{cov}(X,Y)=0$ (равносильно $r_{xy}=0$). Это означает отсутствие **линейной** связи. [[nezavisimost-sv|Независимость]] $\Rightarrow$ некоррелированность, но **не наоборот**: например, для $Y=X^2$ при симметричном $X$ ковариация нулевая, хотя $Y$ полностью определяется $X$.`,
		related: ['kovariaciya', 'koefficient-korrelyacii', 'nezavisimost-sv']
	},

	'kovariacionnaya-matrica': {
		id: 'kovariacionnaya-matrica',
		term: 'Ковариационная матрица',
		short: String.raw`Симметричная матрица $\Sigma$: дисперсии на диагонали, ковариации вне.`,
		formula: String.raw`\Sigma=\begin{pmatrix}DX & \sigma_{xy}\\ \sigma_{xy} & DY\end{pmatrix}`,
		body: String.raw`**Ковариационная матрица** сводит результаты анализа системы: на диагонали — дисперсии компонент, вне — их [[kovariaciya|ковариации]] $\sigma_{ij}=\operatorname{cov}(\xi_i,\xi_j)$. $$\Sigma=\begin{pmatrix}DX & \sigma_{xy}\\ \sigma_{xy} & DY\end{pmatrix}.$$ Симметрична (так как $\sigma_{xy}=\sigma_{yx}$) и неотрицательно определена. Для $n$-мерного вектора — матрица $n\times n$.`,
		related: ['kovariaciya', 'korrelyacionnaya-matrica']
	},

	'korrelyacionnaya-matrica': {
		id: 'korrelyacionnaya-matrica',
		term: 'Корреляционная матрица',
		short: String.raw`Симметричная матрица $R$ с единицами на диагонали.`,
		formula: String.raw`R=\begin{pmatrix}1 & r_{xy}\\ r_{xy} & 1\end{pmatrix}`,
		body: String.raw`**Корреляционная матрица** составлена из [[koefficient-korrelyacii|коэффициентов корреляции]] $r_{ij}=\sigma_{ij}/(\sigma_i\sigma_j)$. На диагонали — единицы ($r_{ii}=1$), вне — попарные корреляции. $$R=\begin{pmatrix}1 & r_{xy}\\ r_{xy} & 1\end{pmatrix}.$$ Это нормированная версия [[kovariacionnaya-matrica|ковариационной матрицы]]; масштаб убран, остаётся только теснота связей.`,
		related: ['koefficient-korrelyacii', 'kovariacionnaya-matrica']
	},

	'uslovnoe-raspredelenie-sv': {
		id: 'uslovnoe-raspredelenie-sv',
		term: 'Условное распределение',
		short: String.raw`$P\{\xi=x_i\mid\eta=y_j\}=p_{ij}/p_j$.`,
		formula: String.raw`P\{\xi=x_i\mid\eta=y_j\}=\frac{p_{ij}}{p_j}`,
		body: String.raw`**Условный закон** компоненты $\xi$ при фиксированном $\{\eta=y_j\}$ (для $p_j>0$): $$P\{\xi=x_i\mid\eta=y_j\}=\frac{p_{ij}}{p_j}.$$ При каждом $j$ это полноценное распределение (неотрицательно, в сумме $1$). [[nezavisimost-sv|Независимость]] наглядно формулируется так: условный закон **не зависит** от условия, $P\{\xi=x_i\mid\eta=y_j\}=P\{\xi=x_i\}$.`,
		related: ['sovmestnoe-raspredelenie', 'marginalnoe-raspredelenie', 'nezavisimost-sv']
	}
};
