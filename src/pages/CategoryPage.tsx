import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import supabase client
import './CategoryPage.css'; // Create this CSS file later

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string; // Changed to match database column name
  category_id?: string; // Added category_id
}

interface Category {
  id: string;
  name: string;
}

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>(); // Get categoryId from URL
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>('Category');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch category details
        if (categoryId) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('name')
            .eq('id', categoryId)
            .single();

          if (categoryError) {
            // It's better to check for a specific error code if Supabase provides one for "not found"
            // For now, we'll assume any error here could mean the category is not found.
            setCategoryName('Category Not Found');
            setProducts([]);
            setLoading(false);
            return;
          }
          if (categoryData) {
            setCategoryName((categoryData as Category).name); // Explicitly cast to Category interface
          } else {
            setCategoryName('Category Not Found');
            setProducts([]);
            setLoading(false);
            return;
          }
        }

        // Fetch products for the category
        let query = supabase
          .from('products')
          .select('*');

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        const { data: productsData, error: productsError } = await query;

        if (productsError) {
          throw new Error(productsError.message);
        }

        const fetchedProducts = productsData || [];
        
        // Ensure all fetched products have an image_url, assign a placeholder if missing
        const productsWithImages = fetchedProducts.map((product: any) => ({
          ...product,
          image_url: product.image_url || 'https://via.placeholder.com/150?text=No+Image' // Placeholder image
        }));
        
        setProducts(productsWithImages);
        setError(null);

      } catch (err: any) {
        setError(`Failed to fetch data: ${err.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categoryId]); // Re-run effect when categoryId changes

  if (loading) {
    return (
      <div className="category-page-container">
        <main className="category-page-main flex justify-center items-center">
          <p className="loading-message">Loading products...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page-container">
        <main className="category-page-main flex justify-center items-center">
          <p className="error-message">Error: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="category-page-container">
      <main className="category-page-main">
        <h1 className="category-page-title">{categoryName}</h1>
        {products.length > 0 ? (
            <div className="product-grid">
            {products.map((product) => (
              <Card key={product.id} className="product-card">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <h3 className="product-name">{product.name}</h3>
                </Link>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <Button variant="primary" onClick={() => addToCart(product)}>Add to Cart</Button>
              </Card>
            ))}
            </div>
          ) : (
            <p className="no-products-found">No products found for this category.</p>
          )}
      </main>
    </div>
  );
};

export default CategoryPage;
