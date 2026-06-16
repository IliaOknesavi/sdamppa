<script lang="ts">
	// Read-only syntax-highlighted code with hoverable API tokens.
	// Known numpy/torch tokens (ids prefixed 'py:' in the glossary) become the
	// SAME hover/pin cards as concept terms — reusing the tooltip engine.
	import { tips } from '$lib/engine/tooltips.svelte';

	let { code }: { code: string } = $props();

	const KEYWORDS = new Set([
		'def', 'return', 'for', 'in', 'if', 'elif', 'else', 'while', 'import', 'from', 'as', 'with',
		'lambda', 'class', 'pass', 'break', 'continue', 'and', 'or', 'not', 'is', 'None', 'True',
		'False', 'yield', 'global', 'assert', 'try', 'except', 'finally', 'raise', 'del'
	]);
	const BUILTINS = new Set([
		'print', 'range', 'len', 'enumerate', 'zip', 'min', 'max', 'abs', 'list', 'dict', 'set',
		'tuple', 'int', 'float', 'str', 'bool', 'sorted', 'map', 'filter', 'round', 'open', 'super'
	]);

	type Node = { t: 'plain'; v: string; cls?: string } | { t: 'api'; v: string; id: string };

	// API ids are 'py:<token>'. Resolve a dotted chain to the longest known suffix.
	function resolveChain(segs: string[]): { id: string; start: number } | null {
		for (let i = 0; i < segs.length; i++) {
			const cand = 'py:' + segs.slice(i).join('.');
			if (tips.has(cand)) return { id: cand, start: i };
		}
		const method = 'py:.' + segs[segs.length - 1];
		if (tips.has(method)) return { id: method, start: segs.length - 1 };
		return null;
	}

	function identCls(s: string): string | undefined {
		if (KEYWORDS.has(s)) return 'c-kw';
		if (BUILTINS.has(s)) return 'c-bi';
		return undefined;
	}

	const TOK =
		/(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\d[\d_]*\.?\d*(?:[eE][-+]?\d+)?j?)|([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)|(\s+)|([^\sA-Za-z0-9_]+)/g;

	const nodes = $derived.by<Node[]>(() => {
		const out: Node[] = [];
		let m: RegExpExecArray | null;
		TOK.lastIndex = 0;
		while ((m = TOK.exec(code))) {
			if (m[1] != null) out.push({ t: 'plain', v: m[1], cls: 'c-com' });
			else if (m[2] != null) out.push({ t: 'plain', v: m[2], cls: 'c-str' });
			else if (m[3] != null) out.push({ t: 'plain', v: m[3], cls: 'c-num' });
			else if (m[4] != null) {
				const segs = m[4].split('.');
				const r = resolveChain(segs);
				if (r) {
					if (r.start > 0)
						out.push({ t: 'plain', v: segs.slice(0, r.start).join('.') + '.', cls: identCls(segs[0]) });
					out.push({ t: 'api', v: segs.slice(r.start).join('.'), id: r.id });
				} else {
					out.push({ t: 'plain', v: m[4], cls: identCls(m[4]) });
				}
			} else if (m[5] != null) out.push({ t: 'plain', v: m[5] });
			else if (m[6] != null) out.push({ t: 'plain', v: m[6], cls: 'c-op' });
		}
		return out;
	});

	// Hover → peek popover, then a hold-to-pin ring auto-pins (same as Term.svelte).
	let showT: ReturnType<typeof setTimeout> | undefined;
	let holdingIdx = $state<number | null>(null);

	function enter(e: MouseEvent, id: string, idx: number) {
		const el = e.currentTarget as HTMLElement;
		clearTimeout(showT);
		showT = setTimeout(() => {
			tips.showHover(id, el.getBoundingClientRect());
			holdingIdx = idx; // start the auto-pin ring
		}, 130);
	}
	function leave() {
		clearTimeout(showT);
		holdingIdx = null;
		tips.scheduleHide();
	}
	function pin(el: HTMLElement, id: string) {
		clearTimeout(showT);
		holdingIdx = null;
		tips.pinFromRect(id, el.getBoundingClientRect());
	}
	function ringEnd(e: AnimationEvent, id: string) {
		const span = (e.currentTarget as HTMLElement).parentElement;
		holdingIdx = null;
		if (span) tips.pinFromRect(id, span.getBoundingClientRect());
	}
</script>

<pre class="cv"><code>{#each nodes as n, i}{#if n.t === 'api'}<span class="cv-api" role="button" tabindex="0" onmouseenter={(e) => enter(e, n.id, i)} onmouseleave={leave} onclick={(e) => pin(e.currentTarget as HTMLElement, n.id)} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pin(e.currentTarget as HTMLElement, n.id); } }}>{n.v}{#if holdingIdx === i}<span class="ring" onanimationend={(e) => ringEnd(e, n.id)}></span>{/if}</span>{:else if n.cls}<span class={n.cls}>{n.v}</span>{:else}{n.v}{/if}{/each}</code></pre>

<style>
	.cv {
		margin: 0;
		padding: 0.9rem 1rem;
		background: var(--color-ink-900);
		color: #d8dee9;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.55;
		tab-size: 4;
		white-space: pre;
		overflow-x: auto;
	}
	.cv code {
		font-family: inherit;
	}
	.c-com {
		color: #6b7280;
		font-style: italic;
	}
	.c-str {
		color: #9ece6a;
	}
	.c-num {
		color: #e0af68;
	}
	.c-kw {
		color: #bb9af7;
	}
	.c-bi {
		color: #7aa2f7;
	}
	.c-op {
		color: #89ddff;
	}
	.cv-api {
		position: relative;
		color: #ff9e64;
		border-bottom: 1px dashed color-mix(in srgb, #ff9e64 70%, transparent);
		border-radius: 2px;
		cursor: help;
		transition: background 0.12s;
	}
	.cv-api:hover {
		background: color-mix(in srgb, #ff9e64 22%, transparent);
	}
	.ring {
		position: absolute;
		top: -0.55em;
		right: -0.7em;
		width: 0.85em;
		height: 0.85em;
		border-radius: 50%;
		background: conic-gradient(#ff9e64 var(--ring, 0%), transparent 0);
		animation: ringfill 1240ms linear forwards;
		pointer-events: none;
		filter: drop-shadow(0 0 3px color-mix(in srgb, #ff9e64 60%, transparent));
	}
</style>
