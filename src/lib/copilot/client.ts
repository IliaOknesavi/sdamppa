import { settings } from './settings.svelte';

export interface ChatMsg {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

/** List models available on the configured Ollama (also a connection test). */
export async function listModels(): Promise<string[]> {
	const r = await fetch(settings.base + '/api/tags', { headers: settings.authHeaders() });
	if (!r.ok) throw new Error('HTTP ' + r.status);
	const j = await r.json();
	return ((j.models ?? []) as { name: string }[]).map((m) => m.name).sort();
}

/** Stream a chat completion from Ollama (/api/chat, NDJSON). Calls onToken per chunk. */
export async function chatStream(
	messages: ChatMsg[],
	onToken: (t: string) => void,
	signal?: AbortSignal
): Promise<void> {
	const r = await fetch(settings.base + '/api/chat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...settings.authHeaders() },
		body: JSON.stringify({ model: settings.s.model, messages, stream: true }),
		signal
	});
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
			if (!line) continue;
			try {
				const o = JSON.parse(line);
				if (o.message?.content) onToken(o.message.content as string);
			} catch {
				/* skip partial line */
			}
		}
	}
}

/** Build the system message that grounds the assistant in the current lecture. */
export function systemPrompt(label: string, title: string, text: string): string {
	return [
		'Ты — встроенный ИИ-ассистент учебной платформы СдамППА. Помогаешь студенту разобраться в КОНКРЕТНОЙ теме/лекции, материал которой дан ниже.',
		'Правила: отвечай на русском, по делу и понятно; опирайся на материал страницы; если просят — проверяй понимание короткими вопросами и давай обратную связь; код объясняй с асимптотикой. Если вопрос выходит за рамки темы — мягко верни к ней, но помоги.',
		'',
		`СТРАНИЦА: ${label} — ${title}`,
		'',
		'МАТЕРИАЛ СТРАНИЦЫ:',
		text || '(контекст недоступен)'
	].join('\n');
}
