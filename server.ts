import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAMPLE_CATALOG, searchTracksInCatalog } from './src/utils/musicApi.ts';
import { fetchLiveMusicSearch, fetchLiveTrending } from './src/services/liveMusicService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Enable JSON body parsing and CORS headers for public API use
  app.use(express.json());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==========================================
  // SPECIFICATION ENDPOINTS (Connected to 100M+ Global CDN)
  // ==========================================

  /**
   * B. Trending / Home Feed
   * Method: GET
   * Endpoint: /api/trending
   * Supports optional query params: ?genre=Acoustic&limit=30&page=1&source=live|local
   */
  app.get('/api/trending', async (req: Request, res: Response) => {
    const genre = typeof req.query.genre === 'string' ? req.query.genre : '';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;
    const page = req.query.page ? Math.max(1, parseInt(req.query.page as string, 10)) : 1;
    const source = req.query.source === 'local' ? 'local' : 'live';

    let tracks = SAMPLE_CATALOG;
    if (source === 'live') {
      try {
        tracks = await fetchLiveTrending(genre, limit * 2);
      } catch (e) {
        console.warn('Live trending fallback to local catalog:', e);
      }
    } else if (genre && genre !== 'All') {
      tracks = tracks.filter(t => t.genre?.toLowerCase() === genre.toLowerCase());
    }

    const startIndex = (page - 1) * limit;
    const paginated = tracks.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      total: tracks.length,
      results: paginated
    });
  });

  /**
   * A. Search Tracks
   * Method: GET
   * Endpoint: /api/search?q={query}
   * Searches across 100M+ real tracks in progressive audio format
   */
  app.get('/api/search', async (req: Request, res: Response) => {
    const query = typeof req.query.q === 'string' ? req.query.q : '';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 40;
    const page = req.query.page ? Math.max(1, parseInt(req.query.page as string, 10)) : 1;
    const source = req.query.source === 'local' ? 'local' : 'live';

    let results = [];
    if (!query.trim()) {
      results = await fetchLiveTrending('Acoustic', limit);
    } else if (source === 'local') {
      results = searchTracksInCatalog(SAMPLE_CATALOG, query);
    } else {
      results = await fetchLiveMusicSearch(query, limit * 2);
    }

    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      total: results.length,
      results: paginated
    });
  });

  /**
   * Track by ID endpoint (convenience for direct deep linking)
   */
  app.get('/api/tracks/:id', (req: Request, res: Response) => {
    const track = SAMPLE_CATALOG.find(t => t.id === req.params.id);
    if (!track) {
      return res.status(404).json({
        success: false,
        total: 0,
        results: [],
        error: `Track with ID "${req.params.id}" not found`
      });
    }
    return res.json({
      success: true,
      total: 1,
      results: [track]
    });
  });

  /**
   * API Health & Specifications Meta
   */
  app.get('/api/health', (_req: Request, res: Response) => {
    return res.json({
      status: 'online',
      version: '1.0.0',
      stack: 'Node.js (Express)',
      cost: '100% Free / Serverless (Lifetime ₹0)',
      endpoints: {
        search: '/api/search?q={query}',
        trending: '/api/trending',
        trackById: '/api/tracks/:id'
      }
    });
  });

  // Mount Vite middlewares in development or static dist in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SoundWave API & Client server running at http://0.0.0.0:${PORT}`);
  });
}

createServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
