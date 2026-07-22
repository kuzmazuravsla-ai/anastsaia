import React from 'react';
import { Plus, SlidersHorizontal, Trash2, Edit3, Download, RefreshCw, Tv, ExternalLink } from 'lucide-react';
import { Channel } from '../types';

interface ManageChannelsViewProps {
  customChannels: Channel[];
  onOpenAddModal: () => void;
  onDeleteChannel: (channelId: string) => void;
  onExportM3U: () => void;
  onResetCatalog: () => void;
  onPlayChannel: (channel: Channel) => void;
}

export const ManageChannelsView: React.FC<ManageChannelsViewProps> = ({
  customChannels,
  onOpenAddModal,
  onDeleteChannel,
  onExportM3U,
  onResetCatalog,
  onPlayChannel,
}) => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar */}
      <div className="p-8 rounded-3xl custom-card border border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-main)] to-[var(--bg-card)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Власні HLS Канали
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
            Управління Користувацькими Каналами
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-xl">
            Додавайте посилання на власні стріми HLS/M3U8, редагуйте параметри або експортуйте свій список каналів у форматі M3U.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportM3U}
            className="px-4 py-2.5 rounded-2xl bg-[var(--bg-card-hover)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-bold transition-all flex items-center gap-2"
            title="Експортувати канали в файл .m3u"
          >
            <Download className="w-4 h-4 text-[var(--accent)]" />
            <span>Експорт M3U</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-6 py-2.5 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-extrabold shadow-xl shadow-[var(--accent-glow)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Додати Канал</span>
          </button>
        </div>
      </div>

      {/* Custom Channels Table / List */}
      {customChannels.length > 0 ? (
        <div className="rounded-3xl custom-card border border-[var(--border-color)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Список доданих каналів ({customChannels.length})
            </span>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {customChannels.map((ch) => (
              <div
                key={ch.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-10 h-10 rounded-xl object-contain bg-[var(--bg-main)] p-1 border border-[var(--border-color)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(ch.name)}/120/120`;
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                      {ch.name}
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--badge-bg)] text-[var(--accent)]">
                        {ch.quality}
                      </span>
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] truncate max-w-xs sm:max-w-md">
                      {ch.streamUrl}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onPlayChannel(ch)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    Тест
                  </button>

                  <button
                    onClick={() => onDeleteChannel(ch.id)}
                    className="p-1.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Видалити канал"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center custom-card rounded-3xl space-y-4 border border-[var(--border-color)]">
          <SlidersHorizontal className="w-12 h-12 text-[var(--text-secondary)] mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Немає власних каналів</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              Ви ще не додали жодного власного каналу. Додайте посилання вручну або завантажте M3U плейлист.
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="px-6 py-2.5 rounded-2xl bg-[var(--accent)] text-white text-xs font-bold"
          >
            + Додати первинний канал
          </button>
        </div>
      )}

      {/* Restore Default Catalog Box */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-amber-300">Відновлення Заводського Каталогу</h4>
          <p className="text-xs text-amber-200/80">
            Скинути додаткові налаштування та повернути стандартний список 900+ каналів України та світу.
          </p>
        </div>

        <button
          onClick={onResetCatalog}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <RefreshCw className="w-4 h-4" />
          Перезавантажити Каталог
        </button>
      </div>

    </div>
  );
};
