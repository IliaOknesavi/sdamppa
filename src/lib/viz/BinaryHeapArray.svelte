<script lang="ts">
	// Binary MIN-heap shown at once as a tree and as the backing array.
	// insert → sift-up, extract-min → sift-down. Each algorithm step is
	// pre-built so step/play/reset replay the exact comparisons & swaps,
	// highlighted in BOTH the tree and the array. Index links:
	// left = 2i+1, right = 2i+2, parent = (i-1)/2. Pure SVG/HTML, no deps.

	type Kind = 'compare' | 'swap' | 'place' | 'remove' | 'done';
	type Step = {
		heap: number[]; // array snapshot AFTER this step's mutation
		a: number; // primary index (моргает)
		b: number; // secondary index (-1 if none)
		kind: Kind;
		note: string;
	};

	const START = [2, 7, 4, 10, 9, 8, 15];

	let heap = $state<number[]>([...START]);
	let steps = $state<Step[]>([]);
	let idx = $state(0);
	let playing = $state(false);
	let inputVal = $state(5);

	const cur = $derived(
		steps.length ? steps[Math.min(idx, steps.length - 1)] : null
	);
	// Heap actually drawn: mid-animation snapshot, or the live array at rest.
	const view = $derived(cur ? cur.heap : heap);
	const n = $derived(view.length);

	const parent = (i: number) => (i - 1) >> 1;
	const left = (i: number) => 2 * i + 1;
	const right = (i: number) => 2 * i + 2;

	// ---- algorithm trace builders -------------------------------------------
	function traceInsert(value: number): Step[] {
		const h = [...heap];
		const out: Step[] = [];
		h.push(value);
		let i = h.length - 1;
		out.push({
			heap: [...h], a: i, b: -1, kind: 'place',
			note: `вставили ${value} в конец массива (индекс ${i})`
		});
		while (i > 0) {
			const p = parent(i);
			out.push({
				heap: [...h], a: i, b: p, kind: 'compare',
				note: `сравниваем ${h[i]} с родителем ${h[p]} (i=${i}, родитель ${p})`
			});
			if (h[i] < h[p]) {
				[h[i], h[p]] = [h[p], h[i]];
				out.push({
					heap: [...h], a: p, b: i, kind: 'swap',
					note: `${h[p]} < ${h[i]} → меняем местами (всплытие)`
				});
				i = p;
			} else {
				out.push({
					heap: [...h], a: i, b: p, kind: 'done',
					note: `${h[i]} ≥ ${h[p]} → порядок кучи восстановлен`
				});
				return out;
			}
		}
		out.push({
			heap: [...h], a: 0, b: -1, kind: 'done',
			note: `${h[0]} достиг корня — это новый минимум`
		});
		return out;
	}

	function traceExtract(): Step[] {
		const h = [...heap];
		const out: Step[] = [];
		if (h.length === 0) return out;
		const min = h[0];
		if (h.length === 1) {
			h.pop();
			out.push({ heap: [...h], a: -1, b: -1, kind: 'remove', note: `извлекли минимум ${min}, куча пуста` });
			return out;
		}
		const last = h.pop()!;
		h[0] = last;
		out.push({
			heap: [...h], a: 0, b: -1, kind: 'remove',
			note: `извлекли минимум ${min}; последний элемент ${last} ставим в корень`
		});
		let i = 0;
		const sz = h.length;
		while (true) {
			const l = left(i), r = right(i);
			let small = i;
			if (l < sz) {
				out.push({
					heap: [...h], a: small, b: l, kind: 'compare',
					note: `сравниваем ${h[small]} с левым потомком ${h[l]} (i=${i}, лев ${l})`
				});
				if (h[l] < h[small]) small = l;
			}
			if (r < sz) {
				out.push({
					heap: [...h], a: small, b: r, kind: 'compare',
					note: `сравниваем ${h[small]} с правым потомком ${h[r]} (i=${i}, прав ${r})`
				});
				if (h[r] < h[small]) small = r;
			}
			if (small === i) {
				out.push({
					heap: [...h], a: i, b: -1, kind: 'done',
					note: `${h[i]} ≤ потомков → порядок кучи восстановлен`
				});
				return out;
			}
			[h[i], h[small]] = [h[small], h[i]];
			out.push({
				heap: [...h], a: small, b: i, kind: 'swap',
				note: `меняем ${h[small]} ↑ с меньшим потомком ${h[i]} (просеивание вниз)`
			});
			i = small;
		}
	}

	// ---- driving the animation ----------------------------------------------
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function commit() {
		// fold the finished trace into the live heap, drop the trace
		if (steps.length) heap = [...steps[steps.length - 1].heap];
		steps = [];
		idx = 0;
	}
	function run(build: () => Step[]) {
		stop();
		commit();
		const s = build();
		if (!s.length) return;
		steps = s;
		idx = 0;
	}
	function doInsert() {
		if (heap.length >= 12) return;
		run(() => traceInsert(inputVal));
	}
	function doExtract() {
		if (heap.length === 0) return;
		run(traceExtract);
	}
	function play() {
		if (!steps.length) return;
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= steps.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 850);
	}
	function stepFwd() {
		stop();
		if (idx < steps.length - 1) idx += 1;
	}
	function stepBack() {
		stop();
		if (idx > 0) idx -= 1;
	}
	function reset() {
		stop();
		steps = [];
		idx = 0;
		heap = [...START];
	}

	// ---- node highlight state ------------------------------------------------
	function nodeState(i: number): string {
		if (!cur) return 'idle';
		if (i === cur.a) {
			if (cur.kind === 'swap') return 'swap';
			if (cur.kind === 'done') return 'done';
			if (cur.kind === 'place') return 'place';
			return 'active';
		}
		if (i === cur.b) {
			if (cur.kind === 'swap') return 'swap';
			return 'compare';
		}
		return 'idle';
	}

	// ---- tree layout: row-by-row, centred ------------------------------------
	const W = 420;
	function depth(i: number) {
		return Math.floor(Math.log2(i + 1));
	}
	function rowSpan(d: number) {
		return Math.pow(2, d);
	}
	function nodePos(i: number) {
		const d = depth(i);
		const first = rowSpan(d) - 1; // index of first node on this row
		const col = i - first;
		const slots = rowSpan(d);
		const x = (W * (col + 0.5)) / slots;
		const y = 26 + d * 52;
		return { x, y };
	}
	const treeH = $derived(26 + (depth(Math.max(0, n - 1)) + 1) * 52);

	// edges parent→child for current view
	const links = $derived(
		Array.from({ length: Math.max(0, n - 1) }, (_, k) => k + 1).map((i) => {
			const p = parent(i);
			return { from: nodePos(p), to: nodePos(i), child: i, par: p };
		})
	);
	function linkActive(child: number, par: number): boolean {
		if (!cur) return false;
		const s = new Set([cur.a, cur.b]);
		return s.has(child) && s.has(par);
	}
