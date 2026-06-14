import type { Glossary } from '$lib/types';

// New terms introduced on Day 2 (ch02): combinatorics + geometric probability.
// Base terms (klassicheskaya-veroyatnost, statisticheskaya-veroyatnost, …)
// already live in glossary.ts and are only referenced here, not redefined.
export const day02Terms: Glossary = {
	ravnovozmozhnost: {
		id: 'ravnovozmozhnost',
		term: 'Равновозможность',
		short: String.raw`У исходов нет оснований считать один более вероятным, чем другой.`,
		body: String.raw`[[elementarnyy-ishod|Элементарные исходы]] **равновозможны**, если по условиям опыта нет причин считать какой-либо из них более вероятным, чем остальные. Это ключевое требование [[klassicheskaya-veroyatnost|классического определения]]: только тогда осмысленна формула $P(A)=M/N$.

Равновозможность — не математический факт, а **модельное допущение** о симметрии опыта (правильная кость, честная монета). Неверно выделив $\Omega$, можно получить неравновозможные исходы и ошибиться в ответе.`,
		related: ['klassicheskaya-veroyatnost', 'elementarnyy-ishod', 'blagopriyatstvuyushchiy-ishod']
	},

	'blagopriyatstvuyushchiy-ishod': {
		id: 'blagopriyatstvuyushchiy-ishod',
		term: 'Благоприятствующий исход',
		short: String.raw`Исход $\omega$, при котором событие $A$ наступает: $\omega\in A$.`,
		body: String.raw`[[elementarnyy-ishod|Исход]] $\omega$ **благоприятствует** [[sobytie|событию]] $A$, если он влечёт его наступление, то есть $\omega\in A$. Число благоприятствующих исходов $M=|A|$ стоит в числителе [[klassicheskaya-veroyatnost|классической вероятности]] $P(A)=M/N$.`,
		related: ['klassicheskaya-veroyatnost', 'ravnovozmozhnost', 'sobytie']
	},

	kombinatorika: {
		id: 'kombinatorika',
		term: 'Комбинаторика',
		short: String.raw`Раздел математики о подсчёте числа комбинаций из конечного множества.`,
		body: String.raw`**Комбинаторика** изучает, сколько различных комбинаций, подчинённых заданным условиям, можно составить из элементов конечного множества. Для [[klassicheskaya-veroyatnost|классической вероятности]] она даёт инструмент подсчёта $M$ и $N$ в формуле $P(A)=M/N$.

Всё строится на двух базовых правилах — [[pravilo-summy|сумме]] и [[pravilo-proizvedeniya|произведении]] — и трёх схемах выбора: [[perestanovki|перестановки]], [[razmeshcheniya|размещения]], [[sochetaniya|сочетания]].`,
		related: ['pravilo-summy', 'pravilo-proizvedeniya', 'perestanovki', 'razmeshcheniya', 'sochetaniya']
	},

	'pravilo-summy': {
		id: 'pravilo-summy',
		term: 'Правило суммы',
		short: String.raw`Выбор «$A$ либо $B$» из непересекающихся множеств — $m+k$ способов.`,
		formula: String.raw`m + k`,
		body: String.raw`Если объект $A$ можно выбрать $m$ способами, объект $B$ — $k$ способами, и эти способы **не пересекаются**, то выбор «$A$ *либо* $B$» можно сделать $m+k$ способами.

Это комбинаторная форма [[teorema-slozheniya|сложения]] для [[nesovmestnye|несовместных]] вариантов. Парное правило — [[pravilo-proizvedeniya|правило произведения]].`,
		related: ['pravilo-proizvedeniya', 'kombinatorika', 'nesovmestnye']
	},

	'pravilo-proizvedeniya': {
		id: 'pravilo-proizvedeniya',
		term: 'Правило произведения',
		short: String.raw`Выбор пары «$A$ и $B$» — $m\cdot k$ способов.`,
		formula: String.raw`m \cdot k`,
		body: String.raw`Если объект $A$ можно выбрать $m$ способами, и после каждого такого выбора объект $B$ можно (независимо) выбрать $k$ способами, то пару «$A$ *и* $B$» можно выбрать $m\cdot k$ способами.

Обобщается на любое число шагов: $n_1\cdot n_2\cdots n_k$. Это фундамент всех формул [[kombinatorika|комбинаторики]] — из него напрямую выводятся [[perestanovki|перестановки]] и [[razmeshcheniya|размещения]].`,
		related: ['pravilo-summy', 'kombinatorika', 'perestanovki', 'razmeshcheniya']
	},

	perestanovki: {
		id: 'perestanovki',
		term: 'Перестановки',
		short: String.raw`Упорядочения всех $n$ элементов: $P_n=n!$.`,
		formula: String.raw`P_n = n!`,
		body: String.raw`**Перестановки** — последовательности из всех $n$ различимых элементов, отличающиеся только порядком. Их число $$P_n=n!=1\cdot2\cdot3\cdots n,\qquad 0!=1.$$ По [[pravilo-proizvedeniya|правилу произведения]]: на первое место $n$ кандидатов, на второе $n-1$ и так далее.

Перестановка — частный случай [[razmeshcheniya|размещения]] из $n$ по $n$.`,
		related: ['razmeshcheniya', 'pravilo-proizvedeniya', 'kombinatorika']
	},

	razmeshcheniya: {
		id: 'razmeshcheniya',
		term: 'Размещения',
		short: String.raw`Упорядоченные выборки $k$ из $n$: $A_n^k=\dfrac{n!}{(n-k)!}$.`,
		formula: String.raw`A_n^k = \frac{n!}{(n-k)!}`,
		body: String.raw`**Размещения** из $n$ по $k$ — упорядоченные выборки $k$ элементов, различающиеся составом *или* порядком. Без повторений $$A_n^k=\frac{n!}{(n-k)!}=n(n-1)\cdots(n-k+1).$$ С повторениями (каждый элемент можно брать многократно) — $\overline{A}_n^{\,k}=n^k$.

Порядок важен — этим размещения отличаются от [[sochetaniya|сочетаний]].`,
		related: ['perestanovki', 'sochetaniya', 'pravilo-proizvedeniya']
	},

	sochetaniya: {
		id: 'sochetaniya',
		term: 'Сочетания',
		short: String.raw`Неупорядоченные выборки $k$ из $n$: $C_n^k=\dfrac{n!}{k!\,(n-k)!}$.`,
		formula: String.raw`C_n^k = \frac{n!}{k!\,(n-k)!}`,
		body: String.raw`**Сочетания** из $n$ по $k$ — неупорядоченные выборки $k$ элементов, различающиеся только составом. $$C_n^k=\frac{n!}{k!\,(n-k)!},\qquad k\le n.$$ Связь с [[razmeshcheniya|размещениями]]: каждое сочетание даёт $k!$ упорядочений, поэтому $A_n^k=C_n^k\cdot k!$.

Числа $C_n^k$ — [[binom-nyutona|биномиальные коэффициенты]]. Свойства: $C_n^0=C_n^n=1$, симметрия $C_n^k=C_n^{\,n-k}$ и [[treugolnik-paskalya|правило Паскаля]] $C_n^k=C_{n-1}^{k-1}+C_{n-1}^{k}$.`,
		related: ['razmeshcheniya', 'binom-nyutona', 'treugolnik-paskalya']
	},

	'treugolnik-paskalya': {
		id: 'treugolnik-paskalya',
		term: 'Треугольник Паскаля',
		short: String.raw`$C_n^k=C_{n-1}^{k-1}+C_{n-1}^{k}$ — рекуррентность биномиальных коэффициентов.`,
		formula: String.raw`C_n^k = C_{n-1}^{k-1} + C_{n-1}^{k}`,
		body: String.raw`Рекуррентное соотношение для [[sochetaniya|сочетаний]]: $$C_n^k=C_{n-1}^{k-1}+C_{n-1}^{k}.$$ Комбинаторный смысл: фиксируем один элемент. Либо он входит в выборку (тогда добираем $k-1$ из оставшихся $n-1$), либо нет (берём все $k$ из $n-1$). Это разбиение на два [[nesovmestnye|непересекающихся]] случая по [[pravilo-summy|правилу суммы]] и даёт формулу. Каждое число в треугольнике — сумма двух над ним.`,
		related: ['sochetaniya', 'binom-nyutona', 'pravilo-summy']
	},

	'binom-nyutona': {
		id: 'binom-nyutona',
		term: 'Бином Ньютона',
		short: String.raw`$(p+q)^n=\sum_k C_n^k\,p^k q^{\,n-k}$.`,
		formula: String.raw`(p+q)^n = \sum_{k=0}^{n} C_n^k\, p^k q^{\,n-k}`,
		body: String.raw`Разложение степени суммы: $$(p+q)^n=\sum_{k=0}^{n} C_n^k\, p^k q^{\,n-k}.$$ Коэффициенты — [[sochetaniya|сочетания]] $C_n^k$, отсюда название «биномиальные коэффициенты».

При $p=q=1$: $\sum_k C_n^k=2^n$ — число всех подмножеств $n$-множества. При $q=1-p$ сумма равна $1$ — это нормировка биномиального распределения (день про дискретные с.в.).`,
		related: ['sochetaniya', 'treugolnik-paskalya']
	},

	'geometricheskaya-veroyatnost': {
		id: 'geometricheskaya-veroyatnost',
		term: 'Геометрическая вероятность',
		short: String.raw`$P(A)=\dfrac{S_A}{S_\Omega}$ — отношение мер областей.`,
		formula: String.raw`P(A) = \frac{S_A}{S_\Omega}`,
		body: String.raw`Когда исходов бесконечно много (точка наудачу в области), [[klassicheskaya-veroyatnost|классическая формула]] неприменима. Если точка бросается **равномерно** в область $\Omega$ конечной меры, то для подобласти $A$ $$P(A)=\frac{S_A}{S_\Omega},$$ где $S$ — длина, площадь или объём.

Это аналог классического определения для непрерывного случая: «доля благоприятной меры» вместо «доли благоприятных исходов». Корректность зависит от того, что именно считать «равномерно случайным» (см. парадокс Бертрана).`,
		related: ['klassicheskaya-veroyatnost', 'ravnovozmozhnost']
	},

	'gipergeometricheskaya-shema': {
		id: 'gipergeometricheskaya-shema',
		term: 'Гипергеометрическая схема',
		short: String.raw`Выбор $n$ из $N$ без возврата; вероятность ровно $m$ «помеченных».`,
		formula: String.raw`P = \frac{C_M^m\,C_{N-M}^{\,n-m}}{C_N^n}`,
		body: String.raw`В партии из $N$ объектов $M$ «помеченных» (бракованных). Без возврата и без учёта порядка берут $n$ объектов. Вероятность, что среди них ровно $m$ помеченных: $$P=\frac{C_M^m\,C_{N-M}^{\,n-m}}{C_N^n}.$$ Числитель — по [[pravilo-proizvedeniya|правилу произведения]]: $C_M^m$ способов выбрать помеченные и $C_{N-M}^{\,n-m}$ — остальные. Знаменатель — все [[sochetaniya|сочетания]] $C_N^n$.

Это типовое применение [[kombinatorika|комбинаторики]] к [[klassicheskaya-veroyatnost|классической вероятности]]; на ней основано гипергеометрическое распределение.`,
		related: ['sochetaniya', 'klassicheskaya-veroyatnost', 'kombinatorika', 'pravilo-proizvedeniya']
	}
};
