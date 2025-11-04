-- Sample Data for NexBuy E-commerce Platform
-- Run this AFTER running migration 002_add_is_active_column_FIXED.sql
-- This will populate your database with test data

-- =============================================
-- 1. SAMPLE CATEGORIES
-- =============================================

INSERT INTO public.categories (name, description, display_order, is_active) VALUES
('Electronics', 'Electronic devices and gadgets', 1, true),
('Fashion', 'Clothing and accessories', 2, true),
('Home & Kitchen', 'Home appliances and kitchen items', 3, true),
('Books', 'Books and educational materials', 4, true),
('Sports', 'Sports equipment and fitness', 5, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 2. SAMPLE SUBCATEGORIES
-- =============================================

-- Electronics subcategories
INSERT INTO public.subcategories (category_id, name, description, display_order, is_active)
SELECT id, 'Smartphones', 'Mobile phones and accessories', 1, true
FROM public.categories WHERE name = 'Electronics'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (category_id, name, description, display_order, is_active)
SELECT id, 'Laptops', 'Laptops and notebooks', 2, true
FROM public.categories WHERE name = 'Electronics'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (category_id, name, description, display_order, is_active)
SELECT id, 'Headphones', 'Audio devices', 3, true
FROM public.categories WHERE name = 'Electronics'
ON CONFLICT DO NOTHING;

-- Fashion subcategories
INSERT INTO public.subcategories (category_id, name, description, display_order, is_active)
SELECT id, 'Men''s Clothing', 'Clothing for men', 1, true
FROM public.categories WHERE name = 'Fashion'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (category_id, name, description, display_order, is_active)
SELECT id, 'Women''s Clothing', 'Clothing for women', 2, true
FROM public.categories WHERE name = 'Fashion'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (category_id, name, description, display_order, is_active)
SELECT id, 'Shoes', 'Footwear for all', 3, true
FROM public.categories WHERE name = 'Fashion'
ON CONFLICT DO NOTHING;

-- Home & Kitchen subcategories
INSERT INTO public.subcategories (category_id, name, description, display_order, is_active)
SELECT id, 'Kitchen Appliances', 'Small and large kitchen appliances', 1, true
FROM public.categories WHERE name = 'Home & Kitchen'
ON CONFLICT DO NOTHING;

INSERT INTO public.subcategories (category_id, name, description, display_order, is_active)
SELECT id, 'Home Decor', 'Decorative items for home', 2, true
FROM public.categories WHERE name = 'Home & Kitchen'
ON CONFLICT DO NOTHING;

-- =============================================
-- 3. SAMPLE PRODUCTS
-- =============================================

-- Electronics Products
INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_featured, is_bestseller, discount_percentage
)
SELECT 
    'iPhone 15 Pro', 
    'Latest iPhone with advanced features', 
    99999.00, 
    25, 
    'ELEC-IP15P-001',
    'https://m.media-amazon.com/images/I/81SigpJN1KL._SX679_.jpg',
    id,
    true,
    true,
    true,
    10
FROM public.categories WHERE name = 'Electronics'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_featured, is_bestseller
)
SELECT 
    'MacBook Air M2', 
    'Lightweight laptop with M2 chip', 
    114900.00, 
    15, 
    'ELEC-MBA-M2-001',
    'https://m.media-amazon.com/images/I/71vFKBpKakL._SX679_.jpg',
    id,
    true,
    true,
    false
FROM public.categories WHERE name = 'Electronics'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_bestseller, discount_percentage
)
SELECT 
    'Sony WH-1000XM5', 
    'Premium noise-cancelling headphones', 
    29990.00, 
    40, 
    'ELEC-SONY-WH5-001',
    'https://m.media-amazon.com/images/I/51QeS0jCLYL._SX522_.jpg',
    id,
    true,
    true,
    15
FROM public.categories WHERE name = 'Electronics'
ON CONFLICT (product_code) DO NOTHING;

-- Fashion Products
INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_featured
)
SELECT 
    'Men''s Casual Shirt', 
    'Comfortable cotton casual shirt', 
    1299.00, 
    100, 
    'FASH-MCS-001',
    'https://m.media-amazon.com/images/I/71VWnSAvpJL._AC_UL480_FMwebp_QL65_.jpg',
    id,
    true,
    false
