<script lang="ts">
	// Динамика «минимум идеальных квадратов в сумме n»: dp[i] = min(dp[i-j²]+1).
	// Перебор последнего квадрата j²≤i, релаксация по шагам + плиточное
	// разложение n на квадратные плитки. Ползунок n, шаг / плей / сброс.
	// Чистый SVG/HTML, без внешних зависимостей; язык — как в GraphTraversal.
	type Step = {
		i: number; // какую ячейку dp[i] заполняем
		j: number | null; // текущий пробуемый квадрат j (j²≤i), null = финализировано
		from: number | null; // i - j², откуда берём dp
		cand: number | null; // dp[i-j²]+1
		best: number; // текущий dp[i] после шага
		bestJ: number; // лучший j для dp[i] на текущий момент
		filled: number[]; // dp[0..i] (значения, заполненные на этот момент)
		choice: number[]; // bestJ для каждого индекса (для разбора плиток)
		note: string;
		done: boolean; // финализирована ли ячейка i на этом шаге
	};

	const N_MAX = 24;

	// Полный прогон DP для конкретного n, с записью всех шагов релаксации.
	function buildSteps(n: number): Step[] {
		const steps: Step[] = [];
		const dp = new Array(n + 1).fill(0);
		const choice = new Array(n + 1).fill(0); // лучший последний квадрат j
		const INF = 999;

		// dp[0] = 0 (база)
		steps.push({
			i: 0, j: null, from: null, cand: null, best: 0, bestJ: 0,
			filled: [0], choice: [0], note: 'База: dp[0] = 0 — пустая сумма.',
			done: true
		});

		for (let i = 1; i <= n; i++) {
			let best = INF;
			let bestJ = 0;
			for (let j = 1; j * j <= i; j++) {
				const sq = j * j;
				const from = i - sq;
				const cand = dp[from] + 1;
				const improved = cand < best;
				if (improved) {
					best = cand;
					bestJ = j;
				}
				steps.push({
					i, j, from, cand,
					best: best === INF ? 0 : best,
					bestJ,
					filled: dp.slice(0, i),
					choice: choice.slice(0, i),
					note: improved
						? `dp[${i}]: пробуем ${j}²=${sq} → dp[${from}]+1 = ${cand}. Лучше! dp[${i}] = ${cand}.`
						: `dp[${i}]: ${j}²=${sq} → dp[${from}]+1 = ${cand}. Не лучше ${best}.`,
					done: false
				});
			}
			dp[i] = best;
			choice[i] = bestJ;
			steps.push({
				i, j: null, from: null, cand: null, best, bestJ,
				filled: dp.slice(0, i + 1),
				choice: choice.slice(0, i + 1),
				note: `Готово: dp[${i}] = ${best} (последний квадрат ${bestJ}² = ${bestJ * bestJ}).`,
				done: true
			});
		}
		return steps;
	}

	// Разбор n на квадратные плитки по таблице выбора choice[].
	function tiles(n: number, choice: number[]): number[] {
		const out: number[] = [];
		let cur = n;
		// защита: разбор валиден только если choice заполнен до cur
		while (cur > 0 && choice[cur] && choice[cur] > 0) {
			const j = choice[cur];
			out.push(j);
			cur -= j * j;
		}
		return out.sort((a, b) => b - a); // крупные плитки первыми
	}

	let n = $state(12);
	let idx = $state(0);
	let playing = $state(false);

	const steps = $derived(buildSteps(n));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// Значения dp для строки таблицы: то, что заполнено сейчас + активная ячейка.
	const dpRow = $derived.by(() => {
		const row: (number | null)[] = new Array(n + 1).fill(null);
		for (let k = 0; k < cur.filled.length; k++) row[k] = cur.filled[k];
		// показываем «черновое» значение активной ячейки во время релаксации
		if (!cur.done && cur.i < row.length) row[cur.i] = cur.best;
		return row;
	});

	// Разбор плиток: используем choice на текущий момент, если cur.i дошёл до n.
	const curTiles = $derived.by(() => {
		// собираем choice достаточной длины: из шага плюс bestJ активной ячейки
		const ch = cur.choice.slice();
		while (ch.length <= n) ch.push(0);
		if (cur.i <= n) ch[cur.i] = cur.bestJ;
		return tiles(n, ch);
	});

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
	function setN(v: number) {
		n = v;
		reset();
	}

	// Геометрия плиточной раскладки n = Σ jₖ².
	const GRID = 12; // условный размер одной единичной клетки, px
	function tileGeom(list: number[]) {
		// раскладываем квадраты в ряд слева направо по нижней линии
		const gap = 6;
		let x = 0;
		const rects: { x: number; size: number; j: number; w: number }[] = [];
		for (const j of list) {
			const w = j * GRID;
			rects.push({ x, size: j, j, w });
			x += w + gap;
		}
		return { rects, totalW: Math.max(0, x - gap) };
	}
	const geom = $derived(tileGeom(curTiles));

	// палитра для разных j (по размеру плитки)
	const tileClass = (j: number) => `t${Math.min(j, 4)}`;
