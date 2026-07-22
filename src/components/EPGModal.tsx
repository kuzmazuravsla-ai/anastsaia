import React, { useState } from 'react';
import { X, Calendar, Clock, Bell, Check, Tv, Radio } from 'lucide-react';
import { Channel } from '../types';
import { generateEPGForChannel } from '../data/mockChannels';

interface EPGModalProps {
  channel: Channel | null;
  onClose: () => void;
  onPlayChannel: (channel: Channel) => void;
}

export const EPGModal: React.FC<EPGModalProps> = ({
  channel,
  onClose,
  onPlayChannel,
}) => {
  if (!channel) return null;

  const schedule = generateEPGForChannel(channel.name);
  const [reminders, setReminders] = useState<string[]>([]);

  const toggleReminder = (id: string) => {
    if (reminders.includes(id)) {
      setReminders(reminders.filter((r) => r !== id));
    } else {
      setReminders([...reminders, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-3xl glass-panel border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
        id="epg-modal-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-10 h-10 rounded-xl object-contain bg-[var(--bg-main)] p-1 border border-[var(--border-color)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(channel.name)}/120/120`;
              }}
            />
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                {channel.name}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--badge-bg)] text-[var(--accent)]">
                  {channel.quality}
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                Телепрограма EPG • Сьогодні
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors"
            id="close-epg-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {schedule.map((prog) => {
            const hasReminder = reminders.includes(prog.id);

            return (
              <div
                key={prog.id}
                className={`p-4 rounded-2xl border transition-all ${
                  prog.isLive
                    ? 'bg-[var(--accent-glow)] border-[var(--accent)] shadow-md'
                    : 'bg-[var(--bg-main)] border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--accent)] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {prog.startTime} - {prog.endTime}
                      </span>

                      {prog.isLive && (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                          <Radio className="w-2.5 h-2.5" /> В ЕФІРІ
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-[var(--text-primary)]">{prog.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{prog.description}</p>

                    {prog.isLive && (
                      <div className="mt-3 space-y-1">
                        <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                          <div
                            className="h-full bg-[var(--accent)] transition-all"
                            style={{ width: `${prog.progressPercent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)] text-right">
                          Завершиться за {Math.round((100 - prog.progressPercent) * 0.6)} хв
                        </div>
                      </div>
                    )}
                  </div>

                  {!prog.isLive && (
                    <button
                      onClick={() => toggleReminder(prog.id)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                        hasReminder
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                      }`}
                      title={hasReminder ? 'Нагадування встановлено' : 'Встановити нагадування'}
                    >
                      {hasReminder ? <Check className="w-4 h-4 text-amber-400" /> : <Bell className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">
            Синхронізовано з EPG сервером Кожухівка ТВ
          </span>

          <button
            onClick={() => {
              onPlayChannel(channel);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-all shadow-lg"
          >
            <Tv className="w-4 h-4" />
            <span>Увімкнути Канал</span>
          </button>
        </div>

      </div>
    </div>
  );
};
