import type { Day } from '$lib/types';

// День 12. Конвенции (как в day01):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.
//  • Термины [[id]] / [[id|подпись]] — из базового глоссария или day12.terms.ts.

export const day12: Day = {
	n: 12,
	phaseId: 'data',
	title: 'Регуляризация: dropout, BatchNorm, weight decay',
	chapterRef: 'pt-12',
	est: '1–2 ч',
	goal: String.raw`Научиться бороться с [[overfitting|переобучением]]: понять, что и зачем делают [[dropout|Dropout]], [[batchnorm|BatchNorm]], [[weight-decay|weight decay]] и [[augmentaciya|аугментации]], как они переключаются между [[train-eval|train и eval]] и в каком [[poryadok-sloev|порядке]] их ставить в блоке слоёв.`,
	sections: [
		{
			kind: 'intuition',
			heading: 'Зачем регуляризация: симптом переобучения',
			body: String.raw`[[overfitting|Переобучение]] — это когда train-потеря падает, а валидационная застывает или растёт: сеть запомнила шум обучающей выборки вместо общих закономерностей. [[regularizaciya|Регуляризация]] — это любой приём, который сознательно немного *мешает* сети идеально подгоняться под трейн, чтобы она лучше обобщала.

В этом дне — четыре рабочие лошадки:

- [[dropout|Dropout]] — случайно «выключает» нейроны на каждом шаге;
- [[batchnorm|BatchNorm]] — нормирует активации по [[batch|батчу]];
- [[weight-decay|weight decay]] — штрафует большие веса ([[l2-shtraf|$L_2$]]);
- [[augmentaciya|аугментации]] — расширяют данные случайными преобразованиями.

Объединяет их одно: на обучении они вносят «шум» или ограничение, а на инференсе ведут себя иначе или отключаются. Отсюда критичность [[train-eval|model.train() / model.eval()]].`
		},
		{
			kind: 'definition',
			heading: 'Dropout: маска Бернулли и масштаб 1/(1−p)',
			body: String.raw`[[dropout|Dropout]] с вероятностью $p$ зануляет каждую активацию слоя независимо ([[dropout-maska|маска Бернулли]]). Сеть не может опереться на конкретный нейрон — приходится распределять «знание» по многим, и это улучшает обобщение.

Тонкость — масштаб. Если на train часть активаций обнулена, их суммарная величина падает в среднем в $(1-p)$ раз, и на [[train-eval|eval]] (где dropout выключен) масштаб окажется другим. Чтобы train и eval совпадали в среднем, оставшиеся активации делят на $(1-p)$ — это [[inverted-dropout|inverted dropout]], и именно так делает **nn.Dropout**. Поэтому на eval ничего масштабировать не нужно: слой просто пропускает вход как есть.

$$\text{train: } \tilde a_i = \frac{m_i}{1-p}\,a_i,\quad m_i\sim\text{Bernoulli}(1-p);\qquad \text{eval: } \tilde a_i = a_i.$$`,
			code: {
				title: 'Dropout вручную: train с маской vs eval без (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
p = 0.5                                   # вероятность занулить нейрон
x = np.array([1.0, 2.0, 3.0, 4.0])        # активации одного слоя

def dropout_train(x, p):
    mask = (np.random.rand(*x.shape) > p)         # маска Бернулли (1=оставить)
    return x * mask / (1.0 - p)                   # масштаб 1/(1-p)

# усредним выход по многим маскам — увидим, что в среднем = входу
avg = np.mean([dropout_train(x, p) for _ in range(20000)], axis=0)

print("вход x:            ", x)
print("один проход train: ", dropout_train(x, p))
print("eval (без dropout):", x)
print("среднее train по 20000 масок:", avg.round(2))`,
				explanation: String.raw`Один проход train «дырявый» — часть значений обнулена и усилена. Но усреднение по многим [[dropout-maska|маскам]] даёт ровно вход: множитель $1/(1-p)$ сохраняет ожидание, поэтому [[inverted-dropout|inverted dropout]] не сдвигает масштаб между [[train-eval|train и eval]]. В torch это **nn.Dropout(p)** плюс правильный режим.`
			}
		},
		{
			kind: 'definition',
			heading: 'BatchNorm: статистики train vs eval',
			body: String.raw`[[batchnorm1d|BatchNorm]] нормирует активации к нулевому среднему и единичной дисперсии, а затем учит свои масштаб $\gamma$ и сдвиг $\beta$. Это стабилизирует распределения между слоями, ускоряет обучение и слегка регуляризует (шум от случайного состава [[batch|батча]]).

Ключевое отличие от dropout — *откуда берётся статистика*:

- на [[train-eval|train]] среднее и дисперсия считаются по **текущему батчу** (по оси $N$), и параллельно обновляются скользящие **running_mean / running_var**;
- на eval батчевые статистики **не** используются — берутся накопленные скользящие, чтобы предсказание для одного объекта не зависело от случайных соседей по батчу.

$$\hat x = \frac{x-\mu_B}{\sqrt{\sigma_B^2+\varepsilon}},\qquad y=\gamma\hat x+\beta.$$

Поэтому забыть **model.eval()** перед инференсом с BatchNorm — частый и коварный баг: на маленьком или нерепрезентативном батче нормировка «поплывёт».`,
			code: {
				title: 'BatchNorm на train: нормировка по статистикам батча (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

np.random.seed(0)
batch = np.random.randn(4, 3) * 5 + 10    # батч N=4, по 3 признака, разный масштаб
eps = 1e-5

# TRAIN BatchNorm: статистики ТЕКУЩЕГО батча по оси N (axis=0)
mu = batch.mean(axis=0)                    # среднее каждого признака
var = batch.var(axis=0)                    # дисперсия каждого признака
normed = (batch - mu) / np.sqrt(var + eps)

print("вход (среднее по столбцам):", batch.mean(axis=0).round(2))
print("вход (дисперсия):          ", batch.var(axis=0).round(2))
print("после BN (среднее):        ", normed.mean(axis=0).round(3))
print("после BN (дисперсия):      ", normed.var(axis=0).round(3))`,
				explanation: String.raw`До нормировки признаки в разном масштабе; после — у каждого среднее $\approx 0$ и дисперсия $\approx 1$. На train считаем это по батчу, а на eval подставили бы накопленные **running_mean/var** — отсюда зависимость поведения [[batchnorm1d|BatchNorm]] от [[train-eval|режима]]. Параметры $\gamma,\beta$ (тут опущены) затем восстанавливают нужный масштаб.`
			}
		},
		{
			kind: 'definition',
			heading: 'Weight decay: L2-штраф прямо в оптимизаторе',
			body: String.raw`[[weight-decay|Weight decay]] добавляет к потере [[l2-shtraf|штраф $\lambda\|w\|^2$]]: большие веса становятся «дорогими», и [[optimizer|оптимизатор]] тянет их к нулю. Меньшие веса → более гладкая функция → меньше [[overfitting|переобучения]].

Эквивалентно это просто добавляет к [[gradient|градиенту]] слагаемое $2\lambda w$, то есть на каждом шаге вес немного «усыхает»:

$$w \leftarrow w - \eta\,(\nabla_w L + 2\lambda w).$$

В PyTorch это бесплатно — параметр **weight_decay** у оптимизатора, ничего к функции потерь руками добавлять не надо: **optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)**. Типичные значения — $10^{-4}$…$10^{-2}$. (Тонкость: «честный» вариант для Adam — **AdamW**, где decay отделён от адаптивного шага.)`
		},
		{
			kind: 'connection',
			heading: 'Аугментации: больше данных «из ничего»',
			body: String.raw`[[augmentaciya|Аугментация]] — случайное преобразование входа, не меняющее метку: для картинок это отражения, повороты, кропы, изменение яркости; для текста — синонимы, перестановки. Каждую [[epoch|эпоху]] сеть видит чуть другой вариант примера, поэтому труднее «запомнить» конкретные пиксели — и легче выучить инвариантные признаки.

Это, по сути, бесплатное расширение [[dataset|датасета]] и одна из самых сильных [[regularizaciya|регуляризаций]] в компьютерном зрении. Важно: аугментации применяют **только к train** — валидацию и тест прогоняют на «чистых» данных, иначе метрика перестанет отражать реальное качество. В PyTorch это слои **torchvision.transforms** в train-датасете.`
		},
		{
			kind: 'note',
			heading: 'Порядок слоёв: Linear → BN → ReLU → Dropout',
			body: String.raw`[[poryadok-sloev|Канонический порядок]] в блоке полносвязной сети: **Linear → BatchNorm → ReLU → Dropout**.

Логика проста:

- **BN после Linear, до активации** — нормируем *вход* нелинейности, чтобы [[batchnorm1d|BatchNorm]] стабилизировал именно то, что пойдёт в ReLU; смещение **bias** у Linear при этом избыточно (BN всё равно вычитает среднее), его часто отключают **bias=False**;
- **Dropout — последним**, после активации: занулять имеет смысл уже готовые активации, а не до нормировки (иначе [[dropout|dropout]] исказил бы статистики, которые считает BN).

Этот порядок не догма (встречается и BN после ReLU), но он надёжный дефолт. Главное правило дня поверх всего: один вызов **model.train()** на обучении и **model.eval()** на инференсе разом переключает и Dropout, и BatchNorm.`,
			code: {
				title: 'MLP с Dropout, BatchNorm, weight decay и режимами (torch)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import torch.nn as nn

# Блок: Linear -> BatchNorm1d -> ReLU -> Dropout (bias=False, т.к. BN центрирует)
model = nn.Sequential(
    nn.Linear(20, 64, bias=False),
    nn.BatchNorm1d(64),
    nn.ReLU(),
    nn.Dropout(p=0.3),
    nn.Linear(64, 2),
)

# weight decay (L2) задаётся прямо в оптимизаторе
opt = torch.optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)

x = torch.randn(16, 20)                 # батч N=16

# TRAIN: Dropout активен, BatchNorm считает статистики по батчу
model.train()
out_train = model(x)

# EVAL: Dropout выключен, BatchNorm берёт накопленные running-статистики
model.eval()
with torch.no_grad():
    out_eval = model(x)

# один и тот же вход даёт разный выход — из-за dropout/BN-режимов
print("train[0,:2]:", out_train[0, :2])
print("eval [0,:2]:", out_eval[0, :2])`,
				explanation: String.raw`Тот же **x** проходит через сеть по-разному: на [[train-eval|train]] работает [[dropout|Dropout]] и батчевая статистика [[batchnorm1d|BatchNorm]], на eval — нет. Переключают это *один раз* вызовами **.train()/.eval()**, а на инференсе ещё оборачивают в **torch.no_grad()**. [[l2-shtraf|Weight decay]] не виден в forward — он живёт в шаге [[optimizer|оптимизатора]].`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d12-t1',
			difficulty: 'base',
			prompt: String.raw`При [[dropout|dropout]] с $p=0.2$ на train оставшиеся активации делят на $1-p$. Зачем нужно это масштабирование и что было бы, если его убрать, оставив eval без dropout?`,
			hint: String.raw`Сравни *ожидаемую* сумму активаций на train и на eval. На eval зануления нет.`,
			solution: String.raw`Без масштаба на train в среднем «выживает» доля $1-p=0.8$ активаций, поэтому их суммарная величина в среднем в $0.8$ раза меньше, чем на eval (где dropout выключен и проходят все). Следующий слой увидел бы на train и eval входы разного масштаба — рассогласование. Деление на $1-p$ ([[inverted-dropout|inverted dropout]]) поднимает оставшиеся активации так, что *ожидание* совпадает с eval, и переключение режима не сдвигает масштаб. Без него предсказания на eval были бы систематически завышены примерно в $1/(1-p)$ раз.`,
			answer: String.raw`Чтобы ожидание активаций совпадало с eval; иначе train и eval идут в разном масштабе.`,
			xp: 12
		},
		{
			id: 'pt-d12-t2',
			difficulty: 'base',
			prompt: String.raw`Чем поведение [[batchnorm1d|BatchNorm]] на **model.train()** отличается от **model.eval()**? Почему забыть **eval()** перед инференсом одного объекта — это баг?`,
			hint: String.raw`Откуда берутся среднее и дисперсия в каждом режиме?`,
			solution: String.raw`На train BatchNorm нормирует по среднему и дисперсии **текущего [[batch|батча]]** (по оси $N$) и обновляет скользящие **running_mean/running_var**. На eval он использует именно эти накопленные статистики, а не батч. Если оставить train-режим на инференсе, нормировка будет считаться по случайному составу батча: для одного объекта дисперсия батча вырождена/шумна, предсказание поплывёт и станет невоспроизводимым (зависящим от соседей). Поэтому перед инференсом обязателен **model.eval()**.`,
			answer: String.raw`train — статистики батча (+ обновление running); eval — накопленные running. Без eval нормировка зависит от случайного батча.`,
			xp: 12
		},
		{
			id: 'pt-d12-t3',
			difficulty: 'star',
			prompt: String.raw`Что технически делает **weight_decay=1e-4** в **optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)**? Запишите, как меняется правило обновления веса, и объясните, как это снижает [[overfitting|переобучение]]. Чем тут отличается **AdamW**?`,
			hint: String.raw`weight_decay — это [[l2-shtraf|$L_2$]]-штраф; посмотри, какое слагаемое он добавляет к градиенту.`,
			solution: String.raw`[[weight-decay|weight_decay]] добавляет к функции потерь штраф $\lambda\|w\|^2$, что эквивалентно добавлению $2\lambda w$ к [[gradient|градиенту]]. Правило обновления превращается в $w \leftarrow w - \eta(\nabla_w L + 2\lambda w)$: на каждом шаге вес дополнительно «усыхает» к нулю. Меньшие по модулю веса дают более гладкую функцию, менее чувствительную к шуму трейна, — отсюда меньше [[overfitting|переобучения]]. В классическом Adam это decay смешивается с адаптивным масштабированием шага (делится на накопленный квадрат градиента), что искажает регуляризацию; **AdamW** применяет decay *отдельно* от адаптивного шага — $w \leftarrow w - \eta\,\hat g - \eta\lambda w$, — поэтому для Adam-семейства обычно предпочитают именно AdamW.`,
			answer: String.raw`Добавляет $2\lambda w$ к градиенту ($w\leftarrow w-\eta(\nabla L+2\lambda w)$) — веса тянутся к нулю; AdamW отделяет decay от адаптивного шага.`,
			xp: 25
		}
	],
	mastery: [
		'Объясняю dropout через маску Бернулли и масштаб 1/(1−p), различаю train и eval',
		'Понимаю, что BatchNorm на train считает статистики батча, а на eval — накопленные running',
		'Знаю, что weight_decay — это L2-штраф в оптимизаторе, и как он меняет шаг обновления',
		'Ставлю слои в порядке Linear→BN→ReLU→Dropout и переключаю model.train()/eval()'
	]
};
