<script lang="ts">
	// Interactive AVL rebalancing: the four imbalance cases (LL, RR, LR, RL).
	// A freshly inserted key makes one node's balance factor reach ±2; the
	// matching rotation (single for LL/RR, double for LR/RL) restores
	// |bf| ≤ 1 while keeping the inorder order 10 < 20 < 30. Balance factors are
	// shown on every node and turn red at ±2. Pure SVG, same visual language as
	// TreeRotation / GraphTraversal.
	//
	// Node indices are FIXED by key: 0→10, 1→20, 2→30. Every frame only changes
	// the shape (root + child links), so a node keeps its horizontal slot (inorder
	// rank) and only slides vertically — the rotation reads as a smooth restructure.
	const KEY = [10, 20, 30];

	type Shape = { root: number; L: Record<number, number>; R: Record<number, number> };
	type Frame = { shape: Shape; note: string; pivot: number | null; rose: number | null };
	type Case = { id: string; label: string; seq: string; frames: Frame[] };

	const balanced: Shape = { root: 1, L: { 1: 0 }, R: { 1: 2 } }; // 20(10,30)

	const CASES: Case[] = [
		{
			id: 'LL',
			label: 'LL · левый-левый',
			seq: 'правый поворот вокруг 30',
			frames: [
				{
					shape: { root: 2, L: { 2: 1, 1: 0 }, R: {} },
					note: 'Ключ ушёл в левое поддерево левого ребёнка. Узел 30 разбалансирован: bf(30) = +2. Лечение — один ПРАВЫЙ поворот вокруг 30.',
					pivot: 2,
					rose: null
				},
				{
					shape: balanced,
					note: 'Правый поворот: 20 поднялось в корень, 30 опустилось вправо. Теперь все bf ∈ {−1, 0, +1} — дерево сбалансировано.',
					pivot: null,
					rose: 1
				}
			]
		},
		{
			id: 'RR',
			label: 'RR · правый-правый',
			seq: 'левый поворот вокруг 10',
			frames: [
				{
					shape: { root: 0, L: {}, R: { 0: 1, 1: 2 } },
					note: 'Ключ ушёл в правое поддерево правого ребёнка. Узел 10 разбалансирован: bf(10) = −2. Лечение — один ЛЕВЫЙ поворот вокруг 10.',
					pivot: 0,
					rose: null
				},
				{
					shape: balanced,
					note: 'Левый поворот: 20 поднялось в корень, 10 опустилось влево. Все bf ∈ {−1, 0, +1} — дерево сбалансировано.',
					pivot: null,
					rose: 1
				}
			]
		},
		{
			id: 'LR',
			label: 'LR · левый-правый',
			seq: 'левый поворот вокруг 10, затем правый вокруг 30',
			frames: [
				{
					shape: { root: 2, L: { 2: 0 }, R: { 0: 1 } },
					note: 'Ключ ушёл в ПРАВОЕ поддерево левого ребёнка (зигзаг). bf(30) = +2, но одного поворота мало. Шаг 1 — ЛЕВЫЙ поворот вокруг 10.',
					pivot: 0,
					rose: null
				},
				{
					shape: { root: 2, L: { 2: 1, 1: 0 }, R: {} },
					note: 'После левого поворота зигзаг выпрямлен в «линию» LL. Шаг 2 — ПРАВЫЙ поворот вокруг 30.',
					pivot: 2,
					rose: 1
				},
				{
					shape: balanced,
					note: 'Двойной поворот завершён: 20 стало корнем. LR = левый@10 → правый@30. Дерево сбалансировано.',
					pivot: null,
					rose: 1
				}
			]
		},
		{
			id: 'RL',
			label: 'RL · правый-левый',
			seq: 'правый поворот вокруг 30, затем левый вокруг 10',
			frames: [
				{
					shape: { root: 0, L: { 2: 1 }, R: { 0: 2 } },
					note: 'Ключ ушёл в ЛЕВОЕ поддерево правого ребёнка (зигзаг). bf(10) = −2, одного поворота мало. Шаг 1 — ПРАВЫЙ поворот вокруг 30.',
					pivot: 2,
					rose: null
				},
				{
					shape: { root: 0, L: {}, R: { 0: 1, 1: 2 } },
					note: 'После правого поворота зигзаг выпрямлен в «линию» RR. Шаг 2 — ЛЕВЫЙ поворот вокруг 10.',
					pivot: 0,
					rose: 1
				},
				{
					shape: balanced,
					note: 'Двойной поворот завершён: 20 стало корнем. RL = правый@30 → левый@10. Дерево сбалансировано.',
					pivot: null,
					rose: 1
				}
			]
		}
	];

	// ── geometry ──
	const VB_W = 360;
	const VB_H = 230;
	const PAD_X = 46;
	const TOP = 38;
	const ROW = 60;

	const childL = (s: Shape, i: number): number | null => (i in s.L ? s.L[i] : null);
	const childR = (s: Shape, i: number): number | null => (i in s.R ? s.R[i] : null);

	function heights(s: Shape): Map<number, number> {
		const h = new Map<number, number>();
		const walk = (i: number | null): number => {
			if (i === null) return 0;
			const hh = 1 + Math.max(walk(childL(s, i)), walk(childR(s, i)));
			h.set(i, hh);
			return hh;
		};
		walk(s.root);
		return h;
	}
	function depths(s: Shape): Map<number, number> {
		const d = new Map<number, number>();
		const walk = (i: number | null, lvl: number) => {
			if (i === null) return;
			d.set(i, lvl);
			walk(childL(s, i), lvl + 1);
			walk(childR(s, i), lvl + 1);
		};
		walk(s.root, 0);
		return d;
	}
	function inorder(s: Shape): number[] {
		const out: number[] = [];
		const walk = (i: number | null) => {
			if (i === null) return;
			walk(childL(s, i));
			out.push(i);
			walk(childR(s, i));
		};
		walk(s.root);
		return out;
	}
	function bf(s: Shape, h: Map<number, number>, i: number): number {
		const hl = childL(s, i) === null ? 0 : (h.get(childL(s, i) as number) ?? 0);
		const hr = childR(s, i) === null ? 0 : (h.get(childR(s, i) as number) ?? 0);
		return hl - hr;
	}

	// ── state ──
	let caseIdx = $state(0);
	let step = $state(0);

	const cur = $derived(CASES[caseIdx]);
	const frame = $derived(cur.frames[step]);
	const shape = $derived(frame.shape);
	const h = $derived(heights(shape));
	const dep = $derived(depths(shape));
	const ord = $derived(inorder(shape));
	const isLast = $derived(step === cur.frames.length - 1);

	const pos = $derived.by(() => {
		// horizontal slot is FIXED by key rank (10,20,30) so nodes only slide vertically
		const span = VB_W - 2 * PAD_X;
		const p = new Map<number, { x: number; y: number }>();
		for (let i = 0; i < KEY.length; i++) {
			const x = PAD_X + (span * i) / (KEY.length - 1);
			const y = TOP + (dep.get(i) ?? 0) * ROW;
			p.set(i, { x, y });
		}
		return p;
	});

	const edges = $derived.by(() => {
		const out: [number, number][] = [];
		for (const i of ord) {
			const l = childL(shape, i);
			const r = childR(shape, i);
			if (l !== null) out.push([i, l]);
			if (r !== null) out.push([i, r]);
		}
		return out;
	});

	function pickCase(i: number) {
		caseIdx = i;
		step = 0;
	}
	function next() {
		if (!isLast) step += 1;
	}
	function reset() {
		step = 0;
	}
	function nodeClass(i: number): boolean[] {
		return [i === frame.pivot, i === frame.rose, Math.abs(bf(shape, h, i)) === 2];
	}
