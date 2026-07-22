import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
  Settings,
  Tv,
  List,
  Heart,
  Calendar,
  Zap,
  Info,
  ChevronRight,
  ChevronLeft,
  Radio,
  Sliders,
  Sparkles,
  WifiOff,
  Copy,
  Check,
} from 'lucide-react';
import { Channel, UserPreferences } from '../types';

interface VideoPlayerProps {
  channel: Channel;
  allChannels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  isFavorite: boolean;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onOpenEPG: (channel: Channel) => void;
  onMinimizeToMiniPlayer: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  channel,
  allChannels,
  onSelectChannel,
  onToggleFavorite,
  isFavorite,
  preferences,
  onUpdatePreferences,
  onOpenEPG,
  onMinimizeToMiniPlayer,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(preferences.autoplay);
  const [isMuted, setIsMuted] = useState<boolean>(preferences.muted);
  const [volume, setVolume] = useState<number>(preferences.volume);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [qualityLevels, setQualityLevels] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 is Auto
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | 'fill' | 'cover'>('16:9');
  const [showChannelSidebar, setShowChannelSidebar] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [streamStats, setStreamStats] = useState({ bitrateKbps: 0, fps: 30, bufferSec: 0 });
  const [copiedStreamUrl, setCopiedStreamUrl] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // HLS Instance reference
  const hlsRef = useRef<Hls | null>(null);

