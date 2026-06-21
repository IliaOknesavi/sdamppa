<script lang="ts">
	import { onMount } from 'svelte';
	import { settings } from './settings.svelte';
	import { ctx } from './context.svelte';
	import { chatStream, listModels, systemPrompt, type ChatMsg } from './client';
	import RichText from '$lib/engine/RichText.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let open = $state(false);
	let showSettings = $state(false);
	let messages = $state<ChatMsg[]>([]);
	let input = $state('');
	let streaming = $state(false);
	let error = $state('');
	let models = $state<string[]>([]);
	let testing = $state(false);
	let testMsg = $state('');
	let abort: AbortController | null = null;
	let threadEl: HTMLDivElement | undefined = $state();
	let fabEl: HTMLButtonElement | undefined = $state();
	let copEl: HTMLDivElement | undefined = $state();

	onMount(() => {
		settings.load();
		if (!settings.configured) showSettings = true;
	});

	function scrollDown() {
		queueMicrotask(() => threadEl?.scrollTo({ top: threadEl.scrollHeight, behavior: 'smooth' }));
	}

	async function test() {
		testing = true;
		testMsg = '';
		try {
			models = await listModels();
			testMsg = `связь есть · моделей: ${models.length}`;
			if (!settings.s.model && models.length) settings.s.model = models[0];
		} catch (e) {
			testMsg = 'не вышло: ' + (e instanceof Error ? e.message : String(e));
		}
		testing = false;
	}
	function saveSettings() {
		settings.save();
		if (settings.configured) showSettings = false;
	}

	async function send(text: string) {
		const content = text.trim();
		if (!content || streaming) return;
		if (!settings.configured) {
			showSettings = true;
			return;
		}
		error = '';
		input = '';
		messages.push({ role: 'user', content });
		messages.push({ role: 'assistant', content: '' });
		scrollDown();
		const idx = messages.length - 1;
		const sys: ChatMsg = { role: 'system', content: systemPrompt(ctx.label, ctx.title, ctx.text) };
		// send system + the conversation (exclude the empty assistant placeholder)
		const payload = [sys, ...messages.slice(0, idx)];
		streaming = true;
		abort = new AbortController();
		try {
			await chatStream(
				payload,
				(t) => {
					messages[idx].content += t;
					scrollDown();
				},
				abort.signal
			);
		} catch (e) {
			if (!(e instanceof DOMException && e.name === 'AbortError'))
				error = e instanceof Error ? e.message : String(e);
			if (!messages[idx].content) messages.splice(idx, 1);
		}
		streaming = false;
		abort = null;
	}
	function stop() {
		abort?.abort();
	}
	function clearChat() {
		messages = [];
		error = '';
	}
	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send(input);
		}
	}

	function toggle() {
		open = !open;
		if (open) {
			// фокус сразу в поле ввода (или первый интерактивный элемент панели)
			queueMicrotask(() =>
				(copEl?.querySelector<HTMLElement>('textarea') ??
					copEl?.querySelector<HTMLElement>('button, input, select') ??
					copEl)?.focus()
			);
		} else {
			fabEl?.focus();
		}
	}
	function close() {
		if (!open) return;
		open = false;
		fabEl?.focus(); // возвращаем фокус на кнопку-триггер
	}
	// диалог: Esc закрывает, Tab зациклен внутри панели (focus-trap)
	function onDialogKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.stopPropagation();
			close();
			return;
		}
		if (e.key !== 'Tab' || !copEl) return;
		const f = [
			...copEl.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
			)
		].filter((el) => el.offsetParent !== null);
		if (!f.length) return;
		const first = f[0];
		const last = f[f.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}
</script>

<button
	class="fab"
	class:on={open}
	bind:this={fabEl}
	onclick={toggle}
	aria-label="ИИ-ассистент"
	aria-expanded={open}
