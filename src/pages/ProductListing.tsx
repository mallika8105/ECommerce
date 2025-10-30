import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import { supabase } from '../supabaseClient';
import './ProductListing.css'; // Import the custom CSS file

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string; // Changed to match database column name
  description?: string; // Add description
  size_chart?: string; // Add size chart
  color?: string; // Add color
}

interface ProductListingProps {
  categoryId?: string;
  subcategoryId?: string;
}

const ProductListing: React.FC<ProductListingProps> = ({ categoryId: propCategoryId, subcategoryId: propSubcategoryId }) => {
  const { categoryId: paramCategoryId, subcategoryId: paramSubcategoryId } = useParams<{ categoryId?: string; subcategoryId?: string }>(); // Get categoryId or subcategoryId from URL
  
  // Use prop values if available, otherwise fall back to URL parameters
  const currentCategoryId = propCategoryId || paramCategoryId;
  const currentSubcategoryId = propSubcategoryId || paramSubcategoryId;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('products')
          .select('*');

        // If subcategoryId is provided, filter by subcategory_id (higher priority)
        if (currentSubcategoryId) {
          query = query.eq('subcategory_id', currentSubcategoryId);
        } else if (currentCategoryId) {
          query = query.eq('category_id', currentCategoryId); // Filter by category_id if present
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        const fetchedProducts = data || [];
        
        // Ensure all fetched products have an image_url, assign a placeholder if missing
        const productsWithImages = fetchedProducts.map((product: any) => ({
          ...product,
          image_url: product.image_url || 'https://via.placeholder.com/150?text=No+Image' // Placeholder image
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
  }, [currentCategoryId, currentSubcategoryId]); // Re-run effect when categoryId or subcategoryId changes

  // Log the products array to debug
  products.forEach(p => console.log("Product ID:", p.id, "Name:", p.name));

  if (loading) {
    return (
      <div className="product-listing-container">
        <main className="product-listing-main flex justify-center items-center">
          <p className="loading-message">Loading products...</p>
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
  <h1 className="product-listing-title">{currentSubcategoryId ? `Products in Subcategory: ${currentSubcategoryId}` : currentCategoryId ? `Products in Category: ${currentCategoryId}` : 'Shop All Products'}</h1>
        {error && <p className="warning-message">Warning: {error}</p>}
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id} className="product-card">
                <Link to={`/products/${product.id}`} onClick={() => console.log('ProductListing: Clicking product with ID:', product.id)}> {/* Debug log */}
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
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
