<script lang="ts">
	import { progress, rankFor } from '$lib/stores/progress.svelte';
	const info = $derived(rankFor(progress.data.xp));
</script>

<div class="xp">
	<div class="xp__top">
		<span class="xp__rank">{info.rank.name}</span>
		<span class="xp__xp">{progress.data.xp} XP</span>
	</div>
	<div class="xp__track" title={info.next ? `до ранга «${info.next.name}»` : 'максимальный ранг'}>
		<div class="xp__fill" style="width:{info.pct}%"></div>
	</div>
	<div class="xp__meta">
		<span>🔥 стрик {progress.data.streak}</span>
		<span>{progress.doneCount()} дн · {progress.taskCount()} задач · {progress.termCount()} терм.</span>
	</div>
</div>

<style>
	.xp {
		min-width: 220px;
	}
	.xp__top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.3rem;
	}
	.xp__rank {
		font-family: var(--font-display);
		font-size: 1.05rem;
		color: var(--color-gold-300);
	}
	.xp__xp {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-parch-muted);
	}
	.xp__track {
		height: 7px;
		border-radius: 99px;
		background: var(--color-ink-700);
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
	}
	.xp__fill {
		height: 100%;
		border-radius: 99px;
		background: linear-gradient(90deg, var(--color-gold-600), var(--color-gold-300));
		box-shadow: 0 0 8px var(--accent-soft);
		transition: width 0.6s cubic-bezier(0.2, 0.8, 0.3, 1);
	}
	.xp__meta {
		display: flex;
		justify-content: space-between;
		gap: 0.6rem;
		margin-top: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
	}
</style>
