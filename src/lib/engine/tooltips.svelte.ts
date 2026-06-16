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
}

class TooltipManager {
	glossary = $state<Glossary>({});
	hover = $state<{ id: string; rect: DOMRect; key: number } | null>(null);
	pins = $state<Pin[]>([]);

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

	showHover(id: string, rect: DOMRect) {
		if (!this.has(id)) return;
		clearTimeout(this.#hideT);
		this.hover = { id, rect, key: ++this.#key };
	}
	scheduleHide() {
		clearTimeout(this.#hideT);
		this.#hideT = setTimeout(() => (this.hover = null), 130);
	}
	cancelHide() {
		clearTimeout(this.#hideT);
	}

	pinAt(id: string, x: number, y: number, parent?: string) {
		if (!this.has(id)) return;
		const existing = this.pins.find((p) => p.id === id);
		if (existing) {
			this.front(existing.key);
			this.hover = null;
			return;
		}
		this.pins = [...this.pins, { key: ++this.#key, id, x, y, z: ++this.#z, parent }];
		this.hover = null;
	}
	pinFromRect(id: string, rect: DOMRect, parent?: string) {
		const W = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const x = Math.max(12, Math.min(rect.left, W - 372));
		const y = rect.bottom + 10;
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
