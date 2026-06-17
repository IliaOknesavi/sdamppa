<script lang="ts">
	// Python list vs numpy ndarray in memory. A list is an array of pointers to
	// boxed PyObjects scattered on the heap (each carries type + refcount); an
	// ndarray is one contiguous typed block. Two modes: "boxing" shows the
	// structure side by side, "traversal" animates pointer-chasing (cache misses)
	// vs a sequential scan. Pure SVG/HTML, no deps; same visual language as the
	// graph widgets.

	const N = 6;
	const vals = [42, 17, 88, 5, 63, 29];

	// scattered heap positions for the boxed PyObjects (deliberately out of order
	// in memory: indices 0..5 land at random-ish addresses → плохая локальность)
	const heapOrder = [3, 0, 5, 1, 4, 2]; // slot column → which logical index lives there
	const slotX = (col: number) => 18 + col * 64;
	const heapY = 150;
	const ptrY = 60;
	const ptrX = (i: number) => 30 + i * 62;
	// for index i, which heap column holds its box
	const colOf = (i: number) => heapOrder.indexOf(i);

	type Step = { i: number; phase: 'ptr' | 'box' | 'done'; note: string };

	function buildSteps(mode: 'list' | 'numpy'): Step[] {
		const steps: Step[] = [];
		steps.push({ i: -1, phase: 'done', note: mode === 'list' ? 'старт обхода списка' : 'старт обхода ndarray' });
		for (let i = 0; i < N; i++) {
			if (mode === 'list') {
				steps.push({ i, phase: 'ptr', note: `ячейка ${i}: читаем указатель` });
				steps.push({ i, phase: 'box', note: `прыжок в кучу за PyObject (${vals[i]}) — промах кэша` });
			} else {
				steps.push({ i, phase: 'box', note: `элемент ${i} = ${vals[i]} лежит рядом — попадание в кэш` });
			}
		}
		steps.push({ i: N, phase: 'done', note: 'обход завершён' });
		return steps;
	}

	let mode = $state<'boxing' | 'traversal'>('boxing');
	let arr = $state<'list' | 'numpy'>('list');
	let idx = $state(0);
	let playing = $state(false);

	const steps = $derived(buildSteps(arr));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// cache-miss counter up to the current step (list misses on every box jump,
	// numpy mostly hits — one miss per cache line ~ first touch)
	const misses = $derived.by(() => {
		if (arr === 'numpy') return cur.i >= 0 && cur.phase !== 'done' ? 1 : cur.i >= N ? 1 : 0;
		let m = 0;
		for (let s = 1; s <= Math.min(idx, steps.length - 1); s++) if (steps[s].phase === 'box') m++;
		return m;
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
		}, 750);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setMode(m: 'boxing' | 'traversal') {
		mode = m;
		reset();
	}
	function setArr(a: 'list' | 'numpy') {
		arr = a;
		reset();
	}

	// in traversal mode: which pointer cell / which box is lit right now
	const activePtr = $derived(cur.i >= 0 && cur.i < N ? cur.i : -1);
	const ptrLit = $derived(mode === 'traversal' && arr === 'list' && cur.phase === 'ptr' && activePtr >= 0);
	const boxLit = $derived(mode === 'traversal' && cur.phase === 'box' && activePtr >= 0);
	const visited = $derived(mode === 'traversal' ? Math.min(cur.phase === 'done' && cur.i >= N ? N : cur.i + (cur.phase === 'box' ? 1 : 0), N) : 0);
</script>

