<script lang="ts">
	// Почему выбор дополняющего пути критичен: классический граф 1000/1000/1.
	// Наивный Форд–Фалкерсон гоняет поток через тонкую перемычку B→C по ±1 →
	// ~2000 итераций. Эдмондс–Карп (BFS = кратчайший путь) берёт два «жирных»
	// прямых пути → 2 итерации, O(VE²), не зависит от значений c.
	// Плюс панель иррационального случая (поток сходится к 3+2r, но не к max).
	// Чистый SVG, без зависимостей.
	type Step = { hi: number[]; d: Record<number, number>; note: string };

	const NODES = [
		{ x: 42, y: 130, label: 'A' },
		{ x: 168, y: 52, label: 'B' },
		{ x: 168, y: 208, label: 'C' },
		{ x: 300, y: 130, label: 'D' }
	];
	// edge i: from→to, cap. edge 4 = B→C — тонкая перемычка (cap 1)
	const EDGES = [
		{ f: 0, t: 1, cap: 1000 }, // 0 A→B
		{ f: 0, t: 2, cap: 1000 }, // 1 A→C
		{ f: 1, t: 3, cap: 1000 }, // 2 B→D
		{ f: 2, t: 3, cap: 1000 }, // 3 C→D
		{ f: 1, t: 2, cap: 1 } //     4 B→C (перемычка)
	];

	const NAIVE: Step[] = [
		{ hi: [0, 4, 3], d: { 0: 1, 4: 1, 3: 1 }, note: 'A→B→C→D через перемычку: узкое место B→C = 1, проталкиваем всего +1.' },
		{ hi: [1, 4, 2], d: { 1: 1, 4: -1, 2: 1 }, note: 'A→C→B→D: обратным ребром C→B отменяем перемычку, ещё +1.' },
		{ hi: [0, 4, 3], d: { 0: 1, 4: 1, 3: 1 }, note: 'Снова через перемычку: +1. Видишь паттерн — поток растёт по 1.' },
		{ hi: [1, 4, 2], d: { 1: 1, 4: -1, 2: 1 }, note: '…и снова отмена. За шаг — лишь +1, перемычка гоняется 1↔0.' }
	];
	const EK: Step[] = [
		{ hi: [0, 2], d: { 0: 1000, 2: 1000 }, note: 'BFS даёт кратчайший путь A→B→D (2 ребра). Узкое место 1000 — проталкиваем сразу 1000.' },
		{ hi: [1, 3], d: { 1: 1000, 3: 1000 }, note: 'BFS: A→C→D, ещё 1000. Путь s→t больше не находится → максимум 2000 за 2 итерации.' }
	];

	let mode = $state<'naive' | 'ek'>('naive');
	let applied = $state(0);
	let maxed = $state(false); // «перемотано к максимуму» (наивный)

	const script = $derived(mode === 'naive' ? NAIVE : EK);

	const flow = $derived.by(() => {
		const f = [0, 0, 0, 0, 0];
		if (mode === 'naive' && maxed) return [1000, 1000, 1000, 1000, 0];
		for (let i = 0; i < applied; i++) for (const [e, dv] of Object.entries(script[i].d)) f[+e] += dv;
		return f;
	});
	const value = $derived(mode === 'naive' && maxed ? 2000 : flow[0] + flow[1]); // |f| = поток из A
	const iter = $derived(mode === 'naive' && maxed ? 2000 : applied);
	const curHi = $derived(applied > 0 && !maxed ? script[applied - 1].hi : []);
	const note = $derived(
		maxed
			? 'Перемотано: те же ±1-шаги повторяются ~1000 раз. Итог — поток 2000 за ~2000 итераций. Граница O(E·|f*|) зависит от значений c.'
			: applied === 0
				? mode === 'naive'
					? 'Наивный Форд–Фалкерсон: путь выбирается как попало. Жми «шаг».'
					: 'Эдмондс–Карп: путь — кратчайший по числу рёбер (BFS). Жми «шаг».'
				: script[applied - 1].note
	);
	const done = $derived(mode === 'ek' ? applied >= EK.length : maxed);

	function setMode(m: 'naive' | 'ek') {
		mode = m;
		applied = 0;
		maxed = false;
	}
	function step() {
		if (mode === 'ek') {
			if (applied < EK.length) applied += 1;
		} else if (!maxed && applied < NAIVE.length) applied += 1;
	}
	function toMax() {
		if (mode === 'naive') maxed = true;
	}
	function reset() {
		applied = 0;
		maxed = false;
	}
	function edgeActive(i: number) {
		return curHi.includes(i);
	}
	function mid(e: { f: number; t: number }) {
		return { x: (NODES[e.f].x + NODES[e.t].x) / 2, y: (NODES[e.f].y + NODES[e.t].y) / 2 };
	}
