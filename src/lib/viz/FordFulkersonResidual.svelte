<script lang="ts">
	// Ford–Fulkerson на транспортной сети s..t. Каждое ребро несёт f/c.
	// Шаг алгоритма распадается на две фазы: «найти дополняющий путь» (поиск в
	// остаточной сети) и «протолкнуть поток» (c_f(p)=min остаточных ёмкостей,
	// насыщение критического ребра). Показываем прямые/обратные рёбра остаточной
	// сети и растущий |f|. Чистый SVG, без зависимостей.
	type Pt = { x: number; y: number; label: string };
	type Edge = { u: number; v: number; cap: number };

	// сеть: 6 вершин, s=0 … t=5
	const nodes: Pt[] = [
		{ x: 45, y: 145, label: 's' },
		{ x: 150, y: 60, label: 'a' },
		{ x: 150, y: 230, label: 'b' },
		{ x: 285, y: 60, label: 'c' },
		{ x: 285, y: 230, label: 'd' },
		{ x: 390, y: 145, label: 't' }
	];
	const S = 0;
	const T = 5;
	const edges: Edge[] = [
		{ u: 0, v: 1, cap: 10 },
		{ u: 0, v: 2, cap: 8 },
		{ u: 1, v: 3, cap: 6 },
		{ u: 1, v: 2, cap: 4 },
		{ u: 2, v: 4, cap: 10 },
		{ u: 3, v: 5, cap: 9 },
		{ u: 3, v: 4, cap: 3 },
		{ u: 4, v: 5, cap: 7 }
	];

	// Снимок одного состояния анимации.
	type Snap = {
		flow: number[]; // поток по каждому ребру (по индексам edges)
		value: number; // |f|
		phase: 'find' | 'push' | 'done'; // что показывает шаг
		path: number[]; // вершины дополняющего пути (для find/push)
		// для каждого ребра пути: индекс ребра и направление (1 прямое / -1 обратное)
		pathEdges: { idx: number; dir: 1 | -1 }[];
		bottleneck: number; // c_f(p)
		critical: number; // индекс критического (насыщаемого) ребра пути, либо -1
		note: string;
	};

	// Остаточная ёмкость прямого ребра e при потоке flow.
	const resFwd = (flow: number[], e: number) => edges[e].cap - flow[e];
	const resBwd = (flow: number[], e: number) => flow[e];

	// Поиск дополняющего пути по остаточной сети (BFS — как в Эдмондсе-Карпе).
	// Возвращает список рёбер пути с направлением, либо null.
	function findPath(flow: number[]): { idx: number; dir: 1 | -1 }[] | null {
		const prev: { node: number; edge: { idx: number; dir: 1 | -1 } }[] = [];
		const visited = new Array(nodes.length).fill(false);
		const queue: number[] = [S];
		visited[S] = true;
		while (queue.length) {
			const u = queue.shift()!;
			if (u === T) break;
			for (let e = 0; e < edges.length; e++) {
				// прямое ребро u→v с остаточной ёмкостью
				if (edges[e].u === u && !visited[edges[e].v] && resFwd(flow, e) > 0) {
					visited[edges[e].v] = true;
					prev[edges[e].v] = { node: u, edge: { idx: e, dir: 1 } };
					queue.push(edges[e].v);
				}
				// обратное ребро v→u (можно вернуть поток)
				if (edges[e].v === u && !visited[edges[e].u] && resBwd(flow, e) > 0) {
					visited[edges[e].u] = true;
					prev[edges[e].u] = { node: u, edge: { idx: e, dir: -1 } };
					queue.push(edges[e].u);
				}
			}
		}
		if (!visited[T]) return null;
		const out: { idx: number; dir: 1 | -1 }[] = [];
		let cur = T;
		while (cur !== S) {
			const p = prev[cur];
			out.unshift(p.edge);
			cur = p.node;
		}
		return out;
	}

	// Вершины пути из списка рёбер.
	function pathNodes(pe: { idx: number; dir: 1 | -1 }[]): number[] {
		const ns = [S];
		for (const p of pe) {
			const e = edges[p.idx];
			ns.push(p.dir === 1 ? e.v : e.u);
		}
		return ns;
	}

	// Прогон Форда-Фалкерсона: на каждой итерации сохраняем «найти» и «протолкнуть».
	function buildSnaps(): Snap[] {
		const snaps: Snap[] = [];
		const flow = new Array(edges.length).fill(0);
		let value = 0;

		snaps.push({
			flow: [...flow], value, phase: 'find', path: [], pathEdges: [], bottleneck: 0,
			critical: -1, note: 'Старт: поток везде 0. Ищем первый дополняющий путь s→t в остаточной сети.'
		});

		let guard = 0;
		while (guard++ < 50) {
			const pe = findPath(flow);
			if (!pe) break;

			// c_f(p) = минимум остаточных ёмкостей рёбер пути
			let bottleneck = Infinity;
			let critical = -1;
			for (const p of pe) {
				const r = p.dir === 1 ? resFwd(flow, p.idx) : resBwd(flow, p.idx);
				if (r < bottleneck) {
					bottleneck = r;
					critical = p.idx;
				}
			}
			const pnodes = pathNodes(pe);
			const labelPath = pnodes.map((n) => nodes[n].label).join('→');

			// фаза «найти»: путь подсвечен, c_f(p) посчитан, поток ещё прежний
			snaps.push({
				flow: [...flow], value, phase: 'find', path: pnodes, pathEdges: pe,
				bottleneck, critical,
				note: `Найден путь ${labelPath}. c_f(p) = min остаточных = ${bottleneck} (критическое ребро выделено).`
			});

			// проталкиваем поток вдоль пути
			for (const p of pe) {
				if (p.dir === 1) flow[p.idx] += bottleneck; // прямое: добавляем
				else flow[p.idx] -= bottleneck; // обратное: возвращаем поток
			}
			value += bottleneck;

			// фаза «протолкнуть»: новый поток, критическое ребро насыщено
			snaps.push({
				flow: [...flow], value, phase: 'push', path: pnodes, pathEdges: pe,
				bottleneck, critical,
				note: `Протолкнули ${bottleneck} ед. по ${labelPath}. Критическое ребро насыщено, |f| = ${value}.`
			});
		}

		snaps.push({
			flow: [...flow], value, phase: 'done', path: [], pathEdges: [], bottleneck: 0,
			critical: -1,
			note: `Дополняющих путей в остаточной сети больше нет. Максимальный поток |f| = ${value}.`
		});
		return snaps;
	}

	const snaps = buildSnaps();

	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(snaps[Math.min(idx, snaps.length - 1)]);

	// множество рёбер пути (по индексу edges) и направление по каждому
	const pathDir = $derived.by(() => {
		const m = new Map<number, 1 | -1>();
		for (const p of cur.pathEdges) m.set(p.idx, p.dir);
		return m;
	});
	const pathNodeSet = $derived(new Set(cur.path));

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= snaps.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 1100);
	}
	function reset() {
		stop();
		idx = 0;
	}

	const R = 18;
	// укоротить отрезок до края кружков, чтобы стрелка садилась на ободок
	function seg(e: Edge) {
		const p = nodes[e.u], q = nodes[e.v];
		const dx = q.x - p.x, dy = q.y - p.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len, uy = dy / len;
		return { x1: p.x + ux * R, y1: p.y + uy * R, x2: q.x - ux * R, y2: q.y - uy * R };
	}
	function mid(e: Edge) {
		const s = seg(e);
		return { x: (s.x1 + s.x2) / 2, y: (s.y1 + s.y2) / 2 };
	}
	// смещение подписи перпендикулярно ребру, чтобы не лежала на линии
	function labelPos(e: Edge, off: number) {
		const s = seg(e);
		const mx = (s.x1 + s.x2) / 2, my = (s.y1 + s.y2) / 2;
		const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
		const len = Math.hypot(dx, dy) || 1;
		return { x: mx + (-dy / len) * off, y: my + (dx / len) * off };
	}

	type EState = 'idle' | 'fwd' | 'bwd' | 'critical' | 'saturated';
	function edgeState(e: number): EState {
		const sat = cur.flow[e] >= edges[e].cap && edges[e].cap > 0;
		if (cur.phase !== 'done' && pathDir.has(e)) {
			if (e === cur.critical) return 'critical';
			return pathDir.get(e) === 1 ? 'fwd' : 'bwd';
		}
		return sat ? 'saturated' : 'idle';
	}
