import type { Glossary } from '$lib/types';

// Термины дня 22 (простейшие дроби и избавление от иррациональностей).
export const day22Terms: Glossary = {
	'neprivodimyy-mnogochlen': {
		id: 'neprivodimyy-mnogochlen',
		term: 'Неприводимый над $\\mathbb R$ многочлен',
		short: String.raw`Линейный многочлен или квадратный трёхчлен с $D<0$.`,
		formula: String.raw`x-a\quad\text{или}\quad x^2+px+q,\ \ D=p^2-4q<0`,
		body: String.raw`Многочлен, не разложимый в произведение многочленов меньшей степени с вещественными коэффициентами. Над $\mathbb R$ такими бывают только линейные и квадратные с отрицательным дискриминантом.`,
		related: ['sopryazhennye-korni', 'kratnost-kornya', 'prosteyshaya-drob']
	},

	'sopryazhennye-korni': {
		id: 'sopryazhennye-korni',
		term: 'Комплексно-сопряжённые корни',
		short: String.raw`У вещественного многочлена невещественные корни идут парами $z$ и $\bar z$.`,
		formula: String.raw`P(z)=0\Rightarrow P(\bar z)=0,\qquad (x-z)(x-\bar z)=x^2+px+q`,
		body: String.raw`Если у многочлена с вещественными коэффициентами есть невещественный корень, то сопряжённое к нему число — тоже корень той же [[kratnost-kornya|кратности]], а произведение отвечающих им множителей вещественно.`,
		related: ['kratnost-kornya', 'neprivodimyy-mnogochlen']
	},

	'prostranstvo-mnogochlenov': {
		id: 'prostranstvo-mnogochlenov',
		term: 'Пространство многочленов $\\mathbb R_{<n}[x]$',
		short: String.raw`Многочлены степени меньше $n$; его размерность равна $n$.`,
		formula: String.raw`\mathbb R_{<n}[x]=\{c_0+c_1x+\dots+c_{n-1}x^{n-1}\},\qquad \dim=n`,
		body: String.raw`Многочлены степени строго меньше $n$ образуют [[lineynoe-prostranstvo|линейное пространство]] размерности $n$ с [[bazis-i-koordinaty|базисом]] $1,x,\dots,x^{n-1}$.`,
		related: ['lineynoe-prostranstvo', 'bazis-i-koordinaty']
	},

	'racionalnaya-parametrizaciya': {
		id: 'racionalnaya-parametrizaciya',
		term: 'Рациональная параметризация кривой',
		short: String.raw`Точки кривой выражаются рациональными функциями одного параметра.`,
		formula: String.raw`y^2=ax^2+bx+c:\qquad x=x(t),\ y=y(t)\ \text{— рациональные}`,
		body: String.raw`Задание точек кривой дробями от одного параметра. Стандартный приём получения — провести прямую через фиксированную точку кривой и взять вторую точку пересечения.`,
		related: ['rod-krivoy', 'podstanovka-eylera']
	},

	'rod-krivoy': {
		id: 'rod-krivoy',
		term: 'Род кривой',
		short: String.raw`Род нуль — параметризуется рационально, род один — уже нет.`,
		formula: String.raw`y^2=P(x):\quad \deg P\le2\Rightarrow\text{род }0;\qquad \deg P\in\{3,4\}\Rightarrow\text{род }1`,
		body: String.raw`Инвариант алгебраической кривой, отвечающий за существование [[racionalnaya-parametrizaciya|рациональной параметризации]]: она есть ровно у кривых рода нуль.`,
		related: ['racionalnaya-parametrizaciya', 'ellipticheskiy-integral']
	},

	'teorema-liuvillya': {
		id: 'teorema-liuvillya',
		term: 'Теорема Лиувилля об элементарных первообразных',
		short: String.raw`Критерий того, когда первообразная выражается в элементарных функциях.`,
		formula: String.raw`\int e^{-x^2}dx,\quad \int\frac{dx}{\ln x}\ \notin\ \text{элементарные}`,
		body: String.raw`Теорема описывает вид, который обязана иметь [[pervoobraznaya|первообразная]], если она [[elementarnaya-funkciya|элементарна]]: элементарная функция плюс линейная комбинация логарифмов. Проверкой этого условия и доказывают неэлементарность конкретных интегралов.`,
		related: ['elementarnaya-funkciya', 'pervoobraznaya', 'ellipticheskiy-integral']
	},

	polyus: {
		id: 'polyus',
		term: 'Полюс рациональной дроби',
		short: String.raw`Корень знаменателя, не сократившийся с числителем.`,
		formula: String.raw`Q(a)=0,\ P(a)\ne0\ \Rightarrow\ a\ \text{— полюс кратности }k`,
		body: String.raw`Точка, где дробь уходит в бесконечность: корень знаменателя, уцелевший после сокращения. Его [[kratnost-kornya|кратность]] определяет, сколько слагаемых даёт этот полюс в разложении на [[prosteyshaya-drob|простейшие дроби]].`,
		related: ['kratnost-kornya', 'prosteyshaya-drob', 'pravilnaya-drob']
	},

	'pravilnaya-drob': {
		id: 'pravilnaya-drob',
		term: 'Правильная дробь',
		short: String.raw`Степень числителя меньше степени знаменателя.`,
		formula: String.raw`\frac{P}{Q},\ \deg P<\deg Q;\qquad \frac{P}{Q}=S(x)+\frac{R_0(x)}{Q(x)}`,
		body: String.raw`Рациональная дробь, у которой $\deg P<\deg Q$. Неправильную дробь сначала делят с остатком, выделяя многочлен и правильный остаток. Правильность — условие теоремы о разложении на [[prosteyshaya-drob|простейшие дроби]].`,
		related: ['prosteyshaya-drob', 'prostranstvo-mnogochlenov']
	},

	'prosteyshaya-drob': {
		id: 'prosteyshaya-drob',
		term: 'Простейшая дробь',
		short: String.raw`Один из четырёх типов дробей, на которые распадается правильная дробь.`,
		formula: String.raw`\frac{A}{x-a},\quad \frac{A}{(x-a)^k},\quad \frac{Mx+N}{x^2+px+q},\quad \frac{Mx+N}{(x^2+px+q)^k},\ \ p^2-4q<0`,
		body: String.raw`Дробь, знаменатель которой — степень [[neprivodimyy-mnogochlen|неприводимого многочлена]], а числитель имеет меньшую степень. Типов ровно четыре, потому что над $\mathbb R$ неприводимы только линейные и квадратичные множители.`,
		related: ['neprivodimyy-mnogochlen', 'pravilnaya-drob', 'polyus']
	},

	'metod-neopredelennyh-koefficientov': {
		id: 'metod-neopredelennyh-koefficientov',
		term: 'Метод неопределённых коэффициентов',
		short: String.raw`Приравнивание коэффициентов при одинаковых степенях.`,
		formula: String.raw`P(x)\equiv\sum_{i,\nu}A_{i\nu}\frac{Q(x)}{(x-a_i)^{\nu}}+\dots`,
		body: String.raw`Способ найти числители [[prosteyshaya-drob|простейших дробей]]: обе части тождества приводят к общему знаменателю, приравнивают коэффициенты при одинаковых степенях и решают линейную систему.`,
		related: ['prosteyshaya-drob', 'metod-podstanovki-korney', 'pravilnaya-drob']
	},

	'metod-podstanovki-korney': {
		id: 'metod-podstanovki-korney',
		term: 'Метод подстановки корней',
		short: String.raw`Подстановка корня знаменателя гасит все слагаемые, кроме одного.`,
		formula: String.raw`x=a_i\ \Rightarrow\ A_{ik_i}=\left.\frac{P(x)(x-a_i)^{k_i}}{Q(x)}\right|_{x=a_i}`,
		body: String.raw`Приём поиска коэффициентов разложения: в тождество числителей подставляют [[polyus|корень знаменателя]], после чего все слагаемые, кроме одного, обращаются в нуль.`,
		related: ['polyus', 'metod-neopredelennyh-koefficientov', 'prosteyshaya-drob']
	},

	'vydelenie-polnogo-kvadrata': {
		id: 'vydelenie-polnogo-kvadrata',
		term: 'Выделение полного квадрата',
		short: String.raw`Сдвиг $t=x+p/2$, после которого трёхчлен становится $t^2+a^2$.`,
		formula: String.raw`x^2+px+q=\left(x+\frac p2\right)^2+a^2,\qquad a^2=q-\frac{p^2}{4}`,
		body: String.raw`Сдвиг переменной, убирающий линейный член квадратного трёхчлена. Условие $a^2>0$ равносильно отрицательности дискриминанта, то есть [[neprivodimyy-mnogochlen|неприводимости]] трёхчлена.`,
		related: ['neprivodimyy-mnogochlen', 'zamena-peremennoy']
	},

	'rekurrentnaya-formula': {
		id: 'rekurrentnaya-formula',
		term: 'Рекуррентная формула для $I_k$',
		short: String.raw`Понижает степень знаменателя в $\int\frac{dt}{(t^2+a^2)^k}$ на единицу.`,
		formula: String.raw`I_{k+1}=\frac{t}{2ka^2(t^2+a^2)^k}+\frac{2k-1}{2ka^2}I_k,\qquad I_1=\frac1a\operatorname{arctg}\frac ta`,
		body: String.raw`Формула, сводящая интеграл $I_{k+1}$ к $I_k$; за $k-1$ шагов приводит к арктангенсу. Проверяется прямым дифференцированием правой части.`,
		related: ['prosteyshaya-drob', 'vydelenie-polnogo-kvadrata']
	},

	'podstanovka-eylera': {
		id: 'podstanovka-eylera',
		term: 'Подстановка Эйлера',
		short: String.raw`Три замены, рационализующие $R(x,\sqrt{ax^2+bx+c})$.`,
		formula: String.raw`a>0:\ \sqrt{ax^2+bx+c}=t\pm x\sqrt a;\quad c>0:\ =xt\pm\sqrt c;\quad \exists x_1:\ =t(x-x_1)`,
		body: String.raw`Три подстановки, после которых $x$, $dx$ и сам корень выражаются рациональными функциями новой переменной. Вместе они покрывают все невырожденные квадратные трёхчлены под корнем.`,
		related: ['racionalnaya-parametrizaciya', 'zamena-peremennoy', 'prosteyshaya-drob']
	},

	'trigonometricheskaya-podstanovka': {
		id: 'trigonometricheskaya-podstanovka',
		term: 'Тригонометрическая подстановка',
		short: String.raw`Три замены под три вида корня: $\sin$, $\operatorname{tg}$ и $1/\cos$.`,
		formula: String.raw`\sqrt{a^2-x^2}:\ x=a\sin t;\quad \sqrt{a^2+x^2}:\ x=a\operatorname{tg}t;\quad \sqrt{x^2-a^2}:\ x=\frac{a}{\cos t}`,
		body: String.raw`Замены, снимающие корень с помощью тригонометрических тождеств $1-\sin^2t=\cos^2t$, $1+\operatorname{tg}^2t=1/\cos^2t$ и $1/\cos^2t-1=\operatorname{tg}^2t$.`,
		related: ['zamena-peremennoy', 'vydelenie-polnogo-kvadrata', 'universalnaya-podstanovka']
	},

	'drobno-lineynaya-podstanovka': {
		id: 'drobno-lineynaya-podstanovka',
		term: 'Дробно-линейная подстановка',
		short: String.raw`Замена $t^n=\frac{ax+b}{cx+d}$ убирает корень степени $n$.`,
		formula: String.raw`t^{\,n}=\frac{ax+b}{cx+d}\ \Longrightarrow\ x=\frac{d\,t^{\,n}-b}{a-c\,t^{\,n}}`,
		body: String.raw`Замена, при которой новая переменная сама и есть корень, а $x$ выражается через неё рациональной функцией — значит, рационален и $dx$. Несколько разных корней снимаются общей заменой с показателем, равным их НОК.`,
		related: ['zamena-peremennoy', 'prosteyshaya-drob']
	},

	'universalnaya-podstanovka': {
		id: 'universalnaya-podstanovka',
		term: 'Универсальная подстановка $t=\\operatorname{tg}\\frac x2$',
		short: String.raw`Рационализует интеграл от рациональной функции синуса и косинуса.`,
		formula: String.raw`\sin x=\frac{2t}{1+t^2},\qquad \cos x=\frac{1-t^2}{1+t^2},\qquad dx=\frac{2\,dt}{1+t^2}`,
		body: String.raw`Замена, превращающая любое рациональное выражение от $\sin x$ и $\cos x$ в рациональную функцию новой переменной. Работает всегда, но заметно повышает степень знаменателя.`,
		related: ['racionalnaya-parametrizaciya', 'zamena-peremennoy', 'prosteyshaya-drob']
	},

	'elementarnaya-funkciya': {
		id: 'elementarnaya-funkciya',
		term: 'Элементарная функция',
		short: String.raw`Конечная композиция степенных, экспоненты, логарифма и тригонометрии.`,
		body: String.raw`Функция, получаемая из констант и $x$ конечным числом арифметических операций и [[kompoziciya|композиций]] со степенной, показательной, логарифмической, тригонометрическими и обратными к ним функциями. Класс замкнут относительно дифференцирования, но не интегрирования.`,
		related: ['kompoziciya', 'funkciya', 'ellipticheskiy-integral']
	},

	'ellipticheskiy-integral': {
		id: 'ellipticheskiy-integral',
		term: 'Эллиптический интеграл',
		short: String.raw`Интеграл от $R(x,\sqrt{P})$ с кубическим или биквадратным $P$.`,
		formula: String.raw`\int\frac{R(x)\,dx}{\sqrt{P(x)}},\qquad \deg P\in\{3,4\},\ \text{корни различны}`,
		body: String.raw`Интеграл, у которого под корнем стоит многочлен степени три или четыре с различными корнями. В [[elementarnaya-funkciya|элементарных функциях]] не выражается: соответствующая кривая имеет [[rod-krivoy|род один]].`,
		related: ['elementarnaya-funkciya', 'rod-krivoy', 'teorema-liuvillya']
	}
};
