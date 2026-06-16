<script lang="ts">
	// Построение НВП (наибольшей возрастающей подпоследовательности) за O(n²).
	// Массив рисуется барами. При обработке a[i] подсвечиваются все j<i с a[j]<a[i],
	// из них выбирается max dp[j]+1, рисуется стрелка-предок prev[i]→i.
	// В финале восстанавливается и выделяется сама НВП по массиву предков.
	// Шаг / плей / сброс, редактирование значений, перетасовка. Чистый SVG, без зависимостей.
	type Cmp = { j: number; ok: boolean; better: boolean };
	type Step = {
		i: number; // текущий обрабатываемый индекс (-1 = старт)
		dp: number[]; // dp[k] на конец шага
		prev: number[]; // prev[k] на конец шага
		cmps: Cmp[]; // сравнения a[i] с j<i на этом шаге
		chosen: number; // выбранный предок для i (-1 если нет)
		note: string;
		done: boolean; // финальный шаг с восстановлением НВП
	};

	const INITIAL = [3, 1, 8, 2, 5, 4, 7, 6];
	let arr = $state<number[]>([...INITIAL]);

	// Полный прогон алгоритма НВП O(n²) → серия шагов для анимации.
	function buildSteps(a: number[]): Step[] {
		const n = a.length;
		const dp = new Array(n).fill(1);
		const prev = new Array(n).fill(-1);
		const steps: Step[] = [];
		steps.push({
			i: -1, dp: [...dp], prev: [...prev], cmps: [], chosen: -1, done: false,
			note: 'Старт: dp[i] = 1 для всех (каждый элемент сам по себе — НВП длины 1).'
		});
		for (let i = 0; i < n; i++) {
			const cmps: Cmp[] = [];
			let chosen = -1;
			let best = 0; // лучшее найденное dp[j] для j<i с a[j]<a[i]
			for (let j = 0; j < i; j++) {
				const ok = a[j] < a[i];
				const better = ok && dp[j] > best;
				if (better) {
					best = dp[j];
					dp[i] = dp[j] + 1;
					prev[i] = j;
					chosen = j;
				}
				cmps.push({ j, ok, better });
			}
			const note =
				chosen === -1
					? `a[${i}] = ${a[i]}: слева нет меньшего элемента — dp[${i}] = 1.`
					: `a[${i}] = ${a[i]}: лучший предок j = ${chosen} (a=${a[chosen]}, dp=${dp[chosen]}) → dp[${i}] = ${dp[i]}.`;
			steps.push({ i, dp: [...dp], prev: [...prev], cmps, chosen, done: false, note });
		}
		// Восстановление НВП: индекс с максимальным dp, идём по prev назад.
		let endIdx = 0;
		for (let k = 1; k < n; k++) if (dp[k] > dp[endIdx]) endIdx = k;
		steps.push({
			i: n, dp: [...dp], prev: [...prev], cmps: [], chosen: -1, done: true,
			note: `Готово: НВП длины ${n === 0 ? 0 : dp[endIdx]}. Восстановлена по стрелкам-предкам с конца.`
		});
		return steps;
	}

	const steps = $derived(buildSteps(arr));
	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// Индексы, входящие в финальную НВП (только на финальном шаге).
	const lisSet = $derived.by(() => {
		const set = new Set<number>();
		if (!cur.done) return set;
		const n = arr.length;
		if (n === 0) return set;
		let endIdx = 0;
		for (let k = 1; k < n; k++) if (cur.dp[k] > cur.dp[endIdx]) endIdx = k;
		let k = endIdx;
		while (k !== -1) {
			set.add(k);
			k = cur.prev[k];
		}
		return set;
	});

	// Множества для подсветки сравнений текущего шага.
	const cmpMap = $derived.by(() => {
		const m = new Map<number, Cmp>();
		for (const c of cur.cmps) m.set(c.j, c);
		return m;
	});

	const maxVal = $derived(Math.max(1, ...arr));

	// --- геометрия баров ---
	const PAD_L = 14;
	const PAD_R = 14;
	const W = 420;
	const TOP = 18; // верх области баров
	const BASE = 232; // линия основания баров
	const slot = $derived((W - PAD_L - PAD_R) / Math.max(1, arr.length));
	const barW = $derived(Math.min(38, slot * 0.62));
	const cx = (i: number) => PAD_L + slot * (i + 0.5);
	const barH = (v: number) => ((BASE - TOP) * v) / maxVal;
	const topY = (v: number) => BASE - barH(v);

	// Дуга-стрелка предок j → i над барами.
	function arcPath(j: number, i: number): string {
		const x1 = cx(j);
		const x2 = cx(i);
		const y = TOP - 4;
		const lift = Math.min(40, 14 + Math.abs(i - j) * 5);
		const cyTop = y - lift;
		const mx = (x1 + x2) / 2;
		return `M ${x1} ${y} Q ${mx} ${cyTop} ${x2} ${y}`;
	}

	function barState(i: number): string {
		if (cur.done) return lisSet.has(i) ? 'lis' : 'dim';
		if (cur.i === i) return 'current';
		const c = cmpMap.get(i);
		if (c) return c.ok ? 'good' : 'bad';
		if (cur.i >= 0 && i < cur.i) return 'past';
		return 'idle';
	}

	// --- контролы анимации ---
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
		}, 850);
	}
	function reset() {
		stop();
		idx = 0;
	}

	// --- редактирование массива ---
	function shuffle() {
		stop();
		const a = [...arr];
		for (let k = a.length - 1; k > 0; k--) {
			const r = Math.floor(Math.random() * (k + 1));
			[a[k], a[r]] = [a[r], a[k]];
		}
		arr = a;
		idx = 0;
	}
	function bump(i: number, d: number) {
		stop();
		const v = Math.min(9, Math.max(1, arr[i] + d));
		arr[i] = v;
		idx = 0;
	}
	function resetArr() {
		stop();
		arr = [...INITIAL];
		idx = 0;
	}

	// Стрелки-предки, видимые на текущем шаге (накопленные по уже обработанным i).
	const arcs = $derived.by(() => {
		const out: { j: number; i: number; active: boolean; lis: boolean }[] = [];
		const upTo = cur.done ? arr.length - 1 : cur.i;
		for (let i = 0; i <= upTo && i < arr.length; i++) {
			const j = cur.prev[i];
			if (j === -1) continue;
			out.push({
				j,
				i,
				active: !cur.done && cur.i === i,
				lis: cur.done && lisSet.has(i) && lisSet.has(j)
			});
		}
		return out;
	});
