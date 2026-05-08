import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMissions, regenerateOneMission } from '../api/client';
import { MissionCard } from '../components/MissionCard';
import { PixelNpc } from '../components/PixelNpc';
import { saveContext, saveSelectedMission } from '../storage';
import type { Area, Language, Mission, QuestContext } from '../types';

const initialContext: QuestContext = {
  area: 'ikseon',
  group: '친구 2명',
  mood: '로컬, 색다른, 가벼운 모험',
  avoid: '매운 음식',
  language: 'ko',
};

export function HomePage() {
  const [context, setContext] = useState<QuestContext>(initialContext);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('흠흠, 오늘의 골목 퀘스트를 열어볼까?');
  const navigate = useNavigate();

  const updateContext = <K extends keyof QuestContext>(key: K, value: QuestContext[K]) => {
    setContext((prev) => ({ ...prev, [key]: value }));
  };

  async function handleGenerate() {
    setLoading(true);
    setMessage('지도 조각을 섞는 중... 실제 장소 5곳을 뽑고 있어!');
    try {
      const exclude = missions.map((m) => m.placeId);
      const data = await generateMissions(context, exclude);
      setMissions(data.missions);
      saveContext(context);
      setMessage('퀘스트 5개를 찾았다! 마음에 안 들면 전체나 일부만 다시 뽑아도 돼.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '미션 생성 실패');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerateOne(index: number) {
    setLoading(true);
    setMessage(`${index + 1}번 퀘스트만 다시 굴리는 중...`);
    try {
      const data = await regenerateOneMission({ context, currentMissions: missions, replaceIndex: index });
      const next = [...missions];
      next[index] = data.mission;
      setMissions(next);
      setMessage('좋아, 그 카드만 새로 바꿨다!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '부분 재생성 실패');
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(mission: Mission) {
    saveSelectedMission(mission);
    saveContext(context);
    navigate(`/mission/${mission.id}`);
  }

  return (
    <main className="page">
      <section className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">DURIBEON QUEST</p>
          <h1>지금 여기서만 가능한<br />골목 퀘스트</h1>
          <p>Upstage가 미션을 만들고, GPT가 사진 인증을 판정하는 도트 RPG 여행 친구.</p>
        </div>
        <div className="npc-dialog">
          <PixelNpc />
          <div className="speech">{message}</div>
        </div>
      </section>

      <section className="panel form-panel">
        <label>
          지역
          <select value={context.area} onChange={(e) => updateContext('area', e.target.value as Area)}>
            <option value="ikseon">익선동</option>
            <option value="seongsu">성수동</option>
            <option value="yeonnam">연남동</option>
          </select>
        </label>
        <label>
          그룹
          <input value={context.group} onChange={(e) => updateContext('group', e.target.value)} placeholder="친구 2명, 커플, 혼자" />
        </label>
        <label>
          분위기
          <input value={context.mood} onChange={(e) => updateContext('mood', e.target.value)} placeholder="감성, 로컬, 웃긴 것" />
        </label>
        <label>
          피하고 싶은 것
          <input value={context.avoid} onChange={(e) => updateContext('avoid', e.target.value)} placeholder="매운 음식, 술, 사람 많은 곳" />
        </label>
        <label>
          언어
          <select value={context.language} onChange={(e) => updateContext('language', e.target.value as Language)}>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </label>
        <button className="pixel-btn primary big" onClick={handleGenerate} disabled={loading}>
          {missions.length ? '전체 재생성' : '미션 5개 받기'}
        </button>
      </section>

      <section className="missions-grid">
        {missions.map((mission, index) => (
          <MissionCard
            key={`${mission.id}-${index}`}
            mission={mission}
            index={index}
            onSelect={() => handleSelect(mission)}
            onRegenerate={() => handleRegenerateOne(index)}
            disabled={loading}
          />
        ))}
      </section>
    </main>
  );
}
