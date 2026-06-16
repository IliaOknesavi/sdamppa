import type { Day } from '$lib/types';

// День 17. Конвенции (как в эталоне day01):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.

export const day17: Day = {
	n: 17,
	phaseId: 'arch',
	title: 'Внимание и трансформеры',
	chapterRef: 'pt-17',
	est: '1–2 ч',
	goal: String.raw`Разобрать [[self-attention|self-attention]] изнутри — [[qkv|Q, K, V]] и [[scaled-dot-product|scaled dot-product]] — и собрать энкодер трансформера: [[embedding-sloy|эмбеддинги токенов]], [[pozicionnoe-kodirovanie|позиционное кодирование]] и [[transformer-encoder|nn.TransformerEncoder]].`,
	sections: [
		{
			kind: 'intuition',
			heading: 'Зачем внимание: чего не хватало RNN',
			body: String.raw`Рекуррентная сеть читает последовательность *по одному токену*, протаскивая состояние слева направо. Два больных места: длинные зависимости размываются (токен в начале еле влияет на конец), и шаги нельзя распараллелить — позиция $t$ ждёт позицию $t-1$.

[[self-attention|Внимание]] решает оба разом. Каждый токен *сам* смотрит на все остальные и решает, у кого взять информацию — напрямую, без длинной цепочки. Все позиции считаются параллельно одним матричным умножением. Именно это (плюс масштабируемость на GPU) и [[transformer-encoder|вытеснило RNN]]: трансформер из статьи «Attention Is All You Need» (2017) убрал рекуррентность совсем.

Дальше разберём механизм по кусочкам: что такое [[qkv|Q, K, V]], откуда берётся $\sqrt{d_k}$, зачем [[multi-head|несколько голов]] и [[pozicionnoe-kodirovanie|позиционное кодирование]].`
		},
		{
			kind: 'definition',
			heading: 'Q, K, V и scaled dot-product attention',
			body: String.raw`Каждый токен проецируется в три вектора обучаемыми матрицами: [[qkv|запрос]] $Q$ («что я ищу»), [[qkv|ключ]] $K$ («что я предлагаю») и [[qkv|значение]] $V$ («что я отдаю»). Внимание — это поиск по сходству запроса с ключами и взвешенная сумма значений:

$$\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

По шагам: $QK^\top$ — матрица «похожести» каждого запроса на каждый ключ; делим на $\sqrt{d_k}$ ([[scaled-dot-product|масштабирование]], чтобы [[softmax|softmax]] не насыщался); [[softmax|softmax]] по строкам даёт веса внимания (сумма по строке $=1$); умножение на $V$ собирает выход как смесь значений. Посчитаем это на numpy для маленьких $Q,K,V$.`,
			code: {
				title: 'Scaled dot-product attention вручную (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
d = 4                                  # размерность ключа/запроса
Q = np.random.randn(3, d)              # 3 запроса (3 позиции)
K = np.random.randn(3, d)              # 3 ключа
V = np.random.randn(3, d)              # 3 значения

scores = Q @ K.T / np.sqrt(d)          # (3,3): сходство запрос-ключ, масштаб 1/sqrt(d)
scores -= scores.max(axis=1, keepdims=True)   # стабилизация softmax
attn = np.exp(scores)
attn /= attn.sum(axis=1, keepdims=True)       # softmax по строкам -> сумма = 1

out = attn @ V                         # (3,d): взвешенная смесь значений
print("матрица внимания (строки суммируются в 1):")
print(np.round(attn, 3))
print("сумма по строкам:", np.round(attn.sum(axis=1), 3))
print("форма выхода:", out.shape)`,
				explanation: String.raw`Запусти — каждая строка [[scaled-dot-product|матрицы внимания]] показывает, как один токен распределил «взгляд» по трём позициям, и суммируется в $1$. Выход той же формы $(3,4)$: для каждого токена — своя смесь [[qkv|значений]]. В PyTorch ровно это делает **F.scaled_dot_product_attention(q, k, v)**.`
			}
		},
		{
			kind: 'intuition',
			heading: 'Почему делим на √dₖ',
			body: String.raw`Скалярное произведение $q\cdot k$ — это сумма $d_k$ слагаемых. Если компоненты $q$ и $k$ независимы со средним $0$ и дисперсией $1$, то у произведения дисперсия растёт линейно с $d_k$, а стандартное отклонение — как $\sqrt{d_k}$. При больших $d_k$ значения $QK^\top$ становятся огромными по модулю.

Большие логиты на входе [[softmax|softmax]] загоняют его в насыщение: один вес почти $1$, остальные почти $0$, а [[gradient|градиент]] softmax — почти ноль. Обучение встаёт. Деление на $\sqrt{d_k}$ возвращает [[scaled-dot-product|дисперсию логитов к $\approx 1$]] независимо от размерности — softmax остаётся «мягким», градиент течёт. Это и есть смысл *scaled* в названии.`
		},
		{
			kind: 'definition',
			heading: 'Multi-head: несколько внимательных взглядов',
			body: String.raw`Одна голова усредняет всё в один паттерн внимания. [[multi-head|Multi-head attention]] запускает $h$ голов параллельно: $Q,K,V$ проецируются в $h$ подпространств размерности $d_k=d_\text{model}/h$, каждая голова считает своё внимание, выходы [[multi-head|конкатенируются]] и проецируются обратно:

$$\mathrm{MultiHead}=\mathrm{Concat}(\text{head}_1,\dots,\text{head}_h)\,W^O$$

Зачем: разные головы учатся смотреть на разное — одна на соседние слова, другая на согласование подлежащего и сказуемого, третья на пунктуацию. Общая стоимость та же (размерности делятся), а выразительность выше. В PyTorch — **nn.MultiheadAttention(embed_dim, num_heads)**, и она же спрятана внутри [[transformer-encoder|TransformerEncoderLayer]].`
		},
		{
			kind: 'definition',
			heading: 'Эмбеддинги и позиционное кодирование',
			body: String.raw`Сначала токены (id слов) превращают в векторы [[embedding-sloy|обучаемой таблицей]] **nn.Embedding(vocab, d_model)** — строка таблицы на каждый токен. Но внимание [[pozicionnoe-kodirovanie|симметрично к перестановкам]]: «кот ест мышь» и «мышь ест кот» для него одинаковы, ведь $QK^\top$ не знает порядка.

Чтобы вернуть позицию, к эмбеддингам *прибавляют* [[pozicionnoe-kodirovanie|позиционное кодирование]] — вектор, зависящий от места в последовательности. Классический вариант — синусы и косинусы разных частот:

$$PE_{(p,2i)}=\sin\!\frac{p}{10000^{2i/d}},\quad PE_{(p,2i+1)}=\cos\!\frac{p}{10000^{2i/d}}$$

У каждой позиции $p$ получается уникальный вектор, а близкие позиции — близкие коды. Посмотрим на эту матрицу на numpy.`,
			code: {
				title: 'Синус-косинус позиционное кодирование (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

L, d = 6, 8                            # длина последовательности, размерность модели
pos = np.arange(L)[:, None]            # (L,1): индексы позиций 0..L-1
i = np.arange(d)[None, :]              # (1,d): индексы каналов
denom = np.power(10000.0, (2 * (i // 2)) / d)
angles = pos / denom                   # (L,d): угол для каждой (позиция, канал)

PE = np.zeros((L, d))
PE[:, 0::2] = np.sin(angles[:, 0::2])  # чётные каналы — синус
PE[:, 1::2] = np.cos(angles[:, 1::2])  # нечётные — косинус

print("позиционное кодирование (L=6, d=8):")
print(np.round(PE, 2))
print("у каждой позиции свой уникальный вектор:", PE.shape)`,
				explanation: String.raw`Запусти — каждая строка это код одной позиции. Левые каналы меняются быстро (высокая частота), правые почти постоянны — так кодируется и близкий, и далёкий порядок. Эту матрицу [[pozicionnoe-kodirovanie|прибавляют]] к [[embedding-sloy|эмбеддингам]] до подачи в [[transformer-encoder|энкодер]].`
			}
		},
		{
			kind: 'connection',
			heading: 'Собираем энкодер: nn.TransformerEncoder и маски',
			body: String.raw`Готовый блок — [[transformer-encoder|nn.TransformerEncoderLayer]]: внутри [[multi-head|multi-head self-attention]], feed-forward сеть, остаточные связи и **LayerNorm**. Стопка из таких слоёв — **nn.TransformerEncoder(layer, num_layers)**.

Две [[transformer-encoder|маски]] управляют тем, на что смотреть. **src_key_padding_mask** скрывает паддинг (добитые до общей длины пустышки) — внимание их игнорирует. **attn_mask** запрещает заглядывать вперёд (нужно для декодера-генератора, в энкодере обычно не нужна). Ниже — настоящий PyTorch: [[embedding-sloy|эмбеддинг]] + [[pozicionnoe-kodirovanie|позиционное кодирование]] + энкодер, пулинг и [[parametr|линейная голова]] для классификации последовательности.`,
			code: {
				title: 'Энкодер-классификатор последовательностей (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import torch.nn as nn

class SeqClassifier(nn.Module):
    def __init__(self, vocab=1000, d_model=64, nhead=4, layers=2, n_cls=3, max_len=128):
        super().__init__()
        self.embed = nn.Embedding(vocab, d_model)
        self.pos = nn.Parameter(torch.randn(1, max_len, d_model))   # обучаемое позиц. кодирование
        enc_layer = nn.TransformerEncoderLayer(
            d_model, nhead, dim_feedforward=256, batch_first=True   # вход (N, L, d_model)
        )
        self.encoder = nn.TransformerEncoder(enc_layer, num_layers=layers)
        self.head = nn.Linear(d_model, n_cls)

    def forward(self, x, pad_mask=None):           # x: (N, L) — id токенов
        h = self.embed(x) + self.pos[:, : x.size(1)]
        h = self.encoder(h, src_key_padding_mask=pad_mask)  # (N, L, d_model)
        h = h.mean(dim=1)                          # mean-пулинг по длине -> (N, d_model)
        return self.head(h)                        # логиты (N, n_cls)

model = SeqClassifier()
tokens = torch.randint(0, 1000, (8, 20))           # батч 8, длина 20
logits = model(tokens)
print(logits.shape)                                 # torch.Size([8, 3])`,
				explanation: String.raw`**batch_first=True** ставит ось батча первой — вход $(N,L)$ id, после [[embedding-sloy|эмбеддинга]] $(N,L,d_\text{model})$. [[transformer-encoder|Энкодер]] сохраняет длину, дальше mean-пулинг по позициям схлопывает $L$, и [[parametr|Linear]] даёт логиты на классы. Для текста реальной длины используют **src_key_padding_mask**, чтобы паддинг не влиял на пулинг и внимание.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d17-t1',
			difficulty: 'base',
			prompt: String.raw`Зачем в [[scaled-dot-product|scaled dot-product attention]] делят $QK^\top$ именно на $\sqrt{d_k}$, а не на $d_k$ или просто на константу? Что сломается без масштабирования при большой размерности $d_k$?`,
			hint: String.raw`Прикинь дисперсию скалярного произведения $q\cdot k$ из $d_k$ слагаемых с единичной дисперсией. Как ведёт себя [[softmax|softmax]] при очень больших по модулю входах?`,
			solution: String.raw`Скалярное произведение — сумма $d_k$ слагаемых; при компонентах с дисперсией $\approx 1$ его дисперсия растёт как $d_k$, а стандартное отклонение — как $\sqrt{d_k}$. Деление на $\sqrt{d_k}$ возвращает дисперсию логитов к $\approx 1$ независимо от $d_k$. Без него при большом $d_k$ логиты огромны по модулю, [[softmax|softmax]] насыщается (один вес $\approx 1$, остальные $\approx 0$), его [[gradient|градиент]] почти ноль — обучение встаёт. Делить на $d_k$ — пере-масштабирование (дисперсия упала бы до $1/d_k$), а $\sqrt{d_k}$ калибрует ровно.`,
			answer: String.raw`Чтобы дисперсия логитов осталась $\approx 1$ и softmax не насыщался; без этого градиент через softmax исчезает.`,
			xp: 12
		},
		{
			id: 'pt-d17-t2',
			difficulty: 'base',
			prompt: String.raw`Объясните роль трёх проекций [[qkv|Q, K, V]] в self-attention. Что считает $QK^\top$, на что влияет $V$, и почему этих ролей именно три, а не одна общая матрица?`,
			hint: String.raw`Подумай аналогией поиска: запрос ищешь по ключам, а получаешь значения. Совпадает ли «по чему ищем» с «что отдаём»?`,
			solution: String.raw`[[qkv|Запрос]] $Q$ — «что данный токен ищет», [[qkv|ключ]] $K$ — «по какому признаку токен находят», [[qkv|значение]] $V$ — «какую информацию токен отдаёт». $QK^\top$ считает сходство каждого запроса с каждым ключом — матрицу весов внимания (после $\sqrt{d_k}$ и [[softmax|softmax]]). $V$ задаёт, *что* именно подмешивается: выход — взвешенная сумма значений. Роли разделены, потому что «по чему ищем» (ключ) и «что забираем» (значение) — разные вещи; три отдельные обучаемые матрицы дают модели свободу выучить их независимо.`,
			answer: String.raw`$Q$ ищет, $K$ — по чему находят (их произведение даёт веса внимания), $V$ — что подмешивается; роли независимы, поэтому матрицы разные.`,
			xp: 12
		},
		{
			id: 'pt-d17-t3',
			difficulty: 'star',
			prompt: String.raw`Почему чистому self-attention обязательно нужно [[pozicionnoe-kodirovanie|позиционное кодирование]]? Покажите, что без него внимание не различает порядок токенов, и объясните, как именно синус-косинус-кодирование возвращает позицию.`,
			hint: String.raw`Что произойдёт с $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$, если переставить строки входа? Зависит ли набор скалярных произведений от *порядка* токенов?`,
			solution: String.raw`Self-attention перестановочно-эквивариантно: операция $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$ работает над *множеством* токенов. Если переставить входные токены, строки $Q,K,V$ переставятся согласованно, и выход просто переставится так же — никакой информации о *порядке* в нём нет. Значит «кот ест мышь» и «мышь ест кот» при одинаковых [[embedding-sloy|эмбеддингах]] дадут эквивалентные представления, что для языка неверно. Лекарство — [[pozicionnoe-kodirovanie|прибавить к эмбеддингам]] вектор, зависящий от позиции: $PE_{(p,2i)}=\sin(p/10000^{2i/d})$, $PE_{(p,2i+1)}=\cos(\cdot)$. Каналы имеют разные частоты, поэтому у каждой позиции $p$ свой уникальный код, а близкие позиции получают близкие векторы; теперь $Q,K$ несут и содержание, и место — внимание начинает различать порядок.`,
			answer: String.raw`Внимание перестановочно-инвариантно и само не видит порядок; синус-косинус-код даёт каждой позиции уникальный вектор, который прибавляют к эмбеддингам, возвращая порядок.`,
			xp: 25
		}
	],
	mastery: [
		'Записываю формулу scaled dot-product attention и понимаю роль Q, K, V',
		'Объясняю, зачем делят на √dₖ, и что без этого ломается в softmax',
		'Понимаю смысл multi-head и зачем нужно позиционное кодирование',
		'Собираю энкодер: nn.Embedding + позиц. кодирование + nn.TransformerEncoder с маской и головой'
	]
};
