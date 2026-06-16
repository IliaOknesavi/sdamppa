import type { Phase } from '$lib/types';

// Six phases of the PyTorch track: from the tensor up to production.
export const phases: Phase[] = [
	{ id: 'tensors', title: 'Тензоры', subtitle: 'Базовый объект PyTorch', hue: 18 },
	{ id: 'autograd', title: 'Автоград и обучение', subtitle: 'Градиенты и оптимизация', hue: 38 },
	{ id: 'nn', title: 'Нейросети (nn.Module)', subtitle: 'Слои, потери, оптимизаторы', hue: 210 },
	{ id: 'data', title: 'Данные и тренировка', subtitle: 'Пайплайн и регуляризация', hue: 250 },
	{ id: 'arch', title: 'Архитектуры', subtitle: 'CNN, RNN, трансформеры', hue: 285 },
	{ id: 'prod', title: 'Прод и дальше', subtitle: 'Сохранение, GPU, деплой', hue: 325 }
];
