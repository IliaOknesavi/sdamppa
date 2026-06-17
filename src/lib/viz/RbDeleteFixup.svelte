<script lang="ts">
	// Удаление в красно-чёрном дереве: BST-удаление + RB-Delete-Fixup.
	// Подсветка «двойного чёрного» узла и четырёх случаев фиксации:
	//  1 — красный брат; 2 — чёрный брат с чёрными детьми;
	//  3 — брат с ближним красным ребёнком; 4 — брат с дальним красным ребёнком.
	// Перекраски и повороты, восстановление чёрной высоты.
	// Чистый инлайн SVG, без внешних импортов. Цвета — через CSS-переменные.
	type Color = 'R' | 'B' | 'BB'; // BB = двойной чёрный
	type N = {
		key: number | null; // null → NIL-лист
		color: Color;
		x: number;
		y: number;
	};
	// Узел кадра: дерево как карта ключ→позиция/цвет + рёбра + подсветки.
	type Node = { key: number; color: Color; x: number; y: number; nil?: boolean };
	type Frame = {
		nodes: Node[];
		edges: [number, number][]; // пары ключей (для NIL — отрицательные id)
		dbl: number | null; // ключ узла с «двойным чёрным» (или NIL-id)
		brother: number | null; // ключ брата
		caseLabel: string;
		note: string;
	};

	// ── Геометрия: фиксированная сетка слотов по уровням, координаты симметричны.
	const W = 420;
	const slotX = (depth: number, idx: number): number => {
		// idx — позиция в полном бинарном дереве на уровне depth (0-based слева)
		const total = 1 << depth;
		const step = W / (total + 1);
		return step * (idx + 1);
	};
	const slotY = (depth: number) => 36 + depth * 60;

	// ── Сценарии. Каждый сценарий — заранее просчитанная корректная
	// последовательность кадров для удаления конкретного ключа.
	// Базовое дерево строится так, чтобы каждый ключ-кандидат
	// демонстрировал ровно один характерный случай фиксации.

	type Scn = { key: number; title: string; build: () => Frame[] };

	// Помощник: узел в слоте дерева.
	const mk = (key: number, color: Color, depth: number, idx: number, nil = false): Node => ({
		key,
		color,
		x: slotX(depth, idx),
		y: slotY(depth),
		nil
	});

	// ───────────────────────────────────────────────────────────────────────
	// Сценарий A. Случай 2 (чёрный брат с чёрными детьми) → подъём двойного
	// чёрного, затем простая перекраска. Дерево:
	//            30(B)
	//          /        \
	//       20(B)       40(B)
	// Удаляем 20 (чёрный лист). У 30 остаётся двойной чёрный на месте 20.
	// Брат 40(B) с чёрными (NIL) детьми → красим брата, двойной чёрный → корень → конец.
	function scnA(): Frame[] {
		const root = () => mk(30, 'B', 0, 0);
		const r40 = (c: Color = 'B') => mk(40, c, 1, 1);
		const e = (): [number, number][] => [[30, 40]];
		const F: Frame[] = [];
		// шаг 0
		F.push({
			nodes: [root(), mk(20, 'B', 1, 0), r40()],
			edges: [[30, 20], [30, 40]],
			dbl: null,
			brother: null,
			caseLabel: 'Старт',
			note: 'Удаляем 20 — чёрный лист. Чёрная высота на его ветке упадёт.'
		});
		// шаг 1: BST-удаление, на месте 20 — NIL с «двойным чёрным»
		F.push({
			nodes: [root(), mk(-1, 'BB', 1, 0, true), r40()],
			edges: e().concat([[30, -1]]),
			dbl: -1,
			brother: 40,
			caseLabel: 'BST-удаление',
			note: '20 удалён; вместо него NIL. На этой ветке не хватает одного чёрного — «двойной чёрный».'
		});
		// шаг 2: распознаём Случай 2
		F.push({
			nodes: [root(), mk(-1, 'BB', 1, 0, true), r40()],
			edges: e().concat([[30, -1]]),
			dbl: -1,
			brother: 40,
			caseLabel: 'Случай 2',
			note: 'Брат 40 чёрный, оба его ребёнка чёрные (NIL). Красим брата в красный.'
		});
		// шаг 3: перекраска брата, двойной чёрный поднимается к 30
		F.push({
			nodes: [mk(30, 'BB', 0, 0), r40('R')],
			edges: [[30, 40]],
			dbl: 30,
			brother: null,
			caseLabel: 'Случай 2',
			note: 'Брат стал красным; недостаток чёрного поднялся к 30 — теперь двойной чёрный на нём.'
		});
		// шаг 4: 30 — корень, гасим двойной чёрный
		F.push({
			nodes: [mk(30, 'B', 0, 0), r40('R')],
			edges: [[30, 40]],
			dbl: null,
			brother: null,
			caseLabel: 'Готово',
			note: 'Двойной чёрный достиг корня — просто отбрасываем его. Чёрная высота восстановлена.'
		});
		return F;
	}

	// ───────────────────────────────────────────────────────────────────────
	// Сценарий B. Случай 4 (дальний красный ребёнок брата) → поворот + перекраска.
	// Дерево:
	//            30(B)
	//          /        \
	//       20(B)       40(B)
	//                       \
	//                       50(R)
	// Удаляем 20 (чёрный лист). Двойной чёрный на месте 20.
	// Брат 40(B), дальний ребёнок 50 красный → Случай 4:
	// брат ← цвет отца, отец → чёрный, дальний ребёнок → чёрный, левый поворот вокруг 30.
	function scnB(): Frame[] {
		const F: Frame[] = [];
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(20, 'B', 1, 0), mk(40, 'B', 1, 1), mk(50, 'R', 2, 3)],
			edges: [[30, 20], [30, 40], [40, 50]],
			dbl: null,
			brother: null,
			caseLabel: 'Старт',
			note: 'Удаляем 20 — чёрный лист. Брат 40 чёрный, его дальний (правый) ребёнок 50 — красный.'
		});
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(-1, 'BB', 1, 0, true), mk(40, 'B', 1, 1), mk(50, 'R', 2, 3)],
			edges: [[30, -1], [30, 40], [40, 50]],
			dbl: -1,
			brother: 40,
			caseLabel: 'BST-удаление',
			note: '20 удалён; на его месте NIL с двойным чёрным. Идём чинить.'
		});
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(-1, 'BB', 1, 0, true), mk(40, 'B', 1, 1), mk(50, 'R', 2, 3)],
			edges: [[30, -1], [30, 40], [40, 50]],
			dbl: -1,
			brother: 40,
			caseLabel: 'Случай 4',
			note: 'Брат 40 чёрный, дальний ребёнок 50 красный. Брат ← цвет отца (чёрный), отец 30 → чёрный, 50 → чёрный.'
		});
		// перекраска перед поворотом
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(-1, 'BB', 1, 0, true), mk(40, 'B', 1, 1), mk(50, 'B', 2, 3)],
			edges: [[30, -1], [30, 40], [40, 50]],
			dbl: -1,
			brother: 40,
			caseLabel: 'Случай 4',
			note: 'Цвета расставлены (30 и 40 чёрные, 50 теперь чёрный). Делаем левый поворот вокруг 30.'
		});
		// после левого поворота вокруг 30: 40 — корень, слева 30, у 30 слева NIL, справа 50
		F.push({
			nodes: [mk(40, 'B', 0, 0), mk(30, 'B', 1, 0), mk(50, 'B', 1, 1)],
			edges: [[40, 30], [40, 50]],
			dbl: null,
			brother: null,
			caseLabel: 'Готово',
			note: 'Левый поворот вокруг 30 завершён. Двойной чёрный снят, чёрная высота всех веток равна.'
		});
		return F;
	}

	// ───────────────────────────────────────────────────────────────────────
	// Сценарий C. Случай 3 (ближний красный) → Случай 4. Дерево:
	//            30(B)
	//          /        \
	//       20(B)       40(B)
	//                   /
	//                 35(R)
	// Удаляем 20. Брат 40(B): ближний (левый) ребёнок 35 красный, дальний — NIL чёрный.
	// Случай 3: 35 → чёрный, брат → красный, ПРАВЫЙ поворот вокруг брата 40 → новый брат 35,
	// далее Случай 4.
	function scnC(): Frame[] {
		const F: Frame[] = [];
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(20, 'B', 1, 0), mk(40, 'B', 1, 1), mk(35, 'R', 2, 2)],
			edges: [[30, 20], [30, 40], [40, 35]],
			dbl: null,
			brother: null,
			caseLabel: 'Старт',
			note: 'Удаляем 20. Брат 40 чёрный; красный ребёнок 35 — ближний (левый), дальний — NIL (чёрный).'
		});
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(-1, 'BB', 1, 0, true), mk(40, 'B', 1, 1), mk(35, 'R', 2, 2)],
			edges: [[30, -1], [30, 40], [40, 35]],
			dbl: -1,
			brother: 40,
			caseLabel: 'BST-удаление',
			note: '20 удалён; на его месте NIL с двойным чёрным.'
		});
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(-1, 'BB', 1, 0, true), mk(40, 'B', 1, 1), mk(35, 'R', 2, 2)],
			edges: [[30, -1], [30, 40], [40, 35]],
			dbl: -1,
			brother: 40,
			caseLabel: 'Случай 3',
			note: 'Красный ребёнок брата — ближний. Красим 35 в чёрный, брата 40 в красный, правый поворот вокруг 40.'
		});
		// после правого поворота вокруг 40: 35 поднялся, 40 стал его правым ребёнком
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(-1, 'BB', 1, 0, true), mk(35, 'B', 1, 1), mk(40, 'R', 2, 3)],
			edges: [[30, -1], [30, 35], [35, 40]],
			dbl: -1,
			brother: 35,
			caseLabel: 'Случай 3 → 4',
			note: 'Новый брат — 35 (чёрный), его дальний (правый) ребёнок 40 — красный. Это уже Случай 4.'
		});
		F.push({
			nodes: [mk(30, 'B', 0, 0), mk(-1, 'BB', 1, 0, true), mk(35, 'B', 1, 1), mk(40, 'B', 2, 3)],
			edges: [[30, -1], [30, 35], [35, 40]],
			dbl: -1,
			brother: 35,
			caseLabel: 'Случай 4',
			note: 'Брат ← цвет отца (чёрный), отец 30 → чёрный, дальний 40 → чёрный. Левый поворот вокруг 30.'
		});
		F.push({
			nodes: [mk(35, 'B', 0, 0), mk(30, 'B', 1, 0), mk(40, 'B', 1, 1)],
			edges: [[35, 30], [35, 40]],
			dbl: null,
			brother: null,
			caseLabel: 'Готово',
			note: 'Левый поворот вокруг 30 завершён. Двойной чёрный снят, чёрная высота выровнена.'
		});
		return F;
	}

	// ───────────────────────────────────────────────────────────────────────
	// Сценарий D. Случай 1 (красный брат) → сводится к Случаю 2/4. Дерево:
	//            30(B)
	//          /        \
	//       20(B)       40(R)
	//                  /     \
	//               35(B)    50(B)
	// Удаляем 20. Брат 40 КРАСНЫЙ → Случай 1: брат → чёрный, отец 30 → красный,
	// левый поворот вокруг 30. Новый брат 35(B) с чёрными детьми → Случай 2,
	// двойной чёрный поднимается к 30 (красный) → красим 30 в чёрный → конец.
	function scnD(): Frame[] {
		const F: Frame[] = [];
		F.push({
			nodes: [
				mk(30, 'B', 0, 0),
				mk(20, 'B', 1, 0),
				mk(40, 'R', 1, 1),
				mk(35, 'B', 2, 2),
				mk(50, 'B', 2, 3)
			],
			edges: [[30, 20], [30, 40], [40, 35], [40, 50]],
			dbl: null,
			brother: null,
			caseLabel: 'Старт',
			note: 'Удаляем 20 (чёрный лист). Брат 40 — КРАСНЫЙ. Это Случай 1.'
		});
		F.push({
			nodes: [
				mk(30, 'B', 0, 0),
				mk(-1, 'BB', 1, 0, true),
				mk(40, 'R', 1, 1),
				mk(35, 'B', 2, 2),
				mk(50, 'B', 2, 3)
			],
			edges: [[30, -1], [30, 40], [40, 35], [40, 50]],
			dbl: -1,
			brother: 40,
			caseLabel: 'BST-удаление',
			note: '20 удалён; на его месте NIL с двойным чёрным. Брат 40 красный.'
		});
		F.push({
			nodes: [
				mk(30, 'R', 0, 0),
				mk(-1, 'BB', 1, 0, true),
				mk(40, 'B', 1, 1),
				mk(35, 'B', 2, 2),
				mk(50, 'B', 2, 3)
			],
			edges: [[30, -1], [30, 40], [40, 35], [40, 50]],
			dbl: -1,
			brother: 40,
			caseLabel: 'Случай 1',
			note: 'Брат 40 → чёрный, отец 30 → красный. Делаем левый поворот вокруг 30.'
		});
		// после левого поворота вокруг 30: 40 — корень; слева поддерево 30 (с NIL и 35),
		// справа 50. Новый брат двойного чёрного — 35 (чёрный).
		F.push({
			nodes: [
				mk(40, 'B', 0, 0),
				mk(30, 'R', 1, 0),
				mk(50, 'B', 1, 1),
				mk(-1, 'BB', 2, 0, true),
				mk(35, 'B', 2, 1)
			],
			edges: [[40, 30], [40, 50], [30, -1], [30, 35]],
			dbl: -1,
			brother: 35,
			caseLabel: 'Случай 1 → 2',
			note: 'Поворот сделан. Новый брат двойного чёрного — 35 (чёрный) с чёрными детьми. Это Случай 2.'
		});
		F.push({
			nodes: [
				mk(40, 'B', 0, 0),
				mk(30, 'R', 1, 0),
				mk(50, 'B', 1, 1),
				mk(-1, 'BB', 2, 0, true),
				mk(35, 'R', 2, 1)
			],
			edges: [[40, 30], [40, 50], [30, -1], [30, 35]],
			dbl: -1,
			brother: 35,
			caseLabel: 'Случай 2',
			note: 'Брат 35 → красный; недостаток чёрного поднимается к отцу 30.'
		});
		F.push({
			nodes: [mk(40, 'B', 0, 0), mk(30, 'BB', 1, 0), mk(50, 'B', 1, 1), mk(35, 'R', 2, 1)],
			edges: [[40, 30], [40, 50], [30, 35]],
			dbl: 30,
			brother: null,
			caseLabel: 'Случай 2',
			note: '30 теперь двойной чёрный, но он КРАСНЫЙ узел: красно-чёрный = просто чёрный. Гасим лишний чёрный.'
		});
		F.push({
			nodes: [mk(40, 'B', 0, 0), mk(30, 'B', 1, 0), mk(50, 'B', 1, 1), mk(35, 'R', 2, 1)],
			edges: [[40, 30], [40, 50], [30, 35]],
			dbl: null,
			brother: null,
			caseLabel: 'Готово',
			note: '30 стал просто чёрным. Двойной чёрный снят, чёрная высота восстановлена.'
		});
		return F;
	}

	const SCN: Scn[] = [
		{ key: 0, title: 'Случай 1 (красный брат)', build: scnD },
		{ key: 1, title: 'Случай 2 (чёрный брат, чёрные дети)', build: scnA },
		{ key: 2, title: 'Случай 3 (ближний красный)', build: scnC },
		{ key: 3, title: 'Случай 4 (дальний красный)', build: scnB }
	];

	let scnIdx = $state(0);
	let idx = $state(0);
	let playing = $state(false);

	const frames = $derived(SCN[scnIdx].build());
	const cur = $derived(frames[Math.min(idx, frames.length - 1)]);
	const nodeByKey = $derived(new Map(cur.nodes.map((n) => [n.key, n])));

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
	function pickScn(i: number) {
		if (i === scnIdx) return;
		scnIdx = i;
		reset();
	}

	function fill(c: Color): string {
		return c === 'R' ? 'var(--blue)' : 'var(--color-ink-700)';
	}
