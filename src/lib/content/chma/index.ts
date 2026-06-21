import type { Subject, Day, Glossary } from '$lib/types';
import { day01 } from './days/day01';
import { day02 } from './days/day02';
import { day03 } from './days/day03';
import { day04 } from './days/day04';
import { day05 } from './days/day05';
import { day06 } from './days/day06';
import { day07 } from './days/day07';
import { day08 } from './days/day08';
import { day09 } from './days/day09';
import { day10 } from './days/day10';
import { day11 } from './days/day11';

// =====================================================================
//  ЧИСЛЕННЫЕ МЕТОДЫ АНАЛИЗА (ЧМА) — «Вычислительная математика».
//  По тексту лекций Е.Г. Хитрова (СПбПУ, 2025). 11 дней-лекций + экзамен.
//   1) Приближение функций (интерполяция, дифф./интегрирование, МНК, Ньютон),
//   2) Вычислительная линейная алгебра (нормы, обусловленность, SVD,
//      итерационные методы, проблема собственных значений).
// =====================================================================

const glossary: Glossary = {
	interpolyaciya: {
		id: 'interpolyaciya',
		term: 'Интерполяция',
		short: String.raw`Построение функции $g$, совпадающей с $f$ в заданных узлах.`,
		body: String.raw`**Интерполяция** — приближение функции $f$ более удобной $g$ так, чтобы $g(x_i)=f(x_i)$ в $n+1$ [[uzel-interp|узлах]] $x_0,\dots,x_n$. Чаще всего $g$ — алгебраический полином. Родственные задачи: [[mnk|сглаживание (МНК)]], [[splajn|сплайны]].`,
		related: ['uzel-interp', 'polinom-lagranzha', 'splajn', 'mnk']
	},
	'uzel-interp': {
		id: 'uzel-interp',
		term: 'Узел интерполяции',
		short: String.raw`Точка $x_i$, в которой значение приближения задано точно.`,
		body: String.raw`**Узлы** $x_0,\dots,x_n$ — точки, где $g(x_i)=f(x_i)$. При несовпадающих узлах система на коэффициенты полинома имеет единственное решение (определитель — [[vandermond|Вандермонда]]).`,
		related: ['vandermond', 'interpolyaciya']
	},
	vandermond: {
		id: 'vandermond',
		term: 'Определитель Вандермонда',
		short: String.raw`Определитель матрицы степеней узлов; $\ne 0$ при несовпадающих узлах.`,
		formula: String.raw`\det\begin{pmatrix}1&x_0&\cdots&x_0^{n}\\ \vdots&&&\vdots\\ 1&x_n&\cdots&x_n^{n}\end{pmatrix}=\prod_{i<j}(x_j-x_i)`,
		body: String.raw`Матрица системы на коэффициенты полинома по степеням $x$ — [[matrica|матрица]] Вандермонда. Её определитель $\prod_{i<j}(x_j-x_i)\ne 0$ при попарно различных узлах, поэтому интерполяционный полином степени $n$ существует и единствен. Прямое решение этой СЛАУ плохо обусловлено, поэтому используют формы [[polinom-lagranzha|Лагранжа]] и [[forma-newtona|Ньютона]].`,
		related: ['polinom-lagranzha', 'forma-newtona']
	},
	'polinom-lagranzha': {
		id: 'polinom-lagranzha',
		term: 'Полином Лагранжа',
		short: String.raw`$Q_n(x)=\sum_k l_k(x)\,f(x_k)$ через [[mnozhitel-lagranzha|множители]] $l_k$.`,
		formula: String.raw`Q_n(x)=\sum_{k=0}^{n} l_k(x)\,f(x_k)`,
		body: String.raw`**Интерполяционный полином Лагранжа** записывается сразу, без решения СЛАУ: $$Q_n(x)=\sum_{k=0}^{n} l_k(x)\,f(x_k),\qquad l_k(x)=\prod_{i\ne k}\frac{x-x_i}{x_k-x_i}.$$ [[mnozhitel-lagranzha|Множитель]] $l_k$ равен $1$ в узле $x_k$ и $0$ в остальных, поэтому $Q_n(x_i)=f(x_i)$.`,
		related: ['mnozhitel-lagranzha', 'ostatochnyy-chlen', 'forma-newtona']
	},
	'mnozhitel-lagranzha': {
		id: 'mnozhitel-lagranzha',
		term: 'Множитель Лагранжа',
		short: String.raw`$l_k(x)=\prod_{i\ne k}\frac{x-x_i}{x_k-x_i}$ — базисный полином, $l_k(x_j)=\delta_{kj}$.`,
		formula: String.raw`l_k(x)=\prod_{i\ne k}\frac{x-x_i}{x_k-x_i}`,
		body: String.raw`Базисные полиномы степени $n$ со свойством $l_k(x_j)=\delta_{kj}$ ($1$ при $j=k$, иначе $0$). Через них любой [[polinom-lagranzha|полином Лагранжа]] есть линейная комбинация значений $f(x_k)$.`,
		related: ['polinom-lagranzha']
	},
	'ostatochnyy-chlen': {
		id: 'ostatochnyy-chlen',
		term: 'Остаточный член интерполяции',
		short: String.raw`Ошибка $R_n(x)=f(x)-Q_n(x)=\frac{f^{(n+1)}(\eta)}{(n+1)!}\,\omega(x)$.`,
		formula: String.raw`R_n(x)=\frac{f^{(n+1)}(\eta)}{(n+1)!}\,\omega(x),\quad \omega(x)=\prod_{i}(x-x_i)`,
		body: String.raw`**Остаточный член** $R_n(x)=f(x)-Q_n(x)$. Через вспомогательную функцию и теорему Ролля выводится $$R_n(x)=\frac{f^{(n+1)}(\eta)}{(n+1)!}\,\omega(x),\qquad \omega(x)=\prod_{i=0}^{n}(x-x_i),$$ где $\eta\in[a;b]$. Оценка сверху: $\varepsilon\le \dfrac{M_{n+1}}{(n+1)!}\,\max|\omega(x)|$, где $M_{n+1}\ge\max|f^{(n+1)}|$. Ошибку уменьшают выбором узлов ([[polinom-chebysheva|Чебышёв]]).`,
		related: ['polinom-chebysheva', 'fenomen-runge']
	},
	'fenomen-runge': {
		id: 'fenomen-runge',
		term: 'Феномен Рунге',
		short: String.raw`Рост ошибки интерполяции к краям при равномерных узлах и больших $n$.`,
		formula: String.raw`f(x)=\frac{1}{1+25x^2}`,
		body: String.raw`Увеличение степени полинома НЕ всегда уменьшает ошибку. На функции Рунге $f(x)=\frac{1}{1+25x^2}$ при равномерных узлах ошибка у краёв отрезка растёт с $n$. Лечится неравномерными узлами — нулями [[polinom-chebysheva|полиномов Чебышёва]].`,
		related: ['polinom-chebysheva', 'ostatochnyy-chlen']
	},
	'polinom-chebysheva': {
		id: 'polinom-chebysheva',
		term: 'Полиномы Чебышёва',
		short: String.raw`$T_n(x)=\cos(n\arccos x)$; их нули минимизируют $\max|\omega(x)|$.`,
		formula: String.raw`T_n(x)=\cos(n\arccos x),\quad x\in[-1;1]`,
		body: String.raw`**Полиномы Чебышёва** $T_n(x)=\cos(n\arccos x)$ на $[-1;1]$ имеют наименьшую равномерную норму среди нормированных полиномов степени $n$. Выбор узлов в нулях $T_{n+1}$ минимизирует $\max|\omega(x)|$ в [[ostatochnyy-chlen|остаточном члене]] и побеждает [[fenomen-runge|феномен Рунге]]. Нули: $x_k=\cos\frac{(2k+1)\pi}{2(n+1)}$.`,
		related: ['fenomen-runge', 'ostatochnyy-chlen']
	},
	'razdelennaya-raznost': {
		id: 'razdelennaya-raznost',
		term: 'Разделённая разность',
		short: String.raw`$f[x_0,\dots,x_k]$ — коэффициенты полинома в [[forma-newtona|форме Ньютона]].`,
		formula: String.raw`f[x_i,x_{i+1}]=\frac{f(x_{i+1})-f(x_i)}{x_{i+1}-x_i}`,
		body: String.raw`**Разделённые разности** строятся рекуррентно: $$f[x_i,\dots,x_{i+k}]=\frac{f[x_{i+1},\dots,x_{i+k}]-f[x_i,\dots,x_{i+k-1}]}{x_{i+k}-x_i}.$$ Они — коэффициенты интерполяционного полинома в [[forma-newtona|форме Ньютона]] и легко пересчитываются при добавлении нового узла.`,
		related: ['forma-newtona']
	},
	'forma-newtona': {
		id: 'forma-newtona',
		term: 'Форма Ньютона',
		short: String.raw`$Q_n(x)=\sum_k f[x_0,\dots,x_k]\prod_{i<k}(x-x_i)$ — тот же полином, удобно дополнять.`,
		formula: String.raw`Q_n(x)=\sum_{k=0}^{n} f[x_0,\dots,x_k]\prod_{i=0}^{k-1}(x-x_i)`,
		body: String.raw`Тот же интерполяционный полином, но через [[razdelennaya-raznost|разделённые разности]]: $$Q_n(x)=f[x_0]+f[x_0,x_1](x-x_0)+\dots+f[x_0,\dots,x_n]\prod_{i=0}^{n-1}(x-x_i).$$ Преимущество перед [[polinom-lagranzha|формой Лагранжа]]: добавление узла $x_{n+1}$ требует лишь одного нового слагаемого, прежние не пересчитываются.`,
		related: ['razdelennaya-raznost', 'polinom-lagranzha']
	},
	'raznostnoe-pribl': {
		id: 'raznostnoe-pribl',
		term: 'Разностное приближение производной',
		short: String.raw`Производная через значения в узлах: напр. $f'\approx\frac{f(x+h)-f(x-h)}{2h}$.`,
		formula: String.raw`f'(x)\approx\frac{f(x+h)-f(x-h)}{2h}+O(h^2)`,
		body: String.raw`Дифференцируя интерполяционный полином, получают **разностные формулы**: правая $\frac{f(x+h)-f(x)}{h}$ ($O(h)$), центральная $\frac{f(x+h)-f(x-h)}{2h}$ ($O(h^2)$), вторая производная $\frac{f(x+h)-2f(x)+f(x-h)}{h^2}$ ($O(h^2)$). Ошибка $\sim h^p$ убывает с $h$, но слишком малое $h$ губит точность из-за вычитания близких чисел.`,
		related: ['kvadraturnaya-formula']
	},
	'kvadraturnaya-formula': {
		id: 'kvadraturnaya-formula',
		term: 'Квадратурная формула',
		short: String.raw`$\int_a^b f\,dx\approx\sum_k A_k f(x_k)$ — интеграл через значения в узлах.`,
		formula: String.raw`\int_a^b f(x)\,dx\approx\sum_{k} A_k\,f(x_k)`,
		body: String.raw`Интегрируя интерполяционный полином, получают **квадратурную формулу** $\int_a^b f\,dx\approx\sum_k A_k f(x_k)$ с весами $A_k=\int_a^b l_k(x)\,dx$. Элементарные: [[formula-trapecij|трапеций]], [[formula-simpsona|Симпсона]]; их сумма по разбиению — [[sostavnaya-formula|составная формула]].`,
		related: ['formula-trapecij', 'formula-simpsona', 'sostavnaya-formula']
	},
	'formula-trapecij': {
		id: 'formula-trapecij',
		term: 'Формула трапеций',
		short: String.raw`$\int_a^b f\approx\frac{h}{2}(f_a+f_b)$; составная — $O(h^2)$.`,
		formula: String.raw`\int_a^b f\,dx\approx\frac{b-a}{2}\bigl(f(a)+f(b)\bigr)`,
		body: String.raw`Линейная интерполяция на отрезке даёт **формулу трапеций** $\frac{h}{2}(f(a)+f(b))$ с ошибкой $-\frac{h^3}{12}f''(\eta)$. [[sostavnaya-formula|Составная]] на $n$ отрезках: $h\big(\tfrac{f_0+f_n}{2}+\sum_{k=1}^{n-1}f_k\big)$, ошибка $O(h^2)$.`,
		related: ['kvadraturnaya-formula', 'formula-simpsona']
	},
	'formula-simpsona': {
		id: 'formula-simpsona',
		term: 'Формула Симпсона',
		short: String.raw`$\frac{h}{3}(f_0+4f_1+f_2)$; составная — $O(h^4)$.`,
		formula: String.raw`\int_a^b f\,dx\approx\frac{h}{3}\bigl(f_0+4f_1+f_2\bigr)`,
		body: String.raw`Квадратичная интерполяция по трём узлам даёт **формулу Симпсона** $\frac{h}{3}(f_0+4f_1+f_2)$, $h=\frac{b-a}{2}$. Ошибка $-\frac{h^5}{90}f^{(4)}(\eta)$; точна для полиномов до 3-й степени. [[sostavnaya-formula|Составная]] — порядок $O(h^4)$.`,
		related: ['kvadraturnaya-formula', 'formula-trapecij']
	},
	'sostavnaya-formula': {
		id: 'sostavnaya-formula',
		term: 'Составная квадратурная формула',
		short: String.raw`Сумма элементарных формул по разбиению отрезка на $n$ частей.`,
		body: String.raw`**Составная формула** — применение элементарной ([[formula-trapecij|трапеций]]/[[formula-simpsona|Симпсона]]) к каждому из $n$ подотрезков с суммированием. Ошибка убывает как $O(h^2)$ (трапеции) или $O(h^4)$ (Симпсон) при $h=\frac{b-a}{n}\to 0$.`,
		related: ['formula-trapecij', 'formula-simpsona']
	},
	splajn: {
		id: 'splajn',
		term: 'Кубический сплайн',
		short: String.raw`Кусочно-кубическая функция класса $C^2$; интерполяция без [[fenomen-runge|Рунге]].`,
		body: String.raw`**Кубический сплайн дефекта 1** — на каждом $[x_i;x_{i+1}]$ кубический полином, склеенный так, что сам сплайн, его первая и вторая производные непрерывны. Коэффициенты находят из трёхдиагональной СЛАУ; нужны **граничные условия** (естественные $S''=0$, заделка, периодические). Ошибка $O(h^4)$, феномена Рунге нет.`,
		related: ['interpolyaciya', 'fenomen-runge']
	},
	mnk: {
		id: 'mnk',
		term: 'Метод наименьших квадратов',
		short: String.raw`Приближение, минимизирующее $\sum (g(x_i)-f_i)^2$; нормальные уравнения.`,
		formula: String.raw`\min_{c}\ \sum_{i}\bigl(g(x_i;c)-f_i\bigr)^2`,
		body: String.raw`**МНК**: при избытке точек ($N$ данных, базис из $m<N$ функций) ищут коэффициенты, минимизирующие сумму квадратов невязок. Условие минимума — **нормальные уравнения** $G^{\top}G\,c=G^{\top}f$, где $G$ — матрица значений базиса. Геометрически это ортогональная проекция $f$ на подпространство базиса.`,
		related: ['interpolyaciya', 'nailuchshee-pribl']
	},
	'nailuchshee-pribl': {
		id: 'nailuchshee-pribl',
		term: 'Наилучшее приближение',
		short: String.raw`Элемент подпространства, ближайший к $f$ по норме пространства.`,
		body: String.raw`В нормированном пространстве **наилучшее приближение** $f$ элементами подпространства $L$ — это $g^*\in L$ с минимальной $\|f-g\|$. В евклидовом (со скалярным произведением) пространстве это ортогональная проекция: $f-g^*\perp L$, что и даёт [[mnk|нормальные уравнения]].`,
		related: ['mnk']
	},
	'metod-deleniya': {
		id: 'metod-deleniya',
		term: 'Метод половинного деления',
		short: String.raw`Деление отрезка со сменой знака пополам; линейная сходимость.`,
		body: String.raw`После **отделения корня** (локализации интервала, где $f$ меняет знак) корень уточняют делением отрезка пополам, выбирая половину со сменой знака. Надёжен, но медленный: ошибка убывает вдвое за шаг (линейная сходимость).`,
		related: ['metod-sekushchih', 'metod-newtona']
	},
	'metod-sekushchih': {
		id: 'metod-sekushchih',
		term: 'Метод секущих',
		short: String.raw`$x_{k+1}=x_k-f_k\frac{x_k-x_{k-1}}{f_k-f_{k-1}}$; порядок $\approx 1{,}618$.`,
		formula: String.raw`x_{k+1}=x_k-f(x_k)\,\frac{x_k-x_{k-1}}{f(x_k)-f(x_{k-1})}`,
		body: String.raw`**Метод секущих** заменяет касательную из [[metod-newtona|Ньютона]] секущей через две последние точки — производная не нужна. Сходимость сверхлинейная, порядок $\varphi=\frac{1+\sqrt5}{2}\approx 1{,}618$.`,
		related: ['metod-newtona', 'metod-deleniya']
	},
	'metod-newtona': {
		id: 'metod-newtona',
		term: 'Метод Ньютона',
		short: String.raw`$x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}$; квадратичная сходимость.`,
		formula: String.raw`x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}`,
		body: String.raw`**Метод Ньютона** (касательных): следующая точка — пересечение касательной с осью. $$x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}.$$ Вблизи простого корня сходится квадратично. Для систем: $x_{k+1}=x_k-J^{-1}(x_k)\,F(x_k)$, где $J$ — [[yakobian|якобиан]]. Чувствителен к начальному приближению (область сходимости).`,
		related: ['metod-sekushchih', 'yakobian']
	},
	yakobian: {
		id: 'yakobian',
		term: 'Якобиан',
		short: String.raw`Матрица частных производных $J_{ij}=\partial F_i/\partial x_j$ векторной функции.`,
		formula: String.raw`J(x)=\Bigl(\frac{\partial F_i}{\partial x_j}\Bigr)`,
		body: String.raw`**Якобиан** $J(x)=\big(\partial F_i/\partial x_j\big)$ — линеаризация векторной функции $F$. В [[metod-newtona|методе Ньютона]] для систем на каждом шаге решают линейную систему $J(x_k)\,\Delta x=-F(x_k)$.`,
		related: ['metod-newtona']
	},
	'norma-vektora': {
		id: 'norma-vektora',
		term: 'Норма вектора',
		short: String.raw`Функция $\|x\|\ge 0$ с аксиомами однородности и неравенства треугольника.`,
		formula: String.raw`\|x\|_p=\Bigl(\sum_i |x_i|^p\Bigr)^{1/p}`,
		body: String.raw`**Норма** удовлетворяет аксиомам: $\|x\|\ge 0$ ($=0\Leftrightarrow x=0$), $\|\alpha x\|=|\alpha|\,\|x\|$, $\|x+y\|\le\|x\|+\|y\|$. [[norma-geldera|Нормы Гёльдера]] $\|x\|_p=(\sum|x_i|^p)^{1/p}$: при $p=1$ — сумма модулей, $p=2$ — евклидова, $p=\infty$ — $\max|x_i|$.`,
		related: ['norma-geldera', 'norma-matricy']
	},
	'norma-geldera': {
		id: 'norma-geldera',
		term: 'Норма Гёльдера ($\ell_p$)',
		short: String.raw`$\|x\|_p=(\sum|x_i|^p)^{1/p}$; частные случаи $p=1,2,\infty$.`,
		formula: String.raw`\|x\|_1=\sum|x_i|,\quad \|x\|_2=\sqrt{\sum x_i^2},\quad \|x\|_\infty=\max_i|x_i|`,
		body: String.raw`Семейство [[norma-vektora|норм]] $\|x\|_p$. Неравенство Гёльдера и Минковского обеспечивают аксиому треугольника. На них строят [[norma-matricy|подчинённые матричные нормы]].`,
		related: ['norma-vektora', 'norma-matricy']
	},
	'norma-matricy': {
		id: 'norma-matricy',
		term: 'Норма матрицы',
		short: String.raw`Подчинённая: $\|A\|=\max_{\|x\|=1}\|Ax\|$; согласована с векторной.`,
		formula: String.raw`\|A\|=\max_{x\ne 0}\frac{\|Ax\|}{\|x\|}`,
		body: String.raw`**Подчинённая** (операторная) норма $\|A\|=\max_{\|x\|=1}\|Ax\|$ согласована с векторной: $\|Ax\|\le\|A\|\,\|x\|$. Для $p=1$ — max сумма модулей по столбцу, $p=\infty$ — по строке, $p=2$ — наибольшее [[svd|сингулярное число]]. Отдельно — [[norma-frobeniusa|норма Фробениуса]].`,
		related: ['norma-vektora', 'norma-frobeniusa', 'chislo-obuslovlennosti']
	},
	'norma-frobeniusa': {
		id: 'norma-frobeniusa',
		term: 'Норма Фробениуса',
		short: String.raw`$\|A\|_F=\sqrt{\sum_{ij} a_{ij}^2}$ — евклидова норма матрицы.`,
		formula: String.raw`\|A\|_F=\sqrt{\sum_{i,j} a_{ij}^2}=\sqrt{\operatorname{tr}(A^{\top}A)}`,
		body: String.raw`**Норма Фробениуса** — корень из суммы квадратов всех элементов; инвариантна к ортогональным преобразованиям. В [[vrashcheniya-yakobi|методе вращений Якоби]] она сохраняется, а внедиагональная часть монотонно убывает.`,
		related: ['norma-matricy', 'vrashcheniya-yakobi']
	},
	'chislo-obuslovlennosti': {
		id: 'chislo-obuslovlennosti',
		term: 'Число обусловленности',
		short: String.raw`$\operatorname{cond}(A)=\|A\|\,\|A^{-1}\|$ — усиление относительной ошибки.`,
		formula: String.raw`\operatorname{cond}(A)=\|A\|\cdot\|A^{-1}\|\ge 1`,
		body: String.raw`**Число обусловленности** $\operatorname{cond}(A)=\|A\|\,\|A^{-1}\|$ показывает, во сколько раз относительная погрешность данных может усилиться в решении $Ax=b$: $\frac{\|\Delta x\|}{\|x\|}\le\operatorname{cond}(A)\,\frac{\|\Delta b\|}{\|b\|}$. Большое $\operatorname{cond}$ — плохо обусловленная задача. Для $\|\cdot\|_2$ равно отношению $\sigma_{\max}/\sigma_{\min}$ [[svd|сингулярных чисел]].`,
		related: ['norma-matricy', 'svd']
	},
	svd: {
		id: 'svd',
		term: 'Сингулярное разложение (SVD)',
		short: String.raw`$A=U\Sigma V^{\top}$; $\sigma_i\ge 0$ — сингулярные числа.`,
		formula: String.raw`A=U\Sigma V^{\top},\quad \Sigma=\operatorname{diag}(\sigma_1\ge\dots\ge\sigma_r>0)`,
		body: String.raw`**SVD**: любая матрица $A=U\Sigma V^{\top}$, где $U,V$ ортогональны, $\Sigma$ диагональна с **сингулярными числами** $\sigma_i=\sqrt{\lambda_i(A^{\top}A)}\ge 0$. Даёт ранг, [[chislo-obuslovlennosti|обусловленность]] ($\sigma_{\max}/\sigma_{\min}$), наилучшее малоранговое приближение (Эккарт–Янг) и псевдообратную.`,
		related: ['chislo-obuslovlennosti', 'norma-matricy']
	},
	'metod-yakobi': {
		id: 'metod-yakobi',
		term: 'Метод Якоби',
		short: String.raw`Итерации $x^{(k+1)}=D^{-1}(b-(L+U)x^{(k)})$; сходимость при диаг. преобладании.`,
		formula: String.raw`x_i^{(k+1)}=\frac{1}{a_{ii}}\Bigl(b_i-\sum_{j\ne i}a_{ij}x_j^{(k)}\Bigr)`,
		body: String.raw`**Метод Якоби** для $Ax=b$: расщепление $A=D+L+U$, итерация $x^{(k+1)}=D^{-1}\!\big(b-(L+U)x^{(k)}\big)$. Все компоненты обновляются по значениям с прошлого шага. Сходится, если спектральный радиус матрицы перехода $<1$ (достаточно — строгое диагональное преобладание).`,
		related: ['metod-gaussa-zejdelya', 'chislo-obuslovlennosti']
	},
	'metod-gaussa-zejdelya': {
		id: 'metod-gaussa-zejdelya',
		term: 'Метод Гаусса–Зейделя',
		short: String.raw`Как Якоби, но сразу используются уже обновлённые компоненты.`,
		formula: String.raw`x_i^{(k+1)}=\frac{1}{a_{ii}}\Bigl(b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}-\sum_{j>i}a_{ij}x_j^{(k)}\Bigr)`,
		body: String.raw`**Гаусс–Зейдель** отличается от [[metod-yakobi|Якоби]] тем, что в правой части используются уже пересчитанные на текущем шаге компоненты. Часто сходится быстрее; для симметричных положительно определённых матриц сходится всегда.`,
		related: ['metod-yakobi']
	},
	'stepennoj-metod': {
		id: 'stepennoj-metod',
		term: 'Степенной метод',
		short: String.raw`$x^{(k+1)}=Ax^{(k)}$ сходится к собственному вектору с $\max|\lambda|$.`,
		formula: String.raw`\lambda_{\max}\approx\frac{(Ax^{(k)},x^{(k)})}{(x^{(k)},x^{(k)})}`,
		body: String.raw`**Степенной метод** решает частичную проблему: повторное умножение $x^{(k+1)}=Ax^{(k)}/\|Ax^{(k)}\|$ сходится к собственному вектору наибольшего по модулю собственного числа; само $\lambda_{\max}$ — через отношение Рэлея. Минимальное по модулю — степенным методом для $A^{-1}$. Скорость $\sim|\lambda_2/\lambda_1|^k$.`,
		related: ['vrashcheniya-yakobi', 'svd']
	},
	'vrashcheniya-yakobi': {
		id: 'vrashcheniya-yakobi',
		term: 'Метод вращений Якоби',
		short: String.raw`Серия плоских поворотов обнуляет внедиагональные элементы симм. матрицы.`,
		body: String.raw`**Метод вращений Якоби** решает полную проблему для симметричной матрицы: последовательными плоскими поворотами $G^{\top}AG$ обнуляют наибольший внедиагональный элемент. Угол выбирается по лемме о существовании; [[norma-frobeniusa|норма Фробениуса]] сохраняется, а внедиагональная часть монотонно стремится к нулю — на диагонали остаются собственные числа.`,
		related: ['stepennoj-metod', 'norma-frobeniusa']
	}
};


