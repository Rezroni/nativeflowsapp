import { anthropic, CLAUDE_MODEL } from './client';
import { CLAUDE_SMC_ANALYSIS_PROMPT } from './prompts';
import { getSMCAnalysisPrompt } from '../openai/prompts-multilingual';
import type { AnalysisResult } from '@/types/analysis';
import * as fs from 'fs';
import * as path from 'path';

export async function analyzeChartImageWithClaude(
  imageUrl: string,
  additionalContext?: string,
  locale: string = 'en'
): Promise<AnalysisResult> {
  if (!anthropic) {
    throw new Error('Claude AI is not configured. Please set ANTHROPIC_API_KEY.');
  }

  try {
    // Fetch the image and convert to base64
    let imageData: string;
    let mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' = 'image/jpeg';

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
        const extractedType = matches[1];
        // Validate and cast to proper type
        if (extractedType === 'image/png' || extractedType === 'image/jpeg' ||
            extractedType === 'image/webp' || extractedType === 'image/gif') {
          mediaType = extractedType;
        }
        imageData = matches[2];
      } else {
        throw new Error('Invalid image URL format');
      }
    }

    const basePrompt = getSMCAnalysisPrompt(locale);
    const prompt = additionalContext
      ? `${basePrompt}\n\nAdditional context: ${additionalContext}`
      : basePrompt;

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

    // Validate critical trade setup data
    const tradeSetup = analysis.tradeSetup || analysis.trade_setups?.[0] || {};
    const hasEntry = tradeSetup.entry || tradeSetup.entryPrice || tradeSetup.entry_price;
    const hasStopLoss = tradeSetup.stopLoss || tradeSetup.stopLossPrice || tradeSetup.stop_loss;
    const hasTakeProfit = tradeSetup.takeProfit || tradeSetup.takeProfitPrices || tradeSetup.take_profit;

    if (!hasEntry || !hasStopLoss || !hasTakeProfit) {
      console.error('[Claude] CRITICAL: Missing required trade levels!');
      console.error('[Claude] Trade setup:', JSON.stringify(tradeSetup, null, 2));
      console.warn('[Claude] Entry:', hasEntry, 'StopLoss:', hasStopLoss, 'TakeProfit:', hasTakeProfit);

      throw new Error('AI response missing required trade levels (entry/stopLoss/takeProfit)');
    }

    console.log('[Claude] ✓ Analysis validation passed - all trade levels present');

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
