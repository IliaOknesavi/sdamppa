<script lang="ts">
	import { tips, type Pin } from './tooltips.svelte';
	import RichText from './RichText.svelte';
	import Katex from './Katex.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { pin }: { pin: Pin } = $props();
	const t = $derived(tips.get(pin.id));

	const CARD_W = 358; // совпадает с .tcard width
	let drag: { dx: number; dy: number } | null = null;
	let cardEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		// при закреплении переводим фокус в карточку — для клавиатуры/скринридера
		cardEl?.focus();
	});

	function down(e: PointerEvent) {
		if (e.button !== 0) return;
		// не захватываем указатель на кнопке закрытия, иначе её клик проглатывается
		if ((e.target as HTMLElement).closest('.tcard__x')) return;
		tips.front(pin.key);
		drag = { dx: e.clientX - pin.x, dy: e.clientY - pin.y };
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (!drag) return;
		const W = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const H = typeof window !== 'undefined' ? window.innerHeight : 800;
		// держим шапку (заголовок + ✕) во вьюпорте — нельзя утащить карточку за край
		const x = Math.max(-(CARD_W - 160), Math.min(e.clientX - drag.dx, W - 60));
		const y = Math.max(0, Math.min(e.clientY - drag.dy, H - 48));
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
		class="tcard tcard--pinned"
		class:seamless={pin.seamless}
		bind:this={cardEl}
		tabindex="-1"
		role="dialog"
		aria-label={t.term}
		style="left:{pin.x}px; top:{pin.y}px; z-index:{pin.z};"
		onpointerdown={() => tips.front(pin.key)}
	>
		<div
			class="tcard__bar"
			onpointerdown={down}
			onpointermove={move}
			onpointerup={up}
			onpointercancel={up}
		>
			<span class="tcard__title">{t.term}</span>
			<button
				class="tcard__x"
				title="Закрыть"
				aria-label="Закрыть"
				onpointerdown={(e) => e.stopPropagation()}
				onclick={(e) => {
					e.stopPropagation();
					tips.closePin(pin.key);
				}}><Icon name="close" size={15} /></button
			>
		</div>
		{#if pin.parent && tips.get(pin.parent)}
			<div class="tcard__from label">из · {tips.get(pin.parent)!.term}</div>
		{/if}
		{#if t.short}<div class="tcard__short"><RichText source={t.short} parent={t.id} /></div>{/if}
		{#if t.formula}<div class="tcard__formula"><Katex math={t.formula} display /></div>{/if}
		<div class="tcard__body"><RichText source={t.body} parent={t.id} /></div>
		{#if t.related?.length}
			<div class="tcard__rel">
				{#each t.related as r}
					{#if tips.has(r)}
						<button class="tcard-chip" onclick={(e) => pinChip(e, r)}>{tips.get(r)!.term}</button>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{/if}
