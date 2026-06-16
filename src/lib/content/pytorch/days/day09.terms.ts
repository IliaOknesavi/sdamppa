import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 9. Базовые (epoch, batch, optimizer, backward…)
// живут в glossary.ts и перекрывают совпадающие id.
export const day09Terms: Glossary = {
	'training-loop': {
		id: 'training-loop',
		term: 'Тренировочный цикл',
		short: String.raw`Два вложенных цикла: эпохи и батчи.`,
		body: String.raw`**Тренировочный цикл** — каркас обучения: внешний цикл по [[epoch|эпохам]], внутренний по [[batch|батчам]]. На каждом батче выполняется пятёрка шагов в строгом порядке: [[zero-grad|zero_grad]] → [[forward|forward]] → [[loss-fn|loss]] → [[backward|backward]] → [[optimizer|step]]. Этот скелет одинаков для любой модели — меняются лишь слои, потеря и данные.`,
		related: ['epoch', 'batch', 'zero-grad', 'optimizer']
	},
	'accuracy-metrika': {
		id: 'accuracy-metrika',
		term: 'Accuracy (точность)',
		short: String.raw`Доля верно предсказанных примеров.`,
		formula: String.raw`\text{acc}=\tfrac1N\sum_i \mathbb{1}[\hat y_i = y_i]`,
		body: String.raw`**Accuracy** — доля примеров, где предсказанный класс совпал с истинным. Считается из логитов $(N,C)$: предсказание — [[softmax|argmax]] по оси классов, дальше сравнение с метками и усреднение. В PyTorch — **(out.argmax(1) == yb).float().mean()**. В отличие от [[loss-fn|потери]], это метрика *для человека*: по ней не оптимизируют, её мониторят.`,
		related: ['loss-fn', 'softmax', 'item-logirovanie']
	},
	'item-logirovanie': {
		id: 'item-logirovanie',
		term: 'Логирование через .item()',
		short: String.raw`Копить числа, а не тензоры с графом.`,
		body: String.raw`Чтобы накопить потерю за эпоху, складывают **числа**, а не тензоры: **total += loss.item()**. Метод [[item-skalyar|.item()]] достаёт Python-float из тензора-скаляра, *отрывая* его от [[vychislitelnyy-graf|вычислительного графа]]. Если копить сами тензоры (**total += loss**), все графы батчей останутся в памяти — утечка и OOM. То же правило для счётчика верных: копи **int**, не тензоры.`,
		related: ['item-skalyar', 'vychislitelnyy-graf', 'accuracy-metrika']
	},
	'perenos-na-device': {
		id: 'perenos-na-device',
		term: 'Перенос батча на device',
		short: String.raw`xb, yb = xb.to(device), yb.to(device)`,
		body: String.raw`Модель и данные обязаны быть на одном [[device|устройстве]]. Модель переносят один раз (**model.to(device)**), а батчи приходят с CPU из [[dataloader|DataLoader]], поэтому их переносят *внутри цикла*: **xb, yb = xb.to(device), yb.to(device)**. Забудешь — **RuntimeError: expected all tensors on the same device**. Канон: **device = 'cuda' if torch.cuda.is_available() else 'cpu'**.`,
		related: ['device', 'cuda', 'dataloader', 'training-loop']
	},
	'eval-no-grad': {
		id: 'eval-no-grad',
		term: 'Валидация: eval + no_grad',
		short: String.raw`model.eval() и torch.no_grad() на оценке.`,
		body: String.raw`После обучения качество меряют в [[train-eval|режиме eval]] и под **torch.no_grad()**. **model.eval()** переключает [[dropout|Dropout]]/[[batchnorm|BatchNorm]] в инференс-поведение, **torch.no_grad()** отключает [[autograd|построение графа]] — оценка идёт быстрее и не ест память на градиенты. Забыл eval — метрика искажена; забыл no_grad — зря строишь граф.`,
		related: ['train-eval', 'autograd', 'dropout', 'batchnorm']
	}
};
