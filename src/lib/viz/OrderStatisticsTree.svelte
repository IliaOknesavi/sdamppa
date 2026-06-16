<script lang="ts">
	// Order-statistics tree: BST augmented with subtree size in each node.
	// Two queries animated step-by-step on the descent / ascent path:
	//   OS-Select(i): find the i-th smallest key. At each node compute
	//                 r = size(left) + 1; i == r → found, i < r → left,
	//                 i > r → right with i := i − r.
	//   OS-Rank(x):   rank of node x = its position in sorted order. Start
	//                 r = size(left)+1, then climb to root: each time we come
	//                 up from a right child, r += size(parent.left) + 1.
	// Pure SVG/HTML, no deps, Svelte 5 runes, self-contained demo tree.

	type Node = {
		id: number;
		key: number;
		x: number;
		y: number;
		size: number; // subtree size (augmentation)
		left: number | null;
		right: number | null;
		parent: number | null;
	};

	// Balanced demo tree of 9 keys. size = nodes in subtree (incl. self).
	//                 26(9)
	//          17(5)        41(3)
	//      9(2)   21(2)  30(1)  47(1)
	//    4(1)    19(1)
	const nodes: Node[] = [
		{ id: 0, key: 26, x: 210, y: 40,  size: 9, left: 1, right: 2, parent: null },
		{ id: 1, key: 17, x: 110, y: 95,  size: 5, left: 3, right: 4, parent: 0 },
		{ id: 2, key: 41, x: 310, y: 95,  size: 3, left: 6, right: 7, parent: 0 },
		{ id: 3, key: 9,  x: 60,  y: 160, size: 2, left: 5, right: null, parent: 1 },
		{ id: 4, key: 21, x: 160, y: 160, size: 2, left: 8, right: null, parent: 1 },
		{ id: 5, key: 4,  x: 35,  y: 225, size: 1, left: null, right: null, parent: 3 },
		{ id: 6, key: 30, x: 265, y: 160, size: 1, left: null, right: null, parent: 2 },
		{ id: 7, key: 47, x: 360, y: 160, size: 1, left: null, right: null, parent: 2 },
		{ id: 8, key: 19, x: 135, y: 225, size: 1, left: null, right: null, parent: 4 }
	];
	const byId = (id: number) => nodes[id];
	const sizeOf = (id: number | null) => (id === null ? 0 : byId(id).size);

	// sorted keys → index map for the select dropdown labels
	const sorted = [...nodes].sort((a, b) => a.key - b.key);

	type Step = {
		node: number; // node currently examined
		r: number; // rank computed at this node (= left.size + 1, local)
		iLocal?: number; // remaining i for OS-Select at this node
		dir: 'found' | 'left' | 'right' | 'up' | 'start';
		note: string;
	};

	function buildSelect(target: number): Step[] {
		const steps: Step[] = [];
		let cur: number | null = 0;
		let i = target;
		while (cur !== null) {
			const node = byId(cur);
			const r = sizeOf(node.left) + 1;
			if (i === r) {
				steps.push({
					node: cur, r, iLocal: i, dir: 'found',
					note: `i = r = ${r}: нашли! Ключ ${node.key} — это ${target}-я статистика.`
				});
				break;
			} else if (i < r) {
				steps.push({
					node: cur, r, iLocal: i, dir: 'left',
					note: `i = ${i} < r = ${r}: цель левее → идём в левое поддерево.`
				});
				cur = node.left;
			} else {
				steps.push({
					node: cur, r, iLocal: i, dir: 'right',
					note: `i = ${i} > r = ${r}: пропускаем левое + узел, i := ${i} − ${r} = ${i - r}, идём вправо.`
				});
				i = i - r;
				cur = node.right;
			}
		}
		return steps;
	}

	function buildRank(targetNode: number): Step[] {
		const steps: Step[] = [];
		const start = byId(targetNode);
		let r = sizeOf(start.left) + 1;
		steps.push({
			node: targetNode, r, dir: 'start',
			note: `Старт: r = size(left)+1 = ${sizeOf(start.left)}+1 = ${r} (ранг внутри своего поддерева).`
		});
		let cur = targetNode;
		while (byId(cur).parent !== null) {
			const p = byId(cur).parent!;
			const parent = byId(p);
			if (parent.right === cur) {
				const add = sizeOf(parent.left) + 1;
				r = r + add;
				steps.push({
					node: p, r, dir: 'up',
					note: `${byId(cur).key} — правый ребёнок ${parent.key}: r += size(left ${parent.key})+1 = ${add}, r = ${r}.`
				});
			} else {
				steps.push({
					node: p, r, dir: 'up',
					note: `${byId(cur).key} — левый ребёнок ${parent.key}: ранг не растёт, поднимаемся.`
				});
			}
			cur = p;
		}
		steps.push({
			node: 0, r, dir: 'found',
			note: `Дошли до корня. Итог: ранг ключа ${start.key} = ${r}.`
		});
		return steps;
	}

	let mode = $state<'select' | 'rank'>('select');
	let selectI = $state(4); // which order statistic
	let rankNode = $state(8); // which node id to rank (key 19)
	let idx = $state(0);
	let playing = $state(false);

	const steps = $derived(
		mode === 'select' ? buildSelect(selectI) : buildRank(rankNode)
	);
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// path of nodes visited up to and including current step
	const pathSet = $derived(new Set(steps.slice(0, idx + 1).map((s) => s.node)));

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
		}, 850);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setMode(m: 'select' | 'rank') {
		mode = m;
		reset();
	}
	function setI(v: number) {
		selectI = v;
		reset();
	}
	function setRank(v: number) {
		rankNode = v;
		reset();
	}

	function nodeState(id: number): string {
		if (cur.node === id) return cur.dir === 'found' ? 'found' : 'current';
		if (pathSet.has(id)) return 'path';
		return 'idle';
	}
	function edgeActive(parentId: number, childId: number): boolean {
		// edge highlighted when both ends are on the visited path
		return pathSet.has(parentId) && pathSet.has(childId);
	}
	const edges = $derived(
		nodes.flatMap((n) => {
			const e: [number, number][] = [];
			if (n.left !== null) e.push([n.id, n.left]);
			if (n.right !== null) e.push([n.id, n.right]);
			return e;
		})
	);
