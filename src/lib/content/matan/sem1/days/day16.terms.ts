import type { Glossary } from '$lib/types';

// Термины дня 16. Понятия, за которые отвечают другие дни, здесь не
// переобъявляются и используются только перекрёстными ссылками:
// asimptoticheskie-klassy, chastichnaya-posledovatelnost,
// vykolotaya-okrestnost, n-nol-n-odin, blacksquare,
// skhodyashchayasya-v-sebe, priznak-i-svoystvo и прочие.
// Карточки predel-posledovatelnosti, posledovatelnost,
// shodyashchayasya-posledovatelnost, ogranichennost-posledovatelnosti и
// n-ot-epsilon продублированы из дней 11–15 намеренно: день должен
// резолвиться независимо от того, открыт ли предыдущий.
export const day16Terms: Glossary = {
	'beskonechno-malaya': {
		id: 'beskonechno-malaya',
		term: 'Бесконечно малая последовательность (б.м.)',
		short: String.raw`Последовательность с нулевым пределом.`,
		formula: String.raw`\forall\varepsilon_f>0\ \exists N_f\in\mathbb N_1\ \forall n>N_f:\ |f_n|<\varepsilon_f`,
		body: String.raw`**Бесконечно малая** — последовательность, [[predel-posledovatelnosti|предел]] которой равен нулю. В метрическом пространстве условие пишется как $\rho(f_n,0)<\varepsilon_f$, в нормированном — $\|f_n\|<\varepsilon_f$, в $\mathbb R$ — через модуль.

Нотация: б.м. обозначаются строчными буквами $f_n,\tilde f_n$, эталонный пример — $f_n=\frac1{n^4}$. [[obratnaya-velichina|Обратная]] к ней последовательность — [[beskonechno-bolshaya|бесконечно большая]], а произведение б.м. на б.б. даёт [[neopredelennost|неопределённость]].`,
		related: ['beskonechno-bolshaya', 'predel-posledovatelnosti', 'obratnaya-velichina', 'neopredelennost']
	},

	'beskonechno-bolshaya': {
		id: 'beskonechno-bolshaya',
		term: 'Бесконечно большая последовательность (б.б.)',
		short: String.raw`Хвост уходит за любой порог: $|F_n|>\varepsilon_F$ при всех $n>N_F$.`,
		formula: String.raw`\forall\varepsilon_F>0\ \exists N_F\in\mathbb N_1\ \forall n>N_F:\ |F_n|>\varepsilon_F`,
		body: String.raw`**Бесконечно большая** — зеркальная к [[beskonechno-malaya|бесконечно малой]]: вместо $|f_n|<\varepsilon_f$ требуется $|F_n|>\varepsilon_F$, и требование так же наложено на весь хвост.

Условие строго сильнее [[ogranichennost-posledovatelnosti|неограниченности]]: всякая б.б. неограниченна, но не всякая неограниченная — б.б. Различающий пример: $g_n=\frac1n$ на чётных номерах и $g_n=n$ на нечётных не ограничена сверху, а хвостового неравенства не даёт ни при каком пороге — это [[nikakaya-posledovatelnost|«никакая»]] последовательность. Нотация: заглавные $F_n,\tilde F_n$, эталон $F_n=n^4$.`,
		related: ['beskonechno-malaya', 'ogranichennost-posledovatelnosti', 'nikakaya-posledovatelnost', 'asimptoticheskie-klassy']
	},

	'nikakaya-posledovatelnost': {
		id: 'nikakaya-posledovatelnost',
		term: '«Никакая» последовательность',
		short: String.raw`Ни бесконечно большая, ни бесконечно малая.`,
		body: String.raw`**«Никакой»** называют последовательность, не попавшую ни в класс [[beskonechno-bolshaya|б.б.]], ни в класс [[beskonechno-malaya|б.м.]]. Таких два сорта: ограниченные без предела, как $(-1)^n$, и неограниченные, но не бесконечно большие, — канонический пример $g_n=\frac1n$ на чётных номерах и $g_n=n$ на нечётных: предела нет, но и «весь хвост выше порога» не выполняется.

Тем же словом отмечают результат операции, класс которого не определён классами аргументов: «разность двух б.б. — никакая». В этом втором смысле «никакая» — синоним [[neopredelennost|неопределённости]].`,
		related: ['beskonechno-bolshaya', 'beskonechno-malaya', 'neopredelennost', 'chastichnaya-posledovatelnost']
	},

	neopredelennost: {
		id: 'neopredelennost',
		term: 'Неопределённость',
		short: String.raw`Класс результата не определяется классами аргументов.`,
		formula: String.raw`F_n\cdot f_n,\qquad \frac{f_n}{\tilde f_n},\qquad F_n-\tilde F_n`,
		body: String.raw`**Неопределённость** задаётся не символом, а **таблицей исходов**: тремя парами последовательностей одинаковых типов, дающими константу, [[beskonechno-bolshaya|б.б.]] и [[beskonechno-malaya|б.м.]]. Например, $n\cdot\frac1n=1$, $n^2\cdot\frac1n=n$, $n\cdot\frac1{n^2}=\frac1n$.

Смысл: теоремы вида «б.б. на б.м. даёт такой-то класс» не существует — любая опровергается одним из трёх примеров. Раскрывают неопределённость [[asimptoticheskie-klassy|асимптотические классы]], сравнивающие скорости через $\lim\frac{f_n}{g_n}$.`,
		related: ['beskonechno-bolshaya', 'beskonechno-malaya', 'nikakaya-posledovatelnost', 'asimptoticheskie-klassy']
	},

	'obratnaya-velichina': {
		id: 'obratnaya-velichina',
		term: 'Обратная последовательность 1/fₙ',
		short: String.raw`Переворот меняет класс на противоположный, а порог — на обратный.`,
		formula: String.raw`\varepsilon_f=\frac1{\varepsilon_h},\qquad N_h(\varepsilon_h)=N_f\Bigl(\frac1{\varepsilon_h}\Bigr)`,
		body: String.raw`Если $f_n$ — [[beskonechno-malaya|бесконечно малая]] и $f_n\ne0$, то $\frac1{f_n}$ — [[beskonechno-bolshaya|бесконечно большая]]; если $F_n$ — б.б., то $\frac1{F_n}$ — б.м. (деление законно, так как на хвосте $|F_n|>\varepsilon_F>0$).

Доказательство обоих утверждений — одна строка: неравенство переворачивается, пороги связываются как $\varepsilon\mapsto\frac1\varepsilon$, а нового [[n-ot-epsilon|номера]] искать не надо: годится старая формула, вычисленная в перевёрнутом пороге, $N_h(\varepsilon_h)=N_f(1/\varepsilon_h)$. Обе стрелки равноправны, но если в посылке ослабить «бесконечно большая» до «неограниченная», обратная импликация опровергается [[nikakaya-posledovatelnost|«никакой»]] последовательностью.`,
		related: ['beskonechno-malaya', 'beskonechno-bolshaya', 'n-ot-epsilon', 'nikakaya-posledovatelnost']
	},

	'otdelennost-ot-nulya': {
		id: 'otdelennost-ot-nulya',
		term: 'Отделённость от нуля',
		short: String.raw`Хвост сходящейся с $C\ne0$ лежит вне окрестности нуля.`,
		formula: String.raw`\tilde\varepsilon=\min\bigl(|C-\varepsilon_g|,\ |C+\varepsilon_g|\bigr)=\frac{|C|}2>0`,
		body: String.raw`Приём из доказательства «б.б. на сходящуюся — б.б.». Если $\lim g_n=C\ne0$, возьмём $\varepsilon_g=\frac{|C|}2$: тогда хвост $g_n$ лежит в коридоре $(C-\varepsilon_g;\,C+\varepsilon_g)$, не содержащем нуля, и $|g_n|\ge\tilde\varepsilon=\frac{|C|}2$.

Именно здесь работает оговорка $C\ne0$: при $C=0$ положительного $\tilde\varepsilon$ не существует, минорирующая оценка $|F_ng_n|\ge\tilde\varepsilon|F_n|$ рушится, и вместо теоремы получается [[neopredelennost|неопределённость]].`,
		related: ['shodyashchayasya-posledovatelnost', 'beskonechno-bolshaya', 'neopredelennost']
	},

	'ogranichennost-posledovatelnosti': {
		id: 'ogranichennost-posledovatelnosti',
		term: 'Ограниченность последовательности',
		short: String.raw`Сверху и снизу — два раздельных условия, и это существенно.`,
		formula: String.raw`\exists A\ \forall n:\ f_n\le A\qquad\text{и}\qquad \exists B\ \forall n:\ f_n\ge B`,
		body: String.raw`Ограниченность **сверху** и **снизу** определяются раздельно, и это существенно: последовательность, у которой нарушено хотя бы одно из двух условий, называют **неограниченной**. Всякая [[beskonechno-bolshaya|бесконечно большая]] неограниченна, обратное неверно.

Ограниченная сверху последовательность имеет $\sup$, ограниченная снизу — $\inf$. Отдельная теорема: всякая [[shodyashchayasya-posledovatelnost|сходящаяся]] последовательность ограничена — берут $\varepsilon=1$, хвост попадает в интервал длины $2$, а вне хвоста членов конечное число.`,
		related: ['beskonechno-bolshaya', 'shodyashchayasya-posledovatelnost', 'predel-posledovatelnosti']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`Даётся сразу пятью эквивалентными формами — от метрики к модулю.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1\ \forall n>N:\ \rho(f_n,A)<\varepsilon`,
		body: String.raw`Предел определяется сверху вниз: через метрику $\rho(f_n,A)<\varepsilon$, через норму $\|f_n-A\|<\varepsilon$, через открытый шар $f_n\in B_A(\varepsilon)$, через [[vykolotaya-okrestnost|выколотую окрестность]] $f_n\in\mathring U_A$ и только последней — школьной записью $|f_n-A|<\varepsilon$.

Доказательство существования предела завершается явной формулой [[n-ot-epsilon|$N(\varepsilon)$]], а не словами «предел существует». Нулевой предел выделен в отдельное понятие — [[beskonechno-malaya|бесконечно малая]].`,
		related: ['posledovatelnost', 'shodyashchayasya-posledovatelnost', 'n-ot-epsilon', 'beskonechno-malaya']
	},

	posledovatelnost: {
		id: 'posledovatelnost',
		term: 'Последовательность',
		short: String.raw`Функция $f:\mathbb N_1\to M$, а не «набор элементов».`,
		formula: String.raw`f:\mathbb N_1\to\mathbb R,\qquad f:\mathbb N_1\to M`,
		body: String.raw`**Последовательность** — это **функция** с областью определения [[n-nol-n-odin|$\mathbb N_1$]] (натуральные без нуля). Значения берутся в $\mathbb R$ либо в произвольном метрическом пространстве $M$; второй случай называют **обобщённой последовательностью**.

Её не следует путать с сетью (net) — отображением произвольного направленного множества: у обобщённой последовательности область определения остаётся $\mathbb N_1$, поэтому сохраняют силу все рассуждения вида «начиная с номера $N$». Хвост $x_k,x_{k+1},\dots$ называется [[chastichnaya-posledovatelnost|частичной последовательностью]].`,
		related: ['n-nol-n-odin', 'predel-posledovatelnosti', 'chastichnaya-posledovatelnost']
	},

	'shodyashchayasya-posledovatelnost': {
		id: 'shodyashchayasya-posledovatelnost',
		term: 'Сходящаяся последовательность',
		short: String.raw`Та, у которой предел существует: $\exists A:\ \lim f_n=A$.`,
		formula: String.raw`\exists A:\ \lim_{n\to\infty}f_n=A`,
		body: String.raw`Последовательность **сходится**, если у неё есть [[predel-posledovatelnosti|предел]]. Две теоремы, работающие в сегодняшних доказательствах: предел единственен, и всякая сходящаяся [[ogranichennost-posledovatelnosti|ограничена]].

Сходимость с ненулевым пределом сильнее простой ограниченности: она даёт [[otdelennost-ot-nulya|отделённость от нуля]] на хвосте, а без неё утверждение «б.б. на сходящуюся — б.б.» неверно.`,
		related: ['predel-posledovatelnosti', 'ogranichennost-posledovatelnosti', 'otdelennost-ot-nulya', 'beskonechno-malaya']
	},

	'n-ot-epsilon': {
		id: 'n-ot-epsilon',
		term: 'N(ε) — номер как функция порога',
		short: String.raw`Итог доказательства — формула для номера, а не фраза «предел есть».`,
		formula: String.raw`N_{x+y}(\varepsilon)=\max\Bigl(N_x\Bigl(\frac\varepsilon2\Bigr),\ N_y\Bigl(\frac\varepsilon2\Bigr)\Bigr)`,
		body: String.raw`Сквозной приём: номер $N$ трактуется как **функция** от $\varepsilon$, а сам $\varepsilon$ — как ресурс, который распределяют между объектами. Эпсилоны и номера индексируются по объекту: $\varepsilon_f,N_f$ — для бесконечно малой, $\varepsilon_F,N_F$ — для бесконечно большой, $\varepsilon_h,N_h$ — для результата.

Распределяют по-разному: пополам в сумме, делением на $|C|$ при умножении на константу, [[obratnaya-velichina|переворотом $\varepsilon\mapsto1/\varepsilon$]] у обратной. Выкладку заканчивают явной формулой номера и знаком конца доказательства $\blacksquare$: именно формула показывает, как далеко приходится уйти по номерам ради заданной точности.`,
		related: ['predel-posledovatelnosti', 'obratnaya-velichina', 'beskonechno-malaya']
	}
};
