<script lang="ts">
	// Interactive BST rotation around node x (left/right). The pivot's child y
	// rises into x's place, and the "middle" subtree is rehung — exactly the move
	// that keeps a BST/AVL/RB-tree balanced. Inorder order is preserved and shown
	// as a strip; the three relinked edges are highlighted. Pure SVG, no deps,
	// same visual language as GraphTraversal / GraphTypes.
	type Node = {
		key: number;
		left: number | null; // index into nodes[]
		right: number | null;
	};

	// Demo tree. Keys are a valid BST; structure lets us rotate around several
	// pivots so both directions stay meaningful.
	//
	//            (4)
	//           /   \
	//        (2)     (6)
	//        / \     / \
	//      (1) (3) (5) (7)
	//
	// Right-rotate around 4 needs left child (2) with subtrees A=(1), B=(3), C=(6..).
	// Left-rotate around 4 needs right child (6) with subtrees A=(2..), B=(5), C=(7).
	const base: Node[] = [
		{ key: 4, left: 1, right: 2 }, // 0  корень
		{ key: 2, left: 3, right: 4 }, // 1
		{ key: 6, left: 5, right: 6 }, // 2
		{ key: 1, left: null, right: null }, // 3
		{ key: 3, left: null, right: null }, // 4
		{ key: 5, left: null, right: null }, // 5
		{ key: 7, left: null, right: null } // 6
	];

	const KEY = base.map((n) => n.key);
	const ROOT = 0;

	type Tree = { nodes: Node[]; root: number };

	function clone(t: Tree): Tree {
		return { nodes: t.nodes.map((n) => ({ ...n })), root: t.root };
	}

	function parentOf(t: Tree, child: number): number | null {
		for (let i = 0; i < t.nodes.length; i++) {
			if (t.nodes[i].left === child || t.nodes[i].right === child) return i;
		}
		return null;
	}

	// inorder sequence of node-indices (BST → keys ascending)
	function inorder(t: Tree): number[] {
		const out: number[] = [];
		const walk = (i: number | null) => {
			if (i === null) return;
			walk(t.nodes[i].left);
			out.push(i);
			walk(t.nodes[i].right);
		};
		walk(t.root);
		return out;
	}

	type RotInfo = {
		ok: boolean;
		reason: string;
		// the three relinked edges, by node index (parent → child), on the AFTER tree
		links: [number, number][];
		// node that rose, node that descended, middle subtree root (or null)
		y: number;
		x: number;
		mid: number | null;
	};

	// Right rotation around x: x.left = y must exist.
	// y rises, x becomes y.right, y.right (B) becomes x.left.
	function rotateRight(t: Tree, x: number): { tree: Tree; info: RotInfo } {
		const nt = clone(t);
		const y = nt.nodes[x].left;
		if (y === null) {
			return {
				tree: t,
				info: { ok: false, reason: `у узла ${KEY[x]} нет левого ребёнка — правый поворот невозможен`, links: [], y: -1, x, mid: null }
			};
		}
		const p = parentOf(nt, x);
		const B = nt.nodes[y].right; // среднее поддерево

		nt.nodes[x].left = B;
		nt.nodes[y].right = x;
		if (p === null) nt.root = y;
		else if (nt.nodes[p].left === x) nt.nodes[p].left = y;
		else nt.nodes[p].right = y;

		const links: [number, number][] = [[y, x]]; // y → x (новая)
		if (B !== null) links.push([x, B]); // x → B (перевешено)
		if (p !== null) links.push([p, y]); // p → y (наверх)
		return {
			tree: nt,
			info: { ok: true, reason: `${KEY[y]} поднялся, ${KEY[x]} опустился вправо; среднее поддерево ${B === null ? '—' : KEY[B]} перевешено к ${KEY[x]}`, links, y, x, mid: B }
		};
	}

	// Left rotation around x: x.right = y must exist.
	// y rises, x becomes y.left, y.left (B) becomes x.right.
	function rotateLeft(t: Tree, x: number): { tree: Tree; info: RotInfo } {
		const nt = clone(t);
		const y = nt.nodes[x].right;
		if (y === null) {
			return {
				tree: t,
				info: { ok: false, reason: `у узла ${KEY[x]} нет правого ребёнка — левый поворот невозможен`, links: [], y: -1, x, mid: null }
			};
		}
		const p = parentOf(nt, x);
		const B = nt.nodes[y].left;

		nt.nodes[x].right = B;
		nt.nodes[y].left = x;
		if (p === null) nt.root = y;
		else if (nt.nodes[p].left === x) nt.nodes[p].left = y;
		else nt.nodes[p].right = y;

		const links: [number, number][] = [[y, x]];
		if (B !== null) links.push([x, B]);
		if (p !== null) links.push([p, y]);
		return {
			tree: nt,
			info: { ok: true, reason: `${KEY[y]} поднялся, ${KEY[x]} опустился влево; среднее поддерево ${B === null ? '—' : KEY[B]} перевешено к ${KEY[x]}`, links, y, x, mid: B }
		};
	}

	// ── layout: x by inorder rank (keeps inorder visually left→right), y by depth ──
	const VB_W = 420;
	const VB_H = 290;
	const PAD_X = 34;
	const TOP = 30;
	const ROW = 62;

	function depths(t: Tree): Map<number, number> {
		const d = new Map<number, number>();
		const walk = (i: number | null, lvl: number) => {
			if (i === null) return;
			d.set(i, lvl);
			walk(t.nodes[i].left, lvl + 1);
			walk(t.nodes[i].right, lvl + 1);
		};
		walk(t.root, 0);
		return d;
	}

	function layout(t: Tree): Map<number, { x: number; y: number }> {
		const ord = inorder(t);
		const dep = depths(t);
		const n = ord.length;
		const span = VB_W - 2 * PAD_X;
		const pos = new Map<number, { x: number; y: number }>();
		ord.forEach((idx, rank) => {
			const x = n === 1 ? VB_W / 2 : PAD_X + (span * rank) / (n - 1);
			const y = TOP + (dep.get(idx) ?? 0) * ROW;
			pos.set(idx, { x, y });
		});
		return pos;
	}

	// ── state ──
	let tree = $state<Tree>(clone({ nodes: base, root: ROOT }));
	let pivot = $state<number>(ROOT); // выбранный узел x
	let last = $state<RotInfo | null>(null); // подсветка последнего поворота
	let phase = $state<'before' | 'after'>('before');

	const pos = $derived(layout(tree));
	const ord = $derived(inorder(tree));
	const dep = $derived(depths(tree));

	// edges of the *current* tree as [parent, child]
	const edgeList = $derived.by(() => {
		const out: [number, number][] = [];
		for (let i = 0; i < tree.nodes.length; i++) {
			if (!dep.has(i)) continue; // unreachable node, skip
			const { left, right } = tree.nodes[i];
			if (left !== null) out.push([i, left]);
			if (right !== null) out.push([i, right]);
		}
		return out;
	});

	const highlighted = $derived(new Set((last?.links ?? []).map(([a, b]) => `${a}-${b}`)));

	function canRotate(dir: 'left' | 'right'): boolean {
		const c = dir === 'right' ? tree.nodes[pivot].left : tree.nodes[pivot].right;
		return c !== null;
	}

	function doRotate(dir: 'left' | 'right') {
		const r = dir === 'right' ? rotateRight(tree, pivot) : rotateLeft(tree, pivot);
		if (!r.info.ok) {
			last = r.info;
			phase = 'before';
			return;
		}
		tree = r.tree;
		last = r.info;
		pivot = r.info.y; // y теперь на месте x — удобно крутить обратно
		phase = 'after';
	}

	function reset() {
		tree = clone({ nodes: base, root: ROOT });
		pivot = ROOT;
		last = null;
		phase = 'before';
	}

	function selectNode(i: number) {
		pivot = i;
		last = null;
		phase = 'before';
	}

	function nodeClass(i: number): string {
		if (last?.ok) {
			if (i === last.y) return 'rose';
			if (i === last.x) return 'sank';
			if (last.mid !== null && i === last.mid) return 'mid';
		}
		if (i === pivot) return 'pivot';
		return 'idle';
	}
