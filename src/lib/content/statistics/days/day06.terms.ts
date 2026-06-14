import type { Glossary } from '$lib/types';

// Новые термины дня 6 (ch06): схема Бернулли и основные дискретные распределения.
// Базовые термины (события, несовместность, полная группа, противоположное,
// статистическое определение) переиспользуются из основного glossary.ts.
export const day06Terms: Glossary = {
	'povtornye-ispytaniya': {
		id: 'povtornye-ispytaniya',
		term: 'Повторные независимые испытания',
		short: String.raw`Серия из $n$ одинаковых независимых опытов с вероятностью успеха $p$.`,
		body: String.raw`**Повторные независимые испытания** — серия из $n$ опытов, в каждом из которых [[sobytie|событие]] $A$ («успех») наступает с одной и той же вероятностью $p$, не зависящей от исходов остальных опытов. Интерес представляет общее число успехов. Частный случай при двух исходах — [[shema-bernulli|схема Бернулли]].`,
		related: ['shema-bernulli', 'formula-bernulli']
	},

	'shema-bernulli': {
		id: 'shema-bernulli',
		term: 'Схема Бернулли',
		short: String.raw`Повторные независимые испытания с двумя исходами: успех ($p$) и неудача ($q=1-p$).`,
		formula: String.raw`P(A)=p,\quad q=1-p`,
		body: String.raw`**Схема Бернулли** — модель [[povtornye-ispytaniya|повторных независимых испытаний]], в каждом из которых ровно два исхода: «успех» с вероятностью $p$ и «неудача» [[protivopolozhnoe|$\bar A$]] с вероятностью $q=1-p$. Число успехов в $n$ испытаниях подчиняется [[binomialnoe-raspredelenie|биномиальному закону]], а вероятности отдельных значений даёт [[formula-bernulli|формула Бернулли]].`,
		related: ['formula-bernulli', 'binomialnoe-raspredelenie', 'bernullievskaya-velichina']
	},

	'formula-bernulli': {
		id: 'formula-bernulli',
		term: 'Формула Бернулли',
		short: String.raw`Вероятность ровно $k$ успехов в $n$ испытаниях.`,
		formula: String.raw`P_n(k)=C_n^{k}\,p^{k}\,q^{\,n-k}`,
		body: String.raw`Вероятность того, что в $n$ испытаниях [[shema-bernulli|схемы Бернулли]] успех наступит ровно $k$ раз: $$P_n(k)=C_n^{k}\,p^{k}\,q^{\,n-k},\qquad k=0,1,\dots,n.$$ Множитель $p^{k}q^{\,n-k}$ — вероятность одного сценария с $k$ успехами, а [[chislo-sochetaniy|$C_n^{k}$]] считает число таких сценариев. Удобна при небольших $n$; при больших $n$ переходят к [[raspredelenie-puassona|Пуассону]] или теоремам Лапласа.`,
		related: ['shema-bernulli', 'chislo-sochetaniy', 'binomialnoe-raspredelenie']
	},

	'chislo-sochetaniy': {
		id: 'chislo-sochetaniy',
		term: 'Число сочетаний',
		short: String.raw`$C_n^{k}$ — число способов выбрать $k$ элементов из $n$ без учёта порядка.`,
		formula: String.raw`C_n^{k}=\dfrac{n!}{k!\,(n-k)!}`,
		body: String.raw`**Число сочетаний** $C_n^{k}$ (биномиальный коэффициент) — количество способов выбрать $k$ элементов из $n$ без учёта порядка: $$C_n^{k}=\frac{n!}{k!\,(n-k)!}.$$ В [[formula-bernulli|формуле Бернулли]] оно считает, сколькими способами $k$ успехов могут расположиться среди $n$ испытаний.`,
		related: ['formula-bernulli']
	},

	'diskretnoe-raspredelenie': {
		id: 'diskretnoe-raspredelenie',
		term: 'Дискретное распределение',
		short: String.raw`Закон случайной величины со счётным набором значений и их вероятностями.`,
		body: String.raw`**Дискретное распределение** задаёт случайную величину $X$, принимающую конечное или счётное число значений $x_k$ с вероятностями $p_k=P(X=x_k)$, причём $\sum_k p_k=1$ (условие нормировки). Набор пар $(x_k,p_k)$ называют **рядом распределения**. Примеры из этого дня — [[binomialnoe-raspredelenie|биномиальное]], [[raspredelenie-puassona|Пуассона]], [[geometricheskoe-raspredelenie|геометрическое]].`,
		related: ['binomialnoe-raspredelenie', 'raspredelenie-puassona', 'geometricheskoe-raspredelenie']
	},

	'bernullievskaya-velichina': {
		id: 'bernullievskaya-velichina',
		term: 'Распределение Бернулли',
		short: String.raw`Индикатор успеха в одном испытании: $1$ с вероятностью $p$, $0$ с вероятностью $q$.`,
		formula: String.raw`M(X)=p,\quad D(X)=pq`,
		body: String.raw`Случайная величина $X$ имеет **распределение Бернулли**, если принимает значение $1$ («успех») с вероятностью $p$ и $0$ («неудача») с вероятностью $q=1-p$. Это индикатор [[sobytie|события]] в одном испытании. Характеристики: $M(X)=p$, $M(X^2)=p$, поэтому $$D(X)=M(X^2)-\big(M(X)\big)^2=p-p^2=pq.$$ Сумма $n$ независимых бернуллиевских величин с общим $p$ даёт [[binomialnoe-raspredelenie|биномиальную]].`,
		related: ['binomialnoe-raspredelenie', 'shema-bernulli']
	},

	'binomialnoe-raspredelenie': {
		id: 'binomialnoe-raspredelenie',
		term: 'Биномиальное распределение',
		short: String.raw`Число успехов в $n$ испытаниях схемы Бернулли.`,
		formula: String.raw`M(X)=np,\quad D(X)=npq`,
		body: String.raw`Число успехов $X$ в $n$ испытаниях [[shema-bernulli|схемы Бернулли]] подчиняется **биномиальному распределению** с параметрами $n,p$: вероятности значений даёт [[formula-bernulli|формула Бернулли]] $P(X=k)=C_n^{k}p^{k}q^{\,n-k}$. Числовые характеристики: $$M(X)=np,\qquad D(X)=npq,\qquad \sigma=\sqrt{npq}.$$ При $n=1$ сводится к [[bernullievskaya-velichina|распределению Бернулли]], а при больших $n$ и малых $p$ приближается [[raspredelenie-puassona|Пуассоном]].`,
		related: ['formula-bernulli', 'bernullievskaya-velichina', 'raspredelenie-puassona']
	},

	'raspredelenie-puassona': {
		id: 'raspredelenie-puassona',
		term: 'Распределение Пуассона',
		short: String.raw`Закон редких событий: $P(X=k)=\dfrac{\lambda^k}{k!}e^{-\lambda}$.`,
		formula: String.raw`P(X=k)=\dfrac{\lambda^{k}}{k!}\,e^{-\lambda}`,
		body: String.raw`Случайная величина $X$ с значениями $k=0,1,2,\dots$ имеет **распределение Пуассона** с параметром $\lambda>0$, если $$P(X=k)=\frac{\lambda^{k}}{k!}\,e^{-\lambda}.$$ Это предел [[binomialnoe-raspredelenie|биномиального]] при $n\to\infty$, $p\to0$, $np=\lambda$ ([[teorema-puassona|теорема Пуассона]]), поэтому его называют **законом редких событий**. Особенность: $$M(X)=\lambda,\qquad D(X)=\lambda$$ — среднее и дисперсия совпадают.`,
		related: ['teorema-puassona', 'binomialnoe-raspredelenie', 'diskretnoe-raspredelenie']
	},

	'teorema-puassona': {
		id: 'teorema-puassona',
		term: 'Теорема Пуассона',
		short: String.raw`Биномиальные вероятности сходятся к пуассоновским при $np=\lambda=\mathrm{const}$.`,
		formula: String.raw`\lim_{n\to\infty}C_n^{k}p^{k}q^{\,n-k}=\dfrac{\lambda^{k}}{k!}e^{-\lambda}`,
		body: String.raw`**Теорема Пуассона.** Если $n\to\infty$, $p\to0$, а произведение $np=\lambda$ остаётся постоянным (обычно $0<\lambda\le10$), то [[formula-bernulli|биномиальные вероятности]] сходятся к пуассоновским: $$\lim_{n\to\infty}C_n^{k}\,p^{k}\,q^{\,n-k}=\frac{\lambda^{k}}{k!}\,e^{-\lambda}.$$ На практике даёт хорошее приближение [[binomialnoe-raspredelenie|биномиального]] при больших $n$ и малых $p$.`,
		related: ['raspredelenie-puassona', 'binomialnoe-raspredelenie', 'formula-bernulli']
	},

	'geometricheskoe-raspredelenie': {
		id: 'geometricheskoe-raspredelenie',
		term: 'Геометрическое распределение',
		short: String.raw`Номер испытания, в котором впервые наступает успех.`,
		formula: String.raw`P(X=k)=q^{\,k-1}p`,
		body: String.raw`Случайная величина $X$ — номер испытания, в котором впервые наступает успех в [[shema-bernulli|схеме Бернулли]] — имеет **геометрическое распределение** с параметром $p$: $$P(X=k)=q^{\,k-1}p,\qquad k=1,2,3,\dots$$ Первые $k-1$ опытов — неудачи (вероятность $q^{\,k-1}$), $k$-й — успех. Вероятности образуют геометрическую прогрессию. Характеристики: $$M(X)=\frac{1}{p},\qquad D(X)=\frac{q}{p^{2}}.$$`,
		related: ['shema-bernulli', 'diskretnoe-raspredelenie']
	},

	'gipergeometricheskoe-raspredelenie': {
		id: 'gipergeometricheskoe-raspredelenie',
		term: 'Гипергеометрическое распределение',
		short: String.raw`Число отмеченных объектов при выборе без возвращения.`,
		formula: String.raw`P(X=m)=\dfrac{C_M^{\,m}\,C_{N-M}^{\,n-m}}{C_N^{\,n}}`,
		body: String.raw`Из совокупности в $N$ объектов, среди которых $M$ «отмеченных», без возвращения извлекают $n$ объектов. Число отмеченных $X$ в выборке имеет **гипергеометрическое распределение**: $$P(X=m)=\frac{C_M^{\,m}\,C_{N-M}^{\,n-m}}{C_N^{\,n}}.$$ Это [[klassicheskaya-veroyatnost|классическая вероятность]] для выбора без возвращения. При $N\to\infty$, $M/N\to p$ переходит в [[binomialnoe-raspredelenie|биномиальное]] (выбор без возвращения из большой совокупности неотличим от выбора с возвращением).`,
		related: ['binomialnoe-raspredelenie', 'klassicheskaya-veroyatnost', 'chislo-sochetaniy']
	}
};
