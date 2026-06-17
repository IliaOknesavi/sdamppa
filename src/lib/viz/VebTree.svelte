<script lang="ts">
	// Дерево ван Эмде Боаса над вселенной u = 16. Корень разбит на √u = 4
	// кластера по 4 элемента + summary (какие кластеры непусты). В каждом
	// узле хранятся min и max. Демонстрируем successor(x) за O(log log u)
	// переходов: high → проверка max кластера → low внутри кластера ИЛИ
	// summary.successor → min следующего кластера. Подсветка пути запроса.
	// Чистый инлайн SVG, без внешних импортов. Svelte 5 руны.

	const U = 16; // размер вселенной
	const SQRT = 4; // √u — размер кластера и число кластеров

	// встроенные демо-данные: множество хранимых ключей
	const KEYS = [1, 2, 4, 6, 9, 13, 14];
	const keySet = new Set(KEYS);

	const hi = (x: number) => Math.floor(x / SQRT);
	const lo = (x: number) => x % SQRT;
	const idx = (h: number, l: number) => h * SQRT + l;

	// min/max каждого кластера (или null, если кластер пуст)
	type MM = { min: number; max: number } | null;
	function clusterMM(h: number): MM {
		const vals: number[] = [];
		for (let l = 0; l < SQRT; l++) if (keySet.has(idx(h, l))) vals.push(l);
		if (!vals.length) return null;
		return { min: Math.min(...vals), max: Math.max(...vals) };
	}
	const clusters: MM[] = [0, 1, 2, 3].map(clusterMM);
	// summary: какие кластеры непусты, плюс его собственные min/max
	const summaryBits = clusters.map((c) => (c ? 1 : 0));
	const summaryMM: MM = (() => {
		const present = summaryBits.map((b, i) => (b ? i : -1)).filter((i) => i >= 0);
		return present.length ? { min: present[0], max: present[present.length - 1] } : null;
	})();
	const rootMM: MM = KEYS.length ? { min: Math.min(...KEYS), max: Math.max(...KEYS) } : null;

	type Phase = 'high' | 'low' | 'summary' | 'cluster' | 'done' | 'nope';
	type Step = {
		phase: Phase;
		hiNode: number | null; // подсвеченный кластер
		summaryNode: number | null; // подсвеченный бит summary
		cell: number | null; // подсвеченная ячейка-результат
		note: string;
	};

	// корректный successor(x): наименьший хранимый ключ > x (или null)
	function buildSteps(x: number): { steps: Step[]; answer: number | null } {
		const steps: Step[] = [];
		const h = hi(x), l = lo(x);
		steps.push({
			phase: 'high', hiNode: h, summaryNode: null, cell: x,
			note: `high(${x}) = ⌊${x}/4⌋ = ${h}, low(${x}) = ${x} mod 4 = ${l}. Идём в кластер ${h}.`
		});
		const c = clusters[h];
		// случай 1: преемник лежит в том же кластере
		if (c !== null && l < c.max) {
			// найдём наименьший low' > l внутри кластера h
			let succLow = -1;
			for (let ll = l + 1; ll < SQRT; ll++) {
				if (keySet.has(idx(h, ll))) { succLow = ll; break; }
			}
			const ans = idx(h, succLow);
			steps.push({
				phase: 'low', hiNode: h, summaryNode: null, cell: x,
				note: `max кластера ${h} = ${c.max} > low = ${l}. Преемник в том же кластере.`
			});
			steps.push({
				phase: 'cluster', hiNode: h, summaryNode: null, cell: ans,
				note: `successor низа: low' = ${succLow}. Ответ = high·4 + low' = ${h}·4 + ${succLow} = ${ans}.`
			});
			steps.push({
				phase: 'done', hiNode: h, summaryNode: null, cell: ans,
				note: `successor(${x}) = ${ans}. Достигнут за O(log log u) переходов.`
			});
			return { steps, answer: ans };
		}
		// случай 2: в кластере нет элементов > x → ищем следующий кластер по summary
		steps.push({
			phase: 'summary', hiNode: h, summaryNode: h, cell: x,
			note: c === null
				? `Кластер ${h} пуст. Спрашиваем summary: какой кластер после ${h} непуст?`
				: `max кластера ${h} = ${c.max} ≤ low = ${l}. Преемника тут нет → идём в summary.`
		});
		// successor бита h в summary
		let nextH = -1;
		for (let hh = h + 1; hh < SQRT; hh++) {
			if (summaryBits[hh]) { nextH = hh; break; }
		}
		if (nextH === -1) {
			steps.push({
				phase: 'nope', hiNode: null, summaryNode: null, cell: null,
				note: `В summary нет непустых кластеров после ${h}. successor(${x}) = ∞ (нет преемника).`
			});
			return { steps, answer: null };
		}
		steps.push({
			phase: 'summary', hiNode: nextH, summaryNode: nextH, cell: null,
			note: `summary.successor(${h}) = ${nextH}: ближайший непустой кластер — ${nextH}.`
		});
		const ans = idx(nextH, clusters[nextH]!.min);
		steps.push({
			phase: 'cluster', hiNode: nextH, summaryNode: nextH, cell: ans,
			note: `Берём min кластера ${nextH} = ${clusters[nextH]!.min}. Ответ = ${nextH}·4 + ${clusters[nextH]!.min} = ${ans}.`
		});
		steps.push({
			phase: 'done', hiNode: nextH, summaryNode: null, cell: ans,
			note: `successor(${x}) = ${ans}. Два уровня → O(log log u) переходов.`
		});
		return { steps, answer: ans };
	}

	let x = $state(6);
	let stepIdx = $state(0);
	let playing = $state(false);

	const result = $derived(buildSteps(x));
	const steps = $derived(result.steps);
	const cur = $derived(steps[Math.min(stepIdx, steps.length - 1)]);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (stepIdx >= steps.length - 1) { stop(); return; }
			stepIdx += 1;
		}, 950);
	}
	function reset() {
		stop();
		stepIdx = 0;
	}
	function setX(v: number) {
		x = v;
		reset();
	}

	// геометрия SVG
	const CW = 78; // ширина блока кластера
	const cellW = CW / SQRT;

	function cellState(globalIndex: number): string {
		const present = keySet.has(globalIndex);
		if (cur.cell === globalIndex) return present ? 'hit' : 'hitempty';
		return present ? 'full' : 'empty';
	}
