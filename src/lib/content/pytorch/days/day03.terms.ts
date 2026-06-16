import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 3. Базовые (tenzor, autograd, requires-grad,
// vychislitelnyy-graf, tensor-numpy-most, item-skalyar, reshape-view, shape-forma…)
// живут в glossary.ts / day01.terms.ts и перекрывают совпадающие id.
export const day03Terms: Glossary = {
	'shared-memory': {
		id: 'shared-memory',
		term: 'Общая память',
		short: String.raw`Два тензора смотрят на один буфер.`,
		body: String.raw`Тензор хранит не сами числа, а указатель на буфер плюс [[shape-forma|форму]] и [[strides|шаги]]. Поэтому несколько тензоров могут **делить один буфер**: срез **t[1:3]**, **t.view(...)**, [[tensor-numpy-most|torch.from_numpy(a)]] на CPU не копируют данные. Меняешь элемент через один — меняется и другой. Проверка: совпадение **t.data_ptr()** или **np.shares_memory(a, b)**. Чтобы оторваться — явная копия ([[clone-tensor|.clone()]], **.copy()**).`,
		related: ['view-vs-copy', 'clone-tensor', 'tensor-numpy-most', 'strides']
	},
	contiguous: {
		id: 'contiguous',
		term: 'Contiguous (непрерывность)',
		short: String.raw`Элементы лежат в памяти подряд, в C-порядке.`,
		body: String.raw`Тензор **contiguous**, когда его элементы расположены в буфере ряд за рядом без «дыр» — как их кладёт свежий **reshape**. Многие операции ([[view-vs-copy|транспонирование]], некоторые срезы) меняют только [[strides|шаги]], не двигая данные, и делают тензор *не*-contiguous. Тогда **.view()** падает, а **.reshape()** при необходимости копирует. Проверка — **t.is_contiguous()**; починка — **t.contiguous()** (один раз пересобирает данные в непрерывный буфер).`,
		related: ['strides', 'view-vs-copy', 'reshape-view']
	},
	strides: {
		id: 'strides',
		term: 'Strides (шаги)',
		short: String.raw`Сколько байт прыгнуть на +1 по каждой оси.`,
		body: String.raw`**strides** — кортеж: на сколько байт сдвинуться в буфере, чтобы увеличить индекс на $1$ вдоль каждой оси. Адрес элемента — скалярное произведение индексов на шаги. Именно через шаги $n$-мерный тензор «накладывается» на 1-мерную память. Транспонирование, **view** и срезы часто меняют *только* shape и strides, оставляя буфер на месте — отсюда [[shared-memory|общая память]] и понятие [[contiguous|непрерывности]]. В PyTorch — **t.stride()**.`,
		related: ['contiguous', 'shape-forma', 'shared-memory']
	},
	'view-vs-copy': {
		id: 'view-vs-copy',
		term: 'Вид vs копия',
		short: String.raw`Один буфер с новыми strides — или новый буфер.`,
		body: String.raw`**Вид (view)** — новый тензор поверх *того же* буфера, отличается лишь [[shape-forma|формой]] и [[strides|шагами]]; запись в него меняет оригинал ([[shared-memory|общая память]]). **Копия** — отдельный буфер, независимый от оригинала. **view**/срез/транспонирование дают вид; [[clone-tensor|.clone()]]/**.copy()** — копию. **reshape** возвращает вид, если новая форма ложится на текущие шаги, иначе тихо копирует.`,
		related: ['shared-memory', 'contiguous', 'clone-tensor', 'reshape-view']
	},
	'clone-tensor': {
		id: 'clone-tensor',
		term: '.clone() (копия данных)',
		short: String.raw`Новый буфер, граф сохранён.`,
		body: String.raw`**t.clone()** делает тензор с *отдельным* буфером и теми же числами — правки копии не задевают оригинал. При этом операция остаётся в [[vychislitelnyy-graf|графе]]: [[requires-grad|requires_grad]] наследуется, и [[backward|backward]] через клон дотечёт градиентом до оригинала. То есть clone — про **память**, не про граф. Нужна независимая правка данных без поломки обучения — это он. Полностью независимый снимок без истории — **t.detach().clone()**.`,
		related: ['detach', 'shared-memory', 'view-vs-copy', 'autograd']
	},
	detach: {
		id: 'detach',
		term: '.detach() (отрыв от графа)',
		short: String.raw`Та же память, граф обрублен.`,
		body: String.raw`**t.detach()** возвращает тензор, *делящий память* с оригиналом, но с **requires_grad=False** и без истории операций: [[autograd|autograd]] на него не смотрит, и [[backward|backward]] через него в оригинал не идёт. Detach — про **граф**, не про память. Нужен, чтобы прочитать значение без [[vychislitelnyy-graf|графа]] (лог, метрика, переход в numpy); для скаляра ещё короче — [[item-skalyar|.item()]]. Осторожно: запись в результат портит оригинал (буфер общий) — для безопасности **t.detach().clone()**.`,
		related: ['clone-tensor', 'requires-grad', 'autograd', 'vychislitelnyy-graf']
	}
};
