import { Router } from 'express';
import { generateMissions, regenerateOne } from '../services/mission.js';

export const missionRouter = Router();

missionRouter.post('/', async (req, res, next) => {
  try {
    const missions = await generateMissions(req.body);
    res.json({ missions });
  } catch (error) {
    next(error);
  }
});

missionRouter.post('/regenerate-one', async (req, res, next) => {
  try {
    const mission = await regenerateOne(req.body);
    res.json({ mission });
  } catch (error) {
    next(error);
  }
});
