import type { Day } from '$lib/types';

// День 15 — Перенос обучения (transfer learning). Конвенции (см. day01.ts):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true.

export const day15: Day = {
	n: 15,
	phaseId: 'arch',
	title: 'Перенос обучения (transfer learning)',
	chapterRef: 'pt-15',
	est: '1–2 ч',
	goal: String.raw`Научиться брать готовую [[predobuchenie|предобученную]] сеть из torchvision, [[zamorozka-sloev|замораживать]] её backbone, [[zamena-golovy|менять «голову»]] под свои классы и при необходимости делать аккуратный [[fine-tuning|fine-tuning]] с маленьким [[learning-rate|lr]].`,
	sections: [
		{
			kind: 'intuition',
			heading: 'Зачем переносить обучение',
			body: String.raw`[[transfer-learning|Перенос обучения]] — это идея *не учить сеть с нуля*, а взять модель, уже обученную на огромном датасете (ImageNet, 1.2 млн картинок), и приспособить её под свою задачу, где данных мало.

Почему это работает? Глубокая [[conv2d|свёрточная]] сеть учит признаки **иерархически**: ранние слои ловят края и текстуры, средние — узоры и части объектов, поздние — целые объекты. Ранние и средние признаки **универсальны** — они полезны и для собак, и для рентгеновских снимков, и для спутниковых фото. Специфика задачи живёт в основном в самом конце — в «[[zamena-golovy|голове]]» классификатора.

Отсюда рецепт: оставить готовый [[feature-extraction|экстрактор признаков]] (backbone) как есть, а переучить только последний слой под свои классы. На паре сотен примеров это даёт качество, которого обучение с нуля не достигнет и за тысячи.`
		},
		{
			kind: 'definition',
			heading: 'Идея на numpy: фиксированные признаки + обучаемая голова',
			body: String.raw`Суть переноса видно даже без torch. Возьмём **замороженный** экстрактор признаков — здесь это случайная проекция с [[conv2d|ReLU]], веса которой создали один раз и больше не трогаем. Поверх его выходов обучим простой линейный классификатор ([[zamena-golovy|голову]]). Данные специально нелинейные (XOR-разметка): в исходных двух признаках линейный классификатор бессилен, а в пространстве признаков «backbone» — легко разделяет.`,
			code: {
				title: 'Замороженный экстрактор + обучаемая голова (numpy)',
				language: 'python',
				code: String.raw`import numpy as np
np.random.seed(0)

# Данные: XOR-разметка — линейно НЕ разделимы в исходных 2 признаках
N = 60
X = np.random.randn(N, 2)
y = (X[:, 0] * X[:, 1] > 0).astype(int)

# ЗАМОРОЖЕННЫЙ backbone: случайная проекция + ReLU, веса не обучаются
W_frozen = np.random.randn(2, 64)
feats = np.maximum(X @ W_frozen, 0)      # признаки, как у предобученной сети

# ОБУЧАЕМАЯ голова: логистическая регрессия поверх признаков
w, b, lr = np.zeros(64), 0.0, 0.1
for _ in range(300):
    p = 1 / (1 + np.exp(-(feats @ w + b)))
    g = p - y                            # градиент BCE по логиту
    w -= lr * (feats.T @ g) / N
    b -= lr * g.mean()
acc = ((feats @ w + b > 0).astype(int) == y).mean()
print(f"backbone + голова, accuracy = {acc:.2f}")  # ~1.00`,
				explanation: String.raw`Замороженный **W_frozen** считается один раз — это [[feature-extraction|feature extraction]]: backbone фиксирован, учится только [[zamena-golovy|голова]]. Хорошие (пусть и случайные) признаки делают задачу линейно разделимой. У настоящей предобученной сети признаки не случайны, а осмысленны — поэтому переносятся ещё лучше.`
			}
		},
		{
			kind: 'definition',
			heading: 'torchvision.models: берём готовую сеть',
			body: String.raw`Готовые архитектуры с весами лежат в **torchvision.models**: [[predobuchenie|resnet18/50]], **efficientnet**, **vit** и десятки других. Веса подгружаются аргументом **weights**:

- **weights='DEFAULT'** или **weights=ResNet18_Weights.IMAGENET1K_V1** — лучшие доступные предобученные веса;
- **weights=None** — случайная инициализация (обучение с нуля, не наш случай).

Важная деталь — **нормализация входа**. Сеть училась на картинках, приведённых к конкретным среднему и std ImageNet. Подашь данные в другом масштабе — признаки «поедут». Поэтому свои изображения нормируют **теми же** числами; нужный transform отдаёт сам объект весов через **weights.transforms()**.`,
			code: {
				title: 'Загрузка resnet18 с весами и правильный препроцессинг',
				language: 'text',
				colab: true,
				code: String.raw`import torch
from torchvision.models import resnet18, ResNet18_Weights

weights = ResNet18_Weights.DEFAULT          # предобучено на ImageNet
model = resnet18(weights=weights)

# Препроцессинг ОБЯЗАН совпадать с предобучением:
preprocess = weights.transforms()           # resize, crop, нормализация ImageNet
print(preprocess)

# Последний слой рассчитан на 1000 классов ImageNet
print(model.fc)                             # Linear(in_features=512, out_features=1000)`,
				explanation: String.raw`**weights.transforms()** — это не магия, а зафиксированный конвейер (resize → centre-crop → нормализация средним/std ImageNet). Использовать **те же** числа [[normalizaciya-vhoda|критично]]: иначе вход для сети «не такой, как на обучении», и предобученные признаки теряют смысл. **model.fc** — та самая [[zamena-golovy|голова]], которую мы заменим.`
			}
		},
		{
			kind: 'definition',
			heading: 'Заморозка backbone и замена головы',
			body: String.raw`Два шага превращают ImageNet-классификатор в наш:

1. **Заморозить backbone.** Проходим по параметрам и ставим **requires_grad=False** — тогда [[autograd|autograd]] не считает по ним [[gradient|градиенты]], а [[optimizer|оптимизатор]] не двигает их. Backbone становится фиксированным [[feature-extraction|экстрактором признаков]].
2. **Заменить голову.** Последний **nn.Linear** рассчитан на 1000 классов ImageNet. Создаём новый **nn.Linear(in_features, n_classes)** под своё число классов и кладём его на место **model.fc**. У нового слоя **requires_grad=True** по умолчанию — значит, учиться будет **только он**.

Ключевой момент: новый слой создаётся **после** заморозки, поэтому общая заморозка его не задевает.`,
			code: {
				title: 'Заморозить всё, заменить fc, обучать только голову',
				language: 'text',
				colab: true,
				code: String.raw`import torch.nn as nn
from torch import optim

n_classes = 5

# 1) заморозить backbone — градиенты по нему считаться не будут
for p in model.parameters():
    p.requires_grad = False

# 2) заменить «голову»: новый Linear на нужное число классов (requires_grad=True)
in_features = model.fc.in_features          # 512 у resnet18
model.fc = nn.Linear(in_features, n_classes)

# оптимизатору отдаём ТОЛЬКО обучаемые параметры (т.е. голову)
trainable = [p for p in model.parameters() if p.requires_grad]
optimizer = optim.Adam(trainable, lr=1e-3)
print("обучаемых тензоров:", len(trainable))  # 2: weight и bias головы`,
				explanation: String.raw`Фильтр **[p for p in model.parameters() if p.requires_grad]** отдаёт [[optimizer|оптимизатору]] ровно [[zamena-golovy|голову]]. Это и есть [[feature-extraction|feature extraction]]: backbone заморожен, learning rate можно держать обычным (**1e-3**) — мы рискуем только новым слоем.`
			}
		},
		{
			kind: 'connection',
			heading: 'Feature extraction vs fine-tuning',
			body: String.raw`Есть две стратегии переноса, и выбор зависит от объёма данных:

- **[[feature-extraction|Feature extraction]]** — backbone заморожен, учится только голова. Быстро, мало параметров, почти не [[overfitting|переобучается]]. Выбор по умолчанию, особенно когда данных немного (сотни примеров).
- **[[fine-tuning|Fine-tuning]]** — после прогрева головы **размораживаем** часть (или весь) backbone и доучиваем всю сеть. Это даёт чуть больше качества, когда данных достаточно и они заметно отличаются от ImageNet.

Почему при fine-tuning нужен **маленький** [[learning-rate|lr]] (например, **1e-4**, в 10 раз меньше)? Предобученные веса уже хороши — они почти в минимуме. Большой шаг градиента «снесёт» накопленные признаки быстрее, чем маленький, но богатый сигналом датасет успеет их улучшить. Малый lr бережно *подстраивает*, а не *ломает* предобучение. Частый приём — **разные lr**: крошечный для backbone, побольше для свежей головы.`,
			code: {
				title: 'Fine-tuning: разморозить и доучить с малым lr',
				language: 'text',
				colab: true,
				code: String.raw`# --- ФАЗА 1: feature extraction (см. выше) — прогрели голову N эпох ---

# --- ФАЗА 2: fine-tuning ---
for p in model.parameters():
    p.requires_grad = True                  # разморозить backbone

# разные lr: backbone бережно, голова порезвее
optimizer = optim.Adam([
    {"params": model.layer4.parameters(), "lr": 1e-4},   # поздний блок backbone
    {"params": model.fc.parameters(),     "lr": 1e-3},   # голова
])

# дальше — обычная петля обучения:
# model.train(); zero_grad → forward → loss → backward → step
# малый lr backbone бережно подстраивает признаки, не разрушая предобучение`,
				explanation: String.raw`Размораживаем **после** того как голова обучилась — иначе случайная голова даёт огромные градиенты, и они через большой [[learning-rate|lr]] испортят backbone. Группы параметров с разным **lr** — стандартный способ дать backbone крошечный шаг, а голове — обычный.`
			}
		},
		{
			kind: 'note',
			heading: 'Чек-лист переноса обучения',
			body: String.raw`Что держать в голове, перенося сеть на свою задачу:

- **weights=...**, а не **None** — иначе теряешь весь смысл переноса.
- **нормализация входа** строго как при предобучении (**weights.transforms()** / среднее и std ImageNet).
- заменяй **только голову**, число выходов = число твоих классов; **in_features** бери из старого слоя.
- сначала **feature extraction** (backbone заморожен) — на этом часто и останавливаются.
- **fine-tuning** — отдельной фазой, с маленьким [[learning-rate|lr]] и только если данных хватает.
- на инференсе — **model.eval()** (важно для [[batchnorm|BatchNorm]] backbone) и **torch.no_grad()**.`
		}
	],
	tasks: [
		{
			id: 'pt-d15-t1',
			difficulty: 'base',
			prompt: String.raw`Перед обучением головы вы прошлись по **model.parameters()** и поставили всем **requires_grad=False**, а затем заменили **model.fc** на новый **nn.Linear**. Зачем нужна была заморозка backbone и почему новый слой при этом всё равно обучается?`,
			hint: String.raw`Чему [[autograd|autograd]] считает [[gradient|градиенты]] при **requires_grad=False**? И когда был создан новый **fc** — до или после общей заморозки?`,
			solution: String.raw`[[zamorozka-sloev|Заморозка]] (**requires_grad=False**) говорит [[autograd|autograd]] не считать [[gradient|градиенты]] по backbone, а [[optimizer|оптимизатору]] — не двигать эти веса. Так предобученный [[feature-extraction|экстрактор признаков]] остаётся фиксированным, и мы экономим вычисления и почти не рискуем [[overfitting|переобучением]] на малых данных. Новый **nn.Linear** создан **после** заморозки и по умолчанию имеет **requires_grad=True**, поэтому общая заморозка его не коснулась — учиться будет только [[zamena-golovy|голова]].`,
			answer: String.raw`Заморозка фиксирует backbone как экстрактор признаков; новый **fc** создан после неё и остаётся обучаемым.`,
			xp: 12
		},
		{
			id: 'pt-d15-t2',
			difficulty: 'base',
			prompt: String.raw`На этапе [[fine-tuning|fine-tuning]] вы размораживаете backbone. Почему [[learning-rate|lr]] для него берут маленьким (скажем, **1e-4** вместо обычного **1e-3**)? Что произойдёт с большим lr?`,
			hint: String.raw`Предобученные веса уже почти в хорошем минимуме. Большой шаг по [[gradient|градиенту]] — это насколько сильное изменение весов?`,
			solution: String.raw`Предобученные веса уже близки к хорошему решению, поэтому их нужно лишь слегка *подстроить*. Маленький [[learning-rate|lr]] делает малые шаги и сохраняет накопленные признаки. Большой lr делает большие шаги и быстро **разрушает** предобучение раньше, чем небольшой датасет успеет его улучшить — качество просядет, а смысл переноса потеряется. Поэтому при [[fine-tuning|fine-tuning]] backbone доучивают бережно, часто с lr в 10 раз меньше, чем у [[zamena-golovy|головы]].`,
			answer: String.raw`Малый lr бережно подстраивает уже хорошие веса; большой lr сотрёт предобученные признаки.`,
			xp: 12
		},
		{
			id: 'pt-d15-t3',
			difficulty: 'star',
			prompt: String.raw`У **resnet18** последний слой — **model.fc = Linear(in_features=512, out_features=1000)**. Вы переносите сеть на задачу с 5 классами. Какой именно слой и на что вы заменяете, как корректно взять число входов, и почему нельзя просто оставить старый **fc** и «доучить» его до 5 классов?`,
			hint: String.raw`Старый слой выдаёт 1000 чисел — это форма выхода. Сколько чисел нужно для 5 классов? И откуда взять **in_features**, чтобы код не зависел от архитектуры?`,
			solution: String.raw`Заменяют [[zamena-golovy|голову]] — последний **nn.Linear**. Число входов берут из старого слоя, чтобы не хардкодить: **in_features = model.fc.in_features** (для resnet18 это 512), а выходов ставят **5**: **model.fc = nn.Linear(in_features, 5)**. Оставить старый **fc** нельзя: у него **out_features=1000**, то есть фиксированная [[shape-forma|форма выхода]] $(N,1000)$ под классы ImageNet. «Доучить» его до 5 классов невозможно — размерность выхода задаётся формой весовой матрицы $(1000,512)$ и не меняется обучением; нужна **новая** матрица $(5,512)$. Поэтому слой пересоздают, а его свежие случайные веса как раз и учат под свои классы (а backbone до этого [[zamorozka-sloev|заморожен]]).`,
			answer: String.raw`Заменяют последний **Linear** на **nn.Linear(model.fc.in_features, 5)**; старый фиксирован на 1000 выходов формой весов — переучить его число классов нельзя.`,
			xp: 25
		}
	],
	mastery: [
		'Объясняю идею transfer learning и почему ранние признаки сети универсальны',
		'Загружаю модель из torchvision.models с weights=... и нормирую вход как при предобучении',
		'Замораживаю backbone (requires_grad=False) и заменяю голову под своё число классов',
		'Различаю feature extraction и fine-tuning и беру маленький lr при разморозке'
	]
};
