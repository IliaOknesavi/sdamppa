<script lang="ts">
	// Фибоначчиева куча: лес корней с указателем на минимум. Сценарий из шагов
	// проигрывается по снапшотам — insert (O(1)), extract-min + консолидация
	// деревьев по степеням, decrease-key с вырезанием и каскадной отметкой.
	// Чистый инлайн SVG, без внешних импортов; цвета через CSS-переменные.

	type Node = {
		key: number;
		degree: number; // число прямых детей
		mark: boolean; // помечен ли (потерял ребёнка после прошлого вырезания)
		children: Node[];
	};
	type Snap = {
		roots: Node[]; // лес корней (порядок слева направо)
		minKey: number | null; // ключ текущего минимума
		hi: Set<number>; // подсвеченные ключи (участники операции)
		op: string; // короткий тег операции
		note: string; // русское пояснение
	};

	const clone = (n: Node): Node => ({
		key: n.key,
		degree: n.degree,
		mark: n.mark,
		children: n.children.map(clone)
	});
	const cloneRoots = (rs: Node[]): Node[] => rs.map(clone);
	const leaf = (key: number, mark = false): Node => ({ key, degree: 0, mark, children: [] });

	function minKeyOf(rs: Node[]): number | null {
		let m: number | null = null;
		for (const r of rs) if (m === null || r.key < m) m = r.key;
		return m;
	}

	// Собираем все ключи дерева (для подсветки поддерева целиком).
	function keysOf(n: Node, acc: Set<number>): Set<number> {
		acc.add(n.key);
		for (const c of n.children) keysOf(c, acc);
		return acc;
	}

	function buildSnaps(): Snap[] {
		const snaps: Snap[] = [];
		const push = (roots: Node[], hi: number[], op: string, note: string) =>
			snaps.push({
				roots: cloneRoots(roots),
				minKey: minKeyOf(roots),
				hi: new Set(hi),
				op,
				note
			});

		// Стартовый лес: несколько корней разной степени, минимум = 3.
		// 3 — корень с детьми 17,24(→26); 7 — корень с ребёнком 18; 23 — одиночка.
		const n26 = leaf(26);
		const n24: Node = { key: 24, degree: 1, mark: false, children: [n26] };
		const n17 = leaf(17);
		const n3: Node = { key: 3, degree: 2, mark: false, children: [n17, n24] };
		const n18 = leaf(18);
		const n7: Node = { key: 7, degree: 1, mark: false, children: [n18] };
		const n23 = leaf(23);
		let roots: Node[] = [n3, n7, n23];

		push(roots, [3], 'старт', 'Куча — лес деревьев с кучным порядком. Указатель min ведёт на наименьший корень (3).');

		// --- INSERT 2: новый корень добавляется в список за O(1), min обновляется. ---
		roots = [...roots, leaf(2)];
		push(roots, [2], 'insert', 'insert(2): новый узел кладётся отдельным корнем в список за O(1). 2 < 3 → min теперь 2.');

		// --- INSERT 21: ещё один корень, min не меняется. ---
		roots = [...roots, leaf(21)];
		push(roots, [21], 'insert', 'insert(21): снова просто новый корень за O(1). 21 > 2 → min без изменений.');

		// --- EXTRACT-MIN: убрать 2, его детей (нет) поднять в корни, затем консолидация. ---
		// 2 — лист, детей нет; удаляем корень 2.
		roots = roots.filter((r) => r.key !== 2);
		push(roots, [], 'extract', 'extract-min: вынимаем min (2). Его детей переносим в список корней (у 2 их нет). Дальше — консолидация.');

		// Консолидация: объединяем корни одинаковой степени, пока степени не уникальны.
		// Текущие корни: 3(deg2), 7(deg1), 23(deg0), 21(deg0).
		// Шаг A: степень 0 — конфликт 23 и 21. Меньший (21) становится родителем.
		{
			const i23 = roots.findIndex((r) => r.key === 23);
			const i21 = roots.findIndex((r) => r.key === 21);
			const a = roots[i21]; // 21 меньше
			const b = roots[i23]; // 23 уходит в дети
			const merged: Node = {
				key: a.key,
				degree: a.degree + 1,
				mark: false,
				children: [...a.children, { ...clone(b), mark: false }]
			};
			roots = roots.filter((r) => r.key !== 23 && r.key !== 21);
			roots.push(merged);
			push(roots, [21, 23], 'consol', 'Консолидация: две степени 0 (21 и 23). Больший корень (23) становится ребёнком меньшего (21) → дерево степени 1.');
		}

		// Шаг B: теперь степень 1 — конфликт 7 и 21. Меньший (7) родитель.
		{
			const i7 = roots.findIndex((r) => r.key === 7);
			const i21 = roots.findIndex((r) => r.key === 21);
			const a = roots[i7]; // 7 меньше
			const b = roots[i21]; // 21 уходит в дети
			const merged: Node = {
				key: a.key,
				degree: a.degree + 1,
				mark: false,
				children: [...a.children, { ...clone(b), mark: false }]
			};
			roots = roots.filter((r) => r.key !== 7 && r.key !== 21);
			roots.push(merged);
			push(roots, [7, 21], 'consol', 'Снова конфликт степеней: 7 и 21 имеют степень 1. 21 уходит под 7 → дерево степени 2.');
		}

		// Шаг C: степень 2 — конфликт 3 и 7. Меньший (3) родитель.
		{
			const i3 = roots.findIndex((r) => r.key === 3);
			const i7 = roots.findIndex((r) => r.key === 7);
			const a = roots[i3]; // 3 меньше
			const b = roots[i7]; // 7 уходит в дети
			const merged: Node = {
				key: a.key,
				degree: a.degree + 1,
				mark: false,
				children: [...a.children, clone(b)]
			};
			roots = roots.filter((r) => r.key !== 3 && r.key !== 7);
			roots.push(merged);
			push(roots, [3, 7], 'consol', 'Последний конфликт: 3 и 7 степени 2. 7 уходит под 3. Все степени теперь различны → консолидация завершена.');
		}

		push(roots, [3], 'done', 'extract-min готов: одно дерево степени 3 с корнем-минимумом 3. Амортизированная стоимость O(log n).');

		// --- DECREASE-KEY: уменьшаем 26 → 1. 26 — внук (3 → 24 → 26). ---
		// Найти узел 26, поменять ключ; нарушается кучный порядок (1 < 24) → вырезаем.
		// Родитель 24 ещё не помечен → помечаем его. 24 не корень → каскад не идёт дальше.
		{
			// Помечаем дерево с 26 для наглядности.
			push(roots, [26], 'decrease', 'decrease-key(26 → 1): уменьшаем ключ узла 26. Его родитель 24, и 1 < 24 — кучный порядок нарушен.');

			// Вырезаем 26 (теперь 1) в корни, родитель 24 теряет ребёнка.
			const root = roots[0]; // дерево с корнем 3
			const n24x = root.children.find((c) => c.key === 24)!;
			n24x.children = n24x.children.filter((c) => c.key !== 26);
			n24x.degree -= 1;
			n24x.mark = true; // 24 потерял первого ребёнка → помечаем
			roots = [...roots, leaf(1)];
			push(roots, [1, 24], 'cut', 'cut: вырезаем узел (1) в отдельный корень, снимаем его пометку. Родитель 24 впервые потерял ребёнка → ставим ему метку (★).');

			push(roots, [1], 'done', '1 < 3 → min теперь 1. Каскад остановлен: 24 был без метки. Если бы 24 уже был помечен — его тоже вырезали бы (каскадное вырезание).');
		}

		return snaps;
	}

	const snaps = buildSnaps();

	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(snaps[Math.min(idx, snaps.length - 1)]);

	// --- Раскладка леса по снапшоту: каждое дерево занимает свою колонку. ---
	type Placed = { key: number; x: number; y: number; mark: boolean };
	type Link = { x1: number; y1: number; x2: number; y2: number };

	const VW = 420;
	const VH = 230;
	const RAD = 13;
	const ROW_H = 46; // вертикальный шаг между уровнями
	const GAP = 26; // зазор между листьями соседних деревьев

	// Ширина поддерева в «слотах листьев» — для аккуратной раскладки.
	function leafSpan(n: Node): number {
		if (n.children.length === 0) return 1;
		return n.children.reduce((s, c) => s + leafSpan(c), 0);
	}

	const layout = $derived.by(() => {
		const placed: Placed[] = [];
		const links: Link[] = [];
		// Считаем суммарную ширину в слотах, чтобы отмасштабировать под VW.
		const totalSlots = cur.roots.reduce((s, r) => s + leafSpan(r), 0) || 1;
		const slotW = (VW - GAP) / (totalSlots + cur.roots.length * 0.0001);
		let cursor = GAP / 2; // текущий левый край в координатах слотов→px

		// Рекурсивно размещаем поддерево; возвращаем x-центр корня поддерева.
		function place(n: Node, depth: number, left: number): number {
			const span = leafSpan(n);
			let cx: number;
			if (n.children.length === 0) {
				cx = left + (span * slotW) / 2;
			} else {
				let childLeft = left;
				const cxs: number[] = [];
				for (const c of n.children) {
					const ccx = place(c, depth + 1, childLeft);
					cxs.push(ccx);
					childLeft += leafSpan(c) * slotW;
				}
				cx = (cxs[0] + cxs[cxs.length - 1]) / 2;
				const cy = 22 + depth * ROW_H;
				for (let i = 0; i < n.children.length; i++) {
					links.push({ x1: cx, y1: cy, x2: cxs[i], y2: 22 + (depth + 1) * ROW_H });
				}
			}
			placed.push({ key: n.key, x: cx, y: 22 + depth * ROW_H, mark: n.mark });
			return cx;
		}

		for (const r of cur.roots) {
			place(r, 0, cursor);
			cursor += leafSpan(r) * slotW;
		}
		return { placed, links };
	});

	const minX = $derived.by(() => {
		if (cur.minKey === null) return null;
		const p = layout.placed.find((p) => p.key === cur.minKey);
		return p ?? null;
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
			if (idx >= snaps.length - 1) {
				stop();
				return;
			}
			idx += 1;
		}, 1100);
	}
	function reset() {
		stop();
		idx = 0;
	}

	const OP_LABEL: Record<string, string> = {
		'старт': 'старт',
		insert: 'insert',
		extract: 'extract-min',
		consol: 'консолидация',
		decrease: 'decrease-key',
		cut: 'cut',
		done: 'готово'
	};
