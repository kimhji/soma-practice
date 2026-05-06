import { seedPlaces, type SeedPlace } from '../data/seoul-seed.js';
import type { SupportedArea } from '../schemas.js';

export function queryCurationDb(params: { area: SupportedArea; avoidText?: string; rejectedPlaceIds?: string[]; limit?: number }): SeedPlace[] {
  const avoid = (params.avoidText ?? '').toLowerCase();
  const rejected = new Set(params.rejectedPlaceIds ?? []);
  return seedPlaces
    .filter((p) => p.area === params.area)
    .filter((p) => !rejected.has(p.id))
    .filter((p) => !p.tags.some((tag) => avoid.includes(tag)))
    .sort((a, b) => a.guidebookExposure - b.guidebookExposure)
    .slice(0, params.limit ?? 8);
}

export function findPlace(placeId: string): SeedPlace | undefined {
  return seedPlaces.find((p) => p.id === placeId);
}
