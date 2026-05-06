import { Router } from 'express';
import { signGuestToken } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/guest', (_req, res) => {
  res.json({ token: signGuestToken() });
});
