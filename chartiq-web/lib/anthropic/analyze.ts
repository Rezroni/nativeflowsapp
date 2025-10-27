import { anthropic, CLAUDE_MODEL } from './client';
import { CLAUDE_SMC_ANALYSIS_PROMPT } from './prompts';
import type { AnalysisResult } from '@/types/analysis';
import * as fs from 'fs';
import * as path from 'path';

export async function analyzeChartImageWithClaude(
  imageUrl: string,
  additionalContext?: string
): Promise<AnalysisResult> {
  if (!anthropic) {
    throw new Error('Claude AI is not configured. Please set ANTHROPIC_API_KEY.');
  }

  try {
    // Fetch the image and convert to base64
    let imageData: string;
    let mediaType: string = 'image/jpeg';

    if (imageUrl.startsWith('http')) {
      // Fetch from URL
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      imageData = Buffer.from(buffer).toString('base64');

      // Determine media type from content-type header
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('png')) mediaType = 'image/png';
      else if (contentType?.includes('webp')) mediaType = 'image/webp';
      else if (contentType?.includes('gif')) mediaType = 'image/gif';
    } else {
      // If it's a data URL, extract the base64 part
      const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mediaType = matches[1] as any;
        imageData = matches[2];
      } else {
        throw new Error('Invalid image URL format');
      }
    }

    const prompt = additionalContext
      ? `${CLAUDE_SMC_ANALYSIS_PROMPT}\n\nAdditional context: ${additionalContext}`
      : CLAUDE_SMC_ANALYSIS_PROMPT;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageData,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    const content = textContent.text;

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Claude');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      id: crypto.randomUUID(),
      userId: '', // Will be set by the caller
      imageUrl,
      analysisData: analysis,
      createdAt: new Date().toISOString(),
      metadata: {
        model: CLAUDE_MODEL,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        provider: 'claude',
      },
    };
  } catch (error) {
    console.error('Error analyzing chart with Claude:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to analyze chart with Claude'
    );
  }
}
