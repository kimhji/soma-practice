import { randomUUID } from 'node:crypto';
import { getAreaLabel, type Place } from '../data/places.js';
import {
  GenerateMissionRequestSchema,
  MissionListSchema,
  MissionSchema,
  RegenerateOneRequestSchema,
  type Language,
  type Mission,
  type MissionPattern,
} from '../schemas.js';
import { pickPlaces } from './curation.js';
import { callUpstageChat } from './upstage.js';
import { extractJson, normalizeArray } from '../utils/json.js';
import { pickQuestImages } from './asset-pool.js';

const patternLabelKo: Record<MissionPattern, string> = {
  signboard: '간판 찾기',
  menu: '메뉴 관찰',
  object_hunt: '물건 찾기',
  texture_photo: '질감 사진',
  sound_note: '소리 기록',
  mini_interview: '짧은 질문',
  receipt: '영수증/티켓',
  pose_photo: '포즈 사진',
  compare_two: '두 가지 비교',
  hidden_detail: '숨은 디테일',
  taste_note: '맛 기록',
  memory_note: '한 줄 기록',
};

const patternProofKo: Record<MissionPattern, string> = {
  signboard: '장소 간판이나 문패가 보이게 사진 찍기',
  menu: '메뉴판 또는 추천 메뉴 이름이 보이게 사진 찍기',
  object_hunt: '장소의 대표 소품 하나를 찾아 사진 찍기',
  texture_photo: '벽, 문, 창문, 바닥 중 하나의 질감이 잘 보이게 사진 찍기',
  sound_note: '현장에서 들은 소리를 한 줄 캡션으로 적고 주변 사진 찍기',
  mini_interview: '직원 또는 동행에게 추천 하나를 물어보고 단서가 보이게 사진 찍기',
  receipt: '영수증, 티켓, 번호표, 포장지 중 하나가 보이게 사진 찍기',
  pose_photo: '동행과 미션 장소를 배경으로 포즈 사진 찍기',
  compare_two: '비슷한 것 두 개를 골라 나란히 사진 찍기',
  hidden_detail: '그냥 지나치기 쉬운 작은 디테일을 클로즈업하기',
  taste_note: '먹거나 마신 것의 맛을 캡션으로 남기고 사진 찍기',
  memory_note: '이 장소를 기억할 한 문장을 캡션으로 남기고 사진 찍기',
};

const patternLabelEn: Record<MissionPattern, string> = {
  signboard: 'Signboard Hunt',
  menu: 'Menu Clue',
  object_hunt: 'Object Hunt',
  texture_photo: 'Texture Shot',
  sound_note: 'Sound Note',
  mini_interview: 'Tiny Interview',
  receipt: 'Receipt Token',
  pose_photo: 'Pose Photo',
  compare_two: 'Compare Two',
  hidden_detail: 'Hidden Detail',
  taste_note: 'Taste Note',
  memory_note: 'Memory Note',
};

function pickPattern(place: Place, usedPatterns: Set<MissionPattern>): MissionPattern {
  return place.missionPatterns.find((pattern) => !usedPatterns.has(pattern)) ?? place.missionPatterns[0] ?? 'hidden_detail';
}

function placePayload(place: Place, usedAssetUrls: Set<string>) {
  const imageUrls = pickQuestImages({
    area: place.area,
    category: place.category,
    count: 5,
    avoid: usedAssetUrls,
  });

  return {
    nameKo: place.nameKo,
    nameEn: place.nameEn,
    area: place.area,
    address: place.address,
    imageUrl: imageUrls[0],
    imageUrls,
    mapUrl: place.mapUrl,
    tags: place.tags,
    verificationHints: place.verificationHints,
  };
}

function buildFallbackMission(
  place: Place,
  index: number,
  language: Language,
  usedPatterns = new Set<MissionPattern>(),
  usedAssetUrls = new Set<string>(),
): Mission {
  const pattern = pickPattern(place, usedPatterns);
  usedPatterns.add(pattern);
  const hint = place.verificationHints[index % place.verificationHints.length] ?? place.tags[0] ?? '장소 단서';

  return MissionSchema.parse({
    id: randomUUID(),
    placeId: place.id,
    title:
      language === 'ko'
        ? `${patternLabelKo[pattern]}: ${place.nameKo}`
        : `${patternLabelEn[pattern]} at ${place.nameEn}`,
    hook:
      language === 'ko'
        ? `${place.storyKo}. 오늘은 '${hint}' 단서를 잡아오는 퀘스트야.`
        : `${place.storyEn} Your clue is '${hint}'. Bring it back like a quest item.`,
    route:
      language === 'ko'
        ? `${place.nameKo} 근처를 천천히 한 바퀴 돌면서 ${hint} 단서를 찾아봐.`
        : `Circle around ${place.nameEn} and look for the clue: ${hint}.`,
    proof: language === 'ko' ? patternProofKo[pattern] : `Complete the ${patternLabelEn[pattern]} and upload one clear proof photo.`,
    duration: `${10 + ((index * 5) % 25)}분`,
    category: place.category,
    missionPattern: pattern,
    difficulty: index % 5 === 4 ? 'hard' : index % 2 === 0 ? 'easy' : 'normal',
    npcLine:
      language === 'ko'
        ? `자, 이번 단서는 '${hint}'다. 그냥 보면 지나친다. 두리번거려!`
        : `Your clue is '${hint}'. Don't just look — duribeon around!`,
    place: placePayload(place, usedAssetUrls),
  });
}

