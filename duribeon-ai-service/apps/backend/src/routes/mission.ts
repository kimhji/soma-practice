import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { config } from '../config.js';
import { requireGuest } from '../middleware/auth.js';
import { verifyMission } from '../services/verification-service.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: config.MAX_IMAGE_BYTES } });
export const missionRouter = Router();

const VerifyBodySchema = z.object({
  missionTitle: z.string().min(1),
  proof: z.string().min(1),
  placeId: z.string().min(1),
  caption: z.string().optional(),
  language: z.enum(['ko', 'en']).default('ko')
});

missionRouter.post('/verify', requireGuest, upload.single('image'), async (req, res, next) => {
  try {
    const body = VerifyBodySchema.parse(req.body);
    const result = await verifyMission({ ...body, file: req.file });
    res.json(result);
  } catch (err) { next(err); }
});
