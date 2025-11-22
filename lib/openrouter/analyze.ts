import { openrouter, OPENROUTER_MODEL, OPENROUTER_FALLBACK_MODELS, isOpenRouterAvailable } from './client';
import { getSMCAnalysisPrompt } from '../openai/prompts-multilingual';
import type { AnalysisResult } from '@/types/analysis';

async function tryModelAnalysis(
  model: string,
  imageUrl: string,
  prompt: string
): Promise<AnalysisResult> {
  if (!openrouter) {
    throw new Error('OpenRouter client not initialized');
  }

  const messages: any[] = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: prompt,
        },
        {
          type: 'image_url',
          image_url: {
            url: imageUrl,
          },
        },
      ],
    },
  ];

  const response = await openrouter.chat.completions.create({
    model,
    messages,
    max_tokens: 4096,
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenRouter');
  }

  // Parse JSON response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid JSON response from OpenRouter');
  }

  const analysis = JSON.parse(jsonMatch[0]);

  // Validate critical trade setup data
  const tradeSetup = analysis.tradeSetup || analysis.trade_setups?.[0] || {};
  const hasEntry = tradeSetup.entry || tradeSetup.entryPrice || tradeSetup.entry_price;
  const hasStopLoss = tradeSetup.stopLoss || tradeSetup.stopLossPrice || tradeSetup.stop_loss;
  const hasTakeProfit = tradeSetup.takeProfit || tradeSetup.takeProfitPrices || tradeSetup.take_profit;

  if (!hasEntry || !hasStopLoss || !hasTakeProfit) {
    console.error('[OpenRouter] CRITICAL: Missing required trade levels!');
    console.error('[OpenRouter] Trade setup:', JSON.stringify(tradeSetup, null, 2));
    console.warn('[OpenRouter] Entry:', hasEntry, 'StopLoss:', hasStopLoss, 'TakeProfit:', hasTakeProfit);

    throw new Error('AI response missing required trade levels (entry/stopLoss/takeProfit)');
  }

  console.log('[OpenRouter] ✓ Analysis validation passed - all trade levels present');

  return {
    id: crypto.randomUUID(),
    userId: '', // Will be set by the caller
    imageUrl,
    analysisData: analysis,
    createdAt: new Date().toISOString(),
    metadata: {
      model,
      tokensUsed: response.usage?.total_tokens || 0,
      provider: 'openrouter',
    },
  };
}

export async function analyzeChartImageWithOpenRouter(
  imageUrl: string,
  additionalContext?: string,
  locale: string = 'en'
): Promise<AnalysisResult> {
  if (!isOpenRouterAvailable || !openrouter) {
    throw new Error('OpenRouter is not configured. Please add OPENROUTER_API_KEY to your environment variables.');
  }

  const basePrompt = getSMCAnalysisPrompt(locale);
  const prompt = additionalContext
    ? `${basePrompt}\n\nAdditional context: ${additionalContext}`
    : basePrompt;

  // Try primary model first
  const modelsToTry = [OPENROUTER_MODEL, ...OPENROUTER_FALLBACK_MODELS];
  let lastError: Error | null = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      console.log(`Attempting analysis with OpenRouter model: ${model}...`);
      const result = await tryModelAnalysis(model, imageUrl, prompt);
      console.log(`✓ Analysis successful with model: ${model}`);
      return result;
    } catch (error: any) {
      console.error(`✗ Model ${model} failed:`, error.message);
      lastError = error;

      // If it's a 429 error (rate limit), try next model
      if (error.status === 429 || error.code === 429 || error.message?.includes('429')) {
        console.log(`Model ${model} is rate limited, trying next model...`);
        continue;
      }

      // If it's the last model, throw the error
      if (i === modelsToTry.length - 1) {
        break;
      }

      // For other errors, try next model
      console.log(`Trying fallback model...`);
    }
  }

  // All models failed
  throw new Error(
    lastError instanceof Error
      ? `OpenRouter analysis failed after trying ${modelsToTry.length} models. Last error: ${lastError.message}`
      : 'OpenRouter analysis failed with unknown error'
  );
}
