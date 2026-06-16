import type { Day } from '$lib/types';

// День 8 — Функции потерь и оптимизаторы. Конвенции (см. day01.ts):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true.

export const day08: Day = {
	n: 8,
	phaseId: 'nn',
	title: 'Функции потерь и оптимизаторы',
	chapterRef: 'pt-08',
	est: '1–2 ч',
	goal: String.raw`Связать [[loss-fn|потерю]] и [[optimizer|torch.optim]] в одну петлю обучения: выбрать [[mse-loss|MSE]] или [[cross-entropy-logits|CrossEntropy]], отдать [[optim-sgd|SGD]] или [[optim-adam|Adam]] параметры модели и запомнить канонический [[shag-optimizatora|порядок шага]].`,
	sections: [
		{
			kind: 'definition',
			heading: 'Две рабочие лошадки потерь',
			body: String.raw`[[loss-fn|Функция потерь]] превращает предсказание и истину в один скаляр, который мы минимизируем. Под задачу берут одну из двух:

- **регрессия** (предсказываем число) → [[mse-loss|nn.MSELoss]]: предсказание и цель **одной формы**, потеря — средний квадрат отклонения;
- **классификация** (предсказываем класс) → [[cross-entropy-logits|nn.CrossEntropyLoss]]: на вход **сырые логиты** $(N,C)$ и целые метки $(N,)$.

Обе — это **nn.Module**: создаёшь объект-критерий один раз, потом зовёшь его как функцию: **loss = criterion(pred, target)**. Результат — скаляр, по нему пойдёт [[backward|.backward()]].`,
			code: {
				title: 'MSE и кросс-энтропия руками (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

# --- MSE: регрессия, pred и target одной формы ---
pred   = np.array([2.5, 0.0, 2.1])
target = np.array([3.0, -0.5, 2.0])
mse = np.mean((pred - target) ** 2)
print("MSE:", round(float(mse), 4))

# --- Кросс-энтропия для одного примера: из логитов ---
def softmax(z):
    z = z - z.max()              # сдвиг ради устойчивости
    e = np.exp(z)
    return e / e.sum()

logits = np.array([2.0, 0.5, -1.0])  # сырые выходы сети, 3 класса
y = 0                                # верный класс — 0
p = softmax(logits)
ce = -np.log(p[y])                   # CE = -log p[верного класса]
print("вероятности:", np.round(p, 3))
print("CE:", round(float(ce), 4))`,
				explanation: String.raw`**MSE** — просто средний квадрат разности. [[cross-entropy-logits|Кросс-энтропия]] = [[softmax|softmax]] логитов, затем **-log** вероятности верного класса. Запусти и поменяй **logits[0]** на большее число — увидишь, как $p_0$ растёт, а CE падает. Именно так PyTorch считает потерю внутри, только устойчивее.`
			}
		},
		{
			kind: 'intuition',
			heading: 'Почему CrossEntropyLoss ест логиты, а не вероятности',
			body: String.raw`Главная ловушка новичка: добавить [[softmax|softmax]] последним слоём модели **и** взять [[cross-entropy-logits|CrossEntropyLoss]]. Тогда softmax применится дважды — потеря будет «вялой», обучение замедлится.

Канон: модель отдаёт **сырые логиты**, а **nn.CrossEntropyLoss** делает softmax + log + NLL внутри, в один проход. Это не лень, а **численная устойчивость**: $\log\!\big(\mathrm{softmax}(z)\big)$ считается через приём log-sum-exp, без переполнения $e^{z}$ для больших логитов.

$$\mathcal{L}=-\log\frac{e^{z_{y}}}{\sum_j e^{z_j}} = -z_{y} + \log\sum_j e^{z_j}$$

Softmax вручную нужен только на **инференсе**, когда хочешь именно вероятности; для самой потери и для **argmax**-предсказания он не требуется.`
		},
		{
			kind: 'definition',
			heading: 'Оптимизатор: что и как обновляет веса',
			body: String.raw`[[optimizer|Оптимизатор]] из **torch.optim** хранит ссылки на [[parametr|параметры]] и по их **.grad** двигает веса. Два главных:

- [[optim-sgd|SGD]] — один общий шаг $w \leftarrow w - \eta\,g$; с **momentum** копит скорость. Прост, надёжен, требует подбора [[learning-rate|lr]];
- [[optim-adam|Adam]] — адаптивный: свой эффективный шаг на каждый вес. Быстро сходится «из коробки», типичный **lr=1e-3**.

Критично, **что** ты отдаёшь конструктору — **model.parameters()**. Это генератор всех обучаемых тензоров модели; забудешь часть (например, параметры второй подсети) — она просто не будет учиться.`,
			code: {
				title: 'Один шаг SGD руками (numpy)',
				language: 'python',
				code: String.raw`import numpy as np
np.random.seed(0)

# Линейная регрессия y = 2x + 1, один параметр w и bias b.
X = np.array([0.0, 1.0, 2.0, 3.0])
y = 2.0 * X + 1.0
w, b = 0.0, 0.0          # начальные веса
lr = 0.1

for step in range(3):
    pred = w * X + b
    loss = np.mean((pred - y) ** 2)        # MSE
    # градиенты MSE по w и b (это и есть .backward())
    grad_w = np.mean(2 * (pred - y) * X)
    grad_b = np.mean(2 * (pred - y))
    w -= lr * grad_w                       # optimizer.step()
    b -= lr * grad_b
    print(f"step {step}: loss={loss:.3f}  w={w:.3f}  b={b:.3f}")`,
				explanation: String.raw`Это [[optim-sgd|SGD]] в чистом виде: посчитали [[gradient|градиент]] потери, шагнули в минус-градиент с шагом **lr**. В PyTorch градиент находит [[autograd|autograd]] (**loss.backward()**), а шаг делает **optimizer.step()** — формула та же, $w \leftarrow w - \eta\,\nabla_w L$.`
			}
		},
		{
			kind: 'note',
			heading: 'Канонический порядок шага',
			body: String.raw`Один шаг обучения всегда идёт в одном [[shag-optimizatora|порядке]]:

1. **optimizer.zero_grad()** — обнулить градиенты с прошлого шага;
2. **pred = model(x)** — [[forward|прямой проход]];
3. **loss = criterion(pred, y)** — посчитать потерю;
4. **loss.backward()** — посчитать $\partial L/\partial w$ ([[backward|backward]]);
5. **optimizer.step()** — обновить веса.

Порядок не случаен. [[backward|.backward()]] **накапливает** градиенты, поэтому [[zero-grad|zero_grad]] идёт **первым**. Шаг **step()** обязан быть **после** backward — иначе обновишь веса по пустым или старым градиентам.`,
			code: {
				title: 'Мини-цикл обучения на torch (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import torch.nn as nn
import torch.optim as optim

# модель-классификатор: 4 признака → 3 класса (сырые логиты)
model = nn.Linear(4, 3)

criterion = nn.CrossEntropyLoss()                 # ест логиты + целые метки
optimizer = optim.Adam(model.parameters(), lr=1e-3)

# один батч: 8 примеров
x = torch.randn(8, 4)
y = torch.randint(0, 3, (8,))                     # метки 0..2, форма (8,)

for step in range(5):
    optimizer.zero_grad()                         # 1. обнулить градиенты
    logits = model(x)                             # 2. forward → (8, 3)
    loss = criterion(logits, y)                   # 3. потеря (скаляр)
    loss.backward()                               # 4. градиенты
    optimizer.step()                              # 5. шаг весов
    print(f"step {step}: loss={loss.item():.4f}")`,
				explanation: String.raw`Заметь: на выходе модели **нет** [[softmax|softmax]] — [[cross-entropy-logits|CrossEntropyLoss]] берёт сырые логиты. Метки **y** — целые индексы классов, не one-hot. Сменишь задачу на регрессию — поменяй только критерий на **nn.MSELoss()** и форму **y**, остальной цикл тот же.`
			}
		},
		{
			kind: 'connection',
			heading: 'SGD против Adam: когда что',
			body: String.raw`Оба оптимизатора решают одну задачу — минимизировать потерю, — но по-разному распоряжаются [[learning-rate|lr]].

[[optim-sgd|SGD]] применяет **один** шаг ко всем весам: если lr подобран плохо, одни параметры учатся медленно, другие осциллируют. Зато при удачном lr (часто с [[scheduler|расписанием]]) даёт лучшее обобщение — стандарт для финального дожима.

[[optim-adam|Adam]] держит для каждого веса свой масштаб (по скользящему среднему квадрата градиента), поэтому почти безразличен к выбору lr и сходится быстро. Цена — вдвое больше памяти под моменты. Практика: **начинай с Adam(lr=1e-3)**; если важна последняя доля качества — переходи на тщательно настроенный SGD+momentum.`
		}
	],
	tasks: [
		{
			id: 'pt-d8-t1',
			difficulty: 'base',
			prompt: String.raw`Коллега перед [[cross-entropy-logits|nn.CrossEntropyLoss]] поставил последним слоём **nn.Softmax(dim=1)**, «чтобы получить вероятности». Почему это ошибка и что подавать в CrossEntropyLoss на самом деле?`,
			hint: String.raw`Что **nn.CrossEntropyLoss** делает внутри себя? Какой формы и типа её два аргумента?`,
			solution: String.raw`**nn.CrossEntropyLoss** уже включает [[softmax|softmax]] + log + NLL. Если перед ней поставить ещё один softmax, он применится дважды: на вход потере придут «вероятности», к которым снова применят softmax — распределение сглаживается, градиенты ослабевают, обучение замедляется. Подавать нужно **сырые логиты** формы $(N,C)$ и целые метки $(N,)$ со значениями $0..C{-}1$. Внутренний softmax считается устойчиво (log-sum-exp), поэтому добавлять его руками не нужно и вредно.`,
			answer: String.raw`Softmax применится дважды. Подавать сырые логиты $(N,C)$ и целые метки $(N,)$.`,
			xp: 12
		},
		{
			id: 'pt-d8-t2',
			difficulty: 'base',
			prompt: String.raw`В чём ключевое отличие [[optim-sgd|SGD]] от [[optim-adam|Adam]]? Почему Adam обычно «заводится» с дефолтным [[learning-rate|lr]], а SGD требует подбора, и какой ценой Adam это даёт?`,
			hint: String.raw`Сколько эффективных шагов lr у каждого: один на всё или свой на каждый вес? Что Adam хранит дополнительно?`,
			solution: String.raw`[[optim-sgd|SGD]] использует **один общий** шаг $\eta$ для всех весов: $w \leftarrow w-\eta g$ (с momentum — копит скорость). Поэтому качество сильно зависит от lr, его подбирают вручную, часто с [[scheduler|расписанием]]. [[optim-adam|Adam]] хранит скользящие средние [[gradient|градиента]] и его квадрата и масштабирует шаг по **каждому весу отдельно** — фактически свой эффективный lr на параметр, отсюда устойчивость к выбору lr и быстрая сходимость (**lr=1e-3** обычно работает сразу). Цена — память: два момента на каждый параметр (грубо ×2–3 к весам) и иногда чуть худшее обобщение, чем у тщательно настроенного SGD.`,
			answer: String.raw`SGD — один шаг на все веса; Adam — адаптивный шаг на каждый вес ценой памяти на моменты.`,
			xp: 12
		},
		{
			id: 'pt-d8-t3',
			difficulty: 'star',
			prompt: String.raw`Студент убрал **optimizer.zero_grad()** из цикла обучения, оставив **forward → loss → backward → step**. Что конкретно произойдёт с градиентами и обучением на 2-й, 3-й и последующих итерациях? Сравни это с обычным [[batch|батчем]] большего размера — это одно и то же?`,
			hint: String.raw`Вспомни: что делает [[backward|.backward()]] с **.grad** — записывает или прибавляет? Одинаковы ли веса от шага к шагу?`,
			solution: String.raw`[[backward|.backward()]] **накапливает** градиенты в **.grad**, а не перезаписывает. Без [[zero-grad|zero_grad]] на итерации $k$ в **.grad** окажется **сумма** градиентов итераций $1..k$. На шаге **step()** к весам применится этот раздутый суммарный градиент — фактический шаг растёт с каждой итерацией, как будто [[learning-rate|lr]] неконтролируемо увеличивается: обучение расходится или сильно осциллирует.

Это **не** то же самое, что больший [[batch|батч]]. При gradient accumulation складывают градиенты по **разным** батчам, посчитанные при **одних и тех же** весах, и делают один step (часто с делением на число накоплений). Здесь же веса меняются **между** backward'ами, поэтому суммируются градиенты, посчитанные в разных точках, — это не оценка градиента большего батча, а просто сломанный шаг. Поэтому **zero_grad()** обязателен в начале каждой итерации.`,
			answer: String.raw`Градиенты суммируются между шагами → эффективный шаг растёт, обучение расходится. На батч это не похоже: там накапливают при фиксированных весах.`,
			xp: 25
		}
	],
	mastery: [
		'Выбираю nn.MSELoss для регрессии и nn.CrossEntropyLoss для классификации',
		'Знаю, что CrossEntropyLoss принимает сырые логиты и целые метки, без softmax',
		'Создаю optim.SGD / optim.Adam, отдавая им model.parameters() и lr',
		'Пишу шаг в каноническом порядке: zero_grad → forward → loss → backward → step'
	]
};
