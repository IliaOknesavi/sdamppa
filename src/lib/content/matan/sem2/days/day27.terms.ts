import type { Glossary } from '$lib/types';

// Термины дня 27 (радикальный признак Коши, преобразование Абеля, признак
// Дирихле, липшицевость). Понятия сквозной нотации живут в каноническом
// глоссарии (sem2/glossary.ts) и здесь НЕ дублируются — на них идут только
// перекрёстные ссылки [[...]]: priznak-i-svoystvo, metriki-rho,
// skhodyashchayasya-v-sebe, asimptoticheskie-klassy, klassy-differenciruemosti.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Карточки chastichnaya-summa и garmonicheskiy-ryad намеренно продублированы
// из дня 26, а priznak-dalambera и geometricheskiy-ryad — из более раннего
// материала, чтобы день резолвился независимо.
export const day27Terms: Glossary = {
	'radikalnyy-priznak-koshi': {
		id: 'radikalnyy-priznak-koshi',
		term: 'Радикальный признак Коши',
		short: String.raw`По $L=\lim\sqrt[n]{a_n}$: меньше единицы — сх., больше — расх., единица — ?`,
		formula: String.raw`L=\lim_{n\to\infty}\sqrt[n]{a_n}:\quad L<1\ \text{— сх.};\quad L>1\ \text{— расх.};\quad L=1\ \text{— ?}`,
		body: String.raw`Из члена $a_n\ge0$ извлекается «скрытый знаменатель» прогрессии, и результат сравнивается с единицей. Доказательство: при $L<1$ берём $q=\frac{L+1}{2}\in(L;1)$ и $\varepsilon=\frac{1-L}{2}$, получаем $a_n<q^{\,n}$ при $n>N_{\sqrt[n]{a}}(\varepsilon)$ и сравниваем с [[geometricheskiy-ryad|геометрическим рядом]]; при $L>1$ выходит $a_n>1$, то есть нарушено необходимое условие.

При $L=1$ ответа нет ни в какую сторону: $\sum\frac1n$ и $\sum\frac{1}{n^{2}}$ дают одно и то же значение $L$ при разных исходах. Молчание признака — не расходимость: [[priznak-i-svoystvo|признак = достаточное условие]]. В общей форме берут $L=\overline\lim\sqrt[n]{a_n}$ — отсюда формула Коши–Адамара для радиуса сходимости.`,
		related: ['geometricheskiy-ryad', 'priznak-dalambera', 'garmonicheskiy-ryad', 'priznak-i-svoystvo']
	},

	'priznak-dalambera': {
		id: 'priznak-dalambera',
		term: 'Признак Д’Аламбера',
		short: String.raw`По пределу отношения $a_{n+1}/a_n$; слабее радикального признака.`,
		formula: String.raw`\underline\lim\frac{a_{n+1}}{a_n}\le\underline\lim\sqrt[n]{a_n}\le\overline\lim\sqrt[n]{a_n}\le\overline\lim\frac{a_{n+1}}{a_n}`,
		body: String.raw`Для $a_n>0$ ряд сходится при $\lim\frac{a_{n+1}}{a_n}<1$ и расходится при значении больше единицы. Эталон тот же — [[geometricheskiy-ryad|геометрическая прогрессия]], но измеряется один шаг, а не усреднённая история. Равносильная запись — через **обратное** отношение $x_n=\frac{a_n}{a_{n+1}}$: условие сходимости принимает вид $x_n\ge c>1$, и порог переезжает из $q<1$ в $c=\frac1q>1$.

Цепочка неравенств выше показывает точное соотношение: где Д’Аламбер дал ответ, [[radikalnyy-priznak-koshi|радикальный признак]] даст тот же, но не наоборот. Пример разрыва — $a_n=2^{-n-(-1)^{n}}$: отношение скачет между $2$ и $\frac18$, а корень идёт к $\frac12$.`,
		related: ['radikalnyy-priznak-koshi', 'geometricheskiy-ryad', 'asimptoticheskie-klassy']
	},

	'geometricheskiy-ryad': {
		id: 'geometricheskiy-ryad',
		term: 'Геометрический ряд',
		short: String.raw`$\sum q^{n}$ сходится ровно при $|q|<1$; эталон обоих сегодняшних признаков.`,
		formula: String.raw`\sum_{n=0}^{\infty}q^{\,n}=\frac{1}{1-q}\ \ (|q|<1),\qquad \sum_{n>N}q^{\,n}=\frac{q^{\,N+1}}{1-q}`,
		body: String.raw`Ряд с постоянным отношением членов; частичная сумма считается точно, $S_N=\frac{1-q^{N}}{1-q}$, откуда сходимость при $|q|<1$. Это единственный эталон, с которым сравнивают и [[priznak-dalambera|Д’Аламбер]], и [[radikalnyy-priznak-koshi|радикальный признак]]: оба просто извлекают из $a_n$ подходящее $q$ разными способами.

Хвостовая формула $\sum_{n>N}q^{n}=\frac{q^{N+1}}{1-q}$ даёт бесплатную оценку остатка: у ряда, прошедшего радикальный признак с $L<1$, точность растёт геометрически, поэтому число слагаемых для заданной точности логарифмическое.`,
		related: ['radikalnyy-priznak-koshi', 'priznak-dalambera', 'chastichnaya-summa']
	},

	'garmonicheskiy-ryad': {
		id: 'garmonicheskiy-ryad',
		term: 'Гармонический ряд',
		short: String.raw`$\sum 1/n$ расходится, хотя члены стремятся к нулю.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac1n=+\infty,\qquad \sum_{k=1}^{n}\frac1k=\ln n+O(1)`,
		body: String.raw`Главный ограничитель всех признаков дня. Для него $\sqrt[n]{1/n}\to1$, то есть [[radikalnyy-priznak-koshi|радикальный признак]] даёт $L=1$ и молчит — ровно как и на сходящемся $\sum\frac{1}{n^{2}}$, у которого $L$ такое же.

Он же служит контрпримером всюду, где хочется ослабить условия: при $x=2\pi m$ ряд $\sum\frac{\cos nx}{n}$ превращается в гармонический (частичные суммы косинусов перестают быть ограниченными), и он же получается из $a_n=(-1)^{n}$, $b_n=\frac{(-1)^{n}}{n}$ — контрпример к отбрасыванию монотонности в [[priznak-dirihle|признаке Дирихле]].`,
		related: ['radikalnyy-priznak-koshi', 'priznak-dirihle', 'chastichnaya-summa']
	},

	'chastichnaya-summa': {
		id: 'chastichnaya-summa',
		term: 'Частичная сумма ряда',
		short: String.raw`$A_k=\sum_{i=1}^{k}a_i$; дискретная первообразная последовательности.`,
		formula: String.raw`A_k=\sum_{i=1}^{k}a_i,\quad A_0=0,\qquad a_k=A_k-A_{k-1},\qquad \sum_{k=p}^{q}a_k=A_q-A_{p-1}`,
		body: String.raw`Сумма первых $k$ членов; сходимость ряда — существование конечного предела $A_k$. В сегодняшней теме частичная сумма играет роль **первообразной**: соотношение $a_k=A_k-A_{k-1}$ — дискретный аналог $F'=f$, а формула $\sum_{k=p}^{q}a_k=A_q-A_{p-1}$ — дискретная формула Ньютона–Лейбница, на которой стоит весь вывод [[preobrazovanie-abelya|преобразования Абеля]].

Сдвиг индекса существен: вычитается $A_{p-1}$, а не $A_p$, иначе член $a_p$ выпадет из суммы. Проверка на $a_k\equiv1$, $p=1$, $q=3$: слева $3$, справа $A_3-A_0=3$, тогда как $A_3-A_1=2$.`,
		related: ['preobrazovanie-abelya', 'diskretnaya-proizvodnaya', 'geometricheskiy-ryad']
	},

	'diskretnaya-proizvodnaya': {
		id: 'diskretnaya-proizvodnaya',
		term: '«Дискретная производная»',
		short: String.raw`Конечная разность $b_{k+1}-b_k$: шаг сетки равен единице.`,
		formula: String.raw`(b_k)'_n:\quad \lim_{\Delta\to1}\frac{b(n+\Delta)-b(n)}{\Delta}=\frac{b(n+1)-b(n)}{1}`,
		body: String.raw`Мнемоника, которой мотивируется [[preobrazovanie-abelya|преобразование Абеля]]: раз шаг сетки равен единице, приращение и есть производная. Предельного перехода в записи нет: $b$ задана лишь в целых точках, у единицы нет выколотой окрестности внутри области определения, а правая часть получена подстановкой $\Delta=1$. Работают с конечной разностью $\Delta b_k=b_{k+1}-b_k$, и дальше всё чисто алгебраично.

Ценность мнемоники — в словаре: $\int\leftrightarrow\sum$, $dx\leftrightarrow1$, первообразная $\leftrightarrow$ [[chastichnaya-summa|частичная сумма]], интегрирование по частям $\leftrightarrow$ суммирование по частям. Эта аналогия и объясняет, откуда в формуле Абеля берётся внеинтегральный член.`,
		related: ['preobrazovanie-abelya', 'chastichnaya-summa', 'neravenstvo-abelya']
	},

	'preobrazovanie-abelya': {
		id: 'preobrazovanie-abelya',
		term: 'Преобразование Абеля',
		short: String.raw`Суммирование по частям: производная снимается с $b$ и вешается на $a$.`,
		formula: String.raw`\sum_{k=p}^{q}a_kb_k=A_qb_q-A_{p-1}b_p-\sum_{k=p}^{q-1}A_k\bigl(b_{k+1}-b_k\bigr)`,
		body: String.raw`Вывод: подставить $a_k=A_k-A_{k-1}$, сдвинуть индекс во второй сумме и собрать краевые слагаемые. Дискретный двойник формулы $\int_p^q u\,dv=uv\big|_p^q-\int_p^q v\,du$ (день 21): внеинтегральный член превращается в $A_qb_q-A_{p-1}b_p$, а $\int v\,du$ — в сумму с разностями. Эквивалентная запись: $A_qb_{q+1}-A_{p-1}b_p-\sum_{k=p}^{q}A_k(b_{k+1}-b_k)$.

Знак минус перед суммой существен, и проверяется он за одну строку: $a_k\equiv1$, $b_k=k$, $p=1$, $q=3$ дают слева $6$, справа с минусом $9-3=6$, с плюсом $12$. Догадка $A_qB_q-A_pB_p$ с $B_k=\sum_{i\le k}b_i$ на том же примере даёт $17$ и потому неверна.`,
		related: ['neravenstvo-abelya', 'priznak-dirihle', 'chastichnaya-summa', 'diskretnaya-proizvodnaya']
	},

	'neravenstvo-abelya': {
		id: 'neravenstvo-abelya',
		term: 'Неравенство Абеля',
		short: String.raw`Отрезок суммы оценивается через $\sup|A_k|$ и первое значение $b_p$.`,
		formula: String.raw`|A_k|\le M,\ b_n\ge0\ \text{не возрастает}:\quad \Bigl|\sum_{k=p}^{q}a_kb_k\Bigr|\le 2Mb_p`,
		body: String.raw`Рабочая лемма, ради которой и делается [[preobrazovanie-abelya|преобразование Абеля]]. Доказательство: неравенство треугольника плюс телескоп $\sum_{k=p}^{q-1}(b_k-b_{k+1})=b_p-b_q$, откуда $Mb_q+Mb_p+M(b_p-b_q)=2Mb_p$.

Главное в оценке — то, чего в ней нет: правая часть не зависит ни от длины отрезка, ни от $q$. Поэтому из неё немедленно следует условие Коши, а с ним [[priznak-dirihle|признак Дирихле]]. На практике это ещё и оценка остатка знакопеременного ряда: сколько членов надо просуммировать для заданной точности — там, где абсолютная оценка $\sum|a_kb_k|$ расходится и не даёт ничего.`,
		related: ['preobrazovanie-abelya', 'priznak-dirihle', 'priznak-leybnica', 'kriteriy-koshi-ryad']
	},

	'priznak-dirihle': {
		id: 'priznak-dirihle',
		term: 'Признак Дирихле',
		short: String.raw`Ограниченные суммы $A_n$ и монотонное $b_n\to0$ дают сходимость $\sum a_nb_n$.`,
		formula: String.raw`|A_n|\le M,\quad b_n\searrow 0\qquad\Longrightarrow\qquad \sum_{n=1}^{\infty}a_nb_n\ \text{— сх.}`,
		body: String.raw`Доказательство целиком стоит на [[neravenstvo-abelya|неравенстве Абеля]]: для $q\ge p>N_b\bigl(\frac{\varepsilon}{2M+1}\bigr)$ отрезок суммы меньше $2Mb_p<\varepsilon$, то есть выполнен [[kriteriy-koshi-ryad|критерий Коши]]. Ни один из сомножителей сам по себе сходимости не даёт: $\sum a_n$ может расходиться, $\sum b_n$ обычно тоже.

Следствия и применения: [[priznak-leybnica|признак Лейбница]] при $a_n=(-1)^{n-1}$ и сходимость $\sum\frac{\sin nx}{n}$ при всех $x$ (суммы синусов ограничены величиной $1/|\sin(x/2)|$). Монотонность $b_n$ выбросить нельзя: $a_n=(-1)^{n}$, $b_n=\frac{(-1)^{n}}{n}$ дают [[garmonicheskiy-ryad|гармонический ряд]].`,
		related: ['neravenstvo-abelya', 'preobrazovanie-abelya', 'priznak-leybnica', 'kriteriy-koshi-ryad']
	},

	'priznak-leybnica': {
		id: 'priznak-leybnica',
		term: 'Признак Лейбница',
		short: String.raw`Знакочередующийся ряд с $b_n\searrow0$ сходится; остаток не больше $b_{n+1}$.`,
		formula: String.raw`b_n\searrow 0\ \Rightarrow\ \sum_{n=1}^{\infty}(-1)^{n-1}b_n\ \text{— сх.},\qquad |R_n|\le b_{n+1}`,
		body: String.raw`Частный случай [[priznak-dirihle|признака Дирихле]] при $a_n=(-1)^{n-1}$: частичные суммы пробегают $1,0,1,0,\dots$, значит $M=1$, и [[neravenstvo-abelya|неравенство Абеля]] сразу даёт оценку остатка $|R_n|\le2b_{n+1}$; более тонкая оценка $|R_n|\le b_{n+1}$ получается группировкой членов в скобки.

Типовой пример — $\sum\frac{(-1)^{n-1}}{\sqrt n}$: сходится, но [[znakochereduyushchiysya-ryad|условно]], потому что $\sum n^{-1/2}$ расходится. Практическая ценность именно в оценке остатка: она даёт критерий останова, не требуя знать сумму.`,
		related: ['priznak-dirihle', 'znakochereduyushchiysya-ryad', 'neravenstvo-abelya']
	},

	'znakochereduyushchiysya-ryad': {
		id: 'znakochereduyushchiysya-ryad',
		term: 'Знакочередующийся ряд',
		short: String.raw`Знаки строго чередуются: $\sum(-1)^{n-1}b_n$ с $b_n\ge0$.`,
		formula: String.raw`\sum_{n=1}^{\infty}(-1)^{n-1}b_n,\qquad b_n\ge0`,
		body: String.raw`Ряд, у которого множитель $(-1)^{n-1}$ вынесен явно. У самого этого множителя частичные суммы пробегают $1,0,1,0,\dots$ и ограничены единицей независимо от $b_n$, поэтому знакочередующийся ряд — простейшая среда для [[priznak-dirihle|признака Дирихле]] и повод для отдельного названия ([[priznak-leybnica|признак Лейбница]]).

Знакочередующийся ряд — стандартный источник **условной** сходимости: $\sum\frac{(-1)^{n-1}}{n}=\ln2$ сходится, а модули дают [[garmonicheskiy-ryad|гармонический ряд]]. Отсюда практическое предупреждение: сумма условно сходящегося ряда зависит от порядка слагаемых (теорема Римана), так что перестановка или распараллеливание суммирования меняют ответ.`,
		related: ['priznak-leybnica', 'priznak-dirihle', 'garmonicheskiy-ryad']
	},

	'kriteriy-koshi-ryad': {
		id: 'kriteriy-koshi-ryad',
		term: 'Критерий Коши для ряда',
		short: String.raw`Ряд сходится тогда и только тогда, когда его хвостовые отрезки малы.`,
		formula: String.raw`\sum a_n\ \text{сх.}\iff\forall\varepsilon>0\ \exists N\ \forall q\ge p>N:\ \Bigl|\sum_{k=p}^{q}a_k\Bigr|<\varepsilon`,
		body: String.raw`Перенос понятия [[skhodyashchayasya-v-sebe|сходящейся в себе]] последовательности на частичные суммы: разность $A_q-A_{p-1}$ — это и есть отрезок ряда, а полнота $\mathbb R$ превращает фундаментальность в сходимость.

Главное достоинство — независимость от знака членов: там, где сравнение с эталоном неприменимо, работает критерий. На нём стоит доказательство [[priznak-dirihle|признака Дирихле]], где отрезок оценивается [[neravenstvo-abelya|неравенством Абеля]] и порог получается явной формулой $N(\varepsilon)=N_b\bigl(\frac{\varepsilon}{2M+1}\bigr)$.`,
		related: ['priznak-dirihle', 'neravenstvo-abelya', 'chastichnaya-summa', 'skhodyashchayasya-v-sebe']
	},

	'lipshicevost': {
		id: 'lipshicevost',
		term: 'Липшицевость',
		short: String.raw`Приращение значений линейно ограничено приращением аргумента.`,
		formula: String.raw`\exists\,C>0:\ \forall x_1,x_2\in D\quad |f(x_1)-f(x_2)|\le C|x_1-x_2|`,
		body: String.raw`Усиление непрерывности, формулируемое сразу в двух версиях — числовой и метрической: $\rho_Y\bigl(f(x_1),f(x_2)\bigr)\le C\,\rho_X(x_1,x_2)$, где метрики в области и в образе вообще говоря [[metriki-rho|разные]]. Обе части неравенства — расстояния между парами точек, только в разных пространствах.

Липшицевость влечёт равномерную непрерывность с явным $\delta(\varepsilon)=\varepsilon/C$; обратное неверно ($\sqrt x$ на $[0;1]$). Для дифференцируемой функции она равносильна ограниченности производной, и [[konstanta-lipshica|наименьшая константа]] равна $\sup|f'|$. В теме рядов по соседству стоит другое условие — ограниченность полной вариации $\sum_k|b_{k+1}-b_k|$; на нём и стоит [[neravenstvo-abelya|неравенство Абеля]]. Липшицевость его не обеспечивает: у последовательности она ограничивает каждое приращение по отдельности, $|b_{k+1}-b_k|\le C$, а не их сумму, которая тогда растёт как $C(q-p)$.`,
		related: ['konstanta-lipshica', 'metriki-rho', 'end-r', 'neravenstvo-abelya']
	},

	'konstanta-lipshica': {
		id: 'konstanta-lipshica',
		term: 'Константа Липшица',
		short: String.raw`Наименьшее $C$ в определении; для гладкой функции равно $\sup|f'|$.`,
		formula: String.raw`C=\sup_{x_1\ne x_2}\frac{|f(x_1)-f(x_2)|}{|x_1-x_2|}=\sup_{x\in D}|f'(x)|\quad(f\in\mathcal D^1)`,
		body: String.raw`Точная мера того, насколько сильно функция растягивает расстояния. Для дифференцируемой на промежутке $f$ теорема Лагранжа даёт $|f(x_1)-f(x_2)|=|f'(\xi)||x_1-x_2|$, откуда обе оценки — сверху через $\sup|f'|$ и снизу предельным переходом $x_2\to x_1$ — совпадают.

Значение константы решает всё в приложениях: при $C<1$ отображение сжимающее, и работает принцип неподвижной точки (итерации сходятся геометрически со знаменателем $C$); при $C>1$ ошибки на каждом шаге растут. В этом смысле [[lipshicevost|липшицевость]] с малой константой — то же самое условие, что $L<1$ в [[radikalnyy-priznak-koshi|радикальном признаке]]: и там, и там геометрическое сжатие.`,
		related: ['lipshicevost', 'radikalnyy-priznak-koshi', 'metriki-rho']
	}
};
