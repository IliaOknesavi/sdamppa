import type { Day, LabFile } from '$lib/types';
// Переиспользуемые структуры студента из прошлых лаб (algo-2025).
import vectorH from './reused/vector.generic.h?raw';
import vectorC from './reused/vector.generic.c?raw';
import comparatorsH from './reused/comparators.h?raw';

// =====================================================================
//  Лаба «Жадные алгоритмы на C» (phaseId='greedy') — IDE-лаба по шаблону
//  №12 «Графы». Реальные файлы прямо на странице: переиспользуемый
//  Vector + comparators.h, README с постановкой по этапам, Makefile,
//  скелет greedy.c/greedy.h (сигнатуры + TODO, без готового решения),
//  маленькие тесты в tests/.
//
//  Этапы:
//   1 · Проектирование структур (Request, Item) и компараторов.
//   2 · Activity selection: qsort по правому концу + линейный проход.
//   3 · Дробный рюкзак: сортировка по ρ=v/w + набор до лимита.
//   4 · (*) Хаффман: min-куча на векторе, дерево, B(T)=Σf·d.
//   5 · CLI-бинарник и прогон на тестах (фиксированный формат вывода).
// =====================================================================

// --- README с полной постановкой по этапам ---------------------------
const README = String.raw`# Лаба — Жадные алгоритмы на C

Цель: реализовать три классических жадных алгоритма на C и собрать из них
один CLI-бинарник. Структуры данных переиспользуются из прошлых лаб — свой
динамический массив писать НЕ нужно.

Переиспользуемое (трогать нельзя, лежит в lab/):
  lab/vector/generic.h, lab/vector/generic.c — Vector (динамический массив).
  lab/comparators.h — предикаты сравнения (intEquals, doubleEquals, ...).

Редактируешь только:
  greedy.h — объявления структур (Request, Item) и прототипы функций.
  greedy.c — реализация всех этапов + main().

Сборка и тесты:
  make            — собрать бинарник greedy и юнит-тест.
  make test       — прогнать tests/run_tests.sh на бинарнике.

----------------------------------------------------------------------

ЭТАП 1 · Проектирование

Спроектируй, как хранить входные данные двух задач:
  - заявка интервального планирования: пара (start, finish) — целые числа,
    момент начала и момент конца события;
  - предмет рюкзака: пара (weight, value) — вес и стоимость (double).

Заявки и предметы храни в переиспользуемом Vector (createVector(sizeof(...))),
а не в своих массивах. Какие нужны компараторы для qsort:
  - по правому концу finish (для activity selection, этап 2);
  - по убыванию удельной ценности ρ = value / weight (для рюкзака, этап 3);
  - по частоте (для Хаффмана, этап 4).
comparators.h даёт готовые предикаты равенства/порядка (intEquals, doubleEquals,
intCmp, ...) — на их идее строишь свои qsort-компараторы (qsort требует знак
<0 / 0 / >0, а не предикат), но переиспользуешь Vector как хранилище.

ЭТАП 2 · Activity selection (выбор непересекающихся заявок)

Дано n заявок (start, finish). Выбрать максимальное число попарно
непересекающихся заявок. Жадная схема:
  1) qsort заявок по неубыванию правого конца finish;
  2) линейный проход с переменной last_finish (изначально -бесконечность):
     берём заявку, если её start >= last_finish; тогда обновляем
     last_finish = finish текущей заявки.
Возврат: количество выбранных заявок. Асимптотика O(n log n) (сортировка).

ЭТАП 3 · Дробный рюкзак (fractional knapsack)

Дано n предметов (weight, value) и вместимость W. Можно брать предмет
дробной долей. Максимизировать суммарную стоимость. Жадная схема:
  1) qsort предметов по убыванию удельной ценности ρ = value / weight;
  2) идём по порядку: предмет влезает целиком — берём целиком (W -= weight,
     к ответу += value); не влезает — берём дробную долю W/weight, добавляем
     value * (W/weight) и выходим.
Возврат: суммарная стоимость (double). Асимптотика O(n log n).

ЭТАП 4 · (звёздочка) Коды Хаффмана

Дано n символов с частотами f. Построить оптимальный префиксный код.
  1) на каждый символ — лист (узел с частотой); сложить листья в min-кучу
     (можно реализовать кучу прямо на Vector: extract-min / insert);
  2) пока в куче > 1 узла: извлечь два минимума a, b; создать родителя с
     частотой f(a)+f(b) и детьми a, b; вернуть родителя в кучу;
  3) корень — последний оставшийся узел; глубина листа = длина его кода.
Проверка стоимости дерева: B(T) = Σ f_i · d_i, где d_i — глубина i-го листа.
Возврат: B(T) (long long или double). Асимптотика O(n log n).

ЭТАП 5 · CLI-бинарник и формат вывода

  ./greedy <mode> <input>
    mode  — одно из: activity | knapsack | huffman
    input — путь к файлу с входными данными.

Форматы входа (по строкам):
  activity:  первая строка n; далее n строк "start finish" (целые).
  knapsack:  первая строка "n W"; далее n строк "weight value" (double).
  huffman:   первая строка n; далее n строк "symbol freq" (символ + целое).

Форматы вывода (ровно одна строка, Unix-перевод строки, без хвостовых пробелов):
  activity:  целое — число выбранных заявок.
  knapsack:  стоимость с 6 знаками после точки (%.6f).
  huffman:   целое B(T) — суммарная стоимость дерева.

Прогоняйся на tests/ (make test).`;

