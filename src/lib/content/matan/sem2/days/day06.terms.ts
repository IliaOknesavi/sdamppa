import type { Glossary } from '$lib/types';

// Термины дня 6 (правило Лопиталя и теорема Штольца).
export const day06Terms: Glossary = {
	'pravilo-lopitalya': {
		id: 'pravilo-lopitalya',
		term: 'Правило Лопиталя',
		short: String.raw`Предел отношения равен пределу отношения производных.`,
		formula: String.raw`\lim_{x\to x_0}\frac{f(x)}{g(x)}=\lim_{x\to x_0}\frac{f'(x)}{g'(x)}`,
		body: String.raw`Пусть на [[vykolotaya-okrestnost|выколотой окрестности]] точки $x_0$ функции $f,g$ дифференцируемы, $g'\ne0$, обе стремятся к нулю (либо $|g|\to\infty$) и существует $\lim\frac{f'}{g'}$. Тогда $\lim\frac fg$ существует и равен ему.`,
		related: ['neopredelennost-nol-na-nol', 'teorema-koshi-o-srednem', 'vykolotaya-okrestnost']
	},

	'teorema-shtolca': {
		id: 'teorema-shtolca',
		term: 'Теорема Штольца',
		short: String.raw`Дискретный аналог Лопиталя: отношение членов через отношение разностей.`,
		formula: String.raw`\lim_{n\to\infty}\frac{x_n}{y_n}=\lim_{n\to\infty}\frac{x_{n+1}-x_n}{y_{n+1}-y_n}`,
		body: String.raw`Пусть $\{y_n\}$ строго возрастает начиная с некоторого номера, $y_n\to+\infty$ и существует предел отношения разностей. Тогда $\frac{x_n}{y_n}$ имеет тот же предел. Это [[priznak-i-svoystvo|признак]], а не критерий: обратное неверно.`,
		related: ['pravilo-lopitalya', 'priznak-i-svoystvo', 'predel-posledovatelnosti']
	},

	'neopredelennost-nol-na-nol': {
		id: 'neopredelennost-nol-na-nol',
		term: 'Неопределённость $\\frac00$',
		short: String.raw`Предел отношения двух бесконечно малых.`,
		formula: String.raw`\lim f=\lim g=0,\qquad \lim\frac fg=\ ?`,
		body: String.raw`Предел отношения, у которого числитель и знаменатель стремятся к нулю. Пределами $f$ и $g$ ответ не определяется: $\frac xx\to1$, $\frac{x^2}{x}\to0$, $\frac{x}{x^3}\to\infty$, а у $\frac{x\sin(1/x)}{x}$ предела нет.`,
		related: ['neopredelennost-beskonechnost', 'pravilo-lopitalya', 'predel-funkcii']
	},

	'neopredelennost-beskonechnost': {
		id: 'neopredelennost-beskonechnost',
		term: 'Неопределённость $\\frac\\infty\\infty$',
		short: String.raw`Предел отношения двух бесконечно больших.`,
		formula: String.raw`\lim|f|=\lim|g|=+\infty,\qquad \lim\frac fg=\ ?`,
		body: String.raw`Предел отношения, у которого обе функции неограниченно растут по модулю. Как и у [[neopredelennost-nol-na-nol|$\frac00$]], ответ не определяется пределами частей: это одно из выражений, помеченных в арифметике [[rasshirennaya-pryamaya|расширенной прямой]] как неопределённое.`,
		related: ['neopredelennost-nol-na-nol', 'rasshirennaya-pryamaya']
	},

	'zaciklivanie-lopitalya': {
		id: 'zaciklivanie-lopitalya',
		term: 'Зацикливание правила Лопиталя',
		short: String.raw`Отношение производных возвращает исходную дробь.`,
		formula: String.raw`\frac{\sqrt{x^2+1}}{x}\ \longrightarrow\ \frac{x}{\sqrt{x^2+1}}\ \longrightarrow\ \frac{\sqrt{x^2+1}}{x}`,
		body: String.raw`Ситуация, когда переход от $(f,g)$ к $(f',g')$ воспроизводит исходное выражение, и [[pravilo-lopitalya|правило]] не приближает к ответу. Ошибки в нём при этом нет — оно просто неинформативно, и предел приходится искать другим способом.`,
		related: ['pravilo-lopitalya', 'neopredelennost-beskonechnost']
	},

	'predelnyy-perekhod-po-geyne': {
		id: 'predelnyy-perekhod-po-geyne',
		term: 'Предельный переход по Гейне',
		short: String.raw`Предел функции — через произвольную последовательность $x_n\to x_0$, $x_n\ne x_0$.`,
		formula: String.raw`\forall\{x_n\}:\ x_n\to x_0,\ x_n\ne x_0\ \Rightarrow\ f(x_n)\to A`,
		body: String.raw`Определение [[predel-funkcii|предела функции]] через последовательности: $A$ — предел $f$ в точке $x_0$, если для **любой** последовательности аргументов из [[vykolotaya-okrestnost|выколотой окрестности]], сходящейся к $x_0$, значения сходятся к $A$. Произвольность последовательности существенна.`,
		related: ['predel-funkcii', 'predel-posledovatelnosti', 'vykolotaya-okrestnost']
	},

	'srednie-chezaro': {
		id: 'srednie-chezaro',
		term: 'Средние Чезаро',
		short: String.raw`Среднее арифметическое сходящейся последовательности идёт к тому же пределу.`,
		formula: String.raw`a_n\to a\ \Rightarrow\ \frac{a_1+a_2+\dots+a_n}{n}\to a`,
		body: String.raw`Если $a_n\to a$, то и средние арифметические $\frac{a_1+\dots+a_n}{n}$ сходятся к $a$. Обратное неверно: у $a_n=(-1)^n$ средние стремятся к нулю, а сама последовательность расходится.`,
		related: ['teorema-shtolca', 'predel-posledovatelnosti']
	},

	'beskonechno-bolshaya-posledovatelnost': {
		id: 'beskonechno-bolshaya-posledovatelnost',
		term: 'Бесконечно большая последовательность',
		short: String.raw`$|x_n|\to+\infty$; уходить именно в $+\infty$ она не обязана.`,
		formula: String.raw`\forall E>0\ \exists N\ \forall n>N:\ |x_n|>E`,
		body: String.raw`[[posledovatelnost|Последовательность]], модуль которой неограниченно растёт. Неограниченности для этого мало: $0,2,0,4,0,6,\dots$ неограниченна, но бесконечно большой не является — бесконечно много её членов равны нулю.`,
		related: ['posledovatelnost', 'rasshirennaya-pryamaya']
	}
};
