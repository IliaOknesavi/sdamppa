import type { Glossary } from '$lib/types';

// Термины дня 21 (внесение под дифференциал и интегрирование по частям).
export const day21Terms: Glossary = {
	'differencialnaya-forma': {
		id: 'differencialnaya-forma',
		term: 'Дифференциальная форма под интегралом',
		short: String.raw`Выражение $f(x)\,dx$ — единый объект, а не функция с хвостиком.`,
		formula: String.raw`\omega=f(x)\,dx=dF,\qquad F'=f`,
		body: String.raw`Под знаком интеграла стоит не функция, а выражение $f\,dx$, которое переписывается по правилам работы с [[differencial|дифференциалом]]: $\varphi'(x)\,dx=d\varphi(x)$.`,
		related: ['differencial', 'vnesenie-pod-differencial', 'opredelennyy-integral']
	},

	'vnesenie-pod-differencial': {
		id: 'vnesenie-pod-differencial',
		term: 'Внесение под дифференциал',
		short: String.raw`Свернуть $\varphi'(x)\,dx$ в $d\varphi(x)$ и перейти к новой переменной.`,
		formula: String.raw`\int f(\varphi(x))\,\varphi'(x)\,dx=\Bigl(\int f(t)\,dt\Bigr)\Big|_{t=\varphi(x)}`,
		body: String.raw`Прямая подстановка: множитель $\varphi'(x)\,dx$ сворачивается в [[differencial|дифференциал]] $d\varphi(x)$, после чего $\varphi(x)$ объявляется новой переменной. Обратимости $\varphi$ при этом не требуется.`,
		related: ['differencial', 'zamena-peremennoy', 'cepnoe-pravilo']
	},

	'zamena-peremennoy': {
		id: 'zamena-peremennoy',
		term: 'Замена переменной в интеграле',
		short: String.raw`Прямая $t=\varphi(x)$ или обратная $x=\psi(t)$ подстановка.`,
		formula: String.raw`x=\psi(t),\quad dx=\psi'(t)\,dt`,
		body: String.raw`Переход к новой переменной интегрирования. [[vnesenie-pod-differencial|Прямая]] подстановка обратимости не требует; **обратная** подстановка $x=\psi(t)$ требует, чтобы $\psi$ была [[inektivnost-syuryektivnost|биекцией]] нужного промежутка.`,
		related: ['vnesenie-pod-differencial', 'inektivnost-syuryektivnost', 'pereschet-predelov']
	},

	'pereschet-predelov': {
		id: 'pereschet-predelov',
		term: 'Пересчёт пределов интегрирования',
		short: String.raw`Новые пределы — образы старых: $\varphi(a)$ и $\varphi(b)$.`,
		formula: String.raw`\int_a^b f(\varphi(x))\varphi'(x)\,dx=\int_{\varphi(a)}^{\varphi(b)}f(t)\,dt`,
		body: String.raw`В [[opredelennyy-integral|определённом интеграле]] после [[zamena-peremennoy|замены переменной]] к старой возвращаться не нужно — достаточно заменить пределы их образами. Либо пределы пересчитаны, либо сделан возврат к $x$; смешивать нельзя.`,
		related: ['zamena-peremennoy', 'opredelennyy-integral']
	},

	'integrirovanie-po-chastyam': {
		id: 'integrirovanie-po-chastyam',
		term: 'Интегрирование по частям',
		short: String.raw`$\int u\,dv=uv-\int v\,du$.`,
		formula: String.raw`\int u\,dv=uv-\int v\,du,\qquad \int_a^b u\,dv=uv\Big|_a^b-\int_a^b v\,du`,
		body: String.raw`Тождество, переносящее производную с одного множителя на другой; получается интегрированием [[pravilo-leybnica|правила Лейбница]]. Само по себе оно ничего не упрощает — выигрыш есть, когда дифференцирование обедняет $u$, а интегрирование не портит $dv$.`,
		related: ['pravilo-leybnica', 'differencialnaya-forma', 'pravilo-liatl']
	},

	'pravilo-liatl': {
		id: 'pravilo-liatl',
		term: 'Правило ЛИАТЭ',
		short: String.raw`Приоритет выбора $u$: логарифм, обратные тригонометрические, алгебраические, тригонометрические, экспонента.`,
		body: String.raw`Мнемоника выбора множителей при [[integrirovanie-po-chastyam|интегрировании по частям]]: за $u$ берут функцию, стоящую в списке левее. Порядок отражает, что сильнее упрощается при дифференцировании.`,
		related: ['integrirovanie-po-chastyam', 'ciklicheskiy-integral']
	},

	'ciklicheskiy-integral': {
		id: 'ciklicheskiy-integral',
		term: 'Циклический интеграл',
		short: String.raw`Двукратное интегрирование по частям возвращает исходный интеграл.`,
		formula: String.raw`I=A+kI,\ k\neq1\ \Longrightarrow\ I=\frac{A}{1-k}`,
		body: String.raw`Случай, когда после двух применений [[integrirovanie-po-chastyam|формулы по частям]] справа снова появляется исходный интеграл. Тогда равенство читают как линейное уравнение относительно $I$ и решают его.`,
		related: ['integrirovanie-po-chastyam', 'pravilo-liatl']
	}
};
