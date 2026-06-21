<script lang="ts">
	import { tips } from './tooltips.svelte';
	import RichText from './RichText.svelte';
	import Katex from './Katex.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const t = $derived(tips.hover ? tips.get(tips.hover.id) : undefined);
	const fromTerm = $derived(tips.hover?.parent ? tips.get(tips.hover.parent) : undefined);
	let elPop: HTMLDivElement | undefined = $state();
	// невидим (opacity:0), пока не спозиционирован — убирает «мигание» и прыжок при flip
	let placed = $state(false);

	// Позиционируем один раз после монтирования/смены термина: измеряем реальную
	// высоту, при необходимости открываем вверх, клампим во вьюпорт, и запоминаем
	// итог в tips.hoverPlaced — чтобы закрепление произошло РОВНО тут же (бесшовно).
	$effect(() => {
		const h = tips.hover;
		if (!h || !elPop) {
			placed = false;
			tips.hoverEl = null;
			return;
		}
		void h.key;
		const W = window.innerWidth;
		const H = window.innerHeight;
		const pw = elPop.offsetWidth;
		const ph = elPop.offsetHeight;
		const left = Math.max(12, Math.min(h.rect.left, W - pw - 12));
		let top = h.rect.bottom + 9;
		if (top + ph > H - 12) top = h.rect.top - ph - 9; // не влезает снизу → вверх
		top = Math.max(12, Math.min(top, H - ph - 12)); // строго во вьюпорт
		elPop.style.left = left + 'px';
		elPop.style.top = top + 'px';
		tips.hoverEl = elPop; // для закрепления по живой позиции
		placed = true;
	});
</script>

<!-- ЭФЕМЕРНЫЙ peek = ТА ЖЕ карточка, что и закреплённая (.tcard), но «призрачная»
     (pointer-events:none): выглядит ИДЕНТИЧНО будущему пину, поэтому закрепление
     ничего не меняет визуально. Мышь проходит сквозь → не мешает кликать термин.
     Кнопки/чипы здесь декоративны (инертны); взаимодействие — после закрепления. -->
{#if tips.hover && t}
	<div class="tcard tcard--ghost" class:placed bind:this={elPop} role="tooltip" aria-hidden="true">
		<div class="tcard__bar">
			<span class="tcard__title">{t.term}</span>
			<button class="tcard__x" tabindex="-1"><Icon name="close" size={15} /></button>
		</div>
		{#if fromTerm}<div class="tcard__from label">из · {fromTerm.term}</div>{/if}
		{#if t.short}<div class="tcard__short"><RichText source={t.short} parent={t.id} /></div>{/if}
		{#if t.formula}<div class="tcard__formula"><Katex math={t.formula} display /></div>{/if}
		<div class="tcard__body"><RichText source={t.body} parent={t.id} /></div>
		{#if t.related?.length}
			<div class="tcard__rel">
				{#each t.related as r}
					{#if tips.has(r)}<button class="tcard-chip" tabindex="-1">{tips.get(r)!.term}</button>{/if}
				{/each}
			</div>
		{/if}
	</div>
{/if}
