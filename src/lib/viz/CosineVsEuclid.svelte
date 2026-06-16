<script lang="ts">
	// Косинус против евклида: два вектора a, b из начала координат (2D).
	// В реальном времени — угол, cos(a,b)=a·b/(|a||b|), евклидово ‖a−b‖.
	// Кнопка «нормализовать» (|a|=|b|=1) демонстрирует тождество
	// ‖a−b‖² = 2(1−cos) и совпадение порядка ранжирования по обеим мерам.
	// Анимация плавно тянет |a|,|b| → 1. Чистый SVG, без зависимостей.

	// мир: математические координаты, центр в (CX,CY), ось Y вверх
	const CX = 210;
	const CY = 150;
	const SCALE = 26; // пикселей на единицу длины
	const DEG = 180 / Math.PI;

	// углы в градусах (от оси +X, против часовой) и длины
	let angA = $state(25);
	let angB = $state(95);
	let lenA = $state(3.4);
	let lenB = $state(2.6);
	let normalized = $state(false);

	function vec(ang: number, len: number) {
		const r = ang / DEG;
		return { x: len * Math.cos(r), y: len * Math.sin(r) };
	}
	function toScreen(p: { x: number; y: number }) {
		return { x: CX + p.x * SCALE, y: CY - p.y * SCALE };
	}

	const a = $derived(vec(angA, lenA));
	const b = $derived(vec(angB, lenB));

	const dot = $derived(a.x * b.x + a.y * b.y);
	const magA = $derived(Math.hypot(a.x, a.y));
	const magB = $derived(Math.hypot(b.x, b.y));
	const cos = $derived(magA > 1e-9 && magB > 1e-9 ? dot / (magA * magB) : 1);
	// угол между векторами (по модулю разности направлений тоже совпал бы,
	// но через cos он корректен и для произвольных длин)
	const angle = $derived(Math.acos(Math.min(1, Math.max(-1, cos))) * DEG);
	// евклидово расстояние ‖a−b‖
	const euclid = $derived(Math.hypot(a.x - b.x, a.y - b.y));
	// тождество для нормированных: 2(1−cos)
	const identity = $derived(2 * (1 - cos));

	const sa = $derived(toScreen(a));
	const sb = $derived(toScreen(b));

	// дуга угла между векторами (рисуем у начала координат)
	const arcR = 34;
	function arcPath(): string {
		const rA = angA / DEG;
		const rB = angB / DEG;
		// экранные координаты концов дуги (Y инвертирован)
		const p1 = { x: CX + arcR * Math.cos(rA), y: CY - arcR * Math.sin(rA) };
		const p2 = { x: CX + arcR * Math.cos(rB), y: CY - arcR * Math.sin(rB) };
		const large = Math.abs(angA - angB) > 180 ? 1 : 0;
		// sweep: в экранных координатах направление обхода инвертируется
		const sweep = angB > angA ? 0 : 1;
		return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${arcR} ${arcR} 0 ${large} ${sweep} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
	}

	// анимация нормализации
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		clearInterval(timer);
		timer = undefined;
	}
	function normalize() {
		stop();
		normalized = true;
		timer = setInterval(() => {
			const da = 1 - lenA;
			const db = 1 - lenB;
			if (Math.abs(da) < 0.01 && Math.abs(db) < 0.01) {
				lenA = 1;
				lenB = 1;
				stop();
				return;
			}
			lenA += da * 0.25;
			lenB += db * 0.25;
		}, 40);
	}
	function reset() {
		stop();
		normalized = false;
		angA = 25;
		angB = 95;
		lenA = 3.4;
		lenB = 2.6;
	}
	function onSlide() {
		// ручное движение ползунков снимает флаг «нормализовано»
		if (normalized && (Math.abs(lenA - 1) > 0.02 || Math.abs(lenB - 1) > 0.02)) {
			normalized = false;
		}
	}

	const fmt = (n: number, d = 2) => n.toFixed(d);
</script>

