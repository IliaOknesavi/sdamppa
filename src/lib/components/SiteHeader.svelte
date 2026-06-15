<script lang="ts">
	import { theme } from '$lib/theme.svelte';
	import { onMount } from 'svelte';
	onMount(() => theme.init());
</script>

<header class="site">
	<div class="site__util">
		<span class="site__note">Платформа подготовки · направление ИИИ</span>
		<button
			class="site__theme"
			onclick={() => theme.toggle()}
			aria-label="Сменить тему"
			title={theme.current === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
		>
			{theme.current === 'dark' ? '☀ светлая' : '☾ тёмная'}
		</button>
	</div>
	<div class="site__main">
		<a class="site__brand" href="/">
			<span class="site__mark">КОДЕКС</span>
			<span class="site__dot"></span>
		</a>
		<nav class="site__nav">
			<a href="/">Направления</a>
		</nav>
	</div>
</header>

<style>
	.site {
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-850);
	}
	.site__util {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.4rem 1.4rem;
		border-bottom: 1px solid var(--color-ink-600);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.04em;
		color: var(--color-parch-muted);
	}
	.site__theme {
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.06em;
		color: var(--color-parch-300);
		text-transform: uppercase;
		transition: color 0.15s;
	}
	.site__theme:hover {
		color: var(--accent);
	}
	.site__main {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		max-width: 1180px;
		margin: 0 auto;
		padding: 0.85rem 1.4rem;
	}
	.site__brand {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		text-decoration: none;
	}
	.site__mark {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 1.5rem;
		letter-spacing: -0.01em;
		color: var(--color-parch-100);
	}
	.site__dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--violet);
		display: inline-block;
	}
	.site__nav {
		display: flex;
		gap: 1.4rem;
	}
	.site__nav a {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.9rem;
		text-decoration: none;
		color: var(--color-parch-100);
		padding-bottom: 2px;
		border-bottom: 2px solid transparent;
		transition: border-color 0.15s;
	}
	.site__nav a:hover {
		border-color: var(--violet);
	}
</style>
