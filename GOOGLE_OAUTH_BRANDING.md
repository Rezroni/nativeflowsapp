# Brand Google OAuth Consent Screen for Nativeflows

## Problem
Google OAuth shows "mkcbresdokdmdwvngeqw.supabase.co" instead of your brand "Nativeflows.com"

## Solution: Configure OAuth Consent Screen in Google Cloud Platform

---

## 🎨 Step 1: Update OAuth Consent Screen

### A. Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **OAuth consent screen** (left sidebar)

### B. Edit App Information
Click **EDIT APP** button and update these fields:

#### **App Information Section:**
- **App name**: `Nativeflows` or `Nativeflows AI Trading`
- **User support email**: `support@nativeflows.com` (or your business email)
- **App logo**: Upload your Nativeflows logo (120x120 pixels, PNG/JPG)

#### **App Domain Section:**
- **Application home page**: `https://nativeflows.com` (or your actual domain)
- **Application privacy policy link**: `https://nativeflows.com/privacy`
- **Application terms of service link**: `https://nativeflows.com/terms`

#### **Authorized domains:**
Add these domains (one per line):
```
nativeflows.com
supabase.co
```

⚠️ **Note**: You must verify domain ownership in Google Search Console first (see Step 2)

#### **Developer contact information:**
- **Email addresses**: Your business email

### C. Scopes (Next Screen)
Make sure you have these scopes:
- `../auth/userinfo.email`
- `../auth/userinfo.profile`
- `openid`

### D. Test Users (if in Testing mode)
If your app is in **Testing** publishing status, add test users:
- Add the email addresses that should be able to sign in

### E. Save Changes
Click **SAVE AND CONTINUE** through all steps

---

## 🔐 Step 2: Verify Domain Ownership (Required for Custom Domains)

To use your custom domain (nativeflows.com) in the OAuth screen, you need to verify it:

### A. Add Domain to Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add Property**
3. Enter: `https://nativeflows.com`
4. Follow verification steps (DNS, HTML file, or HTML tag)

### B. After Verification
1. Return to OAuth consent screen in Google Cloud Console
2. Under **Authorized domains**, add: `nativeflows.com`
3. Save changes

---

## 📋 Step 3: Update Publishing Status

### For Development/Testing:
- Keep **Publishing status**: `Testing`
- Add all test user emails
- Only those users can sign in

### For Production (Recommended):
1. Click **PUBLISH APP** button
2. If your app uses only basic scopes (email, profile), it will be published immediately
3. If you use sensitive scopes, Google will review your app (can take days/weeks)

**For your use case** (only email + profile), you can safely publish without review!

---

## ✅ Expected Result

After making these changes, when users sign in with Google, they will see:

❌ **Before:**
```
Sign in to mkcbresdokdmdwvngeqw.supabase.co
Choose an account to continue to mkcbresdokdmdwvngeqw.supabase.co
```

✅ **After:**
```
Sign in with Google
Choose an account to continue to Nativeflows
Google will allow Nativeflows to access this info about you
```

**Note:** The Supabase domain will still appear in the redirect URL (in the address bar briefly), but the consent screen will show your branding.

---

## 🎯 Quick Checklist

- [ ] Update App name to "Nativeflows"
- [ ] Upload Nativeflows logo
- [ ] Set Application home page to your domain
- [ ] Add Privacy Policy link
- [ ] Add Terms of Service link
- [ ] Verify domain in Google Search Console
- [ ] Add domain to Authorized domains
- [ ] Add Developer contact email
- [ ] Publish app (if ready)

---

## 🚀 For Production Deployment

When you deploy to production (Vercel/Netlify/etc.):

1. **Update Supabase Site URL**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Set Site URL to: `https://nativeflows.com`

2. **Update Google OAuth Redirect URI**:
   - Keep the Supabase callback URL: `https://mkcbresdokdmdwvngeqw.supabase.co/auth/v1/callback`
   - This is correct and should not be changed

3. **Update Supabase Redirect URLs**:
   - Add: `https://nativeflows.com/**`

4. **Update App URLs**:
   - In Google Cloud OAuth screen, use production URLs:
     - Home: `https://nativeflows.com`
     - Privacy: `https://nativeflows.com/privacy`
     - Terms: `https://nativeflows.com/terms`

---

## 🔍 Testing

After making changes:

1. Clear browser cookies
2. Go to your login page
3. Click "Continue with Google"
4. You should now see "Nativeflows" in the consent screen!

---

## 📝 Important Notes

1. **Domain Verification**: You MUST verify your domain in Google Search Console before Google will allow you to use it in the OAuth screen.

2. **Supabase in URL**: The Supabase domain (`mkcbresdokdmdwvngeqw.supabase.co`) will still briefly appear in the browser's address bar during redirect. This is normal and expected. The important part is that users see YOUR branding on the consent screen.

3. **Publishing Status**:
   - **Testing**: Only test users can sign in
   - **Published**: Anyone can sign in
   - For basic scopes (email, profile), publishing is instant with no review

4. **Logo Requirements**:
   - Size: 120x120 pixels
   - Format: PNG or JPG
   - Square aspect ratio
   - No transparency required

---

## 🎨 Branding Best Practices

### App Name Options:
- "Nativeflows" (simple)
- "Nativeflows AI" (descriptive)
- "Nativeflows - AI Trading Analysis" (full description)

Choose the one that best represents your brand!

### Logo:
Make sure your logo is clear and recognizable at small sizes. Google will display it at 40x40px on the consent screen.

---

## ❓ Troubleshooting

**Issue**: "Domain not verified" error
- **Solution**: Complete domain verification in Google Search Console first

**Issue**: Still seeing Supabase domain
- **Solution**: Clear browser cache and cookies, try incognito mode

**Issue**: Changes not appearing
- **Solution**: Can take up to 24 hours for Google to propagate changes. Try clearing cache or wait a bit.

---

Need help? Check:
- [Google OAuth Setup Guide](https://support.google.com/cloud/answer/6158849)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
