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
			(t.closest('.cx-card') ||
				t.closest('.cx-term') ||
				t.closest('.cx-pop') ||
				t.closest('.cx-closeall'))
		)
			return;
		tips.closeAll();
	}
</script>

<svelte:window onpointerdown={onWindowDown} />

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
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 60;
	}
	.cx-closeall {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 80;
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
