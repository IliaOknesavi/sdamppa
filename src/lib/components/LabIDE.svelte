<script lang="ts">
	import type { LabFile } from '$lib/types';

	let { files, entry }: { files: LabFile[]; entry?: string } = $props();

	type TNode = { name: string; path?: string; dir?: TNode[] };
	function buildTree(fs: LabFile[]): TNode[] {
		const root: TNode = { name: '', dir: [] };
		for (const f of fs) {
			const parts = f.path.split('/');
			let cur = root;
			parts.forEach((part, i) => {
				const isFile = i === parts.length - 1;
				let child = cur.dir!.find((c) => c.name === part && (isFile ? !!c.path : !!c.dir));
				if (!child) {
					child = isFile ? { name: part, path: f.path } : { name: part, dir: [] };
					cur.dir!.push(child);
				}
				if (!isFile) cur = child;
			});
		}
		const sort = (ns: TNode[]) => {
			ns.sort((a, b) => (!!a.dir === !!b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1));
			for (const n of ns) if (n.dir) sort(n.dir);
		};
		sort(root.dir!);
		return root.dir!;
	}

	const tree = buildTree(files);
	const byPath = new Map(files.map((f) => [f.path, f]));
	const initial = entry ?? files.find((f) => !f.readonly)?.path ?? files[0]?.path;

	let edits = $state<Record<string, string>>(Object.fromEntries(files.map((f) => [f.path, f.content])));
	let tabs = $state<string[]>(initial ? [initial] : []);
	let active = $state<string>(initial ?? '');
	let collapsed = $state<Record<string, boolean>>({});

	function open(path: string) {
		if (!tabs.includes(path)) tabs = [...tabs, path];
		active = path;
	}
	function close(path: string, e: MouseEvent) {
		e.stopPropagation();
		tabs = tabs.filter((t) => t !== path);
		if (active === path) active = tabs[tabs.length - 1] ?? '';
	}
	const activeFile = $derived(active ? byPath.get(active) : undefined);
	function icon(name: string) {
		if (name.endsWith('.c')) return '🅒';
		if (name.endsWith('.h')) return '🅗';
		if (name.endsWith('.py')) return '🐍';
		if (name.endsWith('.csv')) return '▦';
		if (name.endsWith('.md')) return '📄';
		if (name === 'Makefile') return '🛠';
		return '·';
	}
</script>

<div class="ide">
	<div class="ide__bar">
		<span class="ide__dot r"></span><span class="ide__dot y"></span><span class="ide__dot g"></span>
		<span class="ide__name">{active || 'лаба'}</span>
		<span class="ide__hint">реальные файлы лабы · редактируемые — без серого замка</span>
	</div>
	<div class="ide__main">
		<aside class="ide__tree">
			{#snippet node(n: TNode, depth: number)}
				{#if n.dir}
					<button class="row dir" style="padding-left:{depth * 0.8 + 0.4}rem" onclick={() => (collapsed[n.name + depth] = !collapsed[n.name + depth])}>
						<span class="caret">{collapsed[n.name + depth] ? '▸' : '▾'}</span>{n.name}
					</button>
					{#if !collapsed[n.name + depth]}
						{#each n.dir as c}{@render node(c, depth + 1)}{/each}
					{/if}
				{:else}
					{@const f = byPath.get(n.path!)}
					<button
						class="row file"
						class:active={active === n.path}
						class:ro={f?.readonly}
						style="padding-left:{depth * 0.8 + 0.7}rem"
						onclick={() => open(n.path!)}
					>
						<span class="fi">{icon(n.name)}</span>{n.name}{#if f?.readonly}<span class="lock">🔒</span>{/if}
					</button>
				{/if}
			{/snippet}
			{#each tree as n}{@render node(n, 0)}{/each}
		</aside>
		<div class="ide__editor">
			<div class="ide__tabs">
				{#each tabs as t}
					<button class="tab" class:active={active === t} onclick={() => (active = t)}>
						{t.split('/').pop()}
						<span class="tab__x" onclick={(e) => close(t, e)}>✕</span>
					</button>
				{/each}
			</div>
			{#if activeFile}
				{#if activeFile.readonly}
					<pre class="ide__view">{edits[active]}</pre>
				{:else}
					<textarea class="ide__ta" bind:value={edits[active]} spellcheck="false"></textarea>
				{/if}
			{:else}
				<div class="ide__empty">Выбери файл слева</div>
			{/if}
		</div>
	</div>
	<div class="ide__foot">
		<button class="ide__run">собрать и проверить</button>
		<span class="ide__note">компиляция C прямо в браузере подключается следующим шагом — пока редактируй и сверяйся с тестами</span>
	</div>
</div>

<style>
	.ide {
		border: 1.5px solid var(--blue);
		border-radius: 12px;
		overflow: hidden;
		margin: 1.2rem 0;
		background: #0c0d11;
		font-family: var(--font-mono);
	}
	.ide__bar {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 0.8rem;
		background: #15171d;
		border-bottom: 1px solid #23262e;
	}
	.ide__dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
	}
	.ide__dot.r { background: #ff5f57; }
	.ide__dot.y { background: #febc2e; }
	.ide__dot.g { background: #28c840; }
	.ide__name {
		margin-left: 0.6rem;
		color: #d8dee9;
		font-size: 0.78rem;
	}
	.ide__hint {
		margin-left: auto;
		color: #6b7280;
		font-size: 0.62rem;
	}
	.ide__main {
		display: flex;
		min-height: 320px;
	}
	.ide__tree {
		width: 220px;
		flex: none;
		background: #0f1117;
		border-right: 1px solid #23262e;
		padding: 0.4rem 0;
		overflow: auto;
		max-height: 460px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		color: #c4c9d4;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		padding: 0.2rem 0.5rem;
		cursor: pointer;
		white-space: nowrap;
	}
	.row:hover { background: #1a1d25; }
	.row.file.active { background: color-mix(in srgb, var(--blue) 30%, #1a1d25); color: #fff; }
	.row.ro { color: #7e8794; }
	.caret { width: 0.8rem; color: #6b7280; }
	.fi { width: 1rem; }
	.lock { margin-left: auto; font-size: 0.6rem; opacity: 0.6; }
	.ide__editor { flex: 1; display: flex; flex-direction: column; min-width: 0; }
	.ide__tabs {
		display: flex;
		overflow-x: auto;
		background: #15171d;
		border-bottom: 1px solid #23262e;
	}
	.tab {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.7rem;
		background: none;
		border: none;
		border-right: 1px solid #23262e;
		color: #9aa3b2;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		cursor: pointer;
		white-space: nowrap;
	}
	.tab.active {
		background: #0c0d11;
		color: #fff;
		box-shadow: inset 0 2px 0 var(--blue);
	}
	.tab__x { opacity: 0.5; }
	.tab__x:hover { opacity: 1; color: #ff5f57; }
	.ide__ta,
	.ide__view {
		flex: 1;
		margin: 0;
		padding: 0.9rem 1rem;
		border: none;
		outline: none;
		resize: none;
		background: #0c0d11;
		color: #d8dee9;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.55;
		tab-size: 4;
		white-space: pre;
		overflow: auto;
		min-height: 300px;
	}
	.ide__empty { padding: 2rem; color: #6b7280; }
	.ide__foot {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.5rem 0.8rem;
		background: #15171d;
		border-top: 1px solid #23262e;
		flex-wrap: wrap;
	}
	.ide__run {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		background: var(--blue);
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 0.35rem 0.8rem;
		cursor: pointer;
	}
	.ide__note { color: #6b7280; font-size: 0.62rem; }
</style>
