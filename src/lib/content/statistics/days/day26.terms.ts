import type { Glossary } from '$lib/types';

// Новые термины дня 26 — поглощающие цепи и фундаментальная матрица N.
export const day26Terms: Glossary = {
	'pogloschayuschee-sostoyanie': {
		id: 'pogloschayuschee-sostoyanie',
		term: 'Поглощающее состояние',
		short: String.raw`Состояние, из которого нет выхода: $p_{ii}=1$.`,
		formula: String.raw`p_{ii}=1,\quad p_{ij}=0\ (j\neq i)`,
		body: String.raw`Состояние $u_i$ цепи Маркова **поглощающее**, если, попав в него, процесс остаётся там навсегда: $$p_{ii}=1,\qquad p_{ij}=0\ \ (j\neq i).$$ Строка матрицы перехода такого состояния — единица на диагонали и нули вне её. Состояния, не являющиеся поглощающими, называют [[nevozvratnoe-sostoyanie|невозвратными]].`,
		related: ['nevozvratnoe-sostoyanie', 'pogloschayuschaya-cep']
	},

	'nevozvratnoe-sostoyanie': {
		id: 'nevozvratnoe-sostoyanie',
		term: 'Невозвратное состояние',
		short: String.raw`Транзитное состояние: процесс рано или поздно его покидает навсегда.`,
		body: String.raw`**Невозвратное** (транзитное, проходное) состояние — то, в котором процесс пребывает лишь конечное число шагов, после чего покидает его и в конце концов попадает в [[pogloschayuschee-sostoyanie|поглощающее]]. Переходы между невозвратными состояниями собраны в блок [[matrica-Q|$Q$]] [[kanonicheskaya-forma|канонической формы]].`,
		related: ['pogloschayuschee-sostoyanie', 'matrica-Q']
	},

	'pogloschayuschaya-cep': {
		id: 'pogloschayuschaya-cep',
		term: 'Поглощающая цепь',
		short: String.raw`Цепь с поглощающим состоянием, достижимым из любого невозвратного.`,
		body: String.raw`Цепь Маркова **поглощающая**, если (1) у неё есть хотя бы одно [[pogloschayuschee-sostoyanie|поглощающее состояние]] и (2) из каждого [[nevozvratnoe-sostoyanie|невозвратного]] состояния за конечное число шагов можно с положительной вероятностью попасть в поглощающее.

Ключевой факт: такая цепь поглощается с вероятностью $1$ — бесконечно блуждать среди невозвратных состояний нельзя.`,
		related: ['pogloschayuschee-sostoyanie', 'nevozvratnoe-sostoyanie', 'fundamentalnaya-matrica']
	},

	'kanonicheskaya-forma': {
		id: 'kanonicheskaya-forma',
		term: 'Каноническая форма',
		short: String.raw`Блочная запись матрицы перехода с поглощающими состояниями впереди.`,
		formula: String.raw`P=\left(\begin{array}{c|c} I & 0\\\hline R & Q\end{array}\right)`,
		body: String.raw`Если перенумеровать состояния так, чтобы $m$ [[pogloschayuschee-sostoyanie|поглощающих]] шли первыми, а $n-m$ [[nevozvratnoe-sostoyanie|невозвратных]] — последними, матрица перехода принимает блочный вид $$P=\left(\begin{array}{c|c} I & 0\\\hline R & Q\end{array}\right),$$ где $I$ — единичная $m\times m$, $0$ — нулевая, [[matrica-R|$R$]] — переходы невозвратных в поглощающие, [[matrica-Q|$Q$]] — переходы между невозвратными.`,
		related: ['matrica-Q', 'matrica-R', 'fundamentalnaya-matrica']
	},

	'matrica-Q': {
		id: 'matrica-Q',
		term: 'Блок Q',
		short: String.raw`Переходы между невозвратными состояниями.`,
		formula: String.raw`(Q^s)_{ij}=P(\text{из }u_i\text{ за }s\text{ шагов в }u_j,\ \text{не поглощён})`,
		body: String.raw`Блок $Q$ размера $(n-m)\times(n-m)$ из [[kanonicheskaya-forma|канонической формы]] описывает переходы между [[nevozvratnoe-sostoyanie|невозвратными]] состояниями. Его степени имеют вероятностный смысл: $(Q^s)_{ij}$ — вероятность за $s$ шагов попасть из $u_i$ в $u_j$, ни разу не будучи поглощённым. Так как поглощение неизбежно, $Q^s\to 0$, и ряд $\sum_s Q^s$ сходится к [[fundamentalnaya-matrica|$N$]].`,
		related: ['matrica-R', 'kanonicheskaya-forma', 'fundamentalnaya-matrica']
	},

	'matrica-R': {
		id: 'matrica-R',
		term: 'Блок R',
		short: String.raw`Переходы из невозвратных состояний в поглощающие.`,
		body: String.raw`Блок $R$ размера $(n-m)\times m$ из [[kanonicheskaya-forma|канонической формы]] содержит вероятности перехода из [[nevozvratnoe-sostoyanie|невозвратных]] состояний прямо в [[pogloschayuschee-sostoyanie|поглощающие]]. Вместе с [[matrica-Q|$Q$]] строки $(R\ Q)$ стохастичны: $R\mathbf 1+Q\mathbf 1=\mathbf 1$. Через $R$ считают [[matrica-pogloscheniya|матрицу вероятностей поглощения]] $B=NR$.`,
		related: ['matrica-Q', 'matrica-pogloscheniya', 'kanonicheskaya-forma']
	},

	'fundamentalnaya-matrica': {
		id: 'fundamentalnaya-matrica',
		term: 'Фундаментальная матрица',
		short: String.raw`$N=(I-Q)^{-1}=\sum_{s\ge0}Q^s$ — среднее число посещений невозвратных состояний.`,
		formula: String.raw`N=(I-Q)^{-1}=\sum_{s=0}^{\infty}Q^{s}`,
		body: String.raw`**Фундаментальная матрица** поглощающей цепи: $$N=(I-Q)^{-1}=\sum_{s=0}^{\infty}Q^{s}.$$ Элемент $n_{ij}$ равен среднему числу посещений [[nevozvratnoe-sostoyanie|невозвратного]] состояния $u_j$ при старте из $u_i$ до поглощения. Сумма $i$-й строки даёт [[srednee-vremya-pogloscheniya|среднее время до поглощения]] $t_i$, а $N R$ — [[matrica-pogloscheniya|вероятности поглощения]].`,
		related: ['matrica-Q', 'srednee-vremya-pogloscheniya', 'matrica-pogloscheniya']
	},

	'srednee-vremya-pogloscheniya': {
		id: 'srednee-vremya-pogloscheniya',
		term: 'Среднее время до поглощения',
		short: String.raw`$t_i=\sum_j n_{ij}$ — ожидаемое число шагов до поглощения, $t=N\mathbf 1$.`,
		formula: String.raw`t=N\mathbf{1},\qquad t_i=\sum_j n_{ij}`,
		body: String.raw`Ожидаемое число шагов до поглощения при старте из [[nevozvratnoe-sostoyanie|невозвратного]] состояния $u_i$ равно сумме элементов $i$-й строки [[fundamentalnaya-matrica|фундаментальной матрицы]]: $$t_i=\sum_j n_{ij},\qquad t=N\mathbf 1,$$ где $\mathbf 1$ — столбец единиц. Интуиция: общее время = сумма средних пребываний во всех невозвратных состояниях.`,
		related: ['fundamentalnaya-matrica', 'matrica-pogloscheniya']
	},

	'matrica-pogloscheniya': {
		id: 'matrica-pogloscheniya',
		term: 'Матрица вероятностей поглощения',
		short: String.raw`$B=NR$: $b_{ij}$ — вероятность поглощения в $u_j$ при старте из $u_i$.`,
		formula: String.raw`B=N R,\qquad \sum_j b_{ij}=1`,
		body: String.raw`**Матрица вероятностей поглощения** $$B=N R$$ размера $(n-m)\times m$: элемент $b_{ij}$ — вероятность того, что цепь, стартовав из [[nevozvratnoe-sostoyanie|невозвратного]] $u_i$, будет в итоге поглощена в [[pogloschayuschee-sostoyanie|поглощающем]] $u_j$. Матрица стохастична по строкам ($\sum_j b_{ij}=1$): поглощение происходит с вероятностью $1$.`,
		related: ['fundamentalnaya-matrica', 'matrica-R', 'pogloschayuschaya-cep']
	}
};
