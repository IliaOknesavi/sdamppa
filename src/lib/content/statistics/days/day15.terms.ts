import type { Glossary } from '$lib/types';

// Термины дня 15 (ch12): интервальное оценивание — доверительный интервал,
// надёжность, центральная статистика, типовые интервалы нормальной модели,
// бутстреп (Эфрон, Холл). Расширяют общий glossary; ссылаются на базовые
// термины (kvantil, normalnoe-raspredelenie, zakon-bolshih-chisel, sko).
export const day15Terms: Glossary = {
	'tochechnaya-ocenka': {
		id: 'tochechnaya-ocenka',
		term: 'Точечная оценка',
		short: String.raw`Число $\widehat\theta_n=g(x_1,\dots,x_n)$, приближающее параметр $\theta$ по выборке.`,
		formula: String.raw`\widehat\theta_n=g(x_1,\dots,x_n)`,
		body: String.raw`**Точечная оценка** $\widehat\theta_n$ — функция от [[vyborka|выборки]], дающая одно число для неизвестного параметра $\theta$. Например, [[vyborochnoe-srednee|выборочное среднее]] оценивает $MX$. Главный недостаток: одно число не сообщает о своей точности — отсюда переход к [[intervalnaya-ocenka|интервальной оценке]].`,
		related: ['intervalnaya-ocenka', 'vyborka', 'vyborochnoe-srednee', 'doveritelnyy-interval']
	},

	vyborka: {
		id: 'vyborka',
		term: 'Выборка',
		short: String.raw`Набор $x_1,\dots,x_n$ независимых наблюдений из генеральной совокупности.`,
		body: String.raw`**Выборка** $x_1,\dots,x_n$ — это $n$ независимых наблюдений одной и той же случайной величины (генеральной совокупности). По выборке строят [[tochechnaya-ocenka|оценки]] неизвестных параметров. Объём $n$ напрямую задаёт точность: ошибка оценки среднего убывает как $1/\sqrt n$.`,
		related: ['tochechnaya-ocenka', 'vyborochnoe-srednee', 'empiricheskaya-funkciya-raspredeleniya']
	},

	'vyborochnoe-srednee': {
		id: 'vyborochnoe-srednee',
		term: 'Выборочное среднее',
		short: String.raw`$\overline X=\frac1n\sum_{i=1}^n x_i$ — оценка математического ожидания.`,
		formula: String.raw`\overline X=\frac1n\sum_{i=1}^n x_i`,
		body: String.raw`**Выборочное среднее** $\overline X=\frac1n\sum_{i=1}^n x_i$ — [[tochechnaya-ocenka|точечная оценка]] [[matematicheskoe-ozhidanie|математического ожидания]] $a=MX$. По [[zakon-bolshih-chisel|закону больших чисел]] $\overline X\to a$, а его дисперсия $D\overline X=\sigma^2/n$ убывает с ростом $n$ — это и задаёт ширину доверительного интервала $\sim\sigma/\sqrt n$.`,
		related: ['tochechnaya-ocenka', 'matematicheskoe-ozhidanie', 'ispravlennaya-dispersiya', 'zakon-bolshih-chisel']
	},

	'ispravlennaya-dispersiya': {
		id: 'ispravlennaya-dispersiya',
		term: 'Исправленная выборочная дисперсия',
		short: String.raw`$S^2=\frac1{n-1}\sum(x_i-\overline X)^2$ — несмещённая оценка $\sigma^2$.`,
		formula: String.raw`S^2=\frac1{n-1}\sum_{i=1}^n (x_i-\overline X)^2`,
		body: String.raw`**Исправленная выборочная дисперсия** $S^2=\frac1{n-1}\sum_{i=1}^n(x_i-\overline X)^2$ оценивает [[dispersiya|дисперсию]] $\sigma^2$. Делитель $n-1$ (а не $n$) делает оценку **несмещённой**: одна степень свободы «потрачена» на оценку центра $\overline X$. Корень $S=\sqrt{S^2}$ — исправленное [[sko|СКО]]; оно заменяет неизвестное $\sigma$ в интервале [[raspredelenie-styudenta|Стьюдента]].`,
		related: ['dispersiya', 'sko', 'vyborochnoe-srednee', 'raspredelenie-styudenta']
	},

	'intervalnaya-ocenka': {
		id: 'intervalnaya-ocenka',
		term: 'Интервальное оценивание',
		short: String.raw`Оценка параметра промежутком, а не одним числом.`,
		body: String.raw`**Интервальное оценивание** даёт для параметра $\theta$ не точку, а интервал $\big(\underline\theta(x),\overline\theta(x)\big)$, накрывающий $\theta$ с заданной вероятностью. В отличие от [[tochechnaya-ocenka|точечной оценки]], интервал явно показывает точность: его ширина — мера неопределённости. Результат — [[doveritelnyy-interval|доверительный интервал]].`,
		related: ['tochechnaya-ocenka', 'doveritelnyy-interval', 'tochnost-ocenki']
	},

	'doveritelnyy-interval': {
		id: 'doveritelnyy-interval',
		term: 'Доверительный интервал',
		short: String.raw`Интервал со случайными границами, накрывающий $\theta$ с вероятностью $1-\alpha$.`,
		formula: String.raw`P\big(\underline\theta\le\theta\le\overline\theta\big)=1-\alpha`,
		body: String.raw`**Доверительный интервал** для $\theta$ с надёжностью $\rho=1-\alpha$ — интервал со **случайными** границами $\big(\underline\theta(x),\overline\theta(x)\big)$, для которого $$P\big(\underline\theta(x)\le\theta\le\overline\theta(x)\big)=1-\alpha.$$ Случайны границы (считаются по выборке), а не сам $\theta$. Читается частотно: доля построенных интервалов, накрывших $\theta$, $\to1-\alpha$.`,
		related: ['doveritelnaya-veroyatnost', 'uroven-znachimosti', 'centralnaya-statistika', 'tochnost-ocenki']
	},

	'doveritelnaya-veroyatnost': {
		id: 'doveritelnaya-veroyatnost',
		term: 'Доверительная вероятность (надёжность)',
		short: String.raw`$\rho=1-\alpha$ — вероятность накрыть параметр интервалом.`,
		formula: String.raw`\rho=1-\alpha`,
		body: String.raw`**Доверительная вероятность** (надёжность) $\rho=1-\alpha$ — вероятность того, что [[doveritelnyy-interval|доверительный интервал]] накроет истинный параметр. Типичные значения $0{,}95$ и $0{,}99$. Чем выше $\rho$, тем шире интервал при том же $n$ — за надёжность платят [[tochnost-ocenki|точностью]].`,
		related: ['doveritelnyy-interval', 'uroven-znachimosti', 'tochnost-ocenki']
	},

	'uroven-znachimosti': {
		id: 'uroven-znachimosti',
		term: 'Уровень значимости',
		short: String.raw`$\alpha$ — вероятность того, что интервал не накроет параметр.`,
		formula: String.raw`\alpha=1-\rho`,
		body: String.raw`**Уровень значимости** $\alpha=1-\rho$ — дополнение к [[doveritelnaya-veroyatnost|надёжности]]: вероятность «промаха» интервала. Обычно $\alpha=0{,}05$ или $0{,}01$. Для симметричного двустороннего интервала $\alpha$ делят поровну между хвостами — по $\alpha/2$, что задаёт [[procentnaya-tochka|процентные точки]] границ.`,
		related: ['doveritelnaya-veroyatnost', 'doveritelnyy-interval', 'procentnaya-tochka']
	},

	'tochnost-ocenki': {
		id: 'tochnost-ocenki',
		term: 'Точность (полуширина) интервала',
		short: String.raw`$\Delta$ — половина ширины симметричного интервала $\widehat\theta\pm\Delta$.`,
		formula: String.raw`\Delta=\frac{\sigma}{\sqrt n}\,u_{\alpha/2}`,
		body: String.raw`**Точность** (полуширина) $\Delta$ задаёт симметричный интервал $\widehat\theta_n\pm\Delta$. Для среднего $\Delta=\frac{\sigma}{\sqrt n}\,u_{\alpha/2}$. Точность и [[doveritelnaya-veroyatnost|надёжность]] связаны обратно: при фиксированном $n$ нельзя одновременно повысить обе. Множитель $1/\sqrt n$ означает: чтобы вдвое сузить $\Delta$, [[vyborka|выборку]] нужно увеличить вчетверо.`,
		related: ['doveritelnyy-interval', 'doveritelnaya-veroyatnost', 'procentnaya-tochka']
	},

	'procentnaya-tochka': {
		id: 'procentnaya-tochka',
		term: 'Процентная точка',
		short: String.raw`$x_q$ с $P(\xi\ge x_q)=q$ — верхняя критическая точка уровня $q$.`,
		formula: String.raw`P(\xi\ge x_q)=q,\quad x_q=F^{-1}(1-q)`,
		body: String.raw`**Процентная точка** (верхняя критическая точка) уровня $q$ — значение $x_q$, правее которого вероятность равна $q$: $P(\xi\ge x_q)=q$, то есть $F(x_q)=1-q$. Связь с [[kvantil|квантилью]]: процентная точка уровня $p$ — это квантиль уровня $1-p$. Границы симметричного интервала — точки уровней $\alpha/2$ и $1-\alpha/2$; для $\mathcal N(0,1)$ при $\rho=0{,}95$ это $\pm1{,}96$.`,
		related: ['kvantil', 'uroven-znachimosti', 'normalnoe-raspredelenie']
	},

	'centralnaya-statistika': {
		id: 'centralnaya-statistika',
		term: 'Центральная статистика',
		short: String.raw`$T(x;\theta)$, чьё распределение известно и не зависит от $\theta$.`,
		formula: String.raw`T=T(x_1,\dots,x_n;\theta)`,
		body: String.raw`**Центральная статистика** $T=T(x_1,\dots,x_n;\theta)$ — функция от выборки и параметра, распределение которой **известно и не зависит** от $\theta$. Это ключ общей схемы: по её квантилям пишут $P(T_{\alpha/2}\le T\le T_{1-\alpha/2})=1-\alpha$ и разрешают неравенство относительно $\theta$. Примеры: $U=\frac{\overline X-a}{\sigma/\sqrt n}\sim\mathcal N(0,1)$, $T$-статистика [[raspredelenie-styudenta|Стьюдента]], $\chi^2$-статистика.`,
		related: ['doveritelnyy-interval', 'raspredelenie-styudenta', 'raspredelenie-hi-kvadrat', 'kvantil']
	},

	'asimptoticheskaya-normalnost': {
		id: 'asimptoticheskaya-normalnost',
		term: 'Асимптотическая нормальность оценки',
		short: String.raw`$\widehat\theta_n\approx\mathcal N(\theta,\widehat\sigma^2/n)$ при больших $n$.`,
		formula: String.raw`\widehat\theta_n\approx\mathcal N\!\big(\theta,\ \widehat\sigma^2(\theta)/n\big)`,
		body: String.raw`Большинство «хороших» оценок при $n\to\infty$ распределены приближённо нормально вокруг истинного значения: $\widehat\theta_n\approx\mathcal N(\theta,\widehat\sigma^2/n)$. Тогда $\frac{\widehat\theta_n-\theta}{\widehat\sigma/\sqrt n}$ — почти $\mathcal N(0,1)$, и для $\widehat\theta_n$ работает универсальный асимптотический интервал $\widehat\theta_n\pm\frac{\widehat\sigma}{\sqrt n}u_{\alpha/2}$. Источник нормальности — [[centralnaya-predelnaya-teorema|ЦПТ]].`,
		related: ['centralnaya-predelnaya-teorema', 'normalnoe-raspredelenie', 'doveritelnyy-interval']
	},

	'raspredelenie-styudenta': {
		id: 'raspredelenie-styudenta',
		term: 'Распределение Стьюдента (t)',
		short: String.raw`$T=\frac{\overline X-a}{S/\sqrt n}$ при $n-1$ степенях свободы.`,
		formula: String.raw`T=\frac{\overline X-a}{S/\sqrt n}\sim t_{n-1}`,
		body: String.raw`Когда $\sigma$ неизвестна и заменена на $S$ ([[ispravlennaya-dispersiya|исправленное СКО]]), величина $T=\frac{\overline X-a}{S/\sqrt n}$ имеет **распределение Стьюдента** с $n-1$ степенями свободы. Оно похоже на [[normalnoe-raspredelenie|нормальное]], но с более тяжёлыми хвостами — это «доплата» за незнание $\sigma$. При $n\to\infty$ стремится к $\mathcal N(0,1)$, поэтому $t_{\alpha/2,\,n-1}\to u_{\alpha/2}$ и интервалы совпадают.`,
		related: ['ispravlennaya-dispersiya', 'normalnoe-raspredelenie', 'centralnaya-statistika', 'raspredelenie-hi-kvadrat']
	},

	'raspredelenie-hi-kvadrat': {
		id: 'raspredelenie-hi-kvadrat',
		term: 'Распределение хи-квадрат (χ²)',
		short: String.raw`$\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}$ — для интервала по дисперсии.`,
		formula: String.raw`\chi^2=\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}`,
		body: String.raw`Для интервального оценивания [[dispersiya|дисперсии]] $\sigma^2$ используют статистику $\chi^2=\frac{(n-1)S^2}{\sigma^2}$, имеющую **распределение хи-квадрат** с $n-1$ степенями свободы. Оно **несимметрично** и неотрицательно, поэтому критические точки слева и справа берут раздельно — отсюда несимметричный интервал $$\frac{(n-1)S^2}{\chi^2_{\alpha/2,\,n-1}}<\sigma^2<\frac{(n-1)S^2}{\chi^2_{1-\alpha/2,\,n-1}}.$$`,
		related: ['ispravlennaya-dispersiya', 'dispersiya', 'centralnaya-statistika']
	},

	'centralnaya-predelnaya-teorema': {
		id: 'centralnaya-predelnaya-teorema',
		term: 'Центральная предельная теорема (ЦПТ)',
		short: String.raw`Сумма (среднее) многих н.о.р. величин $\to$ нормальное распределение.`,
		formula: String.raw`\frac{\overline X-a}{\sigma/\sqrt n}\ \xrightarrow{\ d\ }\ \mathcal N(0,1)`,
		body: String.raw`**ЦПТ:** для независимых одинаково распределённых величин с конечной дисперсией нормированное [[vyborochnoe-srednee|среднее]] при $n\to\infty$ стремится к стандартному нормальному: $\frac{\overline X-a}{\sigma/\sqrt n}\xrightarrow{d}\mathcal N(0,1)$. Это обоснование асимптотических интервалов и причина вездесущности [[normalnoe-raspredelenie|нормали]]. Частный случай для долей — теорема Муавра–Лапласа: $\widehat p\approx\mathcal N\big(p,\tfrac{p(1-p)}n\big)$.`,
		related: ['normalnoe-raspredelenie', 'vyborochnoe-srednee', 'asimptoticheskaya-normalnost', 'zakon-bolshih-chisel']
	},

	butstrep: {
		id: 'butstrep',
		term: 'Бутстреп',
		short: String.raw`Повторные выборки с возвращением из исходной выборки для оценки разброса.`,
		body: String.raw`**Бутстреп** — численный метод: вместо неизвестного распределения генеральной совокупности используют **саму выборку**. Бутстреп-выборка объёма $n$ берётся из исходной случайным **выбором с возвращением**; по $N$ таким выборкам ($N\ge1000$) считают оценки $\widehat\theta^*_i$, и их разброс даёт доверительный интервал ([[interval-efrona|Эфрона]] или [[interval-holla|Холла]]). Работает, потому что [[empiricheskaya-funkciya-raspredeleniya|эмпирическая функция]] $\widehat F_n\approx F$.`,
		related: ['empiricheskaya-funkciya-raspredeleniya', 'interval-efrona', 'interval-holla', 'doveritelnyy-interval']
	},

	'empiricheskaya-funkciya-raspredeleniya': {
		id: 'empiricheskaya-funkciya-raspredeleniya',
		term: 'Эмпирическая функция распределения',
		short: String.raw`$\widehat F_n(x)$ — доля наблюдений выборки, меньших $x$.`,
		formula: String.raw`\widehat F_n(x)=\frac1n\#\{i:\ x_i<x\}`,
		body: String.raw`**Эмпирическая функция распределения** $\widehat F_n(x)=\frac1n\#\{i:x_i<x\}$ — ступенчатое приближение истинной [[funkciya-raspredeleniya|функции распределения]] $F$ по [[vyborka|выборке]]. По теореме Гливенко–Кантелли («основная теорема статистики») $\widehat F_n\to F$ равномерно при $n\to\infty$. Именно из $\widehat F_n$ фактически берёт наблюдения [[butstrep|бутстреп]].`,
		related: ['funkciya-raspredeleniya', 'butstrep', 'vyborka']
	},

	'interval-efrona': {
		id: 'interval-efrona',
		term: 'Интервал Эфрона (перцентильный)',
		short: String.raw`Квантили самих бутстреп-оценок уровней $\alpha/2$ и $1-\alpha/2$.`,
		formula: String.raw`\big[\widehat\theta^*_{\alpha/2};\ \widehat\theta^*_{1-\alpha/2}\big]`,
		body: String.raw`**Перцентильный интервал Эфрона** строится прямо по [[kvantil|квантилям]] набора [[butstrep|бутстреп-оценок]]: $N$ значений $\widehat\theta^*_i$ упорядочивают и отбрасывают по доле $\alpha/2$ с каждого края — центральный диапазон $\big[\widehat\theta^*_{\alpha/2};\widehat\theta^*_{1-\alpha/2}\big]$ и есть интервал. Прост и интуитивен, но при асимметрии и смещении менее точен, чем [[interval-holla|интервал Холла]].`,
		related: ['butstrep', 'interval-holla', 'kvantil']
	},

	'interval-holla': {
		id: 'interval-holla',
		term: 'Интервал Холла (базовый)',
		short: String.raw`Квантили отклонений $q^*=\widehat\theta^*-\widehat\theta_0$, отражённые относительно оценки.`,
		formula: String.raw`\big[\widehat\theta_0-q^*_{1-\alpha/2};\ \widehat\theta_0-q^*_{\alpha/2}\big]`,
		body: String.raw`**Базовый интервал Холла** строится не по самим [[butstrep|бутстреп-оценкам]], а по их **отклонениям** $q^*_i=\widehat\theta^*_i-\widehat\theta_0$ от исходной оценки: $$\big[\widehat\theta_0-q^*_{1-\alpha/2};\ \widehat\theta_0-q^*_{\alpha/2}\big].$$ Большая квантиль разностей идёт в **нижнюю** границу — интервал «отражается» относительно $\widehat\theta_0$, что лучше учитывает смещение. При симметрии распределения оценок совпадает с [[interval-efrona|интервалом Эфрона]].`,
		related: ['butstrep', 'interval-efrona', 'kvantil']
	}
};
