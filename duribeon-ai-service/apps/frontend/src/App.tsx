import { useEffect, useMemo, useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { getGuestToken, streamPipeline } from './api/client';
import { MissionCard } from './components/MissionCard';
import { VerifyPanel } from './components/VerifyPanel';
import { loadSession, saveSession } from './store/session';
import type { Language, MissionCard as MissionCardType } from './types/domain';
import './styles.css';

const examples = [
  '익선동, 친구 둘, 색다른 거, 매운 거 빼고',
  '성수, 커플, 감성적인데 사람 많은 카페는 빼고',
  "We're in Ikseon-dong, two of us, local things, no spicy food please."
];

export default function App() {
  const snap = useMemo(loadSession, []);
  const [token, setToken] = useState(snap.token ?? '');
  const [input, setInput] = useState(examples[0]);
  const [cards, setCards] = useState<MissionCardType[]>(snap.cards ?? []);
  const [language, setLanguage] = useState<Language>(snap.language ?? 'ko');
  const [selected, setSelected] = useState<MissionCardType | null>(null);
  const [rejectedPlaceIds, setRejectedPlaceIds] = useState<string[]>(snap.rejectedPlaceIds ?? []);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) return;
    getGuestToken().then((t) => { setToken(t); saveSession({ ...loadSession(), token: t }); });
  }, [token]);

  useEffect(() => {
    saveSession({ token, cards, language, rejectedPlaceIds });
  }, [token, cards, language, rejectedPlaceIds]);

  async function generate() {
    if (!token) return;
    setLoading(true);
    setStatus('게임 마스터가 골목을 훑는 중...');
    try {
      const result = await streamPipeline({ token, rawText: input, rejectedPlaceIds, onStep: setStatus });
      setCards(result.cards);
      setLanguage(result.language);
      setSelected(null);
      setStatus('자, 퀘스트 5개 도착!');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally { setLoading(false); }
  }

  async function rejectCard(card: MissionCardType) {
    setRejectedPlaceIds((prev) => [...new Set([...prev, card.placeId])]);
    setCards((prev) => prev.filter((c) => c.id !== card.id));
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="badge"><Sparkles size={16} /> Upstage Solar 기반 즉흥 미션 AI</div>
        <h1><Compass /> 두리번</h1>
        <p>지금, 여기서만 가능한 골목 퀘스트를 AI 게임 마스터가 던져줍니다.</p>
      </section>

      <section className="chatbox">
        <label>어디야? 누구랑? 분위기는? 피하고 싶은 건?</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="example-row">{examples.map((ex) => <button className="chip" key={ex} onClick={() => setInput(ex)}>{ex}</button>)}</div>
        <button className="primary" onClick={generate} disabled={loading || !token}>{loading ? '생성 중...' : '미션 5개 받기'}</button>
        <p className="status">{status}</p>
      </section>

      <section className="grid">
        {cards.map((card) => <MissionCard key={card.id} card={card} selected={selected?.id === card.id} onSelect={() => setSelected(card)} onReject={() => rejectCard(card)} />)}
      </section>

      {selected && token && <VerifyPanel token={token} card={selected} language={language} />}
    </main>
  );
}
