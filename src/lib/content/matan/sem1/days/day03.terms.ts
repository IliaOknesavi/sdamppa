import type { Glossary } from '$lib/types';

// Термины дня 3 (ch03) — мощности, счётность, теорема Кантора.
// Термины, живущие в каноническом глоссарии (sem1/glossary.ts), здесь
// НЕ переобъявляются, а только используются как ссылки в телах секций:
//   n-nol-n-odin (ℕ₀ / ℕ₁), zamykanie (cl A), blacksquare (оформление вывода).
// Всё остальное, на что ссылается день, объявлено ниже — день обязан
// резолвиться независимо от соседних дней.
export const day03Terms: Glossary = {
	biekciya: {
		id: 'biekciya',
		term: 'Биекция',
		short: String.raw`Спаривание один-к-одному: условие с $\exists!$ выполнено в обе стороны.`,
		formula: String.raw`\forall x\in A\ \exists!\,y\in B:\ f(x)=y,\qquad \forall y\in B\ \exists!\,x\in A:\ f(x)=y`,
		body: String.raw`Отображение, при котором каждому элементу области значений отвечает ровно один прообраз, — то есть [[inektivnost-syuryektivnost|инъекция и сюръекция]] одновременно. Ровно у биекций существует [[obratnaya-funkciya|обратное отображение]], и оно тоже биекция.`,
		related: ['inektivnost-syuryektivnost', 'obratnaya-funkciya', 'otobrazhenie']
	},

	ravnomoshchnost: {
		id: 'ravnomoshchnost',
		term: 'Равномощность A ↔ B',
		short: String.raw`Между множествами есть биекция; запись — $A\leftrightarrow B$.`,
		body: String.raw`Два множества **равномощны**, если между ними существует [[biekciya|биекция]]; обозначение — $A\leftrightarrow B$. Равномощность есть отношение эквивалентности: рефлексивность даёт тождественное отображение, симметричность — переход к $f^-$, транзитивность — композиция. Поэтому [[moshchnost-mnozhestva|мощность]] корректно понимать как класс эквивалентности по $\leftrightarrow$, а не как «число элементов».`,
		related: ['biekciya', 'moshchnost-mnozhestva', 'schetnoe-mnozhestvo']
	},

	'moshchnost-mnozhestva': {
		id: 'moshchnost-mnozhestva',
		term: 'Мощность множества',
		short: String.raw`Три равноправных обозначения: $\#A=|A|=\operatorname{card}A$.`,
		formula: String.raw`\#A=|A|=\operatorname{card}A`,
		body: String.raw`**Мощность** — размер множества, понимаемый как класс [[ravnomoshchnost|равномощных]] ему множеств. Обозначается тремя взаимозаменяемыми способами: $\#A$, $|A|$, $\operatorname{card}A$. Для [[konechnoe-mnozhestvo|конечного]] множества мощность совпадает с числом элементов, для бесконечных превращается в [[kardinalnoe-chislo|кардинальное число]] ($\aleph_0$, $2^{\aleph_0}$, …). Сравниваются мощности не пересчётом, а через [[vlozhenie|вложение]].`,
		related: ['ravnomoshchnost', 'konechnoe-mnozhestvo', 'kardinalnoe-chislo', 'vlozhenie']
	},

	'konechnoe-mnozhestvo': {
		id: 'konechnoe-mnozhestvo',
		term: 'Конечное множество',
		short: String.raw`$\exists n:[1\ldots n]\leftrightarrow A$; отдельно оговорено $|\varnothing|=0$.`,
		formula: String.raw`\exists n:\ [1\ldots n]\leftrightarrow A\ \Longrightarrow\ \#A=n`,
		body: String.raw`Множество $A$ **конечно**, если найдётся $n$ с [[biekciya|биекцией]] $[1\ldots n]\leftrightarrow A$; тогда $\#A=n$. Отрезок натуральных работает эталонной линейкой, а $n$ определено однозначно, потому что при $n\ne m$ отрезки $[1\ldots n]$ и $[1\ldots m]$ не равномощны. Пустое множество это определение формально не покрывает, поэтому оговаривается отдельным пунктом: $\varnothing$ конечно и $|\varnothing|=0$. Всё, что не конечно, — [[beskonechnoe-mnozhestvo|бесконечно]].`,
		related: ['biekciya', 'beskonechnoe-mnozhestvo', 'moshchnost-mnozhestva']
	},

	'beskonechnoe-mnozhestvo': {
		id: 'beskonechnoe-mnozhestvo',
		term: 'Бесконечное множество',
		short: String.raw`Не конечно; допускает биекцию с собственным подмножеством.`,
		body: String.raw`**Бесконечное** множество — то, которое не [[konechnoe-mnozhestvo|конечно]]: никакой отрезок $[1\ldots n]$ на него биективно не ложится. Рабочий признак: бесконечное множество можно биективно отобразить на собственное подмножество ($n\mapsto 2n$ переводит $\mathbb N_1$ в чётные), а конечное — нельзя. Бесконечности различаются по размеру: [[schetnoe-mnozhestvo|счётная]] мощность строго меньше континуума, а [[teorema-kantora|теорема Кантора]] строит из них бесконечную башню.`,
		related: ['konechnoe-mnozhestvo', 'schetnoe-mnozhestvo', 'teorema-kantora']
	},

	vlozhenie: {
		id: 'vlozhenie',
		term: 'Вложение и сравнение мощностей',
		short: String.raw`$f:X\to Y$ биективно на некоторое $Y'\subset Y$; отсюда $\#A\le\#B$.`,
		formula: String.raw`\#A\le\#B\iff\exists\,B'\subset B:\ A\leftrightarrow B'`,
		body: String.raw`Отображение $f:X\to Y$ называется **вложением**, если существует $Y'\subset Y$, на которое $f$ действует [[biekciya|биективно]]; иначе говоря, $f$ инъективно и биективно на свой образ. Запись $\#A\le\#B$ означает ровно «существует вложение $A$ в $B$», а $\#A<\#B$ — вложение есть, а [[ravnomoshchnost|равномощности]] нет.`,
		related: ['biekciya', 'ravnomoshchnost', 'moshchnost-mnozhestva', 'teorema-kantora']
	},

	'teorema-kantora': {
		id: 'teorema-kantora',
		term: 'Теорема Кантора',
		short: String.raw`$|A|<|2^A|$ для любого $A$ — булеан всегда строго мощнее.`,
		formula: String.raw`|A|<|2^A|`,
		body: String.raw`Для любого [[mnozhestvo|множества]] $A$ выполнено $|A|<|2^A|$: булеан строго мощнее самого множества. Следствие — наибольшей мощности не существует.`,
		related: ['mnozhestvo', 'schetnoe-mnozhestvo']
	},

	'diagonalnyy-metod': {
		id: 'diagonalnyy-metod',
		term: 'Диагональный метод',
		short: String.raw`$D=\{x\in A: x\notin f(x)\}$ — объект, промахивающийся мимо всего образа.`,
		formula: String.raw`D=\{x\in A\mid x\notin f(x)\}`,
		body: String.raw`**Диагональ Кантора** — приём построения объекта, отличающегося от каждого элемента предъявленного списка. В [[teorema-kantora|теореме Кантора]] это $D=\{x\in A\mid x\notin f(x)\}$: допущение $D=f(x_0)$ противоречиво и при $x_0\in D$, и при $x_0\notin D$. В доказательстве [[neschetnoe-mnozhestvo|несчётности]] $\mathbb R$ — та же конструкция по цифрам: $k$-я цифра нового числа меняется относительно $k$-го числа списка. Приём не требует разбора случаев «конечное / бесконечное» и доказывает несюръективность любого $f$, а не только предполагаемой биекции.`,
		related: ['teorema-kantora', 'neschetnoe-mnozhestvo', 'bulean']
	},

	'schetnoe-mnozhestvo': {
		id: 'schetnoe-mnozhestvo',
		term: 'Счётное множество',
		short: String.raw`Равномощно $\mathbb N_1$: счётны $\mathbb N_0$, $\mathbb Z$, $\mathbb Q$.`,
		formula: String.raw`\#A=\aleph_0\iff A\leftrightarrow\mathbb N_1`,
		body: String.raw`Множество, равномощное [[naturalnye-chisla|натуральному ряду]], то есть такое, все элементы которого можно занумеровать. Счётны $\mathbb Z$ и $\mathbb Q$; счётность — наименьшая бесконечная мощность.`,
		related: ['naturalnye-chisla', 'biekciya', 'mnozhestvo']
	},

	'neschetnoe-mnozhestvo': {
		id: 'neschetnoe-mnozhestvo',
		term: 'Несчётное множество',
		short: String.raw`Бесконечно, но не равномощно $\mathbb N_1$; таковы $\mathbb R$ и $\mathbb I$.`,
		formula: String.raw`|\mathbb R|=2^{\aleph_0}>\aleph_0`,
		body: String.raw`Множество **несчётно**, если оно [[beskonechnoe-mnozhestvo|бесконечно]] и не [[schetnoe-mnozhestvo|счётно]]. Несчётен уже полуинтервал $[0;1)$: любое перечисление его элементов обходит [[diagonalnyy-metod|диагональное]] число, у которого $k$-я цифра отличается от $k$-й цифры $k$-го числа списка. Отсюда несчётны $\mathbb R$ и $\mathbb I$ — будь иррациональные счётны, счётным было бы и $\mathbb R=\mathbb Q\sqcup\mathbb I$.`,
		related: ['schetnoe-mnozhestvo', 'diagonalnyy-metod', 'kontinuum-gipoteza']
	},

	'kardinalnoe-chislo': {
		id: 'kardinalnoe-chislo',
		term: 'Кардинальное число',
		short: String.raw`Мощность как самостоятельный объект; у бесконечных множеств — алефы.`,
		formula: String.raw`\aleph_0<\aleph_1<\aleph_2<\ldots`,
		body: String.raw`**Кардинальное число** — [[moshchnost-mnozhestva|мощность]], взятая как самостоятельный объект сравнения. У конечных множеств кардинал совпадает с числом элементов, у бесконечных вводятся алефы: [[alef-nol|$\aleph_0$]] — счётная мощность, $\aleph_1$ — наименьший кардинал, превосходящий $\aleph_0$, дальше $\aleph_2$ и так далее. Порядок на кардиналах задаётся [[vlozhenie|вложением]], а [[teorema-kantora|теорема Кантора]] гарантирует, что наибольшего кардинала нет.`,
		related: ['alef-nol', 'moshchnost-mnozhestva', 'kontinuum-gipoteza', 'teorema-kantora']
	},

	'alef-nol': {
		id: 'alef-nol',
		term: 'Алеф-нуль ℵ₀',
		short: String.raw`Мощность $\mathbb N_1$ — наименьшая бесконечная мощность.`,
		formula: String.raw`\aleph_0=|\mathbb N_1|`,
		body: String.raw`$\aleph_0$ — [[kardinalnoe-chislo|кардинал]] [[schetnoe-mnozhestvo|счётного]] множества: $\aleph_0=|\mathbb N_1|$. Это наименьшая бесконечная мощность — всякое бесконечное множество содержит счётное подмножество. Арифметика непривычна: $\aleph_0+1=\aleph_0$, $\aleph_0+\aleph_0=\aleph_0$, $\aleph_0\cdot\aleph_0=\aleph_0$ — ровно поэтому $\mathbb N_0$, $\mathbb Z$ и $\mathbb Q$ равномощны. А вот $2^{\aleph_0}>\aleph_0$ по [[teorema-kantora|теореме Кантора]].`,
		related: ['schetnoe-mnozhestvo', 'kardinalnoe-chislo', 'kontinuum-gipoteza']
	},

	'kontinuum-gipoteza': {
		id: 'kontinuum-gipoteza',
		term: 'Континуум-гипотеза (CH)',
		short: String.raw`$2^{\aleph_0}=\aleph_1$ — независима от ZFC: ни доказать, ни опровергнуть.`,
		formula: String.raw`2^{\aleph_0}=\aleph_1`,
		body: String.raw`**Континуум-гипотеза**: между $\aleph_0$ и мощностью континуума промежуточных мощностей нет, то есть $2^{\aleph_0}=\aleph_1$. Без дополнительных предположений доказуемо лишь $|\mathbb R|=2^{\aleph_0}$, а само равенство $2^{\aleph_0}=\aleph_1$ **независимо от ZFC** (Гёдель, 1940 — неопровержима; Коэн, 1963 — недоказуема). Поэтому $|\mathbb R|=2^{\aleph_0}$ пишется без оговорок, а запись $\aleph_1=|\mathbb R|$ истинна только вместе с CH и требует явной ссылки на неё.`,
		related: ['alef-nol', 'kardinalnoe-chislo', 'neschetnoe-mnozhestvo', 'teorema-kantora']
	}
};
