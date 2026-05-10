import { z } from 'zod';

export const AreaSchema = z.enum(['ikseon', 'seongsu', 'yeonnam']);
export type Area = z.infer<typeof AreaSchema>;

export const LanguageSchema = z.enum(['ko', 'en']);
export type Language = z.infer<typeof LanguageSchema>;

export const MissionCategorySchema = z.enum(['food', 'discovery', 'activity']);
export type MissionCategory = z.infer<typeof MissionCategorySchema>;

export const MissionPatternSchema = z.enum([
  'signboard',
  'menu',
  'object_hunt',
  'texture_photo',
  'sound_note',
  'mini_interview',
  'receipt',
  'pose_photo',
  'compare_two',
  'hidden_detail',
  'taste_note',
  'memory_note',
]);
export type MissionPattern = z.infer<typeof MissionPatternSchema>;

export const GenerateMissionRequestSchema = z.object({
  area: AreaSchema,
  group: z.string().min(1),
  mood: z.string().default('로컬, 색다른, 가벼운 모험'),
  avoid: z.string().default(''),
  language: LanguageSchema.default('ko'),
  excludePlaceIds: z.array(z.string()).default([]),
  excludePatterns: z.array(MissionPatternSchema).default([]),
  excludeCategories: z.array(MissionCategorySchema).default([]),
});

export const RegenerateOneRequestSchema = GenerateMissionRequestSchema.extend({
  currentMissions: z
    .array(
      z.object({
        placeId: z.string(),
        category: MissionCategorySchema.optional(),
        missionPattern: MissionPatternSchema.optional(),
      }),
    )
    .default([]),
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
  category: MissionCategorySchema,
  missionPattern: MissionPatternSchema,
  difficulty: z.enum(['easy', 'normal', 'hard']).default('normal'),
  npcLine: z.string(),
  place: z.object({
    nameKo: z.string(),
    nameEn: z.string(),
    area: AreaSchema,
    address: z.string(),
    imageUrl: z.string(),
    imageUrls: z.array(z.string()).default([]),
    mapUrl: z.string(),
    tags: z.array(z.string()),
    verificationHints: z.array(z.string()).default([]),
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
