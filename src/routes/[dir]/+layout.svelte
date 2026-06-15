<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<!-- per-direction brand palette (e.g. ИИИ → electric blue) scoped to this subtree -->
<div class="dir-scope" data-direction={data.direction.id}>
	{@render children()}
</div>

<style>
	.dir-scope {
		display: contents;
	}
</style>