// --- Makefile (readonly) ---------------------------------------------
const MAKEFILE = String.raw`CC = gcc
CFLAGS = -Wall -Wextra -std=c11
LIBS = lab/vector/generic.c
LM = -lm

all: greedy

greedy: greedy.c $(LIBS)
	$(CC) $(CFLAGS) greedy.c $(LIBS) -o greedy $(LM)

test: greedy
	bash tests/run_tests.sh ./greedy

clean:
	rm -f greedy
`;

// --- greedy.h (редактируемый студентом скелет) -----------------------
const GREEDY_H = String.raw`#ifndef GREEDY_H
#define GREEDY_H

#include "lab/vector/generic.h"

// ===== Этап 1 · структуры данных ====================================
// TODO: заявка интервального планирования — момент начала и конца.
typedef struct {
    int start;
    int finish;
} Request;

// TODO: предмет рюкзака — вес и стоимость.
typedef struct {
    double weight;
    double value;
} Item;

// ===== Прототипы (реализация — в greedy.c) ==========================

// Этап 2: максимум попарно непересекающихся заявок из вектора Request.
int activity_select(Vector *requests);

// Этап 3: максимальная стоимость дробного рюкзака вместимости W.
double knapsack_fractional(Vector *items, double W);

// Этап 4 (*): стоимость оптимального префиксного дерева B(T) = Σ f·d.
//   freqs — массив частот длины n.
long long huffman_cost(const long long *freqs, int n);

#endif // GREEDY_H
`;

// --- greedy.c (редактируемый студентом скелет, заглушки) -------------
const GREEDY_C = String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "greedy.h"
#include "lab/comparators.h"

// =====================================================================
//  Скелет лабы по жадным алгоритмам. Заглушки возвращают 0 — заполни их
//  сам по этапам из README.md. Vector переиспользуй как хранилище
//  (requests->data, items->data можно отдать в qsort напрямую).
// =====================================================================

// ===== Этап 2 · Activity selection ==================================
// TODO: компаратор для qsort по неубыванию правого конца finish.
static int cmp_by_finish(const void *a, const void *b) {
    (void)a; (void)b;
    return 0;
}

int activity_select(Vector *requests) {
    // TODO:
    //  1) qsort(requests->data, requests->size, sizeof(Request), cmp_by_finish);
    //  2) линейный проход: брать заявку, если start >= last_finish,
    //     обновляя last_finish = finish; считать выбранные.
    (void)requests;
    return 0;
}

// ===== Этап 3 · Дробный рюкзак ======================================
// TODO: компаратор для qsort по УБЫВАНИЮ ρ = value / weight.
static int cmp_by_ratio_desc(const void *a, const void *b) {
    (void)a; (void)b;
    return 0;
}

double knapsack_fractional(Vector *items, double W) {
    // TODO:
    //  1) qsort(items->data, items->size, sizeof(Item), cmp_by_ratio_desc);
    //  2) идти по порядку: влезает целиком — взять целиком;
    //     иначе взять дробную долю W/weight и выйти.
    (void)items; (void)W;
    return 0.0;
}

// ===== Этап 4 (*) · Коды Хаффмана ===================================
long long huffman_cost(const long long *freqs, int n) {
    // TODO (звёздочка):
    //  - сложить листья (частоты) в min-кучу (можно на Vector);
    //  - пока узлов > 1: извлечь два минимума, слить в родителя,
    //    вернуть в кучу; копить стоимость слияний (= Σ f·d);
    //  - вернуть B(T).
    (void)freqs; (void)n;
    return 0;
}

// ===== Этап 5 · CLI =================================================
// Чтение входа и печать результата в фиксированном формате (см. README).

static int run_activity(FILE *in) {
    int n;
    if (fscanf(in, "%d", &n) != 1) return 1;
    Vector *reqs = createVector(sizeof(Request));
    for (int i = 0; i < n; i++) {
        Request r;
        if (fscanf(in, "%d %d", &r.start, &r.finish) != 2) { vectorFree(reqs); return 1; }
        appendVectorItem(reqs, &r);
    }
    printf("%d\n", activity_select(reqs));
    vectorFree(reqs);
    return 0;
}

