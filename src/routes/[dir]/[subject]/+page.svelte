<script lang="ts">
	import { semestersOf, yearsOf, getCourse, authoredDays } from '$lib/types';
	import { plural } from '$lib/plural';
	let { data } = $props();
	const direction = $derived(data.direction);
	const subject = $derived(data.subject);
	const sems = $derived(semestersOf(subject));
</script>

<div class="page">
	<header class="head">
		<a class="home" href="/{direction.id}">← {direction.short}</a>
		<div class="seal-row">
			<div class="seal">{subject.glyph}</div>
			<div>
				<h1>{subject.name}</h1>
				<div class="label sub">{subject.short} · выбери семестр</div>
			</div>
		</div>
	</header>

	<div class="grid">
		{#each sems as sem, i}
			{@const c = getCourse(subject, sem)}
			<a
				class="sem reveal"
				class:soon={c && c.status !== 'ready'}
				style="--i:{i}"
				href={c && c.status === 'ready' ? `/${direction.id}/${subject.id}/${sem}` : undefined}
			>
				<div class="num">{sem}</div>
				<div class="semlabel">семестр</div>
				{#if c}
					<div class="state">
						{#if c.status === 'ready'}
							<span class="ready">{c.days.length} {plural(c.days.length, ['день', 'дня', 'дней'])} · {authoredDays(c)} готово</span>
						{:else}
							<span class="soontag">скоро</span>
						{/if}
					</div>
					<div class="years label">год: {yearsOf(subject, sem).join(', ')}</div>
				{/if}
			</a>
		{/each}
	</div>
</div>

<style>
	.page {
		max-width: 900px;
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
	.seal-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 0.9rem 0 2rem;
	}
	.seal {
		display: grid;
		place-items: center;
		width: 3.6rem;
		height: 3.6rem;
		flex: none;
		border-radius: 50%;
		font-family: var(--font-display);
		font-size: 1.9rem;
		color: #fff;
		background: var(--accent);
	}
	.head h1 {
		font-size: clamp(1.6rem, 4.5vw, 2.4rem);
		margin: 0;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}
	.sem {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1.4rem;
		border-radius: 8px;
		text-decoration: none;
		color: var(--color-parch-200);
		background: var(--color-ink-800);
		border: 1px solid var(--color-ink-600);
		transition:
			transform 0.16s,
			border-color 0.16s,
			box-shadow 0.16s;
	}
	.sem:hover {
		transform: translateY(-3px);
		border-color: var(--accent);
		box-shadow: 0 16px 36px -18px rgba(0, 0, 0, 0.4);
	}
	.sem.soon {
		opacity: 0.6;
		pointer-events: none;
		cursor: not-allowed;
	}
	.num {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 2.6rem;
		line-height: 1;
		color: var(--accent);
	}
	.semlabel {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--color-parch-muted);
	}
	.state {
		margin-top: 0.6rem;
		font-size: 0.82rem;
	}
	.ready {
		color: var(--color-verdant);
	}
	.soontag {
		color: var(--color-gold-500);
		text-transform: uppercase;
		font-size: 0.7rem;
		letter-spacing: 0.12em;
	}
	.years {
		margin-top: 0.2rem;
		font-size: 0.6rem;
	}
</style>
