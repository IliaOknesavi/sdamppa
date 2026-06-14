<script lang="ts">
	import { tips, type Pin } from './tooltips.svelte';
	import RichText from './RichText.svelte';
	import Katex from './Katex.svelte';

	let { pin }: { pin: Pin } = $props();
	const t = $derived(tips.get(pin.id));

	let drag: { dx: number; dy: number } | null = null;

	function down(e: PointerEvent) {
		if (e.button !== 0) return;
		// don't capture the pointer when pressing the close button, or its click is swallowed
		if ((e.target as HTMLElement).closest('.cx-card__x')) return;
		tips.front(pin.key);
		drag = { dx: e.clientX - pin.x, dy: e.clientY - pin.y };
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (!drag) return;
		const W = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const x = Math.max(-180, Math.min(e.clientX - drag.dx, W - 60));
		const y = Math.max(0, e.clientY - drag.dy);
		tips.move(pin.key, x, y);
	}
	function up() {
		drag = null;
	}
	function pinChip(e: MouseEvent, rid: string) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		tips.pinFromRect(rid, rect, pin.id);
	}
</script>

{#if t}
	<div
		class="cx-card"
		style="left:{pin.x}px; top:{pin.y}px; z-index:{pin.z};"
		onpointerdown={() => tips.front(pin.key)}
	>
		<div
			class="cx-card__bar"
			onpointerdown={down}
			onpointermove={move}
			onpointerup={up}
			onpointercancel={up}
		>
			<span class="cx-card__seal">{t.term.slice(0, 1)}</span>
			<span class="cx-card__title">{t.term}</span>
			<button
				class="cx-card__x"
				title="Закрыть"
				onpointerdown={(e) => e.stopPropagation()}
				onclick={(e) => {
					e.stopPropagation();
					tips.closePin(pin.key);
				}}>✕</button
			>
		</div>
		{#if pin.parent && tips.get(pin.parent)}
			<div class="cx-card__from label">из · {tips.get(pin.parent)!.term}</div>
		{/if}
		{#if t.short}<div class="cx-card__short"><RichText source={t.short} parent={t.id} /></div>{/if}
		{#if t.formula}<div class="cx-card__formula"><Katex math={t.formula} display /></div>{/if}
		<div class="cx-card__body"><RichText source={t.body} parent={t.id} /></div>
		{#if t.related?.length}
			<div class="cx-card__rel">
				{#each t.related as r}
					{#if tips.has(r)}
						<button class="cx-chip" onclick={(e) => pinChip(e, r)}>{tips.get(r)!.term}</button>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.cx-card {
		position: fixed;
		width: 358px;
		max-width: calc(100vw - 24px);
		max-height: 70vh;
		overflow-y: auto;
		pointer-events: auto;
		background:
			radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--accent) 9%, var(--color-ink-800)), var(--color-ink-850));
		border: 1px solid var(--accent-line);
		border-radius: 12px;
		box-shadow:
			0 26px 60px -14px rgba(0, 0, 0, 0.85),
			0 0 0 1px rgba(0, 0, 0, 0.5),
			inset 0 1px 0 color-mix(in srgb, var(--accent) 20%, transparent);
		animation: cardIn 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.15);
		font-size: 0.9rem;
		color: var(--color-parch-200);
	}
	.cx-card__bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.7rem;
		cursor: grab;
		border-bottom: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
		position: sticky;
		top: 0;
		background: color-mix(in srgb, var(--color-ink-900) 75%, transparent);
		backdrop-filter: blur(4px);
		border-radius: 12px 12px 0 0;
		user-select: none;
	}
	.cx-card__bar:active {
		cursor: grabbing;
	}
	.cx-card__seal {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: radial-gradient(circle, var(--color-gold-400), var(--color-gold-600));
		color: var(--color-ink-900);
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.85rem;
		flex: none;
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.4);
	}
	.cx-card__title {
		font-family: var(--font-display);
		font-size: 1.04rem;
		color: var(--color-gold-300);
		flex: 1;
		line-height: 1.15;
	}
	.cx-card__x {
		background: none;
		border: none;
		color: var(--color-parch-muted);
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0.15rem 0.3rem;
		border-radius: 4px;
		transition: color 0.15s, background 0.15s;
	}
	.cx-card__x:hover {
		color: var(--color-rose);
		background: color-mix(in srgb, var(--color-rose) 16%, transparent);
	}
	.cx-card__from {
		padding: 0.35rem 0.8rem 0;
		font-size: 0.58rem;
		opacity: 0.6;
	}
	.cx-card__short {
		padding: 0.4rem 0.8rem 0;
		color: var(--color-parch-muted);
		font-style: italic;
		font-size: 0.84rem;
	}
	.cx-card__formula {
		padding: 0.3rem 0.8rem 0;
	}
	.cx-card__body {
		padding: 0.55rem 0.8rem 0.7rem;
	}
	.cx-card__rel {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding: 0 0.8rem 0.8rem;
	}
	.cx-chip {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		background: color-mix(in srgb, var(--accent) 12%, var(--color-ink-700));
		color: var(--color-gold-300);
		border: 1px solid var(--accent-line);
		border-radius: 99px;
		padding: 0.2rem 0.6rem;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
	}
	.cx-chip:hover {
		background: color-mix(in srgb, var(--accent) 24%, var(--color-ink-700));
		transform: translateY(-1px);
	}
</style>