static int run_knapsack(FILE *in) {
    int n; double W;
    if (fscanf(in, "%d %lf", &n, &W) != 2) return 1;
    Vector *items = createVector(sizeof(Item));
    for (int i = 0; i < n; i++) {
        Item it;
        if (fscanf(in, "%lf %lf", &it.weight, &it.value) != 2) { vectorFree(items); return 1; }
        appendVectorItem(items, &it);
    }
    printf("%.6f\n", knapsack_fractional(items, W));
    vectorFree(items);
    return 0;
}

static int run_huffman(FILE *in) {
    int n;
    if (fscanf(in, "%d", &n) != 1) return 1;
    long long *freqs = malloc((size_t)n * sizeof(long long));
    for (int i = 0; i < n; i++) {
        char sym[64];
        if (fscanf(in, "%63s %lld", sym, &freqs[i]) != 2) { free(freqs); return 1; }
    }
    printf("%lld\n", huffman_cost(freqs, n));
    free(freqs);
    return 0;
}

int main(int argc, char **argv) {
    if (argc != 3) {
        fprintf(stderr, "usage: %s <activity|knapsack|huffman> <input>\n", argv[0]);
        return 2;
    }
    FILE *in = fopen(argv[2], "r");
    if (!in) { perror("fopen"); return 2; }

    int rc = 1;
    if (strcmp(argv[1], "activity") == 0)      rc = run_activity(in);
    else if (strcmp(argv[1], "knapsack") == 0) rc = run_knapsack(in);
    else if (strcmp(argv[1], "huffman") == 0)  rc = run_huffman(in);
    else fprintf(stderr, "unknown mode: %s\n", argv[1]);

    fclose(in);
    return rc;
}
`;

// --- tests/run_tests.sh (readonly) -----------------------------------
const RUN_TESTS = [
	'#!/usr/bin/env bash',
	'# Прогон бинарника на кейсах из tests/. Использование: run_tests.sh ./greedy',
	'set -u',
	'BIN="$1"',
	'DIR="$(dirname "$0")"',
	'pass=0; fail=0',
	'',
	'check () {',
	'  local mode="$1" input="$2" expect="$3"',
	'  local got',
	'  got="$("$BIN" "$mode" "$input")"',
	'  if [ "$got" = "$expect" ]; then',
	'    echo "ok   $mode $input"; pass=$((pass+1))',
	'  else',
	"    echo \"FAIL $mode $input: expected '$expect', got '$got'\"; fail=$((fail+1))",
	'  fi',
	'}',
	'',
	'check activity "$DIR/activity_01/input.txt" "$(cat "$DIR/activity_01/expected.txt")"',
	'check knapsack "$DIR/knapsack_01/input.txt" "$(cat "$DIR/knapsack_01/expected.txt")"',
	'',
	'echo "----"',
	'echo "passed: $pass, failed: $fail"',
	'[ "$fail" -eq 0 ]',
	''
].join('\n');

// --- маленькие тесты --------------------------------------------------
// activity: 4 заявки -> 3 непересекающихся ([1,3),[3,5),[5,8)).
const ACT_IN = String.raw`4
1 3
2 5
3 5
5 8
`;
const ACT_OUT = `3`;

// knapsack: W=50, предметы (10,60),(20,100),(30,120) -> 240.000000.
const KNAP_IN = String.raw`3 50
10 60
20 100
30 120
`;
const KNAP_OUT = `240.000000`;

const labFiles: LabFile[] = [
	{ path: 'lab/vector/generic.h', readonly: true, lang: 'c', content: vectorH },
	{ path: 'lab/vector/generic.c', readonly: true, lang: 'c', content: vectorC },
	{ path: 'lab/comparators.h', readonly: true, lang: 'c', content: comparatorsH },
	{ path: 'README.md', readonly: true, content: README },
	{ path: 'Makefile', readonly: true, content: MAKEFILE },
	{ path: 'greedy.h', lang: 'c', content: GREEDY_H },
	{ path: 'greedy.c', lang: 'c', content: GREEDY_C },
	{ path: 'tests/run_tests.sh', readonly: true, lang: 'bash', content: RUN_TESTS },
	{ path: 'tests/activity_01/input.txt', readonly: true, content: ACT_IN },
	{ path: 'tests/activity_01/expected.txt', readonly: true, content: ACT_OUT },
	{ path: 'tests/knapsack_01/input.txt', readonly: true, content: KNAP_IN },
	{ path: 'tests/knapsack_01/expected.txt', readonly: true, content: KNAP_OUT }
];

export const greedyLab: Day = {
	n: 0,
	phaseId: 'greedy',
	kind: 'lab',
	unitLabel: 'Лаба',
	title: 'Жадные алгоритмы на C: activity selection, рюкзак, Хаффман',
	est: '4–8 ч',
	goal: String.raw`Реализовать на C три жадных алгоритма и собрать один CLI-бинарник, **переиспользуя** [[kucha|Vector]] и **comparators.h** из прошлых лаб. Этапы: проектирование структур → [[greedy|activity selection]] → дробный рюкзак → (*) [[huffman|Хаффман]] → бинарник и тесты. Файлы настоящие — редактируй прямо здесь.`,
	sections: [
		{
			kind: 'note',
			heading: 'Этап 1 · Проектирование',
			body: String.raw`Реши, как хранить вход двух задач: **заявку** интервального планирования — пара **(start, finish)** (целые: момент начала и конца) и **предмет** рюкзака — пара **(weight, value)** (вес и стоимость, double). Заявки и предметы складывай в переиспользуемый **Vector** (**createVector(sizeof(Request))**), а не в свои массивы.

