<script lang="ts">
	// Три метода амортизационного анализа бок о бок на одном примере.
	// Групповой (aggregate): суммарная стоимость / число операций.
	// Бухгалтерский (accounting): на операции кладут монетки-кредиты,
	//   дешёвые шаги переплачивают, дорогие — расплачиваются накоплённым.
	// Потенциалов (potential): Φ телескопирует, ам.стоимость = факт + ΔΦ.
	// Два примера: двоичный счётчик и push в динамический массив.
	// Во всех трёх методах выходит одна и та же O*(1) — разными путями.
	// Чистый инлайн-SVG/HTML, без внешних импортов.

	type Step = {
		n: number;            // номер операции (1..N)
		state: number[];      // состояние (биты счётчика или заполненность ячеек)
		cap: number;          // ёмкость (для массива; для счётчика = длине)
		actual: number;       // фактическая стоимость шага
		credits: number[];    // кредиты-монетки на каждой ячейке (бухгалтерский)
		phi: number;          // потенциал Φ после шага
		note: string;         // описание шага
		flips?: boolean[];    // какие ячейки изменились на этом шаге
	};

	type Example = {
		id: 'counter' | 'array';
		label: string;
		charge: number;       // фикс. плата за операцию (бухгалтерский метод)
		width: number;        // число ячеек на схеме
		opWord: string;       // слово «инкремент» / «push»
		phiDef: string;       // определение Φ
		cellLabel: (i: number, s: Step) => string;
	};

	const EXAMPLES: Example[] = [
		{
			id: 'counter',
			label: 'Двоичный счётчик',
			charge: 2,
			width: 5,
			opWord: 'инкремент',
			phiDef: 'Φ = число единиц',
			cellLabel: (i, s) => String(s.state[i])
		},
		{
			id: 'array',
			label: 'Динамический массив',
			charge: 3,
			width: 16,
			opWord: 'push',
			phiDef: 'Φ = 2·size − cap',
			cellLabel: (i, s) => (i < s.state.length ? '•' : '')
		}
	];

	const N = 16; // число операций в обоих примерах

	// ---- двоичный счётчик ----
	function buildCounter(): Step[] {
		const W = 5;
		const bits = new Array(W).fill(0);
		const steps: Step[] = [];
		let prevPhi = 0;
		// нулевой шаг — исходное состояние
		steps.push({
			n: 0, state: [...bits], cap: W, actual: 0,
			credits: new Array(W).fill(0), phi: 0,
			note: 'старт: счётчик = 0, потенциал Φ = 0'
		});
		for (let n = 1; n <= N; n++) {
			const flips = new Array(W).fill(false);
			let actual = 0;
			let i = 0;
			while (i < W && bits[i] === 1) { bits[i] = 0; flips[i] = true; actual++; i++; }
			if (i < W) { bits[i] = 1; flips[i] = true; actual++; }
			const phi = bits.reduce((a, b) => a + b, 0); // Φ = число единиц
			// кредиты: на каждом единичном бите лежит ровно 1 монетка
			const credits = bits.map((b) => b);
			const dphi = phi - prevPhi;
			steps.push({
				n, state: [...bits], cap: W, actual, credits, phi, flips,
				note: `инкремент: ${actual} переключений бит, ΔΦ = ${dphi >= 0 ? '+' : ''}${dphi}`
			});
			prevPhi = phi;
		}
		return steps;
	}

	// ---- динамический массив с удвоением ----
	function buildArray(): Step[] {
		const Wmax = 16;
		let cap = 1;
		let size = 0;
		const steps: Step[] = [];
		let prevPhi = 0;
		steps.push({
			n: 0, state: [], cap: 1, actual: 0,
			credits: [], phi: 0,
			note: 'старт: size = 0, cap = 1, Φ = 0'
		});
		for (let n = 1; n <= N; n++) {
			let actual = 1; // одна запись
			let resized = false;
			if (size === cap) { actual += size; cap *= 2; resized = true; } // копируем size элементов
			size++;
			const phi = 2 * size - cap; // Φ = 2·size − cap
			// кредиты: на каждом элементе из «второй половины» лежит 2 монетки
			const credits = new Array(size).fill(0).map((_, i) => (2 * (i + 1) > cap ? 2 : 0));
			const flips = new Array(Wmax).fill(false);
			if (resized) for (let k = 0; k < size; k++) flips[k] = true; // вся копия
			else flips[size - 1] = true; // только новый элемент
			const dphi = phi - prevPhi;
			steps.push({
				n, state: new Array(size).fill(1), cap, actual, credits, phi, flips,
				note: resized
					? `push + удвоение cap→${cap}: копируем ${size - 1}, стоимость ${actual}`
					: `push: запись 1, ΔΦ = +${dphi}`
			});
			prevPhi = phi;
		}
		return steps;
	}

	let exId = $state<'counter' | 'array'>('counter');
	let idx = $state(0);
	let playing = $state(false);

	const example = $derived(EXAMPLES.find((e) => e.id === exId)!);
	const steps = $derived(exId === 'counter' ? buildCounter() : buildArray());
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// агрегаты до текущего шага (включительно)
	const totalActual = $derived(
		steps.slice(0, idx + 1).reduce((a, s) => a + s.actual, 0)
	);
	const aggAmort = $derived(idx > 0 ? totalActual / idx : 0);
	const totalCredits = $derived(cur.credits.reduce((a, c) => a + c, 0));
	// потенциалный метод: ам.стоимость = факт + ΔΦ
	const prevPhi = $derived(idx > 0 ? steps[idx - 1].phi : 0);
	const dPhi = $derived(cur.phi - prevPhi);
	const potAmort = $derived(idx > 0 ? cur.actual + dPhi : 0);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() { playing = false; clearInterval(timer); }
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= steps.length - 1) { stop(); return; }
			idx += 1;
		}, 800);
	}
	function reset() { stop(); idx = 0; }
	function setExample(id: 'counter' | 'array') {
		exId = id;
		reset();
	}
	function cellChanged(i: number): boolean {
		return !!cur.flips && cur.flips[i] === true;
	}
	function cellFilled(i: number): boolean {
		if (exId === 'counter') return cur.state[i] === 1;
		return i < cur.state.length;
	}
	function cellCredit(i: number): number {
		return cur.credits[i] ?? 0;
	}
