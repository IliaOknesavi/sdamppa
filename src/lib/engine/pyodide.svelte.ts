// =====================================================================
//  In-browser Python via Pyodide (CPython → WASM), lazy-loaded from CDN.
//  First run downloads the runtime (~10 МБ) once, then is cached for the
//  session. Shared singleton across all runnable code blocks.
// =====================================================================

// Reactive status for the UI ('idle' | 'loading' | 'ready' | 'error').
export const py = $state<{ status: 'idle' | 'loading' | 'ready' | 'error' }>({ status: 'idle' });

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodidePromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPyodide(): Promise<any> {
	if (!pyodidePromise) {
		py.status = 'loading';
		pyodidePromise = (async () => {
			const mod = await import(/* @vite-ignore */ PYODIDE_URL + 'pyodide.mjs');
			const pyodide = await mod.loadPyodide({ indexURL: PYODIDE_URL });
			py.status = 'ready';
			return pyodide;
		})().catch((e) => {
			py.status = 'error';
			pyodidePromise = null; // allow retry
			throw e;
		});
	}
	return pyodidePromise;
}

export interface RunResult {
	text: string;
	error: boolean;
}

export async function runPython(code: string): Promise<RunResult> {
	try {
		const pyodide = await getPyodide();
		let out = '';
		const sink = { batched: (s: string) => (out += s + '\n') };
		pyodide.setStdout(sink);
		pyodide.setStderr(sink);
		// auto-install any imported packages available in Pyodide (numpy, scipy, ...)
		await pyodide.loadPackagesFromImports(code);
		const result = await pyodide.runPythonAsync(code);
		if (out === '' && result !== undefined && result !== null) {
			out = String(result);
		}
		return { text: out.trimEnd() || '(нет вывода)', error: false };
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return { text: msg, error: true };
	}
}
