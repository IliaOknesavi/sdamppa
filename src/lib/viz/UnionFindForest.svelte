<script lang="ts">
	// Union-Find (DSU) forest over parent[]. Operations FIND(x) and UNION(a,b)
	// are recorded as real algorithm steps: FIND highlights the path to the root,
	// then (if compression is on) re-hangs every node on the path directly onto
	// the root. UNION attaches the lighter tree under the heavier (by rank) and
	// links the two roots. A toggle turns path compression on/off so the height
	// contrast is visible. Pure SVG, no deps; same visual language as the others.
	type Snapshot = {
		parent: number[];
		rank: number[];
		path: number[]; // nodes touched on the current FIND path
		root: number | null; // resolved root of the current FIND
		active: number[]; // nodes emphasised this step (e.g. the two roots in UNION)
		link: [number, number] | null; // parent-pointer just created/redirected (child -> parent)
		note: string;
	};

	const N = 8;
	const L = ['0', '1', '2', '3', '4', '5', '6', '7'];

	// Initial forest: two skewed chains so FIND has something to compress.
	//   3 → 2 → 1 → 0   (0 is root)
	//   6 → 5           (4 is root of 4·5·6, 7 lone)
	function initParent(): number[] {
		return [0, 0, 1, 2, 4, 4, 5, 7];
	}
	function initRank(): number[] {
		// rank ≈ height upper bound; chains built without union-by-rank → tall.
		return [3, 2, 1, 0, 2, 1, 0, 0];
	}

	let compress = $state(true);
	let parent = $state(initParent());
	let rank = $state(initRank());
	let steps = $state<Snapshot[]>([]);
	let idx = $state(0);
	let playing = $state(false);

	const cur = $derived(
		steps.length ? steps[Math.min(idx, steps.length - 1)] : null
	);
	// live arrays for layout: while replaying, mirror the snapshot's parent/rank
	const viewParent = $derived(cur ? cur.parent : parent);
	const viewRank = $derived(cur ? cur.rank : rank);

	function findRoot(p: number[], x: number): number {
		let r = x;
		while (p[r] !== r) r = p[r];
		return r;
	}

	// Build the step list for FIND(x) on a working copy, then commit it.
	function runFind(x: number) {
		const p = [...parent];
		const rk = [...rank];
		const out: Snapshot[] = [];
		const snap = (s: Partial<Snapshot>): void => {
			out.push({
				parent: [...p],
				rank: [...rk],
				path: [],
				root: null,
				active: [],
				link: null,
				note: '',
				...s
			});
		};

		// 1. walk up to the root, recording the path
		const path: number[] = [];
		let r = x;
		while (p[r] !== r) {
			path.push(r);
			snap({ path: [...path], active: [r], note: `идём вверх: parent[${r}] = ${p[r]}` });
			r = p[r];
		}
		path.push(r);
		snap({ path: [...path], root: r, active: [r], note: `корень множества — ${r}` });

		// 2. path compression: re-hang every visited node directly on the root
		if (compress) {
			const toHang = path.filter((v) => v !== r && p[v] !== r);
			if (toHang.length === 0) {
				snap({ path: [...path], root: r, note: 'сжимать нечего — путь уже короткий' });
			}
			for (const v of toHang) {
				p[v] = r;
				snap({
					parent: [...p],
					path: [...path],
					root: r,
					active: [v],
					link: [v, r],
					note: `сжатие: parent[${v}] ← ${r}`
				});
			}
		} else {
			snap({ path: [...path], root: r, note: 'сжатие путей выключено — дерево не меняется' });
		}

		commit(p, rk, out);
	}

	// Build the step list for UNION(a,b) with union by rank, then commit it.
	function runUnion(a: number, b: number) {
		const p = [...parent];
		const rk = [...rank];
		const out: Snapshot[] = [];
		const snap = (s: Partial<Snapshot>): void => {
			out.push({
				parent: [...p],
				rank: [...rk],
				path: [],
				root: null,
				active: [],
				link: null,
				note: '',
				...s
			});
		};

		const ra = findRoot(p, a);
		const rb = findRoot(p, b);
		snap({ active: [ra, rb], note: `корни: FIND(${a}) = ${ra}, FIND(${b}) = ${rb}` });

		if (ra === rb) {
			snap({ active: [ra], note: `${a} и ${b} уже в одном множестве — объединять нечего` });
			commit(p, rk, out);
			return;
		}

		// attach smaller rank under larger; on tie pick ra and bump its rank
		let hi = ra;
		let lo = rb;
		if (rk[ra] < rk[rb]) {
			hi = rb;
			lo = ra;
		}
		p[lo] = hi;
		const tie = rk[ra] === rk[rb];
		if (tie) rk[hi] += 1;
		snap({
			parent: [...p],
			rank: [...rk],
			active: [hi],
			link: [lo, hi],
			note: tie
				? `ранги равны → подвешиваем ${lo} под ${hi}, rank[${hi}] = ${rk[hi]}`
				: `ранг ${hi} (${rk[hi]}) ≥ ранг ${lo} → подвешиваем ${lo} под ${hi}`
		});

		commit(p, rk, out);
	}

	function commit(p: number[], rk: number[], out: Snapshot[]) {
		stop();
		parent = p;
		rank = rk;
		steps = out;
		idx = 0;
	}

	function reset() {
		stop();
		parent = initParent();
		rank = initRank();
		steps = [];
		idx = 0;
	}

	// --- playback controls (mirrors GraphTraversal) ---
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		if (steps.length <= 1) return;
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= steps.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 800);
	}

	// --- layout: place each tree's nodes by depth (level) and order ---
	type Lay = { x: number; y: number };
	const W = 420;
	const TOP = 26;
	const LEVEL_H = 52;

	const layout = $derived.by<Lay[]>(() => {
		const p = viewParent;
		const roots: number[] = [];
		for (let i = 0; i < N; i++) if (p[i] === i) roots.push(i);

		// children adjacency from parent pointers (skip self-loops at roots)
		const kids: number[][] = Array.from({ length: N }, () => []);
		for (let i = 0; i < N; i++) if (p[i] !== i) kids[p[i]].push(i);
		for (const k of kids) k.sort((u, v) => u - v);

		// depth of each node
		const depth = new Array<number>(N).fill(0);
		const order: number[] = [];
		const walk = (node: number, d: number) => {
			depth[node] = d;
			order.push(node);
			for (const ch of kids[node]) walk(ch, d + 1);
		};
		for (const r of roots) walk(r, 0);

		// assign an x-slot per node in DFS order so trees don't overlap
		const lay: Lay[] = new Array(N);
		const slotW = W / N;
		order.forEach((node, i) => {
			lay[node] = {
				x: slotW * (i + 0.5),
				y: TOP + depth[node] * LEVEL_H
			};
		});
		return lay;
	});

	const maxDepth = $derived.by<number>(() => {
		const p = viewParent;
		let md = 0;
		for (let i = 0; i < N; i++) {
			let d = 0;
			let r = i;
			while (p[r] !== r) {
				r = p[r];
				d++;
			}
			if (d > md) md = d;
		}
		return md;
	});

	const pathSet = $derived(new Set(cur?.path ?? []));
	const activeSet = $derived(new Set(cur?.active ?? []));

	function nodeState(id: number): string {
		if (!cur) return 'idle';
		if (cur.root === id) return 'root';
		if (activeSet.has(id)) return 'active';
		if (pathSet.has(id)) return 'path';
		return 'idle';
	}

	function edgeActive(child: number): boolean {
		if (!cur || !cur.link) return false;
		return cur.link[0] === child;
	}
	function edgeOnPath(child: number): boolean {
		return pathSet.has(child) && pathSet.has(viewParent[child]);
	}

	// FIND / UNION demo argument cyclers so the buttons stay self-contained
	let findArg = $state(3);
	let unionA = $state(3);
	let unionB = $state(6);
	function cycleFind() {
		findArg = (findArg + 1) % N;
	}
	function cycleUnion() {
		// step through a few illustrative pairs
		const pairs: [number, number][] = [
			[3, 6],
			[7, 5],
			[3, 2],
			[6, 7],
			[1, 4]
		];
		const i = pairs.findIndex(([a, b]) => a === unionA && b === unionB);
		const nx = pairs[(i + 1 + pairs.length) % pairs.length];
		unionA = nx[0];
		unionB = nx[1];
	}
