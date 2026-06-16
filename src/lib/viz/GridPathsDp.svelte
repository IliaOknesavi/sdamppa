<script lang="ts">
	// Подсчёт числа путей в сетке m×n (только вправо/вниз) через ДП-табуляцию.
	// Forward: dp[i][j] = dp[i-1][j] + dp[i][j-1], заполняем сверху-слева.
	// Backward: dp[i][j] = dp[i+1][j] + dp[i][j+1], заполняем снизу-справа.
	// Клик по клетке ставит/снимает препятствие (его dp = 0 — гасит вклад).
	// Шаг заполняет клетки по одной; есть плей и сброс. Чистый SVG/HTML, без зависимостей.

	const ROWS = 4;
	const COLS = 5;
	type Dir = 'forward' | 'backward';

	// препятствия по умолчанию — пара клеток, чтобы сразу было видно эффект
	let blocked = $state<boolean[][]>(
		Array.from({ length: ROWS }, (_, i) =>
			Array.from({ length: COLS }, (_, j) => (i === 1 && j === 2) || (i === 2 && j === 1))
		)
	);
	let dir = $state<Dir>('forward');
	let step = $state(0); // сколько клеток уже заполнено
	let playing = $state(false);

	// порядок заполнения: forward — сверху-слева, backward — снизу-справа
	const order = $derived.by(() => {
		const cells: { i: number; j: number }[] = [];
		if (dir === 'forward') {
			for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) cells.push({ i, j });
		} else {
			for (let i = ROWS - 1; i >= 0; i--) for (let j = COLS - 1; j >= 0; j--) cells.push({ i, j });
		}
		return cells;
	});
	const total = ROWS * COLS;

	// полная таблица ДП (корректная логика) для текущих препятствий и направления
	const dp = $derived.by(() => {
		const t: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
		if (dir === 'forward') {
			for (let i = 0; i < ROWS; i++) {
				for (let j = 0; j < COLS; j++) {
					if (blocked[i][j]) { t[i][j] = 0; continue; }
					if (i === 0 && j === 0) { t[i][j] = 1; continue; }
					const up = i > 0 ? t[i - 1][j] : 0;
					const left = j > 0 ? t[i][j - 1] : 0;
					t[i][j] = up + left;
				}
			}
		} else {
			for (let i = ROWS - 1; i >= 0; i--) {
				for (let j = COLS - 1; j >= 0; j--) {
					if (blocked[i][j]) { t[i][j] = 0; continue; }
					if (i === ROWS - 1 && j === COLS - 1) { t[i][j] = 1; continue; }
					const down = i < ROWS - 1 ? t[i + 1][j] : 0;
					const right = j < COLS - 1 ? t[i][j + 1] : 0;
					t[i][j] = down + right;
				}
			}
		}
		return t;
	});

	// индекс клетки в порядке заполнения → удобно знать «filled / active»
	const orderIndex = $derived.by(() => {
		const m: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
		order.forEach((c, k) => (m[c.i][c.j] = k));
		return m;
	});

	// результат — угол, противоположный старту
	const goal = $derived(dir === 'forward' ? { i: ROWS - 1, j: COLS - 1 } : { i: 0, j: 0 });
	const start = $derived(dir === 'forward' ? { i: 0, j: 0 } : { i: ROWS - 1, j: COLS - 1 });
	const answer = $derived(dp[goal.i][goal.j]);
	const goalReady = $derived(step >= total); // ответ виден, когда заполнено всё

	const active = $derived(step > 0 && step <= total ? order[step - 1] : null);

	// два слагаемых для активной клетки — для подписи формулы
	const formula = $derived.by(() => {
		if (!active) return null;
		const { i, j } = active;
		if (blocked[i][j]) return { a: 0, b: 0, sum: 0, txt: 'препятствие → 0' };
		if (i === start.i && j === start.j) return { a: 0, b: 0, sum: 1, txt: 'старт → 1' };
		if (dir === 'forward') {
			const up = i > 0 ? dp[i - 1][j] : 0;
			const left = j > 0 ? dp[i][j - 1] : 0;
			return { a: up, b: left, sum: up + left, txt: `сверху ${up} + слева ${left}` };
		}
		const down = i < ROWS - 1 ? dp[i + 1][j] : 0;
		const right = j < COLS - 1 ? dp[i][j + 1] : 0;
		return { a: down, b: right, sum: down + right, txt: `снизу ${down} + справа ${right}` };
	});

	// геометрия SVG
	const CELL = 56;
	const PAD = 30;
	const W = PAD * 2 + COLS * CELL;
	const H = PAD * 2 + ROWS * CELL;
	const cx = (j: number) => PAD + j * CELL + CELL / 2;
	const cy = (i: number) => PAD + i * CELL + CELL / 2;

	function cellState(i: number, j: number): string {
		if (blocked[i][j]) return 'wall';
		const k = orderIndex[i][j];
		if (active && active.i === i && active.j === j) return 'active';
		if (k < step) return 'filled';
		return 'idle';
	}

	function toggle(i: number, j: number) {
		// нельзя ставить препятствие в старт/финиш
		if ((i === 0 && j === 0) || (i === ROWS - 1 && j === COLS - 1)) return;
		blocked[i][j] = !blocked[i][j];
		reset();
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
			if (step >= total) { stop(); return; }
			step += 1;
		}, 600);
	}
	function reset() {
		stop();
		step = 0;
	}
	function setDir(d: Dir) {
		dir = d;
		reset();
	}
</script>

