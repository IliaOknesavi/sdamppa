import type { Day } from '$lib/types';

// День 9. Конвенции (как в day01.ts):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.
//  • Термины [[id]] / [[id|подпись]] — из базового глоссария или day09.terms.ts.

export const day09: Day = {
	n: 9,
	phaseId: 'nn',
	title: 'Полный цикл обучения',
	chapterRef: 'pt-09',
	est: '1–2 ч',
	goal: String.raw`Собрать классический [[training-loop|тренировочный цикл]] и обучить классификатор: проход по [[epoch|эпохам]] и [[batch|батчам]], на каждом шаге [[zero-grad|zero_grad]] → [[forward|forward]] → [[loss-fn|loss]] → [[backward|backward]] → [[optimizer|step]], с логами [[item-logirovanie|потери]] и [[accuracy-metrika|точности]].`,
	sections: [
		{
			kind: 'definition',
			heading: 'Скелет тренировочного цикла',
			body: String.raw`Обучение нейросети — это два вложенных цикла. Внешний идёт по [[epoch|эпохам]] (полный проход по данным), внутренний — по [[batch|батчам]], которые выдаёт [[dataloader|DataLoader]]. На каждом батче выполняется ровно один [[gradient-spusk|шаг спуска]], и порядок пяти действий в нём священен:

1. **optimizer.zero_grad()** — обнулить градиенты с прошлого шага ([[backward|они накапливаются]]);
2. **out = model(xb)** — [[forward|прямой проход]], логиты предсказаний;
3. **loss = loss_fn(out, yb)** — скаляр ошибки;
4. **loss.backward()** — [[backprop|обратный проход]], заполняет **.grad** у [[parametr|параметров]];
5. **optimizer.step()** — сдвиг весов в минус-градиент.

Этот пятишаговый [[training-loop|цикл]] одинаков для любой модели — от логистической регрессии до трансформера. Меняются только слои, [[loss-fn|функция потерь]] и данные.`
		},
		{
			kind: 'intuition',
			heading: 'Логи: аккумулируем loss через .item()',
			body: String.raw`Хочется в конце эпохи знать средний loss и [[accuracy-metrika|точность]]. Наивно завести **total = 0** и писать **total += loss** — и это коварная утечка: **loss** это [[tenzor|тензор]], прицепленный к [[vychislitelnyy-graf|вычислительному графу]]. Складывая тензоры за всю эпоху, ты держишь в памяти сотни графов и рано или поздно получаешь нехватку памяти.

Правильно — [[item-logirovanie|логировать числа]], а не тензоры: **total += loss.item()**. Метод [[item-skalyar|.item()]] достаёт из тензора-скаляра обычный Python-float, *отрывая* его от графа. То же касается счётчика верных ответов — копи **int**, а не тензоры.

Демо ниже на numpy обучает [[softmax|softmax]]-классификатор (логистическую регрессию) на двух «облаках» точек и печатает loss и accuracy по эпохам — тот же цикл, что и в torch, только руками.`,
			code: {
				title: 'Тренировочный цикл вживую: softmax-классификатор (numpy)',
				language: 'python',
				code: String.raw`import numpy as np
np.random.seed(0)

# два «облака» точек двух классов в 2D — синтетика
X = np.vstack([np.random.randn(40, 2) + [-2, 0],
               np.random.randn(40, 2) + [ 2, 0]])
y = np.array([0]*40 + [1]*40)
W = np.zeros((2, 2)); b = np.zeros(2)         # логиты = X@W + b

def softmax(z):
    z = z - z.max(axis=1, keepdims=True)
    e = np.exp(z); return e / e.sum(axis=1, keepdims=True)

for epoch in range(1, 31):
    P = softmax(X @ W + b)                     # forward -> вероятности
    Y = np.eye(2)[y]                           # one-hot истины
    loss = -np.mean(np.sum(Y * np.log(P + 1e-9), axis=1))
    g = (P - Y) / len(X)                       # градиент кросс-энтропии
    W -= 0.5 * (X.T @ g); b -= 0.5 * g.sum(0)  # шаг спуска
    acc = (P.argmax(1) == y).mean()            # accuracy по argmax
    if epoch % 10 == 0:
        print(f"epoch {epoch:2d}  loss={loss:.3f}  acc={acc:.2f}")`,
				explanation: String.raw`Запусти — увидишь, как loss падает, а [[accuracy-metrika|accuracy]] растёт к $1.0$. Здесь **W -= 0.5 * (X.T @ g)** играет роль [[optimizer|optimizer.step()]], а формула **g = (P - Y)** — это градиент [[cross-entropy|кросс-энтропии]] после [[softmax|softmax]], который в torch найдёт [[autograd|autograd]] сам. Логируем числа (**loss**, **acc**) — никаких графов в памяти.`
			}
		},
		{
			kind: 'definition',
			heading: 'Accuracy: считаем по argmax',
			body: String.raw`[[loss-fn|Потеря]] — это то, что *минимизируют*, но человеку понятнее [[accuracy-metrika|доля верных ответов]]. Модель выдаёт логиты формы $(N, C)$ — по строке на пример, по столбцу на класс. Предсказанный класс — это **argmax по последней оси**: индекс самого «уверенного» столбца.

Дальше сравниваем с истинными метками **yb** формы $(N,)$ и усредняем совпадения:

$$\text{accuracy} = \frac{1}{N}\sum_{i=1}^{N} \mathbb{1}[\hat y_i = y_i].$$

В PyTorch это одна строка: **(out.argmax(1) == yb).float().mean()**. Тонкость — **.float()**: сравнение даёт булев тензор, а усреднять булевы нельзя, нужно сперва привести к [[dtype|float]]. По батчам копят либо сумму верных, либо среднее с весом размера батча.`,
			code: {
				title: 'Accuracy через argmax и аккумулирование по батчам (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

# логиты модели для 6 примеров, 3 класса -> предсказание = argmax по строке
logits = np.array([[2.0, 0.1, -1.0],
                   [0.3, 1.5,  0.2],
                   [0.0, 0.2,  3.0],
                   [1.0, 0.9,  0.1],
                   [2.1, 0.0, -0.5],
                   [0.1, 0.1,  0.0]])
truth = np.array([0, 1, 2, 1, 0, 2])

pred = logits.argmax(axis=1)               # как out.argmax(1) в torch
correct = (pred == truth)                  # булева маска
acc = correct.mean()                       # .float().mean() в torch
print("pred :", pred)
print("verno:", correct.astype(int), f"-> acc = {acc:.3f}")

# аккумулируем по «батчам»: копим ЧИСЛА, не тензоры
total_correct, total_seen = 0, 0
for s in range(0, len(truth), 2):          # батчи по 2
    b_pred, b_true = pred[s:s+2], truth[s:s+2]
    total_correct += int((b_pred == b_true).sum())
    total_seen    += len(b_true)
print(f"эпоха: {total_correct}/{total_seen} = {total_correct/total_seen:.3f}")`,
				explanation: String.raw`**argmax(axis=1)** превращает логиты в предсказанные классы, **(pred == truth)** даёт совпадения, среднее — это [[accuracy-metrika|accuracy]]. Во втором блоке — как в реальном цикле: копим **int** верных и число просмотренных примеров, а в конце делим. Точно так же копят и [[item-logirovanie|loss.item()]].`
			}
		},
		{
			kind: 'note',
			heading: 'Перенос данных на device',
			body: String.raw`Модель и батч обязаны жить на одном [[device|устройстве]]. Модель переносят один раз — **model.to(device)** — а вот батчи приходят с CPU из [[dataloader|DataLoader]], поэтому [[perenos-na-device|внутри цикла каждый батч переносят]] на лету:

\`\`\`
xb, yb = xb.to(device), yb.to(device)
\`\`\`

Забыл — получишь **RuntimeError: expected all tensors on the same device**. Канон: один раз в начале скрипта вычислить **device = 'cuda' if torch.cuda.is_available() else 'cpu'**, отправить туда модель, и первой строкой тела батч-цикла переносить **xb**, **yb**. Метки для [[cross-entropy|CrossEntropyLoss]] должны быть [[dtype|int64]] (long) — DataLoader обычно отдаёт их такими сам.`
		},
		{
			kind: 'connection',
			heading: 'Настоящий цикл на PyTorch',
			body: String.raw`Собираем всё вместе. Снаружи — [[epoch|эпохи]], внутри — батчи; на каждом батче [[perenos-na-device|перенос на device]], затем священная пятёрка [[training-loop|шагов]]. После обучения — отдельный проход в [[train-eval|режиме eval]] под [[autograd|torch.no_grad()]] для честной [[accuracy-metrika|accuracy]] без построения графа.

Этот код — настоящий PyTorch, в браузере он не запустится. Открой в Colab кнопкой ниже.`,
			code: {
				title: 'Полный training loop (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
from torch import nn

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = nn.Sequential(nn.Linear(20, 64), nn.ReLU(), nn.Linear(64, 3)).to(device)
loss_fn = nn.CrossEntropyLoss()
opt = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(1, 11):
    model.train()                              # режим обучения (dropout/BN)
    run_loss, run_correct, n = 0.0, 0, 0
    for xb, yb in train_loader:                # батчи из DataLoader
        xb, yb = xb.to(device), yb.to(device)  # перенос батча на device
        opt.zero_grad()                        # 1) обнулить градиенты
        out = model(xb)                        # 2) forward -> логиты
        loss = loss_fn(out, yb)                # 3) скаляр ошибки
        loss.backward()                        # 4) backprop -> .grad
        opt.step()                             # 5) шаг оптимизатора
        run_loss    += loss.item() * len(yb)   # копим ЧИСЛО, не тензор
        run_correct += (out.argmax(1) == yb).sum().item()
        n           += len(yb)
    print(f"epoch {epoch:2d}  loss={run_loss/n:.3f}  acc={run_correct/n:.3f}")

# честная оценка: eval + no_grad
model.eval()
correct = 0
with torch.no_grad():
    for xb, yb in val_loader:
        xb, yb = xb.to(device), yb.to(device)
        pred = model(xb).argmax(1)
        correct += (pred == yb).sum().item()
print("val acc:", correct / len(val_loader.dataset))`,
				explanation: String.raw`Сравни с numpy-демо: структура та же, но [[backward|loss.backward()]] и [[optimizer|opt.step()]] делают за тебя градиенты и шаг. Три частые ошибки прячутся именно здесь: забыл [[zero-grad|zero_grad()]] — градиенты сложатся; забыл [[train-eval|model.eval()]] — [[dropout|dropout]]/[[batchnorm|BatchNorm]] исказят валидацию; забыл [[autograd|torch.no_grad()]] — зря построишь граф и съешь память.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d9-t1',
			difficulty: 'base',
			prompt: String.raw`Внутри батч-цикла перемешали шаги. Расставьте их в правильном порядке и объясните, почему именно так:

- **a)** **loss.backward()**
- **b)** **out = model(xb)**
- **c)** **optimizer.step()**
- **d)** **optimizer.zero_grad()**
- **e)** **loss = loss_fn(out, yb)**`,
			hint: String.raw`Сначала обнули старые градиенты, потом посчитай предсказание и ошибку, потом градиенты, и только в конце шагни. Нельзя шагать раньше, чем посчитан градиент.`,
			solution: String.raw`Порядок: **d → b → e → a → c**.

1. **d) zero_grad()** — обнуляем градиенты прошлого шага, иначе [[backward|они накопятся]];
2. **b) forward** — считаем логиты **out**;
3. **e) loss** — превращаем предсказание и метки в скаляр;
4. **a) backward** — по [[vychislitelnyy-graf|графу]] считаем **.grad** для всех [[parametr|параметров]];
5. **c) step** — двигаем веса по уже посчитанным градиентам.

Ключевое ограничение: **step** требует заполненных **.grad**, поэтому идёт строго после **backward**; а **zero_grad** — строго до **backward**, иначе градиенты батчей сложатся.`,
			answer: String.raw`**d → b → e → a → c** (zero_grad → forward → loss → backward → step).`,
			xp: 12
		},
		{
			id: 'pt-d9-t2',
			difficulty: 'base',
			prompt: String.raw`Почему для накопления потери за эпоху пишут **total += loss.item()**, а не **total += loss**? Что плохого в втором варианте?`,
			hint: String.raw`Подумайте, что такое **loss** как объект и к чему он прицеплен после [[forward|forward]].`,
			solution: String.raw`**loss** — это [[tenzor|тензор]]-скаляр, связанный с [[vychislitelnyy-graf|вычислительным графом]] всего прохода. Если писать **total += loss**, то:

- **total** становится тензором, и в нём накапливается ссылка на граф *каждого* батча — графы не освобождаются, память течёт и эпоха падает с OOM;
- ты тащишь ненужные [[autograd|autograd]]-вычисления там, где нужно просто число для лога.

[[item-skalyar|.item()]] достаёт обычный Python-float, [[item-logirovanie|оторванный от графа]] — складывать такие числа безопасно и дёшево. (Альтернатива — **loss.detach()**, но для скаляра-лога **.item()** удобнее.)`,
			answer: String.raw`**loss** — тензор с графом; суммируя их, держишь все графы в памяти (утечка). **.item()** даёт чистый float.`,
			xp: 12
		},
		{
			id: 'pt-d9-t3',
			difficulty: 'star',
			prompt: String.raw`Логиты модели **out** имеют форму $(N, C)$, метки **yb** — форму $(N,)$ с целыми классами. Напишите выражение для [[accuracy-metrika|accuracy]] по этому батчу и объясните каждую часть: зачем **argmax(1)**, зачем **.float()**, что вернёт **.mean()**. Что изменится, если перепутать ось и взять **argmax(0)**?`,
			hint: String.raw`Предсказанный класс — индекс максимального логита *в строке*. Сравнение даёт булев тензор; усреднять булевы напрямую нельзя.`,
			solution: String.raw`Выражение: **(out.argmax(1) == yb).float().mean()**.

- **argmax(1)** берёт индекс максимума *по оси классов* (ось 1) — получаем предсказанный класс для каждого из $N$ примеров, форма $(N,)$;
- **== yb** сравнивает с истиной поэлементно → булев тензор из True/False, форма $(N,)$;
- **.float()** приводит True/1.0, False/0.0 — иначе усреднение булева тензора некорректно;
- **.mean()** усредняет нули и единицы, то есть возвращает долю верных — $\frac1N\sum_i \mathbb{1}[\hat y_i = y_i]$.

Если взять **argmax(0)**, максимум ищется *по оси примеров* (по столбцам): получится $C$ индексов «какой пример самый уверенный в каждом классе» — бессмыслица для accuracy, формы перестанут совпадать с **yb** $(N,)$, и сравнение либо упадёт, либо [[broadcasting|сломается молча]].`,
			answer: String.raw`**(out.argmax(1) == yb).float().mean()**; argmax(1) — класс по строке, .float() — чтобы усреднить булевы, .mean() — доля верных. **argmax(0)** даёт неверную ось и ломает формы.`,
			xp: 25
		}
	],
	mastery: [
		'Пишу тренировочный цикл по эпохам и батчам в порядке zero_grad → forward → loss → backward → step',
		'Аккумулирую loss и число верных через .item(), не держа графы в памяти',
		'Считаю accuracy через (out.argmax(1) == yb).float().mean()',
		'Переношу батчи на device и переключаю train/eval с torch.no_grad() на валидации'
	]
};
