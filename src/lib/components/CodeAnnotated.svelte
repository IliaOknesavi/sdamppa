<script lang="ts">
	import type { AnnotatedCode, CodeNote } from '$lib/types';
	import RichText from '$lib/engine/RichText.svelte';
	import Katex from '$lib/engine/Katex.svelte';

	let { data }: { data: AnnotatedCode } = $props();

	type Seg = { text: string; note?: CodeNote };
	// split the code into plain/annotated segments by first occurrence of each token
	const segments = $derived.by<Seg[]>(() => {
		const ranges: { s: number; e: number; note: CodeNote }[] = [];
		for (const note of data.notes) {
			const i = data.code.indexOf(note.token);
			if (i < 0) continue;
			const r = { s: i, e: i + note.token.length, note };
			if (ranges.some((x) => r.s < x.e && x.s < r.e)) continue; // skip overlaps
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

	let active = $state<{ note: CodeNote; x: number; y: number } | null>(null);
	let hideT: ReturnType<typeof setTimeout> | undefined;
	function enter(e: MouseEvent, note: CodeNote) {
		clearTimeout(hideT);
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const W = typeof window !== 'undefined' ? window.innerWidth : 1200;
		active = { note, x: Math.max(12, Math.min(r.left, W - 360)), y: r.bottom + 8 };
	}
	function leave() {
		hideT = setTimeout(() => (active = null), 130);
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
					onmouseenter={(e) => enter(e, seg.note!)}
					onmouseleave={leave}>{seg.text}</span>{:else}{seg.text}{/if}{/each}</code></pre>
</figure>

{#if active}
	<div
		class="ca__pop {active.note.kind}"
		style="left:{active.x}px; top:{active.y}px;"
		role="tooltip"
		onmouseenter={() => clearTimeout(hideT)}
		onmouseleave={leave}
	>
		<div class="ca__pop-head">
			<span class="ca__pop-kind">{active.note.kind === 'syntax' ? 'C-синтаксис' : 'алгоритм'}</span>
			{#if active.note.complexity}<span class="ca__cx"><Katex math={active.note.complexity} /></span>{/if}
		</div>
		<div class="ca__pop-title">{active.note.title}</div>
		<div class="ca__pop-body"><RichText source={active.note.body} /></div>
	</div>
{/if}

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
	}
	.tok {
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
	.ca__pop {
		position: fixed;
		z-index: 80;
		width: 340px;
		max-width: calc(100vw - 24px);
		background: var(--color-ink-850);
		border: 1.5px solid;
		border-radius: 10px;
		padding: 0.7rem 0.85rem;
		box-shadow: 0 18px 50px -14px rgba(0, 0, 0, 0.55);
		font-size: 0.86rem;
		color: var(--color-parch-200);
		animation: popIn 0.15s ease;
	}
	.ca__pop.syntax { border-color: var(--color-azure); }
	.ca__pop.concept { border-color: var(--blue); }
	.ca__pop-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}
	.ca__pop-kind {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}
	.ca__pop.syntax .ca__pop-kind { color: var(--color-azure); }
	.ca__pop.concept .ca__pop-kind { color: var(--blue); }
	.ca__cx {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		padding: 0.05rem 0.4rem;
		border-radius: 5px;
		background: color-mix(in srgb, var(--blue) 16%, var(--color-ink-800));
	}
	.ca__pop-title {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-parch-100);
		margin-bottom: 0.3rem;
	}
</style>
