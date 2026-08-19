import type { Glossary } from '$lib/types';

// Термины дня 29 — приёмы и утверждения, которыми держится первый прогон.
// Понятия, которые день только повторяет, определены в канонических карточках
// (glossary.ts и dayNN.terms.ts) и здесь не дублируются: n-nol-n-odin,
// dopolnenie, zamykanie, vykolotaya-okrestnost, komponenta-svyaznosti,
// metriki-rho, asimptoticheskie-klassy, n-ot-epsilon, neogranichennost,
// aksioma-ekstencionalnosti, raspredelenie-epsilon, priznak-i-svoystvo, lso.
export const day29Terms: Glossary = {
	'chetyre-sredy': {
		id: 'chetyre-sredy',
		term: 'Четыре среды: ℝ, норма, метрика, топология',
		short: String.raw`Одно определение на четырёх этажах общности; $\mathbb R$ — нижний.`,
		formula: String.raw`|x-y|\ \rightsquigarrow\ \lVert x-y\rVert\ \rightsquigarrow\ \rho(x,y)\ \rightsquigarrow\ U_x`,
		body: String.raw`Близость измеряется четырьмя способами, и каждый следующий слабее предыдущего: модуль $|x-y|$ на прямой, норма $\lVert x-y\rVert$ в [[normirovannoe-prostranstvo|линейном пространстве]], расстояние $\rho(x,y)$ в [[metricheskoe-prostranstvo|метрическом]], [[okrestnost|окрестность]] $U_x$ в [[topologicheskoe-prostranstvo|топологическом]]. Переходы односторонние: модуль — частный случай нормы при $n=1$, норма порождает метрику $\rho(x,y)=\lVert x-y\rVert$, метрика порождает топологию своими шарами.

Отсюда правило переноса: утверждение, доказанное на верхнем этаже, автоматически верно на нижних, обратное неверно. Определение предела существует во всех четырёх видах, и топологическая запись «в любой окрестности $A$ лежат почти все члены» покрывает три остальные.

Наверх поднимается не всё. $\sup$ и $\inf$ требуют отношения порядка, арифметика пределов — операций сложения и умножения; ни того, ни другого у произвольной метрики нет. Поэтому единственность предела формулируется в $(M,\rho)$, а теорема о $\sup$ и $\inf$ — только в $\mathbb R$.`,
		related: ['metricheskoe-prostranstvo', 'topologicheskoe-prostranstvo', 'normirovannoe-prostranstvo', 'okrestnost']
	},

	'involyuciya-dopolneniya': {
		id: 'involyuciya-dopolneniya',
		term: 'Инволюция дополнения',
		short: String.raw`$A\mapsto\overline A$ — инволюция без неподвижных точек, отсюда чётность.`,
		formula: String.raw`\overline{\overline A}=A,\qquad A\ne\overline A`,
		body: String.raw`Взятие [[dopolnenie|дополнения]] — инволюция: применённое дважды, оно возвращает исходное множество, $\overline{\overline A}=A$. На наборе [[komponenta-svyaznosti|открыто-замкнутых множеств]] оно действует в себя, потому что дополнение открыто-замкнутого снова открыто-замкнуто.

Неподвижных точек у него нет ни в одном непустом пространстве: из $A=\overline A$ вместе с $A\cap\overline A=\varnothing$ и $A\cup\overline A=S$ следует $S=\varnothing$.

Инволюция без неподвижных точек разбивает конечное множество на пары $\{A,\overline A\}$, поэтому мощность этого множества чётна. Приём общий: чётность доказывают, предъявив спаривание, а не пересчётом элементов.`,
		related: ['dopolnenie', 'komponenta-svyaznosti', 'zamknutoe-mnozhestvo']
	},

	'konechnost-peresecheniya': {
		id: 'konechnost-peresecheniya',
		term: 'Конечность пересечения в аксиоме топологии',
		short: String.raw`Объединения — любые, пересечения — только конечные.`,
		formula: String.raw`U_1\cap\dots\cap U_k\in\tau,\qquad \bigcap_{n\in\mathbb N_1}\left(-\tfrac1n;\tfrac1n\right)=\{0\}\notin\tau_{\mathbb R}`,
		body: String.raw`Третья аксиома топологии допускает только конечные пересечения, и ограничение существенно: $\bigcap_{n\in\mathbb N_1}\left(-\frac1n;\frac1n\right)=\{0\}$, потому что ноль лежит во всех интервалах, а любое $x\ne0$ выпадает при $n>\frac1{|x|}$. Одноточечное множество не содержит интервала и в топологии прямой не лежит — бесконечное пересечение вывело из $\tau$.

Причина видна в доказательстве для [[inducirovannaya-topologiya|топологии, индуцированной метрикой]]: точке $x\in U_1\cap\dots\cap U_k$ подбирают радиус $r=\min(r_1,\dots,r_k)$. Минимум конечного набора положительных чисел положителен, а инфимум бесконечного может обратиться в ноль, и шара нужного радиуса не остаётся.

Асимметрия аксиом объяснима и с другой стороны: объединение по определению открытости требует радиус лишь для той точки, что пришла вместе со своим множеством, — согласовывать бесконечно много радиусов не приходится.`,
		related: ['topologiya', 'otkrytoe-mnozhestvo', 'inducirovannaya-topologiya', 'shar']
	},

	'otsechenie-hvosta': {
		id: 'otsechenie-hvosta',
		term: 'Отсечение хвоста',
		short: String.raw`За номером $N(\varepsilon)$ — весь хвост в шаре, до него — конечный набор.`,
		formula: String.raw`\{x_n\}=\underbrace{\{x_1,\dots,x_N\}}_{\text{конечно}}\cup\underbrace{\{x_n: n>N(\varepsilon)\}}_{\subset B_\varepsilon(A)}`,
		body: String.raw`Сходимость разрезает последовательность на две части: хвост целиком лежит в шаре $B_\varepsilon(A)$, а до номера $N(\varepsilon)$ остаётся конечный набор членов. Конечный набор поддаётся прямому перебору — у него есть максимум и минимум, он ограничен, любое его свойство проверяется за конечное число шагов.

Так доказывается ограниченность сходящейся последовательности (берут $\varepsilon=1$), так же ищутся [[sup-inf-shodyashcheysya|$\sup$ и $\inf$]]: если супремум строго больше предела, хвост от него отделён зазором и супремум достаётся конечному началу.

Тот же разрез объясняет, почему изменение конечного числа членов не влияет на предел: условие «начиная с некоторого номера» переживает сдвиг нумерации, а [[chastichnaya-posledovatelnost|частичная последовательность]] имеет тот же предел.`,
		related: ['n-ot-epsilon', 'ogranichennost-posledovatelnosti', 'chastichnaya-posledovatelnost', 'sup-inf-shodyashcheysya']
	},

	'sup-inf-shodyashcheysya': {
		id: 'sup-inf-shodyashcheysya',
		term: 'sup и inf сходящейся последовательности',
		short: String.raw`Либо супремум достигается на члене, либо он равен пределу.`,
		formula: String.raw`\lim x_n=A\ \Rightarrow\ \sup\{x_n\}=\max_{n\le N}x_n\ \ \text{или}\ \ \sup\{x_n\}=A`,
		body: String.raw`Если $\lim x_n=A$, то [[supremum|супремум]] множества членов существует, не меньше $A$, и возможны ровно два случая: он равен $A$ либо достигается на одном из первых $N\bigl(\frac{S-A}{2}\bigr)$ членов. Для [[infimum|инфимума]] всё то же после замены $x_n\mapsto-x_n$.

Оба случая реализуются. У $x_n=\frac1n$ супремум равен $1=x_1$ и достигается, а инфимум равен пределу $0$ и [[nedostizhimyy-supremum|не достигается]]. У стационарной $x_n\equiv A$ достигаются оба.

Сходимость отбросить нельзя: у $x_n=(-1)^n\left(1-\frac1n\right)$ супремум $1$ и инфимум $-1$ не достигаются, а предела нет. Нет у теоремы и аналога в [[metricheskoe-prostranstvo|метрическом пространстве]]: $\sup$ и $\inf$ определяются через отношение порядка, которого метрика не даёт.`,
		related: ['supremum', 'infimum', 'nedostizhimyy-supremum', 'predel-posledovatelnosti']
	}
};