<div class="cv">
	<div class="cv__bar">
		<div class="title">Косинус против евклида</div>
		<div class="ctrl">
			<button class="norm" class:on={normalized} onclick={normalize}>
				нормализовать |a|=|b|=1
			</button>
			<button onclick={reset} title="сброс">↺</button>
		</div>
	</div>

	<div class="cv__body">
		<svg viewBox="0 0 420 290" class="cv__svg">
			<!-- сетка -->
			<g class="grid">
				{#each [-6, -4, -2, 2, 4, 6] as g}
					<line x1={CX + g * SCALE} y1="14" x2={CX + g * SCALE} y2="286" />
					<line x1="14" y1={CY - g * SCALE} x2="406" y2={CY - g * SCALE} />
				{/each}
			</g>
			<!-- оси -->
			<line class="axis" x1="14" y1={CY} x2="406" y2={CY} />
			<line class="axis" x1={CX} y1="14" x2={CX} y2="286" />

			<!-- единичная окружность (ориентир для нормировки) -->
			<circle class="unit" class:on={normalized} cx={CX} cy={CY} r={SCALE} />

			<!-- соединение a—b: это и есть ‖a−b‖ -->
			<line class="diff" x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y} />

			<!-- дуга угла -->
			<path class="arc" d={arcPath()} fill="none" />
			<text
				class="arc-lbl"
				x={CX + (arcR + 16) * Math.cos(((angA + angB) / 2) / DEG)}
				y={CY - (arcR + 16) * Math.sin(((angA + angB) / 2) / DEG)}
				dy="0.32em">{fmt(angle, 0)}°</text
			>

			<defs>
				<marker id="cv-arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
				<marker id="cv-arr2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--color-parch-100)" />
				</marker>
			</defs>

			<!-- вектор a -->
			<line class="vec a" x1={CX} y1={CY} x2={sa.x} y2={sa.y} marker-end="url(#cv-arr)" />
			<text class="vec-lbl a" x={sa.x} y={sa.y} dx={a.x >= 0 ? 8 : -8} dy={a.y >= 0 ? -6 : 14}>a</text>
			<!-- вектор b -->
			<line class="vec b" x1={CX} y1={CY} x2={sb.x} y2={sb.y} marker-end="url(#cv-arr2)" />
			<text class="vec-lbl b" x={sb.x} y={sb.y} dx={b.x >= 0 ? 8 : -8} dy={b.y >= 0 ? -6 : 14}>b</text>

			<!-- подпись ‖a−b‖ на середине разности -->
			<g class="diff-lbl">
				<rect x={(sa.x + sb.x) / 2 - 22} y={(sa.y + sb.y) / 2 - 9} width="44" height="16" rx="4" />
				<text x={(sa.x + sb.x) / 2} y={(sa.y + sb.y) / 2} dy="0.32em">{fmt(euclid)}</text>
			</g>

			<circle class="origin" cx={CX} cy={CY} r="3" />
		</svg>

		<div class="cv__panel">
			<div class="metrics">
				<div class="m">
					<span>cos(a, b)</span>
					<b>{fmt(cos, 3)}</b>
				</div>
				<div class="m">
					<span>угол</span>
					<b>{fmt(angle, 1)}°</b>
				</div>
				<div class="m">
					<span>‖a − b‖</span>
					<b class="eu">{fmt(euclid)}</b>
				</div>
				<div class="m">
					<span>a · b</span>
					<b>{fmt(dot)}</b>
				</div>
				<div class="m">
					<span>|a|</span>
					<b>{fmt(magA)}</b>
				</div>
				<div class="m">
					<span>|b|</span>
					<b>{fmt(magB)}</b>
				</div>
			</div>

			<div class="identity" class:on={normalized}>
				<div class="id-row">
					<code>‖a−b‖²</code>
					<span>=</span>
					<b>{fmt(euclid * euclid, 3)}</b>
				</div>
				<div class="id-row">
					<code>2(1−cos)</code>
					<span>=</span>
					<b>{fmt(identity, 3)}</b>
				</div>
				<div class="id-verdict">
					{#if normalized}
						✓ при |a|=|b|=1 тождество выполнено: ‖a−b‖² = 2(1−cos).
						Чем больше косинус, тем меньше расстояние — порядок ранжирования совпадает.
					{:else}
						При |a|≠1 равенство не держится: евклид зависит ещё и от длин.
						Нажми «нормализовать», чтобы убрать вклад длины.
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="cv__sliders">
		<div class="sgroup a">
			<div class="sg-head"><i class="dot a"></i>вектор a</div>
			<label>
				<span>угол</span>
				<input type="range" min="0" max="360" step="1" bind:value={angA} oninput={onSlide} />
				<b>{angA}°</b>
			</label>
			<label>
				<span>длина |a|</span>
				<input type="range" min="0.2" max="6" step="0.1" bind:value={lenA} oninput={onSlide} />
				<b>{fmt(lenA, 1)}</b>
			</label>
		</div>
		<div class="sgroup b">
			<div class="sg-head"><i class="dot b"></i>вектор b</div>
			<label>
				<span>угол</span>
				<input type="range" min="0" max="360" step="1" bind:value={angB} oninput={onSlide} />
				<b>{angB}°</b>
			</label>
			<label>
				<span>длина |b|</span>
				<input type="range" min="0.2" max="6" step="0.1" bind:value={lenB} oninput={onSlide} />
				<b>{fmt(lenB, 1)}</b>
			</label>
		</div>
	</div>
</div>

<style>
	.cv {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.cv__bar {
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
		font-size: 0.92rem;
		color: var(--color-parch-100);
	}
	.ctrl {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.norm {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		padding: 0.4rem 0.7rem;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		transition: all 0.15s;
	}
	.norm:hover { background: var(--blue-pale); }
	.norm.on { background: var(--blue); color: #fff; }
	.ctrl button:not(.norm) {
		width: 2rem;
		height: 2rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.8rem;
	}
	.ctrl button:not(.norm):hover { border-color: var(--blue); color: var(--blue); }

	.cv__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.cv__svg {
		flex: 1 1 330px;
		min-width: 280px;
		max-width: 470px;
		height: auto;
	}
	.grid line {
		stroke: var(--color-ink-700);
		stroke-width: 1;
	}
	.axis {
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
	}
	.unit {
		fill: none;
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		stroke-dasharray: 4 3;
		transition: stroke 0.25s;
	}
	.unit.on { stroke: var(--blue); }
	.diff {
		stroke: var(--color-parch-muted);
		stroke-width: 2;
		stroke-dasharray: 5 4;
		transition: all 0.2s;
	}
	.arc {
		stroke: var(--blue);
		stroke-width: 2;
		opacity: 0.7;
	}
	.arc-lbl {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		fill: var(--blue);
		font-weight: 700;
	}
	.vec {
		stroke-width: 3;
		transition: all 0.12s linear;
	}
	.vec.a { stroke: var(--blue); }
	.vec.b { stroke: var(--color-parch-100); }
	.vec-lbl {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.9rem;
	}
	.vec-lbl.a { fill: var(--blue); }
	.vec-lbl.b { fill: var(--color-parch-100); }
	.diff-lbl rect {
		fill: var(--color-ink-800);
		stroke: var(--color-parch-muted);
		stroke-width: 1;
	}
	.diff-lbl text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		fill: var(--color-parch-200);
		font-weight: 700;
	}
	.origin { fill: var(--color-parch-100); }

	.cv__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.metrics {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.3rem 0.6rem;
	}
	.m {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.18rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.m span {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		letter-spacing: 0.04em;
		color: var(--color-parch-muted);
	}
	.m b {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-parch-100);
	}
	.m b.eu { color: var(--blue); }

	.identity {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--color-ink-500);
		transition: border-color 0.25s;
	}
	.identity.on { border-left-color: var(--blue); }
	.id-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		font-size: 0.78rem;
	}
	.id-row code {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--color-parch-200);
		width: 5.2rem;
		flex: none;
	}
	.id-row span { color: var(--color-parch-muted); }
	.id-row b {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--blue);
	}
	.id-verdict {
		margin-top: 0.2rem;
		font-size: 0.78rem;
		line-height: 1.35;
		color: var(--color-parch-200);
	}

	.cv__sliders {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.4rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.sgroup {
		flex: 1 1 200px;
		min-width: 190px;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding-top: 0.6rem;
	}
	.sg-head {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		color: var(--color-parch-100);
	}
	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		flex: none;
	}
	.dot.a { background: var(--blue); }
	.dot.b { background: var(--color-parch-100); }
	.sgroup label {
		display: grid;
		grid-template-columns: 3.4rem 1fr 2.2rem;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.72rem;
	}
	.sgroup label span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.sgroup label b {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-100);
		text-align: right;
	}
	.sgroup input[type='range'] {
		width: 100%;
		accent-color: var(--blue);
	}
	.sgroup.b input[type='range'] {
		accent-color: var(--color-parch-100);
	}
</style>
