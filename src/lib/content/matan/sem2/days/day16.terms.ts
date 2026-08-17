import type { Glossary } from '$lib/types';

// Термины дня 16 (обоснование метода Лагранжа через редукцию). День должен
// резолвиться независимо, поэтому опорные понятия — градиент, теорема Ферма
// для скалярных полей, теорема о неявной функции — продублированы здесь, даже
// если вводились в дни 10–15. НЕ дублируются термины канонического глоссария
// (glossary.ts семестров 1–2): braket, lvtnp, klassy-differenciruemosti,
// rang-razbieniya, lsk, nepravilnaya-mera-nol, n-nol-n-odin, dopolnenie,
// zamykanie, vykolotaya-okrestnost, komponenta-svyaznosti, metriki-rho, end-r,
// skalyarnoe-pole, lso, asimptoticheskie-klassy, skhodyashchayasya-v-sebe,
// chastichnaya-posledovatelnost, priznak-i-svoystvo, blacksquare — на них
// ссылаемся через [[...]].
export const day16Terms: Glossary = {
	'uslovnyy-ekstremum': {
		id: 'uslovnyy-ekstremum',
		term: 'Локальный условный экстремум',
		short: String.raw`Экстремум $f$ на пересечении окрестности с допустимым множеством.`,
		formula: String.raw`\forall\vec x\in U_{\vec x^{*}}\cap\mathcal D:\ f(\vec x)\ge f(\vec x^{\,*})`,
		body: String.raw`Точка $\vec x^{\,*}\in\mathcal D$ — **локальный условный минимум**, если в некоторой окрестности $U_{\vec x^{*}}$ выполнено $f(\vec x)\ge f(\vec x^{\,*})$ для всех допустимых соседей — точек $\vec x\in U_{\vec x^{*}}\cap\mathcal D$, где $\mathcal D$ есть [[dopustimoe-mnozhestvo|допустимое множество]]; для максимума — обратное неравенство.

Отличие от безусловного экстремума в одном: сравнение идёт только по допустимым соседям, поэтому [[gradient|градиент]] $\nabla f(\vec x^{\,*})$ вполне может быть ненулевым. В конспекте развёрнутого определения нет — только пометка «⋆ $x^*$ — локальный условный экстремум» перед необходимым условием.`,
		related: ['dopustimoe-mnozhestvo', 'mnozhiteli-lagranzha', 'redukciya', 'gradient']
	},

	'dopustimoe-mnozhestvo': {
		id: 'dopustimoe-mnozhestvo',
		term: 'Допустимое множество 𝒟',
		short: String.raw`Множество, где выполнены все связи: только там и ищут оптимум.`,
		formula: String.raw`\mathcal D=\lbrace\vec x\in\mathbb R^{n}:\ g_i(\vec x)=0,\ i=\overline{1,m}\rbrace`,
		body: String.raw`**Допустимое множество** $\mathcal D$ вырезается связями-равенствами $g_i(\vec x)=0$, $m\le n$. При выполненном [[uslovie-regulyarnosti|условии регулярности]] оно локально является гладкой поверхностью размерности $n-m$ — графиком неявной функции $\vec y=\varphi(\vec z)$.

Конспект тут же рассматривает и связи-неравенства $g_i\ge0$ (с рисунком заштрихованной области): тогда $\mathcal D$ — уже не поверхность, а область с границей, и равенственный метод Лагранжа к ней напрямую не применяется.`,
		related: ['uslovnyy-ekstremum', 'uslovie-regulyarnosti', 'kasatelnoe-podprostranstvo']
	},

	'funkciya-lagranzha': {
		id: 'funkciya-lagranzha',
		term: 'Функция Лагранжа',
		short: String.raw`$\mathcal L=f-\sum\lambda_i g_i$ — в курсе со знаком «минус».`,
		formula: String.raw`\mathcal L(\vec x,\vec\lambda)=f(\vec x)-\sum_{i=1}^{m}\lambda_i g_i(\vec x)`,
		body: String.raw`**Функция Лагранжа** упаковывает целевую функцию и связи в один объект. Необходимое условие условного экстремума равносильно $\nabla_{\vec x}\mathcal L(\vec x^{\,*},\vec\lambda^{\,*})=\vec 0$, а частные производные по множителям возвращают сами связи: $\partial\mathcal L/\partial\lambda_i=-g_i=0$. Итого $n+m$ уравнений на $n+m$ неизвестных.

⚠️ У преподавателя знак **минус**, в большинстве учебников пишут «$+$». Расхождение чисто знаковое ($\lambda_i\mapsto-\lambda_i$), но при сверке с литературой сбивает.`,
		related: ['mnozhiteli-lagranzha', 'uslovnyy-ekstremum', 'dostatochnoe-uslovie-uslovnogo-ekstremuma']
	},

	'mnozhiteli-lagranzha': {
		id: 'mnozhiteli-lagranzha',
		term: 'Множители Лагранжа',
		short: String.raw`Координаты $\nabla f$ в базисе градиентов связей — считаются, а не подбираются.`,
		formula: String.raw`\vec\lambda^{\,T}=\frac{\partial f}{\partial\vec y}\left(\frac{\partial\vec g}{\partial\vec y}\right)^{-1}`,
		body: String.raw`**Множители** $\lambda_i^{*}$ — коэффициенты разложения [[gradient|градиента]] $\nabla f(\vec x^{\,*})=\sum_i\lambda_i^{*}\nabla g_i(\vec x^{\,*})$. Вывод через [[redukciya|редукцию]] даёт для них явную формулу: $\vec\lambda^{\,T}$ есть строка $\partial f/\partial\vec y$, умноженная на обратную к матрице связей по зависимым переменным.

Смысл: $\lambda_i$ — координаты градиента цели в базисе градиентов связей, а при сдвиге связи $g_i=c_i$ ещё и производная оптимума $\partial f^{*}/\partial c_i$ («теневая цена»).`,
		related: ['funkciya-lagranzha', 'redukciya', 'rasshcheplenie-peremennyh', 'gradient']
	},

	'uslovie-regulyarnosti': {
		id: 'uslovie-regulyarnosti',
		term: 'Условие регулярности',
		short: String.raw`$\operatorname{rank}J=m$: градиенты связей линейно независимы.`,
		formula: String.raw`\operatorname{rank}\left(\frac{\partial g_i}{\partial x_j}\right)(\vec x^{\,*})=m\iff \det\frac{\partial\vec g}{\partial\vec y}\ne0`,
		body: String.raw`**Условие регулярности** требует, чтобы матрица Якоби связей $J=(\partial g_i/\partial x_j)$ имела полный ранг $m$ в исследуемой точке; равносильно — чтобы после [[rasshcheplenie-peremennyh|расщепления]] квадратная подматрица $\partial\vec g/\partial\vec y$ была невырождена. Только тогда работает [[teorema-o-neyavnoy-funkcii|теорема о неявной функции]] и законно обращение матрицы в выводе.

⚠️ В конспекте не сформулировано вовсе. Без него метод неверен: для $f=x$ при связи $y^{2}-x^{3}=0$ минимум есть в $(0,0)$, но там $\nabla g=\vec 0$ и разложения не существует.`,
		related: ['rasshcheplenie-peremennyh', 'teorema-o-neyavnoy-funkcii', 'mnozhiteli-lagranzha']
	},

	'rasshcheplenie-peremennyh': {
		id: 'rasshcheplenie-peremennyh',
		term: 'Расщепление переменных',
		short: String.raw`$\vec x=(\vec y,\vec z)$: $m$ зависимых переменных и $n-m$ свободных.`,
		formula: String.raw`\vec x=(\vec y,\vec z),\qquad \vec y\in\mathbb R^{m},\ \ \vec z\in\mathbb R^{\,n-m}`,
		body: String.raw`Координаты делят на две группы: $\vec y$ — **зависимые** (их ровно столько, сколько связей: каждая связь «съедает» одну степень свободы) и $\vec z$ — **свободные**, число которых $n-m$ и есть размерность [[dopustimoe-mnozhestvo|допустимого множества]].

Нумерацию выбирают так, чтобы выполнялось [[uslovie-regulyarnosti|условие регулярности]] $\det\frac{\partial\vec g}{\partial\vec y}\ne0$ — полнота ранга $J$ гарантирует, что подходящие $m$ столбцов найдутся. Именно по $\vec y$ разрешаются связи в [[redukciya|редукции]].`,
		related: ['uslovie-regulyarnosti', 'redukciya', 'reducirovannaya-funkciya']
	},

	redukciya: {
		id: 'redukciya',
		term: 'Редукция условной задачи',
		short: String.raw`Замена условной задачи безусловной подстановкой $\vec y=\varphi(\vec z)$.`,
		body: String.raw`**Редукция** — способ обосновать метод Лагранжа: [[rasshcheplenie-peremennyh|расщепить переменные]], разрешить связи по [[teorema-o-neyavnoy-funkcii|теореме о неявной функции]] как $\vec y=\varphi(\vec z)$, подставить в цель и получить [[reducirovannaya-funkciya|редуцированную функцию]] $F(\vec z)$ без всяких связей.

Дальше работает обычная [[teorema-ferma-pole|теорема Ферма]]: $\nabla F(\vec z^{\,*})=\vec 0$. Расписав это цепным правилом, получают и разложение $\nabla f$ по градиентам связей, и формулу для самих $\lambda_i$. В конспекте схема доведена лишь до определения $F$.`,
		related: ['reducirovannaya-funkciya', 'teorema-o-neyavnoy-funkcii', 'teorema-ferma-pole', 'mnozhiteli-lagranzha']
	},

	'reducirovannaya-funkciya': {
		id: 'reducirovannaya-funkciya',
		term: 'Редуцированная функция',
		short: String.raw`$F(\vec z)=f(\varphi(\vec z),\vec z)$ — цель как функция свободных переменных.`,
		formula: String.raw`F(\vec z)=f(\varphi(\vec z),\vec z),\qquad \vec z\in U(\vec z^{\,*})\subset\mathbb R^{\,n-m}`,
		body: String.raw`**Редуцированная (безусловная) функция** получается подстановкой неявно выраженных зависимых переменных в целевую: $F(\vec z)=f(\varphi(\vec z),\vec z)$. Связи в неё уже зашиты, поэтому $\vec z$ пробегает целую окрестность в $\mathbb R^{\,n-m}$ — задача стала безусловной.

Полезное тождество: вдоль графика все $g_i\equiv0$, поэтому $F$ совпадает там с [[funkciya-lagranzha|функцией Лагранжа]]: $F(\vec z)=\mathcal L(\varphi(\vec z),\vec z)$. Отсюда $d^{2}F$ есть сужение $d^{2}\mathcal L$ на [[kasatelnoe-podprostranstvo|касательное подпространство]].`,
		related: ['redukciya', 'funkciya-lagranzha', 'kasatelnoe-podprostranstvo', 'teorema-ferma-pole']
	},

	'teorema-o-neyavnoy-funkcii': {
		id: 'teorema-o-neyavnoy-funkcii',
		term: 'Теорема о неявной функции',
		short: String.raw`Связи разрешаются как $\vec y=\varphi(\vec z)$ при невырожденном якобиане.`,
		formula: String.raw`\exists!\ \varphi\in C^{k}(U):\ \varphi(\vec z^{\,*})=\vec y^{\,*},\ \ g_i(\varphi(\vec z),\vec z)\equiv 0`,
		body: String.raw`Пусть $g_i\in C^{k}$, $g_i(\vec y^{\,*},\vec z^{\,*})=0$ и $\det\frac{\partial\vec g}{\partial\vec y}\ne0$. Тогда существуют окрестности $U(\vec z^{\,*})$, $V(\vec y^{\,*})$ и **единственная** $\varphi:U\to V$ класса $C^{k}(U)$ с $\varphi(\vec z^{\,*})=\vec y^{\,*}$ и $g_i(\varphi(\vec z),\vec z)=0$ на всём $U$.

Второе равенство — тождество, и его дифференцирование даёт $\frac{\partial\varphi}{\partial\vec z}=-\bigl(\frac{\partial\vec g}{\partial\vec y}\bigr)^{-1}\frac{\partial\vec g}{\partial\vec z}$ — рабочую формулу [[redukciya|редукции]]. Условие невырожденности в конспекте опущено.`,
		related: ['uslovie-regulyarnosti', 'redukciya', 'reducirovannaya-funkciya', 'klassy-differenciruemosti']
	},

	'teorema-ferma-pole': {
		id: 'teorema-ferma-pole',
		term: 'Теорема Ферма в скалярных полях',
		short: String.raw`Во внутренней точке локального экстремума градиент равен нулю.`,
		formula: String.raw`\vec x^{\,*}\ \text{— внутр. точка лок. экстремума},\ \exists\nabla f(\vec x^{\,*})\ \Rightarrow\ \nabla f(\vec x^{\,*})=\vec 0`,
		body: String.raw`Многомерный двойник теоремы Ферма для [[skalyarnoe-pole|скалярных полей]]: если во внутренней точке локального экстремума все частные производные существуют, то все они равны нулю, то есть [[gradient|градиент]] обращается в ноль: $\nabla f(\vec x^{\,*})=\vec 0$. Доказывается покоординатно — сужением на прямую $x_j$ и применением одномерной теоремы.

В обосновании метода Лагранжа именно она завершает [[redukciya|редукцию]]: связи сняты, $F$ безусловна, значит $\nabla F(\vec z^{\,*})=\vec 0$. Обратное неверно — нулевой градиент даёт лишь подозрительную точку.`,
		related: ['gradient', 'redukciya', 'reducirovannaya-funkciya', 'skalyarnoe-pole']
	},

	'kasatelnoe-podprostranstvo': {
		id: 'kasatelnoe-podprostranstvo',
		term: 'Касательное подпространство',
		short: String.raw`Направления, вдоль которых можно двигаться, не покидая $\mathcal D$.`,
		formula: String.raw`T_{\vec x^{*}}=\lbrace\vec h\in\mathbb R^{n}:\ \langle\nabla g_i(\vec x^{\,*})\mid\vec h\rangle=0,\ i=\overline{1,m}\rbrace`,
		body: String.raw`**Касательное подпространство** к [[dopustimoe-mnozhestvo|допустимому множеству]] в точке $\vec x^{\,*}$ — общее ядро градиентов связей (скобка — [[braket|bra-ket]]). При [[uslovie-regulyarnosti|регулярности]] $\dim T=n-m$, а базис даёт матрица со столбцами $\bigl(\frac{\partial\varphi}{\partial\vec z};E\bigr)$.

Необходимое условие говорит ровно то, что $\nabla f(\vec x^{\,*})\perp T$, а [[dostatochnoe-uslovie-uslovnogo-ekstremuma|достаточное]] проверяет знак $d^{2}\mathcal L$ именно на $T$, а не во всём $\mathbb R^{n}$.`,
		related: ['dopustimoe-mnozhestvo', 'dostatochnoe-uslovie-uslovnogo-ekstremuma', 'okaymlennyy-gessian', 'braket']
	},

	'okaymlennyy-gessian': {
		id: 'okaymlennyy-gessian',
		term: 'Окаймлённый гессиан',
		short: String.raw`Гессиан $\mathcal L$, окаймлённый матрицей Якоби связей.`,
		formula: String.raw`\overline H=\begin{pmatrix}0&J\\ J^{T}&H(\mathcal L)\end{pmatrix},\qquad J=\left(\frac{\partial g_i}{\partial x_j}\right)`,
		body: String.raw`**Окаймлённый гессиан** — матрица размера $(n+m)\times(n+m)$, в которой гессиан [[funkciya-lagranzha|функции Лагранжа]] окаймлён матрицей Якоби связей. Он позволяет проверить знакоопределённость $d^{2}\mathcal L$ на [[kasatelnoe-podprostranstvo|касательном подпространстве]], не выписывая его базис явно.

Правило: смотрят угловые миноры $\Delta_k$ порядков $k=2m+1,\dots,n+m$. Все знаки $(-1)^{m}$ — минимум; чередование с $(-1)^{m+1}$ — максимум. При $n=2$, $m=1$: $\det\overline H<0$ — минимум, $>0$ — максимум.`,
		related: ['dostatochnoe-uslovie-uslovnogo-ekstremuma', 'kasatelnoe-podprostranstvo', 'funkciya-lagranzha']
	},

	'dostatochnoe-uslovie-uslovnogo-ekstremuma': {
		id: 'dostatochnoe-uslovie-uslovnogo-ekstremuma',
		term: 'Достаточное условие условного экстремума',
		short: String.raw`Знакоопределённость $d^{2}\mathcal L$ на $T$, а не во всём $\mathbb R^{n}$.`,
		formula: String.raw`d^{2}\mathcal L(\vec x^{\,*})[\vec h]>0\ \ \forall\vec h\in T_{\vec x^{*}}\setminus\lbrace\vec 0\rbrace\ \Rightarrow\ \text{строгий минимум}`,
		body: String.raw`Пусть $\vec x^{\,*}$ регулярна и удовлетворяет необходимому условию с множителями $\vec\lambda^{\,*}$. Если второй дифференциал [[funkciya-lagranzha|функции Лагранжа]] положительно определён на [[kasatelnoe-podprostranstvo|касательном подпространстве]] — строгий условный минимум; отрицательно определён — максимум; знакопеременен на $T$ — экстремума нет.

Берётся именно $\mathcal L$, а не $f$: только у неё градиент в $\vec x^{\,*}$ нулевой, и при дифференцировании тождества $F=\mathcal L\circ\vec x(\vec z)$ исчезает член со вторыми производными $\varphi$. ⚠️ В конспекте этого условия нет.`,
		related: ['funkciya-lagranzha', 'kasatelnoe-podprostranstvo', 'okaymlennyy-gessian', 'reducirovannaya-funkciya']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных скалярного поля.`,
		formula: String.raw`\nabla f=\left(\frac{\partial f}{\partial x_1},\ \dots,\ \frac{\partial f}{\partial x_n}\right)`,
		body: String.raw`**Градиент** [[skalyarnoe-pole|скалярного поля]] — вектор его частных производных. Через [[braket|bra-ket]] он задаёт производную по направлению: $f'_{\vec h}=\langle\nabla f\mid\vec h\rangle$, откуда и геометрия — направление наибыстрейшего роста, ортогональность линиям уровня.

В задаче на условный экстремум ортогональность работает дважды: $\nabla g_i$ ортогонален [[dopustimoe-mnozhestvo|допустимому множеству]], а $\nabla f(\vec x^{\,*})$ обязан быть ортогонален [[kasatelnoe-podprostranstvo|касательному подпространству]] — отсюда и разложение по градиентам связей.`,
		related: ['skalyarnoe-pole', 'braket', 'kasatelnoe-podprostranstvo', 'teorema-ferma-pole']
	}
};
