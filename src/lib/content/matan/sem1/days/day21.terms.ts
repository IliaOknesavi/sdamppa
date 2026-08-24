import type { Glossary } from '$lib/types';

// Термины дня 21 (фундаментальность и полнота). Понятия, которые живут
// в каноническом глоссарии (glossary.ts), здесь НЕ дублируются
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
		body: String.raw`Метрическое пространство **полно**, если каждая [[skhodyashchayasya-v-sebe|сходящаяся в себе]] последовательность его точек имеет предел, принадлежащий этому же пространству. Это свойство пары «множество и метрика», а не одного множества.`,
		related: ['skhodyashchayasya-v-sebe', 'aksiomy-metriki', 'polnota-r']
	},

	popolnenie: {
		id: 'popolnenie',
		term: 'Пополнение метрического пространства',
		short: String.raw`Достройка неполного пространства до полного, в котором оно плотно.`,
		formula: String.raw`M\subset\widehat M,\qquad \operatorname{cl}M=\widehat M,\qquad \widehat M\ \text{полно}`,
		body: String.raw`**Пополнение** $\widehat M$ неполного пространства $M$ — [[polnota|полное]] пространство, в которое $M$ вкладывается с сохранением расстояний и в котором $M$ плотно: $\operatorname{cl}M=\widehat M$ в смысле [[zamykanie|замыкания]]. Оно существует у любого [[metricheskoe-prostranstvo|метрического пространства]] и единственно с точностью до изометрии. Каноническая иллюстрация — $\mathbb R$ как пополнение $\mathbb Q$: «дырки», на которые указывают фундаментальные последовательности рациональных, объявляются новыми точками.`,
		related: ['polnota', 'zamykanie', 'metricheskoe-prostranstvo']
	},

	'kriteriy-polnoty-rm': {
		id: 'kriteriy-polnoty-rm',
		term: 'Критерий фундаментальности в ℝᵐ',
		short: String.raw`В $\mathbb R^m$ сходимость в себе равносильна сходимости.`,
		formula: String.raw`\text{в }\mathbb R^m:\quad x_n\ \text{сх. в себе}\iff x_n\ \text{сходится}`,
		body: String.raw`Главная теорема дня: пространство $\mathbb R^m$ [[polnota|полно]], то есть [[skhodyashchayasya-v-sebe|сходимость в себе]] и сходимость в нём эквивалентны. Другое имя того же утверждения — критерий Коши. Обратная сторона эквивалентности верна в любом метрическом пространстве.`,
		related: ['polnota', 'ogranichennost-fundamentalnoy', 'kompakt', 'podposledovatelnost']
	},

	'ogranichennost-fundamentalnoy': {
		id: 'ogranichennost-fundamentalnoy',
		term: 'Ограниченность сходящейся в себе',
		short: String.raw`Фундаментальная последовательность целиком помещается в один шар.`,
		formula: String.raw`x_n\ \text{сх. в себе}\Rightarrow \exists x_0,R:\ \forall n\ \rho(x_n,x_0)\le R`,
		body: String.raw`Теорема: всякая [[skhodyashchayasya-v-sebe|сходящаяся в себе]] последовательность [[ogranichennaya-posledovatelnost|ограничена]] — целиком помещается в один [[zamknutyy-shar|шар]]. Обратное неверно: последовательность $0,1,0,1,\dots$ ограничена, но не фундаментальна, так что ограниченность здесь [[priznak-i-svoystvo|свойство, а не признак]].`,
		related: ['skhodyashchayasya-v-sebe', 'ogranichennaya-posledovatelnost', 'zamknutyy-shar', 'priznak-i-svoystvo']
	},

	'epsilon-indeksaciya': {
		id: 'epsilon-indeksaciya',
		term: 'Индексация эпсилонов и номеров',
		short: String.raw`Своя пара $(\varepsilon,N)$ у каждого объекта, а не безымянные $\varepsilon$ и $N$.`,
		formula: String.raw`\varepsilon_f,N_f\ (\text{сходимость});\quad \varepsilon_\varphi,N_\varphi\ (\text{фундаментальность})`,
		body: String.raw`Соглашение записи: эпсилоны и номера **именуются по объекту**, к которому относятся, — индекс отвечает на вопрос «чей это $N$». У сходимости пара $(\varepsilon_f,N_f)$, у фундаментальности — $(\varepsilon_\varphi,N_\varphi)$, у [[podposledovatelnost|подпоследовательности]] — $(\varepsilon_{f_{n_k}},N_{f_{n_k}})$. Дополнительно всегда подчёркивается зависимость [[n-ot-epsilon|$N=N(\varepsilon)$]].`,
		related: ['predel-posledovatelnosti', 'skhodyashchayasya-v-sebe', 'n-ot-epsilon']
	},

	kompakt: {
		id: 'kompakt',
		term: 'Компакт',
		short: String.raw`Из любой последовательности извлекается сходящаяся подпоследовательность.`,
		body: String.raw`Множество, в котором всякая [[posledovatelnost|последовательность]] точек имеет [[podposledovatelnost|подпоследовательность]], сходящуюся к точке этого же множества. В $\mathbb R^m$ компакты — это в точности замкнутые ограниченные множества.`,
		related: ['podposledovatelnost', 'zamykanie', 'lsk']
	}
};
