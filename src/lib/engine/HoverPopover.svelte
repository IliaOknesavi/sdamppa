<script lang="ts">
	import { tips } from './tooltips.svelte';
	import RichText from './RichText.svelte';
	import Katex from './Katex.svelte';

	const t = $derived(tips.hover ? tips.get(tips.hover.id) : undefined);

	const style = $derived.by(() => {
		const h = tips.hover;
		if (!h) return '';
		const W = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const x = Math.max(12, Math.min(h.rect.left, W - 372));
		return `left:${x}px; top:${h.rect.bottom + 9}px;`;
	});

	function pin() {
		if (tips.hover && t) tips.pinFromRect(t.id, tips.hover.rect);
	}
</script>

{#if tips.hover && t}
	<div
		class="cx-pop"
		{style}
		role="tooltip"
		onmouseenter={() => tips.cancelHide()}
		onmouseleave={() => tips.scheduleHide()}
	>
		<div class="cx-pop__head">
			<span class="cx-pop__term">{t.term}</span>
			<button class="cx-pin" title="Закрепить (или клик по термину)" onclick={pin}>📌</button>
		</div>
		{#if t.short}<div class="cx-pop__short"><RichText source={t.short} parent={t.id} /></div>{/if}
		{#if t.formula}<div class="cx-pop__formula"><Katex math={t.formula} display /></div>{/if}
		<div class="cx-pop__body"><RichText source={t.body} parent={t.id} /></div>
		<div class="cx-pop__hint label">держи курсор → закрепить · внутри есть свои термины</div>
	</div>
{/if}

<style>
	.cx-pop {
		position: fixed;
		width: 360px;
		max-width: calc(100vw - 24px);
		max-height: 60vh;
		overflow-y: auto;
		pointer-events: auto;
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--accent) 6%, var(--color-ink-800)), var(--color-ink-850));
		border: 1px solid var(--accent-line);
		border-radius: 10px;
		padding: 0.85rem 0.95rem 0.7rem;
		box-shadow:
			0 18px 50px -12px rgba(0, 0, 0, 0.8),
			0 0 0 1px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 color-mix(in srgb, var(--accent) 18%, transparent);
		font-size: 0.9rem;
		color: var(--color-parch-200);
		animation: popIn 0.16s cubic-bezier(0.2, 0.9, 0.3, 1.2);
		z-index: 70;
	}
	.cx-pop__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}
	.cx-pop__term {
		font-family: var(--font-display);
		font-size: 1.06rem;
		color: var(--color-gold-300);
	}
	.cx-pin {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.85rem;
		opacity: 0.7;
		transition: opacity 0.15s, transform 0.15s;
	}
	.cx-pin:hover {
		opacity: 1;
		transform: scale(1.15) rotate(-8deg);
	}
	.cx-pop__short {
		color: var(--color-parch-muted);
		font-style: italic;
		font-size: 0.84rem;
		margin-bottom: 0.45rem;
	}
	.cx-pop__formula {
		margin: 0.2rem 0 0.5rem;
	}
	.cx-pop__hint {
		margin-top: 0.6rem;
		font-size: 0.6rem;
		opacity: 0.7;
	}
</style>
