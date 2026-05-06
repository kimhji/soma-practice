import type { Language, MissionCard } from '../types/domain';

const KEY = 'duribeon-session';
export type SessionSnapshot = { token?: string; language?: Language; cards?: MissionCard[]; rejectedPlaceIds?: string[] };
export function loadSession(): SessionSnapshot { try { return JSON.parse(sessionStorage.getItem(KEY) ?? '{}'); } catch { return {}; } }
export function saveSession(value: SessionSnapshot) { sessionStorage.setItem(KEY, JSON.stringify(value)); }
