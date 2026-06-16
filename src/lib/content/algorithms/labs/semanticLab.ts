import type { Day, LabFile } from '$lib/types';

// =====================================================================
//  Лаба «Семантический поиск (k-d дерево) на Python» (phaseId='semantic').
//  По образцу лабы №12 (Графы): настоящие файлы в IDE на странице, README с
//  этапами, Makefile, tests/. Язык — Python: переиспользуемые C-структуры
//  НЕприменимы; векторы — numpy, узел дерева — @dataclass KDNode.
//  Стартовый kdtree.py — СКЕЛЕТ (сигнатуры + TODO по этапам, заглушки
//  возвращают None/0), реализацию пишет студент.
// =====================================================================

const readme = String.raw`# Лаба — Семантический поиск (k-d дерево) на Python

Цель: своими руками (без FAISS/sklearn для самого индекса) построить
семантический поиск ближайших по смыслу текстов. Текст -> эмбеддинг (вектор),
смысловая близость = геометрическая близость векторов. Индекс — k-d дерево:
вставка точки и запрос k ближайших за O(k * log N) вместо наивного O(N * d).

Файлы:
  kdtree.py        — ВАШ индекс: @dataclass KDNode + class KDTreeIndex
                     (insert / build / knn). Это вы и пишете.
  metrics.py       — меры близости (евклид / косинус), нормализация. Пишете вы.
  linear.py        — линейный baseline O(N*d) для проверки корректности. Вы.
  app.py           — Streamlit-демо: эмбеддинги all-MiniLM-L6-v2, запрос-точка,
                     подсветка соседей, сравнение с линейным поиском.
  tests/test_kdtree.py  — авто-проверки: дерево обязано совпадать с baseline.

ЗАДАНИЕ (по этапам):

  Этап 1 — Проектирование.
     @dataclass KDNode(point, axis, payload, left, right). Меры близости в
     metrics.py: euclidean(a,b), cosine_sim(a,b), normalize(v). Интерфейс
     индекса: index.insert(point, payload) и index.knn(query, k) -> список
     (payload, distance), отсортированный по близости.

  Этап 2 — Построение k-d дерева.
     KDTreeIndex.build(points, payloads): рекурсивно делим множество по
     МЕДИАНЕ вдоль текущей оси; ось циклически по глубине (axis = depth % d).
     Левое поддерево — точки <= медианы по оси, правое — больше. O(N log N).

  Этап 3 — Запрос k ближайших.
     knn(query, k): спускаемся в "свою" ветку по знаку (query[axis] - s).
     Держим k лучших (например max-куча по расстоянию), радиус r = расстояние
     до k-го. Вторую ветку посещаем ТОЛЬКО если |query[axis] - s| <= r
     (иначе за гиперплоскостью не может быть точки ближе r). Среднее O(k*log N).

  Этап 4 — Сравнение и проклятие размерности.
     linear.py: linear_knn(points, query, k) — честный перебор O(N*d), эталон.
     tests/ проверяют, что KDTreeIndex.knn == linear_knn на случайных данных.
     В app.py покажите: при малом d (2-3) дерево отсекает ветки и выигрывает,
     при d ~ 384 (реальные эмбеддинги) отсечения вырождаются (проклятие
     размерности) -> дерево не быстрее перебора, и тут нужны ball tree / ANN.

  Этап 5 — Streamlit-визуализация.
     app.py (streamlit run app.py): корпус коротких фраз -> эмбеддинги моделью
     all-MiniLM-L6-v2 (sentence-transformers), поле ввода запроса, подсветка
     k ближайших соседей; рядом — линейный поиск и таймеры обоих.

Проверка: python -m pytest tests/ (или make test). Все соседи и их порядок
обязаны совпасть с линейным baseline — это критерий корректности дерева.`;

