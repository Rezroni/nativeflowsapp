import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateTradingTip, TradingTip } from '@/lib/openrouter/generate-tip';
import { rateLimit, createRateLimitHeaders } from '@/lib/rate-limit';

// Check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .in('role', ['super_admin', 'admin', 'editor'])
    .single();

  return !!adminRole;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute for AI generation
    const rateLimitResult = await rateLimit(request, { limit: 10, window: 60 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { category, difficulty, count } = body;

    // Input validation
    const validCategories = ['risk_management', 'technical_analysis', 'psychology', 'strategy', 'market_structure'];
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];

    if (category && !validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    if (difficulty && !validDifficulties.includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
    }

    if (count && (typeof count !== 'number' || count < 1 || count > 5)) {
      return NextResponse.json({ error: 'Count must be between 1 and 5' }, { status: 400 });
    }

    console.log('[Admin] Generating tips:', { category, difficulty, count });

    // Generate tip(s)
    if (count && count > 1) {
      // Generate multiple tips
      const tips: TradingTip[] = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        try {
          const tip = await generateTradingTip(category, difficulty);
          tips.push(tip);

          // Small delay to avoid rate limits
          if (i < count - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Failed to generate tip ${i + 1}:`, error);
        }
      }

      return NextResponse.json({
        success: true,
        tips,
        message: `Generated ${tips.length} trading tips`,
      });
    } else {
      // Generate single tip
      const tip = await generateTradingTip(category, difficulty);

      return NextResponse.json({
        success: true,
        tip,
        message: 'Trading tip generated successfully',
      });
    }
  } catch (error: any) {
    console.error('[Admin] Error generating tip:', error);

    // Handle specific errors
    if (error.message?.includes('OpenRouter')) {
      return NextResponse.json(
        { error: 'AI service unavailable. Check OpenRouter API key configuration.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate trading tip' },
      { status: 500 }
    );
  }
}
