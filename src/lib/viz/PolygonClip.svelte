<script lang="ts">
	// Sutherland–Hodgman polygon clipping against a rectangular window.
	// Step through the 4 window edges; for each edge keep points inside the
	// half-plane and add intersection points where polygon edges cross the
	// boundary. Result = polygon ∩ window. Pure SVG, no deps; same visual
	// language as GraphTraversal / GraphTypes.
	type P = { x: number; y: number };

	// rectangular clip window (in SVG coords)
	const win = { left: 120, right: 320, top: 70, bottom: 220 };

	// source polygon — deliberately pokes out of every side of the window
	const subject: P[] = [
		{ x: 80, y: 130 },
		{ x: 200, y: 40 },
		{ x: 360, y: 110 },
		{ x: 300, y: 200 },
		{ x: 350, y: 260 },
		{ x: 150, y: 250 }
	];

	// the four clipping edges, each as an "inside" test + a segment intersector.
	// order: левая → правая → нижняя → верхняя граница окна
	type Edge = {
		key: string;
		label: string;
		// is point p inside the half-plane defined by this edge?
		inside: (p: P) => boolean;
		// intersection of segment a→b with the (infinite) edge line
		cut: (a: P, b: P) => P;
		// guide line endpoints for drawing the active boundary
		line: { x1: number; y1: number; x2: number; y2: number };
	};

	function lerpX(a: P, b: P, x: number): P {
		const t = (x - a.x) / (b.x - a.x);
		return { x, y: a.y + t * (b.y - a.y) };
	}
	function lerpY(a: P, b: P, y: number): P {
		const t = (y - a.y) / (b.y - a.y);
		return { x: a.x + t * (b.x - a.x), y };
	}

	const edges: Edge[] = [
		{
			key: 'left',
			label: 'левая граница (x ≥ ' + win.left + ')',
			inside: (p) => p.x >= win.left,
			cut: (a, b) => lerpX(a, b, win.left),
			line: { x1: win.left, y1: 30, x2: win.left, y2: 270 }
		},
		{
			key: 'right',
			label: 'правая граница (x ≤ ' + win.right + ')',
			inside: (p) => p.x <= win.right,
			cut: (a, b) => lerpX(a, b, win.right),
			line: { x1: win.right, y1: 30, x2: win.right, y2: 270 }
		},
		{
			key: 'bottom',
			label: 'нижняя граница (y ≤ ' + win.bottom + ')',
			inside: (p) => p.y <= win.bottom,
			cut: (a, b) => lerpY(a, b, win.bottom),
			line: { x1: 70, y1: win.bottom, x2: 380, y2: win.bottom }
		},
		{
			key: 'top',
			label: 'верхняя граница (y ≥ ' + win.top + ')',
			inside: (p) => p.y >= win.top,
			cut: (a, b) => lerpY(a, b, win.top),
			line: { x1: 70, y1: win.top, x2: 380, y2: win.top }
		}
	];

	type Stage = {
		// polygon entering this stage (before clipping by this edge)
		input: P[];
		// polygon after clipping by this edge
		output: P[];
		// indices into output[] that are freshly-added intersection points
		addedIdx: number[];
		edge: Edge;
		note: string;
	};

	// Run Sutherland–Hodgman, recording one Stage per window edge.
	function buildStages(): Stage[] {
		const out: Stage[] = [];
		let poly = subject;
		for (const e of edges) {
			const result: P[] = [];
			const addedIdx: number[] = [];
			let added = 0;
			const n = poly.length;
			for (let i = 0; i < n; i++) {
				const cur = poly[i];
				const prev = poly[(i - 1 + n) % n];
				const curIn = e.inside(cur);
				const prevIn = e.inside(prev);
				if (curIn) {
					// рёбра prev→cur: если входим внутрь, добавляем точку пересечения
					if (!prevIn) {
						result.push(e.cut(prev, cur));
						addedIdx.push(result.length - 1);
						added++;
					}
					result.push(cur);
				} else if (prevIn) {
					// выходим наружу — добавляем точку пересечения
					result.push(e.cut(prev, cur));
					addedIdx.push(result.length - 1);
					added++;
				}
				// оба снаружи → ничего не добавляем
			}
			out.push({
				input: poly,
				output: result,
				addedIdx,
				edge: e,
				note: `Отсекаем по грани «${e.label}»: оставляем вершины внутри, добавляем ${added} точ${added === 1 ? 'ку' : added >= 2 && added <= 4 ? 'ки' : 'ек'} пересечения.`
			});
			poly = result;
		}
		return out;
	}

	const stages = buildStages();
	// step 0 = исходный многоугольник; step k = после k-й грани
	const lastStep = stages.length; // 4

	let step = $state(0);
	let playing = $state(false);

	// the polygon currently drawn as "current result"
	const curPoly = $derived(step === 0 ? subject : stages[step - 1].output);
	// active edge being clipped against (only for steps 1..4)
	const activeStage = $derived(step >= 1 && step <= lastStep ? stages[step - 1] : null);
	const addedSet = $derived(new Set(activeStage ? activeStage.addedIdx : []));

	function ptsAttr(poly: P[]): string {
		return poly.map((p) => `${p.x},${p.y}`).join(' ');
	}

	// classify a point of the *input* polygon for the active edge (inside/outside)
	function inputState(p: P): 'in' | 'out' {
		if (!activeStage) return 'in';
		return activeStage.edge.inside(p) ? 'in' : 'out';
	}

	const note = $derived(
		step === 0
			? 'Исходный многоугольник (синий) и прямоугольное окно (рамка). Отсекаем последовательно по 4 граням.'
			: step === lastStep
				? 'Готово. Результат — пересечение многоугольника с окном: всё, что вне рамки, отброшено.'
				: stages[step - 1].note
	);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (step >= lastStep) {
				stop();
				return;
			}
			step += 1;
		}, 1100);
	}
	function reset() {
		stop();
		step = 0;
	}
