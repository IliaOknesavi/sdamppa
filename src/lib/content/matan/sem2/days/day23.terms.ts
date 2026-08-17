import type { Glossary } from '$lib/types';

// Термины дня 23 (кратный интеграл, теорема Фубини, продолжение нулём).
// Понятия из канонического глоссария нотации курса (glossary.ts) здесь НЕ
// дублируются и подключаются перекрёстными ссылками [[...]]:
//   rang-razbieniya, lsk, nepravilnaya-mera-nol, metriki-rho.
//   Канонический глоссарий склеивается последним и перекрывает совпадения,
//   поэтому одноимённые карточки заводить нельзя.
// Карточки opredelennyy-integral и yakobian намеренно продублированы из
// соседних дней (17–19 и 24), чтобы день резолвился независимо.
export const day23Terms: Glossary = {
	'dvoynoy-integral': {
		id: 'dvoynoy-integral',
		term: 'Двойной интеграл',
		short: String.raw`Предел сумм по ячейкам плоской области при ранге $d_R\to0$.`,
		formula: String.raw`\iint_D f(x,y)\,dx\,dy=\lim_{d_R\to0}\sum_{d_i} f(\xi_i,\zeta_i)\,\|d_i\|`,
		body: String.raw`Интеграл по области $D\subset\mathbb R^2$, определённый той же схемой, что и [[opredelennyy-integral|определённый интеграл]] на отрезке: область режется на [[yacheyka-razbieniya|ячейки]], в каждой отмечается точка $(\xi_i,\zeta_i)$, слагаемое — значение функции на меру ячейки. Рабочее предположение курса — $f\in C(D)$.

Считать двойной интеграл по определению нельзя: предел двумерный. Практический вход в него даёт [[teorema-fubini|теорема Фубини]], сводящая его к [[povtornyy-integral|повторному]].`,
		related: ['yacheyka-razbieniya', 'teorema-fubini', 'povtornyy-integral', 'kratnyy-integral']
	},

	'kratnyy-integral': {
		id: 'kratnyy-integral',
		term: 'Кратный интеграл',
		short: String.raw`То же определение в $\mathbb R^n$: мера ячейки — объём параллелепипеда.`,
		formula: String.raw`\int\limits_D f(\vec x)\,d\vec x=\lim_{d_R\to0}\sum_{d_i} f(\vec\xi_i)\,\|d_i\|,\qquad D\subset\mathbb R^n`,
		body: String.raw`Обобщение [[dvoynoy-integral|двойного интеграла]] на $\mathbb R^n$: слово в слово то же определение, только $\|d_i\|$ — объём $n$-мерной ячейки. Курс формулирует и Фубини, и замену переменных сразу для $\mathbb R^n$, а плоский случай разбирает как иллюстрацию.

⚠️ Оговорка конспекта (стр. 11): в абстрактном пространстве $H$ размерности $n$ интеграл «существует, но плохие методы», в $\mathbb R^n$ — «норм», при $\dim H=\infty$ — «совсем всё плохо». Причина в мере ячейки: без канонических координат она зависит от базиса.`,
		related: ['dvoynoy-integral', 'yacheyka-razbieniya', 'yakobian', 'teorema-fubini']
	},

	'yacheyka-razbieniya': {
		id: 'yacheyka-razbieniya',
		term: 'Ячейка разбиения d_i и её мера',
		short: String.raw`Кусок области; $\|d_i\|$ — её площадь (объём), $d_R=\max\|d_i\|$ — ранг.`,
		formula: String.raw`D=\bigcup_i d_i,\qquad \|d_i\|-\text{мера},\qquad d_R=\max_{i\in I}\|d_i\|`,
		body: String.raw`Двумерный аналог отрезка разбиения: ячейки не налегают внутренностями и в объединении дают $D$. Роль длины $\lambda_i$ играет мера $\|d_i\|$, роль [[rang-razbieniya|ранга $\lambda_R$]] — величина $d_R=\max_i\|d_i\|$.

⚠️ В $\mathbb R^1$ мера отрезка и его диаметр совпадают, в $\mathbb R^2$ — нет. Полосы площади $1/n$ имеют диаметр больше $1$, и суммы для $f(x,y)=x$ по ним не сходятся ни к чему. Читать определение надо как $d_R=\max_i\operatorname{diam}d_i$ — иначе рушится оценка «на ячейке функция почти постоянна» из доказательства [[teorema-fubini|Фубини]].`,
		related: ['rang-razbieniya', 'dvoynoy-integral', 'teorema-fubini', 'ravnomernaya-nepreryvnost']
	},

	'povtornyy-integral': {
		id: 'povtornyy-integral',
		term: 'Повторный интеграл',
		short: String.raw`Два вложенных одномерных интеграла; двумерного предела в нём нет.`,
		formula: String.raw`\int_a^b\Bigl(\int_c^d f(x,y)\,dy\Bigr)dx,\qquad \varphi(x)=\int_c^d f(x,y)\,dy`,
		body: String.raw`Сначала при замороженном $x$ берётся $\varphi(x)=\int_c^d f(x,y)\,dy$, затем $\int_a^b\varphi(x)\,dx$. Это дважды [[opredelennyy-integral|определённый интеграл]] — считается всей техникой дней 17–19, без всякой двумерности.

Для криволинейной области пределы внутреннего интеграла зависят от внешней переменной: интегрируют по [[sechenie-oblasti|сечению]]. Равенство повторного интеграла [[dvoynoy-integral|двойному]] — это и есть [[teorema-fubini|теорема Фубини]]; само по себе оно не бесплатно, см. [[perestanovka-predelov|перестановку пределов]].`,
		related: ['teorema-fubini', 'dvoynoy-integral', 'sechenie-oblasti', 'opredelennyy-integral']
	},

	'teorema-fubini': {
		id: 'teorema-fubini',
		term: 'Теорема Фубини',
		short: String.raw`Кратный интеграл равен повторным; в курсе — частный случай для $\mathbb R^n$.`,
		formula: String.raw`\iint_P f\,dx\,dy=\int_a^b\Bigl(\int_c^d f\,dy\Bigr)dx=\int_c^d\Bigl(\int_a^b f\,dx\Bigr)dy,\quad f\in C(P)`,
		body: String.raw`Теорема 20 списка семантических единиц. Для $f\in C(P)$ на прямоугольнике [[dvoynoy-integral|двойной интеграл]] существует и равен обоим [[povtornyy-integral|повторным]]; на произвольную область переносится приёмом [[prodolzhenie-nulem|продолжения нулём]].

Честное доказательство опирается на [[ravnomernaya-nepreryvnost|равномерную непрерывность]] на компакте и даёт явное $\delta(\varepsilon)$. ⚠️ В конспекте (стр. 12) вместо этого переставляются повторные пределы $\lim_{\delta x\to0}\lim_{\delta y\to0}$ без обоснования, и из трёх шагов доведён только первый.`,
		related: ['povtornyy-integral', 'dvoynoy-integral', 'ravnomernaya-nepreryvnost', 'perestanovka-predelov']
	},

	'sechenie-oblasti': {
		id: 'sechenie-oblasti',
		term: 'Сечение и проекция области',
		short: String.raw`$D_x(y)$ — где бежит внутренняя переменная; проекция — где внешняя.`,
		formula: String.raw`D_x(y)=\{x:(x,y)\in D\},\qquad \iint_D f=\int_{D_y}\Bigl(\int_{D_x} f\,dx\Bigr)dy`,
		body: String.raw`Чтобы расставить пределы [[povtornyy-integral|повторного интеграла]] по криволинейной $D$, фиксируют одну переменную и смотрят на сечение по другой: для $D=\{0\le x\le1,\ x^2\le y\le x\}$ сечение по $y$ равно $[x^2;x]$, а по $x$ — $[y;\sqrt y]$.

⚠️ В конспекте буквы $D_x,D_y$ работают в двух смыслах: в одной половине формулы $D_x$ — сечение, а $D_y$ — проекция, в другой наоборот. И сечение зависит от второй переменной, $D_x=D_x(y)$ — про это рисунок с «кляксой» и двумя отрезками-масштабами разной длины.`,
		related: ['povtornyy-integral', 'teorema-fubini', 'prodolzhenie-nulem', 'indikator-oblasti']
	},

	'indikator-oblasti': {
		id: 'indikator-oblasti',
		term: 'Индикатор области I_D',
		short: String.raw`Единица внутри области, нуль снаружи; выключает всё лишнее.`,
		formula: String.raw`I_D(\vec x)=\begin{cases}1,&\vec x\in D,\\ 0,&\vec x\notin D.\end{cases}`,
		body: String.raw`Функция-выключатель, с помощью которой интеграл по $D$ записывается как интеграл по объемлющему прямоугольнику: $\iint_D f=\iint_P I_D f$. Ячейки вне $D$ дают нулевой вклад автоматически, а внутренний интеграл сужается на [[sechenie-oblasti|сечение]].

Цена приёма — разрыв: $I_D$ скачет на $\partial D$, поэтому $I_Df\notin C(P)$. Мешало бы это, будь граница толстой; но у приличной $D$ она [[nepravilnaya-mera-nol|множество меры нуль]], и интеграл её не замечает.`,
		related: ['prodolzhenie-nulem', 'sechenie-oblasti', 'nepravilnaya-mera-nol', 'teorema-fubini']
	},

	'prodolzhenie-nulem': {
		id: 'prodolzhenie-nulem',
		term: 'Продолжение нулём (Ш)',
		short: String.raw`$f$ доопределяется нулём вне $D$ и интегрируется по объемлющему $P$.`,
		formula: String.raw`\vec{\mathrm{Sh}}(\vec x)=I_D(\vec x)\cdot f(\vec x),\qquad \iint_D f=\iint_P \vec{\mathrm{Sh}}`,
		body: String.raw`Второй шаг доказательства [[teorema-fubini|Фубини]] (стр. 13), обозначенный рукописной «Ш» со стрелкой: функция домножается на [[indikator-oblasti|индикатор]] и продолжается нулём вне $D$, после чего работает уже доказанный случай прямоугольника.

Разбор расхождения сумм даёт три группы ячеек: внутри $D$ — та же сумма, снаружи — нули, на границе — остаток, оценённый через $\max|f|\cdot\sum_{\partial D}\|d_i\|$. Он гаснет ровно при $\mu(\partial D)=0$ (день 18) — там же прячется и вопрос о разрывах.`,
		related: ['indikator-oblasti', 'teorema-fubini', 'nepravilnaya-mera-nol', 'sechenie-oblasti']
	},

	'ravnomernaya-nepreryvnost': {
		id: 'ravnomernaya-nepreryvnost',
		term: 'Равномерная непрерывность',
		short: String.raw`Одно $\delta$ годится сразу для всех точек компакта.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall x,x':\ \rho(x,x')<\delta\Rightarrow|f(x)-f(x')|<\varepsilon`,
		body: String.raw`В отличие от обычной непрерывности, $\delta$ не зависит от точки. По теореме Кантора непрерывная на компакте функция равномерно непрерывна — для прямоугольника $P$ (произведения двух [[lsk|ЛСК]]) это и даёт рабочий инструмент.

Именно на ней держится доказательство [[teorema-fubini|Фубини]]: колебание $f$ на каждой [[yacheyka-razbieniya|ячейке]] меньше $\varepsilon/S$ **одновременно** для всех ячеек, поэтому сумма поправок не превосходит $\varepsilon$. Без равномерности $\delta$ зависело бы от $y$, и оценка развалилась бы.`,
		related: ['teorema-fubini', 'yacheyka-razbieniya', 'lsk', 'metriki-rho']
	},

	'perestanovka-predelov': {
		id: 'perestanovka-predelov',
		term: 'Перестановка повторных пределов',
		short: String.raw`В общем случае незаконна: $a_{mn}=m/(m+n)$ даёт $0$ и $1$.`,
		formula: String.raw`\lim_{m\to\infty}\lim_{n\to\infty}\frac{m}{m+n}=0\ne1=\lim_{n\to\infty}\lim_{m\to\infty}\frac{m}{m+n}`,
		body: String.raw`Шаг, который конспект выполняет молча в доказательстве [[teorema-fubini|Фубини]]: $\lim_{\delta x\to0}\lim_{\delta y\to0}$ меняются местами. Что так делать нельзя, показывает уже двойная последовательность $m/(m+n)$.

Интегральный свидетель — $f=\dfrac{x^2-y^2}{(x^2+y^2)^2}$ на $[0;1]^2$: повторные интегралы равны $\pi/4$ и $-\pi/4$. Спасает [[absolyutnaya-integriruemost|абсолютная интегрируемость]]; у конечных сумм проблемы нет вовсе — свободы порядка лишает предельный переход, а не размерность.`,
		related: ['teorema-fubini', 'absolyutnaya-integriruemost', 'povtornyy-integral', 'dvoynoy-integral']
	},

	'absolyutnaya-integriruemost': {
		id: 'absolyutnaya-integriruemost',
		term: 'Абсолютная интегрируемость',
		short: String.raw`$\iint_D|f|<\infty$ — условие, при котором порядок интегрирования свободен.`,
		formula: String.raw`\iint_D |f(x,y)|\,dx\,dy<\infty`,
		body: String.raw`Условие, спасающее [[perestanovka-predelov|перестановку]]: если $\iint_D|f|<\infty$ (или $f\ge0$ — теорема Тонелли), повторные интегралы равны. Курсовое требование $f\in C(D)$ на компакте влечёт ограниченность, а с ней и абсолютную интегрируемость, поэтому в [[teorema-fubini|теореме]] это условие не выписывают отдельно.

У контрпримера с $\pi/4$ расходится именно $\iint|f|$ — логарифмически. Полный аналог для рядов: без абсолютной сходимости перестановка членов меняет сумму (дни 25–28).`,
		related: ['perestanovka-predelov', 'teorema-fubini', 'dvoynoy-integral']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Предел интегральных сумм $I(f,\lambda,\vec\xi)$ по мелкости разбиения.`,
		formula: String.raw`\int_a^b f(x)\,dx=\lim_{\lambda_R\to0}\sum_i f(\xi_i)\,\lambda_i=I(f,\lambda,\vec\xi)`,
		body: String.raw`Одномерный прообраз всей сегодняшней конструкции: отрезок $[a;b]$ (в курсе — [[lsk|ЛСК]]) режется точками, $\lambda_i$ — длины кусков, $\xi_i$ — отмеченные точки, а интеграл есть предел сумм при [[rang-razbieniya|ранге]] $\lambda_R\to0$.

Интегральная сумма трактуется как функционал от тройки «функция, разбиение, набор точек». Переход к [[dvoynoy-integral|двойному интегралу]] меняет в этой записи ровно один сомножитель: вместо длины $\lambda_i$ стоит мера [[yacheyka-razbieniya|ячейки]] $\|d_i\|$.`,
		related: ['rang-razbieniya', 'dvoynoy-integral', 'yacheyka-razbieniya', 'lsk']
	},

	yakobian: {
		id: 'yakobian',
		term: 'Якобиан |J|',
		short: String.raw`Определитель матрицы Якоби — коэффициент искажения меры при замене координат.`,
		formula: String.raw`J=(j_{ik}),\quad j_{ik}=\frac{\partial\xi^{i}}{\partial\xi^{k}},\qquad |J|-\text{якобиан}`,
		body: String.raw`Определитель матрицы Якоби, записанной у преподавателя в тензорной нотации ($j_{ik}=\partial\xi^i/\partial\xi^k$, $\partial x_i/\partial x_k=\delta^i_k$). Геометрический смысл показан примером с параллелограммом: площадь равна модулю определителя сторон.

Третий, недоведённый шаг доказательства [[teorema-fubini|Фубини]] и главный герой дня 24: при замене переменных в [[kratnyy-integral|кратном интеграле]] мера [[yacheyka-razbieniya|ячейки]] умножается на $|J|$. Это же объясняет реплику про «плохие методы» в абстрактном $H$ — там канонических координат нет.`,
		related: ['kratnyy-integral', 'teorema-fubini', 'yacheyka-razbieniya', 'dvoynoy-integral']
	}
};
