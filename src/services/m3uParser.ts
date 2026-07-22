import { Channel, ChannelCategory, ChannelLanguage, ChannelQuality } from '../types';

export interface ParsedM3UResult {
  title?: string;
  channels: Channel[];
}

export function parseM3UContent(m3uText: string, defaultSourceLabel = 'Імпортований Плейлист'): ParsedM3UResult {
  const lines = m3uText.split(/\r?\n/);
  const channels: Channel[] = [];

  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      // Parse EXTINF attributes
      // e.g. #EXTINF:-1 tvg-id="123" tvg-name="1+1" tvg-logo="http://..." group-title="Новини", 1+1 Україна
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i) || line.match(/tvg-logo='([^']+)'/i);
      const groupMatch = line.match(/group-title="([^"]+)"/i) || line.match(/group-title='([^']+)'/i);
      const epgMatch = line.match(/tvg-id="([^"]+)"/i);

      // Extract channel display name after the last comma
      const commaIndex = line.lastIndexOf(',');
      const name = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Без назви';

      let rawCategory = groupMatch ? groupMatch[1].trim() : 'Мої Канали';
      let category: ChannelCategory = mapCategory(rawCategory);

      let quality: ChannelQuality = 'HD';
      if (name.toUpperCase().includes('4K') || name.toUpperCase().includes('UHD')) {
        quality = '4K';
      } else if (name.toUpperCase().includes('FHD') || name.toUpperCase().includes('1080')) {
        quality = 'FHD';
      } else if (name.toUpperCase().includes('SD') || name.toUpperCase().includes('576')) {
        quality = 'SD';
      }

      let language: ChannelLanguage = 'UA';
      if (rawCategory.toLowerCase().includes('ru') || name.toLowerCase().includes('ru') || rawCategory.toLowerCase().includes('росс')) {
        language = 'RU';
      } else if (rawCategory.toLowerCase().includes('en') || name.toLowerCase().includes('en') || rawCategory.toLowerCase().includes('news')) {
        language = 'EN';
      }

      currentChannel = {
        name,
        category,
        language,
        quality,
        logo: logoMatch ? logoMatch[1] : `https://picsum.photos/seed/${encodeURIComponent(name)}/120/120`,
        epgId: epgMatch ? epgMatch[1] : undefined,
        isCustom: true,
        isFavorite: false,
        groupTitle: rawCategory,
        currentProgram: 'Трансляція M3U Плейлиста',
        nextProgram: 'Програма передач оновлюється',
        viewCount: 1,
      };
    } else if (line.startsWith('http://') || line.startsWith('https://') || line.endsWith('.m3u8') || line.endsWith('.ts')) {
      if (currentChannel.name) {
        channels.push({
          id: `custom-${Date.now()}-${channels.length + 1}`,
          name: currentChannel.name,
          category: currentChannel.category || 'Мої Канали',
          language: currentChannel.language || 'UA',
          quality: currentChannel.quality || 'HD',
          logo: currentChannel.logo || 'https://picsum.photos/seed/custom/120/120',
          streamUrl: line,
          epgId: currentChannel.epgId,
          isCustom: true,
          isFavorite: false,
          groupTitle: currentChannel.groupTitle,
          currentProgram: currentChannel.currentProgram,
          nextProgram: currentChannel.nextProgram,
          viewCount: 1,
        });
        currentChannel = {};
      }
    }
  }

  return {
    title: defaultSourceLabel,
    channels,
  };
}

function mapCategory(rawGroup: string): ChannelCategory {
  const g = rawGroup.toLowerCase();
  if (g.includes('новин') || g.includes('news')) return 'Новини';
  if (g.includes('кіно') || g.includes('фильм') || g.includes('movie') || g.includes('cinema')) return 'Кіно та Серіали';
  if (g.includes('спорт') || g.includes('sport')) return 'Спорт';
  if (g.includes('музык') || g.includes('музик') || g.includes('music')) return 'Музика';
  if (g.includes('детск') || g.includes('дитяч') || g.includes('kids') || g.includes('cartoon')) return 'Дитячі';
  if (g.includes('познавательн') || g.includes('пізнавальн') || g.includes('doc')) return 'Пізнавальні';
  if (g.includes('регион') || g.includes('регіон') || g.includes('местн')) return 'Регіональні';
  if (g.includes('росс') || g.includes('рус')) return 'Російські';
  if (g.includes('зарубеж') || g.includes('закордон') || g.includes('world')) return 'Закордонні';
  if (g.includes('камер') || g.includes('cam')) return 'Вебкамери';
  return 'Мої Канали';
}
