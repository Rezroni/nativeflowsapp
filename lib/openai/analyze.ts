import { openai, VISION_MODEL, isOpenAIAvailable } from './client';
import { SMC_ANALYSIS_PROMPT, COMPARE_ANALYSIS_PROMPT } from './prompts';
import { analyzeChartImageWithClaude } from '../anthropic/analyze';
import { isClaudeAvailable } from '../anthropic/client';
import type { AnalysisResult } from '@/types/analysis';

export async function analyzeChartImage(
  imageUrl: string,
  additionalContext?: string
): Promise<AnalysisResult> {
  // Try OpenAI first, fall back to Claude if OpenAI fails
  if (isOpenAIAvailable && openai) {
    try {
      console.log('Attempting analysis with OpenAI GPT-4...');
      const messages: any[] = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: additionalContext
                ? `${SMC_ANALYSIS_PROMPT}\n\nAdditional context: ${additionalContext}`
                : SMC_ANALYSIS_PROMPT,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high',
              },
            },
          ],
        },
      ];

      const response = await openai.chat.completions.create({
        model: VISION_MODEL,
        messages,
        max_tokens: 4096,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from OpenAI');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      return {
        id: crypto.randomUUID(),
        userId: '', // Will be set by the caller
        imageUrl,
        analysisData: analysis,
        createdAt: new Date().toISOString(),
        metadata: {
          model: VISION_MODEL,
          tokensUsed: response.usage?.total_tokens || 0,
          provider: 'openai',
        },
      };
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      console.log('Falling back to Claude AI...');

      // Fall back to Claude if available
      if (isClaudeAvailable) {
        return await analyzeChartImageWithClaude(imageUrl, additionalContext);
      }

      throw error;
    }
  }

  // If OpenAI is not available, try Claude
  if (isClaudeAvailable) {
    console.log('Using Claude AI for analysis...');
    return await analyzeChartImageWithClaude(imageUrl, additionalContext);
  }

  // Neither AI provider is available
  throw new Error(
    'No AI provider available. Please configure either OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment variables.'
  );
}

export async function compareWithUserAnalysis(
  professionalAnalysis: AnalysisResult,
  userAnalysis: string,
  chartImageUrl: string
): Promise<{
  strengths: string[];
  missed: string[];
  improvements: string[];
  learningPoints: string[];
  overallGrade: string;
  feedback: string;
}> {
  if (!openai) {
    throw new Error('OpenAI is not configured. Please set OPENAI_API_KEY.');
  }

  try {
    const prompt = COMPARE_ANALYSIS_PROMPT(userAnalysis);

    const response = await openai.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert SMC trading educator providing constructive feedback.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${prompt}\n\nProfessional Analysis:\n${JSON.stringify(professionalAnalysis.analysisData, null, 2)}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: chartImageUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 2048,
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error comparing analyses:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to compare analyses'
    );
  }
}

export async function uploadToSupabase(
  file: File,
  userId: string
): Promise<string> {
  // This will be implemented when we add the upload action
  // For now, return a placeholder
  throw new Error('Upload functionality not yet implemented');
}
