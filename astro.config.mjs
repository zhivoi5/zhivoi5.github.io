import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/data/site.mjs';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
