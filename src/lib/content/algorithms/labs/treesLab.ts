import type { Day, LabFile } from '$lib/types';

// =====================================================================
//  ЛАБА · Деревья поиска на C (phaseId='trees', язык c).
//  IDE-лаба по эталону №12 «Графы»: переиспользуемые C-структуры через
//  ?raw (vector, comparators) + README с этапами + Makefile + скелет
//  студента (сигнатуры + TODO, без решения) + маленькие tests/.
//  Этапы: 1 проектирование (узел key/left/right/parent + color/nil для RB),
//  2 BST (вставка спуском, поиск/min/max/successor, три обхода,
//    удаление через TRANSPLANT — три случая),
//  3 балансировка (повороты O(1) + RB-Insert-Fixup, инвариант h≤2log(n+1)),
//  4* расширение (поле size → OS-Select/OS-Rank, пересчёт при повороте),
//  5 CLI-бинарник + проверка отсортированного inorder и баланса.
// =====================================================================

// Переиспользуемые структуры студента из прошлых лаб (?raw → строки):
import vectorH from './reused/vector.generic.h?raw';
import vectorC from './reused/vector.generic.c?raw';
import comparatorsH from './reused/comparators.h?raw';

// --- README: полная постановка по этапам --------------------------------
const readme = `# Лаба — Деревья поиска на C (BST и красно-чёрное)

Цель: реализовать сбалансированное дерево поиска. База — обычное BST
(вставка/поиск/обходы/удаление), затем — балансировка красно-чёрными
правилами (повороты + RB-Insert-Fixup), чтобы высота держалась
O(log n). Звёздочка — статистика порядка (size → OS-Select / OS-Rank).
Бинарник принимает операции со stdin и печатает результат.

Переиспользуемые структуры (НЕ переписывать, использовать как есть):
  reused/vector/generic.h, generic.c — динамический массив. Нужен как буфер
                                        под inorder и уровневой (BFS) обход.
  reused/comparators.h               — типовые сравнения ключей.

Файл студента: tree.c — пишешь здесь.
Тесты: tests/sorted/ и tests/rank/ — операции + эталонный вывод.

КЛЮЧЕВАЯ ИДЕЯ структуры узла:
  В RB-дереве удобно завести ОДИН общий узел-сторож T->nil (чёрный, без ключа).
  Все «отсутствующие» дети и корня указывают на T->nil вместо NULL — это
  убирает проверки на NULL в поворотах и Fixup. Корень дерева — T->root.

ФОРМАТ ВХОДА (stdin): по одной операции в строке.
  i K     — insert ключа K
  d K     — delete ключа K (если есть)
  f K     — find: печатает 1, если K в дереве, иначе 0
  s       — print: inorder-обход через пробел (должен быть ОТСОРТИРОВАН)
  k R     — (звёздочка) OS-Select: ключ R-й по счёту порядковой статистики (1-based)
  r K     — (звёздочка) OS-Rank: порядковый номер ключа K (1-based)
  h       — печатает высоту дерева (для контроля баланса)

ФОРМАТ ВЫВОДА (stdout):
  Операции f / s / k / r / h печатают строку с результатом.
  i / d ничего не печатают.

ЗАДАНИЕ (по этапам):

  Этап 1 · Проектирование.
    struct Node { int key; struct Node *left, *right, *parent; int color; int size; }.
    color ∈ { RED, BLACK }. struct Tree { Node *root; Node *nil; }. nil —
    общий чёрный сторож; createTree() выделяет nil и ставит root=nil.
    Решаешь сразу: делать RB как базу (рекомендуется) или сперва голый BST,
    потом добавить цвет/баланс. Поля left/right/parent обязательны для
    удаления через TRANSPLANT и для поворотов.

  Этап 2 · BST: вставка, поиск, обходы, удаление.
    bst_insert(T, key)   — спуск от корня: идём влево, если key меньше, иначе
                           вправо, до nil; подвешиваем новый лист, ставим parent.
    bst_find(T, key)     — спуск по тому же правилу, вернуть узел или nil.
    tree_min / tree_max  — крайний левый / крайний правый узел поддерева.
    tree_successor(x)    — следующий по порядку: если есть правый — min правого;
                           иначе поднимаемся, пока идём по правой ветви.
    Три обхода: inorder (даёт ОТСОРТИРОВАННУЮ последовательность!), preorder,
    postorder. Уровневой (BFS) — через очередь на Vector.
    transplant(T, u, v)  — подменяет поддерево u поддеревом v у родителя u.
    bst_delete(T, z)     — ТРИ случая через transplant:
                           (1) нет левого ребёнка → transplant(z, z->right);
                           (2) нет правого → transplant(z, z->left);
                           (3) два ребёнка → y = min(z->right); если y не
                               прямой ребёнок z — сначала вырезать y; затем
                               y занимает место z (перенос left/right/parent).

  Этап 3 · Балансировка (красно-чёрная).
    left_rotate(T, x) / right_rotate(T, x) — локальная перестройка за O(1):
        меняют местами x и одного его ребёнка, аккуратно перевешивая
        parent-указатели; nil-сторож позволяет не проверять NULL.
    rb_insert(T, key)    — обычная BST-вставка, новый узел КРАСНЫЙ, затем
                           rb_insert_fixup для восстановления инвариантов.
    rb_insert_fixup(T,z) — ТРИ случая (симметрично слева/справа), пока
                           родитель z красный: (1) дядя красный → перекрасить
                           родителя/дядю/деда и подняться к деду; (2) z —
                           «внутренний» внук → поворот к случаю 3; (3) z —
                           «внешний» внук → перекрасить и повернуть деда.
                           В конце T->root->color = BLACK.
    ИНВАРИАНТЫ RB: корень чёрный; у красного узла оба ребёнка чёрные; на любом
    пути от узла до листьев одинаковое число чёрных (чёрная высота). Отсюда
    h ≤ 2·log2(n+1) — дерево гарантированно сбалансировано.
    (Альтернатива: AVL по высоте с балансом ∈ {−1,0,+1} и теми же поворотами.)

  Этап 4 · (звёздочка) Статистика порядка.
    Расширяем узел полем size = 1 + size(left) + size(right) (для nil size=0).
    Поддерживаем size при вставке/удалении/повороте. ВАЖНО: при повороте size
    пересчитывается за O(1) — у нового верхнего узла size берётся со старого
    верхнего, у нового нижнего — пересчёт из его детей.
    os_select(T, i)      — i-я по порядку статистика (1-based): на узле x
                           r = size(x->left)+1; если i==r — это x; если i<r —
                           идём влево; иначе ищем (i−r) в правом поддереве.
    os_rank(T, x)        — порядковый номер x: r = size(x->left)+1, затем
                           поднимаемся к корню, прибавляя левые поддеревья на
                           правых шагах.

  Этап 5 · CLI-бинарник.
    main читает операции со stdin (см. формат выше) и печатает результаты.
    Сборка: make → бинарник ./tree. Проверка: make test (сверка с tests/).
    Контроль корректности: вывод s ВСЕГДА отсортирован; h не превышает
    2·log2(n+1) — значит баланс держится.`;

