<script lang="ts">
	import { tips } from './tooltips.svelte';
	import { progress } from '$lib/stores/progress.svelte';
	import { parseInline } from '$lib/markup';
	import Katex from './Katex.svelte';

	let { id, label, parent }: { id: string; label: string; parent?: string } = $props();

	const exists = $derived(tips.has(id));
	// labels may contain math/formatting, e.g. [[id|$\Omega$]] — render them too
	const labelNodes = $derived(parseInline(label));
	let el: HTMLSpanElement | undefined = $state();
	let showT: ReturnType<typeof setTimeout> | undefined;
	let holding = $state(false);

	const SHOW_DELAY = 140;

	function enter() {
		if (!exists || !el) return;
		showT = setTimeout(() => {
			if (!el) return;
			tips.showHover(id, el.getBoundingClientRect());
			holding = true; // begins the hold-to-pin ring
		}, SHOW_DELAY);
	}
	function leave() {
		clearTimeout(showT);
		holding = false;
		tips.scheduleHide();
	}
	function pinNow() {
		if (!exists || !el) return;
		clearTimeout(showT);
		holding = false;
		tips.pinFromRect(id, el.getBoundingClientRect(), parent);
		progress.touchTerm(id);
	}
	function ringEnd() {
		if (!el) return;
		holding = false;
		tips.pinFromRect(id, el.getBoundingClientRect(), parent);
		progress.touchTerm(id);
	}
	const studied = $derived(!!progress.data.terms[id]);
</script>

{#snippet lbl(nodes: ReturnType<typeof parseInline>)}
	{#each nodes as n}
		{#if n.k === 'text'}{n.v}
		{:else if n.k === 'math'}<Katex math={n.v} display={n.display} />
		{:else if n.k === 'b'}<strong>{@render lbl(n.c)}</strong>
		{:else if n.k === 'i'}<em>{@render lbl(n.c)}</em>
		{:else if n.k === 'code'}<code>{n.v}</code>
		{:else if n.k === 'term'}{n.label}
		{/if}
	{/each}
{/snippet}

{#if exists}
	<span
		bind:this={el}
		class="cx-term"
		class:studied
		role="button"
		tabindex="0"
		onmouseenter={enter}
		onmouseleave={leave}
		onclick={pinNow}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				pinNow();
			}
		}}
		>{@render lbl(labelNodes)}{#if holding}<span class="ring" onanimationend={ringEnd}></span>{/if}</span
	>
{:else}
	<span class="cx-term cx-term--dead">{@render lbl(labelNodes)}</span>
{/if}

<style>
	.cx-term {
		position: relative;
		cursor: help;
		color: var(--color-gold-300);
		border-bottom: 1px dotted color-mix(in srgb, var(--accent) 60%, transparent);
		transition:
			color 0.15s,
			background 0.15s;
		border-radius: 2px;
		padding: 0 0.04em;
	}
	.cx-term:hover {
		color: var(--color-gold-400);
		background: color-mix(in srgb, var(--accent) 14%, transparent);
	}
	.cx-term.studied {
		border-bottom-style: solid;
	}
	.cx-term--dead {
		color: inherit;
		border-bottom: 1px dotted var(--color-ink-500);
		cursor: default;
	}
	.ring {
		position: absolute;
		top: -0.55em;
		right: -0.7em;
		width: 0.85em;
		height: 0.85em;
		border-radius: 50%;
		background: conic-gradient(var(--accent) var(--ring, 0%), transparent 0);
		animation: ringfill 1240ms linear forwards;
		pointer-events: none;
		filter: drop-shadow(0 0 3px var(--accent-soft));
	}
</style>
