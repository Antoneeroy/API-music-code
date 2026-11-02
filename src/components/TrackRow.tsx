import React from 'react';
import { Play, Pause, Heart, Plus, Radio } from 'lucide-react';
import { Track } from '../types/music.ts';
import { usePlayer } from '../context/PlayerContext.tsx';
import { ArtworkImage } from './ArtworkImage.tsx';
import { formatDuration } from '../utils/musicApi.ts';

interface TrackRowProps {
  track: Track;
  index: number;
  allTracks?: Track[];
}

export const TrackRow: React.FC<TrackRowProps> = ({ track, index, allTracks }) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedTrackIds,
    toggleLike,
    addToQueue
  } = usePlayer();

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isLiked = likedTrackIds.has(track.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, allTracks);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors border border-transparent ${
        isCurrent
          ? 'bg-amber-500/10 border-amber-500/20 text-neutral-100'
          : 'hover:bg-neutral-900/80 hover:border-neutral-800 text-neutral-300'
      }`}
      role="row"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
    >
      {/* Left: Index / Play Icon & Track Artwork & Title/Artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Index or Play icon */}
        <div className="w-6 text-center text-xs font-mono text-neutral-500 group-hover:text-neutral-300 flex-shrink-0 flex items-center justify-center">
          {isThisPlaying ? (
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <>
              <span className="group-hover:hidden">{index + 1}</span>
              <Play className="w-4 h-4 text-white hidden group-hover:block fill-current" />
            </>
          )}
        </div>

        {/* Artwork */}
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-900">
          <ArtworkImage
            src={track.artwork}
            alt={track.title}
            size="sm"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1 pr-4">
          <p
            className={`text-sm font-semibold truncate ${
              isCurrent ? 'text-amber-400 font-bold' : 'text-neutral-100 group-hover:text-amber-300'
            }`}
          >
            {track.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-400 truncate mt-0.5">
            <span>{track.artist}</span>
            {track.album && (
              <>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-neutral-500 truncate">{track.album}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center/Right: Genre & Stream Info */}
      {track.genre && (
        <div className="hidden md:block w-28 text-xs text-neutral-400 font-mono truncate">
          {track.genre}
        </div>
      )}

      {/* Right: Actions & Duration */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            addToQueue(track);
          }}
          aria-label={`Add ${track.title} to queue`}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-all"
          title="Add to queue"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
          aria-label={isLiked ? `Unlike ${track.title}` : `Like ${track.title}`}
          className={`p-1.5 transition-colors rounded ${
            isLiked
              ? 'text-rose-500'
              : 'text-neutral-400 hover:text-rose-500 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              isLiked ? 'fill-rose-500' : ''
            }`}
          />
        </button>

        <span className="text-xs font-mono text-neutral-400 w-11 text-right tabular-nums">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
};
