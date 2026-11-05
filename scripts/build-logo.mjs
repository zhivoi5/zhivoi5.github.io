// Делает чистую векторную монограмму «ТД» из фотографии логотипа салона.
// Исходник references/images/IMG_1779.jpg не меняется: результат пишется в src/assets/brand/.
//  1) выделяем золотые пиксели (золото: R ≥ G, R заметно больше B; зелёный бархат, чёрная тень
//     и белый блик-«звёздочка» в маску не попадают);
//  2) сглаживаем маску и трассируем её в SVG-контур (potrace);
//  3) сохраняем монограмму с fill="currentColor", чтобы красить её токенами сайта.
import sharp from 'sharp';
import potrace from 'potrace';
import { mkdirSync, writeFileSync } from 'node:fs';

const SRC = new URL('../references/images/IMG_1779.jpg', import.meta.url).pathname;
const OUT = new URL('../src/assets/brand/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const mask = Buffer.alloc(width * height);
for (let i = 0; i < width * height; i++) {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  const gold = r > 120 && r - b > 50 && r >= g - 8;
  mask[i] = gold ? 0 : 255; // potrace трассирует тёмное
}

// Медианный фильтр убирает «брашированную» текстуру золота, затем увеличение и размытие сглаживают края.
const maskPng = await sharp(mask, { raw: { width, height, channels: 1 } })
  .median(7)
  .resize(width * 2, height * 2, { kernel: 'lanczos3' })
  .blur(4)
  .threshold(128)
  .png()
  .toBuffer();
writeFileSync(OUT + 'monogram-mask.png', maskPng);

const svgRaw = await new Promise((resolve, reject) =>
  potrace.trace(maskPng, { turdSize: 600, optTolerance: 1.2, alphaMax: 1.1, threshold: 128 }, (err, svg) =>
    err ? reject(err) : resolve(svg),
  ),
);
const d = svgRaw.match(/ d="([^"]+)"/)[1];

// Обрезаем по фактическим границам знака.
const trimmed = await sharp(maskPng).negate().trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
const { trimOffsetLeft: ox, trimOffsetTop: oy, width: w, height: h } = trimmed.info;
const pad = Math.round(Math.max(w, h) * 0.02);
// sharp отдаёт отрицательные смещения обрезки.
const vb = `${-ox - pad} ${-oy - pad} ${w + pad * 2} ${h + pad * 2}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="currentColor" role="img" aria-label="Текстиль Дизайн"><path fill-rule="evenodd" d="${d}"/></svg>\n`;
writeFileSync(OUT + 'monogram.svg', svg);
console.log(`monogram.svg: viewBox ${vb}, ${(svg.length / 1024).toFixed(1)} KB`);
