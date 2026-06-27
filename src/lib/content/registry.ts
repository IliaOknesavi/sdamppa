// =====================================================================
//  Реестр ленивых загрузчиков тел предметов. Vite режет каждый предмет в
//  отдельный чанк — роут грузит ТОЛЬКО нужный предмет (а не весь барель
//  $lib/content со всеми предметами). Добавить предмет: импорт-стрелка сюда.
// =====================================================================
import type { Subject } from '$lib/types';

export const subjectLoaders: Record<string, () => Promise<Subject>> = {
	statistics: () => import('./statistics').then((m) => m.statistics),
	algorithms: () => import('./algorithms').then((m) => m.algorithms),
	chma: () => import('./chma').then((m) => m.chma),
	matan: () => import('./matan').then((m) => m.matan),
	pytorch: () => import('./pytorch').then((m) => m.pytorch),
	oop: () => import('./oop').then((m) => m.oop)
};

/** Загрузить тело предмета по id (или undefined, если такого нет). */
export function loadSubject(id: string): Promise<Subject> | undefined {
	return subjectLoaders[id]?.();
}
