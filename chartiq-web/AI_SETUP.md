# AI Provider Setup Guide

ChartIQ AI supports two AI providers for chart analysis:
1. **OpenAI GPT-4 Vision** (Primary)
2. **Claude AI (Anthropic)** (Fallback)

You need **at least one** configured for the app to work.

## 🤖 Quick Setup

Add to your `.env.local` file:

```env
# Option 1: Use Claude AI (Recommended - More Reliable)
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE

# Option 2: Use OpenAI GPT-4 (If you have access)
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
# Optional: Only if your key is tied to an organization
OPENAI_ORGANIZATION=org-YOUR_ORG_ID

# Best: Use Both (Automatic Fallback)
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

## 🎯 Recommended: Claude AI

Claude AI is recommended because:
- ✅ More reliable with vision tasks
- ✅ Better at following JSON structure
- ✅ No organization issues
- ✅ Excellent SMC analysis
- ✅ Latest Claude 3.5 Sonnet with vision

### Get Claude API Key

1. Go to: https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy your API key (starts with `sk-ant-api03-`)
6. Add to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY
   ```

**Your Claude API Key**: `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`

## 🔧 Optional: OpenAI GPT-4

If you want to use OpenAI as primary (with Claude as fallback):

### Fix the Organization Error

The error you saw was:
```
401 OpenAI-Organization header should match organization for API key
```

This happens when:
- Your API key is tied to a specific organization
- But you're not including the organization ID in requests

### Solutions:

#### Solution 1: Don't Set Organization (Recommended)
If your API key is NOT tied to an organization:
```env
OPENAI_API_KEY=sk-proj-YOUR_KEY
# Don't set OPENAI_ORGANIZATION at all
```

#### Solution 2: Add Organization ID
If your API key IS tied to an organization:
```env
OPENAI_API_KEY=sk-proj-YOUR_KEY
OPENAI_ORGANIZATION=org-YOUR_ORG_ID
```

To find your organization ID:
1. Go to: https://platform.openai.com/settings/organization
2. Copy the "Organization ID" (starts with `org-`)

#### Solution 3: Create a New API Key
1. Go to: https://platform.openai.com/api-keys
2. Delete old key (if problematic)
3. Create new key WITHOUT organization
4. Use the new key

## 🔄 How Fallback Works

The app tries providers in this order:

1. **OpenAI First** (if configured)
   - Attempts GPT-4 Vision analysis
   - If fails → Falls back to Claude

2. **Claude Second** (if configured)
   - Uses Claude 3.5 Sonnet with vision
   - If both fail → Shows error

3. **Best Practice**: Configure both!
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   OPENAI_API_KEY=sk-proj-...
   ```

## 📊 Comparison

| Feature | Claude AI | OpenAI GPT-4 |
|---------|-----------|--------------|
| Vision Quality | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| JSON Reliability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| SMC Knowledge | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Cost (per 1M tokens) | $3 | $5 |
| Speed | Fast | Fast |
| Org Issues | ❌ None | ⚠️ Sometimes |
| Setup Difficulty | Easy | Medium |

## 🧪 Testing

After setup, test by:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Upload a chart** at http://localhost:3005/analyze

3. **Check console logs**:
   - Success: "Using Claude AI for analysis..." or "Attempting analysis with OpenAI GPT-4..."
   - Error: Will show which provider failed and why

## 🐛 Troubleshooting

### Issue: "No AI provider available"
**Solution**: You haven't configured any AI provider. Add at least one API key to `.env.local`

### Issue: OpenAI 401 error
**Solution**:
1. Remove `OPENAI_ORGANIZATION` from `.env.local`
2. Or add the correct organization ID
3. Or just use Claude AI instead

### Issue: Claude "Invalid API Key"
**Solution**:
1. Check your API key starts with `sk-ant-api03-`
2. Make sure there are no extra spaces
3. Verify the key is active in Anthropic Console

### Issue: Analysis fails but no error
**Solution**:
1. Check browser console (F12)
2. Check server console logs
3. Verify image URL is accessible
4. Check API quotas/limits

## 💰 Pricing

### Claude AI Pricing
- **Input**: $3 per million tokens
- **Output**: $15 per million tokens
- **Average cost per analysis**: ~$0.05-0.10

### OpenAI GPT-4 Vision Pricing
- **Input**: $5 per million tokens
- **Output**: $15 per million tokens
- **Average cost per analysis**: ~$0.08-0.15

**Recommendation**: Start with Claude - it's more reliable and slightly cheaper!

## 🔐 Security Notes

- ⚠️ **Never commit** `.env.local` to git
- ✅ API keys are only used server-side
- ✅ Keys are never exposed to the browser
- ✅ Each analysis logs which provider was used

## 📚 Next Steps

After setting up your AI provider:

1. ✅ Add API key to `.env.local`
2. ✅ Restart your dev server
3. ✅ Test chart upload and analysis
4. ✅ Check the analysis results
5. ✅ Verify the provider logs

Need help? Check the console logs for detailed error messages!
