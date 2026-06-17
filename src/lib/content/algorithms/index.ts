import type { Subject, Day, Phase, Glossary, LabFile } from '$lib/types';
import { graphs2Theory } from './labs/graphs2';
import { amortTheory } from './labs/amort';
import { dsuTheory } from './labs/dsu';
import { treesTheory } from './labs/trees';
import { maxflowTheory } from './labs/maxflow';
import { greedyTheory } from './labs/greedy';
import { dpTheory } from './labs/dp';
import { semanticTheory } from './labs/semantic';
import { greedyLab } from './labs/greedyLab';
import { dpLab } from './labs/dpLab';
import { dsuLab } from './labs/dsuLab';
import { treesLab } from './labs/treesLab';
import { semanticLab } from './labs/semanticLab';
import { heapsTheory } from './labs/heaps';
import { segmentTheory } from './labs/segment';
import { vebTheory } from './labs/veb';
import { numpyTheory } from './labs/numpy';
import { linprogTheory } from './labs/linprog';
import { geometryTheory } from './labs/geometry';
import { examDays } from './labs/exam';
// реальные переиспользуемые структуры студента из прошлого сема (algo-2025/IliaOknesavi)
import listH from './labs/reused/list.generic.h?raw';
import listC from './labs/reused/list.generic.c?raw';
import vectorH from './labs/reused/vector.generic.h?raw';
import vectorC from './labs/reused/vector.generic.c?raw';
import comparatorsH from './labs/reused/comparators.h?raw';
import hashH from './labs/reused/hashtable.generic.h?raw';
import hashC from './labs/reused/hashtable.generic.c?raw';

// =====================================================================
//  АЛГОРИТМЫ — структура «по лабам»: на каждую лабу блок теории (по
//  лекциям) → блок лабы (настоящие файлы в IDE прямо на странице).
//  Электрик-синий стиль ИИИ применяется автоматически.
//  Эталон — лаба №12 «Графы» (Дейкстра на дорожной сети СПб).
//  Глубокая теория по презентациям и подсказки на коде — следующий шаг.
// =====================================================================

