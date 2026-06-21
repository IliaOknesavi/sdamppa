import type { Day } from '$lib/types';

export const day06: Day = {
	n: 6,
	phaseId: "approx",
	title: "Наилучшее приближение, сплайны и метод наименьших квадратов",
	chapterRef: "ч1·т1.7–1.8",
	est: '–2 ч'.replace('–','1–'),
	kind: 'theory',
	goal: String.raw`Научиться ставить и решать задачу [[nailuchshee-pribl|наилучшего приближения]] в нормированном пространстве: в евклидовом случае — через ортогональную проекцию $f-g^*\perp L$ и систему Грама, для гладкой функции на сетке — через [[splajn|кубический сплайн]] дефекта 1 (трёхдиагональная СЛАУ на моменты $\sigma_k$), а для зашумлённых данных — через [[mnk|метод наименьших квадратов]] с нормальными уравнениями $G^{\mathsf T}G\,c=G^{\mathsf T}f$.`,
	sections: [
		{
			kind: "definition",
			heading: "Задача наилучшего приближения и её евклидова форма",
			body: String.raw`Пусть $f$ — объект приближения, а $g$ — приближение; оба суть векторы нормированного линейного пространства. **[[nailuchshee-pribl|Наилучшее приближение]]** — это вектор $g^*$, минимизирующий расстояние
$$g:\ \rho=\lVert f-g\rVert\to\min_{g}.$$
Приближение ищем в виде линейной комбинации фиксированного набора *линейно независимых* базисных функций $\varphi_0,\dots,\varphi_m$:
$$g=a_0\varphi_0+a_1\varphi_1+\dots+a_m\varphi_m=\sum_{j=0}^{m}a_j\varphi_j,$$
то есть $g$ пробегает линейную оболочку $L=\operatorname{span}\{\varphi_0,\dots,\varphi_m\}$, а минимизация идёт по коэффициентам $a=(a_0,\dots,a_m)$.

## Гильбертов (евклидов) случай
Если $f,g\in H$ — гильбертово пространство со скалярным произведением $\langle\cdot,\cdot\rangle$, норму берём порождённой им, $\lVert u\rVert_2=\sqrt{\langle u,u\rangle}$, и минимизируем
$$\rho^2=\lVert f-g\rVert_2^2=\Big\langle f-\sum_{j}a_j\varphi_j,\ f-\sum_{j}a_j\varphi_j\Big\rangle\to\min_{a}.$$
Два рабочих скалярных произведения: для **непрерывного** $f=f(x)$ на $[a;b]$ с весом $p(x)$
$$\langle y_1,y_2\rangle=\int_a^b p(x)\,y_1(x)\,y_2(x)\,dx,$$
для **дискретного** $f\in\mathbb R^n$ с вектором весов $w$
$$\langle y_1,y_2\rangle=\sum_{i=1}^{n}w_i\,y_{1,i}\,y_{2,i}.$$
В общем нормированном (не евклидовом) пространстве минимум существует, но может быть *не единственным*; именно евклидова структура даёт единственность и явные уравнения на $a$.`
		},
		{
			kind: "theorem",
			heading: "Характеризация решения и система Грама",
			body: String.raw`**Теорема (ортогональность невязки).** В гильбертовом пространстве вектор $g^*\in L=\operatorname{span}\{\varphi_j\}$ доставляет минимум $\lVert f-g\rVert_2$ тогда и только тогда, когда невязка ортогональна всему подпространству:
$$f-g^*\perp L\iff \langle\varphi_j,\,f-g^*\rangle=0,\quad j=0,\dots,m.$$
Это эквивалентно **системе нормальных уравнений** относительно коэффициентов $a$:
$$\sum_{i=0}^{m}\langle\varphi_j,\varphi_i\rangle\,a_i=\langle\varphi_j,f\rangle,\quad j=0,\dots,m,$$
или в матричной форме (матрица Грама):
$$\begin{pmatrix}\langle\varphi_0,\varphi_0\rangle&\cdots&\langle\varphi_0,\varphi_m\rangle\\ \vdots&\ddots&\vdots\\ \langle\varphi_m,\varphi_0\rangle&\cdots&\langle\varphi_m,\varphi_m\rangle\end{pmatrix}\begin{pmatrix}a_0\\\vdots\\a_m\end{pmatrix}=\begin{pmatrix}\langle\varphi_0,f\rangle\\\vdots\\\langle\varphi_m,f\rangle\end{pmatrix}.$$
**Следствия.** (1) При линейно независимых $\varphi_j$ матрица Грама симметрична и положительно определена, значит решение существует и единственно. (2) Если базис **ортогонален** ($\langle\varphi_i,\varphi_j\rangle=0$ при $i\ne j$), матрица диагональна и коэффициенты считаются независимо:
$$a_j=\delta_j\int_a^b p\,\varphi_j f\,dx,\quad \delta_j=\Big(\int_a^b p\,\varphi_j^2\,dx\Big)^{-1}.$$
Именно поэтому удобны [[polinom-chebysheva|полиномы Чебышёва]] (вес $p=1/\sqrt{1-t^2}$, минимизируют $\lVert\cdot\rVert_{C[a;b]}$) и полиномы Лежандра ($p\equiv1$, минимизируют $\lVert\cdot\rVert_2$): они дают диагональную систему вместо плотной.`
		},
		{
			kind: "derivation",
			heading: "Полный вывод нормальных уравнений $f-g^*\\perp L$",
			body: String.raw`Минимизируем гладкую (квадратичную по $a$) функцию $\rho^2(a)$. Раскроем квадрат нормы по билинейности скалярного произведения:
$$\rho^2=\Big\langle f-\sum_{i}a_i\varphi_i,\ f-\sum_{i}a_i\varphi_i\Big\rangle=\langle f,f\rangle-2\sum_{i}a_i\langle\varphi_i,f\rangle+\sum_{i}\sum_{l}a_i a_l\langle\varphi_i,\varphi_l\rangle.$$
Это выпуклая квадратичная форма (матрица Грама неотрицательна), поэтому минимум достигается в стационарной точке. Берём частную производную по $a_j$. Первое слагаемое не зависит от $a_j$. Во втором $\partial_{a_j}\big(-2\sum_i a_i\langle\varphi_i,f\rangle\big)=-2\langle\varphi_j,f\rangle$. В третьем дифференцируем двойную сумму: вклад дают члены с $i=j$ и с $l=j$, и в силу симметрии $\langle\varphi_i,\varphi_l\rangle=\langle\varphi_l,\varphi_i\rangle$ получаем
$$\frac{\partial}{\partial a_j}\sum_{i,l}a_i a_l\langle\varphi_i,\varphi_l\rangle=2\sum_{l}a_l\langle\varphi_j,\varphi_l\rangle.$$
Компактно это записывается прямо через невязку: дифференцируя $\rho^2=\langle f-\sum a_i\varphi_i,\,f-\sum a_i\varphi_i\rangle$ как функцию $a_j$ и пользуясь $\partial_{a_j}\big(f-\sum a_i\varphi_i\big)=-\varphi_j$, имеем
$$\frac{\partial}{\partial a_j}\rho^2=2\Big\langle -\varphi_j,\ f-\sum_{i}a_i\varphi_i\Big\rangle=-2\Big\langle\varphi_j,\ f-\sum_{i}a_i\varphi_i\Big\rangle.$$
Приравняв к нулю:
$$\frac{\partial}{\partial a_j}\rho^2=2\Big\langle\varphi_j,\ f-\sum_{i=0}^{m}a_i\varphi_i\Big\rangle=0\ \Longrightarrow\ \Big\langle\varphi_j,\ f-\sum_{i}a_i\varphi_i\Big\rangle=0,\quad j=0,\dots,m.$$
Это и есть геометрическое условие $f-g^*\perp\varphi_j$ для всех $j$, то есть $f-g^*\perp L$. Перенося, получаем линейную систему
$$\Big\langle\varphi_j,\sum_{i=0}^{m}a_i\varphi_i\Big\rangle=\langle\varphi_j,f\rangle\ \Longrightarrow\ \sum_{i=0}^{m}\langle\varphi_j,\varphi_i\rangle\,a_i=\langle\varphi_j,f\rangle.$$

## Матричная форма для дискретного случая
Введём матрицу плана $G$ со столбцами $\varphi_0,\dots,\varphi_m$ (значения базиса в узлах), диагональную матрицу весов $W=\operatorname{diag}(w)$ и вектор данных $f$. Тогда $\langle\varphi_j,\varphi_i\rangle=(G^{\mathsf T}WG)_{ji}$ и $\langle\varphi_j,f\rangle=(G^{\mathsf T}Wf)_j$, и система принимает вид
$$\big(W^{1/2}G\big)^{\mathsf T}\big(W^{1/2}G\big)\,a=W G^{\mathsf T}f\ \Longrightarrow\ G^{\mathsf T}WG\,a=G^{\mathsf T}Wf,$$
откуда точное решение взвешенного МНК (WLSM)
$$a=\big(G^{\mathsf T}WG\big)^{-1}G^{\mathsf T}Wf.$$
При $w\equiv1$ ($W=I$) получаем классический [[mnk|МНК]] (LSM): $G^{\mathsf T}G\,a=G^{\mathsf T}f$, $\ a=(G^{\mathsf T}G)^{-1}G^{\mathsf T}f$.\qquad$\blacksquare$`
		},
		{
			kind: "derivation",
			heading: "Кубический сплайн дефекта 1: СЛАУ на моменты и оценка ошибки",
			body: String.raw`## Постановка
На $[a;b]$ задана сетка $a=x_1<\dots<x_{N+1}=b$ ($N$ отрезков, $N+1$ узлов), значения $f_k=f(x_k)$. Ищем **[[splajn|сплайн]]** $S$: на каждом отрезке $[x_k;x_{k+1}]$ — кубический многочлен $S_k$, и $S$ интерполирует ($S(x_k)=f_k$, $N+1$ условие) и непрерывен вместе с $S',S''$ во внутренних узлах ($3(N-1)$ условий). Кубики дают $4N$ неизвестных; условия дают $4N-2$, остаются 2 степени свободы — их закрывают граничные условия. *Дефект 1* означает: гладкость $C^{m-1}=C^2$ на единицу ниже степени $m=3$.

## Параметризация моментами
Пусть $h_k=x_{k+1}-x_k$, $w_k=\dfrac{x-x_k}{h_k}$, $\bar w_k=1-w_k=\dfrac{x_{k+1}-x}{h_k}$, а $\sigma_k\in\mathbb R$ — неизвестные (с точностью до множителя $S''$ в узлах). На $[x_k;x_{k+1}]$ положим
$$S_k=w_k f_{k+1}+\bar w_k f_k+h_k^2\big[(w_k^3-w_k)\sigma_{k+1}+(\bar w_k^3-\bar w_k)\sigma_k\big].$$
Эта форма автоматически даёт $S_k(x_k)=f_k$, $S_k(x_{k+1})=f_{k+1}$ (интерполяция и непрерывность $S$). Продифференцируем дважды по $x$ (учитывая $w_k'=1/h_k$, $\bar w_k'=-1/h_k$):
$$S_k''=h_k^2\Big[6w_k\tfrac{1}{h_k^2}\sigma_{k+1}+6\bar w_k\tfrac{1}{h_k^2}\sigma_k\Big]=6w_k\sigma_{k+1}+6\bar w_k\sigma_k.$$
В узлах $S_k''(x_k)=6\sigma_k$, $S_k''(x_{k+1})=6\sigma_{k+1}$ — непрерывность $S''$ выполнена тождественно. Остаётся непрерывность $S'$. Дифференцируя один раз,
$$S_k'(x_{k+1})=\frac{f_{k+1}-f_k}{h_k}+\sigma_k(1-0)h_k+\sigma_{k+1}\cdot 2h_k,$$
а слева в узле $x_{k+1}$ из следующего отрезка
$$S_{k+1}'(x_{k+1})=\frac{f_{k+2}-f_{k+1}}{h_{k+1}}-\sigma_{k+1}\cdot 2h_{k+1}-\sigma_{k+2}h_{k+1}.$$

## СЛАУ
Приравнивая $S_k'(x_{k+1})=S_{k+1}'(x_{k+1})$ и собирая $\sigma$, получаем для $k=1,\dots,N-1$ **трёхдиагональную систему**
$$h_k\,\sigma_k+2(h_k+h_{k+1})\,\sigma_{k+1}+h_{k+1}\,\sigma_{k+2}=\frac{f_{k+2}-f_{k+1}}{h_{k+1}}-\frac{f_{k+1}-f_k}{h_k}.$$
Это $N-1$ уравнений на $N+1$ моментов; две недостающие строки — граничные условия. **Естественный сплайн**: $S''(x_1)=S''(x_{N+1})=0$, то есть $\sigma_1=\sigma_{N+1}=0$ (первая и последняя строки $\mathbf 1$ и правые части $0$). Матрица диагонально доминантна ($2(h_k+h_{k+1})>h_k+h_{k+1}$), поэтому система невырождена и решается прогонкой за $O(N)$.

## Оценка ошибки
Остаточный член на $[x_k;x_{k+1}]$ имеет вид (как у интерполяции степени 3)
$$R_3(x)=\frac{f^{(4)}(\eta)}{4!}(x-x_k)(x-x_{k+1})(x-x_{k+2})(x-x_{k+3}),$$
откуда для достаточно гладкой $f$ на всём отрезке
$$\bar\varepsilon\le C_{(4)}\,h_{\max}^4,\qquad C_{(4)}=\text{const}\sim\max|f^{(4)}|.$$
Для естественного сплайна вблизи концов точность падает до $\bar\varepsilon\le C_{(4)}h_{\max}^3$ (граничное условие $S''=0$ не согласовано с $f''$). На внутренней части порядок остаётся $O(h^4)$.\qquad$\blacksquare$`
		},
		{
			kind: "intuition",
			heading: "Почему ортогональность и почему $\\sigma_k$ удобны",
			body: String.raw`## Геометрия проекции
$f-g^*\perp L$ — это в точности теорема Пифагора в действии. Любое $g\in L$ записываем как $g=g^*+u$, $u\in L$. Тогда
$$\lVert f-g\rVert_2^2=\lVert(f-g^*)-u\rVert_2^2=\lVert f-g^*\rVert_2^2-2\langle f-g^*,u\rangle+\lVert u\rVert_2^2.$$
Если невязка ортогональна $L$, средний член зануляется и $\lVert f-g\rVert_2^2=\lVert f-g^*\rVert_2^2+\lVert u\rVert_2^2\ge\lVert f-g^*\rVert_2^2$ — любое отклонение $u\ne0$ только увеличивает ошибку. Минимум — это «опустить перпендикуляр» из $f$ на плоскость $L$. Вся алгебра нормальных уравнений — лишь способ найти основание этого перпендикуляра.

## Моменты вместо коэффициентов
Если искать сплайн «в лоб» через $a_k,b_k,c_k,d_k$ — это $4N$ связанных неизвестных и громоздкая система. Хитрость параметризации через $\sigma_k=\tfrac16 S''(x_k)$ в том, что выбранная форма $S_k$ *уже* удовлетворяет интерполяции и непрерывности $S,S''$ — эти условия «зашиты» в формулу. Остаётся ровно одно нетривиальное требование (непрерывность $S'$), и оно даёт компактную трёхдиагональную систему на $N-1$ величин. Физически $\sigma_k$ — кривизна сплайна (момент изгиба упругой линейки) в узле: естественный сплайн ($\sigma=0$ на концах) — это линейка, свободно лежащая без момента на концах, она минимизирует $\int (S'')^2\,dx$ — интегральную «энергию изгиба».`
		},
		{
			kind: "connection",
			heading: "Связи: интерполяция, обусловленность, конструирование признаков",
			body: String.raw`**Сплайн против глобального полинома.** [[splajn|Кубический сплайн]] — лекарство от [[fenomen-runge|феномена Рунге]]: глобальный [[interpolyaciya|интерполяционный]] [[polinom-lagranzha|полином Лагранжа]] высокой степени осциллирует у краёв, а кусочно-кубический сплайн локален и даёт устойчивые $O(h^4)$. Трёхдиагональная СЛАУ решается прогонкой ([[metod-gaussa-zejdelya|без]] обращения матрицы).

**МНК и обусловленность.** Прямое решение $a=(G^{\mathsf T}G)^{-1}G^{\mathsf T}f$ через обращение опасно: для полиномиального базиса $\{1,x,\dots,x^m\}$ матрица $G^{\mathsf T}G$ — почти Вандермондова, и [[chislo-obuslovlennosti|число обусловленности]] растёт катастрофически (при $m=18$ оно $\sim10^{18}$, ответ полностью съедают ошибки округления). Лекарство: ортогональный базис ([[polinom-chebysheva|Чебышёв]]/Лежандр — диагональная Грама), либо решение через [[svd|SVD]] / QR без явного $G^{\mathsf T}G$, либо численная минимизация $\lVert f-g\rVert$ напрямую.

**Конструирование признаков (feature engineering).** Структура решения не меняется, если дополнить $G$ столбцами $\psi_l(\varphi_0,\dots,\varphi_m)$ — любыми линейно независимыми функциями исходных. Это и есть приближение «по многим признакам» в анализе данных и ML: регрессия $g=\sum a_j\varphi_j$ — частный случай.

**Веса и выбросы.** WLSM ($w_i=1/|f_i-g_{i|w=1}|$ или $w_i=1/S_i$ по дисперсии повторов) гасит влияние точки-выброса, тогда как обычный LSM ($w\equiv1$) тянется к ней. При $n\le d$ (число признаков) матрица $G^{\mathsf T}WG$ вырождена — «некорректная задача» с бесконечным числом решений, что не мешает иметь практически приемлемое (регуляризация, минимум нормы).`
		}
	],
	code: {
		title: "Кубический сплайн (моменты $\\sigma$) и МНК через нормальные уравнения",
		language: 'python',
		code: String.raw`import numpy as np
import math
import matplotlib.pyplot as plt

# ===== Часть 1. Естественный кубический сплайн дефекта 1 (моменты sigma) =====
def natural_cubic_spline(x, f):
    n = len(x) - 1                 # число отрезков N
    h = np.diff(x)                 # шаги h_k
    A = np.zeros((n + 1, n + 1))   # трёхдиагональная СЛАУ на sigma_0..sigma_N
    b = np.zeros(n + 1)
    A[0, 0] = 1.0                  # граничное условие: sigma_0 = 0
    A[n, n] = 1.0                  # граничное условие: sigma_N = 0
    for k in range(1, n):          # внутренние узлы
        A[k, k - 1] = h[k - 1]
        A[k, k]     = 2.0 * (h[k - 1] + h[k])
        A[k, k + 1] = h[k]
        b[k] = (f[k+1]-f[k])/h[k] - (f[k]-f[k-1])/h[k-1]
    sigma = np.linalg.solve(A, b)  # на практике — прогонка O(N)
    return h, sigma

def eval_spline(xq, x, f, h, sigma):
    out = np.empty_like(xq, dtype=float)
    for i, xx in enumerate(xq):
        k = min(max(np.searchsorted(x, xx) - 1, 0), len(x) - 2)
        w  = (xx - x[k]) / h[k]
        wb = 1.0 - w
        out[i] = (w*f[k+1] + wb*f[k]
                  + h[k]**2 * ((w**3-w)*sigma[k+1] + (wb**3-wb)*sigma[k]))
    return out

# функция-образец из тетрадей (ДЗ-5/6): f(x)=atan(3x/(3+0.4 x^6)) на [-2,1]
def f(x):
    return np.arctan(3*x / (3 + 0.4*x**6))

A, B = -2.0, 1.0
xs = np.array([-2.0, -1.0, 0.0, 1.0])    # узлы, h = 1
ys = f(xs)
h, sigma = natural_cubic_spline(xs, ys)

print('Сплайн: моменты sigma в узлах (естественный, sigma_0=sigma_N=0)')
print('  sigma =', np.array2string(sigma, precision=4))
print("  S''(x) в узлах = 6*sigma =", np.array2string(6*sigma, precision=4))

# проверка порядка сходимости O(h^4) на внутренней части (контрольный пример sin)
print('Сплайн: проверка порядка сходимости O(h^4) на гладкой sin(x)')
errs = []
for N in [4, 8, 16, 32, 64]:
    xg = np.linspace(0, np.pi, N + 1)
    hg, sg = natural_cubic_spline(xg, np.sin(xg))
    xq = np.linspace(0.3, np.pi - 0.3, 400)        # вдали от концов
    err = np.max(np.abs(eval_spline(xq, xg, np.sin(xg), hg, sg) - np.sin(xq)))
    errs.append(err)
errs = np.array(errs)
print('  порядок (log2 отношений, ожидаем ~4):',
      np.array2string(np.log2(errs[:-1]/errs[1:]), precision=2))

# ===== Часть 2. МНК: нормальные уравнения G^T G c = G^T f (парабола) =====
# те же 4 точки данных; приближаем квадратным трёхчленом P(x)=c0+c1 x+c2 x^2
G = np.vstack([np.ones_like(xs), xs, xs**2]).T     # матрица плана
c = np.linalg.solve(G.T @ G, G.T @ ys)             # нормальные уравнения
def P(x):
    return c[0] + c[1]*x + c[2]*x**2

print('\nМНК: P(x)=c0+c1 x+c2 x^2 по нормальным уравнениям G^T G c = G^T y')
print('  коэффициенты [c0, c1, c2] =', np.array2string(c, precision=4))
print('  невязка ортогональна столбцам G:',
      np.allclose(G.T @ (G @ c - ys), 0, atol=1e-10))
print('  max|P(x_k)-y_k| в узлах =', np.array2string(np.max(np.abs(P(xs)-ys)), precision=4))

# ===== График: слева сплайн (ДЗ-5), справа МНК-парабола (ДЗ-6) =====
xx = np.linspace(A, B, 401)
fig, ax = plt.subplots(1, 2, figsize=(8, 4))

ax[0].plot(xx, f(xx), lw=2, label='f(x)')
ax[0].plot(xx, eval_spline(xx, xs, ys, h, sigma), '--', lw=2,
           color='crimson', label='S(x) — сплайн')
ax[0].scatter(xs, ys, color='red', zorder=3, label='узлы')
ax[0].grid(alpha=0.3)
ax[0].legend()
ax[0].set_title('Естественный кубический сплайн (моменты $\\sigma$)')
ax[0].set_xlabel('x'); ax[0].set_ylabel('y')

ax[1].plot(xx, f(xx), lw=2, label='f(x)')
ax[1].plot(xx, P(xx), '--', lw=2, color='green', label='P(x) — МНК-парабола')
ax[1].scatter(xs, ys, color='red', zorder=3, label='точки данных')
ax[1].grid(alpha=0.3)
ax[1].legend()
ax[1].set_title('МНК: нормальные уравнения $G^TG c = G^T f$')
ax[1].set_xlabel('x'); ax[1].set_ylabel('y')

fig.suptitle('Наилучшее приближение: сплайн ловит форму, парабола — лишь наклон')
fig.tight_layout(rect=[0, 0, 1, 0.95])
plt.show()`,
		explanation: "**В коде.** Берём ту же функцию-образец из тетрадей $f(x)=\\arctan\\!\\big(\\tfrac{3x}{3+0.4x^6}\\big)$ на $[-2,1]$ и узлы $x=(-2,-1,0,1)$, $h=1$. **Часть 1** строит [[splajn|естественный кубический сплайн]] через моменты $\\sigma_k$ (а не через $4N$ коэффициентов): собирается трёхдиагональная СЛАУ с граничными условиями $\\sigma_0=\\sigma_N=0$ и формой $S_k=w f_{k+1}+\\bar w f_k+h_k^2[(w^3-w)\\sigma_{k+1}+(\\bar w^3-\\bar w)\\sigma_k]$. Получаем $\\sigma=(0,\\,0.330,\\,-0.083,\\,0)$, то есть $S''$ в узлах $=6\\sigma=(0,\\,1.98,\\,-0.50,\\,0)$. Контрольная прогонка на $\\sin$ даёт порядки **4.08, 4.02, 4.01, 4.00** — эмпирическое подтверждение $O(h_{\\max}^4)$ на внутренней части. **Часть 2** решает [[mnk|МНК]] ровно по нормальным уравнениям $G^{\\mathsf T}G\\,c=G^{\\mathsf T}f$ той же параболой $P(x)=c_0+c_1x+c_2x^2$; коэффициенты $\\approx[-0.186,\\,0.661,\\,0.310]$, а проверка $G^{\\mathsf T}(Gc-y)=0$ подтверждает $f-g^*\\perp L$ (невязка ортогональна образу $G$).\n**В проде.** Левый график: сплайн (пунктир) проходит точно через узлы и повторяет S-образную форму $f$ с перегибом в нуле — устойчивое гладкое приближение без осцилляций Рунге. Правый: парабола ловит лишь общий наклон, но не форму ($f$ нечётна, парабола перегибов не имеет), отсюда отклонение $\\max|P(x_k)-y_k|\\approx0.186$. Это и есть водораздел темы: интерполяционный сплайн против сглаживающего МНК."
	},
	tasks: [
		{
			id: "chma-d6-t1",
			difficulty: "base",
			prompt: String.raw`Дана сетка $x=(0,1,2)$ и значения $f=(0,1,0)$. Постройте естественный кубический сплайн дефекта 1: выпишите трёхдиагональную систему на моменты $\sigma_1,\sigma_2,\sigma_3$, решите её и найдите $S''$ в узле $x_2=1$.`,
			hint: String.raw`Здесь $N=2$ отрезка, $h_1=h_2=1$. Естественный сплайн: $\sigma_1=\sigma_3=0$. Внутреннее уравнение пишется для $k=1$: $h_1\sigma_1+2(h_1+h_2)\sigma_2+h_2\sigma_3=\frac{f_3-f_2}{h_2}-\frac{f_2-f_1}{h_1}$. Помните, что $S''(x_2)=6\sigma_2$.`,
			solution: String.raw`Шаги $h_1=h_2=1$. Граничные условия естественного сплайна дают $\sigma_1=0$, $\sigma_3=0$. Единственное внутреннее уравнение ($k=1$):
$$h_1\sigma_1+2(h_1+h_2)\sigma_2+h_2\sigma_3=\frac{f_3-f_2}{h_2}-\frac{f_2-f_1}{h_1}.$$
Подставляем числа: $f_1=0,f_2=1,f_3=0$, поэтому правая часть
$$\frac{0-1}{1}-\frac{1-0}{1}=-1-1=-2.$$
Левая часть: $1\cdot0+2(1+1)\sigma_2+1\cdot0=4\sigma_2$. Значит $4\sigma_2=-2\Rightarrow\sigma_2=-\tfrac12=-0{,}5$. Полная система в матричном виде:
$$\begin{pmatrix}1&0&0\\1&4&1\\0&0&1\end{pmatrix}\begin{pmatrix}\sigma_1\\\sigma_2\\\sigma_3\end{pmatrix}=\begin{pmatrix}0\\-2\\0\end{pmatrix},\quad\Rightarrow\quad\sigma=(0,\,-0{,}5,\,0).$$
Вторая производная в узле: $S''(x_2)=6\sigma_2=6\cdot(-0{,}5)=-3$. Отрицательная кривизна согласуется с тем, что в точке $(1,1)$ у данных «горб».`,
			answer: String.raw`$\sigma_1=0,\ \sigma_2=-0{,}5,\ \sigma_3=0$; $\ S''(1)=6\sigma_2=-3$.`,
			xp: 12
		},
		{
			id: "chma-d6-t2",
			difficulty: "base",
			prompt: String.raw`По трём точкам $(x_i,y_i)=(-1,1),(0,0),(1,1)$ постройте прямую $g=a_0+a_1x$ методом наименьших квадратов: выпишите матрицу плана $G$, нормальные уравнения $G^{\mathsf T}G\,a=G^{\mathsf T}y$, решите и объясните результат геометрически.`,
			hint: String.raw`Столбцы $G$ — это значения базиса $\varphi_0=1$ и $\varphi_1=x$ в узлах. Посчитайте $\sum x_i$, $\sum x_i^2$, $\sum y_i$, $\sum x_i y_i$ — из них собираются все четыре элемента $G^{\mathsf T}G$ и две компоненты $G^{\mathsf T}y$.`,
			solution: String.raw`Матрица плана и вектор данных:
$$G=\begin{pmatrix}1&-1\\1&0\\1&1\end{pmatrix},\qquad y=\begin{pmatrix}1\\0\\1\end{pmatrix}.$$
Считаем суммы: $n=3$, $\sum x_i=0$, $\sum x_i^2=2$, $\sum y_i=2$, $\sum x_i y_i=(-1)(1)+0+1\cdot1=0$. Тогда
$$G^{\mathsf T}G=\begin{pmatrix}n&\sum x_i\\\sum x_i&\sum x_i^2\end{pmatrix}=\begin{pmatrix}3&0\\0&2\end{pmatrix},\qquad G^{\mathsf T}y=\begin{pmatrix}\sum y_i\\\sum x_i y_i\end{pmatrix}=\begin{pmatrix}2\\0\end{pmatrix}.$$
Система распадается (матрица диагональна, т.к. базис ортогонален на симметричной сетке): $3a_0=2$, $2a_1=0$, откуда
$$a_0=\tfrac23,\qquad a_1=0,\qquad g(x)=\tfrac23.$$
Геометрически: симметричные данные не дают наклона ($a_1=0$), а $a_0=\bar y=\tfrac{1+0+1}{3}=\tfrac23$ — среднее. Невязка $y-g=(\tfrac13,-\tfrac23,\tfrac13)$ ортогональна обоим столбцам $G$: $\langle\mathbf 1,\text{невязка}\rangle=\tfrac13-\tfrac23+\tfrac13=0$ и $\langle x,\text{невязка}\rangle=-\tfrac13+0+\tfrac13=0$, что подтверждает $f-g^*\perp L$.`,
			answer: String.raw`$a_0=\tfrac23,\ a_1=0$, то есть $g(x)\equiv\tfrac23$; невязка $\perp$ столбцам $G$.`,
			xp: 12
		},
		{
			id: "chma-d6-t3",
			difficulty: "star",
			prompt: String.raw`Докажите, что нормальные уравнения $G^{\mathsf T}G\,a=G^{\mathsf T}f$ всегда совместны, а при линейно независимых столбцах $G$ имеют единственное решение, доставляющее минимум $\lVert f-Ga\rVert_2$. Покажите также, что в этом случае матрица $G^{\mathsf T}G$ положительно определена.`,
			hint: String.raw`Совместность: покажите, что $G^{\mathsf T}f$ лежит в образе $G^{\mathsf T}G$, используя $\ker(G^{\mathsf T}G)=\ker G$. Единственность и минимум: разложите $\lVert f-Ga\rVert^2$ вокруг решения $a^*$ нормальных уравнений и используйте ортогональность невязки.`,
			solution: String.raw`## Положительная определённость
Для любого $v\in\mathbb R^{m+1}$: $v^{\mathsf T}(G^{\mathsf T}G)v=(Gv)^{\mathsf T}(Gv)=\lVert Gv\rVert_2^2\ge0$, значит $G^{\mathsf T}G$ неотрицательно определена. Если столбцы $G$ линейно независимы, то $Gv=0\Rightarrow v=0$, поэтому $v^{\mathsf T}(G^{\mathsf T}G)v=\lVert Gv\rVert^2>0$ при $v\ne0$ — матрица положительно определена, а значит обратима. Отсюда единственность решения системы.

## Совместность (даже при зависимых столбцах)
Ключ: $\ker(G^{\mathsf T}G)=\ker G$. Действительно, $Gv=0\Rightarrow G^{\mathsf T}Gv=0$; обратно $G^{\mathsf T}Gv=0\Rightarrow v^{\mathsf T}G^{\mathsf T}Gv=\lVert Gv\rVert^2=0\Rightarrow Gv=0$. Следовательно $\operatorname{im}(G^{\mathsf T}G)=(\ker(G^{\mathsf T}G))^{\perp}=(\ker G)^{\perp}=\operatorname{im}(G^{\mathsf T})$. Но правая часть $G^{\mathsf T}f\in\operatorname{im}(G^{\mathsf T})=\operatorname{im}(G^{\mathsf T}G)$, поэтому система разрешима всегда.

## Минимум
Пусть $a^*$ удовлетворяет $G^{\mathsf T}Ga^*=G^{\mathsf T}f$, то есть $G^{\mathsf T}(f-Ga^*)=0$ — невязка $r=f-Ga^*$ ортогональна всем столбцам $G$, $r\perp\operatorname{im}G$. Для произвольного $a$ положим $a=a^*+u$:
$$\lVert f-Ga\rVert_2^2=\lVert r-Gu\rVert_2^2=\lVert r\rVert_2^2-2\,(Gu)^{\mathsf T}r+\lVert Gu\rVert_2^2.$$
Средний член $(Gu)^{\mathsf T}r=u^{\mathsf T}G^{\mathsf T}r=u^{\mathsf T}\cdot0=0$. Значит
$$\lVert f-Ga\rVert_2^2=\lVert r\rVert_2^2+\lVert Gu\rVert_2^2\ge\lVert f-Ga^*\rVert_2^2,$$
и равенство лишь при $Gu=0$. При линейно независимых столбцах это даёт $u=0$, то есть $a^*$ — единственный минимизатор.\qquad$\blacksquare$`,
			answer: String.raw`$G^{\mathsf T}G\succeq0$ всегда (равно $\lVert Gv\rVert^2$), при независимых столбцах $\succ0$ и обратима; система совместна, т.к. $G^{\mathsf T}f\in\operatorname{im}(G^{\mathsf T}G)$; ортогональность невязки $G^{\mathsf T}r=0$ даёт глобальный минимум.`,
			xp: 25
		}
	],
	mastery: ["Могу вывести нормальные уравнения $G^{\\mathsf T}G\\,c=G^{\\mathsf T}f$ из условия $\\partial_{a_j}\\rho^2=0$ и объяснить их как геометрическое условие ортогональности невязки $f-g^*\\perp L$ (опускание перпендикуляра на подпространство $L$).", "Самостоятельно собираю трёхдиагональную СЛАУ на моменты $\\sigma_k$ кубического сплайна дефекта 1, ставлю граничные условия естественного сплайна $\\sigma_1=\\sigma_{N+1}=0$ и знаю, что внутри ошибка $O(h_{\\max}^4)$, а у концов падает до $O(h_{\\max}^3)$.", "Различаю евклидов (непрерывный/дискретный) и общий нормированный случаи, понимаю роль ортогонального базиса ([[polinom-chebysheva|Чебышёв]]/Лежандр) для диагонализации матрицы Грама и связь плотного полиномиального базиса с ростом [[chislo-obuslovlennosti|числа обусловленности]] $G^{\\mathsf T}G$.", "Понимаю разницу LSM и WLSM ($a=(G^{\\mathsf T}WG)^{-1}G^{\\mathsf T}Wf$): как веса $w_i$ гасят выбросы, и почему при $n\\le d$ задача становится некорректной (вырожденная $G^{\\mathsf T}WG$, неединственность)."]
};
