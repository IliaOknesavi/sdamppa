import type { Subject, Day, Phase, Glossary } from '$lib/types';

// =====================================================================
//  АЛГОРИТМЫ — структура «по лабам»: на каждую лабу блок теории (по
//  лекциям) → блок лабы по этапам (редактор + авто-проверки). Электрик-
//  синий стиль ИИИ применяется автоматически (предмет в направлении aii).
//  Эталон наполнен — лаба «Графы»; остальные лабы — каркас.
// =====================================================================

const phases: Phase[] = [
	{ id: 'graphs', title: 'Лаба · Графы', subtitle: 'представление, обходы, пути', hue: 0 },
	{ id: 'greedy', title: 'Лаба · Жадные алгоритмы', subtitle: 'activity selection, Хаффман', hue: 0 },
	{ id: 'dp', title: 'Лаба · Динамическое программирование', subtitle: 'рюкзак, LCS, Левенштейн', hue: 0 },
	{ id: 'dsu', title: 'Лаба · СНМ и MST', subtitle: 'union-find, Краскал/Прим', hue: 0 },
	{ id: 'trees', title: 'Лаба · Деревья поиска', subtitle: 'BST, AVL, RB, B-дерево', hue: 0 },
	{ id: 'semantic', title: 'Лаба · Семантический поиск', subtitle: 'k-d дерево, эмбеддинги (Python)', hue: 0 }
];

const glossary: Glossary = {
	graf: {
		id: 'graf',
		term: 'Граф',
		short: String.raw`Множество [[vershina|вершин]] и соединяющих их [[rebro|рёбер]]: $G=(V,E)$.`,
		formula: String.raw`G = (V, E)`,
		body: String.raw`**Граф** $G=(V,E)$ — это множество [[vershina|вершин]] $V$ и множество [[rebro|рёбер]] $E\subseteq V\times V$. Бывает **неориентированным** (ребро — пара $\{u,v\}$) и **ориентированным** (дуга $(u,v)$). Базовая модель для дорог, сетей, зависимостей.`,
		related: ['vershina', 'rebro', 'spisok-smezhnosti']
	},
	vershina: {
		id: 'vershina',
		term: 'Вершина',
		short: String.raw`Узел графа ($v\in V$).`,
		body: String.raw`**Вершина** (узел) — элемент множества $V$. **Степень** вершины — число инцидентных ей [[rebro|рёбер]].`,
		related: ['graf', 'rebro']
	},
	rebro: {
		id: 'rebro',
		term: 'Ребро',
		short: String.raw`Связь между двумя вершинами.`,
		body: String.raw`**Ребро** соединяет две [[vershina|вершины]]. В неориентированном графе — пара $\{u,v\}$, в ориентированном — дуга $(u,v)$. Может иметь **вес**.`,
		related: ['graf', 'vershina']
	},
	'spisok-smezhnosti': {
		id: 'spisok-smezhnosti',
		term: 'Список смежности',
		short: String.raw`Для каждой вершины — список её соседей. Память $O(V+E)$.`,
		body: String.raw`**Список смежности**: для каждой [[vershina|вершины]] хранится список смежных вершин. Память $O(V+E)$ — выгоден для разреженных графов (рёбер мало). Альтернатива — **матрица смежности** $O(V^2)$, удобная для плотных графов и проверки ребра за $O(1)$.`,
		related: ['graf', 'bfs', 'dfs']
	},
	bfs: {
		id: 'bfs',
		term: 'Обход в ширину (BFS)',
		short: String.raw`Обход по слоям через [[ochered|очередь]]; даёт кратчайшие пути по числу рёбер.`,
		formula: String.raw`O(V + E)`,
		body: String.raw`**BFS** обходит граф «по слоям»: сначала стартовая [[vershina|вершина]], затем все её соседи, затем соседи соседей. Использует [[ochered|очередь]] (FIFO). За $O(V+E)$ находит **кратчайшие пути** по числу рёбер от старта. Сравни с [[dfs|обходом в глубину]].`,
		related: ['ochered', 'dfs', 'spisok-smezhnosti']
	},
	dfs: {
		id: 'dfs',
		term: 'Обход в глубину (DFS)',
		short: String.raw`Идёт «вглубь» через [[stek|стек]] (или рекурсию); основа для компонент, топосорта, мостов.`,
		formula: String.raw`O(V + E)`,
		body: String.raw`**DFS** идёт как можно «глубже», пока есть непосещённые соседи, затем откатывается. Реализуется [[stek|стеком]] или рекурсией, работает за $O(V+E)$. Основа для поиска компонент связности, топологической сортировки, мостов и точек сочленения. Сравни с [[bfs|BFS]].`,
		related: ['stek', 'bfs', 'svyaznost']
	},
	ochered: {
		id: 'ochered',
		term: 'Очередь (FIFO)',
		short: String.raw`Первым пришёл — первым вышел. Двигатель [[bfs|BFS]].`,
		body: String.raw`**Очередь** — структура «первым вошёл, первым вышел». Добавляем в хвост, берём из головы. Именно очередь обеспечивает послойный порядок [[bfs|BFS]].`,
		related: ['bfs', 'stek']
	},
	stek: {
		id: 'stek',
		term: 'Стек (LIFO)',
		short: String.raw`Последним пришёл — первым вышел. Двигатель [[dfs|DFS]].`,
		body: String.raw`**Стек** — структура «последним вошёл, первым вышел». Явный стек (или стек вызовов при рекурсии) даёт порядок [[dfs|DFS]].`,
		related: ['dfs', 'ochered']
	},
	svyaznost: {
		id: 'svyaznost',
		term: 'Компонента связности',
		short: String.raw`Максимальное множество взаимно достижимых вершин.`,
		body: String.raw`**Компонента связности** — максимальное множество [[vershina|вершин]], попарно достижимых друг из друга. Считается запуском [[dfs|DFS]]/[[bfs|BFS]] из каждой ещё не посещённой вершины — число запусков и есть число компонент.`,
		related: ['dfs', 'bfs', 'graf']
	}
};

