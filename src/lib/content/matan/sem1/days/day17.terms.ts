import type { Glossary } from '$lib/types';

// Термины дня 17 (конспект «Пределы», стр. 23–25). Понятия из канонического
// глоссария курса здесь НЕ переобъявляются и используются только
// перекрёстными ссылками: asimptoticheskie-klassy, n-nol-n-odin, blacksquare,
// chastichnaya-posledovatelnost, priznak-i-svoystvo и прочие.
// Карточки predel-posledovatelnosti, shodyashchayasya-posledovatelnost,
// beskonechno-malaya, beskonechno-bolshaya и neopredelennost продублированы
// из дней 11–16 намеренно: день должен резолвиться независимо от того,
// открыт ли предыдущий.
export const day17Terms: Glossary = {
	'o-bolshoe': {
		id: 'o-bolshoe',
		term: 'O-большое (O̲)',
		short: String.raw`Предел отношения существует и конечен — «растёт не быстрее».`,
		formula: String.raw`f_n\in\underline O(g_n)\iff\exists\lim_{n\to\infty}\frac{f_n}{g_n}=C\in\mathbb R`,
		body: String.raw`**$O$-большое** в курсе определено через существование **конечного** предела отношения, причём нулевой предел разрешён — в конспекте стоит пометка «в т. ч. $C=0$». Отсюда разбиение $\underline O(g_n)=\overline o(g_n)\sqcup\Theta(g_n)$.

Пишут $f_n\in\underline O(g_n)$: класс — это множество последовательностей. Подчёркивание нужно, чтобы в рукописи «$O$ большое» не слилось с [[o-maloe|$\overline o$]]. ⚠️ [[klassicheskoe-o-bolshoe|Классическое определение]] через неравенство $|f_n|\le C|g_n|$ **шире**: колеблющееся отношение оно допускает, а предел — нет.`,
		related: ['o-maloe', 'teta-klass', 'klassicheskoe-o-bolshoe', 'asimptoticheskie-klassy']
	},

	'o-maloe': {
		id: 'o-maloe',
		term: 'o-малое (ō)',
		short: String.raw`Отношение $f_n/g_n$ — бесконечно малая: предел равен нулю.`,
		formula: String.raw`f_n\in\overline o(g_n)\iff\lim_{n\to\infty}\frac{f_n}{g_n}=0`,
		body: String.raw`**$o$-малое** — это требование «растёт строго медленнее»: отношение $f_n/g_n$ обязано быть [[beskonechno-malaya|бесконечно малой]]. В конспекте красным отмечено вложение $\overline o(g_n)\subset\underline O(g_n)$, и оно строгое: сама $g_n$ лежит в [[o-bolshoe|$\underline O(g_n)$]], но не в $\overline o(g_n)$, поскольку $\lim g_n/g_n=1\ne0$.

Надчёркивание $\overline o$ — авторская нотация для почерка. Двойственный класс — [[omega-malaya|$\omega$]]: $f_n\in\omega(g_n)$ означает ровно $g_n\in\overline o(f_n)$. Во втором семестре $\overline o$ становится рабочей записью в определении дифференцируемости.`,
		related: ['o-bolshoe', 'omega-malaya', 'beskonechno-malaya', 'teta-klass']
	},

	'teta-klass': {
		id: 'teta-klass',
		term: 'Θ (тета)',
		short: String.raw`Оба предела — прямой и перевёрнутый — конечны; значит, оба ненулевые.`,
		formula: String.raw`f_n\in\Theta(g_n)\iff\lim_{n\to\infty}\frac{f_n}{g_n}=c,\ \ c\ne0`,
		body: String.raw`**$\Theta$** в конспекте определена двумя условиями сразу: конечны и $\lim f_n/g_n=C_1$, и $\lim g_n/f_n=C_2$. Из тождества $\frac{f_n}{g_n}\cdot\frac{g_n}{f_n}=1$ и арифметики пределов следует $C_1C_2=1$, а значит ни один из пределов не нулевой — в определении это не выписано, но выводится.

Отсюда два описания через [[o-bolshoe|$\underline O$]]: $\Theta(g_n)=\underline O(g_n)\cap\Omega(g_n)$ и $\Theta(g_n)=\underline O(g_n)\setminus\overline o(g_n)$. $\Theta$ — отношение эквивалентности, её классы называют [[poryadok-rosta|порядками роста]]; на языке $\Theta$ сформулирован признак сравнения рядов (день 25).`,
		related: ['o-bolshoe', 'omega-bolshaya', 'poryadok-rosta', 'ekvivalentnye-posledovatelnosti']
	},

	'omega-bolshaya': {
		id: 'omega-bolshaya',
		term: 'Ω (омега большая)',
		short: String.raw`То же, что O̲, но для перевёрнутой дроби: «растёт не медленнее».`,
		formula: String.raw`f_n\in\Omega(g_n)\iff\exists\lim_{n\to\infty}\frac{g_n}{f_n}=C\in\mathbb R`,
		body: String.raw`**$\Omega$** требует конечности предела **перевёрнутого** отношения $g_n/f_n$. Двойственность с [[o-bolshoe|$\underline O$]] дословная: $f_n\in\Omega(g_n)\iff g_n\in\underline O(f_n)$, поэтому отдельных доказательств для $\Omega$ не нужно — все свойства переносятся заменой ролей.

Примеры конспекта: $\Omega(n^2)$ содержит $n^2$ и $n^3$, но не содержит $n$. Как и для $\underline O$, здесь работает разбиение на [[omega-malaya|$\omega$]] и [[teta-klass|$\Theta$]]: $\Omega(g_n)=\omega(g_n)\sqcup\Theta(g_n)$ — «не медленнее» значит «строго быстрее или ровно так же».`,
		related: ['omega-malaya', 'o-bolshoe', 'teta-klass', 'svoystva-asimptotik']
	},

	'omega-malaya': {
		id: 'omega-malaya',
		term: 'ω (омега малая)',
		short: String.raw`Перевёрнутое отношение стремится к нулю — «растёт строго быстрее».`,
		formula: String.raw`f_n\in\omega(g_n)\iff\lim_{n\to\infty}\frac{g_n}{f_n}=0`,
		body: String.raw`**$\omega$** — двойник [[o-maloe|$\overline o$]]: $f_n\in\omega(g_n)$ равносильно $g_n\in\overline o(f_n)$. Примеры конспекта: $\omega(n^2)$ содержит $n^3$, но не содержит ни $n^2$, ни $n$ — в отличие от [[omega-bolshaya|$\Omega$]], совпадение порядков здесь запрещено.

⚠️ В списке свойств (стр. 25) записано $\omega(\lambda g_n)=g_n$ и $\Omega(\lambda g_n)=g_n$ при $\lambda\ne0$ — справа пропала обёртка класса. Правильные равенства: $\omega(\lambda g_n)=\omega(g_n)$ и $\Omega(\lambda g_n)=\Omega(g_n)$; см. [[svoystva-asimptotik|свойства асимптотик]].`,
		related: ['omega-bolshaya', 'o-maloe', 'svoystva-asimptotik', 'asimptoticheskie-klassy']
	},

	'klassicheskoe-o-bolshoe': {
		id: 'klassicheskoe-o-bolshoe',
		term: 'Классическое O через неравенство',
		short: String.raw`Определение учебников: $|f_n|\le C|g_n|$ на хвосте. Оно шире курсового.`,
		formula: String.raw`\exists C>0\ \exists N\ \forall n>N:\ |f_n|\le C\,|g_n|`,
		body: String.raw`В литературе по анализу и по сложности алгоритмов $O$-большое определяется **ограниченностью отношения**, а не его сходимостью. Одна импликация общая: если предел отношения существует, то отношение [[shodyashchayasya-posledovatelnost|сходится]], значит ограничено, и неравенство выполняется.

⚠️ Обратное неверно, поэтому [[o-bolshoe|определение курса строго уже]]. Эталонный разделяющий пример: $f_n=n(2+\sin n)$ при $g_n=n$ — неравенство $|f_n|\le3|g_n|$ верно при всех $n$, а отношение $2+\sin n$ предела не имеет, и по конспекту $f_n\notin\underline O(n)$. На КЛК отвечать нужно в терминах курса.`,
		related: ['o-bolshoe', 'asimptoticheskie-klassy', 'shodyashchayasya-posledovatelnost']
	},

	'svoystva-asimptotik': {
		id: 'svoystva-asimptotik',
		term: 'Свойства асимптотических классов',
		short: String.raw`Умножение на $\lambda\ne0$ класс не меняет; со суммой нужна оговорка.`,
		formula: String.raw`\underline O(\lambda g_n)=\underline O(g_n),\quad \overline o(\lambda g_n)=\overline o(g_n),\quad \Theta(\lambda g_n)=\Theta(g_n),\quad \lambda\ne0`,
		body: String.raw`Список свойств со стр. 24–25 доказывается одной строкой: $\frac{f_n}{\lambda g_n}=\frac1\lambda\cdot\frac{f_n}{g_n}$, а умножение на константу обратимо при $\lambda\ne0$ — та же оговорка, что в свойстве $\lim Cx_n=CA$. При $\lambda=0$ знаменатель тождественно нулевой, и дробь не определена.

⚠️ Две правки к конспекту: справа в строках для [[omega-malaya|$\omega$]] и [[omega-bolshaya|$\Omega$]] пропала обёртка класса; а свойства-суммы вида $\underline O(g_n+f_n)=\underline O(g_n)$ верны лишь при $\lim f_n/g_n\ne-1$ — иначе старший член сокращается ($g_n=n$, $f_n=\sqrt n-n$).`,
		related: ['o-bolshoe', 'teta-klass', 'omega-malaya', 'omega-bolshaya']
	},

	'poryadok-rosta': {
		id: 'poryadok-rosta',
		term: 'Порядок роста',
		short: String.raw`Класс эквивалентности по Θ: «та же скорость с точностью до константы».`,
		formula: String.raw`f_n\sim_\Theta g_n\iff \lim_{n\to\infty}\frac{f_n}{g_n}=c\ne0`,
		body: String.raw`Принадлежность [[teta-klass|$\Theta$]] рефлексивна ($f_n/f_n=1$), симметрична ($c\mapsto1/c$) и транзитивна ($c\cdot d$), то есть это отношение эквивалентности; его классы и называют **порядками роста** — $n$, $n\log n$, $n^2$, $2^n$.

[[o-bolshoe|$\underline O$]] задаёт лишь предпорядок «не быстрее»: $\sqrt n\in\underline O(n)$, но $n\notin\underline O(\sqrt n)$. ⚠️ Порядок этот **частичный**: пары с колеблющимся отношением (например, $n(2+\sin n)$ и $n$) не сравнимы ни одним из пяти классов.`,
		related: ['teta-klass', 'o-bolshoe', 'ekvivalentnye-posledovatelnosti', 'asimptoticheskie-klassy']
	},

	'ekvivalentnye-posledovatelnosti': {
		id: 'ekvivalentnye-posledovatelnosti',
		term: 'Эквивалентные последовательности',
		short: String.raw`Предел отношения равен единице — частный случай Θ.`,
		formula: String.raw`f_n\sim g_n\iff\lim_{n\to\infty}\frac{f_n}{g_n}=1`,
		body: String.raw`Последовательности **эквивалентны**, если предел их отношения равен $1$: $n+\sqrt n\sim n$, $n^2+n\sim n^2$. Это строго более сильное требование, чем [[teta-klass|$\Theta$]], где допустима любая ненулевая константа: $2n\in\Theta(n)$, но $2n\not\sim n$.

Отсюда рабочая формула перехода через [[o-maloe|$\overline o$]]: запись $f_n\sim g_n$ равносильна $f_n=g_n+\overline o(g_n)$, то есть «главный член плюс добавка младшего порядка». В этой форме эквивалентность и переносится во втором семестре на предел функции и на формулу Тейлора.`,
		related: ['teta-klass', 'o-maloe', 'poryadok-rosta']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`Даётся сразу пятью эквивалентными формами — от метрики к модулю.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1\ \forall n>N:\ \rho(f_n,A)<\varepsilon`,
		body: String.raw`Курс определяет предел сверху вниз: через метрику $\rho(f_n,A)<\varepsilon$, через норму, через открытый шар $f_n\in B_A(\varepsilon)$, через [[vykolotaya-okrestnost|выколотую окрестность]] и только последней — записью $|f_n-A|<\varepsilon$. Номер $N$ трактуется как **функция** от $\varepsilon$, и доказательство обязано кончаться явной формулой для него.

Сегодняшняя тема целиком стоит на этом определении: все пять [[asimptoticheskie-klassy|асимптотических классов]] — это условия на предел отношения $f_n/g_n$, а нулевой предел выделен в отдельное понятие — [[beskonechno-malaya|бесконечно малая]].`,
		related: ['shodyashchayasya-posledovatelnost', 'beskonechno-malaya', 'asimptoticheskie-klassy', 'blacksquare']
	},

	'shodyashchayasya-posledovatelnost': {
		id: 'shodyashchayasya-posledovatelnost',
		term: 'Сходящаяся последовательность',
		short: String.raw`Та, у которой предел существует: $\exists A:\ \lim f_n=A$.`,
		formula: String.raw`\exists A:\ \lim_{n\to\infty}f_n=A`,
		body: String.raw`Последовательность **сходится**, если у неё есть [[predel-posledovatelnosti|предел]]. Две теоремы курса, работающие в сегодняшних выкладках: предел единственен (отсюда $C_1C_2=1$ в [[teta-klass|$\Theta$]]) и всякая сходящаяся ограничена (отсюда переход от определения курса к [[klassicheskoe-o-bolshoe|классическому неравенству]]).

Сходимость с ненулевым пределом сильнее простой ограниченности: она даёт коридор $|c|/2$ вокруг предела, не пускающий знаменатель к нулю, — без него не доказать обратный переход $c\mapsto1/c$.`,
		related: ['predel-posledovatelnosti', 'klassicheskoe-o-bolshoe', 'teta-klass', 'beskonechno-bolshaya']
	},

	'beskonechno-malaya': {
		id: 'beskonechno-malaya',
		term: 'Бесконечно малая последовательность (б.м.)',
		short: String.raw`Последовательность с нулевым пределом.`,
		formula: String.raw`\forall\varepsilon_f>0\ \exists N_f\in\mathbb N_1\ \forall n>N_f:\ |f_n|<\varepsilon_f`,
		body: String.raw`**Бесконечно малая** — последовательность, [[predel-posledovatelnosti|предел]] которой равен нулю; нотация конспекта — строчные $f_n,\tilde f_n$, эталон $f_n=\frac1{n^4}$.

Связь с сегодняшней темой прямая: принадлежность [[o-maloe|$\overline o(g_n)$]] означает ровно «отношение $f_n/g_n$ — бесконечно малая». Обратная к б.м. — [[beskonechno-bolshaya|бесконечно большая]], а их произведение даёт [[neopredelennost|неопределённость]], ради раскрытия которой асимптотические классы и вводятся.`,
		related: ['beskonechno-bolshaya', 'o-maloe', 'predel-posledovatelnosti', 'neopredelennost']
	},

	'beskonechno-bolshaya': {
		id: 'beskonechno-bolshaya',
		term: 'Бесконечно большая последовательность (б.б.)',
		short: String.raw`У преподавателя — «не ограничена сверху или снизу», а не «стремится к ∞».`,
		formula: String.raw`\neg\bigl(\exists A\ \forall n:\ F_n\le A\bigr)\ \ \text{или}\ \ \neg\bigl(\exists B\ \forall n:\ F_n\ge B\bigr)`,
		body: String.raw`⚠️ В курсе **бесконечно большая** определена через неограниченность, а не через предел; в учебниках определение другое и строго более сильное — $\forall E>0\ \exists N\ \forall n>N:\ |F_n|>E$.

Для сегодняшней темы важно следствие: если отношение $f_n/g_n$ бесконечно большое, то конечного предела у него нет, и в [[o-bolshoe|$\underline O(g_n)$]] последовательность не попадает — зато попадает в [[omega-malaya|$\omega(g_n)$]], ведь перевёрнутая дробь [[beskonechno-malaya|бесконечно мала]].`,
		related: ['beskonechno-malaya', 'o-bolshoe', 'omega-malaya', 'neopredelennost']
	},

	neopredelennost: {
		id: 'neopredelennost',
		term: 'Неопределённость',
		short: String.raw`Класс результата не определяется классами аргументов.`,
		formula: String.raw`F_n\cdot f_n,\qquad \frac{f_n}{\tilde f_n},\qquad F_n-\tilde F_n`,
		body: String.raw`**Неопределённость** вводится в курсе не символом, а **таблицей исходов**: тремя парами последовательностей одинаковых типов, дающими константу, [[beskonechno-bolshaya|б.б.]] и [[beskonechno-malaya|б.м.]] Смысл: теоремы вида «б.б. на б.м. даёт такой-то класс» не существует.

Именно поэтому за днём неопределённостей идут [[asimptoticheskie-klassy|асимптотические классы]]: раскрыть неопределённость — значит сравнить **скорости**, то есть посчитать предел отношения $f_n/g_n$, а не типы аргументов.`,
		related: ['beskonechno-bolshaya', 'beskonechno-malaya', 'asimptoticheskie-klassy', 'chastichnaya-posledovatelnost']
	}
};
