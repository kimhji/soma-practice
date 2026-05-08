import { places, type Place } from '../data/places.js';
import type { Area } from '../schemas.js';

function shuffle<T>(items: T[]): T[] {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

export function pickPlaces(params: {
  area: Area;
  avoid?: string;
  excludePlaceIds?: string[];
  limit?: number;
}): Place[] {
  const avoid = (params.avoid ?? '').toLowerCase();
  const exclude = new Set(params.excludePlaceIds ?? []);

  const filtered = places
    .filter((p) => p.area === params.area)
    .filter((p) => !exclude.has(p.id))
    .filter((p) => !p.tags.some((tag) => avoid.includes(tag.toLowerCase())));

  const grouped = ['food', 'discovery', 'activity'].flatMap((category) => {
    const inCategory = filtered
      .filter((p) => p.category === category)
      .sort((a, b) => a.guidebookExposure - b.guidebookExposure);
    return shuffle(inCategory).slice(0, 2);
  });

  const rest = shuffle(filtered.filter((p) => !grouped.some((g) => g.id === p.id)));
  return [...grouped, ...rest].slice(0, params.limit ?? 5);
}

export function findPlace(placeId: string): Place | undefined {
  return places.find((p) => p.id === placeId);
}
