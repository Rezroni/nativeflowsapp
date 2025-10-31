# Fix Google OAuth Redirect Issue

## Problem
Google Auth is redirecting to `localhost:3000` instead of `localhost:3005`

## Solution

You need to update the redirect URL in **TWO** places:

---

## 1️⃣ Update Supabase Configuration

### Step A: Update Site URL
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **mkcbresdokdmdwvngeqw**
3. Click **Authentication** in the left sidebar
4. Click **URL Configuration**
5. Update these fields:
   - **Site URL**: `http://localhost:3005`
   - **Redirect URLs**: Add these URLs (one per line):
     ```
     http://localhost:3005
     http://localhost:3005/auth/callback
     http://localhost:3005/**
     https://your-production-domain.com/auth/callback
     ```
6. Click **Save**

---

## 2️⃣ Update Google Cloud Platform

### Step B: Update OAuth Redirect URIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID (the one you're using for Supabase)
5. Under **Authorized redirect URIs**, update/add:
   ```
   https://mkcbresdokdmdwvngeqw.supabase.co/auth/v1/callback
   ```

   **Important**: This should be your Supabase project URL + `/auth/v1/callback`

   Format: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

   Your project ref is: **mkcbresdokdmdwvngeqw**

6. Also add for local testing (optional):
   ```
   http://localhost:3005/auth/callback
   ```

7. Click **Save**

---

## 3️⃣ Update Supabase Google Provider Settings

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Google** provider
3. Click **Edit**
4. Make sure these are filled:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
   - **Authorized Client IDs**: (optional, leave empty if not needed)
5. Click **Save**

---

## 4️⃣ Test the Flow

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Go to: `http://localhost:3005/login`

3. Click "Continue with Google"

4. It should now redirect to:
   - Google login page
   - Then back to: `http://localhost:3005/auth/callback`
   - Finally to: `http://localhost:3005/dashboard`

---

## 🔍 Debugging Tips

If it still doesn't work:

1. **Clear browser cookies** for `localhost`
2. **Check Supabase logs**:
   - Go to Supabase Dashboard > Logs > Auth Logs
   - Look for any error messages

3. **Check browser console** for errors

4. **Verify redirect URL** in the auth request:
   - Open browser DevTools > Network tab
   - Click "Continue with Google"
   - Look at the request to Google
   - Check the `redirect_uri` parameter - should include your Supabase URL

---

## ✅ Correct URLs Summary

- **Your App**: `http://localhost:3005`
- **Auth Callback**: `http://localhost:3005/auth/callback`
- **Supabase Callback URL (for Google)**: `https://mkcbresdokdmdwvngeqw.supabase.co/auth/v1/callback`

---

## Production Setup

When deploying to production (e.g., Vercel):

1. Update Supabase Site URL to your production domain
2. Add production callback URL to Google OAuth:
   ```
   https://your-domain.com/auth/callback
   ```
3. Add to Supabase Redirect URLs:
   ```
   https://your-domain.com/**
   ```
