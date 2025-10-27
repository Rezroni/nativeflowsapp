import Anthropic from '@anthropic-ai/sdk';

// Claude configuration
export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

export const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'; // Claude 3.5 Sonnet with vision
export const CLAUDE_HAIKU_MODEL = 'claude-3-haiku-20240307'; // Faster, cheaper option

// Check if Claude is available
export const isClaudeAvailable = !!anthropic;
