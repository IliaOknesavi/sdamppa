import type { Glossary } from '$lib/types';

// Термины дня 17. Понятия из общего глоссария здесь НЕ переобъявляются
// и используются только перекрёстными ссылками: asimptoticheskie-klassy,
// n-nol-n-odin, blacksquare, chastichnaya-posledovatelnost,
// priznak-i-svoystvo и прочие.
// Карточки predel-posledovatelnosti, shodyashchayasya-posledovatelnost,
// beskonechno-malaya, beskonechno-bolshaya и neopredelennost продублированы
// из [дней 11–16](/aii/matan/1/day/11) намеренно: день должен резолвиться независимо от того,
// открыт ли предыдущий.
export const day17Terms: Glossary = {
	'o-bolshoe': {
		id: 'o-bolshoe',
		term: 'O-большое (O̲)',
		short: String.raw`Предел отношения существует и конечен — «растёт не быстрее».`,
		formula: String.raw`f_n\in\underline O(g_n)\iff\exists\lim_{n\to\infty}\frac{f_n}{g_n}=C\in\mathbb R`,
		body: String.raw`**$O$-большое** определено через существование **конечного** предела отношения, причём нулевой предел разрешён явно. Отсюда разбиение $\underline O(g_n)=\overline o(g_n)\sqcup\Theta(g_n)$.

Пишут $f_n\in\underline O(g_n)$: класс — это множество последовательностей. Подчёркивание нужно, чтобы в рукописи «$O$ большое» не слилось с [[o-maloe|$\overline o$]]. Условие [[klassicheskoe-o-bolshoe|ограниченности отношения]] $|f_n|\le C|g_n|$ **слабее**: колеблющееся отношение оно допускает, а сходимость — нет.`,
		related: ['o-maloe', 'teta-klass', 'klassicheskoe-o-bolshoe', 'asimptoticheskie-klassy']
	},

	'o-maloe': {
		id: 'o-maloe',
		term: 'o-малое (ō)',
		short: String.raw`Отношение $f_n/g_n$ — бесконечно малая: предел равен нулю.`,
		formula: String.raw`f_n\in\overline o(g_n)\iff\lim_{n\to\infty}\frac{f_n}{g_n}=0`,
		body: String.raw`**$o$-малое** — это требование «растёт строго медленнее»: отношение $f_n/g_n$ обязано быть [[beskonechno-malaya|бесконечно малой]]. Вложение $\overline o(g_n)\subset\underline O(g_n)$ строгое: сама $g_n$ лежит в [[o-bolshoe|$\underline O(g_n)$]], но не в $\overline o(g_n)$, поскольку $\lim g_n/g_n=1\ne0$.

Двойственный класс — [[omega-malaya|$\omega$]]: $f_n\in\omega(g_n)$ означает ровно $g_n\in\overline o(f_n)$. В определении дифференцируемости $\overline o$ становится рабочей записью: приращение равно линейной части плюс $\overline o(\|\Delta x\|)$.`,
		related: ['o-bolshoe', 'omega-malaya', 'beskonechno-malaya', 'teta-klass']
	},

	'teta-klass': {
		id: 'teta-klass',
		term: 'Θ (тета)',
		short: String.raw`Оба предела — прямой и перевёрнутый — конечны; значит, оба ненулевые.`,
		formula: String.raw`f_n\in\Theta(g_n)\iff\lim_{n\to\infty}\frac{f_n}{g_n}=c,\ \ c\ne0`,
		body: String.raw`**$\Theta$** задана двумя условиями сразу: конечны и $\lim f_n/g_n=C_1$, и $\lim g_n/f_n=C_2$. Из тождества $\frac{f_n}{g_n}\cdot\frac{g_n}{f_n}=1$ и арифметики пределов следует $C_1C_2=1$, а значит ни один из пределов не нулевой — в определении это не выписано, но выводится.

Отсюда два описания через [[o-bolshoe|$\underline O$]]: $\Theta(g_n)=\underline O(g_n)\cap\Omega(g_n)$ и $\Theta(g_n)=\underline O(g_n)\setminus\overline o(g_n)$. $\Theta$ — отношение эквивалентности, её классы называют [[poryadok-rosta|порядками роста]]; на языке $\Theta$ сформулирован признак сравнения рядов ([день 25](/aii/matan/1/day/25)).`,
		related: ['o-bolshoe', 'omega-bolshaya', 'poryadok-rosta', 'ekvivalentnye-posledovatelnosti']
	},

	'omega-bolshaya': {
		id: 'omega-bolshaya',
		term: 'Ω (омега большая)',
		short: String.raw`То же, что O̲, но для перевёрнутой дроби: «растёт не медленнее».`,
		formula: String.raw`f_n\in\Omega(g_n)\iff\exists\lim_{n\to\infty}\frac{g_n}{f_n}=C\in\mathbb R`,
		body: String.raw`**$\Omega$** требует конечности предела **перевёрнутого** отношения $g_n/f_n$. Двойственность с [[o-bolshoe|$\underline O$]] дословная: $f_n\in\Omega(g_n)\iff g_n\in\underline O(f_n)$, поэтому отдельных доказательств для $\Omega$ не нужно — все свойства переносятся заменой ролей.

Примеры: $\Omega(n^2)$ содержит $n^2$ и $n^3$, но не содержит $n$. Как и для $\underline O$, здесь работает разбиение на [[omega-malaya|$\omega$]] и [[teta-klass|$\Theta$]]: $\Omega(g_n)=\omega(g_n)\sqcup\Theta(g_n)$ — «не медленнее» значит «строго быстрее или ровно так же».`,
		related: ['omega-malaya', 'o-bolshoe', 'teta-klass', 'svoystva-asimptotik']
	},

	'omega-malaya': {
		id: 'omega-malaya',
		term: 'ω (омега малая)',
		short: String.raw`Перевёрнутое отношение стремится к нулю — «растёт строго быстрее».`,
		formula: String.raw`f_n\in\omega(g_n)\iff\lim_{n\to\infty}\frac{g_n}{f_n}=0`,
		body: String.raw`**$\omega$** — двойник [[o-maloe|$\overline o$]]: $f_n\in\omega(g_n)$ равносильно $g_n\in\overline o(f_n)$. Примеры: $\omega(n^2)$ содержит $n^3$, но не содержит ни $n^2$, ни $n$ — в отличие от [[omega-bolshaya|$\Omega$]], совпадение порядков здесь запрещено.

Умножение аргумента на ненулевую константу класс не меняет: $\omega(\lambda g_n)=\omega(g_n)$ и $\Omega(\lambda g_n)=\Omega(g_n)$ при $\lambda\ne0$, потому что перевёрнутая дробь домножается на $\lambda$, а обратный множитель существует; см. [[svoystva-asimptotik|свойства асимптотик]].`,
		related: ['omega-bolshaya', 'o-maloe', 'svoystva-asimptotik', 'asimptoticheskie-klassy']
	},

	'klassicheskoe-o-bolshoe': {
		id: 'klassicheskoe-o-bolshoe',
		term: 'O через ограниченность отношения',
		short: String.raw`Условие $|f_n|\le C|g_n|$ на хвосте — слабее сходимости отношения.`,
		formula: String.raw`\exists C>0\ \exists N\ \forall n>N:\ |f_n|\le C\,|g_n|`,
		body: String.raw`Отношение можно ограничивать, а не заставлять сходиться: запись $f_n\in O(g_n)$ (без подчёркивания) означает $|f_n|\le C|g_n|$ на хвосте. Одна импликация общая: если предел отношения существует, то отношение [[shodyashchayasya-posledovatelnost|сходится]], значит ограничено, и неравенство выполняется с $C=|C_0|+1$.

Обратное неверно, поэтому $\underline O(g_n)\subset O(g_n)$ — и включение [[o-bolshoe|строгое]]. Разделяющий пример: $f_n=n(2+\sin n)$ при $g_n=n$. Неравенство $|f_n|\le3|g_n|$ верно при всех $n$, а отношение $2+\sin n$ предела не имеет, так что $f_n\notin\underline O(n)$. Ограниченность допускает колебания, сходимость требует стабилизации.`,
		related: ['o-bolshoe', 'asimptoticheskie-klassy', 'shodyashchayasya-posledovatelnost']
	},

	'svoystva-asimptotik': {
		id: 'svoystva-asimptotik',
		term: 'Свойства асимптотических классов',
		short: String.raw`Умножение на $\lambda\ne0$ класс не меняет; со суммой нужна оговорка.`,
		formula: String.raw`\underline O(\lambda g_n)=\underline O(g_n),\quad \overline o(\lambda g_n)=\overline o(g_n),\quad \Theta(\lambda g_n)=\Theta(g_n),\quad \lambda\ne0`,
		body: String.raw`Свойства при умножении на константу доказываются одной строкой: $\frac{f_n}{\lambda g_n}=\frac1\lambda\cdot\frac{f_n}{g_n}$, а умножение на константу обратимо при $\lambda\ne0$ — та же оговорка, что в свойстве $\lim Cx_n=CA$. При $\lambda=0$ знаменатель тождественно нулевой, и дробь не определена. Для [[omega-malaya|$\omega$]] и [[omega-bolshaya|$\Omega$]] равенства те же: $\omega(\lambda g_n)=\omega(g_n)$, $\Omega(\lambda g_n)=\Omega(g_n)$.

Со суммой сложнее: равенство $\underline O(g_n+f_n)=\underline O(g_n)$ при условии $f_n\in\underline O(g_n)$ верно лишь при $\lim f_n/g_n\ne-1$ — иначе старший член сокращается. Контрпример: $g_n=n$, $f_n=\sqrt n-n$, сумма равна $\sqrt n$, и $n\in\underline O(n)\setminus\underline O(\sqrt n)$.`,
		related: ['o-bolshoe', 'teta-klass', 'omega-malaya', 'omega-bolshaya']
	},

	'poryadok-rosta': {
		id: 'poryadok-rosta',
		term: 'Порядок роста',
		short: String.raw`Класс эквивалентности по Θ: «та же скорость с точностью до константы».`,
		formula: String.raw`f_n\sim_\Theta g_n\iff \lim_{n\to\infty}\frac{f_n}{g_n}=c\ne0`,
		body: String.raw`Принадлежность [[teta-klass|$\Theta$]] рефлексивна ($f_n/f_n=1$), симметрична ($c\mapsto1/c$) и транзитивна ($c\cdot d$), то есть это отношение эквивалентности; его классы и называют **порядками роста** — $n$, $n\log n$, $n^2$, $2^n$.

[[o-bolshoe|$\underline O$]] задаёт лишь предпорядок «не быстрее»: $\sqrt n\in\underline O(n)$, но $n\notin\underline O(\sqrt n)$. До порядка он не дотягивает дважды: антисимметричности нет ($n$ и $2n$ лежат друг в друге), и пары с колеблющимся отношением (например, $n(2+\sin n)$ и $n$) не сравнимы ни одним из пяти классов.`,
		related: ['teta-klass', 'o-bolshoe', 'ekvivalentnye-posledovatelnosti', 'asimptoticheskie-klassy']
	},

	'ekvivalentnye-posledovatelnosti': {
		id: 'ekvivalentnye-posledovatelnosti',
		term: 'Эквивалентные последовательности',
		short: String.raw`Предел отношения равен единице — частный случай Θ.`,
		formula: String.raw`f_n\sim g_n\iff\lim_{n\to\infty}\frac{f_n}{g_n}=1`,
		body: String.raw`Последовательности **эквивалентны**, если предел их отношения равен $1$: $n+\sqrt n\sim n$, $n^2+n\sim n^2$. Это строго более сильное требование, чем [[teta-klass|$\Theta$]], где допустима любая ненулевая константа: $2n\in\Theta(n)$, но $2n\not\sim n$.

Отсюда рабочая формула перехода через [[o-maloe|$\overline o$]]: запись $f_n\sim g_n$ равносильна $f_n=g_n+\overline o(g_n)$, то есть «главный член плюс добавка младшего порядка». В этой форме эквивалентность переносится на предел функции и на формулу Тейлора.`,
		related: ['teta-klass', 'o-maloe', 'poryadok-rosta']
	},

};
