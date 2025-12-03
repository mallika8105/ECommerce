import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import './FeaturedProductsSection.css'; // Import the custom CSS file

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string; // Changed to match database column name
  rating?: number;
}

interface FeaturedProductsSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ 
  products, 
  onAddToCart,
  onProductClick 
}) => {
  const productsToDisplay = products.slice(0, 4);

  return (
    <section className="featured-products-section">
      <div className="featured-products-container">
        <div className="featured-products-header">
          <h2>Featured Products</h2>
          <p>Discover our handpicked selection of premium items</p>
        </div>

        <div className="featured-products-content">
          {/* Left Side: Image */}
          <div className="featured-products-left">
            <div className="featured-image-container">
              <img
                src="/FeaturedProductLeftImage.png"
                alt="Featured Product Promotion"
                className="featured-left-image"
              />
            </div>
          </div>

          {/* Right Side: Product Cards */}
          <div className="featured-products-right">
            <div className="featured-products-grid">
            {productsToDisplay.length > 0 ? (
              productsToDisplay.map((product) => (
                <div
                  key={product.id}
                  className="featured-product-card"
                >
                  <div 
                    onClick={() => onProductClick(product.id)}
                    className="featured-product-image-wrapper"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="featured-product-image"
                    />
                    {product.rating && (
                      <div className="featured-product-rating-badge">
                        <Star className="featured-product-rating-icon" />
                        <span className="featured-product-rating-value">{product.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="featured-product-info">
                    <h3 
                      onClick={() => onProductClick(product.id)}
                      className="featured-product-name"
                    >
                      {product.name}
                    </h3>
                    <div className="featured-product-price-wrapper">
                      <p className="featured-product-price">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="featured-add-to-cart-btn"
                    >
                      <ShoppingCart className="icon" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-featured-products">
                <p>No featured products available</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
