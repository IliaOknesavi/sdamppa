import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 17 (внимание и трансформеры). Базовые
// (softmax, gradient, parametr, embedding и т.п.) живут в glossary.ts.
export const day17Terms: Glossary = {
	'self-attention': {
		id: 'self-attention',
		term: 'Self-attention',
		short: String.raw`Каждый токен смотрит на все токены той же последовательности.`,
		body: String.raw`**Self-attention** — механизм, в котором каждый токен последовательности вычисляет, сколько внимания уделить остальным токенам *той же* последовательности, и собирает из них свою новую репрезентацию. В отличие от RNN, связь между любыми двумя позициями — прямая (один шаг), а все позиции считаются параллельно. Реализуется через [[qkv|Q, K, V]] и [[scaled-dot-product|scaled dot-product]].`,
		related: ['qkv', 'scaled-dot-product', 'multi-head', 'transformer-encoder']
	},
	qkv: {
		id: 'qkv',
		term: 'Query, Key, Value (Q, K, V)',
		short: String.raw`Три обучаемые проекции токена: запрос, ключ, значение.`,
		body: String.raw`Каждый токен проецируется обучаемыми матрицами в **запрос** $Q$ («что я ищу»), **ключ** $K$ («по чему меня находят») и **значение** $V$ («что я отдаю»). Сходство $QK^\top$ даёт веса внимания, а выход — взвешенная сумма значений $V$. Разделение ролей «по чему ищем» и «что забираем» — ключевая идея [[self-attention|внимания]].`,
		related: ['self-attention', 'scaled-dot-product', 'multi-head']
	},
	'scaled-dot-product': {
		id: 'scaled-dot-product',
		term: 'Scaled dot-product attention',
		short: String.raw`softmax(QKᵀ/√dₖ)·V — ядро механизма внимания.`,
		formula: String.raw`\mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V`,
		body: String.raw`Базовая формула [[self-attention|внимания]]: $QK^\top$ — сходство [[qkv|запросов и ключей]], делёж на $\sqrt{d_k}$ удерживает дисперсию логитов около $1$ (иначе [[softmax|softmax]] насыщается и [[gradient|градиент]] исчезает), [[softmax|softmax]] по строкам даёт веса (сумма $=1$), умножение на $V$ собирает выход. В PyTorch — **F.scaled_dot_product_attention**.`,
		related: ['self-attention', 'qkv', 'softmax', 'multi-head']
	},
	'multi-head': {
		id: 'multi-head',
		term: 'Multi-head attention',
		short: String.raw`Несколько голов внимания параллельно, затем конкатенация.`,
		formula: String.raw`\mathrm{Concat}(\text{head}_1,\dots,\text{head}_h)\,W^O`,
		body: String.raw`**Multi-head attention** запускает $h$ независимых [[scaled-dot-product|голов внимания]] в подпространствах размерности $d_k=d_\text{model}/h$, конкатенирует их выходы и проецирует обратно матрицей $W^O$. Разные головы учатся смотреть на разные связи (соседство, согласование, пунктуация). Стоимость та же, выразительность выше. В PyTorch — **nn.MultiheadAttention**.`,
		related: ['scaled-dot-product', 'self-attention', 'transformer-encoder']
	},
	'pozicionnoe-kodirovanie': {
		id: 'pozicionnoe-kodirovanie',
		term: 'Позиционное кодирование',
		short: String.raw`Вектор позиции, прибавляемый к эмбеддингу токена.`,
		body: String.raw`[[self-attention|Внимание]] перестановочно-инвариантно и само не видит порядок токенов. **Позиционное кодирование** возвращает порядок: к каждому [[embedding-sloy|эмбеддингу]] прибавляют вектор, зависящий от позиции. Классика — синусы/косинусы разных частот $PE_{(p,2i)}=\sin(p/10000^{2i/d})$; у каждой позиции свой уникальный код, близкие позиции — близкие векторы. Бывает и обучаемым ([[parametr|nn.Parameter]]).`,
		formula: String.raw`PE_{(p,2i)}=\sin\!\frac{p}{10000^{2i/d}}`,
		related: ['embedding-sloy', 'self-attention', 'transformer-encoder']
	},
	'embedding-sloy': {
		id: 'embedding-sloy',
		term: 'nn.Embedding',
		short: String.raw`Таблица: id токена → обучаемый вектор.`,
		body: String.raw`**nn.Embedding(vocab, d_model)** — обучаемая таблица из **vocab** строк по $d_\text{model}$ чисел. По id токена возвращает соответствующую строку-вектор; это первый слой текстовой модели. Строки — обычные [[parametr|параметры]], их учат вместе с сетью. Поверх эмбеддингов добавляют [[pozicionnoe-kodirovanie|позиционное кодирование]].`,
		related: ['pozicionnoe-kodirovanie', 'transformer-encoder', 'parametr']
	},
	'transformer-encoder': {
		id: 'transformer-encoder',
		term: 'nn.TransformerEncoder',
		short: String.raw`Стопка слоёв self-attention + feed-forward.`,
		body: String.raw`**nn.TransformerEncoderLayer** — один блок: [[multi-head|multi-head self-attention]], feed-forward сеть, остаточные связи и **LayerNorm**. **nn.TransformerEncoder(layer, num_layers)** складывает их в стопку. Маски управляют видимостью: **src_key_padding_mask** скрывает паддинг, **attn_mask** запрещает заглядывать вперёд. Параллельность и прямые связи между токенами — причина, по которой трансформеры вытеснили RNN.`,
		related: ['self-attention', 'multi-head', 'pozicionnoe-kodirovanie', 'embedding-sloy']
	}
};
