import type { Day } from '$lib/types';

export const day02: Day = {
	n: 2,
	phaseId: "basics",
	kind: 'theory',
	title: "Инкапсуляция: свойства и @property",
	est: '1–2 ч',
	goal: "Понять, как Python выражает инкапсуляцию: соглашения видимости (`public`, `_protected`, `__private` с [[name-mangling|name mangling]]) и почему «настоящего» private нет; научиться превращать обычный атрибут в [[property|свойство]] через `@property` с валидацией и вычисляемыми значениями, не меняя интерфейс; освоить [[slots|__slots__]] для экономии памяти.",
	sections: [
		{
			kind: "definition",
			heading: "Три уровня видимости: public, _protected, __private",
			body: "В Python нет ключевых слов `private`/`protected`/`public`. Вместо языковых барьеров — **соглашения об именах**, которые читает человек (и линтер), а не интерпретатор.\n\n- **public** — обычное имя (`balance`, `owner`). Часть API, на него опираются снаружи.\n- **_protected** — имя с **одним** ведущим подчёркиванием (`_balance`). Это вежливое «не трогай, деталь реализации». Технически доступ ничем не ограничен — `obj._balance` прекрасно работает. Соглашение поддержано лишь тем, что `from module import *` не тащит имена с `_` в начало.\n- **__private** — имя с **двумя** ведущими подчёркиваниями и без двух хвостовых (`__pin`). Вот здесь включается реальный механизм языка — [[name-mangling|name mangling]].\n\n## Зачем разные уровни\n\n`_protected` — для подклассов и «своих»: «это внутренность, но если очень надо — пользуйся осознанно». `__private` — для того, чтобы имя **случайно не пересеклось** с одноимённым атрибутом подкласса. Это не про секретность, а про изоляцию пространства имён внутри иерархии наследования.\n\nТипичная ошибка новичка — лепить `__` ко всему «для безопасности». На практике `__` нужен редко: он усложняет доступ из подклассов и отладку. По умолчанию пиши `public` или, для деталей реализации, `_protected`.",
			code: {
				title: "Видимость и name mangling в __dict__",
				language: 'python',
				code: String.raw`class Account:
    bank = "Codex Bank"          # public

    def __init__(self, owner, balance):
        self.owner = owner       # public
        self._balance = balance  # protected (соглашение)
        self.__pin = 1234        # private -> name mangling

    def check(self, pin):
        # внутри класса __pin виден как обычное имя
        return pin == self.__pin


a = Account("Аня", 1000)

print("public owner:", a.owner)
print("protected _balance:", a._balance)          # доступен, просто «не трогай»
print("check(1234):", a.check(1234))

# а вот напрямую __pin не достать:
try:
    print(a.__pin)
except AttributeError as e:
    print("a.__pin ->", type(e).__name__, ":", e)

# потому что в __dict__ имя «искажено» (mangled):
print("__dict__ ключи:", list(a.__dict__.keys()))
print("реальное имя:", a._Account__pin)           # достать всё же можно
print("совпадает с __pin внутри:", a._Account__pin == 1234)`,
				explanation: "Запусти и посмотри ключи `__dict__`: `owner`, `_balance` лежат как есть, а `__pin` превратился в `_Account__pin`. Поэтому `a.__pin` бросает `AttributeError` (такого имени нет), но `a._Account__pin` спокойно отдаёт значение. Вывод: `__private` не про защиту данных — это переименование, а не замок."
			}
		},
		{
			kind: "derivation",
			heading: "Под капотом: что делает name mangling и почему нет настоящего private",
			body: "[[name-mangling|Name mangling]] — это **чисто текстовое преобразование на этапе компиляции класса**. Любое имя вида `__name` (две ведущие черты, не более одной хвостовой), встреченное **в теле класса** `Foo`, компилятор заменяет на `_Foo__name`. Замена происходит и в определении атрибута, и во всех обращениях `self.__name` внутри тела класса — поэтому изнутри код выглядит так, будто работает с `__name`, а в реальности везде стоит `_Foo__name`.\n\n## Почему это не private\n\nИскажённое имя полностью предсказуемо: зная класс, ты всегда соберёшь `_Foo__name` руками и получишь доступ. Никакой проверки прав на уровне рантайма нет. Это **философия Python**: «мы все тут взрослые люди» (*we're all consenting adults*). Язык не запрещает — он сигнализирует намерение, а ответственность на разработчике.\n\n## Зачем тогда mangling вообще\n\nЕдинственная настоящая задача — **избежать коллизий имён в наследовании**. Если базовый класс хранит `self.__cache`, а подкласс независимо заводит свой `self.__cache`, они не затрут друг друга: один станет `_Base__cache`, другой `_Sub__cache`. Без mangling одноимённые «приватные» поля разных уровней иерархии конфликтовали бы. Так что `__` — инструмент инкапсуляции **внутри иерархии**, а не средство сокрытия от внешнего кода.\n\nТонкость-ловушка: mangling срабатывает только для имён, буквально записанных в теле класса. `getattr(obj, '__pin')` искажение **не** применит и атрибут не найдёт — нужно `getattr(obj, '_Account__pin')`.",
			code: {
				title: "Mangling предотвращает коллизию в наследовании",
				language: 'python',
				code: String.raw`class Base:
    def __init__(self):
        self.__data = "из Base"      # станет _Base__data

    def base_view(self):
        return self.__data            # компилятор подставит _Base__data


class Sub(Base):
    def __init__(self):
        super().__init__()
        self.__data = "из Sub"        # станет _Sub__data — НЕ затирает Base!

    def sub_view(self):
        return self.__data            # _Sub__data


s = Sub()
print("Base видит своё:", s.base_view())   # из Base
print("Sub видит своё: ", s.sub_view())    # из Sub
print("оба поля живут отдельно:", sorted(k for k in s.__dict__ if 'data' in k))

# getattr НЕ искажает имя — нужно искажённое вручную:
try:
    getattr(s, '__data')
except AttributeError as e:
    print("getattr('__data') ->", type(e).__name__)
print("getattr('_Sub__data') ->", getattr(s, '_Sub__data'))`,
				explanation: "Два поля `__data` из `Base` и `Sub` мирно сосуществуют под разными искажёнными именами — это и есть единственная реальная польза `__`. И обрати внимание: `getattr(s, '__data')` падает, потому что mangling не применяется к строковым именам в рантайме."
			}
		},
		{
			kind: "intuition",
			heading: "Геттеры по-питоновски: @property вместо get_/set_",
			body: "В Java принято заранее писать `getBalance()`/`setBalance()` на каждое поле — на случай, если позже понадобится логика. В Python так **не делают**, и это сознательный выбор, а не лень.\n\nПричина — [[property|property]]. Свойство позволяет начать с **обычного публичного атрибута**, а когда (и если) понадобится валидация или вычисление, превратить его в управляемое — **не меняя ни строчки клиентского кода**. `obj.radius` и `obj.radius = 5` остаются ровно тем же синтаксисом; меняется лишь то, что за чтением/записью теперь стоит метод.\n\n## Почему это переворачивает привычку\n\nЕсли заранее завести `get_radius()/set_radius()`, интерфейс **сразу** становится громоздким: всюду `c.set_radius(5)` вместо `c.radius = 5`. Ты платишь за гибкость, которая, возможно, никогда не понадобится. С `@property` ты платишь **только в тот момент**, когда логика реально нужна — а до тех пор у тебя чистый атрибут. Это прямое следствие принципа «не усложняй раньше времени»: добавляй property по необходимости, а не профилактически.\n\nПравило-мантра: **начинай с простого атрибута. Превращай в `property`, когда понадобилась логика. Интерфейс при этом не меняется.**",
			code: {
				title: "От обычного атрибута к property без смены интерфейса",
				language: 'python',
				code: String.raw`import math

# --- Версия 1: публичный атрибут, никакой логики ---
class CircleV1:
    def __init__(self, radius):
        self.radius = radius     # просто данные

c = CircleV1(10)
c.radius = 20                    # читаем/пишем как поле
print("V1:", c.radius)

# Прошёл месяц: нужна валидация (radius > 0) и площадь.
# --- Версия 2: тот же ИНТЕРФЕЙС, но radius стал property ---
class CircleV2:
    def __init__(self, radius):
        self.radius = radius     # тот же синтаксис, теперь идёт через сеттер

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("радиус должен быть положительным")
        self._radius = value

    @property
    def area(self):              # вычисляемое: не храним, считаем по запросу
        return math.pi * self._radius ** 2


# КЛИЕНТСКИЙ КОД РОВНО ТОТ ЖЕ, что был для V1:
c = CircleV2(10)
c.radius = 20
print("V2 radius:", c.radius, "area:", round(c.area, 2))
try:
    c.radius = -5
except ValueError as e:
    print("radius=-5 ->", type(e).__name__, ":", e)`,
				explanation: "`c.radius = 20` записано идентично в `CircleV1` и `CircleV2` — для вызывающего кода ничего не изменилось. Но во второй версии за присваиванием стоит сеттер с проверкой, а `area` считается на лету. Это и есть причина, почему `get_/set_` заранее не пишут."
			}
		},
		{
			kind: "definition",
			heading: "@property, @x.setter, read-only и вычисляемые свойства",
			body: "[[property|Свойство]] собирается из трёх кирпичей, и все они опциональны после первого:\n\n1. **Геттер** — метод под `@property`. Имя метода становится именем атрибута. Обязателен.\n2. **Сеттер** — метод под `@имя.setter`. Тут живёт **валидация**. Если его нет — свойство **read-only**, и присваивание бросит `AttributeError`.\n3. **Делетер** — `@имя.deleter` под `del obj.x`. Нужен крайне редко.\n\nКлючевой приём для валидации: **храним значение в приватном поле** (`self._x`), а наружу отдаём `property` с тем же «человеческим» именем `x`. Сеттер пишет в `self._x` после проверки. Если в `__init__` присваивать `self.x = ...` (а не `self._x = ...`), то **валидация сработает и при создании** объекта — конструктор пройдёт через сеттер.\n\n## Два режима свойства\n\n- **Вычисляемое свойство** — геттер считает значение из других полей и **ничего не хранит** (`area`, `fahrenheit`, `is_adult`). Всегда актуально, нельзя рассинхронизировать. Логичнее read-only.\n- **Управляемое поле** — геттер просто отдаёт `self._x`, сеттер валидирует запись. Хранит состояние, но контролирует его.\n\nЧастая ловушка: написать в сеттере `self.x = value` вместо `self._x = value` — это рекурсивный вызов сеттера и `RecursionError`. Сеттер ВСЕГДА пишет в приватное поле `_x`, не в само свойство.",
			code: {
				title: "Temperature: celsius/fahrenheit с валидацией, read-only kelvin",
				language: 'python',
				code: String.raw`class Temperature:
    ABS_ZERO_C = -273.15  # абсолютный ноль в Цельсиях

    def __init__(self, celsius=0.0):
        # присваивание идёт ЧЕРЕЗ сеттер -> валидация работает и в __init__
        self.celsius = celsius

    @property
    def celsius(self):                       # getter
        return self._celsius

    @celsius.setter
    def celsius(self, value):                # setter с валидацией
        if value < self.ABS_ZERO_C:
            raise ValueError(
                f"температура {value}°C ниже абсолютного нуля {self.ABS_ZERO_C}°C"
            )
        self._celsius = float(value)

    @property
    def fahrenheit(self):                    # ВЫЧИСЛЯЕМОЕ свойство (храним только celsius)
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):             # запись в F конвертируем через celsius
        self.celsius = (value - 32) * 5 / 9

    @property
    def kelvin(self):                        # read-only (нет сеттера)
        return self._celsius - self.ABS_ZERO_C

    def __repr__(self):
        return f"Temperature({self._celsius:.2f}°C)"


t = Temperature(25)
print(t, "=", t.fahrenheit, "F", "=", round(t.kelvin, 2), "K")

t.fahrenheit = 212          # пишем в фаренгейтах -> внутри конвертация в celsius
print("после fahrenheit=212:", t, "->", t.celsius, "C")

try:
    t.celsius = -300
except ValueError as e:
    print("celsius=-300 ->", type(e).__name__, ":", e)

try:
    t.kelvin = 0            # read-only -> ошибка
except AttributeError as e:
    print("t.kelvin = 0 ->", type(e).__name__, ":", e)

try:
    Temperature(-500)      # валидация ловит и в конструкторе
except ValueError as e:
    print("Temperature(-500) ->", type(e).__name__, ":", e)`,
				explanation: "Хранится **только** `_celsius` — `fahrenheit` и `kelvin` вычисляются из него, поэтому рассинхрона температур быть не может. Запись `t.fahrenheit = 212` идёт через сеттер фаренгейта, тот зовёт сеттер цельсия, и валидация абсолютного нуля срабатывает в любом случае. `kelvin` без сеттера — read-only, а валидация работает даже в `Temperature(-500)`, потому что `__init__` присваивает через свойство."
			}
		},
		{
			kind: "derivation",
			heading: "Под капотом: property — это дескриптор данных",
			body: "Почему вообще `obj.x` иногда вызывает функцию, а не достаёт значение из `obj.__dict__`? Потому что `property` — это **дескриптор данных**: объект с методами `__get__` **и** `__set__`, лежащий **в классе**, а не в экземпляре.\n\n## Порядок разрешения атрибута\n\nКогда Python вычисляет `obj.x`, он идёт по строгому порядку (упрощённо, для обычного `__getattribute__`):\n\n1. Ищет `x` в типе (`type(obj).__mro__`). Если нашёл **дескриптор данных** (есть `__get__` и `__set__`) — вызывает его `__get__`, и поиск **останавливается**. Дескриптор данных имеет приоритет над `__dict__` экземпляра.\n2. Иначе смотрит в `obj.__dict__` — обычные атрибуты экземпляра.\n3. Иначе — **не-данные** дескриптор (только `__get__`, например обычный метод) или просто значение из класса.\n\nИменно поэтому `property` «перехватывает» доступ: он стоит в классе как дескриптор данных и побеждает `obj.__dict__`. Из-за этого нельзя «обойти» свойство, положив значение прямо в `obj.__dict__['x']` — чтение всё равно пойдёт через `__get__` дескриптора.\n\n## Что это объясняет на практике\n\n- Само значение хранится в `obj.__dict__` под **другим** именем (`_celsius`), а `celsius` — это запись в `__dict__` **класса**, общая для всех экземпляров.\n- `t.kelvin = 0` падает с `AttributeError`, потому что `__set__` дескриптора без сеттера намеренно бросает ошибку.\n- Понимание «property — дескриптор в классе» — это мост к будущим темам: `classmethod`, `staticmethod` и кастомные дескрипторы устроены ровно так же.",
			code: {
				title: "property живёт в классе и перехватывает доступ",
				language: 'python',
				code: String.raw`class C:
    @property
    def x(self):
        print("  [вызван getter x]")
        return self._x

    @x.setter
    def x(self, v):
        print("  [вызван setter x]")
        self._x = v


# 1) Объект property лежит в C.__dict__, у экземпляра его нет:
print("type(C.__dict__['x']):", type(C.__dict__['x']).__name__)
print("'x' в C.__dict__:", 'x' in C.__dict__)

c = C()
print("\nприсваивание c.x = 5:")
c.x = 5                                   # -> вызовет setter
print("чтение c.x:")
print("  значение:", c.x)                 # -> вызовет getter

# 2) В __dict__ экземпляра — только _x, а не x:
print("\nc.__dict__:", c.__dict__)

# 3) property — дескриптор ДАННЫХ: есть __get__ И __set__,
#    поэтому приоритет над c.__dict__.
p = C.__dict__['x']
print("\nу property есть __get__:", hasattr(p, "__get__"))
print("у property есть __set__:", hasattr(p, "__set__"))`,
				explanation: "`x` физически лежит в `C.__dict__` как объект типа `property`, а в `c.__dict__` оседает только `_x`. Поскольку у `property` есть и `__get__`, и `__set__`, это дескриптор данных — он перехватывает `c.x` раньше, чем Python заглянет в `c.__dict__`. Отсюда и весь «магический» характер свойств."
			}
		},
		{
			kind: "connection",
			heading: "__slots__: экономия памяти и запрет лишних атрибутов",
			body: "По умолчанию каждый экземпляр носит свой `__dict__` — словарь атрибутов. Это даёт динамику (можно дописать `obj.whatever = 1` в любой момент), но словарь занимает память и медленнее простого слота. Когда объектов сотни тысяч (точки, узлы графа, записи), накладные расходы кусаются.\n\n[[slots|__slots__]] — это объявление в теле класса: `__slots__ = ('x', 'y')`. Оно говорит «у экземпляров будут **только** эти атрибуты, выделяй под них фиксированные слоты, а `__dict__` не создавай».\n\n## Что даёт\n\n1. **Память** — нет словаря на экземпляр; атрибуты лежат компактно. Экономия легко в 2–3 раза на мелких объектах.\n2. **Запрет произвольных атрибутов** — `obj.z = 1`, если `z` не в `__slots__`, бросит `AttributeError`. Это ловит опечатки (`obj.lenght = 5` молча создал бы новое поле в обычном классе, а тут упадёт).\n\n## Ограничения (важно)\n\n- **Нет `__dict__`** — значит, нельзя динамически добавлять атрибуты. Если он реально нужен, добавь `'__dict__'` прямо в `__slots__` (тогда смысл частично теряется).\n- **Не наследуется автоматически.** Если подкласс не объявит свой `__slots__`, у его экземпляров `__dict__` **вернётся**, и весь выигрыш исчезнет. Слоты надо объявлять на каждом уровне иерархии.\n- **Конфликт с `property` по имени.** Нельзя иметь слот и свойство с одинаковым именем — будет `ValueError` при создании класса. Поэтому в `__slots__` кладут **хранимые** поля (часто приватные `_x`), а вычисляемые отдают через `property`.\n- Несовместим с переменными класса того же имени и осложняет множественное наследование.",
			code: {
				title: "__slots__: память, запрет атрибутов, утечка через наследование",
				language: 'python',
				code: String.raw`import sys

class PointDict:                 # обычный класс — у каждого экземпляра свой __dict__
    def __init__(self, x, y):
        self.x = x
        self.y = y

class PointSlots:                # со __slots__ — атрибуты в слотах, __dict__ нет
    __slots__ = ('x', 'y')
    def __init__(self, x, y):
        self.x = x
        self.y = y


a = PointDict(1, 2)
b = PointSlots(1, 2)

# 1) Запрет произвольных атрибутов:
a.z = 99                          # обычному объекту можно дописать что угодно
print("PointDict: добавили a.z =", a.z)
try:
    b.z = 99                      # слотовому — нельзя
except AttributeError as e:
    print("PointSlots: b.z = 99 ->", type(e).__name__)

# 2) Нет __dict__:
print("у PointDict есть __dict__:", hasattr(a, "__dict__"))
print("у PointSlots есть __dict__:", hasattr(b, "__dict__"))

# 3) Экономия памяти:
size_dict = sys.getsizeof(a) + sys.getsizeof(a.__dict__)
size_slot = sys.getsizeof(b)
print(f"\nPointDict  ~ {size_dict} байт (объект + __dict__)")
print(f"PointSlots ~ {size_slot} байт (только объект)")
print(f"экономия   ~ {size_dict - size_slot} байт на экземпляр")

# 4) Ограничение: __slots__ НЕ наследуется -> __dict__ возвращается.
class Point3D(PointSlots):
    pass                          # нет своего __slots__

p3 = Point3D(1, 2)
p3.z = 3                          # снова можно дописывать!
print("\nнаследник без __slots__: p3.z =", p3.z,
      "| есть __dict__:", hasattr(p3, "__dict__"))`,
				explanation: "У `PointSlots` нет `__dict__`: `b.z = 99` падает, объект заметно меньше (сравни числа в выводе — обычно экономия в разы). Но `Point3D` забыл объявить свой `__slots__`, и `__dict__` вернулся — `p3.z = 3` снова проходит. Это главная грабля: слоты надо объявлять на каждом уровне наследования."
			}
		}
	],
	tasks: [
		{
			id: 'oop-d2-t1',
			difficulty: "base",
			prompt: "Напиши класс `Person` с полями `name` и `age`. Возраст должен валидироваться: только целое число в диапазоне `0..150`, иначе исключение (`TypeError` для нецелого, `ValueError` для выхода за диапазон). Добавь **вычисляемое read-only** свойство `is_adult` (`True`, если `age >= 18`). Проверь, что валидация срабатывает и в конструкторе, и что `is_adult` нельзя присвоить.",
			hint: "Храни значение в `self._age`, наружу отдай `age` через `@property` + `@age.setter`. В `__init__` присваивай `self.age = age` (через свойство), чтобы валидация работала при создании. `is_adult` — только геттер, без сеттера.",
			solution: "Ключевые приёмы: приватное поле `_age`, валидация в сеттере, присваивание через свойство в `__init__`, вычисляемое read-only `is_adult` (нет сеттера → присваивание бросает `AttributeError`).\n\n```python\nclass Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age            # через сеттер -> валидация и в __init__\n\n    @property\n    def age(self):\n        return self._age\n\n    @age.setter\n    def age(self, value):\n        if not isinstance(value, int):\n            raise TypeError(\"возраст должен быть целым числом\")\n        if value < 0 or value > 150:\n            raise ValueError(\"возраст вне диапазона 0..150\")\n        self._age = value\n\n    @property\n    def is_adult(self):           # вычисляемое read-only\n        return self._age >= 18\n\n\np = Person(\"Аня\", 30)\nprint(p.is_adult)                 # True\np.age = -5                        # ValueError\n```",
			answer: "`age` — свойство с валидацией в сеттере; `is_adult` — вычисляемое read-only свойство (`age >= 18`), без сеттера.",
			xp: 12
		},
		{
			id: 'oop-d2-t2',
			difficulty: "base",
			prompt: "Тебе дали «джавоподобный» класс с методами `get_celsius()` и `set_celsius(v)` (с проверкой «не ниже абсолютного нуля»). Перепиши его по-питоновски через `@property`, чтобы клиентский код обращался как `t.celsius` и `t.celsius = 25`. Объясни в одном предложении, почему так лучше, чем оставить `get_/set_`.",
			hint: "Геттер `get_celsius` → метод `celsius` под `@property`; `set_celsius` → метод `celsius` под `@celsius.setter` с тем же телом проверки. Доступ становится атрибутным.",
			solution: "Превращаем `get_/set_` в одно свойство `celsius`. Преимущество: интерфейс — обычный атрибут (`t.celsius = 25`), и его можно было бы ввести позже, не ломая код вызывающих; `get_/set_` навязывают громоздкий синтаксис сразу и без нужды.\n\n```python\nclass Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(\"ниже абсолютного нуля\")\n        self._celsius = value\n\n\nt = Temperature(20)\nt.celsius = 25                    # как обычный атрибут\nprint(t.celsius)                  # 25\n```",
			answer: "`celsius` становится `@property` + `@celsius.setter`; доступ `t.celsius`/`t.celsius = 25` чище и не требует менять вызывающий код, когда добавляется логика.",
			xp: 12
		},
		{
			id: 'oop-d2-t3',
			difficulty: "star",
			prompt: "Сделай класс `Vector2D` с координатами `x`, `y`, который: (1) использует `__slots__`, чтобы экономить память и запрещать произвольные атрибуты; (2) имеет вычисляемое свойство `length` (длина вектора). Объясни, почему `length` **не** надо класть в `__slots__`, и что произойдёт при `v.z = 1`. Дополнительно: что сломается, если наследник `Vector3D(Vector2D)` забудет объявить свой `__slots__`?",
			hint: "В `__slots__` перечисляют только **хранимые** поля (`x`, `y`). `length` — это `property` в классе (дескриптор), а слот и свойство с одним именем конфликтуют. Длину считай через `math.hypot`. Наследник без своего `__slots__` снова получает `__dict__`.",
			solution: "`__slots__` содержит только хранимые `x`, `y`; `length` — вычисляемое свойство (живёт в классе как дескриптор, его в слоты класть нельзя — будет конфликт имён). `v.z = 1` бросает `AttributeError`, потому что нет `__dict__`. Если `Vector3D` не объявит свой `__slots__`, у его экземпляров `__dict__` вернётся — экономия памяти и запрет лишних атрибутов исчезнут.\n\n```python\nimport math\n\nclass Vector2D:\n    __slots__ = ('x', 'y')        # только ХРАНИМЫЕ поля\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    @property\n    def length(self):             # вычисляемое read-only, НЕ в __slots__\n        return math.hypot(self.x, self.y)\n\n    def __repr__(self):\n        return f\"Vector2D({self.x}, {self.y})\"\n\n\nv = Vector2D(3, 4)\nprint(v, \"длина:\", v.length)      # 5.0\ntry:\n    v.z = 1                       # AttributeError: нет __dict__\nexcept AttributeError as e:\n    print(type(e).__name__)\nprint(\"есть __dict__:\", hasattr(v, \"__dict__\"))  # False\n```",
			answer: "`__slots__ = ('x','y')`; `length` — `property` (не в слотах, иначе конфликт); `v.z = 1` → `AttributeError` (нет `__dict__`); наследник без своего `__slots__` снова получает `__dict__` и теряет выигрыш.",
			xp: 25
		}
	],
	mastery: [
		"Различаю public / _protected / __private и объясняю, что __ — это name mangling (_Class__attr в __dict__), а не настоящий private; знаю, зачем mangling нужен в наследовании",
		"Формулирую, почему в Python нет настоящего private («все взрослые люди») и почему get_/set_ заранее не пишут — атрибут превращается в property без смены интерфейса",
		"Пишу @property (getter), @x.setter с валидацией, read-only и вычисляемые свойства; кладу значение в _x и избегаю рекурсии в сеттере; валидирую в том числе в __init__",
		"Объясняю под капотом: property — дескриптор данных в классе, имеющий приоритет над __dict__ экземпляра; понимаю порядок разрешения атрибута",
		"Применяю __slots__ для экономии памяти и запрета произвольных атрибутов; знаю ограничения: нет __dict__, не наследуется автоматически, конфликт слота и одноимённого property"
	]
};
