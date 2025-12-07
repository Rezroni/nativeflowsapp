import { openrouter, OPENROUTER_MODEL, isOpenRouterAvailable } from './client';

export interface TradingTip {
  title: string;
  content: string;
  category: 'risk_management' | 'technical_analysis' | 'psychology' | 'strategy' | 'market_structure';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  actionable: boolean;
}

// Fallback pre-written tips for when API fails or rate limit is reached
const FALLBACK_TIPS: TradingTip[] = [
  {
    title: "Master Your Risk-Reward Ratio",
    content: "Always aim for a minimum 1:2 risk-reward ratio. If you risk $100, target at least $200 profit. This ensures profitability even with a 50% win rate.",
    category: "risk_management",
    difficulty: "beginner",
    actionable: true
  },
  {
    title: "Never Risk More Than 2%",
    content: "Risk no more than 2% of your trading capital per trade. This protects you from catastrophic losses and allows you to survive losing streaks.",
    category: "risk_management",
    difficulty: "beginner",
    actionable: true
  },
  {
    title: "Identify Order Blocks",
    content: "Look for order blocks where price consolidated before a strong move. These areas often act as strong support/resistance when retested.",
    category: "market_structure",
    difficulty: "intermediate",
    actionable: true
  },
  {
    title: "Trade Fair Value Gaps (FVG)",
    content: "FVGs are imbalances in price where buying/selling pressure was extreme. Price often returns to fill these gaps, creating trading opportunities.",
    category: "market_structure",
    difficulty: "intermediate",
    actionable: true
  },
  {
    title: "Wait for Break of Structure",
    content: "Don't chase moves. Wait for a clear break of market structure (BOS) to confirm trend direction before entering trades.",
    category: "technical_analysis",
    difficulty: "intermediate",
    actionable: true
  },
  {
    title: "Use Multiple Timeframe Analysis",
    content: "Always check higher timeframes for trend direction and lower timeframes for precise entries. Trade with the higher timeframe trend.",
    category: "strategy",
    difficulty: "intermediate",
    actionable: true
  },
  {
    title: "Control Your Emotions",
    content: "Fear and greed are your worst enemies. Stick to your trading plan regardless of how you feel. Emotional trading leads to losses.",
    category: "psychology",
    difficulty: "beginner",
    actionable: true
  },
  {
    title: "Journal Every Trade",
    content: "Keep a detailed trading journal with screenshots, entry reasons, and outcomes. Review it weekly to identify patterns and improve.",
    category: "psychology",
    difficulty: "beginner",
    actionable: true
  },
  {
    title: "Avoid Revenge Trading",
    content: "After a loss, take a break instead of trying to win it back immediately. Revenge trading leads to bigger losses and emotional decisions.",
    category: "psychology",
    difficulty: "beginner",
    actionable: true
  },
  {
    title: "Liquidity Grab Setup",
    content: "Smart money often sweeps liquidity (stop losses) before reversing. Look for price to grab liquidity at highs/lows, then enter on the reversal.",
    category: "market_structure",
    difficulty: "advanced",
    actionable: true
  },
  {
    title: "Session-Based Trading",
    content: "London and New York sessions offer the best liquidity and volatility. Avoid trading during low-volume Asian sessions unless specifically trading Asian pairs.",
    category: "strategy",
    difficulty: "intermediate",
    actionable: true
  },
  {
    title: "Confirm With Volume",
    content: "Volume confirms price moves. Strong moves with low volume are likely to fail. Look for increasing volume in the direction of your trade.",
    category: "technical_analysis",
    difficulty: "intermediate",
    actionable: true
  },
  {
    title: "Scale In, Scale Out",
    content: "Don't go all-in at once. Build positions gradually as the trade develops, and take partial profits at key levels to secure gains.",
    category: "risk_management",
    difficulty: "advanced",
    actionable: true
  },
  {
    title: "Respect Institutional Levels",
    content: "Round numbers (1.2000, 100.00) and previous day/week highs/lows are institutional levels where smart money places orders. Watch for reactions.",
    category: "market_structure",
    difficulty: "intermediate",
    actionable: true
  },
  {
    title: "Trade the Pullback",
    content: "After a strong move, wait for the pullback to enter. Never chase breakouts. Let price come to you at optimal entry zones.",
    category: "strategy",
    difficulty: "beginner",
    actionable: true
  }
];

/**
 * Get a random fallback tip matching the specified filters
 */
function getFallbackTip(
  category?: TradingTip['category'],
  difficulty?: TradingTip['difficulty']
): TradingTip {
  let filteredTips = [...FALLBACK_TIPS];

  // Filter by category if specified
  if (category) {
    const categoryTips = filteredTips.filter(tip => tip.category === category);
    if (categoryTips.length > 0) {
      filteredTips = categoryTips;
    }
  }

  // Filter by difficulty if specified
  if (difficulty) {
    const difficultyTips = filteredTips.filter(tip => tip.difficulty === difficulty);
    if (difficultyTips.length > 0) {
      filteredTips = difficultyTips;
    }
  }

  // Return random tip from filtered results
  const randomIndex = Math.floor(Math.random() * filteredTips.length);
  return filteredTips[randomIndex];
}

/**
 * Generate a trading tip using OpenRouter AI
 * Uses Gemini 2.0 Flash for fast, free tip generation
 * Falls back to pre-written tips if API fails or rate limit is reached
 */
export async function generateTradingTip(
  category?: TradingTip['category'],
  difficulty?: TradingTip['difficulty']
): Promise<TradingTip> {
  if (!isOpenRouterAvailable || !openrouter) {
    console.log('[GenerateTip] OpenRouter not configured, using fallback tip');
    return getFallbackTip(category, difficulty);
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
  } catch (error: any) {
    console.error('[GenerateTip] Error:', error);

    // Check if it's a rate limit error (429)
    const isRateLimitError =
      error?.status === 429 ||
      error?.code === 429 ||
      error?.message?.toLowerCase().includes('rate limit') ||
      error?.message?.toLowerCase().includes('429');

    if (isRateLimitError) {
      console.log('[GenerateTip] Rate limit reached, using fallback tip');
      const fallbackTip = getFallbackTip(category, difficulty);

      // Throw a specific error to inform the user about rate limits
      const rateLimitError = new Error(
        'OpenRouter free tier rate limit reached. Using pre-written tip instead. To generate unlimited AI tips, add credits to your OpenRouter account at https://openrouter.ai/credits'
      );
      (rateLimitError as any).isRateLimit = true;
      (rateLimitError as any).fallbackTip = fallbackTip;

      throw rateLimitError;
    }

    // For other errors, also provide fallback but with different message
    console.log('[GenerateTip] API error, using fallback tip');
    const fallbackTip = getFallbackTip(category, difficulty);

    const apiError = new Error(
      `OpenRouter API error: ${error?.message || 'Unknown error'}. Using pre-written tip instead.`
    );
    (apiError as any).isApiError = true;
    (apiError as any).fallbackTip = fallbackTip;

    throw apiError;
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
