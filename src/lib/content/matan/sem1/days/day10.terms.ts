import type { Glossary } from '$lib/types';

// Термины дня 10 (база топологии и сепарабельность). Понятия из канонического
// глоссария нотации (glossary.ts) здесь НЕ дублируются и подключаются
// перекрёстными ссылками [[...]]:
//   n-nol-n-odin, dopolnenie, zamykanie, vykolotaya-okrestnost, metriki-rho,
//   komponenta-svyaznosti, blacksquare.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя. Опорные понятия из соседних
// дней (окрестность, счётность, дискретная и тривиальная топологии)
// продублированы намеренно: день должен резолвиться независимо.
export const day10Terms: Glossary = {
	'baza-topologii': {
		id: 'baza-topologii',
		term: 'База топологии',
		short: String.raw`Набор открытых кирпичей, объединениями которых выражается любое открытое.`,
		formula: String.raw`\forall U\in\tau\ \ \exists\{k_j\}:\ U=\bigcup_j U_{k_j},\quad U_{k_j}\in\mathcal B`,
		body: String.raw`**Базой топологии** называют набор $\mathcal B=\{U_i\}\subset\tau$, объединениями элементов которого выражается любой элемент топологии: $\forall U\in\tau:\ U=\bigcup_j U_{k_j}$; число индексов произвольно — аксиома объединения конечности не требует. Включение $\mathcal B\subset\tau$ входит в определение: элементы базы обязаны быть открытыми. Пример в $\mathbb R$ — интервалы с рациональными концами, база [[topologiya-r|стандартной топологии]]; надстройка над базой — [[predbaza|предбаза]].`,
		related: ['predbaza', 'vtoraya-aksioma-schetnosti', 'topologiya-r', 'separabelnost']
	},

	predbaza: {
		id: 'predbaza',
		term: 'Предбаза',
		short: String.raw`Набор, конечные пересечения которого образуют базу.`,
		formula: String.raw`\mathcal B=\Bigl\{\textstyle\bigcap_{i=1}^{r}P_i:\ P_i\in\mathcal P\Bigr\}`,
		body: String.raw`**Предбаза** $\mathcal P\subset\tau$ — набор открытых множеств, конечные пересечения которых образуют [[baza-topologii|базу]]: от топологии предбаза отстоит на два шага — сначала конечные пересечения, потом произвольные объединения. Конечность здесь не украшение: бесконечное пересечение открытых открытым быть уже не обязано. В $\mathbb R$ предбазой служат лучи $(a;+\infty)$ и $(-\infty;b)$, их попарные пересечения дают все интервалы [[topologiya-r|стандартной топологии]].`,
		related: ['baza-topologii', 'topologiya-r']
	},

	'vtoraya-aksioma-schetnosti': {
		id: 'vtoraya-aksioma-schetnosti',
		term: 'Вторая аксиома счётности',
		short: String.raw`У пространства есть не более чем счётная база топологии.`,
		formula: String.raw`\exists\ \text{база}\ \mathcal B:\ |\mathcal B|\le\aleph_0`,
		body: String.raw`Пространство удовлетворяет **второй аксиоме счётности**, если у него есть не более чем [[schetnoe-mnozhestvo|счётная]] [[baza-topologii|база топологии]]. $\mathbb R$ ей удовлетворяет: базу дают интервалы с рациональными концами.`,
		related: ['baza-topologii', 'separabelnost', 'pryamaya-zorgenfreya']
	},

	'plotnoe-podmnozhestvo': {
		id: 'plotnoe-podmnozhestvo',
		term: 'Плотное подмножество',
		short: String.raw`A плотно в B, если каждая окрестность каждой точки B встречает A.`,
		formula: String.raw`A\ \text{плотно в}\ B\iff\forall b\in B\ \forall U_b:\ U_b\cap A\ne\varnothing`,
		body: String.raw`Плотность определяется **через окрестности**: $A$ плотно в $B$, если $\forall b\in B\ \forall U_b:\ U_b\cap A\ne\varnothing$ — какую точку $b\in B$ и какую её [[okrestnost|окрестность]] $U_b$ ни возьми, в этой окрестности есть точка из $A$. Окрестности берутся в объемлющем пространстве, а не открытые куски самого $B$: иначе равносильность с $B\subset\mathrm{cl}\,A$ ломается уже на $A=(0;1)$, $B=\{0\}$. Равносильная запись — через [[zamykanie|замыкание]]: $B\subset\mathrm{cl}\,A$, см. [[kriteriy-plotnogo-podmnozhestva|критерий плотного подмножества]].`,
		related: ['vsyudu-plotnoe', 'kriteriy-plotnogo-podmnozhestva', 'okrestnost', 'zamykanie']
	},

	'vsyudu-plotnoe': {
		id: 'vsyudu-plotnoe',
		term: 'Всюду плотное множество',
		short: String.raw`Плотное во всём пространстве: любая непустая окрестность его встречает.`,
		formula: String.raw`\forall U_t\in\tau,\ U_t\ne\varnothing:\ U_t\cap A\ne\varnothing`,
		body: String.raw`**Всюду плотное** множество — [[plotnoe-podmnozhestvo|плотное]] во всём пространстве, а не в какой-то его части: всякая непустая окрестность $U_t$ пересекается с $A$. Канонический пример — $\mathbb Q$ в $\mathbb R$ ([[plotnost-q-v-r|плотность $\mathbb Q$]]), а в $\mathbb R^n$ — множество $\mathbb Q^n$. В [[diskretnaya-topologiya|дискретной топологии]] всюду плотно только само пространство, в тривиальной — любое непустое подмножество.`,
		related: ['plotnoe-podmnozhestvo', 'separabelnost', 'plotnost-q-v-r', 'diskretnaya-topologiya']
	},

	separabelnost: {
		id: 'separabelnost',
		term: 'Сепарабельность',
		short: String.raw`Существует не более чем счётное всюду плотное подмножество.`,
		formula: String.raw`\exists A\subset T:\ |A|\le\aleph_0,\ A\ \text{всюду плотно в}\ T`,
		body: String.raw`Пространство $T$ **сепарабельно**, если в нём есть не более чем счётное [[vsyudu-plotnoe|всюду плотное]] подмножество: $\mathbb R$ сепарабельно (годится $\mathbb Q$), $\mathbb R^n$ тоже ($\mathbb Q^n$). Не путать со [[vtoraya-aksioma-schetnosti|второй аксиомой счётности]]: там счётность требуется от [[baza-topologii|базы]], здесь — от множества точек.`,
		related: ['vsyudu-plotnoe', 'vtoraya-aksioma-schetnosti', 'pryamaya-zorgenfreya', 'baza-topologii']
	},

	'kriteriy-plotnogo-podmnozhestva': {
		id: 'kriteriy-plotnogo-podmnozhestva',
		term: 'Критерий плотного подмножества',
		short: String.raw`A плотно в B тогда и только тогда, когда B содержится в cl A.`,
		formula: String.raw`A\ \text{плотно в}\ B\iff B\subset\operatorname{cl}A`,
		body: String.raw`**Критерий плотного подмножества**: $A$ плотно в $B$ тогда и только тогда, когда $B\subset\mathrm{cl}\,A$. Это мост между двумя записями плотности — через окрестности ([[plotnoe-podmnozhestvo|плотное подмножество]]) и через [[zamykanie|замыкание]].`,
		related: ['plotnoe-podmnozhestvo', 'zamykanie', 'vsyudu-plotnoe']
	},

	'pryamaya-zorgenfreya': {
		id: 'pryamaya-zorgenfreya',
		term: 'Прямая Зоргенфрея',
		short: String.raw`ℝ с базой из полуинтервалов [a;b): сепарабельна, но счётной базы нет.`,
		formula: String.raw`\mathcal B_\ell=\{[a;b):\ a<b\}`,
		body: String.raw`**Прямая Зоргенфрея** $\mathbb R_\ell$ — множество $\mathbb R$ с топологией, базу которой образуют полуинтервалы $[a;b)$. Она [[separabelnost|сепарабельна]] ($\mathbb Q$ встречает всякий $[a;b)$), но [[vtoraya-aksioma-schetnosti|счётной базы]] не имеет и не метризуема.`,
		related: ['separabelnost', 'vtoraya-aksioma-schetnosti', 'topologiya-r']
	},

	'plotnost-q-v-r': {
		id: 'plotnost-q-v-r',
		term: 'Плотность ℚ в ℝ',
		short: String.raw`Между любыми двумя вещественными числами есть рациональное.`,
		formula: String.raw`\forall a<b\ \ \exists q\in\mathbb Q:\ a<q<b`,
		body: String.raw`**Плотность $\mathbb Q$ в $\mathbb R$**: в любом интервале $(a;b)$ найдётся рациональное число, $\forall a<b\ \exists q\in\mathbb Q:\ a<q<b$. Отсюда [[vsyudu-plotnoe|всюду плотность]] $\mathbb Q$ в [[topologiya-r|стандартной топологии]] $\mathbb R$.`,
		related: ['vsyudu-plotnoe', 'separabelnost', 'topologiya-r']
	},

};