FROM public.categories WHERE name = 'Fashion'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_bestseller, discount_percentage
)
SELECT 
    'Women''s Kurta', 
    'Elegant women kurta', 
    1399.00, 
    75, 
    'FASH-WK-001',
    'https://m.media-amazon.com/images/I/71VWnSAvpJL._AC_UL480_FMwebp_QL65_.jpg',
    id,
    true,
    true,
    20
FROM public.categories WHERE name = 'Fashion'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_featured
)
SELECT 
    'Running Shoes', 
    'Lightweight running shoes', 
    2999.00, 
    60, 
    'FASH-RS-001',
    'https://alexnld.com/wp-content/uploads/2019/02/b0d010b6-b667-4a8c-9921-b0365ed776cb.jpg',
    id,
    true,
    true
FROM public.categories WHERE name = 'Fashion'
ON CONFLICT (product_code) DO NOTHING;

-- Home & Kitchen Products
INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, discount_percentage
)
SELECT 
    'Air Fryer', 
    '5L digital air fryer', 
    4999.00, 
    30, 
    'HOME-AF-001',
    'https://m.media-amazon.com/images/I/61s1DECT8RL._SX679_.jpg',
    id,
    true,
    25
FROM public.categories WHERE name = 'Home & Kitchen'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_bestseller
)
SELECT 
    'Wall Clock', 
    'Modern wall clock', 
    899.00, 
    45, 
    'HOME-WC-001',
    'https://m.media-amazon.com/images/I/71pCH-mzpJL._SX679_.jpg',
    id,
    true,
    false
FROM public.categories WHERE name = 'Home & Kitchen'
ON CONFLICT (product_code) DO NOTHING;

-- Books
INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_featured
)
SELECT 
    'The Alchemist', 
    'Bestselling novel by Paulo Coelho', 
    299.00, 
    200, 
    'BOOK-ALC-001',
    'https://m.media-amazon.com/images/I/51Z0nLAfLmL._SX331_BO1,204,203,200_.jpg',
    id,
    true,
    true
FROM public.categories WHERE name = 'Books'
ON CONFLICT (product_code) DO NOTHING;

-- Sports
INSERT INTO public.products (
    name, description, price, stock, product_code, image_url, 
    category_id, is_active, is_bestseller, discount_percentage
)
SELECT 
    'Yoga Mat', 
    'Non-slip yoga mat', 
    799.00, 
    80, 
    'SPORT-YM-001',
    'https://m.media-amazon.com/images/I/71vMQf1yMKL._SX679_.jpg',
    id,
    true,
    true,
    10
FROM public.categories WHERE name = 'Sports'
ON CONFLICT (product_code) DO NOTHING;

-- =============================================
-- VERIFICATION
-- =============================================

DO $$
DECLARE
    cat_count INTEGER;
    sub_count INTEGER;
    prod_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO cat_count FROM public.categories;
    SELECT COUNT(*) INTO sub_count FROM public.subcategories;
    SELECT COUNT(*) INTO prod_count FROM public.products;
    
    RAISE NOTICE '═══════════════════════════════════════';
    RAISE NOTICE '✓ Sample Data Loaded Successfully!';
    RAISE NOTICE '  Categories: %', cat_count;
    RAISE NOTICE '  Subcategories: %', sub_count;
    RAISE NOTICE '  Products: %', prod_count;
    RAISE NOTICE '═══════════════════════════════════════';
END $$;

-- =============================================
-- HELPFUL QUERIES FOR TESTING
-- =============================================

-- View all active products with categories
-- SELECT p.name, p.price, c.name as category 
-- FROM products p 
-- JOIN categories c ON p.category_id = c.id 
-- WHERE p.is_active = true;

-- View featured products
-- SELECT name, price, discount_percentage 
-- FROM products 
-- WHERE is_featured = true AND is_active = true;

-- View bestsellers
-- SELECT name, price 
-- FROM products 
-- WHERE is_bestseller = true AND is_active = true;
