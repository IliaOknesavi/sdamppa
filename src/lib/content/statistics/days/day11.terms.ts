import type { Glossary } from '$lib/types';

// Новые термины дня 11 (ch09): выборочный метод, вариационный ряд,
// эмпирическая ФР, квантили, группировка и визуализация. Несколько терминов
// дня 5 (линейность M, Чебышёв, ЗБЧ) продублированы здесь, чтобы ссылки
// [[...]] в day11 разрешались независимо.
export const day11Terms: Glossary = {
	'generalnaya-sovokupnost': {
		id: 'generalnaya-sovokupnost',
		term: 'Генеральная совокупность',
		short: String.raw`Всё множество объектов с неизвестной $F(x)$.`,
		body: String.raw`**Генеральная совокупность** (г.с.) — всё множество объектов, о котором делается вывод. Измеряемый признак считают [[sluchaynaya-velichina|случайной величиной]] $X$ с (обычно неизвестной) функцией распределения $F(x)$. На практике изучить всю г.с. нельзя, поэтому судят о ней по [[vyborka|выборке]].`,
		related: ['vyborka', 'reprezentativnost', 'empiricheskaya-fr']
	},

	vyborka: {
		id: 'vyborka',
		term: 'Выборка',
		short: String.raw`$n$ наблюдений $x_1,\dots,x_n$ из генеральной совокупности.`,
		formula: String.raw`x_1, x_2, \dots, x_n`,
		body: String.raw`**Выборка** объёма $n$ — это $n$ объектов, отобранных из [[generalnaya-sovokupnost|генеральной совокупности]] для изучения; их измерения $x_1,\dots,x_n$ называют наблюдениями. Чтобы по выборке можно было судить о целом, она должна быть [[reprezentativnost|репрезентативной]]. Вся статистика работает именно с выборкой, а не с г.с.`,
		related: ['generalnaya-sovokupnost', 'reprezentativnost', 'prostaya-vyborka', 'variacionnyy-ryad']
	},

	reprezentativnost: {
		id: 'reprezentativnost',
		term: 'Репрезентативность',
		short: String.raw`Способность выборки верно отражать свойства г.с.`,
		body: String.raw`**Репрезентативность** — свойство [[vyborka|выборки]] достаточно полно отражать [[generalnaya-sovokupnost|генеральную совокупность]]. Обеспечивается достаточным **объёмом** выборки и правильной **организацией** отбора (случайной, без систематического перекоса). Без неё любые выводы по выборке смещены.`,
		related: ['vyborka', 'prostaya-vyborka', 'generalnaya-sovokupnost']
	},

	'prostaya-vyborka': {
		id: 'prostaya-vyborka',
		term: 'Простая (повторная случайная) выборка',
		short: String.raw`Независимые одинаково распределённые $X_1,\dots,X_n$.`,
		body: String.raw`**Простая** (повторная случайная) выборка — та, в которой объекты отбираются независимо, и каждое наблюдение имеет то же распределение, что и вся [[generalnaya-sovokupnost|г.с.]] То есть $X_1,\dots,X_n$ — **независимые одинаково распределённые** величины с общей $F(x)$. Это ключевое предположение: именно независимость даёт биномиальность $n_x$ и состоятельность [[empiricheskaya-fr|эмпирической ФР]].`,
		related: ['vyborka', 'reprezentativnost', 'empiricheskaya-fr']
	},

	'variacionnyy-ryad': {
		id: 'variacionnyy-ryad',
		term: 'Вариационный ряд',
		short: String.raw`Выборка, упорядоченная по возрастанию.`,
		formula: String.raw`x_{(1)} \le x_{(2)} \le \dots \le x_{(n)}`,
		body: String.raw`**Вариационный ряд** — [[vyborka|выборка]], упорядоченная по возрастанию: $$x_{(1)}\le x_{(2)}\le\dots\le x_{(n)}.$$ Член $x_{(k)}$ называют [[poryadkovaya-statistika|порядковой статистикой]] номера $k$. Это первый шаг обработки данных: из него сразу получаются [[razmah|размах]], [[vyborochnaya-mediana|медиана]] и [[vyborochnaya-kvantil|квантили]].`,
		related: ['poryadkovaya-statistika', 'razmah', 'vyborochnaya-kvantil', 'vyborka']
	},

	'poryadkovaya-statistika': {
		id: 'poryadkovaya-statistika',
		term: 'Порядковая статистика',
		short: String.raw`$x_{(k)}$ — $k$-й член вариационного ряда.`,
		formula: String.raw`X_{(1)} = X_{\min},\quad X_{(n)} = X_{\max}`,
		body: String.raw`**Порядковая статистика** $x_{(k)}$ — значение, стоящее на $k$-м месте в [[variacionnyy-ryad|вариационном ряду]]. Крайние из них особые: $X_{(1)}=X_{\min}$ и $X_{(n)}=X_{\max}$. Через порядковые статистики выражаются [[empiricheskaya-fr|эмпирическая ФР]], [[vyborochnaya-kvantil|квантили]] и [[razmah|размах]].`,
		related: ['variacionnyy-ryad', 'razmah', 'empiricheskaya-fr']
	},

	razmah: {
		id: 'razmah',
		term: 'Размах выборки',
		short: String.raw`$R = x_{\max} - x_{\min}$.`,
		formula: String.raw`R = X_{(n)} - X_{(1)}`,
		body: String.raw`**Размах** $R=X_{\max}-X_{\min}=X_{(n)}-X_{(1)}$ — простейшая мера разброса [[vyborka|выборки]]. Считается мгновенно, но определяется лишь двумя крайними наблюдениями и потому очень чувствителен к [[vybros|выбросам]]. Робастная альтернатива — [[mezhkvartilnyy-razmah|межквартильный размах]].`,
		related: ['poryadkovaya-statistika', 'mezhkvartilnyy-razmah', 'vybros']
	},

	'empiricheskaya-fr': {
		id: 'empiricheskaya-fr',
		term: 'Эмпирическая функция распределения',
		short: String.raw`$\hat F_n(x)$ — доля наблюдений, меньших $x$.`,
		formula: String.raw`\hat F_n(x) = \frac{n_x}{n}`,
		body: String.raw`**Эмпирическая ФР** $\hat F_n(x)=n_x/n$ — доля наблюдений [[vyborka|выборки]], строго меньших $x$ (где $n_x=\#\{i:X_i<x\}$). Это ступенчатая функция со скачками $1/n$ в точках выборки; она обладает всеми свойствами обычной ФР. Главное: $\hat F_n$ — **несмещённая и состоятельная** оценка неизвестной $F$, $$M\hat F_n(x)=F(x),\quad D\hat F_n(x)=\frac{F(x)(1-F(x))}{n}\to0,$$ а по [[teorema-glivenko|теореме Гливенко]] она сходится к $F$ равномерно.`,
		related: ['teorema-glivenko', 'poryadkovaya-statistika', 'kumulyata', 'indikator']
	},

	'teorema-glivenko': {
		id: 'teorema-glivenko',
		term: 'Теорема Гливенко',
		short: String.raw`$\sup_x|\hat F_n - F| \to 0$ — основная теорема статистики.`,
		formula: String.raw`\sup_{x}|\hat F_n(x) - F(x)| \xrightarrow[n\to\infty]{} 0`,
		body: String.raw`**Теорема Гливенко** (основная теорема статистики): для [[prostaya-vyborka|простой выборки]] [[empiricheskaya-fr|эмпирическая ФР]] сходится к теоретической **равномерно** по всей оси (почти наверное): $$\sup_x|\hat F_n(x)-F(x)|\to0.$$ Она обосновывает сам выборочный метод: при большом $n$ по выборке восстанавливается всё распределение сразу во всех точках. Опирается на поточечный [[zakon-bolshih-chisel|закон больших чисел]] и монотонность $F$.`,
		related: ['empiricheskaya-fr', 'prostaya-vyborka', 'zakon-bolshih-chisel']
	},

	'vyborochnaya-kvantil': {
		id: 'vyborochnaya-kvantil',
		term: 'Выборочная квантиль',
		short: String.raw`$x_p$ — значение, левее которого доля $\approx p$ наблюдений.`,
		formula: String.raw`x_p = \hat F_n^{-1}(p) = \inf\{x:\ \hat F_n(x) \ge p\}`,
		body: String.raw`**Выборочная квантиль** уровня $p\in(0;1)$ — значение $x_p$, делящее [[variacionnyy-ryad|вариационный ряд]] так, что доля наблюдений левее него $\approx p$. Формально — обобщённая обратная к [[empiricheskaya-fr|эмпирической ФР]]: $x_p=\inf\{x:\hat F_n(x)\ge p\}$. На практике берут дробный номер $j=p\,(n+1)$ и интерполируют между соседними [[poryadkovaya-statistika|порядковыми статистиками]]. Частные случаи — [[kvartili|квартили]], [[decili-percentili|децили и перцентили]].`,
		related: ['kvartili', 'vyborochnaya-mediana', 'decili-percentili', 'empiricheskaya-fr']
	},

	kvartili: {
		id: 'kvartili',
		term: 'Квартили',
		short: String.raw`Квантили уровней $1/4,\,1/2,\,3/4$.`,
		formula: String.raw`Q_1 = x_{0{,}25},\ Q_2 = x_{0{,}5},\ Q_3 = x_{0{,}75}`,
		body: String.raw`**Квартили** делят упорядоченную выборку на четыре равные части: $Q_1=x_{0{,}25}$ отсекает $25\%$ наименьших значений, $Q_3=x_{0{,}75}$ — $25\%$ наибольших, а $Q_2=x_{0{,}5}$ совпадает с [[vyborochnaya-mediana|медианой]]. Это частные случаи [[vyborochnaya-kvantil|выборочной квантили]]. Их разность — [[mezhkvartilnyy-razmah|IQR]].`,
		related: ['vyborochnaya-kvantil', 'vyborochnaya-mediana', 'mezhkvartilnyy-razmah', 'boxplot']
	},

	'decili-percentili': {
		id: 'decili-percentili',
		term: 'Децили и перцентили',
		short: String.raw`Квантили, делящие выборку на 10 и 100 частей.`,
		body: String.raw`**Децили** — [[vyborochnaya-kvantil|квантили]] уровней $0{,}1;0{,}2;\dots;0{,}9$ (делят выборку на $10$ частей). **Перцентили** (процентили) — квантили уровней $0{,}01;\dots;0{,}99$ (на $100$ частей); $p$-й перцентиль есть $x_{p/100}$. Так, [[kvartili|$Q_1$]] — это $25$-й перцентиль, [[vyborochnaya-mediana|медиана]] — $50$-й, $Q_3$ — $75$-й. В инженерии латентность описывают именно перцентилями (p95, p99).`,
		related: ['vyborochnaya-kvantil', 'kvartili', 'vyborochnaya-mediana']
	},

	'vyborochnaya-mediana': {
		id: 'vyborochnaya-mediana',
		term: 'Выборочная медиана',
		short: String.raw`Квантиль уровня $1/2$ — делит выборку пополам.`,
		body: String.raw`**Выборочная медиана** $\operatorname{Med}X$ — [[vyborochnaya-kvantil|квантиль]] уровня $1/2$. По [[variacionnyy-ryad|вариационному ряду]]: $$\operatorname{Med}X=\begin{cases}X_{(\frac{n+1}{2})}, & n\text{ нечётно},\\[4pt]\frac12\bigl(X_{(\frac n2)}+X_{(\frac n2+1)}\bigr), & n\text{ чётно}.\end{cases}$$ В отличие от среднего, медиана **устойчива к выбросам** — она минимизирует среднее абсолютное отклонение $M|X-a|$.`,
		related: ['vyborochnaya-kvantil', 'kvartili', 'vyborochnaya-moda', 'vybros']
	},

	'vyborochnaya-moda': {
		id: 'vyborochnaya-moda',
		term: 'Выборочная мода',
		short: String.raw`Самое частое наблюдение (значение с наибольшей $n_i$).`,
		body: String.raw`**Выборочная мода** $\operatorname{Mo}X$ — наблюдение, встречающееся в [[vyborka|выборке]] чаще всего (значение с наибольшей частотой $n_i$). Для [[gruppirovka|группированных данных]] за моду принимают середину интервала с наибольшей частотой. Мода применима даже к номинальным данным и, как [[vyborochnaya-mediana|медиана]], устойчива к выбросам.`,
		related: ['vyborochnaya-mediana', 'gruppirovka']
	},

	'mezhkvartilnyy-razmah': {
		id: 'mezhkvartilnyy-razmah',
		term: 'Межквартильный размах (IQR)',
		short: String.raw`$\mathrm{IQR} = Q_3 - Q_1$ — разброс центральных 50%.`,
		formula: String.raw`\mathrm{IQR} = Q_3 - Q_1`,
		body: String.raw`**Межквартильный размах** $\mathrm{IQR}=Q_3-Q_1$ — длина интервала, содержащего центральные $50\%$ наблюдений. Это **робастная** мера разброса: в отличие от полного [[razmah|размаха]] $R$, она не зависит от крайних точек и потому устойчива к [[vybros|выбросам]]. Лежит в основе правила $1{,}5\,\mathrm{IQR}$ на [[boxplot|box-plot]].`,
		related: ['kvartili', 'razmah', 'boxplot', 'vybros']
	},

	gruppirovka: {
		id: 'gruppirovka',
		term: 'Группировка данных',
		short: String.raw`Объединение наблюдений в интервалы с частотами.`,
		body: String.raw`**Группировка** — объединение наблюдений в интервалы при большом $n$. Алгоритм: считают [[razmah|размах]] $R$, число интервалов $\kappa$ по [[pravilo-sterdzhesa|правилу Стёрджеса]], ширину $h=R/\kappa$, затем для каждого интервала находят частоту $n_i$, относительную частоту $\hat f_i=n_i/n$ и накопленную частоту. Середину интервала $X_i$ берут как его «представителя». Результат изображают [[gistogramma|гистограммой]].`,
		related: ['pravilo-sterdzhesa', 'gistogramma', 'poligon-chastot', 'razmah']
	},

	'pravilo-sterdzhesa': {
		id: 'pravilo-sterdzhesa',
		term: 'Правило Стёрджеса',
		short: String.raw`$\kappa \approx \log_2 n + 1$ — число интервалов группировки.`,
		formula: String.raw`\kappa \approx \log_2 n + 1`,
		body: String.raw`**Правило Стёрджеса** даёт число интервалов [[gruppirovka|группировки]]: $$\kappa\approx\log_2 n+1,$$ округляя до целого. Грубая альтернатива — $\kappa\approx\sqrt n$. Слишком мало интервалов — теряются детали распределения; слишком много — [[gistogramma|гистограмма]] становится «зубчатой» из-за шума. Ширину тогда берут $h=R/\kappa$.`,
		related: ['gruppirovka', 'gistogramma']
	},

	gistogramma: {
		id: 'gistogramma',
		term: 'Гистограмма',
		short: String.raw`Столбики высоты $\hat f_i/h$ — выборочный аналог плотности.`,
		formula: String.raw`\text{высота} = \frac{\hat f_i}{h} = \frac{n_i}{n\,h}`,
		body: String.raw`**Гистограмма** — столбчатая диаграмма для [[gruppirovka|группированных данных]]: над интервалом ширины $h$ строят столбик высоты $\hat f_i/h=n_i/(n\,h)$ (плотности относительной частоты). Тогда **площадь** столбика равна $\hat f_i$, а суммарная площадь равна $1$ — поэтому гистограмма есть выборочный аналог плотности распределения. Сравнивать на ней нужно площади, а не высоты. Часто поверх строят [[poligon-chastot|полигон]].`,
		related: ['gruppirovka', 'poligon-chastot', 'pravilo-sterdzhesa', 'kumulyata']
	},

	'poligon-chastot': {
		id: 'poligon-chastot',
		term: 'Полигон частот',
		short: String.raw`Ломаная через точки $(X_i, n_i)$ или $(X_i, \hat f_i)$.`,
		body: String.raw`**Полигон частот** — ломаная, соединяющая точки $(X_i,n_i)$ (или $(X_i,\hat f_i)$), где $X_i$ — середины интервалов [[gruppirovka|группировки]]. Применяется в основном для дискретных данных и для сглаживания профиля распределения; его часто проводят поверх вершин столбиков [[gistogramma|гистограммы]].`,
		related: ['gistogramma', 'gruppirovka', 'kumulyata']
	},

	kumulyata: {
		id: 'kumulyata',
		term: 'Кумулята',
		short: String.raw`График накопленных относительных частот.`,
		body: String.raw`**Кумулята** — ломаная, соединяющая точки $(X_{B_i},\hat F_n(X_i))$, то есть график накопленных относительных частот по верхним границам интервалов. Это сглаженный (для [[gruppirovka|группированных данных]]) аналог графика [[empiricheskaya-fr|эмпирической ФР]]: она тоже неубывает от $0$ до $1$.`,
		related: ['empiricheskaya-fr', 'gistogramma', 'gruppirovka']
	},

	boxplot: {
		id: 'boxplot',
		term: 'Box-plot (ящик с усами)',
		short: String.raw`Диаграмма по пяти числам: $x_{\min}, Q_1, Q_2, Q_3, x_{\max}$.`,
		body: String.raw`**Box-plot** («ящик с усами») строится по пяти числам выборки: $x_{\min},\ Q_1,\ Q_2=\operatorname{Med}X,\ Q_3,\ x_{\max}$. «Ящик» рисуют от [[kvartili|$Q_1$]] до $Q_3$ (его длина равна [[mezhkvartilnyy-razmah|IQR]]), внутри отмечают медиану. «Усы» тянут до крайних наблюдений, не выходящих за $Q_1-1{,}5\,\mathrm{IQR}$ и $Q_3+1{,}5\,\mathrm{IQR}$; точки за этими границами помечают как [[vybros|выбросы]]. Компактно показывает центр, разброс и асимметрию и удобен для сравнения нескольких выборок.`,
		related: ['kvartili', 'mezhkvartilnyy-razmah', 'vybros', 'vyborochnaya-mediana']
	},

	vybros: {
		id: 'vybros',
		term: 'Выброс',
		short: String.raw`Наблюдение за границами $Q_1 - 1{,}5\,\mathrm{IQR}$ и $Q_3 + 1{,}5\,\mathrm{IQR}$.`,
		body: String.raw`**Выброс** — наблюдение, нетипично далёкое от остальных. Стандартный критерий (правило $1{,}5\,\mathrm{IQR}$): точка считается выбросом, если она вне интервала $$[\,Q_1-1{,}5\,\mathrm{IQR};\ Q_3+1{,}5\,\mathrm{IQR}\,].$$ Преимущество правила — оно опирается на робастные [[kvartili|квартили]] и [[mezhkvartilnyy-razmah|IQR]] и не требует предположения о нормальности (в отличие от правила $k\sigma$). На [[boxplot|box-plot]] выбросы рисуют отдельными точками за усами.`,
		related: ['boxplot', 'mezhkvartilnyy-razmah', 'kvartili']
	},

	indikator: {
		id: 'indikator',
		term: 'Индикатор события',
		short: String.raw`$\mathbb 1\{A\}$ — равен 1, если $A$ произошло, иначе 0.`,
		formula: String.raw`M\,\mathbb 1\{A\} = P(A)`,
		body: String.raw`**Индикатор** события $A$ — это [[bernulli|бернуллиева]] величина $\mathbb 1\{A\}$, равная $1$, если $A$ произошло, и $0$ иначе. Его математическое ожидание равно вероятности события: $M\,\mathbb 1\{A\}=P(A)$, а дисперсия — $P(A)(1-P(A))$. Индикаторы — рабочий приём: сложная вероятность или счёт сводятся к сумме индикаторов (так $n_x=\sum_i\mathbb 1\{X_i<x\}$ даёт биномиальность в выводе для [[empiricheskaya-fr|$\hat F_n$]]).`,
		related: ['bernulli', 'empiricheskaya-fr']
	},

	bernulli: {
		id: 'bernulli',
		term: 'Бернуллиева величина',
		short: String.raw`Принимает 1 с вероятностью $p$ и 0 с вероятностью $1-p$.`,
		formula: String.raw`P(\xi=1)=p,\quad P(\xi=0)=1-p`,
		body: String.raw`**Бернуллиева** величина $\xi$ моделирует один опыт с двумя исходами («успех»/«неудача»): $\xi=1$ с вероятностью $p$ и $\xi=0$ с вероятностью $1-p$. Её характеристики: $M\xi=p$, $D\xi=p(1-p)$. Сумма $n$ независимых бернуллиевых величин имеет биномиальное распределение — отсюда $n_x$ в выводе свойств [[empiricheskaya-fr|эмпирической ФР]].`,
		related: ['indikator', 'empiricheskaya-fr']
	},

	'sluchaynaya-velichina': {
		id: 'sluchaynaya-velichina',
		term: 'Случайная величина',
		short: String.raw`Числовая функция исхода: $X:\Omega\to\mathbb R$.`,
		body: String.raw`**Случайная величина** $X$ — числовая функция элементарного исхода, $X:\Omega\to\mathbb R$. Её поведение полностью описывает функция распределения $F(x)=P(X<x)$. В статистике измеряемый признак [[generalnaya-sovokupnost|генеральной совокупности]] моделируют именно как случайную величину с неизвестной $F$.`,
		related: ['generalnaya-sovokupnost', 'empiricheskaya-fr']
	},

	'lineynost-ozhidaniya': {
		id: 'lineynost-ozhidaniya',
		term: 'Линейность математического ожидания',
		short: String.raw`$M(aX+bY+c)=a\,MX+b\,MY+c$.`,
		formula: String.raw`M(aX + bY + c) = a\,MX + b\,MY + c`,
		body: String.raw`**Линейность** оператора $M$: для постоянных $a,b,c$ и любых $X,Y$ $$M(aX+bY+c)=a\,MX+b\,MY+c.$$ В частности $M(X+Y)=MX+MY$ — **без** предположения о независимости. Это свойство позволяет, например, мгновенно получить $M(n_x)=\sum_i M\,\mathbb 1\{X_i<x\}=np$ в выводе несмещённости [[empiricheskaya-fr|$\hat F_n$]].`,
		related: ['empiricheskaya-fr', 'indikator', 'zakon-bolshih-chisel']
	},

	'neravenstvo-chebysheva': {
		id: 'neravenstvo-chebysheva',
		term: 'Неравенство Чебышёва',
		short: String.raw`$P(|X-MX|\ge\varepsilon)\le DX/\varepsilon^2$.`,
		formula: String.raw`P(|X - MX| \ge \varepsilon) \le \frac{DX}{\varepsilon^2}`,
		body: String.raw`**Неравенство Чебышёва**: для величины с конечной дисперсией и любого $\varepsilon>0$ $$P(|X-MX|\ge\varepsilon)\le\frac{DX}{\varepsilon^2}.$$ Универсальная (работающая для любого распределения) оценка хвоста через дисперсию. Из него следует [[zakon-bolshih-chisel|закон больших чисел]]: подстановка $X=\hat F_n(x)$ с $D\hat F_n\to0$ доказывает состоятельность [[empiricheskaya-fr|эмпирической ФР]].`,
		related: ['zakon-bolshih-chisel', 'empiricheskaya-fr']
	},

	'zakon-bolshih-chisel': {
		id: 'zakon-bolshih-chisel',
		term: 'Закон больших чисел',
		short: String.raw`Выборочное среднее сходится к $MX$ при $n\to\infty$.`,
		formula: String.raw`\bar X_n \xrightarrow{P} MX`,
		body: String.raw`**Закон больших чисел**: среднее независимых одинаково распределённых величин сходится по вероятности к их математическому ожиданию, $\bar X_n\xrightarrow{P}MX$. Доказывается через [[neravenstvo-chebysheva|неравенство Чебышёва]]: $D\bar X_n=DX/n\to0$. Это и есть мост от теории вероятностей к статистике — почему частоты приближают вероятности, а [[empiricheskaya-fr|$\hat F_n$]] приближает $F$ (поточечная часть [[teorema-glivenko|теоремы Гливенко]]).`,
		related: ['neravenstvo-chebysheva', 'empiricheskaya-fr', 'teorema-glivenko']
	}
};
