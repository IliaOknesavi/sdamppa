<script lang="ts">
	// Выпуклая оболочка набора точек методом Эндрю (monotone chain).
	// Сортируем точки по x (затем по y), строим нижнюю и верхнюю цепи:
	// добавляя точку, пока два последних ребра дают правый поворот
	// (косое произведение ≤ 0), выкидываем предыдущую вершину.
	// Шаг / плей / сброс; точку можно добавить кликом. Чистый SVG, без зависимостей.
	type Pt = { x: number; y: number };
	type Phase = 'sort' | 'lower' | 'upper' | 'done';
	type Step = {
		phase: Phase;
		// индексы точек (в отсортированном порядке) в текущем стеке цепи
		chain: number[];
		// уже завершённая нижняя цепь (для фазы upper / done)
		lowerDone: number[];
		// рассматриваемая точка (индекс в sorted) или null
		consider: number | null;
		// тройка a,b,c для проверки поворота (индексы в sorted) или null
		turn: [number, number, number] | null;
		cross: number | null; // косое произведение для тройки
		popped: number | null; // точка, которую выкидываем на этом шаге
		hull: number[]; // готовая оболочка (для фазы done)
		note: string;
	};

	// встроенные демо-данные (в координатах сетки 0..100)
	let pts = $state<Pt[]>([
		{ x: 12, y: 28 }, { x: 30, y: 12 }, { x: 52, y: 22 }, { x: 78, y: 16 },
		{ x: 90, y: 40 }, { x: 82, y: 70 }, { x: 60, y: 86 }, { x: 36, y: 78 },
		{ x: 18, y: 58 }, { x: 46, y: 48 }, { x: 64, y: 40 }, { x: 38, y: 40 }
	]);

	// косое произведение (b-a)×(c-a): >0 левый поворот, <0 правый, =0 коллинеарно
	function cross(o: Pt, a: Pt, b: Pt): number {
		return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
	}

	// порядок sorted нужен и для отрисовки, поэтому считаем его отдельно
	// из тех же входных точек, что и шаги.
	const order = $derived(
		pts.map((_, i) => i).sort((i, j) => pts[i].x - pts[j].x || pts[i].y - pts[j].y)
	);
	const sorted = $derived(order.map((i) => pts[i]));
	const steps = $derived(makeSteps(pts));

	// чистая функция шагов (без побочного возврата order)
	function makeSteps(input: Pt[]): Step[] {
		const n = input.length;
		const ord = input.map((_, i) => i).sort((i, j) =>
			input[i].x - input[j].x || input[i].y - input[j].y);
		const srt = ord.map((i) => input[i]);
		const out: Step[] = [];

		out.push({
			phase: 'sort', chain: [], lowerDone: [], consider: null, turn: null,
			cross: null, popped: null, hull: [],
			note: `Сортируем ${n} точек по x (при равенстве — по y). Идём слева направо.`
		});

		if (n < 3) {
			out.push({
				phase: 'done', chain: [], lowerDone: [], consider: null, turn: null,
				cross: null, popped: null, hull: ord.map((_, k) => k),
				note: 'Точек меньше трёх — оболочка совпадает со всем набором.'
			});
			return out;
		}

		const lower: number[] = [];
		for (let k = 0; k < n; k++) {
			out.push({
				phase: 'lower', chain: [...lower], lowerDone: [], consider: k,
				turn: null, cross: null, popped: null, hull: [],
				note: `Нижняя цепь: рассматриваем точку ${k + 1}.`
			});
			while (lower.length >= 2) {
				const a = lower[lower.length - 2];
				const b = lower[lower.length - 1];
				const cr = cross(srt[a], srt[b], srt[k]);
				if (cr <= 0) {
					out.push({
						phase: 'lower', chain: [...lower], lowerDone: [], consider: k,
						turn: [a, b, k], cross: cr, popped: b, hull: [],
						note: `Поворот ${cr < 0 ? 'правый' : 'коллинеарно'} (произв. = ${cr}) ≤ 0 — выкидываем вершину ${b + 1}.`
					});
					lower.pop();
				} else {
					out.push({
						phase: 'lower', chain: [...lower], lowerDone: [], consider: k,
						turn: [a, b, k], cross: cr, popped: null, hull: [],
						note: `Поворот левый (произв. = ${cr}) > 0 — вершину ${b + 1} оставляем.`
					});
					break;
				}
			}
			lower.push(k);
			out.push({
				phase: 'lower', chain: [...lower], lowerDone: [], consider: null,
				turn: null, cross: null, popped: null, hull: [],
				note: `Добавляем точку ${k + 1} в нижнюю цепь.`
			});
		}
		const lowerDone = [...lower];

		const upper: number[] = [];
		for (let k = n - 1; k >= 0; k--) {
			out.push({
				phase: 'upper', chain: [...upper], lowerDone, consider: k,
				turn: null, cross: null, popped: null, hull: [],
				note: `Верхняя цепь: рассматриваем точку ${k + 1} (справа налево).`
			});
			while (upper.length >= 2) {
				const a = upper[upper.length - 2];
				const b = upper[upper.length - 1];
				const cr = cross(srt[a], srt[b], srt[k]);
				if (cr <= 0) {
					out.push({
						phase: 'upper', chain: [...upper], lowerDone, consider: k,
						turn: [a, b, k], cross: cr, popped: b, hull: [],
						note: `Поворот ${cr < 0 ? 'правый' : 'коллинеарно'} (произв. = ${cr}) ≤ 0 — выкидываем вершину ${b + 1}.`
					});
					upper.pop();
				} else {
					out.push({
						phase: 'upper', chain: [...upper], lowerDone, consider: k,
						turn: [a, b, k], cross: cr, popped: null, hull: [],
						note: `Поворот левый (произв. = ${cr}) > 0 — вершину ${b + 1} оставляем.`
					});
					break;
				}
			}
			upper.push(k);
			out.push({
				phase: 'upper', chain: [...upper], lowerDone, consider: null,
				turn: null, cross: null, popped: null, hull: [],
				note: `Добавляем точку ${k + 1} в верхнюю цепь.`
			});
		}

		const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
		out.push({
			phase: 'done', chain: [], lowerDone, consider: null, turn: null,
			cross: null, popped: null, hull,
			note: `Оболочка построена: ${hull.length} вершин. Внутренние точки отброшены.`
		});

		return out;
	}

	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// === координаты SVG ===
	const PAD = 26;
	const W = 250; // ширина области графика
	const H = 240; // высота
	// данные в 0..100 → пиксели; y инвертируем (математический низ = визуальный низ)
	const sx = (v: number) => PAD + (v / 100) * W;
	const sy = (v: number) => PAD + (1 - v / 100) * H;
	// экранная точка по индексу k в sorted
	function px(k: number): { x: number; y: number } {
		return { x: sx(sorted[k].x), y: sy(sorted[k].y) };
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
			if (idx >= steps.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 650);
	}
	function reset() {
		stop();
		idx = 0;
	}

	// добавление точки кликом по svg
	let svgEl: SVGSVGElement | undefined;
	function addPoint(ev: MouseEvent) {
		if (!svgEl) return;
		const r = svgEl.getBoundingClientRect();
		// перевод экранных координат в координаты viewBox
		const vbx = (ev.clientX - r.left) / r.width * (W + PAD * 2);
		const vby = (ev.clientY - r.top) / r.height * (H + PAD * 2);
		const dataX = ((vbx - PAD) / W) * 100;
		const dataY = (1 - (vby - PAD) / H) * 100;
		if (dataX < 0 || dataX > 100 || dataY < 0 || dataY > 100) return;
		pts = [...pts, { x: Math.round(dataX), y: Math.round(dataY) }];
		reset();
	}

	// тройка поворота → точки экрана для подсветки рёбер
	const turnPts = $derived(
		cur.turn ? cur.turn.map((k) => px(k)) : null
	);

	// текущая ломаная цепи (экранные координаты)
	function chainPath(ch: number[]): string {
		if (ch.length === 0) return '';
		return ch.map((k, i) => `${i === 0 ? 'M' : 'L'} ${px(k).x} ${px(k).y}`).join(' ');
	}
	const lowerDonePath = $derived(chainPath(cur.lowerDone));
	const chainNow = $derived(chainPath(cur.chain));
	const hullPath = $derived(
		cur.hull.length > 0
			? cur.hull.map((k, i) => `${i === 0 ? 'M' : 'L'} ${px(k).x} ${px(k).y}`).join(' ') + ' Z'
			: ''
	);

	// состояние точки для покраски
	function ptState(k: number): string {
		if (cur.phase === 'done') return cur.hull.includes(k) ? 'hull' : 'inside';
		if (cur.popped === k) return 'popped';
		if (cur.consider === k) return 'consider';
		if (cur.turn && (cur.turn[0] === k || cur.turn[1] === k)) return 'turn';
		if (cur.chain.includes(k) || cur.lowerDone.includes(k)) return 'chain';
		return 'idle';
	}

	const phaseLabel: Record<Phase, string> = {
		sort: 'сортировка',
		lower: 'нижняя цепь',
		upper: 'верхняя цепь',
		done: 'готово'
	};
