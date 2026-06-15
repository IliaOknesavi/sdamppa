<script lang="ts">
	import type { Course } from '$lib/types';
	import { progress } from '$lib/stores/progress.svelte';

	let { course, basePath, yearQ = '' }: { course: Course; basePath: string; yearQ?: string } =
		$props();

	function isCheckpoint(title: string) {
		const t = title.toLowerCase();
		return t.includes('чекпоинт') || t.includes('мок') || t.includes('мини-тест');
	}
</script>

<div class="cal">
	{#each course.phases as phase, pi}
		{@const days = course.days.filter((d) => d.phaseId === phase.id)}
		<section class="phase reveal" style="--i:{pi}; --tint:{phase.hue};">
			<header class="phase__head">
				<h3 class="phase__title">{phase.title}</h3>
				{#if phase.subtitle}<span class="phase__sub">{phase.subtitle}</span>{/if}
			</header>
			<div class="phase__grid">
				{#each days as d}
					{@const done = progress.isDayDone(d.n)}
					{@const cp = isCheckpoint(d.title)}
					<a
						class="cell"
						class:done
						class:draft={d.draft}
						class:cp
						href="{basePath}/day/{d.n}{yearQ}"
						data-sveltekit-preload-data="hover"
					>
						<div class="cell__top">
							<span class="cell__n">{d.n}</span>
							{#if cp}<span class="cell__star" title="контрольная точка">⚑</span>{/if}
							{#if done}<span class="cell__done">✓</span>{/if}
						</div>
						<div class="cell__title">{d.title}</div>
						<div class="cell__foot">
							{#if d.chapterRef && d.chapterRef !== '—'}<span class="cell__ch">{d.chapterRef}</span>{/if}
							{#if d.draft}<span class="cell__draft">черновик</span>{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/each}
</div>

<style>
	.cal {
		display: flex;
		flex-direction: column;
		gap: 2.2rem;
	}
	.phase__head {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 1rem;
	}
	.phase__title {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 800;
		color: var(--color-parch-100);
		margin: 0;
	}
	.phase__title::before {
		content: '';
		display: inline-block;
		width: 0.65rem;
		height: 1.5rem;
		border-radius: 3px;
		background: hsl(var(--tint) 68% 62%);
	}
	.phase__sub {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
		text-transform: uppercase;
	}
	.phase__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(196px, 1fr));
		gap: 0.8rem;
	}
	.cell {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-height: 126px;
		padding: 0.9rem 1rem;
		border-radius: 14px;
		text-decoration: none;
		color: var(--color-parch-200);
		background: var(--color-ink-850);
		border: 1.5px solid var(--color-ink-600);
		transition:
			transform 0.16s,
			border-color 0.16s,
			box-shadow 0.16s;
	}
	.cell:hover {
		transform: translateY(-3px);
		border-color: var(--violet);
		box-shadow: 0 16px 34px -20px color-mix(in srgb, var(--violet) 55%, transparent);
	}
	.cell.done {
		border-color: var(--violet);
		background: color-mix(in srgb, var(--violet) 7%, var(--color-ink-850));
	}
	.cell.draft {
		opacity: 0.55;
	}
	.cell.cp {
		background: var(--lime);
		border-color: var(--lime);
	}
	.cell.cp .cell__n,
	.cell.cp .cell__title,
	.cell.cp .cell__foot,
	.cell.cp .cell__star {
		color: var(--lime-ink);
	}
	.cell.cp:hover {
		border-color: var(--lime-ink);
	}
	.cell__top {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.cell__n {
		font-family: var(--font-display);
		font-size: 1.9rem;
		font-weight: 800;
		color: var(--violet);
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.cell__star {
		color: var(--lime-ink);
		font-size: 0.9rem;
	}
	.cell__done {
		margin-left: auto;
		color: var(--violet);
		font-weight: 800;
	}
	.cell__title {
		font-size: 0.86rem;
		line-height: 1.3;
		flex: 1;
		color: var(--color-parch-100);
		font-weight: 600;
	}
	.cell__foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
	}
	.cell__draft {
		color: var(--violet);
	}
</style>
