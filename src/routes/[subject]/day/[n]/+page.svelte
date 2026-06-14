<script lang="ts">
	import DayView from '$lib/components/DayView.svelte';
	let { data } = $props();
</script>

<DayView subject={data.subject} day={data.day} />
