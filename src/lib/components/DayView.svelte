<script lang="ts">
	import type { Course, Day, SectionKind } from '$lib/types';
	import { progress } from '$lib/stores/progress.svelte';
	import RichText from '$lib/engine/RichText.svelte';
	import TaskCard from './TaskCard.svelte';
	import RunnableCode from './RunnableCode.svelte';
	import LabStage from './LabStage.svelte';
	import { vizRegistry } from '$lib/viz/registry';

	let {
		course,
		day,
		basePath,
		yearQ = '',
		backHref,
		backLabel
	}: {
		course: Course;
		day: Day;
		basePath: string;
		yearQ?: string;
		backHref: string;
		backLabel: string;
	} = $props();

	const KIND: Record<SectionKind, { label: string; color: string }> = {
		definition: { label: 'Определение', color: 'var(--color-gold-400)' },
		theorem: { label: 'Теорема', color: 'var(--color-gold-300)' },
		derivation: { label: 'Вывод', color: 'var(--color-verdant)' },
		intuition: { label: 'Интуиция', color: 'var(--color-azure)' },
		connection: { label: 'Связь', color: 'var(--color-rose)' },
		note: { label: 'Заметка', color: 'var(--color-parch-muted)' },
		plain: { label: '', color: 'var(--color-ink-500)' }
	};

	const prev = $derived(course.days.find((d) => d.n === day.n - 1));
	const next = $derived(course.days.find((d) => d.n === day.n + 1));
	const done = $derived(progress.isDayDone(day.n));
	const phase = $derived(course.phases.find((p) => p.id === day.phaseId));
</script>