// --- Makefile -----------------------------------------------------------
const makefile = String.raw`CC = gcc
CFLAGS = -O2 -Wall
LIBS = reused/vector/generic.c

all: tree

tree: tree.c $(LIBS)
	$(CC) $(CFLAGS) tree.c $(LIBS) -o tree -lm

test: tree
	@for d in tests/*/ ; do \
		got=$$(./tree < $$d/input.txt); \
		exp=$$(cat $$d/expected.txt); \
		if [ "$$got" = "$$exp" ]; then echo "OK   $$d"; \
		else echo "FAIL $$d: got [$$got], expected [$$exp]"; fi; \
	done

clean:
	rm -f tree`;

// --- Скелет студента: сигнатуры + TODO по этапам, без решения ------------
const starter = String.raw`#include <stdio.h>
#include <stdlib.h>
#include "reused/vector/generic.h"
#include "reused/comparators.h"

/* =====================================================================
 * Этап 1 · Проектирование
 *   Узел: key + left/right/parent (нужны для TRANSPLANT и поворотов),
 *   color (RED/BLACK) для красно-чёрного баланса, size для статистики
 *   порядка (этап 4). nil — общий чёрный узел-сторож вместо NULL.
 * ===================================================================== */

enum { RED = 0, BLACK = 1 };

typedef struct Node {
    int key;
    struct Node *left, *right, *parent;
    int color;   /* RED | BLACK */
    int size;    /* 1 + size(left) + size(right); у nil — 0 (этап 4) */
} Node;

typedef struct {
    Node *root;  /* корень; для пустого дерева == nil */
    Node *nil;   /* общий чёрный сторож (BLACK, size 0) */
} Tree;

/* Создать пустое дерево: выделить nil (BLACK, size=0), root = nil. */
Tree *createTree(void) {
    /* TODO Этап 1: выделить Tree и nil; nil->color=BLACK, nil->size=0,
       nil->left/right/parent = nil; T->root = nil; вернуть T */
    return NULL;
}

/* Создать новый узел-лист с ключом key: красный, дети/родитель = nil, size=1. */
static Node *makeNode(Tree *T, int key) {
    /* TODO Этап 1: malloc узла; key=key; left=right=parent=T->nil;
       color=RED; size=1; вернуть узел */
    (void)T; (void)key;
    return NULL;
}

/* =====================================================================
 * Этап 2 · BST: вставка, поиск, min/max/successor, обходы, удаление
 * ===================================================================== */

/* Спуск-вставка обычного BST (без баланса): новый лист на место nil. */
void bst_insert(Tree *T, int key) {
    /* TODO Этап 2: спускаемся от T->root, выбирая left при key<x->key,
       иначе right, пока не дойдём до T->nil; завести makeNode и подвесить
       его к найденному родителю, проставив parent */
    (void)T; (void)key;
}

/* Поиск узла по ключу: вернуть узел или T->nil, если ключа нет. */
Node *bst_find(Tree *T, int key) {
    /* TODO Этап 2: спуск от корня по тому же правилу, что и вставка */
    (void)T; (void)key;
    return NULL;
}

/* Минимум поддерева x: крайний левый узел. */
Node *tree_min(Tree *T, Node *x) {
    /* TODO Этап 2: идти по x->left, пока не nil */
    (void)T;
    return x;
}

/* Максимум поддерева x: крайний правый узел. */
Node *tree_max(Tree *T, Node *x) {
    /* TODO Этап 2: идти по x->right, пока не nil */
    (void)T;
    return x;
}

/* Следующий по порядку (in-order successor) узел после x. */
Node *tree_successor(Tree *T, Node *x) {
    /* TODO Этап 2: если x->right != nil — tree_min правого поддерева;
       иначе подниматься по parent, пока x — правый ребёнок */
    (void)T;
    return x;
}

/* In-order обход: ключи в ОТСОРТИРОВАННОМ порядке складываем в buf (Vector из int). */
void inorder(Tree *T, Node *x, Vector *buf) {
    /* TODO Этап 2: рекурсия left → добавить x->key в buf → right;
       база рекурсии: x == T->nil */
    (void)T; (void)x; (void)buf;
}

/* Pre-order обход (корень → left → right). */
void preorder(Tree *T, Node *x, Vector *buf) {
    /* TODO Этап 2 */
    (void)T; (void)x; (void)buf;
}

/* Post-order обход (left → right → корень). */
void postorder(Tree *T, Node *x, Vector *buf) {
    /* TODO Этап 2 */
    (void)T; (void)x; (void)buf;
}

/* Подменяет у родителя поддерево u поддеревом v (TRANSPLANT из CLRS). */
void transplant(Tree *T, Node *u, Node *v) {
    /* TODO Этап 2: если u->parent == nil — T->root = v; иначе подставить v
       на ту сторону родителя, где был u; затем v->parent = u->parent */
    (void)T; (void)u; (void)v;
}

/* Удаление узла z из BST через transplant — три случая. */
void bst_delete(Tree *T, Node *z) {
    /* TODO Этап 2:
       (1) z->left == nil  → transplant(T, z, z->right);
       (2) z->right == nil → transplant(T, z, z->left);
       (3) иначе y = tree_min(z->right); если y->parent != z, сначала
           transplant(T, y, y->right) и перевесить y->right; затем
           transplant(T, z, y) и перенести z->left под y.
       В конце free(z). (Для RB сюда добавляется fixup — не обязателен.) */
    (void)T; (void)z;
}

/* =====================================================================
 * Этап 3 · Балансировка (красно-чёрная): повороты + rb_insert_fixup
 * ===================================================================== */

/* Левый поворот вокруг x за O(1) (правый ребёнок y поднимается). */
void left_rotate(Tree *T, Node *x) {
    /* TODO Этап 3: y = x->right; x->right = y->left; если y->left != nil —
       y->left->parent = x; y->parent = x->parent; пере-подвесить y к деду
       (или T->root); y->left = x; x->parent = y.
       (Этап 4: после перевеса пересчитать x->size и y->size.) */
    (void)T; (void)x;
}

/* Правый поворот вокруг x за O(1) (зеркально left_rotate). */
void right_rotate(Tree *T, Node *x) {
    /* TODO Этап 3: зеркальная версия left_rotate (left <-> right) */
    (void)T; (void)x;
}

/* Восстановление красно-чёрных инвариантов после вставки z — три случая. */
void rb_insert_fixup(Tree *T, Node *z) {
    /* TODO Этап 3: пока z->parent->color == RED:
       определить дядю; случай 1 — дядя RED: перекрасить родителя/дядю в BLACK,
       деда в RED, z = дед; случай 2 — z «внутренний»: поворот к случаю 3;
       случай 3 — z «внешний»: перекрасить и повернуть деда.
       После цикла: T->root->color = BLACK. */
    (void)T; (void)z;
}

/* RB-вставка: BST-вставка нового КРАСНОГО узла + rb_insert_fixup. */
void rb_insert(Tree *T, int key) {
    /* TODO Этап 3: спуск как в bst_insert, но запоминать parent; подвесить
       makeNode (он уже RED), затем rb_insert_fixup(T, z).
       (Этап 4: по пути спуска инкрементировать size предков.) */
    (void)T; (void)key;
}

/* Высота дерева от узла x (для контроля баланса, этап 3/5). */
int tree_height(Tree *T, Node *x) {
    /* TODO Этап 3: 0 для nil; иначе 1 + max(height(left), height(right)) */
    (void)T;
    if (x == NULL) return 0;
    return 0;
}

/* =====================================================================
 * Этап 4 · (звёздочка) Статистика порядка: size → OS-Select / OS-Rank
 * ===================================================================== */

/* i-я порядковая статистика (1-based): вернуть узел или nil. */
Node *os_select(Tree *T, Node *x, int i) {
    /* TODO Этап 4: r = x->left->size + 1; если i==r — вернуть x;
       если i<r — спуститься в left; иначе os_select(right, i-r) */
    (void)T; (void)i;
    return x;
}

/* Порядковый номер узла x (1-based). */
int os_rank(Tree *T, Node *x) {
    /* TODO Этап 4: r = x->left->size + 1; подниматься к корню, на правых
       шагах прибавляя (parent->left->size + 1) */
    (void)T; (void)x;
    return 0;
}

/* =====================================================================
 * Этап 5 · CLI-бинарник: операции со stdin
 *   i K | d K | f K | s | k R | r K | h
 * ===================================================================== */

int main(void) {
    Tree *T = createTree();
    if (!T) return 1;

    char op;
    while (scanf(" %c", &op) == 1) {
        int x;
        switch (op) {
            case 'i': /* insert */
                if (scanf("%d", &x) != 1) return 1;
                /* TODO Этап 5: rb_insert(T, x) — или bst_insert на ранних этапах */
                break;
            case 'd': /* delete */
                if (scanf("%d", &x) != 1) return 1;
                /* TODO Этап 5: найти узел bst_find и удалить bst_delete, если найден */
                break;
            case 'f': /* find */
                if (scanf("%d", &x) != 1) return 1;
                /* TODO Этап 5: напечатать 1, если bst_find != nil, иначе 0 */
                printf("0\n");
                break;
            case 's': { /* inorder print (должен быть отсортирован) */
                Vector *buf = createVector(sizeof(int));
                inorder(T, T->root, buf);
                for (size_t k = 0; k < buf->size; k++) {
                    int *p = getVectorItem(buf, k);
                    printf("%d%s", *p, k + 1 < buf->size ? " " : "\n");
                }
                if (buf->size == 0) printf("\n");
                vectorFree(buf);
                break;
            }
            case 'k': /* OS-Select (звёздочка) */
                if (scanf("%d", &x) != 1) return 1;
                /* TODO Этап 4/5: напечатать ключ os_select(T, T->root, x) */
                printf("\n");
                break;
            case 'r': /* OS-Rank (звёздочка) */
                if (scanf("%d", &x) != 1) return 1;
                /* TODO Этап 4/5: напечатать os_rank найденного узла */
                printf("0\n");
                break;
            case 'h': /* высота (контроль баланса) */
                printf("%d\n", tree_height(T, T->root));
                break;
            default:
                break;
        }
    }
    return 0;
}`;

