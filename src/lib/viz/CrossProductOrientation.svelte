<script lang="ts">
	// Косое произведение (B−A) × (C−A): z-компонента задаёт ориентацию тройки
	// точек A, B, C. Точку C тащим мышью/тачем или двигаем ползунками; знак
	// определяет поворот: >0 — против часовой (левый), <0 — по часовой (правый),
	// =0 — коллинеарны. Базовый примитив теста поворота в выпуклой оболочке.
	// Чистый инлайн SVG, без внешних импортов. Тот же визуальный язык, что и
	// GraphTraversal / GraphTypes.
	type Pt = { x: number; y: number };

	const W = 420;
	const H = 290;

	// фиксированные A и B (экранные координаты SVG)
	const A: Pt = { x: 95, y: 205 };
	const B: Pt = { x: 300, y: 120 };

	// сцены для пошагового авто-демо: C проходит слева → на прямой → справа
	const TOUR: Pt[] = [
		{ x: 175, y: 70 },   // явный левый поворот
		{ x: 245, y: 105 },  // ближе к прямой, всё ещё левый
		{ x: 208, y: 158 },  // ровно на прямой AB (коллинеарны)
		{ x: 165, y: 200 },  // правый поворот
		{ x: 110, y: 120 }   // снова левый, с другого края
	];

	let cx = $state(175);
	let cy = $state(70);
	let idx = $state(0);
	let playing = $state(false);
	let dragging = $state(false);

	const C = $derived<Pt>({ x: cx, y: cy });

	// векторы от A; ось y экранная (вниз), поэтому знак z инвертируем,
	// чтобы «левый поворот» совпадал с математическим против часовой.
	const ux = $derived(B.x - A.x);
	const uy = $derived(B.y - A.y);
	const vx = $derived(C.x - A.x);
	const vy = $derived(C.y - A.y);
	// z экранного крест-произведения: ux*vy − uy*vx. Инвертируем -> матем. ось.
	const crossScreen = $derived(ux * vy - uy * vx);
	const cross = $derived(-crossScreen);

	const EPS = 60; // порог «коллинеарности» в экранных единицах (площадь×2)
	const orient = $derived<'left' | 'right' | 'col'>(
		cross > EPS ? 'left' : cross < -EPS ? 'right' : 'col'
	);
	const orientLabel = $derived(
		orient === 'left'
			? 'Левый поворот · против часовой'
			: orient === 'right'
				? 'Правый поворот · по часовой'
				: 'Коллинеарны · поворота нет'
	);
	const orientColor = $derived(
		orient === 'left' ? 'var(--blue)' : orient === 'right' ? 'var(--color-gold-500, #d99a2b)' : 'var(--color-parch-muted)'
	);

	// площадь треугольника ABC = |cross| / 2 (в экранных единицах)
	const area = $derived(Math.abs(cross) / 2);

	// центроид — точка привязки дуги-стрелки поворота
	const gx = $derived((A.x + B.x + C.x) / 3);
	const gy = $derived((A.y + B.y + C.y) / 3);

	// дуга-стрелка направления обхода A→B→C: рисуем маленький полукруг
	// у центроида, направление зависит от знака.
	function turnArc(): string {
		const r = 16;
		// для левого (CCW на экране с инверсией = по часовой на самом SVG)
		// рисуем дугу так, чтобы наконечник указывал направление обхода
		const sweep = orient === 'left' ? 0 : 1;
		const x1 = gx - r, y1 = gy;
		const x2 = gx + r, y2 = gy;
		return `M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`;
	}

	// ----- управление -----
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function applyTour(i: number) {
		const p = TOUR[i];
		cx = p.x;
		cy = p.y;
	}
	function play() {
		stop();
		dragging = false;
		playing = true;
		applyTour(idx);
		timer = setInterval(() => {
			if (idx >= TOUR.length - 1) {
				stop();
				return;
			}
			idx += 1;
			applyTour(idx);
		}, 1100);
	}
	function reset() {
		stop();
		idx = 0;
		applyTour(0);
	}
	function stepBack() {
		stop();
		idx = Math.max(0, idx - 1);
		applyTour(idx);
	}
	function stepFwd() {
		stop();
		idx = Math.min(TOUR.length - 1, idx + 1);
		applyTour(idx);
	}

	// ----- перетаскивание C по SVG -----
	let svgEl: SVGSVGElement | undefined;
	function toLocal(ev: PointerEvent): Pt {
		const r = svgEl!.getBoundingClientRect();
		const x = ((ev.clientX - r.left) / r.width) * W;
		const y = ((ev.clientY - r.top) / r.height) * H;
		return { x, y };
	}
	function clamp(v: number, lo: number, hi: number): number {
		return Math.max(lo, Math.min(hi, v));
	}
	function startDrag(ev: PointerEvent) {
		stop();
		dragging = true;
		(ev.target as Element).setPointerCapture?.(ev.pointerId);
		const p = toLocal(ev);
		cx = clamp(Math.round(p.x), 16, W - 16);
		cy = clamp(Math.round(p.y), 16, H - 16);
	}
	function moveDrag(ev: PointerEvent) {
		if (!dragging) return;
		const p = toLocal(ev);
		cx = clamp(Math.round(p.x), 16, W - 16);
		cy = clamp(Math.round(p.y), 16, H - 16);
	}
	function endDrag() {
		dragging = false;
	}
