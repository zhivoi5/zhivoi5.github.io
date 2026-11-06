// Чтение контента из src/content/ — эти файлы редактирует CMS.
// Читаем через fs, чтобы одни и те же данные видели и сборка Astro, и проверочные скрипты.
// shortcut: путь от process.cwd() — команды запускаются из корня проекта (npm run …).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'src', 'content');

export const readJson = (rel) => JSON.parse(readFileSync(join(dir, rel), 'utf8'));

export const readJsonDir = (rel) =>
  readdirSync(join(dir, rel))
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson(join(rel, f)));
