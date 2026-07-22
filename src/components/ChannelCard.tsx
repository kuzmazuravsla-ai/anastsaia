import React from 'react';
import { Play, Heart, Calendar, Radio, Sparkles } from 'lucide-react';
import { Channel } from '../types';

interface ChannelCardProps {
  channel: Channel;
  onPlay: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  onOpenEPG: (channel: Channel) => void;
  isFavorite: boolean;
  isPlaying?: boolean;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onPlay,
  onToggleFavorite,
  onOpenEPG,
  isFavorite,
  isPlaying,
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-4 custom-card transition-all duration-300 hover:scale-[1.02] ${
        isPlaying
          ? 'ring-2 ring-[var(--accent)] bg-[var(--bg-card-hover)] shadow-xl shadow-[var(--accent-glow)]'
          : ''
      }`}
      id={`channel-card-${channel.id}`}
    >
      {/* Top Bar: Badges & Favorite Toggle */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Quality Tag */}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider ${
              channel.quality === '4K'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : channel.quality === 'FHD'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}
          >
            {channel.quality}
          </span>

          {/* Language Flag */}
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--badge-bg)] text-[var(--accent)] uppercase">
            {channel.language}
          </span>

          {channel.isCustom && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
              M3U
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(channel.id);
          }}
          className={`p-1.5 rounded-full transition-all ${
            isFavorite
              ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20 scale-110'
              : 'text-[var(--text-secondary)] hover:text-red-400 hover:bg-[var(--bg-main)]'
          }`}
          title={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
          id={`fav-btn-${channel.id}`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Main Content: Logo & Name */}
      <div
        className="cursor-pointer space-y-3"
        onClick={() => onPlay(channel)}
      >
        <div className="relative aspect-video w-full rounded-xl bg-[var(--bg-main)] overflow-hidden border border-[var(--border-color)] flex items-center justify-center p-2 group-hover:border-[var(--accent)] transition-colors">
          <img
            src={channel.logo}
            alt={channel.name}
            className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback placeholder if image link fails
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(channel.name)}/120/120`;
            }}
          />

          {/* Play Overlay Button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white ml-1" />
            </div>
          </div>

          {isPlaying && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold shadow animate-pulse">
              <Radio className="w-3 h-3" />
              В ЕФІРІ
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
            {channel.name}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">
            {channel.currentProgram || 'Прямий Ефір Телеканалу'}
          </p>
        </div>
      </div>

      {/* Footer: EPG Trigger & Quick Info */}
      <div className="mt-3 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span className="px-2 py-0.5 rounded bg-[var(--bg-main)] text-[10px] font-medium border border-[var(--border-color)]">
          {channel.category}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenEPG(channel);
          }}
          className="flex items-center gap-1 text-[11px] font-semibold hover:text-[var(--accent)] transition-colors"
          title="Переглянути телепрограму (EPG)"
          id={`epg-btn-${channel.id}`}
        >
          <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Телепрограма</span>
        </button>
      </div>

    </div>
  );
};
