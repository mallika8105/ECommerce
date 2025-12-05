# Products Not Loading - Quick Diagnostic Guide

## Check 1: Is Your Supabase Project Active?

### Test Right Now:

1. **Visit your project directly:**
   - Go to: https://supabase.com/dashboard/project/jifjjzaofphtebzdwicy
   - Look at the top of the page - does it say "Active" or "Paused"?

2. **If it says "Paused":**
   - Click "Restore project" button
   - Wait 2-3 minutes
   - Reload your NexBuy website
   - Products should now load!

3. **Quick terminal test:**
   ```bash
   curl -I https://jifjjzaofphtebzdwicy.supabase.co/rest/v1/products
   ```
   - If you get a timeout or connection refused → Project is paused
   - If you get HTTP 200 or 401 → Project is active

## Check 2: Do Products Exist in Database?

### Run this in Supabase SQL Editor:

```sql
-- Check if products table has data
SELECT COUNT(*) as total_products FROM products;
```

**Expected result:**
- If you see a number > 0 → Products exist
- If you see 0 → No products in database (need to add them)

### See all products:

```sql
SELECT id, name, price, image_url, is_active 
FROM products 
LIMIT 10;
```

This shows you exactly what products are in the database.

## Check 3: Is RLS Blocking the Query?

### Test if RLS is the issue:

```sql
-- Check RLS status on products table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'products';
```

**If `rowsecurity` is `true`:**

RLS is enabled and might be blocking queries. Disable it:

```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
```

## Check 4: Browser Console Errors

1. Open your NexBuy website
2. Press F12 to open DevTools
3. Go to Console tab
4. Reload the page
5. Look for errors

### Common errors and fixes:

**"Failed to fetch" or "ERR_FAILED"**
→ Supabase project is paused. Unpause it!

**"TypeError: Cannot read property..."**
→ Products loaded but data format is wrong

**No errors at all**
→ Check Network tab instead

## Check 5: Network Tab Analysis

1. Press F12 → Network tab
2. Reload the page
3. Filter by "Fetch/XHR"
4. Look for requests to `jifjjzaofphtebzdwicy.supabase.co`

### What to look for:

**Red requests with status (failed)**
→ Project is paused or network issue

**200 OK but no products showing**
→ RLS or empty response

**401 Unauthorized**
→ Authentication issue (but shouldn't happen with anon key)

## MOST LIKELY ISSUE: Project Paused Again

Free tier Supabase projects auto-pause after inactivity. If you:
- Haven't accessed it in a few days
- Recently restored it but didn't keep it active

**Solution:**
1. Go to dashboard
2. Check if paused
3. Click "Restore project"
4. Wait 2-3 minutes
5. Refresh website

## Quick Fix Commands

### If project is active but products don't load:

```sql
-- 1. Disable RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- 2. Verify products exist
SELECT COUNT(*) FROM products;

-- 3. Check if products are marked as active
SELECT COUNT(*) FROM products WHERE is_active = true;

-- 4. If no active products, activate them
UPDATE products SET is_active = true;
```

### If no products exist at all:

You need to add products. Run the sample data from FIX_MISSING_PRODUCT_IMAGES.md

## Test After Fixes

After applying fixes:

1. **Restart dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Clear browser cache:**
   - F12 → Right-click refresh → "Empty Cache and Hard Reload"

3. **Check homepage:**
   - Should see products in featured section
   - Should see products in bestsellers carousel

4. **Check product listing:**
   - Go to /products page
   - Should see all products listed

## Still Not Working?

### Get detailed info:

Run this in browser console on your website:

```javascript
// Test direct API call
fetch('https://jifjjzaofphtebzdwicy.supabase.co/rest/v1/products?select=*&limit=5', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZmpqemFvZnBodGViemR3aWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDcyMDYsImV4cCI6MjA3NTQ4MzIwNn0.3sf39ZfQvbvexKe9euBWG5zdHheQFR5744DgmVCMqdE',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZmpqemFvZnBodGViemR3aWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDcyMDYsImV4cCI6MjA3NTQ4MzIwNn0.3sf39ZfQvbvexKe9euBWG5zdHheQFR5744DgmVCMqdE'
  }
})
.then(r => r.json())
.then(data => {
  console.log('API Response:', data);
  if (Array.isArray(data)) {
    console.log(`✅ Success! Found ${data.length} products`);
    console.table(data);
  } else {
    console.log('❌ Error or empty response');
  }
})
.catch(err => {
  console.log('❌ Network error:', err.message);
  console.log('This usually means Supabase project is paused!');
});
```

**Expected output:**
- If working: `✅ Success! Found X products`
- If paused: `❌ Network error: Failed to fetch`
- If RLS blocking: Empty array `[]`

## Summary Checklist

✅ Check if Supabase project is active (not paused)
✅ Verify products exist in database
✅ Ensure RLS is disabled on products table  
✅ Check browser console for errors
✅ Restart dev server
✅ Clear browser cache

**90% of the time, the issue is: Project is paused!**
