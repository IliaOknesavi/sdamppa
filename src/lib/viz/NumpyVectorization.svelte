<script lang="ts">
	// Python-цикл против векторизованной numpy-операции (a + b) на массиве.
	// Две дорожки: поэлементный цикл (медленно, боксинг объектов, такт на элемент)
	// и один векторный вызов в C/BLAS (быстро, без боксинга). Бегущие условные
	// такты и столбики времени. Ползунок размера массива, кнопки шаг/плей/сброс.
	// Чистый инлайн SVG, без внешних импортов.

	// --- модель стоимости (условные такты) -------------------------------
	// Python: на каждый элемент — несколько операций интерпретатора
	// (разбоксить два PyObject, сложить, забоксить результат, проверка границ).
	const PY_PER_ELEM = 6; // тактов на элемент в цикле
	const PY_SETUP = 2; // вход в цикл
	// NumPy: фиксированный диспатч вызова + тело в C, обрабатывающее по 8 за такт
	// (один проход по непрерывному буферу, SIMD-ширина), без боксинга.
	const NP_DISPATCH = 14; // разовая стоимость вызова ufunc
	const NP_LANES = 8; // элементов за такт в векторном теле

	let n = $state(8); // размер массива (число элементов на дорожке)

	const pyTicks = $derived(PY_SETUP + n * PY_PER_ELEM);
	const npTicks = $derived(NP_DISPATCH + Math.ceil(n / NP_LANES));
	const speedup = $derived(pyTicks / npTicks);

	// общее число «кадров» анимации: столько, чтобы хватило обойти Python-цикл
	const total = $derived(n); // по кадру на элемент Python-цикла
	let idx = $state(0); // 0..total ; 0 = старт, total = всё посчитано
	let playing = $state(false);

	// сколько элементов уже обработано на каждой дорожке к кадру idx
	const pyDone = $derived(Math.min(idx, n)); // Python: по 1 элементу за кадр
	// NumPy завершает всё за один «пакетный» такт: как только цикл стартовал
	// (idx>=1), весь буфер уже обработан в C.
	const npDone = $derived(idx >= 1 ? n : 0);

	// потраченные такты к текущему кадру (для бегущих счётчиков)
	const pyElapsed = $derived(pyDone === 0 ? 0 : PY_SETUP + pyDone * PY_PER_ELEM);
	const npElapsed = $derived(npDone === 0 ? 0 : npTicks);

	const done = $derived(idx >= total);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		if (done) idx = 0;
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= total) {
				stop();
				return;
			}
			idx += 1;
		}, 420);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function stepFwd() {
		stop();
		idx = Math.min(total, idx + 1);
	}
	function stepBack() {
		stop();
		idx = Math.max(0, idx - 1);
	}
	function setN(v: number) {
		n = v;
		reset();
	}

	// демо-значения массивов (повторяются по кругу при больших n)
	const A = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8];
	const B = [2, 7, 1, 8, 2, 8, 1, 8, 2, 8, 4, 5];
	const aVal = (i: number) => A[i % A.length];
	const bVal = (i: number) => B[i % B.length];

	// --- геометрия ячеек -------------------------------------------------
	const TRACK_W = 250; // ширина области ячеек
	const X0 = 96; // левый край ячеек
	const cellW = $derived(Math.max(4, Math.min(26, TRACK_W / n)));
	const cellGap = $derived(n > 24 ? 0 : n > 14 ? 1 : 2);
	const showText = $derived(n <= 14);
	const cellX = (i: number) => X0 + i * (cellW + cellGap);

	// статус ячейки на текущем кадре: done / active / idle
	function pyState(i: number): string {
		if (i < pyDone) return 'done';
		if (i === pyDone && idx > 0 && idx <= total) return 'active';
		return 'idle';
	}
	function npState(i: number): string {
		return npDone > 0 ? 'done' : 'idle';
	}

	// столбики времени (нормируем по самому длинному = Python)
	const BAR_MAX = 168;
	const pyBar = $derived((pyElapsed / Math.max(1, pyTicks)) * BAR_MAX);
	const npBar = $derived((npElapsed / Math.max(1, pyTicks)) * BAR_MAX);

	const fmt = (x: number) => x.toFixed(x >= 10 ? 0 : 1);
