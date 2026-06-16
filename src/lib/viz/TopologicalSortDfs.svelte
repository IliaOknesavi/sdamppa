<script lang="ts">
	// Топологическая сортировка через DFS. Обходим DAG; вершина уходит в
	// результат по ЗАВЕРШЕНИЮ обработки (post-order), затем порядок
	// разворачивается в топологический. Тумблер «обратное ребро» делает граф
	// циклическим — ребро подсвечивается как индикатор цикла, топосорт невозможен.
	// Svelte 5 руны, чистый инлайн-SVG, без внешних зависимостей.
	type Step = {
		current: number | null;
		// 0 = белая (не тронута), 1 = серая (в стеке рекурсии), 2 = чёрная (завершена)
		color: number[];
		stack: number[]; // рекурсивный стек DFS
		finished: number[]; // порядок завершения (post-order), в порядке добавления
		edge: [number, number] | null; // ребро, по которому сейчас идём
		cycleEdge: [number, number] | null; // обнаруженное обратное ребро
		note: string;
		done: boolean;
	};

	const nodes = [
		{ id: 0, x: 50, y: 145, label: 'A' },
		{ id: 1, x: 150, y: 65, label: 'B' },
		{ id: 2, x: 150, y: 225, label: 'C' },
		{ id: 3, x: 255, y: 120, label: 'D' },
		{ id: 4, x: 255, y: 235, label: 'E' },
		{ id: 5, x: 360, y: 70, label: 'F' },
		{ id: 6, x: 365, y: 195, label: 'G' }
	];
	const N = nodes.length;
	const R = 18;

	// базовый DAG (только дуги «вперёд», цикла нет)
	const baseEdges: [number, number][] = [
		[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6]
	];
	// обратное ребро, создающее цикл F→A (5→0): F достижима из A, дуга назад замыкает цикл
	const backEdge: [number, number] = [5, 0];

	let cyclic = $state(false);
	let start = $state(0);
	let idx = $state(0);
	let playing = $state(false);

	const edges = $derived<[number, number][]>(
		cyclic ? [...baseEdges, backEdge] : baseEdges
	);

	// список смежности с сортировкой соседей по возрастанию (детерминизм обхода)
	function buildAdj(es: [number, number][]): number[][] {
		const adj: number[][] = nodes.map(() => []);
		for (const [a, b] of es) adj[a].push(b);
		for (const a of adj) a.sort((x, y) => x - y);
		return adj;
	}

	function buildSteps(es: [number, number][], startId: number): Step[] {
		const adj = buildAdj(es);
		const color = new Array(N).fill(0); // 0 белая, 1 серая, 2 чёрная
		const finished: number[] = [];
		const steps: Step[] = [];
		let cycleEdge: [number, number] | null = null;

		const snap = (
			current: number | null,
			stack: number[],
			edge: [number, number] | null,
			note: string,
			done = false
		) =>
			steps.push({
				current,
				color: [...color],
				stack: [...stack],
				finished: [...finished],
				edge,
				cycleEdge: cycleEdge ? [...cycleEdge] : null,
				note,
				done
			});

		snap(null, [], null, `Старт DFS из вершины ${nodes[startId].label}. Все вершины белые.`);

		// порядок запуска: сначала выбранный старт, затем остальные по возрастанию id
		const order = [startId, ...nodes.map((n) => n.id).filter((i) => i !== startId)];

		// итеративный DFS: кадр = { v, i = индекс следующего соседа }
		function dfs(root: number) {
			const stack: { v: number; i: number }[] = [];
			color[root] = 1;
			stack.push({ v: root, i: 0 });
			snap(root, stack.map((f) => f.v), null, `Заходим в ${nodes[root].label} → серая (в стеке).`);

			while (stack.length) {
				const frame = stack[stack.length - 1];
				const v = frame.v;
				if (frame.i < adj[v].length) {
					const u = adj[v][frame.i];
					frame.i++;
					if (color[u] === 0) {
						snap(v, stack.map((f) => f.v), [v, u], `Ребро ${nodes[v].label}→${nodes[u].label}: ${nodes[u].label} белая, спускаемся.`);
						color[u] = 1;
						stack.push({ v: u, i: 0 });
						snap(u, stack.map((f) => f.v), null, `Заходим в ${nodes[u].label} → серая (в стеке).`);
					} else if (color[u] === 1) {
						// сосед серый и в стеке → обратное ребро → цикл
						cycleEdge = [v, u];
						snap(v, stack.map((f) => f.v), [v, u], `Ребро ${nodes[v].label}→${nodes[u].label}: ${nodes[u].label} серая, она в стеке — это ОБРАТНОЕ ребро. Найден цикл!`);
						return; // прекращаем обход: топосорт невозможен
					} else {
						snap(v, stack.map((f) => f.v), [v, u], `Ребро ${nodes[v].label}→${nodes[u].label}: ${nodes[u].label} уже чёрная, пропускаем.`);
					}
				} else {
					// все соседи обработаны → завершаем вершину
					color[v] = 2;
					finished.push(v);
					stack.pop();
					snap(v, stack.map((f) => f.v), null, `${nodes[v].label} завершена → чёрная, уходит в результат (post-order).`);
					if (cycleEdge) return;
				}
			}
		}

		for (const root of order) {
			if (cycleEdge) break;
			if (color[root] === 0) dfs(root);
		}

		if (cycleEdge) {
			snap(null, [], null, `Граф циклический — топологическая сортировка невозможна.`, true);
		} else {
			const topo = [...finished].reverse();
			snap(null, [], null, `Готово. Разворачиваем порядок завершения → топологический порядок: ${topo.map((i) => nodes[i].label).join(' · ')}`, true);
		}
		return steps;
	}

	const steps = $derived(buildSteps(edges, start));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);
	const last = $derived(steps[steps.length - 1]);
	// топологический порядок = разворот порядка завершения (только если цикла нет)
	const topo = $derived(last.cycleEdge ? [] : [...last.finished].reverse());

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
		}, 800);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function toggleCyclic() {
		cyclic = !cyclic;
		reset();
	}
	function setStart(id: number) {
		start = id;
		reset();
	}

	function nodeClass(id: number): string {
		if (cur.current === id) return 'current';
		const c = cur.color[id];
		if (c === 2) return 'finished';
		if (c === 1) return 'instack';
		return 'idle';
	}
	function edgeActive(a: number, b: number): boolean {
		return !!cur.edge && cur.edge[0] === a && cur.edge[1] === b;
	}
	function edgeIsBack(a: number, b: number): boolean {
		return a === backEdge[0] && b === backEdge[1] && cyclic;
	}
	function edgeIsCycle(a: number, b: number): boolean {
		return !!cur.cycleEdge && cur.cycleEdge[0] === a && cur.cycleEdge[1] === b;
	}

	// укорачиваем сегмент до края круга, чтобы стрелка села на ободок
	function seg(a: number, b: number) {
		const p = nodes[a], q = nodes[b];
		const dx = q.x - p.x, dy = q.y - p.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len, uy = dy / len;
		return { x1: p.x + ux * R, y1: p.y + uy * R, x2: q.x - ux * R, y2: q.y - uy * R };
	}
	// обратное ребро рисуем дугой, чтобы не сливалось с прямыми
	function backPath(a: number, b: number) {
		const s = seg(a, b);
		const mx = (s.x1 + s.x2) / 2, my = (s.y1 + s.y2) / 2;
		const nx = -(s.y2 - s.y1), ny = s.x2 - s.x1;
		const nlen = Math.hypot(nx, ny) || 1;
		const off = 55;
		return `M ${s.x1} ${s.y1} Q ${mx + (nx / nlen) * off} ${my + (ny / nlen) * off} ${s.x2} ${s.y2}`;
	}
