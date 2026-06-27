import type { Day } from '$lib/types';

export const day08: Day = {
	n: 8,
	phaseId: "protocol",
	kind: 'theory',
	title: "Модели данных: dataclasses, namedtuple, Enum",
	est: '1–2 ч',
	goal: "Научиться описывать данные декларативно: заменить рукописные `__init__`/`__repr__`/`__eq__` на [[dataclass|@dataclass]], выбирать между изменяемой записью, `frozen`-значением и [[namedtuple|namedtuple]], и кодировать конечные множества состояний через [[enum|Enum]] вместо «магических» строк и чисел.",
	sections: [
		{
			kind: "intuition",
			heading: "Зачем нужны классы данных: проблема рукописного класса",
			body: "Огромная доля классов в реальном коде — это **записи**: контейнеры с несколькими именованными полями и почти без поведения. Точка, конфиг, строка заказа, цвет, ответ API. Если писать их вручную, появляется один и тот же скучный шаблон:\n\n1. `__init__`, который принимает аргументы и построчно делает `self.x = x`.\n2. `__repr__`, чтобы в отладке видеть `Point(x=1, y=2)`, а не `<Point object at 0x...>`.\n3. `__eq__`, чтобы две точки с одинаковыми координатами считались равными (иначе сравнение идёт по `id`, и `Point(1,2) == Point(1,2)` даёт `False`).\n\nЭто десятки строк ритуала, в которых легко ошибиться: забыть поле в `__eq__`, рассинхронить `__init__` и `__repr__`. [[dataclass|@dataclass]] — это **генератор кода**: декоратор читает аннотации полей класса и в момент его создания дописывает эти методы за вас.\n\n## Что генерируется по умолчанию\n\n- `__init__(self, x, y, label='origin')` — параметры в порядке объявления полей.\n- `__repr__`, дающий `Point(x=1.0, y=2.0, label='origin')`.\n- `__eq__`, сравнивающий **кортежи полей**: `(self.x, self.y, ...) == (other.x, other.y, ...)`, но только если у них один и тот же класс.\n\nКлючевая идея: поля объявляются как **аннотации на уровне класса** (`x: float`), а не присваиваются в `__init__`. Аннотация без присваивания делает поле обязательным; аннотация со значением (`label: str = \"origin\"`) задаёт дефолт. Сам декоратор аннотации не проверяет — это просто разметка, по которой `@dataclass` понимает, какие поля есть и в каком порядке.",
			code: {
				title: "Базовый dataclass и ловушка изменяемого дефолта",
				language: 'python',
				code: String.raw`from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float
    label: str = "origin"

p = Point(1.0, 2.0)
q = Point(1.0, 2.0)
r = Point(3.0, 4.0, "corner")

print("repr:   ", p)
print("eq:     ", p == q)          # True - сравнение по полям
print("eq r:   ", p == r)
print("fields: ", p.x, p.y, p.label)

# Ловушка изменяемого дефолта
try:
    @dataclass
    class Bad:
        items: list = []           # ошибка уже при объявлении класса
except ValueError as e:
    print("Bad class:", type(e).__name__, "->", e)

# Правильно: default_factory
@dataclass
class Basket:
    items: list = field(default_factory=list)

b1 = Basket()
b2 = Basket()
b1.items.append("apple")
print("b1.items:", b1.items)
print("b2.items:", b2.items, "(не разделяют общий список)")`,
				explanation: "Смотрите на две вещи. Первое: `p == q` это `True` — `__eq__` сгенерирован за нас. Второе: `items: list = []` падает с `ValueError` *прямо при объявлении класса*, а не позже. Это спасает от классической ловушки, описанной в следующей секции. Лекарство — `field(default_factory=list)`: видно, что `b1` и `b2` получают независимые списки."
			}
		},
		{
			kind: "derivation",
			heading: "Ловушка изменяемых дефолтов и зачем нужен field()",
			body: "Самая частая ошибка новичка с классами данных — **разделяемый изменяемый дефолт**. Чтобы понять, почему `@dataclass` её запрещает, нужно вспомнить, как Python вычисляет значения по умолчанию.\n\n## Под капотом\n\nЗначение по умолчанию вычисляется **один раз** — в момент определения функции (здесь — генерируемого `__init__`), а не при каждом вызове. Если бы дефолтом был один и тот же объект-список, все экземпляры, созданные без явного аргумента, делили бы **один** список. Добавили в один — увидели во всех. Это тот же баг, что и `def f(items=[])` в обычных функциях.\n\n`@dataclass` не может в общем случае распознать «опасный» дефолт, но для самых ходовых изменяемых типов (`list`, `dict`, `set`) он делает явную проверку и кидает `ValueError` ещё на этапе создания класса. Для остальных изменяемых объектов проверки нет — ответственность на вас.\n\nПравильное решение — `field(default_factory=...)`. `field()` — это способ задать полю расширенные настройки. `default_factory` принимает **функцию без аргументов**, которую `__init__` зовёт при каждом создании объекта, если значение не передали. `list` без скобок — как раз такая фабрика (вызов `list()` даёт новый пустой список).\n\nПолезные параметры `field()`:\n\n- `default_factory=list` — свежий изменяемый объект на каждый экземпляр.\n- `init=False` — поле не попадает в `__init__` (заполняем его в `__post_init__`, см. далее).\n- `repr=False` — скрыть поле из `__repr__` (например, пароль).\n- `compare=False` — не учитывать поле в `__eq__`/`__lt__`.\n- `kw_only=True` — сделать конкретное поле keyword-only.\n\nВажно: `default` и `default_factory` взаимоисключающи — задать оба нельзя."
		},
		{
			kind: "definition",
			heading: "frozen и order: неизменяемость, хешируемость и сравнения",
			body: "Декоратор принимает флаги, меняющие набор генерируемого кода. Два самых важных — `frozen` и `order`.\n\n`@dataclass(frozen=True)` делает экземпляры **псевдо-неизменяемыми**: сгенерированный `__setattr__` при любой попытке присвоить полю кидает `FrozenInstanceError`. Это не «настоящая» неизменяемость на уровне C, как у `tuple`, а перехват присваивания, но для дисциплины кода этого достаточно.\n\n## Почему frozen связан с хешируемостью\n\nКонтракт Python: если `a == b`, то обязательно `hash(a) == hash(b)`. Объект, у которого определён собственный `__eq__`, по умолчанию становится **нехешируемым** — интерпретатор ставит `__hash__ = None`. Логика такая: раз вы переопределили равенство, дефолтный хеш (по `id`) больше не согласован с ним, а изменяемый объект вообще нельзя безопасно класть в множество (его хеш «уплывёт» при мутации). Поэтому:\n\n- Обычный `@dataclass` (`eq=True`, не frozen) → `__hash__ = None`, объект **нельзя** положить в `set` или сделать ключом `dict`.\n- `@dataclass(frozen=True)` → раз мутации запрещены, генерируется корректный `__hash__` по тем же полям, что и `__eq__`. Объект **хешируем**.\n\nПоэтому `frozen=True` — это не только про «нельзя менять», но и про «можно использовать как ключ словаря и элемент множества».\n\n`@dataclass(order=True)` генерирует `__lt__`, `__le__`, `__gt__`, `__ge__`, сравнивая **кортежи полей** в порядке объявления (как `tuple` сравнивается лексикографически). Это сразу даёт `sorted()`, `min()`, `max()`. Для `order=True` обязателен `eq=True` (он включён по умолчанию). Если нужно сортировать по неочевидному критерию — управляйте порядком полей или исключайте лишние через `field(compare=False)`.",
			code: {
				title: "Point(frozen=True, order=True) с __post_init__",
				language: 'python',
				code: String.raw`from dataclasses import dataclass
from math import hypot

@dataclass(frozen=True, order=True)
class Point:
    x: float
    y: float

    def __post_init__(self):
        if not isinstance(self.x, (int, float)):
            raise TypeError("x must be a number")
        # frozen => прямое присваивание запрещено, идём в обход
        object.__setattr__(self, "_norm", hypot(self.x, self.y))

    @property
    def norm(self):
        return self._norm

a = Point(0.0, 0.0)
b = Point(3.0, 4.0)

print("a:", a, " norm:", a.norm)
print("b:", b, " norm:", b.norm)
print("a < b:", a < b)             # order=True даёт сравнения
print("sorted:", sorted([b, a]))

# frozen => хешируемость
s = {a, b, Point(3.0, 4.0)}
print("set size:", len(s))         # 2 - b и Point(3,4) равны
print("dict key:", {a: "zero"}[Point(0.0, 0.0)])

try:
    b.x = 99
except Exception as e:
    print("mutate:", type(e).__name__, "->", e)`,
				explanation: "`order=True` дал `a < b` и работающий `sorted`. `frozen=True` дал и хешируемость (множество схлопнуло равные `b` и `Point(3,4)` до размера 2, объект работает ключом словаря), и `FrozenInstanceError` при `b.x = 99`. Обратите внимание на `object.__setattr__` в `__post_init__`: это единственный способ записать производное поле в frozen-объекте — прямое `self._norm = ...` упало бы."
			}
		},
		{
			kind: "connection",
			heading: "__post_init__: валидация и производные поля",
			body: "Сгенерированный `__init__` просто раскладывает аргументы по полям — никакой логики там нет. Но запись часто требует **проверить инварианты** (цена неотрицательна, код валюты из трёх букв) или **вычислить производное поле** (`total = price * qty`). Для этого `@dataclass` после присваивания всех полей вызывает метод `__post_init__`, если он определён.\n\nТипичные применения:\n\n- **Валидация.** Проверяем поля и кидаем `ValueError`/`TypeError` при нарушении инварианта. Лучше упасть при создании, чем тащить битый объект по программе.\n- **Производные поля.** Объявляем поле как `field(init=False)` (его нет в `__init__`) и заполняем в `__post_init__`. Так `total` всегда согласован с `price` и `qty`.\n- **Нормализация.** Привести строку к нижнему регистру, обрезать пробелы.\n\n## Тонкость с frozen\n\nВ `frozen`-классе обычное присваивание `self.total = ...` внутри `__post_init__` тоже запрещено — `__setattr__` перехватит и его. Обход — `object.__setattr__(self, \"имя\", значение)`: он идёт мимо переопределённого `__setattr__` напрямую к механизму атрибутов. Это легальный приём именно для инициализации производных полей frozen-датакласса; в остальном коде так делать не нужно.\n\nЕсли поле объявлено через `default_factory` или `init=False`, к моменту `__post_init__` оно уже заполнено (фабрика отработала), так что в нём можно читать и достраивать любые поля.",
			code: {
				title: "slots, kw_only и производные поля",
				language: 'python',
				code: String.raw`from dataclasses import dataclass, field, fields, asdict

# slots=True - экономия памяти, запрет новых атрибутов
@dataclass(slots=True)
class Compact:
    a: int
    b: int

c = Compact(1, 2)
print("has __dict__:", hasattr(c, "__dict__"))   # False при slots=True
try:
    c.zzz = 5
except AttributeError as e:
    print("slots guard:", type(e).__name__, "->", e)

# kw_only=True решает проблему 'дефолт перед не-дефолтом'
@dataclass(kw_only=True)
class Event:
    name: str
    priority: int = 0
    source: str            # без дефолта, но ОК - все поля kw_only

e = Event(name="login", source="web")
print("event: ", e)

# __post_init__ для производного поля + валидация
@dataclass
class Order:
    price: float
    qty: int
    total: float = field(init=False)   # считаем сами

    def __post_init__(self):
        if self.qty <= 0:
            raise ValueError("qty must be positive")
        self.total = round(self.price * self.qty, 2)

o = Order(19.99, 3)
print("order:  ", o)
print("fields: ", [f.name for f in fields(o)])
print("asdict: ", asdict(o))
try:
    Order(10.0, 0)
except ValueError as ex:
    print("validate:", ex)`,
				explanation: "Три фичи сразу. `slots=True`: у объекта нет `__dict__`, добавить `c.zzz` нельзя — экономит память и ловит опечатки в именах полей. `kw_only=True`: поле `source` без дефолта стоит *после* поля с дефолтом — в обычном датаклассе это `TypeError`, а с kw_only порядок не важен, потому что всё передаётся по имени. `Order`: `total` помечен `init=False` и вычисляется в `__post_init__`, а `qty <= 0` отбраковывается валидацией."
			}
		},
		{
			kind: "derivation",
			heading: "slots и kw_only: память и порядок аргументов",
			body: "Ещё два флага решают конкретные практические проблемы.\n\n## slots=True — память и защита от опечаток\n\nОбычный объект Python хранит атрибуты в словаре `__dict__`. Словарь гибкий, но тяжёлый: на каждый экземпляр — лишние байты, плюс разыменование через хеш-таблицу. `@dataclass(slots=True)` вместо `__dict__` генерирует `__slots__` — фиксированный набор слотов под объявленные поля. Эффект:\n\n- **Меньше памяти** на экземпляр (заметно, когда их миллионы).\n- **Чуть быстрее** доступ к атрибутам.\n- **Запрет новых атрибутов:** `c.zzz = 5` падает `AttributeError`. Это ловит опечатки (`obj.naem = ...` молча создал бы новый атрибут в обычном классе).\n\nПлата: со слотами хуже сочетается множественное наследование, и нельзя «на лету» навесить атрибут, которого нет в полях.\n\n## kw_only=True — конец войны с порядком дефолтов\n\nВ обычном `__init__` параметр с дефолтом не может стоять перед параметром без дефолта — иначе позиционный вызов неоднозначен. У датакласса это превращается в раздражающее ограничение: стоит дать дефолт раннему полю, как все последующие тоже обязаны иметь дефолт, иначе `TypeError` при создании класса.\n\n`kw_only=True` снимает проблему: все поля становятся **keyword-only**, передаются только по имени, а раз позиционного вызова нет — порядок «дефолт/не-дефолт» перестаёт играть роль. Можно ставить дефолты в любом порядке. Флаг можно вешать и точечно на одно поле через `field(kw_only=True)` — удобно, когда базовый класс задаёт обязательные поля, а потомок добавляет опциональные."
		},
		{
			kind: "connection",
			heading: "namedtuple и typing.NamedTuple: лёгкие неизменяемые записи",
			body: "До датаклассов (а они появились в Python 3.7) стандартным способом сделать лёгкую запись был `namedtuple` из `collections`. Это **подкласс кортежа** с именованными полями: вы получаете доступ и по имени (`p.x`), и по индексу (`p[0]`), и распаковку (`x, y = p`), и всю tuple-механику — неизменяемость, хешируемость, сравнение.\n\nДва диалекта:\n\n- `collections.namedtuple(\"City\", [\"name\", \"population\"])` — фабрика, задаёт поля списком строк.\n- `typing.NamedTuple` — то же самое, но через `class`-синтаксис с аннотациями типов, дефолтами и **методами**. Читается приятнее и дружит с проверяющими типы.\n\nПолезные методы: `_asdict()` (в словарь), `_replace(field=...)` (новый экземпляр с одним изменённым полем — оригинал неизменен), `_fields` (кортеж имён).\n\n## namedtuple или frozen dataclass?\n\nОни решают близкую задачу — неизменяемая запись — но различаются:\n\n- **namedtuple ЯВЛЯЕТСЯ кортежем.** Плюс: совместим со всем, что ждёт tuple, поддерживает индексацию и распаковку, чуть легче. Минус (он же источник багов): `RGBColor(255,0,0) == (255,0,0)` даёт `True`, потому что под капотом это кортеж; такая запись случайно «равна» обычному кортежу и конкатенируется как кортеж (`color + (1,)`).\n- **frozen dataclass НЕ кортеж.** Равенство только с экземплярами того же класса, нет случайной совместимости, есть `slots`, `field`, `__post_init__`, гибкая валидация. Чуть тяжелее.\n\nПравило: нужна максимально лёгкая неизменяемая запись с tuple-семантикой и распаковкой — `NamedTuple`. Нужна валидация, производные поля, строгое равенство или мутируемость — `dataclass`.",
			code: {
				title: "namedtuple и typing.NamedTuple",
				language: 'python',
				code: String.raw`from collections import namedtuple
from typing import NamedTuple

# Классический namedtuple
City = namedtuple("City", ["name", "population", "country"])
moscow = City("Moscow", 13_010_112, "RU")

print("by name:  ", moscow.name, moscow.population)
print("by index: ", moscow[0], moscow[1])
name, pop, country = moscow            # распаковка
print("unpack:   ", name, pop, country)
print("is tuple: ", isinstance(moscow, tuple))
print("_asdict:  ", moscow._asdict())
print("_replace: ", moscow._replace(population=14_000_000))
print("original: ", moscow, "(не изменился)")

# typing.NamedTuple - аннотации, дефолты, методы
class Vector(NamedTuple):
    x: float
    y: float
    z: float = 0.0

    def length(self) -> float:
        return (self.x**2 + self.y**2 + self.z**2) ** 0.5

v = Vector(3.0, 4.0)
print("\nVector:   ", v)
print("default z:", v.z)
print("length:   ", v.length())
print("hashable: ", v in {Vector(3.0, 4.0)})`,
				explanation: "`City` ведёт себя одновременно как запись (`moscow.name`) и как кортеж (`moscow[0]`, распаковка, `isinstance(..., tuple)`). `_replace` возвращает *новый* объект — оригинал неизменен. `Vector` через `typing.NamedTuple` добавляет дефолт `z=0.0` и собственный метод `length()`, оставаясь хешируемым (лежит в множестве)."
			}
		},
		{
			kind: "definition",
			heading: "Enum: перечисления вместо магических строк и чисел",
			body: "Когда у величины конечный набор допустимых значений — статус заказа, цвет, приоритет, день недели — соблазнительно кодировать их «магическими» строками (`\"active\"`) или числами (`status == 2`). Это плохо:\n\n- **Опечатки молчат.** `status == \"actve\"` — валидный код, всегда `False`, баг найдёте нескоро.\n- **Нет единого списка значений.** Откуда узнать все допустимые статусы? Нужно грепать по коду.\n- **Числа нечитаемы.** `2` — это что? А `priority == 2`?\n\n[[enum|Enum]] решает это. Подкласс `Enum` объявляет члены как имена с значениями; каждый член — **синглтон**: `Status.ACTIVE is Status.ACTIVE` всегда `True`, сравнивать можно через `is`. Свойства:\n\n- `.name` (`\"ACTIVE\"`) и `.value` (полезная нагрузка).\n- Поиск по значению `Status(2)` и по имени `Status[\"ACTIVE\"]` — несуществующее имя кидает `KeyError`, то есть **опечатка падает сразу**.\n- Итерация `for s in Status` даёт все члены по порядку — единый источник истины.\n- `auto()` автонумерует значения (1, 2, 3...), когда конкретные числа не важны.\n\n## IntEnum и Flag\n\n- `IntEnum` — члены одновременно являются `int`: их можно сравнивать с числами, складывать, сортировать. Удобно для приоритетов и уровней (`Priority.HIGH > Priority.LOW`). Цена — теряется строгость: `IntEnum` случайно «равен» числу, как обычный `Enum` — нет.\n- `Flag` — для **комбинируемых битовых наборов** (права доступа): члены задаются степенями двойки (через `auto()`), их можно объединять `|`, пересекать `&`, проверять вхождение `in`. `Perm.READ | Perm.WRITE` — один объект, несущий два флага.\n\nГлавный выигрыш: невалидное состояние становится **непредставимым**. Функция, принимающая `Status`, не получит `\"actve\"` — её просто неоткуда взять.",
			code: {
				title: "Enum статусов, IntEnum приоритетов, Flag прав",
				language: 'python',
				code: String.raw`from enum import Enum, IntEnum, auto, Flag

class Status(Enum):
    PENDING = auto()
    ACTIVE = auto()
    CLOSED = auto()

print("member:   ", Status.ACTIVE)
print("name/val: ", Status.ACTIVE.name, Status.ACTIVE.value)
print("identity: ", Status.ACTIVE is Status.ACTIVE)   # синглтон
print("by value: ", Status(2))
print("by name:  ", Status["CLOSED"])
print("iterate:  ", [s.name for s in Status])

def can_edit(status: Status) -> bool:
    return status in {Status.PENDING, Status.ACTIVE}

print("can_edit ACTIVE:", can_edit(Status.ACTIVE))
print("can_edit CLOSED:", can_edit(Status.CLOSED))

try:
    Status["ACTIVEE"]                 # опечатка падает сразу
except KeyError as e:
    print("typo guard:", type(e).__name__, e)

class Priority(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

print("\nIntEnum compare:", Priority.HIGH > Priority.LOW)
print("as int:        ", Priority.MEDIUM + 10)
print("sorted:        ", sorted([Priority.HIGH, Priority.LOW, Priority.MEDIUM]))

class Perm(Flag):
    READ = auto()
    WRITE = auto()
    EXECUTE = auto()

rw = Perm.READ | Perm.WRITE
print("\nFlag combo:    ", rw)
print("has READ:      ", Perm.READ in rw)
print("has EXECUTE:   ", Perm.EXECUTE in rw)`,
				explanation: "`Status` показывает синглтон-семантику (`is`), доступ по имени/значению и итерацию как единый список статусов. `Status[\"ACTIVEE\"]` мгновенно падает `KeyError` — опечатку видно сразу, в отличие от магической строки. `IntEnum` ведёт себя как число (сравнение, `+10`, сортировка). `Flag` собирает READ и WRITE в один объект и корректно отвечает на `in`."
			}
		},
		{
			kind: "note",
			heading: "Когда что выбирать: карта решений",
			body: "Сводка, чтобы выбор был быстрым и осознанным.\n\n## Записи (несколько полей, мало логики)\n\n1. **Нужна мутируемость, валидация, производные поля, строгое равенство** → обычный `@dataclass` (при необходимости `slots=True`, `kw_only=True`).\n2. **Запись должна быть неизменяемой и/или ключом словаря/элементом множества** → `@dataclass(frozen=True)`. Добавьте `order=True`, если нужна сортировка.\n3. **Максимально лёгкая неизменяемая запись с tuple-семантикой и распаковкой** → `typing.NamedTuple` (с аннотациями и методами) или `collections.namedtuple` (по-быстрому). Помните про случайное равенство с обычным кортежем.\n\n## Конечные множества значений\n\n4. **Фиксированный набор именованных состояний** (статус, цвет, роль) → `Enum`. Не магические строки/числа.\n5. **Состояния, которые надо сравнивать как числа** (уровни, приоритеты) → `IntEnum`.\n6. **Комбинируемые флаги** (права, опции) → `Flag` / `IntFlag`.\n\n## Антипаттерны\n\n- `dict` как «запись» с фиксированными ключами — теряете автодополнение, проверку типов и `__eq__`; берите dataclass.\n- Голый кортеж `(x, y, label)` — нечитаемо, `p[2]` вместо `p.label`; берите NamedTuple.\n- Параллельные словари-справочники `STATUS_NAMES = {1: \"active\"}` — это Enum, переписанный вручную и без гарантий.\n\nОбщий принцип дня: **делайте невалидные состояния непредставимыми**. dataclass с валидацией и frozen, NamedTuple для неизменяемых данных, Enum для конечных множеств — каждый из них сужает пространство возможных значений до корректных, и баги ловятся не в проде, а при создании объекта."
		}
	],
	tasks: [
		{
			id: 'oop-d8-t1',
			difficulty: "base",
			prompt: "Опишите тип `Money` (денежная сумма) как `@dataclass(frozen=True, order=True)`. Поля: `amount: int` (сумма в копейках, чтобы избежать ошибок float) и `currency: str = \"RUB\"`. В `__post_init__`: запретите отрицательную сумму (`ValueError`), потребуйте, чтобы код валюты был ровно из 3 букв (`ValueError`), и приведите код валюты к верхнему регистру. Добавьте `__add__`, складывающий две суммы одной валюты (иначе `ValueError`). Покажите на примерах: создание, сложение, сортировку списка `Money`, использование как ключа/элемента множества, и падение валидации на `Money(-1)`.",
			hint: "Так как класс frozen, нормализовать `currency` в `__post_init__` прямым присваиванием нельзя — используйте `object.__setattr__(self, \"currency\", self.currency.upper())`. `order=True` автоматически даст сравнение по кортежу `(amount, currency)`, чего достаточно для `sorted`. Хешируемость придёт от `frozen=True` бесплатно.",
			solution: "Код решения:\n\n```python\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True, order=True)\nclass Money:\n    amount: int          # в копейках, чтобы не ловить float-ошибки\n    currency: str = \"RUB\"\n\n    def __post_init__(self):\n        if self.amount < 0:\n            raise ValueError(\"amount must be non-negative\")\n        if len(self.currency) != 3:\n            raise ValueError(\"currency must be a 3-letter code\")\n        # frozen => только через object.__setattr__\n        object.__setattr__(self, \"currency\", self.currency.upper())\n\n    def __add__(self, other):\n        if self.currency != other.currency:\n            raise ValueError(\"currency mismatch\")\n        return Money(self.amount + other.amount, self.currency)\n\na = Money(500)\nb = Money(750, \"rub\")          # код валюты нормализуется к 'RUB'\nprint(a, b)\nprint(\"sum:\", a + b)\nprint(\"sorted:\", sorted([b, a]))\nprint(\"hashable:\", Money(500) in {a})\ntry:\n    Money(-1)\nexcept ValueError as e:\n    print(\"err:\", e)\n```\n\nКлючевые моменты: `frozen=True` дал неизменяемость и хеш, `order=True` дал сравнение для `sorted`, `object.__setattr__` — единственный способ нормализовать поле во frozen-классе, а вся валидация живёт в `__post_init__` и срабатывает при создании объекта.",
			xp: 12
		},
		{
			id: 'oop-d8-t2',
			difficulty: "base",
			prompt: "Смоделируйте светофор как конечный автомат на `Enum`. Объявите `Light` с членами `RED`, `GREEN`, `YELLOW` (через `auto()`). Напишите функцию `next_light(cur: Light) -> Light`, возвращающую следующий цвет по циклу RED → GREEN → YELLOW → RED. Запустите автомат на 5 переходов из `RED` и напечатайте последовательность имён цветов. Переходы задайте через словарь — не через цепочку `if`.",
			hint: "Словарь переходов `{Light.RED: Light.GREEN, ...}` — это таблица конечного автомата, читается лучше, чем `if/elif`. Члены Enum хешируемы, так что их можно класть в ключи словаря и множества. Для печати используйте `.name`.",
			solution: "Код решения:\n\n```python\nfrom enum import Enum, auto\n\nclass Light(Enum):\n    RED = auto()\n    GREEN = auto()\n    YELLOW = auto()\n\n_NEXT = {\n    Light.RED: Light.GREEN,\n    Light.GREEN: Light.YELLOW,\n    Light.YELLOW: Light.RED,\n}\n\ndef next_light(cur: Light) -> Light:\n    return _NEXT[cur]\n\ncur = Light.RED\nseq = [cur]\nfor _ in range(5):\n    cur = next_light(cur)\n    seq.append(cur)\n\nprint(\" -> \".join(s.name for s in seq))\n# RED -> GREEN -> YELLOW -> RED -> GREEN -> YELLOW\n```\n\nЧлены Enum хешируемы (синглтоны), поэтому таблица переходов — это словарь `member -> member`. Такой автомат расширяется добавлением строки в `_NEXT`, а не правкой ветвлений, и невалидный цвет в него просто неоткуда передать.",
			xp: 12
		},
		{
			id: 'oop-d8-t3',
			difficulty: "star",
			prompt: "Опишите `RGBColor` через `typing.NamedTuple` с полями `r, g, b: int` и методом `distance(self, other) -> float`, считающим евклидово расстояние между цветами. Покажите: расстояние между двумя цветами, использование цвета как ключа словаря-палитры, доступ к компоненте и по индексу (`color[0]`), и по имени (`color.r`). В одном-двух предложениях ответьте: почему `NamedTuple` здесь уместнее обычного `@dataclass`, и какой потенциальный подвох у того, что это кортеж?",
			hint: "Внутри `distance` можно итерировать `zip(self, other)` — `NamedTuple` распаковывается как кортеж, поэтому `zip` пройдёт по парам компонент. Хешируемость (для ключа палитры) даётся бесплатно, т.к. это кортеж. Подвох ищите в том, что `RGBColor(255,0,0) == (255,0,0)`.",
			solution: "Код решения:\n\n```python\nfrom typing import NamedTuple\n\nclass RGBColor(NamedTuple):\n    r: int\n    g: int\n    b: int\n\n    def distance(self, other: \"RGBColor\") -> float:\n        return sum((a - b) ** 2 for a, b in zip(self, other)) ** 0.5\n\nred = RGBColor(255, 0, 0)\npink = RGBColor(255, 100, 100)\nprint(\"distance:\", round(red.distance(pink), 2))   # 141.42\n\npalette = {red: \"red\", RGBColor(0, 0, 0): \"black\"}\nprint(\"lookup:\", palette[RGBColor(255, 0, 0)])      # red\nprint(\"by index:\", red[0], \"by name:\", red.r)        # 255 255\n```\n\nПочему NamedTuple: цвет — это лёгкая неизменяемая запись из трёх чисел без валидации и мутаций; NamedTuple даёт хешируемость (нужна для ключа палитры), распаковку и индексацию даром, а `zip(self, other)` работает именно потому, что объект — кортеж.\n\nПодвох: раз это подкласс `tuple`, `RGBColor(255, 0, 0) == (255, 0, 0)` вернёт `True`, и цвет можно случайно сконкатенировать с обычным кортежем (`red + (1,)`). Если такое смешение нежелательно, берите `@dataclass(frozen=True)` — у него равенство только с экземплярами того же класса.",
			xp: 25
		}
	],
	mastery: [
		"Объясняю, какие методы (`__init__`, `__repr__`, `__eq__`) и при каких флагах (`__hash__` при `frozen`, сравнения при `order`) генерирует `@dataclass`, и почему обычный датакласс с `eq=True` оказывается нехешируемым (`__hash__ = None`).",
		"Распознаю и чиню ловушку изменяемого дефолта: понимаю, что дефолт вычисляется один раз, и заменяю `x: list = []` на `field(default_factory=list)`.",
		"Применяю `frozen=True`, `order=True`, `slots=True`, `kw_only=True` осознанно и могу назвать, какую конкретную проблему решает каждый флаг; умею писать `__post_init__` для валидации и производных полей, включая обход через `object.__setattr__` во frozen-классе.",
		"Сравниваю `namedtuple`/`typing.NamedTuple` с `dataclass`: знаю, что NamedTuple — это подкласс `tuple` (отсюда индексация, распаковка и случайное равенство с кортежем), и выбираю инструмент под задачу.",
		"Заменяю магические строки и числа на `Enum`/`IntEnum`/`Flag`, пользуюсь синглтон-семантикой (`is`), доступом по имени/значению, `auto()` и итерацией по членам, и аргументирую, почему это делает невалидные состояния непредставимыми."
	]
};