</script>

<div class="av">
	<div class="av__bar">
		<div class="seg">
			{#each CASES as c, i}
				<button class:active={i === caseIdx} onclick={() => pickCase(i)}>{c.label}</button>
			{/each}
		</div>
	</div>

	<div class="av__body">
		<svg viewBox="0 0 {VB_W} {VB_H}" class="av__svg">
			{#each edges as [a, b] (a + '-' + b)}
				{@const pa = pos.get(a)}
				{@const pb = pos.get(b)}
				{#if pa && pb}
					<line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} class="edge" />
				{/if}
			{/each}

			{#each ord as i (i)}
				{@const p = pos.get(i)}
				{@const cls = nodeClass(i)}
				{@const b = bf(shape, h, i)}
				{#if p}
					<g class="node" class:pivot={cls[0]} class:rose={cls[1]} class:bad={cls[2]} style="transform: translate({p.x}px, {p.y}px)">
						<circle r="16" />
						<text dy="0.34em">{KEY[i]}</text>
						<g class="bfbadge" class:bad={cls[2]} style="transform: translate(19px, -16px)">
							<rect x="-13" y="-10" width="26" height="17" rx="5" />
							<text dy="0.30em">{b > 0 ? '+' + b : b === 0 ? '0' : b}</text>
						</g>
					</g>
				{/if}
			{/each}
		</svg>

		<div class="av__panel">
			<div class="leg">
				<span class="dot pivot"></span> ось поворота
				<span class="dot rose"></span> поднялся
				<span class="dot bad"></span> bf = ±2
			</div>

			<div class="row">
				<span class="lbl">случай</span>
				<span class="seqv">{cur.id}: {cur.seq}</span>
			</div>

			<div class="row">
				<span class="lbl">шаг</span>
				<div class="steps">
					{#each cur.frames as _, i}
						<span class="sdot" class:on={i <= step} class:cur={i === step}></span>
					{/each}
					<span class="phase" class:on={isLast}>{isLast ? 'сбалансировано' : 'разбаланс bf=±2'}</span>
				</div>
			</div>

			<div class="note" class:done={isLast}>{frame.note}</div>

			<div class="ctrl">
				<button class="primary" onclick={next} disabled={isLast}>▶ повернуть</button>
				<button onclick={reset} disabled={step === 0}>сброс</button>
			</div>
		</div>
	</div>
</div>

<style>
	.av {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.av__bar {
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
		font-size: 0.72rem;
		padding: 0.4rem 0.7rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 8px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.seg button.active {
		background: var(--blue);
		border-color: var(--blue);
		color: #fff;
	}
	.av__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.av__svg {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 440px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.35s;
	}
	.node {
		transition: transform 0.45s ease;
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
		font-size: 0.88rem;
		fill: var(--color-parch-100);
		pointer-events: none;
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
	.node.bad circle {
		stroke: var(--color-rose);
		stroke-width: 3.5;
	}
	.bfbadge rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-width: 1.2;
	}
	.bfbadge text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
	}
	.bfbadge.bad rect {
		fill: color-mix(in srgb, var(--color-rose) 22%, var(--color-ink-800));
		stroke: var(--color-rose);
	}
	.bfbadge.bad text {
		fill: var(--color-rose);
	}
	.av__panel {
		flex: 1 1 220px;
		min-width: 210px;
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
	.dot.pivot {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.dot.rose {
		background: var(--blue);
		border: 2px solid var(--color-parch-100);
	}
	.dot.bad {
		background: transparent;
		border: 2px solid var(--color-rose);
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
	.seqv {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-200);
	}
	.steps {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.sdot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: var(--color-ink-600);
		border: 1.5px solid var(--color-ink-500);
	}
	.sdot.on {
		background: var(--blue);
		border-color: var(--blue);
	}
	.sdot.cur {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--blue) 35%, transparent);
	}
	.phase {
		margin-left: 0.3rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.7rem;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		background: color-mix(in srgb, var(--color-rose) 18%, var(--color-ink-800));
		color: var(--color-rose);
		border: 1.5px solid var(--color-rose);
	}
	.phase.on {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.note {
		font-size: 0.83rem;
		line-height: 1.5;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--color-rose);
		transition: border-color 0.3s;
	}
	.note.done {
		border-left-color: var(--blue);
	}
	.ctrl {
		display: flex;
		gap: 0.5rem;
		margin-top: auto;
	}
	.ctrl button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		padding: 0.4rem 0.8rem;
		border-radius: 8px;
		border: 1.5px solid var(--color-ink-500);
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		transition: all 0.15s;
	}
	.ctrl button.primary {
		border-color: var(--blue);
		color: var(--blue);
	}
	.ctrl button.primary:hover:not(:disabled) {
		background: var(--blue);
		color: #fff;
	}
	.ctrl button:hover:not(:disabled) {
		border-color: var(--blue);
	}
	.ctrl button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
