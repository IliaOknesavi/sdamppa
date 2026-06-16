<script lang="ts">
	// Interactive union-find: one fixed series of UNION operations replayed under
	// two merge strategies side by side. Наивное слияние (всегда a→b) вырождает
	// дерево в цепочку высотой ~N; объединение по рангу держит высоту ~log N.
	// Подписи rank/size у корней, рост ранга при равенстве. Step / play / reset.
	// Pure SVG/HTML, no deps; same visual language as GraphTraversal/GraphTypes.
	const N = 8;
	const L = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

	// Серия слияний — подобрана так, чтобы наивно дерево вытянулось в цепочку
	// (высота растёт с каждым слиянием), а по рангу осталось сбалансированным
	// (высота ~log N) с ростом ранга корня при равных рангах.
	const SERIES: [number, number][] = [
		[0, 1], [1, 2], [3, 4], [4, 5], [2, 3], [6, 7], [5, 6]
	];

	type DS = {
		parent: number[];
		rank: number[]; // ранг (наивно) либо ранг по высоте (по рангу)
		size: number[]; // размер поддерева у корня
	};

	function freshDS(): DS {
		return {
			parent: Array.from({ length: N }, (_, i) => i),
			rank: new Array(N).fill(0),
			size: new Array(N).fill(1)
		};
	}

	// find БЕЗ сжатия путей — чтобы наглядно видеть высоту цепочки
	function find(d: DS, x: number): number {
		while (d.parent[x] !== x) x = d.parent[x];
		return x;
	}

	type Frame = { ds: DS; note: string; touched: [number, number] | null };

	function cloneDS(d: DS): DS {
		return { parent: [...d.parent], rank: [...d.rank], size: [...d.size] };
	}

	// Прогон серии в выбранной стратегии → массив кадров (по кадру на union + старт)
	function run(mode: 'naive' | 'rank'): Frame[] {
		const d = freshDS();
		const frames: Frame[] = [
			{ ds: cloneDS(d), note: 'старт: ' + N + ' одиночных множеств', touched: null }
		];
		for (const [u, v] of SERIES) {
			const ru = find(d, u);
			const rv = find(d, v);
			if (ru === rv) {
				frames.push({
					ds: cloneDS(d),
					note: 'union(' + L[u] + ', ' + L[v] + '): уже в одном множестве',
					touched: [ru, rv]
				});
				continue;
			}
			let note: string;
			if (mode === 'naive') {
				// наивно: корень ru всегда подвешиваем под rv → растёт цепочка
				d.parent[ru] = rv;
				d.size[rv] += d.size[ru];
				note =
					'наивно: корень ' + L[ru] + ' → под ' + L[rv] + ' (высота растёт)';
			} else {
				// по рангу: меньший ранг под больший; при равенстве ранг корня +1
				if (d.rank[ru] < d.rank[rv]) {
					d.parent[ru] = rv;
					d.size[rv] += d.size[ru];
					note = 'по рангу: ' + L[ru] + ' (ранг ' + d.rank[ru] + ') → под ' + L[rv] + ' (ранг ' + d.rank[rv] + ')';
				} else if (d.rank[ru] > d.rank[rv]) {
					d.parent[rv] = ru;
					d.size[ru] += d.size[rv];
					note = 'по рангу: ' + L[rv] + ' (ранг ' + d.rank[rv] + ') → под ' + L[ru] + ' (ранг ' + d.rank[ru] + ')';
				} else {
					// равные ранги → подвешиваем rv под ru и ранг ru растёт
					d.parent[rv] = ru;
					d.size[ru] += d.size[rv];
					d.rank[ru] += 1;
					note = 'равные ранги ' + d.rank[rv] + ': ' + L[rv] + ' → под ' + L[ru] + ', ранг ' + L[ru] + ' стал ' + d.rank[ru];
				}
			}
			frames.push({ ds: cloneDS(d), note, touched: [ru, rv] });
		}
		frames.push({
			ds: cloneDS(d),
			note: 'серия завершена — все в одном множестве',
			touched: null
		});
		return frames;
	}

	const naiveFrames = run('naive');
	const rankFrames = run('rank');
	const maxSteps = SERIES.length + 1; // индекс последнего кадра

	// ── состояние UI ──────────────────────────────────────────────
	let mode = $state<'naive' | 'rank'>('rank');
	let idx = $state(0);
	let playing = $state(false);

	const frames = $derived(mode === 'naive' ? naiveFrames : rankFrames);
	const cur = $derived(frames[Math.min(idx, frames.length - 1)]);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= maxSteps) {
				stop();
				return;
			}
			idx += 1;
		}, 950);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setMode(m: 'naive' | 'rank') {
		mode = m;
		// idx сохраняем — удобно сравнивать стратегии на том же шаге
	}

	// ── раскладка леса деревьев из массива parent ────────────────
	type Node = { id: number; x: number; y: number; depth: number };
	type Layout = { nodes: Node[]; links: [number, number][]; height: number };

	const VB_W = 420;
	const VB_H = 240;
	const R = 15;
	const LEVEL = 46; // вертикальный шаг между уровнями
	const GAP = 36; // горизонтальный шаг между листьями

	function layout(ds: DS): Layout {
		const children: number[][] = Array.from({ length: N }, () => []);
		const roots: number[] = [];
		for (let i = 0; i < N; i++) {
			if (ds.parent[i] === i) roots.push(i);
			else children[ds.parent[i]].push(i);
		}
		const depth = new Array(N).fill(0);
		const x = new Array(N).fill(0);
		let cursor = 0; // позиция следующего листа в «слотах»
		let maxDepth = 0;

		// пост-ордер: x корня = центр его листьев, листья кладём слева направо
		function place(node: number, d: number) {
			depth[node] = d;
			if (d > maxDepth) maxDepth = d;
			const kids = children[node];
			if (kids.length === 0) {
				x[node] = cursor;
				cursor += 1;
				return;
			}
			for (const k of kids) place(k, d + 1);
			// центрируем родителя над крайними детьми
			x[node] = (x[kids[0]] + x[kids[kids.length - 1]]) / 2;
		}
		for (const r of roots) {
			place(r, 0);
			cursor += 0.6; // зазор между деревьями
		}

		const totalSlots = Math.max(cursor - 0.6, 1);
		const spanW = (totalSlots - 1) * GAP;
		const x0 = (VB_W - spanW) / 2;
		const nodes: Node[] = [];
		for (let i = 0; i < N; i++) {
			nodes.push({
				id: i,
				x: x0 + x[i] * GAP,
				y: 30 + depth[i] * LEVEL,
				depth: depth[i]
			});
		}
		const links: [number, number][] = [];
		for (let i = 0; i < N; i++) {
			if (ds.parent[i] !== i) links.push([i, ds.parent[i]]);
		}
		return { nodes, links, height: maxDepth };
	}

	const lay = $derived(layout(cur.ds));
	const isRoot = (i: number) => cur.ds.parent[i] === i;
	function touchedSet() {
		return new Set(cur.touched ?? []);
	}
	const touched = $derived(touchedSet());
