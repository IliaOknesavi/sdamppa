<script lang="ts">
	// Interactive numpy dtype table. Rows = scalar types, columns = bytes / bits /
	// range or precision. Click a row to reveal detail + a worked overflow (wrap-
	// around) example, plus how Python's arbitrary-precision int and C's fixed
	// types compare. No animation — focus on a readable table. Pure HTML, no deps.
	type Row = {
		id: string;
		kind: 'int' | 'uint' | 'float' | 'bool';
		bytes: number;
		range: string; // human-readable range / precision
		min?: number; // for the overflow demo (signed/unsigned integers)
		max?: number;
		c: string; // analogous C type (fixed width)
		detail: string;
		demo?: { expr: string; got: string; why: string };
	};

	// 2^53 fits in JS number exactly; int64 endpoints shown as text only.
	const rows: Row[] = [
		{
			id: 'int8', kind: 'int', bytes: 1, range: '−128 … 127', min: -128, max: 127,
			c: 'int8_t / signed char',
			detail: '8-битное знаковое целое. Один бит уходит на знак, поэтому модуль меньше, чем у uint8.',
			demo: { expr: 'int8(127) + int8(1)', got: '-128', why: '127 — это максимум; +1 переполняет старший бит и значение «заворачивается» к минимуму −128 (wrap-around по модулю 2⁸).' }
		},
		{
			id: 'int16', kind: 'int', bytes: 2, range: '−32 768 … 32 767', min: -32768, max: 32767,
			c: 'int16_t / short',
			detail: '16-битное знаковое целое. Хватает для небольших счётчиков и координат.',
			demo: { expr: 'int16(32767) + int16(1)', got: '-32768', why: 'Снова переход через максимум: результат заворачивается по модулю 2¹⁶.' }
		},
		{
			id: 'int32', kind: 'int', bytes: 4, range: '−2.147e9 … 2.147e9', min: -2147483648, max: 2147483647,
			c: 'int32_t / int',
			detail: '32-битное знаковое целое — типичный «int» в C. Дефолт numpy для целых на многих платформах Windows.',
			demo: { expr: 'int32(2_147_483_647) + 1', got: '-2147483648', why: 'Классическое переполнение int32 (например, баг 32-битного timestamp).' }
		},
		{
			id: 'int64', kind: 'int', bytes: 8, range: '−9.22e18 … 9.22e18',
			c: 'int64_t / long long',
			detail: '64-битное знаковое целое — дефолт numpy для целых на Linux/macOS. Огромный, но всё равно конечный.',
			demo: { expr: 'int64(9.22e18) + int64(1)', got: '-9223372036854775808', why: 'Даже int64 имеет предел: за максимумом — заворот к минимуму.' }
		},
		{
			id: 'uint8', kind: 'uint', bytes: 1, range: '0 … 255', min: 0, max: 255,
			c: 'uint8_t / unsigned char',
			detail: '8-битное беззнаковое целое. Канал цвета пикселя (0…255) — типичный случай.',
			demo: { expr: 'uint8(255) + uint8(1)', got: '0', why: 'Нет знакового бита: после 255 идёт 0 (wrap-around по модулю 2⁸). А uint8(0) − 1 даст 255.' }
		},
		{
			id: 'float32', kind: 'float', bytes: 4, range: '≈ 7 знач. цифр, ±3.4e38',
			c: 'float',
			detail: '32-битное число с плавающей точкой (1 знак + 8 экспонента + 23 мантисса). Экономит память в ML-моделях.',
			demo: { expr: 'float32(0.1) + float32(0.2)', got: '0.3 (≈0.30000001)', why: 'Не переполнение, а потеря точности: 0.1 и 0.2 непредставимы точно в двоичной дроби. У float32 всего ~7 значащих цифр.' }
		},
		{
			id: 'float64', kind: 'float', bytes: 8, range: '≈ 15-16 знач. цифр, ±1.8e308',
			c: 'double',
			detail: '64-битное число с плавающей точкой — дефолт numpy и Python float. 52 бита мантиссы.',
			demo: { expr: 'float64(1e308) * 10', got: 'inf', why: 'За пределом ±1.8e308 значение становится inf — переполнение float не заворачивается, а уходит в бесконечность.' }
		},
		{
			id: 'bool', kind: 'bool', bytes: 1, range: 'False / True',
			c: 'bool / _Bool',
			detail: 'Логический тип. Хранится в целом байте (а не бите) — на массив из N элементов уходит N байт.',
			demo: { expr: 'True + True', got: '2', why: 'В арифметике bool ведёт себя как 0/1 и при сложении превращается в int — это не переполнение, а повышение типа.' }
		}
	];

	const kindLabel: Record<Row['kind'], string> = {
		int: 'знаковое целое',
		uint: 'беззнаковое целое',
		float: 'плавающая точка',
		bool: 'логический'
	};

	let selected = $state('int8');
	const cur = $derived(rows.find((r) => r.id === selected) ?? rows[0]);
	const bits = $derived(cur.bytes * 8);

	// number line for the integer overflow demo (signed/unsigned only)
	const hasLine = $derived(cur.min !== undefined && cur.max !== undefined && bits <= 16);
