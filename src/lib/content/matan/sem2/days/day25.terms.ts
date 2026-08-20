import type { Glossary } from '$lib/types';

// Термины дня 25 (несобственные интегралы).
export const day25Terms: Glossary = {
	'nesobstvennyy-integral-i-roda': {
		id: 'nesobstvennyy-integral-i-roda',
		term: 'Несобственный интеграл I рода',
		short: String.raw`Интеграл по неограниченной области.`,
		formula: String.raw`\int_a^{+\infty} f(x)\,dx=\lim_{A\to+\infty}\int_a^{A}f(x)\,dx`,
		body: String.raw`Интеграл, у которого [[neogranichennaya-oblast|область интегрирования]] неограниченна. Определяется предельным переходом: берут интеграл по срезанной области и устремляют границу в бесконечность.`,
		related: ['neogranichennaya-oblast', 'shodimost-integrala', 'nesobstvennyy-integral-ii-roda']
	},

	'nesobstvennyy-integral-ii-roda': {
		id: 'nesobstvennyy-integral-ii-roda',
		term: 'Несобственный интеграл II рода',
		short: String.raw`Неограниченная функция на конечном промежутке.`,
		formula: String.raw`\int_0^1\frac{dx}{\sqrt x}=\lim_{\varepsilon\to+0}\int_\varepsilon^1\frac{dx}{\sqrt x}=2`,
		body: String.raw`Интеграл по конечному промежутку от функции, неограниченной около [[osobaya-tochka|особой точки]]. Определяется тем же приёмом: от особой точки отступают на $\varepsilon$ и берут предел при $\varepsilon\to+0$.`,
		related: ['osobaya-tochka', 'nesobstvennyy-integral-i-roda', 'shodimost-integrala']
	},

	'shodimost-integrala': {
		id: 'shodimost-integrala',
		term: 'Сходимость интеграла',
		short: String.raw`Существование конечного предела усечённых интегралов.`,
		formula: String.raw`\int_a^{+\infty}f\ \text{сходится}\iff\exists\lim_{A\to+\infty}\int_a^{A}f(x)\,dx\in\mathbb R`,
		body: String.raw`Несобственный интеграл **сходится**, если предел интегралов по срезанной области существует и конечен. Если особенностей несколько, промежуток режут так, чтобы в каждом куске была одна, и требуют сходимости каждого куска по своему параметру.`,
		related: ['rashodimost-integrala', 'nesobstvennyy-integral-i-roda', 'osobaya-tochka']
	},

	'rashodimost-integrala': {
		id: 'rashodimost-integrala',
		term: 'Расходимость интеграла',
		short: String.raw`Предела усечённых интегралов нет или он бесконечен.`,
		formula: String.raw`\int_0^c\frac{dx}{x}=\lim_{\varepsilon\to+0}\bigl(\ln c-\ln\varepsilon\bigr)=+\infty`,
		body: String.raw`Отрицание [[shodimost-integrala|сходимости]]: предел усечённых интегралов либо бесконечен, либо не существует вовсе.`,
		related: ['shodimost-integrala', 'osobaya-tochka']
	},

	'osobaya-tochka': {
		id: 'osobaya-tochka',
		term: 'Особая точка',
		short: String.raw`Место, около которого интеграл Римана не определён.`,
		formula: String.raw`\lim_{x\to a+0}|f(x)|=+\infty`,
		body: String.raw`Точка, вблизи которой обычное определение интеграла неприменимо: функция уходит в бесконечность либо сама область неограниченна. Особую точку внутри промежутка обязательно выделяют, разрезая по ней промежуток.`,
		related: ['nesobstvennyy-integral-ii-roda', 'shodimost-integrala', 'glavnoe-znachenie']
	},

	'granica-1-na-epsilon': {
		id: 'granica-1-na-epsilon',
		term: 'Граница $1/\\varepsilon$',
		short: String.raw`Оба рода обслуживает один параметр $\varepsilon\to+0$.`,
		formula: String.raw`\int_a^{+\infty}f=\lim_{\varepsilon\to+0}\int_a^{1/\varepsilon}f`,
		body: String.raw`Запись предельного перехода, при которой граница срезания ставится в точку $1/\varepsilon$. Замена $A=1/\varepsilon$ — биекция, поэтому такая запись равносильна переходу $A\to+\infty$.`,
		related: ['shodimost-integrala', 'nesobstvennyy-integral-i-roda']
	},

	'svedenie-ii-k-i': {
		id: 'svedenie-ii-k-i',
		term: 'Сведение II рода к I',
		short: String.raw`Сдвиг особенности в нуль и инверсия $x=1/t$.`,
		formula: String.raw`\int_a^b f(x)\,dx=\int_{\frac{1}{b-a}}^{+\infty}f\Bigl(a+\frac1t\Bigr)\frac{dt}{t^{2}}`,
		body: String.raw`[[zamena-peremennoy|Замена]], переводящая интеграл [[nesobstvennyy-integral-ii-roda|II рода]] в интеграл [[nesobstvennyy-integral-i-roda|I рода]]: сдвиг переносит [[osobaya-tochka|особую точку]] в нуль, а инверсия выворачивает её окрестность в окрестность бесконечности.`,
		related: ['zamena-peremennoy', 'nesobstvennyy-integral-i-roda', 'nesobstvennyy-integral-ii-roda']
	},

	'etalonnyy-integral': {
		id: 'etalonnyy-integral',
		term: 'Эталонный интеграл $\\int x^{\\mu}dx$',
		short: String.raw`У нуля нужно $\mu>-1$, на бесконечности $\mu<-1$.`,
		formula: String.raw`\int_0^a x^{\mu}dx\ \text{сх.}\iff\mu>-1,\qquad \int_b^{+\infty}x^{\mu}dx\ \text{сх.}\iff\mu<-1`,
		body: String.raw`Степенная функция как образец для сравнения. Условия на показатель у нуля и на бесконечности противоположны, поэтому $1/x$ [[rashodimost-integrala|расходится]] в обоих случаях, а сходящейся сразу на всей полупрямой степени не существует.`,
		related: ['shodimost-integrala', 'rashodimost-integrala']
	},

	'absolyutnaya-shodimost': {
		id: 'absolyutnaya-shodimost',
		term: 'Абсолютная сходимость',
		short: String.raw`Сходится интеграл (ряд) от модуля.`,
		formula: String.raw`\int|f(x)|\,dx\ \text{сх.}\qquad\qquad\sum|f_n|\ \text{сх.}`,
		body: String.raw`Свойство объекта, у которого сходится не он сам, а сумма или интеграл его [[modul-chisla|модуля]]. Определение дословно одинаково для интеграла и для ряда.`,
		related: ['modul-chisla', 'shodimost-integrala', 'uslovnaya-shodimost']
	},

	'uslovnaya-shodimost': {
		id: 'uslovnaya-shodimost',
		term: 'Условная сходимость',
		short: String.raw`Объект сходится, а модуль расходится.`,
		formula: String.raw`\int f\ \text{сх.},\quad \int|f|\ \text{расх.}`,
		body: String.raw`Сходимость без [[absolyutnaya-shodimost|абсолютной сходимости]]. Обе половины условия обязательны: без второй определение вырождается в обычную [[shodimost-integrala|сходимость]].`,
		related: ['absolyutnaya-shodimost', 'shodimost-integrala']
	},

	'glavnoe-znachenie': {
		id: 'glavnoe-znachenie',
		term: 'Главное значение',
		short: String.raw`Симметричное срезание обеих особенностей одним параметром.`,
		formula: String.raw`\mathrm{V.p.}\int_{\mathbb R}f(x)\,dx=\lim_{\varepsilon\to+0}\int_{-\frac1\varepsilon}^{\frac1\varepsilon}f(x)\,dx`,
		body: String.raw`Значение, получаемое согласованным срезанием обеих особенностей **одним** параметром. Оно слабее [[shodimost-integrala|сходимости]], которая требует двух независимых предельных переходов: главное значение может существовать у расходящегося интеграла.`,
		related: ['shodimost-integrala', 'osobaya-tochka', 'rashodimost-integrala']
	},

	'kvadraturnaya-formula': {
		id: 'kvadraturnaya-formula',
		term: 'Квадратурная формула',
		short: String.raw`Приближение интеграла конечной суммой значений функции.`,
		formula: String.raw`\int_a^b f(x)\,dx\approx\sum_{k} w_k\,f(x_k)`,
		body: String.raw`Численное приближение интеграла: узлы $x_k$ и веса $w_k$ подбирают так, чтобы формула была точна на многочленах невысокой степени.`,
		related: ['integralnaya-summa', 'opredelennyy-integral']
	},

	'neogranichennaya-oblast': {
		id: 'neogranichennaya-oblast',
		term: 'Неограниченная область',
		short: String.raw`Область, которую не накрыть ни одним шаром.`,
		formula: String.raw`\forall r>0\ \ \forall x\ \ D\not\subset B_x(r)`,
		body: String.raw`Множество, не помещающееся ни в какой шар конечного радиуса. Обычное определение интеграла к нему неприменимо: [[rang-razbieniya|ранг]] любого конечного разбиения бесконечен.`,
		related: ['rang-razbieniya', 'nesobstvennyy-integral-i-roda']
	}
};
