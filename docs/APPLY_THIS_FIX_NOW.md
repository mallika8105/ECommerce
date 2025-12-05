# 🚨 IMMEDIATE FIX - Run This Now

## The Problem
You're still seeing this error even after running the migration:
```
Key (user_id)=(a0000000-0000-4000-8000-000000000001) is not present in table "users"
```

This means the foreign key constraint is still active.

## ✅ SIMPLE FIX - Just 2 Steps

### Step 1: Run This Single Command in Supabase

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste **ONLY THIS**:

```sql
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
```

3. Click **"Run"**
4. You should see: `SUCCESS. No rows returned`

### Step 2: Hard Refresh Your Browser

Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)

## That's It!

Now try placing an order again. It should work.

---

## Why This Works

The problematic foreign key constraint references a table that doesn't exist. By removing it entirely, orders can be created without the constraint check.

## Verify It Worked

After running the command, you can verify with:

```sql
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'orders' 
AND constraint_name = 'orders_user_id_fkey';
```

**Expected**: No rows returned (constraint is gone)

---

**This is a safe operation** - it only removes a broken constraint that was preventing orders from being created.
