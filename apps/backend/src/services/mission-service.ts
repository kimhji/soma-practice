import {
  MissionCardsSchema,
  type Language,
  type MissionCard,
  type PipelineRequest,
} from "../schemas.js";
import { queryCurationDb } from "./curation.js";
import { detectArea, detectLanguage } from "./normalization.js";
import { buildMissionPrompt, buildRepairPrompt } from "./prompts.js";
import { upstageClient } from "./upstage-client.js";
import { extractJson } from "../utils/json.js";

export async function generateMissions(
  input: PipelineRequest,
): Promise<{ language: Language; cards: MissionCard[] }> {
  const language = detectLanguage(input.rawText);
  const area = detectArea(input.rawText, input.area);
  const candidates = queryCurationDb({
    area,
    avoidText: input.avoid ?? input.rawText,
    rejectedPlaceIds: input.rejectedPlaceIds,
    limit: 8,
  });
  const allowed = new Set(candidates.map((p) => p.id));
  const prompt = buildMissionPrompt({ ...input, area }, language, candidates);
  const raw = await upstageClient.jsonCompletion(prompt);
  let parsed: unknown;
  try {
    parsed = extractJson(raw);
  } catch {
    const repaired = await upstageClient.jsonCompletion(
      buildRepairPrompt(raw, [...allowed], language),
      { temperature: 0.1 },
    );
    parsed = extractJson(repaired);
  }
  const cards = MissionCardsSchema.parse(normalizeMissionArray(parsed))
    .filter((card) => allowed.has(card.placeId))
    .slice(0, 5);

  if (cards.length === 0)
    return { language, cards: fallbackCards(language, candidates.slice(0, 5)) };
  if (cards.length < 5)
    return {
      language,
      cards: [
        ...cards,
        ...fallbackCards(
          language,
          candidates.filter((p) => !cards.some((c) => c.placeId === p.id)),
        ).slice(0, 5 - cards.length),
      ],
    };
  return { language, cards };
}

function normalizeMissionArray(parsed: unknown): unknown {
  if (Array.isArray(parsed)) return parsed;

  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    for (const key of [
      "missions",
      "missionCards",
      "cards",
      "quests",
      "data",
      "items",
      "result",
    ]) {
      if (Array.isArray(obj[key])) return obj[key];
    }
  }

  return parsed;
}

function fallbackCards(
  language: Language,
  places: ReturnType<typeof queryCurationDb>,
): MissionCard[] {
  return places.slice(0, 5).map((p, idx) => ({
    id: `fallback-${p.id}-${idx}`,
    placeId: p.id,
    category: p.category,
    title: language === "ko" ? `${p.nameKo} 발견 퀘스트` : `Find ${p.nameEn}`,
    hook:
      language === "ko"
        ? `${p.descriptionKo} 자, 여기서만 가능한 장면을 잡아봐.`
        : `${p.descriptionEn} Your quest is to catch the tiny detail most people miss.`,
    route:
      language === "ko"
        ? `${p.nameKo} 근처 골목을 천천히 한 바퀴 돌아봐.`
        : `Walk slowly around ${p.nameEn} and inspect the nearby lane.`,
    proof:
      language === "ko"
        ? `${p.verificationHint}가 보이도록 사진 찍기`
        : `Take a photo showing ${p.verificationHint}.`,
    estimatedMinutes: 20,
    difficulty: "normal",
  }));
}
