import type { Glossary } from '$lib/types';

// Термины дня 18: предельные и изолированные точки, плотность.
// Карточки okrestnost, granica, vnutrennost, topologicheskoe-prostranstvo
// и predelnaya-tochka продублированы из дней 6, 11 и 23 намеренно: день
// должен резолвиться независимо от того, открыты ли предыдущие. Из общего
// глоссария НЕ переобъявляются и используются только ссылками:
//   n-nol-n-odin, dopolnenie, zamykanie, vykolotaya-okrestnost,
//   komponenta-svyaznosti, metriki-rho, end-r, skalyarnoe-pole, lso,
//   asimptoticheskie-klassy, skhodyashchayasya-v-sebe,
//   chastichnaya-posledovatelnost, priznak-i-svoystvo, blacksquare.
export const day18Terms: Glossary = {
	'predelnaya-tochka': {
		id: 'predelnaya-tochka',
		term: 'Предельная точка множества',
		short: String.raw`Любая ВЫКОЛОТАЯ окрестность задевает множество.`,
		formula: String.raw`x\in A'\iff\forall\mathring U_x:\ \mathring U_x\cap A\ne\varnothing`,
		body: String.raw`$x$ — **предельная точка** множества $A$, если каждая [[vykolotaya-okrestnost|выколотая окрестность]] $\mathring U_x$ пересекает $A$. Определение формулируется сразу в [[topologicheskoe-prostranstvo|топологическом пространстве]] $(T,\tau)$, без метрики и без $\varepsilon$.

Принадлежность $x$ множеству $A$ роли не играет: у $[5;7)$ предельными оказываются и $5$, и $7$. Именно выколотость порождает отдельный класс [[izolirovannaya-tochka|изолированных точек]] и делает верным равенство $\operatorname{cl}A=A'\cup\operatorname{Isol}(A)$. Отрицание, которым пользуются в доказательствах: $x$ не предельная $\iff$ $\exists U_x:\ U_x\cap A\subset\{x\}$.`,
		related: ['vykolotaya-okrestnost', 'izolirovannaya-tochka', 'proizvodnoe-mnozhestvo', 'tochka-prikosnoveniya']
	},

	'izolirovannaya-tochka': {
		id: 'izolirovannaya-tochka',
		term: 'Изолированная точка',
		short: String.raw`Точка $A$, которая не предельная: есть $U_x$ с $U_x\cap A=\{x\}$.`,
		formula: String.raw`x\in\operatorname{Isol}(A)\iff x\in A\ \wedge\ \exists U_x:\ U_x\cap A=\{x\}`,
		body: String.raw`**Изолированная точка** — точка самого $A$, которая не является [[predelnaya-tochka|предельной]]: $\operatorname{Isol}(A)=A\setminus A'$. Для точки из $A$ третьего варианта нет — либо предельная, либо изолированная.

Изолированность — свойство пары «точка и множество», и её не следует путать с условием $\{x\}\in\tau$ (**открытая точка** пространства), где никакого $A$ нет. Из $\{x\}\in\tau$ изолированность следует для любого $A\ni x$, обратное неверно: у $A=\{0\}\cup[1;2]\subset\mathbb R$ ноль изолирован, хотя открытых точек в $\mathbb R$ нет ни одной. Совпадают два условия только при $A=T$, и в выкладках — в частности в теореме о [[zamykanie|замыкании]] — работает именно парная форма.`,
		related: ['predelnaya-tochka', 'proizvodnoe-mnozhestvo', 'vykolotaya-okrestnost', 'topologicheskoe-prostranstvo']
	},

	'proizvodnoe-mnozhestvo': {
		id: 'proizvodnoe-mnozhestvo',
		term: 'Производное множество A′',
		short: String.raw`Множество всех предельных точек; с A не связано включением.`,
		formula: String.raw`\operatorname{cl}A=A'\cup\operatorname{Isol}(A),\qquad \operatorname{Isol}(A)=A\setminus A'`,
		body: String.raw`$A'$ — множество всех [[predelnaya-tochka|предельных точек]] $A$. Ни $A\subset A'$, ни $A'\subset A$ в общем случае неверны: у $\left\{\tfrac1n\right\}$ производное множество равно $\{0\}$ и лежит целиком снаружи, у $\mathbb Z$ оно пусто, у $[5;7)$ оно шире самого множества.

Главная теорема дня связывает три объекта: $\operatorname{cl}A=A'\cup\operatorname{Isol}(A)$, причём объединение дизъюнктно. Отсюда сразу видно, что замкнутость равносильна включению $A'\subset A$: множество замкнуто ровно тогда, когда содержит все свои предельные точки.`,
		related: ['predelnaya-tochka', 'izolirovannaya-tochka', 'zamykanie', 'granica']
	},

	'tochka-prikosnoveniya': {
		id: 'tochka-prikosnoveniya',
		term: 'Точка прикосновения',
		short: String.raw`Невыколотая версия предельной точки; это в точности точки cl A.`,
		formula: String.raw`x\in\operatorname{cl}A\iff\forall U_x:\ U_x\cap A\ne\varnothing`,
		body: String.raw`**Точка прикосновения** $A$ — точка, каждая **полная** окрестность которой пересекает $A$. Отличие от [[predelnaya-tochka|предельной точки]] ровно в одном кружочке: там $\mathring U_x$, здесь $U_x$.

Множество точек прикосновения — это в точности [[zamykanie|замыкание]] $\operatorname{cl}A$, то есть предельные точки плюс [[izolirovannaya-tochka|изолированные]]. Через это понятие удобно читать определение [[plotnost-mnozhestva|плотности]]: $A$ плотно в $B$ тогда и только тогда, когда каждая точка $B$ — точка прикосновения $A$.`,
		related: ['predelnaya-tochka', 'zamykanie', 'plotnost-mnozhestva', 'okrestnost']
	},

	okrestnost: {
		id: 'okrestnost',
		term: 'Окрестность точки',
		short: String.raw`Любое открытое множество, содержащее точку.`,
		formula: String.raw`U_x\in\tau,\ x\in U_x;\qquad \mathring U_x=U_x\setminus\{x\}`,
		body: String.raw`**Окрестность** $U_x$ — это любой элемент топологии $\tau$, содержащий точку $x$; никакой «симметричности» или «малости» не требуется. В метрическом пространстве роль базовых окрестностей играют открытые шары $B_r(x)$ в любой из [[metriki-rho|метрик]] $\rho_1,\rho_2,\rho_k,\rho_\infty$.

Рабочее свойство, которым пользуются в доказательствах: открытое множество является окрестностью **каждой** своей точки, а пересечение двух окрестностей одной точки — снова окрестность. Из $U_x$ выкалыванием получают [[vykolotaya-okrestnost|$\mathring U_x$]], и вся сегодняшняя тема держится на разнице между ними.`,
		related: ['vykolotaya-okrestnost', 'topologicheskoe-prostranstvo', 'metriki-rho', 'predelnaya-tochka']
	},

	'topologicheskoe-prostranstvo': {
		id: 'topologicheskoe-prostranstvo',
		term: 'Топологическое пространство (T, τ)',
		short: String.raw`Множество плюс объявленный набор открытых множеств.`,
		formula: String.raw`\varnothing,T\in\tau;\quad \bigcup_{i\in I}U_i\in\tau;\quad \bigcap_{i=1}^{r}U_i\in\tau`,
		body: String.raw`**Топологическое пространство** — пара $(T,\tau)$, где $\tau\subset2^{T}$ содержит $\varnothing$ и $T$, замкнуто относительно произвольных объединений и **конечных** пересечений. Открытость не проверяется, а назначается выбором $\tau$.

Все определения дня формулируются здесь, а $\mathbb R$ идёт частным случаем. Два предельных случая полезно держать как тесты: в дискретной топологии ($\tau=2^{T}$) предельных точек нет вовсе и всё замкнуто, в тривиальной ($\tau=\{\varnothing,T\}$) [[predelnaya-tochka|предельной]] оказывается почти каждая точка.`,
		related: ['okrestnost', 'predelnaya-tochka', 'komponenta-svyaznosti', 'separabelnost']
	},

	granica: {
		id: 'granica',
		term: 'Граница множества ∂A',
		short: String.raw`Каждая окрестность задевает и A, и его дополнение.`,
		formula: String.raw`x\in\partial A\iff\forall U_x:\ U_x\cap A\ne\varnothing\ \wedge\ U_x\cap\overline A\ne\varnothing`,
		body: String.raw`**Граничная точка** $A$ — та, любая окрестность которой пересекает и $A$, и его [[dopolnenie|дополнение]] $\overline A$ (черта означает дополнение, не замыкание). Через границу определяются и [[zamykanie|замыкание]] $\operatorname{cl}A=A\cup\partial A$, и [[vnutrennost|внутренность]] $\operatorname{In}A=A\setminus\partial A$.

Включение $\partial A\subset A'$ неверно: для $A=\{0\}\subset\mathbb R$ имеем $\partial A=\{0\}$, а $A'=\varnothing$. Верная форма — $\partial A\subset A'\cup\operatorname{Isol}(A)$; граничная точка **вне** $A$ обязана быть [[predelnaya-tochka|предельной]], а граничная точка внутри $A$ может оказаться изолированной.`,
		related: ['zamykanie', 'vnutrennost', 'dopolnenie', 'predelnaya-tochka']
	},

	vnutrennost: {
		id: 'vnutrennost',
		term: 'Внутренность In A',
		short: String.raw`Множество без своей границы: In A = A \ ∂A.`,
		formula: String.raw`\operatorname{In}A=A\setminus\partial A,\qquad x\in\operatorname{In}A\iff\exists U_x\subset A`,
		body: String.raw`$x$ — **внутренняя точка** $A$, если у неё есть [[okrestnost|окрестность]], целиком лежащая в $A$. Внутренность обозначается $\operatorname{In}A$ и задаётся через [[granica|границу]]: $\operatorname{In}A=A\setminus\partial A$.

Включение $\operatorname{In}A\subset A'$ верно не всегда. Его доказательство идёт через пересечение окрестностей $V_x=U'_x\cap U_x$ и требует $V_x\ne\{x\}$ — а это не вывод, а условие $\{x\}\notin\tau$. В $\mathbb R$ оно выполнено, в дискретной топологии нет: там всякая точка внутренняя, а [[predelnaya-tochka|предельных]] нет ни одной.`,
		related: ['granica', 'okrestnost', 'predelnaya-tochka', 'izolirovannaya-tochka']
	},

	'vneshnyaya-tochka': {
		id: 'vneshnyaya-tochka',
		term: 'Внешняя точка',
		short: String.raw`Есть окрестность, не задевающая множество вовсе.`,
		formula: String.raw`\exists U_x:\ U_x\cap A=\varnothing`,
		body: String.raw`**Внешняя точка** $A$ — точка, у которой найдётся окрестность, не пересекающая $A$. Это внутренняя точка [[dopolnenie|дополнения]] $\overline A$, и одновременно точка вне [[zamykanie|замыкания]]: $x\notin\operatorname{cl}A$.

Внешняя точка никогда не бывает [[predelnaya-tochka|предельной]] — доказательство в одну строку, $\mathring U_x\cap A\subset U_x\cap A=\varnothing$. Тот же объект работает в критерии плотности: там от противного берут $x\in B$ вне $\operatorname{cl}A$ и получают внешнюю точку, что сразу противоречит [[plotnost-mnozhestva|плотности]].`,
		related: ['predelnaya-tochka', 'dopolnenie', 'zamykanie', 'plotnost-mnozhestva']
	},

	'plotnost-mnozhestva': {
		id: 'plotnost-mnozhestva',
		term: 'Плотность A в B',
		short: String.raw`Полная (НЕвыколотая) окрестность каждой точки B задевает A.`,
		formula: String.raw`A\subset B:\quad \forall x\in B\ \forall U_x:\ U_x\cap A\ne\varnothing`,
		body: String.raw`$A$ **плотно в** $B$ (при $A\subset B$), если любая **полная** окрестность любой точки $B$ пересекает $A$. Ключевая асимметрия дня: [[predelnaya-tochka|предельная точка]] определена через выколотую окрестность, а плотность — через невыколотую.

Следствия невыколотости: всякое множество плотно в себе, а [[izolirovannaya-tochka|изолированные точки]] плотности не мешают ($A=B=\{0\}$). В доказательстве [[kriteriy-plotnosti|критерия]] переход между двумя окрестностями выписывается явно: $U_x\cap A\supset\mathring U_x\cap A$.`,
		related: ['kriteriy-plotnosti', 'tochka-prikosnoveniya', 'vsyudu-plotnoe-mnozhestvo', 'vykolotaya-okrestnost']
	},

	'kriteriy-plotnosti': {
		id: 'kriteriy-plotnosti',
		term: 'Критерий плотного подмножества',
		short: String.raw`A плотно в B ⟺ B ⊂ cl A.`,
		formula: String.raw`A\ \text{плотно в}\ B\iff B\subset\operatorname{cl}A`,
		body: String.raw`**Критерий** переводит [[plotnost-mnozhestva|плотность]] с языка окрестностей на язык [[zamykanie|замыканий]]. Доказательство «$\Leftarrow$» — разбор двух случаев: при $x\in A$ работает сама точка (тут и нужна невыколотость), при $x\notin A$ точка лежит в $A'$, и $U_x\cap A\supset\mathring U_x\cap A\ne\varnothing$. Доказательство «$\Rightarrow$» — от противного через [[vneshnyaya-tochka|внешнюю точку]].

Включение может быть строгим: $A=(0;1)$ плотно в $B=[0;1)$, хотя $\operatorname{cl}A=[0;1]\ne B$. Равенство получается только при $B=T$ — это и есть [[vsyudu-plotnoe-mnozhestvo|всюду плотность]].`,
		related: ['plotnost-mnozhestva', 'zamykanie', 'vneshnyaya-tochka', 'vsyudu-plotnoe-mnozhestvo']
	},

	'vsyudu-plotnoe-mnozhestvo': {
		id: 'vsyudu-plotnoe-mnozhestvo',
		term: 'Всюду плотное множество',
		short: String.raw`Замыкание совпадает со всем пространством: cl A = T.`,
		formula: String.raw`\operatorname{cl}A=T\iff A\ \text{плотно в}\ T`,
		body: String.raw`$A$ — **всюду плотное** в $T$, если $\operatorname{cl}A=T$. По [[kriteriy-plotnosti|критерию]] это равносильно [[plotnost-mnozhestva|плотности]] $A$ в $T$: включение $\operatorname{cl}A\supset T$ вместе с очевидным $\operatorname{cl}A\subset T$ даёт равенство.

Эталонные примеры — [[plotnost-q-v-r|$\mathbb Q$ и $\mathbb I$ в $\mathbb R$]]: два непересекающихся множества, каждое из которых подходит к любой точке. В дискретной топологии всюду плотно лишь само $T$, поэтому там [[separabelnost|сепарабельность]] равносильна счётности носителя.`,
		related: ['kriteriy-plotnosti', 'plotnost-mnozhestva', 'separabelnost', 'plotnost-q-v-r']
	},

	separabelnost: {
		id: 'separabelnost',
		term: 'Сепарабельность',
		short: String.raw`Есть счётное всюду плотное подмножество.`,
		formula: String.raw`\exists A\subset T:\ |A|\le\aleph_0\ \wedge\ \operatorname{cl}A=T`,
		body: String.raw`Топологическое пространство **сепарабельно**, если у него есть счётное [[vsyudu-plotnoe-mnozhestvo|всюду плотное]] подмножество. Классический пример — $\mathbb R$ со счётным $\mathbb Q$; классический контрпример — несчётное множество с дискретной топологией, где всюду плотно только оно само.

Со счётной базой сепарабельность связана односторонне. Счётная база даёт сепарабельность: достаточно взять по точке из каждого непустого базисного множества. Обратное в общем случае неверно — прямая Зоргенфрея (база из полуинтервалов $[a;b)$) сепарабельна, а счётной базы не имеет. Равносильность восстанавливается в метрических пространствах.`,
		related: ['vsyudu-plotnoe-mnozhestvo', 'plotnost-q-v-r', 'topologicheskoe-prostranstvo']
	},

	'plotnost-q-v-r': {
		id: 'plotnost-q-v-r',
		term: 'Плотность ℚ и 𝕀 в ℝ',
		short: String.raw`Оба множества всюду плотны; доказательство — по десятичным разрядам.`,
		formula: String.raw`\forall\ \text{открытого}\ S_x:\ S_x\cap\mathbb Q\ne\varnothing\ \wedge\ S_x\cap\mathbb I\ne\varnothing`,
		body: String.raw`Плотность доказывается конструктивно, а не через принцип Архимеда: в интервале $(\xi;\zeta)\subset S_x$ берут разряд $k$ с $10^{-k}<\zeta-\xi$ и обрезают $\xi$ на нём с округлением вверх, $q=\bigl(\lfloor\xi\cdot10^{k}\rfloor+1\bigr)/10^{k}$, — получается конечная дробь, то есть рациональное число строго внутри. Для $\mathbb I$ вместо нулевого хвоста дописывают заведомо непериодический.

Плотность не значит замкнутости относительно пределов: обрезания числа $\sqrt2$ лежат в счётном множестве конечных дробей, а их предел — нет, потому что всякая конечная десятичная дробь рациональна. Этот зазор дальше называется неполнотой, и его закрывает [[skhodyashchayasya-v-sebe|фундаментальность]].`,
		related: ['vsyudu-plotnoe-mnozhestvo', 'separabelnost', 'plotnost-mnozhestva', 'skhodyashchayasya-v-sebe']
	}
};
