import React, { useState, useMemo } from 'react';
import { Search, Filter, Heart, Sparkles, X, Tv, RefreshCw } from 'lucide-react';
import { Channel, ChannelCategory, ChannelLanguage, ChannelQuality } from '../types';
import { ChannelCard } from './ChannelCard';

interface SearchCatalogViewProps {
  channels: Channel[];
  favoriteIds: string[];
  onPlayChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  onOpenEPG: (channel: Channel) => void;
  activePlayingChannelId?: string;
  initialCategory?: ChannelCategory;
}

export const SearchCatalogView: React.FC<SearchCatalogViewProps> = ({
  channels,
  favoriteIds,
  onPlayChannel,
  onToggleFavorite,
  onOpenEPG,
  activePlayingChannelId,
  initialCategory = 'Всі',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ChannelCategory>(initialCategory);
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [qualityFilter, setQualityFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

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
    'Мої Канали',
  ];

  // Filter channels dynamically
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      // 1. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = ch.name.toLowerCase().includes(query);
        const matchCat = ch.category.toLowerCase().includes(query);
        const matchProg = ch.currentProgram?.toLowerCase().includes(query);
        if (!matchName && !matchCat && !matchProg) return false;
      }

      // 2. Favorites only
      if (onlyFavorites && !favoriteIds.includes(ch.id)) return false;

      // 3. Category filter
      if (categoryFilter !== 'Всі' && ch.category !== categoryFilter) return false;

      // 4. Language filter
      if (languageFilter !== 'all' && ch.language !== languageFilter) return false;

      // 5. Quality filter
      if (qualityFilter !== 'all' && ch.quality !== qualityFilter) return false;

      return true;
    });
  }, [channels, searchQuery, categoryFilter, languageFilter, qualityFilter, onlyFavorites, favoriteIds]);

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('Всі');
    setLanguageFilter('all');
    setQualityFilter('all');
    setOnlyFavorites(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Search Section */}
      <div className="p-6 rounded-3xl custom-card space-y-4 border border-[var(--border-color)]">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук телеканалу, програми чи категорії (напр., 1+1, Новини, Setanta, 4K)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
            id="search-input-catalog"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Select */}
            <div className="flex items-center gap-1 bg-[var(--bg-main)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
              <Filter className="w-3.5 h-3.5 text-[var(--accent)]" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-[var(--text-primary)] focus:outline-none cursor-pointer"
                id="select-category-filter"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat} className="bg-[var(--bg-card)]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Select */}
            <div className="flex items-center gap-1 bg-[var(--bg-main)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
              <span className="text-xs font-bold text-[var(--text-secondary)]">Мова:</span>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-[var(--text-primary)] focus:outline-none cursor-pointer"
                id="select-language-filter"
              >
                <option value="all" className="bg-[var(--bg-card)]">Всі Мови</option>
                <option value="UA" className="bg-[var(--bg-card)]">Українська (UA)</option>
                <option value="RU" className="bg-[var(--bg-card)]">Російська (RU)</option>
                <option value="EN" className="bg-[var(--bg-card)]">Англійська (EN)</option>
                <option value="PL" className="bg-[var(--bg-card)]">Польська (PL)</option>
              </select>
            </div>

            {/* Quality Select */}
            <div className="flex items-center gap-1 bg-[var(--bg-main)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
              <span className="text-xs font-bold text-[var(--text-secondary)]">Якість:</span>
              <select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-[var(--text-primary)] focus:outline-none cursor-pointer"
                id="select-quality-filter"
              >
                <option value="all" className="bg-[var(--bg-card)]">Будь-яка</option>
                <option value="4K" className="bg-[var(--bg-card)]">4K Ultra HD</option>
                <option value="FHD" className="bg-[var(--bg-card)]">1080p FHD</option>
                <option value="HD" className="bg-[var(--bg-card)]">720p HD</option>
                <option value="SD" className="bg-[var(--bg-card)]">480p SD</option>
              </select>
            </div>

            {/* Favorites Toggle Button */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                onlyFavorites
                  ? 'bg-red-500/20 border-red-500/30 text-red-400'
                  : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-red-500 text-red-500' : ''}`} />
              Тільки Обрані ({favoriteIds.length})
            </button>
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)]"
            title="Скинути всі фільтри"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Скинути
          </button>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-semibold px-1">
        <span>Знайдено каналів: <strong className="text-[var(--text-primary)]">{filteredChannels.length}</strong></span>
        {onlyFavorites && <span className="text-red-400">Показано обрані канали</span>}
      </div>

      {/* Channel Grid */}
      {filteredChannels.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredChannels.map((ch) => (
            <ChannelCard
              key={`search-${ch.id}`}
              channel={ch}
              onPlay={onPlayChannel}
              onToggleFavorite={onToggleFavorite}
              onOpenEPG={onOpenEPG}
              isFavorite={favoriteIds.includes(ch.id)}
              isPlaying={ch.id === activePlayingChannelId}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center custom-card rounded-3xl space-y-3">
          <Tv className="w-12 h-12 text-[var(--text-secondary)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">Нічого не знайдено</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Спробуйте змінити пошуковий запит або скинути фільтри якості та мови.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-bold"
          >
            Скинути фільтри
          </button>
        </div>
      )}

    </div>
  );
};
