import { config } from '../config.js';
import { VerifyResponseSchema, type VerifyResponse } from '../schemas.js';
import { extractJson } from '../utils/json.js';

export async function verifyMissionPhoto(params: {
  mission: string;
  placeName: string;
  proof: string;
  caption?: string;
  imageBuffer: Buffer;
  mimeType: string;
  language: 'ko' | 'en';
}): Promise<VerifyResponse> {
  if (!config.OPENAI_API_KEY) {
    return {
      ok: true,
      reason: params.language === 'ko' ? '데모 모드라 실제 이미지 검증 대신 통과 처리했어.' : 'Demo mode passed without real image verification.',
      comment: params.language === 'ko' ? '통과! API 키를 넣으면 진짜 눈으로 확인해줄게.' : 'Clear! Add an API key for real vision verification.',
      confidence: 0.4,
    };
  }

  const base64 = params.imageBuffer.toString('base64');
  const dataUrl = `data:${params.mimeType};base64,${base64}`;
  const prompt = `
Mission: ${params.mission}
Place: ${params.placeName}
Required proof: ${params.proof}
User caption: ${params.caption || 'none'}
Response language: ${params.language === 'ko' ? 'Korean casual' : 'English casual'}

Judge whether the uploaded image reasonably satisfies the mission proof.
Be practical: it does not need exact GPS proof, but the visible objects/mood must match.
Return JSON only:
{
  "ok": true or false,
  "reason": "one short reason",
  "comment": "one short dot RPG game master comment",
  "confidence": number between 0 and 1
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.OPENAI_VISION_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a mission verification judge for a travel quest app. Output strict JSON only.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl, detail: 'low' } },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI verify failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as any;
  const content = json.choices?.[0]?.message?.content ?? '{}';
  return VerifyResponseSchema.parse(extractJson(content));
}
