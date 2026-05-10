import type { Mission, MissionCategory, MissionPattern, QuestContext, VerifyResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8080';

async function parseJson<T>(response: Response): Promise<T> {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message ?? 'API 요청 실패');
  }
  return json as T;
}

export async function generateMissions(
  context: QuestContext,
  excludePlaceIds: string[] = [],
  excludePatterns: MissionPattern[] = [],
  excludeCategories: MissionCategory[] = [],
) {
  const res = await fetch(`${API_BASE_URL}/api/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...context, excludePlaceIds, excludePatterns, excludeCategories }),
  });
  return parseJson<{ missions: Mission[] }>(res);
}

export async function regenerateOneMission(params: {
  context: QuestContext;
  currentMissions: Mission[];
  replaceIndex: number;
}) {
  const res = await fetch(`${API_BASE_URL}/api/missions/regenerate-one`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...params.context,
      currentMissions: params.currentMissions.map((m) => ({ placeId: m.placeId, category: m.category, missionPattern: m.missionPattern })),
      replaceIndex: params.replaceIndex,
    }),
  });
  return parseJson<{ mission: Mission }>(res);
}

export async function verifyMission(params: {
  mission: Mission;
  image: File;
  caption: string;
  language: 'ko' | 'en';
}) {
  const form = new FormData();
  form.append('image', params.image);
  form.append('mission', `${params.mission.title}\n${params.mission.hook}\n${params.mission.route}`);
  form.append('placeName', `${params.mission.place.nameKo} / ${params.mission.place.nameEn}`);
  form.append('proof', params.mission.proof);
  form.append('caption', params.caption);
  form.append('language', params.language);

  const res = await fetch(`${API_BASE_URL}/api/verify`, {
    method: 'POST',
    body: form,
  });
  return parseJson<VerifyResult>(res);
}
