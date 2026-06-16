import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 7 (nn.Module и слои). Базовые (nn-module,
// parametr, forward, broadcasting…) живут в glossary.ts и перекрывают
// совпадающие id. Конвенция: все строки — String.raw, идентификаторы — **жирным**.
export const day07Terms: Glossary = {
	'nn-linear': {
		id: 'nn-linear',
		term: 'nn.Linear',
		short: String.raw`Полносвязный (аффинный) слой y = xW^T + b.`,
		formula: String.raw`y = xW^\top + b,\quad W\in\mathbb{R}^{\text{out}\times\text{in}}`,
		body: String.raw`**nn.Linear(in_features, out_features)** — полносвязный слой. Хранит два [[parametr|параметра]]: **weight** формы $(\text{out},\text{in})$ и **bias** формы $(\text{out},)$. Принимает [[batch|батч]] $(N,\text{in})$ и отдаёт $(N,\text{out})$, считая $y = xW^\top + b$. Число обучаемых чисел — $(\text{in}+1)\cdot\text{out}$. Базовый кирпич [[mlp|MLP]].`,
		related: ['nn-module', 'parametr', 'mlp', 'podschet-parametrov']
	},
	'aktivaciya-relu': {
		id: 'aktivaciya-relu',
		term: 'Активация (ReLU)',
		short: String.raw`Поэлементная нелинейность между слоями.`,
		formula: String.raw`\mathrm{ReLU}(x)=\max(0,x)`,
		body: String.raw`**Активация** — поэлементная нелинейная функция между [[nn-linear|линейными]] слоями; без неё стопка Linear схлопывается в одно линейное преобразование. **nn.ReLU** $=\max(0,x)$ — дефолт для скрытых слоёв. Альтернативы: **nn.Sigmoid** (давит в $(0,1)$), **nn.Tanh** (в $(-1,1)$). Активация не имеет [[parametr|параметров]] и не меняет [[shape-forma|форму]].`,
		related: ['nn-linear', 'mlp', 'forward']
	},
	'nn-sequential': {
		id: 'nn-sequential',
		term: 'nn.Sequential',
		short: String.raw`Контейнер: прогоняет вход через слои по порядку.`,
		body: String.raw`**nn.Sequential(layer1, layer2, …)** — готовый [[nn-module|модуль]], чей [[forward|forward]] просто пропускает вход через перечисленные слои один за другим. Удобен, когда сеть линейна без ветвлений: вместо своего класса пишешь **nn.Sequential(nn.Linear(3,8), nn.ReLU(), nn.Linear(8,2))**. Для разветвлённых архитектур нужен полноценный наследник nn.Module.`,
		related: ['nn-module', 'mlp', 'nn-linear', 'forward']
	},
	'podschet-parametrov': {
		id: 'podschet-parametrov',
		term: 'Подсчёт параметров',
		short: String.raw`Сколько обучаемых чисел в слое и сети.`,
		formula: String.raw`\#\text{params}_{\text{Linear}} = (\text{in}+1)\cdot\text{out}`,
		body: String.raw`Число обучаемых [[parametr|параметров]] [[nn-linear|Linear(in,out)]] — $\text{in}\cdot\text{out}$ в **weight** плюс $\text{out}$ в **bias**, итого $(\text{in}+1)\cdot\text{out}$. Для сети — сумма по слоям; [[aktivaciya-relu|активации]] и [[pooling|pooling]] не добавляют. В коде: **sum(p.numel() for p in model.parameters())**. Нужно, чтобы оценить размер модели и поймать ошибки формы.`,
		related: ['nn-linear', 'parametr', 'mlp']
	},
	mlp: {
		id: 'mlp',
		term: 'MLP (многослойный перцептрон)',
		short: String.raw`Стопка Linear + активации.`,
		body: String.raw`**MLP** (multi-layer perceptron) — сеть из чередующихся [[nn-linear|Linear]] и [[aktivaciya-relu|активаций]]: $x \to \text{Linear} \to \text{ReLU} \to \text{Linear} \to \dots$. Самая простая архитектура для табличных данных и базовый строительный блок. Собирается как наследник [[nn-module|nn.Module]] (объявляешь слои в **__init__**, прогоняешь в [[forward|forward]]) либо короче через [[nn-sequential|nn.Sequential]].`,
		related: ['nn-linear', 'aktivaciya-relu', 'nn-module', 'nn-sequential']
	}
};
