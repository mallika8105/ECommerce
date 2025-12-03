import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Card from './Card';
import './ProductCard.css'; // Assuming a CSS file for ProductCard styling

interface Product {
  id: string; // Changed from number to string
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
  rank?: number; // Make rank optional in case it's not always provided
}

const ProductCard: React.FC<ProductCardProps> = ({ product, rank }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log('ProductCard: Navigating to:', `/products/${product.id}`, 'with ID:', product.id); // More detailed debug log
    navigate(`/products/${product.id}`); // Navigate to product details page (corrected to plural 'products')
  };

  return (
    <Card className="product-card" onClick={handleCardClick}>
      {rank && <div className="product-rank">#{rank}</div>}
      <div className="product-card-image-container">
        <img src={product.image} alt={product.name} className="product-card-image" />
      </div>
      <div className="product-card-details">
        <h3 className="product-card-name">
          <a href={`/products/${product.id}`} onClick={handleCardClick} className="product-name-link">
            {product.name}
          </a>
        </h3>
        <p className="product-card-price">₹{product.price.toLocaleString('en-IN')}</p>
        <div className="product-card-rating">
          {'⭐'.repeat(Math.floor(product.rating))} ({product.reviews} reviews)
        </div>
        {/* Removed "View Details" button */}
      </div>
    </Card>
  );
};
export default ProductCard;
