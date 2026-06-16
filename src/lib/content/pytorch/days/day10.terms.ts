import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 10. Базовые (dataset, dataloader, batch, epoch…)
// живут в glossary.ts и перекрывают совпадающие id.
export const day10Terms: Glossary = {
	'custom-dataset': {
		id: 'custom-dataset',
		term: 'Свой Dataset',
		short: String.raw`Класс-наследник Dataset с __len__ и __getitem__.`,
		body: String.raw`**Собственный Dataset** — наследник **torch.utils.data.Dataset**, в котором ты реализуешь два метода: **__len__** (сколько примеров) и [[getitem|__getitem__]] ($i$-й пример). Нужен, когда данные не лежат в памяти готовыми тензорами: читать картинку с диска, парсить строку, применять трансформы — всё это код внутри [[getitem|__getitem__]]. Подключается к [[dataloader|DataLoader]] так же, как любой [[dataset|Dataset]].`,
		related: ['dataset', 'getitem', 'dataloader', 'tensor-dataset']
	},
	getitem: {
		id: 'getitem',
		term: '__getitem__(i)',
		short: String.raw`Вернуть один пример по индексу.`,
		body: String.raw`**__getitem__(i)** — метод [[dataset|Dataset]], возвращающий **один** пример с индексом $i$, обычно пару $(x_i, y_i)$ из [[tenzor|тензоров]]. Это НЕ батч: форма $x$ — без оси батча (например, $(4,)$, а не $(N,4)$). Срезку в [[batch|батчи]] делает [[dataloader|DataLoader]] функцией **collate**. Вызывается неявно через **ds[i]**.`,
		related: ['dataset', 'custom-dataset', 'batch', 'dataloader']
	},
	'batch-size': {
		id: 'batch-size',
		term: 'batch_size',
		short: String.raw`Сколько примеров в одном батче.`,
		body: String.raw`**batch_size** — параметр [[dataloader|DataLoader]]: сколько примеров склеить в один [[batch|батч]]. Добавляет первую ось тензора размера $N$. Больше — точнее оценка [[gradient|градиента]] и эффективнее GPU, но больше памяти; меньше — шумнее градиент (иногда полезно для обобщения). Типичные значения — $32$, $64$, $128$.`,
		related: ['batch', 'dataloader', 'gradient']
	},
	'shuffle-epoch': {
		id: 'shuffle-epoch',
		term: 'shuffle (перемешивание)',
		short: String.raw`Новый случайный порядок примеров каждую эпоху.`,
		body: String.raw`**shuffle=True** в [[dataloader|DataLoader]] перемешивает порядок примеров **заново каждую [[epoch|эпоху]]**. Это делает [[batch|батчи]] разнородными (важно, если данные отсортированы по классу) и снижает корреляцию соседних шагов [[sgd|SGD]]. Ставят только для трейна; на валидации/тесте порядок не влияет на метрику, поэтому **shuffle=False**.`,
		related: ['dataloader', 'epoch', 'batch', 'sgd']
	},
	'tensor-dataset': {
		id: 'tensor-dataset',
		term: 'TensorDataset',
		short: String.raw`Готовый Dataset поверх тензоров в памяти.`,
		body: String.raw`**TensorDataset(X, y)** — готовый [[dataset|Dataset]], оборачивающий уже имеющиеся [[tenzor|тензоры]]. Сам реализует [[getitem|__getitem__]] как срез по первой оси и **__len__**. Удобен, когда данные помещаются в память и не требуют обработки — не надо писать [[custom-dataset|свой класс]]. Подаётся в [[dataloader|DataLoader]] напрямую.`,
		related: ['dataset', 'custom-dataset', 'dataloader', 'tenzor']
	},
	'num-workers': {
		id: 'num-workers',
		term: 'num_workers',
		short: String.raw`Число процессов параллельной загрузки данных.`,
		body: String.raw`**num_workers** — сколько отдельных процессов [[dataloader|DataLoader]] запускает, чтобы готовить [[batch|батчи]] параллельно, пока GPU считает предыдущий. **0** — загрузка в основном процессе. Увеличение ускоряет, когда [[getitem|__getitem__]] тяжёлый (чтение с диска, декодирование, трансформы); при лёгком срезе из памяти выгоды нет, а лишние процессы добавляют накладные расходы.`,
		related: ['dataloader', 'getitem', 'batch']
	}
};
