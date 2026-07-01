// =====================================================================
//  Codex markup parser — a tiny, dependency-free mini-markdown.
//  Designed to be trivially authorable (incl. by content-generation agents)
//  and to render natively to Svelte components (math + nested term tooltips).
//
//  Inline:  **bold**  *italic*  `code`  $math$  [[id|label]]
//  Block:   paragraphs (blank-line separated), - / • lists, 1. lists,
//           ## headings, $$display math$$
// =====================================================================

export type Inline =
	| { k: 'text'; v: string }
	| { k: 'b'; c: Inline[] }
	| { k: 'i'; c: Inline[] }
	| { k: 'code'; v: string }
	| { k: 'math'; v: string; display?: boolean }
	| { k: 'term'; id: string; label: string }
	| { k: 'link'; href: string; c: Inline[] };

export type Block =
	| { k: 'p'; c: Inline[] }
	| { k: 'h'; level: number; c: Inline[] }
	| { k: 'math'; v: string }
	| { k: 'ul'; items: Inline[][] }
	| { k: 'ol'; items: Inline[][] }
	| { k: 'table'; head: Inline[][]; rows: Inline[][][] }
	| { k: 'codeblock'; lang: string; v: string };

interface Pattern {
	re: RegExp;
	make: (m: RegExpExecArray) => Inline;
}

// Order matters: bold before italic; verbatim tokens (math/code/term) win at
// equal position by being earlier in the list.
const PATTERNS: Pattern[] = [
	// display math first, so $$...$$ wins over $...$ (even inline, mid-paragraph)
	{ re: /\$\$([\s\S]+?)\$\$/, make: (m) => ({ k: 'math', v: m[1].trim(), display: true }) },
	{ re: /\$([^$\n]+?)\$/, make: (m) => ({ k: 'math', v: m[1] }) },
	{ re: /`([^`]+?)`/, make: (m) => ({ k: 'code', v: m[1] }) },
	{
		re: /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/,
		make: (m) => ({ k: 'term', id: m[1].trim(), label: (m[2] ?? m[1]).trim() })
	},
	// markdown link [label](href) — for internal navigation between days/modules
	{
		re: /\[([^\]\n]+?)\]\(([^)\s]+?)\)/,
		make: (m) => ({ k: 'link', href: m[2].trim(), c: parseInline(m[1]) })
	},
	{ re: /\*\*([^*]+?)\*\*/, make: (m) => ({ k: 'b', c: parseInline(m[1]) }) },
	{ re: /\*([^*\n]+?)\*/, make: (m) => ({ k: 'i', c: parseInline(m[1]) }) }
];

export function parseInline(src: string): Inline[] {
	const out: Inline[] = [];
	let rest = src;
	while (rest.length) {
		let best: { idx: number; len: number; node: Inline } | null = null;
		for (const p of PATTERNS) {
			const m = p.re.exec(rest);
			if (m && (best === null || m.index < best.idx)) {
				best = { idx: m.index, len: m[0].length, node: p.make(m) };
				if (m.index === 0) break;
			}
		}
		if (!best) {
			out.push({ k: 'text', v: rest });
			break;
		}
		if (best.idx > 0) out.push({ k: 'text', v: rest.slice(0, best.idx) });
		out.push(best.node);
		rest = rest.slice(best.idx + best.len);
	}
	return out;
}

export function parseBlocks(src: string): Block[] {
	const norm = (src ?? '').replace(/\r\n?/g, '\n').trim();
	if (!norm) return [];
	const blocks: Block[] = [];

	// Fence pre-pass: pull ```...``` code blocks out before blank-line splitting.
	const lines = norm.split('\n');
	let i = 0;
	let buf: string[] = [];
	const flush = () => {
		const text = buf.join('\n').trim();
		buf = [];
		if (text) parseTextBlocks(text, blocks);
	};
	while (i < lines.length) {
		const fence = /^\s*```(.*)$/.exec(lines[i]);
		if (fence) {
			flush();
			const lang = fence[1].trim();
			const code: string[] = [];
			i++;
			while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) code.push(lines[i++]);
			i++; // skip closing fence
			blocks.push({ k: 'codeblock', lang, v: code.join('\n') });
		} else {
			buf.push(lines[i++]);
		}
	}
	flush();
	return blocks;
}

function parseTextBlocks(norm: string, blocks: Block[]): void {
	const chunks = norm.split(/\n{2,}/);

	for (const raw of chunks) {
		const t = raw.trim();
		if (!t) continue;

		// display math: whole chunk wrapped in $$ ... $$ (may span lines)
		if (t.startsWith('$$') && t.endsWith('$$') && t.length >= 4) {
			blocks.push({ k: 'math', v: t.slice(2, -2).trim() });
			continue;
		}

		const lines = t.split('\n');

		// single-line heading
		const h = /^(#{1,4})\s+(.*)$/.exec(t);
		if (h && lines.length === 1) {
			blocks.push({ k: 'h', level: h[1].length, c: parseInline(h[2]) });
			continue;
		}

		// unordered list
		if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
			blocks.push({ k: 'ul', items: lines.map((l) => parseInline(l.replace(/^\s*[-•]\s+/, ''))) });
			continue;
		}

		// ordered list
		if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
			blocks.push({
				k: 'ol',
				items: lines.map((l) => parseInline(l.replace(/^\s*\d+[.)]\s+/, '')))
			});
			continue;
		}

		// markdown table: header row + separator (|---|---|) + body rows
		const isSep = (l: string) => /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(l);
		if (lines.length >= 2 && lines[0].includes('|') && isSep(lines[1])) {
			const cells = (l: string): Inline[][] => {
				let s = l.trim();
				if (s.startsWith('|')) s = s.slice(1);
				if (s.endsWith('|')) s = s.slice(0, -1);
				return s.split('|').map((c) => parseInline(c.trim()));
			};
			blocks.push({ k: 'table', head: cells(lines[0]), rows: lines.slice(2).map(cells) });
			continue;
		}

		// paragraph: join soft line breaks with spaces
		blocks.push({ k: 'p', c: parseInline(lines.join(' ')) });
	}
}
