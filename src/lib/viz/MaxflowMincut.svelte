<script lang="ts">
	// Теорема о максимальном потоке и минимальном разрезе.
	// Сеть несёт поток f/c. Алгоритм: дополняем поток (BFS в остаточной сети —
	// Эдмондс-Карп) до максимума, затем извлекаем разрез: S = вершины, достижимые
	// из s в ОСТАТОЧНОЙ сети, T = остальные. Подсвечиваем рёбра S→T и считаем
	// c(S,T). При максимальном потоке все рёбра разреза насыщены и c(S,T)=|f|.
	// Чистый инлайн-SVG, без внешних зависимостей.
	type Pt = { x: number; y: number; label: string };
	type Edge = { u: number; v: number; cap: number };

	// сеть: 6 вершин, s=0 … t=5
	const nodes: Pt[] = [
		{ x: 45, y: 145, label: 's' },
		{ x: 150, y: 58, label: 'a' },
		{ x: 150, y: 232, label: 'b' },
		{ x: 290, y: 58, label: 'c' },
		{ x: 290, y: 232, label: 'd' },
		{ x: 395, y: 145, label: 't' }
	];
	const S_NODE = 0;
	const T_NODE = 5;
	const edges: Edge[] = [
		{ u: 0, v: 1, cap: 12 }, // s→a
		{ u: 0, v: 2, cap: 9 }, // s→b
		{ u: 1, v: 3, cap: 8 }, // a→c
		{ u: 1, v: 2, cap: 3 }, // a→b
		{ u: 2, v: 4, cap: 11 }, // b→d
		{ u: 3, v: 5, cap: 7 }, // c→t
		{ u: 3, v: 4, cap: 4 }, // c→d
		{ u: 4, v: 5, cap: 10 } // d→t
	];

	const R = 18;

	// Остаточные ёмкости при текущем потоке.
	const resFwd = (flow: number[], e: number) => edges[e].cap - flow[e];
	const resBwd = (flow: number[], e: number) => flow[e];

	// Поиск дополняющего пути по остаточной сети (BFS, как в Эдмондсе-Карпе).
	function findPath(flow: number[]): { idx: number; dir: 1 | -1 }[] | null {
		const prev: { node: number; edge: { idx: number; dir: 1 | -1 } }[] = [];
		const visited = new Array(nodes.length).fill(false);
		const queue: number[] = [S_NODE];
		visited[S_NODE] = true;
		while (queue.length) {
			const u = queue.shift()!;
			if (u === T_NODE) break;
			for (let e = 0; e < edges.length; e++) {
				if (edges[e].u === u && !visited[edges[e].v] && resFwd(flow, e) > 0) {
					visited[edges[e].v] = true;
					prev[edges[e].v] = { node: u, edge: { idx: e, dir: 1 } };
					queue.push(edges[e].v);
				}
				if (edges[e].v === u && !visited[edges[e].u] && resBwd(flow, e) > 0) {
					visited[edges[e].u] = true;
					prev[edges[e].u] = { node: u, edge: { idx: e, dir: -1 } };
					queue.push(edges[e].u);
				}
			}
		}
		if (!visited[T_NODE]) return null;
		const out: { idx: number; dir: 1 | -1 }[] = [];
		let cur = T_NODE;
		while (cur !== S_NODE) {
			const p = prev[cur];
			out.unshift(p.edge);
			cur = p.node;
		}
		return out;
	}

	// Один шаг дополнения: ищем путь, проталкиваем bottleneck, возвращаем новый поток.
	function augmentOnce(flow: number[]): { flow: number[]; pushed: number } | null {
		const path = findPath(flow);
		if (!path) return null;
		let bottleneck = Infinity;
		for (const p of path) {
			const r = p.dir === 1 ? resFwd(flow, p.idx) : resBwd(flow, p.idx);
			if (r < bottleneck) bottleneck = r;
		}
		const next = [...flow];
		for (const p of path) {
			if (p.dir === 1) next[p.idx] += bottleneck;
			else next[p.idx] -= bottleneck;
		}
		return { flow: next, pushed: bottleneck };
	}

	// Полный прогон: список состояний потока от нулевого до максимального.
	function buildFlowStages(): { flow: number[]; value: number; pushed: number }[] {
		const zero = edges.map(() => 0);
		const stages: { flow: number[]; value: number; pushed: number }[] = [
			{ flow: zero, value: 0, pushed: 0 }
		];
		let flow = zero;
		// |f| = суммарный исходящий поток из истока
		const valueOf = (f: number[]) =>
			edges.reduce((s, e, i) => (e.u === S_NODE ? s + f[i] : s), 0);
		let guard = 0;
		while (guard++ < 50) {
			const r = augmentOnce(flow);
			if (!r) break;
			flow = r.flow;
			stages.push({ flow, value: valueOf(flow), pushed: r.pushed });
		}
		return stages;
	}

	const stages = buildFlowStages();
	const maxValue = stages[stages.length - 1].value;

	// Достижимость из s в остаточной сети при данном потоке → множество S.
	function reachableFromS(flow: number[]): boolean[] {
		const visited = new Array(nodes.length).fill(false);
		const queue: number[] = [S_NODE];
		visited[S_NODE] = true;
		while (queue.length) {
			const u = queue.shift()!;
			for (let e = 0; e < edges.length; e++) {
				if (edges[e].u === u && !visited[edges[e].v] && resFwd(flow, e) > 0) {
					visited[edges[e].v] = true;
					queue.push(edges[e].v);
				}
				if (edges[e].v === u && !visited[edges[e].u] && resBwd(flow, e) > 0) {
					visited[edges[e].u] = true;
					queue.push(edges[e].u);
				}
			}
		}
		return visited;
	}

	// ---- состояние UI ----
	let stageIdx = $state(0); // какой уровень потока показываем
	let playing = $state(false);
	let showCut = $state(false); // показывать разбиение S/T и разрез
	let bfsStep = $state(0); // сколько вершин S «извлечено» при пошаговом показе S

	const stage = $derived(stages[Math.min(stageIdx, stages.length - 1)]);
	const flow = $derived(stage.flow);
	const value = $derived(stage.value);
	const atMax = $derived(stageIdx >= stages.length - 1);

	// S-достижимость для текущего потока.
	const inS = $derived(reachableFromS(flow));
	// порядок попадания вершин в S — для пошагового «извлечения»
	const sOrder = $derived(
		(() => {
			const order: number[] = [];
			const visited = new Array(nodes.length).fill(false);
			const queue: number[] = [S_NODE];
			visited[S_NODE] = true;
			while (queue.length) {
				const u = queue.shift()!;
				order.push(u);
				for (let e = 0; e < edges.length; e++) {
					if (edges[e].u === u && !visited[edges[e].v] && resFwd(flow, e) > 0) {
						visited[edges[e].v] = true;
						queue.push(edges[e].v);
					}
					if (edges[e].v === u && !visited[edges[e].u] && resBwd(flow, e) > 0) {
						visited[edges[e].u] = true;
						queue.push(edges[e].u);
					}
				}
			}
			return order;
		})()
	);
	// сколько вершин S уже «извлечено» (для подсветки шага). null = все.
	const revealedCount = $derived(showCut ? bfsStep : sOrder.length);
	const revealedS = $derived(new Set(sOrder.slice(0, revealedCount)));
	const cutDone = $derived(revealedCount >= sOrder.length);

	// рёбра разреза: u∈S, v∈T (только после полного извлечения S имеет смысл)
	const cutEdges = $derived(
		edges
			.map((e, i) => ({ e, i }))
			.filter(({ e }) => inS[e.u] && !inS[e.v])
	);
	const cutCapacity = $derived(cutEdges.reduce((s, { e }) => s + e.cap, 0));
	// обратные рёбра разреза (v∈S, u∈T) — их поток равен 0 при оптимуме
	const backEdges = $derived(
		edges.map((e, i) => ({ e, i })).filter(({ e }) => !inS[e.u] && inS[e.v])
	);

	// положение вершины на грани окружности — чтобы стрелка садилась на ободок
	function seg(e: Edge) {
		const p = nodes[e.u],
			q = nodes[e.v];
		const dx = q.x - p.x,
			dy = q.y - p.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len,
			uy = dy / len;
		return { x1: p.x + ux * R, y1: p.y + uy * R, x2: q.x - ux * R, y2: q.y - uy * R };
	}
	function mid(e: Edge) {
		const s = seg(e);
		return { x: (s.x1 + s.x2) / 2, y: (s.y1 + s.y2) / 2 };
	}
	// смещение подписи f/c в сторону от линии, чтобы не наезжала
	function labelPos(e: Edge) {
		const s = seg(e);
		const m = mid(e);
		const nx = -(s.y2 - s.y1),
			ny = s.x2 - s.x1;
		const nl = Math.hypot(nx, ny) || 1;
		return { x: m.x + (nx / nl) * 13, y: m.y + (ny / nl) * 13 };
	}

	function edgeClass(i: number): string {
		const e = edges[i];
		const saturated = flow[i] >= e.cap;
		if (showCut && cutDone && inS[e.u] && !inS[e.v]) return 'edge cut';
		if (showCut && cutDone && !inS[e.u] && inS[e.v]) return 'edge back';
		if (flow[i] > 0) return saturated ? 'edge full' : 'edge used';
		return 'edge';
	}

	function nodeSide(id: number): 'S' | 'T' | 'idle' {
		if (!showCut) return 'idle';
		if (revealedS.has(id)) return 'S';
		if (cutDone) return inS[id] ? 'S' : 'T';
		return 'idle';
	}

	// ---- контролы ----
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (stageIdx >= stages.length - 1) {
				stop();
				return;
			}
			stageIdx += 1;
		}, 850);
	}
	function reset() {
		stop();
		stageIdx = 0;
		showCut = false;
		bfsStep = 0;
	}
	function toMax() {
		stop();
		stageIdx = stages.length - 1;
	}
	function stepFlow(d: number) {
		stop();
		stageIdx = Math.max(0, Math.min(stages.length - 1, stageIdx + d));
		// при смене потока сбрасываем пошаговое извлечение S
		bfsStep = 0;
	}
	function toggleCut() {
		if (showCut) {
			showCut = false;
		} else {
			showCut = true;
			bfsStep = 0;
		}
	}
	function stepS() {
		if (!showCut) {
			showCut = true;
			bfsStep = 0;
		}
		if (bfsStep < sOrder.length) bfsStep += 1;
	}
	function revealAllS() {
		showCut = true;
		bfsStep = sOrder.length;
	}

	const note = $derived(
		(() => {
			if (!showCut) {
				if (stageIdx === 0)
					return 'Нулевой поток. Жми «дополнить» — алгоритм ищет путь в остаточной сети и проталкивает поток.';
				if (atMax)
					return `Максимальный поток |f| = ${maxValue}: дополняющих путей в остаточной сети больше нет. Теперь извлеки разрез.`;
				return `Поток |f| = ${value}. Можно дополнять дальше — путь s→t в остаточной сети ещё есть.`;
			}
			if (!cutDone)
				return `Извлекаем S: вершины, достижимые из s в остаточной сети (BFS). Извлечено ${revealedCount} из ${sOrder.length}.`;
			if (atMax)
				return `Разрез (S,T): c(S,T) = ${cutCapacity} = |f| = ${maxValue}. Все рёбра S→T насыщены, обратные несут 0 — это минимальный разрез.`;
			return `Разрез (S,T) при |f| = ${value}: c(S,T) = ${cutCapacity} > |f|. Пока поток не максимален, разрез не минимален.`;
		})()
	);
