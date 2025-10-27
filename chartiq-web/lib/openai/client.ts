import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const VISION_MODEL = 'gpt-4o'; // Latest GPT-4 with vision
export const GPT_MODEL = 'gpt-4o'; // Latest GPT-4 model
