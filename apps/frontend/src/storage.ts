import type { Mission, QuestContext } from './types';

const MISSION_KEY = 'duribeon:selectedMission';
const CONTEXT_KEY = 'duribeon:questContext';

export function saveSelectedMission(mission: Mission) {
  sessionStorage.setItem(MISSION_KEY, JSON.stringify(mission));
}

export function loadSelectedMission(): Mission | null {
  const raw = sessionStorage.getItem(MISSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Mission;
  } catch {
    return null;
  }
}

export function saveContext(context: QuestContext) {
  sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
}

export function loadContext(): QuestContext | null {
  const raw = sessionStorage.getItem(CONTEXT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuestContext;
  } catch {
    return null;
  }
}
