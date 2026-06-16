import type { Day } from '$lib/types';

// День 19. Конвенции (как в day01):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.
//  • Термины [[id]] / [[id|подпись]] — из базового глоссария или day19.terms.ts.

export const day19: Day = {
	n: 19,
	phaseId: 'prod',
	title: 'GPU, mixed precision, ускорение',
	chapterRef: 'pt-19',
	est: '1–2 ч',
	goal: String.raw`Ускорить обучение в десятки раз: перенести модель и данные на [[to-device-gpu|GPU]], включить [[autocast|mixed precision]] с [[grad-scaler|GradScaler]], убрать [[uzkoe-mesto|узкие места]] пайплайна ([[pin-memory|pin_memory]], num_workers) и измерить, где реально тратится время.`,
	sections: [
		{
			kind: 'intuition',
			heading: 'Почему GPU быстрее: всё дело в параллелизме',
			body: String.raw`GPU ускоряет обучение не магией, а массовым параллелизмом: тысячи ядер делают одну и ту же операцию над разными числами сразу. Тот же принцип виден уже в numpy на CPU — **векторизованная** операция вместо питон-цикла обгоняет его в сотни раз, потому что считается в нативном коде одним пакетом, а не по элементу.

Запомни цепочку рассуждений: питон-цикл медленный → векторизация (numpy) быстрее → SIMD-ядра CPU ещё быстрее → тысячи ядер [[to-device-gpu|GPU]] делают тот же трюк в гигантском масштабе. [[cuda|CUDA]]-тензоры PyTorch — это и есть «numpy на стероидах».`,
			code: {
				title: 'Векторизация против питон-цикла (numpy)',
				language: 'python',
				code: String.raw`import numpy as np
import time

np.random.seed(0)
n = 1_000_000
a = np.random.rand(n)
b = np.random.rand(n)

# Питон-цикл: скалярное произведение «руками», по элементу
t0 = time.perf_counter()
acc = 0.0
for i in range(n):
    acc += a[i] * b[i]
loop_s = time.perf_counter() - t0

# Векторизация: та же сумма произведений одной операцией
t0 = time.perf_counter()
acc_vec = np.dot(a, b)
vec_s = time.perf_counter() - t0

print(f"цикл:         {loop_s*1000:8.1f} мс  -> {acc:.2f}")
print(f"векторизация: {vec_s*1000:8.1f} мс  -> {acc_vec:.2f}")
print(f"ускорение:    {loop_s/vec_s:8.0f}x")`,
				explanation: String.raw`Результат одинаков до копейки, а время отличается на два порядка. Это та же идея, что и перенос на [[to-device-gpu|GPU]]: не меняем *что* считаем, меняем *как* — пакетно и параллельно. На реальном GPU выигрыш над CPU для матричных операций сети ещё больше.`
			}
		},
		{
			kind: 'definition',
			heading: 'device=cuda и перенос модели и данных',
			body: String.raw`Канон один и тот же во всех проектах: определяем [[device|устройство]] один раз и приводим к нему **и модель, и каждый батч**.

- **device = 'cuda' if torch.cuda.is_available() else 'cpu'** — код работает и без GPU;
- **model.to(device)** — переносит [[parametr|параметры]] на месте (модуль меняется in-place);
- **x.to(device)** — для тензоров создаёт **копию** на устройстве, поэтому результат надо присвоить: **x = x.to(device)**;
- [[non-blocking|non_blocking=True]] вместе с [[pin-memory|pin_memory]] позволяет копировать данные на GPU асинхронно, не блокируя поток.

Главная бытовая ошибка дня: модель на **cuda**, а батч забыли перенести — он остался на **cpu**. PyTorch падает с **RuntimeError: Expected all tensors to be on the same device**. Лечится одной строкой переноса батча.`,
			code: {
				title: 'Типичная ошибка разных device (torch, открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch, torch.nn as nn

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = nn.Linear(3, 1).to(device)   # модель на GPU

x = torch.randn(8, 3)                # тензор остался на CPU!
# y = model(x)
# -> RuntimeError: Expected all tensors to be on the same device,
#    but found at least two devices, cuda:0 and cpu

x = x.to(device)                     # перенос -> присваиваем копию
y = model(x)                         # теперь оба на одном device
print(y.device)                      # cuda:0`,
				explanation: String.raw`Запомни: **.to(device)** на тензоре возвращает копию — забыл присвоить, и тензор как был на [[device|cpu]], так и остался. Модель же переносится in-place, присваивать не обязательно. Держи перенос батча первой строкой цикла обучения.`
			}
		},
		{
			kind: 'definition',
			heading: 'Mixed precision: autocast + GradScaler',
			body: String.raw`[[amp|Mixed precision]] считает тяжёлые операции (матричные умножения, свёртки) в половинной точности **float16**/**bfloat16**, а чувствительные места — в **float32**. На тензорных ядрах современных GPU это ускоряет обучение в 1.5–3 раза и вдвое экономит память почти без потери качества.

Две детали делают это безопасным:

- [[autocast|torch.autocast]] — контекст, внутри которого PyTorch сам выбирает точность под каждую операцию;
- [[grad-scaler|GradScaler]] — масштабирует [[loss-fn|потерю]] перед [[backward|.backward()]], чтобы крошечные градиенты в float16 не «утонули» в ноль (underflow), и снимает масштаб обратно перед шагом.

Канонический порядок шага с AMP: **autocast → loss → scaler.scale(loss).backward() → scaler.step(opt) → scaler.update()**.`,
			code: {
				title: 'Цикл обучения на GPU с AMP (torch, открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
from torch.amp import autocast, GradScaler

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = model.to(device)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
scaler = GradScaler(device)               # хранит масштаб потери

for xb, yb in loader:
    xb = xb.to(device, non_blocking=True) # асинхронный перенос батча
    yb = yb.to(device, non_blocking=True)

    opt.zero_grad()
    with autocast(device):                # автоматический float16 внутри
        pred = model(xb)
        loss = loss_fn(pred, yb)

    scaler.scale(loss).backward()         # масштабируем -> backward
    scaler.step(opt)                      # снимаем масштаб -> шаг
    scaler.update()                       # подгоняем масштаб на след. итерацию`,
				explanation: String.raw`Без [[grad-scaler|GradScaler]] обычный **loss.backward(); opt.step()** в float16 часто обнуляет мелкие [[gradient|градиенты]] и обучение глохнет. Scaler умножает потерю на большой коэффициент, считает [[backward|backward]], делит градиенты обратно в **step**, а в **update** автоматически подбирает масштаб. На CPU autocast почти не даёт выигрыша — AMP про GPU.`
			}
		},
		{
			kind: 'note',
			heading: 'pin_memory и num_workers: кормим GPU вовремя',
			body: String.raw`Часто GPU простаивает не потому что слаб, а потому что данные не успевают подъезжать — [[uzkoe-mesto|узкое место]] в загрузке. Два рычага в [[dataloader|DataLoader]]:

- **num_workers > 0** — батчи готовятся в нескольких процессах параллельно с обучением, пока GPU считает предыдущий батч;
- [[pin-memory|pin_memory=True]] — выделяет «закреплённую» (page-locked) память на CPU, из которой копирование на GPU быстрее и может идти асинхронно вместе с [[non-blocking|non_blocking=True]].

Правило: **pin_memory=True** и **non_blocking=True** работают в паре — закреплённая память на стороне CPU плюс асинхронный перенос на стороне вызова. Без pin_memory флаг non_blocking почти бесполезен.`,
			code: {
				title: 'DataLoader, который не тормозит GPU (torch, открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`from torch.utils.data import DataLoader

loader = DataLoader(
    train_dataset,
    batch_size=128,
    shuffle=True,
    num_workers=4,        # 4 процесса готовят батчи параллельно
    pin_memory=True,      # закреплённая память -> быстрый перенос на GPU
    persistent_workers=True,  # не пересоздавать воркеров каждую эпоху
)

# в цикле перенос становится асинхронным благодаря паре pin_memory+non_blocking
for xb, yb in loader:
    xb = xb.to('cuda', non_blocking=True)
    yb = yb.to('cuda', non_blocking=True)`,
				explanation: String.raw`Если GPU-утилизация скачет «то 100%, то 0%» — данные не успевают, добавь воркеров и pin_memory. Слишком много воркеров тоже вредно (накладные расходы и память) — подбирают экспериментально, обычно 2–8.`
			}
		},
		{
			kind: 'connection',
			heading: 'torch.compile и измерение времени',
			body: String.raw`Когда перенос на GPU и AMP уже включены, следующий рычаг — [[torch-compile|torch.compile]]: одна строка **model = torch.compile(model)** трассирует граф модели и собирает оптимизированные ядра (fusion операций), давая ускорение «из коробки» без правок логики. Первый вызов медленный (идёт компиляция), дальше — быстрее.

Но прежде чем что-то ускорять — **измерь**. Иначе оптимизируешь не то место. Важная тонкость: GPU работает асинхронно, поэтому наивный замер временем покажет ерунду. Перед измерением нужна синхронизация **torch.cuda.synchronize()**, чтобы дождаться реального завершения вычислений.

Порядок действий инженера: измерил → нашёл [[uzkoe-mesto|узкое место]] (загрузка данных? forward? перенос?) → применил рычаг (workers / AMP / compile) → измерил снова.`,
			code: {
				title: 'Корректный замер времени на GPU (torch, открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch, time

def timed_gpu(fn, n=50):
    torch.cuda.synchronize()       # дождаться, пока GPU доделает прошлое
    t0 = time.perf_counter()
    for _ in range(n):
        fn()
    torch.cuda.synchronize()       # дождаться завершения ВСЕХ запусков
    return (time.perf_counter() - t0) / n

x = torch.randn(256, 1024, device='cuda')
base = timed_gpu(lambda: model(x))

fast = torch.compile(model)
_ = fast(x)                        # «прогрев»: первый вызов компилирует
comp = timed_gpu(lambda: fast(x))

print(f"обычная:  {base*1000:.2f} мс/итер")
print(f"compile:  {comp*1000:.2f} мс/итер")`,
				explanation: String.raw`Без **torch.cuda.synchronize()** замер ловит лишь время *постановки задачи в очередь*, а не самих вычислений — числа будут абсурдно маленькими. Первый вызов скомпилированной модели всегда медленный, поэтому его выкидывают как «прогрев» и меряют последующие.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d19-t1',
			difficulty: 'base',
			prompt: String.raw`Модель перенесли на GPU (**model.to('cuda')**), а батч **x** оставили как есть на CPU и вызвали **model(x)**. Что произойдёт и как починить одной строкой? Почему **model.to** не требует присваивания, а **x.to** требует?`,
			hint: String.raw`Операция требует, чтобы все тензоры были на одном [[device|устройстве]]. Модуль переносится in-place, а **.to** на тензоре возвращает копию.`,
			solution: String.raw`Будет **RuntimeError: Expected all tensors to be on the same device** — параметры на **cuda:0**, вход на **cpu**. Чинится переносом батча: **x = x.to('cuda')**. [[to-device-gpu|model.to(device)]] меняет модуль на месте (параметры переносятся внутри объекта), поэтому присваивать не нужно; а **x.to(device)** для тензора создаёт **новую копию** на устройстве и ничего не меняет в исходном — без присваивания **x** так и останется на [[device|cpu]].`,
			answer: String.raw`RuntimeError про разные device; чинит **x = x.to('cuda')**. Модель переносится in-place, тензор — копией.`,
			xp: 12
		},
		{
			id: 'pt-d19-t2',
			difficulty: 'base',
			prompt: String.raw`Что даёт [[autocast|mixed precision]] и зачем при ней нужен [[grad-scaler|GradScaler]]? Что сломается, если включить autocast, но **забыть** про scaler?`,
			hint: String.raw`float16 быстрее и легче, но у него крошечный диапазон. Что будет с очень маленькими [[gradient|градиентами]]?`,
			solution: String.raw`[[amp|Mixed precision]] считает тяжёлые операции в **float16**/**bfloat16** — это ускоряет обучение на тензорных ядрах GPU (часто в 1.5–3 раза) и вдвое экономит память, держа критичные места в **float32**. Проблема float16 — узкий диапазон: мелкие [[gradient|градиенты]] округляются в ноль (underflow), и обучение глохнет. [[grad-scaler|GradScaler]] умножает [[loss-fn|потерю]] на большой коэффициент перед [[backward|.backward()]] (градиенты уезжают в представимый диапазон), затем снимает масштаб обратно перед **opt.step()**. Без scaler autocast формально работает, но часть градиентов обнуляется — модель учится плохо или вовсе стоит на месте.`,
			answer: String.raw`AMP даёт скорость и экономию памяти; GradScaler спасает мелкие градиенты от underflow в float16. Без него обучение деградирует.`,
			xp: 12
		},
		{
			id: 'pt-d19-t3',
			difficulty: 'star',
			prompt: String.raw`GPU-утилизация в обучении скачет: то 100%, то падает почти до нуля, общее время большое. Свёрточная сеть, батчи читаются с диска и аугментируются на CPU. В чём вероятное [[uzkoe-mesto|узкое место]] и какие три рычага [[dataloader|DataLoader]]/переноса его лечат? Почему просто «купить GPU помощнее» не поможет?`,
			hint: String.raw`Если GPU периодически простаивает, он *ждёт*. Чего он может ждать в таком пайплайне? Подумай про подготовку и доставку батчей.`,
			solution: String.raw`Провалы утилизации означают, что GPU **простаивает, ожидая данные** — [[uzkoe-mesto|узкое место]] в пайплайне загрузки (чтение с диска + аугментация на CPU), а не в вычислениях сети. Три рычага: (1) **num_workers > 0** — готовить батчи в нескольких процессах параллельно с обучением; (2) [[pin-memory|pin_memory=True]] — закреплённая память для быстрого копирования CPU→GPU; (3) [[non-blocking|non_blocking=True]] при переносе батча (**xb.to(device, non_blocking=True)**) — асинхронный перенос в паре с pin_memory, пока GPU считает предыдущий батч. Более мощный GPU не поможет, потому что он и так часть времени **ждёт** — ускорение вычислений лишь увеличит долю простоя; лечить надо доставку данных. (Дополнительно: вынести часть аугментаций на GPU или кешировать предобработку.)`,
			answer: String.raw`Узкое место — загрузка данных (GPU ждёт батчи). Рычаги: num_workers, pin_memory, non_blocking. Мощнее GPU не спасёт — он простаивает в ожидании.`,
			xp: 25
		}
	],
	mastery: [
		'Переношу модель и каждый батч на одно device и понимаю разницу in-place vs копия у .to()',
		'Включаю mixed precision через autocast и знаю, зачем нужен GradScaler',
		'Настраиваю DataLoader (num_workers, pin_memory) и перенос с non_blocking против простоя GPU',
		'Применяю torch.compile и корректно измеряю время с torch.cuda.synchronize()'
	]
};
