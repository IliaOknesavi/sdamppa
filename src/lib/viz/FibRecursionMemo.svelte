<script lang="ts">
	// Дерево рекурсивных вызовов fib(n). Подсветка ПОВТОРНЫХ подзадач (один и тот
	// же аргумент считается заново). Тумблер «кэш (memo)» схлопывает повторы —
	// дерево вырождается в линейную цепочку, а счётчик вызовов падает с O(φ^n)
	// до O(n). Ползунок n, пошаговое разворачивание. Чистый SVG, без внешних зависимостей.
	type Node = {
		id: number; // порядковый номер узла в обходе (порядок вызова)
		n: number; // аргумент fib
		depth: number;
		x: number;
		y: number;
		parent: number | null;
		repeat: boolean; // этот аргумент уже встречался раньше (повторная подзадача)
		pruned: boolean; // в режиме memo поддерево не раскрывается (берём из кэша)
	};

	const PHI = (1 + Math.sqrt(5)) / 2;

	// Полное дерево рекурсии fib(n) в порядке предобхода (как реально вызывается).
	// memo=false — раскрываем всё; memo=true — повторный аргумент берём из кэша,
	// поддерево не раскрываем (pruned), счётчик не растёт повторно.
	function buildTree(n: number, memo: boolean): Node[] {
		const out: Node[] = [];
		const firstSeen = new Set<number>();
		let counter = 0;

		function rec(arg: number, depth: number, parent: number | null): number {
			const id = counter++;
			const already = firstSeen.has(arg);
			const node: Node = {
				id, n: arg, depth, x: 0, y: 0, parent,
				repeat: already,
				pruned: memo && already
			};
			out.push(node);
			if (!already) firstSeen.add(arg);

			// База рекурсии или попадание в кэш — не разворачиваем дальше.
			if (arg < 2 || node.pruned) return id;
			rec(arg - 1, depth + 1, id);
			rec(arg - 2, depth + 1, id);
			return id;
		}

		rec(n, 0, null);
		layout(out);
		return out;
	}

	// Раскладка: листья равномерно по X, родитель — по центру детей. Y по глубине.
	const VB_W = 420;
	const VB_H = 290;
	const MARGIN_X = 26;
	const TOP = 30;

	function layout(nodes: Node[]) {
		const children = new Map<number, number[]>();
		for (const nd of nodes) {
			if (nd.parent !== null) {
				if (!children.has(nd.parent)) children.set(nd.parent, []);
				children.get(nd.parent)!.push(nd.id);
			}
		}
		const maxDepth = Math.max(...nodes.map((d) => d.depth), 1);
		const dy = (VB_H - TOP - 22) / maxDepth;
		const byId = new Map(nodes.map((d) => [d.id, d]));

		let leafX = 0;
		const leaves = nodes.filter((d) => !(children.get(d.id)?.length)).length;
		const stepX = (VB_W - 2 * MARGIN_X) / Math.max(leaves - 1, 1);

		function place(id: number): number {
			const nd = byId.get(id)!;
			nd.y = TOP + nd.depth * dy;
			const kids = children.get(id);
			if (!kids || kids.length === 0) {
				nd.x = MARGIN_X + leafX * stepX;
				leafX += 1;
				return nd.x;
			}
			const xs = kids.map(place);
			nd.x = xs.reduce((a, b) => a + b, 0) / xs.length;
			return nd.x;
		}
		// корень — узел с parent === null (он же первый в массиве)
		const root = nodes.find((d) => d.parent === null);
		if (root) place(root.id);
	}

	let n = $state(6);
	let memo = $state(false);
	let idx = $state(1); // сколько узлов раскрыто (пошаговое разворачивание)
	let playing = $state(false);

	const tree = $derived(buildTree(n, memo));
	const total = $derived(tree.length); // всего вызовов в текущем режиме
	const shown = $derived(Math.min(idx, total));
	const visible = $derived(tree.slice(0, shown));
	const visibleIds = $derived(new Set(visible.map((d) => d.id)));
	const last = $derived(visible[visible.length - 1]);

	// Сколько уникальных подзадач (fib(0)..fib(n)) — это и есть O(n) для memo.
	const uniqueCount = $derived(n + 1);
	// Наивное число вызовов: 2*fib(n+1) − 1 (классическая формула).
	function fib(k: number): number {
		let a = 0, b = 1;
		for (let i = 0; i < k; i++) [a, b] = [b, a + b];
		return a;
	}
	const naiveCalls = $derived(2 * fib(n + 1) - 1);

	function nodeState(nd: Node): string {
		if (last && nd.id === last.id) return 'active';
		if (nd.pruned) return 'cache';
		if (nd.repeat) return 'repeat';
		if (nd.n < 2) return 'base';
		return 'idle';
	}

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		if (idx >= total) idx = 1;
		playing = true;
		timer = setInterval(() => {
			if (idx >= total) {
				stop();
				return;
			}
			idx += 1;
		}, 360);
	}
	function reset() {
		stop();
		idx = 1;
	}
	function setN(v: number) {
		stop();
		n = v;
		idx = 1;
	}
	function toggleMemo() {
		stop();
		memo = !memo;
		idx = 1;
	}

	const noteText = $derived(
		memo
			? `С кэшем каждый fib(k) считается ровно один раз: дерево вырождается в цепочку, вызовов ≈ ${total} — это O(n).`
			: `Без кэша одинаковые подзадачи (жёлтые) пересчитываются заново: ${total} вызовов — рост как O(φⁿ), φ ≈ 1.618.`
	);
