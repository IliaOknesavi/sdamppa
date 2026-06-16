import type { Day } from '$lib/types';

// День 3. Конвенции (как в эталоне day01.ts):
//  • Все текстовые поля и поля кода — String.raw (LaTeX-бэкслеши и \n целы).
//  • Инлайн-идентификаторы кода — **жирным** (бэктики ломают String.raw).
//  • Живой numpy-код: language: 'python' — реально запускается в Pyodide.
//  • Настоящий torch: language: 'text', colab: true — read-only + кнопка Colab.
//  • Термины [[id]] / [[id|подпись]] — из базового глоссария или dayNN.terms.ts.

export const day03: Day = {
	n: 3,
	phaseId: 'tensors',
	title: 'numpy-мост, копии и память',
	chapterRef: 'pt-03',
	est: '1–2 ч',
	goal: String.raw`Понять, когда тензоры [[shared-memory|делят память]], что такое [[contiguous|непрерывность]] и [[strides|шаги]], и как осознанно копировать через [[clone-tensor|clone]] и [[detach|detach]], не порвав и не удержав лишний [[vychislitelnyy-graf|граф]].`,
	sections: [
		{
			kind: 'definition',
			heading: 'Один буфер — два имени: общая память',
			body: String.raw`Тензор — это не сам массив чисел, а *описание* того, как читать кусок памяти: указатель на буфер, [[shape-forma|форма]] и [[strides|шаги]]. Поэтому два тензора легко [[shared-memory|делят один буфер]]: меняешь элемент через один — видишь изменение через другой.

Самый частый случай — [[tensor-numpy-most|мост torch ↔ numpy]]. На CPU **torch.from_numpy(a)** и **t.numpy()** **не копируют** данные: они оборачивают тот же буфер. Это бесплатно и быстро, но коварно — случайная запись «в numpy» молча портит тензор (и наоборот).

Начнём с numpy, где это [[shared-memory|поведение памяти]] видно как на ладони: **np.shares_memory** прямо отвечает, общий ли буфер у двух массивов.`,
			code: {
				title: 'Общая память: вид меняет оригинал (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

a = np.array([1.0, 2.0, 3.0, 4.0])
b = a[1:3]                 # срез — это ВИД, делит память с a
print("shares_memory(a, b):", np.shares_memory(a, b))

b[:] = 0                   # пишем в вид — оригинал тоже меняется
print("a после b[:]=0:", a)

c = a.copy()               # .copy() — независимый буфер
c[:] = 99
print("a после c[:]=99:", a)
print("shares_memory(a, c):", np.shares_memory(a, c))`,
				explanation: String.raw`Срез **a[1:3]** — это [[view-vs-copy|вид]], а не копия: запись **b[:] = 0** меняет и **a**. А **a.copy()** даёт отдельный буфер — оригинал цел. В PyTorch ровно так же: **t[1:3]**, **t.view(...)**, **torch.from_numpy(a)** дают [[shared-memory|общую память]], а **t.clone()** — отдельную.`
			}
		},
		{
			kind: 'definition',
			heading: 'Шаги (strides) и непрерывность (contiguous)',
			body: String.raw`Чтобы по 1-мерному буферу ходить как по $n$-мерному тензору, нужны [[strides|шаги]] — на сколько байт прыгнуть, чтобы сдвинуться на $+1$ по каждой оси. Тензор называют [[contiguous|contiguous]] (непрерывным в C-порядке), когда его элементы лежат в памяти ряд за рядом, без «дыр» — именно так, как их раскладывает свежий **reshape**.

Фокус в том, что многие операции **не трогают буфер**, а лишь меняют [[shape-forma|форму]] и [[strides|шаги]] поверх него. Транспонирование $T$ просто переставляет шаги местами — данные не двигаются, но порядок обхода больше не совпадает с памятью. Такой тензор перестаёт быть [[contiguous|непрерывным]].`,
			code: {
				title: 'strides и contiguous руками (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

m = np.arange(12).reshape(3, 4)
print("shape:", m.shape, "strides (байты):", m.strides)

t = m.T                    # транспонирование: только переставило strides
print("m.T shape:", t.shape, "strides:", t.strides)
print("m   contiguous:", m.flags["C_CONTIGUOUS"])
print("m.T contiguous:", t.flags["C_CONTIGUOUS"])

# элемент [1,2] находится по смещению (в элементах):
i, j = 1, 2
off = i * (m.strides[0] // m.itemsize) + j * (m.strides[1] // m.itemsize)
print("m[1,2] =", m[i, j], "| по адресу off =", off, "->", m.ravel()[off])`,
				explanation: String.raw`У непрерывной матрицы $3\times4$ [[strides|шаги]] $(32,8)$ байт: строка длиной 4 элемента по 8 байт. После **.T** шаги меняются местами — буфер тот же, а **C_CONTIGUOUS** становится **False**. Адрес элемента — это просто скалярное произведение индексов на шаги. В torch у тензора те же **.stride()** и **.is_contiguous()**.`
			}
		},
		{
			kind: 'note',
			heading: 'Почему .view() иногда падает, а .reshape() — нет',
			body: String.raw`**view** обещает *вид без копии*. Но «другой вид» на тот же буфер существует не всегда: если порядок обхода после смены [[shape-forma|формы]] нельзя выразить набором [[strides|шагов]] над текущей памятью, копировать всё равно придётся — а **view** копировать не умеет и поэтому бросает ошибку.

Классическая ловушка: транспонировали тензор (он стал не-[[contiguous|contiguous]]) и зовём **.view(-1)** — получаем *RuntimeError: view size is not compatible…*. Два честных выхода: позвать **.contiguous()** (один раз скопирует данные в непрерывный буфер, дальше **view** сработает) — или сразу **.reshape()**, который сам решит: вернуть [[view-vs-copy|вид]], если можно, иначе тихо скопировать.`,
			code: {
				title: 'reshape: иногда вид, иногда копия (numpy)',
				language: 'python',
				code: String.raw`import numpy as np

m = np.arange(12).reshape(3, 4)
t = m.T                          # не-contiguous

r1 = m.reshape(4, 3)             # совместимо с памятью -> ВИД
print("reshape m -> вид?  ", np.shares_memory(m, r1))

r2 = t.reshape(12)               # из не-contiguous -> КОПИЯ
print("reshape m.T -> копия?", not np.shares_memory(t, r2))

tc = np.ascontiguousarray(t)     # явная непрерывная копия
print("ascontiguous shares?:", np.shares_memory(t, tc))`,
				explanation: String.raw`**reshape** возвращает [[view-vs-copy|вид]], когда новая форма ложится на текущие [[strides|шаги]] (первый случай), и молча копирует, когда нет (второй). В torch это и есть разница: **view** в «копирующем» случае *падает*, а **reshape** — спокойно копирует. **np.ascontiguousarray** — numpy-аналог **.contiguous()**.`
			}
		},
		{
			kind: 'intuition',
			heading: 'clone против detach: память и граф — две разные оси',
			body: String.raw`Новичок путает **clone** и **detach**, потому что обе «как будто делают копию». На деле они управляют *разными* вещами:

- [[clone-tensor|clone]] — про **память**: делает новый независимый буфер с теми же числами. Но остаётся в [[vychislitelnyy-graf|графе]] — градиент через копию дотечёт обратно до оригинала. Это «копия данных, граф сохранён».
- [[detach|detach]] — про **граф**: возвращает тензор, *делящий память* с оригиналом, но [[requires-grad|отрезанный]] от истории операций ([[autograd|autograd]] на него не смотрит). Это «тот же буфер, граф обрублен».

Отсюда рецепты. Нужна правка данных без сюрпризов и без поломки обучения — **x.clone()**. Нужно вытащить число для лога/метрики, чтобы не тянуть [[vychislitelnyy-graf|граф]] в памяти и не считать по нему градиент, — **x.detach()** (а для скаляра ещё короче — [[item-skalyar|.item()]]). Нужно и то и другое сразу (безопасный снимок без графа) — канон **x.detach().clone()**.`
		},
		{
			kind: 'connection',
			heading: 'Всё вместе на настоящем torch',
			body: String.raw`Соберём день в одном идиоматичном сниппете PyTorch: общая память через [[tensor-numpy-most|from_numpy]], падение **.view()** на не-[[contiguous|contiguous]] тензоре и спасение через **.reshape()** / **.contiguous()**, а также разница [[clone-tensor|clone]] и [[detach|detach]] на тензоре с [[requires-grad|requires_grad]]. В браузере torch не запустится — открой в Colab.`,
			code: {
				title: 'Память, contiguous, clone/detach (открой в Colab)',
				language: 'text',
				colab: true,
				code: String.raw`import torch
import numpy as np

# 1) from_numpy делит память с numpy-массивом (на CPU)
a = np.array([1.0, 2.0, 3.0])
t = torch.from_numpy(a)
a[0] = 100.0
print("общая память:", t)          # tensor([100.,  2.,  3.])

# 2) транспонирование -> не-contiguous -> .view() падает
m = torch.arange(12).reshape(3, 4)
mt = m.t()
print("contiguous?", mt.is_contiguous(), "| strides:", mt.stride())
# mt.view(-1)                       # RuntimeError: not compatible
print("reshape ок:", mt.reshape(-1).shape)        # reshape копирует
print("contiguous().view ок:", mt.contiguous().view(-1).shape)

# 3) clone (копия данных, граф жив) vs detach (та же память, граф обрублен)
x = torch.tensor([1.0, 2.0, 3.0], requires_grad=True)
c = x.clone()                       # requires_grad=True, отдельный буфер
d = x.detach()                      # requires_grad=False, общий буфер
print("clone.requires_grad:", c.requires_grad)
print("detach.requires_grad:", d.requires_grad)
print("detach делит память:", d.data_ptr() == x.data_ptr())`,
				explanation: String.raw`Строка 1 — [[shared-memory|общий буфер]] с numpy. Блок 2 — **.t()** делает тензор не-[[contiguous|contiguous]], поэтому **.view(-1)** бросил бы ошибку, а **.reshape(-1)** и **.contiguous().view(-1)** работают. Блок 3 — [[clone-tensor|clone]] сохраняет [[requires-grad|requires_grad]] и копирует данные, [[detach|detach]] сбрасывает grad и делит память (**data_ptr** совпадает). Снимок «без графа и без общей памяти» — **x.detach().clone()**.`
			}
		}
	],
	tasks: [
		{
			id: 'pt-d3-t1',
			difficulty: 'base',
			prompt: String.raw`Ты сделал **t = torch.from_numpy(a)** из numpy-массива **a**, а затем выполнил **a += 1**. Что станет с тензором **t** и почему? Как сделать так, чтобы **t** *не* зависел от дальнейших правок **a**?`,
			hint: String.raw`На CPU [[tensor-numpy-most|from_numpy]] не копирует данные — буфер общий. **np.shares_memory(a, t.numpy())** вернул бы True.`,
			solution: String.raw`**from_numpy** на CPU оборачивает *тот же* буфер, не копируя его, поэтому **a** и **t** [[shared-memory|делят память]]. Операция **a += 1** пишет на месте (in-place) в общий буфер — значит **t** тоже увеличится на 1. Чтобы оторвать тензор от массива, нужна явная копия данных: **t = torch.from_numpy(a).clone()** (или **t = torch.tensor(a)** — конструктор **torch.tensor** копирует). Тогда последующие правки **a** на **t** не влияют.`,
			answer: String.raw`**t** тоже вырастет на 1 (общая память); оторвать — **.clone()** или **torch.tensor(a)**.`,
			xp: 12
		},
		{
			id: 'pt-d3-t2',
			difficulty: 'base',
			prompt: String.raw`Тензор **x** формы $(3,4)$. Делаем **y = x.t()** и хотим вытянуть его в вектор. Почему **y.view(-1)** падает, а **y.reshape(-1)** — нет? Чем тогда полезен **y.contiguous()**?`,
			hint: String.raw`Транспонирование меняет только [[strides|шаги]], а не буфер. **view** не умеет копировать, **reshape** — умеет.`,
			solution: String.raw`**x.t()** не двигает данные, а лишь переставляет [[strides|шаги]], поэтому **y** становится не-[[contiguous|contiguous]]: его элементы в памяти идут не подряд в нужном порядке. Чтобы развернуть в $(12,)$, надо обойти буфер в порядке, который над текущими шагами не выражается, — нужна копия. **view** обещает вид без копии и потому *бросает RuntimeError*. **reshape** в таком случае сам копирует и возвращает результат. **y.contiguous()** один раз пересобирает данные в непрерывный буфер — после него **y.contiguous().view(-1)** уже законно (и это типичный способ «подготовить» тензор перед серией **view**).`,
			answer: String.raw`**y** не-contiguous: **view** не копирует и падает, **reshape** копирует; **.contiguous()** делает непрерывную копию, после неё **view** работает.`,
			xp: 12
		},
		{
			id: 'pt-d3-t3',
			difficulty: 'star',
			prompt: String.raw`У тензора **x** с **requires_grad=True** сравни три «копии»: **a = x.clone()**, **b = x.detach()**, **c = x.detach().clone()**. Для каждой скажи: делит ли она память с **x**, есть ли у неё [[requires-grad|requires_grad]], и потечёт ли градиент в **x** при [[backward|backward]] через неё. Когда какую выбирать?`,
			hint: String.raw`[[clone-tensor|clone]] про память (отдельный буфер, граф жив), [[detach|detach]] про граф (общий буфер, граф обрублен). Проверка памяти — **data_ptr()**, проверка графа — **requires_grad**.`,
			solution: String.raw`- **a = x.clone()** — *отдельный* буфер (память не делит), **requires_grad=True**, граф жив: операция clone дифференцируема, и [[backward|backward]] через **a** дотечёт градиентом до **x**. Выбираешь, когда надо безопасно *править данные*, не теряя обучаемость.
- **b = x.detach()** — *общий* буфер с **x** (та же память!), **requires_grad=False**, [[autograd|граф обрублен]]: через **b** градиент в **x** не пойдёт. Выбираешь, когда нужно лишь *прочитать* значение без графа (лог, метрика, переход в numpy). Опасность — запись в **b** молча портит **x**, ведь память общая.
- **c = x.detach().clone()** — *отдельный* буфер, **requires_grad=False**, граф обрублен: полностью независимый снимок без истории. Выбираешь, когда нужен *и* отрыв от графа, *и* безопасность правок (сохранить состояние, аугментировать без последствий).

Коротко: **clone** копирует память и хранит граф; **detach** делит память и рвёт граф; их композиция даёт чистый независимый снимок.`,
			answer: String.raw`**clone** — своя память, grad есть, градиент течёт; **detach** — общая память, grad нет, не течёт; **detach().clone()** — своя память, grad нет, не течёт.`,
			xp: 25
		}
	],
	mastery: [
		'Объясняю, когда тензоры делят память (from_numpy, срезы, view) и проверяю это через data_ptr / shares_memory',
		'Понимаю strides и contiguous: почему транспонирование делает тензор не-contiguous, не двигая данные',
		'Знаю, почему .view() падает на не-contiguous, и чиню через .contiguous() или .reshape()',
		'Осознанно выбираю clone (память) vs detach (граф) и их композицию detach().clone()'
	]
};
