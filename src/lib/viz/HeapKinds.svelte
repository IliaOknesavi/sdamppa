<script lang="ts">
	// Сравнение видов куч: бинарная (d=2) против d-арной кучи на одном наборе
	// ключей. Слева — дерево выбранной d-арной кучи с анимацией просеивания вниз
	// (sift-down) после извлечения корня; справа — высота дерева и оценки
	// insert O(log_d N) / extract O(d·log_d N), а также мини-таблица асимптотик
	// для бинарной, биномиальной и фибоначчиевой куч. Чистый SVG, без импортов.

	// Один и тот же набор ключей (мультимножество). 12 элементов.
	// Из него строится корректная d-арная min-куча через heapify — поэтому
	// форма дерева меняется с d, а набор значений остаётся одним и тем же.
	const KEYS = [3, 8, 5, 12, 9, 7, 15, 20, 14, 11, 10, 18];
	const N = KEYS.length;

	// Просеять узел i вниз внутри a[0..size) для d-арной кучи.
	function siftDownAt(a: number[], i: number, size: number, base: number) {
		while (true) {
			let mn = i;
			for (let k = 1; k <= base; k++) {
				const c = base * i + k;
				if (c < size && a[c] < a[mn]) mn = c;
			}
			if (mn === i) break;
			[a[i], a[mn]] = [a[mn], a[i]];
			i = mn;
		}
	}

	// Построить корректную d-арную min-кучу из KEYS (классический heapify).
	function heapify(base: number): number[] {
		const a = [...KEYS];
		for (let i = Math.floor((N - 2) / base); i >= 0; i--) siftDownAt(a, i, N, base);
		return a;
	}

	// d — арность d-арной кучи (тумблер/ползунок 2..5).
	let d = $state(3);

	// Шаги анимации просеивания вниз для текущей d-арной кучи.
	type Step = {
		// текущая куча (значения по индексам массива)
		arr: number[];
		// узел, который сейчас «тонет»
		node: number;
		// рассматриваемые потомки (подсветка сравнения)
		children: number[];
		// выбранный наименьший потомок (если есть обмен)
		swap: number | null;
		note: string;
	};

	// log по основанию d.
	const logd = (n: number, base: number) => Math.log(n) / Math.log(base);

	// Высота полного d-арного дерева с n узлами (число уровней − 1).
	function heightOf(n: number, base: number): number {
		if (n <= 1) return 0;
		// уровни: 1, base, base^2, ... — ищем минимальный h, при котором
		// суммарная вместимость (base^(h+1)-1)/(base-1) >= n
		let levels = 0;
		let cap = 0;
		let rowCount = 1;
		while (cap < n) {
			cap += rowCount;
			levels += 1;
			rowCount *= base;
		}
		return levels - 1;
	}

	// Построить шаги одного извлечения минимума (delete-min → sift-down).
	function buildSteps(base: number): Step[] {
		const a = heapify(base);
		const steps: Step[] = [];
		steps.push({
			arr: [...a],
			node: 0,
			children: [],
			swap: null,
			note: `Извлекаем корень (минимум = ${a[0]}). На его место ставим последний ключ ${a[N - 1]}.`
		});
		// корень ← последний элемент, размер логически N-1, но для наглядности
		// оставляем массив той же длины и просеиваем в пределах [0, N-1).
		const last = a[N - 1];
		a[0] = last;
		const size = N - 1; // активная часть кучи после удаления
		let i = 0;
		steps.push({
			arr: a.slice(0, size),
			node: 0,
			children: [],
			swap: null,
			note: `Корень = ${a[0]} нарушает свойство кучи. Просеиваем вниз: сравниваем с ${base} потомками.`
		});
		// sift-down: на каждом уровне ищем минимум среди d потомков
		while (true) {
			const kids = Array.from({ length: base }, (_, k) => base * i + k + 1).filter(
				(c) => c < size
			);
			if (kids.length === 0) {
				steps.push({
					arr: a.slice(0, size),
					node: i,
					children: [],
					swap: null,
					note: `${a[i]} достиг листа — просеивание завершено. Свойство кучи восстановлено.`
				});
				break;
			}
			let mn = kids[0];
			for (const c of kids) if (a[c] < a[mn]) mn = c;
			steps.push({
				arr: a.slice(0, size),
				node: i,
				children: kids,
				swap: a[mn] < a[i] ? mn : null,
				note: `Среди ${kids.length} потомков минимум = ${a[mn]}.${
					a[mn] < a[i] ? ` Это меньше ${a[i]} → меняем местами.` : ` Это не меньше ${a[i]} → стоп.`
				}`
			});
			if (a[mn] < a[i]) {
				[a[i], a[mn]] = [a[mn], a[i]];
				i = mn;
				steps.push({
					arr: a.slice(0, size),
					node: i,
					children: [],
					swap: null,
					note: `Обмен выполнен. Ключ опустился на уровень ниже — продолжаем.`
				});
			} else {
				steps.push({
					arr: a.slice(0, size),
					node: i,
					children: [],
					swap: null,
					note: `Потомки не меньше — просеивание завершено. Свойство кучи восстановлено.`
				});
				break;
			}
		}
		return steps;
	}

	let idx = $state(0);
	let playing = $state(false);
	const steps = $derived(buildSteps(d));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// Размер активной части на текущем шаге.
	const activeSize = $derived(cur.arr.length);

	// Раскладка узлов d-арного дерева по уровням (для активной части).
	type LayNode = { i: number; x: number; y: number };
	const VW = 250;
	const layout = $derived.by<LayNode[]>(() => {
		const size = activeSize;
		const base = d;
		// сгруппировать индексы по уровням
		const levels: number[][] = [];
		let start = 0;
		let rowCount = 1;
		while (start < size) {
			const row: number[] = [];
			for (let k = start; k < Math.min(start + rowCount, size); k++) row.push(k);
			levels.push(row);
			start += rowCount;
			rowCount *= base;
		}
		const H = levels.length;
		const topY = 26;
		const dy = H > 1 ? Math.min(58, (236 - topY) / (H - 1)) : 0;
		const out: LayNode[] = [];
		for (let l = 0; l < H; l++) {
			const row = levels[l];
			const n = row.length;
			for (let j = 0; j < n; j++) {
				const x = ((j + 1) / (n + 1)) * VW;
				out.push({ i: row[j], x, y: topY + l * dy });
			}
		}
		return out;
	});
	const posOf = $derived.by(() => {
		const m = new Map<number, LayNode>();
		for (const ln of layout) m.set(ln.i, ln);
		return m;
	});
	function parentOf(i: number): number {
		return Math.floor((i - 1) / d);
	}

	// Производные оценки для панели.
	const binH = $derived(heightOf(N, 2));
	const daryH = $derived(heightOf(N, d));
	const insertBin = $derived(logd(N, 2));
	const insertDary = $derived(logd(N, d));
	const extractBin = $derived(2 * logd(N, 2));
	const extractDary = $derived(d * logd(N, d));

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
		}, 900);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function setD(v: number) {
		d = v;
		reset();
	}

	function nodeCls(i: number): string {
		if (cur.node === i) return 'node sink';
		if (cur.swap === i) return 'node target';
		if (cur.children.includes(i)) return 'node compare';
		return 'node';
	}

	// Мини-таблица асимптотик (амортизированные/худшие оценки).
	const TABLE = [
		{ kind: 'Бинарная', insert: 'O(log N)', extract: 'O(log N)', dmin: 'O(log N)', merge: 'O(N)' },
		{ kind: 'd-арная', insert: 'O(log_d N)', extract: 'O(d·log_d N)', dmin: 'O(log_d N)', merge: 'O(N)' },
		{ kind: 'Биномиальная', insert: 'O(1)*', extract: 'O(log N)', dmin: 'O(log N)', merge: 'O(log N)' },
		{ kind: 'Фибоначчи', insert: 'O(1)', extract: 'O(log N)*', dmin: 'O(1)', merge: 'O(1)' }
	];
