<script lang="ts">
	// Bellman-Ford «волнами»: за каждый проход 1..V−1 кратчайшие пути уходят
	// на одно ребро дальше от старта. Таблица dist по проходам, подсветка
	// обновлённых вершин. Проход с номером V, который ещё что-то улучшает,
	// доказывает отрицательный цикл (подсветка). Тумблер отрицательного
	// ребра/цикла, выбор старта, шаг по проходам. Чистый SVG, без зависимостей.
	type Node = { id: number; x: number; y: number; label: string };
	type Edge = { a: number; b: number; w: number };
	type Snap = { dist: number[]; updated: number[] };

	const INF = Infinity;
	const nodes: Node[] = [
		{ id: 0, x: 60, y: 70, label: 'A' },
		{ id: 1, x: 185, y: 45, label: 'B' },
		{ id: 2, x: 175, y: 165, label: 'C' },
		{ id: 3, x: 305, y: 80, label: 'D' },
		{ id: 4, x: 300, y: 200, label: 'E' }
	];
	const V = nodes.length;

	// Базовый ориентированный взвешенный граф (без отрицательных циклов).
	// Рёбра нарочно перечислены в порядке «дальние → ближние», чтобы волна
	// уходила ровно на один слой за проход и это было видно в таблице.
	const baseEdges: Edge[] = [
		{ a: 3, b: 4, w: 2 },
		{ a: 2, b: 3, w: -3 },
		{ a: 1, b: 3, w: 5 },
		{ a: 2, b: 4, w: 9 },
		{ a: 1, b: 2, w: 8 },
		{ a: 0, b: 1, w: 6 },
		{ a: 0, b: 2, w: 7 }
	];
	// Доп. ребро E→B = −7 замыкает цикл B→C→D→E→B с суммой 8+(−3)+2+(−7) = 0…
	// делаем −9, тогда сумма цикла = −2 < 0 → отрицательный цикл.
	const negCycleEdge: Edge = { a: 4, b: 1, w: -9 };

	let withNegCycle = $state(false);
	let start = $state(0);
	let pass = $state(0); // 0 = инициализация, 1..V = проходы релаксации

	const edges = $derived<Edge[]>(
		withNegCycle ? [...baseEdges, negCycleEdge] : baseEdges
	);

	// Полный прогон Bellman-Ford: снимок dist после каждого прохода 0..V.
	// Проход V существует всегда; если он что-то улучшает → отрицательный цикл.
	function run(eds: Edge[], s: number): { snaps: Snap[]; negFrom: number } {
		const dist = new Array(V).fill(INF);
		dist[s] = 0;
		const snaps: Snap[] = [{ dist: [...dist], updated: [s] }];
		let negFrom = -1; // первый проход (1-индексный), доказавший отрицат. цикл
		for (let p = 1; p <= V; p++) {
			const updated: number[] = [];
			for (const { a, b, w } of eds) {
				if (dist[a] !== INF && dist[a] + w < dist[b]) {
					dist[b] = dist[a] + w;
					if (!updated.includes(b)) updated.push(b);
				}
			}
			snaps.push({ dist: [...dist], updated });
			if (p === V && updated.length > 0 && negFrom === -1) negFrom = p;
		}
		return { snaps, negFrom };
	}

	const result = $derived(run(edges, start));
	const snaps = $derived(result.snaps);
	const maxPass = $derived(snaps.length - 1); // = V
	const cur = $derived(snaps[Math.min(pass, maxPass)]);
	const isNegPass = $derived(
		result.negFrom !== -1 && Math.min(pass, maxPass) >= result.negFrom
	);
	const updatedSet = $derived(new Set(cur.updated));

	let playing = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (pass >= maxPass) {
				stop();
				return;
			}
			pass += 1;
		}, 850);
	}
	function reset() {
		stop();
		pass = 0;
	}
	function stepBack() {
		stop();
		pass = Math.max(0, pass - 1);
	}
	function stepFwd() {
		stop();
		pass = Math.min(maxPass, pass + 1);
	}
	function setStart(s: number) {
		start = s;
		reset();
	}
	function toggleNeg() {
		withNegCycle = !withNegCycle;
		reset();
	}

	function fmt(d: number): string {
		return d === INF ? '∞' : String(d);
	}
	function nodeState(id: number): string {
		if (isNegPass && updatedSet.has(id)) return 'neg';
		if (id === start) return 'start';
		if (updatedSet.has(id)) return 'wave';
		if (cur.dist[id] !== INF) return 'reached';
		return 'idle';
	}
	function edgeIsNeg(e: Edge): boolean {
		return e.w < 0;
	}
	// укоротить отрезок до края кружка, чтобы стрелка садилась на ободок
	const R = 19;
	function seg(e: Edge) {
		const p = nodes[e.a];
		const q = nodes[e.b];
		const dx = q.x - p.x;
		const dy = q.y - p.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len;
		const uy = dy / len;
		return {
			x1: p.x + ux * R,
			y1: p.y + uy * R,
			x2: q.x - ux * R,
			y2: q.y - uy * R,
			mx: (p.x + q.x) / 2,
			my: (p.y + q.y) / 2
		};
	}

	const passLabel = $derived(
		pass === 0
			? 'инициализация: dist[старт] = 0, остальные = ∞'
			: isNegPass
				? `проход ${pass} (= V) всё ещё улучшает dist → отрицательный цикл`
				: cur.updated.length === 0
					? `проход ${pass}: ничего не изменилось → можно остановиться`
					: `проход ${pass}: волна ушла на ребро дальше, обновлены ${cur.updated
							.map((i) => nodes[i].label)
							.join(', ')}`
	);
