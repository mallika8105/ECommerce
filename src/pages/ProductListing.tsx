import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import { supabase } from '../supabaseClient';
import Loader from '../components/Loader';
import './ProductListing.css'; // Import the custom CSS file

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string; // Changed to match database column name
  product_code?: string; // Product code for order items
  description?: string; // Add description
  size_chart?: string; // Add size chart
  color?: string; // Add color
}

const ProductListing: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId?: string; subcategoryId?: string }>(); // Get categoryId or subcategoryId from URL
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subcategoryName, setSubcategoryName] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Reset names first
        setSubcategoryName('');
        setCategoryName('');

        // Fetch subcategory or category name
        if (subcategoryId) {
          const { data: subcategoryData } = await supabase
            .from('subcategories')
            .select('name')
            .eq('id', subcategoryId)
            .single();
          
          if (subcategoryData) {
            setSubcategoryName(subcategoryData.name);
          }
        } else if (categoryId) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('name')
            .eq('id', categoryId)
            .single();
          
          if (categoryData) {
            setCategoryName(categoryData.name);
          }
        }

        // Fetch products
        let query = supabase
          .from('products')
          .select('*');

        // If subcategoryId is provided, filter by subcategory_id (higher priority)
        if (subcategoryId) {
          query = query.eq('subcategory_id', subcategoryId);
        } else if (categoryId) {
          query = query.eq('category_id', categoryId); // Filter by category_id if present
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        const fetchedProducts = data || [];
        
        // Ensure all fetched products have an image_url, assign a placeholder if missing
        const productsWithImages = fetchedProducts.map((product: any) => ({
          ...product,
          image_url: product.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E' // Placeholder image
        }));
        
        setProducts(productsWithImages);
        setError(null);

      } catch (err: any) {
        setError(`Failed to fetch products: ${err.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, subcategoryId]); // Re-run effect when categoryId or subcategoryId changes

  // Log the products array to debug
  products.forEach(p => console.log("Product ID:", p.id, "Name:", p.name));

  if (loading) {
    return (
      <div className="product-listing-container">
        <main className="product-listing-main flex justify-center items-center">
          <Loader text="Loading products" size="large" />
        </main>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="product-listing-container">
        <main className="product-listing-main flex justify-center items-center">
          <p className="error-message">Fatal Error: Could not load any products. {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="product-listing-container">
      <main className="product-listing-main">
  <h1 className="product-listing-title">{subcategoryName || categoryName || 'Shop All Products'}</h1>
        {error && <p className="warning-message">Warning: {error}</p>}
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} onClick={() => console.log('ProductListing: Clicking product with ID:', product.id)}> {/* Debug log */}
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </Link>
                <p className="product-description">{product.description}</p>
                {product.color && <p className="product-color">Color: {product.color}</p>}
                {product.size_chart && <p className="product-size-chart">Size Chart: {product.size_chart}</p>}
                <div className="product-actions">
                  <Button variant="primary" size="small" onClick={() => addToCart(product)}>Add to Cart</Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="no-products-found">No products found in this category.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductListing;