</script>

<div class="am">
	<div class="am__bar">
		<div class="seg">
			{#each EXAMPLES as e}
				<button class:on={exId === e.id} onclick={() => setExample(e.id)}>{e.label}</button>
			{/each}
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

	<!-- общая сцена: ячейки с кредитами-монетками -->
	<div class="am__scene">
		<div class="scene-head">
			<span class="lbl">{example.opWord} № {cur.n} из {N}</span>
			<span class="lbl mono">{example.phiDef} = {cur.phi}</span>
		</div>
		<svg viewBox="0 0 420 78" class="am__svg" preserveAspectRatio="xMidYMid meet">
			{#each Array(example.width) as _, i}
				{@const cw = 420 / example.width}
				{@const x = i * cw}
				{@const filled = cellFilled(i)}
				{@const changed = cellChanged(i)}
				{@const credit = cellCredit(i)}
				<g class="cell" class:filled class:changed>
					<rect x={x + 2} y="30" width={cw - 4} height="34" rx="5" />
					<text x={x + cw / 2} y="51" class="cell-t">{example.cellLabel(i, cur)}</text>
					{#if credit > 0}
						<!-- монетки-кредиты над ячейкой (бухгалтерский метод) -->
						{#each Array(credit) as _, c}
							<circle cx={x + cw / 2 + (c - (credit - 1) / 2) * 9} cy="18" r="6" class="coin" />
						{/each}
					{/if}
				</g>
			{/each}
		</svg>
		<div class="note">{cur.note}</div>
	</div>

	<!-- три метода бок о бок -->
	<div class="am__methods">
		<!-- 1. групповой -->
		<div class="method">
			<div class="m-head"><span class="badge">1</span>Групповой</div>
			<div class="m-body">
				<div class="m-row"><span>сумма стоимостей</span><b>{totalActual}</b></div>
				<div class="m-row"><span>операций</span><b>{idx}</b></div>
				<div class="m-row big">
					<span>÷ = ам. стоимость</span>
					<b class="hl">{idx > 0 ? aggAmort.toFixed(2) : '—'}</b>
				</div>
				<div class="m-bar">
					<div class="track">
						<i style="width: {Math.min(100, (aggAmort / example.charge) * 100)}%"></i>
						<i class="cap" style="left: 100%"></i>
					</div>
					<span class="cap-lbl">граница {example.charge}</span>
				</div>
			</div>
			<div class="m-foot">Σ стоимостей / n ≤ {example.charge} = O(1)</div>
		</div>

		<!-- 2. бухгалтерский -->
		<div class="method">
			<div class="m-head"><span class="badge">2</span>Бухгалтерский</div>
			<div class="m-body">
				<div class="m-row"><span>плата за {example.opWord}</span><b>{example.charge} <i class="coin-mini"></i></b></div>
				<div class="m-row"><span>списано (факт)</span><b>{cur.actual}</b></div>
				<div class="m-row big">
					<span>банк (кредиты)</span>
					<b class="hl">{totalCredits} <i class="coin-mini"></i></b>
				</div>
				<div class="m-hint">монетки лежат на ячейках сверху ↑</div>
			</div>
			<div class="m-foot">банк ≥ 0 всегда → плата {example.charge} честна</div>
		</div>

		<!-- 3. потенциалов -->
		<div class="method">
			<div class="m-head"><span class="badge">3</span>Потенциалов</div>
			<div class="m-body">
				<div class="m-row"><span>факт. стоимость</span><b>{cur.actual}</b></div>
				<div class="m-row"><span>ΔΦ = Φ − Φ′</span><b class:neg={dPhi < 0}>{idx > 0 ? (dPhi >= 0 ? '+' : '') + dPhi : '—'}</b></div>
				<div class="m-row big">
					<span>факт + ΔΦ</span>
					<b class="hl">{idx > 0 ? potAmort : '—'}</b>
				</div>
				<div class="phi-strip">
					{#each steps.slice(1, idx + 1).slice(-12) as s}
						<i style="height: {6 + s.phi * 5}px" title={`Φ=${s.phi}`}></i>
					{/each}
				</div>
			</div>
			<div class="m-foot">Σ ΔΦ телескопирует → Σ ам. ≥ Σ факт.</div>
		</div>
	</div>

	<div class="am__concl">
		Все три метода дают одну ам. оценку <b>O(1)</b> на {example.opWord}:
		групповой усредняет постфактум, бухгалтерский копит монетки заранее,
		потенциалов прячет «запас» в Φ. Здесь банк кредитов = Φ — это не совпадение.
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
	.seg button.on { background: var(--blue); color: #fff; }
	.ctrl { display: flex; align-items: center; gap: 0.3rem; }
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
	.ctrl button:hover { border-color: var(--blue); color: var(--blue); }
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}

	.am__scene {
		padding: 0.8rem 1rem 0.6rem;
		border-bottom: 1.5px solid var(--color-ink-600);
	}
	.scene-head {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.3rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.lbl.mono { color: var(--blue); text-transform: none; letter-spacing: 0; }
	.am__svg { width: 100%; height: auto; display: block; }
	.cell rect {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.cell.filled rect { fill: var(--blue-pale); stroke: var(--blue); }
	.cell.changed rect { fill: var(--blue); stroke: var(--color-parch-100); stroke-width: 2.5; }
	.cell-t {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.74rem;
		fill: var(--color-parch-100);
	}
	.cell.changed .cell-t { fill: #fff; }
	.coin {
		fill: var(--color-parch-200);
		stroke: var(--blue);
		stroke-width: 1.5;
	}

	.note {
		margin-top: 0.5rem;
		font-size: 0.82rem;
		color: var(--color-parch-200);
		padding: 0.5rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}

	.am__methods {
		display: flex;
		gap: 0.8rem;
		padding: 0.9rem 1rem;
		flex-wrap: wrap;
	}
	.method {
		flex: 1 1 180px;
		min-width: 170px;
		display: flex;
		flex-direction: column;
		border: 1.5px solid var(--color-ink-600);
		border-radius: 10px;
		background: var(--color-ink-800);
		overflow: hidden;
	}
	.m-head {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.6rem;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.84rem;
		color: var(--color-parch-100);
		border-bottom: 1px solid var(--color-ink-600);
	}
	.badge {
		display: grid;
		place-items: center;
		width: 1.3rem;
		height: 1.3rem;
		border-radius: 50%;
		background: var(--blue);
		color: #fff;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		flex: none;
	}
	.m-body {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.55rem 0.6rem;
		flex: 1;
	}
	.m-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.4rem;
		font-size: 0.74rem;
	}
	.m-row span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.m-row b { font-family: var(--font-display); color: var(--color-parch-100); }
	.m-row b.neg { color: var(--blue); }
	.m-row.big {
		margin-top: 0.15rem;
		padding-top: 0.3rem;
		border-top: 1px dashed var(--color-ink-600);
		font-size: 0.8rem;
	}
	.m-row b.hl {
		color: var(--blue);
		font-size: 1.05rem;
		font-weight: 800;
	}
	.coin-mini {
		display: inline-block;
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 50%;
		background: var(--color-parch-200);
		border: 1.5px solid var(--blue);
		vertical-align: -1px;
	}
	.m-hint, .cap-lbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
		margin-top: 0.2rem;
	}
	.m-bar { margin-top: 0.4rem; }
	.m-bar .track {
		position: relative;
		height: 0.65rem;
		background: var(--color-ink-700);
		border-radius: 5px;
		overflow: visible;
	}
	.m-bar .track i {
		display: block;
		height: 100%;
		background: var(--blue);
		border-radius: 5px;
		transition: width 0.3s;
	}
	.m-bar .track i.cap {
		position: absolute;
		top: -2px;
		width: 2px;
		height: calc(100% + 4px);
		background: var(--color-parch-200);
		transform: translateX(-1px);
	}
	.phi-strip {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 36px;
		margin-top: 0.4rem;
		padding-top: 0.2rem;
		border-bottom: 1.5px solid var(--color-ink-600);
	}
	.phi-strip i {
		flex: 1;
		min-width: 4px;
		background: var(--blue-pale);
		border-top: 2px solid var(--blue);
		border-radius: 2px 2px 0 0;
		transition: height 0.25s;
	}
	.m-foot {
		padding: 0.4rem 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
		border-top: 1px solid var(--color-ink-600);
		background: var(--color-ink-850);
	}

	.am__concl {
		padding: 0.7rem 1rem 0.9rem;
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--color-parch-200);
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.am__concl b { color: var(--blue); font-family: var(--font-display); }
</style>