</script>

<div class="vb">
	<div class="vb__bar">
		<div class="xpick">
			<span class="lbl">successor(x), x =</span>
			<div class="seg">
				{#each [1, 3, 6, 7, 11, 14] as v}
					<button class:on={x === v} onclick={() => setX(v)}>{v}</button>
				{/each}
			</div>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); stepIdx = Math.max(0, stepIdx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); stepIdx = Math.min(steps.length - 1, stepIdx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{stepIdx}/{steps.length - 1}</span>
		</div>
	</div>

	<div class="vb__body">
		<svg viewBox="0 0 420 290" class="vb__svg" preserveAspectRatio="xMidYMid meet">
			<!-- корень -->
			<g class="rootbox" class:on={true}>
				<rect x="150" y="8" width="120" height="34" rx="8" />
				<text x="210" y="20" class="ttl">vEB(16) · корень</text>
				<text x="210" y="34" class="mm">min={rootMM ? rootMM.min : '∅'} · max={rootMM ? rootMM.max : '∅'}</text>
			</g>

			<!-- summary -->
			<g class="sumbox">
				<rect x="20" y="78" width="106" height="46" rx="8"
					class:active={cur.phase === 'summary'} />
				<text x="73" y="91" class="ttl">summary</text>
				{#each [0, 1, 2, 3] as b}
					<g class="sbit {summaryBits[b] ? 'full' : 'empty'}" class:hit={cur.summaryNode === b}>
						<rect x={28 + b * 22} y="98" width="18" height="18" rx="4" />
						<text x={28 + b * 22 + 9} y="107" dy="0.32em">{summaryBits[b]}</text>
					</g>
				{/each}
			</g>
			<!-- связь корень → summary -->
			<line x1="180" y1="42" x2="73" y2="78" class="link" class:on={cur.phase === 'summary'} />

			<!-- 4 кластера -->
			{#each [0, 1, 2, 3] as h}
				{@const bx = 18 + h * 99}
				<line x1="230" y1="42" x2={bx + CW / 2} y2="150" class="link"
					class:on={cur.hiNode === h} />
				<g class="cbox" class:active={cur.hiNode === h}>
					<rect x={bx} y="150" width={CW} height="50" rx="8" />
					<text x={bx + CW / 2} y="162" class="ttl">кластер {h}</text>
					{#each [0, 1, 2, 3] as l}
						{@const gi = idx(h, l)}
						<g class="cell {cellState(gi)}">
							<rect x={bx + l * cellW + 1} y="168" width={cellW - 2} height="20" rx="3" />
							<text x={bx + l * cellW + cellW / 2} y="178" dy="0.32em">{gi}</text>
						</g>
					{/each}
					<text x={bx + CW / 2} y="196" class="mm">
						{clusters[h] ? `min=${clusters[h]!.min} max=${clusters[h]!.max}` : 'пуст'}
					</text>
				</g>
			{/each}

			<!-- легенда -->
			<g class="legend">
				<rect x="20" y="222" width="12" height="12" rx="3" class="lg-full" />
				<text x="38" y="232">ключ есть</text>
				<rect x="120" y="222" width="12" height="12" rx="3" class="lg-empty" />
				<text x="138" y="232">пусто</text>
				<rect x="200" y="222" width="12" height="12" rx="3" class="lg-hit" />
				<text x="218" y="232">путь запроса</text>
			</g>
		</svg>

		<div class="vb__panel">
			<div class="phases">
				{#each [['high', 'high/low'], ['low', 'max кластера'], ['summary', 'summary'], ['cluster', 'min/low'], ['done', 'ответ']] as [p, label]}
					<span class="ph" class:active={cur.phase === p}>{label}</span>
				{/each}
			</div>
			<div class="answer">
				<span class="lbl">результат</span>
				<b>{result.answer === null ? 'нет (∞)' : `successor(${x}) = ${result.answer}`}</b>
			</div>
			<div class="note">{cur.note}</div>
			<div class="hint">
				u = 16 → √u = 4 кластера. min/max в каждом узле дают O(1)-ответ на крайних случаях,
				а спуск high→(low | summary→min) — это O(log log u).
			</div>
		</div>
	</div>
</div>

<style>
	.vb {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.vb__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.xpick {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.xpick .lbl {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
	}
	.seg {
		display: flex;
		gap: 0.25rem;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		min-width: 1.9rem;
		padding: 0.3rem 0.5rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.seg button:hover { border-color: var(--blue); color: var(--blue); }
	.seg button.on { background: var(--blue); color: #fff; border-color: var(--blue); }
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
	.ctrl button:hover { border-color: var(--blue); color: var(--blue); }
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}
	.vb__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.vb__svg {
		flex: 1 1 360px;
		min-width: 300px;
		max-width: 470px;
		height: auto;
	}

	/* связи */
	.link {
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		transition: stroke 0.25s, stroke-width 0.25s;
	}
	.link.on {
		stroke: var(--blue);
		stroke-width: 2.5;
	}

	/* корень */
	.rootbox rect {
		fill: var(--color-ink-800);
		stroke: var(--blue);
		stroke-width: 2;
	}
	.ttl {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.6rem;
		fill: var(--color-parch-100);
	}
	.mm {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.52rem;
		fill: var(--color-parch-muted);
	}

	/* summary */
	.sumbox rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		transition: stroke 0.25s;
	}
	.sumbox rect.active {
		stroke: var(--blue);
		stroke-width: 2.5;
	}
	.sbit rect {
		stroke-width: 1.5;
		transition: fill 0.2s, stroke 0.2s;
	}
	.sbit text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
	}
	.sbit.full rect { fill: var(--blue-pale); stroke: var(--blue); }
	.sbit.full text { fill: var(--blue); }
	.sbit.empty rect { fill: var(--color-ink-700); stroke: var(--color-ink-600); }
	.sbit.empty text { fill: var(--color-parch-muted); }
	.sbit.hit rect { fill: var(--blue); stroke: var(--color-parch-100); stroke-width: 2.5; }
	.sbit.hit text { fill: #fff; }

	/* кластеры */
	.cbox > rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		transition: stroke 0.25s;
	}
	.cbox.active > rect {
		stroke: var(--blue);
		stroke-width: 2.5;
	}
	.cell rect {
		stroke-width: 1;
		transition: fill 0.2s, stroke 0.2s;
	}
	.cell text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		font-weight: 700;
	}
	.cell.empty rect { fill: var(--color-ink-700); stroke: var(--color-ink-600); }
	.cell.empty text { fill: var(--color-parch-muted); }
	.cell.full rect { fill: var(--blue-pale); stroke: var(--blue); }
	.cell.full text { fill: var(--blue); }
	.cell.hit rect { fill: var(--blue); stroke: var(--color-parch-100); stroke-width: 2; }
	.cell.hit text { fill: #fff; }
	.cell.hitempty rect { fill: var(--color-ink-600); stroke: var(--color-parch-100); stroke-width: 2; }
	.cell.hitempty text { fill: var(--color-parch-100); }

	/* легенда */
	.legend text {
		font-family: var(--font-mono);
		font-size: 0.54rem;
		fill: var(--color-parch-muted);
		dominant-baseline: middle;
	}
	.legend .lg-full { fill: var(--blue-pale); stroke: var(--blue); stroke-width: 1; }
	.legend .lg-empty { fill: var(--color-ink-700); stroke: var(--color-ink-600); stroke-width: 1; }
	.legend .lg-hit { fill: var(--blue); stroke: var(--color-parch-100); stroke-width: 1; }

	/* панель */
	.vb__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.phases {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
	.ph {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.22rem 0.4rem;
		border-radius: 5px;
		background: var(--color-ink-800);
		color: var(--color-parch-muted);
		border: 1px solid var(--color-ink-600);
	}
	.ph.active {
		background: var(--blue);
		color: #fff;
		border-color: var(--blue);
	}
	.answer {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.5rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border: 1.5px solid var(--color-ink-600);
	}
	.answer .lbl {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
	}
	.answer b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.92rem;
		color: var(--blue);
	}
	.note {
		font-size: 0.82rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.hint {
		margin-top: auto;
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		line-height: 1.45;
	}
</style>
