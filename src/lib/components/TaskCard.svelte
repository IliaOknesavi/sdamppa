<script lang="ts">
	import type { Task } from '$lib/types';
	import { progress } from '$lib/stores/progress.svelte';
	import RichText from '$lib/engine/RichText.svelte';
	import Icon from './Icon.svelte';

	let { task, index }: { task: Task; index: number } = $props();
	let showHint = $state(false);
	let showSol = $state(false);
	const done = $derived(progress.isTaskDone(task.id));
</script>

<div class="task" class:done>
	<div class="task__head">
		<button
			class="task__check"
			aria-label="отметить решённой"
			onclick={() => progress.toggleTask(task.id, task.xp ?? 12)}
		>
			{done ? '✓' : ''}
		</button>
		<span class="task__num">Задача {index}</span>
		<span class="task__badge {task.difficulty}">
			{task.difficulty === 'star' ? '★ со звёздочкой' : 'базовая'}
		</span>
		<span class="task__xp">+{task.xp ?? 12} XP</span>
	</div>

	<div class="task__prompt"><RichText source={task.prompt} /></div>

	<div class="task__actions">
		{#if task.hint}
			<button class="task__btn" onclick={() => (showHint = !showHint)}>
				{#if showHint}скрыть подсказку{:else}<Icon name="bulb" size={13} /> подсказка{/if}
			</button>
		{/if}
		<button class="task__btn" onclick={() => (showSol = !showSol)}>
			{showSol ? 'скрыть решение' : 'показать решение'}
		</button>
	</div>

	{#if showHint && task.hint}
		<div class="task__hint"><RichText source={task.hint} /></div>
	{/if}
	{#if showSol}
		<div class="task__sol">
			<div class="label">решение</div>
			<RichText source={task.solution} />
			{#if task.answer}
				<div class="task__ans"><span class="label">ответ</span> <RichText source={task.answer} /></div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.task {
		border: 1px solid var(--color-ink-600);
		border-radius: 12px;
		padding: 0.9rem 1rem;
		background: var(--color-ink-800);
		margin: 0.8rem 0;
		transition: border-color 0.2s;
	}
	.task.done {
		border-color: color-mix(in srgb, var(--color-verdant) 55%, transparent);
		background: color-mix(in srgb, var(--color-verdant) 5%, var(--color-ink-800));
	}
	.task__head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.55rem;
	}
	.task__check {
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 6px;
		border: 1px solid var(--color-ink-500);
		background: var(--color-ink-900);
		color: var(--color-verdant);
		cursor: pointer;
		font-size: 0.85rem;
		display: grid;
		place-items: center;
		flex: none;
		transition: all 0.15s;
	}
	.done .task__check {
		background: var(--color-verdant);
		color: var(--color-ink-900);
		border-color: var(--color-verdant);
	}
	.task__num {
		font-family: var(--font-display);
		color: var(--color-parch-100);
	}
	.task__badge {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.12rem 0.45rem;
		border-radius: 99px;
		border: 1px solid var(--color-ink-500);
		color: var(--color-parch-muted);
	}
	.task__badge.star {
		color: var(--color-rose);
		border-color: color-mix(in srgb, var(--color-rose) 45%, transparent);
	}
	.task__xp {
		margin-left: auto;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-gold-400);
	}
	.task__prompt {
		font-size: 0.92rem;
	}
	.task__actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.7rem;
		flex-wrap: wrap;
	}
	.task__btn {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		background: var(--color-ink-700);
		border: 1px solid var(--color-ink-500);
		color: var(--color-parch-200);
		border-radius: 7px;
		padding: 0.3rem 0.7rem;
		cursor: pointer;
		transition: background 0.15s;
	}
	.task__btn:hover {
		background: var(--color-ink-600);
	}
	.task__hint,
	.task__sol {
		margin-top: 0.6rem;
		padding: 0.7rem 0.85rem;
		border-radius: 9px;
		font-size: 0.88rem;
		animation: popIn 0.18s ease;
	}
	.task__hint {
		background: color-mix(in srgb, var(--color-azure) 9%, var(--color-ink-850));
		border: 1px solid color-mix(in srgb, var(--color-azure) 30%, transparent);
	}
	.task__sol {
		background: var(--color-ink-850);
		border: 1px solid var(--color-ink-600);
	}
	.task__sol .label {
		color: var(--color-gold-400);
		margin-bottom: 0.35rem;
	}
	.task__ans {
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px dashed var(--color-ink-600);
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
	}
</style>
