import type { Glossary } from '$lib/types';

// =====================================================================
//  Термины дня 20 (семестр 2): теорема Барроу и формула Ньютона–Лейбница.
//  Карточки прошлых дней, на которые день ссылается (первообразная,
//  определённый и неопределённый интеграл, теорема Лагранжа, теорема
//  о промежуточном значении), продублированы намеренно — день должен
//  резолвиться независимо от соседей. Канонический глоссарий нотации
//  склеивается последним и перекрывает дубли.
// =====================================================================

export const day20Terms: Glossary = {
	'integral-s-peremennym-verhnim-predelom': {
		id: 'integral-s-peremennym-verhnim-predelom',
		term: 'Интеграл с переменным верхним пределом',
		short: String.raw`Функция $\Phi(x)=\int_a^x f(t)\,dt$ — накопленный интеграл до точки $x$.`,
		formula: String.raw`\Phi(x)=\int_a^x f(t)\,dt,\qquad \Phi(a)=0`,
		body: String.raw`Если у [[opredelennyy-integral|определённого интеграла]] отпустить верхний предел, число превращается в функцию $\Phi:[a,b]\to\mathbb R$. Переменная $t$ под интегралом немая: писать $\int_a^x f(x)\,dx$ нельзя. Сразу известны $\Phi(a)=0$ и $\Phi(b)=\int_a^b f$. Конспект (стр. 6) обозначает эту функцию буквой $F$ — той же, что и [[pervoobraznaya|первообразную]], хотя равенство $\Phi'=f$ ещё только предстоит доказать: это и есть [[teorema-barrou|теорема Барроу]].`,
		related: ['teorema-barrou', 'pervoobraznaya', 'opredelennyy-integral', 'additivnost-integrala']
	},

	'teorema-barrou': {
		id: 'teorema-barrou',
		term: 'Теорема Барроу',
		short: String.raw`Для непрерывной $f$ производная накопленного интеграла равна $f$.`,
		formula: String.raw`\Bigl(\int_a^x f(t)\,dt\Bigr)'_x=f(x)`,
		body: String.raw`Теорема 16 списка семантических единиц: «производная первообразной совпадает с подынтегральным выражением», то есть $\Phi'(x_0)=f(x_0)$ при непрерывной $f$. Доказывается сворачиванием приращения в $\int_{x_0}^{x_0+h}f$ и зажатием между $h(f(x_0)\pm\varepsilon)$. Следствие — существование первообразной у любой непрерывной функции. В конспекте (стр. 9) тем же именем названа другая запись, $\int_a^b f\,dx=\int_{F(a)}^{F(b)}dF$; она получается из первой заменой $u=F(x)$.`,
		related: ['integral-s-peremennym-verhnim-predelom', 'teorema-nyutona-leybnica', 'pervoobraznaya', 'teorema-o-srednem-integral']
	},

	'teorema-nyutona-leybnica': {
		id: 'teorema-nyutona-leybnica',
		term: 'Формула Ньютона–Лейбница',
		short: String.raw`$\int_a^b f=F(b)-F(a)$ для любой первообразной $F$.`,
		formula: String.raw`\int_a^b f(x)\,dx=F(b)-F(a)=F\Big|_a^b`,
		body: String.raw`Теорема 17 списка; в конспекте озаглавлена «Теорема Ньютона-Лейбница». Доказывается в два хода: по [[teorema-barrou|теореме Барроу]] функция $\Phi(x)=\int_a^x f$ — первообразная, а по [[lemma-o-nulevoy-proizvodnoy|лемме о нулевой производной]] любая другая отличается от неё на константу, сокращающуюся при вычитании. Пункт 2 в конспекте (стр. 8) тавтологичен: там $F$ с самого начала есть $\Phi$. Содержателен переход к произвольной $F$ — он и делает формулу инструментом.`,
		related: ['teorema-barrou', 'lemma-o-nulevoy-proizvodnoy', 'pervoobraznaya', 'opredelennyy-integral']
	},

	'additivnost-integrala': {
		id: 'additivnost-integrala',
		term: 'Аддитивность интеграла по отрезку',
		short: String.raw`Интеграл по объединению отрезков равен сумме интегралов.`,
		formula: String.raw`\int_a^b+\int_b^c=\int_a^c`,
		body: String.raw`Формула, выделенная в конспекте синей рамкой (стр. 7) и введённая без доказательства — как готовый инструмент внутри вывода теоремы Ньютона–Лейбница. Доказывается объединением разбиений $[a,b]$ и $[b,c]$: интегральные суммы складываются, а вставка одной лишней точки меняет сумму не более чем на $2\sup|f|\cdot\lambda_R\to0$. Вместе с соглашениями $\int_a^a=0$ и $\int_a^b=-\int_b^a$ формула верна при любом взаимном расположении точек — на этом держится сворачивание приращения в [[teorema-barrou|теореме Барроу]].`,
		related: ['opredelennyy-integral', 'teorema-barrou', 'lineynost-integrala', 'rang-razbieniya']
	},

	'lineynost-integrala': {
		id: 'lineynost-integrala',
		term: 'Линейность интеграла',
		short: String.raw`Интеграл — линейный функционал: выносит суммы и константы.`,
		formula: String.raw`\int_a^b(\alpha f+\beta g)\,dx=\alpha\int_a^b f\,dx+\beta\int_a^b g\,dx`,
		body: String.raw`Первое из свойств в конспекте «Свойства интегралов» (стр. 1), выписанное там без доказательства. Доказательство однострочное: при **одном и том же** разбиении и одном наборе точек $\vec\xi$ интегральная сумма распадается на две, а дальше работает линейность предела. Частный случай — интеграл от константы $\int_a^b C\,dx=C(b-a)$, который конспект считает отдельно (стр. 7–8) и который затем становится верхней и нижней оценкой в [[teorema-barrou|теореме Барроу]].`,
		related: ['opredelennyy-integral', 'additivnost-integrala', 'monotonnost-integrala']
	},

	'monotonnost-integrala': {
		id: 'monotonnost-integrala',
		term: 'Монотонность интеграла',
		short: String.raw`Неравенство между функциями сохраняется после интегрирования.`,
		formula: String.raw`f\le g\ \Rightarrow\ \int_a^b f\,dx\le\int_a^b g\,dx`,
		body: String.raw`Свойство, позволяющее «интегрировать неравенства»: при $f\le g$ каждое слагаемое одной интегральной суммы не превосходит соответствующего слагаемого другой, а нестрогое неравенство сохраняется при предельном переходе. Вместе с $\int_a^b C\,dx=C(b-a)$ даёт зажатие $m(b-a)\le\int_a^b f\le M(b-a)$ — заготовку и для [[teorema-o-srednem-integral|теоремы о среднем]], и для оценки приращения в [[teorema-barrou|теореме Барроу]]. Требует $a<b$: при перевёрнутых пределах знак неравенства меняется.`,
		related: ['ocenka-modulya-integrala', 'teorema-o-srednem-integral', 'teorema-barrou', 'lineynost-integrala']
	},

	'ocenka-modulya-integrala': {
		id: 'ocenka-modulya-integrala',
		term: 'Оценка модуля интеграла',
		short: String.raw`Модуль интеграла не больше интеграла модуля.`,
		formula: String.raw`\left|\int_a^b f\,dx\right|\le\int_a^b|f|\,dx\le\sup|f|\cdot(b-a)`,
		body: String.raw`Следствие [[monotonnost-integrala|монотонности]]: из $-|f|\le f\le|f|$ получаем $-\int|f|\le\int f\le\int|f|$. Это «неравенство треугольника для интеграла» — непрерывный аналог $|\sum a_i|\le\sum|a_i|$. Крайняя правая оценка через $\sup|f|$ даёт липшицевость [[integral-s-peremennym-verhnim-predelom|накопленного интеграла]] $|\Phi(x)-\Phi(y)|\le\sup|f|\cdot|x-y|$, причём без всякой непрерывности $f$ — это то, что выживает от теоремы Барроу у разрывной подынтегральной функции.`,
		related: ['monotonnost-integrala', 'integral-s-peremennym-verhnim-predelom', 'lineynost-integrala']
	},

	'teorema-o-srednem-integral': {
		id: 'teorema-o-srednem-integral',
		term: 'Теорема о среднем для интеграла',
		short: String.raw`Непрерывная $f$ принимает своё среднее по отрезку в некоторой точке $\xi$.`,
		formula: String.raw`\int_a^b f(t)\,dt=f(\xi)\,(b-a),\qquad \xi\in[a,b]`,
		body: String.raw`Интеграл непрерывной функции равен площади прямоугольника с основанием $b-a$ и высотой $f(\xi)$ в некоторой точке $\xi$. Вывод: зажатие $m(b-a)\le\int f\le M(b-a)$ по [[monotonnost-integrala|монотонности]], деление на $b-a$ и [[teorema-o-promezhutochnom-znachenii|теорема о промежуточном значении]]. Непрерывность нужна именно в последнем шаге: у ступеньки $\operatorname{sign}$ на $[-1,1]$ среднее равно нулю, а значения нуль не принимают. Даёт короткое доказательство [[teorema-barrou|Барроу]].`,
		related: ['teorema-o-promezhutochnom-znachenii', 'monotonnost-integrala', 'teorema-barrou']
	},

	'teorema-o-promezhutochnom-znachenii': {
		id: 'teorema-o-promezhutochnom-znachenii',
		term: 'Теорема о промежуточном значении',
		short: String.raw`Непрерывная функция на связном множестве принимает все промежуточные значения.`,
		formula: String.raw`f\in C[a,b],\ m\le\mu\le M\ \Rightarrow\ \exists\,\xi\in[a,b]:\ f(\xi)=\mu`,
		body: String.raw`Утверждение первого семестра, сформулированное в курсе топологически: непрерывный образ связного множества связен, а связные подмножества $\mathbb R$ — это промежутки, поэтому вместе с $m$ и $M$ функция принимает и всё, что между ними. На отрезке ([[lsk|ЛСК]]) минимум и максимум ещё и достигаются (Вейерштрасс). Именно эта теорема закрывает последний шаг в [[teorema-o-srednem-integral|теореме о среднем]] и ломается первой, если отказаться от непрерывности.`,
		related: ['teorema-o-srednem-integral', 'lsk']
	},

	'lemma-o-nulevoy-proizvodnoy': {
		id: 'lemma-o-nulevoy-proizvodnoy',
		term: 'Лемма о нулевой производной',
		short: String.raw`$D'\equiv0$ на промежутке влечёт $D\equiv\mathrm{const}$.`,
		formula: String.raw`D'(x)=0\ \text{на}\ [a,b]\ \Rightarrow\ D(x)=D(a)\ \forall x`,
		body: String.raw`Прямое следствие [[teorema-lagranzha|теоремы Лагранжа]]: $D(x)-D(a)=D'(c)(x-a)=0$ для некоторого $c$ между $a$ и $x$. Именно эта лемма превращает [[teorema-barrou|теорему Барроу]] в [[teorema-nyutona-leybnica|формулу Ньютона–Лейбница]]: разность двух [[pervoobraznaya|первообразных]] одной функции имеет нулевую производную, значит постоянна, и при вычитании $F(b)-F(a)$ постоянная сокращается. Существенна связность промежутка: на объединении двух отрезков константы могут быть разными.`,
		related: ['teorema-lagranzha', 'teorema-nyutona-leybnica', 'pervoobraznaya']
	},

	'teorema-lagranzha': {
		id: 'teorema-lagranzha',
		term: 'Теорема Лагранжа',
		short: String.raw`Приращение равно производной в средней точке, умноженной на длину.`,
		formula: String.raw`f(b)-f(a)=f'(c)\,(b-a),\qquad c\in(a,b)`,
		body: String.raw`Теорема 7 списка (день 5). В курсе формулируется для класса $C^1([a,b])$ — требование заметно сильнее стандартного «непрерывна на $[a,b]$, дифференцируема на $(a,b)$» — и даётся рисунком, без доказательства. Для дня 20 нужна ровно в форме [[lemma-o-nulevoy-proizvodnoy|леммы о нулевой производной]]. Структурно это тот же приём, что и [[teorema-o-srednem-integral|теорема о среднем для интеграла]]: усреднённая по отрезку величина реализуется точно в некоторой точке $c$.`,
		related: ['lemma-o-nulevoy-proizvodnoy', 'teorema-o-srednem-integral']
	},

	'pervoobraznaya': {
		id: 'pervoobraznaya',
		term: 'Первообразная',
		short: String.raw`$F$ — первообразная $f$, если $F'=f$ (при $f\in C^0[a,b]$).`,
		formula: String.raw`F'(x)=f(x)`,
		body: String.raw`Определение 19 списка, в конспекте — стр. 5: $F$ есть первообразная непрерывной $f$, если $F'=f$. Первообразные образуют не просто семейство $F+C$, а класс в фактор-пространстве по константам: $\rho(x^2+4;x^2)=\|(x^2+4)-x^2\|=0$, то есть $\|C\|_C=0$. Существование первообразной у непрерывной функции не постулируется, а доказывается [[teorema-barrou|теоремой Барроу]], которая предъявляет её явно как [[integral-s-peremennym-verhnim-predelom|накопленный интеграл]].`,
		related: ['teorema-barrou', 'neopredelennyy-integral', 'integral-s-peremennym-verhnim-predelom', 'lemma-o-nulevoy-proizvodnoy']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Предел интегральных сумм при стремлении ранга разбиения к нулю.`,
		formula: String.raw`\int_a^b f(x)\,dx=\lim_{\lambda_R\to0}\sum_i f(\xi_i)\,\lambda_i`,
		body: String.raw`Определение 17: предел интегральных сумм $I(f,\lambda,\vec\xi)=\sum_i f(\xi_i)\lambda_i$ при стремлении [[rang-razbieniya|ранга разбиения]] $\lambda_R$ к нулю; отрезок $[a,b]$ при этом вводится как [[lsk|ЛСК]]. Это определение построено независимо от производной — потому теорема Ньютона–Лейбница и содержательна: она стыкует два разных построения. Все свойства дня ([[lineynost-integrala|линейность]], [[additivnost-integrala|аддитивность]], монотонность) доказываются именно на уровне интегральных сумм.`,
		related: ['rang-razbieniya', 'lsk', 'lineynost-integrala', 'teorema-nyutona-leybnica']
	},

	'neopredelennyy-integral': {
		id: 'neopredelennyy-integral',
		term: 'Неопределённый интеграл',
		short: String.raw`Класс первообразных $F(x)+C$ данной функции.`,
		formula: String.raw`\int f(x)\,dx=F(x)+C`,
		body: String.raw`Определение 18 списка: $\int f(x)\,dx=F(x)+C$, где $F$ — любая [[pervoobraznaya|первообразная]] $f$. В курсе термин появляется поздно, уже после интеграла Римана и формулы Ньютона–Лейбница (стр. 9), — порядок обратный классическому. Связь с [[opredelennyy-integral|определённым интегралом]] и есть содержание дня: неопределённый интеграл поставляет $F$, а [[teorema-nyutona-leybnica|формула Ньютона–Лейбница]] превращает её в число подстановкой концов.`,
		related: ['pervoobraznaya', 'opredelennyy-integral', 'teorema-nyutona-leybnica']
	}
};
