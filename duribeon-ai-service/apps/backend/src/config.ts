import 'dotenv/config';
import { z } from 'zod';

const ConfigSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(8080),
  LOG_LEVEL: z.string().default('info'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  GUEST_JWT_SECRET: z.string().min(16),
  GUEST_JWT_EXPIRES_IN_SECONDS: z.coerce.number().default(43200),
  UPSTAGE_API_KEY: z.string().min(1),
  UPSTAGE_BASE_URL: z.string().url().default('https://api.upstage.ai/v1'),
  UPSTAGE_MODEL: z.string().default('solar-pro3'),
  UPSTAGE_VISION_MODEL: z.string().default('solar-pro3'),
  MISSION_VERIFICATION_MODE: z.enum(['vision', 'caption_only']).default('caption_only'),
  MAX_IMAGE_BYTES: z.coerce.number().default(5242880),
  PIPELINE_REQUESTS_PER_MINUTE: z.coerce.number().default(20),
  VERIFY_REQUESTS_PER_MINUTE: z.coerce.number().default(20),
  GUEST_SESSION_REQUESTS_PER_MINUTE: z.coerce.number().default(10)
});

export const config = ConfigSchema.parse(process.env);
export const corsOrigins = config.CORS_ORIGINS.split(',').map((v) => v.trim()).filter(Boolean);
