import { settings } from './settings.svelte';

export interface ChatMsg {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

/** List models (also a connection test). Supports Ollama and OpenAI-compatible. */
export async function listModels(): Promise<string[]> {
	if (settings.s.apiType === 'openai') {
		const r = await fetch(settings.base + '/v1/models', { headers: settings.authHeaders() });
		if (!r.ok) throw new Error('HTTP ' + r.status);
		const j = await r.json();
		return ((j.data ?? []) as { id: string }[]).map((m) => m.id).sort();
	}
	const r = await fetch(settings.base + '/api/tags', { headers: settings.authHeaders() });
	if (!r.ok) throw new Error('HTTP ' + r.status);
	const j = await r.json();
	return ((j.models ?? []) as { name: string }[]).map((m) => m.name).sort();
}

/** Stream a chat completion, dispatching to the chosen API shape. */
export async function chatStream(
	messages: ChatMsg[],
	onToken: (t: string) => void,
	signal?: AbortSignal
): Promise<void> {
	return settings.s.apiType === 'openai'
		? openaiStream(messages, onToken, signal)
		: ollamaStream(messages, onToken, signal);
}

// --- Ollama native: POST /api/chat → NDJSON {message:{content}, done} --------
async function ollamaStream(messages: ChatMsg[], onToken: (t: string) => void, signal?: AbortSignal) {
	const r = await fetch(settings.base + '/api/chat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...settings.authHeaders() },
		body: JSON.stringify({ model: settings.s.model, messages, stream: true }),
		signal
	});
	await pumpLines(r, (line) => {
		try {
			const o = JSON.parse(line);
			if (o.message?.content) onToken(o.message.content as string);
		} catch {
			/* skip */
		}
	});
}

// --- OpenAI-compatible: POST /v1/chat/completions → SSE "data: {...}" --------
async function openaiStream(messages: ChatMsg[], onToken: (t: string) => void, signal?: AbortSignal) {
	const r = await fetch(settings.base + '/v1/chat/completions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...settings.authHeaders() },
		body: JSON.stringify({ model: settings.s.model, messages, stream: true }),
		signal
	});
	await pumpLines(r, (line) => {
		if (!line.startsWith('data:')) return;
		const payload = line.slice(5).trim();
		if (payload === '[DONE]') return;
		try {
			const o = JSON.parse(payload);
			const t = o.choices?.[0]?.delta?.content;
			if (t) onToken(t as string);
		} catch {
			/* skip */
		}
	});
}

async function pumpLines(r: Response, onLine: (line: string) => void) {
	if (!r.ok || !r.body) {
		const detail = await r.text().catch(() => '');
		throw new Error('HTTP ' + r.status + (detail ? ': ' + detail.slice(0, 200) : ''));
	}
	const reader = r.body.getReader();
	const dec = new TextDecoder();
	let buf = '';
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		buf += dec.decode(value, { stream: true });
		let nl: number;
		while ((nl = buf.indexOf('\n')) >= 0) {
			const line = buf.slice(0, nl).trim();
			buf = buf.slice(nl + 1);
			if (line) onLine(line);
		}
	}
}

/** Build the system message that grounds the assistant in the current lecture. */
export function systemPrompt(label: string, title: string, text: string): string {
	return [
		'Ты — встроенный ИИ-ассистент учебной платформы СдамППА. Помогаешь студенту разобраться в КОНКРЕТНОЙ теме/лекции, материал которой дан ниже.',
		'Правила: отвечай на русском, по делу и понятно; опирайся на материал страницы; если просят — проверяй понимание короткими вопросами и давай обратную связь; код объясняй с асимптотикой. Если вопрос выходит за рамки темы — мягко верни к ней, но помоги.',
		'',
		'ФОРМАТ ОТВЕТА. Платформа рендерит твой текст СВОЕЙ облегчённой разметкой (это НЕ полный Markdown). Используй только:',
		'- **жирный**, *курсив*, `моноширинный`;',
		'- формулы LaTeX/KaTeX: строчные в одинарных $...$, выключные в двойных $$...$$ на отдельной строке. НЕ пиши \\( \\) или \\[ \\];',
		'- код — в тройных бэктиках с языком (```c ... ``` или ```python ... ```);',
		'- списки — строки, начинающиеся с «- » или «1. »;',
		'- между абзацами, списками, формулами и кодом ОБЯЗАТЕЛЬНО оставляй пустую строку.',
		'ЗАПРЕЩЕНО: заголовки через #, ##, ### — они НЕ рендерятся и показываются как символы «###». Для подзаголовка просто начни абзац с **жирного текста**. Не используй эмодзи как маркеры списка и не пиши [[...]] (это внутренние ссылки платформы на термины).',
		'',
		`СТРАНИЦА: ${label} — ${title}`,
		'',
		'МАТЕРИАЛ СТРАНИЦЫ:',
		text || '(контекст недоступен)'
	].join('\n');
}
