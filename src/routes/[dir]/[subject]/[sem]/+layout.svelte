<script lang="ts">
	import { tips } from '$lib/engine/tooltips.svelte';
	import { progress } from '$lib/stores/progress.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// Wire the engine to the selected course: its glossary + per-course progress.
	$effect(() => {
		tips.setGlossary(data.course.glossary);
		progress.load(data.courseKey);
	});
</script>

{@render children()}
