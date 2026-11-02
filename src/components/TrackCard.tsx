import React from 'react';
import { Play, Pause, Heart, Radio } from 'lucide-react';
import { Track } from '../types/music.ts';
import { usePlayer } from '../context/PlayerContext.tsx';
import { ArtworkImage } from './ArtworkImage.tsx';
import { formatDuration } from '../utils/musicApi.ts';

interface TrackCardProps {
  track: Track;
  allTracks?: Track[];
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, allTracks }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, likedTrackIds, toggleLike } = usePlayer();

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isLiked = likedTrackIds.has(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, allTracks);
    }
  };

  return (
    <div
      onClick={handlePlayClick}
      className="group relative bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-neutral-700/80 rounded-xl p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePlayClick(e as unknown as React.MouseEvent);
        }
      }}
      aria-label={`${track.title} by ${track.artist}`}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 bg-neutral-950">
        <ArtworkImage
          src={track.artwork}
          alt={track.title}
          size="lg"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Play overlay button */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
            isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-black/50 transition-transform active:scale-95"
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Live playing badge */}
        {isThisPlaying && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-amber-400 flex items-center gap-1">
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>PLAYING</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-semibold text-neutral-100 truncate group-hover:text-amber-400 transition-colors">
            {track.title}
          </p>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              toggleLike(track.id);
            }}
            aria-label={isLiked ? 'Unlike' : 'Like'}
            className="p-1 text-neutral-500 hover:text-rose-500 transition-colors flex-shrink-0"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isLiked ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-neutral-400 truncate mt-0.5">
          {track.artist}
        </p>

        {/* Typographic metadata without pill boxes */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
          {track.genre && (
            <>
              <span>{track.genre}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
            </>
          )}
          <span>{formatDuration(track.duration)}</span>
        </div>
      </div>
    </div>
  );
};