  // Initialize HLS Player on stream change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    setErrorMessage('');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: preferences.bufferLengthSec || 30,
      });

      hlsRef.current = hls;
      hls.loadSource(channel.streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const levels = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height || 720,
          bitrate: lvl.bitrate || 0,
        }));
        setQualityLevels(levels);

        if (preferences.autoplay) {
          video.play().catch(() => {
            setIsPlaying(false);
          });
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const currentLvl = hls.levels[data.level];
        if (currentLvl) {
          setStreamStats((prev) => ({
            ...prev,
            bitrateKbps: Math.round(currentLvl.bitrate / 1000),
          }));
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setHasError(true);
              setErrorMessage('Мережева помилка завантаження HLS потоку');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setHasError(true);
              setErrorMessage('Не вдалося завантажити медіа потік');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = channel.streamUrl;
      if (preferences.autoplay) {
        video.play().catch(() => setIsPlaying(false));
      }
    } else {
      setHasError(true);
      setErrorMessage('Ваш браузер не підтримує відтворення HLS видео потоків.');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.streamUrl, preferences.autoplay, preferences.bufferLengthSec]);

  // Volume & Mute listener
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Buffer stats tracker
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const durationLeft = Math.max(0, bufferedEnd - video.currentTime);
        setStreamStats((prev) => ({
          ...prev,
          bufferSec: Math.round(durationLeft * 10) / 10,
        }));
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    onUpdatePreferences({ ...preferences, muted: !isMuted });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    onUpdatePreferences({ ...preferences, volume: newVol, muted: newVol === 0 });
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const togglePIP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.error('Picture-in-picture failed:', e);
    }
  };

  const handleQualityChange = (levelId: number) => {
    setCurrentQuality(levelId);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
    }
    setShowSettingsMenu(false);
  };

  const copyStreamLink = () => {
    navigator.clipboard.writeText(channel.streamUrl);
    setCopiedStreamUrl(true);
    setTimeout(() => setCopiedStreamUrl(false), 2000);
  };

  // Skip to previous or next channel
  const currentIndex = allChannels.findIndex((c) => c.id === channel.id);
  const handleNextChannel = () => {
    if (currentIndex !== -1 && currentIndex < allChannels.length - 1) {
      onSelectChannel(allChannels[currentIndex + 1]);
    }
  };
  const handlePrevChannel = () => {
    if (currentIndex > 0) {
      onSelectChannel(allChannels[currentIndex - 1]);
    }
  };

  // Aspect ratio css styles
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case '4:3':
        return 'object-contain max-h-full max-w-[80%] mx-auto';
      case 'fill':
        return 'object-fill w-full h-full';
      case 'cover':
        return 'object-cover w-full h-full';
      case '16:9':
      default:
        return 'object-contain w-full h-full';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8 space-y-4">
      {/* Player Container Stage */}
      <div
        ref={playerContainerRef}
        className={`relative overflow-hidden rounded-3xl bg-black border border-[var(--border-color)] shadow-2xl group ${
          preferences.powerSaveMode ? 'ring-1 ring-amber-500/30' : ''
        }`}
        id="live-video-stage-container"
      >
        {/* Main Video Element */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            className={`transition-all duration-300 ${getAspectRatioStyle()}`}
            onClick={togglePlay}
            playsInline
          />

          {/* Error / Loading Overlay */}
          {hasError && (
            <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <Tv className="w-12 h-12 text-red-500 animate-bounce" />
              <div className="text-lg font-bold text-white">Трансляція тимчасово недоступна</div>
              <p className="text-xs text-gray-400 max-w-md">{errorMessage}</p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setHasError(false);
                    if (hlsRef.current) hlsRef.current.startLoad();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Перезапустити потік
                </button>
                <button
                  onClick={handleNextChannel}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
                >
                  Наступний канал
                </button>
              </div>
            </div>
          )}

          {/* Top Stage Bar: Title & Channel Quick Selector Toggle */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-9 h-9 rounded-xl object-contain bg-black/50 p-1 border border-white/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(channel.name)}/120/120`;
                }}
              />
              <div>
                <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                  {channel.name}
                  <span className="px-1.5 py-0.2 rounded bg-red-600 text-[10px] font-bold uppercase tracking-wider text-white">
                    LIVE
                  </span>
                </h2>
                <p className="text-xs text-gray-300 line-clamp-1">
                  {channel.currentProgram || 'Прямий Ефір Телеканалу'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChannelSidebar(!showChannelSidebar)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all"
                title="Список каналів"
                id="btn-player-sidebar-toggle"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Канали</span>
              </button>

              <button
                onClick={onMinimizeToMiniPlayer}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all"
                title="Згорнути у міні-плеєр"
                id="btn-player-minimize"
              >
                <Minimize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Channel Sidebar Overlay Drawer */}
          {showChannelSidebar && (
            <div className="absolute top-0 right-0 bottom-0 w-72 bg-slate-900/95 backdrop-blur-xl z-30 p-4 overflow-y-auto border-l border-white/10 space-y-2 animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Список каналів ({allChannels.length})
                </span>
                <button
                  onClick={() => setShowChannelSidebar(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Закрити
                </button>
              </div>
              <div className="space-y-1">
                {allChannels.slice(0, 50).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectChannel(c);
                      setShowChannelSidebar(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                      c.id === channel.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="line-clamp-1">{c.name}</span>
                    <span className="text-[10px] opacity-75">{c.quality}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Stage Bar Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2 z-10">
            
            <div className="flex items-center justify-between">
              {/* Play / Skip / Volume */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-white text-black hover:scale-105 transition-transform"
                  id="btn-player-play-pause"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                </button>

                <button
                  onClick={handlePrevChannel}
                  disabled={currentIndex <= 0}
                  className="p-2 text-white hover:text-blue-400 disabled:opacity-30"
                  title="Попередній канал"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNextChannel}
                  disabled={currentIndex >= allChannels.length - 1}
                  className="p-2 text-white hover:text-blue-400 disabled:opacity-30"
                  title="Наступний канал"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Volume slider */}
                <div className="flex items-center gap-2 group/vol">
                  <button onClick={toggleMute} className="text-white hover:text-blue-400">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-24 accent-blue-500 h-1 bg-white/30 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Side Options: Quality, PIP, Fullscreen, Stats */}
              <div className="flex items-center gap-2">
                
                {/* Stats Info Button */}
                <button
                  onClick={() => setShowStatsModal(!showStatsModal)}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                  title="Інформація про потік"
                >
                  <Info className="w-4 h-4" />
                </button>

                {/* PIP Button */}
                <button
                  onClick={togglePIP}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                  title="Картинка в картинці (PIP)"
                >
                  <PictureInPicture className="w-4 h-4" />
                </button>

                {/* Settings Toggle Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                    title="Налаштування якості та пропорцій"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {showSettingsMenu && (
                    <div className="absolute right-0 bottom-10 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 p-3 shadow-2xl z-40 text-xs text-white space-y-3">
                      <div>
                        <div className="font-bold text-gray-400 mb-1 uppercase tracking-wider text-[10px]">
                          Якість відео (HLS)
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={() => handleQualityChange(-1)}
                            className={`w-full text-left px-2 py-1 rounded ${
                              currentQuality === -1 ? 'bg-blue-600 font-bold' : 'hover:bg-white/10'
                            }`}
                          >
                            Автомат (Адаптивна)
                          </button>
                          {qualityLevels.map((lvl) => (
                            <button
                              key={lvl.id}
                              onClick={() => handleQualityChange(lvl.id)}
                              className={`w-full text-left px-2 py-1 rounded flex justify-between ${
                                currentQuality === lvl.id ? 'bg-blue-600 font-bold' : 'hover:bg-white/10'
                              }`}
                            >
                              <span>{lvl.height}p</span>
                              <span className="text-gray-400">{Math.round(lvl.bitrate / 1000)} kbps</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <div className="font-bold text-gray-400 mb-1 uppercase tracking-wider text-[10px]">
                          Пропорції екрану
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {(['16:9', '4:3', 'fill', 'cover'] as const).map((ratio) => (
                            <button
                              key={ratio}
                              onClick={() => setAspectRatio(ratio)}
                              className={`px-2 py-1 rounded text-center uppercase ${
                                aspectRatio === ratio ? 'bg-blue-600 font-bold' : 'hover:bg-white/10'
                              }`}
                            >
                              {ratio}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                  title="Повний екран"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Stream Technical Stats Overlay Bar if triggered */}
        {showStatsModal && (
          <div className="p-3 bg-slate-900 border-t border-white/10 text-xs text-gray-300 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-4">
              <span>
                Бітрейт: <strong className="text-blue-400">{streamStats.bitrateKbps || '---'} Kbps</strong>
              </span>
              <span>
                Буфер: <strong className="text-emerald-400">{streamStats.bufferSec} сек</strong>
              </span>
              <span>
                Пропорції: <strong className="text-purple-400">{aspectRatio}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyStreamLink}
                className="flex items-center gap-1 text-blue-400 hover:underline"
              >
                {copiedStreamUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStreamUrl ? 'Скопійовано!' : 'Копіювати URL потоку'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Under-Player Metadata & EPG Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-12 h-12 rounded-2xl object-contain bg-[var(--bg-main)] p-1.5 border border-[var(--border-color)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(channel.name)}/120/120`;
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--text-primary)]">{channel.name}</h2>
              <span className="px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)] text-xs font-bold">
                {channel.category}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Зараз в ефірі: <span className="font-semibold text-[var(--text-primary)]">{channel.currentProgram}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => onToggleFavorite(channel.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFavorite
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{isFavorite ? 'В обраному' : 'В обране'}</span>
          </button>

          <button
            onClick={() => onOpenEPG(channel)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:bg-[var(--accent-hover)] transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Телепрограма EPG</span>
          </button>
        </div>

      </div>
    </div>
  );
};
