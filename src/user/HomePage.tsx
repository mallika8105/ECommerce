import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <header className="hero-banner">
        <div className="hero-content">
          <div className="hero-left"></div>
          <div className="hero-middle">
            <h1>Welcome to Our Modern Store</h1>
            <p>Discover amazing products and exclusive offers.</p>
            <button className="cta-button">Shop Now</button>
          </div>
          <div className="hero-right"></div>
        </div>
      </header>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="product-card">
              <div className="product-image">
                <span>Product Image</span>
              </div>
              <div className="product-info">
                <h3>Product Name {item}</h3>
                <p className="price">₹{(item * 999).toFixed(2)}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-list">
          {['Ethnic Wear', 'Designer Collection', 'Festive Special', 'Casual Wear'].map((cat) => (
            <div key={cat} className="category-item">
              {cat}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
