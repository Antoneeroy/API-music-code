import React, { useEffect } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Copy,
  Check,
  Radio,
  ExternalLink
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import { ArtworkImage } from './ArtworkImage.tsx';
import { AudioVisualizer } from './AudioVisualizer.tsx';
import { formatDuration } from '../utils/musicApi.ts';

export const ExpandedPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    repeatMode,
    isShuffled,
    likedTrackIds,
    isExpanded,
    setIsExpanded,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleRepeat,
    toggleShuffle,
    nextTrack,
    prevTrack,
    toggleLike
  } = usePlayer();

  const [copiedStream, setCopiedStream] = React.useState(false);
  const [isScrubbing, setIsScrubbing] = React.useState(false);
  const [scrubValue, setScrubValue] = React.useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, setIsExpanded]);

  if (!isExpanded || !currentTrack) return null;

  const isLiked = likedTrackIds.has(currentTrack.id);
  const trackDuration = duration || currentTrack.duration;
  const displayTime = isScrubbing ? scrubValue : currentTime;
  const progressPercent = trackDuration > 0 ? (displayTime / trackDuration) * 100 : 0;

  const handleSeekInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScrubValue(val);
  };

  const handleSeekCommit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    seek(val);
    setIsScrubbing(false);
  };

  const handleCopyStream = () => {
    navigator.clipboard.writeText(currentTrack.stream_url);
    setCopiedStream(true);
    setTimeout(() => setCopiedStream(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Now Playing: ${currentTrack.title}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto pb-4 border-b border-neutral-800/60">
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Collapse player"
        >
          <ChevronDown className="w-4 h-4" />
          <span>Collapse</span>
        </button>

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest font-mono text-amber-500 font-semibold">
            Playing from SoundWave API
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">
            {currentTrack.album || currentTrack.genre || 'Single'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyStream}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Copy progressive audio stream URL"
        >
          {copiedStream ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied Stream</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
              <span>Copy Stream URL</span>
            </>
          )}
        </button>
      </div>

      {/* Main Body: Center Artwork & Visualizer */}
      <div className="max-w-md w-full mx-auto my-auto py-6 flex flex-col items-center">
        {/* Album Artwork with vinyl glow */}
        <div className="relative group w-64 h-64 sm:w-76 sm:h-76 mb-8">
          <div
            className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80 relative transition-transform duration-500 ${
              isPlaying ? 'scale-[1.02]' : 'scale-100'
            }`}
          >
            <ArtworkImage
              src={currentTrack.artwork}
              alt={currentTrack.title}
              size="xl"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Vinyl spin indicator */}
          <div
            className={`absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-xl flex items-center justify-center ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
            title="Vinyl playback motor"
          >
            <div className="w-4 h-4 rounded-full bg-amber-500 border border-neutral-900" />
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="w-full max-w-sm mb-6 h-12">
          <AudioVisualizer isPlaying={isPlaying} barCount={32} color="amber" />
        </div>

        {/* Track Details */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="min-w-0 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight truncate">
              {currentTrack.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-neutral-400">
              <span className="font-medium text-neutral-300">{currentTrack.artist}</span>
              {currentTrack.genre && (
                <>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span className="text-xs text-amber-400/90 font-mono">{currentTrack.genre}</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleLike(currentTrack.id)}
            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-rose-500 transition-colors flex-shrink-0"
          >
            <Heart
              className={`w-6 h-6 transition-transform ${
                isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Scrubber / Seekbar */}
        <div className="w-full mb-6">
          <div className="relative group flex items-center cursor-pointer py-2">
            <input
              type="range"
              min={0}
              max={trackDuration || 100}
              value={displayTime}
              onChange={handleSeekInput}
              onPointerDown={() => {
                setIsScrubbing(true);
                setScrubValue(currentTime);
              }}
              onPointerUp={handleSeekCommit}
              onKeyUp={handleSeekCommit}
              aria-label="Seek track"
              className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${progressPercent}%, #262626 ${progressPercent}%, #262626 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-neutral-400 select-none">
            <span>{formatDuration(displayTime)}</span>
            <span>{formatDuration(trackDuration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between w-full max-w-xs mb-8">
          <button
            type="button"
            onClick={toggleShuffle}
            aria-label={isShuffled ? 'Shuffle enabled' : 'Shuffle disabled'}
            className={`p-2 transition-colors ${
              isShuffled ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={prevTrack}
            aria-label="Previous track"
            className="p-3 text-neutral-200 hover:text-white transition-colors"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/20"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            aria-label="Next track"
            className="p-3 text-neutral-200 hover:text-white transition-colors"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            type="button"
            onClick={toggleRepeat}
            aria-label={`Repeat mode: ${repeatMode}`}
            className={`p-2 transition-colors ${
              repeatMode !== 'off' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Secondary options: Speed & Volume */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-neutral-800/60 text-xs">
          {/* Speed selector */}
          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            {[0.75, 1, 1.25, 1.5].map(rate => (
              <button
                key={rate}
                type="button"
                onClick={() => setPlaybackRate(rate)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  playbackRate === rate
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-neutral-800 rounded-full appearance-none accent-amber-500 cursor-pointer"
              aria-label="Volume slider"
            />
          </div>
        </div>

        {/* Stream Specification Badge */}
        <div className="mt-6 w-full p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 text-left">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-semibold text-neutral-200">Legal Progressive CDN Stream</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Zero server bandwidth cost</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-mono mt-1 truncate">
            {currentTrack.stream_url}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center pt-2">
        <p className="text-[11px] text-neutral-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">Esc</kbd> or click Collapse to return
        </p>
      </div>
    </div>
  );
};
