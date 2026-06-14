import type { Glossary } from '$lib/types';

// Term graph for day 3 (ch03): условная вероятность, независимость, формула
// Байеса. Cross-linked via [[id]] inside bodies and `related`. These extend the
// base glossary (ch01 terms) — reuse base ids where possible.
export const day03Terms: Glossary = {
	'uslovnaya-veroyatnost': {
		id: 'uslovnaya-veroyatnost',
		term: 'Условная вероятность',
		short: String.raw`$P(B\mid A)=\dfrac{P(AB)}{P(A)}$ — вероятность $B$, если уже известно, что произошло $A$.`,
		formula: String.raw`P(B\mid A)=\frac{P(AB)}{P(A)}`,
		body: String.raw`**Условная вероятность** [[sobytie|события]] $B$ при условии $A$ (при $P(A)>0$): $$P(B\mid A)=\frac{P(AB)}{P(A)},$$ где $AB=A\cap B$. Содержательно: узнав, что $A$ наступило, мы сужаем [[prostranstvo-ishodov|пространство исходов]] до самого $A$ и заново нормируем вероятность делением на $P(A)$.

При фиксированном $A$ функция $Q(B)=P(B\mid A)$ сама удовлетворяет [[aksiomy-kolmogorova|аксиомам Колмогорова]] — это полноценная [[veroyatnost|вероятность]] на том же [[veroyatnostnoe-prostranstvo|пространстве]].`,
		related: ['teorema-umnozheniya', 'nezavisimost-sobytiy', 'formula-bayesa', 'sobytie']
	},

	'teorema-umnozheniya': {
		id: 'teorema-umnozheniya',
		term: 'Теорема умножения',
		short: String.raw`$P(AB)=P(A)\,P(B\mid A)=P(B)\,P(A\mid B)$.`,
		formula: String.raw`P(AB)=P(A)\,P(B\mid A)`,
		body: String.raw`Умножив определение [[uslovnaya-veroyatnost|условной вероятности]] на $P(A)$, получаем **теорему умножения** (принцип произведения): $$P(AB)=P(A)\,P(B\mid A)=P(B)\,P(A\mid B).$$ Вероятность совместного наступления равна вероятности одного события, умноженной на условную вероятность другого. Обобщается на $n$ событий — [[cepnoe-pravilo|цепное правило]].`,
		related: ['uslovnaya-veroyatnost', 'cepnoe-pravilo', 'nezavisimost-sobytiy']
	},

	'cepnoe-pravilo': {
		id: 'cepnoe-pravilo',
		term: 'Цепное правило',
		short: String.raw`$P(A_1\cdots A_n)=P(A_1)P(A_2\mid A_1)\cdots P(A_n\mid A_1\cdots A_{n-1})$.`,
		formula: String.raw`P\Big(\bigcap_{i=1}^{n} A_i\Big)=\prod_{i=1}^{n} P\big(A_i\mid A_1\cdots A_{i-1}\big)`,
		body: String.raw`**Цепное правило** — обобщение [[teorema-umnozheniya|теоремы умножения]] на $n$ событий (при $P(A_1\cdots A_{n-1})>0$): $$P\Big(\bigcap_{i=1}^{n} A_i\Big)=P(A_1)\,P(A_2\mid A_1)\,P(A_3\mid A_1A_2)\cdots P\big(A_n\mid A_1\cdots A_{n-1}\big).$$ Разворачивает совместную вероятность в произведение последовательных условных. Для [[nezavisimost-v-sovokupnosti|независимых в совокупности]] событий упрощается до $\prod_i P(A_i)$.`,
		related: ['teorema-umnozheniya', 'nezavisimost-v-sovokupnosti']
	},

	'nezavisimost-sobytiy': {
		id: 'nezavisimost-sobytiy',
		term: 'Независимость событий',
		short: String.raw`$P(AB)=P(A)\,P(B)$ — наступление одного не меняет вероятности другого.`,
		formula: String.raw`P(AB)=P(A)\,P(B)`,
		body: String.raw`События $A$ и $B$ **независимы**, если $$P(AB)=P(A)\,P(B).$$ Это частный случай [[teorema-umnozheniya|теоремы умножения]]: при $P(A),P(B)>0$ равенство равносильно $P(B\mid A)=P(B)$ и $P(A\mid B)=P(A)$ — то есть [[uslovnaya-veroyatnost|условная вероятность]] совпадает с безусловной.

Важно не путать с [[nesovmestnye|несовместностью]]: два несовместных события положительной вероятности всегда **зависимы**.`,
		related: ['teorema-umnozheniya', 'uslovnaya-veroyatnost', 'nesovmestnye', 'nezavisimost-v-sovokupnosti']
	},

	'poparnaya-nezavisimost': {
		id: 'poparnaya-nezavisimost',
		term: 'Попарная независимость',
		short: String.raw`Независима каждая пара: $P(A_iA_j)=P(A_i)P(A_j)$ при $i\ne j$.`,
		formula: String.raw`P(A_iA_j)=P(A_i)\,P(A_j),\quad i\ne j`,
		body: String.raw`События $A_1,\dots,A_n$ **попарно независимы**, если [[nezavisimost-sobytiy|независима]] каждая пара: $P(A_iA_j)=P(A_i)P(A_j)$ для всех $i\ne j$. Это **слабее** [[nezavisimost-v-sovokupnosti|независимости в совокупности]]: бывают попарно независимые события, не независимые в совокупности (пример Бернштейна).`,
		related: ['nezavisimost-sobytiy', 'nezavisimost-v-sovokupnosti']
	},

	'nezavisimost-v-sovokupnosti': {
		id: 'nezavisimost-v-sovokupnosti',
		term: 'Независимость в совокупности',
		short: String.raw`Условие $\prod$ выполнено для любого поднабора событий.`,
		formula: String.raw`P\big(A_{i_1}\cdots A_{i_m}\big)=\prod_{k=1}^{m} P(A_{i_k})`,
		body: String.raw`События $A_1,\dots,A_n$ **независимы в совокупности**, если для **любого** поднабора $i_1<\dots<i_m$ $$P\big(A_{i_1}A_{i_2}\cdots A_{i_m}\big)=P(A_{i_1})P(A_{i_2})\cdots P(A_{i_m}).$$ Это сильнее [[poparnaya-nezavisimost|попарной независимости]] (влечёт её, но не наоборот). Именно при ней [[cepnoe-pravilo|цепное правило]] сворачивается в $\prod_i P(A_i)$.`,
		related: ['poparnaya-nezavisimost', 'nezavisimost-sobytiy', 'cepnoe-pravilo']
	},

	'polnaya-gruppa-gipotez': {
		id: 'polnaya-gruppa-gipotez',
		term: 'Полная группа гипотез',
		short: String.raw`Попарно несовместные $H_i$ с $\sum_i H_i=\Omega$ и $P(H_i)>0$.`,
		formula: String.raw`H_iH_j=\varnothing\ (i\ne j),\quad \sum_{i} H_i=\Omega`,
		body: String.raw`**Гипотезы** $H_1,\dots,H_n$ образуют **полную группу**, если они попарно [[nesovmestnye|несовместны]] и в объединении дают всё $\Omega$ (см. [[polnaya-gruppa|полную группу событий]]), причём $P(H_i)>0$. При любом исходе наступает ровно одна гипотеза, поэтому $\sum_i P(H_i)=1$.

Это разбиение $\Omega$ — основа [[formula-polnoy-veroyatnosti|формулы полной вероятности]] и [[formula-bayesa|формулы Байеса]].`,
		related: ['polnaya-gruppa', 'nesovmestnye', 'formula-polnoy-veroyatnosti', 'formula-bayesa']
	},

	'formula-polnoy-veroyatnosti': {
		id: 'formula-polnoy-veroyatnosti',
		term: 'Формула полной вероятности',
		short: String.raw`$P(A)=\sum_i P(H_i)\,P(A\mid H_i)$ — взвешенное среднее условных вероятностей.`,
		formula: String.raw`P(A)=\sum_{i=1}^{n} P(H_i)\,P(A\mid H_i)`,
		body: String.raw`Если $H_1,\dots,H_n$ — [[polnaya-gruppa-gipotez|полная группа гипотез]], то для любого [[sobytie|события]] $A$ $$P(A)=\sum_{i=1}^{n} P(H_i)\,P(A\mid H_i).$$ Гипотезы разбивают $A$ на несовместные куски $AH_i$, к каждому применяется [[teorema-umnozheniya|теорема умножения]]. Удобно читать как взвешенное среднее [[uslovnaya-veroyatnost|условных вероятностей]] $P(A\mid H_i)$ с весами $P(H_i)$.`,
		related: ['polnaya-gruppa-gipotez', 'teorema-umnozheniya', 'formula-bayesa', 'uslovnaya-veroyatnost']
	},

	'formula-bayesa': {
		id: 'formula-bayesa',
		term: 'Формула Байеса',
		short: String.raw`Пересчёт вероятностей гипотез после наблюдения $A$.`,
		formula: String.raw`P(H_i\mid A)=\frac{P(H_i)\,P(A\mid H_i)}{\sum_j P(H_j)\,P(A\mid H_j)}`,
		body: String.raw`Для [[polnaya-gruppa-gipotez|полной группы гипотез]] и $A$ с $P(A)>0$: $$P(H_i\mid A)=\frac{P(H_i)\,P(A\mid H_i)}{P(A)}=\frac{P(H_i)\,P(A\mid H_i)}{\sum_{j} P(H_j)\,P(A\mid H_j)}.$$ Решает **обратную** задачу к [[formula-polnoy-veroyatnosti|формуле полной вероятности]]: $A$ уже произошло — как пересчитать шансы каждой гипотезы. Превращает [[apriornaya-aposteriornaya|априорные]] вероятности $P(H_i)$ в апостериорные $P(H_i\mid A)$.`,
		related: ['formula-polnoy-veroyatnosti', 'polnaya-gruppa-gipotez', 'apriornaya-aposteriornaya', 'uslovnaya-veroyatnost']
	},

	'apriornaya-aposteriornaya': {
		id: 'apriornaya-aposteriornaya',
		term: 'Априорная и апостериорная вероятность',
		short: String.raw`$P(H_i)$ — до опыта, $P(H_i\mid A)$ — после наблюдения $A$.`,
		formula: String.raw`P(H_i)\ \xrightarrow{\ A\ }\ P(H_i\mid A)`,
		body: String.raw`**Априорная** вероятность $P(H_i)$ — наша оценка гипотезы *до* опыта; **апостериорная** $P(H_i\mid A)$ — *после* наблюдения события $A$. [[formula-bayesa|Формула Байеса]] — это правило перехода от одной к другой. Поскольку в знаменателе стоит $P(A)$ из [[formula-polnoy-veroyatnosti|формулы полной вероятности]], апостериорные вероятности снова дают в сумме единицу: $\sum_i P(H_i\mid A)=1$.`,
		related: ['formula-bayesa', 'formula-polnoy-veroyatnosti']
	}
};