</script>

<div class="fb">
	<div class="fb__bar">
		<label class="memo" class:on={memo}>
			<input type="checkbox" checked={memo} onchange={toggleMemo} />
			<span class="track"><span class="knob"></span></span>
			<span class="memo-lbl">кэш (memo)</span>
		</label>

		<div class="nbox">
			<span class="nlbl">n = {n}</span>
			<input
				type="range" min="5" max="8" step="1"
				value={n}
				oninput={(e) => setN(+(e.currentTarget as HTMLInputElement).value)}
			/>
		</div>

		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(1, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="разворачивать">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(total, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{shown}/{total}</span>
		</div>
	</div>

	<div class="fb__body">
		<svg viewBox="0 0 {VB_W} {VB_H}" class="fb__svg">
			{#each tree as nd}
				{#if nd.parent !== null && visibleIds.has(nd.id)}
					{@const p = tree[nd.parent]}
					<line
						x1={p.x} y1={p.y + 13} x2={nd.x} y2={nd.y - 13}
						class="edge" class:dim={nd.repeat && !memo}
					/>
				{/if}
			{/each}

			{#each tree as nd}
				{#if visibleIds.has(nd.id)}
					<g class="node {nodeState(nd)}">
						<circle cx={nd.x} cy={nd.y} r="13" />
						<text x={nd.x} y={nd.y} dy="0.34em">{nd.n}</text>
						{#if nd.pruned}
							<text x={nd.x + 15} y={nd.y - 9} class="tag">⚡</text>
						{/if}
					</g>
				{/if}
			{/each}
		</svg>

		<div class="fb__panel">
			<div class="legend">
				<span class="lg"><i class="sw base"></i>база (0/1)</span>
				<span class="lg"><i class="sw repeat"></i>повтор</span>
				{#if memo}<span class="lg"><i class="sw cache"></i>из кэша ⚡</span>{/if}
			</div>

			<div class="cmp">
				<div class="cmp-row" class:on={!memo}>
					<span class="cmp-lbl">Без кэша · O(φⁿ)</span>
					<b class="big">{naiveCalls}</b>
					<span class="cmp-sub">вызовов fib</span>
				</div>
				<div class="cmp-row alt" class:on={memo}>
					<span class="cmp-lbl">С кэшем · O(n)</span>
					<b class="big">{uniqueCount}</b>
					<span class="cmp-sub">уникальных fib(0..{n})</span>
				</div>
				<div class="ratio">
					экономия ≈ ×{(naiveCalls / uniqueCount).toFixed(1)}
				</div>
			</div>

			<div class="now">
				{#if last}
					раскрываем <code>fib({last.n})</code>
					{#if last.pruned}<span class="hit">→ кэш ⚡</span>
					{:else if last.repeat}<span class="warn">повтор</span>
					{:else if last.n < 2}<span class="ok">= {last.n}</span>{/if}
				{/if}
			</div>

			<div class="note">{noteText}</div>
		</div>
	</div>
</div>

<style>
	.fb {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.fb__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	/* memo toggle */
	.memo {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		cursor: pointer;
		user-select: none;
	}
	.memo input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}
	.memo .track {
		width: 2.3rem;
		height: 1.2rem;
		border-radius: 999px;
		background: var(--color-ink-700);
		border: 1.5px solid var(--color-ink-500);
		position: relative;
		transition: background 0.2s, border-color 0.2s;
	}
	.memo .knob {
		position: absolute;
		top: 1px;
		left: 1px;
		width: 0.95rem;
		height: 0.95rem;
		border-radius: 50%;
		background: var(--color-parch-100);
		transition: transform 0.2s;
	}
	.memo.on .track {
		background: var(--blue);
		border-color: var(--blue);
	}
	.memo.on .knob {
		transform: translateX(1.1rem);
		background: #fff;
	}
	.memo-lbl {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		color: var(--color-parch-100);
	}
	.nbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.nlbl {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-200);
		white-space: nowrap;
	}
	.nbox input[type='range'] {
		width: 6.5rem;
		accent-color: var(--blue);
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
	.fb__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.fb__svg {
		flex: 1 1 340px;
		min-width: 290px;
		max-width: 480px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2;
	}
	.edge.dim {
		stroke-dasharray: 3 3;
		opacity: 0.6;
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.2s, stroke 0.2s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.72rem;
		fill: var(--color-parch-100);
	}
	.node text.tag {
		font-size: 0.6rem;
		fill: var(--blue);
	}
	.node.base circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.base text {
		fill: var(--blue);
	}
	.node.repeat circle {
		fill: var(--color-gold-500, #d99a2b);
		stroke: var(--color-gold-500, #d99a2b);
	}
	.node.repeat text {
		fill: #fff;
	}
	.node.cache circle {
		fill: var(--color-ink-800);
		stroke: var(--blue);
		stroke-dasharray: 3 2;
	}
	.node.cache text {
		fill: var(--blue);
	}
	.node.active circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	.node.active text {
		fill: #fff;
	}
	.fb__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.lg {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.sw {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 3px;
		display: inline-block;
	}
	.sw.base {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.sw.repeat {
		background: var(--color-gold-500, #d99a2b);
	}
	.sw.cache {
		background: var(--color-ink-800);
		border: 1.5px dashed var(--blue);
	}
	.cmp {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 9px;
		border: 1.5px solid var(--color-ink-600);
	}
	.cmp-row {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		align-items: baseline;
		column-gap: 0.5rem;
		opacity: 0.5;
		transition: opacity 0.2s;
	}
	.cmp-row.on {
		opacity: 1;
	}
	.cmp-lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-parch-muted);
		grid-row: 1;
	}
	.cmp-row .big {
		grid-row: 1 / span 2;
		grid-column: 2;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.5rem;
		color: var(--color-parch-100);
		text-align: right;
	}
	.cmp-row.alt .big {
		color: var(--blue);
	}
	.cmp-sub {
		grid-row: 2;
		grid-column: 1;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		color: var(--color-parch-muted);
	}
	.ratio {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--blue);
		text-align: right;
		border-top: 1px dashed var(--color-ink-600);
		padding-top: 0.3rem;
	}
	.now {
		font-size: 0.76rem;
		color: var(--color-parch-200);
		font-family: var(--font-mono);
	}
	.now code {
		color: var(--color-parch-100);
		font-weight: 700;
	}
	.now .hit {
		color: var(--blue);
	}
	.now .warn {
		color: var(--color-gold-500, #d99a2b);
	}
	.now .ok {
		color: var(--blue);
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
