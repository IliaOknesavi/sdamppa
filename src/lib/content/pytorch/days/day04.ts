import type { Day } from '$lib/types';

// День 4 — Autograd. Конвенции (как в day01):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.
//  • Термины [[id]] / [[id|подпись]] — из базового глоссария или day04.terms.ts.

export const day04: Day = {
	n: 4,
	phaseId: 'autograd',
	title: 'Autograd: requires_grad и backward',
	chapterRef: 'pt-04',
	est: '1–2 ч',
	goal: String.raw`Запустить автодифференцирование руками: пометить тензор [[requires-grad|requires_grad=True]], вызвать [[backward|.backward()]], прочитать $\partial L/\partial w$ из **.grad** и понять, зачем перед каждым шагом нужен [[zero-grad|zero_grad()]] и как отключить [[vychislitelnyy-graf|граф]] на инференсе.`,
	sections: [
		{
			kind: 'intuition',
			heading: 'Зачем вообще автоматический градиент',
			body: String.raw`Обучение сети — это [[gradient-spusk|спуск]] по [[gradient|градиенту]] потери. Значит, нужно уметь считать $\partial L/\partial w$ для каждого веса. Руками это нереально: в сети миллионы параметров, и формула производной у каждого своя.

Базовый способ посчитать производную *без* всякой магии — [[chislennaya-proizvodnaya|конечная разность]]: чуть-чуть сдвинуть аргумент и посмотреть, как изменился выход. Для $f(x)=x^2$ известно, что $f'(x)=2x$; проверим это численно на numpy — заодно поймём, что именно [[autograd|autograd]] потом сделает за нас, только точно и для любого графа операций.`,
			code: {
				title: 'Производная конечными разностями для f(x)=x² (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

def f(x):
    return x ** 2

x = 3.0
h = 1e-5

# центральная разность: (f(x+h) - f(x-h)) / (2h)
num_grad = (f(x + h) - f(x - h)) / (2 * h)
analytic = 2 * x          # f'(x) = 2x

print("численный градиент :", round(num_grad, 6))
print("аналитический 2x   :", analytic)
print("разница            :", abs(num_grad - analytic))`,
				explanation: String.raw`Численный градиент совпал с $2x=6$ до пятого знака. Так производную *можно* считать, но это дорого (две прогонки на каждый вес) и неточно. [[autograd|Autograd]] вместо этого аналитически применяет правило цепочки по всему [[vychislitelnyy-graf|графу]] — один обратный проход на все параметры сразу.`
			}
		},
		{
			kind: 'definition',
			heading: 'requires_grad и define-by-run граф',
			body: String.raw`Чтобы PyTorch следил за тензором, его помечают флагом [[requires-grad|requires_grad=True]]. После этого *каждая* операция с ним записывается в [[vychislitelnyy-graf|вычислительный граф]]: PyTorch строит его **на лету** (define-by-run) — граф появляется прямо во время прямого прохода, обычным питоновским кодом, и пересобирается на каждой итерации.

У каждого нелистового тензора в графе появляется атрибут [[grad-fn|grad_fn]] — ссылка на операцию, которая его породила (**PowBackward**, **AddBackward**, …). Это и есть «рёбра» графа, по которым потом потечёт градиент назад. У исходного тензора, который ты создал сам, [[grad-fn|grad_fn]] нет — это [[leaf-tensor|лист]] графа.`,
			code: {
				title: 'Тензор с requires_grad и его grad_fn (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch

x = torch.tensor(2.0, requires_grad=True)   # лист графа
y = x ** 2                                   # операция записана в граф
z = y + 3

print("x.requires_grad:", x.requires_grad)   # True
print("x.grad_fn       :", x.grad_fn)         # None — это лист
print("y.grad_fn       :", y.grad_fn)         # <PowBackward0>
print("z.grad_fn       :", z.grad_fn)         # <AddBackward0>
print("y.is_leaf       :", y.is_leaf)         # False`,
				explanation: String.raw`Заметь: **x** — [[leaf-tensor|лист]] (его **grad_fn** = None), а у **y** и **z** появился [[grad-fn|grad_fn]] — узел графа. Никакого спецсинтаксиса: ты пишешь обычные **x ** 2** и **+**, а граф собирается сам по ходу вычислений.`
			}
		},
		{
			kind: 'theorem',
			heading: 'backward(): обратный проход и чтение .grad',
			body: String.raw`Когда из тензоров с [[requires-grad|requires_grad]] получена скалярная потеря **L**, вызов [[backward|L.backward()]] запускает [[backprop|обратное распространение]]: PyTorch идёт по [[vychislitelnyy-graf|графу]] от **L** назад, применяет правило цепочки и кладёт $\partial L/\partial w$ в **w.grad** каждого [[leaf-tensor|листа]] с **requires_grad**.

Проверим на учебном примере. Пусть $w=2$, $L=w^2$. Аналитически $\dfrac{\partial L}{\partial w}=2w=4$. После **L.backward()** в **w.grad** должно лежать ровно $4$.

$$L = w^2 \quad\Rightarrow\quad \frac{\partial L}{\partial w} = 2w = 4 \ \text{при } w=2.$$

Важно: [[backward|.backward()]] вызывают **только от скаляра**. Если потеря — вектор, нужно либо свести её к числу (**.sum()** / **.mean()**), либо передать вектор весов в **backward(gradient=...)**.`,
			code: {
				title: 'backward() и param.grad: совпадает с 2w (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch

w = torch.tensor(2.0, requires_grad=True)
L = w ** 2                  # L(w) = w^2

L.backward()                # обратный проход по графу
print("w.grad:", w.grad)    # 4.0  == 2*w

# пример посложнее: L = 3*w^2 + 2*w  ->  dL/dw = 6*w + 2
w.grad = None               # сбросить перед новым backward
L2 = 3 * w ** 2 + 2 * w
L2.backward()
print("w.grad:", w.grad)    # 14.0 == 6*2 + 2`,
				explanation: String.raw`**w.grad** — это и есть $\partial L/\partial w$, посчитанный [[autograd|autograd]] за один обратный проход. Тебе не пришлось выводить производную: ты описал только *прямой* проход **L = w ** 2**, а градиент нашёлся сам по [[vychislitelnyy-graf|графу]].`
			}
		},
		{
			kind: 'note',
			heading: 'Градиенты накапливаются — нужен zero_grad',
			body: String.raw`Ключевая ловушка новичка: [[backward|.backward()]] не *записывает* градиент в **.grad**, а **прибавляет** к тому, что там уже лежит. Это [[nakoplenie-gradientov|накопление градиентов]]. Сделал два **backward** подряд без сброса — и в **.grad** окажется сумма двух градиентов, а шаг обучения поедет в неверную сторону.

Поэтому в начале каждой итерации обнуляют градиенты: **optimizer.zero_grad()** (или **w.grad = None** вручную). Канонический порядок шага: **zero_grad → forward → loss → backward → step**. Само по себе накопление иногда полезно (эмуляция большого [[batch|батча]] на слабой GPU), но это осознанный приём, а не поведение по умолчанию для обычного цикла.`,
			code: {
				title: 'Накопление градиентов и эффект zero_grad (numpy-модель)',
				language: 'python',
				code: String.raw`import numpy as np

# имитируем .grad как буфер, в который backward ПРИБАВЛЯЕТ
grad = np.zeros(1)

def backward(w):
    # для L = w^2 градиент равен 2w; backward += в буфер
    grad[:] = grad + 2 * w

w = np.array([2.0])

backward(w); print("после 1-го backward:", grad[0])  # 4.0
backward(w); print("без zero_grad     :", grad[0])    # 8.0 — сложилось!

grad[:] = 0.0                                          # zero_grad()
backward(w); print("после zero_grad    :", grad[0])   # снова 4.0`,
				explanation: String.raw`Видно [[nakoplenie-gradientov|накопление]]: без обнуления второй **backward** даёт $8$ вместо $4$. В реальном PyTorch роль строки **grad[:] = 0** играет [[zero-grad|optimizer.zero_grad()]] — без неё градиенты соседних батчей сложатся и обучение сломается.`
			}
		},
		{
			kind: 'connection',
			heading: 'Отключить граф: no_grad и detach',
			body: String.raw`На инференсе (предсказание, валидация) градиенты не нужны, а строить [[vychislitelnyy-graf|граф]] — значит зря тратить память и время. Есть два способа отключить слежение:

- [[no-grad|with torch.no_grad():]] — блок, внутри которого граф **не строится вообще**. Оборачивают весь код предсказания/валидации.
- [[detach-tensor|.detach()]] — возвращает тензор с теми же числами, но **вырванный** из графа (без истории, **requires_grad=False**). Удобно, когда нужно использовать промежуточное значение как «константу»: метрики, логирование, заморозка части сети.

Правило простое: всё, что не должно влиять на градиенты, отделяй через **no_grad** или **detach** — иначе либо удержишь граф в памяти, либо нечаянно пропустишь градиент туда, куда не нужно.`,
			code: {
				title: 'no_grad и detach отключают граф (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch

x = torch.tensor(2.0, requires_grad=True)

# 1) no_grad: внутри блока граф не строится
with torch.no_grad():
    y = x ** 2
    print("в no_grad, y.requires_grad:", y.requires_grad)  # False

# 2) detach: вырвать тензор из графа
y = x ** 2
y_const = y.detach()
print("y.requires_grad       :", y.requires_grad)          # True
print("y_const.requires_grad :", y_const.requires_grad)    # False

# типичный инференс
model_eval = lambda t: t ** 2
with torch.no_grad():
    pred = model_eval(x)        # быстрее, без графа`,
				explanation: String.raw`[[no-grad|no_grad]] выключает построение графа для всего блока — это стандарт для валидации и предсказания. [[detach-tensor|.detach()]] точечно отрезает один тензор от истории. Оба не *копируют* данные ради этого — просто перестают писать [[grad-fn|grad_fn]].`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d4-t1',
			difficulty: 'base',
			prompt: String.raw`Пусть $w=3$ и потеря $L = w^2 + 2w$. Посчитай $\dfrac{\partial L}{\partial w}$ вручную, а затем напиши, что выведет **w.grad** после кода: **w = torch.tensor(3.0, requires_grad=True); L = w**2 + 2*w; L.backward()**.`,
			hint: String.raw`Производная суммы — сумма производных: $(w^2)' = 2w$, $(2w)' = 2$. Подставь $w=3$. [[autograd|Autograd]] посчитает ровно это же.`,
			solution: String.raw`$\dfrac{\partial L}{\partial w} = 2w + 2$. При $w=3$ это $2\cdot 3 + 2 = 8$. После [[backward|L.backward()]] в **w.grad** окажется ровно $8.0$ — autograd применил то же правило цепочки автоматически.`,
			answer: String.raw`$\partial L/\partial w = 2w+2 = 8$; **w.grad** $= 8.0$.`,
			xp: 12
		},
		{
			id: 'pt-d4-t2',
			difficulty: 'base',
			prompt: String.raw`В цикле обучения студент забыл вызвать [[zero-grad|optimizer.zero_grad()]] перед [[backward|backward()]]. На первой итерации градиент веса равен $4$, на второй (для тех же данных) аналитически тоже $4$. Что лежит в **w.grad** после второй итерации и почему? Как это сломает обучение?`,
			hint: String.raw`[[backward|.backward()]] не перезаписывает **.grad**, а прибавляет к нему. Что станет с буфером без обнуления?`,
			solution: String.raw`Из-за [[nakoplenie-gradientov|накопления]] второй [[backward|backward()]] **прибавит** свой градиент к оставшемуся от первого: в **w.grad** будет $4 + 4 = 8$, а не $4$. [[optimizer|Оптимизатор]] сделает вдвое больший шаг, и с каждой итерацией ошибка будет расти — обучение разойдётся или будет нестабильным. Лечится вызовом **optimizer.zero_grad()** (или **w.grad = None**) в начале каждой итерации.`,
			answer: String.raw`**w.grad** $=8$ (градиенты сложились); шаг вдвое больше → обучение ломается. Нужен **zero_grad()**.`,
			xp: 12
		},
		{
			id: 'pt-d4-t3',
			difficulty: 'star',
			prompt: String.raw`Что делает [[detach-tensor|.detach()]] и чем отличается от [[no-grad|torch.no_grad()]]? Рассмотри код: **a = torch.tensor(2.0, requires_grad=True); b = a**2; c = b.detach() * a**. Будет ли при **c.backward()** посчитан градиент по **a**, и какой? (Подсказка: **b.detach()** даёт значение $4$, отрезанное от графа.)`,
			hint: String.raw`**detach** делает из тензора константу: его ветка в графе обрывается, градиент через неё не течёт. В выражении **c = b.detach() * a** множитель **b.detach()** — это просто число $4$.`,
			solution: String.raw`[[detach-tensor|.detach()]] возвращает тензор с теми же числами, но **вырванный** из [[vychislitelnyy-graf|графа]] (без истории, **requires_grad=False**) — точечно, для одного тензора. [[no-grad|torch.no_grad()]] же отключает построение графа для **всего блока** кода. В примере **b.detach()** = $4$ — константа, поэтому $c = 4 \cdot a$, и при **c.backward()** градиент посчитается: $\dfrac{\partial c}{\partial a} = 4$, то есть **a.grad** $= 4.0$. Если бы вместо **b.detach()** стояло само **b**, то $c = a^2 \cdot a = a^3$ и градиент был бы $3a^2 = 12$ — detach обрезал ветку через **b** и изменил результат.`,
			answer: String.raw`detach отрезает один тензор от графа (no_grad — весь блок). Здесь $c=4a$, **a.grad** $=4.0$.`,
			xp: 25
		}
	],
	mastery: [
		'Помечаю тензор requires_grad=True и понимаю, что граф строится на лету (define-by-run)',
		'Вызываю loss.backward() от скаляра и читаю ∂L/∂w из param.grad',
		'Объясняю, почему градиенты накапливаются и зачем нужен zero_grad перед каждым шагом',
		'Отключаю граф на инференсе через torch.no_grad() и понимаю смысл .detach()'
	]
};