</script>

<div class="hk">
	<div class="hk__bar">
		<div class="seg">
			<span class="seg-lbl">арность d</span>
			{#each [2, 3, 4, 5] as v}
				<button class:on={d === v} onclick={() => setD(v)}>
					{v === 2 ? 'd=2 (бинарная)' : `d=${v}`}
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

	<div class="hk__body">
		<svg viewBox="0 0 250 250" class="hk__svg">
			<!-- рёбра -->
			{#each layout as ln}
				{#if ln.i !== 0}
					{@const p = posOf.get(parentOf(ln.i))}
					{#if p}
						<line
							x1={p.x} y1={p.y} x2={ln.x} y2={ln.y}
							class="edge"
							class:active={cur.children.includes(ln.i) || cur.swap === ln.i}
						/>
					{/if}
				{/if}
			{/each}
			<!-- узлы -->
			{#each layout as ln}
				<g class={nodeCls(ln.i)} style="transform: translate({ln.x}px, {ln.y}px)">
					<circle r="13" />
					<text dy="0.34em">{cur.arr[ln.i]}</text>
				</g>
			{/each}
		</svg>

		<div class="hk__panel">
			<div class="cmp">
				<div class="cmp-row head">
					<span></span><b>бинарная</b><b>d={d}-арная</b>
				</div>
				<div class="cmp-row">
					<span>высота</span><i>{binH}</i><i class:hl={daryH < binH}>{daryH}</i>
				</div>
				<div class="cmp-row">
					<span>insert<br /><em>log_d N</em></span>
					<i>{insertBin.toFixed(2)}</i>
					<i class:hl={insertDary < insertBin}>{insertDary.toFixed(2)}</i>
				</div>
				<div class="cmp-row">
					<span>extract<br /><em>d·log_d N</em></span>
					<i>{extractBin.toFixed(2)}</i>
					<i class:hl={extractDary > extractBin}>{extractDary.toFixed(2)}</i>
				</div>
			</div>
			<div class="note">{cur.note}</div>
		</div>
	</div>

	<div class="hk__hint">
		Больше d → ниже дерево → быстрее <b>insert</b> (просеивание вверх по высоте),
		но <b>extract-min</b> сравнивает d потомков на каждом уровне, поэтому
		<b>d·log_d N</b> растёт с ростом d. Оптимум часто d≈4.
	</div>

	<div class="hk__table">
		<div class="t-head">Асимптотики видов куч (N — число ключей)</div>
		<table>
			<thead>
				<tr><th>куча</th><th>insert</th><th>delete-min</th><th>find-min</th><th>merge</th></tr>
			</thead>
			<tbody>
				{#each TABLE as r}
					<tr class:hl={(r.kind === 'Бинарная' && d === 2) || (r.kind === 'd-арная' && d !== 2)}>
						<td class="kind">{r.kind}</td>
						<td>{r.insert}</td>
						<td>{r.extract}</td>
						<td>{r.dmin}</td>
						<td>{r.merge}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="t-foot">* — амортизированно</div>
	</div>
</div>

<style>
	.hk {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.hk__bar {
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
		align-items: center;
		gap: 0.3rem;
		flex-wrap: wrap;
	}
	.seg-lbl {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		margin-right: 0.2rem;
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
	.seg button:hover { border-color: var(--blue); color: var(--blue); }
	.seg button.on { background: var(--blue); color: #fff; border-color: var(--blue); }
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
	.ctrl button:hover { border-color: var(--blue); color: var(--blue); }
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}
	.hk__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.hk__svg {
		flex: 1 1 250px;
		min-width: 230px;
		max-width: 320px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: stroke 0.2s, stroke-width 0.2s;
	}
	.edge.active {
		stroke: var(--blue);
		stroke-width: 3;
	}
	.node {
		transition: transform 0.4s ease;
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.72rem;
		fill: var(--color-parch-100);
	}
	.node.compare circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.target circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.target text { fill: #fff; }
	.node.sink circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	.node.sink text { fill: #fff; }
	.hk__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.cmp {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.cmp-row {
		display: grid;
		grid-template-columns: 1.7fr 1fr 1fr;
		align-items: center;
		gap: 0.4rem;
		padding: 0.22rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
		font-size: 0.78rem;
	}
	.cmp-row span {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-parch-muted);
		line-height: 1.25;
	}
	.cmp-row span em {
		font-style: normal;
		text-transform: none;
		letter-spacing: 0;
		color: var(--blue);
		font-size: 0.62rem;
	}
	.cmp-row.head b {
		font-family: var(--font-display);
		font-size: 0.66rem;
		color: var(--color-parch-100);
		text-align: center;
	}
	.cmp-row i {
		font-style: normal;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 700;
		text-align: center;
		color: var(--color-parch-100);
	}
	.cmp-row i.hl { color: var(--blue); }
	.note {
		margin-top: auto;
		font-size: 0.82rem;
		color: var(--color-parch-200);
		padding: 0.55rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.hk__hint {
		padding: 0.6rem 1rem;
		font-size: 0.78rem;
		color: var(--color-parch-200);
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.hk__hint b { color: var(--blue); }
	.hk__table {
		padding: 0.7rem 1rem 0.9rem;
		border-top: 1.5px solid var(--color-ink-600);
	}
	.t-head {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		margin-bottom: 0.45rem;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.74rem;
	}
	th {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-parch-muted);
		text-align: left;
		padding: 0.25rem 0.4rem;
		border-bottom: 1.5px solid var(--color-ink-600);
	}
	td {
		padding: 0.28rem 0.4rem;
		border-bottom: 1px dashed var(--color-ink-600);
		font-family: var(--font-mono);
		color: var(--color-parch-200);
	}
	td.kind {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-parch-100);
	}
	tr.hl td {
		background: var(--blue-pale);
	}
	tr.hl td.kind { color: var(--blue); }
	.t-foot {
		margin-top: 0.4rem;
		font-size: 0.66rem;
		color: var(--color-parch-muted);
	}
</style>
