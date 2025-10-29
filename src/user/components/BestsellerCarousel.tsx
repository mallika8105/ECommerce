// BestsellerCarousel.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import './BestsellerCarousel.css'; // Import the CSS file

const DESKTOP_ITEMS_PER_VIEW = 5;
const products = [
  // ... (Your existing products array remains the same)
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 10999,
    originalPrice: 16999,
    rating: 4.8,
    reviews: 2847,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 20999,
    originalPrice: 29999,
    rating: 4.9,
    reviews: 1923,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    badge: "Trending"
  },
  {
    id: 3,
    name: "Leather Crossbody Bag",
    price: 7499,
    originalPrice: 12999,
    rating: 4.7,
    reviews: 3421,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
    badge: "Hot"
  },
  {
    id: 4,
    name: "Minimalist Desk Lamp",
    price: 4999,
    originalPrice: 8999,
    rating: 4.6,
    reviews: 1542,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    badge: "New"
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug Set",
    price: 2999,
    originalPrice: 4999,
    rating: 4.9,
    reviews: 4231,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
    badge: "Popular"
  }
];

const viewBreakpoints = {
  mobile: 1, // < 768px
  tablet: 2, // 768px to < 1024px
  desktop: DESKTOP_ITEMS_PER_VIEW // >= 1024px
};

export default function BestsellerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(DESKTOP_ITEMS_PER_VIEW);

  const calculateItemsPerView = () => {
    if (typeof window === 'undefined') return viewBreakpoints.desktop;
    
    if (window.innerWidth < 768) return viewBreakpoints.mobile;
    if (window.innerWidth < 1024) return viewBreakpoints.tablet;
    return viewBreakpoints.desktop;
  };
  
  useEffect(() => {
    setItemsPerView(calculateItemsPerView());

    const handleResize = () => {
      const newItemsPerView = calculateItemsPerView();
      if (newItemsPerView !== itemsPerView) {
        setItemsPerView(newItemsPerView);
        // Reset to first slide if view size changes
        setCurrentIndex(0); 
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  const nextSlide = () => {
    const maxIndex = products.length - itemsPerView;
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const totalSlides = Math.max(0, products.length - itemsPerView + 1);
  
  // Translation for moving one card slot at a time
  const finalTranslateX = currentIndex * (100 / itemsPerView); 

  return (
    <div className="carousel-container">
      {/* Header */}
      <div className="carousel-header">
        <h2>Bestsellers</h2>
        <p>Discover our most loved products</p>
      </div>

      {/* Carousel Wrapper */}
      <div className="carousel-wrapper">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="nav-button prev-button"
          aria-label="Previous products"
        >
          <ChevronLeft className="icon" />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= products.length - itemsPerView}
          className="nav-button next-button"
          aria-label="Next products"
        >
          <ChevronRight className="icon" />
        </button>

        {/* Products Carousel - Single Row */}
        <div className="products-track-window">
          <div
            className="products-track"
            style={{ transform: `translateX(-${finalTranslateX}%)` }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className={`product-card item-view-${itemsPerView}`}
              >
                {/* Image Container */}
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <span className="product-badge">
                    {product.badge}
                  </span>
                  <button className="add-to-cart-quick">
                    <ShoppingCart className="icon" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="product-info">
                  <h3 className="product-name">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="product-rating">
                    <Star className="star-icon" />
                    <span className="rating-value">
                      {product.rating}
                    </span>
                    <span className="review-count">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="product-price">
                    <span className="current-price">
                      ₹ {product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="original-price">
                      ₹ {product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="add-to-cart-btn">
                    <ShoppingCart className="icon-sm" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
