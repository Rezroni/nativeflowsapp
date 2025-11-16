# Multilingual Analysis Implementation Guide

## Problem
Users selecting Russian or Arabic language receive analysis results in English only. The AI prompts need to be updated to return results in the user's selected language.

## Solution Overview
Add language detection from user cookies and pass locale to AI analysis functions.

## Implementation Steps

### 1. Created Multilingual Prompts ✅
**File**: `lib/openai/prompts-multilingual.ts`

New functions:
- `getSMCAnalysisPrompt(locale)` - Returns prompt with language-specific instructions
- `getCompareAnalysisPrompt(userAnalysis, locale)` - Returns comparison prompt in user's language
- `getLanguageInstruction(locale)` - Helper to get language instruction

Supported languages:
- `en` - English (default)
- `ru` - Russian (Русский) - All text in Russian
- `ar` - Arabic (العربية) - All text in Arabic with RTL support

### 2. Update Required Files

#### A. `lib/openai/analyze.ts`
```typescript
// Add locale parameter
export async function analyzeChartImage(
  imageUrl: string,
  additionalContext?: string,
  locale: string = 'en'  // ADD THIS
): Promise<AnalysisResult> {

  // Replace SMC_ANALYSIS_PROMPT with:
  const prompt = getSMCAnalysisPrompt(locale);

  // In messages array:
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: additional Context
          ? `${prompt}\n\nAdditional context: ${additionalContext}`
          : prompt,  // Use locale-specific prompt
      },
      // ... rest of the code
    ]
  }
}
```

#### B. `lib/anthropic/analyze.ts`
```typescript
// Add locale parameter
export async function analyzeChartImageWithClaude(
  imageUrl: string,
  additionalContext?: string,
  locale: string = 'en'  // ADD THIS
): Promise<AnalysisResult> {

  const prompt = getSMCAnalysisPrompt(locale);
  // Use prompt instead of SMC_ANALYSIS_PROMPT
}
```

#### C. `lib/openrouter/analyze.ts`
```typescript
// Add locale parameter
export async function analyzeChartImageWithOpenRouter(
  imageUrl: string,
  additionalContext?: string,
  locale: string = 'en'  // ADD THIS
): Promise<AnalysisResult> {

  const prompt = getSMCAnalysisPrompt(locale);
  // Use prompt instead of hard-coded prompt
}
```

#### D. `actions/analysis.ts`
```typescript
// At the top, add imports:
import { cookies } from 'next/headers';
import { locales, defaultLocale } from '@/i18n/request';

// In analyzeChart function, before routing to AI:
// Get user's locale from cookies
const cookieStore = await cookies();
const userLocale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
const locale = locales.includes(userLocale as any) ? userLocale : defaultLocale;

// Pass locale to AI functions:
if (planType === 'weekly') {
  analysisResult = await analyzeChartImageWithOpenRouter(imageUrl, additionalContext, locale);
} else {
  analysisResult = await analyzeChartImage(imageUrl, additionalContext, locale);
}
```

### 3. How It Works

1. **User selects language** → Cookie `NEXT_LOCALE` is set to `en`, `ru`, or `ar`
2. **User uploads chart** → `analyzeChart()` reads the locale cookie
3. **Locale passed to AI** → `getSMCAnalysisPrompt(locale)` generates language-specific instructions
4. **AI responds** → All text fields (narrative, descriptions, scenarios, etc.) in user's language
5. **User sees results** → Analysis displayed in their selected language

### 4. What Gets Translated

The AI will return these fields in the user's language:
- ✅ `orderBlocks[].description`
- ✅ `fvgs[].description`
- ✅ `liquidity.buySide[].type` and `sellSide[].type`
- ✅ `tradeSetup.confluences[]`
- ✅ `insights.narrative`
- ✅ `insights.smartMoneyBehavior`
- ✅ `insights.scenarios.bullish` and `bearish`
- ✅ `educationalNotes[]`

Numbers and technical values remain unchanged:
- ❌ Prices (stay as numbers)
- ❌ Trend/bias values (stay as "bullish"/"bearish"/"ranging")
- ❌ Entry types (stay as "market"/"limit")

### 5. Example Output

**English (en)**:
```json
{
  "insights": {
    "narrative": "The market is showing strong bullish momentum with a clear break of structure...",
    "smartMoneyBehavior": "Smart money is accumulating positions in the discount zone..."
  }
}
```

**Russian (ru)**:
```json
{
  "insights": {
    "narrative": "Рынок показывает сильный бычий импульс с четким пробоем структуры...",
    "smartMoneyBehavior": "Умные деньги накапливают позиции в зоне дисконта..."
  }
}
```

**Arabic (ar)**:
```json
{
  "insights": {
    "narrative": "يظهر السوق زخمًا صعوديًا قويًا مع كسر واضح للهيكل...",
    "smartMoneyBehavior": "الأموال الذكية تجمع المراكز في منطقة الخصم..."
  }
}
```

## Testing Checklist

### Manual Testing Steps
1. ✅ Create multilingual prompts file
2. ⏳ Update `lib/openai/analyze.ts` with locale parameter
3. ⏳ Update `lib/anthropic/analyze.ts` with locale parameter
4. ⏳ Update `lib/openrouter/analyze.ts` with locale parameter
5. ⏳ Update `actions/analysis.ts` to read and pass locale
6. ⏳ Test with English language setting
7. ⏳ Test with Russian language setting
8. ⏳ Test with Arabic language setting
9. ⏳ Verify all text fields are translated
10. ⏳ Verify numbers/prices remain unchanged

### Test Account
- Email: mido304@mail.ru
- Password: 123456789

### Test Flow
1. Login
2. Change language to Russian
3. Upload a chart
4. Verify analysis results are in Russian
5. Change language to Arabic
6. Upload same/different chart
7. Verify analysis results are in Arabic

## Files Modified
- ✅ `lib/openai/prompts-multilingual.ts` - New multilingual prompts
- ✅ `lib/openai/prompts.ts` - Export multilingual functions
- ⏳ `lib/openai/analyze.ts` - Add locale parameter
- ⏳ `lib/anthropic/analyze.ts` - Add locale parameter
- ⏳ `lib/openrouter/analyze.ts` - Add locale parameter
- ⏳ `actions/analysis.ts` - Read locale and pass to AI
- ✅ `MULTILINGUAL_ANALYSIS_UPDATE.md` - This documentation

## Next Steps
1. Complete the file updates listed above
2. Test with all three languages
3. Fix any remaining untranslated UI pages
4. Deploy to production

## Notes
- Numeric values (prices, percentages) stay unchanged for consistency
- JSON structure remains the same across all languages
- Only text/description fields are translated
- AI models (GPT-4, Claude, OpenRouter) all support multilingual responses
