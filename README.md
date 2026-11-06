# Сайт салона штор «Текстиль Дизайн»

Статический сайт на [Astro](https://astro.build) 5. Документы проекта:

- `brief.md` — бриф, контакты, структура, что осталось уточнить;
- `catalog.md` — полный каталог (108 позиций), генерируется из данных;
- `design-system/MASTER.md`, `REDESIGN-CONCEPT.md`, `ART-DIRECTIONS.md` — дизайн-система и концепция «Выпуск»;
- `docs/CMS.md` — управление контентом (Sveltia CMS) и подключение перед публикацией;
- `prototype/` — утверждённый прототип главной (не входит в сборку).

## Запуск

Нужен Node.js 20+.

```bash
npm install
npm run dev        # разработка: http://localhost:4321 (админка — /admin/index.html)
npm run build      # сборка в dist/ + проверки содержимого и ссылок
npm run preview    # просмотр собранной версии
```

Перед публикацией укажите домен — он нужен для canonical, sitemap.xml и Open Graph:

```bash
SITE_URL=https://ваш-домен.ru npm run build
```

## Где что менять

Тексты, каталог, контакты и «Наши работы» редактируются в админке `/admin/` (см. `docs/CMS.md`)
или прямо в файлах:

| Что | Файл |
|---|---|
| Адрес, телефоны, график, почта, оплата | `src/content/settings/salon.json` |
| Каталог (разделы, позиции, тексты, SEO) | `src/content/catalog/*.json`, затем `npm run catalog` |
| Тексты страниц | `src/content/pages/*.json` |
| Наши работы | `src/content/works/*.md`, фото — `src/assets/works/` |
| Фото сайта | `src/assets/media/` (имена слотов — `src/data/media.mjs`) |
| Видео обложки | `public/media/hero-loop.webm` и `.mp4` |
| Schema.org | `src/data/schema.mjs` |
| Цвета, шрифты, сетка | `src/styles/global.css` (главная), `src/styles/pages.css` (внутренние) |
| Логотип | `npm run logo` (из `references/images/IMG_1779.jpg`) |

## Проверки (`npm run build`)

- `scripts/check-content.mjs` — расхождения каталога со списком владельца (`scripts/source-list.mjs`) и оставшиеся фото-заглушки — предупреждения, контакты в `brief.md`/`catalog.md` совпадают с `site.mjs`; в HTML нет форм, цен, мессенджеров, «бесплатно» и «гарантий», на каждой странице один `h1`, canonical и основной телефон.
- `scripts/check-links.mjs` — все внутренние ссылки и якоря ведут на существующие страницы и элементы.