</script>

<div class="mf">
	<div class="mf__bar">
		<div class="grp">
			<button class="prim" onclick={toMax} disabled={atMax}>достроить до максимума</button>
			<button
				class="prim alt"
				class:on={showCut}
				onclick={toggleCut}
				disabled={!atMax && !showCut && stageIdx === 0}
				title="разбить вершины на S и T">{showCut ? 'скрыть разрез' : 'показать разрез'}</button
			>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => stepFlow(-1)} title="убрать дополнение">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="дополнять автоматически">▶</button>
			{/if}
			<button onclick={() => stepFlow(1)} title="дополнить поток">▶▶</button>
			<span class="cnt">{stageIdx}/{stages.length - 1}</span>
		</div>
	</div>

	<div class="mf__body">
		<svg viewBox="0 0 440 290" class="mf__svg">
			<defs>
				<marker
					id="mf-arr"
					markerWidth="9"
					markerHeight="9"
					refX="7.5"
					refY="3"
					orient="auto-start-reverse"
				>
					<path d="M0,0 L7.5,3 L0,6 z" fill="currentColor" />
				</marker>
			</defs>

			<!-- линия разреза (декоративная разделяющая кривая) -->
			{#if showCut && cutDone}
				<path class="cutline" d="M 110 0 C 150 90, 150 200, 220 290" fill="none" />
			{/if}

			{#each edges as e, i}
				{@const s = seg(e)}
				<g class={edgeClass(i)}>
					<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} marker-end="url(#mf-arr)" />
				</g>
			{/each}

			<!-- подписи f/c поверх линий -->
			{#each edges as e, i}
				{@const lp = labelPos(e)}
				<g class="flbl" class:cut={showCut && cutDone && inS[e.u] && !inS[e.v]}>
					<rect x={lp.x - 15} y={lp.y - 8} width="30" height="15" rx="4" />
					<text x={lp.x} y={lp.y} dy="0.32em">{flow[i]}/{e.cap}</text>
				</g>
			{/each}

			{#each nodes as n, i}
				<g class="node {nodeSide(i)}" style="transform: translate({n.x}px, {n.y}px)">
					<circle r={R} />
					<text dy="0.34em">{n.label}</text>
				</g>
			{/each}
		</svg>

		<div class="mf__panel">
			<div class="val">
				<div class="val__row">
					<span class="lbl">величина потока |f|</span>
					<b class="big" class:max={atMax}>{value}</b>
				</div>
				{#if showCut && cutDone}
					<div class="val__row">
						<span class="lbl">пропускная способность c(S,T)</span>
						<b class="big cutc" class:eq={atMax}>{cutCapacity}</b>
					</div>
					<div class="eqbar" class:ok={atMax}>
						{#if atMax}
							|f| = c(S,T) = {maxValue} · теорема max-flow / min-cut
						{:else}
							|f| = {value} &lt; c(S,T) = {cutCapacity}
						{/if}
					</div>
				{/if}
			</div>

			{#if showCut}
				<div class="sets">
					<div class="setrow">
						<span class="tag s">S</span>
						<div class="chips">
							{#each sOrder.slice(0, revealedCount) as id}
								<span class="chip s">{nodes[id].label}</span>
							{:else}
								<span class="empty">—</span>
							{/each}
						</div>
					</div>
					<div class="setrow">
						<span class="tag t">T</span>
						<div class="chips">
							{#if cutDone}
								{#each nodes as n, i}
									{#if !inS[i]}<span class="chip t">{n.label}</span>{/if}
								{/each}
							{:else}
								<span class="empty">…</span>
							{/if}
						</div>
					</div>
					<div class="sbtns">
						<button onclick={stepS} disabled={cutDone}>шаг S ▸</button>
						<button onclick={revealAllS} disabled={cutDone}>извлечь всё</button>
					</div>
				</div>

				{#if cutDone && cutEdges.length}
					<div class="cutlist">
						<span class="lbl">рёбра разреза S→T (насыщены при max):</span>
						<div class="chips">
							{#each cutEdges as { e, i }}
								<span class="chip cut" class:sat={flow[i] >= e.cap}>
									{nodes[e.u].label}→{nodes[e.v].label} {flow[i]}/{e.cap}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			{/if}

			<div class="note">{note}</div>
		</div>
	</div>
</div>

<style>
	.mf {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.mf__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.grp {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}
	.prim {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.76rem;
		padding: 0.4rem 0.7rem;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		background: var(--blue);
		color: #fff;
		cursor: pointer;
		transition: all 0.15s;
	}
	.prim.alt {
		background: transparent;
		color: var(--blue);
	}
	.prim.alt.on {
		background: var(--blue);
		color: #fff;
	}
	.prim:disabled {
		opacity: 0.4;
		cursor: default;
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
	.mf__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.mf__svg {
		flex: 1 1 340px;
		min-width: 300px;
		max-width: 480px;
		height: auto;
	}

	/* рёбра по состоянию потока */
	.edge {
		color: var(--color-ink-500);
	}
	.edge line {
		stroke: currentColor;
		stroke-width: 2.5;
		transition: stroke-width 0.2s;
	}
	.edge.used {
		color: var(--blue);
	}
	.edge.full {
		color: var(--blue);
	}
	.edge.full line {
		stroke-width: 3.5;
	}
	.edge.cut {
		color: var(--color-gold-500, #d99a2b);
	}
	.edge.cut line {
		stroke-width: 4;
	}
	.edge.back {
		color: var(--color-ink-500);
		stroke-dasharray: 5 4;
	}
	.edge.back line {
		stroke-dasharray: 5 4;
	}

	.cutline {
		stroke: var(--color-gold-500, #d99a2b);
		stroke-width: 1.5;
		stroke-dasharray: 4 5;
		opacity: 0.7;
	}

	/* подписи f/c */
	.flbl rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1;
	}
	.flbl text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		fill: var(--color-parch-100);
	}
	.flbl.cut rect {
		fill: var(--color-gold-500, #d99a2b);
		stroke: var(--color-gold-500, #d99a2b);
	}
	.flbl.cut text {
		fill: var(--color-ink-850);
	}

	/* вершины */
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
	.node.S circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
	}
	.node.S text {
		fill: #fff;
	}
	.node.T circle {
		fill: var(--color-ink-700, var(--color-ink-800));
		stroke: var(--color-gold-500, #d99a2b);
	}
	.node.T text {
		fill: var(--color-gold-500, #d99a2b);
	}

	.mf__panel {
		flex: 1 1 240px;
		min-width: 220px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.val {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.val__row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.big {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.5rem;
		color: var(--color-parch-100);
		line-height: 1;
	}
	.big.max {
		color: var(--blue);
	}
	.big.cutc {
		color: var(--color-gold-500, #d99a2b);
	}
	.eqbar {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-200);
		padding: 0.4rem 0.55rem;
		border-radius: 7px;
		background: var(--color-ink-800);
		border: 1px dashed var(--color-ink-500);
	}
	.eqbar.ok {
		color: var(--blue);
		border-color: var(--blue);
		font-weight: 700;
	}
	.sets {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.55rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 8px;
	}
	.setrow {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.tag {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 6px;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.78rem;
		flex: none;
	}
	.tag.s {
		background: var(--blue);
		color: #fff;
	}
	.tag.t {
		background: transparent;
		color: var(--color-gold-500, #d99a2b);
		border: 1.5px solid var(--color-gold-500, #d99a2b);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.28rem;
		min-height: 1.5rem;
		align-items: center;
	}
	.chip {
		display: grid;
		place-items: center;
		min-width: 1.5rem;
		height: 1.5rem;
		padding: 0 0.4rem;
		border-radius: 6px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
	}
	.chip.s {
		background: var(--blue);
		color: #fff;
	}
	.chip.t {
		background: transparent;
		color: var(--color-gold-500, #d99a2b);
		border: 1.5px solid var(--color-gold-500, #d99a2b);
	}
	.chip.cut {
		background: var(--color-ink-850);
		color: var(--color-parch-200);
		border: 1.5px solid var(--color-ink-500);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
	}
	.chip.cut.sat {
		border-color: var(--color-gold-500, #d99a2b);
		color: var(--color-gold-500, #d99a2b);
	}
	.empty {
		color: var(--color-parch-muted);
	}
	.sbtns {
		display: flex;
		gap: 0.35rem;
		margin-top: 0.1rem;
	}
	.sbtns button {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		padding: 0.25rem 0.5rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 6px;
		background: var(--color-ink-850);
		color: var(--color-parch-200);
		cursor: pointer;
	}
	.sbtns button:hover:not(:disabled) {
		border-color: var(--blue);
		color: var(--blue);
	}
	.sbtns button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.cutlist {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
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