</script>

<div class="bf">
	<div class="bf__bar">
		<div class="seg start">
			<span class="seg-cap">старт</span>
			{#each nodes as n}
				<button class:on={start === n.id} onclick={() => setStart(n.id)}>{n.label}</button>
			{/each}
		</div>
		<div class="bf__right">
			<button class="toggle" class:on={withNegCycle} onclick={toggleNeg}>
				{withNegCycle ? 'отрицат. цикл: вкл' : 'отрицат. цикл: выкл'}
			</button>
			<div class="ctrl">
				<button onclick={reset} title="сброс">↺</button>
				<button onclick={stepBack} title="назад">◀</button>
				{#if playing}
					<button onclick={stop} title="пауза">⏸</button>
				{:else}
					<button onclick={play} title="играть">▶</button>
				{/if}
				<button onclick={stepFwd} title="вперёд">▶▶</button>
				<span class="cnt">проход {pass}/{maxPass}</span>
			</div>
		</div>
	</div>

	<div class="bf__body">
		<svg viewBox="0 0 420 290" class="bf__svg">
			<defs>
				<marker id="bf-arr" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto-start-reverse">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--color-ink-500)" />
				</marker>
				<marker id="bf-arr-neg" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto-start-reverse">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
			</defs>

			{#each edges as e}
				{@const s = seg(e)}
				<line
					x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
					class="edge" class:neg={edgeIsNeg(e)}
					marker-end={edgeIsNeg(e) ? 'url(#bf-arr-neg)' : 'url(#bf-arr)'}
				/>
				<g class="wlabel" class:neg={edgeIsNeg(e)}>
					<rect x={s.mx - 10} y={s.my - 9} width="20" height="16" rx="4" />
					<text x={s.mx} y={s.my} dy="0.32em">{e.w}</text>
				</g>
			{/each}

			{#each nodes as n}
				<g class="node {nodeState(n.id)}">
					<circle cx={n.x} cy={n.y} r={R} />
					<text class="lab" x={n.x} y={n.y} dy="-0.05em">{n.label}</text>
					<text class="dval" x={n.x} y={n.y} dy="0.95em">{fmt(cur.dist[n.id])}</text>
				</g>
			{/each}
		</svg>

		<div class="bf__panel">
			<div class="tbl-wrap">
				<table class="tbl">
					<thead>
						<tr>
							<th class="cap">проход</th>
							{#each nodes as n}
								<th>{n.label}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each snaps as snap, p}
							{@const isNegRow = result.negFrom !== -1 && p >= result.negFrom}
							<tr class:active={p === Math.min(pass, maxPass)} class:negrow={isNegRow}>
								<td class="cap">{p === 0 ? 'init' : p}</td>
								{#each nodes as n}
									<td
										class="cell"
										class:upd={p > 0 && snap.updated.includes(n.id)}
										class:negcell={isNegRow && snap.updated.includes(n.id)}
									>{fmt(snap.dist[n.id])}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="note" class:negnote={isNegPass}>{passLabel}</div>
		</div>
	</div>

	<div class="bf__legend">
		<span class="lg"><i class="sw wave"></i>обновлён на этом проходе</span>
		<span class="lg"><i class="sw reached"></i>достижим (dist &lt; ∞)</span>
		<span class="lg"><i class="sw start"></i>старт</span>
		<span class="lg"><i class="sw negsw"></i>отрицат. цикл</span>
	</div>
</div>

<style>
	.bf {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.bf__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.bf__right {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.seg {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.seg-cap {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		margin-right: 0.2rem;
	}
	.seg.start button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		width: 1.8rem;
		height: 1.8rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg.start button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.seg.start button.on {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.toggle {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		padding: 0.4rem 0.7rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 8px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.toggle:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.toggle.on {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
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
		font-size: 0.7rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
		white-space: nowrap;
	}
	.bf__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.bf__svg {
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
	.edge.neg {
		stroke: var(--blue);
		stroke-dasharray: 5 3;
	}
	.wlabel rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-width: 1;
	}
	.wlabel.neg rect {
		stroke: var(--blue);
	}
	.wlabel text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		fill: var(--color-parch-100);
		font-weight: 700;
	}
	.wlabel.neg text {
		fill: var(--blue);
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node .lab {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		fill: var(--color-parch-100);
	}
	.node .dval {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		fill: var(--color-parch-muted);
	}
	.node.reached circle {
		fill: var(--color-ink-800);
		stroke: var(--color-parch-muted);
	}
	.node.reached .dval {
		fill: var(--color-parch-100);
	}
	.node.start circle {
		fill: var(--color-ink-850);
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.start .lab {
		fill: var(--color-parch-100);
	}
	.node.start .dval {
		fill: var(--color-parch-100);
	}
	.node.wave circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.wave .lab,
	.node.wave .dval {
		fill: #fff;
	}
	.node.neg circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.neg .lab,
	.node.neg .dval {
		fill: #fff;
	}
	.bf__panel {
		flex: 1 1 250px;
		min-width: 230px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.tbl-wrap {
		overflow-x: auto;
	}
	.tbl {
		border-collapse: collapse;
		width: 100%;
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}
	.tbl th {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
		color: var(--color-parch-100);
		padding: 0.3rem 0.4rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		text-align: center;
	}
	.tbl th.cap,
	.tbl td.cap {
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-size: 0.6rem;
		color: var(--color-parch-muted);
		text-align: left;
	}
	.tbl td {
		padding: 0.26rem 0.4rem;
		text-align: center;
		color: var(--color-parch-200);
		border-bottom: 1px dashed var(--color-ink-700);
	}
	.tbl tr.active td {
		background: var(--color-ink-800);
	}
	.tbl tr.active td.cap {
		color: var(--blue);
	}
	.cell.upd {
		color: #fff;
		background: var(--blue);
		border-radius: 4px;
		font-weight: 700;
	}
	.cell.negcell {
		background: var(--blue);
		color: #fff;
		box-shadow: 0 0 0 1.5px var(--color-parch-100) inset;
	}
	.tbl tr.negrow td.cap {
		color: var(--blue);
		font-weight: 700;
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
	.note.negnote {
		border-left-color: var(--color-parch-100);
		color: var(--color-parch-100);
	}
	.bf__legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		padding: 0.7rem 0.9rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.lg {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
	}
	.sw {
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 4px;
		flex: none;
	}
	.sw.wave {
		background: var(--blue);
	}
	.sw.reached {
		background: var(--color-ink-800);
		border: 1.5px solid var(--color-parch-muted);
	}
	.sw.start {
		background: var(--color-ink-850);
		border: 2px solid var(--color-parch-100);
	}
	.sw.negsw {
		background: var(--blue);
		border: 2px solid var(--color-parch-100);
	}
</style>
