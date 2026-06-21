import type { Day } from '$lib/types';

export const day07: Day = {
	n: 7,
	phaseId: "approx",
	title: "День 9. Решение нелинейных уравнений и систем",
	chapterRef: "ч1·т1.9",
	est: '–2 ч'.replace('–','1–'),
	kind: 'theory',
	goal: String.raw`Научиться численно находить корни уравнения $f(x)=0$ и систем $\mathbf{f}(\mathbf{x})=\bar 0$: отделять (локализовать) корень, гарантированно сжимать отрезок [[metod-deleniya|половинным делением]], ускоряться [[metod-sekushchih|методом секущих]] (порядок $\approx 1{,}618$) и [[metod-newtona|методом Ньютона]] (квадратичная сходимость), а затем перенести Ньютона на системы через [[yakobian|якобиан]] с пониманием области сходимости.`,
	sections: [
		{
			kind: "definition",
			heading: "Задача о корне, локализация и критерий остановки",
			body: String.raw`Пусть $f:\mathbb{R}\to\mathbb{R}$ — нелинейная функция. **Задача о корне**: найти $x^\*$ такое, что
$$x^\*:\quad f(x^\*)=0.$$
В отличие от линейных уравнений, явной формулы для $x^\*$, как правило, нет, поэтому корень ищут *итерационно* — строят последовательность $x_0,x_1,x_2,\dots\to x^\*$.

**Локализация (отделение) корня.** Говорят, что корень *локализован* на отрезке $[a;b]$, если
$$\exists!\,x^\*:\ f(x^\*)=0,\quad x^\*\in(a;b).$$
Достаточное условие существования даёт теорема Больцано–Коши: если $f$ непрерывна на $[a;b]$ и $f(a)\,f(b)<0$ (концевые знаки разные), то внутри есть корень; если вдобавок $f$ строго монотонна (например, $f'$ не меняет знак), корень единственный. Практически отделение делают, считая $f$ на сетке узлов и выбирая соседние точки с разными знаками.

**Критерий остановки.** Пусть $\tilde x$ — приближение, $\varepsilon=|x^\*-\tilde x|$ — его *ошибка*, а $\bar\varepsilon$ — заданная точность. Останавливаемся, когда гарантированно $\varepsilon\le\bar\varepsilon$. Для отрезочных методов, где $\tilde x=c\in[a;b]$ и $x^\*\in[a;b]$, выполнено $\varepsilon\le b-a$, поэтому достаточно довести длину отрезка до $b-a\le\bar\varepsilon$. Это даёт *апостериорную* (по факту вычисления) оценку точности.`
		},
		{
			kind: "definition",
			heading: "Половинное деление и метод секущих",
			body: String.raw`## Метод половинного деления
Пусть корень локализован на $[a;b]$, $f(a)f(b)<0$. На каждом шаге берём середину
$$c=\frac{a+b}{2}$$
и сравниваем знаки. **Правило сжатия** (как в конспекте): если $\operatorname{sign}\,f(a)=\operatorname{sign}\,f(c)$, то корень правее $c$, полагаем $a:=c$; иначе корень левее, полагаем $b:=c$. На каждой итерации длина отрезка делится пополам, корень остаётся внутри. Метод [[metod-deleniya|деления отрезка пополам]] всегда сходится при $f(a)f(b)<0$, но *линейно*: ошибка убывает в $2$ раза за шаг.

## Метод секущих
Идея: заменить $f$ на $[a;b]$ её *линейным интерполянтом* $Q_1(x)$ ([[polinom-lagranzha|полином Лагранжа]] первой степени по узлам $a,b$) и взять за приближение корня нуль этого полинома:
$$Q_1(x)=\frac{x-b}{a-b}\,f(a)+\frac{x-a}{b-a}\,f(b).$$
Из $Q_1(x)=0$ (вывод — в секции derivation) получается точка пересечения секущей с осью. Итерационная форма метода [[metod-sekushchih|секущих]] использует две предыдущие точки:
$$x_{k+1}=x_k-\frac{f(x_k)\,(x_k-x_{k-1})}{f(x_k)-f(x_{k-1})}.$$
Геометрически это абсцисса пересечения с осью $Ox$ прямой (секущей), проведённой через точки $(x_{k-1},f(x_{k-1}))$ и $(x_k,f(x_k))$. Метод не требует производной, но требует двух стартовых точек.`
		},
		{
			kind: "derivation",
			heading: "Вывод метода Ньютона и квадратичной сходимости",
			body: String.raw`## Шаг 1. Формула касательных из ряда Тейлора
Ищем $x^\*$ с $f(x^\*)=0$. Пусть $x$ — текущее приближение, $\varepsilon=x^\*-x$ — ошибка. Разложим $f$ в точке $x^\*=x+\varepsilon$ в ряд Тейлора:
$$f(x^\*)=f(x+\varepsilon)=f(x)+\varepsilon f'(x)+\tfrac{1}{2}\varepsilon^2 f''(x)+O(\varepsilon^3)=0.$$
При малом $\varepsilon$ отбросим члены порядка $\varepsilon^2$ и выше:
$$f(x)+\varepsilon f'(x)\approx 0\ \Rightarrow\ \varepsilon\approx-\frac{f(x)}{f'(x)}.$$
Так как $x^\*=x+\varepsilon$, получаем уточнение
$$x^\*\approx x-\frac{f(x)}{f'(x)},$$
и итерационный процесс ([[metod-newtona|метод Ньютона]], касательные):
$$x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}.\qquad(\text{1.46})$$

## Шаг 2. Геометрический смысл (касательная)
Проведём в точке $(x_0,f(x_0))$ касательную; её угловой коэффициент $f'(x_0)$. Из прямоугольного треугольника $\operatorname{tg}\varphi=\dfrac{f(x_0)}{x_0-x_1}$, то есть $f'(x_0)=-\dfrac{f(x_0)}{x_1-x_0}$, откуда
$$x_1-x_0=-\frac{f(x_0)}{f'(x_0)}\ \Rightarrow\ x_1=x_0-\frac{f(x_0)}{f'(x_0)}.$$
То есть $x_{k+1}$ — точка пересечения касательной с осью $Ox$.

## Шаг 3. Оценка скорости — выводим квадратичность
Ошибка на следующем шаге $\varepsilon_{k+1}=x^\*-x_{k+1}$. Подставим (1.46):
$$\varepsilon_{k+1}=x^\*-x_k+\frac{f(x_k)}{f'(x_k)}=\varepsilon_k+\frac{f(x_k)}{f'(x_k)}=\frac{\varepsilon_k f'(x_k)+f(x_k)}{f'(x_k)}.$$
Теперь разложим точное равенство $f(x^\*)=0$ в точке $x_k$: так как $x^\*=x_k+\varepsilon_k$,
$$0=f(x_k)+\varepsilon_k f'(x_k)+\tfrac12\varepsilon_k^2 f''(x_k)+O(\varepsilon_k^3),$$
откуда **числитель** прошлой дроби равен
$$\varepsilon_k f'(x_k)+f(x_k)=-\tfrac12\varepsilon_k^2 f''(x_k)-O(\varepsilon_k^3).$$
Подставляя,
$$\varepsilon_{k+1}=\frac{-\big(\tfrac12\varepsilon_k^2 f''(x_k)+O(\varepsilon_k^3)\big)}{f'(x_k)}\approx-\varepsilon_k^2\,\frac{f''(x_k)}{2f'(x_k)}.$$
Переходя к модулям, получаем **квадратичную оценку сходимости**:
$$|\varepsilon_{k+1}|\approx\left|\frac{f''(x_k)}{2f'(x_k)}\right|\varepsilon_k^2=C\,\varepsilon_k^2,\qquad C=\left|\frac{f''(x_k)}{2f'(x_k)}\right|.\qquad(\text{1.47})$$
Число верных знаков примерно удваивается за итерацию. $\blacksquare$`
		},
		{
			kind: "theorem",
			heading: "Достаточные условия сходимости Ньютона и порядок секущих",
			body: String.raw`**Условия сходимости Ньютона (область сходимости).** Квадратичная оценка (1.47) получена при предположениях о гладкости. Сформулируем их так: пусть на $[a;b]$ локализован корень и выполнено
$$\left|\frac{1}{f'(x)}\right|<A,\qquad \left|\frac{f(x)}{f'(x)}\right|<B,\qquad |f''(x)|\le C\le\frac{1}{2AB}=\frac12\frac{(f'(x))^2}{|f(x)|}.\qquad(\text{1.48})$$
Тогда если начальное приближение взято в середине отрезка $x_0=\dfrac{b-a}{2}$ (точнее, $x_0=\dfrac{a+b}{2}$), длина которого
$$b-a<\frac{1}{AB}\Big(1-\sqrt{1-2ABC}\Big),\qquad(\text{1.49})$$
то итерационный процесс (1.46) сходится к $x^\*$. Строгое доказательство и точные оценки области сходимости даются **теоремами Канторовича**. Содержательно: $f'$ не должна быть мала у корня (нет кратного корня), $f''$ ограничена, старт достаточно близок.

**Порядок метода секущих.** Для секущих ошибка удовлетворяет $\varepsilon_{k+1}\approx M\,\varepsilon_k\,\varepsilon_{k-1}$. Ищем порядок $p$ из соотношения $|\varepsilon_{k+1}|\sim|\varepsilon_k|^p$. Подстановка даёт $p^2=p+1$, откуда
$$p=\frac{1+\sqrt5}{2}\approx1{,}618.$$
Это *сверхлинейный* порядок: быстрее деления пополам ($p=1$), медленнее Ньютона ($p=2$), но без вычисления $f'$ (вывод $p$ — в задаче со звёздочкой).`
		},
		{
			kind: "intuition",
			heading: "Почему так работает: касательная против секущей против деления",
			body: String.raw`**Деление пополам** не использует *величину* $f$ — только знак. Поэтому оно слепо, но непробиваемо надёжно: пока концы разного знака, корень заперт внутри и отрезок честно ужимается вдвое. Цена надёжности — линейность: чтобы добавить один десятичный знак, нужно $\log_2 10\approx 3{,}3$ шага.

**Метод секущих и Ньютона** используют форму графика. Заменяя $f$ прямой, мы решаем не исходную, а *линеаризованную* задачу — и тем точнее, чем ближе мы к корню, где гладкая функция почти неотличима от своей касательной. Ключ к скорости — в выводе (1.47): остаточный член Тейлора в нуле имеет порядок $\varepsilon^2$, поэтому *новая* ошибка пропорциональна *квадрату* старой. Если $\varepsilon_k\sim10^{-3}$, то $\varepsilon_{k+1}\sim C\cdot10^{-6}$ — отсюда «удвоение числа верных знаков».

Разница Ньютон/секущие — в том, *откуда* берётся наклон прямой. Ньютон берёт *точную* касательную $f'(x_k)$ (нужна производная, идеальный наклон $\Rightarrow p=2$). Секущие приближают наклон конечной разностью $\dfrac{f(x_k)-f(x_{k-1})}{x_k-x_{k-1}}$ ([[raznostnoe-pribl|разностное приближение]] производной): наклон чуть запаздывает, поэтому порядок падает до $1{,}618$. Но один шаг секущих требует *одного* нового вычисления $f$ (а Ньютон — двух: $f$ и $f'$), так что по числу вычислений $f$ секущие часто конкурентоспособны.

Оборотная сторона скорости — **локальность**: квадратичная сходимость гарантирована лишь вблизи корня (условия 1.48–1.49). Стартовав далеко, Ньютон может «улететь» (зацепиться за пологий участок, где $f'\approx0$). Отсюда стандартная гибридная стратегия: сперва несколько шагов деления для локализации, затем Ньютон/секущие для добивания.`
		},
		{
			kind: "derivation",
			heading: "Ньютон для систем: рабочие формулы через якобиан",
			body: String.raw`## Постановка
Пусть надо решить систему $m$ нелинейных уравнений с $m$ неизвестными:
$$\mathbf{f}(\mathbf{x}^\*)=\bar0,\qquad \mathbf{x}=\begin{bmatrix}x_1\\\vdots\\x_m\end{bmatrix},\quad \mathbf{f}(\mathbf{x})=\begin{bmatrix}f_1(x_1,\dots,x_m)\\\vdots\\f_m(x_1,\dots,x_m)\end{bmatrix}.$$

## Шаг 1. Многомерный ряд Тейлора
Пусть $\mathbf{x}^\*=\mathbf{x}+\boldsymbol\varepsilon$. Многомерный аналог разложения первого порядка:
$$\mathbf{f}(\mathbf{x}^\*)=\mathbf{f}(\mathbf{x}+\boldsymbol\varepsilon)=\mathbf{f}(\mathbf{x})+J(\mathbf{x})\,\boldsymbol\varepsilon+O(\|\boldsymbol\varepsilon\|^2)=\bar0,$$
где роль производной играет матрица [[yakobian|Якоби]]:
$$J(\mathbf{x})=\mathbf{f}'(\mathbf{x})=\begin{bmatrix}\dfrac{\partial f_1}{\partial x_1}&\cdots&\dfrac{\partial f_1}{\partial x_m}\\\vdots&\ddots&\vdots\\\dfrac{\partial f_m}{\partial x_1}&\cdots&\dfrac{\partial f_m}{\partial x_m}\end{bmatrix}.$$

## Шаг 2. Линеаризация и итерация
Отбросив $O(\|\boldsymbol\varepsilon\|^2)$ и подставив $\boldsymbol\varepsilon=\mathbf{x}^\*-\mathbf{x}$:
$$\mathbf{f}(\mathbf{x})+J(\mathbf{x})(\mathbf{x}^\*-\mathbf{x})\approx\bar0\ \Rightarrow\ \mathbf{x}^\*\approx\mathbf{x}-[J(\mathbf{x})]^{-1}\mathbf{f}(\mathbf{x}).$$
Отсюда **итерационный процесс Ньютона для систем**:
$$\boxed{\,\mathbf{x}_{k+1}=\mathbf{x}_k-[J(\mathbf{x}_k)]^{-1}\mathbf{f}(\mathbf{x}_k).\,}\qquad(\text{1.50})$$
На практике **матрицу не обращают**, а решают линейную систему относительно поправки $\Delta\mathbf{x}_k=\mathbf{x}_{k+1}-\mathbf{x}_k$:
$$J(\mathbf{x}_k)\,\Delta\mathbf{x}_k=-\mathbf{f}(\mathbf{x}_k),\qquad \mathbf{x}_{k+1}=\mathbf{x}_k+\Delta\mathbf{x}_k.$$
Это дешевле и устойчивее (одно решение СЛАУ через [[metod-gaussa-zejdelya|прямые методы]] вместо явного $J^{-1}$).

## Шаг 3. Второй вывод той же формулы (параметризация)
Пусть $\mathbf{x}^\*=\mathbf{x}+\boldsymbol\varepsilon$. Рассмотрим $\mathbf{g}(t)=\mathbf{f}(\mathbf{x}+t\boldsymbol\varepsilon)$ и её производную по скаляру $t$:
$$\frac{d\,\mathbf{f}(\mathbf{x}+t\boldsymbol\varepsilon)}{dt}=\frac{\partial \mathbf{f}(\mathbf{x}+t\boldsymbol\varepsilon)}{\partial(\mathbf{x}+t\boldsymbol\varepsilon)}\,\boldsymbol\varepsilon.$$
Интегрируя по $t$ от $0$ до $1$, точно получаем
$$\int_0^1\frac{d\,\mathbf{f}(\mathbf{x}+t\boldsymbol\varepsilon)}{dt}\,dt=\mathbf{f}(\mathbf{x}+\boldsymbol\varepsilon)-\mathbf{f}(\mathbf{x})=-\mathbf{f}(\mathbf{x}),$$
поскольку $\mathbf{f}(\mathbf{x}+\boldsymbol\varepsilon)=\mathbf{f}(\mathbf{x}^\*)=\bar0$. С другой стороны, приближая интеграл формулой [[kvadraturnaya-formula|прямоугольников]] (значение в левом узле, длина $1-0=1$):
$$\int_0^1\frac{\partial\mathbf{f}(\mathbf{x}+t\boldsymbol\varepsilon)}{\partial(\mathbf{x}+t\boldsymbol\varepsilon)}\boldsymbol\varepsilon\,dt\approx(1-0)\Big[\tfrac{\partial\mathbf{f}(\mathbf{x})}{\partial\mathbf{x}}\Big]\boldsymbol\varepsilon=J(\mathbf{x})(\mathbf{x}^\*-\mathbf{x}).$$
Сравнивая: $-\mathbf{f}(\mathbf{x})\approx J(\mathbf{x})(\mathbf{x}^\*-\mathbf{x})\Rightarrow\mathbf{x}^\*\approx\mathbf{x}-[J(\mathbf{x})]^{-1}\mathbf{f}(\mathbf{x})$ — та же структура (1.50). $\blacksquare$`
		},
		{
			kind: "connection",
			heading: "Область сходимости систем и связь с другими темами",
			body: String.raw`**Область сходимости для систем.** Скалярные условия (1.48)–(1.49) обобщаются: вместо $|1/f'|$ работает [[norma-matricy|норма]] $\|J^{-1}\|$, вместо $|f''|$ — оценка вторых производных компонент $\mathbf{f}$. Метод (1.50) сходится квадратично, если $J(\mathbf{x}^\*)$ *невырождена* ($\det J\ne0$), $\mathbf{f}$ дважды непрерывно дифференцируема, а старт $\mathbf{x}_0$ достаточно близок к $\mathbf{x}^\*$ — это содержание **теоремы Канторовича** в многомерной форме. Близость измеряется в выбранной [[norma-vektora|векторной норме]] (см. [[norma-geldera|нормы Гёльдера]] $\|x\|_p$); качество $J$ как линейного оператора характеризует [[chislo-obuslovlennosti|число обусловленности]] $\operatorname{cond}(J)$: большое $\operatorname{cond}$ означает, что поправка $\Delta\mathbf{x}$ ненадёжна и сходимость ухудшается.

**Связи с курсом.**
- Линеаризация — это [[interpolyaciya|интерполяция]] $f$ полиномом первой степени ([[polinom-lagranzha|Лагранж]] по двум узлам в секущих); остаток интерполяции порождает множитель $f''/2$ в оценке (1.47).
- Каждый шаг Ньютона для систем — это решение СЛАУ $J\Delta\mathbf{x}=-\mathbf{f}$, то есть стык с разделом вычислительной линейной алгебры (прямые методы, [[metod-yakobi|итерационные методы]] для больших разрежённых $J$).
- Шаг параметризации опирается на квадратурную [[formula-trapecij|формулу прямоугольников]] — мостик к теме численного интегрирования.
- Если $\mathbf{f}=\nabla F$ (градиент скалярной функции), Ньютон для $\nabla F=\bar0$ — это метод Ньютона *оптимизации*: $J$ становится матрицей Гессе. Так нахождение корней системы напрямую переходит в безусловную минимизацию.

**Практический протокол.** (1) Отделить корень/область. (2) Несколько шагов деления — для надёжной локализации. (3) Ньютон/секущие — для быстрого добивания до $\bar\varepsilon$. (4) Контроль: $\|\mathbf{f}(\mathbf{x}_k)\|<\bar\varepsilon$ и $\|\Delta\mathbf{x}_k\|<\bar\varepsilon$ одновременно.`
		}
	],
	code: {
		title: "Деление, секущие и Ньютон: ошибка и порядок сходимости",
		language: 'python',
		code: String.raw`import numpy as np
import matplotlib.pyplot as plt

# f(x) = x^3 - x - 2, корень около 1.5213797...
f  = lambda x: x**3 - x - 2.0
df = lambda x: 3.0*x**2 - 1.0
root = 1.5213797068045676  # эталон высокой точности для оценки ошибки

def bisection(a, b, tol=1e-14, nmax=200):
    fa = f(a); hist = []
    for _ in range(nmax):
        c = 0.5*(a+b); fc = f(c)
        hist.append(abs(c-root))
        if b-a < tol:
            break
        if np.sign(fc) == np.sign(fa):
            a, fa = c, fc      # корень правее: a := c
        else:
            b = c              # корень левее:  b := c
    return c, hist

def secant(x0, x1, tol=1e-15, nmax=100):
    hist = [abs(x1-root)]; f0, f1 = f(x0), f(x1)
    for _ in range(nmax):
        x2 = x1 - f1*(x1-x0)/(f1-f0)
        hist.append(abs(x2-root))
        if abs(x2-x1) < tol:
            break
        x0, f0, x1, f1 = x1, f1, x2, f(x2)
    return x2, hist

def newton(x0, tol=1e-15, nmax=100):
    hist = [abs(x0-root)]; x = x0
    for _ in range(nmax):
        x_new = x - f(x)/df(x)
        hist.append(abs(x_new-root))
        if abs(x_new-x) < tol:
            break
        x = x_new
    return x, hist

xb, hb = bisection(1.0, 2.0)
xs, hs = secant(1.0, 2.0)
xn, hn = newton(1.5)
print('корень (эталон): %.15f' % root)
print('деление:  итераций=%2d  x=%.15f' % (len(hb), xb))
print('секущие:  итераций=%2d  x=%.15f' % (len(hs), xs))
print('Ньютон:   итераций=%2d  x=%.15f' % (len(hn), xn))

print('\nНьютон: e_(k+1)/e_k^2 должно стремиться к C=|f"/2f\'|:')
for k in range(len(hn)-1):
    if hn[k] > 0 and hn[k+1] > 0:
        print('  k=%d  e_k=%.3e  ratio=%.4f' % (k, hn[k], hn[k+1]/hn[k]**2))

print('\nСекущие: эмпирический порядок p (должен -> 1.618):')
for k in range(1, len(hs)-1):
    if hs[k-1] > 0 and hs[k] > 0 and hs[k+1] > 0:
        p = np.log(hs[k+1]/hs[k]) / np.log(hs[k]/hs[k-1])
        print('  k=%d  p=%.4f' % (k, p))

# ===================== ГРАФИК =====================
fig, (axL, axR) = plt.subplots(1, 2, figsize=(8, 4.2))

# --- СЛЕВА: f(x) вокруг корня, ось y=0 и отмеченный корень ---
xx = np.linspace(1.0, 2.0, 400)
axL.plot(xx, f(xx), color='C0', lw=2, label=r'$f(x)=x^3-x-2$')
axL.axhline(0.0, color='gray', lw=1)                       # ось y=0
axL.axvline(root, color='C3', ls='--', lw=1, alpha=0.7)
axL.plot([root], [0.0], 'o', color='C3', ms=8,
         label=r'корень $x^*\approx%.5f$' % root)
axL.set_title('Функция и её корень на $[1;2]$')
axL.set_xlabel('$x$'); axL.set_ylabel('$f(x)$')
axL.grid(alpha=0.3); axL.legend(loc='upper left', fontsize=8)

# --- СПРАВА: semilogy ошибки |x_k - корень| по итерациям ---
axR.semilogy(range(len(hb)), hb, 's-', color='C0', ms=4,
             label='деление пополам (p=1)')
axR.semilogy(range(len(hs)), hs, '^-', color='C2', ms=5,
             label=r'секущие (p$\approx$1.618)')
axR.semilogy(range(len(hn)), hn, 'o-', color='C3', ms=5,
             label='Ньютон (p=2)')
axR.set_title('Сходимость: ошибка по итерациям')
axR.set_xlabel('номер итерации $k$')
axR.set_ylabel(r'$|x_k - x^*|$ (log)')
axR.grid(alpha=0.3, which='both'); axR.legend(loc='upper right', fontsize=8)

fig.suptitle('Нелинейное уравнение $x^3-x-2=0$: методы и порядки сходимости',
             fontsize=11)
fig.tight_layout()

plt.show()`,
		explanation: "**В коде.** Один и тот же корень $x^\\*\\approx1{,}5213797$ ищется тремя методами от одинаковой локализации $[1;2]$, и в массивы `hist` пишется ошибка $|x_k-x^\\*|$ на каждом шаге. Левый график рисует $f(x)=x^3-x-2$ на отрезке, ось $y=0$ и сам корень — видно, что концы разного знака ($f(1)=-2<0$, $f(2)=4>0$), корень один. Правый — `semilogy` той же ошибки: на лог-оси линейный наклон = геометрическая (линейная) сходимость деления, а вогнутые вниз кривые секущих и Ньютона = сверхлинейная. Наклоны прямо показывают порядки: деление $p=1$ (≈48 шагов, по биту за шаг), секущие $p\\approx1{,}618$ (10 шагов), Ньютон $p=2$ (6 шагов) — Ньютон обгоняет, «падая» круче всех. **В проде.** Это и есть рабочий выбор метода: `print` подтверждает теорию числами — для Ньютона $\\varepsilon_{k+1}/\\varepsilon_k^2\\to C\\approx0{,}77=|f''/2f'|$ (квадратичность, формула 1.47), для секущих эмпирический $p=\\ln(\\varepsilon_{k+1}/\\varepsilon_k)/\\ln(\\varepsilon_k/\\varepsilon_{k-1})$ выходит на золотое сечение $1{,}618$. На практике берут гибрид: деление пополам надёжно локализует (использует только знак $f$, корень заперт внутри), затем Ньютон/секущие быстро добивают до машинной точности — за это и платят требованием близкого старта и нужной производной у Ньютона."
	},
	tasks: [
		{
			id: "chma-d7-t1",
			difficulty: "base",
			prompt: String.raw`Корень уравнения $f(x)=x^3-x-2=0$ локализован на $[1;2]$ (проверьте знаки концов). Сделайте две итерации метода Ньютона со стартом $x_0=1{,}5$ и оцените, во сколько раз убывает ошибка, сравнив с эталонным корнем $x^\*\approx1{,}521380$.`,
			hint: String.raw`Используйте $x_{k+1}=x_k-\dfrac{f(x_k)}{f'(x_k)}$, где $f'(x)=3x^2-1$. После каждого шага считайте $\varepsilon_k=|x^\*-x_k|$ и смотрите на отношение $\varepsilon_{k+1}/\varepsilon_k^2$.`,
			solution: String.raw`Концы: $f(1)=1-1-2=-2<0$, $f(2)=8-2-2=4>0$, знаки разные — корень локализован. Производная $f'(x)=3x^2-1$.

**Шаг 1.** $f(1{,}5)=3{,}375-1{,}5-2=-0{,}125$; $f'(1{,}5)=3\cdot2{,}25-1=5{,}75$.
$$x_1=1{,}5-\frac{-0{,}125}{5{,}75}=1{,}5+0{,}021739=1{,}521739.$$
Ошибка $\varepsilon_1=|1{,}521380-1{,}521739|\approx3{,}59\cdot10^{-4}$ (было $\varepsilon_0\approx2{,}14\cdot10^{-2}$).

**Шаг 2.** $f(1{,}521739)\approx(1{,}521739)^3-1{,}521739-2$. Считаем $(1{,}521739)^3\approx3{,}523634$, тогда $f\approx3{,}523634-1{,}521739-2=0{,}001895$; $f'(1{,}521739)=3\cdot2{,}315689-1\approx5{,}947066$.
$$x_2=1{,}521739-\frac{0{,}001895}{5{,}947066}=1{,}521739-0{,}000319=1{,}521380.$$
Ошибка $\varepsilon_2\approx10^{-7}$.

**Квадратичность:** $\dfrac{\varepsilon_1}{\varepsilon_0^2}\approx\dfrac{3{,}59\cdot10^{-4}}{(2{,}14\cdot10^{-2})^2}\approx0{,}78$, и $\dfrac{\varepsilon_2}{\varepsilon_1^2}\approx\dfrac{10^{-7}}{(3{,}59\cdot10^{-4})^2}\approx0{,}77$ — отношение стабилизируется около $C\approx0{,}77$, что подтверждает оценку (1.47) $\varepsilon_{k+1}\approx C\varepsilon_k^2$.`,
			answer: String.raw`$x_1\approx1{,}521739$, $x_2\approx1{,}521380$; число верных знаков удваивается, $C=\varepsilon_{k+1}/\varepsilon_k^2\approx0{,}77$.`,
			xp: 12
		},
		{
			id: "chma-d7-t2",
			difficulty: "star",
			prompt: String.raw`Докажите, что порядок сходимости метода секущих равен $p=\dfrac{1+\sqrt5}{2}\approx1{,}618$, отправляясь от асимптотики ошибки $\varepsilon_{k+1}\approx M\,\varepsilon_k\,\varepsilon_{k-1}$.`,
			hint: String.raw`Подставьте степенной анзац $|\varepsilon_{k+1}|\approx K\,|\varepsilon_k|^p$ и выразите $\varepsilon_{k-1}$ через $\varepsilon_k$. Сравните показатели степеней при $|\varepsilon_k|$ — получите уравнение на $p$.`,
			solution: String.raw`**Откуда $\varepsilon_{k+1}\approx M\varepsilon_k\varepsilon_{k-1}$.** Метод секущих интерполирует $f$ по узлам $x_{k-1},x_k$ прямой $Q_1$ и берёт её нуль за $x_{k+1}$. Ошибка линейной интерполяции в точке $x^\*$ через остаточный член равна $f(x^\*)-Q_1(x^\*)=\tfrac12 f''(\xi)(x^\*-x_{k-1})(x^\*-x_k)$. Так как $f(x^\*)=0$ и $x_{k+1}$ — корень $Q_1$, аккуратная выкладка даёт
$$\varepsilon_{k+1}=x^\*-x_{k+1}\approx\frac{f''(\xi)}{2f'(\eta)}\,\varepsilon_k\,\varepsilon_{k-1}=M\,\varepsilon_k\,\varepsilon_{k-1},\qquad M=\left|\frac{f''(x^\*)}{2f'(x^\*)}\right|.$$

**Поиск порядка.** Предположим, что метод имеет порядок $p$: $|\varepsilon_{k+1}|\approx K|\varepsilon_k|^p$ при $k\to\infty$. Тогда и $|\varepsilon_k|\approx K|\varepsilon_{k-1}|^p$, откуда
$$|\varepsilon_{k-1}|\approx\big(K^{-1}|\varepsilon_k|\big)^{1/p}=K^{-1/p}|\varepsilon_k|^{1/p}.$$
Подставим обе асимптотики в $|\varepsilon_{k+1}|\approx M|\varepsilon_k||\varepsilon_{k-1}|$:
$$K|\varepsilon_k|^p\approx M\,|\varepsilon_k|\cdot K^{-1/p}|\varepsilon_k|^{1/p}=M K^{-1/p}\,|\varepsilon_k|^{1+1/p}.$$
Чтобы равенство держалось при всех малых $|\varepsilon_k|$, показатели степеней должны совпасть:
$$p=1+\frac{1}{p}\ \Longleftrightarrow\ p^2-p-1=0.$$
Положительный корень
$$p=\frac{1+\sqrt5}{2}\approx1{,}618.$$
(Заодно из равенства коэффициентов $K=MK^{-1/p}$ находится константа $K=M^{p/(p+1)}=M^{1/p}$.) Итак, секущие сходятся сверхлинейно с порядком «золотого сечения». $\blacksquare$`,
			answer: String.raw`$p^2-p-1=0\Rightarrow p=\dfrac{1+\sqrt5}{2}\approx1{,}618$ — сверхлинейный порядок (между делением $1$ и Ньютоном $2$).`,
			xp: 25
		},
		{
			id: "chma-d7-t3",
			difficulty: "star",
			prompt: String.raw`Запишите явные рабочие формулы одного шага метода Ньютона для системы $f_1=x^2+y^2-4=0$, $f_2=xy-1=0$. Выпишите якобиан, систему на поправку $J\Delta=-\mathbf{f}$ и сделайте один шаг из $\mathbf{x}_0=(2;\,0{,}5)$.`,
			hint: String.raw`Якобиан $J=\begin{pmatrix}\partial f_1/\partial x&\partial f_1/\partial y\\\partial f_2/\partial x&\partial f_2/\partial y\end{pmatrix}$. Решайте $J\Delta=-\mathbf{f}$ напрямую (2×2), не обращая матрицу явно.`,
			solution: String.raw`**Якобиан.** $\dfrac{\partial f_1}{\partial x}=2x,\ \dfrac{\partial f_1}{\partial y}=2y,\ \dfrac{\partial f_2}{\partial x}=y,\ \dfrac{\partial f_2}{\partial y}=x$:
$$J(x,y)=\begin{pmatrix}2x&2y\\ y&x\end{pmatrix},\qquad \det J=2x^2-2y^2.$$

**В точке $\mathbf{x}_0=(2;\,0{,}5)$:** $f_1=4+0{,}25-4=0{,}25$, $f_2=2\cdot0{,}5-1=0$, значит $\mathbf{f}_0=(0{,}25;\,0)^{\!\top}$.
$$J_0=\begin{pmatrix}4&1\\ 0{,}5&2\end{pmatrix},\qquad \det J_0=4\cdot2-1\cdot0{,}5=7{,}5.$$

**Система на поправку** $J_0\Delta=-\mathbf{f}_0$, $\Delta=(\Delta x,\Delta y)^{\!\top}$:
$$\begin{cases}4\,\Delta x+1\,\Delta y=-0{,}25,\\ 0{,}5\,\Delta x+2\,\Delta y=0.\end{cases}$$
Из второго $\Delta x=-4\Delta y$. Подставляя в первое: $4(-4\Delta y)+\Delta y=-0{,}25\Rightarrow-15\Delta y=-0{,}25\Rightarrow\Delta y=0{,}016667$, тогда $\Delta x=-0{,}066667$.

**Новая точка:**
$$\mathbf{x}_1=\mathbf{x}_0+\Delta=(2-0{,}066667;\ 0{,}5+0{,}016667)=(1{,}933333;\ 0{,}516667).$$
Проверка невязки: $f_1(\mathbf{x}_1)=1{,}933333^2+0{,}516667^2-4\approx3{,}73778+0{,}26694-4=0{,}00472$; $f_2=1{,}933333\cdot0{,}516667-1\approx-0{,}00111$, то есть $\|\mathbf{f}_1\|$ упала с $0{,}25$ до $\sim5\cdot10^{-3}$. Следующий шаг даст $\sim10^{-6}$ — квадратичная сходимость к $\mathbf{x}^\*\approx(1{,}931852;\,0{,}517638)$.`,
			answer: String.raw`$J=\begin{pmatrix}2x&2y\\y&x\end{pmatrix}$; шаг $J_0\Delta=-\mathbf{f}_0$ даёт $\mathbf{x}_1\approx(1{,}93333;\,0{,}51667)$, невязка $0{,}25\to5\cdot10^{-3}$.`,
			xp: 25
		}
	],
	mastery: ["Умею отделить корень (знаки концов, монотонность) и выбрать критерий остановки $b-a\\le\\bar\\varepsilon$; объясняю, почему деление пополам всегда сходится, но лишь линейно.", "Вывожу формулу Ньютона $x_{k+1}=x_k-f(x_k)/f'(x_k)$ из ряда Тейлора и доказываю квадратичную оценку $|\\varepsilon_{k+1}|\\approx C\\varepsilon_k^2$ с $C=|f''/2f'|$; понимаю условия (1.48)–(1.49) и роль теоремы Канторовича.", "Объясняю, откуда у секущих порядок $p=\\tfrac{1+\\sqrt5}{2}\\approx1{,}618$, и сравниваю деление/секущие/Ньютон по скорости и стоимости шага (нужна ли производная).", "Записываю шаг Ньютона для системы через якобиан $\\mathbf{x}_{k+1}=\\mathbf{x}_k-[J]^{-1}\\mathbf{f}$, решаю его как СЛАУ $J\\Delta=-\\mathbf{f}$ без обращения матрицы и называю условия сходимости ($\\det J\\ne0$, гладкость, близкий старт)."]
};
