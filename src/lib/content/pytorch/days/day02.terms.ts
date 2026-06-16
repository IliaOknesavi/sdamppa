import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 2. Базовые (tenzor, broadcasting, autograd…)
// живут в glossary.ts и перекрывают совпадающие id.
export const day02Terms: Glossary = {
	matmul: {
		id: 'matmul',
		term: 'Матричное умножение (@ / matmul)',
		short: String.raw`Скалярные произведения строк на столбцы.`,
		formula: String.raw`(m,k)\,@\,(k,n) = (m,n)`,
		body: String.raw`**Матричное умножение** **A @ B** (она же **torch.matmul**) — основа линейных слоёв. Внутренние размеры должны совпасть, внешние дают [[shape-forma|форму]] результата: $(m,k)\,@\,(k,n)\to(m,n)$. Это НЕ поэлементное **\***: там перемножаются числа на одинаковых позициях. **matmul** умеет батчи — ведущие оси броадкастятся, перемножаются две последние.`,
		related: ['shape-forma', 'tenzor', 'broadcasting']
	},
	redukciya: {
		id: 'redukciya',
		term: 'Редукция (sum/mean/max по dim)',
		short: String.raw`Схлопывание тензора вдоль оси.`,
		body: String.raw`**Редукция** агрегирует элементы [[tenzor|тензора]]: **sum**, **mean**, **max**, **min**, **argmax**. Без аргументов — по всему тензору, с **dim=** — вдоль оси, которая после этого **исчезает** из [[shape-forma|формы]] (если не задан [[keepdim|keepdim]]). Сюда же относят **gather** — выбор элементов по индексной таблице вдоль оси (**torch.gather(x, dim, idx)**).`,
		related: ['keepdim', 'argmax', 'shape-forma']
	},
	keepdim: {
		id: 'keepdim',
		term: 'keepdim',
		short: String.raw`Сохранить редуцированную ось как размер 1.`,
		body: String.raw`**keepdim=True** в [[redukciya|редукции]] оставляет схлопнутую ось в [[shape-forma|форме]] как размер $1$: $(N,C)\to(N,1)$ вместо $(N,)$. Это нужно, чтобы результат сразу подходил под [[broadcasting|broadcasting]] — например, поделить каждую строку на её сумму без ручного **reshape**.`,
		related: ['redukciya', 'broadcasting', 'shape-forma']
	},
	argmax: {
		id: 'argmax',
		term: 'argmax',
		short: String.raw`Индекс максимума вдоль оси.`,
		body: String.raw`**argmax(dim=)** возвращает не значение, а **индекс** максимального элемента вдоль оси. Главное применение — предсказанный класс по логитам: **logits.argmax(dim=1)** для $(N,C)$ даёт $(N,)$ меток. Парный **max(dim=)** отдаёт пару (значения, индексы).`,
		related: ['redukciya', 'softmax']
	},
	'indeksaciya-sloy': {
		id: 'indeksaciya-sloy',
		term: 'Индексация и срезы',
		short: String.raw`Выбор элементов: срезы, маски, фэнси-индексы.`,
		body: String.raw`**Индексация** достаёт части [[tenzor|тензора]]: **x[0]** — строка, **x[:, 1]** — столбец, **x[1:, ::2]** — срез с шагом (возвращает **вид** без копии). **Булева маска** **x[x > 0]** отбирает прошедшие условие элементы в плоский тензор (явно — **torch.masked_select**). **Фэнси-индексация** **x** списком **[2, 0]** выбирает строки 2 и 0 в заданном порядке (копия).`,
		related: ['shape-forma', 'redukciya']
	},
	'in-place-op': {
		id: 'in-place-op',
		term: 'In-place операции (суффикс _)',
		short: String.raw`Меняют тензор на месте, без нового объекта.`,
		body: String.raw`**In-place** операции с суффиксом **_** (**add_**, **mul_**, **clamp_**, **zero_**) меняют [[tenzor|тензор]] на месте, экономя память. Опасны для [[autograd|autograd]]: если затереть значения, нужные обратному проходу, [[backward|.backward()]] бросит RuntimeError. Для тензоров с [[requires-grad|requires_grad=True]] предпочитай обычное **x = x + 1** (новый тензор).`,
		related: ['autograd', 'backward', 'requires-grad']
	}
};