// --- Тесты: маленькие наборы операций + эталонный вывод ------------------
//  sorted: вставляем вперемешку, удаляем один ключ — inorder обязан быть
//          отсортирован, find подтверждает наличие/отсутствие.
//          insert 5 3 8 1 4 7 9 2 ; delete 8 ; find 7 → 1 ; find 8 → 0 ;
//          print → 1 2 3 4 5 7 9
const testSortedInput = `i 5
i 3
i 8
i 1
i 4
i 7
i 9
i 2
d 8
f 7
f 8
s`;
const testSortedExpected = `1
0
1 2 3 4 5 7 9`;

//  rank: статистика порядка (звёздочка). После вставки 10 20 30 40 50:
//        k 1 → 10 (первая статистика), r 30 → 3 (третий по счёту).
const testRankInput = `i 10
i 20
i 30
i 40
i 50
k 1
r 30`;
const testRankExpected = `10
3`;

const files: LabFile[] = [
	{ path: 'reused/vector/generic.h', readonly: true, lang: 'c', content: vectorH },
	{ path: 'reused/vector/generic.c', readonly: true, lang: 'c', content: vectorC },
	{ path: 'reused/comparators.h', readonly: true, lang: 'c', content: comparatorsH },
	{ path: 'README.md', readonly: true, content: readme },
	{ path: 'Makefile', readonly: true, content: makefile },
	{ path: 'tree.c', lang: 'c', content: starter },
	{ path: 'tests/sorted/input.txt', readonly: true, content: testSortedInput },
	{ path: 'tests/sorted/expected.txt', readonly: true, content: testSortedExpected },
	{ path: 'tests/rank/input.txt', readonly: true, content: testRankInput },
	{ path: 'tests/rank/expected.txt', readonly: true, content: testRankExpected }
];

