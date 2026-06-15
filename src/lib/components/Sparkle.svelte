<script lang="ts">
	// Generic 4-point "twinkle" sparkle — a plain geometric primitive used as a
	// decorative accent. Colour via `color` prop (currentColor).
	let { size = 64, color = 'currentColor' }: { size?: number; color?: string } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 100 100"
	fill="none"
	aria-hidden="true"
	style="display:block"
>
	<path
		d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0 Z"
		fill={color}
	/>
</svg>
