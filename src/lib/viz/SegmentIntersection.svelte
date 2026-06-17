<script lang="ts">
	// Пересечение двух отрезков через ориентации (косые произведения).
	// Отрезок p1p2 (синий) и p3p4 (золото/parch). Концы перетаскиваются мышью.
	// Общий случай: d1·d2 < 0 И d3·d4 < 0. Коллинеарный случай (di == 0):
	// проверяем, лежит ли точка на отрезке (проекция на оба интервала).
	// Степпер прогоняет 4 вычисления ориентации, затем вердикт.
	type Pt = { x: number; y: number };

	const W = 420;
	const H = 230;
	const EPS = 1e-9;

	// встроенные демо-данные (в координатах SVG)
	let p = $state<Pt[]>([
		{ x: 70, y: 60 },   // p1
		{ x: 330, y: 180 }, // p2
		{ x: 90, y: 190 },  // p3
		{ x: 320, y: 55 }   // p4
	]);

	const NAMES = ['P₁', 'P₂', 'P₃', 'P₄'];

	// Косое произведение (b−a)×(c−a). Знак = ориентация тройки a,b,c.
	function cross(a: Pt, b: Pt, c: Pt): number {
		return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
	}
	function sign(v: number): -1 | 0 | 1 {
		if (v > EPS) return 1;
		if (v < -EPS) return -1;
		return 0;
	}
	// Лежит ли c на отрезке ab, ЗНАЯ что тройка коллинеарна (cross≈0).
	function onSegment(a: Pt, b: Pt, c: Pt): boolean {
		return Math.min(a.x, b.x) - EPS <= c.x && c.x <= Math.max(a.x, b.x) + EPS &&
			Math.min(a.y, b.y) - EPS <= c.y && c.y <= Math.max(a.y, b.y) + EPS;
	}

	// Четыре ориентации.
	const p1 = $derived(p[0]);
	const p2 = $derived(p[1]);
	const p3 = $derived(p[2]);
	const p4 = $derived(p[3]);

	const c1 = $derived(cross(p3, p4, p1)); // p1 относительно p3p4
	const c2 = $derived(cross(p3, p4, p2)); // p2 относительно p3p4
	const c3 = $derived(cross(p1, p2, p3)); // p3 относительно p1p2
	const c4 = $derived(cross(p1, p2, p4)); // p4 относительно p1p2

	const d1 = $derived(sign(c1));
	const d2 = $derived(sign(c2));
	const d3 = $derived(sign(c3));
	const d4 = $derived(sign(c4));

	type Verdict = {
		hit: boolean;
		kind: 'proper' | 'touch' | 'collinear' | 'none';
		point: Pt | null;
		note: string;
	};

	const verdict = $derived.by<Verdict>(() => {
		// Общий случай: концы каждого отрезка лежат по разные стороны другого.
		if (d1 !== d2 && d3 !== d4 && d1 !== 0 && d2 !== 0 && d3 !== 0 && d4 !== 0) {
			return { hit: true, kind: 'proper', point: lineIntersect(),
				note: 'Концы каждого отрезка лежат по РАЗНЫЕ стороны другого: ориентации d₁≠d₂ и d₃≠d₄.' };
		}
		// Коллинеарные / касание: какая-то ориентация = 0.
		if (d1 === 0 && onSegment(p3, p4, p1)) return { hit: true, kind: 'touch', point: { ...p1 }, note: 'd₁ = 0: точка P₁ лежит прямо на отрезке P₃P₄ (касание).' };
		if (d2 === 0 && onSegment(p3, p4, p2)) return { hit: true, kind: 'touch', point: { ...p2 }, note: 'd₂ = 0: точка P₂ лежит прямо на отрезке P₃P₄ (касание).' };
		if (d3 === 0 && onSegment(p1, p2, p3)) return { hit: true, kind: 'touch', point: { ...p3 }, note: 'd₃ = 0: точка P₃ лежит прямо на отрезке P₁P₂ (касание).' };
		if (d4 === 0 && onSegment(p1, p2, p4)) return { hit: true, kind: 'touch', point: { ...p4 }, note: 'd₄ = 0: точка P₄ лежит прямо на отрезке P₁P₂ (касание).' };
		if (d1 === 0 && d2 === 0) {
			// Оба отрезка на одной прямой — проверяем перекрытие проекций.
			return collinearOverlap();
		}
		return { hit: false, kind: 'none', point: null,
			note: 'Хотя бы у одного отрезка оба конца с одной стороны от другого — пересечения нет.' };
	});

	// Пересечение прямых (для общего случая гарантированно существует и единственно).
	function lineIntersect(): Pt {
		const r = { x: p2.x - p1.x, y: p2.y - p1.y };
		const s = { x: p4.x - p3.x, y: p4.y - p3.y };
		const denom = r.x * s.y - r.y * s.x;
		const t = ((p3.x - p1.x) * s.y - (p3.y - p1.y) * s.x) / denom;
		return { x: p1.x + t * r.x, y: p1.y + t * r.y };
	}

	// Коллинеарный случай: перекрываются ли интервалы по проекции на доминантную ось.
	function collinearOverlap(): Verdict {
		const horiz = Math.abs(p2.x - p1.x) >= Math.abs(p2.y - p1.y);
		const key = (q: Pt) => (horiz ? q.x : q.y);
		const aLo = Math.min(key(p1), key(p2)), aHi = Math.max(key(p1), key(p2));
		const bLo = Math.min(key(p3), key(p4)), bHi = Math.max(key(p3), key(p4));
		const lo = Math.max(aLo, bLo), hi = Math.min(aHi, bHi);
		if (lo <= hi + EPS) {
			return { hit: true, kind: 'collinear', point: null,
				note: 'Все 4 ориентации = 0: отрезки на одной прямой и их проекции перекрываются — общий участок.' };
		}
		return { hit: false, kind: 'none', point: null,
			note: 'Отрезки на одной прямой, но их проекции НЕ перекрываются — пересечения нет.' };
	}

	// ---- степпер: раскрываем 4 проверки ориентации, затем вердикт ----
	const TOTAL = 5; // 0=исходно, 1..4 ориентации, затем вердикт на 4
	let step = $state(0);
	let playing = $state(false);

	const oriRows = $derived([
		{ name: 'd₁', who: 'P₁ vs P₃P₄', raw: c1, s: d1 },
		{ name: 'd₂', who: 'P₂ vs P₃P₄', raw: c2, s: d2 },
		{ name: 'd₃', who: 'P₃ vs P₁P₂', raw: c3, s: d3 },
		{ name: 'd₄', who: 'P₄ vs P₁P₂', raw: c4, s: d4 }
	]);
	const shown = $derived(Math.min(step, 4)); // сколько строк ориентаций раскрыто
	const verdictReady = $derived(step >= 4);

	function sideWord(s: -1 | 0 | 1): string {
		return s > 0 ? 'слева (+)' : s < 0 ? 'справа (−)' : 'на прямой (0)';
	}

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (step >= TOTAL - 1) { stop(); return; }
			step += 1;
		}, 700);
	}
	function reset() {
		stop();
		step = 0;
	}

	// ---- выбор/перетаскивание концов ----
	let active = $state(0);
	let svgEl: SVGSVGElement | null = $state(null);

	function clientToSvg(evt: { clientX: number; clientY: number }): Pt {
		if (!svgEl) return { x: 0, y: 0 };
		const r = svgEl.getBoundingClientRect();
		const x = ((evt.clientX - r.left) / r.width) * W;
		const y = ((evt.clientY - r.top) / r.height) * H;
		return { x: clamp(x, 8, W - 8), y: clamp(y, 8, H - 8) };
	}
	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

	let dragging = $state(-1);
	function startDrag(i: number, evt: PointerEvent) {
		dragging = i;
		active = i;
		(evt.target as Element).setPointerCapture?.(evt.pointerId);
		evt.preventDefault();
	}
	function moveDrag(evt: PointerEvent) {
		if (dragging < 0) return;
		const q = clientToSvg(evt);
		p[dragging] = q;
	}
	function endDrag() {
		dragging = -1;
	}
	// клик по холсту перемещает выбранный конец
	function canvasClick(evt: MouseEvent) {
		if (dragging >= 0) return;
		p[active] = clientToSvg(evt);
	}
	// ползунки выбранного конца
	function setX(v: number) { p[active] = { x: clamp(v, 8, W - 8), y: p[active].y }; }
	function setY(v: number) { p[active] = { x: p[active].x, y: clamp(v, 8, H - 8) }; }
