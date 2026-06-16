import type { Glossary } from '$lib/types';

// =====================================================================
//  PyTorch — базовый (канонический) глоссарий. Сквозные термины, на которые
//  ссылаются многие дни. Дни добавляют свои термины в dayNN.terms.ts; этот
//  набор перекрывает совпадающие id (см. index.ts: ...baseGlossary в конце).
//
//  Конвенция разметки: ВСЕ строки — String.raw (LaTeX-бэкслеши целы).
//  Имена кода/идентификаторы — **жирным** (бэктики ломают String.raw).
//  Математика — $...$ и $$...$$.
// =====================================================================

export const glossary: Glossary = {
	tenzor: {
		id: 'tenzor',
		term: 'Тензор',
		short: String.raw`Многомерный массив чисел — основной объект PyTorch.`,
		formula: String.raw`T \in \mathbb{R}^{d_1\times d_2\times\cdots\times d_k}`,
		body: String.raw`**Тензор** (**torch.Tensor**) — $n$-мерный массив одного [[dtype|типа]], живущий на [[device|устройстве]] (CPU/GPU). Скаляр — тензор ранга 0, вектор — 1, матрица — 2, батч картинок — обычно 4D $(N,C,H,W)$. От numpy-массива отличается двумя сверхспособностями: умеет считаться на [[cuda|GPU]] и хранит историю операций для [[autograd|автоградиента]].`,
		related: ['dtype', 'device', 'broadcasting', 'autograd']
	},
	dtype: {
		id: 'dtype',
		term: 'dtype (тип элемента)',
		short: String.raw`Тип чисел в тензоре: float32, int64, bool, …`,
		body: String.raw`**dtype** — тип всех элементов [[tenzor|тензора]]. По умолчанию веса и активации — **torch.float32**; индексы/метки — **torch.int64** (long). Смешивать типы в одной операции нельзя — нужно явное **.to(dtype)**. Половинная точность **float16**/**bfloat16** ускоряет обучение на GPU ([[amp|mixed precision]]).`,
		related: ['tenzor', 'device']
	},
	device: {
		id: 'device',
		term: 'device (устройство)',
		short: String.raw`Где лежит тензор: cpu или cuda.`,
		body: String.raw`**device** — память, в которой хранится [[tenzor|тензор]]: **'cpu'** или **'cuda:0'**. Операция требует, чтобы все её аргументы были на **одном** устройстве, иначе RuntimeError. Перенос — **t.to(device)** (создаёт копию). Канон: **device = 'cuda' if torch.cuda.is_available() else 'cpu'**, затем **.to(device)** для модели и данных.`,
		related: ['tenzor', 'cuda', 'dtype']
	},
	cuda: {
		id: 'cuda',
		term: 'CUDA / GPU',
		short: String.raw`Вычисления на видеокарте NVIDIA.`,
		body: String.raw`**CUDA** — платформа NVIDIA для вычислений на GPU. Матричные операции нейросетей параллелятся на тысячи ядер — отсюда ускорение в десятки-сотни раз против CPU. В PyTorch это почти бесплатно: переносишь [[tenzor|тензоры]] и модель на [[device|device]] **'cuda'**, код не меняется. Узкое место — копирование CPU↔GPU.`,
		related: ['device', 'tenzor', 'amp']
	},
	broadcasting: {
		id: 'broadcasting',
		term: 'Broadcasting',
		short: String.raw`Автоматическое растягивание форм при операциях.`,
		body: String.raw`**Broadcasting** — правило, по которому тензоры разной формы участвуют в поэлементной операции без явного копирования. Формы сравниваются справа налево; размерность подходит, если равна или равна $1$ (тогда «растягивается»). Пример: $(N,3)+(3,)\to(N,3)$. Экономит память, но молча скрывает ошибки формы — держи в голове итоговый shape.`,
		related: ['tenzor', 'dtype']
	},
	autograd: {
		id: 'autograd',
		term: 'Autograd',
		short: String.raw`Автоматическое дифференцирование PyTorch.`,
		body: String.raw`**Autograd** — движок, который сам считает производные. Пока ты делаешь операции над тензорами с [[requires-grad|requires_grad=True]], PyTorch строит [[vychislitelnyy-graf|вычислительный граф]]; вызов [[backward|.backward()]] прогоняет по нему обратное распространение и кладёт $\partial L/\partial w$ в **w.grad**. Благодаря autograd ты пишешь только *прямой* проход — градиенты находятся сами.`,
		formula: String.raw`\frac{\partial L}{\partial w} \;\;\text{— считается автоматически}`,
		related: ['vychislitelnyy-graf', 'backward', 'requires-grad', 'gradient']
	},
	'vychislitelnyy-graf': {
		id: 'vychislitelnyy-graf',
		term: 'Вычислительный граф',
		short: String.raw`Динамический граф операций, по которому течёт градиент.`,
		body: String.raw`**Вычислительный граф** — ориентированный граф, где узлы это операции, а рёбра — тензоры. PyTorch строит его *на лету* (define-by-run): граф появляется по мере прямого прохода и пересобирается каждую итерацию. [[backward|Обратный проход]] идёт по графу назад, применяя правило цепочки. После **.backward()** граф освобождается (если не **retain_graph=True**).`,
		related: ['autograd', 'backward', 'gradient']
	},
	'requires-grad': {
		id: 'requires-grad',
		term: 'requires_grad',
		short: String.raw`Флаг «следить за этим тензором для градиентов».`,
		body: String.raw`**requires_grad=True** помечает [[tenzor|тензор]] как обучаемый: все операции с ним попадают в [[vychislitelnyy-graf|граф]], и для него будет посчитан [[gradient|градиент]]. У [[parametr|параметров]] модели он включён автоматически. Отключить слежение (инференс, заморозка) — **with torch.no_grad():** или **.detach()**.`,
		related: ['autograd', 'gradient', 'parametr']
	},
	backward: {
		id: 'backward',
		term: '.backward()',
		short: String.raw`Запуск обратного распространения.`,
		body: String.raw`**loss.backward()** запускает [[backprop|обратное распространение]]: PyTorch проходит [[vychislitelnyy-graf|граф]] от скалярной потери назад и **накапливает** $\partial L/\partial w$ в **w.grad** для каждого [[parametr|параметра]]. Именно накапливает — поэтому перед следующим шагом нужен [[zero-grad|optimizer.zero_grad()]], иначе градиенты сложатся.`,
		related: ['autograd', 'backprop', 'gradient', 'zero-grad']
	},
	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных — куда растёт функция.`,
		formula: String.raw`\nabla_w L = \left(\frac{\partial L}{\partial w_1},\dots,\frac{\partial L}{\partial w_n}\right)`,
		body: String.raw`**Градиент** $\nabla_w L$ — вектор частных производных потери по параметрам. Указывает направление наискорейшего *роста*, поэтому [[gradient-spusk|градиентный спуск]] шагает в **минус** градиент. В PyTorch лежит в **param.grad** после [[backward|.backward()]].`,
		related: ['gradient-spusk', 'backward', 'autograd']
	},
	parametr: {
		id: 'parametr',
		term: 'Параметр (nn.Parameter)',
		short: String.raw`Обучаемый тензор внутри модуля.`,
		body: String.raw`**nn.Parameter** — [[tenzor|тензор]] с [[requires-grad|requires_grad=True]], который [[nn-module|nn.Module]] автоматически регистрирует как обучаемый. Все параметры модели достаются через **model.parameters()** — ровно их и отдают [[optimizer|оптимизатору]]. Веса **weight** и смещения **bias** слоёв — это nn.Parameter.`,
		related: ['nn-module', 'optimizer', 'requires-grad']
	},
	'nn-module': {
		id: 'nn-module',
		term: 'nn.Module',
		short: String.raw`Базовый класс всех моделей и слоёв.`,
		body: String.raw`**nn.Module** — базовый класс для слоёв и моделей. Наследуешь его, в **__init__** объявляешь подслои/[[parametr|параметры]], в **forward(x)** описываешь прямой проход. Модуль сам собирает параметры (**.parameters()**), переносится на [[device|устройство]] (**.to(device)**) и переключает [[train-eval|режимы]] (**.train()/.eval()**). Вложенные модули образуют дерево.`,
		related: ['parametr', 'forward', 'train-eval']
	},
	forward: {
		id: 'forward',
		term: 'Прямой проход (forward)',
		short: String.raw`Вычисление выхода модели по входу.`,
		body: String.raw`**Прямой проход** — метод **forward(x)**, превращающий вход в предсказание. Вызывают его *не напрямую*, а через **model(x)** — так срабатывают хуки и [[vychislitelnyy-graf|построение графа]]. Во время forward записывается история операций для [[autograd|autograd]].`,
		related: ['nn-module', 'autograd', 'backprop']
	},
	backprop: {
		id: 'backprop',
		term: 'Обратное распространение',
		short: String.raw`Правило цепочки по всему графу.`,
		body: String.raw`**Backpropagation** — применение правила цепочки от потери к каждому весу по [[vychislitelnyy-graf|графу]]. Это не отдельный алгоритм обучения, а способ *эффективно посчитать* все [[gradient|градиенты]] за один обратный проход. Дальше [[optimizer|оптимизатор]] делает шаг [[gradient-spusk|спуска]].`,
		related: ['backward', 'gradient', 'gradient-spusk']
	},
	'gradient-spusk': {
		id: 'gradient-spusk',
		term: 'Градиентный спуск',
		short: String.raw`Шаг в минус-градиент для минимизации потери.`,
		formula: String.raw`w \leftarrow w - \eta\,\nabla_w L`,
		body: String.raw`**Градиентный спуск** обновляет параметры в сторону, противоположную [[gradient|градиенту]], с шагом [[learning-rate|learning rate]] $\eta$: $w\leftarrow w-\eta\nabla_w L$. На практике — [[sgd|стохастический]] вариант: градиент считается по [[batch|мини-батчу]], а не по всей выборке.`,
		related: ['gradient', 'learning-rate', 'sgd', 'optimizer']
	},
	optimizer: {
		id: 'optimizer',
		term: 'Оптимизатор (torch.optim)',
		short: String.raw`Объект, делающий шаг обновления весов.`,
		body: String.raw`**Оптимизатор** хранит ссылки на [[parametr|параметры]] и по их **.grad** обновляет веса: **optimizer.step()**. Перед каждым шагом — [[zero-grad|zero_grad()]]. Популярные: [[sgd|SGD]] (+momentum) и [[adam|Adam]]. Создаётся как **optim.Adam(model.parameters(), lr=...)**.`,
		related: ['sgd', 'adam', 'zero-grad', 'learning-rate']
	},
	'zero-grad': {
		id: 'zero-grad',
		term: 'zero_grad()',
		short: String.raw`Обнулить накопленные градиенты перед шагом.`,
		body: String.raw`[[backward|.backward()]] **накапливает** градиенты, поэтому в начале каждой итерации вызывают **optimizer.zero_grad()** — иначе градиенты соседних батчей сложатся и обучение сломается. Канонический порядок шага: zero_grad → forward → loss → backward → step.`,
		related: ['backward', 'optimizer', 'gradient']
	},
	sgd: {
		id: 'sgd',
		term: 'SGD',
		short: String.raw`Стохастический градиентный спуск (+ momentum).`,
		formula: String.raw`w \leftarrow w - \eta\, g,\quad g=\nabla_w L_{\text{batch}}`,
		body: String.raw`**SGD** оценивает [[gradient|градиент]] по [[batch|мини-батчу]] и шагает в минус. С **momentum** накапливает скорость и быстрее проходит овраги. Прост и хорошо обобщает, но чувствителен к [[learning-rate|lr]].`,
		related: ['gradient-spusk', 'adam', 'learning-rate', 'batch']
	},
	adam: {
		id: 'adam',
		term: 'Adam',
		short: String.raw`Адаптивный оптимизатор с моментами.`,
		body: String.raw`**Adam** хранит скользящие средние градиента (1-й момент) и его квадрата (2-й) и масштабирует шаг по каждому весу отдельно. Обычно сходится быстрее [[sgd|SGD]] «из коробки» — дефолтный выбор для старта. Типичный **lr=1e-3**.`,
		related: ['sgd', 'optimizer', 'learning-rate']
	},
	'learning-rate': {
		id: 'learning-rate',
		term: 'Learning rate (η)',
		short: String.raw`Размер шага обучения.`,
		body: String.raw`**Learning rate** $\eta$ — насколько сильно сдвигать веса вдоль [[gradient|градиента]]. Слишком большой — расхождение/осцилляции, слишком малый — медленно. Самый важный гиперпараметр; часто меняют по ходу обучения [[scheduler|расписанием]].`,
		related: ['gradient-spusk', 'sgd', 'adam', 'scheduler']
	},
	'loss-fn': {
		id: 'loss-fn',
		term: 'Функция потерь',
		short: String.raw`Скаляр «насколько модель ошибается».`,
		body: String.raw`**Функция потерь** превращает предсказание и истину в одно число, которое минимизируют. Регрессия — [[mse|MSE]]; классификация — [[cross-entropy|кросс-энтропия]]. Именно по потере вызывают [[backward|.backward()]], поэтому она обязана быть скаляром.`,
		related: ['mse', 'cross-entropy', 'backward']
	},
	mse: {
		id: 'mse',
		term: 'MSE (среднеквадратичная)',
		short: String.raw`Средний квадрат ошибки — для регрессии.`,
		formula: String.raw`\mathrm{MSE}=\tfrac1N\sum_i (\hat y_i-y_i)^2`,
		body: String.raw`**MSE** усредняет квадраты отклонений предсказания от цели. Гладкая, штрафует большие ошибки сильнее. В PyTorch — **nn.MSELoss()**. Используется в регрессии.`,
		related: ['loss-fn', 'cross-entropy']
	},
	'cross-entropy': {
		id: 'cross-entropy',
		term: 'Кросс-энтропия',
		short: String.raw`Потеря для классификации.`,
		formula: String.raw`-\sum_c y_c \log \hat p_c`,
		body: String.raw`**Кросс-энтропия** измеряет расхождение предсказанного распределения и истинного класса. В PyTorch **nn.CrossEntropyLoss** принимает **сырые логиты** (без [[softmax|softmax]]) и целые метки — softmax и логарифм считаются внутри ради численной устойчивости.`,
		related: ['loss-fn', 'softmax']
	},
	softmax: {
		id: 'softmax',
		term: 'Softmax',
		short: String.raw`Логиты → вероятности классов.`,
		formula: String.raw`\sigma(z)_i=\dfrac{e^{z_i}}{\sum_j e^{z_j}}`,
		body: String.raw`**Softmax** превращает вектор логитов в распределение вероятностей (сумма = 1). На обучении его обычно *не* применяют вручную: [[cross-entropy|CrossEntropyLoss]] делает это внутри. Для инференса — **softmax(dim=-1)** или просто **argmax** по логитам.`,
		related: ['cross-entropy', 'loss-fn']
	},
	batch: {
		id: 'batch',
		term: 'Батч (мини-батч)',
		short: String.raw`Пачка примеров, обрабатываемая за один шаг.`,
		body: String.raw`**Мини-батч** — небольшая группа примеров (например, 32/64), по которой считают [[gradient|градиент]] и делают один шаг [[sgd|SGD]]. Компромисс между точностью оценки градиента и скоростью; первая ось тензора — обычно размер батча $N$. Батчи выдаёт [[dataloader|DataLoader]].`,
		related: ['dataloader', 'dataset', 'sgd', 'epoch']
	},
	epoch: {
		id: 'epoch',
		term: 'Эпоха',
		short: String.raw`Один полный проход по обучающей выборке.`,
		body: String.raw`**Эпоха** — один проход по всем [[batch|батчам]] обучающего набора. Обучение длится несколько эпох; в конце каждой обычно меряют качество на валидации, чтобы ловить [[overfitting|переобучение]].`,
		related: ['batch', 'dataloader', 'overfitting']
	},
	dataset: {
		id: 'dataset',
		term: 'Dataset',
		short: String.raw`Источник примеров: __len__ и __getitem__.`,
		body: String.raw`**Dataset** (**torch.utils.data.Dataset**) описывает доступ к данным: **__len__** (сколько) и **__getitem__(i)** (вернуть $i$-й пример как тензоры). Не грузит всё в память сразу — читает по запросу. Поверх него работает [[dataloader|DataLoader]].`,
		related: ['dataloader', 'batch']
	},
	dataloader: {
		id: 'dataloader',
		term: 'DataLoader',
		short: String.raw`Батчинг, перемешивание и параллельная загрузка.`,
		body: String.raw`**DataLoader** оборачивает [[dataset|Dataset]] и выдаёт [[batch|батчи]]: **batch_size**, **shuffle=True** (перемешать каждую [[epoch|эпоху]]), **num_workers** (параллельная загрузка). По нему просто итерируются в цикле обучения.`,
		related: ['dataset', 'batch', 'epoch']
	},
	'train-eval': {
		id: 'train-eval',
		term: 'Режимы train / eval',
		short: String.raw`model.train() и model.eval().`,
		body: String.raw`Некоторые слои ведут себя по-разному при обучении и инференсе: [[dropout|Dropout]] активен только в train, [[batchnorm|BatchNorm]] на train обновляет статистики, на eval использует накопленные. Поэтому переключают **model.train()** / **model.eval()**; на инференсе ещё оборачивают в **torch.no_grad()**.`,
		related: ['dropout', 'batchnorm', 'overfitting']
	},
	overfitting: {
		id: 'overfitting',
		term: 'Переобучение',
		short: String.raw`Модель запомнила трейн, но не обобщает.`,
		body: String.raw`**Переобучение** — train-потеря падает, а валидационная растёт: модель подстроилась под шум обучающих данных. Лечится [[regularizaciya|регуляризацией]] ([[dropout|dropout]], [[weight-decay|weight decay]], аугментации), ранней остановкой и бо́льшим объёмом данных.`,
		related: ['regularizaciya', 'dropout', 'weight-decay', 'train-eval']
	},
	regularizaciya: {
		id: 'regularizaciya',
		term: 'Регуляризация',
		short: String.raw`Приёмы против переобучения.`,
		body: String.raw`**Регуляризация** — всё, что ограничивает сложность модели ради обобщения: [[weight-decay|weight decay]] ($L_2$), [[dropout|dropout]], [[batchnorm|BatchNorm]], аугментации, ранняя остановка. Цель — снизить [[overfitting|переобучение]], не убив обучаемость.`,
		related: ['overfitting', 'dropout', 'weight-decay', 'batchnorm']
	},
	dropout: {
		id: 'dropout',
		term: 'Dropout',
		short: String.raw`Случайно зануляет активации при обучении.`,
		body: String.raw`**Dropout** с вероятностью $p$ зануляет часть активаций на каждом шаге обучения — сеть не полагается на отдельные нейроны и лучше обобщает. Активен только в [[train-eval|train]]; на eval отключается. **nn.Dropout(p=0.5)**.`,
		related: ['regularizaciya', 'overfitting', 'train-eval']
	},
	batchnorm: {
		id: 'batchnorm',
		term: 'BatchNorm',
		short: String.raw`Нормализация активаций по батчу.`,
		body: String.raw`**BatchNorm** нормирует активации внутри [[batch|батча]] (нулевое среднее, единичная дисперсия) и учит масштаб/сдвиг. Стабилизирует и ускоряет обучение, слегка регуляризует. На [[train-eval|train]] считает статистики по батчу, на eval — накопленные скользящие.`,
		related: ['regularizaciya', 'train-eval', 'batch']
	},
	'weight-decay': {
		id: 'weight-decay',
		term: 'Weight decay (L2)',
		short: String.raw`Штраф за большие веса.`,
		body: String.raw`**Weight decay** добавляет к потере штраф $\lambda\|w\|^2$ — тянет веса к нулю, ограничивая сложность. В PyTorch задаётся параметром **weight_decay** у [[optimizer|оптимизатора]]. Форма [[regularizaciya|регуляризации]] против [[overfitting|переобучения]].`,
		related: ['regularizaciya', 'optimizer', 'overfitting']
	},
	scheduler: {
		id: 'scheduler',
		term: 'LR scheduler',
		short: String.raw`Расписание изменения learning rate.`,
		body: String.raw`**Scheduler** меняет [[learning-rate|lr]] по ходу обучения: step-decay, cosine, warmup. Часто крупный lr в начале и затухание к концу даёт лучшую сходимость. Вызывают **scheduler.step()** обычно раз в [[epoch|эпоху]].`,
		related: ['learning-rate', 'optimizer', 'epoch']
	},
	'state-dict': {
		id: 'state-dict',
		term: 'state_dict',
		short: String.raw`Словарь весов модели/оптимизатора.`,
		body: String.raw`**state_dict** — обычный словарь {имя_параметра: тензор}. Сохраняют *его*, а не всю модель: **torch.save(model.state_dict(), path)**, загрузка — **model.load_state_dict(torch.load(path))**. Так чекпойнты переносимы между версиями кода.`,
		related: ['parametr', 'nn-module']
	},
	amp: {
		id: 'amp',
		term: 'Mixed precision (AMP)',
		short: String.raw`Обучение в half-точности ради скорости.`,
		body: String.raw`**AMP** считает часть операций в **float16**/**bfloat16**, экономя память и ускоряя GPU, а критичные места держит в **float32**. В PyTorch — **torch.autocast** + **GradScaler**. Особенно выгодно на [[cuda|тензорных ядрах]] современных GPU.`,
		related: ['cuda', 'dtype', 'device']
	},
	conv2d: {
		id: 'conv2d',
		term: 'Свёртка (Conv2d)',
		short: String.raw`Скользящий фильтр по изображению.`,
		body: String.raw`**nn.Conv2d** применяет обучаемые ядра, скользящие по входу $(N,C,H,W)$, выделяя локальные признаки (края, текстуры). Делит веса между позициями — отсюда мало параметров и трансляционная инвариантность. Основа [[pooling|CNN]].`,
		related: ['pooling', 'tenzor']
	},
	pooling: {
		id: 'pooling',
		term: 'Pooling',
		short: String.raw`Понижение разрешения карты признаков.`,
		body: String.raw`**Pooling** (max/avg) агрегирует соседние значения карты признаков, уменьшая пространственный размер и давая устойчивость к сдвигам. Идёт после [[conv2d|свёрток]]; параметров не имеет.`,
		related: ['conv2d']
	}
};
