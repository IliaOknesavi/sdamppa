import type { Glossary } from '$lib/types';

// Термины дня 27 (преобразование Абеля, признаки Дирихле и Лейбница).
export const day27Terms: Glossary = {
	'radikalnyy-priznak-koshi': {
		id: 'radikalnyy-priznak-koshi',
		term: 'Радикальный признак Коши',
		short: String.raw`По $L=\lim\sqrt[n]{a_n}$: меньше единицы — сходится, больше — расходится.`,
		formula: String.raw`L=\lim_{n\to\infty}\sqrt[n]{a_n}:\quad L<1\ \text{— сх.};\quad L>1\ \text{— расх.};\quad L=1\ \text{— ?}`,
		body: String.raw`Признак для [[ryad|рядов]] с неотрицательными членами: если корень $n$-й степени из члена имеет [[predel-posledovatelnosti|предел]] меньше единицы, ряд сходится, больше единицы — расходится. При $L=1$ ответа нет: молчание признака расходимостью не является.`,
		related: ['geometricheskiy-ryad', 'priznak-i-svoystvo', 'verhniy-i-nizhniy-predely']
	},

	'diskretnaya-proizvodnaya': {
		id: 'diskretnaya-proizvodnaya',
		term: 'Конечная разность',
		short: String.raw`$\Delta b_k=b_{k+1}-b_k$ — дискретный аналог производной.`,
		formula: String.raw`\Delta b_k=b_{k+1}-b_k`,
		body: String.raw`Приращение [[posledovatelnost|последовательности]] на один шаг. Предельного перехода здесь нет: последовательность задана лишь в целых точках, поэтому всё остаётся чисто алгебраическим.`,
		related: ['posledovatelnost', 'preobrazovanie-abelya']
	},

	'preobrazovanie-abelya': {
		id: 'preobrazovanie-abelya',
		term: 'Преобразование Абеля',
		short: String.raw`Суммирование по частям: разность снимается с $b$ и вешается на $a$.`,
		formula: String.raw`\sum_{k=p}^{q}a_kb_k=A_qb_q-A_{p-1}b_p-\sum_{k=p}^{q-1}A_k\bigl(b_{k+1}-b_k\bigr)`,
		body: String.raw`Тождество, дискретный двойник [[integrirovanie-po-chastyam|интегрирования по частям]]: через [[chastichnaya-summa|частичные суммы]] $A_k$ и [[diskretnaya-proizvodnaya|конечные разности]] последовательности $b_k$. Получается подстановкой $a_k=A_k-A_{k-1}$ и сдвигом индекса.`,
		related: ['chastichnaya-summa', 'diskretnaya-proizvodnaya', 'integrirovanie-po-chastyam']
	},

	'neravenstvo-abelya': {
		id: 'neravenstvo-abelya',
		term: 'Неравенство Абеля',
		short: String.raw`Отрезок суммы оценивается через $\sup|A_k|$ и первое значение $b_p$.`,
		formula: String.raw`|A_k|\le M,\ b_n\ge0\ \text{не возрастает}:\quad \Bigl|\sum_{k=p}^{q}a_kb_k\Bigr|\le 2Mb_p`,
		body: String.raw`Оценка отрезка суммы, получаемая из [[preobrazovanie-abelya|преобразования Абеля]]. Существенно, что правая часть не зависит ни от длины отрезка, ни от его правого конца.`,
		related: ['preobrazovanie-abelya', 'chastichnaya-summa']
	},

	'priznak-dirihle': {
		id: 'priznak-dirihle',
		term: 'Признак Дирихле',
		short: String.raw`Ограниченные суммы $A_n$ и монотонное $b_n\to0$ дают сходимость $\sum a_nb_n$.`,
		formula: String.raw`|A_n|\le M,\quad b_n\searrow 0\qquad\Longrightarrow\qquad \sum_{n=1}^{\infty}a_nb_n\ \text{— сх.}`,
		body: String.raw`Если [[chastichnaya-summa|частичные суммы]] одной последовательности ограничены, а вторая монотонно стремится к нулю, то ряд из их произведений сходится. Ни один из сомножителей сам по себе сходимости не даёт.`,
		related: ['neravenstvo-abelya', 'chastichnaya-summa', 'priznak-leybnica']
	},

	'priznak-leybnica': {
		id: 'priznak-leybnica',
		term: 'Признак Лейбница',
		short: String.raw`Знакочередующийся ряд с $b_n\searrow0$ сходится; остаток не больше $b_{n+1}$.`,
		formula: String.raw`b_n\searrow 0\ \Rightarrow\ \sum_{n=1}^{\infty}(-1)^{n-1}b_n\ \text{— сх.},\qquad |R_n|\le b_{n+1}`,
		body: String.raw`[[znakochereduyushchiysya-ryad|Знакочередующийся ряд]] с монотонно убывающими к нулю модулями членов сходится, а его остаток по модулю не превосходит первого отброшенного члена.`,
		related: ['znakochereduyushchiysya-ryad', 'priznak-dirihle']
	},

	'znakochereduyushchiysya-ryad': {
		id: 'znakochereduyushchiysya-ryad',
		term: 'Знакочередующийся ряд',
		short: String.raw`Знаки строго чередуются: $\sum(-1)^{n-1}b_n$ с $b_n\ge0$.`,
		formula: String.raw`\sum_{n=1}^{\infty}(-1)^{n-1}b_n,\qquad b_n\ge0`,
		body: String.raw`Ряд, у которого множитель $(-1)^{n-1}$ вынесен явно, а остальные множители неотрицательны. [[chastichnaya-summa|Частичные суммы]] самого множителя пробегают $1,0,1,0,\dots$ и ограничены единицей.`,
		related: ['chastichnaya-summa', 'priznak-leybnica']
	},

	'polnaya-variaciya': {
		id: 'polnaya-variaciya',
		term: 'Полная вариация последовательности',
		short: String.raw`Сумма модулей всех приращений.`,
		formula: String.raw`V_p^q=\sum_{k=p}^{q-1}|b_{k+1}-b_k|;\qquad b_n\ \text{не возрастает}:\ V_p^q=b_p-b_q`,
		body: String.raw`Сумма модулей [[diskretnaya-proizvodnaya|конечных разностей]] — насколько последовательность суммарно набегает вверх и вниз. У монотонной последовательности она сворачивается в разность крайних значений.`,
		related: ['diskretnaya-proizvodnaya', 'neravenstvo-abelya']
	},

	'verhniy-i-nizhniy-predely': {
		id: 'verhniy-i-nizhniy-predely',
		term: 'Верхний и нижний пределы',
		short: String.raw`Пределы супремумов и инфимумов хвостов; существуют всегда.`,
		formula: String.raw`\overline\lim_{n} x_n=\lim_{n\to\infty}\sup_{k\ge n}x_k,\qquad \underline\lim_{n} x_n=\lim_{n\to\infty}\inf_{k\ge n}x_k`,
		body: String.raw`[[supremum|Супремум]] и инфимум хвоста последовательности как функции номера монотонны, поэтому их пределы существуют всегда — в расширенной прямой. Обычный [[predel-posledovatelnosti|предел]] существует ровно тогда, когда они равны.`,
		related: ['supremum', 'predel-posledovatelnosti', 'rasshirennaya-pryamaya']
	},

	'formula-koshi-adamara': {
		id: 'formula-koshi-adamara',
		term: 'Формула Коши–Адамара',
		short: String.raw`Радиус сходимости степенного ряда через $\overline\lim\sqrt[n]{|c_n|}$.`,
		formula: String.raw`R=\Bigl(\overline\lim_{n\to\infty}\sqrt[n]{|c_n|}\Bigr)^{-1}`,
		body: String.raw`Радиус сходимости степенного ряда $\sum c_nx^n$ — величина, обратная [[verhniy-i-nizhniy-predely|верхнему пределу]] корней из модулей коэффициентов. Внутри него ряд сходится абсолютно, вне — расходится, на границе возможно и то и другое.`,
		related: ['radikalnyy-priznak-koshi', 'verhniy-i-nizhniy-predely', 'absolyutnaya-shodimost']
	}
};
