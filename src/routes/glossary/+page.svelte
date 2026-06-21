<script lang="ts">
	import { glossaryIndex } from '$lib/content';
	import { tips } from '$lib/engine/tooltips.svelte';
	import Term from '$lib/engine/Term.svelte';
	import RichText from '$lib/engine/RichText.svelte';
	import { plural } from '$lib/plural';

	// рендерить short через RichText (формулы/разметка) только если она там есть —
	// иначе плоский текст, чтобы список из сотен терминов оставался лёгким.
	const hasMarkup = (s: string) => /[$*`[]/.test(s);

	const { glossary, terms } = glossaryIndex();

	// движок подсказок должен знать ВЕСЬ глоссарий — тогда термины (и вложенные
	// [[id]] внутри карточек) раскрываются по наведению/клику прямо здесь.
	$effect(() => {
		tips.setGlossary(glossary);
	});

	// «Код» = первый токен без кириллицы и с код-пунктуацией (.method, snake_case,
	// nn.Module, name()) — отделяем API/синтаксис от концепций. Эвристика по форме
	// термина (тегов в данных пока нет); «Концепция (torch.optim)» остаётся концепцией.
	const isCode = (term: string) => {
		const head = term.trim().split(' ')[0];
		return !/[А-Яа-яЁё]/.test(head) && /[._()]/.test(head);
	};

	let q = $state('');
	let kind = $state<'all' | 'concept' | 'code'>('all');
	const norm = (s: string | undefined) => (s ?? '').toLowerCase();

	const codeCount = terms.filter((it) => isCode(it.term.term)).length;
	const counts = { all: terms.length, concept: terms.length - codeCount, code: codeCount };

	const filtered = $derived.by(() => {
		const n = q.trim().toLowerCase();
		return terms.filter((it) => {
			if (kind === 'code' && !isCode(it.term.term)) return false;
			if (kind === 'concept' && isCode(it.term.term)) return false;
			if (!n) return true;
			return (
				norm(it.term.term).includes(n) ||
				norm(it.term.short).includes(n) ||
				norm(it.term.body).includes(n) ||
				norm(it.subjectName).includes(n)
			);
		});
	});

	// группировка по первой букве названия термина
	const groups = $derived.by(() => {
		const m = new Map<string, typeof terms>();
		for (const it of filtered) {
			const L = (it.term.term[0] ?? '#').toUpperCase();
			if (!m.has(L)) m.set(L, []);
			m.get(L)!.push(it);
		}
		return [...m.entries()]
			.sort((a, b) => a[0].localeCompare(b[0], 'ru'))
			.map(([letter, items]) => ({ letter, items }));
	});
</script>

<svelte:head><title>Глоссарий · СдамППА</title></svelte:head>

<div class="gloss">
	<header class="gloss__head">
		<a class="gloss__back" href="/">← на главную</a>
		<h1 class="gloss__title">Глоссарий</h1>
		<p class="gloss__sub">
			Все термины графа знаний. Наведи — определение, кликни — закрепится карточка с
			вложенными терминами.
		</p>
		<div class="gloss__search">
			<input
				type="search"
				bind:value={q}
				placeholder="Поиск по термину, определению, предмету…"
				aria-label="Поиск по глоссарию"
				autocomplete="off"
			/>
			<span class="gloss__count label">
				{filtered.length}
				{plural(filtered.length, ['термин', 'термина', 'терминов'])}
			</span>
		</div>
		<div class="gloss__seg" role="group" aria-label="Фильтр: код или концепции">
			<button class:on={kind === 'all'} onclick={() => (kind = 'all')}>Все · {counts.all}</button>
			<button class:on={kind === 'concept'} onclick={() => (kind = 'concept')}
				>Концепции · {counts.concept}</button
			>
			<button class:on={kind === 'code'} onclick={() => (kind = 'code')}>Код · {counts.code}</button>
		</div>
	</header>

	{#if groups.length === 0}
		<p class="gloss__empty">Ничего не нашлось по запросу «{q}».</p>
	{:else}
		{#each groups as g (g.letter)}
			<section class="gloss__group">
				<h2 class="gloss__letter">{g.letter}</h2>
				<ul class="gloss__list">
					{#each g.items as it (it.term.id)}
						<li class="gloss__item">
							<span class="gloss__term"><Term id={it.term.id} label={it.term.term} /></span>
							<span class="gloss__subj label">{it.subjectShort}</span>
							{#if it.term.short}
								<span class="gloss__gloss">
									{#if hasMarkup(it.term.short)}<RichText source={it.term.short} />{:else}{it.term.short}{/if}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{/if}
</div>

<style>
	.gloss {
		max-width: 900px;
		margin: 0 auto;
		padding: 2.2rem 1.3rem 5rem;
	}
	.gloss__back {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		text-decoration: none;
	}
	.gloss__back:hover {
		color: var(--accent);
	}
	.gloss__title {
		font-size: clamp(1.8rem, 5vw, 2.8rem);
		margin: 0.8rem 0 0.3rem;
		color: var(--violet);
	}
	.gloss__sub {
		font-size: 0.95rem;
		color: var(--color-parch-300);
		margin: 0 0 1.4rem;
		max-width: 60ch;
		line-height: 1.5;
	}
	.gloss__search {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		position: sticky;
		top: 0;
		padding: 0.8rem 0;
		background: var(--color-ink-850);
		z-index: 5;
		border-bottom: 1.5px solid var(--color-ink-600);
		margin-bottom: 1rem;
	}
	.gloss__search input {
		flex: 1;
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 0.65rem 0.9rem;
		border-radius: 10px;
		border: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		color: var(--color-parch-100);
	}
	.gloss__search input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
		border-color: var(--accent);
	}
	.gloss__count {
		flex: none;
		white-space: nowrap;
	}
	.gloss__seg {
		display: flex;
		gap: 0.3rem;
		margin: 0.2rem 0 1rem;
	}
	.gloss__seg button {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		padding: 0.35rem 0.7rem;
		border-radius: 99px;
		border: 1px solid var(--color-ink-600);
		background: var(--color-ink-800);
		color: var(--color-parch-300);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
	}
	.gloss__seg button:hover {
		border-color: var(--accent);
	}
	.gloss__seg button.on {
		background: var(--accent);
		border-color: var(--accent);
		color: #fff;
	}
	.gloss__group {
		margin-bottom: 1.4rem;
	}
	.gloss__letter {
		font-family: var(--font-display);
		font-size: 1.1rem;
		color: var(--accent);
		margin: 0 0 0.4rem;
		padding-bottom: 0.2rem;
		border-bottom: 1px solid var(--color-ink-600);
	}
	.gloss__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.gloss__item {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem 0.7rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--color-ink-600) 55%, transparent);
	}
	.gloss__term {
		font-size: 1.02rem;
		font-weight: 500;
	}
	.gloss__subj {
		flex: none;
		padding: 0.1rem 0.5rem;
		border-radius: 99px;
		border: 1px solid var(--color-ink-600);
		color: var(--color-parch-muted);
	}
	.gloss__gloss {
		flex: 1 1 18rem;
		min-width: 12rem;
		font-size: 0.85rem;
		color: var(--color-parch-300);
		font-style: italic;
	}
	.gloss__gloss :global(.cx-rich),
	.gloss__gloss :global(.cx-rich p) {
		margin: 0;
		display: inline;
		font-style: italic;
	}
	.gloss__empty {
		color: var(--color-parch-muted);
		font-size: 0.95rem;
		padding: 2rem 0;
	}
</style>
