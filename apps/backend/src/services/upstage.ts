import { config } from '../config.js';

export async function callUpstageChat(prompt: string): Promise<string> {
  if (!config.UPSTAGE_API_KEY) {
    throw new Error('UPSTAGE_API_KEY is empty');
  }

  const response = await fetch('https://api.upstage.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.UPSTAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.UPSTAGE_MODEL,
      messages: [
        {
          role: 'system',
          content:
            '너는 서울 골목 여행 미션을 만드는 도트 RPG 게임 마스터 NPC다. 안전하고 실제 장소 기반으로만 답한다.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 1800,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upstage API failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as any;
  return json.choices?.[0]?.message?.content ?? '';
}
