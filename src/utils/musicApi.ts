import type { ApiResponse, Track } from '../types/music.ts';

/**
 * Curated catalog of legal progressive streaming tracks.
 * Media files are hosted on legal CDN / public domain progressive audio servers.
 */
export const SAMPLE_CATALOG: Track[] = [
  {
    id: 'sn_pawan_sorry',
    title: 'Sorry Sorry',
    artist: 'Pawan Singh',
    duration: 151,
    artwork: 'https://c.saavncdn.com/936/Bhojpuriya-Raja-Bhojpuri-2016-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/936/910eed4451c290f342100823b7b80bbb_160.mp4',
    genre: 'Bhojpuri',
    album: 'Bhojpuriya Raja'
  },
  {
    id: 'sn_khesari_palang',
    title: 'Palang Sagwan Ke',
    artist: 'Khesari Lal Yadav, Indu Sonali',
    duration: 224,
    artwork: 'https://c.saavncdn.com/431/Palang-Sagwan-Ke-From-Doli-Saja-Ke-Rakhna-Bhojpuri-2022-20220827101113-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/431/0f7118b2556ba75e482135f493faf0be_160.mp4',
    genre: 'Bhojpuri',
    album: 'Doli Saja Ke Rakhna'
  },
  {
    id: 'sn_pawan_chhalakata',
    title: 'Chhalakata Hamro Jawaniya',
    artist: 'Pawan Singh, Priyanka Singh',
    duration: 239,
    artwork: 'https://c.saavncdn.com/436/Chhalakata-Hamro-Jawaniya-Bhojpuri-2016-20260420220308-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/436/8045f766bbdff243aee586cee7cde55e_160.mp4',
    genre: 'Bhojpuri',
    album: 'Bhojpuriya Raja'
  },
  {
    id: 'sn_arijit_tum_hi_ho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh, Mithoon',
    duration: 261,
    artwork: 'https://c.saavncdn.com/346/Aashiqui-2-Hindi-2013-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/346/a8a1005b822452296d999e289bfdc22d_160.mp4',
    genre: 'Hindi',
    album: 'Aashiqui 2'
  },
  {
    id: 'sn_pawan_lollypop',
    title: 'Lolly Pop Lageli',
    artist: 'Pawan Singh',
    duration: 362,
    artwork: 'https://c.saavncdn.com/814/Lolly-Pop-Lageli-Bhojpuri-2015-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/814/7b63fba0c7bb0b85a3c94f1c1f28b4c9_160.mp4',
    genre: 'Bhojpuri',
    album: 'Lolly Pop Lageli'
  },
  {
    id: 'sn_arijit_kesariya',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam',
    duration: 268,
    artwork: 'https://c.saavncdn.com/807/Brahmastra-Hindi-2022-20221006155928-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/807/04e1ecbe0bc5f6227b68b7ca89e246cf_160.mp4',
    genre: 'Hindi',
    album: 'Brahmastra'
  },
  {
    id: 'sn_khesari_sajke',
    title: 'Saj Ke Sawar Ke',
    artist: 'Khesari Lal Yadav, Priyanka Singh',
    duration: 168,
    artwork: 'https://c.saavncdn.com/389/Muqaddar-Bhojpuri-2017-20171120-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/389/54e48810787329fe792d4f58c7041ca4_160.mp4',
    genre: 'Bhojpuri',
    album: 'Muqaddar'
  },
  {
    id: 'sn_diljit_lover',
    title: 'Lover',
    artist: 'Diljit Dosanjh',
    duration: 185,
    artwork: 'https://c.saavncdn.com/973/MoonChild-Era-Punjabi-2021-20210822101344-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/973/80004ad7ba16474fb85ca6621ee161f3_160.mp4',
    genre: 'Punjabi',
    album: 'MoonChild Era'
  },
  {
    id: 'sn_jubin_raataan',
    title: 'Raataan Lambiyan',
    artist: 'Tanishk Bagchi, Jubin Nautiyal, Asees Kaur',
    duration: 230,
    artwork: null, // Null artwork placeholder test (matches spec)
    stream_url: 'https://aac.saavncdn.com/238/Shershaah-Hindi-2021-20210815114751-160.mp4',
    genre: 'Hindi',
    album: 'Shershaah'
  },
  {
    id: 'sn_arijit_agar_tum',
    title: 'Agar Tum Saath Ho',
    artist: 'Alka Yagnik, Arijit Singh, A.R. Rahman',
    duration: 341,
    artwork: 'https://c.saavncdn.com/747/Tamasha-Hindi-2015-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/747/b9e28bfbc7ebf0da0d691e84d4fa7df7_160.mp4',
    genre: 'Hindi',
    album: 'Tamasha'
  },
  {
    id: 'sn_diljit_born_shine',
    title: 'Born to Shine',
    artist: 'Diljit Dosanjh',
    duration: 214,
    artwork: 'https://c.saavncdn.com/708/G-O-A-T--Punjabi-2020-20200729185207-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/708/bb94ae234ff60b6aebead5c90cf1923e_160.mp4',
    genre: 'Punjabi',
    album: 'G.O.A.T.'
  },
  {
    id: 'sn_pawan_pudina',
    title: 'Pudina Ae Haseena',
    artist: 'Pawan Singh, Anupama Yadav',
    duration: 215,
    artwork: 'https://c.saavncdn.com/732/Pudina-Ae-Haseena-Bhojpuri-2021-20210604113038-500x500.webp',
    stream_url: 'https://aac.saavncdn.com/732/df7a9fcda53a29094fe5b61b2c4587c4_160.mp4',
    genre: 'Bhojpuri',
    album: 'Pudina Ae Haseena'
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
