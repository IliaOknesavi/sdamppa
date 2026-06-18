// Русское склонение существительного по числу.
// plural(n, ['день', 'дня', 'дней']) → форма для 1 / 2–4 / 5–20 (с учётом 11–14).
//   plural(1,…)='день'  plural(2,…)='дня'  plural(5,…)='дней'  plural(21,…)='день'
export function plural(n: number, forms: [string, string, string]): string {
	const n10 = Math.abs(n) % 10;
	const n100 = Math.abs(n) % 100;
	if (n10 === 1 && n100 !== 11) return forms[0];
	if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
	return forms[2];
}
