import type { Glossary } from '$lib/types';
import { glossary as shared } from '../sem1/glossary';

// =====================================================================
//  Сквозные термины второго семестра. Наследует общие обозначения из
//  первого и добавляет те, что нужны дифференцированию и интегрированию.
//  Склеивается ПОСЛЕДНИМ — перекрывает одноимённые карточки дней.
// =====================================================================

const own: Glossary = {
	braket: {
		id: 'braket',
		term: 'Скалярное произведение ⟨a | b⟩',
		short: String.raw`Запись $\langle\vec a\mid\vec b\rangle$; то же, что $(\vec a,\vec b)$.`,
		formula: String.raw`\langle \vec a\mid \vec b\rangle = (\vec a)^{T}\vec b = \sum_i a_i b_i`,
		body: String.raw`Скалярное произведение [[lineynoe-prostranstvo|векторов]], записанное угловыми скобками с вертикальной чертой; равносильные записи — $(\vec a,\vec b)$ и $\vec a\cdot\vec b$. [[matrica|Матрицу]] внутри скобки можно перебрасывать на другую сторону: $\langle a\mid Hb\rangle=\langle H^{T}a\mid b\rangle$.`,
		related: ['lineynoe-prostranstvo', 'matrica']
	},

	lvtnp: {
		id: 'lvtnp',
		term: 'Локально выпуклое пространство',
		short: String.raw`Линейное пространство с топологией, заданной семейством полунорм.`,
		body: String.raw`**Локально выпуклым** называют линейное пространство, топология которого задана не одной нормой, а [[semeystvo-polunorm|семейством полунорм]]: окрестностями нуля объявляются множества $\{x: p_i(x)<\varepsilon\}$ и их конечные пересечения. Базисные окрестности нуля при этом [[vypukloe-mnozhestvo|выпуклы]] — отсюда и название.`,
		related: ['polunorma', 'semeystvo-polunorm', 'vypukloe-mnozhestvo']
	},

	'klassy-differenciruemosti': {
		id: 'klassy-differenciruemosti',
		term: 'Классы гладкости',
		short: String.raw`$C^r$ — $r$ раз непрерывно дифференцируемые функции.`,
		formula: String.raw`C^0\supset C^1\supset C^2\supset\dots\supset C^{\infty}`,
		body: String.raw`$C^r(X)$ — функции, у которых существуют и [[nepreryvnost|непрерывны]] все [[proizvodnaya-vysshego-poryadka|производные]] до порядка $r$ включительно. Вложения строгие: существование производной её непрерывности не гарантирует.`,
		related: ['proizvodnaya-vysshego-poryadka', 'nepreryvnost']
	},

	'rang-razbieniya': {
		id: 'rang-razbieniya',
		term: 'Ранг разбиения',
		short: String.raw`$\lambda_R=\max_i\lambda_i$ — длина наибольшего отрезка.`,
		formula: String.raw`\lambda_R=\max_i \lambda_i,\qquad \lambda_i=x_{i+1}-x_i`,
		body: String.raw`Наибольшая из длин отрезков [[razbienie|разбиения]]. Именно ранг измеряет мелкость: число точек само по себе ничего не гарантирует — их можно скучить в одном месте, оставив длинный отрезок нетронутым.`,
		related: ['razbienie', 'diametr-mnozhestva']
	},

	'opredelennyy-integral': {
		id: 'opredelennyy-integral',
		term: 'Определённый интеграл',
		short: String.raw`Предел интегральных сумм при ранге разбиения, стремящемся к нулю; значение — число.`,
		formula: String.raw`\int_a^b f\,dx=\lim_{\lambda_R\to0}I(f,\lambda,\vec\xi)`,
		body: String.raw`Число, к которому сходятся интегральные суммы $I(f,\lambda,\vec\xi)$ при [[rang-razbieniya|ранге разбиения]] $\lambda_R\to0$ — независимо от выбора отмеченных точек. Существует ровно тогда, когда верхний и нижний интегралы совпадают. С [[neopredelennyy-integral|неопределённым интегралом]] у него общий только знак $\int$: там значение — класс функций, здесь — число.`,
		related: ['razbienie', 'rang-razbieniya', 'neopredelennyy-integral']
	},

	lsk: {
		id: 'lsk',
		term: 'Линейно связный компакт',
		short: String.raw`Отрезок $[a;b]$ как компакт, соединимый путями.`,
		body: String.raw`Множество, одновременно [[kompakt|компактное]] и линейно связное; образец — отрезок $[a;b]$. Компактность даёт равномерную непрерывность функций на нём, линейная связность — возможность соединить любые две точки путём внутри множества.`,
		related: ['kompakt', 'promezhutok', 'lso']
	},

	'nepravilnaya-mera-nol': {
		id: 'nepravilnaya-mera-nol',
		term: 'Множество меры нуль',
		short: String.raw`Покрывается интервалами суммарной длины меньше любого $\varepsilon$.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\{I_k\}:\ S\subset\bigcup_k I_k,\ \sum_k |I_k|<\varepsilon`,
		body: String.raw`[[mnozhestvo|Множество]] имеет **меру нуль**, если для любого $\varepsilon>0$ его можно [[pokrytie-intervalami|накрыть счётным набором интервалов]] суммарной длины меньше $\varepsilon$. Существенно именно условие на сумму: накрыть можно что угодно, вопрос в цене.`,
		related: ['pokrytie-intervalami', 'schetnoe-mnozhestvo']
	},

	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная по одной координате при замороженных остальных.`,
		formula: String.raw`\frac{\partial f}{\partial x_i}(\vec x)=\lim_{\Delta x_i\to0}\frac{f(x_1,\dots,x_i+\Delta x_i,\dots,x_n)-f(x_1,\dots,x_n)}{\Delta x_i}`,
		body: String.raw`Производная [[skalyarnoe-pole|скалярного поля]] по координате $x_i$ — обычная производная вспомогательной функции одной переменной $\varphi(t)=f(x_1,\dots,t,\dots,x_n)$ в точке $t=x_i$: остальные координаты заморожены и считаются константами. Новой теории здесь нет, вся одномерная техника переносится дословно. Собранные в вектор, частные производные дают [[gradient|градиент]].`,
		related: ['gradient', 'skalyarnoe-pole', 'proizvodnaya-gato']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор из всех частных производных поля.`,
		formula: String.raw`\vec\nabla f=\Bigl(\frac{\partial f}{\partial x_1},\ \dots,\ \frac{\partial f}{\partial x_n}\Bigr)`,
		body: String.raw`Вектор, составленный из всех [[chastnaya-proizvodnaya|частных производных]] [[skalyarnoe-pole|скалярного поля]]. На входе у оператора [[nabla|набла]] скаляр в каждой точке, на выходе вектор в каждой точке. Ради градиента всё и затевается: при дифференцируемости по Фреше [[proizvodnaya-po-napravleniyu|производная по направлению]] равна проекции $f'_{\vec l}=\langle\vec\nabla f\mid\vec l\,\rangle$, откуда сразу и наибыстрейший рост вдоль самого градиента, и ортогональность множествам уровня.`,
		related: ['chastnaya-proizvodnaya', 'nabla', 'proizvodnaya-po-napravleniyu']
	},

	...shared
};

export const glossary: Glossary = own;
