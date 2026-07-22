import React, { useState } from 'react';
import { Play, Sparkles, Flame, History, ListFilter, ArrowRight, Heart, Layers, Radio } from 'lucide-react';
import { Channel, ChannelCategory, Playlist, UserPreferences } from '../types';
import { HeroBanner } from './HeroBanner';
import { ChannelCard } from './ChannelCard';

interface HomeScreenViewProps {
  channels: Channel[];
  playlists: Playlist[];
  recentlyWatchedIds: string[];
  favoriteIds: string[];
  onPlayChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  onOpenEPG: (channel: Channel) => void;
  activePlayingChannelId?: string;
  preferences: UserPreferences;
  onOpenImportModal: () => void;
  onNavigateTab: (tab: 'home' | 'search' | 'playlists' | 'manage' | 'settings') => void;
  onSelectCategory: (category: ChannelCategory) => void;
}

export const HomeScreenView: React.FC<HomeScreenViewProps> = ({
  channels,
  playlists,
  recentlyWatchedIds,
  favoriteIds,
  onPlayChannel,
  onToggleFavorite,
  onOpenEPG,
  activePlayingChannelId,
  preferences,
  onOpenImportModal,
  onNavigateTab,
  onSelectCategory,
}) => {
  const [selectedCategory, setSelectedCategoryFilter] = useState<ChannelCategory>('Всі');

  const categoriesList: ChannelCategory[] = [
    'Всі',
    'Національні',
    'Новини',
    'Кіно та Серіали',
    'Спорт',
    'Музика',
    'Дитячі',
    'Пізнавальні',
    'Регіональні',
    'Російські',
    'Закордонні',
    'Вебкамери',
  ];

  const uaChannels = channels.filter((c) => c.language === 'UA');
  const ruChannels = channels.filter((c) => c.language === 'RU');

  // Recently watched channels lookup
  const recentlyWatchedChannels = recentlyWatchedIds
    .map((id) => channels.find((c) => c.id === id))
    .filter((c): c is Channel => Boolean(c));

  // Category filtered channels
  const displayedChannels = channels
    .filter((c) => (selectedCategory === 'Всі' ? true : c.category === selectedCategory))
    .slice(0, 24);

  // Top popular channels
  const popularChannels = [...channels]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 12);

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Welcome Banner */}
      <HeroBanner
        totalChannels={channels.length}
        uaChannelsCount={uaChannels.length}
        ruChannelsCount={ruChannels.length}
        onPlayChannel={onPlayChannel}
        topChannel={channels[0]}
        powerSaveMode={preferences.powerSaveMode}
        onOpenImportModal={onOpenImportModal}
        onNavigateTab={onNavigateTab}
      />

      {/* Horizontal Category Chips Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-[var(--accent)]" />
            Категорії Телеканалів
          </h3>
          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            Всі Категорії <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategoryFilter(cat);
                if (cat !== 'Всі') {
                  onSelectCategory(cat);
                }
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Watched Horizontal Scroll */}
      {recentlyWatchedChannels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              Нещодавно Переглянуті
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">
              {recentlyWatchedChannels.length} каналів
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyWatchedChannels.map((ch) => (
              <ChannelCard
                key={`recent-${ch.id}`}
                channel={ch}
                onPlay={onPlayChannel}
                onToggleFavorite={onToggleFavorite}
                onOpenEPG={onOpenEPG}
                isFavorite={favoriteIds.includes(ch.id)}
                isPlaying={ch.id === activePlayingChannelId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Discover Featured Playlists */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Відкрийте M3U Плейлисти
          </h3>
          <button
            onClick={() => onNavigateTab('playlists')}
            className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            Переглянути всі <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onNavigateTab('playlists')}
              className="p-5 rounded-2xl custom-card cursor-pointer space-y-3 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--badge-bg)] text-[var(--accent)] text-xs font-bold">
                  {pl.channelCount} каналів
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">{pl.dateAdded}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-primary)] line-clamp-1">{pl.name}</h4>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{pl.description}</p>
              </div>
              <div className="text-xs font-bold text-[var(--accent)] flex items-center gap-1">
                <span>Відкрити плейлист</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Channels Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500 fill-red-500" />
            Популярні Канали у Прямому Ефірі
          </h3>
          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            Дивитися всі ({channels.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularChannels.map((ch) => (
            <ChannelCard
              key={`pop-${ch.id}`}
              channel={ch}
              onPlay={onPlayChannel}
              onToggleFavorite={onToggleFavorite}
              onOpenEPG={onOpenEPG}
              isFavorite={favoriteIds.includes(ch.id)}
              isPlaying={ch.id === activePlayingChannelId}
            />
          ))}
        </div>
      </div>

      {/* Main Catalog Snippet Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Каталог: {selectedCategory} ({displayedChannels.length})
          </h3>
          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            Розширений каталог & Пошук
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedChannels.map((ch) => (
            <ChannelCard
              key={`cat-${ch.id}`}
              channel={ch}
              onPlay={onPlayChannel}
              onToggleFavorite={onToggleFavorite}
              onOpenEPG={onOpenEPG}
              isFavorite={favoriteIds.includes(ch.id)}
              isPlaying={ch.id === activePlayingChannelId}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
