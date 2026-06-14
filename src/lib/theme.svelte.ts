import { browser } from '$app/environment';

// Light (ITMO) is the default; dark "codex" is opt-in via [data-theme="dark"].
// The pre-paint <script> in app.html already applies the saved theme to avoid
// flashing; this store keeps the toggle reactive and persists the choice.
class Theme {
	current = $state<'light' | 'dark'>('light');

	init() {
		if (!browser) return;
		this.current = localStorage.getItem('codex:theme') === 'dark' ? 'dark' : 'light';
		this.#apply();
	}
	#apply() {
		if (!browser) return;
		const el = document.documentElement;
		if (this.current === 'dark') el.setAttribute('data-theme', 'dark');
		else el.removeAttribute('data-theme');
	}
	toggle() {
		this.current = this.current === 'dark' ? 'light' : 'dark';
		if (browser) localStorage.setItem('codex:theme', this.current);
		this.#apply();
	}
}

export const theme = new Theme();
