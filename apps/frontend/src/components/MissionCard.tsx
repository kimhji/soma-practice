import type { Mission } from '../types';

type Props = {
  mission: Mission;
  index: number;
  onSelect: () => void;
  onRegenerate: () => void;
  disabled?: boolean;
};

export function MissionCard({ mission, index, onSelect, onRegenerate, disabled }: Props) {
  return (
    <article className="mission-card">
      <div className="card-image-wrap">
        <img src={mission.place.imageUrl} alt={mission.place.nameKo} className="card-image" />
        <span className="quest-no">QUEST {index + 1}</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{mission.category}</span>
          <span>{mission.duration}</span>
          <span>{mission.difficulty}</span>
        </div>
        <h3>{mission.title}</h3>
        <p className="hook">{mission.hook}</p>
        <p><b>장소</b> {mission.place.nameKo}</p>
        <p><b>동선</b> {mission.route}</p>
        <p><b>인증</b> {mission.proof}</p>
        <div className="tag-row">
          {mission.place.tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
        <div className="button-row">
          <button className="pixel-btn primary" onClick={onSelect}>선택</button>
          <button className="pixel-btn" onClick={onRegenerate} disabled={disabled}>이것만 재생성</button>
        </div>
      </div>
    </article>
  );
}
