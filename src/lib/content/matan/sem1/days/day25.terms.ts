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
		body: String.raw`**Признак сравнения** — семейство достаточных условий сходимости, в которых поведение ряда $\sum a_n$ выводится из поведения эталона. Ряд $\sum b_n$ называют **мажорантой**, если $a_n\le b_n$ при всех $n$, и **минорантой**, если $b_n\le a_n$. Версий две: [[mazhorantnyy-priznak|поэлементная]] и [[asimptoticheskiy-priznak|асимптотическая]]; обе — именно [[priznak-i-svoystvo|признаки]], то есть достаточные условия.`,
		related: ['mazhorantnyy-priznak', 'asimptoticheskiy-priznak', 'priznak-i-svoystvo', 'ryad-dirihle']
	},

	'mazhorantnyy-priznak': {
		id: 'mazhorantnyy-priznak',
		term: 'Поэлементный (мажорантный) признак',
		short: String.raw`Сходящаяся мажоранта поверх неотрицательных членов даёт сходимость.`,
		formula: String.raw`\forall n:\ 0\le a_n\le b_n,\ \sum b_n\ \text{сх.}\ \Longrightarrow\ \sum a_n\ \text{сх.}`,
		body: String.raw`**Поэлементная версия** [[priznak-sravneniya|признака сравнения]]: если $\sum b_n$ сходится и $0\le a_n\le b_n$ при всех $n$, то $\sum a_n$ сходится. **Зеркальный случай** для отрицательных членов, $b_n\le a_n\le 0$, сводится к первому заменой знака. Контрапозиция даёт рабочую форму для расходимости: расходящаяся **миноранта** утягивает ряд за собой.`,
		related: ['priznak-sravneniya', 'chastichnaya-summa', 'garmonicheskiy-ryad', 'geometricheskaya-mazhoranta']
	},

	'asimptoticheskiy-priznak': {
		id: 'asimptoticheskiy-priznak',
		term: 'Асимптотический признак',
		short: String.raw`aₙ ∈ Θ(1/nᵖ): при p ≤ 1 расходится, при p > 1 сходится.`,
		formula: String.raw`a_n\in\Theta\!\left(\tfrac1{n^p}\right):\quad p\le1\Rightarrow\text{расх.},\quad p>1\Rightarrow\text{сх.}`,
		body: String.raw`Если члены ряда положительны и принадлежат [[asimptoticheskie-klassy|классу]] $\Theta(1/n^p)$, то при $p\le1$ ряд расходится, при $p>1$ сходится. Условие $\Theta$ существенно: при нулевом пределе отношения вывод неверен.`,
		related: ['asimptoticheskie-klassy', 'ryad-dirihle']
	},

	'ryad-dirihle': {
		id: 'ryad-dirihle',
		term: 'Ряд Дирихле',
		short: String.raw`Σ1/nᵖ — эталон сходимости: сходится ровно при p > 1.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac{1}{n^p}\ \text{сходится}\iff p>1`,
		body: String.raw`Ряд $\sum 1/n^p$ — эталон степенного убывания: сходится тогда и только тогда, когда $p>1$. Опорные случаи — $p=1$ ([[garmonicheskiy-ryad|гармонический ряд]], расходится) и $p=2$ (сходится).`,
		related: ['garmonicheskiy-ryad', 'chastichnaya-summa']
	},

	'priznak-dalambera': {
		id: 'priznak-dalambera',
		term: 'Признак Д’Аламбера',
		short: String.raw`Предел отношения aₙ₊₁/aₙ меньше 1 — сходится, больше 1 — расходится.`,
		formula: String.raw`\lim_{n\to\infty}\frac{a_{n+1}}{a_n}<1\Rightarrow\text{сх.},\qquad >1\Rightarrow\text{расх.}`,
		body: String.raw`Для ряда с положительными членами: если предел отношения $a_{n+1}/a_n$ меньше единицы, ряд сходится, если больше — расходится. При значении, равном единице, ответа нет. Это [[priznak-i-svoystvo|признак]], то есть достаточное условие.`,
		related: ['geometricheskiy-ryad', 'priznak-i-svoystvo']
	},

	'geometricheskaya-mazhoranta': {
		id: 'geometricheskaya-mazhoranta',
		term: 'Геометрическая мажоранта',
		short: String.raw`Оценка aₙ₊₁ < d·aₙ с d < 1 и суммирование прогрессии.`,
		formula: String.raw`a_{n+1}<d\,a_n\ (d<1)\ \Longrightarrow\ \sum_{n>N}a_n<\frac{a_{N+1}}{1-d}`,
		body: String.raw`**Геометрическая мажоранта** — оценка соседних членов $a_{n+1}<d\,a_n$ с постоянным $d<1$, из которой по индукции получается $a_n<a_{N+1}d^{\,n-N-1}$, то есть [[mazhorantnyy-priznak|мажоранта]] в виде сходящегося [[geometricheskiy-ryad|геометрического ряда]]: $\sum_{n>N}a_n<\frac{a_{N+1}}{1-d}$. Зеркальный вариант с $d>1$ даёт расходящуюся **миноранту**: члены растут в прогрессии, и ряд расходится.`,
		related: ['priznak-dalambera', 'geometricheskiy-ryad', 'mazhorantnyy-priznak']
	},

	'teleskopicheskaya-ocenka': {
		id: 'teleskopicheskaya-ocenka',
		term: 'Телескопическая оценка',
		short: String.raw`1/k² < 1/(k−1) − 1/k: блок схлопывается до двух крайних членов.`,
		formula: String.raw`\frac{1}{k^2}<\frac{1}{k(k-1)}=\frac{1}{k-1}-\frac{1}{k}`,
		body: String.raw`**Телескопическая оценка** — замена каждого слагаемого разностью двух дробей, после которой сумма блока схлопывается до двух крайних членов; для [[ryad-dirihle|ряда Дирихле]] при $p=2$ это даёт $\sum_{k=n+1}^{n+p}\frac{1}{k^2}<\frac1n-\frac1{n+p}<\frac1n$.`,
		related: ['kriteriy-koshi-ryad', 'ryad-dirihle', 'garmonicheskiy-ryad']
	},

	ryad: {
		id: 'ryad',
		term: 'Ряд, сходимость и расходимость',
		short: String.raw`Ряд сходится, если существует предел его частичных сумм.`,
		formula: String.raw`\sum_{k=1}^{\infty}a_k\ \text{сх.}\iff \exists c:\ \lim_{i\to\infty}S_i=c`,
		body: String.raw`**Ряд** $\sum_{k=1}^{\infty}a_k$ — предельный объект для [[chastichnaya-summa|частичных сумм]] при $i\to\infty$. Ряд **сходится**, если существует $c$ с $\lim S_i=c$, и **расходится**, если такого $c$ нет. Определение опирается прямо на предел последовательности в метрическом пространстве, а не на отдельное понятие «суммы ряда».`,
		related: ['chastichnaya-summa', 'kriteriy-koshi-ryad', 'neobkhodimyy-priznak', 'garmonicheskiy-ryad']
	},

};
