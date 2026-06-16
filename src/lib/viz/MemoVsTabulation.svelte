<script lang="ts">
	// Одна рекуррента — два способа динамического программирования бок о бок.
	// Слева top-down мемоизация (ленивое заполнение только нужных клеток через
	// рекурсию + кэш), справа bottom-up табуляция (итеративное заполнение всех
	// клеток по порядку). Шаг синхронный: одинаковая асимптотика, разный порядок
	// и покрытие клеток. Чистый SVG/HTML, без внешних зависимостей.

	// Событие записи в одну клетку DP-таблицы.
	// kind: 'enter' — вход в подзадачу (top-down, ещё не вычислена);
	//       'hit'   — попадание в кэш (top-down, клетка уже заполнена);
	//       'write' — клетка получила окончательное значение.
	type Cell = { i: number; j: number };
	type Ev = { cell: Cell; kind: 'enter' | 'hit' | 'write'; value?: number; note: string };

	type Problem = 'fib' | 'grid';

	// ── Фибоначчи: F(n) = F(n−1) + F(n−2), одномерная таблица ────────────
	const FIB_N = 7; // считаем F(7), клетки 0..7

	function fibMemo(): Ev[] {
		const ev: Ev[] = [];
		const memo: number[] = new Array(FIB_N + 1).fill(NaN);
		function f(n: number): number {
			if (!Number.isNaN(memo[n])) {
				ev.push({ cell: { i: 0, j: n }, kind: 'hit', value: memo[n], note: `F(${n}) уже в кэше = ${memo[n]}` });
				return memo[n];
			}
			ev.push({ cell: { i: 0, j: n }, kind: 'enter', note: `вызов F(${n})` });
			let r: number;
			if (n <= 1) {
				r = n;
			} else {
				r = f(n - 1) + f(n - 2);
			}
			memo[n] = r;
			ev.push({ cell: { i: 0, j: n }, kind: 'write', value: r, note: `F(${n}) = ${r} → в кэш` });
			return r;
		}
		f(FIB_N);
		return ev;
	}

	function fibTab(): Ev[] {
		const ev: Ev[] = [];
		const dp: number[] = new Array(FIB_N + 1).fill(0);
		for (let n = 0; n <= FIB_N; n++) {
			let r: number;
			if (n <= 1) r = n;
			else r = dp[n - 1] + dp[n - 2];
			dp[n] = r;
			ev.push({ cell: { i: 0, j: n }, kind: 'write', value: r, note: `dp[${n}] = ${r}` });
		}
		return ev;
	}

	// ── Пути в сетке: число путей в правый-нижний угол, двумерная таблица ─
	// P(i,j) = P(i−1,j) + P(i,j−1); первая строка/столбец = 1.
	const ROWS = 3;
	const COLS = 4;

	function gridMemo(): Ev[] {
		const ev: Ev[] = [];
		const memo: number[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(NaN));
		function p(i: number, j: number): number {
			if (!Number.isNaN(memo[i][j])) {
				ev.push({ cell: { i, j }, kind: 'hit', value: memo[i][j], note: `P(${i},${j}) из кэша = ${memo[i][j]}` });
				return memo[i][j];
			}
			ev.push({ cell: { i, j }, kind: 'enter', note: `вызов P(${i},${j})` });
			let r: number;
			if (i === 0 || j === 0) {
				r = 1;
			} else {
				r = p(i - 1, j) + p(i, j - 1);
			}
			memo[i][j] = r;
			ev.push({ cell: { i, j }, kind: 'write', value: r, note: `P(${i},${j}) = ${r} → в кэш` });
			return r;
		}
		p(ROWS - 1, COLS - 1);
		return ev;
	}

	function gridTab(): Ev[] {
		const ev: Ev[] = [];
		const dp: number[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
		for (let i = 0; i < ROWS; i++) {
			for (let j = 0; j < COLS; j++) {
				let r: number;
				if (i === 0 || j === 0) r = 1;
				else r = dp[i - 1][j] + dp[i][j - 1];
				dp[i][j] = r;
				ev.push({ cell: { i, j }, kind: 'write', value: r, note: `dp[${i}][${j}] = ${r}` });
			}
		}
		return ev;
	}

	// ── Состояние ────────────────────────────────────────────────────────
	let problem = $state<Problem>('fib');
	let idx = $state(0);
	let playing = $state(false);

	const memoEvents = $derived(problem === 'fib' ? fibMemo() : gridMemo());
	const tabEvents = $derived(problem === 'fib' ? fibTab() : gridTab());
	// Синхронный шаг: длина общей шкалы — максимум из двух последовательностей.
	const maxLen = $derived(Math.max(memoEvents.length, tabEvents.length));
	const rows = $derived(problem === 'fib' ? 1 : ROWS);
	const cols = $derived(problem === 'fib' ? FIB_N + 1 : COLS);

	// Состояние одной таблицы после первых `n` событий: значения, последняя
	// затронутая клетка и её тип, множество посещённых клеток.
	type View = {
		values: Map<string, number>;
		touched: Set<string>;
		active: Ev | null;
		done: number; // сколько событий проиграно
	};
	function key(c: Cell) { return `${c.i},${c.j}`; }

	function viewOf(events: Ev[], n: number): View {
		const values = new Map<string, number>();
		const touched = new Set<string>();
		let active: Ev | null = null;
		const lim = Math.min(n, events.length);
		for (let k = 0; k < lim; k++) {
			const e = events[k];
			touched.add(key(e.cell));
			if (e.value !== undefined) values.set(key(e.cell), e.value);
			active = e;
		}
		return { values, touched, active, done: lim };
	}

	const memoView = $derived(viewOf(memoEvents, idx));
	const tabView = $derived(viewOf(tabEvents, idx));

	// Сколько уникальных клеток уже заполнено (для счётчика «покрытие»).
	function filledCount(v: View) {
		let c = 0;
		for (const t of v.touched) if (v.values.has(t)) c++;
		return c;
	}
	const totalCells = $derived(rows * cols);

	function cellState(v: View, i: number, j: number): string {
		const k = `${i},${j}`;
		const isActive = v.active && v.active.cell.i === i && v.active.cell.j === j && v.done === idx;
		if (isActive) {
			if (v.active!.kind === 'hit') return 'active-hit';
			if (v.active!.kind === 'enter') return 'active-enter';
			return 'active-write';
		}
		if (v.values.has(k)) return 'filled';
		if (v.touched.has(k)) return 'touched';
		return 'idle';
	}

	// ── Контролы ─────────────────────────────────────────────────────────
	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= maxLen) {
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
	function setProblem(p: Problem) {
		problem = p;
		reset();
	}

	// Геометрия SVG-сетки.
	const CW = 46; // ширина клетки
	const CH = 40; // высота клетки
	const PAD = 8;
	function gx(j: number) { return PAD + j * CW; }
	function gy(i: number) { return PAD + i * CH; }
	const boardW = $derived(PAD * 2 + cols * CW);
	const boardH = $derived(PAD * 2 + rows * CH);

	function cellLabel(i: number, j: number): string {
		return problem === 'fib' ? `${j}` : `${i},${j}`;
	}
</script>

<div class="mt">
	<div class="mt__bar">
		<div class="seg">
			<button class:on={problem === 'fib'} onclick={() => setProblem('fib')}>Фибоначчи F(n)</button>
			<button class:on={problem === 'grid'} onclick={() => setProblem('grid')}>Пути в сетке</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(maxLen, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{maxLen}</span>
		</div>
	</div>

	<div class="mt__rec">
		<span class="rec-lbl">рекуррента</span>
		<code>
			{#if problem === 'fib'}
				F(n) = F(n−1) + F(n−2), F(0)=0, F(1)=1
			{:else}
				P(i,j) = P(i−1,j) + P(i,j−1); край = 1
			{/if}
		</code>
	</div>

	<div class="mt__cols">
		<!-- TOP-DOWN: мемоизация -->
		<div class="col">
			<div class="col__head">
				<span class="tag">top-down</span>
				<h4>Мемоизация</h4>
			</div>
			<p class="col__sub">рекурсия + кэш, лениво — только нужные клетки</p>
			<svg viewBox={`0 0 ${boardW} ${boardH}`} class="board" preserveAspectRatio="xMidYMid meet">
				{#each Array(rows) as _, i}
					{#each Array(cols) as _, j}
						<g class="cell {cellState(memoView, i, j)}">
							<rect x={gx(j)} y={gy(i)} width={CW - 5} height={CH - 5} rx="6" />
							<text x={gx(j) + (CW - 5) / 2} y={gy(i) + (CH - 5) / 2 - 4} class="idx">{cellLabel(i, j)}</text>
							{#if memoView.values.has(`${i},${j}`)}
								<text x={gx(j) + (CW - 5) / 2} y={gy(i) + (CH - 5) / 2 + 9} class="val">{memoView.values.get(`${i},${j}`)}</text>
							{/if}
						</g>
					{/each}
				{/each}
			</svg>
			<div class="col__meta">
				<span>покрыто: <b>{filledCount(memoView)}/{totalCells}</b></span>
				<span class="op {memoView.active && memoView.done === idx ? memoView.active.kind : ''}">
					{#if memoView.active && memoView.done === idx}
						{memoView.active.kind === 'hit' ? 'кэш-хит' : memoView.active.kind === 'enter' ? 'вход' : 'запись'}
					{:else}—{/if}
				</span>
			</div>
			<div class="col__note">{memoView.active && memoView.done === idx ? memoView.active.note : 'готово к старту'}</div>
		</div>

		<!-- BOTTOM-UP: табуляция -->
		<div class="col">
			<div class="col__head">
				<span class="tag tag--alt">bottom-up</span>
				<h4>Табуляция</h4>
			</div>
			<p class="col__sub">цикл по порядку — заполняет всю таблицу</p>
			<svg viewBox={`0 0 ${boardW} ${boardH}`} class="board" preserveAspectRatio="xMidYMid meet">
				{#each Array(rows) as _, i}
					{#each Array(cols) as _, j}
						<g class="cell {cellState(tabView, i, j)}">
							<rect x={gx(j)} y={gy(i)} width={CW - 5} height={CH - 5} rx="6" />
							<text x={gx(j) + (CW - 5) / 2} y={gy(i) + (CH - 5) / 2 - 4} class="idx">{cellLabel(i, j)}</text>
							{#if tabView.values.has(`${i},${j}`)}
								<text x={gx(j) + (CW - 5) / 2} y={gy(i) + (CH - 5) / 2 + 9} class="val">{tabView.values.get(`${i},${j}`)}</text>
							{/if}
						</g>
					{/each}
				{/each}
			</svg>
			<div class="col__meta">
				<span>покрыто: <b>{filledCount(tabView)}/{totalCells}</b></span>
				<span class="op {tabView.active && tabView.done === idx ? 'write' : ''}">
					{#if tabView.active && tabView.done === idx}запись{:else}—{/if}
				</span>
			</div>
			<div class="col__note">{tabView.active && tabView.done === idx ? tabView.active.note : 'готово к старту'}</div>
		</div>
	</div>

	<div class="mt__legend">
		<span><i class="sw enter"></i> вход в подзадачу</span>
		<span><i class="sw hit"></i> кэш-хит</span>
		<span><i class="sw write"></i> запись значения</span>
		<span><i class="sw filled"></i> вычислено</span>
	</div>

	<div class="mt__foot">
		Асимптотика одна — {problem === 'fib' ? 'O(n)' : 'O(rows·cols)'}. Разница в порядке и покрытии:
		мемоизация трогает только клетки, до которых дотянулась рекурсия (плюс кэш-хиты экономят повторный счёт),
		а табуляция методично заполняет всю таблицу слева направо.
	</div>
</div>

<style>
	.mt {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.mt__bar {
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
	.mt__rec {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		flex-wrap: wrap;
		padding: 0.6rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.rec-lbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.mt__rec code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--blue);
	}
	.mt__cols {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.col {
		flex: 1 1 280px;
		min-width: 250px;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.col__head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.col__head h4 {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1rem;
		color: var(--color-parch-100);
	}
	.tag {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.15rem 0.4rem;
		border-radius: 5px;
		background: var(--blue-pale);
		color: var(--blue);
		border: 1px solid var(--blue);
	}
	.tag--alt {
		background: var(--color-ink-800);
		color: var(--color-parch-200);
		border-color: var(--color-ink-500);
	}
	.col__sub {
		margin: 0;
		font-size: 0.74rem;
		color: var(--color-parch-muted);
	}
	.board {
		width: 100%;
		height: auto;
		max-width: 100%;
	}
	.cell rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		transition: fill 0.2s, stroke 0.2s;
	}
	.cell .idx {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.cell .val {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		fill: var(--color-parch-100);
	}
	.cell.touched rect {
		stroke: var(--blue);
		stroke-dasharray: 3 2;
	}
	.cell.filled rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.cell.filled .val {
		fill: var(--blue);
	}
	.cell.active-enter rect {
		fill: var(--color-ink-700);
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
		stroke-dasharray: 3 2;
	}
	.cell.active-hit rect {
		fill: var(--color-parch-200);
		stroke: var(--color-ink-700);
		stroke-width: 2.5;
	}
	.cell.active-hit .idx,
	.cell.active-hit .val {
		fill: var(--color-ink-850);
	}
	.cell.active-write rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
	}
	.cell.active-write .idx {
		fill: rgba(255, 255, 255, 0.7);
	}
	.cell.active-write .val {
		fill: #fff;
	}
	.col__meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-muted);
	}
	.col__meta b {
		color: var(--color-parch-100);
	}
	.op {
		padding: 0.1rem 0.4rem;
		border-radius: 5px;
		border: 1px solid var(--color-ink-600);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.op.write {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.op.hit {
		background: var(--color-parch-200);
		color: var(--color-ink-850);
		border-color: var(--color-parch-200);
	}
	.op.enter {
		border-color: var(--color-parch-100);
		color: var(--color-parch-100);
	}
	.col__note {
		font-size: 0.78rem;
		color: var(--color-parch-200);
		padding: 0.5rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
		min-height: 1.2rem;
	}
	.mt__legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		padding: 0.2rem 1rem 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
	}
	.mt__legend span {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.sw {
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 3px;
		display: inline-block;
		flex: none;
	}
	.sw.enter {
		background: var(--color-ink-700);
		border: 1.5px dashed var(--color-parch-100);
	}
	.sw.hit {
		background: var(--color-parch-200);
	}
	.sw.write {
		background: var(--blue);
	}
	.sw.filled {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.mt__foot {
		padding: 0.8rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		font-size: 0.8rem;
		color: var(--color-parch-200);
		line-height: 1.5;
	}
</style>
