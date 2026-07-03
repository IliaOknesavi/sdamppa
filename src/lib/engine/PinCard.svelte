<script lang="ts">
	import { tips, type Pin } from './tooltips.svelte';
	import RichText from './RichText.svelte';
	import Katex from './Katex.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { pin }: { pin: Pin } = $props();
	const t = $derived(tips.get(pin.id));

	let drag: { dx: number; dy: number } | null = null;
	let cardEl: HTMLDivElement | undefined = $state();

	// держим карточку ЦЕЛИКОМ во вьюпорте по её РЕАЛЬНОМУ размеру — критично на
	// телефоне, где карточка почти во всю ширину и её нельзя утаскивать за край.
	function clampPos(x: number, y: number) {
		if (typeof window === 'undefined') return { x, y };
		// offsetWidth/Height, а НЕ getBoundingClientRect: у карточки анимация scale-in,
		// и bounding rect возвращает уменьшенный (scaled) размер → недоклэмп на ~5%.
		const cw = cardEl?.offsetWidth ?? 320;
		const ch = cardEl?.offsetHeight ?? 200;
		const m = 8;
		return {
			x: Math.max(m, Math.min(x, window.innerWidth - cw - m)),
			y: Math.max(m, Math.min(y, window.innerHeight - ch - m))
		};
	}
	function reclamp() {
		const { x, y } = clampPos(pin.x, pin.y);
		if (x !== pin.x || y !== pin.y) tips.move(pin.key, x, y);
	}

	$effect(() => {
		if (!cardEl) return;
		cardEl.focus(); // фокус для клавиатуры/скринридера
		// Контент (KaTeX/картинки) рендерится АСИНХРОННО и меняет высоту карточки.
		// Клэмпим несколько раз по мере «оседания» размера + на каждое его изменение,
		// чтобы карточка гарантированно не вылезала за нижний/правый край экрана.
		const timers = [0, 80, 200, 420].map((d) => setTimeout(reclamp, d));
		const ro = new ResizeObserver(() => reclamp());
		ro.observe(cardEl);
		return () => {
			timers.forEach(clearTimeout);
			ro.disconnect();
		};
	});

	function down(e: PointerEvent) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		// не захватываем указатель на кнопке закрытия, иначе её клик проглатывается
		if ((e.target as HTMLElement).closest('.tcard__x')) return;
		tips.front(pin.key);
		drag = { dx: e.clientX - pin.x, dy: e.clientY - pin.y };
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (!drag) return;
		e.preventDefault(); // не скроллить страницу пальцем во время перетаскивания
		const { x, y } = clampPos(e.clientX - drag.dx, e.clientY - drag.dy);
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

<svelte:window onresize={reclamp} />

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