export const treesLab: Day = {
	n: 0,
	phaseId: 'trees',
	kind: 'lab',
	unitLabel: 'Лаба',
	title: 'Деревья поиска на C: BST и красно-чёрное',
	est: '5–8 ч',
	goal: String.raw`Реализовать на C сбалансированное [[bst|дерево поиска]]: база — обычное BST (вставка спуском, поиск, три обхода, удаление через **TRANSPLANT**), затем — красно-чёрный баланс (повороты $O(1)$ + RB-Insert-Fixup), удерживающий высоту $h \le 2\log_2(n+1)$. Звёздочка — статистика порядка (**size** → OS-Select/OS-Rank). Бинарник принимает операции со stdin. Файлы редактируешь прямо здесь.`,
	sections: [
		{
			kind: 'note',
			heading: 'Этап 1 · Проектирование',
			body: String.raw`Узел держит **key**, три указателя **left/right/parent** (parent обязателен для удаления через TRANSPLANT и для поворотов), поле **color** (RED/BLACK) для красно-чёрного баланса и **size** для статистики порядка (этап 4). Ключевой приём RB-дерева — один общий узел-сторож **T->nil**: чёрный, без ключа; все «отсутствующие» дети и родитель корня указывают на него вместо NULL, что убирает проверки на NULL в поворотах и Fixup. Дерево — это **struct Tree { Node *root; Node *nil; }**; **createTree()** выделяет nil и ставит **root=nil**. Решаешь сразу: строить RB как базу (рекомендуется — поля цвета уже на месте) или начать с голого BST и потом добавить цвет и баланс.`
		},
		{
			kind: 'note',
			heading: 'Этап 2 · BST: вставка, поиск, обходы, удаление',
			body: String.raw`Ядро [[bst|BST]]. **bst_insert** — спуск от корня: влево, если ключ меньше, иначе вправо, до **nil**; подвешиваем новый лист и проставляем **parent**. **bst_find** — тот же спуск. **tree_min/tree_max** — крайний левый/правый узел. **tree_successor(x)** — следующий по порядку: есть правый ребёнок → минимум правого поддерева, иначе поднимаемся по parent, пока идём по правой ветви. Три обхода: **inorder** (даёт ОТСОРТИРОВАННУЮ последовательность — это инвариант корректности!), **preorder**, **postorder**; уровневой (BFS) — через очередь на **Vector**. Удаление — через **transplant(T,u,v)** (подмена поддерева у родителя) и три случая в **bst_delete**: нет левого ребёнка → ставим правого; нет правого → ставим левого; два ребёнка → берём **y = min(z->right)**, при необходимости сначала вырезаем y, затем y занимает место z с переносом left/right/parent.`
		},
		{
			kind: 'note',
			heading: 'Этап 3 · Балансировка (красно-чёрная)',
			body: String.raw`Чтобы высота не выродилась в $O(n)$, добавляем красно-чёрные правила. **left_rotate/right_rotate** — локальная перестройка за $O(1)$: меняем местами узел и одного его ребёнка, аккуратно перевешивая parent-указатели (nil-сторож снимает проверки на NULL). **rb_insert** делает обычную BST-вставку нового **КРАСНОГО** узла и зовёт **rb_insert_fixup** — три случая (симметрично слева/справа), пока родитель красный: (1) дядя красный — перекрашиваем родителя, дядю, деда и поднимаемся к деду; (2) z «внутренний» внук — поворотом сводим к случаю 3; (3) z «внешний» внук — перекрашиваем и поворачиваем деда; в конце **T->root->color = BLACK**. Инварианты RB (корень чёрный; у красного узла дети чёрные; на любом пути до листьев одинаковое число чёрных) гарантируют $h \le 2\log_2(n+1)$. Альтернатива — AVL по высоте с балансом из $\{-1,0,+1\}$ и теми же поворотами.`
		},
		{
			kind: 'note',
			heading: 'Этап 4 · (звёздочка) Статистика порядка',
			body: String.raw`Расширяем узел полем **size = 1 + size(left) + size(right)** (у nil **size=0**) — и получаем дерево порядковых статистик. Главное — поддерживать size при вставке, удалении и **повороте**, причём поворот пересчитывает size за $O(1)$: новому верхнему узлу size достаётся от старого верхнего, новому нижнему — пересчёт из его детей. **os_select(x,i)**: $r = size(x{\to}left)+1$; если $i=r$ — это x; если $i<r$ — идём влево; иначе ищем $(i-r)$-ю статистику справа. **os_rank(x)**: $r = size(x{\to}left)+1$, затем поднимаемся к корню, на правых шагах прибавляя размер левого поддерева родителя. Обе операции — $O(\log n)$.`
		},
		{
			kind: 'note',
			heading: 'Этап 5 · Бинарник и проверка',
			body: String.raw`**main** читает операции со stdin по одной в строке: **i K** (insert), **d K** (delete), **f K** (find → 1/0), **s** (inorder-печать), **k R** / **r K** (OS-Select / OS-Rank — звёздочка), **h** (высота). Сборка — **make** (бинарник **./tree**). Проверка — **make test**: прогон по наборам из **tests/** (**sorted** и **rank**) и сверка с **expected.txt**. Два инварианта корректности: вывод **s** ВСЕГДА отсортирован (значит дерево поиска валидно), а **h** не превышает $2\log_2(n+1)$ (значит баланс держится). Скелет уже компилируется (заглушки возвращают 0/NULL) — наполни узловые операции, повороты, Fixup и обработку команд.`
		}
	],
	tasks: [],
	mastery: [
		'Узел хранит key/left/right/parent (+color и общий nil-сторож для RB, +size для статистики порядка)',
		'BST умеет вставку спуском, поиск, min/max/successor и три обхода; inorder выдаёт отсортированную последовательность',
		'Удаление сделано через TRANSPLANT с разбором трёх случаев (нет левого / нет правого / два ребёнка)',
		'Балансировка: левый/правый поворот за O(1) и RB-Insert-Fixup по трём случаям, корень всегда чёрный',
		'Понимаю инвариант h ≤ 2·log2(n+1); (звёздочка) size поддерживается при повороте за O(1), работают OS-Select/OS-Rank',
		'Бинарник обрабатывает операции со stdin и проходит тесты из tests/ (отсортированный inorder и контроль высоты)'
	],
	lab: { language: 'c', files, entry: 'tree.c' }
};
