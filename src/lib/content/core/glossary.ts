import type { Glossary } from '$lib/types';

// =====================================================================
//  ОБЩИЙ БАЗОВЫЙ СЛОЙ САЙТА.
//
//  Нижний этаж дерева подсказок. С карточки любого предмета и любого
//  семестра можно спускаться по ссылкам вниз и дойти сюда, а отсюда —
//  до множества и принадлежности, которые не определяются ни через что.
//
//  Термин живёт здесь в одном экземпляре: предметы его не переобъявляют,
//  а только ссылаются [[id]]. Каждая карточка отвечает ровно за свой
//  термин, укладывается в один короткий абзац и ссылается только на то,
//  через что этот термин определён.
// =====================================================================

export const core: Glossary = {
	mnozhestvo: {
		id: 'mnozhestvo',
		term: 'Множество',
		short: String.raw`Первичное понятие: совокупность объектов, рассматриваемая как один объект.`,
		body: String.raw`**Множество** не определяется через что-то более простое — это исходное понятие. Задают его перечислением, $\{1,2,3\}$, или свойством, $\{x : x^2<4\}$. Единственное, что о множестве спрашивают, — [[prinadlezhnost|принадлежит]] ли ему данный объект; два множества равны, когда состоят из одних и тех же элементов.`,
		related: ['prinadlezhnost', 'podmnozhestvo']
	},

	prinadlezhnost: {
		id: 'prinadlezhnost',
		term: 'Принадлежность',
		short: String.raw`$x\in A$ — объект $x$ является элементом множества $A$.`,
		formula: String.raw`x\in A,\qquad x\notin A`,
		body: String.raw`Запись $x\in A$ означает, что $x$ — элемент [[mnozhestvo|множества]] $A$; отрицание пишется $x\notin A$. Это единственное неопределяемое отношение теории множеств: равенство, включение и все операции над множествами выражаются через него.`,
		related: ['mnozhestvo', 'podmnozhestvo']
	},

	podmnozhestvo: {
		id: 'podmnozhestvo',
		term: 'Подмножество',
		short: String.raw`$A\subset B$: каждый элемент $A$ лежит в $B$; знак нестрогий.`,
		formula: String.raw`A\subset B\iff\forall x\in A:\ x\in B`,
		body: String.raw`$A\subset B$, если всякий элемент $A$ [[prinadlezhnost|принадлежит]] и $B$. Знак нестрогий — равенство допускается. Включение нельзя путать с принадлежностью: одно связывает два [[mnozhestvo|множества]], другое — элемент и множество.`,
		related: ['mnozhestvo', 'prinadlezhnost']
	},

	'uporyadochennaya-para': {
		id: 'uporyadochennaya-para',
		term: 'Упорядоченная пара',
		short: String.raw`$(a,b)$ — два объекта с указанием, который первый.`,
		formula: String.raw`(a,b)=(c,d)\iff a=c\ \text{и}\ b=d`,
		body: String.raw`**Упорядоченная пара** $(a,b)$ отличается от [[mnozhestvo|множества]] $\{a,b\}$ тем, что в ней зафиксирован порядок: $(1,2)\ne(2,1)$, тогда как $\{1,2\}=\{2,1\}$. Единственное требование к паре — записанное выше правило равенства; способ закодировать её множествами уже вторичен.`,
		related: ['mnozhestvo', 'dekartovo-proizvedenie']
	},

	'dekartovo-proizvedenie': {
		id: 'dekartovo-proizvedenie',
		term: 'Декартово произведение',
		short: String.raw`$A\times B$ — все пары $(a,b)$ с $a\in A$, $b\in B$, и ничего сверх того.`,
		formula: String.raw`A\times B=\{(a,b) : a\in A,\ b\in B\}`,
		body: String.raw`$A\times B$ содержит каждую [[uporyadochennaya-para|упорядоченную пару]] с первым элементом из $A$ и вторым из $B$ — и не содержит ничего постороннего. Второе условие существенно: без него подошло бы любое надмножество произведения.`,
		related: ['uporyadochennaya-para', 'mnozhestvo', 'binarnoe-otnoshenie']
	},

	'binarnoe-otnoshenie': {
		id: 'binarnoe-otnoshenie',
		term: 'Бинарное отношение',
		short: String.raw`Подмножество $R\subset A\times B$; никакого «правила» в определении нет.`,
		formula: String.raw`R\subset A\times B,\qquad a\,R\,b\iff (a,b)\in R`,
		body: String.raw`**Отношение** — это [[podmnozhestvo|подмножество]] [[dekartovo-proizvedenie|декартова произведения]], то есть просто список пар: пара в $R$ — элементы связаны, пары нет — не связаны. Так задаются и равенство, и порядок, и [[otobrazhenie|отображение]] — различаются они лишь ограничениями на этот список.`,
		related: ['dekartovo-proizvedenie', 'podmnozhestvo', 'otobrazhenie']
	},

	otobrazhenie: {
		id: 'otobrazhenie',
		term: 'Отображение',
		short: String.raw`$f\subset X\times Y$, где каждому $x$ отвечает ровно один $y$.`,
		formula: String.raw`f:X\to Y,\qquad \forall x\in X\ \exists!\,y\in Y:\ (x,y)\in f`,
		body: String.raw`**Отображение** $f:X\to Y$ — это [[binarnoe-otnoshenie|отношение]] $f\subset X\times Y$, в котором у каждого $x$ ровно один партнёр $y$; его и пишут $y=f(x)$. Отображение буквально **есть** свой график, а не правило, которому график соответствует: элемента без образа не бывает, двух образов у одного элемента — тоже.`,
		related: ['binarnoe-otnoshenie', 'oblast-opredeleniya', 'kompoziciya']
	},

	'oblast-opredeleniya': {
		id: 'oblast-opredeleniya',
		term: 'Область определения и область значений',
		short: String.raw`$D(f)$ — откуда берут аргумент, $E(f)$ — куда попадает результат.`,
		formula: String.raw`f:X\to Y,\qquad D(f)=X,\quad E(f)=Y`,
		body: String.raw`У [[otobrazhenie|отображения]] $f:X\to Y$ область определения $D(f)$ — это $X$, область значений $E(f)$ — это $Y$. Область значений объявляется вместе с отображением и не обязана совпадать с множеством фактически достигаемых значений: у $f(x)=x^2$ при $Y=\mathbb R$ достигается лишь $[0;+\infty)$.`,
		related: ['otobrazhenie', 'obraz-mnozhestva']
	},

	'obraz-mnozhestva': {
		id: 'obraz-mnozhestva',
		term: 'Образ и прообраз',
		short: String.raw`$f(A)$ — куда уходит $A$; $f^-(B)$ — что попадает в $B$.`,
		formula: String.raw`f(A)=\{f(x):x\in A\},\qquad f^-(B)=\{x: f(x)\in B\}`,
		body: String.raw`**Образ** множества $A$ — все значения, которые [[otobrazhenie|отображение]] принимает на $A$. **Прообраз** множества $B$ — все аргументы, чьи значения попали в $B$. Прообраз определён всегда, даже когда обратного отображения нет: $f^-(B)$ бывает пустым и бывает многоточечным.`,
		related: ['otobrazhenie', 'oblast-opredeleniya']
	},

	kompoziciya: {
		id: 'kompoziciya',
		term: 'Композиция отображений',
		short: String.raw`$(g\circ f)(x)=g(f(x))$ — сначала $f$, потом $g$.`,
		formula: String.raw`g\circ f:X\to Z,\qquad (g\circ f)(x)=g\bigl(f(x)\bigr)`,
		body: String.raw`Если $f:X\to Y$ и $g:Y\to Z$, то их **композиция** применяет сначала $f$, затем $g$. Она ассоциативна, но не коммутативна, и определена лишь тогда, когда область значений первого [[otobrazhenie|отображения]] лежит в области определения второго.`,
		related: ['otobrazhenie', 'oblast-opredeleniya']
	},

	funkciya: {
		id: 'funkciya',
		term: 'Функция',
		short: String.raw`Отображение, значения которого — числа.`,
		formula: String.raw`f:X\to\mathbb R`,
		body: String.raw`**Функция** — [[otobrazhenie|отображение]] со значениями в числовом множестве, чаще всего в [[veshchestvennye-chisla|$\mathbb R$]]. Числовые значения дают то, чего нет у произвольных отображений: функции можно [[poelementnye-operacii|складывать, умножать и сравнивать]].`,
		related: ['otobrazhenie', 'veshchestvennye-chisla', 'poelementnye-operacii']
	},

	'poelementnye-operacii': {
		id: 'poelementnye-operacii',
		term: 'Поточечные операции над функциями',
		short: String.raw`$(f+g)(x)=f(x)+g(x)$, $(fg)(x)=f(x)g(x)$.`,
		formula: String.raw`(f+g)(x)=f(x)+g(x),\qquad (fg)(x)=f(x)\,g(x)`,
		body: String.raw`Сумма и произведение [[funkciya|функций]] определяются значением в каждой точке по отдельности, поэтому результат снова функция на том же множестве. Все свойства чисел переносятся на функции дословно: коммутативность, ассоциативность, дистрибутивность.`,
		related: ['funkciya', 'veshchestvennye-chisla']
	},

	'naturalnye-chisla': {
		id: 'naturalnye-chisla',
		term: 'Натуральные числа',
		short: String.raw`$\mathbb N$ — числа счёта, у каждого своё следующее.`,
		body: String.raw`**Натуральные числа** задаются аксиомами Пеано: есть начальный элемент, у каждого числа ровно одно следующее, разные числа имеют разные следующие, и всякое свойство, верное для начального и переходящее к следующему, верно для всех. Последняя аксиома — это принцип математической индукции.`,
		related: ['celye-i-racionalnye', 'mnozhestvo']
	},

	'celye-i-racionalnye': {
		id: 'celye-i-racionalnye',
		term: 'Целые и рациональные числа',
		short: String.raw`$\mathbb Z$ добавляет вычитание, $\mathbb Q$ — деление.`,
		formula: String.raw`\mathbb N\subset\mathbb Z\subset\mathbb Q`,
		body: String.raw`$\mathbb Z$ получается из [[naturalnye-chisla|натуральных]] добавлением нуля и противоположных элементов — тогда всюду определено вычитание. $\mathbb Q$ — дроби $p/q$ с $q\ne0$, здесь всюду определено и деление. $\mathbb Q$ уже [[pole|поле]], но уравнение $x^2=2$ в нём решения не имеет.`,
		related: ['naturalnye-chisla', 'pole', 'veshchestvennye-chisla']
	},

	pole: {
		id: 'pole',
		term: 'Поле',
		short: String.raw`Множество с сложением и умножением, где делить можно на всё, кроме нуля.`,
		body: String.raw`**Поле** — [[mnozhestvo|множество]] с двумя операциями: обе ассоциативны, коммутативны и имеют нейтральный элемент ($0$ и $1$), у каждого элемента есть противоположный, у каждого ненулевого — обратный, а умножение дистрибутивно относительно сложения. $\mathbb Q$ и $\mathbb R$ — поля, $\mathbb Z$ — нет: обратного к $2$ среди целых не существует.`,
		related: ['mnozhestvo', 'veshchestvennye-chisla', 'celye-i-racionalnye']
	},

	'veshchestvennye-chisla': {
		id: 'veshchestvennye-chisla',
		term: 'Вещественные числа',
		short: String.raw`Упорядоченное поле, в котором выполнена аксиома полноты.`,
		formula: String.raw`\mathbb Q\subset\mathbb R`,
		body: String.raw`$\mathbb R$ — [[pole|поле]] с порядком, согласованным с операциями, и с [[aksioma-polnoty|аксиомой полноты]]. Именно полнота отличает $\mathbb R$ от [[celye-i-racionalnye|$\mathbb Q$]] и означает, что на прямой нет «дыр».`,
		related: ['pole', 'aksioma-polnoty', 'celye-i-racionalnye']
	},

	'aksioma-polnoty': {
		id: 'aksioma-polnoty',
		term: 'Аксиома полноты',
		short: String.raw`У всякого непустого ограниченного сверху множества есть точная верхняя грань.`,
		formula: String.raw`A\ne\varnothing,\ A\ \text{огр. сверху}\ \Rightarrow\ \exists\,\sup A\in\mathbb R`,
		body: String.raw`Если непустое множество [[veshchestvennye-chisla|вещественных чисел]] ограничено сверху, у него есть [[supremum|точная верхняя грань]]. В $\mathbb Q$ это неверно: множество $\{x\in\mathbb Q: x^2<2\}$ ограничено сверху, а рациональной точной грани не имеет.`,
		related: ['veshchestvennye-chisla', 'supremum']
	},

	supremum: {
		id: 'supremum',
		term: 'Супремум',
		short: String.raw`Наименьшая из верхних границ; принадлежать множеству не обязана.`,
		formula: String.raw`\sup A=\min\{M:\ \forall x\in A,\ x\le M\}`,
		body: String.raw`**Супремум** $\sup A$ — наименьшая из верхних границ множества $A$. Достигаться он не обязан: у $A=\{1-\frac1n\}$ супремум равен $1$, а самой единицы в $A$ нет. Достигнутый супремум называют максимумом; существование супремума гарантирует [[aksioma-polnoty|полнота]] $\mathbb R$.`,
		related: ['aksioma-polnoty', 'veshchestvennye-chisla']
	},

	'modul-chisla': {
		id: 'modul-chisla',
		term: 'Модуль числа',
		short: String.raw`$|x|$ — расстояние от $x$ до нуля.`,
		formula: String.raw`|x|=\begin{cases}x,&x\geqslant0\\-x,&x<0\end{cases}`,
		body: String.raw`Модуль превращает разность [[veshchestvennye-chisla|вещественных чисел]] в расстояние: $|x-y|$ — насколько $x$ далеко от $y$. Главное его свойство — неравенство треугольника $|x+y|\leqslant|x|+|y|$.`,
		related: ['veshchestvennye-chisla', 'promezhutok']
	},

	promezhutok: {
		id: 'promezhutok',
		term: 'Промежуток',
		short: String.raw`Отрезок, интервал, полуинтервал или луч: вместе с двумя точками — всё между ними.`,
		formula: String.raw`[a;b]=\{x: a\leqslant x\leqslant b\},\quad (a;b)=\{x: a<x<b\}`,
		body: String.raw`Промежуток — [[podmnozhestvo|подмножество]] [[veshchestvennye-chisla|$\mathbb R$]], которое вместе с любыми двумя своими точками содержит и весь отрезок между ними. Разница между $[a;b]$ и $(a;b)$ не косметическая: концы либо принадлежат множеству, либо нет, и от этого зависят почти все теоремы о промежутках.`,
		related: ['veshchestvennye-chisla', 'podmnozhestvo', 'modul-chisla']
	},

	posledovatelnost: {
		id: 'posledovatelnost',
		term: 'Последовательность',
		short: String.raw`Отображение $\mathbb N\to X$, а не «набор элементов».`,
		formula: String.raw`x:\mathbb N\to X,\qquad x_n\equiv x(n)`,
		body: String.raw`**Последовательность** — [[otobrazhenie|отображение]] из [[naturalnye-chisla|$\mathbb N$]] в множество $X$; вместо $x(n)$ пишут $x_n$. Номер отличает её от множества значений: у $\{(-1)^n\}$ бесконечно много членов и ровно два значения.`,
		related: ['otobrazhenie', 'naturalnye-chisla', 'predel-posledovatelnosti']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`$x_n\to a$: любая точность $\varepsilon$ достигается начиная с некоторого номера.`,
		formula: String.raw`\lim_{n\to\infty}x_n=a\iff\forall\varepsilon>0\ \exists N\ \forall n>N:\ |x_n-a|<\varepsilon`,
		body: String.raw`Число $a$ — **предел** [[posledovatelnost|последовательности]], если для каждого $\varepsilon>0$ найдётся номер $N$, после которого все члены отстоят от $a$ меньше чем на $\varepsilon$. Порядок кванторов существен: $N$ выбирают уже зная $\varepsilon$, поэтому $N$ есть функция от $\varepsilon$.`,
		related: ['posledovatelnost', 'modul-chisla', 'predel-funkcii']
	},

	'predel-funkcii': {
		id: 'predel-funkcii',
		term: 'Предел функции в точке',
		short: String.raw`$f(x)\to A$ при $x\to x_0$; сама точка $x_0$ выколота.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall x:\ 0<|x-x_0|<\delta\Rightarrow|f(x)-A|<\varepsilon`,
		body: String.raw`$A$ — **предел** [[funkciya|функции]] $f$ при $x\to x_0$, если по каждому $\varepsilon>0$ подбирается $\delta>0$, при котором все $x$ ближе $\delta$ к $x_0$ дают значения ближе $\varepsilon$ к $A$. Условие $0<|x-x_0|$ выкалывает саму точку: значение $f(x_0)$ на предел не влияет и может не существовать.`,
		related: ['funkciya', 'modul-chisla', 'nepreryvnost']
	},

	nepreryvnost: {
		id: 'nepreryvnost',
		term: 'Непрерывность в точке',
		short: String.raw`Предел равен значению: $\lim_{x\to x_0}f(x)=f(x_0)$.`,
		formula: String.raw`\lim_{x\to x_0}f(x)=f(x_0)`,
		body: String.raw`[[funkciya|Функция]] **непрерывна** в точке, если она там определена, имеет [[predel-funkcii|предел]] и предел совпадает со значением. Три требования независимы: значения может не быть, предела может не быть, а могут быть оба и не совпасть — тогда точка называется точкой разрыва.`,
		related: ['predel-funkcii', 'funkciya']
	},

	'lineynoe-prostranstvo': {
		id: 'lineynoe-prostranstvo',
		term: 'Линейное пространство',
		short: String.raw`Множество с внутренним сложением и умножением на число; аксиом восемь.`,
		formula: String.raw`+:M\times M\to M,\qquad \ast:\mathbb R\times M\to M`,
		body: String.raw`**Линейное (векторное) пространство** — [[mnozhestvo|множество]] $M$ со сложением $+:M\times M\to M$ и внешним умножением $\ast:\mathbb R\times M\to M$. Аксиом восемь: ассоциативность и коммутативность сложения, нулевой элемент, противоположный, $1\ast x=x$, $\alpha\ast(\beta\ast x)=(\alpha\beta)\ast x$ и две дистрибутивности.`,
		related: ['mnozhestvo', 'pole', 'lineynost']
	},

	lineynost: {
		id: 'lineynost',
		term: 'Линейность',
		short: String.raw`$L(\alpha x+\beta y)=\alpha L(x)+\beta L(y)$.`,
		formula: String.raw`L(\alpha x+\beta y)=\alpha\,L(x)+\beta\,L(y)`,
		body: String.raw`[[otobrazhenie|Отображение]] [[lineynoe-prostranstvo|линейных пространств]] **линейно**, если перестановочно со сложением и с умножением на число. Условие распадается на два независимых: аддитивность $L(x+y)=L(x)+L(y)$ и однородность $L(\alpha x)=\alpha L(x)$; отсюда сразу $L(0)=0$.`,
		related: ['lineynoe-prostranstvo', 'otobrazhenie']
	},

	'bazis-i-koordinaty': {
		id: 'bazis-i-koordinaty',
		term: 'Базис и координаты',
		short: String.raw`Набор, через который всякий элемент выражается однозначно.`,
		formula: String.raw`x=\sum_{i=1}^{n} x_i e_i`,
		body: String.raw`**Базис** [[lineynoe-prostranstvo|линейного пространства]] — набор, через который любой элемент выражается суммой с числовыми коэффициентами, причём единственным способом; сами коэффициенты и есть **координаты**. Единственность разложения позволяет задавать [[lineynost|линейное отображение]] одними лишь значениями на базисе.`,
		related: ['lineynoe-prostranstvo', 'lineynost', 'matrica']
	},

	matrica: {
		id: 'matrica',
		term: 'Матрица',
		short: String.raw`Таблица чисел; столбцы — координаты образов базисных векторов.`,
		formula: String.raw`A=(a_{ij}),\qquad L(e_j)=\sum_i a_{ij}e_i`,
		body: String.raw`**Матрица** записывает [[lineynost|линейное отображение]] в выбранном [[bazis-i-koordinaty|базисе]]: $j$-й столбец — координаты образа $j$-го базисного вектора. Умножение матриц отвечает [[kompoziciya|композиции]] отображений, поэтому оно ассоциативно и, вообще говоря, некоммутативно.`,
		related: ['lineynost', 'bazis-i-koordinaty', 'opredelitel']
	},

	opredelitel: {
		id: 'opredelitel',
		term: 'Определитель',
		short: String.raw`Число $\det A$; равен нулю ровно при вырожденности.`,
		formula: String.raw`\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc`,
		body: String.raw`**Определитель** квадратной [[matrica|матрицы]] — число, обращающееся в нуль ровно тогда, когда столбцы линейно зависимы. Геометрически $|\det A|$ — во сколько раз отображение меняет объём, а знак говорит, сохраняется ли ориентация.`,
		related: ['matrica', 'bazis-i-koordinaty']
	},

	proizvodnaya: {
		id: 'proizvodnaya',
		term: 'Производная',
		short: String.raw`Предел разностного отношения при $\Delta x\to0$.`,
		formula: String.raw`f'(x)=\lim_{\Delta x\to0}\frac{f(x+\Delta x)-f(x)}{\Delta x}`,
		body: String.raw`**Производная** [[funkciya|функции]] в точке — [[predel-funkcii|предел]] отношения приращения функции к приращению аргумента при стремлении последнего к нулю. Геометрически это угловой коэффициент касательной, физически — мгновенная скорость изменения.`,
		related: ['funkciya', 'predel-funkcii', 'differencial']
	},

	differencial: {
		id: 'differencial',
		term: 'Дифференциал',
		short: String.raw`Линейная часть приращения: $df=f'(x)\,dx$.`,
		formula: String.raw`df=f'(x)\,dx`,
		body: String.raw`[[lineynost|Линейная]] по приращению аргумента часть приращения [[funkciya|функции]]. Величина $dx$ здесь свободная переменная, а не «бесконечно малое», поэтому $df$ зависит и от точки, и от приращения.`,
		related: ['proizvodnaya', 'lineynost', 'funkciya']
	},

	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная по одной координате при замороженных остальных.`,
		formula: String.raw`\frac{\partial f}{\partial x_i}(\vec x)=\lim_{t\to0}\frac{f(\vec x+t\vec e_i)-f(\vec x)}{t}`,
		body: String.raw`[[proizvodnaya|Производная]] функции нескольких переменных по одной из них, когда остальные считаются постоянными. Значок $\partial$ вместо $d$ и напоминает, что другие переменные есть, но сейчас заморожены.`,
		related: ['proizvodnaya', 'gradient']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор всех частных производных.`,
		formula: String.raw`\vec\nabla f=\Bigl(\frac{\partial f}{\partial x_1},\ \dots,\ \frac{\partial f}{\partial x_n}\Bigr)`,
		body: String.raw`Вектор, составленный из всех [[chastnaya-proizvodnaya|частных производных]] функции в данной точке. Он указывает направление наибыстрейшего роста функции, а его длина равна скорости роста в этом направлении.`,
		related: ['chastnaya-proizvodnaya', 'proizvodnaya', 'lineynoe-prostranstvo']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Предел сумм $\sum f(\xi_i)\Delta x_i$ при измельчении разбиения.`,
		formula: String.raw`\int_a^b f(x)\,dx=\lim_{\lambda_R\to0}\sum_i f(\xi_i)\,\Delta x_i`,
		body: String.raw`Число, к которому стремятся суммы произведений значений [[funkciya|функции]] на длины кусков отрезка, когда самый длинный кусок стягивается в точку. Для неотрицательной функции это площадь под графиком.`,
		related: ['funkciya', 'predel-posledovatelnosti', 'proizvodnaya']
	}

};