function attachPlace(
  raw: any,
  place: Place,
  language: Language,
  index: number,
  usedPatterns: Set<MissionPattern>,
  usedAssetUrls: Set<string>,
): Mission {
  const requestedPattern = raw?.missionPattern as MissionPattern | undefined;
  const pattern = requestedPattern && place.missionPatterns.includes(requestedPattern) && !usedPatterns.has(requestedPattern)
    ? requestedPattern
    : pickPattern(place, usedPatterns);
  usedPatterns.add(pattern);

  const hint = place.verificationHints[index % place.verificationHints.length] ?? place.tags[0] ?? '장소 단서';
  const fallbackTitle = language === 'ko' ? `${patternLabelKo[pattern]}: ${place.nameKo}` : `${patternLabelEn[pattern]} at ${place.nameEn}`;
  const fallbackHook = language === 'ko'
    ? `${place.storyKo}. 오늘은 '${hint}' 단서를 잡아오는 퀘스트야.`
    : `${place.storyEn} Your clue is '${hint}'. Bring it back like a quest item.`;
  const fallbackRoute = language === 'ko'
    ? `${place.nameKo} 근처를 천천히 한 바퀴 돌면서 ${hint} 단서를 찾아봐.`
    : `Circle around ${place.nameEn} and look for the clue: ${hint}.`;

  return MissionSchema.parse({
    id: raw?.id || randomUUID(),
    placeId: place.id,
    title: raw?.title || fallbackTitle,
    hook: raw?.hook || fallbackHook,
    route: raw?.route || fallbackRoute,
    proof: raw?.proof || (language === 'ko' ? patternProofKo[pattern] : `Complete the ${patternLabelEn[pattern]} and upload one clear proof photo.`),
    duration: raw?.duration || `${10 + ((index * 5) % 25)}분`,
    category: place.category,
    missionPattern: pattern,
    difficulty: raw?.difficulty || (index % 5 === 4 ? 'hard' : index % 2 === 0 ? 'easy' : 'normal'),
    npcLine: raw?.npcLine || (language === 'ko' ? `자, 이번 단서는 '${hint}'다. 그냥 보면 지나친다. 두리번거려!` : `Your clue is '${hint}'. Don't just look — duribeon around!`),
    place: placePayload(place, usedAssetUrls),
  });
}

function buildPrompt(params: {
  areaLabel: string;
  group: string;
  mood: string;
  avoid: string;
  language: Language;
  candidates: Place[];
  count: number;
  usedPlaceIds?: string[];
  usedPatterns?: MissionPattern[];
}) {
  const responseLanguage = params.language === 'ko' ? 'Korean casual banmal' : 'casual English';
  return `
You are Duribeon's dot-pixel RPG NPC game master.
Create exactly ${params.count} travel mission cards.

User context:
- area: ${params.areaLabel}
- group: ${params.group}
- mood: ${params.mood}
- avoid: ${params.avoid || 'none'}
- response language: ${responseLanguage}

Hard rules:
- Use ONLY candidate place ids.
- Use each candidate at most once.
- Do not invent places, addresses, opening hours, famous facts, prices, or reservations.
- Avoid risky, illegal, trespassing, harassment, or alcohol-focused missions for solo users.
- Every mission must be small, doable now, and photo-verifiable.
- Output JSON array only. No markdown. No explanation.

Diversity rules:
- Mix categories: food / discovery / activity.
- Mission patterns must be different whenever possible.
- Avoid already used place ids: ${JSON.stringify(params.usedPlaceIds ?? [])}
- Avoid already used patterns: ${JSON.stringify(params.usedPatterns ?? [])}
- Do not make all proofs simple "take a photo". Use specific clues from verificationHints.
- Make each mission feel like a different mini-game: signboard, menu clue, texture, object hunt, sound note, tiny interview, receipt token, pose, comparison, hidden detail, taste note, or memory note.

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
    verificationHints: p.verificationHints,
    allowedMissionPatterns: p.missionPatterns,
  })),
  null,
  2,
)}

Each item schema:
{
  "placeId": "candidate id",
  "missionPattern": "signboard|menu|object_hunt|texture_photo|sound_note|mini_interview|receipt|pose_photo|compare_two|hidden_detail|taste_note|memory_note",
  "title": "mission title",
  "hook": "one-line story hook",
  "route": "where/how to move",
  "proof": "specific photo proof instruction",
  "duration": "10~30분",
  "difficulty": "easy|normal|hard",
  "npcLine": "one short NPC line"
}
`;
}

