import type { Area } from '../schemas.js';

export type Place = {
  id: string;
  area: Area;
  nameKo: string;
  nameEn: string;
  address: string;
  category: 'food' | 'discovery' | 'activity';
  tags: string[];
  storyKo: string;
  storyEn: string;
  imageUrl: string;
  mapUrl: string;
  guidebookExposure: number;
};

export const places: Place[] = [
  {
    id: 'ikseon-hanok-street', area: 'ikseon', nameKo: '익선동 한옥거리', nameEn: 'Ikseon-dong Hanok Street', address: '서울 종로구 익선동', category: 'discovery', tags: ['한옥', '골목', '사진'], storyKo: '좁은 골목 안에 오래된 한옥과 작은 가게가 섞여 있는 곳', storyEn: 'A maze of old hanok houses and tiny shops.', imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ikseon-dong%20Hanok%20Street%20Seoul', guidebookExposure: 4,
  },
  {
    id: 'ikseon-cheongsudang', area: 'ikseon', nameKo: '청수당', nameEn: 'Cheongsudang', address: '서울 종로구 돈화문로11나길 31-9', category: 'food', tags: ['카페', '디저트', '정원'], storyKo: '대나무와 물길이 있는 익선동 감성 카페', storyEn: 'A moody cafe with bamboo and a small water garden.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cheongsudang%20Ikseon%20Seoul', guidebookExposure: 6,
  },
  {
    id: 'ikseon-salon-sulla', area: 'ikseon', nameKo: '살롱순라', nameEn: 'Salon Sulla', address: '서울 종로구 율곡로10길 75', category: 'food', tags: ['와인', '한옥', '분위기'], storyKo: '종묘 돌담길 근처 한옥 분위기의 식당', storyEn: 'A hanok-style dining spot near Jongmyo stone wall road.', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Salon%20Sulla%20Seoul', guidebookExposure: 5,
  },
  {
    id: 'ikseon-tteuran', area: 'ikseon', nameKo: '뜰안', nameEn: 'Tteuran Tea House', address: '서울 종로구 수표로28길 17-35', category: 'food', tags: ['전통차', '한옥', '조용함'], storyKo: '오래 머물기 좋은 한옥 전통찻집', storyEn: 'A quiet traditional tea house inside a hanok.', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tteuran%20Ikseon%20Seoul', guidebookExposure: 3,
  },
  {
    id: 'ikseon-nakwon-arcade', area: 'ikseon', nameKo: '낙원악기상가', nameEn: 'Nakwon Musical Instrument Arcade', address: '서울 종로구 삼일대로 428', category: 'activity', tags: ['악기', '레트로', '상가'], storyKo: '오래된 악기 상가에서 낯선 소리를 만나는 곳', storyEn: 'A retro musical instrument arcade full of unexpected sounds.', imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nakwon%20Musical%20Instrument%20Arcade%20Seoul', guidebookExposure: 2,
  },
  {
    id: 'ikseon-unhyeongung', area: 'ikseon', nameKo: '운현궁', nameEn: 'Unhyeongung Palace', address: '서울 종로구 삼일대로 464', category: 'discovery', tags: ['궁', '역사', '산책'], storyKo: '익선동에서 걸어갈 수 있는 조용한 역사 공간', storyEn: 'A calm historic palace area near Ikseon-dong.', imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Unhyeongung%20Seoul', guidebookExposure: 3,
  },

  { id: 'seongsu-seoulforest', area: 'seongsu', nameKo: '서울숲', nameEn: 'Seoul Forest', address: '서울 성동구 뚝섬로 273', category: 'discovery', tags: ['산책', '공원', '사진'], storyKo: '도심 속에서 가장 쉽게 숨을 돌릴 수 있는 큰 숲', storyEn: 'A spacious urban forest for a quick reset.', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Seoul%20Forest', guidebookExposure: 6 },
  { id: 'seongsu-daelim', area: 'seongsu', nameKo: '대림창고', nameEn: 'Daelim Changgo', address: '서울 성동구 성수이로 78', category: 'food', tags: ['창고', '카페', '전시'], storyKo: '공장 창고를 개조한 성수 대표 복합문화 공간', storyEn: 'A warehouse-turned-cafe and cultural space.', imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Daelim%20Changgo%20Seoul', guidebookExposure: 5 },
  { id: 'seongsu-onion', area: 'seongsu', nameKo: '어니언 성수', nameEn: 'Cafe Onion Seongsu', address: '서울 성동구 아차산로9길 8', category: 'food', tags: ['카페', '베이커리', '공장'], storyKo: '낡은 공장 감성을 살린 베이커리 카페', storyEn: 'A bakery cafe with an old factory mood.', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cafe%20Onion%20Seongsu', guidebookExposure: 7 },
  { id: 'seongsu-amore', area: 'seongsu', nameKo: '아모레 성수', nameEn: 'Amore Seongsu', address: '서울 성동구 아차산로11길 7', category: 'activity', tags: ['체험', '뷰티', '브랜드'], storyKo: '향과 색을 직접 고르며 체험하기 좋은 공간', storyEn: 'A hands-on beauty and scent experience space.', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Amore%20Seongsu', guidebookExposure: 4 },
  { id: 'seongsu-understand', area: 'seongsu', nameKo: '언더스탠드에비뉴', nameEn: 'Understand Avenue', address: '서울 성동구 왕십리로 63', category: 'activity', tags: ['컨테이너', '팝업', '편집샵'], storyKo: '컨테이너형 상점과 팝업이 모인 산책형 공간', storyEn: 'A container-style shopping and popup street.', imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Understand%20Avenue%20Seoul', guidebookExposure: 4 },
  { id: 'seongsu-tukseom', area: 'seongsu', nameKo: '뚝섬한강공원', nameEn: 'Ttukseom Hangang Park', address: '서울 광진구 강변북로 139', category: 'discovery', tags: ['한강', '자전거', '노을'], storyKo: '성수에서 이어지는 한강 바람과 노을 포인트', storyEn: 'A breezy Han River sunset spot near Seongsu.', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ttukseom%20Hangang%20Park', guidebookExposure: 3 },

  { id: 'yeonnam-gyeongui', area: 'yeonnam', nameKo: '경의선숲길', nameEn: 'Gyeongui Line Forest Park', address: '서울 마포구 연남동', category: 'discovery', tags: ['산책', '공원', '골목'], storyKo: '철길이 공원이 된 연남동 대표 산책로', storyEn: 'A former rail line turned into a neighborhood park.', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Gyeongui%20Line%20Forest%20Park%20Yeonnam', guidebookExposure: 5 },
  { id: 'yeonnam-dongjin', area: 'yeonnam', nameKo: '동진시장', nameEn: 'Dongjin Market', address: '서울 마포구 성미산로 198', category: 'activity', tags: ['시장', '소품', '플리마켓'], storyKo: '작은 상점과 플리마켓 분위기가 살아 있는 시장', storyEn: 'A small market with indie shops and flea-market vibes.', imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dongjin%20Market%20Yeonnam', guidebookExposure: 3 },
  { id: 'yeonnam-cafe-layered', area: 'yeonnam', nameKo: '카페 레이어드 연남', nameEn: 'Cafe Layered Yeonnam', address: '서울 마포구 성미산로 161-4', category: 'food', tags: ['스콘', '카페', '디저트'], storyKo: '스콘과 케이크가 진열장처럼 펼쳐지는 카페', storyEn: 'A dessert cafe known for scones and cakes.', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cafe%20Layered%20Yeonnam', guidebookExposure: 6 },
  { id: 'yeonnam-akrang', area: 'yeonnam', nameKo: '아랑곳', nameEn: 'Aranggot', address: '서울 마포구 동교로46길 23', category: 'food', tags: ['한식', '골목', '로컬'], storyKo: '연남 골목 안쪽에서 찾는 작은 식사 공간', storyEn: 'A small local dining spot tucked inside Yeonnam alleys.', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yeonnam%20Aranggot%20Seoul', guidebookExposure: 2 },
  { id: 'yeonnam-bookshop', area: 'yeonnam', nameKo: '연남동 독립서점 거리', nameEn: 'Yeonnam Indie Bookshop Alley', address: '서울 마포구 연남동 일대', category: 'activity', tags: ['책방', '엽서', '조용함'], storyKo: '작은 책방과 문구점이 숨어 있는 골목', storyEn: 'A quiet alley with indie bookshops and stationery stores.', imageUrl: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yeonnam%20indie%20bookshop', guidebookExposure: 2 },
  { id: 'yeonnam-craft', area: 'yeonnam', nameKo: '연남 공방 골목', nameEn: 'Yeonnam Craft Alley', address: '서울 마포구 연남동 일대', category: 'activity', tags: ['공방', '소품', '체험'], storyKo: '작은 공방과 핸드메이드 소품을 발견하기 좋은 골목', storyEn: 'A craft alley for handmade objects and tiny workshops.', imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yeonnam%20craft%20shop', guidebookExposure: 1 }
];

export function getAreaLabel(area: Area, language: 'ko' | 'en') {
  const labels = {
    ikseon: { ko: '익선동', en: 'Ikseon-dong' },
    seongsu: { ko: '성수동', en: 'Seongsu-dong' },
    yeonnam: { ko: '연남동', en: 'Yeonnam-dong' },
  } as const;
  return labels[area as keyof typeof labels][language];
}
