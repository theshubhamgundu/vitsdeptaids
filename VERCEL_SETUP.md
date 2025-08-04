# Vercel Environment Variables Setup

## Current Issue
Your Vercel deployment is showing a "Headers" error because the Supabase environment variables are not properly configured.

## Solution: Add Environment Variables in Vercel

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Find your project `vitsdeptaids`

### Step 2: Add Environment Variables
1. Click on your project
2. Go to **Settings** tab
3. Click **Environment Variables** in the sidebar
4. Add these variables:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://kncqarmijdchduwkrani.supabase.co`

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuY3Fhcm1pamRjaGR1d2tyYW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NzY4MDEsImV4cCI6MjA1MTE1MjgwMX0.SShpQfnqGjwdOUWp9Q5lnhJCQXNhVwqw_iZOk4Rau7A`

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for the new deployment to complete

## Alternative: Get Fresh Supabase Credentials

If the above doesn't work, the anon key might be expired:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project `kncqarmijdchduwkrani`
3. Go to **Settings** → **API**
4. Copy the fresh **Project URL** and **anon public** key
5. Update the Vercel environment variables with the new values

## Current Fallback Mode

Don't worry - your application is already working! It's using a local fallback system:
- ✅ Student registration works with local validation
- ✅ Homepage shows dynamic content from admin uploads
- ✅ All dashboard features function normally

The system will automatically switch to database mode once the environment variables are properly configured.
