export type ThemeMode = 'dark' | 'light' | 'blue' | 'emerald' | 'sunset' | 'oled';

export type ChannelCategory =
  | 'Всі'
  | 'Національні'
  | 'Новини'
  | 'Кіно та Серіали'
  | 'Спорт'
  | 'Музика'
  | 'Дитячі'
  | 'Пізнавальні'
  | 'Регіональні'
  | 'Російські'
  | 'Закордонні'
  | 'Вебкамери'
  | 'Мої Канали';

export type ChannelLanguage = 'UA' | 'RU' | 'EN' | 'PL' | 'DE' | 'FR' | 'Інше';

export type ChannelQuality = '4K' | 'FHD' | 'HD' | 'SD';

export interface EPGProgram {
  id: string;
  channelId: string;
  title: string;
  description: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  progressPercent: number;
  isLive: boolean;
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: ChannelCategory;
  language: ChannelLanguage;
  streamUrl: string;
  quality: ChannelQuality;
  isFavorite?: boolean;
  isCustom?: boolean;
  epgId?: string;
  currentProgram?: string;
  nextProgram?: string;
  viewCount?: number;
  groupTitle?: string;
}

export interface Playlist {
  id: string;
  name: string;
  url?: string;
  channelCount: number;
  dateAdded: string;
  isSystem?: boolean;
  description?: string;
  category?: string;
}

export interface UserPreferences {
  theme: ThemeMode;
  autoplay: boolean;
  powerSaveMode: boolean; // "Без світла / На батареї"
  defaultQuality: 'auto' | '1080p' | '720p' | '480p';
  volume: number;
  muted: boolean;
  bufferLengthSec: number;
}
