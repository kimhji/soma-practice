import type { MissionCategory, SupportedArea } from '../schemas.js';

export type SeedPlace = {
  id: string;
  area: SupportedArea;
  nameKo: string;
  nameEn: string;
  category: MissionCategory;
  tags: string[];
  descriptionKo: string;
  descriptionEn: string;
  verificationHint: string;
  guidebookExposure: 1 | 2 | 3 | 4 | 5;
};

export const seedPlaces: SeedPlace[] = [
  { id: 'ikseon-hanok-bakery', area: 'ikseon', nameKo: '익선 골목 한옥 빵집', nameEn: 'Ikseon Hanok Bakery', category: 'food', tags: ['local','retro','dessert'], descriptionKo: '낡은 한옥 골목 사이 작은 빵집.', descriptionEn: 'A tiny bakery tucked between old hanok alleys.', verificationHint: 'bakery sign, bread display, hanok alley', guidebookExposure: 2 },
  { id: 'ikseon-ceramic-corner', area: 'ikseon', nameKo: '익선 도자기 코너', nameEn: 'Ikseon Ceramic Corner', category: 'experience', tags: ['craft','quiet','couple'], descriptionKo: '컵과 접시가 빽빽한 작은 공방형 가게.', descriptionEn: 'A compact ceramic shop full of cups and plates.', verificationHint: 'ceramic cups or plates inside small shop', guidebookExposure: 1 },
  { id: 'ikseon-hidden-door', area: 'ikseon', nameKo: '익선 숨은 나무문', nameEn: 'Hidden Wooden Door', category: 'place_discovery', tags: ['photo','alley','mystery'], descriptionKo: '사진 찍기 좋은 오래된 나무문 골목.', descriptionEn: 'An old wooden doorway hidden in a photo-friendly lane.', verificationHint: 'old wooden door in narrow alley', guidebookExposure: 1 },
  { id: 'ikseon-tea-window', area: 'ikseon', nameKo: '익선 찻집 창가', nameEn: 'Ikseon Tea Window', category: 'food', tags: ['healing','tea','quiet'], descriptionKo: '골목을 내려다보는 작은 찻집 창가.', descriptionEn: 'A small tea window overlooking the alley.', verificationHint: 'tea cup near window or hanok interior', guidebookExposure: 2 },
  { id: 'seongsu-factory-wall', area: 'seongsu', nameKo: '성수 옛 공장 벽', nameEn: 'Old Factory Wall', category: 'place_discovery', tags: ['industrial','photo','history'], descriptionKo: '공장 흔적이 남은 붉은 벽돌길.', descriptionEn: 'A red-brick path with traces of old factories.', verificationHint: 'red brick factory wall or industrial alley', guidebookExposure: 2 },
  { id: 'seongsu-lp-hideout', area: 'seongsu', nameKo: '성수 LP 아지트', nameEn: 'Seongsu LP Hideout', category: 'experience', tags: ['music','date','retro'], descriptionKo: '낡은 음반과 조명이 있는 작은 음악 공간.', descriptionEn: 'A small music hideout with vinyl and warm lights.', verificationHint: 'vinyl records, turntable, music bar mood', guidebookExposure: 1 },
  { id: 'seongsu-shoe-street', area: 'seongsu', nameKo: '성수 수제화 골목', nameEn: 'Handmade Shoe Alley', category: 'place_discovery', tags: ['craft','local','walk'], descriptionKo: '수제화 공방 간판이 이어지는 골목.', descriptionEn: 'An alley lined with handmade-shoe workshops.', verificationHint: 'shoe workshop signs or shoe displays', guidebookExposure: 2 },
  { id: 'seongsu-roastery-side', area: 'seongsu', nameKo: '성수 로스터리 옆길', nameEn: 'Roastery Side Lane', category: 'food', tags: ['coffee','quiet','local'], descriptionKo: '대형 카페가 아닌 로스터리 옆 작은 길.', descriptionEn: 'A side lane near a low-key roastery, not a mega cafe.', verificationHint: 'coffee roaster, beans, small cafe facade', guidebookExposure: 2 },
  { id: 'yeonnam-book-nook', area: 'yeonnam', nameKo: '연남 책방 구석', nameEn: 'Yeonnam Book Nook', category: 'experience', tags: ['book','quiet','healing'], descriptionKo: '작은 독립서점의 가장 구석진 책장.', descriptionEn: 'The quietest shelf inside a tiny independent bookstore.', verificationHint: 'indie bookstore shelf or book corner', guidebookExposure: 1 },
  { id: 'yeonnam-cat-mural', area: 'yeonnam', nameKo: '연남 고양이 벽화', nameEn: 'Yeonnam Cat Mural', category: 'place_discovery', tags: ['cute','photo','walk'], descriptionKo: '골목 산책 중 만나는 작은 고양이 그림.', descriptionEn: 'A tiny cat mural found while wandering Yeonnam alleys.', verificationHint: 'cat mural or cute wall drawing', guidebookExposure: 1 },
  { id: 'yeonnam-market-snack', area: 'yeonnam', nameKo: '연남 시장 간식', nameEn: 'Yeonnam Market Snack', category: 'food', tags: ['snack','local','cheap'], descriptionKo: '시장 근처에서 찾는 한입 간식.', descriptionEn: 'A quick local snack near the market streets.', verificationHint: 'street snack, small food stall, market street', guidebookExposure: 2 },
  { id: 'yeonnam-postcard-shop', area: 'yeonnam', nameKo: '연남 엽서 가게', nameEn: 'Yeonnam Postcard Shop', category: 'experience', tags: ['souvenir','friend','creative'], descriptionKo: '여행자에게 한 장 남기기 좋은 작은 엽서점.', descriptionEn: 'A tiny postcard shop for leaving one memory behind.', verificationHint: 'postcards, stationery, small shop interior', guidebookExposure: 1 }
];

export const areaNames: Record<SupportedArea, { ko: string; en: string }> = {
  ikseon: { ko: '익선동', en: 'Ikseon-dong' },
  seongsu: { ko: '성수동', en: 'Seongsu-dong' },
  yeonnam: { ko: '연남동', en: 'Yeonnam-dong' }
};
