// =====================================================================
//  In-browser C toolchain — real clang (wasm32-wasi) via @wasmer/sdk.
//  Compiles the lab's translation units, links them, and runs the result
//  with WASIX, feeding stdin upfront (no interactive blocking needed for
//  auto-checks). First use downloads the clang package (~tens of МБ) once,
//  then it is cached for the session. Mirrors the Pyodide engine.
//
//  Requires cross-origin isolation (COOP/COEP) → set in vite.config.ts for
//  dev and by the static web server (Caddy/Nginx) in production, because the
//  Wasmer SDK relies on SharedArrayBuffer for its worker threadpool.
// =====================================================================

// The SDK's own wasm, resolved to a served URL (SSR-safe: just a string).
import wasmUrl from '@wasmer/sdk/wasm?url';

// Reactive status for the UI ('idle' | 'loading' | 'ready' | 'error').
export const cc = $state<{ status: 'idle' | 'loading' | 'ready' | 'error'; detail: string }>({
	status: 'idle',
	detail: ''
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bootPromise: Promise<{ Directory: any; clang: any; runWasix: any }> | null = null;

const REGISTRY_URL = 'https://registry.wasmer.io/graphql';
// Optional: drop the clang package at static/clang.webc to serve it from our
// own server — then no Wasmer registry / CDN round-trip is needed at all.
// One-time fetch of the package:
//   curl -L -o static/clang.webc \
//     "$(curl -s https://registry.wasmer.io/graphql -H 'content-type: application/json' \
//        --data '{"query":"{getPackageVersion(name:\"clang/clang\"){distribution{downloadUrl}}}"}' \
//        | sed -E 's/.*"downloadUrl":"([^"]+)".*/\1/')"
const LOCAL_WEBC = '/clang.webc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadClang(sdk: any) {
	// 1) Prefer a clang package vendored on our own static server — registry-free
	//    and fast. The SPA fallback serves index.html (text/html) for a missing
	//    file, so we only accept a non-HTML body.
	try {
		const res = await fetch(LOCAL_WEBC);
		const ct = res.headers.get('content-type') ?? '';
		if (res.ok && !ct.includes('text/html')) {
			cc.detail = 'загрузка локального clang';
			const bytes = new Uint8Array(await res.arrayBuffer());
			return await sdk.Wasmer.fromFile(bytes);
		}
	} catch {
		// ignore — fall through to the registry
	}
	// 2) Fall back to the Wasmer registry, retrying on flaky networks (a failed
	//    registry request otherwise surfaces as "Unable to find clang/clang").
	let lastErr: unknown;
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			cc.detail =
				attempt === 1 ? 'скачивание clang (один раз, ~100 МБ)' : `повтор загрузки ${attempt}/3`;
			return await sdk.Wasmer.fromRegistry('clang/clang');
		} catch (e) {
			lastErr = e;
		}
	}
	throw lastErr;
}

function boot() {
	if (!bootPromise) {
		cc.status = 'loading';
		bootPromise = (async () => {
			// Dynamic import keeps the SDK out of SSR and the initial bundle —
			// it loads only when the user first compiles.
			const sdk = await import('@wasmer/sdk');
			cc.detail = 'инициализация рантайма';
			await sdk.init({ module: wasmUrl, registryUrl: REGISTRY_URL });
			const clang = await loadClang(sdk);
			cc.status = 'ready';
			cc.detail = '';
			return { Directory: sdk.Directory, clang, runWasix: sdk.runWasix };
		})().catch((e) => {
			cc.status = 'error';
			cc.detail = e instanceof Error ? e.message : String(e);
			bootPromise = null; // allow retry
			throw e;
		});
	}
	return bootPromise;
}

export interface CFile {
	path: string;
	content: string;
}

export interface CResult {
	ok: boolean;
	stage: 'compile' | 'run';
	text: string; // compiler diagnostics on failure, program output on success
}

/**
 * Compile every `.c` file together, link, and run the produced wasm.
 * `stdin` is fed to the program upfront; the project dir is also mounted at
 * run time so programs may open data files (e.g. a roadmap CSV) by path.
 */
export async function compileAndRunC(
	files: CFile[],
	opts: { stdin?: string; args?: string[] } = {}
): Promise<CResult> {
	try {
		const { Directory, clang, runWasix } = await boot();

		const proj = new Directory();
		for (const f of files) await proj.writeFile(f.path, f.content);

		const sources = files.filter((f) => f.path.endsWith('.c')).map((f) => '/project/' + f.path);
		if (sources.length === 0) {
			return { ok: false, stage: 'compile', text: 'Нет ни одного .c файла для компиляции.' };
		}

		// Absolute mounted paths (matches the official example). clang/clang
		// defaults to wasm32-wasi with its bundled sysroot. The empty `stdin`
		// guarantees clang never blocks reading source from a tty.
		const compile = await clang.entrypoint.run({
			args: [...sources, '-O2', '-I/project', '-o', '/project/a.wasm'],
			mount: { '/project': proj },
			stdin: ''
		});
		const cRes = await compile.wait();
		if (!cRes.ok) {
			return {
				ok: false,
				stage: 'compile',
				text: (cRes.stderr || cRes.stdout || `clang завершился с кодом ${cRes.code}`).trim()
			};
		}

		// Запускаем СОБРАННЫЙ wasm32-wasi бинарник напрямую через runWasix —
		// у «голого» wasm нет манифеста/entrypoint (отсюда была ошибка
		// "entry not found" при попытке Wasmer.fromFile(wasm).entrypoint).
		const wasm = await proj.readFile('a.wasm');
		const run = await runWasix(wasm, {
			stdin: opts.stdin ?? '',
			args: opts.args ?? [],
			mount: { '/project': proj },
			cwd: '/project'
		});
		const rRes = await run.wait();
		const out = (rRes.stdout + (rRes.stderr ? '\n' + rRes.stderr : '')).trim();
		return {
			ok: rRes.ok,
			stage: 'run',
			text: out || (rRes.ok ? '(нет вывода)' : `Программа завершилась с кодом ${rRes.code}`)
		};
	} catch (e) {
		return { ok: false, stage: 'compile', text: e instanceof Error ? e.message : String(e) };
	}
}

