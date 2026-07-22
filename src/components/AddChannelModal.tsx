import React, { useState } from 'react';
import { X, Plus, Tv, Globe, Radio } from 'lucide-react';
import { Channel, ChannelCategory, ChannelLanguage, ChannelQuality } from '../types';

interface AddChannelModalProps {
  onClose: () => void;
  onAddChannel: (channel: Channel) => void;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({
  onClose,
  onAddChannel,
}) => {
  const [name, setName] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [logo, setLogo] = useState('');
  const [category, setCategory] = useState<ChannelCategory>('Мої Канали');
  const [language, setLanguage] = useState<ChannelLanguage>('UA');
  const [quality, setQuality] = useState<ChannelQuality>('FHD');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !streamUrl.trim()) {
      setErrorMsg('Назва каналу та URL потоку є обов’язковими.');
      return;
    }

    const newChannel: Channel = {
      id: `custom-single-${Date.now()}`,
      name: name.trim(),
      streamUrl: streamUrl.trim(),
      logo: logo.trim() || `https://picsum.photos/seed/${encodeURIComponent(name.trim())}/120/120`,
      category,
      language,
      quality,
      isCustom: true,
      isFavorite: false,
      currentProgram: 'Користувацька трансляція',
      nextProgram: 'Прямий ефір',
      viewCount: 1,
    };

    onAddChannel(newChannel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl glass-panel border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl p-6 overflow-hidden space-y-6"
        id="add-channel-modal-content"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Додати Канал Вручну</h2>
              <p className="text-xs text-[var(--text-secondary)]">Вкажіть HLS/M3U8 потік та параметри каналу</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Назва Телеканалу *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Наприклад: Кожухівка Спорт HD"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              URL HLS Потоку (.m3u8) *
            </label>
            <input
              type="url"
              required
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="https://example.com/live/stream.m3u8"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              URL Логотипу (Необов’язково)
            </label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Категорія
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="Національні">Національні</option>
                <option value="Новини">Новини</option>
                <option value="Кіно та Серіали">Кіно</option>
                <option value="Спорт">Спорт</option>
                <option value="Музика">Музика</option>
                <option value="Дитячі">Дитячі</option>
                <option value="Мої Канали">Мої Канали</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Мова
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="UA">Українська (UA)</option>
                <option value="RU">Російська (RU)</option>
                <option value="EN">Англійська (EN)</option>
                <option value="PL">Польська (PL)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Якість
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="4K">4K Ultra HD</option>
                <option value="FHD">1080p FHD</option>
                <option value="HD">720p HD</option>
                <option value="SD">480p SD</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Зберегти та Додати
          </button>
        </form>
      </div>
    </div>
  );
};
