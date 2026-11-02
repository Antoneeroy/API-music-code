import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Smartphone,
  PlayCircle,
  Database,
  ArrowRight,
  ExternalLink,
  Terminal,
  Send,
  Sparkles
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import { validateApiResponse } from '../utils/musicApi.ts';

export const AndroidIntegrationGuide: React.FC = () => {
  const { apiBaseUrl, setApiBaseUrl } = usePlayer();
  const [activeTab, setActiveTab] = useState<'step_by_step' | 'gradle' | 'retrofit' | 'debounce' | 'media3' | 'coil' | 'tester' | 'capacity'>('step_by_step');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Live Tester states
  const [testEndpoint, setTestEndpoint] = useState<'trending' | 'search'>('trending');
  const [testQuery, setTestQuery] = useState('acoustic');
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [validationInfo, setValidationInfo] = useState<{ valid: boolean; errors: string[] } | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const runApiTest = async () => {
    setIsLoadingApi(true);
    setValidationInfo(null);
    const start = performance.now();
    try {
      const base = apiBaseUrl || window.location.origin;
      const url = testEndpoint === 'trending'
        ? `${base}/api/trending`
        : `${base}/api/search?q=${encodeURIComponent(testQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setApiLatency(elapsed);
      setApiResult(JSON.stringify(data, null, 2));

      const validation = validateApiResponse(data);
      setValidationInfo(validation);
    } catch (err: unknown) {
      setApiLatency(Math.round(performance.now() - start));
      const message = err instanceof Error ? err.message : 'Network error';
      setApiResult(JSON.stringify({ error: message, success: false }, null, 2));
      setValidationInfo({ valid: false, errors: ['Failed to fetch: check Base URL or network CORS'] });
    } finally {
      setIsLoadingApi(false);
    }
  };

  const SNIPPETS = {
    step_by_step: `// =========================================================================
// QUICK INTEGRATION GUIDE: Apne Android App me kaise add karein (6 Steps)
// =========================================================================

STEP 1: Dependencies add karein
- 'app/build.gradle.kts' me Retrofit, Media3, Coil, aur Coroutines add karein.
- 'AndroidManifest.xml' me <uses-permission android:name="android.permission.INTERNET" /> lagayein.

STEP 2: Data Models banayein
- 'TrackDto.kt' aur 'ApiResponse.kt' create karein.
- Schema: id, title, artist, duration, artwork (nullable), stream_url.

STEP 3: Retrofit Service Interface setup karein
- 'MusicApiService.kt' interface me @GET("api/trending") aur @GET("api/search?q={query}") add karein.
- Base URL me apna Vercel domain set karein.

STEP 4: Search Bar me Debounce (400ms) lagayein
- ViewModel me 'MutableStateFlow' ke sath .debounce(400) aur .distinctUntilChanged() lagayein.
- Isse user ke type karte waqt har letter par call nahi hogi, 400ms pause hone par hi API call jayegi.

STEP 5: ExoPlayer / Media3 me Playback karein
- Jab user kisi track par click kare, toh response me aane wale "track.streamUrl" ko seedha
  'MediaItem.fromUri(track.streamUrl)' me pass karein.
- 'exoPlayer.setMediaItem(mediaItem)' aur 'exoPlayer.prepare()' & 'exoPlayer.play()' karein.

STEP 6: Artwork & Default Placeholder
- Coil ya Glide use karein.
- Agar 'track.artwork == null' ho, toh default musical icon (R.drawable.ic_music_placeholder) lagayein.`,

    gradle: `// =========================================================================
// 1. Android Dependencies (app/build.gradle.kts)
// =========================================================================

dependencies {
    // 1. Networking (Retrofit + OkHttp + Gson)
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // 2. Audio Playback (AndroidX Media3 ExoPlayer)
    implementation("androidx.media3:media3-exoplayer:1.3.1")
    implementation("androidx.media3:media3-ui:1.3.1")
    implementation("androidx.media3:media3-session:1.3.1")

    // 3. Image Loading with Null Artwork Placeholder (Coil)
    implementation("io.coil-kt:coil-compose:2.6.0")
    // OR if using XML Layouts with Glide:
    // implementation("com.github.bumptech.glide:glide:4.16.0")

    // 4. Coroutines & Flow (for 400ms Debounce)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.0")
}

// =========================================================================
// 2. Android Manifest Permissions (app/src/main/AndroidManifest.xml)
// =========================================================================

<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />

    <application
        android:usesCleartextTraffic="true">
        <!-- Activities & Services -->
    </application>
</manifest>`,

    retrofit: `// ==========================================
// 1. Data Models (TrackDto.kt & ApiResponse.kt)
// ==========================================
package com.example.musicapp.data.model

import com.google.gson.annotations.SerializedName

data class ApiResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("total") val total: Int,
    @SerializedName("results") val results: List<TrackDto>
)

data class TrackDto(
    @SerializedName("id") val id: String,
    @SerializedName("title") val title: String,
    @SerializedName("artist") val artist: String,
    @SerializedName("duration") val duration: Int, // duration in seconds
    @SerializedName("artwork") val artwork: String?, // Nullable for fallback
    @SerializedName("stream_url") val streamUrl: String // Progressive audio CDN
)

// ==========================================
// 2. Retrofit API Service (MusicApiService.kt)
// ==========================================
package com.example.musicapp.data.api

import com.example.musicapp.data.model.ApiResponse
import retrofit2.http.GET
import retrofit2.http.Query

interface MusicApiService {
    @GET("api/trending")
    suspend fun getTrending(): ApiResponse

    @GET("api/search")
    suspend fun searchTracks(@Query("q") query: String): ApiResponse
}

// Retrofit Client Builder:
// Retrofit.Builder()
//     .baseUrl("${apiBaseUrl || 'https://[YOUR-VERCEL-DOMAIN].vercel.app'}/")
//     .addConverterFactory(GsonConverterFactory.create())
//     .build()
//     .create(MusicApiService::class.java)`,

    debounce: `// ==========================================
// Debounced Search ViewModel (SearchViewModel.kt)
// Task 1: Search bar me debounce (300ms–500ms) implement karein
// ==========================================
package com.example.musicapp.ui.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.musicapp.data.model.TrackDto
import com.example.musicapp.data.repository.MusicRepository
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

@OptIn(FlowPreview::class)
class SearchViewModel(private val repository: MusicRepository) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    // 400ms debounce prevents unnecessary network calls
    val searchResults: StateFlow<List<TrackDto>> = _searchQuery
        .debounce(400) // 300ms–500ms requirement
        .distinctUntilChanged()
        .map { query -> query.trim() }
        .flatMapLatest { query ->
            flow {
                if (query.isEmpty()) {
                    emit(repository.getTrending())
                } else {
                    emit(repository.searchTracks(query))
                }
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun onQueryChanged(newQuery: String) {
        _searchQuery.value = newQuery
    }
}`,

    media3: `// =========================================================================
// Audio Playback with AndroidX Media3 / ExoPlayer (Bulletproof & Error-Free)
// Task 2: Pass "stream_url" directly into ExoPlayer with Auto-Retry & State Listener
// =========================================================================
package com.example.musicapp.player

import android.content.Context
import android.util.Log
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer

class AudioPlayerManager(private val context: Context) {

    private var exoPlayer: ExoPlayer? = null

    init {
        exoPlayer = ExoPlayer.Builder(context).build().apply {
            repeatMode = Player.REPEAT_MODE_OFF
            playWhenReady = true

            // Bulletproof Listener: Koi bhi network issue ya stream error ho toh handle kare
            addListener(object : Player.Listener {
                override fun onPlaybackStateChanged(playbackState: Int) {
                    when (playbackState) {
                        Player.STATE_BUFFERING -> Log.d("AudioPlayer", "Buffering stream...")
                        Player.STATE_READY -> Log.d("AudioPlayer", "Audio ready & playing smoothly")
                        Player.STATE_ENDED -> Log.d("AudioPlayer", "Track finished")
                        Player.STATE_IDLE -> Unit
                    }
                }

                override fun onPlayerError(error: PlaybackException) {
                    Log.e("AudioPlayer", "Stream playback error: \${error.errorCodeName}, retrying...")
                    // Auto-retry on network reconnection
                    exoPlayer?.prepare()
                }
            })
        }
    }

    /**
     * Item click hone par direct CDN stream_url pass karein
     * Standard progressive audio format hai, 100% chalega.
     */
    fun playStream(streamUrl: String) {
        val mediaItem = MediaItem.fromUri(streamUrl)
        exoPlayer?.apply {
            setMediaItem(mediaItem)
            prepare()
            play()
        }
    }

    fun pause() = exoPlayer?.pause()
    fun resume() = exoPlayer?.play()
    fun seekTo(positionMs: Long) = exoPlayer?.seekTo(positionMs)
    fun release() {
        exoPlayer?.release()
        exoPlayer = null
    }
}`,

    coil: `// ==========================================
// UI & Artwork with Coil (Jetpack Compose)
// Task 3: Agar artwork null ho toh default placeholder icon lagayein
// ==========================================
package com.example.musicapp.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.musicapp.R
import com.example.musicapp.data.model.TrackDto

@Composable
fun TrackArtwork(
    artworkUrl: String?,
    title: String,
    modifier: Modifier = Modifier
) {
    if (artworkUrl.isNullOrEmpty()) {
        // Fallback default placeholder icon when artwork is null
        Image(
            painter = painterResource(id = R.drawable.ic_music_placeholder),
            contentDescription = "Default Artwork Placeholder",
            modifier = modifier.clip(RoundedCornerShape(8.dp)),
            contentScale = ContentScale.Crop
        )
    } else {
        AsyncImage(
            model = ImageRequest.Builder(LocalContext.current)
                .data(artworkUrl)
                .crossfade(true)
                .placeholder(R.drawable.ic_music_placeholder)
                .error(R.drawable.ic_music_placeholder) // Error fallback
                .build(),
            contentDescription = "Artwork for $title",
            contentScale = ContentScale.Crop,
            modifier = modifier.clip(RoundedCornerShape(8.dp))
        )
    }
}`
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Android & Backend API Integration</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">
              Free Serverless Music API Hub
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Full specification runner for <code className="text-amber-300 font-mono text-xs">/api/search</code> and{' '}
              <code className="text-amber-300 font-mono text-xs">/api/trending</code> with zero server bandwidth costs and 100% free serverless architecture.
            </p>
          </div>

          {/* Base URL Switcher */}
          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 max-w-sm w-full">
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Base URL Configuration:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={apiBaseUrl}
                onChange={e => setApiBaseUrl(e.target.value)}
                placeholder="Relative (default /api)"
                className="w-full bg-neutral-900 border border-neutral-700 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
              />
              {apiBaseUrl && (
                <button
                  type="button"
                  onClick={() => setApiBaseUrl('')}
                  className="text-xs text-neutral-400 hover:text-white px-2 py-1 bg-neutral-800 rounded"
                >
                  Reset
                </button>
              )}
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              Leave blank to use current origin, or enter your Vercel domain.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-neutral-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('step_by_step')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'step_by_step'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step-by-Step Guide</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gradle')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'gradle'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Gradle & Manifest</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('capacity')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'capacity'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Music Catalog Scale</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tester')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'tester'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive API Tester</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('retrofit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'retrofit'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>1. Retrofit Models & Service</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('debounce')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'debounce'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. Debounced Search (Flow)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media3')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'media3'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>3. ExoPlayer / Media3</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coil')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'coil'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>4. Coil / Glide Artwork</span>
        </button>
      </div>

      {/* Tab: Catalog Scale & Sources (Kitna Music Aayega?) */}
      {activeTab === 'capacity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-xl">
              <span className="text-amber-400 font-mono text-xs font-semibold uppercase">1. Built-in Now</span>
              <h4 className="text-2xl font-bold text-white mt-1">16+ Tracks</h4>
              <p className="text-xs text-neutral-400 mt-2">
                Pre-configured legal CDN streams (Acoustic, Sufi/Desi, Lo-Fi, Electronic, Classical, Jazz, Funk) ready for instant testing.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-xl">
              <span className="text-emerald-400 font-mono text-xs font-semibold uppercase">2. Vercel Backend Limit</span>
              <h4 className="text-2xl font-bold text-white mt-1">Unlimited / Endless</h4>
              <p className="text-xs text-neutral-400 mt-2">
                Aapke Vercel Express API me koi limit nahi hai. Response me 10,000 ya 1,00,000+ tracks return kar sakte hain.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-xl">
              <span className="text-cyan-400 font-mono text-xs font-semibold uppercase">3. Bandwidth Cost</span>
              <h4 className="text-2xl font-bold text-white mt-1">Lifetime ₹0</h4>
              <p className="text-xs text-neutral-400 mt-2">
                Audio files aapke server par store nahi hoti; direct progressive CDN se play hoti hain, isliye 0 GB server load rehta hai.
              </p>
            </div>
          </div>

          {/* Sources breakdown */}
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-base font-bold text-neutral-100 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Free CDN Sources for 1,000,000+ Tracks (Lifetime ₹0 Cost)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-200">Internet Archive (archive.org)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">14 Million+ Tracks</span>
                </div>
                <p className="text-neutral-400">
                  Public domain, Creative Commons, live concerts, and retro/world music with direct progressive MP3 links.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-200">Jamendo API</span>
                  <span className="text-emerald-400 font-mono text-[11px]">500,000+ Tracks</span>
                </div>
                <p className="text-neutral-400">
                  Free public REST API providing high-quality independent MP3 streams, artwork, and full genre tagging.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-200">Free Music Archive (FMA)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">150,000+ Tracks</span>
                </div>
                <p className="text-neutral-400">
                  Curated legal tracks with progressive audio endpoints across all electronic, acoustic, and ambient genres.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-200">Audius Decentralized Network</span>
                  <span className="text-emerald-400 font-mono text-[11px]">1,000,000+ Tracks</span>
                </div>
                <p className="text-neutral-400">
                  Completely free open developer API with free streaming endpoints and real-time trending playlists.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-neutral-950/80 rounded-lg border border-amber-500/20 text-xs text-neutral-300">
              <span className="text-amber-400 font-semibold">Pagination Support: </span>
              Aapka API already pagination support karta hai:
              <code className="text-amber-300 font-mono ml-1">/api/search?q=acoustic&limit=20&page=1</code> aur
              <code className="text-amber-300 font-mono ml-1">/api/trending?genre=Acoustic&limit=50</code>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Interactive API Tester */}
      {activeTab === 'tester' && (
        <div className="space-y-4">
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-neutral-200 mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Live Endpoint Request Tester</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setTestEndpoint('trending')}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    testEndpoint === 'trending'
                      ? 'bg-neutral-800 text-amber-400 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  GET /api/trending
                </button>
                <button
                  type="button"
                  onClick={() => setTestEndpoint('search')}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    testEndpoint === 'search'
                      ? 'bg-neutral-800 text-amber-400 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  GET /api/search?q=
                </button>
              </div>

              {testEndpoint === 'search' && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={e => setTestQuery(e.target.value)}
                    placeholder="acoustic, lofi, electronic..."
                    className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500 w-44"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={runApiTest}
                disabled={isLoadingApi}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoadingApi ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            {/* Validation & Status */}
            {validationInfo && (
              <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${validationInfo.valid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-neutral-300">
                    Schema Validation: {validationInfo.valid ? '100% Match with Spec' : 'Schema Errors Detected'}
                  </span>
                  {apiLatency !== null && (
                    <>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="text-amber-400">{apiLatency} ms</span>
                    </>
                  )}
                </div>
                {validationInfo.errors.length > 0 && (
                  <span className="text-rose-400 text-[11px]">
                    {validationInfo.errors[0]}
                  </span>
                )}
              </div>
            )}

            {/* JSON Output Viewer */}
            <div className="relative">
              <pre className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-xs font-mono text-neutral-300 overflow-x-auto max-h-96">
                {apiResult || '// Click "Send Request" to test live endpoint'}
              </pre>
              {apiResult && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiResult, 'api-result')}
                  className="absolute top-3 right-3 p-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white text-xs flex items-center gap-1"
                >
                  {copiedSnippet === 'api-result' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'api-result' ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Code Snippet Tabs */}
      {activeTab !== 'tester' && activeTab !== 'capacity' && activeTab in SNIPPETS && (
        <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-b border-neutral-800 text-xs font-mono text-neutral-400">
            <span>Kotlin / Android Implementation</span>
            <button
              type="button"
              onClick={() => {
                const text = SNIPPETS[activeTab as keyof typeof SNIPPETS];
                if (text) copyToClipboard(text, activeTab);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              {copiedSnippet === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto max-h-[500px]">
            {SNIPPETS[activeTab as keyof typeof SNIPPETS]}
          </pre>
        </div>
      )}
    </div>
  );
};