</script>

<div class="uf">
	<div class="uf__bar">
		<div class="ops">
			<div class="op">
				<button class="run" onclick={() => runFind(findArg)}>FIND({findArg})</button>
				<button class="step" onclick={cycleFind} title="другой аргумент">x±</button>
			</div>
			<div class="op">
				<button class="run" onclick={() => runUnion(unionA, unionB)}>
					UNION({unionA},{unionB})
				</button>
				<button class="step" onclick={cycleUnion} title="другая пара">a,b±</button>
			</div>
		</div>
		<label class="toggle">
			<input type="checkbox" bind:checked={compress} />
			<span>сжатие путей</span>
		</label>
	</div>

	<div class="uf__ctrl">
		<button onclick={reset} title="сброс">↺ сброс</button>
		<div class="play">
			<button
				onclick={() => {
					stop();
					idx = Math.max(0, idx - 1);
				}}
				title="назад"
				disabled={!steps.length}>◀</button
			>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть" disabled={steps.length <= 1}>▶</button>
			{/if}
			<button
				onclick={() => {
					stop();
					idx = Math.min(steps.length - 1, idx + 1);
				}}
				title="вперёд"
				disabled={!steps.length}>▶▶</button
			>
			<span class="cnt">{steps.length ? idx : 0}/{steps.length ? steps.length - 1 : 0}</span>
		</div>
	</div>

	<div class="uf__body">
		<svg viewBox="0 0 420 290" class="uf__svg">
			<defs>
				<marker
					id="uf-arr"
					markerWidth="8"
					markerHeight="8"
					refX="6.5"
					refY="3"
					orient="auto"
				>
					<path d="M0,0 L6.5,3 L0,6 z" fill="var(--color-ink-500)" />
				</marker>
				<marker
					id="uf-arr-on"
					markerWidth="8"
					markerHeight="8"
					refX="6.5"
					refY="3"
					orient="auto"
				>
					<path d="M0,0 L6.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
			</defs>

			<!-- parent-pointer edges: child → parent -->
			{#each Array(N) as _, i}
				{#if viewParent[i] !== i}
					{@const cn = layout[i]}
					{@const pn = layout[viewParent[i]]}
					{@const dx = pn.x - cn.x}
					{@const dy = pn.y - cn.y}
					{@const len = Math.hypot(dx, dy) || 1}
					<line
						x1={cn.x + (dx / len) * 16}
						y1={cn.y + (dy / len) * 16}
						x2={pn.x - (dx / len) * 16}
						y2={pn.y - (dy / len) * 16}
						class="edge"
						class:on={edgeActive(i)}
						class:path={edgeOnPath(i)}
						marker-end={edgeActive(i) || edgeOnPath(i) ? 'url(#uf-arr-on)' : 'url(#uf-arr)'}
					/>
				{/if}
			{/each}

			<!-- nodes -->
			{#each Array(N) as _, i}
				{@const ln = layout[i]}
				<g class="node {nodeState(i)}" style="transform: translate({ln.x}px, {ln.y}px)">
					<circle r="14" />
					<text dy="0.34em">{L[i]}</text>
					{#if viewParent[i] === i}
						<text class="rk" dy="0.34em" x="0" y="-24">r{viewRank[i]}</text>
					{/if}
				</g>
			{/each}
		</svg>

		<div class="uf__panel">
			<div class="row">
				<span class="lbl">parent[]</span>
				<div class="arr">
					{#each Array(N) as _, i}
						<div
							class="cell"
							class:root={viewParent[i] === i}
							class:hot={pathSet.has(i) || activeSet.has(i)}
						>
							<b>{viewParent[i]}</b>
							<i>{i}</i>
						</div>
					{/each}
				</div>
			</div>
			<div class="stat">
				<span class="lbl">высота леса</span>
				<div class="hbar">
					<i style="width: {Math.min(maxDepth / 4, 1) * 100}%"></i>
					<b>{maxDepth}</b>
				</div>
				<small>
					{compress
						? 'сжатие включено: пути коллапсируют, высота стремится к 1'
						: 'сжатие выключено: цепочки остаются длинными, FIND медленнее'}
				</small>
			</div>
			<div class="note">{cur ? cur.note : 'Нажмите FIND(x) или UNION(a,b). x± и a,b± меняют аргументы.'}</div>
		</div>
	</div>
</div>

<style>
	.uf {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.uf__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.ops {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.op {
		display: flex;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		overflow: hidden;
	}
	.op .run {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.76rem;
		padding: 0.4rem 0.7rem;
		border: none;
		background: var(--blue);
		color: #fff;
		cursor: pointer;
	}
	.op .run:hover {
		filter: brightness(1.1);
	}
	.op .step {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		padding: 0.4rem 0.5rem;
		border: none;
		border-left: 1.5px solid var(--blue);
		background: transparent;
		color: var(--blue);
		cursor: pointer;
	}
	.op .step:hover {
		background: var(--blue-pale);
	}
	.toggle {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.76rem;
		color: var(--color-parch-100);
		cursor: pointer;
	}
	.toggle input {
		accent-color: var(--blue);
		width: 1rem;
		height: 1rem;
		cursor: pointer;
	}
	.uf__ctrl {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		flex-wrap: wrap;
		padding: 0.5rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.uf__ctrl > button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		padding: 0.35rem 0.7rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
	}
	.uf__ctrl > button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.play {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.play button {
		width: 2rem;
		height: 2rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.8rem;
	}
	.play button:hover:not(:disabled) {
		border-color: var(--blue);
		color: var(--blue);
	}
	.play button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}
	.uf__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.uf__svg {
		flex: 1 1 340px;
		min-width: 290px;
		max-width: 470px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: stroke 0.3s, stroke-width 0.3s;
	}
	.edge.path {
		stroke: var(--blue);
		stroke-width: 2.6;
	}
	.edge.on {
		stroke: var(--blue);
		stroke-width: 3.4;
	}
	.node {
		transition: transform 0.45s ease;
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.4;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		fill: var(--color-parch-100);
	}
	.node text.rk {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.node.path circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.active circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.active text {
		fill: #fff;
	}
	.node.root circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.4;
	}
	.node.root text {
		fill: #fff;
	}
	.uf__panel {
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
		letter-spacing: 0.09em;
		color: var(--color-parch-muted);
	}
	.arr {
		display: flex;
		flex-wrap: wrap;
		gap: 0.22rem;
	}
	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 1.6rem;
		border: 1.5px solid var(--color-ink-600);
		border-radius: 6px;
		overflow: hidden;
		transition: border-color 0.2s;
	}
	.cell b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.78rem;
		color: var(--color-parch-100);
		padding: 0.12rem 0.32rem;
	}
	.cell i {
		font-family: var(--font-mono);
		font-style: normal;
		font-size: 0.54rem;
		color: var(--color-parch-muted);
		background: var(--color-ink-800);
		width: 100%;
		text-align: center;
		padding: 0.05rem 0;
	}
	.cell.root {
		border-color: var(--color-parch-muted);
	}
	.cell.root b {
		color: var(--color-parch-200);
	}
	.cell.hot {
		border-color: var(--blue);
	}
	.cell.hot b {
		color: var(--blue);
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.hbar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		height: 0.7rem;
	}
	.hbar i {
		display: block;
		height: 0.7rem;
		background: var(--blue);
		border-radius: 5px;
		min-width: 4px;
		transition: width 0.4s;
	}
	.hbar b {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-100);
	}
	.stat small {
		font-size: 0.72rem;
		color: var(--color-parch-200);
	}
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
