<script lang="ts">
	// Дробный рюкзак (fractional knapsack), жадный алгоритм. Сортируем предметы
	// по убыванию удельной стоимости ρ = v/w, ссыпаем целиком, последний берём
	// дробной долей ровно до лимита. Тумблер дробный/0-1 показывает контраст:
	// в 0-1 неподходящий предмет пропускается и рюкзак остаётся недозаполненным.
	// Контролы шаг/плей/сброс, бегущий счётчик стоимости. Чистый SVG, без зависимостей.
	type Item = { id: number; label: string; w: number; v: number };
	type Take = { id: number; frac: number; addW: number; addV: number };
	type Step = {
		taken: Take[]; // что уже положено к этому шагу
		usedW: number; // занятый вес
		totalV: number; // накопленная стоимость
		active: number | null; // id рассматриваемого предмета (id из items)
		note: string;
	};

	const CAP = 12;
	const items: Item[] = [
		{ id: 0, label: 'Золото', w: 2, v: 12 },
		{ id: 1, label: 'Серебро', w: 3, v: 15 },
		{ id: 2, label: 'Бронза', w: 5, v: 20 },
		{ id: 3, label: 'Камни', w: 6, v: 18 },
		{ id: 4, label: 'Песок', w: 4, v: 8 }
	];
	const rho = (it: Item) => it.v / it.w;
	// порядок обработки: по убыванию ρ (стабильно по id при равенстве)
	const order = $derived(
		[...items].sort((a, b) => rho(b) - rho(a) || a.id - b.id)
	);

	function buildSteps(mode: 'frac' | '01', ord: Item[]): Step[] {
		const steps: Step[] = [];
		const taken: Take[] = [];
		let usedW = 0;
		let totalV = 0;
		steps.push({
			taken: [], usedW: 0, totalV: 0, active: null,
			note: `Старт: рюкзак вместимости ${CAP}. Предметы отсортированы по ρ = v/w (по убыванию).`
		});
		let full = false;
		for (const it of ord) {
			const room = CAP - usedW;
			if (full || room <= 1e-9) {
				steps.push({
					taken: [...taken], usedW, totalV, active: it.id,
					note: `«${it.label}»: места нет — пропускаем.`
				});
				continue;
			}
			if (it.w <= room) {
				// влезает целиком
				usedW += it.w;
				totalV += it.v;
				taken.push({ id: it.id, frac: 1, addW: it.w, addV: it.v });
				steps.push({
					taken: [...taken], usedW, totalV, active: it.id,
					note: `«${it.label}» целиком: вес ${it.w}, +${it.v} к стоимости. Занято ${usedW}/${CAP}.`
				});
			} else if (mode === 'frac') {
				// дробная доля до лимита
				const frac = room / it.w;
				const addV = it.v * frac;
				usedW += room;
				totalV += addV;
				taken.push({ id: it.id, frac, addW: room, addV });
				steps.push({
					taken: [...taken], usedW, totalV, active: it.id,
					note: `«${it.label}» дробно: берём ${room}/${it.w} = ${(frac * 100).toFixed(0)}%, +${addV.toFixed(1)}. Рюкзак полон.`
				});
				full = true;
			} else {
				// 0-1: целиком не влезает — пропускаем (рюкзак недозаполнен)
				steps.push({
					taken: [...taken], usedW, totalV, active: it.id,
					note: `0-1: «${it.label}» (вес ${it.w}) не влезает в остаток ${room} — пропускаем целиком.`
				});
			}
		}
		const left = CAP - usedW;
		steps.push({
			taken: [...taken], usedW, totalV, active: null,
			note: mode === 'frac'
				? `Готово. Стоимость ${totalV.toFixed(1)}, рюкзак заполнен ровно до ${CAP}.`
				: `Готово. Стоимость ${totalV.toFixed(1)}; осталось ${left} свободного веса — 0-1 недозаполняет.`
		});
		return steps;
	}

	let mode = $state<'frac' | '01'>('frac');
	let idx = $state(0);
	let playing = $state(false);
	const steps = $derived(buildSteps(mode, order));
	const cur = $derived(steps[Math.min(idx, steps.length - 1)]);

	// быстрый доступ к доле взятого по id предмета на текущем шаге
	const takenById = $derived(new Map(cur.taken.map((t) => [t.id, t])));
	const fillPct = $derived((cur.usedW / CAP) * 100);
	// максимальная достижимая стоимость (для шкалы счётчика) — дробный оптимум
	const maxV = $derived(
		buildSteps('frac', order)[buildSteps('frac', order).length - 1].totalV
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
	function setMode(m: 'frac' | '01') {
		mode = m;
		reset();
	}

	// сегменты вертикального столбика-рюкзака (снизу вверх), в координатах SVG
	type Seg = { id: number; label: string; h: number; frac: number };
	const BAR_X = 40;
	const BAR_W = 70;
	const BAR_TOP = 24;
	const BAR_BOT = 250;
	const BAR_H = BAR_BOT - BAR_TOP;
	const segs = $derived<Seg[]>(
		cur.taken.map((t) => ({
			id: t.id,
			label: items[t.id].label,
			h: (t.addW / CAP) * BAR_H,
			frac: t.frac
		}))
	);
	// y-координата нижней границы i-го сегмента (стопка снизу вверх)
	function segY(i: number): number {
		let below = 0;
		for (let k = 0; k < i; k++) below += segs[k].h;
		return BAR_BOT - below - segs[i].h;
	}
</script>

<div class="fk">
	<div class="fk__bar">
		<div class="seg">
			<button class:on={mode === 'frac'} onclick={() => setMode('frac')}>Дробный</button>
			<button class:on={mode === '01'} onclick={() => setMode('01')}>0-1 (целиком)</button>
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

	<div class="fk__body">
		<svg viewBox="0 0 420 290" class="fk__svg">
			<!-- шкала вместимости -->
			<text x={BAR_X + BAR_W / 2} y={BAR_TOP - 9} class="cap-lbl">вместимость {CAP}</text>
			<!-- контур рюкзака -->
			<rect
				x={BAR_X} y={BAR_TOP} width={BAR_W} height={BAR_H}
				rx="8" class="bag"
			/>
			<!-- засечки веса 0..CAP -->
			{#each [0, 0.25, 0.5, 0.75, 1] as t}
				<line
					x1={BAR_X - 5} x2={BAR_X}
					y1={BAR_BOT - t * BAR_H} y2={BAR_BOT - t * BAR_H}
					class="tick"
				/>
				<text x={BAR_X - 8} y={BAR_BOT - t * BAR_H} dy="0.32em" class="tick-lbl">{Math.round(t * CAP)}</text>
			{/each}
			<!-- сегменты заполнения снизу вверх -->
			{#each segs as s, i (s.id)}
				<g class="fillseg" class:active={cur.active === s.id}>
					<rect
						x={BAR_X + 2} y={segY(i)} width={BAR_W - 4} height={Math.max(0, s.h - 1)}
						rx="3"
					/>
					{#if s.h > 13}
						<text x={BAR_X + BAR_W / 2} y={segY(i) + s.h / 2} dy="0.32em" class="seg-lbl">
							{s.label}{s.frac < 1 ? ` ·${(s.frac * 100).toFixed(0)}%` : ''}
						</text>
					{/if}
				</g>
			{/each}

			<!-- список предметов справа: порядок обработки + ρ -->
			<g class="list" transform="translate(150, {BAR_TOP - 4})">
				<text x="0" y="-2" class="list-head">предметы по ρ = v/w ↓</text>
				{#each order as it, i}
					{@const t = takenById.get(it.id)}
					{@const y = 12 + i * 41}
					<g
						class="item"
						class:active={cur.active === it.id}
						class:full={t && t.frac >= 1}
						class:part={t && t.frac < 1}
						transform="translate(0, {y})"
					>
						<rect x="0" y="0" width="248" height="34" rx="6" />
						<text x="9" y="14" class="it-name">{it.label}</text>
						<text x="9" y="28" class="it-meta">w={it.w} · v={it.v}</text>
						<text x="239" y="14" text-anchor="end" class="it-rho">ρ={rho(it).toFixed(1)}</text>
						<text x="239" y="28" text-anchor="end" class="it-state">
							{#if t && t.frac >= 1}взято{:else if t}{(t.frac * 100).toFixed(0)}%{:else if cur.active === it.id}…{:else}—{/if}
						</text>
					</g>
				{/each}
			</g>
		</svg>

		<div class="fk__panel">
			<div class="meter">
				<div class="meter-row">
					<span class="lbl">Стоимость Σ</span>
					<b class="bigv">{cur.totalV.toFixed(1)}</b>
				</div>
				<div class="track">
					<i style="width: {(cur.totalV / maxV) * 100}%"></i>
				</div>
				<div class="meter-sub">
					<span>вес {cur.usedW.toFixed(1)} / {CAP}</span>
					<span class="fillp">{fillPct.toFixed(0)}% объёма</span>
				</div>
			</div>

			<div class="props">
				<div class="prop"><span>режим</span><b>{mode === 'frac' ? 'дробный (можно резать)' : '0-1 (только целиком)'}</b></div>
				<div class="prop"><span>стратегия</span><b>жадно по ρ ↓</b></div>
				<div class="prop"><span>дробный оптимум</span><b>{maxV.toFixed(1)}</b></div>
				{#if mode === '01' && idx >= steps.length - 1}
					<div class="prop"><span>недобор веса</span><b class="bad">{(CAP - cur.usedW).toFixed(1)}</b></div>
				{/if}
			</div>

			<div class="note">{cur.note}</div>
		</div>
	</div>
</div>

<style>
	.fk {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.fk__bar {
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
		gap: 0;
		border: 1.5px solid var(--blue);
		border-radius: 8px;
		overflow: hidden;
	}
	.seg button {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		padding: 0.4rem 0.8rem;
		border: none;
		background: transparent;
		color: var(--blue);
		cursor: pointer;
	}
	.seg button.on {
		background: var(--blue);
		color: #fff;
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
	.fk__body {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.fk__svg {
		flex: 1 1 340px;
		min-width: 300px;
		max-width: 470px;
		height: auto;
	}
	.cap-lbl {
		text-anchor: middle;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		fill: var(--color-parch-muted);
		letter-spacing: 0.05em;
	}
	.bag {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-500);
		stroke-width: 2;
	}
	.tick {
		stroke: var(--color-ink-500);
		stroke-width: 1.5;
	}
	.tick-lbl {
		text-anchor: end;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.fillseg rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
		stroke-width: 1.5;
		transition: y 0.4s ease, height 0.4s ease;
	}
	.fillseg.active rect {
		fill: var(--blue);
		stroke: var(--color-parch-100);
		stroke-width: 2;
	}
	.seg-lbl {
		text-anchor: middle;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.62rem;
		fill: var(--color-ink-850);
		pointer-events: none;
	}
	.fillseg.active .seg-lbl {
		fill: #fff;
	}
	.list-head {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		fill: var(--color-parch-muted);
	}
	.item rect {
		fill: var(--color-ink-800);
		stroke: var(--color-ink-600);
		stroke-width: 1.5;
		transition: fill 0.25s, stroke 0.25s;
	}
	.item .it-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		fill: var(--color-parch-100);
	}
	.item .it-meta {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		fill: var(--color-parch-muted);
	}
	.item .it-rho {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.66rem;
		fill: var(--blue);
	}
	.item .it-state {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		fill: var(--color-parch-muted);
	}
	.item.full rect {
		fill: var(--blue);
		stroke: var(--blue);
	}
	.item.full .it-name,
	.item.full .it-meta,
	.item.full .it-rho,
	.item.full .it-state {
		fill: #fff;
	}
	.item.part rect {
		fill: var(--blue-pale);
		stroke: var(--blue);
	}
	.item.part .it-name { fill: var(--color-ink-850); }
	.item.part .it-meta,
	.item.part .it-rho,
	.item.part .it-state { fill: var(--color-ink-700); }
	.item.active rect {
		stroke: var(--color-parch-100);
		stroke-width: 2.5;
	}
	.fk__panel {
		flex: 1 1 220px;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.meter {
		background: var(--color-ink-800);
		border-radius: 9px;
		padding: 0.6rem 0.7rem;
		border: 1.5px solid var(--color-ink-600);
	}
	.meter-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.meter-row .lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.bigv {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.5rem;
		color: var(--blue);
	}
	.track {
		height: 0.6rem;
		background: var(--color-ink-700);
		border-radius: 5px;
		overflow: hidden;
		margin: 0.4rem 0;
	}
	.track i {
		display: block;
		height: 100%;
		background: var(--blue);
		transition: width 0.4s ease;
	}
	.meter-sub {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
	}
	.meter-sub .fillp {
		color: var(--color-parch-200);
	}
	.props {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
	}
	.prop {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 0.78rem;
		padding: 0.2rem 0;
		border-bottom: 1px dashed var(--color-ink-600);
	}
	.prop span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-parch-muted);
	}
	.prop b {
		color: var(--color-parch-100);
		font-family: var(--font-display);
		text-align: right;
	}
	.prop b.bad {
		color: var(--color-parch-200);
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
