// =====================================================================
//  Tooltip manager — the nested-graph engine (Paradox / Crusader Kings feel).
//  · hover a term  → ephemeral peek popover (after a short delay)
//  · keep holding  → it pins as a draggable card (timer)
//  · click a term  → pin instantly (also the touch path)
//  · terms inside cards are themselves hoverable/pinnable → nested graph
// =====================================================================

import type { Glossary, GlossaryTerm } from '$lib/types';

export interface Pin {
	key: number;
	id: string;
	x: number;
	y: number;
	z: number;
	parent?: string; // term id this card was spawned from
	seamless?: boolean; // повышен из peek в том же месте → без анимации появления
}

class TooltipManager {
	glossary = $state<Glossary>({});
	hover = $state<{ id: string; rect: DOMRect; key: number; parent?: string } | null>(null);
	pins = $state<Pin[]>([]);
	// DOM-элемент показанного peek — чтобы закрепить карточку РОВНО по его ЖИВОЙ
	// позиции на момент клика (после рендера KaTeX/рефлоу), а не по пересчёту.
	hoverEl: HTMLElement | null = null;

	#key = 0;
	#z = 100;
	#hideT: ReturnType<typeof setTimeout> | undefined;

	// Ad-hoc terms registered at runtime (e.g. by annotated code blocks) — resolved
	// by the same hover/pin cards as glossary terms, so code tooltips reuse the engine.
	adhoc = $state<Glossary>({});

	setGlossary(g: Glossary) {
		this.glossary = g ?? {};
		this.hover = null;
		this.pins = [];
	}

	registerAdhoc(term: GlossaryTerm) {
		if (!this.adhoc[term.id]) this.adhoc[term.id] = term;
	}

	has(id: string): boolean {
		return !!this.glossary[id] || !!this.adhoc[id];
	}
	get(id: string): GlossaryTerm | undefined {
		return this.glossary[id] ?? this.adhoc[id];
	}

	showHover(id: string, rect: DOMRect, parent?: string) {
		if (!this.has(id)) return;
		clearTimeout(this.#hideT);
		this.hover = { id, rect, key: ++this.#key, parent };
	}

	/** Закрепить текущий hover РОВНО по живой позиции peek — бесшовно (без анимации). */
	pinHovered() {
		const h = this.hover;
		if (!h) return;
		if (this.hoverEl) {
			const r = this.hoverEl.getBoundingClientRect();
			this.pinAt(h.id, r.left, r.top, h.parent, true);
		} else {
			this.pinFromRect(h.id, h.rect, h.parent);
		}
	}
	scheduleHide() {
		clearTimeout(this.#hideT);
		this.#hideT = setTimeout(() => (this.hover = null), 130);
	}
	cancelHide() {
		clearTimeout(this.#hideT);
	}

	pinAt(id: string, x: number, y: number, parent?: string, seamless = false) {
		if (!this.has(id)) return;
		const existing = this.pins.find((p) => p.id === id);
		if (existing) {
			this.front(existing.key);
			this.hover = null;
			return;
		}
		this.pins = [...this.pins, { key: ++this.#key, id, x, y, z: ++this.#z, parent, seamless }];
		this.hover = null;
	}
	pinFromRect(id: string, rect: DOMRect, parent?: string) {
		const W = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const H = typeof window !== 'undefined' ? window.innerHeight : 800;
		const x = Math.max(12, Math.min(rect.left, W - 372));
		// держим хотя бы шапку карточки во вьюпорте — не открываем за нижним краем
		const y = Math.max(12, Math.min(rect.bottom + 10, H - 160));
		this.pinAt(id, x, y, parent);
	}

	closePin(key: number) {
		this.pins = this.pins.filter((p) => p.key !== key);
	}
	front(key: number) {
		const z = ++this.#z;
		this.pins = this.pins.map((p) => (p.key === key ? { ...p, z } : p));
	}
	move(key: number, x: number, y: number) {
		this.pins = this.pins.map((p) => (p.key === key ? { ...p, x, y } : p));
	}
	closeAll() {
		this.pins = [];
		this.hover = null;
	}
}

export const tips = new TooltipManager();
