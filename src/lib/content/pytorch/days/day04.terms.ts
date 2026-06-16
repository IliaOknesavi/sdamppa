import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 4 (autograd). Базовые (autograd, backward,
// requires-grad, vychislitelnyy-graf, zero-grad, gradient…) живут в glossary.ts
// и перекрывают совпадающие id.
export const day04Terms: Glossary = {
	'grad-fn': {
		id: 'grad-fn',
		term: 'grad_fn',
		short: String.raw`Узел графа: операция, породившая тензор.`,
		body: String.raw`**grad_fn** — ссылка у тензора на операцию, которая его создала (**PowBackward**, **AddBackward**, **MulBackward**…). Это «обратная функция» узла [[vychislitelnyy-graf|графа]]: при [[backward|backward()]] PyTorch идёт по цепочке **grad_fn** назад и применяет правило цепочки. У [[leaf-tensor|листьев]] (тензоров, созданных тобой) **grad_fn = None** — у них истории нет.`,
		related: ['vychislitelnyy-graf', 'backward', 'leaf-tensor']
	},
	'leaf-tensor': {
		id: 'leaf-tensor',
		term: 'Лист графа (leaf tensor)',
		short: String.raw`Тензор без истории — у него копится .grad.`,
		body: String.raw`**Лист** — [[tenzor|тензор]], который ты создал напрямую, а не получил операцией: у него [[grad-fn|grad_fn]] = None и **is_leaf = True**. Именно в листья с [[requires-grad|requires_grad=True]] [[backward|backward()]] кладёт **.grad** — это [[parametr|параметры]] модели. У промежуточных (нелистовых) тензоров **.grad** по умолчанию не сохраняется.`,
		related: ['grad-fn', 'requires-grad', 'parametr', 'tenzor']
	},
	'chislennaya-proizvodnaya': {
		id: 'chislennaya-proizvodnaya',
		term: 'Численная производная',
		short: String.raw`Оценка градиента конечной разностью.`,
		formula: String.raw`f'(x) \approx \frac{f(x+h)-f(x-h)}{2h}`,
		body: String.raw`**Численная производная** оценивает $f'(x)$, чуть сдвигая аргумент на маленькое $h$ и смотря на изменение выхода. Не требует знания формулы, но дорогая (минимум две прогонки на каждый вес) и неточная из-за ошибок округления. [[autograd|Autograd]] вместо неё считает производную *аналитически* по [[vychislitelnyy-graf|графу]] — точно и за один обратный проход. Численный градиент используют лишь для проверки (gradient check).`,
		related: ['gradient', 'autograd', 'backward']
	},
	'nakoplenie-gradientov': {
		id: 'nakoplenie-gradientov',
		term: 'Накопление градиентов',
		short: String.raw`backward() прибавляет в .grad, а не перезаписывает.`,
		body: String.raw`[[backward|.backward()]] **прибавляет** посчитанный градиент к тому, что уже лежит в **.grad**, а не заменяет его. Поэтому без [[zero-grad|zero_grad()]] градиенты подряд идущих итераций сложатся и шаг поедет неверно. Это поведение специально полезно: можно собрать градиент с нескольких мелких [[batch|батчей]] и сделать один шаг — эмуляция большого батча. Но в обычном цикле перед каждым [[backward|backward()]] обязателен сброс.`,
		related: ['backward', 'zero-grad', 'gradient', 'batch']
	},
	'no-grad': {
		id: 'no-grad',
		term: 'torch.no_grad()',
		short: String.raw`Блок без построения графа — для инференса.`,
		body: String.raw`**with torch.no_grad():** — контекст, внутри которого PyTorch **не строит** [[vychislitelnyy-graf|граф]] и не пишет [[grad-fn|grad_fn]]. Все тензоры внутри получаются с **requires_grad=False**. Используют на валидации и предсказании: экономит память и ускоряет, ведь градиенты там не нужны. В отличие от [[detach-tensor|.detach()]], действует на **весь блок** кода, а не на один тензор.`,
		related: ['vychislitelnyy-graf', 'detach-tensor', 'requires-grad', 'train-eval']
	},
	'detach-tensor': {
		id: 'detach-tensor',
		term: '.detach()',
		short: String.raw`Вырвать один тензор из графа (как константу).`,
		body: String.raw`**t.detach()** возвращает тензор с теми же данными, но **отрезанный** от [[vychislitelnyy-graf|графа]]: без истории операций и с **requires_grad=False**. Градиент через него не потечёт — он становится «константой». Нужен, чтобы использовать промежуточное значение для метрик/логирования или заморозить часть сети, не задев остальной граф. Точечная альтернатива блоку [[no-grad|torch.no_grad()]].`,
		related: ['no-grad', 'vychislitelnyy-graf', 'grad-fn', 'requires-grad']
	}
};
