import { Channel, EPGProgram, Playlist } from '../types';

// High-reliability public HLS test streams for fallback playback
export const SAMPLE_HLS_STREAMS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Big Buck Bunny HLS
  'https://demo.unified-streaming.com/k8s/live/stable/sintel.ism/sintel.m3u8', // Sintel HLS
  'https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8', // Oceans
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', // Sintel Alt
  'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', // Akamai Live Test
  'https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8', // Telequebec
];

// Helper to pick a working sample stream cleanly
export function getSampleStream(index: number, customUrl?: string): string {
  if (customUrl && customUrl.trim().length > 5) {
    return customUrl;
  }
  return SAMPLE_HLS_STREAMS[index % SAMPLE_HLS_STREAMS.length];
}

// Generate Ukrainian Channels catalog (400+ representation & top channels)
const ukrainianChannelNames = [
  { name: '1+1 Україна', cat: 'Національні', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=120&auto=format&fit=crop&q=80' },
  { name: '1+1 Марафон (Єдині Новини)', cat: 'Новини', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80' },
  { name: 'ICTV', cat: 'Національні', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=120&auto=format&fit=crop&q=80' },
  { name: 'ICTV2', cat: 'Кіно та Серіали', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=120&auto=format&fit=crop&q=80' },
  { name: 'СТБ', cat: 'Національні', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=120&auto=format&fit=crop&q=80' },
  { name: 'Інтер', cat: 'Національні', quality: 'HD', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=120&auto=format&fit=crop&q=80' },
  { name: 'Новий Канал', cat: 'Національні', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=120&auto=format&fit=crop&q=80' },
  { name: '2+2', cat: 'Кіно та Серіали', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&auto=format&fit=crop&q=80' },
  { name: 'ТЕТ', cat: 'Національні', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&auto=format&fit=crop&q=80' },
  { name: 'Суспільне Новини', cat: 'Новини', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80' },
  { name: 'Суспільне Київ', cat: 'Регіональні', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=120&auto=format&fit=crop&q=80' },
  { name: 'Суспільне Спорт', cat: 'Спорт', quality: '4K', logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&auto=format&fit=crop&q=80' },
  { name: '24 Канал', cat: 'Новини', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80' },
  { name: 'Еспресо TV', cat: 'Новини', quality: 'HD', logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=120&auto=format&fit=crop&q=80' },
  { name: 'Прямий', cat: 'Новини', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=120&auto=format&fit=crop&q=80' },
  { name: 'М1 Україна', cat: 'Музика', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80' },
  { name: 'М2', cat: 'Музика', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&auto=format&fit=crop&q=80' },
  { name: 'ПлюсПлюс', cat: 'Дитячі', quality: 'HD', logo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80' },
  { name: 'Pixel TV', cat: 'Дитячі', quality: 'HD', logo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=120&auto=format&fit=crop&q=80' },
  { name: 'Сонце', cat: 'Кіно та Серіали', quality: 'HD', logo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80' },
  { name: 'Enter-Фільм', cat: 'Кіно та Серіали', quality: 'HD', logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&auto=format&fit=crop&q=80' },
  { name: 'Мега', cat: 'Пізнавальні', quality: 'HD', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=80' },
  { name: 'К2', cat: 'Національні', quality: 'HD', logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=120&auto=format&fit=crop&q=80' },
  { name: 'НЛО TV', cat: 'Кіно та Серіали', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=80' },
  { name: 'Київ TV', cat: 'Регіональні', quality: 'HD', logo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=120&auto=format&fit=crop&q=80' },
  { name: 'Рада HD', cat: 'Новини', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=120&auto=format&fit=crop&q=80' },
  { name: 'Setanta Sports UA', cat: 'Спорт', quality: '4K', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80' },
  { name: 'Setanta Sports+ UA', cat: 'Спорт', quality: '4K', logo: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=120&auto=format&fit=crop&q=80' },
  { name: 'XSPORT', cat: 'Спорт', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&auto=format&fit=crop&q=80' },
  { name: 'Cine+ Hit', cat: 'Кіно та Серіали', quality: '4K', logo: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=120&auto=format&fit=crop&q=80' },
  { name: 'Cine+ Legend', cat: 'Кіно та Серіали', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=120&auto=format&fit=crop&q=80' },
  { name: 'Paramount Comedy UA', cat: 'Кіно та Серіали', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=120&auto=format&fit=crop&q=80' },
  { name: 'Кожухівка TV Live', cat: 'Регіональні', quality: '4K', logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=120&auto=format&fit=crop&q=80' },
];

// Generate Russian channel catalog placeholders
const russianChannelNames = [
  { name: 'Первый Канал HD', cat: 'Російські', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=120&auto=format&fit=crop&q=80' },
  { name: 'Россия 1 HD', cat: 'Російські', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80' },
  { name: 'НТВ HD', cat: 'Російські', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80' },
  { name: 'ТНТ HD', cat: 'Російські', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=120&auto=format&fit=crop&q=80' },
  { name: 'СТС HD', cat: 'Російські', quality: 'FHD', logo: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=120&auto=format&fit=crop&q=80' },
  { name: 'РЕН ТВ', cat: 'Російські', quality: 'HD', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=80' },
  { name: 'Матч ТВ HD', cat: 'Російські', quality: '4K', logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&auto=format&fit=crop&q=80' },
  { name: 'Кинопремьера HD', cat: 'Російські', quality: '4K', logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&auto=format&fit=crop&q=80' },
  { name: 'Пятница!', cat: 'Російські', quality: 'HD', logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=120&auto=format&fit=crop&q=80' },
  { name: 'Муз-ТВ', cat: 'Російські', quality: 'HD', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80' },
];

// Helper to build 400+ Ukrainian and 500+ Russian channels dynamically with authentic naming
export function buildInitialChannels(): Channel[] {
  const channels: Channel[] = [];
  let idCounter = 1;

  // 1. Primary curated UA channels
  ukrainianChannelNames.forEach((ch, idx) => {
    channels.push({
      id: `ua-${idCounter++}`,
      name: ch.name,
      category: ch.cat as any,
      language: 'UA',
      streamUrl: getSampleStream(idx),
      quality: ch.quality as any,
      logo: ch.logo,
      isFavorite: idx < 6,
      currentProgram: idx % 2 === 0 ? 'Вечірній Випуск Новин' : 'Художній Фільм "Свобода"',
      nextProgram: 'Підсумки Дня & Аналітика',
      viewCount: 15200 - idx * 300,
    });
  });

  // Expand Ukrainian channel count to 420+ with regional, specialized & music channels
  const uaRegions = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Запоріжжя', 'Вінниця', 'Черкаси', 'Полтава', 'Чернівці', 'Івано-Франківськ', 'Тернопіль', 'Житомир', 'Рівне', 'Суми', 'Хмельницький', 'Закарпаття', 'Волинь', 'Миколаїв', 'Херсон'];
  const uaGenrePrefixes = ['Кінозал UA', 'Спорт Live UA', 'Новини 24/7', 'Музична Хвиля', 'Дитяча Казка', 'Документальний UA', 'Авто Драйв', 'Кулінарія та Затишок', 'Супутникові Новини', 'Ретро Фільм'];

  let uaCount = channels.length;
  while (uaCount < 415) {
    const reg = uaRegions[uaCount % uaRegions.length];
    const gen = uaGenrePrefixes[uaCount % uaGenrePrefixes.length];
    const catName: any = gen.includes('Кіно') ? 'Кіно та Серіали' : gen.includes('Спорт') ? 'Спорт' : gen.includes('Новини') ? 'Новини' : gen.includes('Музична') ? 'Музика' : gen.includes('Дитяча') ? 'Дитячі' : 'Регіональні';

    channels.push({
      id: `ua-${idCounter++}`,
      name: `${gen} - ${reg} HD`,
      category: catName,
      language: 'UA',
      streamUrl: getSampleStream(uaCount),
      quality: uaCount % 4 === 0 ? '4K' : uaCount % 3 === 0 ? 'FHD' : 'HD',
      logo: `https://picsum.photos/seed/ua-${uaCount}/120/120`,
      isFavorite: false,
      currentProgram: `Прямий Ефір: ${gen}`,
      nextProgram: `Огляд Подій: ${reg}`,
      viewCount: Math.floor(Math.random() * 8000) + 120,
    });
    uaCount++;
  }

  // 2. Primary RU channels + expanded to 510+
  russianChannelNames.forEach((ch, idx) => {
    channels.push({
      id: `ru-${idCounter++}`,
      name: ch.name,
      category: 'Російські',
      language: 'RU',
      streamUrl: getSampleStream(idx + 3),
      quality: ch.quality as any,
      logo: ch.logo,
      isFavorite: false,
      currentProgram: 'Информационная программа "Вечер"',
      nextProgram: 'Художественный киносеанс',
      viewCount: 9800 - idx * 250,
    });
  });

  const ruGenres = ['Кино Премиум', 'Кино Микс', 'Ностальгия HD', 'СпортHD', 'Детектив ТВ', 'Комедия Клуб', 'Музыка HD', 'Детский Мир', 'Авто Плюс', 'Загородная Жизнь'];
  let ruCount = channels.filter(c => c.language === 'RU').length;
  while (ruCount < 505) {
    const gen = ruGenres[ruCount % ruGenres.length];
    channels.push({
      id: `ru-${idCounter++}`,
      name: `${gen} #${ruCount + 1}`,
      category: 'Російські',
      language: 'RU',
      streamUrl: getSampleStream(ruCount + 5),
      quality: ruCount % 5 === 0 ? '4K' : 'FHD',
      logo: `https://picsum.photos/seed/ru-${ruCount}/120/120`,
      isFavorite: false,
      currentProgram: `Эфир ${gen}`,
      nextProgram: 'Программа передач',
      viewCount: Math.floor(Math.random() * 6000) + 100,
    });
    ruCount++;
  }

  // 3. International & Webcams (30+ channels)
  const intlChannels = [
    { name: 'BBC News HD', cat: 'Закордонні', lang: 'EN', quality: 'FHD' },
    { name: 'CNN International', cat: 'Закордонні', lang: 'EN', quality: 'FHD' },
    { name: 'Euronews HD', cat: 'Закордонні', lang: 'EN', quality: 'FHD' },
    { name: 'TVP Info Poland', cat: 'Закордонні', lang: 'PL', quality: 'HD' },
    { name: 'Deutsche Welle DE', cat: 'Закордонні', lang: 'DE', quality: 'FHD' },
    { name: 'France 24', cat: 'Закордонні', lang: 'FR', quality: 'HD' },
    { name: 'NASA TV HD Live', cat: 'Пізнавальні', lang: 'EN', quality: '4K' },
    { name: 'Earth Cam 4K Live', cat: 'Вебкамери', lang: 'EN', quality: '4K' },
    { name: 'Київ - Майдан Незалежності 4K Cam', cat: 'Вебкамери', lang: 'UA', quality: '4K' },
    { name: 'Одеса - Потьомкінські сходи Cam', cat: 'Вебкамери', lang: 'UA', quality: '4K' },
    { name: 'Карпати - Буковель Схили Cam', cat: 'Вебкамери', lang: 'UA', quality: '4K' },
    { name: 'Львів - Площа Ринок Cam', cat: 'Вебкамери', lang: 'UA', quality: '4K' },
  ];

  intlChannels.forEach((ch, idx) => {
    channels.push({
      id: `int-${idCounter++}`,
      name: ch.name,
      category: ch.cat as any,
      language: ch.lang as any,
      streamUrl: getSampleStream(idx + 2),
      quality: ch.quality as any,
      logo: `https://picsum.photos/seed/int-${idx}/120/120`,
      isFavorite: false,
      currentProgram: 'Live Broadcast World News',
      nextProgram: 'Global Insight & Report',
      viewCount: Math.floor(Math.random() * 12000) + 500,
    });
  });

  return channels;
}

// Initial System Playlists
export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-ua-main',
    name: 'Український Національний Плейлист (400+)',
    channelCount: 418,
    dateAdded: '22.07.2026',
    isSystem: true,
    description: 'Офіційні національні, інформаційні, розважальні та регіональні канали України.',
    category: 'Національні',
  },
  {
    id: 'pl-ru-catalog',
    name: 'Каталог Російськомовних Каналів (500+)',
    channelCount: 505,
    dateAdded: '22.07.2026',
    isSystem: true,
    description: 'Великий вибір кіно, розважальних, спортивних та музичних каналів.',
    category: 'Російські',
  },
  {
    id: 'pl-news-sports',
    name: 'Новини & Спорт 4K / HD',
    channelCount: 84,
    dateAdded: '22.07.2026',
    isSystem: true,
    description: 'Оперативні новини 24/7 та спортивні трансляції високої чіткості.',
    category: 'Спорт',
  },
  {
    id: 'pl-cinema-4k',
    name: 'Кінозал Кожухівка 4K Ultra HD',
    channelCount: 120,
    dateAdded: '22.07.2026',
    isSystem: true,
    description: 'Преміальні фільми, серіали та документальні стрічки.',
    category: 'Кіно та Серіали',
  },
];

// Generate EPG schedule for a given channel
export function generateEPGForChannel(channelName: string): EPGProgram[] {
  const currentHour = new Date().getHours();
  const formatTime = (h: number) => `${String((h + 24) % 24).padStart(2, '0')}:00`;

  return [
    {
      id: 'epg-1',
      channelId: channelName,
      title: 'Ранкове Шоу "Світанок Кожухівка"',
      description: 'Ранковий інформаційно-розважальний блок з гостями у студії, прогнозом погоди та бадьорою музикою.',
      startTime: formatTime(currentHour - 2),
      endTime: formatTime(currentHour - 1),
      progressPercent: 100,
      isLive: false,
    },
    {
      id: 'epg-2',
      channelId: channelName,
      title: 'Новини & Оперативне зведення',
      description: 'Головні події України та світу за останній час, репортажі з місця подій, оперативні інтерв’ю.',
      startTime: formatTime(currentHour - 1),
      endTime: formatTime(currentHour),
      progressPercent: 100,
      isLive: false,
    },
    {
      id: 'epg-3',
      channelId: channelName,
      title: `Прямий Ефір: ${channelName} - Спеціальний Випуск`,
      description: 'Головна телевізійна трансляція сьогоднішнього дня. Аналітика, спецрепортажі та коментарі експертів.',
      startTime: formatTime(currentHour),
      endTime: formatTime(currentHour + 2),
      progressPercent: 45,
      isLive: true,
    },
    {
      id: 'epg-4',
      channelId: channelName,
      title: 'Художній Фільм "Вечірній Сеанс"',
      description: 'Захоплююча кінострічка високої якості. Сюжет, що тримає в напрузі до останньої хвилини.',
      startTime: formatTime(currentHour + 2),
      endTime: formatTime(currentHour + 4),
      progressPercent: 0,
      isLive: false,
    },
    {
      id: 'epg-5',
      channelId: channelName,
      title: 'Нічний Музичний Марафон',
      description: 'Найкращі музичні кліпи, живе виконання та розслабляюча атмосферна музика на ніч.',
      startTime: formatTime(currentHour + 4),
      endTime: formatTime(currentHour + 7),
      progressPercent: 0,
      isLive: false,
    },
  ];
}
