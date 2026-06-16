<script lang="ts">
	// Interactive activity-selection (greedy interval scheduling) on a time axis.
	// Activities are horizontal segments [start, finish]. We sort by the chosen
	// criterion, then greedily take an activity whenever start >= last_finish,
	// graying out the ones that overlap. Criterion toggle shows that only
	// "самый ранний конец" is optimal; the other two land on a suboptimum.
	// Step / play / reset, pure inline SVG, no deps.
	type Act = { id: string; s: number; f: number };
	type Crit = 'finish' | 'short' | 'start';
	type Step = {
		// how many activities of the sorted order have been processed
		taken: Set<string>;
		rejected: Set<string>;
		current: string | null; // activity examined at this step
		accepted: boolean | null; // decision for `current`
		lastFinish: number | null; // greedy barrier (vertical line)
		note: string;
	};

	// Tuned demo: all three criteria give a visibly different result.
	//   finish (верно): B,D,F → 3 (оптимум)
	//   short  (неверно): C,E → 2  (короткая C посередине губит B и D)
	//   start  (неверно): A,E → 2  (длинная A стартует первой и всё блокирует)
	const acts: Act[] = [
		{ id: 'A', s: 0, f: 6 },
		{ id: 'B', s: 1, f: 4 },
		{ id: 'C', s: 3, f: 5 },
		{ id: 'D', s: 4, f: 7 },
		{ id: 'E', s: 6, f: 9 },
		{ id: 'F', s: 8, f: 11 }
	];
	const T_MIN = 0;
	const T_MAX = 11;

	const CRITS: { id: Crit; label: string; ok: boolean }[] = [
		{ id: 'finish', label: 'самый ранний конец', ok: true },
		{ id: 'short', label: 'самый короткий', ok: false },
		{ id: 'start', label: 'раньше начинается', ok: false }
	];

	function sorted(crit: Crit): Act[] {
		const a = [...acts];
		if (crit === 'finish') a.sort((x, y) => x.f - y.f || x.s - y.s);
		else if (crit === 'short') a.sort((x, y) => x.f - x.s - (y.f - y.s) || x.f - y.f);
		else a.sort((x, y) => x.s - y.s || x.f - y.f);
		return a;
	}

	function buildSteps(crit: Crit): Step[] {
		const order = sorted(crit);
		const steps: Step[] = [];
		const taken = new Set<string>();
		const rejected = new Set<string>();
		let last: number | null = null;
		const critName = CRITS.find((c) => c.id === crit)!.label;
		steps.push({
			taken: new Set(),
			rejected: new Set(),
			current: null,
			accepted: null,
			lastFinish: null,
			note: `Сортируем по критерию «${critName}». Порядок: ${order.map((a) => a.id).join(' · ')}`
		});
		for (const a of order) {
			const ok = last === null || a.s >= last;
			if (ok) {
				taken.add(a.id);
				last = a.f;
			} else {
				rejected.add(a.id);
			}
			steps.push({
				taken: new Set(taken),
				rejected: new Set(rejected),
				current: a.id,
				accepted: ok,
				lastFinish: last,
				note: ok
					? `Берём ${a.id} [${a.s};${a.f}] — совместима. Фиксируем last_finish = ${a.f}.`
					: `${a.id} [${a.s};${a.f}] пересекается (начало ${a.s} < last_finish ${last}) — гасим.`
			});
		}
		const cnt = taken.size;
		const opt = buildOptimal();
		steps.push({
			taken: new Set(taken),
			rejected: new Set(rejected),
			current: null,
			accepted: null,
			lastFinish: last,
			note:
				cnt === opt
					? `Готово: набрали ${cnt} совместимых заявок — это оптимум.`
					: `Готово: набрали лишь ${cnt}. Жадность по этому критерию НЕ оптимальна (оптимум — ${opt}).`
		});
		return steps;
	}

	// optimal count = greedy by earliest finish (доказуемо оптимальный)
	function buildOptimal(): number {
		const order = sorted('finish');
		let last: number | null = null;
		let cnt = 0;
		for (const a of order) {
			if (last === null || a.s >= last) {
				cnt += 1;
				last = a.f;
			}
		}
		return cnt;
	}

	let crit = $state<Crit>('finish');
	let idx = $state(0);
	let playing = $state(false);
	const steps = $derived(buildSteps(crit));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);
	const optimal = buildOptimal();
	const isOptimal = $derived(cur.taken.size === optimal && idx === steps.length - 1);
	const order = $derived(sorted(crit));

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
	function setCrit(c: Crit) {
		crit = c;
		reset();
	}

	// ---- geometry ----
	const PAD_L = 40;
	const PAD_R = 14;
	const W = 420;
	const AXIS_Y = 248;
	const ROW_TOP = 40;
	const ROW_H = 28;
	const BAR_H = 16;
	const tx = (t: number) => PAD_L + ((t - T_MIN) / (T_MAX - T_MIN)) * (W - PAD_L - PAD_R);
	// each activity gets a fixed lane (row) by its original order for stable layout
	const lane = (id: string) => acts.findIndex((a) => a.id === id);
	const rowY = (id: string) => ROW_TOP + lane(id) * ROW_H;

	function actState(id: string): string {
		if (cur.current === id) return cur.accepted ? 'take-cur' : 'rej-cur';
		if (cur.taken.has(id)) return 'taken';
		if (cur.rejected.has(id)) return 'rejected';
		return 'idle';
	}
	const ticks = [0, 2, 4, 6, 8, 10, 11];
</script>

