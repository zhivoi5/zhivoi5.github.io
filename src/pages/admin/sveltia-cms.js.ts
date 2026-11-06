// Отдаёт сборку Sveltia CMS из node_modules как /admin/sveltia-cms.js — версия фиксируется в package.json.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const GET: APIRoute = () =>
  new Response(readFileSync(join(process.cwd(), 'node_modules/@sveltia/cms/dist/sveltia-cms.js')), {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  });