// --- Лаба «Графы» — эталон (теория + этапы лабы на C) ----------------
const graphsDays: Day[] = [
	{
		n: 1,
		phaseId: 'graphs',
		kind: 'theory',
		unitLabel: 'Теория',
		title: 'Графы, представление и обходы',
		chapterRef: 'Лекции 1–3',
		est: '40–60 мин',
		goal: String.raw`Понять модель [[graf|графа]], как его [[spisok-smezhnosti|хранить]], и два базовых обхода — [[bfs|в ширину]] и [[dfs|в глубину]] — на интерактивной визуализации.`,
		sections: [
			{
				kind: 'definition',
				heading: 'Что такое граф',
				body: String.raw`[[graf|Граф]] $G=(V,E)$ — [[vershina|вершины]] и [[rebro|рёбра]]. Хранят его обычно [[spisok-smezhnosti|списком смежности]] ($O(V+E)$ памяти, хорош для разреженных графов) или матрицей смежности ($O(V^2)$, проверка ребра за $O(1)$).`
			},
			{
				kind: 'intuition',
				heading: 'BFS и DFS — пощупай',
				body: String.raw`Два обхода отличаются структурой фронтира: [[bfs|BFS]] берёт из [[ochered|очереди]] (по слоям), [[dfs|DFS]] — из [[stek|стека]] (вглубь). Переключи режим и шагай — смотри, как меняется порядок посещения. Оба за $O(V+E)$.`,
				viz: 'graph-traversal'
			},
			{
				kind: 'theorem',
				heading: 'Почему BFS даёт кратчайшие пути',
				body: String.raw`В невзвешенном графе [[bfs|BFS]] посещает вершины в порядке неубывания расстояния от старта (по числу рёбер). Поэтому момент первого попадания вершины в [[ochered|очередь]] фиксирует кратчайшее расстояние до неё. Для взвешенных рёбер это уже не так — там нужен Дейкстра (следующая тема).`
			},
			{
				kind: 'connection',
				heading: 'Куда это ведёт',
				body: String.raw`[[dfs|DFS]] — фундамент для [[svyaznost|компонент связности]], топологической сортировки, поиска мостов. BFS — для кратчайших путей и волнового заполнения. В лабе ниже ты построишь [[spisok-smezhnosti|список смежности]] и реализуешь оба обхода на C.`
			}
		],
		tasks: [],
		mastery: [
			'Объясняю разницу BFS/DFS через очередь vs стек',
			'Знаю сложность O(V+E) и почему BFS даёт кратчайшие пути в невзвешенном графе',
			'Понимаю, когда выгоден список смежности, а когда матрица'
		]
	},
	{
		n: 2,
		phaseId: 'graphs',
		kind: 'lab',
		unitLabel: 'Этап 1',
		title: 'Чтение графа и список смежности',
		est: '20–30 мин',
		goal: String.raw`Считать граф и построить [[spisok-smezhnosti|список смежности]]; вывести степень каждой вершины.`,
		sections: [
			{
				kind: 'note',
				heading: 'Задача этапа',
				body: String.raw`На вход: первая строка — $n$ и $m$ (вершины и рёбра). Далее $m$ строк с парами $u\ v$ (неориентированное ребро, вершины с 0). Построй список смежности и выведи через пробел степень каждой вершины $0..n-1$.`
			}
		],
		tasks: [],
		mastery: ['Список смежности построен за O(V+E)', 'Степени верны для неориентированного графа'],
		lab: {
			language: 'c',
			starter: `#include <stdio.h>

int deg[1000];

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    // TODO: прочитать m рёбер u v и посчитать степени
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        // ...
    }
    for (int i = 0; i < n; i++)
        printf("%d%c", deg[i], i + 1 < n ? ' ' : '\\n');
    return 0;
}`,
			solution: `#include <stdio.h>

int deg[1000];

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        deg[u]++; deg[v]++;
    }
    for (int i = 0; i < n; i++)
        printf("%d%c", deg[i], i + 1 < n ? ' ' : '\\n');
    return 0;
}`,
			tests: [
				{ name: 'треугольник', stdin: '3 3\n0 1\n1 2\n2 0\n', expect: '2 2 2' },
				{ name: 'звезда', stdin: '4 3\n0 1\n0 2\n0 3\n', expect: '3 1 1 1' }
			]
		}
	},
	{
		n: 3,
		phaseId: 'graphs',
		kind: 'lab',
		unitLabel: 'Этап 2',
		title: 'BFS: порядок обхода',
		est: '25–35 мин',
		goal: String.raw`Реализовать [[bfs|обход в ширину]] из вершины 0 и вывести порядок посещения.`,
		sections: [
			{
				kind: 'note',
				heading: 'Задача этапа',
				body: String.raw`Тот же ввод (граф). Запусти [[bfs|BFS]] из вершины 0, соседей перебирай в порядке возрастания номера, выведи порядок посещения вершин через пробел.`
			}
		],
		tasks: [],
		mastery: ['BFS на очереди, без повторных посещений', 'Порядок соответствует слоям'],
		lab: {
			language: 'c',
			starter: `#include <stdio.h>
// граф до 1000 вершин; матрица смежности для простоты
int g[1000][1000], n, m;
int main(void){
    scanf("%d %d",&n,&m);
    for(int i=0;i<m;i++){int u,v;scanf("%d %d",&u,&v);g[u][v]=g[v][u]=1;}
    // TODO: BFS из 0 на очереди, печать порядка посещения
    return 0;
}`,
			solution: `#include <stdio.h>
int g[1000][1000], n, m, vis[1000], q[1000];
int main(void){
    scanf("%d %d",&n,&m);
    for(int i=0;i<m;i++){int u,v;scanf("%d %d",&u,&v);g[u][v]=g[v][u]=1;}
    int head=0,tail=0; q[tail++]=0; vis[0]=1;
    int first=1;
    while(head<tail){
        int u=q[head++];
        printf("%s%d", first?"":" ", u); first=0;
        for(int w=0;w<n;w++) if(g[u][w] && !vis[w]){ vis[w]=1; q[tail++]=w; }
    }
    printf("\\n");
    return 0;
}`,
			tests: [
				{ name: 'путь', stdin: '4 3\n0 1\n1 2\n2 3\n', expect: '0 1 2 3' },
				{ name: 'звезда', stdin: '4 3\n0 1\n0 2\n0 3\n', expect: '0 1 2 3' }
			]
		}
	}
];

