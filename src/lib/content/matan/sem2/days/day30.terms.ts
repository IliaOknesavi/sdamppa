import type { Glossary } from '$lib/types';

// Термины дня 30 (длина кривой, метрико-зависимость, производная вдоль кривой).
// Понятия сквозной нотации живут в каноническом глоссарии
// (sem2/glossary.ts и sem1/glossary.ts) и здесь НЕ дублируются — на них идут
// только перекрёстные ссылки [[...]]: metriki-rho, skalyarnoe-pole, braket,
// lsk, rang-razbieniya, klassy-differenciruemosti, nepravilnaya-mera-nol,
// n-nol-n-odin, asimptoticheskie-klassy, priznak-i-svoystvo, end-r, lvtnp.
// Канонический глоссарий склеивается последним и перекрывает совпадения,
// поэтому одноимённые карточки заводить нельзя.
// Карточка ravnomernaya-shodimost намеренно продублирована из дня 29, чтобы
// день резолвился независимо.
export const day30Terms: Glossary = {
	'differencial-dliny-dugi': {
		id: 'differencial-dliny-dugi',
		term: 'Дифференциал длины дуги dℓ',
		short: String.raw`Гипотенуза треугольника с катетами $dx$ и $df$.`,
		formula: String.raw`d\ell=\sqrt{df^2+dx^2}=\sqrt{(f'dx)^2+dx^2}=dx\sqrt{1+f'^2}`,
		body: String.raw`Базовый объект темы: на бесконечно малом участке кривая заменяется гипотенузой прямоугольного треугольника с катетами $dx$ и $df=f'dx$. Длина вводится так «физически», через предельный треугольник, а не через супремум длин вписанных ломаных.

Интеграл от $d\ell$ и есть [[dlina-krivoy|длина кривой]]; для пространственной кривой $d\ell$ обобщается до нормы приращения радиус-вектора, откуда получается [[dlina-v-proizvolnoy-metrike|формула длины в произвольной метрике]].`,
		related: ['dlina-krivoy', 'dlina-v-proizvolnoy-metrike', 'naturalnyy-parametr', 'proizvodnaya-vdol-krivoy']
	},

	'dlina-krivoy': {
		id: 'dlina-krivoy',
		term: 'Длина кривой',
		short: String.raw`Интеграл от дифференциала дуги: $L=\int_a^b\sqrt{1+f'^2}\,dx$.`,
		formula: String.raw`L=\int_a^b\sqrt{1+f'(x)^2}\,dx`,
		body: String.raw`Формула возникает как интеграл от [[differencial-dliny-dugi|$d\ell$]]: прямая $y=x$ даёт $\sqrt2(b-a)$, четверть окружности — $\frac\pi2$.

Вывод: вписываем ломаную, звено $\sqrt{\Delta x^2+\Delta f^2}$ по теореме Лагранжа равно $\Delta x\sqrt{1+f'(\xi)^2}$, сумма звеньев — интегральная сумма, предел при [[rang-razbieniya|ранге разбиения]] $\to0$ — интеграл. Молчаливое требование $f\in C^1([a;b])$ существенно: вне этого класса длина определяется через [[spryamlyaemaya-krivaya|спрямляемость]], а формула с производной к ней уже неприменима.`,
		related: ['differencial-dliny-dugi', 'dlina-v-proizvolnoy-metrike', 'spryamlyaemaya-krivaya', 'parametrizaciya-krivoy']
	},

	'dlina-v-proizvolnoy-metrike': {
		id: 'dlina-v-proizvolnoy-metrike',
		term: 'Длина в произвольной метрике',
		short: String.raw`$L_\rho=\int\|\dot{\vec r}\|dt$ — у каждой линейки своя длина.`,
		formula: String.raw`L_\rho=\int_a^b\bigl\|\dot{\vec r}(t)\bigr\|\,dt,\qquad L_{\rho_k}=\int_a^b\Bigl(\sum_i|\dot x_i|^k\Bigr)^{1/k}dt`,
		body: String.raw`Длина считается не только в евклидовой метрике: линейкой может служить любая из [[metriki-rho|$\rho_1,\rho_2,\rho_k,\rho_\infty$]], и результат от неё зависит.

«Произвольная» здесь означает «порождённая нормой»: в доказательстве нужны сдвиговая инвариантность (чтобы свести $\rho$ к норме приращения) и положительная однородность (чтобы вынести $\Delta t$ из-под нормы). Для дискретной метрики формулы нет вовсе — там длина любой невырожденной кривой бесконечна. Одна четверть окружности даёт три числа: $\sqrt2$ в $\rho_\infty$, $\frac\pi2$ в $\rho_2$, $2$ в [[manhettenskaya-dlina|$\rho_1$]].`,
		related: ['manhettenskaya-dlina', 'dlina-krivoy', 'ekvivalentnost-norm', 'parametrizaciya-krivoy']
	},

	'manhettenskaya-dlina': {
		id: 'manhettenskaya-dlina',
		term: 'Манхэттенская длина (ρ₁)',
		short: String.raw`Складываются модули приращений: $L_{\rho_1}=\int(1+|f'|)\,dx$.`,
		formula: String.raw`L_{\rho_1}=\int_a^b\bigl(|dx|+|df|\bigr)=\int_a^b\bigl(1+|f'(x)|\bigr)dx`,
		body: String.raw`Длина в метрике [[metriki-rho|$\rho_1$]]: катеты складываются, гипотенуза не берётся. У **монотонной** кривой она равна $|\Delta x|+|\Delta y|$ и от формы не зависит вовсе — такси едет по катетам. Для четверти единичной окружности $L_{\rho_1}=1+1=2$.

Модули здесь обязательны, и по отдельности: величина $\int|f'+1|\,dx$ манхэттенской длиной не является. Функция $\|(u,v)\|=|u+v|$ обращается в нуль на направлении $(1,-1)$, то есть это полунорма, а не норма; её интеграл равен [[variaciya-funkcii|вариации]] функции $x+f(x)$ — длине тени кривой на диагонали. Для четверти окружности она равна $2\sqrt2-2\approx0{,}83$, а не $2$.`,
		related: ['dlina-v-proizvolnoy-metrike', 'variaciya-funkcii', 'lestnichnyy-paradoks', 'ekvivalentnost-norm']
	},

	'spryamlyaemaya-krivaya': {
		id: 'spryamlyaemaya-krivaya',
		term: 'Спрямляемая кривая',
		short: String.raw`Конечен супремум длин вписанных ломаных.`,
		formula: String.raw`L_\rho(\vec r)=\sup_{\lambda}\sum_i\rho\bigl(\vec r(t_i),\vec r(t_{i+1})\bigr)<\infty`,
		body: String.raw`Определение Жордана: длина задаётся супремумом по всем разбиениям, а не пределом, и кривая спрямляема, если супремум конечен. Плюсы такого подхода: работает в любом метрическом пространстве, не требует производной и автоматически не зависит от [[parametrizaciya-krivoy|параметризации]] (измельчение разбиения сумму только увеличивает).

Связь с формулой через производную: график спрямляем $\iff$ $f$ имеет ограниченную [[variaciya-funkcii|вариацию]]. Контрпример, которого формула $\int\sqrt{1+f'^2}$ не видит: $f(x)=x\sin\frac1x$ непрерывна на $[0;1]$, но не спрямляема.`,
		related: ['variaciya-funkcii', 'dlina-krivoy', 'parametrizaciya-krivoy']
	},

	'variaciya-funkcii': {
		id: 'variaciya-funkcii',
		term: 'Вариация функции',
		short: String.raw`Супремум сумм модулей приращений; конечна — ограниченная вариация.`,
		formula: String.raw`V_a^b(f)=\sup_{\lambda}\sum_i\bigl|f(x_{i+1})-f(x_i)\bigr|`,
		body: String.raw`Полная вариация — «сколько функция суммарно набегает вверх и вниз», супремум по всем разбиениям отрезка. Через неё формулируется [[spryamlyaemaya-krivaya|спрямляемость]]: в $\mathbb R^2$ выполнено $\max(b-a,\,V_a^b(f))\le L\le (b-a)+V_a^b(f)$.

Для $f\in C^1$ вариация считается интегралом $V_a^b(f)=\int_a^b|f'|\,dx$ — и тогда [[manhettenskaya-dlina|манхэттенская длина]] графика есть в точности $(b-a)+V_a^b(f)$. У монотонной функции вариация равна $|f(b)-f(a)|$, поэтому $\rho_1$-длина монотонной кривой зависит только от концов.`,
		related: ['spryamlyaemaya-krivaya', 'manhettenskaya-dlina', 'rang-razbieniya']
	},

	'parametrizaciya-krivoy': {
		id: 'parametrizaciya-krivoy',
		term: 'Параметризация кривой',
		short: String.raw`Непрерывное $\vec r:[a;b]\to\mathbb R^n$; длина от выбора параметра не зависит.`,
		formula: String.raw`\vec r(t)=\bigl(x_1(t),\dots,x_n(t)\bigr),\qquad t\in[a;b]`,
		body: String.raw`Кривая — это отображение, а не множество точек: одну и ту же дугу можно пробежать по-разному. Длина при монотонной гладкой замене параметра не меняется — в интеграле $\int\|\dot{\vec r}\|dt$ замена переменной сокращает $\frac{dt}{ds}$ с якобианом.

График функции — частный случай: $\vec r(x)=(x,f(x))$, параметром служит сама абсцисса. Поэтому тождественную координату выписывают явно, $(x'_x)^2=1$, — чтобы формула [[dlina-v-proizvolnoy-metrike|длины]] читалась параметрически однородно, как $\int\sqrt{\dot x^2+\dot y^2+\dot z^2}\,dt$. Каноническая параметризация — [[naturalnyy-parametr|натуральная]].`,
		related: ['naturalnyy-parametr', 'dlina-krivoy', 'spryamlyaemaya-krivaya', 'dlina-v-proizvolnoy-metrike']
	},

	'naturalnyy-parametr': {
		id: 'naturalnyy-parametr',
		term: 'Натуральный параметр',
		short: String.raw`Параметр — сама длина дуги; тогда $\|d\vec r/d\ell\|\equiv1$.`,
		formula: String.raw`\ell(t)=\int_a^t\bigl\|\dot{\vec r}(\tau)\bigr\|\,d\tau,\qquad \Bigl\|\frac{d\vec r}{d\ell}\Bigr\|=1`,
		body: String.raw`Если за параметр взять накопленную длину, скорость становится единичной, а [[differencial-dliny-dugi|дифференциал дуги]] — просто $d\ell$. В этом параметре пространственная длина кривой на поверхности $z=f(x,y)$ сворачивается в одномерную формулу $L=\int\sqrt{1+(f(\vec\ell)'_{\vec\ell})^2}\,d\ell$ — ровно ради этого [[proizvodnaya-vdol-krivoy|производная вдоль кривой]] нормируется на $d\ell$, а не на $dx$.

Практическое эхо: перепараметризация сплайна по длине дуги — обязательный этап в компьютерной графике и ЧПУ, иначе инструмент движется по кривой с переменной скоростью.`,
		related: ['parametrizaciya-krivoy', 'differencial-dliny-dugi', 'proizvodnaya-vdol-krivoy', 'krivolineynyy-integral']
	},

	'proizvodnaya-vdol-krivoy': {
		id: 'proizvodnaya-vdol-krivoy',
		term: 'Производная вдоль кривой',
		short: String.raw`Приращение поля, делённое на $d\ell$: направление берётся у кривой.`,
		formula: String.raw`f(\vec\ell)'_{\vec\ell}=\lim_{d\ell\to0}\frac{f(x+dx,\,y+dy)-f(x,y)}{\sqrt{dx^2+dy^2}}=\frac{f'_x+f'_y\,\ell'}{\sqrt{1+\ell'^2}}`,
		body: String.raw`Определение дано **в дифференциалах**: отдельного единичного вектора направления нет, направление берёт сама кривая $y=\ell(x)$, а нормировка спрятана в знаменателе $d\ell$. Развернув $df=f'_xdx+f'_y\ell'dx$ и сократив $dx$, получаем обычную производную по направлению единичного касательного вектора, то есть [[braket|скалярное произведение]] $\langle\nabla f\mid\vec e\rangle$ с $\vec e=\frac{(1,\ell')}{\sqrt{1+\ell'^2}}$.

Знаменатель $\sqrt{dx^2+dy^2}$ — это $\rho_2$: производная вдоль кривой метрико-зависима так же, как длина. В $\rho_1$ та же конструкция даёт $\frac{f'_x+f'_y\ell'}{1+|\ell'|}$.`,
		related: ['naturalnyy-parametr', 'differencial-dliny-dugi', 'braket', 'skalyarnoe-pole']
	},

	'lestnichnyy-paradoks': {
		id: 'lestnichnyy-paradoks',
		term: 'Парадокс лестницы',
		short: String.raw`$\gamma_N\rightrightarrows\gamma$, но $L(\gamma_N)\equiv2\ne\pi/2=L(\gamma)$.`,
		formula: String.raw`\lim_{N\to\infty}L_{\rho_2}(\gamma_N)=2\ \ne\ \frac\pi2=L_{\rho_2}\Bigl(\lim_{N\to\infty}\gamma_N\Bigr)`,
		body: String.raw`Школьное «доказательство $\pi=4$»: вписанная в четверть окружности лестница сходится к дуге равномерно, а её евклидова длина при любом числе ступенек равна $2$. Причина — длина зависит не от $f$, а от $f'$: [[ravnomernaya-shodimost|равномерная сходимость]] самих функций про производные не говорит ничего, поэтому предельный переход под интегралом незаконен. Остаётся лишь полунепрерывность снизу: $L(\lim\gamma_N)\le\liminf L(\gamma_N)$.

В [[manhettenskaya-dlina|$\rho_1$]] парадокс исчезает: и лестница, и дуга имеют длину $2$. Значит «$\pi=4$» — не парадокс, а подмена линейки.`,
		related: ['ravnomernaya-shodimost', 'manhettenskaya-dlina', 'dlina-v-proizvolnoy-metrike']
	},

	'ravnomernaya-shodimost': {
		id: 'ravnomernaya-shodimost',
		term: 'Равномерная сходимость',
		short: String.raw`Один номер $N(\varepsilon)$ сразу на все $x$: $f_n\rightrightarrows f$.`,
		formula: String.raw`f_n\rightrightarrows f:\ \forall\varepsilon>0\ \exists N(\varepsilon)\ \forall n>N\ \forall x\in[a;b]:\ |f_n(x)-f(x)|<\varepsilon`,
		body: String.raw`Отличие от поточечной сходимости — в порядке кванторов: номер $N$ выбирается до $x$, а не после, то есть один на весь отрезок. Определение переводится на язык метрических пространств: вводится метрика на функциях $\rho(f_1,f_2)=\max_{x\in[a;b]}|f_1-f_2|$, и равномерная сходимость становится обычной сходимостью в этом метрическом пространстве, а «коридор шириной $\varepsilon$» — шаром $B_\varepsilon(f)$.

Возникает она как ответ на вопрос «когда $\lim\int=\int\lim$». Для длины кривой её недостаточно — см. [[lestnichnyy-paradoks|парадокс лестницы]].`,
		related: ['lestnichnyy-paradoks', 'metriki-rho', 'dlina-krivoy']
	},

	'ekvivalentnost-norm': {
		id: 'ekvivalentnost-norm',
		term: 'Эквивалентность норм',
		short: String.raw`$\|v\|_\infty\le\|v\|_2\le\|v\|_1$ — и то же неравенство для длин.`,
		formula: String.raw`\|\vec v\|_\infty\le\|\vec v\|_2\le\|\vec v\|_1\le\sqrt n\,\|\vec v\|_2\le n\,\|\vec v\|_\infty`,
		body: String.raw`В конечномерном пространстве любые две нормы отличаются не более чем в константу раз, поэтому все [[metriki-rho|метрики $\rho_k$]] порождают одну топологию — сходимость, открытость и компактность от выбора линейки не зависят.

А вот **длина** зависит: интегрирование сохраняет поточечное неравенство норм, значит $L_{\rho_\infty}\le L_{\rho_2}\le L_{\rho_1}\le n\,L_{\rho_\infty}$, но равенства нет. На четверти окружности это $\sqrt2<\frac\pi2<2$. Отсюда правило: топологические выводы переносятся между метриками свободно, метрические (длина, площадь, норма ошибки) — нет.`,
		related: ['dlina-v-proizvolnoy-metrike', 'manhettenskaya-dlina', 'metriki-rho']
	},

	'krivolineynyy-integral': {
		id: 'krivolineynyy-integral',
		term: 'Криволинейный интеграл',
		short: String.raw`$\int_\Gamma f\,d\ell$ — интеграл по кривой с мерой $d\ell$.`,
		formula: String.raw`\int_{\Gamma}f\,d\ell=\int_a^b f\bigl(\vec r(t)\bigr)\,\bigl\|\dot{\vec r}(t)\bigr\|\,dt`,
		body: String.raw`Прямое продолжение темы длины. Интеграл I рода получается, если под знак суммы поставить поле: [[differencial-dliny-dugi|$d\ell$]] работает мерой на кривой, и $\int_\Gamma f\,d\ell$ считает массу проволоки переменной плотности; при $f\equiv1$ он даёт [[dlina-krivoy|длину]].

Интеграл II рода $\int_\Gamma P\,dx+Q\,dy=\int\langle\vec F\mid d\vec r\rangle$ — работа поля вдоль пути; под интегралом там стоит [[proizvodnaya-vdol-krivoy|производная вдоль кривой]]. Дальше идут формулы Грина и Стокса, связывающие интеграл по кривой с кратным интегралом по области.`,
		related: ['differencial-dliny-dugi', 'dlina-krivoy', 'naturalnyy-parametr', 'proizvodnaya-vdol-krivoy']
	}
};
