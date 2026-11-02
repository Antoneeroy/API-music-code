import React, { useState, useEffect } from 'react';
import {
  Search,
  Flame,
  Heart,
  Code2,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Radio,
  Music2,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PlayerProvider, usePlayer } from './context/PlayerContext.tsx';
import { Track } from './types/music.ts';
import { TrackCard } from './components/TrackCard.tsx';
import { TrackRow } from './components/TrackRow.tsx';
import { PlayerBar } from './components/PlayerBar.tsx';
import { ExpandedPlayer } from './components/ExpandedPlayer.tsx';
import { QueueDrawer } from './components/QueueDrawer.tsx';
import { AndroidIntegrationGuide } from './components/AndroidIntegrationGuide.tsx';
import { useDebounce } from './hooks/useDebounce.ts';
import { SAMPLE_CATALOG, searchTracksInCatalog, formatDuration } from './utils/musicApi.ts';

type NavigationTab = 'trending' | 'search' | 'library' | 'api-hub';

const MainContent: React.FC = () => {
  const { currentTrack, isPlaying, playTrack, likedTrackIds, apiBaseUrl } = usePlayer();
  const [activeTab, setActiveTab] = useState<NavigationTab>('trending');

  // Search state with debounce
  const [searchQuery, setSearchQuery] = useState('');
  const { debouncedValue, isDebouncing } = useDebounce(searchQuery, 400);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Trending state
  const [trendingTracks, setTrendingTracks] = useState<Track[]>(SAMPLE_CATALOG);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [isLoadingTrending, setIsLoadingTrending] = useState<boolean>(false);

  // Fetch trending tracks from /api/trending
  useEffect(() => {
    let isMounted = true;
    const fetchTrending = async () => {
      setIsLoadingTrending(true);
      try {
        const base = apiBaseUrl || '';
        const res = await fetch(`${base}/api/trending`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.results)) {
          setTrendingTracks(data.results);
        }
      } catch (err) {
        console.warn('Using local fallback catalog for trending:', err);
        if (isMounted) {
          setTrendingTracks(SAMPLE_CATALOG);
        }
      } finally {
        if (isMounted) setIsLoadingTrending(false);
      }
    };

    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  // Fetch search tracks from /api/search?q={query} on debounced change
  useEffect(() => {
    let isMounted = true;
    const trimmed = debouncedValue.trim();

    if (!trimmed) {
      setSearchResults(SAMPLE_CATALOG);
      setSearchError(null);
      setIsLoadingSearch(false);
      return;
    }

    const fetchSearch = async () => {
      setIsLoadingSearch(true);
      setSearchError(null);
      try {
        const base = apiBaseUrl || '';
        const res = await fetch(`${base}/api/search?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.results)) {
            setSearchResults(data.results);
          } else {
            setSearchResults([]);
          }
        }
      } catch (err) {
        console.warn('Fallback to client search:', err);
        if (isMounted) {
          const fallback = searchTracksInCatalog(SAMPLE_CATALOG, trimmed);
          setSearchResults(fallback);
        }
      } finally {
        if (isMounted) setIsLoadingSearch(false);
      }
    };

    fetchSearch();
    return () => {
      isMounted = false;
    };
  }, [debouncedValue, apiBaseUrl]);

  // Filter trending tracks by selected genre
  const genres = ['All', 'Acoustic', 'Desi Acoustic', 'Lo-Fi', 'Electronic', 'Ambient', 'Classical', 'Funk', 'Jazz', 'Folk Fusion'];
  const filteredTrending = selectedGenre === 'All'
    ? trendingTracks
    : trendingTracks.filter(t => t.genre?.toLowerCase() === selectedGenre.toLowerCase());

  // Liked tracks list
  const likedTracks = SAMPLE_CATALOG.filter(t => likedTrackIds.has(t.id));

  // Featured track (e.g. first acoustic track)
  const heroTrack = trendingTracks[0] || SAMPLE_CATALOG[0];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-500/20">
              <Radio className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white leading-none">
                  SoundWave
                </h1>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  Free CDN API
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-none mt-1">
                Direct Legal Streaming · ₹0 Cost
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'trending'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Trending</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Search className="w-4 h-4 text-neutral-400" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'library'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Favorites</span>
              {likedTrackIds.size > 0 && (
                <span className="text-[10px] text-neutral-400 font-mono">
                  ({likedTrackIds.size})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('api-hub')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'api-hub'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-neutral-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Android & API</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 pb-28">
        {/* ========================================================= */}
        {/* TAB 1: TRENDING / HOME FEED                               */}
        {/* ========================================================= */}
        {activeTab === 'trending' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Featured Hero Banner */}
            {heroTrack && (
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800/80 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/30 p-6 sm:p-8">
                <div className="relative z-10 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Progressive Stream</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                    {heroTrack.title}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-300 mb-4">
                    By <span className="font-semibold text-neutral-100">{heroTrack.artist}</span>
                    {heroTrack.album && ` · Album: ${heroTrack.album}`}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => playTrack(heroTrack, trendingTracks)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>{currentTrack?.id === heroTrack.id && isPlaying ? 'Playing Now' : 'Play Track'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('search');
                        setSearchQuery(heroTrack.genre || 'acoustic');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700/60 transition-colors"
                    >
                      Explore More {heroTrack.genre}
                    </button>
                  </div>
                </div>

                <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 rounded-xl overflow-hidden shadow-2xl border border-neutral-700/60">
                  <img
                    src={heroTrack.artwork || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80'}
                    alt={heroTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Trending Feed Header & Genre Filter Bar */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100">
                    Trending Tracks
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Live from <code className="text-amber-400 font-mono">/api/trending</code> endpoint
                  </p>
                </div>

                {/* Genre Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        selectedGenre === genre
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Trending Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredTrending.map(track => (
                  <TrackCard key={track.id} track={track} allTracks={filteredTrending} />
                ))}
              </div>
            </div>

            {/* Spec Highlight Callout */}
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Tracks streamed directly from legal progressive CDNs. No media stored on backend server = ₹0 bandwidth bill.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('api-hub')}
                className="text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap flex items-center gap-1"
              >
                <span>View Android Media3 Snippets</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SEARCH TRACKS (WITH 400MS DEBOUNCE)                */}
        {/* ========================================================= */}
        {activeTab === 'search' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-neutral-100">
                Search Audio Catalog
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Connected to <code className="text-amber-400 font-mono">/api/search?q={'{query}'}</code> with built-in 400ms debounce
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by song title, artist, genre (e.g. 'acoustic', 'lofi', 'benjamin')..."
                className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-10 pr-24 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                autoFocus
              />

              {/* Debounce / Status Indicator */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                {isDebouncing ? (
                  <span className="text-[11px] font-mono text-amber-400 animate-pulse bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    400ms debounce...
                  </span>
                ) : searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1 bg-neutral-800 rounded"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>

            {/* Quick Query Pills */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Quick Searches:</span>
              {['acoustic', 'lo-fi', 'electronic', 'ambient', 'guitar', 'piano'].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSearchQuery(q)}
                  className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-neutral-700 transition-colors font-mono text-[11px]"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Results Status */}
            <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/80 pb-2">
              <span>
                {isLoadingSearch
                  ? 'Searching API...'
                  : `${searchResults.length} ${searchResults.length === 1 ? 'track found' : 'tracks found'} for "${debouncedValue || 'all'}"`}
              </span>
              <span className="font-mono text-[11px] text-neutral-500">
                GET /api/search?q={encodeURIComponent(debouncedValue)}
              </span>
            </div>

            {/* Results List */}
            {searchResults.length === 0 ? (
              <div className="py-16 text-center bg-neutral-900/30 rounded-2xl border border-neutral-900">
                <Music2 className="w-10 h-10 mx-auto text-neutral-600 mb-3" />
                <h4 className="text-sm font-semibold text-neutral-300">No tracks matched your query</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try searching for terms like &quot;acoustic&quot;, &quot;sunset&quot;, &quot;synth&quot;, or click one of the quick suggestions above.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx}
                    allTracks={searchResults}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: FAVORITES & LIKED SONGS                            */}
        {/* ========================================================= */}
        {activeTab === 'library' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  <span>Favorite Tracks</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Locally saved tracks in your personal listening library ({likedTracks.length} tracks)
                </p>
              </div>

              {likedTracks.length > 0 && (
                <button
                  type="button"
                  onClick={() => playTrack(likedTracks[0], likedTracks)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-transform active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Play All Favorites</span>
                </button>
              )}
            </div>

            {likedTracks.length === 0 ? (
              <div className="py-16 text-center bg-neutral-900/30 rounded-2xl border border-neutral-900">
                <Heart className="w-10 h-10 mx-auto text-neutral-600 mb-3" />
                <h4 className="text-sm font-semibold text-neutral-300">No favorite songs yet</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Click the heart icon on any track in Trending or Search to add it to your library.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {likedTracks.map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx}
                    allTracks={likedTracks}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ANDROID & API DEV HUB                              */}
        {/* ========================================================= */}
        {activeTab === 'api-hub' && (
          <div className="animate-in fade-in duration-200">
            <AndroidIntegrationGuide />
          </div>
        )}
      </main>

      {/* Slide-over Queue Drawer */}
      <QueueDrawer />

      {/* Full-screen Expanded Player */}
      <ExpandedPlayer />

      {/* Persistent Bottom Player Bar */}
      <PlayerBar />
    </div>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <MainContent />
    </PlayerProvider>
  );
}
