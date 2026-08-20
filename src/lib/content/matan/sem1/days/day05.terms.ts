import type { Glossary } from '$lib/types';

// Термины дня 5: аксиоматика ℝ и расширенная прямая. Введённые здесь понятия
// объявлены целиком, чтобы день резолвился независимо, — даже если
// перекликаются с соседними днями. Сквозные обозначения живут в каноническом
// glossary.ts и здесь НЕ дублируются, а только цитируются через [[...]]:
// n-nol-n-odin (ℕ₀/ℕ₁), asimptoticheskie-klassy (O, o, Θ, ω, Ω),
// blacksquare (оформление доказательства).
export const day05Terms: Glossary = {
	'aksiomy-polya': {
		id: 'aksiomy-polya',
		term: 'Аксиомы поля',
		short: String.raw`Ассоциативность, коммутативность, дистрибутивность, нейтральные и обратные.`,
		formula: String.raw`a+b=b+a,\quad (ab)c=a(bc),\quad a(b+c)=ab+ac`,
		body: String.raw`**Аксиомы поля** — первый блок аксиоматики $\mathbb R$: сложение и умножение ассоциативны и коммутативны, есть нейтральные $0$ и $1$, умножение дистрибутивно, у каждого элемента есть противоположный, у каждого ненулевого — обратный.

Обратный элемент обозначается $4^-$, а не $4^{-1}$. Вместе с [[aksiomy-poryadka|аксиомами порядка]] дают упорядоченное поле; [[aksioma-arhimeda|Архимед]] и [[polnota-r|полнота]] в них не входят.`,
		related: ['aksiomy-poryadka', 'aksioma-arhimeda', 'polnota-r']
	},

	'aksiomy-poryadka': {
		id: 'aksiomy-poryadka',
		term: 'Аксиомы порядка',
		short: String.raw`Антисимметричность, транзитивность и согласование с операциями.`,
		formula: String.raw`x>y\Rightarrow x+z>y+z;\qquad a>0:\ x>y\Rightarrow xa>ya`,
		body: String.raw`**Аксиомы порядка** задают отношение $>$ как антисимметричное и транзитивное, а затем согласуют его с арифметикой: $x>y\Rightarrow x+z>y+z$ (уже на $\mathbb N_0$), $x>y\Rightarrow x-z>y-z$ (начиная с $\mathbb Z$), и для умножения — $xa>ya$ при $a>0$, $xa<ya$ при $a<0$.

Множитель $a=0$ выпадает из обеих строк: $x\cdot0=y\cdot0$, и строгое неравенство не сохраняется ни в одну сторону, ни в другую, — поэтому условия именно $a>0$ и $a<0$. Рефлексивность в аксиомы не входит, она лишь делит порядок на [[strogiy-nestrogiy-poryadok|строгий и нестрогий]].`,
		related: ['aksiomy-polya', 'strogiy-nestrogiy-poryadok', 'aksioma-arhimeda']
	},

	'strogiy-nestrogiy-poryadok': {
		id: 'strogiy-nestrogiy-poryadok',
		term: 'Строгий и нестрогий порядок',
		short: String.raw`Строгий порядок антирефлексивен, нестрогий — рефлексивен.`,
		body: String.raw`**Отношение порядка** — произвольное антисимметричное транзитивное отношение; рефлексивность в определение не входит и лишь делит порядок на **строгий** (антирефлексивный, $>$) и **нестрогий** (рефлексивный, $\le$). Одна и та же расстановка элементов задаётся обеими версиями: $\le$ содержит все пары $(x,x)$, $<$ не содержит ни одной.

Приставка «не-» слабее приставки «анти-»: антирефлексивное отношение не содержит ни одной пары $(x,x)$, а нерефлексивному достаточно не содержать хотя бы одну. На $\{1,2\}$ отношение $\{(1,1)\}$ нерефлексивно, но не антирефлексивно.`,
		related: ['aksiomy-poryadka', 'supremum']
	},

	'aksioma-arhimeda': {
		id: 'aksioma-arhimeda',
		term: 'Аксиома Архимеда',
		short: String.raw`Любой шаг $x>0$ за конечное число повторов перекрывает любое $y>0$.`,
		formula: String.raw`\forall x,y>0\ \ \exists n\in\mathbb N_1:\ x\cdot n>y`,
		body: String.raw`**Аксиома Архимеда**: для любых положительных $x,y$ найдётся $n\in\mathbb N_1$ с $xn>y$. Смысл — соизмеримость: внутри $\mathbb R$ нет ни бесконечно малых, ни бесконечно больших элементов.

**Следствие** (подстановка $x=1$): $\forall y\ \exists n\in\mathbb N_1:\ n>y$, то есть [[n-nol-n-odin|$\mathbb N_1$]] не ограничено сверху. Рабочая форма — $\frac1n<\varepsilon$ при $n(\varepsilon)=\lfloor1/\varepsilon\rfloor+1$. Из [[aksiomy-polya|аксиом поля]] и порядка не выводится: бывают неархимедовы упорядоченные поля.`,
		related: ['aksiomy-poryadka', 'aksioma-kantora', 'polnota-r']
	},

	'vlozhennye-otrezki': {
		id: 'vlozhennye-otrezki',
		term: 'Вложенные отрезки',
		short: String.raw`Убывающая цепочка отрезков, каждый следующий внутри предыдущего.`,
		formula: String.raw`[a_1,b_1]\supset[a_2,b_2]\supset\dots\supset[a_n,b_n]\supset\dots`,
		body: String.raw`**Вложенные отрезки** — цепочка $[a_1,b_1]\supset[a_2,b_2]\supset\dots$, в которой все отрезки попарно различны. Если дополнительно $b_n-a_n\to0$, отрезки называют **стягивающимися**.

Существенны и замкнутость, и ограниченность: $\bigcap_n\left(0,\frac1n\right)=\varnothing$ для интервалов и $\bigcap_n[n,+\infty)=\varnothing$ для лучей — оба пересечения убивает следствие [[aksioma-arhimeda|Архимеда]]. Для отрезков непустоту гарантирует [[aksioma-kantora|аксиома Кантора]], а одноточечность — только стягивание.`,
		related: ['aksioma-kantora', 'polnota-r', 'supremum']
	},

	'aksioma-kantora': {
		id: 'aksioma-kantora',
		term: 'Аксиома Кантора о вложенных отрезках',
		short: String.raw`Пересечение вложенных отрезков непусто — это принимается за аксиому.`,
		formula: String.raw`\bigcap_{i=1}^{\infty}[a_i,b_i]\ne\varnothing`,
		body: String.raw`**Аксиома Кантора**: у бесконечной цепочки [[vlozhennye-otrezki|вложенных отрезков]] есть общая точка. Именно она заменяет здесь [[polnota-r|аксиому полноты]]: в $\mathbb Q$ она ложна, и на этом различие $\mathbb R$ и $\mathbb Q$ и держится.

Утверждается только непустота пересечения. Одноточечность $\bigcap[a_i,b_i]=[c^*,c^*]$ строго сильнее и требует условия $b_n-a_n\to0$: для $\left[-\frac1n,1\right]$ пересечение равно целому отрезку $[0,1]$.`,
		related: ['vlozhennye-otrezki', 'polnota-r', 'sechenie-dedekinda']
	},

	'polnota-r': {
		id: 'polnota-r',
		term: 'Полнота ℝ',
		short: String.raw`Не постулируется явно: её роль играет аксиома Кантора.`,
		formula: String.raw`A\ne\varnothing,\ \text{огр. сверху}\ \Rightarrow\ \exists\sup A`,
		body: String.raw`Свойство, отличающее $\mathbb R$ от $\mathbb Q$: у всякого непустого ограниченного сверху множества есть [[supremum|супремум]]. Равносильные формы — принцип вложенных отрезков вместе с аксиомой Архимеда и сходимость монотонных ограниченных последовательностей.`,
		related: ['aksioma-polnoty', 'supremum', 'veshchestvennye-chisla']
	},

	'sechenie-dedekinda': {
		id: 'sechenie-dedekinda',
		term: 'Сечение Дедекинда',
		short: String.raw`Разбиение $\mathbb Q$ на два класса — классический способ построить $\mathbb R$.`,
		formula: String.raw`\mathbb Q=X\sqcup Y,\quad \forall x\in X\ \forall y\in Y:\ x<y`,
		body: String.raw`**Сечение Дедекинда** — разбиение $\mathbb Q$ на нижний и верхний классы так, что всякий элемент нижнего меньше всякого элемента верхнего. Аксиома непрерывности утверждает, что у каждого сечения есть рубежное число; это один из способов ввести $\mathbb R$, и принцип [[vlozhennye-otrezki|вложенных отрезков]] выводится из него леммой.

Обратный вывод тоже проходит: из вложенности вместе с [[aksioma-arhimeda|Архимедом]] получается существование [[supremum|супремума]], а из него — рубежное число всякого сечения. Обе схемы задают одну и ту же $\mathbb R$ и различаются лишь тем, что берётся за аксиому: если [[aksioma-kantora|аксиому Кантора]], то [[polnota-r|полнота]] оказывается теоремой; если сечение — теоремой оказывается вложенность.`,
		related: ['polnota-r', 'aksioma-kantora', 'supremum']
	},

	'rasshirennaya-pryamaya': {
		id: 'rasshirennaya-pryamaya',
		term: 'Расширенная прямая ℝ̄ = ℝ*',
		short: String.raw`$\mathbb R\cup\{-\infty;+\infty\}$ — упорядочена, но уже не поле.`,
		formula: String.raw`\overline{\mathbb R}=\mathbb R^*=\mathbb R\cup\{-\infty;\ +\infty\}`,
		body: String.raw`Множество $\overline{\mathbb R}=\mathbb R\cup\{-\infty;+\infty\}$ с продолженным порядком. [[supremum|Супремум]] и инфимум появляются у любого подмножества, но [[pole|полем]] оно не является: обратных к $\pm\infty$ нет, а сложение и деление определены не всюду.`,
		related: ['veshchestvennye-chisla', 'pole', 'supremum']
	},

	beskonechnost: {
		id: 'beskonechnost',
		term: 'Символы бесконечности ±∞',
		short: String.raw`Не числа, а элементы $\overline{\mathbb R}$ с частичной арифметикой.`,
		formula: String.raw`x+\infty=\infty,\qquad \infty\cdot x=\operatorname{sign}(x)\cdot\infty\ \ (x\ne0)`,
		body: String.raw`$+\infty$ и $-\infty$ — два новых элемента [[rasshirennaya-pryamaya|расширенной прямой]], и арифметика с ними задана **списком соглашений**, а не выведена: $x+\infty=\infty$, $x-\infty=-\infty$, $\infty\cdot x=\operatorname{sign}(x)\cdot\infty$ при $x\ne0$, $\infty\cdot\infty=(-\infty)\cdot(-\infty)=\infty$, $\infty\cdot(-\infty)=-\infty$.

Список сознательно неполон: три позиции помечены [[neopredelennost|undefined]]. Ни один из символов не является числом — [[aksiomy-polya|аксиомы поля]] на них не распространяются.`,
		related: ['rasshirennaya-pryamaya', 'neopredelennost', 'aksiomy-polya']
	},

	neopredelennost: {
		id: 'neopredelennost',
		term: 'Неопределённость (undefined)',
		short: String.raw`Три случая: $\infty-\infty$, $0\cdot\infty$, $\infty/\infty$.`,
		formula: String.raw`\infty-\infty,\qquad 0\cdot\infty,\qquad \frac{\infty}{\infty}`,
		body: String.raw`Три выражения в [[rasshirennaya-pryamaya|расширенной прямой]] значения не получают и помечаются словом **undefined**: $\infty-\infty$, $0\cdot\infty$ и $\infty/\infty$. Это не пробел в таблице, а точная формулировка: символьная запись не определяет ответ.

Проверяется одной строкой: $(n+5)-n\to5$, но $n^2-n\to+\infty$; $\frac1n\cdot n\to1$, но $\frac1{n^2}\cdot n\to0$. Раскрывают такие случаи не по таблице [[beskonechnost|бесконечностей]], а сравнением скоростей — через [[asimptoticheskie-klassy|асимптотические классы]] и правило Лопиталя.`,
		related: ['rasshirennaya-pryamaya', 'beskonechnost', 'asimptoticheskie-klassy']
	}
};
