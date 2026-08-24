import type { Glossary } from '$lib/types';

// Термины дня 2: декартово произведение, отношения, отображения, три оси
// классификации. День должен резолвиться независимо, поэтому всё, на что
// ссылается day02.ts, объявлено здесь — кроме сквозной нотации, которая живёт
// в sem1/glossary.ts и подмешивается последней: dopolnenie (черта = дополнение),
// n-nol-n-odin, end-r, metriki-rho, asimptoticheskie-klassy, blacksquare.
// «Функциональность» вынесена в отдельную карточку, а D(f) и E(f) собраны в
// одну (oblast-znacheniy) — они и разбираются только в паре.
export const day02Terms: Glossary = {
	'konsolidirovannoe-proizvedenie': {
		id: 'konsolidirovannoe-proizvedenie',
		term: 'Консолидированное произведение',
		short: String.raw`$n$-арное произведение, элементы которого — плоские $n$-ки.`,
		formula: String.raw`\mathop{\times}\limits_{i=1}^{n}A_i=B:\quad \forall a_i\in A_i\ \exists\,(a_1,\dots,a_n)\in B`,
		body: String.raw`«Наивное» $A\times B\times C$ раскрывается двумя неэквивалентными способами — $(A\times B)\times C$ и $A\times(B\times C)$, — поэтому $n$-арное [[dekartovo-proizvedenie|произведение]] определяется **заново**, теми же двумя условиями, но сразу для **плоских** наборов $(a_1,\dots,a_n)$, а не для вложенных [[uporyadochennaya-para|пар]]. Мощность равна $|A_1|\cdot\ldots\cdot|A_n|$: координаты выбираются независимо. Равносильное построение — множество функций $f:\{1,\dots,n\}\to\bigcup_i A_i$ с условием $f(i)\in A_i$: номер места хранится тогда в аргументе, а не в глубине вложенности.`,
		related: ['dekartovo-proizvedenie', 'uporyadochennaya-para']
	},

	funkcionalnost: {
		id: 'funkcionalnost',
		term: 'Условие функциональности',
		short: String.raw`Каждому $x$ отвечает не больше одного $y$ — иначе это не отображение.`,
		formula: String.raw`\forall x\in X,\ \forall y_1,y_2\in Y:\ (x,y_1)\in f,\ (x,y_2)\in f\ \Rightarrow\ y_1=y_2`,
		body: String.raw`Условие, отделяющее [[otobrazhenie|отображение]] от произвольного [[binarnoe-otnoshenie|отношения]] $f\subset X\times Y$: если пара с данным $x$ встретилась дважды, вторые элементы обязаны совпасть. Не путать со всюду определённостью: та требует, чтобы множество определения совпало со всей [[oblast-znacheniy|областью определения]] $X$, то есть чтобы пара с данным $x$ нашлась хотя бы одна. Функциональность запрещает вторую такую пару, но не требует первой, поэтому всюду определённость в её условие не входит.`,
		related: ['otobrazhenie', 'binarnoe-otnoshenie', 'oblast-znacheniy']
	},

	refleksivnost: {
		id: 'refleksivnost',
		term: 'Рефлексивность',
		short: String.raw`$\forall x\in S:\ x\,R\,x$. Модельный пример — «$\le$».`,
		formula: String.raw`\forall x\in S:\ x\,R\,x`,
		body: String.raw`Первая из трёх осей классификации [[binarnoe-otnoshenie|отношений]]: петля у **каждой** точки. Противоположный класс — [[antirefleksivnost|антирефлексивность]], промежуточный — [[nerefleksivnost|нерефлексивность]]. Рефлексивность входит в определение [[otnoshenie-ekvivalentnosti|эквивалентности]], но НЕ входит в определение [[otnoshenie-poryadka|порядка]] — там она лишь отделяет нестрогий порядок от строгого.`,
		related: ['antirefleksivnost', 'nerefleksivnost', 'otnoshenie-ekvivalentnosti', 'otnoshenie-poryadka']
	},

	antirefleksivnost: {
		id: 'antirefleksivnost',
		term: 'Антирефлексивность',
		short: String.raw`$\forall x\in S:\ x\,\overline R\,x$ — ни одной петли. Пример — «$>$».`,
		formula: String.raw`\forall x\in S:\ x\,\overline R\,x`,
		body: String.raw`Отношение антирефлексивно, если $x\,R\,x$ не выполняется **ни для одного** $x$; модельный пример — «$>$», ведь $x>x$ ложно всегда. Это не отрицание [[refleksivnost|рефлексивности]]: «не для всех» гораздо слабее, чем «ни для кого», и промежуток между двумя классами занимает [[nerefleksivnost|нерефлексивность]]. Антирефлексивное [[otnoshenie-poryadka|отношение порядка]] называется строгим.`,
		related: ['refleksivnost', 'nerefleksivnost', 'otnoshenie-poryadka']
	},

	nerefleksivnost: {
		id: 'nerefleksivnost',
		term: 'Нерефлексивность (третий класс)',
		short: String.raw`«Ни свойство, ни его анти-версия» — третий класс на каждой оси.`,
		body: String.raw`Свойства отношений идут **тройками**, а не парами. Отношение **нерефлексивно**, если оно не [[refleksivnost|рефлексивно]] и не [[antirefleksivnost|антирефлексивно]] (петли есть, но не у всех): пример — $R=\{(1,1)\}$ на $S=\{1,2\}$. Так же устроены **несимметричность** — ни [[simmetrichnost|симметрично]], ни [[antisimmetrichnost|антисимметрично]] — и **нетранзитивность** по оси [[tranzitivnost|транзитивности]]. «Не-» здесь значит «ни то, ни другое», а не отрицание первого свойства.`,
		related: ['refleksivnost', 'antirefleksivnost', 'simmetrichnost', 'tranzitivnost']
	},

	simmetrichnost: {
		id: 'simmetrichnost',
		term: 'Симметричность',
		short: String.raw`$\forall x\ne y:\ x\,R\,y\Rightarrow y\,R\,x$ — все стрелки двусторонние.`,
		formula: String.raw`\forall x\ne y:\ x\,R\,y\ \Rightarrow\ y\,R\,x`,
		body: String.raw`Вторая ось классификации. Оговорка $x\ne y$ выводит диагональные пары из рассмотрения: без неё петли ломали бы всю классификацию — например, «$\le$» перестало бы быть [[antisimmetrichnost|антисимметричным]] из-за $x\le x$. Противоположный класс — [[antisimmetrichnost|антисимметричность]], промежуточный — несимметричность (см. [[nerefleksivnost|третий класс]]). Симметричность — одно из трёх требований [[otnoshenie-ekvivalentnosti|отношения эквивалентности]].`,
		related: ['antisimmetrichnost', 'nerefleksivnost', 'otnoshenie-ekvivalentnosti']
	},

	antisimmetrichnost: {
		id: 'antisimmetrichnost',
		term: 'Антисимметричность',
		short: String.raw`$\forall x\ne y:\ x\,R\,y\Rightarrow y\,\overline R\,x$ — все стрелки односторонние.`,
		formula: String.raw`\forall x\ne y:\ x\,R\,y\ \Rightarrow\ y\,\overline R\,x`,
		body: String.raw`Между двумя различными точками стрелка не больше одной. Равносильная запись без оговорки — $x\,R\,y\wedge y\,R\,x\Rightarrow x=y$: при $x\ne y$ запрет на одновременные $x\,R\,y$ и $y\,R\,x$ и есть импликация $x\,R\,y\Rightarrow y\,\overline R\,x$, а при $x=y$ обе формы не требуют ничего. Диагональные пары остаются свободными, поэтому антисимметричными бывают и рефлексивные отношения, например «$\le$». Ср. [[simmetrichnost|симметричность]] и [[tranzitivnost|транзитивность]].`,
		related: ['simmetrichnost', 'tranzitivnost', 'otnoshenie-poryadka']
	},

	tranzitivnost: {
		id: 'tranzitivnost',
		term: 'Транзитивность и антитранзитивность',
		short: String.raw`Для попарно различных $x,y,z$: $x\,R\,y,\ y\,R\,z\Rightarrow x\,R\,z$.`,
		formula: String.raw`\forall x\ne y,\ y\ne z,\ x\ne z:\quad x\,R\,y,\ y\,R\,z\ \Rightarrow\ x\,R\,z`,
		body: String.raw`Третья ось классификации [[binarnoe-otnoshenie|отношений]]. **Транзитивность** — каждый путь из двух стрелок продублирован прямой стрелкой; **антитранзитивность** — не продублирован ни один ($x\,\overline R\,z$); промежуток занимает нетранзитивность (см. [[nerefleksivnost|третий класс]]). Требование попарной различности $x,y,z$ работает как оценка снизу: если таких троек в $S$ нет (например, при $|S|\le2$), оба свойства истинны вакуумно и нетранзитивных отношений на $S$ не существует.`,
		related: ['nerefleksivnost', 'antisimmetrichnost', 'otnoshenie-ekvivalentnosti', 'otnoshenie-poryadka']
	},

	'otnoshenie-ekvivalentnosti': {
		id: 'otnoshenie-ekvivalentnosti',
		term: 'Отношение эквивалентности',
		short: String.raw`Рефлексивное + симметричное + транзитивное; режет $S$ на классы.`,
		formula: String.raw`S=\bigcup_{x\in S}[x],\qquad [x]=\{y\in S:\ x\,R\,y\}`,
		body: String.raw`Отношение, одновременно [[refleksivnost|рефлексивное]], [[simmetrichnost|симметричное]] и [[tranzitivnost|транзитивное]]. Классы $[x]=\{y\in S:\ x\,R\,y\}$ образуют **дизъюнктное разбиение** $S$, и обратно — всякое разбиение задаёт эквивалентность. Модельные примеры: равенство, вычеты по модулю $4$, равномощность.`,
		related: ['refleksivnost', 'simmetrichnost', 'tranzitivnost', 'otnoshenie-poryadka']
	},

	'otnoshenie-poryadka': {
		id: 'otnoshenie-poryadka',
		term: 'Отношение порядка',
		short: String.raw`Антисимметричное + транзитивное. Рефлексивность НЕ требуется.`,
		formula: String.raw`R\ \text{антисимм.}\ \wedge\ R\ \text{транз.}`,
		body: String.raw`Порядок — **любое** [[antisimmetrichnost|антисимметричное]] [[tranzitivnost|транзитивное]] отношение; рефлексивность в определение не входит. Она лишь делит порядок на **нестрогий** ([[refleksivnost|рефлексивный]], «$\le$») и **строгий** ([[antirefleksivnost|антирефлексивный]], «$>$»). Между этими двумя случаями остаётся третий: $R=\{(1,1),(1,2)\}$ на $S=\{1,2\}$ антисимметрично и транзитивно, но петля стоит лишь у одной точки — такой порядок не строгий и не нестрогий.`,
		related: ['antisimmetrichnost', 'tranzitivnost', 'refleksivnost', 'antirefleksivnost']
	},

	'oblast-znacheniy': {
		id: 'oblast-znacheniy',
		term: 'Область определения D(f) и область значений E(f)',
		short: String.raw`Область значений — весь кодомен $Y$; образ зовётся множеством значений.`,
		formula: String.raw`D(f)=X,\qquad E(f)=Y`,
		body: String.raw`Для [[otobrazhenie|отображения]] $f:X\to Y$ пишут $D(f)=X$ (область определения) и $E(f)=Y$ (область значений). При этом *область* значений — весь $Y$, а *множество* значений — только достигнутые элементы, то есть образ $f(X)$: множество $Y$ задано заранее вместе с [[dekartovo-proizvedenie|произведением]] $X\times Y$, а образ ещё надо вычислить. Для $f(x)=x^2$ на $\mathbb R$ область значений $=\mathbb R$, множество значений $=[0,+\infty)$. Та же пара слов работает и слева: $X$ — область определения, а множество определения — те $x$, на которых $f$ действительно задана.`,
		related: ['otobrazhenie', 'funkcionalnost', 'dekartovo-proizvedenie']
	}
};
