import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 18. Базовые (state-dict, optimizer, device,
// dropout, batchnorm…) живут в glossary.ts и перекрывают совпадающие id.
export const day18Terms: Glossary = {
	'state-dict-save': {
		id: 'state-dict-save',
		term: 'Сохранение state_dict',
		short: String.raw`save(model.state_dict()) → load_state_dict.`,
		body: String.raw`Канонический способ сохранить модель: **torch.save(model.state_dict(), path)** кладёт на диск только словарь весов, без кода класса. Восстановление в два шага — создать свежий экземпляр той же архитектуры и влить веса: **model.load_state_dict(torch.load(path))**. В отличие от **torch.save(model, path)** не привязано к имени файла/класса, поэтому переносимо между версиями кода.`,
		related: ['state-dict', 'nn-module', 'checkpoint-slovar']
	},
	'checkpoint-slovar': {
		id: 'checkpoint-slovar',
		term: 'Чекпойнт',
		short: String.raw`Словарь состояния обучения для возобновления.`,
		body: String.raw`**Чекпойнт** — обычный dict со всем, что нужно, чтобы продолжить обучение: **model.state_dict()**, **optimizer.state_dict()**, номер [[epoch|эпохи]] и последняя [[loss-fn|потеря]]. Сохраняется одним **torch.save(ckpt, path)**. Сюда же часто кладут состояние [[scheduler|scheduler]] и лучший скор. Отличается от чистого [[state-dict-save|state_dict]] тем, что хранит состояние шага оптимизатора — без него рестарт неплавный.`,
		related: ['state-dict-save', 'optimizer', 'vozobnovlenie-obucheniya', 'epoch']
	},
	'vozobnovlenie-obucheniya': {
		id: 'vozobnovlenie-obucheniya',
		term: 'Возобновление обучения',
		short: String.raw`Продолжить с сохранённого чекпойнта.`,
		body: String.raw`**Возобновление** — зеркальная распаковка [[checkpoint-slovar|чекпойнта]]: создаёшь модель и [[optimizer|оптимизатор]], грузишь оба **state_dict**, берёшь **epoch + 1** как стартовую эпоху. Состояние оптимизатора возвращает накопленные моменты (Adam) или momentum (SGD), поэтому обучение едет дальше без рывка. Нужно, когда процесс прервался (упал, превышено время, ручная остановка).`,
		related: ['checkpoint-slovar', 'optimizer', 'epoch']
	},
	'map-location': {
		id: 'map-location',
		term: 'map_location',
		short: String.raw`Куда класть тензоры при torch.load.`,
		body: String.raw`Файл помнит [[device|устройство]], на котором лежали тензоры при сохранении. **map_location** переадресует их при чтении: **torch.load(path, map_location="cpu")** грузит на CPU даже чекпойнт с GPU, **map_location=device** — на текущее устройство. Без него загрузка GPU-чекпойнта на машине без CUDA падает. Канон: грузить на cpu/свой device, потом двигать модель через **model.to(device)**.`,
		related: ['device', 'cuda', 'checkpoint-slovar']
	},
	'fiksaciya-seed': {
		id: 'fiksaciya-seed',
		term: 'Фиксация seed',
		short: String.raw`Засеять random, numpy и torch.`,
		body: String.raw`**Seed** — начальная точка генератора псевдослучайных чисел: вернул его в ту же точку — получил ту же последовательность. Генераторов три независимых, и засеять надо все: **random.seed(s)** (stdlib), **np.random.seed(s)** (numpy), **torch.manual_seed(s)** и **torch.cuda.manual_seed_all(s)** (torch CPU/GPU). Пропустишь один — воспроизводимость «протечёт». Зовут *до* любой случайности (инициализации весов, [[dataloader|перемешивания]]).`,
		related: ['determinizm', 'dataloader']
	},
	determinizm: {
		id: 'determinizm',
		term: 'Детерминизм',
		short: String.raw`Один и тот же результат при каждом запуске.`,
		body: String.raw`**Детерминизм** — два запуска с одинаковым [[fiksaciya-seed|seed]] дают побитово одинаковый результат. Одного seed мало: часть CUDA-ядер недетерминированна ради скорости, поэтому добавляют **torch.use_deterministic_algorithms(True)**, **cudnn.deterministic=True**, **cudnn.benchmark=False**. Это слегка замедляет обучение, поэтому детерминизм включают для отладки и публикации результатов, а ради скорости отключают.`,
		related: ['fiksaciya-seed', 'cuda']
	}
};
