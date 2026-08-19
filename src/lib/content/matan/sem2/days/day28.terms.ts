import type { Glossary } from '$lib/types';

// Термины дня 28 (признак Куммера и его частные случаи: Раабе, Бертран, Гаусс).
// Общие понятия нотации живут в каноническом глоссарии (sem2/glossary.ts) и
// здесь НЕ дублируются — на них идут только перекрёстные ссылки [[...]]:
// priznak-i-svoystvo, asimptoticheskie-klassy, blacksquare. Канонический
// глоссарий склеивается последним и перекрывает совпадения, поэтому
// одноимённые карточки заводить нельзя.
// Карточки garmonicheskiy-ryad, ryad-dirihle и chastichnaya-summa намеренно
// продублированы из дня 26, чтобы день резолвился независимо; тексты дописаны
// так, чтобы обслуживать оба дня.
export const day28Terms: Glossary = {
	'priznak-kummera': {
		id: 'priznak-kummera',
		term: 'Признак Куммера',
		short: String.raw`Общая схема всех признаков по отношению $a_n/a_{n+1}$; настраивается выбором $C_n$.`,
		formula: String.raw`K_n=C_n\frac{a_n}{a_{n+1}}-C_{n+1}:\qquad K_n\ge k>0\ (n>N)\Rightarrow\text{сх.};\qquad K_n\le0\ (n>N)\Rightarrow\text{расх.}`,
		body: String.raw`Для ряда $\sum a_n$ с $a_n>0$ и [[posledovatelnost-kummera|последовательности Куммера]] $\{C_n\}$ строится величина $K_n$; отделённость $K_n$ от нуля снизу даёт сходимость, неположительность — расходимость.

Доказательство идёт через $d_n=C_na_n$: домножение на $a_{n+1}$ даёт $K_na_{n+1}=d_n-d_{n+1}$, дальше [[teleskopicheskaya-otsenka|телескоп]] и оценка $d_{M+1}>0$ на сходимость, монотонность $d_n$ и сравнение с $\sum 1/C_n$ на расходимость. Условие распадается надвое: положительность $C_n$ держит первую половину, расходимость $\sum1/C_n$ — вторую. Все именные признаки дня — подстановки в $K_n$, см. [[ierarhiya-priznakov|иерархию]].`,
		related: ['posledovatelnost-kummera', 'ierarhiya-priznakov', 'teleskopicheskaya-otsenka', 'priznak-raabe']
	},

	'posledovatelnost-kummera': {
		id: 'posledovatelnost-kummera',
		term: 'Последовательность Куммера',
		short: String.raw`Положительный набор $C_n$ с расходящимся $\sum 1/C_n$ — линейка признака.`,
		formula: String.raw`C_n>0\ \ \forall n,\qquad \sum_{n}\frac{1}{C_n}\ \ \text{— расх.}`,
		body: String.raw`Настройка [[priznak-kummera|признака Куммера]]. Требований ровно два, и каждое обслуживает свою половину теоремы: положительность нужна для сходящейся, расходимость $\sum1/C_n$ — для расходящейся.

Смысл второго требования содержательный: $\frac{1}{C_n}$ — эталон, с которым сравнивается $a_n$, и чем медленнее расходится $\sum\frac{1}{C_n}$, тем более узкую щель различает признак. Отсюда шкала $C_n=1,\ n,\ n\ln n,\ n\ln n\ln\ln n,\dots$ — каждый следующий эталон расходится ленивее предыдущего. Выбор со сходящимся $\sum1/C_n$ (например $C_n=n^2$) признак не портит, но делает его немым на расходимость.`,
		related: ['priznak-kummera', 'ierarhiya-priznakov', 'garmonicheskiy-ryad', 'ryad-bertrana']
	},

	'priznak-raabe': {
		id: 'priznak-raabe',
		term: 'Признак Раабе',
		short: String.raw`Куммер при $C_n=n$: решает $\lim R_n$ относительно единицы, при $R_n\to1$ молчит.`,
		formula: String.raw`R_n=n\Bigl(\frac{a_n}{a_{n+1}}-1\Bigr),\qquad K_n\big|_{C_n=n}=R_n-1`,
		body: String.raw`Подстановка $C_n=n$ в [[priznak-kummera|выражение Куммера]] даёт точное тождество $K_n=R_n-1$ (прибавили и вычли $n$), а допустимость обеспечивает расходимость [[garmonicheskiy-ryad|гармонического ряда]]. Отсюда: $\varliminf R_n>1$ — сходимость, $\varlimsup R_n<1$ — расходимость.

Случай $\lim R_n=1$ неразрешим в принципе: у всего семейства $\sum\frac{1}{n\ln^p n}$ ([[ryad-bertrana|ряд Бертрана]]) выходит $R_n=1+\frac{p}{\ln n}+O(\frac1n)\to1$ и при тех $p$, где ряд сходится, и при тех, где расходится. Ради этой дыры вводятся [[priznak-bertrana|Бертран]] и [[priznak-gaussa|Гаусс]].`,
		related: ['priznak-kummera', 'priznak-bertrana', 'priznak-gaussa', 'garmonicheskiy-ryad']
	},

	'priznak-bertrana': {
		id: 'priznak-bertrana',
		term: 'Признак Бертрана',
		short: String.raw`Куммер при $C_n=n\ln n$: домножает разность $R_n-1$ на $\ln n$ и видит следующий этаж.`,
		formula: String.raw`B_n=\ln n\,\Bigl(n\Bigl(\frac{a_n}{a_{n+1}}-1\Bigr)-1\Bigr),\qquad K_n\big|_{C_n=n\ln n}=B_n-1-\frac{1}{2n}+O(n^{-2})`,
		body: String.raw`Подстановка $C_n=n\ln n$ в [[priznak-kummera|выражение Куммера]] с разложением $(n+1)\ln(1+\frac1n)=1+\frac{1}{2n}+O(n^{-2})$ даёт $K_n=B_n-1+o(1)$, поэтому $\varliminf B_n>1$ — сходимость, $\varlimsup B_n<1$ — расходимость. Лицензия на такой $C_n$: положительность при $n\ge2$ и расходимость $\sum\frac{1}{n\ln n}$, доказанная интегральным критерием в дне 26.

На эталоне $\sum\frac{1}{n\ln^p n}$ выходит $B_n\to p$, то есть порог $p>1$ воспроизводится точно. Собственная слепая зона — $p=1$: там $B_n\to1$, и ответ даёт лишь следующий этаж с $C_n=n\ln n\ln\ln n$.`,
		related: ['priznak-kummera', 'priznak-raabe', 'ryad-bertrana', 'ierarhiya-priznakov']
	},

	'priznak-gaussa': {
		id: 'priznak-gaussa',
		term: 'Признак Гаусса',
		short: String.raw`Ответ читается с двух коэффициентов разложения $a_n/a_{n+1}$, включая случай $\beta=1$.`,
		formula: String.raw`\frac{a_n}{a_{n+1}}=\alpha+\frac{\beta}{n}+O\Bigl(\frac{1}{n^{1+\delta}}\Bigr),\ \delta>0:\quad \alpha>1\ \text{сх.};\ \alpha<1\ \text{расх.};\ \alpha=1:\ \beta>1\ \text{сх.},\ \beta\le1\ \text{расх.}`,
		body: String.raw`Признак, закрывающий дыру $\lim R_n=1$ у [[priznak-raabe|Раабе]]. Доказательство — спуск по [[ierarhiya-priznakov|иерархии]]: при $\alpha\ne1$ работает [[priznak-dalambera|Д'Аламбер]] ($\frac{a_{n+1}}{a_n}\to\frac1\alpha$), при $\alpha=1,\beta\ne1$ — Раабе ($R_n\to\beta$), а критический случай $\alpha=1,\beta=1$ даёт $B_n\to0<1$, то есть расходимость по [[priznak-bertrana|Бертрану]].

Удобная частная форма — нормированная запись $\frac{a_n}{a_{n+1}}=1+\frac{\beta}{n}+\frac{\gamma_n}{n^{2}}$ с ограниченной $\{\gamma_n\}$: это общая форма при $\alpha=1$, $\delta=1$. Гаусс не сильнее Бертрана: у него своя слепая зона — ряды с членом $\frac{p}{n\ln n}$ в разложении.`,
		related: ['priznak-raabe', 'priznak-bertrana', 'gipergeometricheskiy-ryad', 'ierarhiya-priznakov']
	},

	'ierarhiya-priznakov': {
		id: 'ierarhiya-priznakov',
		term: 'Иерархия признаков сходимости',
		short: String.raw`Д'Аламбер ⊂ Раабе ⊂ Бертран — три подстановки в одну куммеровскую схему.`,
		formula: String.raw`C_n\equiv1\Rightarrow K_n=\frac{a_n}{a_{n+1}}-1;\qquad C_n=n\Rightarrow K_n=R_n-1;\qquad C_n=n\ln n\Rightarrow K_n=B_n-1+o(1)`,
		body: String.raw`Все именные признаки дня получаются подстановкой $\{C_n\}$ в [[priznak-kummera|выражение Куммера]], а не доказываются по отдельности. Цепочка усилений строгая на этой тройке: из $\varliminf R_n>1$ следует $B_n\to+\infty$, из $\varlimsup R_n<1$ — $B_n\to-\infty$, поэтому Бертран отвечает всюду, где ответил Раабе, а Раабе — всюду, где Д'Аламбер. Общего правила «медленнее расходящийся эталон $\Rightarrow$ сильнее признак» нет: эталон $\frac{1}{C_n}$ задаёт лишь масштаб различаемой щели.

Цепочка не задаёт линейного порядка по всем признакам дня. [[radikalnyy-priznak-koshi|Радикальный Коши]] в неё не входит: он строится по $\sqrt[n]{a_n}$ и с Раабе несравним в обе стороны. [[priznak-gaussa|Гаусс]] — не следующий этаж, а удобная форма для рядов с полиномиальным отношением. Лестница бесконечна: у каждого $C_n$ своя слепая зона $K_n\to0^{+}$.`,
		related: ['priznak-kummera', 'priznak-dalambera', 'priznak-bertrana', 'radikalnyy-priznak-koshi']
	},

	'priznak-dalambera': {
		id: 'priznak-dalambera',
		term: "Признак Д'Аламбера",
		short: String.raw`Куммер при $C_n\equiv1$: сравнение с геометрической прогрессией.`,
		formula: String.raw`\frac{a_{n+1}}{a_n}\le q<1\ (n>N)\Rightarrow\text{сх.};\qquad \frac{a_{n+1}}{a_n}\ge1\ (n>N)\Rightarrow\text{расх.}`,
		body: String.raw`Нижний этаж [[ierarhiya-priznakov|иерархии]]. Подстановка $C_n\equiv1$ в [[priznak-kummera|выражение Куммера]] даёт $K_n=\frac{a_n}{a_{n+1}}-1$, и условие $K_n\ge k>0$ равносильно $\frac{a_{n+1}}{a_n}\le\frac{1}{1+k}<1$, а $K_n\le0$ — неубыванию членов. Допустимость очевидна: $\sum1$ расходится.

Немеет ровно при $\frac{a_n}{a_{n+1}}\to1$, то есть при $K_n\to0$: там нет ни отделённости от нуля, ни неположительности. Равносильная запись — через обратное отношение $x_n=\frac{a_n}{a_{n+1}}$: условие сходимости принимает вид $x_n\ge c>1$, и порог переходит из $q<1$ в $c=\frac1q>1$.`,
		related: ['priznak-kummera', 'ierarhiya-priznakov', 'priznak-raabe', 'radikalnyy-priznak-koshi']
	},

	'radikalnyy-priznak-koshi': {
		id: 'radikalnyy-priznak-koshi',
		term: 'Радикальный признак Коши',
		short: String.raw`Сравнение с прогрессией по корню $\sqrt[n]{a_n}$; при $L=1$ ответа нет.`,
		formula: String.raw`L=\lim_{n\to\infty}\sqrt[n]{a_n}:\qquad L<1\Rightarrow\text{сх.};\qquad L>1\Rightarrow\text{расх.};\qquad L=1\Rightarrow\ \text{?}`,
		body: String.raw`Разбирается в дне 27. Доказательство — зажатие между геометрическими прогрессиями: из $|\sqrt[n]{a_n}-L|<\varepsilon$ следует $(L-\varepsilon)^n<a_n<(L+\varepsilon)^n$, и знаменатель $q$ подбирается между $L$ и единицей.

Стоит рядом с куммеровской вертикалью, но в неё не входит: он смотрит на корень, а не на отношение $\frac{a_n}{a_{n+1}}$, и с [[priznak-raabe|Раабе]] несравним. Пример $\sum\frac{2+(-1)^n}{2^n}$: корень стремится к $\frac12$ и всё решает, а отношение прыгает между $\frac16$ и $\frac32$, так что молчат и [[priznak-dalambera|Д'Аламбер]], и Раабе. Обратный пример — $\sum\frac{1}{n^2}$, где корень даёт ровно $1$.`,
		related: ['priznak-dalambera', 'priznak-raabe', 'ierarhiya-priznakov', 'ryad-dirihle']
	},

	'gipergeometricheskiy-ryad': {
		id: 'gipergeometricheskiy-ryad',
		term: 'Гипергеометрический ряд',
		short: String.raw`Отношение — дробь двух многочленов; сходится ровно при $c>a+b$.`,
		formula: String.raw`u_1=1,\ \ \frac{u_{n+1}}{u_n}=\frac{(n+a)(n+b)}{(n+c)(n+1)}\ \Longrightarrow\ \sum u_n\ \text{сх.}\iff c>a+b`,
		body: String.raw`Пробный камень для всех признаков дня. Отношение стремится к единице, поэтому [[priznak-dalambera|Д'Аламбер]] молчит; зато развёрнутая дробь даёт разложение $\frac{u_n}{u_{n+1}}=1+\frac{c+1-a-b}{n}+O(n^{-2})$, то есть [[priznak-gaussa|Гаусс]] с $\alpha=1$, $\beta=c+1-a-b$, и критерий $c>a+b$ читается прямо с коэффициентов.

Граница $c=a+b$ даёт $\beta=1$ — критический случай, где [[priznak-raabe|Раабе]] бессилен, а ответ (расходимость) приходит от Бертрана. Пример: $a=b=1$, $c=2$ даёт $u_n=\frac{2}{n+1}$; $a=b=1$, $c=3$ даёт $u_n=\frac{6}{(n+1)(n+2)}$ с суммой $3$. Через такие ряды выражаются биномиальный ряд, многочлены Лежандра и функции Бесселя.`,
		related: ['priznak-gaussa', 'priznak-raabe', 'priznak-dalambera', 'garmonicheskiy-ryad']
	},

	'teleskopicheskaya-otsenka': {
		id: 'teleskopicheskaya-otsenka',
		term: 'Телескопическая оценка',
		short: String.raw`Сумма разностей соседних членов сворачивается в разность концов.`,
		formula: String.raw`\sum_{n=N+1}^{M}\bigl(d_n-d_{n+1}\bigr)=d_{N+1}-d_{M+1}`,
		body: String.raw`Рабочий приём доказательства [[priznak-kummera|признака Куммера]]: величина $d_n=C_na_n$ подобрана так, что $K_na_{n+1}=d_n-d_{n+1}$, и суммирование слева сворачивается в два крайних члена. Дальше положительность $d_{M+1}$ превращает телескоп в оценку [[chastichnaya-summa|частичных сумм]] сверху числом $\frac{d_{N+1}}{k}$.

Именно ради телескопа в $K_n$ стоит смещённый индекс $C_{n+1}$: с одинаковым $C_n$ в обоих слагаемых остаётся $C_n(a_n-a_{n+1})$, сумма не сворачивается, и соседние члены гасят друг друга только при $C_n=C_{n+1}$. Тот же приём в дискретном варианте — преобразование Абеля (день 27), где сворачиваются разности $b_{k+1}-b_k$.`,
		related: ['priznak-kummera', 'chastichnaya-summa', 'posledovatelnost-kummera']
	},

	'ryad-bertrana': {
		id: 'ryad-bertrana',
		term: 'Ряд Бертрана',
		short: String.raw`$\sum 1/(n\ln^p n)$ — эталон, на котором Раабе слеп, а Бертран видит $p$.`,
		formula: String.raw`\sum_{n=2}^{\infty}\frac{1}{n\ln^{p}n}\ \text{сх.}\iff p>1,\qquad R_n=1+\frac{p}{\ln n}+O\bigl(\tfrac1n\bigr),\qquad B_n\to p`,
		body: String.raw`Порог доказан интегральным критерием в дне 26 заменой $z=\ln x$. Для теории признаков этот ряд — главный тестовый объект: его отношение равно $1+\frac1n+\frac{p}{n\ln n}+O(n^{-2})$, поэтому [[priznak-raabe|Раабе]] при любом $p$ упирается в $R_n\to1$ и молчит, а [[priznak-bertrana|Бертран]] выдаёт ровно $p$.

Случай $p=1$ работает дважды: ряд $\sum\frac{1}{n\ln n}$ расходится, и именно это делает $C_n=n\ln n$ допустимой [[posledovatelnost-kummera|последовательностью Куммера]]; он же — слепая зона самого Бертрана ($B_n\to1$). Член $\frac{p}{n\ln n}$ не укладывается в форму $O(n^{-1-\delta})$, поэтому [[priznak-gaussa|Гаусс]] на этот ряд не распространяется.`,
		related: ['priznak-bertrana', 'priznak-raabe', 'posledovatelnost-kummera', 'ryad-dirihle']
	},

	'ryad-dirihle': {
		id: 'ryad-dirihle',
		term: 'Ряд Дирихле',
		short: String.raw`$\sum 1/n^p$; сходится ровно при $p>1$ — линейка для всех сравнений.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac{1}{n^{p}}\ \text{сх.}\iff p>1,\qquad R_n=p+O\bigl(\tfrac1n\bigr)`,
		body: String.raw`Обобщённый гармонический ряд; порог $p>1$ получен в дне 26 интегральным критерием и совпадает с порогом эталонного интеграла $\int_1^\infty x^{-p}dx$. Случай $p=1$ — [[garmonicheskiy-ryad|гармонический ряд]], в область сходимости не входит; при $p\le0$ члены не стремятся к нулю.

Для признаков дня 28 это первый тест: $\frac{a_n}{a_{n+1}}=(1+\frac1n)^p=1+\frac{p}{n}+O(n^{-2})$, значит [[priznak-raabe|Раабе]] даёт $R_n\to p$ и решает всё, кроме $p=1$, а [[priznak-gaussa|Гаусс]] читает тот же ответ прямо с коэффициента $\beta=p$. [[priznak-dalambera|Д'Аламбер]] и [[radikalnyy-priznak-koshi|радикальный Коши]] на нём молчат: оба дают ровно $1$.`,
		related: ['garmonicheskiy-ryad', 'priznak-raabe', 'ryad-bertrana', 'priznak-gaussa']
	},

	'garmonicheskiy-ryad': {
		id: 'garmonicheskiy-ryad',
		term: 'Гармонический ряд',
		short: String.raw`$\sum 1/n$ расходится, хотя члены стремятся к нулю.`,
		formula: String.raw`\sum_{n=1}^{\infty}\frac1n=+\infty,\qquad \sum_{k=1}^{n}\frac1k=\ln n+O(1)`,
		body: String.raw`Случай $p=1$ [[ryad-dirihle|ряда Дирихле]] и главный контрпример к обратной импликации в необходимом условии: члены стремятся к нулю, а ряд расходится. Интегральный критерий (день 26) доказывает это одной строкой: $\int_1^{\infty}\frac{dx}{x}=\ln x\big|_1^{\infty}=+\infty$.

В теме признаков у него служебная роль: именно расходимость $\sum\frac1n$ делает $C_n=n$ допустимой [[posledovatelnost-kummera|последовательностью Куммера]], без чего не было бы [[priznak-raabe|признака Раабе]]. Асимптотика $\sum_{k\le n}\frac1k=\ln n+O(1)$ используется дальше в оценках расходящейся половины Бертрана и в стандартных оценках сложности алгоритмов.`,
		related: ['ryad-dirihle', 'posledovatelnost-kummera', 'priznak-raabe', 'ryad-bertrana']
	},

	'chastichnaya-summa': {
		id: 'chastichnaya-summa',
		term: 'Частичная сумма ряда',
		short: String.raw`$S_N=\sum_{k=1}^{N}a_k$; ряд сходится, если существует $\lim S_N$.`,
		formula: String.raw`S_N=\sum_{k=1}^{N}a_k,\qquad \sum_{n=1}^{\infty}a_n\ \text{сх.}:\ \exists\lim_{N\to\infty}S_N\in\mathbb R`,
		body: String.raw`Сумма первых $N$ членов; сходимость ряда — по определению существование конечного предела последовательности $S_N$. Дискретный двойник функции $F(A)=\int_a^{A}f$: из-за этого параллелизма признаки сходимости для $\sum$ и для $\int$ формулируются одинаково.

Для ряда с положительными членами $S_N$ не убывает, поэтому вопрос сходимости сводится к ограниченности сверху — на этом стоит сходящаяся половина [[priznak-kummera|признака Куммера]]: [[teleskopicheskaya-otsenka|телескоп]] даёт оценку $S_{M+1}-S_{N+1}\le\frac{C_{N+1}a_{N+1}}{k}$, равномерную по $M$. Тот же ход обслуживал зажатие в интегральном критерии дня 26.`,
		related: ['priznak-kummera', 'teleskopicheskaya-otsenka', 'ryad-dirihle']
	}
};
