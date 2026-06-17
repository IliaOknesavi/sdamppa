<script lang="ts">
	// Interactive comparison table of priority-queue implementations.
	// Rows = data structures, columns = operations, cells = asymptotics.
	// Click a row or a column header to highlight it; the footer explains why
	// the binary heap is the practical pick for Dijkstra, and the Fibonacci
	// heap the theoretically optimal one. No animation — readable static table.
	// Pure inline HTML, no deps.
	type Cls = 'best' | 'ok' | 'bad';
	type Cell = { t: string; c: Cls };
	type Row = { id: string; name: string; cells: Cell[]; note: string };

	const ops = ['insert', 'find-min', 'extract-min', 'decrease-key'];

	const rows: Row[] = [
		{
			id: 'array',
			name: 'Массив (несорт.)',
			cells: [
				{ t: 'O(1)', c: 'best' },
				{ t: 'O(n)', c: 'bad' },
				{ t: 'O(n)', c: 'bad' },
				{ t: 'O(1)', c: 'best' }
			],
			note: 'Кидаем в конец за O(1), но минимум каждый раз ищем перебором — O(n).'
		},
		{
			id: 'sorted',
			name: 'Сорт. список',
			cells: [
				{ t: 'O(n)', c: 'bad' },
				{ t: 'O(1)', c: 'best' },
				{ t: 'O(1)', c: 'best' },
				{ t: 'O(n)', c: 'bad' }
			],
			note: 'Зеркало массива: минимум на конце за O(1), зато вставка ищет место за O(n).'
		},
		{
			id: 'rbtree',
			name: 'Красно-чёрное дерево',
			cells: [
				{ t: 'O(log n)', c: 'ok' },
				{ t: 'O(log n)', c: 'ok' },
				{ t: 'O(log n)', c: 'ok' },
				{ t: 'O(log n)', c: 'ok' }
			],
			note: 'Сбалансированное BST: все операции за O(log n), минимум — самый левый узел.'
		},
		{
			id: 'btree',
			name: 'B-дерево',
			cells: [
				{ t: 'O(log n)', c: 'ok' },
				{ t: 'O(log n)', c: 'ok' },
				{ t: 'O(log n)', c: 'ok' },
				{ t: 'O(log n)', c: 'ok' }
			],
			note: 'Та же логарифмика, но широкие узлы дружат с диском/кэшем — выбор для БД, не для ОЗУ-очереди.'
		},
		{
			id: 'binheap',
			name: 'Бинарная куча',
			cells: [
				{ t: 'O(log n)', c: 'ok' },
				{ t: 'O(1)', c: 'best' },
				{ t: 'O(log n)', c: 'ok' },
				{ t: 'O(log n)', c: 'ok' }
			],
			note: 'find-min за O(1) (корень), остальное — O(log n). Хранится в массиве: компактно и быстро на практике.'
		},
		{
			id: 'fibheap',
			name: 'Фибоначчиева куча',
			cells: [
				{ t: 'O(1)', c: 'best' },
				{ t: 'O(1)', c: 'best' },
				{ t: 'O(log n)*', c: 'ok' },
				{ t: 'O(1)*', c: 'best' }
			],
			note: 'decrease-key за O(1) амортизированно (* — амортизация). Теоретически лучшая, но большие константы и сложная реализация.'
		}
	];

	let selRow = $state<string | null>('binheap');
	let selCol = $state<number | null>(null);

	const activeRow = $derived(rows.find((r) => r.id === selRow) ?? null);

	function clickRow(id: string) {
		selRow = selRow === id ? null : id;
	}
	function clickCol(i: number) {
		selCol = selCol === i ? null : i;
	}
	function reset() {
		selRow = null;
		selCol = null;
	}

	// Dijkstra cost = V·(insert + extract-min) + E·decrease-key.
	// Footer verdict text depends on which column is in focus.
	const dijkstra = $derived.by(() => {
		if (selCol === 0)
			return 'insert: фибоначчиева даёт O(1), но это не узкое место — на бинарной O(log V) тоже отлично.';
		if (selCol === 1)
			return 'find-min: и у бинарной, и у фибоначчиевой минимум за O(1). Дейкстра берёт его на каждом шаге.';
		if (selCol === 2)
			return 'extract-min повторяется V раз → V·O(log V). Это и даёт основной логарифмический член.';
		if (selCol === 3)
			return 'decrease-key зовётся до E раз. Фибоначчиева делает его за O(1) → итог O(E + V·log V).';
		return 'Дейкстра = V·(insert + extract-min) + E·decrease-key. Бинарная куча даёт O((V+E)·log V) — простой и быстрый выбор на практике; фибоначчиева снижает до O(E + V·log V), но проигрывает константами.';
	});
</script>