<article class="day">
	<header class="day__head reveal">
		<a class="day__back" href={backHref}>← {backLabel}</a>
		<div class="day__meta">
			{#if phase}<span class="day__phase">{phase.title}</span>{/if}
			{#if day.chapterRef && day.chapterRef !== '—'}<span class="day__ch">{day.chapterRef}</span>{/if}
			{#if day.est}<span class="day__est">⏱ {day.est}</span>{/if}
		</div>
		<h1 class="day__title"><span class="day__n">{day.unitLabel ?? 'День ' + day.n}.</span> {day.title}</h1>
		<div class="day__goal"><RichText source={day.goal} /></div>
	</header>

	{#if day.draft}
		<div class="day__draft reveal" style="--i:1">
			<div class="day__draft-glyph">✦</div>
			<h3>День в разработке</h3>
			<p>
				Теория, разбор и задачи этого дня ещё наполняются (массовое авторство контента идёт
				оркестрацией). Каркас и цель уже на месте — см. выше.
			</p>
		</div>
	{:else}
		{#each day.sections as s, i}
			{@const k = KIND[s.kind ?? 'plain']}
			<section class="sec reveal" style="--i:{i + 1}; --kc:{k.color};">
				{#if k.label}<div class="sec__kind">{k.label}</div>{/if}
				{#if s.heading}<h2 class="sec__h">{s.heading}</h2>{/if}
				<RichText source={s.body} />
				{#if s.viz && vizRegistry[s.viz]}
					{@const Viz = vizRegistry[s.viz]}
					<Viz />
				{/if}
				{#if s.code}
					<RunnableCode block={s.code} />
				{/if}
			</section>
		{/each}

		{#if day.code}
			<section class="reveal" style="--i:{day.sections.length + 1}">
				<RunnableCode block={day.code} />
			</section>
		{/if}

		{#if day.lab}
			<section class="reveal" style="--i:{day.sections.length + 2}">
				<LabStage lab={day.lab} />
			</section>
		{/if}

		{#if day.checkpoint}
			<section class="checkpoint reveal" style="--i:{day.sections.length + 1}">
				<div class="checkpoint__head">
					<span class="checkpoint__flag">⚑</span>
					<h2>{day.checkpoint.title}</h2>
				</div>
				<div class="checkpoint__intro"><RichText source={day.checkpoint.intro} /></div>
				<ol class="checkpoint__qs">
					{#each day.checkpoint.questions as q}
						<li><RichText source={q} /></li>
					{/each}
				</ol>
				{#if day.checkpoint.passNote}
					<div class="checkpoint__pass"><RichText source={day.checkpoint.passNote} /></div>
				{/if}
			</section>
		{/if}

		{#if day.tasks.length}
			<section class="tasks reveal" style="--i:{day.sections.length + 2}">
				<h2 class="block-h">{day.checkpoint ? 'Задачи для самопроверки' : 'Задачи'}</h2>
				{#each day.tasks as t, i}
					<TaskCard task={t} index={i + 1} />
				{/each}
			</section>
		{/if}

		{#if day.mastery.length}
			<section class="mastery reveal" style="--i:{day.sections.length + 3}">
				<h2 class="block-h">Критерий усвоения</h2>
				<ul>
					{#each day.mastery as m}<li>{m}</li>{/each}
				</ul>
			</section>
		{/if}
	{/if}

	<div class="day__complete reveal" style="--i:9">
		<button
			class="complete-btn"
			class:done
			onclick={() => (done ? progress.uncompleteDay(day.n) : progress.completeDay(day.n))}
		>
			{done ? '✓ день засчитан — снять отметку' : 'Отметить день пройденным (+40 XP)'}
		</button>
	</div>

	<nav class="day__nav">
		{#if prev}<a class="navlink" href="{basePath}/day/{prev.n}{yearQ}">← День {prev.n}</a>{:else}<span></span>{/if}
		{#if next}<a class="navlink" href="{basePath}/day/{next.n}{yearQ}">День {next.n} →</a>{/if}
	</nav>
</article>

<style>
	.day {
		max-width: 760px;
		margin: 0 auto;
		padding: 1.5rem 1.2rem 5rem;
	}
	.day__back {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-parch-muted);
		text-decoration: none;
	}
	.day__back:hover {
		color: var(--accent);
	}
	.day__meta {
		display: flex;
		gap: 0.7rem;
		margin: 0.8rem 0 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.day__phase {
		color: var(--accent);
	}
	.day__title {
		font-size: clamp(1.6rem, 4vw, 2.3rem);
		margin: 0.2rem 0 0.7rem;
	}
	.day__n {
		color: var(--color-gold-400);
	}
	.day__goal {
		font-size: 1rem;
		color: var(--color-parch-200);
		padding: 0.8rem 1rem;
		border-left: 3px solid var(--accent);
		background: color-mix(in srgb, var(--accent) 6%, transparent);
		border-radius: 0 8px 8px 0;
	}
	.sec {
		margin: 1.7rem 0;
	}
	.sec__kind {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--kc);
		margin-bottom: 0.3rem;
	}
	.sec__h {
		font-size: 1.25rem;
		margin: 0 0 0.6rem;
		padding-left: 0.7rem;
		border-left: 3px solid var(--kc);
	}
	.block-h {
		font-size: 1.3rem;
		margin: 2rem 0 0.5rem;
		color: var(--color-parch-100);
	}
	.mastery ul {
		list-style: none;
		padding: 0;
	}
	.mastery li {
		padding: 0.5rem 0.8rem 0.5rem 2rem;
		position: relative;
		border-bottom: 1px solid var(--color-ink-700);
		font-size: 0.92rem;
	}
	.mastery li::before {
		content: '☐';
		position: absolute;
		left: 0.6rem;
		color: var(--accent);
	}
	.checkpoint {
		border: 1px solid var(--accent-line);
		border-radius: 14px;
		padding: 1.2rem 1.3rem;
		margin: 1.8rem 0;
		background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 10%, var(--color-ink-800)), var(--color-ink-850));
	}
	.checkpoint__head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
	}
	.checkpoint__flag {
		font-size: 1.4rem;
		color: var(--accent);
	}
	.checkpoint__head h2 {
		font-size: 1.4rem;
		margin: 0;
	}
	.checkpoint__intro {
		color: var(--color-parch-300);
		margin-bottom: 0.8rem;
	}
	.checkpoint__qs {
		margin: 0;
		padding-left: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.checkpoint__qs li {
		padding-left: 0.3rem;
		line-height: 1.5;
	}
	.checkpoint__qs li::marker {
		color: var(--accent);
		font-family: var(--font-mono);
		font-size: 0.85em;
	}
	.checkpoint__pass {
		margin-top: 0.9rem;
		padding: 0.7rem 0.9rem;
		border-left: 3px solid var(--accent);
		background: color-mix(in srgb, var(--accent) 8%, transparent);
		border-radius: 0 8px 8px 0;
		font-size: 0.9rem;
	}

	.day__draft {
		text-align: center;
		padding: 3rem 1.5rem;
		border: 1px dashed var(--color-ink-500);
		border-radius: 14px;
		margin: 2rem 0;
		color: var(--color-parch-muted);
	}
	.day__draft-glyph {
		font-size: 2rem;
		color: var(--color-gold-500);
		margin-bottom: 0.5rem;
	}
	.day__draft h3 {
		margin: 0 0 0.5rem;
	}
	.day__complete {
		margin: 2.5rem 0 1rem;
	}
	.complete-btn {
		width: 100%;
		padding: 1rem;
		border-radius: 999px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.05rem;
		cursor: pointer;
		border: 1.5px solid var(--violet);
		background: var(--violet);
		color: #fff;
		transition: all 0.18s;
	}
	.complete-btn:hover {
		transform: translateY(-2px);
		background: var(--color-gold-500);
	}
	.complete-btn.done {
		border-color: var(--lime);
		color: var(--lime-ink);
		background: var(--lime);
	}
	.day__nav {
		display: flex;
		justify-content: space-between;
		margin-top: 1.5rem;
	}
	.navlink {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.85rem;
		color: var(--color-parch-100);
		text-decoration: none;
		padding: 0.55rem 1.2rem;
		border: 1.5px solid var(--color-ink-500);
		border-radius: 999px;
		transition: all 0.15s;
	}
	.navlink:hover {
		border-color: var(--violet);
		color: var(--violet);
		transform: translateY(-2px);
	}
</style>
