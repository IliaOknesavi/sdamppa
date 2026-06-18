<script lang="ts">
	// Несходимость наивного Форда–Фалкерсона на иррациональных ёмкостях.
	// Сеть с e₁=1, e₂=r, e₃=1, r=(√5−1)/2, r²=1−r. При неудачном выборе путей
	// остаточные ёмкости трёх особых рёбер на раундах повторяются как
	// (rⁿ, rⁿ⁺¹, 0), сжимаясь в r раз за раунд; поток растёт на 2rⁿ и сходится к
	// 1 + 2·Σrⁱ = 3 + 2r ≈ 4.236, но НИКОГДА не достигает максимума.
	const r = (Math.sqrt(5) - 1) / 2; // ≈ 0.6180339887
	const ASYMP = 3 + 2 * r; // ≈ 4.2360679 — предел, к которому сходится поток
	const MAXR = 12; // дальше rⁿ ничтожно мал

	let round = $state(0);

	function flowAt(n: number): number {
		let f = 1; // стартовое насыщение
		for (let i = 1; i <= n; i++) f += 2 * Math.pow(r, i);
		return f;
	}
	const F = $derived(flowAt(round));
	// остаточные ёмкости трёх особых рёбер: (rⁿ, rⁿ⁺¹, 0)
	const resid = $derived([Math.pow(r, round), Math.pow(r, round + 1), 0]);
	const residSym = $derived(
		round === 0 ? ['1', 'r', '0'] : [`r^${round}`, `r^${round + 1}`, '0']
	);
	const note = $derived(
		round === 0
			? 'Старт: после насыщения остаточные ёмкости трёх особых рёбер равны (1, r, 0). Поток = 1. Жми «следующий раунд».'
			: `Раунд ${round}: два неудачных пути протолкнули по r^${round}. Остаточные сжались до (r^${round}, r^${round + 1}, 0) — тот же паттерн, но в r раз меньше. Поток +2·r^${round}.`
	);
	const pct = (x: number) => Math.min(100, (x / (ASYMP + 0.5)) * 100);

	function step() {
		if (round < MAXR) round += 1;
	}
	function reset() {
		round = 0;
	}
	const fmt = (x: number) => x.toFixed(x < 0.001 ? 6 : 4);
</script>

<div class="ir">
	<div class="ir__bar">
		<span class="ir__title">Несходимость на иррациональных ёмкостях</span>
		<div class="ctrl">
			<button onclick={reset} title="сброс">↺</button>
			<button onclick={step} disabled={round >= MAXR} title="следующий раунд">▶ следующий раунд</button>
			<span class="cnt">раунд {round}</span>
		</div>
	</div>

	<div class="ir__body">
		<div class="ir__left">
			<div class="lbl">Остаточные ёмкости рёбер e₁, e₂, e₃</div>
			<div class="bars">
				{#each resid as v, i}
					<div class="bcol">
						<div class="btrack">
							<div class="bfill" class:zero={v === 0} style="height: {v * 100}%"></div>
						</div>
						<div class="bsym">{residSym[i]}</div>
						<div class="bnum">{fmt(v)}</div>
						<div class="bedge">e{i + 1}</div>
					</div>
				{/each}
			</div>
			<div class="ident">
				r = (√5 − 1)/2 ≈ {r.toFixed(4)} · &nbsp; r² = 1 − r ≈ {(r * r).toFixed(4)} · &nbsp;
				отсюда r<sup>n</sup> − r<sup>n+1</sup> = r<sup>n+2</sup> — остаток «дозаправляется» и цикл повторяется вечно.
			</div>
		</div>

		<div class="ir__right">
			<div class="lbl">Поток |f| против предела и максимума</div>
			<div class="flow">{fmt(F)}</div>
			<div class="line">
				<div class="line-fill" style="width: {pct(F)}%"></div>
				<div class="mark asymp" style="left: {pct(ASYMP)}%"><span>3 + 2r ≈ {ASYMP.toFixed(3)}</span></div>
				<div class="mark max"><span>истинный максимум →</span></div>
			</div>
			<div class="note">{note}</div>
			<div class="verdict">
				Поток сходится к <b>3 + 2r ≈ {ASYMP.toFixed(3)}</b>, но <b>никогда не достигает</b> максимума
				(он значительно больше — зависит от больших рёбер сети). Способ выбора пути критичен:
				<b>Эдмондс–Карп</b> (BFS, кратчайший путь) сходится всегда за O(VE²).
			</div>
		</div>
	</div>
</div>

<style>
	.ir {
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
		overflow: hidden;
		margin: 1.2rem 0;
	}
	.ir__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
		flex-wrap: wrap;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
	}
	.ir__title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.82rem;
		color: var(--color-parch-100);
	}
	.ctrl {
		display: flex;
		gap: 0.3rem;
		align-items: center;
	}
	.ctrl button {
		height: 2rem;
		padding: 0 0.6rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 7px;
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		cursor: pointer;
		font-size: 0.74rem;
		font-family: var(--font-mono);
	}
	.ctrl button:hover:not(:disabled) {
		border-color: var(--blue);
		color: var(--blue);
	}
	.ctrl button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.cnt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		margin-left: 0.3rem;
	}
	.ir__body {
		display: flex;
		gap: 1.2rem;
		padding: 1rem;
		flex-wrap: wrap;
	}
	.ir__left {
		flex: 1 1 240px;
		min-width: 220px;
	}
	.ir__right {
		flex: 1 1 260px;
		min-width: 240px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-parch-muted);
		margin-bottom: 0.5rem;
	}
	.bars {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		height: 130px;
	}
	.bcol {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
	}
	.btrack {
		width: 100%;
		max-width: 48px;
		height: 90px;
		background: var(--color-ink-800);
		border: 1px solid var(--color-ink-600);
		border-radius: 6px;
		display: flex;
		align-items: flex-end;
		overflow: hidden;
	}
	.bfill {
		width: 100%;
		background: var(--blue);
		transition: height 0.35s ease;
		min-height: 0;
	}
	.bfill.zero {
		background: var(--color-ink-500);
	}
	.bsym {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--blue);
		font-weight: 700;
	}
	.bnum {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--color-parch-muted);
	}
	.bedge {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		color: var(--color-parch-100);
	}
	.ident {
		margin-top: 0.8rem;
		font-size: 0.72rem;
		line-height: 1.5;
		color: var(--color-parch-200);
		padding: 0.5rem 0.6rem;
		background: var(--color-ink-800);
		border-radius: 8px;
	}
	.flow {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.8rem;
		color: var(--blue);
	}
	.line {
		position: relative;
		height: 0.8rem;
		background: var(--color-ink-800);
		border-radius: 5px;
		margin: 1.3rem 0 0.4rem;
	}
	.line-fill {
		height: 100%;
		background: var(--blue);
		border-radius: 5px;
		transition: width 0.35s ease;
	}
	.mark {
		position: absolute;
		top: -1.1rem;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		white-space: nowrap;
	}
	.mark.asymp {
		transform: translateX(-50%);
		color: var(--blue);
	}
	.mark.asymp::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 1.1rem;
		height: 0.8rem;
		border-left: 1.5px dashed var(--blue);
	}
	.mark.max {
		right: 0;
		color: var(--color-parch-muted);
	}
	.note {
		font-size: 0.82rem;
		color: var(--color-parch-200);
		padding: 0.55rem 0.7rem;
		background: var(--color-ink-800);
		border-radius: 8px;
		border-left: 3px solid var(--blue);
		min-height: 3rem;
	}
	.verdict {
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--color-parch-200);
	}
	.verdict b {
		color: var(--color-parch-100);
	}
</style>