<div class="pq">
	<div class="pq__bar">
		<span class="title">Приоритетная очередь: сравнение реализаций</span>
		<div class="ctrl">
			<span class="hint">клик по строке / столбцу — подсветка</span>
			<button onclick={reset} title="сброс выделения">↺ сброс</button>
		</div>
	</div>

	<div class="pq__scroll">
		<table class="pq__table">
			<thead>
				<tr>
					<th class="corner">структура</th>
					{#each ops as op, i}
						<th
							class="op"
							class:sel={selCol === i}
							onclick={() => clickCol(i)}
						>{op}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as r}
					<tr class:selrow={selRow === r.id}>
						<th
							class="name"
							class:sel={selRow === r.id}
							onclick={() => clickRow(r.id)}
						>{r.name}</th>
						{#each r.cells as cell, i}
							<td
								class="cell {cell.c}"
								class:colsel={selCol === i}
								class:rowsel={selRow === r.id}
								class:cross={selRow === r.id && selCol === i}
								onclick={() => { clickRow(r.id); }}
							>{cell.t}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="pq__legend">
		<span><i class="sw best"></i>O(1)</span>
		<span><i class="sw ok"></i>O(log n)</span>
		<span><i class="sw bad"></i>O(n)</span>
		<span class="amort">* — амортизированно</span>
	</div>

	{#if activeRow}
		<div class="pq__rownote">
			<b>{activeRow.name}.</b> {activeRow.note}
		</div>
	{/if}

	<div class="pq__verdict">
		<span class="vlabel">Лучший выбор для Дейкстры</span>
		<p>{dijkstra}</p>
	</div>
</div>

<style>
	.pq {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.pq__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.86rem;
		color: var(--color-parch-100);
	}
	.ctrl {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	.hint {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
	}
	.ctrl button {
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		padding: 0.3rem 0.55rem;
	}
	.ctrl button:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.pq__scroll {
		overflow-x: auto;
		padding: 0.6rem;
	}
	.pq__table {
		width: 100%;
		min-width: 380px;
		border-collapse: collapse;
		font-family: var(--font-mono);
	}
	.pq__table th,
	.pq__table td {
		text-align: center;
		padding: 0.34rem 0.4rem;
		border: 1px solid var(--color-ink-700);
	}
	.corner {
		text-align: left;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		font-weight: 400;
	}
	.op {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-parch-200);
		cursor: pointer;
		background: var(--color-ink-800);
		white-space: nowrap;
		transition: background 0.15s, color 0.15s;
	}
	.op:hover {
		color: var(--blue);
	}
	.op.sel {
		background: var(--blue);
		color: #fff;
	}
	.name {
		text-align: left;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.7rem;
		color: var(--color-parch-100);
		cursor: pointer;
		background: var(--color-ink-800);
		white-space: nowrap;
		transition: background 0.15s, color 0.15s;
	}
	.name:hover {
		color: var(--blue);
	}
	.name.sel {
		background: var(--blue);
		color: #fff;
	}
	.cell {
		font-size: 0.7rem;
		font-weight: 700;
		cursor: pointer;
		color: var(--color-parch-100);
		transition: background 0.15s, filter 0.15s;
	}
	.cell.best {
		background: var(--blue-pale);
		color: var(--blue);
	}
	.cell.ok {
		background: var(--color-ink-800);
		color: var(--color-parch-100);
	}
	.cell.bad {
		background: var(--color-ink-700);
		color: var(--color-parch-muted);
	}
	.cell.colsel,
	.cell.rowsel {
		filter: brightness(1.18);
		box-shadow: inset 0 0 0 1.5px var(--blue);
	}
	.cell.cross {
		box-shadow: inset 0 0 0 2.5px var(--blue);
		filter: brightness(1.3);
	}
	tr.selrow .name.sel {
		box-shadow: inset 0 0 0 1px var(--blue);
	}
	.pq__legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		align-items: center;
		padding: 0.1rem 0.9rem 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.pq__legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.sw {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 3px;
		display: inline-block;
	}
	.sw.best {
		background: var(--blue-pale);
		border: 1.5px solid var(--blue);
	}
	.sw.ok {
		background: var(--color-ink-800);
		border: 1.5px solid var(--color-ink-500);
	}
	.sw.bad {
		background: var(--color-ink-700);
		border: 1.5px solid var(--color-ink-600);
	}
	.amort {
		margin-left: auto;
	}
	.pq__rownote {
		margin: 0 0.9rem 0.7rem;
		font-size: 0.78rem;
		color: var(--color-parch-200);
		padding: 0.5rem 0.65rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
	}
	.pq__rownote b {
		color: var(--color-parch-100);
		font-family: var(--font-display);
	}
	.pq__verdict {
		padding: 0.7rem 0.9rem 0.9rem;
		border-top: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.vlabel {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.pq__verdict p {
		margin: 0.35rem 0 0;
		font-size: 0.82rem;
		color: var(--color-parch-200);
		line-height: 1.45;
	}
</style>
