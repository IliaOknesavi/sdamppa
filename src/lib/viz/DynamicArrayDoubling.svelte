<script lang="ts">
	// Dynamic array (vector) with doubling. push() заполняет ячейки; при
	// size == capacity массив реаллоцируется в 2× и старые элементы копируются.
	// Цена push = 1 (просто запись нового элемента) или 1 + 2·size при
	// реаллокации: копирование каждого старого элемента = чтение из старого
	// массива + запись в новый = 2 операции. При коэффициенте роста 2 это даёт
	// классический результат: амортизированная цена push стремится к 3, несмотря
	// на редкие дорогие реаллокации. Pure SVG, без зависимостей.
	type Step = {
		n: number; // сколько элементов уже добавлено (после этого push)
		size: number; // = n
		capacity: number;
		grew: boolean; // была ли реаллокация на этом шаге
		copied: number; // сколько старых элементов скопировали (0, если без роста)
		cost: number; // цена этого push: 1 либо 1 + copied
		total: number; // суммарная цена всех push с начала
		note: string;
	};

	const BASE_CAP = 1; // стартовая ёмкость
	const MAX_PUSH = 16; // строим историю до 16 элементов

	function buildSteps(): Step[] {
		const steps: Step[] = [];
		let capacity = BASE_CAP;
		let total = 0;
		// шаг 0 — пустой массив
		steps.push({
			n: 0,
			size: 0,
			capacity,
			grew: false,
			copied: 0,
			cost: 0,
			total: 0,
			note: `пусто · capacity = ${capacity}`
		});
		for (let i = 1; i <= MAX_PUSH; i++) {
			const sizeBefore = i - 1;
			let grew = false;
			let copied = 0;
			let cost = 1; // обычная запись нового элемента
			if (sizeBefore === capacity) {
				grew = true;
				copied = sizeBefore; // копируем все старые элементы
				capacity = capacity * 2;
				cost = 1 + 2 * copied; // запись нового + чтение+запись каждого старого
			}
			total += cost;
			steps.push({
				n: i,
				size: i,
				capacity,
				grew,
				copied,
				cost,
				total,
				note: grew
					? `переполнение → удвоение: копируем ${copied} элем. (×2 операции), новый capacity = ${capacity}, цена = ${cost}`
					: `push в свободную ячейку, цена = 1`
			});
		}
		return steps;
	}

	const steps = buildSteps();
	const last = steps.length - 1;
	// диапазон амортизированной цены для оси Y мини-графика
	const maxAmort = 5; // ось 0..5: после удвоения цена коротко подскакивает выше 4,
	// затем оседает к 3 (пунктир «≈ 3»)

	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(steps[Math.min(idx, last)]);
	const amort = $derived(cur.n === 0 ? 0 : cur.total / cur.n);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= last) {
				stop();
				return;
			}
			idx += 1;
		}, 850);
	}
	function pushOne() {
		stop();
		idx = Math.min(last, idx + 1);
	}
	function pushSeries() {
		// серия: добавить до следующей реаллокации включительно (или до конца)
		stop();
		let next = Math.min(last, idx + 1);
		while (next < last && !steps[next].grew) next += 1;
		idx = next;
	}
	function reset() {
		stop();
		idx = 0;
	}

	// ── раскладка ячеек массива ───────────────────────────────────────────
	const CELL = 22; // ширина/высота ячейки
	const GAP = 3;
	const ROW_Y = 40;
	const ROW_X0 = 10;
	// ячейку i подсвечиваем как "скопированную" на шаге роста (i < copied),
	// "новую" — последняя занятая ячейка (i == size-1), иначе занята/свободна
	function cellState(i: number): string {
		if (i >= cur.capacity) return 'ghost';
		if (i >= cur.size) return 'free';
		if (cur.grew && i < cur.copied) return 'copied';
		if (i === cur.size - 1) return 'fresh';
		return 'filled';
	}

	// ── мини-график: size и capacity лесенкой ─────────────────────────────
	const G = { x: 10, y: 12, w: 180, h: 86 }; // область графика size/cap
	const maxCap = steps[last].capacity; // верх оси Y
	const gx = (n: number) => G.x + (n / MAX_PUSH) * G.w;
	const gy = (v: number) => G.y + G.h - (v / maxCap) * G.h;
	// построить ступенчатый путь по значениям шагов 0..idx
	function stepPath(key: 'size' | 'capacity'): string {
		const upto = Math.min(idx, last);
		let d = '';
		for (let k = 0; k <= upto; k++) {
			const s = steps[k];
			const x = gx(s.n);
			const y = gy(s[key]);
			if (k === 0) {
				d = `M ${x} ${y}`;
			} else {
				// горизонталь до текущего n, затем вертикаль к новому значению
				const prevY = gy(steps[k - 1][key]);
				d += ` L ${x} ${prevY} L ${x} ${y}`;
			}
		}
		return d;
	}

	// ── мини-график: амортизированная цена total/n ────────────────────────
	const A = { x: 10, y: 12, w: 180, h: 86 };
	const ax = (n: number) => A.x + (n / MAX_PUSH) * A.w;
	const ay = (v: number) => A.y + A.h - (v / maxAmort) * A.h;
	function amortPath(): string {
		const upto = Math.min(idx, last);
		let d = '';
		for (let k = 1; k <= upto; k++) {
			const s = steps[k];
			const v = s.total / s.n;
			const cmd = k === 1 ? 'M' : 'L';
			d += `${cmd} ${ax(s.n)} ${ay(v)} `;
		}
		return d.trim();
	}
	// точки реаллокаций для скачков цены отдельного push (cost)
	const reallocs = steps.filter((s) => s.grew);
	const y3 = ay(3); // линия y = 3 (амортизированный предел)
