import type { Glossary } from '$lib/types';

// Термины дня 2 (правила дифференцирования).
export const day02Terms: Glossary = {
	'lineynost-proizvodnoy': {
		id: 'lineynost-proizvodnoy',
		term: 'Линейность производной',
		short: String.raw`$(\lambda f+\mu g)'=\lambda f'+\mu g'$.`,
		formula: String.raw`(\lambda f+\mu g)'=\lambda f'+\mu g'`,
		body: String.raw`Дифференцирование [[lineynost|линейно]]: $(f\pm g)'=f'\pm g'$ и $(\lambda f)'=\lambda f'$, в частности $C'=0$. Тождество требует существования **обеих** производных: у суммы производная может быть и тогда, когда у слагаемых её нет.`,
		related: ['lineynost', 'proizvodnaya', 'pravilo-leybnica']
	},

	'pravilo-leybnica': {
		id: 'pravilo-leybnica',
		term: 'Правило Лейбница',
		short: String.raw`$(fg)'=f'g+fg'$ — производная произведения.`,
		formula: String.raw`(f\cdot g)'=f'\,g+f\,g'`,
		body: String.raw`Если $f$ и $g$ [[differenciruemost|дифференцируемы]] в точке, то их произведение дифференцируемо в ней и $(fg)'=f'g+fg'$. Из [[lineynost-proizvodnoy|линейности]] это не выводится: $(x\cdot x)'=2x$, а $x'\cdot x'=1$.`,
		related: ['proizvodnaya', 'lineynost-proizvodnoy', 'differenciruemost']
	},

	'kvadratichno-maloe': {
		id: 'kvadratichno-maloe',
		term: 'Квадратично малое',
		short: String.raw`Произведение двух приращений: гаснет даже после деления на $\Delta x$.`,
		formula: String.raw`\frac{\Delta f\,\Delta g}{\Delta x}\xrightarrow[\Delta x\to0]{}f'(x_0)\cdot 0=0`,
		body: String.raw`**Квадратично малым** называют произведение двух приращений $\Delta f\cdot\Delta g$ — «прирост на прирост». Отличает его от обычного бесконечно малого то, что он остаётся малым и после деления на $\Delta x$, то есть принадлежит [[asimptoticheskie-klassy|$\bar o(\Delta x)$]].`,
		related: ['asimptoticheskie-klassy', 'pravilo-leybnica']
	},

	'proizvodnaya-chastnogo': {
		id: 'proizvodnaya-chastnogo',
		term: 'Производная частного',
		short: String.raw`$(f/g)'=(f'g-fg')/g^{2}$ при $g\ne0$.`,
		formula: String.raw`\Bigl(\frac fg\Bigr)'=\frac{f'g-fg'}{g^{2}},\qquad g\ne0`,
		body: String.raw`Если $f,g$ [[differenciruemost|дифференцируемы]] в точке и $g$ там не обращается в нуль, то $\left(\frac fg\right)'=\frac{f'g-fg'}{g^{2}}$. Знак минус стоит при производной знаменателя — этим порядок в числителе и запоминается.`,
		related: ['pravilo-leybnica', 'proizvodnaya', 'differenciruemost']
	},

	'obshchaya-formula-leybnica': {
		id: 'obshchaya-formula-leybnica',
		term: 'Общая формула Лейбница',
		short: String.raw`$n$-я производная произведения устроена как бином Ньютона.`,
		formula: String.raw`(fg)^{(n)}=\sum_{k=0}^{n}\binom nk f^{(k)}g^{(n-k)}`,
		body: String.raw`Для $f,g$ класса [[klassy-differenciruemosti|$C^{n}$]] верно $(fg)^{(n)}=\sum_{k=0}^{n}\binom nk f^{(k)}g^{(n-k)}$. Это [[pravilo-leybnica|правило Лейбница]], продолженное на порядок $n$: биномиальные коэффициенты те же, а степени заменены порядками производных.`,
		related: ['pravilo-leybnica', 'klassy-differenciruemosti']
	},

	'pravilo-leybnica-pole': {
		id: 'pravilo-leybnica-pole',
		term: 'Правило Лейбница для скалярных полей',
		short: String.raw`$\nabla(uv)=v\nabla u+u\nabla v$.`,
		formula: String.raw`\nabla(uv)=v\,\nabla u+u\,\nabla v`,
		body: String.raw`Для дифференцируемых [[skalyarnoe-pole|скалярных полей]] $u,v:\mathbb R^{n}\to\mathbb R$ выполнено $\nabla(uv)=v\nabla u+u\nabla v$, то есть по каждой координате — обычное [[pravilo-leybnica|правило Лейбница]].`,
		related: ['pravilo-leybnica', 'gradient', 'skalyarnoe-pole']
	},

	'cepnoe-pravilo': {
		id: 'cepnoe-pravilo',
		term: 'Цепное правило',
		short: String.raw`$\bigl(g(f(x))\bigr)'_x=g'_f\cdot f'_x$.`,
		formula: String.raw`\bigl(g(f(x))\bigr)'_x=g'_f\cdot f'_x`,
		body: String.raw`Производная [[kompoziciya|композиции]] равна произведению производных: $\bigl(g(f(x))\bigr)'_x=g'_f\cdot f'_x$, где $g'_f$ берётся по собственному аргументу внешней функции и вычисляется в точке $f(x)$.`,
		related: ['kompoziciya', 'proizvodnaya', 'proizvodnaya-chastnogo']
	},

	'logarifmicheskoe-differencirovanie': {
		id: 'logarifmicheskoe-differencirovanie',
		term: 'Логарифмическое дифференцирование',
		short: String.raw`Приём для $f(x)^{g(x)}$: логарифмируем, потом дифференцируем.`,
		formula: String.raw`\bigl(f^{g}\bigr)'=f^{g}\Bigl(g'\ln f+\frac{gf'}{f}\Bigr)`,
		body: String.raw`Приём для выражений, где переменны и основание, и показатель: обе части $\ln y=g\ln f$ дифференцируют, получая $\frac{y'}{y}=g'\ln f+\frac{gf'}{f}$, и умножают на $y$. Требуется $f>0$, иначе логарифм не определён.`,
		related: ['cepnoe-pravilo', 'pravilo-leybnica']
	},

	'zamena-nabla-x': {
		id: 'zamena-nabla-x',
		term: 'Замена $\\nabla x=1/\\Delta x$',
		short: String.raw`Переводит предел в нуле в предел на бесконечности.`,
		formula: String.raw`\nabla x=\frac{1}{\Delta x}:\qquad \Delta x\to0\iff \nabla x\to\infty`,
		body: String.raw`Подстановка $\nabla x=\frac1{\Delta x}$ превращает $\Delta x\to0$ в $\nabla x\to\infty$. Нужна она затем, что [[asimptoticheskie-klassy|асимптотические классы]] определены через поведение на бесконечности.`,
		related: ['asimptoticheskie-klassy', 'predel-funkcii']
	}
};
