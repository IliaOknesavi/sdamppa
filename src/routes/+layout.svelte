<script lang="ts">
	import '../app.css';
	import TooltipLayer from '$lib/engine/TooltipLayer.svelte';

	let { children } = $props();
</script>

<div class="cx-app">
	{@render children()}
</div>

<!-- global nested-tooltip layer (hover popovers + pinned cards) -->
<TooltipLayer />

<style>
	.cx-app {
		min-height: 100dvh;
	}
</style>
