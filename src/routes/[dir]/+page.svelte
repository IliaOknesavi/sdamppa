<script lang="ts">
	import { subjectReady, semestersOf, authoredDays } from '$lib/types';
	import Sparkle from '$lib/components/Sparkle.svelte';
	let { data } = $props();
	const direction = $derived(data.direction);
	const tiles = ['blue', '', 'soft', '', 'star', 'blue', 'pale', '', 'blue'];
</script>

<div class="page">
	<header class="head">
		<div class="head__text">
			<a class="home" href="/">✦ СдамППА</a>
			<h1>{direction.name}</h1>
			<div class="label sub">{direction.short} · направление</div>
		</div>
		<div class="head__art" aria-hidden="true">
			<div class="mosaic">
				{#each tiles as t}
					<div class="tile tile--{t || 'empty'}">
						{#if t === 'star'}<Sparkle size={30} color="var(--blue)" />{/if}
					</div>
				{/each}
			</div>
		</div>
	</header>

	<div class="grid">
		{#each direction.subjects as s, i}
			{@const ready = subjectReady(s)}
			<a
				class="card reveal"
				class:soon={!ready}
				style="--i:{i}"
				href={s.courses.length ? `/${direction.id}/${s.id}` : undefined}
			>
				<div class="seal">{s.glyph}</div>
				<div class="body">
					<h2>{s.name}</h2>
					<p>{s.blurb}</p>
					<div class="meta">
						<span>семестры: {semestersOf(s).join(', ')}</span>
						{#if ready}
							<span class="go">открыть →</span>
						{:else}
							<span class="soontag">скоро</span>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.page {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2.5rem 1.3rem 5rem;
	}
	.home {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		text-decoration: none;
	}
	.home:hover {
		color: var(--accent);
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	.head h1 {
		font-size: clamp(1.8rem, 5vw, 2.8rem);
		margin: 0.7rem 0 0.3rem;
	}
	.sub {
		margin-bottom: 0;
	}
	.head__art {
		flex: none;
	}
	.mosaic {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		width: 168px;
	}
	.tile {
		aspect-ratio: 1;
	}
	.tile--blue {
		background: var(--blue);
	}
	.tile--soft {
		background: var(--blue-soft);
	}
	.tile--pale {
		background: var(--blue-pale);
	}
	.tile--star {
		background: var(--color-ink-850);
		border: 1.5px solid var(--blue);
		display: grid;
		place-items: center;
	}
	.tile--empty {
		background: transparent;
	}
	@media (max-width: 640px) {
		.head {
			flex-direction: column;
			align-items: flex-start;
		}
		.head__art {
			display: none;
		}
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
	.card {
		display: flex;
		gap: 1rem;
		padding: 1.4rem;
		border-radius: 8px;
		text-decoration: none;
		color: var(--color-parch-200);
		background: var(--color-ink-800);
		border: 1px solid var(--color-ink-600);
		transition:
			transform 0.18s,
			box-shadow 0.18s,
			border-color 0.18s;
	}
	.card:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px -20px rgba(0, 0, 0, 0.4);
		border-color: var(--accent);
	}
	.card.soon {
		opacity: 0.62;
		cursor: not-allowed;
		pointer-events: none;
	}
	.seal {
		display: grid;
		place-items: center;
		width: 3.2rem;
		height: 3.2rem;
		flex: none;
		border-radius: 50%;
		font-family: var(--font-display);
		font-size: 1.7rem;
		color: #fff;
		background: radial-gradient(circle at 35% 30%, var(--color-gold-300), var(--accent) 65%, var(--color-gold-600));
	}
	.body h2 {
		font-size: 1.2rem;
		margin: 0 0 0.3rem;
	}
	.body p {
		font-size: 0.88rem;
		color: var(--color-parch-300);
		margin: 0 0 0.7rem;
		line-height: 1.45;
	}
	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--color-parch-muted);
	}
	.go {
		color: var(--accent);
	}
	.soontag {
		color: var(--color-gold-500);
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}
</style>
