<script lang="ts">
	// Инлайновый рендер разметки БЕЗ блочной обёртки (<div>/<p>) — годится внутрь
	// <h2>/<summary>/<li>, где RichText дал бы невалидный блок в строке. Нужен,
	// чтобы $math$, **bold**, [[термины]] в заголовках секций и пунктах «усвоения»
	// рендерились, а не показывались сырым текстом с $.
	import { parseInline, type Inline } from '$lib/markup';
	import Katex from './Katex.svelte';
	import Term from './Term.svelte';

	let { source, parent }: { source: string; parent?: string } = $props();
	const nodes = $derived(parseInline(source ?? ''));
</script>

{#snippet ins(list: Inline[])}
	{#each list as n}
		{#if n.k === 'text'}{n.v}
		{:else if n.k === 'b'}<strong>{@render ins(n.c)}</strong>
		{:else if n.k === 'i'}<em>{@render ins(n.c)}</em>
		{:else if n.k === 'code'}<code class="cx-code">{n.v}</code>
		{:else if n.k === 'math'}<Katex math={n.v} display={n.display} />
		{:else if n.k === 'term'}<Term id={n.id} label={n.label} {parent} />
		{:else if n.k === 'link'}<a class="cx-link" href={n.href}>{@render ins(n.c)}</a>
		{/if}
	{/each}
{/snippet}

{@render ins(nodes)}

<style>
	.cx-code {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: color-mix(in srgb, var(--accent) 12%, var(--color-ink-800));
		padding: 0.08em 0.4em;
		border-radius: 4px;
		color: var(--color-parch-100);
	}
	.cx-link {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}
	.cx-link:hover {
		opacity: 0.8;
	}
</style>
