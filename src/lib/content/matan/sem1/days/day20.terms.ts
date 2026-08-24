import type { Glossary } from '$lib/types';

// Термины дня 20 (верхний и нижний предел, принцип выбора). Понятия, которые
// живут в каноническом глоссарии (glossary.ts), здесь НЕ дублируются и
// подключаются перекрёстными ссылками [[...]]:
//   chastichnaya-posledovatelnost, skhodyashchayasya-v-sebe,
//   vykolotaya-okrestnost, n-nol-n-odin, priznak-i-svoystvo, blacksquare.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Карточки supremum, infimum, predel-posledovatelnosti и
// teorema-o-dvuh-gorodovyh намеренно продублированы из [дней 14–15](/aii/matan/1/day/14), чтобы день
// резолвился независимо.
export const day20Terms: Glossary = {
	'verkhniy-predel': {
		id: 'verkhniy-predel',
		term: 'Верхний предел',
		short: String.raw`Предел невозрастающей последовательности супремумов по хвостам.`,
		formula: String.raw`\overline{\lim_{n\to\infty}}\,x_n=\lim_{n\to\infty}\Bigl(\sup_{k\ge n}x_k\Bigr)=\inf_n S_n`,
		body: String.raw`**Верхний предел** ограниченной последовательности — предел её [[verhnyaya-ogibayushchaya|верхней огибающей]]: $\overline\lim x_n=\lim S_n$, где $S_n=\sup_{k\ge n}x_k$. Так как $S_n$ не возрастает и ограничена снизу, предел существует **всегда** — в отличие от обычного предела. Из монотонности он же равен $\inf_n S_n$.

Равенство $\overline\lim x_n=\lim S_n$ — рецепт вычисления; то же число задают [[epsilon-harakterizaciya|$\varepsilon$-характеризация]] и описание «наибольший из пределов сходящихся подпоследовательностей». Не путать с $\sup x_n$: у $(-1)^n(1+\frac1n)$ супремум равен $\frac32$, а верхний предел — $1$, потому что $\sup$ видит конечную голову, а $\overline\lim$ — нет.`,
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
		body: String.raw`[[supremum|Супремум]] хвоста: $S_i=\sup_{k\ge i}x_k$. Монотонность доказывается без $\varepsilon$: хвост $T_{i+1}$ вложен в $T_i$, поэтому $S_i$ — верхняя грань и для $T_{i+1}$, а $S_{i+1}$ — наименьшая из них, откуда $S_{i+1}\le S_i$.

Полезное тождество $S_i=\max(x_i,S_{i+1})$: именно из него следует, что при «падении» $S_i\ne S_{i+1}$ супремум достигается на самом члене $x_i$. Но падений может не быть вовсе: у $x_n=1-\frac1n$ верно $S_n\equiv1$, и грань не достигается никогда. Предел $S_i$ и есть [[verkhniy-predel|верхний предел]].`,
		related: ['nizhnyaya-ogibayushchaya', 'verkhniy-predel', 'supremum', 'chastichnaya-posledovatelnost']
	},

	'nizhnyaya-ogibayushchaya': {
		id: 'nizhnyaya-ogibayushchaya',
		term: 'Нижняя огибающая i_n',
		short: String.raw`$i_n=\inf_{k\ge n}x_k$ — инфимум хвоста; не убывает по $n$.`,
		formula: String.raw`i_n=\inf_{k\ge n}x_k,\qquad i_n\le i_{n+1},\qquad i_n=\min(x_n,i_{n+1})`,
		body: String.raw`[[infimum|Инфимум]] хвоста: $i_n=\inf_{k\ge n}x_k$. Монотонность зеркальна верхнему случаю: сужая множество, инфимум можно только поднять. Вместе с [[verhnyaya-ogibayushchaya|верхней огибающей]] даёт зажатие $i_n\le x_n\le S_n$ — рабочее неравенство доказательства [[kriteriy-verhnego-nizhnego|критерия]].

Наглядная картинка — «лесенка» вложенных хвостов над последовательностью: с ростом номера нижний край поднимается ($i_1\le i_2\le i_3\le\dots$), верхний опускается ($S_1\ge S_2\ge S_3\ge\dots$). Предел $i_n$ — это [[nizhniy-predel|нижний предел]].`,
		related: ['verhnyaya-ogibayushchaya', 'nizhniy-predel', 'infimum', 'chastichnaya-posledovatelnost']
	},

	'kriteriy-verhnego-nizhnego': {
		id: 'kriteriy-verhnego-nizhnego',
		term: 'Критерий сходимости через верхний и нижний предел',
		short: String.raw`Предел существует тогда и только тогда, когда $\overline\lim=\underline\lim$.`,
		formula: String.raw`\exists\lim_{n\to\infty}x_n=x\iff \overline{\lim_{n\to\infty}}\,x_n=\underline{\lim_{n\to\infty}}\,x_n=x`,
		body: String.raw`Главная теорема дня: последовательность сходится тогда и только тогда, когда её верхний и нижний пределы равны, и тогда общее значение и есть предел.

Направление $\Leftarrow$ — зажатие $i_n\le x_n\le S_n$ плюс [[teorema-o-dvuh-gorodovyh|теорема о двух городовых]], номер $N_x(\varepsilon)=\max(N_S(\varepsilon),N_i(\varepsilon))$. Направление $\Rightarrow$ — оценка $S_n\le x+\frac\varepsilon2<x+\varepsilon$, откуда $N_S(\varepsilon)=N_x(\frac\varepsilon2)$; половинка нужна, чтобы нестрогое неравенство для [[supremum|супремума]] стало строгим. Разбор случаев через «падения» огибающей эту оценку не заменяет: у стационарной огибающей ($x_n=1-\frac1n$, $S_n\equiv1$) падений нет ни одного.`,
		related: ['verkhniy-predel', 'nizhniy-predel', 'teorema-o-dvuh-gorodovyh', 'princip-vybora']
	},

	'princip-vybora': {
		id: 'princip-vybora',
		term: 'Принцип выбора Больцано–Вейерштрасса',
		short: String.raw`В любой ограниченной последовательности есть сходящаяся подпоследовательность.`,
		formula: String.raw`x_n\ \text{ограничена}\ \Rightarrow\ \exists\,n_1<n_2<\dots:\ \lim_{k\to\infty}x_{n_k}=\overline{\lim_{n\to\infty}}\,x_n`,
		body: String.raw`Из всякой ограниченной последовательности извлекается сходящаяся [[podposledovatelnost|подпоследовательность]].

Доказательство здесь идёт **через порядок**, а не через топологию: $\varepsilon$-форма [[supremum|супремума]] с шагом $\frac1k$ вытаскивает из хвоста член, отстоящий от $S_{m_k}$ меньше чем на $\frac1k$, а строгое возрастание номеров обеспечивается сдвигом $m_{k+1}=n_k+1$. Явный номер: $K(\varepsilon)=\max(\lceil 2/\varepsilon\rceil,\ N_S(\frac\varepsilon2))$. Попутно доказывается больше: предел построенной подпоследовательности — ровно [[verkhniy-predel|верхний предел]]. В [днях 22–23](/aii/matan/1/day/22) та же теорема выводится заново из конечного подпокрытия.`,
		related: ['podposledovatelnost', 'verkhniy-predel', 'kriteriy-verhnego-nizhnego', 'supremum']
	},

	'chastichnyy-predel': {
		id: 'chastichnyy-predel',
		term: 'Частичный предел',
		short: String.raw`Предел хвоста; совпадает с обычным пределом последовательности.`,
		body: String.raw`**Частичный предел** — предел [[chastichnaya-posledovatelnost|частичной последовательности]], то есть хвоста. Поскольку хвост отличается от исходной последовательности конечным числом членов, частичный предел совпадает с обычным: он единственный и существует ровно тогда, когда сходится сама последовательность. У $(-1)^n$ частичных пределов нет ни одного.

Не следует путать его с пределом [[podposledovatelnost|подпоследовательности]]: таких пределов бывает много — у $(-1)^n$ их два ($1$ и $-1$), у последовательности, перечисляющей $\mathbb Q$, ими служат все точки $\overline{\mathbb R}$. Наибольший из них равен [[verkhniy-predel|верхнему пределу]], и это одно из его равносильных описаний.`,
		related: ['chastichnaya-posledovatelnost', 'podposledovatelnost', 'verkhniy-predel', 'epsilon-harakterizaciya']
	},

	'epsilon-harakterizaciya': {
		id: 'epsilon-harakterizaciya',
		term: 'ε-характеризация верхнего предела',
		short: String.raw`Правее $a+\varepsilon$ членов конечно, правее $a-\varepsilon$ — бесконечно.`,
		formula: String.raw`\bigl|\{n:x_n>a+\varepsilon\}\bigr|<\aleph_0,\qquad \bigl|\{n:x_n>a-\varepsilon\}\bigr|=\aleph_0`,
		body: String.raw`Описание [[verkhniy-predel|верхнего предела]] через саму последовательность, а не через огибающие: $a=\overline\lim x_n$, если для любого $\varepsilon>0$ правее $a+\varepsilon$ лежит лишь конечное число членов, а правее $a-\varepsilon$ — бесконечное.

Равносильность с $a=\lim S_n$ доказывается в задаче 5 дня 20: $\Rightarrow$ идёт из $S_N<a+\varepsilon$ и $\varepsilon$-формы [[supremum|супремума]], $\Leftarrow$ — из конечности «правого» множества, дающей $S_n\le a+\frac\varepsilon2$. Рабочее правило: считать удобнее по $\lim S_n$, рассуждать — по этому описанию.`,
		related: ['verkhniy-predel', 'chastichnyy-predel', 'supremum', 'kriteriy-verhnego-nizhnego']
	},

	'monotonnaya-ogranichennaya': {
		id: 'monotonnaya-ogranichennaya',
		term: 'Теорема о монотонной ограниченной',
		short: String.raw`Монотонная ограниченная последовательность сходится к своей точной грани.`,
		formula: String.raw`x_n\nearrow,\ x_n\le C\ \Rightarrow\ \exists\lim x_n=\sup_n x_n`,
		body: String.raw`Теорема Вейерштрасса ([день 19](/aii/matan/1/day/19)): неубывающая ограниченная сверху последовательность сходится, причём её предел равен [[supremum|супремуму]]; зеркально — невозрастающая ограниченная снизу сходится к [[infimum|инфимуму]].

В сегодняшнем дне она работает мотором: [[verhnyaya-ogibayushchaya|$S_i$]] не возрастает и ограничена снизу числом $i_1$, [[nizhnyaya-ogibayushchaya|$i_n$]] не убывает и ограничена сверху числом $S_1$ — значит [[verkhniy-predel|верхний]] и [[nizhniy-predel|нижний]] пределы существуют у **любой** ограниченной последовательности.`,
		related: ['supremum', 'infimum', 'verhnyaya-ogibayushchaya', 'verkhniy-predel']
	},

};
