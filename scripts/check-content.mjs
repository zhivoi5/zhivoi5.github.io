// Проверки содержимого:
//  1) каталог сайта содержит все позиции из списка владельца, без потерь и дублей;
//  2) контакты в документах (и в собранном сайте при --dist) совпадают с src/data/site.mjs;
//  3) в собранном сайте нет устаревшего адреса, мессенджеров, цен и форм.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { categories, allItems } from '../src/data/catalog.mjs';
import { salon } from '../src/data/site.mjs';
import { sourceList } from './source-list.mjs';

const errors = [];
const root = new URL('..', import.meta.url).pathname;

// 1. Каталог
const titleBySection = {
  'Услуги': 'Услуги',
  'Шторы на заказ': 'Шторы на заказ',
  'Карнизы и системы для штор': 'Карнизы и системы для штор',
  'Рулонные шторы': 'Рулонные шторы',
  'Ткани для штор': 'Ткани для штор',
  'Тюль': 'Тюль',
  'Римские шторы': 'Римские шторы',
  'Домашний текстиль и декор': 'Домашний текстиль и декор',
  'Жалюзи и плиссе': 'Жалюзи и плиссе',
};
let sourceTotal = 0;
for (const [section, names] of Object.entries(sourceList)) {
  sourceTotal += names.length;
  const cat = categories.find((c) => c.title === titleBySection[section]);
  if (!cat) { errors.push(`Нет раздела «${section}»`); continue; }
  const siteNames = cat.groups.flatMap((g) => g.items.map((i) => i.name));
  for (const n of names) if (!siteNames.includes(n)) errors.push(`«${section}»: нет позиции «${n}»`);
  for (const n of siteNames) if (!names.includes(n)) errors.push(`«${section}»: лишняя позиция «${n}»`);
}
if (allItems.length !== sourceTotal) errors.push(`Позиций на сайте ${allItems.length}, в списке владельца ${sourceTotal}`);
for (const c of categories) {
  const ids = c.groups.flatMap((g) => g.items.map((i) => i.id));
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) errors.push(`${c.slug}: повторяются якоря ${dup.join(', ')}`);
}

// 2. Контакты в документах
const mustContain = [salon.address.street, salon.hours.opens, salon.hours.closes, salon.email, ...salon.phones.map((p) => p.display)];
for (const doc of ['brief.md', 'catalog.md']) {
  const p = join(root, doc);
  if (!existsSync(p)) { errors.push(`Нет файла ${doc}`); continue; }
  const text = readFileSync(p, 'utf8');
  for (const s of mustContain) if (!text.includes(s)) errors.push(`${doc}: не найдено «${s}»`);
}

// 3. Собранный сайт
const forbidden = [
  [/Примерная/i, 'адрес-заглушка из референса'],
  [/wa\.me|whatsapp\.com|t\.me\/|viber:/i, 'ссылка на мессенджер'],
  [/<form[\s>]/i, 'форма'],
  [/₽|руб\./i, 'цена'],
  [/бесплатн/i, 'обещание бесплатной услуги'],
  [/гарант/i, 'гарантия'],
];
if (process.argv.includes('--dist')) {
  const dist = join(root, 'dist');
  const html = [];
  const walk = (d) => readdirSync(d).forEach((f) => {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.html')) html.push(p);
  });
  walk(dist);
  for (const file of html) {
    const text = readFileSync(file, 'utf8');
    const rel = file.slice(dist.length);
    for (const [re, what] of forbidden) if (re.test(text)) errors.push(`${rel}: ${what} (${re})`);
    if (!rel.includes('404') && !text.includes(salon.phones[0].tel)) errors.push(`${rel}: нет основного телефона`);
    if (!/<link rel="canonical"/.test(text) && !rel.includes('404')) errors.push(`${rel}: нет canonical`);
    if ((text.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${rel}: должен быть ровно один h1`);
  }
  console.log(`Проверено HTML-страниц: ${html.length}`);
}

if (errors.length) {
  console.error('Ошибки проверки:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`Каталог: ${allItems.length} позиций из ${sourceTotal} — всё на месте. Контакты согласованы.`);
