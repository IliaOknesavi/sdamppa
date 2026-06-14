import type { Glossary } from '$lib/types';

// Term graph for the Statistics subject. Cross-linked via [[id]] inside bodies
// and `related` — this is what powers the nested tooltip graph. Day 1 (ch01)
// terms are authored first; later days extend this object.
export const glossary: Glossary = {
	'veroyatnostnoe-prostranstvo': {
		id: 'veroyatnostnoe-prostranstvo',
		term: 'Вероятностное пространство',
		short: String.raw`Тройка $(\Omega,\ \mathcal F,\ P)$ — формальная модель случайного опыта.`,
		formula: String.raw`(\Omega,\ \mathcal F,\ P)`,
		body: String.raw`**Вероятностное пространство** — это тройка $(\Omega,\ \mathcal F,\ P)$, где [[prostranstvo-ishodov|$\Omega$]] — множество всех элементарных исходов, [[sigma-algebra|$\mathcal F$]] — $\sigma$-алгебра событий, а [[veroyatnost|$P$]] — вероятностная мера на $\mathcal F$.

Это базовый объект всей теории: любая случайность в курсе описывается именно так.`,
		related: ['prostranstvo-ishodov', 'sigma-algebra', 'veroyatnost', 'aksiomy-kolmogorova']
	},

	'prostranstvo-ishodov': {
		id: 'prostranstvo-ishodov',
		term: 'Пространство элементарных исходов',
		short: String.raw`Множество $\Omega$ всех взаимоисключающих исходов опыта.`,
		formula: String.raw`\Omega = \{\omega_1, \omega_2, \dots\}`,
		body: String.raw`$\Omega$ — множество всех [[elementarnyy-ishod|элементарных исходов]] $\omega$ случайного эксперимента. Исходы **взаимоисключающие** и **исчерпывающие**: в одном опыте происходит ровно один $\omega$.

Например, для броска кубика $\Omega=\{1,2,3,4,5,6\}$.`,
		related: ['elementarnyy-ishod', 'sobytie']
	},

	'elementarnyy-ishod': {
		id: 'elementarnyy-ishod',
		term: 'Элементарный исход',
		short: String.raw`Один неделимый результат опыта $\omega \in \Omega$.`,
		body: String.raw`**Элементарный исход** $\omega$ — отдельный, неделимый результат эксперимента. Из элементарных исходов составляются [[sobytie|события]] как подмножества [[prostranstvo-ishodov|$\Omega$]].`,
		related: ['prostranstvo-ishodov', 'sobytie']
	},

	sobytie: {
		id: 'sobytie',
		term: 'Случайное событие',
		short: String.raw`Подмножество $A \subseteq \Omega$ (элемент $\sigma$-алгебры).`,
		formula: String.raw`A \subseteq \Omega,\quad A \in \mathcal F`,
		body: String.raw`**Событие** $A$ — это подмножество [[prostranstvo-ishodov|$\Omega$]], которому можно приписать вероятность, то есть элемент [[sigma-algebra|$\sigma$-алгебры]] $\mathcal F$. Говорят, что событие $A$ *произошло*, если наблюдаемый исход $\omega \in A$.

Крайние случаи — [[dostovernoe|достоверное]] ($\Omega$) и [[nevozmozhnoe|невозможное]] ($\varnothing$) события.`,
		related: ['operacii-nad-sobytiyami', 'nesovmestnye', 'protivopolozhnoe', 'sigma-algebra']
	},

	'sigma-algebra': {
		id: 'sigma-algebra',
		term: 'σ-алгебра',
		short: String.raw`Система событий, замкнутая относительно дополнения и счётных объединений.`,
		body: String.raw`$\sigma$-**алгебра** $\mathcal F$ — это набор подмножеств [[prostranstvo-ishodov|$\Omega$]], для которого выполнено:

1. $\Omega \in \mathcal F$;
2. если $A \in \mathcal F$, то [[protivopolozhnoe|$\bar A$]] $\in \mathcal F$ (замкнутость по дополнению);
3. если $A_1, A_2, \dots \in \mathcal F$, то $\bigcup_{i} A_i \in \mathcal F$ (замкнутость по счётным объединениям).

Именно на $\mathcal F$ определяется [[veroyatnost|вероятность]]. Для конечного $\Omega$ обычно берут все подмножества.`,
		related: ['sobytie', 'prostranstvo-ishodov', 'veroyatnost']
	},

	veroyatnost: {
		id: 'veroyatnost',
		term: 'Вероятность',
		short: String.raw`Мера $P:\mathcal F \to [0,1]$, удовлетворяющая аксиомам Колмогорова.`,
		formula: String.raw`P:\ \mathcal F \to [0,1]`,
		body: String.raw`**Вероятность** $P$ — функция, сопоставляющая каждому [[sobytie|событию]] число из $[0,1]$ и удовлетворяющая [[aksiomy-kolmogorova|аксиомам Колмогорова]]. Интуитивно $P(A)$ — мера «шанса», что произойдёт $A$.

Способы задать $P$: [[klassicheskaya-veroyatnost|классически]], геометрически и [[statisticheskaya-veroyatnost|статистически]].`,
		related: ['aksiomy-kolmogorova', 'statisticheskaya-veroyatnost', 'svoystva-veroyatnosti']
	},

	'aksiomy-kolmogorova': {
		id: 'aksiomy-kolmogorova',
		term: 'Аксиомы Колмогорова',
		short: String.raw`Неотрицательность, нормировка и счётная аддитивность.`,
		body: String.raw`Три аксиомы, задающие [[veroyatnost|вероятность]]:

1. **Неотрицательность:** $P(A) \ge 0$ для любого [[sobytie|события]] $A$.
2. **Нормировка:** $P(\Omega) = 1$.
3. **[[schetnaya-additivnost|Счётная аддитивность]]:** для попарно [[nesovmestnye|несовместных]] $A_1, A_2, \dots$ $$P\Big(\bigcup_i A_i\Big) = \sum_i P(A_i).$$

Из них выводятся все [[svoystva-veroyatnosti|свойства вероятности]].`,
		related: ['veroyatnost', 'nesovmestnye', 'svoystva-veroyatnosti', 'schetnaya-additivnost']
	},

	'schetnaya-additivnost': {
		id: 'schetnaya-additivnost',
		term: 'Счётная аддитивность',
		short: String.raw`Вероятность объединения попарно несовместных событий равна сумме их вероятностей.`,
		formula: String.raw`P\Big(\bigcup_i A_i\Big) = \sum_i P(A_i)`,
		body: String.raw`**Счётная аддитивность** — третья из [[aksiomy-kolmogorova|аксиом Колмогорова]]. Для попарно [[nesovmestnye|несовместных]] событий $A_1, A_2, \dots$ $$P\Big(\bigcup_i A_i\Big) = \sum_i P(A_i).$$ Именно она позволяет складывать вероятности и лежит в основе [[teorema-slozheniya|теоремы сложения]] и остальных [[svoystva-veroyatnosti|свойств вероятности]]. «Счётная» — потому что суммировать можно даже счётно-бесконечный набор несовместных событий.`,
		related: ['aksiomy-kolmogorova', 'nesovmestnye', 'teorema-slozheniya']
	},

	'operacii-nad-sobytiyami': {
		id: 'operacii-nad-sobytiyami',
		term: 'Операции над событиями',
		short: String.raw`Объединение, пересечение, разность, дополнение.`,
		body: String.raw`Над [[sobytie|событиями]] определены теоретико-множественные операции:

- **Объединение** $A \cup B$ — «$A$ или $B$»;
- **Пересечение** $A \cap B$ — «$A$ и $B$»;
- **Разность** $A \setminus B$ — «$A$, но не $B$»;
- **Дополнение** [[protivopolozhnoe|$\bar A$]] — «не $A$».

Действуют законы де Моргана: $\overline{A \cup B} = \bar A \cap \bar B$.`,
		related: ['protivopolozhnoe', 'nesovmestnye', 'sobytie']
	},

	nesovmestnye: {
		id: 'nesovmestnye',
		term: 'Несовместные события',
		short: String.raw`События, которые не могут произойти одновременно: $A \cap B = \varnothing$.`,
		formula: String.raw`A \cap B = \varnothing`,
		body: String.raw`События $A$ и $B$ **несовместны**, если $A \cap B = \varnothing$. Тогда [[teorema-slozheniya|теорема сложения]] упрощается: $P(A \cup B) = P(A) + P(B)$. Понятие лежит в основе [[polnaya-gruppa|полной группы событий]] и [[schetnaya-additivnost|счётной аддитивности]].`,
		related: ['teorema-slozheniya', 'polnaya-gruppa', 'aksiomy-kolmogorova']
	},

	'polnaya-gruppa': {
		id: 'polnaya-gruppa',
		term: 'Полная группа событий',
		short: String.raw`Попарно несовместны и в объединении дают всё $\Omega$.`,
		body: String.raw`События $H_1,\dots,H_n$ образуют **полную группу**, если они попарно [[nesovmestnye|несовместны]] и $\bigcup_i H_i = \Omega$. Тогда $\sum_i P(H_i) = 1$. Это основа формулы полной вероятности (день 3).`,
		related: ['nesovmestnye', 'protivopolozhnoe']
	},

	protivopolozhnoe: {
		id: 'protivopolozhnoe',
		term: 'Противоположное событие',
		short: String.raw`$\bar A = \Omega \setminus A$, причём $P(\bar A) = 1 - P(A)$.`,
		formula: String.raw`P(\bar A) = 1 - P(A)`,
		body: String.raw`**Противоположное** к $A$ событие $\bar A$ происходит ровно тогда, когда $A$ не происходит. $A$ и $\bar A$ образуют простейшую [[polnaya-gruppa|полную группу]], поэтому $$P(\bar A) = 1 - P(A).$$ Приём «перейти к противоположному» часто упрощает расчёт.`,
		related: ['polnaya-gruppa', 'svoystva-veroyatnosti']
	},

	'svoystva-veroyatnosti': {
		id: 'svoystva-veroyatnosti',
		term: 'Свойства вероятности',
		short: String.raw`Следствия аксиом: монотонность, формула дополнения и др.`,
		body: String.raw`Из [[aksiomy-kolmogorova|аксиом]] следует:

- $P(\varnothing) = 0$;
- **монотонность:** если $A \subseteq B$, то $P(A) \le P(B)$;
- $0 \le P(A) \le 1$;
- $P(\bar A) = 1 - P(A)$ (см. [[protivopolozhnoe|противоположное]]);
- [[teorema-slozheniya|теорема сложения]] и её обобщение — [[vklyuchenie-isklyuchenie|формула включений-исключений]].`,
		related: ['teorema-slozheniya', 'vklyuchenie-isklyuchenie', 'protivopolozhnoe']
	},

	'teorema-slozheniya': {
		id: 'teorema-slozheniya',
		term: 'Теорема сложения',
		short: String.raw`$P(A\cup B) = P(A)+P(B)-P(A\cap B)$.`,
		formula: String.raw`P(A\cup B) = P(A)+P(B)-P(A\cap B)`,
		body: String.raw`Для любых [[sobytie|событий]]: $$P(A\cup B) = P(A)+P(B)-P(A\cap B).$$ Вычитание $P(A\cap B)$ убирает дважды посчитанное пересечение. Для [[nesovmestnye|несовместных]] событий слагаемое исчезает. Обобщается до [[vklyuchenie-isklyuchenie|включений-исключений]].`,
		related: ['nesovmestnye', 'vklyuchenie-isklyuchenie', 'neravenstvo-bulya']
	},

	'vklyuchenie-isklyuchenie': {
		id: 'vklyuchenie-isklyuchenie',
		term: 'Принцип включений-исключений',
		short: String.raw`Обобщение теоремы сложения на $n$ событий.`,
		body: String.raw`$$P\Big(\bigcup_{i=1}^n A_i\Big) = \sum_i P(A_i) - \sum_{i<j} P(A_i\cap A_j) + \sum_{i<j<k} P(A_i\cap A_j\cap A_k) - \dots$$ Знаки чередуются. Это прямое обобщение [[teorema-slozheniya|теоремы сложения]] на произвольное число [[sobytie|событий]].`,
		related: ['teorema-slozheniya', 'neravenstvo-bulya']
	},

	'neravenstvo-bulya': {
		id: 'neravenstvo-bulya',
		term: 'Неравенство Буля',
		short: String.raw`$P(\bigcup_i A_i) \le \sum_i P(A_i)$.`,
		formula: String.raw`P\Big(\bigcup_i A_i\Big) \le \sum_i P(A_i)`,
		body: String.raw`**Неравенство Буля** (субаддитивность): вероятность объединения не превосходит суммы вероятностей. Получается из [[vklyuchenie-isklyuchenie|включений-исключений]] отбрасыванием неотрицательных пересечений. Удобно для верхних оценок.`,
		related: ['teorema-slozheniya', 'vklyuchenie-isklyuchenie']
	},

	'klassicheskaya-veroyatnost': {
		id: 'klassicheskaya-veroyatnost',
		term: 'Классическая вероятность',
		short: String.raw`$P(A) = \dfrac{m}{n}$ — доля благоприятных исходов.`,
		formula: String.raw`P(A) = \frac{m}{n}`,
		body: String.raw`Если все [[elementarnyy-ishod|элементарные исходы]] равновозможны, то $$P(A) = \frac{m}{n},$$ где $n=|\Omega|$ — общее число исходов, $m=|A|$ — число благоприятных. Подробно — день 2 (комбинаторика).`,
		related: ['prostranstvo-ishodov', 'statisticheskaya-veroyatnost']
	},

	'statisticheskaya-veroyatnost': {
		id: 'statisticheskaya-veroyatnost',
		term: 'Статистическое определение',
		short: String.raw`Вероятность как предел относительной частоты.`,
		formula: String.raw`P(A) \approx \frac{n_A}{n}`,
		body: String.raw`При больших $n$ относительная частота события $\frac{n_A}{n}$ устойчиво приближается к $P(A)$. Это **мост к статистике**: именно так мы оцениваем неизвестные вероятности по данным (см. [[veroyatnost|вероятность]]) и обосновываем метод Монте-Карло.`,
		related: ['klassicheskaya-veroyatnost', 'veroyatnost']
	},

	dostovernoe: {
		id: 'dostovernoe',
		term: 'Достоверное событие',
		short: String.raw`Событие $\Omega$, происходящее всегда: $P(\Omega)=1$.`,
		body: String.raw`**Достоверное** событие совпадает со всем [[prostranstvo-ishodov|$\Omega$]] и происходит при любом исходе: $P(\Omega)=1$. Противоположно [[nevozmozhnoe|невозможному]].`,
		related: ['nevozmozhnoe', 'prostranstvo-ishodov']
	},

	nevozmozhnoe: {
		id: 'nevozmozhnoe',
		term: 'Невозможное событие',
		short: String.raw`Пустое событие $\varnothing$: $P(\varnothing)=0$.`,
		body: String.raw`**Невозможное** событие — пустое множество $\varnothing$, не содержащее ни одного [[elementarnyy-ishod|исхода]]: $P(\varnothing)=0$. Противоположно [[dostovernoe|достоверному]]. Внимание: $P(A)=0$ не всегда означает, что $A$ невозможно (важно для непрерывных величин).`,
		related: ['dostovernoe', 'elementarnyy-ishod']
	}
};
