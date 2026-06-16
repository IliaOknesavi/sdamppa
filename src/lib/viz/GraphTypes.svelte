<script lang="ts">
	// Interactive gallery of graph types. One small graph (6 vertices) redrawn
	// for the selected type: arrows for directed, weight labels, layered DAG,
	// radial tree, two-colour bipartite, complete K6, loop + multi-edge for a
	// pseudograph. Live property panel + a sparse/dense memory sub-widget.
	// Pure SVG, no deps; same visual language as GraphTraversal.
	type Pt = { x: number; y: number; label: string };
	type E = { a: number; b: number; w?: number; curve?: number; loop?: boolean };

	const R = 18;
	const L = ['A', 'B', 'C', 'D', 'E', 'F'];

	// per-type vertex layouts (node ids 0..5 keep identity → они «переезжают»)
	const spread: Pt[] = [
		{ x: 70, y: 70, label: L[0] }, { x: 205, y: 55, label: L[1] }, { x: 70, y: 195, label: L[2] },
		{ x: 210, y: 155, label: L[3] }, { x: 140, y: 235, label: L[4] }, { x: 305, y: 110, label: L[5] }
	];
	const layered: Pt[] = [
		{ x: 45, y: 135, label: L[0] }, { x: 135, y: 70, label: L[1] }, { x: 135, y: 200, label: L[2] },
		{ x: 220, y: 135, label: L[3] }, { x: 310, y: 75, label: L[4] }, { x: 310, y: 195, label: L[5] }
	];
	const tree: Pt[] = [
		{ x: 185, y: 45, label: L[0] }, { x: 105, y: 130, label: L[1] }, { x: 265, y: 130, label: L[2] },
		{ x: 60, y: 220, label: L[3] }, { x: 215, y: 220, label: L[4] }, { x: 305, y: 220, label: L[5] }
	];
	const bip: Pt[] = [
		{ x: 95, y: 55, label: L[0] }, { x: 285, y: 55, label: L[1] }, { x: 95, y: 145, label: L[2] },
		{ x: 285, y: 145, label: L[3] }, { x: 95, y: 235, label: L[4] }, { x: 285, y: 235, label: L[5] }
	];
	const circle: Pt[] = (() => {
		const cx = 185, cy = 140, r = 100;
		return [0, 1, 2, 3, 4, 5].map((i) => {
			const ang = (-90 + i * 60) * (Math.PI / 180);
			return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), label: L[i] };
		});
	})();

	const E_BASE: E[] = [
		{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 1, b: 3 }, { a: 2, b: 3 }, { a: 2, b: 4 }, { a: 3, b: 5 }, { a: 4, b: 5 }
	];

	type Conf = {
		pos: Pt[]; edges: E[]; directed: boolean; weighted: boolean; cyclic: boolean;
		part: (number | null)[]; note: string;
	};
	const NONE: (number | null)[] = [null, null, null, null, null, null];

	function conf(t: string): Conf {
		switch (t) {
			case 'directed':
				return { pos: spread, directed: true, weighted: false, cyclic: true, part: NONE,
					edges: [{ a: 0, b: 1 }, { a: 1, b: 3 }, { a: 3, b: 2 }, { a: 2, b: 0 }, { a: 2, b: 4 }, { a: 4, b: 5 }, { a: 3, b: 5 }],
					note: 'Рёбра — дуги в одну сторону (стрелки). Здесь есть цикл A→B→D→C→A.' };
			case 'weighted':
				return { pos: spread, directed: false, weighted: true, cyclic: true, part: NONE,
					edges: [{ a: 0, b: 1, w: 7 }, { a: 0, b: 2, w: 9 }, { a: 1, b: 3, w: 5 }, { a: 2, b: 3, w: 2 }, { a: 2, b: 4, w: 6 }, { a: 3, b: 5, w: 4 }, { a: 4, b: 5, w: 8 }],
					note: 'У каждого ребра вес (длина/стоимость). Именно по сумме весов ищут кратчайший путь.' };
			case 'dag':
				return { pos: layered, directed: true, weighted: false, cyclic: false, part: NONE,
					edges: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 1, b: 3 }, { a: 2, b: 3 }, { a: 2, b: 4 }, { a: 3, b: 5 }, { a: 3, b: 4 }],
					note: 'Ориентированный + ацикличный (DAG). Слои слева направо задают топологический порядок A·B·C·D·E·F.' };
			case 'tree':
				return { pos: tree, directed: false, weighted: false, cyclic: false, part: NONE,
					edges: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 1, b: 3 }, { a: 2, b: 4 }, { a: 2, b: 5 }],
					note: 'Связный и ациклический: ровно V−1 рёбер, между любой парой — единственный путь. На деревьях держится BST/RB/B-дерево.' };
			case 'bipartite':
				return { pos: bip, directed: false, weighted: false, cyclic: true, part: [0, 1, 0, 1, 0, 1],
					edges: [{ a: 0, b: 1 }, { a: 0, b: 3 }, { a: 2, b: 1 }, { a: 2, b: 5 }, { a: 4, b: 3 }, { a: 4, b: 5 }],
					note: 'Вершины разбиты на две доли; рёбра идут только между долями, внутри доли — никогда.' };
			case 'complete':
				return { pos: circle, directed: false, weighted: false, cyclic: true, part: NONE,
					edges: (() => { const e: E[] = []; for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) e.push({ a: i, b: j }); return e; })(),
					note: 'Полный граф K₆: соединены все пары. Максимум рёбер V(V−1)/2 = 15 — это плотный граф.' };
			case 'multi':
				return { pos: spread, directed: false, weighted: false, cyclic: true, part: NONE,
					edges: [{ a: 0, b: 1 }, { a: 0, b: 1, curve: 26 }, { a: 0, b: 2 }, { a: 1, b: 3 }, { a: 2, b: 3 }, { a: 2, b: 4 }, { a: 3, b: 3, loop: true }, { a: 4, b: 5 }],
					note: 'Псевдограф: кратное ребро A–B (два параллельных) и петля D→D. Без петель это был бы мультиграф.' };
			default: // undirected
				return { pos: spread, directed: false, weighted: false, cyclic: true, part: NONE, edges: E_BASE,
					note: 'Базовый неориентированный граф: рёбра — линии без направления, ходим в обе стороны.' };
		}
	}

	const TYPES = [
		{ id: 'undirected', label: 'Неориент.' },
		{ id: 'directed', label: 'Ориент.' },
		{ id: 'weighted', label: 'Взвешенный' },
		{ id: 'dag', label: 'DAG' },
		{ id: 'tree', label: 'Дерево' },
		{ id: 'bipartite', label: 'Двудольный' },
		{ id: 'complete', label: 'Полный' },
		{ id: 'multi', label: 'Мульти/псевдо' }
	];

	let type = $state('undirected');
	const c = $derived(conf(type));
	const V = 6;
	const Ecount = $derived(c.edges.length);

	// shorten a segment to the circle edge so arrowheads sit on the rim
	function seg(e: E) {
		const p = c.pos[e.a], q = c.pos[e.b];
		const dx = q.x - p.x, dy = q.y - p.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len, uy = dy / len;
		return { x1: p.x + ux * R, y1: p.y + uy * R, x2: q.x - ux * R, y2: q.y - uy * R };
	}
	// quadratic control point for a curved (parallel) edge
	function curvePath(e: E) {
		const s = seg(e);
		const mx = (s.x1 + s.x2) / 2, my = (s.y1 + s.y2) / 2;
		const nx = -(s.y2 - s.y1), ny = s.x2 - s.x1;
		const nlen = Math.hypot(nx, ny) || 1;
		const off = e.curve ?? 0;
		return `M ${s.x1} ${s.y1} Q ${mx + (nx / nlen) * off} ${my + (ny / nlen) * off} ${s.x2} ${s.y2}`;
	}
	function mid(e: E) {
		const p = c.pos[e.a], q = c.pos[e.b];
		return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
	}
	const partColor = (i: number | null) =>
		i === 0 ? 'var(--blue)' : i === 1 ? 'var(--color-gold-500, #d99a2b)' : 'var(--color-ink-500)';

	// sparse/dense memory sub-widget
	let dense = $state(7); // current |E| on the slider (undirected, max 15)
	const listCost = $derived(V + dense); // O(V+E)
	const matrixCost = V * V; // O(V^2) = 36, constant
