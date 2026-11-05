// Генерирует catalog.md из src/data/catalog.mjs, чтобы документ и сайт не расходились.
import { writeFileSync } from 'node:fs';
import { categories, featurePages } from '../src/data/catalog.mjs';
import { salon } from '../src/data/site.mjs';

const total = categories.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0), 0);
const lines = [
  '# Каталог салона «Текстиль Дизайн»',
  '',
  '> Файл генерируется командой `npm run catalog` из `src/data/catalog.mjs`.',
  '> Чтобы изменить каталог, правьте `src/data/catalog.mjs`, затем перегенерируйте этот файл.',
  '',
  `Всего позиций: **${total}** в ${categories.length} разделах. Все позиции — реальные услуги и товары салона (список владельца от 05.11.2026).`,
  '',
  '## Контакты',
  '',
  `- Адрес: ${salon.address.full}`,
  `- График работы: ${salon.hours.text}`,
  ...salon.phones.map((p) => `- ${p.display} — ${p.label}`),
  `- Email: ${salon.email}`,
  '',
  '## Структура разделов на сайте',
  '',
  '| Раздел | URL | Позиций |',
  '|---|---|---|',
  ...categories.map((c) => `| ${c.title} | \`${c.path}\` | ${c.groups.reduce((m, g) => m + g.items.length, 0)} |`),
  '',
  'Отдельные посадочные страницы:',
  '',
  ...featurePages.map((f) => `- ${f.title} — \`${f.path}\``),
  '',
  'Каждая позиция доступна по якорю внутри страницы раздела, например `/tyul/#organza`.',
  '',
];

for (const c of categories) {
  lines.push(`## ${c.title}`, '', `Страница: \`${c.path}\``, '');
  for (const g of c.groups) {
    lines.push(`### ${g.title}`, '');
    for (const i of g.items) lines.push(`- **${i.name}** (\`#${i.id}\`) — ${i.text}`);
    lines.push('');
  }
}

writeFileSync(new URL('../catalog.md', import.meta.url), lines.join('\n'));
console.log(`catalog.md: ${total} позиций`);
