<script lang="ts">
	import '../app.css';
	import TooltipLayer from '$lib/engine/TooltipLayer.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import Copilot from '$lib/copilot/Copilot.svelte';

	let { children } = $props();
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