</script>

<div class="tr">
	<div class="tr__bar">
		<div class="seg">
			<button onclick={() => doRotate('right')} disabled={!canRotate('right')} title="x.left поднимается">↻ правый поворот</button>
			<button onclick={() => doRotate('left')} disabled={!canRotate('left')} title="x.right поднимается">↺ левый поворот</button>
		</div>
		<div class="ctrl">
			<span class="hint">ось x = <b>{KEY[pivot]}</b></span>
			<button onclick={reset} title="вернуть исходное дерево">сброс</button>
		</div>
	</div>

	<div class="tr__body">
		<svg viewBox="0 0 {VB_W} {VB_H}" class="tr__svg">
			{#each edgeList as [a, b] (a + '-' + b)}
				{@const pa = pos.get(a)}
				{@const pb = pos.get(b)}
				{#if pa && pb}
					<line
						x1={pa.x}
						y1={pa.y}
						x2={pb.x}
						y2={pb.y}
						class="edge"
						class:relinked={highlighted.has(`${a}-${b}`)}
					/>
				{/if}
			{/each}

			{#each ord as i (i)}
				{@const p = pos.get(i)}
				{#if p}
					<g
						class="node {nodeClass(i)}"
						style="transform: translate({p.x}px, {p.y}px)"
						onclick={() => selectNode(i)}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(i)}
						role="button"
						tabindex="0"
					>
						<circle r="17" />
						<text dy="0.34em">{KEY[i]}</text>
					</g>
				{/if}
			{/each}
		</svg>

		<div class="tr__panel">
			<div class="leg">
				<span class="dot rose"></span> поднялся (y)
				<span class="dot sank"></span> опустился (x)
				<span class="dot mid"></span> среднее поддерево
			</div>

			<div class="row">
				<span class="lbl">inorder (порядок сохраняется)</span>
				<div class="chips">
					{#each ord as i (i)}<span class="chip">{KEY[i]}</span>{/each}
				</div>
			</div>

			<div class="row">
				<span class="lbl">состояние</span>
				<span class="phase" class:on={phase === 'after'}>{phase === 'after' ? 'после поворота' : 'до поворота'}</span>
			</div>

			<div class="note" class:bad={last !== null && !last.ok}>
				{#if last === null}
					Кликни узел, чтобы выбрать ось <b>x</b>. Левый поворот тянет наверх правого ребёнка, правый — левого. Inorder-последовательность ключей не меняется.
				{:else}
					{last.reason}.
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.tr {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.tr__bar {
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
		gap: 0.4rem;
		flex-wrap: wrap;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.76rem;
		padding: 0.4rem 0.75rem;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover:not(:disabled) {
		background: var(--blue);
		color: #fff;
	}
	.seg button:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		border-color: var(--color-ink-500);
		color: var(--color-parch-muted);
	}
	.ctrl {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	.hint {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
	}
	.hint b {
		color: var(--blue);
		font-size: 0.82rem;
	}
	.ctrl button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		padding: 0.36rem 0.7rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
	}
	.ctrl button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.tr__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.tr__svg {
		flex: 1 1 340px;
		min-width: 280px;
		max-width: 480px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.35s, stroke-width 0.35s;
	}
	.edge.relinked {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.node {
		cursor: pointer;
		transition: transform 0.42s ease;
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.3s, stroke 0.3s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.92rem;
		fill: var(--color-parch-100);
		pointer-events: none;
	}
	.node:hover circle {
		stroke: var(--blue);
	}
	.node.pivot circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 3.5;
	}
	.node.rose circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	.node.rose text {
		fill: #fff;
	}
	.node.sank circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.mid circle {
		fill: var(--color-ink-850);
		stroke: var(--blue);
		stroke-width: 3.5;
		stroke-dasharray: 4 3;
	}
	.tr__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.leg {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.3rem 0.55rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
	}
	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		display: inline-block;
		vertical-align: middle;
	}
	.dot.rose {
		background: var(--blue);
		border: 2px solid var(--color-parch-100);
	}
	.dot.sank {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.dot.mid {
		background: var(--color-ink-850);
		border: 1.5px dashed var(--blue);
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
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.chip {
		display: grid;
		place-items: center;
		min-width: 1.6rem;
		height: 1.6rem;
		padding: 0 0.35rem;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.78rem;
		background: var(--color-parch-200);
		color: var(--color-ink-850);
	}
	.phase {
		align-self: flex-start;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.76rem;
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		background: var(--color-ink-800);
		color: var(--color-parch-200);
		border: 1.5px solid var(--color-ink-600);
	}
	.phase.on {
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
	.note.bad {
		border-left-color: var(--color-parch-muted);
		color: var(--color-parch-muted);
	}
	.note b {
		color: var(--blue);
	}
</style>
