// Из векторной монограммы (src/assets/brand/monogram.svg) собирает файлы для public/:
// цветные версии знака, фавиконки и картинку Open Graph 1200×630.
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const C = { emerald: '#123B2E', emeraldDeep: '#0C2A20', gold: '#C5A66A', ivory: '#F5F1E9' };
const mono = readFileSync(new URL('../src/assets/brand/monogram.svg', import.meta.url), 'utf8');
const [vx, vy, vw, vh] = mono.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const path = mono.match(/<path[^>]+\/>/)[0];
const pub = new URL('../public/', import.meta.url).pathname;
mkdirSync(pub + 'brand', { recursive: true });

// 1. Цветные версии знака для <img>
for (const [name, color] of [['gold', C.gold], ['emerald', C.emerald], ['ivory', C.ivory]]) {
  writeFileSync(
    `${pub}brand/monogram-${name}.svg`,
    mono.replace('fill="currentColor"', `fill="${color}"`),
  );
}

// Знак, вписанный в квадрат size×size с полями.
const placed = (size, inset, color) => {
  const s = (size - inset * 2) / Math.max(vw, vh);
  const tx = (size - vw * s) / 2 - vx * s;
  const ty = (size - vh * s) / 2 - vy * s;
  return `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)})" fill="${color}">${path}</g>`;
};

// 2. Фавиконки
const icon = (size, radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${C.emerald}"/>${placed(size, size * 0.14, C.gold)}</svg>`;
writeFileSync(pub + 'favicon.svg', icon(64, 12));
await sharp(Buffer.from(icon(180, 0))).png().toFile(pub + 'apple-touch-icon.png');
await sharp(Buffer.from(icon(512, 0))).png().toFile(pub + 'icon-512.png');
await sharp(Buffer.from(icon(48, 8))).resize(32, 32).png().toFile(pub + 'favicon-32.png');

// 3. Open Graph
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.emerald}"/>
  <rect x="0" y="0" width="460" height="630" fill="${C.emeraldDeep}"/>
  <g transform="translate(70 155)">${placed(320, 0, C.gold)}</g>
  <line x1="540" y1="250" x2="600" y2="250" stroke="${C.gold}" stroke-width="2"/>
  <text x="540" y="225" fill="${C.gold}" font-family="Helvetica Neue, Arial, sans-serif" font-size="22" letter-spacing="4">САЛОН ШТОР И ДИЗАЙНА</text>
  <text x="536" y="340" fill="${C.ivory}" font-family="Georgia, 'Times New Roman', serif" font-size="76">Текстиль Дизайн</text>
  <text x="540" y="410" fill="${C.ivory}" fill-opacity="0.82" font-family="Helvetica Neue, Arial, sans-serif" font-size="28">Шторы, тюль, карнизы и жалюзи на заказ</text>
  <text x="540" y="456" fill="${C.ivory}" fill-opacity="0.82" font-family="Helvetica Neue, Arial, sans-serif" font-size="28">Москва, Коммунарка</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 88, mozjpeg: true }).toFile(pub + 'og-image.jpg');

console.log('brand assets: monogram-{gold,emerald,ivory}.svg, favicon.svg, favicon-32.png, apple-touch-icon.png, icon-512.png, og-image.jpg');
