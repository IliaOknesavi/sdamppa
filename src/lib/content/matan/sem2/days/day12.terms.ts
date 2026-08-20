import type { Glossary } from '$lib/types';

// Термины дня 12 (формула Тейлора: от одномерной к мультииндексной).
export const day12Terms: Glossary = {
	'formula-teylora': {
		id: 'formula-teylora',
		term: 'Формула Тейлора',
		short: String.raw`Функция — частичная сумма по производным в точке плюс остаток.`,
		formula: String.raw`f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n(x)`,
		body: String.raw`Представление функции суммой многочлена $T_n(x;a)=\sum_{k\le n}\frac{f^{(k)}(a)}{k!}(x-a)^k$ и [[ostatochnyy-chlen|остатка]]. Многочлен $T_n$ — единственный степени не выше $n$, у которого в точке $a$ совпадают с $f$ все производные до $n$-й.`,
		related: ['ostatochnyy-chlen', 'proizvodnaya-vysshego-poryadka', 'ryad-maklorena']
	},

	'ostatochnyy-chlen': {
		id: 'ostatochnyy-chlen',
		term: 'Остаточный член',
		short: String.raw`Разность между функцией и её частичной суммой Тейлора.`,
		formula: String.raw`R_n(x)=f(x)-\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k`,
		body: String.raw`То, что многочлен [[formula-teylora|Тейлора]] не поймал. Само по себе это определение тавтологично; содержание появляется, когда для $R_n$ выписана явная запись — [[forma-lagranzha|по Лагранжу]] или [[forma-peano|по Пеано]].`,
		related: ['formula-teylora', 'forma-lagranzha', 'forma-peano']
	},

	'forma-lagranzha': {
		id: 'forma-lagranzha',
		term: 'Остаток в форме Лагранжа',
		short: String.raw`$R_n=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}$ с промежуточной точкой $\xi$.`,
		formula: String.raw`R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1},\qquad \xi\in(a;x)`,
		body: String.raw`Если $f$ имеет непрерывные производные до порядка $n+1$ на отрезке, то найдётся [[promezhutochnaya-tochka|точка]] $\xi$ строго между $a$ и $x$, для которой [[ostatochnyy-chlen|остаток]] равен $\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}$.`,
		related: ['ostatochnyy-chlen', 'promezhutochnaya-tochka', 'forma-peano']
	},

	'forma-peano': {
		id: 'forma-peano',
		term: 'Остаток в форме Пеано',
		short: String.raw`$R_n\in\bar o\bigl((x-a)^n\bigr)$ при $x\to a$.`,
		formula: String.raw`R_n(x)\in\bar o\bigl((x-a)^n\bigr)\big|_{x\to a}`,
		body: String.raw`Асимптотическая запись [[ostatochnyy-chlen|остатка]]: он лежит в [[asimptoticheskie-klassy|классе $\bar o((x-a)^n)$]] при $x\to a$. Требует лишь существования $f^{(n)}(a)$, но о величине ошибки в конкретной точке не говорит ничего.`,
		related: ['ostatochnyy-chlen', 'asimptoticheskie-klassy', 'forma-lagranzha']
	},

	'ryad-maklorena': {
		id: 'ryad-maklorena',
		term: 'Формула Маклорена',
		short: String.raw`Формула Тейлора с центром $a=0$.`,
		formula: String.raw`f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(0)}{k!}x^k+R_n(x)`,
		body: String.raw`[[formula-teylora|Формула Тейлора]] в частном случае $a=0$. Отдельное имя закрепилось потому, что табличные разложения элементарных функций выписывают именно в нуле, а произвольную точку получают сдвигом.`,
		related: ['formula-teylora', 'ostatochnyy-chlen']
	},

	'multinomialnaya-formula': {
		id: 'multinomialnaya-formula',
		term: 'Мультиномиальная формула',
		short: String.raw`Степень суммы через мультииндексы: обобщение бинома Ньютона.`,
		formula: String.raw`(a_1+\dots+a_n)^m=\sum_{|\alpha|=m}\frac{m!}{\alpha!}\,a^{\alpha}`,
		body: String.raw`Разложение $m$-й степени суммы $n$ слагаемых: коэффициент при $a^{\alpha}$ равен $\frac{m!}{\alpha!}$, где $\alpha$ — [[multiindeks|мультииндекс]]. При $n=2$ обращается в бином Ньютона.`,
		related: ['multiindeks']
	},

	'vypuklaya-obolochka': {
		id: 'vypuklaya-obolochka',
		term: 'Выпуклая оболочка',
		short: String.raw`Наименьшее выпуклое множество, содержащее данные точки.`,
		formula: String.raw`\operatorname{conv}\lbrace\vec v_0,\dots,\vec v_k\rbrace=\Bigl\lbrace\textstyle\sum_i\alpha_i\vec v_i:\ \alpha_i\ge0,\ \sum_i\alpha_i=1\Bigr\rbrace`,
		body: String.raw`Наименьшее [[vypukloe-mnozhestvo|выпуклое множество]], содержащее данный набор точек. В координатах это в точности точки с [[baricentricheskie-koordinaty|барицентрическими координатами]] — неотрицательными весами с суммой единица.`,
		related: ['vypukloe-mnozhestvo', 'baricentricheskie-koordinaty', 'simpleks']
	},

	simpleks: {
		id: 'simpleks',
		term: 'Симплекс',
		short: String.raw`Точка, отрезок, треугольник, тетраэдр — по одному на размерность.`,
		formula: String.raw`\Delta^k=\operatorname{conv}\lbrace\vec v_0,\dots,\vec v_k\rbrace`,
		body: String.raw`**Симплекс** размерности $k$ — [[vypuklaya-obolochka|выпуклая оболочка]] $k+1$ точки, не лежащих в подпространстве меньшей размерности. По размерностям: точка, отрезок, треугольник, тетраэдр.`,
		related: ['vypuklaya-obolochka', 'baricentricheskie-koordinaty', 'affinnoe-prostranstvo']
	},

	'affinnoe-prostranstvo': {
		id: 'affinnoe-prostranstvo',
		term: 'Аффинное пространство',
		short: String.raw`Сдвиг линейного подпространства: точки без выделенного нуля.`,
		formula: String.raw`\Pi=\vec x_0+L,\qquad L\ \text{— линейное подпространство}`,
		body: String.raw`Сдвиг [[lineynoe-prostranstvo|линейного подпространства]] на фиксированный вектор. Нуль в нём не выделен: складывать две точки нельзя, а вычитать можно — разность точек уже вектор.`,
		related: ['lineynoe-prostranstvo', 'simpleks']
	},

	'baricentricheskie-koordinaty': {
		id: 'baricentricheskie-koordinaty',
		term: 'Барицентрические координаты',
		short: String.raw`Веса вершин симплекса: неотрицательные, в сумме единица.`,
		formula: String.raw`\sum_i\alpha_i\vec v_i,\qquad \alpha_i\ge0,\ \ \sum_i\alpha_i=1`,
		body: String.raw`Задание точки [[simpleks|симплекса]] весами его вершин — как положения центра тяжести. Условия $\alpha_i\ge0$ и $\sum\alpha_i=1$ выделяют ровно [[vypuklaya-obolochka|выпуклую оболочку]] вершин.`,
		related: ['simpleks', 'vypuklaya-obolochka', 'affinnoe-prostranstvo']
	},

	multiindeks: {
		id: 'multiindeks',
		term: 'Мультииндекс',
		short: String.raw`Вектор показателей $\alpha$: сколько раз дифференцировать по каждой переменной.`,
		formula: String.raw`|\alpha|=\sum_i\alpha^i,\quad \alpha!=\alpha^1!\cdots\alpha^n!,\quad \vec h^{\,\alpha}=h_1^{\alpha^1}\cdots h_n^{\alpha^n}`,
		body: String.raw`Набор $\alpha=(\alpha^1,\dots,\alpha^n)$ из [[n-nol-n-odin|$\mathbb N_0$]], задающий оператор $D^\alpha f=\frac{\partial^{|\alpha|}f}{(\partial x_1)^{\alpha^1}\cdots(\partial x_n)^{\alpha^n}}$ и одночлен $\vec h^{\,\alpha}$. Корректность записи опирается на [[teorema-klero|теорему Клеро]]: порядок дифференцирований не важен.`,
		related: ['n-nol-n-odin', 'teorema-klero', 'chastnaya-proizvodnaya']
	},

	'formula-teylora-pole': {
		id: 'formula-teylora-pole',
		term: 'Формула Тейлора для скалярного поля',
		short: String.raw`Сумма по мультииндексам; остаток в точке $\vec a+\theta\vec h$.`,
		formula: String.raw`f(\vec a+\vec h)=\sum_{|\alpha|\le k}\frac{D^\alpha f(\vec a)}{\alpha!}\vec h^{\,\alpha}+\sum_{|\beta|=k+1}\frac{D^\beta f(\vec a+\theta\vec h)}{\beta!}\vec h^{\,\beta}`,
		body: String.raw`Разложение [[skalyarnoe-pole|скалярного поля]] по [[multiindeks|мультииндексам]] в точке $\vec a$; остаток берётся в промежуточной точке отрезка, $\theta\in[0;1]$ — многомерный аналог [[forma-lagranzha|формы Лагранжа]].`,
		related: ['multiindeks', 'forma-lagranzha', 'skalyarnoe-pole']
	}
};
