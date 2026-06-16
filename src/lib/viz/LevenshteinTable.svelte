<script lang="ts">
	// Interactive Levenshtein (edit distance) DP table. Step / play / reset
	// fills the (n+1)×(m+1) grid cell by cell; each cell is coloured by the
	// transition that produced its value: совпадение (diagonal, no cost),
	// замена / удаление / вставка. A backtrace button reconstructs the
	// cheapest edit path from the bottom-right corner. Pure SVG, no deps;
	// same visual language as GraphTraversal / GraphTypes.
	type Origin = 'match' | 'sub' | 'del' | 'ins' | 'base';
	type Cell = { i: number; j: number; value: number; origin: Origin; note: string };
	type Frame = { cells: Cell[]; cur: { i: number; j: number } | null; note: string };

	const A = 'КОТИК'; // строка-источник → строки таблицы (i)
	const B = 'СКАТ'; // строка-цель → столбцы таблицы (j)
	const aCh = [...A];
	const bCh = [...B];
	const n = aCh.length;
	const m = bCh.length;

	// Geometry: one extra row/col for the empty-prefix base case + header band.
	const CELL = 30;
	const OX = 64; // отступ слева под подпись строки A + заголовок ε/буквы B
	const OY = 60;

	// Build the full DP fill order (row-major) as animation frames. Each frame
	// adds exactly one cell so шаги ровно соответствуют работе алгоритма.
	function buildFrames(): Frame[] {
		const D: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
		const ORG: Origin[][] = Array.from({ length: n + 1 }, () => Array<Origin>(m + 1).fill('base'));
		const frames: Frame[] = [];
		const acc: Cell[] = [];

		const push = (i: number, j: number, note: string) => {
			acc.push({ i, j, value: D[i][j], origin: ORG[i][j], note });
			frames.push({ cells: [...acc], cur: { i, j }, note });
		};

		// База: пустой префикс — стоимость = длине вставленного/удалённого.
		D[0][0] = 0; ORG[0][0] = 'base';
		push(0, 0, 'База: оба префикса пусты — расстояние 0.');
		for (let j = 1; j <= m; j++) {
			D[0][j] = j; ORG[0][j] = 'ins';
			push(0, j, `Пустой источник → «${bCh.slice(0, j).join('')}»: ${j} вставк${j === 1 ? 'а' : 'и'}.`);
		}
		for (let i = 1; i <= n; i++) {
			D[i][0] = i; ORG[i][0] = 'del';
			push(i, 0, `«${aCh.slice(0, i).join('')}» → пусто: ${i} удален${i === 1 ? 'ие' : 'ия'}.`);
		}

		// Основное заполнение.
		for (let i = 1; i <= n; i++) {
			for (let j = 1; j <= m; j++) {
				const same = aCh[i - 1] === bCh[j - 1];
				const diag = D[i - 1][j - 1] + (same ? 0 : 1);
				const up = D[i - 1][j] + 1; // удаление символа из A
				const left = D[i][j - 1] + 1; // вставка символа из B
				const best = Math.min(diag, up, left);
				D[i][j] = best;
				let org: Origin;
				let note: string;
				if (same && diag === best) {
					org = 'match';
					note = `«${aCh[i - 1]}» = «${bCh[j - 1]}» → диагональ без +1, ${best}.`;
				} else if (diag === best) {
					org = 'sub';
					note = `«${aCh[i - 1]}» ≠ «${bCh[j - 1]}» → замена (диагональ +1), ${best}.`;
				} else if (up === best) {
					org = 'del';
					note = `min сверху → удаление «${aCh[i - 1]}» (+1), ${best}.`;
				} else {
					org = 'ins';
					note = `min слева → вставка «${bCh[j - 1]}» (+1), ${best}.`;
				}
				ORG[i][j] = org;
				push(i, j, note);
			}
		}

		// Финальный кадр: ответ в правом нижнем углу.
		frames.push({
			cells: [...acc],
			cur: { i: n, j: m },
			note: `Таблица заполнена. Расстояние Левенштейна = ${D[n][m]}. Нажмите «Путь правок».`
		});
		return frames;
	}

	const frames = buildFrames();

	// Backtrace: от (n,m) к (0,0) по сохранённым origin'ам.
	function buildPath(): Set<string> {
		const D: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
		const ORG: Origin[][] = Array.from({ length: n + 1 }, () => Array<Origin>(m + 1).fill('base'));
		for (let j = 1; j <= m; j++) { D[0][j] = j; ORG[0][j] = 'ins'; }
		for (let i = 1; i <= n; i++) { D[i][0] = i; ORG[i][0] = 'del'; }
		for (let i = 1; i <= n; i++) {
			for (let j = 1; j <= m; j++) {
				const same = aCh[i - 1] === bCh[j - 1];
				const diag = D[i - 1][j - 1] + (same ? 0 : 1);
				const up = D[i - 1][j] + 1;
				const left = D[i][j - 1] + 1;
				const best = Math.min(diag, up, left);
				D[i][j] = best;
				if (diag === best) ORG[i][j] = same ? 'match' : 'sub';
				else if (up === best) ORG[i][j] = 'del';
				else ORG[i][j] = 'ins';
			}
		}
		const path = new Set<string>();
		let i = n, j = m;
		path.add(`${i},${j}`);
		while (i > 0 || j > 0) {
			const o = ORG[i][j];
			if ((o === 'match' || o === 'sub') && i > 0 && j > 0) { i--; j--; }
			else if (o === 'del' && i > 0) i--;
			else if (o === 'ins' && j > 0) j--;
			else if (i > 0) i--;
			else j--;
			path.add(`${i},${j}`);
		}
		return path;
	}

	const pathSet = buildPath();

	let idx = $state(0);
	let playing = $state(false);
	let showPath = $state(false);

	const frame = $derived(frames[Math.min(idx, frames.length - 1)]);
	const filled = $derived(new Map(frame.cells.map((c) => [`${c.i},${c.j}`, c])));
	const atEnd = $derived(idx >= frames.length - 1);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= frames.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 420);
	}
	function reset() {
		stop();
		idx = 0;
		showPath = false;
	}

	const ORIGIN_LABEL: Record<Origin, string> = {
		match: 'совпадение',
		sub: 'замена',
		del: 'удаление',
		ins: 'вставка',
		base: 'база'
	};
