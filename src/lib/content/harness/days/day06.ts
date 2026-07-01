import type { Day } from '$lib/types';

export const day06: Day = {
	n: 6,
	phaseId: "core",
	kind: 'theory',
	unitLabel: 'Статья',
	title: "Система инструментов",
	est: '10–20 мин',
	goal: "> **Ключевая мысль:** инструменты — это руки агента. Модель рассуждает, инструменты действуют. Но именно устройство системы инструментов — как инструменты регистрируются, описываются, диспетчеризуются и управляются — влияет на качество агента сильнее, чем сама модель.",
	sections: [
		{
			heading: "Что такое инструмент?",
			body: "Инструмент — это функция, которую модель может вызвать по имени со структурированными аргументами. Модель видит **схему** (имя, описание, типы параметров), а харнесс (harness) отвечает за **исполнение** (собственно вызов функции и возврат результата).\n\n```python\n# What the model sees (tool schema)\n{\n    \"name\": \"read_file\",\n    \"description\": \"Read the contents of a file at the given path\",\n    \"parameters\": {\n        \"type\": \"object\",\n        \"properties\": {\n            \"path\": {\"type\": \"string\", \"description\": \"File path to read\"}\n        },\n        \"required\": [\"path\"]\n    }\n}\n\n# What the harness executes (tool implementation)\ndef read_file(path: str) -> str:\n    with open(path, 'r') as f:\n        return f.read()\n```\n\nМодель никогда не видит и не исполняет реализацию. Ей известна только схема. Это разделение фундаментально: оно означает, что вы можете менять работу инструмента, не меняя поведение модели, и можете ограничивать то, что инструмент делает, так что модель об этом не узнает."
		},
		{
			heading: "Реестр инструментов",
			body: "Реестр инструментов (tool registry) — это компонент харнесса, который сопоставляет имена инструментов с их схемами и реализациями:\n\n```python\nclass ToolRegistry:\n    def __init__(self):\n        self._tools: dict[str, Tool] = {}\n\n    def register(self, name: str, schema: dict, handler: Callable):\n        self._tools[name] = Tool(name=name, schema=schema, handler=handler)\n\n    def get_schemas(self) -> list[dict]:\n        \"\"\"Return schemas for the LLM API call.\"\"\"\n        return [t.schema for t in self._tools.values()]\n\n    def dispatch(self, name: str, arguments: dict) -> str:\n        \"\"\"Execute a tool call and return the result as a string.\"\"\"\n        tool = self._tools.get(name)\n        if not tool:\n            return f\"Error: Unknown tool '{name}'\"\n        try:\n            result = tool.handler(**arguments)\n            return str(result)\n        except Exception as e:\n            return f\"Error: {type(e).__name__}: {e}\"\n```\n\nОбратите внимание, что `dispatch` всегда возвращает строку — даже при ошибках. Это сделано намеренно: модели нужно видеть сообщения об ошибках, чтобы скорректировать подход, а не молча падать."
		},
		{
			heading: "Статические и динамические инструменты",
			body: "**Статические инструменты** загружаются при старте и доступны всегда. Это работает для небольших наборов инструментов (5–15 штук), но не масштабируется: 100 инструментов означают 100 схем в каждом вызове API — они расходуют токены и сбивают модель с толку.\n\n**Динамические инструменты** (их также называют **загрузкой навыков**, skill loading) решают эту проблему: модели показывают меню доступных категорий инструментов и подгружают конкретные инструменты только по запросу:\n\n```python\n# Instead of loading all 100 tools, show a menu\nSKILL_MENU = \"\"\"\nAvailable skills (use load_skill to activate):\n- file_ops: Read, write, search files\n- git: Git operations (status, diff, commit, push)\n- web: HTTP requests, web search\n- database: SQL queries, schema inspection\n\"\"\"\n\n# The model calls load_skill(\"git\") and then gets git-specific tools\ndef load_skill(skill_name: str) -> str:\n    tools = skill_registry.load(skill_name)\n    active_tools.extend(tools)\n    return f\"Loaded {len(tools)} tools: {[t.name for t in tools]}\"\n```\n\nЭкономия токенов получается значительной. Меню навыков может стоить 200 токенов, тогда как загрузка всех инструментов сразу обойдётся в 5000+."
		},
		{
			heading: "Качество описаний инструментов",
			body: "Способность модели правильно пользоваться инструментами почти полностью зависит от качества их описаний. Расплывчатое описание ведёт к неверному применению, точное — направляет к корректному поведению:\n\n```python\n# Bad — the model will guess at behavior\n{\"name\": \"search\", \"description\": \"Search for things\"}\n\n# Good — unambiguous, includes format and constraints\n{\n    \"name\": \"search_files\",\n    \"description\": \"Search for files matching a glob pattern in the workspace. \"\n                   \"Returns a list of relative file paths, one per line. \"\n                   \"Max 100 results. Use '**/*.py' for recursive Python file search.\",\n    \"parameters\": {\n        \"type\": \"object\",\n        \"properties\": {\n            \"pattern\": {\n                \"type\": \"string\",\n                \"description\": \"Glob pattern (e.g., '*.md', 'src/**/*.ts')\"\n            }\n        },\n        \"required\": [\"pattern\"]\n    }\n}\n```\n\nКлючевые принципы для описаний инструментов:\n- Описывайте, что инструмент **делает**, а не что он **есть**\n- Указывайте **формат вывода** (JSON, простой текст, по одной записи на строку)\n- Включайте **ограничения** (максимум результатов, лимиты на размер файла)\n- Добавляйте **примеры** для неочевидных параметров"
		},
		{
			heading: "Паттерны композиции инструментов",
			body: "Сложные возможности агента чаще возникают из композиции простых инструментов, а не из построения сложных:\n\n| Паттерн | Пример |\n|---------|---------|\n| **Последовательный** | `read_file` → `edit_file` → `run_tests` |\n| **Веерный (fan-out)** | прочитать 5 файлов параллельно, затем синтезировать |\n| **Условный** | `list_files` → решить, какие файлы передать в `read_file` |\n| **Итеративный** | `run_tests` → `edit_file` → `run_tests` (пока не пройдут) |\n\nХарнессу не нужно реализовывать эти паттерны — модель находит их сама в ходе агентного цикла. Ваша задача — предоставить правильные атомарные инструменты и дать модели их компоновать."
		},
		{
			heading: "MCP: Model Context Protocol",
			body: "[MCP](https://modelcontextprotocol.io/) — это открытый стандарт для предоставления инструментов агентам через транспортный уровень (stdio, HTTP SSE). Вместо того чтобы зашивать инструменты в харнесс, MCP позволяет подключаться к внешним серверам инструментов:\n\n```json\n{\n  \"mcpServers\": {\n    \"filesystem\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@modelcontextprotocol/server-filesystem\", \"/workspace\"]\n    },\n    \"github\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@modelcontextprotocol/server-github\"]\n    }\n  }\n}\n```\n\nMCP важен тем, что он развязывает реализацию инструментов и харнесс. Инструмент, написанный для одного харнесса, работает в любом MCP-совместимом харнессе — Claude Desktop, OpenClaw, Cursor и других."
		},
		{
			heading: "Типичные ошибки",
			body: "- **Слишком много инструментов сразу** — более ~20 активных инструментов снижают качество работы модели. Используйте динамическую загрузку.\n- **Молчаливые сбои** — инструменты, возвращающие пустые строки при ошибке, оставляют модель в догадках. Всегда возвращайте явные сообщения об ошибках.\n- **Пропущенные результаты инструментов** — если вы забудете добавить результат инструмента в историю сообщений, вызов API завершится ошибкой. У каждого вызова инструмента должен быть соответствующий результат.\n- **Несогласованные типы возврата** — если `read_file` иногда возвращает содержимое, а иногда словарь с ошибкой, модель не сможет надёжно разобрать вывод. Стандартизируйте формат результата."
		},
		{
			heading: "Дополнительное чтение",
			body: "- [Anthropic: Tool Use Guide](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) — продакшен-паттерны использования инструментов\n- [Model Context Protocol](https://modelcontextprotocol.io/) — открытый стандарт для инструментов агентов"
		}
	],
	tasks: [],
	mastery: []
};
