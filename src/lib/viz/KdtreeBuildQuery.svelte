<script lang="ts">
	// 2D k-d дерево: построение (медианное деление по чередующимся осям) и
	// запрос ближайшего соседа (NN) с круговой границей r и отсечением ветвей
	// по правилу |q_axis − s| > r. Точку q можно задать кликом по полю.
	// Чистый инлайн-SVG, без зависимостей; язык как у GraphTraversal.
	type Pt = { x: number; y: number; id: number };
	// узел дерева: индекс точки, ось деления (0=x,1=y), потомки, глубина,
	// и прямоугольник области, которую этот узел делит — для рисования линии.
	type KNode = {
		pt: number;
		axis: 0 | 1;
		left: number | null;
		right: number | null;
		depth: number;
		x0: number; y0: number; x1: number; y1: number; // регион в координатах поля
		tx: number; ty: number; // позиция в схеме дерева сбоку
	};

	// поле 0..100 в обеих осях; точки фиксированы (демо-данные)
	const PTS: Pt[] = [
		{ id: 0, x: 30, y: 40 },
		{ id: 1, x: 12, y: 70 },
		{ id: 2, x: 55, y: 18 },
		{ id: 3, x: 70, y: 62 },
		{ id: 4, x: 88, y: 35 },
		{ id: 5, x: 42, y: 88 },
		{ id: 6, x: 78, y: 90 },
	];
	const N = PTS.length;

	// --- построение дерева: плоский список узлов + порядок постройки.
	// Заполняются один раз при инициализации (push), затем неизменны.
	type BuildStep = { node: number; note: string };
	const kdNodes: KNode[] = [];
	const buildOrder: BuildStep[] = [];

	function buildTree(): void {
		const axisName = (a: 0 | 1) => (a === 0 ? 'X' : 'Y');

		function rec(
			ids: number[], depth: number,
			x0: number, y0: number, x1: number, y1: number,
			tx: number, ty: number, tw: number
		): number | null {
			if (ids.length === 0) return null;
			const axis: 0 | 1 = (depth % 2) as 0 | 1;
			// сортируем по текущей оси и берём медиану
			const sorted = [...ids].sort((a, b) =>
				axis === 0 ? PTS[a].x - PTS[b].x : PTS[a].y - PTS[b].y
			);
			const mid = Math.floor(sorted.length / 2);
			const pivot = sorted[mid];
			const leftIds = sorted.slice(0, mid);
			const rightIds = sorted.slice(mid + 1);

			const nodeIdx = kdNodes.length;
			const sVal = axis === 0 ? PTS[pivot].x : PTS[pivot].y;
			kdNodes.push({
				pt: pivot, axis, left: null, right: null, depth,
				x0, y0, x1, y1, tx, ty,
			});
			buildOrder.push({
				node: nodeIdx,
				note: `глубина ${depth}: делим по ${axisName(axis)}, медиана = точка P${pivot} (${axisName(axis)}=${sVal})`,
			});

			// дочерние регионы получаются разрезом текущего региона по оси
			const childTy = ty + 60;
			const childTw = tw / 2;
			const lTx = tx - tw / 2;
			const rTx = tx + tw / 2;
			if (axis === 0) {
				const li = rec(leftIds, depth + 1, x0, y0, sVal, y1, lTx, childTy, childTw);
				const ri = rec(rightIds, depth + 1, sVal, y0, x1, y1, rTx, childTy, childTw);
				kdNodes[nodeIdx].left = li;
				kdNodes[nodeIdx].right = ri;
			} else {
				const li = rec(leftIds, depth + 1, x0, y0, x1, sVal, lTx, childTy, childTw);
				const ri = rec(rightIds, depth + 1, x0, sVal, x1, y1, rTx, childTy, childTw);
				kdNodes[nodeIdx].left = li;
				kdNodes[nodeIdx].right = ri;
			}
			return nodeIdx;
		}

		rec(
			PTS.map((p) => p.id), 0,
			0, 0, 100, 100,
			320, 30, 140
		);
	}
	buildTree();
	buildOrder.push({ node: -1, note: 'дерево построено' });

	// --- запрос NN: пошаговый обход с границей r и отсечением
	type QStep = {
		node: number; // текущий узел дерева
		visited: number[]; // индексы посещённых узлов дерева (по pt)
		pruned: number[]; // индексы поддеревьев, отсечённых (корни поддеревьев)
		best: number | null; // лучшая точка (id)
		r: number; // текущий лучший радиус (в координатах поля)
		note: string;
	};

	function dist(aId: number, qx: number, qy: number): number {
		const dx = PTS[aId].x - qx;
		const dy = PTS[aId].y - qy;
		return Math.hypot(dx, dy);
	}

	function buildQuery(qx: number, qy: number): QStep[] {
		const steps: QStep[] = [];
		const visited: number[] = [];
		const pruned: number[] = [];
		let best: number | null = null;
		let r = Infinity;
		const axisName = (a: 0 | 1) => (a === 0 ? 'X' : 'Y');

		function snap(node: number, note: string) {
			steps.push({
				node,
				visited: [...visited],
				pruned: [...pruned],
				best,
				r: r === Infinity ? 0 : r,
				note,
			});
		}

		function search(idx: number | null) {
			if (idx === null) return;
			const nd = kdNodes[idx];
			visited.push(idx);
			const d = dist(nd.pt, qx, qy);
			if (d < r) {
				r = d;
				best = nd.pt;
				snap(idx, `посещаем P${nd.pt}: расстояние ${d.toFixed(1)} < r ⇒ новый лучший, r=${r.toFixed(1)}`);
			} else {
				snap(idx, `посещаем P${nd.pt}: расстояние ${d.toFixed(1)} ≥ r=${r.toFixed(1)}, лучший не меняется`);
			}

			const qv = nd.axis === 0 ? qx : qy;
			const sVal = nd.axis === 0 ? PTS[nd.pt].x : PTS[nd.pt].y;
			const goLeft = qv < sVal;
			const near = goLeft ? nd.left : nd.right;
			const far = goLeft ? nd.right : nd.left;

			// спуск в «свою» (ближнюю) ветку
			search(near);

			// проверка отсечения второй ветки: |q_axis − s| > r ?
			const gap = Math.abs(qv - sVal);
			if (far !== null) {
				if (gap > r) {
					pruned.push(far);
					snap(idx, `граница по ${axisName(nd.axis)}: |${qv.toFixed(0)}−${sVal}| = ${gap.toFixed(1)} > r=${r.toFixed(1)} ⇒ дальнюю ветку отсекаем`);
				} else {
					snap(idx, `граница по ${axisName(nd.axis)}: |${qv.toFixed(0)}−${sVal}| = ${gap.toFixed(1)} ≤ r=${r.toFixed(1)} ⇒ нужно проверить дальнюю ветку`);
					search(far);
				}
			}
		}

		search(0);
		const visitedCount = new Set(visited).size;
		steps.push({
			node: -1, visited: [...visited], pruned: [...pruned], best, r,
			note: `готово: ближайшая — P${best}, посещено ${visitedCount} из ${N} узлов (наивный перебор смотрел бы все ${N})`,
		});
		return steps;
	}

	// --- состояние UI
	let phase = $state<'build' | 'query'>('build');
	let qx = $state(60);
	let qy = $state(50);
	let idx = $state(0);
	let playing = $state(false);

	const querySteps = $derived(buildQuery(qx, qy));
	const steps = $derived(phase === 'build' ? buildOrder : querySteps);
	const total = $derived(steps.length);
	const safeIdx = $derived(Math.min(idx, total - 1));

	// узлы дерева, уже размещённые к текущему шагу построения
	const placed = $derived.by(() => {
		if (phase !== 'build') return new Set(kdNodes.map((_, i) => i));
		const s = new Set<number>();
		for (let k = 0; k <= safeIdx; k++) {
			if (buildOrder[k].node >= 0) s.add(buildOrder[k].node);
		}
		return s;
	});

	const qcur = $derived.by((): QStep | null => {
		if (phase !== 'query') return null;
		return querySteps[safeIdx];
	});
	const visitedNodes = $derived(new Set(qcur ? qcur.visited : []));
	const prunedSet = $derived.by(() => {
		// собираем все индексы узлов отсечённых поддеревьев
		const out = new Set<number>();
		if (!qcur) return out;
		for (const root of qcur.pruned) collectSubtree(root, out);
		return out;
	});
	function collectSubtree(root: number, acc: Set<number>) {
		if (root < 0) return;
		acc.add(root);
		const nd = kdNodes[root];
		if (nd.left !== null) collectSubtree(nd.left, acc);
		if (nd.right !== null) collectSubtree(nd.right, acc);
	}

	const curNote = $derived(steps[safeIdx].note);
	const curNodeIdx = $derived(steps[safeIdx].node);

	// --- координатные преобразования: поле 0..100 → SVG-область
	const FX = 24, FY = 28, FW = 240, FH = 240; // прямоугольник поля в SVG
	const sx = (x: number) => FX + (x / 100) * FW;
	const sy = (y: number) => FY + (y / 100) * FH;
	const sr = (r: number) => (r / 100) * FW; // радиус в SVG-единицах (поле квадратное)

	// --- линии гиперплоскостей: для каждого размещённого узла — отрезок деления
	function splitLine(nd: KNode) {
		const s = nd.axis === 0 ? PTS[nd.pt].x : PTS[nd.pt].y;
		if (nd.axis === 0) {
			return { x1: sx(s), y1: sy(nd.y0), x2: sx(s), y2: sy(nd.y1) };
		}
		return { x1: sx(nd.x0), y1: sy(s), x2: sx(nd.x1), y2: sy(s) };
	}

	// --- рёбра схемы дерева
	type TEdge = { x1: number; y1: number; x2: number; y2: number; child: number };
	const treeEdges: TEdge[] = (() => {
		const out: TEdge[] = [];
		kdNodes.forEach((nd, i) => {
			for (const c of [nd.left, nd.right]) {
				if (c !== null) {
					out.push({ x1: nd.tx, y1: nd.ty, x2: kdNodes[c].tx, y2: kdNodes[c].ty, child: c });
				}
			}
		});
		return out;
	})();

	// --- контролы
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= total - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 850);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setPhase(p: 'build' | 'query') {
		phase = p;
		reset();
	}

	// клик по полю задаёт точку запроса
	function onFieldClick(ev: MouseEvent) {
		const svg = (ev.currentTarget as SVGElement).ownerSVGElement;
		if (!svg) return;
		const pt = svg.createSVGPoint();
		pt.x = ev.clientX;
		pt.y = ev.clientY;
		const ctm = svg.getScreenCTM();
		if (!ctm) return;
		const loc = pt.matrixTransform(ctm.inverse());
		const nx = ((loc.x - FX) / FW) * 100;
		const ny = ((loc.y - FY) / FH) * 100;
		qx = Math.max(0, Math.min(100, Math.round(nx)));
		qy = Math.max(0, Math.min(100, Math.round(ny)));
		if (phase === 'query') reset();
	}
	// клавиатура: стрелки сдвигают точку q (доступность)
	function onFieldKey(ev: KeyboardEvent) {
		const k = ev.key;
		if (k === 'ArrowLeft') qx = Math.max(0, qx - 2);
		else if (k === 'ArrowRight') qx = Math.min(100, qx + 2);
		else if (k === 'ArrowUp') qy = Math.max(0, qy - 2);
		else if (k === 'ArrowDown') qy = Math.min(100, qy + 2);
		else return;
		ev.preventDefault();
		if (phase === 'query') reset();
	}

	function nodeState(i: number): string {
		if (phase === 'build') {
			if (curNodeIdx === i) return 'current';
			return placed.has(i) ? 'placed' : 'idle';
		}
		// query
		if (qcur && qcur.node === i) return 'current';
		if (prunedSet.has(i)) return 'pruned';
		if (visitedNodes.has(i)) return 'visited';
		return 'idle';
	}
	function ptState(id: number): string {
		if (phase === 'query' && qcur && qcur.best === id) return 'best';
		const owner = kdNodes.findIndex((n) => n.pt === id);
		return nodeState(owner);
	}

	const visitedCount = $derived(qcur ? new Set(qcur.visited).size : 0);
