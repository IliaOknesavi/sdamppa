<script lang="ts">
	import { directions } from '$lib/content';
	import { tips } from '$lib/engine/tooltips.svelte';
	import { statistics } from '$lib/content/statistics';
	import RichText from '$lib/engine/RichText.svelte';

	// live demo terms on the landing use the statistics course glossary
	$effect(() => {
		tips.setGlossary(statistics.courses[0].glossary);
	});
</script>

<div class="home">
	<header class="hero">
		<div class="hero__seal reveal" style="--i:0">✦</div>
		<h1 class="hero__title reveal" style="--i:1">КОДЕКС</h1>
		<p class="hero__tag reveal" style="--i:2">
			Интерактивная платформа подготовки. Граф знаний, который раскрывается под курсором.
		</p>
		<div class="hero__demo reveal" style="--i:3">
			<RichText
				source={'Наведи на термин — [[teorema-slozheniya|теорему сложения]] — и **подержи курсор**, чтобы карточка закрепилась. Внутри неё свои термины: [[nesovmestnye|несовместные события]], [[vklyuchenie-isklyuchenie|включения-исключения]]. Так раскрывается весь граф.'}
			/>
		</div>
	</header>

	<section class="dirs">
		<div class="label reveal" style="--i:4">Направления</div>
		<div class="dirs__grid">
			{#each directions as d, i}
				<a class="dir reveal" style="--i:{5 + i}" href="/{d.id}">
					<div class="dir__short">{d.short}</div>
					<div class="dir__body">
						<h2 class="dir__name">{d.name}</h2>
						{#if d.blurb}<p class="dir__blurb">{d.blurb}</p>{/if}
						<div class="dir__stat">
							<span>{d.subjects.length} предмет(а/ов)</span>
							<span class="dir__go">войти →</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="feats">
		<div class="feat reveal" style="--i:8">
			<div class="feat__ico">🔗</div>
			<h3>Вложенные подсказки</h3>
			<p>Наводишь — определение; держишь — закрепляешь; внутри новые термины. Рекурсивный граф знаний.</p>
		</div>
		<div class="feat reveal" style="--i:9">
			<div class="feat__ico">⚔️</div>
			<h3>Геймификация</h3>
			<p>XP за задачи и дни, стрики, ранги и контрольные точки в конце каждой фазы.</p>
		</div>
		<div class="feat reveal" style="--i:10">
			<div class="feat__ico">⌘</div>
			<h3>Код и прод</h3>
			<p>Каждая тема — с применением: бутстреп, Монте-Карло, цепи Маркова в Python, прямо на странице.</p>
		</div>
	</section>

	<footer class="home__foot">
		Кодекс · направление → предмет → семестр → курс · расширяется добавлением модуля контента
	</footer>
</div>

<style>
	.home {
		max-width: 1000px;
		margin: 0 auto;
		padding: 3rem 1.3rem 5rem;
	}
	.hero {
		text-align: center;
		padding: 2rem 0 3rem;
	}
	.hero__seal {
		font-size: 2.4rem;
		color: var(--accent);
	}
	.hero__title {
		font-family: var(--font-display);
		font-size: clamp(3rem, 11vw, 6rem);
		font-weight: 800;
		letter-spacing: 0.04em;
		margin: 0.4rem 0 0.6rem;
		background: linear-gradient(180deg, var(--color-parch-100), var(--accent));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.hero__tag {
		font-size: 1.1rem;
		color: var(--color-parch-300);
		max-width: 36ch;
		margin: 0 auto 1.5rem;
		font-style: italic;
	}
	.hero__demo {
		max-width: 52ch;
		margin: 0 auto;
		font-size: 0.95rem;
		padding: 1rem 1.2rem;
		border: 1px solid var(--color-ink-600);
		border-radius: 8px;
		background: var(--color-ink-800);
		text-align: left;
	}
	.dirs {
		margin: 2.5rem 0;
	}
	.dirs .label {
		margin-bottom: 0.9rem;
	}
	.dirs__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
	.dir {
		display: flex;
		gap: 1.1rem;
		padding: 1.4rem;
		border-radius: 8px;
		text-decoration: none;
		color: var(--color-parch-200);
		background: var(--color-ink-800);
		border: 1px solid var(--color-ink-600);
		transition:
			transform 0.18s,
			box-shadow 0.18s,
			border-color 0.18s;
	}
	.dir:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 44px -22px rgba(0, 0, 0, 0.45);
		border-color: var(--accent);
	}
	.dir__short {
		display: grid;
		place-items: center;
		width: 3.4rem;
		height: 3.4rem;
		flex: none;
		border-radius: 8px;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.1rem;
		color: #fff;
		background: linear-gradient(140deg, var(--accent), var(--color-gold-600));
	}
	.dir__name {
		font-size: 1.2rem;
		margin: 0 0 0.3rem;
	}
	.dir__blurb {
		font-size: 0.85rem;
		color: var(--color-parch-300);
		margin: 0;
		line-height: 1.45;
	}
	.dir__stat {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 0.7rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--color-parch-muted);
	}
	.dir__go {
		color: var(--accent);
	}
	.feats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
		margin: 2.5rem 0;
	}
	.feat {
		padding: 1.3rem;
		border-radius: 8px;
		background: var(--color-ink-800);
		border: 1px solid var(--color-ink-600);
	}
	.feat__ico {
		font-size: 1.6rem;
		margin-bottom: 0.5rem;
	}
	.feat h3 {
		font-size: 1.05rem;
		margin: 0 0 0.4rem;
	}
	.feat p {
		font-size: 0.85rem;
		color: var(--color-parch-300);
		line-height: 1.5;
		margin: 0;
	}
	.home__foot {
		text-align: center;
		margin-top: 3rem;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--color-parch-muted);
	}
</style>
