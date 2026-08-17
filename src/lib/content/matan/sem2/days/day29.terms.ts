import type { Glossary } from '$lib/types';

// Термины дня 29 (равномерная сходимость, метрика на функциях, предельный
// переход под интегралом — единицы 29–30, теоремы 34–35).
// Понятия сквозной нотации курса живут в каноническом глоссарии
// (sem2/glossary.ts + унаследованный sem1/glossary.ts) и здесь НЕ дублируются —
// на них идут только перекрёстные ссылки [[...]]: lsk, metriki-rho, end-r,
// skalyarnoe-pole, vykolotaya-okrestnost, skhodyashchayasya-v-sebe,
// n-nol-n-odin, asimptoticheskie-klassy, priznak-i-svoystvo, blacksquare.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Все остальные термины, на которые ссылается день, объявлены прямо здесь —
// день должен резолвиться независимо от соседних.
export const day29Terms: Glossary = {
	'potochechnaya-shodimost': {
		id: 'potochechnaya-shodimost',
		term: 'Поточечная сходимость',
		short: String.raw`Свой номер $N(\varepsilon,x)$ в каждой точке.`,
		formula: String.raw`\forall x\in D\ \forall\varepsilon>0\ \exists N(\varepsilon,x)\ \forall n>N:\ |f_n(x)-f(x)|<\varepsilon`,
		body: String.raw`Сходимость $f_n\to f$, проверяемая отдельно в каждой точке: квантор $\forall x$ стоит **снаружи**, поэтому номер зависит и от $\varepsilon$, и от точки. Этого мало для перестановки предела с интегралом — контрпримером служит [[kontrprimer-gorb|растущий горб]] $n^2x(1-x)^n$.

Образцовый пример разницы: $f_n(x)=x^n$ на $[0;1]$ сходится поточечно к разрывной функции ($0$ при $x<1$, единица в $x=1$), причём $N(\varepsilon,x)=\lceil\ln\varepsilon/\ln x\rceil\to\infty$ при $x\to1-$. Общего номера на все точки нет, значит [[ravnomernaya-shodimost|равномерной сходимости]] тоже нет.`,
		related: ['ravnomernaya-shodimost', 'kontrprimer-gorb', 'nepreryvnost-predelnoy-funkcii']
	},

	'ravnomernaya-shodimost': {
		id: 'ravnomernaya-shodimost',
		term: 'Равномерная сходимость f_n ⇉ f',
		short: String.raw`Один номер $N(\varepsilon)$ обслуживает все точки сразу.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\in\mathbb N_1\ \forall n>N\ \forall x\in D\subset\mathbb R:\ |f_n(x)-f(x)|<\varepsilon`,
		body: String.raw`Семантическая единица 29, в конспекте обведена синей рамкой. От [[potochechnaya-shodimost|поточечной сходимости]] отличается ровно перестановкой кванторов: $\exists N$ стоит **левее** $\forall x$, то есть $N$ — функция только от $\varepsilon$, как и требует курс от любого доказательства ($N\in$ [[n-nol-n-odin|$\mathbb N_1$]]).

Возникает не как отдельная глава, а как ответ на вопрос «когда $\lim\int=\int\lim$», и тут же переводится на язык метрических пространств: $f_n\rightrightarrows f\iff\rho(f_n,f)\to0$ в [[metrika-ravnomernoy-shodimosti|метрике равномерной сходимости]]. Достаточное условие [[predelnyy-perehod-pod-integralom|предельного перехода под интегралом]] — но не необходимое.`,
		related: ['potochechnaya-shodimost', 'metrika-ravnomernoy-shodimosti', 'predelnyy-perehod-pod-integralom', 'dvuhparametricheskaya-funkciya']
	},

	'metrika-ravnomernoy-shodimosti': {
		id: 'metrika-ravnomernoy-shodimosti',
		term: 'Метрика равномерной сходимости',
		short: String.raw`$\rho(f_1,f_2)=\max|f_1-f_2|$ — расстояние между функциями.`,
		formula: String.raw`\rho(f_1,f_2)=\max_{x\in[a,b]}\bigl|f_1(x)-f_2(x)\bigr|`,
		body: String.raw`Метрика на функциях $f:[a,b]\to\mathbb R$, превращающая [[ravnomernaya-shodimost|равномерную сходимость]] в обычную сходимость точек: $f_n\rightrightarrows f\iff\rho(f_n,f)\to0$. Аксиомы проверяются мгновенно: максимум модуля равен нулю только для совпадающих функций, симметрия очевидна, неравенство треугольника получается взятием максимума в поточечном $|f_1-f_3|\le|f_1-f_2|+|f_2-f_3|$. Ещё один член [[metriki-rho|семейства $\rho$]], только точками теперь служат функции.

⚠️ $\max$ законен на [[funkcionalnoe-prostranstvo|$C[a,b]$]] (непрерывная на [[lsk|ЛСК]] достигает максимума); для разрывных функций надо писать $\sup$ — у $x^n$ и его разрывного предела $\sup=1$ не достигается ни в одной точке.`,
		related: ['ravnomernaya-shodimost', 'funkcionalnoe-prostranstvo', 'shar-v-funkcionalnom-prostranstve', 'metriki-rho']
	},

	'funkcionalnoe-prostranstvo': {
		id: 'funkcionalnoe-prostranstvo',
		term: 'Функциональное пространство',
		short: String.raw`Множество функций $[a,b]\to\mathbb R$ как метрическое пространство.`,
		formula: String.raw`C[a,b]=\{f:[a,b]\to\mathbb R\ \text{непрерывна}\},\qquad \rho(f_1,f_2)=\max_{x\in[a,b]}|f_1-f_2|`,
		body: String.raw`В конспекте заголовок выделен зелёным: множество функций $f:[a,b]\to\mathbb R$ рассматривается как метрическое пространство с [[metrika-ravnomernoy-shodimosti|метрикой]] $\rho=\max|f_1-f_2|$. Точка этого пространства — целая функция, и записывают её в [[lambda-notaciya|$\lambda$-нотации]].

Выигрыш: на функции переносится весь аппарат первого семестра — шары, окрестности, фундаментальность, [[polnota-funkcionalnogo-prostranstva|полнота]]. Это характерный ход курса: новое понятие немедленно сводится к уже построенной общей конструкции, а не изучается отдельным $\varepsilon$-$N$-сюжетом.`,
		related: ['metrika-ravnomernoy-shodimosti', 'shar-v-funkcionalnom-prostranstve', 'polnota-funkcionalnogo-prostranstva', 'lambda-notaciya']
	},

	'shar-v-funkcionalnom-prostranstve': {
		id: 'shar-v-funkcionalnom-prostranstve',
		term: 'Шар в функциональном пространстве',
		short: String.raw`$B_\varepsilon(f)$ — трубка ширины $2\varepsilon$ вокруг графика.`,
		formula: String.raw`B_\varepsilon(f)=\{g:\ \max_{x\in[a,b]}|g(x)-f(x)|<\varepsilon\}`,
		body: String.raw`В конспекте нарисован $B_1(0)$: сплошная прямая $y=0$ и две штриховые на уровнях $\pm1$ — шар радиуса $1$ вокруг нулевой функции оказывается полосой ширины $2$. Рядом тот же приём для параболы: $B_1(\lambda x{:}\ x^2)$.

Картинка и есть смысл [[ravnomernaya-shodimost|равномерной сходимости]]: график $f_n$ целиком лежит внутри трубки начиная с номера $N$. При [[potochechnaya-shodimost|поточечной]] в трубку рано или поздно входит каждая вертикаль по отдельности, а весь график может не поместиться никогда — как у $x^n$ вблизи единицы.`,
		related: ['metrika-ravnomernoy-shodimosti', 'funkcionalnoe-prostranstvo', 'lambda-notaciya', 'ravnomernaya-shodimost']
	},

	'lambda-notaciya': {
		id: 'lambda-notaciya',
		term: 'λ-нотация для функции',
		short: String.raw`$\lambda x{:}\ x^2$ — функция как точка пространства.`,
		formula: String.raw`B_1(\lambda x{:}\ x^2),\qquad \texttt{lambda\ x:}\ x^2\approx\lambda x{:}\ x^2`,
		body: String.raw`Запись функции без имени: $\lambda x{:}\ x^2$ — это отображение $x\mapsto x^2$. Преподаватель ставит рядом синюю ремарку с питоновской лямбдой, то есть прямо заимствует нотацию из программирования (направление J31).

Нужна она затем, чтобы аргументом [[shar-v-funkcionalnom-prostranstve|шара]] можно было честно написать функцию: $B_1(\lambda x{:}\ x^2)$ читается как «шар радиуса 1 вокруг точки $x\mapsto x^2$ [[funkcionalnoe-prostranstvo|функционального пространства]]». В учебниках анализа так не пишут — это особенность курса.`,
		related: ['shar-v-funkcionalnom-prostranstve', 'funkcionalnoe-prostranstvo', 'metrika-ravnomernoy-shodimosti']
	},

	'nepreryvnost-predelnoy-funkcii': {
		id: 'nepreryvnost-predelnoy-funkcii',
		term: 'Непрерывность предельной функции',
		short: String.raw`Равномерный предел непрерывных функций непрерывен.`,
		formula: String.raw`f_n\in C[a,b],\ f_n\rightrightarrows f\ \Longrightarrow\ f\in C[a,b]`,
		body: String.raw`Доказывается приёмом трёх эпсилонов: $|f(x)-f(x_0)|\le|f(x)-f_m(x)|+|f_m(x)-f_m(x_0)|+|f_m(x_0)-f(x_0)|$, где крайние слагаемые оценены равномерно (одним числом сразу в обеих точках), а среднее — непрерывностью одной функции $f_m$ с номером $m=N(\varepsilon/3)+1$. Итог курс требует в явной форме: $\delta(\varepsilon)=\delta_{f_m}(\varepsilon/3)$.

Рабочая контрапозиция: **разрывный предел запрещает равномерную сходимость**. Так за строчку закрывается $x^n$ на $[0;1]$, где считать $\sup$ уже не нужно. Вместе с полнотой $\mathbb R$ это утверждение и даёт [[polnota-funkcionalnogo-prostranstva|полноту $C[a,b]$]].`,
		related: ['polnota-funkcionalnogo-prostranstva', 'ravnomernaya-shodimost', 'potochechnaya-shodimost', 'funkcionalnoe-prostranstvo']
	},

	'polnota-funkcionalnogo-prostranstva': {
		id: 'polnota-funkcionalnogo-prostranstva',
		term: 'Полнота C[a,b]',
		short: String.raw`Сходящаяся в себе последовательность непрерывных имеет непрерывный предел.`,
		formula: String.raw`\rho(f_n,f_{n+p})<\varepsilon\ \ \forall p\in\mathbb N_1\ \Longrightarrow\ \exists f\in C[a,b]:\ f_n\rightrightarrows f`,
		body: String.raw`Пространство $\bigl(C[a,b],\rho\bigr)$ полно. Доказательство в два хода: из $|f_n(x)-f_{n+p}(x)|\le\rho(f_n,f_{n+p})$ каждая числовая последовательность $(f_n(x))$ оказывается [[skhodyashchayasya-v-sebe|сходящейся в себе]], а $\mathbb R$ полно — так рождается поточечный предел $f$; затем предельный переход по $p$ в том же неравенстве даёт $\rho(f_n,f)\le\varepsilon$, то есть сходимость равномерную.

Замкнутость класса обеспечивает [[nepreryvnost-predelnoy-funkcii|непрерывность предела]]. ⚠️ По поточечному пределу класс не замкнут: у $x^n$ предел разрывен и из $C[0;1]$ выпадает — ровно поэтому [[potochechnaya-shodimost|поточечная сходимость]] не годится в качестве сходимости в этом пространстве.`,
		related: ['nepreryvnost-predelnoy-funkcii', 'funkcionalnoe-prostranstvo', 'skhodyashchayasya-v-sebe', 'metrika-ravnomernoy-shodimosti']
	},

	'dvuhparametricheskaya-funkciya': {
		id: 'dvuhparametricheskaya-funkciya',
		term: 'Двухпараметрическая функция и равномерность по параметру',
		short: String.raw`$f_t(x)$: по $t$ берут предел, по $x$ требуют равномерности.`,
		formula: String.raw`f\underset{t\to t_0}{\overset{t\in M}{\rightrightarrows}}f_{t_0}:\quad \forall\varepsilon>0\ \exists\delta>0\ \forall t\in B_\delta(t_0)\ \forall x\in D\subset\mathbb R^n:\ |f_t(x)-f_{t_0}(x)|<\varepsilon`,
		body: String.raw`Семантическая единица 30. Дана $f:M\times\mathbb R^n\to\mathbb R$ — семейство функций, занумерованное непрерывным параметром $t$. Определение записано единообразно с последовательным случаем: пара «$\exists N$, $\forall n>N$» заменена на «$\exists\delta$, $\forall t\in B_\delta(t_0)$», и функцией от $\varepsilon$ становится радиус $\delta$.

Два предостережения: шар $B_\delta(t_0)$ живёт в пространстве параметра, а не в [[funkcionalnoe-prostranstvo|функциональном]] (в одной формуле два разных шара), и окрестность обычно нужна [[vykolotaya-okrestnost|выколотой]] — в самой точке $t_0$ функция часто не задана. Сразу общий случай $x\in D\subset\mathbb R^n$, то есть [[skalyarnoe-pole|скалярные поля]].`,
		related: ['ravnomernaya-shodimost', 'predelnyy-perehod-pod-integralom', 'vykolotaya-okrestnost', 'skalyarnoe-pole']
	},

	'predelnyy-perehod-pod-integralom': {
		id: 'predelnyy-perehod-pod-integralom',
		term: 'Предельный переход под интегралом',
		short: String.raw`Теоремы 34–35: при $f_n\rightrightarrows f$ предел заходит под знак интеграла.`,
		formula: String.raw`\lim_{n\to\infty}\int_a^b f_n\,dx=\int_a^b\Bigl(\lim_{n\to\infty}f_n\Bigr)dx,\qquad \lim_{t\to t_0}\int_a^b f(x,t)\,dx=\int_a^b\Bigl(\lim_{t\to t_0}f(x,t)\Bigr)dx`,
		body: String.raw`Теоремы 34 (последовательность интегралов) и 35 (интегральный функционал), обе — и в [[end-r|$\operatorname{End}(\mathbb R)$]], и для [[skalyarnoe-pole|скалярных полей]]. Доказательство одно на двоих: оценка $\bigl|\int f_n-\int f\bigr|\le(b-a)\rho(f_n,f)$ плюс [[zvezda-i-delta|связка эпсилонов]] $\varepsilon_\Delta=\varepsilon_\star/(b-a)$; итог — явные $N_\star(\varepsilon_\star)=N_\Delta\bigl(\varepsilon_\star/(b-a)\bigr)$ и $\delta_\star(\varepsilon_\star)=\delta_\Delta\bigl(\varepsilon_\star/(b-a)\bigr)$.

Для области $D\subset\mathbb R^n$ множитель $(b-a)$ заменяется мерой $\mu(D)$ и обязан быть конечным: на неограниченной области равномерность не спасает — у $f_n=\frac1n I_{[0;n]}\rightrightarrows0$ интеграл равен единице при каждом $n$.`,
		related: ['ravnomernaya-shodimost', 'zvezda-i-delta', 'dvuhparametricheskaya-funkciya', 'kontrprimer-gorb']
	},

	'zvezda-i-delta': {
		id: 'zvezda-i-delta',
		term: 'Метки ☆ и Δ, связка эпсилонов',
		short: String.raw`☆ — предел интеграла, Δ — интеграл предела; их связывает $(b-a)$.`,
		formula: String.raw`\varepsilon_\Delta=\frac{\varepsilon_\star}{b-a}\qquad\Longrightarrow\qquad N_\star(\varepsilon_\star)=N_\Delta\!\left(\frac{\varepsilon_\star}{b-a}\right)`,
		body: String.raw`Обозначения конспекта: звёздочкой ☆ помечена левая часть $\lim\int f_n$ («предел интеграла»), треугольником Δ — правая $\int\lim f_n$ («интеграл предела»), а между ними стоит знак вопроса — то, что предстоит обосновать. Каждая сторона получает собственный эпсилон, $\varepsilon_\star$ и $\varepsilon_\Delta$, по общему правилу курса «эпсилоны именуются по объекту».

Ключ [[predelnyy-perehod-pod-integralom|доказательства]] — подстановка $\varepsilon_\Delta=\varepsilon_\star/(b-a)$: допуск по высоте делится на длину отрезка, потому что в оценке он умножается на $(b-a)$. Педантичная деталь: строгое неравенство даёт $\varepsilon_\Delta=\varepsilon_\star/(2(b-a))$.`,
		related: ['predelnyy-perehod-pod-integralom', 'ravnomernaya-shodimost', 'metrika-ravnomernoy-shodimosti']
	},

	'kontrprimer-gorb': {
		id: 'kontrprimer-gorb',
		term: 'Контрпример n²x(1−x)ⁿ',
		short: String.raw`Поточечно $\to0$, а интеграл $\to1$: равномерности нет.`,
		formula: String.raw`f_n(x)=n^2x(1-x)^n,\quad \int_0^1 f_n\,dx=\frac{n^2}{(n+1)(n+2)}\to1,\quad \lim_n f_n\equiv0`,
		body: String.raw`Показывает, что [[potochechnaya-shodimost|поточечной сходимости]] для перестановки предела и интеграла мало. Интеграл считается точно заменой $u=1-x$: $\int_0^1x(1-x)^n dx=\frac{1}{(n+1)(n+2)}$, откуда ☆ равно $1$; поточечно же $n^2(1-x)^n\to0$ в каждой точке (показательное убывание бьёт многочлен, см. [[asimptoticheskie-klassy|классы асимптотик]]), откуда Δ равно $0$.

Нарушение условия видно из максимума в $x_*=\frac{1}{n+1}$: $\rho(f_n,0)\sim\frac ne\to+\infty$ — последовательность уходит на бесконечность в [[metrika-ravnomernoy-shodimosti|метрике $\rho$]]. Образ: горб высотой $\sim n$ и шириной $\sim1/n$ — площадь остаётся, точка ускользает.`,
		related: ['potochechnaya-shodimost', 'predelnyy-perehod-pod-integralom', 'metrika-ravnomernoy-shodimosti', 'asimptoticheskie-klassy']
	},

	'perestanovka-predela-i-proizvodnoy': {
		id: 'perestanovka-predela-i-proizvodnoy',
		term: 'Перестановка предела и производной',
		short: String.raw`Законна при равномерной сходимости производных, а не функций.`,
		formula: String.raw`(f_n)'_x\rightrightarrows f'\ \Longrightarrow\ \lim_{n\to\infty}\bigl(f_n(x)\bigr)'_x=\Bigl(\lim_{n\to\infty}f_n(x)\Bigr)'_x`,
		body: String.raw`Записано в конспекте на той же странице, что и [[predelnyy-perehod-pod-integralom|предельный переход под интегралом]], но без доказательства — указано лишь условие.

⚠️ Ловушка в том, от кого требуется [[ravnomernaya-shodimost|равномерность]]: от производных, а не от самих функций. Сходимость $f_n\rightrightarrows f$ о производных не говорит ничего — у $\frac{\sin nx}{n}\rightrightarrows0$ производные $\cos nx$ не сходятся вовсе. Интегрирование в этом смысле мягче дифференцирования: оно усредняет и гасит колебания, а дифференцирование их усиливает.`,
		related: ['ravnomernaya-shodimost', 'predelnyy-perehod-pod-integralom', 'nepreryvnost-predelnoy-funkcii']
	}
};
