import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 1. Базовые (tenzor, dtype, device, broadcasting…)
// живут в glossary.ts и перекрывают совпадающие id.
export const day01Terms: Glossary = {
	'rang-tenzora': {
		id: 'rang-tenzora',
		term: 'Ранг (ndim)',
		short: String.raw`Число осей тензора.`,
		body: String.raw`**Ранг** (он же **ndim**) — сколько у [[tenzor|тензора]] осей. Скаляр — 0, вектор — 1, матрица — 2, батч картинок — 4. Не путать с математическим «рангом матрицы»: здесь это просто длина [[shape-forma|shape]].`,
		related: ['tenzor', 'shape-forma']
	},
	'shape-forma': {
		id: 'shape-forma',
		term: 'Форма (shape)',
		short: String.raw`Кортеж размеров по каждой оси.`,
		body: String.raw`**shape** — кортеж размеров тензора по осям, например $(N,C,H,W)$. Произведение этих чисел — общее количество элементов. Контроль формы — главный навык отладки сетей: 90% ошибок это несовпадение shape в матричном умножении или [[broadcasting|broadcasting]].`,
		related: ['rang-tenzora', 'reshape-view', 'broadcasting']
	},
	'reshape-view': {
		id: 'reshape-view',
		term: 'reshape / view',
		short: String.raw`Переразложить элементы в другую форму.`,
		body: String.raw`**reshape** и **view** меняют [[shape-forma|форму]], сохраняя порядок и число элементов. **view** требует непрерывной памяти (contiguous) и возвращает «вид» без копии; **reshape** при необходимости копирует. Удобный приём — **-1**: одна ось вычисляется автоматически (**t.reshape(8, -1)**).`,
		related: ['shape-forma', 'tenzor']
	},
	'tensor-konstruktory': {
		id: 'tensor-konstruktory',
		term: 'Конструкторы тензоров',
		short: String.raw`tensor, zeros, ones, randn, arange, linspace.`,
		body: String.raw`Способы создать [[tenzor|тензор]]: **torch.tensor(data)** из готовых данных, **torch.zeros/ones(shape)** и **torch.full** — заполненные, **torch.randn/rand** — случайные, **torch.arange/linspace** — последовательности, **torch.eye** — единичная матрица. У всех есть аргументы **dtype** и **device**.`,
		related: ['tenzor', 'dtype', 'device']
	},
	'tensor-numpy-most': {
		id: 'tensor-numpy-most',
		term: 'Мост torch ↔ numpy',
		short: String.raw`from_numpy / .numpy() без копии.`,
		body: String.raw`**torch.from_numpy(a)** делает [[tenzor|тензор]] из numpy-массива, **t.numpy()** — обратно. На CPU они **делят память**: меняешь один — меняется другой. Это бесплатный способ переиспользовать весь numpy-инструментарий (загрузка данных, метрики) вместе с PyTorch.`,
		related: ['tenzor', 'broadcasting']
	},
	'item-skalyar': {
		id: 'item-skalyar',
		term: '.item()',
		short: String.raw`Достать число из тензора-скаляра.`,
		body: String.raw`**t.item()** превращает [[tenzor|тензор]] из одного элемента (например, посчитанную [[loss-fn|потерю]]) в обычный Python-float. Нужен для логирования: складывать потери батчей лучше как числа, а не как тензоры — иначе нечаянно удержишь [[vychislitelnyy-graf|граф]] в памяти.`,
		related: ['tenzor', 'loss-fn']
	}
};
