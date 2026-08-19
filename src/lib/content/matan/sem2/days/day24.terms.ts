import type { Glossary } from '$lib/types';

// Термины дня 24: замена переменных в кратном интеграле и якобиан.
// Карточки matrica-yakobi, yakobian, kratnyy-integral и teorema-fubini
// продублированы из дней 14 и 23 намеренно: день должен резолвиться
// независимо от того, открыты ли предыдущие. Термины, канонически
// принадлежащие другим дням, НЕ переобъявляются и используются только
// ссылками:
//   braket, lvtnp, klassy-differenciruemosti, rang-razbieniya, lsk,
//   nepravilnaya-mera-nol, mera-nol-v-rn, ravnomernaya-nepreryvnost,
//   additivnost-integrala, elementarnaya-funkciya,
//   n-nol-n-odin, dopolnenie, zamykanie,
//   vykolotaya-okrestnost, komponenta-svyaznosti, metriki-rho, end-r,
//   skalyarnoe-pole, lso, asimptoticheskie-klassy,
//   skhodyashchayasya-v-sebe, chastichnaya-posledovatelnost,
//   priznak-i-svoystvo, blacksquare.
export const day24Terms: Glossary = {
	'zamena-peremennyh-rn': {
		id: 'zamena-peremennyh-rn',
		term: 'Замена переменных в кратном интеграле',
		short: String.raw`Меняется область, а множителем входит модуль якобиана.`,
		formula: String.raw`\iint_D f(x,y)\,dx\,dy=\iint_{D'}f\bigl(F(u,v)\bigr)\,|J|\,du\,dv`,
		body: String.raw`Если $F:D'\to D$ — [[biektivnost-otobrazheniya|биекция]] класса $C^1$ с [[nevyrozhdennost-yakobiana|невырожденным]] [[yakobian|якобианом]], а $f\in C(D)$, то интеграл по старой области равен интегралу по новой с множителем $|J|$.

Смысл: в $\mathbb R^n$ заменяют не переменную, а **область** — обычно кривую область $D$ превращают в прямоугольник $D'$. Одномерное $dx=\varphi'(t)\,dt$ — частный случай при $n=1$, где матрица Якоби имеет размер $1\times1$.`,
		related: ['yakobian', 'biektivnost-otobrazheniya', 'koefficient-iskazheniya-ploshchadi', 'kratnyy-integral']
	},

	yakobian: {
		id: 'yakobian',
		term: 'Якобиан |J|',
		short: String.raw`Определитель матрицы Якоби; коэффициент искажения площади в точке.`,
		formula: String.raw`J=\frac{\partial(x,y)}{\partial(u,v)}=\det\begin{pmatrix}x'_u&x'_v\\ y'_u&y'_v\end{pmatrix}`,
		body: String.raw`**Якобиан** — определитель [[matrica-yakobi|матрицы Якоби]]; в интеграл он входит модулем $|J|$. Дробная запись $\partial(x,y)/\partial(u,v)$ хранит порядок расположением: сверху то, что дифференцируем, снизу — то, по чему.

Геометрически $|J|$ — [[koefficient-iskazheniya-ploshchadi|коэффициент искажения площади]] в точке, поэтому он и стоит множителем в формуле [[zamena-peremennyh-rn|замены переменных]]. Знак $J$ отвечает за ориентацию (сохраняется она или переворачивается), но в интеграле берётся модуль.`,
		related: ['matrica-yakobi', 'koefficient-iskazheniya-ploshchadi', 'zamena-peremennyh-rn', 'nevyrozhdennost-yakobiana']
	},

	'matrica-yakobi': {
		id: 'matrica-yakobi',
		term: 'Матрица Якоби jⁱₖ',
		short: String.raw`Все частные производные отображения; строка — новая координата.`,
		formula: String.raw`j^i_{\ k}=\frac{\partial \xi^i}{\partial x^k}`,
		body: String.raw`**Матрица Якоби** отображения $F:\mathbb R^n\to\mathbb R^m$ собрана из всех первых частных производных: строка нумеруется новой координатой, столбец — старой. Для [[skalyarnoe-pole|скалярного поля]] ($m=1$) она вырождается в одну строку — градиент.

Индексная запись $j^i_{\ k}=\partial\xi^i/\partial x^k$ требует двух систем координат — новой $\xi$ и старой $x$. Взяв обе координаты из одной системы, получаем [[simvol-kronekera|символ Кронекера]] $\partial x^i/\partial x^k=\delta^i_k$, то есть единичную матрицу и якобиан тождественного отображения. Верхний индекс — строка, нижний — столбец: матрица Якоби имеет тип $(1,1)$.`,
		related: ['yakobian', 'simvol-kronekera', 'skalyarnoe-pole', 'zamena-peremennyh-rn']
	},

	'koefficient-iskazheniya-ploshchadi': {
		id: 'koefficient-iskazheniya-ploshchadi',
		term: 'Коэффициент искажения площади',
		short: String.raw`Во столько раз отображение растягивает площадь малой клетки.`,
		formula: String.raw`\Delta S=|J|\cdot\Delta u\,\Delta v+\bar o(\Delta u\,\Delta v)`,
		body: String.raw`Геометрический смысл [[yakobian|якобиана]], полученный в дне 14. Образ малого прямоугольника $\Delta u\times\Delta v$ с точностью до $\bar o$ — параллелограмм, натянутый на столбцы [[matrica-yakobi|матрицы Якоби]], а площадь параллелограмма равна модулю определителя: проверяется на любом из них, школьное «основание на высоту» и определитель из сторон дают одно число.

Для доказательства теоремы о [[zamena-peremennyh-rn|замене переменных]] поточечного равенства мало: остаток должен быть мал одинаково для всех клеток разбиения сразу. Равномерную версию даёт гладкость на компакте.`,
		related: ['yakobian', 'zamena-peremennyh-rn', 'matrica-yakobi', 'polyarnye-koordinaty']
	},

	'polyarnye-koordinaty': {
		id: 'polyarnye-koordinaty',
		term: 'Полярные координаты (J = r)',
		short: String.raw`$x=r\cos\varphi$, $y=r\sin\varphi$; элемент площади $r\,dr\,d\varphi$.`,
		formula: String.raw`J=\det\begin{pmatrix}\cos\varphi&-r\sin\varphi\\ \sin\varphi&r\cos\varphi\end{pmatrix}=r`,
		body: String.raw`Самая частая [[zamena-peremennyh-rn|замена]]: круг и кольцо превращаются в прямоугольник. [[yakobian|Якобиан]] равен $r$, то есть $dx\,dy=r\,dr\,d\varphi$; множитель виден по сторонам клетки — $dr$ вдоль радиуса, $r\,d\varphi$ вдоль дуги.

В нуле замена вырождается: отрезок $\{r=0\}$ склеивается в точку ([[biektivnost-otobrazheniya|биекции]] нет) и $J=0$. Но это [[nepravilnaya-mera-nol|множество меры нуль]], поэтому формула остаётся верной. Именно $r$ позволяет взять [[integral-eylera-puassona|интеграл Эйлера–Пуассона]].`,
		related: ['yakobian', 'integral-eylera-puassona', 'cilindricheskie-koordinaty', 'nepravilnaya-mera-nol']
	},

	'cilindricheskie-koordinaty': {
		id: 'cilindricheskie-koordinaty',
		term: 'Цилиндрические координаты (J = r)',
		short: String.raw`Полярные в плоскости $xOy$ плюс нетронутая высота $z$.`,
		formula: String.raw`x=r\cos\varphi,\ y=r\sin\varphi,\ z=z;\qquad dV=r\,dr\,d\varphi\,dz`,
		body: String.raw`Замена для тел вращения и всего, что вытянуто вдоль оси: цилиндр, конус, часть трубы. Матрица Якоби блочная — к [[polyarnye-koordinaty|полярному]] блоку $2\times2$ добавлены единичные строка и столбец, поэтому определитель не меняется: $J=r$.

Практический признак выбора: если и область, и подынтегральная функция зависят от $x,y$ только через $x^2+y^2$, цилиндрическая замена разделяет переменные и превращает [[kratnyy-integral|кратный интеграл]] в произведение одномерных.`,
		related: ['polyarnye-koordinaty', 'sfericheskie-koordinaty', 'yakobian', 'kratnyy-integral']
	},

	'sfericheskie-koordinaty': {
		id: 'sfericheskie-koordinaty',
		term: 'Сферические координаты (J = r² sin θ)',
		short: String.raw`$\theta$ — угол от оси $Oz$; объём $r^2\sin\theta\,dr\,d\theta\,d\varphi$.`,
		formula: String.raw`\frac{\partial(x,y,z)}{\partial(r,\theta,\varphi)}=r^2\sin\theta`,
		body: String.raw`Замена $x=r\sin\theta\cos\varphi$, $y=r\sin\theta\sin\varphi$, $z=r\cos\theta$ переводит шар в параллелепипед. [[yakobian|Якобиан]] читается по рёбрам элементарного «кирпичика»: $dr$ вдоль радиуса, $r\,d\theta$ вдоль меридиана, $r\sin\theta\,d\varphi$ вдоль параллели.

Соглашение об углах не единственное: при отсчёте $\theta$ от плоскости $xOy$ получится $r^2\cos\theta$. Контроль — объём шара: $2\pi\cdot2\cdot R^3/3=\frac43\pi R^3$. На полюсах $\sin\theta\to0$, но это снова [[nepravilnaya-mera-nol|мера нуль]].`,
		related: ['polyarnye-koordinaty', 'cilindricheskie-koordinaty', 'yakobian', 'nevyrozhdennost-yakobiana']
	},

	'integral-eylera-puassona': {
		id: 'integral-eylera-puassona',
		term: 'Интеграл Эйлера–Пуассона',
		short: String.raw`Неберущийся в элементарных функциях, но его квадрат считается в ℝ².`,
		formula: String.raw`\int_{-\infty}^{+\infty}e^{-x^2}dx=\sqrt\pi`,
		body: String.raw`У $e^{-x^2}$ нет первообразной в элементарных функциях, но квадрат интеграла по [[teorema-fubini|Фубини]] равен $\iint_{\mathbb R^2}e^{-(x^2+y^2)}dx\,dy$, а он в [[polyarnye-koordinaty|полярных координатах]] равен $\pi$ — множитель $r$ из [[yakobian|якобиана]] с точностью до $\tfrac12$ совпадает с производной внутренней функции $r^2$, и интеграл берётся внесением под дифференциал.

Строгая версия зажимает квадрат $[-a;a]^2$ между кругами радиусов $a$ и $a\sqrt2$: $\pi(1-e^{-a^2})\le I_a^2\le\pi(1-e^{-2a^2})$. Отсюда же берётся нормировка гауссовой плотности.`,
		related: ['polyarnye-koordinaty', 'teorema-fubini', 'zamena-peremennyh-rn', 'sfericheskie-koordinaty']
	},

	'biektivnost-otobrazheniya': {
		id: 'biektivnost-otobrazheniya',
		term: 'Биективность замены',
		short: String.raw`Каждая точка старой области получена ровно из одной новой.`,
		formula: String.raw`\forall\,\vec x\in D\ \ \exists!\,\vec u\in D':\ F(\vec u)=\vec x`,
		body: String.raw`Первое из трёх условий теоремы о [[zamena-peremennyh-rn|замене переменных]]. Инъективность нужна, чтобы образы клеток разбиения не налегали друг на друга, сюръективность — чтобы они покрыли всю $D$.

Нарушение на множестве положительной меры ломает результат количественно: если пустить $\varphi$ по $[0;4\pi)$, круг будет посчитан дважды. Нарушение на [[nepravilnaya-mera-nol|множестве меры нуль]] (склейка $\{r=0\}$, шов $\varphi=0$) безвредно — такие множества выбрасываются.`,
		related: ['zamena-peremennyh-rn', 'nevyrozhdennost-yakobiana', 'nepravilnaya-mera-nol', 'yakobian-obratnogo']
	},

	'nevyrozhdennost-yakobiana': {
		id: 'nevyrozhdennost-yakobiana',
		term: 'Невырожденность якобиана (J ≠ 0)',
		short: String.raw`Условие обратимости замены в малом и существования $1/|J|$.`,
		formula: String.raw`J(\vec u)\ne0\ \ \forall\,\vec u\in D'`,
		body: String.raw`Третье условие теоремы. Если $J=0$ в точке, линейное приближение отображения схлопывает клетку в отрезок: площадь теряется, локальной [[biektivnost-otobrazheniya|обратимости]] нет, и [[yakobian-obratnogo|обратный якобиан]] $1/|J|$ не определён.

В доказательстве теоремы о замене невырожденность отвечает не за равномерность остатка (её даёт непрерывность частных производных на компакте), а за то, что образ клетки остаётся двумерным и не складывается сам на себя. Как и с биективностью, нарушение на [[nepravilnaya-mera-nol|множестве меры нуль]] безвредно.`,
		related: ['yakobian', 'biektivnost-otobrazheniya', 'yakobian-obratnogo', 'zamena-peremennyh-rn']
	},

	'cepnoe-pravilo-otobrazheniy': {
		id: 'cepnoe-pravilo-otobrazheniy',
		term: 'Цепное правило для отображений',
		short: String.raw`Матрица Якоби композиции равна произведению матриц Якоби.`,
		formula: String.raw`J_{F\circ G}(\vec x)=J_F\bigl(G(\vec x)\bigr)\cdot J_G(\vec x)`,
		body: String.raw`Многомерная версия правила дифференцирования сложной функции: [[matrica-yakobi|матрица Якоби]] композиции — произведение матриц сомножителей, взятых в соответственных точках. Одномерное $(F(\varphi(x)))'=F'(\varphi)\varphi'$ — частный случай для матриц $1\times1$.

Порядок сомножителей не переставляется: произведение матриц некоммутативно. Отсюда получается [[yakobian-obratnogo|лемма об обратном якобиане]]: дифференцируя $F\circ F^-=\mathrm{id}$, получаем $J_FJ_{F^-}=E=(\delta^i_k)$ — [[simvol-kronekera|символ Кронекера]].`,
		related: ['matrica-yakobi', 'yakobian-obratnogo', 'simvol-kronekera', 'yakobian']
	},

	'multiplikativnost-opredelitelya': {
		id: 'multiplikativnost-opredelitelya',
		term: 'Мультипликативность определителя',
		short: String.raw`$\det(AB)=\det A\cdot\det B$ — определитель произведения матриц.`,
		formula: String.raw`\det(AB)=\det A\cdot\det B,\qquad \det(A^{-1})=\frac1{\det A}`,
		body: String.raw`Свойство операции: определитель произведения равен произведению определителей. Геометрически это очевидно — если одно отображение растягивает площадь в $|\det A|$ раз, а второе в $|\det B|$, то композиция растягивает в произведение раз, ровно как [[koefficient-iskazheniya-ploshchadi|коэффициент искажения площади]].

Прямое следствие — [[yakobian-obratnogo|лемма об обратном якобиане]]: из $J_FJ_G=E$ и $\det E=1$ выходит $\det J_F\cdot\det J_G=1$. Второе следствие: обратимость матрицы равносильна $\det\ne0$, то есть [[nevyrozhdennost-yakobiana|невырожденности]].`,
		related: ['yakobian', 'yakobian-obratnogo', 'koefficient-iskazheniya-ploshchadi', 'nevyrozhdennost-yakobiana']
	},

	'ischerpanie-oblasti': {
		id: 'ischerpanie-oblasti',
		term: 'Исчерпание области',
		short: String.raw`Растущая цепь ограниченных областей, объединение которых даёт всю $D$.`,
		formula: String.raw`D_1\subset D_2\subset\dots,\ \ \bigcup_n D_n=D,\qquad \int_D f=\lim_{n}\int_{D_n} f`,
		body: String.raw`Способ придать смысл интегралу по неограниченной области: берут растущую последовательность ограниченных областей и переходят к пределу. Для $\iint_{\mathbb R^2}e^{-(x^2+y^2)}$ исчерпанием служат круги радиуса $R\to\infty$ — на них [[polyarnye-koordinaty|полярная замена]] и работает.

Ответ обязан не зависеть от выбора исчерпания, и при $f\ge0$ не зависит: на этом стоит вычисление [[integral-eylera-puassona|интеграла Эйлера–Пуассона]] сразу двумя исчерпаниями, кругами и квадратами. У знакопеременной функции зависимость появляется, и точные условия — день 25.`,
		related: ['integral-eylera-puassona', 'polyarnye-koordinaty', 'kratnyy-integral', 'zamena-peremennyh-rn']
	},

	'yakobian-obratnogo': {
		id: 'yakobian-obratnogo',
		term: 'Якобиан обратного отображения',
		short: String.raw`Обратная величина: $|J(F^-)|=1/|J(F)|$.`,
		formula: String.raw`\left|\frac{\partial(x,y)}{\partial(\xi,\zeta)}\right|=\frac{1}{\left|\dfrac{\partial(\xi,\zeta)}{\partial(x,y)}\right|}`,
		body: String.raw`Лемма получается дифференцированием тождества $F\circ F^-=\mathrm{id}$ по правилу цепочки: произведение матриц Якоби равно единичной ([[simvol-kronekera|символ Кронекера]] $\delta^i_k$), а определитель мультипликативен, поэтому $\det J_F\cdot\det J_{F^-}=1$.

Она связывает две согласованные записи формулы [[zamena-peremennyh-rn|замены переменных]]: интеграл по новым переменным берёт якобиан обратного отображения, а если оставить якобиан прямого, то ролями меняются части равенства. Проверка на полярных: $\partial(r,\varphi)/\partial(x,y)=1/r$.`,
		related: ['yakobian', 'zamena-peremennyh-rn', 'simvol-kronekera', 'nevyrozhdennost-yakobiana']
	},

	'simvol-kronekera': {
		id: 'simvol-kronekera',
		term: 'Символ Кронекера δⁱₖ',
		short: String.raw`Единичная матрица; она же якобиан тождественного отображения.`,
		formula: String.raw`\delta^i_k=\begin{cases}1,&i=k\\ 0,&i\ne k\end{cases}`,
		body: String.raw`Равенство $\partial x^i/\partial x^k=\delta^i_k$ — производная координаты по координате той же системы. Оно проверяет соглашение об индексах в [[matrica-yakobi|матрице Якоби]]: подставили одну систему вместо двух — получили единичную матрицу, то есть [[yakobian|якобиан]] тождественного отображения, равный $1$: площади не искажаются.

Через $\delta^i_k$ записывается дискретная метрика: $\rho(i,j)=1-\delta^i_j$ даёт $0$ на диагонали и $1$ вне её. Перестановка значений (единицы вне диагонали, нули на ней) эту формулу ломает: тогда $\rho(i,i)=1\ne0$, и аксиома тождества нарушена, см. [[metriki-rho|метрики]].`,
		related: ['matrica-yakobi', 'yakobian', 'yakobian-obratnogo', 'metriki-rho']
	},

	'teorema-fubini': {
		id: 'teorema-fubini',
		term: 'Теорема Фубини',
		short: String.raw`Кратный интеграл равен повторному, порядок интегрирования любой.`,
		formula: String.raw`\iint_D f\,dx\,dy=\int_{D_y}\!\left(\int_{D_x}\! f\,dx\right)dy=\int_{D_x}\!\left(\int_{D_y}\! f\,dy\right)dx`,
		body: String.raw`Разобрана в дне 23 при $f\in C(D)$: [[kratnyy-integral|кратный интеграл]] сводится к повторному одномерному, и порядок интегрирования не важен.

Тонкое место — не перестановка повторных пределов: в доказательстве её нет вовсе. Вместо неё одна равномерная оценка сразу на всех ячейках, и держится она на равномерной непрерывности $f$ на компакте. Перестановка $\lim_{\delta x\to0}\lim_{\delta y\to0}$ — это как раз тот короткий путь, который без дополнительных условий незаконен (день 23). Сегодня Фубини нужен дважды: чтобы разложить $e^{-(x^2+y^2)}$ в произведение и чтобы посчитать сам повторный интеграл после замены.`,
		related: ['kratnyy-integral', 'integral-eylera-puassona', 'zamena-peremennyh-rn', 'nepravilnaya-mera-nol']
	},

	'kratnyy-integral': {
		id: 'kratnyy-integral',
		term: 'Кратный (двойной) интеграл',
		short: String.raw`Предел сумм $\sum f(\xi_i,\zeta_i)\|d_i\|$ по мере клеток разбиения области.`,
		formula: String.raw`\iint_D f(x,y)\,dx\,dy=\lim_{d_R\to0}\sum_{d_i}f(\xi_i,\zeta_i)\,\|d_i\|`,
		body: String.raw`Область $D\subset\mathbb R^2$ разбивается на клетки $d_i$, в каждой берётся точка $(\xi_i,\zeta_i)\in d_i$, а $\|d_i\|$ — мера (площадь) клетки; $d_R=\max_i\operatorname{diam}d_i$ — [[rang-razbieniya|ранг разбиения]], аналог одномерного $\lambda_R$. Мерить мелкость площадью нельзя: полосы площади $1/n$ имеют диаметр больше единицы, и оценка «на клетке функция почти постоянна» на них рушится (день 23).

Одномерный [[lsk|ЛСК]] $[a,b]$ заменяется здесь на плоскую область, а длина отрезка — на площадь клетки. Именно в этой сумме и подменяются клетки при [[zamena-peremennyh-rn|замене переменных]]: разбивают не $D$, а $D'$.`,
		related: ['rang-razbieniya', 'lsk', 'teorema-fubini', 'zamena-peremennyh-rn']
	}
};
