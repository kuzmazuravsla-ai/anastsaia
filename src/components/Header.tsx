import React, { useState } from 'react';
import { Tv, Sparkles, Sun, Moon, Palette, Zap, Plus, Search, ShieldCheck, Heart } from 'lucide-react';
import { ThemeMode, UserPreferences } from '../types';

interface HeaderProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  totalChannelsCount: number;
  favoritesCount: number;
  onOpenImportModal: () => void;
  onOpenSearch: () => void;
  onNavigateTab: (tab: 'home' | 'search' | 'playlists' | 'manage' | 'settings') => void;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onUpdatePreferences,
  totalChannelsCount,
  favoritesCount,
  onOpenImportModal,
  onOpenSearch,
  onNavigateTab,
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);

  const themes: { mode: ThemeMode; label: string; colorBg: string; border: string }[] = [
    { mode: 'dark', label: 'Dark Midnight', colorBg: '#0b0f19', border: '#3b82f6' },
    { mode: 'light', label: 'Light Day', colorBg: '#f1f5f9', border: '#2563eb' },
    { mode: 'blue', label: 'Cyber Blue', colorBg: '#030712', border: '#06b6d4' },
    { mode: 'emerald', label: 'Emerald Energy', colorBg: '#022c22', border: '#10b981' },
    { mode: 'sunset', label: 'Sunset Glow', colorBg: '#180d1e', border: '#f97316' },
    { mode: 'oled', label: 'OLED Pitch Black', colorBg: '#000000', border: '#e11d48' },
  ];

  const togglePowerSave = () => {
    onUpdatePreferences({
      ...preferences,
      powerSaveMode: !preferences.powerSaveMode,
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border-color)] px-4 py-3 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Live Badge */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
            id="brand-header-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[var(--bg-main)] rounded-[10px] flex items-center justify-center">
                <Tv className="w-5 h-5 text-cyan-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  Кожухівка ТВ
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Безкоштовне Live ТБ • Без реєстрації</p>
            </div>
          </button>

          {/* Quick Stats Pills for Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => onNavigateTab('search')}
              className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)]"
              title="Пошук"
              id="mobile-search-btn"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenImportModal}
              className="p-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90"
              title="Додати M3U"
              id="mobile-import-btn"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls & Theme Bar */}
        <div className="flex items-center flex-wrap justify-end gap-2 w-full md:w-auto">
          
          {/* Channel Stats Badges */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1 font-semibold text-[var(--text-primary)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {totalChannelsCount} каналів
            </span>
            <span className="text-[var(--border-color)]">•</span>
            <button
              onClick={() => onNavigateTab('search')}
              className="flex items-center gap-1 hover:text-red-400 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              {favoritesCount} улюблені
            </button>
          </div>

          {/* Power Save / "Без світла" mode button */}
          <button
            onClick={togglePowerSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              preferences.powerSaveMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
            }`}
            title="Режим збереження енергії при відключенні світла або роботі від акумулятора"
            id="btn-power-save-toggle"
          >
            <Zap className={`w-3.5 h-3.5 ${preferences.powerSaveMode ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">
              {preferences.powerSaveMode ? 'Режим: Без світла / Акумулятор' : 'Нормальний режим'}
            </span>
            <span className="sm:hidden">{preferences.powerSaveMode ? 'Енергозбереження' : 'Енерго'}</span>
          </button>

          {/* Search Shortcut Button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all"
            id="btn-header-search-modal"
          >
            <Search className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Швидкий пошук...</span>
            <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
              Ctrl+K
            </kbd>
          </button>

          {/* Add Playlist / Channel Button */}
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            id="btn-header-import-m3u"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Імпорт M3U</span>
          </button>

          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
              title="Змінити колірну тему"
              id="btn-theme-picker-toggle"
            >
              <Palette className="w-4 h-4 text-[var(--accent)]" />
            </button>

            {showThemePicker && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-[var(--border-color)] animate-in fade-in zoom-in-95 duration-150"
                id="theme-picker-menu"
              >
                <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-2 py-1 mb-1">
                  Оберіть тему
                </div>
                <div className="space-y-1">
                  {themes.map((t) => (
                    <button
                      key={t.mode}
                      onClick={() => {
                        onUpdatePreferences({ ...preferences, theme: t.mode });
                        setShowThemePicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        preferences.theme === t.mode
                          ? 'bg-[var(--accent)] text-white shadow'
                          : 'hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)]'
                      }`}
                      id={`theme-option-${t.mode}`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: t.border }}
                        />
                        {t.label}
                      </span>
                      {preferences.theme === t.mode && <Sparkles className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