>
	{#if open}<Icon name="close" size={22} />{:else}<Icon name="spark" size={22} />{/if}
</button>

{#if open}
	<div
		class="cop"
		bind:this={copEl}
		role="dialog"
		aria-modal="true"
		aria-label="ИИ-ассистент"
		tabindex="-1"
		onkeydown={onDialogKey}
	>
		<header class="cop__head">
			<div>
				<div class="cop__title">Ассистент</div>
				<div class="cop__ctx">{ctx.has ? ctx.label || ctx.title : 'контекст страницы не задан'}</div>
			</div>
			<div class="cop__head-btns">
				<button class="ic" title="Очистить" aria-label="Очистить переписку" onclick={clearChat}><Icon name="trash" size={16} /></button>
				<button class="ic" class:active={showSettings} title="Настройки" aria-label="Настройки" onclick={() => (showSettings = !showSettings)}><Icon name="settings" size={16} /></button>
			</div>
		</header>

		{#if showSettings}
			<div class="cop__settings">
				<div class="seg">
					<button class:on={settings.s.apiType === 'ollama'} onclick={() => (settings.s.apiType = 'ollama')}>Ollama</button>
					<button class:on={settings.s.apiType === 'openai'} onclick={() => (settings.s.apiType = 'openai')}>OpenAI-совмест.</button>
				</div>
				<label>
					<span>URL эндпоинта</span>
					<input bind:value={settings.s.baseUrl} placeholder="http://localhost:11434" />
				</label>
				<label>
					<span>API-ключ <em>(если нужен)</em></span>
					<input bind:value={settings.s.apiKey} type="password" placeholder="для облака/прокси" />
				</label>
				<label>
					<span>Модель</span>
					{#if models.length}
						<select bind:value={settings.s.model}>{#each models as m}<option value={m}>{m}</option>{/each}</select>
					{:else}
						<input bind:value={settings.s.model} placeholder="напр. llama3.1 / gpt-oss:120b-cloud" />
					{/if}
				</label>
				<div class="cop__settings-row">
					<button class="btn ghost" onclick={test} disabled={testing}>{testing ? '…' : 'Проверить связь'}</button>
					<button class="btn solid" onclick={saveSettings}>Сохранить</button>
				</div>
				{#if testMsg}<div class="cop__test">{testMsg}</div>{/if}
				<div class="cop__note">
					Браузер шлёт запрос только на этот URL — нужен CORS. <strong>Облачные модели Ollama:</strong>
					поставь Ollama локально, <code>ollama signin</code>, URL <code>http://localhost:11434</code>,
					модель вида <code>gpt-oss:120b-cloud</code>, и <code>OLLAMA_ORIGINS=*</code>. Прямой
					<code>ollama.com</code> из браузера не работает (нет CORS).
				</div>
			</div>
		{/if}

		<div class="cop__thread" bind:this={threadEl} role="log" aria-live="polite" aria-relevant="additions text">
			{#if !messages.length}
				<div class="cop__empty">
					<p>Спроси что угодно по этой теме — я вижу её материал.</p>
					<div class="cop__quick">
						<button onclick={() => send('Объясни тему этой страницы простыми словами, с интуицией.')}>Объясни проще</button>
						<button onclick={() => send('Задай мне 3 коротких вопроса по этой теме по одному и оцени мои ответы. Начни с первого вопроса.')}>Проверь понимание</button>
						<button onclick={() => send('Приведи наглядный пример или мини-задачу по этой теме с разбором.')}>Пример</button>
						<button onclick={() => send('Дай сжатую выжимку (TL;DR) ключевого по этой теме с асимптотиками, если есть.')}>TL;DR</button>
					</div>
				</div>
			{/if}
			{#each messages as m}
				<div class="msg {m.role}">
					<div class="msg__who">{m.role === 'user' ? 'ты' : 'ассистент'}</div>
					{#if m.role === 'assistant'}
						<div class="msg__body rich">
							{#if m.content}<RichText source={m.content} />{:else if streaming}…{/if}
						</div>
					{:else}
						<div class="msg__body">{m.content}</div>
					{/if}
				</div>
			{/each}
			{#if error}<div class="cop__err">⚠ {error}</div>{/if}
		</div>

		<div class="cop__input">
			<textarea
				bind:value={input}
				onkeydown={onKey}
				rows="1"
				aria-label="Сообщение ассистенту"
				placeholder={settings.configured
					? 'Сообщение…  (Enter — отправить)'
					: 'Подключи Ollama в настройках'}
			></textarea>
			{#if streaming}
				<button class="send stop" onclick={stop} title="Стоп" aria-label="Остановить"
					><Icon name="stop" size={14} /></button
				>
			{:else}
				<button
					class="send"
					onclick={() => send(input)}
					disabled={!input.trim()}
					aria-label="Отправить"><Icon name="send" size={16} /></button
				>
			{/if}
		</div>
	</div>
{/if}

<style>
	.fab {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 95;
		width: 3.1rem;
		height: 3.1rem;
		border-radius: 50%;
		border: none;
		background: var(--accent, #7451f4);
		color: #fff;
		font-size: 1.3rem;
		cursor: pointer;
		box-shadow: 0 10px 28px -8px color-mix(in srgb, var(--accent, #7451f4) 70%, transparent);
		transition: transform 0.16s;
	}
	.fab:hover {
		transform: translateY(-2px) scale(1.04);
	}
	.fab.on {
		background: var(--color-ink-700);
	}

	.cop {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		z-index: 95;
		width: min(400px, calc(100vw - 2rem));
		height: min(560px, calc(100vh - 7rem));
		display: flex;
		flex-direction: column;
		background: var(--color-ink-850);
		border: 1.5px solid var(--color-ink-600);
		border-radius: 16px;
		box-shadow: 0 24px 60px -18px rgba(0, 0, 0, 0.45);
		overflow: hidden;
		animation: pop 0.18s ease;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(10px) scale(0.98);
		}
	}
	.cop__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.7rem 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: color-mix(in srgb, var(--accent, #7451f4) 7%, var(--color-ink-800));
	}
	.cop__title {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-parch-100);
	}
	.cop__ctx {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--color-parch-muted);
		max-width: 22ch;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.cop__head-btns {
		display: flex;
		gap: 0.3rem;
	}
	.ic {
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 7px;
		border: 1px solid var(--color-ink-500);
		background: var(--color-ink-850);
		color: var(--color-parch-200);
		cursor: pointer;
	}
	.ic:hover,
	.ic.active {
		border-color: var(--accent, #7451f4);
		color: var(--accent, #7451f4);
	}

	.cop__settings {
		padding: 0.9rem;
		border-bottom: 1.5px solid var(--color-ink-600);
		background: var(--color-ink-800);
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.seg {
		display: flex;
		border: 1.5px solid var(--accent, #7451f4);
		border-radius: 8px;
		overflow: hidden;
	}
	.seg button {
		flex: 1;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.75rem;
		padding: 0.4rem;
		border: none;
		background: transparent;
		color: var(--accent, #7451f4);
		cursor: pointer;
	}
	.seg button.on {
		background: var(--accent, #7451f4);
		color: #fff;
	}
	.cop__settings label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.72rem;
		color: var(--color-parch-300);
	}
	.cop__settings label em {
		color: var(--color-parch-muted);
		font-style: normal;
	}
	.cop__settings input,
	.cop__settings select {
		padding: 0.45rem 0.6rem;
		border-radius: 8px;
		border: 1px solid var(--color-ink-500);
		background: var(--color-ink-850);
		color: var(--color-parch-100);
		font-size: 0.82rem;
	}
	.cop__settings-row {
		display: flex;
		gap: 0.5rem;
	}
	.btn {
		flex: 1;
		padding: 0.5rem;
		border-radius: 8px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		cursor: pointer;
		border: 1.5px solid var(--accent, #7451f4);
	}
	.btn.ghost {
		background: transparent;
		color: var(--accent, #7451f4);
	}
	.btn.solid {
		background: var(--accent, #7451f4);
		color: #fff;
	}
	.cop__test {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-parch-200);
	}
	.cop__note {
		font-size: 0.66rem;
		color: var(--color-parch-muted);
		line-height: 1.4;
	}
	.cop__note code {
		font-family: var(--font-mono);
		color: var(--accent, #7451f4);
	}

	.cop__thread {
		flex: 1;
		overflow-y: auto;
		padding: 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.cop__empty {
		color: var(--color-parch-muted);
		font-size: 0.85rem;
	}
	.cop__quick {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.7rem;
	}
	.cop__quick button {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		border: 1px solid var(--color-ink-500);
		background: var(--color-ink-800);
		color: var(--color-parch-200);
		cursor: pointer;
	}
	.cop__quick button:hover {
		border-color: var(--accent, #7451f4);
		color: var(--accent, #7451f4);
	}
	.msg {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.msg__who {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-parch-muted);
	}
	.msg__body {
		font-size: 0.88rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
		color: var(--color-parch-100);
	}
	.msg.user .msg__body {
		background: color-mix(in srgb, var(--accent, #7451f4) 12%, var(--color-ink-800));
		padding: 0.5rem 0.7rem;
		border-radius: 10px;
		align-self: flex-end;
		max-width: 85%;
	}
	.cop__err {
		font-size: 0.78rem;
		color: var(--color-rose);
		background: color-mix(in srgb, var(--color-rose) 10%, transparent);
		padding: 0.5rem 0.6rem;
		border-radius: 8px;
	}
	.cop__input {
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
		padding: 0.7rem;
		border-top: 1.5px solid var(--color-ink-600);
	}
	.cop__input textarea {
		flex: 1;
		resize: none;
		max-height: 7rem;
		padding: 0.55rem 0.7rem;
		border-radius: 10px;
		border: 1px solid var(--color-ink-500);
		background: var(--color-ink-800);
		color: var(--color-parch-100);
		font-family: var(--font-body);
		font-size: 0.85rem;
		line-height: 1.4;
	}
	.send {
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 10px;
		border: none;
		background: var(--accent, #7451f4);
		color: #fff;
		font-size: 1.1rem;
		cursor: pointer;
		flex: none;
	}
	.send:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.send.stop {
		background: var(--color-rose);
	}
</style>
