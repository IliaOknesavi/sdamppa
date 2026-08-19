import type { Glossary } from '$lib/types';

// Термины дня 1 (ch01): логика, предикаты, ZFC. Термины из общего глоссария
// (sem1/glossary.ts) здесь НЕ переобъявляются, а только перелинковываются
// через [[...]]:
//   n-nol-n-odin (ℕ₀/ℕ₁), dopolnenie (черта сверху = дополнение),
//   komponenta-svyaznosti, blacksquare (оформление доказательства).
// Всё остальное, на что ссылается day01.ts, объявлено ниже — день должен
// резолвиться независимо от соседних дней.
export const day01Terms: Glossary = {
	predikat: {
		id: 'predikat',
		term: 'Предикат',
		short: String.raw`Суждение с переменной; высказыванием становится после подстановки или квантора.`,
		formula: String.raw`P(x)\ \text{— предикат},\qquad \forall x\in A\ P(x)\ \text{— высказывание}`,
		body: String.raw`**Предикат** — выражение с переменной, у которого само по себе нет истинностного значения. Значение появляется двумя способами: подстановкой конкретного элемента ($P(3)$ истинно или ложно) или связыванием переменной [[kvantory|квантором]] ($\forall x\in A\ P(x)$ — уже высказывание).

Предикаты — рабочий материал [[aksioma-vydeleniya|аксиомы выделения]]: множество разрешено задавать только как $\{y\in x\mid\varphi(y)\}$, где $\varphi$ — предикат, а $x$ — уже существующее множество. Отрицаются предикаты по [[otricanie-predikata|принципу отрицания]].`,
		related: ['kvantory', 'otricanie-predikata', 'vakuumnaya-istinnost', 'aksioma-vydeleniya']
	},

	kvantory: {
		id: 'kvantory',
		term: 'Кванторы ∀, ∃, ∃!',
		short: String.raw`«Для всех», «существует», «существует единственный».`,
		formula: String.raw`\forall x\in A\ \ P(x),\qquad \exists x\in A:\ P(x),\qquad \exists!\,x\in A:\ P(x)`,
		body: String.raw`**Кванторы** связывают переменную [[predikat|предиката]] и превращают его в высказывание: $\forall$ — «для всех», $\exists$ — «существует», $\exists!$ — «существует единственный» (последний используется в определении биекции).

Примеры записи: $\forall x\in[1\ldots5]\ \ 3x\le 15$, $\exists x\in[1\ldots5]\ \ x^2\ge 10$. Асимметрия кванторов на [[pustoe-mnozhestvo|пустом множестве]] и есть содержание [[vakuumnaya-istinnost|вакуумной истинности]]: $\forall$-утверждение там истинно, $\exists$-утверждение ложно.`,
		related: ['predikat', 'otricanie-predikata', 'vakuumnaya-istinnost']
	},

	'otricanie-predikata': {
		id: 'otricanie-predikata',
		term: 'Принцип отрицания предикатов',
		short: String.raw`Квантор переворачивается, внутренний предикат отрицается.`,
		formula: String.raw`\overline{\forall x\in A\ P(x)}\iff\exists x\in A:\ \overline{P(x)}`,
		body: String.raw`**Принцип отрицания предикатов.** При отрицании каждый [[kvantory|квантор]] меняется на двойственный, а [[predikat|предикат]] под ним отрицается: $\overline{\forall}\to\exists$, $\overline{\exists}\to\forall$. При вложенных кванторах правило применяется слева направо.

Отрицание, как и [[dopolnenie|дополнение множества]], пишется чертой сверху — обозначения согласованы: дополнение есть в точности множество, где предикат ложен. Практический смысл принципа: опровергнуть $\forall$-утверждение можно только предъявив контрпример, и именно на этом строятся доказательства «через отсутствие контрпримера».`,
		related: ['predikat', 'kvantory', 'vakuumnaya-istinnost', 'dopolnenie']
	},

	'vakuumnaya-istinnost': {
		id: 'vakuumnaya-istinnost',
		term: 'Вакуумная истинность',
		short: String.raw`Предикат под ∀ на пустом множестве истинен — опровергнуть его нечем.`,
		formula: String.raw`\bigl(\forall x\in\varnothing:\ P(x)\bigr)=\top\quad\text{для любого }P`,
		body: String.raw`[[predikat|Предикат]] под квантором $\forall$ на [[pustoe-mnozhestvo|пустом множестве]] истинен. Доказывается [[otricanie-predikata|отрицанием]]: опровержение требует свидетеля $x\in\varnothing$, а таких нет, значит отрицание ложно.

Прямое следствие: два **взаимно исключающих** предиката над $\varnothing$ истинны одновременно — например $\forall x\in\varnothing:\ x^3>x^2$ и $\forall x\in\varnothing:\ x^3\le x^2$. Противоречия нет, потому что элементов, на которых утверждения могли бы разойтись, не существует. Отсюда же выводится $\varnothing\subset A$ для любого $A$, а вместе с ним и единственность пустого множества.`,
		related: ['predikat', 'otricanie-predikata', 'pustoe-mnozhestvo', 'kvantory']
	},

	universum: {
		id: 'universum',
		term: 'Универсум U',
		short: String.raw`Множество, для которого всякое $x$ — подмножество.`,
		formula: String.raw`\forall x:\ x\subset U`,
		body: String.raw`**Универсум** $U$ — множество, для которого $\forall x:\ x\subset U$, то есть объемлющее всё. Это условие равносильно «всякое множество лежит в $U$»: из $\{a\}\subset U$ следует $a\in U$, а обратно элементы любого множества сами множества и потому лежат в $U$. На универсуме и ставится вопрос о множестве всех множеств, ответ на который даёт [[paradoks-rassela|парадокс Рассела]].

В [[zfc|ZFC]] универсум **не является множеством**: это собственный класс, и существование его как множества опровергается. Поэтому «универсум» в дальнейших рассуждениях — всегда конкретное объемлющее множество задачи (например $S$ в топологическом пространстве, до которого берётся [[dopolnenie|дополнение]]), а не «всё вообще».`,
		related: ['paradoks-rassela', 'zfc', 'dopolnenie']
	},

	'paradoks-rassela': {
		id: 'paradoks-rassela',
		term: 'Парадокс Рассела',
		short: String.raw`Множества всех множеств не существует: $R\in R\iff R\notin R$.`,
		formula: String.raw`R=\{x\mid x\notin x\}:\qquad R\in R\iff R\notin R`,
		body: String.raw`**Парадокс Рассела.** Если бы существовал [[universum|универсум]] $U$ — множество всех множеств, — из него можно было бы вырезать $R=\{x\in U\mid x\notin x\}$. Тогда $R\in R$ влечёт $R\notin R$, а $R\notin R$ влечёт $R\in R$; оба случая противоречивы, значит $U$ не существует.

Парадокс и есть причина, по которой теория множеств строится аксиоматически ([[zfc|ZFC]]). Лекарство — [[aksioma-vydeleniya|аксиома выделения]]: множество задаётся не произвольным свойством, а только вырезанием из уже существующего множества. Тот же приём «объект, отличающийся от каждого элемента списка» лежит в основе диагонального аргумента Кантора.`,
		related: ['universum', 'aksioma-vydeleniya', 'zfc']
	},

	zfc: {
		id: 'zfc',
		term: 'ZFC',
		short: String.raw`ZF (Цермело–Френкель) плюс аксиома выбора; аксиомы ZF1–ZF8.`,
		formula: String.raw`\mathrm{ZFC}=\mathrm{ZF}+\mathrm{AC}`,
		body: String.raw`**ZFC** — аксиоматика Цермело–Френкеля с аксиомой выбора; множества первичны, а $\mathbb N,\mathbb Z,\mathbb Q,\mathbb R$ строятся *внутри* теории множеств. Нумерация: ZF1 [[aksioma-ekstencionalnosti|экстенциональность]], ZF2 [[pustoe-mnozhestvo|пустое множество]], ZF3 пара, ZF4 степень, ZF5 бесконечность, ZF6 [[aksioma-vydeleniya|выделение]], ZF7 объединение, ZF8 регулярность, плюс отдельно [[aksioma-vybora|аксиома выбора]].

Восьми аксиом для полной ZF не хватает: в списке нет схемы подстановки (замены), собирающей образ множества под формулой-функцией, и без неё не собрать в одно множество последовательность $\mathbb N,\ 2^{\mathbb N},\ 2^{2^{\mathbb N}},\ \ldots$ и не доказать существования ординала $\omega\cdot2=\omega+\omega$. ZF2, наоборот, избыточна: $\varnothing$ выводится [[aksioma-vydeleniya|выделением]].`,
		related: ['aksioma-ekstencionalnosti', 'aksioma-vydeleniya', 'aksioma-vybora', 'paradoks-rassela']
	},

	'aksioma-ekstencionalnosti': {
		id: 'aksioma-ekstencionalnosti',
		term: 'Аксиома экстенциональности (ZF1)',
		short: String.raw`Множество однозначно определяется своими элементами.`,
		formula: String.raw`A=B\iff(\forall x\in A:\ x\in B)\wedge(\forall x\in B:\ x\in A)`,
		body: String.raw`**ZF1, экстенциональность:** множество однозначно определяется своими элементами, то есть равенство множеств равносильно двум взаимным включениям. Ни порядок, ни кратность записи элементов роли не играют: $\{1,1,2\}=\{2,1\}$.

Из этой аксиомы напрямую получается теорема «$(A\subset B)\wedge(B\subset A)\Rightarrow A=B$»: она просто переводит правую часть ZF1 с языка [[kvantory|кванторов]] на язык [[podmnozhestvo|включений]]. Поэтому любое равенство множеств доказывается двумя включениями, а не «прямым вычислением». Ею же доказывается единственность [[pustoe-mnozhestvo|пустого множества]].`,
		related: ['zfc', 'podmnozhestvo', 'pustoe-mnozhestvo']
	},

	'aksioma-vydeleniya': {
		id: 'aksioma-vydeleniya',
		term: 'Аксиома выделения (ZF6)',
		short: String.raw`Из существующего множества можно вырезать подмножество по предикату.`,
		formula: String.raw`\forall x\ \exists y=\{z\in x\mid\varphi(z)\}\qquad(\text{схема: по аксиоме на каждую }\varphi)`,
		body: String.raw`**ZF6, выделение:** для любого множества $x$ и любого [[predikat|предиката]] $\varphi$ существует множество $\{z\in x\mid\varphi(z)\}$. Это не одна аксиома, а **схема** — по аксиоме на каждую формулу $\varphi$: квантора по формулам в языке теории множеств нет. Ключевое ограничение — слева от черты обязано стоять **уже существующее множество**: выделение только сужает, но не создаёт множеств из ничего.

Именно это ограничение обезвреживает [[paradoks-rassela|парадокс Рассела]]: запись $\{x\mid x\notin x\}$ незаконна, а $\{x\in\mathbb N_1\mid x\notin x\}$ законна (и равна [[n-nol-n-odin|$\mathbb N_1$]], так как $x\in x$ запрещено аксиомой регулярности ZF8). Выделением же выводится и $\varnothing=\{x\in A\mid x\ne x\}$ — поэтому отдельная аксиома пустого множества не обязательна.`,
		related: ['zfc', 'paradoks-rassela', 'predikat', 'pustoe-mnozhestvo']
	},

	'aksioma-vybora': {
		id: 'aksioma-vybora',
		term: 'Аксиома выбора (AC)',
		short: String.raw`Функция выбора берёт по элементу из каждого непустого множества семейства.`,
		formula: String.raw`\exists f:X\to\bigcup X\quad\text{такая, что}\quad\forall A\in X:\ f(A)\in A`,
		body: String.raw`**Аксиома выбора.** Для любого множества $X$, все элементы которого непусты, существует **функция выбора** $f:X\to\bigcup X$ с условием $f(A)\in A$ для каждого $A\in X$. Сила аксиомы — в *одновременном* выборе из бесконечного семейства; для конечного семейства функция строится индукцией и аксиома не нужна. От ZF аксиома независима (Гёдель, Коэн), но принимается — это буква C в [[zfc|ZFC]].

С ней не следует смешивать утверждение «из непустого $X$ можно удалить элемент и получить другое множество» ($X'=X\setminus\{x\}$, $X'\ne X$): оно доказуемо в чистом ZF из [[aksioma-vydeleniya|выделения]] и [[aksioma-ekstencionalnosti|экстенциональности]]. Различие в том, сколько раз производится выбор: там — один раз в одном множестве, здесь — согласованно во всём семействе сразу.`,
		related: ['zfc', 'aksioma-vydeleniya', 'aksioma-ekstencionalnosti']
	},

	bulean: {
		id: 'bulean',
		term: 'Булеан 2^X',
		short: String.raw`Множество всех подмножеств $X$; для конечного $X$ его мощность $2^{|X|}$.`,
		formula: String.raw`2^X=Y\iff(\forall x'\subset X:\ x'\in Y)\wedge(\forall y\in Y:\ y\subset X);\qquad \bigl|2^X\bigr|=2^{|X|}`,
		body: String.raw`**Булеан** $2^X$ — множество всех [[podmnozhestvo|подмножеств]] $X$. Определяется он двумя условиями: все подмножества $X$ в нём лежат и ничего постороннего в нём нет — без второго условия подошло бы любое надмножество булеана. Аксиома степени ZF4 даёт как раз объемлющее множество, а точный булеан вырезается из него [[aksioma-vydeleniya|выделением]]. Обозначение не метафора: для конечного $X$ мощность равна $2^{|X|}$, потому что каждый элемент независимо либо взят в подмножество, либо нет. В $2^X$ всегда лежат два «крайних» элемента — [[pustoe-mnozhestvo|$\varnothing$]] и сам $X$.

Булеан — несущая конструкция: бинарное отношение определяется как элемент булеана декартова квадрата ($R\subset S\times S$), топология — как $\tau\subset 2^S$, а теорема Кантора $|A|<|2^A|$ и башня $|A|<|2^A|<|2^{2^A}|<\ldots$ дают кардинальные числа $\aleph_0,\aleph_1,\ldots$`,
		related: ['podmnozhestvo', 'pustoe-mnozhestvo', 'zfc', 'sobstvennoe-podmnozhestvo']
	},

	'pustoe-mnozhestvo': {
		id: 'pustoe-mnozhestvo',
		term: 'Пустое множество ∅',
		short: String.raw`Множество без элементов; содержится в любом множестве, $|\varnothing|=0$.`,
		formula: String.raw`\varnothing\subset A\ \ \text{для любого }A,\qquad |\varnothing|=0`,
		body: String.raw`**Пустое множество** $\varnothing$ (пишут также $\{\ \}$) не содержит ни одного элемента; его существование постулирует ZF2, и оно же получается [[aksioma-vydeleniya|выделением]] по заведомо ложному предикату: $\varnothing=\{x\in A\mid x\ne x\}$.

Два базовых факта. Во-первых, $\varnothing\subset A$ для любого $A$ — доказывается через отсутствие контрпримера: опровержение требовало бы $x\in\varnothing$ и $x\notin A$, а первое невозможно. Отсюда же следует, что у $\varnothing$ нет [[sobstvennoe-podmnozhestvo|собственных подмножеств]]. Во-вторых, $\varnothing$ единственно: два пустых множества включены друг в друга [[vakuumnaya-istinnost|вакуумно]], значит равны по [[aksioma-ekstencionalnosti|ZF1]]. Наконец, $\varnothing$ конечно и $|\varnothing|=0$ — определение конечности через биекцию с $[1\ldots n]$ случай $n=0$ формально не покрывает, поэтому его задают отдельно.`,
		related: ['vakuumnaya-istinnost', 'podmnozhestvo', 'sobstvennoe-podmnozhestvo', 'aksioma-ekstencionalnosti']
	},

	podmnozhestvo: {
		id: 'podmnozhestvo',
		term: 'Подмножество (включение ⊂)',
		short: String.raw`$A\subset B$, если каждый элемент $A$ лежит в $B$; знак нестрогий.`,
		formula: String.raw`A\subset B\iff\forall x\in A:\ x\in B`,
		body: String.raw`**Включение** $A\subset B$ («$A$ — подмножество $B$») по определению есть $\forall x\in A:\ x\in B$; отрицание пишется $A\not\subset B$. Знак $\subset$ **нестрогий**: равенство допускается, а строгость оговаривается словом [[sobstvennoe-podmnozhestvo|«собственное»]]. Путать включение с принадлежностью $x\in B$ нельзя: одно связывает два множества, другое — элемент и множество, и объект вроде $\{\varnothing\}$ бывает и элементом, и подмножеством одновременно.

Включение транзитивно и антисимметрично (антисимметричность — это и есть теорема $(A\subset B)\wedge(B\subset A)\Rightarrow A=B$), поэтому оно является отношением порядка. Все подмножества $X$ разом собраны в [[bulean|булеане]] $2^X$.`,
		related: ['sobstvennoe-podmnozhestvo', 'aksioma-ekstencionalnosti', 'bulean', 'pustoe-mnozhestvo']
	},

	'sobstvennoe-podmnozhestvo': {
		id: 'sobstvennoe-podmnozhestvo',
		term: 'Собственное подмножество',
		short: String.raw`$A\subset B$ и при этом $A\ne B$.`,
		formula: String.raw`A\subset B\ \wedge\ A\ne B`,
		body: String.raw`**Собственным подмножеством** $B$ называется такое $A$, что $A\subset B$ и $A\ne B$. Термин нужен потому, что сам знак [[podmnozhestvo|$\subset$]] нестрогий и равенство не исключает.

Два крайних случая стоит держать в голове: у [[pustoe-mnozhestvo|пустого множества]] собственных подмножеств нет вовсе (единственное его подмножество — оно само), а для любого $A\ne\varnothing$ пустое множество является собственным подмножеством $A$. В [[bulean|булеане]] $2^X$ собственных подмножеств ровно $|2^X|-1$: все, кроме самого $X$.`,
		related: ['podmnozhestvo', 'pustoe-mnozhestvo', 'bulean']
	}
};
