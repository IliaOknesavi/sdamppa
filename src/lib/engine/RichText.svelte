<script lang="ts">
	import { parseBlocks, type Inline } from '$lib/markup';
	import Katex from './Katex.svelte';
	import Term from './Term.svelte';

	let { source, parent }: { source: string; parent?: string } = $props();
	const blocks = $derived(parseBlocks(source ?? ''));
</script>

{#snippet inlines(nodes: Inline[])}
	{#each nodes as n}
		{#if n.k === 'text'}{n.v}
		{:else if n.k === 'b'}<strong>{@render inlines(n.c)}</strong>
		{:else if n.k === 'i'}<em>{@render inlines(n.c)}</em>
		{:else if n.k === 'code'}<code class="cx-code">{n.v}</code>
		{:else if n.k === 'math'}<Katex math={n.v} display={n.display} />
		{:else if n.k === 'term'}<Term id={n.id} label={n.label} {parent} />
		{:else if n.k === 'link'}<a class="cx-link" href={n.href}>{@render inlines(n.c)}</a>
		{/if}
	{/each}
{/snippet}

<div class="cx-rich">
	{#each blocks as b}
		{#if b.k === 'p'}
			<p>{@render inlines(b.c)}</p>
		{:else if b.k === 'h'}
			<!-- подзаголовок внутри тела термина: НЕ <h4>, чтобы не ломать иерархию
			     заголовков (h4 без h1–h3 в карточках/секциях); визуально — как заголовок -->
			<p class="cx-rich-h">{@render inlines(b.c)}</p>
		{:else if b.k === 'math'}
			<Katex math={b.v} display />
		{:else if b.k === 'ul'}
			<ul>
				{#each b.items as it}<li>{@render inlines(it)}</li>{/each}
			</ul>
		{:else if b.k === 'ol'}
			<ol>
				{#each b.items as it}<li>{@render inlines(it)}</li>{/each}
			</ol>
		{:else if b.k === 'codeblock'}
			<pre class="cx-rich-code"><code>{b.v}</code></pre>
		{/if}
	{/each}
</div>

<style>
	.cx-rich :global(p) {
		margin: 0 0 0.7em;
		line-height: 1.62;
	}
	.cx-rich :global(p:last-child) {
		margin-bottom: 0;
	}
	.cx-rich :global(.cx-rich-code) {
		margin: 0.6em 0;
		padding: 0.7rem 0.9rem;
		border-radius: 8px;
		background: var(--color-ink-900, #0c0d11);
		border: 1px solid var(--color-ink-600);
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.5;
		color: #d8dee9;
	}
	.cx-rich :global(.cx-rich-code code) {
		background: none;
		padding: 0;
		color: inherit;
	}
	.cx-rich :global(ul),
	.cx-rich :global(ol) {
		margin: 0 0 0.7em;
		padding-left: 1.3em;
		line-height: 1.6;
	}
	.cx-rich :global(li) {
		margin: 0.2em 0;
	}
	.cx-rich :global(ul) {
		list-style: none;
	}
	.cx-rich :global(ul > li)::before {
		content: '◆';
		color: var(--accent);
		font-size: 0.6em;
		margin-right: 0.6em;
		vertical-align: middle;
	}
	.cx-rich-h {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1rem;
		margin: 0.2em 0 0.5em;
		color: var(--color-parch-100);
	}
	.cx-rich :global(.cx-code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: color-mix(in srgb, var(--accent) 12%, var(--color-ink-800));
		padding: 0.08em 0.4em;
		border-radius: 4px;
		color: var(--color-parch-100);
	}
	.cx-rich :global(strong) {
		color: var(--color-parch-100);
		font-weight: 600;
	}
	.cx-rich :global(.cx-link) {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}
	.cx-rich :global(.cx-link:hover) {
		opacity: 0.8;
	}
</style>
