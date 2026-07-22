import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, FileText, Check, Plus, Layers, Sparkles } from 'lucide-react';
import { parseM3UContent } from '../services/m3uParser';
import { Channel, Playlist } from '../types';

interface PlaylistImportModalProps {
  onClose: () => void;
  onImportChannels: (newChannels: Channel[], playlistName: string) => void;
}

export const PlaylistImportModal: React.FC<PlaylistImportModalProps> = ({
  onClose,
  onImportChannels,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'text'>('url');
  const [playlistName, setPlaylistName] = useState('Мій M3U Плейлист');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle URL fetch & parse
  const handleFetchUrl = async () => {
    if (!urlInput.trim()) {
      setErrorMsg('Будь ласка, введіть посилання на M3U / M3U8 плейлист.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(urlInput.trim());
      if (!response.ok) {
        throw new Error(`Не вдалося завантажити M3U (Статус: ${response.status})`);
      }
      const text = await response.text();
      const parsed = parseM3UContent(text, playlistName);

      if (parsed.channels.length === 0) {
        setErrorMsg('Не знайдено каналів у наданому M3U файлі.');
      } else {
        onImportChannels(parsed.channels, playlistName);
        onClose();
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg(`Помилка завантаження. Спробуйте вставити вміст файлу вручну.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle File upload parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseM3UContent(content, file.name.replace(/\.[^/.]+$/, ''));
        if (parsed.channels.length > 0) {
          onImportChannels(parsed.channels, file.name);
          onClose();
        } else {
          setErrorMsg('Файл не містить валідних каналів M3U.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Handle Raw Text parse
  const handleTextParse = () => {
    if (!textInput.trim()) {
      setErrorMsg('Вставте вміст M3U файлу.');
      return;
    }
    const parsed = parseM3UContent(textInput, playlistName);
    if (parsed.channels.length > 0) {
      onImportChannels(parsed.channels, playlistName);
      onClose();
    } else {
      setErrorMsg('Вказаний текст не містить тегів #EXTINF або посилань.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-3xl glass-panel border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl p-6 overflow-hidden space-y-6"
        id="playlist-import-modal-content"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Імпорт M3U / M3U8 Плейлиста</h2>
              <p className="text-xs text-[var(--text-secondary)]">Додавайте власні канали та списки трансляцій</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)]"
            id="close-import-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
          <button
            onClick={() => { setActiveTab('url'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'url' ? 'bg-[var(--accent)] text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            За URL
          </button>

          <button
            onClick={() => { setActiveTab('file'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'file' ? 'bg-[var(--accent)] text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Upload className="w-4 h-4" />
            З Файлу
          </button>

          <button
            onClick={() => { setActiveTab('text'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'text' ? 'bg-[var(--accent)] text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Вставити Текст
          </button>
        </div>

        {/* Playlist Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Назва Плейлиста
          </label>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            placeholder="Введіть назву..."
          />
        </div>

        {/* Tab Contents */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                URL Посилання (.m3u / .m3u8)
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/playlist.m3u"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <button
              onClick={handleFetchUrl}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              id="submit-m3u-url"
            >
              {isLoading ? (
                <span>Завантаження...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Імпортувати M3U Плейлист
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'file' && (
          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center w-full h-36 rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-main)] hover:border-[var(--accent)] cursor-pointer transition-colors p-4 text-center">
              <Upload className="w-8 h-8 text-[var(--accent)] mb-2" />
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Оберіть файл .m3u або .m3u8
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] mt-1">
                Перетягніть сюди або натисніть для вибору
              </span>
              <input
                type="file"
                accept=".m3u,.m3u8,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-3">
            <textarea
              rows={5}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`#EXTM3U\n#EXTINF:-1 tvg-logo="https://..." group-title="Новини", 1+1 Новини\nhttps://example.com/stream.m3u8`}
              className="w-full p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleTextParse}
              className="w-full py-3 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              id="submit-m3u-text"
            >
              <Plus className="w-4 h-4" />
              Обробити Текст та Додати Канали
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

      </div>
    </div>
  );
};
