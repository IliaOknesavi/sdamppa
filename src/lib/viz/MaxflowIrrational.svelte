<script lang="ts">
	// Несходимость наивного Форда–Фалкерсона на иррациональных ёмкостях —
	// НА САМОМ ГРАФЕ. Сеть из контрпримера: s, v1..v4, t. Особые рёбра цепочки
	// v1–v2–v3–v4 имеют ёмкости e1=1, e2=r, e3=1 (r=(√5−1)/2, r²=1−r),
	// остальные — большие M. Жми «следующий путь» (или ▶): подсвечивается
	// дополняющий путь, по которому идёт поток. Последовательность p0; затем
	// p2,p1,p2,p3 повторяется. Остаточные ёмкости e1,e2,e3 идут как (rⁿ,rⁿ⁺¹,0),
	// поток сходится к 3+2r≈4.236, но НИКОГДА не достигает максимума 2M+1.
	const r = (Math.sqrt(5) - 1) / 2;
	const ASYMP = 3 + 2 * r;

	// узлы: 0=s 1=v1 2=v2 3=v3 4=v4 5=t
	const N = [
		{ x: 28, y: 125, label: 's' },
		{ x: 135, y: 46, label: 'v₁' },
		{ x: 238, y: 88, label: 'v₂' },
		{ x: 238, y: 172, label: 'v₃' },
		{ x: 135, y: 204, label: 'v₄' },
		{ x: 352, y: 125, label: 't' }
	];
	// рёбра: особые (цепочка) + большие M
	const E = [
		{ a: 1, b: 2, cap: '1', sp: 0 }, // e1
		{ a: 2, b: 3, cap: 'r', sp: 1 }, // e2
		{ a: 3, b: 4, cap: '1', sp: 2 }, // e3
		{ a: 0, b: 1, cap: 'M' },
		{ a: 0, b: 2, cap: 'M' },
		{ a: 0, b: 4, cap: 'M' },
		{ a: 1, b: 5, cap: 'M' },
		{ a: 3, b: 5, cap: 'M' },
		{ a: 4, b: 5, cap: 'M' }
	];

	const PATHS: Record<string, number[]> = {
		prime: [0, 4, 3, 2, 1, 5], // p0 / p1: s→v4→v3→v2→v1→t
		A: [0, 2, 3, 4, 5], //          p2: s→v2→v3→v4→t
		B: [0, 4, 3, 2, 1, 5], //       p1
		C: [0, 1, 2, 3, 5] //           p3: s→v1→v2→v3→t
	};
	type St = { path: string; push: number; name: string };
	const STEPS: St[] = (() => {
		const s: St[] = [{ path: 'prime', push: 1, name: 'p₀ · насыщение' }];
		for (let g = 0; g < 3; g++) {
			s.push({ path: 'A', push: Math.pow(r, 2 * g + 1), name: 'p₂' });
			s.push({ path: 'B', push: Math.pow(r, 2 * g + 2), name: 'p₁' });
			s.push({ path: 'A', push: Math.pow(r, 2 * g + 1), name: 'p₂' });
			s.push({ path: 'C', push: Math.pow(r, 2 * g + 2), name: 'p₃' });
		}
		return s;
	})();

	let applied = $state(0);
	let playing = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;

	const cur = $derived(applied > 0 ? STEPS[applied - 1] : null);
	const curNodes = $derived(cur ? PATHS[cur.path] : []);
	const F = $derived(STEPS.slice(0, applied).reduce((a, s) => a + s.push, 0));
	const g = $derived(applied === 0 ? 0 : Math.floor((applied - 1) / 4));
	const resid = $derived([Math.pow(r, g), Math.pow(r, g + 1), 0]); // e1,e2,e3
	const residSym = $derived(g === 0 ? ['1', 'r', '0'] : [`r^${g}`, `r^${g + 1}`, '0']);
	const pathText = $derived(cur ? curNodes.map((i) => N[i].label).join(' → ') : '—');

	// ориентированные сегменты текущего пути (для подсветки и стрелок)
	const segs = $derived.by(() => {
		const out: { a: number; b: number }[] = [];
		for (let i = 0; i + 1 < curNodes.length; i++) out.push({ a: curNodes[i], b: curNodes[i + 1] });
		return out;
	});
	function onPath(a: number, b: number) {
		return segs.some((s) => (s.a === a && s.b === b) || (s.a === b && s.b === a));
	}

	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (applied >= STEPS.length) {
				stop();
				return;
			}
			applied += 1;
		}, 1200);
	}
	function step() {
		stop();
		if (applied < STEPS.length) applied += 1;
	}
	function reset() {
		stop();
		applied = 0;
	}
	function shorten(p: { x: number; y: number }, q: { x: number; y: number }, rad: number) {
		const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1;
		return { x1: p.x + (dx / L) * rad, y1: p.y + (dy / L) * rad, x2: q.x - (dx / L) * rad, y2: q.y - (dy / L) * rad };
	}
	function mid(a: number, b: number) {
		return { x: (N[a].x + N[b].x) / 2, y: (N[a].y + N[b].y) / 2 };
	}
</script>

