<script lang="ts">
	// Интерактивная вставка в B-дерево минимальной степени t=2 (узлы до 2t−1 = 3
	// ключей). Алгоритм корректный (не декоративный): спуск к листу, при полном
	// узле — расщепление на два по t−1=1 ключу со всплытием среднего в родителя;
	// расщепление корня растит дерево вверх. Серия ключей, шаг вставки/split,
	// сброс. Чистый инлайн-SVG/HTML, без внешних импортов, цвета — CSS-переменные.
	const T = 2; // минимальная степень
	const MAXK = 2 * T - 1; // 3 ключа в узле максимум
	const MID = T - 1; // индекс среднего ключа (1)

	type Node = {
		keys: number[];
		children: Node[]; // пусто у листа
	};
	type Snap = {
		root: Node; // глубокая копия дерева на этом шаге
		note: string;
		moved: number[]; // ключи, которые только что переехали/вставлены
		grew: boolean; // на этом шаге дерево выросло вверх
	};

	const newNode = (): Node => ({ keys: [], children: [] });
	const isLeaf = (n: Node) => n.children.length === 0;
	const clone = (n: Node): Node => ({
		keys: [...n.keys],
		children: n.children.map(clone)
	});

	// демо-серия: классическая последовательность, дающая два split и рост корня
	const DEFAULT_KEYS = [10, 20, 5, 6, 12, 30, 7, 17];

	// --- построение пошаговой трассы вставки серии ключей ---
	function buildSnaps(seq: number[]): Snap[] {
		let root: Node = newNode();
		const snaps: Snap[] = [];
		const push = (note: string, moved: number[] = [], grew = false) =>
			snaps.push({ root: clone(root), note, moved, grew });

		push('Пустое дерево. Введите ключи и нажимайте «шаг».');

		for (const k of seq) {
			// 1) если корень полон — заранее расщепляем (дерево растёт вверх)
			if (root.keys.length === MAXK) {
				const fresh = newNode();
				fresh.children.push(root);
				push(`Вставляем ${k}. Корень полон — расщепляем корень, дерево растёт вверх.`, [], true);
				splitChild(fresh, 0);
				root = fresh;
				const up = root.keys[0];
				push(`Средний ключ ${up} поднялся в новый корень. Высота +1.`, [up], true);
			} else {
				push(`Вставляем ключ ${k}.`, []);
			}
			insertNonFull(root, k, push);
			push(`Ключ ${k} вставлен.`, [k]);
		}
		push('Серия вставлена. Сброс — начать заново.');
		return snaps;

		// расщепление полного потомка child[i] узла parent
		function splitChild(parent: Node, i: number) {
			const full = parent.children[i];
			const right = newNode();
			const upKey = full.keys[MID];
			// правая половина: ключи после среднего
			right.keys = full.keys.slice(MID + 1);
			// левая половина: ключи до среднего
			full.keys = full.keys.slice(0, MID);
			if (!isLeaf(full)) {
				right.children = full.children.slice(MID + 1);
				full.children = full.children.slice(0, MID + 1);
			}
			// средний ключ + новый правый ребёнок вставляем в родителя
			parent.keys.splice(i, 0, upKey);
			parent.children.splice(i + 1, 0, right);
		}

		// вставка в гарантированно неполный узел
		function insertNonFull(n: Node, k: number, log: typeof push) {
			if (isLeaf(n)) {
				let i = n.keys.length - 1;
				while (i >= 0 && k < n.keys[i]) i--;
				n.keys.splice(i + 1, 0, k);
				return;
			}
			// найти потомка для спуска
			let i = n.keys.length - 1;
			while (i >= 0 && k < n.keys[i]) i--;
			i++;
			if (n.children[i].keys.length === MAXK) {
				const upKey = n.children[i].keys[MID];
				log(`Потомок для ${k} полон — расщепляем его, ключ ${upKey} всплывает в родителя.`, [upKey]);
				splitChild(n, i);
				// после split средний ключ оказался в n — выбрать половину
				if (k > n.keys[i]) i++;
			}
			insertNonFull(n.children[i], k, log);
		}
	}

	// --- раскладка дерева для отрисовки (по уровням, центрирование) ---
	type Box = { x: number; y: number; w: number; keys: number[]; depth: number };
	type Link = { x1: number; y1: number; x2: number; y2: number };

	const KW = 22; // ширина одной ячейки-ключа
	const NH = 26; // высота узла
	const HGAP = 14; // зазор между узлами одного уровня
	const VGAP = 46; // вертикальный шаг между уровнями

	function layout(root: Node): { boxes: Box[]; links: Link[]; width: number; height: number } {
		const boxes: Box[] = [];
		const links: Link[] = [];
		let cursor = 0; // текущая x-позиция листового курсора

		const nodeW = (n: Node) => Math.max(1, n.keys.length) * KW;

		// x-курсор раскладывает листья слева направо; внутренний узел центрируется
		// по своим потомкам. boxOf хранит рамку каждого узла для построения связей.
		const boxOf = new Map<Node, Box>();
		function placeTracked(n: Node, depth: number): number {
			const w = nodeW(n);
			let cx: number;
			if (isLeaf(n)) {
				cx = cursor + w / 2;
				cursor += w + HGAP;
			} else {
				const cs = n.children.map((c) => placeTracked(c, depth + 1));
				cx = (cs[0] + cs[cs.length - 1]) / 2;
			}
			const x = cx - w / 2;
			const y = depth * VGAP;
			const box: Box = { x, y, w, keys: n.keys, depth };
			boxes.push(box);
			boxOf.set(n, box);
			return cx;
		}
		placeTracked(root, 0);

		// построить связи родитель→потомок по слотам
		(function linkUp(n: Node) {
			if (isLeaf(n)) return;
			const pb = boxOf.get(n)!;
			n.children.forEach((c, idx) => {
				const cb = boxOf.get(c)!;
				const slotX = pb.x + idx * KW;
				links.push({
					x1: slotX,
					y1: pb.y + NH,
					x2: cb.x + cb.w / 2,
					y2: cb.y
				});
				linkUp(c);
			});
		})(root);

		const width = boxes.reduce((m, b) => Math.max(m, b.x + b.w), 0);
		const height = boxes.reduce((m, b) => Math.max(m, b.y + NH), 0);
		return { boxes, links, width, height };
	}

	// --- состояние UI ---
	let raw = $state(DEFAULT_KEYS.join(', '));
	let seq = $state<number[]>([...DEFAULT_KEYS]);
	let idx = $state(0);
	let playing = $state(false);

	const snaps = $derived(buildSnaps(seq));
	const cur = $derived(snaps[Math.min(idx, snaps.length - 1)]);
	const view = $derived(layout(cur.root));

	// подсветка переехавших ключей
	const movedSet = $derived(new Set(cur.moved));

	const VB_W = 420;
	const VB_H = 250;
	// масштаб/смещение, чтобы дерево влезло в viewBox по центру
	const scale = $derived(
		Math.min(1, (VB_W - 16) / Math.max(view.width, 1), (VB_H - 16) / Math.max(view.height, 1))
	);
	const offX = $derived((VB_W - view.width * scale) / 2);
	const offY = $derived((VB_H - view.height * scale) / 2);

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
		}, 900);
	}
	function reset() {
		stop();
		idx = 0;
	}
	function applySeq() {
		const parsed = raw
			.split(/[\s,]+/)
			.map((s) => parseInt(s, 10))
			.filter((n) => Number.isFinite(n));
		seq = parsed.length ? parsed.slice(0, 14) : [...DEFAULT_KEYS];
		reset();
	}
	function loadPreset(p: number[]) {
		raw = p.join(', ');
		seq = [...p];
		reset();
	}

	const PRESETS: { label: string; keys: number[] }[] = [
		{ label: 'Рост корня', keys: [10, 20, 5, 6, 12, 30, 7, 17] },
		{ label: 'По возрастанию', keys: [1, 2, 3, 4, 5, 6, 7] },
		{ label: 'Каскад', keys: [5, 10, 15, 20, 25, 30, 35, 40] }
	];
