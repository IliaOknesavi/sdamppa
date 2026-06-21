<script lang="ts">
	import { tips } from './tooltips.svelte';
	import HoverPopover from './HoverPopover.svelte';
	import PinCard from './PinCard.svelte';

	// Click anywhere outside cards / terms / popovers → dismiss everything.
	function onWindowDown(e: PointerEvent) {
		if (tips.pins.length === 0 && !tips.hover) return;
		const t = e.target as HTMLElement | null;
		if (
			t &&
			(t.closest('.tcard') || // и peek (.tcard--ghost), и закреплённая (.tcard--pinned)
				t.closest('.cx-term') ||
				t.closest('.cx-closeall'))
		)
			return;
		tips.closeAll();
	}

	// Esc → закрыть верхнюю карточку (или hover-попап, если карточек нет).
	function onWindowKey(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (tips.pins.length) {
			const top = tips.pins.reduce((a, b) => (b.z > a.z ? b : a));
			tips.closePin(top.key);
		} else if (tips.hover) {
			tips.hover = null;
		}
	}
</script>

<svelte:window onpointerdown={onWindowDown} onkeydown={onWindowKey} />

<div class="cx-layer">
	<HoverPopover />
	{#each tips.pins as p (p.key)}
		<PinCard pin={p} />
	{/each}
</div>

{#if tips.pins.length > 1}
	<button class="cx-closeall" onclick={() => tips.closeAll()}>
		закрыть все ({tips.pins.length})
	</button>
{/if}

<style>
	.cx-layer {
		/* display:contents — обёртка НЕ создаёт свой stacking-контекст. Иначе
		   fixed-слой с z-index запирал бы пины/попап под Copilot (z:95).
		   Каждый попап/карточка — fixed и позиционируется сам. */
		display: contents;
	}
	.cx-closeall {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 100000;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.05em;
		background: var(--color-ink-800);
		color: var(--color-parch-200);
		border: 1px solid var(--accent-line);
		border-radius: 99px;
		padding: 0.45rem 0.9rem;
		cursor: pointer;
		box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.7);
		transition: background 0.15s;
	}
	.cx-closeall:hover {
		background: var(--color-ink-700);
	}
</style>
