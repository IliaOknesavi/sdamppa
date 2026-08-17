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
		body: String.raw`**Частичная сумма** последовательности $a_1,a_2,\dots$ — это $S_i=a_1+\dots+a_i$. Главное в ней то, что $S$ — сама [[posledovatelnost|последовательность]] $\mathbb N_1\to\mathbb R$, поэтому весь аппарат [[predel-posledovatelnosti|предела]] переносится на [[chislovoy-ryad|ряды]] без новой теории. ⚠️ Буква $S_i$ в курсе перегружена: в теме верхнего предела ею же обозначают верхнюю огибающую $S_i=\sup_{k\ge i}x_k$ — смотрите на контекст.`,
		related: ['chislovoy-ryad', 'skhodimost-ryada', 'predel-posledovatelnosti']
	},

	'chislovoy-ryad': {
		id: 'chislovoy-ryad',
		term: 'Числовой ряд',
		short: String.raw`Предельный объект над частичными суммами при $i\to\infty$.`,
		formula: String.raw`\sum_{k=1}^{\infty}a_k`,
		body: String.raw`**Ряд** вводится как предельный объект: от [[chastichnaya-summa|частичных сумм]] $S_i$ переходят к $i\to\infty$ и получают символ $\sum_{k=1}^{\infty}a_k$. ⚠️ Курс прикрепляет слово «ряд» именно к этому символу бесконечной суммы, тогда как Фихтенгольц называет рядом **пару** «последовательность членов плюс последовательность частичных сумм». Практической разницы почти нет, но при чтении учебника формулировки будут выглядеть иначе.`,
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
		body: String.raw`Если [[chislovoy-ryad|ряд]] [[skhodimost-ryada|сходится]], то $\lim a_n=0$. По соглашению курса о [[priznak-i-svoystvo|признаках и свойствах]] это, строго говоря, **свойство** сходящегося ряда, а не признак: полезен он контрапозицией — из $a_n\not\to0$ следует [[raskhodimost-ryada|расходимость]]. Обращение ложно, контрпример — [[garmonicheskiy-ryad|гармонический ряд]]. В курсе доказывается не из $a_n=S_n-S_{n-1}$, а взятием $p=1$ в блочной оценке.`,
		related: ['skhodimost-ryada', 'garmonicheskiy-ryad', 'kriteriy-koshi-ryad', 'priznak-i-svoystvo']
	},

	'kriteriy-koshi-ryad': {
		id: 'kriteriy-koshi-ryad',
		term: 'Критерий Коши для рядов',
		short: String.raw`Блок $a_{n+1}+\dots+a_{n+p}$ мал сразу для всех длин $p$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\ \forall n>N\ \forall p\in\mathbb N_1:\ |a_{n+1}+\dots+a_{n+p}|<\varepsilon`,
		body: String.raw`Необходимое **и** достаточное условие [[skhodimost-ryada|сходимости]]. Доказывается в одну строку: блок равен $S_{n+p}-S_n$, то есть условие — это определение [[skhodyashchayasya-v-sebe|сходящейся в себе]] последовательности $S_n$, а в $\mathbb R$ фундаментальность равносильна сходимости ([[polnota|полнота]]). Ключевой квантор — $\forall p$: оценка блока обязана быть **равномерной по длине**. В конспекте критерий выписан без доказательства, хотя фактически выведен страницей раньше.`,
		related: ['skhodimost-ryada', 'skhodyashchayasya-v-sebe', 'polnota', 'neobkhodimyy-priznak']
	},

	'ostatok-ryada': {
		id: 'ostatok-ryada',
		term: 'Остаток ряда (остаточный хвост)',
		short: String.raw`$r_m=c-S_m$ — то, что осталось после $m$-го члена.`,
		formula: String.raw`r_m=\sum_{n=m+1}^{\infty}a_n=c-S_m`,
		body: String.raw`**Остаток** — хвост [[chislovoy-ryad|ряда]], начинающийся с номера $m+1$. Теорема курса («об остаточном хвосте ряда»): ряд [[skhodimost-ryada|сходится]] $\iff$ все остатки существуют и $r_m\to0$. ⚠️ Название авторское; в учебниках это **свойство остатка ряда**, по «остаточному хвосту» ничего не найдётся. Рабочее следствие $c=S_m+r_m$ означает, что $r_m$ — погрешность обрыва ряда на $m$-м члене.`,
		related: ['skhodimost-ryada', 'chastichnaya-summa', 'kriteriy-koshi-ryad']
	},

	'garmonicheskiy-ryad': {
		id: 'garmonicheskiy-ryad',
		term: 'Гармонический ряд',
		short: String.raw`$\sum1/n$ расходится, хотя $a_n\to0$ — контрпример к обращению признака.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac1n,\qquad S_n=1+\frac12+\dots+\frac1n`,
		body: String.raw`Опорный контрпример курса: $\lim\frac1n=0$, [[neobkhodimyy-priznak|необходимый признак]] выполнен, а ряд [[raskhodimost-ryada|расходится]]. Механика — оценка блока снизу наименьшим слагаемым: $\frac1{n+1}+\dots+\frac1{n+p}>\frac{p}{n+p}$, и при $p=n$ это ровно $\frac12$, что рушит [[kriteriy-koshi-ryad|критерий Коши]] при $\varepsilon=\frac12$. Расходимость логарифмическая: $S_n\approx\ln n+\gamma$, поэтому $S_{2^k}\ge1+\frac k2$.`,
		related: ['neobkhodimyy-priznak', 'kriteriy-koshi-ryad', 'raskhodimost-ryada']
	},

	'geometricheskiy-ryad': {
		id: 'geometricheskiy-ryad',
		term: 'Геометрический ряд',
		short: String.raw`Эталонная мажоранта: сходится при $|q|<1$, расходится при $|q|\ge1$.`,
		formula: String.raw`\sum_{n=1}^{\infty}q^{\,n-1}=\frac{1}{1-q}\quad (|q|<1)`,
		body: String.raw`[[chislovoy-ryad|Ряд]] с постоянным отношением членов. Частичная сумма считается точно: $S_i=\frac{1-q^{i}}{1-q}$ при $q\ne1$, откуда сходимость ровно при $|q|<1$. В курсе служит эталоном сравнения — через него доказывается признак Д'Аламбера (день 25), причём сама сходимость $\sum q^{\,n-1}$ там используется как известный факт, без ссылки. Ряд $\sum\frac1{a^n}$ из ДЗ2.2 — это он же с $q=\frac1a$.`,
		related: ['chislovoy-ryad', 'skhodimost-ryada', 'raskhodimost-ryada']
	},

	'teleskopicheskaya-summa': {
		id: 'teleskopicheskaya-summa',
		term: 'Телескопическая сумма',
		short: String.raw`Член — разность соседних величин, внутренность сокращается.`,
		formula: String.raw`\sum_{k=1}^{i}(b_k-b_{k+1})=b_1-b_{i+1}`,
		body: String.raw`Приём, дающий [[chastichnaya-summa|частичную сумму]] в замкнутом виде: если $a_k=b_k-b_{k+1}$, то все внутренние слагаемые взаимно уничтожаются и остаются только края. Так считаются $\sum\frac1{n^2+n}$ (здесь $b_k=\frac1k$, сумма равна $1$) и $\sum\frac1{n^2-1}$ (разность через шаг, сумма $\frac34$). Той же телескопической оценкой $\frac1{k^2}<\frac1{k-1}-\frac1k$ чинится дефектная оценка конспекта для $\sum\frac1{n^2}$.`,
		related: ['chastichnaya-summa', 'skhodimost-ryada', 'ostatok-ryada']
	},

	'predel-posledovatelnosti': {
		id: 'predel-posledovatelnosti',
		term: 'Предел последовательности',
		short: String.raw`$N$ как функция от $\varepsilon$; определение сразу в четырёх средах.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N(\varepsilon)\in\mathbb N_1\ \forall n>N:\ \rho(x_n,A)<\varepsilon`,
		body: String.raw`Число $A$ — предел [[posledovatelnost|последовательности]], если вне любого шара $B_A(\varepsilon)$ остаётся лишь конечное число членов. Курс даёт определение сразу в $\mathbb R$, в нормированном, в метрическом (через $\rho$ и через шары) и в топологическом пространстве (через [[vykolotaya-okrestnost|выколотую окрестность]]). Доказательство обязано кончаться явной формулой $N(\varepsilon)$, а не словами «предел существует» — см. [[blacksquare|оформление доказательства]].`,
		related: ['posledovatelnost', 'polnota', 'skhodyashchayasya-v-sebe', 'blacksquare']
	},

	polnota: {
		id: 'polnota',
		term: 'Полнота пространства',
		short: String.raw`Всякая сходящаяся в себе последовательность имеет предел.`,
		formula: String.raw`(x_n)\ \text{сх. в себе}\ \Longrightarrow\ \exists\lim_{n\to\infty}x_n`,
		body: String.raw`Пространство **полно**, если каждая [[skhodyashchayasya-v-sebe|сходящаяся в себе]] последовательность в нём [[predel-posledovatelnosti|сходится]]. Эквивалентность фундаментальности и сходимости в $\mathbb R^n$ — отдельный пункт списка КЛК2. Именно на ней держится [[kriteriy-koshi-ryad|критерий Коши для рядов]]: в $\mathbb Q$ он бы не работал — там частичные суммы ряда для $\sqrt2$ фундаментальны, а предела в пространстве нет.`,
		related: ['skhodyashchayasya-v-sebe', 'predel-posledovatelnosti', 'kriteriy-koshi-ryad']
	},

	posledovatelnost: {
		id: 'posledovatelnost',
		term: 'Последовательность',
		short: String.raw`Не «набор», а функция $f:\mathbb N_1\to M$.`,
		formula: String.raw`f:\mathbb N_1\to M`,
		body: String.raw`В курсе последовательность — это **отображение** из [[n-nol-n-odin|$\mathbb N_1$]] в множество значений, а не «занумерованный набор». Если значения лежат в метрическом пространстве, преподаватель называет её «обобщённой последовательностью» (⚠️ в общей топологии этим словом называют сеть — другое понятие). Отсюда же вырастают [[chastichnaya-summa|частичные суммы]]: $S:\mathbb N_1\to\mathbb R$ — тоже последовательность, просто построенная по другой.`,
		related: ['n-nol-n-odin', 'predel-posledovatelnosti', 'chastichnaya-posledovatelnost']
	}
};
