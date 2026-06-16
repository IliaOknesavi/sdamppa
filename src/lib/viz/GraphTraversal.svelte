<script lang="ts">
	// Interactive BFS/DFS traversal on a sample graph. Step / play / reset,
	// live frontier (queue/stack) + visited order. Pure SVG, no deps.
	type Step = {
		current: number | null;
		visited: number[];
		frontier: number[];
		edge: [number, number] | null;
		note: string;
	};

	const nodes = [
		{ id: 0, x: 70, y: 60, label: 'A' },
		{ id: 1, x: 200, y: 40, label: 'B' },
		{ id: 2, x: 90, y: 175, label: 'C' },
		{ id: 3, x: 230, y: 150, label: 'D' },
		{ id: 4, x: 150, y: 255, label: 'E' },
		{ id: 5, x: 330, y: 100, label: 'F' },
		{ id: 6, x: 350, y: 220, label: 'G' }
	];
	const edges: [number, number][] = [
		[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 6], [5, 6]
	];
	const adj: number[][] = nodes.map(() => []);
	for (const [a, b] of edges) {
		adj[a].push(b);
		adj[b].push(a);
	}
	for (const a of adj) a.sort((x, y) => x - y);

	function buildSteps(mode: 'bfs' | 'dfs', start = 0): Step[] {
		const steps: Step[] = [];
		const visited: number[] = [];
		const seen = new Set<number>();
		const frontier: number[] = [start];
		seen.add(start);
		steps.push({ current: null, visited: [], frontier: [...frontier], edge: null, note: `старт: ${nodes[start].label} в ${mode === 'bfs' ? 'очередь' : 'стек'}` });
		while (frontier.length) {
			const cur = mode === 'bfs' ? frontier.shift()! : frontier.pop()!;
			visited.push(cur);
			steps.push({ current: cur, visited: [...visited], frontier: [...frontier], edge: null, note: `посещаем ${nodes[cur].label}` });
			const neigh = mode === 'dfs' ? [...adj[cur]].reverse() : adj[cur];
			for (const nx of neigh) {
				if (!seen.has(nx)) {
					seen.add(nx);
					frontier.push(nx);
					steps.push({ current: cur, visited: [...visited], frontier: [...frontier], edge: [cur, nx], note: `${nodes[nx].label} → ${mode === 'bfs' ? 'очередь' : 'стек'}` });
				}
			}
		}
		steps.push({ current: null, visited: [...visited], frontier: [], edge: null, note: 'обход завершён' });
		return steps;
	}

	let mode = $state<'bfs' | 'dfs'>('bfs');
	let idx = $state(0);
	let playing = $state(false);
	const steps = $derived(buildSteps(mode));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);
	const visitedSet = $derived(new Set(cur.visited));
	const frontierSet = $derived(new Set(cur.frontier));

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= steps.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 750);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setMode(m: 'bfs' | 'dfs') {
		mode = m;
		reset();
	}
	function nodeState(id: number): string {
		if (cur.current === id) return 'current';
		if (visitedSet.has(id)) return 'visited';
		if (frontierSet.has(id)) return 'frontier';
		return 'idle';
	}
	function edgeActive(a: number, b: number): boolean {
		if (!cur.edge) return false;
		const [x, y] = cur.edge;
		return (x === a && y === b) || (x === b && y === a);
	}
</script>

<div class="gv">
	<div class="gv__bar">
		<div class="seg">
			<button class:on={mode === 'bfs'} onclick={() => setMode('bfs')}>BFS (очередь)</button>
			<button class:on={mode === 'dfs'} onclick={() => setMode('dfs')}>DFS (стек)</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(steps.length - 1, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{steps.length - 1}</span>
		</div>
	</div>

	<div class="gv__body">
		<svg viewBox="0 0 420 290" class="gv__svg">
			{#each edges as [a, b]}
				<line
					x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
					class="edge" class:active={edgeActive(a, b)}
				/>
			{/each}
			{#each nodes as n}
				<g class="node {nodeState(n.id)}">
					<circle cx={n.x} cy={n.y} r="20" />
					<text x={n.x} y={n.y} dy="0.35em">{n.label}</text>
				</g>
			{/each}
		</svg>

		<div class="gv__panel">
			<div class="row">
				<span class="lbl">{mode === 'bfs' ? 'Очередь' : 'Стек'}</span>
				<div class="chips">
					{#each cur.frontier as f}<span class="chip f">{nodes[f].label}</span>{:else}<span class="empty">—</span>{/each}
				</div>
			</div>
			<div class="row">
				<span class="lbl">Посещено</span>
				<div class="chips">
					{#each cur.visited as v}<span class="chip v">{nodes[v].label}</span>{:else}<span class="empty">—</span>{/each}
				</div>
			</div>
			<div class="note">{cur.note}</div>
		</div>
	</div>
</div>

<style>
	.gv {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.gv__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.seg {
		display: flex;
		gap: 0;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		overflow: hidden;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		padding: 0.4rem 0.8rem;
		border: none;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
	}
	.seg button.on {
		background: var(--blue);
		color: #fff;
	}
	.ctrl {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.ctrl button {
		width: 2rem;
		height: 2rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.8rem;
	}
	.ctrl button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}
	.gv__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.gv__svg {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 460px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.2s, stroke-width 0.2s;
	}
	.edge.active {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1rem;
		fill: var(--color-parch-100);
	}
	.node.frontier circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.visited circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.visited text {
		fill: #fff;
	}
	.node.current circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.current text {
		fill: #fff;
	}
	.gv__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		min-height: 1.8rem;
	}
	.chip {
		display: grid;
		place-items: center;
		min-width: 1.7rem;
		height: 1.7rem;
		padding: 0 0.4rem;
		border-radius: 6px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.82rem;
	}
	.chip.f {
		background: var(--blue-pale);
		color: var(--blue);
		border: 1.5px solid var(--blue);
	}
	.chip.v {
		background: var(--blue);
		color: #fff;
	}
	.empty {
		color: var(--color-parch-muted);
	}
	.note {
		margin-top: auto;
		font-size: 0.85rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
</style>
