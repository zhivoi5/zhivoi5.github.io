// Разметка schema.org (JSON-LD). Только подтверждённые данные: без координат, рейтингов и цен.
import { salon, SITE_URL } from './site.mjs';
import { categories } from './catalog.mjs';

export const abs = (path) => new URL(path, SITE_URL).href;
export const BUSINESS_ID = abs('/#salon');

export function localBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    '@id': BUSINESS_ID,
    name: salon.name,
    description: 'Салон штор и дизайна: индивидуальный пошив штор и тюля, римские и рулонные шторы, жалюзи, карнизы, ткани и домашний текстиль, выезд дизайнера и монтаж.',
    url: abs('/'),
    logo: abs('/icon-512.png'),
    image: abs('/og-image.jpg'),
    telephone: salon.phones[0].tel,
    email: salon.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: salon.address.street,
      addressLocality: salon.address.city,
      addressRegion: salon.address.city,
      addressCountry: salon.address.country,
    },
    areaServed: [
      { '@type': 'Place', name: 'Коммунарка' },
      { '@type': 'City', name: 'Москва' },
    ],
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: salon.hours.opens,
      closes: salon.hours.closes,
    }],
    contactPoint: salon.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.tel,
      contactType: p.label === 'Основной номер' ? 'customer service' : 'sales',
      name: p.label,
      availableLanguage: 'ru',
    })),
    paymentAccepted: 'Наличные, банковская карта, оплата по QR-коду',
    currenciesAccepted: 'RUB',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Каталог салона «Текстиль Дизайн»',
      itemListElement: categories.map((c) => ({
        '@type': 'OfferCatalog',
        name: c.title,
        url: abs(c.path),
      })),
    },
  };
}

export function breadcrumbs(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.path) })),
  };
}

/** Раздел каталога: Service с перечнем позиций. */
export function categoryService(cat, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: cat.title,
    serviceType: cat.title,
    description: cat.seo.description,
    url: abs(url ?? cat.path),
    provider: { '@id': BUSINESS_ID },
    areaServed: [{ '@type': 'Place', name: 'Коммунарка' }, { '@type': 'City', name: 'Москва' }],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: cat.title,
      itemListElement: cat.groups.flatMap((g) => g.items).map((i) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: i.name, url: abs(`${cat.path}#${i.id}`) },
      })),
    },
  };
}
