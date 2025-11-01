import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ProductListing.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
  size_chart?: string;
  color?: string;
}

interface ProductListingProps {
  categoryId?: string;
  subcategoryId?: string;
}

const ProductListing: React.FC<ProductListingProps> = ({ categoryId: propCategoryId, subcategoryId: propSubcategoryId }) => {
  const { categoryId: paramCategoryId, subcategoryId: paramSubcategoryId } = useParams<{ categoryId?: string; subcategoryId?: string }>();

  const currentCategoryId = propCategoryId || paramCategoryId;
  const currentSubcategoryId = propSubcategoryId || paramSubcategoryId;

  const [products, setProducts] = useState<Product[]>([]);
  const [subcategoryName, setSubcategoryName] = useState<string>(''); // 🆕 store subcategory name
  const [categoryName, setCategoryName] = useState<string>(''); // 🆕 store category name
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // 🆕 Fetch subcategory name or category name for heading
  useEffect(() => {
    const fetchNames = async () => {
      try {
        if (currentSubcategoryId) {
          // Fetch subcategory details including its parent category_id
          const { data: subcatData, error: subcatError } = await supabase
            .from('subcategories')
            .select('name, category_id') // Select both name and category_id
            .eq('id', currentSubcategoryId)
            .single();

          if (subcatError) throw subcatError;
          setSubcategoryName(subcatData.name);

          // Now fetch the parent category name using category_id
          if (subcatData.category_id) {
            const { data: catData, error: catError } = await supabase
              .from('categories')
              .select('name')
              .eq('id', subcatData.category_id)
              .single();
            if (catError) throw catError;
            setCategoryName(catData.name);
          }
        } else if (currentCategoryId) {
          const { data, error } = await supabase
            .from('categories')
            .select('name')
            .eq('id', currentCategoryId)
            .single();
          if (error) throw error;
          setCategoryName(data.name);
        }
      } catch (err: any) {
        console.error('Error fetching category/subcategory name:', err.message);
      }
    };

    fetchNames();
  }, [currentSubcategoryId, currentCategoryId]);

  // Fetch products (same as before)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('products').select('*');

        if (currentSubcategoryId) {
          query = query.eq('subcategory_id', currentSubcategoryId);
        } else if (currentCategoryId) {
          query = query.eq('category_id', currentCategoryId);
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        const productsWithImages = (data || []).map((product: any) => ({
          ...product,
          image_url: product.image_url || 'https://via.placeholder.com/150?text=No+Image',
        }));

        setProducts(productsWithImages);
      } catch (err: any) {
        setError(`Failed to fetch products: ${err.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategoryId, currentSubcategoryId]);

  // 🆕 Heading logic
  const headingText = currentSubcategoryId
    ? `${categoryName} – ${subcategoryName}` // Use fetched categoryName
    : categoryName
    ? `${categoryName}` // Just categoryName for category page
    : 'Shop All Products';

  return (
    <div className="product-listing-container">
      <main className="product-listing-main">
        <h1 className="product-listing-title">{headingText}</h1>

        {loading ? (
          <p className="loading-message">Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <Card key={product.id} className="product-card">
                <Link to={`/products/${product.id}`}>
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
                </Link>
                <p className="product-description">{product.description}</p>
                {product.color && <p className="product-color">Color: {product.color}</p>}
                {product.size_chart && <p className="product-size-chart">Size Chart: {product.size_chart}</p>}
                <div className="product-actions">
                  <Button variant="primary" size="small" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="no-products-found">No products found in this category.</p>
        )}
      </main>
    </div>
  );
};

export default ProductListing;
