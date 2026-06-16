<script lang="ts">
	// Алгоритм Прима: остовное дерево минимального веса (MST) растёт из старта.
	// На каждом шаге подсвечивается разрез (T, V\T), рёбра через разрез,
	// извлекается минимальное (мин-куча по key[v]), его конец входит в T,
	// затем релаксация: для соседей если w < key[v] — обновляем key/parent.
	// Контролы: шаг роста / выбор старта / сброс. Чистый SVG, без зависимостей.
	type Pt = { x: number; y: number; label: string };
	type E = { a: number; b: number; w: number };

	const R = 18;
	const INF = Infinity;

	const nodes: Pt[] = [
		{ x: 60, y: 70, label: 'A' },
		{ x: 195, y: 50, label: 'B' },
		{ x: 330, y: 75, label: 'C' },
		{ x: 80, y: 200, label: 'D' },
		{ x: 210, y: 165, label: 'E' },
		{ x: 340, y: 205, label: 'F' }
	];
	const edges: E[] = [
		{ a: 0, b: 1, w: 4 },
		{ a: 0, b: 3, w: 3 },
		{ a: 1, b: 2, w: 5 },
		{ a: 1, b: 3, w: 8 },
		{ a: 1, b: 4, w: 2 },
		{ a: 2, b: 4, w: 7 },
		{ a: 2, b: 5, w: 6 },
		{ a: 3, b: 4, w: 9 },
		{ a: 4, b: 5, w: 1 }
	];
	const N = nodes.length;

	// смежность: список (сосед, вес, индекс ребра)
	const adj: { to: number; w: number; ei: number }[][] = nodes.map(() => []);
	edges.forEach((e, i) => {
		adj[e.a].push({ to: e.b, w: e.w, ei: i });
		adj[e.b].push({ to: e.a, w: e.w, ei: i });
	});

	type Step = {
		inTree: boolean[]; // T
		key: number[]; // min вес ребра из v до T
		parent: number[]; // ребро, дающее key[v] (родитель в MST)
		treeEdges: number[]; // индексы рёбер, вошедших в MST
		picked: number | null; // вершина, извлечённая на этом шаге
		pickedEdge: number | null; // ребро разреза, по которому вошли
		relaxed: number[]; // вершины, чей key обновился на этом шаге
		mstWeight: number;
		note: string;
		phase: 'init' | 'extract' | 'relax' | 'done';
	};

	function buildSteps(start: number): Step[] {
		const steps: Step[] = [];
		const inTree = new Array<boolean>(N).fill(false);
		const key = new Array<number>(N).fill(INF);
		const parent = new Array<number>(N).fill(-1);
		const treeEdges: number[] = [];
		let mstWeight = 0;

		key[start] = 0;
		steps.push({
			inTree: [...inTree],
			key: [...key],
			parent: [...parent],
			treeEdges: [...treeEdges],
			picked: null,
			pickedEdge: null,
			relaxed: [start],
			mstWeight,
			phase: 'init',
			note: `Старт: ${nodes[start].label}, key[${nodes[start].label}] = 0, остальные = ∞.`
		});

		for (let it = 0; it < N; it++) {
			// извлечение минимума из кучи: вершина V\T с наименьшим key
			let u = -1;
			let best = INF;
			for (let v = 0; v < N; v++) {
				if (!inTree[v] && key[v] < best) {
					best = key[v];
					u = v;
				}
			}
			if (u === -1) break; // граф несвязный (не наш случай)

			inTree[u] = true;
			const pe = parent[u];
			if (pe !== -1) {
				treeEdges.push(pe);
				mstWeight += edges[pe].w;
			}
			steps.push({
				inTree: [...inTree],
				key: [...key],
				parent: [...parent],
				treeEdges: [...treeEdges],
				picked: u,
				pickedEdge: pe,
				relaxed: [],
				mstWeight,
				phase: 'extract',
				note:
					pe === -1
						? `Извлекаем ${nodes[u].label} (key = 0) — корень дерева T.`
						: `Мин. ребро разреза: ${nodes[edges[pe].a].label}–${nodes[edges[pe].b].label} (вес ${edges[pe].w}). ${nodes[u].label} входит в T.`
			});

			// релаксация: соседи u вне T
			const relaxed: number[] = [];
			for (const { to, w } of adj[u]) {
				if (!inTree[to] && w < key[to]) {
					key[to] = w;
					parent[to] = adj[u].find((x) => x.to === to && x.w === w)!.ei;
					relaxed.push(to);
				}
			}
			if (relaxed.length) {
				const list = relaxed
					.map((v) => `key[${nodes[v].label}] = ${key[v]}`)
					.join(', ');
				steps.push({
					inTree: [...inTree],
					key: [...key],
					parent: [...parent],
					treeEdges: [...treeEdges],
					picked: u,
					pickedEdge: null,
					relaxed: [...relaxed],
					mstWeight,
					phase: 'relax',
					note: `Релаксация соседей ${nodes[u].label}: w < key[v] ⇒ ${list}.`
				});
			}
		}

		steps.push({
			inTree: [...inTree],
			key: [...key],
			parent: [...parent],
			treeEdges: [...treeEdges],
			picked: null,
			pickedEdge: null,
			relaxed: [],
			mstWeight,
			phase: 'done',
			note: `MST построено: ${treeEdges.length} рёбер, суммарный вес = ${mstWeight}.`
		});
		return steps;
	}

	let start = $state(0);
	let idx = $state(0);
	let playing = $state(false);
	const steps = $derived(buildSteps(start));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// множество рёбер разреза (T, V\T): один конец в T, другой — нет
	const cutEdges = $derived(
		new Set(
			edges
				.map((e, i) => i)
				.filter((i) => cur.inTree[edges[i].a] !== cur.inTree[edges[i].b])
		)
	);

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
		}, 850);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setStart(s: number) {
		start = s;
		reset();
	}

	function nodeState(id: number): string {
		if (cur.picked === id) return 'picked';
		if (cur.inTree[id]) return 'tree';
		if (cur.relaxed.includes(id)) return 'relaxed';
		return 'idle';
	}
	function edgeState(i: number): string {
		if (cur.treeEdges.includes(i)) return 'mst';
		if (cur.pickedEdge === i) return 'picked';
		if (cutEdges.has(i)) return 'cut';
		return 'idle';
	}
	function mid(e: E) {
		const p = nodes[e.a];
		const q = nodes[e.b];
		return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
	}
	function fmtKey(v: number): string {
		return cur.key[v] === INF ? '∞' : String(cur.key[v]);
	}