const phases: Phase[] = [
	{ id: 'dp', title: 'Лаба №10 · Динамическое программирование', subtitle: 'рюкзак, LCS, Левенштейн', hue: 0 },
	{ id: 'greedy', title: 'Лаба №11 · Жадные алгоритмы', subtitle: 'activity selection, Хаффман', hue: 0 },
	{ id: 'graphs', title: 'Лаба №12 · Графы', subtitle: 'обходы, Дейкстра, дорожная сеть СПб', hue: 0 },
	{ id: 'maxflow', title: 'Максимальный поток', subtitle: 'Форд–Фалкерсон, Эдмондс–Карп', hue: 0 },
	{ id: 'amort', title: 'Амортизационный анализ', subtitle: 'усреднение, банкир, потенциалы', hue: 0 },
	{ id: 'dsu', title: 'Лаба №13 · СНМ и MST', subtitle: 'union-find, Краскал/Прим', hue: 0 },
	{ id: 'trees', title: 'Лаба №14 · Деревья поиска', subtitle: 'BST, AVL, RB, B-дерево', hue: 0 },
	{ id: 'extra-ds', title: 'Структуры сверх программы', subtitle: 'кучи, дерево отрезков, vEB', hue: 0 },
	{ id: 'semantic', title: 'Лаба №15 · Семантический поиск', subtitle: 'k-d дерево, эмбеддинги (Python)', hue: 0 },
	{ id: 'extra-app', title: 'Прикладные темы', subtitle: 'NumPy, линейное программирование, выч. геометрия', hue: 0 },
	{ id: 'exam', title: 'Экзамен', subtitle: 'карта ответов на 29 вопросов', hue: 0 }
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
		body: String.raw`**Ребро** соединяет две [[vershina|вершины]]. В неориентированном графе — пара $\{u,v\}$, в ориентированном — дуга $(u,v)$. Может иметь **вес** (длина дороги).`,
		related: ['graf', 'vershina']
	},
	'spisok-smezhnosti': {
		id: 'spisok-smezhnosti',
		term: 'Список смежности',
		short: String.raw`Для каждой вершины — список её соседей. Память $O(V+E)$.`,
		body: String.raw`**Список смежности**: для каждой [[vershina|вершины]] хранится список смежных вершин. Память $O(V+E)$ — выгоден для разреженных графов (рёбер мало). Альтернатива — **матрица смежности** $O(V^2)$, удобная для плотных графов и проверки ребра за $O(1)$. Дорожная сеть разрежена → список смежности.`,
		related: ['graf', 'bfs', 'dfs']
	},
	bfs: {
		id: 'bfs',
		term: 'Обход в ширину (BFS)',
		short: String.raw`Обход по слоям через [[ochered|очередь]]; кратчайшие пути по числу рёбер.`,
		formula: String.raw`O(V + E)`,
		body: String.raw`**BFS** обходит граф «по слоям»: сначала стартовая [[vershina|вершина]], затем все её соседи, затем соседи соседей. Использует [[ochered|очередь]] (FIFO). За $O(V+E)$ находит **кратчайшие пути** по числу рёбер. Сравни с [[dfs|обходом в глубину]].`,
		related: ['ochered', 'dfs', 'spisok-smezhnosti']
	},
	dfs: {
		id: 'dfs',
		term: 'Обход в глубину (DFS)',
		short: String.raw`Идёт «вглубь» через [[stek|стек]]; основа для компонент, топосорта, мостов.`,
		formula: String.raw`O(V + E)`,
		body: String.raw`**DFS** идёт как можно «глубже», пока есть непосещённые соседи, затем откатывается. Реализуется [[stek|стеком]] или рекурсией, за $O(V+E)$. Основа для [[svyaznost|компонент связности]], топологической сортировки, мостов. Сравни с [[bfs|BFS]].`,
		related: ['stek', 'bfs', 'svyaznost']
	},
	ochered: {
		id: 'ochered',
		term: 'Очередь (FIFO)',
		short: String.raw`Первым пришёл — первым вышел. Двигатель [[bfs|BFS]].`,
		body: String.raw`**Очередь** — структура «первым вошёл, первым вышел». Добавляем в хвост, берём из головы. Очередь обеспечивает послойный порядок [[bfs|BFS]].`,
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
		body: String.raw`**Компонента связности** — максимальное множество [[vershina|вершин]], попарно достижимых друг из друга. Считается запуском [[dfs|DFS]]/[[bfs|BFS]] из каждой не посещённой вершины.`,
		related: ['dfs', 'bfs', 'graf']
	},
	dijkstra: {
		id: 'dijkstra',
		term: 'Алгоритм Дейкстры',
		short: String.raw`Кратчайшие пути от вершины во взвешенном графе с неотрицательными весами.`,
		formula: String.raw`O((V+E)\log V)`,
		body: String.raw`**Дейкстра** находит кратчайшие пути от старта во взвешенном графе с **неотрицательными** [[rebro|рёбрами]]. Идея: жадно извлекаем ближайшую ещё не зафиксированную [[vershina|вершину]] (через [[kucha|очередь с приоритетом]]) и релаксируем её соседей: $d[v]=\min(d[v],\,d[u]+w(u,v))$. С бинарной кучей — $O((V+E)\log V)$. Именно его ты реализуешь в лабе на дорожной сети СПб.`,
		related: ['graf', 'rebro', 'spisok-smezhnosti', 'kucha']
	},
	dag: {
		id: 'dag',
		term: 'DAG (ориентированный ацикличный)',
		short: String.raw`Ориентированный [[graf|граф]] без циклов — задаёт топологический порядок.`,
		body: String.raw`**DAG** (directed acyclic graph) — [[graf|граф]] с направленными [[rebro|рёбрами]] и **без циклов**. Любой DAG можно выстроить в **топологический порядок**: если есть дуга $u\to v$, то $u$ идёт раньше $v$. Так задают зависимости (сборка, расписание), а сам порядок добывают пост-обходом [[dfs|DFS]]. Наличие обратного ребра при DFS = граф НЕ ацикличен.`,
		related: ['graf', 'dfs', 'rebro']
	},
	plotnost: {
		id: 'plotnost',
		term: 'Плотность графа',
		short: String.raw`Разреженный ($|E|\sim|V|$) против плотного ($|E|\sim|V|^2$) — отсюда выбор хранения.`,
		body: String.raw`**Плотность** — сколько рёбер относительно вершин. **Разреженный**: $|E|=O(V)$ (дорожная сеть) — выгоден [[spisok-smezhnosti|список смежности]] с памятью $O(V+E)$. **Плотный**: $|E|=\Theta(V^2)$ (близко к [[graf|полному]]) — оправдана **матрица смежности** $O(V^2)$ с проверкой ребра за $O(1)$. Выбор представления почти всегда диктует именно плотность.`,
		related: ['spisok-smezhnosti', 'graf', 'rebro']
	},
	kucha: {
		id: 'kucha',
		term: 'Куча / очередь с приоритетом',
		short: String.raw`Бинарная min-куча: вставка и извлечение минимума за $O(\log N)$.`,
		formula: String.raw`O(\log N)`,
		body: String.raw`**Очередь с приоритетом** выдаёт элемент с наименьшим ключом. Классическая реализация — **бинарная куча** (массив-дерево): **insert**, **extract-min** и **decrease-key** за $O(\log N)$, чтение минимума за $O(1)$. Это рабочий инструмент жадных алгоритмов: ближайшая вершина в [[dijkstra|Дейкстре]] и Прима, два минимума при слиянии в кодах Хаффмана. В лабах кучу строят на переиспользуемом векторе.`,
		related: ['dijkstra', 'stek', 'ochered']
	}
};