Какие нужны компараторы для **qsort**: по правому концу **finish** (этап 2), по убыванию удельной ценности $\rho = v/w$ (этап 3), по частоте (этап 4). Готовые предикаты равенства и порядка бери из **comparators.h** (**intEquals**, **doubleEquals**, **intCmp**, …) и на их идее строй свои qsort-компараторы: qsort ждёт знак $<0/0/>0$, а не предикат.`
		},
		{
			kind: 'note',
			heading: 'Этап 2 · Activity selection',
			body: String.raw`Дано $n$ заявок $(start, finish)$ — выбрать **максимум попарно непересекающихся**. Жадно: **qsort** по неубыванию правого конца **finish**, затем линейный проход с **last_finish**: берём заявку, если её $start \ge last\_finish$, и обновляем $last\_finish = finish$. Доказательство — обмен/«остаётся впереди»: самый ранний конец оставляет максимум места дальше. Возврат — число выбранных. Асимптотика $O(n\log n)$.`
		},
		{
			kind: 'note',
			heading: 'Этап 3 · Дробный рюкзак',
			body: String.raw`Дано $n$ предметов $(weight, value)$ и вместимость $W$; предмет можно брать дробной долей — максимизировать суммарную стоимость. Жадно: **qsort** по **убыванию** $\rho = v/w$, затем набираем по порядку — что влезает целиком, берём целиком ($W \mathrel{-}= w$, ответ $\mathrel{+}= v$); первый, кто не влезает, берём долей $W/w$ и выходим: ответ $\mathrel{+}= v\cdot (W/w)$. Возврат — суммарная стоимость (double, печать **%.6f**). Асимптотика $O(n\log n)$. Для **0/1**-рюкзака (целиком/никак) жадность ломается — там [[dp|ДП]].`
		},
		{
			kind: 'note',
			heading: 'Этап 4 · (звёздочка) Хаффман',
			body: String.raw`Дано $n$ символов с частотами $f$ — построить оптимальный [[huffman|префиксный код]]. Каждый символ — лист; сложи листья в **min-кучу** (можно реализовать прямо на **Vector**: extract-min / insert). Пока узлов больше одного — извлекай два минимума, склеивай в родителя с частотой суммы и возвращай в кучу. Корень — последний узел; **глубина листа = длина его кода**. Проверка стоимости дерева: $B(T)=\sum_i f_i\cdot d_i$, где $d_i$ — глубина $i$-го листа (равна сумме всех слияний). Возврат — $B(T)$. Асимптотика $O(n\log n)$.`
		},
		{
			kind: 'note',
			heading: 'Этап 5 · CLI-бинарник и тесты',
			body: String.raw`Собери всё под один бинарник: **./greedy <mode> <input>**, где **mode** — **activity** | **knapsack** | **huffman**, а **input** — путь к файлу. Форматы входа и выхода описаны в **README.md** (ровно одна строка ответа, Unix-перевод строки, без хвостовых пробелов; для рюкзака — 6 знаков **%.6f**). Скелет **main()** и чтение входа уже даны — тебе остаётся реализовать три функции. Прогоняйся на **tests/** командой **make test**.`
		}
	],
	tasks: [],
	mastery: [
		'Заявки и предметы хранятся в переиспользуемом Vector, не в своих массивах',
		'activity_select сортирует по правому концу и линейным проходом даёт максимум непересекающихся заявок',
		'knapsack_fractional сортирует по убыванию ρ=v/w и набирает до лимита, последний — дробной долей',
		'(*) huffman_cost строит дерево через min-кучу и считает B(T)=Σf·d',
		'Бинарник ./greedy принимает mode и input, печатает ответ в требуемом формате; проходят tests/'
	],
	lab: { language: 'c', files: labFiles, entry: 'greedy.c' }
};
