import { Track } from '../types/music.ts';
import { SAMPLE_CATALOG, searchTracksInCatalog } from '../utils/musicApi.ts';

// In-memory cache to avoid repeated queries and achieve sub-5ms responses
const cache = new Map<string, { timestamp: number; tracks: Track[] }>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

interface ITunesResult {
  trackId?: number;
  collectionId?: number;
  trackName?: string;
  collectionName?: string;
  artistName?: string;
  trackTimeMillis?: number;
  artworkUrl100?: string;
  artworkUrl600?: string;
  previewUrl?: string;
  primaryGenreName?: string;
}

/**
 * Fetch tracks from the 100 Million+ Public Progressive Music Index
 */
export async function fetchLiveMusicSearch(query: string, limit: number = 30): Promise<Track[]> {
  const clean = query.trim();
  if (!clean) {
    return SAMPLE_CATALOG;
  }

  const cacheKey = `search:${clean.toLowerCase()}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.tracks;
  }

  try {
    const encoded = encodeURIComponent(clean);
    // Public Apple/iTunes search index with progressive streaming CDN URLs
    const url = `https://itunes.apple.com/search?term=${encoded}&entity=song&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SoundWaveMusic/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Public Music API returned status ${response.status}`);
    }

    const data = await response.json();
    const liveTracks: Track[] = [];

    if (Array.isArray(data.results)) {
      for (const item of data.results as ITunesResult[]) {
        if (!item.previewUrl || !item.trackName || !item.artistName) continue;

        // Obtain high-resolution 600x600 artwork
        const highResArt = item.artworkUrl100
          ? item.artworkUrl100.replace('100x100bb', '600x600bb')
          : null;

        liveTracks.push({
          id: String(item.trackId || Math.random().toString(36).substring(2, 9)),
          title: item.trackName,
          artist: item.artistName,
          duration: item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 180,
          artwork: highResArt,
          stream_url: item.previewUrl,
          genre: item.primaryGenreName || 'Music',
          album: item.collectionName || 'Single'
        });
      }
    }

    // Also include local matches if any
    const localMatches = searchTracksInCatalog(SAMPLE_CATALOG, clean);
    const combined = [...localMatches, ...liveTracks];

    // Deduplicate by ID
    const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());

    cache.set(cacheKey, { timestamp: Date.now(), tracks: unique });
    return unique;
  } catch (err) {
    console.warn('Live music search failed, falling back to local catalog:', err);
    return searchTracksInCatalog(SAMPLE_CATALOG, clean);
  }
}

/**
 * Fetch live trending tracks across popular categories
 */
export async function fetchLiveTrending(genre?: string, limit: number = 30): Promise<Track[]> {
  const cacheKey = `trending:${genre || 'all'}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.tracks;
  }

  // Determine search seed based on genre
  let searchSeed = 'top hits 2026';
  if (genre && genre !== 'All') {
    const genreMap: Record<string, string> = {
      'Acoustic': 'acoustic guitar',
      'Desi Acoustic': 'bollywood acoustic arijit',
      'Lo-Fi': 'lofi beats chill',
      'Electronic': 'electronic dance synthwave',
      'Ambient': 'ambient meditation sleep',
      'Classical': 'piano classical chopin',
      'Funk': 'funk groove',
      'Jazz': 'jazz cafe',
      'Folk Fusion': 'punjabi folk fusion',
      'Bollywood': 'arijit singh hits',
      'Punjabi': 'diljit dosanjh'
    };
    searchSeed = genreMap[genre] || genre;
  }

  try {
    const encoded = encodeURIComponent(searchSeed);
    const url = `https://itunes.apple.com/search?term=${encoded}&entity=song&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const liveTracks: Track[] = [];
    if (Array.isArray(data.results)) {
      for (const item of data.results as ITunesResult[]) {
        if (!item.previewUrl || !item.trackName || !item.artistName) continue;
        const highResArt = item.artworkUrl100
          ? item.artworkUrl100.replace('100x100bb', '600x600bb')
          : null;

        liveTracks.push({
          id: String(item.trackId || Math.random().toString(36).substring(2, 9)),
          title: item.trackName,
          artist: item.artistName,
          duration: item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 180,
          artwork: highResArt,
          stream_url: item.previewUrl,
          genre: genre && genre !== 'All' ? genre : (item.primaryGenreName || 'Pop'),
          album: item.collectionName || 'Trending'
        });
      }
    }

    // Blend with curated sample catalog
    const localFiltered = (!genre || genre === 'All')
      ? SAMPLE_CATALOG
      : SAMPLE_CATALOG.filter(t => t.genre?.toLowerCase() === genre.toLowerCase());

    const blended = [...localFiltered, ...liveTracks];
    const unique = Array.from(new Map(blended.map(t => [t.id, t])).values());

    cache.set(cacheKey, { timestamp: Date.now(), tracks: unique });
    return unique;
  } catch (err) {
    console.warn('Failed to fetch live trending, returning local catalog:', err);
    return SAMPLE_CATALOG;
  }
}
