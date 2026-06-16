import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 16. Базовые (tenzor, backprop, gradient, nn-module,
// cross-entropy, softmax…) живут в glossary.ts и перекрывают совпадающие id.
export const day16Terms: Glossary = {
	'skrytoe-sostoyanie': {
		id: 'skrytoe-sostoyanie',
		term: 'Скрытое состояние (h_t)',
		short: String.raw`Память RNN: сводка всего, что видели до шага t.`,
		formula: String.raw`h_t = \tanh(W_x x_t + W_h h_{t-1} + b)`,
		body: String.raw`**Скрытое состояние** $h_t$ — вектор фиксированного размера **hidden_size**, который [[rnn-cell|рекуррентная сеть]] несёт от шага к шагу. На каждом шаге он обновляется из нового входа $x_t$ и прошлого состояния $h_{t-1}$ одними и теми же весами. По сути это сжатая память о всей предыстории последовательности; финальное $h_n$ часто используют как эмбеддинг всей последовательности.`,
		related: ['rnn-cell', 'lstm', 'gru']
	},
	'rnn-cell': {
		id: 'rnn-cell',
		term: 'RNN-ячейка (nn.RNN)',
		short: String.raw`Базовая рекуррентная ячейка с одним tanh.`,
		formula: String.raw`h_t = \tanh(W_x x_t + W_h h_{t-1} + b)`,
		body: String.raw`**Ванильная RNN** — простейшая рекуррентная ячейка: на каждом шаге смешивает вход и прошлое [[skrytoe-sostoyanie|состояние]] через линейные веса и $\tanh$. Одни и те же $W_x, W_h$ применяются ко всем шагам. В PyTorch — **nn.RNN**. Минус — [[dlinnye-zavisimosti|затухающий градиент]] на длинных последовательностях, поэтому на практике её вытесняют [[lstm|LSTM]] и [[gru|GRU]].`,
		related: ['skrytoe-sostoyanie', 'lstm', 'gru', 'dlinnye-zavisimosti']
	},
	lstm: {
		id: 'lstm',
		term: 'LSTM',
		short: String.raw`Рекуррентная ячейка с памятью c_t и тремя гейтами.`,
		body: String.raw`**LSTM** (Long Short-Term Memory) добавляет к [[skrytoe-sostoyanie|скрытому состоянию]] $h_t$ отдельную **ячейку памяти** $c_t$ и три гейта: forget (что забыть из $c$), input (что записать) и output (что отдать в $h$). Память $c_t$ течёт почти линейно — это «шоссе» для [[gradient|градиента]], которое лечит [[dlinnye-zavisimosti|затухание]]. В PyTorch — **nn.LSTM**; возвращает пару $(h_n, c_n)$.`,
		related: ['rnn-cell', 'gru', 'skrytoe-sostoyanie', 'dlinnye-zavisimosti']
	},
	gru: {
		id: 'gru',
		term: 'GRU',
		short: String.raw`Облегчённая LSTM: два гейта, без отдельной c_t.`,
		body: String.raw`**GRU** (Gated Recurrent Unit) — упрощённая [[lstm|LSTM]] с двумя гейтами (reset и update) и без отдельной ячейки памяти: вся информация хранится в [[skrytoe-sostoyanie|$h_t$]]. Меньше параметров, обучается быстрее, по качеству часто не уступает LSTM. В PyTorch — **nn.GRU**; возвращает только $h_n$. Хороший выбор по умолчанию вместе с LSTM.`,
		related: ['lstm', 'rnn-cell', 'skrytoe-sostoyanie']
	},
	'batch-first': {
		id: 'batch-first',
		term: 'batch_first',
		short: String.raw`Порядок осей входа: (N, L, H) вместо (L, N, H).`,
		body: String.raw`**batch_first=True** меняет ожидаемую форму входа/выхода рекуррентного слоя на $(N, L, H)$ — батч первым, как у остальных слоёв PyTorch. По умолчанию (**False**) torch ждёт «time-major» $(L, N, H)$, что путает новичков. Практически всегда ставят **batch_first=True**. Внимание: на форму **h_n** этот флаг **не** влияет — она всегда $(\text{num\_layers}, N, H_{out})$.`,
		related: ['skrytoe-sostoyanie', 'shape-forma', 'rnn-cell']
	},
	'packed-sequence': {
		id: 'packed-sequence',
		term: 'Packed sequence',
		short: String.raw`Упаковка батча разной длины без паддинга в RNN.`,
		body: String.raw`**pack_padded_sequence** сжимает паддированный батч последовательностей разной длины, передавая слою реальные длины. RNN не тратит вычисления на нули-паддинг и возвращает [[skrytoe-sostoyanie|финальное состояние]] на *настоящем* последнем шаге каждого примера. Обратно в плотную форму — **pad_packed_sequence**. Обычно зовут с **enforce_sorted=False**, чтобы не сортировать батч вручную.`,
		related: ['skrytoe-sostoyanie', 'batch', 'lstm']
	},
	'dlinnye-zavisimosti': {
		id: 'dlinnye-zavisimosti',
		term: 'Длинные зависимости',
		short: String.raw`Затухающий градиент мешает помнить далёкое прошлое.`,
		body: String.raw`**Проблема длинных зависимостей** — ванильной [[rnn-cell|RNN]] трудно связать далеко отстоящие элементы. При [[backprop|обратном распространении]] через $L$ шагов [[gradient|градиент]] многократно умножается на $W_h$ и экспоненциально затухает (или взрывается). Поэтому начало длинной последовательности «забывается». [[lstm|LSTM]] и [[gru|GRU]] с гейтами и ячейкой памяти дают градиенту почти линейный путь и решают эту проблему.`,
		related: ['rnn-cell', 'lstm', 'gru', 'backprop', 'gradient']
	}
};
