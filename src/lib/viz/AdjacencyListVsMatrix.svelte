<script lang="ts">
	// Один граф (6 вершин) в двух представлениях: список смежности слева,
	// матрица смежности N×N справа. Выбор пары вершин (u, v) запускает проверку
	// «есть ли ребро u–v»: в матрице — за O(1) (одна клетка), в списке — перебор
	// соседей u по шагам (step/play/reset). Тумблер разреженный/плотный меняет
	// число рёбер; индикаторы памяти O(V+E) против O(V²).
	// Чистый инлайн-SVG/HTML, без внешних импортов; визуальный язык как у соседей.
	const V = 6;
	const L = ['A', 'B', 'C', 'D', 'E', 'F'];

	const sparseEdges: [number, number][] = [
		[0, 1], [0, 2], [1, 3], [2, 4], [3, 5]
	];
	const denseEdges: [number, number][] = [
		[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [1, 4],
		[2, 3], [2, 4], [3, 4], [3, 5], [4, 5]
	];

	let dense = $state(false);
	const edges = $derived(dense ? denseEdges : sparseEdges);

	// неориентированный граф: матрица симметрична, соседи в обе стороны
	const adj = $derived.by(() => {
		const a: number[][] = Array.from({ length: V }, () => []);
		for (const [x, y] of edges) {
			a[x].push(y);
			a[y].push(x);
		}
		for (const row of a) row.sort((p, q) => p - q);
		return a;
	});
	const matrix = $derived.by(() => {
		const m: number[][] = Array.from({ length: V }, () => Array(V).fill(0));
		for (const [x, y] of edges) {
			m[x][y] = 1;
			m[y][x] = 1;
		}
		return m;
	});
	const E = $derived(edges.length);

	// выбранная пара (u — строка, v — искомый сосед)
	let u = $state(0);
	let v = $state(3);

	// пошаговый перебор списка соседей u в поиске v
	type Probe = { idx: number; node: number | null; hit: boolean; done: boolean; note: string };
	const probe = $derived.by((): Probe[] => {
		const neigh = adj[u];
		const steps: Probe[] = [];
		steps.push({
			idx: -1, node: null, hit: false, done: false,
			note: `Список[${L[u]}]: ищем ${L[v]} перебором соседей.`
		});
		for (let i = 0; i < neigh.length; i++) {
			const found = neigh[i] === v;
			steps.push({
				idx: i, node: neigh[i], hit: found, done: found,
				note: found
					? `Шаг ${i + 1}: ${L[neigh[i]]} = ${L[v]} → ребро есть. Сравнений: ${i + 1}.`
					: `Шаг ${i + 1}: ${L[neigh[i]]} ≠ ${L[v]}, идём дальше.`
			});
			if (found) return steps;
		}
		steps.push({
			idx: neigh.length, node: null, hit: false, done: true,
			note: `Конец списка: ${L[v]} не найден → ребра нет. Сравнений: ${neigh.length}.`
		});
		return steps;
	});

	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(probe[Math.min(idx, probe.length - 1)]);
	const edgeExists = $derived(matrix[u][v] === 1);
	const listCost = $derived(V + 2 * E); // массив списков: O(V + 2E) ячеек
	const matrixCost = V * V; // O(V^2)

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		if (idx >= probe.length - 1) idx = 0;
		playing = true;
		timer = setInterval(() => {
			if (idx >= probe.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 700);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function pick(a: number, b: number) {
		if (a === b) return;
		u = a;
		v = b;
		reset();
	}
	function setDense(d: boolean) {
		dense = d;
		reset();
	}

	// подсветка ячейки матрицы, которую проверяем за O(1)
	function cellState(r: number, col: number): string {
		if (r === u && col === v) return matrix[r][col] === 1 ? 'probe-hit' : 'probe-miss';
		if (r === u || col === v) return 'axis';
		return matrix[r][col] === 1 ? 'one' : 'zero';
	}
	// состояние соседа в списке смежности при перешагивании
	function neighState(row: number, pos: number): string {
		if (row !== u) return 'idle';
		if (cur.idx === pos) return cur.hit ? 'hit' : 'scan';
		if (cur.idx > pos) return 'past';
		return 'idle';
	}
</script>

<div class="am">
	<div class="am__bar">
		<div class="seg">
			<button class:on={!dense} onclick={() => setDense(false)}>Разреженный</button>
			<button class:on={dense} onclick={() => setDense(true)}>Плотный</button>
		</div>
		<div class="pair">
			<span class="plbl">Проверяем ребро</span>
			<span class="pchip">{L[u]}</span>
			<span class="pdash">—</span>
			<span class="pchip">{L[v]}</span>
			<span class="pverdict" class:yes={edgeExists} class:no={!edgeExists}>
				{edgeExists ? 'есть' : 'нет'}
			</span>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(probe.length - 1, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{probe.length - 1}</span>
		</div>
	</div>

	<div class="am__hint">
		Кликни две буквы в любой колонке заголовков, чтобы выбрать пару вершин (u, v).
	</div>

	<div class="am__body">
		<!-- ЛЕВО: список смежности — перебор соседей O(степени) -->
		<div class="rep">
			<div class="rep__head">
				<span class="rt">Список смежности</span>
				<code class="rc">проверка ребра — O(deg u)</code>
			</div>
			<div class="lists">
				{#each adj as neigh, row}
					<div class="lrow" class:active={row === u}>
						<button
							class="key"
							class:sel={row === u}
							onclick={() => pick(row, v === row ? (row + 1) % V : v)}
							title="выбрать u = {L[row]}"
						>{L[row]}</button>
						<span class="arrow">→</span>
						<div class="cells">
							{#each neigh as nb, pos}
								<button
									class="ncell {neighState(row, pos)}"
									onclick={() => pick(row, nb)}
									title="выбрать пару {L[row]}–{L[nb]}"
								>{L[nb]}</button>
							{:else}
								<span class="nempty">∅</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
			<div class="mem">
				<span class="mlbl">память</span>
				<code>O(V + 2E) = {listCost}</code>
			</div>
		</div>

		<!-- ПРАВО: матрица смежности — проверка O(1) -->
		<div class="rep">
			<div class="rep__head">
				<span class="rt">Матрица смежности</span>
				<code class="rc">проверка ребра — O(1)</code>
			</div>
			<svg viewBox="0 0 230 230" class="mx" role="img" aria-label="матрица смежности">
				{#each L as lab, col}
					<text
						class="hdr" class:axis={col === v}
						x={42 + col * 30} y="22" dy="0.32em"
						role="button" tabindex="0" aria-label="выбрать столбец {lab}"
						onclick={() => pick(u === col ? (col + 1) % V : u, col)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(u === col ? (col + 1) % V : u, col); } }}
					>{lab}</text>
				{/each}
				{#each L as lab, row}
					<text
						class="hdr" class:axis={row === u}
						x="20" y={42 + row * 30} dy="0.32em"
						role="button" tabindex="0" aria-label="выбрать строку {lab}"
						onclick={() => pick(row, v === row ? (row + 1) % V : v)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(row, v === row ? (row + 1) % V : v); } }}
					>{lab}</text>
				{/each}
				{#each matrix as mrow, row}
					{#each mrow as bit, col}
						<g
							class="cell {cellState(row, col)}"
							role="button" tabindex="0" aria-label="{L[row]}–{L[col]} = {bit}"
							onclick={() => pick(row, col === row ? (col + 1) % V : col)}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(row, col === row ? (col + 1) % V : col); } }}
						>
							<rect x={28 + col * 30} y={28 + row * 30} width="28" height="28" rx="4" />
							<text x={42 + col * 30} y={42 + row * 30} dy="0.32em">{bit}</text>
						</g>
					{/each}
				{/each}
			</svg>
			<div class="mem">
				<span class="mlbl">память</span>
				<code>O(V²) = {matrixCost}</code>
			</div>
		</div>
	</div>

	<div class="am__foot">
		<div class="note">{cur.note}</div>
		<div class="cmp">
			<span class="cmp__item">
				<b class="o1">O(1)</b> матрица — одна клетка [{L[u]}][{L[v]}] = {matrix[u][v]}
			</span>
			<span class="cmp__item">
				<b class="odeg">O(deg)</b> список — {adj[u].length} соседей у {L[u]}
			</span>
			<span class="cmp__item">
				<b class="omem" class:win={!dense}>O(V+2E)={listCost}</b> vs
				<b class="omem" class:win={dense}>O(V²)={matrixCost}</b>
				{dense ? '— плотный: матрица не дороже' : '— разреженный: список экономит'}
			</span>
		</div>
	</div>
</div>

<style>
	.am {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.am__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.seg {
		display: flex;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		overflow: hidden;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.76rem;
		padding: 0.4rem 0.75rem;
		border: none;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
	}
	.seg button.on {
		background: var(--blue);
		color: #fff;
	}
	.pair {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.plbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.pchip {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 6px;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		background: var(--blue-pale);
		color: var(--blue);
		border: 1.5px solid var(--blue);
	}
	.pdash { color: var(--color-parch-muted); }
	.pverdict {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.12rem 0.45rem;
		border-radius: 5px;
		margin-left: 0.2rem;
	}
	.pverdict.yes { background: var(--blue); color: #fff; }
	.pverdict.no { background: var(--color-ink-700, var(--color-ink-800)); color: var(--color-parch-muted); }
	.ctrl {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.ctrl button {
		width: 1.9rem;
		height: 1.9rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.78rem;
	}
	.ctrl button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-muted);
		margin-left: 0.2rem;
	}
	.am__hint {
		padding: 0.45rem 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.am__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.rep {
		flex: 1 1 290px;
		min-width: 260px;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.rep__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.rt {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.9rem;
		color: var(--color-parch-100);
	}
	.rc {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--blue);
	}
	.lists {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.lrow {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.22rem 0.35rem;
		border-radius: 7px;
		border: 1.5px solid transparent;
	}
	.lrow.active {
		border-color: var(--blue);
		background: var(--color-ink-800);
	}
	.key {
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		flex: none;
		border-radius: 6px;
		border: 1.5px solid var(--color-ink-500);
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.84rem;
		cursor: pointer;
	}
	.key.sel {
		background: var(--blue);
		border-color: var(--blue);
		color: #fff;
	}
	.arrow {
		color: var(--color-parch-muted);
		font-size: 0.8rem;
	}
	.cells {
		display: flex;
		flex-wrap: wrap;
		gap: 0.28rem;
	}
	.ncell {
		display: grid;
		place-items: center;
		min-width: 1.6rem;
		height: 1.6rem;
		padding: 0 0.35rem;
		border-radius: 6px;
		border: 1.5px solid var(--color-ink-500);
		background: var(--color-ink-850);
		color: var(--color-parch-200);
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		cursor: pointer;
		transition: all 0.18s;
	}
	.ncell.past {
		border-color: var(--color-ink-500);
		color: var(--color-parch-muted);
		opacity: 0.6;
	}
	.ncell.scan {
		border-color: var(--blue);
		background: var(--blue-pale);
		color: var(--blue);
		transform: translateY(-1px);
	}
	.ncell.hit {
		border-color: var(--blue);
		background: var(--blue);
		color: #fff;
	}
	.nempty {
		color: var(--color-parch-muted);
		font-family: var(--font-mono);
		font-size: 0.78rem;
	}
	.mem {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin-top: auto;
		padding-top: 0.3rem;
	}
	.mlbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--color-parch-muted);
	}
	.mem code {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--blue);
		font-weight: 700;
	}
	.mx {
		width: 100%;
		max-width: 250px;
		height: auto;
	}
	.hdr {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.78rem;
		fill: var(--color-parch-muted);
		cursor: pointer;
	}
	.hdr.axis { fill: var(--blue); }
	.cell rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		transition: fill 0.18s, stroke 0.18s;
	}
	.cell text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		fill: var(--color-parch-muted);
	}
	.cell { cursor: pointer; }
	.cell.one rect { fill: var(--blue-pale); stroke: var(--blue); }
	.cell.one text { fill: var(--blue); }
	.cell.axis rect { stroke: var(--blue); }
	.cell.probe-hit rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.cell.probe-hit text { fill: #fff; }
	.cell.probe-miss rect {
		fill: var(--color-ink-800);
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.cell.probe-miss text { fill: var(--color-parch-100); }
	.am__foot {
		padding: 0.8rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.55rem 0.7rem;
		background: var(--color-ink-850);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.cmp {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.1rem;
	}
	.cmp__item {
		font-size: 0.76rem;
		color: var(--color-parch-200);
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.cmp__item b {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		padding: 0.08rem 0.35rem;
		border-radius: 5px;
	}
	.o1 { background: var(--blue); color: #fff; }
	.odeg { background: var(--blue-pale); color: var(--blue); border: 1px solid var(--blue); }
	.omem {
		background: var(--color-ink-850);
		color: var(--color-parch-muted);
		border: 1px solid var(--color-ink-500);
	}
	.omem.win {
		background: var(--blue-pale);
		color: var(--blue);
		border-color: var(--blue);
	}
</style>