</script>

<div class="nv">
	<div class="nv__bar">
		<div class="size">
			<span class="lbl">Размер массива N</span>
			<input
				type="range"
				min="2"
				max="48"
				bind:value={n}
				oninput={reset}
			/>
			<b class="nval">{n}</b>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={stepBack} title="шаг назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="запустить">▶</button>
			{/if}
			<button onclick={stepFwd} title="шаг вперёд">▶▶</button>
			<span class="cnt">{idx}/{total}</span>
		</div>
	</div>

	<div class="nv__body">
		<svg viewBox="0 0 420 290" class="nv__svg" preserveAspectRatio="xMidYMid meet">
			<!-- ===== Python-дорожка ===== -->
			<text class="track-name" x="8" y="22">Python-цикл</text>
			<text class="track-sub" x="8" y="36">for i in range(N):</text>
			<text class="track-sub" x="8" y="48">  c[i]=a[i]+b[i]</text>

			{#each Array(n) as _, i}
				<g class="cell py {pyState(i)}">
					<rect x={cellX(i)} y="14" width={cellW} height={cellW} rx="3" />
					{#if showText}
						<text x={cellX(i) + cellW / 2} y={14 + cellW / 2} dy="0.34em">
							{aVal(i) + bVal(i)}
						</text>
					{/if}
				</g>
			{/each}
			<!-- бегущая «голова» интерпретатора -->
			{#if idx > 0 && idx <= total && pyDone < n}
				<polygon
					class="head"
					points={`${cellX(pyDone) + cellW / 2},${14 + cellW + 4} ${cellX(pyDone) + cellW / 2 - 4},${14 + cellW + 11} ${cellX(pyDone) + cellW / 2 + 4},${14 + cellW + 11}`}
				/>
			{/if}
			<text class="badge" x={X0} y="76">боксинг PyObject · такт на элемент</text>

			<!-- ===== NumPy-дорожка ===== -->
			<text class="track-name" x="8" y="118">numpy</text>
			<text class="track-sub" x="8" y="132">c = a + b</text>
			<text class="track-sub" x="8" y="144">  (один вызов)</text>

			{#each Array(n) as _, i}
				<g class="cell np {npState(i)}">
					<rect x={cellX(i)} y="110" width={cellW} height={cellW} rx="3" />
					{#if showText}
						<text x={cellX(i) + cellW / 2} y={110 + cellW / 2} dy="0.34em">
							{aVal(i) + bVal(i)}
						</text>
					{/if}
				</g>
			{/each}
			<!-- скобка «один проход в C по всему буферу» -->
			{#if npDone > 0}
				<path
					class="sweep"
					d={`M ${X0} ${110 + cellW + 6} L ${X0} ${110 + cellW + 11} L ${cellX(n - 1) + cellW} ${110 + cellW + 11} L ${cellX(n - 1) + cellW} ${110 + cellW + 6}`}
					fill="none"
				/>
			{/if}
			<text class="badge" x={X0} y="172">тело в C/BLAS · {NP_LANES} за такт · без боксинга</text>

			<!-- ===== столбики времени ===== -->
			<text class="axis" x="8" y="206">Время (условные такты)</text>

			<g class="timebar">
				<rect class="tb-bg" x="96" y={262 - BAR_MAX} width="46" height={BAR_MAX} rx="4" />
				<rect class="tb py" x="96" y={262 - pyBar} width="46" height={pyBar} rx="4" />
				<text class="tb-cap" x="119" y="278">Python</text>
				<text class="tb-num" x="119" y={262 - pyBar - 6}>{pyElapsed}</text>
			</g>

			<g class="timebar">
				<rect class="tb-bg" x="168" y={262 - BAR_MAX} width="46" height={BAR_MAX} rx="4" />
				<rect class="tb np" x="168" y={262 - npBar} width="46" height={npBar} rx="4" />
				<text class="tb-cap" x="191" y="278">numpy</text>
				<text class="tb-num" x="191" y={262 - Math.max(npBar, 0) - 6}>{npElapsed}</text>
			</g>

			<!-- итоговое ускорение -->
			<g class="speed" transform="translate(248, 96)">
				<text class="sp-lbl" x="0" y="0">ускорение</text>
				<text class="sp-val" x="0" y="44">×{fmt(speedup)}</text>
				<text class="sp-foot" x="0" y="74">{pyTicks} / {npTicks} тактов</text>
				<text class="sp-foot2" x="0" y="96">{done ? 'обе посчитаны' : playing ? 'идёт расчёт…' : 'нажмите ▶'}</text>
			</g>
		</svg>
	</div>

	<div class="nv__note">
		{#if n <= 6}
			На крошечном массиве разрыв мал: фиксированный диспатч numpy ({NP_DISPATCH} тактов)
			сопоставим с коротким Python-циклом. Векторизация раскрывается на больших N.
		{:else if speedup < 6}
			Python проходит N элементов по очереди, разбоксивая объекты на каждом такте;
			numpy делает один вызов и считает буфер в C. Двиньте N вправо — разрыв растёт линейно.
		{:else}
			Python-цикл линеен по N (такт на элемент), а векторный вызов почти не растёт:
			одно тело в C/BLAS обрабатывает весь непрерывный буфер. Отсюда ×{fmt(speedup)}.
		{/if}
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
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.size {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		flex: 1 1 220px;
		min-width: 200px;
	}
	.size .lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		flex: none;
	}
	.size input[type='range'] {
		flex: 1;
		accent-color: var(--blue);
		min-width: 80px;
	}
	.nval {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--color-parch-100);
		width: 1.6rem;
		text-align: right;
		flex: none;
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
		min-width: 2.6rem;
	}
	.nv__body {
		padding: 0.8rem 1rem 0.2rem;
	}
	.nv__svg {
		width: 100%;
		height: auto;
		max-width: 460px;
		display: block;
		margin: 0 auto;
	}

	.track-name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.8rem;
		fill: var(--color-parch-100);
	}
	.track-sub {
		font-family: var(--font-mono);
		font-size: 0.52rem;
		fill: var(--color-parch-muted);
	}
	.badge {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		fill: var(--color-parch-muted);
	}
	.axis {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}

	.cell rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1;
		transition: fill 0.18s, stroke 0.18s;
	}
	.cell text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.cell.py.done rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.cell.py.done text {
		fill: var(--blue);
	}
	.cell.py.active rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2;
	}
	.cell.py.active text {
		fill: #fff;
	}
	.cell.np.done rect {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.cell.np.done text {
		fill: #fff;
	}
	.head {
		fill: var(--blue);
	}
	.sweep {
		stroke: var(--blue);
		stroke-width: 2;
	}

	.tb-bg {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1;
	}
	.tb {
		transition: height 0.18s, y 0.18s;
	}
	.tb.py {
		fill: var(--color-parch-muted);
	}
	.tb.np {
		fill: var(--blue);
	}
	.tb-cap {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.tb-num {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		font-weight: 700;
		fill: var(--color-parch-100);
	}

	.sp-lbl {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		fill: var(--color-parch-muted);
	}
	.sp-val {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 2.1rem;
		fill: var(--blue);
	}
	.sp-foot {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		fill: var(--color-parch-200);
	}
	.sp-foot2 {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}

	.nv__note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.7rem 0.9rem 0.9rem;
		margin: 0.4rem 1rem 1rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
</style>
