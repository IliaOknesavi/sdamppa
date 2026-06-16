import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 12. Базовые (dropout, batchnorm, weight-decay,
// regularizaciya, overfitting, train-eval, batch…) живут в glossary.ts.
export const day12Terms: Glossary = {
	'dropout-maska': {
		id: 'dropout-maska',
		term: 'Маска dropout (Бернулли)',
		short: String.raw`Случайный 0/1-вектор, занулящий активации.`,
		body: String.raw`На каждом шаге обучения [[dropout|Dropout]] тянет независимую **маску Бернулли**: каждый элемент равен $1$ (оставить нейрон) с вероятностью $1-p$ и $0$ (занулить) с вероятностью $p$. Активации умножаются на эту маску, поэтому на разных итерациях «работает» разный поднабор нейронов. Маска генерируется заново каждый forward на [[train-eval|train]] и не применяется на eval.`,
		formula: String.raw`m_i \sim \text{Bernoulli}(1-p),\quad \tilde a_i = m_i\,a_i`,
		related: ['dropout', 'inverted-dropout', 'train-eval']
	},
	'inverted-dropout': {
		id: 'inverted-dropout',
		term: 'Inverted dropout',
		short: String.raw`Масштаб 1/(1−p) на train, eval без изменений.`,
		body: String.raw`**Inverted dropout** — стандартная реализация [[dropout|dropout]] (так делает **nn.Dropout**): оставшиеся после [[dropout-maska|маски]] активации делят на $1-p$ прямо на [[train-eval|train]]. Тогда их *ожидание* совпадает с входом, и на eval можно вообще ничего не масштабировать — слой пропускает вход как есть. Альтернатива (масштаб на eval) исторична и в PyTorch не используется.`,
		formula: String.raw`\text{train: } \tilde a_i=\dfrac{m_i}{1-p}a_i;\quad \text{eval: } \tilde a_i=a_i`,
		related: ['dropout', 'dropout-maska', 'train-eval']
	},
	'batchnorm1d': {
		id: 'batchnorm1d',
		term: 'BatchNorm1d',
		short: String.raw`BatchNorm для векторных активаций (N, C).`,
		body: String.raw`**nn.BatchNorm1d(C)** нормирует [[batchnorm|BatchNorm]] для полносвязных слоёв: вход формы $(N, C)$ нормируется по оси [[batch|батча]] $N$ для каждого из $C$ признаков, затем масштабируется обучаемыми $\gamma,\beta$. На [[train-eval|train]] статистики берутся из батча и обновляют **running_mean/running_var**; на eval используются эти накопленные значения. Для картинок $(N,C,H,W)$ аналог — **BatchNorm2d**.`,
		formula: String.raw`\hat x=\dfrac{x-\mu_B}{\sqrt{\sigma_B^2+\varepsilon}},\; y=\gamma\hat x+\beta`,
		related: ['batchnorm', 'train-eval', 'batch']
	},
	'l2-shtraf': {
		id: 'l2-shtraf',
		term: 'L2-штраф',
		short: String.raw`Слагаемое λ‖w‖² против больших весов.`,
		body: String.raw`**$L_2$-штраф** добавляет к потере $\lambda\|w\|^2$ — сумму квадратов весов. Это эквивалентно добавлению $2\lambda w$ к [[gradient|градиенту]], то есть веса на каждом шаге слегка «усыхают» к нулю. Меньшие веса → более гладкая модель → меньше [[overfitting|переобучения]]. В PyTorch включается параметром [[weight-decay|weight_decay]] у [[optimizer|оптимизатора]], а не руками в loss.`,
		formula: String.raw`L_{\text{reg}} = L + \lambda\|w\|^2`,
		related: ['weight-decay', 'optimizer', 'regularizaciya']
	},
	'augmentaciya': {
		id: 'augmentaciya',
		term: 'Аугментация данных',
		short: String.raw`Случайные преобразования входа без смены метки.`,
		body: String.raw`**Аугментация** случайно преобразует обучающий пример, сохраняя его метку: отражения, повороты, кропы, сдвиг яркости (для картинок). Каждую [[epoch|эпоху]] сеть видит чуть иной вариант, поэтому труднее запомнить конкретные пиксели и легче выучить инвариантные признаки — сильная [[regularizaciya|регуляризация]]. Применяют **только к train**; валидацию и тест прогоняют на чистых данных.`,
		related: ['regularizaciya', 'overfitting', 'dataset']
	},
	'poryadok-sloev': {
		id: 'poryadok-sloev',
		term: 'Порядок слоёв в блоке',
		short: String.raw`Linear → BatchNorm → ReLU → Dropout.`,
		body: String.raw`Надёжный дефолт для полносвязного блока: **Linear → [[batchnorm1d|BatchNorm]] → ReLU → [[dropout|Dropout]]**. [[batchnorm1d|BatchNorm]] стоит до активации (нормируем её вход), **bias** у Linear при этом избыточен (**bias=False**), а [[dropout|Dropout]] — последним, чтобы не искажать статистики, которые считает BN. Не догма, но безопасная отправная точка.`,
		related: ['batchnorm1d', 'dropout', 'regularizaciya']
	}
};
