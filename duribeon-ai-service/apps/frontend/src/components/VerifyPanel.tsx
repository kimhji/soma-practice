import { useState } from 'react';
import type { Language, MissionCard, VerifyResponse } from '../types/domain';
import { verifyMission } from '../api/client';

export function VerifyPanel(props: { token: string; card: MissionCard; language: Language }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try { setResult(await verifyMission({ token: props.token, card: props.card, language: props.language, caption, image })); }
    finally { setLoading(false); }
  }

  return (
    <section className="verify">
      <h2>미션 인증</h2>
      <p className="muted">사진을 올리거나, 데모용으로 짧은 현장 메모를 입력하세요.</p>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
      <textarea placeholder="예: 빨간 벽돌 공장 벽 앞에서 찍었어" value={caption} onChange={(e) => setCaption(e.target.value)} />
      <button onClick={submit} disabled={loading}>{loading ? '판정 중...' : '인증 요청'}</button>
      {result && <div className={`judge ${result.ok ? 'pass' : 'fail'}`}><b>{result.ok ? '통과!' : '다시 도전'}</b><p>{result.reason}</p><p>{result.comment}</p></div>}
    </section>
  );
}
