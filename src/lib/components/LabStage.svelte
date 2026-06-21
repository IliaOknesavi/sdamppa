<script lang="ts">
	import type { LabStage } from '$lib/types';
	import { runPython } from '$lib/engine/pyodide.svelte';
	import { cc, compileAndRunC } from '$lib/engine/cc.svelte';
	import LabIDE from './LabIDE.svelte';

	let { lab }: { lab: LabStage } = $props();

	let code = $state(lab.starter ?? '');
	let showSolution = $state(false);
	let output = $state('');
	let running = $state(false);
	let results = $state<{ name: string; ok: boolean; got: string }[]>([]);

	const isC = $derived(lab.language === 'c');

	async function run() {
		running = true;
		results = [];
		if (lab.language === 'python') {
			const r = await runPython(code);
			output = r.text;
		} else {
			const r = await compileAndRunC([{ path: 'main.c', content: code }]);
			output = r.text;
		}
		running = false;
	}
	function reset() {
		code = lab.starter ?? '';
		output = '';
		results = [];
	}
</script>

{#if lab.files?.length}
	<LabIDE files={lab.files} entry={lab.entry} />
{:else}
<div class="lab">
	<div class="lab__bar">
		<span class="lab__dot"></span>
		<span class="lab__title">Лаба · код прямо здесь</span>
		<span class="lab__lang">{lab.language}</span>
		<button class="lab__btn ghost" onclick={reset} disabled={code === lab.starter}>сброс</button>
		{#if lab.solution}
			<button class="lab__btn ghost" onclick={() => (showSolution = !showSolution)}>
				{showSolution ? 'скрыть решение' : 'решение'}
			</button>
		{/if}
		<button class="lab__btn run" onclick={run} disabled={running}>
			{running ? (isC && cc.status === 'loading' ? cc.detail || 'clang…' : '…') : '▶ запустить'}
		</button>
	</div>

	<!-- скринридер слышит смену состояния запуска и появление результата -->
	<div class="sr-only" role="status" aria-live="polite">
		{running ? 'Код выполняется' : output ? 'Готово, есть вывод' : ''}
	</div>

	<textarea class="lab__ed" bind:value={code} spellcheck="false" aria-label="Редактор кода лабы" rows={Math.max(8, code.split('\n').length)}></textarea>

	{#if output}
		<div class="lab__out" role="status" aria-live="polite"><div class="label">вывод</div><pre>{output}</pre></div>
	{/if}

	{#if showSolution && lab.solution}
		<div class="lab__sol"><div class="label">эталонное решение</div><pre>{lab.solution}</pre></div>
	{/if}

	{#if lab.tests?.length}
		<div class="lab__tests">
			<div class="label">тесты ({lab.tests.length})</div>
			{#each lab.tests as t, i}
				{@const r = results.find((x) => x.name === t.name)}
				<div class="test" class:ok={r?.ok} class:bad={r && !r.ok}>
					<span class="test__name">{t.name}</span>
					<span class="test__io">вход: <code>{t.stdin.trim() || '∅'}</code> → ждём: <code>{t.expect.trim()}</code></span>
				</div>
			{/each}
		</div>
	{/if}
</div>
{/if}

<style>
	.lab {
		border: 1.5px solid var(--blue);
		border-radius: 14px;
		overflow: hidden;
		background: var(--color-ink-850);
		margin: 1.2rem 0;
	}
	.lab__bar {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.6rem 0.9rem;
		background: color-mix(in srgb, var(--blue) 8%, var(--color-ink-800));
		border-bottom: 1.5px solid var(--blue);
		flex-wrap: wrap;
	}
	.lab__dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: var(--blue);
		flex: none;
	}
	.lab__title {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-parch-100);
		flex: 1;
		min-width: 8rem;
	}
	.lab__lang {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--blue);
	}
	.lab__btn {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		border-radius: 6px;
		padding: 0.25rem 0.6rem;
		cursor: pointer;
		border: 1.5px solid var(--color-ink-500);
		background: var(--color-ink-700);
		color: var(--color-parch-200);
	}
	.lab__btn.ghost:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.lab__btn.ghost:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.lab__btn.run {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.lab__ed {
		display: block;
		width: 100%;
		box-sizing: border-box;
		resize: vertical;
		min-height: 8rem;
		padding: 0.9rem 1rem;
		border: none;
		outline: none;
		background: #0c0d11;
		color: #d8dee9;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.55;
		tab-size: 4;
		white-space: pre;
		overflow-x: auto;
	}
	.lab__ed:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: -2px;
	}
	.lab__out,
	.lab__sol {
		padding: 0.6rem 1rem 0.8rem;
		border-top: 1px solid var(--color-ink-600);
	}
	.lab__out .label,
	.lab__sol .label {
		margin-bottom: 0.3rem;
		color: var(--blue);
	}
	.lab__out pre,
	.lab__sol pre {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--color-parch-100);
		white-space: pre-wrap;
		word-break: break-word;
	}
	.lab__tests {
		padding: 0.6rem 1rem 0.9rem;
		border-top: 1px solid var(--color-ink-600);
	}
	.lab__tests .label {
		margin-bottom: 0.4rem;
	}
	.test {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		padding: 0.35rem 0.5rem;
		border-radius: 6px;
		font-size: 0.8rem;
		border: 1px solid var(--color-ink-600);
		margin-bottom: 0.3rem;
	}
	.test.ok {
		border-color: var(--color-verdant);
		background: color-mix(in srgb, var(--color-verdant) 8%, transparent);
	}
	.test.bad {
		border-color: var(--color-rose);
		background: color-mix(in srgb, var(--color-rose) 8%, transparent);
	}
	.test__name {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-parch-100);
	}
	.test__io {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-muted);
	}
	.test code {
		color: var(--blue);
	}
</style>
