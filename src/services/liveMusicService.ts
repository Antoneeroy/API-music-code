import CryptoJS from 'crypto-js';
import { Track } from '../types/music.ts';
import { SAMPLE_CATALOG, searchTracksInCatalog } from '../utils/musicApi.ts';

// In-memory cache for fast sub-5ms responses
const cache = new Map<string, { timestamp: number; tracks: Track[] }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes cache

// JioSaavn DES encryption key (publicly known DES-ECB key)
const SAAVN_DES_KEY = CryptoJS.enc.Utf8.parse('38346591');

/**
 * Decrypts JioSaavn encrypted media URL into direct progressive CDN streaming URL.
 * Produces 100% FULL-LENGTH songs (not 30-second previews).
 */
export function decryptSaavnMediaUrl(encryptedUrl?: string): string | null {
  if (!encryptedUrl || typeof encryptedUrl !== 'string') return null;
  try {
    const decrypted = CryptoJS.DES.decrypt(
      CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(encryptedUrl.trim())
      }),
      SAAVN_DES_KEY,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    const rawUrl = decrypted.toString(CryptoJS.enc.Utf8);
    if (!rawUrl || !rawUrl.startsWith('http')) return null;

    // Use 160kbps high quality audio for fast buffering and rich audio fidelity
    return rawUrl.replace('_96.mp4', '_160.mp4').replace('_48.mp4', '_160.mp4');
  } catch (err) {
    console.warn('Failed to decrypt media URL:', err);
    return null;
  }
}

/**
 * Clean HTML entity encoding e.g. &quot; -> ", &amp; -> &
 */
function decodeHtmlEntities(str?: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * JioSaavn Raw Search Item Interface
 */
interface SaavnRawSong {
  id: string;
  title: string;
  image?: string;
  language?: string;
  more_info?: {
    duration?: string;
    album?: string;
    encrypted_media_url?: string;
    artistMap?: {
      primary_artists?: Array<{ name: string }>;
      artists?: Array<{ name: string; role?: string }>;
    };
  };
}

/**
 * Fetch 100% FULL-LENGTH songs across Hindi, Bhojpuri, Bollywood, Punjabi, and Regional Music
 */
export async function fetchLiveMusicSearch(query: string, limit: number = 30): Promise<Track[]> {
  const clean = query.trim();
  if (!clean) {
    return fetchLiveTrending('All', limit);
  }

  const cacheKey = `search:${clean.toLowerCase()}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.tracks;
  }

  const tracks: Track[] = [];

  try {
    // 1. Query JioSaavn for 100% FULL-LENGTH songs (Hindi, Bhojpuri, Bollywood, Punjabi, etc.)
    const saavnUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&q=${encodeURIComponent(
      clean
    )}&p=1&n=${limit}&_format=json&_marker=0&api_version=4&ctx=android`;

    const res = await fetch(saavnUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results)) {
        for (const item of data.results as SaavnRawSong[]) {
          const encUrl = item.more_info?.encrypted_media_url;
          const streamUrl = decryptSaavnMediaUrl(encUrl);
          if (!streamUrl) continue;

          // Parse primary artists
          const primaryArtists = item.more_info?.artistMap?.primary_artists?.map(a => a.name) || [];
          const artistName = primaryArtists.length > 0
            ? primaryArtists.join(', ')
            : (item.more_info?.artistMap?.artists?.map(a => a.name).join(', ') || 'Various Artists');

          // High-res 500x500 album art
          const artwork = item.image
            ? item.image.replace(/150x150/g, '500x500').replace(/50x50/g, '500x500')
            : null;

          const durationSeconds = item.more_info?.duration
            ? parseInt(item.more_info.duration, 10)
            : 210;

          tracks.push({
            id: `sn_${item.id}`,
            title: decodeHtmlEntities(item.title),
            artist: decodeHtmlEntities(artistName),
            duration: durationSeconds,
            artwork: artwork,
            stream_url: streamUrl, // 100% FULL SONG CDN STREAM (NOT 30s preview)
            genre: (item.language ? item.language.charAt(0).toUpperCase() + item.language.slice(1) : 'Music'),
            album: decodeHtmlEntities(item.more_info?.album || 'Single')
          });
        }
      }
    }
  } catch (err) {
    console.warn('JioSaavn search query failed, checking local catalog:', err);
  }

  // Also include local matches if any
  const localMatches = searchTracksInCatalog(SAMPLE_CATALOG, clean);
  const combined = [...tracks, ...localMatches];

  // Deduplicate by ID
  const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());

  if (unique.length > 0) {
    cache.set(cacheKey, { timestamp: Date.now(), tracks: unique });
    return unique;
  }

  return localMatches;
}

/**
 * Fetch 100% Full-Length Trending Tracks (Bhojpuri Hits, Bollywood Hits, Punjabi, Lo-Fi)
 */
export async function fetchLiveTrending(genre?: string, limit: number = 30): Promise<Track[]> {
  const selectedGenre = genre || 'All';
  const cacheKey = `trending:${selectedGenre.toLowerCase()}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.tracks;
  }

  // Target query tailored for selected genre
  let searchQuery = 'arijit singh superhit';
  if (selectedGenre === 'Bhojpuri') {
    searchQuery = 'pawan singh khesari lal bhojpuri hit';
  } else if (selectedGenre === 'Hindi' || selectedGenre === 'Bollywood') {
    searchQuery = 'arijit singh romantic hits';
  } else if (selectedGenre === 'Punjabi') {
    searchQuery = 'diljit dosanjh punjabi hits';
  } else if (selectedGenre === 'Lo-Fi') {
    searchQuery = 'lofi chai chill';
  } else if (selectedGenre === 'Acoustic') {
    searchQuery = 'acoustic guitar unplugged';
  } else if (selectedGenre === 'All') {
    searchQuery = 'top songs 2026';
  }

  try {
    const live = await fetchLiveMusicSearch(searchQuery, limit);
    if (live.length > 0) {
      cache.set(cacheKey, { timestamp: Date.now(), tracks: live });
      return live;
    }
  } catch (err) {
    console.warn('Failed to fetch trending, falling back to sample catalog:', err);
  }

  return SAMPLE_CATALOG;
}
