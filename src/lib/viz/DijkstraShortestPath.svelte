<script lang="ts">
	// Алгоритм Дейкстры на взвешенном мини-графе. Шаг / плей / сброс.
	// Слева — граф с метками dist и стрелками-предками, справа — min-куча
	// (очередь с приоритетом) и таблицы dist[]/prev[]. Чистый инлайн-SVG, без зависимостей.
	// Логика настоящая: каждый шаг = извлечение минимума или релаксация одного соседа.
	type Pt = { x: number; y: number; label: string };
	type E = { a: number; b: number; w: number };

	const R = 18;
	const INF = Infinity;
	const START = 0;
	const TARGET = 5; // F

	const nodes: Pt[] = [
		{ x: 55, y: 70, label: 'A' },
		{ x: 175, y: 45, label: 'B' },
		{ x: 130, y: 165, label: 'C' },
		{ x: 270, y: 130, label: 'D' },
		{ x: 245, y: 245, label: 'E' },
		{ x: 375, y: 215, label: 'F' }
	];
	const edges: E[] = [
		{ a: 0, b: 1, w: 4 },
		{ a: 0, b: 2, w: 2 },
		{ a: 1, b: 2, w: 1 },
		{ a: 1, b: 3, w: 5 },
		{ a: 2, b: 3, w: 8 },
		{ a: 2, b: 4, w: 10 },
		{ a: 3, b: 4, w: 2 },
		{ a: 3, b: 5, w: 6 },
		{ a: 4, b: 5, w: 3 }
	];
	const V = nodes.length;
	const adj: { v: number; w: number }[][] = nodes.map(() => []);
	for (const { a, b, w } of edges) {
		adj[a].push({ v: b, w });
		adj[b].push({ v: a, w });
	}
	for (const a of adj) a.sort((p, q) => p.v - q.v);

	type Step = {
		dist: number[];
		prev: (number | null)[];
		done: boolean[];
		heap: number[]; // незафиксированные вершины с конечным dist, по возрастанию dist
		current: number | null; // извлечённая вершина
		edge: [number, number] | null; // релаксируемое ребро u→v
		relaxed: boolean; // улучшилось ли расстояние на этом шаге
		note: string;
	};

	function lbl(d: number): string {
		return d === INF ? '∞' : String(d);
	}

	function buildSteps(): Step[] {
		const steps: Step[] = [];
		const dist = Array<number>(V).fill(INF);
		const prev = Array<number | null>(V).fill(null);
		const done = Array<boolean>(V).fill(false);
		dist[START] = 0;

		const heapSnap = () =>
			[...Array(V).keys()]
				.filter((i) => !done[i] && dist[i] < INF)
				.sort((a, b) => dist[a] - dist[b] || a - b);

		const snap = (
			current: number | null,
			edge: [number, number] | null,
			relaxed: boolean,
			note: string
		): void => {
			steps.push({
				dist: [...dist],
				prev: [...prev],
				done: [...done],
				heap: heapSnap(),
				current,
				edge,
				relaxed,
				note
			});
		};

		snap(null, null, false, `Старт ${nodes[START].label}: dist=0, остальные ∞. Кладём ${nodes[START].label} в очередь.`);

		for (let it = 0; it < V; it++) {
			// извлекаем ближайшую незафиксированную вершину из min-кучи
			let u = -1;
			let best = INF;
			for (let i = 0; i < V; i++) {
				if (!done[i] && dist[i] < best) {
					best = dist[i];
					u = i;
				}
			}
			if (u === -1) break;
			done[u] = true;
			snap(u, null, false, `Извлекаем минимум: ${nodes[u].label} (dist=${dist[u]}). Фиксируем её — расстояние окончательно.`);

			// релаксируем соседей
			for (const { v, w } of adj[u]) {
				if (done[v]) continue;
				const cand = dist[u] + w;
				if (cand < dist[v]) {
					const old = dist[v];
					dist[v] = cand;
					prev[v] = u;
					snap(
						u,
						[u, v],
						true,
						`Релаксация ${nodes[u].label}→${nodes[v].label}: ${dist[u]}+${w}=${cand} < ${lbl(old)}. dist[${nodes[v].label}]=${cand}, prev=${nodes[u].label}.`
					);
				} else {
					snap(
						u,
						[u, v],
						false,
						`Проверяем ${nodes[u].label}→${nodes[v].label}: ${dist[u]}+${w}=${cand} ≥ ${lbl(dist[v])} — не улучшает.`
					);
				}
			}
		}

		// восстановление пути от START к TARGET
		const path: number[] = [];
		for (let c: number | null = TARGET; c !== null; c = prev[c]) path.unshift(c);
		const ok = path[0] === START;
		snap(
			null,
			null,
			false,
			ok
				? `Готово. Кратчайший путь ${path.map((p) => nodes[p].label).join('→')} длиной ${dist[TARGET]}.`
				: `Готово. Цель ${nodes[TARGET].label} недостижима.`
		);
		return steps;
	}

	const steps = buildSteps();

	// восстановленный путь (рёбра) для финальной подсветки
	const finalPrev: (number | null)[] = steps[steps.length - 1].prev;
	const pathEdges = (() => {
		const set = new Set<string>();
		let c: number | null = TARGET;
		while (c !== null && finalPrev[c] !== null) {
			const p: number = finalPrev[c]!;
			set.add(`${Math.min(c, p)}-${Math.max(c, p)}`);
			c = p;
		}
		return set;
	})();
	const pathNodes = (() => {
		const s = new Set<number>();
		let c: number | null = TARGET;
		while (c !== null) {
			s.add(c);
			c = finalPrev[c];
		}
		return s;
	})();

	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);
	const finished = $derived(idx >= steps.length - 1);
	const heapSet = $derived(new Set(cur.heap));

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

	// геометрия ребра: укоротить до окружности вершины
	function seg(e: E) {
		const p = nodes[e.a];
		const q = nodes[e.b];
		const dx = q.x - p.x;
		const dy = q.y - p.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len;
		const uy = dy / len;
		return { x1: p.x + ux * R, y1: p.y + uy * R, x2: q.x - ux * R, y2: q.y - uy * R };
	}
	function mid(e: E) {
		return { x: (nodes[e.a].x + nodes[e.b].x) / 2, y: (nodes[e.a].y + nodes[e.b].y) / 2 };
	}
	function edgeActive(e: E): boolean {
		if (!cur.edge) return false;
		const [u, v] = cur.edge;
		return (u === e.a && v === e.b) || (u === e.b && v === e.a);
	}
	function edgeKey(e: E): string {
		return `${Math.min(e.a, e.b)}-${Math.max(e.a, e.b)}`;
	}
	function onPath(e: E): boolean {
		return finished && pathEdges.has(edgeKey(e));
	}
	function nodeState(id: number): string {
		if (finished && pathNodes.has(id)) return 'path';
		if (cur.current === id) return 'current';
		if (cur.done[id]) return 'done';
		if (heapSet.has(id)) return 'heap';
		return 'idle';
	}
	// стрелка-предок: короткий отрезок от вершины к её prev
	function prevArrow(id: number) {
		const p = cur.prev[id];
		if (p === null) return null;
		const a = nodes[id];
		const b = nodes[p];
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len;
		const uy = dy / len;
		return { x1: a.x + ux * R, y1: a.y + uy * R, x2: a.x + ux * (R + 14), y2: a.y + uy * (R + 14) };
	}