const kdtreeStarter = String.raw`"""k-d дерево как индекс семантического поиска.

Этап 1: @dataclass KDNode + интерфейс index.insert / index.knn.
Этап 2: build() — рекурсивное деление по медиане, ось циклически по глубине.
Этап 3: knn() — спуск в свою ветку, лучший радиус r, отсечение второй ветки.

Заглушки возвращают None/[] — это скелет. Реализацию пишете вы.
"""
from dataclasses import dataclass
from typing import Any, Optional
import numpy as np

from metrics import euclidean


@dataclass
class KDNode:
    point: np.ndarray              # точка-вектор (эмбеддинг) в этом узле
    payload: Any                   # что вернуть пользователю (текст/идентификатор)
    axis: int                      # ось разбиения на этом уровне (depth % d)
    left: Optional["KDNode"] = None
    right: Optional["KDNode"] = None


class KDTreeIndex:
    """Индекс ближайших соседей. d — размерность точек (фиксируется при build)."""

    def __init__(self) -> None:
        self.root: Optional[KDNode] = None
        self.dim: int = 0
        self.size: int = 0

    # --- Этап 2: построение -------------------------------------------------
    def build(self, points: list[np.ndarray], payloads: list[Any]) -> None:
        """Построить сбалансированное дерево из набора точек.

        TODO:
          1) self.dim = len(points[0]); self.size = len(points).
          2) Рекурсивная _build(items, depth):
               axis = depth % self.dim
               отсортировать items по координате axis, взять медиану -> узел,
               слева — items до медианы, справа — после; рекурсия с depth+1.
          3) self.root = _build(list(zip(points, payloads)), 0)
        Сложность: O(N log N).
        """
        # TODO: реализуйте построение
        self.root = None

    # --- Этап 1/2: вставка одной точки -------------------------------------
    def insert(self, point: np.ndarray, payload: Any) -> None:
        """Вставить одну точку (для динамического индекса).

        TODO:
          - если дерево пусто: self.dim = len(point); создать корень (axis=0).
          - иначе спуск: на узле с осью a идём влево, если point[a] <= node.point[a],
            иначе вправо; на пустом потомке создаём KDNode с axis=(a+1)%self.dim.
          - self.size += 1.
        """
        # TODO: реализуйте вставку
        return None

    # --- Этап 3: запрос k ближайших ----------------------------------------
    def knn(self, query: np.ndarray, k: int = 1) -> list[tuple[Any, float]]:
        """Вернуть k ближайших к query: список (payload, distance), по возрастанию.

        TODO:
          - храните k лучших найденных (payload, dist); радиус r = расстояние до
            самого дальнего из k (если набрали меньше k — r = +inf).
          - рекурсия _search(node):
              axis = node.axis; diff = query[axis] - node.point[axis]
              near = left если diff <= 0 иначе right; far = другая ветка
              посчитать dist(query, node.point), обновить набор лучших
              _search(near)
              если |diff| <= r:        # гиперплоскость ближе r -> вторая ветка может содержать соседа
                  _search(far)
          - вернуть лучших, отсортированных по dist.
        Среднее O(k * log N). Используйте metrics.euclidean как расстояние.
        """
        # TODO: реализуйте поиск k ближайших
        return []
`;

const metricsStarter = String.raw`"""Меры близости и нормализация (Этап 1).

Для НОРМАЛИЗОВАННЫХ векторов ранжирование по евклиду и косинусу совпадает:
||a-b||^2 = 2 * (1 - cos(a,b)). Поэтому эмбеддинги нормализуют и часто меряют
близость скалярным произведением.
"""
import numpy as np


def euclidean(a: np.ndarray, b: np.ndarray) -> float:
    """Евклидово расстояние ||a-b||_2. Меньше = ближе. O(d).

    TODO: вернуть np.linalg.norm(a - b) как float.
    """
    # TODO
    return 0.0


def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    """Косинусное сходство a.b / (||a|| ||b||) в [-1, 1]. Больше = ближе. O(d).

    TODO: вернуть np.dot(a, b) / (norm(a) * norm(b)); беречься деления на 0.
    """
    # TODO
    return 0.0


def normalize(v: np.ndarray) -> np.ndarray:
    """Привести вектор к единичной длине (для косинуса как скалярного произв.).

    TODO: n = norm(v); вернуть v если n == 0 иначе v / n.
    """
    # TODO
    return v
`;

const linearStarter = String.raw`"""Линейный baseline поиска ближайших (Этап 4) — эталон корректности.

Честный перебор всех точек: O(N * d) на запрос. Медленно, но ОЧЕВИДНО верно.
Дерево обязано выдавать тех же соседей в том же порядке — это и проверяют тесты.
"""
from typing import Any
import numpy as np

from metrics import euclidean


def linear_knn(
    points: list[np.ndarray],
    payloads: list[Any],
    query: np.ndarray,
    k: int = 1,
) -> list[tuple[Any, float]]:
    """k ближайших перебором: список (payload, distance) по возрастанию dist.

    TODO:
      - посчитать euclidean(query, p) для каждой точки,
      - отсортировать по расстоянию, вернуть первые k как (payload, dist).
    Сложность O(N * d) (+ O(N log N) на сортировку).
    """
    # TODO: реализуйте линейный перебор
    return []
`;

