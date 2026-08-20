import type { Glossary } from '$lib/types';

// Термины дня 23 (кратный интеграл и теорема Фубини).
export const day23Terms: Glossary = {
	'dvoynoy-integral': {
		id: 'dvoynoy-integral',
		term: 'Двойной интеграл',
		short: String.raw`Предел сумм по ячейкам плоской области при ранге $d_R\to0$.`,
		formula: String.raw`\iint_D f(x,y)\,dx\,dy=\lim_{d_R\to0}\sum_{d_i} f(\xi_i,\zeta_i)\,\|d_i\|`,
		body: String.raw`Интеграл по плоской области, построенный по той же схеме, что и [[opredelennyy-integral|определённый интеграл]] на отрезке: область режется на [[yacheyka-razbieniya|ячейки]], в каждой отмечается точка, слагаемое равно значению функции, умноженному на меру ячейки.`,
		related: ['opredelennyy-integral', 'yacheyka-razbieniya', 'kratnyy-integral']
	},

	'kratnyy-integral': {
		id: 'kratnyy-integral',
		term: 'Кратный интеграл',
		short: String.raw`То же определение в $\mathbb R^n$: мера ячейки — объём.`,
		formula: String.raw`\int\limits_D f(\vec x)\,d\vec x=\lim_{d_R\to0}\sum_{d_i} f(\vec\xi_i)\,\|d_i\|,\qquad D\subset\mathbb R^n`,
		body: String.raw`Обобщение [[dvoynoy-integral|двойного интеграла]] на $\mathbb R^n$: определение дословно то же, только мерой [[yacheyka-razbieniya|ячейки]] служит её $n$-мерный объём.`,
		related: ['dvoynoy-integral', 'yacheyka-razbieniya']
	},

	'yacheyka-razbieniya': {
		id: 'yacheyka-razbieniya',
		term: 'Ячейка разбиения и её мера',
		short: String.raw`Кусок области; $\|d_i\|$ — её площадь, $d_R$ — ранг разбиения.`,
		formula: String.raw`D=\bigcup_i d_i,\qquad d_R=\max_{i}\operatorname{diam}d_i`,
		body: String.raw`Многомерный аналог отрезка [[razbienie|разбиения]]: ячейки не налегают [[vnutrennost-mnozhestva|внутренностями]] и в объединении дают область. Мелкость меряется [[diametr-mnozhestva|диаметром]], а не мерой: у тонкой полосы площадь мала, а диаметр велик.`,
		related: ['razbienie', 'diametr-mnozhestva', 'vnutrennost-mnozhestva']
	},

	'diametr-mnozhestva': {
		id: 'diametr-mnozhestva',
		term: 'Диаметр множества',
		short: String.raw`Наибольшее расстояние между точками множества.`,
		formula: String.raw`\operatorname{diam}A=\sup_{\vec x,\vec y\in A}\rho(\vec x,\vec y)`,
		body: String.raw`[[supremum|Точная верхняя грань]] расстояний между точками множества в [[metriki-rho|метрике]] пространства. У отрезка диаметр равен длине, у прямоугольника — диагонали, у круга — двум радиусам.`,
		related: ['supremum', 'metriki-rho']
	},

	'vnutrennost-mnozhestva': {
		id: 'vnutrennost-mnozhestva',
		term: 'Внутренность множества',
		short: String.raw`Точки, входящие в множество вместе с целым шаром.`,
		formula: String.raw`\operatorname{int}A=\{\vec x:\ \exists\varepsilon>0,\ B_\varepsilon(\vec x)\subset A\}`,
		body: String.raw`Совокупность точек, каждая из которых лежит в множестве вместе с некоторой [[okrestnost|окрестностью]]. Разность [[zamykanie|замыкания]] и внутренности называется границей множества.`,
		related: ['okrestnost', 'zamykanie', 'vnutrennyaya-tochka']
	},

	'mera-nol-v-rn': {
		id: 'mera-nol-v-rn',
		term: 'Множество меры нуль в $\\mathbb R^2$',
		short: String.raw`Покрывается прямоугольниками суммарной площади меньше любого $\varepsilon$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\{P_k\}:\ S\subset\bigcup_k P_k,\ \sum_k\|P_k\|<\varepsilon`,
		body: String.raw`Плоский двойник [[mera-nol|множества меры нуль]]: интервалы заменены прямоугольниками, длина — площадью. Понятия не совпадают: отрезок на плоскости имеет меру нуль, а на прямой нет.`,
		related: ['mera-nol', 'ploshchad-mnozhestva']
	},

	'ploshchad-mnozhestva': {
		id: 'ploshchad-mnozhestva',
		term: 'Площадь плоского множества',
		short: String.raw`Общий предел сумм по клеткам изнутри и снаружи.`,
		formula: String.raw`\underline S_h(D)=\!\!\sum_{d\subset D}\!\|d\|\ \le\ \overline S_h(D)=\!\!\sum_{d\cap D\ne\varnothing}\!\|d\|`,
		body: String.raw`Мера ограниченного плоского множества, определённая зажимом между суммой клеток сетки, лежащих внутри, и суммой клеток, задевающих множество. Совпадение пределов при измельчении называют квадрируемостью; оно равносильно тому, что граница имеет [[mera-nol-v-rn|меру нуль]].`,
		related: ['mera-nol-v-rn', 'yacheyka-razbieniya', 'vnutrennost-mnozhestva']
	},

	'povtornyy-integral': {
		id: 'povtornyy-integral',
		term: 'Повторный интеграл',
		short: String.raw`Два вложенных одномерных интеграла; двумерного предела в нём нет.`,
		formula: String.raw`\int_a^b\Bigl(\int_c^d f(x,y)\,dy\Bigr)dx`,
		body: String.raw`Конструкция, в которой сначала при замороженном $x$ берётся [[opredelennyy-integral|определённый интеграл]] по $y$, а затем полученная функция интегрируется по $x$. Двумерного предельного перехода здесь нет.`,
		related: ['opredelennyy-integral', 'dvoynoy-integral', 'sechenie-oblasti']
	},

	'teorema-fubini': {
		id: 'teorema-fubini',
		term: 'Теорема Фубини',
		short: String.raw`Для непрерывной $f$ двойной интеграл равен обоим повторным.`,
		formula: String.raw`\iint_P f\,dx\,dy=\int_a^b\Bigl(\int_c^d f\,dy\Bigr)dx=\int_c^d\Bigl(\int_a^b f\,dx\Bigr)dy`,
		body: String.raw`Если $f$ непрерывна на прямоугольнике, то [[dvoynoy-integral|двойной интеграл]] существует и равен обоим [[povtornyy-integral|повторным]]. На произвольную область переносится [[prodolzhenie-nulem|продолжением нулём]].`,
		related: ['dvoynoy-integral', 'povtornyy-integral', 'prodolzhenie-nulem']
	},

	'sechenie-oblasti': {
		id: 'sechenie-oblasti',
		term: 'Сечение и проекция области',
		short: String.raw`Сечение — где бежит внутренняя переменная, проекция — где внешняя.`,
		formula: String.raw`D_x(y)=\{x:(x,y)\in D\}`,
		body: String.raw`Сечение — множество значений одной координаты при фиксированной другой; проекция — множество значений фиксируемой координаты. По ним расставляют пределы [[povtornyy-integral|повторного интеграла]] для криволинейной области.`,
		related: ['povtornyy-integral', 'teorema-fubini']
	},

	'indikator-oblasti': {
		id: 'indikator-oblasti',
		term: 'Индикатор области',
		short: String.raw`Единица внутри области, нуль снаружи.`,
		formula: String.raw`I_D(\vec x)=\begin{cases}1,&\vec x\in D,\\ 0,&\vec x\notin D.\end{cases}`,
		body: String.raw`Функция-выключатель, равная единице на множестве и нулю вне его. Домножение на неё позволяет заменить интеграл по области интегралом по объемлющему прямоугольнику.`,
		related: ['prodolzhenie-nulem', 'funkciya']
	},

	'prodolzhenie-nulem': {
		id: 'prodolzhenie-nulem',
		term: 'Продолжение нулём',
		short: String.raw`Функция доопределяется нулём вне области и интегрируется по прямоугольнику.`,
		formula: String.raw`\vec{\mathrm{Sh}}(\vec x)=I_D(\vec x)\cdot f(\vec x),\qquad \iint_D f=\iint_P \vec{\mathrm{Sh}}`,
		body: String.raw`Приём: функцию домножают на [[indikator-oblasti|индикатор]] области и считают интеграл по объемлющему прямоугольнику. Возникающий на границе разрыв безвреден, когда граница имеет [[mera-nol-v-rn|меру нуль]].`,
		related: ['indikator-oblasti', 'mera-nol-v-rn', 'teorema-fubini']
	},

	'perestanovka-predelov': {
		id: 'perestanovka-predelov',
		term: 'Перестановка повторных пределов',
		short: String.raw`В общем случае незаконна: $\frac{m}{m+n}$ даёт $0$ и $1$.`,
		formula: String.raw`\lim_{m\to\infty}\lim_{n\to\infty}\frac{m}{m+n}=0\ne1=\lim_{n\to\infty}\lim_{m\to\infty}\frac{m}{m+n}`,
		body: String.raw`Обмен местами двух последовательных предельных переходов. Он не обязан сохранять результат: у двойной последовательности $\frac m{m+n}$ два порядка дают $0$ и $1$.`,
		related: ['predel-posledovatelnosti', 'absolyutnaya-integriruemost']
	},

	'princip-kavaleri': {
		id: 'princip-kavaleri',
		term: 'Принцип Кавальери',
		short: String.raw`Равные площади сечений на всех уровнях — равные объёмы.`,
		formula: String.raw`\forall x\ \ S_1(x)=S_2(x)\ \Longrightarrow\ V_1=V_2`,
		body: String.raw`Правило измерения объёма: если у двух тел на каждом уровне площади [[sechenie-oblasti|сечений]] совпадают, то совпадают и объёмы.`,
		related: ['sechenie-oblasti', 'teorema-fubini']
	},

	'teorema-tonelli': {
		id: 'teorema-tonelli',
		term: 'Теорема Тонелли',
		short: String.raw`Для $f\ge0$ повторные интегралы равны всегда.`,
		formula: String.raw`f\ge0\ \Longrightarrow\ \int\!\Bigl(\int f\,dy\Bigr)dx=\int\!\Bigl(\int f\,dx\Bigr)dy`,
		body: String.raw`У неотрицательной функции [[povtornyy-integral|повторные интегралы]] равны при любом порядке интегрирования, причём равенство остаётся верным и когда оба равны $+\infty$.`,
		related: ['povtornyy-integral', 'absolyutnaya-integriruemost', 'teorema-fubini']
	},

	'absolyutnaya-integriruemost': {
		id: 'absolyutnaya-integriruemost',
		term: 'Абсолютная интегрируемость',
		short: String.raw`$\iint_D|f|<\infty$.`,
		formula: String.raw`\iint_D |f(x,y)|\,dx\,dy<\infty`,
		body: String.raw`Конечность интеграла от модуля функции. Именно это условие делает законной [[perestanovka-predelov|перестановку]] порядка интегрирования в [[povtornyy-integral|повторном интеграле]].`,
		related: ['perestanovka-predelov', 'povtornyy-integral', 'modul-chisla']
	}
};
