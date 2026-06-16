<script lang="ts">
	// Пошаговая вставка ключей в бинарное дерево поиска (BST) спуском от корня.
	// Каждый шаг — реальное сравнение нового ключа с узлом (влево/вправо) или
	// прикрепление нового листа. На отсортированном входе дерево вырождается в
	// правую «лесенку» высотой h = N−1; тот же набор в случайном порядке даёт
	// сбалансированное дерево с h ≈ ⌊log₂N⌋. Чистый SVG, без зависимостей.
	type Node = { key: number; left: number | null; right: number | null };
	type Step = {
		tree: Node[]; // снимок узлов после выполнения шага
		root: number | null;
		visit: number | null; // текущий сравниваемый узел
		path: number[]; // пройденный путь спуска
		inserted: number | null; // только что прикреплённый узел
		pending: number | null; // вставляемый ключ (ещё «в руках»)
		note: string;
	};

	const SORTED = [10, 20, 30, 40, 50, 60, 70];
	const RANDOM = [40, 20, 60, 10, 30, 50, 70]; // тот же набор, порядок уровней

	// Прогон алгоритма вставки: собираем кадры спуска и прикрепления.
	function buildSteps(order: number[]): Step[] {
		const nodes: Node[] = [];
		let root: number | null = null;
		const steps: Step[] = [];
		const snap = (): Node[] => nodes.map((n) => ({ ...n }));

		steps.push({
			tree: [], root: null, visit: null, path: [], inserted: null, pending: null,
			note: 'Пустое дерево. Вставляем ключи по очереди.'
		});

		for (const key of order) {
			if (root === null) {
				root = nodes.length;
				nodes.push({ key, left: null, right: null });
				steps.push({
					tree: snap(), root, visit: root, path: [root], inserted: root, pending: null,
					note: `${key} — первый ключ, становится корнем.`
				});
				continue;
			}
			let curr: number = root;
			const path: number[] = [];
			// Спуск: сравниваем ключ с узлом, идём влево/вправо.
			while (true) {
				path.push(curr);
				const nk = nodes[curr].key;
				steps.push({
					tree: snap(), root, visit: curr, path: [...path], inserted: null, pending: key,
					note: key < nk
						? `${key} < ${nk} → идём влево от ${nk}.`
						: `${key} > ${nk} → идём вправо от ${nk}.`
				});
				if (key < nk) {
					if (nodes[curr].left === null) {
						const id = nodes.length;
						nodes.push({ key, left: null, right: null });
						nodes[curr].left = id;
						steps.push({
							tree: snap(), root, visit: curr, path: [...path], inserted: id, pending: null,
							note: `Слева у ${nk} пусто — ${key} становится левым потомком.`
						});
						break;
					}
					curr = nodes[curr].left as number;
				} else {
					if (nodes[curr].right === null) {
						const id = nodes.length;
						nodes.push({ key, left: null, right: null });
						nodes[curr].right = id;
						steps.push({
							tree: snap(), root, visit: curr, path: [...path], inserted: id, pending: null,
							note: `Справа у ${nk} пусто — ${key} становится правым потомком.`
						});
						break;
					}
					curr = nodes[curr].right as number;
				}
			}
		}
		const h = treeHeight(nodes, root);
		steps.push({
			tree: snap(), root, visit: null, path: [], inserted: null, pending: null,
			note: `Готово: ${order.length} ключей, высота h = ${h}.`
		});
		return steps;
	}

	// Высота дерева в рёбрах (одна вершина → 0, пустое → −1).
	function treeHeight(nodes: Node[], root: number | null): number {
		if (root === null) return -1;
		const go = (id: number | null): number => {
			if (id === null) return -1;
			return 1 + Math.max(go(nodes[id].left), go(nodes[id].right));
		};
		return go(root);
	}

	// Раскладка по координатам: x = порядок в in-order обходе (разводит ветви),
	// y = глубина. Так и вырожденная лесенка, и баланс читаются корректно.
	const VB_W = 420;
	const VB_H = 250;
	const MARGIN_X = 30;
	const TOP = 34;
	const ROW = 40;
	function layout(nodes: Node[], root: number | null) {
		const pos: Record<number, { x: number; y: number }> = {};
		if (root === null) return pos;
		let order = 0;
		const count = nodes.length;
		const step = count > 1 ? (VB_W - 2 * MARGIN_X) / (count - 1) : 0;
		const go = (id: number | null, depth: number) => {
			if (id === null) return;
			go(nodes[id].left, depth + 1);
			pos[id] = { x: MARGIN_X + order * step, y: TOP + depth * ROW };
			order += 1;
			go(nodes[id].right, depth + 1);
		};
		go(root, 0);
		return pos;
	}

	let sorted = $state(true);
	let idx = $state(0);
	let playing = $state(false);

	const order = $derived(sorted ? SORTED : RANDOM);
	const steps = $derived(buildSteps(order));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);
	const pos = $derived(layout(cur.tree, cur.root));
	const pathSet = $derived(new Set(cur.path));
	const height = $derived(treeHeight(cur.tree, cur.root));
	const placed = $derived(cur.tree.length);

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
		}, 900);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setSorted(v: boolean) {
		if (v === sorted) return;
		sorted = v;
		reset();
	}

	function nodeState(id: number): string {
		if (cur.inserted === id) return 'inserted';
		if (cur.visit === id) return 'visit';
		if (pathSet.has(id)) return 'path';
		return 'idle';
	}
	// ребро родитель→потомок активно, если оба на текущем пути спуска
	function edgeActive(parent: number, child: number): boolean {
		return pathSet.has(parent) && (pathSet.has(child) || cur.inserted === child);
	}
