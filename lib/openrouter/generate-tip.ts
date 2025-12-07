import { openrouter, OPENROUTER_MODEL, isOpenRouterAvailable } from './client';

export interface TradingTip {
  title: string;
  content: string;
  category: 'risk_management' | 'technical_analysis' | 'psychology' | 'strategy' | 'market_structure';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  actionable: boolean;
}

/**
 * Generate a trading tip using OpenRouter AI
 * Uses Gemini 2.0 Flash for fast, free tip generation
 */
export async function generateTradingTip(
  category?: TradingTip['category'],
  difficulty?: TradingTip['difficulty']
): Promise<TradingTip> {
  if (!isOpenRouterAvailable || !openrouter) {
    throw new Error('OpenRouter is not configured. Please add OPENROUTER_API_KEY to environment variables.');
  }

  const categoryPrompt = category ? `focusing on ${category.replace('_', ' ')}` : '';
  const difficultyPrompt = difficulty ? `for ${difficulty} traders` : '';

  const prompt = `You are an expert trading educator specializing in Smart Money Concepts (SMC).

Generate a single, actionable trading tip ${difficultyPrompt} ${categoryPrompt}.

The tip should be:
- Practical and immediately applicable
- Based on Smart Money Concepts principles
- Clear and concise (2-3 sentences)
- Valuable for traders

Categories include:
- risk_management: Position sizing, stop loss, risk/reward
- technical_analysis: Chart patterns, indicators, price action
- psychology: Trading mindset, discipline, emotions
- strategy: Entry/exit strategies, trade planning
- market_structure: Order blocks, FVG, liquidity, market phases

Return ONLY a JSON object with this structure:
{
  "title": "Catchy, short title (max 50 chars)",
  "content": "The tip content (2-3 sentences, max 200 chars)",
  "category": "one of the categories above",
  "difficulty": "beginner, intermediate, or advanced",
  "actionable": true or false
}`;

  try {
    console.log('[GenerateTip] Generating trading tip with OpenRouter...');
    console.log('[GenerateTip] Category:', category || 'any');
    console.log('[GenerateTip] Difficulty:', difficulty || 'any');

    const response = await openrouter.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional trading educator. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.9, // Higher temperature for more creative tips
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenRouter');
    }

    console.log('[GenerateTip] Raw response:', content);

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from OpenRouter');
    }

    const tip: TradingTip = JSON.parse(jsonMatch[0]);

    // Validate the tip
    if (!tip.title || !tip.content || !tip.category || !tip.difficulty) {
      throw new Error('Incomplete tip data from AI');
    }

    console.log('[GenerateTip] ✓ Tip generated successfully');
    console.log('[GenerateTip] Title:', tip.title);

    return tip;
  } catch (error) {
    console.error('[GenerateTip] Error:', error);
    throw error;
  }
}

/**
 * Generate multiple trading tips at once
 */
export async function generateMultipleTips(
  count: number = 5,
  category?: TradingTip['category'],
  difficulty?: TradingTip['difficulty']
): Promise<TradingTip[]> {
  const tips: TradingTip[] = [];

  // Generate tips sequentially to avoid rate limits
  for (let i = 0; i < count; i++) {
    try {
      const tip = await generateTradingTip(category, difficulty);
      tips.push(tip);

      // Small delay between requests to avoid rate limiting
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to generate tip ${i + 1}:`, error);
      // Continue generating remaining tips
    }
  }

  return tips;
}
