// Ленивая, но РАЗДЕЛЯЕМАЯ загрузка KaTeX. Модуль кэшируется на уровне приложения:
//  · loadKatex() — запускает импорт один раз (зовём на idle из layout, чтобы KaTeX
//    был готов ДО первого тултипа — тогда формулы рендерятся сразу, без рефлоу);
//  · katexNow() — синхронно отдаёт уже загруженный модуль (или null), чтобы новые
//    компоненты Katex рендерились мгновенно, без кадра «сырого» TeX.
// Так начальный бандл остаётся без KaTeX, но «мигания»/скачка высоты нет.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mod: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pending: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function katexNow(): any {
	return mod;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadKatex(): Promise<any> {
	if (mod) return Promise.resolve(mod);
	if (!pending) pending = import('katex').then((m) => (mod = m.default));
	return pending;
}
