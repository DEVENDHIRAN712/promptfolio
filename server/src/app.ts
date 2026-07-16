import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { getDBStatus } from './config/db';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import resumeRoutes from './routes/resume.routes';
import githubRoutes from './routes/github.routes';
import aiRoutes from './routes/ai.routes';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploaded resumes and avatars
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Promptfolio API',
    phase: 'Phase 4 - Public Portfolio & SEO Active',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
  });
});

// SEO & Sitemap Endpoints
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: http://localhost:5000/sitemap.xml\n`);
});

app.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const { Profile } = await import('./models/Profile');
    const profiles = await Profile.find({ isPublished: true });
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url>\n    <loc>http://localhost:5173/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    for (const p of profiles) {
      if (p.username) {
        xml += `  <url>\n    <loc>http://localhost:5173/p/${p.username}</loc>\n    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      }
    }
    xml += `</urlset>`;
    res.type('application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// Root fallback
app.get('/', (_req: Request, res: Response) => {
  res.send('Promptfolio API Server is running. Access /api/health for diagnostics.');
});

export default app;
