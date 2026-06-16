import type { Glossary } from '$lib/types';

// Термины, специфичные для дня 6. Базовые (gradient, mse, autograd, backward,
// requires-grad, zero-grad, learning-rate…) живут в glossary.ts.
export const day06Terms: Glossary = {
	'lineynaya-regressiya': {
		id: 'lineynaya-regressiya',
		term: 'Линейная регрессия',
		short: String.raw`Подгонка прямой y=wx+b под точки.`,
		body: String.raw`**Линейная регрессия** ищет линейную связь $\hat y = w x + b$ между входом и целью, минимизируя [[mse|MSE]] по [[parametr|параметрам]] $w$ (наклон) и $b$ (сдвиг). Простейшая обучаемая модель: ровно один линейный слой без активации. На ней удобно впервые собрать [[training-loop|цикл обучения]] — он дословно переносится на любую нейросеть.`,
		formula: String.raw`\hat y = w x + b`,
		related: ['mse', 'gradient-spusk', 'parametr']
	},
	'mse-gradient': {
		id: 'mse-gradient',
		term: 'Градиент MSE',
		short: String.raw`Производные средней квадратичной ошибки по w и b.`,
		body: String.raw`Для $L=\frac1N\sum_i(w x_i+b-y_i)^2$ градиент по [[parametr|параметрам]] равен $\partial L/\partial w=\frac{2}{N}\sum_i e_i x_i$ и $\partial L/\partial b=\frac{2}{N}\sum_i e_i$, где $e_i=\hat y_i-y_i$ — остаток. Это «учебный сигнал»: на него умножают [[learning-rate|шаг]] и вычитают из весов. В PyTorch его считает [[autograd|autograd]] при [[backward|loss.backward()]] — формулы знать полезно, чтобы понимать, что происходит под капотом.`,
		formula: String.raw`\frac{\partial L}{\partial w}=\frac{2}{N}\sum_i e_i x_i,\quad \frac{\partial L}{\partial b}=\frac{2}{N}\sum_i e_i`,
		related: ['mse', 'gradient', 'backward']
	},
	'ruchnoy-shag': {
		id: 'ruchnoy-shag',
		term: 'Ручной шаг обновления',
		short: String.raw`Самому вычесть lr*grad из весов.`,
		body: String.raw`**Ручной шаг** — это $w \mathrel{-}= \eta\cdot w.\text{grad}$, написанный руками вместо [[optimizer|optimizer.step()]]. На первых регрессиях так пишут специально, чтобы увидеть механику [[gradient-spusk|градиентного спуска]] без «магии». Шаг обязан идти в [[no-grad-shag|torch.no_grad()]], а после него — [[zero-grad|обнуление градиентов]]. Позже эту тройку (шаг + no_grad + zero_grad) полностью берёт на себя [[optimizer|оптимизатор]].`,
		related: ['gradient-spusk', 'no-grad-shag', 'optimizer', 'learning-rate']
	},
	'no-grad-shag': {
		id: 'no-grad-shag',
		term: 'torch.no_grad() вокруг шага',
		short: String.raw`Обновлять веса вне вычислительного графа.`,
		body: String.raw`**with torch.no_grad():** временно отключает запись операций в [[vychislitelnyy-graf|граф]]. Обновление весов $w\leftarrow w-\eta\,w.\text{grad}$ — *не* часть модели, дифференцировать его не нужно; без no_grad PyTorch попытался бы внести присваивание в граф (ошибка in-place над листом и лишняя память). Поэтому [[ruchnoy-shag|ручной шаг]] всегда оборачивают в no_grad — внутри него тензоры с [[requires-grad|requires_grad]] ведут себя как обычные числа.`,
		related: ['ruchnoy-shag', 'vychislitelnyy-graf', 'requires-grad', 'zero-grad']
	},
	'shodimost': {
		id: 'shodimost',
		term: 'Сходимость / расходимость',
		short: String.raw`Падает ли потеря к минимуму или взрывается.`,
		body: String.raw`**Сходимость** — потеря из итерации в итерацию убывает и выходит на плато у минимума: [[learning-rate|шаг]] подобран удачно. **Расходимость** — шаги перелетают минимум, потеря растёт (часто по экспоненте), веса уходят в **inf/nan**: типичный признак слишком большого learning rate. Диагностика по логам: монотонно падающий **loss** — хорошо; растущий или **nan** — уменьшай $\eta$.`,
		related: ['learning-rate', 'gradient-spusk', 'mse']
	},
	'training-loop': {
		id: 'training-loop',
		term: 'Цикл обучения',
		short: String.raw`forward → loss → backward → шаг → zero_grad.`,
		body: String.raw`**Цикл обучения** (training loop) — повторяющийся блок, обучающий любую модель: [[forward|forward]] (предсказание) → [[loss-fn|loss]] → [[backward|backward]] (градиенты) → шаг [[optimizer|оптимизатора]] → [[zero-grad|zero_grad]]. На линейной регрессии его собирают руками; для нейросети с миллионами [[parametr|параметров]] он буквально тот же — меняется лишь модель и [[loss-fn|функция потерь]].`,
		related: ['forward', 'backward', 'optimizer', 'zero-grad']
	},
	'minus-gradient': {
		id: 'minus-gradient',
		term: 'Шаг в минус-градиент',
		short: String.raw`Двигаться против градиента — к минимуму.`,
		body: String.raw`[[gradient|Градиент]] указывает направление наискорейшего *роста* потери, поэтому для *минимизации* шагают в **противоположную** сторону: $w\leftarrow w-\eta\nabla_w L$. Знак минус — суть [[gradient-spusk|градиентного спуска]]. Размер шага задаёт [[learning-rate|learning rate]] $\eta$: слишком большой перелетает минимум ([[shodimost|расходимость]]), слишком малый ползёт.`,
		formula: String.raw`w \leftarrow w - \eta\,\nabla_w L`,
		related: ['gradient', 'gradient-spusk', 'learning-rate']
	}
};
