import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming react-router-dom is used for routing
import ReviewsSection from './ReviewsSection'; // Import ReviewsSection component

// Placeholder for product data structure
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  ingredients?: string; // Optional fields for more detail
  specs?: string;
  reviews?: { user: string; rating: number; comment: string; date: string }[]; // Added date to review interface
}

interface ProductDetailPageProps {
  onAddToCart: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Mock API call to fetch product details
  useEffect(() => {
    if (!id) {
      // Handle case where id is undefined (e.g., invalid URL)
      setProduct(null);
      return;
    }

    // In a real application, this would be an API call using the product ID
    const mockProducts: Product[] = [
      { id: 1, name: 'Organic Cotton T-Shirt', price: 25.00, category: 'Apparel', imageUrl: 'https://via.placeholder.com/500x400/ADD8E6/000000?text=T-Shirt', description: 'Soft and breathable organic cotton t-shirt. Made from 100% GOTS certified organic cotton.', ingredients: '100% Organic Cotton', specs: 'Weight: 180gsm, Fit: Regular', reviews: [{ user: 'Alice', rating: 5, comment: 'So soft and comfortable!', date: '2025-01-15' }] },
      { id: 2, name: 'Running Shoes', price: 80.00, category: 'Footwear', imageUrl: 'https://via.placeholder.com/500x400/90EE90/000000?text=Running+Shoes', description: 'Lightweight and comfortable running shoes designed for performance.', specs: 'Material: Mesh, Sole: Rubber, Weight: 250g', reviews: [{ user: 'Bob', rating: 4, comment: 'Great for my daily runs.', date: '2025-02-20' }] },
      { id: 3, name: 'Ceramic Coffee Mug', price: 15.00, category: 'Home Goods', imageUrl: 'https://via.placeholder.com/500x400/FFD700/000000?text=Mug', description: 'Durable ceramic mug for your morning coffee. Holds 12oz.', ingredients: 'Ceramic', specs: 'Capacity: 12oz, Dishwasher Safe: Yes', reviews: [{ user: 'Charlie', rating: 5, comment: 'Perfect size and keeps coffee warm.', date: '2025-03-10' }] },
      { id: 4, name: 'Wireless Bluetooth Headphones', price: 120.00, category: 'Electronics', imageUrl: 'https://via.placeholder.com/500x400/FFA07A/000000?text=Headphones', description: 'High-fidelity sound with active noise cancellation. Up to 20 hours battery life.', specs: 'Connectivity: Bluetooth 5.0, Battery: 20 hours, Color: Black', reviews: [{ user: 'David', rating: 5, comment: 'Amazing sound quality!', date: '2025-04-05' }] },
      { id: 5, name: 'Yoga Mat', price: 35.00, category: 'Fitness', imageUrl: 'https://via.placeholder.com/500x400/DA70D6/000000?text=Yoga+Mat', description: 'Non-slip yoga mat for your practice. Eco-friendly material.', ingredients: 'TPE (Thermoplastic Elastomer)', specs: 'Dimensions: 72" x 24", Thickness: 6mm, Color: Purple', reviews: [{ user: 'Eve', rating: 4, comment: 'Good grip, but a bit heavy.', date: '2025-05-01' }] },
      { id: 6, name: 'Leather Wallet', price: 50.00, category: 'Accessories', imageUrl: 'https://via.placeholder.com/500x400/808080/FFFFFF?text=Wallet', description: 'Genuine leather wallet with multiple card slots and a coin pocket.', ingredients: 'Genuine Leather', specs: 'Card Slots: 8, Coin Pocket: Yes, Color: Brown', reviews: [{ user: 'Frank', rating: 5, comment: 'Classic and well-made.', date: '2025-06-12' }] },
    ];
    const foundProduct = mockProducts.find(p => p.id === parseInt(id, 10));
    setProduct(foundProduct || null);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product); // Use the prop to add to cart
      alert(`Added ${quantity} x ${product.name} to cart!`);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-image-section">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-info-section">
        <h1>{product.name}</h1>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>

        <div className="product-description">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>

        {product.ingredients && (
          <div className="product-ingredients">
            <h2>Ingredients</h2>
            <p>{product.ingredients}</p>
          </div>
        )}

        {product.specs && (
          <div className="product-specs">
            <h2>Specifications</h2>
            <p>{product.specs}</p>
          </div>
        )}

        <div className="product-actions">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
          <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart</button>
        </div>

        {product.reviews && (
          <ReviewsSection
            productId={product.id}
            initialReviews={product.reviews}
            onNewReview={(id: number, review: { user: string; rating: number; comment: string; date: string }) => {
              // In a real application, this would send the new review to the backend
              console.log(`New review for product ${id}:`, review);
              // For now, we'll just update the local state (if needed, or let parent handle)
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
