<script lang="ts">
	// A* против Дейкстры на сетке с препятствиями. Бок о бок два поиска от
	// старта к цели: Дейкстра (h≡0) расходится «кругом», A* тянется коридором
	// к цели за счёт эвристики f = g + w·h. Ползунок веса эвристики w плавно
	// превращает A* в Дейкстру (w = 0). Подписи g/h/f на раскрытых клетках,
	// счётчик раскрытий, контролы шаг/плей/сброс. Чистый SVG, без импортов.

	const COLS = 11;
	const ROWS = 9;
	const START: [number, number] = [1, 4]; // [col, row]
	const GOAL: [number, number] = [9, 4];

	// препятствие — вертикальная стена со «щелью», заставляет огибать
	const WALLS = new Set<number>();
	for (const [c, r] of [
		[5, 0], [5, 1], [5, 2], [5, 6], [5, 7], [5, 8],
		[4, 2], [6, 6]
	] as [number, number][]) {
		WALLS.add(r * COLS + c);
	}

	const idOf = (c: number, r: number) => r * COLS + c;
	const colOf = (id: number) => id % COLS;
	const rowOf = (id: number) => Math.floor(id / COLS);
	const startId = idOf(START[0], START[1]);
	const goalId = idOf(GOAL[0], GOAL[1]);

	function neighbors(id: number): number[] {
		const c = colOf(id), r = rowOf(id);
		const out: number[] = [];
		const cand: [number, number][] = [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]];
		for (const [nc, nr] of cand) {
			if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
			const nid = idOf(nc, nr);
			if (WALLS.has(nid)) continue;
			out.push(nid);
		}
		return out;
	}

	// манхэттенская эвристика (для 4-связной сетки — допустимая)
	function heur(id: number): number {
		return Math.abs(colOf(id) - GOAL[0]) + Math.abs(rowOf(id) - GOAL[1]);
	}

	type Cell = { id: number; g: number; h: number; f: number };
	type Snap = {
		expanded: Cell[];     // раскрытые клетки (накопительно) с g/h/f
		frontier: number[];   // id во фронте (в очереди)
		current: number | null;
		path: number[];        // итоговый путь (когда найден)
		done: boolean;
	};

	// Поиск best-first: приоритет = g + weight·h. weight = 0 → Дейкстра.
	// Возвращает массив снимков для пошагового воспроизведения.
	function search(weight: number): Snap[] {
		const snaps: Snap[] = [];
		const dist = new Map<number, number>();
		const came = new Map<number, number>();
		const expandedG = new Map<number, number>(); // раскрытые: id → g
		const closed = new Set<number>();
		// фронт как массив пар [priority, id]; берём минимум линейно (сетка мелкая)
		const open: { id: number; pri: number }[] = [];

		dist.set(startId, 0);
		open.push({ id: startId, pri: weight * heur(startId) });

		const cellList = (): Cell[] => {
			const arr: Cell[] = [];
			for (const [id, g] of expandedG) {
				const h = heur(id);
				arr.push({ id, g, h, f: g + weight * h });
			}
			return arr;
		};
		const frontierIds = () => open.map((o) => o.id);

		let goalReached = false;

		while (open.length) {
			// извлекаем минимум по приоритету
			let bi = 0;
			for (let i = 1; i < open.length; i++) {
				if (open[i].pri < open[bi].pri) bi = i;
			}
			const { id: cur } = open.splice(bi, 1)[0];
			if (closed.has(cur)) continue;
			closed.add(cur);
			expandedG.set(cur, dist.get(cur)!);

			snaps.push({
				expanded: cellList(),
				frontier: frontierIds(),
				current: cur,
				path: [],
				done: false
			});

			if (cur === goalId) {
				goalReached = true;
				break;
			}

			const g = dist.get(cur)!;
			for (const nx of neighbors(cur)) {
				if (closed.has(nx)) continue;
				const ng = g + 1;
				if (!dist.has(nx) || ng < dist.get(nx)!) {
					dist.set(nx, ng);
					came.set(nx, cur);
					open.push({ id: nx, pri: ng + weight * heur(nx) });
				}
			}
		}

		// восстановление пути
		const path: number[] = [];
		if (goalReached) {
			let node: number | undefined = goalId;
			while (node !== undefined) {
				path.unshift(node);
				node = came.get(node);
			}
		}
		snaps.push({
			expanded: cellList(),
			frontier: [],
			current: null,
			path,
			done: true
		});
		return snaps;
	}

	let weight = $state(1); // вес эвристики; 0 → Дейкстра
	let idx = $state(0);
	let playing = $state(false);

	// Левая панель — всегда Дейкстра (w = 0). Правая — A* с текущим весом.
	const dijkstra = $derived(search(0));
	const astar = $derived(search(weight));
	const maxLen = $derived(Math.max(dijkstra.length, astar.length));

	const dSnap = $derived(dijkstra[Math.min(idx, dijkstra.length - 1)]);
	const aSnap = $derived(astar[Math.min(idx, astar.length - 1)]);

	const dExpandedMap = $derived(new Map(dSnap.expanded.map((c) => [c.id, c])));
	const aExpandedMap = $derived(new Map(aSnap.expanded.map((c) => [c.id, c])));
	const dFront = $derived(new Set(dSnap.frontier));
	const aFront = $derived(new Set(aSnap.frontier));
	const dPath = $derived(new Set(dSnap.path));
	const aPath = $derived(new Set(aSnap.path));

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= maxLen - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 280);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setWeight(v: number) {
		weight = v;
		reset();
	}

	// геометрия клеток
	const PAD = 6;
	const CELL = 30;
	const W = COLS * CELL + PAD * 2;
	const H = ROWS * CELL + PAD * 2;
	const cx = (id: number) => PAD + colOf(id) * CELL;
	const cy = (id: number) => PAD + rowOf(id) * CELL;

	type Side = { snap: Snap; emap: Map<number, Cell>; front: Set<number>; path: Set<number> };
	const dSide = $derived<Side>({ snap: dSnap, emap: dExpandedMap, front: dFront, path: dPath });
	const aSide = $derived<Side>({ snap: aSnap, emap: aExpandedMap, front: aFront, path: aPath });

	function cellClass(id: number, side: Side): string {
		if (id === startId) return 'start';
		if (id === goalId) return 'goal';
		if (WALLS.has(id)) return 'wall';
		if (side.path.has(id)) return 'path';
		if (side.snap.current === id) return 'current';
		if (side.emap.has(id)) return 'expanded';
		if (side.front.has(id)) return 'frontier';
		return 'idle';
	}