</script>

<div class="dij">
	<div class="dij__bar">
		<div class="title">Дейкстра: кратчайший путь {nodes[START].label} → {nodes[TARGET].label}</div>
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

	<div class="dij__body">
		<svg viewBox="0 0 420 290" class="dij__svg">
			<defs>
				<marker id="dij-prev" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
					<path d="M0,0 L6,3 L0,6 z" fill="var(--blue)" />
				</marker>
			</defs>

			{#each edges as e}
				{@const s = seg(e)}
				{@const m = mid(e)}
				<line
					x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
					class="edge" class:active={edgeActive(e)} class:relax={edgeActive(e) && cur.relaxed} class:path={onPath(e)}
				/>
				<g class="wlabel">
					<rect x={m.x - 9} y={m.y - 8} width="18" height="16" rx="4" />
					<text x={m.x} y={m.y} dy="0.32em">{e.w}</text>
				</g>
			{/each}

			{#each nodes as n, i}
				{@const ar = prevArrow(i)}
				{#if ar}
					<line x1={ar.x1} y1={ar.y1} x2={ar.x2} y2={ar.y2} class="prevarr" marker-end="url(#dij-prev)" />
				{/if}
				<g class="node {nodeState(i)}">
					<circle cx={n.x} cy={n.y} r={R} />
					<text x={n.x} y={n.y} dy="0.34em">{n.label}</text>
					<g class="dlabel">
						<rect x={n.x - 12} y={n.y - R - 15} width="24" height="14" rx="4" />
						<text x={n.x} y={n.y - R - 8} dy="0.32em">{lbl(cur.dist[i])}</text>
					</g>
				</g>
			{/each}
		</svg>

		<div class="dij__panel">
			<div class="row">
				<span class="lbl">Min-куча (приоритет = dist)</span>
				<div class="chips">
					{#each cur.heap as h}
						<span class="chip" class:head={h === cur.heap[0]}>
							{nodes[h].label}<i>{lbl(cur.dist[h])}</i>
						</span>
					{:else}
						<span class="empty">пусто</span>
					{/each}
				</div>
			</div>

			<table class="tbl">
				<thead>
					<tr><th>v</th>{#each nodes as n}<th>{n.label}</th>{/each}</tr>
				</thead>
				<tbody>
					<tr>
						<th>dist</th>
						{#each nodes as _, i}
							<td class:done={cur.done[i]} class:cur={cur.current === i}>{lbl(cur.dist[i])}</td>
						{/each}
					</tr>
					<tr>
						<th>prev</th>
						{#each nodes as _, i}
							<td class:done={cur.done[i]}>{cur.prev[i] === null ? '·' : nodes[cur.prev[i]!].label}</td>
						{/each}
					</tr>
				</tbody>
			</table>

			<div class="note">{cur.note}</div>
		</div>
	</div>
</div>

<style>
	.dij {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.dij__bar {
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
		font-weight: 700;
		font-size: 0.82rem;
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
	.dij__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.dij__svg {
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
		stroke: var(--color-parch-muted);
		stroke-width: 3.5;
	}
	.edge.relax {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.edge.path {
		stroke: var(--blue);
		stroke-width: 4.5;
	}
	.wlabel rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-width: 1;
	}
	.wlabel text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		fill: var(--blue);
		font-weight: 700;
	}
	.prevarr {
		stroke: var(--blue);
		stroke-width: 2;
		opacity: 0.85;
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
		font-size: 0.95rem;
		fill: var(--color-parch-100);
	}
	.node.heap circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.done circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.done text {
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
	.node.path circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	.node.path text {
		fill: #fff;
	}
	.dlabel rect {
		fill: var(--color-ink-800);
		stroke: var(--blue);
		stroke-width: 1;
	}
	.dlabel text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		font-weight: 700;
		fill: var(--color-parch-100);
	}
	.dij__panel {
		flex: 1 1 240px;
		min-width: 220px;
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
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		min-height: 1.8rem;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.18rem;
		height: 1.7rem;
		padding: 0 0.45rem;
		border-radius: 6px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		background: var(--blue-pale);
		color: var(--blue);
		border: 1.5px solid var(--blue);
	}
	.chip i {
		font-family: var(--font-mono);
		font-style: normal;
		font-size: 0.64rem;
		opacity: 0.8;
	}
	.chip.head {
		background: var(--blue);
		color: #fff;
	}
	.empty {
		color: var(--color-parch-muted);
		font-size: 0.78rem;
	}
	.tbl {
		border-collapse: collapse;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		width: 100%;
	}
	.tbl th,
	.tbl td {
		border: 1px solid var(--color-ink-600);
		padding: 0.2rem 0;
		text-align: center;
		color: var(--color-parch-200);
	}
	.tbl thead th {
		color: var(--color-parch-muted);
		font-weight: 700;
	}
	.tbl tbody th {
		color: var(--color-parch-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.58rem;
	}
	.tbl td.done {
		background: var(--blue);
		color: #fff;
		font-weight: 700;
	}
	.tbl td.cur {
		outline: 2px solid var(--color-parch-100);
		outline-offset: -2px;
	}
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
