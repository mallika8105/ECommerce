# Fix Missing Product Images

## Problem

All product images are not showing on the NexBuy website. This happens when:

1. Products have no `image_url` (NULL or empty)
2. Image URLs point to broken/deleted external sources
3. The database was recreated and products lost their image references

## Quick Fix - Add Sample Products with Images

### Option 1: Use Sample Data SQL (Recommended)

Run this SQL in your Supabase SQL Editor to add products with working images:

```sql
-- First, add some categories
INSERT INTO categories (name, description, is_active) VALUES
('Electronics', 'Electronic devices and gadgets', true),
('Clothing', 'Fashion and apparel', true),
('Home & Kitchen', 'Home essentials and kitchen items', true)
ON CONFLICT (name) DO NOTHING;

-- Add some subcategories
INSERT INTO subcategories (category_id, name, description, is_active)
SELECT id, 'Smartphones', 'Mobile phones and accessories', true
FROM categories WHERE name = 'Electronics'
UNION ALL
SELECT id, 'Laptops', 'Portable computers', true
FROM categories WHERE name = 'Electronics'
UNION ALL
SELECT id, 'Men''s Wear', 'Clothing for men', true
FROM categories WHERE name = 'Clothing'
ON CONFLICT (category_id, name) DO NOTHING;

-- Add sample products with working image URLs from Unsplash
INSERT INTO products (name, description, price, stock, product_code, image_url, category_id, is_featured, is_bestseller)
SELECT 
    'iPhone 15 Pro',
    'Latest Apple smartphone with advanced features',
    99999,
    50,
    'IP15PRO-2024',
    'https://images.unsplash.com/photo-1592286927505-2fd0099c1ec4?w=500',
    id,
    true,
    true
FROM categories WHERE name = 'Electronics'
UNION ALL
SELECT 
    'Samsung Galaxy S24',
    'Premium Android smartphone',
    79999,
    45,
    'SGS24-2024',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    id,
    true,
    false
FROM categories WHERE name = 'Electronics'
UNION ALL
SELECT 
    'MacBook Air M3',
    'Lightweight and powerful laptop',
    119999,
    30,
    'MBA-M3-2024',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    id,
    false,
    true
FROM categories WHERE name = 'Electronics'
UNION ALL
SELECT 
    'Dell XPS 15',
    'High-performance Windows laptop',
    149999,
    25,
    'DXPS15-2024',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
    id,
    false,
    false
FROM categories WHERE name = 'Electronics'
UNION ALL
SELECT 
    'Casual T-Shirt',
    'Comfortable cotton t-shirt',
    999,
    100,
    'TSHIRT-001',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    id,
    false,
    true
FROM categories WHERE name = 'Clothing'
UNION ALL
SELECT 
    'Denim Jeans',
    'Classic blue jeans',
    2499,
    75,
    'JEANS-001',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    id,
    true,
    false
FROM categories WHERE name = 'Clothing'
ON CONFLICT (product_code) DO NOTHING;
```

### Option 2: Update Existing Products with Placeholder Images

If you already have products but images are missing, run this:

```sql
-- Update products with no images to use a generic placeholder
UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
WHERE image_url IS NULL OR image_url = '';
```

### Option 3: Add Products via Admin Panel

1. Go to Product Management in admin panel
2. Click "Add New Product"
3. Use these free image URLs from Unsplash:
   - Electronics: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500`
   - Clothing: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500`
   - Home: `https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500`

## Why Unsplash URLs?

- ✅ Free to use
- ✅ High-quality images
- ✅ Reliable CDN
- ✅ No authentication required
- ✅ Works globally

## Alternative Free Image Services

If Unsplash doesn't work, try:

1. **Picsum Photos** (Lorem Ipsum for photos)
   ```
   https://picsum.photos/500/500
   ```

2. **Placeholder.com**
   ```
   https://via.placeholder.com/500x500
   ```

3. **ImgPlaceholder**
   ```
   https://imgplaceholder.com/500x500
   ```

## Verify the Fix

After adding products:

1. Go to your homepage
2. Check if featured products show images
3. Go to Product Listing page
4. Verify all products display images

## If Images Still Don't Show

### Check Browser Console

1. Press F12 to open DevTools
2. Go to Console tab
3. Look for image loading errors
4. Share any errors you see

### Check Network Tab

1. Press F12 → Network tab
2. Reload the page
3. Filter by "Img"
4. Check which images are failing to load

### Common Issues

1. **CORS Errors**: Some image hosts block cross-origin requests
   - Solution: Use Unsplash or Picsum instead

2. **404 Errors**: Image URLs are broken
   - Solution: Update with valid URLs

3. **Blocked by Firewall**: Network blocking external images
   - Solution: Check firewall/proxy settings

## Long-term Solution

For a production website, you should:

1. **Use Supabase Storage**
   - Upload images to your Supabase project
   - Get permanent URLs
   - Full control over images

2. **Set up Supabase Storage:**
   ```sql
   -- Create a storage bucket for product images
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('product-images', 'product-images', true);
   ```

3. **Upload images via Supabase Dashboard:**
   - Go to Storage → Create bucket
   - Upload product images
   - Get public URLs
   - Use those URLs in your products

## Quick Test

Run this in your browser console on the NexBuy website:

```javascript
// Check how many products have images
fetch('https://jifjjzaofphtebzdwicy.supabase.co/rest/v1/products?select=id,name,image_url', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Total products:', data.length);
  console.log('Products with images:', data.filter(p => p.image_url).length);
  console.log('Products without images:', data.filter(p => !p.image_url).length);
});
```

## Summary

1. ✅ Add sample products with Unsplash image URLs
2. ✅ Or update existing products with valid image URLs  
3. ✅ Verify images display correctly
4. 📸 For production: Set up Supabase Storage for permanent image hosting
