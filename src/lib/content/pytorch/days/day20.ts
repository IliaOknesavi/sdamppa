import type { Day } from '$lib/types';

export const day20: Day = {
	n: 20,
	phaseId: 'prod',
	title: 'Деплой: TorchScript/ONNX, квантизация + капстоун',
	chapterRef: 'pt-20',
	est: '1–2 ч',
	goal: String.raw`Подготовить модель к продакшну: сериализовать через [[torchscript|TorchScript]] или [[torch-compile|torch.compile]], экспортировать в [[onnx-export|ONNX]], ужать [[dynamic-quantization|динамической квантизацией]] до [[int8|int8]] — и собрать весь курс в один капстоун (данные→модель→обучение→[[state-dict|чекпойнт]]→инференс).`,
	sections: [
		{
			kind: 'definition',
			heading: 'Train ≠ inference: две разные жизни модели',
			body: String.raw`Во время обучения модель таскает за собой [[vychislitelnyy-graf|вычислительный граф]], [[autograd|autograd]], [[dropout|Dropout]] и [[batchnorm|BatchNorm]] в [[train-eval|train-режиме]], оптимизатор, расписание lr. В проде ничего из этого не нужно — нужен только быстрый и предсказуемый прямой проход.

[[inference-optimizaciya|Инференс-оптимизация]] — это снятие всего лишнего:

- **model.eval()** + **torch.no_grad()** — выключить [[dropout|dropout]], зафиксировать [[batchnorm|BatchNorm]], не строить граф;
- сериализовать модель в формат, не зависящий от Python-кода ([[torchscript|TorchScript]], [[onnx-export|ONNX]]);
- ужать веса ([[dynamic-quantization|квантизация]]) ради размера и латентности.

Цель — отдать в продакшн артефакт, который грузится и считает одинаково на любой машине.`
		},
		{
			kind: 'definition',
			heading: 'TorchScript: trace против script',
			body: String.raw`[[torchscript|TorchScript]] превращает модель в сериализуемый граф, который запускается *без* интерпретатора Python (в C++-рантайме, на сервере, в мобильном приложении). Два способа получить его — и в этом вся [[trace-vs-script|разница trace vs script]]:

- **torch.jit.trace(model, example)** — прогоняет один пример и *записывает* фактически выполненные операции. Быстро и просто, но «зашивает» конкретный путь: **if** по значению тензора и циклы переменной длины потеряются.
- **torch.jit.script(model)** — *компилирует* сам Python-код **forward**, понимая ветвления и циклы. Сложнее (поддерживает не весь Python), зато сохраняет управляющую логику.

Правило: чистый поток данных без data-зависимых ветвлений — **trace**; есть **if**/циклы по данным — **script**.

Альтернатива для *скорости* (а не переносимости) — [[torch-compile|torch.compile(model)]]: JIT-компилирует граф под железо, не меняя твой код. Модель остаётся Python-объектом.`,
			code: {
				title: 'TorchScript: script + сохранение, и torch.compile (Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch, torch.nn as nn

model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 2))
model.eval()                                  # инференс-режим до экспорта

example = torch.randn(1, 10)

# (1) trace — записать операции на одном примере
traced = torch.jit.trace(model, example)

# (2) script — компилировать код forward (сохраняет if/циклы)
scripted = torch.jit.script(model)

scripted.save("model_ts.pt")                  # самодостаточный артефакт
loaded = torch.jit.load("model_ts.pt")        # грузится без класса модели!
print(loaded(example))

# (3) torch.compile — ускорение под железо, остаётся обычной моделью
fast = torch.compile(model)
print(fast(example).shape)`,
				explanation: String.raw`**save** кладёт и веса, и граф в один файл — при загрузке *не нужен* исходный класс модели, в отличие от [[state-dict|state_dict]]. Это и есть переносимость. **torch.compile** — про скорость на той же машине, а не про деплой в другой рантайм.`
			}
		},
		{
			kind: 'connection',
			heading: 'ONNX: общий язык между фреймворками',
			body: String.raw`[[onnx-export|ONNX]] (Open Neural Network Exchange) — открытый формат графа модели, который понимают десятки рантаймов: **onnxruntime** (быстрый CPU/GPU-инференс), TensorRT, мобильные и браузерные движки. Экспорт **torch.onnx.export(...)** под капотом делает [[trace-vs-script|trace]] и сохраняет граф в **.onnx**.

Зачем это нужно:

- **независимость от PyTorch**: продовый сервис на C#/Java/Go грузит **.onnx** без Python и без torch;
- **скорость**: onnxruntime часто быстрее eager-PyTorch на CPU за счёт графовых оптимизаций;
- **переносимость на edge**: один файл едет на телефон, в браузер, в железный ускоритель.

Цена — нужно покрытие операций: редкий кастомный слой может не экспортироваться, и **dynamic_axes** надо указать явно, чтобы [[batch|батч]] не «зашился» фиксированным.`,
			code: {
				title: 'Экспорт в ONNX с динамическим батчем (Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch, torch.nn as nn

model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 2)).eval()
dummy = torch.randn(1, 10)                     # пример формы входа

torch.onnx.export(
    model, dummy, "model.onnx",
    input_names=["x"], output_names=["logits"],
    dynamic_axes={"x": {0: "batch"}, "logits": {0: "batch"}},  # любой N
    opset_version=17,
)

# инференс без PyTorch:
import onnxruntime as ort, numpy as np
sess = ort.InferenceSession("model.onnx")
out = sess.run(None, {"x": np.random.randn(4, 10).astype("float32")})
print(out[0].shape)                            # (4, 2) — батч 4 прошёл`,
				explanation: String.raw`**dynamic_axes** помечает ось $0$ как переменную — иначе модель приняла бы только батч ровно из одного примера (как в **dummy**). Дальше **onnxruntime** считает по графу вообще без torch — только numpy на входе и выходе.`
			}
		},
		{
			kind: 'intuition',
			heading: 'Квантизация: float32 → int8 за счёт точности',
			body: String.raw`Веса по умолчанию — [[dtype|float32]], 4 байта на число. [[dynamic-quantization|Динамическая квантизация]] переводит веса линейных слоёв в [[int8|int8]] (1 байт): модель худеет почти в 4 раза, а CPU-инференс ускоряется, потому что целочисленные матричные операции дешевле.

Идея — линейное отображение диапазона float на $[-127,127]$ через **масштаб** $s$:

$$q = \mathrm{round}(w/s),\qquad \hat w = q\cdot s,\qquad s=\frac{\max|w|}{127}.$$

«Динамическая» значит: веса квантуются заранее (offline), а *активации* — на лету по их реальному диапазону в момент инференса. Это самый дешёвый вид — без калибровочных данных и переобучения, отлично заходит для **nn.Linear** в трансформерах/MLP на CPU.

Риск виден прямо в формуле: $\hat w \ne w$. Округление вносит ошибку, и для чувствительных моделей точность чуть просядет — это компромисс «размер/скорость против качества».`,
			code: {
				title: 'Симуляция int8-квантизации на numpy',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
# float32-веса слоя, которые хотим ужать до int8
w = np.random.randn(8).astype(np.float32)

# симметричная квантизация: один масштаб на тензор
qmax = 127                      # диапазон int8: [-127, 127]
scale = np.abs(w).max() / qmax  # сколько float в одном «шаге» int8

q = np.round(w / scale).astype(np.int8)   # упаковали в int8
w_hat = q.astype(np.float32) * scale      # распаковали обратно

err = np.abs(w - w_hat).max()
print("scale =", round(float(scale), 5))
print("исходные :", np.round(w, 3))
print("int8     :", q)
print("восстано.:", np.round(w_hat, 3))
print("макс. ошибка восстановления:", round(float(err), 5))`,
				explanation: String.raw`**scale** — цена одного целого шага в единицах float. После round→×scale веса почти совпадают с исходными, но не точно: остаётся ошибка порядка половины шага. Память упала в 4 раза (int8 vs float32) — ровно это даёт [[dynamic-quantization|квантизация]] в torch, только сразу на всех слоях.`
			}
		},
		{
			kind: 'note',
			heading: 'Динамическая квантизация в torch и сравнение размера',
			body: String.raw`В PyTorch [[dynamic-quantization|пост-тренировочная квантизация]] — одна строка. Она *не требует* данных и переобучения: бери обученную **eval**-модель и оборачивай. Дальше сравни размеры файлов — разница в разы.`,
			code: {
				title: 'quantize_dynamic для Linear + замер размера (Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch, torch.nn as nn, os

model = nn.Sequential(nn.Linear(256, 256), nn.ReLU(), nn.Linear(256, 10)).eval()

# веса nn.Linear → int8, активации квантуются на лету
qmodel = torch.quantization.quantize_dynamic(
    model, {nn.Linear}, dtype=torch.qint8
)

def size_kb(m, path):
    torch.save(m.state_dict(), path)
    return os.path.getsize(path) / 1024

print(f"float32: {size_kb(model,  'fp32.pt'):.0f} KB")
print(f"int8   : {size_kb(qmodel, 'int8.pt'):.0f} KB")  # примерно в 4 раза меньше

x = torch.randn(1, 256)
print("выходы совпадают по форме:", model(x).shape == qmodel(x).shape)`,
				explanation: String.raw`Указываем **{nn.Linear}** — какие типы слоёв квантовать. Файл [[int8|int8]]-модели заметно меньше, инференс на CPU быстрее, а выход почти тот же. Контроль качества после квантизации — обязателен: меряй метрику на валидации.`
			}
		},
		{
			kind: 'connection',
			heading: 'Капстоун: весь курс в одном файле',
			body: String.raw`[[kapstoun|Капстоун]] склеивает всё, что было: [[dataset|Dataset]]/[[dataloader|DataLoader]] → [[nn-module|модель]] → цикл обучения ([[zero-grad|zero_grad]]→[[forward|forward]]→[[loss-fn|loss]]→[[backward|backward]]→[[optimizer|step]]) → [[state-dict|чекпойнт]] → инференс-обёртка для прода. Минимальный скелет, который ты должен уметь написать с нуля:

1. данные: **Dataset** + **DataLoader** с **shuffle=True**;
2. модель: **nn.Module** на нужном [[device|device]];
3. обучение: [[adam|Adam]] + [[cross-entropy|CrossEntropyLoss]], несколько [[epoch|эпох]], валидация на [[train-eval|eval]];
4. чекпойнт: **torch.save(model.state_dict(), ...)**;
5. деплой: загрузить веса, **eval()**, опционально [[dynamic-quantization|квантовать]] и/или [[onnx-export|экспортировать в ONNX]].

Это и есть «производственный» путь модели — от сырых данных до артефакта, который кто-то другой запустит в проде.`,
			code: {
				title: 'Капстоун-скелет: train → checkpoint → deploy (Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch, torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader

device = "cuda" if torch.cuda.is_available() else "cpu"

# 1. данные
X, y = torch.randn(512, 20), torch.randint(0, 3, (512,))
loader = DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)

# 2. модель
model = nn.Sequential(nn.Linear(20, 64), nn.ReLU(), nn.Linear(64, 3)).to(device)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

# 3. обучение
model.train()
for epoch in range(5):
    for xb, yb in loader:
        xb, yb = xb.to(device), yb.to(device)
        opt.zero_grad()
        loss = loss_fn(model(xb), yb)
        loss.backward()
        opt.step()

# 4. чекпойнт
torch.save(model.state_dict(), "capstone.pt")

# 5. деплой: загрузить → eval → квантовать → инференс
infer = nn.Sequential(nn.Linear(20, 64), nn.ReLU(), nn.Linear(64, 3))
infer.load_state_dict(torch.load("capstone.pt", map_location="cpu"))
infer.eval()
qinfer = torch.quantization.quantize_dynamic(infer, {nn.Linear}, dtype=torch.qint8)

with torch.no_grad():
    pred = qinfer(torch.randn(1, 20)).argmax(dim=-1)
print("предсказанный класс:", pred.item())`,
				explanation: String.raw`Один файл проходит весь конвейер: те же кубики, что и в днях про [[dataloader|DataLoader]], [[optimizer|оптимизатор]] и [[state-dict|чекпойнты]], только собранные в цепочку. Деплой-часть намеренно отделена: грузим веса в свежий экземпляр, переводим в [[train-eval|eval]], квантуем — и отдаём в инференс под [[inference-optimizaciya|no_grad]].`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d20-t1',
			difficulty: 'base',
			prompt: String.raw`В чём разница между **torch.jit.trace** и **torch.jit.script** в [[torchscript|TorchScript]]? Для модели, у которой **forward** содержит **if x.sum() > 0:** (ветвление по значению входа), какой способ выбрать и почему?`,
			hint: String.raw`Trace записывает один реально выполненный путь; script компилирует сам код forward с управляющей логикой.`,
			solution: String.raw`**trace** прогоняет один пример и записывает *фактически выполненные* операции — управляющая логика теряется: при трассировке возьмётся только одна ветка **if**, и для других входов граф будет неверным. **script** компилирует Python-код **forward**, сохраняя [[trace-vs-script|ветвления и циклы]]. Раз ветка зависит от значения входа (**x.sum() > 0**), нужен **torch.jit.script** — иначе data-зависимый **if** «зашьётся» в один путь.`,
			answer: String.raw`script: только он сохраняет data-зависимый **if**; trace зафиксировал бы одну ветку.`,
			xp: 12
		},
		{
			id: 'pt-d20-t2',
			difficulty: 'base',
			prompt: String.raw`Модель обучена в PyTorch, но продовый сервис написан на C# и не может тащить Python с torch. Как [[onnx-export|ONNX]] решает эту проблему и что обязательно указать при экспорте, чтобы сервис мог слать батчи произвольного размера?`,
			hint: String.raw`ONNX — это переносимый граф, который читают сторонние рантаймы. Думай про ось батча.`,
			solution: String.raw`**torch.onnx.export** сохраняет модель как переносимый граф **.onnx**, который грузят рантаймы без PyTorch (onnxruntime под C#/Java/Go и др.) — Python и torch в проде не нужны. Чтобы принимать батчи любого размера, нужно пометить ось $0$ как динамическую через **dynamic_axes**, например **dynamic_axes={"x": {0: "batch"}}**. Иначе размер батча «зашьётся» равным форме примера **dummy**, и сервис сможет слать только такой же батч.`,
			answer: String.raw`ONNX даёт Python-независимый граф для onnxruntime; ось батча открыть через **dynamic_axes**.`,
			xp: 12
		},
		{
			id: 'pt-d20-t3',
			difficulty: 'star',
			prompt: String.raw`[[dynamic-quantization|Динамическая квантизация]] переводит веса [[nn-module|Linear]]-слоёв во [[int8|int8]]. Что конкретно она даёт (две выгоды) и чем рискует? Для веса с диапазоном $\max|w|=2.0$ посчитай масштаб $s$ и оцени порядок ошибки восстановления одного веса.`,
			hint: String.raw`$s=\max|w|/127$. int8 хранит 1 байт против 4 у float32. Ошибка округления — порядка половины шага $s$.`,
			solution: String.raw`**Выгоды:** (1) размер — int8 это 1 байт против 4 у [[dtype|float32]], модель худеет почти в 4 раза; (2) латентность — целочисленные операции на CPU дешевле, инференс быстрее. **Риск:** округление $q=\mathrm{round}(w/s)$ необратимо, $\hat w=q\cdot s\ne w$ — точность модели может просесть, поэтому после квантизации обязателен замер метрики на валидации.

Масштаб: $s=\dfrac{\max|w|}{127}=\dfrac{2.0}{127}\approx 0.0157$. Ошибка восстановления одного веса ограничена половиной шага: $|w-\hat w|\le s/2\approx 0.008$ — порядка $10^{-2}$.`,
			answer: String.raw`Выгоды: ×4 меньше размер и быстрее CPU-инференс; риск: ошибка округления → просадка точности. $s\approx0.0157$, ошибка $\lesssim0.008$.`,
			xp: 25
		}
	],
	mastery: [
		'Различаю train- и inference-режимы и готовлю модель к проду (eval + no_grad)',
		'Объясняю trace vs script в TorchScript и выбираю нужный; знаю, зачем torch.compile',
		'Экспортирую в ONNX с dynamic_axes и понимаю, зачем нужен Python-независимый граф',
		'Применяю динамическую квантизацию, понимаю выигрыш (размер/латентность) и риск (точность)',
		'Собираю капстоун: данные → модель → обучение → чекпойнт → инференс в одном проекте'
	]
};
