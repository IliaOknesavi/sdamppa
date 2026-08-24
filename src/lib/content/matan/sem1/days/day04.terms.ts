import type { Glossary } from '$lib/types';

// Термины дня 4 (числовые множества: N₀ по фон Нейману, Пеано, Z, Q, I, R).
// Термины канонического глоссария (sem1/glossary.ts) здесь НЕ переобъявляются,
// а только перелинковываются через [[...]]:
//   n-nol-n-odin (ℕ₀/ℕ₁ — введено в дне 1).
// Всё остальное, на что ссылается day04.ts, объявлено ниже — день должен
// резолвиться независимо от соседних дней.
export const day04Terms: Glossary = {
	'fon-neymanovskaya-konstrukciya': {
		id: 'fon-neymanovskaya-konstrukciya',
		term: 'Фон-неймановская конструкция ℕ₀',
		short: String.raw`Число как множество всех меньших: $0=\varnothing$, $n+1=n\cup\{n\}$.`,
		formula: String.raw`0:=\varnothing,\qquad n+1:=n\cup\{n\}`,
		body: String.raw`**Конструкция фон Неймана** кодирует [[n-nol-n-odin|натуральные числа]] множествами так, чтобы выполнялись [[aksiomy-peano|аксиомы Пеано]]: нуль — это $\varnothing$, а следующее число получается присоединением самого себя, $n+1=n\cup\{n\}$. Отсюда $1=\{\varnothing\}$, $2=\{\varnothing,\{\varnothing\}\}$ и вообще $n=\{0,1,\dots,n-1\}$.`,
		related: ['aksiomy-peano', 'n-nol-n-odin', 'celye-chisla']
	},

	'aksiomy-peano': {
		id: 'aksiomy-peano',
		term: 'Аксиомы Пеано',
		short: String.raw`Ноль, инъективный переход $S$, ноль не последователь, индукция.`,
		formula: String.raw`a+0=a,\qquad a+S(b)=S(a+b),\qquad a\cdot S(b)=a\cdot b+a`,
		body: String.raw`**Аксиомы Пеано** описывают $\mathbb N_0$ пятью требованиями: $0$ — натуральное число; переход $S$ не выводит за пределы $\mathbb N_0$; $S$ инъективен; $0$ не является ничьим последователем; всякое подмножество, содержащее $0$ и замкнутое относительно $S$, есть всё $\mathbb N_0$ (принцип индукции). Арифметика задаётся рекурсией по второму аргументу: $a+0=a$, $a+S(b)=S(a+b)$, $a\cdot S(b)=a\cdot b+a$; коммутативность, ассоциативность и дистрибутивность в аксиомы не входят — это теоремы. Стандартная реализация — [[fon-neymanovskaya-konstrukciya|коды фон Неймана]], где $S(n)=n\cup\{n\}$.`,
		related: ['fon-neymanovskaya-konstrukciya', 'usechennoe-vychitanie', 'celye-chisla']
	},

	'usechennoe-vychitanie': {
		id: 'usechennoe-vychitanie',
		term: 'Усечённое вычитание (монус)',
		short: String.raw`Разность на ℕ₀, обрезанная нулём: $a\mathbin{\dot-}b=0$ при $a\le b$.`,
		formula: String.raw`a\mathbin{\dot-}b=\begin{cases}a-b,&a>b\\0,&a\le b\end{cases}`,
		body: String.raw`**Усечённое вычитание** — операция $\mathbb N_0\times\mathbb N_0\to\mathbb N_0$, равная обычной разности при $a>b$ и нулю при $a\le b$; её вводят, чтобы вычитание было всюду определённым, не выходя из натуральных и не строя [[celye-chisla|ℤ]]. Цена — потеря свойств: ассоциативности нет ($(7\mathbin{\dot-}5)\mathbin{\dot-}2=0$, но $7\mathbin{\dot-}(5\mathbin{\dot-}2)=4$), зато $a\mathbin{\dot-}b=0\iff a\le b$ и $(a\mathbin{\dot-}b)\mathbin{\dot-}c=a\mathbin{\dot-}(b+c)$.`,
		related: ['aksiomy-peano', 'celye-chisla', 'fon-neymanovskaya-konstrukciya']
	},

	'celye-chisla': {
		id: 'celye-chisla',
		term: 'Целые числа ℤ',
		short: String.raw`Достройка ℕ₀ до группы по сложению: вычитание становится тотальным.`,
		formula: String.raw`\mathbb Z=(\mathbb N_0\times\mathbb N_0)/\!\sim,\qquad (a,b)\sim(c,d)\iff a+d=b+c`,
		body: String.raw`**Целые числа** возникают как ответ на неразрешимость уравнения $x+7=5$ в $\mathbb N_0$: вместо того чтобы латать операцию [[usechennoe-vychitanie|монусом]], достраивают само множество. $\mathbb Z$ берётся как классы эквивалентности пар натуральных, где класс $(a,b)$ означает разность $a-b$: тогда $-2$ — это класс пары $(0,2)$, в который попадают также $(1,3)$ и $(5,7)$. Операции наследуются от $\mathbb N_0$ автоматически, и доказывать надо только их корректность на классах.`,
		related: ['fon-neymanovskaya-konstrukciya', 'usechennoe-vychitanie', 'racionalnye-chisla']
	},

	'racionalnye-chisla': {
		id: 'racionalnye-chisla',
		term: 'Рациональные числа ℚ',
		short: String.raw`Несократимые дроби $n/m$ с $n\in\mathbb Z$, $m\in\mathbb N_1$, $(|n|,m)=1$.`,
		formula: String.raw`\mathbb Q=\Bigl\{\tfrac nm \;\Big|\; n\in\mathbb Z,\ m\in\mathbb N_1,\ (|n|,m)=1\Bigr\}`,
		body: String.raw`**Рациональные числа** — результат добавления к [[celye-chisla|ℤ]] обратных по умножению элементов ($4^-$ для четвёрки), чтобы уравнение $4x=1$ стало разрешимым; $\mathbb Q$ — поле: замкнуто относительно сложения, вычитания, умножения и деления на ненулевое. Условие [[vzaimnaya-prostota|взаимной простоты]] $(|n|,m)=1$ в определении делает запись канонической: на каждое число ровно одна пара $(n,m)$, а не класс сокращаемых дробей.`,
		related: ['celye-chisla', 'vzaimnaya-prostota', 'irracionalnye-chisla', 'periodicheskaya-drob']
	},

	'vzaimnaya-prostota': {
		id: 'vzaimnaya-prostota',
		term: 'Взаимная простота',
		short: String.raw`Запись $(x,y)=1$: у чисел нет общих делителей, кроме единицы.`,
		formula: String.raw`(x,y)=1\iff \gcd(x,y)=1`,
		body: String.raw`Числа $x$ и $y$ **взаимно просты**, если их наибольший общий делитель равен единице; записывается это скобками: $(x,y)=1$. Обозначение совпадает с записью упорядоченной пары, и различает их только контекст: слева от знака равенства с единицей стоит НОД, а не элемент декартова произведения. Условие $(|n|,m)=1$ входит в определение [[racionalnye-chisla|ℚ]] и делает представление числа дробью единственным.`,
		related: ['racionalnye-chisla', 'irracionalnye-chisla', 'div-mod']
	},

	'irracionalnye-chisla': {
		id: 'irracionalnye-chisla',
		term: 'Иррациональные числа 𝕀',
		short: String.raw`Дополнение ℚ до ℝ: вещественные числа, не представимые дробью.`,
		formula: String.raw`\mathbb I=\mathbb R\setminus\mathbb Q,\qquad \sqrt2\in\mathbb I`,
		body: String.raw`**Иррациональные числа** — вещественные числа, не являющиеся [[racionalnye-chisla|рациональными]]: $\mathbb I=\mathbb R\setminus\mathbb Q$; непустоту $\mathbb I$ даёт теорема $\sqrt2\notin\mathbb Q$. В отличие от $\mathbb Q$, множество $\mathbb I$ не поле и вообще не замкнуто относительно операций: $\sqrt2+(-\sqrt2)=0$ и $\sqrt2\cdot\sqrt2=2$ рациональны; зато сумма рационального и иррационального всегда иррациональна. По мощности $\mathbb I$ несчётно.`,
		related: ['racionalnye-chisla', 'bashnya-chislovyh-sistem', 'vychislimye-chisla']
	},

	'periodicheskaya-drob': {
		id: 'periodicheskaya-drob',
		term: 'Периодическая дробь',
		short: String.raw`Запись с повторяющейся группой цифр: $5/7=0{,}(714285)$.`,
		formula: String.raw`\frac57=0{,}(714285)_{10}=0{,}5_7`,
		body: String.raw`**Периодическая дробь** — позиционная запись, в которой начиная с некоторого места группа цифр повторяется; период отмечают скобками: $0{,}(714285)$. Периодичность неизбежна для любого [[racionalnye-chisla|рационального]] числа, и обратно — всякая периодическая дробь рациональна. Период — свойство пары «число и основание», а не одного числа: то же $5/7$ в [[sistema-schisleniya|семеричной системе]] записывается конечно.`,
		related: ['racionalnye-chisla', 'div-mod', 'sistema-schisleniya']
	},

	'div-mod': {
		id: 'div-mod',
		term: 'Деление с остатком (div и mod)',
		short: String.raw`Пара «неполное частное и остаток»: $n=m\cdot(n\operatorname{div}m)+(n\bmod m)$.`,
		formula: String.raw`n=m\cdot(n\operatorname{div}m)+(n\bmod m),\qquad 0\le n\bmod m<m`,
		body: String.raw`Деление $n$ на $m\in\mathbb N_1$ трактуется как **пара**: $n\operatorname{div}m$ — целая часть частного, $n\bmod m$ — остаток, причём $0\le n\bmod m<m$. Из этого неравенства следует, что остаток принимает не более $m$ значений — ограничение, за которым стоит [[periodicheskaya-drob|периодичность]] записи рационального числа в любой [[sistema-schisleniya|системе счисления]].`,
		related: ['periodicheskaya-drob', 'sistema-schisleniya', 'vzaimnaya-prostota']
	},

	'sistema-schisleniya': {
		id: 'sistema-schisleniya',
		term: 'Позиционная система счисления',
		short: String.raw`Запись по степеням основания $b$; конечность зависит от выбора $b$.`,
		formula: String.raw`x=\sum_{i\ge1} a_i b^{-i},\qquad a_i\in\{0,\dots,b-1\}`,
		body: String.raw`В **позиционной системе с основанием** $b$ дробная часть числа записывается как сумма $\sum a_i b^{-i}$, где цифры $a_i$ пробегают $\{0,\dots,b-1\}$; основание указывается нижним индексом: $5_7$, $10_7$. Запись несократимой дроби $\tfrac nm$ конечна тогда и только тогда, когда все простые делители $m$ делят $b$: $\tfrac57$ выходит [[periodicheskaya-drob|периодической]] дробью $0{,}(714285)$ в десятичной и конечной $0{,}5_7$ в семеричной. Для [[irracionalnye-chisla|иррационального]] числа конечной записи нет ни в одной системе.`,
		related: ['periodicheskaya-drob', 'div-mod', 'irracionalnye-chisla']
	},

	'vychislimye-chisla': {
		id: 'vychislimye-chisla',
		term: 'Вычислимые числа (Comp)',
		short: String.raw`Числа, цифры которых печатает алгоритм; таких лишь счётное множество.`,
		formula: String.raw`\mathbb Q\subset\mathrm{Comp}\subset\mathbb R,\qquad |\mathrm{Comp}|=\aleph_0`,
		body: String.raw`Число называется **вычислимым**, если существует алгоритм, выдающий его десятичное приближение с любой наперёд заданной точностью. Comp лежит между [[racionalnye-chisla|ℚ]] и $\mathbb R$, причём оба вложения строгие: [[irracionalnye-chisla|иррациональные]] $\sqrt2$, $\pi$, $e$ вычислимы, но $|\mathrm{Comp}|=\aleph_0$, тогда как $\mathbb R$ несчётно — значит почти всякое вещественное число невычислимо.`,
		related: ['irracionalnye-chisla', 'bashnya-chislovyh-sistem', 'racionalnye-chisla']
	},

	'bashnya-chislovyh-sistem': {
		id: 'bashnya-chislovyh-sistem',
		term: 'Башня числовых систем',
		short: String.raw`ℕ₁ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ и дальше: кватернионы, октонионы, седенионы.`,
		formula: String.raw`\mathbb N_1\subset\mathbb N_0\subset\mathbb Z\subset\mathbb Q\subset\mathbb R\subset\mathbb C\subset\mathbb Q_4\subset\mathbb Q_8\subset\mathrm{Sed}`,
		body: String.raw`**Башня числовых систем** — цепочка вложений от $\mathbb N_1$ до седенионов, в которой $\mathbb I$ лежит внутри $\mathbb R$ вне $\mathbb Q$, а [[vychislimye-chisla|Comp]] — между $\mathbb Q$ и $\mathbb R$. Каждый этаж возникает, когда предыдущего не хватает для решения уравнения: $x+7=5$ даёт [[celye-chisla|ℤ]], $4x=1$ — [[racionalnye-chisla|ℚ]], $x^2=2$ — $\mathbb R$, $x^2=-1$ — $\mathbb C$; дальше идут кватернионы $\mathbb Q_4$, октонионы $\mathbb Q_8$, седенионы Sed. Каждый следующий этаж покупается ценой свойства: $\mathbb C$ теряет согласованный с операциями порядок, $\mathbb Q_4$ — коммутативность умножения, $\mathbb Q_8$ — ассоциативность, Sed — отсутствие делителей нуля.`,
		related: ['celye-chisla', 'racionalnye-chisla', 'irracionalnye-chisla', 'vychislimye-chisla']
	}
};
