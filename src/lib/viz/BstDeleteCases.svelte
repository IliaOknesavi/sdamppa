<script lang="ts">
	// Interactive BST deletion: three cases — leaf, one child, two children.
	// Two-children uses inorder successor (min of right subtree) via TRANSPLANT,
	// highlighting the transplanted subtree. Pick a node, step the case, reset.
	// Pure SVG, no deps; same visual language as GraphTraversal / GraphTypes.
	type Node = { key: number; x: number; y: number; left: number; right: number; parent: number };

	// Fixed BST layout (id = index). −1 means "нет ребёнка".
	//            50
	//      ┌──────┴──────┐
	//     30            70
	//   ┌──┴──┐       ┌──┴──┐
	//  20    40      60    80
	//                       └──┐
	//                          90
	const BASE: Node[] = [
		{ key: 50, x: 210, y: 40, left: 1, right: 2, parent: -1 }, // 0
		{ key: 30, x: 110, y: 105, left: 3, right: 4, parent: 0 }, // 1
		{ key: 70, x: 310, y: 105, left: 5, right: 6, parent: 0 }, // 2
		{ key: 20, x: 60, y: 175, left: -1, right: -1, parent: 1 }, // 3
		{ key: 40, x: 160, y: 175, left: -1, right: -1, parent: 1 }, // 4
		{ key: 60, x: 260, y: 175, left: -1, right: -1, parent: 2 }, // 5
		{ key: 80, x: 360, y: 175, left: -1, right: 7, parent: 2 }, // 6
		{ key: 90, x: 390, y: 245, left: -1, right: -1, parent: 6 } // 7
	];

	type Phase = {
		// snapshot of tree links/positions at this phase
		tree: Node[];
		root: number;
		caseLabel: string;
		note: string;
		// node currently being deleted
		target: number;
		// inorder successor for the two-children case (or -1)
		succ: number;
		// node + subtree being transplanted (highlighted), or -1
		transRoot: number;
		// edge being rewired: [parent, child] in absolute coords, or null
		moveEdge: [number, number] | null;
		removed: Set<number>;
		done: boolean;
	};

	function cloneTree(t: Node[]): Node[] {
		return t.map((n) => ({ ...n }));
	}

	function which(t: Node[], target: number): 'leaf' | 'one' | 'two' {
		const n = t[target];
		const hasL = n.left !== -1;
		const hasR = n.right !== -1;
		if (hasL && hasR) return 'two';
		if (hasL || hasR) return 'one';
		return 'leaf';
	}

	const caseName = (k: 'leaf' | 'one' | 'two') =>
		k === 'leaf' ? 'Лист (нет детей)' : k === 'one' ? 'Один ребёнок' : 'Два ребёнка';

	// Build the phase-by-phase deletion of `target` over a fresh BASE.
	function buildPhases(target: number): Phase[] {
		const t0 = cloneTree(BASE);
		const root = 0;
		const kind = which(t0, target);
		const phases: Phase[] = [];

		// Phase 0 — selection / classification (common to all cases).
		phases.push({
			tree: cloneTree(t0),
			root,
			caseLabel: caseName(kind),
			note: `Удаляем ключ ${t0[target].key}. Случай: ${caseName(kind)}.`,
			target,
			succ: kind === 'two' ? subtreeMin(t0, t0[target].right) : -1,
			transRoot: -1,
			moveEdge: null,
			removed: new Set(),
			done: false
		});

		if (kind === 'leaf') {
			// Case 1: just detach the leaf from its parent.
			const t = cloneTree(t0);
			detach(t, target);
			phases.push({
				tree: t,
				root,
				caseLabel: caseName(kind),
				note: `У ${BASE[target].key} нет детей — просто отцепляем его от родителя ${parentKey(target)}.`,
				target,
				succ: -1,
				transRoot: -1,
				moveEdge: null,
				removed: new Set([target]),
				done: true
			});
			return phases;
		}

		if (kind === 'one') {
			// Case 2: replace node by its single child (TRANSPLANT(z, child)).
			const child = t0[target].left !== -1 ? t0[target].left : t0[target].right;
			// Highlight the child subtree to be lifted.
			phases.push({
				tree: cloneTree(t0),
				root,
				caseLabel: caseName(kind),
				note: `Единственное поддерево с корнем ${t0[child].key} поднимется на место ${t0[target].key}. TRANSPLANT(${t0[target].key}, ${t0[child].key}).`,
				target,
				succ: -1,
				transRoot: child,
				moveEdge: null,
				removed: new Set(),
				done: false
			});
			const t = cloneTree(t0);
			transplant(t, root, target, child);
			phases.push({
				tree: t,
				root: target === root ? child : root,
				caseLabel: caseName(kind),
				note: `Готово: ${t0[child].key} занял место ${t0[target].key}, связь с родителем перевешена.`,
				target,
				succ: -1,
				transRoot: child,
				moveEdge: null,
				removed: new Set([target]),
				done: true
			});
			return phases;
		}

		// Case 3: two children. y = inorder successor = min of right subtree.
		const z = target;
		const y = subtreeMin(t0, t0[z].right);

		// Phase A — point out the successor.
		phases.push({
			tree: cloneTree(t0),
			root,
			caseLabel: caseName(kind),
			note: `Преемник = минимум правого поддерева: спускаемся влево до упора → ключ ${t0[y].key}.`,
			target: z,
			succ: y,
			transRoot: -1,
			moveEdge: null,
			removed: new Set(),
			done: false
		});

		// If y is not z's direct right child, first transplant y by its right child,
		// then attach z's right subtree under y. (CLR TREE-DELETE.)
		const yIsDirectRight = t0[z].right === y;

		if (!yIsDirectRight) {
			// Phase B1 — TRANSPLANT(y, y.right): pull y out of its spot.
			const yr = t0[y].right; // may be -1
			phases.push({
				tree: cloneTree(t0),
				root,
				caseLabel: caseName(kind),
				note: `Преемник ${t0[y].key} вложен глубже. Сначала TRANSPLANT(${t0[y].key}, ${yr === -1 ? 'NIL' : t0[yr].key}) — на его место встаёт правое поддерево.`,
				target: z,
				succ: y,
				transRoot: yr === -1 ? -1 : yr,
				moveEdge: null,
				removed: new Set(),
				done: false
			});
			const tB = cloneTree(t0);
			transplant(tB, root, y, yr);
			// y now takes z's right subtree.
			tB[y].right = tB[z].right;
			if (tB[z].right !== -1) tB[tB[z].right].parent = y;
			// reposition y to z's old spot's right-child slot for the next phase
			phases.push({
				tree: tB,
				root,
				caseLabel: caseName(kind),
				note: `Правое поддерево ${t0[z].key} перевешиваем под ${t0[y].key}: теперь ${t0[y].key}.right = ${rightKey(t0, z)}.`,
				target: z,
				succ: y,
				transRoot: tB[z].right === -1 ? -1 : tB[z].right,
				moveEdge: null,
				removed: new Set(),
				done: false
			});
			// Phase C — TRANSPLANT(z, y): y replaces z, inherits z's left subtree.
			const tC = cloneTree(tB);
			transplant(tC, root, z, y);
			tC[y].left = tC[z].left;
			if (tC[z].left !== -1) tC[tC[z].left].parent = y;
			relayout(tC, tC[z].parent === -1 ? y : root, z, y);
			phases.push({
				tree: tC,
				root: z === root ? y : root,
				caseLabel: caseName(kind),
				note: `TRANSPLANT(${t0[z].key}, ${t0[y].key}): ${t0[y].key} встаёт на место ${t0[z].key} и забирает левое поддерево (${leftKey(t0, z)}). Свойство BST сохранено.`,
				target: z,
				succ: y,
				transRoot: y,
				moveEdge: null,
				removed: new Set([z]),
				done: true
			});
			return phases;
		}

		// y is the direct right child of z.
		// Phase C — TRANSPLANT(z, y): y replaces z, inherits z's left subtree.
		const tC = cloneTree(t0);
		transplant(tC, root, z, y);
		tC[y].left = tC[z].left;
		if (tC[z].left !== -1) tC[tC[z].left].parent = y;
		relayout(tC, z === root ? y : root, z, y);
		phases.push({
			tree: cloneTree(t0),
			root,
			caseLabel: caseName(kind),
			note: `Преемник ${t0[y].key} — это прямой правый ребёнок ${t0[z].key}. Поднимаем его сразу: TRANSPLANT(${t0[z].key}, ${t0[y].key}).`,
			target: z,
			succ: y,
			transRoot: y,
			moveEdge: null,
			removed: new Set(),
			done: false
		});
		phases.push({
			tree: tC,
			root: z === root ? y : root,
			caseLabel: caseName(kind),
			note: `${t0[y].key} забирает левое поддерево ${t0[z].key} (${leftKey(t0, z)}); правое остаётся при нём. BST в порядке.`,
			target: z,
			succ: y,
			transRoot: y,
			moveEdge: null,
			removed: new Set([z]),
			done: true
		});
		return phases;
	}

	// --- tree helpers (operate on a cloned array; ids are stable indices) ---
	function subtreeMin(t: Node[], start: number): number {
		let cur = start;
		while (t[cur].left !== -1) cur = t[cur].left;
		return cur;
	}
	function detach(t: Node[], id: number) {
		const p = t[id].parent;
		if (p === -1) return;
		if (t[p].left === id) t[p].left = -1;
		else if (t[p].right === id) t[p].right = -1;
		t[id].parent = -1;
	}
	// Replace subtree rooted at u with subtree rooted at v (v may be -1).
	function transplant(t: Node[], root: number, u: number, v: number) {
		const p = t[u].parent;
		if (p === -1) {
			// u is root → v becomes root
		} else if (t[p].left === u) {
			t[p].left = v;
		} else {
			t[p].right = v;
		}
		if (v !== -1) t[v].parent = p;
	}
	const parentKey = (id: number) => {
		const p = BASE[id].parent;
		return p === -1 ? 'корня' : BASE[p].key;
	};
	const rightKey = (t: Node[], id: number) => (t[id].right === -1 ? 'NIL' : t[t[id].right].key);
	const leftKey = (t: Node[], id: number) => (t[id].left === -1 ? 'NIL' : t[t[id].left].key);

	// After a successor replaces z, snap y (and the lifted subtree) into z's
	// screen position so the final picture reads cleanly. We translate the whole
	// subtree rooted at `y` by the delta between z's slot and y's old slot.
	function relayout(t: Node[], root: number, z: number, y: number) {
		const dx = BASE[z].x - t[y].x;
		const dy = BASE[z].y - t[y].y;
		const stack = [y];
		while (stack.length) {
			const id = stack.pop()!;
			t[id].x += dx;
			t[id].y += dy;
			if (t[id].left !== -1) stack.push(t[id].left);
			if (t[id].right !== -1) stack.push(t[id].right);
		}
	}

	// Set of ids reachable from a root (to draw only live nodes).
	function liveSet(t: Node[], root: number): Set<number> {
		const live = new Set<number>();
		const stack = [root];
		while (stack.length) {
			const id = stack.pop()!;
			if (id === -1 || live.has(id)) continue;
			live.add(id);
			stack.push(t[id].left, t[id].right);
		}
		return live;
	}
	// Ids of the subtree rooted at `id` (for transplant highlight).
	function subtreeSet(t: Node[], id: number): Set<number> {
		const s = new Set<number>();
		if (id === -1) return s;
		const stack = [id];
		while (stack.length) {
			const k = stack.pop()!;
			if (k === -1 || s.has(k)) continue;
			s.add(k);
			stack.push(t[k].left, t[k].right);
		}
		return s;
	}

	// Selectable deletion targets, one per case (+ a deep two-children one).
	const TARGETS = [
		{ id: 3, label: '20 — лист' },
		{ id: 6, label: '80 — 1 ребёнок' },
		{ id: 1, label: '30 — 2 ребёнка (прямой)' },
		{ id: 0, label: '50 — 2 ребёнка (глубокий)' }
	];

	let targetId = $state(0);
	let idx = $state(0);
	let playing = $state(false);

	const phases = $derived(buildPhases(targetId));
	const ph = $derived(phases[Math.min(idx, phases.length - 1)]);
	const live = $derived(liveSet(ph.tree, ph.root));
	const transSet = $derived(subtreeSet(ph.tree, ph.transRoot));

	type Link = { a: number; b: number };
	const links = $derived(
		(() => {
			const out: Link[] = [];
			for (const id of live) {
				const n = ph.tree[id];
				if (n.left !== -1 && live.has(n.left)) out.push({ a: id, b: n.left });
				if (n.right !== -1 && live.has(n.right)) out.push({ a: id, b: n.right });
			}
			return out;
		})()
	);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= phases.length - 1) {
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
	function pick(id: number) {
		targetId = id;
		reset();
	}

	function nodeClass(id: number): string {
		if (ph.removed.has(id)) return 'removed';
		if (id === ph.succ) return 'succ';
		if (id === ph.target && !ph.done) return 'target';
		if (transSet.has(id)) return 'trans';
		return 'idle';
	}
	function linkClass(l: Link): boolean {
		return transSet.has(l.a) && transSet.has(l.b);
	}
</script>

<div class="bd">
	<div class="bd__bar">
		<div class="seg">
			{#each TARGETS as t}
				<button class:on={targetId === t.id} onclick={() => pick(t.id)}>{t.label}</button>
			{/each}
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(phases.length - 1, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{phases.length - 1}</span>
		</div>
	</div>

	<div class="bd__body">
		<svg viewBox="0 0 420 290" class="bd__svg">
			{#each links as l}
				<line
					x1={ph.tree[l.a].x} y1={ph.tree[l.a].y}
					x2={ph.tree[l.b].x} y2={ph.tree[l.b].y}
					class="edge" class:trans={linkClass(l)}
				/>
			{/each}
			{#each [...live] as id}
				<g class="node {nodeClass(id)}" style="transform: translate({ph.tree[id].x}px, {ph.tree[id].y}px)">
					<circle r="19" />
					<text dy="0.34em">{ph.tree[id].key}</text>
				</g>
			{/each}
		</svg>

		<div class="bd__panel">
			<div class="props">
				<div class="prop"><span>удаляем</span><b>{BASE[targetId].key}</b></div>
				<div class="prop"><span>случай</span><b class="case">{ph.caseLabel}</b></div>
				{#if ph.succ !== -1}
					<div class="prop"><span>преемник</span><b class="succ-k">{ph.tree[ph.succ].key}</b></div>
				{/if}
			</div>

			<div class="legend">
				<div class="lg"><i class="sw target"></i>удаляемый z</div>
				<div class="lg"><i class="sw succ"></i>преемник (min справа)</div>
				<div class="lg"><i class="sw trans"></i>пересаживаемое поддерево</div>
			</div>

			<div class="note">{ph.note}</div>
		</div>
	</div>
</div>

<style>
	.bd {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.bd__bar {
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
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		padding: 0.32rem 0.6rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.seg button.on {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
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
	.bd__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.bd__svg {
		flex: 1 1 330px;
		min-width: 280px;
		max-width: 470px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.25s, stroke-width 0.25s;
	}
	.edge.trans {
		stroke: var(--blue);
		stroke-width: 3.5;
	}
	.node {
		transition: transform 0.45s ease;
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.25s, stroke 0.25s, opacity 0.3s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.92rem;
		fill: var(--color-parch-100);
		transition: fill 0.25s;
	}
	.node.trans circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.succ circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	.node.succ text {
		fill: #fff;
	}
	.node.target circle {
		fill: var(--color-ink-850);
		stroke: var(--blue);
		stroke-width: 4;
		stroke-dasharray: 4 3;
	}
	.node.target text {
		fill: var(--blue);
	}
	.node.removed circle {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-dasharray: 3 3;
		opacity: 0.4;
	}
	.node.removed text {
		fill: var(--color-parch-muted);
		opacity: 0.5;
	}
	.bd__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.props {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
	}
	.prop {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 0.78rem;
		padding: 0.2rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.prop span {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.prop b {
		color: var(--color-parch-100);
		font-family: var(--font-display);
	}
	.prop b.case {
		color: var(--blue);
	}
	.prop b.succ-k {
		color: var(--blue);
	}
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.lg {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.68rem;
		color: var(--color-parch-200);
		font-family: var(--font-mono);
	}
	.sw {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		flex: none;
	}
	.sw.target {
		border: 2px dashed var(--blue);
		background: var(--color-ink-850);
	}
	.sw.succ {
		background: var(--blue);
		border: 2px solid var(--color-parch-100);
	}
	.sw.trans {
		background: var(--blue-pale);
		border: 2px solid var(--blue);
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
</style>
