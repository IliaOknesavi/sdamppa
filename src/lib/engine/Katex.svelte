<script lang="ts">
	import katex from 'katex';

	let { math, display = false }: { math: string; display?: boolean } = $props();

	const html = $derived.by(() => {
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

<!-- KaTeX provides its own block/inline structure -->
{@html html}

<style>
	:global(.cx-math-err) {
		color: var(--color-rose);
		font-family: var(--font-mono);
		font-size: 0.85em;
	}
</style>
