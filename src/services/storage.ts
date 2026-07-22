import { Channel, Playlist, UserPreferences } from '../types';
import { buildInitialChannels, INITIAL_PLAYLISTS } from '../data/mockChannels';

const STORAGE_KEYS = {
  PREFERENCES: 'kozhukhivka_tv_prefs_v1',
  FAVORITES: 'kozhukhivka_tv_favorites_v1',
  RECENTLY_WATCHED: 'kozhukhivka_tv_recently_v1',
  CUSTOM_CHANNELS: 'kozhukhivka_tv_custom_channels_v1',
  PLAYLISTS: 'kozhukhivka_tv_playlists_v1',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  autoplay: true,
  powerSaveMode: false,
  defaultQuality: 'auto',
  volume: 0.8,
  muted: false,
  bufferLengthSec: 30,
};

export function getStoredPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load preferences:', e);
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
}

export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load favorites:', e);
  }
  return [];
}

export function saveFavorites(favIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favIds));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
}

export function getStoredRecentlyWatched(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTLY_WATCHED);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load recent channels:', e);
  }
  return [];
}

export function addRecentlyWatched(channelId: string): string[] {
  try {
    const current = getStoredRecentlyWatched();
    const updated = [channelId, ...current.filter(id => id !== channelId)].slice(0, 15);
    localStorage.setItem(STORAGE_KEYS.RECENTLY_WATCHED, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to add recent channel:', e);
    return [];
  }
}

export function getStoredCustomChannels(): Channel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CHANNELS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom channels:', e);
  }
  return [];
}

export function saveCustomChannels(channels: Channel[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CHANNELS, JSON.stringify(channels));
  } catch (e) {
    console.error('Failed to save custom channels:', e);
  }
}

export function getStoredPlaylists(): Playlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
    if (raw) {
      const parsed: Playlist[] = JSON.parse(raw);
      return [...INITIAL_PLAYLISTS, ...parsed.filter(p => !p.isSystem)];
    }
  } catch (e) {
    console.error('Failed to load playlists:', e);
  }
  return INITIAL_PLAYLISTS;
}

export function savePlaylists(playlists: Playlist[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists.filter(p => !p.isSystem)));
  } catch (e) {
    console.error('Failed to save playlists:', e);
  }
}

export function clearAppCache(): void {
  localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  localStorage.removeItem(STORAGE_KEYS.RECENTLY_WATCHED);
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_CHANNELS);
  localStorage.removeItem(STORAGE_KEYS.PLAYLISTS);
  localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
}

export function exportUserData(channels: Channel[], favIds: string[], playlists: Playlist[]): string {
  const exportPayload = {
    appName: 'Кожухівка ТВ',
    exportDate: new Date().toISOString(),
    version: '2.4.0',
    favorites: favIds,
    customChannels: channels.filter(c => c.isCustom),
    userPlaylists: playlists.filter(p => !p.isSystem),
  };
  return JSON.stringify(exportPayload, null, 2);
}
