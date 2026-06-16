import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 19 (GPU, mixed precision, ускорение).
// Базовые (device, cuda, amp, dataloader, dtype…) живут в glossary.ts.
export const day19Terms: Glossary = {
	'to-device-gpu': {
		id: 'to-device-gpu',
		term: '.to(device) — перенос на GPU',
		short: String.raw`Переносит модель/тензор на cpu или cuda.`,
		body: String.raw`**.to(device)** перемещает [[tenzor|тензор]] или модель на нужное [[device|устройство]]. Тонкость: для **модели** ([[nn-module|nn.Module]]) перенос идёт **in-place** — объект меняется, присваивать не нужно (**model.to('cuda')**). Для **тензора** возвращается **копия** на устройстве, поэтому результат обязательно присваивают (**x = x.to('cuda')**). Канон: **device = 'cuda' if torch.cuda.is_available() else 'cpu'**, затем переносят и модель, и каждый батч.`,
		related: ['device', 'cuda', 'non-blocking']
	},
	'non-blocking': {
		id: 'non-blocking',
		term: 'non_blocking=True',
		short: String.raw`Асинхронный перенос CPU→GPU.`,
		body: String.raw`**non_blocking=True** в **.to(device, non_blocking=True)** разрешает копировать данные на GPU **асинхронно** — поток не ждёт завершения копии и может ставить следующие операции в очередь. Работает только в паре с [[pin-memory|pin_memory=True]]: данные должны лежать в закреплённой памяти. Без pin_memory флаг почти бесполезен. Позволяет совместить перенос батча с вычислениями предыдущего.`,
		related: ['pin-memory', 'to-device-gpu', 'cuda']
	},
	autocast: {
		id: 'autocast',
		term: 'torch.autocast',
		short: String.raw`Контекст автоматического выбора точности.`,
		body: String.raw`**torch.autocast(device)** — контекстный менеджер: внутри него PyTorch сам решает, какие операции считать в **float16**/**bfloat16** (матричные умножения, свёртки — ради скорости), а какие держать в **float32** (суммирования, нормировки — ради устойчивости). Оборачивают только **forward + расчёт потери**, не [[backward|backward]]. Основа [[amp|mixed precision]]; почти всегда идёт вместе с [[grad-scaler|GradScaler]].`,
		related: ['amp', 'grad-scaler', 'dtype']
	},
	'grad-scaler': {
		id: 'grad-scaler',
		term: 'GradScaler',
		short: String.raw`Масштабирует потерю, спасая float16-градиенты.`,
		body: String.raw`**GradScaler** решает проблему underflow: в **float16** очень мелкие [[gradient|градиенты]] округляются в ноль. Scaler умножает [[loss-fn|потерю]] на большой коэффициент перед [[backward|.backward()]] (**scaler.scale(loss).backward()**), затем снимает масштаб с градиентов перед шагом (**scaler.step(opt)**) и автоматически подстраивает коэффициент (**scaler.update()**). Без него [[autocast|autocast]] часто молча портит обучение.`,
		related: ['autocast', 'amp', 'gradient', 'backward']
	},
	'pin-memory': {
		id: 'pin-memory',
		term: 'pin_memory',
		short: String.raw`Закреплённая память для быстрого переноса на GPU.`,
		body: String.raw`**pin_memory=True** в [[dataloader|DataLoader]] выделяет батчи в «закреплённой» (page-locked) памяти CPU. Из неё копирование на GPU **быстрее** и может идти асинхронно вместе с [[non-blocking|non_blocking=True]]. Стоит включать почти всегда при обучении на [[cuda|GPU]]; на CPU-обучении бессмысленно. Работает в паре: pin_memory на стороне загрузчика + non_blocking на стороне переноса.`,
		related: ['dataloader', 'non-blocking', 'uzkoe-mesto', 'cuda']
	},
	'torch-compile': {
		id: 'torch-compile',
		term: 'torch.compile',
		short: String.raw`Компиляция модели в быстрые ядра.`,
		body: String.raw`**torch.compile(model)** трассирует граф модели и собирает оптимизированные ядра (в т.ч. слияние операций, fusion), ускоряя forward/backward без изменения кода логики. Одна строка: **model = torch.compile(model)**. Первый вызов **медленный** — идёт компиляция (нужен «прогрев»), последующие быстрее. Применяют после переноса на GPU и [[amp|AMP]] как дополнительный рычаг.`,
		related: ['cuda', 'amp', 'uzkoe-mesto']
	},
	'uzkoe-mesto': {
		id: 'uzkoe-mesto',
		term: 'Узкое место (bottleneck)',
		short: String.raw`Самый медленный этап пайплайна.`,
		body: String.raw`**Узкое место** — звено, ограничивающее общую скорость обучения. Частые виновники: **загрузка данных** (GPU простаивает, ожидая батчи — лечится [[pin-memory|pin_memory]] и num_workers), перенос CPU↔GPU, либо сами вычисления. Признак проблемы с данными — скачущая GPU-утилизация. Правило: сначала **измерь** (с **torch.cuda.synchronize()**), найди узкое место, потом ускоряй именно его — иначе оптимизируешь не то.`,
		related: ['pin-memory', 'torch-compile', 'cuda', 'dataloader']
	}
};
