import type { Day } from '$lib/types';

export const day07: Day = {
	n: 7,
	phaseId: "protocol",
	kind: 'theory',
	title: "Dunder-методы II: контейнеры, вызов, контекст, итерация",
	est: '1–2 ч',
	goal: "Научиться встраивать свои объекты в фундаментальные протоколы Python — контейнер (`obj[i]`, `in`, `len`), итерацию (`for`), вызов (`obj()`) и контекст (`with`) — понимая не синтаксис, а механику диспетчеризации dunder-методов.",
	sections: [
		{
			kind: "definition",
			heading: "Что такое «протокол» в Python и почему dunder",
			body: "В Python нет интерфейсов в духе Java. Вместо них работают *протоколы* — негласные контракты: «если объект реализует определённый набор [[dunder|dunder-методов]], синтаксические конструкции языка начинают с ним работать». Написал `__len__` — заработал `len(obj)`. Написал `__getitem__` — заработали `obj[i]`, срезы и даже `for`. Это и есть [[duck-typing|утиная типизация]] на уровне синтаксиса: интерпретатор не спрашивает «какого ты класса?», он спрашивает «а есть ли у тебя нужный метод?».\n\n## Ключевая механика: поиск идёт по ТИПУ, а не по экземпляру\nКогда вы пишете `len(obj)`, Python вызывает не `obj.__len__()`, а `type(obj).__len__(obj)`. Это критично: для *неявных* вызовов dunder-методов (через операторы и встроенные функции) Python ищет метод **только в классе**, минуя `__dict__` экземпляра и даже `__getattr__`. Поэтому нельзя «подменить» `len` для одного экземпляра, повесив `obj.__len__ = ...` — это просто проигнорируется.\n\n## Почему так устроено\n- *Скорость*: поиск по типу кэшируется и не дёргает механизм атрибутов экземпляра на каждый `+` или `[]`.\n- *Предсказуемость*: `1 + x` не должен зависеть от того, что кто-то засунул в `1.__dict__`.\n\nВ этом дне мы разбираем четыре протокола: **контейнер** (индексация, `in`, длина), **итерация** (`for`), **вызов** (`obj()`) и **контекст** (`with`), плюс перехват доступа к атрибутам. Все они — про то, как сделать ваш объект «своим» для синтаксиса языка."
		},
		{
			kind: "derivation",
			heading: "Контейнерный протокол: len, индексация, in",
			body: "Чтобы объект вёл себя как последовательность или отображение, реализуют группу методов. Они независимы — берите только нужные.\n\n- `__len__(self)` → включает `len(obj)`. Должен вернуть неотрицательный `int`. Дополнительно `len()` участвует в `bool(obj)`: пустой контейнер (`len == 0`) считается «ложным».\n- `__getitem__(self, key)` → включает `obj[key]`. Сюда приходит **то, что в скобках**: целое, отрицательное целое, либо объект `slice` при `obj[1:3]`. Различать их — ваша работа: `if isinstance(key, slice): ...`.\n- `__setitem__(self, key, value)` → включает `obj[key] = value`.\n- `__delitem__(self, key)` → включает `del obj[key]`.\n- `__contains__(self, value)` → включает оператор `in`.\n\n## Под капотом: что делает «in», если нет __contains__\nЕсли `__contains__` не определён, `value in obj` не падает! Python откатывается на запасной путь: перебирает объект через протокол итерации (а если нет `__iter__`, то через `__getitem__` с индексами 0,1,2,...) и сравнивает каждый элемент. Поэтому контейнер с одним лишь `__getitem__` уже поддерживает и `for`, и `in` — просто медленно и линейно. Свой `__contains__` нужен, когда вы умеете проверить принадлежность быстрее (например, через внутренний `set` или `dict`).\n\n## Типичная ошибка\nЗабыть про срезы. Если `__getitem__` слепо делает `self._data[key]` и `_data` — это `list`, срезы заработают «бесплатно». Но если вы хотите вернуть объект *своего* класса при срезе (как делает `list`, возвращая `list`), нужно явно обработать `isinstance(key, slice)`. В примере ниже `Stack[1:3]` возвращает новый `Stack`, а не голый список.",
			code: {
				title: "Stack: len, getitem (int и slice), contains",
				language: 'python',
				code: String.raw`# Контейнерный протокол: Stack с __len__, __getitem__, __contains__
class Stack:
    def __init__(self, items=()):
        self._data = list(items)

    def push(self, x):
        self._data.append(x)

    def pop(self):
        return self._data.pop()

    def __len__(self):
        return len(self._data)

    def __getitem__(self, index):
        # поддержка и int, и slice — index приходит как есть
        if isinstance(index, slice):
            return Stack(self._data[index])
        return self._data[index]

    def __contains__(self, value):
        return value in self._data

    def __repr__(self):
        return f"Stack({self._data!r})"


s = Stack([10, 20, 30, 40])
print("len:", len(s))               # __len__
print("s[0]:", s[0])                # __getitem__ с int
print("s[-1]:", s[-1])              # отрицательный индекс
print("s[1:3]:", s[1:3])            # __getitem__ со slice
print("30 in s:", 30 in s)          # __contains__
print("99 in s:", 99 in s)

# Если бы __contains__ не было, Python падает на __iter__/__getitem__:
print("Итерация по умолчанию (через __getitem__):", [x for x in s])

# bool() для пустого контейнера опирается на __len__
print("bool(пустой):", bool(Stack()), "| bool(непустой):", bool(s))`,
				explanation: "Запуск показывает, что один класс отвечает на `len`, `[]`, срез, `in`, итерацию и `bool` сразу. Обратите внимание: `s[1:3]` вернул `Stack(...)`, а не `list` — это результат явной ветки `isinstance(index, slice)`. А итерация работает, хотя `__iter__` мы не писали: сработал запасной путь через `__getitem__`."
			}
		},
		{
			kind: "connection",
			heading: "Запись и удаление по ключу: setitem, delitem",
			body: "Чтение — половина дела. Чтобы объект был полноценным изменяемым контейнером (как `list` или `dict`), нужны `__setitem__` и `__delitem__`. Они дают синтаксис `obj[key] = value` и `del obj[key]`.\n\n## Где это реально полезно\nКлассический случай — *представление поверх другого хранилища*, где синтаксис `[]` маскирует нетривиальную логику. Разреженный вектор хранит только ненулевые компоненты в `dict`, но снаружи выглядит как обычный индексируемый массив фиксированного размера. Присваивание нуля не «записывает ноль», а удаляет запись из словаря — экономия памяти, скрытая за привычным `v[i] = 0`.\n\n## Контракт, который легко нарушить\n- Проверяйте ключ **одинаково** во всех трёх методах (`__getitem__`, `__setitem__`, `__delitem__`). В примере это вынесено в `_check`. Несогласованность — источник коварных багов: читается ключ, который нельзя записать.\n- Кидайте **правильный тип** исключения: `IndexError` для выхода за границы последовательности (это то, на что опирается `for` и распаковка), `KeyError` для отсутствующего ключа отображения, `TypeError` для ключа неподходящего типа. Если перепутать — встроенные конструкции начнут вести себя странно (например, `for` по объекту полагается на то, что выход за границу — это именно `IndexError`).",
			code: {
				title: "SparseVector: setitem/delitem с проверкой границ",
				language: 'python',
				code: String.raw`# Полный контейнер с __setitem__/__delitem__ и проверкой границ
class SparseVector:
    """Разреженный вектор: хранит только ненулевые компоненты."""
    def __init__(self, size):
        self._size = size
        self._data = {}

    def _check(self, i):
        if not isinstance(i, int):
            raise TypeError(f"индекс должен быть int, а не {type(i).__name__}")
        if not (0 <= i < self._size):
            raise IndexError(f"индекс {i} вне диапазона [0, {self._size})")

    def __len__(self):
        return self._size

    def __getitem__(self, i):
        self._check(i)
        return self._data.get(i, 0)

    def __setitem__(self, i, value):
        self._check(i)
        if value == 0:
            self._data.pop(i, None)   # ноль не храним
        else:
            self._data[i] = value

    def __delitem__(self, i):
        self._check(i)
        self._data.pop(i, None)

    def nonzero(self):
        return dict(sorted(self._data.items()))


v = SparseVector(5)
v[1] = 3.0
v[3] = 7.0
print("v[1]:", v[1], "| v[2] (по умолчанию 0):", v[2])
print("ненулевые:", v.nonzero())

v[1] = 0          # присваивание нуля удаляет хранение
print("после v[1]=0:", v.nonzero())

del v[3]          # __delitem__
print("после del v[3]:", v.nonzero())

try:
    v[10] = 1
except IndexError as e:
    print("IndexError:", e)`,
				explanation: "Снаружи `v[i]` выглядит как обычный массив на 5 элементов, но внутри хранится лишь словарь ненулевых. Присваивание `v[1] = 0` не добавляет ноль, а удаляет ключ — это видно по `nonzero()`. Единая проверка `_check` гарантирует, что чтение и запись согласованы по границам."
			}
		},
		{
			kind: "definition",
			heading: "Итерация: iterable против iterator",
			body: "Это место, где спотыкаются почти все. В Python два разных понятия:\n\n- **Iterable** (итерируемое) — объект, у которого есть `__iter__`, возвращающий *итератор*. По нему можно пройти много раз: `list`, `dict`, ваш `Countdown`. Сам по себе он не помнит «где мы остановились».\n- **Iterator** (итератор) — объект, который реализует `__next__` (выдаёт следующий элемент или кидает `StopIteration`) И `__iter__`, возвращающий **самого себя** (`return self`). Итератор *одноразовый* и хранит состояние обхода. Исчерпался — всё, повторно не пройти.\n\n## Как работает `for x in obj`\nЦикл `for` делает ровно это: `it = iter(obj)` (вызов `obj.__iter__()`), затем в цикле `x = next(it)` (вызов `it.__next__()`), пока не прилетит `StopIteration` — тогда цикл штатно завершается. `StopIteration` — не ошибка, а сигнал «элементы кончились».\n\n## Почему iterator обязан возвращать себя из __iter__\nЧтобы итератор тоже можно было поставить в `for`. Когда вы пишете `for x in it`, где `it` уже итератор, `for` вызовет `iter(it)` — и должен получить тот же объект, чтобы не потерять состояние. Если `__iter__` итератора вернёт что-то другое, поведение `for` сломается.\n\n## Главная развилка дизайна\nЕсли `__iter__` вашего класса возвращает `self`, объект — одноразовый итератор: второй `for` по нему пуст. Если `__iter__` возвращает **новый** объект-итератор при каждом вызове, объект — переиспользуемый iterable. В примере `Countdown` — iterable (даёт свежий `CountdownIterator`), поэтому два прохода подряд работают; а сам `CountdownIterator` — одноразовый.",
			code: {
				title: "Countdown: iterable и iterator раздельно + генератор",
				language: 'python',
				code: String.raw`# Протокол итерации: iterable vs iterator. Ручной итератор + генератор.

# --- 1. Класс-iterable, который РАЗ возвращает СВЕЖИЙ iterator ---
class Countdown:
    """Iterable: __iter__ возвращает новый итератор при каждом вызове."""
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        return CountdownIterator(self.start)


class CountdownIterator:
    """Iterator: хранит состояние, реализует __next__ и __iter__->self."""
    def __init__(self, current):
        self.current = current

    def __iter__(self):
        return self          # итератор обязан возвращать самого себя

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value


c = Countdown(3)
print("первый проход:", list(c))
print("второй проход:", list(c))   # снова работает, т.к. __iter__ даёт новый итератор

# Итератор одноразовый:
it = iter(c)
print("next:", next(it), next(it))
print("остаток через for:", list(it))   # продолжает с того же места

# --- 2. Генератор как краткая форма итератора ---
def countdown_gen(start):
    while start > 0:
        yield start
        start -= 1

print("генератор:", list(countdown_gen(3)))

# Сравним: что возвращает iter() и совпадает ли он с объектом
g = countdown_gen(2)
print("генератор сам себе iterator?", iter(g) is g)
print("Countdown сам себе iterator?", iter(c) is c)  # False — он iterable, не iterator`,
				explanation: "`Countdown` проходится дважды (он iterable), а его итератор — одноразовый: после двух `next` в нём остался только `1`. Генератор `countdown_gen` делает то же самое в три строки: `yield` сам реализует `__next__`/`__iter__`/`StopIteration`. Последние две строки показывают разницу: генератор `is` своему `iter()`, а `Countdown` — нет."
			}
		},
		{
			kind: "intuition",
			heading: "Генераторы как готовые итераторы",
			body: "Писать пару классов «iterable + iterator» ради простого обхода — почти всегда излишество. [[generator|Генератор]] — встроенная краткая форма итератора. Функция с `yield` при вызове не выполняется, а возвращает объект-генератор. Этот объект уже реализует весь протокол:\n\n- `__next__` — выполняет тело до следующего `yield` и возвращает выданное значение;\n- `__iter__` — возвращает себя (генератор — это итератор);\n- `StopIteration` — кидается автоматически, когда функция доходит до конца или `return`.\n\n## Что именно экономит yield\nСостояние (локальные переменные, точка остановки) сохраняется *за вас*, между вызовами `next`. Вам не нужно вручную хранить «где я» в атрибутах — `yield` замораживает кадр стека функции. Это и делает генераторы такими компактными по сравнению с ручным `CountdownIterator`.\n\n## Важная тонкость: генератор одноразовый\nГенератор — это *итератор*, а не *iterable*-фабрика. Один объект-генератор проходится один раз. Если вам нужна повторная итерация, оборачивайте `yield` в метод `__iter__` класса: тогда каждый `for` вызовет `__iter__`, который запустит генераторную функцию заново и вернёт *новый* генератор. Этот приём — `__iter__` с `yield` внутри — и есть самый идиоматичный способ сделать переиспользуемый iterable. Он используется в звёздной задаче дня (`take`).\n\n## Бесконечные последовательности\nГенератор может никогда не завершаться (`while True: yield ...`). Это нормально и полезно: пока вы берёте конечное число элементов, бесконечный генератор Фибоначчи работает в постоянной памяти. Главное — не делать `list()` от бесконечного генератора."
		},
		{
			kind: "connection",
			heading: "Вызываемые объекты: __call__",
			body: "`__call__(self, ...)` превращает экземпляр в *вызываемый* объект: `obj(args)` означает `type(obj).__call__(obj, args)`. С точки зрения `callable(obj)` ваш объект становится неотличим от функции.\n\n## Зачем это, если есть функции и замыкания\nКогда «функции» нужно носить с собой состояние, есть два пути: [[closure|замыкание]] (вложенная функция, захватившая переменные) или объект с `__call__`. Замыкание прячет состояние в ячейках — его не видно, не сериализовать обычным способом, неудобно инспектировать и тестировать. Объект с `__call__` хранит состояние в явных атрибутах: их можно прочитать, вывести в `repr`, сохранить через `pickle`, поменять извне. Правило большого пальца: **одна спрятанная переменная — замыкание; несколько полей, которые хочется видеть и проверять — класс с `__call__`**.\n\n## Где встречается в реальном коде\n- *Накопители*: скользящее среднее, счётчик, аккумулятор градиента — всё, что «вызывается на каждом шаге и помнит историю».\n- *Декораторы-классы*: декоратор может быть объектом с `__call__` — тогда он одновременно хранит конфигурацию (в `__init__`) и оборачивает вызов (в `__call__`). Мемоизация в примере ниже — ровно этот паттерн.\n- *Фабрики предикатов*: объект-фильтр, который настраивается в `__init__` и вызывается как функция в `filter`/`sorted`.",
			code: {
				title: "RunningMean и Memoize: объекты-функции с состоянием",
				language: 'python',
				code: String.raw`# Вызываемые объекты __call__: объект-состояние вместо замыкания
class RunningMean:
    """Хранит скользящее среднее. Вызываем как функцию, но имеет состояние."""
    def __init__(self):
        self._n = 0
        self._sum = 0.0

    def __call__(self, x):
        self._n += 1
        self._sum += x
        return self._sum / self._n

    @property
    def count(self):
        return self._n


mean = RunningMean()
for x in (10, 20, 30, 40):
    print(f"добавили {x} -> текущее среднее {mean(x)}")
print("всего значений:", mean.count)
print("callable(mean)?", callable(mean))

# Объект-состояние удобнее замыкания: состояние видно, сериализуемо, тестируемо
# Сравнение с замыканием (тоже работает, но состояние спрятано в ячейках):
def make_counter():
    n = 0
    def inc():
        nonlocal n
        n += 1
        return n
    return inc

cnt = make_counter()
print("замыкание:", cnt(), cnt(), cnt())

# Частный приём: __call__ + словарь-кэш — мемоизация как декоратор-класс
class Memoize:
    def __init__(self, func):
        self.func = func
        self.cache = {}

    def __call__(self, *args):
        if args not in self.cache:
            self.cache[args] = self.func(*args)
        return self.cache[args]

@Memoize
def slow_square(n):
    print(f"  (вычисляю {n}^2)")
    return n * n

print("первый вызов:", slow_square(5))
print("второй вызов (из кэша):", slow_square(5))
print("кэш:", slow_square.cache)`,
				explanation: "`mean(x)` вызывается как функция, но помнит накопленную сумму и счётчик — `callable(mean)` это `True`. Декоратор `@Memoize` показывает мощь паттерна: `slow_square` теперь объект, его `.cache` доступен снаружи (второй вызов не печатает «вычисляю» — значение взято из кэша). С замыканием так заглянуть в кэш было бы нельзя."
			}
		},
		{
			kind: "derivation",
			heading: "Контекст-менеджеры: протокол with",
			body: "Конструкция `with` решает проблему «гарантированно прибраться за собой» (закрыть файл, отпустить блокировку, откатить транзакцию) — даже если внутри блока вылетело исключение. Объект-[[context-manager|контекст-менеджер]] реализует два метода:\n\n- `__enter__(self)` — выполняется при входе в блок. Его возвращаемое значение попадает в переменную после `as`. Часто это `return self`, но не обязано (например, у `open()` это файловый объект).\n- `__exit__(self, exc_type, exc_val, tb)` — выполняется при выходе из блока **всегда**: и при нормальном завершении, и при исключении.\n\n## Что означают три аргумента __exit__\nЕсли блок завершился нормально, все три равны `None`. Если внутри возникло исключение:\n- `exc_type` — класс исключения (например, `ZeroDivisionError`);\n- `exc_val` — сам объект исключения;\n- `tb` — объект трассировки (traceback).\n\n## Возврат __exit__ — это про подавление\nЭто самый тонкий момент. Если `__exit__` вернёт **истинное** значение (`True`), Python считает, что исключение *обработано*, и **глотает** его — за `with` выполнение продолжится как ни в чём не бывало. Если вернёт **ложное** (`False`/`None`/ничего) — исключение пробрасывается дальше после того, как `__exit__` отработал. Поэтому *по умолчанию пишите `return False`* (или вообще ничего не возвращайте): глотать исключения молча — почти всегда баг. Возвращать `True` нужно осознанно и обычно для конкретного типа (как делает `contextlib.suppress`).\n\n## Эквивалент через try/finally и contextlib\nКласс с `__enter__`/`__exit__` разворачивается в `try/finally`. Для простых случаев есть декоратор `@contextlib.contextmanager`: пишете генераторную функцию, код до `yield` — это `__enter__`, код в `finally` после `yield` — это `__exit__`. Короче, но менее гибко в обработке исключений.",
			code: {
				title: "Timer: классовый и через contextlib + подавление",
				language: 'python',
				code: String.raw`import time
from contextlib import contextmanager

# --- Контекст-менеджер Timer через класс ---
class Timer:
    def __init__(self, label="блок"):
        self.label = label

    def __enter__(self):
        self.start = time.perf_counter()
        return self                      # то, что попадёт в "as t"

    def __exit__(self, exc_type, exc_val, tb):
        self.elapsed = time.perf_counter() - self.start
        if exc_type is None:
            print(f"[{self.label}] выполнено за {self.elapsed*1000:.2f} мс")
        else:
            # исключение произошло; печатаем и НЕ глотаем (return False)
            print(f"[{self.label}] прервано {exc_type.__name__} за {self.elapsed*1000:.2f} мс")
        return False                     # False -> исключение пробрасывается дальше


with Timer("сумма") as t:
    total = sum(range(1_000_00))
print("результат:", total, "| t.elapsed >= 0:", t.elapsed >= 0)

# Исключение внутри with: __exit__ всё равно вызывается
try:
    with Timer("с ошибкой"):
        x = 1 / 0
except ZeroDivisionError:
    print("исключение поймано снаружи with (значит __exit__ вернул False)")

# --- Контекст-менеджер, который ГЛОТАЕТ конкретное исключение (return True) ---
class suppress_zero_div:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_val, tb):
        if exc_type is ZeroDivisionError:
            print(f"подавляю {exc_type.__name__}: {exc_val}")
            return True                  # True -> исключение НЕ выходит из with
        return False

with suppress_zero_div():
    1 / 0
print("after with: код продолжился, исключение проглочено")

# --- Тот же Timer через contextlib.contextmanager (генераторная форма) ---
@contextmanager
def timer(label="блок"):
    start = time.perf_counter()
    try:
        yield                            # тело with выполняется здесь
    finally:
        # finally эквивалентен __exit__ — выполнится даже при исключении
        print(f"[{label}] {((time.perf_counter()-start)*1000):.2f} мс (через contextmanager)")

with timer("генераторный"):
    sum(range(100000))`,
				explanation: "Первый `Timer` печатает время даже когда внутри `with` падает `ZeroDivisionError` — и, вернув `False`, пробрасывает его наружу (мы ловим его снаружи). `suppress_zero_div` возвращает `True` и потому *глотает* исключение: строка «after with» выполняется. Последний блок показывает генераторную форму через `@contextmanager`, где `finally` играет роль `__exit__`."
			}
		},
		{
			kind: "note",
			heading: "Перехват доступа к атрибутам: getattr и компания",
			body: "Последняя группа протоколов — перехват самого доступа к атрибутам. Здесь легко выстрелить себе в ногу, поэтому важно точно понимать, *когда* какой метод вызывается.\n\n## __getattr__ — запасной выход\n`__getattr__(self, name)` вызывается **только если обычный поиск атрибута провалился** — нет в `__dict__` экземпляра, нет в классе и его базах. Это идеальное место для «виртуальных» атрибутов: прокси, ленивая загрузка, доступ к ключам словаря через точку. В примере `Config.__getattr__` достаёт ключ из внутреннего `dict`. Важно: при отсутствии — кидайте `AttributeError`, а не `KeyError` (на `AttributeError` опираются `hasattr`, `getattr(obj, name, default)` и многое другое).\n\n## __setattr__ — перехват ЛЮБОЙ записи\n`__setattr__(self, name, value)` вызывается на **каждое** присваивание атрибута, включая присваивания в `__init__`. Отсюда классическая ловушка: внутри `__setattr__` написать `self.x = value` — это рекурсивный вызов `__setattr__`, бесконечная рекурсия. Чтобы реально записать, обходите себя через `object.__setattr__(self, name, value)` или прямо в `self.__dict__[name] = value`.\n\n## __getattribute__ — перехват ВСЕГО чтения (опасно)\n`__getattribute__(self, name)` вызывается на **каждое** обращение к атрибуту, даже к существующему — это «главные ворота», через которые проходит вообще всё, и только если он не нашёл атрибут, в дело вступает `__getattr__`. Переопределять его почти никогда не нужно. Та же ловушка рекурсии: внутри обращайтесь к атрибутам исключительно через `object.__getattribute__(self, name)`, иначе `self.что_угодно` снова войдёт в `__getattribute__`.\n\n## Практический вывод\n`__getattr__` — безопасный и частый инструмент. `__setattr__` — иногда (валидация, заморозка). `__getattribute__` — крайне редко и осторожно. Все они, как и прочие dunder, при *неявном* вызове ищутся по типу, а не по экземпляру.",
			code: {
				title: "getattr / setattr / getattribute и их ловушки",
				language: 'python',
				code: String.raw`# Динамические атрибуты: __getattr__, __setattr__, __getattribute__

# --- 1. __getattr__ вызывается ТОЛЬКО при отсутствии атрибута обычным путём ---
class Config:
    def __init__(self, data):
        # кладём в __dict__ напрямую — обычные атрибуты НЕ идут через __getattr__
        self._data = data

    def __getattr__(self, name):
        # сюда попадаем, только если обычный поиск провалился
        try:
            return self._data[name]
        except KeyError:
            raise AttributeError(f"нет ключа {name!r} в конфиге")


cfg = Config({"host": "localhost", "port": 8080})
print("cfg.host:", cfg.host)      # нет атрибута host -> __getattr__ -> data['host']
print("cfg.port:", cfg.port)
print("cfg._data доступен напрямую (без __getattr__):", cfg._data)
try:
    cfg.missing
except AttributeError as e:
    print("AttributeError:", e)

# --- 2. __setattr__ перехватывает ЛЮБОЕ присваивание (опасно!) ---
class Frozen:
    def __init__(self, **kw):
        # обойти собственный __setattr__ можно только через object.__setattr__
        for k, v in kw.items():
            object.__setattr__(self, k, v)

    def __setattr__(self, name, value):
        raise AttributeError(f"объект заморожен, нельзя менять {name!r}")


p = Frozen(x=1, y=2)
print("Frozen p.x, p.y:", p.x, p.y)
try:
    p.x = 99
except AttributeError as e:
    print("при попытке записи:", e)

# --- 3. __getattribute__ вызывается на КАЖДЫЙ доступ (легко уйти в рекурсию) ---
class Logged:
    def __getattribute__(self, name):
        # ВАЖНО: внутри обращаться через object.__getattribute__,
        # иначе self.<что-то> -> снова __getattribute__ -> бесконечная рекурсия
        print(f"  доступ к атрибуту {name!r}")
        return object.__getattribute__(self, name)


obj = Logged()
object.__setattr__(obj, "value", 42)
print("читаем obj.value:")
print("получили:", obj.value)`,
				explanation: "`cfg.host` нет среди реальных атрибутов, поэтому срабатывает `__getattr__` и достаёт ключ из словаря; а `cfg._data` — настоящий атрибут, и `__getattr__` для него НЕ вызывается. `Frozen` блокирует любую запись (кроме обхода через `object.__setattr__`). `Logged` логирует каждое чтение и при этом не уходит в рекурсию только потому, что внутри использует `object.__getattribute__`."
			}
		}
	],
	tasks: [
		{
			id: 'oop-d7-t1',
			difficulty: "base",
			prompt: "Реализуйте класс `RingBuffer(capacity)` — кольцевой буфер фиксированной ёмкости. Метод `push(x)` добавляет элемент; когда элементов становится больше `capacity`, самый старый выталкивается. Класс должен поддерживать контейнерный протокол: `len(rb)`, индексацию `rb[i]` (включая отрицательные индексы и срезы), итерацию в `for`, и оператор `in`. Порядок элементов — от старых к новым.",
			hint: "Храните элементы в обычном `list`. В `push` после `append` проверяйте `len > capacity` и делайте `pop(0)`. Для `__getitem__` достаточно вернуть `self._data[i]` — список сам обработает и `int`, и `slice`, и отрицательные индексы. `__len__` и `__contains__` делегируйте списку.",
			solution: "Кольцевой буфер поверх `list`. `__getitem__` просто проксирует к внутреннему списку — это бесплатно даёт срезы, отрицательные индексы и (через запасной путь) итерацию; `__contains__` ускоряет `in`.\n\n```python\nclass RingBuffer:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self._data = []\n\n    def push(self, x):\n        self._data.append(x)\n        if len(self._data) > self.capacity:\n            self._data.pop(0)   # выталкиваем самый старый\n\n    def __len__(self):\n        return len(self._data)\n\n    def __getitem__(self, i):\n        return self._data[i]    # slice и int отдаём list'у\n\n    def __contains__(self, value):\n        return value in self._data\n\n    def __repr__(self):\n        return f\"RingBuffer({self._data!r}, cap={self.capacity})\"\n\n\nrb = RingBuffer(3)\nfor i in range(1, 6):\n    rb.push(i)\nprint(rb)                       # последние 3: [3, 4, 5]\nassert len(rb) == 3\nassert rb[0] == 3 and rb[-1] == 5\nassert list(rb) == [3, 4, 5]\nassert 4 in rb and 1 not in rb\nassert rb[1:] == [4, 5]\nprint(\"RingBuffer OK\")\n```",
			answer: "Класс с `__len__`, `__getitem__` (проксирует к `list`), `__contains__`; `push` выталкивает старейший через `pop(0)` при переполнении.",
			xp: 12
		},
		{
			id: 'oop-d7-t2',
			difficulty: "base",
			prompt: "Напишите контекст-менеджер `transaction(target)` для списка, реализующий транзакцию с откатом. При входе в `with` он запоминает снимок списка. Если блок завершился нормально — изменения остаются. Если внутри возникло **любое** исключение — список откатывается к снимку, а само исключение НЕ подавляется (пробрасывается наружу). `__enter__` должен вернуть сам список, чтобы с ним работать через `as`.",
			hint: "В `__enter__` сохраните копию: `self._backup = list(self.target)` и верните `self.target`. В `__exit__(self, exc_type, exc_val, tb)`: если `exc_type is not None`, восстановите содержимое через срезовое присваивание `self.target[:] = self._backup` (важно менять список на месте, а не переприсваивать). Верните `False`, чтобы не глотать исключение.",
			solution: "Снимок в `__enter__`, восстановление в `__exit__` при `exc_type is not None`. Ключевая деталь — `target[:] = backup` меняет список *на месте*, поэтому внешняя переменная видит откат. `return False` пробрасывает исключение.\n\n```python\nclass transaction:\n    def __init__(self, target):\n        self.target = target\n\n    def __enter__(self):\n        self._backup = list(self.target)   # снимок состояния\n        return self.target\n\n    def __exit__(self, exc_type, exc_val, tb):\n        if exc_type is not None:\n            self.target[:] = self._backup   # откат на месте\n            print(f\"откат из-за {exc_type.__name__}\")\n        return False   # не глотаем исключение\n\n\ndata = [1, 2, 3]\nwith transaction(data) as d:\n    d.append(4)\n    d.append(5)\nprint(\"после успешной транзакции:\", data)\nassert data == [1, 2, 3, 4, 5]\n\ntry:\n    with transaction(data) as d:\n        d.append(6)\n        raise ValueError(\"боом\")\nexcept ValueError:\n    pass\nprint(\"после неудачной транзакции:\", data)\nassert data == [1, 2, 3, 4, 5]   # 6 откатился\nprint(\"transaction OK\")\n```",
			answer: "Контекст-менеджер сохраняет `list(target)` в `__enter__`; в `__exit__` при `exc_type is not None` делает `target[:] = backup` и возвращает `False`.",
			xp: 14
		},
		{
			id: 'oop-d7-t3',
			difficulty: "star",
			prompt: "Реализуйте бесконечный генератор `fibonacci()`, выдающий 0, 1, 1, 2, 3, 5, ... и класс-iterable `take(n, source)`, который при итерации выдаёт первые `n` элементов из любого `source` (списка, генератора, другого iterable). `take` не должен падать, если `source` короче `n`. Сделайте `take` **переиспользуемым** iterable: если `source` — обычный список, повторный `for` по одному и тому же объекту `take` должен снова выдать те же элементы.",
			hint: "`fibonacci`: `a, b = 0, 1; while True: yield a; a, b = b, a + b`. Для `take` определите `__iter__` как генераторный метод (с `yield` внутри): на каждый вызов он создаёт свежий `it = iter(self.source)` и выдаёт максимум `n` элементов, ловя `StopIteration`. Поскольку `__iter__` создаёт новый `iter(source)` при каждом вызове, повторная итерация по переиспользуемому источнику работает. Учтите: если `source` — одноразовый генератор, повторный обход даст пусто (это корректное поведение, не баг).",
			solution: "`fibonacci` — классический бесконечный генератор. `take.__iter__` сделан генераторным методом: каждый вызов `iter(take_obj)` запускает его заново и берёт свежий `iter(self.source)`. Для списка это даёт повторяемость; для одноразового генератора — нет (и это правильно).\n\n```python\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nclass take:\n    \"\"\"Iterable: первые n элементов из любого iterable.\n    Если source — одноразовый генератор, повторный обход даст пусто.\"\"\"\n    def __init__(self, n, source):\n        self.n = n\n        self.source = source\n\n    def __iter__(self):\n        it = iter(self.source)\n        for _ in range(self.n):\n            try:\n                yield next(it)\n            except StopIteration:\n                return\n\nprint(\"первые 10 Фибоначчи:\", list(take(10, fibonacci())))\nassert list(take(10, fibonacci())) == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n\n# не падает, если источник короче:\nassert list(take(100, [1, 2, 3])) == [1, 2, 3]\n\n# источник-список можно обойти повторно (list даёт свежий iter каждый раз):\nt = take(3, [10, 20, 30, 40])\nassert list(t) == [10, 20, 30]\nassert list(t) == [10, 20, 30]\nprint(\"take OK\")\n```",
			answer: "`fibonacci` — `while True: yield a; a, b = b, a+b`. `take.__iter__` — генераторный метод, берёт свежий `iter(source)` и выдаёт до `n` элементов, ловя `StopIteration`; переиспользуемость следует из создания нового `iter(source)` при каждом `__iter__`.",
			xp: 25
		}
	],
	mastery: [
		"Различаю iterable и iterator: знаю, что `for` делает `iter()` затем `next()` до `StopIteration`, что итератор возвращает `self` из `__iter__` и одноразов, а iterable-фабрика отдаёт свежий итератор на каждый проход.",
		"Реализую контейнерный протокол осознанно: понимаю, что `len()`/`[]`/`in` ищутся по типу объекта, обрабатываю в `__getitem__` и `int`, и `slice`, и кидаю правильные исключения (`IndexError`/`KeyError`/`TypeError`).",
		"Пишу корректный контекст-менеджер: знаю смысл `exc_type`/`exc_val`/`tb` в `__exit__`, понимаю, что возврат `True` подавляет исключение, а `__exit__` выполняется всегда; умею выразить то же через `@contextlib.contextmanager`.",
		"Применяю `__call__` для объектов-состояний и понимаю, когда это лучше замыкания (видимое, инспектируемое, тестируемое состояние); распознаю паттерн декоратора-класса.",
		"Понимаю перехват атрибутов: `__getattr__` срабатывает только при отсутствии атрибута и должен кидать `AttributeError`; `__setattr__`/`__getattribute__` перехватывают всё подряд и требуют обхода через `object.__...__` во избежание бесконечной рекурсии."
	]
};
