import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Maximize2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import { ArtworkImage } from './ArtworkImage.tsx';
import { formatDuration } from '../utils/musicApi.ts';
import { AudioVisualizer } from './AudioVisualizer.tsx';

export const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    queue,
    likedTrackIds,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    nextTrack,
    prevTrack,
    toggleLike,
    isQueueOpen,
    setIsQueueOpen,
    setIsExpanded
  } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  const isLiked = likedTrackIds.has(currentTrack.id);
  const trackDuration = duration || currentTrack.duration;
  const progressPercent = trackDuration > 0 ? (currentTime / trackDuration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 px-4 py-3 select-none transition-all shadow-2xl"
      role="region"
      aria-label="Audio Player"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Track Info & Artwork */}
        <div className="flex items-center gap-3.5 min-w-0 w-1/4 max-w-[280px]">
          <div
            className="w-13 h-13 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer shadow-md group relative"
            onClick={() => setIsExpanded(true)}
            title="Click to expand player"
          >
            <ArtworkImage
              src={currentTrack.artwork}
              alt={currentTrack.title}
              size="md"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p
                className="text-sm font-semibold text-neutral-100 truncate cursor-pointer hover:underline"
                onClick={() => setIsExpanded(true)}
              >
                {currentTrack.title}
              </p>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleLike(currentTrack.id)}
            aria-label={isLiked ? `Unlike ${currentTrack.title}` : `Like ${currentTrack.title}`}
            className="p-1.5 rounded-full text-neutral-400 hover:text-rose-500 hover:bg-neutral-800 transition-colors flex-shrink-0"
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Center: Controls & Seekbar */}
        <div className="flex-1 max-w-2xl flex flex-col items-center">
          <div className="flex items-center gap-4 sm:gap-6 mb-1">
            <button
              type="button"
              onClick={toggleShuffle}
              aria-label={isShuffled ? 'Shuffle enabled' : 'Shuffle disabled'}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                isShuffled ? 'text-amber-400 hover:text-amber-300' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={isShuffled ? 'Shuffle on' : 'Shuffle off'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={prevTrack}
              aria-label="Previous track"
              className="p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              aria-label="Next track"
              className="p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              onClick={toggleRepeat}
              aria-label={`Repeat mode: ${repeatMode}`}
              className={`p-1.5 rounded-full transition-colors ${
                repeatMode !== 'off'
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Seekbar */}
          <div className="w-full flex items-center gap-2.5 text-xs text-neutral-400 font-mono">
            <span className="w-9 text-right text-[11px] tabular-nums select-none">
              {formatDuration(currentTime)}
            </span>
            <div className="relative flex-1 flex items-center group cursor-pointer py-1">
              <input
                type="range"
                min={0}
                max={trackDuration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                aria-label="Seek track position"
                className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                style={{
                  background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${progressPercent}%, #262626 ${progressPercent}%, #262626 100%)`
                }}
              />
            </div>
            <span className="w-9 text-left text-[11px] tabular-nums select-none">
              {formatDuration(trackDuration)}
            </span>
          </div>
        </div>

        {/* Right: Visualizer, Volume, Queue */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4 max-w-[280px]">
          {/* Subtle live visualizer */}
          <div className="w-20 h-6">
            <AudioVisualizer isPlaying={isPlaying} barCount={12} color="amber" />
          </div>

          {/* Queue toggle */}
          <button
            type="button"
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            aria-label="Toggle playback queue"
            className={`p-2 rounded-lg text-xs relative transition-colors ${
              isQueueOpen
                ? 'bg-neutral-800 text-amber-400'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
            title="Up Next Queue"
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {queue.length}
              </span>
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Volume slider"
              className="w-16 h-1 bg-neutral-700 rounded-full appearance-none accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Expand Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand player to full view"
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded hover:bg-neutral-800 transition-colors"
            title="Expand player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
