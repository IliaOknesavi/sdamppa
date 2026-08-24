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
		body: String.raw`Близость измеряется четырьмя способами, и каждый следующий слабее предыдущего: модуль $|x-y|$ на прямой, норма $\lVert x-y\rVert$ в [[normirovannoe-prostranstvo|линейном пространстве]], расстояние $\rho(x,y)$ в [[metricheskoe-prostranstvo|метрическом]], [[okrestnost|окрестность]] $U_x$ в [[topologicheskoe-prostranstvo|топологическом]]. Переходы односторонние: модуль — частный случай нормы при $n=1$, норма порождает метрику $\rho(x,y)=\lVert x-y\rVert$, метрика порождает топологию своими шарами.`,
		related: ['metricheskoe-prostranstvo', 'topologicheskoe-prostranstvo', 'normirovannoe-prostranstvo', 'okrestnost']
	},

	'involyuciya-dopolneniya': {
		id: 'involyuciya-dopolneniya',
		term: 'Инволюция дополнения',
		short: String.raw`$A\mapsto\overline A$ — инволюция без неподвижных точек, отсюда чётность.`,
		formula: String.raw`\overline{\overline A}=A,\qquad A\ne\overline A`,
		body: String.raw`Взятие [[dopolnenie|дополнения]] — инволюция: применённое дважды, оно возвращает исходное множество, $\overline{\overline A}=A$. На наборе [[komponenta-svyaznosti|открыто-замкнутых множеств]] оно действует в себя, потому что дополнение открыто-замкнутого снова открыто-замкнуто, и неподвижных точек в непустом пространстве не имеет.`,
		related: ['dopolnenie', 'komponenta-svyaznosti', 'zamknutoe-mnozhestvo']
	},

	'konechnost-peresecheniya': {
		id: 'konechnost-peresecheniya',
		term: 'Конечность пересечения в аксиоме топологии',
		short: String.raw`Объединения — любые, пересечения — только конечные.`,
		formula: String.raw`U_1\cap\dots\cap U_k\in\tau,\qquad \bigcap_{n\in\mathbb N_1}\left(-\tfrac1n;\tfrac1n\right)=\{0\}\notin\tau_{\mathbb R}`,
		body: String.raw`Третья аксиома топологии допускает только конечные пересечения, и ограничение существенно: $\bigcap_{n\in\mathbb N_1}\left(-\frac1n;\frac1n\right)=\{0\}$, потому что ноль лежит во всех интервалах, а любое $x\ne0$ выпадает при $n>\frac1{|x|}$. Одноточечное множество не содержит интервала и в топологии прямой не лежит — бесконечное пересечение вывело из $\tau$.`,
		related: ['topologiya', 'otkrytoe-mnozhestvo', 'inducirovannaya-topologiya', 'shar']
	},

	'otsechenie-hvosta': {
		id: 'otsechenie-hvosta',
		term: 'Отсечение хвоста',
		short: String.raw`За номером $N(\varepsilon)$ — весь хвост в шаре, до него — конечный набор.`,
		formula: String.raw`\{x_n\}=\underbrace{\{x_1,\dots,x_N\}}_{\text{конечно}}\cup\underbrace{\{x_n: n>N(\varepsilon)\}}_{\subset B_\varepsilon(A)}`,
		body: String.raw`Сходимость разрезает последовательность на две части: хвост целиком лежит в шаре $B_\varepsilon(A)$, а до номера $N(\varepsilon)$ остаётся конечный набор членов. Конечный набор поддаётся прямому перебору — у него есть максимум и минимум, он ограничен, любое его свойство проверяется за конечное число шагов.`,
		related: ['n-ot-epsilon', 'ogranichennost-posledovatelnosti', 'chastichnaya-posledovatelnost', 'sup-inf-shodyashcheysya']
	},

	'sup-inf-shodyashcheysya': {
		id: 'sup-inf-shodyashcheysya',
		term: 'sup и inf сходящейся последовательности',
		short: String.raw`Либо супремум достигается на члене, либо он равен пределу.`,
		formula: String.raw`\lim x_n=A\ \Rightarrow\ \sup\{x_n\}=\max_{n\le N}x_n\ \ \text{или}\ \ \sup\{x_n\}=A`,
		body: String.raw`Если $\lim x_n=A$, то [[supremum|супремум]] множества членов существует, не меньше $A$, и возможны ровно два случая: он равен $A$ либо достигается на одном из первых $N\bigl(\frac{S-A}{2}\bigr)$ членов. Для [[infimum|инфимума]] всё то же после замены $x_n\mapsto-x_n$.`,
		related: ['supremum', 'infimum', 'nedostizhimyy-supremum', 'predel-posledovatelnosti']
	}
};
