import type { Area, MissionCategory } from '../schemas.js';

const IMAGE_COUNT_PER_AREA_CATEGORY = 40;
const FALLBACK_IMAGE_COUNT = 30;

function pad(num: number) {
  return String(num).padStart(2, '0');
}

function shuffle<T>(items: T[]): T[] {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

export function allQuestImageUrls(area: Area, category: MissionCategory) {
  return Array.from({ length: IMAGE_COUNT_PER_AREA_CATEGORY }, (_, i) => {
    const n = pad(i + 1);
    return `/assets/quests/${area}/${category}/${area}-${category}-${n}.png`;
  });
}

export function fallbackImageUrls() {
  return Array.from({ length: FALLBACK_IMAGE_COUNT }, (_, i) => {
    const n = pad(i + 1);
    return `/assets/quests/fallback/fallback-${n}.png`;
  });
}

export function pickQuestImages(params: {
  area: Area;
  category: MissionCategory;
  count?: number;
  avoid?: Set<string>;
}) {
  const avoid = params.avoid ?? new Set<string>();
  const count = params.count ?? 4;
  const primary = shuffle(allQuestImageUrls(params.area, params.category)).filter((url) => !avoid.has(url));
  const backup = shuffle(fallbackImageUrls()).filter((url) => !avoid.has(url));
  const selected = [...primary, ...backup].slice(0, count);
  for (const url of selected) avoid.add(url);
  return selected.length > 0 ? selected : fallbackImageUrls().slice(0, count);
}

export function randomNpcSprite() {
  const n = pad(1 + Math.floor(Math.random() * 8));
  return `/assets/npc/duribeon-npc-${n}.png`;
}