</script>

<div class="lb">
	<div class="lb__bar">
		<div class="title">НВП — построение через dp[i] = max(dp[j]+1)</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс анимации">↺</button>
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

	<div class="lb__body">
		<svg viewBox="0 0 420 290" class="lb__svg">
			<defs>
				<marker id="lb-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
					<path d="M0,0 L6,3 L0,6 z" fill="var(--blue)" />
				</marker>
				<marker id="lb-arr-lis" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
					<path d="M0,0 L6,3 L0,6 z" fill="var(--color-parch-100)" />
				</marker>
			</defs>

			<!-- основание -->
			<line x1={PAD_L} y1={BASE} x2={W - PAD_R} y2={BASE} class="axis" />

			<!-- стрелки-предки -->
			{#each arcs as a}
				<path
					d={arcPath(a.j, a.i)}
					class="arc"
					class:active={a.active}
					class:lis={a.lis}
					fill="none"
					marker-end={a.lis ? 'url(#lb-arr-lis)' : 'url(#lb-arr)'}
				/>
			{/each}

			<!-- бары -->
			{#each arr as v, i}
				<g class="bar {barState(i)}">
					<rect
						x={cx(i) - barW / 2}
						y={topY(v)}
						width={barW}
						height={barH(v)}
						rx="3"
					/>
					<text class="val" x={cx(i)} y={topY(v) - 5}>{v}</text>
					<text class="dp" x={cx(i)} y={BASE + 14}>{cur.dp[i]}</text>
					<text class="ix" x={cx(i)} y={BASE + 27}>{i}</text>
				</g>
			{/each}

			<!-- подписи строк -->
			<text class="legend" x={PAD_L} y={BASE + 14} text-anchor="end" dx="-2">dp</text>
			<text class="legend" x={PAD_L} y={BASE + 27} text-anchor="end" dx="-2">i</text>
		</svg>

		<div class="lb__panel">
			<div class="note">{cur.note}</div>

			<div class="dpbox">
				<span class="lbl">dp по индексам</span>
				<div class="chips">
					{#each cur.dp as d, i}
						<span
							class="chip"
							class:cur={!cur.done && cur.i === i}
							class:lis={cur.done && lisSet.has(i)}
						>{d}</span>
					{/each}
				</div>
			</div>

			{#if cur.done}
				<div class="dpbox">
					<span class="lbl">найденная НВП</span>
					<div class="chips">
						{#each arr as v, i}
							{#if lisSet.has(i)}<span class="chip lis">{v}</span>{/if}
						{/each}
					</div>
				</div>
			{/if}

			<div class="lgnd">
				<span class="dot good"></span>меньше a[i]
				<span class="dot bad"></span>не меньше
				<span class="dot current"></span>текущий
				<span class="dot lis"></span>в НВП
			</div>
		</div>
	</div>

	<div class="lb__edit">
		<span class="lbl">массив:</span>
		<div class="cells">
			{#each arr as v, i}
				<div class="cell">
					<button class="step up" onclick={() => bump(i, 1)} title="+1">▲</button>
					<span class="cv">{v}</span>
					<button class="step dn" onclick={() => bump(i, -1)} title="−1">▼</button>
				</div>
			{/each}
		</div>
		<div class="acts">
			<button onclick={shuffle}>перетасовать</button>
			<button onclick={resetArr}>исходный</button>
		</div>
	</div>
</div>

<style>
	.lb {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.lb__bar {
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
		font-weight: 800;
		font-size: 0.82rem;
		color: var(--color-parch-100);
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
	.lb__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.lb__svg {
		flex: 1 1 360px;
		min-width: 300px;
		max-width: 500px;
		height: auto;
	}
	.axis {
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
	}
	.bar rect {
		fill: var(--color-ink-700);
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.bar .val {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.74rem;
		fill: var(--color-parch-100);
	}
	.bar .dp {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		fill: var(--blue);
	}
	.bar .ix {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		fill: var(--color-parch-muted);
	}
	.legend {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		fill: var(--color-parch-muted);
	}
	.bar.good rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.bar.bad rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
	}
	.bar.past rect {
		fill: var(--color-ink-700);
		stroke: var(--color-ink-500);
	}
	.bar.current rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
	}
	.bar.current .val {
		fill: #fff;
	}
	.bar.lis rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2;
	}
	.bar.lis .val {
		fill: #fff;
	}
	.bar.dim rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		opacity: 0.6;
	}
	.bar.dim .val,
	.bar.dim .dp {
		opacity: 0.5;
	}
	.arc {
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		opacity: 0.55;
		transition: stroke 0.2s, opacity 0.2s;
	}
	.arc.active {
		stroke: var(--blue);
		stroke-width: 2.5;
		opacity: 1;
	}
	.arc.lis {
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
		opacity: 1;
	}
	.lb__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.dpbox {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.28rem;
	}
	.chip {
		display: grid;
		place-items: center;
		min-width: 1.6rem;
		height: 1.6rem;
		padding: 0 0.35rem;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.76rem;
		background: var(--color-ink-700);
		color: var(--color-parch-100);
		border: 1.5px solid var(--color-ink-500);
	}
	.chip.cur {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.chip.lis {
		background: var(--blue);
		color: #fff;
		border-color: var(--color-parch-100);
	}
	.lgnd {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.7rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
		margin-top: auto;
	}
	.dot {
		display: inline-block;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 3px;
		margin-right: 0.15rem;
		vertical-align: -1px;
	}
	.dot.good {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.dot.bad {
		background: var(--color-ink-800);
		border: 1.5px solid var(--color-ink-600);
	}
	.dot.current {
		background: var(--blue);
	}
	.dot.lis {
		background: var(--blue);
		border: 1.5px solid var(--color-parch-100);
	}
	.lb__edit {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
		padding: 0.8rem 1rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.cells {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
	}
	.cell .cv {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		color: var(--color-parch-100);
		min-width: 1.3rem;
		text-align: center;
	}
	.step {
		width: 1.5rem;
		height: 1rem;
		line-height: 1;
		padding: 0;
		border: 1px solid var(--color-ink-500);
		border-radius: 4px;
		background: var(--color-ink-850);
		color: var(--color-parch-muted);
		cursor: pointer;
		font-size: 0.55rem;
	}
	.step:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.acts {
		display: flex;
		gap: 0.35rem;
		margin-left: auto;
	}
	.acts button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		padding: 0.34rem 0.6rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.acts button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
</style>
