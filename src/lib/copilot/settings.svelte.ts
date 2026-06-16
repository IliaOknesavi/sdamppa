import { browser } from '$app/environment';

// Connection to an LLM endpoint reachable FROM THE BROWSER (i.e. CORS-enabled):
//  • local Ollama (http://localhost:11434) — set OLLAMA_ORIGINS=* so the browser
//    is allowed; cloud models work here too after `ollama signin` (use a cloud
//    model name) — the request goes to localhost, Ollama relays to the cloud;
//  • any OpenAI-compatible endpoint / your own proxy that sends CORS headers.
// NB: ollama.com directly does NOT send CORS headers, so a static site cannot
// call it from the browser — route cloud models through local Ollama instead.
export interface OllamaSettings {
	baseUrl: string;
	apiKey: string; // optional Bearer token
	model: string;
	apiType: 'ollama' | 'openai'; // /api/chat (NDJSON)  |  /v1/chat/completions (SSE)
}

const DEFAULTS: OllamaSettings = {
	baseUrl: 'http://localhost:11434',
	apiKey: '',
	model: '',
	apiType: 'ollama'
};

class CopilotSettings {
	s = $state<OllamaSettings>({ ...DEFAULTS });
	loaded = $state(false);

	load() {
		if (!browser || this.loaded) return;
		try {
			const raw = localStorage.getItem('copilot:ollama');
			if (raw) this.s = { ...DEFAULTS, ...JSON.parse(raw) };
		} catch {
			/* ignore */
		}
		this.loaded = true;
	}
	save() {
		if (browser) localStorage.setItem('copilot:ollama', JSON.stringify(this.s));
	}
	get base(): string {
		return this.s.baseUrl.replace(/\/+$/, '');
	}
	get configured(): boolean {
		return !!this.s.baseUrl && !!this.s.model;
	}
	authHeaders(): Record<string, string> {
		return this.s.apiKey ? { Authorization: 'Bearer ' + this.s.apiKey } : {};
	}
}

export const settings = new CopilotSettings();