</script>

<div class="hp">
	<div class="hp__bar">
		<div class="ops">
			<div class="ins">
				<input
					type="number"
					min="0"
					max="99"
					bind:value={inputVal}
					aria-label="значение для вставки"
				/>
				<button class="op" onclick={doInsert} disabled={heap.length >= 12}>
					insert ↑
				</button>
			</div>
			<button class="op" onclick={doExtract} disabled={heap.length === 0}>
				extract-min ↓
			</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={stepBack} disabled={!steps.length || idx === 0} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} disabled={!steps.length} title="играть">▶</button>
			{/if}
			<button onclick={stepFwd} disabled={!steps.length || idx >= steps.length - 1} title="вперёд">▶▶</button>
			<span class="cnt">{steps.length ? idx : 0}/{steps.length ? steps.length - 1 : 0}</span>
		</div>
	</div>

	<div class="hp__body">
		<!-- TREE -->
		<svg viewBox={`0 0 ${W} ${treeH}`} class="hp__svg" role="img" aria-label="дерево кучи">
			{#each links as lk (lk.child)}
				<line
					x1={lk.from.x} y1={lk.from.y} x2={lk.to.x} y2={lk.to.y}
					class="link" class:active={linkActive(lk.child, lk.par)}
				/>
			{/each}
			{#each view as v, i (i)}
				{@const p = nodePos(i)}
				<g class="tnode {nodeState(i)}" style="transform: translate({p.x}px, {p.y}px)">
					<circle r="17" />
					<text dy="0.34em">{v}</text>
					<text class="ix" y="-23">{i}</text>
				</g>
			{/each}
			{#if n === 0}
				<text x={W / 2} y={treeH / 2} class="emptyt">куча пуста</text>
			{/if}
		</svg>
	</div>

	<!-- ARRAY -->
	<div class="hp__array">
		<div class="alabel">Массив (хранение кучи)</div>
		<div class="cells">
			{#each view as v, i (i)}
				<div class="cell {nodeState(i)}">
					<span class="val">{v}</span>
					<span class="ix">{i}</span>
				</div>
			{:else}
				<span class="emptya">—</span>
			{/each}
		</div>
		<div class="formula">
			<code>left = 2·i+1</code>
			<code>right = 2·i+2</code>
			<code>parent = (i−1)÷2</code>
		</div>
	</div>

	<div class="note">
		{#if cur}
			{cur.note}
		{:else}
			Min-куча: каждый родитель ≤ своих детей, корень — минимум. Введите число
			и нажмите insert (всплытие) либо extract-min (просеивание вниз).
		{/if}
	</div>
</div>

<style>
	.hp {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.hp__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.ops {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.ins {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.ins input {
		width: 3rem;
		padding: 0.3rem 0.4rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		text-align: center;
	}
	.op {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		padding: 0.38rem 0.7rem;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		transition: all 0.15s;
	}
	.op:hover:not(:disabled) {
		background: var(--blue);
		color: #fff;
	}
	.op:disabled {
		opacity: 0.4;
		cursor: not-allowed;
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
	.ctrl button:hover:not(:disabled) {
		border-color: var(--blue);
		color: var(--blue);
	}
	.ctrl button:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}
	.hp__body {
		padding: 0.8rem 1rem 0.2rem;
	}
	.hp__svg {
		width: 100%;
		height: auto;
		display: block;
	}
	.link {
		stroke: var(--color-ink-500);
		stroke-width: 2.2;
		transition: stroke 0.2s, stroke-width 0.2s;
	}
	.link.active {
		stroke: var(--blue);
		stroke-width: 3.5;
	}
	.tnode {
		transition: transform 0.4s ease;
	}
	.tnode circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.2;
		transition: fill 0.25s, stroke 0.25s;
	}
	.tnode text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.92rem;
		fill: var(--color-parch-100);
	}
	.tnode text.ix {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.tnode.active circle,
	.tnode.compare circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 3;
	}
	.tnode.swap circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.2;
	}
	.tnode.swap text {
		fill: #fff;
	}
	.tnode.place circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.tnode.place text {
		fill: #fff;
	}
	.tnode.done circle {
		fill: var(--color-ink-850);
		stroke: var(--blue);
		stroke-width: 3;
	}
	.emptyt {
		text-anchor: middle;
		font-family: var(--font-display);
		font-size: 0.9rem;
		fill: var(--color-parch-muted);
	}
	.hp__array {
		padding: 0.4rem 1rem 0.8rem;
	}
	.alabel {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
		margin-bottom: 0.4rem;
	}
	.cells {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		min-height: 2.6rem;
		align-items: flex-start;
	}
	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 2.1rem;
		padding: 0.2rem 0.1rem 0.05rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		transition: background 0.25s, border-color 0.25s;
	}
	.cell .val {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.86rem;
		color: var(--color-parch-100);
		line-height: 1.1;
	}
	.cell .ix {
		font-family: var(--font-mono);
		font-size: 0.54rem;
		color: var(--color-parch-muted);
	}
	.cell.active,
	.cell.compare {
		background: var(--blue-pale);
		border-color: var(--blue);
	}
	.cell.active .val,
	.cell.compare .val {
		color: var(--color-ink-800);
	}
	.cell.swap {
		background: var(--blue);
		border-color: var(--color-parch-100);
	}
	.cell.swap .val {
		color: #fff;
	}
	.cell.swap .ix {
		color: var(--color-parch-200);
	}
	.cell.place {
		background: var(--blue);
		border-color: var(--blue);
	}
	.cell.place .val {
		color: #fff;
	}
	.cell.place .ix {
		color: var(--color-parch-200);
	}
	.cell.done {
		border-color: var(--blue);
	}
	.emptya {
		color: var(--color-parch-muted);
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}
	.formula {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-top: 0.55rem;
	}
	.formula code {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--blue);
	}
	.note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		margin: 0 1rem 1rem;
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
</style>
