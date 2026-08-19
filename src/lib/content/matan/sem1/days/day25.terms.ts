import type { Glossary } from '$lib/types';

// Термины дня 25. Каркас рядов вводится днём 24 — ряд, частичная сумма,
// гармонический ряд, необходимый признак, критерий Коши. Эти карточки
// продублированы здесь намеренно: день должен резолвиться независимо, без
// чтения соседних файлов. Термины из канонического глоссария
// (priznak-i-svoystvo, asimptoticheskie-klassy, n-nol-n-odin, blacksquare, ...)
// не дублируются — на них только ссылки [[...]].
export const day25Terms: Glossary = {
	'priznak-sravneniya': {
		id: 'priznak-sravneniya',
		term: 'Признак сравнения',
		short: String.raw`Общая схема: зажать неизвестный ряд между эталонными.`,
		formula: String.raw`0\le a_n\le b_n\ \Longrightarrow\ 0\le S_n^{a}\le S_n^{b}`,
		body: String.raw`**Признак сравнения** — семейство достаточных условий сходимости, в которых поведение ряда $\sum a_n$ выводится из поведения эталона. Ряд $\sum b_n$ называют **мажорантой**, если $a_n\le b_n$ при всех $n$, и **минорантой**, если $b_n\le a_n$.

Работает схема на знакопостоянных рядах: при $a_n\ge0$ [[chastichnaya-summa|частичные суммы]] монотонны, поэтому сходимость равносильна их ограниченности, а ограниченность наследуется от мажоранты. Версий две: [[mazhorantnyy-priznak|поэлементная]] и [[asimptoticheskiy-priznak|асимптотическая]]. Обе — именно [[priznak-i-svoystvo|признаки]], то есть достаточные условия.`,
		related: ['mazhorantnyy-priznak', 'asimptoticheskiy-priznak', 'priznak-i-svoystvo', 'ryad-dirihle']
	},

	'mazhorantnyy-priznak': {
		id: 'mazhorantnyy-priznak',
		term: 'Поэлементный (мажорантный) признак',
		short: String.raw`Сходящаяся мажоранта поверх неотрицательных членов даёт сходимость.`,
		formula: String.raw`\forall n:\ 0\le a_n\le b_n,\ \sum b_n\ \text{сх.}\ \Longrightarrow\ \sum a_n\ \text{сх.}`,
		body: String.raw`**Поэлементный признак сравнения**: если $\sum b_n$ сходится и $0\le a_n\le b_n$ при всех $n$, то $\sum a_n$ сходится. **Зеркальный случай** для отрицательных членов, $b_n\le a_n\le 0$, сводится к первому заменой знака.

Доказательство: из $0\le S_n^{a}\le S_n^{b}\le B$ следует, что [[chastichnaya-summa|частичные суммы]] не убывают и ограничены, дальше работает теорема о монотонной ограниченной последовательности. Контрапозиция даёт рабочую форму для расходимости: расходящаяся **миноранта** утягивает ряд за собой.`,
		related: ['priznak-sravneniya', 'chastichnaya-summa', 'garmonicheskiy-ryad', 'geometricheskaya-mazhoranta']
	},

	'asimptoticheskiy-priznak': {
		id: 'asimptoticheskiy-priznak',
		term: 'Асимптотический признак',
		short: String.raw`aₙ ∈ Θ(1/nᵖ): при p ≤ 1 расходится, при p > 1 сходится.`,
		formula: String.raw`a_n\in\Theta\!\left(\tfrac1{n^p}\right):\quad p\le1\Rightarrow\text{расх.},\quad p>1\Rightarrow\text{сх.}`,
		body: String.raw`**Асимптотический признак сравнения** формулируется прямо на языке [[asimptoticheskie-klassy|асимптотических классов]]: если $a_n>0$ и $a_n\in\Theta(1/n^p)$, то при $p\le1$ ряд расходится, при $p>1$ — сходится.

В одну формулировку слиты два факта: признак сравнения в предельной форме и поведение эталонного [[ryad-dirihle|ряда Дирихле]]. Условие $0<c<\infty$ держится только на пометке $\Theta$: при $c=0$ вывод неверен ($a_n=1/n^2$, $p=1$ даёт $c=0$, но ряд сходится). Доказательство — двусторонняя оценка через $\varepsilon=c/2$ и [[mazhorantnyy-priznak|поэлементный признак]].`,
		related: ['asimptoticheskie-klassy', 'ryad-dirihle', 'mazhorantnyy-priznak', 'garmonicheskiy-ryad']
	},

	'ryad-dirihle': {
		id: 'ryad-dirihle',
		term: 'Ряд Дирихле',
		short: String.raw`Σ1/nᵖ — эталон сходимости: сходится ровно при p > 1.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac{1}{n^p}\ \text{сходится}\iff p>1`,
		body: String.raw`**Ряд Дирихле** $\sum 1/n^p$ — главный эталон для степенного убывания: сходится тогда и только тогда, когда $p>1$. Отдельной теоремой он не нужен — эта классификация по $p$ и есть содержательная часть [[asimptoticheskiy-priznak|асимптотического признака]].

Опорных случаев два: $p=1$ — расходящийся [[garmonicheskiy-ryad|гармонический ряд]], $p=2$ — сходящийся $\sum1/n^2$, доказываемый [[teleskopicheskaya-ocenka|телескопической оценкой]]. Общий случай $p>1$ получается той же идеей — блоками, мажорируемыми геометрической прогрессией со знаменателем $2^{1-p}<1$.`,
		related: ['asimptoticheskiy-priznak', 'garmonicheskiy-ryad', 'teleskopicheskaya-ocenka', 'geometricheskiy-ryad']
	},

	'priznak-dalambera': {
		id: 'priznak-dalambera',
		term: 'Признак Д’Аламбера',
		short: String.raw`Предел отношения aₙ₊₁/aₙ меньше 1 — сходится, больше 1 — расходится.`,
		formula: String.raw`\lim_{n\to\infty}\frac{a_{n+1}}{a_n}<1\Rightarrow\text{сх.},\qquad >1\Rightarrow\text{расх.}`,
		body: String.raw`**Признак Д’Аламбера** для $a_n>0$: если $\lim\frac{a_{n+1}}{a_n}<1$, ряд сходится; если больше единицы — расходится; при значении, равном единице, ответа нет.

Доказательство ведётся через **обратное** отношение $x_n=\frac{a_n}{a_{n+1}}$, $\lim x_n=c$, поэтому пороги в нём перевёрнуты: $c>1$ — сходимость (через [[geometricheskaya-mazhoranta|геометрическую мажоранту]]), $c\in[0;1)$ — расходимость (растущие члены, нарушен [[neobkhodimyy-priznak|необходимый признак]]), $c=1$ — ответа нет. Два примера с $c=1$: $1/n$ расходится, $1/n^2$ сходится.`,
		related: ['geometricheskaya-mazhoranta', 'geometricheskiy-ryad', 'neobkhodimyy-priznak', 'asimptoticheskiy-priznak']
	},

	'geometricheskaya-mazhoranta': {
		id: 'geometricheskaya-mazhoranta',
		term: 'Геометрическая мажоранта',
		short: String.raw`Оценка aₙ₊₁ < d·aₙ с d < 1 и суммирование прогрессии.`,
		formula: String.raw`a_{n+1}<d\,a_n\ (d<1)\ \Longrightarrow\ \sum_{n>N}a_n<\frac{a_{N+1}}{1-d}`,
		body: String.raw`**Геометрическая мажоранта** — приём, на котором держится [[priznak-dalambera|признак Д’Аламбера]]: из оценки соседних членов $a_{n+1}<d\,a_n$ с постоянным $d<1$ по индукции получается $a_n<a_{N+1}d^{\,n-N-1}$, то есть сходящийся [[geometricheskiy-ryad|геометрический ряд]] сверху.

Дальше срабатывает [[mazhorantnyy-priznak|поэлементный признак]]. Зеркальный вариант с $d>1$ даёт расходящуюся **миноранту**: члены растут в прогрессии, и ряд расходится. Именно поэтому Д’Аламбер видит только экспоненциальную шкалу и слеп к степенному убыванию.`,
		related: ['priznak-dalambera', 'geometricheskiy-ryad', 'mazhorantnyy-priznak']
	},

	'geometricheskiy-ryad': {
		id: 'geometricheskiy-ryad',
		term: 'Геометрический ряд',
		short: String.raw`Σdⁿ⁻¹ — эталон: сходится при |d| < 1, расходится при |d| ≥ 1.`,
		formula: String.raw`\sum_{n=1}^{\infty}d^{\,n-1}=\frac{1}{1-d}\quad (|d|<1)`,
		body: String.raw`**Геометрический ряд** $\sum d^{\,n-1}$ — второй эталон наряду с [[ryad-dirihle|рядом Дирихле]]: при $|d|<1$ сходится к $\frac1{1-d}$, при $|d|\ge1$ расходится (члены не стремятся к нулю — нарушен [[neobkhodimyy-priznak|необходимый признак]]).

Проверяется он в одну строку через явную [[chastichnaya-summa|частичную сумму]] $S_n=\frac{1-d^{\,n}}{1-d}$. На этом факте стоят обе ветки признака Д’Аламбера: сходящаяся мажоранта при $d<1$ и расходящаяся миноранта при $d>1$.`,
		related: ['geometricheskaya-mazhoranta', 'ryad-dirihle', 'chastichnaya-summa', 'neobkhodimyy-priznak']
	},

	'teleskopicheskaya-ocenka': {
		id: 'teleskopicheskaya-ocenka',
		term: 'Телескопическая оценка',
		short: String.raw`1/k² < 1/(k−1) − 1/k: блок схлопывается до двух крайних членов.`,
		formula: String.raw`\frac{1}{k^2}<\frac{1}{k(k-1)}=\frac{1}{k-1}-\frac{1}{k}`,
		body: String.raw`**Телескопическая оценка** — замена каждого слагаемого разностью двух дробей, после которой сумма блока схлопывается до крайних членов:

$$\sum_{k=n+1}^{n+p}\frac{1}{k^2}<\frac1n-\frac1{n+p}<\frac1n.$$

Это корректное доказательство сходимости $\sum1/n^2$: правая часть **не зависит от $p$**, поэтому [[kriteriy-koshi-ryad|критерий Коши]] проходит с явным $N(\varepsilon)=\lceil1/\varepsilon\rceil$. Грубая оценка $p/n^2\to0$ вместо неё не годится: она верна лишь при фиксированном $p$, и та же цепочка «доказала» бы сходимость [[garmonicheskiy-ryad|гармонического ряда]].`,
		related: ['kriteriy-koshi-ryad', 'ryad-dirihle', 'garmonicheskiy-ryad']
	},

	ryad: {
		id: 'ryad',
		term: 'Ряд, сходимость и расходимость',
		short: String.raw`Ряд сходится, если существует предел его частичных сумм.`,
		formula: String.raw`\sum_{k=1}^{\infty}a_k\ \text{сх.}\iff \exists c:\ \lim_{i\to\infty}S_i=c`,
		body: String.raw`**Ряд** $\sum_{k=1}^{\infty}a_k$ — предельный объект для [[chastichnaya-summa|частичных сумм]] при $i\to\infty$. Ряд **сходится**, если существует $c$ с $\lim S_i=c$, и **расходится**, если такого $c$ нет.

Определение опирается прямо на предел последовательности в метрическом пространстве, а не на отдельное понятие «суммы ряда». Отсюда все инструменты дня: [[kriteriy-koshi-ryad|критерий Коши]], [[neobkhodimyy-priznak|необходимый признак]] и признаки сравнения — это переписанные свойства предела $S_i$.`,
		related: ['chastichnaya-summa', 'kriteriy-koshi-ryad', 'neobkhodimyy-priznak', 'garmonicheskiy-ryad']
	},

	'chastichnaya-summa': {
		id: 'chastichnaya-summa',
		term: 'Частичная сумма',
		short: String.raw`Sᵢ = a₁ + … + aᵢ — конечный обрезок ряда.`,
		formula: String.raw`S_i=\sum_{k=1}^{i}a_k,\qquad S_{n+1}=S_n+a_{n+1}`,
		body: String.raw`**Частичная сумма** $S_i=\sum_{k=1}^{i}a_k$ — то, предел чего и называют суммой [[ryad|ряда]].

Для знакопостоянного ряда с $a_n\ge0$ последовательность $S_i$ **не убывает**, поэтому сходимость равносильна ограниченности — на этом стоит весь [[mazhorantnyy-priznak|поэлементный признак]]. Рекуррентная связь $S_{n+1}=S_n+a_{n+1}$ даёт [[neobkhodimyy-priznak|необходимый признак]], а разность $S_{n+p}-S_n$ — [[kriteriy-koshi-ryad|критерий Коши]].`,
		related: ['ryad', 'mazhorantnyy-priznak', 'kriteriy-koshi-ryad', 'neobkhodimyy-priznak']
	},

	'garmonicheskiy-ryad': {
		id: 'garmonicheskiy-ryad',
		term: 'Гармонический ряд',
		short: String.raw`Σ1/n расходится, хотя члены стремятся к нулю.`,
		formula: String.raw`\frac{1}{n+1}+\dots+\frac{1}{n+p}>\frac{p}{n+p}\ \xrightarrow{\ p=n\ }\ \frac12`,
		body: String.raw`**Гармонический ряд** $\sum 1/n$ — главный контрпример темы: $\lim a_n=0$, но ряд расходится, то есть [[neobkhodimyy-priznak|необходимый признак]] действительно только необходим.

Механика (день 24): все $p$ слагаемых блока заменяются наименьшим, получается $\frac{p}{n+p}$, и при выборе $p=n$ это ровно $\frac12$ — [[kriteriy-koshi-ryad|критерий Коши]] нарушен при $\varepsilon=\frac12$. Тот же выбор $p=n$ показывает, почему грубая оценка «$p/n^2\to0$» не годится. В [[asimptoticheskiy-priznak|асимптотическом признаке]] гармонический ряд служит расходящейся минорантой при $p\le1$.`,
		related: ['neobkhodimyy-priznak', 'kriteriy-koshi-ryad', 'ryad-dirihle', 'asimptoticheskiy-priznak']
	},

	'kriteriy-koshi-ryad': {
		id: 'kriteriy-koshi-ryad',
		term: 'Критерий Коши для рядов',
		short: String.raw`Блоки любой длины малы — необходимое и достаточное условие сходимости.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\ \forall n>N\ \forall p\in\mathbb N_1:\ |a_{n+1}+\dots+a_{n+p}|<\varepsilon`,
		body: String.raw`**Критерий Коши** (день 24): [[ryad|ряд]] сходится тогда и только тогда, когда блоки $a_{n+1}+\dots+a_{n+p}$ малы при больших $n$ **равномерно по $p$**. Это переписанная в терминах [[chastichnaya-summa|частичных сумм]] фундаментальность ([[skhodyashchayasya-v-sebe|сходимость в себе]]) со сдвигом $p\in\mathbb N_1$.

Порядок кванторов здесь — рабочая часть формулировки: $\forall p$ стоит **после** выбора $N$, поэтому оценка блока не имеет права зависеть от $p$. Именно на этом ломается оценка $p/n^2$ для $\sum1/n^2$ и держится [[teleskopicheskaya-ocenka|телескопическая оценка]].`,
		related: ['ryad', 'chastichnaya-summa', 'skhodyashchayasya-v-sebe', 'teleskopicheskaya-ocenka']
	},

	'neobkhodimyy-priznak': {
		id: 'neobkhodimyy-priznak',
		term: 'Необходимый признак сходимости',
		short: String.raw`Ряд сходится ⟹ aₙ → 0; обратное неверно.`,
		formula: String.raw`\sum a_n\ \text{сх.}\ \Longrightarrow\ \lim_{n\to\infty}a_n=0`,
		body: String.raw`**Необходимый признак сходимости**: если [[ryad|ряд]] сходится, то $\lim a_n=0$. Выводится из [[kriteriy-koshi-ryad|критерия Коши]] при $p=1$: $|S_{n+1}-S_n|=|a_{n+1}|<\varepsilon$, связь номеров $N_a=N_S+1$.

По терминологическому соглашению ([[priznak-i-svoystvo|признак и свойство]]) это условие **необходимое**, то есть по-хорошему свойство, — название за ним закрепилось историческое. Обратное неверно, контрпример — [[garmonicheskiy-ryad|гармонический ряд]]. Рабочее применение: если $a_n\not\to0$, ряд расходится — так быстрее всего закрываются $\sum 2^n/n^2$ и $\sum n^n/n!$.`,
		related: ['ryad', 'kriteriy-koshi-ryad', 'garmonicheskiy-ryad', 'priznak-i-svoystvo']
	}
};
