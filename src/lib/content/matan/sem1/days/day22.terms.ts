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
		body: String.raw`**Покрытием** множества $X$ называют семейство $\{U_k\}_{k\in I}$, объединение которого содержит $X$. Мощность индексного множества $I$ ничем не ограничена: покрытие бывает конечным, счётным, континуальным. Производные от него понятия — [[otkrytoe-pokrytie|открытое покрытие]] и [[podpokrytie|подпокрытие]].`,
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
		body: String.raw`**Подпокрытие** получается прореживанием индексного множества исходного [[pokrytie|покрытия]]: берётся $K\subset I$, и требуется, чтобы выбранные множества по-прежнему накрывали $X$. Добавлять новые множества или подменять старые нельзя. Конечность подпокрытия записывают [[alef-nol|кардинальным неравенством]] $|K|<\aleph_0$.`,
		related: ['pokrytie', 'alef-nol', 'kompakt', 'borel-lebeg']
	},

	'borel-lebeg': {
		id: 'borel-lebeg',
		term: 'Теорема Бореля–Лебега',
		short: String.raw`Любой отрезок $[\alpha;\beta]\subset\mathbb R$ — компакт.`,
		formula: String.raw`\bigcup_{k\in I}U_k\supset[\alpha;\beta]\ \Rightarrow\ \exists I_n\subset I,\ |I_n|=n\in\mathbb N_0:\ \bigcup_{k\in I_n}U_k\supset[\alpha;\beta]`,
		body: String.raw`Теорема утверждает, что любой отрезок $[\alpha;\beta]\subset\mathbb R$ — [[kompakt|компакт]]: из всякого [[otkrytoe-pokrytie|открытого покрытия]] отрезка выделяется конечное подпокрытие. Конечность выражена как $|I_n|=n\in\mathbb N_0$ ([[n-nol-n-odin|ℕ₀ против ℕ₁]]), то есть доказательство обязано кончиться числом.`,
		related: ['otmechennaya-tochka', 'kompakt', 'geyne-borel', 'metrizuemost']
	},

	'otmechennaya-tochka': {
		id: 'otmechennaya-tochka',
		term: 'Отмеченная точка',
		short: String.raw`Точка $a$, для которой $[\alpha;a]$ уже покрыт конечным набором.`,
		formula: String.raw`a\ \text{отмечена}\iff \exists I_m\subset I,\ |I_m|<\aleph_0:\ \bigcup_{k\in I_m}U_k\supset[\alpha;a]`,
		body: String.raw`Точка $a\in[\alpha;\beta]$ **отмечена**, если начальный кусок $[\alpha;a]$ уже накрыт конечным поднабором исходного [[pokrytie|покрытия]] $\{U_k\}_{k\in I}$, то есть если для $[\alpha;a]$ [[podpokrytie|конечное подпокрытие]] уже построено: $\exists I_m\subset I$, $|I_m|<\aleph_0$, $\bigcup_{k\in I_m}U_k\supset[\alpha;a]$.`,
		related: ['pokrytie', 'podpokrytie', 'kompakt']
	},

	'geyne-borel': {
		id: 'geyne-borel',
		term: 'Теорема Гейне–Бореля',
		short: String.raw`В $\mathbb R^n$ компактность равносильна замкнутости с ограниченностью.`,
		formula: String.raw`X\subset\mathbb R^n:\quad X\ \text{компакт}\iff X\ \text{замкнуто и ограничено}`,
		body: String.raw`Для подмножеств $\mathbb R^n$ покрытийная [[kompakt|компактность]] равносильна ограниченности вместе с замкнутостью, то есть с условием $\mathrm{cl}\,X=X$ ([[zamykanie|замыкание]]). Равносильность привязана к $\mathbb R^n$: в произвольном метрическом пространстве от неё остаётся одна импликация — компакт замкнут и ограничен, но не наоборот, то есть [[priznak-i-svoystvo|свойство без признака]]. Различающий пример: $\mathbb Q\cap[0;2]$ замкнуто и ограничено в пространстве $\mathbb Q$, но некомпактно.`,
		related: ['kompakt', 'zamykanie', 'priznak-i-svoystvo', 'nekompaktnoe-mnozhestvo']
	},

	'nekompaktnoe-mnozhestvo': {
		id: 'nekompaktnoe-mnozhestvo',
		term: 'Некомпактное множество',
		short: String.raw`Есть покрытие, из которого конечное подпокрытие не выделяется.`,
		formula: String.raw`\exists\{U_i\}_{i\in I}\subset\tau:\ \bigcup_{i\in I}U_i\supset X,\quad \forall K\subset I,\ |K|<\aleph_0:\ \bigcup_{k\in K}U_k\not\supset X`,
		body: String.raw`Отрицание определения [[kompakt|компакта]] по правилу отрицания кванторов: чтобы опровергнуть компактность, достаточно **одного** покрытия-свидетеля. Рабочие примеры: $\mathbb R$ (покрытие $(-n;n)$), $\mathbb N_1$ (интервалы вокруг целых), $\mathbb Q$, полуинтервал $[0;1)$ и $\mathbb N_0$ с [[diskretnaya-topologiya|дискретной топологией]]. Механизмов отказа два: множество убегает на бесконечность либо утекает в недостающую точку.`,
		related: ['kompakt', 'otkrytoe-pokrytie', 'diskretnaya-topologiya', 'geyne-borel']
	},

	metrizuemost: {
		id: 'metrizuemost',
		term: 'Метризуемость',
		short: String.raw`Топология порождена метрикой: в любую окрестность влезает шар.`,
		formula: String.raw`x\in U\in\tau_\rho\ \Rightarrow\ \exists\varepsilon>0:\ B_\varepsilon(x)\subset U`,
		body: String.raw`Пространство метризуемо, если его топология индуцирована метрикой: шары образуют базу, и потому внутрь любой [[okrestnost|окрестности]] точки вписывается [[shar|шар]] с центром в ней — переход от абстрактного $U$ к интервалу $(\alpha-\varepsilon;\alpha+\varepsilon)$ законен только здесь.`,
		related: ['shar', 'okrestnost', 'borel-lebeg', 'metriki-rho']
	},

};
