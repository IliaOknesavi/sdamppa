import type { Glossary } from '$lib/types';

// Термины дня 14 (CNN). Базовые conv2d, pooling живут в glossary.ts и
// перекрывают совпадающие id — здесь только новые, специфичные для дня.
export const day14Terms: Glossary = {
	'conv-kernel': {
		id: 'conv-kernel',
		term: 'Ядро свёртки (kernel)',
		short: String.raw`Маленькая обучаемая матрица весов фильтра.`,
		body: String.raw`**Ядро** (фильтр) — небольшая матрица весов (часто $3\times3$ или $5\times5$), которая скользит по входу и на каждой позиции даёт одно число [[feature-map|карты признаков]]. Одно ядро = один тип признака (край, угол, текстура). В [[conv2d|Conv2d]] ядро не задают вручную — его веса учатся обратным распространением. У слоя их **out_channels** штук на каждый входной канал.`,
		related: ['conv2d', 'feature-map', 'razdelenie-vesov']
	},
	'feature-map': {
		id: 'feature-map',
		term: 'Карта признаков',
		short: String.raw`Выход одного фильтра свёртки.`,
		body: String.raw`**Карта признаков** — 2D-результат применения одного [[conv-kernel|ядра]] ко всему входу: где значение велико, там фильтр «нашёл» свой признак. Слой [[conv2d|Conv2d]] с **out_channels** $=C$ выдаёт $C$ таких карт, сложенных в тензор $(N, C, H', W')$. Ранние слои дают карты краёв и пятен, глубокие — частей объектов.`,
		related: ['conv2d', 'conv-kernel', 'receptive-field']
	},
	'max-pool': {
		id: 'max-pool',
		term: 'Max pooling',
		short: String.raw`Максимум в окне — уменьшает размер вдвое.`,
		body: String.raw`**nn.MaxPool2d(2)** берёт максимум в каждом непересекающемся окне $2\times2$ и так уменьшает пространственный размер [[feature-map|карты]] вдвое: $(N,C,H,W)\to(N,C,H/2,W/2)$. Каналы не меняет, [[parametr|параметров]] не имеет. Сохраняет самый сильный отклик в окрестности — отсюда лёгкая устойчивость к сдвигам и рост [[receptive-field|рецептивного поля]].`,
		related: ['pooling', 'feature-map', 'receptive-field']
	},
	'padding-stride': {
		id: 'padding-stride',
		term: 'Padding и stride',
		short: String.raw`Рамка нулей и шаг скольжения ядра.`,
		body: String.raw`**stride** $s$ — на сколько пикселей сдвигается [[conv-kernel|ядро]] за шаг: $s=2$ прореживает выход вдвое. **padding** $p$ — рамка из нулей вокруг входа: без неё свёртка отъедает края ($H\to H-k+1$), а $p=(k-1)/2$ при $s=1$ сохраняет размер (режим «same»). Оба входят в [[vyhodnoy-razmer|формулу выходного размера]].`,
		related: ['conv2d', 'vyhodnoy-razmer']
	},
	'receptive-field': {
		id: 'receptive-field',
		term: 'Рецептивное поле',
		short: String.raw`Кусок входа, влияющий на один нейрон.`,
		body: String.raw`**Рецептивное поле** нейрона — область исходной картинки, которая может на него повлиять. У одной свёртки $3\times3$ оно $3\times3$; каждая следующая свёртка и [[max-pool|пулинг]] его расширяют, так что глубокие нейроны «видят» крупные части или всю картинку. Рост рецептивного поля — причина, по которой стек слоёв улавливает признаки от краёв до целых объектов.`,
		related: ['conv2d', 'max-pool', 'feature-map']
	},
	'vyhodnoy-razmer': {
		id: 'vyhodnoy-razmer',
		term: 'Формула выходного размера',
		short: String.raw`Размер карты после Conv/Pool.`,
		formula: String.raw`H' = \left\lfloor \dfrac{H + 2p - k}{s} \right\rfloor + 1`,
		body: String.raw`Размер [[feature-map|карты]] по каждой оси после свёртки (или [[max-pool|пулинга]]) с ядром $k$, шагом [[padding-stride|stride]] $s$ и [[padding-stride|padding]] $p$: $H' = \lfloor (H + 2p - k)/s \rfloor + 1$. Частые случаи: $k=3, p=1, s=1$ сохраняет размер; **MaxPool2d(2)** ($k=2, s=2, p=0$) делит пополам. Эту формулу применяют к слою отдельно по высоте и ширине.`,
		related: ['conv2d', 'padding-stride', 'max-pool']
	},
	'flatten-pered-linear': {
		id: 'flatten-pered-linear',
		term: 'Flatten перед Linear',
		short: String.raw`Тензор (N,C,H,W) -> вектор (N, C·H·W).`,
		body: String.raw`**nn.Flatten()** вытягивает свёрточный выход $(N, C, H, W)$ в вектор $(N, C\cdot H\cdot W)$, не трогая ось батча. Это обязательный мост между «телом» из [[conv2d|свёрток]] и «головой» из [[nn-module|Linear]]: полносвязный слой принимает только плоский вектор признаков. Размер этого вектора $C\cdot H\cdot W$ и задают первым аргументом **nn.Linear**.`,
		related: ['conv2d', 'nn-module', 'feature-map']
	},
	'razdelenie-vesov': {
		id: 'razdelenie-vesov',
		term: 'Разделение весов',
		short: String.raw`Одно ядро переиспользуется во всех позициях.`,
		body: String.raw`**Разделение весов** (weight sharing) — ключевая идея свёртки: одно [[conv-kernel|ядро]] применяется ко всем позициям входа, а не свой вес на каждую пару пикселей, как в [[nn-module|Linear]]. Отсюда резко меньше [[parametr|параметров]] (размер картинки не влияет на их число) и [[invariantnost-k-sdvigu|инвариантность к сдвигу]]: признак ловится где угодно.`,
		related: ['conv2d', 'conv-kernel', 'invariantnost-k-sdvigu']
	},
	'invariantnost-k-sdvigu': {
		id: 'invariantnost-k-sdvigu',
		term: 'Инвариантность к сдвигу',
		short: String.raw`Сдвиг объекта не меняет распознавание.`,
		body: String.raw`**Инвариантность к сдвигу** — свойство CNN распознавать признак независимо от его положения на картинке. Возникает из [[razdelenie-vesov|разделения весов]] (один фильтр сканирует всё поле) и усиливается [[max-pool|пулингом]] (максимум не зависит от точной позиции в окне). Поэтому сдвиг цифры на пару пикселей почти не меняет ответ сети.`,
		related: ['razdelenie-vesov', 'max-pool', 'conv2d']
	}
};
