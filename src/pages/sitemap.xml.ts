import type { APIRoute } from 'astro';
import { categories, featurePages } from '../data/catalog.mjs';

// Карта сайта: только индексируемые страницы с канонических адресов.
export const GET: APIRoute = ({ site }) => {
  const paths = ['/', ...categories.map((c) => c.path), ...featurePages.map((f) => f.path), '/kontakty/'];
  const lastmod = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
