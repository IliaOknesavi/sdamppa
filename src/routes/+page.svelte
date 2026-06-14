<script lang="ts">
	import { subjects } from '$lib/content';
	import { tips } from '$lib/engine/tooltips.svelte';
	import { authoredDays } from '$lib/types';
	import RichText from '$lib/engine/RichText.svelte';
	import { statistics } from '$lib/content/statistics';

	// load the statistics glossary so the landing demo terms are live
	$effect(() => {
		tips.setGlossary(statistics.glossary);
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

	<section class="subjects">
		<div class="label reveal" style="--i:4">Предметы</div>
		<div class="subjects__grid">
			{#each subjects as s, i}
				{@const ready = s.status === 'ready'}
				<a
					class="subj reveal"
					class:soon={!ready}
					style="--accent:{s.accent}; --i:{5 + i};"
					href={ready ? `/${s.id}` : undefined}
					aria-disabled={!ready}
				>
					<div class="subj__seal">{s.glyph}</div>
					<div class="subj__body">
						<h2 class="subj__name">{s.name}</h2>
						<div class="subj__blurb"><RichText source={s.blurb} /></div>
						<div class="subj__stat">
							{#if ready}
								<span>{s.days.length} дней · {authoredDays(s)} готово</span>
								<span class="subj__go">войти →</span>
							{:else}
								<span class="subj__soon">скоро</span>
							{/if}
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
			<p>XP за задачи и дни, стрики, ранги и контрольные точки-боссы в конце каждой фазы.</p>
		</div>
		<div class="feat reveal" style="--i:10">
			<div class="feat__ico">⌘</div>
			<h3>Код и прод</h3>
			<p>Каждая тема — с применением: бутстреп, Монте-Карло, цепи Маркова в Python, как в реальных задачах.</p>
		</div>
	</section>

	<footer class="home__foot">
		Кодекс · по конспекту курса · расширяется на новые предметы добавлением модуля контента
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
		color: var(--color-gold-400);
		filter: drop-shadow(0 0 14px var(--accent-soft));
	}
	.hero__title {
		font-family: var(--font-display);
		font-size: clamp(3rem, 11vw, 6rem);
		font-weight: 600;
		letter-spacing: 0.16em;
		margin: 0.4rem 0 0.6rem;
		background: linear-gradient(180deg, var(--color-parch-100), var(--color-gold-400));
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
		border-radius: 12px;
		background: var(--color-ink-800);
	}
	.subjects {
		margin: 2.5rem 0;
	}
	.subjects .label {
		margin-bottom: 0.9rem;
	}
	.subjects__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}
	.subj {
		display: flex;
		gap: 1rem;
		padding: 1.2rem;
		border-radius: 14px;
		text-decoration: none;
		color: var(--color-parch-200);
		background: linear-gradient(150deg, color-mix(in srgb, var(--accent) 8%, var(--color-ink-800)), var(--color-ink-850));
		border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--color-ink-600));
		transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
	}
	.subj:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 44px -18px rgba(0, 0, 0, 0.85);
		border-color: var(--accent);
	}
	.subj.soon {
		opacity: 0.6;
		cursor: not-allowed;
		pointer-events: none;
	}
	.subj__seal {
		display: grid;
		place-items: center;
		width: 3.2rem;
		height: 3.2rem;
		flex: none;
		border-radius: 50%;
		font-family: var(--font-display);
		font-size: 1.7rem;
		color: var(--color-ink-900);
		background: radial-gradient(circle at 35% 30%, var(--color-gold-300), var(--accent) 60%, var(--color-gold-600));
		box-shadow: inset 0 -2px 6px rgba(0, 0, 0, 0.4), 0 0 16px var(--accent-soft);
	}
	.subj__name {
		font-size: 1.2rem;
		margin: 0 0 0.3rem;
	}
	.subj__blurb {
		font-size: 0.85rem;
		color: var(--color-parch-300);
	}
	.subj__stat {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 0.7rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--color-parch-muted);
	}
	.subj__go {
		color: var(--accent);
	}
	.subj__soon {
		color: var(--color-gold-500);
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}
	.feats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
		margin: 2.5rem 0;
	}
	.feat {
		padding: 1.2rem;
		border-radius: 12px;
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
