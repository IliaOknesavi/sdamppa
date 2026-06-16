import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 11. Базовые (overfitting, train-eval, dropout,
// batchnorm, state-dict, epoch, learning-rate…) живут в glossary.ts.
export const day11Terms: Glossary = {
	'train-val-test': {
		id: 'train-val-test',
		term: 'Train / val / test',
		short: String.raw`Три непересекающиеся выборки данных.`,
		body: String.raw`Данные делят на три части. **train** — на ней идёт [[gradient-spusk|обучение]]. **val** (валидация) — на ней подбирают гиперпараметры, момент [[rannyaya-ostanovka|остановки]], архитектуру; модель на ней не учится, но ты под неё подстраиваешься. **test** — трогают **один раз** в самом конце ради честной оценки. Типичные доли $70/15/15$ или $80/10/10$. Примеры из val/test не должны попадать в train ([[utechka-dannyh|утечка]]).`,
		related: ['random-split', 'overfitting', 'utechka-dannyh']
	},
	'random-split': {
		id: 'random-split',
		term: 'random_split',
		short: String.raw`Случайно режет Dataset на части.`,
		body: String.raw`**torch.utils.data.random_split(dataset, [n_train, n_val])** случайно разбивает [[dataset|Dataset]] на непересекающиеся подвыборки заданных размеров. Для воспроизводимости передают **generator=torch.Generator().manual_seed(0)**. Поверх каждой части делают свой [[dataloader|DataLoader]]. Это стандартный способ получить [[train-val-test|train/val]] из одного датасета.`,
		related: ['train-val-test', 'dataset', 'dataloader']
	},
	'rezhim-eval-vs-no-grad': {
		id: 'rezhim-eval-vs-no-grad',
		term: 'eval() vs no_grad()',
		short: String.raw`Разные вещи — нужны обе на валидации.`,
		body: String.raw`Частая путаница. **model.eval()** меняет **поведение слоёв**: [[dropout|Dropout]] выключается, [[batchnorm|BatchNorm]] переходит на накопленную статистику. **with torch.no_grad()** отключает [[autograd|autograd]]: не строится [[vychislitelnyy-graf|граф]], не хранятся активации для [[backward|backward]] — экономия памяти и времени. Они независимы: eval не выключает градиенты, no_grad не трогает слои. На валидации применяют **оба**.`,
		related: ['train-eval', 'no-grad-validaciya', 'dropout', 'batchnorm']
	},
	'no-grad-validaciya': {
		id: 'no-grad-validaciya',
		term: 'torch.no_grad()',
		short: String.raw`Отключить граф на инференсе.`,
		body: String.raw`**with torch.no_grad():** (или декоратор **@torch.no_grad()**) говорит [[autograd|autograd]] не записывать историю операций. На валидации/инференсе [[backward|backward]] не делают, поэтому [[vychislitelnyy-graf|граф]] и сохранённые активации — лишний расход. Эффект: меньше **памяти** (часто можно увеличить батч) и чуть выше **скорость**. Не путать с [[rezhim-eval-vs-no-grad|eval()]] — тот переключает слои.`,
		related: ['rezhim-eval-vs-no-grad', 'autograd', 'vychislitelnyy-graf']
	},
	'accuracy-precision-recall': {
		id: 'accuracy-precision-recall',
		term: 'Accuracy / precision / recall',
		short: String.raw`Метрики качества классификации.`,
		formula: String.raw`\text{precision}=\dfrac{TP}{TP+FP},\quad \text{recall}=\dfrac{TP}{TP+FN}`,
		body: String.raw`**Accuracy** — доля верных ответов; обманчива при дисбалансе классов. **Precision** — из названных положительными какая часть верна (цена ложной тревоги, FP). **Recall** — из всех настоящих положительных какую часть нашли (цена пропуска, FN). Их компромисс сводят в $F_1$ — гармоническое среднее. Считаются из таблицы ошибок (TP, FP, FN) на [[train-val-test|val/test]].`,
		related: ['train-val-test', 'loss-fn']
	},
	'krivye-obucheniya': {
		id: 'krivye-obucheniya',
		term: 'Кривые обучения',
		short: String.raw`Графики train-loss и val-loss по эпохам.`,
		body: String.raw`**Кривые обучения** — train-loss и val-loss как функции [[epoch|эпохи]]. Диагностика: обе падают и рядом — норма; train падает, а val развернулся вверх — [[overfitting|переобучение]]; обе высокие и стоят — недообучение. Минимум **val**-кривой указывает лучшую точку — туда целится [[rannyaya-ostanovka|ранняя остановка]].`,
		related: ['overfitting', 'rannyaya-ostanovka', 'epoch']
	},
	'rannyaya-ostanovka': {
		id: 'rannyaya-ostanovka',
		term: 'Ранняя остановка',
		short: String.raw`Стоп по val-loss до переобучения.`,
		body: String.raw`**Early stopping** следит за val-loss: при улучшении запоминает лучшее значение и веса ([[state-dict|state_dict]]), сбрасывая счётчик; если улучшения нет **patience** эпох подряд — обучение прерывают и возвращают лучший чекпойнт. Берёт модель из минимума [[krivye-obucheniya|val-кривой]], ещё до разворота — форма [[regularizaciya|регуляризации]] против [[overfitting|переобучения]]. Ориентир — val-loss, а не train.`,
		related: ['krivye-obucheniya', 'overfitting', 'state-dict', 'regularizaciya']
	},
	'utechka-dannyh': {
		id: 'utechka-dannyh',
		term: 'Утечка данных',
		short: String.raw`Информация из val/test просочилась в train.`,
		body: String.raw`**Утечка данных (data leakage)** — когда модель прямо или косвенно видит на обучении то, что должно оставаться скрытым: дубликаты примеров в train и [[train-val-test|test]], нормировка по статистикам всей выборки до разбиения, признак, коррелирующий с целью «из будущего». Симптом — подозрительно высокое качество на test, рушащееся в проде. Лечится строгим разделением выборок **до** любых преобразований.`,
		related: ['train-val-test', 'overfitting']
	}
};
