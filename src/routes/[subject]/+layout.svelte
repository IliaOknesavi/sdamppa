<script lang="ts">
	import { tips } from '$lib/engine/tooltips.svelte';
	import { progress } from '$lib/stores/progress.svelte';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { subject: import('$lib/types').Subject }; children: Snippet } =
		$props();

	// Wire the engine to the active subject: glossary for tooltips, saved progress.
	$effect(() => {
		tips.setGlossary(data.subject.glossary);
		progress.load(data.subject.id);
	});
</script>

<div class="subject-root" style="--accent:{data.subject.accent};">
	{@render children()}
</div>

<style>
	.subject-root {
		min-height: 100dvh;
	}
</style>
