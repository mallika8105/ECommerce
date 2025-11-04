import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FeaturedProductsSection } from '../components/FeaturedProductsSection';
import BestsellerCarousel from '../user/components/BestsellerCarousel';
import { supabase } from '../supabaseClient';
import SkeletonCard from '../components/SkeletonCard';
import './HomePage.css';
import Hero from './Hero';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  rating: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  rating?: number;
  is_featured?: boolean;
}

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .eq('is_active', true)
          .limit(4);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const testimonials: Testimonial[] = [
    {
      id: 't1',
      quote: "Amazing products and fast shipping! Highly recommend.",
      author: "- Jane Doe",
      rating: 5,
    },
    {
      id: 't2',
      quote: "I love shopping here. Great customer service and quality items.",
      author: "- John Smith",
      rating: 4,
    },
    {
      id: 't3',
      quote: "Fantastic selection and excellent prices. Will definitely buy again!",
      author: "- Emily White",
      rating: 5,
    },
    {
      id: 't4',
      quote: "The best online store for unique finds. So happy with my purchases.",
      author: "- Michael Brown",
      rating: 5,
    },
    {
      id: 't5',
      quote: "Quick delivery and the product was exactly as described. Very satisfied.",
      author: "- Sarah Johnson",
      rating: 4,
    },
    {
      id: 't6',
      quote: "A wonderful shopping experience from start to finish. Highly recommended!",
      author: "- David Lee",
      rating: 5,
    },
    {
      id: 't7',
      quote: "Great quality and stylish products. I always find something I love.",
      author: "- Olivia Green",
      rating: 4,
    },
    {
      id: 't8',
      quote: "Customer support was very helpful. Resolved my issue quickly and efficiently.",
      author: "- Robert Black",
      rating: 3,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "star filled" : "star"}>&#9733;</span>
        ))}
      </div>
    );
  };

  return (
    <div className="homepage-container">
      <main className="homepage-main">
        <Hero />

        {/* Featured Products Section */}
        {loading ? (
          <section className="featured-products-section">
            <div className="featured-products-container">
              <div className="featured-products-header">
                <h2>Featured Products</h2>
                <p>Discover our handpicked selection of premium items</p>
              </div>
              <div className="featured-products-content">
                <div className="featured-products-left">
                  <div className="featured-image-container">
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }} />
                  </div>
                </div>
                <div className="featured-products-right">
                  <div className="featured-products-grid">
                    {[...Array(4)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <FeaturedProductsSection
            products={products}
            onAddToCart={addToCart}
            onProductClick={(productId) => navigate(`/product/${productId}`)}
          />
        )}

        <BestsellerCarousel />

        {/* Testimonials */}
        <section className="testimonials-section">
          <h2 className="testimonials-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="testimonial-card">
                {renderStars(testimonial.rating)}
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <p className="testimonial-author">{testimonial.author}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