</script>

<div class="ch">
	<div class="ch__bar">
		<div class="phase">
			<span class="lbl">этап</span>
			<b class:active={cur.phase === 'lower'} class:hi={cur.phase === 'lower'}>{phaseLabel[cur.phase]}</b>
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

	<div class="ch__body">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<svg
			bind:this={svgEl}
			viewBox="0 0 {W + PAD * 2} {H + PAD * 2}"
			class="ch__svg"
			onclick={addPoint}
			role="img"
			aria-label="поле точек, клик добавляет точку"
		>
			<!-- рамка области -->
			<rect x={PAD} y={PAD} width={W} height={H} class="frame" />

			<!-- готовая нижняя цепь (бледная) на фазе верхней цепи -->
			{#if cur.phase === 'upper' && lowerDonePath}
				<path d={lowerDonePath} class="chain-done" />
			{/if}

			<!-- финальная оболочка -->
			{#if hullPath}
				<path d={hullPath} class="hull" />
			{/if}

			<!-- текущая строящаяся цепь -->
			{#if chainNow}
				<path d={chainNow} class="chain-now" />
			{/if}

			<!-- подсветка проверяемого поворота a-b-c -->
			{#if turnPts}
				<path
					d={`M ${turnPts[0].x} ${turnPts[0].y} L ${turnPts[1].x} ${turnPts[1].y} L ${turnPts[2].x} ${turnPts[2].y}`}
					class="turn-wedge"
					class:right={cur.cross !== null && cur.cross <= 0}
				/>
			{/if}

			<!-- точки -->
			{#each sorted as _p, k}
				{@const p = px(k)}
				<g class="pt {ptState(k)}">
					<circle cx={p.x} cy={p.y} r="7" />
					<text x={p.x} y={p.y} dy="0.32em">{k + 1}</text>
				</g>
			{/each}
		</svg>

		<div class="ch__panel">
			<div class="props">
				<div class="prop"><span>всего точек</span><b>{pts.length}</b></div>
				<div class="prop">
					<span>косое произв.</span>
					<b class:neg={cur.cross !== null && cur.cross <= 0} class:pos={cur.cross !== null && cur.cross > 0}>
						{cur.cross === null ? '—' : cur.cross}
					</b>
				</div>
				<div class="prop">
					<span>вершин оболочки</span>
					<b>{cur.phase === 'done' ? cur.hull.length : '…'}</b>
				</div>
			</div>

			<div class="legend">
				<span class="leg"><i class="d consider"></i>рассматриваем</span>
				<span class="leg"><i class="d turn"></i>проверка поворота</span>
				<span class="leg"><i class="d popped"></i>выкидываем</span>
				<span class="leg"><i class="d hull"></i>оболочка</span>
			</div>

			<div class="note">{cur.note}</div>
			<div class="hint">Клик по полю добавляет точку.</div>
		</div>
	</div>
</div>

<style>
	.ch {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.ch__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.phase {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}
	.phase .lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.phase b {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.84rem;
		color: var(--color-parch-100);
	}
	.phase b.hi {
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
	.ch__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.ch__svg {
		flex: 1 1 300px;
		min-width: 260px;
		max-width: 420px;
		height: auto;
		cursor: crosshair;
	}
	.frame {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		rx: 6;
	}
	.chain-done {
		fill: none;
		stroke: var(--color-ink-500);
		stroke-width: 2;
		stroke-dasharray: 4 4;
	}
	.chain-now {
		fill: none;
		stroke: var(--blue);
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.hull {
		fill: var(--blue-pale);
		fill-opacity: 0.5;
		stroke: var(--blue);
		stroke-width: 2.5;
		stroke-linejoin: round;
	}
	.turn-wedge {
		fill: none;
		stroke: var(--blue);
		stroke-width: 3;
		stroke-linejoin: round;
		stroke-linecap: round;
		opacity: 0.85;
	}
	.turn-wedge.right {
		stroke: var(--color-parch-200);
		stroke-dasharray: 5 3;
	}
	.pt circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.2s, stroke 0.2s;
	}
	.pt text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.55rem;
		font-weight: 700;
		fill: var(--color-parch-muted);
		pointer-events: none;
	}
	.pt.chain circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.pt.chain text {
		fill: var(--blue);
	}
	.pt.turn circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 2.5;
	}
	.pt.turn text {
		fill: var(--blue);
	}
	.pt.consider circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
	}
	.pt.consider text {
		fill: #fff;
	}
	.pt.popped circle {
		fill: var(--color-parch-200);
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
	}
	.pt.popped text {
		fill: var(--color-ink-850);
	}
	.pt.hull circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.pt.hull text {
		fill: #fff;
	}
	.pt.inside circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-600);
	}
	.ch__panel {
		flex: 1 1 200px;
		min-width: 190px;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
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
		font-family: var(--font-mono);
	}
	.prop b.neg {
		color: var(--color-parch-200);
	}
	.prop b.pos {
		color: var(--blue);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.7rem;
	}
	.leg {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
	}
	.leg .d {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		flex: none;
	}
	.leg .d.consider {
		background: var(--blue);
		border: 1.5px solid var(--color-parch-100);
	}
	.leg .d.turn {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.leg .d.popped {
		background: var(--color-parch-200);
		border: 1.5px solid var(--color-parch-100);
	}
	.leg .d.hull {
		background: var(--blue);
		border: 1.5px solid var(--blue);
	}
	.note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.hint {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
</style>