<div class="gv">
	<div class="gv__bar">
		<div class="seg">
			{#each CRITS as c}
				<button class:on={crit === c.id} onclick={() => setCrit(c.id)} title={c.ok ? 'оптимальный критерий' : 'неоптимальный критерий'}>
					{c.label}{c.ok ? ' ✓' : ''}
				</button>
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

	<div class="gv__body">
		<svg viewBox="0 0 420 290" class="gv__svg">
			<!-- last_finish barrier -->
			{#if cur.lastFinish !== null}
				<line class="barrier" x1={tx(cur.lastFinish)} y1={ROW_TOP - 14} x2={tx(cur.lastFinish)} y2={AXIS_Y} />
				<text class="barrier-lbl" x={tx(cur.lastFinish)} y={ROW_TOP - 18} text-anchor="middle">last_finish={cur.lastFinish}</text>
			{/if}

			<!-- time axis -->
			<line class="axis" x1={PAD_L} y1={AXIS_Y} x2={W - PAD_R} y2={AXIS_Y} />
			{#each ticks as t}
				<line class="tick" x1={tx(t)} y1={AXIS_Y} x2={tx(t)} y2={AXIS_Y + 5} />
				<text class="tick-lbl" x={tx(t)} y={AXIS_Y + 16} text-anchor="middle">{t}</text>
			{/each}
			<text class="axis-lbl" x={W - PAD_R} y={AXIS_Y + 28} text-anchor="end">время</text>

			<!-- activity bars -->
			{#each acts as a}
				{@const y = rowY(a.id)}
				<g class="act {actState(a.id)}">
					<rect class="track" x={PAD_L} y={y + (ROW_H - BAR_H) / 2} width={W - PAD_L - PAD_R} height={BAR_H} rx="4" />
					<rect
						class="bar"
						x={tx(a.s)}
						y={y + (ROW_H - BAR_H) / 2}
						width={Math.max(tx(a.f) - tx(a.s), 2)}
						height={BAR_H}
						rx="4"
					/>
					<text class="bar-id" x={(tx(a.s) + tx(a.f)) / 2} y={y + ROW_H / 2} dy="0.34em" text-anchor="middle">{a.id}</text>
					<text class="row-lbl" x={PAD_L - 6} y={y + ROW_H / 2} dy="0.32em" text-anchor="end">{a.id}</text>
				</g>
			{/each}
		</svg>

		<div class="gv__panel">
			<div class="row">
				<span class="lbl">Порядок (сортировка)</span>
				<div class="chips">
					{#each order as a}
						<span class="chip" class:done={cur.taken.has(a.id) || cur.rejected.has(a.id)} class:now={cur.current === a.id}>{a.id}</span>
					{/each}
				</div>
			</div>
			<div class="row">
				<span class="lbl">Выбранные заявки</span>
				<div class="chips">
					{#each acts.filter((a) => cur.taken.has(a.id)) as a}
						<span class="chip v">{a.id}</span>
					{:else}
						<span class="empty">—</span>
					{/each}
				</div>
			</div>
			<div class="stat">
				<span>совместимых</span>
				<b class:bad={idx === steps.length - 1 && !isOptimal}>{cur.taken.size}</b>
				<span class="opt">оптимум {optimal}</span>
			</div>
			<div class="note" class:warn={idx === steps.length - 1 && !isOptimal}>{cur.note}</div>
		</div>
	</div>
</div>

<style>
	.gv {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.gv__bar {
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
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		padding: 0.32rem 0.6rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.seg button.on {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
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
	.gv__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.gv__svg {
		flex: 1 1 340px;
		min-width: 300px;
		max-width: 480px;
		height: auto;
	}
	.axis {
		stroke: var(--color-ink-500);
		stroke-width: 2;
	}
	.tick {
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
	}
	.tick-lbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
	}
	.axis-lbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
	}
	.barrier {
		stroke: var(--blue);
		stroke-width: 2;
		stroke-dasharray: 4 3;
		transition: x1 0.3s, x2 0.3s;
	}
	.barrier-lbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--blue);
		font-weight: 700;
	}
	.act .track {
		fill: var(--color-ink-800);
	}
	.act .bar {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.25s, stroke 0.25s, opacity 0.25s;
	}
	.act .bar-id {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.72rem;
		fill: var(--color-parch-100);
		transition: fill 0.25s;
	}
	.act .row-lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		fill: var(--color-parch-muted);
	}
	/* greedily taken */
	.act.taken .bar,
	.act.take-cur .bar {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.act.taken .bar-id,
	.act.take-cur .bar-id {
		fill: #fff;
	}
	.act.take-cur .bar {
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	/* rejected (overlapping) → grayed out */
	.act.rejected .bar,
	.act.rej-cur .bar {
		fill: var(--color-ink-700);
		stroke: var(--color-ink-500);
		opacity: 0.55;
	}
	.act.rejected .bar-id,
	.act.rej-cur .bar-id {
		fill: var(--color-parch-muted);
	}
	.act.rej-cur .bar {
		stroke: var(--color-parch-muted);
		stroke-width: 3.5;
		opacity: 0.85;
	}
	.gv__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
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
		border: 1.5px solid var(--color-ink-500);
		color: var(--color-parch-200);
		background: transparent;
		transition: all 0.2s;
	}
	.chip.done {
		opacity: 0.45;
	}
	.chip.now {
		border-color: var(--blue);
		color: var(--blue);
		opacity: 1;
	}
	.chip.v {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
		opacity: 1;
	}
	.empty {
		color: var(--color-parch-muted);
	}
	.stat {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.stat b {
		font-family: var(--font-display);
		font-size: 1.3rem;
		color: var(--blue);
		letter-spacing: 0;
	}
	.stat b.bad {
		color: var(--color-parch-muted);
	}
	.stat .opt {
		margin-left: auto;
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
	.note.warn {
		border-left-color: var(--color-parch-muted);
	}
</style>
