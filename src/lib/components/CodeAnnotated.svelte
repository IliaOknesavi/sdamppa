<script lang="ts">
	import type { AnnotatedCode, CodeNote } from '$lib/types';
	import { tips } from '$lib/engine/tooltips.svelte';

	let { data }: { data: AnnotatedCode } = $props();

	let _seq = 0;
	// register each note as an ad-hoc glossary term → reuses the engine's hover/pin cards
	const noted = data.notes.map((n) => {
		const id = 'cn:' + _seq++ + ':' + n.token.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
		tips.registerAdhoc({
			id,
			term: n.title,
			short: n.kind === 'syntax' ? 'C-синтаксис' : 'алгоритм / асимптотика',
			formula: n.complexity,
			body: n.body
		});
		return { ...n, id };
	});

	type Seg = { text: string; note?: (CodeNote & { id: string }) };
	const segments = $derived.by<Seg[]>(() => {
		const ranges: { s: number; e: number; note: (typeof noted)[number] }[] = [];
		for (const note of noted) {
			const i = data.code.indexOf(note.token);
			if (i < 0) continue;
			const r = { s: i, e: i + note.token.length, note };
			if (ranges.some((x) => r.s < x.e && x.s < r.e)) continue;
			ranges.push(r);
		}
		ranges.sort((a, b) => a.s - b.s);
		const segs: Seg[] = [];
		let pos = 0;
		for (const r of ranges) {
			if (r.s > pos) segs.push({ text: data.code.slice(pos, r.s) });
			segs.push({ text: data.code.slice(r.s, r.e), note: r.note });
			pos = r.e;
		}
		if (pos < data.code.length) segs.push({ text: data.code.slice(pos) });
		return segs;
	});

	// hover → peek card (engine), hold → auto-pin ring (same UX as Term / CodeView)
	let showT: ReturnType<typeof setTimeout> | undefined;
	let holding = $state<string | null>(null);
	function enter(e: MouseEvent, id: string) {
		const el = e.currentTarget as HTMLElement;
		clearTimeout(showT);
		showT = setTimeout(() => {
			tips.showHover(id, el.getBoundingClientRect());
			holding = id;
		}, 130);
	}
	function leave() {
		clearTimeout(showT);
		holding = null;
		tips.scheduleHide();
	}
	function pin(el: HTMLElement, id: string) {
		clearTimeout(showT);
		holding = null;
		tips.pinFromRect(id, el.getBoundingClientRect());
	}
	function ringEnd(e: AnimationEvent, id: string) {
		const span = (e.currentTarget as HTMLElement).parentElement;
		holding = null;
		if (span) tips.pinFromRect(id, span.getBoundingClientRect());
	}
</script>

<figure class="ca">
	<figcaption class="ca__cap">
		<span class="ca__lang">{data.lang}</span>
		{#if data.caption}<span>{data.caption}</span>{/if}
		<span class="ca__legend"><i class="dot syn"></i>синтаксис&nbsp;&nbsp;<i class="dot con"></i>алгоритм</span>
	</figcaption>
	<pre class="ca__code"><code>{#each segments as seg}{#if seg.note}<span
					class="tok {seg.note.kind}"
					role="button"
					tabindex="0"
					onmouseenter={(e) => enter(e, seg.note!.id)}
					onmouseleave={leave}
					onclick={(e) => pin(e.currentTarget as HTMLElement, seg.note!.id)}
					onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pin(e.currentTarget as HTMLElement, seg.note!.id); } }}
					>{seg.text}{#if holding === seg.note.id}<span class="ring" onanimationend={(e) => ringEnd(e, seg.note!.id)}></span>{/if}</span>{:else}{seg.text}{/if}{/each}</code></pre>
</figure>

<style>
	.ca {
		margin: 1.2rem 0;
		border: 1.5px solid var(--color-ink-600);
		border-radius: 12px;
		overflow: hidden;
		background: #0c0d11;
	}
	.ca__cap {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.45rem 0.85rem;
		background: #15171d;
		border-bottom: 1px solid #23262e;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: #9aa3b2;
	}
	.ca__lang {
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--blue);
	}
	.ca__legend {
		margin-left: auto;
		display: flex;
		align-items: center;
		color: #6b7280;
	}
	.dot {
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 2px;
		margin-right: 0.3rem;
		vertical-align: -1px;
	}
	.dot.syn { background: var(--color-azure); }
	.dot.con { background: var(--blue); }
	.ca__code {
		margin: 0;
		padding: 0.9rem 1rem;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.6;
		color: #d8dee9;
		tab-size: 4;
		white-space: pre;
	}
	.tok {
		position: relative;
		cursor: help;
		border-radius: 3px;
		padding: 0 0.1em;
		border-bottom: 2px solid;
		transition: background 0.12s;
	}
	.tok.syntax {
		border-color: var(--color-azure);
		color: #acd0ff;
	}
	.tok.concept {
		border-color: var(--blue);
		color: #b9c4ff;
		background: color-mix(in srgb, var(--blue) 14%, transparent);
	}
	.tok:hover {
		background: color-mix(in srgb, var(--blue) 28%, transparent);
	}
	.ring {
		position: absolute;
		top: -0.55em;
		right: -0.7em;
		width: 0.85em;
		height: 0.85em;
		border-radius: 50%;
		background: conic-gradient(var(--blue) var(--ring, 0%), transparent 0);
		animation: ringfill 1240ms linear forwards;
		pointer-events: none;
	}
</style>
