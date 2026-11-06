// Опубликованные работы салона. Пока их нет, раздел не показывается в навигации и карте сайта.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection } from 'astro:content';

const dir = join(process.cwd(), 'src', 'content', 'works');
// Пустая коллекция заставляет Astro предупреждать на каждой странице — до первой работы не обращаемся к ней
const hasFiles = () => readdirSync(dir, { recursive: true }).some((f) => String(f).endsWith('.md'));

export const getWorks = async () =>
  hasFiles()
    ? (await getCollection('works', (w) => !w.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    : [];
