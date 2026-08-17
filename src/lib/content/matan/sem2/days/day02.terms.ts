import type { Glossary } from '$lib/types';

// Термины дня 2 (правила дифференцирования, теоремы 1–2 списка единиц).
// День должен резолвиться независимо, поэтому термины, введённые раньше или
// позже, при ссылке дублируются здесь намеренно:
//   proizvodnaya                — канонически день 1 (производная по определению);
//   gradient, chastnaya-proizvodnaya, proizvodnaya-po-napravleniyu
//                               — канонически дни 7–9 (скалярные поля), нужны
//                                 уже сегодня для двойника правила Лейбница.
// Термины сквозной нотации курса (end-r, skalyarnoe-pole, braket,
// asimptoticheskie-klassy, klassy-differenciruemosti, n-nol-n-odin) живут в
// каноническом глоссарии и здесь НЕ переобъявляются — только ссылки [[...]].
export const day02Terms: Glossary = {
	proizvodnaya: {
		id: 'proizvodnaya',
		term: 'Производная',
		short: String.raw`Предел разностного отношения $\Delta f/\Delta x$ при $\Delta x\to0$.`,
		formula: String.raw`f'(x_0)=\lim_{\Delta x\to0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}`,
		body: String.raw`**Производная** функции $f$ в точке $x_0$ — предел разностного отношения $\frac{\Delta f}{\Delta x}$ при $\Delta x\to0$. В курсе это «определение в матане», которое появляется **после** формальной производной полинома $d_xP=\sum k\,a_kx^{k-1}$: сначала дифференцирование задаётся алгебраически — [[lineynost-proizvodnoy|линейностью]] и [[pravilo-leybnica|тождеством Лейбница]], — и лишь затем отождествляется с пределом.

Дифференцируемость строго сильнее непрерывности: $f(x)=|x+2|$ непрерывна в $-2$, но односторонние пределы разностного отношения там равны $+1$ и $-1$. Обратное же верно всегда: дифференцируемость влечёт непрерывность — этим пользуются все выводы дня 2.`,
		related: ['operator-differencirovaniya', 'lineynost-proizvodnoy', 'pravilo-leybnica', 'end-r']
	},

	'operator-differencirovaniya': {
		id: 'operator-differencirovaniya',
		term: 'Оператор дифференцирования',
		short: String.raw`$\frac{d}{dx}$ как линейный оператор на $\operatorname{End}(\mathbb R)$.`,
		formula: String.raw`()'\equiv\frac{d}{dx},\qquad \frac{d}{dx}\cdot\frac{d}{dx}=\frac{d^{2}}{dx^{2}}`,
		body: String.raw`Преподаватель рассматривает $()'\equiv\frac{d}{dx}$ не как операцию, а как **оператор** на [[end-r|$\operatorname{End}(\mathbb R)$]]: композиция операторов даёт $\frac{d^{2}}{dx^{2}}$, а в базисе $1,x,x^{2},x^{3},x^{4}$ выписывается его матрица (единицы $1,2,3,4$ под диагональю).

Это язык линейной алгебры внутри матанализа: законность матричной записи обеспечена ровно [[lineynost-proizvodnoy|линейностью]] производной. Для отображений нормированных пространств оператор имеет сигнатуру $()':(H_1\to H_2)\to(H_1\to\mathbb R)$ — и именно её «неудачность» приводит курс к производной Фреше.`,
		related: ['proizvodnaya', 'lineynost-proizvodnoy', 'end-r', 'klassy-differenciruemosti']
	},

	'lineynost-proizvodnoy': {
		id: 'lineynost-proizvodnoy',
		term: 'Линейность производной',
		short: String.raw`$(f\pm g)'=f'\pm g'$ и $(\lambda f)'=\lambda f'$; плюс $C'=0$.`,
		formula: String.raw`(\lambda f+\mu g)'=\lambda f'+\mu g'`,
		body: String.raw`**Линейность** — аддитивность и однородность [[operator-differencirovaniya|оператора]] $\frac{d}{dx}$: $(f\pm g)'=f'\pm g'$, $(\lambda f)'=\lambda f'$, $C'=0$. Доказывается прямо из разностного отношения: приращение суммы распадается на сумму приращений, а постоянная выносится ещё до предела.

Существенное условие — существование **обеих** производных: теорема о пределе суммы неприменима, когда предел есть лишь у суммы (пример: $|x|$ и $-|x|$ в нуле). Линейность не влечёт [[pravilo-leybnica|правило Лейбница]] — это независимое тождество, и вместе они образуют алгебраическое определение дифференцирования.`,
		related: ['proizvodnaya', 'operator-differencirovaniya', 'pravilo-leybnica']
	},

	'pravilo-leybnica': {
		id: 'pravilo-leybnica',
		term: 'Правило Лейбница',
		short: String.raw`$(fg)'=f'g+fg'$ — теорема 1 списка семантических единиц.`,
		formula: String.raw`(f\cdot g)'=f'g+fg'`,
		body: String.raw`**Правило Лейбница** — тождество $(fg)'=f'g+fg'$. Вывод в курсе геометрический: произведение — площадь прямоугольника со сторонами $f$ и $g$, приращение площади состоит из двух полосок $\Delta f\cdot g$ и $f\cdot\Delta g$ и углового квадратика $\Delta f\cdot\Delta g$, который [[kvadratichno-maloe|квадратично мал]] и отбрасывается (в конспекте он заштрихован красным и зачёркнут).

Преподаватель считает это правило одним из трёх равноправных «входов» в понятие производной — наряду с пределом $\frac{\Delta f}{\Delta x}$ и геометрией. Отсюда [[proizvodnaya-chastnogo|производная частного]] и [[obshchaya-formula-leybnica|формула для $n$-й производной]]; двойник для полей — [[pravilo-leybnica-pole|$\nabla(uv)=v\nabla u+u\nabla v$]].`,
		related: ['kvadratichno-maloe', 'proizvodnaya-chastnogo', 'obshchaya-formula-leybnica', 'pravilo-leybnica-pole']
	},

	'kvadratichno-maloe': {
		id: 'kvadratichno-maloe',
		term: 'Квадратично малое',
		short: String.raw`Член $\Delta f\cdot\Delta g$: гаснет даже после деления на $\Delta x$.`,
		formula: String.raw`\frac{\Delta f\,\Delta g}{\Delta x}\xrightarrow[\Delta x\to0]{}f'(x_0)\cdot 0=0`,
		body: String.raw`**Квадратично малым** в конспекте назван угловой член $\Delta f\cdot\Delta g$ в выводе [[pravilo-leybnica|правила Лейбница]]: это «прирост на прирост», произведение двух бесконечно малых. Ключ в том, что он остаётся малым и **после** деления на $\Delta x$: $\frac{\Delta f}{\Delta x}\cdot\Delta g\to f'(x_0)\cdot0=0$, то есть $\Delta f\,\Delta g\in\bar o(\Delta x)$ (см. [[asimptoticheskie-klassy|асимптотические классы]]).

Уменьшите $\Delta x$ вдвое — полоски похудеют вдвое, угол в четыре раза. Тот же механизм отбрасывания $\bar o$ возвращается в производной Фреше, где добавка $A(\Delta h)\in\bar o$ выписывается явной буквой.`,
		related: ['pravilo-leybnica', 'asimptoticheskie-klassy', 'proizvodnaya']
	},

	'proizvodnaya-chastnogo': {
		id: 'proizvodnaya-chastnogo',
		term: 'Производная частного',
		short: String.raw`$(f/g)'=(f'g-fg')/g^{2}$ при $g\ne0$.`,
		formula: String.raw`\Bigl(\frac fg\Bigr)'=\frac{f'g-fg'}{g^{2}},\qquad g\ne0`,
		body: String.raw`**Производная частного** — не самостоятельная аксиома, а следствие двух шагов. Сначала прямо по определению получают $\left(\frac1g\right)'=-\frac{g'}{g^{2}}$ (знаменатель разностного отношения стремится к $g^{2}(x_0)\ne0$ по непрерывности), затем к $\frac fg=f\cdot\frac1g$ применяют [[pravilo-leybnica|правило Лейбница]].

Порядок в числителе запоминается по знаку: производная знаменателя входит со знаком минус. Отсюда табличные $(\tan x)'=\frac{1}{\cos^{2}x}$ и $(\cot x)'=-\frac{1}{\sin^{2}x}$ — в этом курсе таблица производных выводится, а не заучивается.`,
		related: ['pravilo-leybnica', 'cepnoe-pravilo', 'proizvodnaya']
	},

	'obshchaya-formula-leybnica': {
		id: 'obshchaya-formula-leybnica',
		term: 'Общая формула Лейбница',
		short: String.raw`$n$-я производная произведения как бином Ньютона.`,
		formula: String.raw`(fg)^{(n)}=\sum_{k=0}^{n}\binom nk f^{(k)}g^{(n-k)}`,
		body: String.raw`**Общая формула Лейбница** распространяет $(fg)'=f'g+fg'$ на порядок $n$: $(fg)^{(n)}=\sum_{k=0}^{n}\binom nk f^{(k)}g^{(n-k)}$ для $f,g$ класса [[klassy-differenciruemosti|$C^{n}$]]. Доказывается индукцией: индукционный шаг — почленное дифференцирование по [[pravilo-leybnica|правилу Лейбница]], сдвиг индекса в одной из двух сумм и правило Паскаля $\binom{n}{k-1}+\binom nk=\binom{n+1}{k}$.

Структурно это бином Ньютона, у которого показатели степеней заменены порядками производных. Работает там, где одна из функций обрывается: например $\left(x^{2}e^{x}\right)^{(n)}=e^{x}\bigl(x^{2}+2nx+n(n-1)\bigr)$.`,
		related: ['pravilo-leybnica', 'klassy-differenciruemosti', 'lineynost-proizvodnoy']
	},

	'pravilo-leybnica-pole': {
		id: 'pravilo-leybnica-pole',
		term: 'Правило Лейбница в скалярных полях',
		short: String.raw`$\nabla(uv)=v\nabla u+u\nabla v$ — теорема 2 списка единиц.`,
		formula: String.raw`\nabla(uv)=v\,\nabla u+u\,\nabla v`,
		body: String.raw`Двойник [[pravilo-leybnica|правила Лейбница]] для [[skalyarnoe-pole|скалярных полей]] $u,v:\mathbb R^{n}\to\mathbb R$: $\nabla(uv)=v\nabla u+u\nabla v$, покомпонентно $\frac{\partial(uv)}{\partial x_i}=v\frac{\partial u}{\partial x_i}+u\frac{\partial v}{\partial x_i}$.

Доказательство ничего нового не требует: [[chastnaya-proizvodnaya|частная производная]] — это производная функции одной переменной при замороженных остальных координатах, значит одномерное правило применимо покомпонентно, а компоненты собираются в [[gradient|градиент]]. Свёртка с направлением даёт $(uv)'_{\vec l}=v\,u'_{\vec l}+u\,v'_{\vec l}$. Пара «в $\operatorname{End}(\mathbb R)$ / в скалярных полях» — сквозной приём курса: так же дублируются теоремы Ферма, Ролля и формула Тейлора.`,
		related: ['pravilo-leybnica', 'gradient', 'chastnaya-proizvodnaya', 'skalyarnoe-pole']
	},

	'cepnoe-pravilo': {
		id: 'cepnoe-pravilo',
		term: 'Цепное правило (производная сложной функции)',
		short: String.raw`$\bigl(g(f(x))\bigr)'_x=g'_f\cdot f'_x$.`,
		formula: String.raw`\bigl(g(f(x))\bigr)'_x=g'_f\cdot f'_x`,
		body: String.raw`**Цепное правило** — производная суперпозиции: $\bigl(g(f(x))\bigr)'_x=g'_f\cdot f'_x$, где $g'_f$ — производная внешней функции **по её собственному аргументу**. Вывод в конспекте: разностное отношение умножают и делят на $\Delta f$, получая $\frac{\Delta y}{\Delta f}\cdot\frac{\Delta f}{\Delta x}$, и пользуются тем, что $\Delta f\to0$.

Оговорка, которой в конспекте нет: при $\Delta f=0$ деление незаконно; чинится доопределением $\varphi(0)=g'_f$. Из цепного правила немедленно следует производная обратной функции ($g'_f=1/f'_x$ из тождества $g(f(x))=x$) и [[logarifmicheskoe-differencirovanie|логарифмическое дифференцирование]].`,
		related: ['proizvodnaya', 'logarifmicheskoe-differencirovanie', 'proizvodnaya-chastnogo']
	},

	'logarifmicheskoe-differencirovanie': {
		id: 'logarifmicheskoe-differencirovanie',
		term: 'Логарифмическое дифференцирование',
		short: String.raw`Приём для $f(x)^{g(x)}$: логарифмируем, потом дифференцируем.`,
		formula: String.raw`\bigl(f^{g}\bigr)'=f^{g}\Bigl(g'\ln f+\frac{gf'}{f}\Bigr)`,
		body: String.raw`Для $y=f(x)^{g(x)}$ при $f>0$ не годятся ни $(x^{\alpha})'$, ни $(a^{x})'$: переменны и основание, и показатель. **Логарифмическое дифференцирование** снимает проблему: из $\ln y=g\ln f$ дифференцированием обеих частей (слева — [[cepnoe-pravilo|цепное правило]], справа — [[pravilo-leybnica|правило Лейбница]]) получаем $\frac{y'}{y}=g'\ln f+\frac{gf'}{f}$.

Величина $\frac{y'}{y}=(\ln y)'$ — относительная скорость роста; в этих терминах правило Лейбница превращается в сложение: $\frac{(fg)'}{fg}=\frac{f'}{f}+\frac{g'}{g}$. Отрабатывается в ДЗ к ПР1 № 2: $(\sin x)^{\cos x}$, $(\ln x)^{x}$, $\left(1+\frac1x\right)^{x}$, $(\tan x)^{\sin x}$, $x^{\ln x}$.`,
		related: ['cepnoe-pravilo', 'pravilo-leybnica', 'proizvodnaya']
	},

	'zamena-nabla-x': {
		id: 'zamena-nabla-x',
		term: 'Замена ∇x = 1/Δx',
		short: String.raw`Приём конспекта: предел в нуле сводится к пределу на бесконечности.`,
		formula: String.raw`\nabla x=\frac{1}{\Delta x}:\qquad \Delta x\to0\iff \nabla x\to\infty`,
		body: String.raw`Вспомогательная замена преподавателя: $\nabla x=\frac{1}{\Delta x}$, так что $\Delta x\to0$ равносильно $\nabla x\to\infty$. Пример из конспекта: $\lim\limits_{\Delta x\to0}\frac{(\Delta x)^{2}+\Delta x}{\Delta x}=\lim\limits_{\nabla x\to\infty}\frac{1+\nabla x}{\nabla x}=1$, причём член $\frac{1}{\nabla x}$ обведён как принадлежащий $\bar o$.

Смысл — перевести выкладку на язык [[asimptoticheskie-klassy|асимптотических классов]], определённых в курсе на бесконечности. Приём законен, но нестандартен: учебник сократил бы дробь сразу. ⚠️ Значок $\nabla$ здесь — не [[gradient|градиент]]: во втором семестре он работает в двух разных смыслах.`,
		related: ['asimptoticheskie-klassy', 'proizvodnaya', 'gradient']
	},

	gradient: {
		id: 'gradient',
		term: 'Градиент',
		short: String.raw`Вектор частных производных скалярного поля.`,
		formula: String.raw`\nabla f=\Bigl(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\Bigr)`,
		body: String.raw`**Градиент** [[skalyarnoe-pole|скалярного поля]] — вектор, составленный из всех [[chastnaya-proizvodnaya|частных производных]]: $\nabla f=\left(\frac{\partial f}{\partial x_1},\dots,\frac{\partial f}{\partial x_n}\right)$. Через него выражается [[proizvodnaya-po-napravleniyu|производная по направлению]]: $f'_{\vec l}=\langle\vec\nabla f\mid\vec l\,\rangle$ в [[braket|bra-ket-записи]].

Все правила дифференцирования переносятся на градиент покомпонентно — отсюда [[pravilo-leybnica-pole|$\nabla(uv)=v\nabla u+u\nabla v$]]. Подробно — в фазе скалярных полей (дни 7–12); здесь градиент нужен, чтобы сразу выписать многомерного двойника правила Лейбница.`,
		related: ['chastnaya-proizvodnaya', 'proizvodnaya-po-napravleniyu', 'skalyarnoe-pole', 'pravilo-leybnica-pole']
	},

	'chastnaya-proizvodnaya': {
		id: 'chastnaya-proizvodnaya',
		term: 'Частная производная',
		short: String.raw`Производная по одной координате при замороженных остальных.`,
		formula: String.raw`\frac{\partial f(x_1\dots x_n)}{\partial x_i}`,
		body: String.raw`**Частная производная** $\frac{\partial f}{\partial x_i}$ — обычная [[proizvodnaya|производная]] функции одной переменной $t\mapsto f(x_1,\dots,t,\dots,x_n)$, полученной замораживанием всех координат, кроме $i$-й. В нотации курса $\frac{df}{dx}$ относится к ФОП, а $\frac{\partial f}{\partial x}$ — к ФНП.

Именно «заморозка» переносит все одномерные правила в многомерный случай без новых доказательств: покомпонентно верны и линейность, и [[pravilo-leybnica-pole|правило Лейбница]]. Собранные в вектор, частные производные дают [[gradient|градиент]].`,
		related: ['gradient', 'proizvodnaya', 'skalyarnoe-pole', 'pravilo-leybnica-pole']
	},

	'proizvodnaya-po-napravleniyu': {
		id: 'proizvodnaya-po-napravleniyu',
		term: 'Производная по направлению',
		short: String.raw`Скорость изменения поля вдоль вектора $\vec l$.`,
		formula: String.raw`f'_{\vec l}(x)=\langle\vec\nabla f\mid\vec l\,\rangle`,
		body: String.raw`**Производная по направлению** $f'_{\vec l}$ — скорость изменения [[skalyarnoe-pole|скалярного поля]] вдоль вектора $\vec l$; в курсе она сразу задаётся свёрткой с [[gradient|градиентом]] в [[braket|bra-ket-записи]]: $f'_{\vec l}=\langle\vec\nabla f\mid\vec l\,\rangle$ (геометрически — проекция градиента на направление).

Линейность скалярного произведения по первому аргументу означает, что любое тождество для градиента автоматически верно и для производной по направлению: из [[pravilo-leybnica-pole|$\nabla(uv)=v\nabla u+u\nabla v$]] сразу следует $(uv)'_{\vec l}=v\,u'_{\vec l}+u\,v'_{\vec l}$. Подробно — дни 7–12.`,
		related: ['gradient', 'braket', 'pravilo-leybnica-pole', 'skalyarnoe-pole']
	}
};