<div class="gp">
	<div class="gp__bar">
		<div class="seg">
			<button class:on={dir === 'forward'} onclick={() => setDir('forward')}>forward ↘</button>
			<button class:on={dir === 'backward'} onclick={() => setDir('backward')}>backward ↖</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); step = Math.max(0, step - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="заполнять">▶</button>
			{/if}
			<button onclick={() => { stop(); step = Math.min(total, step + 1); }} title="шаг">▶▶</button>
			<span class="cnt">{step}/{total}</span>
		</div>
	</div>

	<div class="gp__body">
		<svg viewBox="0 0 {W} {H}" class="gp__svg">
			<!-- стрелки направления допустимых ходов -->
			<defs>
				<marker id="gp-arr" markerWidth="7" markerHeight="7" refX="5.5" refY="2.5" orient="auto">
					<path d="M0,0 L5,2.5 L0,5 z" fill="var(--color-ink-500)" />
				</marker>
			</defs>

			{#each Array(ROWS) as _, i}
				{#each Array(COLS) as _, j}
					{@const st = cellState(i, j)}
					<g
						class="cell {st}"
						onclick={() => toggle(i, j)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i, j); } }}
						role="button"
						tabindex="0"
					>
						<rect
							x={PAD + j * CELL + 3}
							y={PAD + i * CELL + 3}
							width={CELL - 6}
							height={CELL - 6}
							rx="8"
						/>
						{#if st === 'wall'}
							<text x={cx(j)} y={cy(i)} dy="0.34em" class="wall-mark">✕</text>
						{:else if orderIndex[i][j] < step}
							<text x={cx(j)} y={cy(i)} dy="0.34em" class="val">{dp[i][j]}</text>
						{/if}
						{#if (i === start.i && j === start.j)}
							<text x={cx(j)} y={PAD + i * CELL + 14} class="tag">старт</text>
						{:else if (i === goal.i && j === goal.j)}
							<text x={cx(j)} y={PAD + i * CELL + 14} class="tag">финиш</text>
						{/if}
					</g>
				{/each}
			{/each}

			<!-- стрелка-подсказка направления у активной клетки (откуда берём вклад) -->
			{#if active && !blocked[active.i][active.j] && !(active.i === start.i && active.j === start.j)}
				{#if dir === 'forward'}
					{#if active.i > 0}
						<line x1={cx(active.j)} y1={cy(active.i - 1) + 16} x2={cx(active.j)} y2={cy(active.i) - 16} class="flow" marker-end="url(#gp-arr)" />
					{/if}
					{#if active.j > 0}
						<line x1={cx(active.j - 1) + 16} y1={cy(active.i)} x2={cx(active.j) - 16} y2={cy(active.i)} class="flow" marker-end="url(#gp-arr)" />
					{/if}
				{:else}
					{#if active.i < ROWS - 1}
						<line x1={cx(active.j)} y1={cy(active.i + 1) - 16} x2={cx(active.j)} y2={cy(active.i) + 16} class="flow" marker-end="url(#gp-arr)" />
					{/if}
					{#if active.j < COLS - 1}
						<line x1={cx(active.j + 1) - 16} y1={cy(active.i)} x2={cx(active.j) + 16} y2={cy(active.i)} class="flow" marker-end="url(#gp-arr)" />
					{/if}
				{/if}
			{/if}
		</svg>

		<div class="gp__panel">
			<div class="answer">
				<span class="lbl">Путей до финиша</span>
				<b class:ready={goalReady}>{goalReady ? answer : '?'}</b>
			</div>
			<div class="props">
				<div class="prop"><span>сетка</span><b>{ROWS} × {COLS}</b></div>
				<div class="prop"><span>направление</span><b>{dir === 'forward' ? 'сверху-слева' : 'снизу-справа'}</b></div>
				<div class="prop"><span>препятствий</span><b>{blocked.flat().filter(Boolean).length}</b></div>
				<div class="prop"><span>рекуррента</span><b>{dir === 'forward' ? 'dp[i−1][j]+dp[i][j−1]' : 'dp[i+1][j]+dp[i][j+1]'}</b></div>
			</div>
			<div class="note">
				{#if active}
					{#if formula}
						Клетка ({active.i},{active.j}): {formula.txt} = <b>{formula.sum}</b>
					{/if}
				{:else if goalReady}
					Таблица заполнена. Препятствия зануляют вклад, поэтому часть путей теряется.
				{:else}
					Клик по клетке ставит/снимает препятствие. Жми «шаг» — числа заполняются по рекурренте.
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.gp {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.gp__bar {
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
		gap: 0;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		overflow: hidden;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		padding: 0.4rem 0.8rem;
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
	.gp__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.gp__svg {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 420px;
		height: auto;
	}
	.cell {
		cursor: pointer;
	}
	.cell rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-600);
		stroke-width: 2;
		transition: fill 0.2s, stroke 0.2s;
	}
	.cell:hover rect {
		stroke: var(--blue);
	}
	.cell.filled rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.cell.active rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.cell.wall rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-dasharray: 4 3;
	}
	.cell .val {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 1.05rem;
		fill: var(--color-parch-100);
	}
	.cell.active .val {
		fill: #fff;
	}
	.cell .wall-mark {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.1rem;
		fill: var(--color-parch-muted);
	}
	.cell .tag {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.5rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		fill: var(--color-parch-muted);
	}
	.flow {
		stroke: var(--color-ink-500);
		stroke-width: 2;
	}
	.gp__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.answer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		padding: 0.5rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border: 1.5px solid var(--color-ink-600);
	}
	.answer .lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.answer b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.6rem;
		color: var(--color-parch-muted);
		line-height: 1;
	}
	.answer b.ready {
		color: var(--blue);
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
		font-size: 0.72rem;
	}
	.note {
		margin-top: auto;
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.note b {
		color: var(--blue);
		font-family: var(--font-mono);
	}
</style>
