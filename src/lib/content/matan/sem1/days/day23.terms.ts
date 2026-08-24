import type { Glossary } from '$lib/types';

// Термины дня 23 (компакты в R^n, Больцано–Вейерштрасс, канторово множество).
// Часть карточек повторяет понятия, введённые в [днях 20–22](/aii/matan/1/day/20) (компакт, покрытие,
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
		body: String.raw`**$n$-мерный брус** — множество точек $(\xi_1,\dots,\xi_n)$, у которых каждая координата пробегает свой отрезок: $\xi_i\in[a_i;b_i]$. При $n=1$ это отрезок, при $n=2$ — прямоугольник, при $n=3$ — параллелепипед. Открытый шар чебышёвской метрики [[metriki-rho|$\rho_\infty$]] — это в точности открытый куб, поэтому [[ogranichennoe-mnozhestvo|ограниченность]] в $\mathbb R^n$ читают как «влезает в брус».`,
		related: ['kompakt', 'ogranichennoe-mnozhestvo', 'borel-lebeg', 'metriki-rho']
	},

	'bolcano-veyershtrass': {
		id: 'bolcano-veyershtrass',
		term: 'Теорема Больцано–Вейерштрасса',
		short: String.raw`Из ограниченной последовательности выделяется сходящаяся подпоследовательность.`,
		formula: String.raw`\forall (x_n)\subset[\alpha;\beta]\ \exists (x_{n_k}),\ x^*\in[\alpha;\beta]:\ \lim_{k\to\infty}x_{n_k}=x^*`,
		body: String.raw`Теорема имеет **две эквивалентные формы**. Через [[podposledovatelnost|подпоследовательности]]: из любой последовательности точек отрезка выделяется сходящаяся. Через множества: всякое бесконечное $M\subset[\alpha;\beta]$ имеет [[predelnaya-tochka|предельную точку]]. Обобщённая форма: если $X$ — [[kompakt|компакт]] и $M\subset X$ бесконечно, у $M$ есть предельная точка; оговорка «бесконечное» обязательна — конечное множество компактно в любой топологии, а предельных точек не имеет.`,
		related: ['borel-lebeg', 'predelnaya-tochka', 'podposledovatelnost', 'kompakt']
	},

	'ogranichennoe-mnozhestvo': {
		id: 'ogranichennoe-mnozhestvo',
		term: 'Ограниченное множество в ℝⁿ',
		short: String.raw`Целиком помещается в один шар, то есть в один брус.`,
		formula: String.raw`\exists R>0:\ X\subset B_{\rho_\infty}(\vec 0,R)=[-R;R]^n`,
		body: String.raw`Множество $X\subset\mathbb R^n$ **ограничено**, если оно целиком лежит в каком-нибудь шаре. В чебышёвской метрике [[metriki-rho|$\rho_\infty$]] шар — куб, поэтому ограниченность равносильна вложению в [[brus|брус]] $[-R;R]^n$.`,
		related: ['brus', 'metriki-rho', 'zamknutoe-mnozhestvo', 'kompakt']
	},

	'ekvivalentnost-metrik': {
		id: 'ekvivalentnost-metrik',
		term: 'Эквивалентность метрик',
		short: String.raw`Метрики зажаты друг в друга константами — топология одна и та же.`,
		formula: String.raw`c\,\sigma(\vec x,\vec y)\le\rho(\vec x,\vec y)\le C\,\sigma(\vec x,\vec y),\qquad c,C>0`,
		body: String.raw`Метрики $\rho$ и $\sigma$ **эквивалентны**, если каждая зажата между двумя копиями другой с положительными константами. Тогда в любой шар одной вписывается шар другой, значит обе порождают одну топологию — с теми же открытыми множествами, пределами и компактами. В $\mathbb R^n$ все [[metriki-rho|метрики $\rho_k$]] эквивалентны ($\rho_\infty\le\rho_2\le\sqrt n\,\rho_\infty$), но конечномерность существенна: в пространстве финитных последовательностей вектор из $n$ единиц даёт $\rho_1=n$ при $\rho_\infty=1$, и замкнутый ограниченный шар там уже не [[kompakt|компакт]].`,
		related: ['metriki-rho', 'kompakt', 'brus']
	},

	'kantorovo-mnozhestvo': {
		id: 'kantorovo-mnozhestvo',
		term: 'Канторово множество',
		short: String.raw`Компакт нулевой длины и мощности континуума.`,
		formula: String.raw`X_0=[0;1],\quad X^{*}=\bigcap_{k\in\mathbb N_0}X_k,\quad |X_k|=\left(\tfrac23\right)^k`,
		body: String.raw`**Канторово множество** строится выбрасыванием средних третей: $X_0=[0;1]$, $X_1=[0;\frac13]\cup[\frac23;1]$, и так далее; $X^{*}$ — пересечение всей цепочки. Каждое $X_k$ замкнуто и ограничено, поэтому $X^{*}$ — [[kompakt|компакт]]. Суммарная длина $(2/3)^k\to0$, а точек — [[kontinuum|континуум]]: точки $X^{*}$ это в точности троичные дроби с цифрами из $\{0,2\}$.`,
		related: ['kompakt', 'kontinuum', 'zamknutoe-mnozhestvo', 'brus']
	},

	kontinuum: {
		id: 'kontinuum',
		term: 'Мощность континуума',
		short: String.raw`𝔠 = 2^ℵ₀ = |ℝ|; равенство 𝔠 = ℵ₁ — это континуум-гипотеза.`,
		formula: String.raw`2^{\aleph_0}=\mathfrak c=|\mathbb R|`,
		body: String.raw`**Континуум** — мощность множества всех подмножеств счётного множества: $2^{\aleph_0}=\mathfrak c=|\mathbb R|$. Столько же точек у любого отрезка и у [[kantorovo-mnozhestvo|канторова множества]]. Равенство $\mathfrak c=\aleph_1$ — не определение, а отдельное утверждение, **континуум-гипотеза**: она независима от ZFC, поэтому мощность записывают через $2^{\aleph_0}$ или $\mathfrak c$.`,
		related: ['kantorovo-mnozhestvo', 'n-nol-n-odin']
	},

	'princip-dirikhle': {
		id: 'princip-dirikhle',
		term: 'Принцип Дирихле',
		short: String.raw`Бесконечное не раскладывается по конечному числу конечных кусков.`,
		formula: String.raw`|M|=\infty,\ M=\bigcup_{i=1}^{t}M_i\ \Longrightarrow\ \exists i:\ |M_i|=\infty`,
		body: String.raw`**Принцип Дирихле** («ящиков»): если бесконечное множество разложено на конечное число кусков, хотя бы один кусок бесконечен. Контрапозиция, которой пользуются в доказательстве [[bolcano-veyershtrass|Больцано–Вейерштрасса]]: если все куски одноточечные, а их $t$ штук, то $|M|\le t$ — множество конечно.`,
		related: ['bolcano-veyershtrass', 'predelnaya-tochka', 'borel-lebeg']
	}
};
