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
		body: String.raw`Операция $\ast$, умножающая элемент носителя на скаляр из $\mathbb R$. Называется **внешней**, потому что один её аргумент лежит вне $M$, — в отличие от внутреннего сложения $+:M\times M\to M$.

Через неё формулируется [[odnorodnost-normy|однородность нормы]] $\|\alpha\ast x\|=|\alpha|\cdot\|x\|$, и именно она даёт [[lineynoe-prostranstvo|линейному пространству]] масштаб: вектор можно растянуть вдвое. У [[metricheskoe-prostranstvo|метрического пространства]] такой операции нет — там носитель произвольное множество, и «растянуть точку» бессмысленно.`,
		related: ['lineynoe-prostranstvo', 'odnorodnost-normy', 'neytralnyy-element']
	},

	'neytralnyy-element': {
		id: 'neytralnyy-element',
		term: 'Нейтральный элемент θ (нуль по сложению)',
		short: String.raw`$\theta\in M$ с $x+\theta=x$; это вектор, а не число $0\in\mathbb R$.`,
		formula: String.raw`\forall x\in M:\ x+\theta=x`,
		body: String.raw`**Нейтральный элемент** операции $+$ в [[lineynoe-prostranstvo|линейном пространстве]] — такой $\theta\in M$, что $x+\theta=x$ для всех $x$. Его называют нулём по сложению и часто пишут тем же символом $0$, что и число.

В аксиоме [[nevyrozhdennost-normy|невырожденности]] $\|x\|=0\iff x=\theta$ слева стоит число $0\in\mathbb R$, справа — вектор $\theta\in M$: в $\mathbb R^2$ это $(0,0)$, в пространстве функций — тождественный нуль, в матрицах — нулевая матрица. Из аксиом следуют $0\ast x=\theta$ и $\alpha\ast\theta=\theta$.`,
		related: ['lineynoe-prostranstvo', 'nevyrozhdennost-normy', 'norma']
	},

	norma: {
		id: 'norma',
		term: 'Норма',
		short: String.raw`$\|\cdot\|:M\to\mathbb R$ с тремя аксиомами; это длина одного вектора.`,
		formula: String.raw`\|x\|\ge0;\quad \|\alpha\ast x\|=|\alpha|\cdot\|x\|;\quad \|x\|+\|y\|\ge\|x+y\|`,
		body: String.raw`**Норма** — функция $\|\cdot\|:M\to\mathbb R$ на [[lineynoe-prostranstvo|линейном пространстве]] с тремя аксиомами: [[nevyrozhdennost-normy|невырожденность]] ($\|x\|\ge0$, и нуль только на нуле по сложению), [[odnorodnost-normy|однородность]] $\|\alpha\ast x\|=|\alpha|\cdot\|x\|$ и [[poluadditivnost|полуаддитивность]] $\|x\|+\|y\|\ge\|x+y\|$.

Норма измеряет **длину одного** элемента, [[metrika|метрика]] — расстояние между **парой** точек. Всякая норма порождает метрику $\rho(x,y)=\|x-y\|$; обратное верно лишь при двух дополнительных условиях.`,
		related: ['nevyrozhdennost-normy', 'odnorodnost-normy', 'poluadditivnost', 'metrika-porozhdennaya-normoy']
	},

	'normirovannoe-prostranstvo': {
		id: 'normirovannoe-prostranstvo',
		term: 'Нормированное пространство',
		short: String.raw`Четвёрка $\bigl((M,\rho),\|\cdot\|,+,\ast\bigr)$ с согласованными нормой и метрикой.`,
		formula: String.raw`\bigl((M,\rho),\ \|\cdot\|,\ +,\ \ast\bigr)`,
		body: String.raw`[[lineynoe-prostranstvo|Линейное пространство]] с нормой и согласованной с ней метрикой: $\|x\|=\rho(x,\theta)$ и $\|x-y\|=\rho(x,y)$. Согласование — отдельное условие, а не следствие остальных аксиом.`,
		related: ['lineynoe-prostranstvo', 'aksiomy-normy', 'metrika-porozhdennaya-normoy']
	},

	'evklidova-norma': {
		id: 'evklidova-norma',
		term: 'Евклидова норма',
		short: String.raw`$\|x\|_2=\sqrt{x_1^2+\dots+x_n^2}$ — корень из суммы квадратов.`,
		formula: String.raw`\|x\|_2=\sqrt{\sum_{i=1}^{n}x_i^2}`,
		body: String.raw`**Евклидова норма** в $\mathbb R^n$: $\|x\|_2=\bigl(\sum_i x_i^2\bigr)^{1/2}$. Она порождает евклидову метрику $\rho_2(x,y)=\|x-y\|_2$, а при $n=1$ превращается в модуль $\|x\|=|x|$.

Член семейства $\|x\|_k=\bigl(\sum_i|x_i|^k\bigr)^{1/k}$ при $k\ge1$ вместе с $\|x\|_1=\sum_i|x_i|$ и $\|x\|_\infty=\max_i|x_i|$; им отвечают метрики [[metriki-rho|$\rho_1,\rho_2,\rho_k,\rho_\infty$]]. Условие $k\ge1$ существенно: при $k<1$ ломается [[poluadditivnost|полуаддитивность]], хотя две другие аксиомы держатся.`,
		related: ['norma', 'metriki-rho', 'poluadditivnost', 'metrika-porozhdennaya-normoy']
	},

	'nevyrozhdennost-normy': {
		id: 'nevyrozhdennost-normy',
		term: 'Невырожденность нормы',
		short: String.raw`$\|x\|\ge0$, и $\|x\|=0$ только на нуле по сложению.`,
		formula: String.raw`\|x\|\ge0,\qquad \|x\|=0\iff x=\theta`,
		body: String.raw`Первая аксиома [[norma|нормы]], её также называют неотрицательной определённостью. Требует $\|x\|\ge0$ для всех $x$, причём равенство нулю достигается **только** на [[neytralnyy-element|нейтральном элементе]] $\theta$ операции $+$, а не на числе $0\in\mathbb R$.

Именно она даёт первую аксиому метрики: $\rho(x,y)=\|x-y\|=0\iff x-y=\theta\iff x=y$. Функция, у которой эта аксиома нарушена, а две остальные держатся, называется [[polunorma|полунормой]].`,
		related: ['norma', 'neytralnyy-element', 'polunorma']
	},

	'odnorodnost-normy': {
		id: 'odnorodnost-normy',
		term: 'Однородность нормы',
		short: String.raw`$\|\alpha\ast x\|=|\alpha|\cdot\|x\|$ — растянули вектор, растянулась длина.`,
		formula: String.raw`\forall\alpha\in\mathbb R\ \forall x\in M:\ \|\alpha\ast x\|=|\alpha|\cdot\|x\|`,
		body: String.raw`Вторая аксиома [[norma|нормы]]: умножение вектора на скаляр умножает длину на модуль скаляра. Здесь $\ast$ — [[vneshnee-umnozhenie|внешнее умножение]], а $|\alpha|$ — обычный модуль числа.

Из неё сразу следуют $\|\theta\|=0$ (подставить $\alpha=0$) и $\|-x\|=\|x\|$ (подставить $\alpha=-1$); второе даёт симметрию порождённой метрики: $\|x-y\|=|-1|\cdot\|y-x\|=\|y-x\|$. Однородность несовместима с ограниченностью, поэтому дискретная метрика нормой не порождается.`,
		related: ['norma', 'vneshnee-umnozhenie', 'metrika-porozhdennaya-normoy']
	},

	poluadditivnost: {
		id: 'poluadditivnost',
		term: 'Полуаддитивность',
		short: String.raw`$\|x\|+\|y\|\ge\|x+y\|$ — неравенство треугольника на языке нормы.`,
		formula: String.raw`\|x\|+\|y\|\ge\|x+y\|`,
		body: String.raw`Третья аксиома [[norma|нормы]]: длина суммы не превосходит суммы длин. Приставка «полу-» означает, что вместо равенства (аддитивности) стоит неравенство.

После замены $\xi=x-y$, $\mu=y-z$ (тогда $\xi+\mu=x-z$) она дословно превращается в неравенство треугольника [[metrika|метрики]] $\rho(x,y)+\rho(y,z)\ge\rho(x,z)$ — это одно утверждение в двух наборах переменных. Для [[evklidova-norma|$\|\cdot\|_k$]] выполняется при $k\ge1$ и ломается при $k<1$: на ортах $e_1,e_2$ и $k=\tfrac12$ выходит $1+1<4$.`,
		related: ['norma', 'metrika', 'metrika-porozhdennaya-normoy', 'evklidova-norma']
	},

	'metrika-porozhdennaya-normoy': {
		id: 'metrika-porozhdennaya-normoy',
		term: 'Метрика, порождённая нормой',
		short: String.raw`$\rho(x,y)=\|x-y\|$; обратно $\|x\|=\rho(x,\theta)$.`,
		formula: String.raw`\rho(x,y)=\|x-y\|,\qquad \|x\|=\rho(x,\theta)`,
		body: String.raw`Метрика, построенная по норме формулой $\rho(x,y)=\|x-y\|$. Обратное верно не всегда: восстановить норму можно лишь по метрике, инвариантной относительно сдвига и абсолютно однородной.`,
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
