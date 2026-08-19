import type { Glossary } from '$lib/types';

// Термины дня 4 (теорема Ферма, точки экстремума). Карточки end-r,
// skalyarnoe-pole, metriki-rho, vykolotaya-okrestnost,
// klassy-differenciruemosti, priznak-i-svoystvo, braket, blacksquare живут в
// общем глоссарии (sem1/glossary.ts и sem2/glossary.ts) и подключаются
// перекрёстными ссылками [[...]]; дублировать их здесь нельзя — общий
// глоссарий склеивается последним и перекрывает совпадения по id.
// Карточки proizvodnaya, odnostoronnyaya-proizvodnaya, okrestnost, gradient и
// chastnaya-proizvodnaya намеренно продублированы из дней 1–3, чтобы день
// резолвился независимо.
export const day04Terms: Glossary = {
	'lokalnyy-ekstremum': {
		id: 'lokalnyy-ekstremum',
		term: 'Локальный экстремум',
		short: String.raw`Точка максимума или минимума; сравнение только с окрестностью.`,
		formula: String.raw`\exists\,U_{x_0}:\ \forall x\in U_{x_0}\ \ f(x)\ge f(x_0)\quad\text{(минимум)}`,
		body: String.raw`Общее слово для [[tochka-minimuma|точки минимума]] и [[tochka-maksimuma|точки максимума]]. Определение задаётся через [[okrestnost|окрестность]], поэтому без изменений переносится в метрическое пространство и на [[skalyarnoe-pole|скалярное поле]].

Слово «локальный» существенно: у $f(x)=x^3-3x$ в точке $x=-1$ локальный максимум со значением $2$, хотя больших значений функция принимает сколько угодно. Экстремум **строгий**, если неравенство строгое на [[vykolotaya-okrestnost|выколотой окрестности]].`,
		related: ['tochka-maksimuma', 'tochka-minimuma', 'teorema-ferma', 'okrestnost']
	},

	'tochka-maksimuma': {
		id: 'tochka-maksimuma',
		term: 'Точка локального максимума',
		short: String.raw`Есть окрестность, в которой $f(x)\le f(x_0)$.`,
		formula: String.raw`\exists\,U_{x_0}:\ \forall x\in U_{x_0}\ \ f(x)\le f(x_0)`,
		body: String.raw`Точка $x_0$, у которой найдётся [[okrestnost|окрестность]] с $f(x)\le f(x_0)$ во всех её точках. Не то же самое, что точка, где достигается **наибольшее** значение: точек локального максимума может быть много, а наибольшего значения может не быть вовсе — на незамкнутом или неограниченном множестве.

Если $x_0$ внутренняя и $f$ в ней дифференцируема, [[teorema-ferma|теорема Ферма]] даёт $f'(x_0)=0$; на правом конце отрезка это уже неверно — там остаётся лишь половина вывода, $f'_-(x_0)\ge0$.`,
		related: ['tochka-minimuma', 'lokalnyy-ekstremum', 'teorema-ferma', 'vnutrennyaya-tochka']
	},

	'tochka-minimuma': {
		id: 'tochka-minimuma',
		term: 'Точка локального минимума',
		short: String.raw`Есть окрестность, в которой $f(x)\ge f(x_0)$.`,
		formula: String.raw`\exists\,U_{x_0}:\ \forall x\in U_{x_0}\ \ f(x)\ge f(x_0)`,
		body: String.raw`Точка $x_0$, у которой найдётся [[okrestnost|окрестность]] с $f(x)\ge f(x_0)$ во всех её точках. Именно этот случай разбирается в доказательстве [[teorema-ferma|теоремы Ферма]]: неотрицательность приращения $\Delta f$ при обоих знаках $\Delta x$ даёт $f'_+(x_0)\ge0\ge f'_-(x_0)$.

Минимум бывает и там, где производной нет: у $f(x)=|x+2|$ в точке $-2$ он глобальный, а [[odnostoronnyaya-proizvodnaya|односторонние производные]] равны $+1$ и $-1$.`,
		related: ['tochka-maksimuma', 'lokalnyy-ekstremum', 'teorema-ferma', 'kriticheskaya-tochka']
	},

	okrestnost: {
		id: 'okrestnost',
		term: 'Окрестность точки',
		short: String.raw`Любой элемент топологии, содержащий точку; в метрике — шар.`,
		formula: String.raw`U_x\in\tau,\ \ x\in U_x;\qquad B_\delta(x)=\{y:\rho(x,y)<\delta\}`,
		body: String.raw`Любой открытый элемент топологии $\tau$, содержащий $x$. В метрическом пространстве базой служат шары $B_\delta(x)$ в метрике [[metriki-rho|$\rho_k$]], на прямой — интервалы $(x-\delta;x+\delta)$.

Через окрестность записаны оба определения дня: [[lokalnyy-ekstremum|локальный экстремум]] и [[vnutrennyaya-tochka|внутренняя точка]]. Вариант без самой точки — [[vykolotaya-okrestnost|выколотая окрестность]] $\mathring U_x$ — нужен там, где значение в центре надо исключить: в определении строгого экстремума и в определении предела.`,
		related: ['vykolotaya-okrestnost', 'vnutrennyaya-tochka', 'lokalnyy-ekstremum', 'metriki-rho']
	},

	'vnutrennyaya-tochka': {
		id: 'vnutrennyaya-tochka',
		term: 'Внутренняя точка (In D)',
		short: String.raw`Точка с окрестностью, целиком лежащей во множестве.`,
		formula: String.raw`x_0\in\operatorname{In}D\iff \exists\,U_{x_0}\subset D`,
		body: String.raw`Точка $x_0$ внутренняя для $D$, если какая-то её [[okrestnost|окрестность]] целиком лежит в $D$. Совокупность таких точек обозначается $\operatorname{In}D$; для отрезка $\operatorname{In}[a;b]=(a;b)$.

В [[teorema-ferma|теореме Ферма]] это условие работает буквально: внутренность позволяет брать приращение $\Delta x$ **обоих знаков**. На конце отрезка половина рассуждения отпадает, и теорема ломается: у $f(x)=x$ на $[0;1]$ минимум в нуле, а $f'\equiv1$.`,
		related: ['okrestnost', 'teorema-ferma', 'zamykanie', 'kriticheskaya-tochka']
	},

	'stacionarnaya-tochka': {
		id: 'stacionarnaya-tochka',
		term: 'Стационарная точка',
		short: String.raw`Производная существует и равна нулю.`,
		formula: String.raw`f'(x_0)=0;\qquad \vec\nabla f(\vec x_0)=\bar 0\ \ \text{(в скалярном поле)}`,
		body: String.raw`Точка, в которой [[proizvodnaya|производная]] существует и равна нулю; для [[skalyarnoe-pole|скалярного поля]] — точка с нулевым [[gradient|градиентом]]. По [[teorema-ferma|теореме Ферма]] все внутренние экстремумы дифференцируемой функции сидят среди стационарных точек, поэтому они — список кандидатов.

Кандидат не значит экстремум: у $f=x^3$ нуль стационарный, но не экстремум; у $f(x,y)=x^2-y^2$ нуль — седло. Обратной импликации нет.`,
		related: ['kriticheskaya-tochka', 'teorema-ferma', 'teorema-ferma-pole', 'gradient']
	},

	'kriticheskaya-tochka': {
		id: 'kriticheskaya-tochka',
		term: 'Критическая точка',
		short: String.raw`Производная равна нулю ИЛИ не существует.`,
		formula: String.raw`f'(x_0)=0\ \ \text{или}\ \ \nexists\,f'(x_0)`,
		body: String.raw`Точка, где производная либо равна нулю, либо не существует. Всякая [[stacionarnaya-tochka|стационарная точка]] критическая, обратное неверно: у $f(x)=|x+2|$ точка $-2$ критическая, но не стационарная — [[odnostoronnyaya-proizvodnaya|односторонние производные]] там $+1$ и $-1$.

Различение нужно для правила поиска наибольшего значения на отрезке: кандидаты — стационарные точки, точки без производной и концы. Теорема Ферма отбирает только первый сорт.`,
		related: ['stacionarnaya-tochka', 'odnostoronnyaya-proizvodnaya', 'teorema-ferma', 'vnutrennyaya-tochka']
	},

	'teorema-ferma': {
		id: 'teorema-ferma',
		term: 'Теорема Ферма в End(ℝ)',
		short: String.raw`Во внутренней точке экстремума производная равна нулю.`,
		formula: String.raw`x_0\in\operatorname{In}D(f),\ x_0-\text{л.э.},\ \exists f'(x_0)\ \Rightarrow\ f'(x_0)=0`,
		body: String.raw`Доказательство: у [[tochka-minimuma|минимума]] приращение $\Delta f\ge0$ при любом знаке $\Delta x$, поэтому $f'_+(x_0)\ge0\ge f'_-(x_0)$, а дифференцируемость склеивает [[odnostoronnyaya-proizvodnaya|односторонние производные]] в одну.

Это [[priznak-i-svoystvo|свойство]] экстремума, а не признак: у $f=x^3$ нуль стационарный, а экстремума нет. Производная нужна только в самой точке $x_0$: её поведение у соседей в доказательстве не используется.`,
		related: ['teorema-ferma-pole', 'stacionarnaya-tochka', 'odnostoronnyaya-proizvodnaya', 'priznak-i-svoystvo']
	},

	kontrapoziciya: {
		id: 'kontrapoziciya',
		term: 'Контрапозиция',
		short: String.raw`$A\Rightarrow B$ равносильно «не $B$ влечёт не $A$».`,
		formula: String.raw`(A\Rightarrow B)\iff(\overline B\Rightarrow\overline A)`,
		body: String.raw`**Контрапозиция** импликации $A\Rightarrow B$ — импликация $\overline B\Rightarrow\overline A$. Они равносильны, поэтому доказывать можно любую из двух. С обратной импликацией $B\Rightarrow A$ путать нельзя: обратная в общем случае ложна.

В дне это работает дважды. [[teorema-ferma|Теорема Ферма]] «экстремум $\Rightarrow f'(x_0)=0$» доказывается в форме «$f'(x_0)\ne0\Rightarrow$ не экстремум» — это её контрапозиция. А [[priznak-i-svoystvo|различение признака и свойства]] — ровно вопрос о том, какая из трёх импликаций у нас в руках: прямая, обратная или контрапозиция.`,
		related: ['teorema-ferma', 'priznak-i-svoystvo', 'stacionarnaya-tochka']
	},

	'teorema-ferma-pole': {
		id: 'teorema-ferma-pole',
		term: 'Теорема Ферма в скалярных полях',
		short: String.raw`В точке экстремума градиент нулевой: все частные производные равны 0.`,
		formula: String.raw`\vec x_0-\text{л.э.},\ \vec x_0\in\operatorname{In}D\ \Rightarrow\ \vec\nabla f(\vec x_0)=\bar 0`,
		body: String.raw`Многомерный двойник [[teorema-ferma|одномерной теоремы Ферма]]. Доказывается сечениями: $\varphi_i(t)=f(\vec x_0+t\vec e_i)$ имеет в $t=0$ локальный экстремум, $\varphi_i'(0)=\partial f/\partial x_i(\vec x_0)$, и одномерная теорема зануляет каждую [[chastnaya-proizvodnaya|частную производную]]; выкладка — день 13.

Сильнее из сечений ничего не следует: существование всех частных производных не влечёт дифференцируемости поля. Версия «производная как оператор равна нулю» опирается на производную Фреше (день 8).`,
		related: ['teorema-ferma', 'gradient', 'chastnaya-proizvodnaya', 'skalyarnoe-pole']
	},

	proizvodnaya: {
		id: 'proizvodnaya',
		term: 'Производная',
		short: String.raw`Предел разностного отношения приращений.`,
		formula: String.raw`f'(x_0)=\lim_{\Delta x\to0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}`,
		body: String.raw`Предел разностного отношения. Рядом с ним живёт формальная производная полинома $d_xP=\sum k a_k x^{k-1}$, определённая чисто алгебраически, без всякого предела; на многочленах оба определения дают один и тот же результат, а само дифференцирование — линейный оператор $\frac{d}{dx}\in$ [[end-r|$\operatorname{End}(\mathbb R)$]].

Производная существует тогда и только тогда, когда существуют и совпадают обе [[odnostoronnyaya-proizvodnaya|односторонние производные]] — на этом стоит доказательство [[teorema-ferma|теоремы Ферма]].`,
		related: ['odnostoronnyaya-proizvodnaya', 'stacionarnaya-tochka', 'end-r', 'chastnaya-proizvodnaya']
	},

	'odnostoronnyaya-proizvodnaya': {
		id: 'odnostoronnyaya-proizvodnaya',
		term: 'Односторонняя производная',
		short: String.raw`Предел разностного отношения только справа или только слева.`,
		formula: String.raw`f'_\pm(x_0)=\lim_{\Delta x\to\pm0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}`,
		body: String.raw`Предел разностного отношения при $\Delta x\to+0$ (справа) или $\Delta x\to-0$ (слева). [[proizvodnaya|Производная]] существует ровно тогда, когда обе односторонние есть и равны. Рабочий пример: у $f(x)=|x+2|$ в точке $-2$ они равны $+1$ и $-1$, значит производной нет, хотя функция непрерывна.

В [[teorema-ferma|теореме Ферма]] они зажимают производную с двух сторон: $f'_+\ge0\ge f'_-$ у минимума, наоборот у максимума.`,
		related: ['proizvodnaya', 'teorema-ferma', 'kriticheskaya-tochka', 'tochka-minimuma']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор всех частных производных скалярного поля.`,
		formula: String.raw`\vec\nabla f=\Bigl(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\Bigr)`,
		body: String.raw`Вектор, составленный из всех [[chastnaya-proizvodnaya|частных производных]] [[skalyarnoe-pole|скалярного поля]]. Через него выражается производная по направлению: $f'_{\vec l}(x)=\langle\vec\nabla f\mid\vec l\rangle$ в [[braket|bra-ket-записи]].

Зануление градиента — необходимое условие экстремума ([[teorema-ferma-pole|теорема Ферма в скалярных полях]]), но не достаточное: у $f=x^2-y^2$ в нуле $\vec\nabla f=\bar 0$, а точка седловая. Достаточное условие даёт уже матрица Гессе.`,
		related: ['chastnaya-proizvodnaya', 'teorema-ferma-pole', 'braket', 'skalyarnoe-pole']
	},

	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная вдоль одной координаты; остальные заморожены.`,
		formula: String.raw`\frac{\partial f}{\partial x_i}(\vec x_0)=\lim_{t\to0}\frac{f(\vec x_0+t\vec e_i)-f(\vec x_0)}{t}`,
		body: String.raw`Производная координатного сечения $\varphi_i(t)=f(\vec x_0+t\vec e_i)$ в нуле: по остальным переменным функция заморожена. Отсюда и разные символы — $\frac{df}{dx}$ у функции одной переменной, $\frac{\partial f}{\partial x}$ у функции нескольких переменных.

Именно сечение позволяет свести многомерную [[teorema-ferma-pole|теорему Ферма]] к одномерной. Заморозка убирает только слагаемые, не зависящие от выбранной переменной: у $f=x^2+y+z$ будет $\partial f/\partial z=1$, а не $0$.`,
		related: ['gradient', 'proizvodnaya', 'teorema-ferma-pole', 'skalyarnoe-pole']
	}
};
