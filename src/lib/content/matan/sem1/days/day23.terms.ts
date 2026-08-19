import type { Glossary } from '$lib/types';

// Термины дня 23 (компакты в R^n, Больцано–Вейерштрасс, канторово множество).
// Часть карточек повторяет понятия, введённые в днях 20–22 (компакт, покрытие,
// Борель–Лебег, замкнутость, ограниченность): день должен резолвиться
// независимо, поэтому они продублированы здесь, а не только упомянуты ссылкой.
// НЕ переобъявляются: dopolnenie, zamykanie, vykolotaya-okrestnost,
// metriki-rho, chastichnaya-posledovatelnost, priznak-i-svoystvo,
// n-nol-n-odin, skhodyashchayasya-v-sebe.
export const day23Terms: Glossary = {
	brus: {
		id: 'brus',
		term: 'Брус в ℝⁿ',
		short: String.raw`Прямое произведение отрезков; шар чебышёвской метрики — куб.`,
		formula: String.raw`P=[a_1;b_1]\times[a_2;b_2]\times\dots\times[a_n;b_n]`,
		body: String.raw`**$n$-мерный брус** — множество точек $(\xi_1,\dots,\xi_n)$, у которых каждая координата пробегает свой отрезок: $\xi_i\in[a_i;b_i]$. При $n=1$ это отрезок, при $n=2$ — прямоугольник, при $n=3$ — параллелепипед.

Брус — рабочая фигура доказательств в $\mathbb R^n$: открытый шар чебышёвской метрики [[metriki-rho|$\rho_\infty$]] — это в точности открытый куб. Поэтому [[ogranichennoe-mnozhestvo|ограниченность]] читают как «влезает в брус», а компактность бруса доказывают индукцией по размерности из [[borel-lebeg|Бореля–Лебега]].`,
		related: ['kompakt', 'ogranichennoe-mnozhestvo', 'borel-lebeg', 'metriki-rho']
	},

	kompakt: {
		id: 'kompakt',
		term: 'Компакт',
		short: String.raw`Из любого открытого покрытия выделяется конечное подпокрытие.`,
		formula: String.raw`\forall\{U_{\alpha_i}\}:\ \bigcup_{i\in I}U_{\alpha_i}\supset X\ \Rightarrow\ \exists K\subset I,\ |K|<\aleph_0:\ \bigcup_{k\in K}U_{\alpha_k}\supset X`,
		body: String.raw`**Компакт** — подмножество топологического пространства, в котором из любого открытого [[otkrytoe-pokrytie|покрытия]] можно выделить конечное подпокрытие. Конечность записывается теоретико-множественно: $|K|<\aleph_0$.

Определение чисто покрытийное: ни метрика, ни ограниченность в него не входят, поэтому оно работает в любом топологическом пространстве. Условие «замкнуто и ограничено» — [[priznak-i-svoystvo|признак]] компактности, верный именно в $\mathbb R^n$: в метрическом пространстве $\mathbb Q$ множество $\mathbb Q\cap[0;2]$ замкнуто и ограничено, но компактом не является.

Отсюда все свойства компакта: [[bolcano-veyershtrass|бесконечное подмножество имеет предельную точку]], а любой приём вида «возьмём минимум из всех $\varepsilon$» становится законным.`,
		related: ['otkrytoe-pokrytie', 'borel-lebeg', 'bolcano-veyershtrass', 'zamknutoe-mnozhestvo']
	},

	'otkrytoe-pokrytie': {
		id: 'otkrytoe-pokrytie',
		term: 'Покрытие и подпокрытие',
		short: String.raw`Семейство открытых множеств, объединение которых содержит X.`,
		formula: String.raw`\bigcup_{k\in I}U_k\supset X,\qquad I_n\subset I,\ |I_n|=n\in\mathbb N_0`,
		body: String.raw`**Открытое покрытие** множества $X$ — семейство $\{U_k\}_{k\in I}$ открытых множеств, объединение которых содержит $X$. **Подпокрытие** — набор с меньшим множеством индексов, всё ещё покрывающий $X$.

Конечность подпокрытия записывается формулой: $|I_n|=n\in\mathbb N_0$ (равносильно $|K|<\aleph_0$). Это ключевая величина всех оценок: именно по конечному набору потом берут минимум радиусов. Пример: отрезок $[3;5]$, покрытый интервалами $(k-0{,}5;k+0{,}5)$ по всем рациональным $k$, — покрывающих множеств счётное число, ни одно из них по отдельности отрезок не накрывает, а хватает всего трёх.`,
		related: ['kompakt', 'borel-lebeg', 'brus']
	},

	'borel-lebeg': {
		id: 'borel-lebeg',
		term: 'Теорема Бореля–Лебега',
		short: String.raw`Из любого открытого покрытия отрезка выделяется конечное подпокрытие.`,
		formula: String.raw`\bigcup_{k\in I}U_k\supset[\alpha;\beta]\ \Longrightarrow\ \exists I_n\subset I,\ |I_n|=n:\ \bigcup_{k\in I_n}U_k\supset[\alpha;\beta]`,
		body: String.raw`**Теорема Бореля–Лебега** утверждает, что отрезок $[\alpha;\beta]$ — [[kompakt|компакт]]: из любого открытого [[otkrytoe-pokrytie|покрытия]] выделяется конечное подпокрытие. Доказательство ведётся **методом отмеченных точек**: от $\alpha$ продвигаются вправо шагами $\varepsilon_i/2$, каждый раз оставаясь внутри очередного элемента покрытия.

Из неё выводятся [[bolcano-veyershtrass|Больцано–Вейерштрасс]] и компактность [[brus|бруса]] в $\mathbb R^n$, а не наоборот.`,
		related: ['kompakt', 'otkrytoe-pokrytie', 'bolcano-veyershtrass', 'brus']
	},

	'bolcano-veyershtrass': {
		id: 'bolcano-veyershtrass',
		term: 'Теорема Больцано–Вейерштрасса',
		short: String.raw`Из ограниченной последовательности выделяется сходящаяся подпоследовательность.`,
		formula: String.raw`\forall (x_n)\subset[\alpha;\beta]\ \exists (x_{n_k}),\ x^*\in[\alpha;\beta]:\ \lim_{k\to\infty}x_{n_k}=x^*`,
		body: String.raw`Теорема имеет **две эквивалентные формы**. Через [[podposledovatelnost|подпоследовательности]]: из любой последовательности точек отрезка выделяется сходящаяся. Через множества: всякое бесконечное $M\subset[\alpha;\beta]$ имеет [[predelnaya-tochka|предельную точку]].

Обобщённая форма: если $X$ — [[kompakt|компакт]] и $M\subset X$ бесконечно, у $M$ есть предельная точка. Оговорка «бесконечное» обязательна: конечное множество компактно в любой топологии, а предельных точек не имеет. Обе формы получаются из [[borel-lebeg|Бореля–Лебега]] одним и тем же приёмом — переходом к конечному подпокрытию и подсчётом по кускам.`,
		related: ['borel-lebeg', 'predelnaya-tochka', 'podposledovatelnost', 'kompakt']
	},

	'predelnaya-tochka': {
		id: 'predelnaya-tochka',
		term: 'Предельная точка множества',
		short: String.raw`Точка, любая выколотая окрестность которой задевает множество.`,
		formula: String.raw`a\in M'\iff \forall U_a:\ \mathring U_a\cap M\neq\varnothing`,
		body: String.raw`$a$ — **предельная точка** множества $M$, если любая [[vykolotaya-okrestnost|выколотая окрестность]] $\mathring U_a$ пересекает $M$. Выколотость принципиальна: без неё каждая точка множества автоматически была бы предельной. Именно из-за выколотости появляется отдельный класс изолированных точек и работает равенство $\mathrm{cl}\,A=A'\cup\mathrm{Isol}(A)$. Пример: у множества $\{0\}\cup\{1/n\}$ предельная точка ровно одна — это $0$, а все точки $1/n$ изолированы.

Отрицание, которым пользуются в доказательствах: если $a$ не предельная, то $|U_a\cap M|\le 1$ — окрестность встречает $M$ разве что в самой $a$.`,
		related: ['vykolotaya-okrestnost', 'zamykanie', 'bolcano-veyershtrass', 'princip-dirikhle']
	},

	podposledovatelnost: {
		id: 'podposledovatelnost',
		term: 'Подпоследовательность (п.п.)',
		short: String.raw`Выбор членов по строго возрастающим номерам n₁ < n₂ < …`,
		formula: String.raw`y_k=x_{n_k},\qquad n_1<n_2<n_3<\dots`,
		body: String.raw`**Подпоследовательность** получается выбором членов по строго возрастающей последовательности номеров $n_1<n_2<\dots$. Предел наследуется: если $\lim x_n=x$, то и любая подпоследовательность сходится к $x$.

Не путать с [[chastichnaya-posledovatelnost|частичной последовательностью]] — хвостом $x_k,x_{k+1},\dots$: это частный случай, отвечающий выбору $n_j=k+j$. Различие видно на $x_n=(-1)^n$: ни один хвост не сходится, а подпоследовательность чётных номеров сходится к $1$. В [[bolcano-veyershtrass|Больцано–Вейерштрассе]] требуется именно произвольная подпоследовательность.`,
		related: ['chastichnaya-posledovatelnost', 'bolcano-veyershtrass', 'predelnaya-tochka']
	},

	'zamknutoe-mnozhestvo': {
		id: 'zamknutoe-mnozhestvo',
		term: 'Замкнутое множество',
		short: String.raw`Содержит свою границу: ∂U ⊂ U.`,
		formula: String.raw`U\ \text{замкнуто}\iff \partial U\cap U=\partial U\iff \partial U\subset U`,
		body: String.raw`Открытость и замкнутость характеризуются **через границу**: $U$ открыто, если $\partial U\cap U=\varnothing$, и замкнуто, если $\partial U\subset U$. Равносильная форма: замкнутое множество содержит все свои [[predelnaya-tochka|предельные точки]]. Пример: $\{1/n:\ n\in\mathbb N_1\}$ не замкнуто ($0$ лежит в границе, но не в множестве), а добавление нуля делает его замкнутым.

Рабочая связка: $U$ открыто $\Rightarrow$ его [[dopolnenie|дополнение]] $\overline U$ замкнуто, и наоборот — она позволяет добавить $\overline X$ к покрытию бруса. Вместе с [[ogranichennoe-mnozhestvo|ограниченностью]] замкнутость даёт признак компактности в $\mathbb R^n$.`,
		related: ['dopolnenie', 'zamykanie', 'kompakt', 'ogranichennoe-mnozhestvo']
	},

	'ogranichennoe-mnozhestvo': {
		id: 'ogranichennoe-mnozhestvo',
		term: 'Ограниченное множество в ℝⁿ',
		short: String.raw`Целиком помещается в один шар, то есть в один брус.`,
		formula: String.raw`\exists R>0:\ X\subset B_{\rho_\infty}(\vec 0,R)=[-R;R]^n`,
		body: String.raw`Множество $X\subset\mathbb R^n$ **ограничено**, если оно целиком лежит в каком-нибудь шаре. В чебышёвской метрике [[metriki-rho|$\rho_\infty$]] шар — куб, поэтому ограниченность равносильна вложению в [[brus|брус]] $[-R;R]^n$, и именно в такой форме она используется в доказательстве компактности.

Контрпример: $\mathbb R$ и $\mathbb N_1$ не ограничены и не компактны. Для прямой годится покрытие интервалами $(k-1;k+1)$, $k\in\mathbb Z$, из которого нечего выбросить: вместе с $(k-1;k+1)$ теряется точка $k$.`,
		related: ['brus', 'metriki-rho', 'zamknutoe-mnozhestvo', 'kompakt']
	},

	'ekvivalentnost-metrik': {
		id: 'ekvivalentnost-metrik',
		term: 'Эквивалентность метрик',
		short: String.raw`Метрики зажаты друг в друга константами — топология одна и та же.`,
		formula: String.raw`c\,\sigma(\vec x,\vec y)\le\rho(\vec x,\vec y)\le C\,\sigma(\vec x,\vec y),\qquad c,C>0`,
		body: String.raw`Метрики $\rho$ и $\sigma$ **эквивалентны**, если каждая зажата между двумя копиями другой с положительными константами. Тогда в любой шар одной вписывается шар другой, значит обе порождают одну топологию — а с ней одни и те же открытые множества, пределы и компакты.

В $\mathbb R^n$ все [[metriki-rho|метрики $\rho_k$]] эквивалентны: $\rho_\infty\le\rho_2\le\sqrt n\,\rho_\infty$. Поэтому компактность доказывают в удобной $\rho_\infty$. Конечномерность существенна: в пространстве финитных последовательностей вектор из $n$ единиц даёт $\rho_1=n$ при $\rho_\infty=1$, отношение неограниченно, общей константы нет — и замкнутый ограниченный шар там уже не компакт.`,
		related: ['metriki-rho', 'kompakt', 'brus']
	},

	'kantorovo-mnozhestvo': {
		id: 'kantorovo-mnozhestvo',
		term: 'Канторово множество',
		short: String.raw`Компакт нулевой длины и мощности континуума.`,
		formula: String.raw`X_0=[0;1],\quad X^{*}=\bigcap_{k\in\mathbb N_0}X_k,\quad |X_k|=\left(\tfrac23\right)^k`,
		body: String.raw`**Канторово множество** строится выбрасыванием средних третей: $X_0=[0;1]$, $X_1=[0;\frac13]\cup[\frac23;1]$, и так далее; $X^{*}$ — пересечение всей цепочки.

Каждое $X_k$ замкнуто и ограничено, поэтому $X^{*}$ — [[kompakt|компакт]]. Суммарная длина $(2/3)^k\to0$, а точек — [[kontinuum|континуум]]: точки $X^{*}$ это в точности троичные дроби с цифрами из $\{0,2\}$. Пример показывает, что компактность ничего не говорит о размере: нулевая длина уживается с мощностью всей прямой.`,
		related: ['kompakt', 'kontinuum', 'zamknutoe-mnozhestvo', 'brus']
	},

	kontinuum: {
		id: 'kontinuum',
		term: 'Мощность континуума',
		short: String.raw`𝔠 = 2^ℵ₀ = |ℝ|; равенство 𝔠 = ℵ₁ — это континуум-гипотеза.`,
		formula: String.raw`2^{\aleph_0}=\mathfrak c=|\mathbb R|`,
		body: String.raw`**Континуум** — мощность множества всех подмножеств счётного множества: $2^{\aleph_0}=\mathfrak c=|\mathbb R|$. Столько же точек у любого отрезка и у [[kantorovo-mnozhestvo|канторова множества]].

Равенство $\mathfrak c=\aleph_1$ — отдельное утверждение, **континуум-гипотеза**: она независима от ZFC (Гёдель, Коэн), из аксиом не выводится ни она, ни её отрицание. Поэтому мощность записывают через $2^{\aleph_0}$ или $\mathfrak c$ — тогда утверждение не зависит от принятия гипотезы.`,
		related: ['kantorovo-mnozhestvo', 'n-nol-n-odin']
	},

	'princip-dirikhle': {
		id: 'princip-dirikhle',
		term: 'Принцип Дирихле',
		short: String.raw`Бесконечное не раскладывается по конечному числу конечных кусков.`,
		formula: String.raw`|M|=\infty,\ M=\bigcup_{i=1}^{t}M_i\ \Longrightarrow\ \exists i:\ |M_i|=\infty`,
		body: String.raw`**Принцип Дирихле** («ящиков»): если бесконечное множество разложено на конечное число кусков, хотя бы один кусок бесконечен. Контрапозиция, которой пользуются в доказательстве: если все куски одноточечные, а их $t$ штук, то $|M|\le t$ — множество конечно.

Это рабочий шаг перехода от [[borel-lebeg|конечного подпокрытия]] к существованию [[predelnaya-tochka|предельной точки]]: куски — это $M\cap U_i$, каждый из них по предположению содержит не более одной точки, и оценка $|M|\le t$ противоречит бесконечности $M$.`,
		related: ['bolcano-veyershtrass', 'predelnaya-tochka', 'borel-lebeg']
	}
};
