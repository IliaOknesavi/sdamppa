<script lang="ts">
	// Interactive Kruskal MST on a weighted graph. Edges processed in ascending
	// weight (side list). Green edge = taken (UNION of two distinct components),
	// red = skipped (cycle, FIND matched). DSU components colour the vertices.
	// Live MST weight + edge counter to |V|-1. Step / reset. Pure SVG, no deps.
	type Node = { id: number; x: number; y: number; label: string };
	type Edge = { a: number; b: number; w: number };
	type Verdict = 'take' | 'skip';
	type Step = {
		// едж рассматриваемый на этом шаге (индекс в sorted), либо null до старта/после финала
		ei: number | null;
		verdict: Verdict | null;
		// состояние ПОСЛЕ обработки рёбер 0..ei (включительно, если verdict задан)
		parent: number[]; // снимок DSU (компонента вершины = find)
		taken: number[]; // индексы взятых рёбер (в sorted)
		rejected: number[]; // индексы пропущенных рёбер
		weight: number; // суммарный вес MST
		count: number; // взятых рёбер
		note: string;
	};

	const nodes: Node[] = [
		{ id: 0, x: 70, y: 60, label: 'A' },
		{ id: 1, x: 200, y: 45, label: 'B' },
		{ id: 2, x: 330, y: 70, label: 'C' },
		{ id: 3, x: 90, y: 180, label: 'D' },
		{ id: 4, x: 215, y: 160, label: 'E' },
		{ id: 5, x: 340, y: 195, label: 'F' },
		{ id: 6, x: 160, y: 255, label: 'G' }
	];
	const V = nodes.length;

	const rawEdges: Edge[] = [
		{ a: 0, b: 1, w: 7 },
		{ a: 0, b: 3, w: 5 },
		{ a: 1, b: 2, w: 8 },
		{ a: 1, b: 3, w: 9 },
		{ a: 1, b: 4, w: 7 },
		{ a: 2, b: 4, w: 5 },
		{ a: 2, b: 5, w: 6 },
		{ a: 3, b: 4, w: 15 },
		{ a: 3, b: 6, w: 6 },
		{ a: 4, b: 5, w: 8 },
		{ a: 4, b: 6, w: 11 },
		{ a: 5, b: 6, w: 9 }
	];
	// рёбра по возрастанию веса (стабильно по (a,b) при равном весе)
	const sorted: Edge[] = [...rawEdges].sort((p, q) => p.w - q.w || p.a - q.a || p.b - q.b);

	// --- DSU с поиском корня сжатием путей ---
	function find(parent: number[], x: number): number {
		while (parent[x] !== x) {
			parent[x] = parent[parent[x]];
			x = parent[x];
		}
		return x;
	}

	function buildSteps(): Step[] {
		const steps: Step[] = [];
		const parent = Array.from({ length: V }, (_, i) => i);
		const rank = new Array<number>(V).fill(0);
		const taken: number[] = [];
		const rejected: number[] = [];
		let weight = 0;

		const snap = (): number[] => parent.map((_, i) => find(parent, i));

		steps.push({
			ei: null,
			verdict: null,
			parent: snap(),
			taken: [],
			rejected: [],
			weight: 0,
			count: 0,
			note: `Старт: ${V} вершин — ${V} отдельных компонент. Нужно ${V - 1} ребро.`
		});

		for (let i = 0; i < sorted.length; i++) {
			const e = sorted[i];
			const ra = find(parent, e.a);
			const rb = find(parent, e.b);
			if (ra !== rb) {
				// UNION по рангу
				if (rank[ra] < rank[rb]) parent[ra] = rb;
				else if (rank[ra] > rank[rb]) parent[rb] = ra;
				else {
					parent[rb] = ra;
					rank[ra] += 1;
				}
				taken.push(i);
				weight += e.w;
				steps.push({
					ei: i,
					verdict: 'take',
					parent: snap(),
					taken: [...taken],
					rejected: [...rejected],
					weight,
					count: taken.length,
					note: `${nodes[e.a].label}–${nodes[e.b].label} (${e.w}): FIND разный → UNION. Ребро в MST.`
				});
				if (taken.length === V - 1) {
					steps.push({
						ei: null,
						verdict: null,
						parent: snap(),
						taken: [...taken],
						rejected: [...rejected],
						weight,
						count: taken.length,
						note: `Готово: взято ${V - 1} ребро, MST построено. Суммарный вес = ${weight}.`
					});
					return steps;
				}
			} else {
				rejected.push(i);
				steps.push({
					ei: i,
					verdict: 'skip',
					parent: snap(),
					taken: [...taken],
					rejected: [...rejected],
					weight,
					count: taken.length,
					note: `${nodes[e.a].label}–${nodes[e.b].label} (${e.w}): FIND совпал → цикл. Ребро пропущено.`
				});
			}
		}
		return steps;
	}

	const steps: Step[] = buildSteps();

	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// цвет компоненты: уникальный корень → индекс палитры
	const palette = ['var(--blue)', '#d99a2b', '#3fa66a', '#c0556b', '#8a6fd0', '#3f97a6', '#c77d3a'];
	const compColor = $derived.by(() => {
		const roots = [...new Set(cur.parent)].sort((a, b) => a - b);
		const map = new Map<number, string>();
		roots.forEach((r, i) => map.set(r, palette[i % palette.length]));
		return (id: number) => map.get(cur.parent[id]) ?? 'var(--color-ink-500)';
	});
	const takenSet = $derived(new Set(cur.taken));
	const rejectedSet = $derived(new Set(cur.rejected));

	function edgeClass(i: number): string {
		if (cur.ei === i) return cur.verdict === 'take' ? 'take cur' : 'skip cur';
		if (takenSet.has(i)) return 'take';
		if (rejectedSet.has(i)) return 'skip';
		return 'idle';
	}
	function listClass(i: number): string {
		if (cur.ei === i) return 'cur';
		if (takenSet.has(i)) return 'take';
		if (rejectedSet.has(i)) return 'skip';
		return '';
	}
	function mid(e: Edge) {
		return { x: (nodes[e.a].x + nodes[e.b].x) / 2, y: (nodes[e.a].y + nodes[e.b].y) / 2 };
	}

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
		}, 900);
	}
	function reset() {
		stop();
		idx = 0;
	}
