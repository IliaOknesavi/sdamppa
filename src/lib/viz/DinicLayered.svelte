<script lang="ts">
	// Алгоритм Диница по фазам. BFS строит слоистую сеть G_L (рёбра только
	// d→d+1), затем блокирующий поток находится пачкой путей одной длины.
	// Видно: d[t] строго растёт между фазами, |f| идёт вверх. Шаг/плей/сброс.
	// Чистый инлайн-SVG, без внешних импортов, цвета — через CSS-переменные.
	type Edge = { u: number; v: number; cap: number };
	type Path = { nodes: number[]; amt: number };
	type Phase = {
		level: number[]; // d[] от BFS этой фазы
		lay: number[]; // индексы рёбер слоистой сети G_L
		paths: Path[]; // блокирующий поток — пачка путей длины d[t]
		pushed: number; // сколько протолкнули за фазу
		flowBefore: number;
		flowAfter: number;
		dt: number; // d[t] этой фазы
	};

	const LBL = ['s', 'a', 'b', 'c', 'd', 't'];
	const POS: [number, number][] = [
		[45, 145], [155, 80], [155, 210], [270, 80], [270, 210], [380, 145]
	];
	const EDGES: Edge[] = [
		{ u: 0, v: 1, cap: 3 }, { u: 0, v: 2, cap: 2 }, { u: 1, v: 2, cap: 1 },
		{ u: 1, v: 3, cap: 3 }, { u: 2, v: 4, cap: 2 }, { u: 3, v: 4, cap: 1 },
		{ u: 3, v: 5, cap: 2 }, { u: 4, v: 5, cap: 3 }
	];
	const N = 6;
	const S = 0;
	const T = 5;

	// Корректный Диниц: считаем фазы один раз, фиксируем для пошагового показа.
	function computePhases(): { phases: Phase[]; maxflow: number } {
		const to: number[] = [];
		const cap: number[] = [];
		const head: number[][] = Array.from({ length: N }, () => []);
		const add = (u: number, v: number, c: number) => {
			const fwd = to.length;
			head[u].push(to.length);
			to.push(v);
			cap.push(c);
			head[v].push(to.length);
			to.push(u);
			cap.push(0);
			return fwd;
		};
		const eid = EDGES.map((e) => add(e.u, e.v, e.cap));

		let flow = 0;
		const phases: Phase[] = [];
		for (;;) {
			// BFS строит уровни d[] по остаточной сети
			const level = new Array<number>(N).fill(-1);
			level[S] = 0;
			const q: number[] = [S];
			while (q.length) {
				const u = q.shift()!;
				for (const id of head[u]) {
					const v = to[id];
					if (cap[id] > 0 && level[v] < 0) {
						level[v] = level[u] + 1;
						q.push(v);
					}
				}
			}
			if (level[T] < 0) break; // t недостижим — алгоритм завершён

			// Слоистая сеть: только прямые рёбра с остатком и скачком уровня d→d+1
			const lay: number[] = [];
			EDGES.forEach((e, k) => {
				if (cap[eid[k]] > 0 && level[e.v] === level[e.u] + 1) lay.push(k);
			});

			// Блокирующий поток: пачка путей одной длины d[t] (DFS с указателем it)
			const it = head.map(() => 0);
			const dfs = (u: number, f: number, path: number[]): number => {
				if (u === T) return f;
				for (; it[u] < head[u].length; it[u]++) {
					const id = head[u][it[u]];
					const v = to[id];
					if (cap[id] > 0 && level[v] === level[u] + 1) {
						path.push(v);
						const d = dfs(v, Math.min(f, cap[id]), path);
						if (d > 0) {
							cap[id] -= d;
							cap[id ^ 1] += d;
							return d;
						}
						path.pop();
					}
				}
				return 0;
			};
			const paths: Path[] = [];
			for (;;) {
				const path = [S];
				const f = dfs(S, Infinity, path);
				if (f <= 0) break;
				paths.push({ nodes: [...path], amt: f });
			}
			const pushed = paths.reduce((a, p) => a + p.amt, 0);
			const before = flow;
			flow += pushed;
			phases.push({
				level, lay, paths, pushed, flowBefore: before, flowAfter: flow, dt: level[T]
			});
		}
		return { phases, maxflow: flow };
	}

	const { phases, maxflow } = computePhases();

	// Разворачиваем фазы в плоский список шагов:
	//  - kind 'bfs' — построена слоистая сеть G_L (показаны уровни и G_L)
	//  - kind 'path' — протолкнут один путь блокирующего потока
	//  - kind 'done' — финал
	type Step =
		| { kind: 'start' }
		| { kind: 'bfs'; phase: number }
		| { kind: 'path'; phase: number; pi: number }
		| { kind: 'done' };

	const steps: Step[] = (() => {
		const out: Step[] = [{ kind: 'start' }];
		phases.forEach((ph, pi) => {
			out.push({ kind: 'bfs', phase: pi });
			ph.paths.forEach((_, j) => out.push({ kind: 'path', phase: pi, pi: j }));
		});
		out.push({ kind: 'done' });
		return out;
	})();

	let idx = $state(0);
	let playing = $state(false);
	const step = $derived(steps[Math.min(idx, steps.length - 1)]);

	// Текущая фаза для отрисовки слоёв/G_L (последняя достигнутая).
	const activePhase = $derived.by(() => {
		const s = step;
		if (s.kind === 'bfs' || s.kind === 'path') return s.phase;
		if (s.kind === 'done') return phases.length - 1;
		return -1; // start
	});

	// |f| — текущее значение потока, нарастает по мере проталкивания путей.
	const flowNow = $derived.by(() => {
		const s = step;
		if (s.kind === 'start') return 0;
		if (s.kind === 'done') return maxflow;
		const ph = phases[s.phase];
		if (s.kind === 'bfs') return ph.flowBefore;
		// path: добавляем все протолкнутые пути включая текущий
		let f = ph.flowBefore;
		for (let j = 0; j <= s.pi; j++) f += ph.paths[j].amt;
		return f;
	});

	// d[t] текущей фазы (или «—» до первого BFS).
	const dtNow = $derived.by(() => {
		if (activePhase < 0) return null;
		return phases[activePhase].dt;
	});

	// Уровни вершин для подсветки слоёв.
	const levels = $derived.by(() => {
		if (activePhase < 0) return null;
		return phases[activePhase].level;
	});
	const maxLevel = $derived(levels ? Math.max(...levels.filter((l) => l >= 0)) : 0);

	// Рёбра слоистой сети текущей фазы (множество индексов).
	const laySet = $derived.by(() => {
		if (activePhase < 0) return new Set<number>();
		return new Set(phases[activePhase].lay);
	});

	// Подсвеченный путь (на шаге 'path') как множество направленных рёбер.
	const pathEdges = $derived.by(() => {
		const s = step;
		if (s.kind !== 'path') return null;
		const nodes = phases[s.phase].paths[s.pi].nodes;
		const set = new Set<string>();
		for (let i = 0; i + 1 < nodes.length; i++) set.add(nodes[i] + '>' + nodes[i + 1]);
		return { set, amt: phases[s.phase].paths[s.pi].amt };
	});

	function edgeOnPath(u: number, v: number): boolean {
		return pathEdges ? pathEdges.set.has(u + '>' + v) : false;
	}

	// Геометрия: укорачиваем отрезок до радиуса кружка, чтобы стрелка села на край.
	const R = 18;
	function seg(u: number, v: number) {
		const [px, py] = POS[u];
		const [qx, qy] = POS[v];
		const dx = qx - px;
		const dy = qy - py;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len;
		const uy = dy / len;
		return { x1: px + ux * R, y1: py + uy * R, x2: qx - ux * R, y2: qy - uy * R };
	}
	function mid(u: number, v: number) {
		const [px, py] = POS[u];
		const [qx, qy] = POS[v];
		return { x: (px + qx) / 2, y: (py + qy) / 2 };
	}

	// Описание текущего шага по-русски.
	const note = $derived.by(() => {
		const s = step;
		if (s.kind === 'start')
			return 'Сеть с источником s и стоком t. Нажмите ▶▶, чтобы запустить фазы Диница.';
		if (s.kind === 'bfs') {
			const ph = phases[s.phase];
			return `Фаза ${s.phase + 1}: BFS построил слоистую сеть G_L. Уровни d[·] отмечены столбцами, в G_L оставлены только рёбра d→d+1. Длина пути до t: d[t] = ${ph.dt}.`;
		}
		if (s.kind === 'path') {
			const ph = phases[s.phase];
			const p = ph.paths[s.pi];
			const route = p.nodes.map((n) => LBL[n]).join('→');
			return `Фаза ${s.phase + 1}, блокирующий поток: путь ${route} длины ${ph.dt}, проталкиваем ${p.amt}. |f| = ${flowNow}.`;
		}
		return `Готово. Слоистая сеть для t больше не строится — стока не достичь. Максимальный поток |f| = ${maxflow}.`;
	});

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
		}, 1100);
	}
	function reset() {
		stop();
		idx = 0;
	}

	function levelColor(l: number): string {
		// Полоса уровня: чем глубже, тем насыщеннее (через прозрачность blue-pale).
		if (l < 0) return 'transparent';
		return 'var(--blue-pale)';
	}
	function nodeLevel(id: number): number {
		return levels ? levels[id] : -1;
	}