const examQ = (heading: string, body: string) => ({ heading, body, collapsible: true });

const examDay: Day = {
	n: 12,
	phaseId: 'exam',
	unitLabel: 'Экзамен',
	title: 'Вопросы к экзамену (17)',
	chapterRef: 'экзамен',
	est: '—',
	kind: 'theory',
	goal: String.raw`Полный перечень теоретических вопросов экзамена по ЧМА со ссылками на дни-конспекты.`,
	sections: [
		examQ('Билет 1. Постановка задачи интерполяции; полином Лагранжа', String.raw`Прямое решение через СЛАУ ([[vandermond|Вандермонд]]) и форма [[polinom-lagranzha|Лагранжа]] через [[mnozhitel-lagranzha|множители]]. См. [День 1](/aii/chma/4/day/1).`),
		examQ('Билет 2. Оценка остаточного члена; форма Ньютона', String.raw`[[ostatochnyy-chlen|Остаточный член]] $R_n=\frac{f^{(n+1)}(\eta)}{(n+1)!}\omega(x)$ и [[forma-newtona|форма Ньютона]] через [[razdelennaya-raznost|разделённые разности]]. См. [День 2](/aii/chma/4/day/2), [День 3](/aii/chma/4/day/3).`),
		examQ('Билет 3. Феномен Рунге; полиномы Чебышёва; минимизация остаточного члена', String.raw`[[fenomen-runge|Феномен Рунге]], [[polinom-chebysheva|полиномы Чебышёва]], выбор узлов в их нулях. См. [День 2](/aii/chma/4/day/2).`),
		examQ('Билет 4. Разностные приближения производных; их ошибки', String.raw`[[raznostnoe-pribl|Разностные формулы]] из дифференцирования полинома; порядок ошибки. См. [День 4](/aii/chma/4/day/4).`),
		examQ('Билет 5. Элементарные квадратурные формулы; ошибки', String.raw`[[formula-trapecij|Трапеций]], [[formula-simpsona|Симпсона]] из интегрирования полинома. См. [День 5](/aii/chma/4/day/5).`),
		examQ('Билет 6. Составные квадратурные формулы; ошибки', String.raw`[[sostavnaya-formula|Составные формулы]]: порядок $O(h^2)$ и $O(h^4)$. См. [День 5](/aii/chma/4/day/5).`),
		examQ('Билет 7. Кубический интерполяционный сплайн дефекта 1', String.raw`[[splajn|Кубический сплайн]]: СЛАУ на коэффициенты, граничные условия, ошибка. См. [День 6](/aii/chma/4/day/6).`),
		examQ('Билет 8. Метод наименьших квадратов', String.raw`[[mnk|МНК]] и [[nailuchshee-pribl|наилучшее приближение]]: нормальные уравнения. См. [День 6](/aii/chma/4/day/6).`),
		examQ('Билет 9. Аксиомы норм; нормы Гёльдера; согласованность', String.raw`[[norma-vektora|Векторные]] и [[norma-matricy|матричные]] нормы, [[norma-geldera|Гёльдера]], подчинённость. См. [День 8](/aii/chma/4/day/8).`),
		examQ('Билет 10. Число обусловленности матрицы', String.raw`[[chislo-obuslovlennosti|Обусловленность]] и связь с относительной погрешностью. См. [День 8](/aii/chma/4/day/8).`),
		examQ('Билет 11. Итерационные процессы; метод Якоби', String.raw`Структура и сходимость итераций, [[metod-yakobi|Якоби]]. См. [День 10](/aii/chma/4/day/10).`),
		examQ('Билет 12. Итерационные процессы; метод Гаусса–Зейделя', String.raw`[[metod-gaussa-zejdelya|Гаусс–Зейдель]] и его сходимость. См. [День 10](/aii/chma/4/day/10).`),
		examQ('Билет 13. Степенной метод; крайние собственные числа', String.raw`[[stepennoj-metod|Степенной метод]], скорость сходимости, оценка ошибки. См. [День 11](/aii/chma/4/day/11).`),
		examQ('Билет 14. Метод вращений Якоби; норма Фробениуса', String.raw`[[vrashcheniya-yakobi|Вращения Якоби]], лемма об угле, [[norma-frobeniusa|норма Фробениуса]]. См. [День 11](/aii/chma/4/day/11).`),
		examQ('Билет 15. Сингулярное разложение; алгоритмы построения', String.raw`Структура [[svd|SVD]], сингулярные числа, применения. См. [День 9](/aii/chma/4/day/9).`),
		examQ('Билет 16. Отделение корней; деление пополам, секущие', String.raw`[[metod-deleniya|Деление пополам]], [[metod-sekushchih|секущие]], скорость сходимости. См. [День 7](/aii/chma/4/day/7).`),
		examQ('Билет 17. Метод Ньютона для систем нелинейных уравнений', String.raw`[[metod-newtona|Метод Ньютона]] и [[yakobian|якобиан]], рабочие формулы, область сходимости. См. [День 7](/aii/chma/4/day/7).`)
	],
	tasks: [],
	mastery: []
};

export const chma: Subject = {
	id: 'chma',
	name: 'Численные методы анализа',
	short: 'ЧМА',
	blurb: String.raw`Вычислительная математика: интерполяция и приближение функций, численное дифференцирование и интегрирование, вычислительная линейная алгебра. По тексту лекций Е.Г. Хитрова (СПбПУ).`,
	accent: '#0e8f8f',
	glyph: '≈',
	courses: [
		{
			semester: 4,
			year: 2026,
			status: 'ready',
			phases: [
				{ id: 'approx', title: 'Приближение функций', subtitle: 'Раздел 1', hue: 175 },
				{ id: 'linalg', title: 'Вычислительная линейная алгебра', subtitle: 'Раздел 2', hue: 200 },
				{ id: 'exam', title: 'Экзамен', subtitle: 'Перечень вопросов', hue: 150 }
			],
			days: [
				day01,
				day02,
				day03,
				day04,
				day05,
				day06,
				day07,
				day08,
				day09,
				day10,
				day11,
				examDay
			],
			glossary
		}
	]
};
