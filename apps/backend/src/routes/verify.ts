import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { verifyMissionPhoto } from '../services/verify.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const BodySchema = z.object({
  mission: z.string().min(1),
  placeName: z.string().min(1),
  proof: z.string().min(1),
  caption: z.string().optional().default(''),
  language: z.enum(['ko', 'en']).default('ko'),
});

export const verifyRouter = Router();

verifyRouter.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'image file is required' });
      return;
    }
    const body = BodySchema.parse(req.body);
    const result = await verifyMissionPhoto({
      ...body,
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});
