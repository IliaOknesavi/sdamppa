<script lang="ts">
	import { directions } from '$lib/content';
	import { tips } from '$lib/engine/tooltips.svelte';
	import { statistics } from '$lib/content/statistics';
	import RichText from '$lib/engine/RichText.svelte';

	$effect(() => {
		tips.setGlossary(statistics.courses[0].glossary);
	});
</script>

<div class="home">
	<!-- ITMO-style colour-block hero -->
	<section class="hero reveal" style="--i:0">
		<div class="hero__tags">
			<span class="tag tag--lime">граф знаний</span>
			<span class="plus">+</span>
			<span class="tag">запускаемый Python</span>
			<span class="plus">+</span>
			<span class="tag">геймификация</span>
		</div>
		<h1 class="hero__title">Учись<br />глубже<br />программы</h1>
		<p class="hero__sub">
			Интерактивная платформа подготовки. Граф знаний, который раскрывается под курсором.
		</p>
		<a class="pill pill--solid hero__cta" href="#dirs">К направлениям →</a>
		<div class="hero__blob"></div>
	</section>

	<!-- live tooltip demo -->
	<section class="demo reveal" style="--i:1">
		<div class="label">как это работает</div>
		<div class="demo__text">
			<RichText
				source={'Наведи на термин — [[teorema-slozheniya|теорему сложения]] — и **подержи курсор**, чтобы карточка закрепилась. Внутри неё свои термины: [[nesovmestnye|несовместные события]], [[vklyuchenie-isklyuchenie|включения-исключения]]. Так раскрывается весь граф.'}
			/>
		</div>
	</section>

	<!-- directions -->
	<section class="dirs" id="dirs">
		<h2 class="sec-h reveal" style="--i:2">Направления</h2>
		<div class="dirs__grid">
			{#each directions as d, i}
				<a class="dir reveal" style="--i:{3 + i}" href="/{d.id}">
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
		<div class="feat feat--lime reveal" style="--i:5">
			<h3>Вложенные подсказки</h3>
			<p>Наводишь — определение; держишь — закрепляешь; внутри новые термины. Рекурсивный граф знаний.</p>
		</div>
		<div class="feat reveal" style="--i:6">
			<h3>Геймификация</h3>
			<p>XP за задачи и дни, стрики, ранги и контрольные точки в конце каждой фазы.</p>
		</div>
		<div class="feat reveal" style="--i:7">
			<h3>Код и прод</h3>
			<p>Каждая тема — с применением: бутстреп, Монте-Карло, цепи Маркова в Python, прямо на странице.</p>
		</div>
	</section>
</div>

<style>
	.home {
		max-width: 1180px;
		margin: 0 auto;
		padding: 1.6rem 1.4rem 2rem;
	}

	/* hero */
	.hero {
		position: relative;
		overflow: hidden;
		background: var(--violet);
		border-radius: 28px;
		padding: 2.6rem clamp(1.5rem, 5vw, 4rem) 3rem;
		color: #fff;
	}
	.hero__tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.55rem;
		margin-bottom: 1.6rem;
	}
	.tag {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		padding: 0.4rem 0.95rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.16);
		color: #fff;
		backdrop-filter: blur(4px);
	}
	.tag--lime {
		background: var(--lime);
		color: var(--lime-ink);
	}
	.plus {
		font-family: var(--font-display);
		font-weight: 800;
		color: var(--lime);
		font-size: 1.1rem;
	}
	.hero__title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(2.8rem, 9vw, 6.5rem);
		line-height: 0.95;
		letter-spacing: -0.03em;
		color: var(--lime);
		margin: 0 0 1.1rem;
		text-transform: lowercase;
	}
	.hero__sub {
		font-size: clamp(1rem, 2vw, 1.25rem);
		max-width: 40ch;
		color: rgba(255, 255, 255, 0.92);
		margin: 0 0 1.8rem;
		line-height: 1.4;
	}
	.hero__cta {
		font-size: 0.95rem;
		padding: 0.8rem 1.7rem;
	}
	.hero__blob {
		position: absolute;
		right: -7rem;
		top: -7rem;
		width: 20rem;
		height: 20rem;
		border-radius: 50%;
		background: radial-gradient(circle, var(--violet-soft), transparent 70%);
		opacity: 0.5;
		pointer-events: none;
	}

	/* demo */
	.demo {
		margin: 1.4rem 0 0;
		padding: 1.4rem 1.6rem;
		border: 1.5px solid var(--color-ink-600);
		border-radius: 18px;
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
		color: var(--violet);
	}
	.dirs__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
	.dir {
		display: block;
		padding: 1.6rem;
		border-radius: 18px;
		text-decoration: none;
		color: var(--color-parch-100);
		background: var(--color-ink-850);
		border: 1.5px solid var(--color-ink-600);
		transition:
			transform 0.18s,
			border-color 0.18s,
			box-shadow 0.18s;
	}
	.dir:hover {
		transform: translateY(-4px);
		border-color: var(--violet);
		box-shadow: 0 22px 44px -24px color-mix(in srgb, var(--violet) 60%, transparent);
	}
	.dir__badge {
		display: inline-grid;
		place-items: center;
		min-width: 3.2rem;
		height: 3.2rem;
		padding: 0 0.6rem;
		border-radius: 12px;
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 1.1rem;
		color: #fff;
		background: var(--violet);
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
		color: var(--violet);
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
		border-radius: 18px;
		border: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-850);
	}
	.feat--lime {
		background: var(--lime);
		border-color: var(--lime);
		color: var(--lime-ink);
	}
	.feat h3 {
		font-size: 1.2rem;
		margin: 0 0 0.5rem;
	}
	.feat--lime h3 {
		color: var(--lime-ink);
	}
	.feat p {
		font-size: 0.9rem;
		line-height: 1.5;
		margin: 0;
		color: var(--color-parch-300);
	}
	.feat--lime p {
		color: var(--lime-ink);
		opacity: 0.85;
	}
</style>
