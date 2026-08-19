import type { Glossary } from '$lib/types';

// Термины дня 26 (признаки сходимости несобственных интегралов, интегральный
// критерий Коши). Сквозные понятия живут в каноническом глоссарии
// (sem2/glossary.ts) и здесь НЕ дублируются — на них идут только
// перекрёстные ссылки [[...]]: priznak-i-svoystvo, asimptoticheskie-klassy,
// skhodyashchayasya-v-sebe, nepravilnaya-mera-nol.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Глоссарий склеивается по всему курсу, поэтому понятия, введённые раньше,
// подключаются ссылкой и не переобъявляются: nesobstvennyy-integral-i-roda,
// shodimost-integrala, etalonnyy-integral, absolyutnaya-shodimost,
// uslovnaya-shodimost (день 25), kriteriy-lebega (день 18),
// integrirovanie-po-chastyam (день 21).
export const day26Terms: Glossary = {
	'mazhoranta-i-minoranta': {
		id: 'mazhoranta-i-minoranta',
		term: 'Мажоранта и миноранта',
		short: String.raw`Оценка сверху и оценка снизу, с которыми сравнивают функцию.`,
		formula: String.raw`0\le f\le g:\ g\ \text{— мажоранта};\qquad 0\le h\le f:\ h\ \text{— миноранта}`,
		body: String.raw`Мажоранта — то, чем накрывают сверху, миноранта — то, чем подпирают снизу. [[priznak-sravneniya-integralov|Признак сравнения]] пропускает по каждой ровно одну импликацию: сходимость идёт от мажоранты вниз, расходимость — от миноранты вверх.

Приём подбора всегда один — огрубить знаменатель так, чтобы справа встал [[etalonnyy-integral|эталон]] $x^{-p}$. Постоянный множитель не мешает: мажоранта $(k+1)g$ в [[asimptoticheskiy-priznak|асимптотическом признаке]] сходится вместе с $g$.`,
		related: ['priznak-sravneniya-integralov', 'etalonnyy-integral', 'asimptoticheskiy-priznak']
	},

	'svoystva-integrala': {
		id: 'svoystva-integrala',
		term: 'Аддитивность и монотонность интеграла',
		short: String.raw`Склейка по отрезку и сохранение неравенства между функциями.`,
		formula: String.raw`\int_a^c=\int_a^b+\int_b^c;\qquad f\le g\ \Rightarrow\ \int_a^b f\le\int_a^b g`,
		body: String.raw`Два свойства интеграла Римана, которыми в этой теме пользуются молча. Аддитивность склеивает куски $\int_n^{n+1}$ в один $\int_1^{N+1}$ при выводе [[integralnyy-kriteriy-koshi|интегрального критерия]], монотонность переносит поэлементное неравенство $f\le g$ на интегралы в [[priznak-sravneniya-integralov|признаке сравнения]].

Из аддитивности следует и то, что конечный кусок $[a;M]$ на [[shodimost-integrala|сходимость]] не влияет: он даёт конечную добавку, а вопрос решается хвостом.`,
		related: ['priznak-sravneniya-integralov', 'integralnyy-kriteriy-koshi', 'shodimost-integrala']
	},

	'priznak-sravneniya-integralov': {
		id: 'priznak-sravneniya-integralov',
		term: 'Признак сравнения для интегралов',
		short: String.raw`Сходится мажоранта — сходится и меньшее; расходится миноранта — и большее.`,
		formula: String.raw`0\le f\le g:\quad \int_a^{\infty}g\ \text{сх.}\Rightarrow\int_a^{\infty}f\ \text{сх.};\quad \int_a^{\infty}f\ \text{расх.}\Rightarrow\int_a^{\infty}g\ \text{расх.}`,
		body: String.raw`Одна теорема в двух параллельных формулировках — для рядов ($0\le f_n\le g_n$) и для интегралов ($0\le f\le g$ при $x\ge a$): $\sum$ и $\int$ здесь один объект.

Доказательство: при $f\ge0$ функция $F(A)=\int_a^A f$ не убывает, а из $f\le g$ следует $F(A)\le G(A)\le C$ — монотонная и ограниченная сверху имеет конечный предел. Вторая импликация — [[kontrapoziciya|контрапозиция]]. Неотрицательность существенна: без неё $F$ не монотонна и «ограничена» перестаёт значить «сходится»; для знакопеременных работает [[kriteriy-koshi-dlya-integrala|критерий Коши]]. Достаточное условие сходимости — это [[priznak-i-svoystvo|признак]].`,
		related: ['etalonnyy-integral', 'asimptoticheskiy-priznak', 'kriteriy-koshi-dlya-integrala', 'mazhoranta-i-minoranta']
	},

	'asimptoticheskiy-priznak': {
		id: 'asimptoticheskiy-priznak',
		term: 'Асимптотический признак',
		short: String.raw`Сравнение отношением: $f\in O(g)$, то есть $\lim f/g = k<\infty$.`,
		formula: String.raw`f\ge0,\ g>0,\ \ \lim_{x\to\infty}\frac{f(x)}{g(x)}=k<\infty:\quad \int_a^{\infty}g\ \text{сх.}\Rightarrow\int_a^{\infty}f\ \text{сх.}`,
		body: String.raw`Формулируется на языке [[asimptoticheskie-klassy|классов асимптотик]], где $f\in O(g)$ означает существование конечного предела отношения $\lim f/g=k$. Требование предела строже ограниченности отношения: у $f(x)=\frac{2+\sin x}{x^{2}}$ и $g(x)=\frac{1}{x^{2}}$ отношение колеблется между $1$ и $3$, предела нет, хотя [[mazhoranta-i-minoranta|мажоранта]] $3g$ есть.

Доказательство короткое: берём $\varepsilon=1$, получаем порог $M$ с $f<(k+1)g$ при $x>M$, и применяем [[priznak-sravneniya-integralov|признак сравнения]] на хвосте (кусок $[a;M]$ конечен и на сходимость не влияет). Вывод «сходятся одновременно» верен только при $k\ne0$, то есть при $f\in\Theta(g)$: для $f=1/x^2$, $g=1/x$ отношение стремится к нулю, а интегралы ведут себя по-разному.`,
		related: ['priznak-sravneniya-integralov', 'asimptoticheskie-klassy', 'etalonnyy-integral']
	},

	'kriteriy-koshi-dlya-integrala': {
		id: 'kriteriy-koshi-dlya-integrala',
		term: 'Критерий Коши',
		short: String.raw`Хвостовые куски малы: $|\int_{A_1}^{A_2}f|<\varepsilon$ при $A_2>A_1>M$.`,
		formula: String.raw`\int_a^{\infty}f\ \text{сх.}\iff\forall\varepsilon>0\ \exists M\ \forall A_2>A_1>M:\ \Bigl|\int_{A_1}^{A_2}f\Bigr|<\varepsilon`,
		body: String.raw`Перенос понятия [[skhodyashchayasya-v-sebe|сходящейся в себе]] последовательности на накопленную величину: разность $F(A_2)-F(A_1)$ — это в точности $\int_{A_1}^{A_2}f$, а полнота $\mathbb R$ превращает фундаментальность в сходимость. Формулируется сразу двумя строками — для интеграла и для ряда, где отрезок имеет вид $\sum_{k=p}^{q}a_k$.

Главное достоинство — независимость от знака $f$: там, где [[priznak-sravneniya-integralov|сравнение]] неприменимо, работает критерий. На нём стоит доказательство теоремы «[[absolyutnaya-shodimost|абсолютная сходимость]] влечёт сходимость», где порог берётся у модуля без всякого дробления $\varepsilon$: $M_f(\varepsilon)=M_{|f|}(\varepsilon)$.`,
		related: ['absolyutnaya-shodimost', 'skhodyashchayasya-v-sebe', 'shodimost-integrala', 'priznak-sravneniya-integralov']
	},

	'teorema-rimana-o-perestanovke': {
		id: 'teorema-rimana-o-perestanovke',
		term: 'Теорема Римана о перестановке',
		short: String.raw`Перестановкой членов условно сходящегося ряда получают любую сумму.`,
		formula: String.raw`\sum a_n\ \text{сх. условно}\ \Rightarrow\ \forall S\ \exists\ \text{перестановка}\ \sigma:\ \sum a_{\sigma(n)}=S`,
		body: String.raw`У [[uslovnaya-shodimost|условно сходящегося]] ряда положительная и отрицательная части по отдельности расходятся, поэтому их можно чередовать так, чтобы [[chastichnaya-summa|частичные суммы]] шли к любому наперёд заданному числу.

Отсюда содержательная разница между двумя видами сходимости: сумма условно сходящегося ряда — свойство порядка, а не множества слагаемых, тогда как у [[absolyutnaya-shodimost|абсолютно сходящегося]] перестановка не меняет ничего.`,
		related: ['uslovnaya-shodimost', 'absolyutnaya-shodimost', 'integral-dirihle']
	},

	'integralnyy-kriteriy-koshi': {
		id: 'integralnyy-kriteriy-koshi',
		term: 'Интегральный критерий Коши',
		short: String.raw`Для убывающей $f\ge0$ ряд $\sum f(n)$ и $\int_1^\infty f$ сходятся вместе.`,
		formula: String.raw`f\ge0\ \text{не возрастает на }[1;+\infty):\quad \int_1^{\infty}f(x)\,dx\ \text{сх.}\iff\sum_{n=1}^{\infty}f(n)\ \text{сх.}`,
		body: String.raw`Мост между несобственными интегралами и рядами. Доказательство — зажатие: из $f(n+1)\le f(x)\le f(n)$ на $[n;n+1]$ суммированием получается $S_{N+1}-f(1)\le\int_1^{N+1}f\le S_N$, и дальше обе стороны решает «монотонна и ограничена».

Работают все три условия. Область $[1;+\infty)$: нижний предел интегрирования обязан совпадать с началом суммирования, иначе зажатие не собирается. Интегрируемость на каждом отрезке: она следует из монотонности, потому что счётное множество разрывов имеет [[nepravilnaya-mera-nol|меру нуль]], а дальше работает [[kriteriy-lebega|критерий Лебега]]. Монотонность: без неё теорема ложна — у $f=\sin^2(\pi x)$ ряд сходится, а интеграл расходится. Достаточно, впрочем, монотонности начиная с некоторого $N$: конечный кусок сходимости не меняет.`,
		related: ['etalonnyy-integral', 'ryad-dirihle', 'chastichnaya-summa', 'svoystva-integrala']
	},

	'ryad-dirihle': {
		id: 'ryad-dirihle',
		term: 'Ряд Дирихле',
		short: String.raw`$\sum 1/n^p$; сходится ровно при $p>1$ — дискретный двойник эталона.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac{1}{n^{p}}\ \text{сх.}\iff p>1`,
		body: String.raw`Обобщённый гармонический ряд. При $p>0$ функция $x^{-p}$ неотрицательна и убывает, поэтому [[integralnyy-kriteriy-koshi|интегральный критерий]] сводит вопрос к [[etalonnyy-integral|эталону]]: порог тот же, $p>1$. При $p\le0$ критерий не помогает (при $p<0$ нет и убывания), но он и не нужен: члены не стремятся к нулю, и расходимость даёт [[neobhodimoe-uslovie-shodimosti|необходимое условие]].

Служит линейкой для всех тонких признаков рядов: $\sum\frac{1}{n^{1+d}}$ — эталон сходимости в схемах Раабе и Бертрана, а $p=1$ ([[garmonicheskiy-ryad|гармонический ряд]]) — эталон расходимости.`,
		related: ['etalonnyy-integral', 'integralnyy-kriteriy-koshi', 'garmonicheskiy-ryad', 'neobhodimoe-uslovie-shodimosti']
	},

	'integral-dirihle': {
		id: 'integral-dirihle',
		term: 'Интеграл Дирихле',
		short: String.raw`$\int_1^\infty \sin x/x\,dx$ — образец условной сходимости.`,
		formula: String.raw`\int_1^{\infty}\frac{\sin x}{x}\,dx\ \text{— сх.},\qquad \int_1^{\infty}\frac{|\sin x|}{x}\,dx\ \text{— расх.}`,
		body: String.raw`Контрпример, показывающий необратимость теоремы «[[absolyutnaya-shodimost|абсолютная сходимость]] влечёт сходимость». Сходимость доказывается [[integrirovanie-po-chastyam|интегрированием по частям]]: $\int_1^{A}\frac{\sin x}{x}dx=\cos1-\frac{\cos A}{A}-\int_1^{A}\frac{\cos x}{x^{2}}dx$, где последний интеграл сходится абсолютно по мажоранте $x^{-2}$.

Расходимость модуля — оценкой по промежуткам длины $\pi$: $\int_{\pi k}^{\pi(k+1)}\frac{|\sin x|}{x}dx\ge\frac{2}{\pi(k+1)}$, а сумма таких оценок — [[garmonicheskiy-ryad|гармонический ряд]]. Значит сходимость [[uslovnaya-shodimost|условная]]; численно $\int_1^\infty\frac{\sin x}{x}dx\approx0{,}62471$, а $\int_1^{A}\frac{|\sin x|}{x}dx$ растёт как $\frac{2}{\pi}\ln A$.`,
		related: ['uslovnaya-shodimost', 'absolyutnaya-shodimost', 'garmonicheskiy-ryad']
	},

	'garmonicheskiy-ryad': {
		id: 'garmonicheskiy-ryad',
		term: 'Гармонический ряд',
		short: String.raw`$\sum 1/n$ расходится, хотя члены стремятся к нулю.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac1n=+\infty,\qquad \sum_{k=1}^{n}\frac1k=\ln n+O(1)`,
		body: String.raw`Случай $p=1$ [[ryad-dirihle|ряда Дирихле]] и главный контрпример к обратной импликации в [[neobhodimoe-uslovie-shodimosti|необходимом условии]]: члены стремятся к нулю, а ряд расходится. [[integralnyy-kriteriy-koshi|Интегральный критерий]] доказывает это одной строкой: $\int_1^{\infty}\frac{dx}{x}=\ln x\big|_1^{\infty}=+\infty$.

То же зажатие даёт точную асимптотику частичных сумм $\sum_{k=1}^{n}\frac1k=\ln n+O(1)$ — оценка, на которой держатся расходимость [[integral-dirihle|интеграла Дирихле]] по модулю и стандартные оценки сложности алгоритмов.`,
		related: ['ryad-dirihle', 'integralnyy-kriteriy-koshi', 'neobhodimoe-uslovie-shodimosti', 'integral-dirihle']
	},

	'chastichnaya-summa': {
		id: 'chastichnaya-summa',
		term: 'Частичная сумма ряда',
		short: String.raw`$S_N=\sum_{k=1}^{N}f_k$; ряд сходится, если существует $\lim S_N$.`,
		formula: String.raw`S_N=\sum_{k=1}^{N}f_k,\quad f_k=S_k-S_{k-1},\quad S_0=0,\qquad \sum_{k=p}^{q}f_k=S_q-S_{p-1}`,
		body: String.raw`Сумма первых $N$ членов; сходимость ряда — это по определению существование конечного предела последовательности $S_N$. Дискретный двойник функции $F(A)=\int_a^{A}f$, и именно этот параллелизм позволяет выписывать признаки сразу для $\sum$ и для $\int$. В роли первообразной она и работает: соотношение $f_k=S_k-S_{k-1}$ — аналог $F'=f$, а $\sum_{k=p}^{q}f_k=S_q-S_{p-1}$ — дискретная формула Ньютона–Лейбница, из которой в дне 27 растёт преобразование Абеля. Вычитается $S_{p-1}$, а не $S_p$: иначе член $f_p$ выпадет из суммы.

В доказательстве [[integralnyy-kriteriy-koshi|интегрального критерия]] обе частичные суммы работают границами коридора: $S_{N+1}-f(1)\le\int_1^{N+1}f\le S_N$, а их разность сворачивается в [[teleskopicheskaya-summa|телескоп]] $f(1)-f(N+1)\le f(1)$ — ряд и интеграл не могут разойтись больше чем на одно число.`,
		related: ['shodimost-integrala', 'integralnyy-kriteriy-koshi', 'neobhodimoe-uslovie-shodimosti']
	},

	'neobhodimoe-uslovie-shodimosti': {
		id: 'neobhodimoe-uslovie-shodimosti',
		term: 'Необходимое условие сходимости ряда',
		short: String.raw`У сходящегося ряда $f_n\to0$; обратное неверно.`,
		formula: String.raw`\sum_{n=1}^{\infty}f_n\ \text{сх.}\ \Rightarrow\ \lim_{n\to\infty}f_n=0`,
		body: String.raw`Если ряд сходится, его члены стремятся к нулю: $f_n=S_n-S_{n-1}\to S-S=0$. Это [[priznak-i-svoystvo|свойство]] сходящегося ряда, а не признак: условие необходимое, но не достаточное.

Работает только на расходимость: если $f_n\not\to0$, ряд расходится (так закрывается случай $p\le0$ у [[ryad-dirihle|ряда Дирихле]]). Обратной импликации нет — контрпример [[garmonicheskiy-ryad|гармонический ряд]], у которого $\frac1n\to0$ при расходящейся сумме.`,
		related: ['chastichnaya-summa', 'ryad-dirihle', 'garmonicheskiy-ryad', 'priznak-i-svoystvo']
	}
};
