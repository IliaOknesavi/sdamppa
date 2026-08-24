import type { Glossary } from '$lib/types';

// Термины, вводимые в день 9. Термины общего глоссария здесь намеренно НЕ
// переобъявляются, а только связываются через [[...]] и related:
//   metriki-rho, komponenta-svyaznosti.
// Метрика, метрическое и топологическое пространство продублированы из
// соседних дней специально: день должен резолвиться независимо.
export const day09Terms: Glossary = {
	'vneshnee-umnozhenie': {
		id: 'vneshnee-umnozhenie',
		term: 'Внешнее умножение',
		short: String.raw`$\ast:\mathbb R\times M\to M$ — умножение элемента $M$ на скаляр.`,
		formula: String.raw`\ast:\mathbb R\times M\to M`,
		body: String.raw`Операция $\ast$, умножающая элемент носителя [[lineynoe-prostranstvo|линейного пространства]] на скаляр из $\mathbb R$. Называется **внешней**, потому что один её аргумент лежит вне $M$, — в отличие от внутреннего сложения $+:M\times M\to M$; у [[metricheskoe-prostranstvo|метрического пространства]] такой операции нет, там носитель — произвольное множество.`,
		related: ['lineynoe-prostranstvo', 'odnorodnost-normy', 'neytralnyy-element']
	},

	'neytralnyy-element': {
		id: 'neytralnyy-element',
		term: 'Нейтральный элемент θ (нуль по сложению)',
		short: String.raw`$\theta\in M$ с $x+\theta=x$; это вектор, а не число $0\in\mathbb R$.`,
		formula: String.raw`\forall x\in M:\ x+\theta=x`,
		body: String.raw`**Нейтральный элемент** операции $+$ в [[lineynoe-prostranstvo|линейном пространстве]] — такой $\theta\in M$, что $x+\theta=x$ для всех $x$. Его называют нулём по сложению и часто пишут тем же символом $0$, что и число, но $\theta$ — вектор, а не число $0\in\mathbb R$: в $\mathbb R^2$ это $(0,0)$, в пространстве функций — тождественный нуль, в матрицах — нулевая матрица. Отсюда и оговорка в [[nevyrozhdennost-normy|невырожденности]] $\|x\|=0\iff x=\theta$.`,
		related: ['lineynoe-prostranstvo', 'nevyrozhdennost-normy', 'norma']
	},

	norma: {
		id: 'norma',
		term: 'Норма',
		short: String.raw`$\|\cdot\|:M\to\mathbb R$ с тремя аксиомами; это длина одного вектора.`,
		formula: String.raw`\|x\|\ge0;\quad \|\alpha\ast x\|=|\alpha|\cdot\|x\|;\quad \|x\|+\|y\|\ge\|x+y\|`,
		body: String.raw`**Норма** — функция $\|\cdot\|:M\to\mathbb R$ на [[lineynoe-prostranstvo|линейном пространстве]] с тремя аксиомами: [[nevyrozhdennost-normy|невырожденность]] ($\|x\|\ge0$, и нуль только на нуле по сложению), [[odnorodnost-normy|однородность]] $\|\alpha\ast x\|=|\alpha|\cdot\|x\|$ и [[poluadditivnost|полуаддитивность]] $\|x\|+\|y\|\ge\|x+y\|$. Норма измеряет **длину одного** элемента — в отличие от [[metrika|метрики]], которая измеряет расстояние между **парой** точек.`,
		related: ['nevyrozhdennost-normy', 'odnorodnost-normy', 'poluadditivnost', 'metrika-porozhdennaya-normoy']
	},

	'normirovannoe-prostranstvo': {
		id: 'normirovannoe-prostranstvo',
		term: 'Нормированное пространство',
		short: String.raw`Четвёрка $\bigl((M,\rho),\|\cdot\|,+,\ast\bigr)$ с согласованными нормой и метрикой.`,
		formula: String.raw`\bigl((M,\rho),\ \|\cdot\|,\ +,\ \ast\bigr)`,
		body: String.raw`[[lineynoe-prostranstvo|Линейное пространство]] с нормой и [[metrika-porozhdennaya-normoy|согласованной с ней метрикой]]: $\|x\|=\rho(x,\theta)$ и $\|x-y\|=\rho(x,y)$. Согласование — отдельное условие, а не следствие остальных аксиом.`,
		related: ['lineynoe-prostranstvo', 'aksiomy-normy', 'metrika-porozhdennaya-normoy']
	},

	'evklidova-norma': {
		id: 'evklidova-norma',
		term: 'Евклидова норма',
		short: String.raw`$\|x\|_2=\sqrt{x_1^2+\dots+x_n^2}$ — корень из суммы квадратов.`,
		formula: String.raw`\|x\|_2=\sqrt{\sum_{i=1}^{n}x_i^2}`,
		body: String.raw`**Евклидова норма** в $\mathbb R^n$: $\|x\|_2=\bigl(\sum_i x_i^2\bigr)^{1/2}$, при $n=1$ — модуль $\|x\|=|x|$. Член семейства $\|x\|_k=\bigl(\sum_i|x_i|^k\bigr)^{1/k}$ вместе с $\|x\|_1=\sum_i|x_i|$ и $\|x\|_\infty=\max_i|x_i|$, которым отвечают метрики [[metriki-rho|$\rho_1,\rho_2,\rho_k,\rho_\infty$]]; условие $k\ge1$ существенно — при $k<1$ ломается [[poluadditivnost|полуаддитивность]], хотя две другие аксиомы держатся.`,
		related: ['norma', 'metriki-rho', 'poluadditivnost', 'metrika-porozhdennaya-normoy']
	},

	'nevyrozhdennost-normy': {
		id: 'nevyrozhdennost-normy',
		term: 'Невырожденность нормы',
		short: String.raw`$\|x\|\ge0$, и $\|x\|=0$ только на нуле по сложению.`,
		formula: String.raw`\|x\|\ge0,\qquad \|x\|=0\iff x=\theta`,
		body: String.raw`Первая аксиома [[norma|нормы]], её также называют неотрицательной определённостью: $\|x\|\ge0$ для всех $x$, причём равенство нулю достигается **только** на [[neytralnyy-element|нейтральном элементе]] $\theta$ операции $+$, а не на числе $0\in\mathbb R$. Функция, у которой нарушена именно эта аксиома, а две остальные держатся, называется [[polunorma|полунормой]].`,
		related: ['norma', 'neytralnyy-element', 'polunorma']
	},

	'odnorodnost-normy': {
		id: 'odnorodnost-normy',
		term: 'Однородность нормы',
		short: String.raw`$\|\alpha\ast x\|=|\alpha|\cdot\|x\|$ — растянули вектор, растянулась длина.`,
		formula: String.raw`\forall\alpha\in\mathbb R\ \forall x\in M:\ \|\alpha\ast x\|=|\alpha|\cdot\|x\|`,
		body: String.raw`Вторая аксиома [[norma|нормы]]: умножение вектора на скаляр умножает длину на модуль скаляра. Здесь $\ast$ — [[vneshnee-umnozhenie|внешнее умножение]], а $|\alpha|$ — обычный модуль числа. Однородность несовместима с ограниченностью, поэтому дискретная метрика нормой не порождается.`,
		related: ['norma', 'vneshnee-umnozhenie', 'metrika-porozhdennaya-normoy']
	},

	poluadditivnost: {
		id: 'poluadditivnost',
		term: 'Полуаддитивность',
		short: String.raw`$\|x\|+\|y\|\ge\|x+y\|$ — неравенство треугольника на языке нормы.`,
		formula: String.raw`\|x\|+\|y\|\ge\|x+y\|`,
		body: String.raw`Третья аксиома [[norma|нормы]]: длина суммы не превосходит суммы длин; приставка «полу-» означает, что вместо равенства (аддитивности) стоит неравенство. Это то же самое утверждение, что и неравенство треугольника [[metrika|метрики]], записанное в других переменных. Для [[evklidova-norma|$\|\cdot\|_k$]] выполняется при $k\ge1$ и ломается при $k<1$: на ортах $e_1,e_2$ и $k=\tfrac12$ выходит $1+1<4$.`,
		related: ['norma', 'metrika', 'metrika-porozhdennaya-normoy', 'evklidova-norma']
	},

	'metrika-porozhdennaya-normoy': {
		id: 'metrika-porozhdennaya-normoy',
		term: 'Метрика, порождённая нормой',
		short: String.raw`$\rho(x,y)=\|x-y\|$; обратно $\|x\|=\rho(x,\theta)$.`,
		formula: String.raw`\rho(x,y)=\|x-y\|,\qquad \|x\|=\rho(x,\theta)`,
		body: String.raw`Метрика, построенная по [[aksiomy-normy|норме]] формулой $\rho(x,y)=\|x-y\|$; вместе с равенством $\|x\|=\rho(x,\theta)$ это и есть согласование нормы с метрикой в [[normirovannoe-prostranstvo|нормированном пространстве]]. В обратную сторону выходит не всегда: восстановить норму можно лишь по метрике, инвариантной относительно сдвига и абсолютно однородной.`,
		related: ['aksiomy-normy', 'aksiomy-metriki', 'normirovannoe-prostranstvo']
	},

	polunorma: {
		id: 'polunorma',
		term: 'Полунорма',
		short: String.raw`Норма без невырожденности: возможно $\|x\|=0$ при $x\ne\theta$.`,
		formula: String.raw`\|\alpha\ast x\|=|\alpha|\cdot\|x\|,\qquad \|x\|+\|y\|\ge\|x+y\|`,
		body: String.raw`Функция, у которой выполнены [[odnorodnost|однородность]] и неравенство треугольника, но не невырожденность: нуль достигается и на ненулевом векторе. Пример в $\mathbb R^2$ — $p(x_1,x_2)=|x_1|$.`,
		related: ['aksiomy-normy', 'odnorodnost', 'psevdometrika']
	},

};
