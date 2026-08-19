import type { Glossary } from '$lib/types';

// =====================================================================
//  Термины дня 18 (семестр 2): критерий интегрируемости и мера нуль.
//  Карточки соседних дней, на которые день ссылается (разбиение,
//  определённый интеграл, равномерная непрерывность), продублированы
//  намеренно — день должен резолвиться независимо от соседей.
//  Канонический глоссарий склеивается последним и перекрывает дубли:
//  оттуда берутся lsk, rang-razbieniya, zamykanie, n-nol-n-odin,
//  priznak-i-svoystvo.
// =====================================================================

export const day18Terms: Glossary = {
	'baza-melkosti': {
		id: 'baza-melkosti',
		term: 'База мелкости',
		short: String.raw`Предел берётся не по номеру, а по семейству всех $\lambda$ с $\lambda_R<\delta$.`,
		formula: String.raw`\lim_{\lambda_R\to0}G(\lambda)=A\iff\forall\varepsilon>0\ \exists\delta>0\ \forall\lambda\ (\lambda_R<\delta):\ |G(\lambda)-A|<\varepsilon`,
		body: String.raw`[[razbienie|Разбиения]] не занумерованы, поэтому предел по ним определяется не как предел последовательности, а по базе: её элементы — множества всех разбиений с [[rang-razbieniya|рангом]] меньше $\delta$, они непусты и вложены друг в друга. Запись $\lim_{\lambda_R\to0}$ означает ровно выписанное $\varepsilon$–$\delta$-условие. Отличать от $\inf_\lambda U$: инфимум есть у любой ограниченной $f$, а существование предела по базе — отдельное утверждение, и его даёт [[lemma-darbu|лемма Дарбу]].`,
		related: ['razbienie', 'rang-razbieniya', 'lemma-darbu', 'kriteriy-integriruemosti']
	},

	'klass-r': {
		id: 'klass-r',
		term: 'Класс ℛ[a; b]',
		short: String.raw`Обозначение множества интегрируемых по Риману функций на отрезке.`,
		formula: String.raw`\mathcal R[a;b]=\bigl\{f:\ \exists\lim_{\lambda_R\to0}I(f,\lambda,\vec\xi)\bigr\}`,
		body: String.raw`$\mathcal R[a;b]$ — множество функций, интегрируемых по Риману на $[a;b]$: тех, у которых [[opredelennyy-integral|предел интегральных сумм]] существует и не зависит ни от разбиения, ни от отмеченных точек. Запись $f\in\mathcal R[a;b]$ читается «$f$ интегрируема». Класс описан двумя способами: изнутри — [[kriteriy-integriruemosti|критерием Дарбу]], снаружи — [[kriteriy-lebega|критерием Лебега]]; он содержит все непрерывные и все монотонные функции.`,
		related: ['opredelennyy-integral', 'kriteriy-integriruemosti', 'kriteriy-lebega']
	},

	'teorema-kantora': {
		id: 'teorema-kantora',
		term: 'Теорема Кантора',
		short: String.raw`Непрерывная на компакте функция равномерно непрерывна.`,
		formula: String.raw`f\in C(K),\ K\ \text{компакт}\ \Rightarrow\ f\ \text{равномерно непрерывна на}\ K`,
		body: String.raw`На компакте непрерывность автоматически усиливается до [[ravnomernaya-nepreryvnost|равномерной]]: одно $\delta$ годится сразу для всех точек. Для отрезка-[[lsk|ЛСК]] это и даёт интегрируемость непрерывной функции — при $\lambda_R<\delta$ все [[kolebanie-funkcii|колебания]] $h_i$ малы одновременно, и $\sum h_i\lambda_i$ оценивается без потерь. Без компактности теорема ложна: $1/x$ непрерывна на $(0;1]$, но не равномерно.`,
		related: ['ravnomernaya-nepreryvnost', 'lsk', 'kolebanie-funkcii', 'kriteriy-integriruemosti']
	},

	'schetnoe-mnozhestvo': {
		id: 'schetnoe-mnozhestvo',
		term: 'Счётное множество',
		short: String.raw`Множество, точки которого можно занумеровать: биекция с $\mathbb N_1$.`,
		formula: String.raw`S=\{s_1,s_2,\dots\}\iff\exists\ \text{биекция}\ S\leftrightarrow\mathbb N_1`,
		body: String.raw`Множество счётно, если его элементы выстраиваются в очередь — существует биекция с [[n-nol-n-odin|$\mathbb N_1$]]. Счётность и есть всё, что нужно для приёма «режем бюджет пополам»: $k$-я точка накрывается интервалом длины $\varepsilon/2^{k+1}$, поэтому счётное множество имеет [[mera-nol|меру нуль]]. Отрезок несчётен, и раскладка бюджета его не берёт — вот почему счётность стоит отдельным требованием к [[pokrytie-intervalami|покрытию]]. Обратное неверно: канторово множество несчётно, а мера у него нулевая.`,
		related: ['mera-nol', 'pokrytie-intervalami', 'n-nol-n-odin']
	},

	'kriteriy-integriruemosti': {
		id: 'kriteriy-integriruemosti',
		term: 'Критерий интегрируемости (Дарбу)',
		short: String.raw`Ограниченная $f$ интегрируема ⟺ найдётся разбиение с $U-L<\varepsilon$.`,
		formula: String.raw`f\in\mathcal R[a;b]\iff\forall\varepsilon>0\ \exists\lambda:\ \sum_i h_i\lambda_i<\varepsilon`,
		body: String.raw`Ограниченная на $[a;b]$ функция интегрируема тогда и только тогда, когда для любого $\varepsilon>0$ найдётся **хотя бы одно** разбиение, на котором [[summy-darbu|суммы Дарбу]] расходятся меньше чем на $\varepsilon$; эквивалентная форма — $\lim_{\lambda_R\to0}\sum_i h_i\lambda_i=0$ по базе мелкости. Вся информация о препятствии сидит в [[kolebanie-funkcii|колебаниях]] $h_i$: интегрируемость — это умение сделать их взвешенную сумму сколь угодно малой. Условие одновременно необходимо и достаточно, то есть служит [[priznak-i-svoystvo|признаком и свойством]] сразу.`,
		related: ['summy-darbu', 'kolebanie-funkcii', 'verhniy-nizhniy-integral', 'kriteriy-lebega']
	},

	'summy-darbu': {
		id: 'summy-darbu',
		term: 'Суммы Дарбу U и L',
		short: String.raw`Интегральные суммы, где вместо $f(\xi_i)$ стоят $\sup$ и $\inf$ по куску.`,
		formula: String.raw`U(f,\lambda)=\sum_i M_i\lambda_i,\qquad L(f,\lambda)=\sum_i m_i\lambda_i`,
		body: String.raw`Верхняя и нижняя суммы Дарбу для [[razbienie|разбиения]] $\lambda$: $M_i=\sup_{\Delta_i}f$, $m_i=\inf_{\Delta_i}f$. При любых отмеченных точках $L\le I(f,\lambda,\vec\xi)\le U$, а разность равна взвешенной сумме [[kolebanie-funkcii|колебаний]]: $U-L=\sum_i h_i\lambda_i$.

Наряду с самими суммами рассматривают пределы $\lim_{\lambda_R\to0}U(f,\lambda)$ и $\lim_{\lambda_R\to0}L(f,\lambda)$. Их существование и совпадение с $\inf_\lambda U$ и $\sup_\lambda L$ — не определение, а теорема Дарбу, и доказывается она через [[lemma-darbu|лемму Дарбу]].`,
		related: ['razbienie', 'kolebanie-funkcii', 'verhniy-nizhniy-integral', 'izmelchenie-razbieniya']
	},

	'kolebanie-funkcii': {
		id: 'kolebanie-funkcii',
		term: 'Колебание функции на куске',
		short: String.raw`$h_i=M_i-m_i$ — разброс значений $f$ на отрезке разбиения.`,
		formula: String.raw`h_i=\sup_{\Delta_i}f-\inf_{\Delta_i}f=\sup_{x,x'\in\Delta_i}|f(x)-f(x')|`,
		body: String.raw`Разность супремума и инфимума $f$ на $i$-м куске [[razbienie|разбиения]]. Это единственная величина, мешающая интегралу: $U-L=\sum_i h_i\lambda_i$, и весь [[kriteriy-integriruemosti|критерий]] сводится к тому, удаётся ли зажать эту сумму.

Точечный аналог — колебание $\eta(x_0)$ в точке, предел колебаний по стягивающимся окрестностям; через него определяется [[tochka-razryva|точка разрыва]] и формулируется критерий Лебега.`,
		related: ['summy-darbu', 'kriteriy-integriruemosti', 'tochka-razryva', 'razbienie']
	},

	'verhniy-nizhniy-integral': {
		id: 'verhniy-nizhniy-integral',
		term: 'Верхний и нижний интегралы',
		short: String.raw`$\inf$ верхних сумм и $\sup$ нижних — по всем разбиениям сразу.`,
		formula: String.raw`\overline{\int_a^b}f=\inf_\lambda U(f,\lambda),\qquad \underline{\int_a^b}f=\sup_\lambda L(f,\lambda)`,
		body: String.raw`Из [[summy-darbu|сумм Дарбу]] инфимум и супремум берутся по всем [[razbienie|разбиениям]], а не по одному. По [[lemma-darbu|лемме Дарбу]] всегда $\underline{\int}\le\overline{\int}$, а интегрируемость — это в точности их равенство; общее значение и есть [[opredelennyy-integral|определённый интеграл]].

Те же два числа получаются как пределы $\lim_{\lambda_R\to0}U$ и $\lim_{\lambda_R\to0}L$ по базе мелкости, но это отдельная теорема, а не определение.`,
		related: ['summy-darbu', 'izmelchenie-razbieniya', 'opredelennyy-integral', 'kriteriy-integriruemosti']
	},

	'izmelchenie-razbieniya': {
		id: 'izmelchenie-razbieniya',
		term: 'Измельчение разбиения (лемма Дарбу)',
		short: String.raw`Добавление точек не увеличивает $U$ и не уменьшает $L$.`,
		formula: String.raw`\lambda\subset\lambda'\ \Rightarrow\ L(f,\lambda)\le L(f,\lambda')\le U(f,\lambda')\le U(f,\lambda)`,
		body: String.raw`Разбиение $\lambda'$ измельчает $\lambda$, если содержит все его точки. Супремум по части не превосходит супремума по целому, поэтому при измельчении [[summy-darbu|верхняя сумма]] не растёт, а нижняя не убывает. Следствие через объединение $\lambda^1\cup\lambda^2$: **никакая** нижняя сумма не обгоняет **никакую** верхнюю, откуда $\underline{\int}\le\overline{\int}$.

Без этой леммы не проходит переход от «существует разбиение с $U-L<\varepsilon$» к пределу по базе мелкости: сближение сумм при добавлении точек — единственное, что связывает произвольное мелкое разбиение с эталонным.`,
		related: ['summy-darbu', 'verhniy-nizhniy-integral', 'kriteriy-integriruemosti', 'rang-razbieniya']
	},

	'mera-nol': {
		id: 'mera-nol',
		term: 'Множество меры нуль',
		short: String.raw`Прячется в счётное покрытие интервалами суммарной длины меньше любого ε.`,
		formula: String.raw`\mu(S)=0\iff\forall\varepsilon>0\ \exists\{I_k\}:\ S\subset\bigcup_k I_k,\ \sum_k|I_k|<\varepsilon`,
		body: String.raw`Для любого $\varepsilon>0$ существует не более чем счётное [[pokrytie-intervalami|покрытие интервалами]] с суммарной длиной меньше $\varepsilon$. Всякое счётное множество имеет меру нуль (накрываем $k$-ю точку интервалом длины $\varepsilon/2^{k+1}$), в частности $\mu(\mathbb Q)=0$ — при том что $\mathrm{cl}\,\mathbb Q=\mathbb R$ (см. [[zamykanie|замыкание]]). Отрезок положительной длины меры нуль не имеет.

Оба ограничения существенны. Без условия на сумму подходящее покрытие есть у любого множества, а без счётности семейства отрезок $[0;1]$ накрылся бы одноточечными промежутками нулевой длины.`,
		related: ['pokrytie-intervalami', 'kriteriy-lebega', 'zamykanie', 'kriteriy-integriruemosti']
	},

	'pokrytie-intervalami': {
		id: 'pokrytie-intervalami',
		term: 'Покрытие интервалами',
		short: String.raw`Не более чем счётное семейство интервалов, накрывающее множество.`,
		formula: String.raw`S\subset\bigcup_{k\in\mathbb N_1}I_k,\qquad |I_k|=\text{длина}\ I_k`,
		body: String.raw`Инструмент, которым меряют «размер» множества в определении [[mera-nol|меры нуль]]. Два требования обязательны. Первое — контроль суммы $\sum_k|I_k|<\varepsilon$: без него покрытие есть у любого множества. Второе — **счётность** семейства (индексы из [[n-nol-n-odin|$\mathbb N_1$]]): по несчётному набору одноточечных «интервалов» нулевой длины покрывается и отрезок, и тогда мера нуль была бы у всех множеств сразу.

В $\mathbb R^n$ роль интервалов играют параллелепипеды, а длины — их объёмы.`,
		related: ['mera-nol', 'n-nol-n-odin', 'kriteriy-lebega']
	},

	'kriteriy-lebega': {
		id: 'kriteriy-lebega',
		term: 'Критерий Лебега',
		short: String.raw`Интегрируемость по Риману ⟺ ограниченность плюс мера нуль у разрывов.`,
		formula: String.raw`f\in\mathcal R[a;b]\iff f\ \text{ограничена и}\ \mu(\mathrm{Disc}\,f)=0`,
		body: String.raw`Полное описание класса интегрируемых по Риману функций: $f$ ограничена на $[a;b]$ и множество её [[tochka-razryva|точек разрыва]] имеет [[mera-nol|меру нуль]]. Доказательство здесь не приводится, но обе половины проверяются на свидетелях: [[funkciya-dirihle|функция Дирихле]] разрывна всюду и не интегрируема, [[funkciya-rimana|функция Римана]] разрывна ровно на $\mathbb Q$ и интегрируема.

Отсюда мгновенно следуют и оба класса дня: непрерывные функции разрывов не имеют, монотонные имеют их не более чем счётное число.`,
		related: ['mera-nol', 'tochka-razryva', 'funkciya-dirihle', 'funkciya-rimana']
	},

	'funkciya-dirihle': {
		id: 'funkciya-dirihle',
		term: 'Функция Дирихле',
		short: String.raw`Индикатор рациональных: разрывна всюду, не интегрируема по Риману.`,
		formula: String.raw`D(x)=\begin{cases}1,&x\in\mathbb Q,\\ 0,&x\notin\mathbb Q\end{cases}`,
		body: String.raw`На любом невырожденном куске $\sup D=1$ и $\inf D=0$, поэтому $h_i=1$ и $U-L=b-a$ при **любом** [[razbienie|разбиении]] — [[kriteriy-integriruemosti|критерий]] не выполняется ни при каком $\varepsilon<b-a$. То же короче по [[kriteriy-lebega|Лебегу]]: $\mathrm{Disc}\,D=[a;b]$, а отрезок меры нуль не имеет.

Интегральные суммы по рациональным отметкам дают $b-a$, по иррациональным — $0$: предела по базе мелкости нет. Интеграл Лебега от $D$, в отличие от риманова, существует и равен нулю.`,
		related: ['kriteriy-lebega', 'funkciya-rimana', 'kriteriy-integriruemosti', 'mera-nol']
	},

	'funkciya-rimana': {
		id: 'funkciya-rimana',
		term: 'Функция Римана',
		short: String.raw`$1/q$ в несократимой $p/q$, ноль в иррациональных; интегрируема, $\int=0$.`,
		formula: String.raw`R(x)=\begin{cases}1/q,&x=p/q\ \text{несократимо},\\ 0,&x\notin\mathbb Q\end{cases}`,
		body: String.raw`Непрерывна в каждой иррациональной точке (точек со значением $\ge\varepsilon$ конечное число, $\delta$ — расстояние до них) и разрывна в каждой рациональной. Множество [[tochka-razryva|разрывов]] равно $\mathbb Q$ — счётное, значит [[mera-nol|меры нуль]], и по [[kriteriy-lebega|критерию Лебега]] $R$ интегрируема. Все нижние суммы нулевые, поэтому $\int_0^1R=0$.

Пара с [[funkciya-dirihle|функцией Дирихле]] показывает, что дело не в плотности разрывов, а в их суммарном размере.`,
		related: ['kriteriy-lebega', 'funkciya-dirihle', 'mera-nol', 'tochka-razryva']
	},

	'tochka-razryva': {
		id: 'tochka-razryva',
		term: 'Точка разрыва',
		short: String.raw`Точка, где колебание функции $\eta(x_0)$ строго положительно.`,
		formula: String.raw`\eta(x_0)=\lim_{\delta\to+0}\ \sup_{x,x'\in B_{x_0}(\delta)}|f(x)-f(x')|>0`,
		body: String.raw`Точка, в которой нарушена непрерывность; количественно её измеряет колебание $\eta(x_0)$ — предел [[kolebanie-funkcii|колебаний]] по стягивающимся окрестностям. Множество $\mathrm{Disc}\,f$ всех таких точек — главный объект [[kriteriy-lebega|критерия Лебега]].

Разрывы различают по поведению односторонних пределов: устранимый (оба предела существуют и равны, но не равны $f(x_0)$), первого рода (оба существуют, но различны), второго рода (хотя бы один не существует или бесконечен). Для критерия Лебега тип разрыва безразличен — считается только мера множества $\mathrm{Disc}\,f$: у [[funkciya-rimana|функции Римана]] все разрывы устранимые (в каждой точке $\lim_{x\to x_0}R(x)=0$, а в рациональной $R(p/q)=1/q\ne0$), у $f(x)=\sin\frac1x$ с $f(0)=0$ разрыв единственный и второго рода — обе интегрируемы, потому что в обоих случаях $\mu(\mathrm{Disc}\,f)=0$.`,
		related: ['kriteriy-lebega', 'kolebanie-funkcii', 'funkciya-rimana', 'mera-nol']
	},

	'ravnomernaya-nepreryvnost': {
		id: 'ravnomernaya-nepreryvnost',
		term: 'Равномерная непрерывность',
		short: String.raw`Одно $\delta$ годится сразу для всех точек множества.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall x,x':\ \rho(x,x')<\delta\Rightarrow|f(x)-f(x')|<\varepsilon`,
		body: String.raw`В отличие от обычной непрерывности, $\delta$ не зависит от точки. По теореме Кантора непрерывная на компакте функция равномерно непрерывна — для отрезка ([[lsk|ЛСК]]) это и даёт интегрируемость: при $\lambda_R<\delta_f\bigl(\varepsilon/(2(b-a))\bigr)$ все [[kolebanie-funkcii|колебания]] $h_i$ малы **одновременно**, и $\sum h_i\lambda_i<\varepsilon$.

Требование строго сильнее обычной непрерывности, и компактность здесь не лишняя: $f(x)=1/x$ непрерывна на $(0;1]$, но при $\varepsilon=1$ никакое $\delta$ не годится для всех точек сразу — точки $\frac1n$ и $\frac1{n+1}$ сближаются, а значения расходятся на единицу.`,
		related: ['kriteriy-integriruemosti', 'kolebanie-funkcii', 'lsk', 'metriki-rho']
	},

	'razbienie': {
		id: 'razbienie',
		term: 'Разбиение отрезка',
		short: String.raw`Точки $a=x_1<\dots<x_n=b$; куски $\lambda_i$, ранг $\lambda_R=\max\lambda_i$.`,
		formula: String.raw`a=x_1<x_2<\dots<x_n=b,\qquad \lambda_i=x_{i+1}-x_i`,
		body: String.raw`Набор точек, режущих отрезок $[a;b]$ — [[lsk|ЛСК]] — на куски $\Delta_i=[x_i;x_{i+1}]$ длины $\lambda_i$. Мелкость измеряется [[rang-razbieniya|рангом]] $\lambda_R$, а качество приближения — [[summy-darbu|суммами Дарбу]] на этом разбиении.

Разбиение $\lambda'$ **измельчает** $\lambda$, если содержит все его точки; на этом отношении держится [[izmelchenie-razbieniya|лемма Дарбу]].`,
		related: ['rang-razbieniya', 'summy-darbu', 'izmelchenie-razbieniya', 'lsk']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Предел интегральных сумм $I(f,\lambda,\vec\xi)$ по базе мелкости разбиения.`,
		formula: String.raw`\int_a^b f(x)\,dx=\lim_{\lambda_R\to0}I(f,\lambda,\vec\xi)=\lim_{\lambda_R\to0}\sum_i f(\xi_i)\,\lambda_i`,
		body: String.raw`Предел интегральных сумм при [[rang-razbieniya|ранге]] $\lambda_R\to0$, одинаковый для всех измельчающихся [[razbienie|разбиений]] и всех наборов отмеченных точек $\vec\xi$. Существует он не всегда — условие даёт [[kriteriy-integriruemosti|критерий интегрируемости]], а полное описание класса — [[kriteriy-lebega|критерий Лебега]].

Через [[verhniy-nizhniy-integral|верхний и нижний интегралы]] то же число записывается как их общее значение.`,
		related: ['razbienie', 'rang-razbieniya', 'kriteriy-integriruemosti', 'verhniy-nizhniy-integral']
	}
};
