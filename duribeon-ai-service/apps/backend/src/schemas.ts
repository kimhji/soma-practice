import { z } from 'zod';

export const SupportedAreaSchema = z.enum(['ikseon', 'seongsu', 'yeonnam']);
export type SupportedArea = z.infer<typeof SupportedAreaSchema>;
export const LanguageSchema = z.enum(['ko', 'en']);
export type Language = z.infer<typeof LanguageSchema>;

export const MissionCategorySchema = z.enum(['food', 'place_discovery', 'experience']);
export type MissionCategory = z.infer<typeof MissionCategorySchema>;

export const PipelineRequestSchema = z.object({
  rawText: z.string().min(2).max(1000),
  area: SupportedAreaSchema.optional(),
  group: z.string().max(80).optional(),
  mood: z.string().max(120).optional(),
  avoid: z.string().max(200).optional(),
  rejectedPlaceIds: z.array(z.string()).default([]),
  rejectedMissionIds: z.array(z.string()).default([]),
  replaceMissionId: z.string().optional()
});
export type PipelineRequest = z.infer<typeof PipelineRequestSchema>;

export const MissionCardSchema = z.object({
  id: z.string().min(3),
  placeId: z.string().min(3),
  category: MissionCategorySchema,
  title: z.string().min(2).max(80),
  hook: z.string().min(2).max(180),
  route: z.string().min(2).max(220),
  proof: z.string().min(2).max(160),
  estimatedMinutes: z.number().int().min(5).max(180),
  difficulty: z.enum(['easy', 'normal', 'hard']).default('normal')
});
export type MissionCard = z.infer<typeof MissionCardSchema>;

export const MissionCardsSchema = z.array(MissionCardSchema).min(1).max(5);

export const VerifyResponseSchema = z.object({
  ok: z.boolean(),
  reason: z.string().min(1).max(160),
  comment: z.string().min(1).max(180)
});
export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;
