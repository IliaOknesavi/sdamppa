<script lang="ts">
	// Построение кода Хаффмана. Слева — min-куча символов по частотам,
	// справа — растущее дерево. Шаг: извлекаем два минимума, сливаем в узел
	// с суммой частот, возвращаем в кучу. В финале спуск проставляет 0/1
	// на рёбрах и префиксные коды листьев. Клик по листу подсвечивает код.
	// Pure SVG, без зависимостей; один визуальный язык с GraphTraversal.

	type Node = {
		id: number;
		freq: number;
		sym: string | null; // лист — буква, внутренний — null
		left: number | null;
		right: number | null;
	};
	type Snap = {
		heap: number[]; // id узлов в куче, отсортированы по freq возр.
		merged: number | null; // id только что созданного узла (или null)
		picked: [number, number] | null; // два извлечённых минимума
		note: string;
	};

	// Демо-частоты (классический набор, удобно ложится в дерево).
	const FREQ: { sym: string; freq: number }[] = [
		{ sym: 'A', freq: 5 },
		{ sym: 'B', freq: 9 },
		{ sym: 'C', freq: 12 },
		{ sym: 'D', freq: 13 },
		{ sym: 'E', freq: 16 },
		{ sym: 'F', freq: 45 }
	];

	// --- Прогон алгоритма: строим узлы и последовательность снимков. ---
	function build() {
		const nodes: Node[] = [];
		const snaps: Snap[] = [];

		// листья
		for (const f of FREQ) {
			nodes.push({ id: nodes.length, freq: f.freq, sym: f.sym, left: null, right: null });
		}
		// куча = индексы листьев, поддерживаем сортировку по freq (стабильно по id)
		let heap = nodes.map((n) => n.id);
		const sortHeap = (h: number[]) =>
			[...h].sort((a, b) => nodes[a].freq - nodes[b].freq || a - b);
		heap = sortHeap(heap);

		snaps.push({
			heap: [...heap],
			merged: null,
			picked: null,
			note: 'Стартовая min-куча: каждый символ — отдельный узел с его частотой.'
		});

		while (heap.length > 1) {
			// два минимума
			const a = heap[0];
			const b = heap[1];
			const sum = nodes[a].freq + nodes[b].freq;
			const parent: Node = {
				id: nodes.length,
				freq: sum,
				sym: null,
				left: a, // меньший слева (ребро 0)
				right: b // больший справа (ребро 1)
			};
			nodes.push(parent);
			// убираем два минимума, добавляем родителя, пересортировка
			heap = sortHeap([...heap.slice(2), parent.id]);
			snaps.push({
				heap: [...heap],
				merged: parent.id,
				picked: [a, b],
				note: `Сливаем минимумы ${lbl(nodes, a)} (${nodes[a].freq}) и ${lbl(nodes, b)} (${nodes[b].freq}) → узел ${sum}. Возвращаем в кучу.`
			});
		}

		const rootId = heap.length ? heap[0] : nodes.length - 1;

		// --- Спуск: коды листьев и метки рёбер 0/1. ---
		const codes: Record<number, string> = {};
		const edgeBit: Record<number, string> = {}; // childId -> '0'|'1'
		(function descend(id: number, code: string) {
			const n = nodes[id];
			if (n.sym !== null) {
				codes[id] = code || '0';
				return;
			}
			if (n.left !== null) {
				edgeBit[n.left] = '0';
				descend(n.left, code + '0');
			}
			if (n.right !== null) {
				edgeBit[n.right] = '1';
				descend(n.right, code + '1');
			}
		})(rootId, '');

		snaps.push({
			heap: [rootId],
			merged: rootId,
			picked: null,
			note: 'Куча схлопнулась в один корень. Спускаемся: левое ребро = 0, правое = 1 — получаем префиксные коды.'
		});

		return { nodes, snaps, rootId, codes, edgeBit };
	}

	function lbl(nodes: Node[], id: number): string {
		return nodes[id].sym ?? `[${nodes[id].freq}]`;
	}

	const algo = build();
	const NODES = algo.nodes;
	const SNAPS = algo.snaps;
	const ROOT = algo.rootId;
	const CODES = algo.codes;
	const EDGEBIT = algo.edgeBit;

	// --- Раскладка дерева для финального вида (рисуем по мере появления). ---
	// Координаты считаем один раз для полного дерева; узлы показываем,
	// если их id уже создан на текущем шаге.
	const POS: Record<number, { x: number; y: number }> = {};
	(function layout() {
		// глубина по уровням, листья раскладываем слева направо по обходу
		const order: number[] = [];
		const depthOf: Record<number, number> = {};
		let maxDepth = 0;
		(function walk(id: number, d: number) {
			depthOf[id] = d;
			maxDepth = Math.max(maxDepth, d);
			const n = NODES[id];
			if (n.left !== null) walk(n.left, d + 1);
			if (n.sym !== null) order.push(id);
			if (n.right !== null) walk(n.right, d + 1);
		})(ROOT, 0);

		const leafX: Record<number, number> = {};
		const W = 200;
		const padX = 26;
		const span = order.length > 1 ? (W - padX * 2) / (order.length - 1) : 0;
		order.forEach((id, i) => (leafX[id] = padX + i * span));

		const topY = 24;
		const stepY = maxDepth > 0 ? (244 - topY) / maxDepth : 0;
		(function place(id: number): number {
			const n = NODES[id];
			let x: number;
			if (n.sym !== null) {
				x = leafX[id];
			} else {
				const lx = place(n.left!);
				const rx = place(n.right!);
				x = (lx + rx) / 2;
			}
			POS[id] = { x, y: topY + depthOf[id] * stepY };
			return x;
		})(ROOT);
	})();

	// id узлов, которые «уже построены» к снимку i (листья = всегда,
	// внутренние появляются по мере слияний).
	function builtAt(i: number): Set<number> {
		const s = new Set<number>();
		for (const n of NODES) if (n.sym !== null) s.add(n.id);
		for (let k = 1; k <= i; k++) {
			const m = SNAPS[k].merged;
			if (m !== null) s.add(m);
		}
		return s;
	}

	let idx = $state(0);
	let playing = $state(false);
	let selected = $state<number | null>(null); // выбранный лист (по id)

	const snap = $derived(SNAPS[Math.min(idx, SNAPS.length - 1)]);
	const built = $derived(builtAt(idx));
	const finalStep = $derived(idx === SNAPS.length - 1);
	const pickedSet = $derived(new Set(snap.picked ?? []));
	const selCode = $derived(selected !== null ? CODES[selected] : null);
	// рёбра, входящие в путь выбранного листа (id потомка вдоль пути)
	const selPath = $derived(pathTo(selected));

	function pathTo(leaf: number | null): Set<number> {
		const set = new Set<number>();
		if (leaf === null || !finalStep) return set;
		// идём от корня вниз к листу
		const stack: { id: number; trail: number[] }[] = [{ id: ROOT, trail: [] }];
		while (stack.length) {
			const { id, trail } = stack.pop()!;
			if (id === leaf) {
				for (const t of [...trail, leaf]) set.add(t);
				break;
			}
			const n = NODES[id];
			if (n.left !== null) stack.push({ id: n.left, trail: [...trail, id] });
			if (n.right !== null) stack.push({ id: n.right, trail: [...trail, id] });
		}
		return set;
	}

	// рёбра дерева как пары (parent, child)
	const TREE_EDGES = (() => {
		const e: { p: number; c: number }[] = [];
		for (const n of NODES) {
			if (n.left !== null) e.push({ p: n.id, c: n.left });
			if (n.right !== null) e.push({ p: n.id, c: n.right });
		}
		return e;
	})();

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= SNAPS.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 950);
	}
	function reset() {
		stop();
		idx = 0;
		selected = null;
	}
	function leafClick(id: number) {
		if (!finalStep) return;
		selected = selected === id ? null : id;
	}
	function edgeVisible(c: number): boolean {
		return built.has(c) && built.has(NODES.find((n) => n.left === c || n.right === c)!.id);
	}
	function edgeOnPath(c: number): boolean {
		// ребро (parent→c) на пути, если и c, и его родитель в selPath
		if (!selPath.has(c)) return false;
		const parent = NODES.find((n) => n.left === c || n.right === c);
		return parent ? selPath.has(parent.id) : false;
	}
