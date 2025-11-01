import OpenAI from 'openai';

// OpenRouter configuration - uses OpenAI SDK with custom base URL
export const openrouter = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005',
        'X-Title': 'ChartIQ - Smart Money Concepts Analysis',
      },
    })
  : null;

// Using free models from OpenRouter (in order of preference)
// Prioritizing models with better vision and numerical analysis capabilities
export const OPENROUTER_MODEL = 'meta-llama/llama-3.2-90b-vision-instruct:free';
export const OPENROUTER_FALLBACK_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.2-11b-vision-instruct:free',
  'google/gemini-flash-1.5-8b:free',
];

// Check if OpenRouter is available
export const isOpenRouterAvailable = !!openrouter;
