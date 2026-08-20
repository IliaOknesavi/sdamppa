import type { Glossary } from '$lib/types';

// Термины дня 28 (признак Куммера и его частные случаи).
export const day28Terms: Glossary = {
	'priznak-kummera': {
		id: 'priznak-kummera',
		term: 'Признак Куммера',
		short: String.raw`Общая схема признаков по отношению $a_n/a_{n+1}$.`,
		formula: String.raw`K_n=C_n\frac{a_n}{a_{n+1}}-C_{n+1}:\qquad K_n\ge k>0\Rightarrow\text{сх.};\qquad K_n\le0\Rightarrow\text{расх.}`,
		body: String.raw`Для ряда с положительными членами и [[posledovatelnost-kummera|последовательности Куммера]] $\{C_n\}$ строится величина $K_n$: её отделённость от нуля снизу даёт сходимость, неположительность начиная с некоторого номера — расходимость.`,
		related: ['posledovatelnost-kummera', 'ierarhiya-priznakov']
	},

	'posledovatelnost-kummera': {
		id: 'posledovatelnost-kummera',
		term: 'Последовательность Куммера',
		short: String.raw`Положительный набор $C_n$ с расходящимся $\sum 1/C_n$.`,
		formula: String.raw`C_n>0\ \ \forall n,\qquad \sum_{n}\frac{1}{C_n}\ \ \text{— расх.}`,
		body: String.raw`Настроечный параметр [[priznak-kummera|признака Куммера]]. Требований два: положительность членов и расходимость ряда из обратных величин — каждое обслуживает свою половину теоремы.`,
		related: ['priznak-kummera', 'garmonicheskiy-ryad']
	},

	'priznak-raabe': {
		id: 'priznak-raabe',
		term: 'Признак Раабе',
		short: String.raw`Решает $\lim R_n$ относительно единицы; при $R_n\to1$ молчит.`,
		formula: String.raw`R_n=n\Bigl(\frac{a_n}{a_{n+1}}-1\Bigr):\quad \varliminf R_n>1\ \text{— сх.},\quad \varlimsup R_n<1\ \text{— расх.}`,
		body: String.raw`Частный случай [[priznak-kummera|признака Куммера]] при $C_n=n$. Случай $\lim R_n=1$ неразрешим: там встречаются и сходящиеся, и расходящиеся ряды.`,
		related: ['priznak-kummera', 'priznak-bertrana', 'verhniy-i-nizhniy-predely']
	},

	'priznak-bertrana': {
		id: 'priznak-bertrana',
		term: 'Признак Бертрана',
		short: String.raw`Домножает разность $R_n-1$ на $\ln n$ и видит следующий этаж.`,
		formula: String.raw`B_n=\ln n\,\bigl(R_n-1\bigr):\quad \varliminf B_n>1\ \text{— сх.},\quad \varlimsup B_n<1\ \text{— расх.}`,
		body: String.raw`Частный случай [[priznak-kummera|признака Куммера]] при $C_n=n\ln n$. Отвечает там, где [[priznak-raabe|Раабе]] молчит; собственная слепая зона — $B_n\to1$.`,
		related: ['priznak-kummera', 'priznak-raabe', 'ryad-bertrana']
	},

	'priznak-gaussa': {
		id: 'priznak-gaussa',
		term: 'Признак Гаусса',
		short: String.raw`Ответ читается с двух коэффициентов разложения $a_n/a_{n+1}$.`,
		formula: String.raw`\frac{a_n}{a_{n+1}}=\alpha+\frac{\beta}{n}+O\Bigl(\frac{1}{n^{1+\delta}}\Bigr):\quad \alpha>1\ \text{сх.};\ \alpha<1\ \text{расх.};\ \alpha=1:\ \beta>1\ \text{сх.},\ \beta\le1\ \text{расх.}`,
		body: String.raw`Признак для рядов, у которых отношение соседних членов раскладывается по степеням $1/n$. Удобен тем, что закрывает и критический случай $\alpha=1$, $\beta=1$, где [[priznak-raabe|Раабе]] бессилен.`,
		related: ['priznak-raabe', 'priznak-bertrana', 'asimptoticheskie-klassy']
	},

	'ierarhiya-priznakov': {
		id: 'ierarhiya-priznakov',
		term: 'Иерархия признаков сходимости',
		short: String.raw`Д'Аламбер ⊂ Раабе ⊂ Бертран — три подстановки в одну схему.`,
		formula: String.raw`C_n\equiv1\Rightarrow K_n=\frac{a_n}{a_{n+1}}-1;\qquad C_n=n\Rightarrow K_n=R_n-1;\qquad C_n=n\ln n\Rightarrow K_n=B_n-1+o(1)`,
		body: String.raw`Порядок по силе, в котором именные признаки получаются подстановкой разных $\{C_n\}$ в [[priznak-kummera|схему Куммера]]: каждый следующий отвечает всюду, где ответил предыдущий. [[radikalnyy-priznak-koshi|Радикальный Коши]] в цепочку не входит.`,
		related: ['priznak-kummera', 'priznak-raabe', 'priznak-bertrana']
	},

	'teleskopicheskaya-otsenka': {
		id: 'teleskopicheskaya-otsenka',
		term: 'Телескопическая оценка',
		short: String.raw`Сумма разностей соседних членов сворачивается в разность концов.`,
		formula: String.raw`\sum_{n=N+1}^{M}\bigl(d_n-d_{n+1}\bigr)=d_{N+1}-d_{M+1}`,
		body: String.raw`Приём: если слагаемые представимы разностями соседних членов вспомогательной последовательности, сумма сворачивается в два крайних члена — это [[teleskopicheskaya-summa|телескопическая сумма]].`,
		related: ['teleskopicheskaya-summa', 'chastichnaya-summa']
	},

	'dvoynoy-faktorial': {
		id: 'dvoynoy-faktorial',
		term: 'Двойной факториал',
		short: String.raw`Произведение через один: $(2n)!!$ — чётные, $(2n-1)!!$ — нечётные.`,
		formula: String.raw`(2n)!!=2\cdot4\cdots(2n),\qquad (2n-1)!!=1\cdot3\cdots(2n-1)`,
		body: String.raw`Произведение натуральных чисел одной чётности до данного. Это не «факториал от факториала»: множители идут через один.`,
		related: ['naturalnye-chisla']
	},

	'ryad-bertrana': {
		id: 'ryad-bertrana',
		term: 'Ряд Бертрана',
		short: String.raw`$\sum 1/(n\ln^p n)$ — сходится ровно при $p>1$.`,
		formula: String.raw`\sum_{n=2}^{\infty}\frac{1}{n\ln^{p}n}\ \text{сх.}\iff p>1`,
		body: String.raw`Эталонное семейство рядов с логарифмом в знаменателе. Порог получается [[integralnyy-kriteriy-koshi|интегральным критерием]] заменой $z=\ln x$.`,
		related: ['integralnyy-kriteriy-koshi', 'priznak-bertrana']
	},

	'gipergeometricheskiy-ryad': {
		id: 'gipergeometricheskiy-ryad',
		term: 'Гипергеометрический ряд',
		short: String.raw`Отношение соседних членов — дробь двух многочленов.`,
		formula: String.raw`u_1=1,\ \ \frac{u_{n+1}}{u_n}=\frac{(n+a)(n+b)}{(n+c)(n+1)}\ \Longrightarrow\ \sum u_n\ \text{сх.}\iff c>a+b`,
		body: String.raw`Ряд, у которого отношение соседних членов задано дробью двух многочленов от номера. Сходится ровно при $c>a+b$; критерий читается прямо с коэффициентов по [[priznak-gaussa|признаку Гаусса]].`,
		related: ['priznak-gaussa', 'priznak-raabe']
	}
};
