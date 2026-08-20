import type { Glossary } from '$lib/types';

// Термины дня 9 (производная Гато и иерархия дифференцируемости).
export const day09Terms: Glossary = {
	'proizvodnaya-gato': {
		id: 'proizvodnaya-gato',
		term: 'Производная Гато',
		short: String.raw`Предел приращения вдоль прямой, делённого на скаляр $t$.`,
		formula: String.raw`dF(\vec x,\vec h)=\lim_{t\to0}\frac{F(\vec x+t\vec h)-F(\vec x)}{t}`,
		body: String.raw`Производная сужения отображения на прямую $\vec x+t\vec h$, взятая в нуле. Делится на **скаляр** $t$, а не на норму приращения, поэтому объект помнит направление. По $\vec h$ всегда [[odnorodnost|однородна]] первой степени, но [[additivnost|аддитивной]] быть не обязана.`,
		related: ['odnorodnost', 'additivnost', 'proizvodnaya-freshe']
	},

	'slabaya-proizvodnaya': {
		id: 'slabaya-proizvodnaya',
		term: 'Слабая производная',
		short: String.raw`Второе имя производной Гато; сильная — производная Фреше.`,
		body: String.raw`Второе название [[proizvodnaya-gato|производной Гато]] в паре «слабая — сильная». Слабость буквальна: условие накладывается отдельно на каждый луч из точки и ничего не говорит о поведении между лучами.`,
		related: ['proizvodnaya-gato', 'proizvodnaya-freshe']
	},

	additivnost: {
		id: 'additivnost',
		term: 'Аддитивность',
		short: String.raw`$F(\vec h_1+\vec h_2)=F(\vec h_1)+F(\vec h_2)$ — половина линейности.`,
		formula: String.raw`A(\vec h_1+\vec h_2)=A\vec h_1+A\vec h_2`,
		body: String.raw`Свойство сохранять сумму. Вместе с [[odnorodnost|однородностью]] составляет [[lineynost|линейность]]; по отдельности ни одно из них линейности не даёт.`,
		related: ['lineynost', 'odnorodnost']
	},

	'cepnoe-pravilo-pole': {
		id: 'cepnoe-pravilo-pole',
		term: 'Цепное правило вдоль кривой',
		short: String.raw`$(f\circ\vec\gamma)'=\langle\nabla f\mid\vec\gamma\,'\rangle$.`,
		formula: String.raw`\bigl(f\circ\vec\gamma\bigr)'(t_0)=\bigl\langle\nabla f(\vec\gamma(t_0))\ \big|\ \vec\gamma\,'(t_0)\bigr\rangle`,
		body: String.raw`Если [[skalyarnoe-pole|поле]] дифференцируемо в точке кривой, а сама кривая дифференцируема по параметру, то производная сужения поля на кривую равна скалярному произведению [[gradient|градиента]] на вектор скорости.`,
		related: ['gradient', 'cepnoe-pravilo', 'braket']
	},

	'ierarhiya-differenciruemosti': {
		id: 'ierarhiya-differenciruemosti',
		term: 'Иерархия дифференцируемости',
		short: String.raw`Фреше ⟹ Гато ⟹ все направления ⟹ частные; все импликации строгие.`,
		formula: String.raw`\text{Фреше}\Rightarrow\text{Гато}\Rightarrow\exists f'_{\vec l}\ \forall\vec l\Rightarrow\exists\tfrac{\partial f}{\partial x_i}\ \forall i`,
		body: String.raw`Четыре условия дифференцируемости поля, упорядоченные по силе: [[proizvodnaya-freshe|Фреше]], [[proizvodnaya-gato|Гато]], существование [[proizvodnaya-po-napravleniyu|производных по всем направлениям]], существование [[chastnaya-proizvodnaya|частных производных]]. Ни одна из импликаций не обращается.`,
		related: ['proizvodnaya-freshe', 'proizvodnaya-gato', 'chastnaya-proizvodnaya']
	},

	'dostatochnoe-uslovie-differenciruemosti': {
		id: 'dostatochnoe-uslovie-differenciruemosti',
		term: 'Достаточное условие дифференцируемости',
		short: String.raw`Частные есть в окрестности и непрерывны в точке — значит, есть и Фреше.`,
		formula: String.raw`\exists f'_{x_i}\ \text{в}\ U(\vec x_0),\quad f'_{x_i}\in C(\vec x_0)\ \Rightarrow\ \exists f'(\vec x_0)\ \text{по Фреше}`,
		body: String.raw`Если все [[chastnaya-proizvodnaya|частные производные]] существуют в [[okrestnost|окрестности]] точки и непрерывны в самой точке, то поле [[proizvodnaya-freshe|дифференцируемо по Фреше]] в ней. Это [[priznak-i-svoystvo|признак]], а не критерий.`,
		related: ['chastnaya-proizvodnaya', 'proizvodnaya-freshe', 'priznak-i-svoystvo']
	},

	'nepreryvno-differenciruemaya': {
		id: 'nepreryvno-differenciruemaya',
		term: 'Непрерывно дифференцируемая функция',
		short: String.raw`Класс $C^1(U)$: частные производные существуют и непрерывны на всём $U$.`,
		formula: String.raw`f\in C^1(U)\iff \exists\frac{\partial f}{\partial x_i}\ \text{на}\ U\ \wedge\ \frac{\partial f}{\partial x_i}\in C(U)`,
		body: String.raw`Функция принадлежит классу $C^1(U)$, если на $U$ существуют все её [[chastnaya-proizvodnaya|частные производные]] и все они непрерывны. Класс продолжается рекурсивно: $f\in C^n$, если каждая частная производная лежит в $C^{n-1}$.`,
		related: ['klassy-differenciruemosti', 'chastnaya-proizvodnaya', 'nepreryvnost']
	},

	'parametrizatsiya-otrezka': {
		id: 'parametrizatsiya-otrezka',
		term: 'Параметризация отрезка',
		short: String.raw`$S(t)=\vec a+t(\vec b-\vec a)$, $t\in[0;1]$.`,
		formula: String.raw`S(t)=\vec a+t(\vec b-\vec a),\qquad S(0)=\vec a,\ S(1)=\vec b`,
		body: String.raw`Запись отрезка между двумя точками как образа промежутка $[0;1]$. Подстановка $\varphi(t)=f(S(t))$ превращает [[skalyarnoe-pole|поле]] в функцию одной переменной.`,
		related: ['skalyarnoe-pole', 'promezhutok', 'vypukloe-mnozhestvo']
	}
};
