export type Area = 'ikseon' | 'seongsu' | 'yeonnam';
export type Language = 'ko' | 'en';

export type Mission = {
  id: string;
  placeId: string;
  title: string;
  hook: string;
  route: string;
  proof: string;
  duration: string;
  category: string;
  difficulty: 'easy' | 'normal' | 'hard';
  npcLine: string;
  place: {
    nameKo: string;
    nameEn: string;
    area: Area;
    address: string;
    imageUrl: string;
    mapUrl: string;
    tags: string[];
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
