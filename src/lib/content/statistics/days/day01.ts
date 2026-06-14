import type { Day } from '$lib/types';

export const day01: Day = {
	n: 1,
	phaseId: 'tv',
	title: 'События и вероятностное пространство',
	chapterRef: 'ch01',
	est: '1–2 ч',
	goal: String.raw`Построить язык, на котором описывается вся случайность курса: [[veroyatnostnoe-prostranstvo|вероятностное пространство]] $(\Omega,\mathcal F,P)$, [[sobytie|события]] и [[svoystva-veroyatnosti|свойства вероятности]]. Это фундамент — на нём держатся и коллоквиум, и статистика.`,
	sections: [
		{
			kind: 'definition',
			heading: 'Вероятностное пространство',
			body: String.raw`Случайный эксперимент формализуется тройкой [[veroyatnostnoe-prostranstvo|$(\Omega,\mathcal F,P)$]]:

- [[prostranstvo-ishodov|$\Omega$]] — множество всех [[elementarnyy-ishod|элементарных исходов]] $\omega$;
- [[sigma-algebra|$\mathcal F$]] — $\sigma$-алгебра, набор тех подмножеств $\Omega$, которым мы приписываем вероятность ([[sobytie|событий]]);
- [[veroyatnost|$P$]] — вероятностная мера на $\mathcal F$.

Для конечного $\Omega$ обычно $\mathcal F$ — все подмножества, и сложностей с измеримостью нет. Аппарат $\sigma$-алгебры по-настоящему нужен для непрерывных моделей (день 7).`
		},
		{
			kind: 'definition',
			heading: 'События и операции над ними',
			body: String.raw`[[sobytie|Событие]] — подмножество $\Omega$. Над событиями работают [[operacii-nad-sobytiyami|теоретико-множественные операции]]: $A\cup B$ («или»), $A\cap B$ («и»), $A\setminus B$, [[protivopolozhnoe|$\bar A$]] («не $A$»).

Особые случаи: [[dostovernoe|достоверное]] событие $\Omega$ и [[nevozmozhnoe|невозможное]] $\varnothing$. События $A,B$ [[nesovmestnye|несовместны]], если $A\cap B=\varnothing$; набор $H_1,\dots,H_n$ образует [[polnaya-gruppa|полную группу]], если они попарно несовместны и покрывают всё $\Omega$.

Полезны законы де Моргана: $\overline{A\cup B}=\bar A\cap\bar B$ и $\overline{A\cap B}=\bar A\cup\bar B$.`
		},
		{
			kind: 'theorem',
			heading: 'Свойства вероятности',
			body: String.raw`Из [[aksiomy-kolmogorova|аксиом Колмогорова]] (неотрицательность, $P(\Omega)=1$, счётная аддитивность) выводятся [[svoystva-veroyatnosti|основные свойства]]:

1. $P(\varnothing)=0$;
2. [[protivopolozhnoe|$P(\bar A)=1-P(A)$]];
3. монотонность: $A\subseteq B \Rightarrow P(A)\le P(B)$;
4. [[teorema-slozheniya|теорема сложения]] $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ и её обобщение — [[vklyuchenie-isklyuchenie|включения-исключения]];
5. [[neravenstvo-bulya|неравенство Буля]] $P(\bigcup_i A_i)\le\sum_i P(A_i)$.`
		},
		{
			kind: 'derivation',
			heading: 'Вывод теоремы сложения',
			body: String.raw`Разобьём $A\cup B$ на [[nesovmestnye|несовместные]] куски: $$A\cup B=(A\setminus B)\ \sqcup\ (A\cap B)\ \sqcup\ (B\setminus A).$$ По аддитивности $$P(A\cup B)=P(A\setminus B)+P(A\cap B)+P(B\setminus A).$$ Но $P(A)=P(A\setminus B)+P(A\cap B)$ и $P(B)=P(B\setminus A)+P(A\cap B)$. Сложив их, получаем $P(A)+P(B)=P(A\cup B)+P(A\cap B)$, откуда $$P(A\cup B)=P(A)+P(B)-P(A\cap B).\qquad\blacksquare$$

**Идея для запоминания:** складывая $P(A)$ и $P(B)$, пересечение учли дважды — один раз его и вычитаем.`
		},
		{
			kind: 'intuition',
			heading: 'Откуда берутся числа: устойчивость частот',
			body: String.raw`[[statisticheskaya-veroyatnost|Статистическое определение]] объясняет, *почему* вероятность вообще что-то предсказывает: при больших $n$ относительная частота $\frac{n_A}{n}$ стабилизируется около $P(A)$. Аксиомы Колмогорова — это абстракция именно этого наблюдения (частоты неотрицательны, частота $\Omega$ равна 1, частоты несовместных событий складываются).`
		},
		{
			kind: 'connection',
			heading: 'Мост к статистике',
			body: String.raw`В теории вероятностей $P$ известна, и мы считаем вероятности событий. В статистике всё наоборот: $P$ (или её параметры) **неизвестна**, и мы оцениваем её по данным — опираясь ровно на [[statisticheskaya-veroyatnost|устойчивость частот]]. Поэтому сегодняшний язык $(\Omega,\mathcal F,P)$ — это фундамент, на котором в части 2 вырастут выборка, оценки и проверка гипотез.`
		}
	],
	code: {
		title: 'Оценка вероятности частотой (Монте-Карло)',
		language: 'python',
		code: `import random

def estimate_prob(event, trials=100_000):
    """P(event) ≈ доля испытаний, где event(исход) истинно."""
    hits = sum(event(roll()) for _ in range(trials))
    return hits / trials

roll = lambda: random.randint(1, 6)          # бросок кубика, Ω = {1..6}

# Событие A = «выпало чётное», теоретически P(A) = 3/6 = 0.5
print(estimate_prob(lambda x: x % 2 == 0))   # ≈ 0.50

# Теорема сложения: A = «чётное», B = «> 3»; проверяем P(A∪B)
pa  = estimate_prob(lambda x: x % 2 == 0)     # {2,4,6}
pb  = estimate_prob(lambda x: x > 3)          # {4,5,6}
pab = estimate_prob(lambda x: x % 2 == 0 and x > 3)  # {4,6}
print(pa + pb - pab)                          # ≈ P(A∪B), A∪B={2,4,5,6} = 4/6 ≈ 0.667`,
		explanation: String.raw`Это [[statisticheskaya-veroyatnost|статистическое определение]] в действии: гоняем эксперимент много раз и берём долю успехов. Заодно численно проверяется [[teorema-slozheniya|теорема сложения]] — $p_a+p_b-p_{ab}$ совпадает с прямой оценкой $P(A\cup B)$.

**В проде** ровно так оценивают вероятности там, где формулы нет: конверсию в A/B-тесте по логам, вероятность отказа сервиса по истории инцидентов, риск в Монте-Карло-симуляциях (финансы, надёжность). Метод Монте-Карло — отдельная большая тема дня 18.`
	},
	tasks: [
		{
			id: 's-d1-t1',
			difficulty: 'base',
			prompt: String.raw`Известно $P(A)=0{,}6$, $P(B)=0{,}5$, $P(A\cap B)=0{,}2$. Найдите $P(A\cup B)$ и $P(\bar A)$.`,
			hint: String.raw`Прямо примените [[teorema-slozheniya|теорему сложения]] и формулу [[protivopolozhnoe|противоположного события]].`,
			solution: String.raw`По теореме сложения $$P(A\cup B)=0{,}6+0{,}5-0{,}2=0{,}9.$$ По формуле дополнения $$P(\bar A)=1-0{,}6=0{,}4.$$`,
			answer: String.raw`$P(A\cup B)=0{,}9$, $P(\bar A)=0{,}4$.`,
			xp: 12
		},
		{
			id: 's-d1-t2',
			difficulty: 'base',
			prompt: String.raw`В группе студент знает ответ на вопрос с вероятностью $0{,}7$, на задачу — с вероятностью $0{,}6$, на оба — $0{,}5$. Какова вероятность, что он не знает ни того, ни другого?`,
			hint: String.raw`«Ни того, ни другого» = $\overline{A\cup B}$. Сначала найдите $P(A\cup B)$.`,
			solution: String.raw`$P(A\cup B)=0{,}7+0{,}6-0{,}5=0{,}8$. Тогда «ни одного» — это [[protivopolozhnoe|противоположное]]: $$P(\overline{A\cup B})=1-0{,}8=0{,}2.$$`,
			answer: String.raw`$0{,}2$.`,
			xp: 12
		},
		{
			id: 's-d1-t3',
			difficulty: 'star',
			prompt: String.raw`Докажите [[neravenstvo-bulya|неравенство Буля]] $P\big(\bigcup_{i=1}^{n} A_i\big)\le\sum_{i=1}^{n}P(A_i)$ для произвольных (не обязательно несовместных) событий.`,
			hint: String.raw`Сделайте события несовместными: $B_1=A_1$, $B_k=A_k\setminus\bigcup_{i<k}A_i$.`,
			solution: String.raw`Положим $B_1=A_1$ и $B_k=A_k\setminus\bigcup_{i<k}A_i$. Тогда $B_k$ попарно [[nesovmestnye|несовместны]], $\bigcup_k B_k=\bigcup_k A_k$ и $B_k\subseteq A_k$. По аддитивности и монотонности $$P\Big(\bigcup_k A_k\Big)=\sum_k P(B_k)\le\sum_k P(A_k).\qquad\blacksquare$$`,
			answer: String.raw`Через дизъюнктизацию $B_k=A_k\setminus\bigcup_{i<k}A_i$.`,
			xp: 25
		}
	],
	mastery: [
		'Могу записать тройку (Ω, 𝓕, P) и объяснить роль каждого элемента',
		'Знаю аксиомы Колмогорова и вывожу из них P(∅)=0, P(Ā)=1−P(A), монотонность',
		'Вывожу теорему сложения, а не только помню формулу',
		'Понимаю, почему статистическое определение — мост к части 2 курса'
	]
};
