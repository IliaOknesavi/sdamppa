<script lang="ts">
	// Единый набор геометрических SVG-иконок (currentColor) вместо эмодзи в UI-хроме.
	// Уверенная толщина под жирный Golos; наследуют цвет текста кнопки/метки.
	let {
		name,
		size = 18,
		stroke = 2,
		fill = false
	}: { name: string; size?: number; stroke?: number; fill?: boolean } = $props();
</script>

<svg
	class="icon"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={fill ? 'currentColor' : 'none'}
	stroke={fill ? 'none' : 'currentColor'}
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'close'}
		<path d="M18 6 6 18M6 6l12 12" />
	{:else if name === 'settings'}
		<circle cx="12" cy="12" r="3" />
		<path
			d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6"
		/>
	{:else if name === 'trash'}
		<path d="M3.5 6h17M8.5 6V4.2A1.7 1.7 0 0 1 10.2 2.5h3.6A1.7 1.7 0 0 1 15.5 4.2V6M6.5 6l1 13.5a2 2 0 0 0 2 1.9h5a2 2 0 0 0 2-1.9L18.5 6" />
	{:else if name === 'send'}
		<path d="M12 20V5M6 11l6-6 6 6" />
	{:else if name === 'stop'}
		<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none" />
	{:else if name === 'spark'}
		<path
			d="M12 2.2c.4 4.6 2.9 7.1 7.5 7.5-4.6.4-7.1 2.9-7.5 7.5-.4-4.6-2.9-7.1-7.5-7.5 4.6-.4 7.1-2.9 7.5-7.5z"
			fill="currentColor"
			stroke="none"
		/>
	{:else if name === 'sun'}
		<circle cx="12" cy="12" r="4" />
		<path
			d="M12 2v2.5M12 19.5V22M22 12h-2.5M4.5 12H2M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8M19.1 19.1l-1.8-1.8M6.7 6.7 4.9 4.9"
		/>
	{:else if name === 'moon'}
		<path d="M20.5 13.2A8.2 8.2 0 1 1 10.8 3.5a6.4 6.4 0 0 0 9.7 9.7z" />
	{:else if name === 'flame'}
		<path
			d="M8.6 14.3A2.4 2.4 0 0 0 11 12c0-1.3-.5-1.9-1-2.9-1-2 .2-3.8 2-5.6.5 2.4 1.9 4.7 3.8 6.2 1.9 1.5 2.9 3.3 2.9 5.3a6.7 6.7 0 1 1-13.4 0c0-1.1.4-2.2 1-2.9a2.4 2.4 0 0 0 2.3 2.2z"
		/>
	{:else if name === 'bulb'}
		<path d="M9 18h6M10 21.5h4M15 14.5c.2-1 .7-1.7 1.5-2.5A5.7 5.7 0 1 0 7.5 12c.8.8 1.3 1.5 1.5 2.5" />
	{:else if name === 'timer'}
		<circle cx="12" cy="13" r="8" />
		<path d="M12 9v4l2.5 1.8M9 2.5h6" />
	{:else if name === 'flag'}
		<path d="M5 21V4M5 4s1.2-1 4-1 5 2 8 2 4-1 4-1v9s-1.2 1-4 1-5-2-8-2-4 1-4 1" />
	{:else if name === 'lock'}
		<rect x="5" y="11" width="14" height="9.5" rx="2" />
		<path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
	{/if}
</svg>

<style>
	.icon {
		display: inline-block;
		vertical-align: -0.15em;
		flex: none;
	}
</style>
