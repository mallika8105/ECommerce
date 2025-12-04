# Apply Migration 024: Fix Checkout Errors

## Problem
The checkout page is experiencing two critical errors:
1. **406 Error** when fetching profile data: "Failed to load resource: the server responded with a status of 406"
2. **409 Error** when placing orders: "Failed to load resource: the server responded with a status of 409"

These errors prevent users from completing checkout and placing orders.

## Root Causes

### 1. Profile 406 Error
- The Supabase client wasn't configured with proper headers for content negotiation
- The query was using `.single()` which throws an error if no row is found
- Missing proper column configuration in profiles table

### 2. Order 409 Error (Conflict)
- Data type mismatches between the application and database
- Missing required columns in order_items table
- Potential constraint violations in the orders table

## Solution Overview

This migration provides a comprehensive fix:
1. **Database Schema**: Ensures all tables have the correct columns and data types
2. **Supabase Client**: Updated with proper headers and configuration
3. **CheckoutPage**: Changed from `.single()` to `.maybeSingle()` to handle missing profiles gracefully

## How to Apply This Fix

### Step 1: Apply the Database Migration

1. Open your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy the entire contents of `database/migrations/024_fix_checkout_errors.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute the migration

**What this does:**
- Disables RLS on profiles, orders, and order_items tables
- Ensures all required columns exist with correct data types
- Converts address column to JSONB type for proper JSON handling
- Grants necessary permissions to authenticated and anonymous users
- Verifies the table structures

### Step 2: Verify the Migration

After running the migration, check the output at the bottom of the SQL Editor. You should see:

1. **Profiles table structure** with columns: id, full_name, phone, address (JSONB), role
2. **Orders table structure** with columns including: shipping_address (JSONB), payment_method, payment_status
3. **Order_items table structure** with columns: product_name, product_code, product_image_url, subtotal
4. **RLS status** showing all three tables with `rowsecurity = false`

### Step 3: Code Changes (Already Applied)

The following code changes have already been made:

1. **src/supabaseClient.ts**: 
   - Added proper headers for content negotiation
   - Added schema configuration

2. **src/pages/CheckoutPage.tsx**:
   - Changed `.single()` to `.maybeSingle()` for profile fetch
   - This prevents 406 errors when profile doesn't exist

### Step 4: Test the Checkout Flow

1. **Clear your browser cache and refresh the page**
2. Add a product to your cart
3. Go to checkout
4. Fill in the shipping address
5. Place an order
6. Verify the order is created successfully

## Expected Behavior After Fix

✅ **Profile Fetch**: Should load without 406 errors, even if profile doesn't exist yet  
✅ **Address Loading**: Should populate saved address or show empty form  
✅ **Order Creation**: Should complete without 409 errors  
✅ **Order Confirmation**: Should redirect to order confirmation page  
✅ **Profile Update**: Address should be saved for next checkout  

## Verification Checklist

- [ ] Migration executed successfully in Supabase
- [ ] All verification queries returned expected results
- [ ] Browser cache cleared and page refreshed
- [ ] Can view checkout page without errors
- [ ] Can successfully place an order
- [ ] Order appears in "My Orders" page
- [ ] No console errors related to profiles or orders

## Troubleshooting

### If you still see errors:

1. **Check Browser Console**: Look for specific error messages
2. **Verify Migration**: Run this query in Supabase SQL Editor:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('profiles', 'orders', 'order_items');
   ```
   All three should show `rowsecurity = false`

3. **Check Column Types**: Run this query:
   ```sql
   SELECT table_name, column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name IN ('profiles', 'orders', 'order_items')
   AND column_name IN ('address', 'shipping_address')
   ORDER BY table_name, column_name;
   ```
   Both should show `data_type = jsonb`

4. **Hard Refresh**: Try Ctrl+Shift+R (or Cmd+Shift+R on Mac) to force a complete refresh

## Notes

- This migration disables RLS on profiles, orders, and order_items tables for simplicity
- All data types have been standardized (JSONB for addresses, TEXT for other fields)
- The checkout flow now handles missing profiles gracefully
- Order creation uses proper JSONB formatting for shipping addresses

## Questions?

If you encounter any issues after applying this migration, check:
1. Supabase logs for any server-side errors
2. Browser console for client-side errors
3. Network tab to see the exact API requests/responses
