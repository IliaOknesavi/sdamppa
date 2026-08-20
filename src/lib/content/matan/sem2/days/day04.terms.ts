import type { Glossary } from '$lib/types';

// Термины дня 4 (экстремумы и теорема Ферма).
export const day04Terms: Glossary = {
	'lokalnyy-ekstremum': {
		id: 'lokalnyy-ekstremum',
		term: 'Локальный экстремум',
		short: String.raw`Общее слово для точки локального максимума и локального минимума.`,
		formula: String.raw`\exists\,U_{x_0}:\ \forall x\in U_{x_0}\ \ f(x)\ge f(x_0)\quad\text{(минимум)}`,
		body: String.raw`Общее название для [[tochka-maksimuma|точки максимума]] и [[tochka-minimuma|точки минимума]]. Сравнение идёт только с [[okrestnost|окрестностью]] точки, поэтому экстремум локален: значения вне окрестности могут быть какими угодно.`,
		related: ['tochka-maksimuma', 'tochka-minimuma', 'okrestnost']
	},

	'tochka-maksimuma': {
		id: 'tochka-maksimuma',
		term: 'Точка локального максимума',
		short: String.raw`Есть окрестность, в которой $f(x)\le f(x_0)$.`,
		formula: String.raw`\exists\,U_{x_0}:\ \forall x\in U_{x_0}\ \ f(x)\le f(x_0)`,
		body: String.raw`Точка $x_0$, у которой найдётся [[okrestnost|окрестность]], где всюду $f(x)\le f(x_0)$. Это не то же самое, что точка наибольшего значения: точек локального максимума бывает много, а наибольшего значения может не быть вовсе.`,
		related: ['tochka-minimuma', 'lokalnyy-ekstremum', 'okrestnost']
	},

	'tochka-minimuma': {
		id: 'tochka-minimuma',
		term: 'Точка локального минимума',
		short: String.raw`Есть окрестность, в которой $f(x)\ge f(x_0)$.`,
		formula: String.raw`\exists\,U_{x_0}:\ \forall x\in U_{x_0}\ \ f(x)\ge f(x_0)`,
		body: String.raw`Точка $x_0$, у которой найдётся [[okrestnost|окрестность]], где всюду $f(x)\ge f(x_0)$. Производной в такой точке может и не быть: у $|x+2|$ минимум в $-2$, а [[odnostoronnyaya-proizvodnaya|односторонние производные]] там $+1$ и $-1$.`,
		related: ['tochka-maksimuma', 'lokalnyy-ekstremum', 'okrestnost']
	},

	'stacionarnaya-tochka': {
		id: 'stacionarnaya-tochka',
		term: 'Стационарная точка',
		short: String.raw`Производная существует и равна нулю.`,
		formula: String.raw`f'(x_0)=0;\qquad \vec\nabla f(\vec x_0)=\bar 0\ \ \text{(в скалярном поле)}`,
		body: String.raw`Точка, в которой [[proizvodnaya|производная]] существует и равна нулю; для [[skalyarnoe-pole|скалярного поля]] — точка с нулевым [[gradient|градиентом]]. Экстремумом быть не обязана: у $x^3$ нуль стационарен, но не экстремум.`,
		related: ['proizvodnaya', 'kriticheskaya-tochka', 'gradient']
	},

	'kriticheskaya-tochka': {
		id: 'kriticheskaya-tochka',
		term: 'Критическая точка',
		short: String.raw`Производная равна нулю или не существует.`,
		formula: String.raw`f'(x_0)=0\ \ \text{или}\ \ \nexists\,f'(x_0)`,
		body: String.raw`Точка, где [[proizvodnaya|производная]] либо равна нулю, либо не существует. Всякая [[stacionarnaya-tochka|стационарная]] точка критическая; обратное неверно — у $|x+2|$ точка $-2$ критическая, но не стационарная.`,
		related: ['stacionarnaya-tochka', 'odnostoronnyaya-proizvodnaya']
	},

	'teorema-ferma': {
		id: 'teorema-ferma',
		term: 'Теорема Ферма',
		short: String.raw`Во внутренней точке экстремума производная равна нулю.`,
		formula: String.raw`x_0\in\operatorname{In}D(f),\ x_0-\text{л.\,э.},\ \exists f'(x_0)\ \Rightarrow\ f'(x_0)=0`,
		body: String.raw`Если $x_0$ — [[vnutrennyaya-tochka|внутренняя точка]] области определения, в ней [[lokalnyy-ekstremum|локальный экстремум]] и существует $f'(x_0)$, то $f'(x_0)=0$. Это [[priznak-i-svoystvo|свойство]] экстремума, а не признак: обратное неверно.`,
		related: ['lokalnyy-ekstremum', 'stacionarnaya-tochka', 'vnutrennyaya-tochka', 'priznak-i-svoystvo']
	},

	kontrapoziciya: {
		id: 'kontrapoziciya',
		term: 'Контрапозиция',
		short: String.raw`$A\Rightarrow B$ равносильно «не $B$ влечёт не $A$».`,
		formula: String.raw`(A\Rightarrow B)\iff(\overline B\Rightarrow\overline A)`,
		body: String.raw`**Контрапозиция** импликации $A\Rightarrow B$ — импликация $\overline B\Rightarrow\overline A$. Она равносильна исходной, поэтому доказывать можно любую из двух. С обратной импликацией $B\Rightarrow A$ путать нельзя: та в общем случае ложна. Отрицание составных высказываний берётся по [[otricanie-predikata|правилу отрицания предиката]].`,
		related: ['otricanie-predikata', 'predikat', 'priznak-i-svoystvo']
	},

	'teorema-ferma-pole': {
		id: 'teorema-ferma-pole',
		term: 'Теорема Ферма для скалярного поля',
		short: String.raw`Во внутренней точке экстремума градиент равен нулю.`,
		formula: String.raw`\vec x_0-\text{л.\,э.},\ \vec x_0\in\operatorname{In}D\ \Rightarrow\ \vec\nabla f(\vec x_0)=\bar 0`,
		body: String.raw`Если во [[vnutrennyaya-tochka|внутренней точке]] области у [[skalyarnoe-pole|скалярного поля]] локальный экстремум и все [[chastnaya-proizvodnaya|частные производные]] в ней существуют, то [[gradient|градиент]] в этой точке нулевой.`,
		related: ['teorema-ferma', 'gradient', 'skalyarnoe-pole', 'chastnaya-proizvodnaya']
	}
};
