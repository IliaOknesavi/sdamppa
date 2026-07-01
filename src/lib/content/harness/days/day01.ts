import type { Day } from '$lib/types';

export const day01: Day = {
	n: 1,
	phaseId: "start",
	kind: 'theory',
	unitLabel: 'Статья',
	title: "Об этом гайде: источник и лицензия",
	est: '10–20 мин',
	goal: "Русский перевод открытого руководства «Harness Engineering Guide» компании Nexu (лицензия MIT).",
	sections: [
		{
			heading: "Источник и лицензия",
			body: "Это перевод практического руководства **Harness Engineering Guide** — про инженерию агентных **харнессов** (runtime-обёрток, которые превращают языковую модель в агента: исполняют инструменты, ведут память, собирают контекст, держат границы безопасности).\n\n- Оригинал: [github.com/nexu-io/harness-engineering-guide](https://github.com/nexu-io/harness-engineering-guide)\n- Сайт проекта: [harness-guide.com](https://harness-guide.com)\n- Лицензия: **MIT**, © 2026 Nexu\n\nMIT-лицензия разрешает использование, изменение и распространение (в том числе перевод) при условии сохранения уведомления об авторских правах и текста лицензии. Этот перевод распространяется на тех же условиях; авторство гайда принадлежит Nexu."
		}
	],
	tasks: [],
	mastery: []
};
