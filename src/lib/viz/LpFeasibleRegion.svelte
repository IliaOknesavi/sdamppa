<script lang="ts">
	// 2D линейное программирование: область допустимых решений (выпуклый
	// многоугольник из неравенств), линия уровня целевой функции Z = cx·x + cy·y
	// двигается ползунком, оптимум подсвечивается в вершине. Ползунки коэффициентов
	// цели, активные (тугие) ограничения подсвечиваются. Чистый инлайн SVG, без deps.

	type Constraint = { a: number; b: number; c: number; label: string }; // a·x + b·y ≤ c

	// Ограничения (все вида ≤). x ≥ 0, y ≥ 0 заданы неявно границами осей.
	const constraints: Constraint[] = [
		{ a: 1, b: 2, c: 14, label: 'x + 2y ≤ 14' },
		{ a: 3, b: 1, c: 18, label: '3x + y ≤ 18' },
		{ a: 1, b: 1, c: 8, label: 'x + y ≤ 8' }
	];

	const X_MAX = 8; // диапазон осей в координатах задачи
	const Y_MAX = 8;

	// --- геометрия области: пересекаем полуплоскости методом отсечения (Sutherland–Hodgman)
	type P = { x: number; y: number };

	function clip(poly: P[], a: number, b: number, c: number): P[] {
		// оставляем точки, где a·x + b·y ≤ c
		const out: P[] = [];
		const inside = (p: P) => a * p.x + b * p.y <= c + 1e-9;
		for (let i = 0; i < poly.length; i++) {
			const cur = poly[i];
			const prev = poly[(i + poly.length - 1) % poly.length];
			const curIn = inside(cur);
			const prevIn = inside(prev);
			if (curIn !== prevIn) {
				// точка пересечения ребра prev→cur с прямой a·x + b·y = c
				const dpx = cur.x - prev.x;
				const dpy = cur.y - prev.y;
				const denom = a * dpx + b * dpy;
				const t = denom === 0 ? 0 : (c - (a * prev.x + b * prev.y)) / denom;
				out.push({ x: prev.x + t * dpx, y: prev.y + t * dpy });
			}
			if (curIn) out.push(cur);
		}
		return out;
	}

	// стартовый прямоугольник из x ≥ 0, y ≥ 0 и осевых границ
	function buildРegion(): P[] {
		let poly: P[] = [
			{ x: 0, y: 0 },
			{ x: X_MAX, y: 0 },
			{ x: X_MAX, y: Y_MAX },
			{ x: 0, y: Y_MAX }
		];
		for (const k of constraints) poly = clip(poly, k.a, k.b, k.c);
		return poly;
	}
	const region: P[] = buildРegion();

	// --- экран
	const W = 252; // ширина области графика
	const H = 230; // высота области графика
	const PAD_L = 30;
	const PAD_B = 26;
	const PAD_T = 12;
	const PAD_R = 12;
	const plotW = W - PAD_L - PAD_R;
	const plotH = H - PAD_T - PAD_B;
	const sx = (x: number) => PAD_L + (x / X_MAX) * plotW;
	const sy = (y: number) => PAD_T + plotH - (y / Y_MAX) * plotH;

	const regionPath = $derived(
		region.length
			? region.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x)} ${sy(p.y)}`).join(' ') + ' Z'
			: ''
	);

	// --- целевая функция: коэффициенты под ползунками
	let cx = $state(3);
	let cy = $state(2);
	const objVal = (p: P) => cx * p.x + cy * p.y;

	// оптимум (максимум) — на вершине области
	const zValues = $derived(region.map(objVal));
	const zMin = $derived(region.length ? Math.min(...zValues) : 0);
	const zMax = $derived(region.length ? Math.max(...zValues) : 0);
	const optIdx = $derived(
		region.length ? zValues.indexOf(Math.max(...zValues)) : -1
	);
	const opt = $derived(optIdx >= 0 ? region[optIdx] : null);

	// --- ползунок линии уровня: Z от zMin до zMax
	let z = $state(0);
	let playing = $state(false);
	// держим z в пределах при смене коэффициентов
	const zClamped = $derived(Math.max(zMin, Math.min(zMax, z)));

	// точки пересечения линии cx·x + cy·y = Z с рамкой графика → отрезок
	function levelSegment(level: number): [P, P] | null {
		const pts: P[] = [];
		const eps = 1e-9;
		// пересечения с x=0, x=X_MAX, y=0, y=Y_MAX внутри рамки
		if (Math.abs(cy) > eps) {
			for (const X of [0, X_MAX]) {
				const Y = (level - cx * X) / cy;
				if (Y >= -eps && Y <= Y_MAX + eps) pts.push({ x: X, y: Y });
			}
		}
		if (Math.abs(cx) > eps) {
			for (const Y of [0, Y_MAX]) {
				const X = (level - cy * Y) / cx;
				if (X >= -eps && X <= X_MAX + eps) pts.push({ x: X, y: Y });
			}
		}
		if (pts.length < 2) return null;
		// берём две самые далёкие точки
		let best: [P, P] = [pts[0], pts[1]];
		let bd = -1;
		for (let i = 0; i < pts.length; i++)
			for (let j = i + 1; j < pts.length; j++) {
				const d = (pts[i].x - pts[j].x) ** 2 + (pts[i].y - pts[j].y) ** 2;
				if (d > bd) {
					bd = d;
					best = [pts[i], pts[j]];
				}
			}
		return best;
	}
	const levelSeg = $derived(levelSegment(zClamped));

	// активные ограничения: тугие в текущей точке оптимума (a·x + b·y = c)
	function isActive(k: Constraint): boolean {
		if (!opt) return false;
		return Math.abs(k.a * opt.x + k.b * opt.y - k.c) < 1e-6;
	}
	// уровень достиг оптимума?
	const atOptimum = $derived(zMax - zClamped < 1e-6);

	// --- анимация хода линии уровня
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		if (z >= zMax - 1e-6) z = zMin; // с начала, если уже в конце
		playing = true;
		timer = setInterval(() => {
			const span = zMax - zMin || 1;
			const next = zClamped + span / 24;
			if (next >= zMax) {
				z = zMax;
				stop();
				return;
			}
			z = next;
		}, 90);
	}
	function reset() {
		stop();
		z = zMin;
	}
	function step() {
		stop();
		const span = zMax - zMin || 1;
		z = Math.min(zMax, zClamped + span / 12);
	}

	// граничная прямая ограничения a·x + b·y = c, обрезанная рамкой [0,X_MAX]×[0,Y_MAX]
	function levelSegmentFor(k: Constraint): [P, P] | null {
		const pts: P[] = [];
		const eps = 1e-9;
		if (Math.abs(k.b) > eps) {
			for (const X of [0, X_MAX]) {
				const Y = (k.c - k.a * X) / k.b;
				if (Y >= -eps && Y <= Y_MAX + eps) pts.push({ x: X, y: Y });
			}
		}
		if (Math.abs(k.a) > eps) {
			for (const Y of [0, Y_MAX]) {
				const X = (k.c - k.b * Y) / k.a;
				if (X >= -eps && X <= X_MAX + eps) pts.push({ x: X, y: Y });
			}
		}
		if (pts.length < 2) return null;
		let best: [P, P] = [pts[0], pts[1]];
		let bd = -1;
		for (let i = 0; i < pts.length; i++)
			for (let j = i + 1; j < pts.length; j++) {
				const d = (pts[i].x - pts[j].x) ** 2 + (pts[i].y - pts[j].y) ** 2;
				if (d > bd) {
					bd = d;
					best = [pts[i], pts[j]];
				}
			}
		return best;
	}

	// сетка осей
	const ticks = [0, 2, 4, 6, 8];

	// формат
	const f = (n: number) => (Math.round(n * 100) / 100).toString();
</script>

<div class="lp">
	<div class="lp__bar">
		<span class="title">Линейное программирование · max Z</span>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={step} title="шаг">▶▶</button>
		</div>
	</div>

	<div class="lp__body">
		<svg viewBox="0 0 {W} {H}" class="lp__svg" role="img" aria-label="Область допустимых решений">
			<!-- сетка -->
			{#each ticks as t}
				<line class="grid" x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(Y_MAX)} />
				<line class="grid" x1={sx(0)} y1={sy(t)} x2={sx(X_MAX)} y2={sy(t)} />
			{/each}

			<!-- область допустимых решений -->
			{#if regionPath}
				<path class="region" d={regionPath} />
			{/if}

			<!-- граничные прямые ограничений (тугие — ярко) -->
			{#each constraints as k}
				{@const seg = levelSegmentFor(k)}
				{#if seg}
					<line
						class="cline"
						class:active={isActive(k)}
						x1={sx(seg[0].x)}
						y1={sy(seg[0].y)}
						x2={sx(seg[1].x)}
						y2={sy(seg[1].y)}
					/>
				{/if}
			{/each}

			<!-- линия уровня целевой функции -->
			{#if levelSeg}
				<line
					class="level"
					class:opt={atOptimum}
					x1={sx(levelSeg[0].x)}
					y1={sy(levelSeg[0].y)}
					x2={sx(levelSeg[1].x)}
					y2={sy(levelSeg[1].y)}
				/>
			{/if}

			<!-- вершины области -->
			{#each region as v, i}
				<circle class="vert" class:opt={i === optIdx && atOptimum} cx={sx(v.x)} cy={sy(v.y)} r={i === optIdx && atOptimum ? 5 : 3} />
			{/each}

			<!-- подсветка оптимума -->
			{#if opt}
				<circle class="optring" class:show={atOptimum} cx={sx(opt.x)} cy={sy(opt.y)} r="8" />
			{/if}

			<!-- оси -->
			<line class="axis" x1={sx(0)} y1={sy(0)} x2={sx(X_MAX)} y2={sy(0)} />
			<line class="axis" x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(Y_MAX)} />
			{#each ticks as t}
				{#if t > 0}
					<text class="tick" x={sx(t)} y={sy(0) + 12}>{t}</text>
					<text class="tick" x={sx(0) - 7} y={sy(t) + 3}>{t}</text>
				{/if}
			{/each}
			<text class="axlabel" x={sx(X_MAX)} y={sy(0) + 12}>x</text>
			<text class="axlabel" x={sx(0) - 8} y={sy(Y_MAX) - 2}>y</text>
		</svg>

		<div class="lp__panel">
			<div class="obj">
				Z = {f(cx)}·x + {f(cy)}·y
			</div>

			<div class="slider">
				<div class="srow">
					<span class="lbl">cₓ (коэф. x)</span><b>{f(cx)}</b>
				</div>
				<input type="range" min="0" max="6" step="0.5" bind:value={cx} oninput={stop} />
			</div>
			<div class="slider">
				<div class="srow">
					<span class="lbl">c_y (коэф. y)</span><b>{f(cy)}</b>
				</div>
				<input type="range" min="0" max="6" step="0.5" bind:value={cy} oninput={stop} />
			</div>
			<div class="slider">
				<div class="srow">
					<span class="lbl">уровень Z</span><b>{f(zClamped)}</b>
				</div>
				<input type="range" min={zMin} max={zMax} step="0.1" bind:value={z} oninput={stop} />
			</div>

			<div class="cons">
				{#each constraints as k}
					<div class="con" class:active={isActive(k)}>
						<i></i><span>{k.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="lp__note">
		{#if !region.length}
			Область пуста — ограничения несовместны.
		{:else if atOptimum && opt}
			Оптимум в вершине ({f(opt.x)}; {f(opt.y)}), Z* = {f(zMax)}. Активны выделенные ограничения.
		{:else}
			Двигай уровень Z или ползунки цели — линия скользит до крайней вершины области.
		{/if}
	</div>
</div>

<style>
	.lp {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.lp__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.6rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
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
	.lp__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.lp__svg {
		flex: 1 1 252px;
		min-width: 230px;
		max-width: 320px;
		height: auto;
	}
	.grid {
		stroke: var(--color-ink-700);
		stroke-width: 1;
	}
	.axis {
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
	}
	.tick {
		fill: var(--color-parch-muted);
		font-family: var(--font-mono);
		font-size: 0.56rem;
		text-anchor: middle;
	}
	.axlabel {
		fill: var(--color-parch-200);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-anchor: middle;
		font-weight: 700;
	}
	.region {
		fill: var(--blue-pale);
		fill-opacity: 0.55;
		stroke: var(--blue);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.cline {
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		stroke-dasharray: 4 3;
		transition: stroke 0.2s, stroke-width 0.2s;
	}
	.cline.active {
		stroke: var(--blue);
		stroke-width: 2.5;
		stroke-dasharray: none;
	}
	.level {
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
		transition: stroke 0.2s;
	}
	.level.opt {
		stroke: var(--blue);
		stroke-width: 3;
	}
	.vert {
		fill: var(--color-parch-100);
		transition: r 0.2s, fill 0.2s;
	}
	.vert.opt {
		fill: var(--blue);
	}
	.optring {
		fill: none;
		stroke: var(--blue);
		stroke-width: 2;
		opacity: 0;
		transition: opacity 0.25s;
	}
	.optring.show {
		opacity: 1;
	}
	.lp__panel {
		flex: 1 1 200px;
		min-width: 180px;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.obj {
		font-family: var(--font-mono);
		font-size: 0.86rem;
		font-weight: 700;
		color: var(--blue);
		padding: 0.4rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.slider {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.srow {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.srow .lbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-parch-muted);
	}
	.srow b {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-100);
	}
	.slider input[type='range'] {
		width: 100%;
		accent-color: var(--blue);
		margin: 0;
	}
	.cons {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.2rem;
	}
	.con {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
		transition: color 0.2s;
	}
	.con i {
		width: 0.8rem;
		height: 0;
		border-top: 1.5px dashed var(--color-ink-500);
		flex: none;
	}
	.con.active {
		color: var(--blue);
		font-weight: 700;
	}
	.con.active i {
		border-top: 2.5px solid var(--blue);
	}
	.lp__note {
		padding: 0.55rem 0.9rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		font-size: 0.78rem;
		color: var(--color-parch-200);
	}
</style>
