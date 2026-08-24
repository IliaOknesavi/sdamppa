import type { Glossary } from '$lib/types';

// Термины дня 5 (теоремы о среднем).
export const day05Terms: Glossary = {
	'teorema-rollya': {
		id: 'teorema-rollya',
		term: 'Теорема Ролля',
		short: String.raw`Равные значения на концах — внутри есть точка с нулевой производной.`,
		formula: String.raw`f\in C[a;b],\ f\ \text{дифф. на}\ (a,b),\ f(a)=f(b)\ \Rightarrow\ \exists c\in(a,b):\ f'(c)=0`,
		body: String.raw`Пусть $f$ непрерывна на $[a;b]$, дифференцируема на $(a,b)$ и $f(a)=f(b)$. Тогда найдётся [[promezhutochnaya-tochka|внутренняя точка]] $c$, в которой $f'(c)=0$.`,
		related: ['teorema-lagranzha', 'promezhutochnaya-tochka', 'teorema-ferma']
	},

	'teorema-lagranzha': {
		id: 'teorema-lagranzha',
		term: 'Теорема Лагранжа',
		short: String.raw`Наклон хорды достигается касательной во внутренней точке.`,
		formula: String.raw`f(b)-f(a)=f'(c)(b-a),\qquad c\in(a,b)`,
		body: String.raw`Пусть $f$ непрерывна на $[a;b]$ и дифференцируема на $(a,b)$. Тогда существует [[promezhutochnaya-tochka|точка]] $c\in(a,b)$, для которой $f(b)-f(a)=f'(c)(b-a)$. При $f(a)=f(b)$ обращается в [[teorema-rollya|теорему Ролля]].`,
		related: ['teorema-rollya', 'promezhutochnaya-tochka', 'formula-konechnyh-prirashcheniy']
	},

	'formula-konechnyh-prirashcheniy': {
		id: 'formula-konechnyh-prirashcheniy',
		term: 'Формула конечных приращений',
		short: String.raw`$\Delta f=f'(c)\,\Delta x$ — точное равенство с неизвестной точкой $c$.`,
		formula: String.raw`\Delta f=f'(c)\,\Delta x,\qquad c\ \text{между}\ x\ \text{и}\ x+\Delta x`,
		body: String.raw`Расчётная форма [[teorema-lagranzha|теоремы Лагранжа]]: **конечное** приращение выражается точно, а не приближённо, ценой того, что точка $c$ неизвестна. Этим она отличается от [[differencial|дифференциала]], который даёт равенство лишь с точностью до $\bar o(\Delta x)$.`,
		related: ['teorema-lagranzha', 'differencial', 'lipshitsevost']
	},

	'teorema-koshi-o-srednem': {
		id: 'teorema-koshi-o-srednem',
		term: 'Теорема Коши о среднем',
		short: String.raw`Отношение приращений равно отношению производных в одной точке.`,
		formula: String.raw`\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)},\qquad c\in(a,b),\ g'\ne0`,
		body: String.raw`Пусть $f,g$ непрерывны на $[a;b]$, дифференцируемы на $(a,b)$ и $g'\ne0$ внутри. Тогда есть [[promezhutochnaya-tochka|точка]] $c$, где $\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)}$. Существенно, что обе производные берутся в **одной** точке.`,
		related: ['teorema-lagranzha', 'promezhutochnaya-tochka']
	},

	'vspomogatelnaya-funkciya': {
		id: 'vspomogatelnaya-funkciya',
		term: 'Вспомогательная функция',
		short: String.raw`Приём: вычесть эталон так, чтобы попасть в условие доказанной теоремы.`,
		formula: String.raw`\varphi(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a),\qquad \varphi(a)=\varphi(b)=0`,
		body: String.raw`Приём доказательства: из функции вычитают подобранное выражение так, чтобы на концах отрезка значения сравнялись, и применяют [[teorema-rollya|теорему Ролля]]. Проверять при этом надо ровно две вещи — сохранилась ли гладкость и верно ли $\varphi(a)=\varphi(b)$.`,
		related: ['teorema-rollya', 'teorema-lagranzha']
	},

	'monotonnost-i-proizvodnaya': {
		id: 'monotonnost-i-proizvodnaya',
		term: 'Лемма о монотонной функции',
		short: String.raw`$f'\ge0$ на промежутке равносильно нестрогому возрастанию.`,
		formula: String.raw`f'\ge0\ \text{на}\ (a,b)\iff f\ \text{нестрого возрастает на}\ [a;b]`,
		body: String.raw`Для функции, непрерывной на [[promezhutok|промежутке]] и дифференцируемой внутри, условие $f'\ge0$ равносильно нестрогому возрастанию. Строгая версия — только [[priznak-i-svoystvo|признак]]: $x^3$ строго возрастает, хотя $f'(0)=0$.`,
		related: ['teorema-lagranzha', 'promezhutok', 'priznak-i-svoystvo']
	},

	'promezhutochnaya-tochka': {
		id: 'promezhutochnaya-tochka',
		term: 'Промежуточная точка $c$',
		short: String.raw`Точка строго внутри отрезка, существование которой утверждают теоремы о среднем.`,
		formula: String.raw`\exists\,c\in(a,b)`,
		body: String.raw`Точка, о которой теоремы о среднем — [[teorema-rollya|Ролля]], [[teorema-lagranzha|Лагранжа]], [[teorema-koshi-o-srednem|Коши]] — утверждают лишь существование. Она строго внутренняя, не обязана быть единственной и в общем случае не выражается формулой через $a$ и $b$.`,
		related: ['teorema-rollya', 'teorema-lagranzha', 'teorema-koshi-o-srednem']
	},

	'teorema-rollya-polya': {
		id: 'teorema-rollya-polya',
		term: 'Теорема Ролля для скалярного поля',
		short: String.raw`Постоянство на границе компакта с внутренними точками — внутри градиент нулевой.`,
		formula: String.raw`\operatorname{In}D\ne\varnothing,\ f\in C^1(D),\ f|_{\partial D}\equiv\mathrm{const}\ \Rightarrow\ \exists\,\vec c\in\operatorname{In}D:\ \nabla f(\vec c)=\bar 0`,
		body: String.raw`Если [[skalyarnoe-pole|скалярное поле]] класса $C^1$ на компакте $D$ с непустой [[vnutrennost|внутренностью]] постоянно на границе, то во внутренней точке его [[gradient|градиент]] обращается в нуль. Условие $\operatorname{In}D\ne\varnothing$ отбросить нельзя: у отрезка в $\mathbb R^2$ внутренних точек нет вовсе. Выпуклость $D$ в доказательстве не участвует — она нужна соседней [[teorema-lagranzha-polya|теореме Лагранжа для полей]]; доказательство — [день 9](/aii/matan/2/day/9).`,
		related: ['teorema-rollya', 'gradient', 'skalyarnoe-pole']
	},

	'teorema-lagranzha-polya': {
		id: 'teorema-lagranzha-polya',
		term: 'Теорема Лагранжа для скалярного поля',
		short: String.raw`Приращение поля вдоль отрезка — скалярное произведение градиента на вектор.`,
		formula: String.raw`f(\vec b)-f(\vec a)=\bigl\langle\nabla f(\vec c)\mid \vec b-\vec a\bigr\rangle,\qquad \vec c=\vec a+\theta(\vec b-\vec a)`,
		body: String.raw`Для [[skalyarnoe-pole|скалярного поля]], дифференцируемого на отрезке $[\vec a;\vec b]$, найдётся внутренняя точка $\vec c$ этого отрезка, в которой $f(\vec b)-f(\vec a)=\langle\nabla f(\vec c)\mid\vec b-\vec a\rangle$. Для векторнозначных отображений равенство уже неверно.`,
		related: ['teorema-lagranzha', 'gradient', 'braket', 'parametrizatsiya-otrezka']
	},

	lipshitsevost: {
		id: 'lipshitsevost',
		term: 'Липшицевость',
		short: String.raw`$|f(x_1)-f(x_2)|\le C|x_1-x_2|$ с одной константой на всю область.`,
		formula: String.raw`\rho\bigl(f(x_1),f(x_2)\bigr)\le C\,\rho(x_1,x_2)`,
		body: String.raw`Функция **липшицева** с константой $C$, если [[metrika|расстояние]] между значениями не превосходит $C$, умноженного на расстояние между аргументами. [[differenciruemost|Дифференцируемости]] это не требует: $|x|$ липшицева с $C=1$, а в нуле [[proizvodnaya|производной]] не имеет.`,
		related: ['formula-konechnyh-prirashcheniy', 'metriki-rho', 'ravnomernaya-nepreryvnost']
	}
};
