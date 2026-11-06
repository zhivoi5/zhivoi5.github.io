// Статический сервер для прототипа: отдаёт корень проекта, чтобы работали ../public и ../node_modules.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT) || 4330;
const root = fileURLToPath(new URL('..', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm' };

// shortcut: временные стоковые заглушки, пока в prototype/media/ нет сгенерированных файлов.
// Положили файл с тем же именем — сервер отдаёт его, заглушка больше не используется.
const placeholders = {
  'hero-poster.jpg': '1733896967858-40ab7ea3f94f',
  'intro.jpg': '1691036562132-56a310d4b789',
  'cat-shtory.jpg': '1754611380518-61a923cc47ca',
  'cat-tyul.jpg': '1598414381594-18d86505f5d5',
  'cat-rimskie.jpg': '1631345346020-f9ca0902f5be',
  'cat-rulonnye.jpg': '1776261293170-66fd3b09273e',
  'cat-zhalyuzi.jpg': '1627201609961-f662f5a0cccb',
  'cat-karnizy.jpg': '1792006488312-f8db4367ecb6',
  'cat-tkani.jpg': '1770970831074-6e88b6cc260b',
  'cat-tekstil.jpg': '1766245456897-5c86726d084d',
  'cat-uslugi.jpg': '1781888699751-15f2b304693c',
  'material.jpg': '1770795264222-0b53185b49f2',
  'atelier.jpg': '1781888699751-15f2b304693c',
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let path = decodeURIComponent(url.pathname);
  if (path === '/') { res.writeHead(302, { Location: '/prototype/' }); return res.end(); }
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    const name = path.startsWith('/prototype/media/') && path.slice('/prototype/media/'.length);
    if (placeholders[name]) {
      const w = Number(url.searchParams.get('w')) || 1600;
      const h = name.startsWith('cat-') ? `&h=${Math.round(w * 1.25)}` : '';
      res.writeHead(302, { Location: `https://images.unsplash.com/photo-${placeholders[name]}?auto=format&fit=crop&w=${w}${h}&q=75`, 'Cache-Control': 'no-store' });
      return res.end();
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Не найдено: в прототипе есть только главная страница.');
  }
}).listen(port, '127.0.0.1', () => console.log(`Прототип: http://localhost:${port}/prototype/`));
