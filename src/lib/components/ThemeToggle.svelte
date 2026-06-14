<script lang="ts">
	import { theme } from '$lib/theme.svelte';
	import { onMount } from 'svelte';
	onMount(() => theme.init());
</script>

<button
	class="theme-toggle"
	onclick={() => theme.toggle()}
	aria-label="Сменить тему"
	title={theme.current === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
>
	{theme.current === 'dark' ? '☀' : '☾'}
</button>

<style>
	.theme-toggle {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		z-index: 90;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 8px;
		border: 1px solid var(--color-ink-600);
		background: var(--color-ink-800);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 1.05rem;
		display: grid;
		place-items: center;
		box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.3);
		transition:
			background 0.15s,
			border-color 0.15s,
			transform 0.15s;
	}
	.theme-toggle:hover {
		border-color: var(--accent);
		color: var(--accent);
		transform: translateY(-1px);
	}
</style>
