import type { Glossary } from '$lib/types';

// Термины дня 16. Понятия, за которые отвечают другие дни, здесь не
// переобъявляются и используются только перекрёстными ссылками:
// asimptoticheskie-klassy, chastichnaya-posledovatelnost,
// vykolotaya-okrestnost, n-nol-n-odin, blacksquare,
// skhodyashchayasya-v-sebe, priznak-i-svoystvo и прочие.
// Карточки predel-posledovatelnosti, posledovatelnost,
// shodyashchayasya-posledovatelnost, ogranichennost-posledovatelnosti и
// n-ot-epsilon продублированы из [дней 11–15](/aii/matan/1/day/11) намеренно: день должен
// резолвиться независимо от того, открыт ли предыдущий.
export const day16Terms: Glossary = {
	'beskonechno-bolshaya': {
		id: 'beskonechno-bolshaya',
		term: 'Бесконечно большая последовательность (б.б.)',
		short: String.raw`Хвост уходит за любой порог: $|F_n|>\varepsilon_F$ при всех $n>N_F$.`,
		formula: String.raw`\forall\varepsilon_F>0\ \exists N_F\in\mathbb N_1\ \forall n>N_F:\ |F_n|>\varepsilon_F`,
		body: String.raw`**Бесконечно большая** — зеркальная к [[beskonechno-malaya|бесконечно малой]]: вместо $|f_n|<\varepsilon_f$ требуется $|F_n|>\varepsilon_F$, и требование так же наложено на весь хвост. Условие строго сильнее [[ogranichennost-posledovatelnosti|неограниченности]]: всякая б.б. неограниченна, но не всякая неограниченная — б.б., различающий пример — [[nikakaya-posledovatelnost|«никакая»]] последовательность $g_n=\frac1n$ на чётных номерах и $g_n=n$ на нечётных. Нотация: заглавные $F_n,\tilde F_n$, эталон $F_n=n^4$.`,
		related: ['beskonechno-malaya', 'ogranichennost-posledovatelnosti', 'nikakaya-posledovatelnost', 'asimptoticheskie-klassy']
	},

	'nikakaya-posledovatelnost': {
		id: 'nikakaya-posledovatelnost',
		term: '«Никакая» последовательность',
		short: String.raw`Ни бесконечно большая, ни бесконечно малая.`,
		body: String.raw`**«Никакой»** называют последовательность, не попавшую ни в класс [[beskonechno-bolshaya|б.б.]], ни в класс [[beskonechno-malaya|б.м.]]. Таких два сорта: ограниченные без предела, как $(-1)^n$, и неограниченные, но не бесконечно большие, — канонический пример $g_n=\frac1n$ на чётных номерах и $g_n=n$ на нечётных: предела нет, но и «весь хвост выше порога» не выполняется. Тем же словом отмечают результат операции, класс которого не определён классами аргументов: «разность двух б.б. — никакая». В этом втором смысле «никакая» — синоним [[neopredelennost|неопределённости]].`,
		related: ['beskonechno-bolshaya', 'beskonechno-malaya', 'neopredelennost', 'chastichnaya-posledovatelnost']
	},

	'obratnaya-velichina': {
		id: 'obratnaya-velichina',
		term: 'Обратная последовательность 1/fₙ',
		short: String.raw`Переворот меняет класс на противоположный, а порог — на обратный.`,
		formula: String.raw`\varepsilon_f=\frac1{\varepsilon_h},\qquad N_h(\varepsilon_h)=N_f\Bigl(\frac1{\varepsilon_h}\Bigr)`,
		body: String.raw`Если $f_n$ — [[beskonechno-malaya|бесконечно малая]] и $f_n\ne0$, то $\frac1{f_n}$ — [[beskonechno-bolshaya|бесконечно большая]]; если $F_n$ — б.б., то $\frac1{F_n}$ — б.м. (деление законно, так как на хвосте $|F_n|>\varepsilon_F>0$). Пороги связываются как $\varepsilon\mapsto\frac1\varepsilon$, а нового [[n-ot-epsilon|номера]] искать не надо: годится старая формула в перевёрнутом пороге, $N_h(\varepsilon_h)=N_f(1/\varepsilon_h)$. Если в посылке ослабить «бесконечно большая» до «неограниченная», обратная импликация опровергается [[nikakaya-posledovatelnost|«никакой»]] последовательностью.`,
		related: ['beskonechno-malaya', 'beskonechno-bolshaya', 'n-ot-epsilon', 'nikakaya-posledovatelnost']
	},

	'ogranichennost-posledovatelnosti': {
		id: 'ogranichennost-posledovatelnosti',
		term: 'Ограниченность последовательности',
		short: String.raw`Сверху и снизу — два раздельных условия, и это существенно.`,
		formula: String.raw`\exists A\ \forall n:\ f_n\le A\qquad\text{и}\qquad \exists B\ \forall n:\ f_n\ge B`,
		body: String.raw`Ограниченность **сверху** и **снизу** определяются раздельно, и это существенно: последовательность, у которой нарушено хотя бы одно из двух условий, называют **неограниченной**; ограниченная сверху имеет $\sup$, ограниченная снизу — $\inf$. Всякая [[beskonechno-bolshaya|бесконечно большая]] неограниченна, обратное неверно; всякая [[shodyashchayasya-posledovatelnost|сходящаяся]], напротив, ограничена — это отдельная теорема.`,
		related: ['beskonechno-bolshaya', 'shodyashchayasya-posledovatelnost', 'predel-posledovatelnosti']
	},

	'shodyashchayasya-posledovatelnost': {
		id: 'shodyashchayasya-posledovatelnost',
		term: 'Сходящаяся последовательность',
		short: String.raw`Та, у которой предел существует: $\exists A:\ \lim f_n=A$.`,
		formula: String.raw`\exists A:\ \lim_{n\to\infty}f_n=A`,
		body: String.raw`Последовательность **сходится**, если у неё есть [[predel-posledovatelnosti|предел]]. Две теоремы о таких последовательностях: предел единственен и всякая сходящаяся [[ogranichennost-posledovatelnosti|ограничена]]. Сходимость с ненулевым пределом сильнее простой ограниченности: она даёт [[otdelennost-ot-nulya|отделённость от нуля]] на хвосте.`,
		related: ['predel-posledovatelnosti', 'ogranichennost-posledovatelnosti', 'otdelennost-ot-nulya', 'beskonechno-malaya']
	},

};
