# Сайт салона штор «Текстиль Дизайн»

Статический сайт на [Astro](https://astro.build) 5. Документы проекта:

- `brief.md` — бриф, контакты, структура, что осталось уточнить;
- `catalog.md` — полный каталог (108 позиций), генерируется из данных;
- `design-system/MASTER.md` — дизайн-система.

## Запуск

Нужен Node.js 20+.

```bash
npm install
npm run dev        # разработка: http://localhost:4321
npm run build      # сборка в dist/ + проверки содержимого и ссылок
npm run preview    # просмотр собранной версии
```

Перед публикацией укажите домен — он нужен для canonical, sitemap.xml и Open Graph:

```bash
SITE_URL=https://ваш-домен.ru npm run build
```

## Где что менять

| Что | Файл |
|---|---|
| Адрес, телефоны, график, почта | `src/data/site.mjs` |
| Каталог (разделы, позиции, тексты, SEO) | `src/data/catalog.mjs`, затем `npm run catalog` |
| Schema.org | `src/data/schema.mjs` |
| Цвета, шрифты, отступы | `src/styles/global.css` |
| Иллюстрации разделов | `src/components/Art.astro` |
| Логотип | `npm run logo` (из `references/images/IMG_1779.jpg`) |

## Проверки (`npm run build`)

- `scripts/check-content.mjs` — каталог совпадает со списком владельца (`scripts/source-list.mjs`), контакты в `brief.md`/`catalog.md` совпадают с `site.mjs`; в HTML нет форм, цен, мессенджеров, «бесплатно» и «гарантий», на каждой странице один `h1`, canonical и основной телефон.
- `scripts/check-links.mjs` — все внутренние ссылки и якоря ведут на существующие страницы и элементы.
