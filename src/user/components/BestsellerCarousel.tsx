// BestsellerCarousel.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../context/CartContext";
import SkeletonCard from "../../components/SkeletonCard";
import "./BestsellerCarousel.css";

const DESKTOP_ITEMS_PER_VIEW = 5;

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  product_code?: string;
  rating?: number;
  is_bestseller?: boolean;
}

const viewBreakpoints = {
  mobile: 1,
  tablet: 2,
  desktop: DESKTOP_ITEMS_PER_VIEW,
};

export default function BestsellerCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(DESKTOP_ITEMS_PER_VIEW);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch bestselling products
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_bestseller', true)
          .eq('is_active', true)
          .limit(10);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const calculateItemsPerView = () => {
    if (typeof window === "undefined") return viewBreakpoints.desktop;

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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      product_code: product.product_code,
      quantity: 1
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="carousel-container">
        <div className="carousel-header">
          <h2>Bestsellers</h2>
          <p>Discover our most loved products</p>
        </div>
        <div className="carousel-wrapper">
          <div className="products-track-window">
            <div className="products-track">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`product-card item-view-${itemsPerView}`}
                >
                  <SkeletonCard />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-header">
          <h2>Bestsellers</h2>
          <p>No bestselling products available</p>
        </div>
      </div>
    );
  }

  const totalSlides = Math.max(0, products.length - itemsPerView + 1);
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
                <div 
                  className="product-image-container"
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                  />
                  {product.is_bestseller && (
                    <span className="product-badge">Bestseller</span>
                  )}
                  <button 
                    className="add-to-cart-quick"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="icon" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="product-info">
                  <h3 
                    className="product-name"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="product-rating">
                      <Star className="star-icon" />
                      <span className="rating-value">{product.rating}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="product-price">
                    <span className="current-price">
                      ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
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
              className={`dot ${idx === currentIndex ? "active" : ""}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
