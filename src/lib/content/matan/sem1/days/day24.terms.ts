import type { Glossary } from '$lib/types';

// =====================================================================
//  Термины дня 24 «Числовые ряды: определение, необходимый признак,
//  критерий Коши». Карточки из прошлых дней (последовательность, предел
//  последовательности, полнота) продублированы намеренно: день должен
//  резолвиться независимо. Канонический глоссарий склеивается последним
//  и перекрывает совпадения.
// =====================================================================

export const day24Terms: Glossary = {
	'chastichnaya-summa': {
		id: 'chastichnaya-summa',
		term: 'Частичная сумма',
		short: String.raw`$S_i$ — сумма первых $i$ членов; снова последовательность.`,
		formula: String.raw`S_i=\sum_{k=1}^{i}a_k,\qquad i\in\mathbb N_1`,
		body: String.raw`$S_i=a_1+\dots+a_i$ — сумма первых $i$ членов [[posledovatelnost|последовательности]]. Главное здесь то, что $S_i$ сама последовательность, поэтому весь аппарат [[predel-posledovatelnosti|предела]] переносится на ряды без новой теории.`,
		related: ['posledovatelnost', 'predel-posledovatelnosti']
	},

	'chislovoy-ryad': {
		id: 'chislovoy-ryad',
		term: 'Числовой ряд',
		short: String.raw`Предельный объект над частичными суммами при $i\to\infty$.`,
		formula: String.raw`\sum_{k=1}^{\infty}a_k`,
		body: String.raw`**Ряд** вводится как предельный объект: от [[chastichnaya-summa|частичных сумм]] $S_i$ переходят к $i\to\infty$ и получают символ $\sum_{k=1}^{\infty}a_k$. Слово «ряд» закреплено за самим этим символом. С ним связаны две разные последовательности — членов $(a_k)$ и частичных сумм $(S_i)$, и путать их нельзя: у $\sum\frac1n$ первая сходится к нулю, а вторая предела не имеет.`,
		related: ['chastichnaya-summa', 'skhodimost-ryada', 'raskhodimost-ryada']
	},

	'skhodimost-ryada': {
		id: 'skhodimost-ryada',
		term: 'Сходимость ряда',
		short: String.raw`Существует предел частичных сумм; он и есть сумма ряда.`,
		formula: String.raw`\exists c:\ \lim_{i\to\infty}S_i=c`,
		body: String.raw`[[chislovoy-ryad|Ряд]] **сходится**, если у последовательности [[chastichnaya-summa|частичных сумм]] есть [[predel-posledovatelnosti|предел]] $c$; это число называют суммой ряда. Определение опирается напрямую на предел последовательности в $\mathbb R$ (а значит переносится в любое метрическое и нормированное пространство), без отдельного разговора о «конечности суммы». Равносильные переформулировки: [[kriteriy-koshi-ryad|критерий Коши]] и таяние [[ostatok-ryada|остатка]].`,
		related: ['chislovoy-ryad', 'raskhodimost-ryada', 'kriteriy-koshi-ryad', 'ostatok-ryada']
	},

	'raskhodimost-ryada': {
		id: 'raskhodimost-ryada',
		term: 'Расходимость ряда',
		short: String.raw`Предела частичных сумм не существует — любого, не только бесконечного.`,
		formula: String.raw`\nexists c:\ \lim_{i\to\infty}S_i=c`,
		body: String.raw`**Расходимость** — это отрицание [[skhodimost-ryada|сходимости]]: предела у [[chastichnaya-summa|частичных сумм]] нет. В один класс попадают и $\sum n^2$ (уходит на бесконечность), и $\sum(-1)^n$ (болтается между значениями). На практике расходимость доказывают в блочной форме — отрицанием [[kriteriy-koshi-ryad|критерия Коши]]: $\exists\varepsilon>0\ \forall N\ \exists n>N,\exists p:\ |a_{n+1}+\dots+a_{n+p}|\ge\varepsilon$. Так разбирается [[garmonicheskiy-ryad|гармонический ряд]].`,
		related: ['skhodimost-ryada', 'kriteriy-koshi-ryad', 'garmonicheskiy-ryad']
	},

	'neobkhodimyy-priznak': {
		id: 'neobkhodimyy-priznak',
		term: 'Необходимый признак сходимости ряда',
		short: String.raw`Сходится $\Rightarrow$ член стремится к нулю. Обратное неверно.`,
		formula: String.raw`\sum_{n=1}^{\infty}a_n\ \text{сходится}\ \Longrightarrow\ \lim_{n\to\infty}a_n=0`,
		body: String.raw`Если [[chislovoy-ryad|ряд]] [[skhodimost-ryada|сходится]], то $\lim a_n=0$. Строго говоря, это [[priznak-i-svoystvo|свойство]] сходящегося ряда, а не признак: полезен он контрапозицией — из $a_n\not\to0$ следует [[raskhodimost-ryada|расходимость]]. Обращение ложно, контрпример — [[garmonicheskiy-ryad|гармонический ряд]].`,
		related: ['skhodimost-ryada', 'garmonicheskiy-ryad', 'kriteriy-koshi-ryad', 'priznak-i-svoystvo']
	},

	'kriteriy-koshi-ryad': {
		id: 'kriteriy-koshi-ryad',
		term: 'Критерий Коши для рядов',
		short: String.raw`Блок $a_{n+1}+\dots+a_{n+p}$ мал сразу для всех длин $p$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\ \forall n>N\ \forall p\in\mathbb N_1:\ |a_{n+1}+\dots+a_{n+p}|<\varepsilon`,
		body: String.raw`Ряд сходится тогда и только тогда, когда блок $a_{n+1}+\dots+a_{n+p}$ мал сразу для всех длин $p$. Это определение [[skhodyashchayasya-v-sebe|сходимости в себе]] для [[chastichnaya-summa|частичных сумм]], а в $\mathbb R$ она равносильна сходимости.`,
		related: ['chastichnaya-summa', 'skhodyashchayasya-v-sebe', 'polnota-r']
	},

	'ostatok-ryada': {
		id: 'ostatok-ryada',
		term: 'Остаток ряда (остаточный хвост)',
		short: String.raw`$r_m=c-S_m$ — то, что осталось после $m$-го члена.`,
		formula: String.raw`r_m=\sum_{n=m+1}^{\infty}a_n=c-S_m`,
		body: String.raw`**Остаток** — хвост [[chislovoy-ryad|ряда]], начинающийся с номера $m+1$; равносильно $r_m=c-S_m$, то есть погрешность обрыва ряда на $m$-м члене. Теорема об остаточном хвосте: ряд [[skhodimost-ryada|сходится]] $\iff$ все остатки существуют и $r_m\to0$. Оговорка про существование не лишняя: запись $r_m=\sum_{n=m+1}^{\infty}a_n$ уже требует сходимости хвостового ряда, а хвосты сходятся только вместе с исходным — у $\sum\frac1n$ ни одного остатка как числа нет.`,
		related: ['skhodimost-ryada', 'chastichnaya-summa', 'kriteriy-koshi-ryad']
	},

	'garmonicheskiy-ryad': {
		id: 'garmonicheskiy-ryad',
		term: 'Гармонический ряд',
		short: String.raw`$\sum1/n$ расходится, хотя $a_n\to0$ — контрпример к обращению признака.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac1n,\qquad S_n=1+\frac12+\dots+\frac1n`,
		body: String.raw`Ряд $\sum 1/n$. Его члены стремятся к нулю, а сам он расходится, поэтому служит опорным контрпримером к обращению [[neobkhodimyy-priznak|необходимого условия сходимости]]. Расходимость логарифмическая.`,
		related: ['chastichnaya-summa', 'ryad-dirihle']
	},

	'geometricheskiy-ryad': {
		id: 'geometricheskiy-ryad',
		term: 'Геометрический ряд',
		short: String.raw`Эталонная мажоранта: сходится при $|q|<1$, расходится при $|q|\ge1$.`,
		formula: String.raw`\sum_{n=1}^{\infty}q^{\,n-1}=\frac{1}{1-q}\quad (|q|<1)`,
		body: String.raw`Ряд с постоянным отношением соседних членов. [[chastichnaya-summa|Частичная сумма]] считается точно, $S_i=\frac{1-q^{i}}{1-q}$, откуда сходимость ровно при $|q|<1$; сумма тогда равна $\frac1{1-q}$.`,
		related: ['chastichnaya-summa', 'mazhoranta-i-minoranta']
	},

	'teleskopicheskaya-summa': {
		id: 'teleskopicheskaya-summa',
		term: 'Телескопическая сумма',
		short: String.raw`Член — разность соседних величин, внутренность сокращается.`,
		formula: String.raw`\sum_{k=1}^{i}(b_k-b_{k+1})=b_1-b_{i+1}`,
		body: String.raw`Сумма, у которой каждый член — разность соседних величин: внутренние слагаемые взаимно уничтожаются и остаются только края. Приём даёт [[chastichnaya-summa|частичную сумму]] в замкнутом виде.`,
		related: ['chastichnaya-summa']
	},

};
