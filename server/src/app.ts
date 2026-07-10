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
    phase: 'Phase 2 - AI Engine Active',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
  });
});

// Root fallback
app.get('/', (_req: Request, res: Response) => {
  res.send('Promptfolio API Server is running. Access /api/health for diagnostics.');
});

export default app;
