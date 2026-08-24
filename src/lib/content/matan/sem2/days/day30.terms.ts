import type { Glossary } from '$lib/types';

// Термины дня 30 (длина кривой в произвольной метрике).
export const day30Terms: Glossary = {
	'differencial-dliny-dugi': {
		id: 'differencial-dliny-dugi',
		term: 'Дифференциал длины дуги',
		short: String.raw`Гипотенуза треугольника с катетами $dx$ и $df$.`,
		formula: String.raw`d\ell=\sqrt{df^2+dx^2}=dx\sqrt{1+f'^2}`,
		body: String.raw`Длина бесконечно малого участка [[dlina-krivoy|кривой]]: на нём кривая заменяется гипотенузой прямоугольного треугольника, катеты которого — [[differencial|дифференциалы]] $dx$ и $df=f'\,dx$.`,
		related: ['differencial', 'dlina-krivoy']
	},

	'dlina-krivoy': {
		id: 'dlina-krivoy',
		term: 'Длина кривой',
		short: String.raw`$L=\int_a^b\sqrt{1+f'^2}\,dx$ для графика функции.`,
		formula: String.raw`L=\int_a^b\sqrt{1+f'(x)^2}\,dx`,
		body: String.raw`Интеграл от [[differencial-dliny-dugi|дифференциала дуги]] по отрезку. Для прямой $y=x$ он даёт $\sqrt2(b-a)$, для четверти единичной окружности — $\pi/2$.`,
		related: ['differencial-dliny-dugi', 'opredelennyy-integral', 'spryamlyaemaya-krivaya']
	},

	'dlina-v-proizvolnoy-metrike': {
		id: 'dlina-v-proizvolnoy-metrike',
		term: 'Длина в произвольной метрике',
		short: String.raw`$L_\rho=\int\|\dot{\vec r}\|\,dt$ — у каждой линейки своя длина.`,
		formula: String.raw`L_\rho=\int_a^b\bigl\|\dot{\vec r}(t)\bigr\|\,dt`,
		body: String.raw`Длина кривой, посчитанная в метрике, порождённой заданной нормой. От выбора нормы результат зависит; нужны сдвиговая инвариантность и [[odnorodnost|однородность]], поэтому годится не всякая метрика.`,
		related: ['metriki-rho', 'aksiomy-normy', 'parametrizaciya-krivoy']
	},

	'manhettenskaya-dlina': {
		id: 'manhettenskaya-dlina',
		term: 'Манхэттенская длина',
		short: String.raw`Складываются модули приращений: $L_{\rho_1}=\int(1+|f'|)\,dx$.`,
		formula: String.raw`L_{\rho_1}=\int_a^b\bigl(1+|f'(x)|\bigr)dx`,
		body: String.raw`[[dlina-v-proizvolnoy-metrike|Длина]] в метрике $\rho_1$: катеты складываются, гипотенуза не берётся. У монотонной кривой она равна сумме модулей приращений координат и от формы не зависит.`,
		related: ['dlina-v-proizvolnoy-metrike', 'metriki-rho', 'variaciya-funkcii']
	},

	'spryamlyaemaya-krivaya': {
		id: 'spryamlyaemaya-krivaya',
		term: 'Спрямляемая кривая',
		short: String.raw`Конечен супремум длин вписанных ломаных.`,
		formula: String.raw`L_\rho(\vec r)=\sup_{\lambda}\sum_i\rho\bigl(\vec r(t_i),\vec r(t_{i+1})\bigr)<\infty`,
		body: String.raw`Кривая, у которой [[supremum|супремум]] длин вписанных ломаных по всем [[razbienie|разбиениям]] конечен. Такое определение длины не требует производной и работает в любом метрическом пространстве.`,
		related: ['supremum', 'razbienie', 'variaciya-funkcii']
	},

	'variaciya-funkcii': {
		id: 'variaciya-funkcii',
		term: 'Вариация функции',
		short: String.raw`Супремум сумм модулей приращений по всем разбиениям.`,
		formula: String.raw`V_a^b(f)=\sup_{\lambda}\sum_i\bigl|f(x_{i+1})-f(x_i)\bigr|`,
		body: String.raw`Сколько [[funkciya|функция]] суммарно набегает вверх и вниз. Конечность вариации называют ограниченной вариацией; для [[klassy-differenciruemosti|гладких]] $f\in C^1$ она равна $\int_a^b|f'|\,dx$.`,
		related: ['supremum', 'razbienie', 'spryamlyaemaya-krivaya']
	},

	'parametrizaciya-krivoy': {
		id: 'parametrizaciya-krivoy',
		term: 'Параметризация кривой',
		short: String.raw`Непрерывное отображение $\vec r:[a;b]\to\mathbb R^n$.`,
		formula: String.raw`\vec r(t)=\bigl(x_1(t),\dots,x_n(t)\bigr),\qquad t\in[a;b]`,
		body: String.raw`Кривая задаётся [[otobrazhenie|отображением]] отрезка в пространство, а не множеством точек: одну и ту же дугу можно пробежать по-разному. При монотонной гладкой замене параметра длина не меняется.`,
		related: ['otobrazhenie', 'dlina-krivoy', 'naturalnyy-parametr']
	},

	'naturalnyy-parametr': {
		id: 'naturalnyy-parametr',
		term: 'Натуральный параметр',
		short: String.raw`Параметром служит сама длина дуги; тогда $\|d\vec r/d\ell\|\equiv1$.`,
		formula: String.raw`\ell(t)=\int_a^t\bigl\|\dot{\vec r}(\tau)\bigr\|\,d\tau,\qquad \Bigl\|\frac{d\vec r}{d\ell}\Bigr\|=1`,
		body: String.raw`[[parametrizaciya-krivoy|Параметризация]], в которой параметр равен накопленной длине дуги. Скорость при этом единичная, а [[differencial-dliny-dugi|дифференциал дуги]] совпадает с дифференциалом параметра.`,
		related: ['parametrizaciya-krivoy', 'differencial-dliny-dugi']
	},

	'proizvodnaya-vdol-krivoy': {
		id: 'proizvodnaya-vdol-krivoy',
		term: 'Производная вдоль кривой',
		short: String.raw`Приращение поля, делённое на $d\ell$.`,
		formula: String.raw`f'_{\vec\ell}=\frac{f'_x+f'_y\,\ell'}{\sqrt{1+\ell'^2}}`,
		body: String.raw`Скорость изменения [[skalyarnoe-pole|поля]] при движении вдоль кривой, отнесённая к [[differencial-dliny-dugi|длине дуги]]. Отдельного единичного вектора здесь нет: направление задаёт сама кривая, а нормировка спрятана в знаменателе.`,
		related: ['proizvodnaya-po-napravleniyu', 'differencial-dliny-dugi', 'skalyarnoe-pole']
	},

	'lestnichnyy-paradoks': {
		id: 'lestnichnyy-paradoks',
		term: 'Парадокс лестницы',
		short: String.raw`Лестница сходится к дуге, а её длина остаётся равной $2$.`,
		formula: String.raw`\lim_{N\to\infty}L_{\rho_2}(\gamma_N)=2\ \ne\ \frac\pi2=L_{\rho_2}\Bigl(\lim_{N\to\infty}\gamma_N\Bigr)`,
		body: String.raw`Пример, показывающий, что длина не перестановочна с [[ravnomernaya-shodimost|равномерным пределом]]: ступенчатые линии сходятся к дуге окружности, а их длины к длине дуги не сходятся. Причина — длина зависит от производной, а равномерная сходимость о производных ничего не говорит.`,
		related: ['ravnomernaya-shodimost', 'dlina-krivoy', 'polunepreryvnost-dliny']
	},

	'modul-nepreryvnosti': {
		id: 'modul-nepreryvnosti',
		term: 'Модуль непрерывности',
		short: String.raw`Общий разброс значений на всех кусках длины $\delta$.`,
		formula: String.raw`\omega(\delta)=\sup\bigl\{|g(t)-g(s)|:\ |t-s|\le\delta\bigr\}`,
		body: String.raw`[[supremum|Супремум]] разброса значений функции по всем парам точек, отстоящих не более чем на $\delta$. У [[ravnomernaya-nepreryvnost|равномерно непрерывной]] функции $\omega(\delta)\to0$ при $\delta\to+0$.`,
		related: ['supremum', 'ravnomernaya-nepreryvnost', 'nepreryvnost']
	},

	'polunepreryvnost-dliny': {
		id: 'polunepreryvnost-dliny',
		term: 'Полунепрерывность длины снизу',
		short: String.raw`Длина предела не больше предела длин.`,
		formula: String.raw`\gamma_N\rightrightarrows\gamma\ \Longrightarrow\ L(\gamma)\le\liminf_{N\to\infty}L(\gamma_N)`,
		body: String.raw`При [[ravnomernaya-shodimost|равномерном]] предельном переходе длина может упасть, но не вырасти. Следует из определения длины [[spryamlyaemaya-krivaya|супремумом по ломаным]].`,
		related: ['spryamlyaemaya-krivaya', 'ravnomernaya-shodimost', 'verhniy-i-nizhniy-predely']
	},

	'ekvivalentnost-norm': {
		id: 'ekvivalentnost-norm',
		term: 'Эквивалентность норм',
		short: String.raw`В конечномерном пространстве любые две нормы отличаются не более чем в константу раз.`,
		formula: String.raw`\|\vec v\|_\infty\le\|\vec v\|_2\le\|\vec v\|_1\le\sqrt n\,\|\vec v\|_2\le n\,\|\vec v\|_\infty`,
		body: String.raw`Для любых двух норм на конечномерном [[lineynoe-prostranstvo|пространстве]] найдутся положительные константы, зажимающие одну между кратными другой. Поэтому все [[metriki-rho|метрики $\rho_k$]] задают одну топологию, но не одну длину.`,
		related: ['aksiomy-normy', 'metriki-rho', 'lineynoe-prostranstvo']
	},

	'krivolineynyy-integral': {
		id: 'krivolineynyy-integral',
		term: 'Криволинейный интеграл',
		short: String.raw`$\int_\Gamma f\,d\ell$ — интеграл по кривой с мерой $d\ell$.`,
		formula: String.raw`\int_{\Gamma}f\,d\ell=\int_a^b f\bigl(\vec r(t)\bigr)\,\bigl\|\dot{\vec r}(t)\bigr\|\,dt`,
		body: String.raw`Интеграл, в котором роль меры играет [[differencial-dliny-dugi|длина дуги]]. При подынтегральной функции, тождественно равной единице, он даёт [[dlina-krivoy|длину кривой]].`,
		related: ['differencial-dliny-dugi', 'dlina-krivoy', 'parametrizaciya-krivoy']
	}
};
