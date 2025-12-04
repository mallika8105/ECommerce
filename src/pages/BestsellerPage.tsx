import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../pages/BestsellerPage.css';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import SkeletonCard from '../components/SkeletonCard';
import Loader from '../components/Loader';

interface Product {
  id: string;
  name: string;
  image_url: string;
  price: number;
  rating?: number;
  is_bestseller?: boolean;
}

const BestsellerPage: React.FC = () => {
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_bestseller', true)
          .eq('is_active', true);

        if (error) throw error;
        setBestsellerProducts(data || []);
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  if (loading) {
    return (
      <div className="bestseller-page">
        <h1>Bestsellers</h1>
        <div className="bestseller-products-grid">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bestseller-page">
      <h1>Bestsellers</h1>
      {bestsellerProducts.length === 0 ? (
        <p>No bestselling products available.</p>
      ) : (
        <div className="bestseller-products-grid">
          {bestsellerProducts.map((product, index) => (
            <div key={product.id} className="product-card-wrapper">
              <ProductCard
                product={{
                  id: product.id,
                  name: product.name,
                  image: product.image_url,
                  price: product.price,
                  rating: product.rating || 0,
                  reviews: 0
                }}
                rank={index + 1}
              />
              <div className="product-actions">
                <Link to={`/product/${product.id}`}>
                  <Button variant="secondary" size="small">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestsellerPage;
