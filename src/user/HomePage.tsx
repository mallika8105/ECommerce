import React from 'react';
import './HomePage.css'; // Assuming HomePage.css will be created

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <header className="hero-banner">
        <h1>Welcome to Our Modern Store</h1>
        <p>Discover amazing products and exclusive offers.</p>
        <button className="cta-button">Shop Now</button>
      </header>

      <section className="featured-products">
        <h2>Featured Products</h2>
        {/* Placeholder for featured product components */}
        <div className="product-grid">
          <div className="product-card">
            <img src="placeholder-image.jpg" alt="Product 1" />
            <h3>Product Name 1</h3>
            <p>$19.99</p>
            <button>Add to Cart</button>
          </div>
          <div className="product-card">
            <img src="placeholder-image.jpg" alt="Product 2" />
            <h3>Product Name 2</h3>
            <p>$29.99</p>
            <button>Add to Cart</button>
          </div>
          {/* More product cards */}
        </div>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-list">
          <div className="category-item">Electronics</div>
          <div className="category-item">Clothing</div>
          <div className="category-item">Home Goods</div>
          {/* More categories */}
        </div>
      </section>

      <section className="limited-time-offers">
        <h2>Limited Time Offers</h2>
        <p>Special discounts available now!</p>
        {/* Placeholder for offer details */}
      </section>
    </div>
  );
};

export default HomePage;
