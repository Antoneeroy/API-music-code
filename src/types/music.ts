/**
 * Core track and API response types matching the Music Streaming API specification.
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds, e.g. 210
  artwork: string | null; // URL or null for fallback placeholder
  stream_url: string; // standard progressive audio format
  genre?: string;
  album?: string;
}

export interface ApiResponse {
  success: boolean;
  total: number;
  results: Track[];
  query?: string;
  error?: string;
}

export type PlaybackRepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  repeatMode: PlaybackRepeatMode;
  isShuffled: boolean;
  queue: Track[];
  queueIndex: number;
}
