import type { Day } from '$lib/types';

// Конвенции (повторять во всех днях):
//  • Все текстовые поля и поля кода — String.raw (LaTeX-бэкслеши целы, \n в коде целы).
//  • Инлайн-идентификаторы кода — **жирным** (бэктики ломают String.raw).
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.
//  • Термины [[id]] / [[id|подпись]] — из базового глоссария или dayNN.terms.ts.

export const day10: Day = {
	n: 10,
	phaseId: 'data',
	title: 'Dataset и DataLoader',
	chapterRef: 'pt-10',
	est: '1–2 ч',
	goal: String.raw`Организовать данные по канону PyTorch: описать источник примеров через [[dataset|Dataset]] ([[getitem|__getitem__]]/[[custom-dataset|__len__]]) и обернуть его [[dataloader|DataLoader]], который сам нарежет [[batch|батчи]], [[shuffle-epoch|перемешает]] их каждую [[epoch|эпоху]] и догрузит данные параллельно.`,
	sections: [
		{
			kind: 'definition',
			heading: 'Dataset: __len__ и __getitem__',
			body: String.raw`[[dataset|Dataset]] — это всего лишь объект, отвечающий на два вопроса: «сколько у тебя примеров?» ([[custom-dataset|__len__]]) и «дай мне $i$-й пример» ([[getitem|__getitem__]]). Больше ничего: ни батчей, ни перемешивания — только доступ к **одному** элементу по индексу.

Это и есть точка расширения. Хочешь читать картинки с диска, парсить строки CSV, генерировать данные на лету — пишешь свой класс с этими двумя методами, и весь остальной конвейер PyTorch начинает с ним работать.

Главное правило: [[getitem|__getitem__(i)]] возвращает **один** пример — обычно пару $(x, y)$ из [[tenzor|тензоров]] (признаки и метку), а не батч. Батчи соберёт уже [[dataloader|DataLoader]].`,
			code: {
				title: 'Доступ по индексу: Dataset как массив (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

# Эмулируем Dataset: хранит X, y и отдаёт ОДИН пример по индексу.
class ToyDataset:
    def __init__(self, X, y):
        self.X, self.y = X, y
    def __len__(self):              # сколько примеров
        return len(self.X)
    def __getitem__(self, i):       # i-й пример как пара (x, y)
        return self.X[i], self.y[i]

ds = ToyDataset(np.arange(12).reshape(6, 2), np.array([0, 1, 0, 1, 0, 1]))
print("len(ds) =", len(ds))
x0, y0 = ds[0]                       # сработает __getitem__(0)
print("ds[0]: x =", x0, "| y =", y0, "| x.shape =", x0.shape)`,
				explanation: String.raw`**ds[0]** под капотом вызывает [[getitem|__getitem__(0)]] и возвращает **один** пример, а не батч — у **x** форма $(2,)$, а не $(N,2)$. В настоящем PyTorch ровно тот же контракт: наследуешь **torch.utils.data.Dataset** и пишешь эти два метода.`
			}
		},
		{
			kind: 'definition',
			heading: 'DataLoader: батчи, shuffle, drop_last',
			body: String.raw`[[dataloader|DataLoader]] оборачивает [[dataset|Dataset]] и превращает поток одиночных примеров в [[batch|батчи]]. По нему просто итерируются в цикле обучения, а он сам делает рутину:

- **batch_size** — сколько примеров склеить в один [[batch|батч]] ([[batch-size|подробнее]]);
- **shuffle=True** — [[shuffle-epoch|перемешать]] порядок перед каждой [[epoch|эпохой]];
- **drop_last=True** — выкинуть последний неполный батч (если число примеров не делится на **batch_size**);
- **num_workers** — сколько [[num-workers|процессов-загрузчиков]] готовят данные параллельно.

Внутри DataLoader склеивает примеры в батч функцией **collate**: по умолчанию она берёт $k$ пар $(x_i,y_i)$ и складывает все $x$ в один [[tenzor|тензор]] формы $(k,\dots)$, все $y$ — в другой. Поэтому из [[getitem|__getitem__]] и надо возвращать тензоры одинаковой формы.`,
			code: {
				title: 'Эмулируем DataLoader на numpy: перемешать и нарезать',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
N, batch_size = 10, 4
X = np.arange(N * 2).reshape(N, 2)   # 10 примеров по 2 признака
y = np.arange(N)                      # 10 меток

idx = np.random.permutation(N)        # перемешали порядок примеров (shuffle)
print("порядок примеров:", idx)

for b, start in enumerate(range(0, N, batch_size)):
    take = idx[start:start + batch_size]   # индексы примеров этого батча
    xb, yb = X[take], y[take]              # collate: склеили в тензоры батча
    print(f"батч {b}: xb.shape={xb.shape} yb.shape={yb.shape} метки={yb.tolist()}")`,
				explanation: String.raw`Вот и весь DataLoader в трёх строках: **np.random.permutation** = [[shuffle-epoch|shuffle]], нарезка по **batch_size**, сборка в тензоры батча = **collate**. Последний батч короче (форма $(2,2)$ вместо $(4,2)$) — именно его и убрал бы **drop_last=True**.`
			}
		},
		{
			kind: 'intuition',
			heading: 'Зачем перемешивать каждую эпоху',
			body: String.raw`Если данные лежат отсортированными по классу (сначала все «0», потом все «1»), то **без** [[shuffle-epoch|shuffle]] первые [[batch|батчи]] будут состоять из одних нулей, последние — из одних единиц. Градиент по такому однородному батчу тянет модель то в одну сторону, то в другую — обучение дёргается и плохо сходится.

[[shuffle-epoch|shuffle=True]] перемешивает порядок **заново каждую [[epoch|эпоху]]**, так что батчи получаются разнородными и в разном составе на каждом проходе. Это снижает корреляцию между соседними шагами [[sgd|SGD]] и делает оценку [[gradient|градиента]] по батчу более репрезентативной.

Важная деталь: перемешивают **только трейн**. На валидации/тесте [[shuffle-epoch|shuffle]] не нужен — порядок не влияет на метрику, а фиксированный порядок упрощает отладку.`,
			code: {
				title: 'shuffle ломает однородность батчей (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
N, batch_size = 6, 3
y = np.array([0, 0, 0, 1, 1, 1])      # данные ОТСОРТИРОВАНЫ по классу!

print("без shuffle — батчи однородны по классу:")
for start in range(0, N, batch_size):
    print("  батч:", y[start:start + batch_size].tolist())

print("с shuffle — классы перемешаны, и порядок РАЗНЫЙ каждую эпоху:")
for ep in range(2):
    idx = np.random.permutation(N)    # новый порядок на каждую эпоху
    batches = [idx[s:s + batch_size] for s in range(0, N, batch_size)]
    print(f"  эпоха {ep}:", [y[b].tolist() for b in batches])`,
				explanation: String.raw`Без перемешивания первый батч — три «0», второй — три «1»: модель видит классы по очереди. С [[shuffle-epoch|shuffle]] каждый батч смешанный, и состав меняется от эпохи к эпохе — ровно то, что даёт **shuffle=True** в DataLoader.`
			}
		},
		{
			kind: 'connection',
			heading: 'Свой Dataset и TensorDataset',
			body: String.raw`Когда данные уже лежат в памяти как [[tenzor|тензоры]] (например, признаки и метки таблицы), писать класс вручную не обязательно — есть готовый [[tensor-dataset|TensorDataset]]: оборачиваешь тензоры, и он сам реализует [[getitem|__getitem__]] (срез по первой оси) и [[custom-dataset|__len__]].

Свой класс ([[custom-dataset|собственный Dataset]]) нужен, когда данные не помещаются в память или требуют обработки: читать $i$-ю картинку с диска в [[getitem|__getitem__]], применять трансформы (нормализацию, аугментацию), парсить текст. Тогда [[getitem|__getitem__]] возвращает уже обработанный пример.

Оба варианта подключаются к [[dataloader|DataLoader]] одинаково — ему всё равно, откуда берутся примеры, лишь бы работали два метода. В этом и сила контракта: данные и батчинг полностью развязаны.`
		},
		{
			kind: 'note',
			heading: 'drop_last и num_workers — детали, которые ловят новичка',
			body: String.raw`Две настройки [[dataloader|DataLoader]], про которые часто забывают:

- [[num-workers|num_workers]] — сколько отдельных процессов готовят батчи параллельно, пока GPU считает предыдущий. **0** (по умолчанию) — загрузка в основном процессе, и если [[getitem|__getitem__]] тяжёлый (чтение с диска, декодирование), GPU будет простаивать. **num_workers=4** обычно заметно ускоряет; слишком много — накладные расходы на процессы.

- **drop_last=True** — выкинуть последний неполный [[batch|батч]]. Нужен, когда код требует фиксированного размера батча (например, [[batchnorm|BatchNorm]] плохо себя ведёт на батче из 1 примера) или чтобы все шаги были одинаковой «тяжести». На валидации обычно оставляют **drop_last=False**, чтобы не терять примеры при подсчёте метрики.`,
			code: {
				title: 'drop_last: судьба последнего неполного батча (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

N, batch_size = 10, 4
idx = np.arange(N)
full = [idx[s:s + batch_size] for s in range(0, N, batch_size)]
print("drop_last=False — все батчи, размеры:", [len(b) for b in full])

kept = [b for b in full if len(b) == batch_size]
print("drop_last=True  — только ровные:     ", [len(b) for b in kept])
print(f"выкинули {len(full) - len(kept)} неполный батч из {len(full)}")`,
				explanation: String.raw`$10$ примеров при **batch_size=4** дают батчи $4+4+2$. **drop_last=True** убирает «хвост» из $2$ примеров — остаются только батчи ровно по $4$. Цена — потеря данных каждую эпоху, поэтому на тесте его не включают.`
			}
		},
		{
			kind: 'plain',
			heading: 'Настоящий PyTorch: свой Dataset + DataLoader',
			body: String.raw`Собираем всё вместе на реальном PyTorch: наследуем **torch.utils.data.Dataset**, пишем [[custom-dataset|__len__]] и [[getitem|__getitem__]], оборачиваем [[dataloader|DataLoader]] с **batch_size=32**, **shuffle=True** — и итерируемся. Открой в Colab и посмотри форму первого [[batch|батча]].`,
			code: {
				title: 'Свой Dataset и DataLoader (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
from torch.utils.data import Dataset, DataLoader, TensorDataset

class PointsDataset(Dataset):
    def __init__(self, n=200):
        self.X = torch.randn(n, 4)          # n примеров, 4 признака
        self.y = (self.X.sum(dim=1) > 0).long()  # бинарная метка
    def __len__(self):
        return len(self.X)
    def __getitem__(self, i):               # ОДИН пример: (x_i, y_i)
        return self.X[i], self.y[i]

ds = PointsDataset()
loader = DataLoader(ds, batch_size=32, shuffle=True, num_workers=2, drop_last=True)

xb, yb = next(iter(loader))                 # первый батч
print("батчей за эпоху:", len(loader))
print("xb.shape =", xb.shape, "| yb.shape =", yb.shape)  # (32, 4) и (32,)

# Если данные уже тензоры — можно без своего класса:
same = DataLoader(TensorDataset(ds.X, ds.y), batch_size=32, shuffle=True)
print("TensorDataset даёт то же самое:", next(iter(same))[0].shape)`,
				explanation: String.raw`[[getitem|__getitem__]] отдаёт пример формы $(4,)$, а [[dataloader|DataLoader]] склеил $32$ таких в батч $(32,4)$ — это и есть **collate** по умолчанию. [[tensor-dataset|TensorDataset]] — короткий путь, когда писать класс ради среза по первой оси не нужно. В цикле обучения по **loader** просто итерируются: **for xb, yb in loader:**.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d10-t1',
			difficulty: 'base',
			prompt: String.raw`Что должен возвращать [[getitem|__getitem__(i)]] в [[dataset|Dataset]] — один пример или целый [[batch|батч]]? Какой [[shape-forma|формы]] будет **x**, если у одного примера 4 признака, и какой формы станет батч из 16 таких примеров после [[dataloader|DataLoader]]?`,
			hint: String.raw`Dataset работает с одним элементом по индексу. Сборкой в батч занимается DataLoader (collate), добавляя первую ось — размер батча.`,
			solution: String.raw`[[getitem|__getitem__(i)]] возвращает **один** пример — обычно пару $(x_i, y_i)$ из [[tenzor|тензоров]]. При 4 признаках **x** имеет форму $(4,)$. [[dataloader|DataLoader]] функцией **collate** склеивает 16 таких примеров, добавляя первую ось — размер [[batch|батча]]: получается тензор $(16, 4)$ (и метки $(16,)$).`,
			answer: String.raw`Один пример; **x** — $(4,)$, батч — $(16,4)$.`,
			xp: 12
		},
		{
			id: 'pt-d10-t2',
			difficulty: 'base',
			prompt: String.raw`Зачем ставить [[shuffle-epoch|shuffle=True]] в [[dataloader|DataLoader]] для трейна, и почему перемешивать нужно **каждую [[epoch|эпоху]]**, а не один раз? Нужен ли [[shuffle-epoch|shuffle]] на валидации?`,
			hint: String.raw`Подумай про отсортированные по классу данные и про корреляцию соседних шагов SGD. Влияет ли порядок примеров на значение метрики?`,
			solution: String.raw`Если данные упорядочены (например, по классу), без перемешивания [[batch|батчи]] однородны, и [[gradient|градиент]] дёргает модель то в одну сторону, то в другую — обучение плохо сходится. [[shuffle-epoch|shuffle=True]] делает батчи разнородными и снижает корреляцию соседних шагов [[sgd|SGD]]. Перемешивать **каждую эпоху** важно, чтобы состав батчей менялся от прохода к проходу — иначе модель каждую эпоху видит одни и те же группы. На валидации/тесте [[shuffle-epoch|shuffle]] не нужен: порядок не влияет на метрику, а фиксированный порядок удобнее для отладки.`,
			answer: String.raw`Чтобы батчи были разнородными и шаги SGD некоррелированы; каждую эпоху — ради нового состава; на валидации не нужен.`,
			xp: 12
		},
		{
			id: 'pt-d10-t3',
			difficulty: 'star',
			prompt: String.raw`У [[dataset|датасета]] из 1000 примеров стоит **batch_size=64**. (а) Сколько батчей за [[epoch|эпоху]] при **drop_last=False** и при **drop_last=True**, и какого размера последний батч в первом случае? (б) Объясни, что делает [[num-workers|num_workers]] и в какой ситуации его увеличение реально ускорит обучение, а когда — нет.`,
			hint: String.raw`$1000 = 64\cdot 15 + 40$. num_workers — параллельная подготовка батчей; узкое место — тяжёлый __getitem__ против лёгкого.`,
			solution: String.raw`**(а)** $1000 = 64\cdot 15 + 40$. При **drop_last=False** — $16$ батчей, последний размера $40$. При **drop_last=True** неполный «хвост» выкидывается — остаётся $15$ полных батчей по $64$.

**(б)** [[num-workers|num_workers]] — число процессов, которые **параллельно** готовят [[batch|батчи]] (вызывают [[getitem|__getitem__]]), пока GPU считает предыдущий. Увеличение помогает, когда [[getitem|__getitem__]] тяжёлый — чтение картинок с диска, декодирование, трансформы: загрузка перестаёт быть узким местом, GPU не простаивает. Если же данные уже в памяти ([[tensor-dataset|TensorDataset]]) и [[getitem|__getitem__]] — это просто срез тензора, выгоды почти нет, а лишние процессы добавляют накладные расходы (запуск, копирование) и могут даже замедлить.`,
			answer: String.raw`(а) 16 батчей (последний — 40) либо 15. (б) num_workers ускоряет при тяжёлом __getitem__ (диск/декод), бесполезен при лёгком срезе из памяти.`,
			xp: 25
		}
	],
	mastery: [
		'Пишу свой Dataset с __len__ и __getitem__; знаю, что __getitem__ возвращает один пример',
		'Оборачиваю Dataset в DataLoader и читаю смысл batch_size, shuffle, drop_last, num_workers',
		'Объясняю, зачем перемешивать трейн каждую эпоху и почему не перемешивают валидацию',
		'Выбираю TensorDataset для данных в памяти и свой класс — для чтения/трансформов на лету'
	]
};
