# Duribeon Fullstack Upstage

Upstage Solar API 기반 두리번 MVP입니다. DB 없이 React/Vite 프론트엔드와 Express/TypeScript 백엔드만 사용합니다.

## 기능

- 게스트 JWT 발급
- 익선/성수/연남 기반 미션 카드 5개 생성
- SSE 스트리밍 이벤트
- 카드 단건 재생성/거부 이력 회피
- 사진 또는 텍스트 캡션 기반 미션 인증
- 한국어/영어 응답
- 큐레이션 seed JSON/TS 내장, DB 없음

## 실행

```bash
npm install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
# apps/backend/.env에 UPSTAGE_API_KEY 입력
npm run dev:backend
npm run dev:frontend
```

브라우저에서 http://localhost:5173 접속.

## Docker

```bash
docker compose up --build
```

## 주요 환경변수

Backend:

```env
PORT=8080
CORS_ORIGINS=http://localhost:5173
GUEST_JWT_SECRET=replace-with-long-random-secret
UPSTAGE_API_KEY=replace-with-upstage-key
UPSTAGE_BASE_URL=https://api.upstage.ai/v1
UPSTAGE_MODEL=solar-pro3
MISSION_VERIFICATION_MODE=caption_only
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 구조

```text
apps/backend   Express + TypeScript + Upstage API
apps/frontend  React + Vite + TypeScript
infra/gcp      Cloud Run 예시
.github        CI 예시
```
