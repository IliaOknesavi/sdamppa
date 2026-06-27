import type { Day } from '$lib/types';

export const day05: Day = {
	n: 5,
	phaseId: "hierarchy",
	kind: 'theory',
	title: "Полиморфизм, утиная типизация и абстракция",
	est: '1–2 ч',
	goal: "Освоить полиморфизм через переопределение, утиную и структурную типизацию ([[duck-typing|duck typing]] и [[protocol|Protocol]]), абстрактные базовые классы [[abc|abc.ABC]] с `@abstractmethod` и абстрактными свойствами, и увидеть [[lsp|принцип подстановки Лисков]] как мостик к проектированию иерархий.",
	sections: [
		{
			kind: "definition",
			heading: "Полиморфизм: один интерфейс — много реализаций",
			body: "**[[polymorphism|Полиморфизм]]** (греч. «много форм») — это способность *одного и того же кода* работать с объектами *разных типов*, вызывая у каждого его собственную реализацию метода. В ООП на Python нас интересует прежде всего *полиморфизм подтипов* через **переопределение** (`override`): базовый класс объявляет метод, подклассы дают свои версии, а вызывающий код пишет `obj.method()` и не знает (и не хочет знать), какой именно класс перед ним.\n\nКлассический пример — фигуры. Функция `print_area(s)` вызывает `s.area()`. Для `Circle` это `pi*r**2`, для `Rectangle` — `w*h`. Сама функция написана *один раз* и работает для всех фигур, в том числе для тех, которых ещё не существует на момент её написания. В этом вся сила: добавили `Triangle` — `print_area` уже умеет с ним работать без единого изменения.\n\n## Почему это важнее, чем кажется\n\nАльтернатива полиморфизму — `if`-каскад по типу:\n\n```python\nif isinstance(s, Circle): a = pi*s.r**2\nelif isinstance(s, Rectangle): a = s.w*s.h\n# ...и так далее\n```\n\nТакой код нарушает *принцип открытости/закрытости*: каждый новый тип требует править ВСЕ такие каскады по всему проекту. Полиморфизм же *локализует* знание о типе внутри самого типа — поведение «живёт» там, где живут данные. Это сдвиг от «функция знает про все типы» к «каждый тип знает, как себя вести».\n\n## Типичная ошибка\n\nНачинающие пишут `print_area` с проверками `isinstance` «на всякий случай». Если вы ловите себя на `isinstance` внутри полиморфной функции — почти всегда это сигнал, что метод нужно вынести в сами классы. Проверка типа уместна на *границах* (валидация входа), а не в *логике* (диспетчеризация поведения)."
		},
		{
			kind: "definition",
			heading: "Абстрактные базовые классы: контракт, который нельзя нарушить",
			body: "В примере с фигурами есть скрытая проблема: что мешает создать `Shape()` напрямую? Это бессмысленно — у абстрактной «фигуры вообще» нет площади. Хуже того: если подкласс *забудет* реализовать `area()`, ошибка всплывёт лишь в момент вызова, возможно глубоко в проде.\n\n**[[abc|Абстрактный базовый класс]]** (ABC) решает обе беды. Наследуемся от `abc.ABC` и помечаем обязательные методы декоратором `@abstractmethod`. Тогда:\n\n1. Сам `Shape` **нельзя инстанцировать** — `Shape()` бросит `TypeError`.\n2. Подкласс, не реализовавший *все* абстрактные методы, **тоже остаётся абстрактным** — его `TypeError` ловится при попытке создать объект, а не при вызове метода. Ошибка переезжает «влево», ближе к причине.\n\nОбратите внимание на текст ошибки из запуска: для `Shape` он перечисляет `'area', 'name'`, а для `Triangle` (где реализован только `area`) — только `'name'`. Python точно знает, чего не хватает.\n\n## Под капотом\n\nМеханику обеспечивает метакласс `ABCMeta` (от него наследует `ABC`). Декоратор `@abstractmethod` всего лишь ставит на функции флаг `__isabstractmethod__ = True`. При создании класса `ABCMeta` собирает имена всех таких методов, не получивших конкретной реализации, в `frozenset` под именем `__abstractmethods__`. А `object.__new__` / конструктор проверяет: если `cls.__abstractmethods__` непуст — `TypeError`. В запуске видно, что у `Account` там `{'interest_rate'}`, а у реализовавшего его `Savings` — пустое множество, поэтому `Savings` создаётся свободно.\n\n## Тонкость\n\n`@abstractmethod` *не* запрещает писать тело метода. Можно дать осмысленную реализацию по умолчанию и вызвать её из подкласса через `super().method()` — абстрактность означает «обязан переопределить», а не «обязан быть пустым».",
			code: {
				title: "ABC Shape, полиморфизм и TypeError при неполной реализации",
				language: 'python',
				code: String.raw`from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        ...

    @abstractmethod
    def name(self) -> str:
        ...

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return math.pi * self.r ** 2
    def name(self):
        return "Circle"

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h
    def area(self):
        return self.w * self.h
    def name(self):
        return "Rectangle"

def print_area(s: Shape) -> None:
    # Полиморфизм: один вызов s.area() — разные реализации
    print(f"{s.name():10s} area = {s.area():.4f}")

for sh in [Circle(1), Rectangle(2, 3), Circle(2)]:
    print_area(sh)

# Нельзя инстанцировать абстрактный класс
try:
    Shape()
except TypeError as e:
    print("TypeError:", e)

# Неполная реализация — класс остаётся абстрактным
class Triangle(Shape):
    def __init__(self, b, h):
        self.b, self.h = b, h
    def area(self):
        return 0.5 * self.b * self.h
    # name() НЕ реализован

try:
    Triangle(3, 4)
except TypeError as e:
    print("TypeError:", e)`,
				explanation: "Три фигуры обрабатываются единой функцией `print_area` — это полиморфизм. Затем два намеренных `TypeError`: на `Shape()` ошибка перечисляет оба абстрактных метода `'area', 'name'`, а на `Triangle(3, 4)` — только `'name'`, потому что `area` уже реализован. Смотрите, как Python точно сообщает, чего не хватает."
			}
		},
		{
			kind: "derivation",
			heading: "Абстрактные свойства: @property поверх @abstractmethod",
			body: "Абстрактным может быть не только метод, но и **свойство**. Это нужно, когда базовый класс хочет *использовать* некоторую характеристику, не зная её значения, а реализацию обязан дать подкласс. Синтаксис — комбинация двух декораторов, и порядок строго фиксирован:\n\n```python\n@property\n@abstractmethod\ndef interest_rate(self) -> float: ...\n```\n\nЧитается снизу вверх (декораторы применяются изнутри наружу): сначала `@abstractmethod` ставит флаг `__isabstractmethod__` на функцию, затем `@property` оборачивает её в дескриптор. Хитрость в том, что `property` *пробрасывает* флаг абстрактности наружу — поэтому `ABCMeta` видит, что свойство не реализовано, и держит класс абстрактным. Если поменять декораторы местами (`@abstractmethod` сверху), флаг повесится на объект-`property`, а не на саму функцию, и механизм сломается — класс по ошибке окажется конкретным.\n\nВ примере с банковскими счетами базовый `Account` определяет `yearly_income()` через `self.interest_rate`, *не зная ставки*. `Savings` объявляет `0.07`, `Checking` — `0.01`. Класс `Broken`, не задавший ставку, не инстанцируется. В запуске печатается `Account.__abstractmethods__ = {'interest_rate'}` — вот где Python хранит «долг».\n\n## Зачем не просто атрибут\n\nМожно было бы потребовать атрибут `interest_rate` в `__init__`. Но абстрактное свойство даёт *проверку на этапе создания класса* и позволяет подклассу сделать ставку *вычисляемой* (например, зависящей от баланса), сохранив тот же интерфейс доступа `obj.interest_rate`. Это и есть полиморфизм на уровне доступа к данным.",
			code: {
				title: "Абстрактное свойство interest_rate и __abstractmethods__",
				language: 'python',
				code: String.raw`from abc import ABC, abstractmethod

class Account(ABC):
    def __init__(self, balance):
        self._balance = balance

    @property
    @abstractmethod
    def interest_rate(self) -> float:
        """Годовая ставка — каждый подкласс задаёт свою."""
        ...

    def yearly_income(self) -> float:
        return self._balance * self.interest_rate

class Savings(Account):
    @property
    def interest_rate(self):
        return 0.07

class Checking(Account):
    @property
    def interest_rate(self):
        return 0.01

s, c = Savings(1000), Checking(1000)
print("Savings income:", s.yearly_income())
print("Checking income:", c.yearly_income())
print("rate as property:", s.interest_rate)

class Broken(Account):
    pass  # не задал ставку

try:
    Broken(500)
except TypeError as e:
    print("TypeError:", e)

print("Account.__abstractmethods__ =", set(Account.__abstractmethods__))
print("Savings.__abstractmethods__ =", set(Savings.__abstractmethods__))`,
				explanation: "`yearly_income()` в базовом классе пользуется `self.interest_rate`, не зная её значения — это даёт каждый подкласс. `Broken` без ставки бросает `TypeError`. В конце видно, что `Account.__abstractmethods__` содержит `{'interest_rate'}`, а у `Savings` множество пусто — долг закрыт."
			}
		},
		{
			kind: "intuition",
			heading: "Утиная типизация: «если крякает как утка»",
			body: "**[[duck-typing|Утиная типизация]]** — фундаментальный для Python принцип: *«Если оно ходит как утка и крякает как утка — это утка»*. На практике это значит, что при вызове `obj.quack()` Python **не проверяет тип** `obj` и его место в иерархии классов. Важно лишь одно: есть ли у объекта *атрибут* `quack`, который можно вызвать. Тип, имя класса, предки — всё это для вызова метода нерелевантно.\n\nВ запущенном примере `Duck`, `Dog` и `Person` — три *никак не связанных* класса (общий предок только `object`). Тем не менее `make_it_quack` работает со всеми тремя, потому что у каждого есть `quack()`. А `Rock`, у которого метода нет, ломается с `AttributeError` — и ломается *в момент вызова*, не раньше.\n\n## EAFP против LBYL\n\nУтиная типизация идёт рука об руку с пайтоновским стилем **[[eafp|EAFP]]** (*Easier to Ask Forgiveness than Permission* — «проще просить прощения, чем разрешения»): не проверяй заранее `if hasattr(obj, 'quack')`, а просто *вызови* и поймай `AttributeError`, если что. Противоположный стиль — LBYL (*Look Before You Leap*) — c предварительными проверками; в Python он считается менее идиоматичным, плодит гонки и лишний код.\n\n## Цена гибкости\n\nУтиная типизация *динамическая*: ошибка несоответствия интерфейса всплывает только во время выполнения, и только если выполнение дойдёт до проблемной строки. Это плата за гибкость. Полиморфизм через утиную типизацию не требует *никакой* общей базы — но и не даёт *никаких* гарантий до запуска. Именно эту дыру закрывают `Protocol` (статически) и ABC (через явный контракт).",
			code: {
				title: "Duck typing: важен метод, а не тип; EAFP с AttributeError",
				language: 'python',
				code: String.raw`class Duck:
    def quack(self): return "Кря!"

class Dog:
    def quack(self): return "Гав, но я притворяюсь уткой"

class Person:
    def quack(self): return "Человек говорит: кря-кря"

class Rock:
    pass  # нет quack

def make_it_quack(thing):
    # Никакой проверки типа — только вызов метода
    return thing.quack()

for obj in (Duck(), Dog(), Person()):
    print(type(obj).__name__, "->", make_it_quack(obj))

# EAFP: пробуем и ловим, а не проверяем заранее
try:
    make_it_quack(Rock())
except AttributeError as e:
    print("AttributeError:", e)

def chorus(*ducks):
    return " | ".join(d.quack() for d in ducks)

print(chorus(Duck(), Dog(), Person()))`,
				explanation: "`Duck`, `Dog`, `Person` не связаны наследованием, но все «крякают» — `make_it_quack` принимает каждого. `Rock` без метода даёт `AttributeError` именно в момент вызова (EAFP-стиль: ловим, а не проверяем заранее)."
			}
		},
		{
			kind: "connection",
			heading: "typing.Protocol: статическая «утиная» типизация",
			body: "У утиной типизации был минус: проверка только в рантайме. **[[protocol|typing.Protocol]]** (PEP 544) даёт ту же идею «важен набор методов, а не имя класса», но *статически* — её ловит проверяльщик типов (`mypy`, `pyright`) ещё до запуска. Это называется **структурной типизацией** (в отличие от *номинальной*, где совместимость определяется именем/наследованием).\n\nОбъявляем протокол как класс-наследник `Protocol` с сигнатурами методов (без тел). Любой класс, у которого *структурно* есть эти методы, считается совместимым — **наследоваться от протокола не нужно**. В запуске `Square.__mro__` — это `[Square, object]`: никакой связи с `SupportsArea`, и всё равно `total_area([Square(2), Square(3)])` типобезопасно.\n\n## @runtime_checkable\n\nПо умолчанию `isinstance(x, SomeProtocol)` запрещён (`TypeError`) — протоколы существуют для статической проверки. Декоратор `@runtime_checkable` разрешает `isinstance`/`issubclass` в рантайме. Но важно понимать его границы: **он проверяет только *наличие* атрибутов с нужными именами, а не их сигнатуры и даже не то, что это методы**. В запуске класс `Trap`, у которого `area = 42` (целое число, а не метод!), проходит `isinstance(Trap(), SupportsArea) == True`. Это ловушка: `runtime_checkable` — грубая проверка по именам, не по «вызываемости» и не по типам аргументов.\n\n## ABC или Protocol — что выбрать\n\n- **ABC** — *номинальная* связь: подкласс *явно* наследуется и обязан реализовать методы; контракт активный (рантайм-`TypeError`). Хорош, когда вы *владеете* иерархией и хотите навязать реализацию.\n- **Protocol** — *структурная*: класс совместим *по форме*, без наследования; контракт пассивный (статический анализ). Идеален для типизации *чужих* классов, которые вы не можете менять, и для «утиных» интерфейсов без общей базы.",
			code: {
				title: "Protocol, runtime_checkable и ловушка проверки только по имени",
				language: 'python',
				code: String.raw`from typing import Protocol, runtime_checkable

@runtime_checkable
class SupportsArea(Protocol):
    def area(self) -> float: ...

class Square:
    def __init__(self, side): self.side = side
    def area(self) -> float: return self.side ** 2

class Sphere:
    def __init__(self, r): self.r = r
    def surface(self) -> float: return 4 * 3.14159 * self.r ** 2
    # нет area()

def total_area(items) -> float:
    return sum(item.area() for item in items)

print("total:", total_area([Square(2), Square(3)]))
print("Square is SupportsArea:", isinstance(Square(1), SupportsArea))
print("Sphere is SupportsArea:", isinstance(Sphere(1), SupportsArea))

# Структурно: никакого наследования от Protocol
print("Square mro:", [c.__name__ for c in Square.__mro__])

# Ловушка: runtime_checkable смотрит только на ИМЯ атрибута
class Trap:
    area = 42  # не метод, но имя 'area' есть
print("Trap is SupportsArea:", isinstance(Trap(), SupportsArea))`,
				explanation: "`Square` совместим с `SupportsArea` без наследования (его MRO — только `[Square, object]`) — это структурная типизация. `Sphere` без `area()` не проходит. А `Trap` с атрибутом `area = 42` (число, не метод!) обманывает `isinstance` — наглядно показывает, что `runtime_checkable` проверяет лишь наличие имени, не сигнатуру."
			}
		},
		{
			kind: "note",
			heading: "ABC.register: виртуальное подклассирование",
			body: "Иногда нужно сказать «этот *чужой* класс — на самом деле реализация моего ABC», но переписать его и добавить наследование нельзя. Для этого у ABC есть метод `register`: `Drawable.register(LegacyWidget)`. После него `issubclass(LegacyWidget, Drawable)` и `isinstance(obj, Drawable)` возвращают `True` — `LegacyWidget` становится **виртуальным подклассом**.\n\nКлючевое отличие от настоящего наследования, видимое в запуске:\n\n- `register` **не запускает** проверку `@abstractmethod`. Можно зарегистрировать даже `Empty` *без* метода `draw` — `issubclass(Empty, Drawable)` будет `True`, но `Empty().draw()` бросит `AttributeError`. Регистрация — это *обещание* программиста, а не *гарантия* со стороны Python.\n- Виртуальный подкласс **не появляется в MRO** зарегистрированного класса и не наследует никаких методов/реализаций от ABC — связь существует только для `isinstance`/`issubclass`.\n\n## Когда это к месту\n\n`register` — инструмент адаптации сторонних типов под ваш интерфейс (так, например, стандартные `abc`-классы коллекций объявляют, что `list`, `dict` и т.п. — их подклассы). Но из-за отсутствия проверок пользуйтесь им осознанно: вы берёте на себя ответственность за соответствие. Для надёжного контракта внутри своего кода предпочитайте честное наследование от ABC, а для типизации без рантайм-связи — `Protocol`.",
			code: {
				title: "register делает виртуальный подкласс, но без проверки методов",
				language: 'python',
				code: String.raw`from abc import ABC, abstractmethod

class Drawable(ABC):
    @abstractmethod
    def draw(self) -> str: ...

class LegacyWidget:           # сторонний класс, менять нельзя
    def draw(self): return "legacy draw"

print("До register:", issubclass(LegacyWidget, Drawable))
Drawable.register(LegacyWidget)
print("После register:", issubclass(LegacyWidget, Drawable))
print("isinstance:", isinstance(LegacyWidget(), Drawable))

# register НЕ проверяет наличие draw() — это обещание, а не гарантия
class Empty: pass
Drawable.register(Empty)
print("Empty issubclass (опасно):", issubclass(Empty, Drawable))
try:
    Empty().draw()
except AttributeError as e:
    print("AttributeError:", e)`,
				explanation: "`register` делает `LegacyWidget` виртуальным подклассом `Drawable` без наследования — `issubclass`/`isinstance` дают `True`. Но `Empty` без `draw()` тоже регистрируется успешно, и лишь вызов `Empty().draw()` падает: `register` не проверяет реализацию, в отличие от настоящего наследования от ABC."
			}
		},
		{
			kind: "connection",
			heading: "Принцип подстановки Лисков: мостик к проектированию иерархий",
			body: "Полиморфизм работает корректно лишь при одном условии: подкласс должен *действительно* быть пригоден вместо родителя. Это формулирует **[[lsp|принцип подстановки Барбары Лисков]]** (LSP, буква *L* в SOLID): *объекты подкласса должны заменять объекты базового класса без нарушения корректности программы*. Иначе говоря, код, написанный против базового типа, не должен «удивляться» поведению подтипа.\n\nКлассический контрпример — `Square(Rectangle)`. Геометрически квадрат *есть* прямоугольник, и наследование выглядит естественным. Но у `Rectangle` есть *поведенческий контракт*: «`set_width` меняет только ширину». `Square` вынужден ломать его — чтобы остаться квадратом, при смене ширины он меняет и высоту. В запуске функция `stretch_and_check`, корректная для любого `Rectangle` (ожидает площадь $5\\times4=20$), для `Square` возвращает `16`. Подстановка нарушена — значит, наследование здесь *неверно*, несмотря на «is-a» из геометрии.\n\n## Что LSP требует от подкласса\n\n- **Не усиливать предусловия**: не требовать от аргументов больше, чем родитель.\n- **Не ослаблять постусловия**: гарантировать не меньше, чем родитель.\n- **Сохранять инварианты** базового класса.\n- Не бросать *новых* непредвиденных исключений там, где родитель их не бросал.\n\n## Связь с темой дня и мостик дальше\n\nИменно LSP объясняет, *почему* `@abstractmethod` задаёт лишь сигнатуру, а не поведение — соблюдение *смыслового* контракта остаётся на совести проектировщика; ни ABC, ни `Protocol` за вас его не проверят. Вывод, к которому мы вернёмся в **дне 10** (SOLID и проектирование): «is-a» из реального мира — *не* критерий наследования. Критерий — *подставляемость поведения*. Часто вместо наследования правильнее **композиция**: `Square` *содержит* сторону и считает площадь, не притворяясь `Rectangle`.",
			code: {
				title: "Нарушение LSP: Square ломает контракт Rectangle",
				language: 'python',
				code: String.raw`class Rectangle:
    def __init__(self, w, h):
        self._w, self._h = w, h
    def set_width(self, w): self._w = w
    def set_height(self, h): self._h = h
    def area(self): return self._w * self._h

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
    def set_width(self, w):
        self._w = w; self._h = w   # вынужден ломать инвариант
    def set_height(self, h):
        self._w = h; self._h = h

def stretch_and_check(rect):
    # Контракт Rectangle: ширина и высота независимы
    rect.set_width(5)
    rect.set_height(4)
    return rect.area()   # для любого корректного Rectangle ждём 20

print("Rectangle:", stretch_and_check(Rectangle(2, 3)))  # 20 — ок
print("Square:   ", stretch_and_check(Square(2)))         # 16 — нарушено!
print("LSP нарушен: Square нельзя подставить вместо Rectangle")`,
				explanation: "Функция `stretch_and_check` корректна для любого `Rectangle` и ждёт площадь 20. Для `Rectangle(2,3)` так и есть, а для `Square(2)` получается 16 — подкласс изменил поведение базового контракта. Это нарушение LSP: формальное «is-a» не оправдывает наследование, когда ломается подставляемость."
			}
		}
	],
	tasks: [
		{
			id: 'oop-d5-t1',
			difficulty: "base",
			prompt: "Спроектируйте абстрактный базовый класс `Employee` (наследник `abc.ABC`) с полем `name` и абстрактным методом `salary() -> float`. В базовом классе реализуйте конкретный метод `payslip()`, возвращающий строку вида `\"Имя: 12345.00\"`. Сделайте подклассы: `Hourly` (зарплата = ставка * часы), `Salaried` (фиксированная зарплата) и `Manager` (наследник `Salaried`, добавляет бонус через `super().salary()`). Соберите список сотрудников, полиморфно напечатайте `payslip()` каждого и общий фонд оплаты. Покажите, что `Employee(...)` напрямую бросает `TypeError`.",
			hint: "`@abstractmethod` ставится над `salary`. `payslip` использует `self.salary()`, не зная, какой это подкласс — в этом полиморфизм. В `Manager.salary` вызовите `super().salary()` и прибавьте бонус. Прямое создание `Employee(\"X\", 0)` оберните в `try/except TypeError`.",
			solution: "```python\nfrom abc import ABC, abstractmethod\n\nclass Employee(ABC):\n    def __init__(self, name, base):\n        self.name = name\n        self.base = base\n\n    @abstractmethod\n    def salary(self) -> float:\n        ...\n\n    def payslip(self) -> str:\n        return f\"{self.name}: {self.salary():.2f}\"\n\nclass Hourly(Employee):\n    def __init__(self, name, base, hours):\n        super().__init__(name, base)\n        self.hours = hours\n    def salary(self):\n        return self.base * self.hours\n\nclass Salaried(Employee):\n    def salary(self):\n        return self.base\n\nclass Manager(Salaried):\n    def __init__(self, name, base, bonus):\n        super().__init__(name, base)\n        self.bonus = bonus\n    def salary(self):\n        return super().salary() + self.bonus\n\nteam = [Hourly(\"Анна\", 500, 8), Salaried(\"Борис\", 60000), Manager(\"Вера\", 80000, 20000)]\nfor e in team:\n    print(e.payslip())\nprint(\"Фонд оплаты:\", sum(e.salary() for e in team))\n\ntry:\n    Employee(\"X\", 0)\nexcept TypeError as e:\n    print(\"TypeError:\", e)\n```\nЗапуск печатает три расчётки, суммарный фонд `164000` и `TypeError` на попытке создать абстрактный `Employee`. `payslip()` написан один раз, но даёт верную сумму для каждого подкласса — это полиморфизм через переопределение `salary()`.",
			xp: 12
		},
		{
			id: 'oop-d5-t2',
			difficulty: "base",
			prompt: "Объявите `@runtime_checkable` протокол `Serializable` с методом `to_json() -> str`. Сделайте два совместимых класса (`User` и `Point`) с таким методом — БЕЗ наследования от протокола — и один несовместимый (`Plain`). Напишите функцию `dump_all(objs)`, которая для каждого объекта через `isinstance(o, Serializable)` либо печатает его JSON, либо помечает как несериализуемый. Подтвердите результат двумя `isinstance`-проверками.",
			hint: "Протокол — это класс-наследник `typing.Protocol` с сигнатурой `def to_json(self) -> str: ...`. Декоратор `@runtime_checkable` нужен, чтобы `isinstance` заработал в рантайме. Совместимым классам наследоваться от `Serializable` НЕ надо — это структурная типизация.",
			solution: "```python\nfrom typing import Protocol, runtime_checkable\n\n@runtime_checkable\nclass Serializable(Protocol):\n    def to_json(self) -> str: ...\n\nclass User:\n    def __init__(self, name): self.name = name\n    def to_json(self): return f'{{\"name\": \"{self.name}\"}}'\n\nclass Point:\n    def __init__(self, x, y): self.x, self.y = x, y\n    def to_json(self): return f'{{\"x\": {self.x}, \"y\": {self.y}}}'\n\nclass Plain:\n    pass\n\ndef dump_all(objs):\n    out = []\n    for o in objs:\n        if isinstance(o, Serializable):\n            out.append(o.to_json())\n        else:\n            out.append(f\"<{type(o).__name__} не сериализуется>\")\n    return out\n\nfor line in dump_all([User(\"Ann\"), Point(1, 2), Plain()]):\n    print(line)\n\nprint(\"User is Serializable:\", isinstance(User(\"x\"), Serializable))\nprint(\"Plain is Serializable:\", isinstance(Plain(), Serializable))\n```\nЗапуск печатает JSON для `User` и `Point`, метку для `Plain`, затем `True`/`False`. `User` и `Point` совместимы с протоколом *по форме* (есть `to_json`), хотя ни один не наследуется от `Serializable` — суть структурной типизации. Помните: `runtime_checkable` сверяет только наличие имени метода, не его сигнатуру.",
			xp: 12
		},
		{
			id: 'oop-d5-t3',
			difficulty: "star",
			prompt: "Продемонстрируйте НАРУШЕНИЕ принципа подстановки Лисков на паре `Rectangle`/`Square`, а затем ИСПРАВЬТЕ дизайн. Сначала: `Square`, унаследованный от `Rectangle` с независимыми `set_width`/`set_height`, ломает функцию-клиента, ожидающую площадь 20 после установки ширины 5 и высоты 4. Затем предложите корректную модель через общий абстрактный базовый класс `Shape` с `area()`, где `Square` и `Rectangle` — независимые подклассы (композиция/неизменяемость вместо ломающего наследования), и покажите, что теперь обе фигуры корректно работают с полиморфной функцией площадей.",
			hint: "Нарушение: переопределённый `set_width` у `Square` вынужден менять и высоту, поэтому площадь после `set_width(5); set_height(4)` равна 16, а не 20. Исправление: уберите изменяемость и наследование `Square` от `Rectangle`; сделайте оба класса наследниками абстрактного `Shape` с `@abstractmethod area`. Тогда подстановка `Shape` всегда корректна.",
			solution: "```python\nfrom abc import ABC, abstractmethod\n\n# --- ЧАСТЬ 1: нарушение LSP ---\nclass Rectangle:\n    def __init__(self, w, h):\n        self._w, self._h = w, h\n    def set_width(self, w): self._w = w\n    def set_height(self, h): self._h = h\n    def area(self): return self._w * self._h\n\nclass BadSquare(Rectangle):\n    def __init__(self, side):\n        super().__init__(side, side)\n    def set_width(self, w):\n        self._w = w; self._h = w\n    def set_height(self, h):\n        self._w = h; self._h = h\n\ndef stretch_and_check(rect):\n    rect.set_width(5); rect.set_height(4)\n    return rect.area()\n\nprint(\"Rectangle:\", stretch_and_check(Rectangle(2, 3)))  # 20\nprint(\"BadSquare:\", stretch_and_check(BadSquare(2)))      # 16 — LSP нарушен\n\n# --- ЧАСТЬ 2: корректный дизайн ---\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float: ...\n\nclass GoodRectangle(Shape):\n    def __init__(self, w, h): self.w, self.h = w, h\n    def area(self): return self.w * self.h\n\nclass GoodSquare(Shape):           # НЕ наследник GoodRectangle\n    def __init__(self, side): self.side = side\n    def area(self): return self.side ** 2\n\ndef total_area(shapes):\n    return sum(s.area() for s in shapes)\n\nshapes = [GoodRectangle(5, 4), GoodSquare(3)]\nprint(\"Площади:\", [s.area() for s in shapes])  # [20, 9]\nprint(\"Сумма:\", total_area(shapes))            # 29\n```\nЧасть 1 показывает баг: `BadSquare` даёт 16 вместо 20, потому что его `set_width` ломает инвариант `Rectangle`. Часть 2 чинит дизайн: `GoodSquare` и `GoodRectangle` — *независимые* неизменяемые подклассы абстрактного `Shape`, ни один не притворяется другим. Полиморфная `total_area` корректно работает с обоими — подстановка `Shape` всегда безопасна, LSP соблюдён.",
			xp: 25
		}
	],
	mastery: [
		"Объясняю полиморфизм через переопределение и пишу функцию, работающую с любым подтипом без `isinstance`-каскадов; понимаю, почему это соблюдает принцип открытости/закрытости.",
		"Создаю ABC через `abc.ABC` и `@abstractmethod`, объясняю роль `ABCMeta` и `__abstractmethods__`, предсказываю `TypeError` при инстанцировании абстрактного или неполно реализованного класса; умею делать абстрактное свойство правильным порядком `@property` над `@abstractmethod`.",
		"Различаю утиную (динамическую, рантайм) и структурную (статическую, через `typing.Protocol`) типизацию; знаю, что `@runtime_checkable` проверяет только наличие имён атрибутов, а не сигнатуры, и не путаю это с гарантией.",
		"Осознанно выбираю между ABC (номинальный контракт с проверкой), Protocol (структурный, без наследования) и `register` (виртуальный подкласс без проверки реализации), понимая компромиссы каждого.",
		"Формулирую принцип подстановки Лисков, на примере `Square`/`Rectangle` показываю и диагностирую его нарушение, и исправляю дизайн (независимые подклассы/композиция вместо ломающего наследования)."
	]
};
