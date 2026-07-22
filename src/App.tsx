import React, { useState, useEffect } from 'react';
import {
  getStoredPreferences,
  savePreferences,
  getStoredFavorites,
  saveFavorites,
  getStoredRecentlyWatched,
  addRecentlyWatched,
  getStoredCustomChannels,
  saveCustomChannels,
  getStoredPlaylists,
  savePlaylists,
  clearAppCache,
  exportUserData,
} from './services/storage';
import { buildInitialChannels } from './data/mockChannels';
import { Channel, ChannelCategory, Playlist, UserPreferences } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreenView } from './components/HomeScreenView';
import { SearchCatalogView } from './components/SearchCatalogView';
import { PlaylistsView } from './components/PlaylistsView';
import { ManageChannelsView } from './components/ManageChannelsView';
import { SettingsView } from './components/SettingsView';
import { VideoPlayer } from './components/VideoPlayer';
import { MiniPlayer } from './components/MiniPlayer';
import { EPGModal } from './components/EPGModal';
import { PlaylistImportModal } from './components/PlaylistImportModal';
import { AddChannelModal } from './components/AddChannelModal';

export default function App() {
  // 1. App State
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getStoredFavorites);
  const [recentlyWatchedIds, setRecentlyWatchedIds] = useState<string[]>(getStoredRecentlyWatched);
  const [customChannels, setCustomChannels] = useState<Channel[]>(getStoredCustomChannels);
  const [playlists, setPlaylists] = useState<Playlist[]>(getStoredPlaylists);

  // Combine default catalog + custom channels
  const [channels, setChannels] = useState<Channel[]>(() => {
    const defaultCatalog = buildInitialChannels();
    const custom = getStoredCustomChannels();
    return [...custom, ...defaultCatalog];
  });

  // Navigation and active player state
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'playlists' | 'manage' | 'settings'>('home');
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [isPlayerViewOpen, setIsPlayerViewOpen] = useState<boolean>(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState<boolean>(false);

  // Modal triggers
  const [selectedEPGChannel, setSelectedEPGChannel] = useState<Channel | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showAddChannelModal, setShowAddChannelModal] = useState<boolean>(false);
  const [catalogInitialCategory, setCatalogInitialCategory] = useState<ChannelCategory>('Всі');

  // Apply Theme Class to Document Body
  useEffect(() => {
    const body = document.body;
    body.className = ''; // Reset classes
    body.classList.add(`theme-${preferences.theme}`);
  }, [preferences.theme]);

  // Global Keyboard Shortcuts (e.g. Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update Preferences Handler
  const handleUpdatePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  // Toggle Favorite
  const handleToggleFavorite = (channelId: string) => {
    let updated: string[];
    if (favoriteIds.includes(channelId)) {
      updated = favoriteIds.filter((id) => id !== channelId);
    } else {
      updated = [...favoriteIds, channelId];
    }
    setFavoriteIds(updated);
    saveFavorites(updated);
  };

  // Play Channel Handler
  const handlePlayChannel = (channel: Channel) => {
    setActiveChannel(channel);
    setIsPlayerViewOpen(true);
    setShowMiniPlayer(false);
    const updatedRecent = addRecentlyWatched(channel.id);
    setRecentlyWatchedIds(updatedRecent);
  };

  // Minimize Player to Mini Player Widget
  const handleMinimizeToMiniPlayer = () => {
    setIsPlayerViewOpen(false);
    setShowMiniPlayer(true);
  };

  // Expand Mini Player to Full Player View
  const handleExpandMiniPlayer = () => {
    setShowMiniPlayer(false);
    setIsPlayerViewOpen(true);
  };

  // Close Mini Player Completely
  const handleCloseMiniPlayer = () => {
    setShowMiniPlayer(false);
    setActiveChannel(null);
  };

  // Import New Channels / Playlist
  const handleImportChannels = (importedChannels: Channel[], playlistName: string) => {
    const updatedCustom = [...importedChannels, ...customChannels];
    setCustomChannels(updatedCustom);
    saveCustomChannels(updatedCustom);

    const updatedAll = [...importedChannels, ...channels];
    setChannels(updatedAll);

    // Create a playlist record
    const newPlaylist: Playlist = {
      id: `pl-user-${Date.now()}`,
      name: playlistName,
      channelCount: importedChannels.length,
      dateAdded: new Date().toLocaleDateString('uk-UA'),
      isSystem: false,
      description: `Користувацький M3U плейлист з ${importedChannels.length} каналами.`,
      category: 'Мої Канали',
    };
    const updatedPlaylists = [newPlaylist, ...playlists];
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);

    // Auto play first imported channel if available
    if (importedChannels.length > 0) {
      handlePlayChannel(importedChannels[0]);
    }
  };

  // Add Single Custom Channel
  const handleAddSingleChannel = (newChannel: Channel) => {
    const updatedCustom = [newChannel, ...customChannels];
    setCustomChannels(updatedCustom);
    saveCustomChannels(updatedCustom);

    const updatedAll = [newChannel, ...channels];
    setChannels(updatedAll);

    handlePlayChannel(newChannel);
  };

  // Delete Custom Channel
  const handleDeleteCustomChannel = (channelId: string) => {
    const updatedCustom = customChannels.filter((c) => c.id !== channelId);
    setCustomChannels(updatedCustom);
    saveCustomChannels(updatedCustom);

    const updatedAll = channels.filter((c) => c.id !== channelId);
    setChannels(updatedAll);

    if (activeChannel?.id === channelId) {
      setActiveChannel(null);
      setIsPlayerViewOpen(false);
      setShowMiniPlayer(false);
    }
  };

  // Delete User Playlist
  const handleDeleteUserPlaylist = (playlistId: string) => {
    const updatedPlaylists = playlists.filter((p) => p.id !== playlistId);
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);
  };

  // Clear App Cache
  const handleClearCache = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кеш та скинути збережені дані?')) {
      clearAppCache();
      setFavoriteIds([]);
      setRecentlyWatchedIds([]);
      setCustomChannels([]);
      setChannels(buildInitialChannels());
      setPlaylists(getStoredPlaylists());
      setActiveChannel(null);
      setIsPlayerViewOpen(false);
      setShowMiniPlayer(false);
      alert('Кеш та налаштування успішно скинуто.');
    }
  };

  // Export M3U / Backup JSON
  const handleExportBackup = () => {
    const jsonStr = exportUserData(channels, favoriteIds, playlists);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kozhukhivka_tv_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Custom Channels as M3U file
  const handleExportCustomM3U = () => {
    let m3u = '#EXTM3U\n';
    customChannels.forEach((c) => {
      m3u += `#EXTINF:-1 tvg-logo="${c.logo}" group-title="${c.category}", ${c.name}\n${c.streamUrl}\n`;
    });
    const blob = new Blob([m3u], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kozhukhivka_tv_playlist.m3u';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Backup JSON string
  const handleImportBackupJson = (jsonString: string) => {
    const data = JSON.parse(jsonString);
    if (data.favorites) {
      setFavoriteIds(data.favorites);
      saveFavorites(data.favorites);
    }
    if (data.customChannels) {
      setCustomChannels(data.customChannels);
      saveCustomChannels(data.customChannels);
      setChannels([...data.customChannels, ...buildInitialChannels()]);
    }
    if (data.userPlaylists) {
      const mergedPlaylists = [...getStoredPlaylists(), ...data.userPlaylists];
      setPlaylists(mergedPlaylists);
      savePlaylists(mergedPlaylists);
    }
  };

  // Reset Catalog to Defaults
  const handleResetCatalog = () => {
    setChannels(buildInitialChannels());
    alert('Каталог каналів перезавантажено.');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300">
      
      {/* Global Header */}
      <Header
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        totalChannelsCount={channels.length}
        favoritesCount={favoriteIds.length}
        onOpenImportModal={() => setShowImportModal(true)}
        onOpenSearch={() => {
          setActiveTab('search');
          setIsPlayerViewOpen(false);
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsPlayerViewOpen(false);
        }}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsPlayerViewOpen(false);
        }}
        favoritesCount={favoriteIds.length}
        customCount={customChannels.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Full Video Player Screen when open */}
        {isPlayerViewOpen && activeChannel ? (
          <VideoPlayer
            channel={activeChannel}
            allChannels={channels}
            onSelectChannel={handlePlayChannel}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favoriteIds.includes(activeChannel.id)}
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onOpenEPG={(c) => setSelectedEPGChannel(c)}
            onMinimizeToMiniPlayer={handleMinimizeToMiniPlayer}
          />
        ) : null}

        {/* Tab Views */}
        {!isPlayerViewOpen && (
          <>
            {activeTab === 'home' && (
              <HomeScreenView
                channels={channels}
                playlists={playlists}
                recentlyWatchedIds={recentlyWatchedIds}
                favoriteIds={favoriteIds}
                onPlayChannel={handlePlayChannel}
                onToggleFavorite={handleToggleFavorite}
                onOpenEPG={(c) => setSelectedEPGChannel(c)}
                activePlayingChannelId={activeChannel?.id}
                preferences={preferences}
                onOpenImportModal={() => setShowImportModal(true)}
                onNavigateTab={setActiveTab}
                onSelectCategory={(cat) => {
                  setCatalogInitialCategory(cat);
                  setActiveTab('search');
                }}
              />
            )}

            {activeTab === 'search' && (
              <SearchCatalogView
                channels={channels}
                favoriteIds={favoriteIds}
                onPlayChannel={handlePlayChannel}
                onToggleFavorite={handleToggleFavorite}
                onOpenEPG={(c) => setSelectedEPGChannel(c)}
                activePlayingChannelId={activeChannel?.id}
                initialCategory={catalogInitialCategory}
              />
            )}

            {activeTab === 'playlists' && (
              <PlaylistsView
                playlists={playlists}
                onOpenImportModal={() => setShowImportModal(true)}
                onSelectPlaylistCategory={(cat) => {
                  setCatalogInitialCategory(cat as any);
                  setActiveTab('search');
                }}
                onDeleteUserPlaylist={handleDeleteUserPlaylist}
              />
            )}

            {activeTab === 'manage' && (
              <ManageChannelsView
                customChannels={customChannels}
                onOpenAddModal={() => setShowAddChannelModal(true)}
                onDeleteChannel={handleDeleteCustomChannel}
                onExportM3U={handleExportCustomM3U}
                onResetCatalog={handleResetCatalog}
                onPlayChannel={handlePlayChannel}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                preferences={preferences}
                onUpdatePreferences={handleUpdatePreferences}
                onClearCache={handleClearCache}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackupJson}
                totalChannelsCount={channels.length}
                favoritesCount={favoriteIds.length}
              />
            )}
          </>
        )}

      </main>

      {/* Floating Mini Player Widget */}
      {showMiniPlayer && activeChannel && (
        <MiniPlayer
          channel={activeChannel}
          onExpand={handleExpandMiniPlayer}
          onClose={handleCloseMiniPlayer}
          isMuted={preferences.muted}
          onToggleMute={() => handleUpdatePreferences({ ...preferences, muted: !preferences.muted })}
        />
      )}

      {/* Modals */}
      {selectedEPGChannel && (
        <EPGModal
          channel={selectedEPGChannel}
          onClose={() => setSelectedEPGChannel(null)}
          onPlayChannel={handlePlayChannel}
        />
      )}

      {showImportModal && (
        <PlaylistImportModal
          onClose={() => setShowImportModal(false)}
          onImportChannels={handleImportChannels}
        />
      )}

      {showAddChannelModal && (
        <AddChannelModal
          onClose={() => setShowAddChannelModal(false)}
          onAddChannel={handleAddSingleChannel}
        />
      )}

    </div>
  );
}
