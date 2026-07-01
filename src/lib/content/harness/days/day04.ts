import type { Day } from '$lib/types';

export const day04: Day = {
	n: 4,
	phaseId: "start",
	kind: 'theory',
	unitLabel: 'Статья',
	title: "Харнесс против фреймворка",
	est: '10–20 мин',
	goal: "> **Ключевая мысль:** Фреймворк тащит за собой сотни зависимостей и слои абстракций ради задачи, которую можно решить в 50 строк на Python. Но и писать оркестрацию из множества агентов с нуля, когда CrewAI уже её решает, — значит впустую потратить недели. Суть в том, чтобы подбирать инструмент под задачу, а не по умолчанию хвататься за самый популярный вариант.",
	sections: [
		{
			body: "Харнесс (harness — обвязка, runtime-обёртка) — это код, который вы пишете с нуля, чтобы обернуть модель инструментами, памятью и контекстом. **Фреймворк** — это библиотека, дающая абстракции для построения агентов: LangChain, CrewAI, AutoGen и другие. Выбор между ними — не вопрос о том, что «лучше», а вопрос о том, когда каждый из них оправдывает себя."
		},
		{
			heading: "Дерево решений",
			body: "```\nNeed an agent? \n│\n├── Is it a single-model loop with < 5 tools?\n│   └── YES → Write a raw harness (50-200 lines)\n│\n├── Do you need multi-agent orchestration out of the box?\n│   └── YES → Consider CrewAI or AutoGen\n│\n├── Do you need complex RAG pipelines with vector stores?\n│   └── YES → Consider LangChain\n│\n├── Is this a production product where you need full control?\n│   └── YES → Write a raw harness (own every line)\n│\n├── Are you prototyping / exploring quickly?\n│   └── YES → Framework is fine, expect to rewrite later\n│\n└── Do you need to understand what's actually happening?\n    └── YES → Write a raw harness first, then decide\n```"
		},
		{
			heading: "Одна и та же задача: три способа",
			body: "**Задача**: прочитать CSV-файл, проанализировать его и записать сводку в Markdown-файл.\n\n### Голый харнесс (~60 строк)\n\n```python\nimport json, csv, io\nfrom openai import OpenAI\n\nclient = OpenAI()\n\nTOOLS = [\n    {\n        \"type\": \"function\",\n        \"function\": {\n            \"name\": \"read_file\",\n            \"description\": \"Read a file's contents\",\n            \"parameters\": {\n                \"type\": \"object\",\n                \"properties\": {\"path\": {\"type\": \"string\"}},\n                \"required\": [\"path\"]\n            }\n        }\n    },\n    {\n        \"type\": \"function\",\n        \"function\": {\n            \"name\": \"write_file\",\n            \"description\": \"Write content to a file\",\n            \"parameters\": {\n                \"type\": \"object\",\n                \"properties\": {\n                    \"path\": {\"type\": \"string\"},\n                    \"content\": {\"type\": \"string\"}\n                },\n                \"required\": [\"path\", \"content\"]\n            }\n        }\n    }\n]\n\ndef execute(name, args):\n    if name == \"read_file\":\n        return open(args[\"path\"]).read()\n    elif name == \"write_file\":\n        open(args[\"path\"], \"w\").write(args[\"content\"])\n        return f\"Written to {args['path']}\"\n\ndef run(task):\n    messages = [\n        {\"role\": \"system\", \"content\": \"You analyze data files and write reports.\"},\n        {\"role\": \"user\", \"content\": task}\n    ]\n    for _ in range(10):\n        resp = client.chat.completions.create(\n            model=\"gpt-4o-mini\", messages=messages, tools=TOOLS\n        )\n        msg = resp.choices[0].message\n        messages.append(msg)\n        if not msg.tool_calls:\n            return msg.content\n        for tc in msg.tool_calls:\n            result = execute(tc.function.name, json.loads(tc.function.arguments))\n            messages.append({\"role\": \"tool\", \"tool_call_id\": tc.id, \"content\": result})\n    return \"Done\"\n\nrun(\"Read data.csv, analyze the trends, and write a summary to report.md\")\n```\n\n**Зависимости**: `openai` (1 пакет)\n**Строк кода**: ~60\n**Под вашим контролем**: всё\n\n### LangChain (~40 строк, но…)\n\n```python\nfrom langchain_openai import ChatOpenAI\nfrom langchain.agents import AgentExecutor, create_openai_tools_agent\nfrom langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder\nfrom langchain.tools import tool\n\n@tool\ndef read_file(path: str) -> str:\n    \"\"\"Read a file's contents\"\"\"\n    return open(path).read()\n\n@tool\ndef write_file(path: str, content: str) -> str:\n    \"\"\"Write content to a file\"\"\"\n    open(path, \"w\").write(content)\n    return f\"Written to {path}\"\n\nllm = ChatOpenAI(model=\"gpt-4o-mini\")\nprompt = ChatPromptTemplate.from_messages([\n    (\"system\", \"You analyze data files and write reports.\"),\n    (\"human\", \"{input}\"),\n    MessagesPlaceholder(\"agent_scratchpad\"),\n])\n\nagent = create_openai_tools_agent(llm, [read_file, write_file], prompt)\nexecutor = AgentExecutor(agent=agent, tools=[read_file, write_file], verbose=True)\n\nexecutor.invoke({\"input\": \"Read data.csv, analyze trends, write summary to report.md\"})\n```\n\n**Зависимости**: `langchain`, `langchain-openai`, `langchain-core`, плюс их транзитивные зависимости (~50+ пакетов)\n**Строк кода**: ~40 (но слои абстракций под ними — это тысячи строк)\n**Под вашим контролем**: определения инструментов, шаблон промпта. Всё остальное принадлежит LangChain.\n\n### CrewAI (~35 строк)\n\n```python\nfrom crewai import Agent, Task, Crew\nfrom crewai_tools import FileReadTool, FileWriterTool\n\nanalyst = Agent(\n    role=\"Data Analyst\",\n    goal=\"Analyze CSV data and produce insightful reports\",\n    backstory=\"You are an expert data analyst.\",\n    tools=[FileReadTool(), FileWriterTool()],\n    verbose=True\n)\n\ntask = Task(\n    description=\"Read data.csv, analyze the trends, write a summary to report.md\",\n    expected_output=\"A markdown report with key findings\",\n    agent=analyst\n)\n\ncrew = Crew(agents=[analyst], tasks=[task], verbose=True)\ncrew.kickoff()\n```\n\n**Зависимости**: `crewai`, `crewai-tools`, плюс их зависимости (~80+ пакетов)\n**Строк кода**: ~35\n**Под вашим контролем**: роли агентов, описания задач. Поток выполнения принадлежит CrewAI."
		},
		{
			heading: "Матрица компромиссов",
			body: "| Параметр | Голый харнесс | LangChain | CrewAI |\n|-----------|------------|-----------|--------|\n| Строк кода | Больше | Меньше | Меньше всего |\n| Зависимости | 1 | ~50 | ~80 |\n| Отладка | Лёгкая (это ваш код) | Тяжёлая (глубокие стектрейсы) | Средняя |\n| Гибкость | Полная | Ограничена абстракциями | Только на основе ролей |\n| Несколько агентов | Делаете сами | Возможно, но сложно | Встроено |\n| Кривая обучения | Понять API модели | Изучить концепции LangChain | Изучить концепции CrewAI |\n| Путь обновления | Меняете что хотите | Ждёте обновлений LangChain | Ждёте обновлений CrewAI |\n| Готовность к продакшену | Решаете вы | Зависит от стабильности версии | Новее, меньше проверена в бою |"
		},
		{
			heading: "Скрытая цена фреймворков",
			body: "### 1. Отладка чёрных ящиков\n\nКогда что-то ломается в голом харнессе, вы смотрите на свои 60 строк. Когда что-то ломается в LangChain:\n\n```\nFile \"langchain/agents/openai_tools/base.py\", line 147, in _plan\nFile \"langchain_core/runnables/base.py\", line 534, in invoke\nFile \"langchain/chains/base.py\", line 89, in __call__\nFile \"langchain_core/callbacks/manager.py\", line 442, in _handle_event\n...\n```\n\nВы отлаживаете чужую архитектуру.\n\n### 2. Привязка к абстракциям\n\nХотите добавить стриминг? Свою память? Нестандартный паттерн вызова инструментов? В голом харнессе вы просто это пишете. Во фреймворке вы работаете в рамках его точек расширения — или форкаете библиотеку.\n\n### 3. Текучка версий\n\nLangChain пережил несколько крупных переработок API. Код, написанный полгода назад, сегодня может не запуститься. Голый харнесс на одном лишь пакете `openai` стабилен годами."
		},
		{
			heading: "Когда выигрывают фреймворки",
			body: "Фреймворки не плохи. Они действительно помогают, когда:\n\n- **Вы прототипируете** — собрать что-то работающее за один вечер, чтобы проверить идею. Потом перепишете.\n- **Оркестрация из нескольких агентов** — модель «агент — задача» в CrewAI действительно хороша для сложных многоролевых рабочих процессов.\n- **RAG-пайплайны** — загрузчики документов, сплиттеры и интеграции с векторными хранилищами в LangChain экономят реальную работу.\n- **Вам неважна внутренняя кухня** — если агент составляет малую часть большого продукта и вам просто нужно, чтобы он работал."
		},
		{
			heading: "Гибридный подход",
			body: "Многие продакшен-команды начинают с фреймворка и мигрируют на голый харнесс:\n\n```\nWeek 1:  LangChain prototype → \"It works!\"\nWeek 4:  Hit a limitation → \"Why can't I do X?\"\nWeek 8:  Fork/override half the framework → \"I'm fighting the framework\"\nWeek 12: Rewrite as raw harness → \"This is 200 lines and does exactly what I need\"\n```\n\nЭто нормально. Фреймворк научил вас тому, что вам нужно. Харнесс даёт вам контроль."
		},
		{
			heading: "Типичные ловушки",
			body: "- **Начать с фреймворка, не разобравшись в основах** — нельзя отладить то, чего не понимаешь. Соберите голый харнесс хотя бы один раз, даже если никогда не используете его в продакшене.\n- **Выбирать по звёздам на GitHub** — звёзды ≠ пригодность. Фреймворк с 80 тысячами звёзд, заточенный под RAG-пайплайны, не поможет вам построить кодинг-агента.\n- **Страх «изобрести велосипед»** — велосипед здесь — это 50 строк на Python. Не такой уж это и велосипед."
		},
		{
			heading: "Что почитать дальше",
			body: "- [Документация LangChain](https://python.langchain.com/) — самый популярный фреймворк\n- [Документация CrewAI](https://docs.crewai.com/) — оркестрация из нескольких агентов\n- [AutoGen](https://microsoft.github.io/autogen/) — фреймворк для нескольких агентов от Microsoft\n- [Ваш первый харнесс](/guide/your-first-harness) — соберите голую версию сами"
		}
	],
	tasks: [],
	mastery: []
};
