import type { Glossary } from '$lib/types';

// Термины дня 16 (обоснование метода Лагранжа через редукцию).
export const day16Terms: Glossary = {
	'rasshcheplenie-peremennyh': {
		id: 'rasshcheplenie-peremennyh',
		term: 'Расщепление переменных',
		short: String.raw`$\vec x=(\vec y,\vec z)$: $m$ зависимых переменных и $n-m$ свободных.`,
		formula: String.raw`\vec x=(\vec y,\vec z),\qquad \vec y\in\mathbb R^{m},\ \ \vec z\in\mathbb R^{\,n-m}`,
		body: String.raw`Деление координат на **зависимые** (их столько же, сколько [[svyaz|связей]]) и **свободные**. Нумерацию выбирают так, чтобы якобиан по зависимым переменным был невырожден — это возможно ровно при [[uslovie-regulyarnosti|условии регулярности]].`,
		related: ['svyaz', 'uslovie-regulyarnosti', 'redukciya']
	},

	redukciya: {
		id: 'redukciya',
		term: 'Редукция условной задачи',
		short: String.raw`Связи разрешаются и подставляются в цель — задача становится безусловной.`,
		body: String.raw`Приём: [[rasshcheplenie-peremennyh|расщепить переменные]], разрешить [[svyaz|связи]] по [[teorema-o-neyavnoy-funkcii|теореме о неявной функции]] как $\vec y=\varphi(\vec z)$ и подставить в целевую функцию, получив [[reducirovannaya-funkciya|редуцированную функцию]] от свободных переменных.`,
		related: ['rasshcheplenie-peremennyh', 'teorema-o-neyavnoy-funkcii', 'reducirovannaya-funkciya']
	},

	'reducirovannaya-funkciya': {
		id: 'reducirovannaya-funkciya',
		term: 'Редуцированная функция',
		short: String.raw`$F(\vec z)=f(\varphi(\vec z),\vec z)$ — цель как функция свободных переменных.`,
		formula: String.raw`F(\vec z)=f(\varphi(\vec z),\vec z),\qquad \vec z\in U(\vec z^{\,*})\subset\mathbb R^{\,n-m}`,
		body: String.raw`Целевая функция после подстановки неявно выраженных зависимых переменных. [[svyaz|Связи]] в неё уже зашиты, поэтому свободные переменные пробегают целую [[okrestnost|окрестность]], и задача становится безусловной.`,
		related: ['redukciya', 'neyavnaya-funkciya', 'okrestnost']
	},

	'okaymlennyy-gessian': {
		id: 'okaymlennyy-gessian',
		term: 'Окаймлённый гессиан',
		short: String.raw`Гессиан функции Лагранжа, окаймлённый матрицей Якоби связей.`,
		formula: String.raw`\overline H=\begin{pmatrix}0&J\\ J^{T}&H(\mathcal L)\end{pmatrix},\qquad J=\left(\frac{\partial g_i}{\partial x_j}\right)`,
		body: String.raw`Блочная [[matrica|матрица]] порядка $n+m$: [[matrica-gesse|гессиан]] [[funkciya-lagranzha|функции Лагранжа]], обрамлённый [[matrica-yakobi|матрицей Якоби]] связей. По знакам её угловых миноров проверяют знакоопределённость на [[kasatelnoe-prostranstvo|касательном пространстве]], не выписывая его базис.`,
		related: ['matrica-gesse', 'funkciya-lagranzha', 'matrica-yakobi', 'kasatelnoe-prostranstvo']
	},

	'dostatochnoe-uslovie-uslovnogo-ekstremuma': {
		id: 'dostatochnoe-uslovie-uslovnogo-ekstremuma',
		term: 'Достаточное условие условного экстремума',
		short: String.raw`Знакоопределённость $d^{2}\mathcal L$ на касательном пространстве.`,
		formula: String.raw`d^{2}\mathcal L(\vec x^{\,*})[\vec h]>0\ \ \forall\vec h\in T\setminus\lbrace\vec 0\rbrace\ \Rightarrow\ \text{строгий минимум}`,
		body: String.raw`Пусть точка регулярна и удовлетворяет необходимому условию с множителями $\vec\lambda^{\,*}$. Если [[vtoroy-differencial|второй дифференциал]] [[funkciya-lagranzha|функции Лагранжа]] положительно определён на [[kasatelnoe-prostranstvo|касательном пространстве]], там строгий условный минимум; отрицательно определён — максимум.`,
		related: ['funkciya-lagranzha', 'kasatelnoe-prostranstvo', 'vtoroy-differencial', 'okaymlennyy-gessian']
	}
};