</script>

<div class="gt">
	<div class="gt__bar">
		<div class="seg">
			{#each TYPES as t}
				<button class:on={type === t.id} onclick={() => (type = t.id)}>{t.label}</button>
			{/each}
		</div>
	</div>

	<div class="gt__body">
		<svg viewBox="0 0 370 270" class="gt__svg">
			<defs>
				<marker id="gt-arr" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto-start-reverse">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
			</defs>

			{#each c.edges as e}
				{#if e.loop}
					<path
						d={`M ${c.pos[e.a].x - 6} ${c.pos[e.a].y - R} q -22 -26 12 -30 q 30 0 10 26`}
						class="edge loop" marker-end={c.directed ? 'url(#gt-arr)' : undefined} fill="none"
					/>
				{:else if e.curve}
					<path d={curvePath(e)} class="edge" fill="none" marker-end={c.directed ? 'url(#gt-arr)' : undefined} />
				{:else}
					{@const s = seg(e)}
					<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} class="edge" marker-end={c.directed ? 'url(#gt-arr)' : undefined} />
				{/if}
				{#if c.weighted && !e.loop}
					{@const m = mid(e)}
					<g class="wlabel"><rect x={m.x - 9} y={m.y - 9} width="18" height="16" rx="4" /><text x={m.x} y={m.y} dy="0.32em">{e.w}</text></g>
				{/if}
			{/each}

			{#each c.pos as n, i}
				<g class="node" style="transform: translate({n.x}px, {n.y}px)">
					<circle r={R} style="fill: {c.part[i] === null ? 'var(--color-ink-850)' : partColor(c.part[i])}; stroke: {c.part[i] === null ? 'var(--color-ink-500)' : partColor(c.part[i])}" />
					<text dy="0.34em" style="fill: {c.part[i] === null ? 'var(--color-parch-100)' : '#fff'}">{n.label}</text>
				</g>
			{/each}
		</svg>

		<div class="gt__panel">
			<div class="props">
				<div class="prop"><span>направление</span><b>{c.directed ? 'ориентированный' : 'неориентированный'}</b></div>
				<div class="prop"><span>циклы</span><b class:no={!c.cyclic}>{c.cyclic ? 'есть' : 'нет (ацикличный)'}</b></div>
				<div class="prop"><span>веса</span><b>{c.weighted ? 'да' : 'нет'}</b></div>
				<div class="prop"><span>рёбер |E|</span><b>{Ecount}{type === 'tree' ? ' = V−1' : ''}</b></div>
				<div class="prop"><span>память: список</span><b>O(V+E) = {V + Ecount}</b></div>
				<div class="prop"><span>память: матрица</span><b>O(V²) = {V * V}</b></div>
			</div>
			<div class="note">{c.note}</div>
		</div>
	</div>

	<div class="gt__dense">
		<div class="dense-head">
			<span class="lbl">Плотность: список <code>O(V+E)</code> против матрицы <code>O(V²)</code> при V = {V}</span>
		</div>
		<input type="range" min="5" max="15" bind:value={dense} />
		<div class="bars">
			<div class="bar"><span>список</span><div class="track"><i style="width: {(listCost / 36) * 100}%"></i></div><b>{listCost}</b></div>
			<div class="bar"><span>матрица</span><div class="track"><i class="mx" style="width: {(matrixCost / 36) * 100}%"></i></div><b>{matrixCost}</b></div>
		</div>
		<div class="dense-note">
			{dense <= 8
				? 'Разреженный граф (|E| ≈ |V|): список смежности экономит память — выбор для дорожной сети.'
				: 'Плотный граф (|E| → |V|²): матрица оправдана, зато проверка ребра за O(1).'}
		</div>
	</div>
</div>

<style>
	.gt {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.gt__bar {
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.seg {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		padding: 0.32rem 0.6rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover { border-color: var(--blue); color: var(--blue); }
	.seg button.on { background: var(--blue); color: #fff; border-color: var(--blue); }
	.gt__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.gt__svg {
		flex: 1 1 330px;
		min-width: 280px;
		max-width: 470px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.2s;
	}
	.edge.loop { stroke: var(--blue); }
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
	.node {
		transition: transform 0.42s ease;
	}
	.node circle {
		stroke-width: 2.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.95rem;
	}
	.gt__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.props {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
	}
	.prop {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 0.78rem;
		padding: 0.2rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.prop span {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.prop b { color: var(--color-parch-100); font-family: var(--font-display); }
	.prop b.no { color: var(--blue); }
	.note {
		margin-top: auto;
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.gt__dense {
		padding: 0.8rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.dense-head .lbl {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
	}
	.dense-head code { color: var(--blue); }
	.gt__dense input[type='range'] {
		width: 100%;
		margin: 0.6rem 0;
		accent-color: var(--blue);
	}
	.bars {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.72rem;
	}
	.bar span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
		width: 3.6rem;
		flex: none;
	}
	.track {
		flex: 1;
		height: 0.7rem;
		background: var(--color-ink-700);
		border-radius: 5px;
		overflow: hidden;
	}
	.track i {
		display: block;
		height: 100%;
		background: var(--blue);
		transition: width 0.2s;
	}
	.track i.mx { background: var(--color-parch-muted); }
	.bar b { font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-parch-100); width: 1.6rem; }
	.dense-note {
		margin-top: 0.5rem;
		font-size: 0.76rem;
		color: var(--color-parch-200);
	}
</style>
