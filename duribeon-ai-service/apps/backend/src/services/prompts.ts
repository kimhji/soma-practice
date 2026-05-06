import type { Language, PipelineRequest } from '../schemas.js';
import type { SeedPlace } from '../data/seoul-seed.js';

export function buildMissionPrompt(input: PipelineRequest, lang: Language, places: SeedPlace[]): string {
  const languageRule = lang === 'ko'
    ? '반드시 한국어 반말 게임 마스터 톤으로 작성해. JSON 외 문장은 쓰지 마.'
    : 'Write in casual English game-master tone. Return JSON only.';

  return `
You are Duribeon, a game-master buddy for Seoul alley quests.
${languageRule}

Safety rules:
- Do not suggest trespassing, risky night solo activities, harassment, or alcohol-focused missions for solo users.
- Use ONLY the provided place ids. Never invent places.
- Generate exactly 5 mission cards unless fewer places are provided.

User context:
${JSON.stringify(input, null, 2)}

Candidate places:
${JSON.stringify(places, null, 2)}

Return JSON array only. Schema:
[
  {
    "id": "mission-short-id",
    "placeId": "one of candidate place ids",
    "category": "food|place_discovery|experience",
    "title": "mission title",
    "hook": "one-line story hook",
    "route": "recommended place and movement",
    "proof": "photo proof instruction",
    "estimatedMinutes": 10,
    "difficulty": "easy|normal|hard"
  }
]
`;
}

export function buildRepairPrompt(raw: string, allowedPlaceIds: string[], lang: Language): string {
  return `Fix the following model output into valid JSON array only. Language: ${lang}. Allowed placeIds: ${allowedPlaceIds.join(', ')}. Output JSON only.\n\n${raw}`;
}

export function buildVerifyPrompt(args: { missionTitle: string; proof: string; placeName: string; caption?: string; lang: Language }): string {
  return `
You are Duribeon's mission judge.
Mission: ${args.missionTitle}
Place: ${args.placeName}
Proof requirement: ${args.proof}
User caption: ${args.caption ?? '(none)'}
Language: ${args.lang}

Return JSON only:
{"ok": true|false, "reason": "one short reason", "comment": "game-master style short comment"}
`;
}
