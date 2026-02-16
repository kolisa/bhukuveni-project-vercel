# 🚀 Supabase Cloud Sync Setup (Optional)

Your app **works perfectly without this** using localStorage. Supabase adds cloud sync for multi-device access.

## Step 1: Create Supabase Account (Free)

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (easiest)
4. Create a new project (choose free tier)
5. Wait 2 minutes for setup

## Step 2: Create Database Table

In your Supabase dashboard:

1. Go to **SQL Editor**
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Create table for Bhukuveni data
CREATE TABLE bhukuveni_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  data_key TEXT NOT NULL,
  data_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data_key)
);

-- Create index for faster queries
CREATE INDEX idx_user_data ON bhukuveni_data(user_id, data_key);

-- Enable Row Level Security (RLS)
ALTER TABLE bhukuveni_data ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write their own data (anonymous access)
CREATE POLICY "Allow anonymous access" ON bhukuveni_data
  FOR ALL USING (true)
  WITH CHECK (true);
```

4. Click **"Run"**

## Step 3: Get API Credentials

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 4: Add to Your App

### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your values:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-key-here
   ```

3. Restart dev server

### For Vercel Deployment:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add these variables:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Redeploy

## ✅ That's It!

Your app now:
- ✅ Works offline (localStorage)
- ✅ Syncs to cloud when online
- ✅ Multi-device access
- ✅ Automatic backup

## 🧪 Testing

Open browser console and look for:
- `"✅ Supabase cloud sync enabled"` = Working!
- `"📱 Running in offline-only mode"` = No credentials, using localStorage only

## 🔒 Security Notes

- The `anon` key is safe to expose (designed for client-side)
- Row Level Security (RLS) is enabled
- For production, add proper authentication
- Current setup: Anyone can read/write (good for single user/team)

## 🆘 Troubleshooting

**"Supabase initialization failed"**
- Check URL and key are correct
- No spaces/quotes in .env file
- Restart dev server after changing .env

**"Cloud sync failed"**
- Check if table exists (run SQL again)
- Check RLS policies are enabled
- App still works offline!

**Want to disable Supabase?**
- Just remove .env file or clear the values
- App automatically falls back to localStorage only
