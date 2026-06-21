<script lang="ts">
	import { onMount } from 'svelte';
	import { katexNow, loadKatex } from './katex-loader';

	let { math, display = false }: { math: string; display?: boolean } = $props();

	// если KaTeX уже загружен (предзагрузка на idle) — рендерим СРАЗУ, без кадра
	// сырого TeX и без скачка высоты. Иначе подгружаем и обновимся по готовности.
	let katex = $state<typeof import('katex').default | null>(katexNow());
	onMount(() => {
		if (!katex) loadKatex().then((m) => (katex = m));
	});

	const html = $derived.by(() => {
		if (!katex) return '';
		try {
			return katex.renderToString(math, {
				displayMode: display,
				throwOnError: false,
				strict: false,
				output: 'html'
			});
		} catch {
			return `<span class="cx-math-err">${math}</span>`;
		}
	});
</script>

<!-- KaTeX provides its own block/inline structure; до загрузки — сырой TeX -->
{#if katex}{@html html}{:else}<span class="cx-math-raw" class:display>{math}</span>{/if}

<style>
	:global(.cx-math-err) {
		color: var(--color-rose);
		font-family: var(--font-mono);
		font-size: 0.85em;
	}
	.cx-math-raw {
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--color-parch-muted);
	}
	.cx-math-raw.display {
		display: block;
		text-align: center;
		margin: 0.4em 0;
	}
</style>
