# How to Apply Migration 018 - Clear Address Data

This migration clears all saved address data from the profiles table, removing any mock data and allowing users to start fresh with empty fields.

## Steps to Apply:

1. **Go to your Supabase Dashboard**
   - Navigate to your project at https://supabase.com/dashboard

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the SQL**
   - Open `database/migrations/018_clear_address_data.sql`
   - Copy the entire content
   - Paste it into the SQL Editor

4. **Run the Migration**
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - Wait for the query to complete

5. **Verify Results**
   - The script will show you all profiles with their address data
   - All address fields (phone, address, full_name, city, state, pincode) should now be NULL

6. **Test the Application**
   - Refresh your application
   - Go to the checkout page
   - All address fields should now be empty and require user input

## What This Does:

- Clears `phone` field for all users
- Clears `address` field for all users  
- Clears `full_name` field for all users
- Clears `city` field for all users
- Clears `state` field for all users
- Clears `pincode` field for all users

## Note:

⚠️ **This will clear ALL user address data** - both mock data and real user data. If you have real users who have entered their addresses, consider doing this only in a development/testing environment, not production.

For production, you may want to selectively clear only test accounts or specific users.

## After Running:

When users (including you) visit the checkout page or profile page, they will see empty fields and need to enter their information fresh.
