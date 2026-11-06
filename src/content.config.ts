// «Наши работы» — коллекция Astro: по файлу на проект, фото лежат в src/assets/works/.
// Остальной контент (каталог, тексты, контакты) — JSON в src/content/, читается через src/data/*.mjs.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    place: z.string().optional(),
    summary: z.string().optional(),
    photos: z.array(z.object({ image: z.string(), alt: z.string(), caption: z.string().optional() })).min(1),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { works };
