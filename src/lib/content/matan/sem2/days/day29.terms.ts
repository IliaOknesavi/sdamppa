import type { Glossary } from '$lib/types';

// Термины дня 29 (равномерная сходимость функциональных последовательностей).
export const day29Terms: Glossary = {
	'potochechnaya-shodimost': {
		id: 'potochechnaya-shodimost',
		term: 'Поточечная сходимость',
		short: String.raw`Свой номер $N(\varepsilon,x)$ в каждой точке.`,
		formula: String.raw`\forall x\in D\ \forall\varepsilon>0\ \exists N(\varepsilon,x)\ \forall n>N:\ |f_n(x)-f(x)|<\varepsilon`,
		body: String.raw`Сходимость последовательности функций, проверяемая отдельно в каждой точке: [[kvantory|квантор]] по $x$ стоит снаружи, поэтому [[n-ot-epsilon|номер]] вправе зависеть и от $\varepsilon$, и от точки.`,
		related: ['ravnomernaya-shodimost', 'predel-posledovatelnosti']
	},

	'ravnomernaya-shodimost': {
		id: 'ravnomernaya-shodimost',
		term: 'Равномерная сходимость',
		short: String.raw`Один номер $N(\varepsilon)$ обслуживает все точки сразу.`,
		formula: String.raw`\forall\varepsilon>0\ \exists N\ \forall n>N\ \forall x\in D:\ |f_n(x)-f(x)|<\varepsilon`,
		body: String.raw`От [[potochechnaya-shodimost|поточечной сходимости]] отличается порядком кванторов: $\exists N$ стоит левее $\forall x$, то есть один номер годится сразу для всех точек области.`,
		related: ['potochechnaya-shodimost', 'metrika-ravnomernoy-shodimosti']
	},

	'metrika-ravnomernoy-shodimosti': {
		id: 'metrika-ravnomernoy-shodimosti',
		term: 'Метрика равномерной сходимости',
		short: String.raw`$\rho(f_1,f_2)=\max|f_1-f_2|$ — расстояние между функциями.`,
		formula: String.raw`\rho(f_1,f_2)=\max_{x\in[a;b]}\bigl|f_1(x)-f_2(x)\bigr|`,
		body: String.raw`Метрика на функциях, для которой [[ravnomernaya-shodimost|равномерная сходимость]] равносильна обычной сходимости точек: $f_n\rightrightarrows f$ тогда и только тогда, когда $\rho(f_n,f)\to0$. Для разрывных функций максимум заменяют на [[supremum|супремум]].`,
		related: ['ravnomernaya-shodimost', 'aksiomy-metriki', 'supremum']
	},

	'funkcionalnoe-prostranstvo': {
		id: 'funkcionalnoe-prostranstvo',
		term: 'Функциональное пространство',
		short: String.raw`Множество функций как метрическое пространство.`,
		formula: String.raw`C[a;b]=\{f:[a;b]\to\mathbb R\ \text{непрерывна}\}`,
		body: String.raw`Множество функций на отрезке, рассматриваемое как метрическое пространство с [[metrika-ravnomernoy-shodimosti|метрикой равномерной сходимости]]. Точкой такого пространства служит целая функция.`,
		related: ['metrika-ravnomernoy-shodimosti', 'lineynoe-prostranstvo', 'funkciya']
	},

	'shar-v-funkcionalnom-prostranstve': {
		id: 'shar-v-funkcionalnom-prostranstve',
		term: 'Шар в функциональном пространстве',
		short: String.raw`Трубка ширины $2\varepsilon$ вокруг графика.`,
		formula: String.raw`B_\varepsilon(f)=\{g:\ \max_{x\in[a;b]}|g(x)-f(x)|<\varepsilon\}`,
		body: String.raw`Множество функций, отстоящих от данной меньше чем на $\varepsilon$ в [[metrika-ravnomernoy-shodimosti|метрике]] $\rho$. Геометрически это полоса вокруг графика центра.`,
		related: ['metrika-ravnomernoy-shodimosti', 'funkcionalnoe-prostranstvo', 'okrestnost']
	},

	'lambda-notaciya': {
		id: 'lambda-notaciya',
		term: 'λ-нотация',
		short: String.raw`$\lambda x{:}\ x^2$ — запись функции без имени.`,
		formula: String.raw`\lambda x{:}\ x^2`,
		body: String.raw`Способ записать [[otobrazhenie|отображение]] $x\mapsto x^2$, не давая ему имени. Нужна там, где функция сама выступает аргументом — например, центром шара в [[funkcionalnoe-prostranstvo|функциональном пространстве]].`,
		related: ['otobrazhenie', 'funkcionalnoe-prostranstvo']
	},

	'nepreryvnost-predelnoy-funkcii': {
		id: 'nepreryvnost-predelnoy-funkcii',
		term: 'Непрерывность предельной функции',
		short: String.raw`Равномерный предел непрерывных функций непрерывен.`,
		formula: String.raw`f_n\in C[a;b],\ f_n\rightrightarrows f\ \Longrightarrow\ f\in C[a;b]`,
		body: String.raw`Если непрерывные функции сходятся [[ravnomernaya-shodimost|равномерно]], предельная функция тоже непрерывна. В [[kontrapoziciya|контрапозиции]]: разрывный предел означает, что сходимость не равномерна.`,
		related: ['ravnomernaya-shodimost', 'nepreryvnost', 'kontrapoziciya']
	},

	'polnota-funkcionalnogo-prostranstva': {
		id: 'polnota-funkcionalnogo-prostranstva',
		term: 'Полнота $C[a;b]$',
		short: String.raw`Сходящаяся в себе последовательность непрерывных имеет непрерывный предел.`,
		formula: String.raw`\rho(f_n,f_{n+p})<\varepsilon\ \ \forall p\ \Longrightarrow\ \exists f\in C[a;b]:\ f_n\rightrightarrows f`,
		body: String.raw`Пространство непрерывных функций с [[metrika-ravnomernoy-shodimosti|метрикой]] $\rho$ полно: всякая [[skhodyashchayasya-v-sebe|сходящаяся в себе]] последовательность сходится в нём равномерно к непрерывной функции.`,
		related: ['skhodyashchayasya-v-sebe', 'funkcionalnoe-prostranstvo', 'nepreryvnost-predelnoy-funkcii']
	},

	'dvuhparametricheskaya-funkciya': {
		id: 'dvuhparametricheskaya-funkciya',
		term: 'Равномерность по непрерывному параметру',
		short: String.raw`$f_t(x)$: по $t$ берут предел, по $x$ требуют равномерности.`,
		formula: String.raw`\forall\varepsilon>0\ \exists\delta>0\ \forall t\in B_\delta(t_0)\ \forall x\in D:\ |f_t(x)-f_{t_0}(x)|<\varepsilon`,
		body: String.raw`Определение [[ravnomernaya-shodimost|равномерной сходимости]] для семейства функций, занумерованного непрерывным параметром: пара «$\exists N$, $\forall n>N$» заменяется на «$\exists\delta$, $\forall t\in B_\delta(t_0)$».`,
		related: ['ravnomernaya-shodimost', 'okrestnost']
	},

	'predelnyy-perehod-pod-integralom': {
		id: 'predelnyy-perehod-pod-integralom',
		term: 'Предельный переход под интегралом',
		short: String.raw`При $f_n\rightrightarrows f$ предел заходит под знак интеграла.`,
		formula: String.raw`\lim_{n\to\infty}\int_a^b f_n\,dx=\int_a^b\Bigl(\lim_{n\to\infty}f_n\Bigr)dx`,
		body: String.raw`Если функции сходятся [[ravnomernaya-shodimost|равномерно]] на отрезке конечной длины, предел и интеграл можно менять местами. Конечность меры области существенна.`,
		related: ['ravnomernaya-shodimost', 'opredelennyy-integral', 'kontrprimer-gorb']
	},

	'zvezda-i-delta': {
		id: 'zvezda-i-delta',
		term: 'Связка эпсилонов',
		short: String.raw`Допуск по высоте делится на длину отрезка: $\varepsilon_\Delta=\varepsilon_\star/(b-a)$.`,
		formula: String.raw`\varepsilon_\Delta=\frac{\varepsilon_\star}{b-a}`,
		body: String.raw`Приём согласования двух допусков в доказательствах о [[predelnyy-perehod-pod-integralom|переходе под интегралом]]: эпсилон для функции берут в $(b-a)$ раз меньше требуемого эпсилона для интеграла.`,
		related: ['predelnyy-perehod-pod-integralom', 'ravnomernaya-shodimost']
	},

	'kontrprimer-gorb': {
		id: 'kontrprimer-gorb',
		term: 'Контрпример «растущий горб»',
		short: String.raw`Поточечно $\to0$, а интеграл $\to1$.`,
		formula: String.raw`f_n(x)=n^2x(1-x)^n,\quad \int_0^1 f_n\,dx\to1,\quad \lim_n f_n\equiv0`,
		body: String.raw`Последовательность, сходящаяся [[potochechnaya-shodimost|поточечно]] к нулю, у которой интегралы стремятся к единице. Показывает, что для [[predelnyy-perehod-pod-integralom|перехода под интегралом]] поточечной сходимости недостаточно.`,
		related: ['potochechnaya-shodimost', 'predelnyy-perehod-pod-integralom']
	},

	'perestanovka-predela-i-proizvodnoy': {
		id: 'perestanovka-predela-i-proizvodnoy',
		term: 'Перестановка предела и производной',
		short: String.raw`Законна при равномерной сходимости производных, а не функций.`,
		formula: String.raw`f_n\in C^1,\ \ \exists\lim_n f_n(x_0),\ \ (f_n)'\rightrightarrows g\ \Longrightarrow\ f_n\rightrightarrows f,\ \ f'=g`,
		body: String.raw`Если производные сходятся [[ravnomernaya-shodimost|равномерно]], а сами функции — хотя бы в одной точке, то предельная функция существует, дифференцируема, и её производная равна пределу производных.`,
		related: ['ravnomernaya-shodimost', 'proizvodnaya', 'predelnyy-perehod-pod-integralom']
	}
};
