<script lang="ts">
	// Три модели конкурентности на временной шкале: процессы (истинный
	// параллелизм на нескольких ядрах), потоки (общая память, но GIL в CPython
	// сериализует CPU-такты на одном ядре), асинхронность (один поток,
	// переключение задач на ожидании I/O). Тумблер CPU-bound / I/O-bound
	// перестраивает расписание и меняет, кто выигрывает.
	// Чистый инлайн SVG/HTML, без внешних зависимостей.

	type Kind = 'cpu' | 'io';
	// Каждая задача — последовательность тактов: c = считает (CPU), i = ждёт I/O.
	// Длина последовательности одинакова у всех задач, чтобы шкала была честной.
	const N = 3; // число задач
	const LANE = ['Задача 1', 'Задача 2', 'Задача 3'];

	// Профиль одного такта задачи в зависимости от нагрузки.
	function taskTicks(workload: Kind): Kind[] {
		// 6 тактов на задачу. CPU-bound: почти всё — счёт. I/O-bound: почти всё — ожидание.
		return workload === 'cpu'
			? ['cpu', 'cpu', 'cpu', 'io', 'cpu', 'cpu']
			: ['io', 'cpu', 'io', 'io', 'cpu', 'io'];
	}

	// Ячейка готового расписания: какая задача и что делает в данном слоте лейна.
	type Cell = { task: number; kind: Kind } | null;
	type Schedule = { lanes: Cell[][]; laneLabels: string[]; total: number; speedup: string };

	// ── ПРОЦЕССЫ ─────────────────────────────────────────────────────────────
	// N процессов = N ядер. Каждый исполняет свою задачу целиком и независимо.
	// И счёт, и ожидание идут параллельно → общее время = длина одной задачи.
	function planProcesses(workload: Kind): Schedule {
		const ticks = taskTicks(workload);
		const lanes: Cell[][] = [];
		for (let t = 0; t < N; t++) {
			lanes.push(ticks.map((k) => ({ task: t, kind: k })));
		}
		return {
			lanes,
			laneLabels: ['Ядро 1', 'Ядро 2', 'Ядро 3'],
			total: ticks.length,
			speedup: '≈ ×3 (истинный параллелизм)'
		};
	}

	// ── ПОТОКИ (CPython, GIL) ────────────────────────────────────────────────
	// Один лейн исполнения: GIL пропускает только один CPU-такт за раз.
	// CPU-такты всех потоков выстраиваются в очередь (чередуются, но не
	// одновременно). I/O-такты освобождают GIL → их выносим в отдельный лейн
	// «ожидание», где они спокойно перекрываются.
	function planThreads(workload: Kind): Schedule {
		const ticks = taskTicks(workload);
		// Указатель прогресса по каждой задаче.
		const ptr = new Array(N).fill(0);
		const exec: Cell[] = []; // лейн с GIL (CPU по одному)
		const wait: Cell[] = []; // перекрывающееся ожидание I/O
		let rr = 0; // round-robin по задачам для справедливости
		let guard = 0;
		while (ptr.some((p) => p < ticks.length) && guard < 200) {
			guard++;
			// I/O всех задач, готовых ждать, стартует параллельно в этом слоте.
			const waitSlot: number[] = [];
			for (let t = 0; t < N; t++) {
				if (ptr[t] < ticks.length && ticks[ptr[t]] === 'io') {
					waitSlot.push(t);
				}
			}
			// Найдём задачу для CPU-такта (round-robin), GIL → ровно одна за слот.
			let cpuTask = -1;
			for (let k = 0; k < N; k++) {
				const t = (rr + k) % N;
				if (ptr[t] < ticks.length && ticks[ptr[t]] === 'cpu') {
					cpuTask = t;
					break;
				}
			}
			if (cpuTask >= 0) {
				exec.push({ task: cpuTask, kind: 'cpu' });
				ptr[cpuTask]++;
				rr = (cpuTask + 1) % N;
				// Параллельно в этом же слоте кто-то может ждать I/O.
				wait.push(waitSlot.length ? { task: waitSlot[0], kind: 'io' } : null);
				for (let m = 0; m < waitSlot.length; m++) ptr[waitSlot[m]]++;
			} else if (waitSlot.length) {
				// CPU-тактов нет — слот целиком уходит на перекрытое ожидание.
				exec.push(null);
				wait.push({ task: waitSlot[0], kind: 'io' });
				for (let m = 0; m < waitSlot.length; m++) ptr[waitSlot[m]]++;
			} else {
				break;
			}
		}
		const total = Math.max(exec.length, wait.length);
		while (exec.length < total) exec.push(null);
		while (wait.length < total) wait.push(null);
		return {
			lanes: [exec, wait],
			laneLabels: ['GIL: счёт (по одному)', 'Ожидание I/O (внахлёст)'],
			total,
			speedup:
				workload === 'cpu'
					? '≈ ×1 (GIL сериализует счёт)'
					: '≈ ×3 (ожидание перекрывается)'
		};
	}

	// ── АСИНХРОННОСТЬ ─────────────────────────────────────────────────────────
	// Один поток, одна корутина исполняется за раз. На I/O задача делает await и
	// уступает управление → планировщик запускает CPU-работу другой задачи.
	// Ожидания всех задач перекрываются, но CPU-такты строго по одному.
	function planAsync(workload: Kind): Schedule {
		const ticks = taskTicks(workload);
		const ptr = new Array(N).fill(0);
		const exec: Cell[] = [];
		const wait: Cell[] = [];
		let cur = 0; // текущая активная корутина
		let guard = 0;
		while (ptr.some((p) => p < ticks.length) && guard < 200) {
			guard++;
			// Слот: какие задачи прямо сейчас «висят» на ожидании I/O.
			const waitSlot: number[] = [];
			for (let t = 0; t < N; t++) {
				if (ptr[t] < ticks.length && ticks[ptr[t]] === 'io') waitSlot.push(t);
			}
			// Выберем корутину с готовым CPU-тактом, начиная с текущей.
			let cpuTask = -1;
			for (let k = 0; k < N; k++) {
				const t = (cur + k) % N;
				if (ptr[t] < ticks.length && ticks[ptr[t]] === 'cpu') {
					cpuTask = t;
					break;
				}
			}
			if (cpuTask >= 0) {
				exec.push({ task: cpuTask, kind: 'cpu' });
				ptr[cpuTask]++;
				cur = cpuTask; // держим управление, пока не наткнёмся на await
				wait.push(waitSlot.length ? { task: waitSlot[0], kind: 'io' } : null);
				for (let m = 0; m < waitSlot.length; m++) ptr[waitSlot[m]]++;
			} else if (waitSlot.length) {
				exec.push(null);
				wait.push({ task: waitSlot[0], kind: 'io' });
				for (let m = 0; m < waitSlot.length; m++) ptr[waitSlot[m]]++;
				cur = (cur + 1) % N;
			} else {
				break;
			}
		}
		const total = Math.max(exec.length, wait.length);
		while (exec.length < total) exec.push(null);
		while (wait.length < total) wait.push(null);
		return {
			lanes: [exec, wait],
			laneLabels: ['Поток: счёт (по одному)', 'Ожидание I/O (внахлёст)'],
			total,
			speedup:
				workload === 'cpu'
					? '≈ ×1 (нет параллелизма счёта)'
					: '≈ ×3 (переключение на await)'
		};
	}

	const MODELS = [
		{
			id: 'proc',
			title: 'Процессы',
			sub: 'multiprocessing',
			mem: 'Память изолирована у каждого процесса; обмен — через IPC/pickle.',
			plan: planProcesses
		},
		{
			id: 'thread',
			title: 'Потоки',
			sub: 'threading',
			mem: 'Общая память на все потоки; в CPython счёт сторожит GIL.',
			plan: planThreads
		},
		{
			id: 'async',
			title: 'Асинхронность',
			sub: 'asyncio',
			mem: 'Один поток, одна память; кооперативное переключение на await.',
			plan: planAsync
		}
	] as const;

	let workload = $state<Kind>('cpu');
	let playing = $state(false);

	// Все три расписания для текущей нагрузки + общая ширина шкалы.
	const schedules = $derived(MODELS.map((m) => m.plan(workload)));
	const maxTotal = $derived(Math.max(...schedules.map((s) => s.total)));

	// Стартуем с полностью раскрытой шкалы (виден итог); анимация её «сматывает».
	// Большое стартовое значение клампится до maxTotal при отрисовке.
	let t = $state(99);
	// Кто завершился быстрее всех при этой нагрузке (минимальное число слотов).
	const fastest = $derived(
		schedules.reduce((best, s, i) => (s.total < schedules[best].total ? i : best), 0)
	);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		if (t >= maxTotal) t = 0;
		playing = true;
		timer = setInterval(() => {
			if (t >= maxTotal) {
				stop();
				return;
			}
			t += 1;
		}, 600);
	}
	function reset() {
		stop();
		t = 0;
	}
	function setWorkload(w: Kind) {
		workload = w;
		stop();
		t = maxTotal; // сразу показываем итог при смене нагрузки
	}

	// Геометрия одной мини-диаграммы.
	const CW = 26; // ширина ячейки-такта
	const CH = 17; // высота лейна
	const GAP = 5; // зазор между лейнами
	const LX = 96; // отступ слева под подписи лейнов
	const TOP = 6;
	const chartW = $derived(LX + maxTotal * CW + 10);
	function chartH(s: Schedule): number {
		return TOP + s.lanes.length * (CH + GAP) + 20;
	}
	function axisY(s: Schedule): number {
		return TOP + s.lanes.length * (CH + GAP) + 2;
	}
	const taskColor = ['var(--blue)', 'var(--color-ink-600)', 'var(--blue-pale)'];
	const taskInk = ['#fff', 'var(--color-parch-100)', 'var(--blue)'];
