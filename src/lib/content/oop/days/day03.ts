import type { Day } from '$lib/types';

export const day03: Day = {
	n: 3,
	phaseId: "basics",
	kind: 'theory',
	title: "Методы класса и статические; фабрики",
	est: '1–2 ч',
	goal: "Научиться различать три вида методов — обычный, `@classmethod` и `@staticmethod` — понять, *что* и *почему* приходит первым аргументом ([[self|self]] / [[cls|cls]] / ничего), строить альтернативные конструкторы-фабрики через [[cls|cls]], и осознанно держать общее состояние класса в [[class-attribute|атрибутах класса]] (реестры, счётчики, конфиг), не наступив на классические ловушки.",
	sections: [
		{
			kind: "definition",
			heading: "Три вида методов: кто получает первый аргумент",
			body: "В теле класса можно объявить функцию тремя способами, и различаются они ровно одним: *что* Python молча подставляет первым аргументом при вызове.\n\n- **Обычный (instance) метод** — первым аргументом получает [[self|self]], конкретный экземпляр. Через `self` он читает и пишет состояние объекта (`self.x`).\n- **`@classmethod`** — первым аргументом получает [[cls|cls]], сам класс (а при вызове от подкласса — *этот подкласс*). Через `cls` он добирается до [[class-attribute|атрибутов класса]] и, что важнее всего, может создавать новые экземпляры: `cls(...)`.\n- **`@staticmethod`** — не получает *ничего* лишнего: ни `self`, ни `cls`. Это просто функция, которую положили внутрь класса, потому что она логически к нему относится (утилита, валидатор), но её поведение не зависит ни от экземпляра, ни от класса.\n\n## Почему именно так\nИмена `self` и `cls` — *конвенция*, а не ключевые слова: технически можно назвать первый параметр как угодно, но так делать нельзя — это сломает читаемость. Механизм же один и тот же: и `classmethod`, и `staticmethod` — это [[descriptor|дескрипторы]] (объекты с методом `__get__`), которые при доступе к атрибуту решают, *как* обернуть функцию. Обычная функция при доступе через экземпляр оборачивается в [[bound-method|связанный метод]] и подставляет `self`; `classmethod` подставляет `cls`; `staticmethod` отдаёт функцию как есть.\n\n## Как отличить на практике\nЕсли методу нужны данные конкретного объекта — это обычный метод. Если нужен класс (создать экземпляр, прочитать общий счётчик/конфиг) — `@classmethod`. Если не нужно *ни то, ни другое* — `@staticmethod`. Частая ошибка новичка — пихать `self` в метод, который им не пользуется: это сигнал, что метод должен быть `@staticmethod` или `@classmethod`.",
			code: {
				title: "Кто приходит первым аргументом",
				language: 'python',
				code: String.raw`class Demo:
    kind = "база"  # атрибут класса

    def instance_method(self, x):
        # self — конкретный экземпляр
        return ("instance", self, x)

    @classmethod
    def class_method(cls, x):
        # cls — сам класс (или подкласс)
        return ("class", cls, cls.kind, x)

    @staticmethod
    def static_method(x):
        # ни self, ни cls — просто функция в пространстве имён класса
        return ("static", x)


d = Demo()

# 1) Что приходит первым аргументом?
print("instance:", d.instance_method(10))        # self = d
print("class   :", Demo.class_method(10))         # cls = Demo
print("static  :", Demo.static_method(10))        # ничего лишнего

print("-" * 40)

# 2) classmethod и staticmethod зовутся и от класса, и от экземпляра — одинаково
print("через экземпляр, class :", d.class_method(99))
print("через экземпляр, static:", d.static_method(99))

print("-" * 40)

# 3) Тип того, что лежит "под капотом"
print("type instance_method в классе:", type(Demo.__dict__["instance_method"]).__name__)
print("type class_method    в классе:", type(Demo.__dict__["class_method"]).__name__)
print("type static_method   в классе:", type(Demo.__dict__["static_method"]).__name__)`,
				explanation: "Видно, что `instance_method` получает сам объект `d`, `class_method` — класс `Demo` (и сразу читает через `cls.kind` атрибут класса), а `static_method` — только переданное число. `classmethod` и `staticmethod` одинаково вызываются и от класса, и от экземпляра. А `type(...)` показывает, что под капотом в `__dict__` класса лежат разные объекты: `function`, `classmethod`, `staticmethod` — это и есть [[descriptor|дескрипторы]], которые решают, что подставить."
			}
		},
		{
			kind: "definition",
			heading: "classmethod как альтернативный конструктор (фабрика)",
			body: "`__init__` принимает «сырые» поля объекта. Но в жизни данные часто приходят в *другом* виде: строка `\"2026-06-27\"`, unix-timestamp, словарь из JSON, строка `\"$100\"`. Городить логику разбора прямо в `__init__` плохо — он становится перегруженным и неоднозначным («а если передали строку? а если число?»). Решение — **фабричные методы**: отдельные именованные `@classmethod`-конструкторы, каждый под свой формат входа.\n\nКанонические имена — `from_string`, `from_timestamp`, `from_dict`. Внутри такой метод разбирает вход и в конце зовёт `cls(...)` — то есть обычный `__init__` с уже готовыми полями.\n\n## Почему cls(...), а не Имя_Класса(...)\nКлючевой момент: фабрика создаёт объект через `cls(...)`, а не через жёстко прописанное имя класса. Тогда если кто-то унаследует ваш класс, его `Подкласс.from_string(...)` вернёт экземпляр *подкласса*, а не базового класса — фабрика «уважает» наследование бесплатно. Зашитое имя класса этот полиморфизм ломает (подробно — в секции про ловушки).\n\n## Почему это лучше, чем перегрузка __init__\nВ Python нет перегрузки функций по сигнатуре (как в C++/Java). Если бы вы хотели «конструктор из строки» и «конструктор из чисел», пришлось бы внутри одного `__init__` гадать по типам аргументов — хрупко и нечитаемо. Именованные фабрики решают это явно: имя метода *документирует*, какой формат входа он ждёт. Это и есть питоновская замена перегрузке конструкторов.",
			code: {
				title: "Date: фабрики from_string / from_timestamp + staticmethod-валидатор + реестр",
				language: 'python',
				code: String.raw`from datetime import datetime, timezone


class Date:
    # --- атрибуты класса = ОБЩЕЕ состояние ---
    registry = []          # реестр всех созданных экземпляров
    created_count = 0      # счётчик
    _DAYS_IN_MONTH = (31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)

    def __init__(self, year, month, day):
        if not Date.is_valid(year, month, day):
            raise ValueError(f"некорректная дата: {year}-{month}-{day}")
        self.year, self.month, self.day = year, month, day
        # регистрируем экземпляр в общем для класса состоянии
        Date.registry.append(self)
        Date.created_count += 1

    # --- staticmethod: чистая утилита, логически принадлежит Date ---
    @staticmethod
    def is_valid(year, month, day):
        if not (1 <= month <= 12):
            return False
        leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
        dim = 29 if (month == 2 and leap) else Date._DAYS_IN_MONTH[month - 1]
        return 1 <= day <= dim

    # --- classmethod: альтернативный конструктор из строки ---
    @classmethod
    def from_string(cls, s):
        y, m, d = (int(part) for part in s.split("-"))
        return cls(y, m, d)        # cls(...) -> работает и для подклассов

    # --- ещё одна фабрика: из unix-timestamp ---
    @classmethod
    def from_timestamp(cls, ts):
        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
        return cls(dt.year, dt.month, dt.day)

    def __repr__(self):
        return f"{type(self).__name__}({self.year:04d}-{self.month:02d}-{self.day:02d})"


# обычный конструктор
a = Date(2024, 2, 29)              # 2024 високосный -> 29 февраля валидно
# фабрика из строки
b = Date.from_string("2026-06-27")
# фабрика из timestamp (0 = 1970-01-01)
c = Date.from_timestamp(0)

print("a:", a, "| b:", b, "| c:", c)
print("создано экземпляров:", Date.created_count)
print("реестр:", Date.registry)

print("-" * 40)
# staticmethod как валидатор — даже без экземпляра
print("is_valid(2023, 2, 29):", Date.is_valid(2023, 2, 29))   # 2023 не високосный
print("is_valid(2024, 2, 29):", Date.is_valid(2024, 2, 29))   # високосный
print("is_valid(2024, 13, 1):", Date.is_valid(2024, 13, 1))   # нет 13-го месяца

print("-" * 40)
try:
    Date.from_string("2023-02-29")
except ValueError as e:
    print("поймали ошибку:", e)`,
				explanation: "Это центральный пример дня. `from_string` и `from_timestamp` — фабрики-`@classmethod`: разбирают вход и зовут `cls(...)`. `is_valid` — `@staticmethod`-валидатор: вызывается даже без экземпляра (`Date.is_valid(...)`) и не зависит ни от объекта, ни от класса по сути (он только смотрит на переданные числа). Атрибуты класса `registry` и `created_count` — общее состояние: каждый созданный объект попадает в реестр и инкрементит счётчик. Последний блок показывает, что фабрика честно пробрасывает валидацию `__init__` (29 февраля 2023 — невалидно)."
			}
		},
		{
			kind: "definition",
			heading: "staticmethod: утилита, которой место в классе",
			body: "`@staticmethod` — самый «слабый» из трёх: он не получает ни `self`, ни `cls`, то есть формально это просто функция. Возникает резонный вопрос: *зачем вообще класть функцию в класс, если она от класса не зависит?* Ответ — **связность кода (cohesion)**. Функция `is_valid` логически принадлежит `Date`: она проверяет, бывают ли такие год/месяц/день. Держать её внутри класса означает, что вызывается она как `Date.is_valid(...)` — читателю сразу ясно, *чьё* это правило, и не засоряется глобальное пространство имён.\n\n## Когда staticmethod, а когда обычная функция модуля\nЕсли утилита нужна только этому классу и концептуально неотделима от него (валидатор полей, парсер внутреннего формата, нормализатор) — `@staticmethod`. Если функция полезна шире и не привязана к классу — выносите её на уровень модуля, не усложняйте. `@staticmethod` — это не «бесплатная организация всего подряд», а способ сказать «эта функция — часть API класса, но ей не нужен ни объект, ни класс».\n\n## staticmethod против classmethod для валидатора\nВажная тонкость: наш `is_valid` обращается к `Date._DAYS_IN_MONTH` *через имя класса* `Date`, а не через `cls`. Это сознательный выбор: `@staticmethod` не получает `cls`, поэтому жёсткая ссылка на `Date` — единственный вариант. Цена — подкласс не сможет переопределить `_DAYS_IN_MONTH` и повлиять на валидатор. Если такая настройка через наследование нужна, валидатор стоит сделать `@classmethod` и обращаться через `cls._DAYS_IN_MONTH`. Для большинства «чистых» утилит этого не требуется, и `@staticmethod` — правильный, более честный выбор: его сигнатура прямо говорит «я не завишу от класса».",
			code: {
				title: "bound vs unbound: метод как функция в пространстве имён класса",
				language: 'python',
				code: String.raw`class Counter:
    def tick(self, n):
        return n + 1


c = Counter()

# 1) Функция в теле класса — обычная функция (объект function)
raw = Counter.__dict__["tick"]
print("в __dict__ лежит:", type(raw).__name__)          # function

# 2) Доступ через ЭКЗЕМПЛЯР рождает bound method: self уже привязан
bound = c.tick
print("c.tick это:", type(bound).__name__)               # method
print("__self__ у bound:", bound.__self__ is c)          # True
print("bound(10):", bound(10))                            # self=c подставлен

# 3) Доступ через КЛАСС в Python 3 даёт ПРОСТО функцию (не unbound-объект)
plain = Counter.tick
print("Counter.tick это:", type(plain).__name__)          # function
print("plain(c, 10):", plain(c, 10))                      # self передаём руками

print("-" * 40)

# 4) bound метод эквивалентен ручной привязке через дескриптор __get__
# Именно function.__get__(instance, owner) превращает функцию в bound method.
manually = Counter.__dict__["tick"].__get__(c, Counter)
print("ручная привязка == c.tick по поведению:", manually(10) == c.tick(10))
print("__func__ совпадает:", manually.__func__ is Counter.__dict__["tick"])`,
				explanation: "Это короткий мостик к [[descriptor|дескрипторам]] (день 9). В `Counter.__dict__` лежит обычная `function`. Доступ через экземпляр (`c.tick`) рождает [[bound-method|bound method]] — у него есть `__self__`, и `self` подставляется автоматически. Доступ через класс (`Counter.tick`) в Python 3 даёт *просто функцию* (исторический «unbound method» был убран), поэтому `self` надо передать руками: `plain(c, 10)`. Последний блок раскрывает магию: связывание — это вызов `function.__get__(c, Counter)`, протокол дескриптора. То есть `c.tick` — синтаксический сахар над `__get__`."
			}
		},
		{
			kind: "derivation",
			heading: "Под капотом: почему cls важнее, чем имя класса",
			body: "Разберём, *почему* фабрика обязана использовать `cls`, а не зашитое имя класса — это самая частая ошибка при написании альтернативных конструкторов.\n\nКогда вы пишете `Sub.from_string(...)`, Python ищет `from_string` по [[mro|MRO]] (порядку разрешения методов): не нашёл в `Sub` — взял из `Base`. Но `@classmethod` устроен так, что `cls` связывается с *тем классом, через который произошёл доступ* — то есть с `Sub`, а не с `Base`, где метод физически определён. Это и делает фабрику полиморфной: один код в базовом классе порождает экземпляры любого наследника.\n\n## Что ломается при зашитом имени\nЕсли внутри фабрики написать `return Base()` вместо `return cls()`, то `Sub.from_string(...)` всё равно вернёт `Base` — наследник «сломан»: метод доступен, но создаёт не тот тип. Баг особенно коварен потому, что в базовом классе всё работает, и проблема всплывает только когда кто-то наследуется.\n\n## Связь с MRO\n`cls` — это не «класс, где определён метод», а «класс, *от имени* которого метод вызван». Поэтому `cls.__name__`, `cls._SOME_CONST`, `cls(...)` внутри `@classmethod` все «смотрят» на актуальный класс из цепочки [[mro|MRO]]. Это тот же принцип, по которому `type(self)` в обычном методе даёт реальный класс объекта, а не класс, где метод написан. Запомните правило: *в фабрике и любом методе, создающем экземпляры «своего» типа, всегда `cls(...)` или `type(self)(...)`, никогда не зашитое имя*.",
			code: {
				title: "cls уважает подкласс, зашитое имя — нет",
				language: 'python',
				code: String.raw`class Base:
    @classmethod
    def make_good(cls):
        # cls — это реальный класс, через который позвали (Base ИЛИ Sub)
        return cls()

    @classmethod
    def make_bad(cls):
        # жёстко зашили имя класса -> наследник сломан
        return Base()


class Sub(Base):
    pass


print("make_good от Sub:", type(Sub.make_good()).__name__)   # Sub  — правильно
print("make_bad  от Sub:", type(Sub.make_bad()).__name__)    # Base — ловушка!

print("-" * 40)

# То же с реальной фабрикой: classmethod уважает подкласс
class Money:
    def __init__(self, amount):
        self.amount = amount

    @classmethod
    def from_string(cls, s):
        return cls(int(s.strip().lstrip("$")))

    def __repr__(self):
        return f"{type(self).__name__}({self.amount})"


class Bonus(Money):
    pass


print("Money.from_string :", Money.from_string("$100"))    # Money(100)
print("Bonus.from_string :", Bonus.from_string("$100"))    # Bonus(100) — тот же код!

print("-" * 40)

# staticmethod НЕ получает cls, поэтому полиморфизма по классу не даёт —
# но он и не нужен для чистой утилиты, не зависящей от класса.
class Mathy:
    @staticmethod
    def add(a, b):
        return a + b

print("staticmethod add(2, 3):", Mathy.add(2, 3))`,
				explanation: "`make_good` через `cls()` уважает класс вызова: `Sub.make_good()` даёт `Sub`. `make_bad` с зашитым `Base()` ломает наследника — даже при вызове от `Sub` возвращает `Base`. Та же логика в реальной фабрике: `Bonus.from_string(\"$100\")` возвращает `Bonus`, хотя код написан один раз в `Money`. Это бесплатный полиморфизм, ради которого фабрики и делают `@classmethod`. `@staticmethod` (`Mathy.add`) этого не умеет — у него нет `cls` — но для утилиты без привязки к классу полиморфизм и не нужен."
			}
		},
		{
			kind: "note",
			heading: "Атрибуты класса как общее состояние — и две ловушки",
			body: "[[class-attribute|Атрибуты класса]] объявляются прямо в теле класса (не в `__init__`) и существуют в *одном* экземпляре на весь класс — это естественное место для **общего состояния**: реестры созданных объектов, счётчики, конфиг по умолчанию (`timeout = 30`), общие константы. В нашем `Date` это `registry` и `created_count`.\n\nНо именно из-за «одного на всех» здесь две классические ловушки, на которых спотыкаются почти все.\n\n## Ловушка 1: затенение при присваивании через экземпляр\nЧтение `self.timeout` сначала ищет атрибут *экземпляра*, и только не найдя — поднимается к атрибуту класса. А вот *запись* `self.timeout = 5` всегда создаёт **новый атрибут экземпляра**, затеняющий классовый, — она *не* меняет общий дефолт. Поэтому чтобы поменять общее значение для всех, надо писать через класс: `Service.timeout = 60` (или `type(self).timeout = ...`). Частый баг: думали, что меняют общий конфиг через `self.x = ...`, а на деле завели приватную копию у одного объекта.\n\n## Ловушка 2: изменяемый атрибут класса\nЕсли атрибут класса — *изменяемый* объект (список, словарь) и вы мутируете его «на месте» (`self.items.append(...)`), то меняется *общий* объект, и его видят все экземпляры. Это почти всегда баг. Личное изменяемое состояние должно создаваться в `__init__` (`self.items = []`) — тогда у каждого объекта свой список. Запомните правило: *неизменяемые дефолты* (числа, строки, кортежи) можно держать атрибутом класса спокойно; *изменяемые личные данные* — только в `__init__`. Изменяемый атрибут класса оправдан лишь когда вы *намеренно* хотите общее состояние — как реестр в `Date` (его специально дополняют все экземпляры).",
			code: {
				title: "Затенение и общий изменяемый атрибут",
				language: 'python',
				code: String.raw`class Service:
    # конфиг по умолчанию + счётчик — ОБЩЕЕ состояние класса
    timeout = 30          # дефолт, общий для всех
    instances = 0

    def __init__(self, name):
        self.name = name
        Service.instances += 1     # пишем в АТРИБУТ КЛАССА явно через имя класса


s1 = Service("api")
s2 = Service("db")
print("instances:", Service.instances)               # 2
print("s1.timeout / s2.timeout:", s1.timeout, s2.timeout)  # оба видят дефолт 30

print("-" * 40)
# Ловушка 1: присваивание через ЭКЗЕМПЛЯР создаёт атрибут ЭКЗЕМПЛЯРА,
# затеняющий атрибут класса, а не меняет общий дефолт.
s1.timeout = 5
print("после s1.timeout = 5")
print("s1.timeout:", s1.timeout, "| s2.timeout:", s2.timeout, "| Service.timeout:", Service.timeout)
print("'timeout' в s1.__dict__:", "timeout" in s1.__dict__)   # True — своя копия
print("'timeout' в s2.__dict__:", "timeout" in s2.__dict__)   # False — берёт у класса

print("-" * 40)
# Менять общий дефолт надо через класс:
Service.timeout = 60
print("Service.timeout = 60 ->  s2.timeout:", s2.timeout)     # 60 (s2 без своей копии)
print("                          s1.timeout:", s1.timeout)    # 5  (своя копия не тронута)

print("-" * 40)
# Ловушка 2: ИЗМЕНЯЕМЫЙ атрибут класса делится между всеми экземплярами.
class Cart:
    items = []            # ОДИН список на весь класс — почти всегда баг!
    def add(self, x):
        self.items.append(x)

c1, c2 = Cart(), Cart()
c1.add("яблоко")
print("c2.items видит чужое:", c2.items)   # ['яблоко'] — общий список!

# Правильно: личное изменяемое состояние — в __init__ (свой список на экземпляр)
class CartOK:
    def __init__(self):
        self.items = []
    def add(self, x):
        self.items.append(x)

d1, d2 = CartOK(), CartOK()
d1.add("груша")
print("d2.items изолирован:", d2.items)    # [] — у каждого свой`,
				explanation: "`instances` корректно считает все объекты, потому что инкремент идёт через `Service.instances` (имя класса). `s1.timeout = 5` создаёт *личную* копию у `s1` (она появляется в `s1.__dict__`), не трогая ни `s2`, ни классовый дефолт — это затенение. После `Service.timeout = 60` меняется общий дефолт: `s2` (без своей копии) видит 60, а `s1` остаётся при своих 5. Класс `Cart` показывает ловушку №2: общий список `items` мутируется всеми (`c2` видит «яблоко», добавленное через `c1`). `CartOK` чинит это, заводя `self.items` в `__init__`."
			}
		},
		{
			kind: "connection",
			heading: "Как выбрать вид метода: рабочая шпаргалка",
			body: "Сведём день в один алгоритм решения. Когда пишете метод, спросите по порядку:\n\n1. **Нужны ли мне данные конкретного объекта** (`self.поле`)? Да → обычный метод.\n2. **Нет, но нужен класс** — создать экземпляр (`cls(...)`), прочитать/изменить [[class-attribute|общий атрибут класса]] (счётчик, реестр, конфиг), или я хочу, чтобы поведение уважало подкласс? Да → `@classmethod`.\n3. **Не нужно ни то, ни другое**, но функция логически часть класса (валидатор, парсер, чистая утилита)? → `@staticmethod`.\n4. **Функция вообще не привязана к классу** и полезна шире? → не метод вовсе, а обычная функция модуля.\n\n## Типичные «запахи»\n- Метод объявлен обычным (`self`), но `self` внутри не используется → должен быть `@staticmethod` или `@classmethod`. Линтеры это ловят.\n- Альтернативный конструктор создаёт объект через зашитое имя класса → переделать на `cls(...)`, иначе наследники сломаются.\n- В `@staticmethod` понадобился доступ к классу (например, к константе с учётом наследования) → это сигнал, что нужен `@classmethod` с `cls`.\n- Изменяемый атрибут класса (`[]`, `{}`), который вы *не* хотели делать общим → перенести в `__init__`.\n\n## Мостик вперёд\nВсё это держится на одном механизме — [[descriptor|протоколе дескрипторов]] (`__get__`), который вы видели в секции про bound-методы: `function`, `classmethod`, `staticmethod` — три разных дескриптора, по-разному оборачивающих функцию при доступе через класс или экземпляр. Подробно дескрипторы разберём в день 9; сейчас достаточно интуиции «доступ к атрибуту-методу — это вызов `__get__`, который и решает, что подставить первым аргументом».",
			code: {
				title: "Реестр по типам с учётом наследования (через cls)",
				language: 'python',
				code: String.raw`class Animal:
    # реестр: имя класса -> список экземпляров. ОБЩИЙ для всей иерархии.
    _registry = {}

    def __init__(self, name):
        self.name = name
        # ключ берём от РЕАЛЬНОГО класса экземпляра — через type(self)
        cls_name = type(self).__name__
        Animal._registry.setdefault(cls_name, []).append(self)

    @classmethod
    def count(cls):
        # сколько экземпляров ИМЕННО этого класса (по имени cls)
        return len(Animal._registry.get(cls.__name__, []))

    @classmethod
    def total(cls):
        return sum(len(v) for v in Animal._registry.values())

    @classmethod
    def from_string(cls, s):
        # фабрика уважает подкласс: cls(...) создаст Cat, если позвать Cat.from_string
        return cls(s.strip())


class Cat(Animal):
    pass


class Dog(Animal):
    pass


c1 = Cat.from_string(" Барсик ")
c2 = Cat("Мурка")
d1 = Dog("Рекс")

print("тип c1:", type(c1).__name__)     # Cat (фабрика уважает подкласс)
print("Cat.count():", Cat.count())      # 2
print("Dog.count():", Dog.count())      # 1
print("Animal.total():", Animal.total())# 3
print("реестр:", {k: [a.name for a in v] for k, v in Animal._registry.items()})`,
				explanation: "Финальный синтез дня. Реестр `_registry` — изменяемый атрибут класса, общий для всей иерархии (здесь это *намеренно*). В `__init__` ключ берётся через `type(self).__name__`, поэтому `Cat` и `Dog` пишутся под своими именами. Фабрика `from_string` через `cls(...)` создаёт правильный подтип (`Cat.from_string` даёт `Cat`). `count` (через `cls.__name__`) считает экземпляры конкретного класса, `total` — все. Это всё три механизма дня сразу: `@classmethod` с `cls`, общее состояние в атрибуте класса и полиморфная фабрика."
			}
		}
	],
	tasks: [
		{
			id: 'oop-d3-t1',
			difficulty: "base",
			prompt: "Реализуй класс `Temperature`, хранящий температуру в градусах Цельсия (`self.celsius`). Добавь: (1) `@staticmethod` `is_valid(celsius)`, проверяющий, что температура не ниже абсолютного нуля (`-273.15 °C`); `__init__` должен через него валидировать вход и бросать `ValueError` при нарушении; (2) две фабрики-`@classmethod`: `from_fahrenheit(f)` (формула $c=(f-32)\\cdot 5/9$) и `from_kelvin(k)` ($c = k - 273.15$). Фабрики обязаны создавать объект через `cls(...)`, а не через имя класса. Проверь: `Temperature.from_fahrenheit(212)` даёт ~100 °C, а `from_kelvin(-10)` бросает ошибку.",
			hint: "Константу `-273.15` сделай атрибутом класса (`ABSOLUTE_ZERO_C`). `is_valid` — `@staticmethod`, обращается к ней через имя класса. Фабрики возвращают `cls(...)`, чтобы [[cls|cls]] уважал подкласс.",
			solution: "Ключевые моменты: валидатор — `@staticmethod` (ему не нужны ни `self`, ни `cls`), фабрики — `@classmethod` с `cls(...)`. Константа абсолютного нуля живёт атрибутом класса.\n\n```python\nclass Temperature:\n    ABSOLUTE_ZERO_C = -273.15\n\n    def __init__(self, celsius):\n        if not Temperature.is_valid(celsius):\n            raise ValueError(f\"ниже абсолютного нуля: {celsius}\")\n        self.celsius = celsius\n\n    @staticmethod\n    def is_valid(celsius):\n        return celsius >= Temperature.ABSOLUTE_ZERO_C\n\n    @classmethod\n    def from_celsius(cls, c):\n        return cls(c)\n\n    @classmethod\n    def from_fahrenheit(cls, f):\n        return cls((f - 32) * 5 / 9)\n\n    @classmethod\n    def from_kelvin(cls, k):\n        return cls(k + cls.ABSOLUTE_ZERO_C)\n\n    def __repr__(self):\n        return f\"{type(self).__name__}({self.celsius:.2f}°C)\"\n\n\nprint(Temperature.from_fahrenheit(212))   # Temperature(100.00°C)\nprint(Temperature.from_kelvin(0))         # Temperature(-273.15°C)\ntry:\n    Temperature.from_kelvin(-10)\nexcept ValueError as e:\n    print(\"ошибка:\", e)\n```\n\nЗаметь: `is_valid` вызывается *внутри* `__init__` ещё до сохранения поля — фабрика `from_kelvin(-10)` доходит до `__init__` и честно падает с `ValueError`. Если бы фабрика создавала объект через `Temperature(...)` вместо `cls(...)`, наследник `Temperature` возвращал бы базовый тип — это и есть ошибка, которую `cls` устраняет.",
			answer: "`is_valid` — staticmethod-валидатор, `from_fahrenheit`/`from_kelvin` — classmethod-фабрики через `cls(...)`; `from_kelvin(-10)` бросает `ValueError`.",
			xp: 12
		},
		{
			id: 'oop-d3-t2',
			difficulty: "base",
			prompt: "Дан класс:\n\n```python\nclass Team:\n    members = []\n    def add(self, who):\n        self.members.append(who)\n\na, b = Team(), Team()\na.add(\"Аня\")\nprint(b.members)\n```\n\nЧто напечатает `print(b.members)` и почему? Это баг или фича? Перепиши класс так, чтобы у каждого экземпляра был *свой* список участников.",
			hint: "`members` — *изменяемый* [[class-attribute|атрибут класса]], один на всех. `self.members.append(...)` мутирует общий объект, а не личный.",
			solution: "Печатает `['Аня']` — и это **баг**. `members = []` объявлен в теле класса, значит это *один* список на весь класс. Вызов `a.add(\"Аня\")` делает `a.members.append(...)`, но `a.members` (на чтение) разрешается в тот самый общий классовый список — поэтому `b.members` видит то же самое. `self.members.append(...)` *не* создаёт личный атрибут (присваивания нет, только мутация на месте), поэтому затенения не происходит и список остаётся общим.\n\nФикс — личное состояние в `__init__`:\n\n```python\nclass Team:\n    def __init__(self):\n        self.members = []        # свой список у каждого экземпляра\n    def add(self, who):\n        self.members.append(who)\n\na, b = Team(), Team()\na.add(\"Аня\")\nprint(b.members)   # []  — изолирован\nprint(a.members)   # ['Аня']\n```\n\nПравило: неизменяемые дефолты (числа, строки, кортежи) можно держать атрибутом класса; изменяемое *личное* состояние (списки, словари) — всегда в `__init__`. Изменяемый атрибут класса оправдан только когда общее состояние нужно намеренно (как реестр).",
			answer: "Печатает `['Аня']` — баг: `members` это общий изменяемый атрибут класса. Фикс — `self.members = []` в `__init__`.",
			xp: 12
		},
		{
			id: 'oop-d3-t3',
			difficulty: "star",
			prompt: "Построй иерархию `Animal` → `Cat`, `Dog` с автоматическим **реестром по типам**. Требования: (1) общий для всей иерархии реестр `_registry: dict[str, list]`, куда каждый созданный объект попадает под именем *своего реального* класса; (2) `@classmethod count()`, возвращающий число экземпляров именно того класса, от которого вызван (`Cat.count()` ≠ `Dog.count()`); (3) `@classmethod total()` — всего по иерархии; (4) `@classmethod from_string(s)`-фабрика, создающая объект правильного подтипа (`Cat.from_string(...)` даёт `Cat`). Объясни, почему ключ реестра берётся через `type(self)`, а не через зашитое имя, и почему `count` смотрит на `cls.__name__`.",
			hint: "Реестр — изменяемый атрибут *базового* класса (общий). В `__init__` ключ — `type(self).__name__` (реальный класс). В `count` — `cls.__name__`. Фабрика — `cls(...)`.",
			solution: "Здесь сходятся все три механизма дня: `@classmethod` с `cls`, общее состояние в атрибуте класса и полиморфная фабрика.\n\n```python\nclass Animal:\n    _registry = {}                      # ОБЩИЙ для всей иерархии\n\n    def __init__(self, name):\n        self.name = name\n        cls_name = type(self).__name__  # реальный класс экземпляра\n        Animal._registry.setdefault(cls_name, []).append(self)\n\n    @classmethod\n    def count(cls):\n        return len(Animal._registry.get(cls.__name__, []))\n\n    @classmethod\n    def total(cls):\n        return sum(len(v) for v in Animal._registry.values())\n\n    @classmethod\n    def from_string(cls, s):\n        return cls(s.strip())           # cls уважает подкласс\n\n\nclass Cat(Animal): pass\nclass Dog(Animal): pass\n\nc1 = Cat.from_string(\" Барсик \")\nc2 = Cat(\"Мурка\")\nd1 = Dog(\"Рекс\")\n\nprint(Cat.count(), Dog.count(), Animal.total())   # 2 1 3\n```\n\n**Почему `type(self).__name__`, а не зашитое имя:** `__init__` определён в `Animal`, но вызывается и для `Cat`, и для `Dog`. `type(self)` даёт *реальный* класс объекта, поэтому `Cat` регистрируется под ключом `\"Cat\"`, а `Dog` — под `\"Dog\"`. Зашитое `\"Animal\"` свалило бы всех в одну кучу.\n\n**Почему `count` смотрит на `cls.__name__`:** `@classmethod` связывает `cls` с классом, через который вызван метод. `Cat.count()` → `cls is Cat` → считает по ключу `\"Cat\"`; `Dog.count()` → по `\"Dog\"`. Один код в базовом классе даёт раздельный подсчёт по подтипам — это полиморфизм `cls` в действии.\n\n**Почему фабрика через `cls(...)`:** `Cat.from_string(...)` создаёт `Cat`, потому что `cls is Cat`. Зашитое `Animal(...)` ломало бы подтипы (см. секцию про ловушки).",
			answer: "Реестр — изменяемый атрибут базового класса; ключ через `type(self).__name__`, `count` через `cls.__name__`, фабрика через `cls(...)`. `Cat.count()=2`, `Dog.count()=1`, `total()=3`.",
			xp: 25
		}
	],
	mastery: [
		"Различаю обычный метод, `@classmethod` и `@staticmethod` по тому, что приходит первым аргументом (`self` / `cls` / ничего), и выбираю нужный по алгоритму «нужны ли данные объекта / нужен ли класс / нужно ли вообще быть методом»",
		"Пишу альтернативные конструкторы-фабрики (`from_string`, `from_timestamp`) как `@classmethod`, создающие объект через `cls(...)`, и объясняю, почему зашитое имя класса ломает наследников",
		"Применяю `@staticmethod` для чистых утилит и валидаторов, логически принадлежащих классу, и понимаю, когда вместо него нужен `@classmethod` (доступ к классу) или обычная функция модуля",
		"Использую атрибуты класса как общее состояние (реестр, счётчик, конфиг) и обхожу две ловушки: затенение классового атрибута при `self.x = ...` и общий изменяемый атрибут вместо личного состояния в `__init__`",
		"Понимаю на уровне интуиции механизм bound-методов: доступ к методу через экземпляр — это вызов дескриптора `__get__`, который подставляет `self`/`cls`; через класс в Python 3 функция возвращается как есть"
	]
};
