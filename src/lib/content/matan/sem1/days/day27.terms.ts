import type { Glossary } from '$lib/types';

// Термины дня 27 (свойства предела функции, колебание, верхний и нижний предел).
// День должен резолвиться независимо, поэтому опорные понятия дня 26 (предел
// функции, определение по Гейне) и топологии (предельная точка, точные грани)
// продублированы здесь, а не взяты из соседних дней. НЕ дублируются только
// термины канонического глоссария (glossary.ts), на которые ссылки идут
// напрямую: vykolotaya-okrestnost, asimptoticheskie-klassy, end-r, lso,
// metriki-rho, blacksquare и др.
export const day27Terms: Glossary = {
	'arifmetika-predelov-funkcii': {
		id: 'arifmetika-predelov-funkcii',
		term: 'Арифметика пределов функции',
		short: String.raw`Предел суммы, произведения и частного считается по слагаемым и сомножителям.`,
		formula: String.raw`\lim(f\pm g)=A\pm B,\quad \lim fg=AB,\quad \lim\frac fg=\frac AB\ (B\ne0)`,
		body: String.raw`**Арифметические свойства [[predel-funkcii|предела функции]]**: если $\lim f=A$ и $\lim g=B$, то $\lim(f\pm g)=A\pm B$, $\lim fg=AB$, а при $B\ne0$ ещё и $\lim\frac fg=\frac AB$. Это дословно арифметика пределов последовательностей, переписанная для функций через [[opredelenie-geyne|определение по Гейне]].`,
		related: ['opredelenie-geyne', 'predel-funkcii', 'beskonechno-malaya-funkciya', 'beskonechno-bolshaya-funkciya']
	},

	'beskonechno-malaya-funkciya': {
		id: 'beskonechno-malaya-funkciya',
		term: 'Бесконечно малая функция',
		short: String.raw`Функция с нулевым пределом в точке; на языке классов — это $o(1)$.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=0\iff f\in o(1)\ \text{при}\ x\to x_0`,
		body: String.raw`**Бесконечно малая в точке $x_0$** — функция с нулевым пределом: для любого $\varepsilon>0$ найдётся $\delta>0$ такое, что $\rho_2(f(x),0)<\varepsilon$ на [[vykolotaya-okrestnost|выколотом шаре]] $\mathring B_{x_0}(\delta)$. На языке [[asimptoticheskie-klassy|асимптотических классов]] это ровно $o(1)$.`,
		related: ['beskonechno-bolshaya-funkciya', 'asimptoticheskie-klassy', 'arifmetika-predelov-funkcii', 'vykolotaya-okrestnost']
	},

	'beskonechno-bolshaya-funkciya': {
		id: 'beskonechno-bolshaya-funkciya',
		term: 'Бесконечно большая функция',
		short: String.raw`Значения по любой допустимой последовательности неограниченны; знака нет.`,
		formula: String.raw`\lim_{x\to x_0}F(x)=\infty\iff\forall\{x_n\}\to x_0:\ \{F(x_n)\}\ \text{неограниченна}`,
		body: String.raw`**Бесконечно большая в точке $x_0$** определена [[opredelenie-geyne|по Гейне]] через неограниченность последовательности значений, а не через $|F(x)|>E$. Знак в определение не входит: $1/x^2$ и $-1/x^2$ обе бесконечно велики в нуле. Классов **три**: есть функции ни бесконечно малые, ни бесконечно большие ($\sin\frac1x$ в нуле, любая константа). На языке [[asimptoticheskie-klassy|классов]] бесконечно большая — это $\omega(1)$.`,
		related: ['beskonechno-malaya-funkciya', 'opredelenie-geyne', 'asimptoticheskie-klassy', 'arifmetika-predelov-funkcii']
	},

	'supremum-infimum': {
		id: 'supremum-infimum',
		term: 'Супремум и инфимум',
		short: String.raw`Наименьшая верхняя и наибольшая нижняя граница множества.`,
		formula: String.raw`\sup A=\min\{M:\ \forall a\in A\ a\leqslant M\},\qquad \inf A=\max\{m:\ \forall a\in A\ a\geqslant m\}`,
		body: String.raw`**Точная верхняя грань** $\sup A$ — наименьшая из верхних границ, **точная нижняя** $\inf A$ — наибольшая из нижних; в $\overline{\mathbb R}$ они существуют у любого множества. Через грани по выколотому шару строятся огибающие $S(\delta)=\sup_{\mathring B_{x_0}(\delta)}f$ и $i(\delta)=\inf_{\mathring B_{x_0}(\delta)}f$ — [[verkhniy-predel-funkcii|верхний]] и [[nizhniy-predel-funkcii|нижний предел функции]].`,
		related: ['verkhniy-predel-funkcii', 'nizhniy-predel-funkcii', 'kolebanie-funkcii']
	},

	'verkhniy-predel-funkcii': {
		id: 'verkhniy-predel-funkcii',
		term: 'Верхний предел функции',
		short: String.raw`Предел супремумов по стягивающемуся выколотому промежутку.`,
		formula: String.raw`\overline{\lim_{x\to x_0}}\,f(x)=\lim_{\delta\to0}\ \sup_{x\in\mathring B_{x_0}(\delta)}f(x)=\inf_{\delta>0}S(\delta)`,
		body: String.raw`**Верхний предел функции** определяется сразу для функции, а не только для последовательности: берём [[supremum-infimum|супремум]] по выколотому шару радиуса $\delta$ и устремляем $\delta$ к нулю. Предел существует всегда: $S(\delta)$ не возрастает при убывании $\delta$, поэтому равен $\inf_{\delta>0}S(\delta)$ в $\overline{\mathbb R}$. Шар обязан быть выколотым: иначе в грань попадает $f(x_0)$ и совпадение граней означает уже не существование [[kriteriy-sushchestvovaniya-predela|предела]], а непрерывность в точке.`,
		related: ['nizhniy-predel-funkcii', 'supremum-infimum', 'kolebanie-funkcii', 'kriteriy-sushchestvovaniya-predela']
	},

	'nizhniy-predel-funkcii': {
		id: 'nizhniy-predel-funkcii',
		term: 'Нижний предел функции',
		short: String.raw`Предел инфимумов по стягивающемуся выколотому промежутку.`,
		formula: String.raw`\underline{\lim_{x\to x_0}}\,f(x)=\lim_{\delta\to0}\ \inf_{x\in\mathring B_{x_0}(\delta)}f(x)=\sup_{\delta>0}i(\delta)`,
		body: String.raw`**Нижний предел функции** — зеркальная конструкция к [[verkhniy-predel-funkcii|верхнему]]: [[supremum-infimum|инфимум]] по выколотому шару, устремлённому к точке. Огибающая $i(\delta)$ не убывает при убывании $\delta$, поэтому предел существует и равен $\sup_{\delta>0}i(\delta)$. Всегда выполнено $\underline{\lim}f\leqslant\overline{\lim}f$, а их разность — это [[kolebanie-funkcii|колебание]] $\eta$.`,
		related: ['verkhniy-predel-funkcii', 'supremum-infimum', 'kolebanie-funkcii', 'kriteriy-sushchestvovaniya-predela']
	},

	'kolebanie-funkcii': {
		id: 'kolebanie-funkcii',
		term: 'Колебание функции в точке',
		short: String.raw`$\eta$ — разность верхнего и нижнего предела; числовая мера разрыва.`,
		formula: String.raw`\eta(x_0)=\overline{\lim_{x\to x_0}}\,f-\underline{\lim_{x\to x_0}}\,f=\lim_{\delta\to0}\bigl(S(\delta)-i(\delta)\bigr)`,
		body: String.raw`Разность верхнего и нижнего пределов функции в точке — предельная ширина полосы, в которую укладывается график около неё. [[predel-funkcii|Предел]] существует тогда и только тогда, когда колебание равно нулю.`,
		related: ['predel-funkcii', 'supremum']
	},

	'kriteriy-sushchestvovaniya-predela': {
		id: 'kriteriy-sushchestvovaniya-predela',
		term: 'Критерий существования предела',
		short: String.raw`Предел существует тогда и только тогда, когда верхний и нижний совпали, то есть колебание равно нулю.`,
		formula: String.raw`\lim_{x\to x_0}f=A\iff\overline{\lim}\,f=\underline{\lim}\,f=A\iff\overline{\lim}\,f=A\ \text{и}\ \eta(x_0)=0`,
		body: String.raw`**Критерий** связывает предел с огибающими: $\lim_{x\to x_0}f=A$ тогда и только тогда, когда [[verkhniy-predel-funkcii|верхний]] и нижний пределы в точке равны $A$, то есть [[kolebanie-funkcii|колебание]] $\eta(x_0)$ равно нулю. Точка $x_0$ обязана быть [[predelnaya-tochka|предельной]]: выколотый шар вокруг неё должен быть непуст.`,
		related: ['verkhniy-predel-funkcii', 'kolebanie-funkcii', 'predelnaya-tochka', 'teorema-o-szhatoy-funkcii']
	},

	'teorema-o-szhatoy-funkcii': {
		id: 'teorema-o-szhatoy-funkcii',
		term: 'Теорема о сжатой функции',
		short: String.raw`Зажатая между двумя функциями с общим пределом наследует этот предел.`,
		formula: String.raw`f\leqslant h\leqslant g\ \text{на}\ \mathring B_{x_0}(r),\ \lim f=\lim g=A\ \Rightarrow\ \lim h=A`,
		body: String.raw`**Теорема о сжатой функции** — функциональный аналог «двух городовых» ([день 14](/aii/matan/1/day/14)) для [[end-r|$\operatorname{End}(\mathbb R)$]]: если $f\leqslant h\leqslant g$ на выколотом шаре $\mathring B_{x_0}(r)$ и крайние имеют общий [[predel-funkcii|предел]] $A$, то $\lim h=A$. Шар в условии выколот: значение $h(x_0)$ на предел не влияет, поэтому теорема применима и к функциям, не определённым в $x_0$.`,
		related: ['kriteriy-sushchestvovaniya-predela', 'obobshchennaya-teorema-o-szhatoy', 'end-r', 'predel-funkcii']
	},

	'obobshchennaya-teorema-o-szhatoy': {
		id: 'obobshchennaya-teorema-o-szhatoy',
		term: 'Обобщённая теорема о сжатой функции',
		short: String.raw`Версия для метрических пространств: сжатие семейством $f_n$ при $\delta_n\to0$.`,
		formula: String.raw`f_n\rightrightarrows f,\ \lim_{x\to x_0}f=A,\ \rho_2\bigl(g(x_1),f_n(x_2)\bigr)<\varepsilon_n\ \forall x_1,x_2\in\mathring B_{x_0}(\delta_n)\ \Rightarrow\ \lim_{x\to x_0}g=A`,
		body: String.raw`**Обобщение** [[teorema-o-szhatoy-funkcii|теоремы о сжатой функции]] на отображения [[metriki-rho|метрических]] пространств $f,f_n,g:(M_1,\rho_1)\to(M_2,\rho_2)$: если $\delta_n\to0$, $\varepsilon_n\to0$, значения $g$ и $f_n$ на шаре радиуса $\delta_n$ различаются меньше чем на $\varepsilon_n$, $f_n\to f$ и $\lim f=A$, то $\lim g=A$. Сходимость $f_n\to f$ обязана быть **равномерной** в некоторой окрестности $x_0$: поточечной недостаточно.`,
		related: ['teorema-o-szhatoy-funkcii', 'metriki-rho', 'kriteriy-sushchestvovaniya-predela']
	},

	'predel-kompozicii': {
		id: 'predel-kompozicii',
		term: 'Предел композиции функций',
		short: String.raw`Дельта композиции — это композиция дельт, но нужно условие $g(x)\ne y_0$.`,
		formula: String.raw`\delta_{f\circ g}(\varepsilon)=\min\bigl\{r,\ \delta_g\bigl(\sigma_f(\varepsilon)\bigr)\bigr\}`,
		body: String.raw`**Предел композиции**: если $\lim_{x\to x_0}g=y_0$, $\lim_{y\to y_0}f=A$ и $g(x)\ne y_0$ в некоторой [[vykolotaya-okrestnost|выколотой окрестности]] $x_0$, то $\lim_{x\to x_0}f(g(x))=A$. Без третьего условия утверждение ложно: при $g\equiv0$ и $f(y)=1$ при $y\ne0$, $f(0)=0$ композиция стремится к $0$, а не к $1$.`,
		related: ['predel-funkcii', 'vykolotaya-okrestnost', 'arifmetika-predelov-funkcii', 'teorema-o-szhatoy-funkcii']
	}
};
