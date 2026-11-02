import React from 'react';
import { X, Play, Trash2, Music2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import { ArtworkImage } from './ArtworkImage.tsx';
import { formatDuration } from '../utils/musicApi.ts';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentTrack,
    isQueueOpen,
    setIsQueueOpen,
    playTrack,
    removeFromQueue,
    clearQueue
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-neutral-950/98 backdrop-blur-2xl border-l border-neutral-800 p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Playback Queue"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-100">Playing Queue</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">
              {queue.length} {queue.length === 1 ? 'track' : 'tracks'} loaded
            </p>
          </div>
          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                type="button"
                onClick={clearQueue}
                className="p-1.5 text-xs text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 rounded transition-colors"
                title="Clear queue"
                aria-label="Clear queue"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsQueueOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors"
              aria-label="Close queue drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Playing Track Banner */}
        {currentTrack && (
          <div className="mt-4 p-3 bg-neutral-900/90 rounded-xl border border-amber-500/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Now Playing
            </span>
            <div className="flex items-center gap-3 mt-2">
              <ArtworkImage
                src={currentTrack.artwork}
                alt={currentTrack.title}
                size="sm"
                className="w-10 h-10 rounded-md flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-100 truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {formatDuration(currentTrack.duration)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Up Next List */}
      <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-1">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1 mb-2">
          Up Next
        </p>

        {queue.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <Music2 className="w-8 h-8 mx-auto mb-2 text-neutral-500" />
            <p className="text-sm">Queue is empty</p>
            <p className="text-xs mt-1">Play any track from Trending or Search</p>
          </div>
        ) : (
          queue.map((track, idx) => {
            const isCurrentlyPlaying = idx === queueIndex;
            return (
              <div
                key={`${track.id}-${idx}`}
                className={`group flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                  isCurrentlyPlaying
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                    : 'hover:bg-neutral-900 text-neutral-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => playTrack(track, queue)}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left"
                >
                  <div className="relative w-9 h-9 rounded flex-shrink-0 overflow-hidden">
                    <ArtworkImage
                      src={track.artwork}
                      alt={track.title}
                      size="sm"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium truncate ${isCurrentlyPlaying ? 'text-amber-400 font-semibold' : 'text-neutral-200'}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {track.artist}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {formatDuration(track.duration)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromQueue(idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-400 transition-opacity"
                    aria-label={`Remove ${track.title} from queue`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-neutral-800">
        <button
          type="button"
          onClick={() => setIsQueueOpen(false)}
          className="w-full py-2 px-4 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
