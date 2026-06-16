import type { Glossary } from '$lib/types';

// AUTO-GENERATED API tooltip cards (numpy/torch tokens used across the course).
// Source: code-glossary authoring workflow. Hand-curated core lives in codeGlossary.ts.

export const codeGlossaryGen: Glossary = {
	"py:nn": {
		id: "py:nn",
		term: String.raw`import torch.nn as nn`,
		short: String.raw`Модуль слоёв и функций потерь PyTorch.`,
		body: String.raw`**nn** — строительные блоки сетей: слои (**nn.Linear**, **nn.Conv2d**), активации (**nn.ReLU**), контейнеры (**nn.Sequential**) и [[loss-fn|функции потерь]]. Всё это [[nn-module|nn.Module]] с обучаемыми [[parametr|параметрами]].`,
		related: ["nn-module","parametr","loss-fn"]
	},
	"py:optim": {
		id: "py:optim",
		term: String.raw`import torch.optim as optim`,
		short: String.raw`Модуль оптимизаторов PyTorch.`,
		body: String.raw`**optim** содержит [[optimizer|оптимизаторы]] — **optim.SGD**, **optim.Adam** и др. Они обновляют [[parametr|параметры]] по накопленным [[gradient|градиентам]] в ходе [[gradient-spusk|градиентного спуска]]. Создаются от **model.parameters()**.`,
		related: ["optimizer","sgd","adam","gradient-spusk"]
	},
	"py:numpy": {
		id: "py:numpy",
		term: String.raw`import numpy as np`,
		short: String.raw`Библиотека n-мерных массивов.`,
		body: String.raw`**numpy** — быстрые векторные операции над $n$-мерными массивами на C. В этом курсе на нём показаны живые демо, а его API почти один в один повторяет [[tenzor|тензоры]] PyTorch.`,
		related: ["tenzor","broadcasting"]
	},
	"py:np.random.randn": {
		id: "py:np.random.randn",
		term: String.raw`np.random.randn(*shape)`,
		short: String.raw`Массив из стандартного нормального шума.`,
		body: String.raw`**np.random.randn(2, 3)** возвращает массив формы $(2,3)$ из $\mathcal N(0,1)$. Удобно для генерации случайных данных и инициализации. Для воспроизводимости — **np.random.seed**. Torch-аналог — **torch.randn**.`,
		formula: String.raw`x_{ij}\sim\mathcal N(0,1)`,
		related: ["py:np.random.seed","py:torch.randn"]
	},
	"py:.mean": {
		id: "py:.mean",
		term: String.raw`x.mean(dim=None, keepdim=False)`,
		short: String.raw`Среднее по всему тензору или вдоль оси.`,
		body: String.raw`**.mean()** усредняет все элементы; **.mean(dim=k)** — вдоль оси $k$ (ось исчезает). [[reshape-view|keepdim=True]] оставляет её размером 1 — удобно для [[broadcasting|broadcasting]]. Работает только для дробных [[dtype|типов]].`,
		formula: String.raw`\bar x=\frac1n\sum_i x_i`,
		related: ["broadcasting","dtype"]
	},
	"py:np.random.seed": {
		id: "py:np.random.seed",
		term: String.raw`np.random.seed(seed)`,
		short: String.raw`Зафиксировать генератор случайных чисел.`,
		body: String.raw`**np.random.seed(42)** делает последующий случайный код воспроизводимым: **np.random.randn** и др. дадут одни и те же числа при каждом запуске. Torch-аналог — **torch.manual_seed**.`,
		related: ["py:np.random.randn"]
	},
	"py:.to": {
		id: "py:.to",
		term: String.raw`x.to(device)`,
		short: String.raw`Перенести тензор/модель на устройство или сменить dtype.`,
		body: String.raw`**.to(device)** копирует [[tenzor|тензор]] на нужное [[device|устройство]] ([[cuda|GPU]] или CPU); можно передать и [[dtype|тип]], напр. **.to(torch.float32)**. Перед вычислением входы и модель должны быть на одном устройстве.`,
		related: ["device","cuda","dtype","tenzor"]
	},
	"py:torch.nn": {
		id: "py:torch.nn",
		term: String.raw`torch.nn`,
		short: String.raw`Подмодуль PyTorch со слоями и потерями.`,
		body: String.raw`**torch.nn** — слои, активации и [[loss-fn|функции потерь]] для построения сетей; обычно импортируется как **nn**. Базовый класс — [[nn-module|nn.Module]], его наследуют все модели и слои.`,
		related: ["nn-module","py:nn","loss-fn"]
	},
	"py:np.mean": {
		id: "py:np.mean",
		term: String.raw`np.mean(a, axis=None)`,
		short: String.raw`Среднее массива по всему или вдоль оси.`,
		body: String.raw`**np.mean(a)** усредняет все элементы; **np.mean(a, axis=k)** — вдоль оси $k$. Torch-аналог — **.mean** на тензоре. Не путать с **np.sum**, делящим без нормировки.`,
		formula: String.raw`\bar a=\frac1n\sum_i a_i`,
		related: ["py:.mean"]
	},
	"py:nn.ReLU": {
		id: "py:nn.ReLU",
		term: String.raw`nn.ReLU()`,
		short: String.raw`Активация ReLU: max(0, x).`,
		body: String.raw`**nn.ReLU** — нелинейность $\max(0,x)$: обнуляет отрицательные значения. Ставится между [[nn-module|линейными слоями]], чтобы сеть могла выражать нелинейные функции. Это [[nn-module|nn.Module]] без [[parametr|параметров]].`,
		formula: String.raw`\mathrm{ReLU}(x)=\max(0,x)`,
		related: ["nn-module","py:nn.Sequential"]
	},
	"py:nn.Sequential": {
		id: "py:nn.Sequential",
		term: String.raw`nn.Sequential(*modules)`,
		short: String.raw`Контейнер: слои подряд.`,
		body: String.raw`**nn.Sequential** соединяет [[nn-module|модули]] в цепочку — выход одного идёт на вход следующему. Удобно для простых стеков, напр. **nn.Sequential(nn.Linear(2,8), nn.ReLU(), nn.Linear(8,1))**. Его **.parameters()** собирает параметры всех вложенных слоёв.`,
		related: ["nn-module","py:nn.ReLU","py:nn.Linear","py:.parameters"]
	},
	"py:.parameters": {
		id: "py:.parameters",
		term: String.raw`model.parameters()`,
		short: String.raw`Итератор по обучаемым параметрам модели.`,
		body: String.raw`**.parameters()** перебирает все [[parametr|параметры]] [[nn-module|модуля]] (веса и смещения). Передаётся в [[optimizer|оптимизатор]]: **optim.SGD(model.parameters(), lr=0.01)**, чтобы тот знал, что обновлять.`,
		related: ["parametr","nn-module","optimizer"]
	},
	"py:np.zeros": {
		id: "py:np.zeros",
		term: String.raw`np.zeros(shape, dtype=float)`,
		short: String.raw`Массив заданной формы из нулей.`,
		body: String.raw`**np.zeros((2, 3))** создаёт массив формы $(2,3)$, заполненный нулями. Полезно для аккумуляторов и заготовок. Torch-аналог — **torch.zeros**; парный по смыслу — **np.ones**.`,
		related: ["dtype","tenzor"]
	},
	"py:.argmax": {
		id: "py:.argmax",
		term: String.raw`x.argmax(dim=None, keepdim=False)`,
		short: String.raw`Индекс максимального элемента.`,
		body: String.raw`**.argmax()** возвращает индекс наибольшего элемента по всему тензору; **.argmax(dim=k)** — вдоль оси $k$ (ось исчезает). Главное применение — перевести логиты/[[softmax|вероятности]] в предсказанный класс. Numpy-аналог — **np.argmax**.`,
		related: ["softmax","cross-entropy"]
	},
	"py:.astype": {
		id: "py:.astype",
		term: String.raw`x.astype(dtype)`,
		short: String.raw`Привести массив к другому типу.`,
		body: String.raw`**.astype** возвращает копию numpy-массива с новым [[dtype|типом]] (например **np.float32** или **np.int64**). Часто нужен перед передачей в модель, чтобы совпали типы. Torch-аналог — **.to(dtype)** или **.float()**.`,
		related: ["dtype","tenzor"]
	},
	"py:.eval": {
		id: "py:.eval",
		term: String.raw`model.eval()`,
		short: String.raw`Переключить модель в режим оценки.`,
		body: String.raw`**.eval()** переводит [[nn-module|модуль]] в режим инференса: [[dropout|dropout]] отключается, [[batchnorm|BatchNorm]] использует накопленную статистику. Обратно — **.train()**. На сами [[gradient|градиенты]] не влияет; для отключения [[autograd|графа]] оборачивай в **torch.no_grad()**.`,
		related: ["train-eval","dropout","batchnorm"]
	},
	"py:torch.no_grad": {
		id: "py:torch.no_grad",
		term: String.raw`with torch.no_grad():`,
		short: String.raw`Контекст без построения графа autograd.`,
		body: String.raw`**torch.no_grad()** отключает [[autograd|autograd]] внутри блока: операции не пишутся в [[vychislitelnyy-graf|граф]], экономятся память и время. Используется при валидации и инференсе вместе с **model.eval()**. Сам по себе [[dropout|dropout]]/[[batchnorm|BatchNorm]] не переключает — за это отвечает **.eval()**.`,
		related: ["autograd","vychislitelnyy-graf","train-eval","py:.eval"]
	},
	"py:np.random.rand": {
		id: "py:np.random.rand",
		term: String.raw`np.random.rand(*shape)`,
		short: String.raw`Равномерный шум на [0, 1).`,
		body: String.raw`**np.random.rand(2, 3)** даёт массив формы $(2,3)$ из равномерного $U[0,1)$. Не путать с **np.random.randn** (нормальный $\mathcal N(0,1)$). Для воспроизводимости фиксируй **np.random.seed**.`,
		related: ["py:np.array"]
	},
	"py:np.round": {
		id: "py:np.round",
		term: String.raw`np.round(a, decimals=0)`,
		short: String.raw`Округлить элементы массива.`,
		body: String.raw`**np.round** округляет до **decimals** знаков (по умолчанию до целого), банковским правилом (.5 — к чётному). Возвращает новый массив того же [[dtype|типа]] float. Не меняет исходные данные.`,
		related: ["dtype"]
	},
	"py:.step": {
		id: "py:.step",
		term: String.raw`optimizer.step()`,
		short: String.raw`Сделать шаг обновления параметров.`,
		body: String.raw`**.step()** применяет к [[parametr|параметрам]] накопленные в **.grad** [[gradient|градиенты]] по правилу [[optimizer|оптимизатора]] ([[sgd|SGD]], [[adam|Adam]] и т.д.). Вызывается после **loss.backward()**; перед следующей итерацией — **.zero_grad()**. У [[scheduler|шедулера]] тоже есть свой **.step()**.`,
		formula: String.raw`\theta \leftarrow \theta - \eta\,\nabla_\theta L`,
		related: ["optimizer","gradient-spusk","py:.backward","zero-grad","learning-rate"]
	},
	"py:.state_dict": {
		id: "py:.state_dict",
		term: String.raw`model.state_dict()`,
		short: String.raw`Словарь всех обучаемых параметров.`,
		body: String.raw`**.state_dict()** возвращает упорядоченный словарь {имя: тензор} со всеми [[parametr|весами]] и буферами [[nn-module|модуля]]. Это то, что сохраняют через **torch.save** и грузят через **load_state_dict**. Есть и у [[optimizer|оптимизатора]] — хранит его состояние.`,
		related: ["state-dict","nn-module","parametr"]
	},
	"py:.zero_grad": {
		id: "py:.zero_grad",
		term: String.raw`optimizer.zero_grad()`,
		short: String.raw`Обнулить накопленные градиенты.`,
		body: String.raw`**.zero_grad()** сбрасывает **.grad** у [[parametr|параметров]] в ноль. Нужен потому, что **.backward()** [[gradient|градиенты]] **накапливает** — без сброса они сложатся между шагами. Порядок цикла: **zero_grad → backward → step**.`,
		related: ["zero-grad","py:.backward","py:.step","gradient"]
	},
	"py:torch.cuda.is_available": {
		id: "py:torch.cuda.is_available",
		term: String.raw`torch.cuda.is_available()`,
		short: String.raw`Доступна ли видеокарта (GPU).`,
		body: String.raw`**torch.cuda.is_available()** возвращает **True**, если PyTorch видит [[cuda|CUDA]]-GPU. Типичный приём — выбрать [[device|устройство]]: **device = 'cuda' if torch.cuda.is_available() else 'cpu'**, затем **model.to(device)**.`,
		related: ["cuda","device"]
	},
	"py:np.shares_memory": {
		id: "py:np.shares_memory",
		term: String.raw`np.shares_memory(a, b)`,
		short: String.raw`Делят ли массивы общую память.`,
		body: String.raw`**np.shares_memory(a, b)** проверяет, ссылаются ли два массива на одни и те же данные. Полезно понять, дал ли срез/**reshape** представление (view) или копию: у view запись в один массив меняет другой.`,
		related: ["py:.reshape"]
	},
	"py:nn.Module": {
		id: "py:nn.Module",
		term: String.raw`class Net(nn.Module):`,
		short: String.raw`Базовый класс всех моделей и слоёв.`,
		body: String.raw`**nn.Module** — родитель любой сети: хранит [[parametr|параметры]] и подмодули, даёт **.parameters()**, **.to()**, **.state_dict()**. Свою модель наследуют от него, слои задают в **__init__**, а вычисление — в [[forward|forward]]. Вызов **model(x)** запускает **forward** через **__call__**.`,
		related: ["nn-module","forward","parametr"]
	},
	"py:nn.CrossEntropyLoss": {
		id: "py:nn.CrossEntropyLoss",
		term: String.raw`nn.CrossEntropyLoss()`,
		short: String.raw`Функция потерь для классификации.`,
		body: String.raw`**nn.CrossEntropyLoss** объединяет [[softmax|softmax]] и [[cross-entropy|кросс-энтропию]]: на вход — сырые **логиты** $(N, C)$ и целочисленные метки классов $(N,)$. Отдельный **softmax** применять не нужно — он внутри. Для бинарного случая берут **BCEWithLogitsLoss**.`,
		formula: String.raw`L = -\sum_c y_c \log \hat{p}_c`,
		related: ["cross-entropy","softmax","loss-fn"]
	},
	"py:np.sum": {
		id: "py:np.sum",
		term: String.raw`np.sum(a, axis=None, keepdims=False)`,
		short: String.raw`Сумма всех элементов или вдоль оси.`,
		body: String.raw`**np.sum(a)** складывает все элементы массива; **np.sum(a, axis=k)** — вдоль оси $k$ (она исчезает). **keepdims=True** оставляет ось размером 1 — удобно для [[broadcasting|broadcasting]]. Torch-аналог — **x.sum**.`,
		related: ["py:.sum","broadcasting"]
	},
	"py:np.sqrt": {
		id: "py:np.sqrt",
		term: String.raw`np.sqrt(x)`,
		short: String.raw`Поэлементный квадратный корень.`,
		body: String.raw`**np.sqrt** считает $\sqrt{x}$ для каждого элемента массива. Отрицательные значения дают **nan**. Torch-аналог — **torch.sqrt**.`,
		formula: String.raw`\sqrt{x}`,
		related: ["py:torch.sqrt"]
	},
	"py:.shares_memory": {
		id: "py:.shares_memory",
		term: String.raw`np.shares_memory(a, b)`,
		short: String.raw`Проверить, делят ли массивы одну память.`,
		body: String.raw`**np.shares_memory** возвращает **True**, если массивы **a** и **b** ссылаются на одни и те же данные (например, **b** — это view от **a**). Полезно, чтобы понять, скопировались данные или это представление; срезы и **.reshape** часто дают общую память.`,
		related: ["py:.reshape","tenzor"]
	},
	"py:.tanh": {
		id: "py:.tanh",
		term: String.raw`x.tanh()`,
		short: String.raw`Гиперболический тангенс поэлементно.`,
		body: String.raw`**.tanh()** применяет $\tanh$ к каждому элементу [[tenzor|тензора]], сжимая значения в $(-1, 1)$. Гладкая активация, центрированная около нуля. Аналог-функция — **torch.tanh**.`,
		formula: String.raw`\tanh(x)=\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}`,
		related: ["py:np.tanh","tenzor"]
	},
	"py:.max": {
		id: "py:.max",
		term: String.raw`x.max(dim=None, keepdim=False)`,
		short: String.raw`Максимум по всему тензору или вдоль оси.`,
		body: String.raw`**.max()** даёт наибольший элемент; **.max(dim=k)** возвращает пару (значения, индексы) вдоль оси $k$. **keepdim=True** сохраняет ось размером 1 для [[broadcasting|broadcasting]]. Так же работают **.min/.sum/.mean**.`,
		related: ["py:.sum","broadcasting"]
	},
	"py:.load_state_dict": {
		id: "py:.load_state_dict",
		term: String.raw`model.load_state_dict(state_dict)`,
		short: String.raw`Загрузить веса из словаря состояния.`,
		body: String.raw`**.load_state_dict** копирует [[parametr|параметры]] и буферы из [[state-dict|state_dict]] в модель — имена и формы должны совпасть. Шаг восстановления чекпойнта: сперва **torch.load**, затем эта загрузка. У [[optimizer|оптимизатора]] есть свой такой метод.`,
		related: ["state-dict","parametr","nn-module"]
	},
	"py:.sqrt": {
		id: "py:.sqrt",
		term: String.raw`x.sqrt()`,
		short: String.raw`Поэлементный квадратный корень тензора.`,
		body: String.raw`**.sqrt()** считает $\sqrt{x}$ для каждого элемента [[tenzor|тензора]]. Часто встречается в нормировках и в формулах [[optimizer|оптимизаторов]] (например, [[adam|Adam]]). Numpy-аналог — **np.sqrt**.`,
		formula: String.raw`\sqrt{x}`,
		related: ["py:np.sqrt","tenzor"]
	},
	"py:np.ones": {
		id: "py:np.ones",
		term: String.raw`np.ones(shape, dtype=float)`,
		short: String.raw`Массив из единиц заданной формы.`,
		body: String.raw`**np.ones((2, 3))** создаёт массив формы $(2,3)$, заполненный $1$. [[dtype|Тип]] по умолчанию float64. Парный к **np.zeros**; torch-аналог — **torch.ones**.`,
		related: ["dtype","tenzor"]
	},
	"py:np.tanh": {
		id: "py:np.tanh",
		term: String.raw`np.tanh(x)`,
		short: String.raw`Гиперболический тангенс поэлементно.`,
		body: String.raw`**np.tanh** применяет $\tanh$ к каждому элементу массива, отображая значения в $(-1, 1)$. Классическая активация, центрированная около нуля. Torch-аналог — **torch.tanh** или **x.tanh**.`,
		formula: String.raw`\tanh(x)=\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}`,
		related: ["py:.tanh"]
	},
	"py:np.exp": {
		id: "py:np.exp",
		term: String.raw`np.exp(x)`,
		short: String.raw`Экспонента поэлементно.`,
		body: String.raw`**np.exp** считает $e^{x}$ для каждого элемента массива. Основа [[softmax|softmax]] и многих вероятностных формул; больших аргументов берегись — может переполниться. Torch-аналог — **torch.exp**.`,
		formula: String.raw`e^{x}`,
		related: ["softmax"]
	},
	"py:torch.randint": {
		id: "py:torch.randint",
		term: String.raw`torch.randint(low, high, size)`,
		short: String.raw`Тензор случайных целых из [low, high).`,
		body: String.raw`**torch.randint(0, 10, (3,))** даёт [[tenzor|тензор]] формы $(3,)$ из целых $[low, high)$. Верхняя граница не включается. Удобно для случайных индексов [[batch|батча]] или меток классов. Для воспроизводимости — **torch.manual_seed**.`,
		related: ["tenzor","batch"]
	},
	"py:torch.optim.Adam": {
		id: "py:torch.optim.Adam",
		term: String.raw`torch.optim.Adam(params, lr=1e-3)`,
		short: String.raw`Оптимизатор Adam с адаптивным шагом.`,
		body: String.raw`**torch.optim.Adam** — [[optimizer|оптимизатор]] с моментами и адаптивным [[learning-rate|шагом]] на параметр (см. [[adam|Adam]]). Принимает **model.parameters()** и **lr**. Цикл: [[zero-grad|zero_grad]] → [[backward|backward]] → **.step()**. Регуляризацию весов лучше через **weight_decay**.`,
		related: ["adam","optimizer","learning-rate","zero-grad"]
	},
	"py:torch.utils.data": {
		id: "py:torch.utils.data",
		term: String.raw`import torch.utils.data`,
		short: String.raw`Подмодуль для датасетов и загрузчиков.`,
		body: String.raw`**torch.utils.data** — инструменты подачи данных: **Dataset** (см. [[dataset|датасет]]) описывает элементы, **DataLoader** (см. [[dataloader|загрузчик]]) собирает их в [[batch|батчи]], перемешивает и грузит параллельно. Основа цикла обучения по [[epoch|эпохам]].`,
		related: ["dataset","dataloader","batch"]
	},
	"py:torch.save": {
		id: "py:torch.save",
		term: String.raw`torch.save(obj, f)`,
		short: String.raw`Сохранить тензор/модель в файл.`,
		body: String.raw`**torch.save** сериализует объект (тензор, [[state-dict|state_dict]] модели, [[optimizer|оптимизатор]]) в файл через pickle. Рекомендуется сохранять именно **model.state_dict()**, а не всю модель. Загрузка обратно — **torch.load**.`,
		related: ["py:torch.load","state-dict","nn-module"]
	},
	"py:.exp": {
		id: "py:.exp",
		term: String.raw`x.exp()`,
		short: String.raw`Поэлементная экспонента e^x.`,
		body: String.raw`**.exp()** возвращает $e^x$ для каждого элемента [[tenzor|тензора]]. Встречается в [[softmax|softmax]] и при работе с лог-вероятностями. Numpy-аналог — **np.exp**.`,
		formula: String.raw`\exp(x) = e^{x}`,
		related: ["py:np.log","softmax","tenzor"]
	},
	"py:.train": {
		id: "py:.train",
		term: String.raw`model.train(mode=True)`,
		short: String.raw`Перевести модель в режим обучения.`,
		body: String.raw`**.train()** включает режим обучения у [[nn-module|nn.Module]]: [[dropout|dropout]] активен, [[batchnorm|BatchNorm]] обновляет статистики по батчу. Перед валидацией переключай на **.eval()** ([[train-eval|train/eval]]).`,
		related: ["train-eval","nn-module","dropout","batchnorm"]
	},
	"py:.size": {
		id: "py:.size",
		term: String.raw`x.size(dim=None)`,
		short: String.raw`Форма тензора (или размер по оси).`,
		body: String.raw`**.size()** возвращает [[tenzor|форму]] тензора как **torch.Size**; **.size(0)** даёт длину вдоль оси 0. Эквивалент атрибута **.shape**. В numpy форму смотрят через **.shape** (а **.size** там — общее число элементов).`,
		related: ["tenzor"]
	},
	"py:.var": {
		id: "py:.var",
		term: String.raw`x.var(dim=None, unbiased=True)`,
		short: String.raw`Дисперсия по тензору или вдоль оси.`,
		body: String.raw`**.var()** считает дисперсию $\frac{1}{N-1}\sum (x_i-\bar x)^2$ (по умолчанию несмещённую). Аргумент **dim** задаёт ось, **unbiased=False** даёт деление на $N$. Корень из неё — **.std()**.`,
		formula: String.raw`\operatorname{Var}(x) = \frac{1}{N-1}\sum_{i}(x_i - \bar x)^2`,
		related: ["tenzor"]
	},
	"py:optim.Adam": {
		id: "py:optim.Adam",
		term: String.raw`optim.Adam(params, lr=1e-3)`,
		short: String.raw`Оптимизатор Adam с адаптивным шагом.`,
		body: String.raw`**optim.Adam** — [[optimizer|оптимизатор]], сочетающий momentum и адаптивный [[learning-rate|шаг]] для каждого [[parametr|параметра]] по оценкам первого и второго моментов градиента. Часто работает из коробки лучше [[sgd|SGD]]. Цикл: **zero_grad → backward → step**.`,
		related: ["adam","optimizer","learning-rate","zero-grad"]
	},
	"py:np.random.permutation": {
		id: "py:np.random.permutation",
		term: String.raw`np.random.permutation(x)`,
		short: String.raw`Случайная перестановка элементов/индексов.`,
		body: String.raw`**np.random.permutation(n)** возвращает перемешанный массив индексов $[0, n)$, а от массива — его перетасованную копию. Используется, чтобы перемешать [[dataset|данные]] перед разбиением на [[batch|батчи]]. Для воспроизводимости задай **np.random.seed**.`,
		related: ["batch","dataset"]
	},
	"py:torch.load": {
		id: "py:torch.load",
		term: String.raw`torch.load(f, map_location=None)`,
		short: String.raw`Загрузить сохранённый объект из файла.`,
		body: String.raw`**torch.load** десериализует то, что записал **torch.save**. Аргумент **map_location='cpu'** переносит тензоры на нужное [[device|устройство]]. После загрузки [[state-dict|state_dict]] применяй его через **model.load_state_dict(...)**.`,
		related: ["py:torch.save","state-dict","device"]
	},
	"py:.manual_seed": {
		id: "py:.manual_seed",
		term: String.raw`gen.manual_seed(seed)`,
		short: String.raw`Зафиксировать seed генератора.`,
		body: String.raw`**.manual_seed(seed)** задаёт начальное состояние генератора случайных чисел, делая результаты воспроизводимыми. Чаще вызывается как **torch.manual_seed(seed)** глобально.`,
		related: ["py:torch.manual_seed"]
	},
	"py:torch.manual_seed": {
		id: "py:torch.manual_seed",
		term: String.raw`torch.manual_seed(seed)`,
		short: String.raw`Глобальный seed для воспроизводимости.`,
		body: String.raw`**torch.manual_seed** фиксирует генератор PyTorch, чтобы **torch.randn** и инициализация весов давали одинаковые числа при каждом запуске. Для [[cuda|GPU]] и numpy seed задают отдельно (**torch.cuda.manual_seed_all**, **np.random.seed**).`,
		related: ["py:.manual_seed","cuda"]
	},
	"py:torch.zeros": {
		id: "py:torch.zeros",
		term: String.raw`torch.zeros(*size, dtype=None)`,
		short: String.raw`Тензор из нулей заданной формы.`,
		body: String.raw`**torch.zeros(2, 3)** создаёт [[tenzor|тензор]] формы $(2,3)$, заполненный нулями. Удобен для инициализации аккумуляторов и масок. Numpy-аналог — **np.zeros**; парный — **torch.ones**.`,
		related: ["tenzor","dtype"]
	},
	"py:np.maximum": {
		id: "py:np.maximum",
		term: String.raw`np.maximum(a, b)`,
		short: String.raw`Поэлементный максимум двух массивов.`,
		body: String.raw`**np.maximum(a, b)** берёт поэлементный максимум с [[broadcasting|broadcasting]]. Классика — **np.maximum(0, x)** для ReLU. Не путать с **np.max**, который сворачивает массив в одно число вдоль оси.`,
		formula: String.raw`\operatorname{ReLU}(x) = \max(0, x)`,
		related: ["broadcasting"]
	},
	"py:np.log": {
		id: "py:np.log",
		term: String.raw`np.log(x)`,
		short: String.raw`Поэлементный натуральный логарифм ln(x).`,
		body: String.raw`**np.log** возвращает $\ln x$ для каждого элемента. Лежит в основе лог-правдоподобия и [[cross-entropy|кросс-энтропии]]; для устойчивости к нулю добавляют малое $\varepsilon$. Обратная операция — **np.exp**.`,
		formula: String.raw`\ln(x)`,
		related: ["py:.exp","cross-entropy"]
	},
	"py:nn.init.kaiming_normal_": {
		id: "py:nn.init.kaiming_normal_",
		term: String.raw`nn.init.kaiming_normal_(tensor, mode='fan_in', nonlinearity='leaky_relu')`,
		short: String.raw`He-инициализация весов на месте (для ReLU).`,
		body: String.raw`**nn.init.kaiming_normal_** заполняет тензор из $\mathcal N(0,\sigma^2)$ с дисперсией под ReLU-сети: $\sigma=\sqrt{2/n_{in}}$. Подчёркивание — операция **in-place** прямо над [[parametr|параметром]]. Сохраняет масштаб сигнала вглубь сети, борясь с затуханием [[gradient|градиентов]].`,
		formula: String.raw`\sigma=\sqrt{2/n_{in}}`,
		related: ["parametr","gradient","py:nn.init.zeros_","py:torch.relu"]
	},
	"py:nn.init.zeros_": {
		id: "py:nn.init.zeros_",
		term: String.raw`nn.init.zeros_(tensor)`,
		short: String.raw`Обнулить тензор на месте.`,
		body: String.raw`**nn.init.zeros_** заполняет [[parametr|параметр]] нулями **in-place** (подчёркивание = меняет аргумент). Типично для **bias** слоя: смещения стартуют с нуля, а веса инициализируют случайно ([[parametr|kaiming/xavier]]).`,
		related: ["parametr","py:nn.init.kaiming_normal_"]
	},
	"py:torch.relu": {
		id: "py:torch.relu",
		term: String.raw`torch.relu(x)`,
		short: String.raw`Активация ReLU: max(0, x).`,
		body: String.raw`**torch.relu** обнуляет отрицательные значения: $\mathrm{ReLU}(x)=\max(0,x)$. Главная нелинейность в [[nn-module|сетях]] — дёшева и не насыщается для $x>0$. [[gradient|Градиент]] равен 1 при $x>0$ и 0 иначе.`,
		formula: String.raw`\mathrm{ReLU}(x)=\max(0,x)`,
		related: ["nn-module","gradient"]
	},
	"py:np.cos": {
		id: "py:np.cos",
		term: String.raw`np.cos(x)`,
		short: String.raw`Косинус поэлементно (радианы).`,
		body: String.raw`**np.cos** применяет $\cos$ к каждому элементу массива; аргумент в радианах. Векторизована — работает над всем массивом сразу без цикла. Torch-аналог — **torch.cos**.`,
		formula: String.raw`y_i=\cos(x_i)`,
		related: ["broadcasting"]
	},
	"py:nn.Conv2d": {
		id: "py:nn.Conv2d",
		term: String.raw`nn.Conv2d(in_channels, out_channels, kernel_size, stride=1, padding=0)`,
		short: String.raw`Свёрточный слой для 2D-изображений.`,
		body: String.raw`**nn.Conv2d** скользит обучаемыми ядрами по входу $(N,C_{in},H,W)$, давая карты признаков $(N,C_{out},H',W')$. [[parametr|Параметры]] — это веса ядер и **bias**; они общие для всех позиций (свёртка). Основа [[conv2d|свёрточных сетей]].`,
		related: ["conv2d","nn-module","parametr","py:nn.MaxPool2d"]
	},
	"py:nn.MaxPool2d": {
		id: "py:nn.MaxPool2d",
		term: String.raw`nn.MaxPool2d(kernel_size, stride=None)`,
		short: String.raw`Понижение разрешения по максимуму в окне.`,
		body: String.raw`**nn.MaxPool2d** берёт максимум в каждом окне $k\times k$, уменьшая $H,W$ (обычно вдвое при stride=2). Слой без [[parametr|параметров]]: даёт устойчивость к малым сдвигам и сжимает карты признаков после [[conv2d|свёртки]].`,
		related: ["pooling","conv2d","py:nn.Conv2d"]
	},
	"py:nn.LSTM": {
		id: "py:nn.LSTM",
		term: String.raw`nn.LSTM(input_size, hidden_size, num_layers=1, batch_first=False)`,
		short: String.raw`Рекуррентный слой LSTM для последовательностей.`,
		body: String.raw`**nn.LSTM** обрабатывает последовательность шаг за шагом, ведя скрытое состояние $h_t$ и память $c_t$ через гейты. Возвращает выходы всех шагов и финальное $(h_n,c_n)$. Гейты борются с затуханием [[gradient|градиента]] на длинных зависимостях.`,
		related: ["nn-module","gradient"]
	},
	"py:np.array_equal": {
		id: "py:np.array_equal",
		term: String.raw`np.array_equal(a1, a2)`,
		short: String.raw`Полное поэлементное равенство массивов.`,
		body: String.raw`**np.array_equal** возвращает один **bool**: одинаковы ли форма и все элементы. Для дробных чисел рискованно из-за ошибок округления — там лучше **np.allclose** с допуском.`,
		related: ["py:np.abs"]
	},
	"py:torch.cuda.synchronize": {
		id: "py:torch.cuda.synchronize",
		term: String.raw`torch.cuda.synchronize(device=None)`,
		short: String.raw`Дождаться завершения операций на GPU.`,
		body: String.raw`**torch.cuda.synchronize** блокирует Python, пока [[cuda|GPU]] не закончит все запущенные ядра. Вызовы CUDA асинхронны, поэтому без синхронизации замеры времени врут — ставь её до и после измеряемого блока.`,
		related: ["cuda","device"]
	},
	"py:torch.compile": {
		id: "py:torch.compile",
		term: String.raw`torch.compile(model)`,
		short: String.raw`JIT-компиляция модели для ускорения.`,
		body: String.raw`**torch.compile** оборачивает [[nn-module|модель]] или функцию, трассирует граф и компилирует слитые ядра — обычно даёт ускорение без правки кода. Первый прогон дольше (компиляция), дальше быстрее.`,
		related: ["nn-module","vychislitelnyy-graf"]
	},
	"py:np.float32": {
		id: "py:np.float32",
		term: String.raw`np.float32`,
		short: String.raw`32-битный тип чисел с плавающей точкой.`,
		body: String.raw`**np.float32** — одинарная точность (4 байта). Стандартный [[dtype|тип]] для обучения: вдвое меньше памяти, чем float64, и быстрее на [[cuda|GPU]]. Указывается как **dtype=np.float32** или через **.astype(np.float32)**.`,
		related: ["dtype","cuda"]
	},
	"py:np.abs": {
		id: "py:np.abs",
		term: String.raw`np.abs(x)`,
		short: String.raw`Модуль поэлементно.`,
		body: String.raw`**np.abs** возвращает $|x_i|$ для каждого элемента. Часто внутри метрик ошибки, например MAE $=\mathrm{mean}(|y-\hat y|)$, или для проверки близости массивов с допуском.`,
		formula: String.raw`y_i=|x_i|`,
		related: ["py:np.array_equal"]
	},
	"py:torch.quantization.quantize_dynamic": {
		id: "py:torch.quantization.quantize_dynamic",
		term: String.raw`torch.quantization.quantize_dynamic(model, {nn.Linear}, dtype=torch.qint8)`,
		short: String.raw`Динамическая квантизация весов в int8.`,
		body: String.raw`**torch.quantization.quantize_dynamic** заменяет указанные слои (обычно [[nn-module|nn.Linear]]/LSTM) на int8-версии: веса квантуются заранее, активации — на лету. Сильно сжимает модель и ускоряет инференс на CPU при малой потере качества.`,
		related: ["nn-module","dtype","py:torch.compile"]
	},
	"py:torch.qint8": {
		id: "py:torch.qint8",
		term: String.raw`torch.qint8`,
		short: String.raw`Тип квантованного 8-битного целого со знаком.`,
		body: String.raw`**torch.qint8** — квантованный [[dtype|тип]]: знаковое 8-битное целое $[-128,127]$ с масштабом и нулём для приближения float. Применяется в квантовании моделей ради экономии памяти и ускорения вывода.`
	},
	"py:.detach": {
		id: "py:.detach",
		term: String.raw`x.detach()`,
		short: String.raw`Отцепить тензор от графа вычислений.`,
		body: String.raw`**.detach()** возвращает [[tenzor|тензор]] с теми же данными, но вне [[vychislitelnyy-graf|графа]]: у него **requires_grad=False**, и через него [[gradient|градиент]] не пойдёт. Нужно для логирования и метрик, чтобы не держать [[autograd|autograd]]-историю.`,
		related: ["autograd","vychislitelnyy-graf","requires-grad"]
	},
	"py:.data_ptr": {
		id: "py:.data_ptr",
		term: String.raw`x.data_ptr()`,
		short: String.raw`Адрес начала данных тензора в памяти.`,
		body: String.raw`**.data_ptr()** возвращает целочисленный адрес первого элемента в памяти. Помогает проверить, делят ли два [[tenzor|тензора]] одно хранилище (например, после **.view** или среза) — совпадающий указатель значит общую память.`,
		related: ["tenzor"]
	},
	"py:.zero_": {
		id: "py:.zero_",
		term: String.raw`x.zero_()`,
		short: String.raw`Обнулить тензор на месте.`,
		body: String.raw`**.zero_()** записывает $0$ во все элементы [[tenzor|тензора]] in-place (нижнее подчёркивание — признак изменения на месте). Так под капотом работает [[zero-grad|zero_grad()]], очищая накопленные **.grad** перед новым [[backward|.backward()]].`,
		related: ["zero-grad","gradient","tenzor"]
	},
	"py:.log": {
		id: "py:.log",
		term: String.raw`x.log()`,
		short: String.raw`Поэлементный натуральный логарифм.`,
		body: String.raw`**.log()** считает $\ln x$ по каждому элементу. Часто встречается в [[loss-fn|функциях потерь]]: в [[cross-entropy|кросс-энтропии]] логарифмируют вероятности после [[softmax|softmax]]. Для входов $\le 0$ даёт $-\infty$ или NaN.`,
		formula: String.raw`\ln x`,
		related: ["cross-entropy","softmax","loss-fn"]
	},
	"py:.tolist": {
		id: "py:.tolist",
		term: String.raw`x.tolist()`,
		short: String.raw`Превратить тензор в вложенный список Python.`,
		body: String.raw`**.tolist()** копирует [[tenzor|тензор]] в обычные списки Python (числа становятся float/int). Удобно для сериализации и вывода; в отличие от [[item-skalyar|.item()]] работает с тензором любой [[shape-forma|формы]], а не только со скаляром.`,
		related: ["tenzor"]
	},
	"py:.relu": {
		id: "py:.relu",
		term: String.raw`x.relu()`,
		short: String.raw`Активация ReLU: max(0, x).`,
		body: String.raw`**.relu()** применяет $\max(0,x)$ поэлементно — обнуляет отрицательные значения. Самая частая нелинейность между [[nn-module|слоями]]: дёшево считается и борется с затуханием [[gradient|градиента]].`,
		formula: String.raw`\mathrm{ReLU}(x)=\max(0,x)`,
		related: ["nn-module","gradient"]
	},
	"py:.abs": {
		id: "py:.abs",
		term: String.raw`x.abs()`,
		short: String.raw`Поэлементный модуль (абсолютное значение).`,
		body: String.raw`**.abs()** возвращает $|x|$ для каждого элемента [[tenzor|тензора]]. Встречается в L1-норме и [[regularizaciya|регуляризации]], а также при подсчёте абсолютной ошибки.`,
		formula: String.raw`|x|`,
		related: ["tenzor","regularizaciya"]
	},
	"py:np.matmul": {
		id: "py:np.matmul",
		term: String.raw`np.matmul(a, b)  ·  a @ b`,
		short: String.raw`Матричное умножение numpy (оператор @).`,
		body: String.raw`**np.matmul** (он же **@**) перемножает матрицы: $(m,k)@(k,n)=(m,n)$; внутренние размеры должны совпасть, батчи поддерживаются. Не путать с поэлементным **\***. Torch-аналог — **torch.matmul**.`,
		related: ["py:torch.matmul","broadcasting"]
	},
	"py:torch.ones": {
		id: "py:torch.ones",
		term: String.raw`torch.ones(*size, dtype=None, device=None)`,
		short: String.raw`Тензор заданной формы, заполненный единицами.`,
		body: String.raw`**torch.ones(2, 3)** создаёт [[tenzor|тензор]] формы $(2,3)$ из единиц. Можно задать [[dtype|тип]] и [[device|устройство]]. Пара к **torch.zeros**; для копии формы другого тензора — **torch.ones_like**.`,
		related: ["tenzor","dtype","device"]
	},
	"py:torch.masked_select": {
		id: "py:torch.masked_select",
		term: String.raw`torch.masked_select(input, mask)`,
		short: String.raw`Выбрать элементы по булевой маске в 1-D тензор.`,
		body: String.raw`**torch.masked_select** возвращает 1-D [[tenzor|тензор]] из элементов **input**, где **mask** равна True. Маска [[broadcasting|броадкастится]] до формы входа; результат всегда плоский, форма теряется.`,
		related: ["tenzor","broadcasting"]
	},
	"py:np.ascontiguousarray": {
		id: "py:np.ascontiguousarray",
		term: String.raw`np.ascontiguousarray(a, dtype=None)`,
		short: String.raw`Сделать массив непрерывным в памяти (C-порядок).`,
		body: String.raw`**np.ascontiguousarray** возвращает массив с непрерывным расположением по строкам (C-order), копируя при необходимости. Нужно перед передачей в код, требующий contiguous-данные — например, в **torch.from_numpy**.`,
		related: ["py:torch.from_numpy"]
	},
	"py:torch.from_numpy": {
		id: "py:torch.from_numpy",
		term: String.raw`torch.from_numpy(ndarray)`,
		short: String.raw`Обернуть numpy-массив в тензор без копирования.`,
		body: String.raw`**torch.from_numpy** создаёт [[tenzor|тензор]], разделяющий память с numpy-массивом: правка одного меняет другой. [[dtype|Тип]] наследуется от массива; тензор всегда на CPU — для [[cuda|GPU]] нужен **.to(device)**.`,
		related: ["tenzor","dtype","device","py:np.array"]
	},
	"py:torch.tanh": {
		id: "py:torch.tanh",
		term: String.raw`torch.tanh(input)`,
		short: String.raw`Гиперболический тангенс поэлементно.`,
		body: String.raw`**torch.tanh** применяет $\tanh$ к каждому элементу [[tenzor|тензора]], сжимая значения в $(-1,1)$. Гладкая нелинейность-активация с нулевым центром; в современных сетях чаще берут ReLU. Тот же эффект — у метода **.tanh()**.`,
		formula: String.raw`\tanh(x)=\dfrac{e^{x}-e^{-x}}{e^{x}+e^{-x}}`,
		related: ["tenzor","nn-module"]
	},
	"py:torch.rand": {
		id: "py:torch.rand",
		term: String.raw`torch.rand(*size)`,
		short: String.raw`Тензор из равномерного шума на [0, 1).`,
		body: String.raw`**torch.rand(2, 3)** создаёт [[tenzor|тензор]] формы $(2,3)$ из равномерного распределения $U[0,1)$. В отличие от **torch.randn** (нормальный шум), значения ограничены отрезком. Для воспроизводимости задай **torch.manual_seed** или **generator**.`,
		formula: String.raw`x_i \sim U[0,1)`,
		related: ["py:torch.randn","tenzor","py:torch.Generator"]
	},
	"py:torch.optim": {
		id: "py:torch.optim",
		term: String.raw`torch.optim`,
		short: String.raw`Пакет оптимизаторов для шага обучения.`,
		body: String.raw`**torch.optim** — подмодуль с [[optimizer|оптимизаторами]] (**SGD**, **Adam** и др.). Оптимизатор получает [[parametr|параметры]] модели и по их **.grad** обновляет веса ([[gradient-spusk|градиентный спуск]]). Типичный цикл: **zero_grad → backward → step**.`,
		related: ["optimizer","gradient-spusk","py:torch.optim.SGD","sgd","adam"]
	},
	"py:np.vstack": {
		id: "py:np.vstack",
		term: String.raw`np.vstack(tup)`,
		short: String.raw`Склеить массивы по вертикали (вдоль строк).`,
		body: String.raw`**np.vstack** ставит массивы друг под друга, наращивая ось $0$. Число столбцов должно совпадать. Парная функция **np.hstack** клеит по горизонтали. Torch-аналог — **torch.cat(..., dim=0)** или **torch.vstack**.`,
		related: ["shape-forma","tenzor"]
	},
	"py:np.eye": {
		id: "py:np.eye",
		term: String.raw`np.eye(N, M=None)`,
		short: String.raw`Единичная матрица N×N.`,
		body: String.raw`**np.eye(N)** строит квадратную матрицу с единицами на главной диагонали и нулями вокруг. Нейтральна для умножения: $I A = A$. Torch-аналог — **torch.eye**.`,
		formula: String.raw`I_{ij}=\begin{cases}1 & i=j\\ 0 & i\neq j\end{cases}`,
		related: ["py:torch.matmul"]
	},
	"py:np.linspace": {
		id: "py:np.linspace",
		term: String.raw`np.linspace(start, stop, num=50)`,
		short: String.raw`num точек, равномерно от start до stop.`,
		body: String.raw`**np.linspace** даёт **num** равноотстоящих чисел на отрезке $[start, stop]$ — концы включены (в отличие от **np.arange**, где задаётся шаг). Удобно для сетки $x$ при построении графиков. Torch-аналог — **torch.linspace**.`,
		related: ["py:np.arange"]
	},
	"py:np.polyval": {
		id: "py:np.polyval",
		term: String.raw`np.polyval(p, x)`,
		short: String.raw`Значение полинома с коэффициентами p в точках x.`,
		body: String.raw`**np.polyval** вычисляет $p_0 x^{n}+p_1 x^{n-1}+\dots+p_n$ для каждого элемента **x** (коэффициенты — от старшей степени к младшей). Обычно идёт в паре с **np.polyfit**, который эти коэффициенты находит.`,
		formula: String.raw`p(x)=\sum_{k=0}^{n} p_k\,x^{\,n-k}`,
		related: ["py:np.polyfit"]
	},
	"py:np.polyfit": {
		id: "py:np.polyfit",
		term: String.raw`np.polyfit(x, y, deg)`,
		short: String.raw`Подобрать полином степени deg методом наименьших квадратов.`,
		body: String.raw`**np.polyfit** находит коэффициенты полинома степени **deg**, минимизируя сумму квадратов отклонений от точек $(x,y)$ ([[mse|МНК]]). Возвращает коэффициенты для **np.polyval**. При **deg=1** — обычная линейная регрессия.`,
		formula: String.raw`\min_{p}\sum_i\bigl(y_i-p(x_i)\bigr)^2`,
		related: ["py:np.polyval","mse"]
	},
	"py:torch.Generator": {
		id: "py:torch.Generator",
		term: String.raw`torch.Generator(device='cpu')`,
		short: String.raw`Отдельный источник случайности для воспроизводимости.`,
		body: String.raw`**torch.Generator** хранит собственное состояние ГПСЧ; его передают в **torch.rand/randn(..., generator=g)**, чтобы не трогать глобальный сид. Состояние задаётся через **g.manual_seed(0)** — одинаковый сид даёт одинаковые числа.`,
		related: ["py:torch.rand","py:torch.randn","device"]
	},
	"py:nn.BatchNorm1d": {
		id: "py:nn.BatchNorm1d",
		term: String.raw`nn.BatchNorm1d(num_features)`,
		short: String.raw`Батч-нормализация для 1-D признаков.`,
		body: String.raw`**nn.BatchNorm1d** нормирует каждый из **num_features** признаков по [[batch|батчу]] к нулевому среднему и единичной дисперсии, затем масштабирует обучаемыми $\gamma,\beta$ ([[batchnorm|batchnorm]]). Ускоряет обучение; поведение в **train**/**eval** различается ([[train-eval|train/eval]]).`,
		formula: String.raw`\hat x=\dfrac{x-\mu_B}{\sqrt{\sigma_B^2+\epsilon}};\quad y=\gamma\hat x+\beta`,
		related: ["batchnorm","batch","train-eval","nn-module"]
	},
	"py:nn.Dropout": {
		id: "py:nn.Dropout",
		term: String.raw`nn.Dropout(p=0.5)`,
		short: String.raw`Случайно обнуляет долю p активаций при обучении.`,
		body: String.raw`**nn.Dropout** с вероятностью **p** зануляет каждый элемент входа (остальные масштабирует на $1/(1-p)$) — регуляризация против [[overfitting|переобучения]] ([[dropout|dropout]]). Активен только в режиме **train**; в **eval** отключается ([[train-eval|train/eval]]).`,
		related: ["dropout","regularizaciya","overfitting","train-eval"]
	},
	"py:np.pi": {
		id: "py:np.pi",
		term: String.raw`np.pi`,
		short: String.raw`Константа π ≈ 3.14159.`,
		body: String.raw`**np.pi** — число $\pi$ как обычный float. Нужно для тригонометрии и периодических сигналов, например **np.sin(2 * np.pi * x)**. В PyTorch — **torch.pi**.`,
		formula: String.raw`\pi \approx 3.141592653589793`
	},
	"py:torch.optim.SGD": {
		id: "py:torch.optim.SGD",
		term: String.raw`torch.optim.SGD(params, lr, momentum=0)`,
		short: String.raw`Стохастический градиентный спуск.`,
		body: String.raw`**torch.optim.SGD** обновляет [[parametr|параметры]] шагом против [[gradient|градиента]]: $\theta \leftarrow \theta - lr\cdot g$ ([[sgd|SGD]]). **lr** — [[learning-rate|скорость обучения]]; **momentum** добавляет инерцию. Перед **.step()** нужен **.zero_grad()**.`,
		formula: String.raw`\theta \leftarrow \theta - \eta\,\nabla_\theta L`,
		related: ["sgd","py:torch.optim","optimizer","learning-rate","gradient","zero-grad"]
	},
	"py:torch.optim.lr_scheduler.CosineAnnealingLR": {
		id: "py:torch.optim.lr_scheduler.CosineAnnealingLR",
		term: String.raw`torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max, eta_min=0)`,
		short: String.raw`Косинусное затухание learning rate за T_max шагов.`,
		body: String.raw`**CosineAnnealingLR** плавно ведёт [[learning-rate|lr]] по косинусу от стартового до **eta_min** за **T_max** эпох. Это [[scheduler|расписание]] для [[optimizer|оптимизатора]]; вызывай **scheduler.step()** после каждой эпохи.`,
		formula: String.raw`\eta_t = \eta_{min} + \tfrac{1}{2}(\eta_{max}-\eta_{min})\left(1+\cos\tfrac{t\pi}{T_{max}}\right)`,
		related: ["scheduler","learning-rate","optimizer"]
	},
	"py:nn.utils.clip_grad_norm_": {
		id: "py:nn.utils.clip_grad_norm_",
		term: String.raw`nn.utils.clip_grad_norm_(parameters, max_norm)`,
		short: String.raw`Обрезать норму градиентов до max_norm.`,
		body: String.raw`**clip_grad_norm_** масштабирует все [[gradient|градиенты]] [[parametr|параметров]], если их общая норма превышает **max_norm** — защита от взрыва градиентов. Вызывается между **.backward()** и **optimizer.step()**.`,
		formula: String.raw`g \leftarrow g\cdot\min\!\left(1,\ \frac{\text{max\_norm}}{\lVert g\rVert}\right)`,
		related: ["gradient","backward","optimizer","parametr"]
	},
	"py:nn.Flatten": {
		id: "py:nn.Flatten",
		term: String.raw`nn.Flatten(start_dim=1, end_dim=-1)`,
		short: String.raw`Слой, расплющивающий оси в один вектор.`,
		body: String.raw`**nn.Flatten** сворачивает оси с **start_dim** по **end_dim** в одну, сохраняя [[batch|батч]]. Из $(N,C,H,W)$ получается $(N, C\cdot H\cdot W)$ — типичный мост от свёрток к [[nn-module|nn.Linear]].`,
		related: ["nn-module","batch","py:.reshape"]
	},
	"py:torchvision.models": {
		id: "py:torchvision.models",
		term: String.raw`torchvision.models`,
		short: String.raw`Готовые архитектуры сетей с предобученными весами.`,
		body: String.raw`**torchvision.models** содержит классические сети (**resnet18**, **vgg16**, **vit_b_16** и др.). Передай **weights=...**, чтобы загрузить предобученные [[parametr|веса]] — основа transfer learning.`,
		related: ["nn-module","parametr","state-dict"]
	},
	"py:torch.allclose": {
		id: "py:torch.allclose",
		term: String.raw`torch.allclose(a, b, rtol=1e-05, atol=1e-08)`,
		short: String.raw`Проверить равенство тензоров с допуском.`,
		body: String.raw`**torch.allclose** возвращает **True**, если все элементы [[tenzor|тензоров]] совпадают в пределах допусков **rtol**/**atol** — корректное сравнение float-чисел. Удобно в тестах и проверках вычислений.`,
		formula: String.raw`|a-b| \le \text{atol} + \text{rtol}\cdot|b|`,
		related: ["tenzor","dtype"]
	},
	"py:np.power": {
		id: "py:np.power",
		term: String.raw`np.power(x, p)`,
		short: String.raw`Поэлементное возведение в степень.`,
		body: String.raw`**np.power(x, p)** считает $x^p$ для каждого элемента (с [[broadcasting|broadcasting]] между **x** и **p**). Аналог оператора **x ** p**; torch-версия — **torch.pow**.`,
		formula: String.raw`y_i = x_i^{\,p}`,
		related: ["broadcasting"]
	},
	"py:np.sin": {
		id: "py:np.sin",
		term: String.raw`np.sin(x)`,
		short: String.raw`Поэлементный синус (радианы).`,
		body: String.raw`**np.sin** применяет $\sin$ к каждому элементу массива, аргумент в радианах. Векторная операция; рядом живут **np.cos**, **np.tan**, **np.exp**.`,
		formula: String.raw`y_i = \sin(x_i)`,
		related: ["broadcasting"]
	},
	"py:nn.Embedding": {
		id: "py:nn.Embedding",
		term: String.raw`nn.Embedding(num_embeddings, embedding_dim)`,
		short: String.raw`Таблица обучаемых векторов по целым индексам.`,
		body: String.raw`**nn.Embedding** хранит матрицу $(\text{num\_embeddings}, \text{embedding\_dim})$ [[parametr|параметров]] и по индексам токенов возвращает их векторы. Стартовый слой для текста: id слова $\to$ плотный вектор.`,
		related: ["parametr","nn-module"]
	},
	"py:nn.Parameter": {
		id: "py:nn.Parameter",
		term: String.raw`nn.Parameter(data, requires_grad=True)`,
		short: String.raw`Тензор-параметр, видимый модулю для обучения.`,
		body: String.raw`**nn.Parameter** оборачивает [[tenzor|тензор]] так, что [[nn-module|nn.Module]] регистрирует его в **.parameters()** и [[optimizer|оптимизатор]] его обновляет. По умолчанию **requires_grad=True** ([[requires-grad|autograd]]).`,
		related: ["parametr","requires-grad","nn-module","optimizer"]
	},
	"py:nn.TransformerEncoderLayer": {
		id: "py:nn.TransformerEncoderLayer",
		term: String.raw`nn.TransformerEncoderLayer(d_model, nhead, dim_feedforward=2048)`,
		short: String.raw`Один блок энкодера: self-attention + FFN.`,
		body: String.raw`**nn.TransformerEncoderLayer** — слой из multi-head self-attention на **nhead** голов и feed-forward сети, с residual-связями и [[batchnorm|LayerNorm]]. Кирпич, из которого собирают **nn.TransformerEncoder**.`,
		related: ["nn-module","forward","py:nn.TransformerEncoder"]
	},
	"py:nn.TransformerEncoder": {
		id: "py:nn.TransformerEncoder",
		term: String.raw`nn.TransformerEncoder(encoder_layer, num_layers)`,
		short: String.raw`Стек одинаковых слоёв энкодера.`,
		body: String.raw`**nn.TransformerEncoder** повторяет **encoder_layer** **num_layers** раз, прогоняя вход через стопку трансформер-блоков. Сам слой задаётся через **nn.TransformerEncoderLayer**.`,
		related: ["nn-module","forward","py:nn.TransformerEncoderLayer"]
	},
	"py:torch.cuda.manual_seed_all": {
		id: "py:torch.cuda.manual_seed_all",
		term: String.raw`torch.cuda.manual_seed_all(seed)`,
		short: String.raw`Зафиксировать seed ГСЧ на всех GPU.`,
		body: String.raw`**torch.cuda.manual_seed_all** задаёт зерно генератора случайных чисел для всех видимых [[cuda|GPU]] — для воспроизводимости. Дополняет **torch.manual_seed** (CPU).`,
		related: ["cuda","device"]
	},
	"py:torch.use_deterministic_algorithms": {
		id: "py:torch.use_deterministic_algorithms",
		term: String.raw`torch.use_deterministic_algorithms(mode=True)`,
		short: String.raw`Требовать детерминированные операции.`,
		body: String.raw`**torch.use_deterministic_algorithms(True)** заставляет PyTorch выбирать детерминированные реализации (или падать с ошибкой, если их нет) — для полной воспроизводимости. Может замедлить вычисления.`,
		related: ["cuda","device"]
	},
	"py:torch.backends.cudnn.deterministic": {
		id: "py:torch.backends.cudnn.deterministic",
		term: String.raw`torch.backends.cudnn.deterministic = True`,
		short: String.raw`Включить детерминированные алгоритмы cuDNN.`,
		body: String.raw`**torch.backends.cudnn.deterministic = True** заставляет [[cuda|cuDNN]] выбирать воспроизводимые алгоритмы — одинаковый результат при тех же входах и [[device|устройстве]]. Цена — возможное замедление. Обычно ставят вместе с **benchmark = False** и **torch.manual_seed**.`,
		related: ["cuda","device","torch.backends.cudnn.benchmark"]
	},
	"py:torch.backends.cudnn.benchmark": {
		id: "py:torch.backends.cudnn.benchmark",
		term: String.raw`torch.backends.cudnn.benchmark = True`,
		short: String.raw`Автоподбор быстрейших алгоритмов cuDNN.`,
		body: String.raw`**torch.backends.cudnn.benchmark = True** позволяет [[cuda|cuDNN]] профилировать и выбирать самый быстрый алгоритм свёртки под фиксированную [[shape-forma|форму]] входа — ускоряет обучение, если размеры стабильны. При меняющихся размерах или нужде в воспроизводимости — оставь **False**.`,
		related: ["cuda","conv2d","torch.backends.cudnn.deterministic"]
	},
	"py:np.dot": {
		id: "py:np.dot",
		term: String.raw`np.dot(a, b)`,
		short: String.raw`Скалярное и матричное произведение.`,
		body: String.raw`**np.dot** для 1-D векторов даёт скаляр $\sum_i a_i b_i$, для 2-D — матричное умножение $(m,k)\cdot(k,n)=(m,n)$. Внутренние размеры должны совпасть. Torch-аналог — **torch.matmul** (он же **@**).`,
		formula: String.raw`a\cdot b = \sum_i a_i b_i`,
		related: ["py:torch.matmul","py:.matmul","broadcasting"]
	},
	"py:torch.amp": {
		id: "py:torch.amp",
		term: String.raw`torch.amp.autocast(device_type, dtype)`,
		short: String.raw`Смешанная точность (float16/bfloat16).`,
		body: String.raw`**torch.amp** — модуль автоматической смешанной точности ([[amp|AMP]]). Контекст **autocast** выполняет операции в пониженном [[dtype|float16/bfloat16]], ускоряя вычисления на [[cuda|GPU]] и экономя память. В паре с ним идёт **GradScaler** для устойчивого [[backward|backward]].`,
		related: ["amp","dtype","cuda","backward"]
	},
	"py:torch.jit.trace": {
		id: "py:torch.jit.trace",
		term: String.raw`torch.jit.trace(model, example_inputs)`,
		short: String.raw`Сохранить модель трассировкой по примеру.`,
		body: String.raw`**torch.jit.trace** прогоняет **model** на тестовом входе и записывает выполненные операции в TorchScript-граф. Подходит для статичного [[forward|forward]] без ветвлений (условия и циклы по данным трассировка теряет — тогда нужен **torch.jit.script**).`,
		related: ["forward","py:torch.jit.script","vychislitelnyy-graf"]
	},
	"py:torch.jit.script": {
		id: "py:torch.jit.script",
		term: String.raw`torch.jit.script(model)`,
		short: String.raw`Скомпилировать модель в TorchScript.`,
		body: String.raw`**torch.jit.script** анализирует код [[nn-module|nn.Module]] и компилирует его в TorchScript, сохраняя ветвления и циклы (в отличие от **trace**). Результат работает без Python — удобно для деплоя и ускорения [[forward|forward]].`,
		related: ["nn-module","forward","py:torch.jit.trace"]
	},
	"py:torch.jit.load": {
		id: "py:torch.jit.load",
		term: String.raw`torch.jit.load(path)`,
		short: String.raw`Загрузить сохранённый TorchScript-модуль.`,
		body: String.raw`**torch.jit.load** читает файл, сохранённый через **.save()** после **trace** или **script**, и возвращает готовый к запуску модуль. В отличие от [[state-dict|state_dict]], несёт и архитектуру, и веса — Python-класс модели не нужен.`,
		related: ["state-dict","py:torch.jit.script","py:torch.jit.trace"]
	},
	"py:torch.onnx.export": {
		id: "py:torch.onnx.export",
		term: String.raw`torch.onnx.export(model, args, path)`,
		short: String.raw`Экспортировать модель в формат ONNX.`,
		body: String.raw`**torch.onnx.export** трассирует **model** на примере **args** и пишет граф в открытый формат ONNX — для запуска в других рантаймах (ONNX Runtime, TensorRT). Так же, как **jit.trace**, фиксирует один путь [[forward|forward]] по данным.`,
		related: ["forward","py:torch.jit.trace","vychislitelnyy-graf"]
	},
	"py:np.int8": {
		id: "py:np.int8",
		term: String.raw`np.int8`,
		short: String.raw`8-битный знаковый целый тип.`,
		body: String.raw`**np.int8** — [[dtype|тип]] целого числа в 1 байт, диапазон $[-128, 127]$. Экономит память, но легко переполняется. Используется как аргумент **dtype** в **np.array**, **np.zeros** и т.п.; torch-аналог — **torch.int8**.`,
		formula: String.raw`[-128,\,127]`,
		related: ["dtype","py:np.array"]
	},
	"py:.matmul": {
		id: "py:.matmul",
		term: String.raw`x.matmul(other)`,
		short: String.raw`Матричное умножение тензоров.`,
		body: String.raw`**.matmul** перемножает матрицы: $(m,k)@(k,n)=(m,n)$; то же даёт оператор **@** и **torch.matmul**. Внутренние размеры должны совпасть, поддерживаются батчи. Не путать с поэлементным **\***. Основа [[nn-module|линейных слоёв]].`,
		formula: String.raw`(m,k)\times(k,n)=(m,n)`,
		related: ["py:torch.matmul","nn-module","broadcasting"]
	},
	"py:.masked_select": {
		id: "py:.masked_select",
		term: String.raw`x.masked_select(mask)`,
		short: String.raw`Выбрать элементы по булевой маске.`,
		body: String.raw`**.masked_select** возвращает 1-D [[tenzor|тензор]] из элементов **x**, где **mask** (того же размера, [[broadcasting|broadcasting]]) равна True. Форма результата заранее неизвестна. Аналог булевой индексации **x[mask]** в numpy.`,
		related: ["tenzor","broadcasting"]
	},
	"py:.ravel": {
		id: "py:.ravel",
		term: String.raw`x.ravel()`,
		short: String.raw`Развернуть тензор в одномерный.`,
		body: String.raw`**.ravel** возвращает плоский 1-D [[tenzor|тензор]] из всех элементов — как **.reshape(-1)**, по возможности без копии (view). Меняет только [[shape-forma|форму]], число элементов сохраняется. Близко к **.flatten()**.`,
		related: ["py:.reshape","shape-forma","tenzor"]
	},
	"py:.from_numpy": {
		id: "py:.from_numpy",
		term: String.raw`torch.from_numpy(ndarray)`,
		short: String.raw`Обернуть numpy-массив в тензор.`,
		body: String.raw`**torch.from_numpy** делает [[tenzor|тензор]], разделяющий память с numpy-массивом — изменение одного меняет другой (без копии). [[dtype|Тип]] переносится как есть. Чтобы разорвать связь, используй **.clone()** или **torch.tensor**.`,
		related: ["tenzor","dtype","py:np.array","py:torch.tensor"]
	},
	"py:.t": {
		id: "py:.t",
		term: String.raw`x.t()`,
		short: String.raw`Транспонировать 2-D тензор (поменять оси местами).`,
		body: String.raw`**.t()** меняет местами две оси матрицы: форма $(m,n)\to(n,m)$. Работает только для 0-,1-,2-мерных [[tenzor|тензоров]]; возвращает [[view-storage|view]] без копии. Для большего числа осей используй **.transpose** или **.permute**.`,
		formula: String.raw`(m,n)\to(n,m)`,
		related: ["tenzor","py:.contiguous"]
	},
	"py:.is_contiguous": {
		id: "py:.is_contiguous",
		term: String.raw`x.is_contiguous()`,
		short: String.raw`Проверить, лежат ли элементы в памяти подряд.`,
		body: String.raw`**.is_contiguous()** возвращает **True**, если элементы [[tenzor|тензора]] идут в памяти в C-порядке без разрывов. После **.t()**, **.transpose** или среза тензор часто становится не contiguous — тогда перед **.view** нужен **.contiguous()**.`,
		related: ["tenzor","py:.contiguous","py:.stride"]
	},
	"py:.stride": {
		id: "py:.stride",
		term: String.raw`x.stride(dim=None)`,
		short: String.raw`Шаги по памяти для перехода вдоль каждой оси.`,
		body: String.raw`**.stride()** возвращает кортеж: на сколько элементов сдвинуться в памяти, чтобы шагнуть на $+1$ по соответствующей оси. Через strides [[tenzor|тензор]] описывает форму поверх линейного буфера; **.t()** и срезы меняют только strides, не данные.`,
		related: ["tenzor","py:.is_contiguous"]
	},
	"py:.contiguous": {
		id: "py:.contiguous",
		term: String.raw`x.contiguous()`,
		short: String.raw`Сделать копию с подряд лежащими элементами.`,
		body: String.raw`**.contiguous()** возвращает [[tenzor|тензор]] с теми же значениями, но уложенный в памяти подряд; если он уже contiguous — возвращает себя без копии. Нужен после транспонирования перед **.view**, который требует непрерывной раскладки.`,
		related: ["tenzor","py:.view","py:.is_contiguous"]
	},
	"py:.view": {
		id: "py:.view",
		term: String.raw`x.view(*shape)`,
		short: String.raw`Новая форма без копии (тензор должен быть contiguous).`,
		body: String.raw`**.view** даёт [[tenzor|тензор]] другой [[shape-forma|формы]] поверх той же памяти — это всегда [[view-storage|view]], а не копия. Требует contiguous-раскладки (иначе ошибка — сначала **.contiguous()**). Одну ось можно задать **-1**. Безопасная альтернатива — **.reshape**.`,
		related: ["reshape-view","py:.reshape","py:.contiguous","shape-forma"]
	},
	"py:.clone": {
		id: "py:.clone",
		term: String.raw`x.clone()`,
		short: String.raw`Глубокая копия тензора (новая память).`,
		body: String.raw`**.clone()** создаёт независимую копию [[tenzor|тензора]] в новой памяти; изменения копии не затрагивают оригинал. Копия остаётся в [[vychislitelnyy-graf|графе]] [[autograd|autograd]] — [[gradient|градиенты]] текут сквозь неё. Чтобы оторвать от графа, добавь **.detach()**.`,
		related: ["tenzor","autograd","vychislitelnyy-graf"]
	},
	"py:.add": {
		id: "py:.add",
		term: String.raw`x.add(other, *, alpha=1)`,
		short: String.raw`Поэлементное сложение: x + alpha·other.`,
		body: String.raw`**.add(y)** возвращает новый [[tenzor|тензор]] $x+y$; с **alpha** считает $x+\alpha\cdot y$. Размеры выравниваются по правилам [[broadcasting|broadcasting]]. Версия с подчёркиванием **.add_** меняет тензор на месте.`,
		formula: String.raw`x + \alpha\cdot y`,
		related: ["tenzor","broadcasting"]
	},
	"py:.numel": {
		id: "py:.numel",
		term: String.raw`x.numel()`,
		short: String.raw`Общее число элементов в тензоре.`,
		body: String.raw`**.numel()** возвращает произведение всех размеров [[shape-forma|формы]]: для $(2,3,4)$ это $24$. Удобно для подсчёта [[parametr|параметров]] модели или проверки совместимости перед **.view(-1)**.`,
		formula: String.raw`\prod_i \text{shape}_i`,
		related: ["tenzor","shape-forma","parametr"]
	},
	"py:.long": {
		id: "py:.long",
		term: String.raw`x.long()`,
		short: String.raw`Привести тензор к целому типу int64.`,
		body: String.raw`**.long()** возвращает копию [[tenzor|тензора]] с [[dtype|dtype]] **torch.int64**. Дробная часть отбрасывается. Целые индексы такого типа нужны, например, для меток классов в [[cross-entropy|cross-entropy]] и для индексирования.`,
		related: ["dtype","tenzor","cross-entropy"]
	},
	"py:.apply": {
		id: "py:.apply",
		term: String.raw`x.apply_(callable)`,
		short: String.raw`Применить Python-функцию к каждому элементу на месте.`,
		body: String.raw`**.apply_** проходит по элементам [[tenzor|тензора]] и заменяет каждый результатом **callable** — изменяет на месте (отсюда подчёркивание). Работает только на CPU и медленно (цикл на Python); для скорости используй векторные операции. У **nn.Module** есть другой **.apply** — для рекурсивного обхода слоёв.`,
		related: ["tenzor","nn-module"]
	},
	"py:.std": {
		id: "py:.std",
		term: String.raw`x.std(dim=None, unbiased=True)`,
		short: String.raw`Стандартное отклонение по тензору или вдоль оси.`,
		body: String.raw`**.std()** считает СКО по всем элементам; **.std(dim=k)** — вдоль оси $k$. По умолчанию **unbiased=True** — делитель $n-1$ (несмещённая оценка). Парный метод — **.mean**; вместе задают нормализацию (z-score).`,
		formula: String.raw`s=\sqrt{\tfrac{1}{n-1}\sum_i (x_i-\bar x)^2}`,
		related: ["tenzor","batchnorm"]
	},
	"py:.dot": {
		id: "py:.dot",
		term: String.raw`x.dot(y)`,
		short: String.raw`Скалярное произведение двух 1-D векторов.`,
		body: String.raw`**.dot(y)** возвращает [[tenzor|тензор]]-скаляр $\sum_i x_i y_i$. Работает только для одномерных векторов одной длины. Для матриц нужен **torch.matmul** (он же **@**).`,
		formula: String.raw`x\cdot y=\sum_i x_i y_i`,
		related: ["tenzor","py:torch.matmul"]
	},
	"py:.scale": {
		id: "py:.scale",
		term: String.raw`scaler.scale(loss)`,
		short: String.raw`Домножить потерю на масштаб в mixed precision.`,
		body: String.raw`**.scale** — метод **GradScaler** из [[amp|AMP]]: умножает [[loss-fn|потерю]] на большой коэффициент перед **.backward()**, чтобы маленькие float16-[[gradient|градиенты]] не обнулялись. Дальше идут **scaler.step(optimizer)** и **scaler.update()**. У тензоров такого метода нет — для умножения используй **\*** или **.mul**.`,
		related: ["amp","loss-fn","gradient","optimizer"]
	},
	"py:.update": {
		id: "py:.update",
		term: String.raw`d.update(other)`,
		short: String.raw`Слить пары ключ-значение в словарь на месте.`,
		body: String.raw`**.update** дополняет словарь парами из **other** (другого dict или итерируемого пар), перезаписывая совпавшие ключи; меняет объект на месте и возвращает **None**. Часто встречается при сборке логов метрик по [[epoch|эпохам]] или при правке [[state-dict|state_dict]] перед загрузкой в [[nn-module|модель]].`,
		related: ["state-dict","nn-module"]
	},
};
