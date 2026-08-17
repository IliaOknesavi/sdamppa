import type { Glossary } from '$lib/types';

// Термины дня 5 (теоремы 5–8 списка семантических единиц: Ролль, Лагранж,
// Коши + лемма о монотонной функции). День должен резолвиться независимо,
// поэтому опорные понятия из прошлых дней — теорема Ферма, теорема
// Вейерштрасса, градиент, параметризация отрезка — продублированы здесь.
// НЕ дублируются термины канонического глоссария (sem2/glossary.ts и
// sem1/glossary.ts): braket, lvtnp, klassy-differenciruemosti,
// rang-razbieniya, lsk, nepravilnaya-mera-nol, n-nol-n-odin, dopolnenie,
// zamykanie, vykolotaya-okrestnost, komponenta-svyaznosti, metriki-rho,
// end-r, skalyarnoe-pole, lso, asimptoticheskie-klassy,
// skhodyashchayasya-v-sebe, chastichnaya-posledovatelnost,
// priznak-i-svoystvo, blacksquare — на них ссылаемся через [[...]].
export const day05Terms: Glossary = {
	'teorema-rollya': {
		id: 'teorema-rollya',
		term: 'Теорема Ролля',
		short: String.raw`Равные значения на концах ⟹ внутри есть точка с нулевой производной.`,
		formula: String.raw`f\in C^1([a,b]),\ f(a)=f(b)\ \Rightarrow\ \exists c\in(a,b):\ f'(c)=0`,
		body: String.raw`Первое звено цепочки теорем о среднем: из равенства значений на концах следует существование внутренней точки с горизонтальной касательной. Доказывается за два хода — [[teorema-veyershtrassa|Вейерштрасс]] даёт экстремумы на компакте, [[teorema-ferma|Ферма]] обнуляет в них производную. ⚠️ В конспекте (стр. 13–14) доказательства нет, теорема дана рисунком, а условие записано как $f\in C^1([a,b])$ — сильнее классического «непрерывна на $[a,b]$, дифференцируема на $(a,b)$».`,
		related: ['teorema-ferma', 'teorema-veyershtrassa', 'teorema-lagranzha', 'promezhutochnaya-tochka']
	},

	'teorema-lagranzha': {
		id: 'teorema-lagranzha',
		term: 'Теорема Лагранжа',
		short: String.raw`Приращение функции равно производной в средней точке на длину отрезка.`,
		formula: String.raw`f(b)-f(a)=f'(c)(b-a),\qquad c\in(a,b)`,
		body: String.raw`Теорема о конечных приращениях: наклон хорды хотя бы раз совпадает с наклоном касательной. Выводится из [[teorema-rollya|Ролля]] [[vspomogatelnaya-funkciya|вспомогательной функцией]] $\varphi(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a)$, у которой концы обнулены вычитанием хорды. Обратно, Ролль — частный случай Лагранжа при $f(a)=f(b)$. Из неё получаются [[monotonnost-i-proizvodnaya|лемма о монотонной функции]], [[lipshitsevost|липшицевость]] и остаток формулы Тейлора.`,
		related: ['teorema-rollya', 'formula-konechnyh-prirashcheniy', 'vspomogatelnaya-funkciya', 'monotonnost-i-proizvodnaya']
	},

	'formula-konechnyh-prirashcheniy': {
		id: 'formula-konechnyh-prirashcheniy',
		term: 'Формула конечных приращений',
		short: String.raw`Другое имя равенства Лагранжа: Δf = f′(c)·Δx с точкой c внутри.`,
		formula: String.raw`\frac{f(b)-f(a)}{b-a}=f'(c)\quad\Longleftrightarrow\quad \Delta f=f'(c)\,\Delta x`,
		body: String.raw`Так называют вывод [[teorema-lagranzha|теоремы Лагранжа]], когда его используют как расчётный инструмент: **конечное** приращение $\Delta f$ выражается точно, а не приближённо, — ценой того, что точка $c$ неизвестна. Отличие от дифференциала: $df=f'(x)\Delta x$ верно лишь с точностью до $\bar o(\Delta x)$, а здесь равенство точное. Практический режим применения — оценка сверху: $|\Delta f|\le\sup|f'|\cdot|\Delta x|$, откуда [[lipshitsevost|константа Липшица]].`,
		related: ['teorema-lagranzha', 'lipshitsevost', 'promezhutochnaya-tochka']
	},

	'teorema-koshi-o-srednem': {
		id: 'teorema-koshi-o-srednem',
		term: 'Теорема Коши о среднем',
		short: String.raw`Отношение приращений двух функций равно отношению их производных в одной точке.`,
		formula: String.raw`\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)},\qquad c\in(a,b),\ g'\ne0`,
		body: String.raw`Обобщённая теорема о среднем: хорда параметрической кривой $(g,f)$ параллельна касательной в некоторой точке. Доказывается через [[vspomogatelnaya-funkciya|вспомогательную]] $h(x)=(f(b)-f(a))(g(x)-g(a))-(g(b)-g(a))(f(x)-f(a))$ и [[teorema-rollya|Ролля]]. Ключевое: обе производные берутся в **одной** точке — делением двух [[teorema-lagranzha|Лагранжей]] этого не получить. При $g(x)=x$ вырождается в Лагранжа; служит основой правила Лопиталя.`,
		related: ['teorema-lagranzha', 'vspomogatelnaya-funkciya', 'teorema-rollya', 'promezhutochnaya-tochka']
	},

	'vspomogatelnaya-funkciya': {
		id: 'vspomogatelnaya-funkciya',
		term: 'Вспомогательная функция',
		short: String.raw`Приём: вычесть «эталон» так, чтобы попасть в условие доказанной теоремы.`,
		formula: String.raw`\varphi(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a),\qquad \varphi(a)=\varphi(b)=0`,
		body: String.raw`Сквозной приём всей темы: к функции подгоняют вычитаемое так, чтобы на концах отрезка получились равные значения, и применяют [[teorema-rollya|теорему Ролля]]. У [[teorema-lagranzha|Лагранжа]] вычитают хорду, у [[teorema-koshi-o-srednem|Коши]] — перекрёстную комбинацию $f$ и $g$, в формуле Тейлора — частичную сумму с подобранным коэффициентом $Q$. Каждый раз проверяются ровно две вещи: класс гладкости сохранился и $\varphi(a)=\varphi(b)$.`,
		related: ['teorema-rollya', 'teorema-lagranzha', 'teorema-koshi-o-srednem']
	},

	'monotonnost-i-proizvodnaya': {
		id: 'monotonnost-i-proizvodnaya',
		term: 'Лемма о монотонной функции',
		short: String.raw`f′ ≥ 0 ⟺ функция нестрого возрастает; f′ > 0 — только достаточное условие.`,
		formula: String.raw`f'\ge0\ \text{на}\ (a,b)\iff f\ \text{нестрого возрастает на}\ [a,b]`,
		body: String.raw`Теорема 9 официального списка. Нестрогая версия — [[priznak-i-svoystvo|критерий]] (в обе стороны), строгая ($f'>0\Rightarrow$ строгий рост) — только признак: $f=x^3$ строго возрастает при $f'(0)=0$. Прямая сторона доказывается [[teorema-lagranzha|Лагранжем]] на $[x_1,x_2]$, обратная — знаком разностного отношения. Отсюда же $f'\equiv0\iff f\equiv\mathrm{const}$. ⚠️ В конспектах курса леммы нет — пробел; читать Виноградова, гл. 3 § 7 (с. 171).`,
		related: ['teorema-lagranzha', 'teorema-ferma', 'priznak-i-svoystvo']
	},

	'teorema-ferma': {
		id: 'teorema-ferma',
		term: 'Теорема Ферма',
		short: String.raw`Во внутренней точке экстремума производная равна нулю.`,
		formula: String.raw`x_0\ \text{— внутр. локальный экстремум},\ \exists f'(x_0)\ \Rightarrow\ f'(x_0)=0`,
		body: String.raw`Начало всей цепочки теорем о среднем: дифференцируемость плюс внутренний локальный экстремум дают $f'(x_0)=0$. Условие «внутренняя» существенно — на конце отрезка производная экстремума не чувствует. Обратное неверно, контрпример конспекта $f=x^3$ выписан синим сразу после доказательства. Именно на Ферма опирается [[teorema-rollya|теорема Ролля]], а через неё — [[teorema-lagranzha|Лагранж]] и [[teorema-koshi-o-srednem|Коши]].`,
		related: ['teorema-rollya', 'teorema-veyershtrassa', 'monotonnost-i-proizvodnaya']
	},

	'promezhutochnaya-tochka': {
		id: 'promezhutochnaya-tochka',
		term: 'Промежуточная точка c',
		short: String.raw`Точка внутри отрезка, существование которой обещают теоремы о среднем.`,
		body: String.raw`Общий элемент формулировок [[teorema-rollya|Ролля]], [[teorema-lagranzha|Лагранжа]] и [[teorema-koshi-o-srednem|Коши]]: вывод всегда имеет вид $\exists c\in(a,b)$. Точка строго внутренняя (в конспекте у Коши ошибочно написано $c\in[a,b]$), не обязана быть единственной ($x^3-3x$ на $[-\sqrt3,\sqrt3]$ даёт две) и не вычисляется по формуле — её существование добывается компактностью отрезка. В многомерном случае записывается как $\vec c=S(\theta)$ через [[parametrizatsiya-otrezka|параметризацию отрезка]].`,
		related: ['teorema-rollya', 'teorema-lagranzha', 'teorema-koshi-o-srednem', 'parametrizatsiya-otrezka']
	},

	'teorema-veyershtrassa': {
		id: 'teorema-veyershtrassa',
		term: 'Теорема Вейерштрасса',
		short: String.raw`Непрерывная функция на компакте достигает максимума и минимума.`,
		formula: String.raw`f\in C(K),\ K\ \text{— компакт}\ \Rightarrow\ \exists x_m,x_M\in K:\ f(x_m)=\min f,\ f(x_M)=\max f`,
		body: String.raw`Инструмент из первого семестра, без которого не работает [[teorema-rollya|Ролль]]: образ компакта при непрерывном отображении компактен, значит ограничен и замкнут, и точные грани достигаются. Отрезок $[a,b]$ в курсе и вводится как [[lsk|линейно связный компакт]] — именно эта его сторона тут и нужна. На открытом интервале утверждение ломается: $f(x)=x$ на $(0,1)$ ни минимума, ни максимума не имеет.`,
		related: ['teorema-rollya', 'lsk', 'teorema-ferma']
	},

	'teorema-rollya-polya': {
		id: 'teorema-rollya-polya',
		term: 'Теорема Ролля в скалярных полях',
		short: String.raw`Постоянство на границе выпуклого компакта ⟹ внутри градиент обращается в нуль.`,
		body: String.raw`Многомерный двойник [[teorema-rollya|Ролля]] (теорема 6 списка): если $f\in C^1(D)$ на выпуклом компакте $D$ и $f|_{\partial D}\equiv\mathrm{const}$, то во внутренней точке $\nabla f(\vec c)=\vec 0$. Доказательство копирует одномерное — экстремумы на компакте плюс Ферма для [[skalyarnoe-pole|скалярных полей]]. ⚠️ В конспекте (стр. 18–19) формулировка текстом не выписана вовсе, есть только рисунок: «чаша», рассечённая плоскостью по линии уровня.`,
		related: ['teorema-rollya', 'teorema-lagranzha-polya', 'gradient', 'skalyarnoe-pole']
	},

	'teorema-lagranzha-polya': {
		id: 'teorema-lagranzha-polya',
		term: 'Теорема Лагранжа в скалярных полях',
		short: String.raw`Приращение поля вдоль отрезка = скалярное произведение градиента на вектор.`,
		formula: String.raw`f(\vec b)-f(\vec a)=\bigl\langle\nabla f(\vec c)\mid \vec b-\vec a\bigr\rangle,\qquad \vec c=\vec a+\theta(\vec b-\vec a)`,
		body: String.raw`Сводится к одномерному случаю: вдоль [[parametrizatsiya-otrezka|параметризованного отрезка]] функция $\varphi(t)=f(S(t))$ скалярна, и к ней применим обычный [[teorema-lagranzha|Лагранж]]. Правая часть записана в [[braket|bra-ket]]-форме через [[gradient|градиент]]. ⚠️ В конспекте (стр. 19) дана только предельная запись $\lim\frac{\Delta f+A(\Delta h)}{\|\Delta h\|}=\frac{f(\vec b)-f(\vec a)}{\|\vec b-\vec a\|}$ — то же утверждение, но без явной промежуточной точки. Для векторнозначных отображений равенство уже неверно, остаётся лишь неравенство.`,
		related: ['teorema-lagranzha', 'teorema-rollya-polya', 'gradient', 'parametrizatsiya-otrezka']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных скалярного поля.`,
		formula: String.raw`\nabla f=\left(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\right)`,
		body: String.raw`Вектор из частных производных [[skalyarnoe-pole|скалярного поля]]; в конспекте пишется $\nabla f$ или $\vec\nabla f$. Через него производная по направлению выражается [[braket|bra-ket]]-скобкой: $f'_{\vec l}=\langle\vec\nabla f\mid\vec l\rangle$ — проекция градиента на направление. Необходимое условие экстремума поля записывается как $\nabla f(\vec x)=\bar 0$, и именно оно стоит в выводе [[teorema-rollya-polya|многомерного Ролля]].`,
		related: ['skalyarnoe-pole', 'braket', 'teorema-lagranzha-polya', 'teorema-rollya-polya']
	},

	lipshitsevost: {
		id: 'lipshitsevost',
		term: 'Липшицевость',
		short: String.raw`Приращение функции ограничено константой, умноженной на приращение аргумента.`,
		formula: String.raw`|f(x_1)-f(x_2)|\le C|x_1-x_2|,\qquad \rho\bigl(f(x_1),f(x_2)\bigr)\le C\rho(x_1,x_2)`,
		body: String.raw`В конспекте курса определение дано сразу в двух версиях — числовой и метрической (вставлено внутрь темы рядов, между оценкой Абеля и признаком Дирихле). Связь с сегодняшним материалом прямая: из [[formula-konechnyh-prirashcheniy|формулы конечных приращений]] следует, что при $\sup|f'|=C<\infty$ функция липшицева с этой самой константой. Обратное неверно: $|x|$ липшицева с $C=1$, но в нуле не дифференцируема.`,
		related: ['formula-konechnyh-prirashcheniy', 'teorema-lagranzha', 'metriki-rho']
	},

	'parametrizatsiya-otrezka': {
		id: 'parametrizatsiya-otrezka',
		term: 'Параметризация отрезка S(t)',
		short: String.raw`Отрезок между точками как образ [0,1] при S(t) = x + t(y − x).`,
		formula: String.raw`S(t)=\vec x+t(\vec y-\vec x),\qquad S(0)=\vec x,\ S(1)=\vec y,\ t\in[0,1]`,
		body: String.raw`Запись отрезка $\overline{xy}$ в нормированном пространстве, через которую в курсе определяется выпуклость множества и сводятся к одномерному случаю многомерные теоремы. Главное свойство: композиция $\varphi(t)=f(S(t))$ превращает [[skalyarnoe-pole|скалярное поле]] в элемент $\mathrm{End}(\mathbb R)$, к которому применимы [[teorema-lagranzha|Лагранж]] и Тейлор. Промежуточная точка тогда записывается как $\vec c=S(\theta)$, $\theta\in(0,1)$ — отсюда и параметр $\theta$ в многомерном остатке Тейлора.`,
		related: ['teorema-lagranzha-polya', 'skalyarnoe-pole', 'promezhutochnaya-tochka']
	}
};
