import type { Day } from '$lib/types';

// День 18 — Сохранение, загрузка, воспроизводимость. Конвенции (см. day01.ts):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true.

export const day18: Day = {
	n: 18,
	phaseId: 'prod',
	title: 'Сохранение, загрузка, воспроизводимость',
	chapterRef: 'pt-18',
	est: '1–2 ч',
	goal: String.raw`Научиться надёжно сохранять и грузить обучение: класть на диск [[state-dict|state_dict]], а не модель целиком; собирать [[checkpoint-slovar|чекпойнт]] для [[vozobnovlenie-obucheniya|возобновления]]; и делать прогон воспроизводимым через [[fiksaciya-seed|фиксацию seed]] и флаги [[determinizm|детерминизма]].`,
	sections: [
		{
			kind: 'definition',
			heading: 'Сохраняем state_dict, а не модель',
			body: String.raw`Соблазн новичка — **torch.save(model, path)**, то есть весь объект модели. Так делать не стоит: pickle вшивает в файл путь к твоему классу и версию кода, и при малейшем рефакторинге (переименовал файл, поменял структуру) загрузка ломается.

Канон — сохранять [[state-dict-save|state_dict]]: обычный словарь $\{$имя_параметра: тензор$\}$ с весами и буферами. Он не зависит от того, *как* устроен код класса, — только от имён слоёв. Восстановление в два шага: создать **свежий экземпляр** модели тем же кодом, затем влить веса через **model.load_state_dict(...)**.

- сохранить: **torch.save(model.state_dict(), "m.pt")**;
- загрузить: **model.load_state_dict(torch.load("m.pt"))**.

Файл получается переносимым между версиями кода и компактным — внутри только тензоры.`,
			code: {
				title: 'Сохранить/загрузить веса (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import torch.nn as nn

model = nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 2))

# сохраняем ТОЛЬКО веса — словарь {имя: тензор}
torch.save(model.state_dict(), "m.pt")
print(list(model.state_dict().keys()))   # 0.weight, 0.bias, 2.weight, 2.bias

# восстановление: свежий экземпляр ТЕМ ЖЕ кодом + заливка весов
fresh = nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 2))
fresh.load_state_dict(torch.load("m.pt"))
fresh.eval()                              # инференс-режим (день про train/eval)
print("веса загружены, модель готова к инференсу")`,
				explanation: String.raw`Ключи [[state-dict|state_dict]] — это пути к слоям (**0.weight**, **2.bias**). Поэтому **fresh** обязан иметь ту же архитектуру, иначе **load_state_dict** ругнётся на несовпадение ключей. Зато сам файл не привязан к имени класса или файла — в этом вся переносимость.`
			}
		},
		{
			kind: 'definition',
			heading: 'Чекпойнт: словарь для возобновления',
			body: String.raw`Одних весов мало, если обучение прервалось и его надо **продолжить с того же места**. Чтобы петля поехала дальше бесшовно, в [[checkpoint-slovar|чекпойнт]] кладут не только модель, но и состояние [[optimizer|оптимизатора]] (моменты Adam, momentum SGD), номер [[epoch|эпохи]] и последнюю [[loss-fn|потерю]]:

- **model** — **model.state_dict()** (веса);
- **optimizer** — **optimizer.state_dict()** (внутреннее состояние шага);
- **epoch** — с какой эпохи продолжать;
- **loss** — для логов и выбора лучшего чекпойнта.

