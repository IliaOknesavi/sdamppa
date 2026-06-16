import type { Day } from '$lib/types';

// День 7. Конвенции (как в эталоне day01):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным** (бэктики ломают String.raw).
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.
//  • Термины [[id]] / [[id|подпись]] — из базового глоссария или day07.terms.ts.

export const day07: Day = {
	n: 7,
	phaseId: 'nn',
	title: 'nn.Module и слои (Linear)',
	chapterRef: 'pt-07',
	est: '1–2 ч',
	goal: String.raw`Перейти от ручных [[parametr|параметров]] к [[nn-module|nn.Module]]: собрать сеть как класс из [[nn-linear|nn.Linear]] и [[aktivaciya-relu|активаций]], объявить слои в **__init__**, описать [[forward|forward]] и вызывать модель через **model(x)**.`,
	sections: [
		{
			kind: 'definition',
			heading: 'Зачем nn.Module',
			body: String.raw`До сих пор веса жили как отдельные тензоры с [[requires-grad|requires_grad=True]], и ты тащил их в [[optimizer|оптимизатор]] вручную. Это не масштабируется: у настоящей сети сотни тензоров.

[[nn-module|nn.Module]] — базовый класс, который наводит порядок. Ты наследуешь его и:

- в **__init__** объявляешь подслои и [[parametr|параметры]] как поля **self.…**;
- в [[forward|forward(x)]] описываешь, как из входа получается выход.

Взамен модуль сам собирает все [[parametr|параметры]] в один список (**model.parameters()**), умеет переезжать на [[device|устройство]] (**.to(device)**) и переключать [[train-eval|режимы]] (**.train()/.eval()**). Вложенные модули образуют дерево — модель из модулей из модулей.`
		},
		{
			kind: 'definition',
			heading: 'nn.Linear: полносвязный слой',
			body: String.raw`[[nn-linear|nn.Linear(in_features, out_features)]] — это аффинное преобразование $y = xW^\top + b$. Внутри он держит два [[parametr|параметра]]:

- **weight** формы $(\text{out},\text{in})$ — матрица весов;
- **bias** формы $(\text{out},)$ — смещение.

Слой принимает [[batch|батч]] входов формы $(N,\text{in})$ и отдаёт $(N,\text{out})$. Заметь транспонирование: хранится $W$ формы $(\text{out},\text{in})$, а в формуле умножают на $W^\top$ — так строка входа $(\text{in},)$ превращается в строку выхода $(\text{out},)$.

Ниже соберём ровно этот прямой проход руками на numpy, чтобы увидеть формы.`,
			code: {
				title: 'Прямой проход Linear руками: y = x @ W.T + b (numpy)',
				language: 'python',
				code: String.raw`import numpy as np
np.random.seed(0)

N, in_f, out_f = 4, 3, 2          # батч 4, вход 3, выход 2
x = np.random.randn(N, in_f)      # (4, 3)
W = np.random.randn(out_f, in_f)  # (2, 3) — как в nn.Linear
b = np.random.randn(out_f)        # (2,)

y = x @ W.T + b                   # (4,3)@(3,2) + (2,) -> (4,2)
h = np.maximum(0, y)              # ReLU поэлементно

print("x:", x.shape, "W:", W.shape, "b:", b.shape)
print("y = x@W.T + b ->", y.shape)
print("после ReLU ->", h.shape)
print(np.round(h, 2))`,
				explanation: String.raw`Вот и весь [[nn-linear|Linear]]: одно матричное умножение плюс [[broadcasting|broadcasting]] смещения **b** на каждую строку батча. Форма входа $(4,3)$ превращается в $(4,2)$ — число столбцов задаёт **out_features**. [[aktivaciya-relu|ReLU]] — это просто **max(0, y)** поэлементно, форму он не меняет. В PyTorch ровно это делает **nn.Linear(3, 2)(x)**.`
			}
		},
		{
			kind: 'definition',
			heading: 'Активации: ReLU, Sigmoid, Tanh',
			body: String.raw`Стопка из одних [[nn-linear|Linear]] бесполезна: композиция линейных преобразований — снова линейное. Чтобы сеть выучивала нелинейные зависимости, между слоями ставят [[aktivaciya-relu|активацию]] — поэлементную нелинейную функцию:

- **nn.ReLU** — $\max(0,x)$: дёшево, не насыщается на положительных, дефолт для скрытых слоёв;
- **nn.Sigmoid** — $\sigma(x)=1/(1+e^{-x})$, давит в $(0,1)$; для бинарных вероятностей на выходе;
- **nn.Tanh** — $\tanh(x)$, давит в $(-1,1)$, центрирован в нуле.

Активация не имеет [[parametr|параметров]] — это чистая функция формы $(\cdot)\to(\cdot)$, не меняющая [[shape-forma|форму]].`
		},
		{
			kind: 'derivation',
			heading: 'Собираем MLP как класс',
			body: String.raw`[[mlp|Многослойный перцептрон]] (MLP) — это чередование [[nn-linear|Linear]] и [[aktivaciya-relu|активаций]]. Соберём двухслойный MLP как наследник [[nn-module|nn.Module]]: в **__init__** объявим два **nn.Linear** и **nn.ReLU**, в [[forward|forward]] прогоним вход через них по очереди.

Ключевой момент — вызываем модель как **model(x)**, а НЕ **model.forward(x)**: **__call__** модуля делает служебную работу (хуки, построение [[vychislitelnyy-graf|графа]]) и только потом зовёт твой **forward**. Прямой вызов **forward** эту обвязку пропускает.

Тот же MLP можно записать короче через [[nn-sequential|nn.Sequential]] — контейнер, который сам прогоняет вход через слои по порядку.`,
			code: {
				title: 'MLP как nn.Module + эквивалент nn.Sequential (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, in_f, hidden, out_f):
        super().__init__()                  # обязательно: инициализирует nn.Module
        self.fc1 = nn.Linear(in_f, hidden)  # weight (hidden, in_f), bias (hidden,)
        self.act = nn.ReLU()
        self.fc2 = nn.Linear(hidden, out_f)

    def forward(self, x):                    # x: (N, in_f)
        x = self.act(self.fc1(x))            # -> (N, hidden)
        return self.fc2(x)                   # -> (N, out_f)

model = MLP(3, 8, 2)
print(model)                                 # печатает дерево слоёв

x = torch.randn(4, 3)
y = model(x)                                 # вызываем model(x), НЕ model.forward(x)
print("вход:", x.shape, "выход:", y.shape)   # (4,3) -> (4,2)

n_params = sum(p.numel() for p in model.parameters())
print("параметров:", n_params)               # (3*8+8) + (8*2+2) = 50

# то же самое короче через nn.Sequential:
seq = nn.Sequential(nn.Linear(3, 8), nn.ReLU(), nn.Linear(8, 2))
print(seq(x).shape)                          # (4, 2)`,
				explanation: String.raw`**print(model)** показывает дерево из **fc1**, **act**, **fc2** — модуль сам ведёт реестр подслоёв. **model.parameters()** обходит это дерево и отдаёт все [[parametr|параметры]] [[optimizer|оптимизатору]] одной строкой. Через **.numel()** считаем число элементов каждого тензора и суммируем — получаем 50 обучаемых чисел. [[nn-sequential|Sequential]] — это готовый **forward**, который прогоняет вход через слои по порядку: удобно, когда сеть линейна без ветвлений.`
			}
		},
		{
			kind: 'intuition',
			heading: 'Подсчёт числа параметров',
			body: String.raw`Сколько чисел учит один [[nn-linear|Linear(in, out)]]? [[podschet-parametrov|Считаем напрямую]]: матрица **weight** даёт $\text{in}\times\text{out}$ весов, **bias** добавляет ещё $\text{out}$. Итого

$$\#\text{params} = \text{in}\cdot\text{out} + \text{out} = (\text{in}+1)\cdot\text{out}.$$

Для всей сети — сумма по слоям. [[aktivaciya-relu|Активации]] и [[pooling|pooling]] параметров не добавляют. Этот навык нужен постоянно: прикинуть размер модели, поймать опечатку в форме, оценить, влезет ли сеть в память. В коде то же самое делает **sum(p.numel() for p in model.parameters())**.`
		},
		{
			kind: 'connection',
			heading: 'Что это даёт дальше',
			body: String.raw`Теперь весь цикл обучения собирается из готовых кубиков: **model = MLP(...)**, **opt = optim.Adam(model.parameters(), ...)**, в цикле — **model(x)** → [[loss-fn|loss]] → [[backward|.backward()]] → [[zero-grad|opt.zero_grad()]] → **opt.step()**. Ручные тензоры весов больше не нужны.

[[nn-module|nn.Module]] — фундамент: [[conv2d|свёрточные]] слои, нормализации, dropout, целые трансформеры — всё это модули, которые собираются и вызываются точно так же. Освоив **__init__** + **forward** + **model(x)**, ты умеешь строить любую архитектуру.`
		}
	],
	tasks: [
		{
			id: 'pt-d7-t1',
			difficulty: 'base',
			prompt: String.raw`Сколько обучаемых [[parametr|параметров]] у слоя **nn.Linear(128, 64)**? Распишите вклад **weight** и **bias** по отдельности.`,
			hint: String.raw`**weight** имеет форму $(\text{out},\text{in})$, **bias** — $(\text{out},)$. Сложите число элементов обоих.`,
			solution: String.raw`**weight** формы $(64,128)$ даёт $64\cdot128 = 8192$ весов, **bias** формы $(64,)$ — ещё $64$. Итого $8192 + 64 = 8256$. По формуле $(\text{in}+1)\cdot\text{out} = 129\cdot64 = 8256$.`,
			answer: String.raw`$8256$ ($8192$ в weight $+\,64$ в bias).`,
			xp: 12
		},
		{
			id: 'pt-d7-t2',
			difficulty: 'base',
			prompt: String.raw`Почему модель вызывают как **model(x)**, а не **model.forward(x)**? Что теряется при прямом вызове **forward**?`,
			hint: String.raw`У [[nn-module|nn.Module]] определён **__call__**. Он делает что-то *до* и *вокруг* твоего **forward**.`,
			solution: String.raw`**model(x)** вызывает **__call__** модуля, который запускает хуки (pre/forward hooks) и служебную обвязку, и только потом — твой [[forward|forward]]. Это нужно, чтобы корректно строился [[vychislitelnyy-graf|вычислительный граф]] и работали механизмы вроде регистрации хуков. **model.forward(x)** зовёт метод напрямую, минуя **__call__**: хуки не сработают, и в некоторых случаях это ломает ожидаемое поведение. Канон — всегда **model(x)**.`,
			answer: String.raw`**model(x)** идёт через **__call__** (хуки, обвязка); прямой **forward** их пропускает.`,
			xp: 12
		},
		{
			id: 'pt-d7-t3',
			difficulty: 'star',
			prompt: String.raw`Соберите [[mlp|MLP]] для входа размерности $10$, одного скрытого слоя на $32$ нейрона с [[aktivaciya-relu|ReLU]] и выхода на $3$ класса — двумя способами: классом-наследником [[nn-module|nn.Module]] и через [[nn-sequential|nn.Sequential]]. Сколько у него [[parametr|параметров]] всего?`,
			hint: String.raw`Два [[nn-linear|Linear]]: $(10\to32)$ и $(32\to3)$. Число параметров слоя — $(\text{in}+1)\cdot\text{out}$.`,
			solution: String.raw`Через класс:

**class Net(nn.Module):** → в **__init__**: **self.fc1 = nn.Linear(10, 32)**, **self.act = nn.ReLU()**, **self.fc2 = nn.Linear(32, 3)**; в **forward(x)**: **return self.fc2(self.act(self.fc1(x)))**.

Через контейнер: **nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 3))**.

Параметры: первый слой $(10+1)\cdot32 = 352$, второй $(32+1)\cdot3 = 99$. Активация параметров не добавляет. Итого $352 + 99 = 451$. Проверка в коде — **sum(p.numel() for p in model.parameters())**.`,
			answer: String.raw`$451$ параметр ($352 + 99$).`,
			xp: 25
		}
	],
	mastery: [
		'Наследую nn.Module: объявляю слои в __init__, описываю forward(x)',
		'Знаю, что nn.Linear(in, out) хранит weight (out,in) и bias (out,) и считает y = xW^T + b',
		'Ставлю активацию (ReLU/Sigmoid/Tanh) между линейными слоями и понимаю зачем',
		'Считаю число параметров слоя и сети, вызываю модель через model(x), знаю про nn.Sequential'
	]
};
