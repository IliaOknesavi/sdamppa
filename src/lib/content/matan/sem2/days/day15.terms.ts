import type { Glossary } from '$lib/types';

// Термины дня 15 (условный экстремум и множители Лагранжа).
export const day15Terms: Glossary = {
	'uslovnyy-ekstremum': {
		id: 'uslovnyy-ekstremum',
		term: 'Условный экстремум',
		short: String.raw`Экстремум функции на допустимом множестве, а не во всей области.`,
		formula: String.raw`\exists U_{\vec x^{*}}:\ \forall \vec x\in U_{\vec x^{*}}\cap\mathcal D:\ f(\vec x)\ge f(\vec x^{\,*})`,
		body: String.raw`Точка [[dopustimoe-mnozhestvo|допустимого множества]], которая не хуже всех допустимых точек некоторой [[okrestnost|окрестности]]. Сравнение идёт только внутри $\mathcal D$: точка может проигрывать соседям вне связи и всё равно быть условным экстремумом.`,
		related: ['dopustimoe-mnozhestvo', 'lokalnyy-ekstremum', 'svyaz']
	},

	svyaz: {
		id: 'svyaz',
		term: 'Связь',
		short: String.raw`Функция $g_i$, обнуления которой требуют от допустимых точек.`,
		formula: String.raw`g_1,\dots,g_m:\ \mathbb R^n\to\mathbb R,\qquad g_i(\vec x)=0,\qquad m\le n`,
		body: String.raw`Функция, задающая ограничение-равенство $g_i(\vec x)=0$. Каждая независимая связь съедает одну степень свободы, поэтому требуется $m\le n$: при $m=n$ [[dopustimoe-mnozhestvo|допустимое множество]] вырождается в набор изолированных точек.`,
		related: ['dopustimoe-mnozhestvo', 'ogranichenie-neravenstvo', 'uslovnyy-ekstremum']
	},

	'dopustimoe-mnozhestvo': {
		id: 'dopustimoe-mnozhestvo',
		term: 'Допустимое множество',
		short: String.raw`Точки, в которых выполнены все связи.`,
		formula: String.raw`\mathcal D=\{\vec x\in\mathbb R^n:\ g_i(\vec x)=0,\ i=1\ldots m\}`,
		body: String.raw`Множество решений системы [[svyaz|связей]] — то, на котором и ищется экстремум. При выполненном [[uslovie-regulyarnosti|условии регулярности]] это гладкая поверхность размерности $n-m$.`,
		related: ['svyaz', 'uslovnyy-ekstremum', 'uslovie-regulyarnosti']
	},

	'lineynaya-obolochka-gradientov': {
		id: 'lineynaya-obolochka-gradientov',
		term: 'Линейная оболочка градиентов связей',
		short: String.raw`Нормальное пространство к $\mathcal D$: в нём лежит $\nabla f$ в точке экстремума.`,
		formula: String.raw`\operatorname{span}\{\nabla g_1,\dots,\nabla g_m\}=\bigl(T\bigr)^{\perp}`,
		body: String.raw`Множество всех линейных комбинаций [[gradient|градиентов]] [[svyaz|связей]] в точке. Оно служит [[ortogonalnoe-dopolnenie|ортогональным дополнением]] [[kasatelnoe-prostranstvo|касательного пространства]] к допустимому множеству.`,
		related: ['gradient', 'kasatelnoe-prostranstvo', 'ortogonalnoe-dopolnenie']
	},

	'mnozhitel-lagranzha': {
		id: 'mnozhitel-lagranzha',
		term: 'Множитель Лагранжа',
		short: String.raw`Коэффициент разложения $\nabla f$ по градиентам связей.`,
		formula: String.raw`\nabla f(\vec x^{\,*})=\sum_{i=1}^{m}\lambda_i^{*}\,\nabla g_i(\vec x^{\,*})`,
		body: String.raw`Коэффициент, с которым [[gradient|градиент]] целевой функции раскладывается по градиентам [[svyaz|связей]]. При [[uslovie-regulyarnosti|условии регулярности]] набор множителей определён однозначно.`,
		related: ['gradient', 'svyaz', 'uslovie-regulyarnosti', 'funkciya-lagranzha']
	},

	'funkciya-lagranzha': {
		id: 'funkciya-lagranzha',
		term: 'Функция Лагранжа',
		short: String.raw`$\mathcal L=f-\sum\lambda_i g_i$ — функция $n+m$ переменных.`,
		formula: String.raw`\mathcal L(\vec x,\vec\lambda)=f(\vec x)-\sum_{i=1}^{m}\lambda_i\,g_i(\vec x)`,
		body: String.raw`Функция от точки и [[mnozhitel-lagranzha|множителей]] сразу. Её стационарность равносильна системе «разложение градиента плюс сами [[svyaz|связи]]»: производные по $x_j$ дают первое, по $\lambda_i$ — второе. Знак перед суммой — конвенция.`,
		related: ['mnozhitel-lagranzha', 'svyaz', 'stacionarnaya-tochka']
	},

	'uslovie-regulyarnosti': {
		id: 'uslovie-regulyarnosti',
		term: 'Условие регулярности',
		short: String.raw`Градиенты связей в точке линейно независимы.`,
		formula: String.raw`\operatorname{rank}\left(\frac{\partial g_i}{\partial x_j}\right)=m`,
		body: String.raw`Требование [[lineynaya-nezavisimost|линейной независимости]] [[gradient|градиентов]] [[svyaz|связей]] в рассматриваемой точке, то есть полноты ранга [[matrica-yakobi|матрицы Якоби]] системы связей. Без него метод множителей неприменим.`,
		related: ['lineynaya-nezavisimost', 'matrica-yakobi', 'gradient']
	},

	'lineynaya-nezavisimost': {
		id: 'lineynaya-nezavisimost',
		term: 'Линейная независимость и ранг',
		short: String.raw`Нулю равна только тривиальная комбинация; ранг — размер такого набора.`,
		formula: String.raw`\sum_{i=1}^{m}c_i\vec v_i=\vec 0\ \Rightarrow\ c_1=\dots=c_m=0`,
		body: String.raw`Набор векторов **линейно независим**, если нулевым его комбинацию делает только нулевой набор коэффициентов. **Ранг** [[matrica|матрицы]] — наибольшее число линейно независимых строк в ней.`,
		related: ['lineynoe-prostranstvo', 'bazis-i-koordinaty', 'matrica']
	},

	'ortogonalnoe-dopolnenie': {
		id: 'ortogonalnoe-dopolnenie',
		term: 'Ортогональное дополнение',
		short: String.raw`Векторы, перпендикулярные всему подпространству $L$.`,
		formula: String.raw`L^{\perp}=\{\vec h:\ \langle\vec v\mid\vec h\rangle=0\ \ \forall\vec v\in L\},\qquad (L^{\perp})^{\perp}=L`,
		body: String.raw`Множество векторов, ортогональных каждому вектору подпространства $L$. Это снова подпространство, причём $\dim L+\dim L^{\perp}=n$, а в конечномерном случае двойное дополнение возвращает исходное.`,
		related: ['braket', 'lineynoe-prostranstvo', 'lineynaya-nezavisimost']
	},

	'usloviya-kuna-takkera': {
		id: 'usloviya-kuna-takkera',
		term: 'Условия Куна–Таккера',
		short: String.raw`Лагранж для неравенств: множители неотрицательны и $\mu_i g_i=0$.`,
		formula: String.raw`\nabla f+\sum_i\mu_i\nabla g_i=\vec 0,\quad g_i\le0,\quad \mu_i\ge0,\quad \mu_i g_i=0`,
		body: String.raw`Необходимые условия экстремума при [[ogranichenie-neravenstvo|ограничениях-неравенствах]]. К стационарности [[funkciya-lagranzha|функции Лагранжа]] добавляются знак $\mu_i\ge0$ и дополняющая нежёсткость: либо ограничение активно, либо его множитель нулевой.`,
		related: ['ogranichenie-neravenstvo', 'funkciya-lagranzha', 'mnozhitel-lagranzha']
	},

	'ogranichenie-neravenstvo': {
		id: 'ogranichenie-neravenstvo',
		term: 'Ограничение-неравенство',
		short: String.raw`Условие $g_i\ge0$: вырезает область с краем, а не поверхность.`,
		formula: String.raw`g_i(\vec x)\ge0`,
		body: String.raw`Ограничение в форме неравенства — $g_i\ge0$ либо, в записи условий Куна–Таккера, $g_i\le0$. В отличие от [[svyaz|связи]]-равенства, размерность оно не понижает: получается область с краем, и экстремум может лежать как внутри неё, так и на крае.`,
		related: ['svyaz', 'dopustimoe-mnozhestvo', 'usloviya-kuna-takkera']
	},

	'kasatelnoe-prostranstvo': {
		id: 'kasatelnoe-prostranstvo',
		term: 'Касательное пространство к $\\mathcal D$',
		short: String.raw`Направления, вдоль которых связи в первом порядке не меняются.`,
		formula: String.raw`T=\{\vec h\in\mathbb R^n:\ \langle\nabla g_i(\vec x^{\,*})\mid\vec h\rangle=0,\ i=1\ldots m\}`,
		body: String.raw`Множество векторов, ортогональных всем [[gradient|градиентам]] [[svyaz|связей]] в точке. При [[uslovie-regulyarnosti|регулярности]] это подпространство размерности $n-m$ — столько же, сколько у [[dopustimoe-mnozhestvo|допустимого множества]].`,
		related: ['gradient', 'dopustimoe-mnozhestvo', 'ortogonalnoe-dopolnenie']
	}
};
