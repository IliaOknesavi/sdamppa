import type { Day } from '$lib/types';

// День 6. Конвенции (как в эталоне day01.ts):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.

export const day06: Day = {
	n: 6,
	phaseId: 'autograd',
	title: 'Градиентный спуск: линейная регрессия с нуля',
	chapterRef: 'pt-06',
	est: '1–2 ч',
	goal: String.raw`Собрать первый настоящий [[training-loop|цикл обучения]]: обучить прямую $y=wx+b$ только на тензорах и [[autograd|autograd]], вручную обновляя [[parametr|веса]] в [[minus-gradient|минус-градиент]]. Это скелет, который повторяется в любой нейросети.`,
	sections: [
		{
			kind: 'definition',
			heading: 'Задача: подогнать прямую под данные',
			body: String.raw`У нас есть точки $(x_i, y_i)$, и мы верим, что между ними линейная связь. [[lineynaya-regressiya|Линейная регрессия]] ищет два числа — наклон $w$ и сдвиг $b$ — такие, что прямая

$$\hat y_i = w\,x_i + b$$

проходит как можно ближе к точкам. «Близость» меряем [[mse|MSE]] — средним квадратом ошибки:

$$L(w,b) = \frac1N\sum_{i=1}^{N}(\hat y_i - y_i)^2.$$

Это и есть [[loss-fn|функция потерь]]: одно число, которое мы хотим сделать маленьким, крутя $w$ и $b$. Никакой нейросети тут ещё нет — но цикл обучения будет ровно тот же, что и для сети из миллиона параметров.`
		},
		{
			kind: 'intuition',
			heading: 'Как двигать веса: градиент показывает направление',
			body: String.raw`Потеря $L(w,b)$ — это «рельеф»: для каждой пары $(w,b)$ своя высота. Мы хотим в низину. [[gradient|Градиент]] $\nabla L=(\partial L/\partial w,\;\partial L/\partial b)$ показывает направление наискорейшего *подъёма*, поэтому шагаем в **минус** градиент — это и есть [[gradient-spusk|градиентный спуск]]:

$$w \leftarrow w - \eta\,\frac{\partial L}{\partial w},\qquad b \leftarrow b - \eta\,\frac{\partial L}{\partial b}.$$

Здесь $\eta$ — [[learning-rate|learning rate]], размер шага. Повторяем много раз — и $(w,b)$ скатываются туда, где потеря минимальна. Самое приятное: в PyTorch обе производные посчитает [[autograd|autograd]], нам надо лишь описать [[forward|прямой проход]] и вызвать [[backward|.backward()]].`
		},
		{
			kind: 'derivation',
			heading: 'Градиент MSE руками — чтобы понимать, что считает autograd',
			body: String.raw`Прежде чем доверить производные [[autograd|движку]], выведем их сами на этой простой модели. Обозначим остаток $e_i=\hat y_i-y_i=w x_i+b-y_i$. Тогда $L=\frac1N\sum e_i^2$, и по правилу цепочки

$$\frac{\partial L}{\partial w}=\frac1N\sum 2 e_i\,\frac{\partial e_i}{\partial w}=\frac{2}{N}\sum e_i\,x_i,\qquad
\frac{\partial L}{\partial b}=\frac{2}{N}\sum e_i.$$

Эти две формулы — весь «учебный сигнал». Большой остаток на большом $x$ сильнее тянет наклон; средний остаток сдвигает $b$. В живом демо ниже мы вычисляем их явно и сами обновляем $w,b$ — никакого autograd, чистый numpy. Запусти и проследи, как [[shodimost|потеря падает]], а $w,b$ ползут к истинным $2.0$ и $1.0$.`,
			code: {
				title: 'Линейная регрессия градиентным спуском (чистый numpy)',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
# истинная зависимость y = 2x + 1 плюс шум
x = np.random.rand(100)
y = 2.0 * x + 1.0 + 0.1 * np.random.randn(100)

w, b = 0.0, 0.0        # стартуем с нуля
lr = 0.1
for step in range(1, 201):
    y_hat = w * x + b                # forward
    err = y_hat - y                  # остатки e_i
    loss = np.mean(err ** 2)         # MSE
    grad_w = 2.0 * np.mean(err * x)  # dL/dw
    grad_b = 2.0 * np.mean(err)      # dL/db
    w -= lr * grad_w                 # ручной шаг в минус-градиент
    b -= lr * grad_b
    if step % 50 == 0:
        print(f"шаг {step:3d}: loss={loss:.4f}  w={w:.3f}  b={b:.3f}")

print(f"итог: w={w:.3f} (цель 2.0), b={b:.3f} (цель 1.0)")`,
				explanation: String.raw`Это [[gradient-spusk|градиентный спуск]] без единой библиотеки автодиффа: мы сами написали формулы из вывода выше. Потеря монотонно падает, $w,b$ приближаются к истинным. В PyTorch строки **grad_w = …**, **grad_b = …** заменит один вызов [[backward|loss.backward()]] — остальное останется тем же.`
			}
		},
		{
			kind: 'connection',
			heading: 'Тот же цикл на torch и autograd',
			body: String.raw`Теперь переносим всё на PyTorch. Параметры $w,b$ создаём с [[requires-grad|requires_grad=True]] — это говорит [[autograd|autograd]] следить за ними и строить [[vychislitelnyy-graf|граф]]. Внутри цикла: forward → [[mse|MSE]] → [[backward|loss.backward()]] (градиенты сами лягут в **w.grad**, **b.grad**) → [[ruchnoy-shag|ручной шаг]] обновления.

Шаг обновления оборачиваем в [[no-grad-shag|with torch.no_grad()]]: само присваивание новых весов — *не* часть модели, его не нужно записывать в граф. А после шага обязателен [[zero-grad|.grad.zero_()]], потому что **.backward() накапливает** градиенты, и без обнуления они сложатся со следующей итерацией.`,
			code: {
				title: 'Та же регрессия на torch + autograd (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch

torch.manual_seed(0)
x = torch.rand(100)
y = 2.0 * x + 1.0 + 0.1 * torch.randn(100)

# обучаемые параметры — стартуем с нуля
w = torch.zeros(1, requires_grad=True)
b = torch.zeros(1, requires_grad=True)
lr = 0.1

for step in range(1, 201):
    y_hat = w * x + b                  # forward → строится граф
    loss = ((y_hat - y) ** 2).mean()   # MSE (скаляр)

    loss.backward()                    # autograd кладёт градиенты в w.grad, b.grad

    with torch.no_grad():              # шаг вне графа
        w -= lr * w.grad
        b -= lr * b.grad

    w.grad.zero_()                     # обнулить накопленные градиенты
    b.grad.zero_()

    if step % 50 == 0:
        print(f"шаг {step:3d}: loss={loss.item():.4f}  w={w.item():.3f}  b={b.item():.3f}")`,
				explanation: String.raw`Сравни с numpy-демо: формулы градиента исчезли — их считает [[backward|loss.backward()]]. Это и есть фундамент любого [[training-loop|training loop]]: forward, loss, backward, шаг, [[zero-grad|обнуление]]. В следующих днях ручной шаг и [[no-grad-shag|no_grad]] заменит [[optimizer|optimizer.step()]] и [[zero-grad|optimizer.zero_grad()]], но логика та же.`
			}
		},
		{
			kind: 'note',
			heading: 'Learning rate решает всё: сходимость против взрыва',
			body: String.raw`[[learning-rate|Шаг]] $\eta$ — самый капризный параметр. Слишком маленький — потеря ползёт еле-еле и за отведённые итерации не дойдёт до дна. Слишком большой — шаги перелетают минимум, [[shodimost|потеря не сходится]], а растёт, и веса улетают в бесконечность (**nan**). Между ними — окно «правильных» значений.

Запусти демо: для одних и тех же данных тот же спуск с разным $\eta$ либо аккуратно сходится, либо взрывается. Когда потеря в обучении вдруг превращается в **nan** — первая гипотеза почти всегда: слишком большой learning rate.`,
			code: {
				title: 'Один спуск, четыре learning rate (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
x = np.random.rand(100)
y = 2.0 * x + 1.0 + 0.1 * np.random.randn(100)

def run(lr, steps=60):
    w, b = 0.0, 0.0
    for _ in range(steps):
        err = (w * x + b) - y
        w -= lr * 2.0 * np.mean(err * x)
        b -= lr * 2.0 * np.mean(err)
    loss = np.mean(((w * x + b) - y) ** 2)
    return w, b, loss

for lr in [0.01, 0.1, 1.5, 2.5]:
    w, b, loss = run(lr)
    print(f"lr={lr:<4}: w={w:9.3f}  b={b:8.3f}  loss={loss:.4g}")`,
				explanation: String.raw`**lr=0.01** — слишком осторожно, за 60 шагов до цели не дошли. **lr=0.1** — в самый раз, потеря крошечная. **lr=1.5** и **lr=2.5** — [[shodimost|расходимость]]: потеря не падает, а взлетает до астрономических чисел. Подбор $\eta$ — первое, что крутят, когда обучение «не идёт».`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d6-t1',
			difficulty: 'base',
			prompt: String.raw`Для модели $\hat y_i = w x_i + b$ и потери [[mse|MSE]] $L=\frac1N\sum_i(\hat y_i-y_i)^2$ выведите частную производную $\partial L/\partial w$. Запишите ответ через остатки $e_i=\hat y_i-y_i$.`,
			hint: String.raw`Правило цепочки: $\dfrac{\partial}{\partial w}(\hat y_i-y_i)^2 = 2(\hat y_i-y_i)\cdot\dfrac{\partial \hat y_i}{\partial w}$, а $\partial\hat y_i/\partial w = x_i$.`,
			solution: String.raw`Дифференцируем под суммой. Для одного слагаемого $\frac{\partial}{\partial w}(w x_i+b-y_i)^2 = 2(w x_i+b-y_i)\cdot x_i = 2 e_i x_i$. Усредняя по $N$:

$$\frac{\partial L}{\partial w}=\frac{2}{N}\sum_{i=1}^{N} e_i\,x_i.$$

Аналогично $\partial L/\partial b = \frac{2}{N}\sum_i e_i$ (там $\partial\hat y_i/\partial b=1$). Именно эти формулы и считает [[autograd|autograd]] при [[backward|loss.backward()]].`,
			answer: String.raw`$\dfrac{\partial L}{\partial w}=\dfrac{2}{N}\sum_i e_i x_i$, где $e_i=\hat y_i-y_i$.`,
			xp: 12
		},
		{
			id: 'pt-d6-t2',
			difficulty: 'base',
			prompt: String.raw`В цикле обучения вы поставили слишком большой [[learning-rate|learning rate]]. Что произойдёт с [[mse|потерей]] и весами по ходу итераций, и по какому признаку в логах это распознать?`,
			hint: String.raw`Шаг в минус-градиент пропорционален $\eta$. Если $\eta$ велик, шаг перелетает минимум — и куда тогда попадает следующая точка?`,
			solution: String.raw`При слишком большом $\eta$ каждый шаг **перелетает** минимум и оказывается дальше от него, чем был. Градиент в новой точке ещё больше, следующий шаг ещё длиннее — процесс [[shodimost|расходится]]: потеря не убывает, а растёт (часто по экспоненте), веса раздуваются и за несколько шагов становятся **inf/nan**. В логах это видно сразу: **loss** прыгает вверх или превращается в **nan** уже на первых итерациях. Лечение — уменьшить learning rate (например, в 10 раз).`,
			answer: String.raw`Потеря не сходится, а растёт до **nan**, веса взрываются; в логах — растущий или **nan**-овый loss.`,
			xp: 12
		},
		{
			id: 'pt-d6-t3',
			difficulty: 'star',
			prompt: String.raw`Зачем шаг обновления **w -= lr * w.grad** оборачивают в [[no-grad-shag|with torch.no_grad()]]? Что сломается, если убрать **no_grad**, и почему ещё нужно после шага звать **w.grad.zero_()**?`,
			hint: String.raw`Любая операция над тензором с [[requires-grad|requires_grad=True]] вне no_grad записывается в [[vychislitelnyy-graf|граф]]. А [[backward|.backward()]] градиенты не перезаписывает, а складывает.`,
			solution: String.raw`**Про no_grad.** $w$ создан с [[requires-grad|requires_grad=True]], поэтому *любая* операция с ним по умолчанию пишется в [[vychislitelnyy-graf|граф]] [[autograd|autograd]]. Но шаг обновления $w \leftarrow w-\eta\,w.\text{grad}$ — это не часть модели, его не нужно дифференцировать. Без [[no-grad-shag|torch.no_grad()]] PyTorch попытается включить присваивание в граф (и упрётся в ошибку модификации листового тензора in-place, либо начнёт тащить историю шагов, раздувая память и ломая следующий backward). **no_grad** временно выключает запись графа — обновление проходит как обычная арифметика.

**Про zero_().** [[backward|.backward()]] **накапливает** градиенты в **.grad** (прибавляет к тому, что там лежит). Если не обнулить, на следующей итерации новый градиент сложится со старым, шаг будет считаться по сумме градиентов разных итераций — обучение поедет. Поэтому канон: после шага (или перед следующим forward) звать [[zero-grad|w.grad.zero_()]]. В реальном коде обе обязанности берёт на себя [[optimizer|оптимизатор]]: **optimizer.step()** под капотом в no_grad, **optimizer.zero_grad()** обнуляет.`,
			answer: String.raw`no_grad не даёт записать шаг в граф (память/ошибка in-place); zero_() нужен, т.к. backward градиенты складывает, а не перезаписывает.`,
			xp: 25
		}
	],
	mastery: [
		'Записываю линейную модель y=wx+b, MSE и понимаю, что потеря — функция от w,b',
		'Вывожу градиент MSE по w и b и узнаю в нём то, что считает autograd',
		'Пишу цикл: forward → loss → backward → шаг в no_grad → zero_grad',
		'Объясняю, почему шаг обёрнут в no_grad и зачем обнулять .grad',
		'Предсказываю поведение при слишком большом и слишком маленьком learning rate'
	]
};