function selectUniqueMissions(
  rawItems: any[],
  candidates: Place[],
  language: Language,
  count: number,
  usedPatternSeed: MissionPattern[] = [],
) {
  const usedPlaceIds = new Set<string>();
  const usedPatterns = new Set<MissionPattern>(usedPatternSeed);
  const usedAssetUrls = new Set<string>();
  const missions: Mission[] = [];

  for (const raw of rawItems) {
    if (missions.length >= count) break;
    const selected = candidates.find((p) => p.id === raw?.placeId && !usedPlaceIds.has(p.id));
    if (!selected) continue;
    usedPlaceIds.add(selected.id);
    missions.push(attachPlace(raw, selected, language, missions.length, usedPatterns, usedAssetUrls));
  }

  for (const place of candidates) {
    if (missions.length >= count) break;
    if (usedPlaceIds.has(place.id)) continue;
    usedPlaceIds.add(place.id);
    missions.push(buildFallbackMission(place, missions.length, language, usedPatterns, usedAssetUrls));
  }

  return missions;
}

export async function generateMissions(input: unknown): Promise<Mission[]> {
  const parsed = GenerateMissionRequestSchema.parse(input);
  const candidates = pickPlaces({
    area: parsed.area,
    mood: parsed.mood,
    avoid: parsed.avoid,
    excludePlaceIds: parsed.excludePlaceIds,
    excludeCategories: parsed.excludeCategories,
    excludePatterns: parsed.excludePatterns,
    limit: 18,
  });

  if (candidates.length < 5) {
    const fallbackCandidates = pickPlaces({ area: parsed.area, limit: 5 });
    return MissionListSchema.parse(selectUniqueMissions([], fallbackCandidates, parsed.language, 5));
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
      usedPlaceIds: parsed.excludePlaceIds,
      usedPatterns: parsed.excludePatterns,
    });
    const content = await callUpstageChat(prompt);
    const arr = normalizeArray(extractJson(content)) as any[];
    return MissionListSchema.parse(selectUniqueMissions(arr, candidates, parsed.language, 5, parsed.excludePatterns));
  } catch (error) {
    console.warn('[mission] Upstage fallback:', error);
    return MissionListSchema.parse(selectUniqueMissions([], candidates, parsed.language, 5, parsed.excludePatterns));
  }
}

export async function regenerateOne(input: unknown): Promise<Mission> {
  const parsed = RegenerateOneRequestSchema.parse(input);
  const keep = parsed.currentMissions.filter((_, index) => index !== parsed.replaceIndex);
  const currentPlaceIds = parsed.currentMissions.map((m) => m.placeId);
  const currentPatterns = parsed.currentMissions.map((m) => m.missionPattern).filter(Boolean) as MissionPattern[];
  const currentCategories = parsed.currentMissions.map((m) => m.category).filter(Boolean) as any[];

  const candidates = pickPlaces({
    area: parsed.area,
    mood: parsed.mood,
    avoid: parsed.avoid,
    excludePlaceIds: [...new Set([...currentPlaceIds, ...parsed.excludePlaceIds])],
    excludePatterns: [...new Set([...currentPatterns, ...parsed.excludePatterns])],
    excludeCategories: [...new Set([...currentCategories, ...parsed.excludeCategories])],
    limit: 8,
  });
  const place = candidates[0] ?? pickPlaces({ area: parsed.area, excludePlaceIds: keep.map((m) => m.placeId), limit: 1 })[0];

  if (!place) {
    throw new Error('재생성할 장소 후보가 부족해. seed를 더 늘려줘.');
  }

  try {
    const prompt = buildPrompt({
      areaLabel: getAreaLabel(parsed.area, parsed.language),
      group: parsed.group,
      mood: parsed.mood,
      avoid: parsed.avoid,
      language: parsed.language,
      candidates: candidates.length ? candidates : [place],
      count: 1,
      usedPlaceIds: currentPlaceIds,
      usedPatterns: currentPatterns,
    });
    const content = await callUpstageChat(prompt);
    const arr = normalizeArray(extractJson(content)) as any[];
    return selectUniqueMissions(arr, candidates.length ? candidates : [place], parsed.language, 1, currentPatterns)[0];
  } catch (error) {
    console.warn('[mission-one] Upstage fallback:', error);
    return buildFallbackMission(place, parsed.replaceIndex, parsed.language, new Set(currentPatterns), new Set<string>());
  }
}
