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
		gap: 1.6rem;
	}
	.phase__head {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		margin-bottom: 0.7rem;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
	}
	.phase__title {
		font-size: 1.25rem;
		color: var(--color-parch-100);
	}
	.phase__sub {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		text-transform: uppercase;
	}
	.phase__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
		gap: 0.7rem;
	}
	.cell {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-height: 116px;
		padding: 0.7rem 0.8rem;
		border-radius: 11px;
		text-decoration: none;
		color: var(--color-parch-200);
		background:
			linear-gradient(160deg, color-mix(in srgb, hsl(var(--tint) 40% 50%) 7%, var(--color-ink-800)), var(--color-ink-850));
		border: 1px solid var(--color-ink-600);
		transition:
			transform 0.16s,
			border-color 0.16s,
			box-shadow 0.16s;
	}
	.cell:hover {
		transform: translateY(-3px);
		border-color: var(--accent);
		box-shadow: 0 14px 30px -14px rgba(0, 0, 0, 0.8);
	}
	.cell.done {
		border-color: color-mix(in srgb, var(--color-verdant) 55%, transparent);
	}
	.cell.draft {
		opacity: 0.62;
	}
	.cell.cp {
		background:
			linear-gradient(160deg, color-mix(in srgb, var(--accent) 16%, var(--color-ink-800)), var(--color-ink-850));
		border-color: var(--accent-line);
	}
	.cell__top {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.cell__n {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 600;
		color: var(--color-gold-300);
		line-height: 1;
	}
	.cell__star {
		color: var(--accent);
	}
	.cell__done {
		margin-left: auto;
		color: var(--color-verdant);
		font-weight: 700;
	}
	.cell__title {
		font-size: 0.82rem;
		line-height: 1.3;
		flex: 1;
		color: var(--color-parch-100);
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
		color: var(--color-gold-600);
	}
</style>
