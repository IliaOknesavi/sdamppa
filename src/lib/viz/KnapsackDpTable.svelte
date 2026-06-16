<script lang="ts">
	// Interactive 0/1 knapsack DP table. Fills dp[i][c] row by row, highlighting
	// the two candidate cells — «не брать i» (dp[i-1][c]) и «брать i»
	// (dp[i-1][c-w_i]+v_i) — и выбранный max. В конце backtrace стрелками: какие
	// предметы взяты. Тумблер: полная 2D-таблица vs 1D O(W) (справа налево).
	// Шаг / назад / сброс. Чистый SVG, без зависимостей; язык как у
	// GraphTraversal / GraphTypes.
	type Item = { w: number; v: number; label: string };

	const items: Item[] = [
		{ w: 1, v: 1, label: 'A' },
		{ w: 2, v: 6, label: 'B' },
		{ w: 3, v: 10, label: 'C' },
		{ w: 5, v: 16, label: 'D' }
	];
	const W = 7;
	const N = items.length;

	// --- геометрия таблицы -----------------------------------------------------
	const T = { x0: 92, y0: 60, cw: 40, ch: 34 };
	const cellX = (c: number) => T.x0 + c * T.cw;
	const cellY = (i: number) => T.y0 + i * T.ch;

	// --- полная 2D-таблица: заполнение + пошаговая запись -----------------------
	type Step2D = {
		i: number; // 1..N — обрабатываемый предмет
		c: number; // 0..W — текущая вместимость
		skip: number; // dp[i-1][c]
		take: number | null; // dp[i-1][c-w]+v, или null если предмет не влезает
		chosen: number; // max(skip, take)
		took: boolean; // взяли ли предмет в этой клетке
		note: string;
	};

	function buildTable() {
		const dp: number[][] = Array.from({ length: N + 1 }, () => Array(W + 1).fill(0));
		const steps: Step2D[] = [];
		for (let i = 1; i <= N; i++) {
			const it = items[i - 1];
			for (let c = 0; c <= W; c++) {
				const skip = dp[i - 1][c];
				let take: number | null = null;
				if (it.w <= c) take = dp[i - 1][c - it.w] + it.v;
				const took = take !== null && take > skip;
				const chosen = took ? (take as number) : skip;
				dp[i][c] = chosen;
				steps.push({
					i,
					c,
					skip,
					take,
					chosen,
					took,
					note:
						take === null
							? `${it.label} (w=${it.w}) не влезает в c=${c} ⇒ берём верхнюю dp[${i - 1}][${c}]=${skip}`
							: took
								? `Взять ${it.label}: dp[${i - 1}][${c - it.w}]+${it.v}=${take} > ${skip} ⇒ dp[${i}][${c}]=${take}`
								: `Не брать ${it.label}: ${skip} ≥ ${take} ⇒ dp[${i}][${c}]=${skip}`
				});
			}
		}
		return { dp, steps };
	}
	const table = buildTable();
	const dp = table.dp;
	const steps2d = table.steps;
	const totalValue = dp[N][W];

	// backtrace: множество индексов взятых предметов (0..N-1)
	function computeBacktrace() {
		const taken = new Set<number>();
		// btCol[i] — колонка, где стоит «решение» по предмету i (1..N) на пути
		const btColMap: Record<number, number> = {};
		const arrows: { x1: number; y1: number; x2: number; y2: number }[] = [];
		let c = W;
		for (let i = N; i >= 1; i--) {
			btColMap[i] = c;
			if (dp[i][c] !== dp[i - 1][c]) {
				taken.add(i - 1);
				const nc = c - items[i - 1].w;
				arrows.push({
					x1: cellX(c) + (T.cw - 3) / 2,
					y1: cellY(i),
					x2: cellX(nc) + (T.cw - 3) / 2,
					y2: cellY(i - 1) + (T.ch - 3)
				});
				c = nc;
			} else {
				arrows.push({
					x1: cellX(c) + (T.cw - 3) / 2,
					y1: cellY(i),
					x2: cellX(c) + (T.cw - 3) / 2,
					y2: cellY(i - 1) + (T.ch - 3)
				});
			}
		}
		return { taken, btColMap, arrows };
	}
	const bt = computeBacktrace();
	const takenItems = bt.taken;
	const btColMap = bt.btColMap;
	const backArrows = bt.arrows;

	// --- 1D вариант O(W), справа налево ----------------------------------------
	type Step1D = {
		i: number;
		c: number;
		before: number;
		cand: number;
		updated: boolean;
		note: string;
	};
	function build1D() {
		const arr: number[] = Array(W + 1).fill(0);
		const steps: Step1D[] = [];
		const snaps: number[][] = [[...arr]]; // snaps[k] — состояние массива после k шагов
		for (let i = 1; i <= N; i++) {
			const it = items[i - 1];
			for (let c = W; c >= it.w; c--) {
				const before = arr[c];
				const cand = arr[c - it.w] + it.v;
				const updated = cand > before;
				if (updated) arr[c] = cand;
				steps.push({
					i,
					c,
					before,
					cand,
					updated,
					note: updated
						? `dp[${c}] = max(${before}, dp[${c - it.w}]+${it.v}=${cand}) = ${cand} — обновили`
						: `dp[${c}] = max(${before}, ${cand}) = ${before} — без изменений`
				});
				snaps.push([...arr]);
			}
		}
		return { steps, snaps };
	}
	const oned = build1D();
	const steps1d = oned.steps;
	const snaps1d = oned.snaps;

	// --- state -----------------------------------------------------------------
	let mode = $state<'2d' | '1d'>('2d');
	let idx2d = $state(0); // 0..steps2d.length (последний = backtrace готов)
	let idx1d = $state(0); // 0..steps1d.length

	const max2d = steps2d.length;
	const max1d = steps1d.length;

	const done2d = $derived(idx2d >= max2d);
	const cur2d = $derived(idx2d > 0 && idx2d <= max2d ? steps2d[idx2d - 1] : null);
	const cur1d = $derived(idx1d > 0 && idx1d <= max1d ? steps1d[idx1d - 1] : null);
	const arr1d = $derived(snaps1d[Math.min(idx1d, max1d)]);
	const takenLabels = $derived(
		[...takenItems].sort((a, b) => a - b).map((i) => items[i].label).join(', ')
	);

	function reset() {
		idx2d = 0;
		idx1d = 0;
	}
	function setMode(m: '2d' | '1d') {
		mode = m;
		reset();
	}
	function step() {
		if (mode === '2d') idx2d = Math.min(max2d, idx2d + 1);
		else idx1d = Math.min(max1d, idx1d + 1);
	}
	function back() {
		if (mode === '2d') idx2d = Math.max(0, idx2d - 1);
		else idx1d = Math.max(0, idx1d - 1);
	}

	// клетка 2D уже посчитана? (строка 0 всегда видна; иначе по порядку заполнения)
	function cellFilled2d(i: number, c: number, upto: number): boolean {
		if (i === 0) return true;
		const flat = (i - 1) * (W + 1) + c;
		return flat < upto;
	}
	// класс клетки 2D в текущем шаге
	function cls2d(i: number, c: number, s: Step2D | null): string {
		if (!s) return '';
		if (i === s.i && c === s.c) return 'active'; // результат
		if (i === s.i - 1 && c === s.c) return 'skip'; // кандидат «не брать»
		if (s.take !== null && i === s.i - 1 && c === s.c - items[s.i - 1].w) return 'take'; // «брать»
		return '';
	}
	// клетка на пути backtrace?
	function isBt(i: number, c: number): boolean {
		if (i < 1) return false;
		return takenItems.has(i - 1) && btColMap[i] === c;
	}
	// класс клетки 1D
	function cls1d(c: number, s: Step1D | null): string {
		if (!s) return '';
		if (c === s.c) return 'active';
		if (c === s.c - items[s.i - 1].w) return 'take';
		return '';
	}
