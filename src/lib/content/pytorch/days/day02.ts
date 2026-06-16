import type { Day } from '$lib/types';

// День 2. Конвенции (как в day01):
//  • Все текстовые поля и поля кода — String.raw.
//  • Инлайн-идентификаторы кода — **жирным**.
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.

export const day02: Day = {
	n: 2,
	phaseId: 'tensors',
	title: 'Операции над тензорами и индексация',
	chapterRef: 'pt-02',
	est: '1–2 ч',
	goal: String.raw`Освоить арифметику [[tenzor|тензоров]]: поэлементные операции и [[broadcasting|broadcasting]], [[matmul|матричное умножение]], [[redukciya|редукции]] **sum/mean/max/argmax** по [[keepdim|осям]] и [[indeksaciya-sloy|индексацию со срезами и масками]]. Понять, чем [[in-place-op|in-place]]-операции опасны для [[autograd|autograd]].`,
	sections: [
		{
			kind: 'definition',
			heading: 'Поэлементная арифметика и broadcasting',
			body: String.raw`Базовые операции **+ − * /** над тензорами — **поэлементные**: применяются к каждой паре соответствующих чисел. Если формы не совпадают, включается [[broadcasting|broadcasting]] и «растягивает» оси размера 1. Сюда же относятся **torch.exp**, **torch.sqrt**, **torch.clamp** и т. п. — все они работают элемент за элементом.

Ключевое: **поэлементное умножение** $A * B$ (произведение Адамара) — это НЕ [[matmul|матричное умножение]]. **a * b** перемножает числа на одинаковых позициях; **a @ b** считает скалярные произведения строк на столбцы. Путаница между ними — классический баг.`,
			code: {
				title: 'Поэлементно vs broadcasting (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

A = np.arange(6).reshape(2, 3)   # (2, 3)
B = np.ones((2, 3)) * 10         # (2, 3)

print("A * B (поэлементно):\n", A * B)

# broadcasting: (2,3) и (3,) — вектор растянется на строки
row = np.array([1, 2, 3])
print("A * row:\n", A * row)

# broadcasting: (2,3) и (2,1) — столбец растянется на столбцы
col = np.array([[100], [200]])
print("A + col:\n", A + col)`,
				explanation: String.raw`Поэлементная операция требует совместимых [[shape-forma|форм]] — либо равных, либо растягиваемых по [[broadcasting|broadcasting]]. Всегда держи в голове итоговый shape: $(2,3)*(3,)\to(2,3)$, $(2,3)+(2,1)\to(2,3)$. В torch правило ровно то же.`
			}
		},
		{
			kind: 'theorem',
			heading: 'Матричное умножение: @ и matmul',
			body: String.raw`[[matmul|Матричное умножение]] **A @ B** (оно же **torch.matmul(A, B)**) — основа любого линейного слоя. Для матриц $(m,k)\times(k,n)\to(m,n)$: **внутренние** размеры должны совпасть ($k=k$), а **внешние** дают форму результата.

Правило формы — главный навык отладки сетей:
$$(m,k)\,@\,(k,n) = (m,n).$$

**matmul** умеет работать и с батчами: ведущие оси броадкастятся, а перемножаются две последние. Например $(N,m,k)\,@\,(N,k,n)\to(N,m,n)$ — это батч из $N$ независимых матричных умножений.`,
			code: {
				title: 'matmul против поэлементного умножения (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

A = np.arange(6).reshape(2, 3)   # (2, 3)
B = np.arange(6).reshape(3, 2)   # (3, 2)

# (2,3) @ (3,2) -> (2,2): внутренние 3 совпали
print("A @ B shape:", (A @ B).shape)
print(A @ B)

# поэлементное * требует совпадения форм -> здесь упало бы.
C = np.ones((2, 3))
print("A * C shape:", (A * C).shape)   # (2, 3), это другое!

# батч matmul: (4,2,3) @ (4,3,2) -> (4,2,2)
bA = np.ones((4, 2, 3)); bB = np.ones((4, 3, 2))
print("батч:", np.matmul(bA, bB).shape)`,
				explanation: String.raw`Запусти и сверь формы. **@** склеивает по внутренней оси (тут $3$), оставляя внешние $(2,2)$; **\*** перемножает поэлементно и сохраняет общую форму. Перепутать их — значит получить либо ошибку формы, либо тихо неверный результат.`
			}
		},
		{
			kind: 'definition',
			heading: 'Редукции по осям: dim и keepdim',
			body: String.raw`[[redukciya|Редукция]] схлопывает тензор в меньший: **sum**, **mean**, **max**, **min**, **argmax**. Без аргументов считают по всему тензору, с **dim=** — вдоль указанной оси, и эта ось **исчезает** из формы.

Два момента, которые путают всех:

- ось, по которой редуцируешь, пропадает: **x.sum(dim=0)** для $(N,C)$ даёт $(C,)$ — суммируем «через строки»;
- [[keepdim|keepdim=True]] сохраняет ось как размер 1: $(N,C)\to(N,1)$. Это удобно, чтобы результат потом сразу подходил под [[broadcasting|broadcasting]] (например, поделить строки на их суммы).

**argmax** возвращает не значение, а **индекс** максимума вдоль оси — основа предсказания класса по логитам.`,
			code: {
				title: 'Редукции по axis и keepdims (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

x = np.array([[1.0, 5.0, 2.0],
              [4.0, 0.0, 9.0]])   # (2, 3)

print("sum по всему:", x.sum())
print("sum dim=0 (через строки):", x.sum(axis=0), "-> форма", x.sum(axis=0).shape)
print("sum dim=1 (через столбцы):", x.sum(axis=1), "-> форма", x.sum(axis=1).shape)

# keepdims=True: ось остаётся размером 1 -> удобно для broadcasting
row_sum = x.sum(axis=1, keepdims=True)   # (2, 1)
print("нормировка строк:\n", x / row_sum)

# argmax: индекс максимума вдоль оси (предсказанный класс)
print("argmax dim=1:", x.argmax(axis=1))`,
				explanation: String.raw`Ось из **axis=** исчезает: $(2,3)$ при **axis=1** даёт $(2,)$. С **keepdims=True** остаётся $(2,1)$ — и деление **x / row_sum** срабатывает по [[broadcasting|broadcasting]] без ручного **reshape**. В torch это **dim=** и **keepdim=** — те же имена, тот же смысл.`
			}
		},
		{
			kind: 'definition',
			heading: 'Индексация, срезы и булева маска',
			body: String.raw`[[indeksaciya-sloy|Индексация]] в тензорах — как в numpy. **x[0]** берёт строку, **x[:, 1]** — столбец, **x[1:, ::2]** — срез с шагом. Целочисленная («фэнси») индексация **x** списком **[0, 2]** выбирает строки 0 и 2 в заданном порядке.

Особенно важна **булева маска**: **x[x > 0]** возвращает плоский тензор всех элементов, прошедших условие. В PyTorch есть явный аналог — **torch.masked_select(x, mask)**. Маски — это то, как выражают «возьми только положительные», «обнули паддинги», «отбери примеры класса 1» без единого цикла.

Для выбора по индексам вдоль оси есть [[redukciya|gather]]: **torch.gather(x, dim, idx)** собирает элементы по индексной таблице — типичный приём, чтобы достать логит правильного класса для каждого примера батча.`,
			code: {
				title: 'Срезы, булева маска, фэнси-индексация (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

x = np.arange(12).reshape(3, 4)
print("x:\n", x)

print("строка 0:", x[0])          # (4,)
print("столбец 1:", x[:, 1])      # (3,)
print("срез x[1:, ::2]:\n", x[1:, ::2])

# булева маска: плоский тензор подходящих элементов
mask = x % 2 == 0
print("чётные:", x[mask])

# фэнси-индексация: строки в заданном порядке
print("строки [2,0]:\n", x[[2, 0]])

# argmax по оси -> «предсказанные классы» для каждой строки
print("argmax по строкам:", x.argmax(axis=1))`,
				explanation: String.raw`Срезы возвращают **вид** (без копии), булева маска и фэнси-индексация — **копию**. Маска **x[mask]** всегда даёт 1D-результат: структура теряется, остаются только прошедшие элементы. В torch — **x[mask]** или **torch.masked_select**.`
			}
		},
		{
			kind: 'note',
			heading: 'In-place операции и autograd',
			body: String.raw`Методы с суффиксом **_** меняют тензор **на месте**, не создавая новый: **x.add_(1)**, **x.mul_(2)**, **x.clamp_(0)**, **x.zero_()**. Они экономят память, но опасны.

Опасность для [[autograd|autograd]]: обратный проход иногда хранит ссылки на *исходные* значения тензора. Если ты затёр их [[in-place-op|in-place]]-операцией, при [[backward|.backward()]] PyTorch бросит **RuntimeError: a leaf Variable that requires grad is being used in an in-place operation** (или про «modified by an inplace operation»). Поэтому над тензорами с [[requires-grad|requires_grad=True]] in-place применяют осторожно, а данные ([[batch|батчи]], буферы) — можно смело.

Правило для старта: пиши обычные **x = x + 1** (новый тензор), а **+=** и суффикс **_** оставь для случаев, где память реально критична и тензор не участвует в графе.`,
			code: {
				title: 'In-place на torch и matmul на устройстве (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch

device = 'cuda' if torch.cuda.is_available() else 'cpu'

A = torch.arange(6.).reshape(2, 3).to(device)   # (2, 3)
B = torch.ones(3, 2, device=device)             # (3, 2)

print("A @ B:", (A @ B).shape)                   # (2, 2)
print("A.sum(dim=1):", A.sum(dim=1))             # ось 1 исчезает -> (2,)
print("A.argmax(dim=1):", A.argmax(dim=1))       # индексы максимумов

# булева маска и masked_select
mask = A > 2
print("A[A > 2]:", A[mask])
print("masked_select:", torch.masked_select(A, mask))

# in-place ломает autograd:
w = torch.randn(3, requires_grad=True)
y = w * 2
# w.add_(1)   # <- раскомментируй: RuntimeError на .backward()
y.sum().backward()
print("grad:", w.grad)`,
				explanation: String.raw`Те же операции, что в numpy-демо, но на настоящем torch и с переносом на [[device|устройство]] через **.to(device)**. Строка **w.add_(1)** закомментирована намеренно: разкомментируй в Colab — и [[backward|.backward()]] упадёт, потому что [[in-place-op|in-place]] затёр значение, нужное [[autograd|autograd]].`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d2-t1',
			difficulty: 'base',
			prompt: String.raw`Тензор **A** имеет [[shape-forma|форму]] $(8,16)$, тензор **B** — форму $(16,4)$. Какой формы будет **A @ B**? А что вернёт поэлементное **A \* B**?`,
			hint: String.raw`Для [[matmul|matmul]] внутренние размеры должны совпасть; внешние дают результат. Поэлементное **\*** требует совместимых по [[broadcasting|broadcasting]] форм.`,
			solution: String.raw`Для **@**: $(8,16)\,@\,(16,4)$ — внутренние $16$ совпадают, внешние дают $(8,4)$. Для поэлементного **A \* B**: формы $(8,16)$ и $(16,4)$ по [[broadcasting|broadcasting]] несовместимы (сравнивая справа: $16$ против $4$ — не равны и ни один не $1$), поэтому **A \* B** упадёт с ошибкой формы.`,
			answer: String.raw`**A @ B** $\to(8,4)$; **A \* B** — ошибка несовпадения форм.`,
			xp: 12
		},
		{
			id: 'pt-d2-t2',
			difficulty: 'base',
			prompt: String.raw`Дан тензор логитов **logits** формы $(N,C)$ — $N$ примеров, $C$ классов. Как одной [[redukciya|редукцией]] получить предсказанный класс для каждого примера? А как получить вектор максимальных логитов формы $(N,1)$, готовый к [[broadcasting|broadcasting]]?`,
			hint: String.raw`Класс — это **индекс** максимума по оси классов. Сохранить ось размера 1 помогает [[keepdim|keepdim=True]].`,
			solution: String.raw`Предсказанный класс — индекс максимума по оси классов: **logits.argmax(dim=1)**, результат формы $(N,)$. Максимальные значения с сохранённой осью: **logits.max(dim=1, keepdim=True).values**, форма $(N,1)$ — её можно сразу вычесть из **logits** по [[broadcasting|broadcasting]] (стабилизация перед [[softmax|softmax]]).`,
			answer: String.raw`Класс: **logits.argmax(dim=1)** $\to(N,)$; максимумы: **logits.max(dim=1, keepdim=True).values** $\to(N,1)$.`,
			xp: 12
		},
		{
			id: 'pt-d2-t3',
			difficulty: 'star',
			prompt: String.raw`Тензор **w** создан с [[requires-grad|requires_grad=True]]; ты вычислил **y = w \* 2** и собрался звать [[backward|.backward()]]. Почему строка **w.add_(1)** между этими шагами почти наверняка вызовет ошибку, а **w = w + 1** — нет? Как переписать код безопасно?`,
			hint: String.raw`[[in-place-op|In-place]]-операция (суффикс **_**) меняет тензор на месте. [[autograd|Autograd]] хранит значения, нужные для обратного прохода.`,
			solution: String.raw`**w.add_(1)** — [[in-place-op|in-place]]: затирает значения **w**, которые [[autograd|autograd]] держит в [[vychislitelnyy-graf|графе]] для вычисления $\partial y/\partial w$. На [[backward|.backward()]] PyTorch обнаружит, что тензор изменён после использования, и бросит RuntimeError. **w = w + 1** создаёт **новый** тензор, исходный остаётся нетронутым — граф цел. Безопасно: либо вообще не трогать **w** до backward, либо работать с копией; модификации делать через переприсваивание (**w = w + 1**), а не суффиксом **_**, для тензоров в графе.`,
			answer: String.raw`In-place затирает значения, нужные autograd → RuntimeError; **w = w + 1** создаёт новый тензор и граф не ломает.`,
			xp: 25
		}
	],
	mastery: [
		'Различаю поэлементное * (Адамара) и матричное @ / matmul, предсказываю форму результата',
		'Делаю редукции sum/mean/max/argmax по нужной оси и понимаю роль keepdim',
		'Индексирую тензоры срезами, булевой маской и фэнси-индексами; знаю masked_select и gather',
		'Объясняю, почему in-place операции (_) опасны для autograd, и пишу безопасный код'
	]
};