</script>

<div class="uf">
	<div class="uf__bar">
		<div class="seg">
			<button class:on={mode === 'naive'} onclick={() => setMode('naive')}>Наивно</button>
			<button class:on={mode === 'rank'} onclick={() => setMode('rank')}>По рангу</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(maxSteps, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{maxSteps}</span>
		</div>
	</div>

	<div class="uf__body">
		<svg viewBox="0 0 {VB_W} {VB_H}" class="uf__svg">
			{#each lay.links as [c, p]}
				<line
					x1={lay.nodes[c].x} y1={lay.nodes[c].y}
					x2={lay.nodes[p].x} y2={lay.nodes[p].y}
					class="edge"
				/>
			{/each}
			{#each lay.nodes as n}
				<g class="node" class:root={isRoot(n.id)} class:hit={touched.has(n.id)}>
					<circle cx={n.x} cy={n.y} r={R} />
					<text x={n.x} y={n.y} dy="0.34em">{L[n.id]}</text>
					{#if isRoot(n.id)}
						<g class="tag" style="transform: translate({n.x + R + 2}px, {n.y}px)">
							<rect x="0" y="-15" width="58" height="30" rx="5" />
							<text x="6" y="-4" class="tk">{mode === 'naive' ? 'size' : 'rank'}</text>
							<text x="6" y="9" class="tv">{mode === 'naive' ? cur.ds.size[n.id] : cur.ds.rank[n.id]}</text>
							<text x="32" y="-4" class="tk">size</text>
							<text x="32" y="9" class="tv2">{cur.ds.size[n.id]}</text>
						</g>
					{/if}
				</g>
			{/each}
		</svg>

		<div class="uf__panel">
			<div class="metric">
				<div class="m">
					<span class="lbl">Высота дерева</span>
					<b class="big" class:warn={mode === 'naive'}>{lay.height}</b>
					<span class="hint">{mode === 'naive' ? '≈ N (цепочка)' : '≈ log₂N'}</span>
				</div>
				<div class="m">
					<span class="lbl">Стратегия</span>
					<b>{mode === 'naive' ? 'a → b всегда' : 'меньший ранг под больший'}</b>
				</div>
			</div>

			<div class="series">
				<span class="lbl">Серия union</span>
				<div class="ops">
					{#each SERIES as [u, v], i}
						<span
							class="op"
							class:done={i < idx}
							class:now={i === idx - 1}
						>{L[u]}∪{L[v]}</span>
					{/each}
				</div>
			</div>

			<div class="note">{cur.note}</div>
		</div>
	</div>

	<div class="uf__foot">
		<span>Наивно высота растёт линейно — find деградирует до O(N). Союз по рангу держит дерево плоским, find → O(log N).</span>
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
		padding: 0.4rem 0.85rem;
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
	.uf__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.uf__svg {
		flex: 1 1 360px;
		min-width: 300px;
		max-width: 480px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.25s;
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
		font-size: 0.9rem;
		fill: var(--color-parch-100);
	}
	.node.root circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.root text {
		fill: #fff;
	}
	.node.hit circle {
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.tag rect {
		fill: var(--color-ink-800);
		stroke: var(--blue);
		stroke-width: 1;
	}
	.tag .tk {
		font-family: var(--font-mono);
		font-size: 0.42rem;
		fill: var(--color-parch-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.tag .tv {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		fill: var(--blue);
	}
	.tag .tv2 {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		fill: var(--color-parch-100);
	}
	.uf__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.metric {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
	}
	.m {
		flex: 1 1 90px;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.5rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 8px;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--color-parch-muted);
	}
	.m b {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.82rem;
		color: var(--color-parch-100);
	}
	.m b.big {
		font-size: 1.5rem;
		line-height: 1;
		color: var(--blue);
	}
	.m b.big.warn {
		color: var(--color-gold-500, #d99a2b);
	}
	.hint {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-200);
	}
	.series {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.ops {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.op {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		padding: 0.18rem 0.4rem;
		border-radius: 5px;
		border: 1.5px solid var(--color-ink-600);
		color: var(--color-parch-muted);
		background: var(--color-ink-850);
		transition: all 0.2s;
	}
	.op.done {
		color: var(--color-parch-100);
		border-color: var(--blue);
	}
	.op.now {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
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
	.uf__foot {
		padding: 0.7rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		font-size: 0.76rem;
		color: var(--color-parch-200);
	}
</style>
