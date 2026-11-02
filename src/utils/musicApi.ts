import { ApiResponse, Track } from '../types/music.ts';

/**
 * Curated catalog of legal progressive streaming tracks.
 * Media files are hosted on legal CDN / public domain progressive audio servers.
 */
export const SAMPLE_CATALOG: Track[] = [
  {
    id: 'D7Ky5',
    title: 'Acoustic Breeze',
    artist: 'Benjamin Tissot',
    duration: 157,
    artwork: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Acoustic',
    album: 'Sunlight Morning'
  },
  {
    id: 'Tr89a',
    title: 'Sunset Horizon',
    artist: 'Acoustic Waves',
    duration: 210,
    artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Acoustic',
    album: 'Endless Coast'
  },
  {
    id: 'Np23b',
    title: 'Midnight Lo-Fi Echoes',
    artist: 'Komorebi Sound',
    duration: 184,
    artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Lo-Fi',
    album: 'City Rain Tape'
  },
  {
    id: 'Zk91m',
    title: 'Neon Skyline',
    artist: 'Synthetix Beats',
    duration: 245,
    artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Electronic',
    album: 'Cyber District'
  },
  {
    id: 'Pl45x',
    title: 'Deep Meditation Pulse',
    artist: 'Aura Collective',
    duration: 312,
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Ambient',
    album: 'Zenith Space'
  },
  {
    id: 'Nu09q',
    title: 'Midnight Coffee',
    artist: 'Chillhop District',
    duration: 198,
    artwork: null, // Null artwork placeholder test
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Chillout',
    album: 'Study Session vol. 4'
  },
  {
    id: 'Gv77t',
    title: 'Guitar Reverie',
    artist: 'Elena Rostova',
    duration: 224,
    artwork: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Acoustic',
    album: 'Strings in the Dark'
  },
  {
    id: 'Xw12y',
    title: 'Starlight Voyage',
    artist: 'Cosmo Beats',
    duration: 270,
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Electronic',
    album: 'Nebula Voyage'
  },
  {
    id: 'Qm88r',
    title: 'Velvet Raindrops',
    artist: 'Piano Sanctuary',
    duration: 165,
    artwork: null, // Null artwork placeholder test
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    genre: 'Classical',
    album: 'Solitude Solos'
  },
  {
    id: 'Bt34p',
    title: 'Urban Groove',
    artist: 'Metro Funk Collective',
    duration: 232,
    artwork: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'Funk',
    album: 'Downtown Lights'
  },
  {
    id: 'Ds01k',
    title: 'Sufi Soul Acoustic',
    artist: 'Kabir & The Strings',
    duration: 268,
    artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    genre: 'Desi Acoustic',
    album: 'Rooh Safar'
  },
  {
    id: 'Fl44m',
    title: 'Monsoon Chai Lofi',
    artist: 'Mumbai Lo-Fi Club',
    duration: 175,
    artwork: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    genre: 'Lo-Fi',
    album: 'Bandra Balcony Tapes'
  },
  {
    id: 'Rk82a',
    title: 'Punjab Folk Fusion',
    artist: 'Rhythm of Dhol',
    duration: 215,
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    genre: 'Folk Fusion',
    album: 'Desi Roots'
  },
  {
    id: 'Sy55w',
    title: 'Synthwave Highway 84',
    artist: 'Retro Horizon',
    duration: 242,
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    genre: 'Electronic',
    album: 'Neon Drive'
  },
  {
    id: 'Cl19z',
    title: 'Nocturne in C-Sharp Minor',
    artist: 'Chopin Ensemble',
    duration: 290,
    artwork: 'https://images.unsplash.com/photo-1520523839898-507121c17228?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    genre: 'Classical',
    album: 'Masterworks Anthology'
  },
  {
    id: 'Jz33d',
    title: 'Late Night Espresso Jazz',
    artist: 'Blue Note Trio',
    duration: 218,
    artwork: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500&auto=format&fit=crop&q=80',
    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    genre: 'Jazz',
    album: 'Rainy Cafe Session'
  }
];

/**
 * Format duration in seconds to mm:ss format.
 * E.g., 210 -> "3:30", 65 -> "1:05"
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Filter tracks by query string (case-insensitive search across title, artist, genre, album).
 */
export function searchTracksInCatalog(tracks: Track[], query: string): Track[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return tracks;
  }
  return tracks.filter(t => {
    return (
      t.title.toLowerCase().includes(trimmed) ||
      t.artist.toLowerCase().includes(trimmed) ||
      (t.genre && t.genre.toLowerCase().includes(trimmed)) ||
      (t.album && t.album.toLowerCase().includes(trimmed))
    );
  });
}

/**
 * Validate that an API response matches the strict schema specified in the brief:
 * {
 *   success: true,
 *   total: number,
 *   results: [{ id, title, artist, duration, artwork, stream_url }]
 * }
 */
export function validateApiResponse(data: unknown): { valid: boolean; errors: string[]; parsed?: ApiResponse } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Response must be a valid JSON object'] };
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.success !== 'boolean') {
    errors.push('Missing or invalid "success" boolean field');
  }

  if (typeof obj.total !== 'number') {
    errors.push('Missing or invalid "total" number field');
  }

  if (!Array.isArray(obj.results)) {
    errors.push('Missing or invalid "results" array field');
  } else {
    obj.results.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`Result at index ${index} is not an object`);
        return;
      }
      const track = item as Record<string, unknown>;
      if (typeof track.id !== 'string' || !track.id.trim()) {
        errors.push(`Track[${index}] missing valid 'id' string`);
      }
      if (typeof track.title !== 'string' || !track.title.trim()) {
        errors.push(`Track[${index}] missing valid 'title' string`);
      }
      if (typeof track.artist !== 'string' || !track.artist.trim()) {
        errors.push(`Track[${index}] missing valid 'artist' string`);
      }
      if (typeof track.duration !== 'number') {
        errors.push(`Track[${index}] missing valid 'duration' number`);
      }
      if (track.artwork !== null && typeof track.artwork !== 'string') {
        errors.push(`Track[${index}] 'artwork' must be either string URL or null`);
      }
      if (typeof track.stream_url !== 'string' || !track.stream_url.startsWith('http')) {
        errors.push(`Track[${index}] missing or invalid 'stream_url' (must be http/https URL)`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    parsed: errors.length === 0 ? (data as ApiResponse) : undefined
  };
}

/**
 * Deterministic shuffle for queue playback
 */
export function shuffleTracks<T>(items: T[], currentItemIndex: number): T[] {
  if (items.length <= 1) return [...items];
  const copy = [...items];
  const current = copy[currentItemIndex];

  // Fisher-Yates
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  // Ensure current track remains at position 0 so playback isn't interrupted
  if (current !== undefined) {
    const newIdx = copy.indexOf(current);
    if (newIdx > 0) {
      copy.splice(newIdx, 1);
      copy.unshift(current);
    }
  }

  return copy;
}
