<script lang="ts">
	import type { CodeBlock } from '$lib/types';
	import RichText from '$lib/engine/RichText.svelte';
	import InlineText from '$lib/engine/InlineText.svelte';
	import CodeView from './CodeView.svelte';
	import { runPython, py } from '$lib/engine/pyodide.svelte';

	let { block }: { block: CodeBlock } = $props();

	const runnable = $derived(block.language === 'python');
	let editing = $state(false); // python blocks: hover-разбор by default, ✎ to edit
	let code = $state(block.code);
	let output = $state('');
	let images = $state<string[]>([]);
	let error = $state(false);
	let running = $state(false);
	let ran = $state(false);
	let copied = $state(false);
	let colabSent = $state(false);

	async function run() {
		running = true;
		const res = await runPython(code);
		output = res.text;
		images = res.images ?? [];
		error = res.error;
		ran = true;
		running = false;
	}
	function reset() {
		code = block.code;
		output = '';
		images = [];
		ran = false;
		error = false;
	}
	function copy() {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1300);
		}
	}
	// Copy the snippet and open a fresh Colab notebook (torch + GPU preinstalled there).
	function openColab() {
		if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(code);
		if (typeof window !== 'undefined')
			window.open('https://colab.research.google.com/#create=true', '_blank', 'noopener');
		colabSent = true;
		setTimeout(() => (colabSent = false), 2600);
	}
	// Tab inserts spaces instead of leaving the textarea
	function onKey(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			e.preventDefault();
			const ta = e.currentTarget as HTMLTextAreaElement;
			const s = ta.selectionStart;
			const v = ta.value;
			code = v.slice(0, s) + '    ' + v.slice(ta.selectionEnd);
			queueMicrotask(() => (ta.selectionStart = ta.selectionEnd = s + 4));
		}
	}
	const lineCount = $derived(code.split('\n').length);
</script>

