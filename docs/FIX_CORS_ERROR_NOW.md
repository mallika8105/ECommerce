# FIX: CORS Error - Access Blocked by CORS Policy

## Error Description

You're seeing this error in the console:

```
Access to fetch at 'https://jifjjzaofphtebzdwicy.supabase.co/rest/v1/products...' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause

This CORS error occurs when the Supabase server is rejecting your requests. The most common causes are:

1. **Supabase Project is Paused** (Most Common)
2. **RLS Policies Are Blocking Requests**
3. **Not Properly Authenticated**

## IMMEDIATE FIX - Step by Step

### Step 1: Check if Supabase Project is Active

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Look for your project: `jifjjzaofphtebzdwicy`
3. **If it says "Paused":**
   - Click "Restore project" or "Unpause"
   - Wait 2-3 minutes for it to activate
   - Then restart your dev server

### Step 2: Disable RLS on Products Table (If Project is Active)

If your project is active but you're still getting CORS errors, RLS might be blocking access.

**Go to your Supabase SQL Editor and run:**

```sql
-- Disable RLS on products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Also disable on related tables
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
```

**Then refresh your application.**

### Step 3: Verify Your Environment Variables

Make sure your `.env` file has the correct values:

```env
VITE_SUPABASE_URL=https://jifjjzaofphtebzdwicy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZmpqemFvZnBodGViemR3aWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDcyMDYsImV4cCI6MjA3NTQ4MzIwNn0.3sf39ZfQvbvexKe9euBWG5zdHheQFR5744DgmVCMqdE
```

### Step 4: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C or Cmd+C)
# Then restart:
npm run dev
```

### Step 5: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## Why This Happens

The CORS error is misleading - it's not actually a CORS configuration issue. It happens because:

1. **Supabase pauses free tier projects** after inactivity
2. When paused, the API doesn't respond properly, causing CORS errors
3. **RLS policies** can also block requests if not configured correctly

## Permanent Solution

### Option 1: Disable RLS (Development Mode)

For development, you can disable RLS entirely:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

### Option 2: Configure Proper RLS Policies (Production Mode)

If you want to use RLS properly, create these policies:

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON products
FOR SELECT TO public USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON products
FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON products
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON products
FOR DELETE TO authenticated USING (true);
```

## Verification Steps

After applying the fix:

1. Open your browser console (F12)
2. Go to the Product Management page
3. Try to add a product
4. **Success:** Product appears in the list
5. **Still failing:** Check the error messages in console

## Quick Test Commands

Test if your Supabase is accessible:

```bash
# Open a new terminal and run:
curl -I https://jifjjzaofphtebzdwicy.supabase.co/rest/v1/products
```

**Expected response:**
- If project is active: `HTTP/2 200` or `HTTP/2 401`
- If project is paused: Connection timeout or DNS error

## Common Mistakes

❌ **Don't do this:**
- Trying to fix CORS by adding headers in your code
- Modifying the Supabase client configuration
- Adding CORS middleware to your frontend

✅ **Do this instead:**
- Unpause your Supabase project
- Disable RLS or configure proper policies
- Ensure you're authenticated before making requests

## Still Having Issues?

If you're still seeing CORS errors after trying all the above:

1. **Check Supabase Status:**
   - Visit: https://status.supabase.com/
   - Check for any ongoing incidents

2. **Verify Project Health:**
   - Go to your project settings
   - Check if there are any warnings or alerts

3. **Check Browser Console:**
   - Look for other error messages
   - The CORS error might be masking a different issue

4. **Contact Supabase Support:**
   - If nothing works, contact support with your project ref: `jifjjzaofphtebzdwicy`

## Summary

The CORS error is usually **not a CORS problem** - it's:
1. ✅ Paused Supabase project → Unpause it
2. ✅ RLS blocking requests → Disable RLS or add policies
3. ✅ Old cached data → Clear cache and restart

**90% of the time, unpausing your Supabase project fixes this!**
