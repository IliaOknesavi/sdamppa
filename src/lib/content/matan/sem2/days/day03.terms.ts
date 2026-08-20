import type { Glossary } from '$lib/types';

// Термины дня 3 (обратная функция и производные высших порядков).
export const day03Terms: Glossary = {
	'obratnaya-funkciya': {
		id: 'obratnaya-funkciya',
		term: 'Обратная функция',
		short: String.raw`Отображение $f^-$, отменяющее $f$: $f^-(f(x))=x$.`,
		formula: String.raw`f^-\bigl(f(x)\bigr)=x,\qquad f\bigl(f^-(y)\bigr)=y`,
		body: String.raw`**Обратная функция** к $f$ — такое $g$, что [[kompoziciya|композиции]] $g\circ f$ и $f\circ g$ тождественны. Обозначается $f^-$: минус в верхнем индексе и есть знак обращения. Тот же символ обозначает [[obraz-mnozhestva|прообраз]], но прообраз определён для любой функции, а $f^-$ — только для обратимой.`,
		related: ['kompoziciya', 'obratimost-na-podmnozhestve', 'obraz-mnozhestva']
	},

	'obratimost-na-podmnozhestve': {
		id: 'obratimost-na-podmnozhestve',
		term: 'Обратимость на подмножестве',
		short: String.raw`Обращение на сужении $\hat D\subset D$ с образом $\hat E=f(\hat D)$.`,
		formula: String.raw`\hat D\subset D,\quad \hat E=f(\hat D),\quad g\circ f=\mathrm{id}_{\hat D},\ f\circ g=\mathrm{id}_{\hat E}`,
		body: String.raw`Функция обратима **на подмножестве** $\hat D$, если [[obratnaya-funkciya|обратная]] существует для сужения $f$ на $\hat D$ с областью значений $\hat E=f(\hat D)$. От всей $f$ [[inektivnost-syuryektivnost|биективность]] при этом не требуется: у $x^2$ обратной на $\mathbb R$ нет, а на $[0;+\infty)$ есть.`,
		related: ['obratnaya-funkciya', 'inektivnost-syuryektivnost', 'podmnozhestvo']
	},

	'proizvodnaya-obratnoy-funkcii': {
		id: 'proizvodnaya-obratnoy-funkcii',
		term: 'Производная обратной функции',
		short: String.raw`$(f^-)'(y_0)=1/f'(x_0)$ при $y_0=f(x_0)$ и $f'(x_0)\ne0$.`,
		formula: String.raw`(f^-)'(y_0)=\frac{1}{f'(x_0)},\qquad y_0=f(x_0)`,
		body: String.raw`Пусть $f$ строго монотонна и непрерывна на [[promezhutok|промежутке]], дифференцируема в $x_0$ и $f'(x_0)\ne0$. Тогда [[obratnaya-funkciya|$f^-$]] дифференцируема в точке $y_0=f(x_0)$ и $(f^-)'(y_0)=\dfrac{1}{f'(x_0)}$.`,
		related: ['obratnaya-funkciya', 'strogaya-monotonnost', 'promezhutok']
	},

	'inektivnost-syuryektivnost': {
		id: 'inektivnost-syuryektivnost',
		term: 'Инъекция, сюръекция, биекция',
		short: String.raw`Не склеивает точки; накрывает всю область значений; и то и другое.`,
		formula: String.raw`f(x_1)=f(x_2)\Rightarrow x_1=x_2;\qquad f(D)=E`,
		body: String.raw`[[otobrazhenie|Отображение]] $f:D\to E$ **инъективно**, если разным аргументам отвечают разные значения; **сюръективно**, если [[obraz-mnozhestva|образ]] $f(D)$ совпадает с $E$; **биективно**, если верно и то и другое. Обратное отображение существует ровно у биекций.`,
		related: ['otobrazhenie', 'obraz-mnozhestva', 'obratnaya-funkciya']
	},

	'proizvodnaya-vysshego-poryadka': {
		id: 'proizvodnaya-vysshego-poryadka',
		term: 'Производная высшего порядка',
		short: String.raw`$f^{(r)}=\bigl(f^{(r-1)}\bigr)'$ — дифференцирование, применённое $r$ раз.`,
		formula: String.raw`f^{(r)}=\bigl(f^{(r-1)}\bigr)',\qquad f^{(0)}=f`,
		body: String.raw`**Производная порядка $r$** определяется по индукции: $f''=(f')'$, $f'''=(f'')'$ и так далее, причём $f^{(0)}=f$. В операторной записи это $r$-я степень [[operator-differencirovaniya|оператора дифференцирования]].`,
		related: ['operator-differencirovaniya', 'proizvodnaya', 'klassy-differenciruemosti']
	},

	'differencial-vtorogo-poryadka': {
		id: 'differencial-vtorogo-poryadka',
		term: 'Дифференциал второго порядка',
		short: String.raw`$d^2f=f''(x)\,dx^2$ при замороженном $dx$.`,
		formula: String.raw`d^2f=d(df)=f''(x)\,dx^2`,
		body: String.raw`**Второй дифференциал** — результат повторного применения $d$ к [[differencial|первому дифференциалу]] при замороженном $dx$: $d^2f=d\bigl(f'(x)dx\bigr)=f''(x)\,dx^2$. Запись $dx^2$ означает $(dx)^2$, а не $d(x^2)$.`,
		related: ['differencial', 'proizvodnaya-vysshego-poryadka']
	}
};
