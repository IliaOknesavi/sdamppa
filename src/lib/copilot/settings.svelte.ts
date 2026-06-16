import { browser } from '$app/environment';

// Connection to the user's own Ollama (local http://localhost:11434, or a
// remote/cloud endpoint with an API key). Stored only in localStorage and sent
// only to that endpoint — nothing touches our servers (the site is static).
export interface OllamaSettings {
	baseUrl: string;
	apiKey: string;
	model: string;
}

const DEFAULTS: OllamaSettings = {
	baseUrl: 'http://localhost:11434',
	apiKey: '',
	model: ''
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
