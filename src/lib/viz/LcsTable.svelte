<script lang="ts">
	// Interactive LCS (наибольшая общая подпоследовательность) DP-таблица.
	// Пошаговое заполнение dp[i][j]: при совпадении символов — диагональ+1,
	// иначе max(сверху, слева), с подсветкой источника. Backtrace восстанавливает
	// саму подпоследовательность справа налево. Pure SVG/HTML, без внешних импортов.

	type Cell = {
		i: number; // строка (символ A), 0..m
		j: number; // столбец (символ B), 0..n
		val: number; // dp[i][j]
		from: 'diag' | 'up' | 'left' | null; // источник значения
		match: boolean; // символы совпали
		note: string; // подпись шага
	};

	const PAIRS = [
		{ a: 'ABCBDAB', b: 'BDCAB' },
		{ a: 'AGGTAB', b: 'GXTXAYB' },
		{ a: 'HELLO', b: 'WORLD' }
	];

	let pi = $state(0);
	const A = $derived(PAIRS[pi].a);
	const B = $derived(PAIRS[pi].b);
	const m = $derived(A.length);
	const n = $derived(B.length);

	// Полный порядок заполнения: построчно, слева направо, начиная с (1,1).
	// dp[0][*] = dp[*][0] = 0 (база), её не анимируем — она задаётся сразу.
	function buildSteps(a: string, b: string): Cell[] {
		const M = a.length;
		const N = b.length;
		const dp: number[][] = Array.from({ length: M + 1 }, () => Array(N + 1).fill(0));
		const steps: Cell[] = [];
		for (let i = 1; i <= M; i++) {
			for (let j = 1; j <= N; j++) {
				const match = a[i - 1] === b[j - 1];
				let from: Cell['from'];
				let note: string;
				if (match) {
					dp[i][j] = dp[i - 1][j - 1] + 1;
					from = 'diag';
					note = `'${a[i - 1]}' = '${b[j - 1]}' → диагональ ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}`;
				} else if (dp[i - 1][j] >= dp[i][j - 1]) {
					dp[i][j] = dp[i - 1][j];
					from = 'up';
					note = `'${a[i - 1]}' ≠ '${b[j - 1]}' → max(↑${dp[i - 1][j]}, ←${dp[i][j - 1]}) = ↑${dp[i][j]}`;
				} else {
					dp[i][j] = dp[i][j - 1];
					from = 'left';
					note = `'${a[i - 1]}' ≠ '${b[j - 1]}' → max(↑${dp[i - 1][j]}, ←${dp[i][j - 1]}) = ←${dp[i][j]}`;
				}
				steps.push({ i, j, val: dp[i][j], from, match, note });
			}
		}
		return steps;
	}

	// Восстановление LCS: из (M,N) идём к (0,0). Совпало — берём символ, идём по диагонали;
	// иначе шаг туда, откуда взяли значение. Возвращаем путь (клетки) и саму строку.
	function buildTrace(a: string, b: string): { path: Set<string>; picks: Set<string>; lcs: string } {
		const M = a.length;
		const N = b.length;
		const dp: number[][] = Array.from({ length: M + 1 }, () => Array(N + 1).fill(0));
		for (let i = 1; i <= M; i++)
			for (let j = 1; j <= N; j++)
				dp[i][j] = a[i - 1] === b[j - 1]
					? dp[i - 1][j - 1] + 1
					: Math.max(dp[i - 1][j], dp[i][j - 1]);
		const path = new Set<string>();
		const picks = new Set<string>();
		let out = '';
		let i = M;
		let j = N;
		while (i > 0 && j > 0) {
			path.add(`${i},${j}`);
			if (a[i - 1] === b[j - 1]) {
				out = a[i - 1] + out;
				picks.add(`${i},${j}`);
				i--;
				j--;
			} else if (dp[i - 1][j] >= dp[i][j - 1]) {
				i--;
			} else {
				j--;
			}
		}
		return { path, picks, lcs: out };
	}

	const steps = $derived(buildSteps(A, B));
	const trace = $derived(buildTrace(A, B));

	let idx = $state(0); // сколько клеток заполнено (0..steps.length)
	let playing = $state(false);
	let showTrace = $state(false);

	// Какие клетки уже посчитаны и их значения.
	const filled = $derived.by(() => {
		const map = new Map<string, Cell>();
		for (let k = 0; k < idx; k++) {
			const s = steps[k];
			map.set(`${s.i},${s.j}`, s);
		}
		return map;
	});
	const active = $derived(idx > 0 ? steps[idx - 1] : null);
	const done = $derived(idx >= steps.length);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		if (done) return;
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= steps.length) {
				stop();
				return;
			}
			idx += 1;
		}, 550);
	}
	function reset() {
		stop();
		idx = 0;
		showTrace = false;
	}
	function fillAll() {
		stop();
		idx = steps.length;
	}
	function setPair(k: number) {
		pi = k;
		reset();
	}
	function toggleTrace() {
		if (!done) fillAll();
		showTrace = !showTrace;
	}

	// Геометрия таблицы внутри viewBox 420×290.
	const ox = 64; // левый отступ под заголовок столбцов «B»
	const oy = 56; // верхний отступ под заголовок строк «A»
	const cwAvail = 420 - ox - 8;
	const chAvail = 290 - oy - 8;
	const cw = $derived(Math.min(34, cwAvail / (n + 1)));
	const ch = $derived(Math.min(30, chAvail / (m + 1)));

	function isSource(i: number, j: number): boolean {
		if (!active) return false;
		const f = active.from;
		if (f === 'diag') return i === active.i - 1 && j === active.j - 1;
		if (f === 'up') return i === active.i - 1 && j === active.j;
		if (f === 'left') return i === active.i && j === active.j - 1;
		return false;
	}
	function cellClass(i: number, j: number): string {
		const key = `${i},${j}`;
		if (active && i === active.i && j === active.j) return 'cur';
		if (isSource(i, j)) return 'src';
		if (showTrace && trace.picks.has(key)) return 'pick';
		if (showTrace && trace.path.has(key)) return 'trace';
		if (filled.has(key) || i === 0 || j === 0) return 'set';
		return 'idle';
	}
	function cellVal(i: number, j: number): string {
		if (i === 0 || j === 0) return '0';
		const c = filled.get(`${i},${j}`);
		return c ? String(c.val) : '';
	}
