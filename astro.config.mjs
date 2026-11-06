import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/data/site.mjs';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
  // Карта (MapLibre) — крупный, но ленивый чанк: грузится, только когда посетитель дошёл до контактов
  vite: { build: { chunkSizeWarningLimit: 1200 } },
});
