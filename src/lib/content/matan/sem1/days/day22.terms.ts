import type { Glossary } from '$lib/types';

// =====================================================================
//  День 22 — компактность и теорема Бореля–Лебега.
//  Термины, уже введённые в предыдущих днях (открытое множество,
//  окрестность, шар, метризуемость, дискретная топология), продублированы
//  здесь намеренно: день должен резолвиться независимо от порядка сборки.
//  Канонический глоссарий склеивается последним и перекрывает совпадения.
// =====================================================================

export const day22Terms: Glossary = {
	pokrytie: {
		id: 'pokrytie',
		term: 'Покрытие',
		short: String.raw`Семейство множеств, объединение которых накрывает $X$.`,
		formula: String.raw`\bigcup_{k\in I}U_k\supset X`,
		body: String.raw`**Покрытием** множества $X$ называют семейство $\{U_k\}_{k\in I}$, объединение которого содержит $X$. Мощность индексного множества $I$ ничем не ограничена: покрытие бывает конечным, счётным, континуальным. Само по себе понятие бессодержательно — работать оно начинает, когда элементы требуют [[otkrytoe-pokrytie|открытыми]] и пытаются выделить [[podpokrytie|подпокрытие]].`,
		related: ['otkrytoe-pokrytie', 'podpokrytie', 'kompakt']
	},

	'otkrytoe-pokrytie': {
		id: 'otkrytoe-pokrytie',
		term: 'Открытое покрытие',
		short: String.raw`Покрытие, все элементы которого лежат в топологии $\tau$.`,
		formula: String.raw`U_k\in\tau,\qquad \bigcup_{k\in I}U_k\supset X`,
		body: String.raw`[[pokrytie|Покрытие]] называется **открытым**, если каждый его элемент — [[otkrytoe-mnozhestvo|открытое множество]]. Требование открытости обязательно: без него определение [[kompakt|компакта]] вырождается, поскольку любое множество покрывается одним элементом — самим собой, и конечное подпокрытие находилось бы даром.`,
		related: ['pokrytie', 'otkrytoe-mnozhestvo', 'kompakt']
	},

	podpokrytie: {
		id: 'podpokrytie',
		term: 'Подпокрытие',
		short: String.raw`Покрытие из элементов исходного; конечность пишется как $|K|<\aleph_0$.`,
		formula: String.raw`K\subset I,\ |K|<\aleph_0:\quad \bigcup_{k\in K}U_{\alpha_k}\supset X`,
		body: String.raw`**Подпокрытие** получается прореживанием индексного множества исходного [[pokrytie|покрытия]]: берётся $K\subset I$, и требуется, чтобы выбранные множества по-прежнему накрывали $X$. Добавлять новые множества или подменять старые нельзя. Конечность подпокрытия записывают [[alef-nol|кардинальным неравенством]] $|K|<\aleph_0$, а в формулировке [[borel-lebeg|Бореля–Лебега]] — равенством $|I_n|=n\in\mathbb N_0$, то есть числом, которое доказательство обязано предъявить.`,
		related: ['pokrytie', 'alef-nol', 'kompakt', 'borel-lebeg']
	},

	kompakt: {
		id: 'kompakt',
		term: 'Компакт',
		short: String.raw`Из любого открытого покрытия выделяется конечное подпокрытие.`,
		formula: String.raw`\forall\{U_{\alpha_i}\}_{i\in I}\subset\tau:\ \bigcup_{i\in I}U_{\alpha_i}\supset X\ \Rightarrow\ \exists K\subset I,\ |K|<\aleph_0:\ \bigcup_{k\in K}U_{\alpha_k}\supset X`,
		body: String.raw`**Компакт** — подмножество топологического пространства, в котором для любого [[otkrytoe-pokrytie|открытого покрытия]] существует конечное [[podpokrytie|подпокрытие]]. Определение работает сразу в топологическом пространстве, без метрики и ограниченности; для $\mathbb R^n$ равносильность с «замкнуто и ограничено» — [[geyne-borel|теорема Гейне–Бореля]]. Порядок кванторов решает всё: компактность — про все покрытия сразу, а опровергается одним покрытием-свидетелем.`,
		related: ['otkrytoe-pokrytie', 'podpokrytie', 'geyne-borel', 'nekompaktnoe-mnozhestvo']
	},

	'borel-lebeg': {
		id: 'borel-lebeg',
		term: 'Теорема Бореля–Лебега',
		short: String.raw`Любой отрезок $[\alpha;\beta]\subset\mathbb R$ — компакт.`,
		formula: String.raw`\bigcup_{k\in I}U_k\supset[\alpha;\beta]\ \Rightarrow\ \exists I_n\subset I,\ |I_n|=n\in\mathbb N_0:\ \bigcup_{k\in I_n}U_k\supset[\alpha;\beta]`,
		body: String.raw`Теорема утверждает, что отрезок — [[kompakt|компакт]]. Доказательство методом [[otmechennaya-tochka|отмеченных точек]] («продвижение вправо» шагами $\varepsilon_i/2$) завершается супремумом множества отмеченных точек и потому опирается на полноту $\mathbb R$; альтернативный путь — деление отрезка пополам с леммой о вложенных отрезках. Конечность подпокрытия выражена как $|I_n|=n\in\mathbb N_0$ ([[n-nol-n-odin|ℕ₀ против ℕ₁]]), то есть доказательство обязано кончиться числом.`,
		related: ['otmechennaya-tochka', 'kompakt', 'geyne-borel', 'metrizuemost']
	},

	'otmechennaya-tochka': {
		id: 'otmechennaya-tochka',
		term: 'Отмеченная точка',
		short: String.raw`Точка $a$, для которой $[\alpha;a]$ уже покрыт конечным набором.`,
		formula: String.raw`a\ \text{отмечена}\iff \exists I_m\subset I,\ |I_m|<\aleph_0:\ \bigcup_{k\in I_m}U_k\supset[\alpha;a]`,
		body: String.raw`Рабочее понятие доказательства [[borel-lebeg|теоремы Бореля–Лебега]]. База: $\alpha$ отмечена. Шаг: если $a$ отмечена, то по [[metrizuemost|метризуемости]] $\mathbb R$ в накрывающую $a$ окрестность вписывается интервал $(a-\varepsilon;a+\varepsilon)$, и отмеченной оказывается точка $a+\varepsilon/2$. Аккуратное завершение марша — не через $\min$ по ещё не конечному набору радиусов, а через супремум множества отмеченных точек.`,
		related: ['borel-lebeg', 'podpokrytie', 'metrizuemost']
	},

	'geyne-borel': {
		id: 'geyne-borel',
		term: 'Теорема Гейне–Бореля',
		short: String.raw`В $\mathbb R^n$ компактность равносильна замкнутости с ограниченностью.`,
		formula: String.raw`X\subset\mathbb R^n:\quad X\ \text{компакт}\iff X\ \text{замкнуто и ограничено}`,
		body: String.raw`Для подмножеств $\mathbb R^n$ покрытийная [[kompakt|компактность]] равносильна ограниченности вместе с замкнутостью, то есть с условием $\mathrm{cl}\,X=X$ ([[zamykanie|замыкание]]). Равносильность привязана к $\mathbb R^n$: в произвольном метрическом пространстве от неё остаётся одна импликация — компакт замкнут и ограничен, но не наоборот, то есть [[priznak-i-svoystvo|свойство без признака]]. Различающий пример: $\mathbb Q\cap[0;2]$ замкнуто и ограничено в пространстве $\mathbb Q$, но некомпактно.`,
		related: ['kompakt', 'zamykanie', 'priznak-i-svoystvo', 'nekompaktnoe-mnozhestvo']
	},

	'alef-nol': {
		id: 'alef-nol',
		term: 'Запись конечности через ℵ₀',
		short: String.raw`$|K|<\aleph_0$ — запись слова «конечно» на языке мощностей.`,
		formula: String.raw`|K|<\aleph_0\iff K\ \text{конечно}`,
		body: String.raw`$\aleph_0$ — мощность счётного множества, поэтому «$|K|<\aleph_0$» означает ровно «$K$ конечно»; в таком виде конечность [[podpokrytie|подпокрытия]] входит в определение [[kompakt|компакта]]. Мощность континуума записывается $2^{\aleph_0}=\mathfrak c$; равенство $\mathfrak c=\aleph_1$ — это континуум-гипотеза, не выводимая из аксиом теории множеств.`,
		related: ['podpokrytie', 'kompakt', 'n-nol-n-odin']
	},

	'nekompaktnoe-mnozhestvo': {
		id: 'nekompaktnoe-mnozhestvo',
		term: 'Некомпактное множество',
		short: String.raw`Есть покрытие, из которого конечное подпокрытие не выделяется.`,
		formula: String.raw`\exists\{U_i\}_{i\in I}\subset\tau:\ \bigcup_{i\in I}U_i\supset X,\quad \forall K\subset I,\ |K|<\aleph_0:\ \bigcup_{k\in K}U_k\not\supset X`,
		body: String.raw`Отрицание определения [[kompakt|компакта]] по правилу отрицания кванторов: чтобы опровергнуть компактность, достаточно **одного** покрытия-свидетеля. Рабочие примеры: $\mathbb R$ (покрытие $(-n;n)$), $\mathbb N_1$ (интервалы вокруг целых), $\mathbb Q$, полуинтервал $[0;1)$ и $\mathbb N_0$ с [[diskretnaya-topologiya|дискретной топологией]]. Механизмов отказа два: множество убегает на бесконечность либо утекает в недостающую точку.`,
		related: ['kompakt', 'otkrytoe-pokrytie', 'diskretnaya-topologiya', 'geyne-borel']
	},

	'otkrytoe-mnozhestvo': {
		id: 'otkrytoe-mnozhestvo',
		term: 'Открытое множество',
		short: String.raw`$U\in\tau$; равносильно — $U$ не содержит своих граничных точек.`,
		formula: String.raw`U\in\tau\iff \partial U\cap U=\varnothing`,
		body: String.raw`Открытые множества — это элементы топологии $\tau$. Равносильная переформулировка через границу: $\partial U\cap U=\varnothing$ (у замкнутого наоборот, $\partial U\subset U$). [[dopolnenie|Дополнение]] открытого множества замкнуто, причём черта сверху обозначает именно дополнение, а замыкание пишется $\mathrm{cl}\,A$. Элементы [[otkrytoe-pokrytie|открытого покрытия]] берутся именно из $\tau$.`,
		related: ['otkrytoe-pokrytie', 'dopolnenie', 'okrestnost']
	},

	okrestnost: {
		id: 'okrestnost',
		term: 'Окрестность точки',
		short: String.raw`$U_x$ — любой элемент топологии, содержащий $x$.`,
		formula: String.raw`U_x\in\tau,\quad x\in U_x`,
		body: String.raw`**Окрестностью** точки $x$ называют любое [[otkrytoe-mnozhestvo|открытое множество]], содержащее $x$; никакой «малости» в определении нет. Рядом с ней работает [[vykolotaya-okrestnost|выколотая окрестность]] $\mathring U_x$. В доказательстве [[borel-lebeg|Бореля–Лебега]] окрестность — это тот элемент покрытия, который накрыл текущую отмеченную точку, и в него по [[metrizuemost|метризуемости]] вписывается шар.`,
		related: ['otkrytoe-mnozhestvo', 'vykolotaya-okrestnost', 'shar']
	},

	shar: {
		id: 'shar',
		term: 'Открытый шар',
		short: String.raw`$B_r(x_0)$ — точки на расстоянии строго меньше $r$.`,
		formula: String.raw`B_r(x_0)=\{x\in M:\ \rho(x,x_0)<r\}`,
		body: String.raw`**Открытый шар** в метрическом пространстве $(M,\rho)$ — множество точек, удалённых от центра меньше чем на $r$. В $\mathbb R$ со стандартной метрикой это интервал $(x_0-r;\,x_0+r)$ — тот самый, который вписывается в [[okrestnost|окрестность]] в доказательстве Бореля–Лебега. Встречаются обе записи, $B_r(x_0)$ и $B_{x_0}(r)$; здесь нижним индексом стоит радиус, а центр — в скобках. Форма шара зависит от метрики: в $\rho_\infty$ из семейства [[metriki-rho|ρ₁, ρ₂, ρₖ, ρ∞]] шары — кубы.`,
		related: ['metrizuemost', 'metriki-rho', 'okrestnost']
	},

	metrizuemost: {
		id: 'metrizuemost',
		term: 'Метризуемость',
		short: String.raw`Топология порождена метрикой: в любую окрестность влезает шар.`,
		formula: String.raw`x\in U\in\tau_\rho\ \Rightarrow\ \exists\varepsilon>0:\ B_\varepsilon(x)\subset U`,
		body: String.raw`Пространство метризуемо, если его топология индуцирована метрикой: шары образуют базу, и потому внутрь любой [[okrestnost|окрестности]] точки вписывается [[shar|шар]] с центром в ней. В доказательстве [[borel-lebeg|Бореля–Лебега]] этим переходом абстрактное $U_\alpha$ заменяется на интервал $(\alpha-\varepsilon;\alpha+\varepsilon)$. Без метризуемости шага с $\varepsilon$ не существует, и метод отмеченных точек не запускается.`,
		related: ['shar', 'okrestnost', 'borel-lebeg', 'metriki-rho']
	},

	'diskretnaya-topologiya': {
		id: 'diskretnaya-topologiya',
		term: 'Дискретная топология',
		short: String.raw`$\tau=2^{S}$ — открыто всё, включая каждую точку.`,
		formula: String.raw`\tau=2^{S}`,
		body: String.raw`Самая богатая топология на множестве: открыто каждое подмножество, в том числе каждое одноточечное. Отсюда мгновенно следует описание компактов: покрытие одноточечными множествами не имеет конечного подпокрытия ни у какого бесконечного множества, поэтому [[kompakt|компакты]] дискретного пространства — в точности конечные множества, например $\mathbb N_0$ компактом не является. Это предельный случай: чем богаче топология, тем меньше в ней компактов.`,
		related: ['otkrytoe-mnozhestvo', 'kompakt', 'nekompaktnoe-mnozhestvo']
	}
};
