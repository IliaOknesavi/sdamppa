import type { Glossary } from '$lib/types';

// =====================================================================
//  Термины дня 18 (семестр 2): критерий интегрируемости и мера нуль.
//  Карточки соседних дней, на которые день ссылается (разбиение,
//  определённый интеграл, равномерная непрерывность), продублированы
//  намеренно — день должен резолвиться независимо от соседей.
//  Канонический глоссарий склеивается последним и перекрывает дубли:
//  оттуда берутся lsk, rang-razbieniya, nepravilnaya-mera-nol,
//  zamykanie, n-nol-n-odin, priznak-i-svoystvo.
// =====================================================================

export const day18Terms: Glossary = {
	'kriteriy-integriruemosti': {
		id: 'kriteriy-integriruemosti',
		term: 'Критерий интегрируемости (Дарбу)',
		short: String.raw`Ограниченная $f$ интегрируема ⟺ найдётся разбиение с $U-L<\varepsilon$.`,
		formula: String.raw`f\in\mathcal R[a;b]\iff\forall\varepsilon>0\ \exists\lambda:\ \sum_i h_i\lambda_i<\varepsilon`,
		body: String.raw`Ограниченная на $[a;b]$ функция интегрируема тогда и только тогда, когда для любого $\varepsilon>0$ найдётся **хотя бы одно** разбиение, на котором [[summy-darbu|суммы Дарбу]] расходятся меньше чем на $\varepsilon$; эквивалентная форма — $\lim_{\lambda_R\to0}\sum_i h_i\lambda_i=0$ по базе мелкости. Вся информация о препятствии сидит в [[kolebanie-funkcii|колебаниях]] $h_i$: интегрируемость — это умение сделать их взвешенную сумму сколь угодно малой. В терминологии курса это именно критерий, то есть [[priznak-i-svoystvo|признак и свойство]] одновременно.`,
		related: ['summy-darbu', 'kolebanie-funkcii', 'verhniy-nizhniy-integral', 'kriteriy-lebega']
	},

	'summy-darbu': {
		id: 'summy-darbu',
		term: 'Суммы Дарбу U и L',
		short: String.raw`Интегральные суммы, где вместо $f(\xi_i)$ стоят $\sup$ и $\inf$ по куску.`,
		formula: String.raw`U(f,\lambda)=\sum_i M_i\lambda_i,\qquad L(f,\lambda)=\sum_i m_i\lambda_i`,
		body: String.raw`Верхняя и нижняя суммы Дарбу для [[razbienie|разбиения]] $\lambda$: $M_i=\sup_{\Delta_i}f$, $m_i=\inf_{\Delta_i}f$. При любых отмеченных точках $L\le I(f,\lambda,\vec\xi)\le U$, а разность равна взвешенной сумме [[kolebanie-funkcii|колебаний]]: $U-L=\sum_i h_i\lambda_i$.

⚠️ В курсе $U$ и $L$ определены сразу как пределы при $\lambda_R\to0$ (расхождение № 21 с учебниками). Такая запись обходит [[izmelchenie-razbieniya|лемму об измельчении]] — а вместе с ней и вопрос, почему предел существует.`,
		related: ['razbienie', 'kolebanie-funkcii', 'verhniy-nizhniy-integral', 'izmelchenie-razbieniya']
	},

	'kolebanie-funkcii': {
		id: 'kolebanie-funkcii',
		term: 'Колебание функции на куске',
		short: String.raw`$h_i=M_i-m_i$ — разброс значений $f$ на отрезке разбиения.`,
		formula: String.raw`h_i=\sup_{\Delta_i}f-\inf_{\Delta_i}f=\sup_{x,x'\in\Delta_i}|f(x)-f(x')|`,
		body: String.raw`Обозначение конспекта (стр. 4): $h_i=\sup\ldots-\inf\ldots$ на $i$-м куске [[razbienie|разбиения]]. Это единственная величина, мешающая интегралу: $U-L=\sum_i h_i\lambda_i$, и весь [[kriteriy-integriruemosti|критерий]] сводится к тому, удаётся ли зажать эту сумму.

Точечный аналог — колебание $\eta(x_0)$ в точке, предел колебаний по стягивающимся окрестностям; через него определяется [[tochka-razryva|точка разрыва]] и формулируется критерий Лебега.`,
		related: ['summy-darbu', 'kriteriy-integriruemosti', 'tochka-razryva', 'razbienie']
	},

	'verhniy-nizhniy-integral': {
		id: 'verhniy-nizhniy-integral',
		term: 'Верхний и нижний интегралы',
		short: String.raw`$\inf$ верхних сумм и $\sup$ нижних — по всем разбиениям сразу.`,
		formula: String.raw`\overline{\int_a^b}f=\inf_\lambda U(f,\lambda),\qquad \underline{\int_a^b}f=\sup_\lambda L(f,\lambda)`,
		body: String.raw`Из [[summy-darbu|сумм Дарбу]] инфимум и супремум берутся по всем [[razbienie|разбиениям]], а не по одному. По [[izmelchenie-razbieniya|лемме об измельчении]] всегда $\underline{\int}\le\overline{\int}$, а интегрируемость — это в точности их равенство; общее значение и есть [[opredelennyy-integral|определённый интеграл]].

В конспекте те же символы $\overline{\int}$ и $\underline{\int}$ определены через предел при $\lambda_R\to0$ — совпадение двух версий само по себе теорема.`,
		related: ['summy-darbu', 'izmelchenie-razbieniya', 'opredelennyy-integral', 'kriteriy-integriruemosti']
	},

	'izmelchenie-razbieniya': {
		id: 'izmelchenie-razbieniya',
		term: 'Измельчение разбиения (лемма Дарбу)',
		short: String.raw`Добавление точек не увеличивает $U$ и не уменьшает $L$.`,
		formula: String.raw`\lambda\subset\lambda'\ \Rightarrow\ L(f,\lambda)\le L(f,\lambda')\le U(f,\lambda')\le U(f,\lambda)`,
		body: String.raw`Разбиение $\lambda'$ измельчает $\lambda$, если содержит все его точки. Супремум по части не превосходит супремума по целому, поэтому при измельчении [[summy-darbu|верхняя сумма]] не растёт, а нижняя не убывает. Следствие через объединение $\lambda^1\cup\lambda^2$: **никакая** нижняя сумма не обгоняет **никакую** верхнюю, откуда $\underline{\int}\le\overline{\int}$.

Это то место, которое в курсе пропущено из-за определения сумм Дарбу через предел; без леммы не доказать переход от «существует разбиение» к базе мелкости.`,
		related: ['summy-darbu', 'verhniy-nizhniy-integral', 'kriteriy-integriruemosti', 'rang-razbieniya']
	},

	'mera-nol': {
		id: 'mera-nol',
		term: 'Множество меры нуль',
		short: String.raw`Прячется в счётное покрытие интервалами суммарной длины меньше любого ε.`,
		formula: String.raw`\mu(S)=0\iff\forall\varepsilon>0\ \exists\{I_k\}:\ S\subset\bigcup_k I_k,\ \sum_k|I_k|<\varepsilon`,
		body: String.raw`Стандартное определение: для любого $\varepsilon>0$ существует не более чем счётное [[pokrytie-intervalami|покрытие интервалами]] с суммарной длиной меньше $\varepsilon$. Всякое счётное множество имеет меру нуль (накрываем $k$-ю точку интервалом длины $\varepsilon/2^{k+1}$), в частности $\mu(\mathbb Q)=0$ — при том что $\mathrm{cl}\,\mathbb Q=\mathbb R$ (см. [[zamykanie|замыкание]]). Отрезок положительной длины меры нуль не имеет.

⚠️ Версия курса ([[nepravilnaya-mera-nol|через $\deg$]]) записана без условия на сумму и потому не работает.`,
		related: ['pokrytie-intervalami', 'nepravilnaya-mera-nol', 'kriteriy-lebega', 'zamykanie']
	},

	'pokrytie-intervalami': {
		id: 'pokrytie-intervalami',
		term: 'Покрытие интервалами',
		short: String.raw`Не более чем счётное семейство интервалов, накрывающее множество.`,
		formula: String.raw`S\subset\bigcup_{k\in\mathbb N_1}I_k,\qquad |I_k|=\text{длина}\ I_k`,
		body: String.raw`Инструмент, которым меряют «размер» множества в определении [[mera-nol|меры нуль]]. Два требования обязательны. Первое — контроль суммы $\sum_k|I_k|<\varepsilon$: без него покрытие есть у любого множества. Второе — **счётность** семейства (индексы из [[n-nol-n-odin|$\mathbb N_1$]]): по несчётному набору одноточечных «интервалов» нулевой длины покрывается и отрезок, и тогда мера нуль была бы у всех множеств сразу.

В $\mathbb R^n$ роль интервалов играют параллелепипеды, а длины — их объёмы.`,
		related: ['mera-nol', 'nepravilnaya-mera-nol', 'n-nol-n-odin']
	},

	'kriteriy-lebega': {
		id: 'kriteriy-lebega',
		term: 'Критерий Лебега',
		short: String.raw`Интегрируемость по Риману ⟺ ограниченность плюс мера нуль у разрывов.`,
		formula: String.raw`f\in\mathcal R[a;b]\iff f\ \text{ограничена и}\ \mu(\mathrm{Disc}\,f)=0`,
		body: String.raw`Полное описание класса интегрируемых по Риману функций: $f$ ограничена на $[a;b]$ и множество её [[tochka-razryva|точек разрыва]] имеет [[mera-nol|меру нуль]]. Доказательство выходит за рамки курса, но обе половины проверяются на свидетелях: [[funkciya-dirihle|функция Дирихле]] разрывна всюду и не интегрируема, [[funkciya-rimana|функция Римана]] разрывна ровно на $\mathbb Q$ и интегрируема.

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

⚠️ Классификации разрывов (устранимый, первого и второго рода) в конспектах курса нет — это один из пробелов первого семестра; величина $\eta$ при этом введена в конспекте «Предел функции».`,
		related: ['kriteriy-lebega', 'kolebanie-funkcii', 'funkciya-rimana', 'mera-nol']
	},

	'ravnomernaya-nepreryvnost': {
		id: 'ravnomernaya-nepreryvnost',
		term: 'Равномерная непрерывность',
		short: String.raw`Одно $\delta$ годится сразу для всех точек множества.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall x,x':\ \rho(x,x')<\delta\Rightarrow|f(x)-f(x')|<\varepsilon`,
		body: String.raw`В отличие от обычной непрерывности, $\delta$ не зависит от точки. По теореме Кантора непрерывная на компакте функция равномерно непрерывна — для отрезка ([[lsk|ЛСК]]) это и даёт интегрируемость: при $\lambda_R<\delta_f\bigl(\varepsilon/(2(b-a))\bigr)$ все [[kolebanie-funkcii|колебания]] $h_i$ малы **одновременно**, и $\sum h_i\lambda_i<\varepsilon$.

⚠️ Ни равномерной непрерывности, ни теоремы Кантора в конспектах первого семестра нет — единственный содержательный пробел по списку КЛК; читать Виноградова гл. 2 § 4 или Зорича гл. IV § 2.`,
		related: ['kriteriy-integriruemosti', 'kolebanie-funkcii', 'lsk', 'metriki-rho']
	},

	'razbienie': {
		id: 'razbienie',
		term: 'Разбиение отрезка',
		short: String.raw`Точки $a=x_1<\dots<x_n=b$; куски $\lambda_i$, ранг $\lambda_R=\max\lambda_i$.`,
		formula: String.raw`a=x_1<x_2<\dots<x_n=b,\qquad \lambda_i=x_{i+1}-x_i`,
		body: String.raw`Определение 16 семестра: набор точек, режущих отрезок $[a;b]$ (в курсе — [[lsk|ЛСК]]) на куски $\Delta_i=[x_i;x_{i+1}]$ длины $\lambda_i$. Мелкость измеряется [[rang-razbieniya|рангом]] $\lambda_R$, а качество приближения — [[summy-darbu|суммами Дарбу]] на этом разбиении.

Разбиение $\lambda'$ **измельчает** $\lambda$, если содержит все его точки; на этом отношении держится [[izmelchenie-razbieniya|лемма Дарбу]].`,
		related: ['rang-razbieniya', 'summy-darbu', 'izmelchenie-razbieniya', 'lsk']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Предел интегральных сумм $I(f,\lambda,\vec\xi)$ по базе мелкости разбиения.`,
		formula: String.raw`\int_a^b f(x)\,dx=\lim_{\lambda_R\to0}\sum_i f(\xi_i)\,\lambda_i=I(f,\lambda,\vec\xi)`,
		body: String.raw`Определение 17: предел интегральных сумм при [[rang-razbieniya|ранге]] $\lambda_R\to0$, одинаковый для всех измельчающихся [[razbienie|разбиений]] и всех наборов отмеченных точек $\vec\xi$. Существует он не всегда — условие даёт [[kriteriy-integriruemosti|критерий интегрируемости]], а полное описание класса — [[kriteriy-lebega|критерий Лебега]].

Через [[verhniy-nizhniy-integral|верхний и нижний интегралы]] то же число записывается как их общее значение.`,
		related: ['razbienie', 'rang-razbieniya', 'kriteriy-integriruemosti', 'verhniy-nizhniy-integral']
	}
};