</script>

<div class="lcs">
	<div class="lcs__bar">
		<div class="seg">
			{#each PAIRS as p, k}
				<button class:on={pi === k} onclick={() => setPair(k)}>{p.a} / {p.b}</button>
			{/each}
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); showTrace = false; idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть" disabled={done}>▶</button>
			{/if}
			<button onclick={() => { stop(); showTrace = false; idx = Math.min(steps.length, idx + 1); }} title="шаг вперёд" disabled={done}>▶▶</button>
			<button class="trace-btn" class:on={showTrace} onclick={toggleTrace} title="восстановить подпоследовательность">backtrace</button>
			<span class="cnt">{idx}/{steps.length}</span>
		</div>
	</div>

	<div class="lcs__body">
		<svg viewBox="0 0 420 290" class="lcs__svg">
			<!-- заголовок столбцов: строка B -->
			<text class="axis" x={ox - cw / 2} y={oy - ch / 2} dy="0.34em" text-anchor="middle">B</text>
			<text class="hdr" x={ox + cw / 2} y={oy - ch - 4} text-anchor="middle">∅</text>
			{#each B.split('') as ch2, j}
				<text class="hdr" x={ox + cw * (j + 1) + cw / 2} y={oy - ch - 4} text-anchor="middle">{ch2}</text>
			{/each}
			<!-- заголовок строк: строка A -->
			<text class="axis" x={ox - cw - 6} y={oy - ch / 2} dy="0.34em" text-anchor="middle">A</text>
			<text class="hdr" x={ox - 10} y={oy + ch / 2} dy="0.34em" text-anchor="end">∅</text>
			{#each A.split('') as ch1, i}
				<text class="hdr" x={ox - 10} y={oy + ch * (i + 1) + ch / 2} dy="0.34em" text-anchor="end">{ch1}</text>
			{/each}

			<!-- клетки dp[0..m][0..n] -->
			{#each Array(m + 1) as _, i}
				{#each Array(n + 1) as _, j}
					{@const cls = cellClass(i, j)}
					<g class="cell {cls}">
						<rect
							x={ox + cw * j}
							y={oy + ch * i}
							width={cw - 1.5}
							height={ch - 1.5}
							rx="4"
						/>
						<text
							x={ox + cw * j + (cw - 1.5) / 2}
							y={oy + ch * i + (ch - 1.5) / 2}
							dy="0.34em"
							text-anchor="middle"
						>{cellVal(i, j)}</text>
					</g>
				{/each}
			{/each}
		</svg>

		<div class="lcs__panel">
			<div class="legend">
				<span><i class="sw cur"></i>текущая</span>
				<span><i class="sw src"></i>источник</span>
				<span><i class="sw pick"></i>символ LCS</span>
				<span><i class="sw trace"></i>путь backtrace</span>
			</div>

			<div class="rule">
				<div class="rule-line"><b>совпали</b> символы → dp = диагональ + 1</div>
				<div class="rule-line"><b>иначе</b> → max(сверху ↑, слева ←)</div>
			</div>

			{#if showTrace}
				<div class="row">
					<span class="lbl">Подпоследовательность</span>
					<div class="chips">
						{#each trace.lcs.split('') as c}<span class="chip">{c}</span>{:else}<span class="empty">—</span>{/each}
					</div>
					<div class="len">длина LCS = {trace.lcs.length}</div>
				</div>
			{/if}

			<div class="note">
				{#if active}{active.note}{:else if showTrace}Backtrace: из правого нижнего угла идём к (∅,∅), на совпадениях берём символ.{:else}Нажми «шаг вперёд» или ▶, чтобы заполнять таблицу. База dp[∅][·] = 0.{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.lcs {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.lcs__bar {
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
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.seg button {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.7rem;
		padding: 0.32rem 0.6rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover { border-color: var(--blue); color: var(--blue); }
	.seg button.on { background: var(--blue); color: #fff; border-color: var(--blue); }
	.ctrl {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		flex-wrap: wrap;
	}
	.ctrl button {
		min-width: 2rem;
		height: 2rem;
		padding: 0 0.4rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.8rem;
	}
	.ctrl button:hover:not(:disabled) {
		border-color: var(--blue);
		color: var(--blue);
	}
	.ctrl button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.trace-btn {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
	}
	.trace-btn.on {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.2rem;
	}
	.lcs__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.lcs__svg {
		flex: 1 1 330px;
		min-width: 280px;
		max-width: 470px;
		height: auto;
	}
	.axis {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.86rem;
		fill: var(--blue);
	}
	.hdr {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.74rem;
		fill: var(--color-parch-200);
	}
	.cell rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1.2;
		transition: fill 0.2s, stroke 0.2s;
	}
	.cell text {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.74rem;
		fill: var(--color-parch-muted);
		transition: fill 0.2s;
	}
	.cell.set rect { fill: var(--color-ink-700, var(--color-ink-800)); stroke: var(--color-ink-500); }
	.cell.set text { fill: var(--color-parch-100); }
	.cell.src rect { fill: var(--blue-pale); stroke: var(--blue); stroke-width: 2; }
	.cell.src text { fill: var(--blue); }
	.cell.cur rect { fill: var(--blue); stroke: var(--color-parch-100); stroke-width: 2.5; }
	.cell.cur text { fill: #fff; }
	.cell.trace rect { fill: var(--blue-pale); stroke: var(--blue); stroke-width: 1.8; }
	.cell.trace text { fill: var(--blue); }
	.cell.pick rect { fill: var(--blue); stroke: var(--color-parch-100); stroke-width: 2; }
	.cell.pick text { fill: #fff; }
	.lcs__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.8rem;
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.sw {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 3px;
		flex: none;
	}
	.sw.cur { background: var(--blue); border: 1.5px solid var(--color-parch-100); }
	.sw.src { background: var(--blue-pale); border: 1.5px solid var(--blue); }
	.sw.pick { background: var(--blue); border: 1.5px solid var(--color-parch-100); }
	.sw.trace { background: var(--blue-pale); border: 1.5px solid var(--blue); }
	.rule {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.78rem;
		color: var(--color-parch-200);
		padding: 0.5rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 8px;
	}
	.rule-line b { color: var(--blue); font-family: var(--font-display); }
	.row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		min-height: 1.8rem;
	}
	.chip {
		display: grid;
		place-items: center;
		min-width: 1.7rem;
		height: 1.7rem;
		padding: 0 0.4rem;
		border-radius: 6px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.82rem;
		background: var(--blue);
		color: #fff;
	}
	.empty { color: var(--color-parch-muted); }
	.len {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--color-parch-200);
	}
	.note {
		margin-top: auto;
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
		min-height: 2.6rem;
	}
</style>
