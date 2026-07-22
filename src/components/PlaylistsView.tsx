import React from 'react';
import { Layers, Plus, ListVideo, ShieldCheck, Download, Trash2, ArrowRight } from 'lucide-react';
import { Playlist } from '../types';

interface PlaylistsViewProps {
  playlists: Playlist[];
  onOpenImportModal: () => void;
  onSelectPlaylistCategory: (category: string) => void;
  onDeleteUserPlaylist: (id: string) => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  onOpenImportModal,
  onSelectPlaylistCategory,
  onDeleteUserPlaylist,
}) => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl custom-card border border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-main)] to-[var(--bg-card)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <Layers className="w-3.5 h-3.5" />
            IPTV & M3U8 Плейлисти
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
            Керування Плейлистами Кожухівка ТВ
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-xl">
            Завантажуйте власні списки телеканалів M3U/M3U8 або обирайте з вбудованої бібліотеки національних та закордонних мовників.
          </p>
        </div>

        <button
          onClick={onOpenImportModal}
          className="px-6 py-3 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-extrabold shadow-xl shadow-[var(--accent-glow)] flex items-center gap-2 whitespace-nowrap"
          id="btn-playlists-import-modal"
        >
          <Plus className="w-4 h-4" />
          <span>+ Імпортувати M3U Плейлист</span>
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            className="p-6 rounded-3xl custom-card border border-[var(--border-color)] space-y-4 hover:border-[var(--accent)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    pl.isSystem
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                      : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                  }`}
                >
                  {pl.isSystem ? 'Системний Плейлист' : 'Власний M3U'}
                </span>

                <span className="text-xs text-[var(--text-secondary)]">{pl.dateAdded}</span>
              </div>

              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">{pl.name}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{pl.description}</p>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
              <span className="text-xs font-extrabold text-[var(--accent)] flex items-center gap-1">
                <ListVideo className="w-4 h-4" />
                {pl.channelCount} каналів
              </span>

              <div className="flex items-center gap-2">
                {!pl.isSystem && (
                  <button
                    onClick={() => onDeleteUserPlaylist(pl.id)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Видалити плейлист"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onSelectPlaylistCategory(pl.category || 'Всі')}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-card-hover)] hover:bg-[var(--accent)] text-[var(--text-primary)] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Дивитися канали</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