</script>

<div class="cp">
	<div class="cp__bar">
		<div class="title">
			Косое произведение&nbsp;<code>(B−A) × (C−A)</code>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={stepBack} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={stepFwd} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{TOUR.length - 1}</span>
		</div>
	</div>

	<div class="cp__body">
		<svg
			bind:this={svgEl}
			viewBox="0 0 {W} {H}"
			class="cp__svg"
			onpointermove={moveDrag}
			onpointerup={endDrag}
			onpointerleave={endDrag}
		>
			<defs>
				<marker id="cp-arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
				<marker id="cp-arr-turn" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
					<path d="M0,0 L6.5,3 L0,6 z" fill={orientColor} />
				</marker>
			</defs>

			<!-- заливка треугольника: цвет по ориентации -->
			<polygon
				points="{A.x},{A.y} {B.x},{B.y} {C.x},{C.y}"
				class="tri {orient}"
			/>

			<!-- продолжение прямой AB (ориентир коллинеарности) -->
			<line
				class="guide"
				x1={A.x - ux * 1.4} y1={A.y - uy * 1.4}
				x2={A.x + ux * 1.9} y2={A.y + uy * 1.9}
			/>

			<!-- вектор B−A -->
			<line class="vec base" x1={A.x} y1={A.y} x2={B.x} y2={B.y} marker-end="url(#cp-arr)" />
			<!-- вектор C−A -->
			<line class="vec to-c" x1={A.x} y1={A.y} x2={C.x} y2={C.y} marker-end="url(#cp-arr)" />

			<!-- дуга-стрелка направления поворота A→B→C -->
			{#if orient !== 'col'}
				<path class="turn" d={turnArc()} fill="none" marker-end="url(#cp-arr-turn)" style="stroke: {orientColor}" />
			{/if}

			<!-- точки -->
			<g class="pt fixed">
				<circle cx={A.x} cy={A.y} r="9" />
				<text x={A.x - 14} y={A.y + 4}>A</text>
			</g>
			<g class="pt fixed">
				<circle cx={B.x} cy={B.y} r="9" />
				<text x={B.x + 12} y={B.y - 8}>B</text>
			</g>
			<g class="pt drag {orient}" class:active={dragging}>
				<circle cx={C.x} cy={C.y} r="11" onpointerdown={startDrag} />
				<text x={C.x + 14} y={C.y + 4}>C</text>
			</g>

			<text class="hint" x={W / 2} y={H - 8}>тащи точку C или двигай ползунки</text>
		</svg>

		<div class="cp__panel">
			<div class="verdict" style="border-color: {orientColor}">
				<span class="vlbl" style="color: {orientColor}">{orientLabel}</span>
			</div>

			<div class="calc">
				<div class="row">
					<span>B − A</span><b>({ux}, {uy})</b>
				</div>
				<div class="row">
					<span>C − A</span><b>({vx}, {vy})</b>
				</div>
				<div class="row big">
					<span>z = (B−A)×(C−A)</span><b style="color: {orientColor}">{cross}</b>
				</div>
				<div class="row">
					<span>знак z</span>
					<b style="color: {orientColor}">{cross > EPS ? '> 0' : cross < -EPS ? '< 0' : '≈ 0'}</b>
				</div>
				<div class="row">
					<span>площадь △ABC</span><b>{area.toFixed(0)}</b>
				</div>
			</div>

			<div class="sliders">
				<label>
					<span>C.x = {cx}</span>
					<input type="range" min="16" max={W - 16} bind:value={cx} oninput={stop} />
				</label>
				<label>
					<span>C.y = {cy}</span>
					<input type="range" min="16" max={H - 16} bind:value={cy} oninput={stop} />
				</label>
			</div>
		</div>
	</div>

	<div class="cp__foot">
		<span class="legend l-left">z &gt; 0 — левый (CCW)</span>
		<span class="legend l-col">z = 0 — на прямой</span>
		<span class="legend l-right">z &lt; 0 — правый (CW)</span>
		<span class="note">
			Знак z — это тест поворота: алгоритм Грэхема/Эндрю оставляет только левые повороты, выкидывая правые, и так строит выпуклую оболочку.
		</span>
	</div>
</div>

<style>
	.cp {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.cp__bar {
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
		font-weight: 700;
		font-size: 0.82rem;
		color: var(--color-parch-100);
	}
	.title code {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--blue);
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
	.cp__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.cp__svg {
		flex: 1 1 330px;
		min-width: 280px;
		max-width: 470px;
		height: auto;
		touch-action: none;
		user-select: none;
	}

	.tri {
		stroke-width: 1.5;
		transition: fill 0.2s, stroke 0.2s;
	}
	.tri.left {
		fill: color-mix(in srgb, var(--blue) 18%, transparent);
		stroke: var(--blue);
	}
	.tri.right {
		fill: color-mix(in srgb, var(--color-gold-500, #d99a2b) 18%, transparent);
		stroke: var(--color-gold-500, #d99a2b);
	}
	.tri.col {
		fill: none;
		stroke: var(--color-parch-muted);
	}

	.guide {
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		stroke-dasharray: 5 5;
	}
	.vec {
		stroke-width: 3;
	}
	.vec.base {
		stroke: var(--blue);
	}
	.vec.to-c {
		stroke: var(--blue-pale);
	}
	.turn {
		stroke-width: 2.5;
		transition: stroke 0.2s;
	}

	.pt circle {
		stroke-width: 2.5;
		transition: fill 0.2s, stroke 0.2s;
	}
	.pt text {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.95rem;
		fill: var(--color-parch-100);
		text-anchor: middle;
	}
	.pt.fixed circle {
		fill: var(--color-ink-850);
		stroke: var(--color-parch-200);
	}
	.pt.drag circle {
		cursor: grab;
		fill: var(--blue);
		stroke: var(--color-parch-100);
	}
	.pt.drag.active circle {
		cursor: grabbing;
	}
	.pt.drag.left circle {
		fill: var(--blue);
		stroke: var(--blue-pale);
	}
	.pt.drag.right circle {
		fill: var(--color-gold-500, #d99a2b);
		stroke: var(--color-parch-100);
	}
	.pt.drag.col circle {
		fill: var(--color-parch-muted);
		stroke: var(--color-parch-100);
	}

	.hint {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
	}

	.cp__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.verdict {
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		padding: 0.5rem 0.6rem;
		background: var(--color-ink-800);
	}
	.vlbl {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.86rem;
	}
	.calc {
		display: flex;
		flex-direction: column;
		gap: 0.26rem;
	}
	.calc .row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 0.78rem;
		padding: 0.18rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.calc .row span {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-parch-muted);
	}
	.calc .row b {
		font-family: var(--font-mono);
		color: var(--color-parch-100);
	}
	.calc .row.big b {
		font-size: 0.98rem;
		font-weight: 800;
	}
	.sliders {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: auto;
	}
	.sliders label {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.sliders span {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
	}
	.sliders input[type='range'] {
		width: 100%;
		accent-color: var(--blue);
	}

	.cp__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.9rem;
		padding: 0.7rem 1rem 0.9rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.legend {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		font-weight: 700;
		padding-left: 0.9rem;
		position: relative;
	}
	.legend::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.18em;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 2px;
	}
	.l-left { color: var(--blue); }
	.l-left::before { background: var(--blue); }
	.l-right { color: var(--color-gold-500, #d99a2b); }
	.l-right::before { background: var(--color-gold-500, #d99a2b); }
	.l-col { color: var(--color-parch-muted); }
	.l-col::before { background: var(--color-parch-muted); }
	.note {
		flex: 1 1 100%;
		font-size: 0.78rem;
		color: var(--color-parch-200);
		border-left: 3px solid var(--blue);
		padding: 0.4rem 0.6rem;
		background: var(--color-ink-850);
		border-radius: 6px;
	}
</style>