<div class="nv">
	<div class="nv__bar">
		<div class="seg">
			<button class:on={mode === 'boxing'} onclick={() => setMode('boxing')}>боксинг</button>
			<button class:on={mode === 'traversal'} onclick={() => setMode('traversal')}>обход</button>
		</div>
		{#if mode === 'traversal'}
			<div class="seg seg--data">
				<button class:on={arr === 'list'} onclick={() => setArr('list')}>list</button>
				<button class:on={arr === 'numpy'} onclick={() => setArr('numpy')}>ndarray</button>
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
		{/if}
	</div>

	<div class="nv__body">
		{#if mode === 'boxing'}
			<!-- ── BOXING MODE: list (pointers→heap) vs ndarray (contiguous) ── -->
			<div class="lane">
				<div class="lane__title">Python <code>list</code> — массив указателей</div>
				<svg viewBox="0 0 420 230" class="nv__svg">
					<!-- pointer array -->
					{#each vals as _, i}
						<g class="cell ptr">
							<rect x={ptrX(i)} y={ptrY - 16} width="48" height="32" rx="5" />
							<text x={ptrX(i) + 24} y={ptrY} dy="0.34em">•→</text>
							<text class="ix" x={ptrX(i) + 24} y={ptrY - 24}>[{i}]</text>
						</g>
					{/each}
					<text class="cap" x="14" y="32">указатели (стек/непрерывно)</text>
					<text class="cap" x="14" y="118">куча — PyObject'ы вразброс</text>

					<!-- pointer arrows to scattered boxes -->
					{#each vals as _, i}
						{@const c = colOf(i)}
						<path
							class="arrow"
							d={`M ${ptrX(i) + 24} ${ptrY + 16} L ${slotX(c) + 23} ${heapY - 26}`}
							marker-end="url(#nv-arr)"
						/>
					{/each}

					<!-- boxed objects on the heap, scattered -->
					{#each heapOrder as logical, c}
						<g class="box">
							<rect x={slotX(c)} y={heapY - 24} width="46" height="56" rx="6" />
							<text class="bv" x={slotX(c) + 23} y={heapY - 6} dy="0.34em">{vals[logical]}</text>
							<line x1={slotX(c) + 4} y1={heapY + 6} x2={slotX(c) + 42} y2={heapY + 6} class="bdiv" />
							<text class="bmeta" x={slotX(c) + 23} y={heapY + 20}>int · rc</text>
						</g>
					{/each}

					<defs>
						<marker id="nv-arr" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
							<path d="M0,0 L6.5,3 L0,6 z" fill="var(--color-parch-muted)" />
						</marker>
					</defs>
				</svg>
			</div>

			<div class="lane">
				<div class="lane__title">numpy <code>ndarray</code> — непрерывный блок</div>
				<svg viewBox="0 0 420 230" class="nv__svg">
					<text class="cap" x="14" y="40">один типизированный буфер int64, шаг 8 байт</text>
					{#each vals as v, i}
						<g class="cell blk">
							<rect x={18 + i * 64} y="70" width="60" height="46" rx="5" />
							<text x={18 + i * 64 + 30} y="93" dy="0.34em">{v}</text>
							<text class="ix" x={18 + i * 64 + 30} y="60">[{i}]</text>
						</g>
					{/each}
					<!-- byte ruler -->
					{#each vals as _, i}
						<text class="byte" x={18 + i * 64 + 30} y="134">{i * 8}</text>
					{/each}
					<line x1="18" y1="120" x2={18 + N * 64} y2="120" class="ruler" />
					<text class="cap" x="14" y="166">никаких боксов: значение лежит прямо в памяти</text>
					<text class="cap dim" x="14" y="190">соседи в одной кэш-линии → SIMD-векторизация</text>
				</svg>
			</div>
		{:else}
			<!-- ── TRAVERSAL MODE: animate access pattern ── -->
			<svg viewBox="0 0 420 230" class="nv__svg nv__svg--wide">
				<text class="cap" x="14" y="22">{arr === 'list' ? 'обход list: указатель → прыжок в кучу' : 'обход ndarray: подряд по блоку'}</text>

				{#if arr === 'list'}
					<!-- pointer array -->
					{#each vals as _, i}
						<g class="cell ptr" class:lit={ptrLit && activePtr === i} class:seen={i < visited}>
							<rect x={ptrX(i)} y={ptrY - 16} width="48" height="32" rx="5" />
							<text x={ptrX(i) + 24} y={ptrY} dy="0.34em">•→</text>
							<text class="ix" x={ptrX(i) + 24} y={ptrY - 24}>[{i}]</text>
						</g>
					{/each}
					<!-- arrows; active one highlighted -->
					{#each vals as _, i}
						{@const c = colOf(i)}
						<path
							class="arrow"
							class:hot={boxLit && activePtr === i}
							d={`M ${ptrX(i) + 24} ${ptrY + 16} L ${slotX(c) + 23} ${heapY - 26}`}
							marker-end="url(#nv-arr2)"
						/>
					{/each}
					<!-- scattered boxes -->
					{#each heapOrder as logical, c}
						<g class="box" class:lit={boxLit && activePtr === logical} class:seen={logical < visited}>
							<rect x={slotX(c)} y={heapY - 24} width="46" height="56" rx="6" />
							<text class="bv" x={slotX(c) + 23} y={heapY - 6} dy="0.34em">{vals[logical]}</text>
							<line x1={slotX(c) + 4} y1={heapY + 6} x2={slotX(c) + 42} y2={heapY + 6} class="bdiv" />
							<text class="bmeta" x={slotX(c) + 23} y={heapY + 20}>int · rc</text>
						</g>
					{/each}
					<defs>
						<marker id="nv-arr2" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
							<path d="M0,0 L6.5,3 L0,6 z" fill="var(--color-parch-muted)" />
						</marker>
					</defs>
				{:else}
					<!-- contiguous block scan -->
					<text class="cap dim" x="14" y="186">курсор идёт линейно — почти всё уже в кэш-линии</text>
					{#each vals as v, i}
						<g class="cell blk" class:lit={boxLit && activePtr === i} class:seen={i < visited}>
							<rect x={18 + i * 64} y="86" width="60" height="50" rx="5" />
							<text x={18 + i * 64 + 30} y="111" dy="0.34em">{v}</text>
							<text class="ix" x={18 + i * 64 + 30} y="76">[{i}]</text>
						</g>
					{/each}
					<line x1="18" y1="140" x2={18 + N * 64} y2="140" class="ruler" />
					{#each vals as _, i}
						<text class="byte" x={18 + i * 64 + 30} y="154">{i * 8}</text>
					{/each}
				{/if}
			</svg>
		{/if}

		<div class="nv__panel">
			{#if mode === 'traversal'}
				<div class="props">
					<div class="prop"><span>структура</span><b>{arr === 'list' ? 'array of pointers' : 'contiguous block'}</b></div>
					<div class="prop"><span>паттерн доступа</span><b class:no={arr === 'list'}>{arr === 'list' ? 'случайный (jump)' : 'последовательный'}</b></div>
					<div class="prop"><span>прочитано</span><b>{visited}/{N}</b></div>
					<div class="prop"><span>промахи кэша</span><b class:no={arr === 'list'}>{misses}</b></div>
				</div>
				<div class="note">{cur.note}</div>
			{:else}
				<div class="props">
					<div class="prop"><span>list[i]</span><b>PyObject*</b></div>
					<div class="prop"><span>numpy[i]</span><b>int64 inline</b></div>
					<div class="prop"><span>на элемент (list)</span><b>8 Б указатель + ~28 Б бокс</b></div>
					<div class="prop"><span>на элемент (ndarray)</span><b>8 Б</b></div>
				</div>
				<div class="note">
					Каждый элемент списка — указатель на отдельный <code>PyObject</code> в куче (тип + счётчик ссылок + значение). Объекты разбросаны: чтение прыгает по памяти.
					ndarray держит сырые числа подряд одним блоком.
				</div>
			{/if}
		</div>
	</div>

	<div class="nv__foot">
		{mode === 'traversal' && arr === 'list'
			? 'Прыжки по указателям рвут кэш-линии: каждый PyObject — почти гарантированный промах L1/L2 + лишняя косвенность.'
			: 'Непрерывный типизированный блок ложится в кэш-линии и читается SIMD-инструкциями — отсюда выигрыш векторизации numpy в разы.'}
	</div>
</div>

<style>
	.nv {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.nv__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.7rem;
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
	.seg--data button {
		font-family: var(--font-mono);
		font-size: 0.72rem;
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
	.nv__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.lane {
		flex: 1 1 300px;
		min-width: 260px;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.lane__title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.82rem;
		color: var(--color-parch-100);
	}
	.lane__title code {
		font-family: var(--font-mono);
		color: var(--blue);
		font-size: 0.78rem;
	}
	.nv__svg {
		width: 100%;
		height: auto;
	}
	.nv__svg--wide {
		flex: 1 1 360px;
		min-width: 300px;
		max-width: 480px;
	}
	.cap {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
	}
	.cap.dim {
		fill: var(--color-ink-500);
	}
	.ix {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		fill: var(--color-parch-muted);
	}
	.byte {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.55rem;
		fill: var(--color-ink-500);
	}
	.ruler {
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
	}
	/* pointer cells */
	.cell.ptr rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.25s, stroke 0.25s;
	}
	.cell.ptr text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.82rem;
		fill: var(--color-parch-200);
	}
	.cell.ptr text.ix {
		font-weight: 400;
		fill: var(--color-parch-muted);
	}
	/* contiguous block cells */
	.cell.blk rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 2;
		transition: fill 0.25s, stroke 0.25s;
	}
	.cell.blk text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.9rem;
		fill: var(--color-ink-850);
	}
	.cell.blk text.ix {
		font-family: var(--font-mono);
		font-weight: 400;
		font-size: 0.58rem;
		fill: var(--color-parch-muted);
	}
	/* heap boxes */
	.box rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.25s, stroke 0.25s;
	}
	.box .bv {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.9rem;
		fill: var(--color-parch-100);
	}
	.box .bdiv {
		stroke: var(--color-ink-600);
		stroke-width: 1;
	}
	.box .bmeta {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.5rem;
		fill: var(--color-parch-muted);
	}
	.arrow {
		fill: none;
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		stroke-dasharray: 3 3;
		transition: stroke 0.2s, stroke-width 0.2s;
	}
	/* animation highlight states */
	.cell.ptr.lit rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
	}
	.cell.ptr.lit text {
		fill: #fff;
	}
	.cell.ptr.seen rect {
		stroke: var(--blue);
	}
	.box.lit rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.box.lit .bv {
		fill: #fff;
	}
	.box.seen rect {
		stroke: var(--blue);
	}
	.cell.blk.lit rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.cell.blk.lit text {
		fill: #fff;
	}
	.arrow.hot {
		stroke: var(--blue);
		stroke-width: 2.5;
		stroke-dasharray: none;
	}
	/* panel */
	.nv__panel {
		flex: 1 1 230px;
		min-width: 210px;
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
		font-size: 0.76rem;
		padding: 0.2rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.prop span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-parch-muted);
	}
	.prop b {
		color: var(--color-parch-100);
		font-family: var(--font-display);
		font-size: 0.78rem;
		text-align: right;
	}
	.prop b.no {
		color: var(--blue);
	}
	.note {
		margin-top: auto;
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.note code {
		font-family: var(--font-mono);
		color: var(--blue);
		font-size: 0.76rem;
	}
	.nv__foot {
		padding: 0.7rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		font-size: 0.78rem;
		line-height: 1.45;
		color: var(--color-parch-200);
	}
</style>
