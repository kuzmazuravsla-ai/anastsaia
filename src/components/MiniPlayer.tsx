import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { Maximize2, X, Volume2, VolumeX, Play, Pause, Radio } from 'lucide-react';
import { Channel } from '../types';

interface MiniPlayerProps {
  channel: Channel;
  onExpand: () => void;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  channel,
  onExpand,
  onClose,
  isMuted,
  onToggleMute,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(channel.streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => setIsPlaying(false));
      });
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.streamUrl;
      video.play().catch(() => setIsPlaying(false));
    }
  }, [channel.streamUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 w-72 sm:w-80 rounded-2xl overflow-hidden glass-panel border-2 border-[var(--accent)] shadow-2xl animate-in slide-in-from-bottom duration-300 group cursor-pointer"
      onClick={onExpand}
      id="mini-player-floating-widget"
    >
      {/* Video View */}
      <div className="relative aspect-video bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          muted={isMuted}
          playsInline
        />

        {/* Live Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-bold shadow">
          <Radio className="w-2.5 h-2.5" />
          {channel.name}
        </div>

        {/* Hover Controls Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              title="Розгорнути на весь екран"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
              title="Закрити міні-плеєр"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mini Title Bar */}
      <div className="p-2 bg-[var(--bg-card)] flex items-center justify-between text-xs text-[var(--text-primary)]">
        <span className="font-bold truncate max-w-[200px]">{channel.name}</span>
        <span className="text-[10px] text-[var(--text-secondary)] font-semibold">{channel.quality}</span>
      </div>
    </div>
  );
};
