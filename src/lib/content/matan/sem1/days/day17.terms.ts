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
		body: String.raw`**$O$-большое** определено через существование **конечного** предела отношения, причём нулевой предел разрешён явно; отсюда разбиение $\underline O(g_n)=\overline o(g_n)\sqcup\Theta(g_n)$. Пишут $f_n\in\underline O(g_n)$: класс — это множество последовательностей, а подчёркивание отличает его в рукописи от [[o-maloe|$\overline o$]]. Условие [[klassicheskoe-o-bolshoe|ограниченности отношения]] $|f_n|\le C|g_n|$ **слабее**: колеблющееся отношение оно допускает, а сходимость — нет.`,
		related: ['o-maloe', 'teta-klass', 'klassicheskoe-o-bolshoe', 'asimptoticheskie-klassy']
	},

	'o-maloe': {
		id: 'o-maloe',
		term: 'o-малое (ō)',
		short: String.raw`Отношение $f_n/g_n$ — бесконечно малая: предел равен нулю.`,
		formula: String.raw`f_n\in\overline o(g_n)\iff\lim_{n\to\infty}\frac{f_n}{g_n}=0`,
		body: String.raw`**$o$-малое** — это требование «растёт строго медленнее»: отношение $f_n/g_n$ обязано быть [[beskonechno-malaya|бесконечно малой]]. Вложение $\overline o(g_n)\subset\underline O(g_n)$ строгое: сама $g_n$ лежит в [[o-bolshoe|$\underline O(g_n)$]], но не в $\overline o(g_n)$, поскольку $\lim g_n/g_n=1\ne0$. Двойственный класс — [[omega-malaya|$\omega$]]: запись $f_n\in\omega(g_n)$ означает ровно $g_n\in\overline o(f_n)$.`,
		related: ['o-bolshoe', 'omega-malaya', 'beskonechno-malaya', 'teta-klass']
	},

	'teta-klass': {
		id: 'teta-klass',
		term: 'Θ (тета)',
		short: String.raw`Оба предела — прямой и перевёрнутый — конечны; значит, оба ненулевые.`,
		formula: String.raw`f_n\in\Theta(g_n)\iff\lim_{n\to\infty}\frac{f_n}{g_n}=c,\ \ c\ne0`,
		body: String.raw`**$\Theta$** задана двумя условиями сразу: конечны и $\lim f_n/g_n=C_1$, и $\lim g_n/f_n=C_2$. Из тождества $\frac{f_n}{g_n}\cdot\frac{g_n}{f_n}=1$ следует $C_1C_2=1$, а значит ни один из пределов не нулевой — в определении это не выписано, но выводится. Равносильные описания через [[o-bolshoe|$\underline O$]]: $\Theta(g_n)=\underline O(g_n)\cap\Omega(g_n)=\underline O(g_n)\setminus\overline o(g_n)$. Классы этого отношения эквивалентности называют [[poryadok-rosta|порядками роста]].`,
		related: ['o-bolshoe', 'omega-bolshaya', 'poryadok-rosta', 'ekvivalentnye-posledovatelnosti']
	},

	'omega-bolshaya': {
		id: 'omega-bolshaya',
		term: 'Ω (омега большая)',
		short: String.raw`То же, что O̲, но для перевёрнутой дроби: «растёт не медленнее».`,
		formula: String.raw`f_n\in\Omega(g_n)\iff\exists\lim_{n\to\infty}\frac{g_n}{f_n}=C\in\mathbb R`,
		body: String.raw`**$\Omega$** требует конечности предела **перевёрнутого** отношения $g_n/f_n$. Двойственность с [[o-bolshoe|$\underline O$]] дословная: $f_n\in\Omega(g_n)\iff g_n\in\underline O(f_n)$. Как и для $\underline O$, здесь работает разбиение $\Omega(g_n)=\omega(g_n)\sqcup\Theta(g_n)$: «не медленнее» значит «строго быстрее» ([[omega-malaya|$\omega$]]) или «ровно так же» ([[teta-klass|$\Theta$]]). Так, $\Omega(n^2)$ содержит $n^2$ и $n^3$, но не содержит $n$.`,
		related: ['omega-malaya', 'o-bolshoe', 'teta-klass', 'svoystva-asimptotik']
	},

	'omega-malaya': {
		id: 'omega-malaya',
		term: 'ω (омега малая)',
		short: String.raw`Перевёрнутое отношение стремится к нулю — «растёт строго быстрее».`,
		formula: String.raw`f_n\in\omega(g_n)\iff\lim_{n\to\infty}\frac{g_n}{f_n}=0`,
		body: String.raw`**$\omega$** — двойник [[o-maloe|$\overline o$]]: $f_n\in\omega(g_n)$ равносильно $g_n\in\overline o(f_n)$. Примеры: $\omega(n^2)$ содержит $n^3$, но не содержит ни $n^2$, ни $n$ — в отличие от [[omega-bolshaya|$\Omega$]], совпадение порядков здесь запрещено.`,
		related: ['omega-bolshaya', 'o-maloe', 'svoystva-asimptotik', 'asimptoticheskie-klassy']
	},

	'klassicheskoe-o-bolshoe': {
		id: 'klassicheskoe-o-bolshoe',
		term: 'O через ограниченность отношения',
		short: String.raw`Условие $|f_n|\le C|g_n|$ на хвосте — слабее сходимости отношения.`,
		formula: String.raw`\exists C>0\ \exists N\ \forall n>N:\ |f_n|\le C\,|g_n|`,
		body: String.raw`Отношение можно ограничивать, а не заставлять сходиться: запись $f_n\in O(g_n)$ (без подчёркивания) означает $|f_n|\le C|g_n|$ на хвосте. Условие слабее, чем у [[o-bolshoe|$\underline O$]], и включение $\underline O(g_n)\subset O(g_n)$ строгое. Разделяющий пример: при $f_n=n(2+\sin n)$, $g_n=n$ неравенство $|f_n|\le3|g_n|$ верно при всех $n$, а отношение $2+\sin n$ предела не имеет. Ограниченность допускает колебания, [[shodyashchayasya-posledovatelnost|сходимость]] требует стабилизации.`,
		related: ['o-bolshoe', 'asimptoticheskie-klassy', 'shodyashchayasya-posledovatelnost']
	},

	'svoystva-asimptotik': {
		id: 'svoystva-asimptotik',
		term: 'Свойства асимптотических классов',
		short: String.raw`Умножение на $\lambda\ne0$ класс не меняет; со суммой нужна оговорка.`,
		formula: String.raw`\underline O(\lambda g_n)=\underline O(g_n),\quad \overline o(\lambda g_n)=\overline o(g_n),\quad \Theta(\lambda g_n)=\Theta(g_n),\quad \lambda\ne0`,
		body: String.raw`Умножение аргумента на ненулевую константу не меняет ни один из классов: $\underline O(\lambda g_n)=\underline O(g_n)$, и то же для $\overline o$, [[teta-klass|$\Theta$]], [[omega-malaya|$\omega$]], [[omega-bolshaya|$\Omega$]]. При $\lambda=0$ знаменатель тождественно нулевой и дробь не определена. Со суммой равенство $\underline O(g_n+f_n)=\underline O(g_n)$ при условии $f_n\in\underline O(g_n)$ верно лишь при $\lim f_n/g_n\ne-1$ — иначе старший член сокращается: при $g_n=n$, $f_n=\sqrt n-n$ сумма равна $\sqrt n$.`,
		related: ['o-bolshoe', 'teta-klass', 'omega-malaya', 'omega-bolshaya']
	},

	'poryadok-rosta': {
		id: 'poryadok-rosta',
		term: 'Порядок роста',
		short: String.raw`Класс эквивалентности по Θ: «та же скорость с точностью до константы».`,
		formula: String.raw`f_n\sim_\Theta g_n\iff \lim_{n\to\infty}\frac{f_n}{g_n}=c\ne0`,
		body: String.raw`Принадлежность [[teta-klass|$\Theta$]] рефлексивна ($f_n/f_n=1$), симметрична ($c\mapsto1/c$) и транзитивна ($c\cdot d$), то есть это отношение эквивалентности; его классы и называют **порядками роста** — $n$, $n\log n$, $n^2$, $2^n$. Само [[o-bolshoe|$\underline O$]] задаёт лишь предпорядок «не быстрее»: антисимметричности нет ($n$ и $2n$ лежат друг в друге), а пары с колеблющимся отношением ($n(2+\sin n)$ и $n$) не сравнимы ни одним из пяти классов.`,
		related: ['teta-klass', 'o-bolshoe', 'ekvivalentnye-posledovatelnosti', 'asimptoticheskie-klassy']
	},

	'ekvivalentnye-posledovatelnosti': {
		id: 'ekvivalentnye-posledovatelnosti',
		term: 'Эквивалентные последовательности',
		short: String.raw`Предел отношения равен единице — частный случай Θ.`,
		formula: String.raw`f_n\sim g_n\iff\lim_{n\to\infty}\frac{f_n}{g_n}=1`,
		body: String.raw`Последовательности **эквивалентны**, если предел их отношения равен $1$: $n+\sqrt n\sim n$, $n^2+n\sim n^2$. Требование строго сильнее, чем [[teta-klass|$\Theta$]], где допустима любая ненулевая константа: $2n\in\Theta(n)$, но $2n\not\sim n$. Равносильная запись через [[o-maloe|$\overline o$]]: $f_n\sim g_n$ означает $f_n=g_n+\overline o(g_n)$, то есть «главный член плюс добавка младшего порядка».`,
		related: ['teta-klass', 'o-maloe', 'poryadok-rosta']
	},

};
