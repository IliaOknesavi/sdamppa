#!/usr/bin/env node
// =====================================================================
//  Навигационный чек: (1) нет петель в back-ссылках (после редиректов),
//  (2) граф достижим из главной, (3) нет битых внутренних ссылок в контенте.
//  Запуск:  node scripts/check-nav.mjs   (exit 1 при любой проблеме)
//
//  Модель роутов (SvelteKit):
//    /                                 — главная (список направлений)
//    /glossary                         — глоссарий
//    /{dir}                            — направление (список предметов)
//    /{dir}/{subject}                  — предмет; РЕДИРЕКТ → /{dir}/{subject}/{sem0}
//                                        если у предмета ровно один семестр
//    /{dir}/{subject}/{sem}            — дашборд курса (список дней)
//    /{dir}/{subject}/{sem}/day/{n}    — день
//
//  Back-ссылки (из route-компонентов):
//    /glossary                → /
//    /{dir}                   → /
//    /{dir}/{subject}         → /{dir}
//    /{dir}/{subject}/{sem}   → /{dir}            (если 1 семестр)
//                             → /{dir}/{subject}  (если семестров >1)
//    /{dir}/{subject}/{sem}/day/{n} → /{dir}/{subject}/{sem}
// =====================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// ---- 1. Разбираем модель из meta.ts -------------------------------------
const meta = read('src/lib/content/meta.ts');
// SubjectMeta consts: имя переменной → { id, semesters[] }
const subjByVar = {};
for (const m of meta.matchAll(/const\s+(\w+)\s*:\s*SubjectMeta\s*=\s*\{([\s\S]*?)\n\};/g)) {
	const body = m[2];
	const id = (body.match(/id:\s*'([^']+)'/) || [])[1];
	const sems = (body.match(/semesters:\s*\[([^\]]*)\]/) || [])[1] || '';
	const semesters = sems.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
	if (id) subjByVar[m[1]] = { id, semesters };
}
// directionsMeta: id + subjects (по именам переменных)
const dirsBlock = (meta.match(/directionsMeta\s*:\s*DirectionMeta\[\]\s*=\s*\[([\s\S]*?)\n\];/) || [])[1] || '';
const directions = [];
for (const m of dirsBlock.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?subjects:\s*\[([^\]]*)\]/g)) {
	const vars = m[2].split(',').map((s) => s.trim()).filter(Boolean);
	directions.push({ id: m[1], subjects: vars.map((v) => subjByVar[v]).filter(Boolean) });
}
const dirById = Object.fromEntries(directions.map((d) => [d.id, d]));
const subjIn = (dir, sub) => dirById[dir]?.subjects.find((s) => s.id === sub);

let problems = 0;
const fail = (msg) => { console.error('  ✗ ' + msg); problems++; };

// ---- 2. Резолвер редиректов + back-ссылок -------------------------------
function redirect(url) {
	const m = url.match(/^\/([^/]+)\/([^/]+)$/); // /{dir}/{subject}
	if (m) {
		const s = subjIn(m[1], m[2]);
		if (s && s.semesters.length === 1) return `/${m[1]}/${m[2]}/${s.semesters[0]}`;
	}
	return url;
}
function backOf(url) {
	if (url === '/' ) return null;
	if (url === '/glossary') return '/';
	let m;
	if ((m = url.match(/^\/([^/]+)\/([^/]+)\/([^/]+)\/day\/\d+$/))) return `/${m[1]}/${m[2]}/${m[3]}`;
	if ((m = url.match(/^\/([^/]+)\/([^/]+)\/([^/]+)$/))) {
		const s = subjIn(m[1], m[2]);
		return s && s.semesters.length === 1 ? `/${m[1]}` : `/${m[1]}/${m[2]}`;
	}
	if ((m = url.match(/^\/([^/]+)\/([^/]+)$/))) return `/${m[1]}`;
	if ((m = url.match(/^\/([^/]+)$/))) return '/';
	return null;
}

// набор реальных навигируемых страниц (по одной day-странице на дашборд достаточно)
const pages = new Set(['/', '/glossary']);
for (const d of directions) {
	pages.add(`/${d.id}`);
	for (const s of d.subjects) {
		pages.add(`/${d.id}/${s.id}`);
		for (const sem of s.semesters) {
			pages.add(`/${d.id}/${s.id}/${sem}`);
			pages.add(`/${d.id}/${s.id}/${sem}/day/1`);
		}
	}
}