</script>

<div class="ad">
	<div class="ad__bar">
		<div class="title">Дейкстра против A*: один лабиринт, две стратегии</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(maxLen - 1, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{maxLen - 1}</span>
		</div>
	</div>

	<div class="ad__grids">
		{#each [{ side: dSide, name: 'Дейкстра', sub: 'h ≡ 0' }, { side: aSide, name: 'A*', sub: `f = g + ${weight === 1 ? '' : weight + '·'}h` }] as panel}
			<div class="grid-card">
				<div class="gc-head">
					<span class="gc-name">{panel.name}</span>
					<span class="gc-sub">{panel.sub}</span>
					<span class="gc-count">раскрыто: <b>{panel.side.snap.expanded.length}</b></span>
				</div>
				<svg viewBox={`0 0 ${W} ${H}`} class="gc-svg">
					{#each Array(ROWS * COLS) as _, id}
						{@const klass = cellClass(id, panel.side)}
						{@const cell = panel.side.emap.get(id)}
						<g class="cell {klass}">
							<rect x={cx(id)} y={cy(id)} width={CELL} height={CELL} rx="3" />
							{#if id === startId}
								<text x={cx(id) + CELL / 2} y={cy(id) + CELL / 2} dy="0.34em" class="tag">S</text>
							{:else if id === goalId}
								<text x={cx(id) + CELL / 2} y={cy(id) + CELL / 2} dy="0.34em" class="tag">G</text>
							{:else if cell && (klass === 'expanded' || klass === 'current' || klass === 'path')}
								<text x={cx(id) + CELL / 2} y={cy(id) + 9} class="fv">{cell.f}</text>
								<text x={cx(id) + 5} y={cy(id) + CELL - 5} class="gh g">{cell.g}</text>
								<text x={cx(id) + CELL - 5} y={cy(id) + CELL - 5} class="gh h">{cell.h}</text>
							{/if}
						</g>
					{/each}
				</svg>
			</div>
		{/each}
	</div>

	<div class="ad__legend">
		<span class="lg"><i class="sw expanded"></i> раскрыто</span>
		<span class="lg"><i class="sw frontier"></i> во фронте</span>
		<span class="lg"><i class="sw current"></i> текущая</span>
		<span class="lg"><i class="sw path"></i> путь</span>
		<span class="lg"><i class="sw wall"></i> стена</span>
		<span class="lg lg-k"><b>g</b> пройдено · <b>h</b> эвристика · <b>f</b> = g + w·h</span>
	</div>

	<div class="ad__slider">
		<div class="sl-head">
			<span class="lbl">Вес эвристики <code>w</code> = <b>{weight.toFixed(1)}</b></span>
			<span class="sl-hint">
				{weight === 0
					? 'w = 0 → A* вырождается в Дейкстру: фронт растёт кругом во все стороны.'
					: weight <= 1
						? 'w ≤ 1 → эвристика допустима: путь оптимален, но A* раскрывает меньше клеток.'
						: 'w > 1 → «жадный» A*: коридор узкий и быстрый, но путь может стать неоптимальным.'}
			</span>
		</div>
		<input type="range" min="0" max="2" step="0.5" value={weight} oninput={(e) => setWeight(parseFloat(e.currentTarget.value))} />
		<div class="sl-scale"><span>0 (Дейкстра)</span><span>1 (обычный A*)</span><span>2 (жадный)</span></div>
	</div>

	<div class="note">
		Обе клетки стартуют из <b>S</b> и ищут <b>G</b> в одном лабиринте. Дейкстра берёт из очереди
		клетку с наименьшим <b>g</b> — фронт расползается ровным кругом. A* сортирует по
		<b>f = g + w·h</b>, поэтому тянется «коридором» в сторону цели и раскрывает заметно меньше клеток.
		Сравните счётчики раскрытий над сетками.
	</div>
</div>

<style>
	.ad {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.ad__bar {
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
		font-size: 0.9rem;
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
	.ad__grids {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.grid-card {
		flex: 1 1 320px;
		min-width: 280px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.gc-head {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.gc-name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.92rem;
		color: var(--blue);
	}
	.gc-sub {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-muted);
	}
	.gc-count {
		margin-left: auto;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-200);
	}
	.gc-count b {
		color: var(--color-parch-100);
		font-size: 0.85rem;
	}
	.gc-svg {
		width: 100%;
		height: auto;
		background: var(--color-ink-800);
		border: 1.5px solid var(--color-ink-600);
		border-radius: 8px;
	}
	.cell rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-700);
		stroke-width: 1;
		transition: fill 0.18s;
	}
	.cell.expanded rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.cell.frontier rect {
		fill: var(--color-parch-200);
		stroke: var(--color-parch-muted);
		opacity: 0.55;
	}
	.cell.current rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2;
	}
	.cell.path rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 1.5;
	}
	.cell.wall rect {
		fill: var(--color-ink-600);
		stroke: var(--color-ink-500);
	}
	.cell.start rect {
		fill: var(--color-parch-100);
		stroke: var(--color-parch-100);
	}
	.cell.goal rect {
		fill: var(--color-parch-100);
		stroke: var(--blue);
		stroke-width: 2;
	}
	.tag {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		fill: var(--color-ink-850);
	}
	.fv {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.62rem;
		fill: var(--color-ink-800);
	}
	.cell.current .fv,
	.cell.path .fv {
		fill: #fff;
	}
	.gh {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		fill: var(--color-ink-700);
	}
	.gh.g {
		text-anchor: start;
	}
	.gh.h {
		text-anchor: end;
	}
	.cell.current .gh,
	.cell.path .gh {
		fill: var(--color-parch-200);
	}
	.ad__legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem 1.1rem;
		padding: 0 1rem 0.8rem;
		align-items: center;
	}
	.lg {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.72rem;
		color: var(--color-parch-200);
		font-family: var(--font-mono);
	}
	.lg-k {
		color: var(--color-parch-muted);
	}
	.lg-k b {
		color: var(--blue);
	}
	.sw {
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 3px;
		display: inline-block;
		border: 1px solid var(--color-ink-500);
	}
	.sw.expanded {
		background: var(--blue-pale);
		border-color: var(--blue);
	}
	.sw.frontier {
		background: var(--color-parch-200);
		opacity: 0.55;
	}
	.sw.current {
		background: var(--blue);
	}
	.sw.path {
		background: var(--blue);
		border-color: var(--color-parch-100);
	}
	.sw.wall {
		background: var(--color-ink-600);
	}
	.ad__slider {
		padding: 0.8rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.sl-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.sl-head .lbl {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--color-parch-200);
	}
	.sl-head .lbl code {
		color: var(--blue);
	}
	.sl-head .lbl b {
		color: var(--color-parch-100);
		font-size: 0.85rem;
	}
	.sl-hint {
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		flex: 1 1 240px;
		text-align: right;
		min-width: 200px;
	}
	.ad__slider input[type='range'] {
		width: 100%;
		margin: 0.6rem 0 0.3rem;
		accent-color: var(--blue);
	}
	.sl-scale {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
	}
	.note {
		font-size: 0.84rem;
		line-height: 1.5;
		color: var(--color-parch-200);
		padding: 0.8rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
	}
	.note b {
		color: var(--color-parch-100);
	}
</style>
