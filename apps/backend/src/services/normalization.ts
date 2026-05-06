import type { Language, SupportedArea } from '../schemas.js';

export function detectLanguage(text: string): Language {
  return /[가-힣]/.test(text) ? 'ko' : 'en';
}

export function detectArea(text: string, explicit?: SupportedArea): SupportedArea {
  if (explicit) return explicit;
  const lower = text.toLowerCase();
  if (text.includes('익선') || lower.includes('ikseon')) return 'ikseon';
  if (text.includes('성수') || lower.includes('seongsu')) return 'seongsu';
  if (text.includes('연남') || lower.includes('yeonnam')) return 'yeonnam';
  return 'ikseon';
}
