import React, { useState } from 'react';
import {
  Settings,
  Palette,
  HardDrive,
  Trash2,
  Download,
  Upload,
  Zap,
  Info,
  Key,
  Shield,
  Check,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ThemeMode, UserPreferences } from '../types';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onClearCache: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
  totalChannelsCount: number;
  favoritesCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onClearCache,
  onExportBackup,
  onImportBackup,
  totalChannelsCount,
  favoritesCount,
}) => {
  const [backupJsonInput, setBackupJsonInput] = useState('');
  const [showBackupArea, setShowBackupArea] = useState(false);
  const [importStatusMsg, setImportStatusMsg] = useState('');

  const themes: { mode: ThemeMode; name: string; desc: string; color: string }[] = [
    { mode: 'dark', name: 'Dark Midnight', desc: 'Стандартна темна збалансована тема', color: '#3b82f6' },
    { mode: 'light', name: 'Light Day', desc: 'Чиста світла тема для денного перегляду', color: '#2563eb' },
    { mode: 'blue', name: 'Cyber Blue', desc: 'Неонова блакитна атмосфера', color: '#06b6d4' },
    { mode: 'emerald', name: 'Emerald Energy', desc: 'Енергійна смарагдова тема', color: '#10b981' },
    { mode: 'sunset', name: 'Sunset Glow', desc: 'Затишні сутінкові відтінки', color: '#f97316' },
    { mode: 'oled', name: 'OLED Pitch Black', desc: 'Глибокий чорний колір для збереження заряду', color: '#e11d48' },
  ];

  const handleImportJson = () => {
    if (!backupJsonInput.trim()) return;
    try {
      onImportBackup(backupJsonInput.trim());
      setImportStatusMsg('Дані успішно відновлено!');
      setBackupJsonInput('');
      setTimeout(() => setImportStatusMsg(''), 3000);
    } catch (e) {
      setImportStatusMsg('Помилка читання JSON файлу бэкапу.');
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[var(--accent)]" />
          Налаштування Навколишнього Середовища
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Керуйте колірними темами, оптимізацією відтворення HLS та пам’яттю додатка.
        </p>
      </div>

      {/* 1. Theme Selector Section */}
      <div className="p-6 rounded-3xl custom-card border border-[var(--border-color)] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
          <Palette className="w-4 h-4 text-[var(--accent)]" />
          <span>Колірна Тема Інтерфейсу</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.mode}
              onClick={() => onUpdatePreferences({ ...preferences, theme: t.mode })}
              className={`p-4 rounded-2xl border text-left transition-all ${
                preferences.theme === t.mode
                  ? 'bg-[var(--accent-glow)] border-[var(--accent)] ring-2 ring-[var(--accent)]'
                  : 'bg-[var(--bg-main)] border-[var(--border-color)] hover:border-[var(--accent)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }} />
                {preferences.theme === t.mode && <Check className="w-4 h-4 text-[var(--accent)]" />}
              </div>
              <div className="font-bold text-xs text-[var(--text-primary)]">{t.name}</div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Playback & Battery Saver Settings */}
      <div className="p-6 rounded-3xl custom-card border border-[var(--border-color)] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Параметри Відтворення & Енергозбереження</span>
        </div>

        <div className="space-y-3 divide-y divide-[var(--border-color)]">
          
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Режим "Без Світла / На Батареї"
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Зменшує навантаження на графічний процесор та оптимізує енергоспоживання під час відключень світла.
              </p>
            </div>
            <button
              onClick={() =>
                onUpdatePreferences({ ...preferences, powerSaveMode: !preferences.powerSaveMode })
              }
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                preferences.powerSaveMode ? 'bg-amber-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.powerSaveMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Автостарт Трансляції</div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Автоматично вмикати відтворення при виборі каналу.
              </p>
            </div>
            <button
              onClick={() =>
                onUpdatePreferences({ ...preferences, autoplay: !preferences.autoplay })
              }
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                preferences.autoplay ? 'bg-[var(--accent)]' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.autoplay ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Буфер Потоку HLS</div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Розмір попереднього завантаження у секундах для нестабільного зв’язку.
              </p>
            </div>
            <select
              value={preferences.bufferLengthSec}
              onChange={(e) =>
                onUpdatePreferences({ ...preferences, bufferLengthSec: Number(e.target.value) })
              }
              className="px-3 py-1.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
            >
              <option value={15}>15 секунд (Швидкий старт)</option>
              <option value={30}>30 секунд (Стандарт)</option>
              <option value={60}>60 секунд (Надійний буфер)</option>
            </select>
          </div>

        </div>
      </div>

      {/* 3. Data & Storage Section */}
      <div className="p-6 rounded-3xl custom-card border border-[var(--border-color)] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>Пам’ять & Резервне Копіювання</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportBackup}
            className="px-4 py-2.5 rounded-2xl bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-bold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[var(--accent)]" />
            <span>Експорт Резервної Копії (JSON)</span>
          </button>

          <button
            onClick={() => setShowBackupArea(!showBackupArea)}
            className="px-4 py-2.5 rounded-2xl bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-bold transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Імпорт Резервної Копії</span>
          </button>

          <button
            onClick={onClearCache}
            className="px-4 py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Очистити Кєш та Дані</span>
          </button>
        </div>

        {showBackupArea && (
          <div className="pt-3 space-y-2 animate-in fade-in">
            <textarea
              rows={4}
              value={backupJsonInput}
              onChange={(e) => setBackupJsonInput(e.target.value)}
              placeholder="Вставити текст резервної копії JSON..."
              className="w-full p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono"
            />
            <button
              onClick={handleImportJson}
              className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-bold"
            >
              Відновити Дані
            </button>
            {importStatusMsg && (
              <p className="text-xs font-bold text-emerald-400">{importStatusMsg}</p>
            )}
          </div>
        )}
      </div>

      {/* 4. Keyboard Shortcuts Sheet */}
      <div className="p-6 rounded-3xl custom-card border border-[var(--border-color)] space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
          <Key className="w-4 h-4 text-purple-400" />
          <span>Гарячі Клавіші Управління</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
            <div className="font-mono font-bold text-[var(--accent)]">Пробіл / K</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Пауза / Відтворення</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
            <div className="font-mono font-bold text-[var(--accent)]">F</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Повний екран</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
            <div className="font-mono font-bold text-[var(--accent)]">M</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Вимкнути звук</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
            <div className="font-mono font-bold text-[var(--accent)]">Ctrl + K</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Швидкий пошук</div>
          </div>
        </div>
      </div>

      {/* 5. App Info & Version Footer */}
      <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[var(--accent)] shrink-0" />
          <div>
            <div className="font-extrabold text-[var(--text-primary)]">Кожухівка ТВ v2.4.0</div>
            <div>Професійний Live TV сервіс • Вільний доступ без реєстрації</div>
          </div>
        </div>
        <div className="text-right font-mono text-[11px]">
          Всього каналів: {totalChannelsCount} | Обрані: {favoritesCount}
        </div>
      </div>

    </div>
  );
};
