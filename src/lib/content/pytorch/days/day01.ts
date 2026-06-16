import type { Day } from '$lib/types';

// ЭТАЛОННЫЙ день. Конвенции (повторять во всех днях):
//  • Все текстовые поля и поля кода — String.raw (LaTeX-бэкслеши целы, \n в коде целы).
//  • Инлайн-идентификаторы кода — **жирным** (бэктики ломают String.raw).
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.
//  • Термины [[id]] / [[id|подпись]] — из базового глоссария или dayNN.terms.ts.

export const day01: Day = {
	n: 1,
	phaseId: 'tensors',
	title: 'Тензор: главный объект PyTorch',
	chapterRef: 'pt-01',
	est: '1–2 ч',
	goal: String.raw`Понять, что весь PyTorch крутится вокруг одного объекта — [[tenzor|тензора]]. Научиться создавать тензоры, читать их [[shape-forma|форму]], [[dtype|тип]] и [[device|устройство]], и увидеть [[broadcasting|broadcasting]] в действии.`,
	sections: [
		{
			kind: 'definition',
			heading: 'Что такое тензор',
			body: String.raw`**Тензор** — это $n$-мерный массив чисел одного [[dtype|типа]]. Вся «глубина» в deep learning — это операции над тензорами:

- [[rang-tenzora|ранг]] 0 — скаляр (одно число, потеря);
- ранг 1 — вектор (эмбеддинг, признаки одного объекта);
- ранг 2 — матрица (веса слоя, [[batch|батч]] векторов);
- ранг 4 — батч картинок $(N,C,H,W)$.

Ближайший родственник — numpy-массив. Поэтому начнём с numpy: он [[tensor-numpy-most|запускается прямо здесь]] и ведёт себя как тензор почти один в один.`,
			code: {
				title: 'Тензор как массив: форма, ранг, тип (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

# «Тензор» = n-мерный массив. У каждого есть shape, ndim, dtype.
scalar = np.array(3.14)              # ранг 0
vector = np.array([1.0, 2.0, 3.0])  # ранг 1
matrix = np.arange(6).reshape(2, 3) # ранг 2

for name, t in [("скаляр", scalar), ("вектор", vector), ("матрица", matrix)]:
    print(f"{name:8} shape={t.shape} ndim={t.ndim} dtype={t.dtype}")`,
				explanation: String.raw`Запусти — увидишь [[shape-forma|форму]] и [[rang-tenzora|ранг]] каждого тензора. **shape** — кортеж размеров по осям, **ndim** — сколько осей (ранг). В PyTorch ровно те же атрибуты у [[tenzor|torch.Tensor]].`
			}
		},
		{
			kind: 'definition',
			heading: 'Создание тензоров в PyTorch',
			body: String.raw`Конструкторы [[tensor-konstruktory|повторяют numpy]]: **torch.tensor(data)** из списка, **torch.zeros / ones / randn** по форме, **torch.arange / linspace** — последовательности. Тип по умолчанию для дробных — [[dtype|float32]], для **arange** из целых — int64.

Этот код — настоящий PyTorch. В браузере он не выполнится (torch — нативная библиотека), поэтому открой его в Colab кнопкой ниже: там torch и GPU уже стоят.`,
			code: {
				title: 'Те же тензоры на torch (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch

scalar = torch.tensor(3.14)             # ранг 0, float32
vector = torch.tensor([1.0, 2.0, 3.0])  # ранг 1
matrix = torch.arange(6).reshape(2, 3)  # ранг 2, int64

print(scalar.shape, vector.shape, matrix.shape)
print("dtype:", matrix.dtype, "| device:", matrix.device)

# случайные тензоры по форме
noise = torch.randn(2, 3)               # нормальный шум, float32
print(noise)`,
				explanation: String.raw`Сравни с numpy-демо выше — API почти идентичен. Разница в [[tenzor|суперспособностях]]: этот тензор можно отправить на [[cuda|GPU]] (**.to('cuda')**) и он умеет [[autograd|считать градиенты]] (день 4).`
			}
		},
		{
			kind: 'intuition',
			heading: 'dtype и device — два «паспорта» тензора',
			body: String.raw`У каждого тензора есть [[dtype|тип элемента]] и [[device|устройство]]. Это не мелочь, а источник 90% бытовых ошибок новичка:

- складывать тензоры разных [[dtype|типов]] нельзя — нужно явное **.to(torch.float32)**;
- складывать тензоры на разных [[device|устройствах]] нельзя — **RuntimeError: expected all tensors on the same device**.

Канон один: модель и данные приводят к одному устройству и типу до операций.`
		},
		{
			kind: 'connection',
			heading: 'Мост torch ↔ numpy и broadcasting',
			body: String.raw`Тензор и numpy-массив [[tensor-numpy-most|делят память]]: **torch.from_numpy(a)** и **t.numpy()** конвертируют без копирования. Поэтому всё, что ты знаешь про numpy, переносится на PyTorch — включая [[broadcasting|broadcasting]] — правило, по которому массивы разной формы складываются, «растягивая» оси размера 1.`,
			code: {
				title: 'Broadcasting вживую (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

matrix = np.arange(6).reshape(2, 3)   # форма (2, 3)
row    = np.array([10, 20, 30])       # форма (3,)

# (2,3) + (3,): row растягивается на каждую строку матрицы
print("matrix:\n", matrix)
print("matrix + row:\n", matrix + row)

# нормировка по столбцам через broadcasting со средним
col_mean = matrix.mean(axis=0)        # (3,)
print("после вычитания среднего:\n", matrix - col_mean)`,
				explanation: String.raw`Запусти и проследи формы. [[broadcasting|Broadcasting]] экономит память и код, но молча скрывает ошибки: всегда проверяй итоговый [[shape-forma|shape]]. В torch правило ровно то же.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d1-t1',
			difficulty: 'base',
			prompt: String.raw`Тензор **a** имеет форму $(4,1,3)$, тензор **b** — форму $(3,)$. Какой [[shape-forma|формы]] будет результат **a + b** по правилам [[broadcasting|broadcasting]]?`,
			hint: String.raw`Сравнивай формы справа налево, недостающие оси слева считай за 1. Ось подходит, если размеры равны или один из них равен 1.`,
			solution: String.raw`Выравниваем справа: $(4,1,3)$ и $(1,1,3)$. По осям: $3$ и $3$ — ок; $1$ и $1$ — ок; $4$ и $1$ — растягивается до $4$. Итог — $(4,1,3)$.`,
			answer: String.raw`$(4,1,3)$.`,
			xp: 12
		},
		{
			id: 'pt-d1-t2',
			difficulty: 'base',
			prompt: String.raw`Сколько элементов в тензоре формы $(2,3,4)$? На какие формы его можно «переразложить» (**reshape**), не потеряв ни одного элемента? Приведите два примера.`,
			hint: String.raw`Число элементов — произведение размеров по осям. [[reshape-view|reshape]] сохраняет это произведение.`,
			solution: String.raw`Элементов $2\cdot3\cdot4=24$. Любая форма с произведением $24$ подойдёт, например $(24,)$, $(6,4)$, $(2,12)$, $(4,3,2)$. Удобно использовать **-1**: **t.reshape(6, -1)** сам подберёт вторую ось $=4$.`,
			answer: String.raw`$24$ элемента; напр. $(6,4)$ и $(2,12)$.`,
			xp: 12
		},
		{
			id: 'pt-d1-t3',
			difficulty: 'star',
			prompt: String.raw`Почему **torch.arange(6)** даёт [[dtype|dtype]] int64, а **torch.arange(6.0)** — float32? Как из первого получить дробный тензор двумя разными способами, и почему это важно перед подачей в нейросеть?`,
			hint: String.raw`dtype выводится из входных данных. Веса сети — float32, а смешение типов в операции запрещено.`,
			solution: String.raw`**arange(6)** получает целочисленные аргументы → int64; **arange(6.0)** — дробный → float32. Привести к float: **t.float()** или **t.to(torch.float32)** (либо сразу **torch.arange(6, dtype=torch.float32)**). Важно потому, что слои сети ([[parametr|параметры]]) — float32, и подача int-тензора вызовет ошибку типов или неверный результат.`,
			answer: String.raw`int — из целых аргументов; привести — **.float()** / **.to(torch.float32)**.`,
			xp: 25
		}
	],
	mastery: [
		'Объясняю, что тензор — n-мерный массив, и читаю его shape, ndim, dtype, device',
		'Создаю тензоры: tensor(), zeros/ones/randn, arange/linspace',
		'Предсказываю форму результата при broadcasting',
		'Понимаю, почему важны единый dtype и единое device, и умею приводить к ним'
	]
};