// --- Реальные файлы лабы №12 (для IDE на странице) -------------------
const labFiles: LabFile[] = [
	{ path: 'lab3/list/generic.h', readonly: true, lang: 'c', content: listH },
	{ path: 'lab3/list/generic.c', readonly: true, lang: 'c', content: listC },
	{ path: 'lab3/vector/generic.h', readonly: true, lang: 'c', content: vectorH },
	{ path: 'lab3/vector/generic.c', readonly: true, lang: 'c', content: vectorC },
	{ path: 'lab3/comparators.h', readonly: true, lang: 'c', content: comparatorsH },
	{ path: 'lab4/hash_table/generic.h', readonly: true, lang: 'c', content: hashH },
	{ path: 'lab4/hash_table/generic.c', readonly: true, lang: 'c', content: hashC },
	{
		path: 'README.md',
		readonly: true,
		content: `# Лабораторная работа №12 — Графы

Цель: реализовать поиск кратчайшего пути в графе на C, разобраться с Дейкстрой
и применить на реальных данных дорожной сети Санкт-Петербурга.

Данные:
  data/nodes.csv — узлы: id, lat, lon
  data/edges.csv — рёбра: from, to, length, oneway, name
  find_ways.py   — принимает два адреса, геокодирует и запускает ваш бинарник.

ЗАДАНИЕ (по этапам):

  1. Спроектировать структуры данных.
     Заготовок нет — это осознанно. Как хранить граф? Узел, ребро?
     ОБЯЗАТЕЛЬНО переиспользовать структуры из прошлых лаб (список, хеш-таблица).
     Свой список специально под задачу не принимается.

  2. Чтение графа из CSV.
     Парсите файлы сами. По node_id — быстрый доступ к узлу и его соседям.

  3. Алгоритм Дейкстры.
     Кратчайший путь между двумя точками. Ближайшие к координатам узлы —
     старт и финиш.

  4. Бинарник с CLI:
     ./path_processor <data_dir> <input> <output>
       data_dir — папка с nodes.csv и edges.csv
       input    — две строки "lat lon"
       output   — путь, по строке на узел: "lat lon"

Формат вывода: разделитель — один пробел, 6 знаков (%.6lf),
UTF-8, перевод строки Unix, без хвостовых пробелов.`
	},
	{
		path: 'graph.h',
		lang: 'c',
		content: String.raw`#ifndef GRAPH_H
#define GRAPH_H

#include "lab3/list/generic.h"
#include "lab4/hash_table/generic.h"

// TODO: объяви структуры Node, Edge, Graph и прототипы:
//   graph_read(dir) -> Graph
//   graph_nearest(g, lat, lon) -> node_id
//   graph_dijkstra(g, src, dst) -> список узлов пути

#endif // GRAPH_H`
	},
	{
		path: 'graph.c',
		lang: 'c',
		content: String.raw`#include <math.h>
#include "graph.h"
#include "lab3/comparators.h"
#include "lab3/list/generic.h"
#include "lab4/hash_table/generic.h"

// Этап 2: чтение nodes.csv / edges.csv в граф (hash_table: id -> node).
// Этап 3: Дейкстра на очереди с приоритетом.
// Этап 4: main(argc, argv) — разбор аргументов, запись пути в output.

int main(int argc, char** argv) {
    // TODO: argv[1]=data_dir, argv[2]=input, argv[3]=output
    (void)argc; (void)argv;
    return 0;
}`
	},
	{
		path: 'Makefile',
		readonly: true,
		content: String.raw`CC = gcc
CFLAGS = -lm
LIBS = lab3/list/generic.c lab3/vector/generic.c lab4/hash_table/generic.c

all: path_processor u_tests

path_processor: graph.c $(LIBS)
	$(CC) graph.c $(LIBS) -o path_processor $(CFLAGS)

test: path_processor
	bash tests/run_tests.sh ./path_processor

clean:
	rm -f path_processor u_tests graph.o`
	},
	{
		path: 'find_ways.py',
		lang: 'python',
		readonly: true,
		content: String.raw`#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["folium", "geopy", "networkx", "osmnx"]
# ///
import folium, logging, argparse, subprocess, csv, os, sys
from pathlib import Path
from geopy.geocoders import Nominatim

# Геокодит два адреса -> две точки -> зовёт ./path_processor ->
# рисует найденный путь на карте (folium). Запускает ВАШ бинарник.`
	},
	{
		path: 'data/nodes.csv',
		readonly: true,
		content: `id,lat,lon
219808,59.895094,30.3314215
219811,59.8993013,30.3374752
219812,59.9017314,30.3395524`
	},
	{
		path: 'data/edges.csv',
		readonly: true,
		content: `from,to,length,oneway,name
219808,2327840,25.051385,False,
219808,389449562,31.209151,True,Лиговский проспект
219811,1832085962,27.905147,False,`
	},
	{
		path: 'tests/01_linear/input.txt',
		readonly: true,
		content: `59.000001 30.000001
59.003999 30.000001`
	},
	{
		path: 'tests/01_linear/nodes.csv',
		readonly: true,
		content: `id,lat,lon
1,59.000000,30.000000
2,59.001000,30.000000
3,59.002000,30.000000
4,59.003000,30.000000`
	},
	{
		path: 'tests/01_linear/edges.csv',
		readonly: true,
		content: `from,to,length,oneway,name
1,2,111.0,False,Test
2,3,111.0,False,Test
3,4,111.0,False,Test`
	}
];

