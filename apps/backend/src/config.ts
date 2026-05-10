import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: Number(process.env.PORT ?? 8080),
  HOST: process.env.HOST ?? '127.0.0.1',
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? 'http://127.0.0.1:5173,http://localhost:5173')
    .split(',')
    .map((v) => v.trim()),
  UPSTAGE_API_KEY: process.env.UPSTAGE_API_KEY ?? '',
  UPSTAGE_MODEL: process.env.UPSTAGE_MODEL ?? 'solar-pro3',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  OPENAI_VISION_MODEL: process.env.OPENAI_VISION_MODEL ?? 'gpt-4.1-mini',
};
