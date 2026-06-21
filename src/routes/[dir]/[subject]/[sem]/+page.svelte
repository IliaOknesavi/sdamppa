<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import XPBar from '$lib/components/XPBar.svelte';
	import ProgressMenu from '$lib/components/ProgressMenu.svelte';
	import { authoredDays, yearsOf } from '$lib/types';
	import { progress } from '$lib/stores/progress.svelte';
	import { goto } from '$app/navigation';
	import { plural } from '$lib/plural';

	let { data } = $props();
	const direction = $derived(data.direction);
	const subject = $derived(data.subject);
	const course = $derived(data.course);
	const years = $derived(yearsOf(subject, data.semester));
	const pct = $derived(
		course.days.length ? Math.round((progress.doneCount() / course.days.length) * 100) : 0
	);

	function onYear(e: Event) {
		const y = (e.currentTarget as HTMLSelectElement).value;
		goto(`${data.basePath}?year=${y}`);
	}
</script>

<div class="dash">
	<header class="dash__head">
		<div class="dash__top">
			<a class="dash__home" href="/{direction.id}/{subject.id}">← {subject.short}</a>
			<div class="dash__right">
				<XPBar />
				<ProgressMenu />
			</div>
		</div>
		<div class="dash__hero reveal" style="--i:1">
			<div class="dash__seal">{subject.glyph}</div>
			<div class="dash__titles">
				<h1 class="dash__name">{subject.name}</h1>
				<div class="dash__sub">
					{direction.short} · {data.semester}-й семестр · {course.days.length} {plural(course.days.length, ['день', 'дня', 'дней'])} · {authoredDays(course)} готово · пройдено {progress.doneCount()} ({pct}%)
				</div>
			</div>
			<label class="yearpick">
				<span class="label">год</span>
				<select value={data.year} onchange={onYear}>
					{#each years as y}<option value={y}>{y}</option>{/each}
				</select>
			</label>
		</div>
		<div class="dash__bar reveal" style="--i:2">
			<div class="dash__bar-fill" style="width:{pct}%"></div>
		</div>
	</header>

	<Calendar {course} basePath={data.basePath} yearQ={data.yearQ} />
</div>

<style>
	.dash {
		max-width: 1080px;
		margin: 0 auto;
		padding: 1.8rem 1.3rem 5rem;
	}
	.dash__top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.6rem;
	}
	.dash__home {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--color-parch-muted);
		text-decoration: none;
	}
	.dash__home:hover {
		color: var(--accent);
	}
	.dash__right {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
	}
	.dash__hero {
		display: flex;
		align-items: center;
		gap: 1.1rem;
		margin-bottom: 1rem;
	}
	.dash__seal {
		display: grid;
		place-items: center;
		width: 4rem;
		height: 4rem;
		flex: none;
		border-radius: 50%;
		font-family: var(--font-display);
		font-size: 2rem;
		color: #fff;
		background: var(--accent);
	}
	.dash__titles {
		flex: 1;
		min-width: 0;
	}
	.dash__name {
		font-size: clamp(1.5rem, 4vw, 2.3rem);
		margin: 0;
	}
	.dash__sub {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-top: 0.3rem;
	}
	.yearpick {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		flex: none;
	}
	.yearpick select {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		background: var(--color-ink-800);
		color: var(--color-parch-100);
		border: 1px solid var(--color-ink-600);
		border-radius: 6px;
		padding: 0.3rem 0.5rem;
		cursor: pointer;
	}
	.dash__bar {
		height: 6px;
		border-radius: 99px;
		background: var(--color-ink-700);
		overflow: hidden;
		margin-bottom: 2.2rem;
	}
	.dash__bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-gold-600), var(--color-gold-300));
		transition: width 0.6s ease;
	}
</style>