</script>

<div class="kd">
	<div class="kd__bar">
		<div class="seg">
			<button class:on={phase === 'build'} onclick={() => setPhase('build')}>Построение</button>
			<button class:on={phase === 'query'} onclick={() => setPhase('query')}>Запрос NN</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, safeIdx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(total - 1, safeIdx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{safeIdx}/{total - 1}</span>
		</div>
	</div>

	<div class="kd__body">
		<svg viewBox="0 0 420 290" class="kd__svg">
			<!-- ПОЛЕ с точками -->
			<rect
				x={FX} y={FY} width={FW} height={FH}
				class="field" rx="4"
				role="button" tabindex="0"
				aria-label="поле для выбора точки запроса"
				onclick={onFieldClick}
				onkeydown={onFieldKey}
			/>

			<!-- линии деления (гиперплоскости) только для размещённых узлов -->
			{#each kdNodes as nd, i}
				{#if placed.has(i)}
					{@const l = splitLine(nd)}
					<line
						x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
						class="split"
						class:cur={phase === 'build' && curNodeIdx === i}
						class:dim={phase === 'query' && prunedSet.has(i)}
					/>
				{/if}
			{/each}

			<!-- круг текущего лучшего радиуса r (фаза запроса) -->
			{#if phase === 'query' && qcur && qcur.r > 0}
				<circle cx={sx(qx)} cy={sy(qy)} r={sr(qcur.r)} class="ball" />
			{/if}

			<!-- точки данных -->
			{#each PTS as p}
				<g class="pt {ptState(p.id)}">
					<circle cx={sx(p.x)} cy={sy(p.y)} r="6" />
					<text x={sx(p.x)} y={sy(p.y) - 10}>P{p.id}</text>
				</g>
			{/each}

			<!-- точка запроса q -->
			{#if phase === 'query'}
				<g class="qmark">
					<line x1={sx(qx) - 6} y1={sy(qy)} x2={sx(qx) + 6} y2={sy(qy)} />
					<line x1={sx(qx)} y1={sy(qy) - 6} x2={sx(qx)} y2={sy(qy) + 6} />
				</g>
			{/if}

			<!-- СХЕМА ДЕРЕВА сбоку -->
			{#each treeEdges as e}
				<line
					x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
					class="tedge"
					class:dim={phase === 'query' && prunedSet.has(e.child)}
				/>
			{/each}
			{#each kdNodes as nd, i}
				{#if placed.has(i)}
					<g class="tnode {nodeState(i)}">
						<circle cx={nd.tx} cy={nd.ty} r="11" />
						<text x={nd.tx} y={nd.ty} dy="0.34em">P{nd.pt}</text>
						<text x={nd.tx} y={nd.ty - 16} class="axislbl">{nd.axis === 0 ? 'X' : 'Y'}</text>
					</g>
				{/if}
			{/each}
		</svg>

		<div class="kd__panel">
			{#if phase === 'query'}
				<div class="stats">
					<div class="stat">
						<span class="lbl">Посещено узлов</span>
						<b>{visitedCount}</b>
					</div>
					<div class="stat">
						<span class="lbl">Наивный перебор</span>
						<b class="muted">{N}</b>
					</div>
					<div class="stat">
						<span class="lbl">Лучший r</span>
						<b>{qcur ? qcur.r.toFixed(1) : '—'}</b>
					</div>
					<div class="stat">
						<span class="lbl">Ближайший</span>
						<b>{qcur && qcur.best !== null ? 'P' + qcur.best : '—'}</b>
					</div>
				</div>
				<div class="hint">Клик по полю — задать точку q (сейчас {qx}, {qy}).</div>
			{:else}
				<div class="legend">
					<div class="lrow"><span class="sw cur"></span>текущий медианный узел</div>
					<div class="lrow"><span class="sw placed"></span>уже в дереве</div>
					<div class="lrow"><span class="sline"></span>гиперплоскость деления</div>
				</div>
				<div class="hint">Чередуем оси: глубина чётная — делим по X (верт. линия), нечётная — по Y (гор. линия). Медиана идёт в узел, остальное — в две ветки.</div>
			{/if}
			<div class="note">{curNote}</div>
		</div>
	</div>
</div>

<style>
	.kd {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.kd__bar {
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
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		overflow: hidden;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		padding: 0.4rem 0.8rem;
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
	.kd__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.kd__svg {
		flex: 1 1 340px;
		min-width: 300px;
		max-width: 480px;
		height: auto;
	}
	.field {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		cursor: crosshair;
	}
	.split {
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		transition: stroke 0.2s, opacity 0.2s;
	}
	.split.cur {
		stroke: var(--blue);
		stroke-width: 2.5;
	}
	.split.dim {
		opacity: 0.25;
	}
	.ball {
		fill: var(--blue-pale);
		fill-opacity: 0.35;
		stroke: var(--blue);
		stroke-width: 1.5;
		stroke-dasharray: 3 3;
		transition: r 0.25s;
	}
	.pt circle {
		fill: var(--color-ink-850);
		stroke: var(--color-parch-muted);
		stroke-width: 2;
		transition: fill 0.2s, stroke 0.2s;
	}
	.pt text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.55rem;
		fill: var(--color-parch-muted);
	}
	.pt.placed circle { stroke: var(--color-parch-200); }
	.pt.visited circle { fill: var(--blue-pale); stroke: var(--blue); }
	.pt.current circle { fill: var(--blue); stroke: var(--color-parch-100); stroke-width: 3; }
	.pt.pruned circle { fill: var(--color-ink-800); stroke: var(--color-ink-600); }
	.pt.pruned text { fill: var(--color-ink-500); }
	.pt.best circle { fill: var(--blue); stroke: #fff; stroke-width: 3; }
	.pt.best text { fill: var(--blue); font-weight: 700; }
	.qmark line {
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.tedge {
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		transition: opacity 0.2s;
	}
	.tedge.dim { opacity: 0.25; }
	.tnode circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.2s, stroke 0.2s, opacity 0.2s;
	}
	.tnode text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.6rem;
		fill: var(--color-parch-100);
	}
	.tnode .axislbl {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		fill: var(--color-parch-muted);
	}
	.tnode.placed circle { stroke: var(--color-parch-200); }
	.tnode.visited circle { fill: var(--blue-pale); stroke: var(--blue); }
	.tnode.current circle { fill: var(--blue); stroke: var(--color-parch-100); stroke-width: 3; }
	.tnode.current text { fill: #fff; }
	.tnode.pruned circle { fill: var(--color-ink-800); stroke: var(--color-ink-600); opacity: 0.55; }
	.tnode.pruned text { fill: var(--color-ink-500); }
	.kd__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.4rem;
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.4rem 0.5rem;
		background: var(--color-ink-800);
		border-radius: 8px;
	}
	.stat .lbl {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.stat b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.1rem;
		color: var(--blue);
	}
	.stat b.muted { color: var(--color-parch-muted); }
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.lrow {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.74rem;
		color: var(--color-parch-200);
	}
	.sw {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		flex: none;
	}
	.sw.cur { background: var(--blue); border: 2px solid var(--color-parch-100); }
	.sw.placed { background: var(--color-ink-850); border: 2px solid var(--color-parch-200); }
	.sline {
		width: 0.9rem;
		height: 0;
		border-top: 2px solid var(--blue);
		flex: none;
	}
	.hint {
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		line-height: 1.4;
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
