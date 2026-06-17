<script lang="ts">
	// Дерево отрезков над массивом из 8 чисел. Тумблер сумма/минимум.
	// Три режима: построение снизу вверх, запрос на диапазоне (подсветка
	// покрывающих узлов за O(log N), точечное обновление с пересчётом пути
	// вверх. Шаг / плей / сброс. Чистый SVG, без внешних импортов.
	type Mode = 'build' | 'query' | 'update';
	type Op = 'sum' | 'min';
	// узел дерева отрезков: покрывает [lo, hi] исходного массива
	type Node = { id: number; lo: number; hi: number; depth: number; x: number; y: number };
	type Step = {
		// какие узлы уже имеют значение / подсвечены на этом шаге
		ready: number[]; // узлы с вычисленным значением (зелёный «готов»)
		active: number | null; // текущий обрабатываемый узел
		picked: number[]; // покрывающие узлы запроса (вклад в ответ)
		path: number[]; // узлы пути снизу вверх при обновлении
		note: string;
		acc: number | null; // накопленный ответ запроса / новое значение
	};

	const N = 8;
	const base = [5, 2, 7, 1, 9, 3, 6, 4];
	let arr = $state([...base]);

	let op = $state<Op>('sum');
	let mode = $state<Mode>('build');
	let qLo = $state(2);
	let qHi = $state(6);
	let upIdx = $state(3);
	let upVal = $state(8);

	const IDENT = (o: Op) => (o === 'sum' ? 0 : Infinity);
	const merge = (o: Op, a: number, b: number) => (o === 'sum' ? a + b : Math.min(a, b));

	// --- построение раскладки дерева ----------------------------------------
	// корень покрывает [0, N-1]; рекурсивно делим пополам.
	const W = 420;
	const TOP = 30;
	const LEVEL_H = 46;
	function buildLayout(): { nodes: Node[]; children: Map<number, [number, number]>; leafOf: number[] } {
		const nodes: Node[] = [];
		const children = new Map<number, [number, number]>();
		const leafOf: number[] = new Array(N).fill(-1);
		let nextId = 0;
		// возвращаем горизонтальный центр поддерева для расстановки x
		function rec(lo: number, hi: number, depth: number, xMin: number, xMax: number): number {
			const id = nextId++;
			const cx = (xMin + xMax) / 2;
			const node: Node = { id, lo, hi, depth, x: cx, y: TOP + depth * LEVEL_H };
			nodes.push(node);
			if (lo === hi) {
				leafOf[lo] = id;
			} else {
				const mid = (lo + hi) >> 1;
				const lc = rec(lo, mid, depth + 1, xMin, cx);
				const rc = rec(mid + 1, hi, depth + 1, cx, xMax);
				children.set(id, [lc, rc]);
			}
			return id;
		}
		rec(0, N - 1, 0, 14, W - 14);
		return { nodes, children, leafOf };
	}
	const layout = buildLayout();
	const nodes = layout.nodes;
	const childMap = layout.children;
	const nodeById = new Map(nodes.map((n) => [n.id, n]));
	const maxDepth = Math.max(...nodes.map((n) => n.depth));
	const SVG_H = TOP + maxDepth * LEVEL_H + 30;

	// порядок построения снизу вверх = узлы по убыванию глубины,
	// внутри уровня — слева направо (по lo).
	const buildOrder = [...nodes].sort((a, b) =>
		b.depth - a.depth || a.lo - b.lo
	);

	// --- вычисление значений всех узлов под данный массив/операцию -----------
	function computeValues(a: number[], o: Op): Map<number, number> {
		const val = new Map<number, number>();
		function rec(id: number): number {
			const n = nodeById.get(id)!;
			if (n.lo === n.hi) {
				val.set(id, a[n.lo]);
				return a[n.lo];
			}
			const [lc, rc] = childMap.get(id)!;
			const v = merge(o, rec(lc), rec(rc));
			val.set(id, v);
			return v;
		}
		rec(0);
		return val;
	}

	// --- шаги: ПОСТРОЕНИЕ ----------------------------------------------------
	function stepsBuild(a: number[], o: Op): Step[] {
		const steps: Step[] = [];
		const ready: number[] = [];
		steps.push({ ready: [], active: null, picked: [], path: [], acc: null,
			note: `Построение ${o === 'sum' ? 'суммы' : 'минимума'} снизу вверх` });
		for (const n of buildOrder) {
			ready.push(n.id);
			const leaf = n.lo === n.hi;
			steps.push({
				ready: [...ready], active: n.id, picked: [], path: [], acc: null,
				note: leaf
					? `Лист [${n.lo}] = ${a[n.lo]}`
					: `Узел [${n.lo}..${n.hi}] = ${o === 'sum' ? 'сумма' : 'min'} детей`
			});
		}
		steps.push({ ready: [...ready], active: null, picked: [], path: [], acc: null,
			note: 'Дерево построено за O(N)' });
		return steps;
	}

	// --- шаги: ЗАПРОС на [lo, hi] (классический спуск от корня) --------------
	function stepsQuery(o: Op, ql: number, qh: number): Step[] {
		const steps: Step[] = [];
		const picked: number[] = [];
		const val = computeValues(arr, o);
		let acc = IDENT(o);
		steps.push({ ready: [], active: null, picked: [], path: [], acc: null,
			note: `Запрос ${o === 'sum' ? 'суммы' : 'минимума'} на [${ql}..${qh}]` });
		// итеративный рекурсивный спуск; собираем покрывающие узлы
		function rec(id: number) {
			const n = nodeById.get(id)!;
			if (qh < n.lo || n.hi < ql) {
				// полностью вне диапазона — отсечение
				steps.push({ ready: [], active: id, picked: [...picked], path: [], acc,
					note: `[${n.lo}..${n.hi}] вне [${ql}..${qh}] — пропуск` });
				return;
			}
			if (ql <= n.lo && n.hi <= qh) {
				// узел целиком внутри — берём его значение
				picked.push(id);
				acc = merge(o, acc, val.get(id)!);
				steps.push({ ready: [], active: id, picked: [...picked], path: [], acc,
					note: `[${n.lo}..${n.hi}] ⊆ запроса → берём ${val.get(id)}, ответ = ${acc}` });
				return;
			}
			// частичное пересечение — спускаемся к детям
			steps.push({ ready: [], active: id, picked: [...picked], path: [], acc,
				note: `[${n.lo}..${n.hi}] пересекает границу — делим` });
			const [lc, rc] = childMap.get(id)!;
			rec(lc);
			rec(rc);
		}
		rec(0);
		steps.push({ ready: [], active: null, picked: [...picked], path: [], acc,
			note: `Покрыто ${picked.length} узл. (O(log N)), ответ = ${acc}` });
		return steps;
	}

	// --- шаги: ОБНОВЛЕНИЕ arr[idx] = newVal -----------------------------------
	function stepsUpdate(o: Op, idx: number, newVal: number): Step[] {
		const steps: Step[] = [];
		const path: number[] = [];
		// путь от листа к корню
		const chain: number[] = [];
		function findPath(id: number): boolean {
			const n = nodeById.get(id)!;
			if (n.lo === n.hi) {
				if (n.lo === idx) { chain.push(id); return true; }
				return false;
			}
			const [lc, rc] = childMap.get(id)!;
			if (findPath(lc) || findPath(rc)) { chain.push(id); return true; }
			return false;
		}
		findPath(0);
		// chain идёт лист → корень
		steps.push({ ready: [], active: null, picked: [], path: [], acc: newVal,
			note: `Обновление: arr[${idx}] ← ${newVal}` });
		// пересчёт под новый массив
		const a2 = [...arr];
		a2[idx] = newVal;
		const val = computeValues(a2, o);
		for (let i = 0; i < chain.length; i++) {
			const id = chain[i];
			const n = nodeById.get(id)!;
			path.push(id);
			steps.push({
				ready: [], active: id, picked: [], path: [...path], acc: val.get(id)!,
				note: i === 0
					? `Лист [${idx}] = ${newVal}`
					: `Пересчёт [${n.lo}..${n.hi}] = ${val.get(id)}`
			});
		}
		steps.push({ ready: [], active: null, picked: [], path: [...path], acc: val.get(0)!,
			note: `Путь до корня пересчитан за O(log N)` });
		return steps;
	}

	// текущая последовательность шагов зависит от режима/операции/параметров.
	const steps = $derived(
		mode === 'build'
			? stepsBuild(arr, op)
			: mode === 'query'
				? stepsQuery(op, Math.min(qLo, qHi), Math.max(qLo, qHi))
				: stepsUpdate(op, upIdx, upVal)
	);

	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// значения узлов для отображения: в режиме build показываем только готовые;
	// иначе — полностью вычисленное дерево.
	const fullVal = $derived(computeValues(arr, op));
	const readySet = $derived(new Set(cur.ready));
	const pickedSet = $derived(new Set(cur.picked));
	const pathSet = $derived(new Set(cur.path));

	function nodeShown(id: number): boolean {
		if (mode === 'build') return readySet.has(id);
		return true;
	}
	function nodeValue(id: number): number {
		return fullVal.get(id)!;
	}
	function nodeState(id: number): string {
		if (cur.active === id) return 'active';
		if (pickedSet.has(id)) return 'picked';
		if (pathSet.has(id)) return 'path';
		if (mode === 'build' && readySet.has(id)) return 'ready';
		return 'idle';
	}

	// подсвечиваем индексы массива, попадающие в запрос
	const queryRange = $derived(mode === 'query'
		? { lo: Math.min(qLo, qHi), hi: Math.max(qLo, qHi) }
		: null);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() { playing = false; clearInterval(timer); }
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= steps.length - 1) { stop(); return; }
			idx += 1;
		}, 800);
	}
	function reset() { stop(); idx = 0; }
	function setMode(m: Mode) { mode = m; reset(); }
	function setOp(o: Op) { op = o; reset(); }

	// применить обновление к массиву (видно сразу на всех режимах)
	function applyUpdate() {
		arr[upIdx] = upVal;
		arr = [...arr];
		reset();
	}
	function resetAll() {
		arr = [...base];
		reset();
	}

	// линии рёбер дерева
	type Edge = { x1: number; y1: number; x2: number; y2: number; child: number };
	const edges = $derived.by(() => {
		const out: Edge[] = [];
		for (const [pid, [lc, rc]] of childMap) {
			const p = nodeById.get(pid)!;
			for (const cid of [lc, rc]) {
				const c = nodeById.get(cid)!;
				out.push({ x1: p.x, y1: p.y, x2: c.x, y2: c.y, child: cid });
			}
		}
		return out;
	});
	function edgeShown(child: number): boolean {
		if (mode === 'build') return readySet.has(child);
		return true;
	}
	const NW = 44; // ширина узла
	const NH = 26; // высота узла