</script>

<div class="mf">
	<div class="mf__bar">
		<div class="seg">
			<button class:on={mode === 'naive'} onclick={() => setMode('naive')}>Наивный</button>
			<button class:on={mode === 'ek'} onclick={() => setMode('ek')}>Эдмондс–Карп (BFS)</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={step} disabled={done} title="шаг">▶ шаг</button>
			{#if mode === 'naive'}<button onclick={toMax} disabled={maxed} title="к максимуму">⏭ к максимуму</button>{/if}
		</div>
	</div>

	<div class="mf__body">
		<svg viewBox="0 0 360 260" class="mf__svg">
			<defs>
				<marker id="mf-arr" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--color-ink-500)" />
				</marker>
				<marker id="mf-arr-on" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
			</defs>
			{#each EDGES as e, i}
				{@const p = NODES[e.f]}
				{@const q = NODES[e.t]}
				{@const m = mid(e)}
				<line
					x1={p.x} y1={p.y} x2={q.x} y2={q.y}
					class="edge" class:active={edgeActive(i)} class:thin={e.cap === 1}
					marker-end={edgeActive(i) ? 'url(#mf-arr-on)' : 'url(#mf-arr)'}
				/>
				<g class="lbl" class:active={edgeActive(i)}>
					<rect x={m.x - 22} y={m.y - 9} width="44" height="16" rx="4" />
					<text x={m.x} y={m.y} dy="0.34em">{flow[i]}/{e.cap}</text>
				</g>
			{/each}
			{#each NODES as n}
				<g class="node" class:src={n.label === 'A'} class:snk={n.label === 'D'}>
					<circle cx={n.x} cy={n.y} r="18" />
					<text x={n.x} y={n.y} dy="0.34em">{n.label}</text>
				</g>
			{/each}
		</svg>

		<div class="mf__panel">
			<div class="stat">
				<div><span>итерация</span><b>{iter}</b></div>
				<div><span>поток |f|</span><b>{value}</b></div>
			</div>
			<div class="note">{note}</div>
			<div class="verdict" class:ek={mode === 'ek'}>
				{#if mode === 'naive'}
					≈ 2000 итераций · граница <b>O(E·|f*|)</b> зависит от значений c
				{:else}
					2 итерации · <b>O(VE²)</b> — не зависит от значений c
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.mf {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.mf__bar {
		display: flex;
		justify-content: space-between;
		gap: 0.8rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.seg {
		display: flex;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		overflow: hidden;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		padding: 0.35rem 0.7rem;
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
		gap: 0.3rem;
		align-items: center;
	}
	.ctrl button {
		height: 2rem;
		padding: 0 0.6rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.74rem;
		font-family: var(--font-mono);
	}
	.ctrl button:hover:not(:disabled) {
		border-color: var(--blue);
		color: var(--blue);
	}
	.ctrl button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.mf__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.mf__svg {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 460px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.2s;
	}
	.edge.thin {
		stroke-dasharray: 4 3;
	}
	.edge.active {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.lbl rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1;
	}
	.lbl.active rect {
		stroke: var(--blue);
	}
	.lbl text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-100);
	}
	.lbl.active text {
		fill: var(--blue);
		font-weight: 700;
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
	}
	.node.src circle {
		stroke: var(--blue);
	}
	.node.snk circle {
		stroke: var(--blue);
		fill: color-mix(in srgb, var(--blue) 18%, var(--color-ink-850));
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.9rem;
		fill: var(--color-parch-100);
	}
	.mf__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.stat {
		display: flex;
		gap: 1rem;
	}
	.stat div {
		display: flex;
		flex-direction: column;
	}
	.stat span {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.stat b {
		font-family: var(--font-display);
		font-size: 1.4rem;
		color: var(--blue);
	}
	.note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
		min-height: 3.2rem;
	}
	.verdict {
		margin-top: auto;
		font-size: 0.76rem;
		color: var(--color-rose, #e06c75);
		font-family: var(--font-mono);
	}
	.verdict.ek {
		color: var(--color-verdant, #4caf7d);
	}
	.verdict b {
		color: inherit;
	}
</style>
