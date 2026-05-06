import type { Language, MissionCard, PipelineResponse, VerifyResponse } from '../types/domain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function getGuestToken(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/auth/guest`, { method: 'POST' });
  if (!res.ok) throw new Error('게스트 토큰 발급 실패');
  return (await res.json()).token;
}

export async function runPipeline(args: { token: string; rawText: string; rejectedPlaceIds: string[] }): Promise<PipelineResponse> {
  const res = await fetch(`${API_BASE_URL}/api/pipeline/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${args.token}` },
    body: JSON.stringify({ rawText: args.rawText, rejectedPlaceIds: args.rejectedPlaceIds })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function streamPipeline(args: {
  token: string;
  rawText: string;
  rejectedPlaceIds: string[];
  onStep: (label: string) => void;
}): Promise<PipelineResponse> {
  const res = await fetch(`${API_BASE_URL}/api/pipeline/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${args.token}` },
    body: JSON.stringify({ rawText: args.rawText, rejectedPlaceIds: args.rejectedPlaceIds })
  });
  if (!res.body) throw new Error('스트림 응답이 없습니다.');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let final: PipelineResponse | null = null;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() ?? '';
    for (const chunk of chunks) {
      const event = chunk.match(/^event: (.+)$/m)?.[1];
      const dataRaw = chunk.match(/^data: (.+)$/m)?.[1];
      if (!event || !dataRaw) continue;
      const data = JSON.parse(dataRaw);
      if (event === 'step') args.onStep(data.label);
      if (event === 'cards') final = data;
      if (event === 'error') throw new Error(data.message);
    }
  }
  if (!final) throw new Error('카드 생성 결과가 없습니다.');
  return final;
}

export async function verifyMission(args: {
  token: string;
  card: MissionCard;
  language: Language;
  caption: string;
  image?: File | null;
}): Promise<VerifyResponse> {
  const form = new FormData();
  form.append('missionTitle', args.card.title);
  form.append('proof', args.card.proof);
  form.append('placeId', args.card.placeId);
  form.append('language', args.language);
  form.append('caption', args.caption);
  if (args.image) form.append('image', args.image);
  const res = await fetch(`${API_BASE_URL}/api/mission/verify`, { method: 'POST', headers: { Authorization: `Bearer ${args.token}` }, body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
