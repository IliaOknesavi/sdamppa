import type { Day } from '$lib/types';

export const day07: Day = {
	n: 7,
	phaseId: "core",
	kind: 'theory',
	unitLabel: 'Статья',
	title: "Память и контекст",
	est: '10–20 мин',
	goal: "> **Ключевая мысль:** модель знает только то, что находится в её окне контекста. Память — это способ перекинуть мост между тем, что модели *нужно знать*, и тем, что она *может увидеть* в рамках одного вызова API. Сделать это правильно — самая высокорычажная задача в инженерии харнессов (harness).",
	sections: [
		{
			heading: "Три самостоятельных понятия",
			body: "Эти термины часто смешивают, но они решают разные задачи:\n\n| Понятие | Область действия | Сохранность | Пример |\n|---------|------------------|-------------|--------|\n| **Контекст** | Один вызов API | Никакой — пересобирается каждый ход | Системный промпт + инструменты + недавние сообщения + релевантные файлы |\n| **Сессия** | Один разговор или одна задача | В памяти процесса, теряется при перезапуске | История сообщений, результаты вызовов инструментов, рабочее состояние |\n| **Память** | Между сессиями, бессрочно | Записывается на диск | MEMORY.md, дневные логи, выученные предпочтения |\n\n**Контекст** — это «оперативная память» модели: всё, что собрано в один промпт. **Сессия** — это состояние идущего взаимодействия. **Память** — это то, что переживает завершение сессии."
		},
		{
			heading: "Сборка контекста",
			body: "Каждый ход агентного цикла начинается со сборки контекста. Это задача упаковки с приоритетами: у вас есть фиксированный бюджет токенов и нужно решить, что в него войдёт:\n\n```\nContext Window (e.g., 128K tokens)\n┌─────────────────────────────────┐\n│  System Prompt        (~500)    │  ← Always included, highest priority\n│  Tool Schemas         (~2000)   │  ← Active tools only\n│  Memory Summary       (~1000)   │  ← Compressed long-term memory\n│  Relevant Files       (~5000)   │  ← Task-specific context\n│  Conversation History (~varies) │  ← Grows over time, needs pruning\n│  [Remaining Budget]             │  ← Available for new content\n└─────────────────────────────────┘\n```\n\nКогда места становится мало, что именно включать, решает система приоритетов:\n\n```python\nclass ContextAssembler:\n    def __init__(self, max_tokens: int = 128_000):\n        self.max_tokens = max_tokens\n        self.sections = []  # (priority, name, content)\n\n    def add(self, priority: int, name: str, content: str):\n        self.sections.append((priority, name, content))\n\n    def build(self) -> list[dict]:\n        # Sort by priority (lower = higher priority)\n        self.sections.sort(key=lambda x: x[0])\n        messages = []\n        used_tokens = 0\n        for priority, name, content in self.sections:\n            token_count = estimate_tokens(content)\n            if used_tokens + token_count > self.max_tokens:\n                break  # Budget exceeded — skip lower-priority content\n            messages.append({\"role\": \"system\", \"content\": f\"[{name}]\\n{content}\"})\n            used_tokens += token_count\n        return messages\n```"
		},
		{
			heading: "Управление сессией",
			body: "Сессия — это граница одного запуска агента. Она хранит:\n\n- **Историю сообщений** — полный разговор, включая вызовы инструментов и их результаты\n- **Рабочее состояние** — какие файлы открыты, какие навыки (skill) загружены, текущий прогресс по задаче\n- **Черновое пространство (scratch space)** — временные данные, которые агент сгенерировал, но ещё не зафиксировал\n\nГлавное проектное решение в работе с сессией — **когда её очищать**. Несколько вариантов:\n\n| Стратегия | Поведение | Сценарий применения |\n|-----------|-----------|---------------------|\n| **На задачу** | Новая сессия на каждый запрос пользователя | Ассистент без состояния |\n| **На разговор** | Сессия живёт через все ходы одного чата | Интерактивное программирование |\n| **Постоянная** | Сессия переживает перезапуск процесса | Долгоживущий фоновый агент |\n\nПостоянные сессии требуют сериализации — записи состояния сессии на диск, чтобы его можно было восстановить. Именно здесь сессия и память пересекаются: всё, что стоит сохранять между перезапусками, нужно записывать в файл памяти, а не держать в состоянии сессии."
		},
		{
			heading: "Архитектура памяти",
			body: "Проверенная архитектура памяти состоит из двух уровней:\n\n### Уровень 1: дневные логи\n\nСырые, хронологические записи того, что произошло. Пишутся прямо во время сессии, без отбора и редактуры:\n\n```markdown\n<!-- memory/2026-04-15.md -->\n# 2026-04-15\n\n## 14:30 — Refactored auth module\n- Moved JWT validation from middleware to dedicated service\n- Tests passing (23/23)\n- User prefers explicit error messages over error codes\n\n## 16:00 — Deploy to staging\n- Used blue-green deployment\n- Rollback plan: revert commit abc123\n```\n\n### Уровень 2: долговременная память\n\nОтобранное, дистиллированное знание. Обновляется периодически (не каждую сессию):\n\n```markdown\n<!-- MEMORY.md -->\n# Long-term Memory\n\n## User Preferences\n- Prefers explicit error messages over error codes\n- Uses pytest, not unittest\n- Deploy strategy: blue-green with rollback plan\n\n## Project Knowledge\n- Auth module: JWT validation in /src/services/auth.py\n- Database: PostgreSQL 15, migrations in /db/migrations/\n- CI: GitHub Actions, ~3min build time\n\n## Lessons Learned\n- Always run tests before committing (broke build on 4/10)\n- User dislikes verbose output — keep summaries under 5 lines\n```\n\nКлючевая мысль: дневные логи дёшевы в записи (достаточно дописать в конец). Долговременная память требует суждения (что вообще стоит сохранять?). Промышленные харнессы пишут дневные логи автоматически, а MEMORY.md курируют периодически — либо по расписанию, либо когда агент обнаруживает значимые выводы."
		},
		{
			heading: "Цикл чтения/записи памяти",
			body: "```python\ndef session_startup(memory_dir: str) -> str:\n    \"\"\"Read memory at session start.\"\"\"\n    sections = []\n    # Always read long-term memory\n    memory_path = os.path.join(memory_dir, \"MEMORY.md\")\n    if os.path.exists(memory_path):\n        sections.append(open(memory_path).read())\n    # Read recent daily logs (today + yesterday)\n    for days_ago in [0, 1]:\n        date = (datetime.now() - timedelta(days=days_ago)).strftime(\"%Y-%m-%d\")\n        daily_path = os.path.join(memory_dir, f\"memory/{date}.md\")\n        if os.path.exists(daily_path):\n            sections.append(open(daily_path).read())\n    return \"\\n---\\n\".join(sections)\n```"
		},
		{
			heading: "Паттерн AGENTS.md",
			body: "Близкий, но отдельный файл — AGENTS.md: текстовый файл, который определяет, как агент должен *вести себя* (а не то, что он *помнит*). Положите его в любой каталог, и совместимый харнесс прочитает его автоматически:\n\n```markdown\n<!-- AGENTS.md -->\n# Behavior\n\n- You are a Python backend engineer\n- Use pytest for all tests\n- Follow Google style docstrings\n- Never modify files in /config/ without asking\n\n# Tools\n\n- Prefer `ruff` over `pylint` for linting\n- Use `uv` for package management\n```\n\nAGENTS.md **декларативен** (что делать), а MEMORY.md **опытен/эмпиричен** (что произошло). Оба внедряются в контекст при старте сессии, но служат разным целям."
		},
		{
			heading: "Типичные ошибки",
			body: "- **Считать контекст безграничным** — даже 128K токенов заполняются быстро схемами инструментов, содержимым файлов и историей разговора. Планируйте бюджет токенов явно.\n- **Никогда не подрезать историю сессии** — разговор на 50 ходов накапливает избыточный материал. Сжимайте или резюмируйте более старые ходы, чтобы вернуть себе место.\n- **Писать в память слишком рьяно** — не каждый ход порождает знание, которое стоит сохранять. Избыточная запись создаёт шум, разбавляющий полезную информацию.\n- **Забыть прочитать память на старте** — агент без чтения памяти фактически страдает амнезией. Это самая частая ошибка конфигурации."
		},
		{
			heading: "Дополнительное чтение",
			body: "- [Letta: MemGPT and the Future of Agent Memory](https://www.letta.com/blog/memgpt) — управление памятью агентов по образу операционной системы\n- [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — паттерны памяти в продакшене"
		}
	],
	tasks: [],
	mastery: []
};