</script>

<div class="pc">
	<div class="pc__bar">
		<div class="title">Сазерленд–Ходжман</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); step = Math.max(0, step - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); step = Math.min(lastStep, step + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{step}/{lastStep}</span>
		</div>
	</div>

	<div class="pc__body">
		<svg viewBox="0 0 420 290" class="pc__svg">
			<!-- clip window -->
			<rect
				x={win.left}
				y={win.top}
				width={win.right - win.left}
				height={win.bottom - win.top}
				class="window"
			/>

			<!-- faint outline of the input polygon for this step (before this cut) -->
			{#if activeStage}
				<polygon points={ptsAttr(activeStage.input)} class="ghost" />
			{/if}

			<!-- current result polygon -->
			{#if curPoly.length >= 2}
				<polygon points={ptsAttr(curPoly)} class="poly" class:done={step === lastStep} />
			{/if}

			<!-- active clipping boundary (highlighted edge line) -->
			{#if activeStage}
				<line
					x1={activeStage.edge.line.x1}
					y1={activeStage.edge.line.y1}
					x2={activeStage.edge.line.x2}
					y2={activeStage.edge.line.y2}
					class="boundary"
				/>
			{/if}

			<!-- vertices of the polygon shown for this step -->
			{#if activeStage}
				<!-- show input vertices classified in/out, plus the resulting + added pts -->
				{#each activeStage.input as p}
					<circle cx={p.x} cy={p.y} r="4" class="vtx {inputState(p)}" />
				{/each}
				{#each activeStage.output as p, i}
					{#if addedSet.has(i)}
						<circle cx={p.x} cy={p.y} r="5.5" class="vtx added" />
					{/if}
				{/each}
			{:else}
				{#each curPoly as p}
					<circle cx={p.x} cy={p.y} r="4" class="vtx in" />
				{/each}
			{/if}
		</svg>

		<div class="pc__panel">
			<div class="legend">
				<div class="lg"><span class="sw poly"></span>текущий результат</div>
				<div class="lg"><span class="sw win"></span>окно отсечения</div>
				{#if activeStage}
					<div class="lg"><span class="sw bnd"></span>активная грань</div>
					<div class="lg"><span class="sw added"></span>новая точка пересечения</div>
					<div class="lg"><span class="dot out"></span>вершина снаружи (отбрасывается)</div>
				{/if}
			</div>

			<div class="stages">
				{#each ['исходный', 'левая', 'правая', 'нижняя', 'верхняя'] as label, k}
					<div class="st" class:on={step === k} class:past={step > k}>
						<span class="num">{k}</span>
						<span class="nm">{label}</span>
						{#if k >= 1}<span class="cv">{stages[k - 1].output.length} в.</span>{/if}
					</div>
				{/each}
			</div>

			<div class="note">{note}</div>
		</div>
	</div>
</div>

<style>
	.pc {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.pc__bar {
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
		font-size: 0.85rem;
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
	.pc__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.pc__svg {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 460px;
		height: auto;
	}
	.window {
		fill: var(--color-ink-800);
		stroke: var(--color-parch-muted);
		stroke-width: 2;
		stroke-dasharray: 6 4;
	}
	.ghost {
		fill: none;
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
		stroke-dasharray: 3 3;
	}
	.poly {
		fill: var(--blue-pale);
		fill-opacity: 0.45;
		stroke: var(--blue);
		stroke-width: 2.5;
		stroke-linejoin: round;
		transition: all 0.3s;
	}
	.poly.done {
		fill-opacity: 0.7;
	}
	.boundary {
		stroke: var(--blue);
		stroke-width: 3;
		stroke-dasharray: 2 4;
		stroke-linecap: round;
	}
	.vtx {
		stroke-width: 1.5;
		transition: all 0.2s;
	}
	.vtx.in {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.vtx.out {
		fill: var(--color-ink-850);
		stroke: var(--color-parch-muted);
	}
	.vtx.added {
		fill: var(--color-parch-100);
		stroke: var(--blue);
		stroke-width: 2.5;
	}
	.pc__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
	}
	.lg {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.74rem;
		color: var(--color-parch-200);
	}
	.sw {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 3px;
		flex: none;
	}
	.sw.poly {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.sw.win {
		background: var(--color-ink-800);
		border: 1.5px dashed var(--color-parch-muted);
	}
	.sw.bnd {
		background: var(--blue);
	}
	.sw.added {
		background: var(--color-parch-100);
		border: 2px solid var(--blue);
		border-radius: 50%;
	}
	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		flex: none;
		margin: 0 0.1rem;
	}
	.dot.out {
		background: var(--color-ink-850);
		border: 1.5px solid var(--color-parch-muted);
	}
	.stages {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.st {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.22rem 0.4rem;
		border-radius: 6px;
		font-size: 0.74rem;
		color: var(--color-parch-muted);
		border: 1.5px solid transparent;
	}
	.st.past {
		color: var(--color-parch-200);
	}
	.st.on {
		background: var(--color-ink-800);
		border-color: var(--blue);
		color: var(--color-parch-100);
	}
	.st .num {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		width: 1.1rem;
		height: 1.1rem;
		display: grid;
		place-items: center;
		border-radius: 4px;
		background: var(--color-ink-700);
		color: var(--color-parch-200);
		flex: none;
	}
	.st.on .num {
		background: var(--blue);
		color: #fff;
	}
	.st .nm {
		font-family: var(--font-display);
		font-weight: 700;
		flex: 1;
	}
	.st .cv {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
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
