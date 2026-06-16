import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 5. Базовые (autograd, backward, gradient,
// vychislitelnyy-graf, zero-grad…) живут в glossary.ts и перекрывают совпадающие id.
export const day05Terms: Glossary = {
	'micrograd-value': {
		id: 'micrograd-value',
		term: 'Value (мини-autograd)',
		short: String.raw`Скаляр, помнящий значение, градиент и предков.`,
		body: String.raw`**Value** — учебный аналог [[tenzor|тензора]] из micrograd: оборачивает **одно** число и хранит **data** (значение), **grad** ($\partial L/\partial\text{value}$), множество предков **_prev** и замыкание **_backward** (как протолкнуть градиент назад). Перегружая $+$, $*$, **tanh**, он строит [[vychislitelnyy-graf|вычислительный граф]] по ходу вычислений — ровно как define-by-run в [[autograd|autograd]] PyTorch, только для скаляров.`,
		related: ['autograd', 'vychislitelnyy-graf', 'lokalnyy-gradient', 'tenzor']
	},
	'lokalnyy-gradient': {
		id: 'lokalnyy-gradient',
		term: 'Локальный градиент',
		short: String.raw`Производная операции по её прямым входам.`,
		body: String.raw`**Локальный градиент** — производная выхода **одной** операции по её непосредственным входам, без оглядки на остальной граф. Для $a+b$ он равен $1$ по каждому входу; для $a\cdot b$ — это $b$ и $a$; для $\tanh(a)$ — $1-\tanh^2(a)$. [[pravilo-cepochki|Правило цепочки]] собирает из локальных градиентов глобальный: вклад узла = локальный градиент $\times$ градиент, пришедший сверху.`,
		formula: String.raw`\frac{\partial c}{\partial a}\Big|_{\text{локально}}\ \text{— только эта операция}`,
		related: ['pravilo-cepochki', 'gradient', 'micrograd-value']
	},
	'pravilo-cepochki': {
		id: 'pravilo-cepochki',
		term: 'Правило цепочки',
		short: String.raw`Производная композиции = произведение производных.`,
		body: String.raw`**Правило цепочки** даёт производную составной функции: если $L$ зависит от $u$, а $u$ от $w$, то $\dfrac{\partial L}{\partial w}=\dfrac{\partial L}{\partial u}\cdot\dfrac{\partial u}{\partial w}$. На этом стоит весь [[backprop|backprop]]: глобальный [[gradient|градиент]] узла = [[lokalnyy-gradient|локальный градиент]] $\times$ градиент сверху. Если узел входит в выражение по нескольким путям, вклады путей **суммируются** — отсюда **+=** в **_backward**.`,
		formula: String.raw`\frac{\partial L}{\partial w}=\frac{\partial L}{\partial u}\,\frac{\partial u}{\partial w}`,
		related: ['lokalnyy-gradient', 'backprop', 'gradient']
	},
	'topologicheskaya-sortirovka': {
		id: 'topologicheskaya-sortirovka',
		term: 'Топологическая сортировка',
		short: String.raw`Порядок узлов: предки раньше потомков.`,
		body: String.raw`**Топологическая сортировка** ориентированного ациклического графа — линейный порядок вершин, в котором каждое ребро ведёт «вперёд». В autograd она нужна, чтобы запускать **_backward** узлов в правильном порядке: градиент узла должен быть **полностью накоплен** до того, как узел протолкнёт его в предков. Строят обходом в глубину (узел добавляют после всех его детей), а обратный проход идёт **reversed** — от потери к листьям.`,
		related: ['vychislitelnyy-graf', 'backward', 'micrograd-value']
	},
	'define-by-run': {
		id: 'define-by-run',
		term: 'Define-by-run',
		short: String.raw`Граф строится по ходу вычислений, а не заранее.`,
		body: String.raw`**Define-by-run** — стиль, при котором [[vychislitelnyy-graf|граф]] возникает **динамически**, по мере выполнения операций прямого прохода, и пересобирается каждую итерацию. Наш [[micrograd-value|Value]] делает именно так: каждое $+$ или $*$ создаёт новый узел и подвязывает предков. Это противоположность статическим графам (старый TensorFlow 1.x), где граф объявляют до запуска. Гибкость define-by-run — почему в PyTorch можно писать обычные **if** и циклы Python внутри модели.`,
		related: ['vychislitelnyy-graf', 'autograd', 'micrograd-value']
	}
};
