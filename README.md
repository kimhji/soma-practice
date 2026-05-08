# 두리번 Duribeon Game

도트 NPC가 실제 서울 장소 기반 미션 5개를 제공하고, 선택한 미션을 GPT Vision으로 사진 인증하는 MVP입니다.

## 구조

- `apps/backend`: Express + TypeScript API
  - 미션 생성: Upstage Solar API
  - 사진 인증: OpenAI GPT Vision API
  - DB 없음, seed 데이터만 사용
- `apps/frontend`: React + Vite
  - 도트 감성 게임 UI
  - 미션 5개 생성, 일부 재생성, 전체 재생성
  - 미션 상세 페이지, 이미지 업로드 인증

## 실행

```bash
npm install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

`apps/backend/.env` 수정:

```env
PORT=8080
HOST=127.0.0.1
CORS_ORIGIN=http://127.0.0.1:5173,http://localhost:5173
UPSTAGE_API_KEY=본인_Upstage_API_Key
UPSTAGE_MODEL=solar-pro2
OPENAI_API_KEY=본인_OpenAI_API_Key
OPENAI_VISION_MODEL=gpt-4.1-mini
```

실행:

```bash
npm run dev:backend
npm run dev:frontend
```

접속:

```text
http://127.0.0.1:5173
```

## API

- `GET /healthz`
- `POST /api/missions` 전체 미션 5개 생성
- `POST /api/missions/regenerate-one` 특정 카드 1개 재생성
- `POST /api/verify` 이미지 인증

## 참고

- 장소 이미지는 seed 데이터의 외부 이미지 URL을 사용합니다.
- API 키가 없거나 호출 실패 시 데모용 fallback 응답이 동작합니다.
