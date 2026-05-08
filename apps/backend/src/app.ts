import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';
import { config } from './config.js';
import { missionRouter } from './routes/missions.js';
import { verifyRouter } from './routes/verify.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.CORS_ORIGIN }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/healthz', (_req, res) => res.json({ ok: true }));
  app.use('/api/missions', missionRouter);
  app.use('/api/verify', verifyRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    if (err instanceof ZodError) {
      res.status(400).json({ message: 'validation failed', issues: err.issues });
      return;
    }
    res.status(500).json({ message: err instanceof Error ? err.message : 'unknown error' });
  });

  return app;
}
