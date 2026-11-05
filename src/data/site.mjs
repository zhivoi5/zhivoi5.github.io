// Единственный источник контактных данных салона.
// Сайт, schema.org и проверочные скрипты берут данные только отсюда.

export const SITE_URL = process.env.SITE_URL ?? 'https://tekstil-dizajn.example';

const addressFull =
  'Москва, Новомосковский административный округ, район Коммунарка, проспект Куприна, 11к2';
const mapQuery = encodeURIComponent('Москва, Коммунарка, проспект Куприна, 11к2');

export const salon = {
  name: 'Текстиль Дизайн',
  kind: 'Салон штор и дизайна',
  address: {
    full: addressFull,
    street: 'проспект Куприна, 11к2',
    district: 'район Коммунарка',
    okrug: 'Новомосковский административный округ',
    city: 'Москва',
    country: 'RU',
  },
  hours: {
    text: 'Ежедневно с 12:00 до 20:00',
    opens: '12:00',
    closes: '20:00',
  },
  phones: [
    { display: '+7 915 444-96-92', tel: '+79154449692', label: 'Основной номер' },
    { display: '+7 985 166-35-67', tel: '+79851663567', label: 'Татьяна, дизайнер' },
  ],
  email: 'TD.salon@mail.ru',
  payment: ['банковская карта', 'наличные', 'QR-код'],
  installment: 'Рассрочка на 6 месяцев',
  maps: {
    yandex: `https://yandex.ru/maps/?text=${mapQuery}`,
    google: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  },
};
