import type { Day } from '$lib/types';

// День 13. Конвенции (как в эталоне day01):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.

export const day13: Day = {
	n: 13,
	phaseId: 'data',
	title: 'Инициализация, LR-расписания, клиппинг',
	chapterRef: 'pt-13',
	est: '1–2 ч',
	goal: String.raw`Стабилизировать обучение тремя приёмами: правильной [[he-init|инициализацией весов]], [[scheduler|расписанием]] [[learning-rate|learning rate]] и [[grad-clipping|клиппингом градиентов]]. Понять, откуда берутся [[vanishing-exploding|затухающие и взрывающиеся градиенты]] и как масштаб весов $\sim 1/\sqrt{n}$ их лечит.`,
	sections: [
		{
			kind: 'intuition',
			heading: 'Почему сигнал затухает или взрывается',
			body: String.raw`Глубокая сеть — это цепочка слоёв. На прямом проходе активации проходят через десятки умножений на матрицы весов, на обратном — через столько же умножений на те же матрицы (правило цепочки в [[backprop|backprop]]). Если каждый слой в среднем умножает дисперсию сигнала на коэффициент $k$, то через $L$ слоёв она умножается на $k^L$:

- $k<1$ — сигнал и [[gradient|градиент]] экспоненциально **затухают** ([[vanishing-exploding|vanishing]]): нижние слои почти не учатся;
- $k>1$ — экспоненциально **взрываются** ([[vanishing-exploding|exploding]]): NaN и расходимость.

Вывод [[xavier-init|Xavier]]/[[he-init|He]]: для линейного слоя с $n$ входами дисперсия выхода равна $n\cdot\mathrm{Var}(W)\cdot\mathrm{Var}(x)$. Чтобы $k\approx 1$, нужно $\mathrm{Var}(W)\sim 1/n$, то есть масштаб весов $\sim 1/\sqrt{n}$. Проверим это на numpy: прогоним вход через 10 слоёв при разном масштабе.`,
			code: {
				title: 'Дисперсия активаций через 10 слоёв (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
n = 256                        # ширина каждого слоя
x = np.random.randn(n)         # вход: дисперсия примерно 1
xavier = np.sqrt(1 / n)        # ~0.0625 — «правильный» масштаб весов

for scale, tag in [(0.5 * xavier, "мало -> затухает"),
                   (2.0 * xavier, "велико -> взрыв"),
                   (xavier,       "Xavier 1/sqrt(n)")]:
    a = x.copy()
    line = []
    for _ in range(10):        # прогон через 10 линейных слоёв
        W = np.random.randn(n, n) * scale
        a = W @ a
        line.append(a.var())
    print(f"{tag:18}: " + " ".join(f"{v:8.3g}" for v in line))`,
				explanation: String.raw`Запусти и проследи числа по слоям. При масштабе вдвое меньше нужного дисперсия падает к нулю (затухание), вдвое больше — растёт до $10^6$ (взрыв). Ровно на $1/\sqrt{n}$ она держится около $1$ все 10 слоёв — это и есть цель [[xavier-init|инициализации]]. В реальной сети с [[he-init|ReLU]] нужный масштаб — $\sqrt{2/n}$.`
			}
		},
		{
			kind: 'definition',
			heading: 'Xavier и He: два рецепта масштаба',
			body: String.raw`Оба рецепта берут случайные веса и масштабируют дисперсию под число входов (а Xavier — и выходов), чтобы сигнал не затухал и не взрывался:

- [[xavier-init|Xavier/Glorot]] — для симметричных активаций (tanh, sigmoid): $\mathrm{Var}(W)=\dfrac{2}{n_\text{in}+n_\text{out}}$.
- [[he-init|He/Kaiming]] — для ReLU и её родственников: $\mathrm{Var}(W)=\dfrac{2}{n_\text{in}}$. Лишняя двойка компенсирует то, что ReLU зануляет половину активаций.

Правило выбора простое: **ReLU → He, tanh/sigmoid → Xavier**. По умолчанию слои **nn.Linear** и **nn.Conv2d** в PyTorch инициализируются вариантом Kaiming, но при кастомной архитектуре полезно задавать инициализацию явно через [[nn-init|torch.nn.init]].`,
			code: {
				title: 'Kaiming-инициализация слоёв (torch, открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 256)
        self.fc3 = nn.Linear(256, 10)
        self.apply(self._init)            # обойти все подмодули

    def _init(self, m):
        if isinstance(m, nn.Linear):
            # He-инициализация под ReLU: дисперсия = 2 / n_in
            nn.init.kaiming_normal_(m.weight, nonlinearity='relu')
            nn.init.zeros_(m.bias)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.fc3(x)

model = MLP()
print("std fc1.weight:", model.fc1.weight.std().item())  # ~ sqrt(2/784) = 0.050`,
				explanation: String.raw`**self.apply(fn)** рекурсивно обходит все подмодули и зовёт **fn** на каждом — удобный канон для инициализации. Суффикс `,
			}
		},
		{
			kind: 'connection',
			heading: 'LR-расписания: как менять шаг по ходу',
			body: String.raw`Один [[learning-rate|lr]] на всё обучение — компромисс. Крупный шаг в начале быстро уводит из плохой области, но к концу мешает осесть в минимуме. [[scheduler|Scheduler]] меняет lr со временем:

- [[steplr|StepLR]] — раз в **step_size** эпох умножает lr на **gamma** (ступенчатое затухание);
- [[cosine-annealing|CosineAnnealingLR]] — плавно ведёт lr от стартового к минимуму по косинусу за **T_max** эпох;
- **warmup** — первые сотни шагов lr линейно растёт от почти нуля до базового. Нужен, когда в начале веса ещё «сырые», а большой lr сразу разносит обучение (особенно у трансформеров и при [[adam|Adam]]).

Часто комбинируют: **warmup + cosine**. Посмотрим на форму косинусного расписания живьём на numpy.`,
			code: {
				title: 'Cosine annealing своими руками (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

# Cosine annealing: lr плавно спадает от eta_max к eta_min по косинусу
eta_max, eta_min, T = 0.1, 0.0, 10
for t in range(T + 1):
    lr = eta_min + 0.5 * (eta_max - eta_min) * (1 + np.cos(np.pi * t / T))
    bar = "#" * int(lr / eta_max * 28)
    print(f"эпоха {t:2d}  lr={lr:.4f}  {bar}")`,
				explanation: String.raw`Это в точности формула **CosineAnnealingLR**. lr стартует с **eta_max**, медленно отходит, ускоряется в середине и плавно подходит к **eta_min** — без резких ступеней, как у [[steplr|StepLR]]. Гладкое затухание часто даёт чуть лучшую финальную точность.`
			}
		},
		{
			kind: 'definition',
			heading: 'Клиппинг градиентов',
			body: String.raw`Даже при хорошей инициализации редкий батч может дать огромный [[gradient|градиент]] — один шаг улетает в NaN. [[grad-clipping|Клиппинг по норме]] ограничивает это сверху, не меняя направление:

$$g \leftarrow g\cdot\min\!\left(1,\ \frac{\texttt{max\_norm}}{\lVert g\rVert}\right).$$

Считается **общая** норма по всем параметрам сразу; если она больше порога — все градиенты домножаются на один и тот же коэффициент $<1$. Направление шага сохраняется, обрезается только длина. В PyTorch это [[grad-clipping|torch.nn.utils.clip_grad_norm_]], вызывают её **после backward, но до step**. Особенно важна для RNN/LSTM и трансформеров, где взрывы градиента — норма жизни.`,
			code: {
				title: 'Клиппинг по норме на numpy',
				language: 'python',
				code: String.raw`import numpy as np

# Клиппинг по норме: ровно то, что делает torch.nn.utils.clip_grad_norm_
def clip_grad_norm(grads, max_norm):
    total = np.sqrt(sum((g ** 2).sum() for g in grads))   # общая L2-норма
    if total > max_norm:
        coef = max_norm / (total + 1e-6)
        grads = [g * coef for g in grads]
    return grads, total

np.random.seed(0)
g1 = np.random.randn(3) * 5    # «взорвавшийся» градиент слоя 1
g2 = np.random.randn(2) * 5    # и слоя 2
clipped, before = clip_grad_norm([g1, g2], max_norm=1.0)
after = np.sqrt(sum((g ** 2).sum() for g in clipped))
print(f"норма до клиппинга:    {before:.3f}")
print(f"норма после клиппинга: {after:.3f}  (обрезана до 1.0)")
print(f"все компоненты ужаты одинаково: {(clipped[0] / g1).round(4)}")`,
				explanation: String.raw`Норма $\approx 17.8$ сжимается ровно до $1.0$, и каждая компонента обоих градиентов домножается на **один и тот же** коэффициент — направление шага не искажается. Это поведение **clip_grad_norm_** один в один.`
			}
		},
		{
			kind: 'note',
			heading: 'Полный цикл: куда вставить scheduler и клиппинг',
			body: String.raw`Порядок операций в цикле обучения фиксирован, и в нём легко ошибиться:

1. [[zero-grad|optimizer.zero_grad()]] — обнулить градиенты;
2. [[forward|forward]] → [[loss-fn|loss]];
3. [[backward|loss.backward()]] — посчитать градиенты;
4. **clip_grad_norm_** — обрезать норму (после backward, до step);
5. [[optimizer|optimizer.step()]] — шаг;
6. **scheduler.step()** — обновить lr.

Главный подвох — [[scheduler|scheduler.step()]] зовут **после** optimizer.step() и обычно **раз в эпоху**, а не на каждом батче (исключение — расписания на основе шагов вроде OneCycle/warmup, где step делают на каждой итерации). Перепутаешь порядок — получишь сдвинутое на шаг расписание или предупреждение PyTorch.`,
			code: {
				title: 'He-init + CosineAnnealingLR + клиппинг в цикле (torch, Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import torch.nn as nn

model = nn.Sequential(nn.Linear(64, 128), nn.ReLU(), nn.Linear(128, 10))
for m in model:                                   # He-инициализация линейных слоёв
    if isinstance(m, nn.Linear):
        nn.init.kaiming_normal_(m.weight, nonlinearity='relu')
        nn.init.zeros_(m.bias)

opt = torch.optim.SGD(model.parameters(), lr=0.1, momentum=0.9)
sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=20)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(20):
    for x, y in loader:                           # loader из дня про DataLoader
        opt.zero_grad()
        loss = loss_fn(model(x), y)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        opt.step()
    sched.step()                                  # раз в эпоху, после step()
    print(f"epoch {epoch:2d}  lr={sched.get_last_lr()[0]:.5f}")`,
				explanation: String.raw`Собрано всё вместе: [[he-init|He-инициализация]] до обучения, [[grad-clipping|клиппинг]] между backward и step, [[cosine-annealing|CosineAnnealingLR]] с **sched.step()** раз в эпоху. **sched.get_last_lr()** печатает текущий lr — увидишь косинусное затухание от $0.1$ к $0$.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d13-t1',
			difficulty: 'base',
			prompt: String.raw`Почему масштаб начальных весов привязывают к числу входов $n$, а не берут фиксированную $\mathrm{Var}(W)=1$ для всех слоёв? Что произойдёт с дисперсией активаций в глубокой сети при $\mathrm{Var}(W)=1$?`,
			hint: String.raw`Дисперсия выхода линейного слоя $\approx n\cdot\mathrm{Var}(W)\cdot\mathrm{Var}(x)$. Подставь $\mathrm{Var}(W)=1$ и большое $n$.`,
			solution: String.raw`Выход слоя суммирует $n$ слагаемых, поэтому $\mathrm{Var}(\text{выход})\approx n\cdot\mathrm{Var}(W)\cdot\mathrm{Var}(\text{вход})$. При $\mathrm{Var}(W)=1$ коэффициент на слой равен $n$ (десятки-тысячи) — дисперсия умножается на $n$ каждый слой и за несколько слоёв **взрывается** ($n^L$), градиенты — тоже. Чтобы коэффициент был $\approx 1$ независимо от ширины, нужно $\mathrm{Var}(W)\sim 1/n$, то есть масштаб $\sim 1/\sqrt{n}$ ([[xavier-init|Xavier]] $2/(n_\text{in}+n_\text{out})$, [[he-init|He]] $2/n_\text{in}$ под ReLU).`,
			answer: String.raw`Иначе дисперсия множится на $n$ каждый слой и взрывается; масштаб $1/\sqrt{n}$ держит коэффициент $\approx 1$.`,
			xp: 12
		},
		{
			id: 'pt-d13-t2',
			difficulty: 'base',
			prompt: String.raw`Что делает **torch.nn.utils.clip_grad_norm_(params, max_norm=1.0)**: обрезает каждый отдельный градиент или их совокупность? Меняет ли клиппинг **направление** шага? В какой момент цикла обучения его вызывают?`,
			hint: String.raw`Смотри на формулу $g\leftarrow g\cdot\min(1,\ \texttt{max\_norm}/\lVert g\rVert)$ и numpy-демо: один коэффициент на все градиенты.`,
			solution: String.raw`Считается **общая** L2-норма по всем параметрам сразу. Если она $>$ **max_norm**, все градиенты домножаются на один общий коэффициент $\texttt{max\_norm}/\lVert g\rVert<1$; если $\le$ — ничего не меняется. Поскольку множитель один для всех компонент, **направление** градиента (а значит, и шага) сохраняется — обрезается только длина. Вызывают **после** [[backward|loss.backward()]] и **до** [[optimizer|optimizer.step()]].`,
			answer: String.raw`Обрезает совокупную норму одним множителем; направление не меняет; между backward и step.`,
			xp: 12
		},
		{
			id: 'pt-d13-t3',
			difficulty: 'star',
			prompt: String.raw`Зачем нужен **warmup** (первые шаги lr линейно растёт от почти нуля), если веса уже инициализированы [[he-init|He]]? Приведите ситуацию, где без warmup обучение с [[adam|Adam]] срывается в первые итерации, и объясните, что именно идёт не так.`,
			hint: String.raw`Adam делит шаг на оценку дисперсии градиента, которая на первых батчах посчитана по 1–2 точкам и потому шумна. Подумай, насколько надёжна статистика в начале.`,
			solution: String.raw`Хорошая инициализация задаёт правильный масштаб активаций, но **не** делает раннюю оценку градиента надёжной. У [[adam|Adam]] шаг $\approx \eta\cdot \hat m/\sqrt{\hat v}$, где $\hat m,\hat v$ — скользящие средние градиента и его квадрата. На первых итерациях они оценены по 1–2 батчам и очень шумны: маленькая случайная $\hat v$ даёт огромный эффективный шаг, который мгновенно уводит сырые веса в плохую область (loss → NaN). Это типично для трансформеров и больших lr. **Warmup** держит lr почти нулевым, пока $\hat m,\hat v$ накопят достаточно статистики, и лишь потом выводит lr на базовый уровень. После warmup обычно подключают затухание ([[cosine-annealing|cosine]]).`,
			answer: String.raw`Init задаёт масштаб весов, но не статистику градиента; ранние шумные моменты Adam дают гигантский шаг и NaN — warmup ждёт, пока моменты устаканятся.`,
			xp: 25
		}
	],
	mastery: [
		'Объясняю затухание/взрыв градиентов через коэффициент дисперсии на слой и масштаб весов 1/sqrt(n)',
		'Выбираю Xavier для tanh/sigmoid и He для ReLU и задаю их через torch.nn.init',
		'Подключаю StepLR/CosineAnnealingLR и зову scheduler.step() в правильном месте (после step, раз в эпоху)',
		'Вставляю clip_grad_norm_ между backward и step и понимаю, что он обрезает совокупную норму, не меняя направление'
	]
};