</script>

<div class="da">
	<div class="da__bar">
		<div class="seg">
			<button onclick={pushOne} title="добавить один элемент">push +1</button>
			<button onclick={pushSeries} title="добавить до следующего удвоения">push серией</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(last, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{last}</span>
		</div>
	</div>

	<div class="da__body">
		<svg viewBox="0 0 420 110" class="da__array">
			<text class="cap-lbl" x={ROW_X0} y="18">
				size = {cur.size} · capacity = {cur.capacity}
				{#if cur.grew}<tspan class="grow"> · реаллокация ×2</tspan>{/if}
			</text>
			{#each Array(steps[last].capacity) as _, i}
				<g class="cell {cellState(i)}">
					<rect
						x={ROW_X0 + i * (CELL + GAP)}
						y={ROW_Y}
						width={CELL}
						height={CELL}
						rx="4"
					/>
					{#if i < cur.size}
						<text
							x={ROW_X0 + i * (CELL + GAP) + CELL / 2}
							y={ROW_Y + CELL / 2}
							dy="0.34em"
						>{i}</text>
					{/if}
				</g>
			{/each}
			<!-- скобка ёмкости -->
			<line
				class="cap-line"
				x1={ROW_X0}
				y1={ROW_Y + CELL + 7}
				x2={ROW_X0 + cur.capacity * (CELL + GAP) - GAP}
				y2={ROW_Y + CELL + 7}
			/>
			<text
				class="cap-cap"
				x={ROW_X0 + (cur.capacity * (CELL + GAP) - GAP) / 2}
				y={ROW_Y + CELL + 18}
			>capacity {cur.capacity}</text>
		</svg>

		<div class="da__charts">
			<!-- size / capacity лесенкой -->
			<div class="chart">
				<div class="chart-head">
					<span class="lbl">size и capacity, лесенкой</span>
					<span class="legend">
						<i class="sw size"></i>size
						<i class="sw cap"></i>capacity
					</span>
				</div>
				<svg viewBox="0 0 200 110" class="mini">
					<line class="axis" x1={G.x} y1={G.y} x2={G.x} y2={G.y + G.h} />
					<line class="axis" x1={G.x} y1={G.y + G.h} x2={G.x + G.w} y2={G.y + G.h} />
					<path class="line cap" d={stepPath('capacity')} fill="none" />
					<path class="line size" d={stepPath('size')} fill="none" />
					<text class="tick" x={G.x - 2} y={gy(maxCap) + 3} text-anchor="end">{maxCap}</text>
					<text class="axlbl" x={G.x + G.w} y={G.y + G.h + 9} text-anchor="end">push →</text>
				</svg>
			</div>

			<!-- амортизированная цена -->
			<div class="chart">
				<div class="chart-head">
					<span class="lbl">амортизированная цена push = total / n</span>
				</div>
				<svg viewBox="0 0 200 110" class="mini">
					<line class="axis" x1={A.x} y1={A.y} x2={A.x} y2={A.y + A.h} />
					<line class="axis" x1={A.x} y1={A.y + A.h} x2={A.x + A.w} y2={A.y + A.h} />
					<!-- предел y = 3 -->
					<line class="limit" x1={A.x} y1={y3} x2={A.x + A.w} y2={y3} />
					<text class="tick limit-lbl" x={A.x + A.w} y={y3 - 3} text-anchor="end">≈ 3</text>
					<!-- метки реаллокаций -->
					{#each reallocs as r}
						{#if r.n <= idx}
							<line class="realloc" x1={ax(r.n)} y1={A.y} x2={ax(r.n)} y2={A.y + A.h} />
						{/if}
					{/each}
					<path class="line amort" d={amortPath()} fill="none" />
					{#if idx >= 1}
						<circle class="dot" cx={ax(cur.n)} cy={ay(amort)} r="3" />
					{/if}
					<text class="tick" x={A.x - 2} y={ay(maxAmort) + 3} text-anchor="end">{maxAmort}</text>
				</svg>
			</div>
		</div>
	</div>

	<div class="da__foot">
		<div class="stats">
			<div class="stat"><span>push сделано (n)</span><b>{cur.n}</b></div>
			<div class="stat"><span>цена этого push</span><b class:hot={cur.grew}>{cur.cost}</b></div>
			<div class="stat"><span>всего работы Σ</span><b>{cur.total}</b></div>
			<div class="stat"><span>амортизированно</span><b>{cur.n === 0 ? '—' : amort.toFixed(2)}</b></div>
		</div>
		<div class="note">{cur.note}</div>
	</div>
</div>

<style>
	.da {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.da__bar {
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
		gap: 0.4rem;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.76rem;
		padding: 0.4rem 0.8rem;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover {
		background: var(--blue);
		color: #fff;
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
	.da__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.da__array {
		flex: 1 1 380px;
		min-width: 300px;
		max-width: 520px;
		height: auto;
	}
	.cap-lbl {
		font-family: var(--font-mono);
		font-size: 9px;
		fill: var(--color-parch-muted);
	}
	.cap-lbl .grow {
		fill: var(--blue);
		font-weight: 700;
	}
	.cell rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.cell text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-parch-100);
	}
	.cell.ghost rect {
		fill: transparent;
		stroke: var(--color-ink-600);
		stroke-dasharray: 2 2;
	}
	.cell.free rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-dasharray: 2 2;
	}
	.cell.filled rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.cell.filled text {
		fill: var(--blue);
	}
	.cell.copied rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 2.5;
	}
	.cell.copied text {
		fill: var(--blue);
	}
	.cell.fresh rect {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.cell.fresh text {
		fill: #fff;
	}
	.cap-line {
		stroke: var(--color-parch-muted);
		stroke-width: 1.5;
	}
	.cap-cap {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 8.5px;
		fill: var(--color-parch-muted);
	}
	.da__charts {
		flex: 1 1 220px;
		min-width: 220px;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.chart-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.15rem;
	}
	.chart-head .lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-parch-muted);
	}
	.legend {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
	}
	.legend .sw {
		display: inline-block;
		width: 12px;
		height: 0;
		border-top-width: 2.5px;
		border-top-style: solid;
		margin-right: 0.2rem;
		vertical-align: middle;
	}
	.legend .sw.size {
		border-top-color: var(--blue);
	}
	.legend .sw.cap {
		border-top-color: var(--color-parch-muted);
		border-top-style: dashed;
	}
	.mini {
		width: 100%;
		height: auto;
		display: block;
	}
	.axis {
		stroke: var(--color-ink-500);
		stroke-width: 1;
	}
	.line {
		stroke-width: 2;
		transition: d 0.2s;
	}
	.line.size {
		stroke: var(--blue);
	}
	.line.cap {
		stroke: var(--color-parch-muted);
		stroke-dasharray: 4 3;
	}
	.line.amort {
		stroke: var(--blue);
	}
	.limit {
		stroke: var(--color-parch-muted);
		stroke-width: 1;
		stroke-dasharray: 3 3;
	}
	.limit-lbl {
		fill: var(--color-parch-muted);
	}
	.realloc {
		stroke: var(--blue-pale);
		stroke-width: 1;
	}
	.dot {
		fill: var(--blue);
		stroke: var(--color-ink-850);
		stroke-width: 1.5;
	}
	.tick {
		font-family: var(--font-mono);
		font-size: 8px;
		fill: var(--color-parch-muted);
	}
	.axlbl {
		font-family: var(--font-mono);
		font-size: 7.5px;
		fill: var(--color-parch-muted);
	}
	.da__foot {
		padding: 0.8rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.4rem;
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	.stat span {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-parch-muted);
	}
	.stat b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1rem;
		color: var(--color-parch-100);
	}
	.stat b.hot {
		color: var(--blue);
	}
	.note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-850);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
</style>