</script>

<div class="kp">
	<div class="kp__bar">
		<div class="seg">
			<button class:on={mode === '2d'} onclick={() => setMode('2d')}>Полная таблица</button>
			<button class:on={mode === '1d'} onclick={() => setMode('1d')}>1D O(W) ←</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={back} title="назад">◀</button>
			<button onclick={step} title="шаг">▶▶</button>
			<span class="cnt">
				{#if mode === '2d'}{idx2d}/{max2d}{:else}{idx1d}/{max1d}{/if}
			</span>
		</div>
	</div>

	<div class="kp__body">
		{#if mode === '2d'}
			<svg viewBox="0 0 420 290" class="kp__svg">
				<defs>
					<marker
						id="kp-arr"
						markerWidth="8"
						markerHeight="8"
						refX="6.5"
						refY="3"
						orient="auto-start-reverse"
					>
						<path d="M0,0 L6.5,3 L0,6 z" fill="var(--blue)" />
					</marker>
				</defs>

				<text class="axis" x={T.x0} y={T.y0 - 30} dy="0.32em">вместимость c →</text>
				{#each Array(W + 1) as _, c}
					<text class="hdr" x={cellX(c) + (T.cw - 3) / 2} y={T.y0 - 14} dy="0.32em">{c}</text>
				{/each}

				{#each Array(N + 1) as _, i}
					{#if i === 0}
						<text class="rlbl" x={T.x0 - 12} y={cellY(i) + (T.ch - 3) / 2} dy="0.32em">∅</text>
					{:else}
						<g class="rowtag" class:taken={done2d && takenItems.has(i - 1)}>
							<text class="rlbl" x={T.x0 - 12} y={cellY(i) + (T.ch - 3) / 2 - 4} dy="0.32em"
								>{items[i - 1].label}</text
							>
							<text class="rsub" x={T.x0 - 12} y={cellY(i) + (T.ch - 3) / 2 + 8} dy="0.32em"
								>w{items[i - 1].w} v{items[i - 1].v}</text
							>
						</g>
					{/if}
					{#each Array(W + 1) as _, c}
						{@const filled = cellFilled2d(i, c, idx2d)}
						<g
							class="cell {cls2d(i, c, cur2d)}"
							class:filled
							class:bt={done2d && isBt(i, c)}
						>
							<rect x={cellX(c)} y={cellY(i)} width={T.cw - 3} height={T.ch - 3} rx="5" />
							{#if filled}
								<text x={cellX(c) + (T.cw - 3) / 2} y={cellY(i) + (T.ch - 3) / 2} dy="0.32em"
									>{dp[i][c]}</text
								>
							{/if}
						</g>
					{/each}
				{/each}

				{#if done2d}
					{#each backArrows as a}
						<line
							class="btarrow"
							x1={a.x1}
							y1={a.y1}
							x2={a.x2}
							y2={a.y2}
							marker-end="url(#kp-arr)"
						/>
					{/each}
				{/if}
			</svg>
		{:else}
			<svg viewBox="0 0 420 290" class="kp__svg">
				<text class="axis" x={28} y={94} dy="0.32em">dp[c]</text>
				{#each Array(W + 1) as _, c}
					<text class="hdr" x={cellX(c) + (T.cw - 3) / 2} y={62} dy="0.32em">{c}</text>
					<g class="cell filled {cls1d(c, cur1d)}">
						<rect x={cellX(c)} y={80} width={T.cw - 3} height={T.ch - 3} rx="5" />
						<text x={cellX(c) + (T.cw - 3) / 2} y={80 + (T.ch - 3) / 2} dy="0.32em">{arr1d[c]}</text>
					</g>
				{/each}

				<text class="axis" x={T.x0} y={138} dy="0.32em"
					>каждый предмет: c идёт W → w_i (справа налево)</text
				>
				{#if cur1d}
					<text class="dir" x={cellX(W) + (T.cw - 3) / 2 + 16} y={97} dy="0.32em">←</text>
				{/if}

				{#each items as it, j}
					<g class="ilist" class:on={cur1d ? cur1d.i === j + 1 : false}>
						<rect x={T.x0 + j * 74} y={170} width="66" height="36" rx="6" />
						<text class="iname" x={T.x0 + j * 74 + 33} y={184} dy="0.32em">{it.label}</text>
						<text class="iwv" x={T.x0 + j * 74 + 33} y={197} dy="0.32em">w={it.w} v={it.v}</text>
					</g>
				{/each}
			</svg>
		{/if}

		<div class="kp__panel">
			<div class="props">
				<div class="prop"><span>вместимость W</span><b>{W}</b></div>
				<div class="prop"><span>предметов N</span><b>{N}</b></div>
				<div class="prop"><span>память</span><b>{mode === '2d' ? 'O(N·W)' : 'O(W)'}</b></div>
				{#if cur2d}
					<div class="prop"><span>не брать</span><b>{cur2d.skip}</b></div>
					<div class="prop">
						<span>брать</span><b>{cur2d.take === null ? '— (не влезает)' : cur2d.take}</b>
					</div>
					<div class="prop"><span>выбрано max</span><b class="hl">{cur2d.chosen}</b></div>
				{:else if cur1d}
					<div class="prop"><span>было dp[{cur1d.c}]</span><b>{cur1d.before}</b></div>
					<div class="prop"><span>кандидат</span><b>{cur1d.cand}</b></div>
					<div class="prop">
						<span>результат</span><b class="hl">{cur1d.updated ? cur1d.cand : cur1d.before}</b>
					</div>
				{/if}
			</div>
			<div class="note">
				{#if mode === '2d'}
					{#if done2d}
						Готово. Ответ dp[{N}][{W}] = <b>{totalValue}</b>. Backtrace (стрелки вверх): взяты
						предметы {takenLabels || '—'}.
					{:else if cur2d}
						{cur2d.note}
					{:else}
						dp[i][c] — макс. ценность из первых i предметов при лимите c. Строка ∅ — пустой набор
						(нули). Жми «шаг».
					{/if}
				{:else if idx1d >= max1d}
					Готово. Один массив длины W+1: dp[{W}] = <b>{arr1d[W]}</b>. Тот же ответ, но память O(W).
				{:else if cur1d}
					{cur1d.note}
				{:else}
					Один массив dp[c]. Для каждого предмета идём c от W к w_i: так dp[c−w] ещё хранит
					значения строки i−1. Жми «шаг».
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.kp {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.kp__bar {
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
		font-size: 0.76rem;
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
	.kp__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.kp__svg {
		flex: 1 1 330px;
		min-width: 290px;
		max-width: 480px;
		height: auto;
	}

	.hdr {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		fill: var(--color-parch-muted);
	}
	.axis {
		text-anchor: start;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
	}
	.rlbl {
		text-anchor: end;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.84rem;
		fill: var(--color-parch-100);
	}
	.rsub {
		text-anchor: end;
		font-family: var(--font-mono);
		font-size: 0.52rem;
		fill: var(--color-parch-muted);
	}
	.rowtag.taken .rlbl {
		fill: var(--blue);
	}

	.cell rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		transition: fill 0.2s, stroke 0.2s;
	}
	.cell text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.72rem;
		fill: var(--color-parch-100);
	}
	.cell.filled rect {
		fill: var(--color-ink-700);
	}
	/* кандидат «не брать» — пунктирная рамка */
	.cell.skip rect {
		fill: var(--color-ink-700);
		stroke: var(--color-parch-muted);
		stroke-width: 2.5;
		stroke-dasharray: 3 2;
	}
	/* кандидат «брать» */
	.cell.take rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 2.5;
	}
	.cell.take text {
		fill: var(--blue);
	}
	/* выбранная клетка-результат */
	.cell.active rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
	}
	.cell.active text {
		fill: #fff;
	}
	/* клетки на пути backtrace */
	.cell.bt rect {
		stroke: var(--blue);
		stroke-width: 2.5;
	}

	.btarrow {
		stroke: var(--blue);
		stroke-width: 2;
		opacity: 0.85;
	}
	.dir {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.1rem;
		fill: var(--blue);
	}

	.ilist rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		transition: fill 0.2s, stroke 0.2s;
	}
	.ilist.on rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 2.5;
	}
	.iname {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.78rem;
		fill: var(--color-parch-100);
	}
	.iwv {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.ilist.on .iname {
		fill: var(--blue);
	}

	.kp__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
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
	.prop b.hl {
		color: var(--blue);
	}
	.note {
		margin-top: auto;
		font-size: 0.84rem;
		line-height: 1.45;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.note b {
		color: var(--blue);
	}
</style>
