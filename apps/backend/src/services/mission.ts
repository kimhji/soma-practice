import { randomUUID } from 'node:crypto';
import { getAreaLabel, type Place } from '../data/places.js';
import { GenerateMissionRequestSchema, MissionListSchema, MissionSchema, type Mission } from '../schemas.js';
import { pickPlaces } from './curation.js';
import { callUpstageChat } from './upstage.js';
import { extractJson, normalizeArray } from '../utils/json.js';

function buildFallbackMission(place: Place, index: number, language: 'ko' | 'en'): Mission {
  const titleKo = ['숨은 간판 수집가', '골목의 소리 채집', '오늘의 로컬 한 컷', 'NPC의 비밀 장소', '작은 취향 발굴'][index] ?? '두리번 퀘스트';
  const titleEn = ['Hidden Sign Hunter', 'Alley Sound Collector', 'One Local Shot', 'NPC Secret Spot', 'Tiny Taste Finder'][index] ?? 'Duribeon Quest';

  return {
    id: randomUUID(),
    placeId: place.id,
    title: language === 'ko' ? `${titleKo}: ${place.nameKo}` : `${titleEn}: ${place.nameEn}`,
    hook:
      language === 'ko'
        ? `${place.storyKo}. 그냥 지나치면 놓치는 디테일 하나를 찾아봐.`
        : `${place.storyEn} Find one tiny detail most people would miss.`,
    route:
      language === 'ko'
        ? `${place.nameKo} 주변을 10분 정도 천천히 둘러봐.`
        : `Walk slowly around ${place.nameEn} for about 10 minutes.`,
    proof:
      language === 'ko'
        ? '장소의 분위기와 미션 디테일이 함께 보이도록 사진 한 장 찍기'
        : 'Take one photo showing both the place mood and your quest detail.',
    duration: index % 2 === 0 ? '15분' : '20분',
    category: place.category,
    difficulty: index % 3 === 0 ? 'easy' : 'normal',
    npcLine:
      language === 'ko'
        ? '자, 이건 골목 감지력이 필요한 퀘스트다. 눈 크게 뜨고 가자!'
        : 'Alright, this quest needs alley-sense. Keep your eyes wide open!',
    place: {
      nameKo: place.nameKo,
      nameEn: place.nameEn,
      area: place.area,
      address: place.address,
      imageUrl: place.imageUrl,
      mapUrl: place.mapUrl,
      tags: place.tags,
    },
  };
}

function attachPlace(raw: any, place: Place, language: 'ko' | 'en', index: number): Mission {
  return MissionSchema.parse({
    id: raw.id || randomUUID(),
    placeId: place.id,
    title: raw.title || (language === 'ko' ? `${place.nameKo} 퀘스트` : `${place.nameEn} Quest`),
    hook: raw.hook || (language === 'ko' ? place.storyKo : place.storyEn),
    route: raw.route || (language === 'ko' ? `${place.nameKo} 주변을 둘러보기` : `Explore around ${place.nameEn}`),
    proof: raw.proof || (language === 'ko' ? '사진으로 인증하기' : 'Verify with a photo'),
    duration: raw.duration || '15분',
    category: place.category,
    difficulty: raw.difficulty || 'normal',
    npcLine: raw.npcLine || (language === 'ko' ? '가자, 용사여!' : 'Go, brave traveler!'),
    place: {
      nameKo: place.nameKo,
      nameEn: place.nameEn,
      area: place.area,
      address: place.address,
      imageUrl: place.imageUrl,
      mapUrl: place.mapUrl,
      tags: place.tags,
    },
  });
}

