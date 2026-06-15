<script lang="ts">
	import { directions } from '$lib/content';
	import { tips } from '$lib/engine/tooltips.svelte';
	import { statistics } from '$lib/content/statistics';
	import RichText from '$lib/engine/RichText.svelte';
	import Sparkle from '$lib/components/Sparkle.svelte';

	$effect(() => {
		tips.setGlossary(statistics.courses[0].glossary);
	});

	// decorative square-mosaic tiles (ИИИ motif)
	const tiles = [
		'pale', '', 'blue', 'soft',
		'', 'star', '', 'blue',
		'blue', 'soft', '', 'pale',
		'', 'blue', 'pale', ''
	];
</script>

<div class="home">
	<!-- ИИИ-style hero: white, two-tone heading, square mosaic + sparkle -->
	<section class="hero">
		<div class="hero__text reveal" style="--i:0">
			<div class="hero__tags">
				<span class="tag">граф знаний</span>
				<span class="tag">запускаемый Python</span>
				<span class="tag">геймификация</span>
			</div>
			<h1 class="hero__title">Учись<br /><span class="hl">глубже</span><br />программы</h1>
			<p class="hero__sub">
				Интерактивная платформа подготовки. Граф знаний, который раскрывается под курсором.
			</p>
			<a class="btn-blue hero__cta" href="#dirs">К направлениям →</a>
		</div>
		<div class="hero__art reveal" style="--i:1" aria-hidden="true">
			<div class="mosaic">
				{#each tiles as t}
					<div class="tile tile--{t || 'empty'}">
						{#if t === 'star'}<Sparkle size={40} color="var(--blue)" />{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- live tooltip demo -->
	<section class="demo reveal" style="--i:2">
		<div class="label">как это работает</div>
		<div class="demo__text">
			<RichText
				source={'Наведи на термин — [[teorema-slozheniya|теорему сложения]] — и **подержи курсор**, чтобы карточка закрепилась. Внутри неё свои термины: [[nesovmestnye|несовместные события]], [[vklyuchenie-isklyuchenie|включения-исключения]]. Так раскрывается весь граф.'}
			/>
		</div>
	</section>

	<!-- directions -->
	<section class="dirs" id="dirs">
		<h2 class="sec-h reveal" style="--i:3">Направления</h2>
		<div class="dirs__grid">
			{#each directions as d, i}
				<a class="dir reveal" style="--i:{4 + i}" href="/{d.id}">
					<div class="dir__badge">{d.short}</div>
					<h3 class="dir__name">{d.name}</h3>
					{#if d.blurb}<p class="dir__blurb">{d.blurb}</p>{/if}
					<div class="dir__foot">
						<span>{d.subjects.length} предмет(а/ов)</span>
						<span class="dir__go">войти →</span>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- features -->
	<section class="feats">
		<div class="feat feat--blue reveal" style="--i:6">
			<h3>Вложенные подсказки</h3>
			<p>Наводишь — определение; держишь — закрепляешь; внутри новые термины. Рекурсивный граф знаний.</p>
		</div>
		<div class="feat reveal" style="--i:7">
			<h3>Геймификация</h3>
			<p>XP за задачи и дни, стрики, ранги и контрольные точки в конце каждой фазы.</p>
		</div>
		<div class="feat reveal" style="--i:8">
			<h3>Код и прод</h3>
			<p>Каждая тема — с применением: бутстреп, Монте-Карло, цепи Маркова в Python, прямо на странице.</p>
		</div>
	</section>
</div>

<style>
	.home {
		max-width: 1180px;
		margin: 0 auto;
		padding: 2rem 1.4rem 2rem;
	}

	/* hero */
	.hero {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 2rem;
		padding: 1.5rem 0 2.5rem;
	}
	.hero__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}
	.tag {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.78rem;
		padding: 0.4rem 0.9rem;
		border: 1.5px solid var(--blue);
		color: var(--blue);
		border-radius: 999px;
	}
	.hero__title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(2.8rem, 8vw, 6rem);
		line-height: 0.95;
		letter-spacing: -0.03em;
		color: var(--color-parch-100);
		margin: 0 0 1.2rem;
		text-transform: lowercase;
	}
	.hero__title .hl {
		color: var(--blue);
	}
	.hero__sub {
		font-size: clamp(1rem, 2vw, 1.2rem);
		max-width: 42ch;
		color: var(--color-parch-300);
		margin: 0 0 1.8rem;
		line-height: 1.4;
	}
	.btn-blue {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.95rem;
		padding: 0.85rem 1.7rem;
		background: var(--blue);
		color: #fff;
		border-radius: 10px;
		text-decoration: none;
		transition: transform 0.15s, background 0.15s;
	}
	.btn-blue:hover {
		transform: translateY(-2px);
		background: var(--color-gold-500);
	}
	.hero__art {
		flex: none;
	}
	.mosaic {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
		width: clamp(220px, 30vw, 340px);
		aspect-ratio: 1;
	}
	.tile {
		aspect-ratio: 1;
	}
	.tile--blue {
		background: var(--blue);
	}
	.tile--soft {
		background: var(--blue-soft);
	}
	.tile--pale {
		background: var(--blue-pale);
	}
	.tile--star {
		background: #fff;
		border: 1.5px solid var(--blue);
		display: grid;
		place-items: center;
	}
	.tile--empty {
		background: transparent;
	}

	/* demo */
	.demo {
		margin: 0 0 0;
		padding: 1.4rem 1.6rem;
		border: 1.5px solid var(--color-ink-600);
		border-radius: 14px;
		background: var(--color-ink-850);
	}
	.demo .label {
		margin-bottom: 0.6rem;
	}
	.demo__text {
		font-size: 1.05rem;
		max-width: 60ch;
	}

	/* directions */
	.dirs {
		margin: 3rem 0 0;
		scroll-margin-top: 1rem;
	}
	.sec-h {
		font-size: clamp(1.8rem, 5vw, 3rem);
		margin: 0 0 1.2rem;
		color: var(--blue);
	}
	.dirs__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
	.dir {
		display: block;
		padding: 1.6rem;
		border-radius: 14px;
		text-decoration: none;
		color: var(--color-parch-100);
		background: var(--color-ink-850);
		border: 1.5px solid var(--color-ink-600);
		transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s;
	}
	.dir:hover {
		transform: translateY(-4px);
		border-color: var(--blue);
		box-shadow: 0 22px 44px -26px color-mix(in srgb, var(--blue) 60%, transparent);
	}
	.dir__badge {
		display: inline-grid;
		place-items: center;
		min-width: 3.2rem;
		height: 3.2rem;
		padding: 0 0.6rem;
		border-radius: 10px;
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 1.1rem;
		color: #fff;
		background: var(--blue);
		margin-bottom: 1rem;
	}
	.dir__name {
		font-size: 1.45rem;
		margin: 0 0 0.4rem;
		line-height: 1.05;
	}
	.dir__blurb {
		font-size: 0.9rem;
		color: var(--color-parch-300);
		margin: 0 0 1rem;
		line-height: 1.45;
	}
	.dir__foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-muted);
	}
	.dir__go {
		color: var(--blue);
		font-weight: 700;
	}

	/* features */
	.feats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1rem;
		margin: 1.2rem 0 0;
	}
	.feat {
		padding: 1.5rem;
		border-radius: 14px;
		border: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-850);
	}
	.feat--blue {
		background: var(--blue);
		border-color: var(--blue);
		color: #fff;
	}
	.feat h3 {
		font-size: 1.2rem;
		margin: 0 0 0.5rem;
	}
	.feat--blue h3 {
		color: #fff;
	}
	.feat p {
		font-size: 0.9rem;
		line-height: 1.5;
		margin: 0;
		color: var(--color-parch-300);
	}
	.feat--blue p {
		color: rgba(255, 255, 255, 0.9);
	}

	@media (max-width: 720px) {
		.hero {
			grid-template-columns: 1fr;
		}
		.hero__art {
			display: none;
		}
	}
</style>
