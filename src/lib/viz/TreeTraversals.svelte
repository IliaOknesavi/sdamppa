<script lang="ts">
	// Обходы двоичного дерева поиска (BST): preorder / inorder / postorder.
	// Пошаговая подсветка узлов в порядке посещения + накапливающаяся
	// выходная последовательность снизу. Акцент: inorder = отсортированный
	// порядок. Step / play / reset. Чистый SVG, без зависимостей.
	type Node = { id: number; key: number; x: number; y: number; left: number | null; right: number | null };

	// Сбалансированное BST из 9 узлов. Координаты подобраны под viewBox 420×290.
	//            50
	//        /        \
	//      30          70
	//     /  \        /  \
	//   20    40    60    80
	//   /          /        \
	//  10        55          90
	const nodes: Node[] = [
		{ id: 0, key: 50, x: 210, y: 36,  left: 1, right: 2 },
		{ id: 1, key: 30, x: 110, y: 92,  left: 3, right: 4 },
		{ id: 2, key: 70, x: 310, y: 92,  left: 5, right: 6 },
		{ id: 3, key: 20, x: 60,  y: 152, left: 7, right: null },
		{ id: 4, key: 40, x: 160, y: 152, left: null, right: null },
		{ id: 5, key: 60, x: 260, y: 152, left: 8, right: null },
		{ id: 6, key: 80, x: 360, y: 152, left: null, right: 9 },
		{ id: 7, key: 10, x: 40,  y: 226, left: null, right: null },
		{ id: 8, key: 55, x: 240, y: 226, left: null, right: null },
		{ id: 9, key: 90, x: 380, y: 226, left: null, right: null }
	];
	const root = 0;

	// рёбра «родитель → ребёнок» для отрисовки
	const links: [number, number][] = [];
	for (const n of nodes) {
		if (n.left !== null) links.push([n.id, n.left]);
		if (n.right !== null) links.push([n.id, n.right]);
	}

	type Mode = 'preorder' | 'inorder' | 'postorder';
	type Step = { current: number; output: number[]; note: string };

	function buildSteps(mode: Mode): Step[] {
		const steps: Step[] = [];
		const out: number[] = [];
		const visit = (id: number, where: string) => {
			out.push(id);
			steps.push({ current: id, output: [...out], note: `${where}: записываем ${nodes[id].key}` });
		};
		const go = (id: number | null) => {
			if (id === null) return;
			if (mode === 'preorder') {
				visit(id, 'корень поддерева');
				go(nodes[id].left);
				go(nodes[id].right);
			} else if (mode === 'inorder') {
				go(nodes[id].left);
				visit(id, 'после левого поддерева');
				go(nodes[id].right);
			} else {
				go(nodes[id].left);
				go(nodes[id].right);
				visit(id, 'после обоих поддеревьев');
			}
		};
		go(root);
		return steps;
	}

	const MODES: { id: Mode; label: string }[] = [
		{ id: 'preorder', label: 'Preorder (КЛП)' },
		{ id: 'inorder', label: 'Inorder (ЛКП)' },
		{ id: 'postorder', label: 'Postorder (ЛПК)' }
	];
	const MODE_NOTE: Record<Mode, string> = {
		preorder: 'Сначала корень, затем левое и правое поддеревья. Так копируют/сериализуют дерево.',
		inorder: 'Левое поддерево → корень → правое. В BST это всегда даёт отсортированный порядок ключей.',
		postorder: 'Сначала оба поддерева, потом корень. Так безопасно удаляют/освобождают дерево.'
	};

	let mode = $state<Mode>('inorder');
	let idx = $state(0);
	let playing = $state(false);

	const steps = $derived(buildSteps(mode));
	// idx = 0 → ничего ещё не посещено; idx = k → выполнено k шагов
	const shown = $derived(steps.slice(0, idx));
	const cur = $derived(idx > 0 ? steps[idx - 1] : null);
	const output = $derived(cur ? cur.output : []);
	const visitedSet = $derived(new Set(output));
	const sorted = $derived([...nodes].sort((a, b) => a.key - b.key).map((n) => n.id));
	const isSorted = $derived(
		mode === 'inorder' && idx === steps.length && output.length === sorted.length &&
		output.every((id, i) => id === sorted[i])
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
			if (idx >= steps.length) {
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
	function setMode(m: Mode) {
		mode = m;
		reset();
	}
	function nodeState(id: number): string {
		if (cur && cur.current === id) return 'current';
		if (visitedSet.has(id)) return 'visited';
		return 'idle';
	}
	// порядковый номер посещения (1-based) или пусто
	function order(id: number): number | null {
		const i = output.indexOf(id);
		return i >= 0 ? i + 1 : null;
	}
</script>

<div class="tv">
	<div class="tv__bar">
		<div class="seg">
			{#each MODES as m}
				<button class:on={mode === m.id} onclick={() => setMode(m.id)}>{m.label}</button>
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
			<button onclick={() => { stop(); idx = Math.min(steps.length, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{steps.length}</span>
		</div>
	</div>

	<div class="tv__body">
		<svg viewBox="0 0 420 262" class="tv__svg">
			{#each links as [p, ch]}
				<line
					x1={nodes[p].x} y1={nodes[p].y} x2={nodes[ch].x} y2={nodes[ch].y}
					class="edge"
				/>
			{/each}
			{#each nodes as n}
				<g class="node {nodeState(n.id)}">
					<circle cx={n.x} cy={n.y} r="18" />
					<text x={n.x} y={n.y} dy="0.34em">{n.key}</text>
					{#if order(n.id) !== null}
						<g class="badge">
							<circle cx={n.x + 15} cy={n.y - 15} r="8" />
							<text x={n.x + 15} y={n.y - 15} dy="0.34em">{order(n.id)}</text>
						</g>
					{/if}
				</g>
			{/each}
		</svg>

		<div class="tv__panel">
			<div class="legend">
				<span><i class="dot cur"></i>текущий</span>
				<span><i class="dot vis"></i>посещён</span>
				<span><i class="dot idle"></i>не пройден</span>
			</div>
			<div class="note">{MODE_NOTE[mode]}</div>
			{#if cur}
				<div class="step">{cur.note}</div>
			{:else}
				<div class="step muted">Нажмите ▶ или ▶▶, чтобы начать обход.</div>
			{/if}
		</div>
	</div>

	<div class="tv__out">
		<div class="out-head">
			<span class="lbl">Выходная последовательность</span>
			{#if isSorted}<span class="flag">✓ отсортировано по возрастанию</span>{/if}
		</div>
		<div class="seq">
			{#each shown as s, i}
				<span class="cell" class:last={i === shown.length - 1}>{nodes[s.current].key}</span>
				{#if i < shown.length - 1}<span class="arrow">→</span>{/if}
			{:else}
				<span class="empty">—</span>
			{/each}
		</div>
	</div>
</div>

<style>
	.tv {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.tv__bar {
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
		font-size: 0.74rem;
		padding: 0.34rem 0.7rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover { border-color: var(--blue); color: var(--blue); }
	.seg button.on { background: var(--blue); color: #fff; border-color: var(--blue); }
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
	.tv__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.tv__svg {
		flex: 1 1 340px;
		min-width: 290px;
		max-width: 480px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
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
		font-size: 0.84rem;
		fill: var(--color-parch-100);
	}
	.node.visited circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.visited text { fill: var(--blue); }
	.node.current circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.current text { fill: #fff; }
	.badge circle {
		fill: var(--color-ink-800);
		stroke: var(--blue);
		stroke-width: 1.5;
	}
	.badge text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.55rem;
		font-weight: 700;
		fill: var(--blue);
	}
	.tv__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
	}
	.legend span { display: flex; align-items: center; gap: 0.35rem; }
	.dot {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		display: inline-block;
	}
	.dot.cur { background: var(--blue); border: 2px solid var(--color-parch-100); }
	.dot.vis { background: var(--blue-pale); border: 1.5px solid var(--blue); }
	.dot.idle { background: var(--color-ink-850); border: 1.5px solid var(--color-ink-500); }
	.note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.step {
		margin-top: auto;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--color-parch-100);
	}
	.step.muted { color: var(--color-parch-muted); }
	.tv__out {
		padding: 0.8rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.out-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		flex-wrap: wrap;
		margin-bottom: 0.5rem;
	}
	.out-head .lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.flag {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		color: var(--blue);
		background: var(--blue-pale);
		padding: 0.18rem 0.5rem;
		border-radius: 6px;
	}
	.seq {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		min-height: 1.9rem;
	}
	.cell {
		display: grid;
		place-items: center;
		min-width: 1.9rem;
		height: 1.7rem;
		padding: 0 0.4rem;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.78rem;
		background: var(--color-parch-200);
		color: var(--color-ink-850);
	}
	.cell.last {
		background: var(--blue);
		color: #fff;
	}
	.arrow {
		color: var(--color-parch-muted);
		font-size: 0.7rem;
	}
	.empty { color: var(--color-parch-muted); }
</style>
