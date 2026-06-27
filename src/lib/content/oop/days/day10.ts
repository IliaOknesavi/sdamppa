import type { Day } from '$lib/types';

export const day10: Day = {
	n: 10,
	phaseId: "meta",
	kind: 'theory',
	title: "SOLID, паттерны и композиция против наследования",
	est: '1–2 ч',
	goal: "Освоить пять принципов [[solid|SOLID]] на питоновских примерах «плохо→хорошо», понять правило «[[composition-over-inheritance|предпочитай композицию наследованию]]» и узнать паттерны [[gof|GoF]] в их упрощённой языком форме.",
	sections: [
		{
			kind: "intuition",
			heading: "Зачем SOLID: локализовать изменения",
			body: "К десятому дню вы умеете писать классы, которые *работают*. Но «работает» — минимальная планка. Цель — код, который **не больно менять через полгода**. [[solid|SOLID]] — пять эмпирических правил о том, как организовать классы, чтобы изменение требования не разносило полпроекта.\n\nГлавная мысль, объединяющая все пять букв: *локализовать изменения*. Хороший дизайн — когда новое требование трогает мало кода и в предсказуемом месте.\n\n## Пять принципов в одну строку\n\n- [[srp|SRP]] — у класса *одна причина для изменения*.\n- [[ocp|OCP]] — *открыт для расширения, закрыт для изменения*.\n- [[lsp|LSP]] — наследник *корректно подставляется* вместо предка.\n- [[isp|ISP]] — интерфейсы *узкие*, без лишних методов.\n- [[dip|DIP]] — зависим от *абстракций*; зависимости *впрыскиваем* снаружи.\n\nВажная оговорка: SOLID — *эвристики*, а не законы. Слепое дробление всего на классы даёт россыпь анемичных объектов (нарушение «Simplicity First»). Применяют там, где код *уже* начал болеть от изменений."
		},
		{
			kind: "definition",
			heading: "SRP: одна причина для изменения",
			body: "[[srp|Single Responsibility Principle]]: у класса должна быть **ровно одна причина меняться**. «Причина» — это *роль/актор*: бизнес-аналитик, дизайнер вёрстки, админ хранилища.\n\nКлассический антипаттерн — *god object*: объект `Report`, который и считает агрегаты (логика), и рисует HTML (представление), и пишет в файл (ввод-вывод). Три ответственности — три причины меняться.\n\n## Как чинить\n\nРазрезаем по осям изменения: `Report` считает, `HtmlView` форматирует, `FileWriter` сохраняет. Смена формата HTML→JSON — новый `JsonView`, и ни `Report`, ни `FileWriter` не трогаются.\n\nТипичная ошибка — путать SRP с «один метод на класс». Ответственность — это *направление изменений*, а не число строк. Класс с десятью методами, которые все меняются по одной причине, SRP не нарушает.",
			code: {
				title: "SRP: режем god object на три ответственности",
				language: 'python',
				code: String.raw`from dataclasses import dataclass


# ---------- ПЛОХО: божественный класс ----------
class ReportGod:
    def __init__(self, rows):
        self.rows = rows

    def total(self):                       # бизнес-логика
        return sum(self.rows)

    def to_html(self):                     # представление
        return f"<b>{self.total()}</b>"

    def save(self, path):                  # ввод-вывод
        return f"WRITE {path}: {self.to_html()}"


# ---------- ХОРОШО: три отдельные ответственности ----------
@dataclass
class Report:
    rows: list

    def total(self) -> int:                # только подсчёт
        return sum(self.rows)


class HtmlView:                            # только форматирование
    def render(self, report: Report) -> str:
        return f"<b>{report.total()}</b>"


class FileWriter:                          # только сохранение
    def save(self, path: str, text: str) -> str:
        return f"WRITE {path}: {text}"


bad = ReportGod([10, 20, 30])
print("ПЛОХО :", bad.save("r.html"))

rep = Report([10, 20, 30])
view = HtmlView()
writer = FileWriter()
print("ХОРОШО:", writer.save("r.html", view.render(rep)))
print("Теперь сменить формат HTML->JSON можно, не трогая Report и FileWriter")`,
				explanation: "Оба варианта дают тот же `<b>60</b>`, но *структура* разная. В «хорошем» подсчёт, вёрстка и запись развязаны — поменять одно можно, не задев двух других. Смысл [[srp|SRP]]: не меньше кода, а меньше *причин* у каждого класса меняться."
			}
		},
		{
			kind: "definition",
			heading: "OCP через полиморфизм: Strategy вместо if/elif",
			body: "[[ocp|Open/Closed Principle]]: модуль **открыт для расширения, но закрыт для изменения**. Добавить новое поведение можно, *не редактируя* уже оттестированный код.\n\nГлавный враг OCP — растущая лесенка `if kind == ... elif kind == ...`. Каждый новый случай заставляет лезть в ту же функцию и рисковать сломать соседние ветки.\n\n## Лечение — паттерн [[strategy|Strategy]]\n\nВыносим каждую ветку в отдельную *функцию*, а основной код принимает стратегию параметром и просто её вызывает. Новый способ — новая функция; `final_price` не меняется ни на символ.\n\n## Почему в Python это дёшево\n\nВ Java под Strategy заводят интерфейс и класс-реализацию на каждую стратегию. В Python *функция — объект первого класса*, поэтому стратегия часто = просто функция `float -> float`. «Паттерн Strategy» сводится к «передай функцию аргументом».",
			code: {
				title: "OCP: Strategy как функция — новый способ без правки старого",
				language: 'python',
				code: String.raw`from typing import Callable


# ---------- ПЛОХО: цепочка if по строковому коду ----------
def price_bad(amount: float, kind: str) -> float:
    if kind == "none":
        return amount
    elif kind == "vip":
        return amount * 0.8
    elif kind == "promo":
        return amount - 100 if amount > 100 else amount
    raise ValueError(kind)            # новый тип -> снова лезем СЮДА


# ---------- ХОРОШО: стратегия — это функция ----------
# Тип стратегии: любая callable float -> float.
Discount = Callable[[float], float]


def none(amount: float) -> float:
    return amount


def vip(amount: float) -> float:
    return amount * 0.8


def promo(amount: float) -> float:
    return amount - 100 if amount > 100 else amount


def final_price(amount: float, discount: Discount) -> float:
    return discount(amount)           # код подсчёта НЕ меняется при новой стратегии


# Новый способ добавляется БЕЗ правки final_price:
def black_friday(amount: float) -> float:
    return amount * 0.5


print("bad  vip  :", price_bad(1000, "vip"))
print("good vip  :", final_price(1000, vip))
print("good promo:", final_price(1000, promo))
print("good BF   :", final_price(1000, black_friday), "<- добавили, ничего не ломая")`,
				explanation: "`black_friday` добавлен последней строкой, а `final_price` не тронут — это «открыт для расширения, закрыт для изменения». Чтобы добавить тот же случай в `price_bad`, пришлось бы вскрывать функцию и дописывать `elif`. [[strategy|Strategy]] в питоне свёлся к «передай функцию»."
			}
		},
		{
			kind: "derivation",
			heading: "LSP: когда наследник врёт про is-a",
			body: "[[lsp|Liskov Substitution Principle]]: если код работает с объектом типа `T`, он должен **так же корректно работать с любым наследником `T`** — без сюрпризов. Формально: наследник может ослаблять предусловия и усиливать постусловия, но не наоборот, и обязан сохранять инварианты базы.\n\nНа практике LSP — проверка на честность отношения «is-a». Школьное «квадрат — это прямоугольник» в *геометрии* верно, но в коде с *изменяемым* состоянием — ложь.\n\n## Почему Square ломает Rectangle\n\nКонтракт `Rectangle`: «задал ширину 5 и высоту 4 → площадь 20». `Square`, держа стороны равными, переопределяет сеттеры так, что `set_height(4)` молча меняет и ширину. Подставляем `Square` туда, где код ждёт `Rectangle`, — постусловие про площадь нарушено.\n\n## Как чинить\n\nНе наследовать. Сделать `Square` отдельным неизменяемым значением с одним полем `side`, без сеттеров-ловушек. Правило: наследуй, только когда наследник честно проходит [[lsp|LSP]]; иначе — композиция или отдельный тип.",
			code: {
				title: "LSP: подстановка Square ломает контракт Rectangle",
				language: 'python',
				code: String.raw`class Rectangle:
    def __init__(self, w, h):
        self._w, self._h = w, h

    def set_width(self, w):
        self._w = w

    def set_height(self, h):
        self._h = h

    @property
    def area(self):
        return self._w * self._h


class Square(Rectangle):              # "is-a"? по поведению — НЕТ
    def set_width(self, w):
        self._w = self._h = w         # держим стороны равными -> ломаем инвариант базы

    def set_height(self, h):
        self._w = self._h = h


def grow_and_check(rect: Rectangle):
    # Контракт базы: ширина 5, высота 4 -> площадь ДОЛЖНА быть 20.
    rect.set_width(5)
    rect.set_height(4)
    return rect.area


print("Rectangle:", grow_and_check(Rectangle(1, 1)), "(ожидаем 20)")
print("Square   :", grow_and_check(Square(1, 1)), "(ожидаем 20, а получили...)")
print("Подстановка Square вместо Rectangle сломала постусловие -> нарушение LSP")`,
				explanation: "`Rectangle` даёт `20`, `Square` — `16`: одна и та же функция, написанная против базового контракта, выдаёт неверный результат на наследнике. Проблема не в синтаксисе, а в том, что `Square` *солгал* про отношение is-a."
			}
		},
		{
			kind: "definition",
			heading: "ISP и DIP: узкие Protocol-ы и инъекция зависимостей",
			body: "Две оставшиеся буквы в питоне реализуются почти одним приёмом — структурными интерфейсами через [[protocol|Protocol]].\n\n## ISP — узкие интерфейсы\n\n[[isp|Interface Segregation Principle]]: клиент не должен зависеть от методов, которыми не пользуется. Толстый `Worker` с `work()` *и* `eat()` заставляет `RobotWorker` реализовывать бессмысленный `eat()`. Лучше много *узких* ролей: `Sender` с единственным `send()`.\n\nВ Python для этого почти не нужны толстые [[abc|ABC]]. `Protocol` задаёт интерфейс *структурно*: класс подходит под `Sender`, если у него есть `send` нужной формы — наследовать `Sender` не требуется.\n\n## DIP — зависимость от абстракций\n\n[[dip|Dependency Inversion Principle]]: верхний уровень зависит от *абстракции*, деталь *впрыскивается* снаружи ([[dependency-injection|внедрение зависимостей]]). `Notifier` не создаёт `EmailChannel` внутри, а *принимает* любой `Sender` в конструкторе. В тесте впрыскиваем `FakeChannel`-заглушку — `Notifier` не меняется. Именно DI делает SOLID-код *тестируемым*.",
			code: {
				title: "ISP + DIP: узкий Protocol и впрыснутая зависимость",
				language: 'python',
				code: String.raw`from typing import Protocol, runtime_checkable


# ---------- ISP: узкий интерфейс через Protocol ----------
@runtime_checkable
class Sender(Protocol):
    def send(self, text: str) -> str: ...     # ровно ОДИН нужный метод


# Реализации НЕ наследуют Sender — достаточно совпадения по форме.
class EmailChannel:
    def send(self, text: str) -> str:
        return f"[email] {text}"


class SmsChannel:
    def send(self, text: str) -> str:
        return f"[sms] {text}"


# ---------- DIP: верхний уровень зависит от абстракции Sender ----------
class Notifier:
    def __init__(self, channel: Sender):      # зависимость ВПРЫСКИВАЕТСЯ снаружи
        self.channel = channel

    def notify(self, user: str, text: str) -> str:
        return self.channel.send(f"{user}: {text}")


class FakeChannel:                            # тестовый дубль, тоже подходит под Sender
    def __init__(self):
        self.box = []

    def send(self, text: str) -> str:
        self.box.append(text)
        return "ok"


print(Notifier(EmailChannel()).notify("ann", "привет"))
print(Notifier(SmsChannel()).notify("bob", "код 1234"))

fake = FakeChannel()
Notifier(fake).notify("test", "ping")
print("FakeChannel перехватил:", fake.box)
print("isinstance(EmailChannel(), Sender) =", isinstance(EmailChannel(), Sender))`,
				explanation: "`EmailChannel` *не наследует* `Sender`, но `isinstance(..., Sender)` всё равно `True`: `@runtime_checkable` [[protocol|Protocol]] проверяет наличие метода по форме — это структурная типизация. И `FakeChannel` без единой правки `Notifier` подменяет реальный канал в тесте — так [[dip|DIP]] + [[dependency-injection|DI]] делают код тестируемым."
			}
		},
		{
			kind: "connection",
			heading: "Композиция против наследования: предпочитай has-a",
			body: "Самое практичное правило ООП: *[[composition-over-inheritance|предпочитай композицию наследованию]]*. Наследование — *самая жёсткая* связь в языке: наследник видит и зависит от **всего** интерфейса и реализации базы; меняешь базу — рискуешь всеми наследниками (*хрупкий базовый класс*).\n\n## Две ловушки наследования ради переиспользования\n\n1. **Утечка лишнего интерфейса.** `class Stack(list)` кажется удобным — `append` уже есть. Но вместе с ним наследник получил `insert`, `sort` — и любой может проломить инвариант LIFO мимо `push`/`pop`.\n2. **Ложное is-a.** Наследуют, потому что «там есть нужный метод», а не потому что наследник *действительно является* частным случаем базы (см. [[lsp|LSP]]).\n\n## Композиция = владение + делегирование\n\nВместо «`Stack` *является* списком» — «`Stack` *владеет* списком» (`self._items = []`) и *делегирует* ему только нужные операции. Наружу торчит ровно `push`/`pop`/`peek`; `insert` недоступен.\n\n## Когда наследование оправдано\n\nНаследуй, когда выполнены **оба** условия: (1) настоящее is-a; (2) наследник проходит [[lsp|LSP]]. Уместные случаи: реализация [[abc|абстрактного базового класса]], специализация без подмены поведения базовых методов. Во всех «хочу переиспользовать код» — бери композицию.",
			code: {
				title: "Рефактор наследование → композиция: защищаем инвариант Stack",
				language: 'python',
				code: String.raw`# ---------- ПЛОХО: наследуем list, обнажая лишний интерфейс ----------
class StackBad(list):
    def push(self, x):
        self.append(x)

    def pop_top(self):
        return self.pop()


# ---------- ХОРОШО: композиция + делегирование ----------
class Stack:
    def __init__(self):
        self._items = []          # ВЛАДЕЕМ списком, а не наследуемся от него

    def push(self, x):
        self._items.append(x)     # делегируем хранение списку

    def pop(self):
        return self._items.pop()

    def peek(self):
        return self._items[-1]

    def __len__(self):
        return len(self._items)


bad = StackBad()
bad.push(1)
bad.push(2)
bad.insert(0, 999)               # ОЙ: list.insert проломил LIFO-инвариант
print("StackBad после insert(0,999):", list(bad), "-> вершина уже не та")

s = Stack()
s.push(1)
s.push(2)
print("Stack: peek =", s.peek(), "| len =", len(s))
print("Stack: pop  =", s.pop(), "| pop =", s.pop())
print("У Stack нет insert/append наружу -> инвариант LIFO защищён")`,
				explanation: "`StackBad`, унаследовав `list`, отдал наружу `insert` — и `insert(0, 999)` испортил вершину стека незаметно для `push`/`pop`. Версия на [[composition-over-inheritance|композиции]] такого метода наружу не выставляет: публичный интерфейс — ровно `push`/`pop`/`peek`."
			}
		},
		{
			kind: "definition",
			heading: "Паттерны GoF, которые Python упрощает: Observer и др.",
			body: "Паттерны [[gof|GoF]] — каталог типовых решений типовых проблем дизайна. Важная мысль: многие из них в Python *схлопываются* — то, что в Java требует иерархии классов, тут делается функцией или встроенной конструкцией.\n\n## Observer (наблюдатель)\n\nСубъект ведёт список подписчиков и при изменении состояния *уведомляет* их, ничего не зная об их типах. В питоне подписчик — просто `callable`, а `subscribe` можно сделать ещё и декоратором (`@acc.subscribe` над функцией).\n\n## Decorator и связь с `@`\n\nПаттерн Decorator — это *обёртка с тем же интерфейсом*, добавляющая поведение, через композицию: `Milk(Coffee())` оборачивает кофе, не меняя его класс. Это ровно идея синтаксиса `@decorator` для функций: `add = with_log(add)`.\n\n## Adapter и Singleton\n\nAdapter — переходник между *несовместимыми интерфейсами*. Singleton гарантирует единственный экземпляр, но в Python **модуль уже синглтон**, а для ленивого кэша есть `functools.cache` — классический Singleton почти всегда лишний (мешает тестам, решает несуществующую проблему).",
			code: {
				title: "Observer: подписчики-функции, subscribe как декоратор",
				language: 'python',
				code: String.raw`class Subject:
    def __init__(self):
        self._observers = []      # список наблюдателей-callable

    def subscribe(self, fn):      # fn(event) -> None
        self._observers.append(fn)
        return fn                 # удобно: можно использовать как декоратор

    def unsubscribe(self, fn):
        self._observers.remove(fn)

    def notify(self, event):
        for fn in self._observers:
            fn(event)             # дёргаем каждого подписчика


# Доменный субъект: счёт, который уведомляет о пополнении.
class Account(Subject):
    def __init__(self):
        super().__init__()
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount
        self.notify(("deposit", amount, self.balance))   # рассылаем событие


acc = Account()

# Подписчик 1 — лог.
acc.subscribe(lambda e: print(f"[log] {e[0]} {e[1]} -> баланс {e[2]}"))


# Подписчик 2 — антифрод, через subscribe-как-декоратор.
@acc.subscribe
def fraud_alert(e):
    if e[1] >= 1000:
        print(f"[fraud] крупное пополнение {e[1]}!")


acc.deposit(100)
acc.deposit(5000)
print("Наблюдатели не знают друг о друге; Account не знает их типов")`,
				explanation: "`Account` рассылает событие, не зная, кто подписан: лог и антифрод реагируют независимо. Подписчик — обычный `callable`, а `@acc.subscribe` над `fraud_alert` показывает, как метод-подписка естественно становится декоратором. Это [[observer|Observer]] в минималистичном виде."
			}
		},
		{
			kind: "note",
			heading: "Decorator, Adapter и Singleton — в одном запуске",
			body: "Соберём три оставшихся паттерна в один наглядный прогон.\n\n- `Syrup(Milk(Coffee()))` — [[decorator-pattern|Decorator]]: слои-обёртки с тем же интерфейсом (`cost`/`desc`) добавляют цену и описание, не меняя класс `Coffee`.\n- `@with_log` над `add` — *тот же приём для функций*. `functools.wraps` сохраняет имя и докстроку исходной функции (иначе `add.__name__` стал бы `wrapper`).\n- `PrinterAdapter` — [[adapter|Adapter]]: переводит ожидаемый `render(s)` в легаси-`print_text(s)`.\n- `functools.cache` на `get_config` — питоновская замена [[singleton|Singleton]]: тело выполнится один раз, дальше возвращается тот же объект (`a is b` → `True`).\n\nDecorator и Adapter оба построены на *композиции* (обёртка владеет внутренним объектом) — ещё одно подтверждение тезиса предыдущей секции.",
			code: {
				title: "Decorator (паттерн и @) + Adapter + cache вместо Singleton",
				language: 'python',
				code: String.raw`import functools


# ===== DECORATOR (паттерн): обёртка с тем же интерфейсом добавляет поведение =====
class Coffee:
    def cost(self) -> float:
        return 100.0

    def desc(self) -> str:
        return "кофе"


class AddOn:                         # базовая обёртка-декоратор: хранит «начинку»
    def __init__(self, inner):
        self._inner = inner          # КОМПОЗИЦИЯ: декоратор содержит объект

    def cost(self) -> float:
        return self._inner.cost()

    def desc(self) -> str:
        return self._inner.desc()


class Milk(AddOn):
    def cost(self) -> float:
        return self._inner.cost() + 30

    def desc(self) -> str:
        return self._inner.desc() + " + молоко"


class Syrup(AddOn):
    def cost(self) -> float:
        return self._inner.cost() + 20

    def desc(self) -> str:
        return self._inner.desc() + " + сироп"


drink = Syrup(Milk(Coffee()))        # оборачиваем слоями, как @-декораторы функций
print("DECORATOR:", drink.desc(), "=", drink.cost())


# ===== СВЯЗЬ С @decorator: тот же приём для функций =====
def with_log(fn):
    @functools.wraps(fn)
    def wrapper(*a, **kw):
        print(f"  [log] вызов {fn.__name__}{a}")
        return fn(*a, **kw)
    return wrapper


@with_log                            # add = with_log(add) — обёртка над функцией
def add(x, y):
    return x + y


print("DECORATOR(@):", add(2, 3))


# ===== ADAPTER: переходник к чужому несовместимому интерфейсу =====
class OldPrinter:                    # «легаси»: метод называется print_text
    def print_text(self, s: str) -> str:
        return f"OLD>> {s}"


class PrinterTarget:                 # интерфейс, которого ждёт наш код: render(s)
    def render(self, s: str) -> str:
        raise NotImplementedError


class PrinterAdapter(PrinterTarget): # адаптер переводит render -> print_text
    def __init__(self, legacy: OldPrinter):
        self._legacy = legacy

    def render(self, s: str) -> str:
        return self._legacy.print_text(s)


def use(target: PrinterTarget, s: str) -> str:
    return target.render(s)          # код знает только про render


print("ADAPTER:", use(PrinterAdapter(OldPrinter()), "привет"))


# ===== SINGLETON: зачем класс, если модуль уже синглтон? =====
@functools.cache                     # один результат на одинаковые аргументы
def get_config():
    print("  (создаю конфиг ОДИН раз)")
    return {"env": "prod"}


a = get_config()
b = get_config()                     # второй раз — без пересоздания
print("SINGLETON via cache: a is b =", a is b)`,
				explanation: "Видно, как `Syrup(Milk(Coffee()))` накапливает цену слой за слоем (150), как `@with_log` логирует вызов `add`, как `PrinterAdapter` переводит `render` в `print_text`, и как `functools.cache` создаёт конфиг лишь раз (`a is b` → `True`). Четыре паттерна — и почти весь «паттерн» растворён в возможностях языка."
			}
		},
		{
			kind: "plain",
			heading: "Мини-проект: система оплаты на нескольких принципах",
			body: "Финал дня — маленький связный проект, где идеи работают вместе.\n\n- [[protocol|Protocol]] `PaymentMethod` с единственным `pay` — узкий интерфейс ([[isp|ISP]]), от которого зависит верхний уровень ([[dip|DIP]]).\n- `Card`, `Cash`, `Crypto` — взаимозаменяемые стратегии оплаты ([[strategy|Strategy]]); они *структурно* реализуют `PaymentMethod`, не наследуя его.\n- `make_payment` — [[factory-method|Factory]]: создаёт нужный способ по имени, пряча конкретные классы.\n- `Order` как `@dataclass` — только данные и подсчёт суммы ([[srp|SRP]]).\n- `checkout` зависит от абстракции `PaymentMethod`, поэтому один и тот же `checkout` работает с любым способом, а новый способ = новый класс плюс строка в фабрике ([[ocp|OCP]]).",
			code: {
				title: "Система оплаты: Protocol + Strategy + Factory + dataclass",
				language: 'python',
				code: String.raw`from dataclasses import dataclass, field
from typing import Protocol, runtime_checkable


# --- Узкий интерфейс способа оплаты (ISP + DIP) ---
@runtime_checkable
class PaymentMethod(Protocol):
    def pay(self, amount: float) -> str: ...


# --- Конкретные стратегии оплаты (структурно реализуют PaymentMethod) ---
class Card:
    def __init__(self, last4: str):
        self.last4 = last4

    def pay(self, amount: float) -> str:
        return f"картой ****{self.last4} списано {amount:.2f}"


class Cash:
    def pay(self, amount: float) -> str:
        return f"наличными принято {amount:.2f}"


class Crypto:
    def __init__(self, wallet: str):
        self.wallet = wallet

    def pay(self, amount: float) -> str:
        return f"крипто-перевод {amount:.2f} на {self.wallet[:6]}…"


# --- Factory Method: создаём способ по имени, не зашивая классы в вызывающий код ---
def make_payment(kind: str, **kw) -> PaymentMethod:
    table = {"card": Card, "cash": Cash, "crypto": Crypto}
    if kind not in table:
        raise ValueError(f"неизвестный способ: {kind}")
    return table[kind](**kw)


# --- Заказ как dataclass: только данные + подсчёт суммы (SRP) ---
@dataclass
class Order:
    items: list = field(default_factory=list)   # список (название, цена, кол-во)

    def add(self, name: str, price: float, qty: int = 1) -> "Order":
        self.items.append((name, price, qty))
        return self

    @property
    def total(self) -> float:
        return sum(price * qty for _, price, qty in self.items)


# --- Checkout зависит от АБСТРАКЦИИ PaymentMethod, а не от Card/Cash ---
def checkout(order: Order, method: PaymentMethod) -> str:
    return method.pay(order.total)


order = Order().add("книга", 500, 2).add("ручка", 50, 3)
print("итого:", order.total)

for kind, kw in [("card", {"last4": "4321"}), ("cash", {}), ("crypto", {"wallet": "0xABCDEF123"})]:
    method = make_payment(kind, **kw)               # Factory + Strategy
    print(f"  {kind:6}:", checkout(order, method))  # один и тот же checkout

print("Новый способ оплаты = новый класс + строка в фабрике; checkout/Order не трогаем")`,
				explanation: "Один `checkout` обслуживает три разных способа оплаты, потому что зависит от [[protocol|Protocol]] `PaymentMethod`, а не от конкретных классов. `make_payment` ([[factory-method|Factory]]) прячет выбор класса за строковым именем, `Order`-`dataclass` отвечает только за данные и сумму. Чтобы добавить `ApplePay`, достаточно нового класса с `pay` и строки в фабрике — остальной код не меняется ([[ocp|OCP]])."
			}
		}
	],
	tasks: [
		{
			id: 'oop-d10-t1',
			difficulty: "base",
			prompt: "Дана функция расчёта доставки с лесенкой `if kind == \"flat\": ... elif kind == \"weight\": ... elif kind == \"free\": ...`. Перепишите её по [[ocp|OCP]] через паттерн [[strategy|Strategy]], используя *словарь функций* (а не классы). Тарифы: `flat` = 300; `weight` = 100 + 50·вес; `free` = 0. Покажите, что новый тариф добавляется без правки функции расчёта.",
			hint: "Каждая ветка `elif` → отдельная функция `float -> float`. Сложите их в `dict[str, Callable]`. Расчёт берёт стратегию из словаря по ключу и вызывает; новый тариф — просто новый ключ.",
			solution: "Лесенка `if/elif` заменяется таблицей стратегий-функций. Расчёт берёт функцию из словаря по имени тарифа и вызывает её — сам он закрыт для изменения, а словарь открыт для расширения.\n\n```python\nfrom typing import Callable\n\ndef shipping_flat(weight: float) -> float:\n    return 300.0\n\ndef shipping_by_weight(weight: float) -> float:\n    return 100.0 + 50.0 * weight\n\ndef shipping_free(weight: float) -> float:\n    return 0.0\n\nSTRATEGIES: dict[str, Callable[[float], float]] = {\n    \"flat\": shipping_flat,\n    \"weight\": shipping_by_weight,\n    \"free\": shipping_free,\n}\n\ndef shipping_cost(kind: str, weight: float) -> float:\n    try:\n        return STRATEGIES[kind](weight)\n    except KeyError:\n        raise ValueError(f\"неизвестный тариф: {kind}\")\n\nprint(\"weight:\", shipping_cost(\"weight\", 3))    # 250.0\n\n# Новый тариф — одной строкой, без правки shipping_cost:\nSTRATEGIES[\"express\"] = lambda w: 500 + 80 * w\nprint(\"express:\", shipping_cost(\"express\", 3))  # 740\n```\n\nКлюч: `shipping_cost` не меняется при добавлении тарифа — это и есть OCP.",
			answer: "Словарь `STRATEGIES: dict[str, Callable]` + `shipping_cost`, читающий из него; новый тариф = новая запись в словаре, расчётная функция нетронута.",
			xp: 12
		},
		{
			id: 'oop-d10-t2',
			difficulty: "base",
			prompt: "Был класс `class Car(Engine)` — «машина *наследует* двигатель». Объясните, почему это неверное отношение, и перепишите на [[composition-over-inheritance|композицию]] с делегированием, чтобы `Car` *владел* двигателем и предоставлял методы `start`/`stop`. У `Engine` есть `power`, `start()`, `stop()`.",
			hint: "Спросите себя: «машина *является* двигателем» или «у машины *есть* двигатель»? Это has-a, не is-a. Значит `Engine` — поле `Car`, а `Car.start()` делегирует вызов `self._engine.start()`.",
			solution: "`Car(Engine)` ломает is-a: машина *не является* двигателем, у неё двигатель *есть* (has-a). Наследование к тому же протащило бы в `Car` весь интерфейс `Engine`. Правильно — композиция: `Car` хранит `Engine` в поле и делегирует ему нужные вызовы.\n\n```python\nclass Engine:\n    def __init__(self, power: int):\n        self.power = power\n        self._running = False\n\n    def start(self) -> str:\n        self._running = True\n        return f\"двигатель {self.power} л.с. запущен\"\n\n    def stop(self) -> str:\n        self._running = False\n        return \"двигатель заглушен\"\n\nclass Car:\n    def __init__(self, model: str, power: int):\n        self.model = model\n        self._engine = Engine(power)     # has-a: машина ВЛАДЕЕТ двигателем\n\n    def start(self) -> str:              # делегируем двигателю\n        return f\"{self.model}: {self._engine.start()}\"\n\n    def stop(self) -> str:\n        return f\"{self.model}: {self._engine.stop()}\"\n\ncar = Car(\"Lada\", 90)\nprint(car.start())   # Lada: двигатель 90 л.с. запущен\nprint(car.stop())    # Lada: двигатель заглушен\n```\n\nБонус композиции: двигатель можно заменить (электро/ДВС) или подменить заглушкой в тесте, не меняя интерфейс `Car`, и `Car` не унаследовал лишних деталей.",
			answer: "`Engine` — поле `Car` (`self._engine`), методы `Car.start/stop` делегируют `self._engine.start/stop`; has-a вместо is-a.",
			xp: 12
		},
		{
			id: 'oop-d10-t3',
			difficulty: "star",
			prompt: "Постройте мини-«тикер цены», соединив три идеи: (1) [[observer|Observer]] — субъект `Ticker` при `set_price` уведомляет подписчиков; (2) [[strategy|Strategy]] — *как* показать цену задаёт форматтер; (3) [[protocol|Protocol]] — форматтер описан узким `PriceFormatter` с методом `format(price) -> str`, и реализации `Plain` и `WithTax(rate)` *не наследуют* его. Подписчики — обычные функции; хотя бы одну подпишите через декоратор. Покажите, что стратегию форматирования можно подменить, не трогая `Ticker`.",
			hint: "`Ticker` хранит список callable-подписчиков и форматтер. В `set_price`: применить `self._fmt.format(price)` (Strategy), затем разослать результат всем подписчикам (Observer). `@runtime_checkable` Protocol позволит проверить `isinstance(WithTax(0.2), PriceFormatter)`.",
			solution: "`Ticker` совмещает роль субъекта (Observer) и держателя стратегии форматирования (Strategy через Protocol). Форматтеры реализуют `PriceFormatter` структурно — без наследования.\n\n```python\nfrom typing import Protocol, runtime_checkable, Callable\n\n@runtime_checkable\nclass PriceFormatter(Protocol):\n    def format(self, price: float) -> str: ...\n\nclass Plain:\n    def format(self, price: float) -> str:\n        return f\"{price:.2f}\"\n\nclass WithTax:\n    def __init__(self, rate: float):\n        self.rate = rate\n    def format(self, price: float) -> str:\n        return f\"{price * (1 + self.rate):.2f} (с налогом)\"\n\nclass Ticker:                                  # Subject (Observer)\n    def __init__(self, fmt: PriceFormatter):\n        self._price = 0.0\n        self._fmt = fmt                        # стратегия форматирования (DIP)\n        self._subs: list[Callable[[str], None]] = []\n\n    def subscribe(self, fn: Callable[[str], None]) -> Callable:\n        self._subs.append(fn)\n        return fn                              # годится как декоратор\n\n    def set_price(self, price: float) -> None:\n        self._price = price\n        shown = self._fmt.format(price)        # Strategy\n        for fn in self._subs:                  # Observer: рассылка\n            fn(shown)\n\nt = Ticker(WithTax(0.2))\nt.subscribe(lambda s: print(f\"[экран] цена: {s}\"))\n\n@t.subscribe\ndef alert(s: str) -> None:\n    print(f\"[алерт] обновление -> {s}\")\n\nt.set_price(100)   # 120.00 (с налогом)\nt.set_price(250)   # 300.00 (с налогом)\n\n# Стратегию подменяем, Ticker не меняется:\nt2 = Ticker(Plain())\nt2.subscribe(lambda s: print(f\"[экран2] {s}\"))\nt2.set_price(100)  # 100.00\nprint(isinstance(WithTax(0.2), PriceFormatter))  # True\n```\n\nКлюч: `Ticker` зависит только от узкого [[protocol|Protocol]] `PriceFormatter`, поэтому `Plain` и `WithTax` взаимозаменяемы ([[strategy|Strategy]] + [[dip|DIP]]), а подписчики получают уже отформатированную строку, не зная про форматтер ([[observer|Observer]]).",
			answer: "`Ticker(fmt)` хранит форматтер-стратегию и список callable-подписчиков; `set_price` форматирует через `fmt.format` и рассылает всем; форматтеры реализуют `PriceFormatter` структурно, подмена стратегии не трогает `Ticker`.",
			xp: 25
		}
	],
	mastery: [
		"Называю каждый из пяти принципов SOLID одной фразой и привожу питоновский пример «плохо→хорошо» (god object для SRP, if/elif→Strategy для OCP, Rectangle/Square для LSP, толстый интерфейс→узкий Protocol для ISP, инъекция зависимости для DIP)",
		"Объясняю правило «предпочитай композицию наследованию», показываю рефактор наследование→композиция через делегирование и формулирую два условия, когда наследование оправдано (истинное is-a + прохождение LSP)",
		"Распознаю и применяю паттерны Strategy, Factory Method, Observer, Decorator, Adapter и понимаю, как Python упрощает их (функция вместо класса-стратегии, @-декоратор, callable-подписчик)",
		"Знаю, почему классический Singleton в Python почти всегда лишний: модуль уже одиночка, а для ленивого кэша есть functools.cache; вижу, чем глобальное состояние вредит тестам",
		"Собираю маленькую систему (оплата/тикер), где Protocol+Strategy+Factory+dataclass работают вместе так, что новый случай добавляется без правки существующего кода"
	]
};
