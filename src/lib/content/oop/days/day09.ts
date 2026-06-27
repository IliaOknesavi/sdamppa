import type { Day } from '$lib/types';

export const day09: Day = {
	n: 9,
	phaseId: "meta",
	kind: 'theory',
	title: "Дескрипторы и метаклассы",
	est: '1–2 ч',
	goal: "Разобрать протокол [[descriptor|дескрипторов]] и порядок разрешения атрибутов, понять, что property и методы — это дескрипторы, освоить [[metaclass|метаклассы]] и осознать, почему современные хуки чаще их заменяют.",
	sections: [
		{
			kind: "definition",
			heading: "Дескриптор: объект, который управляет доступом к атрибуту",
			body: "До сих пор атрибут был просто записью в `__dict__`: `obj.x` читал `obj.__dict__['x']`. [[descriptor|Дескриптор]] переворачивает это: атрибут становится *объектом с поведением*, который перехватывает чтение, запись и удаление. Это механизм, на котором держится почти вся «магия» Python — `@property`, методы, `classmethod`, `__slots__`, поля в ORM и `dataclasses`.\n\n## Протокол\n\nОбъект становится дескриптором, если его *класс* определяет хотя бы один из методов:\n\n- `__get__(self, obj, objtype=None)` — вызывается при чтении атрибута. `obj` — экземпляр (или `None`, если читаем через класс), `objtype` — сам класс.\n- `__set__(self, obj, value)` — при присваивании `obj.attr = value`.\n- `__delete__(self, obj)` — при `del obj.attr`.\n- `__set_name__(self, owner, name)` — вызывается *один раз* при создании класса-владельца, сообщает дескриптору, под каким именем он лежит.\n\n## Ключевая тонкость\n\nДескриптор работает, только когда лежит **в классе**, а не в экземпляре. `C.attr = Descriptor()` — работает; `c.attr = Descriptor()` — нет, это просто значение в `__dict__` экземпляра. Причина — в самом механизме разрешения (см. ниже): протокол дескрипторов запускает `type.__getattribute__`, проходя по классу и его MRO, а не по `__dict__` экземпляра.\n\n## Типичная ошибка\n\nХранить значение в *самом дескрипторе* (`self.value = value`). Дескриптор — один на класс, общий для всех экземпляров. Если писать в `self`, все объекты разделят одно значение. Правильно — хранить данные в `obj.__dict__` под отдельным ключом (что и делает `__set_name__`, добывая имя)."
		},
		{
			kind: "derivation",
			heading: "Дескриптор-валидатор: переиспользуемое типизированное поле",
			body: "Соберём практический инструмент: дескриптор `Typed`, проверяющий тип, и его наследник `Positive`, добавляющий проверку «больше нуля». Это типичный продакшен-паттерн — одно объявление `balance = Positive(...)` заменяет ручную проверку в каждом сеттере.\n\n## Что здесь важно\n\n- `__set_name__` бесплатно сообщает дескриптору имя поля (`balance`), из которого мы выводим приватный ключ `_balance` для хранения в `obj.__dict__`. Без него пришлось бы дублировать имя: `balance = Positive('balance', ...)`.\n- Значение лежит в `obj.__dict__['_balance']`, **не** в `self` дескриптора — поэтому два разных `Account` не мешают друг другу.\n- В `__get__` обрабатываем `obj is None`: доступ `Account.balance` (через класс) должен вернуть сам дескриптор, а не упасть.\n- `Positive.__set__` зовёт `super().__set__` — сначала проверка типа базового класса, потом своя проверка знака. Композиция валидаторов через наследование.\n\nПоскольку `Typed` определяет `__set__`, это **data-дескриптор** — он гарантированно перехватывает любое присваивание, и обойти валидацию через `a.balance = -1` не выйдет.",
			code: {
				title: "Дескриптор Positive/Typed с __set_name__",
				language: 'python',
				code: String.raw`# Дескриптор-валидатор Positive + Typed с __set_name__
def _type_name(t):
    if isinstance(t, tuple):
        return " | ".join(x.__name__ for x in t)
    return t.__name__


class Typed:
    def __init__(self, expected_type):
        self.expected_type = expected_type

    def __set_name__(self, owner, name):
        # Python зовёт это автоматически при создании класса owner,
        # передавая имя атрибута, под которым дескриптор лежит в классе.
        self.public_name = name
        self.private_name = "_" + name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self  # доступ через класс: Account.balance -> сам дескриптор
        return getattr(obj, self.private_name)

    def __set__(self, obj, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(
                f"{self.public_name!r} ждёт {_type_name(self.expected_type)}, "
                f"получено {type(value).__name__}"
            )
        setattr(obj, self.private_name, value)


class Positive(Typed):
    def __set__(self, obj, value):
        super().__set__(obj, value)  # сначала проверка типа (и запись)
        if value <= 0:
            raise ValueError(f"{self.public_name!r} должно быть > 0, получено {value!r}")
        setattr(obj, self.private_name, value)


class Account:
    owner = Typed(str)
    balance = Positive((int, float))

    def __init__(self, owner, balance):
        self.owner = owner      # идёт через __set__ -> валидация
        self.balance = balance


a = Account("Аня", 100)
print("owner =", a.owner, "| balance =", a.balance)
print("в __dict__ лежат приватные имена:", a.__dict__)
print("Account.balance ->", type(Account.balance).__name__, "(доступ через класс вернул сам дескриптор)")

for bad in [lambda: Account(123, 100), lambda: Account("Боб", -5), lambda: Account("Боб", "x")]:
    try:
        bad()
    except (TypeError, ValueError) as e:
        print("отклонено:", e)`,
				explanation: "Конструктор присваивает `self.owner`/`self.balance`, и каждое присваивание уходит в `__set__` дескриптора. Смотрите: валидные значения проходят, а три «плохих» конструктора ловятся с понятными сообщениями. В `__dict__` экземпляра лежат `_owner`/`_balance` — реальные данные хранятся там, дескриптор лишь сторож."
			}
		},
		{
			kind: "derivation",
			heading: "Порядок разрешения атрибутов: кто кого побеждает",
			body: "Самое важное и самое недопонятое место. Когда вы пишете `obj.attr`, срабатывает `type(obj).__getattribute__`, и он ищет `attr` по строгому приоритету:\n\n1. **Data-дескриптор** в классе (или его MRO) — есть `__set__` или `__delete__`. Побеждает всё.\n2. **`obj.__dict__['attr']`** — обычный атрибут экземпляра.\n3. **Non-data дескриптор** в классе — есть только `__get__`.\n4. Прочее в классе/MRO (обычные значения класса).\n5. `__getattr__` (если определён) — последний шанс при провале.\n\n## Почему именно так\n\nДва типа дескрипторов нужны для разного:\n\n- **[[data-descriptor|Data-дескриптор]]** (`@property`, валидаторы) должен *всегда* контролировать атрибут — иначе случайное `obj.x = ...` обошло бы геттер/сеттер. Поэтому он сильнее `__dict__` экземпляра.\n- **[[non-data-descriptor|Non-data дескриптор]]** (функция-метод) — наоборот, *уступает* экземпляру. Это и даёт возможность переопределить метод на экземпляре или закэшировать вычисленное значение прямо в `__dict__`: при следующем доступе словарь экземпляра «перебьёт» дескриптор, и пересчёта не будет. На этом строятся `functools.cached_property` и ленивые свойства.\n\n## Типичная ошибка\n\nПутать «дескриптор перехватил» с «значение в `__dict__`». Для data-дескриптора присваивание уходит в `__set__` и в `__dict__['attr']` ничего не появляется (если сам `__set__` туда не пишет). Люди удивляются, почему `obj.__dict__` пустой, хотя `obj.attr` что-то возвращает.",
			code: {
				title: "Data vs non-data: эксперимент с приоритетом",
				language: 'python',
				code: String.raw`# Порядок разрешения атрибутов: data-descriptor > instance __dict__ > non-data > class
class DataDesc:
    def __get__(self, obj, objtype=None):
        return "DATA.__get__"
    def __set__(self, obj, value):
        # data-дескриптор: ловит присваивание, в __dict__ экземпляра НЕ пишем
        print("  DATA.__set__ перехватил присваивание:", value)

class NonDataDesc:
    def __get__(self, obj, objtype=None):
        return "NONDATA.__get__"

class C:
    d = DataDesc()       # data-дескриптор
    n = NonDataDesc()    # non-data дескриптор

c = C()

# 1) data-дескриптор побеждает даже если в __dict__ экземпляра есть запись
c.__dict__["d"] = "instance-d"     # кладём напрямую, в обход __set__
print("c.d ->", c.d, "(data-дескриптор сильнее instance __dict__)")

# 2) non-data: instance __dict__ побеждает дескриптор
print("c.n ->", c.n, "(пока в __dict__ нет 'n' -> сработал __get__)")
c.__dict__["n"] = "instance-n"
print("c.n ->", c.n, "(теперь instance __dict__ сильнее non-data дескриптора)")

# 3) присваивание c.d идёт через __set__ (data), а не в __dict__
c.d = 42
print("после c.d=42, c.__dict__['d'] всё ещё:", c.__dict__["d"])`,
				explanation: "Мы насильно кладём ключи прямо в `c.__dict__`, обходя дескрипторы, и смотрим, кто победит при чтении. Для `d` (data) дескриптор сильнее — `c.d` игнорирует запись в словаре. Для `n` (non-data) наоборот: как только в `__dict__` появился ключ, дескриптор отступает. Это и есть тот самый приоритет в действии."
			}
		},
		{
			kind: "connection",
			heading: "property, методы, classmethod — всё это дескрипторы",
			body: "Дескрипторы — не экзотика, а фундамент, на котором уже стоит весь Python. Разберём, как знакомые конструкции реализованы под капотом.\n\n## Функция — non-data дескриптор\n\nУ объекта-функции есть `__get__`, но нет `__set__`. Когда вы пишете `obj.method`, срабатывает `function.__get__(obj, Cls)`, который возвращает **связанный метод** (`bound method`) — обёртку, подставляющую `obj` первым аргументом. Вот откуда берётся `self`: не из синтаксиса, а из протокола дескрипторов. Доступ `Cls.method` (через класс) даёт `__get__(None, Cls)` — обычную функцию без привязки.\n\n## property — data-дескриптор\n\nУ `property` есть и `__get__`, и `__set__` (и `__delete__`). Поэтому он перехватывает запись и не даёт случайно затереть себя в экземпляре. Декоратор `@property` — это просто `prop = property(fget)`; `@prop.setter` добавляет `fset`.\n\n## classmethod / staticmethod\n\nТоже дескрипторы-обёртки. `classmethod.__get__` возвращает метод, привязанный к *классу* (`cls`), а не к экземпляру. `staticmethod.__get__` возвращает функцию как есть, без всякой привязки — потому `staticmethod` и не получает ни `self`, ни `cls`.\n\nВывод: понимая дескрипторы, вы понимаете *почему* `self` появляется автоматически, почему `property` нельзя перезаписать как обычный атрибут и чем `classmethod` отличается от `staticmethod` на уровне механики, а не зубрёжки.",
			code: {
				title: "Доказываем: property и методы — дескрипторы",
				language: 'python',
				code: String.raw`# Как @property, методы, classmethod/staticmethod реализованы через дескрипторы
class Demo:
    def method(self):
        return "обычный метод"

    @property
    def prop(self):
        return "значение property"

    @classmethod
    def cm(cls):
        return f"classmethod, cls={cls.__name__}"

    @staticmethod
    def sm():
        return "staticmethod"


# 1) функция — это non-data дескриптор: у неё есть __get__
print("у функции есть __get__? ", hasattr(Demo.__dict__["method"], "__get__"))
print("у функции есть __set__? ", hasattr(Demo.__dict__["method"], "__set__"))

d = Demo()
# доступ d.method вызывает function.__get__(d, Demo) -> связанный метод
bound = d.method
print("тип d.method:", type(bound).__name__)          # method
print("то же руками:", type(Demo.__dict__["method"].__get__(d, Demo)).__name__)

# 2) property — data-дескриптор: есть и __get__, и __set__
p = Demo.__dict__["prop"]
print("property: __get__?", hasattr(p, "__get__"), "| __set__?", hasattr(p, "__set__"))
print("d.prop ->", d.prop)

# 3) classmethod/staticmethod — дескрипторы, оборачивающие функцию
print("classmethod дескриптор?", hasattr(Demo.__dict__["cm"], "__get__"))
print("d.cm() ->", d.cm())
print("d.sm() ->", d.sm())

# 4) самодельный property через дескриптор — эквивалент встроенного
class MyProperty:
    def __init__(self, fget):
        self.fget = fget
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return self.fget(obj)
    def __set__(self, obj, value):
        raise AttributeError("read-only")

class T:
    @MyProperty
    def x(self):
        return 42

t = T()
print("самодельный property t.x ->", t.x)
try:
    t.x = 1
except AttributeError as e:
    print("запись запрещена:", e)`,
				explanation: "Сначала вытаскиваем сырые объекты из `Demo.__dict__` и проверяем наличие `__get__`/`__set__` — видно, что функция это non-data, а property data-дескриптор. Затем руками вызываем `function.__get__`, получая тот же bound method, что и при `d.method`. В конце — 20-строчный `MyProperty`, поведенчески эквивалентный встроенному read-only property."
			}
		},
		{
			kind: "definition",
			heading: "Метаклассы: type как класс всех классов",
			body: "Если дескриптор управляет атрибутом, то [[metaclass|метакласс]] управляет *самим классом*. Отправная точка — мантра: **в Python всё объект, и класс тоже объект**. А у каждого объекта есть тип. Какой тип у класса?\n\n```\ntype(42)  -> int      # экземпляр класса int\ntype(int) -> type     # класс int — экземпляр type\ntype(C)   -> type     # ваш класс C — тоже экземпляр type\n```\n\n**Метакласс — это класс, экземплярами которого являются классы.** Стандартный метакласс — `type`. Когда вы пишете `class C: ...`, интерпретатор вызывает `type(...)` и получает объект-класс. `type` — экземпляр самого себя (`type(type) is type`), на этом рекурсия типов замыкается.\n\n## type как фабрика классов\n\nУ `type` есть трёхаргументная форма — она создаёт класс динамически, без ключевого слова `class`:\n\n```\ntype(name, bases, namespace)\n```\n\n- `name` — строка-имя класса;\n- `bases` — кортеж базовых классов (для наследования);\n- `namespace` — словарь будущего `__dict__`: методы, атрибуты.\n\nСтейтмент `class` — это синтаксический сахар над этим вызовом. Интерпретатор собирает тело класса в словарь и передаёт его метаклассу. Понимание этого снимает всю мистику: «объявление класса» — это обычный вызов функции во время исполнения модуля.",
			code: {
				title: "type — метакласс; создание класса вызовом",
				language: 'python',
				code: String.raw`# type — метакласс всех классов; создание класса вызовом type(...)
class A:
    pass

print("type(42) ->", type(42).__name__)
print("type(A)  ->", type(A).__name__, "(класс — экземпляр type)")
print("type(type) ->", type(type).__name__, "(type — экземпляр самого себя)")
print("type(int) ->", type(int).__name__)

# Создаём класс динамически, без 'class': type(name, bases, namespace)
def greet(self):
    return f"Привет, я {self.name}"

Dog = type("Dog", (), {"legs": 4, "greet": greet, "__init__":
                       lambda self, name: setattr(self, "name", name)})

rex = Dog("Рекс")
print("Dog.legs =", Dog.legs)
print("rex.greet() ->", rex.greet())
print("class-стейтмент и type(...) эквивалентны:", isinstance(rex, Dog), type(Dog).__name__)

# Наследование тоже через type: bases — кортеж родителей
Puppy = type("Puppy", (Dog,), {"cute": True})
print("Puppy MRO:", [c.__name__ for c in Puppy.__mro__])
print("issubclass(Puppy, Dog):", issubclass(Puppy, Dog))`,
				explanation: "Первый блок показывает цепочку типов: число — экземпляр `int`, `int` и ваш класс — экземпляры `type`, `type` — самого себя. Дальше мы собираем полноценный класс `Dog` вызовом `type(...)` с методами и `__init__` — он ничем не отличается от объявленного через `class`. И наследуем `Puppy`, передав `(Dog,)` в `bases`."
			}
		},
		{
			kind: "derivation",
			heading: "Кастомный метакласс: контроль над созданием класса",
			body: "Свой метакласс — это подкласс `type`, переопределяющий, как рождается класс. Два главных хука:\n\n- `__new__(mcls, name, bases, namespace)` — *создаёт* объект-класс. Здесь можно модифицировать `namespace` до рождения класса.\n- `__init__(cls, name, bases, namespace)` — *донастраивает* уже созданный класс (например, регистрирует его).\n\n## Когда это применяют\n\n1. **Реестр подклассов** — автоматически собирать все плагины/обработчики в словарь при их объявлении.\n2. **Проверка/нормализация API** — потребовать, чтобы каждый подкласс определил нужный метод, и упасть *в момент объявления класса*, а не при первом вызове. Ошибка вылезает на импорте модуля — максимально рано.\n\n## Тонкость наследования метакласса\n\nМетакласс «заразен»: если `Base` задан с `metaclass=Meta`, то *все* его наследники тоже получат `Meta` автоматически — указывать `metaclass=` повторно не нужно. Поэтому достаточно объявить метакласс один раз на корне иерархии.\n\n## Главная опасность\n\nКонфликт метаклассов. Если вы наследуетесь от двух баз с *разными* несовместимыми метаклассами, Python выбросит `TypeError: metaclass conflict`. Это одна из причин, по которой метаклассы плохо комбинируются и почему сообщество тяготеет к более лёгким хукам (следующая секция).",
			code: {
				title: "Метакласс: реестр + проверка контракта",
				language: 'python',
				code: String.raw`# Кастомный метакласс: проверка/нормализация API при создании класса + реестр
class PluginMeta(type):
    registry = {}

    def __new__(mcls, name, bases, namespace, **kwargs):
        # mcls — сам метакласс; создаём класс «как обычно» через type.__new__
        cls = super().__new__(mcls, name, bases, namespace)
        # Проверяем API: каждый неабстрактный плагин обязан иметь run()
        if bases:  # пропускаем базовый Plugin
            if not callable(namespace.get("run", getattr(cls, "run", None))):
                raise TypeError(f"{name} должен определить метод run()")
            key = namespace.get("name", name.lower())
            PluginMeta.registry[key] = cls
        return cls

    def __init__(cls, name, bases, namespace, **kwargs):
        # __init__ метакласса вызывается ПОСЛЕ __new__, класс уже создан
        super().__init__(name, bases, namespace)


class Plugin(metaclass=PluginMeta):
    pass  # база, в реестр не попадает

class Csv(Plugin):
    name = "csv"
    def run(self): return "пишу CSV"

class Json(Plugin):
    name = "json"
    def run(self): return "пишу JSON"

print("Реестр плагинов:", {k: v.__name__ for k, v in PluginMeta.registry.items()})
print("csv.run() ->", PluginMeta.registry["csv"]().run())

# Метакласс ловит нарушение контракта ещё при объявлении класса:
try:
    class Broken(Plugin):
        name = "broken"   # забыли run()
except TypeError as e:
    print("метакласс отверг класс при создании:", e)`,
				explanation: "`PluginMeta.__new__` срабатывает на *каждое* объявление подкласса `Plugin`: он проверяет наличие `run()` и кладёт класс в реестр. Видно, что `Csv` и `Json` зарегистрировались сами, а попытка объявить `Broken` без `run()` падает прямо в строке `class Broken`, не дожидаясь вызова."
			}
		},
		{
			kind: "note",
			heading: "__init_subclass__ и __set_name__ — лёгкая замена метаклассам",
			body: "С Python 3.6 появились два хука, которые покрывают *подавляющее большинство* реальных задач, ради которых раньше писали метаклассы — но без подклассования `type` и без риска конфликта метаклассов.\n\n## __init_subclass__\n\nКлассметод (неявно), вызываемый автоматически при создании **каждого подкласса**. Получает сам новый класс как `cls`. Идеален для реестров и проверок API. Дополнительные именованные аргументы можно передавать прямо в строке `class`:\n\n```\nclass Csv(Plugin, key=\"csv\"): ...\n```\n\nЭти `key=...` приходят в `__init_subclass__` как kwargs. Чище, чем метакласс, и читается линейно.\n\n## __set_name__\n\nХук *дескриптора* (уже использовали в `Positive`): при создании класса Python проходит по `namespace` и для каждого значения, у которого есть `__set_name__`, зовёт его с именем атрибута. Раньше «дескриптор должен знать своё имя» решалось именно метаклассом — теперь это встроено.\n\n## Вывод: метаклассы нужны редко\n\nЧестное правило: **если задачу решает `__init_subclass__` или `__set_name__` — берите их.** Метакласс оправдан, лишь когда нужно менять *саму механику создания класса*: переопределить `namespace` через `__prepare__` (например, упорядоченный или особый словарь тела класса), вмешаться в `isinstance`/`issubclass` через `__instancecheck__`, или подменить то, что делает `type` на самом нижнем уровне. Это инструменты авторов фреймворков (`enum`, `abc`, ORM), а не повседневного кода. В прикладном коде метакласс почти всегда — переусложнение.",
			code: {
				title: "Реестр через __init_subclass__ + __set_name__",
				language: 'python',
				code: String.raw`# Современная альтернатива метаклассу: __init_subclass__ + __set_name__
class Plugin:
    registry = {}

    def __init_subclass__(cls, /, key=None, **kwargs):
        # Вызывается АВТОМАТИЧЕСКИ при создании каждого подкласса.
        # cls — новый подкласс. kwargs приходят из class-стейтмента.
        super().__init_subclass__(**kwargs)
        if not callable(getattr(cls, "run", None)):
            raise TypeError(f"{cls.__name__} должен определить run()")
        Plugin.registry[key or cls.__name__.lower()] = cls


class Csv(Plugin, key="csv"):
    def run(self): return "CSV"

class Json(Plugin, key="json"):
    def run(self): return "JSON"

print("Реестр через __init_subclass__:", {k: v.__name__ for k, v in Plugin.registry.items()})

try:
    class Broken(Plugin, key="x"):
        pass
except TypeError as e:
    print("отвергнут при создании:", e)


# __set_name__: дескриптор узнаёт своё имя без метакласса и без дублирования
class Field:
    def __set_name__(self, owner, name):
        self.name = name
        print(f"  Field узнал имя: {owner.__name__}.{name}")
    def __get__(self, obj, objtype=None):
        if obj is None: return self
        return obj.__dict__.get(self.name)
    def __set__(self, obj, value):
        obj.__dict__[self.name] = value

print("--- создаём класс Model: __set_name__ зовётся на каждый дескриптор ---")
class Model:
    a = Field()
    b = Field()

m = Model()
m.a = 1; m.b = 2
print("m.a, m.b ->", m.a, m.b)`,
				explanation: "Тот же реестр плагинов, что и метаклассом, но без `class Meta(type)` — только `__init_subclass__` на базовом `Plugin`. Аргумент `key=\"csv\"` из строки class приходит прямо в хук. Внизу — `__set_name__`: при создании `Model` Python сам зовёт его для `a` и `b`, печатая узнанные имена. Обе задачи решены без метакласса."
			}
		}
	],
	tasks: [
		{
			id: 'oop-d9-t1',
			difficulty: "base",
			prompt: "Напишите переиспользуемый дескриптор `Ranged(lo, hi)`, который при присваивании проверяет, что значение лежит в отрезке `[lo, hi]`, иначе бросает `ValueError`. Используйте `__set_name__`, чтобы хранить значение в `obj.__dict__` под именем поля (не в самом дескрипторе). Примените его к классу `Color` с полями `r`, `g`, `b` в диапазоне 0..255.",
			hint: "`__set_name__(self, owner, name)` даёт имя атрибута — сложите приватный ключ вроде `'_' + name`. В `__get__` не забудьте про `obj is None` (доступ через класс). В `__set__` сначала проверьте диапазон, потом `setattr(obj, приватное_имя, value)`.",
			solution: "Дескриптор `Ranged` — data-дескриптор (есть `__set__`), значит присваивание гарантированно проходит через валидацию:\n\n```python\nclass Ranged:\n    def __init__(self, lo, hi):\n        self.lo, self.hi = lo, hi\n    def __set_name__(self, owner, name):\n        self.name = \"_\" + name\n        self.public = name\n    def __get__(self, obj, objtype=None):\n        if obj is None:\n            return self\n        return getattr(obj, self.name)\n    def __set__(self, obj, value):\n        if not (self.lo <= value <= self.hi):\n            raise ValueError(f\"{self.public}={value} вне [{self.lo}, {self.hi}]\")\n        setattr(obj, self.name, value)\n\nclass Color:\n    r = Ranged(0, 255)\n    g = Ranged(0, 255)\n    b = Ranged(0, 255)\n    def __init__(self, r, g, b):\n        self.r, self.g, self.b = r, g, b\n\nc = Color(10, 20, 30)\nprint((c.r, c.g, c.b))          # (10, 20, 30)\ntry:\n    Color(300, 0, 0)\nexcept ValueError as e:\n    print(\"отклонено:\", e)      # r=300 вне [0, 255]\n```\n\nКлюч: данные лежат в `obj.__dict__['_r']` и т.д. — три экземпляра `Color` не мешают друг другу, потому что значение хранится в экземпляре, а не в общем дескрипторе.",
			xp: 12
		},
		{
			id: 'oop-d9-t2',
			difficulty: "base",
			prompt: "Реализуйте декоратор `lazy` — ленивое кэширующее свойство. При первом доступе оно вычисляет значение (дорогую функцию) и кэширует его так, чтобы повторные обращения возвращали кэш без пересчёта. Подсказка по механике: используйте тот факт, что non-data дескриптор уступает `__dict__` экземпляра.",
			hint: "Сделайте класс-дескриптор только с `__get__` (без `__set__` — тогда он non-data). В `__get__` вычислите значение и запишите его в `obj.__dict__[имя]`. При следующем доступе словарь экземпляра «перебьёт» дескриптор — это и есть кэш. Имя берите из `__set_name__`.",
			solution: "Суть — приоритет разрешения: non-data дескриптор слабее `obj.__dict__`, поэтому, записав значение в словарь экземпляра, мы «выключаем» дескриптор для последующих обращений:\n\n```python\nclass lazy:\n    def __init__(self, func):\n        self.func = func\n        self.name = func.__name__\n    def __set_name__(self, owner, name):\n        self.name = name\n    def __get__(self, obj, objtype=None):\n        if obj is None:\n            return self\n        value = self.func(obj)\n        # non-data дескриптор: пишем в __dict__ экземпляра.\n        # При следующем доступе instance __dict__ ПОБЕДИТ дескриптор -> кэш.\n        obj.__dict__[self.name] = value\n        return value\n\nclass C:\n    def __init__(self, n):\n        self.n = n\n    @lazy\n    def heavy(self):\n        print(\"  ...считаю heavy (дорого)...\")\n        return self.n ** 2\n\nc = C(9)\nprint(\"первый доступ:\", c.heavy)   # считает\nprint(\"второй доступ:\", c.heavy)   # из кэша\nprint(\"в __dict__ есть кэш:\", \"heavy\" in c.__dict__)\n```\n\nЭто упрощённый `functools.cached_property`. Важно, что у `lazy` НЕТ `__set__`: добавь мы его — дескриптор стал бы data-дескриптором, всегда побеждал бы `__dict__`, и кэширование сломалось бы.",
			xp: 12
		},
		{
			id: 'oop-d9-t3',
			difficulty: "star",
			prompt: "Постройте реестр сериализаторов **без метакласса**, на `__init_subclass__`. Базовый класс `Serializer` хранит словарь `format -> класс`. Каждый подкласс объявляется как `class JsonS(Serializer, fmt=\"json\")` и обязан определить метод `dump(self, obj)`. Реестр должен: (1) требовать наличие `dump` и падать при объявлении, если его нет; (2) запрещать повторную регистрацию уже занятого формата; (3) дать метод `Serializer.get(fmt)`, возвращающий экземпляр нужного сериализатора.",
			hint: "`__init_subclass__(cls, fmt, **kwargs)` — `fmt` придёт из строки class. Вызовите `super().__init_subclass__(**kwargs)`. Проверьте `callable(getattr(cls, 'dump', None))` и наличие `fmt` в словаре до записи. `get` сделайте `@classmethod`.",
			solution: "Всё, что раньше требовало метакласса с `__new__`, здесь решается одним `__init_subclass__` на базовом классе:\n\n```python\nclass Serializer:\n    by_format = {}\n    def __init_subclass__(cls, fmt, **kwargs):\n        super().__init_subclass__(**kwargs)\n        if fmt in Serializer.by_format:\n            raise ValueError(f\"формат {fmt!r} уже зарегистрирован классом \"\n                             f\"{Serializer.by_format[fmt].__name__}\")\n        if not callable(getattr(cls, \"dump\", None)):\n            raise TypeError(f\"{cls.__name__} обязан определить dump()\")\n        Serializer.by_format[fmt] = cls\n\n    @classmethod\n    def get(cls, fmt):\n        return Serializer.by_format[fmt]()\n\nclass JsonS(Serializer, fmt=\"json\"):\n    def dump(self, obj): return f\"json:{obj}\"\n\nclass CsvS(Serializer, fmt=\"csv\"):\n    def dump(self, obj): return f\"csv:{obj}\"\n\nprint(\"форматы:\", sorted(Serializer.by_format))   # ['csv', 'json']\nprint(Serializer.get(\"json\").dump({\"a\": 1}))       # json:{'a': 1}\n\ntry:\n    class Dup(Serializer, fmt=\"json\"):\n        def dump(self, obj): return obj\nexcept ValueError as e:\n    print(\"дубликат отвергнут:\", e)\n\ntry:\n    class NoDump(Serializer, fmt=\"xml\"):\n        pass\nexcept TypeError as e:\n    print(\"без dump отвергнут:\", e)\n```\n\nОбе проверки (дубликат формата и отсутствие `dump`) срабатывают *в момент объявления класса* — ошибка вылезает на импорте, а не при первом вызове. Это и есть главное преимущество хуков уровня создания класса, теперь доступное без метакласса.",
			xp: 25
		}
	],
	mastery: [
		"Объясняю протокол дескрипторов (`__get__`/`__set__`/`__delete__`/`__set_name__`) и пишу переиспользуемый дескриптор-валидатор, хранящий данные в `obj.__dict__`, а не в самом дескрипторе",
		"Воспроизвожу по памяти порядок разрешения атрибутов: data-дескриптор > `__dict__` экземпляра > non-data дескриптор > класс — и предсказываю результат `obj.attr` в спорных случаях",
		"Объясняю, почему `@property` — data-дескриптор, обычный метод — non-data, и как из протокола дескрипторов берётся автоматический `self`; отличаю `classmethod` от `staticmethod` на уровне `__get__`",
		"Понимаю, что класс — экземпляр `type`, создаю класс вызовом `type(name, bases, namespace)` и пишу кастомный метакласс с `__new__`/`__init__` для реестра и проверки API",
		"Выбираю `__init_subclass__`/`__set_name__` вместо метакласса для типовых задач (реестр, валидация API, именование дескриптора) и называю редкие случаи, где метакласс действительно нужен"
	]
};
