import type { Glossary } from '$lib/types';

// Термины дня 27 (свойства предела функции, колебание, верхний и нижний предел).
// День должен резолвиться независимо, поэтому опорные понятия дня 26 (предел
// функции, определение по Гейне) и топологии (предельная точка, точные грани)
// продублированы здесь, а не взяты из соседних дней. НЕ дублируются только
// термины канонического глоссария курса (glossary.ts), на которые ссылки идут
// напрямую: vykolotaya-okrestnost, asimptoticheskie-klassy, end-r, lso,
// metriki-rho, blacksquare и др.
export const day27Terms: Glossary = {
	'predel-funkcii': {
		id: 'predel-funkcii',
		term: 'Предел функции',
		short: String.raw`Значение $A$, к которому жмётся $f(x)$, когда $x$ подходит к $x_0$, не попадая в неё.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=A`,
		body: String.raw`**Предел функции** в точке $x_0$ — значение $A$, к которому стремятся значения $f$ при приближении аргумента к $x_0$. Курс даёт два определения: [[opredelenie-geyne|по Гейне]] (первым) и по Коши (вторым, сразу в четырёх средах). Оба игнорируют саму точку: аргумент берётся из [[vykolotaya-okrestnost|выколотой окрестности]], а $x_0$ обязана быть [[predelnaya-tochka|предельной точкой]] области определения, иначе выколотый шар окажется пуст.`,
		related: ['opredelenie-geyne', 'predelnaya-tochka', 'vykolotaya-okrestnost', 'arifmetika-predelov-funkcii']
	},

	'opredelenie-geyne': {
		id: 'opredelenie-geyne',
		term: 'Определение по Гейне',
		short: String.raw`Предел через последовательности: годятся все $\{x_n\}\to x_0$ с $x_n\ne x_0$.`,
		formula: String.raw`\forall\{x_n\}:\ x_n\to x_0,\ x_n\ne x_0\ \Rightarrow\ \lim_{n\to\infty}f(x_n)=A`,
		body: String.raw`**Определение по Гейне** сводит [[predel-funkcii|предел функции]] к пределу последовательности: $\lim f(x)=A$, если для **всякой** $x_n\to x_0$ с $x_n\ne x_0$ выполнено $f_n=f(x_n)\to A$. Это главный рабочий инструмент дня 27: вся [[arifmetika-predelov-funkcii|арифметика пределов функции]] доказывается им в три строки — сослаться на уже готовую арифметику пределов последовательностей и вернуться обратно.`,
		related: ['predel-funkcii', 'arifmetika-predelov-funkcii', 'beskonechno-bolshaya-funkciya']
	},

	'predelnaya-tochka': {
		id: 'predelnaya-tochka',
		term: 'Предельная точка',
		short: String.raw`Точка, в любой выколотой окрестности которой есть точки множества.`,
		formula: String.raw`x_0\in A'\iff\forall\,\mathring U_{x_0}:\ \mathring U_{x_0}\cap A\ne\varnothing`,
		body: String.raw`**Предельная точка** множества $A$ — точка, в любой [[vykolotaya-okrestnost|выколотой окрестности]] которой найдётся элемент $A$. ⚠️ Курс требует именно выколотой окрестности, из-за чего появляется отдельный класс изолированных точек. Для дня 27 важно одно следствие: выколотый шар вокруг предельной точки **непуст**, и без этого не проходит ни доказательство [[kriteriy-sushchestvovaniya-predela|критерия существования предела]], ни само определение верхних и нижних граней по такому шару.`,
		related: ['vykolotaya-okrestnost', 'predel-funkcii', 'kriteriy-sushchestvovaniya-predela']
	},

	'arifmetika-predelov-funkcii': {
		id: 'arifmetika-predelov-funkcii',
		term: 'Арифметика пределов функции',
		short: String.raw`Предел суммы, произведения и частного считается по слагаемым и сомножителям.`,
		formula: String.raw`\lim(f\pm g)=A\pm B,\quad \lim fg=AB,\quad \lim\frac fg=\frac AB\ (B\ne0)`,
		body: String.raw`**Арифметические свойства предела функции** переносятся с последовательностей одним ходом: берём произвольную допустимую $\{x_n\}$, применяем [[opredelenie-geyne|определение по Гейне]], ссылаемся на арифметику пределов последовательностей и возвращаемся обратно. Курс требует закончить явной дельтой, поэтому вывод дублируется напрямую: $\delta_{f+g}(\varepsilon)=\min\{\delta_f(\varepsilon/2),\delta_g(\varepsilon/2)\}$ для суммы, с предварительным ограничением $|g|<|B|+1$ для произведения и отделением $|g|>|B|/2$ для частного.`,
		related: ['opredelenie-geyne', 'predel-funkcii', 'beskonechno-malaya-funkciya', 'beskonechno-bolshaya-funkciya']
	},

	'beskonechno-malaya-funkciya': {
		id: 'beskonechno-malaya-funkciya',
		term: 'Бесконечно малая функция',
		short: String.raw`Функция с нулевым пределом в точке; на языке классов — это $o(1)$.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=0\iff f\in o(1)\ \text{при}\ x\to x_0`,
		body: String.raw`**Бесконечно малая в точке $x_0$** — функция с нулевым пределом: $\forall\varepsilon>0\ \exists\delta>0:\ \forall x\in\mathring B_{x_0}(\delta)\ \rho_2(f(x),0)<\varepsilon$. На языке [[asimptoticheskie-klassy|асимптотических классов]] это ровно $o(1)$. В паре с [[beskonechno-bolshaya-funkciya|бесконечно большой]] даёт определённые строки таблицы: $\lim f/F=0$ всегда, а $\lim F/f=\infty$ — только при условии $f\ne0$ в [[vykolotaya-okrestnost|выколотой окрестности]].`,
		related: ['beskonechno-bolshaya-funkciya', 'asimptoticheskie-klassy', 'arifmetika-predelov-funkcii', 'vykolotaya-okrestnost']
	},

	'beskonechno-bolshaya-funkciya': {
		id: 'beskonechno-bolshaya-funkciya',
		term: 'Бесконечно большая функция',
		short: String.raw`Значения по любой допустимой последовательности неограниченны; знака нет.`,
		formula: String.raw`\lim_{x\to x_0}F(x)=\infty\iff\forall\{x_n\}\to x_0:\ \{F(x_n)\}\ \text{неограниченна}`,
		body: String.raw`**Бесконечно большая в точке $x_0$** определена [[opredelenie-geyne|по Гейне]] через неограниченность последовательности значений, а не через $|F(x)|>E$. ⚠️ Знак в определение не входит: $1/x^2$ и $-1/x^2$ обе бесконечно велики в нуле. Отсюда оговорка в строке $\lim(F+G)=\infty$ — нужна согласованность знаков. Классов **три**: есть функции ни бесконечно малые, ни бесконечно большие ($\sin\frac1x$ в нуле, любая константа). На языке [[asimptoticheskie-klassy|классов]] бесконечно большая — это $\omega(1)$.`,
		related: ['beskonechno-malaya-funkciya', 'opredelenie-geyne', 'asimptoticheskie-klassy', 'arifmetika-predelov-funkcii']
	},

	'supremum-infimum': {
		id: 'supremum-infimum',
		term: 'Супремум и инфимум',
		short: String.raw`Наименьшая верхняя и наибольшая нижняя граница множества.`,
		formula: String.raw`\sup A=\min\{M:\ \forall a\in A\ a\leqslant M\},\qquad \inf A=\max\{m:\ \forall a\in A\ a\geqslant m\}`,
		body: String.raw`**Точная верхняя грань** $\sup A$ — наименьшая из верхних границ, **точная нижняя** $\inf A$ — наибольшая из нижних; в $\overline{\mathbb R}$ они существуют у любого множества. В дне 27 это строительный материал: огибающие $S(\delta)=\sup_{\mathring B_{x_0}(\delta)}f$ и $i(\delta)=\inf_{\mathring B_{x_0}(\delta)}f$ задают [[verkhniy-predel-funkcii|верхний]] и [[nizhniy-predel-funkcii|нижний предел функции]], а неравенство $i(\delta)\leqslant f(x)\leqslant S(\delta)$ несёт всё доказательство критерия.`,
		related: ['verkhniy-predel-funkcii', 'nizhniy-predel-funkcii', 'kolebanie-funkcii']
	},

	'verkhniy-predel-funkcii': {
		id: 'verkhniy-predel-funkcii',
		term: 'Верхний предел функции',
		short: String.raw`Предел супремумов по стягивающемуся выколотому промежутку.`,
		formula: String.raw`\overline{\lim_{x\to x_0}}\,f(x)=\lim_{\delta\to0}\ \sup_{x\in\mathring B_{x_0}(\delta)}f(x)=\inf_{\delta>0}S(\delta)`,
		body: String.raw`**Верхний предел функции** вводится в курсе сразу для функции, а не только для последовательности: берём [[supremum-infimum|супремум]] по выколотому шару радиуса $\delta$ и устремляем $\delta$ к нулю. Предел существует всегда: $S(\delta)$ не возрастает при убывании $\delta$, поэтому равен $\inf_{\delta>0}S(\delta)$ в $\overline{\mathbb R}$. ⚠️ В конспекте промежуток записан **невыколотым** — тогда в грань попадает $f(x_0)$ и [[kriteriy-sushchestvovaniya-predela|критерий]] становится ложным.`,
		related: ['nizhniy-predel-funkcii', 'supremum-infimum', 'kolebanie-funkcii', 'kriteriy-sushchestvovaniya-predela']
	},

	'nizhniy-predel-funkcii': {
		id: 'nizhniy-predel-funkcii',
		term: 'Нижний предел функции',
		short: String.raw`Предел инфимумов по стягивающемуся выколотому промежутку.`,
		formula: String.raw`\underline{\lim_{x\to x_0}}\,f(x)=\lim_{\delta\to0}\ \inf_{x\in\mathring B_{x_0}(\delta)}f(x)=\sup_{\delta>0}i(\delta)`,
		body: String.raw`**Нижний предел функции** — зеркальная конструкция к [[verkhniy-predel-funkcii|верхнему]]: [[supremum-infimum|инфимум]] по выколотому шару, устремлённому к точке. Огибающая $i(\delta)$ не убывает при убывании $\delta$, поэтому предел существует и равен $\sup_{\delta>0}i(\delta)$. Всегда выполнено $\underline{\lim}f\leqslant\overline{\lim}f$, а их разность — это [[kolebanie-funkcii|колебание]] $\eta$; совпадение обеих величин и есть критерий существования предела.`,
		related: ['verkhniy-predel-funkcii', 'supremum-infimum', 'kolebanie-funkcii', 'kriteriy-sushchestvovaniya-predela']
	},

	'kolebanie-funkcii': {
		id: 'kolebanie-funkcii',
		term: 'Колебание функции в точке',
		short: String.raw`$\eta$ — разность верхнего и нижнего предела; числовая мера разрыва.`,
		formula: String.raw`\eta(x_0)=\overline{\lim_{x\to x_0}}\,f-\underline{\lim_{x\to x_0}}\,f=\lim_{\delta\to0}\bigl(S(\delta)-i(\delta)\bigr)`,
		body: String.raw`**Колебание** $\eta$ — разность [[verkhniy-predel-funkcii|верхнего]] и [[nizhniy-predel-funkcii|нижнего предела]] в точке, то есть предельная ширина полосы, в которую укладывается график около $x_0$. Перестановка «разность пределов равна пределу разности» законна по [[arifmetika-predelov-funkcii|арифметике пределов]] и только при конечных гранях. Предел существует тогда и только тогда, когда $\eta=0$. ⚠️ В классическом изложении колебание появляется лишь в теории интеграла Римана — там через него формулируется критерий интегрируемости.`,
		related: ['verkhniy-predel-funkcii', 'nizhniy-predel-funkcii', 'kriteriy-sushchestvovaniya-predela', 'arifmetika-predelov-funkcii']
	},

	'kriteriy-sushchestvovaniya-predela': {
		id: 'kriteriy-sushchestvovaniya-predela',
		term: 'Критерий существования предела',
		short: String.raw`Предел есть ⟺ верхний и нижний совпали ⟺ колебание равно нулю.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=A\iff\overline{\lim_{x\to x_0}}\,f=\underline{\lim_{x\to x_0}}\,f=A\iff\eta(x_0)=0`,
		body: String.raw`**Критерий** связывает предел с огибающими: обе стороны доказываются зажатием $i(\delta)\leqslant f(x)\leqslant S(\delta)$. Вперёд — $\delta'_s(\varepsilon)=\delta_f(\varepsilon/2)$, назад — $\delta_f(\varepsilon)=\frac12\min\{\delta_1,\delta_2\}$; непустота выколотого шара (то есть [[predelnaya-tochka|предельность]] точки $x_0$) используется ровно один раз. ⚠️ В конспекте доказательство оборвано: выписаны кванторные строки и соотношение $\delta'_s(\varepsilon_s)=\delta_f(\varepsilon_f)$, но вывода в обе стороны нет. Через критерий в одну строку доказывается и [[teorema-o-szhatoy-funkcii|теорема о сжатой функции]].`,
		related: ['verkhniy-predel-funkcii', 'kolebanie-funkcii', 'predelnaya-tochka', 'teorema-o-szhatoy-funkcii']
	},

	'teorema-o-szhatoy-funkcii': {
		id: 'teorema-o-szhatoy-funkcii',
		term: 'Теорема о сжатой функции',
		short: String.raw`Зажатая между двумя функциями с общим пределом наследует этот предел.`,
		formula: String.raw`f\leqslant h\leqslant g\ \text{на}\ \mathring B_{x_0}(r),\ \lim f=\lim g=A\ \Rightarrow\ \lim h=A`,
		body: String.raw`**Теорема о сжатой функции** — функциональный аналог «двух городовых» (день 14) для [[end-r|$\operatorname{End}(\mathbb R)$]]. Доказательство в одну строку через [[kriteriy-sushchestvovaniya-predela|критерий]]: неравенство переносится на огибающие, и $A=\underline{\lim}f\leqslant\underline{\lim}h\leqslant\overline{\lim}h\leqslant\overline{\lim}g=A$. Явная дельта: $\delta_h(\varepsilon)=\min\{r,\delta_f(\varepsilon),\delta_g(\varepsilon)\}$. ⚠️ В КЛК2 шар записан невыколотым — выколоть его правильнее.`,
		related: ['kriteriy-sushchestvovaniya-predela', 'obobshchennaya-teorema-o-szhatoy', 'end-r', 'predel-funkcii']
	},

	'obobshchennaya-teorema-o-szhatoy': {
		id: 'obobshchennaya-teorema-o-szhatoy',
		term: 'Обобщённая теорема о сжатой функции',
		short: String.raw`Версия для метрических пространств: сжатие семейством $f_n$ при $\delta_n\to0$.`,
		formula: String.raw`\rho_2\bigl(g(x_1),f_n(x_2)\bigr)<\varepsilon_n\ \ \forall x_1,x_2\in\mathring B_{x_0}(\delta_n)\ \Rightarrow\ \lim_{x\to x_0}g=A`,
		body: String.raw`**Обобщение** [[teorema-o-szhatoy-funkcii|теоремы о сжатой функции]] на $f,f_n,g:(M_1,\rho_1)\to(M_2,\rho_2)$: если $\delta_n\to0$, $\varepsilon_n\to0$, значения $g$ и $f_n$ на шаре радиуса $\delta_n$ различаются меньше чем на $\varepsilon_n$, $f_n\to f$ и $\lim f=A$, то $\lim g=A$. Доказательство — неравенство треугольника с тремя слагаемыми по $\varepsilon/3$. ⚠️ В списке КЛК2 требуется лишь **поточечная** сходимость $f_n\to f$; в таком виде утверждение неверно (контрпример разобран в дне), нужна равномерная сходимость в окрестности $x_0$.`,
		related: ['teorema-o-szhatoy-funkcii', 'metriki-rho', 'kriteriy-sushchestvovaniya-predela']
	},

	'predel-kompozicii': {
		id: 'predel-kompozicii',
		term: 'Предел композиции функций',
		short: String.raw`Дельта композиции — это композиция дельт, но нужно условие $g(x)\ne y_0$.`,
		formula: String.raw`\delta_{f\circ g}(\varepsilon)=\min\bigl\{r,\ \delta_g\bigl(\sigma_f(\varepsilon)\bigr)\bigr\}`,
		body: String.raw`**Предел композиции**: если $\lim_{x\to x_0}g=y_0$, $\lim_{y\to y_0}f=A$ и $g(x)\ne y_0$ в некоторой [[vykolotaya-okrestnost|выколотой окрестности]] $x_0$, то $\lim_{x\to x_0}f(g(x))=A$. Приём — подставить дельту внешней функции внутрь как эпсилон внутренней. ⚠️ Без третьего условия утверждение ложно: при $g\equiv0$ и $f(y)=1$ при $y\ne0$, $f(0)=0$ композиция стремится к $0$, а не к $1$. Альтернатива — непрерывность $f$ в $y_0$ (день 28).`,
		related: ['predel-funkcii', 'vykolotaya-okrestnost', 'arifmetika-predelov-funkcii', 'teorema-o-szhatoy-funkcii']
	}
};
