import type { Glossary } from '$lib/types';

// Термины дня 9 (определения 6, 8, 9, 10, 11 списка семантических единиц:
// производная Гато, производная по направлению, частная производная,
// градиент, полунорма). День должен резолвиться независимо, поэтому
// опорные понятия из соседних дней — производная Фреше, градиент,
// параметризация отрезка, теорема Лагранжа в скалярных полях —
// продублированы здесь.
// НЕ дублируются термины канонического глоссария (sem2/glossary.ts и
// sem1/glossary.ts): braket, lvtnp, klassy-differenciruemosti,
// rang-razbieniya, lsk, nepravilnaya-mera-nol, n-nol-n-odin, dopolnenie,
// zamykanie, vykolotaya-okrestnost, komponenta-svyaznosti, metriki-rho,
// end-r, skalyarnoe-pole, lso, asimptoticheskie-klassy,
// skhodyashchayasya-v-sebe, chastichnaya-posledovatelnost,
// priznak-i-svoystvo, blacksquare — на них ссылаемся через [[...]].
export const day09Terms: Glossary = {
	'proizvodnaya-gato': {
		id: 'proizvodnaya-gato',
		term: 'Производная Гато',
		short: String.raw`Предел приращения вдоль прямой, делённого на скаляр $t$.`,
		formula: String.raw`dF(\vec x,\vec h)=\frac{d}{dt}F(\vec x+t\vec h)\Big|_{t=0}=\lim_{t\to0}\frac{F(\vec x+t\vec h)-F(\vec x)}{t}`,
		body: String.raw`Определение 6 списка (конспект, стр. 19): сужаем [[skalyarnoe-pole|поле]] на прямую $\vec x+t\vec h$ и дифференцируем полученную функцию из [[end-r|$\mathrm{End}(\mathbb R)$]] в нуле. Делится на **скаляр** $t$, а не на норму приращения, — поэтому объект помнит направление. По $\vec h$ всегда однородна первой степени, но не обязана быть аддитивной; в функциональном анализе Гато-дифференцируемостью называют случай, когда $\vec h\mapsto dF(\vec x,\vec h)$ ещё и линеен. Живёт в [[lvtnp|ЛВТНП]], где нормы может не быть вовсе.`,
		related: ['slabaya-proizvodnaya', 'proizvodnaya-po-napravleniyu', 'proizvodnaya-freshe', 'ierarhiya-differenciruemosti']
	},

	'slabaya-proizvodnaya': {
		id: 'slabaya-proizvodnaya',
		term: 'Слабая производная',
		short: String.raw`Второе имя производной Гато: опрашивает поле только вдоль прямых.`,
		body: String.raw`Так курс называет [[proizvodnaya-gato|производную Гато]] в паре «слабая / сильная», где сильная — [[proizvodnaya-freshe|производная Фреше]]. Слабость буквальна: требование накладывается отдельно на каждый луч из точки и ничего не говорит о поведении между лучами. Отсюда контрпримеры вида $\frac{x^3y}{x^6+y^2}$ — предел вдоль каждой прямой нулевой, а вдоль кривой $y=x^3$ функция равна $\frac12$ и в нуле разрывна. Фреше вместо семейства поточечных условий требует одного равномерного.`,
		related: ['proizvodnaya-gato', 'proizvodnaya-freshe', 'ierarhiya-differenciruemosti']
	},

	'proizvodnaya-po-napravleniyu': {
		id: 'proizvodnaya-po-napravleniyu',
		term: 'Производная по направлению',
		short: String.raw`Производная Гато с единичным вектором; при дифференцируемости — проекция градиента.`,
		formula: String.raw`f'_{\vec l}(\vec x)=\lim_{t\to0}\frac{f(\vec x+t\vec l)-f(\vec x)}{t}\ \overset{\text{Фреше}}{=}\ \bigl\langle\nabla f(\vec x)\mid\vec l\bigr\rangle,\qquad \|\vec l\|=1`,
		body: String.raw`Определение 8 списка. Это [[proizvodnaya-gato|производная Гато]], нормированная условием $\|\vec l\|=1$: без него то же направление, записанное вдвое длиннее вектором, дало бы вдвое большее число. Пересчёт: $f'_{\vec l}=dF(\vec x,\vec h)/\|\vec h\|$. ⚠️ В конспекте (стр. 17) она вводится **формулой** $\langle\vec\nabla f\mid\vec l\rangle$, то есть определением объявлено следствие; равенство верно лишь при дифференцируемости по [[proizvodnaya-freshe|Фреше]], а у $\frac{x^3}{x^2+y^2}$ обе части определены и не равны.`,
		related: ['proizvodnaya-gato', 'gradient', 'chastnaya-proizvodnaya', 'napravlenie-naibystreyshego-rosta']
	},

	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная по направлению базисного вектора: остальные переменные заморожены.`,
		formula: String.raw`\frac{\partial f}{\partial x_i}(\vec x)=f'_{\vec e_i}(\vec x)=\lim_{t\to0}\frac{f(x_1,\dots,x_i+t,\dots,x_n)-f(\vec x)}{t}`,
		body: String.raw`Определение 9 списка. Не самостоятельное понятие, а $n$ значений [[proizvodnaya-po-napravleniyu|производной по направлению]] вдоль базисных векторов $\vec e_i$ — из континуума возможных направлений. Отсюда её знаменитая «слепота»: у $\frac{xy}{x^2+y^2}$ обе частные производные в нуле нулевые, а функция там разрывна. ⚠️ Конспект (стр. 27) определяет дифференцируемость ФНП как существование всех частных — по [[ierarhiya-differenciruemosti|иерархии]] это нижний этаж, а не верхний.`,
		related: ['proizvodnaya-po-napravleniyu', 'gradient', 'ierarhiya-differenciruemosti', 'dostatochnoe-uslovie-differenciruemosti']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных скалярного поля.`,
		formula: String.raw`\nabla f=\left(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\right)`,
		body: String.raw`Определение 10 списка; в конспекте пишется $\nabla f$ или $\vec\nabla f$. Это собранные в строку [[chastnaya-proizvodnaya|частные производные]] [[skalyarnoe-pole|скалярного поля]]. При дифференцируемости он полностью описывает первый порядок: любая [[proizvodnaya-po-napravleniyu|производная по направлению]] получается [[braket|bra-ket]]-скобкой $\langle\nabla f\mid\vec l\rangle$, длина $\|\nabla f\|$ есть максимальная скорость роста, а условие $\nabla f=\bar 0$ — необходимый признак экстремума поля.`,
		related: ['chastnaya-proizvodnaya', 'proizvodnaya-po-napravleniyu', 'napravlenie-naibystreyshego-rosta', 'braket']
	},

	'proizvodnaya-freshe': {
		id: 'proizvodnaya-freshe',
		term: 'Производная Фреше',
		short: String.raw`Сильная производная: приращение линейно приближается с точностью до ō(‖Δh‖).`,
		formula: String.raw`f(\vec x+\Delta\vec h)-f(\vec x)=\bigl\langle\nabla f(\vec x)\mid\Delta\vec h\bigr\rangle+\bar o(\|\Delta\vec h\|)`,
		body: String.raw`Определение 7 списка, верхний этаж [[ierarhiya-differenciruemosti|иерархии]]. В отличие от [[proizvodnaya-gato|Гато]] требует **равномерности**: одно линейное приближение работает сразу для всех приращений, с общей оценкой остатка из класса [[asimptoticheskie-klassy|$\bar o$]]. Влечёт непрерывность и формулу $f'_{\vec l}=\langle\nabla f\mid\vec l\rangle$. ⚠️ У преподавателя записана как $f'(x_0)=\lim\frac{\Delta f+A(\Delta h)}{\|\Delta h\|}$, где $A\in\bar o$ — паразитная добавка; в учебниках производной называют сам линейный оператор $A$.`,
		related: ['proizvodnaya-gato', 'ierarhiya-differenciruemosti', 'dostatochnoe-uslovie-differenciruemosti', 'gradient']
	},

	'napravlenie-naibystreyshego-rosta': {
		id: 'napravlenie-naibystreyshego-rosta',
		term: 'Направление наибыстрейшего роста',
		short: String.raw`Максимум производной по направлению равен ‖∇f‖ и достигается вдоль градиента.`,
		formula: String.raw`\max_{\|\vec l\|=1}f'_{\vec l}=\|\nabla f\|\ \text{ при }\ \vec l=\frac{\nabla f}{\|\nabla f\|}`,
		body: String.raw`Следствие формулы $f'_{\vec l}=\langle\nabla f\mid\vec l\rangle$ и [[neravenstvo-koshi-bunyakovskogo|неравенства Коши–Буняковского]]: скобка не превосходит $\|\nabla f\|$, а равенство достигается только на коллинеарных векторах. Три случая: вдоль [[gradient|градиента]] рост $+\|\nabla f\|$, против него убывание $-\|\nabla f\|$, поперёк ($\vec l\perp\nabla f$) ноль — направление вдоль линии уровня. Практическое воплощение — шаг градиентного спуска против $\nabla f$.`,
		related: ['gradient', 'proizvodnaya-po-napravleniyu', 'neravenstvo-koshi-bunyakovskogo']
	},

	'neravenstvo-koshi-bunyakovskogo': {
		id: 'neravenstvo-koshi-bunyakovskogo',
		term: 'Неравенство Коши–Буняковского',
		short: String.raw`|⟨a | b⟩| ≤ ‖a‖·‖b‖; равенство — только для коллинеарных векторов.`,
		formula: String.raw`\bigl|\langle\vec a\mid\vec b\rangle\bigr|\le\|\vec a\|\cdot\|\vec b\|`,
		body: String.raw`Оценка [[braket|скалярного произведения]] через длины: геометрически $\langle\vec a\mid\vec b\rangle=\|\vec a\|\|\vec b\|\cos\alpha$, а косинус по модулю не больше единицы. Условие равенства ($\cos\alpha=\pm1$, то есть коллинеарность) в теме дифференцирования важнее самой оценки — именно оно определяет [[napravlenie-naibystreyshego-rosta|направление наибыстрейшего роста]]. Из него же выводится неравенство треугольника для евклидовой нормы, то есть аксиома метрики $\rho_2$ первого семестра.`,
		related: ['braket', 'napravlenie-naibystreyshego-rosta', 'gradient']
	},

	'ierarhiya-differenciruemosti': {
		id: 'ierarhiya-differenciruemosti',
		term: 'Иерархия дифференцируемости',
		short: String.raw`Фреше ⟹ Гато ⟹ все направления ⟹ частные; все стрелки строгие.`,
		formula: String.raw`\text{Фреше}\Rightarrow\text{Гато}\Rightarrow\exists f'_{\vec l}\ \forall\vec l\Rightarrow\exists\tfrac{\partial f}{\partial x_i}\ \forall i`,
		body: String.raw`Лестница из четырёх этажей: каждый шаг вниз сужает класс допустимых приращений и теряет информацию. Контрпримеры: $\frac{x^3y}{x^6+y^2}$ ([[proizvodnaya-gato|Гато]] есть и линейна, [[proizvodnaya-freshe|Фреше]] нет — разрыв вдоль $y=x^3$); $\frac{x^3}{x^2+y^2}$ (все направления есть, аддитивности нет); $\frac{xy}{x^2+y^2}$ ([[chastnaya-proizvodnaya|частные]] есть, направлений нет). Подъём вверх даёт [[dostatochnoe-uslovie-differenciruemosti|достаточное условие]].`,
		related: ['proizvodnaya-freshe', 'proizvodnaya-gato', 'chastnaya-proizvodnaya', 'dostatochnoe-uslovie-differenciruemosti']
	},

	'dostatochnoe-uslovie-differenciruemosti': {
		id: 'dostatochnoe-uslovie-differenciruemosti',
		term: 'Достаточное условие дифференцируемости',
		short: String.raw`Частные есть в окрестности и непрерывны в точке ⟹ дифференцируемость по Фреше.`,
		formula: String.raw`\exists f'_{x_i}\ \text{в}\ U(\vec x_0),\quad f'_{x_i}\in C(\vec x_0)\ \Rightarrow\ f\ \text{дифференцируема по Фреше в}\ \vec x_0`,
		body: String.raw`Единственный практичный способ подняться по [[ierarhiya-differenciruemosti|иерархии]] снизу вверх: считать умеют [[chastnaya-proizvodnaya|частные производные]], а нужна [[proizvodnaya-freshe|Фреше]]. Доказательство — Г-образное приращение (шаг по $x$, потом по $y$), теорема Лагранжа в каждой скобке и непрерывность частных, дающая $\delta(\varepsilon)=\min(\delta_x(\varepsilon/2),\delta_y(\varepsilon/2))$. Это [[priznak-i-svoystvo|признак, а не критерий]]: $(x^2+y^2)\sin\frac{1}{x^2+y^2}$ дифференцируема в нуле при разрывных частных.`,
		related: ['ierarhiya-differenciruemosti', 'nepreryvno-differenciruemaya', 'proizvodnaya-freshe', 'chastnaya-proizvodnaya']
	},

	'nepreryvno-differenciruemaya': {
		id: 'nepreryvno-differenciruemaya',
		term: 'Непрерывно дифференцируемая функция',
		short: String.raw`Класс $C^1(U)$: все частные производные существуют и непрерывны на $U$.`,
		formula: String.raw`f\in C^1(U)\iff \exists\frac{\partial f}{\partial x_i}\ \text{на}\ U\ \wedge\ \frac{\partial f}{\partial x_i}\in C(U)`,
		body: String.raw`Рабочий класс всей темы полей: по [[dostatochnoe-uslovie-differenciruemosti|достаточному условию]] принадлежность $C^1(U)$ автоматически даёт дифференцируемость по [[proizvodnaya-freshe|Фреше]] в каждой точке $U$ — а проверяется она элементарно, счётом частных производных. В конспекте класс определён рекурсивно: $f\in C^n(D)$, если $\frac{\partial f}{\partial x_i}\in C^{n-1}(D)$ (см. [[klassy-differenciruemosti|классы гладкости]]). Условия теорем Ролля, Лагранжа и Клеро в курсе формулируются именно через $C^1$ и $C^2$.`,
		related: ['dostatochnoe-uslovie-differenciruemosti', 'klassy-differenciruemosti', 'proizvodnaya-freshe', 'teorema-lagranzha-polya']
	},

	'parametrizatsiya-otrezka': {
		id: 'parametrizatsiya-otrezka',
		term: 'Параметризация отрезка',
		short: String.raw`S(t) = a⃗ + t(b⃗ − a⃗), t ∈ [0,1] — отрезок как образ единичного промежутка.`,
		formula: String.raw`S(t)=\vec a+t(\vec b-\vec a),\qquad S(0)=\vec a,\ S(1)=\vec b,\ t\in[0,1]`,
		body: String.raw`Запись из конспекта (стр. 18, 20–21), рядом с определением выпуклого множества. Главный инструмент переноса одномерных теорем на поля: подстановка $\varphi(t)=f(S(t))$ превращает [[skalyarnoe-pole|поле]] в элемент [[end-r|$\mathrm{End}(\mathbb R)$]], причём $\varphi'(t)=dF(S(t),\vec b-\vec a)$ — ровно [[proizvodnaya-gato|производная Гато]] вдоль неединичного вектора. Так доказывается [[teorema-lagranzha-polya|многомерный Лагранж]]; отрезок обязан лежать в области, отсюда требование выпуклости.`,
		related: ['teorema-lagranzha-polya', 'proizvodnaya-gato', 'skalyarnoe-pole']
	},

	'teorema-lagranzha-polya': {
		id: 'teorema-lagranzha-polya',
		term: 'Теорема Лагранжа в скалярных полях',
		short: String.raw`Приращение поля вдоль отрезка = скалярное произведение градиента в средней точке на вектор.`,
		formula: String.raw`f(\vec b)-f(\vec a)=\bigl\langle\nabla f(\vec c)\mid\vec b-\vec a\bigr\rangle,\qquad \vec c=\vec a+\theta(\vec b-\vec a),\ \theta\in(0,1)`,
		body: String.raw`Теорема 6-й группы списка, многомерный двойник одномерного Лагранжа (день 5). Доказывается [[parametrizatsiya-otrezka|параметризацией отрезка]]: $\varphi(t)=f(S(t))$ скалярна, к ней применим одномерный случай. ⚠️ В конспекте (стр. 19) записана без промежуточной точки — предельным равенством $\lim\frac{\Delta f+A(\Delta h)}{\|\Delta h\|}=\frac{f(\vec b)-f(\vec a)}{\|\vec b-\vec a\|}$. Из неё же Ролль для полей: при $f(\vec a)=f(\vec b)$ получается лишь $\nabla f(\vec c)\perp(\vec b-\vec a)$, а не $\nabla f(\vec c)=\vec 0$.`,
		related: ['parametrizatsiya-otrezka', 'gradient', 'nepreryvno-differenciruemaya', 'braket']
	},

	polunorma: {
		id: 'polunorma',
		term: 'Полунорма',
		short: String.raw`Норма без невырожденности: «может быть 0 не на 0».`,
		formula: String.raw`p(\lambda x)=|\lambda|p(x),\qquad p(x+y)\le p(x)+p(y),\qquad p(x)=0\ \text{при}\ x\ne0\ \text{допустимо}`,
		body: String.raw`Определение 11 списка; в конспекте (стр. 17) описано одной фразой — «может быть $0$ не на $0$», то есть от нормы остаются однородность и неравенство треугольника, а невырожденность отбрасывается. Семейство полунорм $p_1,\dots,p_n$ с условием $\vec x\ne\vec 0\Rightarrow\sum_i p_i(\vec x)>0$ задаёт топологию [[lvtnp|ЛВТНП]] — среды, в которой корректна [[proizvodnaya-gato|производная Гато]]. Для [[proizvodnaya-freshe|Фреше]] этого мало: там в знаменателе стоит норма приращения.`,
		related: ['lvtnp', 'proizvodnaya-gato', 'proizvodnaya-freshe']
	}
};
