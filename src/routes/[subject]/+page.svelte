<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import XPBar from '$lib/components/XPBar.svelte';
	import { authoredDays } from '$lib/types';
	import { progress } from '$lib/stores/progress.svelte';

	let { data } = $props();
	const subject = $derived(data.subject);
	const pct = $derived(
		subject.days.length ? Math.round((progress.doneCount() / subject.days.length) * 100) : 0
	);
</script>

<div class="dash">
	<header class="dash__head">
		<div class="dash__top">
			<a class="dash__home" href="/">✦ Кодекс</a>
			<XPBar />
		</div>
		<div class="dash__hero reveal" style="--i:1">
			<div class="dash__seal">{subject.glyph}</div>
			<div>
				<h1 class="dash__name">{subject.name}</h1>
				<div class="dash__sub">
					{subject.days.length} дней · {authoredDays(subject)} готово · пройдено {progress.doneCount()} ({pct}%)
				</div>
			</div>
		</div>
		<div class="dash__bar reveal" style="--i:2">
			<div class="dash__bar-fill" style="width:{pct}%"></div>
		</div>
	</header>

	<Calendar {subject} />
</div>

<style>
	.dash {
		max-width: 1080px;
		margin: 0 auto;
		padding: 1.5rem 1.3rem 5rem;
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
		font-family: var(--font-display);
		font-size: 1.1rem;
		color: var(--color-gold-300);
		text-decoration: none;
		letter-spacing: 0.08em;
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
		color: var(--color-ink-900);
		background: radial-gradient(circle at 35% 30%, var(--color-gold-300), var(--accent) 60%, var(--color-gold-600));
		box-shadow: inset 0 -2px 6px rgba(0, 0, 0, 0.4), 0 0 18px var(--accent-soft);
	}
	.dash__name {
		font-size: clamp(1.7rem, 4vw, 2.6rem);
		margin: 0;
	}
	.dash__sub {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-top: 0.3rem;
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