</script>

<div class="ff">
	<div class="ff__bar">
		<div class="title">Форд–Фалкерсон · остаточная сеть</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(snaps.length - 1, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{snaps.length - 1}</span>
		</div>
	</div>

	<div class="ff__body">
		<svg viewBox="0 0 420 290" class="ff__svg">
			<defs>
				<marker id="ff-arr" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--color-ink-500)" />
				</marker>
				<marker id="ff-arr-fwd" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
				<marker id="ff-arr-crit" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--color-parch-100)" />
				</marker>
			</defs>

			{#each edges as e, i}
				{@const s = seg(e)}
				{@const st = edgeState(i)}
				{@const cf = resFwd(cur.flow, i)}
				{@const lp = labelPos(e, 12)}
				<!-- прямое ребро сети -->
				<line
					x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
					class="edge {st}"
					marker-end={st === 'critical' ? 'url(#ff-arr-crit)' : st === 'fwd' || st === 'bwd' ? 'url(#ff-arr-fwd)' : 'url(#ff-arr)'}
				/>
				<!-- обратное ребро остаточной сети: пунктир в обратную сторону, если поток >0 -->
				{#if resBwd(cur.flow, i) > 0}
					{@const back = labelPos(e, -13)}
					<line
						x1={s.x2} y1={s.y2} x2={s.x1} y2={s.y1}
						class="edge back {st === 'bwd' ? 'bwd' : ''}"
						marker-end={st === 'bwd' ? 'url(#ff-arr-fwd)' : 'url(#ff-arr)'}
					/>
					<text x={back.x} y={back.y} dy="0.32em" class="rlabel back-lbl">{resBwd(cur.flow, i)}</text>
				{/if}
				<!-- подпись f/c -->
				<g class="fc" class:on={st !== 'idle' && st !== 'saturated'}>
					<text x={lp.x} y={lp.y} dy="0.32em" class="fclabel">{cur.flow[i]}/{e.cap}</text>
				</g>
				<!-- остаточная ёмкость прямого ребра у середины -->
				{@const m = mid(e)}
				<text x={m.x} y={m.y - 7} class="rlabel">c_f={cf}</text>
			{/each}

			{#each nodes as n, i}
				<g class="node" class:onpath={pathNodeSet.has(i) && cur.phase !== 'done'} class:term={i === S || i === T}>
					<circle cx={n.x} cy={n.y} r={R} />
					<text x={n.x} y={n.y} dy="0.34em">{n.label}</text>
				</g>
			{/each}
		</svg>

		<div class="ff__panel">
			<div class="phase">
				<span class="ph" class:active={cur.phase === 'find'}>1 · найти путь</span>
				<span class="arr">→</span>
				<span class="ph" class:active={cur.phase === 'push'}>2 · протолкнуть</span>
			</div>

			<div class="metrics">
				<div class="metric">
					<span>величина потока |f|</span>
					<b class="big">{cur.value}</b>
				</div>
				<div class="metric">
					<span>c_f(p) = min остат.</span>
					<b>{cur.bottleneck > 0 ? cur.bottleneck : '—'}</b>
				</div>
			</div>

			<div class="row">
				<span class="lbl">Дополняющий путь</span>
				<div class="chips">
					{#each cur.path as p, k}
						<span class="chip" class:crit={cur.pathEdges[k - 1] && cur.pathEdges[k - 1].idx === cur.critical}>{nodes[p].label}</span>
						{#if k < cur.path.length - 1}<span class="sep">→</span>{/if}
					{:else}
						<span class="empty">—</span>
					{/each}
				</div>
			</div>

			<div class="legend">
				<span><i class="sw fwd"></i> прямое (c−f &gt; 0)</span>
				<span><i class="sw bwd"></i> обратное (вернуть f)</span>
				<span><i class="sw crit"></i> критическое</span>
				<span><i class="sw sat"></i> насыщено</span>
			</div>

			<div class="note">{cur.note}</div>
		</div>
	</div>
</div>

<style>
	.ff {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.ff__bar {
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
	.ff__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.ff__svg {
		flex: 1 1 340px;
		min-width: 300px;
		max-width: 480px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.25s, stroke-width 0.25s;
	}
	.edge.saturated {
		stroke: var(--color-ink-700);
		stroke-width: 2.5;
	}
	.edge.fwd,
	.edge.bwd {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.edge.critical {
		stroke: var(--color-parch-100);
		stroke-width: 4.5;
	}
	.edge.back {
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		stroke-dasharray: 4 3;
	}
	.edge.back.bwd {
		stroke: var(--blue);
		stroke-width: 3.5;
		stroke-dasharray: none;
	}
	.fclabel {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.66rem;
		fill: var(--color-parch-200);
	}
	.fc.on .fclabel {
		fill: var(--blue);
	}
	.rlabel {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.rlabel.back-lbl {
		fill: var(--color-ink-500);
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
	.node.term circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.term text {
		fill: var(--blue);
	}
	.node.onpath circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	.node.onpath text {
		fill: #fff;
	}
	.ff__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.phase {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.phase .ph {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		padding: 0.28rem 0.55rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		color: var(--color-parch-muted);
		transition: all 0.2s;
	}
	.phase .ph.active {
		background: var(--blue);
		border-color: var(--blue);
		color: #fff;
	}
	.phase .arr {
		color: var(--color-parch-muted);
		font-size: 0.8rem;
	}
	.metrics {
		display: flex;
		gap: 0.6rem;
	}
	.metric {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.45rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 8px;
	}
	.metric span {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-parch-muted);
	}
	.metric b {
		font-family: var(--font-display);
		font-weight: 800;
		color: var(--color-parch-100);
		font-size: 0.95rem;
	}
	.metric b.big {
		color: var(--blue);
		font-size: 1.3rem;
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
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
		min-height: 1.8rem;
	}
	.chip {
		display: grid;
		place-items: center;
		min-width: 1.5rem;
		height: 1.5rem;
		padding: 0 0.35rem;
		border-radius: 6px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		background: var(--blue);
		color: #fff;
	}
	.chip.crit {
		background: var(--color-parch-100);
		color: var(--color-ink-850);
	}
	.sep {
		color: var(--color-parch-muted);
		font-size: 0.72rem;
	}
	.empty {
		color: var(--color-parch-muted);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.7rem;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		color: var(--color-parch-muted);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.sw {
		width: 0.8rem;
		height: 0.3rem;
		border-radius: 2px;
		display: inline-block;
	}
	.sw.fwd { background: var(--blue); }
	.sw.bwd { background: var(--blue); border: 1px dashed var(--color-parch-100); }
	.sw.crit { background: var(--color-parch-100); }
	.sw.sat { background: var(--color-ink-700); }
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
