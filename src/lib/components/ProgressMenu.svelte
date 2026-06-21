<script lang="ts">
	import { progress } from '$lib/stores/progress.svelte';

	let open = $state(false);
	let msg = $state('');
	let fileInput: HTMLInputElement | undefined = $state();

	function download() {
		const blob = new Blob([progress.exportAll()], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'sdamppa-progress.json';
		a.click();
		URL.revokeObjectURL(url);
		msg = 'Прогресс выгружен в файл';
	}
	async function onFile(e: Event) {
		const el = e.currentTarget as HTMLInputElement;
		const f = el.files?.[0];
		if (!f) return;
		const r = progress.importAll(await f.text());
		msg = r.ok ? `Загружено курсов: ${r.count}` : `Ошибка: ${r.error}`;
		el.value = '';
	}
	function resetCourse() {
		if (confirm('Сбросить прогресс этого курса? Действие необратимо.')) {
			progress.reset();
			msg = 'Прогресс курса сброшен';
		}
	}
</script>

<div class="pm">
	<button
		class="pm__btn"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-label="Управление прогрессом"
		title="Управление прогрессом">⋯</button
	>
	{#if open}
		<div class="pm__menu" role="menu">
			<button role="menuitem" onclick={download}>Скачать прогресс</button>
			<button role="menuitem" onclick={() => fileInput?.click()}>Загрузить прогресс</button>
			<button role="menuitem" class="danger" onclick={resetCourse}>Сбросить этот курс</button>
			{#if msg}<div class="pm__msg" role="status" aria-live="polite">{msg}</div>{/if}
		</div>
	{/if}
	<input
		bind:this={fileInput}
		type="file"
		accept="application/json,.json"
		class="sr-only"
		onchange={onFile}
	/>
</div>

<style>
	.pm {
		position: relative;
		flex: none;
	}
	.pm__btn {
		font-family: var(--font-mono);
		font-size: 1rem;
		line-height: 1;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		border: 1px solid var(--color-ink-600);
		background: var(--color-ink-800);
		color: var(--color-parch-300);
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
	}
	.pm__btn:hover {
		color: var(--accent);
		border-color: var(--accent);
	}
	.pm__menu {
		position: absolute;
		right: 0;
		top: calc(100% + 0.4rem);
		z-index: 50;
		display: flex;
		flex-direction: column;
		min-width: 12rem;
		padding: 0.3rem;
		border-radius: 10px;
		border: 1px solid var(--color-ink-600);
		background: var(--color-ink-850);
		box-shadow: 0 16px 40px -16px rgba(0, 0, 0, 0.5);
	}
	.pm__menu button {
		text-align: left;
		font-size: 0.8rem;
		padding: 0.45rem 0.6rem;
		border-radius: 6px;
		border: none;
		background: none;
		color: var(--color-parch-200);
		cursor: pointer;
	}
	.pm__menu button:hover {
		background: var(--color-ink-700);
	}
	.pm__menu .danger:hover {
		color: var(--color-rose);
	}
	.pm__msg {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
		padding: 0.35rem 0.6rem 0.1rem;
	}
</style>
