import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyMission } from "../api/client";
import { PixelNpc } from "../components/PixelNpc";
import { loadContext, loadSelectedMission } from "../storage";
import type { VerifyResult } from "../types";
import { PlaceImage } from "../components/PlaceImage";

export function MissionPage() {
  const mission = useMemo(() => loadSelectedMission(), []);
  const context = useMemo(() => loadContext(), []);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!mission) {
    return (
      <main className="page narrow">
        <section className="panel center">
          <h1>선택된 미션이 없어</h1>
          <p>먼저 퀘스트를 하나 선택해줘.</p>
          <Link className="pixel-btn primary" to="/">
            돌아가기
          </Link>
        </section>
      </main>
    );
  }

  function onFileChange(file: File | null) {
    setImage(file);
    setResult(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleVerify() {
    if (!mission || !image) return;
    setLoading(true);
    try {
      const data = await verifyMission({
        mission,
        image,
        caption,
        language: context?.language ?? "ko",
      });
      setResult(data);
    } catch (error) {
      setResult({
        ok: false,
        reason: error instanceof Error ? error.message : "인증 실패",
        comment: "앗, 판정 마법이 삐끗했어. 다시 시도해줘!",
        confidence: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page narrow">
      <section className="panel mission-detail">
        <button className="pixel-btn" onClick={() => navigate("/")}>
          ← 퀘스트 목록
        </button>
        <div className="detail-hero">
          <img src={mission.place.imageUrl} alt={mission.place.nameKo} />
          <div>
            <p className="eyebrow">SELECTED QUEST</p>
            <h1>{mission.title}</h1>
            <p className="hook">{mission.hook}</p>
            <a
              href={mission.place.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="map-link"
            >
              지도에서 보기
            </a>
          </div>
        </div>

        <div className="quest-box">
          <PixelNpc speaking={false} />
          <div className="speech big-speech">{mission.npcLine}</div>
        </div>

        <div className="image-rail">
          {(mission.place.imageUrls?.length
            ? mission.place.imageUrls
            : [mission.place.imageUrl]
          ).map((url) => (
            <div className="image-rail">
              {(mission.place.imageUrls ?? []).slice(0, 3).map((url, index) => (
                <PlaceImage
                  key={`${url}-${index}`}
                  src={url}
                  alt={`${mission.place.nameKo} 이미지 ${index + 1}`}
                  className="image-rail__image"
                />
              ))}

              {(!mission.place.imageUrls ||
                mission.place.imageUrls.length === 0) && (
                <PlaceImage
                  alt={mission.place.nameKo || mission.place.nameEn}
                  className="image-rail__image"
                />
              )}
            </div>
          ))}
        </div>

        <div className="info-grid">
          <div>
            <b>실제 장소</b>
            <span>{mission.place.nameKo}</span>
          </div>
          <div>
            <b>주소</b>
            <span>{mission.place.address}</span>
          </div>
          <div>
            <b>소요 시간</b>
            <span>{mission.duration}</span>
          </div>
          <div>
            <b>난이도</b>
            <span>{mission.difficulty}</span>
          </div>
          <div>
            <b>미션 방식</b>
            <span>{mission.missionPattern}</span>
          </div>
          <div>
            <b>인증 단서</b>
            <span>{mission.place.verificationHints?.join(", ")}</span>
          </div>
        </div>

        <section className="verify-panel">
          <h2>인증 이미지 업로드</h2>
          <p>
            <b>인증 조건:</b> {mission.proof}
          </p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
          {preview && (
            <img src={preview} alt="미션 인증 미리보기" className="preview" />
          )}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="선택 입력: 사진 설명을 한 줄로 적으면 판정이 더 정확해져요."
          />
          <button
            className="pixel-btn primary big"
            disabled={!image || loading}
            onClick={handleVerify}
          >
            {loading ? "GPT 심사 중..." : "사진 인증하기"}
          </button>
          {result && (
            <div className={`result ${result.ok ? "pass" : "fail"}`}>
              <h3>{result.ok ? "PASS" : "RETRY"}</h3>
              <p>{result.comment}</p>
              <small>
                {result.reason} · confidence{" "}
                {Math.round(result.confidence * 100)}%
              </small>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
