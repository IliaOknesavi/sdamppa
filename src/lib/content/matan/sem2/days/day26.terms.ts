import type { Glossary } from '$lib/types';

// Термины дня 26 (признаки сходимости несобственных интегралов, интегральный
// критерий Коши). Понятия сквозной нотации курса живут в каноническом
// глоссарии (sem2/glossary.ts) и здесь НЕ дублируются — на них идут только
// перекрёстные ссылки [[...]]: priznak-i-svoystvo, asimptoticheskie-klassy,
// skhodyashchayasya-v-sebe, nepravilnaya-mera-nol, blacksquare.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Карточки nesobstvennyy-integral-pervogo-roda и
// skhodimost-nesobstvennogo-integrala намеренно продублированы из дня 25,
// чтобы день резолвился независимо.
export const day26Terms: Glossary = {
	'nesobstvennyy-integral-pervogo-roda': {
		id: 'nesobstvennyy-integral-pervogo-roda',
		term: 'Несобственный интеграл I рода',
		short: String.raw`Интеграл по неограниченной области $D$; $\int_a^{+\infty}$ — частный случай.`,
		formula: String.raw`\int_D f(x)\,dx,\qquad f:M\to\mathbb R,\qquad D\ \text{— неограничено}`,
		body: String.raw`Курс определяет I род **через неограниченность области интегрирования**: пишется $\int_D f$, где $D$ — произвольное неограниченное множество ($\mathbb R$, $\mathbb R_+$, $\mathbb R_-$), а привычный $\int_a^{+\infty}$ — лишь частный случай. Это продолжение топологической линии курса: сначала общая конструкция, потом прямая как пример.

⚠️ У Фихтенгольца I род сразу вводится как $\lim_{A\to+\infty}\int_a^{A}$. Практическая разница появляется в двумерных и симметричных случаях: для $\int_{\mathbb R}$ курс отдельно вводит главное значение V.p. с симметричным срезанием обеих бесконечностей. Все признаки дня доказываются только для I рода — II род сводится к нему заменой $x=1/t$.`,
		related: ['skhodimost-nesobstvennogo-integrala', 'etalonnyy-integral', 'kriteriy-koshi-dlya-integrala']
	},

	'skhodimost-nesobstvennogo-integrala': {
		id: 'skhodimost-nesobstvennogo-integrala',
		term: 'Сходимость несобственного интеграла',
		short: String.raw`Конечный предел $\int_a^{1/\varepsilon}f$ при $\varepsilon\to+0$.`,
		formula: String.raw`\int_a^{\infty}f\ \text{— сх.}:\quad \exists\lim_{\varepsilon\to+0}\int_a^{1/\varepsilon}f(x)\,dx\in\mathbb R`,
		body: String.raw`Рабочее определение курса: интеграл сходится, если существует конечный предел усечённого интеграла при $\varepsilon\to+0$ с верхней границей $1/\varepsilon$. Один и тот же параметр обслуживает оба рода — у II рода $\varepsilon$ съедает особенность изнутри, у I рода уходит на бесконечность через $1/\varepsilon$.

Молчаливое требование: на каждом отрезке $[a;A]$ функция интегрируема по Риману, иначе выражение под пределом не определено. Структурно это тот же объект, что и предел [[chastichnaya-summa|частичных сумм]] ряда, — поэтому все признаки формулируются сразу двумя строками, для $\sum$ и для $\int$.`,
		related: ['nesobstvennyy-integral-pervogo-roda', 'chastichnaya-summa', 'kriteriy-koshi-dlya-integrala', 'etalonnyy-integral']
	},

	'etalonnyy-integral': {
		id: 'etalonnyy-integral',
		term: 'Эталонный интеграл',
		short: String.raw`$\int_1^\infty dx/x^p$ сходится ровно при $p>1$; линейка для всех сравнений.`,
		formula: String.raw`\int_1^{\infty}\frac{dx}{x^{p}}\ \text{сх.}\iff p>1,\qquad \int_1^{\infty}\frac{dx}{x^{p}}=\frac{1}{p-1}`,
		body: String.raw`Степенной интеграл, с которым сравнивают всё остальное. Считается прямо по определению: $\int_1^{1/\varepsilon}x^{-p}dx=\frac{\varepsilon^{p-1}-1}{1-p}$, и при $p>1$ множитель $\varepsilon^{p-1}\to0$, а при $p<1$ уходит в бесконечность; случай $p=1$ даёт $\ln\frac1\varepsilon\to\infty$. Граница $p=1$ в область сходимости **не входит**.

Логарифмический вариант получается заменой $z=\ln x$: $\int_2^{\infty}\frac{dx}{x\ln^p x}=\int_{\ln2}^{\infty}\frac{dz}{z^{p}}$ — тот же порог $p>1$. Через [[integralnyy-kriteriy-koshi|интегральный критерий]] обе линейки переносятся на [[ryad-dirihle|ряд Дирихле]] и на $\sum\frac{1}{n\ln^p n}$.`,
		related: ['priznak-sravneniya-integralov', 'integralnyy-kriteriy-koshi', 'ryad-dirihle', 'skhodimost-nesobstvennogo-integrala']
	},

	'priznak-sravneniya-integralov': {
		id: 'priznak-sravneniya-integralov',
		term: 'Признак сравнения для интегралов',
		short: String.raw`Сходится мажоранта — сходится и меньшее; расходится миноранта — и большее.`,
		formula: String.raw`0\le f\le g:\quad \int_a^{\infty}g\ \text{сх.}\Rightarrow\int_a^{\infty}f\ \text{сх.};\quad \int_a^{\infty}f\ \text{расх.}\Rightarrow\int_a^{\infty}g\ \text{расх.}`,
		body: String.raw`Теорема 22 списка семантических единиц. В конспекте выписана двумя параллельными блоками — сначала для рядов ($f_n\ge0$, $g_n\ge f_n$), тут же для интегралов: курс держит $\sum$ и $\int$ одним объектом.

Доказательство: при $f\ge0$ функция $F(A)=\int_a^A f$ не убывает, а из $f\le g$ следует $F(A)\le G(A)\le C$ — монотонная и ограниченная сверху имеет конечный предел. Вторая импликация — контрапозиция. ⚠️ Неотрицательность существенна: без неё $F$ не монотонна и «ограничена» перестаёт значить «сходится»; для знакопеременных работает [[kriteriy-koshi-dlya-integrala|критерий Коши]]. По соглашению [[priznak-i-svoystvo|признак = достаточное условие]].`,
		related: ['etalonnyy-integral', 'asimptoticheskiy-priznak', 'kriteriy-koshi-dlya-integrala', 'priznak-i-svoystvo']
	},

	'asimptoticheskiy-priznak': {
		id: 'asimptoticheskiy-priznak',
		term: 'Асимптотический признак',
		short: String.raw`Сравнение отношением: $f\in O(g)$, то есть $\lim f/g = k<\infty$.`,
		formula: String.raw`f,g\ge0,\ \ \lim_{x\to\infty}\frac{f(x)}{g(x)}=k<\infty:\quad \int_a^{\infty}g\ \text{сх.}\Rightarrow\int_a^{\infty}f\ \text{сх.}`,
		body: String.raw`Теорема 23 списка. Формулируется на языке [[asimptoticheskie-klassy|классов асимптотик]] первого семестра, где $f\in O(g)$ определено через существование предела отношения — это уже, чем стандартное определение через неравенства.

Доказательство короткое: берём $\varepsilon=1$, получаем порог $M$ с $f<(k+1)g$ при $x>M$, и применяем [[priznak-sravneniya-integralov|признак сравнения]] на хвосте (кусок $[a;M]$ конечен и на сходимость не влияет). ⚠️ Вывод «сходятся одновременно» верен только при $k\ne0$, то есть при $f\in\Theta(g)$: для $f=1/x^2$, $g=1/x$ отношение стремится к нулю, а интегралы ведут себя по-разному.`,
		related: ['priznak-sravneniya-integralov', 'asimptoticheskie-klassy', 'etalonnyy-integral']
	},

	'kriteriy-koshi-dlya-integrala': {
		id: 'kriteriy-koshi-dlya-integrala',
		term: 'Критерий Коши для интеграла',
		short: String.raw`Хвостовые куски малы: $|\int_{A_1}^{A_2}f|<\varepsilon$ при $A_2>A_1>M$.`,
		formula: String.raw`\int_a^{\infty}f\ \text{сх.}\iff\forall\varepsilon>0\ \exists M\ \forall A_2>A_1>M:\ \Bigl|\int_{A_1}^{A_2}f\Bigr|<\varepsilon`,
		body: String.raw`Перенос понятия [[skhodyashchayasya-v-sebe|сходящейся в себе]] последовательности на функцию $F(A)=\int_a^{A}f$: разность $F(A_2)-F(A_1)$ — это в точности $\int_{A_1}^{A_2}f$, а полнота $\mathbb R$ превращает фундаментальность в сходимость.

Главное достоинство — независимость от знака $f$: там, где [[priznak-sravneniya-integralov|сравнение]] неприменимо, работает критерий. На нём стоит доказательство теоремы «[[absolyutno-shodyashchiysya-integral|абсолютная сходимость]] влечёт сходимость», где порог берётся у модуля без всякого дробления $\varepsilon$: $M_f(\varepsilon)=M_{|f|}(\varepsilon)$.`,
		related: ['absolyutno-shodyashchiysya-integral', 'skhodyashchayasya-v-sebe', 'skhodimost-nesobstvennogo-integrala', 'priznak-sravneniya-integralov']
	},

	'absolyutno-shodyashchiysya-integral': {
		id: 'absolyutno-shodyashchiysya-integral',
		term: 'Абсолютно сходящийся интеграл',
		short: String.raw`Сходится вместе с модулем; влечёт обычную сходимость, но не наоборот.`,
		formula: String.raw`\int_a^{\infty}|f|\ \text{сх.}\ \Rightarrow\ \int_a^{\infty}f\ \text{сх.},\qquad \Bigl|\int_a^{\infty}f\Bigr|\le\int_a^{\infty}|f|`,
		body: String.raw`Интеграл называется абсолютно сходящимся, если сходится $\int|f|$. Конспект даёт определение сразу двумя строками — для $\int|f|$ и для $\sum|f_n|$: ряд и интеграл здесь один объект.

Теорема 24 списка: абсолютная сходимость влечёт сходимость. Доказательство — [[kriteriy-koshi-dlya-integrala|критерий Коши]] плюс оценка $|\int f|\le\int|f|$; альтернатива — разложение $f^{\pm}=\frac{|f|\pm f}{2}$ и два сравнения. По соглашению [[priznak-i-svoystvo|признак/свойство]] это именно **признак** сходимости: достаточное условие, не необходимое, — обратное опровергает [[uslovno-shodyashchiysya-integral|условная сходимость]].`,
		related: ['uslovno-shodyashchiysya-integral', 'kriteriy-koshi-dlya-integrala', 'integral-dirihle', 'priznak-i-svoystvo']
	},

	'uslovno-shodyashchiysya-integral': {
		id: 'uslovno-shodyashchiysya-integral',
		term: 'Условно сходящийся интеграл',
		short: String.raw`Сам сходится, а интеграл модуля расходится.`,
		formula: String.raw`\int_a^{\infty}f\ \text{— сх.},\qquad \int_a^{\infty}|f|\ \text{— расх.}`,
		body: String.raw`Интеграл сходится условно, если он сходится, а $\int|f|$ — нет. ⚠️ В конспекте (стр. 5) выписана только первая половина условия: «$\int f$ — сх., $\sum f_n$ — сх.», а расходимость модуля заменена рисунком затухающей знакопеременной функции с заштрихованными отрицательными площадями. Вторую половину надо дописывать.

Эталонный пример — [[integral-dirihle|интеграл Дирихле]] $\int_1^\infty\frac{\sin x}{x}dx$. Механизм всегда один: положительные и отрицательные горбы гасят друг друга, а модуль это гашение запрещает. Отсюда и практическое следствие: сумма условно сходящегося ряда зависит от порядка слагаемых.`,
		related: ['absolyutno-shodyashchiysya-integral', 'integral-dirihle', 'garmonicheskiy-ryad']
	},

	'integralnyy-kriteriy-koshi': {
		id: 'integralnyy-kriteriy-koshi',
		term: 'Интегральный критерий Коши',
		short: String.raw`Для убывающей $f\ge0$ ряд $\sum f(n)$ и $\int_1^\infty f$ сходятся вместе.`,
		formula: String.raw`f\ge0\ \text{не возрастает на }[1;+\infty):\quad \int_1^{\infty}f(x)\,dx\ \text{сх.}\iff\sum_{n=1}^{\infty}f(n)\ \text{сх.}`,
		body: String.raw`Теорема 25 списка и мост между несобственными интегралами и рядами. Доказательство — зажатие: из $f(n+1)\le f(x)\le f(n)$ на $[n;n+1]$ суммированием получается $S_{N+1}-f(1)\le\int_1^{N+1}f\le S_N$, и дальше обе стороны решает «монотонна и ограничена».

⚠️ В конспекте (стр. 7) условия записаны как «монотонно убыв. неотриц. определённая функция»: не указана область $[1;+\infty)$, опущены пределы интегрирования и не потребована интегрируемость на каждом отрезке (она следует из монотонности через [[nepravilnaya-mera-nol|меру нуль]], но ссылку надо проговорить). Без монотонности теорема ложна: у $f=\sin^2(\pi x)$ ряд сходится, а интеграл — нет.`,
		related: ['etalonnyy-integral', 'ryad-dirihle', 'chastichnaya-summa', 'nepravilnaya-mera-nol']
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
		body: String.raw`Контрпример, показывающий необратимость теоремы «[[absolyutno-shodyashchiysya-integral|абсолютная сходимость]] влечёт сходимость». Сходимость доказывается интегрированием по частям: $\int_1^{A}\frac{\sin x}{x}dx=\cos1-\frac{\cos A}{A}-\int_1^{A}\frac{\cos x}{x^{2}}dx$, где последний интеграл сходится абсолютно по мажоранте $x^{-2}$.

Расходимость модуля — оценкой по промежуткам длины $\pi$: $\int_{\pi k}^{\pi(k+1)}\frac{|\sin x|}{x}dx\ge\frac{2}{\pi(k+1)}$, а сумма таких оценок — [[garmonicheskiy-ryad|гармонический ряд]]. Значит сходимость [[uslovno-shodyashchiysya-integral|условная]]; численно $\int_1^\infty\frac{\sin x}{x}dx\approx0{,}62471$, а $\int_1^{A}\frac{|\sin x|}{x}dx$ растёт как $\frac{2}{\pi}\ln A$.`,
		related: ['uslovno-shodyashchiysya-integral', 'absolyutno-shodyashchiysya-integral', 'garmonicheskiy-ryad']
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
		formula: String.raw`S_N=\sum_{k=1}^{N}f_k,\qquad \sum_{n=1}^{\infty}f_n\ \text{сх.}:\ \exists\lim_{N\to\infty}S_N\in\mathbb R`,
		body: String.raw`Сумма первых $N$ членов; сходимость ряда — это по определению существование конечного предела последовательности $S_N$. Дискретный двойник функции $F(A)=\int_a^{A}f$, и именно из-за этого параллелизма курс выписывает признаки сразу для $\sum$ и для $\int$.

В доказательстве [[integralnyy-kriteriy-koshi|интегрального критерия]] обе частичные суммы работают границами коридора: $S_{N+1}-f(1)\le\int_1^{N+1}f\le S_N$, а их разность телескопируется в $f(1)-f(N+1)\le f(1)$ — ряд и интеграл не могут разойтись больше чем на одно число.`,
		related: ['skhodimost-nesobstvennogo-integrala', 'integralnyy-kriteriy-koshi', 'neobhodimoe-uslovie-shodimosti']
	},

	'neobhodimoe-uslovie-shodimosti': {
		id: 'neobhodimoe-uslovie-shodimosti',
		term: 'Необходимое условие сходимости ряда',
		short: String.raw`У сходящегося ряда $f_n\to0$; обратное неверно.`,
		formula: String.raw`\sum_{n=1}^{\infty}f_n\ \text{сх.}\ \Rightarrow\ \lim_{n\to\infty}f_n=0`,
		body: String.raw`Если ряд сходится, его члены стремятся к нулю: $f_n=S_n-S_{n-1}\to S-S=0$. По соглашению курса [[priznak-i-svoystvo|признак/свойство]] это **свойство** сходящегося ряда, а не признак — необходимое условие, а не достаточное. Отсюда и правильное название: «необходимый признак» из учебников в терминологии преподавателя читается как свойство.

Работает только на расходимость: если $f_n\not\to0$, ряд расходится (так закрывается случай $p\le0$ у [[ryad-dirihle|ряда Дирихле]]). Обратной импликации нет — контрпример [[garmonicheskiy-ryad|гармонический ряд]].`,
		related: ['chastichnaya-summa', 'ryad-dirihle', 'garmonicheskiy-ryad', 'priznak-i-svoystvo']
	}
};