</script>

<div class="lv">
	<div class="lv__bar">
		<div class="title">
			Левенштейн: <span class="mono">«{A}»</span> → <span class="mono">«{B}»</span>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(frames.length - 1, idx + 1); }} title="вперёд">▶▶</button>
			<button
				class:on={showPath}
				disabled={!atEnd}
				onclick={() => (showPath = !showPath)}
				title="восстановить путь правок"
			>Путь правок</button>
			<span class="cnt">{idx}/{frames.length - 1}</span>
		</div>
	</div>

	<div class="lv__body">
		<svg viewBox="0 0 420 290" class="lv__svg">
			<!-- заголовок столбцов: ε и буквы B -->
			<text class="hdr corner" x={OX - CELL / 2} y={OY - CELL / 2} dy="0.34em">ε</text>
			{#each bCh as ch, j}
				<text class="hdr" x={OX + j * CELL + CELL / 2} y={OY - CELL / 2} dy="0.34em">{ch}</text>
			{/each}
			<!-- заголовок строк: ε и буквы A -->
			<text class="hdr corner" x={OX - CELL / 2} y={OY + CELL / 2} dy="0.34em">ε</text>
			{#each aCh as ch, i}
				<text class="hdr" x={OX - CELL / 2} y={OY + (i + 1) * CELL + CELL / 2} dy="0.34em">{ch}</text>
			{/each}

			<!-- подписи осей -->
			<text class="axis" x={OX + (m * CELL) / 2} y={14} dy="0.34em">B (цель) →</text>
			<text class="axis" x={16} y={OY + ((n + 1) * CELL) / 2} dy="0.34em" transform="rotate(-90 16 {OY + ((n + 1) * CELL) / 2})">A (источник) →</text>

			<!-- клетки -->
			{#each Array(n + 1) as _, i}
				{#each Array(m + 1) as _, j}
					{@const key = `${i},${j}`}
					{@const c = filled.get(key)}
					{@const onPath = showPath && pathSet.has(key)}
					<g class="cellg">
						<rect
							class="cell {c ? c.origin : 'pending'}"
							class:path={onPath}
							class:active={frame.cur && frame.cur.i === i && frame.cur.j === j}
							x={OX + j * CELL}
							y={OY + i * CELL}
							width={CELL}
							height={CELL}
							rx="4"
						/>
						{#if c}
							<text class="val {c.origin}" class:onpath={onPath} x={OX + j * CELL + CELL / 2} y={OY + i * CELL + CELL / 2} dy="0.34em">{c.value}</text>
						{/if}
					</g>
				{/each}
			{/each}
		</svg>

		<div class="lv__panel">
			<div class="legend">
				<div class="lg"><span class="sw match"></span>совпадение (диагональ, +0)</div>
				<div class="lg"><span class="sw sub"></span>замена (диагональ, +1)</div>
				<div class="lg"><span class="sw del"></span>удаление (сверху, +1)</div>
				<div class="lg"><span class="sw ins"></span>вставка (слева, +1)</div>
				<div class="lg"><span class="sw pathsw"></span>путь правок</div>
			</div>
			{#if frame.cur}
				<div class="cellinfo">
					<span class="lbl">клетка</span>
					<b>[{frame.cur.i},{frame.cur.j}]
						{#if filled.get(`${frame.cur.i},${frame.cur.j}`)}
							· {ORIGIN_LABEL[filled.get(`${frame.cur.i},${frame.cur.j}`)!.origin]}
						{/if}
					</b>
				</div>
			{/if}
			<div class="note">{frame.note}</div>
		</div>
	</div>
</div>

<style>
	.lv {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.lv__bar {
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
	.title .mono {
		font-family: var(--font-mono);
		color: var(--blue);
	}
	.ctrl {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.ctrl button {
		height: 2rem;
		min-width: 2rem;
		padding: 0 0.5rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.8rem;
		font-family: var(--font-display);
		font-weight: 700;
	}
	.ctrl button:hover:not(:disabled) {
		border-color: var(--blue);
		color: var(--blue);
	}
	.ctrl button.on {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.ctrl button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}
	.lv__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.lv__svg {
		flex: 1 1 330px;
		min-width: 280px;
		max-width: 470px;
		height: auto;
	}
	.hdr {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.9rem;
		fill: var(--color-parch-100);
	}
	.hdr.corner {
		fill: var(--color-parch-muted);
		font-weight: 700;
	}
	.axis {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		letter-spacing: 0.05em;
		fill: var(--color-parch-muted);
	}
	.cell {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		transition: fill 0.2s, stroke 0.2s;
	}
	.cell.pending {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-700, var(--color-ink-600));
	}
	.cell.base { fill: var(--color-ink-700, var(--color-ink-800)); }
	.cell.match { fill: var(--blue); stroke: var(--blue); }
	.cell.sub { fill: var(--blue-pale); stroke: var(--blue); }
	.cell.del { fill: var(--color-parch-200); stroke: var(--color-parch-muted); }
	.cell.ins { fill: var(--color-parch-muted); stroke: var(--color-parch-muted); }
	.cell.active {
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.cell.path {
		stroke: var(--color-parch-100);
		stroke-width: 3;
		fill: var(--blue);
	}
	.val {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.78rem;
		fill: var(--color-ink-850);
	}
	.val.base, .val.sub { fill: var(--color-ink-850); }
	.val.match { fill: #fff; }
	.val.del, .val.ins { fill: var(--color-ink-850); }
	.val.onpath { fill: #fff; }
	.lv__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.32rem;
	}
	.lg {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.74rem;
		color: var(--color-parch-200);
	}
	.sw {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 4px;
		flex: none;
		border: 1.5px solid var(--color-ink-500);
	}
	.sw.match { background: var(--blue); border-color: var(--blue); }
	.sw.sub { background: var(--blue-pale); border-color: var(--blue); }
	.sw.del { background: var(--color-parch-200); border-color: var(--color-parch-muted); }
	.sw.ins { background: var(--color-parch-muted); border-color: var(--color-parch-muted); }
	.sw.pathsw { background: var(--blue); border: 2px solid var(--color-parch-100); }
	.cellinfo {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.cellinfo .lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.cellinfo b {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--color-parch-100);
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
</style>
