import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

// Cross-origin isolation → enables SharedArrayBuffer for the in-browser C
// toolchain (Wasmer/clang). `credentialless` keeps cross-origin CDN loads
// (Pyodide, fonts) working without needing CORP headers on those origins.
// In production the static web server (Caddy/Nginx) must send the same two.
const crossOriginIsolation: Plugin = {
	name: 'cross-origin-isolation',
	configureServer(server) {
		server.middlewares.use((_req, res, next) => {
			res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
			res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
			next();
		});
	}
};

export default defineConfig({
	plugins: [
		crossOriginIsolation,
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Pure static build → serve from any web server (Nginx/Caddy/Apache).
			// fallback: 'index.html' makes a universal SPA shell (served at / and,
			// via the web-server SPA-fallback config, for deep links too).
			adapter: adapter({ fallback: 'index.html' })
		})
	]
});
