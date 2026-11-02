import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlaybackRepeatMode } from '../types/music.ts';
import { shuffleTracks } from '../utils/musicApi.ts';

interface PlayerContextType {
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
  likedTrackIds: Set<string>;
  audioError: string | null;
  isExpanded: boolean;
  isQueueOpen: boolean;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  setIsExpanded: (expanded: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleLike: (trackId: string) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [repeatMode, setRepeatMode] = useState<PlaybackRepeatMode>('off');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  
  // Base URL state (default is empty string meaning relative to current origin, e.g. /api)
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(() => {
    return localStorage.getItem('soundwave_api_base_url') || '';
  });

  const setApiBaseUrl = (url: string) => {
    const clean = url.trim().replace(/\/+$/, '');
    setApiBaseUrlState(clean);
    localStorage.setItem('soundwave_api_base_url', clean);
  };

  // Liked tracks persistence
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('soundwave_liked_tracks');
      return saved ? new Set(JSON.parse(saved)) : new Set(['D7Ky5', 'Np23b']);
    } catch {
      return new Set(['D7Ky5', 'Np23b']);
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize or update audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audioRef.current = audio;
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio && audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleError = (e: Event) => {
      console.warn('Audio stream error or network block:', e);
      setAudioError('Stream loading issue. Progressive audio fallback active.');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update volume & muted on audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update playbackRate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Forward track declaration for audio.onended
  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    if (queueIndex < queue.length - 1) {
      const nextIdx = queueIndex + 1;
      setQueueIndex(nextIdx);
      const next = queue[nextIdx];
      setCurrentTrack(next);
      setDuration(next.duration);
      setCurrentTime(0);
      setAudioError(null);
      if (audioRef.current) {
        audioRef.current.src = next.stream_url;
        audioRef.current.play().catch(() => {});
      }
    } else if (repeatMode === 'all') {
      setQueueIndex(0);
      const first = queue[0];
      setCurrentTrack(first);
      setDuration(first.duration);
      setCurrentTime(0);
      setAudioError(null);
      if (audioRef.current) {
        audioRef.current.src = first.stream_url;
        audioRef.current.play().catch(() => {});
      }
    } else {
      setIsPlaying(false);
    }
  }, [queue, queueIndex, repeatMode]);

  // Handle track ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, nextTrack]);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setAudioError(null);
    setCurrentTrack(track);
    setDuration(track.duration);
    setCurrentTime(0);

    let updatedQueue = newQueue || queue;
    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      let idx = updatedQueue.findIndex(t => t.id === track.id);
      if (idx === -1) {
        updatedQueue = [track, ...updatedQueue];
        setQueue(updatedQueue);
        idx = 0;
      }
      setQueueIndex(idx);
    }

    if (audioRef.current) {
      audioRef.current.src = track.stream_url;
      audioRef.current.play().catch(err => {
        console.info('Playback autoplay prevented or network error:', err);
      });
    }
    setIsPlaying(true);
  }, [queue]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const resume = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current) {
      try {
        if (audioRef.current.readyState >= 1) {
          audioRef.current.currentTime = seconds;
        }
      } catch (err) {
        console.warn('Seek deferred until audio metadata loaded:', err);
      }
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleShuffle = () => {
    setIsShuffled(prev => {
      const nextVal = !prev;
      if (nextVal) {
        const shuffled = shuffleTracks(queue, queueIndex);
        setQueue(shuffled);
        setQueueIndex(0);
      }
      return nextVal;
    });
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      seek(0);
      return;
    }
    if (queueIndex > 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      const prev = queue[prevIdx];
      setCurrentTrack(prev);
      setDuration(prev.duration);
      setCurrentTime(0);
      setAudioError(null);
      if (audioRef.current) {
        audioRef.current.src = prev.stream_url;
        audioRef.current.play().catch(() => {});
      }
    } else {
      seek(0);
    }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    if (index === queueIndex) {
      nextTrack();
    } else if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(-1);
    }
  };

  const toggleLike = (trackId: string) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      localStorage.setItem('soundwave_liked_tracks', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        repeatMode,
        isShuffled,
        queue,
        queueIndex,
        likedTrackIds,
        audioError,
        isExpanded,
        isQueueOpen,
        apiBaseUrl,
        setApiBaseUrl,
        setIsExpanded,
        setIsQueueOpen,
        playTrack,
        togglePlay,
        pause,
        resume,
        seek,
        setVolume,
        toggleMute,
        setPlaybackRate,
        toggleRepeat,
        toggleShuffle,
        nextTrack,
        prevTrack,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleLike,
        audioRef
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};