</script>

<div class="fh">
	<div class="fh__bar">
		<div class="tag" data-op={cur.op}>{OP_LABEL[cur.op] ?? cur.op}</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(snaps.length - 1, idx + 1); }} title="вперёд">▶▶</button>
			<span class="cnt">{idx}/{snaps.length - 1}</span>
		</div>
	</div>

	<div class="fh__body">
		<svg viewBox="0 0 {VW} {VH}" class="fh__svg">
			<!-- рёбра дерева -->
			{#each layout.links as l}
				<line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} class="link" />
			{/each}

			<!-- указатель на минимум -->
			{#if minX}
				<g class="minptr">
					<text x={minX.x} y={minX.y - RAD - 7} dy="0">min</text>
					<path
						d={`M ${minX.x} ${minX.y - RAD - 5} l -4 -5 l 8 0 z`}
						class="minarrow"
					/>
				</g>
			{/if}

			<!-- узлы -->
			{#each layout.placed as p}
				<g
					class="node"
					class:hi={cur.hi.has(p.key)}
					class:ismin={cur.minKey === p.key}
				>
					<circle cx={p.x} cy={p.y} r={RAD} />
					<text x={p.x} y={p.y} dy="0.34em">{p.key}</text>
					{#if p.mark}
						<text x={p.x + RAD - 2} y={p.y - RAD + 4} class="mark">★</text>
					{/if}
				</g>
			{/each}
		</svg>
	</div>

	<div class="fh__foot">
		<div class="note">{cur.note}</div>
		<div class="legend">
			<span><i class="sw min"></i>минимум</span>
			<span><i class="sw hi"></i>участник операции</span>
			<span><i class="sw mk">★</i>метка</span>
		</div>
	</div>
</div>

<style>
	.fh {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.fh__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.tag {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.8rem;
		padding: 0.32rem 0.7rem;
		border-radius: 7px;
		background: var(--blue-pale);
		color: var(--blue);
		border: 1.5px solid var(--blue);
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
	.fh__body {
		padding: 0.6rem 0.6rem 0.2rem;
	}
	.fh__svg {
		width: 100%;
		height: auto;
		display: block;
	}
	.link {
		stroke: var(--color-ink-500);
		stroke-width: 2;
	}
	.node circle {
		fill: var(--color-ink-850);
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.72rem;
		fill: var(--color-parch-100);
	}
	.node .mark {
		fill: var(--blue);
		font-size: 0.62rem;
	}
	.node.hi circle {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.node.hi text {
		fill: var(--blue);
	}
	.node.ismin circle {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 3.5;
	}
	.node.ismin text {
		fill: #fff;
	}
	.minptr text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		fill: var(--blue);
		letter-spacing: 0.05em;
	}
	.minarrow {
		fill: var(--blue);
	}
	.fh__foot {
		padding: 0.4rem 0.9rem 0.9rem;
	}
	.note {
		font-size: 0.84rem;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
		min-height: 2.4em;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.sw {
		display: inline-grid;
		place-items: center;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 3px;
	}
	.sw.min {
		background: var(--blue);
	}
	.sw.hi {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.sw.mk {
		color: var(--blue);
		font-size: 0.7rem;
	}
</style>
