// Каталог салона «Текстиль Дизайн».
// Данные — в src/content/catalog/*.json (по файлу на раздел, редактируются в CMS).
// Модуль собирает их в один список для страниц, schema.org, catalog.md и проверок.

/** @typedef {{ name: string, id: string, text: string }} Item */
/** @typedef {{ title: string, items: Item[] }} Group */
import { readJson, readJsonDir } from './content.mjs';

export const categories = readJsonDir('catalog')
  .sort((a, b) => a.order - b.order)
  .map((c) => ({ ...c, path: `/${c.slug}/` }));

// Отдельные посадочные страницы там, где у запроса свой смысл.
export const featurePages = readJson('settings/features.json').pages;

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

export const allItems = categories.flatMap((c) =>
  c.groups.flatMap((g) => g.items.map((i) => ({ ...i, category: c.slug, group: g.title }))),
);

// Порядок разделов в каталоге (Услуги показываются отдельно).
export const productCategories = categories.filter((c) => c.slug !== 'uslugi');

export const countItems = (c) => c.groups.reduce((n, g) => n + g.items.length, 0);
