import type { Day } from '$lib/types';

export const day14: Day = {
	n: 14,
	phaseId: 'arch',
	title: 'Свёрточные сети (CNN)',
	chapterRef: 'pt-14',
	est: '1–2 ч',
	goal: String.raw`Понять, как [[conv2d|свёртка]] скользит обучаемым фильтром по изображению и строит [[feature-map|карты признаков]], и собрать классификатор картинок из блоков Conv→ReLU→[[max-pool|Pool]] с [[flatten-pered-linear|flatten]] перед [[nn-module|Linear]].`,
	sections: [
		{
			kind: 'intuition',
			heading: 'Почему не просто Linear по пикселям',
			body: String.raw`Картинка $28\times28$ — это $784$ числа. Если подать их в **nn.Linear** напрямую, первый слой на $100$ нейронов уже весит $784\cdot100\approx78\,000$ параметров, и при этом он **ничего не знает про геометрию**: пиксель-сосед и пиксель с другого края для него равноправны. Сдвинь цифру на один пиксель — и все активации поедут.

[[conv2d|Свёртка]] решает обе беды сразу. Она применяет маленькое окно весов (**ядро**, например $3\times3$) ко **всем** позициям картинки, переиспользуя одни и те же веса ([[razdelenie-vesov|разделение весов]]). Отсюда — мало параметров и [[invariantnost-k-sdvigu|инвариантность к сдвигу]]: фильтр края сработает на крае, где бы тот ни оказался.`
		},
		{
			kind: 'definition',
			heading: 'Свёртка вживую: фильтр краёв на numpy',
			body: String.raw`[[conv-kernel|Ядро]] скользит по входу; на каждой позиции берётся окно той же формы, поэлементно умножается на ядро и суммируется в **одно** число [[feature-map|карты признаков]]. Это и есть 2D-свёртка (точнее — кросс-корреляция, как в PyTorch). Без [[padding-stride|padding]] карта выходит чуть меньше входа — это режим **valid**.`,
			code: {
				title: 'Свёртка 3×3 (valid) — детектор вертикальных краёв (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
# «Картинка» 6x6: слева темно, справа светло -> вертикальный край в центре.
img = np.zeros((6, 6))
img[:, 3:] = 1.0

# Ядро Собеля: реагирует на перепад яркости по горизонтали.
kernel = np.array([[-1, 0, 1],
                   [-2, 0, 2],
                   [-1, 0, 1]])

H, W = img.shape
kh, kw = kernel.shape
out_h, out_w = H - kh + 1, W - kw + 1        # формула valid-свёртки
feat = np.zeros((out_h, out_w))
for i in range(out_h):
    for j in range(out_w):
        patch = img[i:i+kh, j:j+kw]           # окно под ядром
        feat[i, j] = np.sum(patch * kernel)   # свёртка = сумма произведений

print("вход:", img.shape, "-> карта признаков:", feat.shape)
print(feat)`,
				explanation: String.raw`Запусти: вход $6\times6$ даёт [[feature-map|карту]] $4\times4$ — ровно $6-3+1$ по каждой оси. В карте ненулевая полоса стоит там, где в картинке проходит вертикальный край: фильтр «загорелся» на перепаде яркости. Одно ядро = один тип признака. В **nn.Conv2d** таких ядер десятки, и веса в них не заданы вручную, а **обучаются**.`
			}
		},
		{
			kind: 'definition',
			heading: 'nn.Conv2d: каналы, stride, padding',
			body: String.raw`**nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding)** — обучаемый слой свёртки. Вход — тензор $(N,C_{in},H,W)$, выход — $(N,C_{out},H',W')$:

- **in_channels** — глубина входа: $1$ для ч/б, $3$ для RGB, или число [[feature-map|карт]] с прошлого слоя;
- **out_channels** — сколько разных [[conv-kernel|ядер]] (фильтров) учим; столько [[feature-map|карт признаков]] на выходе;
- **kernel_size** — размер окна ($3$ или $5$ — типично);
- **stride** — шаг скольжения ([[padding-stride|stride]] $2$ уменьшает карту вдвое);
- **padding** — рамка нулей вокруг входа, чтобы сохранить размер.

Размер выхода по каждой оси — это [[vyhodnoy-razmer|формула]]:
$$H' = \left\lfloor \dfrac{H + 2p - k}{s} \right\rfloor + 1.$$

Число параметров одного слоя: $(C_{in}\cdot k\cdot k + 1)\cdot C_{out}$ — ядро на каждый входной канал плюс [[parametr|bias]], и так $C_{out}$ раз. Заметь: размер **картинки** в это число не входит — в этом вся сила [[razdelenie-vesov|разделения весов]].`
		},
		{
			kind: 'definition',
			heading: 'Pooling и рецептивное поле',
			body: String.raw`**nn.MaxPool2d(2)** берёт максимум в каждом окне $2\times2$ и режет пространственный размер вдвое: $(N,C,H,W)\to(N,C,H/2,W/2)$. Каналы не трогает, [[parametr|параметров]] не имеет. Зачем: меньше вычислений, лёгкая устойчивость к сдвигам и — главное — рост [[receptive-field|рецептивного поля]].

[[receptive-field|Рецептивное поле]] нейрона — какой кусок исходной картинки на него влияет. У одной свёртки $3\times3$ это $3\times3$ пикселя; стек свёрток и [[max-pool|пулингов]] быстро его расширяет, и глубокие нейроны «видят» уже всю картинку. Так сеть переходит от локальных краёв к крупным формам.`,
			code: {
				title: 'Маленькая CNN для MNIST: формы после каждого слоя (PyTorch)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import torch.nn as nn

class SmallCNN(nn.Module):
    def __init__(self, n_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1),  # 1x28x28 -> 16x28x28
            nn.ReLU(),
            nn.MaxPool2d(2),                              # -> 16x14x14
            nn.Conv2d(16, 32, kernel_size=3, padding=1), # -> 32x14x14
            nn.ReLU(),
            nn.MaxPool2d(2),                              # -> 32x7x7
        )
        self.head = nn.Sequential(
            nn.Flatten(),                 # 32x7x7 -> 1568
            nn.Linear(32 * 7 * 7, n_classes),
        )

    def forward(self, x):
        x = self.features(x)
        return self.head(x)

model = SmallCNN()
x = torch.randn(4, 1, 28, 28)             # батч из 4 картинок
for layer in model.features:
    x = layer(x)
    print(layer.__class__.__name__, "->", tuple(x.shape))
print("логиты:", tuple(model(torch.randn(4, 1, 28, 28)).shape))`,
				explanation: String.raw`Классический скелет CNN: блок **Conv→ReLU→Pool** дважды, затем [[flatten-pered-linear|Flatten]] и [[nn-module|Linear]] на $10$ классов. Печать форм — лучший способ отладки: следи, как $H,W$ падают $28\to14\to7$, а число каналов растёт $1\to16\to32$. Перед **Linear** обязателен **Flatten**: $32\times7\times7$ вытягивается в вектор $1568$. Дальше — обычный цикл обучения с [[cross-entropy|CrossEntropyLoss]].`
			}
		},
		{
			kind: 'connection',
			heading: 'Типичная архитектура и переход к Linear',
			body: String.raw`Канонический классификатор изображений собирается по шаблону **[Conv → ReLU → Pool] × N → Flatten → Linear**:

1. свёрточная часть («тело») извлекает [[feature-map|признаки]]: каждый блок углубляет каналы и сжимает $H,W$;
2. [[flatten-pered-linear|Flatten]] превращает тензор $(N,C,H,W)$ в $(N, C\cdot H\cdot W)$ — теперь это просто вектор признаков;
3. «голова» из [[nn-module|Linear]] отображает его в логиты классов, дальше [[cross-entropy|кросс-энтропия]].

Это та же логика, что и в полносвязной сети из дня 9, — но вход в «голову» даёт не сырой пиксель, а уже осмысленные признаки, выученные свёртками. Поэтому CNN учится быстрее и обобщает лучше на любых картинках.`
		}
	],
	tasks: [
		{
			id: 'pt-d14-t1',
			difficulty: 'base',
			prompt: String.raw`Вход слоя — карта $(N, 8, 32, 32)$. Применяем **nn.Conv2d(8, 16, kernel_size=5, stride=1, padding=0)**. Какой [[shape-forma|формы]] будет выход? Используй [[vyhodnoy-razmer|формулу выходного размера]].`,
			hint: String.raw`$H' = \lfloor (H + 2p - k)/s \rfloor + 1$. Здесь $p=0$, $k=5$, $s=1$. Число каналов на выходе равно **out_channels**.`,
			solution: String.raw`По осям: $H' = \lfloor (32 + 0 - 5)/1 \rfloor + 1 = 27 + 1 = 28$, аналогично $W' = 28$. Каналов на выходе — $16$ (значение **out_channels**), батч $N$ не меняется. Итог — $(N, 16, 28, 28)$.`,
			answer: String.raw`$(N, 16, 28, 28)$.`,
			xp: 12
		},
		{
			id: 'pt-d14-t2',
			difficulty: 'base',
			prompt: String.raw`Зачем нужен [[padding-stride|padding]]? Какое значение **padding** у свёртки с ядром $k=3$ и **stride=1** сохраняет пространственный размер входа, и почему именно оно?`,
			hint: String.raw`Подставь $s=1$ в формулу $H' = \lfloor (H + 2p - k)/s \rfloor + 1$ и потребуй $H' = H$.`,
			solution: String.raw`Без padding каждая **valid**-свёртка отъедает по краям ($H \to H-k+1$), и после нескольких слоёв карта схлопывается; ещё краевые пиксели реже попадают под центр ядра. Рамка нулей это компенсирует. При $s=1$: $H' = H + 2p - k + 1$, требуем $H' = H \Rightarrow 2p = k - 1 \Rightarrow p = (k-1)/2$. Для $k=3$ это $p=1$ (правило «same»: для нечётного $k$ берут $p=(k-1)/2$).`,
			answer: String.raw`Чтобы не терять размер и края; $p=1$.`,
			xp: 12
		},
		{
			id: 'pt-d14-t3',
			difficulty: 'star',
			prompt: String.raw`Сколько обучаемых [[parametr|параметров]] у слоя **nn.Conv2d(3, 16, kernel_size=3)** (bias включён)? Сравни с **nn.Linear**, который отображал бы вход $3\times32\times32$ в $16\times32\times32$ выходных чисел — и объясни разрыв.`,
			hint: String.raw`Conv: $(C_{in}\cdot k \cdot k + 1)\cdot C_{out}$. Linear: каждый выход связан с каждым входом плюс свой bias.`,
			solution: String.raw`**Conv2d(3,16,3)**: одно ядро — $3\cdot3\cdot3 = 27$ весов, плюс $1$ bias $= 28$ на фильтр; фильтров $16$, итого $(3\cdot3\cdot3 + 1)\cdot16 = 28\cdot16 = 448$ параметров — и они **не зависят** от размера картинки. Аналогичный **Linear**: входов $3\cdot32\cdot32 = 3072$, выходов $16\cdot32\cdot32 = 16384$, параметров $3072\cdot16384 + 16384 \approx 5{,}03\cdot10^7$. Разрыв в $\sim100\,000$ раз даёт [[razdelenie-vesov|разделение весов]]: одно ядро переиспользуется во всех позициях вместо отдельного веса на каждую пару пикселей. Отсюда и компактность, и [[invariantnost-k-sdvigu|инвариантность к сдвигу]].`,
			answer: String.raw`$448$ против $\approx5\cdot10^7$ — за счёт разделения весов.`,
			xp: 25
		}
	],
	mastery: [
		'Объясняю свёртку как скользящее окно весов и читаю форму карты признаков',
		'Считаю выходной размер Conv2d по формуле и подбираю padding под "same"',
		'Понимаю роль каналов, stride, pooling и рост рецептивного поля',
		'Собираю классификатор Conv→ReLU→Pool ×N → Flatten → Linear и слежу за формами'
	]
};
