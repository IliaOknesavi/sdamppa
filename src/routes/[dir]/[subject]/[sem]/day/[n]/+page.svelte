<script lang="ts">
	import DayView from '$lib/components/DayView.svelte';
	let { data } = $props();
</script>

<DayView
	course={data.course}
	day={data.day}
	basePath={data.basePath}
	yearQ={data.yearQ}
	backHref={`${data.basePath}${data.yearQ}`}
	backLabel={data.subject.short}
/>
