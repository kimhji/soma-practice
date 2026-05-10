import type { Mission } from "../types";
import { PlaceImage } from "./PlaceImage";

type Props = {
  mission: Mission;
  index: number;
  onSelect: () => void;
  onRegenerate: () => void;
  disabled?: boolean;
};

const patternLabel: Record<string, string> = {
  signboard: "간판",
  menu: "메뉴",
  object_hunt: "사물찾기",
  texture_photo: "질감샷",
  sound_note: "소리기록",
  mini_interview: "질문하기",
  receipt: "토큰수집",
  pose_photo: "포즈샷",
  compare_two: "비교",
  hidden_detail: "숨은단서",
  taste_note: "맛기록",
  memory_note: "기억기록",
};

export function MissionCard({
  mission,
  index,
  onSelect,
  onRegenerate,
  disabled,
}: Props) {
  const images = mission.place.imageUrls?.length
    ? mission.place.imageUrls
    : [mission.place.imageUrl];

  return (
    <article className="mission-card">
      <div className="card-image-wrap">
        <PlaceImage
          src={card.place.imageUrls?.[0]}
          alt={card.place.nameKo || card.place.nameEn}
          className="mission-card__image"
        />
        <span className="quest-no">QUEST {index + 1}</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{mission.category}</span>
          <span>
            {patternLabel[mission.missionPattern] ?? mission.missionPattern}
          </span>
          <span>{mission.duration}</span>
        </div>
        <h3>{mission.title}</h3>
        <p className="hook">{mission.hook}</p>
        <p>
          <b>장소</b> {mission.place.nameKo}
        </p>
        <p>
          <b>동선</b> {mission.route}
        </p>
        <p>
          <b>인증</b> {mission.proof}
        </p>
        <div className="hint-row">
          {mission.place.verificationHints?.slice(0, 3).map((hint) => (
            <span key={hint}>단서: {hint}</span>
          ))}
        </div>
        <div className="tag-row">
          {mission.place.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        <div className="button-row">
          <button className="pixel-btn primary" onClick={onSelect}>
            선택
          </button>
          <button
            className="pixel-btn"
            onClick={onRegenerate}
            disabled={disabled}
          >
            이것만 재생성
          </button>
        </div>
      </div>
    </article>
  );
}
