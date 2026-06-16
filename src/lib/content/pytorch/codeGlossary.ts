import type { Glossary } from '$lib/types';

// =====================================================================
//  Code API glossary for PyTorch. Keys are 'py:<token>' so CodeView can
//  resolve hovered code tokens to the SAME hover/pin cards as concept terms.
//  Resolution (see CodeView): a dotted chain tries its longest known suffix,
//  then the '.method' form. So 'x.reshape' → 'py:.reshape', 'np.array' →
//  'py:np.array'. `term` holds the signature; body links to [[concepts]].
//
//  Конвенция: String.raw везде; идентификаторы — **жирным**; математика $...$.
// =====================================================================

export const codeGlossary: Glossary = {
	'py:np': {
		id: 'py:np',
		term: 'import numpy as np',
		short: String.raw`Библиотека массивов — фундамент численного Python.`,
		body: String.raw`**numpy** — массивы $n$-мерных чисел и быстрые векторные операции на C. В этом курсе на numpy показаны живые демо (он запускается прямо в браузере), а его API почти один в один повторяет [[tenzor|тензоры]] PyTorch.`,
		related: ['tenzor', 'broadcasting']
	},
	'py:torch': {
		id: 'py:torch',
		term: 'import torch',
		short: String.raw`Корневой модуль PyTorch.`,
		body: String.raw`**torch** — корень библиотеки: [[tenzor|тензоры]], [[autograd|autograd]], математика, работа с [[device|устройствами]]. Подмодули: **torch.nn** (слои), **torch.optim** ([[optimizer|оптимизаторы]]), **torch.utils.data** ([[dataloader|данные]]).`,
		related: ['tenzor', 'autograd']
	},
	'py:np.array': {
		id: 'py:np.array',
		term: 'np.array(object, dtype=None)',
		short: String.raw`Создать массив из списка/кортежа.`,
		body: String.raw`**np.array** строит numpy-массив из готовых данных. [[dtype|Тип]] выводится из содержимого (или задаётся явно). Аналог в PyTorch — **torch.tensor**.`,
		related: ['py:torch.tensor', 'dtype', 'tenzor']
	},
	'py:np.arange': {
		id: 'py:np.arange',
		term: 'np.arange(start, stop, step)',
		short: String.raw`Последовательность чисел с шагом.`,
		body: String.raw`**np.arange** возвращает 1-D массив $[start, stop)$ с шагом **step**. Часто за ним идёт **.reshape**, чтобы получить нужную [[shape-forma|форму]]. Torch-аналог — **torch.arange**.`,
		related: ['py:.reshape', 'py:torch.arange', 'shape-forma']
	},
	'py:torch.tensor': {
		id: 'py:torch.tensor',
		term: 'torch.tensor(data, dtype=None, device=None)',
		short: String.raw`Создать тензор из данных.`,
		body: String.raw`**torch.tensor** копирует данные в новый [[tenzor|тензор]]. Дробные → [[dtype|float32]], целые → int64. Можно сразу задать **device** ([[cuda|GPU]]). Для обучаемого тензора добавь **requires_grad=True** ([[autograd|autograd]]).`,
		related: ['tenzor', 'dtype', 'device', 'requires-grad']
	},
	'py:torch.arange': {
		id: 'py:torch.arange',
		term: 'torch.arange(start, stop, step)',
		short: String.raw`Тензор-последовательность.`,
		body: String.raw`**torch.arange** — как **np.arange**, но возвращает [[tenzor|тензор]]. Из целых аргументов даёт int64; для дробного укажи **dtype=torch.float32** или **.float()**.`,
		related: ['py:np.arange', 'tenzor', 'dtype']
	},
	'py:torch.randn': {
		id: 'py:torch.randn',
		term: 'torch.randn(*size)',
		short: String.raw`Тензор из стандартного нормального шума.`,
		body: String.raw`**torch.randn(2, 3)** создаёт [[tenzor|тензор]] формы $(2,3)$ из $\mathcal N(0,1)$. Используется для инициализации весов и генерации шумовых входов. Для воспроизводимости — **torch.manual_seed**.`,
		related: ['tenzor', 'parametr']
	},
	'py:torch.matmul': {
		id: 'py:torch.matmul',
		term: 'torch.matmul(a, b)  ·  a @ b',
		short: String.raw`Матричное умножение (оператор @).`,
		body: String.raw`**torch.matmul** (он же **@**) перемножает матрицы: $(m,k)@(k,n)=(m,n)$. Внутренние размеры должны совпасть. Поддерживает батчи. Не путать с поэлементным **\***. Основа [[nn-module|линейных слоёв]].`,
		related: ['nn-module', 'tenzor', 'broadcasting']
	},
	'py:nn.Linear': {
		id: 'py:nn.Linear',
		term: 'nn.Linear(in_features, out_features)',
		short: String.raw`Полносвязный слой: y = xWᵀ + b.`,
		formula: String.raw`y = xW^\top + b`,
		body: String.raw`**nn.Linear** — обучаемый слой с [[parametr|параметрами]] **weight** $(out,in)$ и **bias** $(out,)$. Считает $y=xW^\top+b$. Базовый кирпич [[nn-module|nn.Module]]; число параметров $= in\cdot out + out$.`,
		related: ['nn-module', 'parametr', 'py:torch.matmul']
	},
	'py:.reshape': {
		id: 'py:.reshape',
		term: 'x.reshape(*shape)',
		short: String.raw`Переразложить элементы в новую форму.`,
		body: String.raw`**.reshape** меняет [[shape-forma|форму]] тензора, сохраняя число элементов; при необходимости копирует (в отличие от **.view**). Одну ось можно задать **-1** — она вычислится сама. См. [[reshape-view|reshape/view]].`,
		related: ['reshape-view', 'shape-forma']
	},
	'py:.sum': {
		id: 'py:.sum',
		term: 'x.sum(dim=None, keepdim=False)',
		short: String.raw`Сумма по всему тензору или вдоль оси.`,
		body: String.raw`**.sum()** складывает все элементы; **.sum(dim=k)** — вдоль оси $k$ (ось исчезает). [[reshape-view|keepdim=True]] оставляет её размером 1 — удобно для [[broadcasting|broadcasting]]. Аналогично работают **.mean/.max/.min**.`,
		related: ['broadcasting', 'shape-forma']
	},
	'py:.backward': {
		id: 'py:.backward',
		term: 'loss.backward()',
		short: String.raw`Запустить обратное распространение.`,
		body: String.raw`**.backward()** проходит [[vychislitelnyy-graf|граф]] от скалярной потери назад и **накапливает** [[gradient|градиенты]] в **.grad** каждого [[parametr|параметра]] ([[backprop|backprop]]). Перед следующим шагом нужен [[zero-grad|zero_grad()]].`,
		related: ['backward', 'gradient', 'autograd', 'zero-grad']
	},
	'py:.item': {
		id: 'py:.item',
		term: 'x.item()',
		short: String.raw`Достать Python-число из тензора-скаляра.`,
		body: String.raw`**.item()** превращает [[tenzor|тензор]] из одного элемента (например, [[loss-fn|потерю]]) в обычный float — для логирования. Складывать потери лучше как числа, иначе нечаянно удержишь [[vychislitelnyy-graf|граф]] в памяти.`,
		related: ['item-skalyar', 'loss-fn', 'tenzor']
	}
};