</script>

<div class="st">
	<div class="st__bar">
		<div class="seg op">
			<button class:on={op === 'sum'} onclick={() => setOp('sum')}>Сумма</button>
			<button class:on={op === 'min'} onclick={() => setOp('min')}>Минимум</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс анимации">↺</button>
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

	<div class="seg mode">
		<button class:on={mode === 'build'} onclick={() => setMode('build')}>Построение</button>
		<button class:on={mode === 'query'} onclick={() => setMode('query')}>Запрос диапазона</button>
		<button class:on={mode === 'update'} onclick={() => setMode('update')}>Обновление</button>
	</div>

	<div class="st__body">
		<svg viewBox="0 0 {W} {SVG_H}" class="st__svg">
			{#each edges as e}
				<line
					x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
					class="edge"
					class:on={edgeShown(e.child)}
					class:hot={pathSet.has(e.child) || pickedSet.has(e.child)}
				/>
			{/each}
			{#each nodes as n}
				{#if nodeShown(n.id)}
					<g class="node {nodeState(n.id)}" style="transform: translate({n.x}px, {n.y}px)">
						<rect x={-NW / 2} y={-NH / 2} width={NW} height={NH} rx="6" />
						<text class="val" dy="-0.05em">{nodeValue(n.id)}</text>
						<text class="rng" dy="0.95em">{n.lo === n.hi ? n.lo : `${n.lo}–${n.hi}`}</text>
					</g>
				{/if}
			{/each}
		</svg>
	</div>

	<!-- исходный массив -->
	<div class="st__arr">
		<span class="lbl">массив</span>
		<div class="cells">
			{#each arr as v, i}
				<div
					class="cell"
					class:inq={queryRange && i >= queryRange.lo && i <= queryRange.hi}
					class:upd={mode === 'update' && i === upIdx}
				>
					<b>{v}</b>
					<small>{i}</small>
				</div>
			{/each}
		</div>
	</div>

	<!-- контролы режима -->
	{#if mode === 'query'}
		<div class="st__panel">
			<div class="field">
				<label for="st-ql">диапазон от</label>
				<input id="st-ql" type="range" min="0" max={N - 1} bind:value={qLo} oninput={reset} />
				<output>{qLo}</output>
			</div>
			<div class="field">
				<label for="st-qh">до</label>
				<input id="st-qh" type="range" min="0" max={N - 1} bind:value={qHi} oninput={reset} />
				<output>{qHi}</output>
			</div>
		</div>
	{:else if mode === 'update'}
		<div class="st__panel">
			<div class="field">
				<label for="st-ui">индекс</label>
				<input id="st-ui" type="range" min="0" max={N - 1} bind:value={upIdx} oninput={reset} />
				<output>{upIdx}</output>
			</div>
			<div class="field">
				<label for="st-uv">значение</label>
				<input id="st-uv" type="range" min="0" max="20" bind:value={upVal} oninput={reset} />
				<output>{upVal}</output>
			</div>
			<button class="apply" onclick={applyUpdate}>Применить arr[{upIdx}] = {upVal}</button>
		</div>
	{/if}

	<div class="st__foot">
		<div class="note">{cur.note}</div>
		{#if mode !== 'build' && cur.acc !== null}
			<div class="acc">{mode === 'query' ? 'ответ' : 'значение'}: <b>{cur.acc}</b></div>
		{/if}
		<button class="reset-all" onclick={resetAll} title="вернуть исходный массив">сброс данных</button>
	</div>
</div>

<style>
	.st {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.st__bar {
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
		font-size: 0.76rem;
		padding: 0.4rem 0.75rem;
		border: none;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.seg button.on {
		background: var(--blue);
		color: #fff;
	}
	.seg.mode {
		margin: 0.7rem 0.9rem 0;
		flex-wrap: wrap;
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
	.st__body {
		padding: 0.6rem 0.9rem 0.2rem;
	}
	.st__svg {
		width: 100%;
		height: auto;
		max-width: 460px;
		display: block;
		margin: 0 auto;
	}
	.edge {
		stroke: var(--color-ink-700);
		stroke-width: 2;
		opacity: 0;
		transition: opacity 0.25s, stroke 0.2s, stroke-width 0.2s;
	}
	.edge.on {
		opacity: 1;
		stroke: var(--color-ink-500);
	}
	.edge.hot {
		stroke: var(--blue);
		stroke-width: 3;
	}
	.node rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node .val {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		fill: var(--color-parch-100);
	}
	.node .rng {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.5rem;
		fill: var(--color-parch-muted);
	}
	.node.ready rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.ready .val { fill: var(--blue); }
	.node.path rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.path .val { fill: var(--blue); }
	.node.picked rect {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.picked .val { fill: #fff; }
	.node.picked .rng { fill: rgba(255, 255, 255, 0.8); }
	.node.active rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	.node.active .val { fill: #fff; }
	.node.active .rng { fill: rgba(255, 255, 255, 0.85); }
	.st__arr {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.9rem 0.2rem;
		flex-wrap: wrap;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
		flex: none;
	}
	.cells {
		display: flex;
		gap: 0.28rem;
		flex-wrap: wrap;
	}
	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 2.1rem;
		height: 2.3rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		transition: background 0.2s, border-color 0.2s;
	}
	.cell b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		color: var(--color-parch-100);
	}
	.cell small {
		font-family: var(--font-mono);
		font-size: 0.52rem;
		color: var(--color-parch-muted);
	}
	.cell.inq {
		background: var(--blue-pale);
		border-color: var(--blue);
	}
	.cell.inq b { color: var(--blue); }
	.cell.upd {
		background: var(--blue);
		border-color: var(--color-parch-100);
	}
	.cell.upd b { color: #fff; }
	.cell.upd small { color: rgba(255, 255, 255, 0.8); }
	.st__panel {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.8rem;
		padding: 0.5rem 0.9rem;
	}
	.field {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}
	.field label {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-parch-muted);
	}
	.field input[type='range'] {
		width: 5.5rem;
		accent-color: var(--blue);
	}
	.field output {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--blue);
		width: 1.4rem;
		text-align: center;
	}
	.apply {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		padding: 0.35rem 0.7rem;
		border: 1.5px solid var(--blue);
		border-radius: 7px;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.apply:hover { background: var(--blue); color: #fff; }
	.st__foot {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		flex-wrap: wrap;
		padding: 0.5rem 0.9rem 0.8rem;
	}
	.note {
		flex: 1 1 200px;
		font-size: 0.83rem;
		color: var(--color-parch-200);
		padding: 0.55rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.acc {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--color-parch-200);
	}
	.acc b {
		font-family: var(--font-display);
		font-size: 0.95rem;
		color: var(--blue);
	}
	.reset-all {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		padding: 0.3rem 0.55rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-muted);
		cursor: pointer;
	}
	.reset-all:hover { border-color: var(--blue); color: var(--blue); }
</style>
