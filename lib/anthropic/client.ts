import Anthropic from '@anthropic-ai/sdk';

// Claude configuration
export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

export const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929'; // Claude Sonnet 4.5 - Latest model with vision
export const CLAUDE_HAIKU_MODEL = 'claude-haiku-4-5-20251001'; // Claude Haiku 4.5 - Faster, cheaper option

// Check if Claude is available
export const isClaudeAvailable = !!anthropic;
