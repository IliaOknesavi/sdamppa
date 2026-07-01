import type { Day } from '$lib/types';

export const day05: Day = {
	n: 5,
	phaseId: "core",
	kind: 'theory',
	unitLabel: 'Статья',
	title: "Агентный цикл (Agentic Loop)",
	est: '10–20 мин',
	goal: "> **Ключевая идея:** Любой агент — это цикл: подумать, действовать, наблюдать, повторить. Сам по себе цикл тривиален. Промышленным его делает то, как вы обрабатываете крайние случаи: когда останавливаться, что делать при сбое инструментов и как не допустить бесконечного зацикливания.",
	sections: [
		{
			heading: "Паттерн",
			body: "Агентный цикл (его также называют паттерном ReAct — Reason + Act, «рассуждай и действуй») — это базовый цикл исполнения любого ИИ-агента. Модель порождает ответ, при необходимости вызывает один или несколько инструментов, наблюдает результаты и повторяет цикл, пока задача не будет выполнена.\n\n```\n┌─────────────┐\n│   Reason    │◄──────────────────┐\n│  (LLM call) │                   │\n└──────┬──────┘                   │\n       │                          │\n       ▼                          │\n  ┌─────────┐    No tools    ┌────┴─────┐\n  │  Tools? ├───────────────►│  Output  │\n  └────┬────┘                └──────────┘\n       │ Yes\n       ▼\n  ┌─────────┐\n  │ Execute │\n  │  tools  │\n  └────┬────┘\n       │\n       ▼\n  ┌─────────┐\n  │ Observe │\n  │ results ├─────────────────────┘\n  └─────────┘\n```\n\nЭто не то же самое, что простой API вызова инструментов. Одиночный вызов инструмента — это однократное действие: модель говорит «вызови эту функцию», вы возвращаете результат. **Агентный цикл** же прогоняет этот процесс многократно: модель видит результат, решает, что ей нужно больше информации, вызывает следующий инструмент, видит *его* результат и продолжает, пока не наберёт достаточно контекста, чтобы выдать окончательный ответ."
		},
		{
			heading: "Реализация",
			body: "Минимальный агентный цикл на Python:\n\n```python\ndef agentic_loop(messages: list, tools: list, max_turns: int = 25) -> str:\n    \"\"\"Run the agentic loop until the model produces a final text response.\"\"\"\n    for turn in range(max_turns):\n        response = llm.chat(messages=messages, tools=tools)\n        assistant_msg = response.choices[0].message\n        messages.append(assistant_msg)\n\n        # Exit condition: no tool calls means the model is done\n        if not assistant_msg.tool_calls:\n            return assistant_msg.content\n\n        # Execute each tool call and append results\n        for tool_call in assistant_msg.tool_calls:\n            result = dispatch_tool(tool_call)\n            messages.append({\n                \"role\": \"tool\",\n                \"tool_call_id\": tool_call.id,\n                \"content\": str(result)\n            })\n\n    raise AgentLoopError(f\"Agent did not complete within {max_turns} turns\")\n```\n\nПараметр `max_turns` критически важен. Без него запутавшаяся модель будет крутиться бесконечно: вызывать один и тот же инструмент снова и снова, получать одну и ту же ошибку и жечь токены. Это простейший ограничитель (guardrail), и он должен присутствовать всегда."
		},
		{
			heading: "Параллельные вызовы инструментов",
			body: "Современные API поддерживают **параллельные вызовы инструментов** (parallel tool calls) — модель может запросить сразу несколько инструментов в одном ответе. Это не просто оптимизация; это меняет поведение агента. Модель, которой нужно прочитать три файла, запросит все три одновременно, а не последовательно:\n\n```python\n# A single assistant message might contain:\n# tool_calls = [read_file(\"a.py\"), read_file(\"b.py\"), read_file(\"c.py\")]\n\nfor tool_call in assistant_msg.tool_calls:\n    result = dispatch_tool(tool_call)\n    messages.append({\n        \"role\": \"tool\",\n        \"tool_call_id\": tool_call.id,\n        \"content\": str(result)\n    })\n# All three results are appended, then the model sees them all at once\n```"
		},
		{
			heading: "Бюджет ходов и условия выхода",
			body: "Циклу нужны чёткие условия выхода помимо `max_turns`:\n\n| Условие | Действие |\n|-----------|--------|\n| В ответе нет вызовов инструментов | Вернуть текст — агент завершил работу |\n| Достигнут лимит ходов | Бросить ошибку или принудительно запросить итоговое резюме |\n| Превышен бюджет токенов | Запустить сжатие контекста, затем продолжить |\n| Подряд идущие одинаковые вызовы инструментов | Вероятно, агент застрял — эскалировать или прервать |\n| Сигнал прерывания от человека | Поставить цикл на паузу, показать текущее состояние |\n\n```python\ndef detect_loop(messages: list, window: int = 3) -> bool:\n    \"\"\"Detect if the agent is stuck calling the same tool repeatedly.\"\"\"\n    recent_calls = []\n    for msg in messages[-window * 2:]:\n        if hasattr(msg, 'tool_calls') and msg.tool_calls:\n            recent_calls.extend(\n                (tc.function.name, tc.function.arguments) for tc in msg.tool_calls\n            )\n    if len(recent_calls) >= window:\n        return len(set(recent_calls[-window:])) == 1\n    return False\n```"
		},
		{
			heading: "Стриминг внутри цикла",
			body: "Промышленные харнессы (harness) стримят вывод модели токен за токеном прямо во время работы цикла. Это важно для пользовательского опыта: человек видит, как агент «думает» в реальном времени, а не смотрит на пустой экран:\n\n```python\nfor turn in range(max_turns):\n    stream = llm.chat(messages=messages, tools=tools, stream=True)\n\n    tool_calls = []\n    text_chunks = []\n\n    for chunk in stream:\n        delta = chunk.choices[0].delta\n        if delta.content:\n            text_chunks.append(delta.content)\n            emit_to_user(delta.content)  # Real-time streaming\n        if delta.tool_calls:\n            accumulate_tool_calls(tool_calls, delta.tool_calls)\n\n    if not tool_calls:\n        return \"\".join(text_chunks)\n\n    # Execute tools and continue loop\n    ...\n```"
		},
		{
			heading: "Типичные ошибки",
			body: "- **Отсутствие лимита ходов** — самый частый баг харнесса. Всегда задавайте максимум.\n- **Проглатывание ошибок инструментов** — если инструмент падает молча, модель будет повторять попытку или галлюцинировать успех. Всегда возвращайте сообщения об ошибках как результаты инструментов, чтобы модель могла подстроиться.\n- **Добавление сырых результатов** — большие выводы инструментов (целые файлы, ответы API) раздувают окно контекста. Обрезайте или резюмируйте их перед добавлением.\n- **Игнорирование параллельных вызовов** — если ваш цикл обрабатывает вызовы инструментов последовательно, а модель выдала их параллельно, вы можете создать зависимости по порядку, которых на самом деле нет."
		},
		{
			heading: "Что почитать дальше",
			body: "- [Yao et al., \"ReAct: Synergizing Reasoning and Acting\"](https://arxiv.org/abs/2210.03629) — оригинальная статья, формализующая паттерн Reason + Act\n- [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — практические паттерны для промышленных циклов"
		}
	],
	tasks: [],
	mastery: []
};
