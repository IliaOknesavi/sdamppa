<script lang="ts">
	// Интерактивный N-битный двоичный счётчик. Increment по школьному правилу:
	// идём с младшего бита, переворачиваем единицы в 0 (перенос), первый ноль → 1.
	// Считаем суммарное число флипов, потенциал Φ = число единиц и амортизированную
	// цену. Step / серия / сброс, ползунок N. Чистый SVG, без зависимостей.
	type Step = {
		bits: number[]; // bits[0] — младший
		flipped: number[]; // индексы перевёрнутых на этом шаге бит
		carryTo: number | null; // первый ноль, который стал 1 (конец переноса)
		cost: number; // число флипов на этом шаге
		value: number; // десятичное значение ПОСЛЕ инкремента
		totalFlips: number; // накопленное число флипов
		incs: number; // сколько инкрементов выполнено
		note: string;
	};

	// строим всю серию инкрементов 0 → 2^N − 1 → 0 (полный цикл)
	function buildSteps(n: number): Step[] {
		const steps: Step[] = [];
		const bits = new Array(n).fill(0);
		let total = 0;
		const totalIncs = 1 << n; // 2^N инкрементов = полный цикл назад к нулю
		steps.push({
			bits: [...bits],
			flipped: [],
			carryTo: null,
			cost: 0,
			value: 0,
			totalFlips: 0,
			incs: 0,
			note: 'старт: счётчик обнулён'
		});
		for (let k = 1; k <= totalIncs; k++) {
			const flipped: number[] = [];
			let i = 0;
			// переворачиваем младшие единицы в 0 (распространение переноса)
			while (i < n && bits[i] === 1) {
				bits[i] = 0;
				flipped.push(i);
				i++;
			}
			let carryTo: number | null = null;
			if (i < n) {
				// первый ноль становится единицей — перенос гасится
				bits[i] = 1;
				flipped.push(i);
				carryTo = i;
			}
			// если i === n — переполнение, все биты обнулились (счётчик «по модулю 2^N»)
			const cost = flipped.length;
			total += cost;
			const value = bits.reduce((acc, b, idx) => acc + (b << idx), 0);
			const note =
				carryTo === null
					? `переполнение: все ${n} бит сброшены, перенос ушёл за разряд`
					: cost === 1
						? `младший бит 0→1, переноса нет`
						: `перенос: ${cost - 1} ед. → 0, затем бит ${carryTo} : 0→1`;
			steps.push({
				bits: [...bits],
				flipped,
				carryTo,
				cost,
				value,
				totalFlips: total,
				incs: k,
				note
			});
		}
		return steps;
	}

	let n = $state(4);
	let idx = $state(0);
	let playing = $state(false);
	const steps = $derived(buildSteps(n));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);
	const flippedSet = $derived(new Set(cur.flipped));

	// Φ = число единиц = потенциал; амортизированная цена ≈ 2
	const ones = $derived(cur.bits.reduce((a, b) => a + b, 0));
	const amort = $derived(cur.incs === 0 ? 0 : cur.totalFlips / cur.incs);

	// сколько раз флипается каждый бит за полный цикл из 2^N инкрементов:
	// бит i меняется раз в 2^i шагов → 2^N / 2^i = 2^(N-i) раз
	function flipFreq(i: number): number {
		return 1 << (n - i);
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
	function setN(v: number) {
		stop();
		n = v;
		idx = 0;
	}
	function bitState(i: number): string {
		if (flippedSet.has(i)) return cur.carryTo === i ? 'set' : 'cleared';
		return cur.bits[i] === 1 ? 'one' : 'zero';
	}
</script>

<div class="bc">
	<div class="bc__bar">
		<div class="nsel">
			<span class="lbl">N бит</span>
			<input type="range" min="2" max="8" value={n} oninput={(e) => setN(+e.currentTarget.value)} />
			<b>{n}</b>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="серия инкрементов">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(steps.length - 1, idx + 1); }} title="increment">+1</button>
			<span class="cnt">{idx}/{steps.length - 1}</span>
		</div>
	</div>

	<div class="bc__body">
		<svg viewBox="0 0 420 290" class="bc__svg">
			<!-- подписи разрядов -->
			{#each cur.bits as _b, i}
				{@const col = n - 1 - i}
				{@const cell = 420 / (n + 0.5)}
				{@const x = 28 + col * cell}
				<g class="cell {bitState(i)}">
					<rect x={x} y="70" width={cell - 12} height={cell - 12} rx="9" />
					<text class="bit" x={x + (cell - 12) / 2} y={70 + (cell - 12) / 2} dy="0.35em">
						{cur.bits[i]}
					</text>
					<text class="pow" x={x + (cell - 12) / 2} y="56">2<tspan dy="-4" font-size="0.6em">{i}</tspan></text>
					<text class="freq" x={x + (cell - 12) / 2} y={70 + (cell - 12) + 22}>×{flipFreq(i)}</text>
				</g>
			{/each}
			<!-- стрелка переноса -->
			{#if cur.flipped.length > 1 && cur.carryTo !== null}
				{@const cell = 420 / (n + 0.5)}
				{@const fromCol = n - 1}
				{@const toCol = n - 1 - cur.carryTo}
				{@const x1 = 28 + fromCol * cell + (cell - 12) / 2}
				{@const x2 = 28 + toCol * cell + (cell - 12) / 2}
				<line class="carry" x1={x1} y1={70 + (cell - 12) + 6} x2={x2} y2={70 + (cell - 12) + 6} marker-end="url(#bc-arr)" />
			{/if}
			<defs>
				<marker id="bc-arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
					<path d="M0,0 L7.5,3 L0,6 z" fill="var(--blue)" />
				</marker>
			</defs>
			<!-- легенда значения -->
			<text class="val" x="210" y="240">{cur.value} = {cur.bits.slice().reverse().join('')}<tspan font-size="0.6em" dy="3">2</tspan></text>
			<text class="vlbl" x="210" y="262">десятичное значение счётчика</text>
		</svg>

		<div class="bc__panel">
			<div class="props">
				<div class="prop"><span>инкрементов</span><b>{cur.incs}</b></div>
				<div class="prop"><span>флипов в шаге</span><b class:hot={cur.cost > 1}>{cur.cost}</b></div>
				<div class="prop"><span>всего флипов</span><b>{cur.totalFlips}</b></div>
				<div class="prop"><span>Φ = число единиц</span><b>{ones}</b></div>
				<div class="prop"><span>аморт. цена</span><b class:near={amort > 0 && amort < 2}>{amort.toFixed(2)}{cur.incs > 0 ? ' → 2' : ''}</b></div>
			</div>
			<div class="note">{cur.note}</div>
		</div>
	</div>

	<div class="bc__amort">
		<div class="ahead">
			<span class="lbl">Почему амортизированная цена → 2: бит <code>i</code> флипается раз в <code>2ⁱ</code> шагов</span>
		</div>
		<div class="series">∑ <code>1 + 1/2 + 1/4 + … &lt; 2</code> — геометрический ряд, поэтому на инкремент в среднем меньше 2 флипов</div>
	</div>
</div>

<style>
	.bc {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.bc__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.nsel {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.nsel .lbl {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.nsel input[type='range'] {
		width: 8rem;
		accent-color: var(--blue);
	}
	.nsel b {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--color-parch-100);
		min-width: 1ch;
	}
	.ctrl {
		display: flex;
		align-items: center;
		gap: 0.3rem;
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
		font-family: var(--font-mono);
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
	.bc__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.bc__svg {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 460px;
		height: auto;
	}
	.cell rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.cell .bit {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.15rem;
		fill: var(--color-parch-100);
		transition: fill 0.25s;
	}
	.cell .pow {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
	}
	.cell .freq {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	/* бит = 1 (стабильный) */
	.cell.one rect {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.cell.one .bit {
		fill: #fff;
	}
	/* единица, которую сбросили в 0 на этом шаге */
	.cell.cleared rect {
		fill: var(--color-ink-700, var(--color-ink-800));
		stroke: var(--color-parch-muted);
		stroke-dasharray: 4 3;
	}
	.cell.cleared .bit {
		fill: var(--color-parch-muted);
	}
	/* первый ноль, ставший единицей (конец переноса) */
	.cell.set rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 4;
	}
	.cell.set .bit {
		fill: var(--blue);
	}
	.carry {
		stroke: var(--blue);
		stroke-width: 2;
		stroke-dasharray: 3 3;
	}
	.val {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 1rem;
		fill: var(--color-parch-100);
	}
	.vlbl {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
	}
	.bc__panel {
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
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.prop b {
		color: var(--color-parch-100);
		font-family: var(--font-display);
	}
	.prop b.hot {
		color: var(--blue);
	}
	.prop b.near {
		color: var(--blue);
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
	.bc__amort {
		padding: 0.8rem 1rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.ahead .lbl {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
	}
	.ahead code,
	.series code {
		color: var(--blue);
	}
	.series {
		margin-top: 0.5rem;
		font-size: 0.78rem;
		color: var(--color-parch-200);
		font-family: var(--font-mono);
	}
</style>