// --- остальные лабы — каркас (наполняются дальше) --------------------
const draft = (n: number, phaseId: string, unitLabel: string, title: string, goal: string): Day => ({
	n,
	phaseId,
	unitLabel,
	title,
	est: '—',
	goal,
	sections: [],
	tasks: [],
	mastery: [],
	draft: true
});

const otherDays: Day[] = [
	draft(10, 'greedy', 'Теория', 'Жадные алгоритмы', 'Activity selection, коды Хаффмана, корректность жадного выбора.'),
	draft(11, 'greedy', 'Лаба', 'Жадная лаба', 'Реализация жадных алгоритмов на C.'),
	draft(20, 'dp', 'Теория', 'Динамическое программирование', 'Рюкзак, LCS, расстояние Левенштейна; мемоизация vs табуляция.'),
	draft(21, 'dp', 'Лаба', 'ДП лаба', 'Реализация ДП на C.'),
	draft(30, 'dsu', 'Теория', 'СНМ и минимальное остовное дерево', 'Union-find со сжатием путей; Краскал и Прим.'),
	draft(31, 'dsu', 'Лаба', 'СНМ/MST лаба', 'Реализация union-find и MST на C.'),
	draft(40, 'trees', 'Теория', 'Сбалансированные деревья поиска', 'BST, повороты, AVL, красно-чёрные, B-деревья.'),
	draft(41, 'trees', 'Лаба', 'Деревья лаба', 'Реализация дерева поиска на C.'),
	draft(50, 'semantic', 'Теория', 'Семантический поиск', 'Эмбеддинги, k-d дерево, приближённый поиск ближайших.'),
	draft(51, 'semantic', 'Лаба', 'Семантическая лаба (Python)', 'Реализация поиска на Python.')
];

export const algorithms: Subject = {
	id: 'algorithms',
	name: 'Алгоритмы и структуры данных',
	short: 'Алго',
	blurb: String.raw`Курс по лабам: теория из лекций + лаба по этапам прямо на сайте, с интерактивной визуализацией алгоритмов.`,
	accent: '#0000ff',
	glyph: 'λ',
	courses: [
		{
			semester: 2,
			year: 2026,
			status: 'ready',
			phases,
			days: [...graphsDays, ...otherDays].sort((a, b) => a.n - b.n),
			glossary
		}
	]
};