</script>

<div class="pm">
	<div class="pm__bar">
		<div class="seg">
			<button class:on={workload === 'cpu'} onclick={() => setWorkload('cpu')}>
				CPU-bound (счёт)
			</button>
			<button class:on={workload === 'io'} onclick={() => setWorkload('io')}>
				I/O-bound (ожидание)
			</button>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); t = Math.max(0, t - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); t = Math.min(maxTotal, t + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">t = {Math.min(t, maxTotal)}</span>
		</div>
	</div>

	<div class="pm__hint">
		{workload === 'cpu'
			? 'CPU-bound: задача почти всё время считает. Ускоряют только реальные ядра → процессы. GIL и один поток сериализуют счёт.'
			: 'I/O-bound: задача почти всё время ждёт сеть/диск. Ожидания перекрываются → потоки и async догоняют процессы дешевле.'}
	</div>

	<div class="pm__grid">
		{#each MODELS as m, mi}
			{@const s = schedules[mi]}
			<div class="card" class:win={mi === fastest}>
				<div class="card__head">
					<div class="ttl">
						<b>{m.title}</b><code>{m.sub}</code>
					</div>
					{#if mi === fastest}<span class="badge">быстрее всех</span>{/if}
				</div>

				<svg viewBox="0 0 {chartW} {chartH(s)}" class="chart" preserveAspectRatio="xMinYMin meet">
					<!-- сетка тактов -->
					{#each Array(maxTotal) as _, k}
						<line
							class="grid"
							x1={LX + k * CW} y1={TOP}
							x2={LX + k * CW} y2={TOP + s.lanes.length * (CH + GAP) - GAP}
						/>
					{/each}

					{#each s.lanes as lane, li}
						{@const y = TOP + li * (CH + GAP)}
						<text class="lane-lbl" x={LX - 6} y={y + CH / 2} dy="0.32em">{s.laneLabels[li]}</text>
						<rect class="lane-bg" x={LX} y={y} width={maxTotal * CW} height={CH} rx="3" />
						{#each lane as cell, k}
							{#if cell && k < t}
								<g class="cell {cell.kind}">
									<rect
										x={LX + k * CW + 1.5} y={y + 1.5}
										width={CW - 3} height={CH - 3} rx="2.5"
										style="fill: {cell.kind === 'io' ? 'transparent' : taskColor[cell.task]};
											stroke: {taskColor[cell.task]};
											stroke-dasharray: {cell.kind === 'io' ? '3 2' : 'none'}"
									/>
									<text
										x={LX + k * CW + CW / 2} y={y + CH / 2} dy="0.32em"
										style="fill: {cell.kind === 'io' ? taskColor[cell.task] : taskInk[cell.task]}"
									>{cell.kind === 'io' ? 'I/O' : 'T' + (cell.task + 1)}</text>
								</g>
							{/if}
						{/each}
					{/each}

					<!-- ось времени -->
					<line class="axis" x1={LX} y1={axisY(s)} x2={LX + maxTotal * CW} y2={axisY(s)} />
					<text class="tlbl" x={LX} y={axisY(s) + 11}>0</text>
					<text class="tlbl end" x={LX + s.total * CW} y={axisY(s) + 11}>{s.total}</text>
					<text class="tunit" x={LX + maxTotal * CW} y={axisY(s) + 11}>время →</text>
				</svg>

				<div class="card__foot">
					<div class="metric">
						<span class="ml">время</span><b>{s.total} ед.</b>
						<span class="ml">ускорение</span><b class="sp">{s.speedup}</b>
					</div>
					<div class="mem">{m.mem}</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="pm__legend">
		<span><i class="sw fill" style="background: var(--blue)"></i> CPU-такт (счёт)</span>
		<span><i class="sw dash"></i> I/O-такт (ожидание)</span>
		<span class="muted">T1 · T2 · T3 — задачи. На общем лейне такты идут по очереди.</span>
	</div>
</div>

<style>
	.pm {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.pm__bar {
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
	.pm__hint {
		padding: 0.6rem 0.9rem;
		font-size: 0.82rem;
		color: var(--color-parch-200);
		background: var(--color-ink-800);
		border-bottom: 1.5px solid var(--color-ink-600);
		border-left: 3px solid var(--blue);
	}
	.pm__grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		padding: 0.9rem;
	}
	.card {
		flex: 1 1 280px;
		min-width: 260px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.7rem;
		border: 1.5px solid var(--color-ink-600);
		border-radius: 11px;
		background: var(--color-ink-800);
		transition: border-color 0.2s, box-shadow 0.2s;
	}
	.card.win {
		border-color: var(--blue);
		box-shadow: 0 0 0 1.5px var(--blue);
	}
	.card__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}
	.ttl {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
	}
	.ttl b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.96rem;
		color: var(--color-parch-100);
	}
	.ttl code {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
	}
	.badge {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #fff;
		background: var(--blue);
		padding: 0.18rem 0.4rem;
		border-radius: 5px;
		white-space: nowrap;
	}
	.chart {
		width: 100%;
		height: auto;
	}
	.grid {
		stroke: var(--color-ink-700);
		stroke-width: 1;
	}
	.lane-bg {
		fill: var(--color-ink-850);
	}
	.lane-lbl {
		text-anchor: end;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.cell rect {
		stroke-width: 1.5;
		transition: opacity 0.15s;
	}
	.cell text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.58rem;
	}
	.axis {
		stroke: var(--color-ink-500);
		stroke-width: 1;
	}
	.tlbl {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
		text-anchor: middle;
	}
	.tlbl.end {
		fill: var(--blue);
		font-weight: 700;
	}
	.tunit {
		font-family: var(--font-mono);
		font-size: 0.54rem;
		fill: var(--color-parch-muted);
		text-anchor: end;
	}
	.card__foot {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: auto;
	}
	.metric {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.15rem 0.5rem;
		align-items: baseline;
		font-size: 0.76rem;
	}
	.ml {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.metric b {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-parch-100);
	}
	.metric b.sp {
		color: var(--blue);
		font-size: 0.74rem;
	}
	.mem {
		font-size: 0.74rem;
		color: var(--color-parch-200);
		padding: 0.4rem 0.5rem;
		background: var(--color-ink-850);
		border-radius: 7px;
		border-left: 2.5px solid var(--color-ink-500);
	}
	.pm__legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1rem;
		align-items: center;
		padding: 0.55rem 0.9rem 0.8rem;
		border-top: 1.5px solid var(--color-ink-600);
		font-size: 0.72rem;
		color: var(--color-parch-200);
		font-family: var(--font-mono);
	}
	.pm__legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.pm__legend .muted {
		color: var(--color-parch-muted);
	}
	.sw {
		display: inline-block;
		width: 0.85rem;
		height: 0.7rem;
		border-radius: 2px;
	}
	.sw.fill {
		border: 1.5px solid var(--blue);
	}
	.sw.dash {
		border: 1.5px dashed var(--blue);
		background: transparent;
	}
</style>
