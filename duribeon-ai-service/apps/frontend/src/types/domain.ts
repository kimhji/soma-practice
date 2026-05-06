export type Language = 'ko' | 'en';
export type MissionCategory = 'food' | 'place_discovery' | 'experience';
export type MissionCard = {
  id: string;
  placeId: string;
  category: MissionCategory;
  title: string;
  hook: string;
  route: string;
  proof: string;
  estimatedMinutes: number;
  difficulty: 'easy' | 'normal' | 'hard';
};
export type PipelineResponse = { language: Language; cards: MissionCard[] };
export type VerifyResponse = { ok: boolean; reason: string; comment: string };