</script>

<div class="pm">
	<div class="pm__bar">
		<div class="seg">
			<span class="seg-lbl">старт</span>
			{#each nodes as n, i}
				<button class:on={start === i} onclick={() => setStart(i)}>{n.label}</button>
			{/each}
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="шаг роста">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(steps.length - 1, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{steps.length - 1}</span>
		</div>
	</div>

	<div class="pm__body">
		<svg viewBox="0 0 420 290" class="pm__svg">
			{#each edges as e, i}
				{@const m = mid(e)}
				<line
					x1={nodes[e.a].x} y1={nodes[e.a].y}
					x2={nodes[e.b].x} y2={nodes[e.b].y}
					class="edge {edgeState(i)}"
				/>
				<g class="wlabel {edgeState(i)}">
					<rect x={m.x - 9} y={m.y - 9} width="18" height="16" rx="4" />
					<text x={m.x} y={m.y} dy="0.32em">{e.w}</text>
				</g>
			{/each}
			{#each nodes as n, i}
				<g class="node {nodeState(i)}">
					<circle cx={n.x} cy={n.y} r={R} />
					<text x={n.x} y={n.y} dy="0.34em">{n.label}</text>
					<text x={n.x} y={n.y + R + 11} class="keytag">{fmtKey(i)}</text>
				</g>
			{/each}
		</svg>

		<div class="pm__panel">
			<div class="row">
				<span class="lbl">key[v] — мин. ребро до T</span>
				<div class="keys">
					{#each nodes as n, i}
						<div class="kcell" class:tree={cur.inTree[i]} class:relaxed={cur.relaxed.includes(i)} class:picked={cur.picked === i}>
							<b>{n.label}</b>
							<i>{fmtKey(i)}</i>
						</div>
					{/each}
				</div>
			</div>
			<div class="row">
				<span class="lbl">дерево T</span>
				<div class="chips">
					{#each nodes.filter((_, i) => cur.inTree[i]) as n}
						<span class="chip t">{n.label}</span>
					{:else}
						<span class="empty">—</span>
					{/each}
				</div>
			</div>
			<div class="legend">
				<span><i class="sw cut"></i> разрез</span>
				<span><i class="sw mst"></i> ребро MST</span>
				<span class="w">Σ = {cur.mstWeight}</span>
			</div>
			<div class="note">{cur.note}</div>
		</div>
	</div>
</div>

<style>
	.pm {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.pm__bar {
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
		align-items: center;
		gap: 0.3rem;
		flex-wrap: wrap;
	}
	.seg-lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		margin-right: 0.2rem;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		width: 1.9rem;
		height: 1.9rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover { border-color: var(--blue); color: var(--blue); }
	.seg button.on { background: var(--blue); color: #fff; border-color: var(--blue); }
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
	.pm__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.pm__svg {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 470px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.25s, stroke-width 0.25s;
	}
	.edge.cut {
		stroke: var(--blue);
		stroke-width: 3;
		stroke-dasharray: 6 4;
	}
	.edge.picked {
		stroke: var(--blue);
		stroke-width: 5;
	}
	.edge.mst {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.wlabel rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-width: 1;
		transition: stroke 0.25s;
	}
	.wlabel text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
		fill: var(--color-parch-muted);
		transition: fill 0.25s;
	}
	.wlabel.cut rect, .wlabel.picked rect, .wlabel.mst rect { stroke: var(--blue); }
	.wlabel.cut text, .wlabel.picked text, .wlabel.mst text { fill: var(--blue); }
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
		font-size: 0.95rem;
		fill: var(--color-parch-100);
	}
	.node .keytag {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		font-weight: 700;
		fill: var(--color-parch-muted);
	}
	.node.relaxed circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.relaxed .keytag { fill: var(--blue); }
	.node.tree circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.tree text { fill: #fff; }
	.node.picked circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.picked text { fill: #fff; }
	.pm__panel {
		flex: 1 1 230px;
		min-width: 210px;
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
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.keys {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.kcell {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 2rem;
		padding: 0.22rem 0.3rem;
		border-radius: 6px;
		border: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		transition: all 0.2s;
	}
	.kcell b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.76rem;
		color: var(--color-parch-100);
	}
	.kcell i {
		font-family: var(--font-mono);
		font-style: normal;
		font-size: 0.68rem;
		color: var(--color-parch-muted);
	}
	.kcell.relaxed {
		border-color: var(--blue);
		background: var(--blue-pale);
	}
	.kcell.relaxed i { color: var(--blue); }
	.kcell.tree {
		border-color: var(--blue);
		background: var(--blue);
	}
	.kcell.tree b, .kcell.tree i { color: #fff; }
	.kcell.picked {
		border-color: var(--color-parch-100);
		background: var(--blue);
	}
	.kcell.picked b, .kcell.picked i { color: #fff; }
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		min-height: 1.7rem;
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
	.chip.t {
		background: var(--blue);
		color: #fff;
	}
	.empty { color: var(--color-parch-muted); }
	.legend {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		flex-wrap: wrap;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-200);
	}
	.legend span { display: flex; align-items: center; gap: 0.3rem; }
	.legend .w {
		margin-left: auto;
		color: var(--blue);
		font-weight: 700;
	}
	.sw {
		display: inline-block;
		width: 16px;
		height: 0;
		border-top-width: 3px;
		border-top-style: solid;
	}
	.sw.cut { border-top-color: var(--blue); border-top-style: dashed; }
	.sw.mst { border-top-color: var(--blue); border-top-width: 4px; }
	.note {
		margin-top: auto;
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
</style>
