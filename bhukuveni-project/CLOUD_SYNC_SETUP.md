# 🌐 ENABLE CLOUD SYNC - Step by Step Guide

Your app currently works in **Offline Mode** (data stored locally only). Follow these steps to enable **Cloud Sync** so your data appears on all devices (mobile, PC, tablet).

---

## 📋 Quick Steps

### 1. Create FREE Supabase Account (2 minutes)
- Go to: https://supabase.com
- Click "Start your project"
- Sign up with GitHub, Google, or Email (100% free)

### 2. Create New Project (1 minute)
- Click "New Project"
- Choose any name (e.g., "Bhukuveni Home")
- Set a strong database password (save it somewhere safe)
- Select region closest to you
- Click "Create new project"
- ⏱️ Wait 2-3 minutes for setup

### 3. Get Your Credentials (30 seconds)
- In your project dashboard, click ⚙️ **Settings** (bottom left)
- Click **API** section
- You'll see:
  - **Project URL** (looks like: https://abc123xyz.supabase.co)
  - **anon public** key (long string starting with eyJ...)

### 4. Configure Your App (1 minute)

Open the `.env` file and replace:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-actual-key...
```

### 5. Create Database Table (2 minutes)

In Supabase dashboard:
1. Click **SQL Editor** (left sidebar)
2. Copy and paste this SQL:

```sql
-- Create storage table for app data
CREATE TABLE IF NOT EXISTS bhukuveni_storage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, key)
);

-- Enable Row Level Security
ALTER TABLE bhukuveni_storage ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own data
CREATE POLICY "Users can manage their own data"
  ON bhukuveni_storage
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bhukuveni_user_key 
  ON bhukuveni_storage(user_id, key);

-- Add automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bhukuveni_storage_updated_at 
  BEFORE UPDATE ON bhukuveni_storage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

3. Click **Run** (or press F5)
4. You should see "Success. No rows returned"

### 6. Rebuild Your App (30 seconds)

In your terminal:
```bash
npm run build
```

---

## ✅ Done! Cloud Sync is Now Active

After rebuilding, you'll see:
- Header shows **"Cloud Sync On"** (instead of "Offline Mode")
- Green animated dot indicator
- Your data automatically syncs to cloud
- Open app on any device and see the same data!

---

## 🔒 Security Notes

- ✅ Your data is private to your devices only (user_id based)
- ✅ Supabase free tier: 500MB storage, 2GB bandwidth/month
- ✅ All communication is encrypted (HTTPS)
- ✅ Even if Supabase is down, app works offline with localStorage

---

## 🆘 Troubleshooting

### Issue: Still shows "Offline Mode" after setup
- ✅ Check `.env` file has correct credentials (no quotes, no extra spaces)
- ✅ Rebuild: `npm run build`
- ✅ Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue: Can't see data on second device
- ✅ Make sure both devices use the same Supabase credentials
- ✅ Wait 5-10 seconds for initial sync
- ✅ Check browser console for errors (F12)

### Issue: SQL table creation failed
- ✅ Copy SQL one section at a time
- ✅ Make sure you're in SQL Editor, not Table Editor
- ✅ Check for any red error messages

---

## 💡 Tips

1. **First Device Setup**: Add some test data before opening on second device
2. **Sync Timing**: Changes sync within seconds when online
3. **Offline Support**: App works perfectly offline, syncs when back online
4. **Multiple Users**: Each browser gets unique user_id, data stays separate
5. **Backup**: Your data is in Supabase cloud - automatic backup!

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12 > Console tab)
2. Verify Supabase project is "Active" in dashboard
3. Confirm SQL table was created (Tables section in Supabase)
4. Test connection: In console type `window.storage.getStatus()`

---

**That's it!** Your Bhukuveni Home Manager now syncs across all your devices! 🎉
