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
	blurb: 'Пределы, производные, интегралы и ряды — по той же системе, с разбивкой по семестрам.',
	accent: '#7f00ff',
	glyph: '∫',
	semesters: [1, 2, 3],
	ready: false
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
		name: 'DL-фреймворки',
		short: 'DL',
		blurb: 'Открытый стек глубокого обучения по той же системе. Первый предмет — PyTorch.',
		accent: '#ee4c2c',
		extra: true,
		subjects: [pytorch]
	}
];

export function directionMeta(id: string): DirectionMeta | undefined {
	return directionsMeta.find((d) => d.id === id);
}
