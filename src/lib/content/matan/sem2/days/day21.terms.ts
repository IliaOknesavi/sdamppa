import type { Glossary } from '$lib/types';

// =====================================================================
//  Термины дня 21 (семестр 2): внесение под дифференциал и по частям.
//  Карточки прошлых дней, на которые день ссылается (первообразная,
//  определённый и неопределённый интеграл, Ньютон–Лейбниц, Барроу,
//  правило Лейбница, цепное правило, дифференциал), продублированы
//  намеренно — день должен резолвиться независимо от соседей.
//  Канонический глоссарий склеивается последним и перекрывает дубли.
// =====================================================================

export const day21Terms: Glossary = {
	'differencialnaya-forma': {
		id: 'differencialnaya-forma',
		term: 'Дифференциальная форма под интегралом',
		short: String.raw`Выражение $f(x)\,dx$ — единый объект, а не «функция плюс хвостик».`,
		formula: String.raw`\omega=f(x)\,dx=dF,\qquad F'=f`,
		body: String.raw`Под знаком интеграла стоит не функция, а выражение $f\,dx$, которое переписывается по правилам дифференцирования: $\varphi'(x)\,dx=d\varphi(x)$. Это и легализует [[vnesenie-pod-differencial|внесение под дифференциал]] и перенос $d$ с одного множителя на другой в [[integrirovanie-po-chastyam|интегрировании по частям]]. Запись $\int_a^b f\,dx=\int_{F(a)}^{F(b)}dF$ из [[teorema-barrou|теоремы Барроу]] — первый пример такой переписи; в $\mathbb R^n$ отсюда вырастает [[formula-stoksa|формула Стокса]].`,
		related: ['differencial', 'vnesenie-pod-differencial', 'integrirovanie-po-chastyam', 'teorema-barrou']
	},

	biekciya: {
		id: 'biekciya',
		term: 'Биекция',
		short: String.raw`Взаимно однозначное соответствие: у каждой точки образа один прообраз.`,
		formula: String.raw`\psi:\ I\to J\ \text{биекция}\iff\exists\psi^{-1}:\ J\to I`,
		body: String.raw`Отображение биективно, если оно инъективно (разные точки — разные образы) и сюръективно (образ заполняет всё $J$); тогда у него есть обратное. В обратной подстановке $x=\psi(t)$ ([[zamena-peremennoy|замена переменной]]) биективность обязательна: без неё в [[neopredelennyy-integral|неопределённом интеграле]] не вернуться к $x$, а в определённом неоднозначны новые пределы. Прямому [[vnesenie-pod-differencial|внесению под дифференциал]] она не нужна вовсе — там $\varphi$ вольна ходить туда-обратно.`,
		related: ['zamena-peremennoy', 'vnesenie-pod-differencial', 'pereschet-predelov']
	},

	'vnesenie-pod-differencial': {
		id: 'vnesenie-pod-differencial',
		term: 'Внесение под дифференциал',
		short: String.raw`Свернуть $\varphi'(x)\,dx$ в $d\varphi(x)$ и перейти к $t=\varphi(x)$.`,
		formula: String.raw`\int f(\varphi(x))\,\varphi'(x)\,dx=\Bigl(\int f(t)\,dt\Bigr)\Big|_{t=\varphi(x)}`,
		body: String.raw`В подынтегральном выражении узнаётся множитель $\varphi'(x)\,dx$, он сворачивается в [[differencial|дифференциал]] $d\varphi(x)$, после чего $\varphi(x)$ объявляется новой переменной. Доказывается одной строкой через [[cepnoe-pravilo|цепное правило]]: если $F'=f$, то $(F\circ\varphi)'=f(\varphi)\varphi'$, то есть $F\circ\varphi$ и есть искомая [[pervoobraznaya|первообразная]]. Ни монотонности, ни обратимости $\varphi$ не требуется — это отличает прямую подстановку от обратной.`,
		related: ['zamena-peremennoy', 'cepnoe-pravilo', 'pereschet-predelov', 'differencial']
	},

	'zamena-peremennoy': {
		id: 'zamena-peremennoy',
		term: 'Замена переменной в интеграле',
		short: String.raw`Прямая $t=\varphi(x)$ или обратная $x=\psi(t)$ подстановка.`,
		formula: String.raw`x=\psi(t),\quad dx=\psi'(t)\,dt`,
		body: String.raw`Общая операция, частным случаем которой является [[vnesenie-pod-differencial|внесение под дифференциал]]. **Прямая** подстановка $t=\varphi(x)$ идёт изнутри наружу и не требует обратимости. **Обратная** подстановка $x=\psi(t)$ с $dx=\psi'(t)\,dt$ требует, чтобы $\psi$ была биекцией нужного промежутка: иначе в [[neopredelennyy-integral|неопределённом интеграле]] не вернуться к $x$, а в определённом неоднозначны новые пределы. В $\mathbb R^n$ множитель $\psi'$ сменяется якобианом $|J|$ (дни 23–24).`,
		related: ['vnesenie-pod-differencial', 'pereschet-predelov', 'neopredelennyy-integral']
	},

	'pereschet-predelov': {
		id: 'pereschet-predelov',
		term: 'Пересчёт пределов интегрирования',
		short: String.raw`Новые пределы — образы старых: $\varphi(a)$ и $\varphi(b)$.`,
		formula: String.raw`\int_a^b f(\varphi(x))\varphi'(x)\,dx=\int_{\varphi(a)}^{\varphi(b)}f(t)\,dt`,
		body: String.raw`В [[opredelennyy-integral|определённом интеграле]] после замены к старой переменной возвращаться не нужно: достаточно заменить пределы их образами. Доказательство — двукратное применение [[teorema-nyutona-leybnica|формулы Ньютона–Лейбница]] к $F\circ\varphi$ и к $F$. Монотонность $\varphi$ не нужна: важны только значения на концах, поэтому $\int_{-1}^{1}xe^{-x^2}dx$ при $t=x^2$ честно превращается в $\tfrac12\int_1^1 e^{-t}dt=0$. Частая ошибка — сменить переменную и оставить старые пределы: либо пределы пересчитаны, либо сделан возврат к $x$, смешивать нельзя.`,
		related: ['vnesenie-pod-differencial', 'teorema-nyutona-leybnica', 'opredelennyy-integral']
	},

	'integrirovanie-po-chastyam': {
		id: 'integrirovanie-po-chastyam',
		term: 'Интегрирование по частям',
		short: String.raw`Перекладывает производную с одного множителя на другой.`,
		formula: String.raw`\int u\,dv=uv-\int v\,du,\qquad \int_a^b u\,dv=uv\Big|_a^b-\int_a^b v\,du`,
		body: String.raw`Доказывается интегрированием тождества [[pravilo-leybnica|правила Лейбница]] $(uv)'=u'v+uv'$ по $[a,b]$: слева первообразная известна и даёт $uv\big|_a^b$ по [[teorema-nyutona-leybnica|формуле Ньютона–Лейбница]], справа работает линейность интеграла. Формула ничего не упрощает сама по себе — она переносит производную с $u$ на $v$; выигрыш есть, если дифференцирование обедняет $u$, а интегрирование не портит $dv$. Выбор множителей — по правилу [[pravilo-liatl|ЛИАТЭ]].`,
		related: ['pravilo-leybnica', 'teorema-nyutona-leybnica', 'pravilo-liatl', 'ciklicheskiy-integral']
	},

	'pravilo-liatl': {
		id: 'pravilo-liatl',
		term: 'Правило ЛИАТЭ (выбор u и dv)',
		short: String.raw`Порядок приоритета для $u$ — ЛИАТЭ: логарифм, инверсные (обратные тригонометрические), алгебраические, тригонометрические, экспонента.`,
		body: String.raw`Мнемоника приоритета при [[integrirovanie-po-chastyam|интегрировании по частям]]: за $u$ берут функцию, стоящую в списке левее, остаток объявляют $dv$. Смысл порядка — «что сильнее упрощается при дифференцировании»: логарифм превращается в дробь, арктангенс — в рациональную дробь, многочлен теряет степень, а синус и экспонента не меняются вовсе. Отсюда $u=x^8$ в $\int x^8e^x dx$ и $u=\arctan4x$ в $\int\arctan4x\,dx$ (там $dv=dx$). Когда оба множителя стационарны, правило бессильно — работает [[ciklicheskiy-integral|циклический приём]].`,
		related: ['integrirovanie-po-chastyam', 'ciklicheskiy-integral', 'pervoobraznaya']
	},

	'ciklicheskiy-integral': {
		id: 'ciklicheskiy-integral',
		term: 'Циклический интеграл',
		short: String.raw`Двукратное по частям возвращает исходный интеграл — решаем уравнение.`,
		formula: String.raw`I=A+kI,\ k\neq1\ \Longrightarrow\ I=\frac{A}{1-k}`,
		body: String.raw`Случай, когда ни один множитель не упрощается: $\int e^{\alpha x}\cos\beta x\,dx$, $\int e^{\alpha x}\sin\beta x\,dx$. Два применения [[integrirovanie-po-chastyam|формулы по частям]] (на обоих шагах за $u$ берётся один и тот же тип функции — сменив выбор, вернёмся к тождеству $I=I$) дают линейное уравнение относительно самого интеграла. Ответ: $\int e^{\alpha x}\cos\beta x\,dx=\frac{e^{\alpha x}(\alpha\cos\beta x+\beta\sin\beta x)}{\alpha^2+\beta^2}+C$; система вырождается только при $\alpha=\beta=0$.`,
		related: ['integrirovanie-po-chastyam', 'pravilo-liatl', 'neopredelennyy-integral']
	},

	'differencial': {
		id: 'differencial',
		term: 'Дифференциал',
		short: String.raw`$d\varphi(x)=\varphi'(x)\,dx$ — то, что стоит под знаком интеграла.`,
		formula: String.raw`d\varphi(x)=\varphi'(x)\,dx`,
		body: String.raw`Дифференциал функции класса $C^1$ — линейная по приращению часть её изменения; в записи интеграла это и есть объект, стоящий после подынтегральной функции. [[teorema-barrou|Теорема Барроу]] переписывает $\int_a^b f\,dx$ как $\int_{F(a)}^{F(b)}dF$, а вся техника дня 21 состоит в переписывании дифференциальной формы — [[vnesenie-pod-differencial|внесении под дифференциал]] и переносе $d$ с одного множителя на другой.`,
		related: ['vnesenie-pod-differencial', 'teorema-barrou', 'integrirovanie-po-chastyam']
	},

	'cepnoe-pravilo': {
		id: 'cepnoe-pravilo',
		term: 'Цепное правило',
		short: String.raw`Производная композиции: $(F\circ\varphi)'=F'(\varphi)\cdot\varphi'$.`,
		formula: String.raw`\bigl(F(\varphi(x))\bigr)'_x=F'(\varphi(x))\cdot\varphi'(x)`,
		body: String.raw`Правило дифференцирования сложной функции в [[end-r|$\operatorname{End}(\mathbb R)$]]. Вместе с [[pravilo-leybnica|правилом Лейбница]] оно исчерпывает способы собрать составную функцию: перемножение и подстановка. Прочитанное справа налево, цепное правило превращается в теорему о [[vnesenie-pod-differencial|внесении под дифференциал]] — ровно как правило Лейбница превращается в [[integrirovanie-po-chastyam|интегрирование по частям]]. Отсюда и вывод: базовых приёмов интегрирования ровно два.`,
		related: ['vnesenie-pod-differencial', 'pravilo-leybnica', 'differencial']
	},

	'pravilo-leybnica': {
		id: 'pravilo-leybnica',
		term: 'Правило Лейбница',
		short: String.raw`$(uv)'=u'v+uv'$ — производная произведения.`,
		formula: String.raw`(uv)'=u'v+uv'`,
		body: String.raw`Производная произведения (день 2). Пара «линейность плюс тождество Лейбница» характеризует дифференцирование алгебраически — как оператор, не опираясь на предел разностного отношения. Проинтегрировав это тождество по отрезку и применив [[teorema-nyutona-leybnica|формулу Ньютона–Лейбница]], получаем [[integrirovanie-po-chastyam|интегрирование по частям]].`,
		related: ['integrirovanie-po-chastyam', 'cepnoe-pravilo', 'teorema-nyutona-leybnica']
	},

	'pervoobraznaya': {
		id: 'pervoobraznaya',
		term: 'Первообразная',
		short: String.raw`$F$ — первообразная $f$, если $F'=f$ (при $f\in C^0[a,b]$).`,
		formula: String.raw`F'(x)=f(x)`,
		body: String.raw`$F$ есть первообразная непрерывной $f$, если $F'=f$. Первообразные образуют не просто семейство $F+C$, а класс в фактор-пространстве по константам: $\rho(x^2+4;x^2)=\|(x^2+4)-x^2\|=0$, то есть $\|C\|_C=0$. Поэтому любое равенство [[neopredelennyy-integral|неопределённых интегралов]] — равенство классов, и два ответа, различающиеся на константу, считаются одним.`,
		related: ['neopredelennyy-integral', 'teorema-nyutona-leybnica', 'teorema-barrou']
	},

	'neopredelennyy-integral': {
		id: 'neopredelennyy-integral',
		term: 'Неопределённый интеграл',
		short: String.raw`Класс первообразных $F(x)+C$ данной функции.`,
		formula: String.raw`\int f(x)\,dx=F(x)+C`,
		body: String.raw`$\int f(x)\,dx=F(x)+C$, где $F$ — любая [[pervoobraznaya|первообразная]] $f$. Это класс, а не отдельная функция: равенство неопределённых интегралов есть равенство классов по модулю констант. Практическое следствие для дня 21: ответ обязан быть выражен через исходную переменную $x$, а не через введённую заменой $t$.`,
		related: ['pervoobraznaya', 'opredelennyy-integral', 'zamena-peremennoy']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Предел интегральных сумм при стремлении ранга разбиения к нулю.`,
		formula: String.raw`\int_a^b f(x)\,dx=\lim_{\lambda_R\to0}\sum_i f(\xi_i)\,\lambda_i`,
		body: String.raw`Предел интегральных сумм $I(f,\lambda,\vec\xi)=\sum_i f(\xi_i)\lambda_i$ при стремлении [[rang-razbieniya|ранга разбиения]] $\lambda_R$ к нулю; отрезок $[a,b]$ при этом вводится как [[lsk|ЛСК]]. Свойства, которыми пользуется день 21: линейность, аддитивность $\int_a^b+\int_b^c=\int_a^c$ и смена пределов $\int_a^b=-\int_b^a$. Вычисляется же он не по определению, а по [[teorema-nyutona-leybnica|формуле Ньютона–Лейбница]].`,
		related: ['rang-razbieniya', 'lsk', 'teorema-nyutona-leybnica', 'neopredelennyy-integral']
	},

	'teorema-nyutona-leybnica': {
		id: 'teorema-nyutona-leybnica',
		term: 'Теорема Ньютона–Лейбница',
		short: String.raw`$F(x)=\int_a^x f$ даёт $F'=f$, откуда $\int_a^b f=F(b)-F(a)$.`,
		formula: String.raw`\int_a^b f(t)\,dt=F(b)-F(a),\qquad F'(x)=f(x)`,
		body: String.raw`Содержательная часть — пункт 1: интеграл с переменным верхним пределом $F(x)=\int_a^x f(t)\,dt$ дифференцируем и $F'(x_0)=f(x_0)$; доказывается зажатием $\int_{x_0}^{x_0+h}f$ между $h(f(x_0)\pm\varepsilon)$ с явным порядком кванторов. Пункт 2 — равенство $\int_a^b f=F(b)-F(a)$ для произвольной [[pervoobraznaya|первообразной]] $F$ — следует из первого: две первообразные одной функции отличаются на константу, а она при подстановке концов сокращается. Обе теоремы дня 21 опираются на эту: она превращает «найти первообразную» в «подставить концы».`,
		related: ['pervoobraznaya', 'opredelennyy-integral', 'teorema-barrou', 'pereschet-predelov']
	},

	'teorema-barrou': {
		id: 'teorema-barrou',
		term: 'Теорема Барроу',
		short: String.raw`Переход к интегралу по дифференциалу первообразной.`,
		formula: String.raw`\int_a^b f\,dx=\int_{F(a)}^{F(b)}dF=F(b)-F(a)`,
		body: String.raw`Теоремой Барроу называют запись $\int_a^b f\,dx=\int_{F(a)}^{F(b)}dF$ при $dF=F'(x)\,dx$ и $F'=f$. Для дня 21 важен сам ход: интеграл переписывается через [[differencial|дифференциал]] [[pervoobraznaya|первообразной]], и тем самым легализуется работа с подынтегральной формой — [[vnesenie-pod-differencial|внесение под дифференциал]] есть продолжение той же идеи.`,
		related: ['pervoobraznaya', 'differencial', 'teorema-nyutona-leybnica', 'vnesenie-pod-differencial']
	}
};
