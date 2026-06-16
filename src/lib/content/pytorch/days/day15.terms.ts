import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 15 (перенос обучения). Базовые (conv2d, optimizer,
// learning-rate, overfitting…) живут в glossary.ts и перекрывают совпадающие id.
export const day15Terms: Glossary = {
	'transfer-learning': {
		id: 'transfer-learning',
		term: 'Перенос обучения (transfer learning)',
		short: String.raw`Приспособить готовую сеть под свою задачу.`,
		body: String.raw`**Transfer learning** — вместо обучения сети с нуля берут модель, уже обученную на большом датасете, и переносят её знания на свою (обычно малую) задачу. Работает потому, что ранние [[conv2d|свёрточные]] слои учат универсальные признаки (края, текстуры), полезные почти везде. На практике сводится к двум приёмам: [[feature-extraction|feature extraction]] и [[fine-tuning|fine-tuning]].`,
		related: ['predobuchenie', 'feature-extraction', 'fine-tuning', 'zamena-golovy']
	},
	'predobuchenie': {
		id: 'predobuchenie',
		term: 'Предобучение (pretraining)',
		short: String.raw`Веса, выученные на большом датасете заранее.`,
		body: String.raw`**Предобучение** — обучение сети на огромном универсальном датасете (для зрения это ImageNet, 1.2 млн картинок, 1000 классов). Полученные веса подгружают аргументом **weights=...** в **torchvision.models** (**resnet18(weights=ResNet18_Weights.DEFAULT)**). Они и есть стартовый капитал для [[transfer-learning|переноса]]: альтернатива **weights=None** — обучение с нуля.`,
		related: ['transfer-learning', 'normalizaciya-vhoda', 'feature-extraction']
	},
	'zamorozka-sloev': {
		id: 'zamorozka-sloev',
		term: 'Заморозка слоёв',
		short: String.raw`requires_grad=False — слой не обучается.`,
		body: String.raw`**Заморозка** — установка [[requires-grad|requires_grad=False]] параметрам слоя. Тогда [[autograd|autograd]] не считает по ним [[gradient|градиенты]], а [[optimizer|оптимизатор]] их не двигает: слой превращается в фиксированный [[feature-extraction|экстрактор признаков]]. Делается циклом **for p in model.parameters(): p.requires_grad = False**. Снятие заморозки (**= True**) открывает слой для [[fine-tuning|дообучения]].`,
		related: ['requires-grad', 'feature-extraction', 'fine-tuning', 'zamena-golovy']
	},
	'feature-extraction': {
		id: 'feature-extraction',
		term: 'Feature extraction',
		short: String.raw`Backbone заморожен, учится только голова.`,
		body: String.raw`**Feature extraction** — стратегия [[transfer-learning|переноса]], где backbone [[zamorozka-sloev|заморожен]] и работает как готовый экстрактор признаков, а обучается только новая [[zamena-golovy|голова]]. Быстро, мало обучаемых [[parametr|параметров]], почти не [[overfitting|переобучается]] — выбор по умолчанию при малом объёме данных. [[learning-rate|lr]] можно держать обычным, ведь рискуем лишь свежим слоем.`,
		related: ['zamorozka-sloev', 'zamena-golovy', 'fine-tuning', 'transfer-learning']
	},
	'fine-tuning': {
		id: 'fine-tuning',
		term: 'Fine-tuning (дообучение)',
		short: String.raw`Разморозить backbone и доучить с малым lr.`,
		body: String.raw`**Fine-tuning** — после прогрева [[zamena-golovy|головы]] размораживают часть или весь backbone и доучивают всю сеть на своих данных. Даёт прибавку к качеству, когда данных достаточно и они отличаются от датасета [[predobuchenie|предобучения]]. Ключевое правило — **маленький** [[learning-rate|lr]] (например, **1e-4**): большой шаг сотрёт предобученные признаки. Частый приём — разные lr для backbone и головы.`,
		related: ['feature-extraction', 'zamorozka-sloev', 'learning-rate', 'transfer-learning']
	},
	'zamena-golovy': {
		id: 'zamena-golovy',
		term: 'Замена «головы»',
		short: String.raw`Новый последний Linear под свои классы.`,
		body: String.raw`**Голова** — последний классифицирующий слой сети (**nn.Linear**), чьё число выходов равно числу классов задачи. У предобученной сети это 1000 (ImageNet), под свою задачу его **заменяют**: число входов берут из старого слоя (**model.fc.in_features**), а выходов ставят своё (**model.fc = nn.Linear(in_features, n_classes)**). Свежий слой имеет [[requires-grad|requires_grad=True]] и обучается под свои классы, пока backbone [[zamorozka-sloev|заморожен]].`,
		related: ['feature-extraction', 'zamorozka-sloev', 'fine-tuning', 'transfer-learning']
	},
	'normalizaciya-vhoda': {
		id: 'normalizaciya-vhoda',
		term: 'Нормализация входа под предобучение',
		short: String.raw`Тот же препроцессинг, что при обучении сети.`,
		body: String.raw`Предобученная сеть ждёт вход в **том же** масштабе, в каком училась: resize/crop и нормализация средним и std ImageNet. Подашь данные в другом масштабе — признаки «поедут» и [[predobuchenie|предобучение]] теряет смысл. Готовый конвейер отдаёт сам объект весов: **weights.transforms()**. Не путать с [[batchnorm|BatchNorm]] внутри сети — это нормализация именно **входных** картинок.`,
		related: ['predobuchenie', 'transfer-learning', 'batchnorm']
	}
};
