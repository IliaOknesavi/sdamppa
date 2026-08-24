// =====================================================================
//  Лёгкий каталог направлений и предметов — БЕЗ тел курсов (дни/секции/
//  глоссарий). Главная и страница направления рендерятся из этой меты, а
//  тело предмета грузится лениво по subjectId (см. registry.ts) только при
//  заходе в сам предмет/семестр/день.
//
//  ВНИМАНИЕ: мета здесь продублирована из модулей предметов (name/short/blurb/
//  glyph/accent + semesters/ready). Дубль стабилен и мал; при росте каталога
//  стоит вынести в <subject>/meta.ts (drift-free) — отдельный follow-up.
// =====================================================================

export interface SubjectMeta {
	id: string;
	name: string;
	short: string;
	blurb: string;
	accent: string;
	glyph: string;
	semesters: number[]; // какие семестры есть
	ready: boolean; // есть ли хотя бы один готовый курс
}

export interface DirectionMeta {
	id: string;
	name: string;
	short: string;
	blurb?: string;
	accent?: string;
	extra?: boolean;
	subjects: SubjectMeta[];
}

const statistics: SubjectMeta = {
	id: 'statistics',
	name: 'Статистика и анализ данных',
	short: 'СтатАД',
	blurb: 'Полный курс: теория вероятностей, математическая статистика и цепи Маркова — глубже программы.',
	accent: '#e75239',
	glyph: 'σ',
	semesters: [2],
	ready: true
};
const algorithms: SubjectMeta = {
	id: 'algorithms',
	name: 'Алгоритмы и структуры данных',
	short: 'Алго',
	blurb: 'Курс по лабам: теория из лекций + настоящая лаба прямо на сайте (IDE с реальными файлами) и интерактивные визуализации алгоритмов.',
	accent: '#0000ff',
	glyph: 'λ',
	semesters: [2],
	ready: true
};
const chma: SubjectMeta = {
	id: 'chma',
	name: 'Численные методы анализа',
	short: 'ЧМА',
	blurb: 'Вычислительная математика: интерполяция и приближение функций, численное дифференцирование и интегрирование, вычислительная линейная алгебра.',
	accent: '#0e8f8f',
	glyph: '≈',
	semesters: [4],
	ready: true
};
const matan: SubjectMeta = {
	id: 'matan',
	name: 'Математический анализ',
	short: 'Матан',
	blurb: 'Курс, который начинается не с вещественной прямой, а с аксиоматики ZFC: топология, метрика и норма идут раньше пределов, а ℝ появляется как частный случай.',
	accent: '#7f00ff',
	glyph: '∫',
	semesters: [1, 2],
	ready: true
};
const pytorch: SubjectMeta = {
	id: 'pytorch',
	name: 'PyTorch',
	short: 'PyTorch',
	blurb: 'Исчерпывающий курс по PyTorch: от тензора и autograd до CNN, трансформеров и продакшна. Живые numpy-демо в браузере + настоящий torch в один клик в Colab.',
	accent: '#ee4c2c',
	glyph: '∇',
	semesters: [1],
	ready: true
};
const ml: SubjectMeta = {
	id: 'ml',
	name: 'Основы машинного обучения',
	short: 'ML',
	blurb: 'Классический ML до уровня стажировки в Яндексе: от kNN и линейных моделей до CatBoost, метрик и валидации. Каждый алгоритм — руками на numpy со сверкой sklearn прямо в браузере, плюс разбор реальных вопросов ML-секций.',
	accent: '#16a34a',
	glyph: 'ŷ',
	semesters: [1],
	ready: true
};
const oop: SubjectMeta = {
	id: 'oop',
	name: 'Объектно-ориентированное программирование на Python',
	short: 'ООП',
	blurb: 'Исчерпывающий курс ООП на Python: классы, инкапсуляция, наследование и MRO, dunder-методы, дескрипторы, метаклассы, SOLID и паттерны — весь код запускается прямо в браузере.',
	accent: '#4B8BBE',
	glyph: '◆',
	semesters: [1],
	ready: true
};
const harness: SubjectMeta = {
	id: 'harness',
	name: 'Инженерия агентных харнессов',
	short: 'Харнессы',
	blurb: 'Перевод MIT-гайда Nexu: как из языковой модели собрать агента — агентный цикл, инструменты, суб-агенты и оркестрация, контекст, песочницы и эвалы. С реальным кодом.',
	accent: '#22a39f',
	glyph: '⚙',
	semesters: [1],
	ready: true
};
const coscientist: SubjectMeta = {
	id: 'coscientist',
	name: 'CoScientist: разбор мультиагентной системы',
	short: 'CoScientist',
	blurb: 'Онбординг-разбор боевой мультиагентной LLM-системы ITMO-NSS (Google ADK + FEDOT.MAS + RAG): сборка из system.yaml, жизненный цикл запроса, два потока (литература и генерация молекул), запуск и ловушки — по актуальному коду. Плюс интерактивный атлас всех 108 файлов, история изменений и разбор незакрытых веток.',
	accent: '#7c5cff',
	glyph: '⚗',
	semesters: [1],
	ready: true
};

export const directionsMeta: DirectionMeta[] = [
	{
		id: 'aii',
		name: 'Инженерия искусственного интеллекта',
		short: 'ИИИ',
		blurb: 'Направление подготовки. Предметы делятся по семестрам, версии — по годам программы.',
		accent: '#0000ff',
		subjects: [statistics, algorithms, chma, matan]
	},
	{
		id: 'dl',
		name: 'Машинное обучение и DL',
		short: 'ML/DL',
		blurb: 'Открытый ML-стек по той же системе: Python-ООП как фундамент, классический ML до уровня стажировки и PyTorch.',
		accent: '#ee4c2c',
		extra: true,
		subjects: [oop, ml, pytorch]
	},
	{
		id: 'agents',
		name: 'Инженерия агентов',
		short: 'Агенты',
		blurb: 'Дополнительные материалы по агентной инженерии. Первый — перевод открытого гайда по харнессам.',
		accent: '#22a39f',
		extra: true,
		subjects: [harness, coscientist]
	}
];

export function directionMeta(id: string): DirectionMeta | undefined {
	return directionsMeta.find((d) => d.id === id);
}
