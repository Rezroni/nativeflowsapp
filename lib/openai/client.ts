import OpenAI from 'openai';

// OpenAI configuration - don't throw error, just warn
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // Don't include organization header unless explicitly set
      ...(process.env.OPENAI_ORGANIZATION && {
        organization: process.env.OPENAI_ORGANIZATION,
      }),
    })
  : null;

export const VISION_MODEL = 'gpt-4o'; // Latest GPT-4 with vision
export const GPT_MODEL = 'gpt-4o'; // Latest GPT-4 model

// Check if OpenAI is available
export const isOpenAIAvailable = !!openai;
