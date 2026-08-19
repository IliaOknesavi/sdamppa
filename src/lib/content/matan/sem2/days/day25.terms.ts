import type { Glossary } from '$lib/types';

// Термины дня 25 (несобственные интегралы I и II рода, сведение II ⟹ I,
// абсолютная и условная сходимость, главное значение). Сквозные понятия
// живут в каноническом глоссарии (sem2/glossary.ts плюс унаследованный
// sem1/glossary.ts) и здесь НЕ дублируются, а подключаются перекрёстными
// ссылками [[...]]:
//   lsk, rang-razbieniya, asimptoticheskie-klassy, priznak-i-svoystvo,
//   skhodyashchayasya-v-sebe.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
export const day25Terms: Glossary = {
	'nesobstvennyy-integral-i-roda': {
		id: 'nesobstvennyy-integral-i-roda',
		term: 'Несобственный интеграл I рода',
		short: String.raw`Интеграл по неограниченной области $D$; $\int_a^{+\infty}$ — частный случай.`,
		formula: String.raw`\int_D f(x)\,dx,\qquad f:M\to\mathbb R,\qquad D\ \text{— неогр.}`,
		body: String.raw`Первый род задан **свойством области**: $D$ — произвольное [[neogranichennaya-oblast|неограниченное множество]] ($\mathbb R$, $\mathbb R_+$, $\mathbb R_-$), а не отрезок с бесконечным концом. Привычный $\int_a^{+\infty}f$ — частный случай $D=[a;+\infty)$.

Считается такой интеграл предельным переходом с [[granica-1-na-epsilon|границей $1/\varepsilon$]]. Конструкция сумм Дарбу здесь не работает: область не компакт, [[rang-razbieniya|ранг]] любого конечного разбиения бесконечен, — поэтому [[shodimost-integrala|сходимость]] определяется через предел интегралов по компактным кускам.`,
		related: ['nesobstvennyy-integral-ii-roda', 'neogranichennaya-oblast', 'shodimost-integrala', 'granica-1-na-epsilon']
	},

	'nesobstvennyy-integral-ii-roda': {
		id: 'nesobstvennyy-integral-ii-roda',
		term: 'Несобственный интеграл II рода',
		short: String.raw`Неограниченная функция на конечном промежутке; особенность на конце.`,
		formula: String.raw`\int_0^1\frac{dx}{\sqrt x}=\lim_{\varepsilon\to+0}\int_\varepsilon^1\frac{dx}{\sqrt x}=2`,
		body: String.raw`Второй род — зеркало первого: промежуток конечен, зато функция не ограничена около [[osobaya-tochka|особой точки]]. Предельный переход тот же самый: от особой точки отступают на $\varepsilon$ и берут предел при $\varepsilon\to+0$.

Эталонные примеры: $\int_0^1x^{-1/2}dx=2$ (сходится) и $\int_0^c\frac{dx}{x}$ — [[rashodimost-integrala|расходится]]. Отдельная теория для этого рода не строится: [[svedenie-ii-k-i|замена $x=1/t$]] переводит его в первый род.`,
		related: ['nesobstvennyy-integral-i-roda', 'osobaya-tochka', 'svedenie-ii-k-i', 'etalonnyy-integral']
	},

	'shodimost-integrala': {
		id: 'shodimost-integrala',
		term: 'Сходимость интеграла',
		short: String.raw`Существование конечного предела усечённых интегралов при $\varepsilon\to+0$.`,
		formula: String.raw`\int_a^{+\infty}f\ \text{— сх.}\iff\exists\lim_{\varepsilon\to+0}\int_a^{1/\varepsilon}f(x)\,dx`,
		body: String.raw`Несобственный интеграл **сходится**, если существует конечный предел интегралов по срезанной области. Никакого нового интегрирования при этом не происходит — берётся предел уже определённых интегралов Римана.

Если особенностей несколько, промежуток режут так, чтобы в каждом куске была одна, и требуют сходимости **каждого** куска по своему параметру. Независимость этих пределов и отличает сходимость от [[glavnoe-znachenie|главного значения]]. Усиление — [[absolyutnaya-shodimost|абсолютная сходимость]].`,
		related: ['rashodimost-integrala', 'granica-1-na-epsilon', 'absolyutnaya-shodimost', 'glavnoe-znachenie']
	},

	'rashodimost-integrala': {
		id: 'rashodimost-integrala',
		term: 'Расходимость интеграла',
		short: String.raw`Предела усечённых интегралов нет или он бесконечен.`,
		formula: String.raw`\int_0^c\frac{dx}{x}=\lim_{\varepsilon\to+0}\bigl(\ln c-\ln\varepsilon\bigr)=+\infty`,
		body: String.raw`Отрицание [[shodimost-integrala|сходимости]]: предел усечённых интегралов либо бесконечен, либо не существует вовсе; у ответа это отмечают значком $\nexists$.

Два типовых механизма. Первый — предел бесконечен ($\int_0^c\frac{dx}{x}$, $\int_1^{+\infty}\frac{dx}{x}$). Второй — ответ зависит от способа срезания: у $\int_{-1}^{1}\frac{dx}{x}$ срез $(-\varepsilon;\lambda\varepsilon)$ даёт $-\ln\lambda$, и предела нет, хотя [[glavnoe-znachenie|главное значение]] существует.`,
		related: ['shodimost-integrala', 'glavnoe-znachenie', 'etalonnyy-integral', 'osobaya-tochka']
	},

	'osobaya-tochka': {
		id: 'osobaya-tochka',
		term: 'Особая точка',
		short: String.raw`Конец промежутка, около которого интеграл Римана не определён.`,
		formula: String.raw`\lim_{x\to a+0}|f(x)|=+\infty\quad\text{(II род)},\qquad D\ \text{— неогр.}\quad\text{(I род)}`,
		body: String.raw`Место, около которого интеграл нельзя «доиграть» до конца: во [[nesobstvennyy-integral-ii-roda|II роде]] это точка, где функция уходит в бесконечность, в [[nesobstvennyy-integral-i-roda|I роде]] роль особой точки играет сама бесконечность.

[[svedenie-ii-k-i|Инверсия $x=1/t$]] показывает, что это один и тот же объект: она меняет местами окрестность нуля и окрестность бесконечности. Если особая точка лежит **внутри** промежутка, его обязательно режут по ней на два куска с независимыми пределами.`,
		related: ['nesobstvennyy-integral-ii-roda', 'svedenie-ii-k-i', 'glavnoe-znachenie', 'granica-1-na-epsilon']
	},

	'granica-1-na-epsilon': {
		id: 'granica-1-na-epsilon',
		term: 'Граница 1/ε',
		short: String.raw`Оба рода обслуживает один параметр $\varepsilon\to+0$.`,
		formula: String.raw`\int_{\mathbb R_-}f=\lim_{\varepsilon\to+0}\int_{-\frac1\varepsilon}^{0}f,\qquad \int_a^{+\infty}f=\lim_{\varepsilon\to+0}\int_a^{\frac1\varepsilon}f`,
		body: String.raw`Предельный переход организован не через $A\to+\infty$, а через $\varepsilon\to+0$ с границей, поставленной в точке $1/\varepsilon$. В [[nesobstvennyy-integral-i-roda|I роде]] эта граница уезжает вправо, во [[nesobstvennyy-integral-ii-roda|II роде]] тот же $\varepsilon$ отступает от [[osobaya-tochka|особой точки]] — один параметр «съедает» особенность в обоих случаях.

Замена $A=1/\varepsilon$ — убывающая биекция $(0;+\infty)\to(0;+\infty)$, поэтому запись через $\varepsilon\to+0$ и запись через $A\to+\infty$ равносильны. Смешивать их нельзя: в $\lim_{\varepsilon\to\infty}\int_a^{\varepsilon}$ роль границы играет уже сама $\varepsilon$, а $\lim_{\varepsilon\to\infty}\int_a^{1/\varepsilon}$ бессмысленно — верхний предел при этом уезжает к нулю.`,
		related: ['shodimost-integrala', 'nesobstvennyy-integral-i-roda', 'nesobstvennyy-integral-ii-roda', 'svedenie-ii-k-i']
	},

	'svedenie-ii-k-i': {
		id: 'svedenie-ii-k-i',
		term: 'Сведение II рода к I (II ⟹ I)',
		short: String.raw`Сдвиг особенности в нуль плюс инверсия $x=1/t$: второй род становится первым.`,
		formula: String.raw`\int_a^b f(x)\,dx=\int_{\frac{1}{b-a}}^{+\infty}f\Bigl(a+\frac1t\Bigr)\frac{dt}{t^{2}}`,
		body: String.raw`Сдвиг $u=x-a$ переносит [[osobaya-tochka|особую точку]] в нуль, инверсия $u=1/t$ выворачивает окрестность нуля в окрестность бесконечности; множитель $t^{-2}$ — якобиан замены. Сдвиг под интегралом обратен сдвигу в пределах, поэтому в итоговом члене стоит $f(a+1/t)$; вид $f(1/t)$ отвечает лишь частному случаю $a=0$.

Усечённые интегралы совпадают при каждом $\varepsilon$, поэтому [[shodimost-integrala|сходимости]] равносильны. Отсюда экономия всей темы: признаки сравнения и интегральный критерий Коши доказываются **только** для [[nesobstvennyy-integral-i-roda|I рода]].`,
		related: ['nesobstvennyy-integral-ii-roda', 'nesobstvennyy-integral-i-roda', 'etalonnyy-integral', 'osobaya-tochka']
	},

	'etalonnyy-integral': {
		id: 'etalonnyy-integral',
		term: 'Эталонный интеграл ∫x^μ dx',
		short: String.raw`Степенная особенность: у нуля нужно $\mu>-1$, на бесконечности $\mu<-1$.`,
		formula: String.raw`\int_0^a x^{\mu}dx\ \text{— сх.}\iff\mu>-1,\qquad \int_b^{+\infty}x^{\mu}dx\ \text{— сх.}\iff\mu<-1`,
		body: String.raw`Оба эталона получаются из одной выкладки: [[svedenie-ii-k-i|инверсия]] переводит $\int_0^a x^{\mu}dx$ в $\int_{1/a}^{+\infty}t^{-\mu-2}dt$, а для первого рода прямое интегрирование даёт критерий «показатель меньше $-1$».

Отображение показателей $\mu\mapsto-\mu-2$ — инволюция с единственной неподвижной точкой $\mu=-1$. Поэтому $1/x$ [[rashodimost-integrala|расходится]] и в нуле, и на бесконечности, а ни одна степень не сходится сразу на всей полуоси. Это рабочая мажоранта для признаков сравнения.`,
		related: ['svedenie-ii-k-i', 'shodimost-integrala', 'rashodimost-integrala', 'nesobstvennyy-integral-i-roda']
	},

	'absolyutnaya-shodimost': {
		id: 'absolyutnaya-shodimost',
		term: 'Абсолютная сходимость',
		short: String.raw`Сходится интеграл (ряд) от модуля; определение сразу для обоих объектов.`,
		formula: String.raw`\int|f(x)|\,dx\ \text{— сх.}\qquad\qquad\sum|f_n|\ \text{— сх.}`,
		body: String.raw`Определение дословно одно и то же для интеграла и для ряда: оба объекта различают одинаково — по сходимости $\int|f|$ и $\sum|f_n|$.

Абсолютная сходимость сильнее обычной: из $0\le f+|f|\le2|f|$ признаком сравнения выводится [[shodimost-integrala|сходимость]] самого $\int f$. Точная формулировка результата — «абсолютная сходимость влечёт сходимость»: с [[uslovnaya-shodimost|условной]] она не связана импликацией, а несовместима, поскольку условная требует расходимости $\int|f|$.`,
		related: ['uslovnaya-shodimost', 'shodimost-integrala', 'nesobstvennyy-integral-i-roda', 'etalonnyy-integral']
	},

	'uslovnaya-shodimost': {
		id: 'uslovnaya-shodimost',
		term: 'Условная сходимость',
		short: String.raw`Объект сходится, а модуль расходится; обе половины условия обязательны.`,
		formula: String.raw`\int f\ \text{— сх.},\quad \int|f|\ \text{— расх.};\qquad \sum f_n\ \text{— сх.},\quad \sum|f_n|\ \text{— расх.}`,
		body: String.raw`Условно сходящимся называют интеграл (ряд), который сходится сам, но не [[absolyutnaya-shodimost|абсолютно]]. Без второй половины условия — «модуль расходится» — определение вырождается в обычную [[shodimost-integrala|сходимость]]. Типичная картинка: затухающая знакопеременная функция, у которой площади разных знаков гасят друг друга, а сумма их модулей бесконечна.

Рабочий пример — $\int_1^{+\infty}\frac{\sin x}{x}dx$ и его дискретный двойник $\sum\frac{(-1)^n}{n}$: оба разбираются признаком Дирихле.`,
		related: ['absolyutnaya-shodimost', 'shodimost-integrala', 'rashodimost-integrala']
	},

	'glavnoe-znachenie': {
		id: 'glavnoe-znachenie',
		term: 'Главное значение (V.p.)',
		short: String.raw`Симметричное срезание обеих особенностей одним параметром $\varepsilon$.`,
		formula: String.raw`\mathrm{V.p.}\int_{\mathbb R}f(x)\,dx=\lim_{\varepsilon\to+0}\int_{-\frac1\varepsilon}^{\frac1\varepsilon}f(x)\,dx`,
		body: String.raw`Valeur principale: оба края срезаются **одним** параметром, тогда как настоящая [[shodimost-integrala|сходимость]] требует двух независимых пределов. Поэтому V.p. слабее: из сходимости следует существование главного значения и совпадение с ним, обратное неверно.

Для внутренней [[osobaya-tochka|особой точки]] $c$ берут $\int_a^{c-\varepsilon}+\int_{c+\varepsilon}^{b}$. Образец: $\int_{-1}^{1}\frac{dx}{x}$ [[rashodimost-integrala|расходится]] (несимметричный срез даёт $-\ln\lambda$), а $\mathrm{V.p.}=0$. Значок обязателен: запись без него утверждает сходимость и означает другую величину.`,
		related: ['shodimost-integrala', 'rashodimost-integrala', 'osobaya-tochka', 'granica-1-na-epsilon']
	},

	'neogranichennaya-oblast': {
		id: 'neogranichennaya-oblast',
		term: 'Неограниченная область D',
		short: String.raw`Область интегрирования, которую не накрыть ни одним шаром.`,
		formula: String.raw`\forall r>0\ \ \forall x\ \ D\not\subset B_x(r)`,
		body: String.raw`«$D$ — неогр.» в определении [[nesobstvennyy-integral-i-roda|I рода]] означает ровно отсутствие накрывающего шара: ни $\mathbb R$, ни $\mathbb R_+$, ни $\mathbb R_-$ в шар конечного радиуса не помещаются.

Именно это ломает построение интеграла Римана: отрезок вводился как [[lsk|линейно связный компакт]], а здесь компактности нет и [[rang-razbieniya|ранг]] конечного разбиения бесконечен. Поэтому [[granica-1-na-epsilon|срез на границе $1/\varepsilon$]] возвращает задачу на компакт, где интеграл уже определён.`,
		related: ['nesobstvennyy-integral-i-roda', 'granica-1-na-epsilon', 'shodimost-integrala', 'osobaya-tochka']
	}
};