<div class="ir">
	<div class="ir__bar">
		<span class="ir__title">Несходимость на иррациональных ёмкостях — на графе</span>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} disabled={applied >= STEPS.length} title="играть">▶</button>
			{/if}
			<button onclick={step} disabled={applied >= STEPS.length} title="следующий путь">следующий путь</button>
		</div>
	</div>

	<div class="ir__body">
		<svg viewBox="0 0 380 250" class="ir__svg">
			<defs>
				<marker id="ir-arr" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
			</defs>
			<!-- базовые рёбра -->
			{#each E as e}
				{@const s = shorten(N[e.a], N[e.b], 19)}
				{@const m = mid(e.a, e.b)}
				<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} class="edge" class:sp={e.sp !== undefined} class:on={onPath(e.a, e.b)} />
				{#if e.sp !== undefined}
					<g class="cap sp"><rect x={m.x - 24} y={m.y - 9} width="48" height="16" rx="4" /><text x={m.x} y={m.y} dy="0.34em">e{e.sp + 1}: {residSym[e.sp]}/{e.cap}</text></g>
				{:else}
					<text class="cap m" x={m.x} y={m.y - 3} text-anchor="middle">M</text>
				{/if}
			{/each}
			<!-- стрелки направления текущего пути -->
			{#each segs as sg}
				{@const s = shorten(N[sg.a], N[sg.b], 19)}
				<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} class="dir" marker-end="url(#ir-arr)" />
			{/each}
			<!-- узлы -->
			{#each N as n, i}
				<g class="node" class:src={i === 0} class:snk={i === 5} class:on={curNodes.includes(i)}>
					<circle cx={n.x} cy={n.y} r="18" />
					<text x={n.x} y={n.y} dy="0.34em">{n.label}</text>
				</g>
			{/each}
		</svg>

		<div class="ir__panel">
			<div class="stat">
				<div><span>путь</span><b>{cur ? cur.name : '—'}</b></div>
				<div><span>поток |f|</span><b>{F.toFixed(F < 0.001 ? 4 : 3)}</b></div>
			</div>
			<div class="path">{pathText}{#if cur}<span class="push"> · +{cur.push < 0.001 ? cur.push.toExponential(1) : cur.push.toFixed(3)}</span>{/if}</div>
			<div class="line">
				<div class="line-fill" style="width: {Math.min(100, (F / (ASYMP + 0.5)) * 100)}%"></div>
				<div class="mark asymp" style="left: {(ASYMP / (ASYMP + 0.5)) * 100}%"><span>3+2r ≈ {ASYMP.toFixed(2)}</span></div>
				<div class="mark max"><span>2M+1 →</span></div>
			</div>
			<div class="note">
				Особые рёбра e₁, e₂, e₃ (цепочка v₁–v₂–v₃–v₄) имеют ёмкости 1, r, 1. Остаточные идут как
				<b>(r<sup>{g}</sup>, r<sup>{g + 1}</sup>, 0)</b> и сжимаются в r раз; r²=1−r «дозаправляет» остаток, и цикл p₂·p₁·p₂·p₃ повторяется вечно.
				Поток ползёт к <b>3+2r</b>, но не достигает максимума <b>2M+1</b>. Эдмондс–Карп (BFS) сходится всегда.
			</div>
		</div>
	</div>
</div>

<style>
	.ir {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.ir__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.ir__title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--color-parch-100);
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
	.ir__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.ir__svg {
		flex: 1 1 340px;
		min-width: 300px;
		max-width: 480px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: stroke 0.2s;
	}
	.edge.sp {
		stroke: var(--color-parch-muted);
		stroke-width: 3;
	}
	.edge.on {
		stroke: var(--blue);
	}
	.dir {
		stroke: var(--blue);
		stroke-width: 3.5;
		opacity: 0.55;
	}
	.cap rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1;
	}
	.cap text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--blue);
		font-weight: 700;
	}
	.cap.m {
		fill: var(--color-parch-muted);
		font-size: 0.56rem;
		font-family: var(--font-mono);
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.2s, stroke 0.2s;
	}
	.node.src circle { stroke: var(--color-verdant, #4caf7d); }
	.node.snk circle { stroke: var(--blue); fill: color-mix(in srgb, var(--blue) 16%, var(--color-ink-850)); }
	.node.on circle { stroke: var(--blue); stroke-width: 3.5; }
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		fill: var(--color-parch-100);
	}
	.ir__panel {
		flex: 1 1 240px;
		min-width: 220px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.stat {
		display: flex;
		gap: 1.2rem;
	}
	.stat div { display: flex; flex-direction: column; }
	.stat span {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.stat b { font-family: var(--font-display); font-size: 1.3rem; color: var(--blue); }
	.path {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--color-parch-100);
		padding: 0.4rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 7px;
	}
	.push { color: var(--blue); font-weight: 700; }
	.line {
		position: relative;
		height: 0.7rem;
		background: var(--color-ink-800);
		border-radius: 5px;
		margin: 1.3rem 0 0.3rem;
	}
	.line-fill { height: 100%; background: var(--blue); border-radius: 5px; transition: width 0.35s ease; }
	.mark { position: absolute; top: -1.1rem; font-family: var(--font-mono); font-size: 0.56rem; white-space: nowrap; }
	.mark.asymp { transform: translateX(-50%); color: var(--blue); }
	.mark.asymp::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 1.1rem;
		height: 0.7rem;
		border-left: 1.5px dashed var(--blue);
	}
	.mark.max { right: 0; color: var(--color-parch-muted); }
	.note {
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--color-parch-200);
		padding: 0.55rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.note b { color: var(--color-parch-100); }
</style>
