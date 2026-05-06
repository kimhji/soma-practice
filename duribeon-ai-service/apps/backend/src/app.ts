import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { config, corsOrigins } from './config.js';
import { logger } from './logger.js';
import { authRouter } from './routes/auth.js';
import { pipelineRouter } from './routes/pipeline.js';
import { missionRouter } from './routes/mission.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: corsOrigins, credentials: false }));
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  app.get('/healthz', (_req, res) => res.json({ ok: true }));
  app.use('/api/auth', rateLimit({ windowMs: 60_000, limit: config.GUEST_SESSION_REQUESTS_PER_MINUTE }), authRouter);
  app.use('/api/pipeline', rateLimit({ windowMs: 60_000, limit: config.PIPELINE_REQUESTS_PER_MINUTE }), pipelineRouter);
  app.use('/api/mission', rateLimit({ windowMs: 60_000, limit: config.VERIFY_REQUESTS_PER_MINUTE }), missionRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof ZodError) return res.status(400).json({ message: 'Validation error', details: err.flatten() });
    logger.error({ err }, 'request failed');
    return res.status(500).json({ message: err instanceof Error ? err.message : 'Internal server error' });
  });
  return app;
}