const appStarter = String.raw`"""Streamlit-демо семантического поиска (Этап 5).

Запуск:  streamlit run app.py
Зависимости: streamlit, sentence-transformers, numpy.

Корпус коротких фраз -> эмбеддинги all-MiniLM-L6-v2 -> индекс (ваше k-d дерево).
Вводим запрос, подсвечиваем k ближайших соседей, рядом — линейный поиск и
таймеры обоих (на d=384 дерево не выигрывает — проклятие размерности).
"""
import time
import numpy as np
import streamlit as st

from kdtree import KDTreeIndex
from linear import linear_knn
from metrics import normalize

CORPUS = [
    "купить кроссовки",
    "приобрести кеды",
    "забронировать отель у моря",
    "снять квартиру на выходные",
    "рецепт борща",
    "как сварить суп",
]


@st.cache_resource
def get_model():
    # TODO: from sentence_transformers import SentenceTransformer
    #       return SentenceTransformer("all-MiniLM-L6-v2")
    return None


@st.cache_data
def embed(texts: list[str]) -> np.ndarray:
    """texts -> матрица нормализованных эмбеддингов (N, 384).

    TODO: model.encode(texts); нормализовать каждый вектор (metrics.normalize).
    """
    # TODO
    return np.zeros((len(texts), 384))


def main() -> None:
    st.title("Семантический поиск — k-d дерево vs линейный")
    # TODO:
    #   vectors = embed(CORPUS); построить KDTreeIndex.build(vectors, CORPUS).
    #   query = st.text_input("Запрос"); q = normalize(model.encode([query])[0]).
    #   k = st.slider("k", 1, 5, 3).
    #   замерить time для index.knn(q, k) и linear_knn(...); показать соседей и
    #   таймеры; подсветить совпадение результатов дерева и baseline.
    st.write("TODO: реализуйте демо по шагам выше.")


if __name__ == "__main__":
    main()
`;

const testStarter = String.raw`"""Авто-проверка: k-d дерево обязано совпасть с линейным baseline.

Запуск:  python -m pytest tests/ -q
"""
import numpy as np

from kdtree import KDTreeIndex
from linear import linear_knn


def _random_data(n: int, d: int, seed: int = 0):
    rng = np.random.default_rng(seed)
    points = [rng.standard_normal(d) for _ in range(n)]
    payloads = list(range(n))
    return points, payloads


def test_knn_matches_linear_low_dim():
    points, payloads = _random_data(n=200, d=3, seed=1)
    rng = np.random.default_rng(99)

    tree = KDTreeIndex()
    tree.build(points, payloads)

    for _ in range(20):
        q = rng.standard_normal(3)
        got = [p for p, _d in tree.knn(q, k=5)]
        exp = [p for p, _d in linear_knn(points, payloads, q, k=5)]
        assert got == exp, f"дерево разошлось с baseline: {got} != {exp}"


def test_insert_then_knn():
    points, payloads = _random_data(n=50, d=2, seed=7)
    tree = KDTreeIndex()
    for p, pl in zip(points, payloads):
        tree.insert(p, pl)
    q = np.array([0.0, 0.0])
    got = [p for p, _d in tree.knn(q, k=3)]
    exp = [p for p, _d in linear_knn(points, payloads, q, k=3)]
    assert got == exp
`;

const makefile = String.raw`PY = python

.PHONY: test app clean

test:
	$(PY) -m pytest tests/ -q

app:
	streamlit run app.py

clean:
	rm -rf __pycache__ tests/__pycache__ .pytest_cache
`;

const labFiles: LabFile[] = [
	{ path: 'README.md', readonly: true, content: readme },
	{ path: 'kdtree.py', lang: 'python', content: kdtreeStarter },
	{ path: 'metrics.py', lang: 'python', content: metricsStarter },
	{ path: 'linear.py', lang: 'python', content: linearStarter },
	{ path: 'app.py', lang: 'python', content: appStarter },
	{ path: 'tests/test_kdtree.py', readonly: true, lang: 'python', content: testStarter },
	{ path: 'Makefile', readonly: true, content: makefile }
];

