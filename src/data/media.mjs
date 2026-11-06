// shortcut: временные стоковые заглушки (Unsplash) для слотов, у которых ещё нет файла в src/assets/media/.
// Как только файл с тем же именем появится (из MFLUX или от салона), заглушка перестаёт использоваться.
// Сборка предупреждает, пока на сайте остаются заглушки; перед публикацией их не должно быть.
export const placeholders = {
  'hero-poster.jpg': '1733896967858-40ab7ea3f94f',
  'intro.jpg': '1691036562132-56a310d4b789',
  'cat-shtory.jpg': '1754611380518-61a923cc47ca',
  'cat-tyul.jpg': '1598414381594-18d86505f5d5',
  'cat-rimskie.jpg': '1631345346020-f9ca0902f5be',
  'cat-rulonnye.jpg': '1776261293170-66fd3b09273e',
  'cat-zhalyuzi.jpg': '1627201609961-f662f5a0cccb',
  'cat-karnizy.jpg': '1792006488312-f8db4367ecb6',
  'cat-tkani.jpg': '1770970831074-6e88b6cc260b',
  'cat-tekstil.jpg': '1766245456897-5c86726d084d',
  'cat-uslugi.jpg': '1781888699751-15f2b304693c',
  'material.jpg': '1770795264222-0b53185b49f2',
  'atelier.jpg': '1781888699751-15f2b304693c',
  'vyezd.jpg': '1754613411942-f2dee061753b',
  'lift.jpg': '1754611362309-71297e9f42fd',
  'blackout.jpg': '1773054405490-423865105e9b',
};

export const placeholderUrl = (name, w = 1600, h) =>
  `https://images.unsplash.com/photo-${placeholders[name]}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`;