</script>

<div class="ps">
	<div class="ps__bar">
		<div class="nslide">
			<span class="lbl">n = <b>{n}</b></span>
			<input
				type="range" min="1" max={N_MAX} value={n}
				oninput={(e) => setN(+(e.currentTarget as HTMLInputElement).value)}
			/>
			<span class="ans">мин. квадратов: <b>{steps[steps.length - 1].best}</b></span>
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

	<div class="ps__body">
		<svg viewBox="0 0 420 290" class="ps__svg" preserveAspectRatio="xMidYMid meet">
			<!-- формула релаксации -->
			<text x="14" y="26" class="formula">
				dp[i] = min(dp[i − j²] + 1), j² ≤ i
			</text>

			<!-- активная релаксация: dp[from] + 1 = cand -->
			{#if cur.j !== null && cur.from !== null}
				<g class="relax">
					<rect x="14" y="44" width="392" height="44" rx="8" class="relax-box" />
					<text x="26" y="70" class="relax-txt">
						i = {cur.i}, j = {cur.j} → j² = {cur.j * cur.j}
					</text>
					<text x="26" y="84" class="relax-sub">
						dp[{cur.from}] + 1 = {cur.cand} {cur.cand === cur.best ? '◀ берём' : ''}
					</text>
				</g>
			{:else}
				<g class="relax">
					<rect x="14" y="44" width="392" height="44" rx="8" class="relax-box done" />
					<text x="26" y="70" class="relax-txt">
						{cur.i === 0 ? 'База динамики' : `dp[${cur.i}] зафиксировано`}
					</text>
					<text x="26" y="84" class="relax-sub">
						{cur.i === 0 ? 'dp[0] = 0' : `= ${cur.best}, последний квадрат ${cur.bestJ}²`}
					</text>
				</g>
			{/if}

			<!-- плиточное разложение n -->
			<text x="14" y="116" class="caption">Разложение {n} на квадратные плитки:</text>
			<g transform="translate({Math.max(14, (420 - geom.totalW) / 2)}, 196)">
				{#each geom.rects as r}
					<g class="tile {tileClass(r.j)}">
						<rect x={r.x} y={-r.w} width={r.w} height={r.w} rx="3" />
						<!-- сетка внутри плитки: j×j единичных клеток -->
						{#each Array(r.size) as _, gx}
							{#each Array(r.size) as _2, gy}
								<rect
									class="cell"
									x={r.x + gx * GRID + 1} y={-r.w + gy * GRID + 1}
									width={GRID - 2} height={GRID - 2} rx="1.5"
								/>
							{/each}
						{/each}
						<text x={r.x + r.w / 2} y={-r.w / 2} dy="0.34em" class="tile-lbl">{r.j}²</text>
					</g>
				{/each}
			</g>
			<text x="14" y="222" class="sumline">
				{#if curTiles.length}
					{curTiles.map((j) => `${j}²`).join(' + ')} = {curTiles.map((j) => j * j).join(' + ')} = {n}
				{:else}
					—
				{/if}
			</text>

			<!-- заметка -->
			<rect x="14" y="238" width="392" height="40" rx="8" class="note-box" />
			<foreignObject x="22" y="244" width="376" height="32">
				<div class="note-fo">{cur.note}</div>
			</foreignObject>
		</svg>

		<div class="ps__panel">
			<span class="lbl">Таблица dp[0..{n}]</span>
			<div class="dp">
				{#each dpRow as v, k}
					<div
						class="cellbox"
						class:active={k === cur.i && !cur.done}
						class:done={k === cur.i && cur.done && cur.i !== 0}
						class:source={cur.from !== null && k === cur.from}
						class:empty={v === null}
					>
						<span class="ix">{k}</span>
						<span class="val">{v === null ? '·' : v}</span>
					</div>
				{/each}
			</div>

			<div class="legend">
				<span><i class="sw active"></i> заполняем dp[i]</span>
				<span><i class="sw source"></i> dp[i − j²]</span>
				<span><i class="sw done"></i> зафиксировано</span>
			</div>
		</div>
	</div>
</div>

<style>
	.ps {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.ps__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.nslide {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		flex-wrap: wrap;
	}
	.nslide input[type='range'] {
		width: 130px;
		accent-color: var(--blue);
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.nslide .lbl b,
	.ans b {
		font-family: var(--font-display);
		font-size: 0.95rem;
		color: var(--color-parch-100);
		text-transform: none;
		letter-spacing: 0;
	}
	.ans {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-muted);
	}
	.ans b {
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
	.ps__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.ps__svg {
		flex: 1 1 360px;
		min-width: 300px;
		max-width: 480px;
		height: auto;
	}
	.formula {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		fill: var(--color-parch-100);
		font-weight: 700;
	}
	.caption,
	.sumline {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		fill: var(--color-parch-muted);
	}
	.sumline {
		fill: var(--blue);
		font-size: 0.72rem;
	}
	.relax-box {
		fill: var(--color-ink-800);
		stroke: var(--blue);
		stroke-width: 1.5;
	}
	.relax-box.done {
		stroke: var(--color-ink-500);
	}
	.relax-txt {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		fill: var(--color-parch-100);
	}
	.relax-sub {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		fill: var(--blue);
	}
	.relax-box.done + .relax-txt {
		fill: var(--color-parch-200);
	}
	.tile rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 1.5;
	}
	.tile .cell {
		fill: var(--blue);
		stroke: none;
		opacity: 0.85;
	}
	.tile.t1 .cell { opacity: 0.9; }
	.tile.t2 .cell { opacity: 0.7; }
	.tile.t3 .cell { opacity: 0.55; }
	.tile.t4 .cell { opacity: 0.42; }
	.tile-lbl {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.74rem;
		fill: #fff;
		paint-order: stroke;
		stroke: var(--color-ink-850);
		stroke-width: 2.5px;
	}
	.note-box {
		fill: var(--color-ink-800);
		stroke: none;
	}
	.note-fo {
		font-family: var(--font-display);
		font-size: 0.74rem;
		line-height: 1.25;
		color: var(--color-parch-200);
		overflow: hidden;
	}
	.ps__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.dp {
		display: flex;
		flex-wrap: wrap;
		gap: 0.28rem;
	}
	.cellbox {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2.2rem;
		border: 1.5px solid var(--color-ink-600);
		border-radius: 6px;
		background: var(--color-ink-850);
		transition: all 0.2s;
	}
	.cellbox .ix {
		font-family: var(--font-mono);
		font-size: 0.54rem;
		color: var(--color-parch-muted);
		line-height: 1;
	}
	.cellbox .val {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.92rem;
		color: var(--color-parch-100);
		line-height: 1.1;
	}
	.cellbox.empty .val {
		color: var(--color-ink-500);
	}
	.cellbox.source {
		border-color: var(--color-parch-muted);
		background: var(--color-ink-800);
	}
	.cellbox.active {
		border-color: var(--blue);
		border-width: 2px;
		background: var(--blue-pale);
	}
	.cellbox.active .val {
		color: var(--blue);
	}
	.cellbox.done {
		border-color: var(--blue);
		background: var(--blue);
	}
	.cellbox.done .val {
		color: #fff;
	}
	.cellbox.done .ix {
		color: rgba(255, 255, 255, 0.7);
	}
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		margin-top: 0.2rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.sw {
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 4px;
		flex: none;
		border: 1.5px solid var(--color-ink-500);
	}
	.sw.active {
		border-color: var(--blue);
		background: var(--blue-pale);
	}
	.sw.source {
		border-color: var(--color-parch-muted);
		background: var(--color-ink-800);
	}
	.sw.done {
		border-color: var(--blue);
		background: var(--blue);
	}
</style>
