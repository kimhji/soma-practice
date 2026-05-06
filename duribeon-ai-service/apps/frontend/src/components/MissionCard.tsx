import type { MissionCard as MissionCardType } from '../types/domain';

export function MissionCard(props: { card: MissionCardType; selected: boolean; onSelect: () => void; onReject: () => void }) {
  const { card, selected, onSelect, onReject } = props;
  return (
    <article className={`card ${selected ? 'selected' : ''}`}>
      <div className="card-top">
        <span>{categoryLabel(card.category)}</span>
        <span>{card.estimatedMinutes}분 · {card.difficulty}</span>
      </div>
      <h3>{card.title}</h3>
      <p className="hook">{card.hook}</p>
      <div className="meta"><b>동선</b><p>{card.route}</p></div>
      <div className="meta"><b>인증</b><p>{card.proof}</p></div>
      <div className="actions">
        <button onClick={onSelect}>{selected ? '선택됨' : '이거 할래'}</button>
        <button className="ghost" onClick={onReject}>이 카드만 빼기</button>
      </div>
    </article>
  );
}

function categoryLabel(category: MissionCardType['category']) {
  return { food: '음식', place_discovery: '장소 발견', experience: '체험' }[category];
}
