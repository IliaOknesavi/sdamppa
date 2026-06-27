import type { Day } from '$lib/types';

export const day04: Day = {
	n: 4,
	phaseId: "hierarchy",
	kind: 'theory',
	title: "Наследование, super() и MRO",
	est: '1–2 ч',
	goal: "Освоить наследование как отношение [[is-a|is-a]]: переопределять и *расширять* методы через `super()`, понять, почему `super()` лучше жёсткого `Base.method(self)`, и разобрать множественное наследование до дна — алгоритм [[c3|C3-линеаризации]], `__mro__`, ромбовидное наследование и кооперативный обход цепочки, а также миксины и интроспекцию иерархии (`isinstance`/`issubclass`/`__bases__`).",
	sections: [
		{
			kind: "definition",
			heading: "Наследование как отношение is-a: переопределение и расширение",
			body: "**Наследование** связывает классы отношением [[is-a|is-a]]: если `Dog` наследует `Animal`, то *каждая собака есть животное*. Подкласс автоматически получает все атрибуты и методы базового класса, а затем может: ничего не менять, **переопределить** (override) метод целиком или **расширить** (extend) его, дополнив поведение базы.\n\nГраница между этими тремя случаями — главное:\n\n- *Использовать как есть* — метод не упомянут в подклассе, поиск атрибута поднимается по цепочке и находит базовую версию.\n- *Переопределить* — в подклассе объявлен метод с тем же именем; базовая версия для этого объекта больше не вызывается. `Cat.speak` полностью заменяет `Animal.speak`.\n- *Расширить* — переопределить, но **внутри** дёрнуть базу через `super()`. `Dog.describe` берёт строку базы и дописывает породу.\n\n## Почему расширение через super(), а не копипаст\n\nЕсли бы `Dog.__init__` сам присваивал `self.name = name; self.legs = 4`, он продублировал бы логику базы. Завтра в `Animal.__init__` добавят валидацию — и `Dog` молча отстанет. `super().__init__(...)` держит подкласс «подключённым» к актуальной реализации родителя — это [[ds-principle|DRY]] на уровне иерархии.\n\nКлючевое правило: расширяющий метод сначала зовёт `super()`, потом делает своё (для `__init__` — почти всегда так, чтобы своё поле не затёрлось перезапуском базы).",
			code: {
				title: "Animal → Dog/Cat: переопределение и расширение через super()",
				language: 'python',
				code: String.raw`# Animal -> Dog/Cat, переопределение + расширение через super()
class Animal:
    def __init__(self, name, legs=4):
        self.name = name
        self.legs = legs

    def describe(self):
        return f"{self.name}: животное на {self.legs} лапах"

    def speak(self):
        # базовое поведение по умолчанию
        return "..."


class Dog(Animal):
    def __init__(self, name, breed):
        # РАСШИРЯЕМ инициализацию: сначала база заполняет name/legs,
        super().__init__(name, legs=4)
        # затем добавляем своё поле
        self.breed = breed

    def speak(self):          # ПОЛНОЕ переопределение
        return "Гав!"

    def describe(self):       # РАСШИРЕНИЕ: дополняем результат базы
        base = super().describe()
        return f"{base}; порода {self.breed}"


class Cat(Animal):
    def speak(self):
        return "Мяу!"


for a in (Dog("Рекс", "хаски"), Cat("Мурка"), Animal("Нечто", legs=6)):
    print(f"{a.speak():5}  {a.describe()}")

# is-a: Dog ЯВЛЯЕТСЯ Animal
print("Dog is-a Animal:", isinstance(Dog("X", "y"), Animal))
print("speak у Dog переопределён:", Dog.speak is not Animal.speak)`,
				explanation: "Запуск показывает три режима. У `Dog` метод `speak` переопределён целиком, а `describe` *расширен* — базовая строка плюс `; порода хаски`. У `Cat` переопределён только `speak`, `describe` унаследован. Сравнение `Dog.speak is not Animal.speak` доказывает, что в подклассе лежит *другой* объект-функция, а `isinstance` подтверждает [[is-a|is-a]]."
			}
		},
		{
			kind: "derivation",
			heading: "Под капотом: что такое super() и почему не Base.method(self)",
			body: "`super()` без аргументов в Python 3 — сахар для `super(__class__, self)`, где `__class__` — *класс, в котором физически написана строка* (компилятор кладёт его в скрытую ячейку замыкания). Возвращается прокси-объект: при обращении к атрибуту он ищет метод **не** в `type(self)`, а начиная со следующего класса **после** `__class__` в `type(self).__mro__`.\n\nВот это «начиная со следующего в MRO **экземпляра**» — суть. `super()` смотрит не на статического родителя из кода, а на MRO реального объекта, который может оказаться шире, чем знал автор класса.\n\n## Чем super() отличается от Base.method(self)\n\nНаивная альтернатива — звать предка по имени: `Animal.describe(self)`. В одиночном наследовании результат тот же. Разница вылезает при множественном:\n\n- `Base.method(self)` *жёстко* фиксирует, какой класс вызывается. Он игнорирует MRO объекта.\n- `super().method()` идёт по MRO **дальше от текущей точки**, поэтому в [[diamond|ромбе]] промежуточные классы не пропускаются и не дублируются.\n\nКлассический симптом ошибки `Base.__init__(self)` — в ромбе общий предок инициализируется **дважды**.\n\n## Частые ошибки\n\n- *Забыть `super().__init__()` в самом «верхнем» пользовательском классе.* В кооперативной схеме он нужен, чтобы цепочка дошла до `object.__init__`.\n- *Перепутать порядок аргументов в старом стиле.* `super(Dog, self)` — `(класс-откуда-ищем-дальше, объект)`, не наоборот.\n- *Звать `super()` вне метода класса* — там нет скрытого `__class__`, будет ошибка.",
			code: {
				title: "super() vs Base.method(self): один A.__init__ против двух",
				language: 'python',
				code: String.raw`# почему super(), а не Base.method(self) — кооперативность в diamond
class A:
    def __init__(self):
        print("A.__init__")
        # ВАЖНО: даже у "корня" пользовательской иерархии зовём super().
        # Следующий в MRO — object, его __init__ ничего не делает.
        super().__init__()


class B(A):
    def __init__(self):
        print("B.__init__ ->")
        super().__init__()      # пойдёт по MRO, а не жёстко в A


class C(A):
    def __init__(self):
        print("C.__init__ ->")
        super().__init__()


class D(B, C):
    def __init__(self):
        print("D.__init__ ->")
        super().__init__()


print("MRO:", [cls.__name__ for cls in D.__mro__])
print("--- создаём D() с super() (кооперативно) ---")
D()
print("A вызвана РОВНО один раз — diamond не задвоился")

print("\n--- а теперь жёсткие явные вызовы Base.__init__(self) ---")


class Bx(A):
    def __init__(self):
        print("Bx.__init__ ->")
        A.__init__(self)        # жёстко зовём A


class Cx(A):
    def __init__(self):
        print("Cx.__init__ ->")
        A.__init__(self)        # и здесь жёстко зовём A


class Dx(Bx, Cx):
    def __init__(self):
        print("Dx.__init__ ->")
        Bx.__init__(self)       # внутри вызовет A
        Cx.__init__(self)       # и здесь снова вызовет A


Dx()
print("A вызвана ДВАЖДЫ — вот цена Base.method(self) при ромбе")`,
				explanation: "Слева (через `super()`) цепочка идёт `D → B → C → A → object` строго по MRO, и `A.__init__` печатается **один раз** — `super()` в `B` ведёт не в `A`, а в *следующий по MRO объекта* класс `C`. Справа (через `A.__init__(self)`) и `Bx`, и `Cx` жёстко зовут `A`, поэтому `A.__init__` выполняется **дважды** — типичный баг ромбовидных иерархий, который `super()` устраняет автоматически."
			}
		},
		{
			kind: "definition",
			heading: "Множественное наследование, MRO и алгоритм C3",
			body: "При множественном наследовании (`class D(B, C)`) у класса несколько прямых баз. Вопрос: в каком порядке искать атрибут, если он есть у нескольких предков? Ответ даёт [[mro|MRO]], зафиксированный в `D.__mro__`. Поиск атрибута идёт по этому списку слева направо и берёт **первое** совпадение.\n\nMRO вычисляется один раз при создании класса алгоритмом [[c3|C3-линеаризации]]. Линеаризация $L[C]$ задаётся рекурсивно:\n$$L[C] = C + \\mathrm{merge}\\big(L[B_1],\\dots,L[B_k],\\ [B_1,\\dots,B_k]\\big),$$\nгде $B_1,\\dots,B_k$ — прямые базы, а `merge` на каждом шаге берёт «голову» первого списка, которая **не встречается в хвосте** ни одного из оставшихся списков.\n\n## Что C3 гарантирует\n\nC3 — не DFS и не BFS, а единственная линеаризация, удовлетворяющая трём свойствам сразу:\n\n1. **Подкласс всегда раньше своих баз** (локальная согласованность).\n2. **Сохраняется порядок прямых баз** (если `D(B, C)`, то `B` раньше `C`).\n3. **Монотонность**: порядок, согласованный для родителей, не ломается у потомка.\n\nЕсли согласовать все три невозможно, Python **отказывается создавать класс** с `TypeError: Cannot create a consistent method resolution order`. Без согласованного MRO `super()` не смог бы давать предсказуемый порядок.\n\nВ блоке ниже мы реализуем `merge`/C3 руками для иерархии `object ← O ← A, B; A, B ← C` и сверяем с настоящим `C.__mro__` — он совпадает символ-в-символ.",
			code: {
				title: "C3-линеаризация руками = настоящий __mro__",
				language: 'python',
				code: String.raw`# C3-линеаризация вручную и сверка с __mro__
def merge(seqs):
    """Алгоритм слияния C3: на каждом шаге берём 'голову' первого
    списка, которая НЕ встречается в хвосте ни одного из списков."""
    result = []
    seqs = [list(s) for s in seqs if s]
    while seqs:
        for seq in seqs:
            head = seq[0]
            in_tail = any(head in s[1:] for s in seqs)
            if not in_tail:
                break
        else:
            raise TypeError("Несогласованная иерархия — C3 невозможна")
        result.append(head)
        new = []
        for s in seqs:
            s = [x for x in s if x != head]
            if s:
                new.append(s)
        seqs = new
    return result


def c3(cls, parents_of):
    """L[C] = C + merge(L[родителей], список родителей)."""
    parents = parents_of[cls]
    if not parents:
        return [cls]
    seqs = [c3(p, parents_of) for p in parents] + [list(parents)]
    return [cls] + merge(seqs)


# иерархия:  object <- O <- A,B ; A,B <- C(A,B)
parents_of = {
    "object": [],
    "O": ["object"],
    "A": ["O"],
    "B": ["O"],
    "C": ["A", "B"],
}
print("L[C] вручную (C3):", c3("C", parents_of))


# та же иерархия на реальных классах
class O: ...           # O(object) неявно
class A(O): ...
class B(O): ...
class C(A, B): ...


mro_names = [k.__name__ for k in C.__mro__]
print("C.__mro__       :", mro_names)
manual = c3("C", parents_of)
print("совпадает с C.__mro__:", manual == mro_names)`,
				explanation: "Функция `c3` буквально реализует $L[C]=C+\\mathrm{merge}(\\dots)$, а `merge` — правило «голова, которой нет ни в одном хвосте». Для ромба `C(A, B)` она выдаёт `['C', 'A', 'B', 'O', 'object']`, и это **тождественно** настоящему `C.__mro__` (последняя строка печатает `True`). Так видно, что `__mro__` — детерминированный результат C3, воспроизводимый на бумаге."
			}
		},
		{
			kind: "intuition",
			heading: "Ромбовидное наследование и кооперативный super()",
			body: "**[[diamond|Ромб]]** (diamond) — это когда два класса `B` и `C` наследуют общего предка `A`, а `D` наследует и `B`, и `C`. Граф наследования образует ромб с `A` на вершине и `D` снизу. Общий предок `A` лежит в иерархии один раз, но «достижим» двумя путями.\n\nC3 спрямляет ромб в `D → B → C → A → object`. Ключ: **`A` стоит в MRO ровно один раз и после обоих своих потомков** `B` и `C`. Поэтому если каждый класс зовёт `super().__init__()`, управление проходит `D → B → C → A → object` — каждый узел ровно один раз. Это и называют **кооперативным** множественным наследованием.\n\n## Почему super(), а не имена\n\nКогда `B.__init__` пишет `super().__init__()`, он *не* зовёт `A` напрямую — он зовёт **следующий за `B` в MRO конкретного объекта**. Для одинокого `B()` это `A`. Но для `D()` MRO — `[D, B, C, A, object]`, и `super()` из `B` ведёт в `C`, а не в `A`. Тот же код `B` ведёт себя по-разному в зависимости от того, чьей частью оказался экземпляр.\n\n## Практика: **kwargs и хвостовой класс\n\nЧтобы кооперативная цепочка пережила разные наборы аргументов, классы принимают `**kwargs` и пробрасывают остаток: `super().__init__(**kwargs)`. Последний пользовательский класс перед `object` гасит kwargs пустым `super().__init__()`, иначе `object.__init__()` ругнётся на лишние аргументы.",
			code: {
				title: "Кооперативный super() с **kwargs: каждый слой работает один раз",
				language: 'python',
				code: String.raw`# кооперативный super() с **kwargs — diamond, где КАЖДЫЙ слой работает
class Base:
    def __init__(self, **kwargs):
        # last stop перед object: гасим kwargs, чтобы object.__init__()
        # не получил лишних аргументов
        super().__init__()
        self.log = []


class LoudMixin(Base):
    def __init__(self, *, volume=1, **kwargs):
        super().__init__(**kwargs)     # пробрасываем остаток дальше по MRO
        self.volume = volume
        self.log.append(f"Loud(volume={volume})")


class ColoredMixin(Base):
    def __init__(self, *, color="grey", **kwargs):
        super().__init__(**kwargs)
        self.color = color
        self.log.append(f"Colored(color={color})")


class Widget(LoudMixin, ColoredMixin):
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)     # запускает кооперативную цепочку
        self.name = name
        self.log.append(f"Widget(name={name})")


print("MRO:", [c.__name__ for c in Widget.__mro__])
w = Widget("ok", volume=7, color="red")
print("name  :", w.name)
print("volume:", w.volume)
print("color :", w.color)
print("порядок инициализации (по log):")
for line in w.log:
    print("   ", line)`,
				explanation: "MRO — `[Widget, LoudMixin, ColoredMixin, Base, object]`. Вызов `Widget(...)` запускает цепочку `super()`, и `Base.__init__` отрабатывает **первым по факту** (создаёт `log`), потому что каждый класс сначала зовёт `super()`, а своё пишет после. Отсюда порядок в `log`: `Colored → Loud → Widget`. Каждый из трёх kwargs (`volume`, `color`, `name`) подхвачен ровно своим слоем, а `**kwargs` пробросил остаток."
			}
		},
		{
			kind: "connection",
			heading: "Миксины: переиспользуемое поведение без is-a",
			body: "**[[mixin|Миксин]]** — маленький класс, который добавляет одно переиспользуемое умение (логирование, сериализацию, `__repr__`, сравнение) и **не предназначен для самостоятельного создания экземпляров**. Его «подмешивают» к основному классу через множественное наследование: `class Point(ReprMixin, AsDictMixin): ...`.\n\nМиксин — намеренное *исключение* из правила «наследование = is-a». `ReprMixin` не утверждает, что `Point` *является* репрезентацией; он лишь *добавляет способность*. Технически это обычный класс — различие в соглашении и дисциплине (имя на `...Mixin`, отсутствие своего `__init__` с состоянием, узкая ответственность).\n\n## Признаки хорошего миксина\n\n- **Узкая, одна ответственность.** `JsonMixin` сериализует, `ReprMixin` печатает — и ничего больше.\n- **Опирается на контракт, а не на конкретный класс.** `ReprMixin.__repr__` читает `type(self).__name__` и `vars(self)` — работает с *любым* классом.\n- **Ставится левее основной базы.** В MRO миксин должен идти раньше класса, чьё поведение уточняет.\n\n## Интроспекция иерархии\n\nТри инструмента: `isinstance(obj, T)` — *является ли объект экземпляром* `T` (учитывает весь MRO); `issubclass(S, T)` — *подкласс ли* `S`; `Cls.__bases__` — кортеж **прямых** баз (в отличие от `__mro__`). `isinstance` и `issubclass` принимают кортеж типов — `isinstance(p, (str, Point))` истинно, если хоть один тип подходит.",
			code: {
				title: "ReprMixin / AsDictMixin + isinstance / issubclass / __bases__",
				language: 'python',
				code: String.raw`# миксины ReprMixin / AsDictMixin + isinstance/issubclass/__bases__
class ReprMixin:
    """Переиспользуемое поведение: __repr__ по полям __init__-сигнатуры."""
    def __repr__(self):
        cls = type(self).__name__
        fields = ", ".join(f"{k}={v!r}" for k, v in vars(self).items())
        return f"{cls}({fields})"


class AsDictMixin:
    def as_dict(self):
        return dict(vars(self))


class Point(ReprMixin, AsDictMixin):
    def __init__(self, x, y):
        self.x = x
        self.y = y


class Point3D(Point):
    def __init__(self, x, y, z):
        super().__init__(x, y)
        self.z = z


p = Point3D(1, 2, 3)
print("repr  :", repr(p))            # из ReprMixin, но cls берётся динамически
print("as_dict:", p.as_dict())       # из AsDictMixin

# самоанализ иерархии
print("\nPoint3D.__bases__ :", [c.__name__ for c in Point3D.__bases__])
print("Point.__bases__   :", [c.__name__ for c in Point.__bases__])
print("issubclass(Point3D, ReprMixin):", issubclass(Point3D, ReprMixin))
print("isinstance(p, AsDictMixin)    :", isinstance(p, AsDictMixin))
print("isinstance(p, (str, Point))   :", isinstance(p, (str, Point)))
print("ReprMixin.__bases__           :", [c.__name__ for c in ReprMixin.__bases__])`,
				explanation: "`repr(p)` печатает `Point3D(x=1, y=2, z=3)`: `ReprMixin.__repr__` написан один раз, но `type(self).__name__` динамически даёт `Point3D`, а `vars(self)` — реальные поля. Тот же миксин обслужил бы любой класс. Интроспекция показывает разницу `__bases__` (у `Point3D` это только `Point`) и факт, что `issubclass(Point3D, ReprMixin)` истинно — миксин лежит в MRO транзитивно через `Point`."
			}
		},
		{
			kind: "note",
			heading: "Тонкости: __mro__ против __bases__, когда C3 падает и контракт __eq__/__hash__",
			body: "Несколько вещей, которые экономят часы отладки.\n\n## __bases__ ≠ __mro__\n\n`Cls.__bases__` — *прямые* базы, ровно то, что в скобках при объявлении. `Cls.__mro__` — полная линеаризация до `object`. `super()` ходит по `__mro__`, а не по `__bases__`.\n\n## super() видит MRO объекта, а не класса-автора\n\nИсточник 90% сюрпризов: `super()` внутри метода класса `X` ищет *следующий за `X`* класс в `type(self).__mro__`. Не читайте `super()` как «мой родитель» — читайте как «следующий по MRO этого экземпляра».\n\n## Когда C3 отказывается строить класс\n\nКанонический пример — поставить базу **раньше её собственного подкласса**: `class Z(X, Y)` при `Y(X)`. C3 требует `Y` раньше `X` (подкласс раньше базы), но порядок баз требует `X` раньше `Y` — противоречие, класс не создаётся. Блок ниже ловит эту ошибку (это **намеренная** демонстрация).\n\n## Контракт __eq__/__hash__ при наследовании\n\nКогда вы переопределяете `__eq__` (часто в миксине сравнения), вы **обязаны** согласовать `__hash__`: инвариант Python гласит `a == b ⇒ hash(a) == hash(b)`. Если определить только `__eq__`, Python *обнулит* `__hash__` (объект станет нехешируемым). Поэтому, давая `__eq__` через общий ключ `_key()`, определяйте и `__hash__` через **тот же** `_key()` — это разобрано в star-задаче.",
			code: {
				title: "SerializableMixin + намеренная ошибка несогласованного C3",
				language: 'python',
				code: String.raw`# SerializableMixin + диагностика несогласованной MRO
import json


class SerializableMixin:
    def to_json(self):
        return json.dumps(vars(self), ensure_ascii=False, sort_keys=True)


class TimestampMixin:
    created_at = "2026-06-27"

    def stamp(self):
        return f"{type(self).__name__}@{self.created_at}"


class Event(SerializableMixin, TimestampMixin):
    def __init__(self, title):
        self.title = title


e = Event("Экзамен")
print("MRO  :", [c.__name__ for c in Event.__mro__])
print("json :", e.to_json())
print("stamp:", e.stamp())

# демонстрация НАМЕРЕННОЙ ошибки: несогласованный порядок баз -> C3 падает
print("\n--- намеренная демонстрация ошибки C3 ---")


class X: ...
class Y(X): ...


try:
    # X должен идти ПОСЛЕ Y (Y наследует X), а тут просим X раньше Y
    class Z(X, Y): ...
except TypeError as exc:
    print("TypeError (ожидаемо):", str(exc).split(":")[0])
    print("причина: нельзя поставить X раньше его подкласса Y в линеаризации")`,
				explanation: "Сверху — рабочий случай: два миксина собраны в `Event`, MRO линейный, `to_json` и `stamp` доступны. Снизу — намеренная ошибка: при `Y(X)` C3 обязана поставить `Y` раньше `X`, но `class Z(X, Y)` требует обратного. Согласовать нельзя, поэтому Python вообще **не создаёт** класс и бросает `TypeError: Cannot create a consistent method resolution order`. Это та защита, без которой `super()` был бы непредсказуем."
			}
		}
	],
	tasks: [
		{
			id: 'oop-d4-t1',
			difficulty: "base",
			prompt: "Постройте иерархию фигур: базовый `Shape` с полем `name` и методом `area()`, который бросает `NotImplementedError`, и методом `describe()`, печатающим имя и площадь. Сделайте `Circle(r)` и `Rectangle(w, h)`, переопределяющие `area()`, причём `__init__` каждого *расширяет* базовый через `super().__init__(...)`. Добавьте `Square(side)`, который наследует `Rectangle` и переиспользует его `area()` (не дублируя формулу), вызвав `super().__init__(side, side)`. Проверьте отношения через `isinstance`/`issubclass`.",
			hint: "`Square` не должен заново писать `area()` — раз квадрат is-a прямоугольник, формула `w*h` уже подходит при `w == h == side`. В `Square.__init__` достаточно `super().__init__(side, side)`.",
			solution: "Ключевая идея: `Square` *расширяет* `Rectangle`, передавая `side` дважды, и не трогает `area()`. `describe()` написан один раз в базе и работает для всех за счёт полиморфного `self.area()`.\n\n```python\nimport math\n\n\nclass Shape:\n    def __init__(self, name):\n        self.name = name\n\n    def area(self):\n        raise NotImplementedError(\"area() должен быть переопределён\")\n\n    def describe(self):\n        return f\"{self.name} площадью {self.area():.2f}\"\n\n\nclass Circle(Shape):\n    def __init__(self, r):\n        super().__init__(\"круг\")\n        self.r = r\n\n    def area(self):\n        return math.pi * self.r ** 2\n\n\nclass Rectangle(Shape):\n    def __init__(self, w, h):\n        super().__init__(\"прямоугольник\")\n        self.w = w\n        self.h = h\n\n    def area(self):\n        return self.w * self.h\n\n\nclass Square(Rectangle):\n    def __init__(self, side):\n        super().__init__(side, side)   # переиспользуем area() прямоугольника\n        self.name = \"квадрат\"\n\n\nfor s in [Circle(2), Rectangle(3, 4), Square(5)]:\n    print(s.describe(), \"| is-a Shape:\", isinstance(s, Shape))\nprint(\"Square is-a Rectangle:\", issubclass(Square, Rectangle))\n```\n\nЗапуск печатает площади `12.57`, `12.00`, `25.00`; обе проверки отношений дают `True`. `Square` не содержит ни одной формулы площади — это и есть выигрыш расширения через `super()`.",
			answer: "`Square(side)` вызывает `super().__init__(side, side)` и наследует `area()` от `Rectangle`; площадь квадрата 5 = 25.0, `issubclass(Square, Rectangle) == True`.",
			xp: 12
		},
		{
			id: 'oop-d4-t2',
			difficulty: "star",
			prompt: "Соберите кооперативную ромбовидную иерархию `A ← B, C ← D(B, C)`, где **каждый** класс в `__init__` принимает `**kwargs`, пишет своё имя в общий список `self.order` и вызывает `super().__init__(**kwargs)`. Запустите `D()` и докажите печатью, что: (1) `A.__init__` отработала ровно один раз, (2) фактический порядок соответствует обратному проходу по `D.__mro__`. Затем замените в `B` и `C` вызовы `super()` на жёсткие `A.__init__(self)` и покажите, что `A` дублируется.",
			hint: "Заводите `self.order` в самом `A` (хвост цепочки) — тогда к моменту, когда более производные классы захотят в него дописать, список уже создан. Сравните `order` с `list(reversed([c.__name__ for c in D.__mro__]))` без `object`.",
			solution: "Каждый класс зовёт `super().__init__(**kwargs)` *до* записи своего имени, поэтому записи ложатся в порядке раскрутки стека — от хвоста MRO к голове.\n\n```python\nclass A:\n    def __init__(self, **kwargs):\n        super().__init__(**kwargs)   # дойдёт до object\n        self.order = [\"A\"]\n\n\nclass B(A):\n    def __init__(self, **kwargs):\n        super().__init__(**kwargs)\n        self.order.append(\"B\")\n\n\nclass C(A):\n    def __init__(self, **kwargs):\n        super().__init__(**kwargs)\n        self.order.append(\"C\")\n\n\nclass D(B, C):\n    def __init__(self, **kwargs):\n        super().__init__(**kwargs)\n        self.order.append(\"D\")\n\n\nd = D()\nmro = [c.__name__ for c in D.__mro__ if c.__name__ != \"object\"]\nprint(\"MRO            :\", mro)\nprint(\"порядок order  :\", d.order)\nprint(\"A ровно один раз:\", d.order.count(\"A\") == 1)\nprint(\"order == reversed(MRO):\", d.order == list(reversed(mro)))\n\n# --- жёсткие вызовы: A дублируется ---\nlog = []\n\n\nclass Ax:\n    def __init__(self):\n        log.append(\"A\")\n\n\nclass Bx(Ax):\n    def __init__(self):\n        Ax.__init__(self)\n\n\nclass Cx(Ax):\n    def __init__(self):\n        Ax.__init__(self)\n\n\nclass Dx(Bx, Cx):\n    def __init__(self):\n        Bx.__init__(self)\n        Cx.__init__(self)\n\n\nlog.clear()\nDx()\nprint(\"жёсткие вызовы, A встретилась раз:\", log.count(\"A\"))\n```\n\nЗапуск печатает `MRO = ['D', 'B', 'C', 'A']`, `order = ['A', 'C', 'B', 'D']` (это `reversed(MRO)`), `A ровно один раз: True`, `order == reversed(MRO): True`. В жёстком варианте `log.count('A')` равен `2` — ромб задвоил общего предка. Вывод: кооперативный `super()` обходит каждый узел MRO ровно один раз, а `Base.method(self)` — нет.",
			answer: "С `super()`: `order == ['A','C','B','D']` = reversed MRO, `A` один раз. С `A.__init__(self)`: `A` выполняется дважды.",
			xp: 25
		},
		{
			id: 'oop-d4-t3',
			difficulty: "star",
			prompt: "Напишите миксин `OrderingMixin`, который из единственного метода `_key()` (его определяет наследник) автоматически даёт *все* операции сравнения и корректный `__hash__`. Используйте `functools.total_ordering`. Объясните в коде, почему `__hash__` обязан опираться на тот же `_key()`, что и `__eq__`, и подтвердите контракт `a == b ⇒ hash(a) == hash(b)`, положив равные объекты в `set`. Примените к классу `Version(major, minor)`.",
			hint: "`total_ordering` достраивает `<=`, `>`, `>=` из `__eq__` и `__lt__`. Контракт хеша: если `__eq__` сравнивает по `_key()`, то и `__hash__` должен быть `hash(self._key())`. Не забудьте вернуть `NotImplemented` при сравнении с чужим типом.",
			solution: "Один метод `_key()` — единственный источник истины и для сравнений, и для хеша. Это гарантирует согласованность контракта `__eq__`/`__hash__`.\n\n```python\nfrom functools import total_ordering\n\n\n@total_ordering\nclass OrderingMixin:\n    def _key(self):\n        raise NotImplementedError\n\n    def __eq__(self, other):\n        if not isinstance(other, OrderingMixin):\n            return NotImplemented\n        return self._key() == other._key()\n\n    def __lt__(self, other):\n        if not isinstance(other, OrderingMixin):\n            return NotImplemented\n        return self._key() < other._key()\n\n    def __hash__(self):\n        # a == b опирается на _key(), значит и hash обязан — иначе\n        # равные объекты получили бы разные хеши и сломали set/dict\n        return hash(self._key())\n\n\nclass Version(OrderingMixin):\n    def __init__(self, major, minor):\n        self.major, self.minor = major, minor\n\n    def _key(self):\n        return (self.major, self.minor)\n\n    def __repr__(self):\n        return f\"v{self.major}.{self.minor}\"\n\n\nvs = [Version(1, 2), Version(1, 10), Version(1, 2), Version(2, 0)]\nprint(\"сортировка:\", sorted(vs))            # из __lt__ + total_ordering\nprint(\"v1.2 >= v2.0:\", vs[0] >= vs[3])       # достроено автоматически\nprint(\"set схлопывает дубли:\", set(vs))      # контракт хеша работает\nprint(\"hash равных совпадает:\", hash(vs[0]) == hash(vs[2]))\n```\n\nЗапуск даёт `сортировка: [v1.2, v1.2, v1.10, v2.0]` (по кортежу `(major, minor)`, а не лексикографически), `v1.2 >= v2.0: False`, множество схлопывает дубль `v1.2`, а `hash(vs[0]) == hash(vs[2])` равно `True`. Если бы мы определили `__eq__` без согласованного `__hash__`, Python сделал бы класс нехешируемым — это и есть нарушение контракта.",
			answer: "`OrderingMixin` строит сравнения через `total_ordering` и `__hash__ = hash(self._key())`; равные `Version` имеют равный хеш, `set` схлопывает дубли — контракт `a==b ⇒ hash(a)==hash(b)` соблюдён.",
			xp: 25
		}
	],
	mastery: [
		"Различаю три режима наследования (использовать как есть / переопределить / расширить) и осознанно пишу расширяющий метод как `super()` + своё, в правильном порядке для `__init__`.",
		"Объясняю, почему `super()` предпочтительнее `Base.method(self)`: `super()` идёт по `__mro__` *экземпляра*, а не по статическому родителю, поэтому в ромбе общий предок вызывается ровно один раз.",
		"Воспроизвожу C3-линеаризацию руками (формула $L[C]=C+\\mathrm{merge}(\\dots)$, правило «голова не из хвоста») и сверяю результат с `Class.__mro__`; знаю три гарантии C3 и когда строится `TypeError`.",
		"Строю кооперативную ромбовидную иерархию с `**kwargs`, где каждый слой отрабатывает один раз, и читаю `__mro__` против `__bases__` без путаницы.",
		"Пишу миксины с одной ответственностью, опирающиеся на `type(self)`/контракт, а не на конкретный класс; при переопределении `__eq__` согласую `__hash__` и пользуюсь `isinstance`/`issubclass`/`__bases__` для интроспекции."
	]
};