</script>

<div class="dn">
	<div class="dn__bar">
		<div class="title">Алгоритм Диница · слоистая сеть</div>
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

	<div class="dn__body">
		<svg viewBox="0 0 420 290" class="dn__svg">
			<defs>
				<marker id="dn-arr" markerWidth="8" markerHeight="8" refX="6.6" refY="3" orient="auto">
					<path d="M0,0 L6.6,3 L0,6 z" fill="var(--color-ink-500)" />
				</marker>
				<marker id="dn-arr-l" markerWidth="8" markerHeight="8" refX="6.6" refY="3" orient="auto">
					<path d="M0,0 L6.6,3 L0,6 z" fill="var(--blue)" />
				</marker>
				<marker id="dn-arr-p" markerWidth="8" markerHeight="8" refX="6.6" refY="3" orient="auto">
					<path d="M0,0 L6.6,3 L0,6 z" fill="var(--color-parch-100)" />
				</marker>
			</defs>

			<!-- Полосы слоёв по уровням d[·] текущей фазы -->
			{#if levels}
				{#each Array(maxLevel + 1) as _, l}
					{@const xs = POS.filter((_, id) => levels![id] === l).map((p) => p[0])}
					{#if xs.length}
						{@const cx = xs.reduce((a, b) => a + b, 0) / xs.length}
						<rect class="layer" x={cx - 30} y="14" width="60" height="262" rx="8"
							style="fill: {levelColor(l)}" />
						<text class="layer-lbl" x={cx} y="28">d={l}</text>
					{/if}
				{/each}
			{/if}

			<!-- Рёбра -->
			{#each EDGES as e, k}
				{@const s = seg(e.u, e.v)}
				{@const inLay = laySet.has(k)}
				{@const onPath = edgeOnPath(e.u, e.v)}
				<line
					x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
					class="edge" class:lay={inLay && !onPath} class:path={onPath} class:dim={!inLay && !onPath}
					marker-end={onPath ? 'url(#dn-arr-p)' : inLay ? 'url(#dn-arr-l)' : 'url(#dn-arr)'}
				/>
				{@const m = mid(e.u, e.v)}
				<g class="cap" class:on={inLay || onPath}>
					<rect x={m.x - 8} y={m.y - 8} width="16" height="15" rx="3.5" />
					<text x={m.x} y={m.y} dy="0.34em">{e.cap}</text>
				</g>
			{/each}

			<!-- Вершины -->
			{#each POS as p, id}
				{@const lv = nodeLevel(id)}
				<g class="node" class:src={id === S} class:snk={id === T} class:lv={lv >= 0}>
					<circle cx={p[0]} cy={p[1]} r={R} />
					<text x={p[0]} y={p[1]} dy="0.34em">{LBL[id]}</text>
					{#if lv >= 0}
						<text class="dnum" x={p[0]} y={p[1] - R - 4}>{lv}</text>
					{/if}
				</g>
			{/each}
		</svg>

		<div class="dn__panel">
			<div class="stats">
				<div class="stat">
					<span>фаза</span>
					<b>{activePhase < 0 ? '—' : activePhase + 1} / {phases.length}</b>
				</div>
				<div class="stat hi">
					<span>величина потока |f|</span>
					<b>{flowNow}<i> / {maxflow}</i></b>
				</div>
				<div class="stat hi">
					<span>расстояние d[t]</span>
					<b>{dtNow === null ? '—' : dtNow}</b>
				</div>
			</div>

			<div class="flowbar">
				<div class="track"><i style="width: {(flowNow / maxflow) * 100}%"></i></div>
			</div>

			<div class="legend">
				<span><i class="sw lay"></i> ребро G_L (d→d+1)</span>
				<span><i class="sw path"></i> путь блок. потока</span>
				<span><i class="sw dim"></i> вне слоистой сети</span>
			</div>

			<div class="phases">
				{#each phases as ph, pi}
					<div class="prow" class:active={activePhase === pi}>
						<span class="pname">Фаза {pi + 1}</span>
						<span class="pdt">d[t]={ph.dt}</span>
						<span class="ppush">+{ph.pushed} → |f|={ph.flowAfter}</span>
					</div>
				{/each}
			</div>

			<div class="note">{note}</div>
		</div>
	</div>
</div>

<style>
	.dn {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.dn__bar {
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
		font-size: 0.85rem;
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
	.dn__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.dn__svg {
		flex: 1 1 360px;
		min-width: 300px;
		max-width: 500px;
		height: auto;
	}

	.layer {
		opacity: 0.5;
		transition: fill 0.3s;
	}
	.layer-lbl {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--blue);
		font-weight: 700;
		opacity: 0.85;
	}

	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.25s, stroke-width 0.25s, opacity 0.25s;
	}
	.edge.dim {
		opacity: 0.32;
	}
	.edge.lay {
		stroke: var(--blue);
		stroke-width: 3;
	}
	.edge.path {
		stroke: var(--color-parch-100);
		stroke-width: 4.5;
	}

	.cap rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1;
		opacity: 0.55;
		transition: opacity 0.25s;
	}
	.cap text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
		font-weight: 700;
	}
	.cap.on rect {
		opacity: 1;
	}
	.cap.on text {
		fill: var(--blue);
	}

	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node.lv circle {
		stroke: var(--blue);
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.95rem;
		fill: var(--color-parch-100);
	}
	.node.src circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
	}
	.node.snk circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
	}
	.node.src text,
	.node.snk text {
		fill: #fff;
	}
	.node .dnum {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		fill: var(--blue);
	}

	.dn__panel {
		flex: 1 1 240px;
		min-width: 220px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.stats {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.stat {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.2rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.stat span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.stat b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-parch-100);
	}
	.stat b i {
		font-style: normal;
		font-weight: 600;
		font-size: 0.75rem;
		color: var(--color-parch-muted);
	}
	.stat.hi b {
		color: var(--blue);
	}

	.flowbar .track {
		height: 0.55rem;
		background: var(--color-ink-700);
		border-radius: 5px;
		overflow: hidden;
	}
	.flowbar .track i {
		display: block;
		height: 100%;
		background: var(--blue);
		transition: width 0.35s ease;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}
	.sw {
		width: 0.9rem;
		height: 0.2rem;
		border-radius: 2px;
		display: inline-block;
	}
	.sw.lay {
		background: var(--blue);
	}
	.sw.path {
		background: var(--color-parch-100);
		height: 0.28rem;
	}
	.sw.dim {
		background: var(--color-ink-500);
		opacity: 0.5;
	}

	.phases {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.prow {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		font-size: 0.7rem;
		padding: 0.3rem 0.5rem;
		border-radius: 6px;
		border: 1px solid transparent;
		color: var(--color-parch-200);
	}
	.prow.active {
		border-color: var(--blue);
		background: var(--blue-pale);
	}
	.prow .pname {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-parch-100);
		flex: none;
	}
	.prow .pdt {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--blue);
	}
	.prow .ppush {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
		margin-left: auto;
	}

	.note {
		margin-top: auto;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
</style>
