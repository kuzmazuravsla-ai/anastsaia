import React from 'react';
import { Tv, Play, Shield, WifiOff, Zap, Sparkles, Layers, ListFilter } from 'lucide-react';
import { Channel } from '../types';

interface HeroBannerProps {
  totalChannels: number;
  uaChannelsCount: number;
  ruChannelsCount: number;
  onPlayChannel: (channel: Channel) => void;
  topChannel?: Channel;
  powerSaveMode: boolean;
  onOpenImportModal: () => void;
  onNavigateTab: (tab: 'home' | 'search' | 'playlists' | 'manage' | 'settings') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  totalChannels,
  uaChannelsCount,
  ruChannelsCount,
  onPlayChannel,
  topChannel,
  powerSaveMode,
  onOpenImportModal,
  onNavigateTab,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl custom-card p-6 sm:p-8 mb-8 border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-main)] to-[var(--bg-card)] shadow-2xl">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Column: Heading & Value Proposition */}
        <div className="space-y-4 max-w-2xl text-center lg:text-left">
          
          {/* Status Badges Row */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20">
              <Shield className="w-3.5 h-3.5" />
              100% Безкоштовно
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Без реєстрації
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Tv className="w-3.5 h-3.5" />
              400+ UA каналів
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">
              <Layers className="w-3.5 h-3.5" />
              500+ RU каналів
            </span>
            {powerSaveMode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                Без світла / Акумулятор
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)]">
            Онлайн Телебачення <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Кожухівка ТВ
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Дивіться прямий ефір національних, інформаційних, спортивних та фільмових каналів у високій якості.
            Підтримання HLS.js, завантаження власних M3U плейлистів та зручний EPG телегід.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            {topChannel && (
              <button
                onClick={() => onPlayChannel(topChannel)}
                className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-bold shadow-xl shadow-[var(--accent-glow)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                id="hero-play-top-channel"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                <span>Дивитися {topChannel.name}</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('search')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card-hover)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] text-sm font-semibold transition-all"
              id="hero-browse-all-channels"
            >
              <ListFilter className="w-4 h-4 text-[var(--accent)]" />
              <span>Весь Каталог ({totalChannels})</span>
            </button>

            <button
              onClick={onOpenImportModal}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 text-blue-300 hover:text-white text-sm font-semibold transition-all"
              id="hero-add-m3u-btn"
            >
              <span>+ Свій M3U Плейлист</span>
            </button>
          </div>

        </div>

        {/* Right Column: Interactive Quick Stats Card */}
        <div className="w-full lg:w-80 glass-panel rounded-2xl p-5 border border-[var(--border-color)] space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center justify-between">
            <span>Статистика Сервісу</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
              <div className="text-xs text-[var(--text-secondary)]">Українські</div>
              <div className="text-xl font-black text-blue-400">{uaChannelsCount}+</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
              <div className="text-xs text-[var(--text-secondary)]">Російські/Інш.</div>
              <div className="text-xl font-black text-purple-400">{ruChannelsCount}+</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
              <div className="text-xs text-[var(--text-secondary)]">Якість</div>
              <div className="text-xl font-black text-emerald-400">4K / FHD</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
              <div className="text-xs text-[var(--text-secondary)]">Формат</div>
              <div className="text-xl font-black text-cyan-400">HLS / M3U8</div>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              Працює без Wi-Fi (LTE)
            </span>
            <span className="font-bold text-[var(--accent)]">v2.4 Live</span>
          </div>
        </div>

      </div>
    </div>
  );
};
