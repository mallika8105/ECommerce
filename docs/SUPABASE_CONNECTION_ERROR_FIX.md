# Supabase Connection Error - ERR_NAME_NOT_RESOLVED

## Error Description

You're encountering a `net::ERR_NAME_NOT_RESOLVED` error when trying to connect to your Supabase database:

```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
jifjjzaofphtebzdwicy.supabase.co/rest/v1/products
```

This error means the DNS cannot resolve your Supabase project URL, which typically indicates one of these issues:

## Most Common Causes

### 1. **Supabase Project is Paused** (Most Likely)
Free tier Supabase projects automatically pause after 7 days of inactivity to save resources.

### 2. **Project Was Deleted**
The Supabase project no longer exists in your account.

### 3. **Incorrect Project URL**
The URL in your `.env` file doesn't match your actual Supabase project.

## How to Fix

### Step 1: Check Your Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Log in to your account
3. Look for your project with reference: `jifjjzaofphtebzdwicy`

### Step 2: If Project is Paused

If you see a "Paused" status on your project:

1. Click on the project
2. Click the **"Restore project"** or **"Unpause"** button
3. Wait a few minutes for the project to become active
4. Refresh your application

### Step 3: If Project Doesn't Exist

If you can't find the project (it may have been deleted):

1. **Create a new Supabase project:**
   - Click "New Project" in your Supabase dashboard
   - Choose a name and region
   - Set a strong database password (save this!)
   - Wait for the project to be provisioned

2. **Get your new credentials:**
   - Go to Project Settings → API
   - Copy the **Project URL**
   - Copy the **anon/public key**

3. **Update your `.env` file:**
   ```env
   VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT_URL.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
   ```

4. **Re-run your database migrations:**
   - You'll need to recreate your database schema
   - Run all migration files in the `database/migrations/` folder in order
   - Re-insert sample data if needed

### Step 4: Restart Your Development Server

After fixing the credentials:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Verify the Fix

1. Open your browser console (F12)
2. Navigate to your application
3. Try adding a product in the admin panel
4. You should no longer see the `ERR_NAME_NOT_RESOLVED` error

## Current Configuration

Your current `.env` file has:
```
VITE_SUPABASE_URL=https://jifjjzaofphtebzdwicy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Prevention Tips

- **Upgrade to Supabase Pro** if you want to avoid auto-pausing (costs $25/month)
- **Visit your project regularly** to keep it active on the free tier
- **Set up monitoring** to get notified when your project pauses

## Additional Help

If none of the above works:

1. Check your internet connection
2. Try accessing https://jifjjzaofphtebzdwicy.supabase.co directly in a browser
3. Contact Supabase support if the issue persists

## Quick Actions

**To unpause project:**
1. Visit: https://supabase.com/dashboard/project/jifjjzaofphtebzdwicy
2. Click "Restore project"
3. Wait 2-3 minutes
4. Refresh your app

**To create new project:**
1. Visit: https://supabase.com/dashboard
2. Click "New Project"
3. Follow the steps above to update credentials
