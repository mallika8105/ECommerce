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

  const formatIndianCurrency = (price: number) => {
    const parts = price.toFixed(2).split('.');
    let integerPart = parts[0];
    if (integerPart.length > 3) {
      let lastThree = integerPart.substring(integerPart.length - 3);
      let otherNumbers = integerPart.substring(0, integerPart.length - 3);
      if (otherNumbers.length > 0) {
        lastThree = ',' + lastThree;
      }
      integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    }
    return `₹ ${integerPart}${parts.length > 1 ? '.' + parts[1] : ''}`;
  };

  const handleCardClick = () => {
    console.log('ProductCard: Navigating to:', `/products/${product.id}`, 'with ID:', product.id); // More detailed debug log
    navigate(`/products/${product.id}`); // Navigate to product details page (corrected to plural 'products')
  };

  return (
    <Card className="product-card" onClick={handleCardClick}> {/* Make the entire card clickable */}
      {rank && <div className="product-rank">#{rank}</div>}
      <img src={product.image} alt={product.name} className="product-card-image" />
      <div className="product-card-details">
        <h3 className="product-card-name">
          <a href={`/products/${product.id}`} onClick={handleCardClick} className="product-name-link">
            {product.name}
          </a>
        </h3>
        <p className="product-card-price">{formatIndianCurrency(product.price)}</p>
        <div className="product-card-rating">
          {'⭐'.repeat(Math.floor(product.rating))} ({product.reviews} reviews)
        </div>
        {/* Removed "View Details" button */}
      </div>
    </Card>
  );
};
export default ProductCard;