</script>

<div class="rb">
	<div class="rb__bar">
		<div class="seg">
			{#each SCN as s, i}
				<button class:on={scnIdx === i} onclick={() => pickScn(i)}>{s.title}</button>
			{/each}
		</div>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={() => { stop(); idx = Math.max(0, idx - 1); }} title="шаг назад">◀</button>
			{#if playing}
				<button onclick={stop} title="пауза">⏸</button>
			{:else}
				<button onclick={play} title="играть">▶</button>
			{/if}
			<button onclick={() => { stop(); idx = Math.min(frames.length - 1, idx + 1); }} title="шаг вперёд">▶▶</button>
			<span class="cnt">{idx}/{frames.length - 1}</span>
		</div>
	</div>

	<div class="rb__body">
		<svg viewBox="0 0 420 230" class="rb__svg" preserveAspectRatio="xMidYMid meet">
			{#each cur.edges as [a, b]}
				{@const pa = nodeByKey.get(a)}
				{@const pb = nodeByKey.get(b)}
				{#if pa && pb}
					<line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} class="edge" />
				{/if}
			{/each}

			{#each cur.nodes as n}
				<g
					class="node"
					class:nil={n.nil}
					class:dbl={cur.dbl === n.key}
					class:bro={cur.brother === n.key}
				>
					{#if cur.dbl === n.key}
						<circle cx={n.x} cy={n.y} r="19" class="ring" />
					{/if}
					{#if n.nil}
						<rect x={n.x - 11} y={n.y - 9} width="22" height="18" rx="3" style="fill: {fill(n.color === 'BB' ? 'B' : n.color)}" />
						<text x={n.x} y={n.y} dy="0.32em" class="niltext">NIL</text>
					{:else}
						<circle cx={n.x} cy={n.y} r="15" style="fill: {fill(n.color === 'BB' ? 'B' : n.color)}" />
						<text x={n.x} y={n.y} dy="0.34em">{n.key}</text>
					{/if}
				</g>
			{/each}
		</svg>

		<div class="rb__panel">
			<div class="caseTag" class:done={cur.caseLabel === 'Готово'}>{cur.caseLabel}</div>
			<div class="legend">
				<span><i class="sw r"></i> красный</span>
				<span><i class="sw b"></i> чёрный</span>
				<span><i class="sw bb"></i> двойной чёрный</span>
				<span><i class="sw br"></i> брат</span>
			</div>
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
		gap: 0.8rem;
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
		font-size: 0.68rem;
		padding: 0.32rem 0.55rem;
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
	.rb__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.rb__svg {
		flex: 1 1 320px;
		min-width: 280px;
		max-width: 460px;
		height: auto;
	}
	.edge {
		stroke: var(--color-ink-500);
		stroke-width: 2.5;
		transition: all 0.3s ease;
	}
	.node circle,
	.node rect {
		stroke: var(--color-ink-500);
		stroke-width: 2;
		transition: fill 0.3s, stroke 0.3s;
	}
	.node text {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.85rem;
		fill: var(--color-parch-100);
	}
	.node .niltext {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.5rem;
		fill: var(--color-parch-muted);
	}
	.node.bro circle,
	.node.bro rect {
		stroke: var(--color-parch-100);
		stroke-width: 3;
	}
	.node .ring {
		fill: none;
		stroke: var(--blue);
		stroke-width: 2.5;
		stroke-dasharray: 4 3;
		animation: spin 6s linear infinite;
		transform-box: fill-box;
		transform-origin: center;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.node.dbl text,
	.node.dbl .niltext {
		fill: var(--blue);
	}
	.rb__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.caseTag {
		align-self: flex-start;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.82rem;
		color: #fff;
		background: var(--blue);
		padding: 0.28rem 0.7rem;
		border-radius: 7px;
	}
	.caseTag.done {
		background: var(--color-ink-700);
		color: var(--color-parch-100);
		border: 1.5px solid var(--blue);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.7rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}
	.legend .sw {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		border: 1.5px solid var(--color-ink-500);
	}
	.legend .sw.r {
		background: var(--blue);
	}
	.legend .sw.b {
		background: var(--color-ink-700);
	}
	.legend .sw.bb {
		background: var(--color-ink-700);
		border: 2px dashed var(--blue);
	}
	.legend .sw.br {
		background: transparent;
		border: 2px solid var(--color-parch-100);
	}
	.note {
		margin-top: auto;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--color-parch-200);
		padding: 0.6rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
</style>
