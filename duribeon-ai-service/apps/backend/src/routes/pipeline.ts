import { Router } from 'express';
import { PipelineRequestSchema } from '../schemas.js';
import { requireGuest } from '../middleware/auth.js';
import { generateMissions } from '../services/mission-service.js';
import { initSse, sendEvent } from '../sse.js';

export const pipelineRouter = Router();

pipelineRouter.post('/run', requireGuest, async (req, res, next) => {
  try {
    const input = PipelineRequestSchema.parse(req.body);
    const result = await generateMissions(input);
    res.json(result);
  } catch (err) { next(err); }
});

pipelineRouter.post('/stream', requireGuest, async (req, res) => {
  initSse(res);
  try {
    const input = PipelineRequestSchema.parse(req.body);
    sendEvent(res, 'step', { key: 'normalize', label: '컨텍스트 정규화 중' });
    const result = await generateMissions(input);
    sendEvent(res, 'step', { key: 'done', label: '미션 카드 생성 완료' });
    sendEvent(res, 'cards', result);
    sendEvent(res, 'done', { ok: true });
  } catch (error) {
    sendEvent(res, 'error', { message: error instanceof Error ? error.message : 'Unknown error' });
  } finally {
    res.end();
  }
});
