import type { Day } from '$lib/types';

// День 11. Конвенции — как в day01: все строки String.raw, инлайн-код **жирным**,
// математика $...$, термины [[id]]. Живой numpy-код language:'python' (Pyodide),
// настоящий torch — language:'text', colab:true.

export const day11: Day = {
	n: 11,
	phaseId: 'data',
	title: 'Валидация, train/eval и метрики',
	chapterRef: 'pt-11',
	est: '1–2 ч',
	goal: String.raw`Научиться честно мерить качество: бить данные на [[train-val-test|train/val/test]], переключать [[train-eval|режимы train()/eval()]], оборачивать валидацию в [[no-grad-validaciya|no_grad]], читать [[accuracy-precision-recall|метрики]] и [[krivye-obucheniya|кривые обучения]], чтобы вовремя поймать [[overfitting|переобучение]] и сделать [[rannyaya-ostanovka|раннюю остановку]].`,
	sections: [
		{
			kind: 'definition',
			heading: 'Три выборки: train, val, test',
			body: String.raw`Качество модели меряют **не** на тех данных, на которых учили — иначе измеряешь память, а не обобщение. Поэтому данные делят на три непересекающиеся части:

- **train** — на ней крутится [[gradient-spusk|градиентный спуск]], модель видит её каждую [[epoch|эпоху]];
- **val** (валидация) — на ней *выбирают* гиперпараметры, момент [[rannyaya-ostanovka|остановки]], архитектуру; модель не учится на ней, но ты подстраиваешься под неё;
- **test** — трогаешь **один раз** в самом конце, чтобы получить честную оценку.

Типичные доли — $70/15/15$ или $80/10/10$. В PyTorch случайное разбиение делает [[random-split|random_split]]. Ключевое правило: примеры из val/test **никогда** не должны протекать в train ([[utechka-dannyh|утечка данных]]).`,
			code: {
				title: 'Разбиение train/val и accuracy на обеих частях (numpy)',
				language: 'python',
				code: String.raw`import numpy as np
np.random.seed(0)

# n объектов, 1 признак; метка = знак(x) с небольшим шумом
n = 200
x = np.random.randn(n)
y = (x + 0.3 * np.random.randn(n) > 0).astype(int)

# перемешали индексы и разрезали 70/30 на train/val
idx = np.random.permutation(n)
cut = int(0.7 * n)
tr, va = idx[:cut], idx[cut:]

# простейший классификатор: порог 0 по x
predict = lambda xs: (xs > 0).astype(int)
acc = lambda i: (predict(x[i]) == y[i]).mean()

print(f"train: {len(tr)}  val: {len(va)}")
print(f"accuracy train = {acc(tr):.3f}")
print(f"accuracy val   = {acc(va):.3f}")`,
				explanation: String.raw`Сначала **перемешиваем** индексы, потом режем — иначе в val попадёт «хвост» датасета (часто отсортированный по классу). [[accuracy-precision-recall|Accuracy]] считаем отдельно на каждом срезе: близкие значения train и val — добрый знак, большой разрыв — сигнал [[overfitting|переобучения]]. В torch ту же нарезку делает [[random-split|random_split]].`
			}
		},
		{
			kind: 'definition',
			heading: 'Режимы train() и eval()',
			body: String.raw`Некоторые слои ведут себя **по-разному** при обучении и проверке — и это не косметика:

- [[dropout|Dropout]] на обучении случайно зануляет активации, на инференсе должен пропускать всё;
- [[batchnorm|BatchNorm]] на train считает среднее/дисперсию **по текущему батчу**, а на eval использует накопленную за обучение статистику.

Поэтому перед валидацией обязателен **model.eval()**, а перед обучением — **model.train()**. Забыть **eval()** — классический баг: метрики на валидации «плавают» от батча к батчу, потому что dropout всё ещё рубит нейроны, а BatchNorm нормирует по маленькому val-батчу. Это переключение [[rezhim-eval-vs-no-grad|меняет поведение слоёв]], но **не** отключает градиенты — за это отвечает отдельная вещь.`
		},
		{
			kind: 'intuition',
			heading: 'no_grad на валидации',
			body: String.raw`Во время forward PyTorch строит [[vychislitelnyy-graf|вычислительный граф]], чтобы потом сделать [[backward|.backward()]]. Но на валидации backward не нужен — мы только смотрим предсказания. Граф в этом случае — чистый расход: он держит в памяти промежуточные активации каждого слоя.

Обёртка **with torch.no_grad():** говорит autograd «не записывай историю». Эффект:

- **память** — не хранятся активации для обратного прохода (часто это бо́льшая часть памяти при инференсе), поэтому на валидации можно поставить батч крупнее;
- **скорость** — нет накладных расходов на построение графа.

**eval()** и **no_grad** решают **разные** задачи и нужны **оба**: [[rezhim-eval-vs-no-grad|eval меняет слои, no_grad выключает граф]]. Перепутать их — частая ошибка.`
		},
		{
			kind: 'connection',
			heading: 'Метрики: accuracy, precision, recall',
			body: String.raw`[[loss-fn|Потеря]] нужна оптимизатору, но человеку понятнее **метрики**. Простейшая — [[accuracy-precision-recall|accuracy]] (доля верных ответов). Она обманчива при **дисбалансе**: если $99\%$ объектов класса «0», модель-«всегда 0» даёт $99\%$ accuracy, не поймав ни одного «1».

Тогда смотрят на пару из таблицы ошибок (TP, FP, FN):

$$\text{precision}=\frac{TP}{TP+FP},\qquad \text{recall}=\frac{TP}{TP+FN}.$$

**Precision** — «из тех, кого назвали положительными, сколько и правда такие» (цена ложной тревоги). **Recall** — «из всех настоящих положительных сколько мы нашли» (цена пропуска). Их компромисс сводят в $F_1$ — гармоническое среднее. Метрики считают на **val/test**, не на train.`,
			code: {
				title: 'Accuracy, precision, recall из таблицы ошибок (numpy)',
				language: 'python',
				code: String.raw`import numpy as np
np.random.seed(0)

# истина и предсказания (1 = положительный класс)
y_true = np.array([0, 1, 1, 0, 1, 1, 0, 1, 0, 0])
y_pred = np.array([0, 1, 0, 0, 1, 1, 1, 1, 0, 0])

tp = int(np.sum((y_pred == 1) & (y_true == 1)))
fp = int(np.sum((y_pred == 1) & (y_true == 0)))
fn = int(np.sum((y_pred == 0) & (y_true == 1)))

accuracy  = np.mean(y_pred == y_true)
precision = tp / (tp + fp)
recall    = tp / (tp + fn)

print(f"TP={tp} FP={fp} FN={fn}")
print(f"accuracy  = {accuracy:.2f}")
print(f"precision = {precision:.2f}  (из названных '1' верны)")
print(f"recall    = {recall:.2f}  (из настоящих '1' найдены)")`,
				explanation: String.raw`Одна ошибка типа FP роняет **precision**, одна FN — **recall**: они ловят разные виды промахов, поэтому смотрят обе. Accuracy усредняет всё в одно число и прячет дисбаланс. Тот же расчёт в реальном проекте обычно берут из **torchmetrics** или **sklearn.metrics**, но арифметика ровно эта.`
			}
		},
		{
			kind: 'note',
			heading: 'Кривые обучения и ранняя остановка',
			body: String.raw`Главный инструмент диагностики — [[krivye-obucheniya|кривые обучения]]: график train-loss и val-loss по [[epoch|эпохам]]. Читается так:

- обе падают и держатся рядом — учимся нормально;
- train-loss падает, а val-loss **развернулся вверх** — начался [[overfitting|переобучение]]: модель запоминает шум train;
- обе высокие и не падают — недообучение (мало ёмкости/эпох/слишком малый [[learning-rate|lr]]).

[[rannyaya-ostanovka|Ранняя остановка]] автоматизирует вывод: следим за val-loss, запоминаем лучшее значение и веса, и если он не улучшается **patience** эпох подряд — останавливаемся и возвращаем лучший чекпойнт. Так берём модель из точки минимума val-loss, ещё до разворота.`,
			code: {
				title: 'Переобучение: train-MSE падает, val-MSE растёт (numpy)',
				language: 'python',
				code: String.raw`import numpy as np
np.random.seed(0)

# истинная зависимость почти линейна; данные шумные
xs = np.linspace(-1, 1, 12)
ys = xs + 0.4 * np.random.randn(12)
tr, va = xs[::2], xs[1::2]      # чётные — train, нечётные — val
ytr, yva = ys[::2], ys[1::2]

def mse(p, x, y):
    return np.mean((np.polyval(p, x) - y) ** 2)

print("степень | train MSE |  val MSE")
for deg in (1, 3, 5):
    p = np.polyfit(tr, ytr, deg)   # подгонка по train
    print(f"   {deg}    |   {mse(p, tr, ytr):.3f}   |  {mse(p, va, yva):.3f}")`,
				explanation: String.raw`Степень многочлена — аналог «ёмкости» сети. С её ростом train-MSE падает до **0.000** (модель идеально прошла через свои точки), а val-MSE растёт — это и есть [[overfitting|переобучение]] в чистом виде. Минимум **val**-ошибки (а не train) указывает на лучшую сложность — ровно туда целится [[rannyaya-ostanovka|ранняя остановка]].`
			}
		},
		{
			kind: 'derivation',
			heading: 'Честный цикл валидации на PyTorch',
			body: String.raw`Сложим всё в идиоматичный шаблон: функция обучения на одну эпоху, функция оценки в режиме [[train-eval|eval]] + [[no-grad-validaciya|no_grad]], и внешний цикл, который ведёт лучший val-loss и делает [[rannyaya-ostanovka|раннюю остановку]] по **patience**.`,
			code: {
				title: 'train_one_epoch + evaluate + ранняя остановка (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
from torch.utils.data import random_split, DataLoader

# 1) делим датасет: 80% train, 20% val (фиксируем seed для воспроизводимости)
n_val = int(0.2 * len(dataset))
n_train = len(dataset) - n_val
g = torch.Generator().manual_seed(0)
train_ds, val_ds = random_split(dataset, [n_train, n_val], generator=g)
train_dl = DataLoader(train_ds, batch_size=64, shuffle=True)
val_dl   = DataLoader(val_ds,   batch_size=256)            # на val батч крупнее

def train_one_epoch(model, dl, loss_fn, optimizer, device):
    model.train()                                          # dropout/BN — режим обучения
    total = 0.0
    for xb, yb in dl:
        xb, yb = xb.to(device), yb.to(device)
        optimizer.zero_grad()
        loss = loss_fn(model(xb), yb)
        loss.backward()
        optimizer.step()
        total += loss.item() * xb.size(0)
    return total / len(dl.dataset)

@torch.no_grad()                                           # граф не строим — память/скорость
def evaluate(model, dl, loss_fn, device):
    model.eval()                                           # dropout off, BN — накопленная статистика
    total, correct, seen = 0.0, 0, 0
    for xb, yb in dl:
        xb, yb = xb.to(device), yb.to(device)
        logits = model(xb)
        total += loss_fn(logits, yb).item() * xb.size(0)
        correct += (logits.argmax(1) == yb).sum().item()
        seen += xb.size(0)
    return total / seen, correct / seen                    # val-loss, accuracy

best_val, best_state, patience, wait = float("inf"), None, 5, 0
for epoch in range(100):
    tr_loss = train_one_epoch(model, train_dl, loss_fn, optimizer, device)
    val_loss, val_acc = evaluate(model, val_dl, loss_fn, device)
    print(f"epoch {epoch:3d} | train {tr_loss:.4f} | val {val_loss:.4f} | acc {val_acc:.3f}")
    if val_loss < best_val:                                # улучшение — запоминаем веса
        best_val, best_state, wait = val_loss, model.state_dict(), 0
    else:
        wait += 1
        if wait >= patience:                               # patience эпох без прогресса — стоп
            print(f"early stop на эпохе {epoch}")
            break
model.load_state_dict(best_state)                          # возвращаем лучший чекпойнт`,
				explanation: String.raw`Три приёма работают вместе: **model.train()/eval()** правильно настраивает [[dropout|dropout]] и [[batchnorm|BN]]; **@torch.no_grad()** на **evaluate** убирает построение [[vychislitelnyy-graf|графа]]; внешний цикл копит **best_state** по минимуму [[krivye-obucheniya|val-loss]] и останавливается, не дождавшись разворота. В конце грузим лучший [[state-dict|state_dict]] — а не последний, уже переобученный.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d11-t1',
			difficulty: 'base',
			prompt: String.raw`Зачем перед прогоном по валидации вызывать **model.eval()**? Что конкретно сломается, если этого не сделать, в сети с [[dropout|Dropout]] и [[batchnorm|BatchNorm]]?`,
			hint: String.raw`Подумай, как каждый из этих двух слоёв ведёт себя на train и на eval по отдельности.`,
			solution: String.raw`**model.eval()** переключает слои с обучающего поведения на инференсное. Без него: [[dropout|Dropout]] продолжит **случайно зануляять** активации — предсказания станут шумными и невоспроизводимыми, метрики «поплывут» от запуска к запуску. [[batchnorm|BatchNorm]] вместо накопленной за обучение статистики начнёт нормировать **по текущему val-батчу** — оценка исказится и будет зависеть от размера батча. Итог: измеренное качество окажется заниженным и нестабильным. Канон: **model.eval()** перед валидацией, **model.train()** перед обучением.`,
			answer: String.raw`eval() выключает dropout и переводит BN на накопленную статистику; иначе метрики шумные и заниженные.`,
			xp: 12
		},
		{
			id: 'pt-d11-t2',
			difficulty: 'base',
			prompt: String.raw`Почему валидацию оборачивают в **with torch.no_grad():** (или вешают **@torch.no_grad()**)? Какой ресурс это в первую очередь экономит и почему? Заменяет ли это **model.eval()**?`,
			hint: String.raw`Что PyTorch хранит во время forward, если граф включён, и нужно ли это для backward, которого на валидации нет?`,
			solution: String.raw`Под **no_grad** autograd не строит [[vychislitelnyy-graf|вычислительный граф]] и не сохраняет промежуточные активации, нужные только для [[backward|обратного прохода]]. На валидации backward не делают, поэтому граф — лишний расход: в первую очередь экономится **память** (активации часто занимают её бо́льшую часть), а заодно немного **времени** на построение графа. За счёт освободившейся памяти на val можно брать батч крупнее. Это **не** заменяет **eval()**: no_grad выключает только градиенты/граф, а поведение [[dropout|dropout]] и [[batchnorm|BN]] переключает именно **eval()**. Нужны оба.`,
			answer: String.raw`no_grad не строит граф → экономит память (и чуть времени); eval() он не заменяет — нужны оба.`,
			xp: 12
		},
		{
			id: 'pt-d11-t3',
			difficulty: 'star',
			prompt: String.raw`По эпохам train-loss монотонно падает, а val-loss сначала падал, а с эпохи $20$ устойчиво растёт. (а) Как называется этот режим и что происходит с моделью? (б) В какой момент следовало остановиться и какие веса сохранить? (в) Опиши логику [[rannyaya-ostanovka|ранней остановки]] с параметром **patience**, и почему ориентир — **val**-loss, а не train-loss.`,
			hint: String.raw`Расхождение train и val — это [[overfitting|переобучение]]. Лучшая модель — в точке минимума той кривой, что отражает обобщение.`,
			solution: String.raw`(а) Это [[overfitting|переобучение]]: после ~эпохи $20$ модель перестаёт обобщать и начинает **запоминать шум** train — её ошибка на train ещё падает, а на невиданных данных (val) растёт. (б) Останавливаться надо в точке **минимума val-loss** (около эпохи $20$) и сохранить веса именно оттуда, а не финальные. (в) [[rannyaya-ostanovka|Ранняя остановка]]: каждую эпоху сравниваем val-loss с лучшим; при улучшении обновляем **best_val** и запоминаем [[state-dict|state_dict]], сбрасывая счётчик; если улучшения нет **patience** эпох подряд — прерываем обучение и грузим лучший чекпойнт. Ориентир — **val**-loss, потому что он оценивает обобщение на данных, которых модель не видела; train-loss почти всегда падает (вплоть до $0$) и о переобучении не сигналит, а **patience** даёт кривой право на временные колебания, не реагируя на каждый шумовой всплеск.`,
			answer: String.raw`Переобучение; остановиться в минимуме val-loss (~эп. 20) и сохранить те веса; early stopping по val-loss с терпением patience.`,
			xp: 25
		}
	],
	mastery: [
		'Делю данные на train/val/test, понимаю роль каждой части и не допускаю утечки',
		'Переключаю model.train()/eval() и объясняю, как это влияет на Dropout и BatchNorm',
		'Оборачиваю валидацию в torch.no_grad() и понимаю, что это экономит и что не заменяет',
		'Читаю кривые train/val, узнаю переобучение и применяю раннюю остановку по val-loss'
	]
};