</script>

<div class="ts">
	<div class="ts__bar">
		<div class="seg-group">
			<span class="seg-lbl">Старт</span>
			<div class="seg">
				{#each nodes as n}
					<button class:on={start === n.id} onclick={() => setStart(n.id)}>{n.label}</button>
				{/each}
			</div>
		</div>
		<label class="toggle" class:active={cyclic}>
			<input type="checkbox" checked={cyclic} onchange={toggleCyclic} />
			<span class="track"><span class="knob"></span></span>
			<span class="toggle-txt">обратное ребро {nodes[backEdge[0]].label}→{nodes[backEdge[1]].label}</span>
		</label>
	</div>

	<div class="ts__ctrl">
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

	<div class="ts__body">
		<svg viewBox="0 0 420 290" class="ts__svg">
			<defs>
				<marker id="ts-arr" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto-start-reverse">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--color-ink-500)" />
				</marker>
				<marker id="ts-arr-on" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto-start-reverse">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
				<marker id="ts-arr-cyc" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto-start-reverse">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--color-ink-100, #e8554e)" />
				</marker>
			</defs>

			{#each edges as [a, b]}
				{#if edgeIsBack(a, b)}
					<path
						d={backPath(a, b)}
						class="edge back"
						class:cycle={edgeIsCycle(a, b)}
						fill="none"
						marker-end={edgeIsCycle(a, b) ? 'url(#ts-arr-cyc)' : 'url(#ts-arr)'}
					/>
				{:else}
					{@const s = seg(a, b)}
					<line
						x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
						class="edge"
						class:active={edgeActive(a, b)}
						marker-end={edgeActive(a, b) ? 'url(#ts-arr-on)' : 'url(#ts-arr)'}
					/>
				{/if}
			{/each}

			{#each nodes as n}
				<g class="node {nodeClass(n.id)}">
					<circle cx={n.x} cy={n.y} r={R} />
					<text x={n.x} y={n.y} dy="0.34em">{n.label}</text>
				</g>
			{/each}
		</svg>

		<div class="ts__panel">
			<div class="row">
				<span class="lbl">Стек DFS</span>
				<div class="chips">
					{#each cur.stack as s}<span class="chip s">{nodes[s].label}</span>{:else}<span class="empty">—</span>{/each}
				</div>
			</div>
			<div class="row">
				<span class="lbl">Завершено (post-order)</span>
				<div class="chips">
					{#each cur.finished as f, i}<span class="chip f">{nodes[f].label}<sub>{i + 1}</sub></span>{:else}<span class="empty">—</span>{/each}
				</div>
			</div>
			<div class="row">
				<span class="lbl">Топологический порядок (разворот)</span>
				<div class="chips">
					{#if cur.done && !cur.cycleEdge}
						{#each topo as t}<span class="chip t">{nodes[t].label}</span>{/each}
					{:else if cur.cycleEdge}
						<span class="cycle-bad">цикл — невозможен</span>
					{:else}
						<span class="empty">…считаем</span>
					{/if}
				</div>
			</div>
			<div class="note" class:bad={cur.cycleEdge}>{cur.note}</div>
		</div>
	</div>

	<div class="ts__legend">
		<span><i class="lg idle"></i>белая — не тронута</span>
		<span><i class="lg instack"></i>серая — в стеке</span>
		<span><i class="lg finished"></i>чёрная — завершена</span>
		{#if cyclic}<span><i class="lg cyc"></i>обратное ребро → цикл</span>{/if}
	</div>
</div>

<style>
	.ts {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.ts__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.seg-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.seg-lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
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
		font-size: 0.74rem;
		padding: 0.32rem 0.55rem;
		border: none;
		border-right: 1px solid var(--blue);
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.seg button:last-child { border-right: none; }
	.seg button.on { background: var(--blue); color: #fff; }
	.toggle {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		cursor: pointer;
		user-select: none;
	}
	.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
	.toggle .track {
		width: 2.1rem;
		height: 1.1rem;
		border-radius: 999px;
		background: var(--color-ink-600);
		border: 1.5px solid var(--color-ink-500);
		position: relative;
		transition: background 0.2s, border-color 0.2s;
		flex: none;
	}
	.toggle .knob {
		position: absolute;
		top: 1px;
		left: 1px;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;
		background: var(--color-parch-100);
		transition: transform 0.2s;
	}
	.toggle.active .track {
		background: var(--color-ink-100, #e8554e);
		border-color: var(--color-ink-100, #e8554e);
	}
	.toggle.active .knob { transform: translateX(1rem); }
	.toggle-txt {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		color: var(--color-parch-200);
	}
	.toggle.active .toggle-txt { color: var(--color-ink-100, #e8554e); }
	.ts__ctrl {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.55rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.ts__ctrl button {
		width: 2rem;
		height: 2rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.8rem;
	}
	.ts__ctrl button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}
	.ts__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.ts__svg {
		flex: 1 1 330px;
		min-width: 290px;
		max-width: 470px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.2s, stroke-width 0.2s;
	}
	.edge.active {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.edge.back {
		stroke: var(--color-ink-100, #e8554e);
		stroke-width: 2.5;
		stroke-dasharray: 5 4;
	}
	.edge.back.cycle {
		stroke-width: 4.5;
		stroke-dasharray: none;
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
		font-size: 1rem;
		fill: var(--color-parch-100);
	}
	.node.instack circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.instack text { fill: var(--blue); }
	.node.finished circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.finished text { fill: #fff; }
	.node.current circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.current text { fill: #fff; }
	.ts__panel {
		flex: 1 1 240px;
		min-width: 220px;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
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
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		min-height: 1.8rem;
	}
	.chip {
		display: grid;
		place-items: center;
		min-width: 1.7rem;
		height: 1.7rem;
		padding: 0 0.4rem;
		border-radius: 6px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.82rem;
	}
	.chip sub {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		font-weight: 600;
		opacity: 0.85;
	}
	.chip.s {
		background: var(--blue-pale);
		color: var(--blue);
		border: 1.5px solid var(--blue);
	}
	.chip.f {
		background: var(--color-ink-700, var(--color-ink-800));
		color: var(--color-parch-100);
		border: 1.5px solid var(--color-ink-500);
	}
	.chip.t {
		background: var(--blue);
		color: #fff;
	}
	.empty { color: var(--color-parch-muted); }
	.cycle-bad {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--color-ink-100, #e8554e);
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
	.note.bad { border-left-color: var(--color-ink-100, #e8554e); }
	.ts__legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1rem;
		padding: 0.6rem 0.9rem 0.8rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
	}
	.ts__legend span {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.lg {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		border: 1.5px solid var(--color-ink-500);
		flex: none;
	}
	.lg.idle { background: var(--color-ink-850); }
	.lg.instack { background: var(--blue-pale); border-color: var(--blue); }
	.lg.finished { background: var(--blue); border-color: var(--blue); }
	.lg.cyc {
		border-radius: 2px;
		background: var(--color-ink-100, #e8554e);
		border-color: var(--color-ink-100, #e8554e);
	}
</style>