</script>

<div class="nd">
	<div class="nd__bar">
		<span class="nd__title">numpy <code>dtype</code>: фиксированный размер против Python и C</span>
	</div>

	<div class="nd__body">
		<div class="nd__tablewrap">
			<table class="nd__table">
				<thead>
					<tr>
						<th class="l">тип</th>
						<th>байт</th>
						<th>бит</th>
						<th class="l">диапазон / точность</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as r}
						<tr
							class="k-{r.kind}"
							class:on={selected === r.id}
							onclick={() => (selected = r.id)}
							tabindex="0"
							role="button"
							aria-pressed={selected === r.id}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selected = r.id; } }}
						>
							<td class="l mono">{r.id}</td>
							<td class="mono">{r.bytes}</td>
							<td class="mono">{r.bytes * 8}</td>
							<td class="l rng">{r.range}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="legend">
				<span class="dot k-int"></span>int
				<span class="dot k-uint"></span>uint
				<span class="dot k-float"></span>float
				<span class="dot k-bool"></span>bool
			</div>
		</div>

		<div class="nd__panel">
			<div class="head">
				<span class="name mono">{cur.id}</span>
				<span class="badge">{kindLabel[cur.kind]} · {cur.bytes} Б · {bits} бит</span>
			</div>
			<p class="detail">{cur.detail}</p>

			{#if cur.demo}
				<div class="demo">
					<div class="demo-row">
						<span class="lbl">пример</span>
						<code class="expr">{cur.demo.expr}</code>
					</div>
					<div class="demo-row">
						<span class="lbl">результат</span>
						<code class="got">{cur.demo.got}</code>
					</div>
					{#if hasLine}
						<div class="line">
							<span class="end">{cur.min}</span>
							<div class="track">
								<i class="wrap"></i>
								<i class="tick max" style="left: 100%"></i>
								<i class="tick zero" style="left: 50%"></i>
							</div>
							<span class="end">{cur.max}</span>
						</div>
						<div class="line-cap">за {cur.max} следует {cur.min} — счётчик заворачивается по кругу</div>
					{/if}
					<p class="why">{cur.demo.why}</p>
				</div>
			{/if}

			<div class="cmp">
				<div class="cmp-col c-np">
					<span class="ch">numpy</span>
					<b>фикс. {cur.bytes} Б</b>
					<small>переполняется молча (wrap / inf)</small>
				</div>
				<div class="cmp-col c-py">
					<span class="ch">Python int</span>
					<b>безразмерный</b>
					<small>произвольная точность, не переполняется</small>
				</div>
				<div class="cmp-col c-c">
					<span class="ch">C</span>
					<b class="mono">{cur.c}</b>
					<small>фикс. размер, как у numpy</small>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.nd {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.nd__bar {
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.nd__title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.82rem;
		color: var(--color-parch-100);
	}
	.nd__title code {
		font-family: var(--font-mono);
		color: var(--blue);
	}
	.nd__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.nd__tablewrap {
		flex: 1 1 240px;
		min-width: 230px;
	}
	.nd__table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.78rem;
	}
	.nd__table th {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
		font-weight: 600;
		text-align: right;
		padding: 0.25rem 0.4rem;
		border-bottom: 1.5px solid var(--color-ink-600);
	}
	.nd__table th.l { text-align: left; }
	.nd__table td {
		padding: 0.32rem 0.4rem;
		text-align: right;
		color: var(--color-parch-200);
		border-bottom: 1px solid var(--color-ink-700);
	}
	.nd__table td.l { text-align: left; }
	.nd__table td.mono { font-family: var(--font-mono); }
	.nd__table td.rng {
		font-size: 0.7rem;
		color: var(--color-parch-muted);
		font-family: var(--font-mono);
	}
	.nd__table tbody tr {
		cursor: pointer;
		border-left: 3px solid transparent;
		transition: background 0.15s;
	}
	.nd__table tbody tr:hover { background: var(--color-ink-800); }
	.nd__table tbody tr:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: -2px;
	}
	/* kind accent on the type cell */
	.nd__table td.l.mono { border-left: 3px solid transparent; padding-left: 0.5rem; }
	.k-int td.l.mono { border-left-color: var(--blue); }
	.k-uint td.l.mono { border-left-color: var(--color-parch-muted); }
	.k-float td.l.mono { border-left-color: var(--blue-pale); }
	.k-bool td.l.mono { border-left-color: var(--color-ink-500); }
	.nd__table tbody tr.on {
		background: var(--blue-pale);
	}
	.nd__table tbody tr.on td {
		color: var(--color-ink-850);
		border-bottom-color: var(--blue);
	}
	.nd__table tbody tr.on td.rng { color: var(--color-ink-700); }

	.legend {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
		flex-wrap: wrap;
	}
	.legend .dot {
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 2px;
		display: inline-block;
		margin-left: 0.5rem;
	}
	.legend .dot:first-child { margin-left: 0; }
	.dot.k-int { background: var(--blue); }
	.dot.k-uint { background: var(--color-parch-muted); }
	.dot.k-float { background: var(--blue-pale); }
	.dot.k-bool { background: var(--color-ink-500); }

	.nd__panel {
		flex: 1 1 250px;
		min-width: 240px;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.head {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.head .name {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--blue);
	}
	.head .badge {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
		background: var(--color-ink-800);
		border: 1px solid var(--color-ink-600);
		border-radius: 5px;
		padding: 0.12rem 0.4rem;
	}
	.detail {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--color-parch-200);
	}
	.demo {
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
		padding: 0.55rem 0.65rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.demo-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}
	.demo-row .lbl {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		width: 4.2rem;
		flex: none;
	}
	.demo-row .expr {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--color-parch-100);
	}
	.demo-row .got {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--blue);
	}
	.line {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.15rem;
	}
	.line .end {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
		flex: none;
	}
	.track {
		position: relative;
		flex: 1;
		height: 0.55rem;
		background: var(--color-ink-700);
		border-radius: 4px;
	}
	.track .wrap {
		position: absolute;
		inset: 0;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--blue-pale), var(--blue));
		opacity: 0.55;
	}
	.track .tick {
		position: absolute;
		top: -2px;
		width: 2px;
		height: calc(100% + 4px);
		transform: translateX(-1px);
	}
	.track .tick.max { background: var(--blue); }
	.track .tick.zero { background: var(--color-parch-100); opacity: 0.6; }
	.line-cap {
		font-size: 0.68rem;
		color: var(--color-parch-muted);
		font-family: var(--font-mono);
	}
	.why {
		margin: 0;
		font-size: 0.78rem;
		line-height: 1.38;
		color: var(--color-parch-200);
	}
	.cmp {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}
	.cmp-col {
		flex: 1 1 7rem;
		min-width: 6.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		padding: 0.45rem 0.5rem;
		border-radius: 7px;
		border: 1px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.cmp-col .ch {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.cmp-col b {
		font-family: var(--font-display);
		font-size: 0.8rem;
		color: var(--color-parch-100);
	}
	.cmp-col b.mono {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		word-break: break-word;
	}
	.cmp-col small {
		font-size: 0.66rem;
		line-height: 1.3;
		color: var(--color-parch-muted);
	}
	.cmp-col.c-np { border-left: 3px solid var(--blue); }
	.cmp-col.c-py { border-left: 3px solid var(--blue-pale); }
	.cmp-col.c-c { border-left: 3px solid var(--color-ink-500); }
</style>
