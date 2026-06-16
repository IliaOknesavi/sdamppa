import type { Day } from '$lib/types';

// День 5. Конвенции (как в day01):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy/stdlib-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.

export const day05: Day = {
	n: 5,
	phaseId: 'autograd',
	title: 'Свой мини-autograd на numpy',
	chapterRef: 'pt-05',
	est: '1–2 ч',
	goal: String.raw`Снять магию с [[autograd|autograd]]: собрать крошечный движок обратного распространения на чистом numpy — класс **Value** со скаляром, [[lokalnyy-gradient|локальными производными]] и [[topologicheskaya-sortirovka|топологической сортировкой]] графа. Когда ты сам напишешь [[backward|.backward()]], [[vychislitelnyy-graf|вычислительный граф]] PyTorch перестанет быть чёрным ящиком.`,
	sections: [
		{
			kind: 'intuition',
			heading: 'Идея: один скаляр, который помнит, откуда он взялся',
			body: String.raw`[[autograd|Autograd]] в PyTorch кажется волшебством, но внутри он прост. Достаточно одного класса — назовём его [[micrograd-value|Value]] — который оборачивает **одно число** и хранит две вещи: само значение **data** и накопленный [[gradient|градиент]] **grad** $=\partial L/\partial\text{value}$.

Ключевая хитрость: при каждой операции ($+$, $*$, **tanh**) новый **Value** запоминает, **из каких предков** он получился (**_prev**) и **как протолкнуть градиент** в этих предков (**_backward**). Так выражение строит [[vychislitelnyy-graf|вычислительный граф]] прямо по ходу вычислений — ровно как define-by-run в torch.

Это и есть дух **micrograd** Андрея Карпатого: ~100 строк, и ты понимаешь обратное распространение до последнего знака.`
		},
		{
			kind: 'definition',
			heading: 'Локальный градиент и правило цепочки',
			body: String.raw`Каждая операция знает свою **локальную** производную — как её выход зависит от входов:

- сумма $c=a+b$: $\partial c/\partial a=1$, $\partial c/\partial b=1$;
- произведение $c=a\cdot b$: $\partial c/\partial a=b$, $\partial c/\partial b=a$;
- $c=\tanh(a)$: $\partial c/\partial a=1-\tanh^2(a)=1-c^2$.

[[pravilo-cepochki|Правило цепочки]] говорит, как из локальных собрать глобальный: вклад узла в потерю — это его [[lokalnyy-gradient|локальный градиент]], **умноженный** на градиент, пришедший сверху (**out.grad**). Поэтому каждый **_backward** делает одно: берёт **out.grad**, домножает на локальную производную и **добавляет** результат в **grad** предка.`,
			code: {
				title: 'Локальные производные руками (numpy-сверка)',
				language: 'python',
				code: String.raw`import numpy as np

# Проверим локальные производные численно (конечной разностью).
def num_grad(f, x, h=1e-6):
    return (f(x + h) - f(x - h)) / (2 * h)

a = 2.0
print("d(a*b)/da при b=-3:", -3.0, "| числ:", num_grad(lambda x: x * -3.0, a))
print("d(tanh)/da        :", 1 - np.tanh(a) ** 2,
      "| числ:", num_grad(np.tanh, a))`,
				explanation: String.raw`Аналитическая локальная производная и численная (центральная разность) совпадают. Именно эти формулы мы зашьём в **_backward** каждой операции — больше autograd ничего не делает.`
			}
		},
		{
			kind: 'derivation',
			heading: 'Движок Value целиком',
			body: String.raw`Соберём всё вместе. **Value** перегружает **__add__** и **__mul__** (Python вызывает их на $+$ и $*$) и метод **tanh**. Каждая операция создаёт новый узел, прописывает ему **_prev** (предки) и замыкание **_backward** с локальной производной.

Метод **backward()** делает два шага: сначала [[topologicheskaya-sortirovka|топологическая сортировка]] графа (предки раньше потомков), затем — проход по узлам **в обратном порядке** с вызовом каждого **_backward**. Корню кладём **grad = 1.0** (ведь $\partial L/\partial L=1$), и градиент течёт назад до листьев.`,
			code: {
				title: 'micrograd на numpy: построить выражение и вызвать backward()',
				language: 'python',
				code: String.raw`import numpy as np

class Value:
    def __init__(self, data, _children=()):
        self.data = float(data)
        self.grad = 0.0                 # dL/d(self), накопитель
        self._backward = lambda: None   # как протолкнуть градиент в предков
        self._prev = set(_children)     # узлы-предки в графе

    def __add__(self, other):
        out = Value(self.data + other.data, (self, other))
        def _bw():                      # d(a+b)/da = d(a+b)/db = 1
            self.grad  += out.grad
            other.grad += out.grad
        out._backward = _bw
        return out

    def __mul__(self, other):
        out = Value(self.data * other.data, (self, other))
        def _bw():                      # локальные производные: b и a
            self.grad  += other.data * out.grad
            other.grad += self.data  * out.grad
        out._backward = _bw
        return out

    def tanh(self):
        t = np.tanh(self.data)
        out = Value(t, (self,))
        def _bw():
            self.grad += (1 - t ** 2) * out.grad   # 1 - tanh^2
        out._backward = _bw
        return out

    def backward(self):
        topo, seen = [], set()
        def build(v):                   # топологическая сортировка
            if v not in seen:
                seen.add(v)
                for child in v._prev:
                    build(child)
                topo.append(v)
        build(self)
        self.grad = 1.0                 # dL/dL = 1
        for v in reversed(topo):
            v._backward()

# L = tanh(a*b + a)
a = Value(2.0); b = Value(-3.0)
L = (a * b + a).tanh()
L.backward()
print("L      =", round(L.data, 6))
print("a.grad =", round(a.grad, 6))
print("b.grad =", round(b.grad, 6))`,
				explanation: String.raw`Запусти — получишь **a.grad = -0.002682**, **b.grad = 0.002682**. Это и есть [[backprop|обратное распространение]] на ~30 строках: граф собрался сам во время **a * b + a**, [[topologicheskaya-sortirovka|топосортировка]] выстроила порядок, обратный проход разнёс градиенты по листьям.`
			}
		},
		{
			kind: 'connection',
			heading: 'Та же задача в настоящем PyTorch',
			body: String.raw`Наш **Value** — это игрушечная копия [[tenzor|torch.Tensor]] с [[requires-grad|requires_grad=True]]. В PyTorch ты пишешь то же выражение, вызываешь [[backward|.backward()]], и градиенты оказываются в **.grad**. Числа обязаны совпасть с нашим движком — ведь математика одна.

Разница лишь в масштабе: torch работает с целыми тензорами (а не скалярами), оптимизирован на C++/CUDA и поддерживает сотни операций. Но **идея** — узлы, локальные производные, топосортировка, обратный проход — ровно та, что ты только что написал руками.`,
			code: {
				title: 'Сверка: те же градиенты в torch (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch

a = torch.tensor(2.0, requires_grad=True)
b = torch.tensor(-3.0, requires_grad=True)

L = torch.tanh(a * b + a)   # тот же граф, что в нашем Value
L.backward()                # autograd проходит граф назад

print("L      =", round(L.item(), 6))
print("a.grad =", round(a.grad.item(), 6))   # -0.002682
print("b.grad =", round(b.grad.item(), 6))   #  0.002682`,
				explanation: String.raw`Совпадение до 6-го знака — лучшее доказательство, что [[autograd|autograd]] не магия. **a * b + a** строит [[vychislitelnyy-graf|граф]] так же, как наш движок; **.backward()** делает то же, что наш метод **backward()**.`
			}
		},
		{
			kind: 'note',
			heading: 'Две тонкости, на которых все спотыкаются',
			body: String.raw`**1. Почему grad += , а не grad = ?** Один узел может участвовать в выражении **несколько раз** (в нашем примере **a** входит и в **a * b**, и в **+ a**). Каждый путь от потери до узла даёт свой вклад, и по [[pravilo-cepochki|правилу цепочки]] эти вклады **складываются**. Если бы мы писали **=**, второй путь затёр бы первый и градиент был бы неверным. Та же причина, по которой torch **накапливает** градиенты и требует [[zero-grad|optimizer.zero_grad()]] перед каждым шагом.

**2. Зачем топосортировка?** Чтобы вызвать **_backward** узла, его **out.grad** должен быть уже полностью посчитан — то есть все его потомки должны отработать раньше. [[topologicheskaya-sortirovka|Топологическая сортировка]] как раз даёт порядок «сначала потомки, потом предки» (мы идём по нему в обратную сторону). Без неё градиент пошёл бы по недосчитанным числам.`
		}
	],
	tasks: [
		{
			id: 'pt-d5-t1',
			difficulty: 'base',
			prompt: String.raw`Добавь в класс **Value** поддержку вычитания. Реализуй **__neg__** (унарный минус) и **__sub__**, выразив их через уже готовые **__mul__** и **__add__**, чтобы не писать новый **_backward**. Проверь на $f=a-b$ при $a=5,\ b=2$: какими должны быть **a.grad** и **b.grad**?`,
			hint: String.raw`$-x$ — это $x\cdot(-1)$, а $a-b$ — это $a+(-b)$. Если переиспользовать **__mul__** и **__add__**, [[lokalnyy-gradient|локальные производные]] и **_backward** возьмутся сами собой.`,
			solution: String.raw`Выражаем через существующие операции — отдельный **_backward** не нужен:

    def __neg__(self):
        return self * Value(-1.0)

    def __sub__(self, other):
        return self + (-other)

Тогда $f=a-b$ собирается как $a+((-1)\cdot b)$. Производные: $\partial f/\partial a=1$, $\partial f/\partial b=-1$. При $a=5,\ b=2$: **f.data = 3**, **a.grad = 1.0**, **b.grad = -1.0**. Красота переиспользования в том, что граф из $\times$ и $+$ уже умеет распространять градиент — мы лишь собрали из них новую формулу.`,
			answer: String.raw`**a.grad = 1.0**, **b.grad = -1.0** (через **__neg__**/**__sub__** поверх $*$ и $+$).`,
			xp: 12
		},
		{
			id: 'pt-d5-t2',
			difficulty: 'base',
			prompt: String.raw`Объясни своими словами, **зачем** в методе **backward()** нужна [[topologicheskaya-sortirovka|топологическая сортировка]]. Что сломается, если просто пройти по узлам графа в случайном порядке и вызвать их **_backward**?`,
			hint: String.raw`Подумай, что использует **_backward** узла: оно читает **out.grad** (градиент самого узла) и добавляет вклад в предков. Когда **out.grad** становится окончательным?`,
			solution: String.raw`**_backward** узла домножает его **grad** на [[lokalnyy-gradient|локальную производную]] и проталкивает в предков. Значит, к моменту вызова **_backward** градиент **самого узла** должен быть уже **полностью накоплен** — то есть все его потомки (узлы, куда он входит) обязаны отработать раньше.

[[topologicheskaya-sortirovka|Топосортировка]] даёт порядок «предок появляется в списке после всех своих потомков по графу зависимостей»; мы строим его обходом в глубину и идём **reversed**, получая «сначала корень-потеря, потом всё ниже». Если порядок случайный, мы можем вызвать **_backward** узла, чьё **out.grad** ещё не досчитано (часть путей сверху не пройдена) — и протолкнём в предков **неполный** градиент. Результат будет молча неверным.`,
			answer: String.raw`Чтобы **out.grad** узла был полностью накоплен до его **_backward**: все потомки — раньше. Случайный порядок даёт неполные, неверные градиенты.`,
			xp: 12
		},
		{
			id: 'pt-d5-t3',
			difficulty: 'star',
			prompt: String.raw`Добавь в **Value** поддержку степени: **__pow__** для $c=a^k$, где $k$ — обычное число (не **Value**). Выпиши [[lokalnyy-gradient|локальную производную]] и **_backward**. Затем на примере $f=(x-2)^3$ при $x=5$ покажи, чему равен **x.grad**, и заодно объясни, **почему** градиент в **_backward** накапливается через **+=**, а не присваивается.`,
			hint: String.raw`Производная $a^k$ по $a$ — это $k\,a^{k-1}$. В **_backward** домножь её на **out.grad**. Для второй части вспомни, что **x** в $(x-2)^3$ участвует в выражении, и проследи, сколько раз его **grad** обновляется за один обратный проход.`,
			solution: String.raw`Локальная производная $c=a^k$ по $a$: $\partial c/\partial a=k\,a^{k-1}$. Реализация:

    def __pow__(self, k):                 # k — int/float, не Value
        out = Value(self.data ** k, (self,))
        def _bw():
            self.grad += (k * self.data ** (k - 1)) * out.grad
        out._backward = _bw
        return out

Для $f=(x-2)^3$: $\partial f/\partial x=3(x-2)^2$. При $x=5$: $(x-2)=3$, значит **x.grad** $=3\cdot 3^2=27$ (и **f.data** $=27$).

**Почему +=, а не =:** в нашем выражении сначала считается узел $u=x-2$, и его **_backward** (через **__sub__**) добавляет вклад в **x.grad**. Если бы **_backward** **присваивал** (**=**), то при графе, где узел используется по нескольким путям (например $g=x\cdot x$, где **x** входит дважды), второй вклад затёр бы первый, и вместо $\partial g/\partial x=2x$ мы получили бы $x$. [[pravilo-cepochki|Правило цепочки]] для узла с несколькими исходящими рёбрами **суммирует** вклады всех путей — поэтому единственно верно **+=**. Та же логика заставляет PyTorch накапливать градиенты и требовать [[zero-grad|zero_grad()]] между шагами.`,
			answer: String.raw`Локально $k\,a^{k-1}$; для $(x-2)^3$ при $x=5$ — **x.grad = 27**. **+=** нужно, потому что правило цепочки суммирует вклады всех путей через узел.`,
			xp: 25
		}
	],
	mastery: [
		'Объясняю, что autograd — это узлы со значением, локальной производной и списком предков',
		'Реализую Value с +, *, tanh и методом backward() через топологическую сортировку',
		'Понимаю, почему backward накапливает градиент через += (правило цепочки суммирует пути)',
		'Сверяю градиенты своего движка с torch.Tensor и вижу совпадение до знака'
	]
};
