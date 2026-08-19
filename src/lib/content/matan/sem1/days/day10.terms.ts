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
		body: String.raw`**Базой топологии** называют набор $\mathcal B=\{U_i\}\subset\tau$, объединениями элементов которого выражается любой элемент топологии: $\forall U\in\tau:\ U=\bigcup_j U_{k_j}$. Число индексов произвольно — аксиома объединения конечности не требует, и именно на этом база держится.

Включение $\mathcal B\subset\tau$ входит в определение: элементы базы обязаны быть открытыми, иначе их объединение не обязано попадать в $\tau$. Классический пример в $\mathbb R$ — интервалы с рациональными концами, база [[topologiya-r|стандартной топологии]]; из счётности такой базы следует [[separabelnost|сепарабельность]].`,
		related: ['predbaza', 'vtoraya-aksioma-schetnosti', 'topologiya-r', 'separabelnost']
	},

	predbaza: {
		id: 'predbaza',
		term: 'Предбаза',
		short: String.raw`Набор, конечные пересечения которого образуют базу.`,
		formula: String.raw`\mathcal B=\Bigl\{\textstyle\bigcap_{i=1}^{r}P_i:\ P_i\in\mathcal P\Bigr\}`,
		body: String.raw`**Предбаза** $\mathcal P\subset\tau$ — набор открытых множеств, конечные пересечения которых образуют [[baza-topologii|базу]]. То есть предбаза отстоит от топологии на два шага: сначала конечные пересечения, потом произвольные объединения.

Конечность здесь не украшение, а та же асимметрия аксиом топологии: бесконечное пересечение открытых открытым быть уже не обязано. В $\mathbb R$ предбазой служат лучи $(a;+\infty)$ и $(-\infty;b)$ — их попарные пересечения дают все интервалы, а значит и всю [[topologiya-r|стандартную топологию]].`,
		related: ['baza-topologii', 'topologiya-r']
	},

	'vtoraya-aksioma-schetnosti': {
		id: 'vtoraya-aksioma-schetnosti',
		term: 'Вторая аксиома счётности',
		short: String.raw`У пространства есть не более чем счётная база топологии.`,
		formula: String.raw`\exists\ \text{база}\ \mathcal B:\ |\mathcal B|\le\aleph_0`,
		body: String.raw`Пространство удовлетворяет **второй аксиоме счётности**, если у него есть не более чем [[schetnoe-mnozhestvo|счётная]] [[baza-topologii|база топологии]]. $\mathbb R$ ей удовлетворяет: интервалы с рациональными концами.

Из второй аксиомы счётности всегда следует [[separabelnost|сепарабельность]] — это лёгкое направление, оно доказывается выбором по одной точке из каждого элемента базы. Обратное верно только в метрических пространствах: [[pryamaya-zorgenfreya|прямая Зоргенфрея]] сепарабельна, но счётной базы не имеет.`,
		related: ['baza-topologii', 'separabelnost', 'pryamaya-zorgenfreya']
	},

	'plotnoe-podmnozhestvo': {
		id: 'plotnoe-podmnozhestvo',
		term: 'Плотное подмножество',
		short: String.raw`A плотно в B, если каждая окрестность каждой точки B встречает A.`,
		formula: String.raw`A\ \text{плотно в}\ B\iff\forall b\in B\ \forall U_b:\ U_b\cap A\ne\varnothing`,
		body: String.raw`Плотность определяется **через окрестности**: $A$ плотно в $B$, если $\forall b\in B\ \forall U_b:\ U_b\cap A\ne\varnothing$ — какую точку $b\in B$ и какую её [[okrestnost|окрестность]] $U_b$ ни возьми, в этой окрестности есть точка из $A$. Окрестности берутся в объемлющем пространстве, а не открытые куски самого $B$: иначе равносильность с $B\subset\mathrm{cl}\,A$ ломается уже на $A=(0;1)$, $B=\{0\}$.

Равносильная запись идёт через [[zamykanie|замыкание]]: $B\subset\mathrm{cl}\,A$, см. [[kriteriy-plotnogo-podmnozhestva|критерий плотного подмножества]]. Обе работают, но версия с окрестностями делает доказательство «счётная база влечёт сепарабельность» одношаговым: предъявлена окрестность, предъявлена в ней точка — всё.`,
		related: ['vsyudu-plotnoe', 'kriteriy-plotnogo-podmnozhestva', 'okrestnost', 'zamykanie']
	},

	'vsyudu-plotnoe': {
		id: 'vsyudu-plotnoe',
		term: 'Всюду плотное множество',
		short: String.raw`Плотное во всём пространстве: любая непустая окрестность его встречает.`,
		formula: String.raw`\forall U_t\in\tau,\ U_t\ne\varnothing:\ U_t\cap A\ne\varnothing`,
		body: String.raw`**Всюду плотное** множество — [[plotnoe-podmnozhestvo|плотное]] во всём пространстве, а не в какой-то его части: всякая непустая окрестность $U_t$ пересекается с $A$. Канонический пример — $\mathbb Q$ в $\mathbb R$ ([[plotnost-q-v-r|плотность $\mathbb Q$]]), а в $\mathbb R^n$ — множество $\mathbb Q^n$.

Существование **счётного** всюду плотного множества и есть [[separabelnost|сепарабельность]]. В [[diskretnaya-topologiya|дискретной топологии]] всюду плотно только само пространство, в тривиальной — любое непустое подмножество.`,
		related: ['plotnoe-podmnozhestvo', 'separabelnost', 'plotnost-q-v-r', 'diskretnaya-topologiya']
	},

	separabelnost: {
		id: 'separabelnost',
		term: 'Сепарабельность',
		short: String.raw`Существует не более чем счётное всюду плотное подмножество.`,
		formula: String.raw`\exists A\subset T:\ |A|\le\aleph_0,\ A\ \text{всюду плотно в}\ T`,
		body: String.raw`Пространство $T$ **сепарабельно**, если в нём есть не более чем счётное [[vsyudu-plotnoe|всюду плотное]] подмножество. Содержательно это означает наличие счётного скелета: несчётное пространство описывается счётным списком точек с любой наперёд заданной точностью.

$\mathbb R$ сепарабельно (годится $\mathbb Q$), $\mathbb R^n$ тоже ($\mathbb Q^n$). Из [[vtoraya-aksioma-schetnosti|счётной базы]] сепарабельность следует всегда и в любом топологическом пространстве; обратное — только в метрических, контрпример — [[pryamaya-zorgenfreya|прямая Зоргенфрея]].`,
		related: ['vsyudu-plotnoe', 'vtoraya-aksioma-schetnosti', 'pryamaya-zorgenfreya', 'baza-topologii']
	},

	'kriteriy-plotnogo-podmnozhestva': {
		id: 'kriteriy-plotnogo-podmnozhestva',
		term: 'Критерий плотного подмножества',
		short: String.raw`A плотно в B тогда и только тогда, когда B содержится в cl A.`,
		formula: String.raw`A\ \text{плотно в}\ B\iff B\subset\operatorname{cl}A`,
		body: String.raw`**Критерий плотного подмножества**: $A$ плотно в $B$ тогда и только тогда, когда $B\subset\mathrm{cl}\,A$. Он держится на том, что точка лежит в [[zamykanie|замыкании]] $A$ ровно тогда, когда каждая её окрестность встречает $A$.

Это мост между двумя записями плотности — через окрестности ([[plotnoe-podmnozhestvo|плотное подмножество]]) и через замыкание. Обе работают, но удобны в разных ситуациях: критерий — когда замыкание уже посчитано, определение через окрестности — когда нужно быстро предъявить точку внутри данной окрестности.`,
		related: ['plotnoe-podmnozhestvo', 'zamykanie', 'vsyudu-plotnoe']
	},

	'pryamaya-zorgenfreya': {
		id: 'pryamaya-zorgenfreya',
		term: 'Прямая Зоргенфрея',
		short: String.raw`ℝ с базой из полуинтервалов [a;b): сепарабельна, но счётной базы нет.`,
		formula: String.raw`\mathcal B_\ell=\{[a;b):\ a<b\}`,
		body: String.raw`**Прямая Зоргенфрея** $\mathbb R_\ell$ — множество $\mathbb R$ с топологией, базу которой образуют полуинтервалы $[a;b)$. Она [[separabelnost|сепарабельна]] ($\mathbb Q$ встречает всякий $[a;b)$), но [[vtoraya-aksioma-schetnosti|счётной базы]] не имеет: любой базисный элемент, накрывающий точку $a$ внутри $[a;a+1)$, обязан иметь $\inf=a$, а значит разным точкам отвечают разные элементы — при том, что точек континуум.

Это контрпример к утверждению «сепарабельность влечёт счётную базу» в произвольном топологическом пространстве. Метризуемой $\mathbb R_\ell$ не является — иначе такой контрпример был бы невозможен.`,
		related: ['separabelnost', 'vtoraya-aksioma-schetnosti', 'topologiya-r']
	},

	'topologiya-r': {
		id: 'topologiya-r',
		term: 'Стандартная топология на ℝ',
		short: String.raw`Открытые множества — всевозможные объединения интервалов.`,
		formula: String.raw`\tau_{\mathbb R}=\Bigl\{\textstyle\bigcup_j (a_j;b_j)\Bigr\}`,
		body: String.raw`**Стандартная топология на $\mathbb R$** объявляет открытыми всевозможные объединения интервалов $(a;b)$. Она индуцирована модулем разности как [[metriki-rho|метрикой]]: шар $B_r(x)$ здесь — это интервал $(x-r;x+r)$.

У неё есть счётная [[baza-topologii|база]] из интервалов с рациональными концами, откуда $\mathbb R$ [[separabelnost|сепарабельно]]. Пересечение открытых остаётся открытым только для конечных наборов: $\bigcap_{n\in\mathbb N_1}(-1/n;1/n)=\{0\}$, а одноточечное множество здесь не открыто.`,
		related: ['baza-topologii', 'okrestnost', 'metriki-rho', 'plotnost-q-v-r']
	},

	'plotnost-q-v-r': {
		id: 'plotnost-q-v-r',
		term: 'Плотность ℚ в ℝ',
		short: String.raw`Между любыми двумя вещественными числами есть рациональное.`,
		formula: String.raw`\forall a<b\ \ \exists q\in\mathbb Q:\ a<q<b`,
		body: String.raw`**Плотность $\mathbb Q$ в $\mathbb R$**: в любом интервале $(a;b)$ найдётся рациональное число. Конструктивное доказательство идёт по десятичным разрядам: шаг вверх $y=\bigl(\lfloor x/\varepsilon\rfloor+1\bigr)\cdot\varepsilon$ с рациональным шагом $\varepsilon$ даёт рациональное число строго правее $x$ и не дальше чем на $\varepsilon$.

Через принцип Архимеда (день 5) то же самое делается в две строки: берём $n>\frac{1}{b-a}$ и $m=\lfloor na\rfloor+1$, тогда $a<\frac mn\le a+\frac1n<b$. Отсюда сразу [[vsyudu-plotnoe|всюду плотность]] $\mathbb Q$ и [[separabelnost|сепарабельность]] $\mathbb R$.`,
		related: ['vsyudu-plotnoe', 'separabelnost', 'topologiya-r']
	},

	okrestnost: {
		id: 'okrestnost',
		term: 'Окрестность точки',
		short: String.raw`Любой элемент топологии, содержащий данную точку.`,
		formula: String.raw`U_x\in\tau,\qquad x\in U_x`,
		body: String.raw`**Окрестность** точки $x$ — это любой элемент топологии, содержащий $x$. Никакой «малости» не требуется: само пространство тоже окрестность каждой своей точки. Обозначение — $U_x$, версия без самой точки — [[vykolotaya-okrestnost|выколотая окрестность]] $\mathring U_x$.

Через окрестности записываются определения [[plotnoe-podmnozhestvo|плотности]], предела и непрерывности, поэтому проверка «пересечение с $A$ непусто» — сквозной рабочий приём, а не разовый трюк одной темы.`,
		related: ['plotnoe-podmnozhestvo', 'vykolotaya-okrestnost', 'baza-topologii']
	},

	'schetnoe-mnozhestvo': {
		id: 'schetnoe-mnozhestvo',
		term: 'Счётное множество',
		short: String.raw`Равномощно ℕ₁; произведение и объединение счётных снова счётны.`,
		formula: String.raw`|A|=\aleph_0\iff A\leftrightarrow\mathbb N_1`,
		body: String.raw`Множество **счётно**, если равномощно [[n-nol-n-odin|$\mathbb N_1$]]; «не более чем счётно» — конечно или счётно. Рабочие факты дня 3: образ счётного не более чем счётен, произведение двух счётных счётно (отсюда счётность $\mathbb Q$), счётное объединение счётных счётно.

На них держится вся тема: [[baza-topologii|база]] из интервалов $(q_1,q_2)$ счётна как подмножество $\mathbb Q\times\mathbb Q$, а выбор по одной точке из каждого элемента счётной базы даёт счётное всюду плотное множество.`,
		related: ['baza-topologii', 'separabelnost', 'plotnost-q-v-r']
	},

	'diskretnaya-topologiya': {
		id: 'diskretnaya-topologiya',
		term: 'Дискретная топология',
		short: String.raw`τ = 2^S: открыто каждое подмножество.`,
		formula: String.raw`\tau=2^{S}`,
		body: String.raw`**Дискретная топология** — максимальная возможная: открыто каждое подмножество, $\tau=2^S$. Каждая точка сама себе [[okrestnost|окрестность]], поэтому [[vsyudu-plotnoe|всюду плотно]] только само $S$: любое $A\ne S$ промахивается мимо окрестности $\{x\}$ для $x\notin A$.

Прямое следствие: такое пространство [[separabelnost|сепарабельно]] тогда и только тогда, когда $S$ не более чем счётно. Дискретное $\mathbb R$ не сепарабельно и счётной [[baza-topologii|базы]] не имеет — база обязана содержать все одноточечные множества.`,
		related: ['trivialnaya-topologiya', 'separabelnost', 'okrestnost', 'baza-topologii']
	},

	'trivialnaya-topologiya': {
		id: 'trivialnaya-topologiya',
		term: 'Тривиальная топология',
		short: String.raw`τ = {∅, S}: минимальная топология, сепарабельна всегда.`,
		formula: String.raw`\tau=\{\varnothing,\ S\}`,
		body: String.raw`**Тривиальная (антидискретная) топология** — минимальная: открыты только $\varnothing$ и само $S$. Единственная непустая [[okrestnost|окрестность]] — это $S$, поэтому [[vsyudu-plotnoe|всюду плотно]] любое непустое подмножество, включая одноточечное.

Значит такое пространство [[separabelnost|сепарабельно]] всегда, каким бы огромным ни было $S$, а [[baza-topologii|база]] у него состоит из одного элемента. Пара «тривиальная — [[diskretnaya-topologiya|дискретная]]» — стандартный тест на любое топологическое свойство: свойство, одинаковое на обоих концах, ничего не различает.`,
		related: ['diskretnaya-topologiya', 'separabelnost', 'baza-topologii', 'okrestnost']
	}
};