function buildPrompt(params: {
  areaLabel: string;
  group: string;
  mood: string;
  avoid: string;
  language: 'ko' | 'en';
  candidates: Place[];
  count: number;
}) {
  const responseLanguage = params.language === 'ko' ? 'Korean casual banmal' : 'casual English';
  return `
You are a dot-pixel RPG NPC game master for Duribeon.
Create exactly ${params.count} travel mission cards.

User context:
- area: ${params.areaLabel}
- group: ${params.group}
- mood: ${params.mood}
- avoid: ${params.avoid || 'none'}
- response language: ${responseLanguage}

Hard rules:
- Use ONLY the provided candidates.
- Use each candidate at most once.
- Do not invent real places, addresses, or facts.
- Avoid risky, illegal, trespassing, harassment, or alcohol-focused missions for solo users.
- Mission should be small, doable now, and photo-verifiable.
- Keep NPC tone playful like a dot RPG quest giver.

Candidates:
${JSON.stringify(
  params.candidates.map((p) => ({
    id: p.id,
    nameKo: p.nameKo,
    nameEn: p.nameEn,
    category: p.category,
    tags: p.tags,
    storyKo: p.storyKo,
    storyEn: p.storyEn,
  })),
  null,
  2,
)}

Return JSON array only. No markdown.
Each item schema:
{
  "placeId": "candidate id",
  "title": "mission title",
  "hook": "one-line story hook",
  "route": "where/how to move",
  "proof": "photo proof instruction",
  "duration": "10~30분",
  "difficulty": "easy|normal|hard",
  "npcLine": "one short NPC line"
}
`;
}

export async function generateMissions(input: unknown): Promise<Mission[]> {
  const parsed = GenerateMissionRequestSchema.parse(input);
  const candidates = pickPlaces({
    area: parsed.area,
    avoid: parsed.avoid,
    excludePlaceIds: parsed.excludePlaceIds,
    limit: 5,
  });

  if (candidates.length < 5) {
    const fallbackCandidates = pickPlaces({ area: parsed.area, limit: 5 });
    return MissionListSchema.parse(fallbackCandidates.map((p, i) => buildFallbackMission(p, i, parsed.language)));
  }

  try {
    const prompt = buildPrompt({
      areaLabel: getAreaLabel(parsed.area, parsed.language),
      group: parsed.group,
      mood: parsed.mood,
      avoid: parsed.avoid,
      language: parsed.language,
      candidates,
      count: 5,
    });
    const content = await callUpstageChat(prompt);
    const arr = normalizeArray(extractJson(content)) as any[];
    const used = new Set<string>();
    const missions = arr.slice(0, 5).map((raw, index) => {
      const selected = candidates.find((p) => p.id === raw.placeId && !used.has(p.id)) ?? candidates[index];
      used.add(selected.id);
      return attachPlace(raw, selected, parsed.language, index);
    });
    return MissionListSchema.parse(missions);
  } catch (error) {
    console.warn('[mission] Upstage fallback:', error);
    return MissionListSchema.parse(candidates.map((p, i) => buildFallbackMission(p, i, parsed.language)));
  }
}

export async function regenerateOne(input: unknown): Promise<Mission> {
  const parsed = (await import('../schemas.js')).RegenerateOneRequestSchema.parse(input);
  const currentPlaceIds = parsed.currentMissions.map((m) => m.placeId);
  const candidates = pickPlaces({
    area: parsed.area,
    avoid: parsed.avoid,
    excludePlaceIds: [...new Set([...currentPlaceIds, ...parsed.excludePlaceIds])],
    limit: 1,
  });
  const place = candidates[0] ?? pickPlaces({ area: parsed.area, limit: 1 })[0];

  try {
    const prompt = buildPrompt({
      areaLabel: getAreaLabel(parsed.area, parsed.language),
      group: parsed.group,
      mood: parsed.mood,
      avoid: parsed.avoid,
      language: parsed.language,
      candidates: [place],
      count: 1,
    });
    const content = await callUpstageChat(prompt);
    const arr = normalizeArray(extractJson(content)) as any[];
    return attachPlace(arr[0] ?? {}, place, parsed.language, 0);
  } catch (error) {
    console.warn('[mission-one] Upstage fallback:', error);
    return buildFallbackMission(place, 0, parsed.language);
  }
}
