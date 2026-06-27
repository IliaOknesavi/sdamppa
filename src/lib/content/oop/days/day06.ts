import type { Day } from '$lib/types';

export const day06: Day = {
	n: 6,
	phaseId: "protocol",
	kind: 'theory',
	title: "Dunder-методы I: repr, сравнение, операторы",
	est: '1–2 ч',
	goal: "Научиться реализовывать протоколы Python через dunder-методы: давать объектам осмысленное представление (`__repr__`/`__str__`/`__format__`), корректно сравнивать их (`__eq__` в связке с `__hash__`, упорядочивание через [[total-ordering|total_ordering]]) и перегружать операторы (включая отражённые `__radd__` и на месте `__iadd__`), не нарушая контрактов языка.",
	sections: [
		{
			kind: "definition",
			heading: "Что такое dunder-методы: протоколы, которые Python зовёт за тебя",
			body: "*Dunder* (от *double underscore*, «двойное подчёркивание») — это методы с именами вида `__name__`: `__repr__`, `__eq__`, `__add__`, `__len__` и десятки других. Их часто зовут «магическими», но магии тут нет: это просто **точки расширения протоколов**. Python договорился, что когда ты пишешь обычный синтаксис — `a + b`, `x == y`, `repr(o)`, `len(c)`, `if obj:` — интерпретатор под капотом вызывает соответствующий dunder.\n\nКлючевая идея, которую важно прочувствовать: **ты почти никогда не зовёшь эти методы напрямую**. Ты пишешь `a + b`, а Python сам ищет `type(a).__add__`. Ты пишешь `len(c)`, а Python зовёт `type(c).__len__()`. Поэтому говорят: dunder-методы — это [[protocol|протокол]], а встроенные функции и операторы — *синтаксический фасад* над ними.\n\n## Две важные тонкости поиска\n\n1. Для **неявных вызовов через синтаксис и встроенные функции** (операторы, `len`, `iter`, `with` и т.д.) Python ищет dunder **на типе, а не на экземпляре**. То есть `len(x)` — это по сути `type(x).__len__(x)`, и `x.__len__`, навешенный прямо на экземпляр, будет проигнорирован. Это называется *implicit special method lookup* и сделано ради скорости и предсказуемости.\n2. Имена с двойным подчёркиванием с обеих сторон (`__eq__`) **не** подвергаются *name mangling* — искажению имён. Mangling касается только имён вида `__name` (две впереди, не больше одной сзади), которые внутри класса превращаются в `_ClassName__name`. Это разные механизмы, не путай.\n\nДальше за день мы разберём три семьи протоколов: представление (`repr`/`str`/`format`), идентичность и порядок (`eq`/`hash`/сравнения), арифметику (операторы) и истинность (`bool`/`len`)."
		},
		{
			kind: "definition",
			heading: "__repr__ против __str__ и кастомный __format__",
			body: "У объекта два «текстовых лица», и они служат **разным аудиториям**:\n\n- `__repr__` — для *разработчика*. Цель: однозначность и отладка. Идеал — **eval-обратимость**: `eval(repr(x))` должно по возможности воссоздать эквивалентный объект. Классический шаблон — `ClassName(field=value, ...)`. Именно `repr` ты видишь в REPL, в отладчике и когда печатаешь *контейнер* (`print([obj])` зовёт `repr` каждого элемента, а не `str`).\n- `__str__` — для *пользователя*. Цель: читаемость. Это то, что выдаёт `print(obj)` и `str(obj)`.\n\n## Правило отката\n\nЕсли `__str__` **не** определён, `str(obj)` откатывается на `__repr__`. Обратного отката нет: `repr` без `__str__` работает, а вот без `__repr__` ты получишь невнятное `<__main__.Foo object at 0x...>`. Поэтому **минимальный осмысленный класс определяет хотя бы `__repr__`** — это даёт пользу и в логах, и в отладчике, и в контейнерах бесплатно.\n\n## __format__ и мини-язык спецификаций\n\nf-строки и `format()` зовут `__format__(self, spec)`, где `spec` — то, что стоит после двоеточия: в `f\"{x:.2f}\"` это `.2f`. По умолчанию (для `object`) при пустом `spec` отдаётся `str(self)`. Переопределив `__format__`, ты можешь завести **свой мини-язык форматирования** для типа — например, выбирать единицы измерения. Важно: `format(x, \"\")`, `f\"{x}\"` и `str(x)` — это *не* одно и то же по механизму, хотя часто совпадают по результату; `f\"{x}\"` идёт через `__format__` с пустым spec, а `str(x)` — через `__str__`.\n\nВ примере ниже у `Temperature` `repr` eval-обратим, `str` человекочитаем, а `__format__` понимает суффикс `F` как «переведи в Фаренгейты», отдавая остальную часть спецификации числу.",
			code: {
				title: "repr / str / format на одном классе",
				language: 'python',
				code: String.raw`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    def __repr__(self):
        # Однозначно, в идеале eval-обратимо: eval(repr(x)) == x
        return f"Temperature(celsius={self.celsius!r})"

    def __str__(self):
        # Для пользователя
        return f"{self.celsius} °C"

    def __format__(self, spec):
        # Свой мини-язык спецификаций: '<float-spec>F' -> Фаренгейты.
        # Иначе спецификацию целиком отдаём числу градусов Цельсия.
        if spec.endswith("F"):
            num = self.celsius * 9 / 5 + 32
            return f"{format(num, spec[:-1] + 'f')} °F"
        return format(self.celsius, spec)

t = Temperature(36.6)
print("str()  ->", str(t))
print("repr() ->", repr(t))
print("в контейнере ->", [t])          # контейнер зовёт repr элементов
print("f'{t}'      ->", f"{t}")        # пустой spec -> format(t, "")
print("f'{t:.2f}'  ->", f"{t:.2f}")    # спец уходит числу Цельсия
print("f'{t:.1F}'  ->", f"{t:.1F}")    # наш флаг -> Фаренгейты, точность .1

# eval-обратимость repr
t2 = eval(repr(t))
print("eval(repr(t)).celsius == t.celsius ->", t2.celsius == t.celsius)

# Нет __str__ -> str() падает обратно на __repr__
class OnlyRepr:
    def __repr__(self):
        return "OnlyRepr()"
print("str() без __str__ ->", str(OnlyRepr()))`,
				explanation: "Смотри: `print([t])` печатает `repr`, а не `str` — контейнеры всегда зовут `repr` элементов. `f\"{t}\"` идёт через `__format__` с пустым `spec` (он у нас вернул число Цельсия), `f\"{t:.1F}\"` сработал нашим кастомным флагом Фаренгейтов, а `OnlyRepr` без `__str__` корректно откатился на `__repr__`."
			}
		},
		{
			kind: "derivation",
			heading: "Равенство __eq__ и его контракт с __hash__",
			body: "Это самый коварный сюжет дня, на котором спотыкаются даже опытные. Сначала факты, потом — *почему именно так*.\n\n## Контракт хешируемости\n\nОбъект *хешируем*, если у него есть осмысленный `__hash__`, и работают два инварианта:\n1. **Постоянство**: за время жизни объекта `hash(x)` не меняется.\n2. **Согласованность с равенством**: `a == b` ⇒ `hash(a) == hash(b)`. Обратное *не* требуется (разные объекты могут иметь равный хеш — это коллизия, нормальная вещь).\n\nЗачем это нужно: `set` и `dict` сначала прыгают по *хешу* (быстрый поиск корзины), а потом внутри корзины проверяют *равенство* через `__eq__`. Если два равных объекта дадут разные хеши, они попадут в разные корзины — и словарь будет считать их разными ключами. Структура данных молча сломается, без исключения. Поэтому нарушение `a == b ⇒ hash(a) == hash(b)` — это не «некрасиво», это **тихий баг поиска**.\n\n## Ловушка: определил __eq__ — потерял хеш\n\nВот неочевидное правило CPython: **как только ты определяешь `__eq__`, Python автоматически выставляет `__hash__ = None`**, делая объект *нехешируемым*. Логика железная: дефолтный `__hash__` основан на `id()` (идентичности), а твой новый `__eq__` — на *значении*. Они рассогласованы: два равных по значению объекта имели бы разные `id`-хеши, и контракт бы рухнул. Python предпочитает упасть громко (`TypeError: unhashable`) при попытке `hash()`, чем дать тихо испортить `set`/`dict`.\n\n## Как вернуть хешируемость\n\nОпределить `__hash__` явно — **по тем же полям, что и `__eq__`**. Тогда контракт восстановлен. Отсюда же вытекает связь с *неизменяемостью*: хешировать стоит только поля, которые не меняются за время жизни объекта (иначе нарушится инвариант постоянства). Поэтому хешируемые value-типы обычно делают **неизменяемыми**, а мутабельные (`list`, `dict`, `set`) — наоборот, нехешируемы by design.\n\n(Если объект задуман нехешируемым осознанно — можно явно написать `__hash__ = None`.)",
			code: {
				title: "__eq__ обнуляет __hash__ — и как это починить",
				language: 'python',
				code: String.raw`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

p = Point(1, 2)
print("__hash__ у Point ->", Point.__hash__)   # None!
try:
    hash(p)
except TypeError as e:
    print("hash(p) кидает:", e)

try:
    {p}                                         # попытка положить в set
except TypeError as e:
    print("{p} (set) кидает:", e)

# Фикс: определяем __hash__ по тем же полям, что и __eq__
class FixedPoint(Point):
    def __hash__(self):
        return hash((self.x, self.y))

q1, q2 = FixedPoint(1, 2), FixedPoint(1, 2)
print("q1 == q2 ->", q1 == q2, "| hash совпал ->", hash(q1) == hash(q2))
print("в set равные схлопнулись ->", {q1, q2})

# Для сравнения: класс без __eq__ хешируется по id, равен только сам себе
class Plain:
    pass
print("Два разных Plain не равны ->", Plain() != Plain())`,
				explanation: "`Point.__hash__` равен `None` — само определение `__eq__` обнулило его, и `hash(p)`/`{p}` падают с `unhashable type`. Наследник `FixedPoint` добавляет `__hash__` по той же паре `(x, y)` — равные объекты дают равный хеш, и `set` корректно схлопывает дубликаты."
			}
		},
		{
			kind: "intuition",
			heading: "Упорядочивание: __lt__ и functools.total_ordering",
			body: "Сравнения `<`, `<=`, `>`, `>=` зовут `__lt__`, `__le__`, `__gt__`, `__ge__`. Писать все четыре руками — скучно и опасно (легко рассинхронить логику). Тут помогает декоратор [[total-ordering|functools.total_ordering]].\n\n## Что делает total_ordering\n\nТы определяешь **`__eq__` и ровно один** из методов порядка (обычно `__lt__`). Декоратор *синтезирует* остальные три, выводя их логически: например `a > b` ≡ `b < a`, `a <= b` ≡ `not (b < a)` и т.д. Это убирает дублирование и гарантирует согласованность.\n\n## Тонкости, которые надо знать\n\n- `total_ordering` **не** трогает `__hash__`. Раз ты определил `__eq__`, хеш всё так же обнулится — `__hash__` пиши сам, если объект должен быть хешируемым.\n- Синтезированные методы чуть медленнее рукописных (лишний вызов). Для горячего кода иногда определяют все четыре вручную; для обычного — `total_ordering` предпочтительнее как менее ошибочный.\n- **Возвращай `NotImplemented`** (не `False`!) для чужих типов. `NotImplemented` — это сигнал «я не умею сравниваться с этим», после которого Python пробует *отражённую* операцию у второго операнда, и лишь затем — для `==` падает в `id`-сравнение, а для `<` кидает `TypeError`. Если вернуть `False`, ты соврёшь и сломаешь, например, сравнение с совместимым типом.\n\nХороший приём — свести объект к **кортежу-ключу** (`self._key()`), и `__eq__`, `__lt__`, `__hash__` все опираются на этот ключ. Кортежи сравниваются и хешируются лексикографически из коробки, так что вся семантика порядка/равенства/хеша задаётся одним местом.",
			code: {
				title: "total_ordering на классе Version + ключ-кортеж",
				language: 'python',
				code: String.raw`from functools import total_ordering

@total_ordering
class Version:
    __slots__ = ("major", "minor", "patch")
    def __init__(self, major, minor, patch):
        self.major, self.minor, self.patch = major, minor, patch

    def _key(self):
        return (self.major, self.minor, self.patch)

    def __repr__(self):
        return f"Version({self.major}, {self.minor}, {self.patch})"

    def __eq__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self._key() == other._key()

    def __lt__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self._key() < other._key()

    # Раз определили __eq__ — вернём хешируемость явно (тот же ключ).
    def __hash__(self):
        return hash(self._key())

a = Version(1, 2, 0)
b = Version(1, 10, 0)
c = Version(1, 2, 0)

print("a < b  ->", a < b)
print("a <= c ->", a <= c)     # <= синтезирован из __eq__ и __lt__
print("b > a  ->", b > a)      # > синтезирован
print("sorted ->", sorted([b, a, c]))
print("есть __le__:", hasattr(Version, "__le__"),
      "| есть __gt__:", hasattr(Version, "__gt__"))

# Контракт eq/hash соблюдён -> можно как ключ словаря
counts = {a: 5}
counts[c] += 1                 # c равен a по значению -> тот же ключ
print("counts по ключу-версии ->", counts)`,
				explanation: "Определены только `__eq__` и `__lt__`, но `<=`, `>`, `>=` работают — их синтезировал `total_ordering` (`hasattr(Version, \"__le__\")` подтверждает). Версия `c` равна `a` по ключу-кортежу, поэтому `counts[c] += 1` бьёт в тот же ключ словаря: контракт eq/hash соблюдён вручную добавленным `__hash__`."
			}
		},
		{
			kind: "derivation",
			heading: "Перегрузка арифметики: __add__, отражённый __radd__, на месте __iadd__",
			body: "Операторы `+ - * /` зовут `__add__`, `__sub__`, `__mul__`, `__truediv__` и т.д. Здесь важно понять **алгоритм диспетчеризации** Python для бинарного `a + b`:\n\n1. Python зовёт `type(a).__add__(a, b)`. Если тот вернул что угодно, кроме `NotImplemented`, — это и есть результат.\n2. Если `__add__` вернул `NotImplemented` (или его нет), Python пробует **отражённый** метод: `type(b).__radd__(b, a)`. Это шанс правого операнда сказать «я знаю, как меня складывать слева».\n3. Если и он вернул `NotImplemented` — `TypeError: unsupported operand type(s)`.\n\n## Зачем нужен __radd__\n\nКлассический случай: `3 * vector`. У `int` есть `__mul__`, но он не знает про твой `Vector2D` и вернёт `NotImplemented`. Тогда Python зовёт `vector.__rmul__(3)` — и вот ты ловишь операцию, где твой объект *справа*. Без отражённых методов `v * 3` работал бы, а `3 * v` — падал. Ещё одно важное применение `__radd__` — заставить работать `sum([...])`: `sum` стартует с `int 0`, и первый шаг `0 + obj` идёт через `obj.__radd__(0)`.\n\n## На месте: __iadd__\n\n`a += b` — это **не** всегда то же, что `a = a + b`. Python сначала ищет `__iadd__` (*in-place*). Если он есть — объект может **мутировать себя** и вернуть `self`, что важно для производительности на больших структурах (`list.__iadd__` так и делает — extend без копии). Если `__iadd__` **нет**, `+=` разворачивается в `a = a + b`: создаётся *новый* объект, и имя `a` перевешивается на него; исходный объект не тронут. Для *неизменяемых* типов это правильное поведение — поэтому `int`, `str`, `tuple` не имеют `__iadd__`, и `x += 1` создаёт новый `int`.\n\nПравило проектирования: `__iadd__` мутирующий уместен только у изменяемых типов; у value-типов либо не определяй его (пусть откатывается на `__add__`), либо возвращай новый объект.",
			code: {
				title: "__add__ / __rmul__ / поведение += без __iadd__",
				language: 'python',
				code: String.raw`class Vector2D:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Vector2D({self.x}, {self.y})"

    def __eq__(self, other):
        if not isinstance(other, Vector2D):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

    def __add__(self, other):
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self.x - other.x, self.y - other.y)

    def __mul__(self, k):                 # v * 3
        if not isinstance(k, (int, float)):
            return NotImplemented
        return Vector2D(self.x * k, self.y * k)

    def __rmul__(self, k):                 # 3 * v  -> int не умеет -> v.__rmul__(3)
        return self.__mul__(k)

v = Vector2D(1, 2)
w = Vector2D(10, 20)
print("v + w   ->", v + w)
print("w - v   ->", w - v)
print("v * 3   ->", v * 3)     # __mul__
print("3 * v   ->", 3 * v)     # __rmul__

# Без __iadd__: += создаёт НОВЫЙ объект и перевешивает имя
before = v
v += w                          # == v = v.__add__(w)
print("v += w даёт новый объект? ->", v is not before, "| v =", v)
print("старое имя не тронуто ->", before)`,
				explanation: "`v * 3` идёт через `__mul__`, а `3 * v` — через `__rmul__` (у `int` нет умножения на `Vector2D`, он отдаёт ход вправо). Поскольку `__iadd__` не определён, `v += w` разворачивается в `v = v + w`: `v is not before` истинно — создан новый объект, а исходный `before` остался прежним."
			}
		},
		{
			kind: "connection",
			heading: "Истинность объекта: __bool__ и роль __len__",
			body: "Когда Python проверяет объект в логическом контексте — `if obj:`, `while obj:`, `bool(obj)`, `not obj` — он определяет «правдивость» по строгому алгоритму:\n\n1. Если есть `__bool__` — зовёт его, ждёт `True`/`False`.\n2. Иначе если есть `__len__` — зовёт его; `len() == 0` ⇒ `False`, любое положительное ⇒ `True`.\n3. Иначе объект считается **всегда истинным**.\n\nОтсюда практические следствия:\n\n- **`__bool__` имеет приоритет над `__len__`.** Можно сделать контейнер, который непуст по `len`, но логически «выключен» через `__bool__` — хотя так обычно делать не стоит, это сбивает интуицию.\n- Для **коллекций почти всегда достаточно `__len__`** — он и `len(obj)` обслуживает, и истинность даёт бесплатно. Отдельный `__bool__` для контейнера избыточен.\n- `__len__` обязан вернуть **неотрицательное целое**; отрицательное — `ValueError`, нецелое — `TypeError`. Это защищает инварианты `len()`.\n\nТипичная ошибка новичка — `if obj == None` или забытый `__bool__`/`__len__`, из-за чего «пустой» доменный объект в `if` неожиданно считается истинным (потому что сработала ветка 3). Если у твоего value-типа есть осмысленное понятие «нулевой/пустой», дай ему `__bool__` (как `Money(0) → False` в капстоуне ниже) или `__len__`.",
			code: {
				title: "Приоритет __bool__ над __len__ и откат к True",
				language: 'python',
				code: String.raw`class Bag:
    def __init__(self, items):
        self._items = list(items)
    def __len__(self):
        return len(self._items)
    def __repr__(self):
        return f"Bag({self._items!r})"

empty, full = Bag([]), Bag([1, 2])
# Нет __bool__ -> Python зовёт __len__: 0 -> False, иначе True
print("bool(empty) ->", bool(empty), "| bool(full) ->", bool(full))
print("if full -> ветка:", "да" if full else "нет")

class AlwaysOn:
    def __len__(self):
        return 0          # сказали бы False...
    def __bool__(self):
        return True       # ...но __bool__ имеет приоритет над __len__
print("AlwaysOn (len==0, bool=True) ->", bool(AlwaysOn()))

class Plain:
    pass
print("Без __bool__/__len__ — всегда True ->", bool(Plain()))

class Bad:
    def __len__(self):
        return -1         # __len__ обязан вернуть >= 0
try:
    bool(Bad())
except ValueError as e:
    print("len()<0 запрещён:", e)`,
				explanation: "`Bag` без `__bool__` берёт истинность из `__len__`. `AlwaysOn` показывает приоритет: `len == 0`, но `bool == True`, потому что `__bool__` проверяется первым. `Plain` без обоих методов всегда истинен (ветка 3), а отрицательный `__len__` ловится как `ValueError`."
			}
		},
		{
			kind: "note",
			heading: "Капстоун: класс Money со всеми протоколами",
			body: "Собираем всё вместе на типе [[money|Money]] — это образцовый *неизменяемый value-тип*: деньги в копейках (целые), одна валюта. Здесь сошлись все сегодняшние решения:\n\n- **Хранение в копейках** (`_cents`, целое) — чтобы не страдать от ошибок `float` при сложении денег. `0.1 + 0.2 != 0.3` для float, поэтому деньги *никогда* не держат во float-рублях.\n- **`__repr__` / `__str__`** — отладочное `Money(99.9, 'RUB')` и пользовательское `99.90 RUB`.\n- **`__eq__` + `__hash__`** по паре `(_cents, currency)` — равные суммы одной валюты равны и дают равный хеш ⇒ `Money` годится как ключ словаря и элемент `set`.\n- **`total_ordering`** + один `__lt__` ⇒ полный порядок; `sorted([...])` работает.\n- **`__add__`/`__sub__`/`__mul__`** с проверкой валюты (нельзя складывать рубли с долларами — это `ValueError`), `__rmul__ = __mul__` для `2 * money`.\n- **`__bool__`** ⇒ `Money(0)` ложно (удобно: `if balance:`).\n- Конструктор-классметод `_from_cents` создаёт объект *без повторного round* из уже готовых копеек — внутренние операции не теряют точность.\n\nОбрати внимание на `__rmul__ = __mul__`: присвоение метода — корректный приём, раз умножение коммутативно. И `_check` централизует правило «одна валюта», чтобы оно не размазалось по всем операторам.",
			code: {
				title: "Money: repr/eq/hash + total_ordering + операторы + ключ словаря",
				language: 'python',
				code: String.raw`from functools import total_ordering

@total_ordering
class Money:
    """Сумма в копейках одной валюты. Неизменяемый (хешируемый) тип."""
    __slots__ = ("_cents", "currency")

    def __init__(self, amount, currency="RUB"):
        self._cents = round(amount * 100)   # храним в копейках, не во float
        self.currency = currency

    @classmethod
    def _from_cents(cls, cents, currency):
        obj = cls.__new__(cls)
        obj._cents = cents
        obj.currency = currency
        return obj

    def __repr__(self):
        return f"Money({self._cents / 100!r}, {self.currency!r})"

    def __str__(self):
        return f"{self._cents / 100:.2f} {self.currency}"

    def _check(self, other):
        if other.currency != self.currency:
            raise ValueError(f"нельзя смешивать {self.currency} и {other.currency}")

    def __eq__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return (self._cents, self.currency) == (other._cents, other.currency)

    def __lt__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        self._check(other)
        return self._cents < other._cents

    def __hash__(self):
        return hash((self._cents, self.currency))

    def __add__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        self._check(other)
        return Money._from_cents(self._cents + other._cents, self.currency)

    def __sub__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        self._check(other)
        return Money._from_cents(self._cents - other._cents, self.currency)

    def __mul__(self, k):
        if not isinstance(k, (int, float)):
            return NotImplemented
        return Money._from_cents(round(self._cents * k), self.currency)

    __rmul__ = __mul__

    def __bool__(self):
        return self._cents != 0

price, tax = Money(99.90), Money(19.98)
print("repr ->", repr(price), "| str ->", str(price))
print("price + tax ->", price + tax)
print("price * 3   ->", price * 3, "| 2 * tax ->", 2 * tax)
print("price > tax ->", price > tax)
print("sorted ->", sorted([Money(5), Money(1), Money(3)]))
print("bool(Money(0)) ->", bool(Money(0)), "| bool(price) ->", bool(price))

# Равные суммы -> равный хеш -> Money годится в ключи и множества
wallet = {Money(10): "десятка", Money(20): "двадцатка"}
print("ключ Money(10) ->", wallet[Money(10)])
print("set схлопывает равные ->", {Money(7), Money(7), Money(8)})

try:
    Money(1, "RUB") + Money(1, "USD")
except ValueError as e:
    print("разные валюты:", e)`,
				explanation: "Один класс закрывает всю тему дня: `repr`/`str`, операторы (`+`, `*`, отражённое `2 * tax`), полный порядок от `total_ordering` (`sorted` сработал), `__bool__` (`Money(0)` ложно). Контракт eq/hash соблюдён — `Money(10)` работает как ключ словаря, а `set` схлопывает равные суммы; смешение валют корректно отвергается `ValueError`."
			}
		}
	],
	tasks: [
		{
			id: 'oop-d6-t1',
			difficulty: "base",
			prompt: "Реализуй неизменяемый класс `Fraction` (рациональная дробь) с полями `num`, `den`. Требования: (1) в конструкторе нормализуй дробь к несократимому виду и держи знак в числителе (`Fraction(2, 4)` и `Fraction(1, 2)` должны быть равны); запрещай нулевой знаменатель. (2) Реализуй `__repr__`, `__eq__`, `__hash__` так, чтобы равные дроби давали равный хеш и дробь годилась в `set`. (3) Сделай дробь сравнимой (`<`, `<=`, `>`, `>=`) через `functools.total_ordering`, определив только `__lt__`. (4) Реализуй `__add__`. Проверь: `Fraction(2,4) == Fraction(1,2)`, `hash` совпадает, `Fraction(1,2)+Fraction(1,3) == Fraction(5,6)`, `sorted` и `set` работают.",
			hint: "Сведи дробь к ключу `(num, den)` после деления на `gcd`. Сравнение дробей `a/b < c/d` без float — через перекрёстное умножение `a*d < c*b` (знаменатели положительны после нормализации). `__eq__` и `__hash__` — по нормализованной паре. Не забудь вернуть `NotImplemented` для чужих типов.",
			solution: "Ключ — нормализация в конструкторе: делим на `gcd`, знак переносим в числитель. Тогда `__eq__`/`__hash__` по паре `(num, den)` автоматически уравнивают `2/4` и `1/2`. Сравнение без float — перекрёстным умножением.\n\n```python\nfrom functools import total_ordering\nfrom math import gcd\n\n@total_ordering\nclass Fraction:\n    __slots__ = (\"num\", \"den\")\n    def __init__(self, num, den=1):\n        if den == 0:\n            raise ZeroDivisionError(\"знаменатель не может быть 0\")\n        if den < 0:                 # знак держим в числителе\n            num, den = -num, -den\n        g = gcd(num, den) or 1      # нормализация к несократимому виду\n        self.num, self.den = num // g, den // g\n\n    def __repr__(self):\n        return f\"Fraction({self.num}, {self.den})\"\n\n    def __eq__(self, other):\n        if not isinstance(other, Fraction):\n            return NotImplemented\n        return (self.num, self.den) == (other.num, other.den)\n\n    def __lt__(self, other):\n        if not isinstance(other, Fraction):\n            return NotImplemented\n        return self.num * other.den < other.num * self.den\n\n    def __hash__(self):\n        return hash((self.num, self.den))\n\n    def __add__(self, other):\n        if not isinstance(other, Fraction):\n            return NotImplemented\n        return Fraction(self.num * other.den + other.num * self.den,\n                        self.den * other.den)\n\nprint(Fraction(2, 4) == Fraction(1, 2))                  # True\nprint(hash(Fraction(2, 4)) == hash(Fraction(1, 2)))      # True\nprint(Fraction(1, 2) + Fraction(1, 3))                   # Fraction(5, 6)\nprint(sorted([Fraction(3, 4), Fraction(1, 2), Fraction(2, 3)]))\nprint({Fraction(2, 4), Fraction(1, 2)})                  # один элемент\n```",
			answer: "См. solution: класс Fraction с нормализацией через gcd, total_ordering, hash по (num, den).",
			xp: 12
		},
		{
			id: 'oop-d6-t2',
			difficulty: "base",
			prompt: "Дан класс `Vec` (2D-вектор) с готовым `__add__`. Сделай так, чтобы встроенная функция `sum([Vec(1,1), Vec(2,3), Vec(-1,0)])` возвращала `Vec(2,4)`, и при этом не падала. Объясни в комментарии, почему без твоего метода `sum` ломается. Также убедись, что `0 + Vec(5,5)` даёт `Vec(5,5)`.",
			hint: "`sum` стартует с целого `0` и делает `0 + first_vec`. У `int.__add__` нет понятия о `Vec`, он вернёт `NotImplemented`, и Python позовёт `Vec.__radd__(0)`. Реализуй `__radd__`: если левый операнд — нейтральный `0`, верни `self`; иначе `NotImplemented`.",
			solution: "`sum` по умолчанию начинает с `int 0`. Первый шаг `0 + Vec(...)` идёт через `int.__add__`, который не умеет складываться с `Vec` и возвращает `NotImplemented`. Тогда Python пробует *отражённый* `Vec.__radd__(0)`. Нужно его реализовать и пропустить нейтральный ноль.\n\n```python\nclass Vec:\n    __slots__ = (\"x\", \"y\")\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __repr__(self):\n        return f\"Vec({self.x}, {self.y})\"\n    def __eq__(self, other):\n        if not isinstance(other, Vec):\n            return NotImplemented\n        return (self.x, self.y) == (other.x, other.y)\n    def __hash__(self):\n        return hash((self.x, self.y))\n    def __add__(self, other):\n        if not isinstance(other, Vec):\n            return NotImplemented\n        return Vec(self.x + other.x, self.y + other.y)\n    def __radd__(self, other):\n        # sum() стартует с int 0: int.__add__ не знает Vec -> NotImplemented\n        # -> Python зовёт Vec.__radd__(0). Пропускаем нейтральный 0.\n        if other == 0:\n            return self\n        return NotImplemented\n\nprint(\"sum ->\", sum([Vec(1, 1), Vec(2, 3), Vec(-1, 0)]))  # Vec(2, 4)\nprint(\"0 + Vec ->\", 0 + Vec(5, 5))                         # Vec(5, 5)\n```",
			answer: "Реализовать __radd__, обрабатывающий случай other == 0 (старт sum), возвращая self.",
			xp: 14
		},
		{
			id: 'oop-d6-t3',
			difficulty: "star",
			prompt: "Реализуй класс `CIStr` — регистронезависимую обёртку над строкой. Требования: (1) `CIStr('Hello') == CIStr('HELLO')` и `CIStr('Hello') == 'hello'` (сравнение со строкой тоже регистронезависимо). (2) Контракт eq/hash соблюдён так, что `{CIStr('Yes'), CIStr('yes'), CIStr('No')}` содержит ровно 2 элемента, а `{CIStr('Key'): 1}[CIStr('KEY')]` возвращает 1. (3) Реализуй `__iadd__` для `+=` и покажи в коде, что `+=` создаёт новый объект (имя перевешивается). Объясни в комментарии, почему хешировать надо по `casefold()`, а не по исходной строке.",
			hint: "Главная ловушка контракта: раз `'ABC' == 'abc'`, то их хеши обязаны совпасть — значит хешируй НЕ исходную строку, а её `casefold()`. `casefold()` сильнее `lower()` для Unicode. В `__eq__` поддержи и `CIStr`, и `str`. Для `__iadd__` верни новый `CIStr` (строка неизменяема) — это покажет, что протокол `+=` зовёт именно `__iadd__`, но идентичность объекта меняется.",
			solution: "Сердце задачи — контракт: `CIStr('ABC') == CIStr('abc')`, поэтому `hash` обязан совпасть. Если хешировать исходную строку, `'ABC'` и `'abc'` дадут разные хеши при равенстве — `set`/`dict` тихо сломаются. Решение: хешировать и сравнивать по `casefold()` (агрессивнее `lower()`, корректнее для Unicode).\n\n```python\nclass CIStr:\n    __slots__ = (\"_value\", \"_fold\")\n    def __init__(self, value):\n        self._value = str(value)\n        self._fold = self._value.casefold()   # для сравнения/хеша\n\n    def __repr__(self):\n        return f\"CIStr({self._value!r})\"\n    def __str__(self):\n        return self._value\n\n    def __eq__(self, other):\n        if isinstance(other, CIStr):\n            return self._fold == other._fold\n        if isinstance(other, str):\n            return self._fold == other.casefold()\n        return NotImplemented\n\n    def __hash__(self):\n        # Равные объекты -> равный хеш. 'ABC'=='abc', значит хешируем casefold.\n        return hash(self._fold)\n\n    def __add__(self, other):\n        return CIStr(self._value + str(other))\n\n    def __iadd__(self, other):\n        # строка неизменяема -> возвращаем НОВЫЙ объект; протокол += зовёт именно __iadd__\n        return CIStr(self._value + str(other))\n\na, b = CIStr('Hello'), CIStr('HELLO')\nprint(a == b, a == 'hello', hash(a) == hash(b))      # True True True\nseen = {CIStr('Yes'), CIStr('yes'), CIStr('No')}\nprint(len(seen))                                      # 2\nprint({CIStr('Key'): 1}[CIStr('KEY')])               # 1\n\nx = CIStr('foo'); before = x\nx += 'BAR'\nprint(x, x is not before)                            # CIStr('fooBAR') True\n```",
			answer: "Хешировать и сравнивать по casefold; __iadd__ возвращает новый объект.",
			xp: 25
		}
	],
	mastery: [
		"Объясняю, почему dunder-методы — это протоколы (Python зовёт их за тебя через синтаксис), и помню, что для неявных вызовов поиск идёт по типу, а не по экземпляру.",
		"Различаю `__repr__` (для разработчика, идеал — eval-обратимость, печатается в контейнерах) и `__str__` (для пользователя), знаю про откат `str` к `repr` и умею задать кастомный `__format__`.",
		"Воспроизвожу контракт eq/hash: равные объекты — равный хеш; определение `__eq__` обнуляет `__hash__` до None; умею вернуть хешируемость, определив `__hash__` по тем же полям, и связываю это с неизменяемостью.",
		"Реализую полный порядок через `functools.total_ordering` (только `__eq__` + `__lt__`), возвращаю `NotImplemented` для чужих типов и понимаю, что декоратор не восстанавливает `__hash__`.",
		"Перегружаю арифметику, понимаю алгоритм диспетчеризации `a+b` → `__add__` → отражённый `__radd__`, отличаю `__iadd__` (мутация in-place, возврат self) от разворота `a = a + b`, и знаю про приоритет `__bool__` над `__len__` в проверке истинности."
	]
};