const graphsDays: Day[] = [
	{
		n: 1,
		phaseId: 'graphs',
		kind: 'theory',
		unitLabel: 'Теория',
		title: 'Графы: модель, типы и хранение',
		chapterRef: 'Лекции 1–3',
		est: '30–45 мин',
		goal: String.raw`Обзорно: модель [[graf|графа]], его **типы** на интерактивной галерее, как граф [[spisok-smezhnosti|хранить]] (выбор диктует [[plotnost|плотность]]) и куда двигаться — к обходам и [[dijkstra|Дейкстре]]. Глубокая механика обходов — в следующих разделах фазы.`,
		sections: [
			{
				kind: 'definition',
				heading: 'Что такое граф',
				body: String.raw`[[graf|Граф]] $G=(V,E)$ — это множество [[vershina|вершин]] $V$ и соединяющих их [[rebro|рёбер]] $E$. На этой модели держится половина курса: дороги, сети, зависимости задач. Эта лекция — **обзорная**: какие графы бывают, как их хранить и куда двигаться дальше. Сама механика обходов и [[dijkstra|Дейкстры]] разбирается в следующих разделах фазы.`
			},
			{
				kind: 'intuition',
				heading: 'Типы графов — покрути сам',
				body: String.raw`Переключай тип — один и тот же граф перерисовывается: стрелки у **ориентированного**, веса на рёбрах у **взвешенного**, петля и кратное ребро у **псевдографа**, две доли у **двудольного**, слои у [[dag|DAG]], остов у **дерева**, все пары рёбер у **полного**. Справа — живые свойства (направление, циклы, $|E|$, память), а внизу — почему [[plotnost|плотность]] диктует выбор: [[spisok-smezhnosti|список]] $O(V+E)$ против матрицы $O(V^2)$.`,
				viz: 'graph-types-gallery'
			},
			{
				kind: 'definition',
				heading: 'Дерево как частный случай',
				body: String.raw`**Дерево** — это **связный ациклический** [[graf|граф]] (бывает ориент. и неориент.). *Связный* = путь между каждой парой вершин; *ациклический* = нет циклов и петель. На деревьях держится вся вторая половина курса: [[bfs|BST]], красно-чёрные и B-деревья.`
			},
			{
				kind: 'definition',
				heading: 'Как хранить граф',
				body: String.raw`Три базовых формата: **список смежности** ([[spisok-smezhnosti|adjacency list]], память $O(V+E)$ — для [[plotnost|разреженных]] графов вроде дорожной сети), **матрица смежности** ($O(V^2)$, зато проверка ребра за $O(1)$ — для [[plotnost|плотных]]), **список рёбер** (edge list). Текстовые форматы графов: GraphML, DOT (graphviz), GML.`,
				viz: 'adjacency-list-vs-matrix'
			},
			{
				kind: 'note',
				heading: 'Структуры графа на C — наведи на код',
				body: String.raw`Так граф собирают на C, **переиспользуя вектор из прошлых лаб**. Наведи на подсвеченные токены: голубые — синтаксис C, синие — суть и асимптотика.`,
				annotated: {
					lang: 'c',
					caption: 'узел и граф через переиспользуемый Vector',
					code: String.raw`typedef struct {
    int node_id;          // идентификатор вершины
    Vector* neighbors;    // список смежности: соседи
} Node;

typedef struct {
    Vector* nodes;        // все вершины графа
} Graph;`,
					notes: [
						{
							token: 'typedef struct',
							kind: 'syntax',
							title: 'typedef struct { … } Node;',
							body: 'Объявляет структуру и сразу даёт ей имя-псевдоним (после закрывающей скобки). Благодаря этому дальше пишем просто **Node**, а не **struct Node**.'
						},
						{
							token: 'int node_id',
							kind: 'syntax',
							title: 'Поле структуры',
							body: 'Целочисленный идентификатор вершины. По нему вершину находят в хеш-таблице за O(1).'
						},
						{
							token: 'Vector* neighbors',
							kind: 'concept',
							title: 'Список смежности',
							body: 'Указатель на **динамический массив** (Vector из прошлой лабы — переиспользуем, свой писать нельзя). Хранит соседей вершины. Перебор соседей — за их число.',
							complexity: String.raw`O(\deg v)`
						},
						{
							token: 'Vector* nodes',
							kind: 'concept',
							title: 'Хранилище вершин',
							body: 'Граф — это вектор вершин, у каждой свой список соседей. Суммарная память — линейна по числу вершин и рёбер.',
							complexity: String.raw`O(V + E)`
						}
					]
				}
			},
			{
				kind: 'connection',
				heading: 'Куда дальше: обходы и кратчайшие пути',
				body: String.raw`Механику обходов разбираем подробно в следующих разделах фазы: [[bfs|BFS]] (по слоям через [[ochered|очередь]]) и [[dfs|DFS]] (вглубь через [[stek|стек]]) — оба за $O(V+E)$, с кодом и пошаговой визуализацией. В невзвешенном графе BFS уже даёт кратчайшие пути по числу рёбер; как только у дорог появляется **длина** (вес), нужен [[dijkstra|Дейкстра]] с [[kucha|очередью с приоритетом]]. Это и есть путь к лабе ниже.`
			},
			{
				kind: 'connection',
				heading: 'Что делаешь в лабе',
				body: String.raw`В лабе №12 ниже ты на C: спроектируешь структуры (переиспользуя [[spisok-smezhnosti|список]] и хеш-таблицу из прошлых лаб), прочитаешь дорожную сеть СПб из CSV, реализуешь [[dijkstra|Дейкстру]] и соберёшь бинарник с CLI. Файлы — настоящие, прямо в редакторе.`
			}
		],
		tasks: [],
		mastery: [
			'Различаю типы графов: ор/неор, взвешенный, DAG, дерево, двудольный, плотный/разреженный',
			'Выбираю представление по плотности: список O(V+E) против матрицы O(V²)',
			'Знаю, что обходы и Дейкстра идут дальше в фазе, и зачем там нужна куча'
		]
	},
	{
		n: 2,
		phaseId: 'graphs',
		kind: 'lab',
		unitLabel: 'Лаба',
		title: 'Кратчайший путь (Дейкстра) на дорожной сети СПб',
		est: '4–8 ч',
		goal: String.raw`Реализовать на C поиск кратчайшего пути [[dijkstra|Дейкстрой]] на реальных данных. Этапы: структуры → чтение CSV → Дейкстра → бинарник с CLI. Редактируй файлы прямо здесь.`,
		sections: [
			{
				kind: 'note',
				heading: 'Этап 1 · Структуры данных',
				body: String.raw`Заготовок нет специально. Реши, как хранить [[graf|граф]]: узел (id, lat, lon), [[rebro|ребро]] (to, length, oneway). **Переиспользуй** список и хеш-таблицу из прошлых лаб (свой список под задачу — не примут). Хеш-таблица $id\to$ узел даёт доступ к соседям за $O(1)$.`
			},
			{
				kind: 'note',
				heading: 'Этап 2 · Чтение CSV',
				body: String.raw`Парси **nodes.csv** и **edges.csv** сам. Построй [[spisok-smezhnosti|список смежности]]: для каждого узла — список исходящих рёбер с весами. Учитывай флаг **oneway**.`
			},
			{
				kind: 'note',
				heading: 'Этап 3 · Дейкстра',
				body: String.raw`[[dijkstra|Дейкстра]] от стартового узла до финишного. Ближайшие к входным координатам узлы — старт и финиш (перебор/ближайший). Очередь с приоритетом — на куче (можно на векторе из прошлых лаб). Восстанови путь по массиву предков.`
			},
			{
				kind: 'note',
				heading: 'Этап 4 · Бинарник и формат',
				body: String.raw`**./path_processor <data_dir> <input> <output>**. Вывод — путь по строке на узел: **lat lon**, один пробел, **6 знаков** ($%.6lf$), Unix-перевод строки, без хвостовых пробелов. Прогоняйся на тестах из папки **tests/**.`
			}
		],
		tasks: [],
		mastery: [
			'Граф читается из CSV в переиспользованные структуры из прошлых лаб',
			'Дейкстра возвращает корректный кратчайший путь по длине',
			'Бинарник принимает CLI-аргументы и пишет вывод в требуемом формате',
			'Проходят тесты из tests/'
		],
		lab: { language: 'c', files: labFiles, entry: 'graph.c' }
	}
];