<div class="rc">
	<div class="rc__bar">
		<span class="rc__dot"></span>
		<span class="rc__title"><InlineText source={block.title} /></span>
		<span class="rc__lang">{block.language}{runnable ? (editing ? ' · правка' : ' · подсказки') : ' · только чтение'}</span>
		<button class="rc__btn ghost" onclick={copy}>{copied ? '✓' : 'копировать'}</button>
		{#if block.colab}
			<button class="rc__btn colab" onclick={openColab} title="Скопировать код и открыть Colab">▷ Colab</button>
		{/if}
		{#if runnable}
			<button class="rc__btn ghost" onclick={() => (editing = !editing)}>{editing ? '✓ готово' : '✎ править'}</button>
			{#if editing}
				<button class="rc__btn ghost" onclick={reset} disabled={code === block.code}>сброс</button>
			{/if}
			<button class="rc__btn run" onclick={run} disabled={running}>
				{#if running && py.status === 'loading'}загрузка Python…{:else if running}выполняется…{:else}▶ запустить{/if}
			</button>
		{/if}
	</div>

	{#if runnable && editing}
		<div class="rc__editor" style="--lines:{lineCount}">
			<textarea
				class="rc__ta"
				bind:value={code}
				onkeydown={onKey}
				spellcheck="false"
				autocapitalize="off"
				rows={lineCount}
			></textarea>
		</div>
	{:else}
		<CodeView {code} />
	{/if}

	{#if runnable && ((running && !ran) || output)}
		<div class="rc__out" class:err={error}>
			<div class="label">{error ? 'ошибка' : 'вывод'}</div>
			<pre>{running && !ran ? '…' : output}</pre>
		</div>
	{/if}

	{#if runnable && images.length}
		<div class="rc__figs">
			<div class="label">график</div>
			{#each images as img, i}
				<img class="rc__fig" src="data:image/png;base64,{img}" alt="график результата {i + 1}" />
			{/each}
		</div>
	{/if}

	{#if block.explanation}
		<div class="rc__exp">
			<div class="label">в коде / в проде</div>
			<RichText source={block.explanation} />
		</div>
	{/if}

	{#if runnable && py.status === 'idle' && !ran}
		<div class="rc__hint label">первый запуск подгрузит Python в браузер (~10 МБ, один раз)</div>
	{/if}

	{#if block.colab && !runnable}
		<div class="rc__hint label">это настоящий PyTorch — запусти в Colab (там torch и GPU уже стоят)</div>
	{/if}
	{#if colabSent}
		<div class="rc__hint label">код скопирован — вставь в новую ячейку Colab ↗</div>
	{/if}
</div>

<style>
	.rc {
		border: 1px solid var(--color-ink-600);
		border-radius: 12px;
		overflow: hidden;
		background: var(--color-ink-900);
		margin: 1rem 0;
	}
	.rc__bar {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.5rem 0.85rem;
		background: var(--color-ink-800);
		border-bottom: 1px solid var(--color-ink-600);
		flex-wrap: wrap;
	}
	.rc__dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: var(--color-verdant);
		box-shadow: 0 0 6px color-mix(in srgb, var(--color-verdant) 60%, transparent);
		flex: none;
	}
	.rc__title {
		font-family: var(--font-display);
		color: var(--color-parch-100);
		font-size: 0.95rem;
		flex: 1;
		min-width: 8rem;
	}
	.rc__lang {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.rc__btn {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		border-radius: 6px;
		padding: 0.25rem 0.6rem;
		cursor: pointer;
		transition: all 0.15s;
		border: 1px solid var(--color-ink-500);
	}
	.rc__btn.ghost {
		background: var(--color-ink-700);
		color: var(--color-parch-200);
	}
	.rc__btn.ghost:hover {
		background: var(--color-ink-600);
	}
	.rc__btn.ghost:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.rc__btn.colab {
		background: color-mix(in srgb, #f9ab00 20%, var(--color-ink-700));
		border-color: color-mix(in srgb, #f9ab00 55%, transparent);
		color: #f9ab00;
	}
	.rc__btn.colab:hover {
		background: color-mix(in srgb, #f9ab00 30%, var(--color-ink-700));
	}
	.rc__btn.run {
		background: linear-gradient(180deg, color-mix(in srgb, var(--color-verdant) 30%, var(--color-ink-700)), var(--color-ink-700));
		border-color: color-mix(in srgb, var(--color-verdant) 55%, transparent);
		color: var(--color-verdant);
	}
	.rc__btn.run:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-verdant) 24%, var(--color-ink-700));
	}
	.rc__btn.run:disabled {
		opacity: 0.7;
		cursor: progress;
	}
	.rc__editor {
		position: relative;
	}
	.rc__ta {
		display: block;
		width: 100%;
		box-sizing: border-box;
		resize: vertical;
		min-height: 3rem;
		padding: 0.9rem 1rem;
		border: none;
		outline: none;
		background: var(--color-ink-900);
		color: #d8dee9;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.55;
		tab-size: 4;
		white-space: pre;
		overflow-wrap: normal;
		overflow-x: auto;
	}
	.rc__ta:focus {
		background: #0c0d11;
	}
	.rc__ta[readonly] {
		resize: none;
		opacity: 0.95;
	}
	.rc__out {
		border-top: 1px solid var(--color-ink-700);
		padding: 0.6rem 1rem 0.8rem;
		background: var(--color-ink-850);
	}
	.rc__out.err {
		background: color-mix(in srgb, var(--color-rose) 8%, var(--color-ink-850));
	}
	.rc__out .label {
		color: var(--color-verdant);
		margin-bottom: 0.3rem;
	}
	.rc__out.err .label {
		color: var(--color-rose);
	}
	.rc__out pre {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--color-parch-100);
		white-space: pre-wrap;
		word-break: break-word;
	}
	.rc__out.err pre {
		color: var(--color-rose);
	}
	.rc__figs {
		border-top: 1px solid var(--color-ink-700);
		padding: 0.7rem 1rem 0.9rem;
		background: var(--color-ink-850);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.6rem;
	}
	.rc__figs .label {
		color: var(--color-verdant);
	}
	.rc__fig {
		max-width: 100%;
		height: auto;
		border-radius: 10px;
		background: #fff;
		padding: 0.5rem;
		border: 1px solid var(--color-ink-600);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
	}
	.rc__exp {
		padding: 0.85rem 1rem;
		border-top: 1px solid var(--color-ink-700);
		background: color-mix(in srgb, var(--color-verdant) 5%, var(--color-ink-850));
		font-size: 0.88rem;
	}
	.rc__exp .label {
		margin-bottom: 0.4rem;
		color: var(--color-verdant);
	}
	.rc__hint {
		padding: 0.5rem 1rem 0.7rem;
		font-size: 0.6rem;
		opacity: 0.7;
	}
</style>
