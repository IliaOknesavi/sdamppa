import type { Glossary } from '$lib/types';

// Термины дня 13. Базовые (scheduler, learning-rate, gradient, adam…)
// живут в glossary.ts и перекрывают совпадающие id.
export const day13Terms: Glossary = {
	'vanishing-exploding': {
		id: 'vanishing-exploding',
		term: 'Затухающие / взрывающиеся градиенты',
		short: String.raw`Сигнал экспоненциально гаснет или растёт по глубине.`,
		body: String.raw`В глубокой сети активации и [[gradient|градиенты]] проходят через цепочку умножений на матрицы весов. Если каждый слой множит дисперсию на $k$, то через $L$ слоёв коэффициент $k^L$: при $k<1$ сигнал **затухает** (нижние слои не учатся), при $k>1$ — **взрывается** (NaN). Лечится подбором масштаба весов ([[xavier-init|Xavier]]/[[he-init|He]]), нормализацией ([[batchnorm|BatchNorm]]) и [[grad-clipping|клиппингом]].`,
		related: ['gradient', 'xavier-init', 'he-init', 'grad-clipping']
	},
	'xavier-init': {
		id: 'xavier-init',
		term: 'Xavier / Glorot init',
		short: String.raw`Масштаб весов под tanh/sigmoid: Var = 2/(n_in+n_out).`,
		formula: String.raw`\mathrm{Var}(W)=\dfrac{2}{n_\text{in}+n_\text{out}}`,
		body: String.raw`**Xavier (Glorot)** масштабирует начальные веса так, чтобы дисперсия сигнала сохранялась и на прямом, и на обратном проходе — учитывает и число входов, и выходов. Подходит для симметричных активаций (tanh, sigmoid). В PyTorch — **nn.init.xavier_uniform_** / **xavier_normal_**. Для ReLU берут [[he-init|He]].`,
		related: ['vanishing-exploding', 'he-init', 'nn-init']
	},
	'he-init': {
		id: 'he-init',
		term: 'He / Kaiming init',
		short: String.raw`Масштаб весов под ReLU: Var = 2/n_in.`,
		formula: String.raw`\mathrm{Var}(W)=\dfrac{2}{n_\text{in}}`,
		body: String.raw`**He (Kaiming)** — инициализация под ReLU и её родственников: дисперсия весов $2/n_\text{in}$. Лишняя двойка компенсирует то, что ReLU зануляет примерно половину активаций, иначе сигнал затухает. В PyTorch — **nn.init.kaiming_normal_(w, nonlinearity='relu')**. Дефолт для **nn.Linear**/**nn.Conv2d** — вариант Kaiming.`,
		related: ['vanishing-exploding', 'xavier-init', 'nn-init']
	},
	'nn-init': {
		id: 'nn-init',
		term: 'torch.nn.init',
		short: String.raw`Функции явной инициализации весов на месте.`,
		body: String.raw`**torch.nn.init** — набор функций, заполняющих тензор весов нужным распределением **in-place** (имена с подчёркиванием на конце): **kaiming_normal_**, **xavier_uniform_**, **zeros_**, **ones_**, **normal_**. Применяют обычно через **model.apply(fn)**, где **fn** проверяет тип слоя (**isinstance(m, nn.Linear)**) и инициализирует **m.weight** и **m.bias**.`,
		related: ['xavier-init', 'he-init', 'nn-module', 'parametr']
	},
	steplr: {
		id: 'steplr',
		term: 'StepLR',
		short: String.raw`Ступенчатое затухание lr раз в N эпох.`,
		body: String.raw`**StepLR(optimizer, step_size, gamma)** — [[scheduler|расписание]], которое каждые **step_size** [[epoch|эпох]] умножает [[learning-rate|lr]] на **gamma** (например, $0.1$). Простое ступенчатое затухание: крупный lr в начале, затем резкие понижения. Альтернатива с гладким спадом — [[cosine-annealing|CosineAnnealingLR]].`,
		related: ['scheduler', 'learning-rate', 'cosine-annealing', 'epoch']
	},
	'cosine-annealing': {
		id: 'cosine-annealing',
		term: 'CosineAnnealingLR',
		short: String.raw`Плавный спад lr по косинусу за T_max эпох.`,
		formula: String.raw`\eta_t=\eta_\min+\tfrac12(\eta_\max-\eta_\min)\bigl(1+\cos\tfrac{\pi t}{T_\max}\bigr)`,
		body: String.raw`**CosineAnnealingLR(optimizer, T_max)** плавно ведёт [[learning-rate|lr]] от стартового к **eta_min** по косинусу за **T_max** [[epoch|эпох]] — без резких ступеней [[steplr|StepLR]]. Гладкое затухание часто даёт чуть лучшую финальную точность. Нередко комбинируют с warmup в начале.`,
		related: ['scheduler', 'learning-rate', 'steplr']
	},
	'grad-clipping': {
		id: 'grad-clipping',
		term: 'Клиппинг градиентов',
		short: String.raw`Ограничение нормы градиента сверху.`,
		formula: String.raw`g \leftarrow g\cdot\min\!\bigl(1,\ \tfrac{\texttt{max\_norm}}{\lVert g\rVert}\bigr)`,
		body: String.raw`**clip_grad_norm_(params, max_norm)** считает **общую** L2-норму всех [[gradient|градиентов]] и, если она больше порога, домножает их на один коэффициент $<1$ — длина обрезается, **направление сохраняется**. Защищает от [[vanishing-exploding|взрывов градиента]] (RNN, трансформеры). Вызывают между [[backward|backward]] и [[optimizer|step]].`,
		related: ['gradient', 'vanishing-exploding', 'backward', 'optimizer']
	}
};
