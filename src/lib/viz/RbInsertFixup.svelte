<script lang="ts">
	// Вставка красного узла в красно-чёрное дерево и пошаговый RB-Insert-Fixup
	// по трём случаям: (1) красный дядя → перекраска + всплытие; (2) треугольник
	// → поворот в линию; (3) линия → поворот вокруг деда + перекраска.
	// Логика — настоящий RB-Insert-Fixup на конкретном дереве. Чистый SVG, без зависимостей.

	type Color = 'R' | 'B';
	type Node = {
		key: number;
		color: Color;
		parent: number | null;
		left: number | null;
		right: number | null;
	};
	// Узлы по id (индекс в массиве). NIL = null. Дерево хранится «плоско».
	type Tree = Node[];

	// Снимок одного шага fixup'а.
	type Frame = {
		tree: Tree;
		zid: number; // текущий «проблемный» узел z
		highlight: number[]; // подсвеченные узлы (участники операции)
		violation: [number, number] | null; // ребро красный-красный
		caseLabel: string; // «Случай 1/2/3» или ''
		note: string;
	};

	// --- Построение исходного дерева до вставки ---------------------------------
	// Берём корректное RB-дерево, затем вставляем красный лист — это рождает
	// цепочку: Случай 1 (красный дядя, всплытие) → Случай 2 (треугольник) →
	// Случай 3 (линия). Так один прогон показывает все три случая.
	//
	//            13(B)
	//          /        \
	//        8(R)        17(B)
	//       /    \           \
	//     1(B)   11(B)       25(R)
	//       \                /   \
	//      6(R)           22(B)  27(B)
	//
	// Вставляем 4 (красный) под 6 справа → 6 и 4 оба красные (нарушение).
	// z=4: дядя z — 11 (красный) ⇒ Случай 1, перекраска, z всплывает к 8.
	// z=8: 8 красный, родитель 13 чёрный? Тогда стоп. Чтобы добраться до 2 и 3,
	// сделаем корень-сценарий, где после всплытия снова есть нарушение.
	//
	// Чтобы гарантированно показать ВСЕ три случая, строим дерево так:
	//            G:13(B)
	//          /         \
	//      P:8(R)        U:17(R)        <- дядя U красный  => Случай 1
	//       /    \
	//   1(B)    11(B)
	//     \
	//    z:6(R) ... вставляем 4(R) под 6
	//
	// После Случая 1 (перекраска 8,17 в чёрный, 13 в красный) z := 13 (корень).
	// 13 — корень, его делаем чёрным ⇒ для демонстрации 2 и 3 этого мало.
	//
	// Поэтому используем КЛАССИЧЕСКИЙ учебный пример (CLRS, fig 13.4),
	// где подряд идут Случай 1 → Случай 2 → Случай 3.

	function makeNode(key: number, color: Color): Node {
		return { key, color, parent: null, left: null, right: null };
	}

	// CLRS-пример. id == индекс. Ключи как в учебнике.
	// Дерево ПОСЛЕ вставки z=4 (красный), до fixup:
	//                 11(B)
	//               /       \
	//             2(R)      14(B)
	//            /    \         \
	//          1(B)   7(B)      15(R)
	//                /    \
	//             5(R)    8(R)
	//            /
	//          4(R)  <- z (только что вставлен, красный)
	//
	// Проверка нарушения: z=4 красный, родитель 5 красный ⇒ красный-красный.
	// Дядя z = 8 (брат 5 под 7) — красный ⇒ Случай 1.
	function initialTree(): Tree {
		const t: Tree = [];
		const id = (n: Node) => {
			t.push(n);
			return t.length - 1;
		};
		const n11 = id(makeNode(11, 'B'));
		const n2 = id(makeNode(2, 'R'));
		const n14 = id(makeNode(14, 'B'));
		const n1 = id(makeNode(1, 'B'));
		const n7 = id(makeNode(7, 'B'));
		const n15 = id(makeNode(15, 'R'));
		const n5 = id(makeNode(5, 'R'));
		const n8 = id(makeNode(8, 'R'));
		const n4 = id(makeNode(4, 'R')); // z
		const link = (p: number, l: number | null, r: number | null) => {
			t[p].left = l;
			t[p].right = r;
			if (l !== null) t[l].parent = p;
			if (r !== null) t[r].parent = p;
		};
		link(n11, n2, n14);
		link(n2, n1, n7);
		link(n14, null, n15);
		link(n7, n5, n8);
		link(n5, n4, null);
		return t;
	}
	const Z_START = 8; // id узла-ключа 4 (вставленный красный лист)

	// --- deep clone дерева (снимок) ---------------------------------------------
	function clone(t: Tree): Tree {
		return t.map((n) => ({ ...n }));
	}
	function rootOf(t: Tree): number {
		let r = 0;
		// корень — узел без родителя
		for (let i = 0; i < t.length; i++) if (t[i].parent === null) r = i;
		return r;
	}

	// --- Повороты (на «плоской» структуре) --------------------------------------
	function leftRotate(t: Tree, x: number) {
		const y = t[x].right!;
		t[x].right = t[y].left;
		if (t[y].left !== null) t[t[y].left!].parent = x;
		t[y].parent = t[x].parent;
		const p = t[x].parent;
		if (p !== null) {
			if (t[p].left === x) t[p].left = y;
			else t[p].right = y;
		}
		t[y].left = x;
		t[x].parent = y;
	}
	function rightRotate(t: Tree, x: number) {
		const y = t[x].left!;
		t[x].left = t[y].right;
		if (t[y].right !== null) t[t[y].right!].parent = x;
		t[y].parent = t[x].parent;
		const p = t[x].parent;
		if (p !== null) {
			if (t[p].right === x) t[p].right = y;
			else t[p].left = y;
		}
		t[y].right = x;
		t[x].parent = y;
	}

	// --- Запуск настоящего RB-Insert-Fixup со сбором кадров ---------------------
	function buildFrames(): Frame[] {
		const t = initialTree();
		const frames: Frame[] = [];
		let z = Z_START;

		const snap = (
			highlight: number[],
			caseLabel: string,
			note: string,
			violation: [number, number] | null
		) => {
			frames.push({
				tree: clone(t),
				zid: z,
				highlight: [...highlight],
				violation,
				caseLabel,
				note
			});
		};

		const par = (i: number) => t[i].parent!;
		const isRed = (i: number | null) => i !== null && t[i].color === 'R';

		// Стартовый кадр: вставленный красный лист
		snap(
			[z, par(z)],
			'',
			`Вставили ключ ${t[z].key} красным листом. Его родитель ${t[par(z)].key} тоже красный — нарушено свойство «красный узел не имеет красных детей».`,
			[z, par(z)]
		);

		while (isRed(t[z].parent)) {
			const p = par(z); // родитель
			const g = par(p); // дед
			if (p === t[g].left) {
				const u = t[g].right; // дядя
				if (isRed(u)) {
					// ---- Случай 1: дядя красный ----
					snap(
						[z, p, u!, g],
						'Случай 1',
						`Дядя ${t[u!].key} красный. Перекрашиваем родителя ${t[p].key} и дядю ${t[u!].key} в чёрный, деда ${t[g].key} — в красный, и поднимаем точку z к деду.`,
						[z, p]
					);
					t[p].color = 'B';
					t[u!].color = 'B';
					t[g].color = 'R';
					z = g;
					snap(
						[z],
						'Случай 1',
						`После перекраски нарушение «всплыло» вверх: теперь проверяем z = ${t[z].key}. Его родитель ${t[z].parent !== null ? t[par(z)].key : '—'} ${isRed(t[z].parent) ? 'красный — продолжаем' : 'чёрный'}.`,
						isRed(t[z].parent) ? [z, par(z)] : null
					);
				} else {
					if (z === t[p].right) {
						// ---- Случай 2: треугольник ----
						snap(
							[z, p],
							'Случай 2',
							`Дядя чёрный, а z = ${t[z].key} — правый ребёнок (конфигурация «треугольник»). Левый поворот вокруг ${t[p].key} превращает её в «линию».`,
							[z, p]
						);
						z = p;
						leftRotate(t, z);
						snap(
							[z, par(z)],
							'Случай 2',
							`После поворота z = ${t[z].key}; красный-красный выстроился в одну линию. Переходим к Случаю 3.`,
							[z, par(z)]
						);
					}
					// ---- Случай 3: линия ----
					const p3 = par(z);
					const g3 = par(p3);
					snap(
						[z, p3, g3],
						'Случай 3',
						`Линия: красим родителя ${t[p3].key} в чёрный, деда ${t[g3].key} — в красный, затем правый поворот вокруг деда ${t[g3].key}.`,
						[z, p3]
					);
					t[p3].color = 'B';
					t[g3].color = 'R';
					rightRotate(t, g3);
					snap(
						[p3],
						'Случай 3',
						`Поворот завершён: ${t[p3].key} поднялся, по обе стороны от него — чёрный и поддерево. Красный-красный устранён, цикл прекращается.`,
						null
					);
				}
			} else {
				// зеркальная ветвь (p — правый ребёнок)
				const u = t[g].left;
				if (isRed(u)) {
					snap(
						[z, p, u!, g],
						'Случай 1',
						`Дядя ${t[u!].key} красный. Перекрашиваем родителя и дядю в чёрный, деда — в красный, поднимаем z к деду.`,
						[z, p]
					);
					t[p].color = 'B';
					t[u!].color = 'B';
					t[g].color = 'R';
					z = g;
					snap(
						[z],
						'Случай 1',
						`Нарушение всплыло к z = ${t[z].key}.`,
						isRed(t[z].parent) ? [z, par(z)] : null
					);
				} else {
					if (z === t[p].left) {
						snap([z, p], 'Случай 2', `Треугольник (зеркальный): правый поворот вокруг ${t[p].key}.`, [z, p]);
						z = p;
						rightRotate(t, z);
						snap([z, par(z)], 'Случай 2', `Линия выстроена. Переходим к Случаю 3.`, [z, par(z)]);
					}
					const p3 = par(z);
					const g3 = par(p3);
					snap(
						[z, p3, g3],
						'Случай 3',
						`Линия (зеркальная): красим ${t[p3].key} чёрным, деда ${t[g3].key} красным, левый поворот вокруг ${t[g3].key}.`,
						[z, p3]
					);
					t[p3].color = 'B';
					t[g3].color = 'R';
					leftRotate(t, g3);
					snap([p3], 'Случай 3', `Поворот завершён, красный-красный устранён.`, null);
				}
			}
		}
		// Финал: корень всегда чёрный.
		const r = rootOf(t);
		if (t[r].color === 'R') {
			t[r].color = 'B';
			z = r;
			snap([r], '', `Свойство корня: красим корень ${t[r].key} в чёрный.`, null);
		}
		snap([], '', 'Готово. Все свойства красно-чёрного дерева восстановлены.', null);
		return frames;
	}

	const frames = buildFrames();

	// --- Раскладка дерева (по BST-ключу для x, по глубине для y) -----------------
	// Чтобы узлы не «прыгали» между кадрами, координату X фиксируем по ключу
	// (in-order ранг), Y — по глубине в текущем дереве.
	const ALL_KEYS = (() => {
		const set = new Set<number>();
		for (const f of frames) for (const n of f.tree) set.add(n.key);
		return [...set].sort((a, b) => a - b);
	})();
	const keyRank = new Map(ALL_KEYS.map((k, i) => [k, i]));

	const VB_W = 420;
	const VB_H = 290;
	const R = 16;

	type Placed = { id: number; key: number; color: Color; x: number; y: number };
	type PlacedEdge = { x1: number; y1: number; x2: number; y2: number; childId: number };

	function layout(t: Tree): { nodes: Placed[]; edges: PlacedEdge[] } {
		const root = rootOf(t);
		const depth = new Map<number, number>();
		const stack: [number, number][] = [[root, 0]];
		let maxD = 0;
		while (stack.length) {
			const [id, d] = stack.pop()!;
			depth.set(id, d);
			if (d > maxD) maxD = d;
			if (t[id].left !== null) stack.push([t[id].left!, d + 1]);
			if (t[id].right !== null) stack.push([t[id].right!, d + 1]);
		}
		const padX = 26;
		const padTop = 24;
		const usableW = VB_W - padX * 2;
		const usableH = VB_H - padTop - 20;
		const ranks = ALL_KEYS.length;
		const xFor = (key: number) =>
			padX + (ranks === 1 ? usableW / 2 : (keyRank.get(key)! / (ranks - 1)) * usableW);
		const yFor = (d: number) => padTop + (maxD === 0 ? 0 : (d / maxD) * usableH);

		const nodes: Placed[] = [];
		for (const [id, d] of depth) {
			nodes.push({ id, key: t[id].key, color: t[id].color, x: xFor(t[id].key), y: yFor(d) });
		}
		const byId = new Map(nodes.map((n) => [n.id, n]));
		const edges: PlacedEdge[] = [];
		for (const n of nodes) {
			for (const c of [t[n.id].left, t[n.id].right]) {
				if (c !== null && byId.has(c)) {
					const cn = byId.get(c)!;
					edges.push({ x1: n.x, y1: n.y, x2: cn.x, y2: cn.y, childId: c });
				}
			}
		}
		return { nodes, edges };
	}

	// --- состояние / контролы ----------------------------------------------------
	let idx = $state(0);
	let playing = $state(false);
	const cur = $derived(frames[Math.min(idx, frames.length - 1)]);
	const view = $derived(layout(cur.tree));
	const hi = $derived(new Set(cur.highlight));
	const violationSet = $derived(new Set(cur.violation ?? []));

	function nodeClass(id: number): string {
		const parts: string[] = [];
		parts.push(cur.tree[id].color === 'R' ? 'red' : 'black');
		if (id === cur.zid) parts.push('znode');
		if (hi.has(id)) parts.push('hi');
		return parts.join(' ');
	}
	function edgeViolation(childId: number): boolean {
		// ребро «красный-красный» = ребро к ребёнку, оба конца которого в violation
		if (!cur.violation) return false;
		return violationSet.has(childId) && violationSet.has(cur.tree[childId].parent!);
	}

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		playing = false;
		clearInterval(timer);
	}
	function play() {
		stop();
		playing = true;
		timer = setInterval(() => {
			if (idx >= frames.length - 1) {
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
	const caseColor = (c: string) =>
		c === 'Случай 1' ? '1' : c === 'Случай 2' ? '2' : c === 'Случай 3' ? '3' : '';
</script>

<div class="rb">
	<div class="rb__bar">
		<div class="legend">
			<span class="lg"><i class="dot red"></i>красный</span>
			<span class="lg"><i class="dot black"></i>чёрный</span>
			<span class="lg"><i class="dot z"></i>точка z</span>
			<span class="lg"><i class="dot viol"></i>красный-красный</span>
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(frames.length - 1, idx + 1); }} title="шаг fixup">▶▶</button>
			<span class="cnt">{idx}/{frames.length - 1}</span>
		</div>
	</div>

	<div class="rb__body">
		<svg viewBox="0 0 {VB_W} {VB_H}" class="rb__svg">
			{#each view.edges as e (e.childId)}
				<line
					x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
					class="edge" class:viol={edgeViolation(e.childId)}
				/>
			{/each}
			{#each view.nodes as n (n.id)}
				<g class="node {nodeClass(n.id)}" style="transform: translate({n.x}px, {n.y}px)">
					<circle r={R} />
					<text dy="0.34em">{n.key}</text>
					{#if n.id === cur.zid}<text class="ztag" y={-R - 5}>z</text>{/if}
				</g>
			{/each}
		</svg>

		<div class="rb__panel">
			<div class="caserow">
				{#if cur.caseLabel}
					<span class="badge c{caseColor(cur.caseLabel)}">{cur.caseLabel}</span>
				{:else}
					<span class="badge plain">RB-Insert-Fixup</span>
				{/if}
			</div>
			<ul class="cases">
				<li class:on={cur.caseLabel === 'Случай 1'}>
					<b>1</b> дядя красный → перекраска родителя/дяди/деда, всплытие z к деду
				</li>
				<li class:on={cur.caseLabel === 'Случай 2'}>
					<b>2</b> треугольник → поворот, превращающий конфигурацию в линию
				</li>
				<li class:on={cur.caseLabel === 'Случай 3'}>
					<b>3</b> линия → поворот вокруг деда + перекраска, цикл завершается
				</li>
			</ul>
			<div class="note">{cur.note}</div>
		</div>
	</div>
</div>

<style>
	.rb {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.rb__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}
	.lg {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-muted);
	}
	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		display: inline-block;
	}
	.dot.red {
		background: var(--blue);
	}
	.dot.black {
		background: var(--color-ink-500);
		border: 1.5px solid var(--color-parch-muted);
	}
	.dot.z {
		background: transparent;
		border: 2px solid var(--color-parch-100);
	}
	.dot.viol {
		background: var(--blue-pale);
		border: 2px solid var(--blue);
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
	.rb__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.rb__svg {
		flex: 1 1 340px;
		min-width: 290px;
		max-width: 470px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: stroke 0.25s, stroke-width 0.25s;
	}
	.edge.viol {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.node {
		transition: transform 0.5s ease;
	}
	.node circle {
		stroke-width: 2.5;
		transition: fill 0.3s, stroke 0.3s;
	}
	.node.black circle {
		fill: var(--color-ink-700, var(--color-ink-800));
		stroke: var(--color-parch-muted);
	}
	.node.red circle {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.node.hi circle {
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node.znode circle {
		stroke: var(--color-parch-100);
		stroke-width: 4;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.86rem;
		fill: var(--color-parch-100);
	}
	.node.red text {
		fill: #fff;
	}
	.node .ztag {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.7rem;
		fill: var(--color-parch-100);
	}
	.rb__panel {
		flex: 1 1 230px;
		min-width: 210px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.caserow {
		display: flex;
	}
	.badge {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.78rem;
		padding: 0.28rem 0.7rem;
		border-radius: 7px;
		color: #fff;
		background: var(--blue);
	}
	.badge.plain {
		background: transparent;
		color: var(--color-parch-muted);
		border: 1.5px solid var(--color-ink-500);
		font-weight: 700;
	}
	.badge.c1 { background: var(--blue); }
	.badge.c2 { background: var(--blue); }
	.badge.c3 { background: var(--blue); }
	.cases {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.cases li {
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
		font-size: 0.74rem;
		color: var(--color-parch-muted);
		padding: 0.3rem 0.4rem;
		border-radius: 6px;
		border: 1.5px solid transparent;
		transition: all 0.2s;
	}
	.cases li b {
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--color-parch-muted);
		flex: none;
	}
	.cases li.on {
		color: var(--color-parch-100);
		background: var(--color-ink-800);
		border-color: var(--blue);
	}
	.cases li.on b {
		color: var(--blue);
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
