import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 8. Базовые (loss-fn, mse, cross-entropy, softmax,
// optimizer, sgd, adam, learning-rate, zero-grad…) живут в glossary.ts и
// перекрывают совпадающие id.
export const day08Terms: Glossary = {
	'mse-loss': {
		id: 'mse-loss',
		term: 'nn.MSELoss',
		short: String.raw`Модуль среднеквадратичной потери для регрессии.`,
		formula: String.raw`\mathcal{L}=\tfrac1N\sum_i (\hat y_i-y_i)^2`,
		body: String.raw`**nn.MSELoss()** — готовый модуль [[mse|MSE]] для регрессии: на вход подают предсказание и цель **одинаковой формы**, на выходе — скаляр (по умолчанию усреднённый, **reduction='mean'**). Именно по этому скаляру вызывают [[backward|.backward()]]. Сравни с функциональной формой **F.mse_loss(pred, target)** — это то же самое.`,
		related: ['mse', 'loss-fn', 'cross-entropy-logits']
	},
	'cross-entropy-logits': {
		id: 'cross-entropy-logits',
		term: 'nn.CrossEntropyLoss (логиты)',
		short: String.raw`Кросс-энтропия, принимающая сырые логиты и целые метки.`,
		formula: String.raw`\mathcal{L}=-\log \dfrac{e^{z_{y}}}{\sum_j e^{z_j}}`,
		body: String.raw`**nn.CrossEntropyLoss()** = [[softmax|softmax]] + логарифм + NLL в одном модуле. На вход — **сырые логиты** формы $(N,C)$ и целые [[cross-entropy|метки]] формы $(N,)$ со значениями $0..C{-}1$ (НЕ one-hot, НЕ вероятности). Softmax считается **внутри** ради численной устойчивости — не добавляй его в модель перед потерей, иначе посчитаешь его дважды.`,
		related: ['cross-entropy', 'softmax', 'mse-loss']
	},
	'optim-sgd': {
		id: 'optim-sgd',
		term: 'torch.optim.SGD',
		short: String.raw`Простой шаг по минус-градиенту (+ momentum).`,
		formula: String.raw`v \leftarrow \mu v + g,\quad w \leftarrow w - \eta\,v`,
		body: String.raw`**optim.SGD(model.parameters(), lr=0.1, momentum=0.9)** делает «честный» шаг [[gradient-spusk|спуска]]: один общий [[learning-rate|lr]] на все веса. **momentum** копит скорость и быстрее проходит овраги. Прост, надёжен, хорошо обобщает — но требует подбора lr вручную. По сравнению с [[optim-adam|Adam]] обычно сходится медленнее «из коробки».`,
		related: ['sgd', 'optim-adam', 'learning-rate', 'shag-optimizatora']
	},
	'optim-adam': {
		id: 'optim-adam',
		term: 'torch.optim.Adam',
		short: String.raw`Адаптивный шаг — свой эффективный lr на каждый вес.`,
		body: String.raw`**optim.Adam(model.parameters(), lr=1e-3)** хранит скользящие средние [[gradient|градиента]] и его квадрата и масштабирует шаг по каждому весу отдельно. Поэтому почти не требует тонкой настройки [[learning-rate|lr]] и сходится быстро — дефолтный выбор для старта. Цена — больше памяти (два момента на параметр) и иногда чуть худшее обобщение, чем у тщательно настроенного [[optim-sgd|SGD]].`,
		related: ['adam', 'optim-sgd', 'learning-rate', 'shag-optimizatora']
	},
	'shag-optimizatora': {
		id: 'shag-optimizatora',
		term: 'Шаг оптимизатора',
		short: String.raw`Канонический порядок: zero_grad → forward → loss → backward → step.`,
		body: String.raw`Один шаг обучения всегда идёт в одном порядке: **optimizer.zero_grad()** (обнулить старые [[gradient|градиенты]]) → **forward** (**pred = model(x)**) → **loss = criterion(pred, y)** → **loss.backward()** (посчитать $\partial L/\partial w$) → **optimizer.step()** (обновить веса). Пропустишь [[zero-grad|zero_grad]] — градиенты батчей сложатся; переставишь backward и step — обновишь по старым градиентам.`,
		related: ['zero-grad', 'backward', 'optimizer', 'optim-sgd', 'optim-adam']
	}
};