</script>

<div class="hf">
	<div class="hf__bar">
		<div class="title">Код Хаффмана</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); selected = null; }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(SNAPS.length - 1, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{SNAPS.length - 1}</span>
		</div>
	</div>

	<div class="hf__body">
		<!-- Слева: min-куча -->
		<div class="hf__heap">
			<span class="lbl">min-куча по частотам</span>
			<div class="stack">
				{#each snap.heap as id (id)}
					<div class="hitem" class:picked={pickedSet.has(id)} class:merged={snap.merged === id}>
						<span class="hsym">{NODES[id].sym ?? '•'}</span>
						<span class="hfreq">{NODES[id].freq}</span>
					</div>
				{:else}
					<span class="empty">—</span>
				{/each}
			</div>
		</div>

		<!-- Справа: растущее дерево -->
		<svg viewBox="0 0 252 268" class="hf__svg">
			{#each TREE_EDGES as e (e.c)}
				{#if edgeVisible(e.c)}
					<line
						x1={POS[e.p].x} y1={POS[e.p].y} x2={POS[e.c].x} y2={POS[e.c].y}
						class="edge" class:onpath={edgeOnPath(e.c)}
					/>
					{#if finalStep}
						<text
							class="bit" class:onpath={edgeOnPath(e.c)}
							x={(POS[e.p].x + POS[e.c].x) / 2}
							y={(POS[e.p].y + POS[e.c].y) / 2}
							dy="0.32em"
						>{EDGEBIT[e.c]}</text>
					{/if}
				{/if}
			{/each}

			{#each NODES as n (n.id)}
				{#if built.has(n.id)}
					<g
						class="tnode"
						class:leaf={n.sym !== null}
						class:picked={pickedSet.has(n.id)}
						class:fresh={snap.merged === n.id}
						class:sel={selected === n.id}
						class:dim={selected !== null && n.sym !== null && selected !== n.id}
						onclick={() => leafClick(n.id)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); leafClick(n.id); } }}
						role="button"
						tabindex="0"
						style="cursor: {finalStep && n.sym !== null ? 'pointer' : 'default'}"
					>
						<circle cx={POS[n.id].x} cy={POS[n.id].y} r={n.sym !== null ? 13 : 11} />
						<text x={POS[n.id].x} y={POS[n.id].y} dy={n.sym !== null ? '-0.05em' : '0.32em'}>
							{n.sym ?? n.freq}
						</text>
						{#if n.sym !== null}
							<text class="tfreq" x={POS[n.id].x} y={POS[n.id].y + 9} dy="0.32em">{n.freq}</text>
						{/if}
					</g>
				{/if}
			{/each}
		</svg>
	</div>

	<div class="hf__note">{snap.note}</div>

	{#if finalStep}
		<div class="hf__codes">
			<span class="lbl">Префиксные коды {selected !== null ? '— клик ещё раз снимет выбор' : '(клик по листу = путь)'}</span>
			<div class="codes">
				{#each FREQ as f, i}
					<button
						class="codepill"
						class:sel={selected === i}
						class:dim={selected !== null && selected !== i}
						onclick={() => leafClick(i)}
					>
						<b>{f.sym}</b><code>{CODES[i]}</code>
					</button>
				{/each}
			</div>
			{#if selCode !== null}
				<div class="selnote">
					Путь к <b>{NODES[selected!].sym}</b>: код <code>{selCode}</code> ({selCode.length} бит) — ни один код не является префиксом другого.
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.hf {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.hf__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.86rem;
		color: var(--color-parch-100);
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
	.hf__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
		align-items: flex-start;
	}
	.hf__heap {
		flex: 1 1 130px;
		min-width: 120px;
		max-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--color-parch-muted);
	}
	.stack {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.hitem {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0.55rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 8px;
		background: var(--color-ink-800);
		transition: all 0.25s;
	}
	.hitem.picked {
		border-color: var(--blue);
		background: var(--blue-pale);
	}
	.hitem.picked .hsym,
	.hitem.picked .hfreq {
		color: var(--blue);
	}
	.hitem.merged {
		border-color: var(--blue);
		background: var(--blue);
	}
	.hitem.merged .hsym,
	.hitem.merged .hfreq {
		color: #fff;
	}
	.hsym {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		color: var(--color-parch-100);
	}
	.hfreq {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--color-parch-200);
	}
	.empty {
		color: var(--color-parch-muted);
	}
	.hf__svg {
		flex: 1 1 250px;
		min-width: 230px;
		max-width: 340px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: stroke 0.2s, stroke-width 0.2s;
	}
	.edge.onpath {
		stroke: var(--blue);
		stroke-width: 3.5;
	}
	.bit {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		fill: var(--color-parch-muted);
	}
	.bit.onpath {
		fill: var(--blue);
	}
	.tnode circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.25s, stroke 0.25s;
	}
	.tnode text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.72rem;
		fill: var(--color-parch-100);
	}
	.tnode .tfreq {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 0.5rem;
		fill: var(--color-parch-muted);
	}
	.tnode.leaf circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.tnode.leaf text {
		fill: var(--blue);
	}
	.tnode.fresh circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.tnode.fresh text {
		fill: #fff;
	}
	.tnode.picked circle {
		stroke: var(--blue);
		stroke-width: 3;
	}
	.tnode.sel circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.tnode.sel text {
		fill: #fff;
	}
	.tnode.sel .tfreq {
		fill: var(--blue-pale);
	}
	.tnode.dim {
		opacity: 0.4;
	}
	.hf__note {
		margin: 0 1rem 1rem;
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.hf__codes {
		padding: 0.8rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.codes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.codepill {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.28rem 0.55rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 8px;
		background: var(--color-ink-850);
		cursor: pointer;
		transition: all 0.15s;
	}
	.codepill b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.8rem;
		color: var(--color-parch-100);
	}
	.codepill code {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--blue);
	}
	.codepill:hover {
		border-color: var(--blue);
	}
	.codepill.sel {
		background: var(--blue);
		border-color: var(--blue);
	}
	.codepill.sel b,
	.codepill.sel code {
		color: #fff;
	}
	.codepill.dim {
		opacity: 0.45;
	}
	.selnote {
		font-size: 0.78rem;
		color: var(--color-parch-200);
	}
	.selnote code {
		font-family: var(--font-mono);
		color: var(--blue);
	}
	.selnote b {
		color: var(--color-parch-100);
	}
</style>