// порядок: теория из лекций → лаба, по фазам; n перенумеровывается сквозно
const rePhase = (ds: Day[], pid: string): Day[] => ds.map((d) => ({ ...d, phaseId: pid }));
const orderedDays: Day[] = [
	// №10 — Динамическое программирование
	...dpTheory,
	dpLab,
	// №11 — Жадные алгоритмы
	...greedyTheory,
	greedyLab,
	// №12 — Графы
	...graphsDays.filter((d) => d.kind === 'theory'),
	...rePhase(graphs2Theory, 'graphs'),
	...graphsDays.filter((d) => d.kind === 'lab'),
	// Максимальный поток (теория, расширяет графы)
	...maxflowTheory,
	// Амортизационный анализ (теория, фундамент для СНМ)
	...amortTheory,
	// №13 — СНМ и MST
	...dsuTheory,
	dsuLab,
	// №14 — Деревья поиска
	...treesTheory,
	treesLab,
	// Структуры сверх программы: кучи, дерево отрезков, vEB
	...heapsTheory,
	...segmentTheory,
	...vebTheory,
	// №15 — Семантический поиск (финальная лаба)
	...semanticTheory,
	semanticLab,
	// Прикладные темы: NumPy, ЛП, вычислительная геометрия
	...numpyTheory,
	...linprogTheory,
	...geometryTheory,
	// Экзаменационные вопросы — карта ответов
	...examDays
].map((d, i) => ({ ...d, n: i + 1 }));

export const algorithms: Subject = {
	id: 'algorithms',
	name: 'Алгоритмы и структуры данных',
	short: 'Алго',
	blurb: String.raw`Курс по лабам: теория из лекций + настоящая лаба прямо на сайте (IDE с реальными файлами) и интерактивные визуализации алгоритмов.`,
	accent: '#0000ff',
	glyph: 'λ',
	courses: [
		{
			semester: 2,
			year: 2026,
			status: 'ready',
			phases,
			days: orderedDays,
			glossary
		}
	]
};
