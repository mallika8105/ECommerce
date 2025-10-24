import React from 'react'; // Removed useState as it's not used
import Card from '../components/Card';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FeaturedProductsSection } from '../components/FeaturedProductsSection'; // Import the new component
import BestsellerCarousel from '../user/components/BestsellerCarousel'; // 
import './HomePage.css'; // Import the custom CSS file
import Hero from './Hero'; // Import the new Hero component

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  rating: number;
}

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const products = [
    {
      id: '1',
      name: 'Elegant Women kurta',
      price: 1399,
      image_url: 'https://m.media-amazon.com/images/I/71VWnSAvpJL._AC_UL480_FMwebp_QL65_.jpg',
    },
    {
      id: '2',
      name: 'Wedge Sandals',
      price: 2999,
      image_url: 'https://alexnld.com/wp-content/uploads/2019/02/b0d010b6-b667-4a8c-9921-b0365ed776cb.jpg',
    },
    {
      id: '3',
      name: 'Silver Gold plated Pendant Earings and Chains',
      price: 4566.45,
      image_url: 'https://m.media-amazon.com/images/I/61ZspiGgbRL._SX679_.jpg',
    },
    {
      id: '4',
      name: 'Stylish Men\'s Watch',
      price: 3499.00,
      image_url: 'https://m.media-amazon.com/images/I/713cTuz4U7L._SY575_.jpg',
    },
  ];

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
        <FeaturedProductsSection
          products={products}
          onAddToCart={addToCart}
          onProductClick={(productId) => navigate(`/product/${productId}`)}
        />

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