</script>

<div class="os">
	<div class="os__bar">
		<div class="seg">
			<button class:on={mode === 'select'} onclick={() => setMode('select')}>OS-Select(i)</button>
			<button class:on={mode === 'rank'} onclick={() => setMode('rank')}>OS-Rank(x)</button>
		</div>

		{#if mode === 'select'}
			<label class="pick">
				<span>i =</span>
				<select value={selectI} onchange={(e) => setI(+e.currentTarget.value)}>
					{#each Array(9) as _, k}
						<option value={k + 1}>{k + 1} → ключ {sorted[k].key}</option>
					{/each}
				</select>
			</label>
		{:else}
			<label class="pick">
				<span>x =</span>
				<select value={rankNode} onchange={(e) => setRank(+e.currentTarget.value)}>
					{#each sorted as s}
						<option value={s.id}>ключ {s.key}</option>
					{/each}
				</select>
			</label>
		{/if}

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

	<div class="os__body">
		<svg viewBox="0 0 420 290" class="os__svg">
			{#each edges as [a, b]}
				<line
					x1={byId(a).x} y1={byId(a).y} x2={byId(b).x} y2={byId(b).y}
					class="edge" class:active={edgeActive(a, b)}
				/>
			{/each}
			{#each nodes as n}
				<g class="node {nodeState(n.id)}">
					<circle cx={n.x} cy={n.y} r="19" />
					<text class="key" x={n.x} y={n.y} dy="0.32em">{n.key}</text>
					<g class="sizeTag">
						<rect x={n.x + 9} y={n.y - 26} width="20" height="15" rx="4" />
						<text x={n.x + 19} y={n.y - 18} dy="0.32em">{n.size}</text>
					</g>
				</g>
			{/each}
		</svg>

		<div class="os__panel">
			<div class="legend">
				<span class="lg"><i class="dot key"></i>ключ</span>
				<span class="lg"><i class="dot sz"></i>size = размер поддерева</span>
			</div>

			<div class="trace">
				<span class="lbl">Состояние</span>
				{#if mode === 'select'}
					<div class="kv"><span>цель i</span><b>{selectI}</b></div>
					<div class="kv"><span>узел</span><b>{byId(cur.node).key}</b></div>
					<div class="kv"><span>r = size(left)+1</span><b>{cur.r}</b></div>
					<div class="kv"><span>i на узле</span><b>{cur.iLocal ?? '—'}</b></div>
				{:else}
					<div class="kv"><span>узел x</span><b>{byId(rankNode).key}</b></div>
					<div class="kv"><span>сейчас в</span><b>{byId(cur.node).key}</b></div>
					<div class="kv"><span>ранг r</span><b>{cur.r}</b></div>
				{/if}
			</div>

			<div class="note">{cur.note}</div>
		</div>
	</div>

	<div class="os__formula">
		{#if mode === 'select'}
			<code>r ← size(x.left) + 1</code> · если <code>i = r</code> → найдено · <code>i &lt; r</code> → влево · <code>i &gt; r</code> → вправо, <code>i ← i − r</code>
		{:else}
			<code>r ← size(x.left) + 1</code> · поднимаясь к корню: если пришли из правого ребёнка, <code>r ← r + size(parent.left) + 1</code>
		{/if}
	</div>
</div>

<style>
	.os {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.os__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.7rem;
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
		padding: 0.4rem 0.7rem;
		border: none;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
	}
	.seg button.on {
		background: var(--blue);
		color: #fff;
	}
	.pick {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
	}
	.pick select {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		padding: 0.28rem 0.4rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
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
	.os__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.os__svg {
		flex: 1 1 340px;
		min-width: 290px;
		max-width: 480px;
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
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node .key {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.92rem;
		fill: var(--color-parch-100);
	}
	.node .sizeTag rect {
		fill: var(--color-ink-800);
		stroke: var(--blue);
		stroke-width: 1.2;
	}
	.node .sizeTag text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.6rem;
		fill: var(--blue);
	}
	.node.path circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.current circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.current .key {
		fill: #fff;
	}
	.node.found circle {
		fill: var(--blue);
		stroke: #fff;
		stroke-width: 4;
	}
	.node.found .key {
		fill: #fff;
	}
	.os__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}
	.lg {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		display: inline-block;
	}
	.dot.key {
		background: var(--color-parch-100);
	}
	.dot.sz {
		background: var(--blue);
	}
	.trace {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.kv {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 0.78rem;
		padding: 0.18rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.kv span {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
	}
	.kv b {
		color: var(--color-parch-100);
		font-family: var(--font-display);
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
	.os__formula {
		padding: 0.6rem 1rem 0.8rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		font-size: 0.74rem;
		color: var(--color-parch-200);
		line-height: 1.5;
	}
	.os__formula code {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--blue);
	}
</style>