</script>

<div class="si">
	<div class="si__bar">
		<div class="seg">
			{#each NAMES as nm, i}
				<button class:on={active === i} class:blue={i < 2} onclick={() => (active = i)}>{nm}</button>
			{/each}
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); step = Math.max(0, step - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); step = Math.min(TOTAL - 1, step + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{shown}/4</span>
		</div>
	</div>

	<div class="si__body">
		<div class="si__canvas">
			<svg bind:this={svgEl} viewBox="0 0 {W} {H}" class="si__svg" onclick={canvasClick} role="presentation">
				<!-- продолжение прямых (бледно) -->
				<line class="guide" x1={p1.x - (p2.x - p1.x) * 2} y1={p1.y - (p2.y - p1.y) * 2}
					x2={p2.x + (p2.x - p1.x) * 2} y2={p2.y + (p2.y - p1.y) * 2} />
				<line class="guide" x1={p3.x - (p4.x - p3.x) * 2} y1={p3.y - (p4.y - p3.y) * 2}
					x2={p4.x + (p4.x - p3.x) * 2} y2={p4.y + (p4.y - p3.y) * 2} />

				<!-- отрезки -->
				<line class="seg-a" class:hit={verdict.hit} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
				<line class="seg-b" class:hit={verdict.hit} x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} />

				<!-- точка пересечения -->
				{#if verdict.point}
					<circle class="xpoint" cx={verdict.point.x} cy={verdict.point.y} r="6" />
				{/if}

				<!-- концы -->
				{#each p as q, i}
					<g class="end" class:blue={i < 2} class:sel={active === i}
						onpointerdown={(e) => startDrag(i, e)}
						onpointermove={moveDrag}
						onpointerup={endDrag}
						role="button" tabindex="-1">
						<circle cx={q.x} cy={q.y} r="9" />
						<text x={q.x} y={q.y - 14}>{NAMES[i]}</text>
					</g>
				{/each}
			</svg>
			<div class="hint">Выберите конец и двигайте его мышью по холсту или ползунками.</div>
		</div>

		<div class="si__panel">
			<div class="ori">
				{#each oriRows as r, i}
					<div class="orow" class:dim={i >= shown} class:zero={r.s === 0 && i < shown}>
						<span class="onm">{r.name}</span>
						<span class="owho">{r.who}</span>
						{#if i < shown}
							<span class="oval">{r.raw > 0 ? '+' : r.raw < 0 ? '−' : '0'}</span>
							<span class="oside">{sideWord(r.s)}</span>
						{:else}
							<span class="oval">·</span>
							<span class="oside">…</span>
						{/if}
					</div>
				{/each}
			</div>

			<div class="cmp" class:show={verdictReady}>
				{#if verdictReady}
					d₁≠d₂: <b class:ok={d1 !== d2}>{d1 !== d2 ? 'да' : 'нет'}</b>
					· d₃≠d₄: <b class:ok={d3 !== d4}>{d3 !== d4 ? 'да' : 'нет'}</b>
				{:else}
					сравнение ориентаций по разные стороны…
				{/if}
			</div>

			{#if verdictReady}
				<div class="verdict" class:yes={verdict.hit} class:no={!verdict.hit}>
					{verdict.hit ? '✓ пересекаются' : '✗ не пересекаются'}
					{#if verdict.kind === 'touch'}<small>касание в точке</small>{/if}
					{#if verdict.kind === 'collinear'}<small>общий участок</small>{/if}
					{#if verdict.point}<small class="coord">({verdict.point.x.toFixed(0)}, {verdict.point.y.toFixed(0)})</small>{/if}
				</div>
			{/if}

			<div class="note">{verdictReady ? verdict.note : 'Нажимайте «вперёд», чтобы по очереди вычислить 4 ориентации.'}</div>
		</div>
	</div>

	<div class="si__sliders">
		<span class="sl-lbl">Выбран <b>{NAMES[active]}</b></span>
		<label>x <input type="range" min="8" max={W - 8} value={p[active].x} oninput={(e) => setX(+e.currentTarget.value)} /></label>
		<label>y <input type="range" min="8" max={H - 8} value={p[active].y} oninput={(e) => setY(+e.currentTarget.value)} /></label>
	</div>
</div>

<style>
	.si {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.si__bar {
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
		gap: 0.3rem;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		min-width: 2.2rem;
		padding: 0.32rem 0.5rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button.blue { color: var(--blue); border-color: var(--blue); }
	.seg button.on { background: var(--blue); color: #fff; border-color: var(--blue); }
	.seg button.on:not(.blue) {
		background: var(--color-parch-muted);
		color: var(--color-ink-850);
		border-color: var(--color-parch-muted);
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
	.si__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.si__canvas {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 460px;
	}
	.si__svg {
		width: 100%;
		height: auto;
		background: var(--color-ink-850);
		border-radius: 8px;
		touch-action: none;
		cursor: crosshair;
	}
	.guide {
		stroke: var(--color-ink-700);
		stroke-width: 1;
		stroke-dasharray: 3 4;
	}
	.seg-a {
		stroke: var(--blue);
		stroke-width: 3;
		transition: stroke-width 0.2s;
	}
	.seg-b {
		stroke: var(--color-parch-muted);
		stroke-width: 3;
		transition: stroke-width 0.2s;
	}
	.seg-a.hit, .seg-b.hit { stroke-width: 4; }
	.xpoint {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
	}
	.end circle {
		fill: var(--color-ink-850);
		stroke: var(--color-parch-muted);
		stroke-width: 2.5;
		cursor: grab;
		transition: fill 0.15s, stroke 0.15s;
	}
	.end.blue circle { stroke: var(--blue); }
	.end.sel circle { fill: var(--color-parch-100); }
	.end text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		fill: var(--color-parch-200);
		pointer-events: none;
	}
	.hint {
		margin-top: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.si__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.ori {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.orow {
		display: grid;
		grid-template-columns: 1.7rem 1fr auto auto;
		align-items: baseline;
		gap: 0.5rem;
		font-size: 0.74rem;
		padding: 0.18rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
		transition: opacity 0.2s;
	}
	.orow.dim { opacity: 0.4; }
	.onm {
		font-family: var(--font-display);
		font-weight: 800;
		color: var(--color-parch-100);
	}
	.owho {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.oval {
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--blue);
		min-width: 0.9rem;
		text-align: center;
	}
	.orow.zero .oval { color: var(--color-parch-muted); }
	.oside {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-200);
		min-width: 5.4rem;
		text-align: right;
	}
	.cmp {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--color-parch-muted);
		min-height: 1.1rem;
	}
	.cmp b { color: var(--color-parch-200); }
	.cmp b.ok { color: var(--blue); }
	.verdict {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.95rem;
		padding: 0.45rem 0.6rem;
		border-radius: 8px;
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.verdict.yes {
		background: var(--blue-pale);
		color: var(--blue);
		border: 1.5px solid var(--blue);
	}
	.verdict.no {
		background: var(--color-ink-800);
		color: var(--color-parch-muted);
		border: 1.5px solid var(--color-ink-500);
	}
	.verdict small {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 0.64rem;
	}
	.verdict .coord { color: inherit; opacity: 0.85; }
	.note {
		margin-top: auto;
		font-size: 0.82rem;
		color: var(--color-parch-200);
		padding: 0.55rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.si__sliders {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 1rem 0.9rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.sl-lbl {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
	}
	.sl-lbl b { color: var(--color-parch-100); }
	.si__sliders label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex: 1 1 140px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-200);
	}
	.si__sliders input[type='range'] {
		flex: 1;
		accent-color: var(--blue);
	}
</style>
