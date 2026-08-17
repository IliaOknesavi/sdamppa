import type { Glossary } from '$lib/types';

// Термины дня 20 (верхний и нижний предел, принцип выбора). Понятия, которые
// живут в каноническом глоссарии нотации курса (glossary.ts), здесь НЕ
// дублируются и подключаются перекрёстными ссылками [[...]]:
//   chastichnaya-posledovatelnost, skhodyashchayasya-v-sebe,
//   vykolotaya-okrestnost, n-nol-n-odin, priznak-i-svoystvo, blacksquare.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Карточки supremum, infimum, predel-posledovatelnosti и
// teorema-o-dvuh-gorodovyh намеренно продублированы из дней 14–15, чтобы день
// резолвился независимо.
export const day20Terms: Glossary = {
	'verkhniy-predel': {
		id: 'verkhniy-predel',
		term: 'Верхний предел',
		short: String.raw`Предел невозрастающей последовательности супремумов по хвостам.`,
		formula: String.raw`\overline{\lim_{n\to\infty}}\,x_n=\lim_{n\to\infty}\Bigl(\sup_{k\ge n}x_k\Bigr)=\inf_n S_n`,
		body: String.raw`**Верхний предел** ограниченной последовательности — предел её [[verhnyaya-ogibayushchaya|верхней огибающей]]: $\overline\lim x_n=\lim S_n$, где $S_n=\sup_{k\ge n}x_k$. Так как $S_n$ не возрастает и ограничена снизу, предел существует **всегда** — в отличие от обычного предела. Из монотонности он же равен $\inf_n S_n$.

Определение курса операционное: рецепт вычисления, а не описание. В учебниках то же число задают [[epsilon-harakterizaciya|$\varepsilon$-характеризацией]] или как наибольший из пределов подпоследовательностей; эквивалентность в курсе не доказывается. ⚠️ Не путать с $\sup x_n$: у $(-1)^n(1+\frac1n)$ супремум равен $\frac32$, а верхний предел — $1$.`,
		related: ['nizhniy-predel', 'verhnyaya-ogibayushchaya', 'kriteriy-verhnego-nizhnego', 'epsilon-harakterizaciya']
	},

	'nizhniy-predel': {
		id: 'nizhniy-predel',
		term: 'Нижний предел',
		short: String.raw`Предел неубывающей последовательности инфимумов по хвостам.`,
		formula: String.raw`\underline{\lim_{n\to\infty}}\,x_n=\lim_{n\to\infty}\Bigl(\inf_{k\ge n}x_k\Bigr)=\sup_n i_n`,
		body: String.raw`**Нижний предел** — зеркальное к [[verkhniy-predel|верхнему]] понятие: предел [[nizhnyaya-ogibayushchaya|нижней огибающей]] $i_n=\inf_{k\ge n}x_k$. Огибающая не убывает и ограничена сверху, поэтому предел существует у любой ограниченной последовательности и равен $\sup_n i_n$.

Всегда выполнено $\underline\lim x_n\le\overline\lim x_n$ (следует из $i_n\le S_n$), а равенство — это в точности [[kriteriy-verhnego-nizhnego|критерий сходимости]]. Разность $\overline\lim-\underline\lim$ измеряет, насколько сильно последовательность не сходится: у $(-1)^n$ она равна $2$.`,
		related: ['verkhniy-predel', 'nizhnyaya-ogibayushchaya', 'kriteriy-verhnego-nizhnego', 'infimum']
	},

	'verhnyaya-ogibayushchaya': {
		id: 'verhnyaya-ogibayushchaya',
		term: 'Верхняя огибающая S_i',
		short: String.raw`$S_i=\sup_{k\ge i}x_k$ — супремум хвоста; не возрастает по $i$.`,
		formula: String.raw`S_i=\sup_{k\ge i}x_k,\qquad S_{i+1}\le S_i,\qquad S_i=\max(x_i,S_{i+1})`,
		body: String.raw`Обозначение конспекта для [[supremum|супремума]] хвоста: $S_i=\sup_{k\ge i}x_k$. Монотонность доказывается без $\varepsilon$: хвост $T_{i+1}$ вложен в $T_i$, поэтому $S_i$ — верхняя грань и для $T_{i+1}$, а $S_{i+1}$ — наименьшая из них, откуда $S_{i+1}\le S_i$.

Полезное тождество $S_i=\max(x_i,S_{i+1})$: именно из него следует, что при «падении» $S_i\ne S_{i+1}$ супремум достигается на самом члене $x_i$. ⚠️ Но падений может не быть вовсе: у $x_n=1-\frac1n$ верно $S_n\equiv1$, и грань не достигается никогда. Предел $S_i$ и есть [[verkhniy-predel|верхний предел]].`,
		related: ['nizhnyaya-ogibayushchaya', 'verkhniy-predel', 'supremum', 'chastichnaya-posledovatelnost']
	},

	'nizhnyaya-ogibayushchaya': {
		id: 'nizhnyaya-ogibayushchaya',
		term: 'Нижняя огибающая i_n',
		short: String.raw`$i_n=\inf_{k\ge n}x_k$ — инфимум хвоста; не убывает по $n$.`,
		formula: String.raw`i_n=\inf_{k\ge n}x_k,\qquad i_n\le i_{n+1},\qquad i_n=\min(x_n,i_{n+1})`,
		body: String.raw`Обозначение конспекта для [[infimum|инфимума]] хвоста: $i_n=\inf_{k\ge n}x_k$. Монотонность зеркальна верхнему случаю: сужая множество, инфимум можно только поднять. Вместе с [[verhnyaya-ogibayushchaya|верхней огибающей]] даёт зажатие $i_n\le x_n\le S_n$ — рабочее неравенство доказательства [[kriteriy-verhnego-nizhnego|критерия]].

В конспекте обе огибающие вводятся рисунком-«лесенкой» вложенных скобок над последовательностью, с пометкой на полях $i_1\le i_2\le i_3\le\dots$ и $S_1\ge S_2\ge S_3\ge\dots$ Предел $i_n$ — это [[nizhniy-predel|нижний предел]].`,
		related: ['verhnyaya-ogibayushchaya', 'nizhniy-predel', 'infimum', 'chastichnaya-posledovatelnost']
	},

	'kriteriy-verhnego-nizhnego': {
		id: 'kriteriy-verhnego-nizhnego',
		term: 'Критерий сходимости через верхний и нижний предел',
		short: String.raw`Предел существует тогда и только тогда, когда $\overline\lim=\underline\lim$.`,
		formula: String.raw`\exists\lim_{n\to\infty}x_n=x\iff \overline{\lim_{n\to\infty}}\,x_n=\underline{\lim_{n\to\infty}}\,x_n=x`,
		body: String.raw`Главная теорема дня и жирный пункт списка КЛК2 §2: «последовательность сходится тогда и только тогда, когда её верхний и нижний пределы равны».

Направление $\Leftarrow$ — зажатие $i_n\le x_n\le S_n$ плюс [[teorema-o-dvuh-gorodovyh|теорема о двух городовых]], номер $N_x(\varepsilon)=\max(N_S(\varepsilon),N_i(\varepsilon))$. Направление $\Rightarrow$ — оценка $S_n\le x+\frac\varepsilon2<x+\varepsilon$, откуда $N_S(\varepsilon)=N_x(\frac\varepsilon2)$; половинка нужна, чтобы нестрогое неравенство для [[supremum|супремума]] стало строгим. В конспекте это направление доказано разбором случаев, и стационарный случай там оставлен без обоснования.`,
		related: ['verkhniy-predel', 'nizhniy-predel', 'teorema-o-dvuh-gorodovyh', 'princip-vybora']
	},

	'princip-vybora': {
		id: 'princip-vybora',
		term: 'Принцип выбора Больцано–Вейерштрасса',
		short: String.raw`В любой ограниченной последовательности есть сходящаяся подпоследовательность.`,
		formula: String.raw`x_n\ \text{ограничена}\ \Rightarrow\ \exists\,n_1<n_2<\dots:\ \lim_{k\to\infty}x_{n_k}=\overline{\lim_{n\to\infty}}\,x_n`,
		body: String.raw`Итоговый вывод конспекта «Верхний и нижний предел» (стр. 4, записан зелёным): из всякой ограниченной последовательности извлекается сходящаяся [[podposledovatelnost|подпоследовательность]].

Доказательство здесь идёт **через порядок**, а не через топологию: $\varepsilon$-форма [[supremum|супремума]] с шагом $\frac1k$ вытаскивает из хвоста член, отстоящий от $S_{m_k}$ меньше чем на $\frac1k$, а строгое возрастание номеров обеспечивается сдвигом $m_{k+1}=n_k+1$. Явный номер: $K(\varepsilon)=\max(\lceil 2/\varepsilon\rceil,\ N_S(\frac\varepsilon2))$. Попутно доказывается больше: предел построенной подпоследовательности — ровно [[verkhniy-predel|верхний предел]]. В днях 22–23 та же теорема выводится заново из конечного подпокрытия.`,
		related: ['podposledovatelnost', 'verkhniy-predel', 'kriteriy-verhnego-nizhnego', 'supremum']
	},

	podposledovatelnost: {
		id: 'podposledovatelnost',
		term: 'Подпоследовательность',
		short: String.raw`Выборка членов по строго возрастающим номерам $n_1<n_2<\dots$`,
		formula: String.raw`n_1<n_2<\dots,\qquad k\mapsto x_{n_k},\qquad n_k\ge k`,
		body: String.raw`**Подпоследовательность** $x_{n_k}$ — композиция последовательности со строго возрастающим отображением $k\mapsto n_k$. Из строгого возрастания индукцией следует $n_k\ge k$ — единственное, что нужно в доказательствах: номера уходят в бесконечность.

Отсюда **наследование предела**: если $\lim x_n=x$, то $\lim x_{n_k}=x$ с тем же номером $N_{x_{n_k}}(\varepsilon)=N_x(\varepsilon)$, без деления $\varepsilon$. Контрапозиция даёт признак расходимости: две подпоследовательности с разными пределами убивают предел. ⚠️ Не путать с [[chastichnaya-posledovatelnost|частичной последовательностью]] — у преподавателя это узкий термин, хвост $x_k,x_{k+1},\dots$`,
		related: ['chastichnaya-posledovatelnost', 'princip-vybora', 'predel-posledovatelnosti']
	},

	'chastichnyy-predel': {
		id: 'chastichnyy-predel',
		term: 'Частичный предел',
		short: String.raw`Предел хвоста у преподавателя; предел любой подпоследовательности в учебниках.`,
		body: String.raw`**Частичный предел** в курсе — предел [[chastichnaya-posledovatelnost|частичной последовательности]], то есть хвоста. Поскольку хвост отличается от исходной последовательности конечным числом членов, такой частичный предел совпадает с обычным пределом: он единственный и существует ровно тогда, когда сходится сама последовательность.

⚠️ В классическом изложении частичный предел — предел **любой** [[podposledovatelnost|подпоследовательности]], и их может быть много: у $(-1)^n$ два, у нумерации $\mathbb Q$ — все точки $\overline{\mathbb R}$. Именно на широком понятии стоит учебниковое определение «[[verkhniy-predel|верхний предел]] — наибольший частичный предел». Внутри конспекта термины дальше смешиваются.`,
		related: ['chastichnaya-posledovatelnost', 'podposledovatelnost', 'verkhniy-predel', 'epsilon-harakterizaciya']
	},

	'epsilon-harakterizaciya': {
		id: 'epsilon-harakterizaciya',
		term: 'ε-характеризация верхнего предела',
		short: String.raw`Правее $a+\varepsilon$ членов конечно, правее $a-\varepsilon$ — бесконечно.`,
		formula: String.raw`\bigl|\{n:x_n>a+\varepsilon\}\bigr|<\aleph_0,\qquad \bigl|\{n:x_n>a-\varepsilon\}\bigr|=\aleph_0`,
		body: String.raw`Учебниковое определение [[verkhniy-predel|верхнего предела]], формулируемое про саму последовательность, а не про огибающие: $a=\overline\lim x_n$, если для любого $\varepsilon>0$ правее $a+\varepsilon$ лежит лишь конечное число членов, а правее $a-\varepsilon$ — бесконечное.

Эквивалентность с операционным определением курса не доказывается — её надо восстанавливать самому (задача 5 дня 20): $\Rightarrow$ идёт из $S_N<a+\varepsilon$ и $\varepsilon$-формы [[supremum|супремума]], $\Leftarrow$ — из конечности «правого» множества, дающей $S_n\le a+\frac\varepsilon2$. Рабочее правило: считать удобнее по операционному определению, рассуждать — по этому.`,
		related: ['verkhniy-predel', 'chastichnyy-predel', 'supremum', 'kriteriy-verhnego-nizhnego']
	},

	'monotonnaya-ogranichennaya': {
		id: 'monotonnaya-ogranichennaya',
		term: 'Теорема о монотонной ограниченной',
		short: String.raw`Монотонная ограниченная последовательность сходится к своей точной грани.`,
		formula: String.raw`x_n\nearrow,\ x_n\le C\ \Rightarrow\ \exists\lim x_n=\sup_n x_n`,
		body: String.raw`Теорема Вейерштрасса, жирный пункт КЛК2 §2 (фаза полноты, дни 18–19): неубывающая ограниченная сверху последовательность сходится, причём её предел равен [[supremum|супремуму]]; зеркально — невозрастающая ограниченная снизу сходится к [[infimum|инфимуму]].

В сегодняшнем дне она работает мотором: [[verhnyaya-ogibayushchaya|$S_i$]] не возрастает и ограничена снизу числом $i_1$, [[nizhnyaya-ogibayushchaya|$i_n$]] не убывает и ограничена сверху числом $S_1$ — значит [[verkhniy-predel|верхний]] и [[nizhniy-predel|нижний]] пределы существуют у **любой** ограниченной последовательности.`,
		related: ['supremum', 'infimum', 'verhnyaya-ogibayushchaya', 'verkhniy-predel']
	},

	supremum: {
		id: 'supremum',
		term: 'Супремум (точная верхняя грань)',
		short: String.raw`Наименьшая из верхних граней; рабочая форма — $\varepsilon$-условие.`,
		formula: String.raw`1)\ \forall n:\ x_n\le S;\qquad 2')\ \forall\varepsilon>0\ \exists n:\ x_n>S-\varepsilon`,
		body: String.raw`**Супремум** — наименьшая верхняя грань: 1) $S$ — верхняя грань; 2) любая другая верхняя грань не меньше $S$. Рабочая форма второго условия — **$\varepsilon$-форма**: $\forall\varepsilon>0\ \exists n:\ x_n>S-\varepsilon$.

Сегодня она используется трижды: даёт монотонность [[verhnyaya-ogibayushchaya|огибающей]] (через «наименьшая из граней»), строгую оценку $S_n\le x+\frac\varepsilon2$ в [[kriteriy-verhnego-nizhnego|критерии]] и целую подпоследовательность в [[princip-vybora|принципе выбора]]. ⚠️ Супремум не обязан достигаться: $\sup\sin n=1$, а $\max\{\sin n\}=\varnothing$.`,
		related: ['infimum', 'verhnyaya-ogibayushchaya', 'princip-vybora', 'monotonnaya-ogranichennaya']
	},

	infimum: {
		id: 'infimum',
		term: 'Инфимум (точная нижняя грань)',
		short: String.raw`Наибольшая из нижних граней; $\varepsilon$-форма зеркальна супремуму.`,
		formula: String.raw`1)\ \forall n:\ x_n\ge s;\qquad 2')\ \forall\varepsilon>0\ \exists n:\ x_n<s+\varepsilon`,
		body: String.raw`**Инфимум** — наибольшая нижняя грань: 1) $s$ — нижняя грань; 2) любая другая нижняя грань не превосходит $s$. $\varepsilon$-форма: $\forall\varepsilon>0\ \exists n:\ x_n<s+\varepsilon$.

Как и [[supremum|супремум]], инфимум может не достигаться — это не редкость, а типичная ситуация: у $x_n=\frac{n}{n-\sqrt n}$ инфимум любого хвоста равен $1$, а значения $1$ последовательность не принимает. Именно на таких примерах ломается конспектный разбор [[kriteriy-verhnego-nizhnego|критерия]] через «падения» грани. Инфимумы хвостов образуют [[nizhnyaya-ogibayushchaya|нижнюю огибающую]].`,
		related: ['supremum', 'nizhnyaya-ogibayushchaya', 'nizhniy-predel', 'monotonnaya-ogranichennaya']
	},

	'teorema-o-dvuh-gorodovyh': {
		id: 'teorema-o-dvuh-gorodovyh',
		term: 'Теорема о двух городовых',
		short: String.raw`Сжатая между двумя сходящимися к $A$ сама сходится к $A$.`,
		formula: String.raw`x_n\le y_n\le z_n,\ \lim x_n=\lim z_n=A\ \Rightarrow\ \lim y_n=A`,
		body: String.raw`Она же теорема о сжатой последовательности (день 14). Если $\forall n:\ x_n\le y_n\le z_n$ и $\lim x_n=\lim z_n=A$, то $\lim y_n=A$, причём номер берётся без деления $\varepsilon$: $N_y(\varepsilon)=\max(N_x(\varepsilon),N_z(\varepsilon))$.

Сегодня это рабочий инструмент направления $\Leftarrow$ в [[kriteriy-verhnego-nizhnego|критерии]]: зажатие $i_n\le x_n\le S_n$ выполнено при всех $n$ по построению [[nizhnyaya-ogibayushchaya|огибающих]], поэтому равенство их пределов сразу тянет за собой предел самой последовательности. В конспекте ссылка на теорему не выписана — применена молча.`,
		related: ['kriteriy-verhnego-nizhnego', 'predel-posledovatelnosti', 'nizhnyaya-ogibayushchaya']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`$|x_n-x|<\varepsilon$ для всех $n>N(\varepsilon)$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1:\ \forall n>N\ \ |x_n-x|<\varepsilon`,
		body: String.raw`Последовательность $f:\mathbb N_1\to\mathbb R$ сходится к $x$, если для любого $\varepsilon>0$ найдётся номер $N$, начиная с которого все члены ближе $\varepsilon$ к пределу; в метрическом пространстве модуль заменяется на $\rho(x_n,x)$. Доказательство считается законченным только с явной формулой $N(\varepsilon)$.

Предел не меняется при отбрасывании конечного числа членов — отсюда и совпадение [[chastichnyy-predel|частичного предела]] с обычным. В отличие от [[verkhniy-predel|верхнего]] и [[nizhniy-predel|нижнего]] пределов, существует не всегда: у $(-1)^n$ его нет, а огибающие сходятся.`,
		related: ['verkhniy-predel', 'nizhniy-predel', 'chastichnyy-predel', 'podposledovatelnost']
	}
};
