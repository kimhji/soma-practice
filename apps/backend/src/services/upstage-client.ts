import OpenAI from 'openai';
import { config } from '../config.js';
import { logger } from '../logger.js';

export class UpstageClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: config.UPSTAGE_API_KEY, baseURL: config.UPSTAGE_BASE_URL });
  }

  async jsonCompletion(prompt: string, opts?: { model?: string; temperature?: number }): Promise<string> {
    const started = Date.now();
    const response = await this.client.chat.completions.create({
      model: opts?.model ?? config.UPSTAGE_MODEL,
      temperature: opts?.temperature ?? 0.7,
      messages: [
        { role: 'system', content: 'You return valid JSON only.' },
        { role: 'user', content: prompt }
      ]
    });
    logger.debug({ latencyMs: Date.now() - started }, 'upstage completion');
    return response.choices[0]?.message?.content ?? '';
  }

  async *streamText(prompt: string): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: config.UPSTAGE_MODEL,
      temperature: 0.7,
      stream: true,
      messages: [
        { role: 'system', content: 'You return valid JSON only.' },
        { role: 'user', content: prompt }
      ]
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  async verifyWithImage(prompt: string, imageBase64: string, mimeType: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: config.UPSTAGE_VISION_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
          ] as any
        }
      ]
    });
    return response.choices[0]?.message?.content ?? '';
  }
}

export const upstageClient = new UpstageClient();