// ---- 3. Проверка петель: идём по back-ссылкам (с редиректами) до / -------
console.log('nav-check: направлений', directions.length, '· предметов',
	directions.reduce((n, d) => n + d.subjects.length, 0));
console.log('\n[1] Петли в back-навигации');
for (const start of pages) {
	let cur = redirect(start);
	const seen = new Set([cur]);
	let steps = 0;
	while (cur && steps++ < 50) {
		const back = backOf(cur);
		if (back === null) break; // дошли до корня — ок
		const resolved = redirect(back);
		if (resolved === cur) { fail(`петля: ${cur} → back → ${back} (редирект → ${resolved}) ведёт в себя`); break; }
		if (seen.has(resolved)) { fail(`цикл: ${[...seen, resolved].join(' → ')}`); break; }
		seen.add(resolved);
		cur = resolved;
	}
	if (steps >= 50) fail(`не сходится к / из ${start} (возможен цикл)`);
}
if (!problems) console.log('  ✓ петель нет, все пути сходятся к /');

// ---- 4. Достижимость из / (forward) ------------------------------------
console.log('\n[2] Связность (достижимость из /)');
const forward = (url) => {
	if (url === '/') return [...directions.map((d) => `/${d.id}`), '/glossary'];
	let m;
	if ((m = url.match(/^\/([^/]+)$/))) {
		const d = dirById[m[1]]; return d ? d.subjects.map((s) => `/${d.id}/${s.id}`) : [];
	}
	if ((m = url.match(/^\/([^/]+)\/([^/]+)$/))) {
		const s = subjIn(m[1], m[2]); return s ? s.semesters.map((sem) => `/${m[1]}/${m[2]}/${sem}`) : [];
	}
	return [];
};
const reached = new Set(); const q = ['/'];
while (q.length) { const u = q.shift(); if (reached.has(u)) continue; reached.add(u); for (const n of forward(redirect(u))) q.push(redirect(n)); }
for (const p of pages) {
	if (p.includes('/day/')) continue; // дни перечисляются дашбордом (не в forward-модели)
	if (!reached.has(redirect(p))) fail(`недостижимо из /: ${p}`);
}
if (!problems) console.log('  ✓ все направления/предметы/курсы достижимы из главной');

// ---- 5. Битые внутренние ссылки в контенте ------------------------------
console.log('\n[3] Внутренние ссылки в контенте');
const files = [];
(function walk(dir) {
	for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
		const rel = dir + '/' + e.name;
		if (e.isDirectory()) walk(rel);
		else if (e.name.endsWith('.ts')) files.push(rel);
	}
})('src/lib/content');
const linkRe = /\]\((\/[^)\s]+?)\)|href=["'](\/[^"'\s]+)["']/g;
let linkCount = 0; const bad = new Map();
const valid = (u) => {
	u = u.split(/[?#]/)[0];
	if (u === '/' || u === '/glossary') return true;
	let m;
	if ((m = u.match(/^\/([^/]+)$/))) return !!dirById[m[1]];
	if ((m = u.match(/^\/([^/]+)\/([^/]+)$/))) return !!subjIn(m[1], m[2]);
	if ((m = u.match(/^\/([^/]+)\/([^/]+)\/(\d+)$/))) { const s = subjIn(m[1], m[2]); return !!s && s.semesters.includes(Number(m[3])); }
	if ((m = u.match(/^\/([^/]+)\/([^/]+)\/(\d+)\/day\/(\d+)$/))) { const s = subjIn(m[1], m[2]); return !!s && s.semesters.includes(Number(m[3])) && Number(m[4]) >= 1; }
	return false;
};
for (const f of files) {
	const t = read(f);
	for (const m of t.matchAll(linkRe)) {
		const u = m[1] || m[2]; linkCount++;
		if (!valid(u)) { if (!bad.has(u)) bad.set(u, []); bad.get(u).push(f.replace('src/lib/content/', '')); }
	}
}
if (bad.size) for (const [u, where] of bad) fail(`битая ссылка ${u}  (в ${[...new Set(where)].slice(0, 3).join(', ')})`);
else console.log(`  ✓ ${linkCount} внутренних ссылок — все ведут на существующие страницы`);

// ---- итог ---------------------------------------------------------------
console.log('\n' + (problems ? `ПРОВАЛ: ${problems} проблем(ы)` : 'OK: петель нет, граф связен, битых ссылок нет'));
process.exit(problems ? 1 : 0);
