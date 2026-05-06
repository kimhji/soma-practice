import pino from 'pino';
import { config } from './config.js';

export const logger = pino({
  level: config.LOG_LEVEL,
  redact: ['req.headers.authorization', 'authorization', 'UPSTAGE_API_KEY']
});
