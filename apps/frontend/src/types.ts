export type Area = 'ikseon' | 'seongsu' | 'yeonnam';
export type Language = 'ko' | 'en';
export type MissionCategory = 'food' | 'discovery' | 'activity';
export type MissionPattern =
  | 'signboard'
  | 'menu'
  | 'object_hunt'
  | 'texture_photo'
  | 'sound_note'
  | 'mini_interview'
  | 'receipt'
  | 'pose_photo'
  | 'compare_two'
  | 'hidden_detail'
  | 'taste_note'
  | 'memory_note';

export type Mission = {
  id: string;
  placeId: string;
  title: string;
  hook: string;
  route: string;
  proof: string;
  duration: string;
  category: MissionCategory;
  missionPattern: MissionPattern;
  difficulty: 'easy' | 'normal' | 'hard';
  npcLine: string;
  place: {
    nameKo: string;
    nameEn: string;
    area: Area;
    address: string;
    imageUrl: string;
    imageUrls: string[];
    mapUrl: string;
    tags: string[];
    verificationHints: string[];
  };
};

export type QuestContext = {
  area: Area;
  group: string;
  mood: string;
  avoid: string;
  language: Language;
};

export type VerifyResult = {
  ok: boolean;
  reason: string;
  comment: string;
  confidence: number;
};