</script>

<div class="gv">
	<div class="gv__bar">
		<div class="title">Алгоритм Краскала · MST</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(steps.length - 1, idx + 1); }} title="следующее ребро">▶▶</button>
			<span class="cnt">{idx}/{steps.length - 1}</span>
		</div>
	</div>

	<div class="gv__body">
		<svg viewBox="0 0 420 290" class="gv__svg">
			{#each sorted as e, i}
				<line
					x1={nodes[e.a].x} y1={nodes[e.a].y} x2={nodes[e.b].x} y2={nodes[e.b].y}
					class="edge {edgeClass(i)}"
				/>
			{/each}
			{#each sorted as e, i}
				{@const m = mid(e)}
				<g class="wlabel {edgeClass(i)}">
					<rect x={m.x - 9} y={m.y - 8} width="18" height="16" rx="4" />
					<text x={m.x} y={m.y} dy="0.32em">{e.w}</text>
				</g>
			{/each}
			{#each nodes as n}
				<g class="node">
					<circle cx={n.x} cy={n.y} r="18" style="fill: {compColor(n.id)}; stroke: {compColor(n.id)}" />
					<text x={n.x} y={n.y} dy="0.34em">{n.label}</text>
				</g>
			{/each}
		</svg>

		<div class="gv__panel">
			<div class="stats">
				<div class="stat">
					<span>взято рёбер</span>
					<b>{cur.count} / {V - 1}</b>
				</div>
				<div class="stat">
					<span>вес MST</span>
					<b>{cur.weight}</b>
				</div>
			</div>

			<div class="elist">
				<div class="elist-head">рёбра ↑ по весу</div>
				<div class="elist-rows">
					{#each sorted as e, i}
						<div class="erow {listClass(i)}">
							<span class="epair">{nodes[e.a].label}–{nodes[e.b].label}</span>
							<span class="ew">{e.w}</span>
							<span class="emark">
								{#if takenSet.has(i)}✓{:else if rejectedSet.has(i)}✕{:else if cur.ei === i}●{:else}·{/if}
							</span>
						</div>
					{/each}
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
	.title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.86rem;
		color: var(--color-parch-100);
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
		transition: stroke 0.25s, stroke-width 0.25s;
	}
	.edge.idle {
		stroke: var(--color-ink-500);
	}
	.edge.take {
		stroke: #3fa66a;
		stroke-width: 4;
	}
	.edge.skip {
		stroke: #c0556b;
		stroke-width: 2.5;
		stroke-dasharray: 4 4;
	}
	.edge.cur {
		stroke-width: 5;
	}
	.edge.skip.cur {
		stroke: #c0556b;
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
		fill: var(--color-parch-100);
		font-weight: 700;
	}
	.wlabel.take rect { stroke: #3fa66a; }
	.wlabel.skip rect { stroke: #c0556b; }
	.wlabel.cur rect { stroke: var(--blue); stroke-width: 1.8; }
	.node circle {
		stroke-width: 2.5;
		transition: fill 0.35s, stroke 0.35s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.95rem;
		fill: #fff;
	}
	.gv__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.stats {
		display: flex;
		gap: 0.6rem;
	}
	.stat {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.45rem 0.6rem;
		background: var(--color-ink-800);
		border: 1.5px solid var(--color-ink-600);
		border-radius: 8px;
	}
	.stat span {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.stat b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.05rem;
		color: var(--blue);
	}
	.elist {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.elist-head {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.elist-rows {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.2rem 0.4rem;
	}
	.erow {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.2rem 0.4rem;
		border-radius: 6px;
		border: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-850);
		font-size: 0.74rem;
		transition: all 0.2s;
	}
	.erow .epair {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-parch-100);
	}
	.erow .ew {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--color-parch-muted);
		margin-left: auto;
	}
	.erow .emark {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		width: 0.8rem;
		text-align: center;
		color: var(--color-parch-muted);
	}
	.erow.cur {
		border-color: var(--blue);
		background: var(--blue-pale);
	}
	.erow.cur .epair,
	.erow.cur .ew,
	.erow.cur .emark {
		color: var(--blue);
	}
	.erow.take {
		border-color: #3fa66a;
	}
	.erow.take .emark { color: #3fa66a; }
	.erow.skip {
		border-color: #c0556b;
		opacity: 0.7;
	}
	.erow.skip .emark { color: #c0556b; }
	.note {
		margin-top: auto;
		font-size: 0.82rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
</style>
