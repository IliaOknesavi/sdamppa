import type { Glossary } from '$lib/types';

// Термины дня 21 (фундаментальность и полнота). Понятия, которые живут
// в каноническом глоссарии нотации курса (glossary.ts), здесь НЕ дублируются
// и подключаются перекрёстными ссылками [[...]]:
//   skhodyashchayasya-v-sebe, chastichnaya-posledovatelnost, priznak-i-svoystvo,
//   metriki-rho, n-nol-n-odin, zamykanie, blacksquare.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
export const day21Terms: Glossary = {
	polnota: {
		id: 'polnota',
		term: 'Полнота метрического пространства',
		short: String.raw`Всякая сходящаяся в себе последовательность имеет предел внутри пространства.`,
		formula: String.raw`(M,\rho)\ \text{полно}\iff \bigl(x_n\ \text{сх. в себе}\Rightarrow \exists\lim x_n\in M\bigr)`,
		body: String.raw`Метрическое пространство $(M,\rho)$ **полно**, если каждая [[skhodyashchayasya-v-sebe|сходящаяся в себе]] последовательность его точек сходится, причём предел принадлежит $M$. Обратная импликация выполняется всегда и ни в какой полноте не нуждается, поэтому в полном пространстве фундаментальность и сходимость — одно и то же.

Полнота — свойство пары «множество плюс [[metricheskoe-prostranstvo|метрика]]», а не одного множества: $\mathbb R^m$ полно, $\mathbb Q$ нет, $\mathbb R^3$ без координатной плоскости — тоже нет. Неполное пространство всегда можно достроить [[popolnenie|пополнением]].`,
		related: ['skhodyashchayasya-v-sebe', 'kriteriy-polnoty-rm', 'popolnenie', 'metricheskoe-prostranstvo']
	},

	popolnenie: {
		id: 'popolnenie',
		term: 'Пополнение метрического пространства',
		short: String.raw`Достройка неполного пространства до полного, в котором оно плотно.`,
		formula: String.raw`M\subset\widehat M,\qquad \operatorname{cl}M=\widehat M,\qquad \widehat M\ \text{полно}`,
		body: String.raw`**Пополнение** $\widehat M$ неполного пространства $M$ — полное пространство, в которое $M$ вкладывается с сохранением расстояний и в котором $M$ плотно: $\operatorname{cl}M=\widehat M$ в смысле [[zamykanie|замыкания]]. Каноническая иллюстрация — $\mathbb R$ как пополнение $\mathbb Q$: «дырки», на которые указывают фундаментальные последовательности рациональных, объявляются новыми точками.

В курсе пополнение упоминается как выход из ситуации, когда [[polnota|полноты]] нет, а работать нужно: там, где схема «ограниченность плюс компактность» не применима, пространство достраивают.`,
		related: ['polnota', 'zamykanie', 'metricheskoe-prostranstvo']
	},

	'kriteriy-polnoty-rm': {
		id: 'kriteriy-polnoty-rm',
		term: 'Критерий фундаментальности в ℝᵐ',
		short: String.raw`В $\mathbb R^m$ сходимость в себе равносильна сходимости.`,
		formula: String.raw`\text{в }\mathbb R^m:\quad x_n\ \text{сх. в себе}\iff x_n\ \text{сходится}`,
		body: String.raw`Главная теорема дня: пространство $\mathbb R^m$ [[polnota|полно]], то есть в нём фундаментальность и сходимость эквивалентны. В литературе это «критерий Коши», но в курсе фамилия не употребляется.

Доказательство — трёхшаговая сборка уже готовых утверждений: [[ogranichennost-fundamentalnoy|ограниченность]] загоняет последовательность в [[zamknutyy-shar|замкнутый шар]], [[kompakt|компактность]] шара даёт сходящуюся [[podposledovatelnost|подпоследовательность]], а фундаментальность подтягивает к её пределу всю последовательность. Обратная сторона эквивалентности верна в любом метрическом пространстве.`,
		related: ['polnota', 'ogranichennost-fundamentalnoy', 'kompakt', 'podposledovatelnost']
	},

	'ogranichennost-fundamentalnoy': {
		id: 'ogranichennost-fundamentalnoy',
		term: 'Ограниченность сходящейся в себе',
		short: String.raw`Фундаментальная последовательность целиком помещается в один шар.`,
		formula: String.raw`x_n\ \text{сх. в себе}\Rightarrow \exists x_0,R:\ \forall n\ \rho(x_n,x_0)\le R`,
		body: String.raw`Теорема: всякая [[skhodyashchayasya-v-sebe|сходящаяся в себе]] последовательность [[ogranichennaya-posledovatelnost|ограничена]]. Доказательство в курсе ведётся с **конкретным** числом $\varepsilon=200$ вместо абстрактного эпсилон (дидактический ход: «любое фиксированное $\varepsilon$ годится») и с центром в члене $x_{2N}$ — индекс $2N$ выбран, чтобы гарантированно $2N>N$.

Хвост попадает в шар радиуса 200, конечная голова добирается увеличением радиуса до максимума конечного набора расстояний. Обратное неверно: последовательность $0,1,0,1,\dots$ ограничена, но не фундаментальна — ограниченность здесь [[priznak-i-svoystvo|свойство, а не признак]].`,
		related: ['skhodyashchayasya-v-sebe', 'ogranichennaya-posledovatelnost', 'zamknutyy-shar', 'priznak-i-svoystvo']
	},

	'ogranichennaya-posledovatelnost': {
		id: 'ogranichennaya-posledovatelnost',
		term: 'Ограниченная последовательность',
		short: String.raw`Все члены лежат в одном шаре фиксированного радиуса.`,
		formula: String.raw`\exists x_0\in M,\ R>0:\ \forall n\ \ \rho(x_n,x_0)\le R`,
		body: String.raw`Последовательность в [[metricheskoe-prostranstvo|метрическом пространстве]] **ограничена**, если существует точка $x_0$ и радиус $R$, такие что все члены лежат в [[zamknutyy-shar|замкнутом шаре]] $\overline B_R(x_0)$. В $\mathbb R$ это привычное $|x_n|\le R$, но формулировка через шар переносится на любую метрику без изменений — в том числе на $\rho_\infty$ и остальные [[metriki-rho|метрики курса]].

Выбор центра не важен: сдвиг центра на конечное расстояние компенсируется увеличением радиуса по [[neravenstvo-treugolnika|неравенству треугольника]].`,
		related: ['metricheskoe-prostranstvo', 'zamknutyy-shar', 'neravenstvo-treugolnika', 'metriki-rho']
	},

	podposledovatelnost: {
		id: 'podposledovatelnost',
		term: 'Подпоследовательность',
		short: String.raw`Выборка членов по строго возрастающим номерам $n_1<n_2<\dots$`,
		formula: String.raw`n_1<n_2<\dots,\qquad k\mapsto x_{n_k}`,
		body: String.raw`**Подпоследовательность** $x_{n_k}$ — композиция исходной последовательности со строго возрастающим отображением $k\mapsto n_k$ из $\mathbb N_1$ в $\mathbb N_1$. Из строгого возрастания следует $n_k\ge k$, а значит $n_k\to\infty$ — именно это позволяет в доказательствах брать $n_k$ больше любого наперёд заданного номера.

⚠️ Не путать с [[chastichnaya-posledovatelnost|частичной последовательностью]]: у преподавателя так называется **хвост** $x_k,x_{k+1},\dots$, то есть частный случай подпоследовательности. Ключевой факт дня: фундаментальная последовательность со сходящейся подпоследовательностью сходится сама.`,
		related: ['chastichnaya-posledovatelnost', 'kriteriy-polnoty-rm', 'predel-posledovatelnosti']
	},

	'epsilon-indeksaciya': {
		id: 'epsilon-indeksaciya',
		term: 'Индексация эпсилонов и номеров',
		short: String.raw`Своя пара $(\varepsilon,N)$ у каждого объекта, а не безымянные $\varepsilon$ и $N$.`,
		formula: String.raw`\varepsilon_f,N_f\ (\text{сходимость});\quad \varepsilon_\varphi,N_\varphi\ (\text{фундаментальность})`,
		body: String.raw`Сквозное методическое требование курса: эпсилоны и номера **именуются по объекту**, к которому относятся. У сходимости пара $(\varepsilon_f,N_f)$, у фундаментальности — $(\varepsilon_\varphi,N_\varphi)$, у [[podposledovatelnost|подпоследовательности]] — $(\varepsilon_{f_{n_k}},N_{f_{n_k}})$. Дополнительно всегда подчёркивается зависимость $N=N(\varepsilon)$.

Это снимает главную ошибку студентов — «чей это $N$». В доказательствах дня разные эпсилоны связываются явно: $\varepsilon_f=\varepsilon_\varphi/2$, а номера согласуются через $\max$ с половинками $\varepsilon/2$.`,
		related: ['predel-posledovatelnosti', 'skhodyashchayasya-v-sebe', 'blacksquare']
	},

	'neravenstvo-treugolnika': {
		id: 'neravenstvo-treugolnika',
		term: 'Неравенство треугольника',
		short: String.raw`Третья аксиома метрики: обход через точку не короче прямого пути.`,
		formula: String.raw`\rho(x,z)\le\rho(x,y)+\rho(y,z)`,
		body: String.raw`Аксиома [[metricheskoe-prostranstvo|метрики]]: $\rho(x,z)\le\rho(x,y)+\rho(y,z)$ для любых трёх точек. В анализе это главный рабочий инструмент: любое расстояние разрывается вставкой промежуточной точки, и каждая половина оценивается отдельно.

Все доказательства дня — вариации одного приёма. В теореме «сходимость влечёт фундаментальность» промежуточной точкой служит предел $f$, в теореме о [[podposledovatelnost|подпоследовательности]] — член $f_{n_k}$. Оба захода тратят по $\varepsilon/2$: неравенство складывает расходы, поэтому бюджет делится пополам.`,
		related: ['metricheskoe-prostranstvo', 'metriki-rho', 'epsilon-indeksaciya']
	},

	'metricheskoe-prostranstvo': {
		id: 'metricheskoe-prostranstvo',
		term: 'Метрическое пространство',
		short: String.raw`Пара $(M,\rho)$: множество и функция расстояния на нём.`,
		formula: String.raw`\rho:M\times M\to\mathbb R_{\ge0},\quad \rho(x,y)=0\iff x=y`,
		body: String.raw`**Метрическое пространство** — пара $(M,\rho)$, где $\rho$ удовлетворяет аксиомам невырожденности, симметричности и [[neravenstvo-treugolnika|неравенства треугольника]]. Курс работает не с одной евклидовой метрикой, а сразу с [[metriki-rho|семейством]] $\rho_1,\rho_2,\rho_k,\rho_\infty$.

Все понятия дня формулируются здесь, а $\mathbb R$ и $\mathbb R^m$ идут как частные случаи: фундаментальность, [[ogranichennaya-posledovatelnost|ограниченность]] и [[polnota|полнота]] определяются через $\rho$, и только критерий из последней теоремы специфичен для $\mathbb R^m$.`,
		related: ['metriki-rho', 'neravenstvo-treugolnika', 'polnota', 'zamknutyy-shar']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`$\rho(f_n,f)<\varepsilon_f$ для всех $n>N_f(\varepsilon_f)$.`,
		formula: String.raw`\forall\varepsilon_f>0\ \exists N_f\in\mathbb N_1:\ \forall n>N_f\ \ \rho(f_n,f)<\varepsilon_f`,
		body: String.raw`Последовательность $f:\mathbb N_1\to M$ сходится к $f\in M$, если для любого $\varepsilon_f>0$ найдётся номер $N_f$, начиная с которого все члены ближе $\varepsilon_f$ к пределу. Номера берутся из [[n-nol-n-odin|$\mathbb N_1$]], а доказательство считается законченным только тогда, когда выписана явная зависимость $N_f(\varepsilon_f)$.

Отличие от [[skhodyashchayasya-v-sebe|фундаментальности]] — в присутствии точки $f$: сходимость сравнивает члены с внешним объектом, фундаментальность — только друг с другом. Предел в метрическом пространстве единственен, и этим постоянно пользуются в задачах на [[polnota|полноту]].`,
		related: ['skhodyashchayasya-v-sebe', 'n-nol-n-odin', 'epsilon-indeksaciya', 'polnota']
	},

	'zamknutyy-shar': {
		id: 'zamknutyy-shar',
		term: 'Замкнутый шар',
		short: String.raw`$\overline B_r(x_0)$ — точки на расстоянии не больше $r$ от центра.`,
		formula: String.raw`\overline B_r(x_0)=\{x\in M:\ \rho(x,x_0)\le r\}`,
		body: String.raw`**Замкнутый шар** $\overline B_r(x_0)$ отличается от открытого нестрогим неравенством: граница включена. Форма шара зависит от [[metriki-rho|метрики]] — в $\rho_\infty$ это куб, в $\rho_1$ — октаэдр, и только в $\rho_2$ он круглый.

В сегодняшней схеме шар — рабочий инструмент: теорема об [[ogranichennost-fundamentalnoy|ограниченности]] загоняет в него всю последовательность, а замкнутость нужна, чтобы шар оказался [[kompakt|компактом]] в $\mathbb R^m$ и предел подпоследовательности не выпал наружу.`,
		related: ['metricheskoe-prostranstvo', 'metriki-rho', 'kompakt', 'ogranichennost-fundamentalnoy']
	},

	kompakt: {
		id: 'kompakt',
		term: 'Компакт',
		short: String.raw`Из любой последовательности извлекается сходящаяся подпоследовательность.`,
		body: String.raw`**Компакт** — множество, в котором любая последовательность точек имеет [[podposledovatelnost|подпоследовательность]], сходящуюся к точке этого же множества (в курсе компактность вводится и через покрытия, и разбирается в дне 22). Ключевой факт для $\mathbb R^m$: компакты — это в точности замкнутые ограниченные множества, поэтому [[zamknutyy-shar|замкнутый шар]] компактен.

В доказательстве [[kriteriy-polnoty-rm|критерия в $\mathbb R^m$]] компактность шара берётся как **уже известный факт**, хотя разбирается позже — логический порядок курса в этом месте перевёрнут, и это стоит держать в голове при подготовке к КЛК2.`,
		related: ['zamknutyy-shar', 'podposledovatelnost', 'kriteriy-polnoty-rm', 'polnota']
	}
};
