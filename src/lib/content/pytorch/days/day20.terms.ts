import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 20. Базовые (dtype, state-dict, dataloader…)
// живут в glossary.ts и перекрывают совпадающие id.
export const day20Terms: Glossary = {
	'inference-optimizaciya': {
		id: 'inference-optimizaciya',
		term: 'Инференс-оптимизация',
		short: String.raw`Снятие всего лишнего для быстрого прода.`,
		body: String.raw`**Инференс-оптимизация** — перевод обученной модели в продовый режим: **model.eval()** (фиксирует [[batchnorm|BatchNorm]], выключает [[dropout|Dropout]]), **torch.no_grad()** (не строит [[vychislitelnyy-graf|граф]], экономит память), сериализация в [[torchscript|TorchScript]]/[[onnx-export|ONNX]] и [[dynamic-quantization|квантизация]]. Цель — минимальная латентность и предсказуемый, воспроизводимый прямой проход.`,
		related: ['train-eval', 'torchscript', 'onnx-export', 'dynamic-quantization']
	},
	torchscript: {
		id: 'torchscript',
		term: 'TorchScript',
		short: String.raw`Сериализуемый граф модели без Python.`,
		body: String.raw`**TorchScript** — промежуточное представление модели, которое запускается в C++-рантайме *без* Python-интерпретатора (сервер, мобильное приложение). Получают через [[trace-vs-script|trace или script]], сохраняют **torch.jit.save** — артефакт самодостаточен: при загрузке не нужен исходный класс модели, в отличие от [[state-dict|state_dict]].`,
		related: ['trace-vs-script', 'torch-compile', 'inference-optimizaciya', 'state-dict']
	},
	'trace-vs-script': {
		id: 'trace-vs-script',
		term: 'trace vs script',
		short: String.raw`Два способа собрать TorchScript.`,
		body: String.raw`**torch.jit.trace(model, example)** прогоняет один пример и записывает выполненные операции — просто, но теряет data-зависимые **if**/циклы (зашивается один путь). **torch.jit.script(model)** компилирует сам код **forward**, сохраняя управляющую логику, но поддерживает не весь Python. Правило: чистый поток данных — **trace**; ветвления/циклы по данным — **script**.`,
		related: ['torchscript', 'forward']
	},
	'torch-compile': {
		id: 'torch-compile',
		term: 'torch.compile',
		short: String.raw`JIT-ускорение модели под железо.`,
		body: String.raw`**torch.compile(model)** (PyTorch 2.x) на лету компилирует [[vychislitelnyy-graf|граф]] в оптимизированный код под конкретное железо — ускорение без изменения твоего кода. В отличие от [[torchscript|TorchScript]], это про *скорость на той же машине*, а не про переносимость в другой рантайм: модель остаётся обычным Python-объектом.`,
		related: ['torchscript', 'inference-optimizaciya']
	},
	'onnx-export': {
		id: 'onnx-export',
		term: 'ONNX',
		short: String.raw`Переносимый формат графа между фреймворками.`,
		body: String.raw`**ONNX** (Open Neural Network Exchange) — открытый формат графа модели, который читают сторонние рантаймы (**onnxruntime**, TensorRT, мобильные/браузерные движки) *без* PyTorch. Экспорт — **torch.onnx.export(model, dummy, path, dynamic_axes=...)**. Даёт независимость от Python, графовые оптимизации и деплой на edge. Цена — нужно покрытие операций и явные **dynamic_axes** для переменного [[batch|батча]].`,
		related: ['inference-optimizaciya', 'batch', 'torchscript']
	},
	'dynamic-quantization': {
		id: 'dynamic-quantization',
		term: 'Динамическая квантизация',
		short: String.raw`Веса Linear → int8 без переобучения.`,
		formula: String.raw`q=\mathrm{round}(w/s),\quad s=\max|w|/127`,
		body: String.raw`**Динамическая квантизация** — пост-тренировочный приём: веса [[nn-module|Linear]]-слоёв переводятся в [[int8|int8]] заранее, а активации квантуются на лету по их реальному диапазону. Не нужны калибровочные данные и переобучение — одна строка **torch.quantization.quantize_dynamic(model, {nn.Linear}, dtype=torch.qint8)**. Даёт ×4 по размеру и ускорение CPU-инференса ценой небольшой потери точности.`,
		related: ['int8', 'inference-optimizaciya', 'nn-module', 'dtype']
	},
	int8: {
		id: 'int8',
		term: 'int8',
		short: String.raw`Целое в 1 байт против 4 у float32.`,
		body: String.raw`**int8** — 8-битное целое (диапазон $[-128,127]$), 1 байт на число против 4 у [[dtype|float32]]. [[dynamic-quantization|Квантизация]] линейно отображает float-диапазон в int8 через масштаб $s=\max|w|/127$: $\hat w=q\cdot s$. Округление вносит ошибку порядка $s/2$, зато модель в ~4 раза легче и считается быстрее на CPU.`,
		related: ['dynamic-quantization', 'dtype']
	},
	kapstoun: {
		id: 'kapstoun',
		term: 'Капстоун',
		short: String.raw`Итоговый мини-проект из всего курса.`,
		body: String.raw`**Капстоун** — финальный проект, собирающий весь конвейер в один файл: [[dataset|Dataset]]/[[dataloader|DataLoader]] → [[nn-module|модель]] → цикл обучения ([[zero-grad|zero_grad]]→[[forward|forward]]→[[loss-fn|loss]]→[[backward|backward]]→[[optimizer|step]]) → [[state-dict|чекпойнт]] → инференс-обёртка для прода. Проверяет, что ты умеешь пройти путь модели от сырых данных до развёрнутого артефакта без подсказок.`,
		related: ['dataloader', 'state-dict', 'optimizer', 'inference-optimizaciya']
	}
};
