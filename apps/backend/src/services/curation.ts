import { places, type Place } from '../data/places.js';
import type { Area, MissionCategory, MissionPattern } from '../schemas.js';

function shuffle<T>(items: T[]): T[] {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function avoidMatch(place: Place, avoid?: string) {
  const text = (avoid ?? '').toLowerCase().replaceAll(' ', '');
  if (!text) return false;

  const target = [
    place.nameKo,
    place.nameEn,
    place.category,
    ...place.tags,
    ...place.verificationHints,
  ]
    .join(' ')
    .toLowerCase()
    .replaceAll(' ', '');

  return text
    .split(/[,.\/|\n]+/)
    .map((v) => v.trim())
    .filter(Boolean)
    .some((word) => target.includes(word));
}

function scorePlace(place: Place, params: {
  mood?: string;
  excludeCategories?: MissionCategory[];
  excludePatterns?: MissionPattern[];
}) {
  const mood = (params.mood ?? '').toLowerCase();
  const tagsHit = place.tags.some((tag) => mood.includes(tag.toLowerCase())) ? -2 : 0;
  const exposureScore = place.guidebookExposure;
  const categoryPenalty = params.excludeCategories?.includes(place.category) ? 4 : 0;
  const patternPenalty = place.missionPatterns.some((pattern) => params.excludePatterns?.includes(pattern)) ? 2 : 0;
  const randomJitter = Math.random() * 1.5;
  return exposureScore + categoryPenalty + patternPenalty + tagsHit + randomJitter;
}

function pickBalanced(params: {
  candidates: Place[];
  limit: number;
  excludeCategories?: MissionCategory[];
  excludePatterns?: MissionPattern[];
  mood?: string;
}) {
  const sorted = [...params.candidates].sort(
    (a, b) => scorePlace(a, params) - scorePlace(b, params),
  );

  const categories: MissionCategory[] = ['food', 'discovery', 'activity'];
  const picked: Place[] = [];

  // 1차: 카테고리별 최소 3개씩 확보해서 LLM 후보가 한쪽으로 몰리지 않게 함
  for (const category of categories) {
    const group = sorted.filter((place) => place.category === category);
    picked.push(...shuffle(group).slice(0, 4));
  }

  // 2차: 나머지를 스코어 기반으로 채움
  const rest = sorted.filter((place) => !picked.some((p) => p.id === place.id));
  return [...picked, ...rest].slice(0, params.limit);
}

export function pickPlaces(params: {
  area: Area;
  mood?: string;
  avoid?: string;
  excludePlaceIds?: string[];
  excludeCategories?: MissionCategory[];
  excludePatterns?: MissionPattern[];
  limit?: number;
}): Place[] {
  const exclude = new Set(params.excludePlaceIds ?? []);

  const filtered = places
    .filter((p) => p.area === params.area)
    .filter((p) => !exclude.has(p.id))
    .filter((p) => !avoidMatch(p, params.avoid));

  const enoughCandidates = filtered.length >= (params.limit ?? 15) ? filtered : places.filter((p) => p.area === params.area && !exclude.has(p.id));

  return pickBalanced({
    candidates: enoughCandidates,
    limit: params.limit ?? 15,
    excludeCategories: params.excludeCategories,
    excludePatterns: params.excludePatterns,
    mood: params.mood,
  });
}

export function findPlace(placeId: string): Place | undefined {
  return places.find((p) => p.id === placeId);
}