Всё это — один обычный dict, который скармливают **torch.save**. [[vozobnovlenie-obucheniya|Возобновление]] — зеркальная распаковка: создаёшь модель и оптимизатор, грузишь оба state_dict, берёшь **epoch + 1** как старт. Без состояния оптимизатора Adam «забудет» накопленные моменты и первые шаги после рестарта будут дёргаными.`,
			code: {
				title: 'Полный чекпойнт и возобновление (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch

# --- сохраняем чекпойнт в конце эпохи ---
ckpt = {
    "epoch": epoch,
    "model": model.state_dict(),
    "optimizer": optimizer.state_dict(),
    "loss": loss.item(),
}
torch.save(ckpt, "ckpt.pt")

# --- возобновляем (возможно, на другой машине) ---
ckpt = torch.load("ckpt.pt", map_location=device)
model.load_state_dict(ckpt["model"])
optimizer.load_state_dict(ckpt["optimizer"])
start_epoch = ckpt["epoch"] + 1           # продолжаем со следующей
print(f"resume с эпохи {start_epoch}, последний loss={ckpt['loss']:.4f}")`,
				explanation: String.raw`[[checkpoint-slovar|Чекпойнт]] — просто dict, поэтому в него легко добавить **scheduler.state_dict()**, лучший скор, конфиг. **map_location=device** при загрузке решает, *куда* класть тензоры — об этом ниже. **epoch + 1** нужен, чтобы не переучивать уже пройденную эпоху.`
			}
		},
		{
			kind: 'note',
			heading: 'map_location: куда грузить тензоры',
			body: String.raw`Файл помнит, на каком [[device|устройстве]] лежали тензоры при сохранении. Если ты обучал на GPU, а грузишь на машине без CUDA, **torch.load("m.pt")** упадёт с ошибкой «не могу разместить тензор на cuda». Лекарство — [[map-location|map_location]]: он переадресует тензоры на нужное устройство прямо при чтении.

- на CPU-машине: **torch.load(path, map_location="cpu")**;
- универсально: **map_location=device**, где **device** вычислен как **'cuda' if torch.cuda.is_available() else 'cpu'**.

Правило: грузи на **cpu** или на свой текущий **device**, а потом при необходимости двигай модель через **model.to(device)**. Так чекпойнт не зависит от того, на каком железе он создавался.`
		},
		{
			kind: 'intuition',
			heading: 'Воспроизводимость: один seed на три генератора',
			body: String.raw`Случайность в обучении повсюду: инициализация весов, перемешивание [[dataloader|DataLoader]], [[dropout|dropout]], аугментации. Запустишь дважды — получишь два разных результата, и сравнивать эксперименты честно нельзя. Лечение — [[fiksaciya-seed|зафиксировать seed]] *до* любой случайности.

Подвох в том, что генераторов **три независимых**: модуль **random** из stdlib, **numpy**, и сам **torch** (отдельно CPU и CUDA). Засеять надо все три — иначе один из них останется случайным и воспроизводимость «протечёт». Ниже — живой numpy-демо самой идеи: без seed два прогона разные, с **np.random.seed(0)** — побитово одинаковые.`,
			code: {
				title: 'Воспроизводимость на numpy: до и после seed',
				language: 'python',
				code: String.raw`import numpy as np

def draw():
    return np.random.rand(3).round(3)

# Без seed: состояние генератора плывёт — прогоны разные
a, b = draw(), draw()
print("без seed #1:", a)
print("без seed #2:", b)
print("совпали?", np.array_equal(a, b))

# С seed: возвращаем генератор в одну точку перед каждым прогоном
np.random.seed(0); c = np.random.rand(3).round(3)
np.random.seed(0); d = np.random.rand(3).round(3)
print("seed=0 #1:", c)
print("seed=0 #2:", d)
print("совпали?", np.array_equal(c, d))`,
				explanation: String.raw`Seed — это начальная точка генератора псевдослучайных чисел. Вернул его в ту же точку — получил ту же последовательность. В torch роль **np.random.seed** играет **torch.manual_seed**, но идея ровно эта. Запусти пару раз: верхняя пара строк меняется, нижняя — нет.`
			}
		},
		{
			kind: 'connection',
			heading: 'Детерминизм: seed плюс флаги',
			body: String.raw`Один [[fiksaciya-seed|seed]] фиксирует *генераторы*, но полную [[determinizm|воспроизводимость]] на GPU он ещё не гарантирует: часть CUDA-ядер (свёртки, атомарные суммы) по умолчанию работают недетерминированно ради скорости. Чтобы прижать и их, к функции **set_seed** добавляют флаги:

- **torch.use_deterministic_algorithms(True)** — требовать детерминированные реализации;
- **torch.backends.cudnn.deterministic = True** и **cudnn.benchmark = False** — для свёрток cuDNN.

Это слегка замедляет обучение, поэтому детерминизм включают там, где важна точная повторяемость (отладка, публикация результатов), и отключают, когда нужна максимальная скорость. На инференсе же отдельно помни про **model.eval()** и **torch.no_grad()** — без них [[dropout|dropout]]/[[batchnorm|BatchNorm]] и лишний [[vychislitelnyy-graf|граф]] тоже внесут «шум» в предсказания.`,
			code: {
				title: 'set_seed для torch/numpy/random (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import random, numpy as np, torch

def set_seed(seed=0):
    random.seed(seed)              # stdlib
    np.random.seed(seed)           # numpy
    torch.manual_seed(seed)        # torch CPU
    torch.cuda.manual_seed_all(seed)  # все GPU
    # строгий детерминизм (медленнее, но точно повторяемо)
    torch.use_deterministic_algorithms(True)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

set_seed(0)
# ...дальше создаём модель, DataLoader, обучаем — результат повторяем

# Инференс: те же два правила
model.eval()
with torch.no_grad():
    pred = model(x)`,
				explanation: String.raw`**set_seed** засевает все три генератора — пропуск любого вернёт случайность. Флаги [[determinizm|детерминизма]] прижимают CUDA-ядра. **model.eval()** + **torch.no_grad()** — обязательная пара на инференсе: первое отключает [[dropout|dropout]], второе не строит [[vychislitelnyy-graf|граф]] и экономит память.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d18-t1',
			difficulty: 'base',
			prompt: String.raw`Почему рекомендуют сохранять **model.state_dict()**, а не саму модель через **torch.save(model, path)**? Что нужно иметь под рукой, чтобы из [[state-dict|state_dict]] восстановить рабочую модель?`,
			hint: String.raw`Подумай, что именно pickle записывает в файл при сохранении целого объекта и от чего из-за этого зависит загрузка.`,
			solution: String.raw`**torch.save(model, path)** пиклит весь объект и вшивает в файл путь к классу модели и версию кода: переименуешь файл или поменяешь структуру класса — загрузка сломается. [[state-dict-save|state_dict]] же хранит только словарь $\{$имя: тензор$\}$ и не зависит от устройства кода. Чтобы восстановить, нужен **тот же код архитектуры**: создаёшь свежий экземпляр модели и вливаешь веса через **model.load_state_dict(torch.load(path))**.`,
			answer: String.raw`state_dict переносим между версиями кода; для восстановления нужен тот же код архитектуры + **load_state_dict**.`,
			xp: 12
		},
		{
			id: 'pt-d18-t2',
			difficulty: 'base',
			prompt: String.raw`Ты сохраняешь [[checkpoint-slovar|чекпойнт]], чтобы потом **продолжить** обучение с того же места. Какие четыре вещи минимально стоит положить в словарь и зачем именно состояние [[optimizer|оптимизатора]]?`,
			hint: String.raw`Одних весов мало: вспомни, что хранит внутри Adam между шагами.`,
			solution: String.raw`Минимум: **model.state_dict()** (веса), **optimizer.state_dict()** (внутреннее состояние шага), **epoch** (откуда продолжать) и **loss** (для логов/выбора лучшего). Состояние оптимизатора критично, потому что Adam хранит скользящие моменты градиента, а SGD — momentum; без них после рестарта оптимизатор «забудет» накопленную инерцию и первые шаги будут дёргаными. Возобновляют зеркально: грузят оба state_dict и стартуют с **epoch + 1**.`,
			answer: String.raw`model, optimizer, epoch, loss; состояние оптимизатора хранит моменты/momentum для плавного продолжения.`,
			xp: 12
		},
		{
			id: 'pt-d18-t3',
			difficulty: 'star',
			prompt: String.raw`Коллега жалуется: «зову **torch.manual_seed(0)**, а два запуска всё равно дают разные результаты». Перечисли, чего ему не хватает для полной [[determinizm|воспроизводимости]], и при чём тут [[map-location|map_location]], когда он переносит чекпойнт с GPU-сервера на свой ноутбук без CUDA.`,
			hint: String.raw`Генераторов случайности не один. И часть CUDA-ядер недетерминированна по умолчанию. А загрузка помнит исходное устройство.`,
			solution: String.raw`**torch.manual_seed** засевает только torch. Случайность ещё в **random** (stdlib) и **numpy** — их надо засеять отдельно (**random.seed**, **np.random.seed**), плюс **torch.cuda.manual_seed_all** для GPU. Даже с тремя seed часть CUDA-ядер недетерминированна: нужны **torch.use_deterministic_algorithms(True)**, **cudnn.deterministic=True**, **cudnn.benchmark=False**. Это собирают в одну **set_seed(seed)** и зовут *до* любой случайности. Отдельно: чекпойнт помнит [[device|устройство]] сохранения, поэтому на ноутбуке без CUDA нужен **torch.load(path, map_location="cpu")** (или **map_location=device**), иначе загрузка упадёт при попытке разместить тензор на cuda.`,
			answer: String.raw`Засеять random+numpy+torch (и cuda), включить флаги детерминизма; грузить чекпойнт с **map_location="cpu"**.`,
			xp: 25
		}
	],
	mastery: [
		'Сохраняю и гружу веса через state_dict + load_state_dict, понимаю, почему не всю модель',
		'Собираю чекпойнт {model, optimizer, epoch, loss} и возобновляю с него обучение',
		'Применяю map_location, чтобы грузить чекпойнт на любое устройство',
		'Делаю прогон воспроизводимым: seed для random/numpy/torch, флаги детерминизма, eval()+no_grad на инференсе'
	]
};
