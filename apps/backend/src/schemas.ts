import { z } from 'zod';

export const AreaSchema = z.enum(['ikseon', 'seongsu', 'yeonnam']);
export type Area = z.infer<typeof AreaSchema>;

export const GenerateMissionRequestSchema = z.object({
  area: AreaSchema,
  group: z.string().min(1),
  mood: z.string().default('로컬, 색다른, 가벼운 모험'),
  avoid: z.string().default(''),
  language: z.enum(['ko', 'en']).default('ko'),
  excludePlaceIds: z.array(z.string()).default([]),
});

export const RegenerateOneRequestSchema = GenerateMissionRequestSchema.extend({
  currentMissions: z.array(z.object({ placeId: z.string() })).default([]),
  replaceIndex: z.number().int().min(0).max(4),
});

export const MissionSchema = z.object({
  id: z.string(),
  placeId: z.string(),
  title: z.string(),
  hook: z.string(),
  route: z.string(),
  proof: z.string(),
  duration: z.string(),
  category: z.string(),
  difficulty: z.enum(['easy', 'normal', 'hard']).default('normal'),
  npcLine: z.string(),
  place: z.object({
    nameKo: z.string(),
    nameEn: z.string(),
    area: AreaSchema,
    address: z.string(),
    imageUrl: z.string(),
    mapUrl: z.string(),
    tags: z.array(z.string()),
  }),
});

export type Mission = z.infer<typeof MissionSchema>;
export const MissionListSchema = z.array(MissionSchema).length(5);

export const VerifyResponseSchema = z.object({
  ok: z.boolean(),
  reason: z.string(),
  comment: z.string(),
  confidence: z.number().min(0).max(1).default(0.5),
});
export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;
