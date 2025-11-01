import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import './BestsellerPage.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
}

const Bestseller: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBestsellers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_bestseller', true); // Ensure you have this column in DB

        if (error) throw error;
        setProducts(data || []);
      } catch (err: any) {
        setError(`Failed to load bestsellers: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  if (loading) {
    return (
      <div className="bestseller-page">
        <h1>Loading Bestsellers...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bestseller-page">
        <h1>Error Loading Products</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bestseller-page">
      <h1>Our Bestsellers</h1>
      <div className="bestseller-products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bestseller-product-card">
              <img
                src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p className="price">₹{product.price.toFixed(2)}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No bestsellers found.</p>
        )}
      </div>
    </div>
  );
};

export default Bestseller;
