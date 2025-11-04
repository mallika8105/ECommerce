# NexBuy Database Setup Guide

This directory contains database migration scripts and sample data for the NexBuy e-commerce platform.

## Prerequisites

- Supabase account and project
- Supabase CLI (optional, for local development)
- PostgreSQL knowledge (basic)

## Database Structure

The database consists of 8 main tables:

1. **categories** - Product categories
2. **subcategories** - Subcategories within categories
3. **products** - Product catalog
4. **profiles** - User profiles (extends Supabase auth)
5. **orders** - Customer orders
6. **order_items** - Items within orders
7. **reviews** - Product reviews
8. **wishlist** - User wishlist items

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Log into your Supabase project**

   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**

   - Navigate to the SQL Editor in the left sidebar
   - Click "New Query"

3. **Run Migration Script**

   - Copy the contents of `migrations/001_create_core_tables.sql`
   - Paste into the SQL Editor
   - Click "Run"
   - Wait for completion (should show "Success" message)

4. **Verify Tables Created**

   - Navigate to "Table Editor" in the left sidebar
   - You should see all 8 tables listed

5. **Load Sample Data** (Optional)
   - Copy the contents of `sample_data.sql`
   - Paste into a new SQL Editor query
   - Click "Run"

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push

# Or run specific migration file
psql YOUR_DATABASE_URL -f migrations/001_create_core_tables.sql
```

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Public Tables** (categories, subcategories, products)

  - Anyone can read active items
  - Only admins can create/update/delete

- **User Tables** (profiles, wishlist)

  - Users can only access their own data
  - Admins can view all profiles

- **Orders**

  - Users can view and create their own orders
  - Admins can view and manage all orders

- **Reviews**
  - Public can view approved reviews
  - Users can create and edit their own reviews
  - Admins can approve/manage all reviews

### Admin Users

To create an admin user:

1. User signs up normally through the app
2. Run this SQL in Supabase:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@yourdomain.com';
```

Or use the mock admin for development:

- Email: `admin@example.com`
- Password: `Admin@123`

## Troubleshooting

### Migration Fails with "relation already exists"

This means tables are already created. You can either:

1. **Drop and recreate** (⚠️ destroys all data):

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

2. **Continue with existing tables** - Just skip migration

### RLS Policies Block Queries

If queries fail unexpectedly:

1. Check if you're authenticated
2. Verify your user has correct role
3. Temporarily disable RLS for testing:

```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

**⚠️ Remember to re-enable before production!**

### Foreign Key Constraints

If you need to delete data with foreign key constraints:

```sql
-- Delete in correct order
DELETE FROM order_items WHERE order_id = 'xxx';
DELETE FROM orders WHERE id = 'xxx';

-- Or use CASCADE (be careful!)
DELETE FROM orders WHERE id = 'xxx'; -- Will delete order_items automatically
```

## Database Maintenance

### Backup Database

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or from dashboard
# Project Settings > Database > Connection string
# Use pg_dump with connection string
```

### Update Products in Bulk

```sql
-- Mark products as bestsellers
UPDATE public.products
SET is_bestseller = true
WHERE id IN ('id1', 'id2', 'id3');

-- Apply discount to category
UPDATE public.products
SET discount_percentage = 20
WHERE category_id = 'category-uuid';
```

### View Sales Reports

```sql
-- Total sales by status
SELECT status, COUNT(*) as count, SUM(total) as revenue
FROM public.orders
GROUP BY status;

-- Top selling products
SELECT p.name, SUM(oi.quantity) as total_sold
FROM public.order_items oi
JOIN public.products p ON p.id = oi.product_id
GROUP BY p.name
ORDER BY total_sold DESC
LIMIT 10;
```

## Schema Updates

When adding new features:

1. Create new migration file: `002_feature_name.sql`
2. Use `ALTER TABLE` commands to modify existing tables
3. Document changes in migration file
4. Test on development database first
5. Apply to production

Example:

```sql
-- Add average_rating column to products
ALTER TABLE public.products
ADD COLUMN average_rating DECIMAL(3, 2) DEFAULT 0;

-- Create function to update it
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET average_rating = (
        SELECT AVG(rating)
        FROM public.reviews
        WHERE product_id = NEW.product_id AND is_approved = true
    )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Environment Variables

Ensure these are set in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from:

- Supabase Dashboard > Project Settings > API

## Support

For issues:

1. Check Supabase logs: Dashboard > Logs
2. Verify RLS policies
3. Check foreign key constraints
4. Review this README

## Common Issues

### "is_active column doesn't exist" Error

**Problem:** You have existing tables without the `is_active` column, but the RLS policies reference it.

**Solution:** Run migration 002 to add missing columns:

```sql
-- In Supabase SQL Editor, run:
-- Copy contents of: database/migrations/002_add_is_active_column.sql
```

This migration:

- ✅ Adds `is_active` column to categories, subcategories, products
- ✅ Adds `is_featured`, `is_bestseller`, `discount_percentage` to products
- ✅ Updates RLS policies to use the new columns
- ✅ Safe to run multiple times (checks if columns exist first)

### Which Migration to Use?

**New Database (no tables exist):**

- Run `001_create_core_tables.sql` - Creates everything from scratch

**Existing Database (tables already exist):**

- Run `002_add_is_active_column.sql` - Adds missing columns to existing tables

**Not Sure?**

- Try running 002 first - it's safe and will notify what it adds
- If you get "table doesn't exist" errors, run 001 instead

## Migration History

| Version | Date       | Description                                                          |
| ------- | ---------- | -------------------------------------------------------------------- |
| 001     | 2025-11-04 | Initial schema with core tables                                      |
| 002     | 2025-11-04 | Add is_active and feature columns to existing tables                 |
| 003     | 2025-11-04 | Add address fields to profiles table (address, city, state, pincode) |

## Next Steps

After running migrations:

1. ✅ Verify all tables created
2. ✅ Load sample data (optional)
3. ✅ Create admin user
4. ✅ Test authentication
5. ✅ Test product CRUD
6. ✅ Place test order
7. ✅ Verify RLS works correctly

Happy selling! 🚀