</script>

<div class="bst">
	<div class="bst__bar">
		<div class="seg">
			<button class:on={sorted} onclick={() => setSorted(true)}>Отсортированный вход</button>
			<button class:on={!sorted} onclick={() => setSorted(false)}>Случайный вход</button>
		</div>
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

	<div class="bst__body">
		<svg viewBox="0 0 {VB_W} {VB_H}" class="bst__svg">
			{#each cur.tree as n, i}
				{#if pos[i]}
					{#if n.left !== null && pos[n.left]}
						<line
							x1={pos[i].x} y1={pos[i].y} x2={pos[n.left].x} y2={pos[n.left].y}
							class="edge" class:active={edgeActive(i, n.left)}
						/>
					{/if}
					{#if n.right !== null && pos[n.right]}
						<line
							x1={pos[i].x} y1={pos[i].y} x2={pos[n.right].x} y2={pos[n.right].y}
							class="edge" class:active={edgeActive(i, n.right)}
						/>
					{/if}
				{/if}
			{/each}
			{#each cur.tree as n, i}
				{#if pos[i]}
					<g class="node {nodeState(i)}">
						<circle cx={pos[i].x} cy={pos[i].y} r="15" />
						<text x={pos[i].x} y={pos[i].y} dy="0.34em">{n.key}</text>
					</g>
				{/if}
			{/each}
			{#if cur.tree.length === 0}
				<text x={VB_W / 2} y={VB_H / 2} class="empty-svg">дерево пусто</text>
			{/if}
		</svg>

		<div class="bst__panel">
			<div class="props">
				<div class="prop"><span>вход</span><b>{sorted ? 'по возрастанию' : 'вперемешку'}</b></div>
				<div class="prop"><span>узлов N</span><b>{placed}</b></div>
				<div class="prop"><span>высота h</span><b>{height < 0 ? '—' : height}</b></div>
				<div class="prop"><span>идеал ⌊log₂N⌋</span><b>{placed > 0 ? Math.floor(Math.log2(placed)) : '—'}</b></div>
			</div>
			<div class="row">
				<span class="lbl">Очередь вставки</span>
				<div class="chips">
					{#each order as k, ki}
						<span
							class="chip"
							class:done={ki < placed - (cur.pending !== null ? 1 : 0)}
							class:active={cur.pending === k}
						>{k}</span>
					{/each}
				</div>
			</div>
			<div class="note">{cur.note}</div>
		</div>
	</div>

	<div class="bst__foot">
		{sorted
			? 'Отсортированный вход: каждый ключ больше предыдущего, поэтому всегда уходит вправо — дерево вырождается в правую лесенку, h = N−1, а поиск деградирует до O(N).'
			: 'Перемешанный порядок ставит корнем «средний» ключ — ветви разводятся, высота держится около log₂N, поиск остаётся O(log N).'}
	</div>
</div>

<style>
	.bst {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.bst__bar {
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
		font-size: 0.74rem;
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
	.bst__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.bst__svg {
		flex: 1 1 320px;
		min-width: 280px;
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
		font-size: 0.82rem;
		fill: var(--color-parch-100);
	}
	.node.path circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.visit circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 4;
	}
	.node.inserted circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.inserted text {
		fill: #fff;
	}
	.empty-svg {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		fill: var(--color-parch-muted);
	}
	.bst__panel {
		flex: 1 1 220px;
		min-width: 200px;
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
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.prop b {
		color: var(--color-parch-100);
		font-family: var(--font-display);
	}
	.row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
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
		min-width: 1.9rem;
		height: 1.7rem;
		padding: 0 0.4rem;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.74rem;
		background: var(--color-ink-800);
		color: var(--color-parch-muted);
		border: 1.5px solid var(--color-ink-600);
	}
	.chip.done {
		background: var(--blue-pale);
		color: var(--blue);
		border-color: var(--blue);
	}
	.chip.active {
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
	.bst__foot {
		padding: 0.8rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		font-size: 0.78rem;
		color: var(--color-parch-200);
	}
</style>
