<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import TooltipLayer from '$lib/engine/TooltipLayer.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import Copilot from '$lib/copilot/Copilot.svelte';

	let { children } = $props();

	// Предзагружаем KaTeX в простое: из начального бандла он исключён (ленивый),
	// но к моменту первого тултипа уже готов → формулы рендерятся без скачка высоты.
	onMount(() => {
		const idle =
			(window as unknown as { requestIdleCallback?: (cb: () => void) => void })
				.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
		idle(async () => {
			const { loadKatex } = await import('$lib/engine/katex-loader');
			loadKatex();
		});
	});
</script>

<div class="cx-app">
	<SiteHeader />
	<main class="cx-main">
		{@render children()}
	</main>
	<SiteFooter />
</div>

<!-- global nested-tooltip layer (hover popovers + pinned cards) -->
<TooltipLayer />
<!-- AI assistant (user's own Ollama) with current-lecture context -->
<Copilot />

<style>
	.cx-app {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}
	.cx-main {
		flex: 1;
	}
</style>
