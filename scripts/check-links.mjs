// Проверяет в dist/ все внутренние ссылки и якоря, а также внешние ссылки на соответствие белому списку.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const pages = new Map();
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) { if (f !== 'admin') walk(p); }
  else if (p.endsWith('.html')) pages.set('/' + p.slice(dist.length).replace(/index\.html$/, '').replace(/\.html$/, '/'), readFileSync(p, 'utf8'));
});
walk(dist);

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const allowedExternal = [/^https:\/\/yandex\.ru\/maps\//, /^https:\/\/www\.google\.com\/maps\//];
const errors = [];
let checked = 0;
for (const [page, html] of pages) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    checked++;
    if (href.startsWith('tel:') || href.startsWith('mailto:')) continue;
    if (/^https?:/.test(href)) {
      if (!allowedExternal.some((re) => re.test(href))) errors.push(`${page}: внешняя ссылка ${href}`);
      continue;
    }
    const [path, hash] = href.split('#');
    const target = path === '' ? page : path;
    const html2 = pages.get(target);
    if (!html2) {
      if (!existsSync(join(dist, target))) errors.push(`${page}: битая ссылка ${href}`);
      continue;
    }
    if (hash && !ids(html2).has(decodeURIComponent(hash))) errors.push(`${page}: нет якоря ${href}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Ссылки: проверено ${checked} на ${pages.size} страницах — битых нет.`);
