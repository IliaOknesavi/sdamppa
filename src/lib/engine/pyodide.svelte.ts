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
	/** base64-кодированные PNG фигур matplotlib (если код их рисовал). */
	images?: string[];
}

// Код, который рисует графики? Тогда переключаем matplotlib на безоконный
// backend AGG и снимаем фигуры в PNG после прогона (как вывод ячейки Jupyter).
const PLOTS_RE = /matplotlib|pyplot|\bplt\b/;

// Прелюдия: до пользовательского кода ставим AGG и чистим прошлые фигуры,
// чтобы plt.show() не падал без DOM-цели и каждый запуск стартовал с нуля.
const MPL_PRELUDE = `
import matplotlib
matplotlib.use('AGG', force=True)
import matplotlib.pyplot as _plt
_plt.switch_backend('AGG')
_plt.close('all')
`;

// После прогона: каждую открытую фигуру → PNG → base64, вернуть список.
const MPL_CAPTURE = `
import io as _io, base64 as _b64
import matplotlib.pyplot as _plt
_imgs = []
for _n in _plt.get_fignums():
    _buf = _io.BytesIO()
    _fig = _plt.figure(_n)
    _fig.savefig(_buf, format='png', dpi=120, bbox_inches='tight', facecolor='white')
    _imgs.append(_b64.b64encode(_buf.getvalue()).decode())
_plt.close('all')
_imgs
`;

export async function runPython(code: string): Promise<RunResult> {
	try {
		const pyodide = await getPyodide();
		let out = '';
		const sink = { batched: (s: string) => (out += s + '\n') };
		pyodide.setStdout(sink);
		pyodide.setStderr(sink);
		// auto-install any imported packages available in Pyodide (numpy, scipy, ...)
		await pyodide.loadPackagesFromImports(code);

		const wantsPlot = PLOTS_RE.test(code);
		if (wantsPlot) {
			// matplotlib может не подхватиться из import'ов (динамический import) —
			// дотягиваем явно, затем настраиваем backend на чистую сцену.
			await pyodide.loadPackage('matplotlib').catch(() => {});
			await pyodide.runPythonAsync(MPL_PRELUDE);
		}

		const result = await pyodide.runPythonAsync(code);

		let images: string[] | undefined;
		if (wantsPlot) {
			const proxy = await pyodide.runPythonAsync(MPL_CAPTURE);
			if (proxy) {
				images = proxy.toJs ? (proxy.toJs() as string[]) : Array.from(proxy as Iterable<string>);
				proxy.destroy?.();
			}
			if (images && !images.length) images = undefined;
		}

		if (out === '' && result !== undefined && result !== null) {
			out = String(result);
		}
		const text = out.trimEnd() || (images ? '' : '(нет вывода)');
		return { text, error: false, images };
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return { text: msg, error: true };
	}
}
