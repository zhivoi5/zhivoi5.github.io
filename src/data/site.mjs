// Контакты салона. Сами данные — в src/content/settings/salon.json (редактируются в CMS).
// Сайт, schema.org и проверочные скрипты берут их только отсюда.
import { readJson } from './content.mjs';

export const SITE_URL = process.env.SITE_URL ?? 'https://zhivoi5.github.io';

const data = readJson('settings/salon.json');
const mapQuery = encodeURIComponent(`${data.address.city}, ${data.address.street}`);

export const salon = {
  ...data,
  maps: {
    // Маршрут «от текущего места» — так у посетителя сразу открывается навигация
    route: data.geo
      ? `https://yandex.ru/maps/?rtext=~${data.geo.lat}%2C${data.geo.lng}&rtt=auto`
      : `https://yandex.ru/maps/?text=${mapQuery}`,
    yandex: `https://yandex.ru/maps/?text=${mapQuery}`,
    google: data.geo
      ? `https://www.google.com/maps/dir/?api=1&destination=${data.geo.lat}%2C${data.geo.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  },
};
