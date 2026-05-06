import { config } from '../config.js';
import { VerifyResponseSchema, type Language } from '../schemas.js';
import { findPlace } from './curation.js';
import { buildVerifyPrompt } from './prompts.js';
import { upstageClient } from './upstage-client.js';
import { extractJson } from '../utils/json.js';

export async function verifyMission(args: {
  missionTitle: string;
  proof: string;
  placeId: string;
  caption?: string;
  language: Language;
  file?: Express.Multer.File;
}) {
  const place = findPlace(args.placeId);
  const placeName = place ? (args.language === 'ko' ? place.nameKo : place.nameEn) : args.placeId;
  const prompt = buildVerifyPrompt({ missionTitle: args.missionTitle, proof: args.proof, placeName, caption: args.caption, lang: args.language });

  if (config.MISSION_VERIFICATION_MODE === 'vision' && args.file) {
    const raw = await upstageClient.verifyWithImage(prompt, args.file.buffer.toString('base64'), args.file.mimetype);
    return VerifyResponseSchema.parse(extractJson(raw));
  }

  const captionPrompt = `${prompt}\nNo image mode. Judge using the user caption only. If caption is empty, ok=false.`;
  const raw = await upstageClient.jsonCompletion(captionPrompt, { temperature: 0.2 });
  return VerifyResponseSchema.parse(extractJson(raw));
}