</script>

<div class="bt">
	<div class="bt__bar">
		<div class="inp">
			<label for="bt-keys">ключи</label>
			<input id="bt-keys" type="text" bind:value={raw} onkeydown={(e) => e.key === 'Enter' && applySeq()} />
			<button class="go" onclick={applySeq}>вставить серию</button>
		</div>
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

	<div class="bt__presets">
		{#each PRESETS as p}
			<button onclick={() => loadPreset(p.keys)}>{p.label}</button>
		{/each}
	</div>

	<div class="bt__body">
		<svg viewBox="0 0 {VB_W} {VB_H}" class="bt__svg">
			<g style="transform: translate({offX}px, {offY}px) scale({scale})">
				{#each view.links as l}
					<line class="link" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
				{/each}
				{#each view.boxes as b}
					<g class="node" class:root={b.depth === 0 && cur.grew}>
						<rect class="frame" x={b.x} y={b.y} width={b.w} height={NH} rx="5" />
						{#each b.keys as key, ki}
							<g class="cell" class:moved={movedSet.has(key)}>
								<rect x={b.x + ki * KW} y={b.y} width={KW} height={NH} rx="4" />
								<text x={b.x + ki * KW + KW / 2} y={b.y + NH / 2} dy="0.34em">{key}</text>
							</g>
							{#if ki < b.keys.length - 1}
								<line class="sep" x1={b.x + (ki + 1) * KW} y1={b.y + 3} x2={b.x + (ki + 1) * KW} y2={b.y + NH - 3} />
							{/if}
						{/each}
					</g>
				{/each}
			</g>
		</svg>

		<div class="bt__panel">
			<div class="facts">
				<div class="fact"><span>степень t</span><b>{T}</b></div>
				<div class="fact"><span>ключей в узле</span><b>{T - 1}…{MAXK}</b></div>
				<div class="fact"><span>при полном</span><b>split → +{1} вверх</b></div>
			</div>
			<div class="legend">
				<span><i class="sw moved"></i> переехал/вставлен</span>
				<span><i class="sw grew"></i> новый корень</span>
			</div>
			<div class="note" class:grow={cur.grew}>{cur.note}</div>
		</div>
	</div>
</div>

<style>
	.bt {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.bt__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.inp {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-wrap: wrap;
	}
	.inp label {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.inp input {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		padding: 0.34rem 0.5rem;
		width: 11rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
	}
	.inp input:focus {
		outline: none;
		border-color: var(--blue);
	}
	.go {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.74rem;
		padding: 0.36rem 0.7rem;
		border: 1.5px solid var(--blue);
		border-radius: 7px;
		background: var(--blue);
		color: #fff;
		cursor: pointer;
	}
	.go:hover {
		filter: brightness(1.08);
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
	.bt__presets {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
		padding: 0.55rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.bt__presets button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.7rem;
		padding: 0.3rem 0.6rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: transparent;
		color: var(--color-parch-200);
		cursor: pointer;
		transition: all 0.15s;
	}
	.bt__presets button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.bt__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.bt__svg {
		flex: 1 1 340px;
		min-width: 300px;
		max-width: 470px;
		height: auto;
		background: var(--color-ink-850);
	}
	.link {
		stroke: var(--color-ink-500);
		stroke-width: 1.6;
	}
	.node .frame {
		fill: none;
		stroke: var(--color-ink-500);
		stroke-width: 1.6;
	}
	.node.root .frame {
		stroke: var(--blue);
		stroke-width: 2.4;
	}
	.cell rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1;
		transition: fill 0.25s, stroke 0.25s;
	}
	.cell text {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.74rem;
		fill: var(--color-parch-100);
	}
	.cell.moved rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.cell.moved text {
		fill: var(--blue);
	}
	.sep {
		stroke: var(--color-ink-600);
		stroke-width: 1;
	}
	.bt__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.facts {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
	}
	.fact {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 0.78rem;
		padding: 0.2rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.fact span {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.fact b {
		color: var(--color-parch-100);
		font-family: var(--font-display);
	}
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.7rem;
		color: var(--color-parch-200);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.sw {
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 3px;
		flex: none;
	}
	.sw.moved {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.sw.grew {
		background: transparent;
		border: 2px solid var(--blue);
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
	.note.grow {
		border-left-color: var(--blue);
		background: var(--blue-pale);
		color: var(--color-ink-850);
		font-weight: 600;
	}
</style>
