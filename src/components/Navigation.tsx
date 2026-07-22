import React from 'react';
import { Home, Search, ListVideo, SlidersHorizontal, Settings, Flame } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'search' | 'playlists' | 'manage' | 'settings';
  onSelectTab: (tab: 'home' | 'search' | 'playlists' | 'manage' | 'settings') => void;
  favoritesCount: number;
  customCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  customCount,
}) => {
  interface NavTab {
    id: 'home' | 'search' | 'playlists' | 'manage' | 'settings';
    label: string;
    icon: React.ElementType;
    badge?: string | null;
  }

  const tabs: NavTab[] = [
    { id: 'home', label: 'Головна', icon: Home },
    { id: 'search', label: 'Каталог & Пошук', icon: Search, badge: favoritesCount > 0 ? `${favoritesCount}` : null },
    { id: 'playlists', label: 'Плейлисти', icon: ListVideo },
    { id: 'manage', label: 'Мої Канали', icon: SlidersHorizontal, badge: customCount > 0 ? `${customCount}` : null },
    { id: 'settings', label: 'Налаштування', icon: Settings },
  ];

  return (
    <nav className="w-full bg-[var(--bg-main)] border-b border-[var(--border-color)] px-4 py-2 sticky top-[65px] z-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1 sm:gap-3 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)] scale-[1.02]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] border border-transparent'
              }`}
              id={`nav-tab-${tab.id}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--text-secondary)]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[var(--badge-bg)] text-[var(--accent)]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
