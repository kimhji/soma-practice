# 두리번 Duribeon Game

도트 NPC가 서울 골목 미션 5개를 제공하고, 선택한 미션을 GPT Vision으로 사진 인증하는 전체 코드 프로젝트입니다.

## 이번 버전 핵심

- 전체 코드 포함: 백엔드 + 프론트 + 로컬 이미지 assets + README
- 미션 생성: Upstage Solar API
- 사진 인증: OpenAI GPT Vision API
- DB 없음: TypeScript seed 데이터만 사용
- 지역별 실제 장소 seed 60개
- 로컬 이미지 assets 398개 포함
  - `ikseon / seongsu / yeonnam`
  - `food / discovery / activity`
  - 각 지역·카테고리마다 40개씩
  - fallback 30개, NPC sprite 8개
- 미션 카드마다 카테고리에 맞는 로컬 이미지 5장을 랜덤 배정
- 카드 이미지가 자동으로 순환되고, `IMG n/5` 버튼으로 수동 변경 가능
- 전체 재생성 / 카드 1개 재생성 지원
- 미션 선택 후 상세 페이지에서 이미지 업로드 인증

## 폴더 구조

```text
.
├─ apps
│  ├─ backend
│  │  └─ src
│  │     ├─ data/places.ts
│  │     ├─ routes
│  │     └─ services
│  │        ├─ asset-pool.ts
│  │        ├─ curation.ts
│  │        ├─ mission.ts
│  │        ├─ upstage.ts
│  │        └─ verify.ts
│  └─ frontend
│     ├─ public/assets
│     │  ├─ quests/ikseon/food/*.png
│     │  ├─ quests/ikseon/discovery/*.png
│     │  ├─ quests/ikseon/activity/*.png
│     │  ├─ quests/seongsu/...
│     │  ├─ quests/yeonnam/...
│     │  ├─ quests/fallback/*.png
│     │  └─ npc/*.png
│     └─ src
│        ├─ components
│        ├─ pages
│        └─ api
├─ package.json
└─ README.md
```

## 실행 방법

```bash
npm install
copy apps\backend\.env.example apps\backend\.env
copy apps\frontend\.env.example apps\frontend\.env
```

macOS/Linux는 아래처럼 복사하세요.

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

`apps/backend/.env`에 키를 입력하세요.

```env
PORT=8080
HOST=127.0.0.1
CORS_ORIGIN=http://127.0.0.1:5173,http://localhost:5173
UPSTAGE_API_KEY=본인_Upstage_API_Key
UPSTAGE_MODEL=solar-pro3
OPENAI_API_KEY=본인_OpenAI_API_Key
OPENAI_VISION_MODEL=gpt-4.1-mini
```

백엔드 실행:

```bash
npm run dev:backend
```

프론트 실행:

```bash
npm run dev:frontend
```

접속:

```text
http://127.0.0.1:5173
```

## API

- `GET /healthz`
- `POST /api/missions` 미션 5개 생성 / 전체 재생성
- `POST /api/missions/regenerate-one` 카드 1개 재생성
- `POST /api/verify` 이미지 인증

## 이미지 정책

이번 버전은 외부 이미지 URL을 사용하지 않습니다. 모든 미션 카드는 프론트 public 폴더의 로컬 픽셀 이미지에서 랜덤 배정됩니다.

백엔드의 `asset-pool.ts`가 다음 규칙으로 이미지를 고릅니다.

```text
지역 + 카테고리 기준 이미지 pool 선택
→ 요청마다 shuffle
→ 한 번의 미션 5개 안에서는 이미지 중복 최소화
→ 각 카드에 이미지 5장 부여
→ 프론트에서 자동 순환 표시
```

즉 같은 장소가 다시 나와도 매번 다른 분위기의 로컬 이미지가 붙습니다.

## 주의

- 실제 영업시간, 휴무, 혼잡도는 검증하지 않습니다.
- GPT Vision 인증은 사진의 시각 단서와 미션 설명의 정합성을 판정합니다.
- OpenAI API 키가 없으면 인증은 데모 통과 모드로 동작합니다.
- Upstage API 키가 없으면 미션은 fallback 로직으로 생성됩니다.