export const semanticLab: Day = {
	n: 0,
	phaseId: 'semantic',
	kind: 'lab',
	unitLabel: 'Лаба',
	title: 'Семантический поиск (k-d дерево) на Python',
	est: '4–8 ч',
	goal: String.raw`Реализовать на Python семантический поиск: текст → эмбеддинг, индекс на [[kucha|k-d дереве]] для $k$ ближайших за $O(k\log N)$ вместо наивного $O(N\cdot d)$. Этапы: проектирование → построение → запрос → сравнение с baseline → Streamlit-демо. Редактируй файлы прямо здесь.`,
	sections: [
		{
			kind: 'note',
			heading: 'Этап 1 · Проектирование',
			body: String.raw`Спроектируй каркас. Узел дерева — **@dataclass KDNode** с полями **point** (вектор-эмбеддинг), **axis** (ось разбиения), **payload** (что вернуть — текст/идентификатор), **left** и **right**. В **metrics.py** — меры близости: **euclidean(a,b)** и **cosine_sim(a,b)**, плюс **normalize(v)**. Для нормализованных векторов ранжирование по евклиду и косинусу совпадает: $\|a-b\|^2 = 2\,(1-\cos(a,b))$. Интерфейс индекса: **index.insert(point, payload)** и **index.knn(query, k)** → список пар (payload, distance) по возрастанию расстояния.`
		},
		{
			kind: 'note',
			heading: 'Этап 2 · Построение k-d дерева',
			body: String.raw`**KDTreeIndex.build(points, payloads)** строит сбалансированное дерево рекурсивно. На каждом уровне выбираем ось **циклически по глубине** ($axis = depth \bmod d$), сортируем точки по этой оси и делим по **медиане**: меньшие — влево, большие — вправо. Медиана как корень поддерева даёт баланс и сложность $O(N\log N)$. Размерность $d$ фиксируется по первой точке.`
		},
		{
			kind: 'note',
			heading: 'Этап 3 · Запрос k ближайших',
			body: String.raw`**knn(query, k)** спускается в «свою» ветку по знаку $query[axis]-s$ (где $s$ — координата узла по оси разбиения). Держим $k$ лучших найденных и радиус $r$ — расстояние до самого дальнего из них (пока набрали меньше $k$, $r=+\infty$). Ключ к логарифму — **отсечение второй ветки**: посещаем её только если $|query[axis]-s|\le r$; иначе за гиперплоскостью не может оказаться точки ближе $r$. Среднее $O(k\log N)$.`
		},
		{
			kind: 'note',
			heading: 'Этап 4 · Сравнение и проклятие размерности',
			body: String.raw`**linear.py**: **linear_knn(...)** — честный перебор всех точек за $O(N\cdot d)$, очевидно корректный эталон. Тесты в **tests/** требуют, чтобы **KDTreeIndex.knn** совпадал с **linear_knn** на случайных данных — это критерий корректности. Демонстрируй **проклятие размерности**: при малом $d$ (2–3) отсечения работают и дерево выигрывает, но при $d\sim 384$ (реальные эмбеддинги) расстояния «слипаются», отсечения вырождаются и дерево не быстрее перебора. Отсюда — **ball tree** (разбиение гиперсферами) и приближённый поиск (**ANN**: FAISS, HNSW).`
		},
		{
			kind: 'note',
			heading: 'Этап 5 · Streamlit-визуализация',
			body: String.raw`**app.py** (**streamlit run app.py**): корпус коротких фраз → эмбеддинги моделью **all-MiniLM-L6-v2** (sentence-transformers, $d=384$) → строим индекс. Поле ввода запроса превращаем в вектор-точку, подсвечиваем $k$ ближайших соседей. Рядом — линейный поиск и **таймеры обоих**, чтобы наглядно увидеть, что на $d=384$ преимущество дерева исчезает. Эмбеддинги нормализуем (**metrics.normalize**), модель — «чёрный ящик».`
		}
	],
	tasks: [],
	mastery: [
		'KDNode и интерфейс index.insert / index.knn спроектированы; меры близости и нормализация в metrics.py',
		'build строит дерево делением по медиане с осью depth % d за O(N log N)',
		'knn отсекает вторую ветку при |q_axis − s| > r и даёт k ближайших за O(k·log N) в среднем',
		'KDTreeIndex.knn совпадает с линейным baseline — проходят тесты из tests/',
		'Понимаю проклятие размерности (d~384) и зачем тогда ball tree / ANN',
		'Streamlit-демо показывает соседей и сравнение таймеров дерева и перебора'
	],
	lab: { language: 'python', files: labFiles, entry: 'kdtree.py' }
};
